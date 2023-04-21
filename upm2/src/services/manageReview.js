import request from '../utils/request';
import { postJSON } from '../utils/request';
const permissionReviewEdit = (params) => {
  return postJSON('/v2/permissionreview/edit',  params );
};
const permissionReviewShow = (params) => {
  return request('/v2/permissionreview/show', { params });
};
const fetchReviewHistory = (params) => {
  return request('/v2/permissionreview/getListPagedByAdmin/records', { params });
}
const getList = (params) => {
  return request('/v2/permissionreview/getListPagedByAdmin/config', { params });
}

const fetchPermissionCount = (params) => {
  return request('/v2/my/permissionreview/count', {params});
};

const fetchPermissionList = (params) => {
  return request('/v2/my/permissionreview/permissions', {params});
}

const permissionClose = (params) => {
  return postJSON(`/v2/my/permissionreview/closenow?username=${params.username}`, params.data);
}

const getDept = (params) => {
  return request(`/my/dept/search/${params.word}`);
}

const addReview = (params) => {
  return postJSON('/v2/permissionreview/submit', params);
}

const getReviewDetail = (params) => {
  return request('/v2/permissionreview/detail', {params});
}

const getReviewManagers = (params) => {
  return request('/v2/permissionreview/detail/managers', {params});
}

const notice = (params) => {
  return postJSON('/v2/permissionreview/detail/managers/urge', params);
}

const getReviewAppList = (params) => {
  return request('/my/available/app/permissionReviewList', {params});
}
const startReview = (params) => {
  return postJSON('/v2/permissionreview/start',params);
}
const refreshReview = (params) => {
  return postJSON('/v2/permissionreview/refresh',params);
}
const copyReview = (params) => {
  return postJSON('/v2/permissionreview/copy',params);
}
const deleteReview = (params) => {
  return postJSON('/v2/permissionreview/delete',params);
}

const approveNotice = (params) => {
  return postJSON('/v2/permissionreview/detail/approver/urge ', params);
}

export default {
  getList,
  fetchPermissionCount,
  fetchPermissionList,
  permissionClose,
  getDept,
  addReview,
  getReviewDetail,
  getReviewManagers,
  notice,
  getReviewAppList,
  startReview,
  deleteReview,
  refreshReview,
  copyReview,
  permissionReviewShow,
  fetchReviewHistory,
  permissionReviewEdit,
  approveNotice
};
