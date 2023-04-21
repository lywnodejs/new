import Vue from 'vue'
import Vuex from 'vuex'

//使用vuex
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        commonSelectData:{
            person: 0,
            stock: 0,
            industrie: 0
        },
        isrightsearch:false,
        keepAliveList:[]
    },
    actions: {
        COMMON_SELECT_PERSON: ({ commit, dispatch, state },flag) => {
            commit('SET_COMMON_SELECT_PERSON',flag);
        },
        COMMON_SELECT_STOCK: ({ commit, dispatch, state },flag) => {
            commit('SET_COMMON_SELECT_STOCK',flag);
        },
        COMMON_SELECT_INDUSTRIE: ({ commit, dispatch, state },flag) => {
            commit('SET_COMMON_SELECT_INDUSTRIE',flag);
        },
        KEEPALIVE_LIST: ({ commit, dispatch, state },str) => {
            commit('SET_KEEPALIVE_LIST',str);
        },
        ISRIGHTSEARCH:({ commit, dispatch, state },bool)=>{
          commit('SETISRIGHTSEARCH',bool);
        }
    },
    mutations: {
        SET_COMMON_SELECT_PERSON: (state, flag) => {
            if(flag){
                state.commonSelectData.person ++
            }else {
                state.commonSelectData.person --
            }

        },
        SET_COMMON_SELECT_STOCK: (state, flag) => {
            if(flag){
                state.commonSelectData.stock ++
            }else {
                state.commonSelectData.stock --
            }
        },
        SET_COMMON_SELECT_INDUSTRIE: (state, flag) => {
            if(flag){
                state.commonSelectData.industrie ++
            }else {
                state.commonSelectData.industrie --
            }
        },
        SET_KEEPALIVE_LIST: (state, str)=> {
            state.keepAliveList = [];
            state.keepAliveList.push(str);
        },
        SETISRIGHTSEARCH:(state,bool)=>{
            state.isrightsearch=bool;
        }
    },

    getters: {
        commonSelect(state) {
            return state.commonSelectData;
        },
        keepAliveListFun(state) {
            return state.keepAliveList;
        },
        getrightsearch(state){
            return state.isrightsearch;
        }
    }
})

export default store
