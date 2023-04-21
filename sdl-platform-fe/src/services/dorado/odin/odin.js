import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dorado'

export function fetchData(queryParam) {
  return ajax.post(API.getOdinList, {
    queryParam: queryParam
  })
}

export function bindProject(odinWorkflowId, sdlProjectId) {
  return ajax.post(API.bindOdinProject, {
    odin_workflow_id: odinWorkflowId,
    sdl_project_id: sdlProjectId
  })
}

export function getBindOdin(sdlProjectId) {
  return ajax.post(API.getBindOdin, {
    sdl_project_id: sdlProjectId
  })
}

export function approve(odinWorkflowId) {
  return ajax.post(API.securityApprove, {
    odin_workflow_id: odinWorkflowId
  })
}
