import { autorun, computed, observable, action } from 'mobx';
import DropboxFolderModel from './DropboxFolderModel';
import {
	addMemberToProject,
	copyProjectForUser,
	getFileDownloadLink,
	getFolderMembers,
	removeMemberFromFolder,
	createProject,
} from '../services/DropboxService';
import { saveProject } from '../services/StorageService';

const { remote, shell } = window.require('electron');
const { app } = remote;

class ProjectModel extends DropboxFolderModel implements IProject {
	@observable
	state: Project;

	@observable
	downloadLink?: string;

	constructor(store: RootStore, state: Project, persist: boolean = true) {
		super(store, { members: state.members, creator: state.creator });
		this.state = state;

		if (persist) {
			saveProject(state);
		}

		autorun(() => {
			saveProject(Object.assign({}, this.state, this.membersState));
		});

		if (this.workspace && !this.workspace.state.projectIds.includes(this.id)) {
			this.workspace.state.projectIds.push(this.id);
		}
	}

	@action.bound
	async saveNewMember() {
		if (!this.canAddMember) {
			return;
		}

		if (this.membersState.members.find(m => m.profile.team_member_id === this.newMember.member.dropbox_id)) {
			console.error(`User is already a member of ${this.state.ceprMeta.name} project.`);
			return;
		}

		await addMemberToProject(this.workspace.state, this.state, this.newMember);

		const memberProfile = <DropboxTypes.team.TeamMemberInfo>(
			this.store.userStore.members.find(m => m.profile.team_member_id === this.newMember.member.dropbox_id)
		);

		this.membersState.members.push(memberProfile);
	}

	@action.bound
	setDownloadLink(link: string) {
		this.downloadLink = link;
	}

	@computed
	get id() {
		return this.state.projectFolder.shared_folder_id;
	}

	@computed
	get currentUserIsMember() {
		return (
			!!this.membersState.members.find(m => m.profile.team_member_id === this.user.team_member_id) ||
			this.creator.team_member_id === this.user.team_member_id
		);
	}

	@computed
	get currentUserIsOwner() {
		return new Boolean(this.workspace && this.workspace.currentUserIsOwner).valueOf();
	}

	/**
	 * @TODO
	 * The correct dropbox folder should be configurable, or at leeast not hard coded
	 **/
	@computed
	get localpath() {
		return `${app.getPath('home')}/Dropbox (BBC Sandbox)/${this.path}`;
	}

	@computed
	get pathToFolder() {
		return this.currentUserIsOwner
			? `${this.state.projectFolder.path_lower}/${this.state.ceprMeta.template}`
			: `/${this.state.projectFolder.name}/${this.state.ceprMeta.template}`;
	}

	@computed
	get path() {
		return `${this.pathToFolder}/${this.state.ceprMeta.template}`;
	}

	@computed
	get parent() {
		return this.store.projectStore.projects.find(p => p.id === this.state.ceprMeta.parentId);
	}

	@computed
	get versionCount() {
		// the one is for itself
		return 1 + this.ancestors.length + this.children.length;
	}

	getAncestors(ancestors: IProject[]): IProject[] {
		const ancestor = <IProject>ancestors.slice(-1).pop();
		return ancestor.parent ? this.getAncestors(ancestors.concat(ancestor.parent)) : ancestors;
	}

	@computed
	get ancestors() {
		// because of the way we climb back up the tree
		// this returns ancestors as most recent first
		return this.parent ? this.getAncestors([this.parent]) : [];
	}

	@computed
	get children() {
		return this.store.projectStore.projects.filter(p => p.state.ceprMeta.parentId === this.id);
	}

	getDescendents(children: IProject[], descendents: IProject[] = []): IProject[] {
		return children.length
			? this.getDescendents(children.map(c => c.children).flat(), descendents.concat(children))
			: descendents;
	}

	@computed
	get descendents() {
		return this.getDescendents(this.children);
	}

	@action
	createNewVersion = async () => {
		const newItemMeta = {
			...this.state.ceprMeta,
			createdAt: new Date().toISOString(),
			parentProject: this.id,
		};

		const templatesPath = this.store.newProjectStore.projectTemplatesPath;
		const name = this.store.newProjectStore.getProjectName(
			this.workspace.state.ceprMeta.name,
			this.state.ceprMeta.name,
			this.versionCount + 1
		);

		const { error, project } = await createProject(templatesPath, name, this.workspace.state, newItemMeta);

		if (!project) {
			console.error('Project create error', JSON.stringify(error));
			return false;
		}

		this.store.projectStore.projects.push(new ProjectModel(this.store, project));
	};

	copyToUsersDropbox = async () => {
		if (!this.currentUserIsMember || !this.currentUserIsOwner) {
			console.error('User is not a member of the project.');
			return;
		}

		await copyProjectForUser(this.state.projectFolder, this.user);
	};

	createDownloadLink = async () => {
		const link = await getFileDownloadLink(
			this.workspace.creator.team_member_id,
			`${this.state.projectFolder.path_lower}/${this.state.ceprMeta.template}`
		);
		this.setDownloadLink(link);
	};

	launch = () => {
		console.log(shell.openItem(this.localpath));
	};

	@computed
	get workspace() {
		return <IWorkspace>this.store.workspaceStore.workspaces.find(w => w.id === this.state.ceprMeta.workspaceId);
	}

	@action.bound
	async removeMember(member: DropboxTypes.team.TeamMemberInfo) {
		await removeMemberFromFolder(this.state.projectFolder.shared_folder_id, member);

		this.syncMembers();
	}

	@action.bound
	async syncMembers() {
		const members = await getFolderMembers(
			this.workspace.state.creator.team_member_id,
			this.state.projectFolder.shared_folder_id
		);

		this.setMembers(
			this.store.userStore.members.filter(storeMember =>
				members.some(
					member =>
						member.user.team_member_id === storeMember.profile.team_member_id &&
						storeMember.profile.team_member_id !== this.workspace.state.creator.team_member_id
				)
			)
		);
	}
}

export default ProjectModel;
