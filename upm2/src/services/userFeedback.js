import request, {
  postJSON
} from '../utils/request';

//获取反馈列表
const fetchFeedbackList = (params) => {
  return request('/nps/getFeedBack', { params });
};

//新增反馈跟踪
const addFeedbackTrack = (params) => {
  return postJSON('/app/batch/update', params);
};

//删除一条跟踪反馈
const deleteFeedbackTrack = (params) => {
  return postJSON('/nps/npsTracking/delete?' + 'id=' + params.id + '&appId=' + params.appId);
};

//根据nps查询反馈记录
const fetchFeedbackRecord = (params) => {
  return request('/nps/npsTracking/queryAll', { params });
};

// 获取nps分数列表
const fetchNpsGradeList = () => {
  return request('/nps/getGradeList');
}

export {
  fetchFeedbackList,
  addFeedbackTrack,
  deleteFeedbackTrack,
  fetchFeedbackRecord,
  fetchNpsGradeList
};