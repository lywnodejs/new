import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/ratel'

export function uploadAPK(params) {
    return ajax.post(API.uploadAPK, params)
}

export function getTaskList(params) {
    return ajax.post(API.getTaskList, params)
}

export function createTask(params) {
    return ajax.post(API.createTask, params)
}

export function getResultByTaskId(params) {
    return ajax.post(API.getResultByTaskId, params)
}

export function getOneTimeByPackageName(params) {
    return ajax.post(API.getOneTimeByPackageName, params)
}
