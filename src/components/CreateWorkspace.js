import React, { useState } from 'react';
import AppHeader from './AppHeader';
import Notification from '@bbc/igm-notification';
import { StoreContext, useStoreData } from '../store';
import Select from '@bbc/igm-dropdown-select';
import Input from '@bbc/igm-input';

function CreateWorkspace() {
	const {
		createWorkspace,
		folderTemplates = [],
		productionTeams = [],
		setWSFolder,
		setWSName,
		setWSProductionTeam,
	} = useStoreData(
		StoreContext,
		store => ({
			workspace: store.workspaceStore,
		}),
		({ workspace }) => ({
			createWorkspace: workspace.createWorkspace,
			folderTemplates: workspace.folderTemplates,
			productionTeams: workspace.productionTeams,
			setWSFolder: workspace.setNewItemFolderTemplate,
			setWSName: workspace.setNewItemName,
			setWSProductionTeam: workspace.setNewItemProductionTeam,
		})
	);

	const [workspaceCreateMessage, setWorkspaceCreateMessage] = useState('');

	return (
		<>
			<AppHeader />
			<div className="gel-wrap">
				<Notification
					className="login__error"
					message={workspaceCreateMessage}
					hidden={!workspaceCreateMessage.length}
				/>
				<div className="gel-layout__item gel-1/2">
					<h1 className="gel-great-primer-bold">Create Workspace</h1>
					<div className="cepr-card">
						<Input label="Workspace name" onChange={setWSName} onClickReset={setWSName} />
						<div className="igm-input">
							<label className="igm-input__label">
								Production team
								<Select
									isClearable
									useDropdownIndicator
									options={productionTeams}
									onChange={setWSProductionTeam}
								/>
							</label>
						</div>
						<div className="igm-input">
							<label className="igm-input__label">
								Folder template
								<Select
									isClearable
									useDropdownIndicator
									options={folderTemplates}
									onChange={setWSFolder}
								/>
							</label>
						</div>
						<div className="cepr-card__footer">
							<button
								className="cepr-btn"
								onClick={() =>
									createWorkspace(workspace =>
										setWorkspaceCreateMessage(
											`Workspace ${workspace.ceprMeta.name} created successfully`
										)
									)
								}
							>
								Create workspace
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

CreateWorkspace.displayName = 'CreateWorkspace';

export default CreateWorkspace;
