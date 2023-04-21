import {
    userAuthList,
    userAuthcreate,
    userAuthUpdate,
    userAuthDelete,
    userAuthTemplete,
    signAgreementUserAuth,
    getUserAuth
  } from '@/services/octopus/userAuth'

  export default {

    // 命名空间 required
    namespace: 'octopus_userauth',

    // 原始状态，存储数据
    state: {
      userauthList: [],
      userAuthListLength: 0
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
       userAuth(state, data) {
        state.userauthList = data.auth_list
        state.userAuthListLength = data.count
      }
    },

    // 暴露方法
    actions: {

      // 获取漏洞列表
      async userAuthList({commit, state}, params) {
        const {data} = await userAuthList(params)
        commit('userAuth', data)
      },

      // 删除漏洞
      async userAuthcreate({commit, state}, params) {
        const data = await userAuthcreate(params)
        return data
      },

      // 漏洞误报
      async userAuthUpdate({commit, state}, params) {
        const {data} = await userAuthUpdate(params)
        return data
      },

      async userAuthDelete({commit, state}, params) {
        const data = await userAuthDelete(params)
        return data
      },

      async userAuthTemplete({commit, state}) {
        const data = await userAuthTemplete()
        return data
      },

      async getUserAuth({commit, state}, params) {
        const data = await getUserAuth(params)
        return data
      },

      async signAgreementUserAuth({commit, state}, params) {
        const data = await signAgreementUserAuth(params)
        return data
      }
    }
  }
