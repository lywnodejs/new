// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import {semanticApiService, infoApiService, semanticDataCenterService} from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import timeUtil from '../../questionView/utils/timeUtil';
import config from '../../config';

var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {

  async renderTemp(req, res, next, result, params) {
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();

    var type = result.answerResultType;
    var questionAnalyse = result.questionAnalyse[0];
    var stockList = questionAnalyse.entity;
    var totalCount = stockList.length;
    if ((type === '股票' || type === '个股综评') && totalCount > 1) {

      res.render("stockAnalysisMuti",
        {
          sn: sn,
          stockList: stockList,
          params: params,
          totalCount: totalCount,
          preAnswer: result.preAnswerContent,
          frameId: frameId,
          host: config[process.env.NODE_ENV].host,
          config: config[process.env.NODE_ENV].resource
        })
      return;
    }

    if (!result.data) {
      res.send("没有数据");
      return;
    }

    var list = result.data.list || [];
    var property = commonUtil.getPropertyByEntity(result.questionAnalyse[0].entity);

    var boxClass = commonUtil.generateRandomClassName('box_comReview');

    var techOrRiskIndex,
      matterIndex,
      fundValueIndex,
      financeGrateIndex,
      insRatingIndex,
      knowledgeRightIndex,
      stockStructureIndex,
      stockEncourageIndex,
      newsIndex;


    for (var listIndex = 0; listIndex < list.length; listIndex++) {
      if (list[listIndex].predicateType == '个股技术分析') {
        techOrRiskIndex = listIndex
      } else if (list[listIndex].predicateType == '财务指标') {
        fundValueIndex = listIndex
      } else if (list[listIndex].predicateType == '个股所属概念') {
        matterIndex = listIndex
      } else if (list[listIndex].predicateType == '资金流向') {
        financeGrateIndex = listIndex
      } else if (list[listIndex].predicateType == '估值评级') {
        insRatingIndex = listIndex
      } else if (list[listIndex].predicateType == '知识产权') {
        knowledgeRightIndex = listIndex
      } else if (list[listIndex].predicateType == '股本结构') {
        stockStructureIndex = listIndex
      } else if (list[listIndex].predicateType == '股权激励') {
        stockEncourageIndex = listIndex
      } else if (list[listIndex].predicateType == '个股资讯') {
        newsIndex = listIndex
      }
    }

    //知识产权话术
    var knowledgeRightText = '';
    if (knowledgeRightIndex >= 0) {
      if (list[knowledgeRightIndex].messageTitle == '知识产权') {
        list[knowledgeRightIndex].messageDisp ? knowledgeRightText = list[knowledgeRightIndex].messageDisp + '。' : '';
        // console.log(list[knowledgeRightIndex]);
      }
    }

    // 所属题材
    var subMatter = ''
    if (matterIndex >= 0) {
      var messageDisp = list[matterIndex].messageDisp
      var messageDispArr = strToArr(messageDisp)
    }

    var isRisk = false;//是否為風險提示的股票
    // 技术面
    if (techOrRiskIndex >= 0) {
      if (list[techOrRiskIndex].messageTitle == '技术面分析') {
        isRisk = false;
      } else {
        isRisk = true;
      }
    }


    // 资金面 + 财务面
    var financeGrate = ''; //财务面
    var capFund = '';  //资金面
    if (fundValueIndex >= 0) {
      var summaryLevel = JSON.parse(list[fundValueIndex].messageContent)[0].summaryLevel;


      switch (summaryLevel) {
        case 1:
          financeGrate = '优秀';
          break;
        case 2:
          financeGrate = '良好';
          break;
        case 3:
          financeGrate = '一般';
          break;
        case 4:
          financeGrate = '较差';
          break;
        case 5:
          financeGrate = '疲软';
          break;
        default:
          financeGrate = '--';
      }


      try {
        var fundValue = parseFloat(fund.majorFlowIn) - parseFloat(fund.majorFlowOut)
        if (fundValue > 0) {
          fundValue = '+' + fundValue
        }
      } catch (e) {

      }


    }

    var ratingArr
    if (insRatingIndex) {
      ratingArr = JSON.parse(list[insRatingIndex].messageContent).ratingResult;
    }


    var ratingLabel = setValueGrade_v3(ratingArr);

    var cls = "";
    //资金面+财务面+机构面
    if (fundValueIndex >= 0 && financeGrateIndex >= 0 && insRatingIndex >= 0) {
      cls = "cfi";
    }
    //资金面+财务面
    else if (fundValueIndex >= 0 && financeGrateIndex >= 0 && insRatingIndex == undefined) {
      cls = "";
    }
    //资金面+机构面
    else if (fundValueIndex >= 0 && financeGrateIndex == undefined && insRatingIndex >= 0) {
      cls = "";
    }
    //资金面
    else if (fundValueIndex >= 0 && financeGrateIndex == undefined && insRatingIndex == undefined) {
      cls = "cf_capital";
    }
    //财务面
    else if (fundValueIndex == undefined && financeGrateIndex >= 0 && insRatingIndex == undefined) {
      cls = "cf_finance";
    }
    //机构面
    else if (fundValueIndex == undefined && financeGrateIndex == undefined && insRatingIndex >= 0) {
      cls = "cf_finance";
    } else {
      cls = "cfi";
    }

    var studyStaticMsg = '';
    var studyStaticText = '';
    if (fundValueIndex >= 0) {
      var financeMessageContent = JSON.parse(list[fundValueIndex].messageContent)
      var studyStaticTextTemp1 = financeMessageContent[0].conclusion
      if (studyStaticTextTemp1) {
        studyStaticText += studyStaticTextTemp1 + '。'
      }
    }
    if (insRatingIndex >= 0) {
      studyStaticMsg = JSON.parse(list[insRatingIndex].messageContent).ratingResult
      var studyStaticTextTemp2 = setValueGrade(studyStaticMsg)
      if (studyStaticTextTemp2) {
        studyStaticText += studyStaticTextTemp2 + '。'
      }
    }

    //股本结构
    if (stockStructureIndex >= 0) {
      var shareholderAmountList = JSON.parse(list[stockStructureIndex].messageContent).amount.shareholderAmountList;
      var lastHolder = shareholderAmountList.length > 0 ? shareholderAmountList[0] : {};

      //股东变化用
      var strAmount = '';
      if (!lastHolder) {
        strAmount = '';
      } else if (lastHolder.chanOfLast > 10)
        strAmount = '数量增加';
      else if (lastHolder.chanOfLast < -10)
        strAmount = '数量减少';
      else
        strAmount = '数量稳定';
      studyStaticText = '股东人数近期' + strAmount + '。' + studyStaticText
    }

    //股权激励
    if (stockEncourageIndex >= 0) {
      var encourageData = JSON.parse(list[stockEncourageIndex].messageContent);
      var text = '', riskTxt = '';
      if (encourageData.length > 0) {
        var item = encourageData[0]
        text = timeUtil.getTimeStr2(item.pubDateTimestamp) + '公布股权激励方案，激励方式为授予' + commonUtil.incSubject(item.incSubject) + '，近一年公司业绩可能会有较大提升。'
      }
      if (isRisk) {
        riskTxt = '近期该股面临风险，请关注最新资讯。';
      } else {
        riskTxt = '';
      }
      studyStaticText = knowledgeRightText + text + studyStaticText + riskTxt;
    }

    let news
    if (newsIndex >= 0) {
      // var newsData = list[newsIndex];
      //新闻资讯
      var newsTxt = '';//舆情关注
      var mathRandom = new Date().getTime() + (Math.random() * 1000).toFixed(0);
      newsTxt += '<div class="PubOpinion" id="getNewsAndReportDiv' + mathRandom + '">';
      // newsTxt += infoAndResearch_v3(newsData,mathRandom,source);
      newsTxt += '</div>';


      let params = {};
      params.page = 1;
      params.size = 5;
      params.type = 'stock';
      params.symbol = property.marketType + "a_" + property.code;
      params.isFacet = false;

      news = await infoApiService.apiAdvancedNewsDetail(params);
    }

    let noticPar = {};
    noticPar.market = property.marketType;
    noticPar.stockcode = property.code;
    let notice = await semanticDataCenterService.apiNotice(noticPar);
    // console.log(notice)


    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      info: result,
      frameId: frameId,
      boxClass: boxClass,
      property: property,
      noSource: req.query.noSource,
      preAnswer: result.preAnswerContent,
      subMatter: subMatter,
      list: list,
      params: params,
      cls: cls,
      messageContent: news,
      notice: notice.data.list,
      techOrRiskIndex: techOrRiskIndex,
      mathRandom: mathRandom,
      studyStaticText: studyStaticText,
      messageDispArr: messageDispArr,
      matterIndex: matterIndex,
      commonUtil: commonUtil,
      timeUtil: timeUtil,
      financeGrateIndex: financeGrateIndex,
      fundValueIndex: fundValueIndex,
      fundValue: fundValue,
      financeGrate: financeGrate,
      ratingLabel: ratingLabel,
      insRatingIndex: insRatingIndex,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/stockAnalysis.ejs", renderData, function (err, str) {
      if (needJson) {
        res.send({
          info: result,
          content: str
        })
      } else {
        res.set('Content-Type', 'text/html');
        res.send(str);
      }
    });

  },


};


/**
 * 将字符串转为数组
 * @param str
 * @returns {Array}
 */
function strToArr(str) {
  var arr = []
  if (str) {
    arr = str.split(/\s+/)
    var len = arr.length
    for (var i = 0; i < len; i++) {
      arr[i] = arr[i].split('.')[1]
    }
  }
  return arr
}

/**
 * 综评3期
 * 添加机构评级话术
 * @param result
 */
function setValueGrade_v3(data, isPopup) {

  if (data == undefined) {
    return "";
  }
  var stockNum = 0

  console.log(data)
  stockNum = data.stockNum;

  var stockLevel = '';
  if (stockNum !== 0) {
    var stockPercent = (data.ranking / stockNum).toFixed(2);
    if (stockPercent <= 0.3) {
      stockLevel = '关注度高';
    } else if (stockPercent > 0.3 && stockPercent <= 0.7) {
      stockLevel = '关注一般';
    } else if (stockPercent > 0.7) {
      stockLevel = '关注度低';
    }
  }
  if (data.ratingTotal == 0) {
    stockLevel = '关注度低';//该股暂无机构关注  没有评级研报时，为关注度低
  }
  return stockLevel;

}

/**
 * 添加机构评级话术
 * @param result
 */
function setValueGrade(data, isPopup) {
  var stockNum = 0

  stockNum = data.stockNum

  var stockLevel = ''
  if (stockNum !== 0) {
    var stockPercent = (data.ranking / stockNum).toFixed(2);
    if (stockPercent <= 0.3) {
      stockLevel = '机构关注度较高'
    } else if (stockPercent > 0.3 && stockPercent <= 0.7) {
      stockLevel = '机构关注度一般'
    } else if (stockPercent > 0.7) {
      stockLevel = '机构关注度较低'
    }
  }
  if (data.ratingTotal == 0) {
    stockLevel = '机构关注度较低'
  }

  return '近半年有' + data.ratingTotal + '篇研报，' + stockLevel
}
