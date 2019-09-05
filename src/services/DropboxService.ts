import { Dropbox, DropboxTeam } from 'dropbox';
import fetch from 'isomorphic-fetch'; // or another library of choice.
import compose from 'lodash/fp/compose';
import flatten from 'lodash/fp/flatten';
import { getCurrentUser } from './StorageService';

class DropboxRequestError extends Error {
	error: string;

	constructor(message: string, error: string) {
		super(message);
		this.error = error;
	}
}

const getProjectTemplates = async (templatesPath: string) => {
	const dbx = new Dropbox({
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		fetch,
		selectUser: process.env.REACT_APP_DROPBOX_ADMIN_USER_ID,
	});

	const projectTemplates = await dbx.filesListFolder({ path: templatesPath });

	return projectTemplates.entries.reduce<Array<SelectOption>>((templates, entry) => {
		if (entry['.tag'] !== 'file') {
			return templates;
		}

		return [...templates, { label: entry.name, value: entry.name }];
	}, []);
};

const addMemberToProject = async (workspace: Workspace, project: Project, member: NewFolderMember) => {
	const dbx = new Dropbox({
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		fetch,
		selectUser: workspace.creator.team_member_id,
	});

	await dbx.sharingAddFolderMember({
		shared_folder_id: project.projectFolder.shared_folder_id,
		members: [member],
	});

	await mountFolderForUser(project.projectFolder, member);
};

const addMemberToWorkspace = async (workspace: Workspace, member: NewFolderMember) => {
	const dbx = new Dropbox({
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		fetch,
		selectUser: workspace.creator.team_member_id,
	});

	workspace.projects.forEach(async project => {
		await dbx.sharingAddFolderMember({
			shared_folder_id: project.projectFolder.shared_folder_id,
			members: [member],
		});

		await mountFolderForUser(project.projectFolder, member);
	});
};

const removeMemberFromFolder = async (folderId: string, member: DropboxTypes.sharing.UserInfo) => {
	const dbx = new Dropbox({
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		fetch,
		selectUser: member.team_member_id,
	});

	try {
		await dbx.sharingUnmountFolder({ shared_folder_id: folderId });
	} catch (e) {}

	try {
		await dbx.sharingRelinquishFolderMembership({ shared_folder_id: folderId });
	} catch (e) {
		return { error: e };
	}
};

const mountFolderForUser = async (folder: DropboxTypes.sharing.SharedFolderMetadata, member: NewFolderMember) => {
	const dbx = new Dropbox({
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		fetch,
		selectUser: member.member.dropbox_id,
	});

	try {
		const result = await dbx.sharingMountFolder({ shared_folder_id: folder.shared_folder_id });
		return { folder: result };
	} catch (e) {
		return { error: e };
	}
};

const createWorkspaceTemplate = async () => {
	const dbx = new Dropbox({
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		fetch: fetch,
	});

	const { template_id } = await dbx.filePropertiesTemplatesAddForTeam({
		name: process.env.REACT_APP_DROPBOX_WORKSPACE_TEMPLATE_NAME || 'test',
		description: 'Workspace template to allow for filtering of workspaces',
		fields: [
			{
				name: 'type',
				description: 'The type of the folder - must be Workspace',
				type: {
					'.tag': 'string',
				},
			},
		],
	});

	return { templateId: template_id };
};

const getWorkspaceTemplateId = async () => {
	const dbx = new Dropbox({
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		fetch: fetch,
	});

	const { template_ids } = await dbx.filePropertiesTemplatesListForTeam();

	if (!template_ids.length) {
		return await createWorkspaceTemplate();
	}

	const templateId = template_ids.find(async template_id => {
		const template = await dbx.filePropertiesTemplatesGetForTeam({ template_id });
		return template.name === process.env.REACT_APP_DROPBOX_WORKSPACE_TEMPLATE_NAME;
	});

	if (templateId) {
		return { templateId };
	}

	return await createWorkspaceTemplate();
};

const getActiveMembers = async () => {
	const dbx = new DropboxTeam({
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		fetch: fetch,
	});

	try {
		const members = await dbx.teamMembersList({ include_removed: false });
		return { members: members.members };
	} catch (e) {
		return { error: 'Error retrieving member list' };
	}
};

const getMemberByEmail = async (email: string) => {
	const dbx = new DropboxTeam({
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		fetch: fetch,
	});

	try {
		const [member] = await dbx.teamMembersGetInfo({ members: [{ email, '.tag': 'email' }] });

		if (member['.tag'] === 'id_not_found') {
			throw new DropboxRequestError(member['.tag'], member['.tag']);
		}

		return { member: member.profile };
	} catch (e) {
		if (e.error && e.error.includes(`did not match pattern`)) {
			return { error: 'Please provide a valid email address' };
		}

		if (e.error && e.error === 'id_not_found') {
			return { error: 'User not found' };
		}

		return {
			error: 'An unexpected error occurred. Please try again later',
		};
	}
};

const createProject = async (templatesPath: string, name: string, workspace: Workspace, meta: ProjectCeprMeta) => {
	const { user } = getCurrentUser();

	const dbx = new Dropbox({
		fetch,
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		selectUser: workspace.creator.team_member_id,
	});

	try {
		const projectFolder = <DropboxTypes.sharing.SharedFolderMetadata>await dbx.sharingShareFolder({
			path: `${workspace.projectsRootFolder.path_display}/${name}`,
			member_policy: { '.tag': 'team' },
			acl_update_policy: { '.tag': 'owner' },
		});

		await dbx.filesCopy({
			from_path: `${templatesPath}/${meta.template}`,
			to_path: `${projectFolder.path_lower}/${meta.template}`,
			allow_shared_folder: false,
			autorename: false,
			allow_ownership_transfer: false,
		});

		await dbx.sharingAddFolderMember({
			shared_folder_id: projectFolder.shared_folder_id,
			members: workspace.members.map(m => ({
				/**
				 * @TODO
				 * this accesss level should be inherited from the access level that the workspace is shared with the user at
				 * but at the moment this we are not saving the access level in localstorage so everything is being set to editor
				 **/
				access_level: {
					'.tag': 'editor',
				},
				member: {
					'.tag': 'dropbox_id',
					dropbox_id: m.profile.team_member_id,
				},
			})),
		});

		workspace.members.forEach(m => {
			const memberDbx = new Dropbox({
				fetch,
				accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
				selectUser: m.profile.team_member_id,
			});

			memberDbx.sharingMountFolder({
				shared_folder_id: projectFolder.shared_folder_id,
			});
		});

		return {
			project: {
				creator: user,
				ceprMeta: { ...meta, createdAt: new Date().toISOString() },
				projectFolder,
			},
		};
	} catch (e) {
		return { error: new DropboxRequestError(e, e) };
	}
};

const getWorkspaceMembers = async (
	teamMemberId: DropboxTypes.team_common.TeamMemberId,
	projectsRoot: DropboxTypes.files.FolderMetadata
) => {
	const dbx = new Dropbox({
		fetch,
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		selectUser: teamMemberId,
	});

	const projectFolders = await dbx.filesListFolder({
		include_has_explicit_shared_members: true,
		path: projectsRoot.path_lower || '',
		recursive: false,
	});

	const removeDuplicateMembers = (members: DropboxTypes.sharing.UserMembershipInfo[]) => {
		const exists: any = {};

		return members.filter(m =>
			exists.hasOwnProperty(m.user.team_member_id) ? false : (exists[<string>m.user.team_member_id] = true)
		);
	};

	const members = await Promise.all(
		projectFolders.entries.map(folder => {
			if (folder['.tag'] !== 'folder' || !folder.shared_folder_id) {
				return Promise.resolve([]);
			}

			return getFolderMembers(teamMemberId, folder.shared_folder_id);
		})
	);

	return <DropboxTypes.sharing.UserMembershipInfo[]>compose(
		removeDuplicateMembers,
		flatten
	)(members);
};

const getFolderMembers = async (ownerId: string, sharedFolderId: string) => {
	const dbx = new Dropbox({
		fetch,
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		selectUser: ownerId,
	});

	const members = await dbx.sharingListFolderMembers({ shared_folder_id: sharedFolderId });

	return members.users;
};

const getCurrentUserFolders = async (root: string) => {
	const { user } = getCurrentUser();

	const dbx = new Dropbox({
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		fetch,
		selectUser: user.team_member_id,
	});

	/**
	 * @TODO
	 * This will become very hard to scale as the number of folders will grow very quickly.
	 **/
	const userFolders = await dbx.filesListFolder({
		recursive: true,
		path: root,
		include_deleted: false,
	});

	return userFolders.entries;
};

const createWorkspace = async (
	ceprMeta: WorkspaceCeprMeta,
	projectsRootName: string,
	paths: Array<string>
): Promise<WorkspaceCreateResponse> => {
	const { user } = getCurrentUser();

	const dbx = new Dropbox({
		fetch,
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		selectUser: user.team_member_id,
	});

	const workspaceRoot = `${ceprMeta.rootFolder}/${ceprMeta.name}`.toLowerCase();

	try {
		const allPaths = [
			workspaceRoot,
			`${workspaceRoot}/${projectsRootName}`,
			...paths.map(p => `${workspaceRoot}/${p}`),
		];

		const workspaceHydrate = await dbx.filesCreateFolderBatch({
			force_async: false,
			paths: allPaths,
		});

		if (workspaceHydrate['.tag'] !== 'complete') {
			throw new DropboxRequestError('job processing async', 'job processing async');
		}

		const workspace = workspaceHydrate.entries.reduce<Workspace>(
			(ws, folder) => {
				// if the folder didnt process successfully then just return  the workspace as is - really we should throw here?
				if (folder['.tag'] !== 'success') {
					return ws;
				}

				// if we match the workspace root then set that property
				if (folder.metadata.path_lower && folder.metadata.path_lower === workspaceRoot) {
					return { ...ws, workspaceFolder: folder.metadata };
				}

				// if the projects root folder, set that property
				if (folder.metadata.path_lower && folder.metadata.path_lower.includes(projectsRootName.toLowerCase())) {
					return { ...ws, projectsRootFolder: folder.metadata };
				}

				// otherwise just push the folder into the workspace subfolders array
				return { ...ws, workspaceSubfolders: [...ws.workspaceSubfolders, folder.metadata] };
			},
			{
				creator: user,
				ceprMeta: { ...ceprMeta, createdAt: new Date().toISOString() },
				members: [],
				projects: [],
				projectsRootFolder: { id: 'unassigned', name: 'unassigned' },
				workspaceFolder: { id: 'unassigned', name: 'unassigned' },
				workspaceSubfolders: [],
			}
		);

		return { workspace };
	} catch (e) {
		return { error: new DropboxRequestError(e, e) };
	}
};

export {
	addMemberToProject,
	addMemberToWorkspace,
	createProject,
	createWorkspace,
	getActiveMembers,
	getCurrentUserFolders,
	getFolderMembers,
	getMemberByEmail,
	getProjectTemplates,
	getWorkspaceMembers,
	getWorkspaceTemplateId,
	removeMemberFromFolder,
};
