import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/ocean'

export function ruleFalseIndex(queryParam) {
  return ajax.post(API.ruleFalseIndex, queryParam)
}
