/**
 * Created by neville on 2017/10/25.
 */
/**
 * 调用移动端的公共方法
 * @param callbackMethod    移动端执行的方法名
 * @param params    方法所需参数（对象类型）
 * @param timeOut   是否超时
 * @param timeString    定时器的ID（用于倒计时后执行移动端的方法）
 */
function commonCallback(callbackMethod, params, timeOut, timeString) {
    // if(appKey === 'appEzt' || appKey === 'appTopC'){
        try {
            if (typeof (params) === 'string') {
                params = params.replace(/~/g, '"');
                params = JSON.parse(params);
            }
            // if (timeOut && timeString) {
            //     clearInterval(timeOut);
            //     $("." + timeString).html("");
            // }
            switch (appFrom) {
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
            sendPreAnswerContent('出错啦...请退出重试');
            scrollToBodyEnd();
            saveLog('jsError', e.message, 'eztCommon.js', 0, 'commonCallback()', e.stack.toString());
        }
    // }
}
/**
 * 为后端传递多参数的执行方法
 * @param callbackMethod    方法名
 * @param stockCode 股票code
 * @param stockName 股票name
 */
function commonCallbackForString(callbackMethod, stockCode, stockName) {
    try {
        // if(appKey === 'appEzt' || appKey === 'appTopC'){
            switch (appFrom) {
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
        // }
    } catch (e) {
        saveLog('jsError', e.message, 'eztCommon.js', 0, 'commonCallbackForString()', e.stack.toString());
    }
}
/**
 * 为取到的推送消息分配答案样式
 * @param json 取到的推送消息的对象
 */
function setAnswerForHistory(json) {
    var type = json.messageType;
    switch (type) {
        //股票预警提醒和个股大幅涨跌
        case '股价变更':
            if (JSON.parse(json.messageContent).objectType === "stock") {
                warningNotice(json);
            } else if (JSON.parse(json.messageContent).objectType === "index") {
                upsAndDowns(json);
            }
            break;
        case '风险提示':
            riskHintsPushing(json.userId,json.messageId,'history');

            break;
    }
}
/**
 * 晨间推送不同类型问题的展示样式的区分
 * @param json 取到的晨间消息的返回对象
 * @param pushType  消息类型
 */
function setAnswerForHistoryForMorning(json, pushType) {
    switch (pushType) {
        case "晨间消息":
            morningPush(json);
            break;
        case "行业推荐":
            hotTopicPush(json);
            break;
        case "中长期股票推荐":
        case "短期股票推荐":
            stockPush(json);
            break;
    }
}

/**
 * @param appFrom app来源
 * @param flag 是否开启话筒
 */
function hideInputAndShowTitleCover(appFrom, flag) {
    // console.log(flag);
    // if (appKey === 'appEzt' || appKey === 'appTopC') {
        try {
            switch (appFrom) {
                case 'ios':
                    window.webkit.messageHandlers.hideInputArea.postMessage(flag);
                    window.webkit.messageHandlers.showCoverView.postMessage(flag);
                    break;
                case "android":
                    window.contestapp.hideInputArea(flag);
                    window.contestapp.showCoverView(flag);
                    break;
            }
        } catch (e) {
            // saveLog('jsError', e.message, 'eztCommon.js', 0, 'hideInputAndShowTitleCover()', e.stack.toString());
        }
    // }
}
/**
 * e智通点击免责声明调用原生的函数
 * @param appFrom app来源
 * @param flag 是否开启话筒
 */
function eVoiceForRelief(appFrom, flag) {
    // console.log(flag);
    // if (appKey === 'appEzt' || appKey === 'appTopC') {
        try {
            switch (appFrom) {
                case 'ios':
                    window.webkit.messageHandlers.showCoverView.postMessage(flag);
                    break;
                case "android":
                    window.contestapp.showCoverView(flag);
                    break;
            }
        } catch (e) {
            // saveLog('jsError', e.message, 'eztCommon.js', 0, 'eVoiceForRelief()', e.stack.toString());
        }
    // }
}

/**
 * e智通自选股添加的入口
 */

function optionalStockEntrance(result, showInteractiveView) {
    if (!showInteractiveView) {
        showUnRecognizedMsg();
        return;
    }

    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);
    var hideClass = generateRandomClassName('');
    var soltInfo = {
        code: '',
        name: '',
        marketType: ''
    };
    if (result.data.soltInfo.hasOwnProperty("stock")) {
        soltInfo = result.data.soltInfo.stock;
    }
    var temp = "<div class='bd'> <div class='mb mb_btn'><div class=\'box_set" + " " + hideClass + "'><a onclick=\"addOptional('" + soltInfo.code + "','" + soltInfo.name + "','" + soltInfo.marketType + "','" + hideClass + "')\">加自选</a></div></div><div class='mb mb_noBord hide'><div class='box_addSet'><span>已添加</span></div></div></div></div>";
    appendAnswer(temp, "md_left_v2", result.qId);
    scrollToQuestion();
}

/**
 *加自选的方法
 * @param stockCode 股票code
 * @param stockName 股票name
 * @param marketType    股票marketType
 * @param hideClass 用于隐藏按钮的hideClass
 */
function addOptional(stockCode, stockName, marketType, hideClass) {
    var params = {
        marketType: marketType,
        stockCode: stockCode,
        stockName: stockName,
        hideClass: hideClass
    }
    //加自选
    var methodName = 'commandAddSelfStock';
    commonCallback(methodName, params);
}

/**
 * 加自选成功回调方法
 * @param hideClass 用于隐藏按钮的hideClass
 * @param flag 是否调用成功
 */
function requireAppMessage(hideClass, flag) {
    if (!flag || flag == 'false') {
    } else {
        $(".addOptional" + hideClass).hide();
        $(".deleteOptional" + hideClass).show();
        $("." + hideClass).parents(".mb_btn").next(".mb_noBord").addClass("show").removeClass("hide");
        $("." + hideClass).parents(".mb_btn").hide();
    }
}
/**
 * e智通委托指令的入口
 */
function buyingStockEntry(result, showInteractiveView) {
    if (!showInteractiveView) {
        showUnRecognizedMsg();
        return;
    }

    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    var soltInfo = {};
    var txt = '';
    var directiveType = result.data.directiveType;
    if (result.data.hasOwnProperty('soltInfo')) {
        soltInfo = result.data.soltInfo;
    }
    switch (directiveType) {
        case '卖出指令':
            txt = "卖出";
            break;
        case '买入指令':
            txt = "买入";
            break;
    }
    sendPreAnswerContent(word, '', '', result.qId);
    var market = soltInfo.hasOwnProperty("stock") ? soltInfo.stock.marketType : '';
    var code = soltInfo.hasOwnProperty("stock") ? soltInfo.stock.code : '';
    var name = soltInfo.hasOwnProperty("stock") ? soltInfo.stock.name : '';
    var price = soltInfo.hasOwnProperty("price") ? soltInfo.price : '';
    var number = soltInfo.hasOwnProperty("number") ? soltInfo.number : '';
    var temp = "<div class='bd'><div class='mb mb_btn'><div class='box_set buyingGoApp'><a onclick=\"transactionGoApp('" + market + "','" + code + "','" + name + "','" + price + "','" + number + "','" + directiveType + "')\">" + txt + "</a></div></div></div>";
    appendAnswer(temp, "md_left_v2", result.qId);
    scrollToQuestion();
}

/**
 * e智通买/卖股票跳到App
 * @param marketType
 * @param stockCode
 * @param stockName
 * @param price
 * @param count
 * @param direction
 */
function transactionGoApp(marketType, stockCode, stockName, price, count, direction) {
    var params = {
        marketType: marketType,
        stockCode: stockCode,
        stockName: stockName,
        price: price,
        count: count
    }
    //移动端执行的方法
    var methodName = '';
    if (direction == '买入指令') {
        methodName = 'commandTradeBuyIn';
    } else if (direction == '卖出指令') {
        methodName = 'commandTradeSellOut';
    }
    commonCallback(methodName, params);
}

/**
 * e智通委托成功
 */

function successForTransactionEntrust(res) {
    var result = appFrom == 'ios' ? res : JSON.parse(res);
    var json = result;
    if (json.state) {
        var direction = "";
        switch (json.type) {
            case "buy":
                direction = "买入";
                break;
            case "sell":
                direction = "卖出";
                break;
        }
        var word = direction + '委托成功！';
        sendPreAnswerContent(word, '', '', result.qId);
        var temp = "<div class='mb mb_w7'>";
        temp += "<div class='box_hdBlue box_buySuccess'>";
        temp += "<ul>";
        temp += "<li>";
        temp += "<p>" + json.stockName + "</p>";
        temp += "<h6>" + json.stockCode + "</h6>";
        temp += "</li>";
        temp += "<li>";
        temp += "<h6>" + changeTime(json.createTime) + "</h6>";
        temp += "<h6>" + changeTimeForHour(json.createTime) + "</h6>";
        temp += "</li>";
        temp += "</ul>";
        temp += "<ul>";
        temp += "<li>";
        temp += "<h5>" + direction + "价：<b>" + json.price + "元</b></h5>";
        temp += "</li>";
        temp += "<li>";
        temp += "<h5>" + direction + "量：<b>" + json.amount + "股</b></h5>";
        temp += "</li>";
        temp += "</ul>";
        temp += "</div>";
        temp += "</div>";
        appendAnswer(temp, "md_left_v2", result.qId);
        scrollToQuestion();
    }
}
/**
 * e智通清空自选股
 */
function clearOptionalStock(result, showInteractiveView) {
    if (!showInteractiveView) {
        showUnRecognizedMsg();
        return;
    }

    var hideClass = generateRandomClassName('');
    if (result.data.soltInfo.hasOwnProperty("stock")) {
        var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
        sendPreAnswerContent(word, '', '', result.qId);
        var data = result.data.soltInfo.stock;
        var temp = "<div class='bd'>";
        temp += "<div class='mb mb_btn show" + hideClass + "'>";
        temp += "<div class='box_set'>";
        temp += "<a onclick=\"clearOptionalGo('" + data.code + "','" + data.name + "','" + data.marketType + "','" + hideClass + "')\">删除</a>";
        temp += "</div>";
        temp += "</div>";
        temp += "<div style='display:none;' class='mb mb_noBord hide" + hideClass + "'>";
        temp += "<div class='box_addSet'>";
        temp += "<span>已删除</span>";
        temp += "</div>";
        temp += "</div>";
        temp += "</div>";
        appendAnswer(temp, "md_left_v2", result.qId);
        scrollToQuestion();
    } else {
        commonCallback('commandSelfStockList', 1);
    }
}
// 清空自选的回调方法
function successForClearOptionalStock(res) {
    var result = appFrom == 'ios' ? res : JSON.parse(res);
    var hideClass = result.hideClass;
    if (result.state) {
        $(".show" + hideClass).hide();
        $(".hide" + hideClass).show();
        $(".addOptional" + result.hideClass).show();
        $(".deleteOptional" + result.hideClass).hide();
    }
}
/**
 * e智通清空某个股票的预警设置
 */
function clearWarningGoApp(result, showInteractiveView) {
    if (!showInteractiveView) {
        showUnRecognizedMsg();
        return;
    }

    var hideClass = generateRandomClassName('');
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);
    console.log(result);
    var stockInfo = {
        code: '',
        name: '',
        marketType: ''
    };
    if (result.data.soltInfo.hasOwnProperty("stock")) {
        stockInfo = result.data.soltInfo.stock;
    }
    var temp = "<div class='bd'><div class='mb mb_btn'><div class='box_set'><a class='clear" + hideClass + "' onclick=\"clearGoApp('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\">清空</a><a style='display:none;' class='show" + hideClass + "' onclick=\"warningGoApp('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\">预警设置</a></div></div></div>";
    appendAnswer(temp, "md_left_v2", result.qId);
    scrollToQuestion();
}

/**
 * e智通设置预警跳到App
 */
function setEarlyWarningGoApp(result) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);
    if (result.questionAnalyse[0].hasOwnProperty('entity') && result.questionAnalyse[0].entity.length > 0) {
        var stockInfo = result.questionAnalyse[0].entity[0].property;
        var hideClass = generateRandomClassName('');
        var temp = "<div class='bd'><div class='mb mb_btn'><div class='box_set show" + hideClass + "'><a onclick=\"warningGoApp('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\">预警设置</a></div></div></div>";
        appendAnswer(temp, "md_left_v2", result.qId);
        scrollToQuestion();
    }
}

/**
 * 点击清除预警触发的方法
 */
function clearGoApp(code, name, marketType, hideClass) {
    var methodName = 'commandClearWarning';
    var params = {
        stockCode: code,
        stockName: name,
        marketType: marketType,
        hideClass: hideClass
    };
    commonCallback(methodName, params);
}
/**
 * 点击清除预警触发的方法
 */
function clearOptionalGo(code, name, marketType, hideClass) {
    var methodName = 'commandDeleteSelfStock';
    var params = {
        stockCode: code,
        stockName: name,
        marketType: marketType,
        hideClass: hideClass
    };
    commonCallback(methodName, params);
}

/**
 * 点击预警设置触发的方法
 */
function warningGoApp(code, name, marketType, hideClass) {
    var methodName = 'commandSetWarning';
    var params = {
        stock: {
            code: code,
            name: name,
            marketType: marketType,
            hideClass: hideClass
        }
    };
    commonCallback(methodName, params);
}
function successForClearPriceWarning(res) {
    var result = appFrom == 'ios' ? res : JSON.parse(res);
    if (result.state) {
        var hideClass = result.hideClass;
        $(".clear" + hideClass).hide();
        $(".show" + hideClass).show();
        $(".deleteWarning" + hideClass).hide();
        $(".addWarning" + hideClass).show();
    }
}

/**
 * e智通设置预警成功
 */
function successForSettingEntrust(res) {
    if (res) {
        var result;
        result = appFrom == 'ios' ? res : JSON.parse(res);
        $(".addWarning" + result.hideClass).hide();
        $(".deleteWarning" + result.hideClass).show();
        var word = '预警设置成功！';
        var myDate = Date.parse(new Date());
        sendPreAnswerContent(word, '', '', result.qId);
        var temp = "<div class='bd'><div class='mb mb_w7'><div class='box_hdBlue box_warnSuccess'>";
        temp += "<ul><li><p>" + result.stockName + "</p><h6>" + result.stockCode + "</h6></li><li><h6>" + changeTime(myDate) + "</h6><h6>" + result.time + "</h6></li></ul><ul>";
        temp += !!result.upperPrice ? "<li><h5>价格≥" + result.upperPrice + "元</h5></li>" : "";
        temp += !!result.riseRate || result.riseRate === 0 ? "<li><h5>日涨幅≥" + Math.abs(parseFloat(result.riseRate * 100)).toFixed(2) + "%</h5></li>" : "";
        temp += !!result.lowerPrice ? "<li><h5>价格≤" + result.lowerPrice + "元</h5></li>" : "";
        temp += !!result.dropRate || result.dropRate === 0 ? "<li><h5>日跌幅≥" + Math.abs(parseFloat(result.dropRate * 100)).toFixed(2) + "%</h5></li>" : "";
        temp += "</ul></div></div></div>";
        appendAnswer(temp, "md_left_v2", result.qId);
        scrollToBodyEnd();
    }
}

/**
 * e智通倒计时词条
 * @param instructionsTitle
 * @param instructionsFunction
 * @param result
 * @param isHistory
 * @param showInteractiveView
 * @param callJsFunction  是否调用js的方法，即不调用原生方法
 */
function countDownFunction(instructionsTitle, instructionsFunction, result, isHistory, showInteractiveView, callJsFunction) {
    // if (!showInteractiveView) {
    //     showUnRecognizedMsg();
    //     return;
    // }

    try{
        $(".showLoading").remove();
        var functionName = instructionsTitle;
        var params = result;
        // params = result ? result.data.soltInfo : 1;
        if(result){
            if(result.data){
                if(result.data.soltInfo)
                    params = result.data.soltInfo;
                else
                    params = result.data;
            }else{
                params = result;
            }
        }
        else{
            params = 1;
        }

        if(params){
            params = JSON.stringify(params).replace(/"/g, "~");
        }

        var talk = "<div class='hd'><div class='mb_avatar'><img alt='logo' onclick='setFeedbackMode()' src=" + headImg + "></div>";
        if(callJsFunction){
            talk += "<h4>打开<a onclick=\"callJsFun('" + instructionsFunction + "','" + params + "')\">" + functionName + "</a><b class='countDown '></b></h4></div>";
        }else{
            talk += "<h4>打开<a onclick=\"commonCallback('" + instructionsFunction + "','" + params + "')\">" + functionName + "</a><b class='countDown '></b></h4></div>";
        }
        appendAnswer(talk, 'md_left_v2', result.qId);

        if(!isHistory && callJsFunction){
            callJsFun(instructionsFunction, params);
        }else{
            commonCallback(instructionsFunction, params);
        }
    } catch (e) {
        saveLog('jsError', e.message, 'eztCommon.js', 0, 'countDownFunction()', e.stack.toString());
    }
}

//调用 js 方法
function callJsFun(fun, params, timeOut, timeString) {
    try {
        var temp = fun+"('"+params+"')";
        eval(temp);
    } catch (e) {
    }
}

/**
 * e智通股价预警通知或个股大幅涨跌
 */
function warningNotice(json) {
    var data = JSON.parse(json.messageContent);
    var txt = "";
    var word = json.messageTitle;
    switch (data.type) {
        case "rise_rate":
            txt = "涨幅于" + changeTimeForHour(data.triggerAt) + "达到<b class='t_red'>" + (parseFloat(data.changeRate) * 100).toFixed(2) + "%</b>";
            break;
        case "drop_rate":
            txt = "跌幅于" + changeTimeForHour(data.triggerAt) + "达到<b class='t_red'>" + (parseFloat(data.changeRate) * 100).toFixed(2) + "%</b>";
            break;
        case "upper_price":
        case "lower_price":
            txt = "股价于" + changeTimeForHour(data.triggerAt) + "达到<b class='t_red'>" + parseFloat(data.currentPrice).toFixed(2) + "元</b>";
            break;
    }
    sendPreAnswerContent(word, '', '', json.qId);
    var temp = "<div class='bd'>";
    temp += "<div class='mb'>";
    temp += "<h6 class='date'>" + changeTimeForMin(data.triggerAt) + "</h6>";
    temp += "<h5 class='warn'>您关注的<b>" + data.stockName + "</b>" + txt + "</h5>";
    temp += "<ul class='box_icon4'>";
    temp += "<li onclick=\"transactionGoApp('" + data.marketType + "','" + data.stockCode + "','" + data.stockName + "','','','买入指令')\">";
    temp += "<i class='icon-buy'></i>";
    temp += "<h6>买入</h6>";
    temp += "</li>";
    temp += "<li onclick=\"transactionGoApp('" + data.marketType + "','" + data.stockCode + "','" + data.stockName + "','','','卖出指令')\">";
    temp += "<i class='icon-sell'></i>";
    temp += "<h6>卖出</h6>";
    temp += "</li>";
    temp += "<li onclick=\"lookAtMarket('" + data.stockCode + "','" + data.stockName + "')\">";
    temp += "<i class='icon-quotation'></i>";
    temp += "<h6>看行情</h6>";
    temp += "</li>";
    temp += "<li onclick=\"technicalAnalysis('" + data.stockName + "')\">";
    temp += "<i class='icon-technical_analysis'></i>";
    temp += "<h6>技术分析</h6>";
    temp += "</li>";
    temp += "</ul>";
    temp += "</div>";
    temp += "</div>";
    appendAnswer(temp, 'md_left_v2', json.qId);
    scrollToQuestion();
}


/**
 * e智通股指数大幅涨跌
 */
function upsAndDowns(json) {
    // console.log(json);
    var data = json;
    var word = data.messageTitle;
    var dataContent = JSON.parse(data.messageContent);
    // console.log(dataContent);
    sendPreAnswerContent(word, '', '', json.qId);
    var temp = "<div class='bd'>";
    var txt = "";
    temp += "<div class='mb'>";
    temp += "<h6 class='date'>" + changeTimeForMin(dataContent.triggerAt) + "</h6>";
    switch (dataContent.type) {
        case "rise_rate":
            txt = "涨幅于" + changeTimeForHour(dataContent.triggerAt) + "达到<b class='t_red'>" + (parseFloat(dataContent.changeRate) * 100).toFixed(2) + "%</b>";
            break;
        case "drop_rate":
            txt = "跌幅于" + changeTimeForHour(dataContent.triggerAt) + "达到<b class='t_green'>" + (parseFloat(dataContent.changeRate) * 100).toFixed(2) + "%</b>";
            break;
    }
    temp += "<h5 class='warn'><b>" + dataContent.stockName + "</b>" + txt + "</h5>";
    temp += "<ul class='box_icon4'>";
    temp += "<li onclick=\"technicalAnalysis('" + dataContent.stockName + "')\">";
    temp += "<i class='icon-technical_analysis'></i>";
    temp += "<h6>技术分析</h6>";
    temp += "</li>";
    temp += "<li onclick=\"commonCallbackForString('navigationToStockDetail','" + dataContent.stockCode + "','" + dataContent.stockName + "')\">";
    temp += "<i class='icon-quotation'></i>";
    temp += "<h6>指数行情</h6>";
    temp += "</li>";
    temp += "<li onclick=\"commonCallback('navigationToTrade',1)\">";
    temp += "<i class='icon-transaction'></i>";
    temp += "<h6>去交易</h6>";
    temp += "</li>";
    temp += "<li onclick=\"goOptional('1')\">";
    temp += "<i class='icon-add_optional'></i>";
    temp += "<h6>看自选</h6>";
    temp += "</li>";
    temp += "</ul>";
    temp += "</div>";
    temp += "</div>";
    appendAnswer(temp, 'md_left_v2', json.qId);
    scrollToQuestion();
}

/*
 收盘/复盘
 */
function closingOrreplay(result) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);
    var temp = "";
    temp += "<div class='bd'>";
    temp += "<div class='mb'>";
    temp += "<ul class='box_tl02'>";
    temp += "<li>";
    temp += "<h5>截止至收盘，沪指跌0.06%，深成指跌0.05%，创业板指跌0.08%。</h5>";
    temp += "<h6>上证指数短期向下中期向下：十一节前不要加码买股票，反弹或创新高都是建议逢高卖出换现金。</h6>";
    temp += "</li>";
    temp += "<li>";
    temp += "<h5>在您的X只<b>持仓股</b>中，今日有X只上涨，X只下跌；持仓股中股票A/B/C收盘涨幅超过5%</h5>";
    temp += "</li>";
    temp += "<li>";
    temp += "<h5>在您的X只<b>自选股</b>中，今日有X只上涨，X只下跌；自选股中股票A/B/C收盘涨幅超过5%</h5>";
    temp += "</li>";
    temp += "</ul>";
    temp += "</div>";
    temp += "</div>";
    appendAnswer(temp, "md_left_v2", result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}

/**
 * e智通委托到价提醒(下期)
 */
function priceReminder() {
    var word = "委托到价提醒";
    sendPreAnswerContent(word);
    var temp = "<div class='bd'>";
    temp += "<div class='mb'>";
    temp += "<h6 class='date'>2017-10-15 14:12:34</h6>";
    temp += "<h5 class='warn'>您委托的<b>23.80</b>元买入<b>万科A</b>1000股到达该价格</h5>";
    temp += "<ul class='box_icon4'>";
    temp += "<li onclick=\"goPosition('" + word + "')\">";
    temp += "<i class='icon-position'></i>";
    temp += "<h6>持仓</h6>";
    temp += "</li>";
    temp += "<li onclick=\"goTransaction('" + word + "')\">";
    temp += "<i class='icon-transaction'></i>";
    temp += "<h6>去交易</h6>";
    temp += "</li>";
    temp += "<li onclick=\"lookAtMarket('" + word + "')\">";
    temp += "<i class='icon-quotation'></i>";
    temp += "<h6>看行情</h6>";
    temp += "</li>";
    temp += "<li onclick=\"technicalAnalysis('" + word + "')\">";
    temp += "<i class='icon-technical_analysis'></i>";
    temp += "<h6>技术分析</h6>";
    temp += "</li>";
    temp += "</ul>";
    temp += "</div>";
    temp += "</div>";
    appendAnswer(temp, 'md_left_v2', result.qId);
    scrollToQuestion();
}
/*
 点击看行情的方法
 */
function lookAtMarket(stockCode, stockName) {
    var methodName = 'navigationToStockDetail';
    commonCallbackForString(methodName, stockCode, stockName);
}
/*
 点击技术分析的方法
 */
function technicalAnalysis(stockName) {
    freeQuestion(stockName + "技术分析");
}
/*
 点击指数行情的方法
 */
function quotation(params) {
    console.log(params);
}
/*
 点击去交易的方法
 */
function goTransaction(params) {
    console.log(params);
}
/*
 点击去自选的方法
 */
function goOptional(params) {
    var methodName = 'commandSelfStockList';
    commonCallback(methodName, params);
}
/*
 点击持仓的方法
 */
function goPosition(params) {
    var methodName = 'commandTradeHoldStockList';
    commonCallback(methodName, params);
}
function riskHintsPushing(userId,messageId,interface1){
    riskPushingRequest(userId,messageId,interface1,callForRiskPushing);
}
function callForRiskPushing(result){
    if(result.message.code === 0)
    {
        if(result.data.length>0 || result.data.list.length>0)
        {
            commonForRiskInfo(result, null, true);
            if(window.hasOwnProperty('messageId')){
                deleteHistory(window.messageId);
            }
        }
    }
}

/**
 * e智通push进来调用的方法
 * @param messageId 移动端点击推送栏传过来的消息messageId
 * @param pushType  此消息的推送类型
 * @param pushTxt   此消息的文案
 */
function pushMessageSkipE(messageId, pushType, pushTxt) {
    //点击主动推送  进入小E 不显示  首页热门推荐
    var isPresetHotQuestionShow = false;
    if (isInteractiveView('主动推送')) {
        pushTxtResult = pushTxt;
        var msgIds = "";
        if (messageId.indexOf("{") != -1 && pushType == "晨间消息") {
            msgIds = JSON.parse(messageId);
            if (msgIds.hasOwnProperty("stockMessageIds")) {
                pushTxtResult = pushTxt || '您关注的股票有重要消息更新';
                appPushAndHistory(userId, msgIds.stockMessageIds, 'stockMessageIds');
            }
            if (msgIds.hasOwnProperty("shortStockRecommendMessageId")) {
                appPushAndHistory(userId, msgIds.shortStockRecommendMessageId, 'shortStockRecommendMessageId');
            }
            if (msgIds.hasOwnProperty("longStockRecommendMessageId")) {
                appPushAndHistory(userId, msgIds.longStockRecommendMessageId, 'longStockRecommendMessageId');
            }
            if (msgIds.hasOwnProperty("industryRecommendMessageId")) {
                appPushAndHistory(userId, msgIds.industryRecommendMessageId, 'industryRecommendMessageId');
            }
        } else if (pushType == "风险提示") {
            riskHintsPushing(userId,messageId,'history');
        } else {
            appPushAndHistory(userId, messageId, pushType);
        }
        isPresetHotQuestionShow = false;
    } else {
        showUnRecognizedMsg();
    }
    //获取顶部预设的问题
    getPresetQuestion(isPresetHotQuestionShow);
}
