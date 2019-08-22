import React, { createContext, useContext } from 'react';
import { useObserver } from 'mobx-react-lite';
import { UserStore } from './UserStore';
import { WorkspaceStore } from './WorkspaceStore';

export const createStore = () => ({
	userStore: new UserStore(),
	workspaceStore: new WorkspaceStore({
		folderTemplates: [
			{ text: 'Sports template 1', value: 'template1' },
			{ text: 'Sports template 2', value: 'template2' },
			{ text: 'Sports template 3', value: 'template3' },
		],
		productionTeams: [
			{ text: 'Shortform', value: 'shortform' },
			{ text: 'Sports News', value: 'sports-news' },
			{ text: 'World Cup Team', value: 'worldcupteam' },
			{ text: 'Wimbledon', value: 'wimbledon' },
		],
	}),
});

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

	return useObserver(() => {
		return dataSelector(store);
	});
};

export default StoreProviderCreator(createStore());
