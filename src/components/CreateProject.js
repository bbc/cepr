import React from 'react';
import AppHeader from './AppHeader';
import CreateProjectUi from '../wip/create-project';

function CreateProject() {
	return (
		<>
			<AppHeader />
			<CreateProjectUi />
		</>
	);
}

CreateProject.displayName = 'CreateProject';

export default CreateProject;
