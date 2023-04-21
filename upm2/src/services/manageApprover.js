import request, { postJSON } from '../utils/request';

/**
 * 获取区域审批人
 * @param {*} params
 */
const getApprover = (params) => {
  // return {
  //   "dataUsernames":['wangkangnone' , 'xxx'],
  //   "areaUseranmes":['wangkang',123]
  // }
  return request('/v2/area/areamanager/get', {params});
};

/**
 * 更新区域审批人
 * @param {*} params
 */
const updateApprover = (params) => {
  return postJSON('/v2/area/areamanager/update', params);
};

export {
  getApprover,
  updateApprover
}
