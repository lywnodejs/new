/**
 * Created by lijian on 2018/5/9.
 */
/**
 * @param time 1970.1.1日起的毫秒数
 * @return {string} YYYY-MM-DD HH:MM格式的字符串
 */
export function formatDate(time) {
  if (time == "" || time == undefined || time == "Invalid Date") {
    return "";
  }
  var spl = "-";
  var date = new Date();
  date.setTime(time);
  var month = date.getMonth() + 1;
  var monthStr = getTwoNumber(month);
  var day = date.getDate();
  var dayStr = getTwoNumber(day);
  var hour = date.getHours();
  var hourStr = getTwoNumber(hour);
  var minutes = date.getMinutes();
  var minutesStr = getTwoNumber(minutes);
  return date.getFullYear() + spl + monthStr + spl + dayStr + ' ' + hourStr + ":" + minutesStr;
}
/**
 * @param time 1970.1.1日起的毫秒数
 * @return {string} YYYY-MM-DD格式的字符串
 */
export function formatDateNoSeconds(time) {
  if (time == "" || time == undefined || time == "Invalid Date") {
    return "";
  }
  var spl = "-";
  var date = new Date();
  if (time != undefined && time != "") {
    date.setTime(time);
    var month = date.getMonth() + 1;
    var monthStr = getTwoNumber(month);
    var day = date.getDate();
    var dayStr = getTwoNumber(day);
    return date.getFullYear() + spl + monthStr + spl + dayStr;
  }
}
/**
 * @param number 数字
 * @return 小于10则返回前面加0的字符串，大于10则直接返回对应的字符串
 */
export function getTwoNumber(number) {
  return String((number >= 10) ? number : ("0" + number));
}
export function compareDate(date1, date2) {
  if (!date1 || !date2)
    return false;
  let dt1 = new Date(date1).getTime();
  let dt2 = new Date(date2).getTime();
  return dt1 == dt2;
}
//获取浏览器参数
export function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = decodeURI(window.location.search).substr(1).match(reg);
  if (r !== null)
    return decodeURI(r[2]);
  return null;
}
