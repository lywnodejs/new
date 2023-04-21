import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/octopus'

export function userAuthList(params) {
    return ajax.post(API.userAuthList, params)
}

export function userAuthcreate(params) {
    return ajax.post(API.userAuthcreate, params)
}

export function userAuthUpdate(params) {
    return ajax.post(API.userAuthUpdate, params)
}

export function userAuthDelete(params) {
    return ajax.post(API.userAuthDelete, params)
}

export function userAuthTemplete() {
    return ajax.post(API.userAuthTemplete)
}

export function getUserAuth(params) {
    return ajax.post(API.getUserAuth, params)
}

export function signAgreementUserAuth(params) {
    return ajax.post(API.signAgreementUserAuth, params)
}
