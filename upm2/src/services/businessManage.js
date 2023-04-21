import request, {
  postJSON
} from '../utils/request';

// 模糊匹配用户名
const queryUserName = (params) => {
  return request('/v2/nopermission/user/query', {
    params
  });
};

const getBusisnessRoleList = (params) => {
  return request('/v2/businessAdmin/role/list', {
    params
  });
};

const deleteBussisnessRole = (data) => {
  return postJSON('/v2/businessAdmin/delete/role', {
    ...data,
  });
};

const addBussisnessRole = (data) => {
  return postJSON('/v2/businessAdmin/save/role', {
    ...data,
  });
}

const editBussisnessRole = (data) => {
  return postJSON('/v2/businessAdmin/update/role', {
    ...data,
  });
}
// 角色绑定用户（permissionType:8）、模版等资源
const roleBindResource = (data) => {
  return postJSON('/v2/businessAdmin/role/bind', {
    ...data
  });
}

// 角色解绑用户
const roleUnBindResource = (data) => {
  return postJSON('/v2/businessAdmin/role/unbind', {
    ...data
  });
}

// 角色绑定用户查询
const getRoleBindUsers = (params) => {
  return request('/v2/businessAdmin/role/user/list', {
    params
  });
}

// 角色对应的资源查询
const getBusinessResourceList = (params) => {
  return request('/v2/businessAdmin/resource/list', {
    params
  });
}

// 角色对应的地区
const getRoleArea = (params) => {
  return request('/area/select/tree', {
    params
  });
}

// 获取角色对应绑定资源列表
const getRoleBindResourceList = (params) => {
  return request('/v2/businessAdmin/role/bind/list', {
    params
  });
}
// 获取角色绑定地区列表
const getRoleBindAreaList = (params) => {
  return request('/v2/businessAdmin/role/area/list', {
    params
  });
}

const getBusisnessUserList = (params) => {
  return request('/v2/businessAdmin/list/user', {
    params
  });
};

// 获取用户对应绑定资源列表
const getUserBindResourceList = (params) => {
  return request('/v2/businessAdmin/user/resource/list', {
    params
  });
};

// 获取用户对应绑定角色列表
const getUserBindRoleList = (params) => {
  return request('/v2/businessAdmin/user/role/list', {
    params
  });
};
// 获取用户对应绑定地区列表
const getUserBindAreaList = (params) => {
  return request('/v2/businessAdmin/user/area/list', {
    params
  });
};

// 获取资源下面绑定的角色
const getResourceBindRoleList = (params) => {
  return request('/v2/businessAdmin/resource/role/list', {
    params
  });
}

// 获取资源下面绑定的用户
const getResourceBindUserList = (params) => {
  return request('/v2/businessAdmin/resource/user/list', {
    params
  });
}

const getAreaBindUserList = (params) => {
  return request('/v2/businessAdmin/area/user/list', {
    params
  });
}

// 用户绑定相关资源(1, “地区”),(2,"角色"),(3,"数易报表"),(4,"提取工具模板"),(5,"指标"),(6,"功能"),(7,"flag")
const userBindResource = (data) => {
  return postJSON('/v2/businessAdmin/user/bind', {
    ...data
  });
}

// 用户解绑定相关资源(1, “地区”),(2,"角色"),(3,"数易报表"),(4,"提取工具模板"),(5,"指标"),(6,"功能"),(7,"flag")
const userUnBindResource = (data) => {
  return postJSON('/v2/businessAdmin/user/unbind', {
    ...data
  });
}

const getBusinessAreaList = params => {
  return request('/v2/businessAdmin/area/list', {
    params
  })
}

export {
  queryUserName,

  // 角色管理相关接口
  getBusisnessRoleList,
  deleteBussisnessRole,
  addBussisnessRole,
  editBussisnessRole,
  roleBindResource,
  getRoleBindUsers,
  roleUnBindResource,
  getBusinessResourceList,
  getRoleArea,
  getRoleBindResourceList,
  getRoleBindAreaList,
  getResourceBindRoleList,
  getResourceBindUserList,
  getAreaBindUserList,

  // 用户管理相关接口
  getBusisnessUserList,
  getUserBindResourceList,
  getUserBindRoleList,
  getUserBindAreaList,
  userBindResource,
  userUnBindResource,

  // 权限管理的接口
  getBusinessAreaList
};
