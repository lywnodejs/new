import {getVulAndSolutionIdsByThreatId, bindVulByThreatId, bindSolutionByThreatId, getVulAndSolutionIdsByTestId, bindVulByTestId, bindSolutionByTestId} from '@/services/dolphin/knowledgeRelation'

export default {

    // 命名空间 required
    namespace: 'knowledge_relation',

    // 原始状态，存储数据
    state: {
        VulAndSolutionIds: []
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
     VulAndSolutionIds(state, ids) {
            state.VulAndSolutionIds = ids
        }
    },

    // 暴露方法
    actions: {

        // 获取威胁列表
        async getVulAndSolutionIdsByThreatId({ commit, state }, params) {
            const {data} = await getVulAndSolutionIdsByThreatId(params)
            commit('VulAndSolutionIds', data)
            return data.vul_knowledge_ids
        },

        // 绑定漏洞知识
        async bindVulByThreatId({ commit, state }, params) {
            const {data} = await bindVulByThreatId(params)
            return data
        },

        // 绑定安全方案
        async bindSolutionByThreatId({ commit, state }, params) {
            const {data} = await bindSolutionByThreatId(params)
            return data
        },

        // 获取威胁列表
        async getVulAndSolutionIdsByTestId({ commit, state }, params) {
          const {data} = await getVulAndSolutionIdsByTestId(params)
          commit('VulAndSolutionIds', data)
          return data.vul_knowledge_ids
        },

        // 绑定漏洞知识
        async bindVulByTestId({ commit, state }, params) {
          const {data} = await bindVulByTestId(params)
          return data
        },

        // 绑定安全方案
        async bindSolutionByTestId({ commit, state }, params) {
          const {data} = await bindSolutionByTestId(params)
          return data
        }

    }
  }
