import { action, observable } from 'mobx';
import { getMemberByEmail } from '../services/DropboxService';

export class UserStore {
	/**
	 * @TODO
	 * Remove hard-coded user email address, or make it only set in development env
	 **/
	@observable
	email?: string = 'cepr.test.user2@gmail.com';

	@observable
	member?: DropboxTypes.team.MembersGetInfoItemMemberInfo;

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
	setMember(member: DropboxTypes.team.MembersGetInfoItemMemberInfo) {
		this.member = member;
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

		const { error, member } = await getMemberByEmail(this.email);

		if (error) {
			this.setError(error);
			return false;
		}

		if (member) {
			this.setMember(member);
			onSuccess();
		}
	}

	constructor(initialState?: UserState) {
		if (initialState) {
			this.email = initialState.email;
		}
	}
}

export default new UserStore();
