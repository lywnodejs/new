import {
    getFpList,
    deleteFpById
  } from '@/services/ratel/falsePositive'

  export default {

    // 命名空间 required
    namespace: 'ratel_falsePositive',

    // 原始状态，存储数据
    state: {
      assetsList: [],
      assetsListLength: 0
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
    },

    // 暴露方法
    actions: {
      async getFpList({commit, state}, params) {
        const {data} = await getFpList(params)
        return data
      },

      async deleteFpById({commit, state}, params) {
        const {data} = await deleteFpById(params)
        return data
      }
    }
  }
