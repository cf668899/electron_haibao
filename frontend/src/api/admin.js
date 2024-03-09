import request from '@/request/index'
export function login(params) {
	return request({
		url: '/api/integration/user/login',
		method: 'post',
		params
	})
}
