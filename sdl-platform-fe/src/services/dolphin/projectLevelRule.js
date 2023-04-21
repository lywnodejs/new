import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

//  获取项目等级规则列表
export function getProjectLevelRuleList(params) {
    return ajax.post(API.getProjectLevelRuleList, params)
}

//  创造项目等级规则
export function createProjectLevelRule(params) {
    return ajax.post(API.createProjectLevelRule, params)
}

//  更新项目等级规则
export function updateProjectLevelRule(params) {
    return ajax.post(API.updateProjectLevelRule, params)
}

//  删除项目等级规则
export function deleteProjectLevelRule(params) {
    return ajax.post(API.deleteProjectLevelRule, params)
}

//  测试项目等级规则
export function testProjectLevelRule(params) {
    return ajax.post(API.testProjectLevelRule, params)
}
