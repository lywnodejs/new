import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

//  创建漏洞知识
export function createVulKnowledge(params) {
    return ajax.post(API.createVulKnowledge, params)
}

//  获取漏洞知识
export function getVulKnowledgeList(params) {
    return ajax.post(API.getVulKnowledgeList, params)
}

//  更新漏洞知识
export function updateVulKnowledge(params) {
    return ajax.post(API.updateVulKnowledge, params)
}

//  禁用漏洞知识
export function disableVulKnowledge(id) {
    return ajax.post(API.disableVulKnowledge, {
        vul_knowledge_id: id
    })
}

//  启用漏洞知识
export function enableVulKnowledge(id) {
    return ajax.post(API.enableVulKnowledge, {
        vul_knowledge_id: id
    })
}

//  获取安全文案
export function getSlnKnowledgeList(queryParam) {
    return ajax.post(API.getSlnKnowledgeList, queryParam)
}

//  创建安全文案
export function createSlnKnowledge(params) {
    return ajax.post(API.createSlnKnowledge, params)
}

//  更新安全文案
export function updateSlnKnowledge(params) {
    return ajax.post(API.updateSlnKnowledge, params)
}

//  禁用安全文案
export function disableSlnKnowledge(id) {
    return ajax.post(API.disableSlnKnowledge, {
        sln_knowledge_id: id
    })
}

//  启用安全文案
export function enableSlnKnowledge(id) {
    return ajax.post(API.enableSlnKnowledge, {
        sln_knowledge_id: id
    })
}

//  获取漏洞类型
export function getPreInfo() {
    return ajax.post(API.getPreInfo, {})
}

export function uploadPic(file) {
    return ajax.post(API.upload, file)
}
