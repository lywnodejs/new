import ajax from '@/plugin/ajax'

export function getUserInfo() {
  return ajax.get('user/menus')
}
