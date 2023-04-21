/**
 *
 * SecurityBp
 */
import {
  deleteSdlSecurityBp,
  createSdlSecurityBp,
  getSdlSecurityBp
} from '@/services/admin/sdlSecurityBp'

export default {

  namespace: 'sdl_security_bp',

  state: {

  },
  getters: {
  },

  // 定义状态如何变化
  mutations: {

  },

  // 暴露方法
  actions: {

    async deleteSdlSecurityBp({commit, state}, securityBpId) {
      const { data } = await deleteSdlSecurityBp(securityBpId)
      return data
    },

    async createSdlSecurityBp({commit, state}, param) {
      const { data } = await createSdlSecurityBp(param)
      return data
    },

    async getSdlSecurityBp() {
      const { data } = await getSdlSecurityBp()
      return data
    }
  }
}
