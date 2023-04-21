import {
    getAuthInfoStatistic,
    getTaskCountStatistic,
    getVulCountStatistic,
    getTargetCountStatistic
  } from '@/services/octopus/index'

  export default {

    // 命名空间 required
    namespace: 'octopus_index',

    // 原始状态，存储数据
    state: {
      authInfo: {},
      endTaskCount: 0,
      topTenVulTask: [],
      topTenVulType: [],
      vulTotalCount: 0,
      topTenTargetUse: [],
      targetTotalCount: 0
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
      authInfo(state, data) {
        state.authInfo = data
      },
      taskCount(state, data) {
        state.endTaskCount = data.end_count
      },
      vulStatistic(state, data) {
        state.topTenVulTask = data.top_ten_task
        state.topTenVulType = data.top_ten_type
        state.vulTotalCount = data.total_count
      },
      targetStatistic(state, data) {
        state.topTenTargetUse = data.top_ten_target_use
        state.targetTotalCount = data.total_count
      }
    },

    // 暴露方法
    actions: {

      // 获取用户信息统计数据
      async getAuthInfoStatistic({commit, state}, params) {
        const {data} = await getAuthInfoStatistic(params)
        commit('authInfo', data)
        return data
      },

      // 获取任务统计数据
      async getTaskCountStatistic({commit, state}, params) {
        const data = await getTaskCountStatistic(params)
        commit('taskCount', data.data)
      },

      // 获取漏洞统计数据
      async getVulCountStatistic({commit, state}, params) {
        const {data} = await getVulCountStatistic(params)
        commit('vulStatistic', data)
      },

      // 获取资产统计数据
      async getTargetCountStatistic({commit, state}, params) {
        const data = await getTargetCountStatistic(params)
        commit('targetStatistic', data.data)
      }
    }
  }
