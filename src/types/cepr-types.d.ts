type SelectOption = {
	label: string;
	value: string;
};

type UserState = {
	email: string;
};

type User = {
	meta: {
		logged_in_at: string;
	};
	user: DropboxTypes.team.MemberProfile;
};

type RootStore = {
	workspaceStore: WorkspaceStore;
	userStore: UserStore;
};

type WorkspaceStore = {
	hydrateWorkspaces: Function;
	setNewProjectUser: Function;
	workspaceMetadataTemplate?: string;
};

type UserStore = {
	members: Array<DropboxTypes.team.TeamMemberInfo>;
};
