import { action, computed, observable, IObservableArray } from 'mobx';
import format from 'date-fns/format';
import {
	addMemberToProject,
	addMemberToWorkspace,
	createProject,
	createWorkspace,
	getProjectTemplates,
	removeMemberFromFolder,
	getWorkspaceMembers,
} from '../services/DropboxService';
import { saveWorkspace, getWorkspaces } from '../services/StorageService';

export default class {
	rootStore: { userStore: UserStore };

	/**
	 * @TODO
	 * should be configurable
	 **/
	projectTemplatesPath: string = '/cepr-root/templates';

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
	activeWorkspaceId?: string;

	@action.bound
	setActiveWorkspaceId(workspaceId: string) {
		this.activeWorkspaceId = workspaceId;
	}

	@computed
	get activeWorkspace(): Workspace | undefined {
		return this.workspaces.find(w => w.workspaceFolder.id === this.activeWorkspaceId);
	}

	@observable
	folderTemplates?: IObservableArray<SelectOption>;

	@observable
	productionTeams?: IObservableArray<SelectOption>;

	@observable
	projectTemplates?: IObservableArray<SelectOption>;

	@observable
	workspaces: IObservableArray<Workspace>;

	workspaceAccessLevels: Array<SelectOption> = [
		{ label: 'Can edit', value: 'editor' },
		{ label: 'Read only', value: 'viewer' },
	];

	projectAccessLevels: Array<SelectOption> = [
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
		return <Workspace>this.workspaces.find(w => w.workspaceFolder.id === this.newProject.workspaceId);
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
			this.projectTemplatesPath,
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
	async addMemberToWorkspace(workspace: Workspace, member: NewFolderMember) {
		await addMemberToWorkspace(workspace, member);

		const memberProfile = <DropboxTypes.team.TeamMemberInfo>(
			this.rootStore.userStore.members.find(m => m.profile.team_member_id === member.member.dropbox_id)
		);

		workspace.members.push(memberProfile);
	}

	@action.bound
	async addMemberToProject(workspace: Workspace, project: Project, member: NewFolderMember) {
		addMemberToProject(workspace, project, member);

		const memberProfile = <DropboxTypes.team.TeamMemberInfo>(
			this.rootStore.userStore.members.find(m => m.profile.team_member_id === member.member.dropbox_id)
		);

		workspace.members.push(memberProfile);
		saveWorkspace(workspace);
	}

	@action
	async removeMemberFromWorkspace(workspace: Workspace, member: DropboxTypes.sharing.UserMembershipInfo) {
		// removeMemberFromFolder(workspace.workspaceFolder.id, member.user);
	}

	@action.bound
	async removeMemberFromProject(
		workspace: Workspace,
		project: Project,
		member: DropboxTypes.sharing.UserMembershipInfo
	) {
		await removeMemberFromFolder(project.projectFolder.shared_folder_id, member.user);
		this.syncWorkspaceMembers(workspace);
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
	setProjectTemplates(projectTemplates: Array<SelectOption>) {
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

	@action.bound
	async syncWorkspaceMembers(workspace: Workspace) {
		const members = await getWorkspaceMembers(workspace.creator.team_member_id, workspace.projectsRootFolder);

		workspace.members = this.rootStore.userStore.members.filter(m =>
			members.some(
				mb =>
					mb.user.team_member_id === m.profile.team_member_id &&
					m.profile.team_member_id !== workspace.creator.team_member_id
			)
		);

		saveWorkspace(workspace);
		this.hydrateWorkspaces();
	}

	constructor(root: { userStore: UserStore }, initialState?: WorkspaceState) {
		this.rootStore = root;
		this.workspaces = observable([]);

		if (initialState) {
			this.setFolderTemplates(initialState.folderTemplates);
			this.setProductionTeams(initialState.productionTeams);
		}

		getProjectTemplates(this.projectTemplatesPath).then(this.setProjectTemplates);
	}
}
