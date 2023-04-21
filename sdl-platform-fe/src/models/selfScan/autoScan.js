import { getSelfScan } from '@/services/autoScan'

export default {

  // 命名空间 required
  namespace: 'self_scan',

  // 原始状态，存储数据
  state: {
    selfScan: []
  },

  // 处理后状态，处理后的数据
  getters: {},

  // 定义状态如何变化
  mutations: {
    selfScan(state, data) {
      state.selfScan = data
    }
  },

  // 暴露方法
  actions: {

    // 扫描接口
    async setSelfScan({commit, state}, params) {
      const {data} = await getSelfScan(params)
      commit('selfScan', data)
      return data
    }
  }
}
