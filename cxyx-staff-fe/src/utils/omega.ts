import OmegaTracker from '@didi/omega-tracker';
import { getUserName } from '@/utils/auth';

// 线上应用埋点
const OmegaOnline = OmegaTracker.getTracker({
  appKey: 'omega2dfdb0f099',
  autoPosition: false,
  autoClick: false,
});
OmegaOnline.setUserName(getUserName()); // 在业务中获取到的用户名信息

const commonParams = {
  env: process.env.NODE_ENV,
  user: getUserName(),
};

/**
 * 埋点命名规范和属性命名规范
 * http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=250154484
 */
const OMEGA_BUSINESS_PREFIX = 'chengxinyouxuan_staff'; // 业务线名称，作为前缀，不可修改
const NAME_MAX_LENGTH = 60; // 除去 前缀和后缀后的 埋点名长度
const ACTION_MAP = {
  // 动作类型，作为后缀，不可修改
  click: 'ck', // 点击
  show: 'sw', // 展现
  slide: 'sd', // 滑动
  enter: 'en', // 进入
  exit: 'ex', // 退出
  background: 'bt', // 后台触发
};

// 全局埋点事件
const GLOBAL_EVENT_MAP = {
  api: `${OMEGA_BUSINESS_PREFIX}_api_all_${ACTION_MAP.background}`,
  route: `${OMEGA_BUSINESS_PREFIX}_route_all_${ACTION_MAP.enter}`,
};

const sendOmegaLog = (key, attrs, eventLabel = 'staff') => {
  const params = { ...commonParams, ...attrs };
  if ('staff.chengxinyouxuan.com' === location.host) {
    OmegaOnline.trackEvent(key, eventLabel, params);
  }
};

const sendOmegaApiLog = (url, attrs) => {
  attrs = { ...attrs, url };
  sendOmegaLog(formatKey(url, ACTION_MAP.background), attrs);
  sendOmegaLog(GLOBAL_EVENT_MAP.api, attrs); // API 总埋点
};

const sendOmegaRouteLog = (url, attrs) => {
  attrs = { ...attrs, url };
  sendOmegaLog(formatKey(url, ACTION_MAP.enter), attrs);
  sendOmegaLog(GLOBAL_EVENT_MAP.route, attrs); // 路由总埋点
};

// 格式化埋点名（去重、合法）
const formatKey = (url = '', action = ACTION_MAP.background) => {
  let paramStr = url.toLowerCase();
  paramStr = paramStr.replace('-', '_');
  paramStr = paramStr.split('?')[0]; // 去除 URL 参数后缀
  paramStr = paramStr.replace(/[^a-z/_]/g, ''); // 去除特殊字符
  if (paramStr.length > NAME_MAX_LENGTH) {
    paramStr = paramStr.slice(
      paramStr.length - NAME_MAX_LENGTH,
      paramStr.length - 1,
    );
  }
  let paramArr = paramStr.split('/').filter(Boolean);
  if (1 === paramArr.length) {
    // 保留 404 等一级路由
    paramArr[0] = 'prefix_' + paramArr[0];
  } else {
    paramArr = paramArr.filter(item => item && !parseInt(item)); // 去除 REST 风格中的 ID
    if (1 === paramArr.length) {
      // 兼容 create/123 形式路由
      paramArr[0] = 'prefix_' + paramArr[0];
    }
  }
  return [OMEGA_BUSINESS_PREFIX, ...paramArr, action].join('_');
};

export { sendOmegaApiLog, sendOmegaRouteLog };
