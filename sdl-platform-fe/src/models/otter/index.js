import {
    getOtterList,
    getOtterTaskList,
    getOtterVulList,
    getOtterDetail,
    getOtterTaskDetail,
    getTaskListByProjectId,
    getVulListByProjectId,
    getListByTaskId,
    addProjectFollower,
    getProjectFollower,
    getFpList,
    resultRdMark,
    resultSDLMark,
    claimTask,
    commitResult,
    createTask,
    getSelfScanDetail,
    getSelfScanResultList
  } from '@/services/otter'

  export default {

    // 命名空间 required
    namespace: 'otter',

    // 原始状态，存储数据
    state: {
      otterList: [],
      otterListLength: 0,
      otterTaskList: [],
      otterTaskListLength: 0,
      otterVulList: [],
      otterVulListLength: 0,
      fpList: [],
      fpListLength: 0
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
        otterList(state, data) {
            state.otterList = data.otter_project_list
            state.otterListLength = data.count
        },
        otterTaskList(state, data) {
            state.otterTaskList = data.otter_task_list
            state.otterTaskListLength = data.count
        },
        otterVulList(state, data) {
          state.otterVulList = data.otter_vul_list
          state.otterVulListLength = data.count
        },
        fpList(state, data) {
          state.fpList = data.otter_false_positive_list
          state.fpListLength = data.count
        },
        resultRdMark(state, data) {
          state
        }
    },

    // 暴露方法
    actions: {

      // 项目列表
      async getOtterList({commit, state}, params) {
        const {data} = await getOtterList(params)
        commit('otterList', data)
      },

      async getOtterDetail({commit, state}, params) {
        const {data} = await getOtterDetail(params)
        return data
      },

      async getTaskListByProjectId({commit, state}, params) {
        const {data} = await getTaskListByProjectId(params)
        return data
      },

      async getVulListByProjectId({commit, state}, params) {
        const {data} = await getVulListByProjectId(params)
        return data
      },

      async getProjectFollower({commit, state}, params) {
        const {data} = await getProjectFollower(params)
        return data
      },

      async addProjectFollower({commit, state}, params) {
        const {data} = await addProjectFollower(params)
        return data
      },

      // 任务列表
      async getOtterTaskList({commit, state}, params) {
        const {data} = await getOtterTaskList(params)
        commit('otterTaskList', data)
      },

      async getOtterTaskDetail({commit, state}, params) {
        const {data} = await getOtterTaskDetail(params)
        return data
      },

      async createTask({commit, state}, params) {
        const {data} = await createTask(params)
        return data
      },

      async getListByTaskId({commit, state}, params) {
        const {data} = await getListByTaskId(params)
        return data
      },

      // 任务列表
      async getOtterVulList({commit, state}, params) {
        const {data} = await getOtterVulList(params)
        commit('otterVulList', data)
      },

      async claimTask({commit, state}, params) {
        const {data} = await claimTask(params)
        return data
      },

      async resultRdMark({commit, state}, params) {
        const data = await resultRdMark(params)
        return data
      },

      async resultSDLMark({commit, state}, params) {
        const data = await resultSDLMark(params)
        return data
      },

      async commitResult({commit, state}, params) {
        const data = await commitResult(params)
        return data
      },

      // 错误列表
      async getFpList({commit, state}, params) {
        const {data} = await getFpList(params)
        commit('fpList', data)
      },

      async getSelfScanDetail({commit, state}, params) {
        const {data} = await getSelfScanDetail(params)
        return data
      },

      async getSelfScanResultList({commit, state}, params) {
        const {data} = await getSelfScanResultList(params)
        return data
      }
    }
  }
