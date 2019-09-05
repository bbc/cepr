import UserStore from './UserStore';
import WorkspaceStore from './WorkspaceStore';

import { getWorkspaceTemplateId } from '../services/DropboxService';

export default class {
	userStore: UserStore;
	workspaceStore: WorkspaceStore;

	async bootstrapApplication() {
		const { templateId } = await getWorkspaceTemplateId();
		this.workspaceStore.setWorkspaceMetadataTemplate(templateId);
	}

	constructor() {
		this.userStore = new UserStore(<RootStore>this);
		this.workspaceStore = new WorkspaceStore(<RootStore>this, {
			/**
			 * @TODO
			 *  this should be retrieved from storage, data schema may also change
			 **/
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
			projectTemplates: [
				{ label: 'template', value: '/path/to/template' },
				{ label: 'template', value: '/path/to/template' },
				{ label: 'template', value: '/path/to/template' },
				{ label: 'template', value: '/path/to/template' },
				{ label: 'template', value: '/path/to/template' },
			],
			newItem: {
				rootFolder: '/cepr-root',
				name: '',
				productionTeam: '',
				folderTemplate: '',
				createdAt: undefined,
			},
		});

		this.bootstrapApplication();
	}
}
