import Vuex from 'vuex'
import Vue from 'vue'
import storage from './plugins/storage'
import {
  ZH
} from '../constants.es6'

Vue.use(Vuex)

export default new Vuex.Store({

    state : {
        currPath : '/',
        lang: ZH
    },

    mutations : {

        /**
         * 改变路径
         * @param state
         * @param path
         */
        routePath (state, path) {
            state.currPath = path
        },

        changeLang(state, lang) {
          state.lang = lang
        }

    },

    actions: {
      changeLang({commit}, lang) {
        commit('changeLang', lang)
      }
    },

    plugins: [storage({
      persistence: ['lang']
    })]
})

