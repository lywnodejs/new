import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/cachalot.js'

export function dimqueryDomain(params) {
    return ajax.post(API.dimqueryDomain, params)
}

export function modifyDomain(params) {
    return ajax.post(API.modifyDomain, params)
}

export function modifyItDomain(params) {
    return ajax.post(API.modifyItDomain, params)
}

export function getItDomain(params) {
    return ajax.post(API.getItDomain, params)
}

export function updateItDomain(params) {
    return ajax.post(API.updateItDomain, params)
}

export function getGitDomain(params) {
    return ajax.post(API.getGitDomain, params)
}

export function getGitSdkInfo(params) {
    return ajax.post(API.getGitSdkInfo, params)
}

export function getGitSensitive(params) {
    return ajax.post(API.getGitSensitive, params)
}
