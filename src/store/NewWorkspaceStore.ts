import { action, observable, computed } from 'mobx';
import WorkspaceModel from '../models/WorkspaceModel';
import { createWorkspace } from '../services/DropboxService';

type NewWorkspaceStoreInitialState = {
	folderTemplates: SelectOption<string>[];
	productionTeams: SelectOption<string>[];
};

export default class {
	rootStore: RootStore;

	@observable rootFolder: string = '/cepr-root';

	@observable folderTemplates: SelectOption<string>[];
	@observable folderTemplate?: string;

	@observable productionTeams: SelectOption<string>[];
	@observable productionTeam?: string;

	@observable name?: string;

	constructor(root: RootStore, state: NewWorkspaceStoreInitialState) {
		this.rootStore = root;

		this.folderTemplates = state.folderTemplates;
		this.productionTeams = state.productionTeams;
	}

	@action.bound setFolderTemplate(template: string) {
		this.folderTemplate = template;
	}

	@action.bound setName(name: string) {
		this.name = name;
	}

	@action.bound setProductionTeam(productionTeam: string) {
		this.productionTeam = productionTeam;
	}

	@computed
	get canCreateWorkspace(): boolean {
		return !!this.name && !!this.productionTeam && !!this.folderTemplate;
	}

	@computed
	get newItem(): WorkspaceCeprMeta {
		return {
			rootFolder: this.rootFolder,
			name: this.name || '',
			productionTeam: this.productionTeam || '',
			folderTemplate: this.folderTemplate || '',
			createdAt: new Date().toISOString(),
		};
	}

	/**
	 * @TODO
	 * This should be based upon the newItem.folderTemplate property
	 * - folderTemplate should be the ID of a FolderTemplateModel
	 * - The model should contain the schema of the folder structure
	 * - The schema should have a directory marked as the 'projects root',
	 * i.e. the directory where new projects are created
	 **/
	get projectRootName() {
		return 'Projects';
	}

	/**
	 * @TODO
	 * - Errors in creating workspaces are not correctly handled
	 **/
	@action.bound
	async createWorkspace(onSuccess: Function) {
		if (!this.canCreateWorkspace) {
			console.error(
				`[NewWorkspaceStore.createWorkspace] Cannot create workspace with values: ${JSON.stringify(
					this.newItem
				)}`
			);
			return;
		}

		const { error, workspace } = await createWorkspace(this.newItem, this.projectRootName, [
			'Media',
			'Misc',
			'Clips',
		]);

		if (!workspace) {
			console.error(`[NewWorkspaceStore.createWorkspace] Workspace create erorr: ${JSON.stringify(error)}`);
			throw error;
		}

		const model = new WorkspaceModel(this.rootStore, workspace);
		this.rootStore.workspaceStore.workspaces.push(model);
		onSuccess(model);
	}
}
