import {
  getTaskList,
  startTask,
  stopTask,
  retestTask,
  createTask,
  execTask,
  statusTask,
  deleteTask,
  updateTask,
  pluginsTaskList,
  periodTaskTime,
  getTaskVulList,
  taskVulMisinformation
} from '@/services/octopus/task'
import {

  // privilege,
  // taskStatus,
  // taskAction,
  // vulType,
  // vulStatus,
  // vulLevel,
  // preHandleParam
  taskStatus
} from '@/commons/octopus'

export default {

  // 命名空间 required
  namespace: 'octopus_task',

  // 原始状态，存储数据
  state: {
    taskList: [],
    taskListLength: 0,
    taskVulList: [],
    taskVulListLength: 0,
    statusTaskList: []
  },

  // 处理后状态，处理后的数据
  getters: {},

  // 定义状态如何变化
  mutations: {
    taskList(state, data) {
      state.taskList = data.task_list
      state.taskListLength = data.count
    },
    taskVulList(state, data) {
      state.taskVulList = data.vul_list
      state.taskVulListLength = data.count
    },
    statusTaskList(state, data) {
      state.statusTaskList = data
    }
  },

  // 暴露方法
  actions: {

    // 获取扫描任务列表
    async getTaskList({commit, state}, params) {
      const {data} = await getTaskList(params)
      commit('taskList', data)
    },

    // 新建扫描任务
    async createTask({commit, state}, params) {

      const data = await createTask(params)
      return data
    },

    //  扫描并执行任务
    async execTask({commit, state}, params) {
      const data = await execTask(params)
      return data
    },

     //  查看扫描任务状态
     async statusTask({commit, state}, params) {
      let {data} = await statusTask(params)
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < taskStatus.length; j++) {
          if (taskStatus[j].value == data[i].status_no) {
            data[i].action = taskStatus[j].label
          }
        }
      }
      commit('statusTaskList', data)
    },

    // 删除扫描任务
    async deleteTask({commit, state}, id) {
      const data = await deleteTask(id)
      return data
    },

    // 更新扫描任务
    async updateTask({commit, state}, params) {
      const data = await updateTask(params)
      return data
    },

    // 开启扫描任务
    async startTask({commit, state}, id) {
      const {data} = await startTask(id)
      return data
    },

    // 获取插件
    async pluginsTaskList({commit, state}, params) {
      const {data} = await pluginsTaskList(params)
      return data
    },

    // 周期时间扫描
    async periodTaskTime({commit, state}, params) {
      const {data} = await periodTaskTime(params)
      return data
    },

    // 暂停扫描任务
    async stopTask({commit, state}, id) {
      const {data} = await stopTask(id)
      return data
    },

    // 复测扫描任务
    async retestTask({commit, state}, id) {
      const {data} = await retestTask(id)
      return data
    },

    // 获取扫描任务对应的漏洞列表
    async getTaskVulList({commit, state}, params) {
      const {data} = await getTaskVulList(params)

      // for (let i = 0; i < data.task_vul_list.length; i++) {
      //   data.task_vul_list[i] = JSON.parse(data.task_vul_list[i])
      //   data.task_vul_list[i].type = preHandleParam(data.task_vul_list[i].type, vulType)
      //   data.task_vul_list[i].status = preHandleParam(data.task_vul_list[i].status, vulStatus)
      //   data.task_vul_list[i].level = preHandleParam(data.task_vul_list[i].level, vulLevel)
      // }
      commit('taskVulList', data)
    },

    // 扫描任务对应的漏洞误报
    async taskVulMisinformation({commit, state}, params) {
      const {data} = await taskVulMisinformation(params)
      return data
    }

  }
}
