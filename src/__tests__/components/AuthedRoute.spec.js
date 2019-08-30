import React from 'react';
import { render } from '@testing-library/react';
import { observable } from 'mobx';
import { Route, Switch } from 'react-router-dom';

import { StoreAndRouter } from '../../test-utils/providers';

import UserStore from '../../store/UserStore';
import AuthedRoute from '../../components/AuthedRoute';

describe('AuthedRoute', () => {
	it('should redirect to the login page if the user email address is not populated in the store', () => {
		const { getAllByText } = render(
			<Switch>
				<AuthedRoute path="/" exact component={() => <div>User logged in</div>} />
				<Route path="/login" component={() => <div>User not logged in</div>} />
			</Switch>,
			{ wrapper: StoreAndRouter() }
		);

		expect(getAllByText('User not logged in').length).toBe(1);
	});

	it('should render the corect component if the user is logged in', () => {
		const { getAllByText } = render(
			<Switch>
				<AuthedRoute path="/" exact component={() => <div>User logged in</div>} />
				<Route path="/login" component={() => <div>User not logged in</div>} />
			</Switch>,
			{
				wrapper: StoreAndRouter(() =>
					observable.box({ userStore: new UserStore({}, { email: 'keir.lavelle@bbc.co.uk' }) })
				),
			}
		);

		expect(getAllByText('User logged in').length).toBe(1);
	});
});
