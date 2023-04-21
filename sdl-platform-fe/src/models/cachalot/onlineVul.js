import {
    getOnlineVulList,
    getOneOnlineVul,
    getPositionOnlineVul,
    updateOnlineVul
  } from '@/services/cachalot/onlineVul.js'

  export default {

    // 命名空间 required
    namespace: 'cachalot_onlineVul',

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

      async getOnlineVulList({commit, state}, params) {
        const {data} = await getOnlineVulList(params)
        return data
      },

      async getOneOnlineVul({commit, state}, params) {
        const {data} = await getOneOnlineVul(params)
        return data
      },

      async getPositionOnlineVul({commit, state}, params) {
        const {data} = await getPositionOnlineVul(params)
        return data
      },

      async updateOnlineVul({commit, state}, id) {
        const {data} = await updateOnlineVul(id)
        return data
      }
    }
  }
