import Fuse from 'fuse.js'
import CryptoJS from 'crypto-js'
import resizeEvent from './detect-element-resize'
import {APP_ROUTE_SEC} from 'commons/constant'

const serialize = JSON.stringify,
  deserialize = JSON.parse,
  addResize = resizeEvent.addResizeListener,
  removeResise = resizeEvent.removeResizeListener

/**
 *
 * @return {[type]} [description]
 */
function browserIs() {

  /* eslint operator-linebreak: "off" */
  let browser = {}

  let nav = navigator.userAgent.toLowerCase()

  let result

  /* eslint space-infix-ops: "off" */
  (result = nav.match(/rv:([\d.]+)\) like gecko/)) ? browser.ie = result[1] :
    (result = nav.match(/msie ([\d.]+)/)) ? browser.ie = result[1] :
      (result = nav.match(/firefox\/([\d.]+)/)) ? browser.firefox = result[1] :
        (result = nav.match(/chrome\/([\d.]+)/)) ? browser.chrome = result[1] :
          (result = nav.match(/opera.([\d.]+)/)) ? browser.opera = result[1] :
            (result = nav.match(/version\/([\d.]+).*safari/)) ? browser.safari = result[1] : 0

  return browser
}

/**
 * 加密信息
 * @param  {[type]} content [description]
 * @return {[type]}         [description]
 */
function encrypt(content) {

  if (typeof content === 'object') {

    return CryptoJS.AES.encrypt(serialize(content), APP_ROUTE_SEC).toString()
  }

  return CryptoJS.AES.encrypt(content.toString(), APP_ROUTE_SEC).toString()
}

/**
 * 解密信息
 * @param  {[type]} content [description]
 * @return {[type]}         [description]
 */
function decrypt(content) {

  try {

    return deserialize(CryptoJS.AES.decrypt(content, APP_ROUTE_SEC).toString(CryptoJS.enc.Utf8))
  } catch (e) {

    return CryptoJS.AES.decrypt(content, APP_ROUTE_SEC).toString(CryptoJS.enc.Utf8)
  }

}

/**
 * 类数组对象转为数组
 * @param  {[type]} list  [description]
 * @param  {[type]} start [description]
 * @return {[type]}       [description]
 */
function toArray(list, start) {

  start = start || 0
  let i = list.length - start,
    ret = new Array(i)

  while (i--) {
    ret[i] = list[i + start]
  }

  return ret
}

/**
 * 转数字类型
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function toNumber(value) {

  if (typeof value !== 'string') {

    return value
  }

  let parsed = Number(value)

  return isNaN(parsed)
    ? value
    : parsed
}

/**
 * 判断是对象、数组、字符串否存在指定值
 * @param  {[type]} val    [description]
 * @param  {[type]} search [description]
 * @return {[type]}        [description]
 */
function contains(val, search) {

  let i

  if (_.isPlainObject(val)) {

    let keys = Object.keys(val)

    i = keys.length

    while (i--) {

      if (contains(val[keys[i]], search)) {

        return true
      }
    }
  } else if (_.isArray(val)) {

    i = val.length

    while (i--) {

      if (contains(val[i], search)) {

        return true
      }
    }
  } else if (val !== null) {

    return val.toString().toLowerCase().indexOf(search) > -1
  }
}

/**
 * 拆分路径
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function splitPath(path) {

  return path.replace(/^\/|\/$/g, '').split('/')
}

/**
 * 路径判断
 * @param  {[type]} source [description]
 * @param  {[type]} target [description]
 * @return {[type]}        [description]
 */
function equalPath(source, target) {

  if (source && target) {

    return source.replace(/^\/|\/$/g, '') === target.replace(/^\/|\/$/g, '')
  }

  return false
}

/**
 * 路径截取
 * @param  {[type]} path [description]
 * @param  {[type]} end  [description]
 * @return {[type]}      [description]
 */
function slicePath(path, end) {
  const paths = _.isArray(path) ? path : splitPath(path)

  return '/' + paths
    .slice(0, end)
    .join('/') // 匹配全路径
}

/**
 * 查找满足条件最近的父组件
 * @param  {[type]} $parent  [description]
 * @param  {[type]} cssClass [description]
 * @return {[type]}          [description]
 */
function getClosestVueParent($parent, cssClass) {

  if (!$parent || !$parent.$el) {

    return false
  }

  if ($parent._uid === 0) {

    return false
  }

  if ($parent.$el.classList.contains(cssClass)) {

    return $parent
  }

  return getClosestVueParent($parent.$parent, cssClass)
}

/**
 * fuse模糊匹配
 * @param  {[type]} array [description]
 * @param  {[type]} field [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
function fuzzy(array, field = [
  'title'
], query) {

  if (typeof field === 'string') {

    field = [field]
  }

  let options = {

    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: field
  }

  let fuse = new Fuse(array, options)

  return fuse.search(query)
}

/**
 * 获取源的所有祖先数据
 * @param  {[type]} array    集合
 * @param  {[type]} source   源
 * @param  {String} identity 标示
 * @return {[type]}          [description]
 */
function getParents(array, source, {

  id = 'id',
  parentId = 'pid'
} = {}) {

  let pid = source[parentId]

  if (pid === undefined) {

    return []
  }

  /* eslint no-shadow: 'off' */
  let parents = [],
    parent = _.find(array, _.matchesProperty(id, pid))

  if (parent) {

    parents.push(parent)
    parents.push(...getParents(array, parent, {

      id,
      parentId
    }))
  }

  return parents
}

/**
 * [addMouseWheel description]
 * @param {[type]}   element  [description]
 * @param {Function} callback [description]
 */
function addMouseWheel(element, callback) {

  if (element && element.addEventListener) {

    element.addEventListener(browserIs().firefox ? 'DOMMouseScroll' : 'mousewheel', callback)
  }
}

/**
 * [removeMouseWheel description]
 * @param  {[type]}   element  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function removeMouseWheel(element, callback) {

  if (element && element.removeEventListener) {

    element.removeEventListener(browserIs().firefox ? 'DOMMouseScroll' : 'mousewheel', callback)
  }
}

/**
 * 添加事件
 * @param {[type]} element [description]
 * @param {[type]} event   [description]
 * @param {[type]} handler [description]
 */
function addEvent(element, event, handler) {

  if (document.addEventListener) {
    element.addEventListener(event, handler, false)
  } else {
    element.attachEvent('on' + event, handler)
  }
}

/**
 * 删除事件
 * @param  {[type]} element [description]
 * @param  {[type]} event   [description]
 * @param  {[type]} handler [description]
 * @return {[type]}         [description]
 */
function removeEvent(element, event, handler) {

  if (document.removeEventListener) {
    element.removeEventListener(event, handler, false)
  } else {
    element.detachEvent('on' + event, handler)
  }
}

/**
 * 判断是否为绝对地址
 * @param  {[type]}  url [description]
 * @return {Boolean}     [description]
 */
function isAbsoluteURL(url) {

  /* eslint-disable no-useless-escape */
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

/**
 * 合并地址
 * @param  {[type]} baseURL     [description]
 * @param  {[type]} relativeURL [description]
 * @return {[type]}             [description]
 */
function combineURLs(baseURL, relativeURL) {
  return new RegExp(`^${baseURL}\/`, 'i').test(relativeURL)
    ? relativeURL
    : baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
}

/**
 * 字符串转对象
 * @param {string} jsonStr
 */
function evil(jsonStr) {
  let jsonObj = null
  try {
    /* eslint-disable no-new-func */
    jsonObj = new Function('return ' + jsonStr)()
  } catch (err) {
    jsonObj = jsonStr
    console.error(err)
  }
  return jsonObj
}

export * from './rules'
export {
  browserIs,
  contains,
  toNumber,
  toArray,
  splitPath,
  equalPath,
  slicePath,
  getClosestVueParent,
  fuzzy,
  getParents,
  addMouseWheel,
  removeMouseWheel,
  addResize,
  removeResise,
  encrypt,
  decrypt,
  addEvent,
  removeEvent,
  isAbsoluteURL,
  combineURLs,
  evil
}
