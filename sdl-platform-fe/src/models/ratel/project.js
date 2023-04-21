import {
    getRatelProjectList,
    getRatelProjectDetail,
    getRatelFollower,
    addRatelFollower,
    getRatelTaskList,
    getRatelTaskDetail,
    getListByTaskId,
    getResultSDLMark,
    getRatelCommit,
    getRatelVulList,
    getListByProjectId,
    getTaskListByTaskId,
    taskClaim,
    updateVul,
    asyncVul,
    changeRatelAppOwner
  } from '@/services/ratel/project.js'

  export default {

    // 命名空间 required
    namespace: 'ratel_project',

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
      async getRatelProjectList({commit, state}, params) {
        const {data} = await getRatelProjectList(params)
        return data
      },

      async getRatelProjectDetail({commit, state}, params) {
        const {data} = await getRatelProjectDetail(params)
        return data
      },

      async getRatelFollower({commit, state}, params) {
        const {data} = await getRatelFollower(params)
        return data
      },

      async addRatelFollower({commit, state}, params) {
        const data = await addRatelFollower(params)
        return data
      },

      async getRatelTaskList({commit, state}, params) {
        const {data} = await getRatelTaskList(params)
        return data
      },

      async getRatelTaskDetail({commit, state}, params) {
        const {data} = await getRatelTaskDetail(params)
        return data
      },

      async getListByTaskId({commit, state}, params) {
        const {data} = await getListByTaskId(params)
        return data
      },

      async getResultSDLMark({commit, state}, params) {
        const {data} = await getResultSDLMark(params)
        return data
      },

      async getRatelCommit({commit, state}, params) {
        const {data} = await getRatelCommit(params)
        return data
      },

      async getRatelVulList({commit, state}, params) {
        const {data} = await getRatelVulList(params)
        return data
      },

      async getListByProjectId({commit, state}, params) {
        const {data} = await getListByProjectId(params)
        return data
      },

      async getTaskListByTaskId({commit, state}, params) {
        const {data} = await getTaskListByTaskId(params)
        return data
      },

      async taskClaim({commit, state}, params) {
        const {data} = await taskClaim(params)
        return data
      },

      async updateVul({commit, state}, params) {
        const {data} = await updateVul(params)
        return data
      },

      async asyncVul({commit, state}, params) {
        const {data} = await asyncVul(params)
        return data
      },

      async changeRatelAppOwner({commit, state}, params) {
        const {data} = await changeRatelAppOwner(params)
        return data
      }
    }
  }
