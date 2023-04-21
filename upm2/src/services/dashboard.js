import request, {
  postJSON
} from '../utils/request';

const getCompleteRatio = (params) => {
  return request('/v2/data/getCompleteRatio', { params });
};

const getWeeklyReport = (params) => {
  return request('/v2/data/getWeeklyReport', { params });
};

const getLazyApplies = (params) => {
  return request('/v2/data/getLazyApplies', { params });
};

const getRankingListByApplyTime = () => {
  return request('/v2/data/getRankingListByApplyTime');
};

const getRankingListByComplete = () => {
  return request('/v2/data/getRankingListByComplete');
};

const getAppRank = (params) => {
  return request('/v2/data/getAppRank', { params });
};

const getDeptRankListByComplete = () => {
  return request('/v2/data/dept/getRankingListByComplete');
};

const getDeptRankingListByApplyTime = () => {
  return request('/v2/data/dept/getRankingListByApplyTime');
};

/**
 * 获取实时统计数据
 * @param {*} params
 */
const getRealTimeStats = (params) => {
  // return {
  //   "roleCount": 10, //角色总数
  //   "redundancy": '34.56%', //权限冗余度
  //   "workflowCount": 2 // 审批流总数
  // }
  return request('/v2/data/getRealTimeStats', { params });
};

/**
 * 权限分布统计
 */
const getOpsData = (params) => {
  // return [
  //   {
  //     "dateTime": 1562515200000,
  //     "roleCount": "13", // 角色总数
  //     "sensitiveRoleCount": "5", //敏感角色总数
  //     "featureCount": "117", // 权限点总数
  //     "sensitiveFeatureCount": "1", //敏感权限点总数
  //     "sensitiveUserCount": "3", //敏感权限总人数
  //     "featureUserCount": "10"//权限总人数
  //   },
  //   {
  //     "dateTime": 1562601600000,
  //     "roleCount": "10",
  //     "sensitiveRoleCount": "6",
  //     "featureCount": "117",
  //     "sensitiveFeatureCount": "1",
  //     "sensitiveUserCount": "3",
  //     "featureUserCount": "15"
  //   },
  //   {
  //     "dateTime": 1562688000000,
  //     "roleCount": "13",
  //     "sensitiveRoleCount": "7",
  //     "featureCount": "117",
  //     "sensitiveFeatureCount": "1",
  //     "sensitiveUserCount": "3",
  //     "featureUserCount": "18"
  //   }
  // ]
  return request('/v2/data/getOpsData', { params });
};

/**
 * 下载权限分布统计数据
 * @param {*} params
 */
const downloadOpsStats = (params) => {
  return request('/v2/data/downloadOpsStats', { params });
};

/**
 * 权限使用统计
 * @param {*} params
 */
const getRedundancyData = (params) => {
  return request('/v2/data/apply/getRedundancyData', { params });
};

/**
 * 获取某系统冗余的角色
 * @param {*} params
 */
const getRedundantRoles = (params) => {
  return request('/v2/data/apply/getRedundantRoles', { params });
};

/**
 * 审批流使用统计
 * @param {*} params
 */
const getApplyStat = (params) => {
  return request('/v2/data/apply/getApplyStat', { params });
};

/**
 * 审批流完成时间排行
 * @param {*} params
 */
const getFlowData = (params) => {
  return request('/v2/data/apply/getFlowData', { params });
};

/**
 * 审批节点最慢详情Top20
 * @param {*} params
 */
const getInfoDetails = (params) => {
  return request('/v2/data/apply/getInfoDetails', { params });
};


export {
  getCompleteRatio,
  getWeeklyReport,
  getLazyApplies,
  getRealTimeStats,
  getRankingListByApplyTime,
  getRankingListByComplete,
  getAppRank,
  getDeptRankListByComplete,
  getDeptRankingListByApplyTime,
  getOpsData,
  downloadOpsStats,
  getRedundancyData,
  getRedundantRoles,
  getApplyStat,
  getFlowData,
  getInfoDetails
};
