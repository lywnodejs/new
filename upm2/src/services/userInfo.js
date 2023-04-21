import request, { postJSON } from '../utils/request';

const getUserInfo = () => {
  return request('/my/user/info');
};

const getUserGuide = () => {
  return request('/v2/data/guide/shouldDisplay');
};

const postUserGuided = () => {
  return postJSON('/v2/data/guide/recordDisplay');
};

const shouldDisplay = () => {
  return request('/v2/data/info/show?key=long_visit_app');
}

export {
  getUserInfo,
  getUserGuide,
  postUserGuided,
  shouldDisplay
};
