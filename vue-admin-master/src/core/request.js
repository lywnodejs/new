import axios from 'axios'
import { message } from 'ant-design-vue'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_URL, 
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})
let t = null
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    config.headers['Authorization'] = sessionStorage.getItem('token')
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000 && res.code !== 0 && res.code !== 200) {
      if (t !== null) {
        clearTimeout(t)
      }
      t = setTimeout(() => {
        message({
          message: res.message||'error',
          type: 'error',
          duration: 5 * 1000
        })
      }, 1000)
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      const { data } = response
      const { code } = data
      // 状态码为0||200表示api成功
      if (code === 0) {
        const { data: res } = data
        return res
      } else if (code === 200) {
        return data
      } else {
        // 返回数据
        return res
      }
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (t !== null) {
      clearTimeout(t)
    }
    t = setTimeout(() => {
      message({
        message: 'error',
        type: 'error',
        duration: 5 * 1000
      })
    }, 1000)
    return Promise.reject(error)
  }
)

export default service