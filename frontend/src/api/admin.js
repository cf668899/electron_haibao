import request from '@/request/index'
import { baseUrl } from '@/constant/request'
export function login(data) {
  return request({
    url: baseUrl + '/api/invite/invite/getByInviteCode',
    method: 'post',
    data,
  })
}

export function logout(data){
  return request({
    url: baseUrl + '/api/com/accountLogout',
    method: 'post',
    data,
  })
}

//关联设备号
export function inviteDevice(data){
  return request({
    url: baseUrl + '/api/invite/inviteDevice/save',
    method: 'post',
    data,
  })
}

export function accountSave(data){
  return request({
    url: baseUrl + '/api/invite/inviteAccount/save',
    method: 'post',
    data
  })
}

export function removeAccount(data){
  return request({
    url: baseUrl + '/api/invite/inviteAccount/remove',
    method: 'post',
    data
  })
}