import {
  getWOInfo
} from '@/services/ratel/workorder'
import {
  vulLevel,
  workorderStatus,
  handleTimestamp,
  preHandleParam
} from '@/commons/ratel'

export default {

  // 命名空间 required
  namespace: 'ratel_workorder',

  // 原始状态，存储数据
  state: {
    workorderList: [],
    workorderListLength: 0
  },

  // 处理后状态，处理后的数据
  getters: {},

  // 定义状态如何变化
  mutations: {
    workorderList(state, data) {
      state.workorderList = data.data_list
      state.workorderListLength = data.count
    }
  },

  // 暴露方法
  actions: {

    // 获取工单列表
    async getWOInfo({commit, state}, params) {
      const {data} = await getWOInfo(params)
      for (let i = 0; i < data.data_list.length; i++) {
        data.data_list[i].VulLevel = preHandleParam(data.data_list[i].VulLevel, vulLevel)
        data.data_list[i].WOStatus = preHandleParam(data.data_list[i].WOStatus, workorderStatus)
        data.data_list[i].WOTime = handleTimestamp(data.data_list[i].WOTime)
      }
      commit('workorderList', data)
    }
  }
}
