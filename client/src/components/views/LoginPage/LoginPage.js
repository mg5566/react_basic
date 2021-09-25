import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from "../../../_actions/user_action"

function LoginPage(props) {
	const dispatch = useDispatch();

	// 입력받은 email 과 password 의 state
	const [Email, setEmail] = useState("");
	const [Password, setPassword] = useState("");

	// email 과 password 를 입력받을때 state 를 변경할 핸들러
	const onEmailHandler = (event) => {
		setEmail(event.currentTarget.value);
	};
	const onPasswordHandler = (event) => {
		setPassword(event.currentTarget.value);
	};
	const onSubmitHandler = (event) => {
		event.preventDefault();  // 이게 있으면 button 을 눌러도 refresh 안된다.

		console.log('Email:', Email);
		console.log('Password:', Password);

		let body = {
			email: Email,
			password: Password,
		}  // 이 객체는 server index.js 에서 사용하는지 확인해야합니다.

		// redux
		dispatch(loginUser(body))
			.then(response => {
				if (response.payload.loginSuccess) {
					props.history.push('/')
				} else {
					alert("error");
				}
			})
		/* redux action 으로 보냈습니다.
		// 서버에 보내자
		axios.post('/api/users/login', body)
		.then(response => {

		})
		*/
	}

	return (
		<div style={{
			display: 'flex', justifyContent: 'center', alignItems: 'center',
			width: '100%', height: '100vh'
		}}>

			<form style={{ display: 'flex', flexDirection: 'column' }}
				onSubmit={onSubmitHandler}
			>
				<label>Email</label>
				<input type="email" value={Email} onChange={onEmailHandler} />
				<label>Password</label>
				<input type="password" value={Password} onChange={onPasswordHandler} />
				<br />
				<button>
					Login
				</button>

			</form>

		</div>
	)
}

export default LoginPage
