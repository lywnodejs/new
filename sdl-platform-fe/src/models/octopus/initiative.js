import {
  createScanTask,
  getHostPluginScan,
  getWebPluginScan,
  getScanVulList
} from '@/services/octopus/initiative'

export default {

  // 命名空间 required
  namespace: 'octopus_initiative',

  // 原始状态，存储数据
  state: {
    scanValList: [],
    vulListLength: 0
  },

  // 处理后状态，处理后的数据
  getters: {},

  // 定义状态如何变化
  mutations: {
    scanValList(state, data) {
      state.scanValList = data.task_list
      state.vulListLength = data.count
    }
  },

  // 暴露方法
  actions: {

    // 获取扫描任务列表
    // async getTaskList({commit, state}, params) {
    //   const {data} = await getTaskList(params)
    //   commit('taskList', data)
    // },

    // 新建扫描任务
    async createScanTask({commit, state}, params) {

      const data = await createScanTask(params)
      return data
    },

    async getHostPluginScan({commit, state}, params) {
      const data = await getHostPluginScan(params)
      return data
    },

    async getWebPluginScan({commit, state}, params) {
      const data = await getWebPluginScan(params)
      return data
    },

    async getScanVulList({commit, state}, params) {
      const data = getScanVulList(params)
      commit('scanValList', data)
      return data
    }
  }
}
