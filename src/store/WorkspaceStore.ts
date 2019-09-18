import { action, autorun, computed, observable } from 'mobx';
import WorkspaceModel from '../models/WorkspaceModel';
import { getWorkspaces } from '../services/StorageService';

export default class {
	rootStore: RootStore;

	accessLevels: SelectOption<DropboxTypes.sharing.AccessLevel>[] = [
		{ label: 'Can edit', value: { '.tag': 'editor' } },
		{ label: 'Read only', value: { '.tag': 'viewer' } },
	];

	@observable
	activeWorkspaceId?: string;

	@observable
	workspaces: IWorkspace[] = [];

	@action.bound
	setActiveWorkspaceId(workspaceId: string) {
		this.activeWorkspaceId = workspaceId;
	}

	@computed
	get activeWorkspace(): IWorkspace | undefined {
		return this.workspaces.find(w => w.id === this.activeWorkspaceId);
	}

	@action.bound
	hydrateWorkspaces() {
		const workspaces = getWorkspaces().map(w => new WorkspaceModel(this.rootStore, w, false));
		this.setWorkspaces(workspaces);
	}

	@action.bound
	setWorkspaces(workspaces: IWorkspace[]) {
		this.workspaces = workspaces;
	}

	constructor(root: RootStore) {
		this.rootStore = root;

		autorun(() => {
			if (this.rootStore.userStore.member) {
				this.hydrateWorkspaces();
			}
		});
	}
}
