/**
 * Created by BoBo on 2016-12-26.
 */
// 解决四舍六入五成双不统一的问题
Number.prototype.toFixed=function (d) {
    var s=this+"";
    if(!d)d=0;
    if(s.indexOf(".")==-1)s+=".";
    s+=new Array(d+1).join("0");
    if(new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(d+1)+"})?)\\d*$").test(s)){
        var s="0"+RegExp.$2,pm=RegExp.$1,a=RegExp.$3.length,b=true;
        if(a==d+2){
            a=s.match(/\d/g);
            if(parseInt(a[a.length-1])>4){
                for(var i=a.length-2;i>=0;i--){
                    a[i]=parseInt(a[i])+1;
                    if(a[i]==10){
                        a[i]=0;
                        b=i!=1;
                    }else break;
                }
            }
            s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");
        }if(b)s=s.substr(1);
        return (pm+s).replace(/\.$/,"");
    }return this+"";
};

// 日期Format
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//资金单位变更
function changeMoney(money) {
    var flag = 0;
    money = String(money);
    if (money.indexOf(".") !== -1) {
        money = money.split(".")[0];
    }
    if (money.indexOf("-") !== -1) {
        money = money.replace("-", "");
        flag = 1;
    }
    if (money.length > 8) {
        money = money.slice(0, money.length - 8) + "." + money.slice(money.length - 8, money.length - 6) + "亿";
    }
    else {
        money = money.slice(0, money.length - 4) + "." + money.slice(money.length - 4, money.length - 2) + "万";
    }
    if (flag === 1) {
        return "-" + money;
    } else {
        return money;
    }

}

/**
 * 格式化人民币，注意：原始数据以万为单位
 * @param value
 * @returns {*}
 */
function formatMoney(value) {
    //console.log(value)
    if (!isNaN(value)) {
        var prefix = "";
        if (value < 0)
            prefix = "-";

        if (value === 0)
            return value;

        value = Math.abs(value);

        if (value > 10e3 && value < 10e7)
            return prefix + (value / 10e3).toFixed(2) + '亿';
        else {
            var temp = value.toFixed(2);
            if (temp.length > 6)
                temp = temp.substr(0, 1) + ',' + temp.substring(1);
            return prefix + temp + '万';
        }
    }
    else {
        return '--';
    }
}

/**
 * 格式化成交量
 * @param value 股数
 * @returns {*} 手数
 */
function formatVolume(value) {
    if (!isNaN(value)) {
        if (value < 10 * 10000)
            return value / 100;
        else
            return (value / (100 * 10000)).toFixed(2) + '万';
    } else {
        return value;
    }
}

/**
 * 格式化成交额
 * @param value
 * @param precision
 * @returns {*}
 */
function formatAmount(value, precision) {
    if (!isNaN(value)) {
        precision = precision || 2;

        var prefix = "";
        if (value < 0){
            prefix = "-";
            value = Math.abs(value);
        }

        if (value < 1e4)
            return prefix + value.toFixed(precision) + '元';
        else if (value < 1e8)
            return prefix + (value / 1e4).toFixed(precision) + '万';
        else if (value < 1e12)
            return prefix + (value / 1e8).toFixed(precision) + '亿';
        else
            return prefix + (value / 1e12).toFixed(precision) + '万亿';
    } else {
        return value ? value : '--';
    }
}

/**
 * 格式化数字
 * @param value
 * @param precision 小数点精度
 * @param fixSmallNumber 是否格式化小于1万的数， 默认值为：true
 * @returns {*}
 */
function formatNumber(value, precision, fixSmallNumber) {
    if(isNaN(value)){
        return '--';
    }
    else if (value) {
        if(precision === undefined || precision === '' || precision === null)
            precision = 2;

        if(fixSmallNumber === undefined)
            fixSmallNumber = true;

        var prefix = '';
        if(value < 0){
            value = Math.abs(value);
            prefix = '-';
        }

        if (value < 10e3)
            return fixSmallNumber ? prefix + value.toFixed(precision) : value;
        else if (value < 10e7)
            return prefix + (value / 10e3).toFixed(precision) + '万';
        else if (value < 10e11)
            return prefix + (value / 10e7).toFixed(precision) + '亿';
        else
            return prefix + (value / 10e11).toFixed(precision) + '万亿';
    }
    else {
        return value===0 ? value.toFixed(2) : '--';
    }
}

//日期格式转换
function timeChange(nS,delimiter) {
    if (nS) {
        var date = new Date(parseInt(nS));
        return [date.getFullYear(), String(date.getMonth() + 1).length > 1 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1), String(date.getDate()).length > 1 ? date.getDate() : "0" + date.getDate()].join(delimiter||'-');
    } else {
        return '';
    }
}

//日期格式转换 pledgeUpDate
function timeChangeForPledgeUpDate(nS) {
    if (nS) {
        var date = new Date(parseInt(nS));
        return '（更新于'+[date.getFullYear(), String(date.getMonth() + 1).length > 1 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1), String(date.getDate()).length > 1 ? date.getDate() : "0" + date.getDate()].join('-')+"）";
    } else {
        return '';
    }
}

//日期格式转换
function changeTime(nS, suffix) {
    if (!nS || isNaN(nS))
        return '';

    if(!suffix)
        suffix = '-';

    var date = new Date(parseInt(nS));
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    // h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())+ ':';
    // m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
    // s = date.getSeconds();
    return Y + suffix + M + suffix + D;
}

//日期格式转换
function changeTimeForHour(nS) {
    if (!nS || isNaN(nS))
        return '';
    var date = new Date(parseInt(nS));
    h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    s = date.getSeconds();
    return h + m;
}

//日期格式转换
function changeTimeForMin(nS) {
    if (!nS || isNaN(nS))
        return '';
    var date = new Date(parseInt(nS));
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    return Y + M + D + h + m;
}

//历史时间格式转换
function changeTimeCache(nS) {
    if (!nS || isNaN(nS))
        return '';
    var date = new Date(parseInt(nS));
    var Y = date.getFullYear();
    var M = date.getMonth() + 1;
    var D = date.getDate();
    var h = (date.getHours() > 12 ? (appKey === 'appHtyw' ? "pm " : '下午') + (date.getHours() - 12) : (appKey === 'appHtyw' ? "am " : '上午') + date.getHours());
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    if (new Date(nS).toDateString() === new Date().toDateString()) {
        return h + ":" + m;
    } else if (new Date(nS) < new Date()) {
        return Y + "年" + M + "月" + D + "日  " + h + ":" + m;
    }
}

/**
 * 根据毫秒数获取季
 * @param time
 * @returns {string}
 */
function getSeasonByTime(time) {
    if (!time || isNaN(time))
        return '';
    var date = new Date(time);
    var month = date.getMonth() + 1;
    var season = '';
    if (month == 3)
        season = '(一季报)';
    else if (month == 6)
        season = '(年中报)';
    else if (month == 9)
        season = '(三季报)';
    else if (month == 12)
        season = '(年报)';
    return season;
}

//股权激励字段说明
function incSubject(num) {
    var incSubject;
    if (!num || isNaN(num))
        return '';
    if (num == 1)
        incSubject = '期权';
    else if (num == 2)
        incSubject = '股票';
    else if (num == 3)
        incSubject = '股票增值权';
    return incSubject;
}

//股权激励字段说明
function incType(num) {
    var incType;
    if (!num || isNaN(num))
        return '';
    if (num == 1)
        incType = '股东转让股票';
    else if (num == 2)
        incType = '股票增值权';
    else if (num == 3)
        incType = '上市公司定向发行股票';
    else if (num == 4)
        incType = '上市公司提取激励基金买入流通A股';
    else if (num == 5)
        incType = '授予期权,行权股票源为股东转让股票';
    else if (num == 6)
        incType = '授予期权,行权股票来源为上市公司定向发行股票';
    return incType;
}

/**
 * 激励总数单位
 * @param num2 奖励方式
 */
function incAmount(num1,num2){
    var incAmount;
    if (!num1 || isNaN(num1)||!num2 || isNaN(num2))
        return '';
    if(num2 !=2 ){
        return incAmount= num1+'万份'
    }else{
        return incAmount= num1+'万股'
    }
    return incAmount
}

//获取浏览器参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r !== null)
        return decodeURI(r[2]);
    return null;
}

//判断是否是微信浏览器
function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) === "micromessenger";
}

/**
 * 替换该文章中的回车符
 * @param content
 * @returns {*}
 */
function replaceLineBreak(content) {
    try {
        var summary = content;
        var reg = new RegExp(/[\u4e00-\u9fa5]{1}\r\n[\u4e00-\u9fa5]{1}/g);
        var matches = summary.match(reg);
        for (var m in matches) {
            var t = matches[m].replace('\r\n', '');
            summary = summary.replace(matches[m], t);
        }
        summary = summary.replace(/(\r)*\n(\s)+/g, '');
        reg = new RegExp(/(\r)*\n+(\s){0}/g);
        matches = summary.match(reg);
        for (var n in matches) {
            var index = summary.indexOf(matches[n]);
            if (index !== 0)
                summary = summary.replace(matches[n], '</br></br>');
        }
        return summary;
    } catch (e) {
        // alert(e.message);
        var string = content || '';
        string = string.replace(/\r\n/g, "<BR>");
        string = string.replace(/\n/g, "<BR>");
        saveLog('jsError', e.message, location.href, 0, 'replaceLineBreak()', e.stack.toString());
        return string;
    }
}

/**
 * 标红关键字
 * @param sourceText
 * @param keywords
 */
function highlightText(sourceText, keywords) {
    if (!sourceText)
        return '';

    if (!keywords)
        return sourceText;

    keywords.forEach(function (item) {
        sourceText = sourceText.replace(eval('/' + (item.indexOf('*')!==-1?'\\'+item:item) + '/g'), '<s class="t_red">' + item + '</s>');
    });
    return sourceText;
}

//生成UUID的方法
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

// 获取顶点用户信息的转义
getChannelValueByCode = function (code) {
    if (code == 'wx') {
        return 0x0001;
    } else if (code == 'gw') {
        return 0x0003;
    } else if (code == 'app') {
        return 0x0002;
    } else if (code == 'hq') {
        return 0x0006;
    } else {
        return 0x0004;
    }
};

getUserTypeValueByCode = function (code) {
    if (code == 'zs') {
        return 0x0010;
    } else if (code == 'zc') {
        return 0x0020;
    } else if (code == 'nm') {
        return 0x0030;
    }
};

/**
 * 停止原生的loading
 */
function stopLoad() {
    try{
        if(appFrom === 'android')
            window.stockpingapp.stopLoading();
        else if(appFrom === 'ios')
            window.top.stopLoading();
    } catch (e) {
        // saveLog('jsError', e.message, location.href, 0, 'stopLoad()', e.stack.toString());
    }
}

/**
 * 设置原生页面右上角按钮
 * @param index SHOW_SHARE_BTN
 */
function setTitleBarBtn(index) {
    try{
        if(appFrom === 'android')
            window.stockpingapp.setRightBtnState(index);
        else if(appFrom === 'ios'){
            window.top.setRightBtnState(index);
        }
    } catch (e) {
        // saveLog('jsError', e.message, location.href, 0, 'setTitleBarBtn()', e.stack.toString());
    }
}

/**
 * 生成随机class名
 * @param classNamePrefix 前缀
 */
function generateRandomClassName(classNamePrefix) {
    return (classNamePrefix || '') + (Math.random() * 1e8).toFixed(0);
}

//小数点保存后两位
function fixed2(num) {
    return (!isNaN(num) && num !== '') ? num.toFixed(2) : '--';
}

//加"%"
function addPer(num) {
    // console.log(num);
    return num ? (num>=0.01?num.toFixed(2) + "%":'<0.01%') : '--';
}

// 加%，不区分正负
function addPerForPositiveAndNegative(num){
    return num ? (num.toFixed(2) + "%") : '--';
}

//处理小于0.00001的数值加"%"
function addPerForMin(hldAmount,hldPercent) {
    // console.log(hldPercent);
    return hldAmount ? (hldPercent?(hldPercent>=0.01?hldPercent.toFixed(2) + "%":'<0.01%'):'<0.01%') : '--';
}
/**
 * 生成UUID的方法
 * @returns {string}
 */
function uuid2() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

/**
 * 截断字符
 * @param str 要截取的字符串
 * @param len 要展示的长度
 * @returns {*}
 */
function truncateString(str, len) {
    var temp = str;
    if (!len)
        len = 100;

    if (str) {
        if (str.length <= len)
            temp = str;
        else
            temp = str.substr(0, len) + '...';
    }
    return temp;
}

/**
 * 判断object里是否有值，以及值是否为空
 * @param obj
 */
function checkObjectIsNull(obj) {
    var flag = false;
    for (var p in obj) {
        if (obj[p]) {
            flag = true;
            break;
        }
    }
    return flag;
}

/**
 * 格式化20170801为2017-08-01
 * @param date
 * @returns {string}
 */
function generateDate(date, toYear) {
    var temp = date;
    if (date) {
        date = date.toString();
        if (date.length === 8)
            temp = date.substr(0, 4) + (toYear?'年':'-') + date.substr(4, 2) + (toYear?'月':'-') + date.substr(6, 2) + (toYear?'日':'');
    }
    else
        temp = '--';
    return date ? temp : '--';
}

/**
 * 一般报价的文字颜色
 * @param num
 * @returns {string}
 */
function getClsByNumber(num) {
    var txtCls = '';
    if (num > 0)
        txtCls = 't_red';
    else if (num < 0)
        txtCls = 't_green';
    return txtCls;
}

/**
 *  从entity中取出股票代码
 * @param entity
 * @param returnMarketType 是否返回市场代码
 */
function getSymbolByEntity(entity, returnMarketType) {
    var symbol = '';
    for (var i = 0; i < entity.length; i++) {
        if (entity[i].type === '股票' || entity[i].type === '指数') {
            var marketType = '';
            if (returnMarketType !== false)
                marketType = entity[i].property.marketType;
            symbol = marketType + entity[i].property.code;
            break;
        }
    }
    return symbol;
}

/**
 * 从entity中取出property属性
 * @param entity
 * @returns {string}
 */
function getPropertyByEntity(entity) {
    var property = '';
    if(entity){
        for (var i = 0; i < entity.length; i++) {
            if (entity[i].type === '股票' || entity[i].type === '指数') {
                property = entity[i].property;
                break;
            }
        }
    }
    return property;
}

/**
 * 计算百分比
 * @param num1
 * @param num2
 * @returns {number}
 */
function getPercentage(num1, num2) {
    var flag = 0;
    if (num2 === 0)
        return flag;
    return num1 / num2 * 100;
}

// 几小时前的时间方法
function getDataGridTimeFormat(time, needTime) {
    time = parseInt(time);
    if (needTime === undefined) {
        needTime = false;
    }
    var now = new Date();
    var publishDate = new Date(time);
    if (inOnDay(now.getTime(), time)) {
        if ((now.getTime() - publishDate.getTime()) < 3600 * 1000) {
            var minutes = Math.ceil((now.getTime() - publishDate.getTime()) / (60 * 1000));
            if (minutes < 0) {
                minutes = 0;
            }
            return minutes + "分钟前";
        }
        else {
            var hours = now.getHours() - publishDate.getHours();
            return hours + "小时前";
        }
    }
    if (needTime) {
        return getTimeStr_more(time);
    }
    else {
        return getTimeStr(time);
    }
}

function getTimeStr_more(time) {
    var date = new Date(time);
    return getTimeStr(time) + " " + getTwoNumber(date.getHours()) + ":" + getTwoNumber(date.getMinutes());
}

function getTimeStr(time) {
    var spl = "-";
    var date = new Date();
    if (time != undefined && time != "")
        date.setTime(time);
    var month = date.getMonth() + 1;
    var monthStr = getTwoNumber(month);
    var day = date.getDate();
    var dayStr = getTwoNumber(day);
    return date.getFullYear() + spl + monthStr + spl + dayStr;
}

/**
 * 判断两个时间是否在同一天
 * @param time1
 * @param time2
 * @returns {boolean}
 */
function inOnDay(time1, time2) {
    var date1 = new Date(time1);
    var date2 = new Date(time2);

    var temp;

    if (date1.getFullYear() !== date2.getFullYear()) {
        temp = date1.getFullYear() - date2.getFullYear();
    }
    else if (date1.getMonth() !== date2.getMonth()) {
        temp = date1.getMonth() - date2.getMonth();
    }
    else {
        temp = date1.getDate() - date2.getDate();
    }

    return temp === 0;
}

function getTwoNumber(number) {
    return String((number >= 10) ? number : ("0" + number));
}

/**
 * 判断当前回答的主体是否为股票
 * @param result
 * @returns {boolean}
 */
function isStock(result) {
    var flag = false;
    try {
        var entity = result.questionAnalyse[0].entity || [];
        entity.forEach(function (item, index) {
            if (item.type === '股票')
                flag = true;
        })
    } catch (e) {
        flag = false;
        saveLog('jsError', e.message, 'commonUtil.js', 0, 'isStock()', e.stack.toString());
    }
    return flag;
}

//调用原生方法
function callAppFunction(funName, params) {
    if (appFrom === 'android') {
        window.contestapp[funName](params);
    } else if (appFrom === 'ios') {
        window.webkit.messageHandlers[funName].postMessage(params);
    }
}

/**
 * 判断时间是否在交易时间
 * @param time
 * @returns {boolean}
 */
function isInTradeTime(time) {
    var date = new Date(time);
    // console.log(date);
    var t = date.getHours().toString() + getTwoNumber(date.getMinutes());
    t = parseInt(t);
    var flag = false;
    if (t >= 930 && t <= 1500)
        flag = true;
    return flag;
}

/**
 * 版本比较，如果currentVersion>=minVersion返回true，否则返回false
 * @param minVersion
 * @param currentVersion
 */
function checkVersion(minVersion, currentVersion) {
    var flag = false;

    if (!minVersion || !currentVersion)
        return flag;

    if (minVersion === currentVersion) {
        flag = true;
    }
    else {
        var arrMin = minVersion.split('.');
        var arrCurrent = currentVersion.split('.');
        var len = arrMin.length;
        for (var i = 0; i < len && i < arrCurrent.length; i++) {
            if (parseInt(arrCurrent[i]) > parseInt(arrMin[i])) {
                flag = true;
                break;
            } else if (parseInt(arrCurrent[i]) < parseInt(arrMin[i])) {
                flag = false;
                break;
            }
        }
    }

    return flag;
}

/**
 * 判断是否为PC端
 * @returns {boolean}
 * @constructor
 */
function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

/**
 * 判断移动端平台类型
 * @returns {string}
 */
function getMobileType() {
    var type = 'pc';
    var u = navigator.userAgent;
    if (u.toLowerCase().indexOf('micromessenger') !== -1) {
        type = 'wx';
    } else if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        type = 'android';
    } else if (u.indexOf('iPhone') > -1) {
        type = 'ios';
    } else if (u.indexOf('Windows Phone') > -1) {
        type = 'win'
    } else {
        type = 'pc';
    }
    return type;
}

/**
 * 1. 增：在b标签加样式名：b_red
 * 2. 减：在b标签加样式名：b_green
 * 3. 新：在b标签加样式名：b_blue
 * 4. 未变：在li标签上加样式名：null
 * @param type
 * @returns {string}
 */
function getHolderClsByType(type) {
    var cls = {class: '', name: ''};
    switch (type){
        case 1:
            cls.class = 'b_blue';
            cls.name = '新';
            break;
        case 2:
            cls.class = 'b_red';
            cls.name = '增';
            break;
        case 3:
            cls.class = 'b_green';
            cls.name = '减';
            break;
        case 4:
            cls.class = 'null';
            cls.name = '未';
            break;
    }
    return cls;
}

/**
 * 深拷贝对象
 * @param source
 */
function deepCopy(source) {
    return JSON.parse(JSON.stringify(source));
}

function ifUndefined(val){
    return val?val:'--';
}

function ifNone(val){
    return val?val:'';
}

// 加单位 unit string
function valueUnit(value,unit){
    if (!isNaN(value)) {
        var prefix = "";
        if (value < 0)
            prefix = "-";

        if (value === 0)
            return value;

        value = Math.abs(value);

        if (value < 10e3)
            return prefix + value.toFixed(2)+unit;
        else if (value < 10e7)
            return prefix + (value / 10e3).toFixed(2) + '万'+unit;
        else
            return prefix + (value / 10e7).toFixed(2) + '亿'+unit;
    } else {
        return value || '--';
    }
}

//备用
function getProperty(obj, full_path)
{
    console.log(full_path)
    if(!obj || !full_path || typeof (full_path) !== 'string')
        return false;

    var props = full_path.split('.');
    var self = obj;

    for (var ii = 0; ii < props.length; ++ii)
    {
        var prop = props[ii];
        var hasMoreComing = ii < props.length - 1;

        if (self[prop] !== null && typeof self[prop] === 'object' && hasMoreComing)
        {
            self = self[prop];
            continue;   // Move up one level.
        }
        else if (hasMoreComing)
            return self[prop];    // ..because user queries a subproperty of a value type

        return self[prop];
    }
    return undefined;
}

function formatMsgTime (timespan) {
    var dateTime = new Date(timespan);

    var year = dateTime.getFullYear();
    var month = dateTime.getMonth() + 1;
    var day = dateTime.getDate();
    var hour = dateTime.getHours();
    var minute = dateTime.getMinutes();
    var second = dateTime.getSeconds();
    var now = new Date();
    var now_new = Date.parse(now.toDateString());  //typescript转换写法

    var milliseconds = 0;
    var timeSpanStr;

    milliseconds = now_new - timespan;

    if (milliseconds <= 1000 * 60 * 1) {
      timeSpanStr = '刚刚';
    }
    else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
      timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
    }
    else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
      timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
    }
    else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
      timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
    }
    else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
      timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
    } else {
      timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    }
    return timeSpanStr;
  }

function getPatentRevel(value){
    if(value==1){
        return '较高';
    }else if(value==2){
        return '一般';
    }else if(value==3){
        return '较低';
    }
}
function getPatentRevelCommon(value){
    if(value==1){
        return '看好该企业创造价值能力。';
    }else if(value==2){
        return '该企业创造价值能力一般。';
    }else if(value==3){
        return '不看好该企业创造价值能力。';
    }
}

/**
 * 将字符类型的数字转换为整数或浮点数
 * @param numStr
 * @returns {number}
 */
function parseNumber(numStr) {
    if(numStr){
        if(numStr.indexOf('.') !== -1)
            return parseFloat(numStr);
        else
            return parseInt(numStr);
    }
    return numStr;
}

// 转换日期为2017Q1 ||　2017一季报
function getQuarterLabel(value, type, shortYear){
    var en = {
        '00': '',
        '03': 'Q1',
        '06': 'Q2',
        '09': 'Q3',
        '12': 'Q4'
    };

    var zh = {
        '00': '',
        '03': '一季报',
        '06': '二季报',
        '09': '三季报',
        '12': '四季报'
    };

    var season = {
        '00': '',
        '03': '年第一季度',
        '06': '年第二季度',
        '09': '年第三季度',
        '12': '年第四季度'
    };

    var zh2 = {
        '00': '',
        '03': ' 一季报',
        '06': ' 中报',
        '09': ' 三季报',
        '12': ' 年报'
    };

    var quarter = en;
    if(type === 'zh')
        quarter = zh;
    if(type === 'zh2')
        quarter = zh2;
    else if(type === 'season')
        quarter = season;

    var month = '00';
    var year = '';
    var str = value.toString();
    year = str.substr(shortYear?2:0, shortYear?2:4);
    if(str.length > 4)
        month = str.substr(4, 2);

    return year+quarter[month];
}

// 根据中文返回对应的周期
function getPeriodByZh(zh) {
    var period = 'allQuarter';
    switch (zh) {
        case '全部':
            period = 'allQuarter';
            break;
        case '年报':
            period = 'year';
            break;
        case '中报':
            period = 'twoQuarter';
            break;
        case '一季报':
            period = 'oneQuarter';
            break;
        case '三季报':
            period = 'threeQuarter';
            break;
    }
    return period;
}

// 根据指标返回对应的指标选项
function getOptionByIndex(index) {
    var options = {
        epsBasic: {name: '每股收益', unit: '元', dividedBy: 1},
        sFaBps: {name: '每股净资产', unit: '元', dividedBy: 1},
        sFaSurpluscapitalps: {name: '每股公积金', unit: '元', dividedBy: 1},
        sFaUndistributedps: {name: '每股未分配', unit: '元', dividedBy: 1},
        sfaOcfps: {name: '每股现金流', unit: '元', dividedBy: 1},
        totOperRev: {name: '营业总收入', unit: '亿元', dividedBy: 1e8},
        operProfit: {name: '营业利润', unit: '亿元', dividedBy: 1e8},
        grossRev: {name: '毛利润', unit: '亿元', dividedBy: 1e8},
        netProfit: {name: '归属净利润', unit: '亿元', dividedBy: 1e8},
        waaRoe: {name: 'ROE', unit: '%', dividedBy: 1},
        roic: {name: 'ROIC', unit: '%', dividedBy: 1},
        netCashFlowsOperAct: {name: '经营现金流', unit: '亿元', dividedBy: 1e8},
        netCashFlowsInvAct: {name: '投资现金流', unit: '亿元', dividedBy: 1e8},
        netCashFlowsFncAct: {name: '融资现金流', unit: '亿元', dividedBy: 1e8},
        balanceSheet: {name: '资产负债表', unit: '亿元', dividedBy: 1e8},
        marValue: {name: '总市值', unit: '亿元', dividedBy: 1e8},
        sFaGrossprofitmargin: {name: '毛利率', unit: '%', dividedBy: 1},
        sFaNetprofitmargin: {name: '净利率', unit: '%', dividedBy: 1},
        sFaRoa: {name: 'ROA', unit: '%', dividedBy: 1},
        sFaOcftoprofit: {name: '经营现金流/净利润', unit: '%', dividedBy: 1},
        sFaCurrent: {name: '流动比率', unit: '倍', dividedBy: 1},
        sFaQuick: {name: '速动比率', unit: '倍', dividedBy: 1},
        sFaDebttoassets: {name: '资产负债率', unit: '%', dividedBy: 1},
        sFaAssetsturn: {name: '总资产周转率', unit: '次', dividedBy: 1},
        sFaCaturn: {name: '流动资产周转率', unit: '次', dividedBy: 1},
        sFaFaturn: {name: '固定资产周转率', unit: '次', dividedBy: 1},
        sFaTurndays: {name: '营业周期', unit: '天', dividedBy: 1},
        sFaInvturndays: {name: '存货周转天数', unit: '天', dividedBy: 1},
        sFaYoynetprofit: {name: '净利润同比增长率', unit: '%', dividedBy: 1},
        sFaYoyTr: {name: '营业收入同比增长率', unit: '%', dividedBy: 1},
        // 2019.05.23 三期增加
        capiAdeRatio: {name: '资本充足率', unit: '%', dividedBy: 1},
        nplRatio: {name: '不良贷款率', unit: '%', dividedBy: 1},
        netCapital: {name: '资本净额', unit: '亿元', dividedBy: 1e8},
        loanDepoRatio: {name: '存贷比率', unit: '%', dividedBy: 1},
        // sFaYoyTr1: {name: '内含价值', unit: '%', dividedBy: 1},
        lossRatioProperty: {name: '赔付率(产险)', unit: '%', dividedBy: 1},
        intrinsicValueLife: {name: '内含价值(寿险)', unit: '亿元', dividedBy: 1e8},
        insurPremUnearned: {name: '已赚保费', unit: '亿元', dividedBy: 1e8},
        netCapitalVal: {name: '净资本', unit: '亿元', dividedBy: 1e8},
        floatMarValue : {name: '流通市值', unit: '亿元', dividedBy: 1e4},
        // epsBasic: {name: 'EPS', unit: '元', dividedBy: 1},
        sFaOptogr: {name: '营业利润率', unit: '%', dividedBy: 1},
        operExpenseRatio: {name: '营业费用率', unit: '%', dividedBy: 1},
        freeCashFlow: {name: '自由现金流', unit: '亿元', dividedBy: 1e8},
        cashReRatio: {name: '现金再投资比率', unit: '%', dividedBy: 1},
        cashAdequacyRatio: {name: '现金流量允当比率', unit: '%', dividedBy: 1},
        sFaCurrentdebttodebt: {name: '流动负债率', unit: '%', dividedBy: 1},
        sgr: {name: '可持续增长率', unit: '%', dividedBy: 1},
        sFaYoyEquity: {name: '净资本增长率', unit: '%', dividedBy: 1},
        sFaArturn: {name: '应收账款周转率', unit: '次', dividedBy: 1},
    };
    return options[index];
}
