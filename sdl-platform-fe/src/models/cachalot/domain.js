import {
    modifyDomain,
    dimqueryDomain,
    getItDomain,
    updateItDomain,
    modifyItDomain,
    getGitDomain,
    getGitSensitive,
    getGitSdkInfo
  } from '@/services/cachalot/domain.js'

  export default {

    // 命名空间 required
    namespace: 'cachalot_domain',

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

      async modifyDomain({commit, state}, params) {
        const {data} = await modifyDomain(params)
        return data
      },

      async dimqueryDomain({commit, state}, params) {
        const {data} = await dimqueryDomain(params)
        return data
      },

      async getItDomain({commit, state}, params) {
        const {data} = await getItDomain(params)
        return data
      },

      async updateItDomain({commit, state}, params) {
        const {data} = await updateItDomain(params)
        return data
      },
      async modifyItDomain({commit, state}, params) {
        const {data} = await modifyItDomain(params)
        return data
      },
      async getGitDomain({commit, state}, params) {
        const {data} = await getGitDomain(params)
        return data
      },
      async getGitSensitive({commit, state}, params) {
        const {data} = await getGitSensitive(params)
        return data
      },
      async getGitSdkInfo({commit, state}, params) {
        const {data} = await getGitSdkInfo(params)
        return data
      }
    }
  }
