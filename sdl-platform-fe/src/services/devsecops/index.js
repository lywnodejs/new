import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/devsecops'

export function getAllResults(params) {
    return ajax.post(API.getAllResults, params)
}

export function updateRuleResult(params) {
    return ajax.post(API.updateRuleResult, params)
}

export function updateVulResult(params) {
    return ajax.post(API.updateVulResult, params)
}

export function updateBaselineResult(params) {
    return ajax.post(API.updateBaselineResult, params)
}
