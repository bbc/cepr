import React, { useEffect, useState } from 'react';
import { toJS } from 'mobx';
import classnames from 'classnames';
import GELIcon from '@bbc/igm-gel-icon';
import Select from '@bbc/igm-dropdown-select';
import { useStoreData } from '../store';
import { getFolderMembers } from '../services/DropboxService';

function ProjectCard({ project }) {
	const [showProjectMembers, setShowProjectMembers] = useState(false);
	const [projectMembers, setProjectMembers] = useState([]);

	const { removeMemberFromProject } = useStoreData(
		store => store.workspaceStore,
		workspaceStore => ({ removeMemberFromProject: workspaceStore.removeMemberFromProject })
	);

	console.log(toJS(project));

	useEffect(() => {
		if (showProjectMembers) {
			getFolderMembers(project.projectFolder.shared_folder_id).then(setProjectMembers);
		}
	}, [showProjectMembers, project]);

	return (
		<div className="cepr-card" key={project.projectFolder.id}>
			<div className="cepr-card__header">
				<p className="gel-long-primer-bold">{project.ceprMeta.name}</p>
			</div>

			<div className="cepr-card__body">
				{showProjectMembers && (
					<div style={{ margin: '16px 0' }}>
						<div className="gel-layout">
							<label className="gel-layout__item gel-2/3 igm-input__label">
								Select team member
								<Select onClear={() => {}} onChange={opt => {}} options={[]} isClearable isSearchable />
							</label>

							<label className="gel-layout__item gel-1/3 igm-input__label">
								Select access level
								<Select onClear={() => {}} onChange={opt => {}} options={[]} isClearable />
							</label>
						</div>

						<div className="gel-layout" style={{ marginTop: 16 }}>
							<div className="gel-layout__item gel-1/1">
								<button
									onClick={() => {}}
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
									{project.access_type['.tag'] === 'owner' && member.access_type['.tag'] !== 'owner' && (
										<button
											onClick={() => removeMemberFromProject(project, member)}
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
			</div>

			<div className="cepr-card__footer">
				<button className="cepr-btn cepr-btn--sm" onClick={() => setShowProjectMembers(!showProjectMembers)}>
					{showProjectMembers ? 'Cancel' : 'Add / Edit Users'}
				</button>
			</div>
		</div>
	);
}

export default ProjectCard;
