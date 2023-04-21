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
      response.config.data.match(
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

const fetch = (methodName, paramValues, url) => {
  defaults()
  return axios.post(`${config.apiPrefix}${url || '/gateway.action'}`, {
    methodName,
    paramValues,
  })
}

export default fetch
