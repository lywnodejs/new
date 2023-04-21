const { host } = location;
import { message } from 'antd';

// 环境-后端接口映射
export const HOST_MAP = {
  LOCAL: 'local_proxy', // 本地走webpack代理，配置见 /config/proxy.js
  TEST: `//${host}`,
  GW_TEST: `//gw-wj-test.chengxinyouxuan.com`,
  // GW_TEST: `//gateway-test04.chengxinyouxuan.com`,
  // TEST: `//10.96.77.141:8080`, // 测试
  SIM01: `//gw-wj-sim01.chengxinyouxuan.com`, // 仿真
  PRE: `//gw-wj-pre.chengxinyouxuan.com`, // 预发
  ONLINE: `//gw-wj.chengxinyouxuan.com`, // 线上
  MOCK: '//mock.xiaojukeji.com/mock/4463', // DMock
};

// 前端域名-后端接口映射
export const HOST_API_MAP = {
  // 开发
  // 'localhost:8000': HOST_MAP.LOCAL, //勿改
  'localhost:8000': HOST_MAP.TEST, //勿改
  [`staff-mock.chengxinyouxuan.com`]: HOST_MAP.MOCK,
  // 测试
  [`staff-test01.chengxinyouxuan.com`]: HOST_MAP.GW_TEST,
  [`staff-test02.chengxinyouxuan.com`]: HOST_MAP.GW_TEST,
  [`staff-test03.chengxinyouxuan.com`]: HOST_MAP.GW_TEST,
  [`staff-test04.chengxinyouxuan.com`]: HOST_MAP.GW_TEST,
  // 预发
  [`staff-pre.chengxinyouxuan.com`]: HOST_MAP.PRE,
  // 线上
  [`staff.chengxinyouxuan.com`]: HOST_MAP.ONLINE,
};

// 根据前端域名映射后端请求的接口根路径(前端-后端)
const getApiBaseUrl = () => {
  return HOST_API_MAP[host] || HOST_MAP.GW_TEST;
};

export const getResponseData = res => {
  if (res) {
    if (0 == res.errno) {
      return res.data;
    } else {
      message.error(res.errmsg);
      return false;
    }
  }
  return false;
};

//api baseHost
export const baseHost = `${getApiBaseUrl()}`;
