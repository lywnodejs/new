/**
 * Created by BoBo on 2017-03-16.
 */

/**
 * 新版取首页轮播卡片
 */
function getNewPresetQuestion(success) {
    $.ajax({
        type: "get",
        url: HttpUrl + "/semantic-api-service/robot/recommend/question",
        data: {
            robotId: robotId,
            preview: params.preview,
            organization: appKey
        },
        dataType: "jsonp",
        timeout: 15000,
        jsonp: "callback",
        success: success
    });
}

/**
 * 取首页显示的问题
 * @param isShow
 * E智通首次进入小E时，有个性化信息推荐，则展示个性化定制(静静)，否则展示 首页热门问题 推荐（杨超）
 */
function getPresetQuestion(isShow) {
    if(showIndexCarousel && appKey === 'appEzt'){
        //console.log("E智通进入小E");
        getPersonalizedCustomizationQuestion(function (result) {
            setPersonalizedCustomizationQuestion(result,isShow);
        });
    }
}

/**
 *  首页 个性化信息
 *  用户画像3期   产品经理  静静
 *  @param success
 *  @param deviceId 设备id 无填NONE
 *  @param ps   展示5条  默认3
 *  @param cp   页码   默认1
 */
function getPersonalizedCustomizationQuestion(success, error) {
    $.ajax({
        type: "get",
        //url: "http://semantic-api-service:31001/recommendation/questions",
        url: HttpUrl + "/riskNotices/recommendation/questions",
        data: {
            deviceId: userId,
            fundAccount:fundAccount,
            cp: 1,
            ps: 5
        },
        dataType: "jsonp",
        // timeout: 15000,
        jsonp: "callback",
        success: success
    });
}

/**
 * 智能回答
 * @param sendTxt 发送给后端的问题
 * @param showTxt 显示的问题
 * @param voiceQuestion 是否为语音问题
 * @param questionId 个性化首页推荐需要参数  问句的id
 * @param userQuestionId  个性化首页推荐需要参数  用户问句关系的id
 * @param source  来源（便于百度统计）
 */
function freeQuestion(sendTxt, showTxt, voiceQuestion, isPopup,questionId,userQuestionId,source) {
    if (!isPopup) {
        var divId = sendQuestion(showTxt ? showTxt : sendTxt, null, undefined, voiceQuestion);
    }

    var queryTime = new Date().getTime();

    var param = {
        question: sendTxt,
        userId: userId,
        clientId: clientId,
        inputType: voiceQuestion ? '1' : '0',
        organization: appKey,
        appKey: appKey,
        questionId:questionId,
        userQuestionId:userQuestionId,
        fundAccount:fundAccount,
        appFrom: appFrom,
        appVersion: appVersion,
        noSource: true,
        recordLog: recordLog,
        source: source,
        isPopup: isPopup,
        from: 'xiaoe',
        robotId: robotId,
        preview: params.preview,
        mode: 'dependent' // 标识：请求的答案模板是独立使用(independent)，或是依赖使用(dependent)，即在壳内还是壳外使用
    };

    var url = '/api/freeQuestion';
    $.ajax({
        type: "get",
        url: url,
        data: param,
        // dataType: "jsonp",
        timeout: 30000,
        jsonp: "callback",
        success: function (json) {
            // console.log(json);
            if (json.hasOwnProperty('answerResultType') && json.type !== 'report') {
                if (isPopup) {
                    setAnswer(json, isPopup,'',source);
                } else {
                    json.qId = divId;
                    setAnswer(json,'','',source);
                    if (ifRecordQuestion) {
                        saveHistoryQuestion(sendTxt, json)
                    }
                }
            } else {
                if (isPopup) {
                    setNodeAnswer(json, isPopup,'',source)
                } else {
                    setNodeAnswer(json,'','',source, divId);
                }
            }
        },
        complete: function (XMLHttpRequest) {
            if (divId) {
                // console.log("#"+divId+" .showLoading")
                $("#"+divId+" .showLoading").hide();
            } else {
                $(".showLoading").hide();
            }

            handleException(XMLHttpRequest, divId);
            param.responseTime = new Date().getTime()-queryTime + 'ms';
            saveLog('info', sendTxt, 'api/qa', 0, 0, param);

            if (appKey === 'appHtyw') {
              lastQuestionTime = queryTime;
              startInterval();
            }
        }
    });
}

/**
 * 固定回答
 * @param params
 * @param outputTxt
 * @param market
 * @param useOldUrl 是否使用旧的请求接口
 * @param source 来源  百度统计
 */
function requestFixedAnswer(params, outputTxt, market, useOldUrl, source, isPopup) {
    // params = typeof(params) == 'string' ? JSON.parse(params) : params;
    if (outputTxt) {
        var divId = sendQuestion(outputTxt);
    }

    var queryTime = new Date().getTime();

    if (market) {
        market1 = market;
    } else {
        if (params.subjectMarket != "" || params.subjectMarket != null) {
            market1 = params.subjectMarket;
        }
    }

    var url = HttpUrl + "/semantic-api-service/api/qa/fixJson";
    if (useOldUrl)
        url = HttpUrl + "/semantic-api-service/api/qa/fix";

    params.userId = userId;
    params.clientId = clientId;
    params.organization = appKey;
    params.fundAccount = fundAccount;
    params.recordLog = recordLog;
    $.ajax({
        type: "get",
        url: url,
        data: params,
        dataType: "jsonp",
        timeout: 30000,
        jsonp: "callback",
        success: function (json) {
            console.log(json);
            // $(".showLoading").hide();
            json.qId = divId;
            setAnswer(json, isPopup,"",source);
            if (ifRecordQuestion) {
                //将问题存入localStorage中
                var question = outputTxt;
                if (!question) {
                    question = params.subjectName;
                }
                saveHistoryQuestion(question, json)
            }
        },
        complete: function (XMLHttpRequest) {
            if (divId) {
                // console.log("#"+divId+" .showLoading")
                $("#"+divId+" .showLoading").hide();
            } else {
                $(".showLoading").hide();
            }
            $(".spinnerCircle").hide();

            handleException(XMLHttpRequest, divId);

            params.responseTime = new Date().getTime()-queryTime + 'ms';
            saveLog('info', outputTxt, url, 0, 0, params);
        }
    });
}

/**
 * 查询用户历史消息
 * @param params
 * @param success
 */
function getHistory(params, success) {
    $.ajax({
        type: "get",
        url: HttpUrl + "/semantic-api-service/api/history",
        data: params,
        dataType: "jsonp",
        jsonp: "callback",
        success: success
    });
}

/**
 * 取股票报价
 * @param symbol
 * @param success
 * @param error
 */
function getPrice(symbol, success, error) {
    $.ajax({
        type: "get",
        url: "/hangqing-service/json/getPrice",
        data: {
            symbol: symbol,
            userId: userId,
            clientId: clientId
        },
        dataType: "jsonp",
        jsonp: "callback",
        success: success
    });
}

/**
 * 取股票报价列表品
 */
function getPriceList(symbol, success, errorHandler) {
    var URL = "http://quota.zq88.cn/json/getMultiPrice";
    if (location.protocol.indexOf('https') === 0) {
        URL = "https://quota.rxhui.com/goto_quota_zq88_cn/json/getMultiPrice";
    }
    $.ajax({
        type: "get",
        url: URL,
        data: {
            symbol: symbol
        },
        dataType: "jsonp",
        jsonp: "callback",
        success: success
    });
}

/**
 * 发送反馈内容
 * @param msg
 * @param success
 * @param error
 */
function sendFeedback(msg, success, error) {
    var URL = '/robot/hchome' + "/user/suggestion.do";
    if (location.protocol.indexOf('https') === 0) {
        URL = "https://www.hczq.com/goto_quota_zq88_cn/user/suggestion.do";
    }
    $.ajax({
        type: "get",
        url: URL,
        data: {
            userId: -1,
            clientId: clientId,
            projectType: 10,
            activityType: 3,
            content: msg
        },
        dataType: "json",
        jsonp: "callback",
        success: success
    });
}

/**
 * 评价答案
 * @param spanId
 * @param rate
 * @param success
 * @param error
 */
function rateAnswer(spanId, rate, success, error) {
    $.ajax({
        type: "get",
        url: HttpUrl + "/semantic-api-service/api/feedback/score",
        data: {
            spanId: spanId,
            commentFeedback: rate,
            userId: userId,
            clientId: clientId
        },
        dataType: "jsonp",
        jsonp: "callback",
        success: success
    });
}

/**
 *  记录去人工服务的问题
 * @param spanId
 * @param txt
 * @param success
 */
function manualQuestion(spanId, txt, success) {
    $.ajax({
        type: "POST",
        url: HttpUrl + "/semantic-api-service/save/manualQuestion",
        data: {
            spanId: spanId,
            question: txt,
            userId: userId,
            clientId: clientId
        },
        success: success
    });
}

/**
 * 请求异常提示
 * @param xhr
 */
function handleException(xhr, divId) {
    // console.log(error)
    var errorTxt = '';
    if(xhr.status >= 400 || xhr.statusText === 'timeout'){
        errorTxt = appKey === 'appHtyw' ? 'Something wrong with the server, please try again later' : '网络出问题了，请稍后再试';
        sendPreAnswerContent(errorTxt, '', '', divId);
    }
}

/**
 * 固定回答获取个股解析
 */
function expoitFixedAnswer(subjectCode, subjectName, subjectMarket, subjectRawValue, predicateType, attribute, success, errorHandler) {
    url = HttpUrl + "/semantic-api-service/api/qa/fix";
    $.ajax({
        type: "get",
        url: url,
        data: {
            subjectCode: subjectCode,
            subjectName: subjectName,
            subjectMarket: subjectMarket,
            subjectRawValue: subjectRawValue,
            predicateType: predicateType,
            attribute: attribute,
            attributeType: '时间',
            userId: userId,
            clientId: clientId,
            organization: appKey,
            fundAccount:fundAccount
        },
        // timeout: 10000,
        success: success,
        error: errorHandler
    })
}

/**
 * 固定回答获取个股解析
 */
function expoitFixedAnswerForShare(subjectCode, subjectName, subjectMarket, subjectRawValue, predicateType, success, errorHandler) {
    url = HttpUrl + "/semantic-api-service/api/qa/fix";
    $.ajax({
        type: "get",
        url: url,
        data: {
            subjectCode: subjectCode,
            subjectName: subjectName,
            subjectMarket: subjectMarket,
            subjectRawValue: subjectRawValue,
            predicateType: '行业个股推荐理由',
            userId: userId,
            clientId: clientId,
            organization: appKey,
            fundAccount:fundAccount
        },
        // timeout: 10000,
        success: success,
        error: errorHandler
    })
}

/**
 * 固定回答获取行业解析
 */
function industryFixedAnswer(subjectCode, subjectName, subjectMarket, subjectRawValue, predicateType, success) {
    url = HttpUrl + "/semantic-api-service/api/qa/fix";
    $.ajax({
        type: "get",
        url: url,
        data: {
            subjectCode: subjectCode,
            subjectName: subjectName,
            subjectMarket: subjectMarket,
            subjectRawValue: subjectRawValue,
            predicateType: predicateType,
            userId: userId,
            clientId: clientId,
            organization: appKey,
            fundAccount:fundAccount
        },
        // timeout: 10000,
        success: success
    })
}

/**
 * 行业推荐理由
 */
function industryRecommendationReasons(subjectRawValue, attribute, success, errorHandler) {
    url = HttpUrl + "/semantic-api-service/api/qa/fix";
    $.ajax({
        type: "get",
        url: url,
        data: {
            subjectRawValue: subjectRawValue,
            predicateType: '行业推荐理由',
            attribute: attribute,
            attributeType: '时间',
            userId: userId,
            clientId: clientId,
            organization: appKey,
            fundAccount:fundAccount
        },
        // timeout: 10000,
        success: success,
        error: errorHandler
    })
}

/**
 * 所有的回答
 */
function prependAskDialog(question, value) {
    var divId = sendQuestion(question);
    var param = {
        predicateType: '基础知识',
        question: question,
        userId: userId,
        clientId: clientId,
        organization: appKey,
        fundAccount:fundAccount,
        robotId: robotId,
        preview: params.preview
    };
    var url = HttpUrl + "/semantic-api-service/api/qa/fix";
    $.ajax({
        type: "get",
        url: url,
        data: param,
        dataType: "jsonp",
        // timeout: 10000,
        jsonp: "callback",
        success: function (json) {
            console.log(json);
            json.qId = divId;
            setAnswer(json);
            if (ifRecordQuestion) {
                //将问题存入localStorage中
                saveHistoryQuestion(question, json)
            }
        },
        complete: function (XMLHttpRequest) {
            $(".showLoading").hide();
            handleException(XMLHttpRequest, divId);

            if (appKey === 'appHtyw') {
                lastQuestionTime = new Date().getTime();
                startInterval();
            }
        }
    })
}

function riskPushingRequest(userId,messageId,interfaceApi,success){
    var interfaceT = interfaceApi ? interfaceApi : 'message';
    var params = {
        userId:userId,
        clientId: clientId
    };
    var url = '';
    if(interfaceT === 'history'){
        params.messageId = messageId;
        url = HttpUrl + "/semantic-api-service/api/history";
    }else{
        params.messageIds = messageId;
        url =  HttpUrl + "/riskNotices/api/"+interfaceApi;
    }
    $.ajax({
        type: "get",
        url: url,
        data: params,
        // timeout: 10000,
        success: success
    })
}

/**
 * push和历史推送
 */
function appPushAndHistory(userId, messageId, pushType) {
    var url = "";
    var params = {};
    var pushTypeRe = '';
    switch (pushType) {
        case "晨间消息":
        case "行业推荐":
        case "中长期股票推荐":
        case "短期股票推荐":
        case "stockMessageIds":
        case "shortStockRecommendMessageId":
        case "longStockRecommendMessageId":
        case "industryRecommendMessageId":
            switch (pushType) {
                case "stockMessageIds":
                    pushTypeRe = '晨间消息';
                    break;
                case "shortStockRecommendMessageId":
                    pushTypeRe = '短期股票推荐';
                    break;
                case "longStockRecommendMessageId":
                    pushTypeRe = '中长期股票推荐';
                    break;
                case "industryRecommendMessageId":
                    pushTypeRe = '行业推荐';
                    break;
            }
            url = HttpUrl + "/semantic-api-service/api/message";
            params = {
                userId: userId,
                clientId: clientId,
                messageIds: messageId
            };
            $.ajax({
                type: "get",
                url: url,
                data: params,
                // dataType: "jsonp",
                // timeout: 10000,
                // jsonp: "callback",
                success: function (json) {
                    console.log(json);
                    // $(".showLoading").hide();
                    setAnswerForHistoryForMorning(json.data, pushTypeRe);
                    if (ifRecordQuestion) {
                        //将问题存入localStorage中
                        saveHistoryQuestion(pushType, json)
                    }
                },
                complete: function (XMLHttpRequest) {
                    $(".showLoading").hide();
                    handleException(XMLHttpRequest);
                }
            });
            break;
        case "股价变更":
            url = HttpUrl + "/semantic-api-service/api/history";
            params = {
                userId: userId,
                clientId: clientId,
                messageId: messageId
            };
            $.ajax({
                type: "get",
                url: url,
                data: params,
                dataType: "jsonp",
                // timeout: 10000,
                jsonp: "callback",
                success: function (json) {
                    console.log(json);
                    // $(".showLoading").hide();
                    if (json.data.list.length > 0) {
                        setAnswerForHistory(json.data.list[0]);
                        if (ifRecordQuestion) {
                            //将问题存入localStorage中
                            saveHistoryQuestion(pushType, json)
                        }
                    }
                },
                complete: function (XMLHttpRequest) {
                    $(".showLoading").hide();
                    handleException(XMLHttpRequest);
                }
            });
            break;
    }
}

/**
 * 底部弹窗问题
 * @param params
 * @param source 来源  百度统计
 */
function popupQuestion(params,source) {
    $.ajax({
        type: "get",
        url: HttpUrl + "/semantic-api-service/api/qa/stock/"+params.marketType+'/'+params.stockCode,
        data: params,
        timeout: 20000,
        success: function (json) {
            // console.log(json);
            setAnswer(json, true,"", source);
        },
        complete: function (XMLHttpRequest) {
            $(".showLoading").hide();
            $(".spinnerCircle").hide();
        }
    });
}

/**
 * 底部弹窗问题
 * @param params
 * @param source 来源  百度统计
 */
function popupQuestion2(params,source) {
    params.useMode = true;
    params.appKey = "appEzt";
    params.ispop = true;
    $.ajax({
        type: "get",
        // url: 'http://192.168.111.63:31001' + "/semantic-api-service/api/qa/stock/"+params.marketType+'/'+params.stockCode,
        url: "/api/qa/stock",
        data: params,
        // timeout: 10000,
        success: function (json) {
            // console.log(json);
            // $(".showLoading").hide();
            //setAnswer(json, true,"","zongping");
            setNodeAnswer(json, true,"",source);
            $(".showLoading").hide();
        },
        complete: function (XMLHttpRequest) {
            $(".showLoading").hide();
            $(".spinnerCircle").hide();
        }
    });
}

// 去掉已读的历史
function deleteHistory(messageId) {
    $.ajax({
        type: "POST",
        url: HttpUrl + "/semantic-api-service/api/history",
        data: {
            userId: userId,
            clientId: clientId,
            messageIds: messageId
        }
    });
}


/**
 * 资讯和研报详情弹层
 * @param params
 */
function popupQuestionForInfoAndRe(id, preAnswerContent) {
    var url = "";
    var params = {
        id: id
    };

    if (preAnswerContent === "资讯") {
        url = '/info/zq88/cn/news/detail.do';
    } else if (preAnswerContent === "研报") {
        url = '/info/zq88/cn/report/detail.do';
    }else if(preAnswerContent === "资讯搜索"){
        url = "/bigSearch/detail"
    } else if (preAnswerContent === "科创板资讯") {
        // 数据来源：华创官网投教知识栏目
        params.productId = 'CP170317001';
        params.client = 'web';
        url = '/eduDomain/edu/listUrl/article/'+id;
    }

    $.ajax({
        type: "get",
        url: url,
        data: params,
        timeout: 15000,
        success: function (json) {
            // if(preAnswerContent !== "资讯搜索"){
            //     json = JSON.parse(json);
            // } else {
                json = $.isPlainObject(json) ? json : JSON.parse(json);
            // }
            commonInfoDetail(json, preAnswerContent);
        },
        complete: function (XMLHttpRequest) {
            $(".showLoading").hide();
            $('.spinnerCircle').hide()
        }
    });
}

/**
 * 个性化首页资讯详情弹层
 * @param id  数据源
 * @param type  个性化首页资讯  传参 homePage;  其他来源传参 空
 */
function popupQuestionForHomepage(id, indexId) {
    var url = HttpUrl + '/riskNotices/api/qa/fix';
    var data= {
        predicateType:'资讯详情',
        question:id,
        userId:userId,
        clientId: clientId,
        fundAccount:fundAccount,
        userQuestionId:indexId,
        organization:'appEzt'
    };
    $.ajax({
        type: "get",
        url: url,
        data: data,
        dataType: "jsonp",
        // timeout: 15000,
        jsonp: "callback",
        success: function (result) {
            commonInfoDetail(result,"homePage");
            // $(".showLoading").hide();
        },
        complete: function (XMLHttpRequest) {
            $('.spinnerCircle').hide()
        }
    });
}

/**
 * 底部弹窗问题
 * @param params
 */
function getMoreRiskNotices(params,success) {
    $.ajax({
        type: "get",
        url: HttpUrl + "/riskNotices/companyRisk/riskNotices",
        data: params,
        dataType: "jsonp",
        // timeout: 10000,
        jsonp: "callback",
        success: success
    });
}

// 获取新股列表
function getListStocks(cp,ps,success) {
    $.ajax({
        type: "get",
        url: '/robot/javaApi' + "/e/getListStocks",
        data: {
            cp:cp,
            ps:ps
        },
        // timeout: 10000,
        success: success
    });
}
/**
 * 底部导航默认接口
 * @param params
 */
function getDefaultTabsInterface(params,success) {
    params = params || {};
    params.organization = appKey
    $.ajax({
        type: "get",
        url: HttpUrl + "/tabs/tab/default",
        data: params,
        // timeout: 10000,
        success: success
    });
}


/**
 *  首页 个性化定制 换一换
 *  @param type 问题类型：0->诊股、1->选股、2->业务办理、3->指令、4->百科问答
 *  @param ps   展示5条
 *  @param cp   页码
 *  @param organization 来源：appEzt(e智通)，appZscf(紫薯财富)
 *
 */
function getPersonalizedCustomizationRef(obj) {
    var thisObj=$(obj);//js对象转jquery对象
    $.ajax({
        type: "get",
        //url: "http://semantic-api-service:31001/recommendation/questions",
        url: HttpUrl + "/riskNotices/recommendation/questions",
        data: {
            deviceId: userId,
            clientId: clientId,
            cp: personalizedCustomizationCP,
            fundAccount:fundAccount,
            ps: 5
        },
        dataType: "jsonp",
        // timeout: 15000,
        jsonp: "callback",
        success: function (result) {
            if(result.message.code != 0){
                return;
            }
            if(result.data.hasNextPage){
                personalizedCustomizationCP = result.data.currentPage + 1;
            }else{
                personalizedCustomizationCP = 1;
            }
            var list = result.data.userQuestions;
            var temp ='';

            for(var j = 0;j<list.length;j++){
                if(list[j].question){
                    if(list[j].dimension == '资讯'){
                        temp += "<li onclick=\"showInformationDetail('" + list[j].dimensionUniqueKey + "','" + list[j].dimension + "','homePage','" + list[j].indexId + "')\">" + list[j].question + '</li>';
                    }else{
                        /*var from = 'homePage';
                        //参数 依次为  sendTxt, showTxt, voiceQuestion, isPopup,questionId,userQuestionId
                        //emp +='<li onclick="freeQuestion(\'' + list[j].question + '\',\'\',\'\',\'\',\'' + list[j].questionsId + '\',\'' + list[j].indexId + '\')">'+list[j].question+'</li>';
                        temp += '<li onclick="freeQuestion(\'' + list[j].question + '\',\'\',\'\',\'\',\'' + list[j].questionsId + '\',\'' + list[j].indexId + '\',\'' + from + '\')">' + list[j].question + '</li>';
*/
                        var from = '来源：个性化首页';
                        //参数 依次为  sendTxt, showTxt, voiceQuestion, isPopup,questionId,userQuestionId
                        temp += '<li onclick="freeQuestion(\'' + list[j].question + '\',\'\',\'\',\'\',\'' + list[j].questionsId + '\',\'' + list[j].indexId + '\',\'' + from + '\')">' + list[j].question + '</li>';
                        // temp += '<li onclick="freeQuestion(\'' + res[i].question + '\',\'\',\'\',\'\',\'' + res[i].questionsId + '\',\'' + res[i].indexId + '\',\'' + from + '\')">' + res[i].question + '</li>';

                    }
                }
            }
            thisObj.siblings('.personalizedCustomization').html(temp);
        }
    });
}
function getTabsInterface(params,success) {
    params = params || {};
    params.organization = appKey
    $.ajax({
        type: "get",
        url: HttpUrl + "/tabs/tab",
        data: params,
        // timeout: 10000,
        success: success
    });
}

function getOrgRating(params, success, divId) {
    $.ajax({
        type: "get",
        url: HttpUrl + "/riskNotices/api/rating",
        data: params,
        dataType: "jsonp",
        // timeout: 10000,
        jsonp: "callback",
        success: function(json){
            success(json, divId)
        }
    });
}

/**
 * 获取股票价格和涨跌幅
 */
function getStockPrice(symbol, success, boxClass){
    $.ajax({
        type: "get",
        url: "/hangqing-service/json/getPrice",
        data: {
            symbol: symbol,
            userId: userId,
            clientId: clientId
        },
        dataType: "jsonp",
        jsonp: "callback",
        success: function(json){
            success(json, boxClass)
        }
    });
}


/**
 *  综评优化三期
 *  固定回答  最新资讯
 *  杨超
 *  @param subjectCode
 *  @param subjectName
 *  @param subjectMarket
 *  @param mathRandom 随机数
 *  @param showNum 数据显示条数
 *  @param showNum showTxt
 */
function getNewsAndReport(subjectCode,subjectName,subjectMarket,mathRandom,showNum,source,showTxt) {
  if(showNum == 5){
    var divId = sendQuestion(showTxt, null, undefined, false);
    baiduTrackPageview('/'+appKey+'/module/问答/'+ showTxt + '/' + source);
  }

  $.ajax({
    type: "get",
    url: HttpUrl + "/semantic-api-service/api/qa/fix",
    data: {
      subjectCode: subjectCode,
      subjectName: subjectName,
      subjectType: '股票',
      subjectMarket: subjectMarket,
      predicateType: '资讯',
      fundAccount: fundAccount,
      userId: userId,
        clientId: clientId,
      organization: appKey
    },
    // timeout: 10000,
    success: function (json) {
      // if(showNum == 3){
      //   infoAndResearch_v3(json,mathRandom,source);
      // }
      if(showNum == 5){
          if (appKey === 'appAvatar') {
              playVoiceAnswer(json.answerResultType, json);
          }

          json.qId = divId;
        infoAndResearch(json, false);
      }
    }
  });
}

/**
 * 取个股相关资讯
 * @param symbol
 * @param mathRandom
 * @param source
 * @param property
 */
function getNews(market, stockCode,mathRandom,source,property,type) {
    var prefix = '/info/zq88/cn/';
  $.ajax({
    type: "get",
    url: prefix + "/news/advancedSearch.do",
    data: {
      page: 1,
      size: 5,
      type: 'stock',
      symbol: market+"a_"+stockCode,
        isFacet: false
    },
    // timeout: 10000,
    dataType: 'json',
    success: function (json) {
        // console.log(json)
        infoAndResearch_v3(json,mathRandom,source,property,type);
    }
  });
}

/**
 * 取个股相关资讯新接口（红军）
 * @author 赵波 2019.12.20
 * @param market
 * @param mathRandom
 * @param source
 * @param property
 */
function getNewsOfStock(market, stockCode,mathRandom,source,property,type) {
  $.ajax({
    type: "get",
    url: HttpUrl + "/semantic-api-service/bigSearch",
    data: {
        dataTypes: 'NEWS,GREAT_WISDOM_DATA',
        title2stocks: stockCode,
        cp: 1,
        ps: 5
    },
    timeout: 20000,
    dataType: 'json',
    success: function (json) {
        // console.log(json)
        infoAndResearch_v3(json,mathRandom,source,property,type);
    }
  });
}

/**
 * 取个股相关公告
 * @param market
 * @param stockcode
 * @param mathRandom
 * @param source
 * @param property
 * @param type
 */
function getNotice(market,stockcode,mathRandom,source,property,type) {
    var prefix = '/robot/dataCenter' + '/announce';
    $.ajax({
        type: "get",
        url: prefix + "/company/notice/"+market+"/"+stockcode,
        data: {
            cp: 1,
            ps: 5
        },
        // timeout: 10000,
        success: function (json) {
            stockNotice(json,mathRandom,source,property,type);
        }
    });
}

/*
 * ajax封装
 */
var newAjax = {
    //ajax封装：增加时间戳t，loaing相关处理
    get: function (o) {
        var success = o.success;
        o.success = function (rs) {
            success(rs);
        };
        $.ajax($.extend(true, {
            method: 'get',
            data: $.extend({
                _: Date.now()
            }, o.param),
            complete: function () {

            }
        }, o));
    },
    post: function (o) {
        o.method = 'post';
        ajax.get(o);
    },
    jsonp: function (o) {
        o.dataType = 'jsonp';
        o.jsonp = 'jsoncallback';
        ajax.get(o);
    }
};

//分类项汇总
function financialAnalysisPartInfo(param, success) {
    var params = {
        // url: HttpUrl + '/financeAnalysis/partInfos',
        url: HttpUrl + '/semantic-api-service/financeAnalysis/partInfos',
        param: param,
        success: success
    };
    newAjax.get(params);
}

// 财务分析：主要指标
function financialAnalysisMainIndex(param, success) {
    var params = {
        url: HttpUrl + '/semantic-api-service/financeAnalysis/mainIndex',
        param: param,
        success: success
    };
    newAjax.get(params);
}
// 财务分析：财务数据
function financeReport(param, success) {
    var params = {
        url: HttpUrl + '/semantic-api-service/financeAnalysis/financeReport',
        param: param,
        success: success
    };
    newAjax.get(params);
}
// 财务分析：行业对比
function financeInduCompare(param, success) {
    var params = {
        url: HttpUrl + '/semantic-api-service/financeAnalysis/financeInduCompare',
        param: param,
        success: success
    };
    newAjax.get(params);
}

// 获取推送历史消息
function getPushHistoryMessage(param, success, error) {
    var params = {
        url: HttpUrl + '/semantic-api-service/chat/getMessage/'+param.appId+'/'+param.source,
        param: {},
        success: success,
        error: error
    };
    newAjax.get(params);
}

/**
 * 取科创板投教知识
 * @param success
 */
function getEduArticles(success) {
    var params = {
        productId: 'CP170317001',
        client: 'web',
        cp: 1,
        ps: 50,
        navigationTypeIds: 1072,
        showDetail: false
    };
    $.ajax({
        type: "get",
        url: '/eduDomain/edu/listUrl/article',
        data: params,
        dataType: "jsonp",
        jsonp: "callback",
        success: function(json){
            success(json)
        }
    });
}
