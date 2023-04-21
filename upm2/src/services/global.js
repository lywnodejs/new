import request from '../utils/request';

// 获取全局枚举映射关系
const getEnumMap = () => {
  return request('/common/get/enummap');
};

// 获取全部的子系统列表
const getSystemList = () => {
  return request('/v2/configapplypage/app/defaultlist');
};

//获取我的足迹app
const getFootprint = (params) => {
  return request('/user/get/appAccessed', { params });
};

const getAvailableApps = () => {
  return request('/my/available/app');
};

const getAllBusiness = () => {
  return request('/business/select/all');
};

const getBusinessSystemList = () => {
  return request('/v2/mypermission/business/app');
}

// 获取最活跃的8个系统
const getTopApps = () => {
  return request('/v2/app/getTopApprovesSys?appId=888')
}

/**
 * 判断app是否接入BPM
 */
const checkBpmApps = (params) => {
  return request('/v2/app/isBpmApps', { params })
}

/**
 * 获取一级部门
 */
 const getDepartmentLevelOneList = () => {
  return request('/department/levelOne/list');
}

/**
 * 获取系统环境配置
 */
const getSyetemEnv = () => {
  return request('/app/get/env');
}

export default {
  getEnumMap,
  getSystemList,
  getAvailableApps,
  getAllBusiness,
  getFootprint,
  getBusinessSystemList,
  getTopApps,
  checkBpmApps,
  getDepartmentLevelOneList,
  getSyetemEnv
};
