import fetch from 'dva/fetch';
import _ from 'lodash';
import { fixUriPrefix } from './url';
import checkLogin from './checkLogin';
import { echoMessage } from './notice';

function parseJSON(response, isEchoMessage) {
  return response.json().then((
    {
      code,
      data,
      msg,
    }) => {
    checkLogin({ code, data });

    // 如果需要提示（例如post）
    if (isEchoMessage && !_.isEmpty(msg)) {
      echoMessage(msg);
    }
    if (code < 200 || code >= 300) {
      throw new Error(msg);
    }


    return data;
  });
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

// 拼接get的参数 + 根据开发环境，修改path
const fixUrl = (url, options = {}) => {
  const { params } = options;

  let fixedUrl = fixUriPrefix(url);

  // 如果是GET请求，则拼接 params 到 url
  if (!_.isEmpty(params)) {
    let query = _.map(params, (value, key) => {
      return `${key}=${value}`;
    }).join('&');

    fixedUrl += '?' + query;
  }
  return fixedUrl;
};

// 纯净的fetch封装，只检查http response code
const pureFetch = (url, options) => {
  return fetch(url, options)
    .then(checkStatus);
};

// 对url进行修正，并且加上cookie
const fixUrlFetch = (url, options = {}) => {
  const fixedUrl = fixUrl(url, options);

  if(!options.credentials) {
    options.credentials = 'include';
  }
  // 增加 X-Requested-With头，让后端识别为ajax请求
  // 然后可以走正常的sso判断逻辑（response里返回需要跳转，而不是直接302）
  options.headers = {
    ...options.headers,
    'X-Requested-With': 'XMLHttpRequest',
  };

  return pureFetch(fixedUrl, options);
};

// 通用的get方式
const request = (url, options = {}) => {
  return fixUrlFetch(url, options)
    .then(parseJSON);
};
export default request;

// 同request，函数名更语义化
export function get(url, params) {
  return request(url, { params });
}

// post json方式
// silent为true时，对于response里的msg不做提示
export function postJSON(url, data, options, config = {}) {
  let { silent } = config;
  let { params } = options;
  if (silent === undefined) {
    silent = true;
  }
  return fixUrlFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    params,
    body: JSON.stringify(data),
  }).then(response => parseJSON(response, !silent));
}
