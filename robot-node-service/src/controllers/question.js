// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import {semanticApiService, stockAnalysisService} from '../service/index';
import themeController from "./questionControllers/themeController";
import config from '../config';
import commonUtil from '../questionView/utils/commonUtil'
import skinUtil from "../static/js/utils/skinUtil";

module.exports = {
  /**
   * 小E首页入口
   * @param req
   * @param res
   * @param next
   */
  async index(req, res, next)
  {
    // console.log(req)
    let appKey = req.query.appKey || '',
        robotId = req.query.robotId || '',
        preview = req.query.preview || 'production'; // test

    // 航天云网使用域名，需特殊处理
    if (req.hostname.indexOf('htyw') !== -1) {
      appKey = 'appHtyw';
      robotId = robotId || 160
    }

    //小E logo
    //名称
    //免责声明
    //换肤
    let eParams = {
      appKey: appKey, // 渠道
      robotId: robotId, // 机器人ID
      logoUrl: '', // 小E logo地址
      robotName: '', // 机器人名称
      hostname: req.hostname || 'hostname',
      isPC: commonUtil.isPC(req.headers['user-agent']),
      isAvatar: appKey === 'appAvatar', // 是否为Avatar，界面样式与小E不同
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

    // console.log(config[process.env.NODE_ENV].reportService)

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
        skin: skinUtil.getSkinByName(robotConfig.data.skin),
        assetsUrl: req.protocol+'://rxhui-corpus.oss-cn-beijing.aliyuncs.com/',
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

      // 读取免责声明
      if (robotConfig.data.disclaimer) {
        let disclaimerResult = await semanticApiService.getHtml(eParams.assetsUrl+eParams.disclaimer).catch(()=>{
          // console.log('读取免责声明报错')
        })
        // console.log(text)
        if (disclaimerResult) {
          eParams.disclaimerContent = disclaimerResult
        }
      }
    }

    // 读取样式库的版本号
    let versionResult = await semanticApiService.getXML(req.protocol+'://weblibs.rxhui.com/version_rxhui.json').catch(()=>{
      // console.log('读取样式库版本号出错')
    })
    // console.log(versionResult.version)
    if (versionResult) {
      eParams.v_comp_js = versionResult.comp_js
      eParams.v_comp_css = versionResult.comp_css
      eParams.v_libs_svg_css = versionResult.libs_svg_css
    }
    // console.log(eParams)

    // console.log('app:'+req.app)
    // console.log('baseUrl:'+req.baseUrl)
    // console.log('body:'+req.body)
    // console.log('cookies:',req.cookies)
    // console.log('fresh:'+req.fresh)
    // console.log('hostname:'+req.hostname)
    // console.log('ip:'+req.ip)
    // console.log('ips:'+req.ips)
    // console.log('method:'+req.method)
    // console.log('originalUrl:'+req.originalUrl)
    // console.log('params:',req.params)
    // console.log('path:'+req.path)
    // console.log('protocol:'+req.protocol)
    // console.log('query:',req.query)
    // console.log('route:',req.route)
    // console.log('secure:'+req.secure)
    // console.log('signedCookies:',req.signedCookies)
    // console.log('stale:'+req.stale)
    // console.log('subdomains:'+req.subdomains)
    // console.log('xhr:'+req.xhr)

    res.render("index", eParams)
  },

  /**
   * 条件选股页面
   * @param req
   * @param res
   * @param next
   */
  pickConditions (req, res, next) {
    // console.log(req.path)
    // console.log(req.originalUrl)
    res.render("pagePickConditions")
  },

  /**
   * 选择行业页面
   * @param req
   * @param res
   * @param next
   */
  pickIndustry (req, res, next) {
    res.render("pagePickIndustry")
  },

  /**
   * 条件选股查询结果页面
   * @param req
   * @param res
   * @param next
   */
  pickStockResult (req, res, next) {
    res.render("pagePickStockResult")
  },

  /**
   * 筹码分页页面
   * @param req
   * @param res
   * @param next
   */
  distOfChips (req, res, next) {
    res.render("pageDistOfChips")
  },

  stock(req, res, next){
    res.json({"code":0,"message":"成功","data":"<div class='bd'><div class='mb'><h5>2018-12-12</br>利通电子可申购，申购代码为732629，发行价格**元，个人申购上限为**万股</br>请您不要忘记申购新股哦！（T+2日公布中签结果）</h5><div class=\"box_appraisal\"><a><i id=\"up15439749024395322\" class=\"icon-good\" onclick=ratingAnswer(\"ee5df9f497d542e2aede61200cd48e76\",\"2\",\"up15439749024395322\")></i><span></span></a><a><i id=\"down15439749024392705\" class=\"icon-bad\" onclick=ratingAnswer(\"ee5df9f497d542e2aede61200cd48e76\",\"1\",\"down15439749024392705\")></i><span></span></a></div></div></div>"});
  },

  //行业个股推荐
  async stockRecommand(req, res, next){
    let params = {
      question:"电子行业推荐",
    }
    let info = await semanticApiService.freeQuestion(params);

    res.json(info);
  },

  //大盘技术分析
  async sseTech(req, res, next){
    let params = {
      question:"上证指数技术分析",
    }
    let info = await semanticApiService.freeQuestion(params);
    res.json(info);
  },

  async apiQaQuestion(req, res, next){
    let info = await semanticApiService.apiFixQuestion(req.query);
    res.json(info);
  },

  async apiRiskNotices(req, res, next){
    let info = await semanticApiService.apiRiskNotices(req.query);
    res.json(info);
  },

  async apiStockAreaPrice(req, res, next){
    let info = await stockAnalysisService.apiStockAreaPrice(req.query);
    res.json(info);
  },

  async apiStockDetail(req, res, next){
    var sn = (new Date()).getTime();
    let showInteractiveView = false;
    let info = await semanticApiService.apiFixQuestion(req.query);

    let params = {
      appKey:req.query.appKey,
      noSource:req.query.noSource,
      sn:sn,
      stockInfo:{},
      showInteractiveView:showInteractiveView,
      resultId:info.spanId,
    }
    if(req.query.useMode){
      themeController.renderTemp(req, res, next, info, params);
    }else{
      res.json(info);
    }

  }
};


