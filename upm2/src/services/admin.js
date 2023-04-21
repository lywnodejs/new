import request, { postJSON } from '../utils/request';

const fetchDetail = (appId) => {
  return request('/admin/get/appinfo', {
    params: { appId }
  });
};

const updateAppInfo = (data) => {
  return postJSON('admin/update/appinfo', data);
};

const getBusiness = (appId) => {
  return request('/admin/get/appbindedbusiness', {
    params: { appId }
  });
};

const getAppBindedBusiness = (appId) => {
  return request('/v2/nopermission/appbindedbusiness', {
    params: { appId }
  });
};
const getAppBindedBusinessAll = (appId) => {
  return request('/v2/nopermission/appbindedbusiness-all', {
    params: { appId }
  });
};


const updateBusiness = (data) => {
  return postJSON('admin/bind/appbusiness', data);
};

const getAdminUserList = (params) => {
  return request('/admin/get/adminusers', {
    params
  });
};

const unbindAdmins = (data) => {
  return postJSON('admin/del/adminuser', data);
};

const bindAdmins = (data) => {
  return postJSON('admin/add/adminuser', data);
};

const getSubAdmins = (params) => request('admin/get/subadminusers', { params });
const bindSubAdmins = (data) => postJSON('admin/add/subadminuser', data);
const unbindSubAdmins = (data) => postJSON('admin/del/subadminuser', data);

export {
  fetchDetail,
  updateAppInfo,
  getBusiness,
  updateBusiness,
  getAdminUserList,
  unbindAdmins,
  bindAdmins,
  getSubAdmins,
  bindSubAdmins,
  unbindSubAdmins,
  getAppBindedBusiness,
  getAppBindedBusinessAll
};
