import request from '../utils/request';


const getMyMenus = (params) => {
  return request('/v2/my/app/menu', { params });
};

export default {
  getMyMenus
};
