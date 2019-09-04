import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import GELIcon from '@bbc/igm-gel-icon';
import Select from '@bbc/igm-dropdown-select';
import { useStoreData } from '../store';
import { getFolderMembers } from '../services/DropboxService';

const ProjectCard = observer(({ workspace, project }) => {
	const { addMemberToProject, allUsers, projectAccessLevels, removeMemberFromProject, user } = useStoreData(
		store => ({ workspaceStore: store.workspaceStore, userStore: store.userStore }),
		({ workspaceStore, userStore }) => ({
			addMemberToProject: workspaceStore.addMemberToProject,
			allUsers: userStore.members,
			projectAccessLevels: workspaceStore.projectAccessLevels,
			removeMemberFromProject: workspaceStore.removeMemberFromProject,
			user: userStore.member,
		})
	);

	const [showProjectMembers, setShowProjectMembers] = useState(false);
	const [projectMembers, setProjectMembers] = useState([]);
	const [newProjectMember, setNewProjectMemberState] = useState({
		access_level: { '.tag': undefined },
		member: { '.tag': 'dropbox_id', dropbox_id: undefined },
	});

	const setProjectMemberId = useCallback(
		value =>
			setNewProjectMemberState({
				...newProjectMember,
				member: { '.tag': 'dropbox_id', dropbox_id: value },
			}),
		[newProjectMember]
	);

	const setProjectMemberAccessLevel = useCallback(
		value =>
			setNewProjectMemberState({
				...newProjectMember,
				access_level: { '.tag': value },
			}),
		[newProjectMember]
	);

	console.log(project.ceprMeta.name, workspace.members);

	useEffect(() => {
		if (showProjectMembers) {
			getFolderMembers(workspace.creator.team_member_id, project.projectFolder.shared_folder_id).then(members => {
				console.log('got folder members', project.ceprMeta.name, members);
				setProjectMembers(members);
			});
		}
		// eslint-disable-next-line
	}, [
		workspace.members,
		workspace.creator.team_member_id,
		showProjectMembers,
		project.projectFolder.shared_folder_id,
	]);

	const newMemberOptions = allUsers
		.filter(
			member =>
				// remove members that already belong to the project
				!projectMembers.some(wm => wm.user.team_member_id === member.profile.team_member_id) &&
				member.profile.team_member_id !== user.team_member_id
		)
		.map(member => ({
			description: member.profile.name.display_name,
			label: member.profile.email,
			value: member.profile.team_member_id,
		}));

	return (
		<div className="cepr-card" key={project.projectFolder.id} style={{ marginBottom: 16 }}>
			<div className="cepr-card__header">
				<p className="gel-long-primer-bold">{project.ceprMeta.name}</p>
			</div>

			<div className="cepr-card__body">
				<div style={{ margin: '5px 0' }} className="gel-brevier">
					<b>Project Path:</b> {project.projectFolder.path_lower}
					<br />
					<b>Project Template:</b> {project.ceprMeta.template}
				</div>

				{showProjectMembers && (
					<div style={{ margin: '16px 0' }}>
						<div className="gel-layout">
							<label className="gel-layout__item gel-2/3 igm-input__label">
								Team member
								<Select
									onChange={opt => setProjectMemberId(opt.value)}
									onClear={setProjectMemberId}
									options={newMemberOptions}
									isClearable
									isSearchable
								/>
							</label>

							<label className="gel-layout__item gel-1/3 igm-input__label">
								Access level
								<Select
									onClear={setProjectMemberAccessLevel}
									onChange={opt => setProjectMemberAccessLevel(opt.value)}
									options={projectAccessLevels}
									isClearable
								/>
							</label>
						</div>

						<div className="gel-layout" style={{ marginTop: 16 }}>
							<div className="gel-layout__item gel-1/1">
								<button
									onClick={() => {
										addMemberToProject(workspace, project, newProjectMember)
											.then(() =>
												getFolderMembers(
													workspace.creator.team_member_id,
													project.projectFolder.shared_folder_id
												)
											)
											.then(setProjectMembers);
									}}
									disabled={false}
									className="gel-layout__item gel-1 cepr-btn cepr-btn--block"
								>
									Add member
								</button>
							</div>
						</div>

						<h3>Member list</h3>

						<ul className="workspace-card__member-list">
							{projectMembers.map(member => (
								<li className="gel-brevier">
									<span className="workspace-card__member-name-wrapper">
										<GELIcon type="signout" />
										<strong>{member.user.display_name}</strong>
									</span>
									<span className="workspace-card__member-name-wrapper">
										<span
											className={classnames([
												'cepr-badge',
												`cepr-badge--${member.access_type['.tag']}`,
											])}
										>
											{member.access_type['.tag']}
										</span>
										{project.projectFolder.access_type['.tag'] === 'owner' &&
											member.access_type['.tag'] !== 'owner' && (
												<button
													onClick={() =>
														removeMemberFromProject(workspace, project, member)
															.then(() =>
																getFolderMembers(
																	workspace.creator.team_member_id,
																	project.projectFolder.shared_folder_id
																)
															)
															.then(setProjectMembers)
													}
													className="cepr-btn cepr-btn--danger cepr-btn--sm"
													style={{ marginLeft: 8 }}
												>
													<GELIcon type="no" /> Remove
												</button>
											)}
									</span>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			<div className="cepr-card__footer">
				<button className="cepr-btn cepr-btn--sm" onClick={() => setShowProjectMembers(!showProjectMembers)}>
					{showProjectMembers ? 'Cancel' : 'Add / Edit Users'}
				</button>
			</div>
		</div>
	);
});

export default ProjectCard;
