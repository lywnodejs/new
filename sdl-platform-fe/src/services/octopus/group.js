import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/octopus'

//  获取用户信息统计数据
export function getGroupProjectList(params) {
    return ajax.post(API.getGroupProjectList, params)
}

//  获取任务统计数据
export function createGroupProject(params) {
    return ajax.post(API.createGroupProject, params)
}

export function updateGroupProject(params) {
    return ajax.post(API.updateGroupProject, params)
}

export function getDetailGroupProjectByID(params) {
    return ajax.post(API.getDetailGroupProjectByID, params)
}

export function getTemplateByProjectId(params) {
    return ajax.post(API.getTemplateByProjectId, params)
}

export function newSession(params) {
    return ajax.post(API.newSession, params)
}

export function updateGroupFilter(params) {
    return ajax.post(API.updateGroupFilter, params)
}

export function getStatusGroupFilter(params) {
    return ajax.post(API.getStatusGroupFilter, params)
}

export function getResultGroupFilter(params) {
    return ajax.post(API.getResultGroupFilter, params)
}

export function updateTemplateLocator(params) {
    return ajax.post(API.updateTemplateLocator, params)
}

export function saveTemplateGroup(params) {
    return ajax.post(API.saveTemplateGroup, params)
}

export function reloadTemplateGroup(params) {
    return ajax.post(API.reloadTemplateGroup, params)
}

export function getfollowerGroupProject(params) {
    return ajax.post(API.getfollowerGroupProject, params)
}

export function addfollowerGroupProject(params) {
    return ajax.post(API.addfollowerGroupProject, params)
}

export function getGroupTask(params) {
    return ajax.post(API.getGroupTask, params)
}

export function updateGroupTask(params) {
    return ajax.post(API.updateGroupTask, params)
}

export function getAllProjectGroup(params) {
    return ajax.post(API.getAllProjectGroup, params)
}

export function createDefaultProject(params) {
    return ajax.post(API.createDefaultProject, params)
}

export function updateDefaultProject(params) {
    return ajax.post(API.updateDefaultProject, params)
}

export function listVulnerability(params) {
    return ajax.post(API.listVulnerability, params)
}

export function processVul(params) {
    return ajax.post(API.processVul, params)
}
