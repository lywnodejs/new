import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dorado'

export function createProject(queryParam) {
  return ajax.post(API.createProject, {
    project: queryParam
  })
}

export function getComments(queryParam) {
  return ajax.post(API.getComments, queryParam)
}

export function sendComments(queryParam) {
  return ajax.post(API.sendComments, queryParam)
}
