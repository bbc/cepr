import { action, computed, observable, IObservableArray } from 'mobx';
import format from 'date-fns/format';
import {
	addMemberToWorkspace,
	createProject,
	createWorkspace,
	removeMemberFromWorkspace,
} from '../services/DropboxService';
import { saveWorkspace, getWorkspaces, getWorkspaceById } from '../services/StorageService';

export default class {
	rootStore: RootStore;

	@observable
	newItem: WorkspaceCeprMeta = {
		rootFolder: '/cepr-test',
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
	get newProjectWorkspace(): Workspace | undefined {
		return getWorkspaceById(this.newProject.workspaceId);
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
		if (!project || !this.newProjectWorkspace) {
			console.log('workspace create error', JSON.stringify(error));
			return false;
		}

		/**
		 * @TODO
		 * pretty grim this pattern, spike if there's a better way
		 **/
		const workspace = this.newProjectWorkspace;
		workspace.projects = workspace.projects.concat(project);
		saveWorkspace(workspace);
		this.hydrateWorkspaces();
		onSuccess(project);
	}

	@action.bound
	async createWorkspace(onSuccess: Function) {
		const { error, workspace } = await createWorkspace(this.newItem, ['Media', 'Projects', 'Misc', 'Clips']);

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

	@action
	async addMemberToWorkspace(workspace: Workspace, member: WorkspaceMember) {
		addMemberToWorkspace(workspace, member);
	}

	@action
	async removeMemberFromWorkspace(workspace: Workspace, member: DropboxTypes.sharing.UserMembershipInfo) {
		removeMemberFromWorkspace(workspace, member.user);
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

	constructor(root: RootStore, initialState?: WorkspaceState) {
		this.rootStore = root;
		this.workspaces = observable([]);

		if (initialState) {
			this.setFolderTemplates(initialState.folderTemplates);
			this.setProductionTeams(initialState.productionTeams);
			this.setProjectTemplates(initialState.projectTemplates);
		}
	}
}
