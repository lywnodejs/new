import ajax from '../utils/ajax'

/**
 * 查询团队列表
 * @param params
 */
 export function getTeamList(params: any) {
  return ajax.get('/team/list', params)
}

/**
 * 查询账户所属团队列表
 * @param params
 */
export function getUserTeamList(params: any) {
  return ajax.get('/team/user/list', params)
}

/**
 * 验证团队名称是否存在
 * @param params
 */
export function verifyTeamName(params: any) {
  return ajax.get('/team/name/verify', params)
}

/**
 * 加入团队
 * @param params
 */
export function applyTeam(params: any) {
  return ajax.post('/team/apply', params)
}

/**
 * 保存团队
 * @param params
 */
export function createTeam(params: any) {
  return ajax.post('/team/create', params)
}

/**
 * 审核列表
 * @param params
 */
export function getApproveList(params: any) {
  return ajax.get('/team/apply/list', params)
}

/**
 * 确认审核信息
 * @param params
 */
export function verifyApply(params: any) {
  return ajax.post('/team/verify', params)
}
