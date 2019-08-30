import React, { createContext, useContext } from 'react';
import { observable } from 'mobx';
import { useLocalStore, useObserver } from 'mobx-react-lite';

import compose from 'lodash/fp/compose';
import RootStore from './RootStore';

export const createStore = () => observable.box(new RootStore());
export const StoreContext = createContext();

export const useStore = () => {
	const store = useContext(StoreContext);
	if (!store) {
		// this is especially useful in TypeScript so you don't need to be checking for null all the time
		throw new Error('You have forgot to use StoreProvider, shame on you.');
	}
	return store.get();
};

export const useStoreData = (storeSelector, dataSelector) => {
	const store = useStore();

	if (!store) {
		throw new Error('Store is not defined');
	}

	return useObserver(() =>
		compose(
			dataSelector,
			storeSelector
		)(store)
	);
};

export const storeProviderCreator = (store = createStore) => ({ children }) => {
	const observableStore = useLocalStore(store);
	return <StoreContext.Provider value={observableStore}>{children}</StoreContext.Provider>;
};

export default storeProviderCreator();
