import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/ratel'

export function getRatelProjectList(params) {
    return ajax.post(API.getRatelProjectList, params)
}

export function getRatelProjectDetail(params) {
    return ajax.post(API.getRatelProjectDetail, params)
}

export function getRatelFollower(params) {
    return ajax.post(API.getRatelFollower, params)
}

export function addRatelFollower(params) {
    return ajax.post(API.addRatelFollower, params)
}

// 检测任务

export function getRatelTaskList(params) {
    return ajax.post(API.getRatelTaskList, params)
}

export function getRatelTaskDetail(params) {
    return ajax.post(API.getRatelTaskDetail, params)
}

export function getTaskListByTaskId(params) {
    return ajax.post(API.getTaskListByTaskId, params)
}

export function taskClaim(params) {
    return ajax.post(API.taskClaim, params)
}

// 详情页

export function getListByTaskId(params) {
    return ajax.post(API.getListByTaskId, params)
}

export function getResultSDLMark(params) {
    return ajax.post(API.getResultSDLMark, params)
}

export function getRatelCommit(params) {
    return ajax.post(API.getRatelCommit, params)
}

// 漏洞列表

export function getRatelVulList(params) {
    return ajax.post(API.getRatelVulList, params)
}

export function getListByProjectId(params) {
    return ajax.post(API.getListByProjectId, params)
}

export function updateVul(params) {
    return ajax.post(API.updateVul, params)
}

export function asyncVul(params) {
    return ajax.post(API.asyncVul, params)
}

export function changeRatelAppOwner(params) {
    return ajax.post(API.changeRatelAppOwner, params)
}

