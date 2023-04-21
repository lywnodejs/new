import ajax from 'utils/ajax'

export function feedback(params: any) {
  return ajax.upload('/home/feedback/submit', params)
}
