import {mapActions} from 'vuex'

let _store

function normalizeMap(map) {
  return Array.isArray(map)
    ? map.map(function(key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function(key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace(namespace) {
  return namespace.charAt(namespace.length - 1) !== '/'
    ? (namespace += '/')
    : namespace
}

/**
 * 更加namespace获取module
 * @param {*} namespace
 */
function getModuleByNamespace(namespace) {
  const module = _store._modulesNamespaceMap[normalizeNamespace(namespace)];

  return module
}

/**
 * 获取所有modules
 */
function getModules() {
  const result = {}
  const modules = _store._modulesNamespaceMap

  Object.keys(modules).forEach(module => {
    result[module.slice(0, module.length - 1)] = modules[module]['context']
  })

  return result
}

/**
 * 获取module的state|getter
 * @param {*} module
 */
function getValue(module, value) {
  const { state, getters } = module.context

  if (typeof state[value] !== 'undefined') return state[value]
  return getters[value]
}

/**
 * 映射state到组件辅助函数
 * connect函数只能在store初始化之后使用（依赖store的方法）
 * 因此connect函数配合vue-router在异步加载页面最合适
 *
 * 1.支持字符串 (deprecated)
 *  connect('module')
 * 2.支持函数
 *  2.1属性值为字符串
 *   connect(function(){
 *      return {
 *        param: 'module/state'
 *      }
 *    })
 *  2.2属性值为函数
 *    connect(function(){
 *      return {
 *        param: ({module}) => module.state
 *      }
 *    })
 *  2.3属性值为对象
 *    connect(function() {
 *      return {
 *        param: {
 *          get({module}) {
 *             return module.state
 *          },
 *          set(dispatch, value) {
 *            dispatch(action, value)
 *          }
 *        }
 *      }
 *    })
 *
 * @param {*} state
 */
function _mapState(state) {
  let result = {}

  normalizeMap(state).forEach(function(ref) {
    const key = ref.key;
    const val = ref.val;

    if (typeof val !== 'string' && typeof val !== 'function' && typeof val !== 'object') {
      return console.error(`map value of ${key} should be object, function or string`)
    }

    if (typeof val === 'object') {

      // val is object
      const { get, set } = val

      result[key] = {
        get() {
          const modules = getModules()

          return get.call(_store, modules)
        },
        set(value) {
          set.call(_store, _store.dispatch, value)
        }
      }
    } else {

      // val is string or function
      result[key] = function() {
        if (typeof val === 'string') {
          if (val.indexOf('/') > -1) {
            const paths = val.split('/')
            const namespace = paths[0]
            const prop = paths[1]
            const module = getModuleByNamespace(namespace)

            return getValue(module, prop)
          }
          return _store.state[val] || _store.getters[val]
        }
        const modules = getModules()

        return val.call(_store, modules)
      }
    }
  })
  return result
}

export default function connect(mapState, actions = []) {
  const computedState = typeof mapState === 'function' ? mapState() : Array.isArray(mapState) ? mapState : {}
  return function(component) {
    const {
      computed,
      methods
    } = component

    component.computed = {
      ..._mapState(computedState),
      ...computed
    }

    component.methods = {
      ...mapActions(actions),
      ...methods
    }
    return component
  }
}

export function initConnect(store) {
  _store = store
}
