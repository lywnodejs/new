import request, { postJSON } from '../utils/request';

/**
 * 获取功能组列表
 */
const getfeatureGroupList = params => {
  return request('/featureGroup/select/like', { params });
};

const getRelevantFeature = params => {
  return request('/featureGroup/select/bindfeatures', { params });
};

const getRelevantRole = params => {
  return request('/featureGroup/select/bindroles', { params });
};

/**
 * 新增功能组
 * @param {*} featureGroup
 */
const createfeatureGroup = featureGroup => {
  return request('/featureGroup/insert/featuregroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(featureGroup)
  });
};

/**
 * 更新功能组
 */
const updatefeatureGroup = featureGroup => {
  return request('/featureGroup/update/featuregroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(featureGroup)
  });
};

/**
 * 删除功能组
 */
const removefeatureGroup = featureGroup => {
  return request('/featureGroup/delete/featuregroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(featureGroup)
  });
};

const relevantFeature = feature => {
  return request('featureGroup/insert/mutifeature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(feature)
  });
};

const relevantRole = role => {
  return request('featureGroup/insert/mutirole', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(role)
  });
};

//获取功能组的角色列表
const fetchGroupRoleList = (params) => {
  return postJSON('/featureGroup/role/list', params);
};
//功能组批量绑定角色
const insertMutirole = (params) => {
  return postJSON('/featureGroup/insert/mutirole', params);
};
// 获取功能组已绑定角色列表
const fetchBindGroupRoleList = (params) => {
  return request('/featureGroup/get/bind/roles', { params });
}
export default {
  getfeatureGroupList,
  createfeatureGroup,
  updatefeatureGroup,
  removefeatureGroup,
  getRelevantFeature,
  getRelevantRole,
  relevantFeature,
  relevantRole,
  fetchGroupRoleList,
  insertMutirole,
  fetchBindGroupRoleList
};
