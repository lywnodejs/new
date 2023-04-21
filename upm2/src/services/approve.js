import request, { postJSON } from '../utils/request';

const getApprove = params => {
  return postJSON('/v2/my/approve/list2', { ...params });
};

const passApprove = data => {
  return postJSON('/v2/approve/agree', {
    ...data
  });
};

const rejectApprove = data => {
  return postJSON('/v2/approve/disagree', {
    ...data
  });
};

const batchPassApprove = data => {
  return postJSON('/v2/approve/agreeAll', data);
};

const batchRejectApprove = data => {
  return postJSON('/v2/approve/disagreeAll', data);
};

// 获取审批详情页数据（其实是申请详情数据）
const fetchApproveDetail = approveId => {
  return postJSON('/v2/user/approve/detail', {
    approveId
  });
};

const fetchApproveWorkflow = approveId => {
  return {};
};

const getApprove2 = params => {
  return postJSON('/v2/my/approve/list2', { ...params });
};

// 是否显示反馈弹窗
const isShowFeedbackModal = () => {
  return request('/approve/feedback/shouldDisplay?category=3');
};

// 记录用户已经弹了一次
const sendApproveNps = params => {
  return postJSON('/approve/feedback/recordDisplay', { ...params });
};

export {
  getApprove,
  passApprove,
  rejectApprove,
  fetchApproveDetail,
  fetchApproveWorkflow,
  batchPassApprove,
  batchRejectApprove,
  getApprove2,
  isShowFeedbackModal,
  sendApproveNps
};
