/**
 *
 * odin
 */

import { fetchData, bindProject, getBindOdin, approve } from '@/services/dorado/odin/odin'

export default {

  namespace: 'odin',

  state: {
      odin_list: {}
  },
  getters: {
  },

  // 定义状态如何变化
  mutations: {

  },

  // 暴露方法
  actions: {
    async fetchData({commit, state}, queryParam) {
      const { data } = await fetchData(queryParam)
      commit('odin_list', data)
    },
    async bindProject({commit, state}, odinWorkflowId, sdlProjectId) {
      const { data } = await bindProject(odinWorkflowId, sdlProjectId)
      commit('odin_list', data)
    },
    async getBindOdin({commit, state}, sdlProjectId) {
      const { data } = await getBindOdin(sdlProjectId)
      commit('odin_list', data)
    },
    async approve({commit, state}, odinWorkflowId) {
      const { data } = await approve(odinWorkflowId)
      commit('odin_list', data)
    }
  }
}
