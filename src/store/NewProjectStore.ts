import format from 'date-fns/format';
import { action, observable, computed } from 'mobx';
import ProjectModel from '../models/ProjectModel';
import { createProject, getProjectTemplates } from '../services/DropboxService';

export default class {
	rootStore: RootStore;

	@observable
	name: string = '';

	@observable
	projectTemplates?: SelectOption<string>[];

	/**
	 * @TODO
	 * should be configurable
	 **/
	projectTemplatesPath: string = '/cepr-root/templates';

	@observable
	template: string = '';

	@observable
	workspaceId: string = '';

	constructor(root: RootStore) {
		this.rootStore = root;

		getProjectTemplates(this.projectTemplatesPath).then(this.setProjectTemplates);
	}

	@computed
	get canCreateProject() {
		return new Boolean(this.name && this.workspace && this.template).valueOf();
	}

	@computed
	get fullName() {
		if (!this.workspace) {
			return '';
		}
		return this.getProjectName(this.workspace.state.ceprMeta.name, this.name, 1);
	}

	getProjectName(workspaceName: string, projectName: string, version: number) {
		return `${workspaceName}_${projectName}_${format(new Date(), 'yy-MM-dd')}_v${version}`;
	}

	@computed
	get newProjectMeta(): ProjectCeprMeta {
		return {
			createdAt: new Date().toISOString(),
			name: this.name,
			parentId: undefined,
			template: this.template,
			workspaceId: this.workspaceId,
			user: this.rootStore.userStore.member.user,
		};
	}

	@computed
	get workspace() {
		return this.rootStore.workspaceStore.workspaces.find(w => w.id === this.workspaceId);
	}

	@action.bound
	setProjectTemplates(templates: SelectOption<string>[]) {
		this.projectTemplates = templates;
	}

	@action.bound
	setName(name: string) {
		this.name = name;
	}

	@action.bound
	setTemplate(template: string) {
		this.template = template;
	}

	@action.bound
	setWorkspaceId(id: string) {
		this.workspaceId = id;
	}

	/**
	 * @TODO
	 * Project creation errors are not being correctly handled
	 **/
	@action.bound
	async createProject() {
		if (!this.canCreateProject || !this.workspace) {
			return;
		}

		const { error, project } = await createProject(
			this.projectTemplatesPath,
			this.fullName,
			this.workspace.state,
			this.newProjectMeta
		);

		if (!project) {
			console.error('Project create error', JSON.stringify(error));
			return false;
		}

		this.rootStore.projectStore.projects.push(new ProjectModel(this.rootStore, project));
	}
}
