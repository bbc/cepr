import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useStoreData } from '../store';

function AuthedRoute({ component: Component, ...rest }) {
	const { userEmail } = useStoreData(
		store => store.userStore,
		userStore => ({
			userEmail: userStore.email,
		})
	);

	return <Route {...rest} render={props => (userEmail ? <Component {...props} /> : <Redirect to="/login" />)} />;
}

export default AuthedRoute;
