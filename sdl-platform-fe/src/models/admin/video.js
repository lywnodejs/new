import { delPackageCourse,
    createPackageCourse,
    delVideo
        } from '@/services/admin/video'

export default {

  namespace: 'admin_video',

  state: {
  },
  getters: {
  },

  // 定义状态如何变化
  mutations: {
  },

  // 暴露方法
  actions: {
    async createPackageCourse({commit, state}, securityBpId) {
      const { data } = await createPackageCourse(securityBpId)
      return data
    },
    async delPackageCourse({commit, state}, param) {
      const { data } = await delPackageCourse(param)
      return data
    },
    async delVideo({commit, state}, param) {
      const { data } = await delVideo(param)
      return data
    }
  }
}
