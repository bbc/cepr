import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import FolderAddMemberForm from './FolderAddMemberForm';
import MemberList from './MemberList';

import { useStoreData } from '../store';

const ProjectCard = observer(({ project }) => {
	const { projectAccessLevels } = useStoreData(
		store => ({ projectStore: store.projectStore }),
		({ projectStore }) => ({
			projectAccessLevels: projectStore.accessLevels,
		})
	);

	const [showProjectMembers, setShowProjectMembers] = useState(false);

	const saveNewMember = useCallback(() => project.saveNewMember(), [project]);

	const setNewMemberMemberId = useCallback(({ value }) => project.setNewMemberMemberId(value), [project]);
	const setNewMemberAccessLevel = useCallback(({ value }) => project.setNewMemberAccessLevel(value), [project]);
	const setNewMemberDefaultAccessLevel = useCallback(() => project.setNewMemberAccessLevel(projectAccessLevels[1]), [
		project,
		projectAccessLevels,
	]);

	useEffect(() => {
		if (showProjectMembers) {
			project.syncMembers();
		}
	}, [showProjectMembers, project]);

	return (
		<div className="cepr-card" style={{ marginBottom: 16 }}>
			<div className="cepr-card__header">
				<p className="gel-long-primer-bold">
					{project.state.ceprMeta.name} {project.state.projectFolder.name.split('_').pop()}
				</p>
			</div>

			<div className="cepr-card__body">
				<div style={{ margin: '5px 0' }} className="gel-brevier">
					<b>Project Path:</b> {project.state.projectFolder.path_lower}
					<br />
					<b>Project Template:</b> {project.state.ceprMeta.template}
				</div>

				<div style={{ margin: '5px 0' }}>
					<button className="cepr-btn cepr-btn--sm" onClick={project.launch} style={{ marginTop: 16 }}>
						Launch Project
					</button>

					<button
						className="cepr-btn cepr-btn--sm"
						onClick={project.createNewVersion}
						style={{ marginTop: 16 }}
					>
						Create new version
					</button>

					{(project.currentUserIsOwner || project.currentUserIsMember) && (
						<button
							className="cepr-btn cepr-btn--sm"
							onClick={project.copyToUsersDropbox}
							style={{ marginTop: 16 }}
						>
							Copy to my Dropbox
						</button>
					)}

					<button
						className="cepr-btn cepr-btn--sm"
						onClick={project.createDownloadLink}
						style={{ marginTop: 16 }}
					>
						Get download Link
					</button>

					{!!project.downloadLink && (
						<a
							className="cepr-btn cepr-btn--sm"
							download
							href={project.downloadLink}
							style={{ marginTop: 16 }}
						>
							Download project
						</a>
					)}
				</div>

				{showProjectMembers && (
					<div style={{ margin: '16px 0' }}>
						<FolderAddMemberForm
							accessLevels={projectAccessLevels}
							canAddMember={project.canAddMember}
							defaultAccessLevel={projectAccessLevels[1]}
							newMemberOptions={project.nonMemberUserOptions}
							onAccessLevelClear={setNewMemberDefaultAccessLevel}
							onAccessLevelChange={setNewMemberAccessLevel}
							onAddMember={saveNewMember}
							onTeamMemberChange={setNewMemberMemberId}
							onTeamMemberClear={setNewMemberMemberId}
						/>

						<MemberList
							members={project.members}
							onRemoveMember={project.removeMember}
							ownerEmail={project.workspace.creator.email}
							ownerName={project.workspace.creator.name.display_name}
							showEmails={false}
							showRemoveMemberButton={project.workspace.currentUserIsOwner}
						/>
					</div>
				)}
			</div>

			{project.currentUserIsOwner ? (
				<div className="cepr-card__footer">
					<button
						className="cepr-btn cepr-btn--sm"
						onClick={() => setShowProjectMembers(!showProjectMembers)}
					>
						{showProjectMembers ? 'Cancel' : 'Add / Edit Users'}
					</button>
				</div>
			) : null}
		</div>
	);
});

export default ProjectCard;
