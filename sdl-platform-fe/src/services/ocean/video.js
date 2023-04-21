import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/ocean'

export function videoCoverage(queryParam) {
  return ajax.post(API.videoCoverage, queryParam)
}

export function videoNpsDetails(queryParam) {
    return ajax.post(API.videoNpsDetails, queryParam)
}
