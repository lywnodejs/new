import request from '../utils/request';

// 查询 oplog
const queryLog = (params) => {
  return request('/v2/auditlog/list/auditlog', { params });
};

// 查询 changelog 详情
const logSetting = () => {
  return request('/auditlog/list/config');
};

export {
  queryLog,
  logSetting
};
