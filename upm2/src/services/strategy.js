import request from '../utils/request';

/**
 * 查询角色策略列表
 */
const getStrategyList = params => {
  return request('/v2/strategy/getStrList', { params });
};

/**
 * 查询角色策略
 */
const getStrategy = params => {
  return request('/v2/strategy/get/androle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
};

/**
 * 创建策略类型
 * @param {*} strategy
 */
const createStrategy = strategy => {
  return request('/v2/strategy/add/torole', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(strategy)
  });
};

/**
 * 更新策略类型
 * @param {*} strategy
 */
const updateStrategy = strategy => {
  return request('/v2/strategy/update/torole', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(strategy)
  });
};

/**
 * 删除策略类型
 * @param {*} strategy
 */
const removeStrategy = strategy => {
  return request('/v2/strategy/unbind/androle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(strategy)
  });
};

// -----------------------------------

/**
 * 查询角色策略类型列表
 */
const getTypeList = params => {
  return request('/v2/tag/select/tags', { params });
};

/**
 * 查询角色策略类型列表
 */
const getTypeListAll = params => {
  return request('/v2/tag/select/allTags', { params });
};

/**
 * 创建策略类型
 * @param {*} type
 */
const createType = type => {
  return request('/v2/tag/insert/tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(type)
  });
};

/**
 * 更新策略类型
 * @param {*} type
 */
const updateType = type => {
  return request('/v2/tag/update/tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(type)
  });
};

/**
 * 删除策略类型
 * @param {*} type
 */
const removeType = type => {
  return request('/v2/tag/delete/tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(type)
  });
};

export default {
  getStrategyList,
  getStrategy,
  getTypeList,
  getTypeListAll,
  createStrategy,
  updateStrategy,
  removeStrategy,
  createType,
  updateType,
  removeType
};
