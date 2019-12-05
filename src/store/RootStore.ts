import UserStore from './UserStore';
import NewProjectStore from './NewProjectStore';
import NewWorkspaceStore from './NewWorkspaceStore';
import ProjectStore from './ProjectStore';
import WorkspaceStore from './WorkspaceStore';

export default class {
	newProjectStore: NewProjectStore;
	newWorkspaceStore: NewWorkspaceStore;
	projectStore: ProjectStore;
	userStore: UserStore;
	workspaceStore: WorkspaceStore;

	constructor() {
		this.newProjectStore = new NewProjectStore(<RootStore>this);
		this.newWorkspaceStore = new NewWorkspaceStore(<RootStore>this, {
			folderTemplates: [
				{ label: 'Sports template 1', value: 'template1' },
				{ label: 'Sports template 2', value: 'template2' },
				{ label: 'Sports template 3', value: 'template3' },
			],
			productionTeams: [
				{ label: 'Shortform', value: 'shortform' },
				{ label: 'Sports News', value: 'sports-news' },
				{ label: 'World Cup Team', value: 'worldcupteam' },
				{ label: 'Wimbledon', value: 'wimbledon' },
			],
		});
		this.userStore = new UserStore(<RootStore>this);
		this.workspaceStore = new WorkspaceStore(<RootStore>this);
		this.projectStore = new ProjectStore(<RootStore>this);
	}
}
