import utils from './com-util'
import format from './format'

function getTimeByName(name,today) {
  var startTime ;
  var oneDay = 24*60*60*1000;
  switch (name){
    case "近一日":
      startTime = today - oneDay;
      break;
    case "近五日":
      startTime = today - 5*oneDay;
      break;
    case "近一月":
      startTime = today - 30*oneDay;
      break;
    case "近三月":
      startTime = today - 90*oneDay;
      break;
    case "近六月":
    case "近半年":
      startTime = today - 182*oneDay;
      break;
    case "近一年":
      startTime = today - 365*oneDay;
      break;
    case "近五季":
      startTime = today - (365+90)*oneDay;
      break;
    case "近二年":
      startTime = today - 365*2*oneDay;
      break;
    case "近三年":
      startTime = today - 365*3*oneDay;
      break;
    case "近四年":
      startTime = today - 365*4*oneDay;
      break;
    case "近五年":
      startTime = today - 365*5*oneDay;
      break;
    default:
      break;
  }
  return format.formatDateNoSpace(startTime);
}



module.exports = {
  getDateParams: function (timeRangeType,data) {
    var startAt = data.startAt;
    var endAt = data.endAt;
    var param = {};
    if (utils.stringIsEmpty(endAt) ) {
      var today = new Date().getTime();
      endAt =  format.formatDateNoSpace(today);
    }
    var endTime = new Date(format.getTimeByDate(endAt));
    if (utils.stringIsEmpty(startAt) ) {
      var startDate = new Date();
      startDate.setFullYear(endTime.getFullYear() -1,endTime.getMonth(),endTime.getDate());
      startDate.setHours(0,0,0,0);
      startAt =  format.formatDateNoSpace(startDate);
    }
    switch (timeRangeType) {
      case 0://任意时间 
        //有动参时取用
        break;
      case 1://近一段区间
        startAt = getTimeByName(data.timeInterval,endTime);
        break;
      case 2://自定义区间
        break;
    }
    param.startAt = startAt;
    param.endAt =  endAt;
    return param;
  },

  timeFormatToMillion:function(str){
    var d = str.toString();

    var _y = Number(d.substr(0, 4));
    var _m = Number(d.substr(4, 2)) - 1;
    var _d = Number(d.substr(6, 2));
    var _date = Date.UTC(_y, _m, _d);//转换成Date.UTC(1970,  5, 20)格式[Date.UTC(1970,  9, 27), 0   ],
    return _date;
  }
};

