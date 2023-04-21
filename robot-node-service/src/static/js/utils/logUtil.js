/**
 * Created by ZhaoBo on 2018-09-07.
 */

/**
 * 监听html/js类型错误
 * @param errorMessage
 * @param scriptURI
 * @param lineNumber
 * @param columnNumber
 * @param errorObj
 */
var logUtil = {
    params: {
        local: "/node/robot/"
    },
}


window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj){
    // console.log('window.onerror', errorMessage, scriptURI, lineNumber, columnNumber, errorObj)
    saveLog('error', errorMessage, scriptURI, lineNumber, columnNumber, errorObj)
};

/**
 * 监听全局【未处理】的ajax请求错误
 */
window.onload = function(){
  $.ajaxSetup({
    error: ajaxErrorHandler
  });
}


/**
 * ajax类型的错误
 * @param XMLHttpRequest
 * @param textStatus
 * @param errorThrown
 * @constructor
 */
function ajaxErrorHandler(XMLHttpRequest, textStatus, errorThrown) {
    // console.log(event,xhr,options,exc)
    saveLog('ajaxError', textStatus+","+errorThrown, XMLHttpRequest.url, 0, 0, XMLHttpRequest.data);
    // saveLog('ajaxError', (this.type+","+event.status+","+options), this.url, 0, 0, "");
}

/**
 * 记录日志发送到后端
 * @param errorType 错误类型
 * @param errorMessage  错误信息
 * @param scriptURI  文件路径|接口路径
 * @param lineNumber 行数
 * @param columnNumber  列数
 * @param errorObj 错误详细信息，可能为空
 */
function saveLog(errorType, errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
    try {
        var time = new Date().toLocaleString();
        var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        var type = connection.type;
        var deviceInfo = {
            c: window.appFrom || getMobileType(), //	客户端类别	否	(限定内容字符串)Android、iOS、website
            p: 'robot', //	客户端包名	否	(自定义字符串)，如 com.rxhui.pay
            n: type, //	网络类型	是	(自定义字符串)
            l: errorType, //	日志级别	否	(限定内容字符串)error、warn、info、debug
            t: time, //	事件发生时间	否	(限定内容字符串)13位毫秒级时间戳
            v: navigator.userAgent, //	客户端版本号	是	(自定义字符串)
            s: '', //	系统版本号	是	(自定义字符串)
            r: window.innerWidth+"*"+window.innerHeight, //	手机分辨率	是	(自定义字符串)
            cl: window.appKey, //	客户端渠道	是	(自定义字符串)
            pn: window.phoneNumber, //
            i: window.userId || (window.urlParams ? window.urlParams.userId : ''), //	设备唯一标识	是	(自定义字符串)
            uid: window.clientId || '' //	用户标识	是	(自定义字符串)
        };
        var logs = [{
            "errorType": errorType ? errorType : '',
            "errorMsg": errorMessage ? errorMessage : '',
            "errorFile": scriptURI ? scriptURI : '',
            "errorLineNo": lineNumber ? lineNumber : '',
            "errorColumnNo": columnNumber ? columnNumber : '',
            "errorDetail": errorObj ? errorObj : '',
            "errorTime": time
        }];
        requestForLog(JSON.stringify(deviceInfo), JSON.stringify(logs));
    }catch (e) {
        // alert('保存日志发生错误:'+e.message)
    }
}

/**
 * 将报错信息发送到后端的接口
 * 日志写入到node-log-service/log/android-robot.log|ios-robot.log|website-robot.log三个文件中
 * @param {object} deviceInfo 所需日志对象
 * @param {object} logs 所需日志对象
 */
function requestForLog(deviceInfo, logs) {
    var logHTTP = "/api/log/save";
    // var logHTTP = logUtil.params.local + "/api/log/save";
    $.ajax({
        type: "POST",
        url: logHTTP,
        timeout: 10000,
        data: {
            deviceInfo: deviceInfo,
            logs: logs
        },
        success: function (json) {
            if (json.code == 0) {
                console.log('node报告已传至后台...');
            }
        },
        error: function (e) {
            // console.log(e);
            // alert('调用日志接口error:'+e.message)
        }
    });
}

/**
 * 判断移动端平台类型
 * @returns {string}
 */
function getMobileType() {
    var type = 'website';
    var u = navigator.userAgent;
    if (u.toLowerCase().indexOf('micromessenger') !== -1) {
        type = 'weixin';
    } else if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        type = 'android';
    } else if (u.indexOf('iPhone') > -1) {
        type = 'ios';
    } else if (u.indexOf('Windows Phone') > -1) {
        type = 'win'
    } else {
        type = 'website';
    }
    return type;
}

// var deviceInfo = {
//         c: appFrom, //	客户端类别	否	(限定内容字符串)Android、iOS、website
//         p: 'robot', //	客户端包名	否	(自定义字符串)，如 com.rxhui.pay
//         // key: '', //	客户端校验appkey	是	(限定字符串)服务器端分配
//         // sign: '', //	客户端校验值	是	(限定字符串)服务器端分配
//         n: navigator.connection.effectiveType, //	网络类型	是	(自定义字符串)
//         l: errorType, //	日志级别	否	(限定内容字符串)error、warn、info、debug
//         t: time, //	事件发生时间	否	(限定内容字符串)13位毫秒级时间戳
//         v: navigator.userAgent, //	客户端版本号	是	(自定义字符串)
//         // d: '', //	硬件型号	是	(自定义字符串)
//         s: appVersion, //	系统版本号	是	(自定义字符串)
//         r: appW+"*"+appH, //	手机分辨率	是	(自定义字符串)
//         cl: appKey, //	客户端渠道	是	(自定义字符串)
//         // a: '', //	用户网络所属区域	是	(自定义字符串)
//         // o: '', //	运营商	是	(自定义字符串)
//         // ip: '', //	ip地址	是	(自定义字符串)
//         // dr: '', //	屏幕密度范围	是	(自定义字符串)
//         i: userId, //	设备唯一标识	是	(自定义字符串)
//         uid: this['clientId'] || userId //	用户标识	是	(自定义字符串)
//     };
