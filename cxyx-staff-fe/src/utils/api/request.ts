import { extend } from 'umi-request';
import { sendOmegaApiLog } from '@/utils/omega';
import { baseHost } from '@/utils/api/path';

export const request = extend({
  credentials: 'include',
});

request.interceptors.request.use((url, options) => {
  options.headers['X-Requested-With'] = 'XMLHttpRequest';
  options['timestamp'] = new Date().valueOf(); // 开始请求时间戳
  options['url'] = url;
  // console.log('request', url, options);
  return {
    url: `${url}`,
    options,
  };
});

const codeMaps = {
  401: '未登录，即将跳转',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

request.interceptors.response.use(async (response, config) => {
  const data = await response.clone().json();
  sendHashURLOmegaLog(config);
  // console.log('response-data', data, config)
  if (data && 302 == data.errno && window.location.hash.indexOf('h5') === -1) {
    if (typeof data.location === 'string') {
      const params = getUrlQueryParams(data.location);
      const host = getUrlWithoutParams(data.location);
      const href = formatGetUrl(host, {
        ...params,
        jumpto: encodeURIComponent(location.href),
      });
      location.href = href;
    }
  }
  return response;
});

/**
 * 发送埋点请求
 * @param config
 */
const sendHashURLOmegaLog = (config, err = '') => {
  // console.log('url-config: ', config, location);

  // host会带前缀 去掉前缀  本地开发存在 baseHost 和 url host不一致的情况 待处理
  const stopTime = new Date().valueOf();
  const timeCount = stopTime - config['timestamp'];
  let hashURL = (config.url || '').split(baseHost)[1] || '';
  hashURL = hashURL.split('?')[0];

  sendOmegaApiLog(hashURL, {
    method: config.method,
    time: timeCount,
    params: {
      ...config.params,
      ...getUrlQueryParams(location.href),
    },
    err,
  });
};

/**
 * 获取当前 URL 所有 GET 查询参数
 * 入参：要解析的 URL，不传则默认为当前 URL
 * 返回：一个<key, value>参数对象
 */
function getUrlQueryParams(url = location.search) {
  const params = {};
  const reg = /([^&?]*)=([^&]*)/g;
  const res = url.match(reg);
  for (const key in res) {
    const query = res[key].split('=');
    params[query[0]] = query[1];
  }
  return params;
}

/**
 * 获取 URL 无参数前缀
 * @param url
 */
export function getUrlWithoutParams(url: string = location.href) {
  if (url) {
    return url.split('?')[0];
  }
  return '';
}

/**
 * 组装 Get 参数
 * @param host
 * @param params
 */
export function formatGetUrl(host: string, params: object) {
  let paramArr = [];
  for (const key in params) {
    paramArr.push(`${key}=${params[key]}`);
  }
  return `${host}?${paramArr.join('&')}`;
}
