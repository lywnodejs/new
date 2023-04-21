import { getMobileRule, createMobileRule, updateMobileRule, disableMobileRule, enableMobileRule } from '@/services/dolphin/mobileRule'

export default {

    // 命名空间 required
    namespace: 'dolphin_mobile',

    // 原始状态，存储数据
    state: {
        mobileRule: [],
        mobileRuleLength: 0
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
        getMobileRule(state, mobileRule) {
            state.mobileRule = mobileRule.mobile_rule_list
            state.mobileRuleLength = mobileRule.count
        }
    },

    // 暴露方法
    actions: {

        //  获取白盒规则
        async getMobileRule({ commit, state }, name) {
            const {data} = await getMobileRule(name)
            commit('getMobileRule', data)
        },

        // 创建白盒规则
        async createMobileRule({ commit, state }, params) {
            const {data} = await createMobileRule(params)
            return data
        },

        // 更新白盒规则
        async updateMobileRule({ commit, state }, params) {
            const {data} = await updateMobileRule(params)
            return data
        },

        // 禁用白盒规则
        async disableMobileRule({ commit, state }, id) {
            const {data} = await disableMobileRule(id)
            return data
        },

        // 启用白盒规则
        async enableMobileRule({ commit, state }, id) {
            const {data} = await enableMobileRule(id)
            return data
        }
    }
  }
