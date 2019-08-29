type WorkspaceCeprMeta = {
	rootFolder: string;
	name: string;
	productionTeam: string;
	folderTemplate: string;
	createdAt?: string;
};

type WorkspaceMember = {
	access_level: DropboxTypes.sharing.AccessLevel;
	member: DropboxTypes.sharing.MemberSelectorDropbox;
};

type Workspace = {
	ceprMeta: WorkspaceCeprMeta;
	workspaceFolder: DropboxTypes.sharing.SharedFolderMetadata;
	workspaceSubfolders: Array<DropboxTypes.files.FolderMetadata>;
	creator: DropboxTypes.team.MemberProfile;
	projects: Array<Project>;
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
