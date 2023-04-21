import { getBlackPlugin, createBlackPlugin, updateBlackPlugin, disableBlackPlugin, enableBlackPlugin } from '@/services/dolphin/blackPlugin'

export default {

    // 命名空间 required
    namespace: 'dolphin_black',

    // 原始状态，存储数据
    state: {
        blackPlugin: [],
        blackPluginLength: 0
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
        getBlackPlugin(state, blackPlugin) {
            state.blackPlugin = blackPlugin.black_plugin_list
            state.blackPluginLength = blackPlugin.count
        }
    },

    // 暴露方法
    actions: {

        //  获取
        async getBlackPlugin({ commit, state }, name) {
            const {data} = await getBlackPlugin(name)
            commit('getBlackPlugin', data)
        },

        // 创建
        async createBlackPlugin({ commit, state }, params) {
            const {data} = await createBlackPlugin(params)
            return data
        },

        // 更新
        async updateBlackPlugin({ commit, state }, params) {
            const {data} = await updateBlackPlugin(params)
            return data
        },

        // 禁用
        async disableBlackPlugin({ commit, state }, id) {
            const {data} = await disableBlackPlugin(id)
            return data
        },

        // 启用
        async enableBlackPlugin({ commit, state }, id) {
            const {data} = await enableBlackPlugin(id)
            return data
        }
    }
  }
