import ajax from '@/plugin/ajax'

// export function getMenuPermission(menuId) {
//   return ajax.get('/api/common/page/auth', {
//     id: menuId
//   })
// }

export function getMenuPermission() {
  return ajax.get('/common/page/auth')
}
