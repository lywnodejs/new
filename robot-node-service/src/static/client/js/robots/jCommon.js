


/**
 * 调用移动端的公共方法
 * @param callbackMethod    移动端执行的方法名
 * @param params    方法所需参数（对象类型）
 * @param timeOut   是否超时
 * @param timeString    定时器的ID（用于倒计时后执行移动端的方法）
 */
function commonCallback(callbackMethod, params, timeOut, timeString) {
    if (typeof (params) === 'string') {
        params = params.replace(/~/g, '"');
        params = JSON.parse(params);
    }
    // if (timeOut && timeString) {
    //     clearInterval(timeOut);
    //     $("." + timeString).html("");
    // }
    try {
        switch (urlParams.platform) {
            case 'ios':
                window.webkit.messageHandlers[callbackMethod].postMessage(params);
                break;
            case "android":
                var str = params === 1 || params === "1" ? '' : JSON.stringify(params);
                window.contestapp[callbackMethod](str);
                break;
        }
    }
    catch (e) {
        saveLog('jsError', e.message, location.href, 0, 'commonCallback(jCommon.js)', e.stack.toString());
    }
}

/**
 * 为后端传递多参数的执行方法
 * @param callbackMethod    方法名
 * @param stockCode 股票code
 * @param stockName 股票name
 */
function commonCallbackForString(callbackMethod, stockCode, stockName) {
    try {
        switch (urlParams.platform) {
            case 'ios':
                var params = {
                    stockCode: stockCode,
                    stockName: stockName
                };
                window.webkit.messageHandlers[callbackMethod].postMessage(params);
                break;
            case "android":
                window.contestapp[callbackMethod](stockCode, stockName);
                break;
        }
    } catch (e) {
        saveLog('jsError', e.message, 'jCommon.js', 0, 'commonCallbackForString()', e.stack.toString());
    }
}
