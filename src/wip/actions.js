import React from 'react';
import ReactDOM from 'react-dom';
import Container from './ui-container';
import ProjectTemplate from '../workspace/project-template';

class Actions extends React.Component {
	constructor() {
		super();
		this.loadProjectTemplates();
		this.state = { render: '' };
	}

	handleClick(e, type) {
		console.log('this is create workspace');
		console.log('lets render create workspace form');
		this.setState({ render: e });
	}

	loadProjectTemplates() {
		templateList = [];

		// Default root path, we should get this value from root path field Settings screen
		var templatePath = '/cepr-test/templates/project-templates/';
		// Step 1. Create folder for workspace in dropbox under departmnet root path

		// 1-a. Connect to dropbox
		var fetch = require('isomorphic-fetch'); // or another library of choice.
		var Dropbox = require('dropbox').Dropbox;
		var DropboxTeam = require('dropbox').DropboxTeam;
		var templateList = [];
		var listItems = null;

		var dbx = new Dropbox({
			accessToken: 'enter access token here',
			fetch: fetch,
			selectUser: 'dbmid:AADBTXkkDrFALtA9p24GVHVoIBg46kiEZEQ',
		});
		dbx.filesListFolder({ path: templatePath })
			.then(function(response) {
				// console.log(response);
				var templateListJson = response.entries;
				//   console.log(response.entries[0].name);
				console.log(templateListJson);

				for (var i = 0; i < templateListJson.length; i++) {
					var pt = new ProjectTemplate();
					pt.name = templateListJson[i].name;
					pt.path = templateListJson[i].path;
					templateList.push(pt);
				}

				localStorage.setItem('projectTemplateList', JSON.stringify(templateList));
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	render() {
		var action = 'workspace';
		return (
			<div>
				<div style={{ padding: '5px', paddingBottom: '10px' }}>
					{' '}
					<b>Creative Edit Project Repository</b>
				</div>
				<div className="App" style={{ padding: '10px', border: '1px solid' }}>
					<ul style={{ display: 'inline' }}>
						<a href="#" onClick={this.handleClick.bind(this, 'settings')}>
							Settings
						</a>
					</ul>
					<ul style={{ display: 'inline' }}>
						<a href="#" onClick={this.handleClick.bind(this, 'workspace')}>
							Create workspace
						</a>
					</ul>
					<ul style={{ display: 'inline' }}>
						<a href="#" onClick={this.handleClick.bind(this, 'project')}>
							View Workspaces
						</a>
					</ul>
					<ul style={{ display: 'inline' }}>
						<a href="#" onClick={this.handleClick.bind(this, 'search-project')}>
							Search projects
						</a>
					</ul>
					<ul style={{ display: 'inline' }}>
						<a href="#" onClick={this.handleClick.bind(this, 'view-project-template')}>
							Project Templates
						</a>
					</ul>
				</div>
				{this.state.render == '' ? null : <Container state={this.state.render} />}
			</div>
		);
	}
}

export default Actions;
