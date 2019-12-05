type DropboxFolderModelState = {
	creator: DropboxTypes.team.MemberProfile;
	members: DropboxTypes.team.TeamMemberInfo[];
};

type IFolder = {
	creator: DropboxTypes.team.MemberProfile;
	currentUserIsMember: boolean;
	currentUserIsOwner: boolean;
	membersState: DropboxFolderModelState;
	newMember: NewFolderMember;
	saveNewMember(): void;
	setMembers(members: DropboxTypes.team.TeamMemberInfo[]): void;
	syncMembers(): void;
};

type NewFolderMember = {
	access_level: DropboxTypes.sharing.AccessLevel;
	member: DropboxTypes.sharing.MemberSelectorDropboxId;
};

type SelectOption<T> = {
	description?: string;
	label: string;
	value: T;
};

type User = {
	meta: { logged_in_at: string };
	user: DropboxTypes.team.MemberProfile;
};
