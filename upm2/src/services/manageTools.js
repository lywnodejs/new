/**
 * 系统管理-管理员工具
 * @author lizhenghua
 * @date 2018-08-16 11:24:22
 */

import { postJSON } from '../utils/request';
import request from '../utils/request';

const getCacheByKey = (cacheKey) => {
  return request(`/cache/getCacheByKey?appId=888&cacheKey=${cacheKey}`);
}

const setCacheByKey = (cacheKey, cacheValue) => {
  return postJSON('/cache/setCache', {
    cacheKey,
    cacheValue,
    appId: 888
  });
}

const deleteCacheByKey = (cacheKey) => {
  return postJSON('/cache/deleteCacheByKey', {
    cacheKey,
    appId: 888
  });
}

export default {
  getCacheByKey,
  setCacheByKey,
  deleteCacheByKey
}