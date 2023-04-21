/**
 * Created by BoBo on 2017-08-07.
 */
/**
 * 设置答案
 * @param json
 * @param isPopup 是否在弹窗中展示
 * @param isHistory 是否为历史消息
 * @param source  百度统计来源
 */
function setAnswer(json, isPopup, isHistory, source) {
    //产品类别
    var type = json.answerResultType;
    // 跳转类型的指令
    if(json.hasOwnProperty('jumpResult')){
        type = json.jumpResult.jumpResultType;
    }

    var showInteractiveView = isInteractiveView(type);

//     if(!checkModuleAuth(type)){
//         return;
//     }

    if(source === undefined){
        //原生的底部输入框
        if(appKey === 'appEzt'){
            source = "来源：E智通访问";
        }
        else if(appKey === 'appZsfc'){
            source = "来源：紫薯财富访问";
        }
        else if(appKey === 'appJftg'){
            source = "来源：巨峰投顾访问";
        }
        else if(appKey === 'appTopC'){
            source = "来源：Top股票助手访问";
        }
        else if(appKey === 'webPage'){
            source = "来源：网页版";
        }
        else if(appKey === 'appXgw'){
            source = "来源：知了选股";
        }
        else if(appKey === 'appHtyw'){
            source = "来源：航天云网";
        }
        else if(appKey === 'appEdu'){
            source = "来源：教育版";
        }
        else if(appKey === 'appAvatar'){
            source = "来源：Avatar版";
        } else {
            source = appKey;
        }
    }
    source = source+'-->'+type;
    if(isPopup){
        baiduTrackPageview('/'+appKey+'/pop/弹框/'+ type + '/' + source);
        baiduTrackEvent(type,'click',source);
    }else{
        baiduTrackPageview('/'+appKey+'/module/问答/'+ type + '/' + source);
    }

    // 这些指令在Avatar中不支持，先给提示
    if (appKey === 'appAvatar' && ['撤单页面','查询页面','持仓页面','预警设置','查看自选股','预警查看','预警设置清空','买入指令','卖出指令','自选股删除','自选股添加','选股页面','开户页面','科创板专题'].indexOf(type) !== -1) {
        unsupportedTips();
        playVoiceAnswerLite('您好，目前暂不支持该功能，换个问题试试吧', type);
        return;
    }

    // 仅Avatar中播放语音，以及非弹窗情况
    if (appKey === 'appAvatar' && !isPopup) {
        switch (type) {
            // 以下答案类型的语音在各自模板中特殊处理及播放
            case "个股技术分析":
            case "技术分析":
            case "资金流向":
            case "高管/股东增减持":
            case "股本结构":
            case "股东人数变化":
            case "港股通资金流向":
            case "融资融券":
            case "个股限售股解禁":
            case "流动性":
            case "竞争力数据":
            case "知识产权":
            case "指数综评":
                break;

            case "行业研报详情页面":
                var name = '';
                try {
                    name = json.jumpResult.jumpEntities[0].property.name;
                } catch (e) {
                }
                var voiceTxt = '这是我为您生成的'+name+'行业报告，我将从行业上下游产业链、行业发展趋势、行业竞争格局等维度对该行业进行综合分析。';
                playVoiceAnswerLite(voiceTxt, type);
                break;

            // 其它的播放后端传过来的语音
            default:
                playVoiceAnswer(type, json);
                break;
        }
    }

    switch (type) {
        case '事件影响':
            eventInfluence(json);
            break;
        case "推荐列表":
            recommendedQuestion(json);
            break;
        case "高管简介":
            executiveProfile1(json, showInteractiveView);
            break;
        case "行业推荐":
            industryRecommend(json);
            break;
        case "概念":
        case "概念股":
        case "热点":
        case "热点成分股":
            showConcepts(json, isPopup);
            break;
        case "个股所属板块":
            showPlate(json, isPopup, showInteractiveView);
            break;
        case "股票推荐":
            stockRecommend(json);
            break;
        case "所属题材":
            personalTheme(json, isPopup, showInteractiveView,source);
            break;
        case "经营分析":
        case "业绩简评":
        // case "业绩预告":
        case "投资建议":
        case "搜索回答":
        case "行业综评":
        case "行业":
        case "行业个股推荐":
        case '专家个股观点':
        case '专家行业观点':
            stockRelatedReports(json, '', isPopup, true, showInteractiveView);
            break;
        case '基础知识':
            basics(json);
            break;
        case "公司主营":
            companyMain(json, showInteractiveView);
            break;
        case "指数技术分析":
        case "个股技术分析":
        case "技术分析":
        case "指数":
        case "上证指数综合评价":
        case "指数综评":
            stockOverallEval(json, isPopup, showInteractiveView,source);
            break;
        case '股东列表':
            shareHolderList(json, showInteractiveView);
            break;
        case '分红配股':
            shareDividend(json, showInteractiveView);
            break;
        case "开盘价":
        case "收盘价":
        case "现价":
        case "最高价":
        case "最低价":
        case "涨跌幅":
        case "成交量":
        case "成交额":
        case "换手率":
        case "振幅":
        case "总市值":
        case "流通市值":
            pankouSingleData(json, showInteractiveView);
            break;

        case "市盈率":
        case "市净率":
        case "市销率":
        case "权益利润率":
        case "加权平均成本":
        case "投资回报率":
        case "每股现金流":
        case "总资产收益率":
        case "毛利率":
        case "营业收入同比增长":
        case "净利润增长率":
        case "净资产收益率":
        case "资产负债率":
        case "流动负债率":
        case "流动比率":
        case "速动比率":
        case "总资产周转率":
        case "存货周转率":
        case "应收账款周转天数":
        case "每股净资产":
        case "营业收入":
        case "净利润":
        case "每股盈利":
        case "每股公积金":
        case "每股未分配利润":
        case "每股经营现金流":
        case "毛利润":
        case "归属母公司净利润":
        case "净利率":
        case "存货周转天数":
        case "应收账款占比":
        case "净利润率":
        case "现金流分数":
        case "现金流量允当比率":
        case "现金再投资比率":
        case "偿债能力分数":
        case "总资产":
        case "总负债":
        case "成长能力分数":
        case "运营能力分数":
        case "营业周期":
        case "盈利能力分数":
        case "政府补贴占净利润比例":
        case "营业收入增长率":
        case "重要客户集中度":
        case "营业利润":
        case "营业费用率":
        case "营业利润率":
        case "经营活动现金净流量":
        case "投资活动现金净流量":
        case "融资活动现金净流量":
        case "经营活动现金净流量/营业利润":
        case "自由现金流":
        case "净资本增长率":
        case "可持续增长率":
        case "流动资产周转率":
        case "固定资产周转率":
        case "应收账款周转率":
        case "总资产周转天数":
        case "政府补贴占净利润比":
        case "净资产":
        case "净资本":
        case "商誉风险":
        case "资产收益率":
            variableProfit(json, showInteractiveView);
            break;
        case "财务指标":
            financialIndexNew(json, isPopup, showInteractiveView);
            break;
        case "基础报价数据是":
            pankouData(json, showInteractiveView);
            break;
        case "呼叫投顾":
        case "无法回答":
            noAnswer(json, showInteractiveView, isPopup);
            break;
        case "调侃问好":
        case "能力清单":
            sayHello(json);
            break;
        case "未开发":
            undevelopedFunction(json, showInteractiveView);
            break;
        case '公司概况':
            companyIntroduction(json, isPopup, showInteractiveView);
            break;
        case '办公地址':
            officeAddress(json, showInteractiveView);
            break;
        case "事件概述":
            eventOverview(json, isPopup);
            break;
        case '竞争优势':
            competitiveEdge(json, isPopup, showInteractiveView);
            break;

        // 与原生有交互的模块(开始)
        case '撤单页面':
            countDownFunction('撤单页面', 'commandTradeWithdrawList', '', isHistory, showInteractiveView);
            break;
        case '查询页面':
            countDownFunction('查询页面', 'commandTradeInquire', '', isHistory, showInteractiveView);
            break;
        case '持仓页面':
            countDownFunction('持仓页面', 'commandTradeHoldStockList', '', isHistory, showInteractiveView);
            break;
        case '预警设置':
            countDownFunction('预警设置', 'commandSetWarning', json, isHistory, showInteractiveView);
            break;
        case '查看自选股':
            countDownFunction('自选股', 'commandSelfStockList', '', isHistory, showInteractiveView);
            break;
        case '预警查看':
            countDownFunction('预警设置管理', 'commandEnterWarningSetting', '', isHistory, showInteractiveView);
            break;
        case '预警设置清空':
            clearWarningGoApp(json, showInteractiveView);
            break;
        case '买入指令':
        case '卖出指令':
            buyingStockEntry(json, showInteractiveView);
            break;
        case '自选股删除':
            clearOptionalStock(json, showInteractiveView);
            break;
        case '自选股添加':
            optionalStockEntrance(json, showInteractiveView);
            break;
        // 与原生有交互的模块(结束)
        case '资金流向':
            moneyFlow(json, isPopup, showInteractiveView);
            break;

        case '个股综评':
            stockAnalysis(json, isPopup, showInteractiveView,source);
            break;
        case '研报':
        case '资讯':
        case '资讯搜索':
            infoAndResearch(json, isPopup);
            break;
        case '通用答案':
            universalAnswer(json, showInteractiveView);
            break;
        case '相似K线':
            showSimilarKStock(json, true);
            break;
        case '通用单个答案':
        case '通用列表答案':
            universalSingleAnswer(json, true);
            break;

        case '条件选股':
            pickStockByCondition(json, isPopup, showInteractiveView);
            break;

        case '选股页面': //条件选股指令
            countDownFunction('条件选股', 'openStockConditionPage', '', isHistory, showInteractiveView, true);
            break;

        case '筹码分布':
            distributionOfChips(json, showInteractiveView);
            break;

        case '股东人数变化':
            stockHolderNumChange(json, showInteractiveView);
            break;

        case '股本结构':
            capitalStructure(json, isPopup, showInteractiveView);
            break;
        case '公司高管':
            companyExecutives(json, showInteractiveView);
            break;
        case '股权激励':
            stockOwnershipIncentive(json, showInteractiveView);
            break;
        case '高管图谱':
            executiveAtlas(json, showInteractiveView);
            break;
        case '高管/股东增减持':
            shareholdersInOrDe(json, showInteractiveView);
            break;
        case '十大股东':
            top10StockHolder(json, showInteractiveView);
            break;
        case '估值评级':
            valuationGrade(json, '', isPopup, true, showInteractiveView);
            break;
        // case '投入产出比是':
        //     inputOutputAnalysis(json, showInteractiveView);
            // break;
        case '风险提示':
            companyRiskInfo(json, showInteractiveView);
            break;
        case '新股综评':
            drawingLotsStrategy(json, showInteractiveView);
            break;
        case '股票对比是':
            compareStocks(json, showInteractiveView);
            break;
        case '知识产权':
            intellectual(json, showInteractiveView);
            break;
        case '公告':
            notice(json,isPopup);
            break;

        case '开户页面': // 指令
            if(showInteractiveView)
                countDownFunction('开户页面', 'openAccountPage', '', isHistory, showInteractiveView, true);
            else
                sendPreAnswerContent('开立A股账户的方式有以下两种： 1、网上（手机）开户：请您准备身份证、银行卡后， 在APP上开户2、现场开户：请您携带二代身份证、同名银行卡在交易日交易时间前往营业部办理', '', '', json.qId);
            break;

        case '近期热点':
            openHotSpotPage();
            break;

        case '敏感信息':
            sendPreAnswerContent('您的问题中含有敏感词，请重新输入', '', '', json.qId);
            break;

        case '融资融券':
            marginBalance(json, showInteractiveView);
            break;

        case '个股限售股解禁':
            restrictedStockUnlock(json, showInteractiveView);
            break;

        case '流动性':
            moneyLiquidity(json, showInteractiveView);
            break;

        case '港股通资金流向':
            sh_hk_upMoneyFlow(json, showInteractiveView);
            break;

        case '竞争力数据':
            materialAssets(json, showInteractiveView);
            break;

        case '高管变动':
            executivesChange(json, showInteractiveView);
            break;

        case '员工持股':
            employeeStockHolding(json, showInteractiveView);
            break;

        case '业绩预告':
            performanceChange(json, showInteractiveView);
            break;

        case '业绩快报':
            achievementReport(json, showInteractiveView);
            break;

        case '股权质押页面': // 指令
            countDownFunction(json.preAnswerContent, 'openPledgeOfStock', json, isHistory, appFrom==='pc' || showInteractiveView, true);
            getQuestionTabs(json);
            break;

        case '热点行业详情页面': // 指令
            json.jumpResult.jumpEntities[0].property.qId = json.qId;
            countDownFunction('行业分析', 'openHotConcept', json.jumpResult.jumpEntities[0].property, isHistory, appFrom==='pc' || showInteractiveView, true);
            getQuestionTabs(json);
            break;

        case '行业研报详情页面':
        case '行业分析页面': // 指令
            json.jumpResult.jumpEntities[0].property.qId = json.qId;
            countDownFunction('行业分析', 'openIndustryAnalysis', json.jumpResult.jumpEntities[0].property, isHistory, appFrom==='pc' || showInteractiveView, true);
            getQuestionTabs(json);
            break;

        case '近期热点页面': // 指令
            countDownFunction('近期热点', 'openRecentSpot', json, isHistory, appFrom==='pc' || showInteractiveView, true);
            getQuestionTabs(json);
            break;

        case '财务分析':
            financialAnalysis(json, isPopup, showInteractiveView);
            break;

        case '财务数据':
            financialMainIndex(json, isPopup, showInteractiveView);
            break;

        case '同行数据对比':
            companyIndustryCompare(json, isPopup, showInteractiveView);
            break;

        case '投资教育知识':
            kcbNews(json);
            break;

        case '回购信息':
            financialBuyback(json, showInteractiveView);
            break;

        // 当前机会分析
        case '当前机会分析':
            opportunityMining(json, showInteractiveView);
            break;

        // 热点分析
        case '热点分析':
            focusAnalysis(json, showInteractiveView);
            break;

        // 个股买入分析
        case '个股买入分析':
            buyingAnalysisOfStock(json, showInteractiveView);
            break;

        case '财务风险-首页信号':
            financialRisk(json, showInteractiveView);
            break;

        case '科创板专题':
            countDownFunction('科创板专题', 'openKcbTopic', {url:json.preAnswerContent, qId: json.qId}, isHistory, appFrom==='pc' || showInteractiveView, true);
            getQuestionTabs(json);
            break;

        case '招股说明书解读':
            // 处理后端语音文本异常
            if (json.speechAnswerContent === '--') {
                json.speechAnswerContent = '招股说明书如下'
            }
            countDownFunction('招股说明书', 'openProspectus', {type:json.preAnswerContent, qId: json.qId}, isHistory, appFrom==='pc' || showInteractiveView, true);
            getQuestionTabs(json);
            break;

        // E智通用，替换原来的个股综评
        case '个股分析报告' :
            sendUrlPreAnswer(json, isHistory, type);
            break;

        // E智通用
        case '人工客服' :
            // 引导语
            var guide = "<div class='hd'>" +
                            "<div class='mb_avatar'>" +
                                "<img alt='logo' onclick='setFeedbackMode()' src=" + headImg + " >" +
                            "</div>"+
                            "<h4>打开 <a onclick='callAdviser2()'>"+(json.preAnswerContent || '')+"</a></h4>" +
                        "</div>";
            appendAnswer(guide, 'md_left_v2', json.qId);
            callAdviser2();
            break;

        default:
            sendPreAnswerContent('小E暂时回答不了这个问题', '', '', json.qId);
            break;
    }

    if (!isPopup)
        scrollToQuestion();
}

/**
 * 不支持的功能提示信息
 */
function unsupportedTips() {
    sendPreAnswerContent('当前系统不支持此功能');
}

/**
 * 播放语音答案
 * @param type
 * @param result
 */
function playVoiceAnswer(type, result) {
    //传给安卓的语音信息和动作
    var speechAnswer = '';
    if (result) {
        speechAnswer = result.speechAnswerContent || result.audioText;
    }

    if (!speechAnswer || speechAnswer === '--') {
        speechAnswer = '您好';
    }

    try {
        var isanswer = 1;
        if(type === '呼叫投顾' || type === '无法回答' || type === '未开发'){
            isanswer = 0;
        }
        else if ((type === "调侃问好" || type === "能力清单") && result.data && result.data.helpGuide) {
            isanswer = 2;
            type = '';
        }

        if (appFrom === 'android' || appFrom === 'ios') {
            console.log('语音：'+speechAnswer)
            window.contestapp.speakAnswer(speechAnswer, isanswer, type || '');
        }
    } catch (error) {
        // console.log(speechAnswer, isanswer, type);
    }
}

/**
 * 简版播放语音方法，一般语音文本需要从数据计算得来
 * @param msg
 * @param type
 */
function playVoiceAnswerLite(msg, type) {
    console.log('playVoiceSimple语音：'+msg);
    if (appKey === 'appAvatar') {
        try {
            if (appFrom === 'android' || appFrom === 'ios') {
                window.contestapp.speakAnswer(msg || '您好', 1, type || '');
            }
        } catch (error) {}
    }
}

/**
 * 通过此方式来显示小E的原生容器
 */
function showXiaoE() {
    try {
        if (appFrom === 'android' || appFrom === 'ios') {
            window.contestapp.speakAnswer('', 1, '');
        }
    } catch (error) {
        // console.log(speechAnswer, isanswer, type);
    }
}

/**
 * 设置来自node的答案
 * @param json
 * @param isPopup
 * @param isHistory
 * @param source
 * @param divId 容器ID
 */
function setNodeAnswer(json, isPopup, isHistory, source, divId) {

    if(isPopup){
        appendNodePop(json);
        return;
    }

    appendNodeAnswer(json, divId);

    setTimeout(function () {
        scrollToQuestion();
    },50);

    try {
        if(source === undefined){
            //原生的底部输入框
            if(appKey === 'appEzt'){
                source = "来源：E智通访问";
            }
            else if(appKey === 'appZsfc'){
                source = "来源：紫薯财富访问";
            }
            else if(appKey === 'appJftg'){
                source = "来源：巨峰投顾访问";
            }
            else if(appKey === 'appTopC'){
                source = "来源：Top股票助手访问";
            }
        }
        var type = $(".answerResultType:last").val();
        source = source+'-->'+type;
        if(isPopup){
            baiduTrackPageview('/'+appKey+'/pop/弹框/'+ type + '/' + source);
            baiduTrackEvent(type,'click',source);
        }else{
            baiduTrackPageview('/'+appKey+'/module/问答/'+ type + '/' + source);
        }
    }catch (e) { }
}

function appendNodePop(json){
    $('#bottomAnswerContainer').html(json);
    // appendAnswerToPopup(json);
}
/**
 * 追加答案到页面
 * @param json 拼好的html串
 * @param divId div的id
 */
function appendNodeAnswer(json, divId) {
    var div;
    var isDivExist = false;
    var className = appKey === 'appAvatar' ? 'md_left_v2' : '';

    // 如果divId不为空
    if (divId) {
        // 如果容器已经存在
        if ($('#'+divId).length > 0) {
            div = document.getElementById(divId);
            isDivExist = true;
        } else {
            isDivExist = false;
            // 创建新容器
            div = document.createElement("DIV");
            div.className = className;
            div.id = divId;
        }
        lastQuestionId = divId;
    } else {
        div = document.createElement("DIV");
        div.className = className;
        div.id = lastAnswerId = generateRandomClassName('qaId');
    }

    var html = '';
    // 处理报告类型的答案
    if (json.hasOwnProperty('type') && json.type === 'report') {
        if (json.code === -1) {
            sendPreAnswerContent(json.message, '', '', json.qId || divId);
        } else {
            if (appKey !== 'appAvatar') {
                sendPreAnswerContent(json.preAnswerContent || '', '', '', json.qId || divId);
            }

            div.style = 'margin: 0.75rem 0;';
            // div.style = 'margin: 0.75rem 0; background-color: #FFFFFF';
            html = json.content + generateGuideQuestionList(json.guidanceQuestions, 'padding-left: 10px') + getRatingLabel(json, json.showInteractiveView);
            html = '<div style="background-color: #FFFFFF; margin-top: 10px">'+html+'</div>';
            if (isDivExist) {
                $(div).append(html)
            } else {
                // 当前容器只留一个答案存在
                if (appKey === 'appAvatar') {
                    $('#mainContent').html('');
                    html =
                        // '<div class="md_left_v2">'+
                            '<div class="hd">'+
                                '<div class="mb_avatar">'+
                                    '<img src="'+headImg+'">'+
                                '</div>'+
                                '<h4>'+(json.preAnswerContent||'')+'</h4>'+
                            '</div>'+
                            html;
                        // '</div>';
                    div.innerHTML = html;
                    mainContent.appendChild(div);
                } else {
                    div.innerHTML = html;
                    mainContent.appendChild(div);
                }
            }

            try {
                if (appKey === 'appAvatar') {
                    playVoiceAnswer(json.answerResultType, json)
                    // voiceTxt = json.audioText;
                    // 从报告中提取文本来播放语音
                    // var temp = json.content;
                    // var regTagA= /<h5(([\s\S])*?)<\/h5>/g;
                    // var arr = temp.match(regTagA);
                    // if (arr.length > 0) {
                    //     var voiceTxt = arr[0].replace('<h5>','').replace('</h5>','')
                    //     console.log(voiceTxt)
                    //     if (voiceTxt) {
                    //         if (appFrom === 'android' || appFrom === 'ios') {
                    //             window.contestapp.speakAnswer(voiceTxt, 1, '');
                    //         }
                    //     }
                    // }
                }
            } catch (e) {
            }

            // onWindowLoaded 为报告中的方法
            loadJsE(json.jsArray, 'onWindowLoaded', json.jsHost, json.sn)
        }
    } else {
        if (isDivExist) {
            $(div).append(json)
        } else {
            try {
                // 当前容器只留一个答案存在
                if (appKey === 'appAvatar') {
                    $('#mainContent').html('');
                    mainContent.appendChild(div);
                    // 此方式才会执行json里的js代码
                    $(div).append(json);
                } else {
                    div.innerHTML = json;
                    mainContent.appendChild(div);
                }
            } catch (e) {
               // sendPreAnswerContent(e.stack.toString())
            }
        }
    }

    if (appKey === 'appAvatar') {
        resetEleHeightForAvatar();
    }

    setTimeout(scrollToQuestion, 500)
    // scrollToQuestion();
}

/**
 * 答案后追加的推荐问题
 * @param qlist
 * @returns {string}
 */
function generateGuideQuestionList(qlist, extraStyle) {
    var tagBody = '';
    var tagList = '';

    if (showRecommendedQuestion) {
        var list = qlist || [];
        for (var i=0; i<list.length; i++) {
          tagList += '<li onclick="freeQuestion(\''+list[i].replace(/'/g, "\\'")+'\')">'+list[i]+'</li>'
        }

        if (tagList) {
            tagBody =
                    '<ul class="tlBox_link" style="padding-top: 0.5rem;'+(extraStyle||'')+'">'+
                        '<h5 class="t_gray">'+( appKey === 'appHtyw' ? 'You may also want to know:' : '您可能还想知道：')+'</h5>'+
                        tagList+
                    '</ul>'
        }
    }

    return tagBody
}


/**
 * 接收socket推送消息
 */
function socketPushAnswer(json, from) {
    var result = typeof json === 'object' ? json : JSON.parse(json);
    // console.log(from)
    // console.log(result)

    // 输出时间
    sendTime(result.data.createAt || null);
    // sendPreAnswerContent(from === 'pull' ? '历史消息：' : '推送消息：')
    var type = result.data.type;
    switch (type) {
        // 盘前要闻
        case 'news':
            pushNews(result);
            break;

        // 焦点异动
        case 'focusShift':
            focusShift(result);
            break;

        // 行情播报
        case 'quoteBroadcast':
            quoteBroadcast(result);
            break;

        // 当前机会分析
        case 'opportunityMining':
            opportunityMining(result);
            break;

        // 条件选股
        case '条件选股':
            pickStockByCondition(result, false, isInteractiveView(type));
            break;

        default:
            break;
    }
}

/**
 * 输出时间
 */
function sendTime(time) {
    var tagTime = "<div class='box'>" + changeTimeForHour(time ? time : new Date().getTime()) + "</div>";
    appendAnswer(tagTime, 'md_time');
}

/**
 * 输出问题
 * @return 返回问答对的容器id
 */
function sendQuestion(txt, time, showLoading, voiceQuestion) {
    if(!showQuestion) {
        return generateRandomClassName('qaId');
        // return '';
    }

    var question = txt || txtInput.val();
    // 记住最后一个问题
    lastQuestion = question;

    var divId = generateRandomClassName('qaId');
    lastQuestionId = divId;
    appendAnswer('', '', divId);

    // 历史问题展示时间
    if (time) {
        var cache = "<div class='box'>" + changeTimeCache(time, true) + "</div>";
        appendAnswer(cache, 'md_time', divId);
    }

    // 问题
    var tagQuestion = "<div class='md_right_v2'>" +
                          "<p onclick='copyTxtToInput(event)'>" +
                            question +
                          "</p>" +
                          "<i class='icon-horn_dialog-box'></i>" +
                      "</div>";
    // 如果是语音问题追加一行文字说明
    if (voiceQuestion) {
        tagQuestion += "<div class='md_right_v2 md_rightTxt_v2'><h6>轻点问题以编辑</h6></div> ";
    }
    appendAnswer(tagQuestion, '', divId);

    // 正在加载的loading。。。
    if (showLoading === undefined || showLoading) {
        var loading =
          "<div class='md_left_v2'>" +
              "<div class='hd'>" +
                  "<div class='mb_avatar'>" +
                    "<img alt='logo' src=" + headImg + ">" +
                  "</div>" +
                  "<div class='spinner'>" +
                      "<div class='bounce1'></div>" +
                      "<div class='bounce2'></div>" +
                      "<div class='bounce3'></div>" +
                  "</div>" +
              "</div>" +
          "</div>";
        appendAnswer(loading, 'md md_left_v2 showLoading', divId);
    }
    scrollToQuestion();

    return divId;
}

/**
 * 每句话开头的引导语
 * @param preAnswerContent
 * @param morningPushId
 * @param extraContent 额外的内容
 */
function sendPreAnswerContent(preAnswerContent, morningPushId, extraContent, divId) {
    if (divId) {
        $("#"+divId+" .showLoading").remove();
    } else {
        $(".showLoading").remove();
    }

    extraContent = extraContent || '';
    var talk = "<div class='hd'>" +
                    "<div class='mb_avatar'>" +
                        "<img alt='logo' onclick='setFeedbackMode()' src=" + headImg + ">" +
                    "</div>"+
                    "<h4 style='"+(appKey==='appAvatar'?'padding-right:15px':'')+"'>" + (preAnswerContent || '') + "</h4>" +
                "</div>" + extraContent;

    if (morningPushId) {
        appendAnswerForMorningPush(talk, 'md_left_v2', morningPushId);
    } else {
        appendAnswer(talk, 'md_left_v2', divId);
    }
}

// 输出页面跳转类型的答案
function sendUrlPreAnswer(result, isHistory, answerType) {
    $(".showLoading").hide();

    var params = {
        appKey: appKey,
        appFrom: appFrom,
        appVersion: appVersion,
        url: result.data.urlAndParam || result.data.url
    };
    var strParams = JSON.stringify(params).replace(/"/g, "~");

    // 引导语
    var guide = "<div class='hd'>" +
                    "<div class='mb_avatar'>" +
                        "<img alt='logo' onclick='setFeedbackMode()' src=" + headImg + ">" +
                    "</div>"+
                    "<h4>打开 <a onclick='navigateUtil.navigate(\""+strParams+"\")'>"+(result.preAnswerContent || '')+"</a></h4>" +
                "</div>";
    appendAnswer(guide, 'md_left_v2', result.qId);

    // 推荐问题
    var guideQ = generateGuideQuestionList(result.guidanceQuestions);
    if (guideQ) {
        guideQ = '<div class="bd"><div class="mb">'+guideQ+'</div></div>';
        appendAnswer(guideQ, '', result.qId)
    }

    if (!isHistory) {
        navigateUtil.navigate(params, answerType)
    }
}

/**
 * 追加答案到页面
 * @param html 拼好的html串
 * @param className div容器的class名称
 * @param divId div的id
 */
function appendAnswer(html, className, divId) {
    var div;
    var isDivExist = false;

    // 如果divId不为空
    if (divId) {
        // console.log($('#'+divId).length)
        // 如果容器已经存在
        if ($('#'+divId).length > 0) {
            div = document.getElementById(divId);
            isDivExist = true;
            // 如果有传样式，那么需要包装一下
            if (className) {
                html = '<div class="'+className+'">'+html+'</div>'
            }
        } else {
            isDivExist = false;
            // 创建新容器
            div = document.createElement("DIV");
            if (className)
                div.className = className;
            div.id = divId;
        }
        lastQuestionId = divId;
    } else {
        // 创建新容器
        div = document.createElement("DIV");
        if (className)
            div.className = className;
        div.id = lastAnswerId = generateRandomClassName('qaId');
    }

    if (isDivExist) {
        $(div).append(html)
    } else {
        // 当前容器只留一个答案存在
        if (appKey === 'appAvatar') {
            $('#mainContent').html('')
        }
        div.innerHTML = html;
        mainContent.appendChild(div);
    }

    if (appKey === 'appAvatar') {
        resetEleHeightForAvatar();
    }
}

/**
 * 为Avatar版重新设置答案模板的高度，以便在模板内部滚动
 */
function resetEleHeightForAvatar() {
    // winH是原生传过来的高度
    var hkws_hd_H = $(".rxhE_hkws .hd").outerHeight() || 32;
    var hkws_bd_H = winH - hkws_hd_H - 40;

    $(".rxhE_hkws .bd").css({
        "max-height": hkws_bd_H,
        "overflow-y": "scroll"
    });
}

/**
 *
 */
// function appendFrameQuestion(src) {
//     var tagIframe =
//         '<div class="md_left_v2">'+
//             '<div class="hd">'+
//                 '<div class="mb_avatar">'+
//                     '<img src="'+headImg+'">'+
//                 '</div>'+
//                 '<h4></h4>'+
//             '</div>'+
//             '<div class="bd">'+
//                 // '<div class="mb" style="padding: 0;">'+
//                     '<iframe src="'+src+'" style="width: 100%; height: 100%; border: none;"></iframe>'+
//                 // '</div>'+
//             '</div>'+
//         '</div>';
//
//     $(mainContent).html('');
//     $(mainContent).append(tagIframe);
//     resetEleHeightForAvatar();
// }

/**
 * 晨间推送添加到页面
 * @param html 拼好的html串
 * @param className div容器的class名称
 * @param divId div的id
 */
function appendAnswerForMorningPush(html, className, divId) {
    var div = document.createElement("DIV");
    if (className)
        div.className = className;
    div.innerHTML = html;
    document.getElementById(divId).appendChild(div);
}

/**
 * 追加答案到底部弹窗中
 * @param html
 */
function appendAnswerToPopup(html, addClass) {
    if (addClass) {
        $("#sumUp").addClass('sumUp_conExec');
        $('#sumUp').html(html).removeClass();
    } else {
        $('#bottomAnswerContainer').html(html);
    }
}

/**
 * 返回评价的HTML标签行
 * @param result 每个回答的spanId
 * @param showInteractiveView
 * @returns {string}
 */
function getRatingLabel(result, showInteractiveView) {
    if(!showRateThumbs) {
        return '';
    }

    var reportStyle = '';
    if (result.type === 'report') {
        reportStyle = 'background-color: white; margin: 0';
    }

    var upId = generateRandomClassName('up');
    var downId = generateRandomClassName('down');
    var temp = '<div class="box_appraisal" style="'+reportStyle+'">';
    var stockInfo = {};
    if (showInteractiveView) {
        if (result.questionAnalyse[0].hasOwnProperty('entity') && result.questionAnalyse[0].entity.length > 0) {
            stockInfo = result.questionAnalyse[0].entity[0].property;
        }
        var hideClass = generateRandomClassName('');
        var questionAnalyse = result.questionAnalyse[0];
        var stockList = [];
        if (questionAnalyse.hasOwnProperty(('entity'))) {
            stockList = questionAnalyse.entity;
        }
        var entityContent = 0;
        stockList.forEach(function (item, index) {
            if (item.type == '股票') {
                entityContent += 1;
            }
        });
        temp += '<ul>';
        if (appKey !== 'appTopC' && result.hasOwnProperty('properties') && entityContent <= 1) {
            if (result.properties.hasOwnProperty('optional')) {
                if (result.properties.optional == "del") {
                    temp += "<li  class='deleteOptional" + hideClass + "' onclick=\"clearOptionalGo('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-reduce'></i><span>删自选</span></li>";
                    temp += "<li style='display:none;' class='addOptional" + hideClass + "' onclick=\"addOptional('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-plus'></i><span>加自选</span></li>";
                } else {
                    temp += "<li style='display:none;' class='deleteOptional" + hideClass + "' onclick=\"clearOptionalGo('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-reduce'></i><span>删自选</span></li>";
                    temp += "<li class='addOptional" + hideClass + "' onclick=\"addOptional('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-plus'></i><span>加自选</span></li>";
                }
            }
            if (result.properties.hasOwnProperty('warning')) {
                if (result.properties.warning == "del") {
                    temp += "<li  class='deleteWarning" + hideClass + "'  onclick=\"warningGoApp('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-warning_ok'></i><span>预警</span></li>";
                    temp += "<li style='display:none;' class='addWarning" + hideClass + "'  onclick=\"warningGoApp('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-warning'></i><span>预警</span></li>";
                } else {
                    temp += "<li style='display:none;' class='deleteWarning" + hideClass + "'  onclick=\"warningGoApp('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-warning_ok'></i><span>预警</span></li>";
                    temp += "<li class='addWarning" + hideClass + "'  onclick=\"warningGoApp('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-warning'></i><span>预警</span></li>";
                }
            }
        }
        temp += '</ul>';
    }
    temp += '<a><i id="' + upId + '" class="icon-good" onclick=ratingAnswer("' + result.spanId + '","' + 2 + '","' + upId + '")></i><span></span></a>' +
        '<a><i id="' + downId + '" class="icon-bad" onclick=ratingAnswer("' + result.spanId + '","' + 1 + '","' + downId + '")></i><span></span></a>' +
        '</div>';
    return temp;
}

/**
 * 评价回答
 * @param spanId 答案标识
 * @param rate 1-差评,2-好评
 * @param labelId
 */
function ratingAnswer(spanId, rate, labelId) {
    // console.log(labelId+":"+$("#"+labelId).hasClass('cur'))
    var curLabel = $("#" + labelId);
    if (curLabel.hasClass('cur'))
        return;

    sendRateQuestion(rate);
    rateAnswer(spanId, rate, function (result) {
        // console.log(result)
        curLabel.addClass('cur');
        if (rate === "1") {
            rateAnswerAfter(appKey === 'appHtyw' ? 'Thanks for your rating, you can keep asking question' : '您可以点击反馈写下您的意见，我会继续改进');
        }
        else if (rate === '2') {
            rateAnswerAfter(appKey === 'appHtyw' ? 'Thanks for your rating, you can keep asking question' : '谢谢您的评价，您可以继续提问');
        }
    })
}

/**
 * 输出评价内容
 * @param rate
 */
function sendRateQuestion(rate) {
    var temp = '';
    if (rate === '1')
        temp = '<i class="icon-bad2"></i>';
    else if (rate === '2')
        temp = '<i class="icon-good2"></i>';

    var questionId = generateRandomClassName('thumbId');
    appendAnswer(temp, 'md md_right_v2', questionId);
    scrollToQuestion();
}

/**
 * 差评成功后输出
 * @param msg
 */
function rateAnswerAfter(msg) {
    sendPreAnswerContent(msg);

    if (appKey !== 'appHtyw' && appKey !== 'appHcVtm') {
        var answerId = generateRandomClassName('answer');
        var temp =
          '<ul>' +
          '<li onclick="setFeedbackMode()">反馈</li>';
        if (appKey === "appEzt") {
            temp += '<li onclick="callAdviser2()">人工服务</li>';
        }
        temp += '</ul>';
        appendAnswer(temp, 'md_fastNav pt_1', answerId);
        lastQuestionId = answerId;
    }

    scrollToQuestion();
}

/**
 * 人工服务，此处不记录问题
 */
function callAdviser2() {
    lastQuestion = '';
    callAdviser();
}

/**
 * 呼叫投顾 | 人工服务
 */
function callAdviser() {
    // sendPreAnswerContent('小e即将为您跳转');
    scrollToBodyEnd();
    var uu = uuid2();
    var lx = "nm";
    var channel = "app";
    var resource = "kapp";
    var khid = channel + "-" + uu;
    var url = "https://qiangdan.hczq.com:18880/ddkh/#/chat/" + lx + "/" + khid + "/" + resource + "/" + channel + "?platform=app&answer=" + encodeURIComponent(lastQuestion);
    if (appFrom === 'pc') {
      window.open(url, '_black')
    } else {
      window.location.href = url
    }
}

/**
 * 记录跳转到人工服务的问题
 * @param spanId
 * @param qId
 */
function recordQuestion(spanId, qId) {
    var qtxt = $('div#' + qId)[0].innerText;
    manualQuestion(spanId, qtxt, function (result) {
        // console.log(result)
    });
}

/**
 * 拷贝点击的问题到文本框
 * @param event
 */
function copyTxtToInput(event) {
    var eventTxt = Object.prototype.toString.call(event) === '[object MouseEvent]' ? event.target.innerText : event;
    if (appFrom === 'ios' || appFrom === 'android') {
        if (useAppInput) {
            try {
                if (appFrom === 'android')
                    window.contestapp.copyTxtToInput(eventTxt);
                else if (appFrom === 'ios')
                    window.webkit.messageHandlers.copyTxtToInput.postMessage(eventTxt);
            } catch (e) {
                // sendPreAnswerContent('调用App方法出错：' + e.toString());
                saveLog('jsError', e.message, 'robotCommon.js', 0, 'copyTxtToInput()', e.stack.toString());
            }
        } else {
            copyTxtToH5Input(eventTxt);
        }
    } else {
        copyTxtToH5Input(eventTxt);
    }
}

function copyTxtToH5Input(eventTxt) {
    txtInput.val(eventTxt);
    txtInput.focus();
    if (appFrom) {
        goWord();
    }
}

/**
 * 展示链接中的问题
 * @param msg
 * @returns {number}
 */
function showParamQuestion(msg) {
    var timestamp = new Date().getTime();
    var divId = 'questionId' + timestamp;
    var temp = "<p>" + msg + "</p><i class='icon-horn_dialog-box'></i>";
    appendAnswer(temp, 'md md_right_v2', divId);

    var talk = "<div class='hd'><div class='mb_avatar'><img alt='logo' src=" + headImg + "></div>";
    talk += "<div class='spinner'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div></div>";
    appendAnswer(talk, 'md_left_v2 showLoading', 'loadingId' + timestamp);

    return timestamp;
}

//关闭按钮
$(".pop_v2 .a_close").click(function () {
    $(this).parents(".pop_v2").addClass("hide").removeClass("show");
});

/**
 * 推荐理由的展开/收起
 * @param liCls
 * @param event
 */
function setContentVisible(liCls, event) {
    $('.' + liCls).toggleClass('on');
    $('.' + liCls).find('.expandH').slideToggle();
    if (event) {
        if (event.target.innerText === '【展开】')
            event.target.innerText = '【收起】';
        else
            event.target.innerText = '【展开】';
    }
}

/**
 * 长度改成汉字数字
 */
function changeNumToHan(num) {
    var numHan = "";
    switch (num) {
        case 1:
            numHan = "一";
            break;
        case 2:
            numHan = "二";
            break;
        case 3:
            numHan = "三";
            break;
        case 4:
            numHan = "四";
            break;
        case 5:
            numHan = "五";
            break;
        case 6:
            numHan = "六";
            break;
    }
    return numHan;
}
// 财务指标滚动隐藏箭头
function analysisScroll(event) {
    if ($(event.target).scrollLeft() > 20) {
        $(event.target).siblings("i").hide();
    }
    else {
        $(event.target).siblings("i").show();
    }
}

//给Nav下的标签添加点击事件
function navClick(navId,title) {
    $('#' + navId).children().click(function () {
        $(this).addClass("on").siblings().removeClass("on");
        var order = $(this).index();
        $(this).parent().siblings().each(function () {
            $(this).removeClass("show");
        });
        $(this).parent().siblings().eq(order).addClass("show");
        var txt = $(this)[0].innerHTML+'点击';
        baiduTrackEvent(title+'--'+txt,'click',title+'--'+txt);//百度统计
    });
}

/**
 * 资讯和研报详情弹层
 * @param json  数据源
 * @param type  个性化首页资讯  传参 homePage;  其他来源传参 空
 */
function commonInfoDetail(json,type) {
    var temp = "",
      title = '',
      mediaFrom='',
      publishAt,
      stock=[],
      content='';

    if(type === "homePage"){
        if(json.data){
            title = json.data.title;
            mediaFrom = json.data.mediaFrom;
            publishAt = getDataGridTimeFormat(json.data.publishAt);
            content = json.data.content;
            stock = json.data.stock;
        }
    }else if(type === "资讯搜索") {
        if (json.data.list.length > 0) {
            var item = json.data.list[0];
            title = item.title;
            mediaFrom = item.mediaFrom;
            publishAt = getDataGridTimeFormat(item.publishAt);
            content = item.content;
            stock = [];
        }
    }else{
        if (type === '科创板资讯') {
            title = json.data.title;
            mediaFrom = json.data.infoSource;
            publishAt = getDataGridTimeFormat(json.data.publishAt);
            content = json.data.details;
            // 让图片高度根据宽度自适应
            // var par = /<img.*?height="(.*?)".*?\/?>/gi   //匹配包含height的img标签
            var par = /<img [^>]*height=['"]([^'"]+)[^>]*>/gi;
            content = content.replace(par, function (match, capture) {
                return match.replace(capture, 'auto')
            })
        } else {
            title = json.title;
            mediaFrom = json.mediaFrom;
            publishAt = getDataGridTimeFormat(json.publishAt);
            content = json.content;
            stock = json.stock;
        }
    }
    temp += "<div class='box_show box_show_btn infoDetail'><h3 style='font-weight: 500;padding: .33rem 0;padding-top: .33rem;padding-bottom: .13rem;margin-bottom: .5rem;'><b>" + title + "</b></h3><span>来源:" + mediaFrom + "</span><span>" + publishAt + "</span>";

    if (stock.length > 0) {
        temp += '<h4 style=\'margin-top: .5rem;\'>相关个股:';
        for (var i = 0; i < stock.length; i++) {
            temp += "<span style='color: #2c3e50!important;font-weight: 500;font-size: 0.875rem;'>" + stock[i].name + "</span>";
        }
    }

    temp += "</h4><p>" + content + "</p></div>";

    appendAnswerToPopup(temp);
}

/**
 * 将字符串转为数组
 * @param str
 * @returns {Array}
 */
function strToArr(str){
    var arr = [];
    if(str){
        arr = str.split(/\s+/);
        var len = arr.length;
        for(var i=0; i<len; i++){
            arr[i] = arr[i].split('.')[1]
        }
    }
    return arr
}

/**
 * 将毫秒数转化为日期
 */
function formatTime(time, type){
    var date = new Date(time);
    if(type == 'year'){
        date = date.getFullYear()
    }else if(type == 'date'){
        date =  (date.getMonth() + 1) + "-" + date.getDate()
    }
    return date

}

//条件选股：查询热点关联原因，并在弹窗中展示
function getRelatedReason(subjectCode, subjectName, subjectMarket, subjectRawValue) {
    expoitFixedAnswerForShare(subjectCode, subjectName, subjectMarket, subjectRawValue, '行业个股推荐理由', function (result) {
        var content = '';
        if (result.answerResultType !== '呼叫投顾' && result.data.list && result.data.list.length>0) {
            var item = result.data.list[0];
            content = item.analyseText || item.text;
            content = replaceLineBreak(content);
            var cludeTitleContent = "";
            if (item.title)
                cludeTitleContent = "<h4 style='font-size:0.875rem;padding:3px 0;font-weight:bold;'>" + (item.title || '') + "</h4>";
            var redH = "<s class='t_red'>" + subjectRawValue + "</s>";
            if (cludeTitleContent.indexOf(subjectRawValue) !== -1) {
                var regH = "/" + subjectRawValue + "/g";
                cludeTitleContent = cludeTitleContent.replace(eval(regH), redH);
            }
            var redT = "<s class='t_red'>" + subjectName + "</s>";
            if (cludeTitleContent.indexOf(subjectName) !== -1) {
                var regT = "/" + subjectName + "/g";
                cludeTitleContent = cludeTitleContent.replace(eval(regT), redT);
            }
            var redM = "<s class='t_red'>" + subjectCode + "</s>";
            if (cludeTitleContent.indexOf(subjectCode) !== -1) {
                var regM = "/" + subjectCode + "/g";
                cludeTitleContent = cludeTitleContent.replace(eval(regM), redM);
            }
            cludeTitleContent += '<h5>'+content+'</h5>';
        } else {
            cludeTitleContent = '<h5>暂无数据</h5>';
        }
        showPopupMsg(subjectName+'与'+subjectRawValue,cludeTitleContent)
    }, null)
}

// 关联原因弹窗：显示
function showPopupMsg(title, content) {
    $('#popHead').html(title+'关联原因');
    $('#popContent').html(content);
    $('#popMsg').show()
}
function closePopupMsg() {
    $('#popMsg').hide()
}

/**
 * 取股票报价行情
 * @param symbol
 * @param containerId
 */
function getStockQuota(symbol, containerId) {
    // 取报价
    getPrice(symbol, function (result) {
        // console.log(result)
        var riseCls = '';
        if(result.rise > 0)
            riseCls = 't_red';
        else if(result.rise < 0)
            riseCls = 't_green';
        var tag =
            '<a onclick="gotoStockDetail(\''+result.stkCode+'\',\''+result.stkName+'\',\''+result.symbol.replace(result.stkCode)+'\')">'+
                '<li>'+
                    '<h4>'+result.stkName+'<span class="num">'+result.stkCode+'</span></h4>'+
                    '<h6>'+getTimeStr_more(result.time*1000)+'</h6>'+
                '</li>'+
                '<li>'+
                    '<div class="icon"><i class="icon-arrow_closed"></i></div>'+
                    '<div class="'+riseCls+'">'+
                        '<h3>'+result.newPrice.toFixed(2)+'</h3>'+
                        '<h6>'+result.change.toFixed(2)+'    '+result.rise.toFixed(2)+'%</h6>'+
                    '</div>'+
                '</li>'+
            '</a>';
        $('#'+containerId).html(tag);
    });
}

/**
 * 去App个股详情页 或者 问个股综评
 * @param stockCode
 * @param stockName
 * @param marketType
 */
function gotoStockDetail(stockCode, stockName, marketType) {
    var params = {
        pageId: 'hs_market_stock_detail',
        stockCode : stockCode
    };

    if(appKey === 'appEzt' || appKey === 'appTopC')
    {
        // 去App
        if(appFrom === 'android'){
            commonCallback('navigationNative', JSON.stringify(params));
            baiduTrackEvent('android股票详情','click','股票点击');
        }
        else if (appFrom === 'ios') {
            commonCallback('routerNative', JSON.stringify(params));
            baiduTrackEvent('ios股票详情','click','股票点击');
        }
    }else{
        // 走固定问答
        stockFixQuestion(stockCode, stockName, marketType, '个股综评');
    }
}

/**
 * 个股相关固定问题
 * @param stockCode
 * @param stockName
 * @param marketType
 * @param predicateType  谓语分类
 */
function stockFixQuestion(stockCode, stockName, marketType, predicateType) {
    requestFixedAnswer({
        subjectCode: stockCode,
        subjectName: stockName,
        subjectMarket: marketType,
        subjectType: '股票',
        predicateType: predicateType
    }, stockName, marketType, true);
}
function indexFixQuestion(stockCode, stockName, marketType, predicateType) {
    requestFixedAnswer({
        subjectCode: stockCode,
        subjectName: stockName,
        subjectMarket: marketType,
        subjectType: '指数',
        predicateType: predicateType
    }, stockName, marketType, true);
}

/**
 * 打开近期热点页面
 */
function openHotSpotPage() {
    // sendPreAnswerContent(location.protocol + '//' + location.host + '/topchtml/' + '?top=20&bottom=0');
    // location.href = location.protocol + '//' + location.host + '/topchtml/' + '?top=20&bottom=0'
    var url = location.protocol + '//' + location.host + '/topchtml/' + '?top=20&bottom=0&appKey='+appKey+'&platform='+appFrom+'&appVersion='+appVersion;
    console.log(url);
    if (appKey === 'appAvatar') {
        url = url+'&hideBackIcon=1';
    }

    //调用原生打开
    if (appFrom === 'android' || appFrom === 'ios') {
        var params = {
            pageId: 'webView',
            url: url,
            animationStyle: 'kHsPageAnimationFromTop',
            hasActionBar: 'false'
            // title: '近期热点'
        };
        //ios多传一个参数
        if (appFrom === 'ios'){
            params.navigationStyle = 'HsNavigationStatusNone';
            if(appKey === 'appTopC')
                params.NaviBarHidden = 'true';
        }
        commonCallback('routerNative', JSON.stringify(params));
    } else {
        if (appKey === 'appHcVtm') {
            postMessageToOutside({openUrl: url+'&hideBackIcon=1'});
        } else {
            window.open(url, '_black');
        }
    }
}

/**
 * 打开开户页面
 * @param p
 */
function openAccountPage(p)
{
    if (appFrom === 'android' || appFrom === 'ios') {
        var params = {
            pageId: 'crh_open_account'
        };
        //ios多传一个参数
        // if (appFrom === 'ios')
        //     params.navigationStyle = 'HsNavigationStatusModel';
        commonCallback('routerNative', JSON.stringify(params));
    }
}

/**
 * 打开股票质押
 * @param p
 */
function openPledgeOfStock(p) {
    // console.log(p)
    p = JSON.parse(p.replace(/~/g, '"'));
    // location.href = location.protocol + '//' + location.host + '/e-html/' + '?marType='+p.stock.marketType+'&secCode='+p.stock.code
    var url = location.protocol + '//' + location.host + '/e-html/' + '?marType='+p.stock.marketType+'&secCode='+p.stock.code+'&appKey='+appKey+'&platform='+appFrom+'&appVersion='+appVersion;
    console.log(url);
    if(appKey === 'appEzt' || appKey === 'appTopC' || appKey === 'appAvatar')
    {
        if (appKey === 'appAvatar') {
            url += '&hideBackIcon=1';
        }

        if (appFrom === 'android' || appFrom === 'ios') {
            var params = {
                pageId: 'webView',
                url: url,
                animationStyle: 'kHsPageAnimationPush',
                hasActionBar: 'false'
                // title: ''
            };
            //ios多传一个参数
            if (appFrom === 'ios'){
                params.navigationStyle = 'HsNavigationStatusNone';
                if(appKey === 'appTopC')
                    params.NaviBarHidden = 'true';
            }
            commonCallback('routerNative', JSON.stringify(params));
        } else {
            window.open(url, '_black')
        }
    } else {
        if (appKey === 'appHcVtm') {
            postMessageToOutside({openUrl: url+'&hideBackIcon=1'});
        } else {
            window.open(url, '_black');
        }
    }
}

/**
 * 打开行业分析页面
 * @param p
 */
function openIndustryAnalysis(p) {
   //rh_node
    p = JSON.parse(p.replace(/~/g, '"'));
    // location.href = location.protocol + '//' + location.host + '/industryAnalysis/v3/detail_v3.html' + '?trade='+p.name;
    var url = location.protocol + '//' + location.host + '/industryAnalysis/v3/detail_v3.html' + '?trade='+p.name+'&appKey='+appKey+'&platform='+appFrom+'&appVersion='+appVersion;
    console.log(url);
    if(appKey === 'appEzt' || appKey === 'appTopC' || appKey === 'appAvatar')
    {
        if (appKey === 'appAvatar') {
            url += '&hideBackIcon=1';
        }

        if (appFrom === 'android' || appFrom === 'ios') {
            var params = {
                pageId: 'webView',
                url: url,
                animationStyle: 'kHsPageAnimationPush',
                hasActionBar: 'false'
                // title: ''
            };
            //ios多传一个参数
            if (appFrom === 'ios'){
                params.navigationStyle = 'HsNavigationStatusNone';
                if(appKey === 'appTopC')
                    params.NaviBarHidden = 'true';
            }
            commonCallback('routerNative', JSON.stringify(params));
        } else {
            window.open(url, '_black');
        }
    } else {
        if (appKey === 'appHcVtm') {
            postMessageToOutside({openUrl: url+'&hideBackIcon=1'});
        } else {
            window.open(url, '_black');
        }
    }
}

/**
 * 打开热点概念页面
 * @param p
 */
function openHotConcept(p){
    p = typeof p === 'object' ? p : JSON.parse(p.replace(/~/g, '"'));
    // location.href = location.protocol + '//' + location.host + '/conceptAnalysis/focus/focus-detail/' + '?hotName='+p.name+'&code=S4801'
    var url = location.protocol + '//' + location.host + '/conceptAnalysis/focus/focus-detail/' + '?hotName='+p.name+'&code=S4801'+'&appKey='+appKey+'&platform='+appFrom+'&appVersion='+appVersion;
    console.log(url);
    if(appKey === 'appEzt' || appKey === 'appTopC' || appKey === 'appAvatar')
    {
        if (appKey === 'appAvatar') {
            url = url+'&hideBackIcon=1';
        }

        if (appFrom === 'android' || appFrom === 'ios') {
            // 用来兼容Ios的旧版本
            var pageId = 'rh_node';
            var extraParams = '';
            if(appFrom === 'ios' && appKey === 'appEzt' && !checkVersion('1.9.24',appVersion)){
                pageId = 'webView';
                extraParams = '&isIosOld=true';
            }

            var params = {
                pageId: pageId,
                url: url+extraParams,
                animationStyle: 'kHsPageAnimationPush',
                hasActionBar: 'false'
                // title: ''
            };
            //ios多传一个参数
            if (appFrom === 'ios'){
                params.navigationStyle = 'HsNavigationStatusNone';
                if(appKey === 'appTopC')
                    params.NaviBarHidden = 'true';
            }
            commonCallback('routerNative', JSON.stringify(params));
        } else {
            window.open(url, '_black');
        }
    } else {
        if (appKey === 'appHcVtm') {
            postMessageToOutside({openUrl: url+'&hideBackIcon=1'});
        } else {
            window.open(url, '_black');
        }
    }
}

/**
 * 打开近期热点
 * @param p
 */
function openRecentSpot(p) {
    // p = JSON.parse(p.replace(/~/g, '"'));
    // location.href = location.protocol + '//' + location.host + '/e-html/list' + '?hotName=1111&code=S4801'
    // var url = location.protocol + '//' + location.host + '/e-html/list' + '?appKey='+appKey+'&platform='+appFrom+'&appVersion='+appVersion;
    // 2019.05.23 地址变更 正伦
    var url = location.protocol + '//' + location.host + '/conceptAnalysis/focus/focus-sorting/' + '?appKey='+appKey+'&platform='+appFrom+'&appVersion='+appVersion;
    console.log(url);
    if(appKey === 'appEzt' || appKey === 'appTopC' || appKey === 'appAvatar')
    {
        if (appKey === 'appAvatar') {
            url = url+'&hideBackIcon=1';
        }

        if (appFrom === 'android' || appFrom === 'ios') {
            // 用来兼容Ios的旧版本
            var pageId = 'rh_node';
            var extraParams = '';
            if(appFrom === 'ios' && appKey === 'appEzt' && !checkVersion('1.9.24',appVersion)){
                pageId = 'webView';
                extraParams = '&isIosOld=true';
            }

            var params = {
                pageId: pageId,
                url: url+extraParams,
                animationStyle: 'kHsPageAnimationPush',
                hasActionBar: 'false'
                // title: ''
            };
            //ios多传一个参数
            if (appFrom === 'ios'){
                params.navigationStyle = 'HsNavigationStatusNone';
                if(appKey === 'appTopC')
                    params.NaviBarHidden = 'true';
            }
            commonCallback('routerNative', JSON.stringify(params));
        } else {
            window.open(url, '_black');
        }
    } else {
        if (appKey === 'appHcVtm') {
            postMessageToOutside({openUrl: url+'&hideBackIcon=1'});
        } else {
            window.open(url, '_black');
        }
    }
}

/**
 * 打开招股说明书
 * @param p
 */
function openProspectus(p) {
    p = JSON.parse(p.replace(/~/g, '"'));
    console.log(p);
    var type;
    var right;

    if(p){
        type = p.type.split("|")[1];
        right = p.type.split("|")[0];
    }
    var url='';
    if(right&&right!=='--'){
        url = location.protocol + '//' + location.host + '/cproject/prospectus/?type=' + type + "&right=" + right
    }else{
        url = location.protocol + '//' + location.host + '/cproject/'
    }
    // location.href = location.protocol + '//' + location.host + '/e-html/' + '?marType='+p.stock.marketType+'&secCode='+p.stock.code
    // var url = location.protocol + '//' + location.host + '/cproject/?type=' + type + "&right=" + right;
    console.log(url);
    if(appKey === 'appEzt' || appKey === 'appTopC' || appKey === 'appAvatar')
    {
        if (appKey === 'appAvatar') {
            url += (url.indexOf('?')!==-1?'&':'?')+'hideBackIcon=1';
        }

        if (appFrom === 'android' || appFrom === 'ios') {
            var params = {
                pageId: 'webView',
                url: url,
                animationStyle: 'kHsPageAnimationPush',
                hasActionBar: 'false'
                // title: ''
            };
            //ios多传一个参数
            if (appFrom === 'ios'){
                params.navigationStyle = 'HsNavigationStatusNone';
                if(appKey === 'appTopC')
                    params.NaviBarHidden = 'true';
            }
            commonCallback('routerNative', JSON.stringify(params));
        } else {
            window.open(url, '_black');
        }
    } else {
        if (appKey === 'appHcVtm') {
            postMessageToOutside({openUrl: url += (url.indexOf('?')!==-1?'&':'?')+'hideBackIcon=1'});
        } else {
            window.open(url, '_black');
        }
    }
}

/**
 * 去科开通创板页面
 */
function openKCBPage() {
    var url = 'https://sjwt.hczq.com/index?toUrl=ztmod/goScienceTecBoard.do';
    if(appKey === 'appEzt')
    {
        var params;
        if (appFrom === 'ios') {
            // 兼容老版本
            if(!checkVersion('2.1.0',appVersion)){
                params = {
                    pageId: 'webView',
                    url: url + '&navbarHide=1',
                    animationStyle: 'kHsPageAnimationPush',
                    title: '科创板',
                    hasActionBar: 'false'
                };
            } else {
                params = {
                    pageId: 'rh_crh',
                    type: '4'
                };
            }
            commonCallback('routerNative', JSON.stringify(params));
        } else if (appFrom === 'android') {
            // 安卓不支持通用方法跳转，正伦
            params = {
                pageId: 'rh_h5',
                url: url,
                animationStyle: 'kHsPageAnimationPush',
                hasActionBar: 'false'
            };
            commonCallback('routerNative', JSON.stringify(params));
            // commonCallback('openCrhSdk', '4');
        }
    }
}

/**
 * 科创板专题
 * @param p
 */
function openKcbTopic(p) {
    p = JSON.parse(p.replace(/~/g, '"'));
    var url = p.url || '';
    if(appKey === 'appEzt' || appKey === 'appTopC' || appKey === 'appAvatar')
    {
        if (appFrom === 'android' || appFrom === 'ios') {
            var params = {
                pageId: 'webView',
                url: url,
                animationStyle: 'kHsPageAnimationPush',
                hasActionBar: 'yes',
                title: '科创板专题'
            };
            //ios多传一个参数
            if (appFrom === 'ios'){
                params.navigationStyle = 'HsNavigationStatusModel';
                // if(appKey === 'appTopC')
                //     params.NaviBarHidden = 'true';
            }
            commonCallback('routerNative', JSON.stringify(params));
        } else {
            window.open(url, '_black');
        }
    } else {
        if (appKey === 'appHcVtm') {
            postMessageToOutside({openUrl: url});
        } else {
            window.open(url, '_black');
        }
    }
}

/**
 * 打开条件选股页面
 */
function openStockConditionPage(conditions) {
    conditions = (conditions === '1' ? '' : conditions);
    var url = location.protocol + '//' + location.host + '/conditions/pickConditions'+(conditions ? '?paramsFromRobot='+conditions : '');
    //调用原生打开
    if(appKey === 'appEzt' || appKey === 'appTopC' || appKey === 'appAvatar')
    {
        if (appKey === 'appAvatar') {
            url += (url.indexOf('?')!==-1?'&':'?')+'hideBackIcon=1';
        }

        if (appFrom === 'android' || appFrom === 'ios') {
            var params = {
                pageId: 'webView',
                url: url,
                animationStyle: 'kHsPageAnimationFromTop',
                hasActionBar: 'yes',
                title: '条件选股'
            };
            //ios多传一个参数
            if (appFrom === 'ios')
                params.navigationStyle = 'HsNavigationStatusModel';
            commonCallback('routerNative', JSON.stringify(params));
        } else {
            window.open(url, '_black');
        }
    } else {
        if (appKey === 'appHcVtm') {
            postMessageToOutside({openUrl: (url.indexOf('?')!==-1?'&':'?')+'hideBackIcon=1'});
        } else {
            window.open(url, '_black');
        }
    }
}

/**
 * 关闭弹窗
 * @param conId 弹窗div id
 */
function closePopupById(conId) {
    $('#'+conId).addClass("hide").removeClass("show").hide()
}

/**
 * 将问过的问题缓存到本地
 * @param question
 * @param result
 */
function saveHistoryQuestion(question, result) {
    var cookieContent = {
        txt: question,
        json: result,
        time: new Date().getTime()
    };
    //将问题存入localStorage中
    cookieArray.push(cookieContent);
    if (cookieArray.length > 5) {
        cookieArray.shift();
    }
    localStorage.cookieArray = JSON.stringify(cookieArray);
}

/**
 * 将参数传递给web版
 * @param params
 */
function postMessageToOutside(params) {
    try {
        window.parent.callFromRobot(params)
    } catch (e) {
        console.log(e)
    }
}

/**
 * @description: 原生调用，语音指令 打开详情
 * @param type: 0:关闭弹窗 1:打开首条 2:打开提纲
 */
window.openInfo = function(type){
    var speechAnwser = '';
    if(type == 0){ // 关闭弹窗
        $('.pop_BottomToTopPolicy_gt').last().find('.close').last().click();
        setTimeout(function(){
            $('.pop_BottomToTopPolicy_gt').last().find('.outlineTxt').removeClass('outlineTxtUl_show');
            $('.pop_BottomToTopPolicy_gt').last().find('.outlineTxt').find('ul').html('');
        },1000 )
    }
    else if(type == 1){ // 打开首条
        if($('.mb').last().find('li').eq(0).find('a').length!==0){
            $('.mb').last().find('li').eq(0).find('a').click();
        }else{
            $('.mb').last().find('li').eq(0).click();
        }
        speechAnwser = '好的，第一条信息已为您显示在屏幕上了';
        try {
            window.contestapp.speakAnswer(speechAnwser,3,'');
        } catch (error) {
            console.log(speechAnwser)
        }
    }
    else if(type == 2){ // 总结要点
        $('.pop_BottomToTopPolicy_gt').last().find('.outlineTxt').addClass('outlineTxtUl_show');
        if(window.miniE_isOpenData){
            speechAnwser = '好的，这篇文章的要点已经总结出来了，希望能满足您的需求。';
            try {
                window.contestapp.speakAnswer(speechAnwser,4,'');
            } catch (error) {
                console.log(speechAnwser)
            }
        }else{
            speechAnwser = '抱歉，本篇文章暂无要点';
            try {
                window.contestapp.speakAnswer(speechAnwser,0,'');
            } catch (error) {
                console.log(speechAnwser)
            }
        }
    }
}

//问你好添加banner
window.addBanner=function(){
    helpClick();
}

