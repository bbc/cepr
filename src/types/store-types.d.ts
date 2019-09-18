type RootStore = {
	newProjectStore: NewProjectStore;
	newWorkspaceStore: NewWorkspaceStore;
	projectStore: ProjectStore;
	workspaceStore: WorkspaceStore;
	userStore: UserStore;
};

type NewProjectStore = {
	getProjectName(workspaceName: string, projectName: string, version: number);
	projectTemplatesPath: string;
};

type NewWorkspaceStore = {
	rootFolder: string;

	canCreateWorkspace: boolean;
	folderTemplate?: string;
	name?: string;
	newItem: WorkspaceCeprMeta;
	productionTeam?: string;
	projectRootName: string;

	createWorkspace(onSuccess: Function);
	setFolderTemplate(template: string): void;
	setName(name: string): void;
};

type ProjectStore = {
	hydrateProjects(): void;
	projects: IProject[];
};

type WorkspaceStore = {
	hydrateWorkspaces(): void;
	workspaces: IWorkspace[];
};

type UserStore = {
	members: DropboxTypes.team.TeamMemberInfo[];
	member: User;
};
