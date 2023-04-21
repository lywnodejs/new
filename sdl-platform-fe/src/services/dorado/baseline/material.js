import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dorado'

export function fecthCodeWhiteEvaluation(queryParam) {
  return ajax.post(API.fecthCodeWhiteEvaluation, queryParam)
}

export function getWhiteScanStatus(queryParam) {
    return ajax.post(API.getWhiteScanStatus, queryParam)
}

export function startWhiteScan(queryParam) {
    return ajax.post(API.startWhiteScan, queryParam)
}

export function createBaselineCodeWhiteEvaluation(queryParam) {
    return ajax.post(API.createBaselineCodeWhiteEvaluation, queryParam)
}

export function updateBaselineCodeWhiteEvaluation(queryParam) {
    return ajax.post(API.updateBaselineCodeWhiteEvaluation, queryParam)
}

export function getBaselineCodeWhiteEvaluationDetail(queryParam) {
    return ajax.post(API.getBaselineCodeWhiteEvaluationDetail, queryParam)
}

export function getCodeWhiteEvaluationDetail(queryParam) {
    return ajax.post(API.getCodeWhiteEvaluationDetail, queryParam)
}

export function deleteBaselineCodeWhiteEvaluationById(queryParam) {
    return ajax.post(API.deleteBaselineCodeWhiteEvaluationById, queryParam)
}

export function fecthBaselineCodeWhiteEvaluation(queryParam) {
    return ajax.post(API.fecthBaselineCodeWhiteEvaluation, queryParam)
}
