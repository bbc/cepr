type SelectOption = {
	label: string;
	value: string;
};

type Workspace = {
	name: string;
	productionTeam: string;
	folderTemplate: string;
};

type WorkspaceState = {
	newItem: Workspace;
	productionTeams: Array<SelectOption>;
	folderTemplates: Array<SelectOption>;
};

type UserState = {
	email: string;
};
