/**
 * Created by xdy on 2017-08-07.
 */
/**
 * 基础知识
 * @param result
 */
function basics(result) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var list = [];
    var item = result.data.list[0];

    var queArry = {};
    var noList = "0140010100201,0140010100202,0140010100203,0140010100204,0140010100205,0140010100206,0140010100207,0150040100101";
    var msg = '暂无数据';
    if (item.hasOwnProperty('answer'))
        msg = "<h5>" + item.answer.replace(/\n/g,'<br>') + "</h5>";
    else if (item.hasOwnProperty('explain'))
        msg = "<h5>" + item.explain.replace(/\n/g,'<br>') + "</h5>";

    var moreWord = appKey === 'appHtyw' ? 'You may also want to know:' : '您可能还想知道：';

    if (result.message.code === 0) {
        list = result.data.list;
        if (list.length > 0) {
            // 有答案的时候的操作
            var secondList = [];
            for (var first = 1; first < list.length; first++) {
                if (list[first].question != "") {
                    secondList.push(list[first]);
                }
            }
            if (list[0].hasOwnProperty("explain")) {
                if (list[0].explain.length > 0) {
                    msg = "<h5>" + list[0].explain + "</h5>";
                }
                else {
                    if (list[0].explain.length > 0) {
                        msg = "<h5>" + list[0].explain + "</h5>";
                    }
                    else {
                        msg = "<h5></h5>";
                    }
                }
            } else {
                if (list[0].answer.length > 0) {
                    if ($.isPlainObject(list[0].answer) && list[0].question == "华创证券有限责任公司") {
                        var answer = JSON.parse(list[0].answer);
                        var content = answer.content;
                        var questionlist = '';
                        for (var i = 0; i < answer.suggests.length; i++) {
                            questionlist += "<li><a onclick=prependAskDialog('" + answer.suggests[i].question + "'," + Number(i + 1) + ")>" + (i + 1) + ". " +
                                answer.suggests[i].question + "</a></li>";
                        }
                        msg = "<h5>" + content.replace(/\n/g,'<br>') + "</h5>";
                        msg += "<div class='box_tl'><h5>"+moreWord+"</h5>" + questionlist;
                    } else {
                        // list[0].answer += "<a onclick=\"basicLinkClick('openPDF','http://www.miit.gov.cn/n1146295/n1652858/n1653100/n3767755/c6506801/part/6506807.pdf')\">开通科创板</a>"; // 测试
                        msg = "<h5>" + list[0].answer.replace(/\n/g,'<br>') + "</h5>";
                    }
                }
                else {
                    msg = "<h5 class='toblue'></h5>";
                }
            }

            if (secondList.length > 0 && secondList[0].question != "" && noList.indexOf(list[0].docID) == -1) {
                if (list[0].hasOwnProperty("explain")) {
                    if (list[0].explain.length == 0 && list[0].explain.length == 0) {
                        msg += "<div class='box_tl'><h5>小e没能匹配到精确答案，为您整理了以下您可能想了解的：</h5>";
                    }
                    else {
                        msg += "<div class='box_tl'><h5>"+moreWord+"</h5>";
                    }
                } else {

                    if (list[0].answer.length == 0 && list[0].answer.length == 0) {
                        msg += "<div class='box_tl'><h5>小e没能匹配到精确答案，为您整理了以下您可能想了解的：</h5>";
                    }
                    else {
                        msg += "<div class='box_tl'><h5>"+moreWord+"</h5>";
                    }
                }
                for (var secondQue = 0; secondQue < secondList.length; secondQue++) {
                    if (secondList[secondQue].question == "") {
                        continue;
                    }
                    else {
                        msg += "<li><a onclick=\"prependAskDialog(\'" + secondList[secondQue].question + "\'," + (secondQue + 1) + ")\">" + (secondQue + 1) + "." + secondList[secondQue].question + "</a></li>";
                        queArry[(secondQue) + 1] = secondList[secondQue].question;
                    }
                }
            }
        }
        else {
            // 没有答案的时候的操作
            $.ajax({
                type: 'get',
                url: "/qa/docsByIDs.do?IDs=0150040100101,0150040100201,0150040100301,0150040100401",
                success: getNoAns,
                error: ajaxErrorHandler
            });
        }
    }

    var temp = "<div class='bd'><div class='mb'>";
    // 文本内容
    temp += msg;
    // 点赞按钮
    temp += getRatingLabel(result);
    temp += " </div></div>";

    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
}

/**
 * 基础知识文本中的自定义链接点击，不可删除！！！
 * @param command
 * @param url
 */
function basicLinkClick(command, url) {
    // console.log(command, url)
    switch (command) {
        case 'openKCB': // 开通科创板
            openKCBPage();
            break;

        case 'openPDF': // 打开PDF
            showPDF('详情', url);
            break;

        case 'openURL': // 打开URL
            navigateUtil.navigate({url: url});
            break;

        case 'openBiz': // 打开VTM业务，参数为业务代码;
            postMessageToOutside({openBiz: url});
            break;
    }
}

/**
 * 公司主营答案输出：主营业务，主营产品
 * @param result
 */
function companyMain(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);
    //主营业务
    var mainBusiness = '暂无数据';
    var mainBusinessTime = result.data.updateAt;

    if (result.data) {
        mainBusiness = result.data.mainBus || result.data.mainBusiness || '暂无数据';
    }

    var temp = "<div class='bd'><div class='mb'>";
    temp += "<h6 class='date'>更新日期：" + changeTime(mainBusinessTime) + "</h6><h5>" + mainBusiness + "</h5>";

    // 点赞按钮
    temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView);
    temp += "</div></div>";

    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
}


/**
 * 报价数据（单个）
 * @param result
 */
function pankouSingleData(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var type = result.answerResultType;
    var data = '';
    var unit = '';
    switch (type) {
        case "开盘价":
            data = result.data.hasOwnProperty('openPrice') ? result.data.openPrice : '--';
            break;
        case "收盘价":
            data = result.data.newPrice === 0 ? result.data.preClosePrice : result.data.newPrice;
            break;
        case "现价":
            data = result.data.hasOwnProperty('newPrice') ? result.data.newPrice : '--';
            break;
        case "最高价":
            data = result.data.hasOwnProperty('highPrice') ? result.data.highPrice : '--';
            break;
        case "最低价":
            data = result.data.hasOwnProperty('lowPrice') ? result.data.lowPrice : '--';
            break;
        case "涨跌幅":
            data = result.data.hasOwnProperty('rise') ? result.data.rise : '--';
            unit = '%';
            break;
        case "成交量":
            data = result.data.hasOwnProperty('volume') ? result.data.volume : '--';
            unit = '股';
            break;
        case "成交额":
            data = result.data.hasOwnProperty('amount') ? result.data.amount : '--';
            data = formatAmount(data);
            break;
        case "换手率":
            data = result.data.hasOwnProperty('turnOver') ? result.data.turnOver : '--';
            unit = '%';
            break;
        case "振幅":
            data = result.data.hasOwnProperty('amplitude') ? result.data.amplitude : '--';
            unit = '%';
            break;
        case "总市值":
            data = result.data.hasOwnProperty('capitalization') ? changeMoney(result.data.capitalization) : '--';
            unit = '元';
            break;
        case "流通市值":
            data = result.data.hasOwnProperty('circulationCapitalization') ? changeMoney(result.data.circulationCapitalization) : '--';
            unit = '元';
            break;
    }

    var property = getPropertyByEntity(result.questionAnalyse[0].entity);

    var temp = "<div class='bd'><div class='mb'><div class='md_v1 md_tlbox md_col3table'>";
    // 文本内容
    temp += "<h4>" + property.name + "  " + property.code + "&nbsp;&nbsp;|&nbsp;&nbsp;" + generateDate(result.data.date) + "</h4>";
    temp += "<div class='mb_table'><div><h5>" + result.answerResultType + "</h5><h3>" + (data + unit) + "</h3></div></div>";
    temp += "<div class='link_half link_half2 mt_0'></div></div>";

    // 点赞按钮
    temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView);
    temp += "</div></div>";

    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
}

/**
 * 每股净资产、净资产收益率、每股收益、净利润、净利润增长答案输出
 * @param result
 */
function variableProfit(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var answerType = result.answerResultType;
    var data;

    var property = getPropertyByEntity(result.questionAnalyse[0].entity);
    var unit = result.data.unit;
    var season = '';
    switch (answerType) {
        case "市盈率":
            data = result.data;
            console.log(data)
            answerType += '(TTM)';
            break;
        case "市净率":
            data = result.data;
            // answerType += '(动)';
            break;
        case "市销率":
            data = result.data;
            // answerType += '(动)';
            break;
        default:
            data = result.data;
            break;
    }
    var comTotal = (data.rank==undefined) ? '<h3>--</h3>' : '<h3>'+data.rank+'/<em>'+data.comTotal+'</em></h3>';

    var temp = "<div class='bd'><div class='mb'><div class='md_v1 md_tlbox md_col3table box_col3table_v2'>";
    temp += "<h4>" + property.name + "  " + property.code + "&nbsp;&nbsp;|&nbsp;&nbsp;" + changeTime(result.data.endAt) + season + "</h4>";
    temp += '<ul>';
    temp += '<li>' +
            '<div><h5>'+answerType+'</h5>' +
            '<h3>'+valueUnit(data.value, unit)+'</h3></div>' +
            '</li>'
    temp += '<li>' +
            '<div><h5>业内排名</h5>' +
            comTotal + '</div>' +
            '</li>'
    temp += '<li>' +
            '<div><h5>所属行业</h5>' +
            '<h3>'+(data.induSortName || '')+'</h3></div>' +
            '</li>'


    temp += '</ul>'
    temp += "<div class='link_half link_half2 mt_0'></div></div>";

    // 点赞按钮
    temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView);
    temp += "</div></div>";

    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
}

/**
 * 基础报价数据
 * @param result
 */
function pankouData(result, showInteractiveView) {
    var word = '';
    if (result.hasOwnProperty('words')) {
        word = result.words;
    }
    sendPreAnswerContent(word + '  ' + result.preAnswerContent, '', '', result.qId);

    var item = result.questionAnalyse[0];
    var property = getPropertyByEntity(result.questionAnalyse[0].entity);

    var temp = "<div class='bd'><div class='mb'><div class='md_v1 md_tlbox md_col3table'>";
    temp += "<h4>" + property.name + "  " + property.code + "&nbsp;&nbsp;|&nbsp;&nbsp;" + generateDate(result.data.date) + "</h4>";
    // 文本内容
    if (item.entity[0].type == "股票") {
        temp += "<ul><li><div><h5>现价</h5><h3>" + fixed2(result.data.newPrice) + "</h3></div></li><li><div><h5>涨跌幅</h5><h3>" + fixed2(result.data.rise) + "%</h3></div></li><li class='li_last'><div><h5>开盘价</h5><h3>" + fixed2(result.data.openPrice) + "</h3></div></li></ul>";
        temp += "<ul><li><div><h5>最高价</h5><h3>" + fixed2(result.data.highPrice) + "</h3></div></li><li><div><h5>最低价</h5><h3>" + fixed2(result.data.lowPrice) + "</h3></div></li><li class='li_last'><div><h5>成交量(手)</h5><h3>" + formatVolume(result.data.volume) + "</h3></div></li></ul>";
        temp += "<ul><li><div><h5>成交额</h5><h3>" + formatAmount(result.data.amount) + "</h3></div></li><li><div><h5>换手率</h5><h3>" + fixed2(result.data.turnOver) + "%</h3></div></li><li class='li_last'><div><h5>振幅</h5><h3>" + fixed2(result.data.amplitude) + "%</h3></div></li></ul>";

    } else if (item.entity[0].type == "指数") {
        temp += "<ul><li><div><h5>现价</h5><h3>" + fixed2(result.data.newPrice) + "</h3></div></li><li><div><h5>涨跌幅</h5><h3>" + fixed2(result.data.rise) + "%</h3></div></li><li class='li_last'><div><h5>开盘价</h5><h3>" + fixed2(result.data.openPrice) + "</h3></div></li></ul>";
        temp += "<ul><li><div><h5>最高价</h5><h3>" + fixed2(result.data.highPrice) + "</h3></div></li><li><div><h5>最低价</h5><h3>" + fixed2(result.data.lowPrice) + "</h3></div></li><li class='li_last'><div><h5>振幅</h5><h3>" + fixed2(result.data.amplitude) + "%</h3></div></li></ul>";

    }
    temp += "<div class='link_half link_half2 mt_0'></div></div>";

    // 点赞按钮
    temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView);
    temp += "</div></div>";

    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
}

/**
 * 无法回答
 * @param result
 */
function noAnswer(result, showInteractiveView, isPopup) {
    var list = result.sugguestQuestion;
    var temp = "";

    if (isPopup) {
        appendAnswerToPopup('<p>'+result.preAnswerContent+'</p>');
        return;
    } else {
        //输出前值语
        sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);
    }

    if (list && list.length > 0) //有建议问题  暂时不做  xdy
    {
        $(list).each(function (index, item) {
            if(showInteractiveView || index < 5)
                temp += '<li><span onclick="freeQuestion(\'' + item + '\')">' + item + '</span></li>';
        });

        temp = '<div class="mb md_tlbox">' +
                    '<div class="box_shadow">' +
                        '<ul>' +
                            temp +
                        '</ul>' +
                    '</div>' +
                '</div>';

        appendAnswer(temp, '', result.qId);
    } else { //无建议
        temp += '<div class="md_fastNav pt_1">';
        temp += '<ul>';
        if (appKey === 'appEzt') {
            temp += '<li onclick="callAdviser2()">人工服务</li>';
        }
        temp += '<li onclick="helpClickSwitch()">帮助</li>' +
                '</ul>';
        temp += '</div>';
        appendAnswer(temp, '', result.qId);
        //resetCallButton();
    }

    if (appKey === 'appAvatar') {
        var ex =
            '<div class="md_e_txt">' +
                '<h4 style="color: #ffffff">您的问题:“'+result.question+'”</h4>' +
            '</div>';
        $('#mainContent').append(ex);
    }

    scrollToBodyEnd();
    getDefaultTabs(appKey === 'appEzt' ? '呼叫投顾' : '');
}

/**
 * 调侃问好
 * @param result
 */
function sayHello(result) {
    if (result.data.helpGuide === 0)
        sendPreAnswerContent(result.data.answers[0], '', '', result.qId);
    else if (result.data.helpGuide) {
        if (appKey === 'appHtyw') {
            sendPreAnswerContent(result.data.answers[0], '', '', result.qId)
        } else {
            if (appKey === 'appAvatar') {
                if (tagAvatarQuestionList) {
                    $(mainContent).html('');
                    var tagCard =
                        '<div class="md_left_v2">'+
                            '<div class="hd">'+
                                '<div class="mb_avatar">'+
                                    '<img src="'+headImg+'">'+
                                '</div>'+
                                '<h4 style="'+(appKey==='appAvatar'?'padding-right:15px':'')+'">'+(result.data.answers[0] || '我是小e，您的智能服务助手，我擅长以下问题')+'</h4>'+
                            '</div>'+
                            tagAvatarQuestionList+
                        '</div>';
                    $(mainContent).append(tagCard);
                    setHelpCss(1);
                }
            } else {
                sendPreAnswerContent(result.data.answers[0] || '我是小e，您的智能服务助手，我擅长以下问题', '', '', result.qId);
                helpClick();
            }
        }
    }
    scrollToBodyEnd();
}

/**
 * 未开发
 * @param result
 */
function undevelopedFunction(result, showInteractiveView) {
    var preAnswerContent = result.preAnswerContent;
    sendPreAnswerContent(preAnswerContent, '', '', result.qId);

    var tagQ = '';
    result.data.forEach(function (item, index) {
        if(showInteractiveView || index < 5)
            tagQ += '<li><span onclick="freeQuestion(\'' + item + '\')"><em>▪&nbsp;</em><span>' + item + '</span></span></li>';
    });

    var temp = '<div class="bd"><div class="mb">' +
        '<div class="md_v1 md_tlbox">' +
        '<ul>' +
        tagQ +
        '</ul>' +
        '</div></div></div>';

    appendAnswer(temp, '', result.qId);
}

/**
 * 展示概念成分股
 * @param result
 */
function showConcepts(result, isPopup) {
    //输出前值语
    var word = '';
    if (result.hasOwnProperty('words')) {
        word = result.words;
    }

    if (!isPopup) {
        sendPreAnswerContent(word + result.preAnswerContent, '', '', result.qId);
    }

    var list = [];
    if (result.hasOwnProperty("answerResultType")) {
        if (result.answerResultType == "条件选股") {
            list = result.data;
        } else {
            list = result.data.list;
        }
    } else {
        list = result;
    }

    var temp = '';
    var len = list.length;

    //是否需显示展示全部按钮
    var id = 'stock' + new Date().getTime();
    var moreId = 'more' + new Date().getTime();
    var hideMore = 'hide' + new Date().getTime();
    var isConStock = '';
    var caption = '';
    var ifPopup = result.answerResultType == '条件选股' ? JSON.stringify(result).replace(/"/g, '&quot;') : '';
    if (!isPopup) {
        if (len > 9) {
            caption = "<div class='btn_show'>" + '<a id="' + moreId + '" class="btn_down ' + moreId + '" onclick="showAllData(\'' + id + '\',' + JSON.stringify(list).replace(/"/g, '&quot;') + ',\'' + moreId + '\',\'' + hideMore + '\',\'' +ifPopup+ '\')">展开<i class="icon-arrow_closed"></i></a><a style="display: none;" onclick="hideAllData(\'' + id + '\',\'' + moreId + '\',\'' + hideMore + '\')" class="btn_up ' + hideMore + '">收起<i class="icon-arrow_open"></i></a>' + "</div>";
        } else {
            caption = "<div class='btn_show'></div>";
        }
        if (result.answerResultType == '条件选股') {

            isConStock = "<h6 style='background: #fbfbfb;line-height: 1.25rem;text-align: right;margin: 0 0 1rem;padding: 0 0.5rem;color: #a1a2a8;'>更新日期:"+changeTime(result.data[0].updateAt)+"</h6>";
        } else {
            isConStock = caption;
        }
    }
    if (!isPopup) {
        //第一次最多显示9支
        for (var i = 0; i < 9 && i < len; i++) {
            var item = list[i];
            temp += '<li><span onclick="stockFixQuestion(\'' + item.stockCode + '\', \'' + item.stockName + '\', \'' + item.market + '\',\''+'个股综评'+'\')">' + item.stockName + '</span></li>'
        }
    } else {
        for (var i = 0; i < len; i++) {
            var item = list[i];
            temp += '<li><span onclick="stockFixQuestion(\'' + item.stockCode + '\', \'' + item.stockName + '\', \'' + item.market + '\',\''+'个股综评'+'\')">' + item.stockName + '</span></li>'
        }
    }
    //整体内容
    var body = '';
    if (!isPopup) {
        body = '<div class="bd"><div class="mb">';
    } else {
        body = '<div><div>'
    }
    body += '<div class="md_v1 md_tlbox md_col3">' + isConStock +
        '<ul id="' + id + '">' +
        temp +
        '</ul>' +
        caption +
        '</div>' +
        '</div></div>';
    if (!isPopup) {
        appendAnswer(body, '', result.qId);
        getQuestionTabs(result);
    } else {
        appendAnswerToPopup(body);
    }

}
/**
 * 展示概念股全部数据
 * @param compId 需要放入的元素容器ID
 * @param list 数据集合
 * @param moreId 需要隐藏的元素ID
 */
function showAllData(compId, list, moreId, hideMoreId, isPopup) {
    if (!isPopup) {
        if ($('#' + compId).find(".spreadList").length > 0) {
            $('#' + compId).find(".spreadList").show();
        } else {
            var el = document.getElementById(compId);
            var moreList = document.createElement("div");
            moreList.setAttribute("class", "spreadList");
            el.appendChild(moreList);
            var len = list.length;
            var name = '';

            for (var i = 9; i < len; i++) {
                var item = list[i];
                if (item.hasOwnProperty('name')) {
                    name = item.name;
                } else {
                    name = item.stockName;
                }
                var li = document.createElement("LI");
                li.innerHTML = '<span onclick="stockClick(\'' + item.stockCode + '\', \'' + name + '\', \'' + item.market + '\', \'' + '个股综评' + '\')">' + name + '</span>';
                el.childNodes[9].appendChild(li);
            }
        }
        $('#' + compId).addClass('pb_10');
        $('.' + moreId).hide();
        $('.' + hideMoreId).show();
    } else {
        isPopup = JSON.parse(isPopup);
        predicateType = '股票列表';
        showTotalDetailForNoStock(isPopup);
    }
}

/**
 * 隐藏概念股展开数据
 * @param id 需要放入的元素容器ID
 * @param moreId 需要展示的元素ID
 */
function hideAllData(id, moreId, hideMoreId) {
    // console.log(id+"-------"+moreId);
    $('#' + id).find(".spreadList").hide();
    $('#' + id).removeClass('pb_10');
    $('.' + moreId).show();
    $('.' + hideMoreId).hide();
}

/**
 * 公司地址
 * @param result
 */
function officeAddress(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);
    //公司地址
    var mainBusiness = result.data.officeAddress || '暂无数据';
    var mainBusinessTime = result.data.createAt;

    var temp = "<div class='bd'><div class='mb'>";
    // 文本内容
    temp += "<h6 class='date'>更新日期：" + changeTime(mainBusinessTime) + "</h6>" + "<h5>" + mainBusiness.replace(/\n/g,'<br>') + "</h5>";

    // 点赞按钮
    temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView);
    temp += "</div></div>";

    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
}

/**
 * 股权激励
 * @param result
 * @param showInteractiveView
 */
function stockOwnershipIncentive(result, showInteractiveView) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);
    var data = result.data;
    var hideClass = generateRandomClassName('hideClass');
    var moreId = generateRandomClassName('moreId');
    var tagBody =
        '<div class="box_timeLine box_timeLine_factor box_equInc">'+
        '<div class="timeLine">'+
        '<ul>';
    if(data.length > 0){
        data.forEach(function (item, index) {
            var ifHideClass = index > 2 ? 'none' : 'flex';
            var hideClassLine = index > 2 ? hideClass : '';
            if(typeof item === 'object'){
                tagBody +=
                    '<li style="display:' + ifHideClass + '" class="' + hideClassLine + '">'+
                    '<dt>'+
                    '<b></b>'+
                    '<s><i></i></s>'+
                    '</dt>'+
                    '<dd>'+
                    '<div class="space_between">'+
                    '<span class="date">'+timeUtil.getTimeStr(item.pubDateTimestamp)+'</span>'+
                    '</div>'+
                    '<h5 class="b_fa" onclick="encourageDetail(\'' + JSON.stringify(item).replace(/"/g, '&quot;') + '\')">公布股权激励方案，激励方式为授予'+incSubject(item.incSubject)+'</h5>'+
                    '</dd>'+
                    '</li>'
            }
        });
    }else{
        tagBody +=
            '<li>' +
            '<dt>' +
            '<b></b>' +
            '<s><i></i></s>' +
            '</dt>' +
            '<dd>' +
            '<div class="space_between">' +
            '<span>暂无股权激励信息</span>' +
            '</div>' +
            '</dd>' +
            '</li>';
    }

    tagBody+='</ul>'+
        '</div>'+
        '</div>';
    if (data.length > 3) {
        tagBody +=
            // <!--加载更多-->
            '<div id="' + moreId + '" class="box_load" onclick=showMoreArticle("' + hideClass + '","' + moreId + '")>' +
            '<a>查看更多</a>' +
            '</div>';
    }


    var temp = '<div class="bd"><div class="mb">'+tagBody;
    temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) + "</div></div>";
    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}

//股权激励方案详情
function encourageDetail(result) {
    result = JSON.parse(result);
    var ifShowD0 = "show";
    var lineClass0 = generateRandomClassName('hideArticle0');
    if (result.incCond.length < 120) {
        ifShowD0 = 'hide';
    }
    var temp0='';
    temp0 += "   <a " + ifShowD0 + " class='a_more a" + lineClass0 + "' onclick=showMoreRow2AndShowUp('" + lineClass0 + "')>展开<i class='icon-arrowD'></i></a>";
    temp0 += "<a style='display:none;' class='a_more aShow" + lineClass0 + "' onclick=hideMoreRow2AndShowUp('" + lineClass0 + "')>收起<i class='icon-arrowT'></i></a>";

    var ifShowD1 = "show";
    var lineClass1 = generateRandomClassName('hideArticle1');
    if (result.incSellDetail.length < 120) {
        ifShowD1 = 'hide';
    }

    var temp1='';
    temp1 += "   <a " + ifShowD1 + " class='a_more a" + lineClass1 + "' onclick=showMoreRow2AndShowUp('" + lineClass1 + "')>展开<i class='icon-arrowD'></i></a>";
    temp1 += "<a style='display:none;' class='a_more aShow" + lineClass1 + "' onclick=hideMoreRow2AndShowUp('" + lineClass1 + "')>收起<i class='icon-arrowT'></i></a>";

    var ifShowD2 = "show";
    var lineClass2 = generateRandomClassName('hideArticle2');
    if (result.optExeCond.length < 120) {
        ifShowD2 = 'hide';
    }
    var ifshowIncCond,ifshowIncSellDetail,ifshowOptExeCond;
    !result.incCond?ifshowIncCond='hide': ifshowIncCond='show';
    !result.incSellDetail?ifshowIncSellDetail='hide': ifshowIncSellDetail='show';
    !result.optExeCond?ifshowOptExeCond='hide': ifshowOptExeCond='show';
    var temp2='';
    temp2 += "   <a " + ifShowD2 + " class='a_more a" + lineClass2 + "' onclick=showMoreRow2AndShowUp('" + lineClass2 + "')>展开<i class='icon-arrowD'></i></a>";
    temp2 += "<a style='display:none;' class='a_more aShow" + lineClass2 + "' onclick=hideMoreRow2AndShowUp('" + lineClass2 + "')>收起<i class='icon-arrowT'></i></a>";

    var tagBody =
        '<div class="sumUp_equInc">' +
        '<h5><strong>激励方式：</strong>'+incSubject(result.incSubject)+'</h5>'+
        '<h5><strong>公布日期：</strong>'+timeUtil.getTimeStr2(result.pubDateTimestamp)+'</h5>'+
        '<h5><strong>授予起始日：</strong>'+timeUtil.getTimeStr2(result.incBeginTimestamp)+'</h5>'+
        '<h5><strong>授予结束日：</strong>'+timeUtil.getTimeStr2(result.incEndTimestamp)+'</h5>'+
        '<h5><strong>激励进度：</strong>'+result.progress+'</h5>'+
        '<h5><strong>激励金源：</strong>'+incType(result.incType)+'</h5>'+
        '<h5><strong>激励总数：</strong>'+incAmount(result.incAmount,result.incSubject)+'</h5>'+
        '<h5><strong>期权初始行权价格：</strong>'+formatAmount(result.incPrice)+'</h5>'+
        '<h5><strong>激励总数占当时总股本比例：</strong>'+addPer(result.incTotsharePercent)+'</h5>'+

        '<ul>'+
            '<li class="'+lineClass0+' '+ ifshowIncCond+'">'+
                '<h5 class="hd">激励授予条件</h5>'+
                '<h5 class="show_row2">'+result.incCond+'</h5>'+
                    temp0+
            '</li>'+
            '<li class="'+lineClass1+' '+ ifshowIncSellDetail+'">'+
                '<h5 class="hd">激励股票出售条件</h5>'+
                '<h5 class="show_row2">'+result.incSellDetail+'</h5>'+
                    temp1+
            '</li>'+
            '<li class="'+lineClass2+' '+ ifshowOptExeCond+'">'+
                '<h5 class="hd">期权行权特别条件</h5>'+
                '<h5 class="show_row2">'+result.optExeCond+'</h5>'+
                    temp2+
            '</li>'+
        '</ul>' +
        '</div>';


    appendAnswerToPopup(tagBody);
    showPopup('股权激励');
}
/**
 * 股票对比
 * @param result
 * @param showInteractiveView
 */
function compareStocks(result,showInteractiveView){
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);
    var dataArr = result.data;
    if (!dataArr) {
        return;
    }
    //根据数值大小加less样式
    function addLess(stockLeft,stockRight,keyVlaue){
        var Flag=keyVlaue+'Flag';
        if(stockLeft[keyVlaue]&&stockRight[keyVlaue]){
            if(stockLeft[keyVlaue]-stockRight[keyVlaue]>0){
                stockRight[Flag]='less'
            }else if(stockLeft[keyVlaue]-stockRight[keyVlaue]<0){
                stockLeft[Flag]='less';
            }
        }else if(stockLeft[keyVlaue]&&!stockRight[keyVlaue]){
            stockRight[Flag]='less'
        }else if(stockRight[keyVlaue]&&!stockLeft[keyVlaue]){
            stockLeft[Flag]='less'
        }
    }

    //计算样式百分比
    function stylePer(stockLeft,stockRight,keyVlaue){
        var per=keyVlaue+'Per';
        var stockLeftAbs,stockRightAbs;
        if(stockLeft[keyVlaue]&&stockRight[keyVlaue]){
            if(stockLeft[keyVlaue]<0&&stockRight[keyVlaue]<0){
                stockLeftAbs=Math.abs(stockLeft[keyVlaue]);
                stockRightAbs=Math.abs(stockRight[keyVlaue]);
                stockRight[per]=(stockLeftAbs/(stockLeftAbs+stockRightAbs))*100+"%";
                stockLeft[per]=(stockRightAbs/(stockLeftAbs+stockRightAbs))*100+"%";
            }else if(stockLeft[keyVlaue]>0&&stockRight[keyVlaue]<0){
                stockLeft[per]='100%';
                stockRight[per]='0%';
            }else if(stockLeft[keyVlaue]<0&&stockRight[keyVlaue]>0){
                stockRight[per]='100%';
                stockLeft[per]='0%';
            }else if(stockLeft[keyVlaue]-(stockRight[keyVlaue])!=0){
                stockLeft[per]=(stockLeft[keyVlaue]/(stockLeft[keyVlaue]+stockRight[keyVlaue]))*100+"%";
                stockRight[per]=(stockRight[keyVlaue]/(stockLeft[keyVlaue]+stockRight[keyVlaue]))*100+"%";
            }else{
                stockLeft[per]='50%';
                stockRight[per]='50%';
            }
        }else if(stockLeft[keyVlaue]&&!stockRight[keyVlaue]){
            stockLeft[per]="100%"
        }else if(stockRight[keyVlaue]&&!stockLeft[keyVlaue]){
            stockRight[per]="100%"
        }

    }

    var arr=['sFaYoynetprofit','totalValue','pe','pb'];
    for(var i=0,l=arr.length;i<l;i++){
        stylePer(dataArr[0],dataArr[1],arr[i]);
        addLess(dataArr[0],dataArr[1],arr[i]);
    }

    function stockGener(stock){
        var name='<li>'+stock.stockName+'</li>';
        var text='';
        var arr=['sFaYoynetprofit','totalValue','pe','pb'];
        for(var i=0,l=arr.length;i<l;i++){
            var flag=arr[i]+'Flag';
            var per=arr[i]+'Per';
            var svalue=arr[i];
            var trueVlaue=stock[svalue];
            if(arr[i]=='sFaYoynetprofit'){
                trueVlaue?trueVlaue=trueVlaue.toFixed(2)+'%':trueVlaue="--";
            }
            if(arr[i]=='totalValue'){
                trueVlaue?trueVlaue=changeMoney(trueVlaue):'--'
            }
            trueVlaue?'':trueVlaue='--';
            text+='<li class="'+stock[flag]+'"><div class="bar"><i></i><b style="width:'+stock[per]+'"></b><span>'+(isNaN(trueVlaue)?trueVlaue:trueVlaue.toFixed(2))+'</span></div></li>';
        }
        return '<ul>'+name+text+'</ul>';
    }

    var stockLeft=stockGener(dataArr[0]);
    var stockRight=stockGener(dataArr[1]);
    var mathRandom = generateRandomClassName('');
    var chartId = stockComparision.getTarget(mathRandom,"robot_e");
    var middle='<ul><li><i></i></li><li>净利润<br>增长率</li><li>总市值</li><li>市盈率</li><li>市净率</li></ul>';

    var tagBody=
            '<div class="box_contrast">'+
                '<div class="contrast">'+
                    stockLeft+middle+stockRight+
                '</div>'+
                '<div class="mb_tab tab_contrast" id="">'+chartId+'</div>'+
            '</div>';

    var temp ='<div><div class="bd"><div class="mb">'+ tagBody +generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) +'</div></div></div>';
    appendAnswer(temp, '', result.qId);

    //初始化图表
    stockComparision.init(dataArr[0].market, dataArr[0].stockCode, dataArr[1].market, dataArr[1].stockCode, mathRandom);
}


function intellectual(result, showInteractiveView){
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);
    var text='';
    var hideClass = generateRandomClassName('hideClass');
    var moreId = generateRandomClassName('moreId');
    var dataObj = result.data;
    var list=dataObj.list;


    for(var i=0,l=list.length;i<l;i++){
        var ifHideClass = i > 4 ? 'none' : 'block';
        var hideClassLine = i > 4 ? hideClass : '';
        text+= '<li class="'+hideClassLine+'" style="display:'+ifHideClass+'">'+
        '<h5 onclick="textTongji()">' +
            '<span>'+list[i].patentName+'</span>' +
            // '<i class="icon-authorized_un"></i>' +
            '</h5>'+
            '<h6>专利编号：'+list[i].patentNo+'</h6>'+
        '<h6>专利类型：'+list[i].patentType+'</h6>'+
        '</li>';
    }
    if(list instanceof Array&&list.length>5){
        text+=
            // <!--加载更多-->
            '<a id="' + moreId + '" class="btn_more" onclick=showMoreArticle("' + hideClass + '","' + moreId + '",5)>查看更多</a>'
    }

    //本公司专利数
    var companyPatentCount=dataObj.companyPatentCount;
    //行业平均专利数
    var industryAvg=dataObj.industryAvg;

    var tagHuashu = '';
    var voiceTxt = '';
    if (['银行','保险','证券'].indexOf(result.data.industryName) === -1) {
        tagHuashu = '<div class="box_bgBlue">'+
                        '<b>'+dataObj.stockName+'</b>团队知识产权数量同行业内<b>'+getPatentRevel(dataObj.rank)+'</b>，从长远竞争力看，<b>'+getPatentRevelCommon(dataObj.rank)+'</b>'+
                    '</div>';
        voiceTxt = dataObj.stockName+'团队知识产权数量同行业内'+getPatentRevel(dataObj.rank)+'，从长远竞争力看，'+getPatentRevelCommon(dataObj.rank);
    }

    // 语音
    playVoiceAnswerLite(voiceTxt);

    // 计算百分比
    var companyPatentCountPer=companyPatentCount/(companyPatentCount+industryAvg)*100+'%';
    var industryAvgPer=industryAvg/(companyPatentCount+industryAvg)*100+'%';
    var tagBody=
                    '<div class="box_intProperty">'+
                        tagHuashu+
                        '<h4>专利权</h4>'+
                        '<div class="box_percent patent">'+
                        '<ul>'+
                            '<li>'+
                                '<h6>本公司</h6>'+
                                '<h4>'+companyPatentCount+'</h4>'+
                            '</li>'+
                            '<li>'+
                                '<h6>行业平均</h6>'+
                                '<h4>'+industryAvg+'</h4>'+
                            '</li>'+
                        '</ul>'+
                        '<ul>'+
                            '<li style="width: '+companyPatentCountPer+'"><b></b></li>'+
                            '<li style="width: '+industryAvgPer+'"><b></b></li>'+
                        '</ul>'+

                    '</div>'+
                    '<ul class="box_authorized" id="">'+text+'</ul>';

    var temp ='<div><div class="bd"><div class="mb">'+ tagBody +generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) +'</div></div></div>';
    appendAnswer(temp, '', result.qId);

}
function textTongji(){
    _hmt.push(['_trackEvent', "测试", "click",'专利']);
}

/**
 * socket推送：盘前要闻
 * @param result
 */
function pushNews(result) {
    sendPreAnswerContent(result.preAnswerContent || result.data.content.preAnswerContent || '盘前要闻');

    var news = [], focuses = [];
    try {
        news = result.data.content.news || '';
        focuses = result.data.content.focus || [];
    } catch (e){}

    // 要闻列表
    var tagNews = '';
    for (var i=0; i<news.length; i++) {
        tagNews += "<li onclick=\"showInformationDetail('" + news[i].id + "','资讯')\">"+(i+1)+'、'+news[i].title+'</li>'
    }
    tagNews =
        '<ul class="box_tlBox_txt">'+
            tagNews+
        '</ul>';

    // 热点列表，默认都有‘当前机会分析’
    var tagFocus = '<li onclick="freeQuestion(\''+'当前机会分析'+'\')">当前机会分析</li>';
    for (var j=0; j<focuses.length; j++) {
        tagFocus += '<li onclick="focusClick(\''+focuses[j].baseName+'\')">'+(focuses[j].label || focuses[j].baseName)+'</li>'
    }
    tagFocus =
        // <!--如果问题框，没有点评，请去掉clear_appraisal_mb样式名-->
        '<ul class="tlBox_link">'+
            tagFocus+
        '</ul>';

    var temp = '<div class="bd"><div class="mb">'+tagNews+tagFocus+'</div></div>';
    appendAnswer(temp);
}

// 热点点击，直接去详情页
function focusClick(baseName) {
    showXiaoE();
    openHotConcept({name: baseName});
}

/**
 * socket推送：焦点异动
 * @param result
 */
function focusShift(result) {
    sendPreAnswerContent(result.preAnswerContent || result.data.content.preAnswerContent || '焦点异动');

    var desc = '', stocks = [], focuses = [], indices = [];
    try {
        desc = result.data.content.desc || '';
        focuses = result.data.content.focus || [];
        stocks = result.data.content.stocks || [];
        indices = result.data.content.indices || [];
    } catch (e){}

    var tagText = '<h5 class="linkBottom_half">'+desc+'</h5>';
    // 热点列表
    var tagFocus = '';
    for (var i=0; i<focuses.length; i++) {
        tagFocus += '<li onclick="focusClick(\''+focuses[i].baseName+'\')">'+(focuses[i].label || focuses[i].baseName)+'</li>'
    }

    // 股票列表
    var tagStock = '';
    // for (var j=0; j<stocks.length; j++) {
    //     tagStock += '<li onclick="stockFixQuestion(\''+stocks[j].code+'\',\''+stocks[j].name+'\',\''+stocks[j].marType+'\',\'个股综评\')">'+(stocks[j].label || stocks[j].name)+'</li>'
    // }

    // 指数列表
    var tagIndex = '';
    for (var m=0; m<indices.length; m++) {
        tagIndex += '<li onclick="indexFixQuestion(\''+indices[m].code+'\',\''+indices[m].name+'\',\''+indices[m].marType+'\',\'指数综评\')">'+(indices[m].label || indices[m].name)+'</li>'
    }

    tagFocus =
        // <!--如果问题框，没有点评，请去掉clear_appraisal_mb样式名-->
        '<ul class="tlBox_link">'+
            tagFocus+
            tagStock+
            tagIndex+
        '</ul>';

    var temp = '<div class="bd"><div class="mb">'+tagText+tagFocus+'</div></div>';
    appendAnswer(temp);
}

/**
 * socket推送：行情播报
 * @param result
 */
function quoteBroadcast(result) {
    sendPreAnswerContent(result.preAnswerContent || result.data.content.preAnswerContent || '行情播报');

    var desc = '', stocks = [], focuses = [], indices = [];
    try {
        desc = result.data.content.desc || '';
        stocks = result.data.content.stocks || [];
        focuses = result.data.content.focus || [];
        indices = result.data.content.indices || [];
    } catch (e){}

    var tagText = '<h5 class="linkBottom_half">'+desc+'</h5>';

    // 热点列表
    var tagFocus = '';
    for (var i=0; i<focuses.length; i++) {
        tagFocus += '<li onclick="focusClick(\''+focuses[i].baseName+'\')">'+(focuses[i].label || focuses[i].baseName)+'</li>'
    }

    // 股票列表
    var tagStock = '';
    for (var j=0; j<stocks.length; j++) {
        tagStock += '<li onclick="stockFixQuestion(\''+stocks[j].code+'\',\''+stocks[j].name+'\',\''+stocks[j].marType+'\',\'个股综评\')">'+(stocks[j].label || stocks[j].name)+'</li>'
    }

    // 指数列表
    var tagIndex = '';
    for (var m=0; m<indices.length; m++) {
        tagIndex += '<li onclick="indexFixQuestion(\''+indices[m].code+'\',\''+indices[m].name+'\',\''+indices[m].marType+'\',\'指数综评\')">'+(indices[m].label || indices[m].name)+'</li>'
    }

    var tagList =
        // <!--如果问题框，没有点评，请去掉clear_appraisal_mb样式名-->
        '<ul class="tlBox_link">'+
            tagFocus+
            tagStock+
            tagIndex+
        '</ul>';

    var temp = '<div class="bd"><div class="mb">'+tagText+tagList+'</div></div>';
    appendAnswer(temp);
}

/**
 * socket推送：当前机会分析
 * @param result
 */
function opportunityMining(result) {
    sendPreAnswerContent(result.preAnswerContent || result.data.content.preAnswerContent || '当前机会分析', '', '', result.qId);

    var desc = '', stocks = [], focuses = [], indices = [];
    try {
        desc = result.data.content.desc || '';
        // stocks = result.data.content.stocks || [];
        focuses = result.data.content.focus || [];
        indices = result.data.content.indices || [];
    } catch (e){}

    var tagText = '<h5 class="linkBottom_half">'+desc+'</h5>';
    var focusName = '';
    // 热点列表
    var tagFocus = '';
    for (var i=0; i<focuses.length; i++) {
        focusName = focuses[i].baseName;
        tagFocus += '<li onclick="focusClick(\''+focuses[i].baseName+'\')">'+(focuses[i].label || focuses[i].baseName)+'</li>'
    }

    // // 指数列表
    var tagIndex = '';
    // for (i=0; i<indices.length; i++) {
    //     tagIndex += '<li onclick="indexFixQuestion(\''+indices[i].code+'\',\''+indices[i].name+'\',\''+indices[i].marType+'\',\'指数综评\')">'+indices[i].label || +'</li>'
    // }

    // var randomNum = generateRandomClassName('filter');
    tagFocus =
        // <!--如果问题框，没有点评，请去掉clear_appraisal_mb样式名-->
        '<ul class="tlBox_link">'+
            tagFocus+
            tagIndex+
            '<li onclick="openRecentSpot()">热点筛选对比</li>'+
            // '<li id="'+randomNum+'" focusName="'+focusName+'" selectedOptions="" onclick="showFilterPopup(\'popFocusFilter\',\''+randomNum+'\')">热点偏好筛选</li>'+
        '</ul>';

    var temp = '<div class="bd"><div class="mb">'+tagText+tagFocus+'</div></div>';
    appendAnswer(temp, '', result.qId);
}

/**
 * 热点分析
 * @param result
 * @param showInteractiveView
 */
function focusAnalysis(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var desc = '', focuses = [];
    try {
        desc = result.data.content.desc || '';
        focuses = result.data.content.focus || [];
    } catch (e){}

    var tagText = '<h5 class="linkBottom_half">'+desc+'</h5>';

    // 热点列表
    var tagFocus = '';
    for (var i=0; i<focuses.length; i++) {
        tagFocus += '<li onclick="focusClick(\''+focuses[i].baseName+'\')">'+(focuses[i].label || focuses[i].baseName)+'</li>'
    }

    tagFocus =
        // <!--如果问题框，没有点评，请去掉clear_appraisal_mb样式名-->
        '<ul class="tlBox_link clear_appraisal_mb">'+
            tagFocus+
        '</ul>';

    var temp = '<div class="bd"><div class="mb">'+tagText+tagFocus+getRatingLabel(result,showInteractiveView)+'</div></div>';
    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}

/**
 * 个股买入分析
 * @param result
 * @param showInteractiveView
 */
function buyingAnalysisOfStock(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var desc = '', stocks = {};
    try {
        desc = result.data.analysisText || '';
        stocks = result.data.stock || {};
    } catch (e){}

    var tagText = '<h5 class="linkBottom_half">'+desc+'</h5>';

    // 股票列表
    var tagStock = '<li onclick="stockFixQuestion(\''+stocks.code+'\',\''+stocks.name+'\',\''+stocks.marType+'\',\'个股综评\')">'+(stocks.label || stocks.name)+'</li>'

    tagStock =
        // <!--如果问题框，没有点评，请去掉clear_appraisal_mb样式名-->
        '<ul class="tlBox_link clear_appraisal_mb">'+
            tagStock+
        '</ul>';

    var temp = '<div class="bd"><div class="mb">'+tagText+tagStock+getRatingLabel(result,showInteractiveView)+'</div></div>';
    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}

/**
 * 打开弹窗
 * @param popupId 弹窗容器Id
 * @param randomNum 点击标签的Id
 */
function showFilterPopup(popupId, randomNum) {
    // 热点偏好筛选的ID，取出保存的当前选中项的索引
    var selectedOptions = $('#'+randomNum).attr('selectedOptions');
    // 所有选项
    var options = $('#'+popupId+' ul').find('i');
    // 循环设置当前项的选中状态
    for (var i=0; i<options.length; i++) {
        var option = $(options[i]);
        if (selectedOptions.indexOf(option.attr('index')) !== -1)
            option.attr('class', 'icon-select');
        else
            option.attr('class', 'icon-select_no')
    }
    // 关联弹窗与点击标签
    $('#'+popupId).attr('filterId', randomNum).show();
}

/**
 * 关闭弹窗
 */
function closePopupFilter(popupId) {
    $('#'+popupId).hide();
}

/**
 * 条件项点击
 * @param event
 * @param popupId
 */
function filterItemClick(event, popupId) {
    // console.log(event)
    // 当前点击项
    var currentTarget = $(event.currentTarget);
    // 当前项的样式
    var liClassName = event.currentTarget.className;
    // 当前点击项的icon
    var el = currentTarget.find('i')[0];
    // 点击项的样式
    var className = el.className;
    var items;
    if (className === 'icon-select') {
        el.className = 'icon-select_no';
        // 取消全部选中
        if (liClassName === 'all') {
            items = $('#'+popupId).find('i.icon-select');
            items.removeClass('icon-select').addClass('icon-select_no')
        }
    }
    else {
        el.className = 'icon-select';
        // 全部选中
        if (liClassName === 'all') {
            items = $('#'+popupId).find('i.icon-select_no');
            items.removeClass('icon-select_no').addClass('icon-select')
        }
    }
}

/**
 * 热点偏好筛选：确定条件
 */
function confirmFocusFilter() {
    // 当前选中的项
    var selectedItems = $('#popFocusFilter').find('i.icon-select');
    // 热点偏好筛选的ID
    var filterId = $('#popFocusFilter').attr('filterId');
    // 选中的索引集合
    var indexes = [];
    // 选中的文本集合
    var texts = [];
    // 循环选中项
    for (var i=0; i<selectedItems.length; i++) {
        var item = $(selectedItems[i]);
        indexes.push(item.attr('index'));
        if (item.attr('index') === '4')
            continue;
        texts.push(item.attr('text'))
    }
    // console.log(texts.join(','))
    if (indexes.length > 0) {
        // 将选中项的索引存储到‘热点偏好筛选’标签的属性上
        $('#'+filterId).attr('selectedOptions', indexes.join(','));
        var focusName = $('#'+filterId).attr('focusName');
        if (focusName)
            focusName = focusName+',';
        // send question
        freeQuestion(focusName + texts.join(',') + '的热点');
    }
    // close
    closePopupFilter('popFocusFilter');
}

/**
 * 个股偏好筛选：确定条件
 */
function confirmStockFilter() {
    // 当前选中的项
    var selectedItems = $('#popStockFilter').find('i.icon-select');
    // 个股偏好筛选的ID
    var filterId = $('#popStockFilter').attr('filterId');
    // 选中的索引集合
    var indexes = [];
    // 选中的文本集合
    var texts = [];
    // 循环选中项
    for (var i=0; i<selectedItems.length; i++) {
        var item = $(selectedItems[i]);
        indexes.push(item.attr('index'));
        if (item.attr('index') === '5')
            continue;
        texts.push(item.attr('text'))
    }
    // console.log(texts.join(','))
    if (indexes.length > 0) {
        // 将选中项的索引存储到‘个股偏好筛选’标签的属性上
        $('#'+filterId).attr('selectedOptions', indexes.join(','));
        var focusName = $('#'+filterId).attr('focusName');
        if (focusName)
            focusName = focusName+',';
        // send question
        freeQuestion(focusName + texts.join(',') + '的股票');
    }
    // close
    closePopupFilter('popStockFilter');
}
