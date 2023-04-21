import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/ratel'

//  获取资产列表
export function getAssetSDKList(params) {
    return ajax.post(API.getAssetSDKList, params)
}

//  添加资产
export function createAssetSDK(params) {
    return ajax.post(API.createAssetSDK, params)
}

//  更新资产
export function updateAssetSDK(params) {
    return ajax.post(API.updateAssetSDK, params)
}

export function deleteAssetSDK(params) {
    return ajax.post(API.deleteAssetSDK, params)
}

export function getAssetPermissionList(params) {
    return ajax.post(API.getAssetPermissionList, params)
}

//  添加资产
export function createAssetPermission(params) {
    return ajax.post(API.createAssetPermission, params)
}

//  更新资产
export function updateAssetPermission(params) {
    return ajax.post(API.updateAssetPermission, params)
}

export function deleteAssetPermission(params) {
    return ajax.post(API.deleteAssetPermission, params)
}

export function getTaskSDK(params) {
    return ajax.post(API.getTaskSDK, params)
}

export function createTaskSDK(params) {
    return ajax.post(API.createTaskSDK, params)
}

export function delTaskSDK(params) {
    return ajax.post(API.delTaskSDK, params)
}

export function updateTaskSDK(params) {
    return ajax.post(API.updateTaskSDK, params)
}

export function updateTaskPermission(params) {
    return ajax.post(API.updateTaskPermission, params)
}
export function delTaskPermission(params) {
    return ajax.post(API.delTaskPermission, params)
}
export function createTaskPermission(params) {
    return ajax.post(API.createTaskPermission, params)
}
export function getTaskPermission(params) {
    return ajax.post(API.getTaskPermission, params)
}
export function uploadExcelPermission(params) {
    return ajax.post(API.uploadExcelPermission, params)
}
export function getTaskDynamic(params) {
    return ajax.post(API.getTaskDynamic, params)
}
