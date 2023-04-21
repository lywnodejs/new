import { postJSON } from '../utils/request';
import request from '../utils/request';

const fetchPermissionGroup = (params) => {
  return request('/v2/privilegeGroup/findall', {params});
};

const addPermissionGroup = (params) => {
  return postJSON('/v2/privilegeGroup/add', params);
}

const removePermissionGroup = (params) => {
  return postJSON('/v2/privilegeGroup/remove', params);
}

const modifyPermissionGroup = (params) => {
  return postJSON('/v2/privilegeGroup/update', params);
}

const fetchGroup2User = (params) => {
  return request('/v2/privilegeGroup/user/findall', {params})
}

const bindUsers = (params) => {
  return postJSON('/v2/privilegeGroup/bindUsers', params);
}

const unBindUsers = (params) => {
  return postJSON('/v2/privilegeGroup/unbindUsers', params);
}

const fetchBindPermissionSystem = (params) => {
  return request('/v2/privilegeGroup/app/findall', {params});
}

const fetchPermissionSystemAndPoint = (params) => {
  return request('/v2/privilegeGroup/data', {params});
}

const fetchAllPermissionPoint = (params) => {
  return request('/v2/privilegeGroup/app/point/findall', {params});
}

const managePermissionPoint = (params) => {
  return postJSON('/v2/privilegeGroup/managePrivilegeGroup', params);
}

export default {
  fetchPermissionGroup,
  addPermissionGroup,
  removePermissionGroup,
  modifyPermissionGroup,
  fetchGroup2User,
  bindUsers,
  unBindUsers,
  fetchBindPermissionSystem,
  fetchPermissionSystemAndPoint,
  fetchAllPermissionPoint,
  managePermissionPoint
}
