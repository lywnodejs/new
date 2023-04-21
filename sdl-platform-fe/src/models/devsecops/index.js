import {
    getAllResults,
    updateRuleResult,
    updateVulResult,
    updateBaselineResult
  } from '@/services/devsecops/index'

  export default {

    // 命名空间 required
    namespace: 'devsecops_index',

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

      async getAllResults({commit, state}, params) {
        const {data} = await getAllResults(params)
        return data
      },

      async updateRuleResult({commit, state}, params) {
        const {data} = await updateRuleResult(params)
        return data
      },

      async updateVulResult({commit, state}, params) {
        const {data} = await updateVulResult(params)
        return data
      },

      async updateBaselineResult({commit, state}, id) {
        const {data} = await updateBaselineResult(id)
        return data
      }
    }
  }
