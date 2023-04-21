import { addBaseHostPrefix } from '@/utils/data';
import { request } from './request';

export const API = addBaseHostPrefix({
  queryByParam: '/staff/inner/employee/queryByParam',
  updateEmployeeInfo: '/staff/inner/employee/updateEmployeeDept',
  getPowerByLdap: '/staff/general/getPowerByLdap',
  deleteEmployeeInfo: '/staff/inner/employee/deleteEmployeeInfo',
  queryLdapsByLdap: '/staff/inner/employee/queryLdapsByLdap',
  getQueryPackageInfo: '/staff/inner/employee/queryPackageInfoByDutyId', // 职责分配信息获取
  getArea: '/staff/inner/employee/queryAreaListByBusinessId', // 根据业务线获取地区接口
  updateEmployeeDuty: '/staff/inner/employee/updateEmployeeDuty', // https://mock.xiaojukeji.com/project/5519/interface/api/125388
  queryPackageResourceByDutyId:
    '/staff/inner/employee/queryPackageResourceByDutyId',
});

export const fetchFormalList = params => {
  return request.post(API.queryByParam, {
    data: params,
  });
};

export const updateInfo = params => {
  return request.post(API.updateEmployeeInfo, {
    data: params,
  });
};

export const getPowerByLdap = params => {
  return request.get(API.getPowerByLdap, {
    params,
  });
};

export const deleteEmployeeInfo = params => {
  return request.get(API.deleteEmployeeInfo, {
    params,
  });
};

export const queryLdapsByLdap = params => {
  return request.get(API.queryLdapsByLdap, {
    params,
  });
};
export const getQueryPackageInfo = params => {
  return request.post(API.getQueryPackageInfo, {
    data: params,
  });
};

export const getArea = params => {
  return request.post(API.getArea, {
    data: params,
  });
};

export const updateEmployeeDuty = params => {
  return request.post(API.updateEmployeeDuty, {
    data: params,
  });
};

// 获取职责对应的资源
export const queryPackageResourceByDutyId = data => {
  return request.post(API.queryPackageResourceByDutyId, {
    data,
  });
};
