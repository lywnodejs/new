import {reportService} from "../../service";
import timeUtil from '../../questionView/utils/timeUtil'

// 数据中心答案: 返回报告类型的答案 赵波 2019.10.30
module.exports = {

  async renderTemp(req, res, next, result, params) {
    // console.log(result)
    let param = {
      id: result.data.datacenterAnswer.reportConfig.id
    };

    // 报告存的参数数据
    let reportParams = result.data.datacenterAnswer.reportParams;
    // 后端查出来的值
    let reportParamsValue = result.data.reportParams;
    // console.log(reportParamsValue)

    if (reportParams) {
      for (let p in reportParams) {
        let strValue;
        let list = reportParamsValue[p] || [];
        let temp = [];
        switch (p) {
          case 'symbol':
          case 'index': // 指数代码
            // strValue = reportParamsValue[p][0].properties['证券市场'] + reportParamsValue[p][0].properties['证券代码'];
            for (let item of list) {
              temp.push(item.properties['证券市场'] + item.properties['证券代码'])
            }
            strValue = temp.join(',');
            break;

          case 'startAt':
            strValue = reportParamsValue[p][0].properties['开始时间'];
            if (strValue) {
              strValue = timeUtil.getTimeStr(strValue).replace(/-/g, '');
            }
            break;

          case 'endAt':
            strValue = reportParamsValue[p][0].properties['结束时间'];
            if (strValue) {
              strValue = timeUtil.getTimeStr(strValue).replace(/-/g, '');
            }

            // let startTime = reportParamsValue[p][0].properties['开始时间'];
            // if (startTime && startTime !== reportParamsValue[p][0].properties['结束时间']) {
            //   startTime = timeUtil.getTimeStr(startTime).replace(/-/g, '');
            //   param['startAt'] = startTime
            // }
            break;

          case 'industry': // 行业名称
          case 'relevantPeople': // 人名
          case 'objectName': // 实体名称
          case 'financialEntity': // 财务指标
          case 'orgKeys': // 机构唯一编码
          case 'secKeys': // 股票唯一编码
          case 'areaKeys': // 地域唯一编码
          case 'stockBaseInfo': // 股票基本信息指标
          case 'macroEntity': // 宏观指标
          case 'knowledgeTypes': // 知识类别，范怡
            let nerName = [];
            for (let item of list) {
              temp.push(item.uniqueKey);
              // 提取行业名称
              if (p === 'industry') {
                nerName.push(item.nerName || '')
              }
            }
            strValue = temp.join(',');

            // 暂时方案，取行业名称
            if (p === 'industry') {
              param['industryName'] = nerName.join(',')
            }
            break;

          case 'entityLeft': // 实体参数
            let ids = [];
            for (let item of list) {
              temp.push(item.uniqueKey);
              ids.push(item.nerTypeId);
            }
            param['entityLeftIds'] = temp.join(',');
            param['entityLeftTypeId'] = ids.join(',');
            break;

          default :
            strValue = reportParamsValue[p][0].uniqueKey;
            break;
        }

        if (strValue) {
          param[p] = strValue;
        } else {
          param[p] = '';
        }
      }
    }

    if (params.appKey === 'appAvatar') {
      param.needAudioText = true // 是否需要报告提供语音文本内容
    }

    if (req.query.noSource === 'true') {
      param.d = 'j'
    } else if (params.organization === 'appWps') {
      param.d = 'text' // 金山用
    }

    // 取报告
    let reportResult = await reportService.getReportAnswer(param).catch((err) => {
      // console.log(err)
      // 调用报告接口出错
      res.send('<div style="background-color: #ffffff">查询报告数据出错</div>')
    });
    // console.log(reportResult)

    if (reportResult) {
      reportResult.reportId = param.id; // 报告id
      reportResult.reportName = result.data.datacenterAnswer.reportConfig.reportName; // 报告名称
      reportResult.type = 'report'; // 供 小E 做判断
      reportResult.showInteractiveView = params.showInteractiveView;

      // 将api接口返回的数据再次传递，以供使用
      reportResult.preAnswerContent = result.preAnswerContent;
      reportResult.questionAnalyse = result.questionAnalyse;
      reportResult.spanId = result.spanId;
      reportResult.properties = result.properties;
      reportResult.guidanceQuestions = result.guidanceQuestions;
      reportResult.apiData = result.data;
      reportResult.answerResultType = result.answerResultType;
      reportResult.question = result.question;

      // 金山渠道
      if (params.organization === 'appWps') {
        // console.log('wps')
        return reportResult;
      } else {
        res.json(reportResult)
      }
    }
  }
};
