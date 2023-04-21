import {
    uploadAPK,
    getTaskList,
    createTask,
    getResultByTaskId,
    getOneTimeByPackageName
  } from '@/services/ratel/selfService'

  export default {

    // 命名空间 required
    namespace: 'ratel_selfService',

    // 原始状态，存储数据
    state: {
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
    },

    // 暴露方法
    actions: {

      // 获取工单列表
      async uploadAPK({commit, state}, params) {
        const {data} = await uploadAPK(params)
        return data
      },

      async getTaskList({commit, state}, params) {
        const {data} = await getTaskList(params)
        return data
      },

      async createTask({commit, state}, params) {
        const {data} = await createTask(params)
        return data
      },

      async getResultByTaskId({commit, state}, params) {
        const {data} = await getResultByTaskId(params)
        return data
      },

      async getOneTimeByPackageName({commit, state}, params) {
        const {data} = await getOneTimeByPackageName(params)
        return data
      }
    }
  }
