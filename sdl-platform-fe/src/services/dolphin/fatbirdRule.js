import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

//  创建Fatbird规则
export function createFatbirdRule(params) {
    return ajax.post(API.createFatbirdRule, params)
}

//  更新Fatbird规则
export function updateFatbirdRule(params) {
    return ajax.post(API.updateFatbirdRule, params)
}
