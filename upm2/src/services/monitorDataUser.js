// import request, { postJSON } from '../utils/request';
import request from '../utils/pureRequest';
import { postJSON } from '../utils/request';

const getUserList = () => {
  return request('/teamMembers');
}

const getBusnessLineList = () => {
  return request('/busnessLineList');
}

const getUserInfo = (username) => {
  return request('/userInfo', { username });
}

const copyGroups = (params) => {
  return postJSON('/copyGroups', params)
}

export default {
  getUserList,
  getBusnessLineList,
  getUserInfo,
  copyGroups
};
