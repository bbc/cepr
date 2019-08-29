import React, { useCallback, useState, useEffect } from 'react';
import classnames from 'classnames';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import GELIcon from '@bbc/igm-gel-icon';
import Input from '@bbc/igm-input';
import Select from '@bbc/igm-dropdown-select';
import { useStoreData, StoreContext } from '../store';
import { getWorkspaceMembers } from '../services/DropboxService';

function WorkspaceCard({ workspace }) {
	const {
		addMemberToWorkspace,
		canCreateProject,
		createProject,
		members,
		newProject,
		projectTemplates,
		removeMemberFromWorkspace,
		setNewProjectName,
		setNewProjectTemplate,
		setNewProjectWorkspace,
		workspaceAccessLevels,
	} = useStoreData(
		StoreContext,
		store => ({ workspaceStore: store.workspaceStore, userStore: store.userStore }),
		({ workspaceStore, userStore }) => ({
			addMemberToWorkspace: workspaceStore.addMemberToWorkspace,
			canCreateProject: workspaceStore.canCreateProject,
			createProject: workspaceStore.createProject,
			newProject: workspaceStore.newProject,
			projectTemplates: workspaceStore.projectTemplates,
			removeMemberFromWorkspace: workspaceStore.removeMemberFromWorkspace,
			setNewProjectName: workspaceStore.setNewProjectName,
			setNewProjectTemplate: workspaceStore.setNewProjectTemplate,
			setNewProjectWorkspace: workspaceStore.setNewProjectWorkspace,
			workspaceAccessLevels: workspaceStore.workspaceAccessLevels,
			members: userStore.members,
		})
	);

	const [newWorkspaceMember, setNewWorkspaceMemberState] = useState({
		member: { '.tag': 'dropbox_id' },
		access_level: { '.tag': 'viewer' },
	});

	const setNewWorkspaceMemberId = useCallback(
		value =>
			setNewWorkspaceMemberState({
				...newWorkspaceMember,
				member: { '.tag': 'dropbox_id', dropbox_id: value },
			}),
		[newWorkspaceMember]
	);

	const setNewWorkspaceMemberAccessLevel = useCallback(
		value =>
			setNewWorkspaceMemberState({
				...newWorkspaceMember,
				access_level: { '.tag': value },
			}),
		[newWorkspaceMember]
	);

	const [showAddMember, setShowAddMember] = useState(false);
	const [showAddProject, setShowAddProject] = useState(false);
	const [workspaceMembers, setWorkspaceMembers] = useState([]);

	const memberOptions = members
		.filter(member => !workspaceMembers.some(wm => wm.user.team_member_id === member.profile.team_member_id))
		.map(member => ({
			description: member.profile.name.display_name,
			label: member.profile.email,
			value: member.profile.team_member_id,
		}));

	const templateOptions = projectTemplates.map(template => ({
		label: template,
		value: template,
	}));

	useEffect(() => {
		if (showAddMember && workspace.workspaceFolder.shared_folder_id) {
			getWorkspaceMembers(workspace.workspaceFolder.shared_folder_id).then(setWorkspaceMembers);
		}
	}, [workspace.workspaceFolder.shared_folder_id, showAddMember]);

	return (
		<div className="cepr-card cepr-card--multi" key={workspace.ceprMeta.createdAt}>
			<div className="cepr-card__header">
				<h2 className="gel-pica-bold">{workspace.ceprMeta.name}</h2>
			</div>

			<div className="cepr-card__body">
				<div className="gel-minion">
					created by {workspace.creator.name.display_name} on{' '}
					{format(parseISO(workspace.ceprMeta.createdAt), 'do LLL yyyy')}
				</div>

				<div style={{ margin: '5px 0' }}>
					<b>Root Path:</b> {workspace.ceprMeta.rootFolder}/{workspace.ceprMeta.name}
					<br />
					<b>Production Team:</b> {workspace.ceprMeta.productionTeam.label}
				</div>

				{showAddMember && (
					<div style={{ margin: '16px 0' }}>
						<div className="gel-layout">
							<label className="gel-layout__item gel-2/3 igm-input__label">
								Select team member
								<Select
									onClear={setNewWorkspaceMemberId}
									onChange={opt => setNewWorkspaceMemberId(opt.value)}
									options={memberOptions}
									isClearable
									isSearchable
								/>
							</label>

							<label className="gel-layout__item gel-1/3 igm-input__label">
								Select access level
								<Select
									onClear={setNewWorkspaceMemberAccessLevel}
									onChange={opt => setNewWorkspaceMemberAccessLevel(opt.value)}
									options={workspaceAccessLevels}
									isClearable
								/>
							</label>
						</div>

						<div className="gel-layout" style={{ marginTop: 16 }}>
							<div className="gel-layout__item gel-1/1">
								<button
									onClick={() => addMemberToWorkspace(workspace, newWorkspaceMember)}
									disabled={!newWorkspaceMember.member.dropbox_id}
									className="gel-layout__item gel-1 cepr-btn cepr-btn--block"
								>
									Add member
								</button>
							</div>
						</div>

						<h3>Member list</h3>

						<ul className="workspace-card__member-list">
							{workspaceMembers.map(member => (
								<li>
									<GELIcon type="signout" />
									<strong>{member.user.display_name}</strong> <em>{member.user.email}</em>
									<span
										className={classnames([
											'cepr-badge',
											`cepr-badge--${member.access_type['.tag']}`,
										])}
									>
										{member.access_type['.tag']}
									</span>
									{workspace.workspaceFolder.access_type['.tag'] === 'owner' &&
										member.access_type['.tag'] !== 'owner' && (
											<button
												onClick={() => removeMemberFromWorkspace(workspace, member)}
												className="cepr-btn cepr-btn--danger cepr-btn--sm"
												style={{ marginLeft: 8 }}
											>
												<GELIcon type="no" /> Remove
											</button>
										)}
								</li>
							))}
						</ul>
					</div>
				)}

				{showAddProject && (
					<div style={{ margin: '16px 0' }}>
						<label className="igm-input__label">
							Select project template
							<Select
								options={templateOptions}
								onChange={({ value }) => setNewProjectTemplate(value)}
								isClearable
								isSearchable
							/>
						</label>
						<Input
							style={{ marginTop: 16 }}
							label="Project name"
							onChange={setNewProjectName}
							onClickReset={setNewProjectName}
							value={newProject.name}
						/>
						<button
							style={{ marginTop: 16 }}
							disabled={!canCreateProject}
							className="cepr-btn cepr-btn--block"
							onClick={() => createProject(() => {})}
						>
							create project
						</button>
					</div>
				)}
			</div>

			{workspace.workspaceFolder.access_type['.tag'] === 'owner' ||
			workspace.workspaceFolder.access_type['.tag'] === 'editor' ? (
				<div className="cepr-card__footer">
					<button className="cepr-btn cepr-btn--sm" disabled={!workspace.projects.length}>
						{workspace.projects.length} Projects{' '}
					</button>
					<button
						className="cepr-btn cepr-btn--sm"
						onClick={() => {
							setNewProjectWorkspace(workspace.workspaceFolder.shared_folder_id);
							setShowAddMember(false);
							setShowAddProject(!showAddProject);
						}}
					>
						{showAddProject ? 'Cancel' : 'Create new project'}
					</button>
					<button
						className="cepr-btn cepr-btn--sm"
						onClick={() => {
							setShowAddMember(!showAddMember);
							setShowAddProject(false);
						}}
					>
						{showAddMember ? 'Cancel' : 'Add / Edit members'}
					</button>
				</div>
			) : (
				<div className="cepr-card__footer">
					<button className="cepr-btn cepr-btn--sm" disabled={!workspace.projects.length}>
						{workspace.projects.length} Projects{' '}
					</button>
					<button className="cepr-btn cepr-btn--sm">Request access to this workspace</button>
				</div>
			)}
		</div>
	);
}

export default WorkspaceCard;
