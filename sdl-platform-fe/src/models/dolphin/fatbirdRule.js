import {
    createFatbirdRule,
    updateFatbirdRule
  } from '@/services/dolphin/fatbirdRule'

  export default {

    // 命名空间 required
    namespace: 'dolphin_fatbird_rule',

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

      // 新建Cobra规则
      async createFatbirdRule({commit, state}, params) {
        const {data} = await createFatbirdRule(params)
        return data
      },

      // 更新Cobra规则
      async updateFatbirdRule({commit, state}, params) {
        const {data} = await updateFatbirdRule(params)
        return data
      }

    }
  }
