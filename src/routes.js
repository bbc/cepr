import CreateProject from './components/CreateProject';
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
		component: CreateProject,
		exact: true,
		path: '/project/create',
		text: 'Create project',
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
