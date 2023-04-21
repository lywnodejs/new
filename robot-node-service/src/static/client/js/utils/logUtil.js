/**
 * Created by ZhaoBo on 2018-09-07.
 */

/**
 * 监听js运行时错误/ajax请求错误
 * @param errorMessage
 * @param scriptURI
 * @param lineNumber
 * @param columnNumber
 * @param errorObj
 */
window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj){
    // console.log('window.onerror', errorMessage, scriptURI, lineNumber, columnNumber, errorObj)
    var err = '';
    try{
        if(errorObj)
            err = errorObj.stack || 'no stack';
        else if(window.event)
            err = window.event.error.stack || 'no stack';
    }catch (e) {}

    saveLog('jsError', errorMessage, scriptURI, lineNumber, columnNumber, err)
};

/**
 * 监听全局【未处理】的ajax请求错误
 */
$.ajaxSetup({
  error: ajaxErrorHandler
});

/**
 * ajax类型的错误
 * @param event
 * @param xhr
 * @param options
 * @param exc
 */
function ajaxErrorHandler(event,xhr,options,exc) {
    console.log(event,xhr,options,exc)
    var msg = "method:"+this.type+",status:"+event.status+",statusText:"+event.statusText;
    saveLog('ajaxError', msg, this.url, 0, 0, event.responseJSON?event.responseJSON:'');
}

/**
 * Vue中的js错误
 * @param error
 * @param vm
 */
function saveVueLog(error, vm){
  saveLog('vueError', error.message, vm.$vnode.tag, 0, 0, error.stack.toString())
}

/**
 * Vue中的接口请求错误
 * @param error
 */
function saveAxiosLog(error) {
  saveLog('axiosError', error.response.data, error.config.url, 0, 0, error.response.status+","+error.response.statusText);
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
    var type = '';
    try {
        var connection = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
        if(connection){
            type = connection.type || connection.effectiveType || '未知网络';
        }
    }catch (e) {
        type = '未知网络';
        // alert('保存日志发生错误:'+e.message)
    }
    var date = new Date();
    var time = date.getTime();
    var domain = location.protocol+'//'+location.host;
    var deviceInfo = {
        n: type, //	网络类型
        t: time, //	事件发生时间	13位毫秒级时间戳
        h: domain, //域名
        v: navigator.userAgent, //客户端浏览器版本信息
        r: window.innerWidth+"*"+window.innerHeight, //手机分辨率
        c: window.appFrom || (window.urlParams ? window.urlParams.platform : '') || getPlatform(), //客户端类别 Android、iOS、website
        p: 'robot', //客户端包名
        s: window.appVersion || (window.urlParams ? window.urlParams.appVersion : '') || '', //客户端版本号
        cl: window.appKey || (window.urlParams ? window.urlParams.appKey : ''), //客户端渠道
        pn: window.phoneNumber, //电话号码
        i: window.userId || (window.urlParams ? window.urlParams.userId : ''), //设备唯一标识
        uid: window.clientId || '' //用户标识
    };
    var logs = [{
        "errorType": errorType ? errorType : '',
        "errorMsg": errorMessage ? errorMessage : '',
        "errorFile": scriptURI ? scriptURI : '',
        "errorLineNo": lineNumber ? lineNumber : '',
        "errorColumnNo": columnNumber ? columnNumber : '',
        "errorDetail": errorObj ? errorObj : '',
        "errorTime": date.toLocaleString()
    }];
    requestForLogE(JSON.stringify(deviceInfo), JSON.stringify(logs));
}

/**
 * 将报错信息发送到后端的接口
 * 日志写入到node-log-service/log/android-robot.log|ios-robot.log|website-robot.log三个文件中
 * @param {object} deviceInfo 所需日志对象
 * @param {object} logs 所需日志对象
 */
function requestForLogE(deviceInfo, logs) {
    var logHTTP = '/logs/';
    // var logHTTP = 'http://10.0.0.21:9097';
    // var logHTTP = 'http://127.0.0.1:9097';
    $.ajax({
        type: "POST",
        url: logHTTP + '/save',
        timeout: 10000,
        data: {
            deviceInfo: deviceInfo,
            logs: logs
        },
        success: function (json) {
            if (json.code === 0) {
                console.log('报告已传至后台...');
            }
        },
        error: function (e) {
            // console.log(e);
            // alert('调用日志接口error:'+e.message)
        }
    });
}
// function requestForLogE(deviceInfo, logs) {
//     var logHTTP = '/api/log/save';
//     // var logHTTP = 'http://10.0.0.21:9097';
//     $.ajax({
//         type: "POST",
//         url: logHTTP ,
//         timeout: 10000,
//         data: {
//             deviceInfo: deviceInfo,
//             logs: logs
//         },
//         success: function (json) {
//             if (json.code === 0) {
//                 console.log('报告已传至后台...');
//             }
//         },
//         error: function (e) {
//             // console.log(e);
//             // alert('调用日志接口error:'+e.message)
//         }
//     });
// }

/**
 * 判断移动端平台类型
 * @returns {string}
 */
function getPlatform() {
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
