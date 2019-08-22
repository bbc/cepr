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

	@action.bound
	setName(name: string) {
		this.newItem.name = name;
	}

	@action.bound
	setProductionTeam(team: string) {
		this.newItem.productionTeam = team;
	}

	@action.bound
	setFolderTemplate(template: string) {
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
