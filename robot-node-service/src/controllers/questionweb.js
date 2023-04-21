
// 小E pc 版 赵波 2019.11.27
import {semanticApiService, stockAnalysisService} from '../service/index';
import config from "../config";

module.exports = {
  /**
   * 小E pc web版首页入口
   * @param req
   * @param res
   * @param next
   */
  async index (req, res, next) {
    // console.log(req)
    let appKey = req.query.appKey || '',
      robotId = req.query.robotId || '',
      preview = req.query.preview || 'production'; // test

    let eParams = {
      appKey: appKey, // 渠道
      robotId: robotId, // 机器人ID
      logoUrl: '', // 小E logo地址
      robotName: '', // 机器人名称
      isPC: true,
      disclaimer: '', // 免责声明地址
      disclaimerContent: '', // 免责声明内容
      skin: '', // 皮肤名称
      assetsUrl: '', // 阿里云资源域名
      windowType: req.query.windowType || '', // 航天云网是否为弹窗 // big
      reportUrl: config[process.env.NODE_ENV].reportUrl, // 报告的域名
      env: process.env.NODE_ENV, // 当前环境
      disclaimerAutoPopUp: true, // 免责声明初次进入是否自动弹出 V2
      cssLibVersion: '', // 阎延组件库CSS文件的版本号
      showIndexCarousel: true, // 是否显示首页轮播卡片 V2
      showQuestion: true, // 是否显示问题 V2
      showRateThumbs: true, // 是否显示踩，赞 V2
      showRecommendedQuestion: true, // 是否显示推荐问题（每个答案后） V2
      ifRecordQuestion: true, // 是否记录问过的问题 V2
      ifSupportSocketPush: false, // 是否支持主动推送 V2
      ifSupportWebAudio: false, // 是否支持WEB语音录入 V2
    }

    // 请求参数
    let configParams = {
      organization: appKey,
      robotId: robotId,
      preview: preview
    }

    // 读取配置
    let robotConfig = await semanticApiService.getRobotConfig(configParams).catch((error)=>{
      // console.log(error.response.status)
      // 如果出错，则直接展示页面
      res.render("index", eParams)
    })
    // console.log(robotConfig)

    // 赋值
    if (robotConfig && robotConfig.data) {
      let temp = {
        logoUrl: robotConfig.data.logo || '',
        robotName: robotConfig.data.petName || '',
        disclaimer: robotConfig.data.disclaimer || '',
        assetsUrl: req.protocol + '://rxhui-corpus.oss-cn-beijing.aliyuncs.com/',
        disclaimerAutoPopUp: robotConfig.data.disclaimerPopup,
        showIndexCarousel: robotConfig.data.showHomeCard,
        showQuestion: robotConfig.data.showUserQuestion,
        showRateThumbs: robotConfig.data.showEvaluation,
        showRecommendedQuestion: robotConfig.data.showRecommendQuestion,
        ifRecordQuestion: robotConfig.data.recordHistoryQuestion,
        ifSupportSocketPush: robotConfig.data.supportInitiativePush,
        ifSupportWebAudio: robotConfig.data.supportWebVoice,
      }
      Object.assign(eParams, temp)
    }

    // console.log(eParams)
    console.log(req.protocol)
    switch (process.env.NODE_ENV) {
      case 'local':
        eParams.iframeSrc = '//127.0.0.1:9097';
        break;
      case 'dev':
        eParams.iframeSrc = '//dev.robot.jinhui001.com:8080';
        break;
      case 'staging':
        eParams.iframeSrc = '//staging.robot.jinhui001.com';
        break;
      case 'production':
        eParams.iframeSrc = '//robot.rxhui.com';
        break;
      case 'ali':
        eParams.iframeSrc = '//robot-ali.rxhui.com';
        break;
    }
    // console.log(eParams)
    res.render("indexWeb", eParams)
  }
}
