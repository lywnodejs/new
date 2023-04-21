import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/admin'

//  新建
export function createSdlSecurityBp(param) {
  return ajax.post(API.createSdlSecurityBp, param)
}

//  删除
export function deleteSdlSecurityBp(securityBpId) {
  return ajax.post(API.deleteSdlSecurityBp, {'id': securityBpId, 'is_del': 1})
}

// 查询
export function getSdlSecurityBp() {
  return ajax.get(API.getSdlSecurityBp, {
    limit: 200,
    page: 1
  })
}
