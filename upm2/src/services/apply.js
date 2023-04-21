// 申请相关的 接口服务
import request, { postJSON } from '../utils/request';

// 获取申请详情
const fetchApplyDetail = (applyId) => {
  return postJSON('/v2/user/apply/detail', {
    applyId,
  });
};

const getApplyList = (params) => {
  return request('/v2/my/apply/list', {
    params
  });
};

const recallApply = (params) => {
  return postJSON('/v2/user/withdraw', params);
};

// 催办
const pressApprover = (data) => {
  return postJSON('/remind/approvers', data);
};

export {
  recallApply,
  getApplyList,
  fetchApplyDetail,
  pressApprover
};
