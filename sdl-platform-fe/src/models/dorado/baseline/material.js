import {fecthCodeWhiteEvaluation,
    getWhiteScanStatus,
    startWhiteScan,
    createBaselineCodeWhiteEvaluation,
    updateBaselineCodeWhiteEvaluation,
    getCodeWhiteEvaluationDetail,
    deleteBaselineCodeWhiteEvaluationById,
    getBaselineCodeWhiteEvaluationDetail,
    fecthBaselineCodeWhiteEvaluation
   } from '@/services/dorado/baseline/material'

 export default {

   namespace: 'baseline_material',

   state: {
    evaluationInfo: [],
    evaluationBaselineInfo: [],
    whiteEvaList: []
   },
   getters: {},

   // 定义状态如何变化
   mutations: {
     evaluationInfo(state, evaluationInfo) {
        state.evaluationInfo = evaluationInfo
     },
     evaluationBaselineInfo(state, evaluationBaselineInfo) {
        state.evaluationBaselineInfo = evaluationBaselineInfo
     },
     whiteEvaList(state, whiteEvaList) {
        state.whiteEvaList = whiteEvaList
     }
   },

   // 暴露方法
   actions: {

     async fecthCodeWhiteEvaluation({commit, state}, queryParam) {
       const res = await fecthCodeWhiteEvaluation(queryParam)
       commit('whiteEvaList', res.data.white_eva_list)
       return res
     },

     async fecthBaselineCodeWhiteEvaluation({commit, state}, queryParam) {
        const res = await fecthBaselineCodeWhiteEvaluation(queryParam)
        commit('whiteEvaList', res.data.white_eva_list)
        console.log(res)
        return res
    },

     async getWhiteScanStatus({commit, state}, queryParam) {
       const {data} = await getWhiteScanStatus(queryParam)
       return data
     },

     async startWhiteScan({commit, state}, queryParam) {
       const {data} = await startWhiteScan(queryParam)
       return data
     },

     async createBaselineCodeWhiteEvaluation({commit, state}, queryParam) {
       const res = await createBaselineCodeWhiteEvaluation(queryParam)
       return res
     },

     async updateBaselineCodeWhiteEvaluation({commit, state}, queryParam) {
       const res = await updateBaselineCodeWhiteEvaluation(queryParam)
       return res
     },

     async getCodeWhiteEvaluationDetail({commit, state}, queryParam) {
       const res = await getCodeWhiteEvaluationDetail(queryParam)
       commit('evaluationInfo', res.data)
       return res
     },

     async getBaselineCodeWhiteEvaluationDetail({commit, state}, queryParam) {
        const res = await getBaselineCodeWhiteEvaluationDetail(queryParam)
        commit('evaluationBaselineInfo', res.data)
        return res
      },

     async deleteBaselineCodeWhiteEvaluationById({commit, state}, queryParam) {
       const {data} = await deleteBaselineCodeWhiteEvaluationById(queryParam)
       return data
     }
   }
 }
