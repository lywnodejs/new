import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

//  获取威胁列表
export function getThreatList(params) {
    return ajax.post(API.getThreatList, params)
}

//  创造威胁列表
export function createThreatList(params) {
    return ajax.post(API.createThreatList, params)
}

//  更新威胁列表
export function updateThreatList(params) {
    return ajax.post(API.updateThreatList, params)
}

//  禁用威胁列表
export function disableThreatList(id) {
    return ajax.post(API.disableThreatList, {didi_threat_id: id})
}

//  启用威胁列表
export function enableThreatList(id) {
    return ajax.post(API.enableThreatList, {didi_threat_id: id})
}

//  获取攻击面
export function getAttackSurface(queryParam) {
    return ajax.post(API.getAttackSurface, queryParam)
}

//  启用攻击面
export function enableAttackSurface(id) {
    return ajax.post(API.enableAttackSurface, {attack_surface_id: id})
}

//  禁用攻击面
export function disableAttackSurface(id) {
    return ajax.post(API.disableAttackSurface, {attack_surface_id: id})
}

//  编辑攻击面
export function updateAttackSurface(params) {
    return ajax.post(API.updateAttackSurface, {
        attack_surface_id: params.id,
        attack_surface_name: params.name})
}

//  编辑攻击面
export function createAttackSurface(name) {
    return ajax.post(API.createAttackSurface, {
        attack_surface_name: name})
}
