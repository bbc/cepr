import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { storeProviderCreator, createStore } from '../store';

export const StoreAndRouter = (store = createStore) => {
	const history = createMemoryHistory();
	const StoreProvider = storeProviderCreator(store);

	return ({ children }) => (
		<Router history={history}>
			<StoreProvider>{children}</StoreProvider>
		</Router>
	);
};
