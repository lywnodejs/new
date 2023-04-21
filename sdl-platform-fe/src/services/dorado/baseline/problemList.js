import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dorado'

export function getBaselineAuditResultList(queryParam) {
  return ajax.post(API.getBaselineAuditResultList, queryParam)
}

export function getOutputTaskId(queryParam) {
  return ajax.post(API.getOutputTaskId, queryParam)
}

export function createProblem(queryParam) {
  return ajax.post(API.createProblem, queryParam)
}

export function updateIssueStatus(queryParam) {
  return ajax.post(API.updateIssueStatus, queryParam)
}

export function updateRuleResult(queryParam) {
  return ajax.post(API.updateRuleResult, queryParam)
}

export function updateBaselineStatus(queryParam) {
  return ajax.post(API.updateBaselineStatus, queryParam)
}

export function getBaselineRdResultList(queryParam) {
  return ajax.post(API.getBaselineRdResultList, queryParam)
}

export function calculateScan(queryParam) {
  return ajax.post(API.calculateScan, queryParam)
}

export function retestBaseline(queryParam) {
  return ajax.post(API.retestBaseline, queryParam)
}
export function getBaselineTestTaskInfo(queryParam) {
  return ajax.post(API.getBaselineTestTaskInfo, queryParam)
}
export function scanException(queryParam) {
  return ajax.post(API.scanException, queryParam)
}
export function rdmarkIssue(queryParam) {
  return ajax.post(API.rdmarkIssue, queryParam)
}
export function ignoreException(queryParam) {
  return ajax.post(API.ignoreException, queryParam)
}
export function editTaskScan(queryParam) {
  return ajax.post(API.editTaskScan, queryParam)
}
