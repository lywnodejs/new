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


    var list = [];
    var item = result.data.list[0];

    var queArry = {};
    var noList = "0140010100201,0140010100202,0140010100203,0140010100204,0140010100205,0140010100206,0140010100207,0150040100101";
    var msg = '暂无数据';

    if (item.hasOwnProperty('answer'))
      msg = "<h5>" + item.answer.replace(/\n/g, '<br>') + "</h5>";
    else if (item.hasOwnProperty('explain'))
      msg = "<h5>" + item.explain.replace(/\n/g, '<br>') + "</h5>";


    if (result.message.code == 0) {
      list = result.data.list;
      if (list.length > 0) {
        // 有答案的时候的操作
        var figuresLength = list[0].docID.length;
        if (list[0].docID.length == figuresLength) {
          var secondList = [];
          for (var first = 1; first < list.length; first++) {
            if (list[first].question != "") {
              secondList.push(list[first]);
            }
          }
          ;
          if (list[0].hasOwnProperty("explain")) {
            if (list[0].explain.length > 0) {
              msg = "<h5>" + list[0].explain + "</h5>";
            }
            else {
              if (list[0].explain.length > 0) {
                msg = "<h5>" + list[0].explain + "</h5>";
              }
              else {
                msg = "<h5></h5>";
              }
            }
          } else {
            if (list[0].answer.length > 0) {
              if (list[0].question == "华创证券有限责任公司") {
                var answer = JSON.parse(list[0].answer);
                var content = answer.content;
                var questionlist = '';
                for (var i = 0; i < answer.suggests.length; i++) {
                  questionlist += "<li><a onclick=prependAskDialog('" + answer.suggests[i].question + "'," + Number(i + 1) + ")>" + (i + 1) + ". " +
                    answer.suggests[i].question + "</a></li>";
                }
                msg = "<h5>" + content.replace(/\n/g, '<br>') + "</h5>";
                msg += "<div class='box_tl'><h5>您可能还想知道：</h5>" + questionlist;
              } else {
                msg = "<h5>" + list[0].answer + "</h5>";
              }
            }
            else {
              msg = "<h5 class='toblue'></h5>";
            }
          }

          if (secondList.length > 0 && secondList[0].question != "" && noList.indexOf(list[0].docID) == -1) {
            if (list[0].hasOwnProperty("explain")) {
              if (list[0].explain.length == 0 && list[0].explain.length == 0) {
                msg += "<div class='box_tl'><h5>小e没能匹配到精确答案，为您整理了以下您可能想了解的：</h5>";
              }
              else {
                msg += "<div class='box_tl'><h5>您可能还想知道：</h5>";
              }
            } else {

              if (list[0].answer.length == 0 && list[0].answer.length == 0) {
                msg += "<div class='box_tl'><h5>小e没能匹配到精确答案，为您整理了以下您可能想了解的：</h5>";
              }
              else {
                msg += "<div class='box_tl'><h5>您可能还想知道：</h5>";
              }
            }
            for (var secondQue = 0; secondQue < secondList.length; secondQue++) {
              if (secondList[secondQue].question == "") {
                continue;
              }
              else {
                msg += "<li><a onclick=\"nodeQuestion(\'" + secondList[secondQue].question + "\'," + (secondQue + 1) + ")\">" + (secondQue + 1) + "." + secondList[secondQue].question + "</a></li>";
                queArry[(secondQue) + 1] = secondList[secondQue].question;
              }
            }
          }
        }
      }
      else {
        msg = "没有答案"
      }
    }

    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      data: msg,
      frameId: frameId,
      info: result,
      params: params,
      preAnswer: result.preAnswerContent,
      noSource: req.query.noSource,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/basics.ejs", renderData, function (err, str) {
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

    // res.render("basics",
    //   {
    //     sn:sn,
    //     data:msg,
    //     frameId:frameId,
    //     info:result,
    //     params:params,
    //     preAnswer:result.preAnswerContent,
    //     noSource:req.query.noSource,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};
