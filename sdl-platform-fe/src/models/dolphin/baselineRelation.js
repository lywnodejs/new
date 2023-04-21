import {getCobraList, getFatbirdList, getTestRuleIdsByBaselineId, bindTestRuleByBaselineId} from '@/services/dolphin/baselineRelation'

export default {

    // 命名空间 required
    namespace: 'dolphin_baseline_relation',

    // 原始状态，存储数据
    state: {
      fatbirdList: [],
      fatbirdListLength: 0,
      cobraList: [],
      cobraListLength: 0,
      cobraIds: []
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
      getCobraList(state, cobraList) {
        state.cobraList = cobraList.cobra_rule_list
        state.cobraListLength = cobraList.count
      },
      cobraIds(state, ids) {
        state.cobraIds = ids
      },
      getFatbirdList(state, fatbirdList) {
        state.fatbirdList = fatbirdList.fatbird_rule_list
        state.fatbirdListLength = fatbirdList.count
      }
    },

    // 暴露方法
    actions: {

      // 获取Cobra规则列表
      async getCobraList({ commit, state }, params) {
        const {data} = await getCobraList(params)
        commit('getCobraList', data)
        return data
      },

      // 获取fatbird规则列表
      async getFatbirdList({ commit, state }, params) {
        const {data} = await getFatbirdList(params)
        commit('getFatbirdList', data)
        return data
      },

      // 获取已绑定Cobra规则
      async getTestRuleIdsByBaselineId({ commit, state }, params) {
        const {data} = await getTestRuleIdsByBaselineId(params)
        commit('cobraIds', data)
        return data.test_rule_ids
      },

      // 绑定Cobra规则
      async bindTestRuleByBaselineId({ commit, state }, params) {
        const {data} = await bindTestRuleByBaselineId(params)
        return data
      }
    }
  }
