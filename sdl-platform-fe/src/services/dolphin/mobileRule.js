import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

//  创建白盒规则
export function createMobileRule(params) {
    return ajax.post(API.createMobileRule, params)
}

//  获取白盒列表
export function getMobileRule(queryParam) {
    return ajax.post(API.getMobileRule, queryParam)
}

//  更新白盒列表
export function updateMobileRule(params) {
    return ajax.post(API.updateMobileRule, params)
}

//  禁用白盒规则
export function disableMobileRule(id) {
    return ajax.post(API.disableMobileRule, {
        mobile_rule_id: id
    })
}

//  启用白盒规则
export function enableMobileRule(id) {
    return ajax.post(API.enableMobileRule, {
        mobile_rule_id: id
    })
}
