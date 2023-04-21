import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

// 获取漏洞知识库
export function getVulKnowledge(queryParam) {
     return ajax.post(API.getVulKnowledge, queryParam)
}
export function getVulKnowledgeById(queryParam) {
  return ajax.post(API.getVulKnowledge, queryParam)
}

//  获取安全库
export function getSlnKnowledge(queryParam) {
    return ajax.post(API.getSlnKnowledge, queryParam)
}
export function getSlnKnowledgeById(param) {
    return ajax.post(API.getSlnKnowledge, param)
}
