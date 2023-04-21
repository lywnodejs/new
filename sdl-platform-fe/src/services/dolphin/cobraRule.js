import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

//  创建Cobra规则
export function createCobraRule(params) {
    return ajax.post(API.createCobraRule, params)
}

//  更新Cobra规则
export function updateCobraRule(params) {
    return ajax.post(API.updateCobraRule, params)
}
