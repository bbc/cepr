import React from 'react';
import { toJS } from 'mobx';
import AppHeader from './AppHeader';
import WorkspaceCard from './WorkspaceCard';
import { StoreContext, useStoreData } from '../store';

function CreateProject() {
	const { workspaces } = useStoreData(
		StoreContext,
		store => ({ workspaceStore: store.workspaceStore }),
		({ workspaceStore }) => ({ workspaces: workspaceStore.workspaces })
	);

	console.log({ workspaces: toJS(workspaces) });

	return (
		<>
			<AppHeader />
			<div className="gel-wrap">
				<div className="gel-layout__item gel-2/3">
					<h1 className="gel-great-primer-bold">Workspaces</h1>
					{workspaces.map(workspace => (
						<WorkspaceCard workspace={workspace} key={workspace.ceprMeta.createdAt} />
					))}
				</div>
			</div>
		</>
	);
}

CreateProject.displayName = 'CreateProject';

export default CreateProject;
