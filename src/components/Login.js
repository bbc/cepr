import React from 'react';
import GELIcon from '@bbc/igm-gel-icon';
import Input from '@bbc/igm-input';
import Notification from '@bbc/igm-notification';
import { useStoreData } from '../store';

function Login({ history }) {
	const { authUser, email, error, setEmail } = useStoreData(
		store => store.userStore,
		userStore => ({
			authUser: userStore.authUser,
			email: userStore.email,
			error: userStore.error,
			setEmail: userStore.setEmail,
		})
	);

	const onAuthSuccess = () => history.push('/');
	const onBtnClick = () => authUser(onAuthSuccess);

	return (
		<div className="login">
			<div className="login__content">
				<p className="gel-great-primer-bold login__welcome-txt">
					Welcome to CEPR <sup>(ˈki pər)</sup>
				</p>
				<Notification
					className="login__error"
					icon={<GELIcon className="igm-notification__icon " type="alert" />}
					message={error}
					hidden={!error}
				/>
				<Input label="Email address" onChange={setEmail} onClickReset={setEmail} value={email} />
				<button className="login__btn gel-long-primer-bold" disabled={!email} onClick={onBtnClick}>
					Log in
				</button>
			</div>
		</div>
	);
}

Login.displayName = 'Login';

export default Login;
