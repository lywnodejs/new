import request, { postJSON } from '../utils/request';

const addBusiness = params => {
  return postJSON('/v2/business/insert/business', params);
};

const delBusiness = params => {
  return postJSON('/business/delete/business', params);
};

const updateBusiness = params => {
  return postJSON('/business/update/business', params);
};

const getAreaList = params => {
  return request('/area/select/tree', { params });
};

const getAreaListAll = params => {
  return request('/area/app/arealist', { params });
};

const addArea = params => {
  return postJSON('/v2/area/insert/area', params);
};

const updateArea = params => {
  return postJSON('/area/update/area', params);
};

const delArea = params => {
  return postJSON('/area/delete/area', params);
};

const getAppArea = params => {
  return request('/area/app/areatree', { params });
};
const getBusinessList = params => {
  return request('/v2/business/appList', { params });
};

const removeBusiness = params => {
  return postJSON('/v2/business/app/relation', params);
};
// 获取当前登录人的权限权限状态
const getAppManager = params => {
  return request('/user/role/listall', { params });
};

const gerAreaBindedUsers = params => {
  return request('/v2/area/users', { params });
};
const bindUsersToArea = params => {
  return postJSON('/v2/area/bind/users', params);
};
const unBindUsersToArea = params => {
  return postJSON('/v2/area/unbind/users', params);
};

export default {
  getAreaList,
  getAreaListAll,
  addArea,
  updateArea,
  delArea,
  addBusiness,
  delBusiness,
  updateBusiness,
  getAppArea,
  getBusinessList,
  removeBusiness,
  getAppManager,
  gerAreaBindedUsers,
  bindUsersToArea,
  unBindUsersToArea
};
