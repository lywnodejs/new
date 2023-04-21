import request, { postJSON }from '../utils/request';

const getDefaultAuthList = (params) => {
  return request('/defaultgrant/list', {params});
};

const getDept = (params) => {
  return request('/defaultgrant/getDept', {params});
};

const getJobCode = (params) => {
  return request('/defaultgrant/getJobCode', {params});
};

const updateStatus = (params) => {
  return postJSON('/defaultgrant/activeOrNot', params);
};

const deleteAuth = (params) => {
  return postJSON('/defaultgrant/delete', params);
};

const addAuth = (params) => {
  return postJSON('/defaultgrant/add', params);
};

const updateAuth = (parmas) => {
  return postJSON('/defaultgrant/update', parmas);
};

const copyAuth = (params) => {
  return request('/defaultgrant/copyOne', {params});
};

export {
  getDefaultAuthList,
  updateStatus,
  deleteAuth,
  getDept,
  getJobCode,
  addAuth,
  updateAuth,
  copyAuth,
};
