type IProject = IFolder & {
	id: string;
	children: IProject[];
	downloadLink?: string;
	parent?: IProject;
	state: Project;
	store: RootStore;
	workspace: IWorkspace | undefined;
};

type Project = DropboxFolderModelState & {
	ceprMeta: ProjectCeprMeta;
	projectFolder: DropboxTypes.sharing.SharedFolderMetadata;
};

type ProjectCeprMeta = {
	createdAt?: string;
	name: string;
	parentId?: string;
	template: string;
	workspaceId: string;
	user?: DropboxTypes.team.MemberProfile;
};
