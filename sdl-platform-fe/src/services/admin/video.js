import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/admin'

export function createPackageCourse(params) {
    return ajax.post(API.createPackageCourse, params)
}

export function delPackageCourse(params) {
    return ajax.post(API.delPackageCourse, params)
}

export function delVideo(params) {
    return ajax.post(API.delVideo, params)
}
