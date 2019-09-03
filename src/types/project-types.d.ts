type ProjectCeprMeta = {
	name: string;
	template: string;
	user?: DropboxTypes.team.MemberProfile;
	workspaceId: string;
};

type Project = {
	creator: DropboxTypes.team.MemberProfile;
	ceprMeta: {
		createdAt: string;
		name: string;
		template: string;
		user?: DropboxTypes.team.MemberProfile | undefined;
		workspaceId: string;
	};
	projectFolder: DropboxTypes.sharing.SharedFolderMetadata;
};
