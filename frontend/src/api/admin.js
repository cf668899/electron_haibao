import request from '@/request/index'
import { baseUrl } from '@/constant/request'
export function login(data) {
  return request({
    url: baseUrl + '/api/invite/invite/getByInviteCode',
    method: 'post',
    data,
  })
}
