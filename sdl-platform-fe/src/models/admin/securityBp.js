/**
 *
 * SecurityBp
 */
// import { securityBps, preHandleParam } from '@/commons/admin'
import { getSecurityBpList,
          createSecurityBp,
          deleteSecurityBp,
          updateSecurityBp,
          testBaselineSecurityBp,
          deleteBaselineSecurityBp,
          updateBaselineSecurityBp,
          createBaselineSecurityBp,
          listAllBaselineSecurityBp
        } from '@/services/admin/securityBp'

export default {

  namespace: 'security_bp',

  state: {
      securityBpList: [],
      securityBpListLength: 0
  },
  getters: {
  },

  // 定义状态如何变化
  mutations: {
     securityBpList(state, data) {
      state.securityBpList = data.security_bp_list
      state.securityBpListLength = data.count
    }

  },

  // 暴露方法
  actions: {
    async getSecurityBpList({commit, state}, queryParam) {
      const { data } = await getSecurityBpList(queryParam)

      // for (let i = 0; i < data.security_bp_list.length; i++) {
      //   data.security_bp_list[i].security_bp = preHandleParam(data.security_bp_list[i].security_bp, securityBps)
      // }
      commit('securityBpList', data)
    },
    async createSecurityBp({commit, state}, param) {
      const { data } = await createSecurityBp(param)
      return data
    },
    async deleteSecurityBp({commit, state}, securityBpId) {
      const { data } = await deleteSecurityBp(securityBpId)
      return data
    },
    async updateSecurityBp({commit, state}, param) {
      const { data } = await updateSecurityBp(param)
      return data
    },
    async testBaselineSecurityBp({commit, state}, param) {
      const data = await testBaselineSecurityBp(param)
      return data
    },
    async deleteBaselineSecurityBp({commit, state}, param) {
      const { data } = await deleteBaselineSecurityBp(param)
      return data
    },
    async updateBaselineSecurityBp({commit, state}, param) {
      const { data } = await updateBaselineSecurityBp(param)
      return data
    },
    async createBaselineSecurityBp({commit, state}, param) {
      const { data } = await createBaselineSecurityBp(param)
      return data
    },
    async listAllBaselineSecurityBp({commit, state}, param) {
      const { data } = await listAllBaselineSecurityBp(param)
      return data
    }
  }
}
