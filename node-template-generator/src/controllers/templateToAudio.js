import commonUtil from '../utils/commonUtil';
import util from '../utils/com-util'
var templateToAudio = {
  getTextByType:function (renderData,type){

    var info = renderData.info;
    if(!commonUtil.checkObjectIsNull(info)){
      return "";
    }
   if (type == "robotAnalysisDataIs") {
     var data = info.data;
     var timeUnit = info.timeUnit;
     let p = "";
     for (var i = 0; i < data.length; i++) {
       var item = data[i];
       var propValue = item.propValue;
       var date = item.date;
       var time = "";
       if(timeUnit == 'year'){
         time = date && date.length > 4 ? date.substring(0, 4) + '年' :"--"
       } else {
         time = date && date.length > 7 ? date.substring(0, 4) + '年' + date.substring(4, 6) + '月' + date.substring(6, 8) + '日' : '--';
       }
       var unit = item.unit == null ? "" : item.unit;
       if(i >0 ){
         p +=","
       }
       p  += time + item.entityName + item.propName  +":"+ propValue + unit;
     }
     return p;
   } else if(type == "knowledgeView"){
     let p = "";
     var data = info.data;
     if(data){
       var list = data.list;
       if(list.length>0){
         p = list[0].text
       }
     }
     return p;
   }
   return "";
  }

};

export default templateToAudio;
