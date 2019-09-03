type WorkspaceCeprMeta = {
	rootFolder: string;
	name: string;
	productionTeam: string;
	folderTemplate: string;
	createdAt?: string;
};

type WorkspaceMember = {
	access_level: DropboxTypes.sharing.AccessLevel;
	member: DropboxTypes.sharing.MemberSelectorDropboxId;
};

type Workspace = {
	ceprMeta: WorkspaceCeprMeta;
	creator: DropboxTypes.team.MemberProfile;
	members: Array<DropboxTypes.team.TeamMemberInfo>;
	workspaceFolder: DropboxTypes.files.FolderMetadata;
	workspaceSubfolders: Array<DropboxTypes.files.FolderMetadata>;
	projects: Array<Project>;,
	projectsRootFolder: DropboxTypes.files.FolderMetadata;
};

type WorkspaceState = {
	folderTemplates: Array<SelectOption>;
	newItem: WorkspaceCeprMeta;
	member?: DropboxTypes.team.MembersGetInfoItemMemberInfo;
	productionTeams: Array<SelectOption>;
	projectTemplates: Array<string>;
};

type WorkspaceCreateResponse = {
	error?: DropboxRequestError;
	workspace?: Workspace;
};
