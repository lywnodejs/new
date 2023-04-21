import {
  getProjectLevelRuleList,
  updateProjectLevelRule,
  createProjectLevelRule,
  deleteProjectLevelRule,
  testProjectLevelRule
} from '@/services/dolphin/projectLevelRule'

export default {

  // 命名空间 required
  namespace: 'dolphin_project_level_rule',

  // 原始状态，存储数据
  state: {
    projectLevelRuleList: [],
    projectLevelRuleListLength: 0,
    testProjectLevelRuleResult: ''
  },

  // 处理后状态，处理后的数据
  getters: {},

  // 定义状态如何变化
  mutations: {
    projectLevelRuleList(state, projectLevelRuleList) {
      state.projectLevelRuleList = projectLevelRuleList.project_level_generate_rule_list
      state.projectLevelRuleListLength = projectLevelRuleList.count
    },
    testProjectLevelRuleResult(state, testProjectLevelRuleResult) {
      state.testProjectLevelRuleResult = testProjectLevelRuleResult
    }
  },

  // 暴露方法
  actions: {

    // 获取项目规则列表
    async getProjectLevelRuleList({commit, state}, params) {
      const {data} = await getProjectLevelRuleList(params)
      commit('projectLevelRuleList', data)
    },

    // 新建项目规则规则
    async createProjectLevelRule({commit, state}, params) {
      const {data} = await createProjectLevelRule(params)
      return data
    },

    // 更新项目规则规则
    async updateProjectLevelRule({commit, state}, params) {
      const {data} = await updateProjectLevelRule(params)
      return data
    },

    // 删除项目规则规则
    async deleteProjectLevelRule({commit, state}, id) {
      const {data} = await deleteProjectLevelRule(id)
      return data
    },

    // 测试项目规则规则
    async testProjectLevelRule({commit, state}, id) {
      const {data} = await testProjectLevelRule(id)
      commit('testProjectLevelRuleResult', data)
      return data
    }
  }
}
