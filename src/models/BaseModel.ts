import { computed } from 'mobx';

class BaseModel {
	store: RootStore;

	@computed
	get user() {
		return this.store.userStore.member.user;
	}

	constructor(store: RootStore) {
		this.store = store;
	}
}

export default BaseModel;
