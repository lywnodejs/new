import { slicePath } from 'utils'

function parseMenuAuthToArray(menuAuth, menuArray) {
  menuAuth.forEach(item => {
    menuArray.push(item)
    if (item.menus && _.isArray(item.menus) && item.menus.length > 0) {
      parseMenuAuthToArray(item.menus, menuArray)
    }
  })
  return menuArray
}

export default function authorityFilter({ path }, from, next) {
  const app = slicePath(path, 2)
  const { getters } = this._store
  const getMenusByApp = getters['user/getMenusByApp']
  const menuDatas = parseMenuAuthToArray(getMenusByApp(app), [])
  const menu = _.find(menuDatas, {
    'url': path
  })

  if (menu && menu.id) {
    this._store.dispatch('permission/getPermission', menu.id).then(() => {
      next()
    })
  } else {
    next()
  }
}
