type IWorkspace = IFolder & {
	id: string;
	path: string;
	projectCount: number;
	projects: IProject[];
	state: Workspace;
	store: RootStore;

	addProject(project: IProject): void;
};

type Workspace = DropboxFolderModelState & {
	ceprMeta: WorkspaceCeprMeta;
	projectIds: string[];
	projectsRootFolder: DropboxTypes.files.FolderMetadata;
	workspaceFolder: DropboxTypes.files.FolderMetadata;
	workspaceSubfolders: DropboxTypes.files.FolderMetadata[];
};

type WorkspaceCeprMeta = {
	rootFolder: string;
	name: string;
	productionTeam: string;
	folderTemplate: string;
	createdAt?: string;
};

type WorkspaceCreateResponse = {
	error?: DropboxRequestError;
	workspace?: Workspace;
};
