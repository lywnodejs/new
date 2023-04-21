import {cloneDeep, isString, flow, curry} from 'lodash'

/**
 * Convert an array to a tree-structured array.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @param   {string}    parentId       The alias of the parent ID of the object in the array.
 * @param   {string}    children  The alias of children of the object in the array.
 * @return  {array}    Return a tree-structured array.
 */
export function arrayToTree(
  array,
  id = 'id',
  parentId = 'pid',
  children = 'children',
) {
  const result = []
  const hash = {}
  const data = cloneDeep(array)

  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    const hashParent = hash[item[parentId]]
    if (hashParent) {
      !hashParent[children] && (hashParent[children] = [])
      hashParent[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

export function cookieParse(cookie = '') {
  return cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=')
    prev[name] = value
    return prev
  }, {})
}

export const browser = function (ua) {
  let e = typeof navigator !== 'undefined' ? navigator.userAgent : ua || ''
  let v =
    e.match(/OS ([\d_\.]+) like Mac OS X/) ||
    e.match(/Android[\s\/]([\d\.]+)/) ||
    '0_0'
  const av = e.match(/JieDianQian\/([\d\.]+)/)
  const dv = e.match(/DKDS\/([\d\.]+)/)
  const rv = e.match(/RN_DKDS\/([\d\.]+)/)
  const ps = e.match(/packageSign\/([A-Z0-9]+)/i)

  return {
    mobile: !!e.match(/AppleWebKit.*Mobile.*/) || !!e.match(/AppleWebKit/),
    ios: !!e.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    android: e.indexOf('Android') > -1 || e.indexOf('Linux') > -1,
    androidICS: !!e.match(/(Android)\s4/),
    wp: e.match(/Windows Phone/) || e.match(/IEMobile/),
    version: v[1].split('_').join('.'),
    isWeixin: !!e.match(/MicroMessenger/),
    isUC: !!e.match(/UCBrowser/),
    isChrome: !!e.match(/Chrome/) && !!e.match(/Google Inc/),
    isWeiBo: !!e.match(/WeiBo/i),
    isWP: !!(e.match(/Windows Phone/) || e.match(/IEMobile/)),
    isSafari:
      !!e.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) &&
      !!e.match(/Safari\/[\d\.]+$/) &&
      e.match(/CriOS/) === null,
  }
}
