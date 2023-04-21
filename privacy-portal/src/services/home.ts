import ajax from 'utils/ajax'

export function getList() {
  return ajax.get('/index')
}
