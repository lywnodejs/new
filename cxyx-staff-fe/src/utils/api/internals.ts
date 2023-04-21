import { addBaseHostPrefix } from '@/utils/data';
import { request } from './request';

export const API = addBaseHostPrefix({
  getStaffDept: '/staff/dept/getStaffDept',
  getManagerBydeptID: '/staff/dept/getManagerBydeptID',
  getStaffInfoByLdap: '/staff/general/getStaffInfoByLdap', // 根据域账号批量查询人员信息
  synchronousStaffInfo: '/staff/general/synchronousStaffInfo', // 账号同步
  isStaffSystemSuperOrInnerManagerRole: 'staff/userPrivilege/isStaffSystemSuperOrInnerManagerRole',
  selectEmployeeByLdap: '/staff/inner/employee/selectEmployeeByLdap',
  addDeptAgent: '/staff/employeeDept/addDeptAgent'
});

export const getStaffInfoByLdap = params => {
  return request.get(API.getStaffInfoByLdap, { params });
};

export const getStaffDept = () => {
  return request.get(API.getStaffDept, {});
};

export const isStaffSystemSuperOrInnerManagerRole = () => {
  return request.get(API.isStaffSystemSuperOrInnerManagerRole, {});
};
export const selectEmployeeByLdap = params => {
  return request.get(API.selectEmployeeByLdap, { params });
};

export const getManagerBydeptID = params => {
  return request.post(API.getManagerBydeptID, {
    data: params,
  });
};
export const synchronousStaffInfo = data => {
  return request.post(API.synchronousStaffInfo, {
    data,
  });
};


export const addDeptAgent = params => {
  return request.post(API.addDeptAgent, {
    data: params,
  });
};