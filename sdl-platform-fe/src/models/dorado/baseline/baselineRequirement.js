import {getBaselineReqList,
   confirmBaselineReqList,
   fecthBaselineCodeWhiteEvaluation,
   deleteOutputBaseline,
   addOutputBaseline,
   listAllBaseline,
   getRepoTree,
   remarkBaseline,
   baselineNewCTR,
   queryNewUser,
   questionnaireAuth,
   questionnaireNew,
   getOutputSensitive
  } from '@/services/dorado/baseline/baselineRequirement'

export default {

  namespace: 'baseline_requirement',

  state: {
    baselineReqList: [],
    whiteEvaluation: []

  },
  getters: {},

  // 定义状态如何变化
  mutations: {
    baselineReqList(state, baselineReqList) {
      state.baselineReqList = baselineReqList.baseline_output_list
    },
    whiteEvaluation(state, whiteEvaluation) {
      state.whiteEvaluation = whiteEvaluation
    }
  },

  // 暴露方法
  actions: {

    async getBaselineReqList({commit, state}, queryParam) {
      const {data} = await getBaselineReqList(queryParam)
      commit('baselineReqList', data)
      return data
    },

    async confirmBaselineReqList({commit, state}, queryParam) {
      const {data} = await confirmBaselineReqList(queryParam)
      return data
    },

    async getRepoTree({commit, state}, queryParam) {
      const {data} = await getRepoTree(queryParam)
      return data
    },

    async fecthBaselineCodeWhiteEvaluation({commit, state}, queryParam) {
      const {data} = await fecthBaselineCodeWhiteEvaluation(queryParam)
      commit('whiteEvaluation', data)
      return data
    },

    async addOutputBaseline({commit, state}, queryParam) {
      const {data} = await addOutputBaseline(queryParam)
      return data
    },

    async deleteOutputBaseline({commit, state}, queryParam) {
      const {data} = await deleteOutputBaseline(queryParam)
      return data
    },

    async listAllBaseline({commit, state}, queryParam) {
      const {data} = await listAllBaseline(queryParam)
      return data
    },

    async remarkBaseline({commit, state}, queryParam) {
      const res = await remarkBaseline(queryParam)
      return res
    },
    async baselineNewCTR({commit, state}, queryParam) {
      const {data} = await baselineNewCTR(queryParam)
      return data
    },

    async questionnaireNew({commit, state}, queryParam) {
      const {data} = await questionnaireNew(queryParam)
      return data
    },

    async questionnaireAuth({commit, state}, queryParam) {
      const {data} = await questionnaireAuth(queryParam)
      return data
    },

    async queryNewUser({commit, state}, queryParam) {
      const {data} = await queryNewUser(queryParam)
      return data
    },

    async getOutputSensitive({commit, state}, queryParam) {
      const {data} = await getOutputSensitive(queryParam)
      return data
    }
  }
}
