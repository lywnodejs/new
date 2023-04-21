import {
  getAssetSDKList,
  createAssetSDK,
  updateAssetSDK,
  deleteAssetSDK,
  getAssetPermissionList,
  createAssetPermission,
  deleteAssetPermission,
  updateAssetPermission,
  updateTaskSDK,
  getTaskSDK,
  createTaskSDK,
  delTaskSDK,
  updateTaskPermission,
  uploadExcelPermission,
  getTaskPermission,
  createTaskPermission,
  delTaskPermission,
  getTaskDynamic
} from '@/services/ratel/assets'

export default {

  // 命名空间 required
  namespace: 'ratel_assets',

  // 原始状态，存储数据
  state: {
    assetsList: [],
    assetsListLength: 0
  },

  // 处理后状态，处理后的数据
  getters: {},

  // 定义状态如何变化
  mutations: {
    assetsList(state, data) {
      state.assetsList = data.data_list
      state.assetsListLength = data.count
    }
  },

  // 暴露方法
  actions: {

    // 获取资产列表
    async getAssetSDKList({commit, state}, params) {
      const {data} = await getAssetSDKList(params)
      return data
    },

    // 添加资产
    async createAssetSDK({commit, state}, params) {
      const {data} = await createAssetSDK(params)
      return data
    },

    // 更新资产
    async updateAssetSDK({commit, state}, params) {
      const {data} = await updateAssetSDK(params)
      return data
    },

    async deleteAssetSDK({commit, state}, params) {
      const {data} = await deleteAssetSDK(params)
      return data
    },

    async getAssetPermissionList({commit, state}, params) {
      const {data} = await getAssetPermissionList(params)
      return data
    },

    async createAssetPermission({commit, state}, params) {
      const {data} = await createAssetPermission(params)
      return data
    },

    async updateAssetPermission({commit, state}, params) {
      const {data} = await updateAssetPermission(params)
      return data
    },

    async deleteAssetPermission({commit, state}, params) {
      const {data} = await deleteAssetPermission(params)
      return data
    },

    async getTaskSDK({commit, state}, params) {
      const {data} = await getTaskSDK(params)
      return data
    },

    async updateTaskSDK({commit, state}, params) {
      const {data} = await updateTaskSDK(params)
      return data
    },

    async createTaskSDK({commit, state}, params) {
      const {data} = await createTaskSDK(params)
      return data
    },

    async delTaskSDK({commit, state}, params) {
      const {data} = await delTaskSDK(params)
      return data
    },

    async updateTaskPermission({commit, state}, params) {
      const {data} = await updateTaskPermission(params)
      return data
    },

    async uploadExcelPermission({commit, state}, params) {
      const {data} = await uploadExcelPermission(params)
      return data
    },

    async getTaskPermission({commit, state}, params) {
      const {data} = await getTaskPermission(params)
      return data
    },

    async createTaskPermission({commit, state}, params) {
      const {data} = await createTaskPermission(params)
      return data
    },

    async delTaskPermission({commit, state}, params) {
      const {data} = await delTaskPermission(params)
      return data
    },

    async getTaskDynamic({commit, state}, params) {
      const {data} = await getTaskDynamic(params)
      return data
    }
  }
}
