import React, { createContext, useContext, ReactNode } from 'react';
import { observable } from 'mobx';
import { useLocalStore, useObserver } from 'mobx-react-lite';

import RootStore from './RootStore';

export const createStore = () => observable.box(new RootStore());
export const StoreContext = createContext(createStore());

export const useStore = () => {
	const store = useContext(StoreContext);
	if (!store) {
		// this is especially useful in TypeScript so you don't need to be checking for null all the time
		throw new Error('You have forgot to use StoreProvider, shame on you.');
	}
	return store.get();
};

export const useStoreData = (storeSelector: Function, dataSelector: Function) => {
	const store = useStore();

	if (!store) {
		throw new Error('Store is not defined');
	}

	return useObserver(() => dataSelector(storeSelector(store)));
};

export const storeProviderCreator = (storeCreator = createStore) => ({ children }: { children: ReactNode }) => {
	const observableStore = useLocalStore(storeCreator);
	return <StoreContext.Provider value={observableStore}>{children}</StoreContext.Provider>;
};

export default storeProviderCreator();
