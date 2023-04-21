/**
 * 用户变更权限查询
 */
import request from '../utils/request';

// 查询 changelog
const queryLog = (params) => {
  return request('/v2/changelog/query', { params });
};

// 查询 changelog 详情
const getLogDetail = ({logId, page = 1, size}) => {
  return request('/v2/changelog/detail', {
    params: {
      logId,
      page,
      size
    }
  });
};

export {
  queryLog,
  getLogDetail
};
