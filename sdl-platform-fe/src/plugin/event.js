import Vue from 'vue'
import { APP_EVENT_PREFIX } from 'commons/constant'

const serialize = JSON.stringify
const deserialize = JSON.parse

const eventHub = new Vue()
const eventList = {}

window.addEventListener('storage', e => {
  if (e.key && e.key === APP_EVENT_PREFIX) {
    let data = deserialize(e.newValue),
      key = data.key,
      listeners = eventList[key]

    if (!listeners || listeners.length === 0) {

      return false
    }
    let i = 0,
      len = listeners.length

    for (; i < len; i++) {

      listeners[i].apply(undefined, data.args)
    }
  }
})

/**
 * 跨组件发布消息
 * @param  {[type]}    key  名称
 * @param  {...[type]} args 数据
 * @return {[type]}         [description]
 */
function publish(key, ...args) {
  eventHub.$emit(key, ...args)

  return this
}

/**
 * 跨组件订阅消息
 * @param  {[type]}   key      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function subscribe(key, callback) {
  eventHub.$on(key, callback.bind(this))

  return this
}

/**
 * 事件移除
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
 */
function cancel(...args) {
  eventHub.$off(...args)
}

/**
 * 兼容1.x
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
function dispatch(key) {
  let shouldPropagate = this.$emit.apply(this, arguments)

  if (shouldPropagate) {
    let parentComp = this.$parent

    while (parentComp) {
      shouldPropagate = parentComp.$emit.apply(parentComp, arguments)
      parentComp = shouldPropagate
        ? parentComp.$parent
        : null
    }
  }

  return this
}

/**
 * 兼容1.x
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
function broadcast(key) {
  let children = this.$children,
    len = children.length

  for (let i = 0; i < len; i++) {
    let child = children[i]
    let shouldPropagate = child.$emit.apply(child, arguments)

    if (shouldPropagate) {
      child.$broadcast.apply(child, arguments)
    }
  }

  return this
}

/**
 * 跨窗口触发事件
 * @param  {[type]}    key  [description]
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
 */
function trigger(key, ...args) {
  let data = {
    key,
    args: args,
    time: +new Date()
  }

  localStorage.setItem(APP_EVENT_PREFIX, serialize(data))

  return this
}

/**
 * 跨窗口监听事件
 * @param  {[type]}   key      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function listen(key, callback) {
  if (!eventList[key]) {
    eventList[key] = []
  }
  eventList[key].push(callback)

  return this
}

export {

  publish,

  subscribe,

  cancel,

  dispatch,

  broadcast,

  trigger,

  listen
}
