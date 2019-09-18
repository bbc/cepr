import { action, computed, observable } from 'mobx';
import BaseModel from './BaseModel';

class DropboxFolderModel extends BaseModel {
	@observable
	membersState: DropboxFolderModelState;

	@observable
	newMember: NewFolderMember = {
		access_level: {
			'.tag': 'viewer',
		},
		member: {
			'.tag': 'dropbox_id',
			dropbox_id: '',
		},
	};

	constructor(store: RootStore, state: DropboxFolderModelState) {
		super(store);
		this.membersState = state;
	}

	@computed
	get canAddMember() {
		return !!this.newMember.member.dropbox_id;
	}

	@computed
	get creator() {
		return this.membersState.creator;
	}

	@computed
	get members() {
		return this.membersState.members
			.concat()
			.sort((a, b) => (a.profile.name.display_name < b.profile.name.display_name ? -1 : 1));
	}

	@computed
	get newMemberProfile() {
		return <DropboxTypes.team.TeamMemberInfo>(
			this.store.userStore.members.find(m => m.profile.team_member_id === this.newMember.member.dropbox_id)
		);
	}

	@computed
	get nonMemberUsers(): DropboxTypes.team.TeamMemberInfo[] {
		return this.store.userStore.members.filter(
			// remove all members that are already a member of the workspace, or are the workspace creator
			member =>
				!this.membersState.members.some(wm => wm.profile.team_member_id === member.profile.team_member_id) &&
				member.profile.team_member_id !== this.user.team_member_id
		);
	}

	@computed
	get nonMemberUserOptions(): SelectOption<string>[] {
		return this.nonMemberUsers.map(member => ({
			description: member.profile.name.display_name,
			label: member.profile.email,
			value: member.profile.team_member_id,
		}));
	}

	@action.bound
	setMembers(members: DropboxTypes.team.TeamMemberInfo[]) {
		this.membersState.members = members;
	}

	@action.bound
	setNewMemberAccessLevel(value: DropboxTypes.sharing.AccessLevel) {
		this.newMember.access_level = value;
	}

	@action.bound
	setNewMemberMemberId(value: string) {
		this.newMember.member.dropbox_id = value;
	}
}

export default DropboxFolderModel;
