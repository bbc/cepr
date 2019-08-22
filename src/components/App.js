import React from 'react';
import { Route, Switch } from 'react-router-dom';

import routes from '../routes';
import AuthedRoute from './AuthedRoute';

function App() {
	return (
		<Switch>
			{routes.map(route =>
				route.authed ? <AuthedRoute key={route.path} {...route} /> : <Route key={route.path} {...route} />
			)}
		</Switch>
	);
}

export default App;
