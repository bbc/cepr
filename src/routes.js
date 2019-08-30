import Workspaces from './components/Workspaces';
import CreateWorkspace from './components/CreateWorkspace';
import SearchProject from './components/SearchProject';

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
		authed: true,
		component: SearchProject,
		exact: true,
		path: '/project/search',
		text: 'Search project',
	},
	{
		authed: false,
		path: '/login',
		component: Login,
	},
];

export default routes;
