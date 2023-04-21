import request, { postJSON } from '../utils/request';

const fetchBusinessLine = (params) => {
  return request('/v2/businessManager/query/business', { params }); 
};

const fetchResourceType = (params) => {
  return request('/v2/bigdata/type/resource', { params }); 
};

const fetchResource = (params) => {
  return request('/v2/bigdata/resource/query', { params });
};

const getAdminList = (params) => {
  return request('/v2/businessManager/query/user', {params});
};

const getAvailableBusiness = (appId) => request(`/v2/businessManager/query/business?appId=${appId}`);

const delAdmin = (params) => {
  return postJSON('/v2/businessManager/delete', params);
};

const addAdmin = (params) => {
  return postJSON('/v2/businessManager/add', params);
};

const addUser = (params) => {
  return postJSON('/v2/bigdata/resource/add', params);
};

const updateUser = (params) => {
  return postJSON('/v2/bigdata/resource/update', params);
};

const deleteUser = (params) => {
  return postJSON('/v2/bigdata/resource/delete', params);
};

const getPermissionNames = (params) => {
  return postJSON('/v2/nopermission/app/name', params)
}

export {
  fetchBusinessLine,
  getAdminList,
  getAvailableBusiness,
  delAdmin,
  addAdmin,
  fetchResourceType,
  fetchResource,
  addUser,
  updateUser,
  deleteUser,
  getPermissionNames
};
