import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { StoreContext, useStoreData } from '../store';

function AuthedRoute({ component: Component, ...rest }) {
	const { userEmail } = useStoreData(
		StoreContext,
		store => store.userStore,
		userStore => ({
			userEmail: userStore.email,
		})
	);

	return <Route {...rest} render={props => (userEmail ? <Component {...props} /> : <Redirect to="/login" />)} />;
}

export default AuthedRoute;
