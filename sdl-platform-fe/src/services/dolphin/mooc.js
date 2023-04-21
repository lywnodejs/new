import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

export function getVideoList(params) {
    return ajax.post(API.getVideoList, params)
}

export function getVideoPlay(queryParam) {
    return ajax.post(API.getVideoPlay, queryParam)
}

export function getVideoUnfinished(queryParam) {
    return ajax.post(API.getVideoUnfinished, queryParam)
}

export function uploadVideoMooc(params) {
    return ajax.post(API.uploadVideoMooc, params)
}

export function finishVideoMooc(params) {
    return ajax.post(API.finishVideoMooc, params)
}

export function importVideoMemberList(params) {
    return ajax.post(API.importVideoMemberList, params)
}

export function createMoocTask(params) {
    return ajax.post(API.createMoocTask, params)
}

export function exportMemberList(params) {
    return ajax.post(API.exportMemberList, params)
}

export function sendVideoComment(params) {
    return ajax.post(API.sendVideoComment, params)
}

export function getVideoComment(params) {
    return ajax.post(API.getVideoComment, params)
}

export function newQuestionnaire(params) {
    return ajax.post(API.newQuestionnaire, params)
}

export function authQuestionnaire(params) {
    return ajax.post(API.authQuestionnaire, params)
}

export function getCourseAllList(params) {
    return ajax.post(API.getCourseAllList, params)
}

export function getCourseList(params) {
    return ajax.post(API.getCourseList, params)
}
