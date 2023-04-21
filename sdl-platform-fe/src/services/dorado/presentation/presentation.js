import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dorado'

export function getUserStatistics(queryParam) {
  return ajax.post(API.getUserStatistics, {
    queryParam: queryParam
  })
}

export function getProjectStatistics(queryParam) {
  return ajax.post(API.getProjectStatistics, {
    queryParam: queryParam
  })
}

export function getProjectRecentStatistics(queryParam) {
  return ajax.post(API.getProjectRecentStatistics, {
    queryParam: queryParam
  })
}

export function getProjectLevelStatistics(queryParam) {
  return ajax.post(API.getProjectLevelStatistics, {
    queryParam: queryParam
  })
}

export function getProjectStatusStatistics(queryParam) {
  return ajax.post(API.getProjectStatusStatistics, {
    queryParam: queryParam
  })
}

export function getTopTenStatistics(queryParam) {
  return ajax.post(API.getTopTenStatistics, {
    queryParam: queryParam
  })
}

export function getVulLanguagePercentageStatistics(queryParam) {
  return ajax.post(API.getVulLanguagePercentageStatistics, {
    queryParam: queryParam
  })
}

export function getProjectPercentageStatistics(queryParam) {
  return ajax.post(API.getProjectPercentageStatistics, {
    queryParam: queryParam
  })
}

export function getDepartmentDistributionStatistics(queryParam) {
  return ajax.post(API.getDepartmentDistributionStatistics, {
    queryParam: queryParam
  })
}

export function getProjectClosedLoopRateStatistics(queryParam) {
  return ajax.post(API.getProjectClosedLoopRateStatistics, {
    queryParam: queryParam
  })
}


