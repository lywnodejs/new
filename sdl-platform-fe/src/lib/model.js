export default function registerModel({
  namespace,
  ...rest
} = {}) {
  if (!this._store) {
    throw Error('Initialize the store before registering the model.')
  }
  if (!namespace) {
    throw Error('namespace is required! https://vuex.vuejs.org/en/modules.html')
  }

  const _model = {
    namespaced: true,
    ...rest
  }

  this._store.registerModule(namespace, _model)
}
