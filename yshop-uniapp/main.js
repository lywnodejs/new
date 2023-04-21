import Vue from 'vue'
import App from './App'

// import router from "./router";
import store from './store'
import schema from 'async-validator'
import cookie from '@/utils/store/cookie'

import { parseRoute, _router, parseQuery } from '@/utils'
import { VUE_APP_RESOURCES_URL, VUE_APP_API_URL } from '@/config'

// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js')
Vue.mixin(mpShare)

// 引入全局uView

import uView from 'uview-ui'
Vue.use(uView)

Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.prototype.$validator = function (rule) {
  return new schema(rule)
}

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store = store

const app = new Vue(App)

Vue.mixin({
  onLoad() {
    const { $mp } = this.$root
    this._route = parseRoute($mp)
    // this.$VUE_APP_RESOURCES_URL = VUE_APP_RESOURCES_URL;
    this._data.$VUE_APP_RESOURCES_URL = VUE_APP_RESOURCES_URL
  },
  onShow() {
    _router.app = this
    _router.currentRoute = this._route
  },
})

Object.defineProperty(Vue.prototype, '$yrouter', {
  get() {
    return _router
  },
})

Object.defineProperty(Vue.prototype, '$yroute', {
  get() {
    return this._route
  },
})

Vue.prototype.$VUE_APP_RESOURCES_URL = VUE_APP_RESOURCES_URL
Vue.prototype.$VUE_APP_API_URL = VUE_APP_API_URL

// #ifdef APP-PLUS
// App平台编译的代码
Vue.prototype.$deviceType = 'app'
store.commit('updateDevicetype', 'app')
Vue.prototype.$platform = uni.getSystemInfoSync().platform
// #endif

// #ifdef MP-WEIXIN
// 微信小程序编译的代码
Vue.prototype.$deviceType = 'routine'
store.commit('updateDevicetype', 'routine')
// #endif

// !!! ps  不建议在 template 中使用 $deviceType 去判断当前环境，很有可能出现 $deviceType 为 undefined 导致判断出错的问题，可以在 script 模块中正常使用
// 建议通过 store 去获取 $deviceType 可以保证 template 中取到的值有效
// import { mapState, mapMutations, mapActions } from 'vuex';
// computed: {
// 		...mapState(['$deviceType'])
// },

// #ifdef H5
// H5编译的代码

import {
  wechat,
  clearAuthStatus,
  oAuth,
  auth,
  toAuth,
  pay,
  openAddress,
  openShareAll,
  openShareAppMessage,
  openShareTimeline,
  wechatEvevt,
  ready,
  wxShowLocation,
} from '@/libs/wechat'

import { isWeixin } from '@/utils'
const CACHE_KEY = 'clear_0.0.1'

if (!cookie.has(CACHE_KEY)) {
  cookie.clearAll()
  cookie.set(CACHE_KEY, 1)
}

var urlSpread = parseQuery()['spread']
if (urlSpread) {
  cookie.set('spread', urlSpread)
}

// #endif

async function init() {
  // #ifdef H5
  // H5编译的代码
  // 判断是否是微信浏览器
  if (isWeixin()) {
    Vue.prototype.$deviceType = 'weixin'
    store.commit('updateDevicetype', 'weixin')
    // let wechatInit = await wechat()
    // if (wechatInit) {
    // await oAuth()
    app.$mount()
    // }
  } else {
    Vue.prototype.$deviceType = 'weixinh5'
    store.commit('updateDevicetype', 'weixinh5')
    app.$mount()
  }
  // #endif

  // #ifndef H5
  app.$mount()
  // #endif
}

init()
