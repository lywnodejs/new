import request, { postJSON } from '../utils/request';

const getFeaturesList = (params) => {
  return request('/feature/list/feature', { params });
};

const getFeaturesTree = (params) => {
  return request('/feature/select/tree', { params });
};

const addFeature = (params) => {
  return postJSON('/v2/feature/insert/feature', params);
};

const updateFeature = (params) => {
  return postJSON('/feature/update/feature', params);
};

const delFeature = (params) => {
  return postJSON('/feature/delete/feature', params);
};

const batchAdd = (params) => {
  return request('/feature/file/insert', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: params
  });
};

const batchUpdate = (params) => {
  return request('/feature/file/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: params
  });
};

const getLimits = (params) => request('/v2/ff/list', { params });
const removeLimits = (params) => postJSON('/v2/ff/delete', params);
const addLimit = (params) => postJSON('/v2/ff/add', params);

//功能绑定的角色列表
const fetchBindRolesList = (params) => request('/v2/feature/get/bind/roles', { params });

//获取功能下面的角色列表
const fetchRoleList = (params) => {
  const urls = {
    groupRoleList: '/featureGroup/role/list',
    roleList: '/v2/feature/role/list',
    flagRoleList: '/v2/flag/role/list'
  }
  const { type } = params;
  const url = urls[type]
  return postJSON(url, params);
};
//功能批量绑定角色
const insertMutirole = (params) => {
  return postJSON('/feature/insert/mutirole', params);
};

export default {
  getFeaturesList,
  getFeaturesTree,
  addFeature,
  updateFeature,
  delFeature,
  batchAdd,
  batchUpdate,
  getLimits,
  removeLimits,
  addLimit,
  fetchBindRolesList,
  fetchRoleList,
  insertMutirole
};
