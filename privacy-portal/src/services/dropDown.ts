import ajax from 'utils/ajax'

export function questionCategorySelector(params?: any) {
  return ajax.get('/home/dropDown/questionCategorySelector', params)
}

export function appSelector(params?: any) {
  return ajax.get('/home/dropDown/appSelector', params)
}
