import { addBaseHostPrefix } from '@/utils/data';
import { request } from './request';
import { ApiCacheService } from '@/utils/api-cache-service';

export const API = addBaseHostPrefix({
  queryJobTypeAndPackageList: '/staff/jobType/queryJobTypeAndPackageList',
  queryJobDutyAndPackageList: '/staff/jobduty/queryJobDutyAndPackageList',
  queryUserList: '/staff/jobType/queryUserList',
  jobdutyQueryUserList: '/staff/jobduty/queryUserList',
  queryCategoryList: '/staff/privilegePackage/queryCategoryList',
  queryPackageList: '/staff/privilegePackage/queryPrivilegePackageList',
  bindJobDutyAndPrivilegePackage:
    '/staff/jobduty/bindJobDutyAndPrivilegePackage',
  updateJobDuty: '/staff/jobduty/updateJobDuty',
  saveJobDuty: '/staff/jobduty/saveJobDuty',
  saveJobType: '/staff/jobType/saveJobType',
  updateJobType: '/staff/jobType/updateJobType',
  queryOutCategoryList: '/staff/privilegePackage/queryOutCategoryList',
  queryJobDutyList: '/staff/jobduty/queryJobDutyList',
  // http://mock.xiaojukeji.com/project/5519/interface/api/160672
  applyJobDuty: 'staff/jobduty/applyJobDuty',
  getDutyInfoByLdap: '/staff/jobduty/getDutyInfoByLdap',
  getIsInnerEmployee: '/staff/inner/employee/isInnerEmployee',
  isApplayDuty: '/staff/jobduty/isApplayDuty', // https://mock.xiaojukeji.com/project/5519/interface/api/160704
});

export const queryJobTypeAndPackageList = params => {
  return request.post(API.queryJobTypeAndPackageList, {
    data: params,
  });
};

export const queryJobDutyAndPackageList = params => {
  return request.post(API.queryJobDutyAndPackageList, {
    data: params,
  });
};

export const queryUserList = params => {
  return request.post(API.queryUserList, {
    data: params,
  });
};

export const jobdutyQueryUserList = params => {
  return request.post(API.jobdutyQueryUserList, {
    data: params,
  });
};

export const bindJobDutyAndPrivilegePackage = params => {
  return request.post(API.bindJobDutyAndPrivilegePackage, {
    data: params,
  });
};

export const queryCategoryList = () => {
  return request.get(API.queryCategoryList);
};
export const queryOutCategoryList = () => {
  return request.get(API.queryOutCategoryList);
};

export const queryPackageList = params => {
  return request.get(API.queryPackageList, { params });
};

export const updateJobDuty = params => {
  return request.post(API.updateJobDuty, {
    data: params,
  });
};

export const updateJobType = params => {
  return request.post(API.updateJobType, {
    data: params,
  });
};

export const saveJobDuty = params => {
  return request.post(API.saveJobDuty, {
    data: params,
  });
};

export const saveJobType = params => {
  return request.post(API.saveJobType, {
    data: params,
  });
};

// 获取工作职责列表
export const queryJobDutyList = new ApiCacheService<any>(
  () => request.get(API.queryJobDutyList),
  () => 'AlwaysHitCache',
);

// 用户申请岗位职责
export const applyJobDuty = data => {
  return request.post(API.applyJobDuty, {
    data,
  });
};

// 查询当前登陆人的工作职责信息
export const getDutyInfoByLdap = () => {
  return request.get(API.getDutyInfoByLdap);
};

// 是否是集团内部人员
export const getIsInnerEmployee = () => {
  return request.get(API.getIsInnerEmployee);
};

// 是否有正在申请中的权限
export const isApplayDuty = () => {
  return request.get(API.isApplayDuty);
};
