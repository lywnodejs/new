import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

//  创建
export function createBlackPlugin(params) {
    return ajax.post(API.createBlackPlugin, params)
}

//  获取
export function getBlackPlugin(queryParam) {
    return ajax.post(API.getBlackPlugin, queryParam)
}

//  更新
export function updateBlackPlugin(params) {
    return ajax.post(API.updateBlackPlugin, params)
}

//  禁用
export function disableBlackPlugin(id) {
    return ajax.post(API.disableBlackPlugin, {
        black_plugin_id: id
    })
}

//  启用
export function enableBlackPlugin(id) {
    return ajax.post(API.enableBlackPlugin, {
        black_plugin_id: id
    })
}
