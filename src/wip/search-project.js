import React from 'react';
const { shell } = window.require('electron');
const remote = window.require('electron').remote;
const app = remote.app;

class SearchProject extends React.Component {
	constructor() {
		super();
		this.state = { workspaceName: '', projectName: '', productionTeam: '', owner: '' };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
		event.preventDefault();
	}

	handleClick(e, path) {
		var userHomePath = app.getPath('home');
		var projectFilePath = userHomePath + '/Dropbox (BBC Sandbox)' + e;
		console.log(projectFilePath);
		console.log(shell.openItem(projectFilePath));
	}

	handleItemInFolderClick(e, path) {
		var userHomePath = app.getPath('home');
		var projectFilePath = userHomePath + '/Dropbox (BBC Sandbox)' + e;
		console.log(projectFilePath);
		shell.showItemInFolder(projectFilePath);
	}

	handleSubmit(event) {
		alert('A name was submitted: ' + this.state);
		console.log(this.state);

		this.search();
		event.preventDefault();
	}

	searchByFields = {
		workspaceName: '',
		projectName: '',
		productionTeam: '',
		owner: '',
	};

	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	}

	search() {
		this.wsList = JSON.parse(localStorage.getItem('workspace')) || [];

		//First filter the workspaces based on matches for workspace name or/and production team
		var workspacesSearchResult = [];

		for (var count = 0; count < this.wsList.length; count++) {
			var wsMatch = false;
			var prodTeamMatch = false;

			if (this.state.workspaceName.length > 0 && this.wsList[count].workspaceName == this.state.workspaceName) {
				wsMatch = true;
			}
			if (
				this.state.productionTeam.length > 0 &&
				this.wsList[count].productionTeam == this.state.productionTeam
			) {
				prodTeamMatch = true;
			}

			//Case where both workspace and production team are included in the search
			if (wsMatch && prodTeamMatch) {
				workspacesSearchResult.push(this.wsList[count]);
			}

			//Case where only workspace is included in the search
			else if (wsMatch && !prodTeamMatch && this.state.productionTeam.length == 0) {
				workspacesSearchResult.push(this.wsList[count]);
			}

			//Case where only production team is included in the search
			else if (!wsMatch && prodTeamMatch && this.state.workspaceName.length == 0) {
				workspacesSearchResult.push(this.wsList[count]);
			}
		}

		this.wsList = workspacesSearchResult;
	}
	// handleClick (e,a) {
	//     console.log('this is create project');
	//     console.log(e);

	//     this.setState({render:'create-project-ui',currentWorkspace: e});
	// }

	wsList = [];

	divStyle = {
		color: 'black',
		border: '1px solid',
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 15,
		textAlign: 'left',
		position: 'relative',
	};

	divContainer = {
		textAlign: 'center',
		display: 'block',
		width: '50pc',
		marginTop: '25px',
		marginLeft: '25pc',
		position: 'relative',
		display: 'inline-block',
	};

	totalProjects = 0;
	render() {
		var action = 'project';
		this.wsList = JSON.parse(localStorage.getItem('workspace')) || [];
		// console.log(this.wsList.length);
		console.log('in projects page');
		console.log(this.wsList);

		var allProjects = [];
		for (var i = 0; i < this.wsList.length; i++) {
			if (this.wsList[i].projects != null) {
				var projects = this.wsList[i].projects;
				console.log(projects);
				allProjects = allProjects.concat(projects);
				console.log('size is' + allProjects.length);
			}
		}

		var totalProjects = allProjects.length;
		console.log('Total project exists are: ' + this.totalProjects);
		const listItems = allProjects.map(project => (
			<div style={this.divStyle}>
				<div style={{ margin: '10px', marginLeft: '20px', width: 'auto' }}>
					{project.projectName} &nbsp; &nbsp;{' '}
					<a href="#" onClick={this.handleClick.bind(this, project.projectPath)}>
						Open project
					</a>{' '}
					&nbsp;{' '}
					<a href="#" onClick={this.handleItemInFolderClick.bind(this, project.projectPath)}>
						Open Folder
					</a>
				</div>
			</div>
		));

		return (
			<div>
				<div style={this.divContainer}>
					<form onSubmit={this.handleSubmit}>
						<div style={this.divStyle}>
							<div>
								<h3>Search Projects</h3>
							</div>
							<div>
								<table>
									<tr>
										<td>
											<label>Workspace Name</label>
										</td>
										<td>
											<input
												type="text"
												value={this.state.workspaceName}
												onChange={this.handleChange}
												name="workspaceFilter"
											/>
										</td>
										<td>
											<label>Production Team</label>{' '}
										</td>
										<td style={{ marginLeft: '10px' }}>
											<select
												value={this.state.productionTeam}
												name="productionTeam"
												onChange={this.handleInputChange}
											>
												<option value="shortform">Shortform</option>
												<option value="sports-news">Sports News</option>
												<option value="worldcupteam">World Cup Team </option>
												<option value="wimbledon">Wimbledon team</option>
											</select>
										</td>
									</tr>
									<tr>
										<td>
											<label>Project Name</label>
										</td>
										<td>
											<input
												type="text"
												value={this.state.projectName}
												onChange={this.handleInputChange}
											/>
										</td>
										<td>
											<label>Owner</label>
										</td>
										<td>
											<input type="text" name="workspaceFilter" />
										</td>
									</tr>
									<tr>
										<td>&nbsp;</td>
										<td>&nbsp;</td>
										<td>&nbsp;</td>
										<td>&nbsp;</td>
										<td>&nbsp;</td>
										<td>
											<input type="submit" value="Search Projects" />
										</td>
									</tr>
								</table>
							</div>
						</div>
					</form>
				</div>
				<div style={this.divContainer} className="projects-form">
					<div>
						<h2>Projects</h2>
					</div>
					<div style={this.divStyle}>
						<b> {totalProjects} projects found</b>
					</div>
					{listItems}
				</div>
			</div>
		);
	}
}

export default SearchProject;
