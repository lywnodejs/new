import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/octopus'

//  获取用户信息统计数据
export function getAuthInfoStatistic(params) {
    return ajax.post(API.authInfoStatistic, params)
}

//  获取任务统计数据
export function getTaskCountStatistic(params) {
    return ajax.post(API.taskCountStatistic, params)
}

//  获取漏洞统计数据
export function getVulCountStatistic(params) {
    return ajax.post(API.vulCountStatistic, params)
}

//  获取资产统计数据
export function getTargetCountStatistic(params) {
    return ajax.post(API.targetCountStatistic, params)
}

