import ajax from '../utils/ajax'

export function logoutUser() {
  return ajax.get('auth/logout')
}

/**
 * 用户登录信息
 */
export function getUserInfo() {
  return ajax.get('auth/user')
}

/**
 * 个人资料
 */
export function getUserDetailInfo() {
  return ajax.get('user/info')
}

/**
 * 消息中心
 */
export function getUserMessageInfo(params: any) {
  return ajax.get('/notice/list', params)
}

export function saveUserInfo(params: any) {
  return ajax.post('/user/modify', params)
}

export function setMessageReaded(params?: any) {
  return ajax.post('/notice/read', params)
}

export function removeMessage(params: any) {
  return ajax.post('/notice/delete', params)
}

/**
 * 积分明细
 */
export function getUserScoreInfo(params: any) {
  return ajax.get('/user/scores', params)
}

/**
 * 礼品兑换记录
 */
export function getUserPresentInfo(params: any) {
  return ajax.get('/gifts/deals', params)
}

/**
 * 获取奖励记录
 * @param params
 */
export function getUserRewardInfo(params: any) {
  return ajax.get('/gifts/act', params)
}

/**
 * 微信登录使用
 */
export function getAuthorState() {
  return ajax.get('/auth/state')
}

/**
 * 微博登录接口
 */
export function WXLogin(search: string) {
  return ajax.get('/auth/weixin' + search)
}

/**
 * 微博登录接口
 */
export function WBLogin(params: any) {
  return ajax.get('/auth/weibo' + params)
}

/**
 * qq登录接口
 */
export function QQLogin(params: any) {
  return ajax.get('/auth/qq' + params)
}

/**
 *
 * @param params 检查用户名是否重复
 */
export function checkUserName(params: any) {
  return ajax.get('/user/checkUserName', params)
}
