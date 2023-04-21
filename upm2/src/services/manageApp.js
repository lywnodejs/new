import request, { postJSON } from '../utils/request';

const fetchApps = (params) => {
  return request('/admin/get/appList', {
    params
  });
};

const enableApp = (data) => {
  return postJSON('app/enable/app', data);
};

const disableApp = (data) => {
  return postJSON('app/disable/app', data);
};

const deleteApp = (data) => {
  return postJSON('app/delete/app', data);
};

const addApp = (data) => {
  return postJSON('app/insert/app', data);
};

const updateApp = (data) => {
  return postJSON('app/update/app', data);
};

//是否显示系统信息配置弹窗
const isShowSystemInfoConfig = () => {
  return postJSON('/v2/data/app/display');
};

//获取当前人有权限的子系统列表
const fetchAvailableApps = () => {
  return request('/my/admin/app');
};

//强制填写子系统咨询人
const forceFillSystem = (payload) => {
  const { params, appId } = payload;
  return postJSON('/app/batchUpdate/app?appId=' + appId, params);
};

// 修改是否负责权限管理
const updateAdminSwitch = (payload) => {
  return postJSON('/admin/switch', payload)
}

// 获取用户被设置为权限管理人的app列表
const fetchPermissionAdminList = () => {
  return request('/my/admin/app/' + true)
}


export {
  fetchApps,
  enableApp,
  disableApp,
  deleteApp,
  addApp,
  updateApp,
  isShowSystemInfoConfig,
  forceFillSystem,
  fetchAvailableApps,
  updateAdminSwitch,
  fetchPermissionAdminList
};
