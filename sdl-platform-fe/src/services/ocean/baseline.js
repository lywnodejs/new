import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/ocean'

export function baselineNewCTR(queryParam) {
  return ajax.post(API.baselineNewCTR, queryParam)
}

export function baselineFinishById(queryParam) {
  return ajax.post(API.baselineFinishById, queryParam)
}

export function baselineFinishByTime(queryParam) {
  return ajax.post(API.baselineFinishByTime, queryParam)
}

export function baselineScanTaskByTime(queryParam) {
  return ajax.post(API.baselineScanTaskByTime, queryParam)
}

export function baselineScanTaskById(queryParam) {
  return ajax.post(API.baselineScanTaskById, queryParam)
}

export function baselineCheckIssueById(queryParam) {
    return ajax.post(API.baselineCheckIssueById, queryParam)
}

export function baselineCheckIssueByTime(queryParam) {
    return ajax.post(API.baselineCheckIssueByTime, queryParam)
}

export function baselineProcessTimeByTime(queryParam) {
  return ajax.post(API.baselineProcessTimeByTime, queryParam)
}

export function baselineProcessTimeById(queryParam) {
  return ajax.post(API.baselineProcessTimeById, queryParam)
}

export function baselineMonitor(queryParam) {
  return ajax.post(API.baselineMonitor, queryParam)
}

export function npsHighStartByTime(queryParam) {
  return ajax.post(API.npsHighStartByTime, queryParam)
}

export function npsLowStartByTime(queryParam) {
  return ajax.post(API.npsLowStartByTime, queryParam)
}

export function npsDetails(queryParam) {
  return ajax.post(API.npsDetails, queryParam)
}

export function npsOcean(queryParam) {
  return ajax.post(API.npsOcean, queryParam)
}

export function updateQuestionnaire(queryParam) {
  return ajax.post(API.updateQuestionnaire, queryParam)
}
