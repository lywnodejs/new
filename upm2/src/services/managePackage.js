/*
 * @Author: GuoTeng
 * @Date: 2020-07-07 16:33:30
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-09-23 11:21:34
 */
import { postJSON } from '../utils/request';
import request from '../utils/request';

// 分类管理部分
const fetchCategoryList = params => {
  return request('/packageCategory/getByPage', { params });
};

const addCategory = params => {
  return postJSON('/packageCategory/add', params);
};

const updateCategory = params => {
  return postJSON('/packageCategory/update', params);
};

const deleteCategory = params => {
  return postJSON('/packageCategory/delete', params);
};

const fetchAllCategory = params => {
  return request('/packageCategory/getUserCategories', { params });
};

// 礼包管理部分
const fetchPackageList = params => {
  return request('/package/getByPage', { params });
};

const getPackage = params => {
  return request('/package/get', { params });
};

const addPackage = params => {
  return postJSON('/package/add?appId=888', params);
};

const updatePackage = params => {
  return postJSON('/package/add?appId=888', params);
};

const deletePackage = params => {
  return postJSON('/package/delete', params);
};

// 管理员管理部分
const getUserCategories = params => {
  return request('/packageCategory/getUserCategories', { params });
};

const fetchAdminList = params => {
  return request('/packageAdmin/getByPage', { params });
};

const addAdmin = params => {
  return postJSON('/packageAdmin/add?appId=888', params);
};

const updateAdmin = params => {
  return postJSON('/packageAdmin/update', params);
};

const deleteAdmin = params => {
  return postJSON('/packageAdmin/delete', params);
};

const fetchPackageStrategyList = params => {
  return postJSON('/v2/strategy/findStrByRoles', params);
};

// 获取绑定用户列表
const fetchPackageUserList = params => {
  return request('/package/users', { params });
};

// 绑定用户
const savePackageUserList = params => {
  return postJSON('/v2/user/bindPackage', params);
};

const unRelevantUser = params => {
  return postJSON('v2/user/unBindPackage', params);
};

export default {
  fetchCategoryList,
  addCategory,
  updateCategory,
  deleteCategory,
  fetchAllCategory,
  fetchPackageList,
  getPackage,
  addPackage,
  updatePackage,
  deletePackage,
  getUserCategories,
  fetchAdminList,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  fetchPackageStrategyList,
  fetchPackageUserList,
  savePackageUserList,
  unRelevantUser
};
