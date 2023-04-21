import request, { postJSON } from '../utils/request';

const getWorkflowList = (params) => {
  // return request('/workflow/info/list', {params});
  return request('/v2/workflow/upmbpm/findAll', {params});
};

const getWorkflowListOld = (params) => {
  return request('/workflow/info/list', {params});
};

const updateFlow = (params) => {
  return postJSON('/workflow/info/update', params);
};

// 配置
const configFlow = (params) => {
  return postJSON('/v2/workflow/upmbpm/config', params);
};

const newFlow = (params) => {
  return postJSON('/workflow/info/insert', params);
};

const deleteFlow = (params) => {
  return postJSON('/workflow/info/delete', params);
};

const unbindFlow = (params) => {
  return postJSON('/v2/workflow/upmbpm/unbind', params);
};

const getAllBusniss = (params) => {
  return request('/app/business/withall', { params });
};

const getAllArea = (params) => {
  return request('/app/area/withall', { params });
};

const getAllRole = (params) => {
  return request('/app/role/withall', { params });
};

const getAllRolegroup = (params) => {
  return request('/app/rolegroup/withall', { params });
};

const getAllFlag = (params) => {
  return request('/app/flag/withall', { params });
};

const getWorkflowInfo = (params) => {
  return request('/v2/user/apply/forecast-bpm',{params})
}

export default {
  getWorkflowList,
  getWorkflowListOld,
  updateFlow,
  configFlow,
  deleteFlow,
  unbindFlow,
  getAllBusniss,
  getAllArea,
  getAllRole,
  getAllRolegroup,
  getAllFlag,
  newFlow,
  getWorkflowInfo
};
