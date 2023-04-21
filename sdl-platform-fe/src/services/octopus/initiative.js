import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/octopus'

//  获取扫描任务列表
// export function getTaskList(params) {
//     return ajax.post(API.getTaskList, params)
// }

//  创建扫描任务
export function createScanTask(params) {
  return ajax.post(API.createScanTask, params)
}

// 获取扫描插件
export function getWebPluginScan(params) {
  return ajax.post(API.getWebPluginScan, params)
}

// 获取扫描插件
export function getHostPluginScan(params) {
  return ajax.post(API.getHostPluginScan, params)
}

// 获取扫描结果
export function getScanVulList(querys) {
  return ajax.post(API.getScanVulList, querys)
}
