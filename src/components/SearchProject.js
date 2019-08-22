import React from 'react';
import AppHeader from './AppHeader';
import SearchProjectUi from '../wip/search-project';

function SearchProject() {
	return (
		<>
			<AppHeader />
			<SearchProjectUi />
		</>
	);
}

SearchProject.displayName = 'SearchProject';

export default SearchProject;
