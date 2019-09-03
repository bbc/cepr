const getCurrentUser = (): User => JSON.parse(localStorage.getItem('current_user') || '{}');

const persistCurrentUser = (user: DropboxTypes.team.MemberProfile): void => {
	const meta = {
		logged_in_at: new Date(),
	};

	window.localStorage.setItem('current_user', JSON.stringify({ user, meta }));
};

const getWorkspaces = (): Array<Workspace> => JSON.parse(localStorage.getItem(`workspaces`) || '[]');

const getWorkspaceById = (id: string): Workspace | undefined =>
	getWorkspaces().find(w => w.workspaceFolder.shared_folder_id === id);

const saveWorkspace = (workspace: Workspace): void => {
	const workspaces = getWorkspaces().filter(w => w.workspaceFolder.id !== workspace.workspaceFolder.id);
	window.localStorage.setItem('workspaces', JSON.stringify([...workspaces, workspace]));
};

export { getCurrentUser, getWorkspaces, getWorkspaceById, persistCurrentUser, saveWorkspace };
