import request, { postJSON } from '../utils/request';

const getPackage = () => {
  return request('/v2/nopermission/giftBag/group');
};
const getCities = () => {
  return request('/v2/nopermission/giftBag/area');
};
const getUserInfo = () => {
  return request('/my/user/info');
};
const fetchWorkflow = () => {
  return [
    {
      userName: 'test',
    },
  ];
};
const postAll = data => {
  return postJSON('/v2/nopermission/giftBag/apply', data);
};
export default {
  getPackage,
  getCities,
  getUserInfo,
  fetchWorkflow,
  postAll,
};
