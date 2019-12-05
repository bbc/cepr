import { action, computed, observable, autorun } from 'mobx';
import ProjectModel from '../models/ProjectModel';
import { getProjects } from '../services/StorageService';

export default class {
	rootStore: RootStore;

	accessLevels: SelectOption<DropboxTypes.sharing.AccessLevel>[] = [
		{ label: 'Can edit', value: { '.tag': 'editor' } },
		{ label: 'Read only', value: { '.tag': 'viewer' } },
	];

	@observable
	activeProjectId?: string;

	@observable
	projects: IProject[] = [];

	@action.bound
	setActiveProjectId(projectId: string) {
		this.activeProjectId = projectId;
	}

	@action.bound
	setProjects(projects: IProject[]) {
		this.projects = projects;
	}

	@computed
	get activeProject(): IProject | undefined {
		return this.projects.find(p => p.id === this.activeProjectId);
	}

	@action.bound
	hydrateProjects() {
		const projects = getProjects().map(p => new ProjectModel(this.rootStore, p, false));
		this.setProjects(projects);
	}

	constructor(root: RootStore) {
		this.rootStore = root;

		autorun(() => {
			if (this.rootStore.userStore.member) {
				this.hydrateProjects();
			}
		});
	}
}
