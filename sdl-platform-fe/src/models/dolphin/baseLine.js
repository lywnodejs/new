import {
  getBaselineList,
  updateBaseline,
  createBaseline,
  deleteBaseline,
  prepareBaseline
} from '@/services/dolphin/baseLine'

export default {

  // 命名空间 required
  namespace: 'dolphin_baseline',

  // 原始状态，存储数据
  state: {
    baselineList: [],
    baselineListLength: 0,
    baselines: []
  },

  // 处理后状态，处理后的数据
  getters: {},

  // 定义状态如何变化
  mutations: {
    baselineList(state, baselineList) {
      state.baselineList = baselineList.baseline_list
      state.baselineListLength = baselineList.count
    },
    baselines(state, baselines) {
      state.baselines = baselines.baselines
    }
  },

  // 暴露方法
  actions: {

    // 获取基线列表
    async getBaselineList({commit, state}, params) {
      const {data} = await getBaselineList(params)
      commit('baselineList', data)
    },

    // 新建基线
    async createBaseline({commit, state}, params) {
      const {data} = await createBaseline(params)
      return data
    },

    // 更新基线
    async updateBaseline({commit, state}, params) {
      const {data} = await updateBaseline(params)
      return data
    },

    // 删除基线
    async deleteBaseline({commit, state}, id) {
      const {data} = await deleteBaseline(id)
      return data
    },

    // 准备基线
    async prepareBaseline({commit, state}) {
      const {data} = await prepareBaseline()
      commit('baselines', data)
    }
  }
}

