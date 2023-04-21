import {getBaselineAuditResultList,
  getBaselineRdResultList,
  createProblem,
  updateIssueStatus,
  updateRuleResult,
  updateBaselineStatus,
  calculateScan,
  retestBaseline,
  getBaselineTestTaskInfo,
  scanException,
  rdmarkIssue,
  ignoreException,
  editTaskScan,
  getOutputTaskId
}
from '@/services/dorado/baseline/problemList'

export default {

  namespace: 'problem_list',

  state: {
    baselineAuditResultList: [],
    baselineRdResultList: []
  },
  getters: {},

  // 定义状态如何变化
  mutations: {
    baselineAuditResultList(state, baselineAuditResultList) {
      state.baselineAuditResultList = baselineAuditResultList.baseline_details
    },
    baselineRdResultList(state, baselineRdResultList) {
      state.baselineRdResultList = baselineRdResultList.baseline_details
    }
  },

  // 暴露方法
  actions: {

    async getBaselineAuditResultList({commit, state}, queryParam) {
      const {data} = await getBaselineAuditResultList(queryParam)
      commit('baselineAuditResultList', data)
      return data
    },

    async createProblem({commit, state}, queryParam) {
      const {data} = await createProblem(queryParam)
      return data
    },

    async updateIssueStatus({commit, state}, queryParam) {
      const {data} = await updateIssueStatus(queryParam)
      return data
    },

    async updateRuleResult({commit, state}, queryParam) {
      const {data} = await updateRuleResult(queryParam)
      return data
    },

    async updateBaselineStatus({commit, state}, queryParam) {
      const {data} = await updateBaselineStatus(queryParam)
      return data
    },

    async getBaselineRdResultList({commit, state}, queryParam) {
      const {data} = await getBaselineRdResultList(queryParam)
      commit('baselineRdResultList', data)
      return data
    },

    async calculateScan({commit, state}, queryParam) {
      const {data} = await calculateScan(queryParam)
      return data
    },

    async retestBaseline({commit, state}, queryParam) {
      const {data} = await retestBaseline(queryParam)
      return data
    },

    async getBaselineTestTaskInfo({commit, state}, queryParam) {
      const {data} = await getBaselineTestTaskInfo(queryParam)
      return data
    },

    async scanException({commit, state}, queryParam) {
      const {data} = await scanException(queryParam)
      return data
    },

    async ignoreException({commit, state}, queryParam) {
      const {data} = await ignoreException(queryParam)
      return data
    },

    async rdmarkIssue({commit, state}, queryParam) {
      const {data} = await rdmarkIssue(queryParam)
      return data
    },

    async editTaskScan({commit, state}, queryParam) {
      const {data} = await editTaskScan(queryParam)
      return data
    },
    async getOutputTaskId({commit, state}, queryParam) {
      const {data} = await getOutputTaskId(queryParam)
      return data
    }
  }
}
