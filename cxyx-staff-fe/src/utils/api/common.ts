import { addBaseHostPrefix } from '@/utils/data';
import { request } from './request';

export const COMMON_API = addBaseHostPrefix({
  upload: '/staff/file/upload', // 文件上传 // action="http://10.96.77.141:8080/staff/file/upload"
  citySelect: '/staff/cityinfo/getlist', // 城市接口
  departmentSelect: '/staff/dept/getStaffDept', // 部门接口
  queryJobDutyList: '/staff/jobduty/queryJobDutyList',
  getRouterConfig: '/staff/user/getFeatureList', // 获取路由配置
  queryOrganizatioManager: '/staff/organization/queryOrganizatioManager',
  // ssoLogout: '/gateway/sso/logout', // SSO 退出登录
  ssoLogout: '/gateway/sso/logout/staff', // SSO 退出登录
  getFunctionItem: '/staff/user/getFunctionItem', // 获取当前用户功能权限
  employeeQueryByLdap: '/staff/inner/employee/queryByLdap',
  updateWarehouseManager: '/staff/organization/updateWarehouseManager'
});

export const loginSSO = () => {
  // message.error('请先登录');
  // location.href = `${COMMON_API.ssoLogin}?jumpto=${location.href}`;
};

export const logoutSSO = () => {
  return request.get(COMMON_API.ssoLogout, {
    params: {
      jumpto: location.href,
    },
  });
};

// 获取权限点
export const getFunctionItem = () => {
  return request.get(COMMON_API.getFunctionItem, {
    useCache: true,
    ttl: 3600000,
  });
};

// 城市树状接口
export const citySelect = () => {
  return request.get(COMMON_API.citySelect, {
    useCache: true,
    ttl: 3600000,
  });
};

// 部门树状接口
export const departmentSelect = params => {
  return request.get(COMMON_API.departmentSelect, { params });
};

// 工作职责接口
export const queryJobDutyList = () => {
  return request.get(COMMON_API.queryJobDutyList);
};

// 获取路由配置
export const getRouterConfig = () => {
  return request.get(COMMON_API.getRouterConfig);
};

// 获取管理员
export const queryOrganizatioManager = params => {
  return request.post(COMMON_API.queryOrganizatioManager, {
    data: params,
  });
};

// 获取仓库经理
export const employeeQueryByLdap = params => {
  return request.post(COMMON_API.employeeQueryByLdap, {
    data: params,
  });
};
export const updateWarehouseManager = params => {
  return request.post(COMMON_API.updateWarehouseManager, {
    data: params,
  });
}
