import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

//  创建白盒规则
export function createWhiteRule(params) {
    return ajax.post(API.createWhiteRule, params)
}

//  获取白盒列表
export function getWhiteRule(queryParam) {
    return ajax.post(API.getWhiteRule, queryParam)
}

//  更新白盒列表
export function updateWhiteRule(params) {
    return ajax.post(API.updateWhiteRule, params)
}

//  禁用白盒规则
export function disableWhiteRule(id) {
    return ajax.post(API.disableWhiteRule, {
        white_rule_id: id
    })
}

//  启用白盒规则
export function enableWhiteRule(id) {
    return ajax.post(API.enableWhiteRule, {
        white_rule_id: id
    })
}
