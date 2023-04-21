import request, { postJSON } from '../utils/request';

const getUserAreas = (data) => {
  return request('/v2/apply/getUserAreas', { params: data });
};

const applyAreaPermission = (data) => {
  return postJSON('/v2/apply/add', data);
};

export {
  getUserAreas,
  applyAreaPermission
};
