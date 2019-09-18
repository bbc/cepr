import { action, autorun, computed, observable } from 'mobx';
import DropboxFolderModel from './DropboxFolderModel';
import { addMemberToWorkspace, getWorkspaceMembers } from '../services/DropboxService';
import { saveWorkspace } from '../services/StorageService';

class WorkspaceModel extends DropboxFolderModel implements IWorkspace {
	@observable
	state: Workspace;

	constructor(store: RootStore, workspace: Workspace, persist: boolean = true) {
		super(store, { members: workspace.members, creator: workspace.creator });
		this.state = workspace;

		if (persist) {
			saveWorkspace(this.state);
		}

		autorun(() => {
			saveWorkspace(Object.assign({}, this.state, this.membersState));
		});
	}

	@computed
	get currentUserIsOwner() {
		return this.state.creator.team_member_id === this.user.team_member_id;
	}

	@computed
	get currentUserIsMember() {
		return !!this.state.members.find(wspm => wspm.profile.team_member_id === this.user.team_member_id);
	}

	@computed
	get id() {
		return this.state.workspaceFolder.id;
	}

	@computed
	get path() {
		return `${this.state.ceprMeta.rootFolder}/${this.state.ceprMeta.name}`;
	}

	@computed
	get projectCount() {
		return this.state.projectIds.length;
	}

	@computed
	get projects() {
		return this.store.projectStore.projects.filter(p => this.state.projectIds.includes(p.id));
	}

	@action.bound
	addProject(project: IProject) {
		this.state.projectIds.push(project.id);
	}

	@action.bound
	removeMember(member: DropboxTypes.team.TeamMemberInfo) {
		console.log(member);
	}

	@action.bound
	async saveNewMember() {
		if (!this.canAddMember) {
			return;
		}

		if (this.membersState.members.find(m => m.profile.team_member_id === this.newMember.member.dropbox_id)) {
			console.error(`User is already a member of ${this.state.ceprMeta.name} workspace.`);
			return;
		}

		await addMemberToWorkspace(this.state, this.newMember);

		const memberProfile = <DropboxTypes.team.TeamMemberInfo>(
			this.store.userStore.members.find(m => m.profile.team_member_id === this.newMember.member.dropbox_id)
		);

		this.membersState.members.push(memberProfile);
	}

	@action.bound
	async syncMembers() {
		const members = await getWorkspaceMembers(this.state.creator.team_member_id, this.state.projectsRootFolder);

		this.setMembers(
			this.store.userStore.members.filter(m =>
				members.some(
					mb =>
						mb.user.team_member_id === m.profile.team_member_id &&
						m.profile.team_member_id !== this.state.creator.team_member_id
				)
			)
		);
	}
}

export default WorkspaceModel;
