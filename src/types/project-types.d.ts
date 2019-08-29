type ProjectCeprMeta = {
	name: string;
	template: string;
	user?: DropboxTypes.team.MemberProfile;
	workspaceId: string;
};

type Project = {
	user: DropboxTypes.team.MemberProfile;
	projectFolder: DropboxTypes.files.FolderMetadata;
	ceprMeta: {
		createdAt: string;
		name: string;
		template: string;
		user?: DropboxTypes.team.MemberProfile | undefined;
		workspaceId: string;
	};
};
