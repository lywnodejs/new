import { addBaseHostPrefix } from '@/utils/data';
import { request } from './request';

export const API = addBaseHostPrefix({
  searchLogList: '/staff/logs/searchLogs',
  strategyQueryList: '/staff/strategy/queryList',
  updateOnStatus: '/staff/strategy/updateOnStatus', // 启停接口
  deleteList: '/staff/strategy/delete', // 删除数据
  queryExecuteCount: '/staff/strategy/queryExecuteCount', // 查询命中范围
  insertOrUpdate: '/staff/strategy/insertOrUpdate', // 编辑或者新增策略
  getStrategyQueryDetail: '/staff/strategy/queryDetail', // 查询策略详情
  queryExecuteNames: 'staff/strategy/queryExecuteNames' // 查询名单
});

// 日志表格list
export const searchLogList = params => {
  return request.post(API.searchLogList, {
    data: params,
  });
};

// 策略列表接口
export const strategyQueryList = params => {
  return request.post(API.strategyQueryList, {
    data: params,
  });
};

export const updateOnStatus = params => {
  return request.post(API.updateOnStatus, {
    data: params,
  });
};

export const deleteList = params => {
  return request.post(API.deleteList, {
    data: params,
  });
};

export const queryExecuteCount = params => {
  return request.post(API.queryExecuteCount, {
    data: params,
  });
};

export const insertOrUpdate = params => {
  return request.post(API.insertOrUpdate, {
    data: params,
  });
};

export const getStrategyQueryDetail = params => {
  return request.post(API.getStrategyQueryDetail, {
    data: params,
  });
};

export const queryExecuteNames = params => {
  return request.post(API.queryExecuteNames, {
    data: params,
  });
};