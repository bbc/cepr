import React from 'react';
import NavigationHeader from '@bbc/igm-navigation-header';
import { Link } from 'react-router-dom';
import routes from '../routes';

const renderLinks = () =>
	routes
		.filter(r => r.authed)
		.map((r, key) => (
			<Link to={r.path} key={key} className="igm-navigation-header__item gel-brevier">
				{r.text}
			</Link>
		));

function AppHeader() {
	return <NavigationHeader leftChildren={renderLinks} showBlocks />;
}

export default AppHeader;
