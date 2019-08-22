import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { StoreProviderCreator, createStore } from '../store';

export const StoreAndRouter = (store = createStore()) => {
	const history = createMemoryHistory();
	const StoreProvider = StoreProviderCreator(store);

	return ({ children }) => (
		<Router history={history}>
			<StoreProvider>{children}</StoreProvider>
		</Router>
	);
};
