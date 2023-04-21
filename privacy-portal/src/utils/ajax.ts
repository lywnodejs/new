import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios'
import qs from 'qs'
import { message } from 'antd'
// import store from '../store'
import { getCookie } from 'utils'

interface IAjax {
  (config: AxiosRequestConfig): AxiosPromise
  get: (url: string, data?: any, options?: AxiosRequestConfig) => AxiosPromise
  post: (url: string, data?: any, options?: AxiosRequestConfig) => AxiosPromise
  put: (url: string, data?: any, options?: AxiosRequestConfig) => AxiosPromise
  delete: (url: string, data?: any, options?: AxiosRequestConfig) => AxiosPromise
  upload: (url: string, data?: any, options?: AxiosRequestConfig) => AxiosPromise
}

const serialize = JSON.stringify

const http = axios.create({
  // baseURL: '/rest',

  timeout: 0,

  // 只适用'POST'、'PUT'、'PATCH'，序列化参数
  transformRequest: [
    function (data: any) {
      return serialize(data)
    }
  ],

  // GET请求，序列化参数，只有在有参数的情况先才会执行
  paramsSerializer: function (params: any) {

    return qs.stringify(params, { arrayFormat: 'brackets' })
  }
})

http.interceptors.response.use(
  function (response: AxiosResponse) {
    const { data } = response

    // let pathNames = ['/', '/notice', '/present', '/rank', '/loophole']
    // let pathname = window.location.pathname
    // if (data.errno == 10001 && !pathNames.includes(pathname)) {
    // 未登录，只有需要登录校验的情况下起效
    // user.changeLogin(false)
    // app.toggleLogin()
    // }
    if (data.code !== 200 && data.errno !== 0) {
      message.error(data.errmsg)
      return Promise.reject(data)
    }
    return data
  },
  function (error: any) {
    return Promise.reject(error)
  }
)

const ajax = <IAjax>function (config: AxiosRequestConfig): AxiosPromise {
  return http(config)
}

// const getCookie = (name) => {
//   let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
//   if (arr = document.cookie.match(reg)) {
//     return unescape(arr[2])
//   } else {
//     return null
//   }
// }
ajax.get = function (url: string, data?: any, options?: AxiosRequestConfig) {
  let captId =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  // const { app } = store
  let params = data ? data : {}
  params.v = captId
  // params.userSessionId = app.loginSessionId
  return http({
    url,
    params: params,
    headers: {
      'Cache-Control': 'no-cache',
      'userSessionId': getCookie('userSessionId')
    },
    method: 'get',
    ...options
  })
}

ajax.post = function (url: string, data?: any, options?: AxiosRequestConfig) {
  // const { app } = store
  // let params = data ? data : {}
  // params.userSessionId = app.loginSessionId
  return http({
    url,
    data,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'userSessionId': getCookie('userSessionId')
    },
    method: 'post',
    ...options
  })
}

ajax.put = function (url: string, data?: any, options?: AxiosRequestConfig) {
  return http({
    url,
    data,
    transformRequest: [data => data],
    method: 'put',
    ...options
  })
}

ajax.delete = function (url: string, data?: any, options?: AxiosRequestConfig) {
  return http({
    url,
    data,
    method: 'delete',
    ...options
  })
}

ajax.upload = function (url: string, data?: any, options?: AxiosRequestConfig) {
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
