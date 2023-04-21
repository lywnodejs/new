import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dorado'

export function getBaselineReqList(queryParam) {
  return ajax.post(API.getBaselineReqList, queryParam)
}

export function confirmBaselineReqList(queryParam) {
  return ajax.post(API.confirmBaselineReqList, queryParam)
}

export function fecthBaselineCodeWhiteEvaluation(queryParam) {
  return ajax.post(API.fecthBaselineCodeWhiteEvaluation, queryParam)
}

export function addOutputBaseline(queryParam) {
  return ajax.post(API.addOutputBaseline, queryParam)
}

export function deleteOutputBaseline(queryParam) {
  return ajax.post(API.deleteOutputBaseline, queryParam)
}

export function listAllBaseline(queryParam) {
  return ajax.post(API.listAllBaseline, queryParam)
}

export function getRepoTree(queryParam) {
  return ajax.post(API.getRepoTree, queryParam)
}

export function remarkBaseline(queryParam) {
  return ajax.post(API.remarkBaseline, queryParam)
}

export function baselineNewCTR(queryParam) {
  return ajax.post(API.baselineNewCTR, queryParam)
}

export function queryNewUser(queryParam) {
  return ajax.post(API.queryNewUser, queryParam)
}

export function questionnaireAuth(queryParam) {
  return ajax.post(API.questionnaireAuth, queryParam)
}

export function questionnaireNew(queryParam) {
  return ajax.post(API.questionnaireNew, queryParam)
}

export function getOutputSensitive(queryParam) {
  return ajax.post(API.getOutputSensitive, queryParam)
}
