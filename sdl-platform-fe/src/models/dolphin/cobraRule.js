import {
  createCobraRule,
  updateCobraRule
} from '@/services/dolphin/cobraRule'

export default {

  // 命名空间 required
  namespace: 'dolphin_cobra_rule',

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

    // 新建Cobra规则
    async createCobraRule({commit, state}, params) {
      const {data} = await createCobraRule(params)
      return data
    },

    // 更新Cobra规则
    async updateCobraRule({commit, state}, params) {
      const {data} = await updateCobraRule(params)
      return data
    }
  }
}
