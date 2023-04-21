const IS_ALL = 0

export default function storagePlugin({

  namespace = 'app-vux-',
  storage = localStorage,
  persistence = []
} = {}) {

  let serialize = JSON.stringify,
    deserialize = JSON.parse,
    isAll = persistence.length === IS_ALL

  /**
   * 获取持久化的state
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  function getState(state) {

    let data = {},
      keys = isAll ? Object.keys(state) : persistence,
      i = 0,
      len = keys.length

    for (; i < len; i++) {

      let key = keys[i],
        value = deserialize(storage.getItem(namespace + key))

      data[key] = value === null ? state[key] : value
    }

    return data
  }

  /**
   * 持久化state
   * @param  {[type]} state [description]
   */
  function setState(state) {

    let keys = isAll ? Object.keys(state) : persistence,
      i = 0,
      len = keys.length

    for (; i < len; i++) {

      let key = keys[i]

      storage.setItem(namespace + key, serialize(state[key]))
    }
  }

  return store => {

    let state = store.state

    // 初始化state
    store.replaceState(

      _.merge(

        {},
        state,
        getState(state)
      )
    )

    // 持久化state
    store.subscribe((mutation, state) => {

      setState(state)
    })
  }
}
