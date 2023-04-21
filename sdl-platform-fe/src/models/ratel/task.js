import {
  getHistoryTask
} from '@/services/ratel/task'
import {
  taskStatus,
  preHandleParam,
  handleTimestamp
} from '@/commons/ratel'

export default {

  // 命名空间 required
  namespace: 'ratel_task',

  // 原始状态，存储数据
  state: {
    taskList: [],
    taskListLength: 0
  },

  // 处理后状态，处理后的数据
  getters: {},

  // 定义状态如何变化
  mutations: {
    taskList(state, data) {
      state.taskList = data.data_list
      state.taskListLength = data.count
    }
  },

  // 暴露方法
  actions: {

    // 获取扫描任务列表
    async getHistoryTask({commit, state}, params) {
      const {data} = await getHistoryTask(params)
      for (let i = 0; i < data.data_list.length; i++) {
        data.data_list[i].Status = preHandleParam(data.data_list[i].Status, taskStatus)
        data.data_list[i].StartTime = handleTimestamp(data.data_list[i].StartTime)
        data.data_list[i].AnalyzeEndTime = handleTimestamp(data.data_list[i].AnalyzeEndTime)
      }
      commit('taskList', data)
    }
  }
}
