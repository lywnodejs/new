import { inject, IStoresToProps, IReactComponent, IWrappedComponent } from 'mobx-react'

const BASE_STORE = ['router', 'app']

/**
 * 将全局store默认注入到组件中
 * @param store
 */
function dinject(
  ...store: string[]
): <T extends IReactComponent>(target: T) => T & IWrappedComponent<T>
function dinject<S, P, I, C>(
  store: IStoresToProps<S, P, I, C>
): <T extends IReactComponent>(target: T) => T & IWrappedComponent<T>
function dinject(): <T extends IReactComponent>(target: T) => T & IWrappedComponent<T> {
  if (typeof arguments[0] === 'function') {
    return inject(arguments[0])
  }
  return inject(...Array.prototype.slice.call(arguments).concat(BASE_STORE))
}

export default dinject
