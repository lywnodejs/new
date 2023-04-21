/**
 *
 * 用户信息
 */

import { getUserInfo } from '@/services/user'

export default {

  namespace: 'user',

  state: {
    user: {
      username: '',
      realname: '',
      deptName: '',
      email: '',
      roles: ['user_admin'],
      menu_auth: []
    }
  },

  getters: {

    /**
     * 获取无层级菜单集合
     */
    menus: ({ user }) => {
      const ret = []
      const next = user.menu_auth.slice()
      while (next.length) {
        const menu = next.shift()
        const subMenu = menu.menus ? menu.menus.slice() : null
        ret.push(menu)
        if (Array.isArray(subMenu)) {
          while (subMenu.length) {
            next.push(subMenu.shift())
          }
        }
      }
      return ret
    },

    /**
     * 获取菜单hash对象
     */
    menuMap: ({ user }) => {
      const ret = {}
      const next = user.menu_auth.slice()

      while (next.length) {
        const menu = next.shift()
        const subMenu = menu.menus ? menu.menus.slice() : null

        ret[menu.url] = menu
        if (Array.isArray(subMenu)) {
          while (subMenu.length) {
            next.push(subMenu.shift())
          }
        }
      }
      return ret
    },

    /**
     * 用户可访问app
     */
    apps: ({
      user
    }) => {
      return user.menu_auth.map(app => {
        return {
          name: app.name,
          url: app.url
        }
      })
    },

    /**
     * 根据app获取子菜单
     */
    getMenusByApp: ({ user }) => (app) => {
      if (app === null) return user.menus
      let headerMenus = user.menu_auth
      for (let i = 0; i < headerMenus.length; i++) {
        for (let j = i + 1; j < headerMenus.length; j++) {
          if (headerMenus[i].sortVal > headerMenus[j].sortVal) {
            let num = headerMenus[i]
            headerMenus[i] = headerMenus[j]
            headerMenus[j] = num
          }
        }
        if (headerMenus[i].menus.length != 0) {

          //  id排序
          for (let m = 0; m < headerMenus[i].menus.length; m++) {
            for (let n = m + 1; n < headerMenus[i].menus.length; n++) {
              if (headerMenus[i].menus[m].sortVal > headerMenus[i].menus[n].sortVal) {
                let num = headerMenus[i].menus[m]
                headerMenus[i].menus[m] = headerMenus[i].menus[n]
                headerMenus[i].menus[n] = num
              }
            }

            // 三级菜单排序
            if (headerMenus[i].menus[m].menus.length != 0) {

              for (let g = 0; g < headerMenus[i].menus[m].menus.length; g++) {
                for (let h = g + 1; h < headerMenus[i].menus[m].menus.length; h++) {
                  if (headerMenus[i].menus[m].menus[g].sortVal > headerMenus[i].menus[m].menus[h].sortVal) {
                    let num = headerMenus[i].menus[m].menus[g]
                    headerMenus[i].menus[m].menus[g] = headerMenus[i].menus[m].menus[h]
                    headerMenus[i].menus[m].menus[h] = num
                  }
                }
              }

            }
          }
        }
      }
      const appMenu = _.find(headerMenus, { url: app })

      return appMenu ? appMenu.menus : []
    }
  },

  // 定义状态如何变化
  mutations: {
    fillData(state, user) {
      state.user = user
    }
  },

  // 暴露方法
  actions: {
    async getUserInfo({ commit, state }) {
      const { data } = await getUserInfo()

      commit('fillData', data)
    }
  }
}
