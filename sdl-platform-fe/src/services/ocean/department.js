import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/ocean'

export function getDeptList() {
  return ajax.get(API.deptList)
}

export function getDepartmentDomainCoverageRate(queryParam) {
    return ajax.post(API.getDepartmentDomainCoverageRate, queryParam)
}

export function getDepartmentOdinDeployCoverageRate(queryParam) {
    return ajax.post(API.getDepartmentOdinDeployCoverageRate, queryParam)
}

export function getDepartmentVulDetectionRate(queryParam) {
    return ajax.post(API.getDepartmentVulDetectionRate, queryParam)
}

export function getDepartmentMonthlyVulStatistic(queryParam) {
    return ajax.post(API.getDepartmentMonthlyVulStatistic, queryParam)
}

export function getDepartmentMonthlyVulTypeProportion(queryParam) {
    return ajax.post(API.getDepartmentMonthlyVulTypeProportion, queryParam)
}

export function getVulnerabilityList(queryParam) {
    return ajax.post(API.getVulnerabilityList, queryParam)
}

export function getEvaluationProjectList(queryParam) {
    return ajax.post(API.getEvaluationProjectList, queryParam)
}

export function getOtterTaskList(queryParam) {
    return ajax.post(API.getOtterTaskList, queryParam)
}

export function domainCoverageDetail(queryParam) {
    return ajax.post(API.domainCoverageDetail, queryParam)
}

export function departmentVulFixRate(queryParam) {
    return ajax.post(API.departmentVulFixRate, queryParam)
}

export function departmentVulR2OnTimeFixRate(queryParam) {
    return ajax.post(API.departmentVulR2OnTimeFixRate, queryParam)
}
