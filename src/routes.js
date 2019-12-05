import Workspaces from './components/Workspaces';
import CreateWorkspace from './components/CreateWorkspace';

import Login from './components/Login';

const routes = [
	{
		authed: true,
		component: CreateWorkspace,
		exact: true,
		path: '/',
		text: 'Create workspace',
	},
	{
		authed: true,
		component: Workspaces,
		exact: true,
		path: '/workspaces',
		text: 'Workspaces',
	},
	{
		authed: false,
		path: '/login',
		component: Login,
	},
];

export default routes;
