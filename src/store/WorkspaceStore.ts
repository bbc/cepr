import { action, computed, observable, IObservableArray } from 'mobx';
import format from 'date-fns/format';
import { addMemberToWorkspace, createProject, createWorkspace } from '../services/DropboxService';
import { saveWorkspace, getWorkspaces } from '../services/StorageService';

export default class {
	rootStore: { userStore: UserStore };

	@observable
	newItem: WorkspaceCeprMeta = {
		rootFolder: '/cepr-root',
		name: '',
		productionTeam: '',
		folderTemplate: '',
		createdAt: undefined,
	};

	@observable
	newProject: ProjectCeprMeta = {
		workspaceId: '',
		name: '',
		template: '',
		user: undefined,
	};

	@observable
	folderTemplates?: IObservableArray<SelectOption>;

	@observable
	productionTeams?: IObservableArray<SelectOption>;

	@observable
	projectTemplates?: IObservableArray<string>;

	@observable
	workspaces: IObservableArray<Workspace>;

	workspaceAccessLevels: Array<SelectOption> = [
		{ label: 'Can edit', value: 'editor' },
		{ label: 'Read only', value: 'viewer' },
	];

	@observable
	workspaceMetadataTemplate?: string;

	@computed
	get canCreateProject() {
		return (
			this.newProject.name.length &&
			this.newProject.template.length &&
			this.newProject.user &&
			this.newProject.workspaceId.length
		);
	}

	@computed
	get newProjectWorkspace(): Workspace {
		return <Workspace>this.workspaces.find(w => w.workspaceFolder.shared_folder_id === this.newProject.workspaceId);
	}

	@computed
	get newProjectFullName() {
		if (!this.newProjectWorkspace) {
			return '';
		}

		return `${this.newProjectWorkspace.ceprMeta.name}_${this.newProject.name}_${format(new Date(), 'yy-MM-dd')}`;
	}

	@action.bound
	async createProject(onSuccess: Function = () => {}) {
		if (!this.newProjectWorkspace) {
			return false;
		}

		const { error, project } = await createProject(
			this.newProjectFullName,
			this.newProjectWorkspace,
			this.newProject
		);

		/**
		 * @TODO
		 * gonna have to handle this error
		 **/
		if (!project) {
			console.log('workspace create error', JSON.stringify(error));
			return false;
		}

		this.newProjectWorkspace.projects.push(project);
		saveWorkspace(this.newProjectWorkspace);
		this.hydrateWorkspaces();
		onSuccess(project);
	}

	get projectRootName() {
		/**
		 * @TODO
		 * This should be based upon the newItem.follderTemplate property
		 **/
		return 'Projects';
	}

	@action.bound
	async createWorkspace(onSuccess: Function) {
		const { error, workspace } = await createWorkspace(this.newItem, this.projectRootName, [
			'Media',
			'Misc',
			'Clips',
		]);

		/**
		 * @TODO
		 * gonna have to handle this error
		 **/
		if (!workspace) {
			console.log('workspace create error', JSON.stringify(error));
			return false;
		}

		saveWorkspace(workspace);
		this.hydrateWorkspaces();
		onSuccess(workspace);
	}

	@action.bound
	async addMemberToWorkspace(workspace: Workspace, member: WorkspaceMember) {
		addMemberToWorkspace(workspace, member);

		const memberProfile = <DropboxTypes.team.TeamMemberInfo>(
			this.rootStore.userStore.members.find(m => m.profile.team_member_id === member.member.dropbox_id)
		);

		workspace.members.push(memberProfile);
		saveWorkspace(workspace);
	}

	@action
	async removeMemberFromWorkspace(workspace: Workspace, member: DropboxTypes.sharing.UserMembershipInfo) {
		//removeMemberFromFolder(workspace.workspaceFolder.shared_folder_id, member.user);
	}

	@action
	async removeMemberFromProject(project: Project, member: DropboxTypes.sharing.UserMembershipInfo) {
		//removeMemberFromFolder(project.projectFolder., member.user);
	}

	@action.bound
	hydrateWorkspaces() {
		const workspaces = getWorkspaces();
		this.workspaces.replace(workspaces);
	}

	@action.bound
	setFolderTemplates(folderTemplates: Array<SelectOption>) {
		this.folderTemplates = observable(folderTemplates);
	}

	@action.bound
	setProductionTeams(productionTeams: Array<SelectOption>) {
		this.productionTeams = observable(productionTeams);
	}

	@action.bound
	setProjectTemplates(projectTemplates: Array<string>) {
		this.projectTemplates = observable(projectTemplates);
	}

	@action.bound
	setNewItemName(name: string) {
		this.newItem.name = name;
	}

	@action.bound
	setNewItemProductionTeam(team: string) {
		this.newItem.productionTeam = team;
	}

	@action.bound
	setNewItemFolderTemplate(template: string) {
		this.newItem.folderTemplate = template;
	}

	@action.bound
	setNewProjectUser(user: DropboxTypes.team.MemberProfile) {
		this.newProject.user = user;
	}

	@action.bound
	setNewProjectTemplate(template: string) {
		this.newProject.template = template;
	}

	@action.bound
	setNewProjectWorkspace(workspaceId: string) {
		this.newProject.workspaceId = workspaceId;
	}

	@action.bound
	setNewProjectName(name: string) {
		this.newProject.name = name;
	}

	@action.bound
	setWorkspaceMetadataTemplate(id: string) {
		this.workspaceMetadataTemplate = id;
	}

	constructor(root: { userStore: UserStore }, initialState?: WorkspaceState) {
		this.rootStore = root;
		this.workspaces = observable([]);

		if (initialState) {
			this.setFolderTemplates(initialState.folderTemplates);
			this.setProductionTeams(initialState.productionTeams);
			this.setProjectTemplates(initialState.projectTemplates);
		}
	}
}
