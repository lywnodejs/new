import {
    monthlyReport
  } from '@/services/ocean/report'

  export default {

    namespace: 'ocean_report',

    state: {
    },
    getters: {},

    // 定义状态如何变化
    mutations: {
    },

    // 暴露方法
    actions: {
      async monthlyReport({commit, state}, queryParam) {
        const {data} = await monthlyReport(queryParam)
        return data
      }
    }
}
