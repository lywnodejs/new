import axios from 'axios'
import {cookies} from '~/utils'
import config from './config'
import {Modal} from 'antd'
import qs from 'qs'

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // console.log(config)
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
let isAlert = false
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (
      typeof window !== 'undefined' &&
      response.data !== undefined &&
      `${response.config.data}`.match(
        'querymenulist|queryprivilegemanagelist|getloginname|querycurrentaccountinfo',
      ) === null
    ) {
      //没有权限
      if (response.data.code === -7 && !isAlert) {
        isAlert = true
        Modal.error({
          title: '提示',
          content: response.data.desc || '没有权限',
          onOk() {
            isAlert = false
          },
        })
        return response
      }

      if (
        (response.data.code === -6 ||
          response.data.code === -8 ||
          response.data.code === 1) &&
        !isAlert
      ) {
        isAlert = true
        Modal.error({
          title: '提示',
          content: response.data.desc || '登录失效，请重新登录',
          onOk() {
            isAlert = false
            location.href = '/login'
          },
        })
        return response
      }

      if (response.data.code != 0 && !isAlert) {
        isAlert = true
        Modal.error({
          title: '提示',
          content: response.data.desc,
          onOk() {
            isAlert = false
          },
        })
      }
    }

    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

const defaults = () => {
  if (typeof document !== 'undefined') {
    const {sessionId} = cookies(
      document.cookie.replace('sessionId=undefined', ''),
    )

    if (sessionId !== undefined && sessionId !== 'undefined') {
      axios.defaults.headers.common['sessionid'] = sessionId
    } else {
      delete axios.defaults.headers.common['sessionid']
    }
  }
}

export const request = () => {
  defaults()
  return axios
}
export const upload = (formData, url) => {
  defaults()
  return axios.post(
    `${config.apiPrefix}${url || '/gateway.action'}`,
    formData,
    {
      headers: {'Content-Type': 'multipart/form-data'},
    },
  )
}

export default (methodName, paramValues, url) => {
  defaults()
  return axios.post(`${config.apiPrefix}${url || '/gateway.action'}`, {
    methodName,
    paramValues,
  })
}

export const biFetch = (url, params) => {
  defaults()
  return axios.post(`${config.biApiPrefix}${url}`, params)
}

export const c_request = (url, method, params, type) => {
  defaults()
  const commitData = {}
  method == 'get' && (commitData.params = params)
  method == 'post' && (commitData.data = params)
  method == 'put' && (commitData.data = params)
  let requestUrl
  if (params && params.isExport) {
    requestUrl = `/${url}`
  } else {
    requestUrl = `${config.cloudApiPrefix}/${url}`
  }
  return axios.request({
    url: requestUrl,
    method,
    ...commitData,
    ...type,
  })
}

export const c_upload = (formData, url) => {
  defaults()
  return axios.post(`${config.cloudApiPrefix}/${url}`, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  })
}
