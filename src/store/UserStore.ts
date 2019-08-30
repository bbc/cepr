import { action, observable } from 'mobx';
import { getActiveMembers, getMemberByEmail } from '../services/DropboxService';
import { persistCurrentUser } from '../services/StorageService';

export default class {
	rootStore: { workspaceStore: WorkspaceStore };

	@observable
	email?: string = process.env.NODE_ENV === 'production' ? 'cepr.test.user2@gmail.com' : undefined;

	@observable
	member?: DropboxTypes.team.MemberProfile;

	@observable
	memberFolders: Array<DropboxTypes.files.FolderMetadata>;

	@observable
	members?: Array<DropboxTypes.team.TeamMemberInfo>;

	@observable
	error?: string;

	@action.bound
	setEmail(email?: string) {
		this.email = email;
	}

	@action
	setError(error?: string) {
		this.error = error;
	}

	@action
	setMember(member: DropboxTypes.team.MemberProfile) {
		this.member = member;
	}

	@action
	setMembers(members: Array<DropboxTypes.team.TeamMemberInfo>) {
		this.members = members;
	}

	@action.bound
	async authUser(onSuccess: Function) {
		if (!this.email) {
			this.setError('Please provide a valid email address');
			return false;
		}

		if (this.error) {
			this.setError(undefined);
		}

		const { error: getMemberError, member } = await getMemberByEmail(this.email);

		if (!member) {
			this.setError(getMemberError);
			return false;
		}

		const { error: getMembersError, members } = await getActiveMembers();

		if (!members) {
			this.setError(getMembersError);
			return false;
		}

		this.setMember(member);
		this.setMembers(members);

		persistCurrentUser(member);
		this.rootStore.workspaceStore.hydrateWorkspaces();
		this.rootStore.workspaceStore.setNewProjectUser(member);
		onSuccess();
	}

	constructor(root: { workspaceStore: WorkspaceStore }, initialState?: UserState) {
		this.rootStore = root;
		this.memberFolders = observable([]);

		if (initialState) {
			this.email = initialState.email;
		}
	}
}
