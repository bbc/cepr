import { Dropbox, DropboxTeam } from 'dropbox';
import fetch from 'isomorphic-fetch'; // or another library of choice.
import { getCurrentUser } from './StorageService';
import { defineBoundAction } from 'mobx/lib/internal';

class DropboxRequestError extends Error {
	error: string;

	constructor(message: string, error: string) {
		super(message);
		this.error = error;
	}
}

const addMemberToWorkspace = async (workspace: Workspace, member: WorkspaceMember) => {
	const { user } = getCurrentUser();

	const dbx = new Dropbox({
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		fetch,
		selectUser: user.team_member_id,
	});

	await dbx.sharingAddFolderMember({
		shared_folder_id: workspace.workspaceFolder.shared_folder_id,
		members: [member],
	});

	return await mountFolderForUser(workspace.workspaceFolder, member);
};

const removeMemberFromWorkspace = async (workspace: Workspace, member: DropboxTypes.sharing.UserInfo) => {
	const dbx = new Dropbox({
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		fetch,
		selectUser: member.team_member_id,
	});

	try {
		await dbx.sharingUnmountFolder({ shared_folder_id: workspace.workspaceFolder.shared_folder_id });
		await dbx.sharingRelinquishFolderMembership({ shared_folder_id: workspace.workspaceFolder.shared_folder_id });
	} catch (e) {
		return { error: e };
	}
};

const mountFolderForUser = async (folder: DropboxTypes.sharing.SharedFolderMetadata, member: WorkspaceMember) => {
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

const createProject = async (name: string, workspace: Workspace, meta: ProjectCeprMeta) => {
	const { user } = getCurrentUser();

	const dbx = new Dropbox({
		fetch,
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		selectUser: user.team_member_id,
	});

	try {
		const projectFolder = await dbx.filesCreateFolder({
			path: `${workspace.workspaceFolder.path_lower}/Projects/${name}`,
		});

		return {
			project: {
				user,
				ceprMeta: { ...meta, createdAt: new Date().toISOString() },
				projectFolder,
			},
		};
	} catch (e) {
		return { error: new DropboxRequestError(e, e) };
	}
};

const getWorkspaceMembers = async (sharedFolderId: string) => {
	const { user } = getCurrentUser();

	const dbx = new Dropbox({
		fetch,
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		selectUser: user.team_member_id,
	});

	const members = await dbx.sharingListFolderMembers({ shared_folder_id: sharedFolderId });

	console.log({ members });

	return members.users;
};

const getCurrentUserFolders = async (root: string) => {
	const { user } = getCurrentUser();

	const dbx = new Dropbox({
		fetch,
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
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

const createWorkspace = async (ceprMeta: WorkspaceCeprMeta, paths: Array<string>): Promise<WorkspaceCreateResponse> => {
	const { user } = getCurrentUser();

	const dbx = new Dropbox({
		fetch,
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		selectUser: user.team_member_id,
	});

	try {
		const workspaceSubfolders: Array<DropboxTypes.files.FolderMetadata> = [];

		const workspaceFolder = <DropboxTypes.sharing.SharedFolderMetadata>await dbx.sharingShareFolder({
			path: `${ceprMeta.rootFolder}/${ceprMeta.name}`,
			member_policy: { '.tag': 'team' },
			acl_update_policy: { '.tag': 'owner' },
		});

		const workspaceHydrate = await dbx.filesCreateFolderBatch({
			force_async: false,
			paths: paths.map(p => `${ceprMeta.rootFolder}/${ceprMeta.name}/${p}`),
		});

		/**
		 * @TODO
		 * We'll need to handle the scenario where the job may be processed asynchronously
		 **/
		if (workspaceHydrate['.tag'] === 'complete') {
			workspaceHydrate.entries.forEach(folder => {
				/**
				 * @TODO
				 * handle folder creation errors
				 **/
				if (folder['.tag'] === 'success') {
					workspaceSubfolders.push(folder.metadata);
				}
			});
		}

		return {
			workspace: {
				creator: user,
				ceprMeta: { ...ceprMeta, createdAt: new Date().toISOString() },
				projects: [],
				workspaceFolder,
				workspaceSubfolders,
			},
		};
	} catch (e) {
		return { error: new DropboxRequestError(e, e) };
	}
};

export {
	addMemberToWorkspace,
	createProject,
	createWorkspace,
	getActiveMembers,
	getCurrentUserFolders,
	getMemberByEmail,
	getWorkspaceMembers,
	getWorkspaceTemplateId,
	removeMemberFromWorkspace,
};
