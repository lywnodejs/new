/**
 *
 * dorado data presentation
 */

import {
  getUserStatistics,
  getProjectStatistics,
  getProjectRecentStatistics,
  getProjectLevelStatistics,
  getProjectStatusStatistics,
  getTopTenStatistics,
  getVulLanguagePercentageStatistics,
  getProjectPercentageStatistics,
  getDepartmentDistributionStatistics,
  getProjectClosedLoopRateStatistics
} from '@/services/dorado/presentation/presentation'

import {
  projectStatus,
  engineer,
  vulType,
  preHandleParam
} from '@/commons/dorado'

export default {

  namespace: 'dorado_data_presentation',

  state: {
    userStatisticsChartData: {},
    projectStatisticsChartData: {},
    projectRecentStatisticsDataList: [],
    projectLevelStatisticsChartData: {},
    projectLevelStatisticsChartSettings: {},
    projectStatusStatisticsChartData: {},
    projectStatusStatisticsChartSettings: {},
    topTenThreatStatisticsChartData: {},
    topTenVulTypeStatisticsChartData: {},
    vulLanguagePercentageStatisticsChartData: {},
    projectLevelPercentageStatisticsChartData: {},
    projectDataLevelPercentageStatisticsChartData: {},
    departmentProjectDistributionStatisticsChartData: {},
    departmentVulDistributionStatisticsChartData: {},
    projectClosedLoopRateStatisticsChartData: {}
  },
  getters: {},

  // 定义状态如何变化
  mutations: {
    userStatisticsChartData(state, data) {
      state.userStatisticsChartData = data.chartData
    },
    projectStatisticsChartData(state, data) {
      state.projectStatisticsChartData = data.chartData
    },
    projectRecentStatisticsDataList(state, data) {
      state.projectRecentStatisticsDataList = data.dataList
    },
    projectLevelStatisticsChartData(state, data) {
      state.projectLevelStatisticsChartData = data.chartData
      state.projectLevelStatisticsChartSettings = data.chartSettings
    },
    projectStatusStatisticsChartData(state, data) {
      state.projectStatusStatisticsChartData = data.chartData
      state.projectStatusStatisticsChartSettings = data.chartSettings
    },
    topTenStatisticsChartData(state, data) {
      state.topTenThreatStatisticsChartData = data.threatChartData
      state.topTenVulTypeStatisticsChartData = data.vulTypeChartData
    },
    vulLanguagePercentageStatisticsChartData(state, data) {
      state.vulLanguagePercentageStatisticsChartData = data.chartData
    },
    projectPercentageStatisticsChartData(state, data) {
      state.projectLevelPercentageStatisticsChartData = data.projectLevelPercentageChartData
      state.projectDataLevelPercentageStatisticsChartData = data.projectDataLevelPercentageChartData
    },
    departmentDistributionStatisticsChartData(state, data) {
      state.departmentProjectDistributionStatisticsChartData = data.departmentProjectDistributionChartData
      state.departmentVulDistributionStatisticsChartData = data.departmentVulDistributionChartData
    },
    projectClosedLoopRateStatisticsChartData(state, data) {
      state.projectClosedLoopRateStatisticsChartData = data.chartData
    }
  },

  // 暴露方法
  actions: {
    async getUserStatistics({commit, state}, queryParam) {
      const {data} = await getUserStatistics(queryParam)
      commit('userStatisticsChartData', data)
    },
    async getProjectStatistics({commit, state}, queryParam) {
      const {data} = await getProjectStatistics(queryParam)
      commit('projectStatisticsChartData', data)
    },
    async getProjectRecentStatistics({commit, state}, queryParam) {
      const {data} = await getProjectRecentStatistics(queryParam)
      for (let i = 0; i < data.dataList.length; i++) {
        data.dataList[i].project_status = preHandleParam(data.dataList[i].project_status, projectStatus, '未知状态')
        data.dataList[i].sdl_engineer = preHandleParam(data.dataList[i].sdl_engineer, engineer, '未指定')
      }
      commit('projectRecentStatisticsDataList', data)
    },
    async getProjectLevelStatistics({commit, state}, queryParam) {
      const {data} = await getProjectLevelStatistics(queryParam)
      commit('projectLevelStatisticsChartData', data)
    },
    async getProjectStatusStatistics({commit, state}, queryParam) {
      const {data} = await getProjectStatusStatistics(queryParam)
      commit('projectStatusStatisticsChartData', data)
    },
    async getTopTenStatistics({commit, state}, queryParam) {
      const {data} = await getTopTenStatistics(queryParam)
      for (let i = 0; i < data.vulTypeChartData.rows.length; i++) {
        data.vulTypeChartData.rows[i].vul_type = preHandleParam(data.vulTypeChartData.rows[i].vul_type, vulType, '其他')
      }
      commit('topTenStatisticsChartData', data)
    },
    async getVulLanguagePercentageStatistics({commit, state}, queryParam) {
      const {data} = await getVulLanguagePercentageStatistics(queryParam)
      commit('vulLanguagePercentageStatisticsChartData', data)
    },
    async getProjectPercentageStatistics({commit, state}, queryParam) {
      const {data} = await getProjectPercentageStatistics(queryParam)
      commit('projectPercentageStatisticsChartData', data)
    },
    async getDepartmentDistributionStatistics({commit, state}, queryParam) {
      const {data} = await getDepartmentDistributionStatistics(queryParam)
      commit('departmentDistributionStatisticsChartData', data)
    },
    async getProjectClosedLoopRateStatistics({commit, state}, queryParam) {
      const {data} = await getProjectClosedLoopRateStatistics(queryParam)
      commit('projectClosedLoopRateStatisticsChartData', data)
    }
  }
}
