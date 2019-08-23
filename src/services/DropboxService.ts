import { DropboxTeam } from 'dropbox';
import fetch from 'isomorphic-fetch'; // or another library of choice.

class DropboxRequestError extends Error {
	error?: string;

	constructor(msg: string, error?: string) {
		super(msg);
		this.error = error;
	}
}

const getMemberByEmail = async (email: string) => {
	const dbx = new DropboxTeam({
		accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN,
		fetch: fetch,
	});

	try {
		const [member] = await dbx.teamMembersGetInfo({ members: [{ email, '.tag': 'email' }] });

		if (member['.tag'] === 'id_not_found') {
			throw new DropboxRequestError(member['.tag'], member['.tag']);
		}

		return { member };
	} catch (e) {
		if (e.error && e.error.includes(`did not match pattern`)) {
			return { error: 'Please provide a valid email address' };
		}

		if (e.error && e.error === 'id_not_found') {
			return { error: 'User not found' };
		}

		return {
			error: 'An unexpected error occurred. Please try again later',
		};
	}
};

export { getMemberByEmail };
