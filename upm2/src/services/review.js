import request from '../utils/request';
import { postJSON } from '../utils/request';

const getAppPermissionReviewList = (params) => {
  return request('/my/available/app/permissionReviewList', { params });
};
const getSubordinate = (params) => {
  return request('/v2/my/user/sub', { params });
};

const fetchPermissionCount = (params) => {
  return request('/v2/my/permissionreview/count', { params });
};

const fetchPermissionList = (params) => {
  return request('/v2/my/permissionreview/permissions', { params });
};

const permissionClose = (params) => {
  return postJSON(`/v2/my/permissionreview/closenow?username=${params.username}`, params.data);
};

const fetchReviewList = (params) => {
  // return request('/v2/permissionreview/getListPaged', {params});
  return request('/v2/permissionreview/getListPagedByManager', { params });
};

const fetchReviewUserList = (params) => {
  // return request('/v2/permissionreview/userlist', {params});
  return request('/v2/permissionReviewUser/userlist', { params });
};

const fetchReviewUserPermissionCount = (params) => {
  return request('/v2/permissionreview/count', { params });
};

const fetchReviewUserPermissionList = (params) => {
  return request('/v2/permissionreview/permissions', { params });
};

const reviewClose = (params) => {
  return postJSON('/v2/permissionreview/close?appId=888', params);
};

const reviewOpen = (params) => {
  return postJSON('/v2/permissionreview/open?appId=888', params);
};

const reviewConfirm = (params) => {
  return request('/v2/permissionreview/finish/user/closedPermissionList', { params });
  // return request('/v2/permissionreview/permissions', {params});
};

const reviewCloseCount = params => {
  return request('/v2/permissionreview/finish/user/closedPermissionCount', { params });
};

const reviewOpenConfirm = (params) => {
  return request('/v2/permissionreview/finish/user/openedPermissionList', { params });
};

const reviewOpenCount = params => {
  return request('/v2/permissionreview/finish/user/openedPermissionCount', { params });
};

const reviewSubmit = (params) => {
  // const { username, permissionReviewId, appId, reviewComment} = params;
  // return postJSON(`/v2/permissionreview/finish/user/submit?appId=${appId}&permissionReviewId=${permissionReviewId}&username=${username}&reviewComment=${reviewComment}`);
  return postJSON('/v2/permissionreview/finish/user/submit', params);
};

const fetchMyApproveList = (params) => {
  return request('/v2/permissionreview/approve/getListPagedByApprover', { params });
};

const fetchApproveUserList = (params) => {
  // return request('/v2/permissionreview/userlist', {params});
  return request('/v2/permissionReviewUser/approve/userlist', { params });
};

const fetchApproveUserPermissionCount = (params) => {
  return request('/v2/permissionreview/approve/permissions/count', { params });
};

const fetchApproveUserPermissionList = (params) => {
  return request('/v2/permissionreview/approve/permissions', { params });
};

const closeApproveConfirmList = (params) => {
  return request('/v2/permissionreview/approve/finish/user/closedPermissionList', { params });
};
const closeApproveCount = (params) => {
  return request('/v2/permissionreview/approve/finish/user/closedPermissionCount', { params });
};
const openApproveConfirmList = (params) => {
  return request('/v2/permissionreview/approve/finish/user/openedPermissionList', { params });
};
const openApproveCount = (params) => {
  return request('/v2/permissionreview/approve/finish/user/openedPermissionCount', { params });
};

const approveSubmit = (params) => {
  return postJSON('/v2/permissionreview/approve/finish/user/submit', params);
};

// 获取当前类型权限将要保留和删除的数量
const fetchPermissionNum = (params) => {
  return request('/v2/permissionreview/permission/summary', { params });
};

// 某用户的地区权限树–获取
const reviewUserAreaTree = (params) => {
  return request('/v2/permissionreview/permissions/area-tree', { params });
};

// 某用户的地区权限树–提交
const reviewUserSubmitAreaTree = (params) => {
  return postJSON('/v2/permissionreview/area-tree/submit?appId=888', params);
};

export default {
  getSubordinate,
  fetchPermissionCount,
  fetchPermissionList,
  permissionClose,
  fetchReviewList,
  fetchReviewUserList,
  fetchReviewUserPermissionCount,
  fetchReviewUserPermissionList,
  reviewClose,
  reviewOpen,
  reviewConfirm,
  reviewOpenConfirm,
  reviewCloseCount,
  reviewOpenCount,
  reviewSubmit,
  getAppPermissionReviewList,
  fetchMyApproveList,
  fetchApproveUserList,
  fetchApproveUserPermissionCount,
  fetchApproveUserPermissionList,
  closeApproveConfirmList,
  closeApproveCount,
  openApproveConfirmList,
  openApproveCount,
  approveSubmit,
  fetchPermissionNum,
  reviewUserAreaTree,
  reviewUserSubmitAreaTree
};
