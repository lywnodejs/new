import { get } from '../utils/request';

const getAdminusers = (params) => {
  return get('/admin/get/adminusers', {
    ...params,
    roleName: 'app_administrator'
  });
};

export {
  getAdminusers
};