import { getThreatList, updateThreatList, disableThreatList, enableThreatList, createThreatList, getAttackSurface, enableAttackSurface, disableAttackSurface, updateAttackSurface, createAttackSurface } from '@/services/dolphin/threat'

import * as CONSTANTS from '@/commons/dolphin'
export default {

    // 命名空间 required
    namespace: 'dolphin_threat',

    // 原始状态，存储数据
    state: {
        threatList: [],
        threatListLength: 0,
        attackSurface: [],
        attackSurfaceLength: 0,
        attackSurfaceStatus: true
    },

    // 处理后状态，处理后的数据
    getters: {},

    // 定义状态如何变化
    mutations: {
        threatList(state, threatList) {
            state.threatList = threatList.threat_list
            state.threatListLength = threatList.count
        },
        attackSurface(state, attackSurface) {
            state.attackSurface = attackSurface.attack_surface_list
            state.attackSurfaceLength = attackSurface.count
        },
        attackSurfaceStatus(state, attackSurfaceStatus) {
            state.attackSurfaceStatus = attackSurfaceStatus
        }
    },

    // 暴露方法
    actions: {

        // 获取威胁列表
        async getThreatList({ commit, state }, params) {
            const {data} = await getThreatList(params)
            for (let i = 0; i < data.threat_list.length; i++) {
                let arr = data.threat_list[i].stride.split(',')
                data.threat_list[i].strideCN = ''
                for (let j = 0; j < arr.length; j++) {
                    for (let k = 0; k < CONSTANTS.stride.length; k++) {
                        if (arr[j] == CONSTANTS.stride[k].value) {
                            data.threat_list[i].strideCN += CONSTANTS.stride[k].label + '  '
                        }
                    }
                }
            }
            commit('threatList', data)
        },

        // 更新威胁列表
        async createThreatList({ commit, state }, params) {
            const {data} = await createThreatList(params)
            return data
        },

        // 更新威胁列表
        async updateThreatList({ commit, state }, params) {
            const {data} = await updateThreatList(params)
            return data
        },

        // 禁用威胁列表
        async disableThreatList({ commit, state }, id) {
            const {data} = await disableThreatList(id)
            return data
        },

        // 启用威胁列表
        async enableThreatList({ commit, state }, id) {
            const {data} = await enableThreatList(id)
            return data
        },

        // 获取攻击面列表
        async getAttackSurface({ commit, state }, name) {
            const {data} = await getAttackSurface(name)
            commit('attackSurface', data)
        },

        //  启用攻击面
        async enableAttackSurface({ commit, state }, id) {
            const {data} = await enableAttackSurface(id)
            return data
        },

        //  禁用攻击面
        async disableAttackSurface({ commit, state }, id) {
            const {data} = await disableAttackSurface(id)
            return data
        },

        //  编辑攻击面
        async updateAttackSurface({ commit, state }, params) {
            const {data} = await updateAttackSurface(params)
            return data
        },

        //  创建攻击面
        async createAttackSurface({ commit, state }, name) {
            const {data} = await createAttackSurface(name)
            return data
        }
    }
  }
