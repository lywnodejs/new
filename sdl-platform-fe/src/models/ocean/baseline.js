import {
    baselineNewCTR,
    baselineFinishById,
    baselineFinishByTime,
    baselineScanTaskByTime,
    baselineScanTaskById,
    baselineCheckIssueById,
    baselineCheckIssueByTime,
    baselineProcessTimeById,
    baselineProcessTimeByTime,
    baselineMonitor,
    npsHighStartByTime,
    npsLowStartByTime,
    npsDetails,
    npsOcean,
    updateQuestionnaire
  } from '@/services/ocean/baseline'

  export default {

    namespace: 'ocean_baseline',

    state: {
      },
    getters: {},

    // 定义状态如何变化
    mutations: {
    },

    // 暴露方法
    actions: {
      async baselineNewCTR() {
        const {data} = await baselineNewCTR()
        return data
      },
      async baselineFinishById({commit, state}, queryParam) {
        const {data} = await baselineFinishById(queryParam)
        return data
      },
      async baselineFinishByTime({commit, state}, queryParam) {
        const {data} = await baselineFinishByTime(queryParam)
        return data
      },
      async baselineScanTaskByTime({commit, state}, queryParam) {
        const {data} = await baselineScanTaskByTime(queryParam)
        return data
      },
      async baselineScanTaskById({commit, state}, queryParam) {
        const {data} = await baselineScanTaskById(queryParam)
        return data
      },
      async baselineCheckIssueById({commit, state}, queryParam) {
        const {data} = await baselineCheckIssueById(queryParam)
        return data
      },
      async baselineCheckIssueByTime({commit, state}, queryParam) {
        const {data} = await baselineCheckIssueByTime(queryParam)
        return data
      },
      async baselineProcessTimeById({commit, state}, queryParam) {
        const {data} = await baselineProcessTimeById(queryParam)
        return data
      },
      async baselineProcessTimeByTime({commit, state}, queryParam) {
        const {data} = await baselineProcessTimeByTime(queryParam)
        return data
      },
      async baselineMonitor({commit, state}, queryParam) {
        const {data} = await baselineMonitor(queryParam)
        return data
      },
      async npsHighStartByTime({commit, state}, queryParam) {
        const {data} = await npsHighStartByTime(queryParam)
        return data
      },
      async npsLowStartByTime({commit, state}, queryParam) {
        const {data} = await npsLowStartByTime(queryParam)
        return data
      },
      async npsDetails({commit, state}, queryParam) {
        const {data} = await npsDetails(queryParam)
        return data
      },
      async npsOcean({commit, state}, queryParam) {
        const {data} = await npsOcean(queryParam)
        return data
      },
      async updateQuestionnaire({commit, state}, queryParam) {
        const {data} = await updateQuestionnaire(queryParam)
        return data
      }
    }
  }
