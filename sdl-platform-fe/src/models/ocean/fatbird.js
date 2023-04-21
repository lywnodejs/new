import {
    ruleFalseIndex
  } from '@/services/ocean/fatbird'

  export default {

    namespace: 'ocean_fatbird',

    state: {
      },
    getters: {},

    // 定义状态如何变化
    mutations: {
    },

    // 暴露方法
    actions: {
      async ruleFalseIndex({commit, state}, queryParam) {
        const {data} = await ruleFalseIndex(queryParam)
        return data
      }
    }
  }
