import React from 'react';
import classnames from 'classnames';

import GELIcon from '@bbc/igm-gel-icon';

function MemberList({ members, onRemoveMember, ownerEmail, ownerName, showEmails = true, showRemoveMemberButton }) {
	return (
		<>
			<h3>Member list</h3>

			<ul className="member-list">
				<li>
					<span className="member-list__member-name-wrapper">
						<GELIcon type="signout" />
						<strong>{ownerName}</strong> {showEmails && <em>{ownerEmail}</em>}
					</span>
					<span className={classnames(['cepr-badge', 'cepr-badge--owner'])}>owner</span>
				</li>

				{members.map(member => (
					<li key={member.profile.team_member_id}>
						<span className="member-list__member-name-wrapper">
							<GELIcon type="signout" />
							<strong>{member.profile.name.display_name}</strong>{' '}
							{showEmails && <em>{member.profile.email}</em>}
						</span>
						{showRemoveMemberButton && (
							<button
								onClick={() => onRemoveMember(member)}
								className="cepr-btn cepr-btn--danger cepr-btn--sm"
								style={{ marginLeft: 8, justifySelf: 'flex-end' }}
							>
								<GELIcon type="no" /> Remove
							</button>
						)}
					</li>
				))}
			</ul>
		</>
	);
}

export default MemberList;
