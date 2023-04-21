import request, { postJSON } from '../utils/request';

const getApps = () => {
  return request('/v2/resource/query/bindingResourceApps');
};

const getQueryList = (params) => {
  return request('/v2/resource/queryList', { params });
};

const getDataType = (params) => {
  return request('/v2/bigdata/type/resource', { params });
};

const getAttrValues = (params) => {
  return request('/v2/resource/getCertainAttrValues', { params });
};

const getBusiness = () => {
  return request('/business/select/all');
};

const getUserResource = (params) => {
  return request('/v2/user/resource/list', { params });
};

const relation = (params) => {
  return postJSON('/v2/resource/user/relation', params);
};

const getRelevantUsers = (params) => {
  return request('/v2/resource/user/query', {params});
};

export {
  getApps,
  getQueryList,
  getDataType,
  getAttrValues,
  getBusiness,
  getUserResource,
  relation,
  getRelevantUsers
}