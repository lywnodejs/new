import {
    getDeptList,
    getDepartmentDomainCoverageRate,
    getDepartmentOdinDeployCoverageRate,
    getDepartmentVulDetectionRate,
    getDepartmentMonthlyVulStatistic,
    getDepartmentMonthlyVulTypeProportion,
    getVulnerabilityList,
    getEvaluationProjectList,
    getOtterTaskList,
    domainCoverageDetail,
    departmentVulFixRate,
    departmentVulR2OnTimeFixRate
  } from '@/services/ocean/department'

  export default {

    namespace: 'ocean_department',

    state: {
        domainCoverageRate: {},
        odinDeployCoverageRate: {},
        vulDetectionRate: {},
        monthlyVulStatisticByDepartment: {},
        monthlyVulTypeProportion: {}
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
        }
    },

    // 暴露方法
    actions: {
      async getDeptList() {
        const {data} = await getDeptList()
        return data
      },
      async getDepartmentDomainCoverageRate({commit, state}, queryParam) {
        const {data} = await getDepartmentDomainCoverageRate(queryParam)
        commit('domainCoverageRate', data)
        return data
      },
      async getDepartmentOdinDeployCoverageRate({commit, state}, queryParam) {
        const {data} = await getDepartmentOdinDeployCoverageRate(queryParam)
        commit('odinDeployCoverageRate', data)
        return data
      },
      async getDepartmentVulDetectionRate({commit, state}, queryParam) {
        const {data} = await getDepartmentVulDetectionRate(queryParam)
        commit('vulDetectionRate', data)
        return data
      },
      async getDepartmentMonthlyVulStatistic({commit, state}, queryParam) {
        const {data} = await getDepartmentMonthlyVulStatistic(queryParam)
        commit('monthlyVulStatisticByDepartment', data)
        return data
      },
      async getDepartmentMonthlyVulTypeProportion({commit, state}, queryParam) {
        const {data} = await getDepartmentMonthlyVulTypeProportion(queryParam)
        commit('monthlyVulTypeProportion', data)
        return data
      },
      async getVulnerabilityList({commit, state}, queryParam) {
        const {data} = await getVulnerabilityList(queryParam)
        return data
      },
      async getEvaluationProjectList({commit, state}, queryParam) {
        const {data} = await getEvaluationProjectList(queryParam)
        return data
      },
      async getOtterTaskList({commit, state}, queryParam) {
        const {data} = await getOtterTaskList(queryParam)
        return data
      },
      async domainCoverageDetail({commit, state}, queryParam) {
        const {data} = await domainCoverageDetail(queryParam)
        return data
      },
      async departmentVulFixRate({commit, state}, queryParam) {
        const {data} = await departmentVulFixRate(queryParam)
        return data
      },
      async departmentVulR2OnTimeFixRate({commit, state}, queryParam) {
        const {data} = await departmentVulR2OnTimeFixRate(queryParam)
        return data
      }
    }
  }
