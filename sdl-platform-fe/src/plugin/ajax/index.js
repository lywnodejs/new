import Vue from 'vue'
import qs from 'qs'
import axios from 'axios'
import {error} from './enum'
import {
  APP_AJAX_BASEURL,
  APP_AJAX_TIMEOUT,
  APP_SERVER_ERROR,

  APP_FORMAT_ERROR,
  APP_FORMDATA_ERROR
} from 'commons/constant'
import {
  loginIntercepter,
  codeIntercepter,
  formatIntercepter
} from './interceptor'

const vm = new Vue()
const serialize = JSON.stringify
const interceptors = [
  loginIntercepter,
  codeIntercepter,
  formatIntercepter
]

const http = axios.create({

  baseURL: APP_AJAX_BASEURL,

  timeout: APP_AJAX_TIMEOUT,

  // 只适用'POST'、'PUT'、'PATCH'，序列化参数
  transformRequest: [function(data) {
    return serialize(data)
  }],

  // GET请求，序列化参数，只有在有参数的情况先才会执行
  paramsSerializer: function(params) {
    return qs.stringify(params, {arrayFormat: 'brackets'})
  }
})

/**
 *
 * @return {[type]}           [description]
 */
http.interceptors.response.use(function(response) {
  response._i = 0
  response.next = function() {
    if (response._i < interceptors.length) {
      return interceptors[response._i++](response, response.next)
    }
  }
  return response
})

/**
 * Register interceptors
 *
 * @return {[type]}                 [description]
 */
http.interceptors.response.use(function(response) {
  const {data} = response
  const result = response.next()
  if (result) {
    switch (result) {
      case error.FORMAT:

        vm.$message.error(APP_FORMAT_ERROR)
        break
      default:
        vm.$message.error(data.errmsg)
    }

    return Promise.reject(data)
  }

  return data
}, function(error) {
  vm.$message.error(APP_SERVER_ERROR)
  console.log(error)

  return Promise.reject(error)
});

/**
 *
 * @param  {...[type]} config [description]
 * @return {[type]}         [description]
 */
const ajax = function(config) {

  return http(config)
}

/**
 * ajax消息提示
 * @param  {[type]}  message           [description]
 * @param  {String}  options.type      [description]
 * @param  {Boolean} options.showClose [description]
 * @param  {[type]}  options.duration  [description]
 * @return {[type]}                    [description]
 */
ajax.message = function(message, {
  type = 'error',
  showClose = false,
  duration = 3000
} = {}) {

  vm.$message({
    message,
    type,
    showClose,
    duration
  })
}

/**
 * GET
 *
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
 */
ajax.get = function(...args) {
  const [url, data, options] = args

  return http({
      url,
      params: data,
      method: 'get',
      ...options
  })
}

/**
 * POST
 *
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
 */
ajax.post = function(...args) {
  const [url, data, options] = args

  return http({
      url,
      data,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      method: 'post',
      ...options
  })
}

/**
 * PUT
 *
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
 */
ajax.put = function(...args) {

  let [url, data, options] = args

  return http({
    url,
    data,
    transformRequest: [data => data],
    method: 'put',
    ...options
  })
}

/**
 * DELETE
 *
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
 */
ajax.delete = function(...args) {

  let [url, data, options] = args

  return http({
      url,
      data: data,
      method: 'delete',
      ...options
  })
}

/**
 * UPLOAD
 *
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
 */
ajax.upload = function(...args) {
  const [url, data, options] = args

  if (!(data instanceof FormData)) {
    throw TypeError(APP_FORMDATA_ERROR)
  }

  return http({
      url,
      data,
      transformRequest: [data => data],
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: 'post',
      ...options
  })
}

export default ajax
