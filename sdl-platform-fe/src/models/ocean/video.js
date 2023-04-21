import {
    videoCoverage,
    videoNpsDetails
  } from '@/services/ocean/video'

  export default {

    namespace: 'ocean_video',

    state: {
    },
    getters: {},

    // 定义状态如何变化
    mutations: {
    },

    // 暴露方法
    actions: {
      async videoCoverage({commit, state}, queryParam) {
        const {data} = await videoCoverage(queryParam)
        return data
      },
      async videoNpsDetails({commit, state}, queryParam) {
        const {data} = await videoNpsDetails(queryParam)
        return data
      }
    }
}
