import { addBaseHostPrefix } from '@/utils/data';
import { request } from './request';

export const API = addBaseHostPrefix({
  queryOrganizationList: '/staff/organization/queryOrganizationList', // 查询一层树
  editOrganizationNode: '/staff/organization/editOrganizationNode',
  deleteOrganization: '/staff/organization/deleteOrganization',
  queryOrganizationNodeDetail:
    '/staff/organization/queryOrganizationNodeDetail',
  queryAnchoredEmployeeList: '/staff/anchor/queryAnchoredEmployeeList',
  queryEmployeeListForAnchor: '/staff/employee/queryEmployeeListForAnchor',
  newEmployeeAnchor: '/staff/anchor/newEmployeeAnchor',
  unbindEmployee: '/staff/anchor/unbindEmployee',
  queryOrganizationsByName: '/staff/organization/queryOrganizationsByName', // 根据名称查询树
  queryOrganizationByType: '/staff/organization/queryOrganizationByType', // 通过类型查找实体
});

export const queryOrganizationByType = params => {
  return request.get(API.queryOrganizationByType, {
    params,
    useCache: true,
    ttl: 3600000,
  });
};
export const queryOrganizationsByName = params => {
  return request.get(API.queryOrganizationsByName, {
    params,
  });
};

export const fetchOrganizationList = params => {
  return request.get(API.queryOrganizationList, {
    params,
  });
};

// 添加、修改组织节点
export const writeOrganizationNode = params => {
  return request.post(API.editOrganizationNode, {
    data: params,
  });
};

// 删除组织节点
export const deleteOrganizationNode = orgId => {
  return request.post(API.deleteOrganization, {
    data: { orgId },
  });
};

// 查看组织节点详情
export const fetchOrganizationNode = orgId => {
  return request.get(API.queryOrganizationNodeDetail, {
    params: { orgId },
  });
};

// 查看组织节点下已绑定的人员列表
export const queryAnchoredEmployeeList = params => {
  return request.get(API.queryAnchoredEmployeeList, {
    params,
  });
};

// 查看组织节点下所有供应商的人员列表
export const queryEmployeeListForAnchor = params => {
  return request.get(API.queryEmployeeListForAnchor, {
    params,
  });
};

// 组织节点下绑定人员
export const newEmployeeAnchor = params => {
  return request.post(API.newEmployeeAnchor, {
    data: params,
  });
};

// 组织节点下解绑人员
export const unbindEmployee = params => {
  return request.post(API.unbindEmployee, {
    data: params,
  });
};
