import React from 'react';
import { observer } from 'mobx-react-lite';
import AppHeader from './AppHeader';
import ProjectCard from './ProjectCard';
import WorkspaceCard from './WorkspaceCard';
import { useStoreData } from '../store';

const Workspaces = observer(() => {
	const { workspaces, activeWorkspace, setActiveWorkspaceId } = useStoreData(
		store => ({ workspaceStore: store.workspaceStore }),
		({ workspaceStore }) => ({
			workspaces: workspaceStore.workspaces,
			activeWorkspace: workspaceStore.activeWorkspace,
			setActiveWorkspaceId: workspaceStore.setActiveWorkspaceId,
		})
	);

	return (
		<>
			<AppHeader />
			<div className="gel-wrap">
				<div className="gel-layout__item gel-2/3">
					<h1 className="gel-great-primer-bold">Workspaces</h1>
					{workspaces.map(workspace => (
						<WorkspaceCard
							workspace={workspace}
							onProjectsClick={setActiveWorkspaceId}
							key={workspace.ceprMeta.createdAt}
						/>
					))}
				</div>
				{activeWorkspace && (
					<div className="gel-layout__item gel-1/3 workspace__projects-wrapper">
						<h2 className="gel-pica-bold">
							Showing {activeWorkspace.projects.length} projects from {activeWorkspace.ceprMeta.name}
						</h2>
						{activeWorkspace.projects.map(p => (
							<ProjectCard project={p} workspace={activeWorkspace} />
						))}
					</div>
				)}
			</div>
		</>
	);
});

Workspaces.displayName = 'Workspaces';

export default Workspaces;
