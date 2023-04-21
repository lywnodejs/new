import axios from 'axios'
import {cookies} from '~/utils'
import config from './config'
import {Modal} from 'antd'
import qs from 'qs'
import _ from 'lodash'

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
    // console.log(response)
    if (typeof window !== 'undefined' && _.isObject(response.data)) {
      if ((response.data.code === -8 || response.data.code === 1) && !isAlert) {
        isAlert = true
        Modal.error({
          title: '提示',
          content: response.data.desc,
          onOk() {
            isAlert = false
            location.href = '/login'
          },
        })
        return response
      }

      if (response.data.code != 0 && !isAlert) {
        Modal.error({
          title: '提示',
          content: response.data.desc || response.data.msg,
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
      axios.defaults.headers.common['token'] = sessionId
    } else {
      delete axios.defaults.headers.common['token']
    }
  }
}

function resolveUri(url, params) {
  const p = url.indexOf('?') > -1 ? '&' : '?'
  url += p + qs.stringify(params)
  return url
}

export const get = (url, params) => {
  // console.log(params)
  defaults()
  return axios.get(`${config.apiPrefix}/${resolveUri(url, params)}`)
}

export const post = (url, params, isGet = false) => {
  defaults()
  const uri = isGet ? resolveUri(url, params) : url
  return axios.post(`${config.apiPrefix}/${uri}`, params)
}

export const postForm = (url, data, apiPrefix = config.apiPrefix) => {
  defaults()
  let formData = new FormData()
  const keys = Object.keys(data)
  keys.forEach((key) => {
    formData.append(key, data[key])
  })

  return axios.post(`${apiPrefix}/${url}`, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  })
}

export const upload = (formData, url) => {
  defaults()
  return axios.post(`${config.apiPrefix}/${url}`, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  })
}

export const request = (url, method, params, type) => {
  defaults()
  const commitData = {}
  method == 'get' && (commitData.params = params)
  method == 'post' && (commitData.data = params)
  method == 'put' && (commitData.data = params)
  let requestUrl
  if (params.isExport) {
    requestUrl = `/${url}`
  } else {
    requestUrl = `${config.apiPrefix}/${url}`
  }
  return axios.request({
    url: requestUrl,
    method,
    ...commitData,
    ...type,
  })
}

export const gwRequest = (methodName, {...params}, notDeleteEmpty) => {
  defaults()
  let paramsObj = params[0]
  if (!notDeleteEmpty) {
    if (Object.prototype.toString.call(paramsObj) === '[object Object]') {
      let keys = Object.keys(paramsObj)
      keys.forEach((key) => {
        let val = paramsObj[key]
        if (_.isNull(val) || _.isUndefined(val) || val === '') {
          delete paramsObj[key]
        }
      })
    }
  }

  params = [paramsObj]

  const data = {
    methodName,
    paramValues: params || [],
  }
  return axios.post(`${config.gwApiPrefix}/gateway.action`, data)
}

// 贷后管理相关
export const loanFetch = (url, params, isGet) => {
  defaults()
  if (isGet) {
    return axios.get(`${config.apiPrefix}${url}`, {params})
  } else {
    return axios.post(`${config.apiPrefix}${url}`, params)
  }
}

export const biFetch = (url, params) => {
  defaults()
  return axios.post(`${config.biApiPrefix}${url}`, params)
}

export default axios
