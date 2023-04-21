import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/ratel'

//  获取资产列表
export function getFpList(params) {
    return ajax.post(API.getFpList, params)
}

//  添加资产
export function deleteFpById(params) {
    return ajax.post(API.deleteFpById, params)
}
