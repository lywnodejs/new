import 'babel-polyfill';
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


let store = new Vuex.Store({
    state:{
        uploadUrl:'--'
    },
    mutations:{
        SET_UPLOADURL:(state,url)=>{
            return state.uploadUrl=url;
        }
    },
    actions:{
        setUploadUrl:(context,url)=>{
            return context.commit('SET_UPLOADURL', url);
        }
    },
    getters:{
        getURL:(state)=>{
            return state.uploadUrl;
        }
    }
})

export  default store;
