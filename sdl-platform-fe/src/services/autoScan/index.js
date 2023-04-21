import ajax from '@/plugin/ajax'

export function getSelfScan(params) {
  return ajax.upload('/otter/self/scan', params)
}
