// OLDER IMPLEMENTATION - keep it around for now
// const workspaceSubfolders: Array<DropboxTypes.files.FolderMetadata> = [];

// const workspaceFolder = <DropboxTypes.files.FolderMetadata>await dbx.filesCreateFolder({
// 	path: `${ceprMeta.rootFolder}/${ceprMeta.name}`,
// });

// const projectsRootFolder = <DropboxTypes.files.FolderMetadata>await dbx.filesCreateFolder({
// 	path: `${ceprMeta.rootFolder}/${ceprMeta.name}/${projectsRootName}`,
// });

// const workspaceHydrate = await dbx.filesCreateFolderBatch({
// 	force_async: false,
// 	paths: paths.map(p => `${ceprMeta.rootFolder}/${ceprMeta.name}/${p}`),
// });

// /**
//  * @TODO
//  * We'll need to handle the scenario where the job may be processed asynchronously
//  **/
// if (workspaceHydrate['.tag'] === 'complete') {
// 	workspaceHydrate.entries.forEach(folder => {
// 		/**
// 		 * @TODO
// 		 * handle folder creation errors
// 		 **/
// 		if (folder['.tag'] === 'success') {
// 			workspaceSubfolders.push(folder.metadata);
// 		} else {
// 			throw new DropboxRequestError('error creating folder', JSON.stringify(folder));
// 		}
// 	});
// }

// return {
// 	workspace: {
// 		creator: user,
// 		ceprMeta: { ...ceprMeta, createdAt: new Date().toISOString() },
// 		projects: [],
// 		projectsRootFolder,
// 		workspaceFolder,
// 		workspaceSubfolders,
// 	},
// };
