import {
  getDomainCoverageRate,
  getOdinDeployCoverageRate,
  getVulDetectionRate,
  getMonthlyVulStatisticByDepartment,
  getMonthlyVulTypeProportion,
  globalVulFixRate,
  globalVulR2OnTimeFixRate,
  DepartmentCoverageRate,
  SdkCoverageRate
} from '@/services/ocean/global'

export default {

  namespace: 'ocean_global',

  state: {
    domainCoverageRate: {},
    odinDeployCoverageRate: {},
    vulDetectionRate: {},
    monthlyVulStatisticByDepartment: {},
    monthlyVulTypeProportion: {},
    sdkCoverChartRate: {}
  },
  getters: {},

  // 定义状态如何变化
  mutations: {
    domainCoverageRate(state, data) {
      state.domainCoverageRate = data
    },
    odinDeployCoverageRate(state, data) {
      state.odinDeployCoverageRate = data
    },
    vulDetectionRate(state, data) {
      state.vulDetectionRate = data
    },
    monthlyVulStatisticByDepartment(state, data) {
      state.monthlyVulStatisticByDepartment = data
    },
    monthlyVulTypeProportion(state, data) {
      state.monthlyVulTypeProportion = data
    },
    sdkCoverChartRate(state, data) {
      state.sdkCoverChartRate = data
    }
  },

  // 暴露方法
  actions: {
    async getDomainCoverageRate({commit, state}, queryParam) {
      const {data} = await getDomainCoverageRate(queryParam)
      commit('domainCoverageRate', data)
      return data
    },
    async getOdinDeployCoverageRate({commit, state}, queryParam) {
      const {data} = await getOdinDeployCoverageRate(queryParam)
      commit('odinDeployCoverageRate', data)
      return data
    },
    async getVulDetectionRate({commit, state}, queryParam) {
      const {data} = await getVulDetectionRate(queryParam)
      commit('vulDetectionRate', data)
      return data
    },
    async getMonthlyVulStatisticByDepartment({commit, state}, queryParam) {
      const {data} = await getMonthlyVulStatisticByDepartment(queryParam)
      commit('monthlyVulStatisticByDepartment', data)
      return data
    },
    async getMonthlyVulTypeProportion({commit, state}, queryParam) {
      const {data} = await getMonthlyVulTypeProportion(queryParam)
      commit('monthlyVulTypeProportion', data)
      return data
    },
    async getSdkCoverChartRate({commit, state}, queryParam) {
      const {data} = await SdkCoverageRate()
      commit('sdkCoverChartRate', data)
      return data
    },
    async globalVulFixRate({commit, state}, queryParam) {
      const {data} = await globalVulFixRate(queryParam)
      return data
    },
    async globalVulR2OnTimeFixRate({commit, state}, queryParam) {
      const {data} = await globalVulR2OnTimeFixRate(queryParam)
      return data
    },
    async DepartmentCoverageRate({commit, state}, queryParam) {
      const {data} = await DepartmentCoverageRate(queryParam)
      return data
    }
  }
}
