import { getVideoList,
        getVideoPlay,
        uploadVideoMooc,
        finishVideoMooc,
        importVideoMemberList,
        createMoocTask,
        exportMemberList,
        getVideoUnfinished,
        getVideoComment,
        sendVideoComment,
        authQuestionnaire,
        getCourseList,
        getCourseAllList,
        newQuestionnaire } from '@/services/dolphin/mooc'

export default {

    // 命名空间 required
    namespace: 'dolphin_mooc',

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
        async getVideoList({ commit, state }, name) {
            const {data} = await getVideoList(name)
            return data
        },

        async getVideoPlay({ commit, state }, params) {
            const {data} = await getVideoPlay(params)
            return data
        },

        async getVideoUnfinished({ commit, state }, params) {
            const {data} = await getVideoUnfinished(params)
            return data
        },

        async uploadVideoMooc({ commit, state }, params) {
            const {data} = await uploadVideoMooc(params)
            return data
        },

        async finishVideoMooc({ commit, state }, params) {
            const {data} = await finishVideoMooc(params)
            return data
        },

        async importVideoMemberList({ commit, state }, params) {
            const {data} = await importVideoMemberList(params)
            return data
        },

        async exportMemberList({ commit, state }, params) {
            const {data} = await exportMemberList(params)
            return data
        },

        async createMoocTask({ commit, state }, params) {
            const {data} = await createMoocTask(params)
            return data
        },

        async getVideoComment({ commit, state }, params) {
            const {data} = await getVideoComment(params)
            return data
        },

        async sendVideoComment({ commit, state }, params) {
            const {data} = await sendVideoComment(params)
            return data
        },

        async authQuestionnaire({ commit, state }, params) {
            const {data} = await authQuestionnaire(params)
            return data
        },

        async newQuestionnaire({ commit, state }, params) {
            const {data} = await newQuestionnaire(params)
            return data
        },
        async getCourseList({ commit, state }, params) {
            const {data} = await getCourseList(params)
            return data
        },
        async getCourseAllList({ commit, state }, params) {
            const {data} = await getCourseAllList(params)
            return data
        }
    }
  }
