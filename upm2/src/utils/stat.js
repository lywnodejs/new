/**
 * 前端埋点相关
 */
 // 记录开始审批时间
const startRecordApproveTime = function() {
  window.sessionStorage.setItem('StartApproveTime', Date.now());
};
// 计算审批耗时
const calcApproveTime = function() {
  const end = Date.now();
  let start = window.sessionStorage.getItem('StartApproveTime');
  let duration = 0;
  if (start) {
    start = parseInt(start);
    duration = (end - start) / 1000 / 60;
    duration = Math.ceil(duration);
  }
  // 更新开始时间
  window.sessionStorage.setItem('StartApproveTime', Date.now());
  return duration;
};

export default {
  startRecordApproveTime,
  calcApproveTime
};