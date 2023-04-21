import commonUtil from '../utils/commonUtil';
import util from '../utils/com-util'
var templateToText = {
  getTextByType:function (renderData,type){
    var info = renderData.info;
    if(!commonUtil.checkObjectIsNull(info)){
      return "";
    }
    var conditionParams = renderData.conditionParams;
      if(type =="speechTemplateView"){
        let data = info.data;
        let p = "";
        if (!info.isError) {
          for (let i = 0; i < conditionParams.selectedIndexList.length; i++) {
            let item = conditionParams.selectedIndexList[i];
            if (item.text) {
              p += item.value;
            } else {
              if (data[item.timeIndex]) {
                console.log(data[item.timeIndex])
                let resultItem = data[item.timeIndex][0];
                if (resultItem.indicatorValue) {
                  let val = resultItem.indicatorValue;
                  if (resultItem.unit_change == 1) {
                    let countUnit = item.countUnit || ''

                    if (resultItem.dispUnit == "元") {
                      val = commonUtil.fundFilterToMoney(val,countUnit);
                    } else {
                      val = commonUtil.getTwoNumberDot(val);
                    }
                    p += val

                  }else{
                    if (resultItem.dispUnit == "%") {
                      val = commonUtil.getTwoNumberDot(val);
                    }
                    if (resultItem.dispUnit == "元") {
                      val = commonUtil.fundFilter2(val);
                    }

                    if (resultItem.index_flag == 1) {
                      val = "(" + resultItem.indicatorValue.substring(2, resultItem.indicatorValue.length) + ")";
                    }else if(resultItem.index_flag == 3 || resultItem.index_flag == 4){
                      val = commonUtil.formatDataDay(val);
                    }
                    p += val + (resultItem.dispUnit ? resultItem.dispUnit : '');
                  }
                }
              } else if (info.displayType !== 1) {
                p += '--'
              }
              // console.log(data[item.timeIndex])
              // p += data[item.timeIndex].indicatorValue + data[item.timeIndex].dispUnit;
            }
          }
        } else {
          for (let i = 0; i < conditionParams.selectedIndexList.length; i++) {
            let item = conditionParams.selectedIndexList[i];
            if (item.text) {
              p += item.value;
            } else {
              p += '--'
            }
          }
        }
        return [{text:p,type:"content"}];
      }
      else if(type == "splineAndColumnView" ){
        return info.textValue;
      }
      else if(type == "textView"){
        return info;
      }else if (type == 'informationListView'){ //其他组件
        //公告和司法纠纷
        let list = info.data || [];
        let p = [];
        for (let i = 0;i < list.length;i++){
         let item = list[i];
          let content = getTextForSort(item.title);
          if (!content.length){
            continue;
          }
          let url = getTextForSort(item.pageUrl);
          if (url.length){
            p.push({
              'text':content,
              'type':'content',
              'url':url
            })
          } else {
            p.push({
              'text':content,
              'type':'content',
            })
          }
          let subContent = getTextForSort(commonUtil.changeTimeForMinNoHours(item.date));
          if (subContent.length) {
            p.push(
                {
                  'text':subContent,
                  'type':'weekContent',
                }
            )
          }
        }
        return p;
      }else if (type == 'otherBoardVoteView'){ //董事会投票
        let arr = info.data.list;
        let p = [];
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          let str = item.pubDate.toString()
          let title = str.substring(0, 4) + '年' + str.substring(4,6) + '月' + str.substring(6,8) + '日 ' + item.annTitle;
          p.push({
            'text':title,
            'type':'content'
          });
           for (var j = 0; j < item.proposalVotes.length; j++) {
           let subItem = item.proposalVotes[j];
            let a =  '议案：审议通过' + subItem.proposalName + '。';
            let b = '表决结果：同意' + subItem.affirmativeVotes + '票，反对：' + subItem.againstVotes + '票，弃权：' + subItem.abstentionVotes + '票。';
             p.push({
               'text':a,
               'type':'content'
             });
             p.push({
               'text':b,
               'type':'content'
             });
           }
        }
        return p;
      } else if (type == 'paragraphView'){ //一致行动人、定期报告
        let list = info.data || [];
        let type = renderData.dataType;
        let p = [];
        if (list.length == 0){
          return p;
        }
        if (type == 5003){
            let item = list[0];
            let content = getTextForSort(item.actConcert);
            if (!content.length){
              return p;
            }
            p.push({
              'text':content,
              'type':'content'
            })
        } else {
            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              let content = getTextForSort(item.text);
              if (!content.length){
                return p;
              }
              p.push({
                'text':content,
                'type':'content'
              })
            }
        }
        return p;
      }else if (type == 'riskNoticeView'){ //风险提示
        let list = info.data || [];
        let p = [];
        for (let i = 0;i < list.length;i++){
          let item = list[i];
          let content = {
            'text':item.text,
            'type':'content',
          };
          p.push(content);
        }
        return p;
      }else if (type == 'bigSearchView'){ //大搜索组件
        let data = info.data;
        var list = [];
        if(data && data.list){
          list = data.list;
        }
        let p = [];
        for (let i = 0;i < list.length;i++){
          let item = list[i];
          let c = getTextForSort(item.title);
          if (!c.length){
            continue;
          }
          let url = getTextForSort(item.url);
          if (url.length){
            p.push({
              'text':c,
              'type':'content',
              'url':url
            })
          } else {
            p.push({
              'text':c,
              'type':'content',
            })
          }

          let s = getTextForSort(item.content);
          if (s.length){
            p.push({
              'text':s,
              'type':'subContent'
            })
          }
          let m = getTextForSort(item.mediaFrom);
          let w = getTextForSort(commonUtil.changeTimeForMinNoHours(item.publishAt));
          if (m.length || w.length){
            p.push({
              'text': m + '发布日期：' + w,
              'type':'weekContent'
            })
          }
        }
        return p;
      } else if (type == 'ParticipateHoldingCompanyView'){  //参控股公司
        let list = info.data;
        let p = [];
        if (list.length == 0){
          return p;
        }
        let head = [];
        head.push({
          'text':'公司',
          'type':'tabHead'
        });
        head.push({
          'text':'参控关系',
          'type':'tabHead'
        });
        head.push({
          'text':'参控比例',
          'type':'tabHead'
        });
        p.push(head);
        let body = [];
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          let a = getTextForSort(item.comName);
          let b = getTextForSort(item.relation);
          let c = getTextForSort(item.hldPercent.toString());
          if (a.length == 0 && b.length == 0 && c.length == 0){
            continue;
          }
          body.push({
            'text':a,
            'type':'tabBody'
          });
          body.push({
            'text':b,
            'type':'tabBody'
          });
          body.push({
            'text':c + '%',
            'type':'tabBody'
          });
        }
        p.push(body);
        return p;
      }else if (type == 'valuationGrade') {
        let p = renderData.datas.textValue;
        return p;
      }else if (type == 'knowAtlasView') {
        let p = renderData.textData;
        return p;
      } else if(type == 'autoReportDetailView'){
          var textValue = [];
          textValue.push({text:info.data.intro,type:'content'})
          textValue.push({text:'招股说明书',type:'source'})
        return textValue;
      } else if(type =='autoReportCompanyListView'){
        let companyInfoList = info.data.companyInfoList;
        var textValue = "";
          var textValuePush = [];
        if(util.arrayISNotEmpty(companyInfoList)){
          for (let i = 0; i < companyInfoList.length; i++) {
            let item = companyInfoList[i];
            textValue += item.name;
            if(i< companyInfoList.length -1){
              textValue += "、"
            }
          }
          textValue +='。';
        }
          textValuePush.push({text:textValue,type:'content'});
          textValuePush.push({text:'招股说明书',type:'source'});
        return textValuePush;
      } else if(type =='autoReportIndustryTrendView' ){
        let dataList = info.data;
        var textValue = [];
        if(util.arrayISNotEmpty(dataList)){
          for (let i = 0; i < dataList.length; i++) {
            let item = dataList[i];
            if(item.text){
              textValue.push({text:item.text,type:'content'})
            }
            if(item.organization){
              textValue.push({text:item.organization,type:'subContent'})
            }
            if(item.publishTime){
              textValue.push({text:commonUtil.changeTimeForMinNoHours(item.publishTime),type:'weekContent'})
            }
              if(item.organization && item.author){
                  textValue.push({text:item.organization + '-' + item.author,type:'source'})
              } else {
                  textValue.push({text:'招股说明书',type:'source'})
              }
          }
        }
        return textValue;
      } else if(type =='autoReportDetailUpStreamView' || type =='autoReportDetailDownStreamView'){
        let upStreamList = type =='autoReportDetailUpStreamView'? info.data.upStream :info.data.downStream;
        var textValue = ""
          var textValuePush = [];
        if(util.arrayISNotEmpty(upStreamList)){
          for (let i = 0; i < upStreamList.length; i++) {
            let item = upStreamList[i];
            textValue += item.name;
            if(i< upStreamList.length -1){
              textValue += "、"
            }
          }
          textValue +='。';
        }
          textValuePush.push({text:textValue,type:'content'});
          textValuePush.push({text:'招股说明书',type:'source'});
          return textValuePush;
      } else if(type =="robotFinanceIndex"){     //小e财务数据是
          var textValue = [];
          if(!util.isEmptyObj(info) && (info instanceof Array) && info.length >0 ){
            var list = info[0].list;
            if(list &&  (list instanceof Array) && list.length >1 ){
              var value = list[1][0];
              if(value && value != '--'){
                textValue.push({text:info,type:'content'});
              }
            }
          }
          textValue.push({text:'wind',type:'source'});
          textValue.push({text:renderData.date,type:"weekContent"});
        return textValue;
      } else if (type == "robotAnalysisDataIs") {
          var data = info.data;
          var timeUnit = info.timeUnit;
          let p = [];
          for (var i = 0; i < data.length; i++) {
              var item = data[i];
             
              var date = item.date;
              var time = "";
              if(timeUnit == 'year'){
                time = date && date.length > 4 ? date.substring(0, 4) + '年' :"--"
              } else {
                time = date && date.length > 7 ? date.substring(0, 4) + '年' + date.substring(4, 6) + '月' + date.substring(6, 8) + '日' : '--';
              }
            
              var unit = item.unit == null ? "" : item.unit;
              var propValue = commonUtil.formatMoneyByUnit(item.propValue,unit);
              var source = util.stringIsEmpty(item)  || util.stringIsEmpty(item.source) ? "交易所" : item.source;
              var body = [];
              body.push({
                  'text': time + item.entityName + item.propName,
                  'type': 'title'
              });
              
              body.push({
                  'text': propValue,
                  'type': 'content'
              });
              body.push({
                  'text': source,
                  'type': 'source'
              });
              body.push({
                  'text': date && date.length > 7 ? date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)  : '--',
                  'type': 'weekContent'
              });
              p.push(body);
          }
          return p;
      }
   
  }

};

function getTextForSort(text){
  return  text && typeof(text) === 'string' ? text.replace(/<img.*?(?:>|\/>)/gi,'',) : '';
}
export default templateToText;
