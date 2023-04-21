import {cloneDeep, isString, flow, curry} from 'lodash'

export function cookies(cookie = '') {
  return cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=')
    prev[name] = value
    return prev
  }, {})
}
