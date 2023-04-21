import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/octopus'

//  获取扫描任务列表
export function getTaskList(params) {
    return ajax.post(API.getTaskList, params)
}

//  开启扫描任务
export function startTask(params) {
    return ajax.post(API.startTask, params)
}

//  暂停扫描任务
export function stopTask(params) {
    return ajax.post(API.stopTask, params)
}

//  复测扫描任务
export function retestTask(params) {
    return ajax.post(API.retestTask, params)
}

//  新建扫描任务
export function createTask(params) {
    return ajax.post(API.createTask, params)
}

//  扫描并执行任务
export function execTask(params) {
    return ajax.post(API.execTask, params)
}

// 查看任务进度
export function statusTask(params) {
    return ajax.post(API.statusTask, params)
}

//  删除扫描任务
export function deleteTask(params) {
    return ajax.post(API.deleteTask, params)
}

//  修改扫描任务信息
export function updateTask(params) {
    return ajax.post(API.updateTask, params)
}

//  周期扫描任务
export function periodTaskTime(params) {
    return ajax.post(API.periodTaskTime, params)
}

//  获取扫描插件
export function pluginsTaskList(params) {
    return ajax.post(API.pluginsTaskList, params)
}

//  修改扫描任务对应的漏洞列表
export function getTaskVulList(params) {
    return ajax.post(API.getTaskVulList, params)
}

//  修改扫描任务信息
export function taskVulMisinformation(params) {
    return ajax.post(API.taskVulMisinformation, params)
}

