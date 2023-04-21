/**
 * Created by ztian on 16/10/9.
 */
var Config = require('./config-base');
module.exports = new Config({
  local: {
    semanticApiService: 'http://semantic-api-service:31001', // 小E 主要api
    // semanticApiService: 'http://staging.robot.jinhui001.com:31001',
    // semanticApiService: 'http://robot.rxhui.com/robot/semantic/semantic-api-service',
    // semanticApiService: 'http://ali-module.rxhui.com/robot/semantic/semantic-api-service',
    stockAnalysisService: 'http://stock-analysis-service:31001',
    logService: 'http://10.0.0.21:9097',
    nodeService: 'http://10.0.0.22:10029', // 模板服务
    // reportService: 'http://10.0.0.22:10030', // 报告服务
    reportService: 'http://node-report-generator:31001',
    reportUrl: 'http://10.0.0.22:10030', // 用来引用报告中的资源，如css等
    semanticDataCenterService: 'http://semantic-datacenter-service:31001',
    infoService: 'http://info.zq88.cn:9085', // 资讯
    eduDomain: 'http://edu.hczq.com', // 投资教育域名
    quota: 'http://quota.zq88.cn', // 行情
    host: 'http://127.0.0.1:9097',
    resource: "http://127.0.0.1:9097",
    redis: {
      port: 7000,
      host: "127.0.0.1:9097",
      pws: 'GemanticYes!'
    },
    jy: 'https://jy.hczq.com',
    cookieOptions: {
      maxAge: 86400 * 30,
      domain: '.rhhui.com'
    },
    logLevel: "info",
    // robotResource: 'dist', // 用来区分资源，本地使用原文件(source)，服务器上使用构建后的(dist)
    robotResource: 'source' // 用来区分资源，本地使用原文件(source)，服务器上使用构建后的(dist)
  },
  dev: {
    semanticApiService: 'http://semantic-api-service:31001',
    stockAnalysisService: 'http://stock-analysis-service:31001',
    semanticDataCenterService: 'http://semantic-datacenter-service:31001',
    infoService: 'http://info.zq88.cn:9085',
    eduDomain: 'http://edu.hczq.com', // 投资教育域名
    nodeService: 'http://node-template-generator:31001',
    reportService: 'http://node-report-generator:31001',
    reportUrl: 'http://10.0.0.22:10030',
    logService: 'http://10.0.0.21:9097',
    quota: 'http://quota.zq88.cn',
    host: 'http://10.0.0.22:10033',
    resource: "http://10.0.0.22:10033",
    redis: {
      port: 7000,
      host: "127.0.0.1:9097",
      pws: 'GemanticYes!'
    },
    jy: 'https://jy.hczq.com',
    cookieOptions: {
      maxAge: 86400 * 30,
      domain: '.rhhui.com'
    },
    logLevel: "info",
    robotResource: 'dist'
  },
  staging: {
    semanticApiService: 'http://semantic-api-service:31001',
    stockAnalysisService: 'http://stock-analysis-service:31001',
    infoService: 'http://info.zq88.cn:9085',
    eduDomain: 'http://edu.hczq.com', // 投资教育域名
    logService: 'http://10.0.0.21:9097',
    semanticDataCenterService: 'http://semantic-datacenter-service:31001',
    quota: 'http://quota.zq88.cn',
    nodeService: 'http://node-template-generator:31001',
    reportService: 'http://node-report-generator:31001',
    reportUrl: 'http://reports.jinhui001.com',
    host: 'http://staging.robot2.jinhui001.com/node/robot/',
    resource: "http://10.0.0.105:10033", //
    redis: {
      port: 7000,
      host: "10.0.0.134",
      pws: 'GemanticYes!'
    },
    jy: 'https://jy.hczq.com',
    cookieOptions: {
      maxAge: 86400 * 30,
      domain: '.rhhui.com'
    },
    logLevel: "info",
    robotResource: 'dist'
  },
  production: {
    semanticApiService: 'http://semantic-api-service:31001',
    stockAnalysisService: 'http://stock-analysis-service:31001',
    infoService: 'http://info.zq88.cn:9085',
    eduDomain: 'http://edu.hczq.com', // 投资教育域名
    nodeService: 'http://node-template-generator:31001',
    reportService: 'http://node-report-generator:31001',
    reportUrl: 'https://stock-report.rxhui.com',
    semanticDataCenterService: 'http://semantic-datacenter-service:31001',
    logService: 'http://node-log.rxhui.com',
    quota: 'http://quota.zq88.cn',
    host: 'https://robot-module.rxhui.com',
    resource: "https://robot-module.rxhui.com",
    redis: {
      port: 7000,
      host: "192.168.1.184",
      pws: 'GemanticYes!'
    },
    jy: 'https://jy.hczq.com',
    cookieOptions: {
      maxAge: 86400 * 30,
      domain: '.rhhui.com'
    },
    logLevel: "info",
    robotResource: 'dist'
  },
  ali: {
    semanticApiService: 'http://semantic-api-service:31001',
    stockAnalysisService: 'http://stock-analysis-service:31001',
    infoService: 'http://info.zq88.cn:9085',
    eduDomain: 'http://edu.hczq.com', // 投资教育域名
    nodeService: 'http://node-template-generator:31001',
    reportService: 'http://node-report-generator:31001',
    reportUrl: 'https://stock-report.rxhui.com',
    semanticDataCenterService: 'http://semantic-datacenter-service:31001',
    logService: 'http://node-log.rxhui.com',
    quota: 'http://quota.zq88.cn',
    host: 'http://ali-module.rxhui.com',
    resource: "http://ali-module.rxhui.com",
    redis: {
      port: 7000,
      host: "192.168.1.184",
      pws: 'GemanticYes!'
    },
    jy: 'https://jy.hczq.com',
    cookieOptions: {
      maxAge: 86400 * 30,
      domain: '.rhhui.com'
    },
    logLevel: "info",
    robotResource: 'dist'
  },
  logDir: process.cwd() + '/../logs/',
});
