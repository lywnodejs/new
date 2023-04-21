import { getWhiteRule, createWhiteRule, updateWhiteRule, disableWhiteRule, enableWhiteRule } from '@/services/dolphin/whiteRule'

export default {

    // 命名空间 required
    namespace: 'dolphin_white',

    // 原始状态，存储数据
    state: {
        whiteRule: [],
        whiteRuleList: 0
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
        getWhiteRule(state, whiteRule) {
            state.whiteRule = whiteRule.white_rule_list
            state.whiteRuleList = whiteRule.count
        }
    },

    // 暴露方法
    actions: {

        //  获取白盒规则
        async getWhiteRule({ commit, state }, name) {
            const {data} = await getWhiteRule(name)
            commit('getWhiteRule', data)
        },

        // 创建白盒规则
        async createWhiteRule({ commit, state }, params) {
            const {data} = await createWhiteRule(params)
            return data
        },

        // 更新白盒规则
        async updateWhiteRule({ commit, state }, params) {
            const {data} = await updateWhiteRule(params)
            return data
        },

        // 禁用白盒规则
        async disableWhiteRule({ commit, state }, id) {
            const {data} = await disableWhiteRule(id)
            return data
        },

        // 启用白盒规则
        async enableWhiteRule({ commit, state }, id) {
            const {data} = await enableWhiteRule(id)
            return data
        }
    }
  }
