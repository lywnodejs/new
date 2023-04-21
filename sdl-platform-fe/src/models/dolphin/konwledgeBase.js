import { createVulKnowledge, getVulKnowledgeList, updateVulKnowledge, disableVulKnowledge, enableVulKnowledge, createSlnKnowledge, getSlnKnowledgeList, updateSlnKnowledge, disableSlnKnowledge, enableSlnKnowledge, getPreInfo, uploadPic } from '@/services/dolphin/knowledgeBase'

export default {

    // 命名空间 required
    namespace: 'dolphin_knowledgeBase',

    // 原始状态，存储数据
    state: {
        vulKnowledgeList: [],
        vulListLength: 0,
        slnKnowledgeList: [],
        slnKnowledgeListLength: 0
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
        getVulKnowledgeList(state, vulKnowledgeList) {
            state.vulKnowledgeList = vulKnowledgeList.vul_knowledge_list
            state.vulListLength = vulKnowledgeList.count
        },
        getSlnKnowledgeList(state, slnKnowledgeList) {
            state.slnKnowledgeList = slnKnowledgeList.sln_knowledge_list
            state.slnKnowledgeListLength = slnKnowledgeList.count
        }
    },

    // 暴露方法
    actions: {

        //  获取漏洞知识
        async getVulKnowledgeList({ commit, state }, params) {
            const {data} = await getVulKnowledgeList(params)
            commit('getVulKnowledgeList', data)
        },

        // 创建漏洞知识
        async createVulKnowledge({ commit, state }, params) {
            const {data} = await createVulKnowledge(params)
            return data
        },

        // 更新漏洞知识
        async updateVulKnowledge({ commit, state }, params) {
            const {data} = await updateVulKnowledge(params)
            return data
        },

        // 禁用漏洞知识
        async disableVulKnowledge({ commit, state }, id) {
            const {data} = await disableVulKnowledge(id)
            return data
        },

        // 启用漏洞知识
        async enableVulKnowledge({ commit, state }, id) {
            const {data} = await enableVulKnowledge(id)
            return data
        },

        //  获取安全文案
        async getSlnKnowledgeList({ commit, state }, name) {
            const {data} = await getSlnKnowledgeList(name)
            commit('getSlnKnowledgeList', data)
        },

        // 创建安全文案
        async createSlnKnowledge({ commit, state }, params) {
            const {data} = await createSlnKnowledge(params)
            return data
        },

        // 更新安全文案
        async updateSlnKnowledge({ commit, state }, params) {
            const {data} = await updateSlnKnowledge(params)
            return data
        },

        // 禁用安全文案
        async disableSlnKnowledge({ commit, state }, id) {
            const {data} = await disableSlnKnowledge(id)
            return data
        },

        // 启用安全文案
        async enableSlnKnowledge({ commit, state }, id) {
            const {data} = await enableSlnKnowledge(id)
            return data
        },

        async getPreInfo() {
            const {data} = await getPreInfo()
            return data
        },
        async uploadPic(file) {
            const {data} = await uploadPic(file)
            return data
        }
    }
  }
