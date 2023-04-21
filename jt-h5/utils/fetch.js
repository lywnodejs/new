import axios from 'axios'
import {apiPrefix} from './config'
import {cookieParse} from '~/utils'

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
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (
      typeof window !== 'undefined' &&
      response.data !== undefined &&
      response.data.code === -8
    ) {
    }

    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

const defaults = (sId) => {
  if (sId !== undefined) {
    return (axios.defaults.headers.common['sessionId'] = sId)
  }

  if (typeof document !== 'undefined') {
    const {sessionId} = cookieParse(
      document.cookie.replace('sessionId=undefined', ''),
    )

    if (sessionId !== undefined && sessionId !== 'undefined') {
      axios.defaults.headers.common['sessionId'] = sessionId
    } else {
      delete axios.defaults.headers.common['sessionId']
    }
  }
}

export const fetch = (methodName, paramValues = [{}]) => {
  defaults(paramValues[0].sessionId)
  return axios.post(`${apiPrefix}/gateway.action`, {
    methodName,
    paramValues,
  })
}
