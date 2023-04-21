import Vue from 'vue'
import initStore from './store'
import initRouter from './router'
import initI18n from './i18n'
import connect, { initConnect } from './connect'
import registerModel from './model'

function isPromise(val) {
  return val && typeof val.then === 'function'
}

Vue.config.productionTip = false

function BayMax(options) {
  this.options = options
  this.app = null
  this.beforeCallbak = null
  this.models = []
}

BayMax.prototype.init = function(el, App) {
  const _options = {
    el,
    template: '<app></app>',
    components: {
      App
    }
  }

  if (this._store) {
    _options.store = this._store
    this.models.forEach(model => {
      this.registerModel(model)
    })
  }

  if (this._router) {
    _options.router = this._router
  }
  if (this._i18n) {
    _options.i18n = this._i18n
  }
  this.app = new Vue({
    ..._options,
    ...this.options
  })
}

BayMax.prototype.registerModel = registerModel

BayMax.prototype.model = function(model) {
  this.models.push(model)
}

BayMax.prototype.store = function(store) {
  this._store = initStore(store)
  initConnect(this._store)
  return this
}

BayMax.prototype.i18n = function(i18n) {
  this._i18n = initI18n(i18n)
  return this
}

BayMax.prototype.plugin = function(plugin) {
  Vue.use(plugin)
  return this
}

BayMax.prototype.router = function(option, routes) {
  if (_.isArray(option)) {
    routes = option
    option = {}
  }
  this._router = initRouter.call(this, option, routes)

  return this
}

BayMax.prototype.root = function(rootComp) {
  this.rootComp = rootComp

  return this
}

BayMax.prototype.before = function(callback) {
  this.beforeCallbak = callback

  return this
}

BayMax.prototype.bootstrap = function(el = '#app', App) {
  if (typeof this.beforeCallbak === 'function') {
    let res = this.beforeCallbak()

    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    res.then((data) => {
      this.init(el, App)
    })
  } else {
    this.init(el, App)
  }
}

export default BayMax

export {
  connect
}
