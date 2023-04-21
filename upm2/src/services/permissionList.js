import { postJSON } from '../utils/request';
import request from '../utils/request';

const fetchAreaList = (params) => {
  return postJSON('/v2/my/permission/area/list', params);
};

const fetchDataList = (params) => {
  return postJSON('/v2/my/permission/data/list', params);
};

const fetchRoleList = (params) => {
  return postJSON('/v2/my/permission/role/list', params);
};

const removeRolePermission = (params) => {
  return postJSON('/v2/my/permission/role/remove', params);
};

const removeDataPermission = (params) => {
  return postJSON('/v2/my/permission/data/remove', params);
};

const fetchRoleDetail = (params) => {
  return request('/v2/my/permission/getRoleDetails', { params });
};

const fetchDataDetail = (params) => {
  return request('/v2/my/permission/getResourceDetails', { params });
};

const fetchPermissionCount = (params) => {
  return request('/v2/my/permission/count', { params });
};

const fetchPermissionOtherCount = (params) => {
  return request('/v2/my/permission/othercount', { params });
};

const fetchPermissionList = (params) => {
  return request('/v2/mypermission/permissions', { params });
};

const fetchOtherPermissionList = (params) => {
  return request('/v2/mypermission/confirmTransfer', { params });
};

const permissionClose = (params) => {
  return postJSON('/v2/mypermission/close', params);
};

const permissionSaveOther = (params) => {
  const who = params.who;
  delete params.who;
  return postJSON('/v2/mypermission/saveother?who=' + who, params);
};

const permissionBatchApply = (params) => {
  return postJSON('/v2/apply/batchApply', params);
};

const fetchTransferUserTodoList = () => {
  return request('/v2/mypermission/transferUserTodoList');
};

export default {
  fetchAreaList,
  fetchDataList,
  fetchRoleList,
  removeRolePermission,
  removeDataPermission,
  fetchRoleDetail,
  fetchDataDetail,
  fetchPermissionCount,
  fetchPermissionOtherCount,
  fetchPermissionList,
  fetchOtherPermissionList,
  permissionClose,
  permissionSaveOther,
  permissionBatchApply,
  fetchTransferUserTodoList
};
