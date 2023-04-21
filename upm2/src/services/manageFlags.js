import request, { postJSON } from '../utils/request';

const getFlagList = (appId) => {
  return request(`/flag/select/tree?appId=${appId}`);
};

const addFlag = (params) => {
  return postJSON('/v2/flag/insert/flag', params);
};

const updateFlag = (params) => {
  return postJSON('/flag/update/flag', params);
};

const delFlag = (params) => {
  return postJSON('/flag/delete/flag', params);
};

/**
 * 角色组绑定用户
 * @param {*} role
 */
const relevantUser = role => {
  return request('/flag/user/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(role)
  });
};

/**
 * 角色组解绑用户
 * @param {*} user
 */
const unRelevantUser = user => {
  return request('/flag/user/unbind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
};

/**
 * 清空角色组绑定角色
 * @param {*} user
 */
const clearRelevantUser = user => {
  return request('/flag/user/clear', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
};

/**
 * 获取角色组绑定的用户
 */
const getRelevantUser = params => {
  return request('/flag/user/list', { params });
}

// 标识位绑定角色
const updateRoleFlag = (params) => {
  return postJSON('/v2/flag/role/insert', params)
}

// 获取全量已绑定标识位的角色列表
const fetchBindFlagRoleList = (params) => {
  return postJSON('/v2/flag/role/list/all', params)
}

export default {
  getFlagList,
  addFlag,
  updateFlag,
  delFlag,
  relevantUser,
  unRelevantUser,
  clearRelevantUser,
  getRelevantUser,
  updateRoleFlag,
  fetchBindFlagRoleList
};
