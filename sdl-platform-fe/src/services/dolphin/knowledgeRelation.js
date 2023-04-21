import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dolphin'

//  获取威胁列表
export function getVulAndSolutionIdsByThreatId(didiThreatId) {
    return ajax.post(API.getVulAndSolutionIdsByThreatId, {
        didi_threat_id: didiThreatId
    })
}

export function bindVulByThreatId(postParam) {
    return ajax.post(API.bindVulByThreatId, postParam)
}

export function bindSolutionByThreatId(postParam) {
    return ajax.post(API.bindSolutionByThreatId, postParam)
}

// 获取测试库对应的漏洞知识和方案列表～ @huanqi 2018/10/30
export function getVulAndSolutionIdsByTestId(postParam) {
  return ajax.post(API.getVulAndSolutionIdsByTestId, postParam)
}

export function bindVulByTestId(postParam) {
  return ajax.post(API.bindVulByTestId, postParam)
}

export function bindSolutionByTestId(postParam) {
  return ajax.post(API.bindSolutionByTestId, postParam)
}
