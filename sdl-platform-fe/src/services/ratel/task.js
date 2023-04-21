import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/ratel'

//  获取扫描任务列表
export function getHistoryTask(params) {
    return ajax.post(API.getHistoryTask, params)
}
