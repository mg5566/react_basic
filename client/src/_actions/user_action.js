import axios from 'axios'
import { LOGIN_USER } from './types'

export function loginUser(dataToSubmit) {
	// 서버에 보내자
	const request = axios.post('/api/users/login', dataToSubmit)
		.then(response => response.data)

	// reduxer 에 넘기는 작업이 필요합니다.
	return ({
		type: LOGIN_USER,
		payload: request,
	})


}
