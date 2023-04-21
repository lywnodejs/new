import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/ocean'

export function getDomainCoverageRate(queryParam) {
  return ajax.post(API.getDomainCoverageRate, queryParam)
}

export function getOdinDeployCoverageRate(queryParam) {
  return ajax.post(API.getOdinDeployCoverageRate, queryParam)
}

export function getVulDetectionRate(queryParam) {
  return ajax.post(API.getVulDetectionRate, queryParam)
}

export function DepartmentCoverageRate(queryParam) {
  return ajax.post(API.DepartmentCoverageRate, queryParam)
}

// 图表数据
export function getMonthlyVulStatisticByDepartment(queryParam) {
  return ajax.post(API.getMonthlyVulStatisticByDepartment, queryParam)
}

export function getMonthlyVulTypeProportion(queryParam) {
  return ajax.post(API.getMonthlyVulTypeProportion, queryParam)
}

export function globalVulFixRate(queryParam) {
  return ajax.post(API.globalVulFixRate, queryParam)
}

export function globalVulR2OnTimeFixRate(queryParam) {
  return ajax.post(API.globalVulR2OnTimeFixRate, queryParam)
}
export function SdkCoverageRate() {
  return ajax.get(API.SdkCoverageRate)
}
