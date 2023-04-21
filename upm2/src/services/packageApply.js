import request, { postJSON } from '../utils/request';

const getPackageCountries = (params) => {
  return request('/package/getPackageCountries', { params });
}

const getCategoriesByCountry = (params) => {
  return request('/package/getCategoriesByCountry', { params });
}

const getPackageByCondition = (params) => {
  return request('/package/getPackageByCondition', { params });
}

const getPermissionsByPackageId = (params) => {
  return request('/package/getPermissionsByPackageId', { params });
}

const addPackage = (data) => {
  return postJSON('/v2/apply/addPackage', data);
}

// 根据选择的角色，获取对应角色的审批流（不同用户的审批流可能不一样）
const fetchWorkflow = (appId, userNames, roleIds, roleGroupIds) => {
  return postJSON('/v2/apply/getworkflows', {
    appId, userNames,
    roleIds, roleGroupIds,
  });
};

const fetchWorkflowByResource = (appId, userNames, dataIds, applyTypeIsFlag, applyTypeIsArea) => {
  let params = null;
  if (applyTypeIsFlag) {
    params = {
      appId, userNames,
      flagIds: dataIds
    }
  } else if (applyTypeIsArea) {
    params = {
      appId, userNames,
      areaIds: dataIds
    }
  } else {
    params = {
      appId, userNames,
      dataIds
    }
  }
  return postJSON('/v2/apply/getworkflows', params);
};
// const getPackage = () => {
//   return request('/v2/nopermission/giftBag/group');
// };
// const getCities = () => {
//   return request('/v2/nopermission/giftBag/area');
// };
// const getUserInfo = () => {
//   return request('/my/user/info');
// };
// const fetchWorkflow = () => {
//   return [
//     {
//       userName: 'test',
//     },
//   ];
// };
// const postAll = data => {
//   return postJSON('/v2/nopermission/giftBag/apply', data);
// };

export default {
  getPackageCountries,
  getCategoriesByCountry,
  getPackageByCondition,
  getPermissionsByPackageId,
  addPackage,
  // getPackage,
  // getCities,
  // getUserInfo,
  fetchWorkflow,
  fetchWorkflowByResource
  // postAll,
};
