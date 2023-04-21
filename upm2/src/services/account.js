import request, { postJSON } from '../utils/request';

/**
 * 获取用户列表
 */
const getAccountList = (params) => {
  return request('/user/list/user', { params });
};

/**
 * 根据用户名获取匹配的用户
 * @param {*} params
 */
const getMatchAccount = (params) => {
  return request('/v2/user/getUsers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
};

/**
 * 创建用户
 * @param {*} account
 */
const registerAccount = (account) => {
  return request('/user/add/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(account)
  });
};

/**
 * 删除用户
 * @param {*} account
 */
const removeAccount = (account) => {
  return request('/user/delete/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(account)
  });
};

/**
 * 复制用户
 * @param {*} account
 */
const copyAccount = (account) => {
  return request('/v2/user/copy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(account)
  });
};

/**
 * 获取绑定角色组
 */
const getRelevantGroup = params => {
  return request('/user/rolegroup/listall', { params });
};

/**
 * 获取绑定角色
 */
const getRelevantRole = params => {
  return request('/user/role/listall', { params });
};

/**
 * 获取绑定标识位
 */
const getRelevantFlag = params => {
  return request('/user/flag/list', { params });
};

/**
 * 获取绑定区域列表
 */
const getRelevantRegion = params => {
  return request('/user/area/list', { params });
};

/**
 * 绑定角色组
 */
const relevantGroup = account => {
  return request('/user/rolegroup/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(account)
  });
};

/**
 * 绑定角色
 * @param {*} account
 */
const relevantRole = account => {
  return request('/user/role/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(account)
  });
};

/**
 * 绑定角色
 * @param {*} flag
 */
const relevantFlag = account => {
  return request('/user/flag/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(account)
  });
};

/**
 * 绑定地区
 */
const relevantRegion = account => {
  return request('/user/area/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(account)
  });
};

/**
 * 设置角色过期时间
 */
const expireRole = data => {
  return request('/user/role/expire', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};

/**
 * 设置角色组过期时间
 * @param {*} data
 */
const expireRoleGroup = data => {
  return request('/user/rolegroup/expire', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};

/**
 * 获取子系统管理员的子系统
 */
const getManageAppList = () => {
  return request('/v2/user/administrator/appList');
}

/**
 * 批量更新系统信息
 * @param {*} params
 */
const batchUpdateSys = (params) => {
  return postJSON('/app/batch/update', params)
}

export {
  getAccountList,
  getMatchAccount,
  registerAccount,
  removeAccount,
  copyAccount,
  getRelevantGroup,
  getRelevantRole,
  getRelevantFlag,
  getRelevantRegion,
  relevantGroup,
  relevantRole,
  relevantFlag,
  relevantRegion,
  expireRole,
  expireRoleGroup,
  getManageAppList,
  batchUpdateSys
};
