// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import {semanticApiService,stockAnalysisService,quotaService} from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import sh_kLineUtil from '../../questionView/utils/sh_kLineUtil';
var logger = require('../../utils/logger');
import config from '../../config'

var md5 = require('md5');
// let redisClient = redis.getClient();

module.exports = {
  //大盘技术分析
  sh_kline(req, res, next){
    let params = {
      subjectCode:req.query.subjectCode,
      subjectName:req.query.subjectName,
      subjectMarket:req.query.subjectMarket,
      subjectType:'指数',
      predicateType:'分析',
      organization:''
    }

    var expired = 60*60*24;
    var key = md5([req.method, req.url, JSON.stringify(params)].join(':'));
    module.exports.fixQuestion(req, res, next, params, expired, key);
    //
    //
    // let info = null;
    // redisClient.get(key, function (err, result) {
    //   console.log("缓存获取"+(new Date().getTime()-start))
    //   if (err) {
    //     module.exports.fixQuestion(params,res,key,expired);
    //   }
    //   if (result) {
    //     info = JSON.parse(result);
    //     // freeQuestion(params,res,key,expired);
    //     module.exports.generateData(req, res, next,info);
    //   }else{
    //     module.exports.fixQuestion(params,res,key,expired);
    //   }
    // })
  },


  async fixQuestion(req, res, next, params, expired, key) {
    let start = new Date().getTime();
    let info = await semanticApiService.apiFixQuestion(params);
    let infoT = new Date().getTime() - start;
    // console.log("固定问答"+(new Date().getTime()-start));
    // console.log(params)
    var type = info.answerResultType;

    if(type == "呼叫投顾"){
      res.send('Hello World!');
    }else if(type === '上证指数综合评价' || type === '指数综评'){
      // redisClient.setex(key, expired, JSON.stringify(info));
      module.exports.generateData(req, res, next, info, start, infoT);
    }else{
      res.send('Hello World!');
    }

  },

  async generateData(req, res, next, info, params){
    let start = new Date().getTime();
    let sn = new Date().getTime();
    let frameId = req.query.frameId;
    let infoT = new Date().getTime() - start;
    let reportResult = {};
    //data不为空再展示研报
    if (commonUtil.checkObjectIsNull(info.data)) {
      reportResult = stockRelatedReports(info, false, false, false);
    } else {
      // fixQuestion(result);
      // getQuestionTabs(result);
    }


    var questionAnalyse = info.questionAnalyse[0];
    var subject = questionAnalyse.entity[0];
    var symbol = subject.property.marketType + subject.property.code;
    var type = info.answerResultType;

    let price = await quotaService.getSymbolPrice({symbol:symbol})

    let priceT = new Date().getTime()-start;

    subject.price = price;

    var analysisText = '';

    if (type === '上证指数综合评价' || type === '指数综评') {
      analysisText = info.data.indexTechnicalResult ? info.data.indexTechnicalResult.analysisText : '';
    } else {
      analysisText = info.data.analysisText;
    }

    //图表
    var chart_t = (new Date()).getTime();
    sh_kLineUtil.sn = chart_t;
    let rs = await stockAnalysisService.apiStockAreaPrice({val:subject.property.marketType,symbol:subject.property.code});

    let tubiaoT = new Date().getTime() - start;

    let chartData = {};
    let quotaT = 0;
    let quotaTB = 0;
    if(rs.message.code == 0){
      let list = rs.data;

      if(rs.data){
        sh_kLineUtil.paramByType.num = list.num?list.num:sh_kLineUtil.paramByType.num;
        var l1=[],l2=[];
        if(list.dataType == 'day'){
          sh_kLineUtil.paramByType.pressurePrice = list.pressurePrice;
          sh_kLineUtil.paramByType.supportPrice = list.supportPrice;

          sh_kLineUtil.html = '<li>压力位　'+sh_kLineUtil.paramByType.pressurePrice+'</li><li>支撑位　'+sh_kLineUtil.paramByType.supportPrice+'</li>';

          //压力线
          var maxDay = commonUtil.dataFormatter(list.maxDay.toString()),
            pressureDay = commonUtil.dataFormatter(list.pressureDay.toString()),
            minDay = commonUtil.dataFormatter(list.minDay.toString()),
            supportDay = commonUtil.dataFormatter(list.supportDay.toString());
          if(list.pressureDay !=0 && list.maxDay !=0){
            if(list.maxDay < list.pressureDay){
              l1.push(
                [maxDay,list.maxPrice],
                [pressureDay,list.pressureDayPrice]
              );
            }else{
              l1.push(
                [pressureDay,list.pressureDayPrice],
                [maxDay,list.maxPrice]
              );
            }
          }


          //支撑线
          if(list.supportDay!=0 && list.minDay!=0){
            if(list.minDay < list.supportDay){
              l2.push(
                [minDay,list.minPrice],
                [supportDay,list.supportDayPrice]
              );
            }else{
              l2.push(
                [supportDay,list.supportDayPrice],
                [minDay,list.minPrice]
              );
            }
          }

          let params = {symbol:subject.property.marketType+subject.property.code,daynum:parseInt(sh_kLineUtil.paramByType.num),XDR:1};
          quotaTB = new Date().getTime() - start;
          let quota = await quotaService.getkline(params);

          quotaT = new Date().getTime() - start;


          if(quota){
            let datalist = quota.ks,
              ohlc = [],//蜡烛图数据
              volume = [];//柱形图数据

            if(datalist.length>0){
              let len = datalist.length;

              for(let j = 0;j<len;j++){
                var _date = '';
                _date = commonUtil.dataFormatter(datalist[j].date.toString());
                ohlc.push([
                  _date,
                  datalist[j].open,
                  datalist[j].high,
                  datalist[j].low,
                  datalist[j].close,
                  datalist[j].preClose
                ]);

                volume.push([
                  _date, // the date
                  datalist[j].volume // the volume
                ]);


              }
              // let latest = await jyService.getLastKData({symbol:subject.property.marketType+subject.property.code });

              let temp = [];
              temp.push(price.time * 1000);
              temp.push(price.open);
              temp.push(price.high);
              temp.push(price.low);
              temp.push(price.newPrice);
              temp.push(price.lastClose);


              let tt = new Date(price.time*1000);
              let tt1 = new Date(ohlc[ohlc.length-1].time);

              let temp1 = [];
              temp1.push(price.time * 1000);
              temp1.push(price.volume);


              if(tt.getDate() != tt1.getDate()){
                if(rs.open !=0 && price.high !=0 && price.low !=0){//当天未开盘情况
                  ohlc.push(temp);
                  volume.push(temp1);
                }

              }
              //去重 工作日与法定假日 会查重
              if(commonUtil.changeTime(ohlc[ohlc.length-1][0])  == commonUtil.changeTime(ohlc[ohlc.length-2][0])){
                ohlc.pop();
              }
              chartData = sh_kLineUtil.mapDataByType(ohlc,volume,l1,l2,chart_t);

            }
          }


        }

      }else{
        // alert("支撑压力线的接口返回数据为空");
      }
    }


    subject.analysisText = analysisText;
    let end = new Date().getTime() - start;

    // console.log(infoT)
    // console.log(priceT)
    // console.log(quotaT)
    // console.log(end)


    let final = {
      frameId:frameId,
      subject:subject,
      quota:price,
      info:info,
      noSource:req.query.noSource,
      preAnswer:info.preAnswerContent,
      sn:chart_t,
      params:params,
      sh_kLineUtil:sh_kLineUtil,
      chartData:JSON.stringify(chartData),
      reportResult:reportResult
    }
    final.commonUtil = commonUtil;
    final.config = config[process.env.NODE_ENV].resource;
    renderFile(res,final)

    // logger.info("用时", {
    //   infoApi:infoT,
    //   quotaApi:priceT,
    //   chartApi:tubiaoT,
    //   quotaTB:quotaTB,
    //   quotaT:quotaT,
    //   totalTime: end,
    // });
  }

};

function renderFile(res,resultData){
  res.render('sshTech' , resultData);
}

function stockRelatedReports(result, outputGuideLine, isPopup, ifSecond, showInteractiveView) {

  var reportList = [];
  var answerType = result.answerResultType;
  var timeType = '';

  //个股
  if (result.data.hasOwnProperty('stockReportResult')) {
    reportList = result.data.stockReportResult;
  }
  //行业
  else if (result.data.hasOwnProperty('industryAnalyseResult')) {
    reportList = result.data.industryAnalyseResult;
  }
  //大盘，策略
  else if (result.data.hasOwnProperty('strategyAdviceResult')) {
    reportList = result.data.strategyAdviceResult.semanticDocs;
    timeType = result.data.strategyAdviceResult.timeType;
  }
  //其它
  else {
    reportList = result.data.list;
  }

  //未找到相关研报
  if (!reportList) {
    // sendPreAnswerContent('未找到相关研报');
    // fixQuestion(result);
    // getQuestionTabs(result);
    return;
  }

  var property = result.questionAnalyse[0].entity[0].property;
  //指数类型
  var indexType = property.name;
  var symbol = commonUtil.getSymbolByEntity(result.questionAnalyse[0].entity, false);
  //指数symbol须拼前缀
  if (answerType === '指数综评') {
    //创业板用大盘的
    if (indexType === '创业板指')
      symbol = 'sh000001';
    else {
      var marketType = property.marketType;
      symbol = commonUtil.getSymbolByEntity(result.questionAnalyse[0].entity);
      // symbol = marketType + symbol;
    }
  }

  var item;
  var contentIds = [];
  //生成随机数，作为class名
  var hideClass = commonUtil.generateRandomClassName('hideReport');
  var tagBody = '';
  // if (!isPopup) {
  //   tagBody = '<div class="mb">';
  // } else {
  //   tagBody = '<div>';
  // }

  for (var i = 0; i < reportList.length; i++) {
    item = reportList[i];
    var sourceFrom = item.docType,
      summary = item.title,
      organization = sourceFrom === "weixin" ? item.weChatName : item.organization,
      author = item.author,
      ratingName = item.ratingName ? item.ratingName : '';

    //提取要点集合
    var tempArray = [];
    for (var x in item.analyseFlags) {
      var strategyName = item.analyseFlags[x];

      //根据不同的指数过滤要点
      if (indexType === '创业板指') {
        if (strategyName !== '创业板分析' && strategyName !== '日策略创业板分析')
          continue;
      } else if (indexType === '上证指数') {
        //取对应的时间
        if (timeType === '' && strategyName !== '大盘行情展望' && strategyName !== '日策略大盘行情展望')
          continue;
        else if (timeType === '短期' && strategyName !== '短期大盘行情展望' && strategyName !== '短期日策略大盘行情展望')
          continue;
        else if (timeType === '中长期' && strategyName !== '中长期大盘行情展望' && strategyName !== '中长期日策略大盘行情展望')
          continue;
      }

      tempArray.push(strategyName);
    }

    var tagListBody = '';
    //第2个以后的先隐藏
    if (i >= 2)
      tagListBody = '<div class="gzpj ' + hideClass + '" style="display: none">';
    else
      tagListBody = '<div class="gzpj">';

    //循环展示多个要点，根据提取出来的要点
    var index = 0;


    for (var j = 0; j < tempArray.length; j++) {
      var subType = tempArray[j];

      //行业不用拼symbol
      if (answerType === '专家行业观点' || answerType === '行业' || answerType === '行业综评' || answerType === '行业个股推荐') {
        if (subType !== '行业分析' && subType !== '行业个股推荐' && subType !== '行业龙头分析')
          continue;
        symbol = '';
      }
      else if (answerType === '经营分析') {
        if (subType !== '外部环境' && subType !== '经营分析')
          continue;
      }
      else if (answerType === '竞争优势') {
        if (subType !== '经营分析' && subType !== '竞争优势')
          continue;
      }
      else if (answerType === '估值评级' || answerType === '个股综评') {
        if (subType !== '估值评级')
          continue;
      }
      else if (answerType === '业绩简评') {
        if (subType !== '业绩简评')
          continue;
      }

      summary = item.analyseResults[symbol + subType];
      summary = commonUtil.replaceLineBreak(summary);

      //第一个特殊处理，是否展示证券公司
      if (index === 0) {
        //估值评级特殊处理，用红底，要点改用评级
        var tagKeyPoint = '';
        var clsBg = '';
        if (subType === '估值评级') {
          if (ratingName)
            tagKeyPoint = ratingName + '【评级】';
          else
            tagKeyPoint = subType;
          clsBg = '';
        } else {
          tagKeyPoint = subType.replace('大盘', '').replace('日策略', '');
          clsBg = 'box_bBlue';
        }

        tagListBody +=
          // <!--红框白字 2行-->
          '<div class="box_bRed box_bRed_r2 ' + clsBg + '">' +
          '<li>' + tagKeyPoint + '</li>' +
          '<li>' +
          '<h6><span>' + organization + '／' + author + '</span><br>' + commonUtil.changeTime(item.publishAt) + '</h6>' +
          '</li>' +
          '</div>';
      }

      //内容，展开，收起Id
      var contentId = commonUtil.generateRandomClassName('contentId');
      var expandBtnId = commonUtil.generateRandomClassName('expandBtnId');
      var foldBtnId = commonUtil.generateRandomClassName('foldBtnId');
      contentIds.push([contentId, expandBtnId]);

      //第2个要点及以后只显示要点名称，不展示证券公司
      var tagExtraKeyPoint = '';
      if (index > 0) {
        tagExtraKeyPoint =
          '<div class="box_bRed box_bRed_r2 box_bBlue">' +
          '<li>' + subType.replace('大盘', '').replace('日策略', '') + '</li>' +
          '</div>';
      }

      //展示标题：事件对公司的影响
      var tagTitle = '';
      if (subType === '事件影响')
        tagTitle += '<p>' + item.title + '</p>';
      // console.log(summary);
      //判断是否展示要点
      tagListBody +=
        // <!--显示6行，有展开按钮-->
        '<div class="box_show box_show_r3">' +
        tagExtraKeyPoint + tagTitle +
        '<h5 id="' + contentId + '" class="show_row3">' + summary + '</h5>';
      tagListBody += '<a id="' + expandBtnId + '" class="a_more" onclick="expandContent(\'' + expandBtnId + '\',\'' + contentId + '\',\'' + foldBtnId + '\')">展开<i class="icon-arrowD"></i></a>';
      tagListBody += '<a id="' + foldBtnId + '" style="display: none" class="a_more" onclick="foldContent(\'' + foldBtnId + '\',\'' + contentId + '\',\'' + expandBtnId + '\')">收起<i class="icon-arrowT"></i></a>';
      tagListBody += '</div>';
      index++;
    }
    tagListBody += '</div>';
    tagBody += tagListBody;
  }

  //加载更多
  var btnMore = '';
  if (reportList.length > 2) {
    var moreId = commonUtil.generateRandomClassName('moreId');
    btnMore =
      '<div id="' + moreId + '" class="mb">' +
      '<div class="box_load" onclick="toolsUtil.showMoreArticle(\'' + hideClass + '\', \'' + moreId + '\')">' +
      '<a>点击加载更多</a>' +
      '</div>' +
      '</div>';
  }

  var temp = '';
  // if (!isPopup) {
  //   temp = '<div class="bd">';
  // } else {
  //   temp = '<div>';
  // }
  temp += tagBody + btnMore;
  // temp += '</div>';

  return temp;
  if (!isPopup) {
    // appendAnswer(temp);
    // fixQuestion(result);
    // getQuestionTabs(result);
  } else {
    // appendAnswerToPopup(temp);
  }
  // checkTextOverflow(contentIds);
}
