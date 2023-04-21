import request, { postJSON } from '../utils/request';

/**
 * 从缓存查出用户的该子系统所有角色
 */
const getRolesFromCache = (params) => {
  return request('/cache/getUserRoleCacheContent', { params });
};
/**
 * 从 DB 刷用户的该子系统所有角色到 redis
 */
const refreshRolesToRedis = (data) => {
  return postJSON('/cache/refreshUserRoleCache', { ...data });
};
/**
 * 从缓存查出用户的该子系统所有 Flag
 */
const getFlagsFromCache = (params) => {
  return request('/cache/getUserFlagCacheContent', { params });
};
/**
 * 从 DB 刷用户的该子系统所有 Flag 到 redis
 */
const refreshFlagsToRedis = (data) => {
  return postJSON('/cache/refreshUserFlagCache', { ...data });
};

const getRegionFromCache = (params) => {
  return request('/cache/getUserAreaCacheContent', { params });
};
const refreshRegionToRedis = (data) => {
  return postJSON('/cache/refreshUseAreaCache', { ...data });
};

export {
  getRolesFromCache,
  refreshRolesToRedis,
  getFlagsFromCache,
  refreshFlagsToRedis,
  getRegionFromCache,
  refreshRegionToRedis,
};