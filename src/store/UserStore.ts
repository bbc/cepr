import { action, observable } from 'mobx';
import { getActiveMembers, getCurrentUserFolders, getMemberByEmail } from '../services/DropboxService';
import { persistCurrentUser } from '../services/StorageService';

export default class {
	rootStore: RootStore;

	@observable
	email?: string = process.env.NODE_ENV === 'test' ? 'cepr.test.user2@gmail.com' : undefined;

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

		/**
		 * @TODO
		 * root path (the argument for getCurrentUserFolders) should be sourced from settings, also need to investigate why there's a need to cast here
		 **/
		// const userFolders = (await getCurrentUserFolders('')) as DropboxTypes.files.FolderMetadata[];
		// this.memberFolders = userFolders;
		// console.log(userFolders);
		onSuccess();
	}

	constructor(root: RootStore, initialState?: UserState) {
		this.rootStore = root;
		this.memberFolders = observable([]);

		if (initialState) {
			this.email = initialState.email;
		}
	}
}
