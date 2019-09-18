import React from 'react';
import { observer } from 'mobx-react-lite';
import AppHeader from './AppHeader';
import ProjectCard from './ProjectCard';
import WorkspaceCard from './WorkspaceCard';
import { useStoreData } from '../store';

const Workspaces = observer(() => {
	const { workspaceModels, activeWorkspace, setActiveWorkspaceId } = useStoreData(
		store => ({ workspaceStore: store.workspaceStore }),
		({ workspaceStore }) => ({
			workspaceModels: workspaceStore.workspaces,
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
					{workspaceModels.map(workspace => (
						<WorkspaceCard
							workspace={workspace}
							onProjectsClick={setActiveWorkspaceId}
							key={workspace.id}
						/>
					))}
				</div>
				{activeWorkspace && (
					<div className="gel-layout__item gel-1/3 workspace__projects-wrapper">
						<h2 className="gel-pica-bold">
							Showing {activeWorkspace.projectCount} projects from {activeWorkspace.state.ceprMeta.name}
						</h2>
						{activeWorkspace.projects.map(p => (
							<ProjectCard key={p.state.projectFolder.name} project={p} />
						))}
					</div>
				)}
			</div>
		</>
	);
});

Workspaces.displayName = 'Workspaces';

export default Workspaces;
