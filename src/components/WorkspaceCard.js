import React, { useCallback, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import Select from '@bbc/igm-dropdown-select';
import Input from '@bbc/igm-input';

import FolderAddMemberForm from './FolderAddMemberForm';
import MemberList from './MemberList';
import { useStoreData } from '../store';

const WorkspaceCard = observer(({ workspace, onProjectsClick }) => {
	const {
		canCreateProject,
		createProject,
		newProjectMeta,
		projectTemplates,
		setNewProjectName,
		setNewProjectTemplate,
		setNewProjectWorkspace,
		workspaceAccessLevels,
	} = useStoreData(
		store => ({
			newProject: store.newProjectStore,
			workspaces: store.workspaceStore,
		}),
		({ newProject, workspaces }) => ({
			canCreateProject: newProject.canCreateProject,

			createProject: newProject.createProject,
			newProjectMeta: newProject.newProjectMeta,
			projectTemplates: newProject.projectTemplates,

			setNewProjectName: newProject.setName,
			setNewProjectTemplate: newProject.setTemplate,
			setNewProjectWorkspace: newProject.setWorkspaceId,

			workspaceAccessLevels: workspaces.accessLevels,
		})
	);

	const [showAddMember, setShowAddMember] = useState(false);
	const [showAddProject, setShowAddProject] = useState(false);

	const saveNewMember = useCallback(() => workspace.saveNewMember(), [workspace]);

	const setNewMemberMemberId = useCallback(({ value }) => workspace.setNewMemberMemberId(value), [workspace]);
	const setNewMemberAccessLevel = useCallback(({ value }) => workspace.setNewMemberAccessLevel(value), [workspace]);
	const setNewMemberDefaultAccessLevel = useCallback(
		() => workspace.setNewMemberAccessLevel(workspaceAccessLevels[1]),
		[workspace, workspaceAccessLevels]
	);

	useEffect(() => {
		if (showAddMember && workspace.projectCount) {
			workspace.syncMembers();
		}
	}, [showAddMember, workspace, workspace.projectCount]);

	return (
		<div className="cepr-card cepr-card--multi" key={workspace.state.ceprMeta.createdAt}>
			<div className="cepr-card__header">
				<h2 className="gel-pica-bold">{workspace.state.ceprMeta.name}</h2>
			</div>
			<div className="cepr-card__body">
				<div className="gel-minion">
					created by {workspace.creator.name.display_name} on{' '}
					{format(parseISO(workspace.state.ceprMeta.createdAt), 'do LLL yyyy')}
				</div>

				<div style={{ margin: '5px 0' }}>
					<b>Root Path:</b> {workspace.path}
					<br />
					<b>Production Team:</b> {workspace.state.ceprMeta.productionTeam.label}
				</div>

				{showAddMember && (
					<div style={{ margin: '16px 0' }}>
						<FolderAddMemberForm
							accessLevels={workspaceAccessLevels}
							canAddMember={workspace.canAddMember}
							defaultAccessLevel={workspaceAccessLevels[1]}
							newMemberOptions={workspace.newMemberOptions}
							onAccessLevelClear={setNewMemberDefaultAccessLevel}
							onAccessLevelChange={setNewMemberAccessLevel}
							onAddMember={saveNewMember}
							onTeamMemberChange={setNewMemberMemberId}
							onTeamMemberClear={setNewMemberMemberId}
						/>

						<MemberList
							members={workspace.members}
							onRemoveMember={workspace.removeMember}
							ownerEmail={workspace.creator.email}
							ownerName={workspace.creator.name.display_name}
							showRemoveMemberButton={workspace.currentUserIsOwner}
						/>
					</div>
				)}

				{showAddProject && (
					<div style={{ margin: '16px 0' }}>
						<label className="igm-input__label">
							Select project template
							<Select
								options={projectTemplates}
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
							value={newProjectMeta.name}
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
			<div className="cepr-card__footer">
				<button
					className="cepr-btn cepr-btn--sm"
					disabled={!workspace.projectCount}
					onClick={() => onProjectsClick(workspace.id)}
				>
					{workspace.projectCount} Projects{' '}
				</button>

				{(workspace.currentUserIsOwner || workspace.currentUserIsMember) && (
					<button
						className="cepr-btn cepr-btn--sm"
						onClick={() => {
							setNewProjectWorkspace(workspace.id);
							setShowAddMember(false);
							setShowAddProject(!showAddProject);
						}}
					>
						{showAddProject ? 'Cancel' : 'Create new project'}
					</button>
				)}

				{workspace.currentUserIsOwner && (
					<button
						className="cepr-btn cepr-btn--sm"
						onClick={() => {
							setShowAddMember(!showAddMember);
							setShowAddProject(false);
						}}
					>
						{showAddMember ? 'Cancel' : 'Add / Edit members'}
					</button>
				)}
			</div>
		</div>
	);
});

export default WorkspaceCard;
