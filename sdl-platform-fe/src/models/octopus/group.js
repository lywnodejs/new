import {
    getGroupProjectList,
    createGroupProject,
    updateGroupProject,
    getDetailGroupProjectByID,
    getTemplateByProjectId,
    newSession,
    updateGroupFilter,
    getStatusGroupFilter,
    getResultGroupFilter,
    reloadTemplateGroup,
    saveTemplateGroup,
    updateTemplateLocator,
    getfollowerGroupProject,
    addfollowerGroupProject,
    getGroupTask,
    updateGroupTask,
    getAllProjectGroup,
    createDefaultProject,
    updateDefaultProject,
    listVulnerability,
    processVul
  } from '@/services/octopus/group'

  export default {

    // 命名空间 required
    namespace: 'octopus_group',

    // 原始状态，存储数据
    state: {
        sessionID: null
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
        sessionID(state, data) {
            state.sessionID = data.data
        }
    },

    // 暴露方法
    actions: {

      async getGroupProjectList({commit, state}, params) {
        const {data} = await getGroupProjectList(params)
        return data
      },

      async createGroupProject({commit, state}, params) {
        const data = await createGroupProject(params)
        return data
      },

      async updateGroupProject({commit, state}, params) {
        const data = await updateGroupProject(params)
        return data
      },

      async getDetailGroupProjectByID({commit, state}, params) {
        const data = await getDetailGroupProjectByID(params)
        return data
      },

      async getTemplateByProjectId({commit, state}, params) {
        const data = await getTemplateByProjectId(params)
        return data
      },

      async newSession({commit, state}, params) {
        const data = await newSession(params)
        commit('sessionID', data)
        return data
      },

      async updateGroupFilter({commit, state}, params) {
        const data = await updateGroupFilter(params)
        return data
      },

      async getStatusGroupFilter({commit, state}, params) {
        const data = await getStatusGroupFilter(params)
        return data
      },

      async getResultGroupFilter({commit, state}, params) {
        const data = await getResultGroupFilter(params)
        return data
      },

      async reloadTemplateGroup({commit, state}, params) {
        const data = await reloadTemplateGroup(params)
        return data
      },

      async saveTemplateGroup({commit, state}, params) {
        const data = await saveTemplateGroup(params)
        return data
      },

      async updateTemplateLocator({commit, state}, params) {
        const data = await updateTemplateLocator(params)
        return data
      },

      async getfollowerGroupProject({commit, state}, params) {
        const data = await getfollowerGroupProject(params)
        return data
      },

      async addfollowerGroupProject({commit, state}, params) {
        const data = await addfollowerGroupProject(params)
        return data
      },

      async getGroupTask({commit, state}, params) {
        const data = await getGroupTask(params)
        return data
      },

      async updateGroupTask({commit, state}, params) {
        const data = await updateGroupTask(params)
        return data
      },

      async getAllProjectGroup({commit, state}, params) {
        const data = await getAllProjectGroup(params)
        return data
      },

      async createDefaultProject({commit, state}, params) {
        const data = await createDefaultProject(params)
        return data
      },

      async updateDefaultProject({commit, state}, params) {
        const data = await updateDefaultProject(params)
        return data
      },

      async listVulnerability({commit, state}, params) {
        const data = await listVulnerability(params)
        return data
      },

      async processVul({commit, state}, params) {
        const data = await processVul(params)
        return data
      }
    }
  }
