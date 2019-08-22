import React from 'react';
import ProjectObject from './workspace/project';

class CreateProjectUI extends React.Component {
	constructor(props) {
		super(props);
		this.deptDropboxPath = { value: '/sports-cepr/' };
		this.wsname = props.wsname;
		this.state = {
			workspace: '',
			projectName: '',
			projectTemplateToCopy: '',
			newProjectCreated: 'Success message',
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
		event.preventDefault();
	}

	handleSubmit(event) {
		// alert('A name was submitted: ' + this.state);
		console.log(this.state);
		console.log('Creating a new project....');
		this.state.workspace = this.wsname;
		this.createNewProject(this.state);
		event.preventDefault();
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	}

	createNewProject(state) {
		console.log('In new project creation');

		//1. Find the project template file path
		var projectTemplatePathToCopy = '';

		var templatePath = '/cepr-test/templates/project-templates/';

		// 1-a. Connect to dropbox
		var fetch = require('isomorphic-fetch'); // or another library of choice.
		var Dropbox = require('dropbox').Dropbox;
		var DropboxTeam = require('dropbox').DropboxTeam;
		var templateList = [];
		var listItems = null;

		var templateListJson = JSON.parse(localStorage.getItem('projectTemplateList'));

		for (var i = 0; i < templateListJson.length; i++) {
			console.log('projectTemplateToCopy:' + state.projectTemplateToCopy);
			console.log('templateListJson' + templateListJson[i].name);
			console.log('/cepr-test/' + this.state.workspace + '/Projects');
			console.log(templatePath + state.projectTemplateToCopy);
			if (state.projectTemplateToCopy == templateListJson[i].name) {
				console.log('got it');
				var projectToPath =
					'/cepr-test/' + this.state.workspace + '/Projects/' + this.state.projectName + '.prproj';
				var dbx = new Dropbox({
					accessToken: '-enter access token here',
					fetch: fetch,
					selectUser: 'dbmid:AADBTXkkDrFALtA9p24G"VHVoIBg46kiEZEQ',
				});
				dbx.filesCopy({
					from_path: templatePath + state.projectTemplateToCopy,
					to_path: projectToPath,
					allow_shared_folder: false,
					autorename: false,
					allow_ownership_transfer: false,
				})
					.then(function(response) {
						console.log(response);
						var workspaces = JSON.parse(localStorage.getItem('workspace'));
						for (var i = 0; i < workspaces.length; i++) {
							if (workspaces[i].workspaceName == state.workspace) {
								console.log('found the workspace');
								var project = new ProjectObject();
								project.projectName = state.projectName;
								project.projectPath = projectToPath;
								console.log(workspaces);
								if (workspaces[i].projects == null) {
									workspaces[i].projects = [];
								}
								workspaces[i].projects.push(project);
								console.log(workspaces);
								localStorage.setItem('workspace', JSON.stringify(workspaces));
								break;
							}
						}
					})
					.catch(function(error) {
						console.log(error);
					});
				break;
			}
		}

		//2. Copy to dropbox in the workspace
		//3. Rename the file to the actual project name
	}

	render() {
		var templateList = JSON.parse(localStorage.getItem('projectTemplateList'));

		let optionsHtml =
			templateList.length > 0 &&
			templateList.map((item, i) => {
				return (
					<option key={i} value={item.name}>
						{item.name}
					</option>
				);
			}, this);

		return (
			<form onSubmit={this.handleSubmit}>
				<div style={{ padding: '20px', marginRight: '20px' }}>
					<h4>Create new project in {this.wsname}</h4>
					<div style={{ margin: 10 }}>
						<label>
							Project name{' '}
							<input
								style={{ marginRight: '150px', float: 'right' }}
								type="text"
								name="projectName"
								value={this.state.projectName}
								size="35"
								onChange={this.handleInputChange}
							/>
						</label>
					</div>
					<div style={{ margin: 10 }}>
						<label>
							Host application
							<select
								style={{ marginRight: '150px', float: 'right' }}
								cols="70"
								value={this.state.projectTemplateToCopy}
								name="folderTemplate"
								onChange={this.handleInputChange}
							>
								<option value="ppro">Adobe Premiere pro</option>
								<option value="photoshop">Adobe Photoshop</option>
								<option value="avid">Avid</option>
								<option value="fcp">Final Cut Pro</option>
							</select>
						</label>
					</div>
					<div style={{ margin: 10 }}>
						<label style={{ marginRight: 10 }}>
							Project template
							<select
								name="projectTemplateToCopy"
								value={this.state.projectTemplate}
								style={{ marginRight: '150px', float: 'right' }}
								onChange={this.handleInputChange}
							>
								{optionsHtml}
							</select>
						</label>
					</div>
					<div>
						<input type="submit" value="Create project" style={{ marginRight: '150px', float: 'right' }} />
					</div>
				</div>
			</form>
		);
	}
}

export default CreateProjectUI;
