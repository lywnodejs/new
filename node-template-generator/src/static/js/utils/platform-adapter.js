var appKey;
/**
 *
 */
function EncodeUtf8(s1) {
  // escape函数用于对除英文字母外的字符进行编码。如“Visit W3School!”->"Visit%20W3School%21"
  var s = escape(s1);
  var sa = s.split("%");//sa[1]=u6211
  var retV ="";
  if(sa[0] != "")
  {
    retV = sa[0];
  }
  for(var i = 1; i < sa.length; i ++)
  {
    if(sa[i].substring(0,1) == "u")
    {
      retV += Hex2Utf8(Str2Hex(sa[i].substring(1,5)));
      if(sa[i].length>=6)
      {
        retV += sa[i].substring(5);
      }
    }
    else retV += "%" + sa[i];
  }
  return retV;
}

function Str2Hex(s)
{
  var c = "";
  var n;
  var ss = "0123456789ABCDEF";
  var digS = "";
  for(var i = 0; i < s.length; i ++)
  {
    c = s.charAt(i);
    n = ss.indexOf(c);
    digS += Dec2Dig(eval(n));
    
  }
  //return value;
  return digS;
}
function Dec2Dig(n1)
{
  var s = "";
  var n2 = 0;
  for(var i = 0; i < 4; i++)
  {
    n2 = Math.pow(2,3 - i);
    if(n1 >= n2)
    {
      s += '1';
      n1 = n1 - n2;
    }
    else
      s += '0';
    
  }
  return s;
  
}
function Dig2Dec(s)
{
  var retV = 0;
  if(s.length == 4)
  {
    for(var i = 0; i < 4; i ++)
    {
      retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
    }
    return retV;
  }
  return -1;
}
function Hex2Utf8(s)
{
  var retS = "";
  var tempS = "";
  var ss = "";
  if(s.length == 16)
  {
    tempS = "1110" + s.substring(0, 4);
    tempS += "10" +  s.substring(4, 10);
    tempS += "10" + s.substring(10,16);
    var sss = "0123456789ABCDEF";
    for(var i = 0; i < 3; i ++)
    {
      retS += "%";
      ss = tempS.substring(i * 8, (eval(i)+1)*8);
      
      
      
      retS += sss.charAt(Dig2Dec(ss.substring(0,4)));
      retS += sss.charAt(Dig2Dec(ss.substring(4,8)));
    }
    return retS;
  }
  return "";
}

function isEmpty(str) {
  return typeof str == "undefined" || null == str || str.length == 0;
}

function getCookie(name) {
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg)) return decodeURIComponent((arr[2]));
  else return null;
}

/**
 * 根据args返回要跳转的url
 * @param args 与调用App的gotoPage方法传的args相同,带pageId和其他页面参数
 * @returns 若在配置中能找到匹配的url,则返回填充参数后的url;若找不到,则返回null
 */
function getUrlByArgs(args){
  // 异常处理
  if(null == args) return null;
  var pageId = args["pageId"];
  if(isEmpty(pageId)) return null;
  
  // 这段代码处理pageId对应复杂值(通过数组管理多个url)的情况,找到匹配的url
  var url = map[pageId];
  if(isEmpty(url)) return null;
  
  if(typeof url == "object") { // TODO 优化数组判断逻辑
    var temp;
    for(var i in url) {
      temp = url[i];
      var matchKey = temp["matchKey"];
      if(matchKey && temp["matchValue"] == args[matchKey]) {
        break;
      }
    }
    url = temp["matchUrl"];
  }
  
  if(typeof url != "string") return null;
  
  // 这段代码处理url,填充参数
  for(var key in args){
    var reg = new RegExp("{" + key + "}","g");
    url = url.replace(reg, args[key]);
  }
  var reg = new RegExp("{[a-zA-Z0-9]+}", "ig"); // TODO 匹配优化
  url = url.replace(reg, "");
  
  var prefix = window.pa.prefix;
  // 当前url中不为http开头
  // pa.prefix中设置了前缀，且前缀包含http字符串
  if (url.indexOf('http') != 0 && prefix) {
    url = prefix + url;
  }
  return url;
}


var pa = {
  
  isAndroid: function() {
    return (/Android/i).test(navigator.userAgent);
  },
  isIOS: function() {
    return (/iPhone|iPad|iPod/i).test(navigator.userAgent);
  },
  isAndroidApp: function () {
    return this.isAndroid() && (/com.hundsun.stockwinner.hczq/i).test(navigator.userAgent);
  },
  isIOSApp: function() {
    return this.isIOS() && (/com.hczq.officialApp/i).test(navigator.userAgent);
  },
  isApp: function() {
    return this.isAndroidApp() || this.isIOSApp();
  },
  isOtherApp: function() {
    return getCookie('otherApp');
  },
  isWeixin: function() {
    var ua = window.navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) == 'micromessenger';
  },
  isWeChatMini: function() {
    var appKey_temp = appKey;
    if(isEmpty(appKey_temp)){
      appKey_temp = getCookie("appKey");
    }
    return (/miniprogram/i).test(appKey_temp);
  },
  isBroswer: function() {
    return !(this.isApp() || this.isWeixin());
  },
  isPC:function () {
    var u = navigator.userAgent;
    var p = navigator.platform;
    var system = {
      win: false,
      mac: false,
      xll: false,
      ipad:false
    };
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false;
    //跳转语句，如果是手机访问就自动跳转到" "里的页面
    return  system.win || system.mac || system.xll||system.ipad;
  },
  isLogin: function() {
    return !isEmpty(getCookie("token")) && !isEmpty(getCookie("uid"));
  },
  getClientName: function() {
    return getCookie("clientName");
  },
  getUid: function() {
    return getCookie("userId");
  },
  getMobile: function() {
    return getCookie("mobile");
  },
  getAppVersion: function() {
    return getCookie("appVersion");
  },
  getIOSVersion: function(){
    if(!this.isIOS()) return;
    var ver = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    ver = parseInt(ver[1], 10);
    return ver
  },
  back:function () {
    if (this.isAndroidApp()) {
      window.contestapp.back();
    } else if (this.isIOSApp()) {
      window.webkit.messageHandlers.back.postMessage('1');
    } else {
      if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ //IE
        if(history.length > 0){
          window.history.back();
        }else{
          window.opener=null;window.close();
        }
      } else{ //非IE浏览器
        if (navigator.userAgent.indexOf('Firefox') >= 0 ||
          navigator.userAgent.indexOf('Opera') >= 0 ||
          navigator.userAgent.indexOf('Safari') >= 0 ||
          navigator.userAgent.indexOf('Chrome') >= 0 ||
          navigator.userAgent.indexOf('WebKit') >= 0){
          
          if(window.history.length > 1){
            window.history.back();
          }else{
            window.opener=null;window.close();
          }
        }else{ //未知的浏览器
          window.history.back();
        }
      }
    }
  },
  urlIsRxhui:function(url) {
    return (/rxhui.com/i).test(url) || (/jinhui001.com/i).test(url);
  },
  navigationNative: function (args){
    var appArg = args;
    if(typeof(args) == 'object'){
      appArg = JSON.stringify(args);
    }
    if (this.isAndroidApp()) {
      window.contestapp.navigationNative(appArg);
    } else if (this.isIOSApp()) {
      window.webkit.messageHandlers.navigationNative.postMessage(appArg);
    } else {
      var argsObj;
      if (!(typeof(args) == "object" && Object.prototype.toString.call(args).toLowerCase() == "[object object]" && !args.length)) {
        argsObj = JSON.parse(args);
      } else {
        argsObj = args;
      }
      // var argsObj = JSON.parse(args);
      // var argsObj = args;
      if(typeof (argsObj) == 'object'){
        if(argsObj.url){
          var url = this.addAppkeyToUrl(argsObj.url);
          if(this.isWeChatMini()){ // 微信小程序内，只能打开备案过的网页
            if(this.urlIsRxhui(url)){
              this.openURL(url);
            }
          } else {
            this.openURL(url);
          }
        }
      }
    }
  },
  addAppkeyToUrl:function (url) {
    if(url.indexOf("?") != -1){
      url += "&appKey="  + appKey;
    } else {
      url += "?appKey="  + appKey;
    }
    return url;
  },
  openURL:function(url){
    if(this.isPC()){
      window.open( url);
    } else {
      window.location = url;
    }
  },
  setRightMenuListForAPP: function (args){
    var appArg = args;
    if(typeof(args) == 'object'){
      appArg = JSON.stringify(args);
    }
    if (this.isAndroidApp()) {
      window.contestapp.setRightMenuList(appArg);
    } else if (this.isIOSApp()) {
      window.webkit.messageHandlers.setRightMenuList.postMessage(appArg);
    } else {
      if( args.url){
        window.location = args.url;
      }
    }
  },
  
  
  // 登录资金账号
  loginFountAccountForAPP: function(args){
    
    var appArg = args;
    if(typeof(args) == 'object'){
      appArg = JSON.stringify(args);
    }
    if (this.isAndroidApp()) {
      window.contestapp.loginFountAccount(appArg);
    } else if (this.isIOSApp()) {
      window.webkit.messageHandlers.loginFountAccount.postMessage(appArg);
    } else {
      if( args.url){
        window.location = args.url;
      }
    }
    
  },
  
  
  /**
   * 执行一个方法,处理跨平台调用
   * @param funcName
   * @param args
   * @param alterFunc
   */
  callFuncWithArg: function (funcName, args){
    var appArg = args;
    if(typeof(args) == 'object'){
      appArg = JSON.stringify(args);
    }
    if (this.isAndroidApp()) {
      window.contestapp[funcName](appArg);
    } else if (this.isIOSApp()) {
      window.webkit.messageHandlers[funcName].postMessage(appArg);
    } else {
      // this[funcName](args);
    }
  },
  digDataToSensorTrack: function (args){
    var appArg = args;
    if(typeof(args) == 'object'){
      appArg = JSON.stringify(args);
    }
    if (this.isAndroidApp()) {
      window.contestapp.track(appArg);
    } else if (this.isIOSApp()) {
      window.webkit.messageHandlers.track.postMessage(appArg);
    } else {
      
    }
  }
};

