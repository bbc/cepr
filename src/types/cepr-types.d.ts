type RootStore = {
	workspaceStore: WorkspaceStore;
	userStore: UserStore;
};

type SelectOption = {
	description?: string;
	label: string;
	value: string;
};

type User = {
	meta: { logged_in_at: string };
	user: DropboxTypes.team.MemberProfile;
};

type WorkspaceStore = {
	hydrateWorkspaces: Function;
	setNewProjectUser: Function;
	workspaceMetadataTemplate?: string;
};

type UserStore = {
	members: Array<DropboxTypes.team.TeamMemberInfo>;
};
