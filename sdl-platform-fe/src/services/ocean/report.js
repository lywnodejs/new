import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/ocean'

export function monthlyReport(queryParam) {
  return ajax.post(API.monthlyReport, queryParam)
}
