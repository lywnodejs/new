import request, { postJSON } from '../utils/monitorRequest';
import pureRequest from '../utils/pureRequest';


const defaultParams = {
  appId: 888
};

const getGroups = () => {
  return request('/v2/privilegeGroup/monitor/findall', { params: Object.assign({}, defaultParams) });
};

const deleteGroup = (data) => {
  return postJSON('/v2/privilegeGroup/monitor/removeGroup', data, { params: Object.assign({}, defaultParams) });
};

const getOdinNSTree = (params) => {
  return request('/v2/privilegeGroup/monitor/findOdinTree', { params });
};

const getOdinApprover = (params) => {
  return request('/v2/privilegeGroup/monitor/findOdinApprovers', { params });
};

const getSysRR = (params) => {
  return request('/v2/privilegeGroup/monitor/findSysBR', { params: Object.assign(params, defaultParams) });
};

const addNewGroup = (data) => {
  return postJSON('/v2/privilegeGroup/monitor/add', data, { params: Object.assign({}, defaultParams) });
};

const getGroupInfo = (params) => {
  return request('/v2/privilegeGroup/monitor/findone', { params: Object.assign(params, defaultParams) });
};

const modifyGroup = (data) => {
  return postJSON('/v2/privilegeGroup/monitor/update', data, { params: Object.assign({}, defaultParams) });
};

export default {
  getGroups,
  deleteGroup,
  getOdinNSTree,
  getOdinApprover,
  getSysRR,
  addNewGroup,
  getGroupInfo,
  modifyGroup
};
