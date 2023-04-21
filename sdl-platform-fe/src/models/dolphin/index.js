import { getVulKnowledge, getVulKnowledgeById, getSlnKnowledge, getSlnKnowledgeById } from '@/services/dolphin'

export default {

    // 命名空间 required
    namespace: 'dolphin',

    // 原始状态，存储数据
    state: {
        vulKnowledge: [],
        vulKnowledgeDetail: {},
        slnKnowledge: [],
        slnKnowledgeDetail: {}
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
        vulKnowledge(state, vulKnowledge) {
            state.vulKnowledge = vulKnowledge
        },
        vulKnowledgeDetail(state, vulKnowledgeDetail) {
            state.vulKnowledgeDetail = vulKnowledgeDetail
        },
        slnKnowledge(state, slnKnowledge) {
            state.slnKnowledge = slnKnowledge
        },
        slnKnowledgeDetail(state, slnKnowledgeDetail) {
            state.slnKnowledgeDetail = slnKnowledgeDetail
        }
    },

    // 暴露方法
    actions: {

        // 获获取知识库信息
        async getVulKnowledgeData({ commit, state }, name) {
            const {data} = await getVulKnowledge(name)
            commit('vulKnowledge', data.vul_knowledge_list)
            return data.vul_knowledge_list
        },

        // 根据ID获取知识库信息
        async getVulKnowledgeDetail({ commit, state }, id) {
            const {data} = await getVulKnowledgeById(id)
            commit('vulKnowledgeDetail', data.vul_knowledge_list[0])
        },

        //  获取安全库
        async getSlnKnowledge({ commit, state }, name) {
            const {data} = await getSlnKnowledge(name)
            commit('slnKnowledge', data.sln_knowledge_list)
            return data.sln_knowledge_list
        },
        async getSlnKnowledgeDetail({ commit, state }, id) {
            const {data} = await getSlnKnowledgeById(id)
            commit('slnKnowledgeDetail', data.sln_knowledge_list[0])
        }
    }
  }
