import React from 'react';
import Select from '@bbc/igm-dropdown-select';

function FolderAddMemberForm({
	accessLevels,
	canAddMember,
	defaultAccessLevel,
	newMemberOptions,
	onAddMember,
	onTeamMemberChange,
	onTeamMemberClear,
	onAccessLevelChange,
	onAccessLevelClear,
}) {
	return (
		<>
			<div className="gel-layout">
				<label className="gel-layout__item gel-2/3 igm-input__label">
					Team member
					<Select
						onChange={onTeamMemberChange}
						onClear={onTeamMemberClear}
						options={newMemberOptions}
						isClearable
						isSearchable
					/>
				</label>

				<label className="gel-layout__item gel-1/3 igm-input__label">
					Access level
					<Select
						defaultValue={defaultAccessLevel}
						onChange={onAccessLevelChange}
						onClear={onAccessLevelClear}
						options={accessLevels}
					/>
				</label>
			</div>

			<div className="gel-layout" style={{ marginTop: 16 }}>
				<div className="gel-layout__item gel-1/1">
					<button
						className="gel-layout__item gel-1 cepr-btn cepr-btn--block"
						disabled={!canAddMember}
						onClick={onAddMember}
					>
						Add member
					</button>
				</div>
			</div>
		</>
	);
}

export default FolderAddMemberForm;
