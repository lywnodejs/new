import request from '@/core/request'

//登录
export function userLogin(data) {
  return request({
    url: 'api/user/userLogin',
    method: 'post',
    data
  })
}
//退出
export function userLogout(data) {
  return request({
    url: '/user/userLogout',
    method: 'post',
    data
  })
}

