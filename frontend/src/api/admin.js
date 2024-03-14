import request from '@/request/index'
export function login(data) {
	return request({
		url: '/api/invite/invite/getByInviteCode',
		method: 'post',
		data
	})
}
