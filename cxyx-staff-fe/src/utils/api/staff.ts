import { addBaseHostPrefix } from '@/utils/data';
import { request } from './request';

export const API = addBaseHostPrefix({
  queryEmployeeList: '/staff/employee/queryEmployeeList',
  newEmployee: '/staff/employee/newEmployee',
  queryEmployeeDetail: '/staff/employee/queryEmployeeDetail',
  appNewEmployee: '/staff/employee/appNewEmployee', // H5报名
  queryCompanyByInviteCode: '/staff/employee/queryCompanyByInviteCode', // H5查询合作方邀请码
  sendValidCode: '/staff/employee/sendValidCode', // H5发送短信
  queryCompanyServiceEntity: 'staff/company/queryCompanyServiceEntity', // 获取实体
  queryJobTypeList: '/staff/jobType/queryJobTypeList',
  editEmployee: '/staff/employee/editEmployee',
  resetPassword: '/staff/employee/resetPassword',
  getIDCardCertificationResult: '/staff/employee/getIDCardCertificationResult',
  // downloadTemplate: '/staff/employee/downloadTemplate', // 外部账号批量下载模版
  uploadTemplate: '/staff/employee/import', // 外部账号批量上传
  updateEmployBatch: '/staff/employee/updateEmployBatch', // 外部账号批量更新
  syncStaffEmployeeStatusBySSO: '/staff/employee/syncStaffEmployeeStatusBySSO' // 获取最新合作方账号数据
});

export const updateEmployBatch = params => {
  return request.post(API.updateEmployBatch, {
    data: params,
  });
};

export const fetchStaffList = params => {
  return request.post(API.queryEmployeeList, {
    data: params,
  });
};

export const resetPassword = employeeId => {
  return request.get(API.resetPassword, {
    params: { employeeId },
  });
};

// export const downloadTemplate = () => {
//   return request.get(API.downloadTemplate, {})
// }

/**
 * @param params
 {
  "name": "张三",
  "mobile": "15002891118",
  "idCardNo": "110101199003078130",
  "companyId": "C000000001",
  "jobModeId": "R",
  "healthCertificates": [
    "/fileserver/health1.jpg",
    "/fileserver/health1.jpg"
  ]
}
 */
export const addStaff = params => {
  return request.post(API.newEmployee, {
    data: params,
  });
};

export const editEmployee = params => {
  return request.post(API.editEmployee, {
    data: params,
  });
};

export const fetchStaffDetail = employeeId => {
  return request.get(API.queryEmployeeDetail, {
    params: { employeeId },
  });
};

export const fetchJobTypeList = (orgId?) => {
  return request.get(API.queryJobTypeList, {
    params: { orgId },
    useCache: true,
    ttl: 3600000,
  });
};

export const appNewEmployee = params => {
  return request.post(API.appNewEmployee, {
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const queryCompanyByInviteCode = params => {
  return request.get(API.queryCompanyByInviteCode, { params });
};

export const sendValidCode = params => {
  return request.get(API.sendValidCode, { params });
};


export const syncStaffEmployeeStatusBySSO = params => {
  return request.post(API.syncStaffEmployeeStatusBySSO, {
    data: params,
  });
};

export const queryCompanyServiceEntity = params => {
  return request.get(API.queryCompanyServiceEntity, { params });
};

export const getIDCardCertificationResult = params => {
  return request.post(API.getIDCardCertificationResult, {
    method: 'post',
    body: params
  })
};