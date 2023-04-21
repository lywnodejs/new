import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/otter'

//  获取项目列表
export function getOtterList(params) {
    return ajax.post(API.getOtterList, params)
}

export function getOtterDetail(params) {
    return ajax.post(API.getOtterDetail, params)
}

export function getTaskListByProjectId(params) {
    return ajax.post(API.getTaskListByProjectId, params)
}

export function getVulListByProjectId(params) {
    return ajax.post(API.getVulListByProjectId, params)
}

export function getProjectFollower(params) {
    return ajax.post(API.getProjectFollower, params)
}

export function addProjectFollower(params) {
    return ajax.post(API.addProjectFollower, params)
}

//  获取任务列表
export function getOtterTaskList(params) {
    return ajax.post(API.getOtterTaskList, params)
}

export function getOtterTaskDetail(params) {
    return ajax.post(API.getOtterTaskDetail, params)
}

//  获取任务ID列表
export function getListByTaskId(params) {
    return ajax.post(API.getListByTaskId, params)
}

export function claimTask(params) {
    return ajax.post(API.claimTask, params)
}

//  获取漏洞列表
export function getOtterVulList(params) {
    return ajax.post(API.getOtterVulList, params)
}

//  获取漏洞列表
export function getFpList(params) {
    return ajax.post(API.getFpList, params)
}

//  rd mark
export function resultRdMark(params) {
    return ajax.post(API.resultRdMark, params)
}

export function resultSDLMark(params) {
    return ajax.post(API.resultSDLMark, params)
}

export function commitResult(params) {
    return ajax.post(API.commitResult, params)
}

export function createTask(params) {
    return ajax.post(API.createTask, params)
}

export function getSelfScanResultList(params) {
  return ajax.post(API.getSelfScanResultList, params)
}

export function getSelfScanDetail(params) {
  return ajax.post(API.getSelfScanDetail, params)
}
