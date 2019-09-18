const getCurrentUser = (): User => JSON.parse(localStorage.getItem('current_user') || '{}');

const persistCurrentUser = (user: DropboxTypes.team.MemberProfile): void => {
	const meta = {
		logged_in_at: new Date(),
	};

	window.localStorage.setItem('current_user', JSON.stringify({ user, meta }));
};
const getProjects = (): Project[] => JSON.parse(localStorage.getItem('projects') || '[]');

const getWorkspaces = (): Workspace[] => JSON.parse(localStorage.getItem(`workspaces`) || '[]');

const getWorkspaceById = (id: string): Workspace | undefined =>
	getWorkspaces().find(w => w.workspaceFolder.shared_folder_id === id);

const saveProject = (project: Project): void => {
	console.log('saving project', JSON.stringify(project));
	const projects = getProjects().filter(
		p => p.projectFolder.shared_folder_id !== project.projectFolder.shared_folder_id
	);
	window.localStorage.setItem('projects', JSON.stringify([...projects, project]));
};

const saveWorkspace = (workspace: Workspace): void => {
	console.log('saving workspace', workspace);
	const workspaces = getWorkspaces().filter(w => w.workspaceFolder.id !== workspace.workspaceFolder.id);
	window.localStorage.setItem('workspaces', JSON.stringify([...workspaces, workspace]));
};

export { getCurrentUser, getProjects, getWorkspaces, getWorkspaceById, persistCurrentUser, saveProject, saveWorkspace };
