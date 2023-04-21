/**
 *
 * sdl-dorado-project
 */

import {createProject, sendComments, getComments} from '@/services/dorado/project/project'

export default {

  namespace: 'dorado_project',

  state: {},
  getters: {},

  // 定义状态如何变化
  mutations: {},

  // 暴露方法
  actions: {

    async createProject({commit, state}, queryParam) {
      const {data} = await createProject(queryParam)
      return data
    },

    async sendComments({commit, state}, queryParam) {
      const {data} = await sendComments(queryParam)
      return data
    },

    async getComments({commit, state}, queryParam) {
      const {data} = await getComments(queryParam)
      return data
    }
  }
}
