import {
  getBaselineRuleList,
  updateBaselineRule,
  createBaselineRule,
  deleteBaselineRule,
  testBaselineRule
} from '@/services/dolphin/baseLineRule'

export default {

  // 命名空间 required
  namespace: 'dolphin_baseline_rule',

  // 原始状态，存储数据
  state: {
    baselineRuleList: [],
    baselineRuleListLength: 0,
    testBaselineRuleResult: []
  },

  // 处理后状态，处理后的数据
  getters: {},

  // 定义状态如何变化
  mutations: {
    baselineRuleList(state, baselineRuleList) {
      state.baselineRuleList = baselineRuleList.baseline_generate_rule_list
      state.baselineRuleListLength = baselineRuleList.count
    },
    testBaselineRuleResult(state, testBaselineRuleResult) {
      state.testBaselineRuleResult = testBaselineRuleResult
    }
  },

  // 暴露方法
  actions: {

    // 获取基线规则列表
    async getBaselineRuleList({commit, state}, params) {
      const {data} = await getBaselineRuleList(params)
      commit('baselineRuleList', data)
      return data
    },

    // 新建基线规则
    async createBaselineRule({commit, state}, params) {
      const {data} = await createBaselineRule(params)
      return data
    },

    // 更新基线规则
    async updateBaselineRule({commit, state}, params) {
      const {data} = await updateBaselineRule(params)
      return data
    },

    // 删除基线规则
    async deleteBaselineRule({commit, state}, id) {
      const {data} = await deleteBaselineRule(id)
      return data
    },

    // 测试基线规则
    async testBaselineRule({commit, state}, params) {
      const {data} = await testBaselineRule(params)
      commit('testBaselineRuleResult', data)
      return data
    }
  }
}
