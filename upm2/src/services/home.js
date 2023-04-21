import request, { postJSON } from '../utils/request';

function randomCount(base = 10) {
  return Math.floor(base * Math.random()) || null
}

/**
 * 近30天变更权限
 */
const fetchDataChanged = () => {
  return request('/index/data/changed', { params: { appId: 888 } });
  // return {
  //   "roleCount": randomCount(), //角色数
  //   "areaCount": randomCount(), //地区数
  //   "flagCount": randomCount(), //标识位数
  //   "tableauWorkBookCount": randomCount(), // Tableau-工作簿数
  //   "indicatorCount": randomCount(), // 指标数
  //   "reportCount": randomCount(), //数易-报表数
  //   "extractionToolCount": randomCount() //提取工具-模板数
  // }
}

/**
 * 申请中权限
 */
const fetchDataApplying = () => {
  return request('/index/data/applying', { params: { appId: 888 } });
  // return {
  //   "roleCount": randomCount(), //角色数
  //   "areaCount": randomCount(), //地区数
  //   "flagCount": randomCount(), //标识位数
  //   "tableauWorkBookCount": randomCount(), // Tableau-工作簿数
  //   "indicatorCount": randomCount(), // 指标数
  //   "reportCount": randomCount(), //数易-报表数
  //   "extractionToolCount": randomCount() //提取工具-模板数
  // }
}

/**
 * 近30天到期权限
 */
const fetchDataExpiring = () => {
  return request('/index/data/expiring', { params: { appId: 888 } });
  // return {
  //   "roleCount": randomCount(), //角色数
  //   "areaCount": randomCount(), //地区数
  //   "flagCount": randomCount(), //标识位数
  //   "tableauWorkBookCount": randomCount(), // Tableau-工作簿数
  //   "indicatorCount": randomCount(), // 指标数
  //   "reportCount": randomCount(), //数易-报表数
  //   "extractionToolCount": randomCount() //提取工具-模板数
  // }
}

/**
 * 已到期权限
 */
const fetchDataExpired = () => {
  return request('/index/data/expired', { params: { appId: 888 } });
  // return {
  //   "roleCount": randomCount(), //角色数
  //   "areaCount": randomCount(), //地区数
  //   "flagCount": randomCount(), //标识位数
  //   "tableauWorkBookCount": randomCount(), // Tableau-工作簿数
  //   "indicatorCount": randomCount(), // 指标数
  //   "reportCount": randomCount(), //数易-报表数
  //   "extractionToolCount": randomCount() //提取工具-模板数
  // }
}

/**
 * 待审批列表
 */
const fetchData2Approve = () => {
  return request('/index/data/toApprove', { params: { appId: 888 } });
  // return {
  //   "toApproveCount": randomCount(), // 待审批数
  //   "longestWaitTime": randomCount(2 * 24 * 60), // 最长等待时间
  //   "avgApproveTime": 10 * 24 * 60 + 18, // 平均审批时间
  // }
}

/**
 * 待Review权限列表
 */
const fetchData2Review = () => {
  return request('/index/data/toReview', { params: { appId: 888 } });
}

/**
 * 我的系统
 */
const fetchDataManage = (params) => {
  return request('/index/data/manage', { params });
}

/**
 * 我的团队
 */
const fetchDataTeam = () => {
  return request('/index/data/team', { params: { appId: 888 } });
}

/**
 * 我的模块
 */
const fetchModules = () => {
  return request('/index/data/myModules', { params: { appId: 888 } });
}

export {
  fetchDataChanged,
  fetchDataApplying,
  fetchDataExpiring,
  fetchDataExpired,
  fetchData2Approve,
  fetchData2Review,
  fetchDataManage,
  fetchDataTeam,
  fetchModules
}
