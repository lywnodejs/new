import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

//  获取基线列表
export function getBaselineList(params) {
    return ajax.post(API.getBaselineList, params)
}

//  创造基线
export function createBaseline(params) {
    return ajax.post(API.createBaseline, params)
}

//  更新基线
export function updateBaseline(params) {
    return ajax.post(API.updateBaseline, params)
}

//  删除基线
export function deleteBaseline(params) {
    return ajax.post(API.deleteBaseline, params)
}

//  准备基线
export function prepareBaseline() {
    return ajax.post(API.prepareBaseline)
}
