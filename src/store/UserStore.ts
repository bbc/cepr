import { action, observable } from 'mobx';

export class UserStore {
	@observable
	email?: string;

	@observable
	dropboxMemberId?: string;

	@action.bound
	setEmail(email?: string) {
		this.email = email;
	}

	@action
	authUser(onSuccess: Function) {
		onSuccess();
	}

	constructor(initialState?: UserState) {
		if (initialState) {
			this.email = initialState.email;
		}
	}
}

export default new UserStore();
