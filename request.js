import axios from "axios";
// axios.defaults.withCredentials=true;

const service = axios.create({
  baseURL: process.env.VUE_APP_HOST || window.location.origin
})

// 正在进行中的请求列表
let reqList = []
/**
 * 阻止重复请求
 * @param {array} reqList - 请求缓存列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMessage - 请求中断时需要显示的错误信息
 */
const stopRepeatRequest = function (reqList, url, cancel, errorMessage) {
  const errorMsg = errorMessage || ''
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      cancel(errorMsg)
      return
    }
  }
  reqList.push(url)
}

/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const allowRequest = function (reqList, url) {
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      reqList.splice(i, 1)
      break
    }
  }
}

// 请求拦截器
service.interceptors.request.use(config => {
  let cancel
  // 设置cancelToken对象
  config.cancelToken = new axios.CancelToken(function (c) {
    cancel = c
  })
  let url = config.url + '/' + JSON.stringify(config.params);
  // 阻止重复请求。当上个请求未完成时，相同的请求不会进行
  stopRepeatRequest(reqList, url, cancel, `${url} 请求被中断`)
  return config
}, (err) => {
  Promise.reject(err)
})

// 响应拦截器
service.interceptors.response.use(response => {
  let url = response.config.url + '/' + JSON.stringify(response.config.params);
  // 增加延迟，相同请求不得在短时间内重复发送
  // setTimeout(() => {
  allowRequest(reqList, url);
  // }, 1000);
  // 请求成功后的后续操作
  return response.data;
}, error => {
  let url = error.config.url + '/' + JSON.stringify(error.config.params);
  if (axios.isCancel(error)) {
    console.log(error.message);
  } else {
    // 增加延迟，相同请求不得在短时间内重复发送
    // setTimeout(() => {
    allowRequest(reqList, url);
    // }, 1000)
  }
  // ...请求失败后的后续操作
  return Promise.reject(error);
})

export function request(method = 'get', url, data, conf = {}, wrapResource = false) {
  const config = {
    method: method,
    url: url,
    ...conf
  }
  if (['post', 'put', 'delete'].includes(method)) {
    config.data = wrapResource ? { resource: [data] } : data
  } else {
    config.params = data
  }
  return service(config).then(res => {
    return res.resource || res
  }).catch(function (err) {
    return Promise.reject(err)
  })
}

export default { request };


