import { action, observable, autorun } from 'mobx';
import { getActiveMembers, getMemberByEmail } from '../services/DropboxService';
import { persistCurrentUser } from '../services/StorageService';

export default class {
	rootStore: RootStore;

	@observable
	email?: string;

	@observable
	member?: User;

	@observable
	memberFolders: DropboxTypes.files.FolderMetadata[];

	@observable
	members?: DropboxTypes.team.TeamMemberInfo[];

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
		this.member = {
			user: member,
			meta: { logged_in_at: new Date().toISOString() },
		};
	}

	@action
	setMembers(members: DropboxTypes.team.TeamMemberInfo[]) {
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
		onSuccess();
	}

	constructor(root: RootStore, initialState?: { email: string }) {
		this.rootStore = root;
		this.memberFolders = observable([]);

		if (initialState) {
			this.email = initialState.email;
		}

		autorun(() => {
			if (this.member) {
				persistCurrentUser(this.member.user);
			}
		});
	}
}
