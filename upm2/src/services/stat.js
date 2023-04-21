// 统计埋点相关
import request, { postJSON } from '../utils/request';

// 新申请埋点
/**
 * uri: old-apply(老版), new-apply(新版)
 * applyStatus: 0(未完成), 1(完成)
 */
const reportNewApply = (data) => {
  return postJSON('/report/event', {...data});
};

/**
 * 审批时长埋点
 * uri: old-approval-time(老版)，new-approval-time(新版)
 * applyStatus: 审批耗时，分钟
 */
const reportEvent = (data) => {
  return postJSON('/report/event', {...data});
};

export {
  reportNewApply,
  reportEvent
};
