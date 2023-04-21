import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

//  获取基线规则列表
export function getBaselineRuleList(params) {
    return ajax.post(API.getBaselineRuleList, params)
}

//  创造基线规则
export function createBaselineRule(params) {
    return ajax.post(API.createBaselineRule, params)
}

//  更新基线规则
export function updateBaselineRule(params) {
    return ajax.post(API.updateBaselineRule, params)
}

//  删除基线规则
export function deleteBaselineRule(params) {
    return ajax.post(API.deleteBaselineRule, params)
}

//  测试基线规则
export function testBaselineRule(params) {
    return ajax.post(API.testBaselineRule, params)
}
