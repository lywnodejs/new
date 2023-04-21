import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

//  获取Cobra规则列表
export function getCobraList(postParam) {
  return ajax.post(API.getCobraList, postParam)
}

//  获取Fatbird规则列表
export function getFatbirdList(postParam) {
  return ajax.post(API.getFatbirdList, postParam)
}

// 获取已绑定的Cobra规则
export function getTestRuleIdsByBaselineId(postParam) {
    return ajax.post(API.getTestRuleIdsByBaselineId, postParam)
}

// 绑定Cobra规则
export function bindTestRuleByBaselineId(postParam) {
    return ajax.post(API.bindTestRuleByBaselineId, postParam)
}
