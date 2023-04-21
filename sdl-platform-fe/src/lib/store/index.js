import Vue from 'vue'
import Vuex from 'vuex'

export default function initStore(store) {
  Vue.use(Vuex)
  return new Vuex.Store({
    ...store,
    strict: process.env.NODE_ENV !== 'production'
  })
}
