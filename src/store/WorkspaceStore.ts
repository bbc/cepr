import { action, observable } from 'mobx';

export class WorkspaceStore {
	@observable
	newItem: Workspace = {
		name: '',
		productionTeam: '',
		folderTemplate: '',
	};

	@observable
	folderTemplates?: Array<SelectOption>;

	@observable
	productionTeams?: Array<SelectOption>;

	/***
	 * @TODO
	 * this should be taken from settings - should be configureable by the user
	 * */
	@observable
	rootFolder?: string = '/cepr-test/';

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

	constructor(initialState?: WorkspaceState) {
		if (initialState) {
			this.folderTemplates = initialState.folderTemplates;
			this.productionTeams = initialState.productionTeams;
		}
	}
}

export default new WorkspaceStore();
