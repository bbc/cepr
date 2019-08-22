import React from 'react';
import AppHeader from './AppHeader';
import CreateWorkspaceUi from '../wip/workspace/create-workspace';

function CreateWorkspace() {
	return (
		<>
			<AppHeader />
			<CreateWorkspaceUi />
		</>
	);
}

CreateWorkspace.displayName = 'CreateWorkspace';

export default CreateWorkspace;
