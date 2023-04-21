import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/admin'

//  获取
export function getSecurityBpList(params) {
    return ajax.post(API.getSecurityBpList, params)
}

//  新建
export function createSecurityBp(securityBp) {
    return ajax.post(API.createSecurityBp, {'securityBp': securityBp})
}

//  删除
export function deleteSecurityBp(securityBpId) {
    return ajax.post(API.deleteSecurityBp, {'securityBpId': securityBpId})
}

//  更新
export function updateSecurityBp(securityBp) {
    return ajax.post(API.updateSecurityBp, {'securityBp': securityBp})
}

export function deleteBaselineSecurityBp(params) {
    return ajax.post(API.deleteBaselineSecurityBp, params)
}

export function updateBaselineSecurityBp(params) {
    return ajax.post(API.updateBaselineSecurityBp, params)
}

export function createBaselineSecurityBp(params) {
    return ajax.post(API.createBaselineSecurityBp, params)
}

export function listAllBaselineSecurityBp(params) {
    return ajax.post(API.listAllBaselineSecurityBp, params)
}

export function testBaselineSecurityBp(params) {
    return ajax.post(API.testBaselineSecurityBp, params)
}

