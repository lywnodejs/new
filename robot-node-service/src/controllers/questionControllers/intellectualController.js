// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {

  renderTemp(req, res, next, result, params) {
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();

    var text = '';
    var hideClass = commonUtil.generateRandomClassName('hideClass');
    var moreId = commonUtil.generateRandomClassName('moreId');
    var dataObj = result.data;
    var list = dataObj.list;


    for (var i = 0, l = list.length; i < l; i++) {
      var ifHideClass = i > 4 ? 'none' : 'block';
      var hideClassLine = i > 4 ? hideClass : '';
      text += '<li class="' + hideClassLine + '" style="display:' + ifHideClass + '">' +
        '<h5 onclick="textTongji()">' +
        '<span>' + list[i].patentName + '</span>' +
        // '<i class="icon-authorized_un"></i>' +
        '</h5>' +
        '<h6>专利编号：' + list[i].patentNo + '</h6>' +
        '<h6>专利类型：' + list[i].patentType + '</h6>' +
        '</li>';
    }
    if (list instanceof Array && list.length > 5) {
      text +=
        // <!--加载更多-->
        '<a id="' + moreId + '" class="btn_more" onclick=toolsUtil.showMoreArticle("' + hideClass + '","' + moreId + '",5)>查看更多</a>'
    }

    //本公司专利数
    var companyPatentCount = dataObj.companyPatentCount;
    //行业平均专利数
    var industryAvg = dataObj.industryAvg;
    var ulDom = '';

    // 计算百分比
    var companyPatentCountPer = companyPatentCount / (companyPatentCount + industryAvg) * 100 + '%';
    var industryAvgPer = industryAvg / (companyPatentCount + industryAvg) * 100 + '%';
    var tagBody =
      '<div class="box_intProperty">' +
      '<div class="box_bgBlue">' +
      '<b>' + dataObj.stockName + '</b>团队知识产权数量同行业内<b>' + commonUtil.getPatentRevel(dataObj.rank) + '</b>，从长远竞争力看，<b>' + commonUtil.getPatentRevelCommon(dataObj.rank) + '</b>' +
      '</div>' +
      '<h4>专利权</h4>' +
      '<div class="box_percent patent">' +
      '<ul>' +
      '<li>' +
      '<h6>本公司</h6>' +
      '<h4>' + companyPatentCount + '</h4>' +
      '</li>' +
      '<li>' +
      '<h6>行业平均</h6>' +
      '<h4>' + industryAvg + '</h4>' +
      '</li>' +
      '</ul>' +
      '<ul>' +
      '<li style="width: ' + companyPatentCountPer + '"><b></b></li>' +
      '<li style="width: ' + industryAvgPer + '"><b></b></li>' +
      '</ul>' +

      '</div>' +
      '<ul class="box_authorized" id="">' + text + '</ul>';




    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      data: tagBody,
      info: result,
      params: params,
      preAnswer: result.preAnswerContent,
      noSource: req.query.noSource,
      frameId: frameId,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/intellectual.ejs", renderData, function (err, str) {
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

    // res.render("intellectual",
    // {
    //   sn:sn,
    //   data:tagBody,
    //   info:result,
    //   params:params,
    //   preAnswer:result.preAnswerContent,
    //   noSource:req.query.noSource,
    //   frameId:frameId,
    //   host:config[process.env.NODE_ENV].host,
    //   config:config[process.env.NODE_ENV].resource
    // })
  }

};
