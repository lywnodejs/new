import ajax from 'utils/ajax'

export function getContent(params:any) {
  return ajax.get('/home/getContent',params)
}
