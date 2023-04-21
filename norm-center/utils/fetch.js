import axios from 'axios'
import {cookies} from '~/utils'
import config from './config'
import {Modal} from 'antd'
import qs from 'qs'

const CancelToken = axios.CancelToken
let source
// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // console.log('config', config.data, config.headers)
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
      response.config.data !== undefined &&
      (response.config.data + response.config.url).match(
        'getmenulist|querycurrentaccountinfo|loginout',
      ) === null
    ) {
      //没有权限
      if (response.data.code === -7 && !isAlert) {
        isAlert = true
        Modal.error({
          title: '提示',
          content: response.data.desc,
          onOk() {
            isAlert = false
          },
        })
        return response
      }

      if (
        (response.data.code === -6 || response.data.code === -8) &&
        !isAlert
      ) {
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

      if (response.data.code !== 0 && !isAlert) {
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
  axios.defaults.headers.common['platform'] = config.platform

  if (typeof document !== 'undefined') {
    const {sessionId} = cookies(
      document.cookie.replace('sessionId=undefined', ''),
    )

    delete axios.defaults.headers.common['sessionid']

    if (sessionId !== undefined && sessionId !== 'undefined') {
      axios.defaults.headers.common['sessionid'] = sessionId
    }
  }
}
export const get = (url, params) => {
  // console.log(params)
  defaults()
  return axios.get(`${config.httpApiPrefix}/${url}`, {params})
}

export const downloadExcel = (url, params) => {
  // console.log(params)

  defaults()
  return axios.get(`${config.httpApiPrefix}/${url}`, {
    params,
    responseType: 'arraybuffer',
  })
}

export const post = (
  url,
  params,
  headers = {'content-type': 'multipart/form-data'},
) => {
  defaults()
  return axios({
    url: `${config.httpApiPrefix}/${url}`,
    method: 'post',
    data: params,
    headers: headers,
  })
}

export const request = () => {
  defaults()
  return axios
}
export const cancelRequest = () => {
  source.cancel()
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
  source = CancelToken.source()
  return axios.post(
    `${config.apiPrefix}${url || '/gateway.action'}`,
    {
      methodName,
      paramValues,
    },
    {
      cancelToken: source.token,
      timeout: 20000,
    },
  )
}
