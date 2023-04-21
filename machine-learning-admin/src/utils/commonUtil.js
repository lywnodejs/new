/**
 * Created by BoBo on 2017-07-19.
 */
/**
 * 格式化查询参数，将日期格式化为毫秒，过滤掉值为空的参数
 * @param model 例：queryModel{page:1, size:10, ...}
 * @returns {{}}
 */
import $ from 'jquery'
export function generateQueryParams(model) {
  let params = {};
  let flag = false;
  for (let i in model) {
    let data = model[i];
    if (data instanceof Date)
      params[i] = new Date(data).getTime();
    else if (data !== undefined && data !== '')
      params[i] = data;
    flag = true;
  }
  return flag ? params : model;
}

/**
 * 格式化查询参数，将日期格式化为毫秒，过滤掉值为空的参数
 * @param model 例：queryModel{page:1, size:10, ...}
 * @returns {{}}
 */
export function priceConvert(price) {
  // if (!price) {
  //   return '0.00';
  // }
  if (price+''==='0' || isNaN(price-0)) {
    return '0.00'
  }

  let dw = '';

  // if(price > 100000000){
  //   price = price/10000;
  //   dw = '万';
  // }

  let p
  let p1
  p = String(Math.round(price * 100))
  p1 = p.substr(p.length - 2, p.length)
  p = p.substr(0, p.length - 2)

  let pattern = /(?=((?!\b)\d{3})+$)/g;
  p = p.replace(pattern, ',');
  if (dw == '') {
    p = p + '.' + p1;
  } else {
    p = p + dw;
  }

  return p
}

/**
 * 格式化金额
 * @param money
 * @returns {string}
 */
export function formatMoney(money) {
  return (Number(money).toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
/**
 * 格式化金额
 * @param money
 * @returns {string}
 * 整数
 * 修改人：xym 日期2017-12-14
 */
export function formatTimeWithSec(time) {
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
  var seconds = date.getSeconds();
  var secondsStr = getTwoNumber(seconds);
  return date.getFullYear() + spl + monthStr + spl + dayStr + ' ' + hourStr + ":" + minutesStr + ":" + secondsStr;
}
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
  return date.getFullYear() + spl + monthStr + spl + dayStr;
}
/**
 * @param time 1970.1.1日起的毫秒数
 * @return {string} YYYY-MM-DD HH:MM格式的字符串
 */
export function format_Date(time) {
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
  return date.getFullYear() + spl + monthStr + spl + dayStr + '  '+ hourStr+':'+ minutesStr;
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
/**
 * @资金保留两位数
 */
export function fundFilter(num) {
  if (num !== undefined && num !== '') {
    return (Number(num).toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  }
  return num;
}

export function fundFilter2(num) {
  if (num < 0) {
    num = 0
  }
  if (num !== undefined && num !== '') {
    return (Number(num).toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  }
  return num;
}

/**
 * 生成一个随机ID
 * @returns {string}
 */
export function generateRandomId() {
  let randomTime = new Date().getTime();
  return randomTime + (Math.random() * 1000).toFixed(0);
}

/**
 * 对比两个日期是否为同一天
 * @param date1
 * @param date2
 * @returns {boolean} 如果是返回true
 */
export function compareDate(date1, date2) {
  if (!date1 || !date2)
    return false;
  let dt1 = new Date(date1).getTime();
  let dt2 = new Date(date2).getTime();
  return dt1 == dt2;
}

/**
 * 向指定日期追加天数
 * @param date
 * @param dayNum
 * @returns {*}
 */
export function addDayToDate(date, dayNum) {
  date.setDate(date.getDate() + dayNum);
  return date;
}


// 全局cookie
const COOKIE_CONFIG = {
  name: 'admin.com',
  value: '',
  domain: '.china-lin.com',
  path: '/',
  expires: ''
}
// 生产
// const HTTP = 'https://ifadmin.china-lin.com/';
// 测试
// const HTTP = 'https://ibadmin.staging.china-lin.com/';
// 预发布
// const HTTP = 'http://ifadmin-beta.china-lin.com/';
const HTTP = window.location.origin+'/';

/**
 * 判断是否登录
 */
export function isLogin() {
  if(/^http\:..(localhost)|(192\.168\.200\...)|(127\.0\.0\.1).[0-9]{4}.$/.test(HTTP)){
    document.cookie='admin.com="R_AWoLkFdC8="';
    return true;
  }else{
    return !!getCookie(COOKIE_CONFIG.name);
  }
}
/**
 * 跳转到登录页面
 */
export function goLogin() {
  if(/^http\:..(localhost)|(192\.168\.200\...)|(127\.0\.0\.1).[0-9]{4}.$/.test(HTTP)){
    location.href = HTTP + '#/UserCustomer/';
  }else{
    location.href = HTTP + 'a/hello';
  }
  return;
}
export function clear_cookie(options) {
  let t = options.expires = new Date();
  let day = -1;
  t.setTime(+t + day * 864e+5);
  let cookies = [
    options.name, '=', options.value,
    options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
    options.path ? '; path=' + options.path : '',
    options.domain ? '; domain=' + options.domain : '',
    options.secure ? '; secure' : ''
  ].join('');
  // clearCookie();
  document.cookie = cookies;
}
export function logout_clear() {
  clear_cookie(COOKIE_CONFIG);
}
/**
 * 跳到登录页面
 */
export function logout() {
  logout_clear();
  location.href = HTTP + 'a/logout';
  return;
}
/**
 * 跳到登录页面for fetch
 */
export function logoutFetch() {
  logout_clear();
  location.href = HTTP + 'a/logout';
  return;
}
//获取cookie
export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}
//设置cookie
export function SetCookie(name, value) {
  var hours = 24; //此 cookie 将被保存 1 天
  var exp  = new Date();    //new Date("December 31, 9998");
  exp.setTime(exp.getTime() + hours*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
//获取cookie
export function getJoinCookie(name)//取cookies函数
{
  var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
  if(arr != null) return unescape(arr[2]); return null;
}

export function deleteChoose(this_) {
  let targetText=$(this_).parent().text().split('：')[1];
  // console.log(targetText);
  // console.log($(this_).parent.parent.text());
  // console.log(this_.parentNode);

  $(this_).parent().before($(this_).parent().text().split('：')[1]);
  $(this_).parent().remove();
  return this_;
}
export function delCookie (name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}


//传入一个数组返回一个数组各元素用","拼接的字符串
export function stringForArray(array,elimiter) {
  var str = "";
  for (var i = 0; i < array.length; i++) {
    str += array[i]+elimiter;
  }
//去掉最后一个逗号(如果不需要去掉，就不用写)
  if (str.length > 0) {
    let leh = 1
    if (elimiter =='^_^') {
      leh=3
    }
    str = str.substr(0, str.length - leh);
  }
  return str;

}
//传入字符串和分割符返回数组
export  function arrayForString(str,elimiter) {

  if(typeof str == "undefined" || str == null || str == ""){
    return [];
  }
  var strs = new Array(); //定义一数组
  strs = str.split(elimiter); //字符分割
  return strs

}
//给数组字符串前面加上序号
export  function arrayAddIndex(array) {
  var strs = new Array(); //定义一数组

  for (var i = 0; i < array.length; i++) {

    strs.push(i+1+"."+" "+array[i])
  }

  return strs
}


// 用变量保存可以加速对对象原型的hasOwnProperty的访问。
var hasOwnProperty = Object.prototype.hasOwnProperty;

export function isEmpty(obj) {
  // 本身为空直接返回true
  if (obj == null) return true;
  // 然后可以根据长度判断，在低版本的ie浏览器中无法这样判断。
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;
  //最后通过属性长度判断。
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;

}

/**根据当前的域名host 配出预览机器人问答的地址*/
export function getCurrentPreViewHost(){

  if (window.location.host.indexOf("10.0.0.22:10034") !== -1){
    return 'http://dev.robot.jinhui001.com:8080'

  }else if(window.location.host.indexOf("10.0.0.105:10029") !== -1){
    //测试
    // return 'http://10.0.0.105:10033'
    return 'http://staging.robot.jinhui001.com'
  }else if(window.location.host.indexOf("dialogue-manage.rxhui.com") !== -1){
    // 生产
    // return 'https://htyw.rxhui.com'
      return ' https://robot.rxhui.com'

  }else if(window.location.host.indexOf("dialogue-manageali.rxhui.com") !== -1){
    // 阿里云生产
    return 'http://robot-ali.rxhui.com'

  }else {
    //开发
    return 'http://dev.robot.jinhui001.com:8080'
  }
}


/**根据当前的域名host 配出模板答案预览的地址*/
export function getCurrentTemplateAnswerHost(){
  if(window.location.host.indexOf("10.0.0.105:10029") !== -1){
    //测试
    return 'http://reports.jinhui001.com'

  }else if(window.location.host.indexOf("dialogue-manage.rxhui.com") !== -1||
    window.location.host.indexOf("dialogue-manageali.rxhui.com") !== -1){  //生产

    return 'https://stock-report.rxhui.com'

  } else { // 开发，本地

    return 'http://10.0.0.22:10030'

  }

}
/**根据当前的域名host 配出模板平台的地址*/
export function getTemplatePlatformHost(){
  if(window.location.host.indexOf("10.0.0.105:10029") !== -1){
    //测试
    return 'http://10.0.0.105:10030'

  }else if(window.location.host.indexOf("dialogue-manageali.rxhui.com") !== -1){  //阿里环境

    return 'http://module-template-ali.rxhui.com'

  } else if(window.location.host.indexOf("dialogue-manage.rxhui.com") !== -1){
    //生产
    return 'http://module-template.rxhui.com'

  } else { // 开发，本地

    return 'http://10.0.0.22:10035'

  }
}

/**根据当前的域名host 配出知识图谱的地址*/
export function getKnowledgeformHost(){
  if(window.location.host.indexOf("10.0.0.105:10029") !== -1){
    //测试
    // return 'http://www.knowledgemapadmin.com/#/relationContrl'
    return 'http://knowledge-admin.10.0.0.105.nip.io'

  }else if(window.location.host.indexOf("dialogue-manageali.rxhui.com") !== -1){  //阿里生产

    return 'http://knowledge-ali.rxhui.com'

  } else if(window.location.host.indexOf("dialogue-manage.rxhui.com") !== -1){
    //生产
    return 'http://knowledge.rxhui.com'

  } else { // 开发，本地

    // return 'http://10.0.0.22:10018/#/relationContrl'
    return 'http://10.0.0.22:10018'


  }
}

/**根据当前的域名host 配出小e管理后台的地址*/
export function getxiaoEformHost(){
  if(window.location.host.indexOf("10.0.0.105:10029") !== -1){
    //测试
    return 'http://10.0.0.105:10003'

  }else if(window.location.host.indexOf("dialogue-manageali.rxhui.com") !== -1){  //阿里云环境

    return 'http://robot-admin-ali3.rxhui.com'

  }else if(window.location.host.indexOf("dialogue-manage.rxhui.com") !== -1){
    //生产
    return 'http://robot-admin.rxhui.com'

  }else { // 开发，本地

    return 'http://10.0.0.22:10003'

  }
}

