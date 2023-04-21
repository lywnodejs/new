import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/cachalot.js'

export function getOnlineVulList(params) {
    return ajax.post(API.getOnlineVulList, params)
}

export function getOneOnlineVul(params) {
    return ajax.post(API.getOneOnlineVul, params)
}

export function getPositionOnlineVul(params) {
    return ajax.post(API.getPositionOnlineVul, params)
}

export function updateOnlineVul(params) {
    return ajax.post(API.updateOnlineVul, params)
}
