import React from 'react';
import Input from '@bbc/igm-input';
import { StoreContext, useStoreData } from '../store';

function Login({ history }) {
	const { email, setEmail } = useStoreData(
		StoreContext,
		store => store.userStore,
		userStore => ({ email: userStore.email, setEmail: userStore.setEmail })
	);

	const onInputChange = value => setEmail(value);
	const onBtnClick = () => history.push('/');

	return (
		<div className="login">
			<div className="login__content">
				<p className="gel-great-primer-bold login__welcome-txt">
					Welcome to CEPR <sup>(ˈki pər)</sup>
				</p>
				<Input label="Email address" onChange={onInputChange} onClickReset={setEmail} value={email} />
				<button className="login__btn gel-long-primer-bold" onClick={onBtnClick}>
					Log in
				</button>
			</div>
		</div>
	);
}

Login.displayName = 'Login';

export default Login;
