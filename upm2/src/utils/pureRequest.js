import fetch from 'dva/fetch';
import _ from 'lodash';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function pureRequest(url, options = {}) {
  const { params, method } = options;

  if (params && (!method || method.toLowerCase() === 'get')) {
    let query = _.map(params, (value, key) => {
      return `${key}=${value}`;
    }).join('&');

    url += '?' + query;
  }
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}


// 纯净的fetch封装，只检查http response code
const pureFetch = (url, options) => {
  return fetch(url, options)
    .then(checkStatus);
};


// 对url进行修正，并且加上cookie
const fixUrlFetch = (url, options = {}) => {

  if(!options.credentials) {
    options.credentials = 'include';
  }
  // 增加 X-Requested-With头，让后端识别为ajax请求
  // 然后可以走正常的sso判断逻辑（response里返回需要跳转，而不是直接302）
  options.headers = {
    ...options.headers,
    'X-Requested-With': 'XMLHttpRequest',
  };

  return pureFetch(url, options);
};


// post json方式
// silent为true时，对于response里的msg不做提示
export function purePostJSON(url, params, config = {}) {
  let { silent } = config;
  if (silent === undefined) {
    silent = true;
  }
  return fixUrlFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params),
  }).then(response => parseJSON(response, !silent));
}
