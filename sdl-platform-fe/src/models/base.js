/**
 *
 * 将数据抽取成一个model，
 * 将数据获取与处理独立维护，组件专注视图更新，
 * 减少代码耦合
 */

import {
  deptSearchList,
  empSearchList

  // getDeptById,
  // getEmpById
} from '@/services/base'

export default {

  // 命名空间 required
  namespace: 'base',

  // 原始状态，存储数据
  state: {
    departments: [],
    employees: []
  },

  // 处理后状态，处理后的数据
  getters: {
  },

  // 定义状态如何变化
  mutations: {
    fillDepartment(state, data) {
      state.departments = data
    },
    fillEmployee(state, data) {
      state.employees = data
    }
  },

  // 暴露方法
  actions: {

    // 查询部门
    async deptSearchList({commit, state}, query) {
      const {data} = await deptSearchList(query)

      commit('fillDepartment', data)
      return data
    },

    // 查询员工
    async empSearchList({commit, state}, query) {
      const {data} = await empSearchList(query)

      commit('fillEmployee', data)
      return data
    }

    // // 查询部门
    // async getDeptById({
    //     commit,
    //     state
    //   }, id) {
    //   const {
    //     data
    //   } = await getDeptById(id)

    //   commit('fillDepartment', data)
    //   return data
    // },

    // // 查询员工
    // async getEmpById({
    //     commit,
    //     state
    //   }, id) {
    //   const {
    //     data
    //   } = await getEmpById(id)

    //   commit('fillEmployee', data)
    //   return data
    // },

    // updateDeptList({ commit, state }, options) {
    //   commit('fillDepartment', options)
    // },

    // updateEmpList({ commit, state }, options) {
    //   commit('fillEmployee', options)
    // }
  }
}
