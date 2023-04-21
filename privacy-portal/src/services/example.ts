import ajax from '../utils/ajax'

export function getExampleList(params: any) {
  return ajax.get('asset/project/queryList', params)
}
