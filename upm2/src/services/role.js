/**
 * 角色相关操作services
 * by zhangdi
 */
import request, { postJSON } from '../utils/request';
import { isOversea } from '@config/env';

const cancleAllRoleUser = params => {
  return  postJSON('/v2/roleManage/user/unbindAll', params);
}
/**
 * 获取角色列表
 */
const getRoleList = params => {
  return  postJSON('/v2/roleManage/list/role', params);
}

/**
 * 获取全部角色
 * @param {*} params
 */
const getRoleListAll = params => {
  return request('/role/list/all', { params });
};

/**
 * 新增角色
 * @param {*} role
 */
const createRole = role => {
  const url = '/v2/roleManage/add/role';

  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(role)
  });
};

/**
 * 更新角色
 */
const updateRole = role => {
  const url = '/v2/roleManage/update/role';

  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(role)
  });
};

/**
 * 删除角色
 */
const removeRole = role => {
  const url = isOversea
    ? '/v2/roledime/delete/role'
    : '/role/delete/role';

  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(role)
  });
};

/**
 * 获取角色关联的功能
 */
const getRoleRelevantFeature = params => {
  return request('role/feature/list', { params });
};

/**
 * 获取角色管理标识位
 */
const getRoleRelevantFlag = params => {
  return request('role/flag/list', { params });
};

/**
 * 获取角色关联用户
 * @param {*} params
 */
const getRoleRelevantUser = params => {
  return request('v2/role/user/list', { params });
};

/**
 * 获取角色关联角色组
 * @param {*} params
 */
const getRoleRelevantGroup = params => {
  return request('role/rolegroup/list', { params });
};

/**
 * 获取角色关联功能组
 * @param {*} params
 */
const getRoleRelevantFeatureGroup = params => {
  return request('role/featureGroupIds', { params });
};

/**
 * 获取角色绑定策略
 */
const getRoleRelevantStrategy = params => {
  return request('v2/strategy/findStrByRoles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
};

/**
 * 角色关联角色组
 */
const relevantGroup = role => {
  return request('/role/rolegroup/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(role)
  });
};

/**
 * 角色关联功能组
 */
const relevantFeatureGroup = params => {
  return request('/role/featureGroup/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
};

/**
 * 角色关联用户
 * @param {*} user
 */
const relevantUser = user => {
  return request('/role/user/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
};

/**
 * 角色关联功能
 * @param {*} feature
 */
const relevantFeature = feature => {
  return request('/role/feature/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(feature)
  });
};

/**
 * 角色关联标识位
 * @param {*} flag
 */
const relevantFlag = flag => {
  return request('/role/flag/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(flag)
  });
};

/**
 * 角色解绑用户
 */
const unRelevantUser = user => {
  return request('/role/user/unbind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
};

//-----------------------------------------

/**
 * 获取角色组列表
 */
const getRoleGroupList = params => {
  return request('/rolegroup/list/rolegroup', { params });
};

/**
 * 获取全部角色组
 */
const getRoleGroupListAll = params => {
  return request('/rolegroup/list/all', { params });
};

/**
 * 获取全部功能组
 */
const getFeatureGroupListAll = params => {
  return request('/featureGroup/list/all', { params });
};

/**
 * 新增角色组
 * @param {*} role
 */
const createRoleGroup = roleGroup => {
  return request('/rolegroup/save/rolegroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roleGroup)
  });
};

/**
 * 更新角色组
 */
const updateRoleGroup = roleGroup => {
  return request('/rolegroup/update/rolegroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roleGroup)
  });
};

/**
 * 删除角色组
 */
const removeRoleGroup = roleGroup => {
  return request('/rolegroup/delete/rolegroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roleGroup)
  });
};

/**
 * 获取角色组关联角色
 */
const getGroupRelevantRole = params => {
  return request('rolegroup/role/list', { params });
};

/**
 * 角色组关联角色
 */
const relevantRole = role => {
  return request('/rolegroup/role/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(role)
  });
};

/**
 * 角色组绑定用户
 * @param {*} role
 */
const relevantUser2Group = role => {
  return request('/rolegroup/user/bind', {
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
const unRelevantUser2Group = user => {
  return request('/rolegroup/user/unbind', {
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
const clearRelevantUser2Group = user => {
  return request('/rolegroup/user/clear', {
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
const getRoleGroupRelevantUser = params => {
  return request('/rolegroup/user/list', { params });
}

// 获取用户的国家列表
const getRoleDimeList = appId => {
  return postJSON('/v2/roledime/list/dimenode', {
    appId,
  });
};

// 角色绑定产品线
const bindProduct = ({appId, roleId, produceLineId}) => {
  return postJSON('/v2/role/bind/product', {
    appId, roleId, produceLineId
  });
};

// 为角色（组）设置标签
const saveTags = (params) => {
  return postJSON('/v2/label/add', params)
}

// 删除角色（组）的标签
const removeTags = (params) => {
  return postJSON('/v2/label/remove', params)
}

// 查询角色（组）所打的标签
const findTags = (params) => {
  return postJSON('/v2/label/find', params)
}

// 获取角色分类列表
const getRolelabelList = params => {
  return request('/v2/rolelabel/list', { params });
};

const getAllRolelabelList = (params) => {
  return request('/v2/nopermission/role/labelList', {params});
};

// 新增角色分类
const addRolelabel = (params) => {
  return postJSON('/v2/rolelabel/add', params)
}

// 编辑角色分类
const editRolelabel = (params) => {
  return postJSON('/v2/rolelabel/update', params)
}

// 删除角色分类
const deleteRolelabel = (params) => {
  return postJSON('/v2/rolelabel/delete', params)
}

/**
 * 获取推荐角色
 * @param {*} params
 */
const recommendRoles = (params) => {
  return request('/v2/data/recommendRoles', { params })
}

export default {
  getRoleList,
  getRoleListAll,
  getRoleGroupList,
  getRoleGroupListAll,
  getFeatureGroupListAll,
  createRole,
  updateRole,
  removeRole,
  createRoleGroup,
  updateRoleGroup,
  removeRoleGroup,
  getRoleRelevantFeature,
  getRoleRelevantFlag,
  getRoleRelevantUser,
  getRoleRelevantGroup,
  getRoleRelevantStrategy,
  getGroupRelevantRole,
  getRoleRelevantFeatureGroup,
  relevantGroup,
  relevantFeatureGroup,
  relevantRole,
  relevantUser,
  relevantFeature,
  relevantFlag,
  unRelevantUser,
  getRoleDimeList,
  bindProduct,
  saveTags,
  removeTags,
  findTags,
  getRolelabelList,
  getAllRolelabelList,
  addRolelabel,
  editRolelabel,
  deleteRolelabel,
  cancleAllRoleUser,
  recommendRoles,
  relevantUser2Group,
  unRelevantUser2Group,
  getRoleGroupRelevantUser,
  clearRelevantUser2Group
};
