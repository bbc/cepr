import React, { createContext, useContext } from 'react';
import { useObserver } from 'mobx-react-lite';
import RootStore from './RootStore';

export const createStore = () => new RootStore();

export const StoreContext = createContext();

export const StoreProviderCreator = store => ({ children }) => (
	<StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);

export const useStoreData = (context = StoreContext, storeSelector, dataSelector) => {
	const value = useContext(context);

	if (!value) {
		throw new Error();
	}

	const store = storeSelector(value);

	return useObserver(() => dataSelector(store));
};

export default StoreProviderCreator(createStore());
