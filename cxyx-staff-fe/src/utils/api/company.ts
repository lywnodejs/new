import { addBaseHostPrefix } from '@/utils/data';
import { request } from './request';

export const API = addBaseHostPrefix({
  newCompany: '/staff/company/newCompany', // 新增合作方
  editCompany: '/staff/company/editCompany', // 编辑合作方
  getAllWarehouseList: '/staff/warehouse/getAllWarehouseList',
  queryCompanyList: '/staff/company/queryCompanyList',
  queryCompanyIdList: '/staff/company/queryCompanyIdList',
  updateContacts: '/staff/company/updateContacts',
  queryByLdap: '/staff/inner/employee/queryByLdap', // 获取管理人员账号
  queryCompanyManagerList: '/staff/company/queryCompanyManagerList', // 查询合作方管理人员
  insertCompanyManager: '/staff/company/insertCompanyManager', // 新增合作方管理人员
  deleteCompanyManager: '/staff/company/deleteCompanyManager', // delete合作方管理人员
  queryOrganizationManagerListByType: '/staff/organization/queryOrganizationManagerListByType',
  employeeQueryByLdap: '/staff/employee/queryByLdap',
  addOrganizationManager: '/staff/organization/addOrganizationManager',
  delOrganizationManager: '/staff/organization/delOrganizationManager',
  getGoodsTypeList: '/staff/staffEmployeeGoodsType/getGoodsTypeList',
  getCompanyCategoryType: '/staff/general/getAllEnum'
});

export const newCompany = params => {
  return request.post(API.newCompany, {
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const editCompany = params => {
  return request.post(API.editCompany, {
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getAllWarehouseList = (params?) => {
  return request.get(API.getAllWarehouseList, {
    params,
    useCache: true,
    ttl: 3600000,
  });
};

export const getGoodsTypeList = (params?) => {
  return request.get(API.getGoodsTypeList, {
    params,
    useCache: true,
    ttl: 3600000,
  });
};

export const queryCompanyList = params => {
  return request.get(API.queryCompanyList, { params });
};
export const employeeQueryByLdap = params => {
  return request.get(API.employeeQueryByLdap, { params });
};

export const fetchCompanyIdList = (params?) => {
  return request.get(API.queryCompanyIdList, { params });
};

export const updateContacts = params => {
  return request.post(API.updateContacts, {
    data: params
  });
};

export const queryByLdap = (params?) => {
  return request.post(API.queryByLdap, {
    data: params
  });
};

export const queryCompanyManagerList = (params?) => {
  return request.post(API.queryCompanyManagerList, {
    data: params
  });
};

export const queryOrganizationManagerListByType = (params?) => {
  return request.get(API.queryOrganizationManagerListByType, {
    params
  });
};

export const insertCompanyManager = (params?) => {
  return request.post(API.insertCompanyManager, {
    data: params
  });
};


export const deleteCompanyManager = (params?) => {
  return request.post(API.deleteCompanyManager, {
    data: params
  });
};

export const addOrganizationManager = (params?) => {
  return request.post(API.addOrganizationManager, {
    data: params
  });
};

export const delOrganizationManager = (params?) => {
  return request.post(API.delOrganizationManager, {
    data: params
  });
};

export const getCompanyCategoryType = () => {
  return request.get(API.getCompanyCategoryType)
}