import ajax from 'utils/ajax'

export function displayedApps(params: any) {
  return ajax.get('/home/displayedApps', params)
}
