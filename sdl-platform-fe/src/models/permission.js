/**
 *
 * 用户权限
 */

// import { getMenuPermission } from '@/services/permission'

export default {

  namespace: 'permission',

  state: {
      permission: 2
  },

  getters: {

    // getPermission: ({ permission }) => {
    //   return permission
    // }
  },

  // 定义状态如何变化
  mutations: {
    permissionData(state, permission) {
      state.permission = permission
    }
  },

  // 暴露方法
  actions: {
    async getPermission({commit, state}) {

      // const { data } = await getMenuPermission()
      // commit('permissionData', data.auth)
    }
  }
}
