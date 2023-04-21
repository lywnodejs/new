/**
 * Created by BoBo on 2017-08-07.
 */
/**
 * 展示相似K线
 * @param result
 */
function showSimilarKStock(result, ifAnswerType) {
    console.log(result);
    if (result.message.code !== 0) {
        sendPreAnswerContent('小e发生故障了，正在自检中，请稍候再试 :D', '', '', result.qId);
        return;
    }

    if (ifAnswerType) {
        var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
        sendPreAnswerContent(word, '', '', result.qId);
    }

    var stockList = [];
    if (result.data)
        stockList = result.data;

    if (stockList.length === 0) {
        sendPreAnswerContent('该股行情数据较少，暂无相似匹配', '', '', result.qId);
        return;
    }

    var tagStockList = '';
    var tempArr = [];
    //循环股票列表
    stockList.forEach(function (item, index) {
        var randomId = generateRandomClassName('');
        var kline = smallKLine.getTarget(randomId,'/robot/semantic/');
        tagStockList +=
            '<div class="box_bd on" onclick="stockFixQuestion(\'' + item.stockCode + '\', \'' + item.stockName + '\', \''+item.marketType+'\',\''+'个股综评'+'\')">' +
            '<div class="linkTop_half"></div> ' +
            '<ul>' +
            '<li>' +
            '<p>' + (item.stockName ? item.stockName : '') + '</p>' +
            '<h6>' + (item.stockCode ? item.stockCode : '') + '</h6>' +
            '</li>' +
            '<li>' +
            '</li>' +
            '<li>' +
            '<p>' + (item.similar ? item.similar.toFixed(2) : '') + '%</p>' +
            '</li>' +
            '</ul>' +
            '<div class="box_img" style="margin-bottom: 0;">' + kline + '</div>' +
            '</div>';
        tempArr.push(randomId);
    });

    var tag =
        '<div class="box_show_ol">' +
        '<ol>' +
        '<li>股票名称</li>' +
        '<li></li>' +
        '<li>相似度</li>' +
        '</ol>' +
        tagStockList +
        '</div>';

    var temp = "<div class='bd'><div class='mb'>" + tag;
    if (ifAnswerType) {
        temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result);
    }
    temp += "</div></div>";

    appendAnswer(temp, '', result.qId);
    scrollToQuestion();

    if (ifAnswerType) {
        getQuestionTabs(result);
    }

    //在容器追加到dom后再初始化K线
    stockList.forEach(function (item, index) {
        // console.log(changeTime(item.startAt)+"--"+changeTime(item.endAt))
        smallKLine.init(tempArr[index], item.marketType + item.stockCode, item.stockName, item.startAt, item.endAt + 24 * 60 * 60 * 1000);
    })
}

/**
 * 新版首页问题
 * @param result
 * @param isShow 主动推送进入小e isShow ==true  显示首页； isShow ==  false不显示首页
 * @param personalResult 个性化首页查询结果
 */
function setNewPresetQuestion (result, isShow, personalResult) {
    // avatar版用另外的模板样式
    if (appKey === 'appAvatar') {
        setAvatarPresetQuestion(result);
        return;
    }

    if (!result || !result.data) {
        return;
    }

    var tagTitleList = '';
    var tagList = '';

    // 您可能关注的
    var tagUserFocusTitle = '';
    var tagUserFocus = '';
    var tagUserFocusHide = '';
    // personalResult = JSON.parse('{"data":{"currentPage":1,"hasNextPage":false,"userQuestions":[{"accountType":"BROWSE","contentId":"5092a92da5f1fed98e4220daff925e25","createAt":1573540974868,"deleteFlag":"0","deviceId":"1573540753422","dimension":"中长期股票推荐","dimensionScore":1,"entity":"NONE","entityType":"NONE","indexId":"ac1e1797f2cd1441bc74b1f071b8fb4a","publishAt":1573007400272,"question":"具有中长期投资价值的股票","questionsId":"f0eb29922f5dec0f1d885c5703b8bd4e","read":0,"top":0,"updateAt":1573540974868,"userContentId":"9878863f317c8d3e74a4e5d37af94d32","userId":"1573540753422","valid":true},{"accountType":"BROWSE","contentId":"4c49d86886b1b818041b6c8fd1eb277c","createAt":1574330956536,"deleteFlag":"0","deviceId":"1573540753422","dimension":"短期股票推荐","dimensionScore":1,"entity":"NONE","entityType":"NONE","indexId":"cc73b790b350aa207955203e68e35fc8","publishAt":1574328950706,"question":"短期看，哪个值得进","questionsId":"e35163a1184c0664a5d9ad7148482a1a","read":0,"top":0,"updateAt":1574330956536,"userContentId":"dd170c79d04b0d0ce489db4bf4048eb2","userId":"1573540753422","valid":true}]},"message":{"code":0,"message":"success","status":200}}')
    if (personalResult) {
        var focusList = personalResult.data.userQuestions || [];
        if (focusList.length > 0) {

            var m = 0;
            for (var i in focusList) {
                if (focusList[i].question) {
                    if(focusList[i].dimension === '资讯'){
                        tagUserFocus += "<ul><li class=\"rxh_li_grow\" onclick=\"showInformationDetail('" + focusList[i].dimensionUniqueKey + "','" + focusList[i].dimension + "','homePage','" + focusList[i].indexId + "')\">" + focusList[i].question + '</li><li><i class="rxh-icon-arrow_r_small"></i></li></ul>';
                    }else {
                        var displayCls1 = m >= 5 ? 'none' : '';
                        var from = '来源：个性化首页';
                        //参数 依次为  sendTxt, showTxt, voiceQuestion, isPopup,questionId,userQuestionId
                        tagUserFocus +=
                          '<ul style="display: '+displayCls1+'" onclick="freeQuestion(\'' + focusList[i].question + '\',\'\',\'\',\'\',\'' + focusList[i].questionsId + '\',\'' + focusList[i].indexId + '\',\'' + from + '\')">' +
                              '<li class="rxh_li_grow rxh_flex_top">' +
                                  '<dt><b class="rxh_spot"></b></dt>' +
                                  '<dd>' + focusList[i].question + '</dd>' +
                              '</li>' +
                              '<li class=" rxh_tr">' +
                                '<i class="rxh-icon-arrow_r_small rxh_gray"></i>' +
                              '</li>' +
                          '</ul>';
                        m++
                    }
                }
            }

            if (tagUserFocus) {
                tagUserFocusTitle += '<a class="rxh_on">您可能关注的</a>';
                tagUserFocusHide = '<div class="item "><div class="rxh_list rxh_list_colN rxh_no_line" style="border: none">'+tagUserFocus+'</div></div>';
                tagUserFocus = '<div class="item rxh_show"><div class="rxh_list rxh_list_colN rxh_no_line" style="border: none">'+tagUserFocus+'</div></div>';
            }
        }
    }

    var recommendQuestion = result.data.recommendQuestion || [];
    var j = 0;
    for (var p in recommendQuestion) {
        // 华创渠道PC版不展示指令卡片
        if (isPC() && appKey === 'appEzt' && p === '指令') {
            continue;
        }

        var cardTitle = p;
        var qList = recommendQuestion[p] || [];

        var onCls = (!tagTitleList && j=== 0) ? 'rxh_on' : '';
        var showCls = (!tagList && j === 0) ? 'rxh_show' : '';
        tagTitleList += '<a class="'+onCls+'">'+cardTitle+'</a>';
        tagList += '<div class="item '+showCls+'"><div class="rxh_list rxh_list_colN rxh_no_line" style="border: none">';

        for (var i = 0; i < qList.length; i++) {
            var displayCls = i >= 5 ? 'none' : '';
            tagList +=
              '<ul style="display: '+displayCls+'" onclick="freeQuestion(\''+qList[i].recommendQuestion.replace(/'/g, "\\'")+'\')">' +
                  '<li class="rxh_li_grow rxh_flex_top">' +
                      '<dt><b class="rxh_spot"></b></dt>' +
                      '<dd>' + qList[i].recommendQuestion + '</dd>' +
                  '</li>' +
                  '<li class=" rxh_tr">' +
                    '<i class="rxh-icon-arrow_r_small rxh_gray"></i>' +
                  '</li>' +
              '</ul>'
        }

        tagList +=
                  '<div class="btn_refresh" style="display: '+(qList.length<=5?'none':'')+'" data-pageNo="1" data-totalPage="'+Math.ceil(qList.length/5)+'" data-totalCount="'+qList.length+'" onclick="getPresetQuestionByPage(event)"><span><i class="icon-refresh"></i><em>'+(appKey==='appHtyw'?'next':'换一换')+'</em></span></div>' +
              '</div>' +
          '</div>';

        if (tagUserFocus) {
            tagTitleList = tagTitleList + '<a>您可能关注的</a>'; // 排第二，不高亮
            tagList = tagList + tagUserFocusHide; // 排第二，不展示
            tagUserFocusTitle = '';
            tagUserFocus = '';
        }

        j++
    }

    if (!tagList) {
      tagTitleList = tagUserFocusTitle; // 排第一，要高亮
      tagList = tagUserFocus; // 排第一，要展示
    }

    var tagBody =
      '<div class="bd"><div class="mb rxh_gap0">'+
      '<div class="rxh_tab rxh_tab02 rxh_mp0 ">' +
          '<div class="rxh_scrollBox">' +
            tagTitleList +
            // '<div class="rxh_rollTips"><i class="rxh-icon-arrow4_r"></i></div>' +
            '<b></b>' +
          '</div>' +
      '</div>' +
      '<div class="rxh_tabCon">' +
            tagList+
      '</div>'+
    '</div></div>';

    if (tagList) {
        $('#divHelp').html(tagBody).show()
    }
}
function getPresetQuestionByPage(event) {
    // console.log(event.currentTarget)
    var target = $(event.currentTarget);
    var pageNo = parseInt(target.attr('data-pageNo')),
      totalPage = parseInt(target.attr('data-totalPage'));

    var childrenList;
    if (appKey === 'appAvatar') {
        childrenList = target.siblings('ul').children();
    } else {
        childrenList = target.siblings();
    }

    if (pageNo+1 <= totalPage) {
        pageNo++
    } else {
        pageNo = 1
    }

    for (var i=0; i<childrenList.length; i++) {
        var item = $(childrenList[i]);
        if (i >= (pageNo*5 - 5) && i < pageNo*5) {
            item.show()
        } else {
            item.hide()
        }
    }
    target.attr('data-pageNo', pageNo)
    // console.log(pageNo, totalCount, totalPage)
}

// avatar首页轮播，包含引导语
var tagAvatarPresetQuestion = '';
// 仅轮播
var tagAvatarQuestionList = '';
/**
 * Avatar首页问题
 * @param result
 * @param isShow 主动推送进入小e isShow ==true  显示首页； isShow ==  false不显示首页
 * @param personalResult 个性化首页查询结果
 */
function setAvatarPresetQuestion (result, isShow, personalResult) {
    if (!result || !result.data) {
        return;
    }

    var recommendQuestion = result.data.recommendQuestion || [];
    var tagQlist = '';
    for (var p in recommendQuestion) {
        var cardTitle = p;
        var qList = recommendQuestion[p] || [];
        tagQlist +=
          '<div class="swiper-slide">' +
              '<div class="box">' +
                  '<div class="hd">' + cardTitle + '</div>' +
                    '<ul class="bd">';
        for (var i = 0; i < qList.length; i++) {
            var displayCls = i >= 5 ? 'none' : '';
            tagQlist += '<li style="display: '+displayCls+'" onclick="freeQuestion(\''+qList[i].recommendQuestion+'\')"><a onclick="changeLinkColor(event)">' + qList[i].recommendQuestion + '</a></li>'
        }
        tagQlist += '</ul>' +
                  '<div class="btn_refresh" style="display: '+(qList.length<=5?'none':'')+'" data-pageNo="1" data-totalPage="'+Math.ceil(qList.length/5)+'" data-totalCount="'+qList.length+'" onclick="getPresetQuestionByPage(event)"><span><i class="icon-refresh"></i><em>换一换</em></span></div>' +
              '</div>' +
          '</div>';
    }

    tagAvatarQuestionList =
        '<div class="bd">'+
            '<div class="mb">'+
                '<div class="md_AIRecommend_hkws" style="width: '+(winW - 20 - 34)+'px;">' +
                    '<div class="swiper-container">' +
                        '<div class="swiper-wrapper">' +
                            tagQlist +
                        '</div>' +
                    '</div>' +
                    '<div class="swiper-pagination"></div>' +
                '</div>'+
            '</div>'+
        '</div>';

    var tagCard =
        '<div class="md_left_v2">'+
            '<div class="hd">'+
                '<div class="mb_avatar">'+
                    '<img src="'+headImg+'">'+
                '</div>'+
                '<h4>你可以说</h4>'+
            '</div>'+
            tagAvatarQuestionList+
        '</div>';

    if (tagQlist) {
        // 存下来，重置页面再次使用
        tagAvatarPresetQuestion = tagCard;
        $(mainContent).append(tagCard);
        setHelpCss(1);
    }
}
// 问题点击后变色，紫色：a_visited，黑色：a_recovery
function changeLinkColor(event) {
    // console.log(event)
    event.currentTarget.className = 'a_visited';
}

/**
 * 首页 智能推荐 热门语句 页面样式
 */
function setHelpCss(t) {
    if (1 === t) {
        t = '';
    }

    /* 首页 智能推荐 begin */
    certifySwiper = new Swiper(' .md_AIRecommend_hkws .swiper-container', {
        //        initialSlide :2,    //设置初始个数，从0开始
        watchSlidesProgress: true,
        keyboard: true,
        slidesPerView: 1,     //容器能够同时显示的slides数量
        centeredSlides: true,   //active slide会居中，而不是默认状态下的居左
               loop: true,             //循环。默认：false
        //        autoplay: true,         //自动播放。默认：false
        autoplay: {
            delay: 5000, // 轮播间隔时间
            disableOnInteraction: false
        },
        pagination: {
            el: ' .md_AIRecommend_hkws .swiper-pagination',
            clickable: true
        },
        on: {
            progress: function (progress) {
                for (var i = 0; i < this.slides.length; i++) {
                    var slide = this.slides.eq(i);
                    var slideProgress = this.slides[i].progress;
                    scale = 1 - Math.abs(slideProgress) / 5;
                    zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
                    slide.transform('translateX(0) scale(' + scale + ')');
                    slide.css('zIndex', zIndex);
                    slide.css('opacity', 1);
                    if (Math.abs(slideProgress) > 3) {
                        slide.css('opacity', 0);
                    }
                }
            },
            setTransition: function (transition) {
                for (var i = 0; i < this.slides.length; i++) {
                    var slide = this.slides.eq(i)
                    slide.transition(transition);
                }
            }
        }
    });
    /* 首页 智能推荐 end */
}

/**
 * 重置小E界面，供原生调用，不可删除！
 */
function resetXiaoE() {
    if (tagAvatarPresetQuestion) {
        $(mainContent).html('');
        $(mainContent).append(tagAvatarPresetQuestion);
        setHelpCss(1);
    }
}

/**
 * 首页个性化定制  静静  2018.06.19
 *
 * @param result
 * @param isShow 主动推送进入小e isShow ==true  显示首页； isShow ==  false不显示首页
 */
function setPersonalizedCustomizationQuestion(result, isShow) {
    if (result.message.code != 0) {
        return;
    }
    if (result.data.hasNextPage) {
        personalizedCustomizationCP = result.data.currentPage + 1;
    } else {
        personalizedCustomizationCP = 1;
    }
    var list = result;
    getNewPresetQuestion(function (result) {
        setNewPresetQuestion(result, isShow, list)
    })
}

/**
 * 综评类回答
 * @param result
 * @param source  来源（便于百度统计）
 */
function stockOverallEval(result, isPopup, showInteractiveView,source) {
    var type = result.answerResultType;
    //1, 重名股票情况处理
    var questionAnalyse = result.questionAnalyse[0];
    var stockList = questionAnalyse.entity;
    var totalCount = stockList.length;
    if ((type === '股票' || type === '个股综评') && totalCount > 1) {
        handleDuplicatedStock(result, stockList, totalCount);
        return;
    }

    //取股票名称,symbol
    try {
        var property = questionAnalyse.entity[0].property;
        var symbol = getSymbolByEntity(questionAnalyse.entity);
        var stockName = property.name;
    } catch (e) {
        sendPreAnswerContent('小e用脑过度，请稍后再问，多谢理解', '', '', result.qId);
        saveLog('jsError', e.message, 'answer-3.js', 0, 'stockOverallEval()', e.stack.toString());
        return;
    }

    //2, 退市或停牌股票处理
    var status = property.status;
    if (status === 'stop' || status === '退市') {
        sendPreAnswerContent(stockName + '退市啦，换支股票试试吧', '', '', result.qId);
        return;
    }

    if (!isPopup) {
        //额外的话术
        if (result.words) {
            sendPreAnswerContent(result.words + ' ' + result.preAnswerContent, '', '', result.qId);
        } else {
            //引导语
            sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

        }
    }

    //3, 指数技术分析，指数
    if (type === '指数技术分析' || type === '指数' || type === '上证指数综合评价' || type === '指数综评') {
        showIndexKline(result);
    }
    //4，st股，新股，展示K线
    else if (result.hasOwnProperty('data') && result.data.hasOwnProperty('stockTechnicalResult') && result.data.stockTechnicalResult) {
        showKline(symbol, result.data.stockTechnicalResult, result, isPopup);
    }
    //5，技术分析
    else {
        // 将之前展示的K线移除，只保留一个  静静，刘奕
        if(!isPopup){
            // 找出K线容器
            var con = $("div[id^=chartContainer]");
            if(con && con.length>0){
                // 展示重新打开
                var reopen = $('#reopen'+con[0].id.replace('chartContainer', ''));
                reopen.show();
                // 移除K线容器
                con.remove();
            }
        }

        /**
         * !isPopup非技术分析弹框 chartTabIndex=0 显示趋势分析
         * isPopup 技术分析弹框   chartTabIndex=1 显示区域分析
         * @type {number}
         */
        var chartTabIndex = 0;
        if (!isPopup) {
            chartTabIndex = 0;
        } else {
            chartTabIndex = 1;
        }
        var t_chart = generateRandomClassName('');
        var target = analysis_klineInit.getTarget(t_chart,appKey,symbol,chartTabIndex,type,source,isPopup);//技术分析优化（1.1）

        var marketType='', stockCode='', predicateType='';
        try{
          marketType = questionAnalyse.entity[0].property.marketType;
          stockCode = questionAnalyse.entity[0].property.code;
          predicateType = questionAnalyse.semanticProperties.convertPredicate;
        }catch (e) {
            saveLog('jsError', e.message, 'answer-3.js', 0, 'stockOverallEval()', e.stack.toString());
        }

        var randomTime = new Date().getTime()+(Math.random() * 10000).toFixed(0)
        var temp = "";
        if (!isPopup) {
            temp = '<div id="'+('reopen'+randomTime)+'" style="padding-left: 45px; display: none;">' +
                        '<a style="color: #639df5; " marketType="'+marketType+'" stockCode="'+stockCode+'" stockName="'+stockName+'" predicateType="'+predicateType+'" status="'+status+'" title="'+type+'" onclick="reopenInPopup(event)">$查看详情</a>' +
                    '</div>'
                    +"<div id='"+('chartContainer'+randomTime)+"' class='bd'>" +
                        "<div class='mb'>";
        } else {
            temp = "<div><div>";
        }
        temp += target;
        if (!isPopup) {
            temp += getRatingLabel(result, showInteractiveView);
        }

        temp += "</div></div>";
        if (!isPopup) {
            appendAnswer(temp, "", result.qId);
        } else {
            appendAnswerToPopup(temp);
        }

        analysis_klineInit.init(symbol, t_chart,appKey,chartTabIndex,type,isPopup,'robot_e');//技术分析优化（1.1）

        //data不为空再展示研报
        if (checkObjectIsNull(result.data)) {
            stockRelatedReports(result, false, isPopup);
        } else {
            if (!isPopup) {
                getQuestionTabs(result);
                $(".hideContent").fadeIn();
            }
        }
    }
}

/**
 * 重新在底部打开技术分析
 * @param event
 */
function reopenInPopup(event) {
  var marketType = $(event.target).attr('marketType');
  var stockCode = $(event.target).attr('stockCode');
  var stockName = $(event.target).attr('stockName');
  var predicateType = $(event.target).attr('predicateType');
  var title = $(event.target).attr('title');
  showTotalDetail(marketType, stockCode, stockName, predicateType, '', title);
}

/**
 * 研报类回答
 * @param result
 * @param outputGuideLine 是否输出引导语
 */
function stockRelatedReports(result, outputGuideLine, isPopup, ifSecond, showInteractiveView) {
    if (outputGuideLine === undefined || outputGuideLine || outputGuideLine == '') {
        if (isPopup || !ifSecond) {
            // console.log('22222');
        } else {
            sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);
        }
    }

    var reportList = [];
    var answerType = result.answerResultType;
    var timeType = '';

    //个股
    if (result.data.hasOwnProperty('stockReportResult')) {
        reportList = result.data.stockReportResult;
    }
    //行业
    else if (result.data.hasOwnProperty('industryAnalyseResult')) {
        reportList = result.data.industryAnalyseResult;
    }
    //大盘，策略
    else if (result.data.hasOwnProperty('strategyAdviceResult')) {
        reportList = result.data.strategyAdviceResult.semanticDocs;
        timeType = result.data.strategyAdviceResult.timeType;
    }
    //其它
    else {
        reportList = result.data.list;
    }

    //未找到相关研报
    if (!reportList) {
        getQuestionTabs(result);
        return;
    }

    var property = result.questionAnalyse[0].entity[0].property;
    //指数类型
    var indexType = property.name;
    var symbol = getSymbolByEntity(result.questionAnalyse[0].entity, false);
    //指数symbol须拼前缀
    if (answerType === '指数综评') {
        //创业板用大盘的
        // if (indexType === '创业板指')
        if (indexType.indexOf('创业板') !== -1) // 红军接口变化，2020。02。18
            symbol = 'sh000001';
        else {
            symbol = getSymbolByEntity(result.questionAnalyse[0].entity);
        }
    }

    var item;
    var contentIds = [];
    //生成随机数，作为class名
    var hideClass = generateRandomClassName('hideReport');
    var tagBody = '';
    if (!isPopup) {
        tagBody = '<div class="mb">';
    } else {
        tagBody = '<div>';
    }

    for (var i = 0; i < reportList.length; i++) {
        item = reportList[i];
        var sourceFrom = item.docType,
            summary = item.title,
            organization = sourceFrom === "weixin" ? item.weChatName : item.organization,
            author = item.author,
            ratingName = item.ratingName ? item.ratingName : '';

        //提取要点集合
        var tempArray = [];
        for (var x in item.analyseFlags) {
            var strategyName = item.analyseFlags[x];

            //根据不同的指数过滤要点
            // if (indexType === '创业板指') {
            if (indexType.indexOf('创业板') !== -1) {
                if (strategyName !== '创业板分析' && strategyName !== '日策略创业板分析')
                    continue;
            } else if (indexType === '上证指数') {
                //取对应的时间
                if (timeType === '' && strategyName !== '大盘行情展望' && strategyName !== '日策略大盘行情展望')
                    continue;
                else if (timeType === '短期' && strategyName !== '短期大盘行情展望' && strategyName !== '短期日策略大盘行情展望')
                    continue;
                else if (timeType === '中长期' && strategyName !== '中长期大盘行情展望' && strategyName !== '中长期日策略大盘行情展望')
                    continue;
            }

            tempArray.push(strategyName);
        }

        var tagListBody = '';
        //第2个以后的先隐藏
        if (i >= 2)
            tagListBody = '<div class="gzpj ' + hideClass + '" style="display: none">';
        else
            tagListBody = '<div class="gzpj">';

        //循环展示多个要点，根据提取出来的要点
        var index = 0;
        for (var j = 0; j < tempArray.length; j++) {
            var subType = tempArray[j];

            //行业不用拼symbol
            if (answerType === '专家行业观点' || answerType === '行业' || answerType === '行业综评' || answerType === '行业个股推荐') {
                if (subType !== '行业分析' && subType !== '行业个股推荐' && subType !== '行业龙头分析')
                    continue;
                symbol = '';
            }
            else if (answerType === '经营分析') {
                if (subType !== '外部环境' && subType !== '经营分析')
                    continue;
            }
            else if (answerType === '竞争优势') {
                if (subType !== '经营分析' && subType !== '竞争优势')
                    continue;
            }
            else if (answerType === '估值评级' || answerType === '个股综评') {
                if (subType !== '估值评级')
                    continue;
            }
            else if (answerType === '业绩简评') {
                if (subType !== '业绩简评')
                    continue;
            }

            summary = item.analyseResults[symbol + subType];
            summary = replaceLineBreak(summary);

            //第一个特殊处理，是否展示证券公司
            if (index === 0) {
                //估值评级特殊处理，用红底，要点改用评级
                var tagKeyPoint = '';
                var clsBg = '';
                if (subType === '估值评级') {
                    if (ratingName)
                        tagKeyPoint = ratingName + '【评级】';
                    else
                        tagKeyPoint = subType;
                    clsBg = '';
                } else {
                    tagKeyPoint = subType.replace('大盘', '').replace('日策略', '');
                    clsBg = 'box_bBlue';
                }

                tagListBody +=
                    // <!--红框白字 2行-->
                    '<div class="box_bRed box_bRed_r2 ' + clsBg + '">' +
                    '<li>' + tagKeyPoint + '</li>' +
                    '<li>' +
                    '<h6><span>' + organization + '/' + author + '</span><br>' + changeTime(item.publishAt) + '</h6>' +
                    '</li>' +
                    '</div>';
            }

            //内容，展开，收起Id
            var contentId = generateRandomClassName('contentId');
            var expandBtnId = generateRandomClassName('expandBtnId');
            var foldBtnId = generateRandomClassName('foldBtnId');
            contentIds.push([contentId, expandBtnId]);

            //第2个要点及以后只显示要点名称，不展示证券公司
            var tagExtraKeyPoint = '';
            if (index > 0) {
                tagExtraKeyPoint =
                    '<div class="box_bRed box_bRed_r2 box_bBlue">' +
                    '<li>' + subType.replace('大盘', '').replace('日策略', '') + '</li>' +
                    '</div>';
            }

            //展示标题：事件对公司的影响
            var tagTitle = '';
            if (subType === '事件影响')
                tagTitle += '<p>' + item.title + '</p>';
            //判断是否展示要点
            tagListBody +=
                // <!--显示6行，有展开按钮-->
                '<div class="box_show box_show_r3">' +
                tagExtraKeyPoint + tagTitle +
                '<h5 id="' + contentId + '" class="show_row3">' + summary + '</h5>';
            tagListBody += '<a id="' + expandBtnId + '" class="a_more" onclick="expandContent(\'' + expandBtnId + '\',\'' + contentId + '\',\'' + foldBtnId + '\')">展开<i class="icon-arrowD"></i></a>';
            tagListBody += '<a id="' + foldBtnId + '" style="display: none" class="a_more" onclick="foldContent(\'' + foldBtnId + '\',\'' + contentId + '\',\'' + expandBtnId + '\')">收起<i class="icon-arrowT"></i></a>';
            tagListBody += '</div>';
            index++;
        }
        tagListBody += '</div>';
        tagBody += tagListBody;
    }

    //加载更多
    var btnMore = '';
    if (reportList.length > 2) {
        var moreId = generateRandomClassName('moreId');
        btnMore =
            '<div id="' + moreId + '" class="mb">' +
                '<div class="box_load" onclick="showMoreArticle(\'' + hideClass + '\', \'' + moreId + '\')">' +
                    '<a>点击加载更多</a>' +
                '</div>' +
            '</div>';
    }

    var temp = '';
    if (!isPopup) {
        temp = '<div class="bd">';
    } else {
        temp = '<div>';
    }
    temp += tagBody + btnMore;
    temp += isPopup ? '' : (generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView));
    temp += '</div></div>';

    if (!isPopup) {
        appendAnswer(temp, '', result.qId);
        scrollToQuestion();
        getQuestionTabs(result);
    } else {
        appendAnswerToPopup(temp);
    }
    checkTextOverflow(contentIds);
}

/**
 * 股票重名处理
 * @param result 返回的结果
 * @param stockList 股票列表
 * @param totalCount 总条数
 */
function handleDuplicatedStock(result, stockList, totalCount) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);
    var temp = '';
    for (var i = 0; i < totalCount; i++) {
        var item = stockList[i];
        if (i <= 8) {
            temp += "<li onclick=alterFreeQuestion(\'" + item.property.code.replace(/\s+/g, '') + "','" + item.property.name.replace(/\s+/g, '') + "')><span>" + item.property.name + "</span></li>";
        } else {
            temp += "<li onclick=alterFreeQuestion('" + item.property.code.replace(/\s+/g, '') + "','" + item.property.name.replace(/\s+/g, '') + "') class='showMoreStock' style='display:none'><span>" + item.property.name + "</span></li>"
        }
    }

    var answerTxt = "<div class='bd'><div class='mb'><ul>" + temp + "</ul>";
    if (totalCount > 9) {
        answerTxt += "<div class='btn'><a class='btn_view' onclick='showAllStocks(event)'>全部展示</a>" + getRatingLabel(result) + "</div></div></div>";
    } else {
        answerTxt += getRatingLabel(result) + '</div>';
    }

    appendAnswer(answerTxt, "md_tlbox md_col3", result.qId);
}

/**
 * 指数K线
 * @param result
 */
function showIndexKline(result) {
    var type = result.answerResultType;
    var data = result.data || {};
    var questionAnalyse = result.questionAnalyse[0];
    var subject = questionAnalyse.entity[0];
    var property = subject.property;
    var symbol = property.marketType + property.code;

    //取报价
    getPrice(symbol, function (json) {
        var newPrice = json.newPrice === 0 ? json.lastClose : json.newPrice;
        var change = json.newPrice === 0 ? '' : json.change;
        var rise = json.newPrice === 0 ? '' : json.rise;

        //图表
        var chart_t = generateRandomClassName('');
        var indexChart = klineByType.getTarget(chart_t);

        var analysisText = '';
        if (type === '上证指数综合评价' || type === '指数综评') {
            analysisText = data.indexTechnicalResult ? data.indexTechnicalResult.analysisText : '';
        } else {
            analysisText = data.analysisText || '';
        }

        var clsColor = '';
        if (rise > 0)
            clsColor = 't_red';
        else if (rise < 0)
            clsColor = 't_green';

        var answerTxt =
            '<div class="bd"><div class="mb">' +
            '<div class="box_stoInfo">' +
            '<li>' +
            '<p>' + subject.property.name + ' (' + subject.property.code + ') </p>' +
            '<h6>' + changeTimeForMin(json.time * 1000) + '</h6>' +
            '</li>' +
            '<li class="' + clsColor + '">' +
            '<p>' + fixed2(newPrice) + '</p>' +
            '<h6>' + fixed2(change) + ' (' + fixed2(rise) + '%)</h6>' +
            '</li>' +
            '</div>';
        if (data.commentAt) {
            answerTxt += "&nbsp;&nbsp;|&nbsp;&nbsp;" + changeTimeForMin(data.commentAt);
        }

        //xdy
        if(analysisText){
            answerTxt += "" + indexChart + "<h5><b>技术面分析：</b>" + analysisText + "</h5>" + getRatingLabel(result) + "</div></div>";
        }else{
            answerTxt += "" + indexChart + getRatingLabel(result) + "</div></div>";
        }

        // 语音
        if (property.name === '上证指数') {
            playVoiceAnswerLite(analysisText);
        }

        appendAnswer(answerTxt, "", result.qId);

        klineByType.init(symbol, chart_t, json, property.name);

        //data不为空再展示研报
        if (checkObjectIsNull(result.data)) {
            stockRelatedReports(result, false, false, false);
        } else {
            getQuestionTabs(result);
        }

        $(".hideContent").fadeIn();
    });
}

/**
 * 显示K线图
 * @param symbol
 * @param huashu 话术
 * @param result
 * 话术中包含“风险提示:”字样的，不显示K线图，话术中去掉“技术面分析：”字样（20180628--曹德亮）
 */
function showKline(symbol, huashu, result, isPopup) {
    // 如果data不为空，则是st股，新股
    getPrice(symbol, function (json) {
        var questionAnalyse = result.questionAnalyse[0];
        var subject = questionAnalyse.entity[0];
        var stockName = subject.property.name;
        var analysisText = huashu;
        var newPrice = json.newPrice === 0 ? json.lastClose : json.newPrice;
        var change = json.newPrice === 0 ? '' : json.change;
        var rise = json.newPrice === 0 ? '' : json.rise;
        var url = '';

        if (analysisText.indexOf("风险提示:") !== -1) {
            url = '';
        } else {
            url = onlykline.getTarget(generateRandomClassName(''));
        }

        var clsColor = '';
        if (rise > 0)
            clsColor = 't_red';
        else if (rise < 0)
            clsColor = 't_green';
        if (!isPopup) {
            var answerTxt =
                '<div class="bd"><div class="mb">' +
                '<div class="box_stoInfo">' +
                '<li>' +
                '<p>' + subject.property.name + ' (' + subject.property.code + ') </p>' +
                '<h6>' + changeTimeForMin(json.time * 1000) + '</h6>' +
                '</li>' +
                '<li class="' + clsColor + '">' +
                '<p>' + fixed2(newPrice) + '</p>' +
                '<h6>' + fixed2(change) + ' (' + fixed2(rise) + '%)</h6>' +
                '</li>' +
                '</div>';
        } else {
            var answerTxt = '';
        }
        if (!isPopup) {
            if(analysisText.indexOf("风险提示:") !== -1){
                answerTxt += "" + url + "<h5>" + analysisText + "</h5>" + getRatingLabel(result) + "</div></div>";//xdy
            }else{
                answerTxt += "" + url + "<h5><b>技术面分析：</b>" + analysisText + "</h5>" + getRatingLabel(result) + "</div></div>";//xdy
            }
            appendAnswer(answerTxt, '', result.qId);
        } else {
            if(analysisText.indexOf("风险提示:") !== -1){
                answerTxt += "" + url + "<h5>" + analysisText.replace("风险提示:","") + "</h5></div></div>";
            }else{
                answerTxt += "" + url + "<h5><b>技术面分析：</b>" + analysisText + "</h5></div></div>";
            }
            appendAnswerToPopup(answerTxt);
        }

        if(analysisText.indexOf("风险提示:") == -1){
            onlykline.init(symbol, stockName);
        }

        //投资建议
        if (result.data.hasOwnProperty('investAdviceResult')) {
            stockRelatedReports(result, false);
        } else {
            if (!isPopup) {
                getQuestionTabs(result);
            }

        }

        $(".hideContent").fadeIn();
        setTimeout(function () {
            scrollToQuestion();
        }, 1000);
    })
}


/**
 * 分红配股
 * @param result
 */
function shareDividend(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var list = result.data;
    var len = list.length;
    var temp = '';

    var recentPlan;
    if (len > 0) {
        recentPlan = list.shift();

        //最近分红方案
        var tagRecent =
            '<div class="box_hd2 box_hd2_red">' +
            '<span>最新分红配股方案</span>' +
            '<b><i class="i_t"></i><i class="i_b"></i></b>' +
            '<em class="date">' + changeTime(recentPlan.quarterEndAt) + '</em>' +
            '</div>' +
            '<h5>分红方案:' + recentPlan.boardInstruction.replace(/\n/g, '<br>') + '</h5>';
        if (recentPlan.aStockRecordDay || recentPlan.aStockExdividendDay || recentPlan.aStockPaymentDay) {
            tagRecent += '<div class="box_show_ol box_show_ol3 box_ol_data">' +
                '<div class="linkTop_half"></div>' +
                '<ol>' +
                '<li>股权登记日</li>' +
                '<li>除权日</li>' +
                '<li>红利发放日</li>' +
                '</ol>' +
                '<ul>' +
                '<li>' +
                '<h6>' + generateDate(recentPlan.aStockRecordDay) + '</h6>' +
                '</li>' +
                '<li>' +
                '<h6>' + generateDate(recentPlan.aStockExdividendDay) + '</h6>' +
                '</li>' +
                '<li>' +
                '<h6>' + generateDate(recentPlan.aStockPaymentDay) + '</h6>' +
                '</li>' +
                '</ul>' +
                '<div class="clear_float"></div>' +
                '</div>';
        }

        //历史方案
        var tagHistory = '';
        var loop = '';
        len = list.length;
        if (len > 0) {
            tagHistory =
                // <!-- 带背景色的标题框蓝色-->
                '<div class="box_hd2 box_hd2_blue">' +
                '<span>分红配股历史</span>' +
                '<b><i class="i_t"></i><i class="i_b"></i></b>' +
                '</div>' +
                '<div class="box_show_ol box_show_ol3 box_ol3_dividends">' +
                '<ol>' +
                '<li>分红方案</li>' +
                '<li>每股收益</li>' +
                '<li>分红年度</li>' +
                '</ol>';

            for (var i = 0; i < len && i < 4; i++) {
                var item = list[i];
                //收益样式
                var clsProfit = '';
                if (item.basicEps > 0)
                    clsProfit = 't_red';
                else if (item.basicEps < 0)
                    clsProfit = 't_green';
                loop +=
                    '<ul>' +
                    '<li>' +
                    '<h5>' + item.boardInstruction + '</h5>' +
                    '</li>' +
                    '<li>' +
                    '<h5 class="' + clsProfit + '">' + fixed2(item.basicEps) + '</h5>' +
                    '</li>' +
                    '<li>' +
                    '<h6>' + changeTime(item.quarterEndAt) + '</h6>' +
                    '</li>' +
                    '</ul>'
            }
            tagHistory = tagHistory + loop + '<div class="clear_float"></div></div>';
        }

        temp = '<div class="bd"><div class="mb">' + tagRecent + tagHistory + generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) + '</div></div>';
        appendAnswer(temp, '', result.qId);
        getQuestionTabs(result);
    }
}

/**
 * 公司概况
 * @param result
 */
function companyIntroduction(result, isPopup, showInteractiveView) {
    if (!isPopup)
        sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var detail = result.data;

    var contentId1 = generateRandomClassName('contentId');
    var expandBtnId1 = generateRandomClassName('expandBtnId');
    var foldBtnId1 = generateRandomClassName('foldBtnId');

    var contentId3 = generateRandomClassName('contentId');
    var expandBtnId3 = generateRandomClassName('expandBtnId');
    var foldBtnId3 = generateRandomClassName('foldBtnId');

    var body =
        '<h6 class="date">更新日期：' + changeTime(detail.updateAt) + '</h6>' +
        '<div class="box_show box_show_btn">' +
        '<h5 id="' + contentId1 + '" class="show_row3"><b>经营范围：</b>' + detail.businessScope.replace(/\n/g, '<br>') + '</h5>' +
        '<a id="' + expandBtnId1 + '" class="a_more" onclick="expandContent(\'' + expandBtnId1 + '\',\'' + contentId1 + '\',\'' + foldBtnId1 + '\')">展开<i class="icon-arrowD"></i></a>' +
        '<a id="' + foldBtnId1 + '" style="display: none" class="a_more" onclick="foldContent(\'' + foldBtnId1 + '\',\'' + contentId1 + '\',\'' + expandBtnId1 + '\')">收起<i class="icon-arrowT"></i></a>' +
        '</div>' +
        '<div class="box_show box_show_btn">' +
        '<h5><b>主营业务：</b>' + detail.mainBusiness.replace(/\n/g, '<br>') + '</h5>' +
        '</div>' +
        '<div class="box_show box_show_btn">' +
        '<h5 id="' + contentId3 + '" class="show_row3"><b>历史沿革：</b>' + detail.introduction.replace(/\n/g, '<br>') + '</h5>' +
        '<a id="' + expandBtnId3 + '" class="a_more" onclick="expandContent(\'' + expandBtnId3 + '\',\'' + contentId3 + '\',\'' + foldBtnId3 + '\')">展开<i class="icon-arrowD"></i></a>' +
        '<a id="' + foldBtnId3 + '" style="display: none" class="a_more" onclick="foldContent(\'' + foldBtnId3 + '\',\'' + contentId3 + '\',\'' + expandBtnId3 + '\')">收起<i class="icon-arrowT"></i></a>' +
        '</div>';
    if (!isPopup) {
        body += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView);
    }

    var temp = '';

    if (isPopup)
        temp = body;
    else
        temp =
            '<div class="bd"><div class="mb">' +
            body +
            '</div></div>';

    if (isPopup)
        appendAnswerToPopup(temp);
    else
        appendAnswer(temp, '', result.qId);

    checkTextOverflow([[contentId1, expandBtnId1], [contentId3, expandBtnId3]]);

    if (!isPopup)
        getQuestionTabs(result);
}

/**
 * 事件影响
 * @param result
 */
function eventInfluence(result) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var stocks = result.data.stocks ? result.data.stocks : [], //股票
        industries = result.data.industries ? result.data.industries : [], //行业
        reason = ''; //推荐理由

    //给容器一个，当股票模块拼好后将元素附加到容器
    var randomId = generateRandomClassName('eventId');

    var stockLen = stocks.length;
    var tagStock = '';
    var liCls = '';
    //处理股票
    if (stockLen > 0) {
        //提取代码集合
        var symbols = [];
        stocks.forEach(function (item) {
            symbols.push(item.marketType + item.stockCode);
        });

        //取股票报价
        getPriceList(symbols.join(','), function (quotaResult) {
            //如果有行业，那么要展示这行
            if (industries.length > 0)
                tagStock +=
                    '<div class="box_hd2 box_hd2_red">' +
                    '<span>对个股的影响</span>' +
                    '<b><i class="i_t"></i><i class="i_b"></i></b>' +
                    '<em></em>' +
                    '</div>';

            tagStock += '<div class="box_show_olBD">';
            //循环股票
            stocks.forEach(function (item, index) {
                reason = result.data.reasonDocMap[item.stockCode];
                //给每行一个随机类名
                liCls = generateRandomClassName('eventStock');

                //没有股票名称的展示股票代码
                var stockName = (item.stockName ? item.stockName : item.stockCode);
                var tagStockBody = '';

                //股票相关研报要点集合
                var arrKeyPoints = reason.analyseFlags;
                for (var n = 0; n < arrKeyPoints.length; n++) {
                    if (n === 0)
                        tagStockBody += '<p>' + highlightText(reason.title, [stockName].concat(result.data.eventAnalyse)) + '</p>';
                    tagStockBody += '<br/><h5><b>' + arrKeyPoints[n] + '：</b>' + replaceLineBreak(highlightText(reason.analyseResults[item.stockCode + arrKeyPoints[n]], [stockName].concat(result.data.eventAnalyse))) + '</h5>';
                }

                // 因股票列表中可能会有港股，无法取到行情，因此需要循环匹配下
                var newPrice, rise;
                for(var m=0; m<quotaResult.items.length; m++) {
                    if(item.stockCode === quotaResult.items[m].stkCode) {
                        newPrice = quotaResult.items[m].newPrice;
                        rise = quotaResult.items[m].rise;
                        break;
                    }
                }

                var colorCls = getClsByNumber(rise || 0);
                tagStock +=
                    '<div class="box_bd ' + liCls + '">' +
                        '<ul>' +
                            '<li onclick="stockFixQuestion(\'' + item.stockCode + '\',\'' + stockName + '\',\'' + item.marketType + '\',\'' + '个股综评' + '\')">' +
                                '<p>' + stockName + '</p>' +
                                '<h6>' + item.stockCode + '</h6>' +
                            '</li>' +
                            '<li class="' + colorCls + '">' +
                                '<p>' + fixed2(newPrice||'') + '</p>' +
                                '<h6>' + fixed2(rise||'') + '%</h6>' +
                            '</li>' +
                            '<li>' +
                                '<h5>影响原因</h5>' +
                                '<h6 onclick="setContentVisible(\'' + liCls + '\',event)">【展开】</h6>' +
                            '</li>' +
                        '</ul>' +
                        '<div class="box_txt expandH">' +
                            tagStockBody +
                        '</div>' +
                    '</div>'
            });
            tagStock += '</div>';
            //追加到容器
            $('#' + randomId).prepend(tagStock);
        });
    }

    var industryLen = industries.length;
    var tagIndustry = '';
    //处理行业
    if (industryLen > 0) {
        //如果有个股，那么要展示这行
        if (stockLen > 0)
            tagIndustry +=
                '<div class="box_hd2 box_hd2_blue">' +
                '<span>对行业的影响</span>' +
                '<b><i class="i_t"></i><i class="i_b"></i></b>' +
                '<em></em>' +
                '</div>';
        tagIndustry += '<div class="box_show_olBD box_show_olBD2">';
        //循环行业
        industries.forEach(function (item, index) {
            reason = result.data.reasonDocMap[item.term];
            //要点集合
            var arrKeyPoints = reason.analyseFlags;

            //给每行一个随机类名
            liCls = generateRandomClassName('eventIndustry');

            var tagIndustryBody = '';
            //循环要点
            for (var x = 0; x < arrKeyPoints.length; x++) {
                if (x === 0)
                    tagIndustryBody += '<p>' + highlightText(reason.title, result.data.eventAnalyse) + '</p>';
                tagIndustryBody += '<br/><h5><b>' + arrKeyPoints[x] + '：</b>' + replaceLineBreak(highlightText(reason.analyseResults[arrKeyPoints[x]], result.data.eventAnalyse)) + '</h5>'
            }
            tagIndustry +=
                '<div class="box_bd ' + liCls + '">' +
                '<ul>' +
                '<li onclick="industryClick(\'' + item.term + '\')">' +
                '<p>' + item.term + '</p>' +
                '</li>' +
                '<li>' +
                '<h5>影响原因</h5>' +
                '<h6 onclick="setContentVisible(\'' + liCls + '\',event)">【展开】</h6>' +
                '</li>' +
                '</ul>' +
                '<div class="box_txt expandH">' +
                tagIndustryBody +
                '</div>' +
                '</div>';
        });
        tagIndustry += '</div>';
    }

    var temp = '<div class="bd"><div id="' + randomId + '" class="mb">' + tagIndustry + generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result) + '</div></div>';
    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
}

/**
 * 资金流向
 * @param source 来源  百度统计
 */
function moneyFlow(result, isPopup, showInteractiveView,source) {
    if (!isPopup)
        sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    //随机id
    var navId = generateRandomClassName('nav');
    var tagNav =
        '<nav id="' + navId + '">' +
        '<a>1日</a>' +
        '<a class="on">5日</a>' +
        '<a>10日</a>' +
        '<a>30日</a>' +
        '</nav>';

    var tagList = '';

    if (!result.data) {
        tagList = '暂无数据';
        return;
    }

    var voiceTxt = '';
    //循环构建多个周期的资金流向
    for (var i in result.data) {
        //当前周期数据
        var dayMoney = result.data[i];
        //主力净流
        var majorNetFlow = dayMoney.majorFlowIn - dayMoney.majorFlowOut;
        //小单
        var totalSmall = dayMoney.smallOrderBuy + dayMoney.smallOrderSell;
        //中单
        var totalMedium = dayMoney.mediumOrderBuy + dayMoney.mediumOrderSell;
        //大单
        var totalBig = dayMoney.bigOrderBuy + dayMoney.bigOrderSell;
        //特大
        var totalHuge = dayMoney.hugeOrderBuy + dayMoney.hugeOrderSell;
        //总买，卖
        var totalBuy = dayMoney.smallOrderBuy + dayMoney.mediumOrderBuy + dayMoney.bigOrderBuy + dayMoney.hugeOrderBuy;
        var totalSell = dayMoney.smallOrderSell + dayMoney.mediumOrderSell + dayMoney.bigOrderSell + dayMoney.hugeOrderSell;
        //汇总
        var totalNum = totalBuy + totalSell;

        // 算出语音要读的文本
        if (i === '5') {
            try {
                var entity = getPropertyByEntity(result.questionAnalyse[0].entity);
                voiceTxt = entity.name+'近5日资金净流'+(majorNetFlow>0?'入':'出')+Math.abs(majorNetFlow)+'万元。';
            } catch (e) {
            }
        }

        //默认展示5日
        tagList +=
            '<div class="nav_con ' + (parseInt(i) === 5 ? 'show' : '') + '">' +
            '<ul class="box_flow">' +
            '<li>' +
            '<p class="t_red">' + dayMoney.majorFlowIn + '万</p>' +
            '<h6>主力流入</h6>' +
            '</li>' +
            '<li>' +
            '<p class="t_green">' + dayMoney.majorFlowOut + '万</p>' +
            '<h6>主力流出</h6>' +
            '</li>' +
            '<li>' +
            '<p class="' + getClsByNumber(majorNetFlow) + '">' + Math.abs(majorNetFlow) + '万</p>' +
            '<h6>主力净流</h6>' +
            '</li>' +
            '</ul>' +
            '<ul class="box_percent">' +
            '<li>' +
            '<h6>' +
            '<span>' + totalBuy + '万</span>' +
            '<span>汇总</span>' +
            '<span>' + totalSell + '万</span>' +
            '</h6>' +
            '<dl>' +
            '<dd>' +
            '<b style=" width: ' + getPercentage(totalBuy, totalNum) + '%;"></b>' +
            '</dd>' +
            '<dd>' +
            '<b style=" width: ' + getPercentage(totalSell, totalNum) + '%;"></b>' +
            '</dd>' +
            '</dl>' +
            '</li>' +
            '<li>' +
            '<h6>' +
            '<span>' + dayMoney.hugeOrderBuy + '万</span>' +
            '<span>超大</span>' +
            '<span>' + dayMoney.hugeOrderSell + '万</span>' +
            '</h6>' +
            '<dl>' +
            '<dd>' +
            '<b style=" width: ' + getPercentage(dayMoney.hugeOrderBuy, totalHuge) + '%;"></b>' +
            '</dd>' +
            '<dd>' +
            '<b style=" width: ' + getPercentage(dayMoney.hugeOrderSell, totalHuge) + '%;"></b>' +
            '</dd>' +
            '</dl>' +
            '</li>' +
            '<li>' +
            '<h6>' +
            '<span>' + dayMoney.bigOrderBuy + '万</span>' +
            '<span>大单</span>' +
            '<span>' + dayMoney.bigOrderSell + '万</span>' +
            '</h6>' +
            '<dl>' +
            '<dd>' +
            '<b style=" width: ' + getPercentage(dayMoney.bigOrderBuy, totalBig) + '%;"></b>' +
            '</dd>' +
            '<dd>' +
            '<b style=" width: ' + getPercentage(dayMoney.bigOrderSell, totalBig) + '%;"></b>' +
            '</dd>' +
            '</dl>' +
            '</li>' +
            '<li>' +
            '<h6>' +
            '<span>' + dayMoney.mediumOrderBuy + '万</span>' +
            '<span>中单</span>' +
            '<span>' + dayMoney.mediumOrderSell + '万</span>' +
            '</h6>' +
            '<dl>' +
            '<dd>' +
            '<b style=" width: ' + getPercentage(dayMoney.mediumOrderBuy, totalMedium) + '%;"></b>' +
            '</dd>' +
            '<dd>' +
            '<b style=" width: ' + getPercentage(dayMoney.mediumOrderSell, totalMedium) + '%;"></b>' +
            '</dd>' +
            '</dl>' +
            '</li>' +
            '<li>' +
            '<h6>' +
            '<span>' + dayMoney.smallOrderBuy + '万</span>' +
            '<span>小单</span>' +
            '<span>' + dayMoney.smallOrderSell + '万</span>' +
            '</h6>' +
            '<dl>' +
            '<dd>' +
            '<b style=" width: ' + getPercentage(dayMoney.smallOrderBuy, totalSmall) + '%;"></b>' +
            '</dd>' +
            '<dd>' +
            '<b style=" width: ' + getPercentage(dayMoney.smallOrderSell, totalSmall) + '%;"></b>' +
            '</dd>' +
            '</dl>' +
            '</li>' +
            '</ul>' +
            '</div>';
    }

    // 语音
    playVoiceAnswerLite(voiceTxt)

    var temp = '';

    if (isPopup)
        temp = '<div class="mb_tab mb_tabFlow">' + tagNav + tagList + '</div>';
    else
        temp =
            '<div class="bd"><div class="mb mb_tab mb_tabFlow">' +
            tagNav + tagList + generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) +
            '</div></div>';

    if (isPopup)
        appendAnswerToPopup(temp);
    else
        appendAnswer(temp, '', result.qId);

    navClick(navId,result.answerResultType);

    if (!isPopup)
        getQuestionTabs(result);
}

/**
 * 每次进来查历史数据
 */
function getHistoryMessage() {
    //alert("查询主动推送历史数据");
    getHistory({
        userId: userId,
        clientId: clientId,
        readStatus: "0",
        cp: "1",
        ps: "5"
    }, function (result) {
        //App里带参跳转
        var question = getQueryString("question");
        var isPresetHotQuestionShow = false;
        if (question || params.stockCode) {
            isPresetHotQuestionShow = false;
        }
        if (!question && !params.stockCode) {
            isPresetHotQuestionShow = true;
        }
        //首页推荐
        getPresetQuestion(isPresetHotQuestionShow);
    });

}

/**
 * 晨间推送
 * @param result
 */
function morningPush(result) {
    if (result.length > 0) {
        sendPreAnswerContent(pushTxtResult, 'morningPush1', '', result.qId);
        var list = result;
        var tagTemp = '';
        //生成随机数，作为class名
        var hideClass = generateRandomClassName('hide');
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var tagHold = '';

            var tagOperationAdvice = '';

            if ($.inArray("2", item.securityType) != -1) {
                tagHold = '<i>持</i>';
            }

            if (i > 1)
                tagTemp += '<li class="sumUp_tech ' + hideClass + '" style="display: none">';
            else
                tagTemp += '<li class="sumUp_tech">';
            var messageContent = JSON.parse(item.messageContent);
            tagTemp +=
                // <!-- 带背景色的标题框 蓝色-->
                '<div class="box_hd2 box_hd2_blue">' +
                '<span>' + tagHold + item.stockName + item.messageTitle + '</span>' +
                '<b><i class="i_t"></i><i class="i_b"></i></b>' +
                '<em class="date">' + changeTime(item.createAt) + '</em>' +
                '</div>' +

                '<div class="box_bd2" onclick="showTotalDetail(\'' + item.marketType + '\',\'' + item.stockCode + '\',\'' + item.stockName + '\',\'' + item.predicateType + '\',\''+item.messageTitle+'\')">';
            if (item.messageDisp.length > 48) {
                tagTemp += '<h5>' + item.messageDisp.substring(0, 48) + '...' + '</h5>';
            } else {
                tagTemp += '<h5>' + item.messageDisp + '</h5>';
            }

            tagTemp += '<a></a>'
            tagTemp += '</div>' +
                '</li>';
        }

        var btnMore = '';
        if (list.length > 2) {
            var moreId = generateRandomClassName('moreId');
            btnMore =
                '<div id="' + moreId + '" class="box_load" onclick="showMoreArticle(\'' + hideClass + '\', \'' + moreId + '\')">' +
                '<a>点击加载更多</a>' +
                '</div>'
        }
        var tagBody =
            '<ul class="ul_sumUp">' +
            tagTemp +
            btnMore +
            '</ul>';

        var temp = '<div class="bd"><div class="mb">' + tagBody + '</div></div>';
        // var div = document.createElement("DIV");
        // div.innerHTML = temp;
        // document.getElementById("morningPush1").appendChild(div);
        appendAnswer(temp, 'morningPush1', result.qId);
        getQuestionTabs(result);
    }
}

/**
 * 个股综评弹框，title中包含“风险提示:”字样的，标题不显示“个股技术分析”显示“风险提示”（20180628--曹德亮）
 * @param marketType
 * @param stockCode
 * @param stockName
 * @param predicateType
 * @param status
 * @param title
 * @param source 来源 百度统计
 * @param tunnel
 */
function showTotalDetail(marketType, stockCode, stockName, predicateType, status, title, source, tunnel) {
    if (status !== 'UNLISTED') {
        var divCircle = document.createElement("DIV");
        divCircle.className = 'spinnerCircle';
        document.getElementById("bottomAnswerContainer").appendChild(divCircle);

        popTitle = title;

        if(title.indexOf("风险提示") !== -1){
            $('#bottomPopupTitle').html(title);
        }else{
            $('#bottomPopupTitle').html(predicateType);
        }

        //隐藏掉这两个版本切到语音状态时底部的大图标
        // if(appKey === 'appEzt'){
        //     if(appFrom === 'android' && (appVersion === '1.1.7' || appVersion === '1.1.8'))
        //         goWord();
        //     else if(appFrom === 'ios' && (appVersion === '1.9.8' || appVersion === '1.9.9'))
        //         goWord();
        // }

        if (useAppInput) {
            hideInputAndShowTitleCover(appFrom, true);
        }

        setTimeout("$('#bottomPopup').show();",500);

        $('.pop_BottomToTop .bg').show();
        $(".pop_BottomToTop").fadeIn();
        $(".pop_BottomToTop .box").slideDown(300);
        $('#bottomContainer').removeClass("box_hide").addClass("box_show");

        var fixParams = {
            subjectCode: stockCode ? stockCode : '000001',
            subjectType: '股票',
            subjectName: stockName,
            subjectMarket: marketType ? marketType : 'sz',
            predicateType: predicateType
        }

        // 2走node答案
        if (tunnel === 2)
            popupQuestion2(fixParams, source);
        else {
            requestFixedAnswer(fixParams, '', marketType, true, source, true);
        }

        saveLog('info', stockName+predicateType, 'showTotalDetail()', 0, 0, params);
    }
}
/**
 * 非股票类出弹框
 */
function showTotalDetailForNoStock(result) {
    var divCircle = document.createElement("DIV");
    divCircle.className = 'spinnerCircle';
    document.getElementById("bottomAnswerContainer").appendChild(divCircle);

    showPopup(predicateType);
    setAnswer(result, true);
}

/**
 * 热点推送
 * @param result
 */
function hotTopicPush(result) {
    if (result.length > 0) {
        var result = result[0];
        sendPreAnswerContent("小e有新的热点推荐给您", 'morningPush2', '', result.qId);

        var messageDisp = JSON.parse(result.messageDisp);
        var shortArr = messageDisp.shortRecommendIndustries.entries;
        var longArr = messageDisp.longRecommendIndustries.entries;

        var tagShort = '';
        var temp = '';
        if (shortArr.length > 0) {
            temp = '';
            for (var i in shortArr) {
                temp += '<li style="width: auto; float: left; padding-right: 10px;"><a>' + shortArr[i].term + '</a></li>'
            }
            if (temp)
                temp = '<ul style="padding: 10px 0">' + temp + '</ul>';
            tagShort = '';
            tagShort += "<div class='box_show box_show_btn'>";
            tagShort += "<h4 style='margin-bottom:0;'>短期市场热点</h4>";
            tagShort += "<h5>" + temp + "</h5>";
            tagShort += "</div>";
        }

        var tagLong = '';
        if (longArr.length > 0) {
            temp = '';
            for (var i in longArr) {
                temp += '<li style="width: auto; float: left; padding-right: 10px;"><a>' + longArr[i].term + '</a></li>'
            }
            if (temp)
                temp = '<ul style="padding: 10px 0">' + temp + '</ul>';
            tagLong = '';
            tagLong += "<div class='box_show box_show_btn'>";
            tagLong += "<h4 style='margin-bottom:0;'>中长期投资方向</h4>";
            tagLong += "<h5>" + temp + "</h5>";
            tagLong += "</div>";
        }

        var tagBody =
            '<div class="bd">' +
            "<div class='mb' onclick=\"freeQuestion('热点推荐')\">" +
            tagShort +
            tagLong +
            '</div>' +
            '</div>';

        // var div = document.createElement("DIV");
        // div.innerHTML = tagBody;
        // document.getElementById("morningPush2").appendChild(div);
        appendAnswer(tagBody, 'morningPush2', result.qId);
        getQuestionTabs(result);
    }

}

/**
 * 股票推送
 * @param result
 */
function stockPush(result) {
    if (result.length > 0) {

        var result = result[0];
        sendPreAnswerContent(result.messageTitle, 'morningPush3', '', result.qId);

        //解析数据
        var msgContent = JSON.parse(result.messageDisp);
        var shortTermArr, longTermArr, techTermArr;
        if (msgContent.timeType == '短期') {
            shortTermArr = msgContent.recommendStocks;
            techTermArr = msgContent.techniqueRecommendStocks;
        }
        if (msgContent.timeType == '中长期') {
            longTermArr = msgContent.recommendStocks;
        }

        var temp = '';
        var i;
        //短期专家观点
        var tagShort = '';
        if (shortTermArr && shortTermArr.length > 0) {
            temp = '';
            for (i in shortTermArr) {
                temp += '<li style="width: auto; float: left; padding-right: 10px;"><a>' + shortTermArr[i].stockName + '</a></li>'
            }
            if (temp)
                temp = '<ul style="padding: 10px 0">' + temp + '</ul>';

            tagShort += "<div class='box_show box_show_btn'>";
            tagShort += "<h4 style='margin-bottom:0;'>短期专家观点</h4>";
            tagShort += "<h5>" + temp + "</h5>";
            tagShort += "</div>";
        }

        //中长期专家观点
        var tagLong = '';
        if (longTermArr && longTermArr.length > 0) {
            temp = '';
            for (i in longTermArr) {
                temp += '<li style="width: auto; float: left; padding-right: 10px;"><a>' + longTermArr[i].stockName + '</a></li>'
            }
            if (temp)
                temp = '<ul style="padding: 10px 0">' + temp + '</ul>';
            tagLong += "<div class='box_show box_show_btn'>";
            tagLong += "<h4 style='margin-bottom:0;'>中长期投资方向</h4>";
            tagLong += "<h5>" + temp + "</h5>";
            tagLong += "</div>";
        }

        //技术选股
        var tagTech = '';
        if (techTermArr && techTermArr.length > 0) {
            temp = '';
            for (i in techTermArr) {
                temp += '<li style="width: auto; float: left; padding-right: 10px;"><a>' + techTermArr[i].stockName + '</a></li>'
            }
            if (temp)
                temp = '<ul style="padding: 10px 0">' + temp + '</ul>';

            tagTech += "<div class='box_show box_show_btn'>";
            tagTech += "<h4 style='margin-bottom:0;'>技术选股</h4>";
            tagTech += "<h5>" + temp + "</h5>";
            tagTech += "</div>";
        }

        var tagBody =
            '<div class="bd">' +
            "<div class='mb' onclick=\"freeQuestion('股票推荐')\">" +
            tagShort +
            tagLong +
            tagTech +
            '</div>' +
            '</div>';

        // var div = document.createElement("DIV");
        // div.innerHTML = tagBody;
        // document.getElementById("morningPush3").appendChild(div);
        appendAnswer(tagBody, 'morningPush3', result.qId);
        getQuestionTabs(result);
    }
}

/**
 *  新版多维度个股综评
 *  Modified by xym
 * @param result
 * @param source 来源 百度统计
 */
function stockAnalysis(result, isPopup, showInteractiveView,source) {
    if (!isPopup) {
        var type = result.answerResultType || '';
        var questionAnalyse = result.questionAnalyse ? result.questionAnalyse[0] : {};
        var stockList = questionAnalyse.entity || [];
        var totalCount = stockList.length;

        if ((type === '股票' || type === '个股综评') && totalCount > 1) {
            handleDuplicatedStock(result, stockList, totalCount);
            getDefaultTabs();
            return;
        }

        sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

        if (result.data) {
            var list = result.data.list || [];
            var property = getPropertyByEntity(result.questionAnalyse[0].entity);
            // 股票信息
            var stockBaseInfo = '<div class="stock"><div>' + property.name + '<span class="num">' + property.code + '</span></div>' +
                                '<div class="num t_red"></div>' +
                                '</div>';

            // 查找list中各元素对应的类型
            var techOrRiskIndex,
              matterIndex,
              fundValueIndex,
              financeGrateIndex,
              financialAnalysisIndex,
              insRatingIndex,
              knowledgeRightIndex,
                stockStructureIndex,
                stockEncourageIndex,
                newsIndex;
            for (var listIndex = 0; listIndex < list.length; listIndex++) {
                if(!list[listIndex])
                    continue;

                if (list[listIndex].predicateType === '个股技术分析') {
                    techOrRiskIndex = listIndex
                }
                else if (list[listIndex].predicateType === '财务指标') {
                    fundValueIndex = listIndex
                }
                else if (list[listIndex].predicateType === '财务分析') {
                    financialAnalysisIndex = listIndex
                }
                else if (list[listIndex].predicateType === '个股所属概念') {
                    matterIndex = listIndex
                }
                else if (list[listIndex].predicateType === '资金流向') {
                    financeGrateIndex = listIndex
                }
                else if (list[listIndex].predicateType === '估值评级') {
                    insRatingIndex = listIndex
                }
                else if (list[listIndex].predicateType === '知识产权') {
                    knowledgeRightIndex = listIndex
                }
                else if (list[listIndex].predicateType === '股本结构') {
                  stockStructureIndex = listIndex
                }
                else if (list[listIndex].predicateType === '股权激励') {
                  stockEncourageIndex = listIndex
                }
                else if (list[listIndex].predicateType === '个股资讯') {
                  newsIndex = listIndex
                }
            }

            //知识产权话术
            var knowledgeRightText='';
            if(knowledgeRightIndex>=0){
                if(list[knowledgeRightIndex].messageTitle === '知识产权'){
                    list[knowledgeRightIndex].messageDisp?knowledgeRightText=list[knowledgeRightIndex].messageDisp+'。':'';
                    // console.log(list[knowledgeRightIndex]);
                }
            }


            // 所属题材
            var subMatter = ''
            if (matterIndex >= 0) {
                var messageDisp = list[matterIndex].messageDisp
                var messageDispArr = strToArr(messageDisp)
                var messageDispHtml = ''
                for (var i = 0; i < messageDispArr.length; i++) {
                    if (messageDispArr[i])
                        messageDispHtml += '<b>' + messageDispArr[i] + '</b>'
                }
                subMatter = '<div class="subMatter" onclick="showTotalDetail(\'' + property.marketType + '\',\'' + property.code + '\',\'' + property.name + '\',\'' + list[matterIndex].predicateType + '\',\'' + JSON.parse(list[matterIndex].messageContent).status + '\',\'' + list[matterIndex].messageTitle + '\',\''+source+'\',2)"><a id="themes" class="shence">' + '行业概念：' + messageDispHtml + '</a></div>';
            }


            var techOrRisk = '',isRisk = false;//是否為風險提示的股票
            // 技术面
            if (techOrRiskIndex >= 0) {
                if (list[techOrRiskIndex].messageTitle === '技术面分析') {
                    techOrRisk = '<div class="technical" onclick="showTotalDetail(\'' + property.marketType + '\',\'' + property.code + '\',\'' + property.name + '\',\'' + list[techOrRiskIndex].predicateType + '\',\'' + JSON.parse(list[techOrRiskIndex].messageContent).status + '\',\'' + list[techOrRiskIndex].messageTitle + '\',\''+source+'\')">' +
                                '<a id="technical" class="shence"><div class="hd">' +
                                '<div>技术面</div>' +
                                '<div>详细<i class="icon-arrow_closed"></i></div>' +
                                '</div>' +
                                '<h5>' + list[techOrRiskIndex].messageDisp + '</h5></a>' +
                                '</div>';
                    isRisk = false;
                } else {
                    techOrRisk = '<div class="riskHints" onclick="showTotalDetail(\'' + property.marketType + '\',\'' + property.code + '\',\'' + property.name + '\',\'' + list[techOrRiskIndex].predicateType + '\',\'' + JSON.parse(list[techOrRiskIndex].messageContent).status + '\',\'' + list[techOrRiskIndex].messageTitle + '\',\''+source+'\')">' +
                        '<a class="shence" id="riskHints"><i></i>' +
                        '<h6>' + list[techOrRiskIndex].messageDisp + '</h6>' +
                        '</a></div>';
                    isRisk = true;
                }
            }

            // 资金面 + 财务面
            var financeGrate = ''; //财务面
            var capFund = '';  //资金面
            if (fundValueIndex >= 0) {
                var summaryLevel = JSON.parse(list[fundValueIndex].messageContent)[0].summaryLevel;
                switch (summaryLevel) {
                    case 1:
                        financeGrate = '优秀';
                        break;
                    case 2:
                        financeGrate = '良好';
                        break;
                    case 3:
                        financeGrate = '一般';
                        break;
                    case 4:
                        financeGrate = '较差';
                        break;
                    case 5:
                        financeGrate = '疲软';
                        break;
                    default:
                        financeGrate = '--';
                }
                var fund = JSON.parse(list[financeGrateIndex].messageContent)[5];
                var fundValue = parseFloat(fund.majorFlowIn) - parseFloat(fund.majorFlowOut);
                if (fundValue > 0) {
                    fundValue = '+' + fundValue
                }
            }
            // console.log(insRatingIndex );

            var financialScore = ''; //财务分析 分数
            if(financialAnalysisIndex >= 0)
            {
                financialScore = JSON.parse(list[financialAnalysisIndex].messageContent).summaryLevel + '分';
            }

            var capFundFinance = '',//资金面+财务面+机构面总文本
                capFundtxt = '',//资金面
                capFinancetxt= '',//财务面
                capOrganizationtxt = '';//机构面
            if(financeGrateIndex >= 0){
                capFundtxt = '<li onclick="showTotalDetail(\'' + property.marketType + '\',\'' + property.code + '\',\'' + property.name + '\',\'' + list[financeGrateIndex].predicateType + '\',\'' + JSON.parse(list[financeGrateIndex].messageContent).status + '\',\'' + list[financeGrateIndex].messageTitle + '\',\''+source+'\')">' +
                              '<a class="shence" id="fund"><h6>资金面<span>近5日</span></h6>' +
                              '<h3><span class="num">' + fundValue + '</span><em>万</em></h3>' +
                              '</a></li>';
            }
            if(fundValueIndex >= 0){
                capFinancetxt = '<li onclick="showTotalDetail(\'' + property.marketType + '\',\'' + property.code + '\',\'' + property.name + '\',\'' + '财务指标' + '\',\'' + JSON.parse(list[fundValueIndex].messageContent).status + '\',\'' + list[fundValueIndex].messageTitle + '\',\''+source+'\')">' +
                                '<a class="shence" id="finance"><h6>财务面</h6>' +
                                '<h4>' + (financialScore || financeGrate) + '</h4>' +
                                '</a></li>';
            }
            if(insRatingIndex >= 0){
                var ratingArr = JSON.parse(list[insRatingIndex].messageContent).ratingResult;
                capOrganizationtxt = '<li onclick="showTotalDetail(\'' + property.marketType + '\',\'' + property.code + '\',\'' + property.name + '\',\'' + '估值评级' + '\',\'' + JSON.parse(list[insRatingIndex].messageContent).status + '\',\'' + list[insRatingIndex].messageTitle + '\',\''+source+'\')">' +
                                    '<a class="shence" id="finance"><h6>机构面</h6>' +
                                    '<h4>' + setValueGrade_v3(ratingArr) + '</h4>' +
                                    '</a></li>';
            }

            //资金面+财务面+机构面
            if (fundValueIndex >= 0 && financeGrateIndex >= 0 && insRatingIndex >= 0){
                capFundFinance = '<ul class="capFinance cfi">'+
                    capFundtxt+
                    capFinancetxt+
                    capOrganizationtxt+ '</ul>';
            }
            //资金面+财务面
            else if (fundValueIndex >= 0 && financeGrateIndex >= 0 && insRatingIndex == undefined){
                capFundFinance = '<ul class="capFinance">'+
                    capFundtxt+
                    capFinancetxt+ '</ul>';
            }
            //资金面+机构面
            else if (fundValueIndex >= 0 && financeGrateIndex == undefined && insRatingIndex >= 0){
                capFundFinance = '<ul class="capFinance">'+
                    capFundtxt+
                    capOrganizationtxt+ '</ul>';
            }
            //资金面
            else if (fundValueIndex >= 0 && financeGrateIndex == undefined && insRatingIndex == undefined){
                capFundFinance = '<ul class="capFinance cf_capital">'+
                    capFundtxt+'</ul>';
            }
            //财务面
            else if (fundValueIndex == undefined && financeGrateIndex >= 0 && insRatingIndex == undefined){
                capFundFinance = '<ul class="capFinance cf_finance">'+
                    capFinancetxt+'</ul>';
            }
            //机构面
            else if (fundValueIndex == undefined && financeGrateIndex == undefined && insRatingIndex >= 0){
                capFundFinance = '<ul class="capFinance cf_finance">'+
                    capOrganizationtxt+ '</ul>';
            }else{
                capFundFinance = '<ul class="capFinance cfi"></ul>';
            }

            var studyStaticMsg = '';
            var studyStaticText = '';
            if (fundValueIndex >= 0) {
                var financeMessageContent = JSON.parse(list[fundValueIndex].messageContent)
                var studyStaticTextTemp1 = financeMessageContent[0].conclusion
                if(studyStaticTextTemp1) {
                    studyStaticText += studyStaticTextTemp1 + '。'
                }
            }
            if (insRatingIndex >= 0) {
                studyStaticMsg = JSON.parse(list[insRatingIndex].messageContent).ratingResult
                var studyStaticTextTemp2 = setValueGrade(studyStaticMsg)
                if (studyStaticTextTemp2) {
                    studyStaticText += studyStaticTextTemp2 + '。'
                }
            }

            //股本结构
            if(stockStructureIndex >= 0){
                var shareholderAmountList = JSON.parse(list[stockStructureIndex].messageContent).amount.shareholderAmountList;
                var lastHolder = shareholderAmountList.length > 0 ? shareholderAmountList[0] : {};

                //股东变化用
                var strAmount = '';
                if (!lastHolder) {
                    strAmount = '';
                }
                else if (lastHolder.chanOfLast > 10)
                    strAmount = '数量增加';
                else if (lastHolder.chanOfLast < -10)
                    strAmount = '数量减少';
                else
                    strAmount = '数量稳定';
                studyStaticText = '股东人数近期' + strAmount + '。' + studyStaticText
            }

            //股权激励
            if(stockEncourageIndex >= 0){
                var encourageData = JSON.parse(list[stockEncourageIndex].messageContent);
                var text = '',riskTxt = '';
                if (encourageData.length > 0) {
                    var item = encourageData[0]
                    text = timeUtil.getTimeStr2(item.pubDateTimestamp)+'公布股权激励方案，激励方式为授予' + incSubject(item.incSubject) + '，近一年公司业绩可能会有较大提升。'
                }
                if(isRisk){
                    riskTxt = '近期该股面临风险，请关注最新资讯。';
                }else{
                    riskTxt = '';
                }
                studyStaticText = knowledgeRightText+text + studyStaticText+riskTxt;
            }

            //新闻资讯//舆情关注
            var newsTxt = '';
            var mathRandom = generateRandomClassName();
            newsTxt += '<div class="PubOpinion" id="getNewsAndReportDiv'+mathRandom+'">';
            newsTxt += '</div>';
            getNewsOfStock(property.marketType, property.code, mathRandom,source,property,generateRandomClassName('news'));

            var eComment = '<div class="eComment">' +
                                '<p>小e点评</p>' +
                                '<h5>' + studyStaticText + '</h5>' +
                            '</div>';

            var host = location.host;
            var htmlUrl = 'https://stock-report.rxhui.com/html/'+property.code+'.html';
            if (host.indexOf('dev') !== -1) {
                htmlUrl = 'http://10.0.0.22:10030/report?code='+property.code;
            } else if (host.indexOf('staging') !== -1) {
                htmlUrl = 'http://reports.jinhui001.com/report?code='+property.code;
                // htmlUrl = 'http://report.jinhui001.com/html/'+property.code+'.html';
            } else if (host.indexOf('localhost') !== -1) {
                htmlUrl = 'http://10.0.0.22:10030/report?code='+property.code;
            }

            //查看获取报告
            var resREP = '';
            if (appKey !== 'appAvatar') {
                resREP=' <div class="resRep_file" onclick="openReportHtml(\''+htmlUrl+'\')">'+
                            '<a>'+
                                '<i class="icon-file"><span class="path1"></span><span class="path2"></span></i>'+
                                '<span>一键智能生成报告，查看更多</span>'+
                                '<i class="icon-arrow_closed"></i>'+
                            '</a>'+
                        '</div>';
            }

            //生成随机数，作为class名
            var boxClass = generateRandomClassName('box_comReview');
            var tagBody = '<div class="box_comReview ' + boxClass + '">' + stockBaseInfo + subMatter + techOrRisk + capFundFinance +  newsTxt + eComment + resREP +'</div>';

            var temp = '<div class="bd"><div class="mb">' + tagBody;
            temp += generateGuideQuestionList(result.guidanceQuestions);
            temp += getRatingLabel(result, showInteractiveView);
            temp += '</div></div>';
            appendAnswer(temp, '', result.qId);

            getQuestionTabs(result);

            //股票价格和涨跌幅
            var symbol = property.marketType + property.code;
            getStockPrice(symbol, setStockPrice, boxClass);

            // 取公告
            getNotice(property.marketType,property.code,mathRandom,source,property,generateRandomClassName('notice'));
        } else {
            getDefaultTabs();
        }
    }
}

function setStockPrice(rs, boxClass) {
    var newPrice = '--',
        zf = '--',
        clsColor = '';
    newPrice = rs.newPrice;
    newPrice = newPrice.toFixed(2);

    //涨幅，
    zf = rs.rise;
    zf = zf.toFixed(2);
    if (zf > 0) {
        zf = '+' + zf + '%';
        clsColor = 't_red';
    } else if (zf < 0) {
        zf = zf + '%';
        clsColor = 't_green';
    }

    var text = newPrice + '<s></s>' + zf;
    var num = $("." + boxClass).find('.stock>.num');
    // console.log(num)
    num.removeClass("t_red").removeClass("t_green").addClass(clsColor);
    num.html(text)
}

// 研报和资讯
function infoAndResearch(result, isPopup) {
    if (!isPopup)
        sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var list = result.data || [];
    if (list.length > 0) {
        var temp = "";
        temp += "<div class='bd'>";
        temp += "<div class='mb infoAndResearch'>";
        temp += "<div class='box_tl02'><h5>";
        for (var i = 0; i < list.length; i++) {
            temp += "<li><a onclick=\"showInformationDetail('" + list[i].id + "','" + result.answerResultType + "')\">" + list[i].title + "</a>";
            if (list[i].hasOwnProperty('time')) {
                temp += '<h6 class="t_gray">' + getDataGridTimeFormat(list[i].time) + '</h6>';
            }
            temp += "</li>";
        }
        temp += "</h5></div>";
        temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result);
        temp += "</div>";
        temp += "</div>";

        appendAnswer(temp, '', result.qId);
        scrollToQuestion();
        getQuestionTabs(result);
    }
}

//个股公告
function stockNotice(result,mathRandom,source,property,infoType){
    var temp = '<ul style="display: none">';
    for (var i = 0; i < 3 && i<result.data.list.length; i++)
    {
        temp += '<li>'+
                    "<a>"+
                    '<h5 onclick="showPDF(\''+result.data.list[i].annTitle+'\',\''+result.data.list[i].annUrl+'\')">' + result.data.list[i].annTitle + '</h5>'+
                    '<h6>';
        if (result.data.list[i].hasOwnProperty('pubAt'))
        {
            temp += '<span class="r num">'+ getDataGridTimeFormat(result.data.list[i].pubAt) +'</span>';
        }
        temp += '</h6></a></li>';
    }
    temp +='</ul>';
    $('#getNewsAndReportDiv'+mathRandom).append(temp);
    $('#li'+mathRandom).show();
}

// 研报和资讯
//综评类  显示3条
function infoAndResearch_v3(result,mathRandom,source,property,infoType) {
    var messageContent = result.data || {};
    var temp = "";
    if (messageContent.list.length > 0)
    {
        var newList = uniqueNews(messageContent.list)
        if(newList.length > 3)
        {
          var question = property.name + '最新资讯';
          var showNum = 5;
          var tabRandomId = generateRandomClassName('tab');
            temp +='<div class="TAB2">'+
                        '<ul id="'+tabRandomId+'">'+
                            '<li class="on">'+
                                '<span onclick="newsTabClick(event,\''+mathRandom+'\')">新闻<b></b></span>'+
                                '<a onclick="getNewsAndReport(\''+property.code+ '\',\'' + property.name + '\',\'' + property.marketType + '\',\'' + mathRandom + '\',\'' + showNum + '\',\'' + source + '\',\'' + question + '\')">更多<i class="icon-arrow_closed"></i></a>'+
                            '</li>'+
                            '<li id="li'+mathRandom+'" style="display: none">'+
                                '<span onclick="noticeTabClick(event,\''+mathRandom+'\')">公告<b></b></span>'+
                                '<a onclick="freeQuestion(\''+property.name.replace(/\s/g,'')+'最新公告'+'\')">更多<i class="icon-arrow_closed"></i></a>'+
                            '</li>'+
                        '</ul>'+
                        '<div class="bottom"></div>'+
                    '</div>';
            temp += '<ul>';
            for (var i = 0; i < 3; i++)
            {
                temp += '<li>'+
                        "<a onclick=\"showInformationDetail('" + newList[i].id + "','资讯搜索')\">"+
                        '<h5>' + newList[i].title + '</h5>'+
                        '<h6>';
                if (newList[i].hasOwnProperty('mediaFrom'))
                {
                    if(newList[i].mediaFrom.length>0){
                        temp += '<span class="l">来源：' + newList[i].mediaFrom + '</span>';
                    }else{
                        temp += '<span class="l">来源：--</span>';
                    }
                }
                if (newList[i].hasOwnProperty('publishAt'))
                {
                    temp += '<span class="r num">'+ getDataGridTimeFormat(newList[i].publishAt) +'</span>';
                }
                temp += '</h6></a></li>';
            }
        }
        else
          {
            temp +='<p>舆情关注</p>';
            temp += '<ul>';
            for (var i = 0; i < newList.length; i++){
                temp += '<li>'+
                            "<a onclick=\"showInformationDetail('" + newList[i].id + "','资讯搜索')\">"+
                            '<h5>' + newList[i].title + '</h5>'+
                            '<h6>';
                if (newList[i].hasOwnProperty('mediaFrom'))
                {
                  if(newList[i].mediaFrom.length>0){
                    temp += '<span class="l">来源：' + newList[i].mediaFrom + '</span>';
                  }else{
                    temp += '<span class="l">来源：--</span>';
                  }
                }
                if (newList[i].hasOwnProperty('publishAt')) {
                    temp += '<span class="r num">'+ getDataGridTimeFormat(newList[i].publishAt) +'</span>';
                }
                temp += '</h6></a></li>';
            }
        }
        temp +='</ul>';
    }else{
        temp +='<p>舆情关注</p>';
        temp += '<ul><li><h5>该股暂无资讯</li></h5></ul>';
    }

    var len = $('#getNewsAndReportDiv'+mathRandom).children().length;
    $('#getNewsAndReportDiv'+mathRandom).prepend(temp);
    if(len>0)
        $('#li'+mathRandom).show();

    return temp;
}

/**
 * 资讯去重-因后端返回数据有重复
 * @param arr
 * @return {*}
 */
function uniqueNews(arr) {
    for(var i=0; i<arr.length; i++){
        for(var j=i+1; j<arr.length; j++){
            if(arr[i].title === arr[j].title){         //第一个等同于第二个，splice方法删除第二个
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
}

// 新闻tab点击
function newsTabClick(event, mathRandom) {
    var ep = $(event.currentTarget).parent();
    if(!ep.hasClass('on')){
        ep.attr('class', 'on');
        ep.siblings().attr('class', '');
        var eul = $('#getNewsAndReportDiv'+mathRandom+' > ul');
        eul.eq(0).show();
        eul.eq(1).hide();
    }
}
// 公告tab点击
function noticeTabClick(event, mathRandom) {
    var ep = $(event.currentTarget).parent();
    if(!ep.hasClass('on')){
        ep.attr('class', 'on');
        ep.siblings().attr('class', '');
        var eul = $('#getNewsAndReportDiv'+mathRandom+' > ul');
        eul.eq(0).hide();
        eul.eq(1).show();
    }
}

/**
 * 点全部时查询详情
 * @param preAnswerContent
 * @param id  数据源
 * @param type  个性化首页资讯  传参 homePage;  其他来源传参 空
 * @param indexId  个性化首页资讯  传参 indexId
 */

function showInformationDetail(id, preAnswerContent,type,indexId) {
    var divCircle = document.createElement("DIV");
    divCircle.className = 'spinnerCircle';
    document.getElementById("bottomAnswerContainer").appendChild(divCircle);

    showPopup(preAnswerContent + "详情");

    if(type === "homePage"){
        popupQuestionForHomepage(id, indexId);
    }else{
        popupQuestionForInfoAndRe(id, preAnswerContent);
    }

    baiduTrackEvent('查看详情','click',preAnswerContent+'点击');//百度统计
}

/**
 * 条件选股
 * @param result
 * @param isPopup 是否在弹窗中展示
 * @param showInteractiveView 是否展示与原生交互部分
 */
function pickStockByCondition(result, isPopup, showInteractiveView) {
    if(!isPopup)
        sendPreAnswerContent(result.preAnswerContent || result.data.content.preAnswerContent, '', '', result.qId);

    // 兼容推送的数据格式
    result.data = result.data.content || result.data;

    //无答案
    // if(result.data && !result.data.hasOwnProperty('stocks')){
        // var noAnswer =
        //     '<div class="bd"><div class="mb">'+
        //         '<div class="box_condition">'+
        //             '<h5 class="box_L">选股条件：</h5>'+
        //             '<div class="box_R">'+
        //                 // '<b>MACD</b><b>KDJ</b><b>X日主力资金</b><b>KDJKDJKDJKKDJKDJKDJK</b><b>X日主力资金</b><b>MACD</b><b>KDJ</b>'+
        //             '</div>'+
        //         '</div>'+
        //         '<div class="box_condition">'+
        //             '<h5>筛选结果(0)</h5>'+
        //         '</div>'+
        //         '<div style="padding: 20px;text-align: center;">没有找到符合您条件的股票</div>'+
        //         '<div class="bd bd_reScreen" style="text-align: center; padding-left: 0">' +
        //             '<a onclick="openStockConditionPage()">重新筛选</a>' +
        //         '</div>'+
        //     '</div></div>'
        // appendAnswer(noAnswer);
        // scrollToBodyEnd();
        // return;
    // }

    //有答案
    var tagStockCol = '', //股票名称列
        labelConditions = '', //当前筛选条件展示
        tagConditionCol = '', //筛选条件列
        arrConditions = []; //筛选条件li数组

    var showExtraTitle = false;
    var colCount = 0; //要展示的列数
    //筛选条件
    var conditions = result.data.conditions || [];
    //计算筛选条件的数量，及提取出条件名称来
    conditions.forEach(function (item, index) {
        if(item.length>14)
            labelConditions += '<b onclick="showPopupMsg(\''+item+'\')">'+truncateString(item, 14)+'</b>';
        else
            labelConditions += '<b>'+item+'</b>';
        // //如果存在此条件，则标题需要展示额外的说明
        if(item.indexOf('日主力资金') !== -1 || item.indexOf('连涨') !== -1 || item.indexOf('连跌') !== -1 || item.indexOf('新高') !== -1 )
            showExtraTitle = true;
    });

    var totalCount = result.data.totalCount || 0;
    // 根据返回的第一条记录中的conditionValue中的条件来确定展示多少例，需过滤掉不展示的列
    var conditionValue = 0;
    if(totalCount > 0) {
        conditionValue = result.data.stocks[0].conditionValue;
        for(var t=0; t<conditionValue.length; t++)
        {
            // console.log(conditionValue[t])
            for (var conditionName in conditionValue[t]) {
                if(conditionName !== '涨跌幅' && conditionName !== '股价' && conditionName.indexOf('现价') === -1)
                {
                    arrConditions.push('');
                    colCount++;
                }
            }
        }
    }

    //如果只有两列，那么需要加此样式
    var extraCls = '';
    if (colCount === 0)
        extraCls = 'ul_1';

    //主列表循环
    var len = result.data.stocks ? result.data.stocks.length : 0;
    var tagPrice = ''; //最新价列标签
    var newPrice = '',
        raise = '';
    var item;
    var stockName = '';
    var maxColLen = 0;
    for(var i=0; (isPopup ? true : i<5) && i<len; i++)
    {
        item = result.data.stocks[i];

        //如未传股票名称那么从行情数据中取
        if(item.stockName)
            stockName = item.stockName;
        else
            stockName = item.quotation ? item.quotation.name : '';

        //股票列，弹窗中的股票名称不可点击
        if(isPopup)
            tagStockCol += '<li>';
        else
            tagStockCol += '<li onclick="stockFixQuestion(\'' + item.stockCode + '\', \'' + stockName + '\', \'' + item.marketType + '\',\''+'个股综评'+'\')"">';
        tagStockCol +=
                                '<p>'+stockName+'</p>'+
                                '<h6>'+item.stockCode+'</h6>'+
                            '</li>';

        //最新价
        newPrice = (item.quotation.newprice/10000).toFixed(2);
        raise = (item.quotation.raise/10000).toFixed(2);

        if (isNaN(newPrice))
            newPrice = '--';

        if (isNaN(raise))
            raise = '--';

        var cls = 't_gray';
        if(raise > 0)
            cls = 't_red';
        else if(raise < 0)
            cls = 't_green';

        //停牌股判断
        if(item.quotation.isStop === 1){
            cls = 't_gray';
            raise = '停牌';
        }

        tagPrice += '<li class="'+cls+'">'+
                            '<p>'+newPrice+'</p>'+
                            '<h6>'+raise+(isNaN(raise) ? '' : '%')+'</h6>'+
                        '</li>';

        //最多的列一般在第一条
        maxColLen = result.data.stocks[0].conditionValue.length;
        var cLen = Math.max(maxColLen, item.conditionValue.length);
        //其他列，只拼li部分
        for(var j=0; j<cLen; j++)
        {
            var condition;
            if(j >= item.conditionValue.length){
                arrConditions[j] += '<li>--</li>';
                continue;
            }else{
                condition = item.conditionValue[j]
            }

            //条件是个object
            for(var type in condition)
            {
                //此两列不展示
                if(type === '涨跌幅' || type === '股价')
                    continue;

                var colValue = condition[type];
                var unit = ''; //单位
                var extraType = '';

                // 股东人数列的标题格式是  股东人数-2019 Q1，需特殊处理
                if(type.indexOf('股东人数') !== -1) {
                    extraType = type.split('#')[0];
                    type = type.split('#')[1];
                }

                //只第一条拼列标题
                if(i === 0){
                    arrConditions[j] = '<li>'+type+unit+'</li>';
                }

                if(type === '股份数量')
                    colValue /= 10e3;

                //列的值
                if(type === '公告日期')
                    colValue = getTimeStr(colValue);
                //格式化数字列，某些列不处理
                else if(!isNaN(colValue) && extraType !== '股东人数' && type !== '连涨天数' && type !== '连跌天数' && type !== '每股现金流' && type !== '每股净资产' && type.indexOf('天数') === -1 && type.indexOf('评分') === -1 && type.indexOf('得分') === -1 && type.indexOf('列入时间') === -1)
                    colValue = formatNumber(colValue);

                //某些列的值加上单位
                if(type === '质押比例' || type === '质押占总股本比例' || type === '累计涨跌幅')
                    colValue += '%';
                else if(type === '预警线估值' || type === '平仓线估值' || type === '每股净资产')
                    colValue += '元';

                //拼条件
                if(!isPopup && type === '所属热点') {
                    arrConditions[j] += '<li onclick="getRelatedReason(\''+item.stockCode+'\',\''+stockName+'\',\''+item.marketType+'\',\''+colValue+'\')"><div class="box_display">'+colValue+'<span class="t_gray">[关联原因]</span></div></li>';
                }
                else if (extraType === '股东人数') {
                    colValue = colValue.split('#');
                    var pcls = getClsByNumber(colValue[1]);
                    var num = !isNaN(colValue[0])?(colValue[0]+'户'):'--';
                    var per = !isNaN(colValue[1])?parseFloat(colValue[1]).toFixed(2)+'%':'--';
                    arrConditions[j] += '<li><div class="box_display">'+num+'<span class="'+pcls+'">'+per+'</span></div></li>';
                }
                else if (type.indexOf('净利润') !== -1 && colValue.indexOf('～') !== -1) {
                    colValue = colValue.split('～');
                    arrConditions[j] += '<li><div class="box_display">'+colValue[0]+'～<span>'+colValue[1]+'</span></div></li>';
                }
                else {
                    arrConditions[j] += '<li>'+colValue+'</li>';
                }
            }
        }
    }

    //包装其他列的条件
    for(i=0; i<arrConditions.length; i++)
    {
        if(arrConditions[i].length > 0)
            tagConditionCol += '<ul class="'+extraCls+'">'+arrConditions[i]+'</ul>';
    }

    //随机ID
    var conditionsId = generateRandomClassName('conditionsId');
    var keepConditionsId = generateRandomClassName('keepConditionsId');
    var moreId = generateRandomClassName('moreId');

    //以下项在弹窗中不展示
    var tagKeepPick = ''; //继续筛选
    var tagMore = ''; //查看更多
    var txtKeepPick = '继续筛选';
    if(!isPopup)
    {
        var showKeepPick = true;
        if((appKey === 'appEzt' && appFrom === 'android' && checkVersion('1.3.8', appVersion))
            || (appKey === 'appEzt' && appFrom === 'ios' && checkVersion('1.9.20', appVersion))
            || appKey === 'appTopC' || appKey === 'webPage'){
            txtKeepPick = '重新筛选';
            showKeepPick = false;
        }

        tagKeepPick = '<div class="box_condition">'+
                        '<h5>筛选结果('+totalCount+')</h5>'+
                        (showKeepPick ? ('<a id="'+keepConditionsId+'" class="a_condition" onclick="showConditionBox(\''+(result.data.conditions?result.data.conditions.join('，'):'')+'\',\''+showInteractiveView+'\')"><span>'+txtKeepPick+'</span><i class="icon-screen"></i></a>') : '')+
                    '</div>';

        if(len > 5)
            tagMore = '<div id="'+moreId+'" class="box_load box_conStock_more">'+
                                '<a>查看更多</a>'+
                            '</div>';
    }

    //交易时间
    var timeStr = '';
    if (result.data.updateAt) {
        if(isInTradeTime(result.data.updateAt))
            timeStr = '更新于'+changeTimeForMin(result.data.updateAt);
            // timeStr = '更新于'+changeTimeForHour(result.data.updateAt);
        else
            timeStr = '更新于'+changeTimeForMin(result.data.updateAt);
            // timeStr = '更新于'+timeChange(result.data.updateAt);
    }

    //X日资金时展示
    if(showExtraTitle)
        timeStr += '，股票停牌不计入数据统计';

    //是否展示箭头
    var tagArrow = '';
    if(colCount > 1)
        tagArrow = '<i class="icon-arrow_shape_left"></i>';

    var tagList = '';
    if( totalCount > 0) {
        tagList =
            // <!-- 表格 -->
            '<div class="box_conStock">'+
                tagArrow+
                '<div class="conStock_hd">'+
                    '<ul>'+
                        '<li>股票名称</li>'+
                            tagStockCol+
                    '</ul>'+
                '</div>'+
                '<div class="conStock" style="overflow-x: '+(colCount>1?"scroll":"hidden")+'">'+
                    '<div class="box">'+
                        '<ul class="num '+extraCls+'">'+
                            '<li>最新价</li>'+
                            tagPrice+
                        '</ul>'+
                        tagConditionCol+
                    '</div>'+
                '</div>'+
            '</div>'+

            // <!--加载更多-->
            tagMore;
    } else {
        var kp = '';
        if (appKey === 'appEzt' || appKey === 'appTopC' || appKey === 'webPage') {
            kp = '<a onclick="openStockConditionPage()">重新筛选</a>'
        } else {
            // kp = '<a onclick="showConditionBox(\''+result.data.conditions.join('，')+'\',\''+showInteractiveView+'\')">重新筛选</a>'
        }

        // 无数据
        tagList =
                '<div style="padding: 20px;text-align: center;">没有找到符合条件的股票，换个条件试试？</div>'+
                '<div class="bd bd_reScreen" style="text-align: center; padding-left: 0">' +
                    kp +
                '</div>'
    }

    // 推送热点筛选话术
    var analysisText = result.data.analysisText || '';
    if (analysisText) {
        analysisText = analysisText.replace(/<b>/g, '');
    }

    //主标签
    var tagBody =
        '<h5>'+analysisText+'</h5>'+
        '<h6 class="dateBox">'+timeStr+'</h6>'+
        '<div class="box_condition">'+
            '<h5 class="box_L">选股条件：</h5>'+
            '<div id="'+conditionsId+'" class="box_R">'+
                labelConditions+
            '</div>'+
        '</div>'+
        tagKeepPick+
        tagList;

    //2种展示情况
    var temp = '';
    if(isPopup) {
        temp += tagBody;
    }
    else {
        var focus = result.data.focus || [];
        var tagFocus = '';
        if (focus.length > 0) {
            var randomNum = generateRandomClassName('filter');
            tagFocus =
                '<ul class="tlBox_link clear_appraisal_mb">'+
                    '<li onclick="focusClick(\''+focus[0].baseName+'\')">'+focus[0].label+'</li>'+
                    '<li id="'+randomNum+'" focusName="'+focus[0].baseName+'" selectedOptions="" onclick="showFilterPopup(\'popStockFilter\',\''+randomNum+'\')">个股偏好筛选</li>'+
                '</ul>';
        }
        temp += "<div class='bd'><div class='mb'>"+tagBody+tagFocus+getRatingLabel(result, showInteractiveView)+"</div></div>";
    }


    //追加答案到页面
    if(isPopup){
        appendAnswerToPopup(temp);
    }
    else{
        appendAnswer(temp, '', result.qId);
        if (totalCount > 0 && !result.data.focus) {
            if (appKey === 'appEzt' || appKey === 'appTopC' || appKey === 'webPage') {
                var extra = '<div class="bd bd_reScreen">' +
                                '<a onclick="openStockConditionPage()">重新筛选</a><a onclick="openStockConditionPage(\''+(result.data.conditions.join(','))+'\')">添加条件</a>' +
                            '</div>';
                sendPreAnswerContent('试试添加其他条件选股', null, extra, result.qId);
            }
        }

        //继续筛选点击
        $('#'+keepConditionsId).click(function () {
            if(appKey === 'appEzt' || appKey === 'appTopC'){

            }else{
                $('#txaConditions').html(result.data.conditions.join('，'));
                $('#pickStockConditionBox').show();
            }
        });

        //点击查看更多，弹窗
        $('#'+moreId).click(function () {
            hideInputAndShowTitleCover(appFrom, true);
            showPopup('更多筛选结果');
            //加载自己
            pickStockByCondition(result, true);
        })
    }
    getQuestionTabs(result);
}

/**
 * 筹码分布
 * @param result
 * @param showInteractiveView
 */
function distributionOfChips(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var symbol = getSymbolByEntity(result.questionAnalyse[0].entity, true);
    var stockName = getPropertyByEntity(result.questionAnalyse[0].entity, true);

    var mathRandom = generateRandomClassName('');
    var chipsChart = newKlineCYQ.getTarget_CYQ_FS(mathRandom);
    var temp = '<div class="bd"><div class="mb">' + chipsChart + generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) + '</div></div>';

    appendAnswer(temp, '', result.qId);
    //初始化图表
    newKlineCYQ.init(symbol, stockName.code, stockName.name, 'v', mathRandom, useAppNativeView);
    getQuestionTabs(result);
}

/**
 * 打开筹码分布横屏，调用原生
 * @param symbol
 * @param stockName
 */
function chipsFullscreen(symbol, stockName) {
    var url = location.protocol + '//' + location.host + '/distOfChips?platform=' + appFrom + '&t=' + new Date().getTime() + '&stockCode=' + symbol + '&stockName=' + stockName;
    console.log(url);
    if (appFrom === 'android' || appFrom === 'ios') {
        var params = {
            pageId: 'webView',
            screenOrientation: 'landscape',
            url: url,
            hasActionBar: 'false'
        };
        //ios多传一个参数
        if (appFrom === 'ios'){
            params.navigationStyle = 'HsNavigationStatusNone';
            if(appKey === 'appTopC')
                params.NaviBarHidden = 'true';
        }
        commonCallback('routerNative', JSON.stringify(params));
    }
}

//调用移动端打开浏览器查看综评研报html页面
function openReportHtml(htmlUrl){
    var t = new Date().getTime();
    var url = htmlUrl + (htmlUrl.indexOf('?')!==-1?'&':'?') + 'showCloseBtn=true&t=' + t;
    if (appFrom === 'android' || appFrom === 'ios') {
        if (appKey === 'appHcVtm') {
            postMessageToOutside({openUrl: htmlUrl});
        } else {
            var params = {
                pageId: 'webView',
                url: url,
                animationStyle: 'kHsPageAnimationFromTop',
                screenCanZoom: true, //页面是否可以缩放
                // title: '研报详情',
                hasActionBar: 'false'
            };

            var openReportInApp = getConfigByApp(appKey, appVersion, 'openReportInApp');
            if(openReportInApp){
                if(appFrom === 'ios')
                    params.navigationStyle = 'HsNavigationStatusNone';
                commonCallback('routerNative', JSON.stringify(params));
            }else {
                if(htmlOutBrowserSupport){
                    commonCallback('openExternalBrowser', JSON.stringify(url));
                }
            }
        }
    } else {
        //H5打开
        if(appKey === 'webPage' || getQueryString("platform")==null){
            window.open(url, '_black');
        }else{
            var word = '需要您将APP升级到最新版本';
            sendPreAnswerContent(word);
            scrollToBodyEnd();
        }
    }
    // if(htmlOutBrowserSupport){
    //     commonCallback('openExternalBrowser', JSON.stringify(htmlUrl));
    // }else{
    //     if(getQueryString("platform")==null){
    //         window.open(htmlUrl);
    //     }else{
    //         var word = '需要您将APP升级到最新版本';
    //         sendPreAnswerContent(word);
    //         scrollToBodyEnd();
    //     }
    //
    // }
    baiduTrackEvent('生成报告点击','click','生成报告点击');
}


/**
 * 十大（流通）股东
 * @param result
 * @param showInteractiveView
 */
function top10StockHolder(result, showInteractiveView) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);

    var tagBody = generateStockHolder(result.data.tenShareholderList, result.data.tenFloatShareholderSList);
    var temp = '<div class="bd"><div class="mb">' + tagBody + generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) + '</div></div>';

    //追加答案到dom
    appendAnswer(temp, '', result.qId);
    //固定问题按钮
    getQuestionTabs(result);
    scrollToQuestion();
}

//十大股东共用部分
function generateStockHolder(holderList, floatHolderList) {
    //十大股东
    var tenShareholderList = holderList;
    var tagTenHolder = '';
    tenShareholderList.forEach(function (item, index) {
        tagTenHolder +=
            '<ul>' +
            '<li><h5>' + item.shldName + '</h5></li>' +
            '<li>' + item.hldPercent.toFixed(2) + '%</li>' +
            '<li>' + (item.chanOfLast === 0 ? '未变' : (item.chanOfLast / 10e3).toFixed(2)) + '<b class="' + getHolderClsByType(item.chanOfLastType).class + '">' + getHolderClsByType(item.chanOfLastType).name + '</b></li>' +
            '</ul>';
    });

    //十大流通股东
    var tenFloatShareholderSList = floatHolderList;
    var tagTenFloatHolder = '';
    tenFloatShareholderSList.forEach(function (item, index) {
        tagTenFloatHolder +=
            '<ul>' +
            '<li><h5>' + item.shldName + '</h5></li>' +
            '<li>' + item.hldPercent.toFixed(2) + '%</li>' +
            '<li>' + (item.chanOfLast === 0 ? '未变' : (item.chanOfLast / 10e3).toFixed(2)) + '<b class="' + getHolderClsByType(item.chanOfLastType).class + '">' + getHolderClsByType(item.chanOfLastType).name + '</b></li>' +
            '</ul>'
    });

    var tagBody =
        '<div class="tab_shareholdersTop">'+
            '<nav onclick="stockHolderTabClick(event)">'+
                '<a class="on">十大股东<b></b></a>'+
                '<a>十大流通股东<b></b></a>'+
            '</nav>'+
            // <!-- 十大股东 -->
            '<div class="nav_con show">'+
                '<div class="box_show_ol2 lBox_shareholders">'+
                    '<ol>'+
                        '<li>股东</li>'+
                        '<li>占比</li>'+
                        '<li>变动(万股)</li>'+
                    '</ol>'+
                    tagTenHolder+
                '</div>'+
            '</div>'+
            // <!-- 十大流通股东 -->
            '<div class="nav_con">'+
                '<div class="box_show_ol2 lBox_shareholders">'+
                    '<ol>'+
                        '<li>股东</li>'+
                        '<li>占比</li>'+
                        '<li>变动(万股)</li>'+
                    '</ol>'+
                    tagTenFloatHolder+
                '</div>'+
            '</div>'+
        '</div>';

    return tagBody;
}

//点击tab切换事件
function stockHolderTabClick(event) {
    // console.log(event)
    var target = event.target;
    $(target).addClass("on").siblings().removeClass("on");
    var index = $(target).index();
    $(target).parent().siblings().each(function () {
        $(this).removeClass("show");
    });
    $(target).parent().siblings().eq(index).addClass("show");
}

/**
 * 股东人数变化
 * @param result
 * @param showInteractiveView
 */
function stockHolderNumChange(result, showInteractiveView) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);

    var shareholderAmountList = result.data.shareholderAmountList;
    var lastItem = shareholderAmountList[0];
    var chartId = generateRandomClassName('chart');

    var date = '';
    try {
        if (lastItem.endDateTimestamp) {
            date = new Date(lastItem.endDateTimestamp).Format('yyyy年MM月dd日');
        } else {
            date = generateDate(lastItem.endDate);
        }
    } catch (e) {
    }

    var summary = '截止到'+date+'，股东人数'+lastItem.shldAmount.toFixed(0)+'户，较上期'+(lastItem.chanOfLast>0?"增加":"减少")+Math.abs(lastItem.chanOfLast).toFixed(2)+'%，前十大股东占比'+result.data.tenHoldPercent+'%。';

    // 语音
    playVoiceAnswerLite(summary);

    var tagBody =
        '<div class="box_shareholders">'+
            '<h6>'+summary+'</h6>'+
        '</div>'+
        '<div class="box_chart_shareholders">'+
            '<div class="txt">'+
                '<span>单位：户</span>'+
                '<span>单位：元</span>'+
            '</div>'+
            // <!-- 图表 -->
            '<div id="'+chartId+'" class="box_chart01"></div>'+
        '</div>';

    var temp = '<div class="bd"><div class="mb">' + tagBody + generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) + '</div></div>';

    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
    new LineColumnChart(chartId, shareholderAmountList.reverse());
}

/**
 * 股本结构 + 底部详情弹窗
 * @param result
 * @param isPopup 是否在弹窗中展示
 * @param showInteractiveView
 */
function capitalStructure(result, isPopup, showInteractiveView) {
    if (!isPopup) {
        var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
        sendPreAnswerContent(word, '', '', result.qId);
    }
    //提取出要用的变量
    var shareStructure = result.data.shareStru ? result.data.shareStru : {};
    var shareholderAmountList = result.data.amount.shareholderAmountList;
    var lastHolder = shareholderAmountList.length > 0 ? shareholderAmountList[0] : {};
    var calendarList = result.data.calendarList;
    var latestCalendar = calendarList.length > 0 ? calendarList[0] : {};

    var tagBody = '';
    var detailId = generateRandomClassName('detail');

    //股东变化用
    var strAmount = '';
    if (!lastHolder) {
        strAmount = '';
    }
    else if (lastHolder.chanOfLast > 10)
        strAmount = '数量增加';
    else if (lastHolder.chanOfLast < -10)
        strAmount = '数量减少';
    else
        strAmount = '数量稳定';

    //解禁股用
    var tagCalendar = '';
    var clsLatestCalendar = 'none'; //若一个月内有解禁信息，则打上“近期大量解禁”标签
    if (latestCalendar && (latestCalendar.listDateTimestamp - new Date().getTime() < 30 * 24 * 3600 * 1000))
        clsLatestCalendar = '';

    var chartId = generateRandomClassName('chart');

    var totShare = fixed2(shareStructure.totShare/10e3);
    var floatShare = fixed2(shareStructure.floatShare/10e3);

    var stockName = '';
    try {
        stockName = getPropertyByEntity(result.questionAnalyse[0].entity).name;
    } catch (e) {
    }

    // 语音
    playVoiceAnswerLite(stockName+'总股本'+totShare+'亿股，流通股本'+floatShare+'亿股。');

    if (isPopup) {
        //弹窗中展示
        tagBody +=
            '<ul class="box_txt_factor">'+
                '<li>'+
                    '<h3>'+totShare+'<span>亿股</span></h3>'+
                    '<h6>总股本</h6>'+
                '</li>'+
                '<li>'+
                    '<h3>'+floatShare+'<span>亿股</span></h3>'+
                    '<h6>流通股本</h6>'+
                '</li>'+
                '<li>'+
                    '<h3>'+(shareStructure.comType?shareStructure.comType.replace('企业', ''):'--')+'</h3>'+
                    '<h6>企业性质</h6>'+
                '</li>'+
            '</ul>';

        tagBody +=
            '<div class="box_shareholders">'+
                '<div class="sh_hd">股东人数：<b>'+strAmount+'</b></div>'+
                '<h6>截止到'+generateDate(lastHolder.endDate)+'，股东人数'+(lastHolder.shldAmount?lastHolder.shldAmount:'--')+'户，较上期'+(lastHolder.chanOfLast>0?"增加":"减少")+(lastHolder.chanOfLast?fixed2(Math.abs(lastHolder.chanOfLast)):'')+'%，前十大股东持股占比'+(result.data.amount.tenHoldPercent?result.data.amount.tenHoldPercent:'--')+'%</h6>'+
            '</div>';

        tagBody +=
            // <!-- 图表 -->
            '<div class="box_chart_shareholders">'+
                '<div class="txt">'+
                    '<span>单位：户</span>'+
                    '<span>单位：元</span>'+
                '</div>'+
                '<div id="'+chartId+'" class="box_chart01"></div>'+
            '</div>';

        tagBody +=
            '<div>'+
                generateStockHolder(result.data.ten.tenShareholderList, result.data.ten.tenFloatShareholderSList)
            +'</div>';

        //解禁列表
        calendarList.forEach(function (item, index) {
            tagCalendar +=
                '<li>'+
                    '<dt>'+
                        '<b></b>'+
                        '<s><i></i></s>'+
                    '</dt>'+
                    '<dd>'+
                        '<div class="space_between">'+
                            '<span class="date">'+generateDate(item.listDate)+'</span>'+
                            '<span>'+formatNumber(item.listAmount*10e3, '', false)+'股</span>'+
                        '</div>'+
                    '</dd>'+
                '</li>';
        });

        // 限售股解禁
        if (calendarList.length > 0) {
            tagBody +=
                '<div class="box_shareholders box_lifted">'+
                    '<div class="sh_hd">限售股解禁<b style="display: '+clsLatestCalendar+'">近期大量解禁</b></div>'+
                    '<div class="box_timeLine box_timeLine_factor">'+
                        '<div class="timeLine">'+
                            '<ul>'+
                                tagCalendar+
                            '</ul>'+
                        '</div>'+
                    '</div>'+
                '</div>';
        }
    } else {
        //非弹窗展示
        var strLimitedStock = '';
        if (calendarList.length > 0)
            strLimitedStock = '；' + generateDate(latestCalendar.listDate) + '将解禁' + formatNumber(latestCalendar.listAmount * 10e3, '', false) + '股，占总股本的' + (latestCalendar.listAmount / shareStructure.totShare * 100).toFixed(2) + '%';

        tagBody =
            '<div class="capStr">'+
                '<div class="box_bBlue box_capStr">'+
                    '<h5>股东人数近期'+strAmount+strLimitedStock+'</h5>'+
                    '<i id="'+detailId+'" class="icon-arrow_closed"></i>'+
                '</div>'+

                '<div class="box_show_ol box_show_ol2 lBox_capStr">'+
                    '<ul>'+
                        '<li>总股本</li>'+
                        '<li>'+fixed2(shareStructure.totShare/10e3)+'亿股</li>'+
                    '</ul>'+
                    '<ul>'+
                        '<li>流通股本</li>'+
                        '<li>'+fixed2(shareStructure.floatShare/10e3)+'亿股</li>'+
                    '</ul>'+
                    '<ul>'+
                        '<li>企业性质</li>'+
                        '<li>'+(shareStructure.comType?shareStructure.comType:'--')+'</li>'+
                    '</ul>'+
                    '<ul>'+
                        '<li>股东人数</li>'+
                        '<li>'+
                            '<h5>'+(lastHolder.shldAmount?lastHolder.shldAmount:'--')+'户</h5>'+
                            '<h6>较上期'+(lastHolder.chanOfLast>0?"增加":"减少")+(lastHolder.chanOfLast?Math.abs(lastHolder.chanOfLast).toFixed(2):'')+'%</h6>'+
                        '</li>'+
                    '</ul>'+
                    '<ul>'+
                        '<li>限售股解禁</li>'+
                        '<li>'+
                            '<h5>'+formatNumber(latestCalendar.listAmount*10e3, '', false)+'股</h5>'+
                            '<h6>'+generateDate(latestCalendar.listDate)+'解禁</h6>'+
                        '</li>'+
                    '</ul>'+
                '</div>'+
            '</div>';
    }

    if (isPopup) {
        appendAnswerToPopup(tagBody);
        showPopup('股本结构');
        new LineColumnChart(chartId, deepCopy(shareholderAmountList).reverse());
    } else {
        var temp = '<div class="bd"><div class="mb">' + tagBody + generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) + '</div></div>';
        appendAnswer(temp, '', result.qId);
        getQuestionTabs(result);

        //更多箭头点击，打开详情弹窗
        $('#' + detailId).click(function () {
            capitalStructure(result, true, false);
        })
    }
}


/**
 * 展示更多公告
 * @param {*} moreId
 * @param {*} className
 * @param {*} secCode
 * @param {*} marType
 * @param {*} cp
 */
function moreRiskNotices(moreId, className, secCode, marType, cp) {
    var cp = cp - 0 + 1;
    var data = {
        secCode: secCode,
        marType: marType,
        cp: cp
    }
    $(".spinner2").show();
    getMoreRiskNotices(data, function (result) {
        var data = result.data;
        var hasNextPage = data.hasNextPage;
        var riskNotices = data.riskNotices;
        var tagBody = '';
        $(".spinner2").hide();
        riskNotices.forEach(function(item,index){
            tagBody+=
            '<li onclick="showPDF(\''+item.annTitle+'\',\''+item.annUrl+'\')">'+
                '<dt>'+
                    '<b></b>'+
                    '<s><i></i></s>'+
                '</dt>'+
                '<dd>'+
                    '<div class="space_between">'+
                        '<span class="PDFUrlBtn">'+item.noticeType+'</span>'+
                        '<span class="date">'+timeChange(item.pubAt,'/')+'</span>'+
                    '</div>'+
                    '<h5 class="b_fa">'+item.annTitle+'</h5>'+
                '</dd>'+
            '</li>';
        });
        $('.' + className).append(tagBody);
        if (hasNextPage) {
            var newMoreTags = '<a onclick="moreRiskNotices(\'' + moreId + '\',\'' + className + '\',\'' + secCode + '\',\'' + marType + '\',\'' + cp + '\')">查看更多</a>';
            $('#' + moreId).html(newMoreTags);
        } else {
            $("#" + moreId).remove();
        }
    });

}

/**
 * 展示PDF触发的事件
 * @param {*} title
 * @param {*} pdfUrl
 */
function functionForShowPDF(title,pdfUrl){
        if(appFrom === 'ios'){
            var params = {
                pageId: 'webView',
                url: pdfUrl,
                title: title,
                navigationStyle: 'HsNavigationStatusModel'
            };
            commonCallback('routerNative', JSON.stringify(params));
        }
        else if(appFrom === 'android')
            window.contestapp.openPDFWindow(pdfUrl, title);
        else if(appFrom === 'wx')
            window.open(pdfUrl)
}

/**
 * 判断是否支持pdf展示
 * @param {*} title
 * @param {*} pdfUrl
 */
function showPDF(title, pdfUrl) {
    if (appKey === 'appHcVtm') {
        postMessageToOutside({openUrl: pdfUrl});
    }
    else if (pdfSupport) {
        functionForShowPDF(title, pdfUrl);
    } else {
        if (appKey === 'appHtyw' || appFrom === 'pc') {
            window.open(pdfUrl, '_black');
            return;
        }
        if (ClipboardJS.isSupported()) {
            // var clipboard = new ClipboardJS('.PDFUrlBtn', {
            //     text: function (trigger) {
            //         console.log(pdfUrl)
            //         return pdfUrl
            //     }
            // });
            $('#lnkCopyPdfUrl').attr('data-clipboard-text', pdfUrl);
            var clipboard = new ClipboardJS('#lnkCopyPdfUrl');
            clipboard.on('success', function (e) {
                console.info('Action:', e.action);
                console.info('Text:', e.text);
                console.info('Trigger:', e.trigger);
                e.clearSelection();
                clipboard.destroy();
            });
            clipboard.on('error', function(e) {
                console.error('Action:', e.action);
                console.error('Trigger:', e.trigger);
            });
            copyPdfUrl(pdfUrl);
        } else {
            copyPdfUrlForHand(pdfUrl);
        }
    }
}

function copyPdfUrl(pdfUrl) {
    $(".pdfForAuto").addClass("show").removeClass("hide");
    var propH = $(".pop_prompt_risk .box").height();
    propT = propH + 50;
    $(".pop_prompt .box").css({"top": propT});
}

function copyPdfUrlForHand(pdfUrl) {
    $('.PDFUrlTxt').text(pdfUrl);
    $(".pdfForHand").show();
    var propH = $(".pdfForHand .box").height();
    propT = propH;
    $(".pop_prompt .box").css({"top": propT});
}

/**
 * 风险提示
 * @param {*} result
 * @param {*} showInteractiveView
 */
function companyRiskInfo(result, showInteractiveView) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);
    commonForRiskInfo(result, showInteractiveView, false);

    getQuestionTabs(result);
}

function commonForRiskInfo(result, showInteractiveView, ifHasPushing) {
    var data;
    if (ifHasPushing) {
        if(result.data.hasOwnProperty('list')){
            data = JSON.parse(result.data.list[0].messageContent);
            sendPreAnswerContent(result.data.list[0].messageTitle, '', '', result.qId);
        }else{
            data = JSON.parse(result.data[0].messageContent);
            sendPreAnswerContent(result.data[0].messageTitle, '', '', result.qId);
        }

    } else {
        data = result.data;
    }
    console.log(data);
    var ratingInfo = '';
    var ratingDesc = data.ratingDesc;
    var riskNotices = data.riskNotices;
    var moreId = generateRandomClassName('moreId');
    var noticeList = generateRandomClassName('noticeList');
    var secCode = data.secCode;
    var marType = data.marType;
    var cp = 1;
    var tagBody ='<div class="box_risk">';
        if(ratingDesc){
            tagBody+='<h5>'+ratingDesc+'</h5>';
        }
        if(riskNotices.length>0){
            tagBody+=
            '<div class="hd"><i></i></div>'+
            '<div class="box_timeLine box_timeLine_factor">'+
                '<div class="timeLine">'+
                '<ul class="'+noticeList+'">';
                riskNotices.forEach(function(item,index){
                    tagBody+=
                    '<li class="PDFUrlBtn" onclick="showPDF(\''+item.annTitle+'\',\''+item.annUrl+'\')">'+
                        '<dt>'+
                            '<b></b>'+
                            '<s><i></i></s>'+
                        '</dt>'+
                        '<dd>'+
                            '<div class="space_between">'+
                                '<span>'+item.noticeType+'</span>'+
                                '<span class="date">'+timeChange(item.pubAt,'/')+'</span>'+
                            '</div>'+
                            '<h5 class="b_fa">'+item.annTitle+'</h5>'+
                        '</dd>'+
                    '</li>';
                });
            tagBody+=
                '</ul>'+
                '</div>'+
            '</div>';
    } else {
        tagBody += '<h5>该公司近3年暂无重大风险类公告</h5>';
    }

    if (data.hasNextPage) {
        tagBody +=
            '<div id="' + moreId + '" class="box_load">' +
            '<a onclick="moreRiskNotices(\'' + moreId + '\',\'' + noticeList + '\',\'' + secCode + '\',\'' + marType + '\',\'' + cp + '\')">查看更多</a>' +
            '</div>' +
            '<div class="spinner2 spinner-container-content" style="display:none;">' +
            '<div class="spinner-container container1">' +
            '<div class="circle1"></div>' +
            '<div class="circle2"></div>' +
            '<div class="circle3"></div>' +
            '<div class="circle4"></div>' +
            '</div>' +
            '<div class="spinner-container container2">' +
            '<div class="circle1"></div>' +
            '<div class="circle2"></div>' +
            '<div class="circle3"></div>' +
            '<div class="circle4"></div>' +
            '</div>' +
            '<div class="spinner-container container3">' +
            '<div class="circle1"></div>' +
            '<div class="circle2"></div>' +
            '<div class="circle3"></div>' +
            '<div class="circle4"></div>' +
            '</div>' +
            '</div>';
    }
    var temp = '<div class="bd"><div class="mb">' + tagBody;
    if (ifHasPushing) {
        temp += "</div></div>";
    } else {
        temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) + "</div></div>";
    }

    appendAnswer(temp, '', result.qId);
    try {
        getQuestionTabs(result);
    } catch (e) {
        console.log('可忽略此次报错');
        // saveLog('error', e.message, location.href, 0, 'commonForRiskInfo()', e.stack.toString());
    }

}

/**
 * 估值评级
 * @param result
 * @param outputGuideLine
 * @param isPopup
 * @param ifSecond
 * @param showInteractiveView
 */
function valuationGrade(result, outputGuideLine, isPopup, ifSecond, showInteractiveView) {
    if (outputGuideLine === undefined || outputGuideLine || outputGuideLine == '') {
        if (isPopup || !ifSecond) {
        } else {
            sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);
        }
    }
    var divId = 'rating' + new Date().getTime();

    var reportList = [];
    var ratingResult = [];

    //个股
    if (result.data.hasOwnProperty('reportList')) {
        reportList = result.data.reportList.list;
    }
    //其它
    else {
        if(result.data.hasOwnProperty('list')){
            reportList = result.data.list;
        }else{
            reportList = [];
        }

    }

    if (result.data.hasOwnProperty('ratingResult')) {
        ratingResult = result.data.ratingResult;
        console.log(ratingResult)
        var ratingPaint = setValueGrade(ratingResult, true)
    }

    //未找到相关研报
    if (!reportList) {
        getQuestionTabs(result);
        return;
    }

    //指数类型
    var symbol = getSymbolByEntity(result.questionAnalyse[0].entity, false);

    var item;
    var contentIds = [];
    //生成随机数，作为class名
    var hideClass = generateRandomClassName('hideReport');
    if (!isPopup) {
        var tagBody = '<div class="mb sumUp_InsRating" id="' + divId + '">';
    } else {
        var tagBody = '<div class="sumUp_InsRating" id="' + divId + '">';
    }

    tagBody += ratingPaint
    tagBody += '<h5 class="hd">研报精选</h5><ul class="resReport">'
    for (var i = 0; i < reportList.length; i++) {
        item = reportList[i];
        var sourceFrom = item.docType,
            summary = item.title,
            organization = sourceFrom === "weixin" ? item.weChatName : item.organization,
            author = item.author,
            ratingName = item.ratingName ? item.ratingName : '';

        //提取要点集合
        var tempArray = [];
        for (var x in item.analyseFlags) {
            var strategyName = item.analyseFlags[x];
            tempArray.push(strategyName);
        }

        var tagListBody = '';
        //第3个以后的先隐藏
        if (i >= 3)
            tagListBody = '<li class="' + hideClass + ' box_show" style="display: none">';
        else
            tagListBody = '<li class="box_show">';


        //循环展示多个要点，根据提取出来的要点
        var index = 0;
        for (var j = 0; j < tempArray.length; j++) {
            var subType = tempArray[j];

            summary = item.analyseResults[symbol + subType];
            summary = replaceLineBreak(summary);

            if (index === 0) {
                //估值评级
                var clsRes = '';
                if (ratingName) {
                    if (ratingName.indexOf('买入') !== -1) {
                        clsRes = 'icon-ir_mr'
                    } else if (ratingName.indexOf('增持') !== -1) {
                        clsRes = 'icon-ir_zc'
                    } else if (ratingName.indexOf('中性') !== -1) {
                        clsRes = 'icon-ir_zx'
                    } else if (ratingName.indexOf('减持') !== -1) {
                        clsRes = 'icon-ir_jc'
                    } else if (ratingName.indexOf('卖出') !== -1) {
                        clsRes = 'icon-ir_mc'
                    }
                } else {
                    clsRes = '';
                }

                tagListBody +=
                    // <!--推荐人-->
                    '<div class="hd2">' +
                    '<div><i class="' + clsRes + '"></i>' + organization + '／' + author + '</div>' +
                    '<div>' + changeTime(item.publishAt) + '</div>' +
                    '</div>';
            }

            //内容，展开，收起Id
            var contentId = generateRandomClassName('contentId');
            var expandBtnId = generateRandomClassName('expandBtnId');
            contentIds.push([contentId, expandBtnId]);

            //第2个要点及以后只显示要点名称，不展示证券公司
            var tagExtraKeyPoint = '';
            if (index > 0) {
                tagExtraKeyPoint =
                    '<div class="box_bRed box_bRed_r2 box_bBlue">' +
                    '<li>' + subType.replace('大盘', '').replace('日策略', '') + '</li>' +
                    '</div>';
            }

            //判断是否展示要点
            tagListBody +=
                // <!--显示3行，有展开按钮-->
                '<h5 id="' + contentId + '">' + summary + '</h5>';
            tagListBody += '<a id="' + expandBtnId + '" class="a_more"  onclick="expandResContent(\'' + expandBtnId + '\',\'' + contentId + '\',\'' + result.answerResultType + '\')">展开<i class="icon-arrowD"></i></a>';
            index++;
        }
        tagBody += tagListBody;
    }
    tagBody += '</ul>';
    //加载更多
    var btnMore = '';
    if (reportList.length > 3) {
        var moreId = generateRandomClassName('moreId');
        btnMore =
            '<div id="' + moreId + '" class="mb">' +
            '<div class="box_load" onclick="showMoreArticle(\'' + hideClass + '\', \'' + moreId + '\', \'' + 3 + '\')">' +
            '<a>查看更多</a>' +
            '</div>' +
            '</div>';
    }
    var temp = '';
    if (!isPopup) {
        temp = '<div class="bd">';
    } else {
        temp = '<div>';
    }
    temp += tagBody + btnMore;
    temp += isPopup ? '' : (generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView));
    temp += '</div></div>';
    if (!isPopup) {
        appendAnswer(temp, '', result.qId);
        getQuestionTabs(result);
    } else {
        appendAnswerToPopup(temp);
    }
    checkTextOverflow(contentIds);
}

/**
 * 添加机构评级话术
 * @param result
 */
function setValueGrade(data, isPopup) {
    var stockNum = data.stockNum
    var stockLevel = ''
    if (stockNum !== 0) {
        var stockPercent = (data.ranking / stockNum).toFixed(2);
        if (stockPercent <= 0.3) {
            stockLevel = '同行业内机构关注度较高'
        } else if (stockPercent > 0.3 && stockPercent <= 0.7) {
            stockLevel = '同行业内机构关注度一般'
        } else if (stockPercent > 0.7) {
            stockLevel = '同行业内机构关注度较低'
        }
    }
    if(data.ratingTotal < 5){
        stockLevel = '机构关注度较低'
    }

    if (isPopup) {
        var tagBody = ''
        var ratingArr = data.list
        //此处可复用
        var ratingPaint = drawRating(ratingArr)
        tagBody += '<h5 class="hd rating">机构评级</h5>' +
            '<h6 class="hd">近半年有' + data.ratingTotal + '篇研报，' + stockLevel + '</h6>' + ratingPaint
        return tagBody
    } else {
        var text = '近半年有' + data.ratingTotal + '篇研报，' + stockLevel
        return text
    }

}

/**
 * 综评3期
 * 添加机构评级话术
 * @param result
 */
function setValueGrade_v3(data, isPopup) {
    var stockNum = data.stockNum;
    var stockLevel = '';
    if (stockNum !== 0) {
        var stockPercent = (data.ranking / stockNum).toFixed(2);
        if (stockPercent <= 0.3) {
            stockLevel = '关注度高';
        } else if (stockPercent > 0.3 && stockPercent <= 0.7) {
            stockLevel = '关注一般';
        } else if (stockPercent > 0.7) {
            stockLevel = '关注度低';
        }
    }
    if(data.ratingTotal < 5){
        stockLevel = '关注度低';//该股暂无机构关注  没有评级研报时，为关注度低
    }
    return stockLevel;
}

/**
 * 绘制机构评级图
 * @param array
 * @returns {string}
 */
function drawRating(array) {
    console.log(array)
    var arr = []
    for (var j = 0; j < array.length; j++) {
        arr.push(array[j].ratingNum)
    }
    var arrMax = Math.max.apply(null, arr)
    if (arrMax <= 0) {
        arrMax = 1
    }
    var painting = '<div class="box_columnar">' +
        '<div class="col_img">'
    var note = '<div class="col_note">'
    for (var i = 0; i < arr.length; i++) {
        var percentage = (arr[i] / arrMax * 100).toFixed(2)
        if (percentage < 5) {
            percentage = 5
        }
        painting += '<ul class="columnar">' +
            '<li>' +
            '<div class="txt" style="bottom: ' + percentage + '%;">' + arr[i] + '</div>' +
            '<div class="bar" style="height: ' + percentage + '%;"></div>' +
            '</li>' +
            '</ul>';
        note += '<div class="txt">' + array[i].ratingName + '</div>'
    }
    painting += '</div>' + note +
        '</div>' +
        '</div>'
    return painting
}

/**
 * 最新公告
 * @param result
 * @param isPopup
 */
function notice(result, isPopup) {
    if (!isPopup)
        sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var list = result.data || [];
    var len = list.length;
    var pageSize = 5;
    var hideClass = '';

    var temp = "";
    temp += "<div class='bd'>";
    temp += "<div class='mb infoAndResearch'>";
    temp += "<div class='box_tl02'><h5>";

    if(len > pageSize)
        hideClass = generateRandomClassName('hideNotice');

    for (var i = 0; i < len; i++) {
        temp += '<li onclick="showPDF(\''+list[i].annTitle+'\',\''+list[i].annUrl+'\')" class="'+(i >= pageSize?hideClass:'')+'" style="display: '+(i >= pageSize?'none':'')+';"><a>' + list[i].annTitle + '</a>';
        if (list[i].hasOwnProperty('pubAt')) {
            temp += '<h6 class="t_gray">' + getDataGridTimeFormat(list[i].pubAt) + '</h6>';
        }
        temp += "</li>";
    }
    temp += "</h5></div>";

    //加载更多
    var btnMore = '';
    if (len > pageSize) {
        var moreId = generateRandomClassName('moreId');
        btnMore =
            '<div id="' + moreId + '" class="box_load" style="margin-top: 0" onclick="showMoreArticle(\'' + hideClass + '\', \'' + moreId + '\', \'' + 5 + '\')">' +
                '<a>查看更多</a>' +
            '</div>'
    }

    temp += btnMore;
    temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result);
    temp += "</div>";
    temp += "</div>";

    appendAnswer(temp, '', result.qId);
    scrollToQuestion();
    getQuestionTabs(result);
}

/**
 * 融资融券余额
 * @param result
 * @param showInteractiveView
 */
function marginBalance(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var tradingTop10 = result.data.tradingTop10 || [];
    var seclendingTop10 = result.data.seclendingTop10 || [];
    var tMarMargintradeInfo = result.data.tMarMargintradeInfo;

    var pageSize = 10;
    var hideClass = '';
    var item;

    var tagTradingMore = '';
    if (tradingTop10.length > 10) {
        hideClass = generateRandomClassName('hide');
        var moreId = generateRandomClassName('moreId');
        tagTradingMore =
                    '<div id="' + moreId + '" class="box_load" style="padding: 5px 0 18px 0; margin-top: 0;" onclick="showMoreArticle(\'' + hideClass + '\', \'' + moreId + '\', \'' + pageSize + '\')">' +
                        '<a>查看更多</a>' +
                    '</div>'
    }

    // 融资 前十排名数据
    var tagTrading = '';
    for(var j=0; j<tradingTop10.length; j++){
        item = tradingTop10[j];
        tagTrading +=
            '<ul class="'+(j>=pageSize?hideClass:'')+'" style="display: '+(j >= pageSize?'none':'')+';">'+
                '<li onclick="stockFixQuestion(\''+item.secCode+'\',\''+item.secName+'\',\''+item.marType+'\',\'个股综评\')">'+
                    '<h4>'+item.secName+'</h4>'+
                    '<h6>'+item.secCode+'</h6>'+
                '</li>'+
                '<li>'+formatAmount(item.sMarginTradingbalance*1e4)+'</li>'+
                '<li>'+formatNumber(item.tradingRate)+'%</li>'+
            '</ul>'
    }

    var tagSeclendingMore = '';
    if (seclendingTop10.length > 10) {
        hideClass = generateRandomClassName('hide');
        var moreId2 = generateRandomClassName('moreId');
        tagSeclendingMore =
                    '<div id="' + moreId2 + '" class="box_load" style="padding: 5px 0 18px 0; margin-top: 0;" onclick="showMoreArticle(\'' + hideClass + '\', \'' + moreId2 + '\', \'' + pageSize + '\')">' +
                        '<a>查看更多</a>' +
                    '</div>'
    }
    // 融券前十排名数据
    var tagSeclending = '';
    for(var i=0; i<seclendingTop10.length; i++){
        item = seclendingTop10[i];
        tagSeclending +=
            '<ul class="'+(i>=pageSize?hideClass:'')+'" style="display: '+(i >= pageSize?'none':'')+';">'+
                '<li onclick="stockFixQuestion(\''+item.secCode+'\',\''+item.secName+'\',\''+item.marType+'\',\'个股综评\')">'+
                    '<h4>'+item.secName+'</h4>'+
                    '<h6>'+item.secCode+'</h6>'+
                '</li>'+
                '<li>'+formatAmount(item.sMarginSeclendingbalance*1e4)+'</li>'+
                '<li>'+formatNumber(item.seclendingRate)+'%</li>'+
            '</ul>'
    }

    var quotaContainerId = generateRandomClassName('stockQuota');
    var tableContainerId = generateRandomClassName('tableContainerId');

    var sMarginTradingbalance = formatAmount(tMarMargintradeInfo.sMarginTradingbalance*1e4);
    var sMarginSeclendingbalance = formatAmount(tMarMargintradeInfo.sMarginSeclendingbalance*1e4);
    var voiceTxt = tMarMargintradeInfo.secName+'融资余额'+sMarginTradingbalance+'元，融券余额'+sMarginSeclendingbalance+'元。';
    playVoiceAnswerLite(voiceTxt);

    var tagBody = ''+
        '<div class="box_marginBalance">'+
            // <!--
            //     1. h5页面，无a标签
            //     2. 原生，有a标签
            // -->
            '<ul id="'+quotaContainerId+'" class="stock2">'+
            '</ul>'+

            '<h6 class="note">数据更新时间：'+generateDate(tMarMargintradeInfo.tradeDt)+'</h6>'+

            // <!-- 两融余额 -->
            '<div class="tlBox_signal">'+
                '<ol>'+
                    '<li>两融余额</li>'+
                    '<li>占流通市值比</li>'+
                    '<li>标的股排名</li>'+
                '</ol>'+
                '<ul>'+
                    '<li>融资余额<br>'+sMarginTradingbalance+'</li>'+
                    '<li>'+formatNumber(tMarMargintradeInfo.tradingRate)+'%</li>'+
                    '<li>'+tMarMargintradeInfo.tradingRank+'</li>'+
                '</ul>'+
                '<ul>'+
                    '<li>融券余额<br>'+sMarginSeclendingbalance+'</li>'+
                    '<li>'+formatNumber(tMarMargintradeInfo.seclendingRate)+'%</li>'+
                    '<li>'+tMarMargintradeInfo.seclendingRank+'</li>'+
                '</ul>'+
            '</div>'+

            '<div class="tab TAB2">'+
                '<ul>'+
                    '<li class="on" onclick="marginSubTabClick(event,\''+tableContainerId+'\')">'+
                        '<span>融资余额占比前10<b></b></span>'+
                    '</li>'+
                    '<li onclick="marginSubTabClick(event,\''+tableContainerId+'\')">'+
                        '<span>融券余额占比前10<b></b></span>'+
                    '</li>'+
                '</ul>'+
                '<div class="bottom"></div>'+
            '</div>'+
            '<div id="'+tableContainerId+'" class="content">'+
                '<div class="item show">'+
                    '<ol>'+
                        '<li>个股名称/代码</li>'+
                        '<li>融资余额</li>'+
                        '<li>占流通市值比<i class="icon-arrow_sequentB"></i></li>'+
                    '</ol>'+
                    tagTrading+
                    tagTradingMore+
                '</div>'+
                '<div class="item">'+
                    '<ol>'+
                        '<li>个股名称/代码</li>'+
                        '<li>融券余额</li>'+
                        '<li>占流通市值比<i class="icon-arrow_sequentB"></i></li>'+
                    '</ol>'+
                    tagSeclending+
                    tagSeclendingMore+
                '</div>'+
            '</div>'+
        '</div>';

    var temp = '<div class="bd"><div class="mb">'+tagBody+generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result,showInteractiveView)+'</div></div>';
    appendAnswer(temp, '', result.qId);

    // 股票报价
    getStockQuota(tMarMargintradeInfo.marType+tMarMargintradeInfo.secCode, quotaContainerId);

    scrollToQuestion();
    getQuestionTabs(result);
}

/**
 * 限售股解禁
 * @param result
 * @param showInteractiveView
 */
function restrictedStockUnlock(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var ressList = result.data.ressList || [];
    var ressWeekList = result.data.ressWeekList || [];

    var unlockStr = '';
    if(ressList.length > 0)
    {
        unlockStr = generateDate(ressList[0].listDate, true)+'将有'+formatNumber(ressList[0].listAmount)+'股解禁，占流通股本的'+formatNumber(ressList[0].unresAmount)+'%。';
    }else{
        unlockStr = '该股近两周暂无解禁信息';
    }

    playVoiceAnswerLite(unlockStr);

    var col1 = '',
        col2 = '',
        col3 = '',
        col4 = '';
    var item;
    for(var i=0; i<ressWeekList.length && i<10; i++){
        item = ressWeekList[i];
        col1 += '<li onclick="stockFixQuestion(\''+item.secCode+'\',\''+item.secName+'\',\''+item.marType+'\',\'个股综评\')">'+
                    '<p>'+item.secName+'</p>'+
                    '<h6>'+item.secCode+'</h6>'+
                '</li>';

        col2 += '<li>'+item.listAmount.toFixed(2)+'</li>';
        col3 += '<li>'+item.unresAmount.toFixed(2)+'%</li>';
        col4 += '<li>'+generateDate(item.listDate)+'</li>';
    }

    var quotaContainerId = generateRandomClassName('stockQuota');
    var tagBody =
        '<div class="box_restrictedStock">'+
            '<ul id="'+quotaContainerId+'" class="stock2">'+
            '</ul>'+

            '<div class="box_bgBlue">'+unlockStr+'</div>'+

            '<h5 class="hd">未来限售解禁股前10</h5>'+

            '<div class="box_conStock lBox_next2Weeks">'+
                '<i class="icon-arrow_shape_left"></i>'+
                '<b></b>'+
                '<div class="conStock_hd">'+
                    '<ul>'+
                        '<li>个股名称/代码</li>'+
                        col1+
                    '</ul>'+
                '</div>'+
                '<div class="conStock">'+
                    '<div class="box">'+
                        '<ul class="num">'+
                            '<li>解禁数(万股)</li>'+
                            col2+
                        '</ul>'+
                        '<ul class="num">'+
                            '<li>占流通股本比</li>'+
                            col3+
                        '</ul>'+
                        '<ul class="num">'+
                            '<li>解禁时间<i class="icon-arrow_sequentT"></i></li>'+
                            col4+
                        '</ul>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>';

    var temp = '<div class="bd"><div class="mb">'+tagBody+generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result,showInteractiveView)+'</div></div>';
    appendAnswer(temp, '', result.qId);

    // 股票报价
    getStockQuota(getSymbolByEntity(result.questionAnalyse[0].entity, true), quotaContainerId);

    scrollToQuestion();
    getQuestionTabs(result);
}

/**
 * 资金流动性
 * @param result
 * @param showInteractiveView
 */
function moneyLiquidity(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var htop10 = result.data.htop10 || [];
    var ltop10 = result.data.ltop10 || [];
    var tMarStkLiquidInfo = result.data.tMarStkLiquidInfo;

    var pageSize = 10;
    var hideClass = '';
    var item;

    var tagHighestMore = '';
    if (htop10.length > 10) {
        hideClass = generateRandomClassName('hide');
        var moreId = generateRandomClassName('moreId');
        tagHighestMore =
                    '<div id="' + moreId + '" class="box_load" style="padding: 5px 0 18px 0; margin-top: 0;" onclick="showMoreArticle(\'' + hideClass + '\', \'' + moreId + '\', \'' + pageSize + '\')">' +
                        '<a>查看更多</a>' +
                    '</div>'
    }
    // 最高
    var tagHighest = '';
    for(var i=0; i<htop10.length; i++)
    {
        item = htop10[i];
        tagHighest +=
            '<ul class="'+(i>=pageSize?hideClass:'')+'" style="display: '+(i >= pageSize?'none':'')+';">'+
                '<li onclick="stockFixQuestion(\''+item.secCode+'\',\''+item.secName+'\',\''+item.marType+'\',\'个股综评\')">'+
                    '<h4>'+item.secName+'</h4>'+
                    '<h6>'+item.secCode+'</h6>'+
                '</li>'+
                '<li>'+formatAmount(item.m1Avgamount*1e4)+'</li>'+
                '<li>'+item.m1Turnrate.toFixed(2)+'%</li>'+
            '</ul>'
    }

    var tagLowestMore = '';
    if (htop10.length > 10) {
        hideClass = generateRandomClassName('hide');
        var moreId2 = generateRandomClassName('moreId');
        tagLowestMore =
                    '<div id="' + moreId2 + '" class="box_load" style="padding: 5px 0 18px 0; margin-top: 0;" onclick="showMoreArticle(\'' + hideClass + '\', \'' + moreId2 + '\', \'' + pageSize + '\')">' +
                        '<a>查看更多</a>' +
                    '</div>'
    }
    // 最低
    var tagLowest = '';
    for(i=0; i<ltop10.length; i++)
    {
        item = ltop10[i];
        tagLowest +=
            '<ul class="'+(i>=pageSize?hideClass:'')+'" style="display: '+(i >= pageSize?'none':'')+';">'+
                '<li onclick="stockFixQuestion(\''+item.secCode+'\',\''+item.secName+'\',\''+item.marType+'\',\'个股综评\')">'+
                    '<h4>'+item.secName+'</h4>'+
                    '<h6>'+item.secCode+'</h6>'+
                '</li>'+
                '<li>'+formatAmount(item.m1Avgamount*1e4)+'</li>'+
                '<li>'+item.m1Turnrate.toFixed(2)+'%</li>'+
            '</ul>'
    }

    var quotaContainerId = generateRandomClassName('stockQuota');
    var tableContainerId = generateRandomClassName('tableContainerId');

    var m1Avgamount = formatAmount(tMarStkLiquidInfo.m1Avgamount*1e4);
    var m1Turnrate = tMarStkLiquidInfo.m1Turnrate.toFixed(2)+'%';
    var voiceTxt = tMarStkLiquidInfo.secName+'月日均成交额'+m1Avgamount+'元，月平均换手率'+m1Turnrate+'。';
    playVoiceAnswerLite(voiceTxt);

    var tagBody = ''+
        '<div class="box_marginBalance">'+
            // <!--
            //     1. h5页面，无a标签
            //     2. 原生，有a标签
            // -->
            '<ul id="'+quotaContainerId+'" class="stock2">'+
            '</ul>'+

            '<h6 class="note">数据更新时间：'+generateDate(tMarStkLiquidInfo.tradeDt)+'</h6>'+

            // <!-- 两融余额 -->
            '<ul class="box_grid9">'+
                '<li>'+
                    '<h6>月日均成交额</h6>'+
                    '<h3>'+
                        '<span class="num">'+m1Avgamount+'</span>'+
                    '</h3>'+
                '</li>'+
                '<li>'+
                    '<h6>月平均换手率</h6>'+
                    '<h3>'+
                        '<span class="num">'+m1Turnrate+'</span>'+
                    '</h3>'+
                '</li>'+
            '</ul>'+
            '<ul class="box_grid9">'+
                '<li>'+
                    '<h6>行业内排名</h6>'+
                    '<h3>'+
                        '<span class="num">'+(tMarStkLiquidInfo.m1AvgamountRank||'--')+'/'+(tMarStkLiquidInfo.induSecNum||'--')+'</em>'+
                    '</h3>'+
                '</li>'+
                '<li>'+
                    '<h6>全市场排名</h6>'+
                    '<h3>'+
                        '<span class="num">'+(tMarStkLiquidInfo.m1TotRank||'--')+'/'+(tMarStkLiquidInfo.totSecNum||'--')+'</em>'+
                    '</h3>'+
                '</li>'+
            '</ul>'+

            '<div class="tab TAB2">'+
                '<ul>'+
                    '<li class="on" onclick="marginSubTabClick(event,\''+tableContainerId+'\')">'+
                        '<span>流动性最高前10<b></b></span>'+
                    '</li>'+
                    '<li onclick="marginSubTabClick(event,\''+tableContainerId+'\')">'+
                        '<span>流动性最低前10<b></b></span>'+
                    '</li>'+
                '</ul>'+
                '<div class="bottom"></div>'+
            '</div>'+
            '<div id="'+tableContainerId+'" class="content">'+
                '<div class="item show">'+
                    '<ol>'+
                        '<li>个股名称/代码</li>'+
                        '<li>月日均成交额</li>'+
                        '<li>月平均换手率<i class="icon-arrow_sequentB"></i></li>'+
                    '</ol>'+
                    tagHighest+
                    tagHighestMore+
                '</div>'+
                '<div class="item">'+
                    '<ol>'+
                        '<li>个股名称/代码</li>'+
                        '<li>月日均成交额</li>'+
                        '<li>月平均换手率<i class="icon-arrow_sequentT"></i></li>'+
                    '</ol>'+
                    tagLowest+
                    tagLowestMore+
                '</div>'+
            '</div>'+
        '</div>';

    var temp = '<div class="bd"><div class="mb">'+tagBody+generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result,showInteractiveView)+'</div></div>';
    appendAnswer(temp, '', result.qId);

    // 股票报价
    getStockQuota(tMarStkLiquidInfo.marType+tMarStkLiquidInfo.secCode, quotaContainerId);

    scrollToQuestion();
    getQuestionTabs(result);
}

/**
 * 沪港通资金流向-北上
 * @param result
 * @param showInteractiveView
 */
function sh_hk_upMoneyFlow(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var inStocks = result.data.inStocks || [];
    var outStocks = result.data.outStocks || [];
    var tMarHkshscTop10Stocks = result.data.tMarHkshscTop10Stocks;

    var item;
    // 流入
    var tagIn = '';
    for(var i=0; i<inStocks.length; i++)
    {
        item = inStocks[i];
        tagIn +=
            '<ul>'+
                '<li onclick="stockFixQuestion(\''+item.secCode+'\',\''+item.secName+'\',\''+item.marType+'\',\'个股综评\')">'+
                    '<h4>'+item.secName+'</h4>'+
                    '<h6>'+item.secCode+'</h6>'+
                '</li>'+
                '<li>'+formatAmount(item.netFlowValue*1e4)+'</li>'+
                '<li>'+formatAmount(item.totalValue*1e4)+'</li>'+
            '</ul>'
    }

    // 流出
    var tagOut = '';
    for(i=0; i<outStocks.length; i++)
    {
        item = outStocks[i];
        tagOut +=
            '<ul>'+
                '<li onclick="stockFixQuestion(\''+item.secCode+'\',\''+item.secName+'\',\''+item.marType+'\',\'个股综评\')">'+
                    '<h4>'+item.secName+'</h4>'+
                    '<h6>'+item.secCode+'</h6>'+
                '</li>'+
                '<li>'+formatAmount(Math.abs(item.netFlowValue)*1e4)+'</li>'+
                '<li>'+formatAmount(item.totalValue*1e4)+'</li>'+
            '</ul>'
    }

    var strInOut = tMarHkshscTop10Stocks.netFlowValue>0 ? '入' : '出';
    var netFlowValue = formatAmount(Math.abs(tMarHkshscTop10Stocks.netFlowValue)*1e4);
    playVoiceAnswerLite(tMarHkshscTop10Stocks.secName+'北上资金净流'+strInOut+netFlowValue+'元。');

    var quotaContainerId = generateRandomClassName('stockQuota');
    var tableContainerId = generateRandomClassName('tableContainerId');
    var tagBody =
        '<div class="box_marginBalance">'+
            // <!--
            //     1. h5页面，无a标签
            //     2. 原生，有a标签
            // -->
            '<ul id="'+quotaContainerId+'" class="stock2">'+
            '</ul>'+

            '<h6 class="note">数据更新时间：'+generateDate(tMarHkshscTop10Stocks.tradeDt)+'</h6>'+

            // <!--  -->
            '<div class="tlBox_signal">'+
                '<ol>'+
                    '<li>资金净流'+strInOut+'</li>'+
                    '<li>总成交额</li>'+
                    '<li>净流'+strInOut+'排名</li>'+
                '</ol>'+
                '<ul class="line1">'+
                    '<li>'+netFlowValue+'</li>'+
                    '<li>'+formatAmount(tMarHkshscTop10Stocks.totalValue*1e4)+'</li>'+
                    '<li>'+tMarHkshscTop10Stocks.netFlowRank+'</li>'+
                '</ul>'+
            '</div>'+

            '<div class="tab TAB2">'+
                '<ul>'+
                    '<li class="on" onclick="marginSubTabClick(event,\''+tableContainerId+'\')">'+
                        '<span>北上资金净流入<b></b></span>'+
                    '</li>'+
                    '<li onclick="marginSubTabClick(event,\''+tableContainerId+'\')">'+
                        '<span>北上资金净流出<b></b></span>'+
                    '</li>'+
                '</ul>'+
                '<div class="bottom"></div>'+
            '</div>'+
            '<div id="'+tableContainerId+'" class="content">'+
                '<div class="item show">'+
                    '<ol>'+
                        '<li>个股名称/代码</li>'+
                        '<li>资金净流入<i class="icon-arrow_sequentB"></i></li>'+
                        '<li>总成交额</li>'+
                    '</ol>'+
                    tagIn+
                '</div>'+
                '<div class="item">'+
                    '<ol>'+
                        '<li>个股名称/代码</li>'+
                        '<li>资金净流出<i class="icon-arrow_sequentB"></i></li>'+
                        '<li>总成交额</li>'+
                    '</ol>'+
                    tagOut+
                '</div>'+
            '</div>'+
        '</div>';

    var temp = '<div class="bd"><div class="mb">'+tagBody+generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result,showInteractiveView)+'</div></div>';
    appendAnswer(temp, '', result.qId);

    // 股票报价
    getStockQuota(tMarHkshscTop10Stocks.marType+tMarHkshscTop10Stocks.secCode, quotaContainerId);

    scrollToQuestion();
    getQuestionTabs(result);
}

/**
 * 有形资产|竞争力数据
 * @param result
 * @param showInteractiveView
 */
function materialAssets(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var list = result.data || [];
    var tagList = '';
    var item;

    var stockName = '';
    try {
        stockName = getPropertyByEntity(result.questionAnalyse[0].entity).name;
    } catch (e) {
    }
    var voiceTxt = '';

    for(var i=0; i<list.length; i++){
        item = list[i];
        var compareStr = item.name==='注册资本'?'较上期':'同比';

        if (item.name === '有形资产') {
            voiceTxt += getQuarterLabel(item.date, 'season') + item.name + formatAmount(item.value) +'元';
        } else if (item.name === '研发投入') {
            voiceTxt += '，' + item.name + formatAmount(item.value) +'元';
        }

        tagList +=
            '<ul>' +
                '<li><p>'+item.name+'</p></li>' +
                '<li>'+(item.name!=='注册资本'?getQuarterLabel(item.date, 'season')+'<br/>':'')+formatAmount(item.value)+'</li>'+
                '<li>'+(item.rate ? (compareStr+'<br/>'+item.rate+'%') : '--')+'</li>' +
            '</ul>'
    }

    // 语音
    playVoiceAnswerLite(stockName + voiceTxt + '。');

    var tagBody =
        '<div class="box_show_ol">' +
            '<ol><li></li><li>最新数据</li><li style="text-align: right">变化</li></ol>' +
            '<div>' +
                tagList +
            '</div>' +
        '</div>';

    var temp = '<div class="bd"><div class="mb">'+tagBody+getRatingLabel(result,showInteractiveView)+'</div></div>';
    appendAnswer(temp, '', result.qId);

    scrollToQuestion();
    getQuestionTabs(result);
}

/**
 * 高管变更
 * @param result
 * @param showInteractiveView
 */
function executivesChange(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var list = result.data || [];
    var col1 = ''; // 存储第一列的html tag
    var arrCol = ['','','','','','']; // 存储其余列的html tag，空字符串的数量要跟除固定列外的列数一样
    var arrColName = ['publishDate','changeType','post','changeReason','managerStartDate','managerLeaveDate']; // 其余列字段

    // 分页展示时，需要先隐藏多余的条数，此处需要先为每一列生成一个随机的类名
    var arrHideCls = []; //隐藏类
    if(list.length>5){
        // 循环的次数为所有列的数量
        for(var m=0; m<7; m++){
            arrHideCls.push(generateRandomClassName('hide'));
        }
    }

    for (var i=0; i<list.length; i++){
        // 第一列，即固定列
        col1 += '<li class="'+(i>4?arrHideCls[0]:'')+'" style="height: 1.5rem;display: '+(i>4?'none':'')+'">'+truncateString(list[i].managerName,6)+'</li>';

        // 其余列
        for(var j=0; j<arrCol.length; j++){
            // 处理为null字段
            var value = list[i][arrColName[j]] || '--';

            // 格式化日期字段
            if(['publishDate','managerStartDate','managerLeaveDate'].indexOf(arrColName[j]) !== -1)
                value = value !== '--' ? generateDate(value) : value;

            arrCol[j] += '<li class="'+(i>4?arrHideCls[j+1]:'')+'" style="height: 1.5rem; padding: 0.5rem 0;display: '+(i>4?'none':'')+'">'+value+'</li>';
        }
    }

    var tagBody =
        '<div class="box_conStock" style="margin: -1rem;">'+
            '<i class="icon-arrow_shape_left"></i>'+
            '<b></b>'+
            '<div class="conStock_hd">'+
                '<ul>'+
                    '<li>姓名</li>'+
                    col1+
                '</ul>'+
            '</div>'+
            '<div class="conStock" onscroll="tableScrollHandler(event)">'+
                '<div class="box">'+
                    '<ul>'+
                        '<li>发布日期</li>'+
                        arrCol[0]+
                    '</ul>'+
                    '<ul style="width: calc(35vw);">'+
                        '<li>变化</li>'+
                        arrCol[1]+
                    '</ul>'+
                    '<ul style="width: calc(35vw);">'+
                        '<li>职务</i></li>'+
                        arrCol[2]+
                    '</ul>'+
                    '<ul style="width: calc(35vw);">'+
                        '<li>原因</i></li>'+
                        arrCol[3]+
                    '</ul>'+
                    '<ul style="width: calc(35vw);">'+
                        '<li>任职时间</i></li>'+
                        arrCol[4]+
                    '</ul>'+
                    '<ul style="width: calc(35vw);">'+
                        '<li>离职时间</i></li>'+
                        arrCol[5]+
                    '</ul>'+
                '</div>'+
            '</div>'+
        '</div>';

    //加载更多
    var btnMore = '';
    if (list.length > 5) {
        var moreId = generateRandomClassName('moreId');
        btnMore =
            '<div id="' + moreId + '">' +
                '<div class="box_load" onclick="showMoreListItem(\'' + arrHideCls.join('|') + '\', \'' + moreId + '\', \'' + 5 + '\')">' +
                    '<a>查看更多</a>' +
                '</div>' +
            '</div>';
    }

    var temp = '<div class="bd"><div class="mb">'+tagBody+btnMore+generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result,showInteractiveView)+'</div></div>';
    appendAnswer(temp, '', result.qId);

    scrollToQuestion();
    getQuestionTabs(result);
}

/**
 * 员工持股
 * @param result
 * @param showInteractiveView
 */
function employeeStockHolding(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var list = result.data || [];
    var col1 = '';
    var arrCol = ['','','','','','','','','',''];
    var arrColName = ['initialCapital','sholdersNo','emplSubsAmt','emplSubsProportion','senmngrSubsAmt','senmngrSubsProportion','estimatedPrice','sharesResourceName','ratioOwnfunds','initialLeverage'];
    var arrHideCls = []; //隐藏类

    if(list.length>5){
        for(var m=0; m<11; m++){
            arrHideCls.push(generateRandomClassName('hide'));
        }
    }

    for (var i=0; i<list.length; i++){
        col1 += '<li class="'+(i>4?arrHideCls[0]:'')+'" style="height: 1.5rem;display: '+(i>4?'none':'')+'">'+generateDate(list[i].publishDate)+'</li>';

        for(var j=0; j<arrCol.length; j++){
            var value = list[i][arrColName[j]] || '--';
            if(['sholdersNo', 'sharesResourceName', 'initialLeverage'].indexOf(arrColName[j]) === -1)
                value = value !== '--' ? value.toFixed(2) : value;

            var unit = '';
            if(['emplSubsProportion', 'senmngrSubsProportion', 'ratioOwnfunds'].indexOf(arrColName[j]) > -1)
                unit = value !== '--' ? '%' : '';

            arrCol[j] += '<li class="'+(i>4?arrHideCls[j+1]:'')+'" style="height: 1.5rem; padding: 0.5rem 0;display: '+(i>4?'none':'')+'">'+value+unit+'</li>';
        }
    }

    var tagBody =
        '<div class="box_conStock" style="margin: -1rem;">'+
            '<i class="icon-arrow_shape_left"></i>'+
            '<b></b>'+
            '<div class="conStock_hd">'+
                '<ul>'+
                    '<li>发布日期</li>'+
                    col1+
                '</ul>'+
            '</div>'+
            '<div class="conStock" onscroll="tableScrollHandler(event)">'+
                '<div class="box">'+
                    '<ul>'+
                        '<li>初始资金规模(万元)</li>'+
                        arrCol[0]+
                    '</ul>'+
                    '<ul>'+
                        '<li>持有人数</li>'+
                        arrCol[1]+
                    '</ul>'+
                    '<ul>'+
                        '<li>员工认购金额(万元)</i></li>'+
                        arrCol[2]+
                    '</ul>'+
                    '<ul>'+
                        '<li>员工认购比例</i></li>'+
                        arrCol[3]+
                    '</ul>'+
                    '<ul>'+
                        '<li>高管认购金额(万元)</i></li>'+
                        arrCol[4]+
                    '</ul>'+
                    '<ul>'+
                        '<li>高管认购比例</i></li>'+
                        arrCol[5]+
                    '</ul>'+
                    '<ul>'+
                        '<li>预估价格</i></li>'+
                        arrCol[6]+
                    '</ul>'+
                    '<ul>'+
                        '<li>股票来源</i></li>'+
                        arrCol[7]+
                    '</ul>'+
                    '<ul>'+
                        '<li>员工自有资金占比</i></li>'+
                        arrCol[8]+
                    '</ul>'+
                    '<ul>'+
                        '<li>初始杠杆</i></li>'+
                        arrCol[9]+
                    '</ul>'+
                '</div>'+
            '</div>'+
        '</div>';

    //加载更多
    var btnMore = '';
    if (list.length > 5) {
        var moreId = generateRandomClassName('moreId');
        btnMore =
            '<div id="' + moreId + '">' +
                '<div class="box_load" onclick="showMoreListItem(\'' + arrHideCls.join('|') + '\', \'' + moreId + '\', \'' + 5 + '\')">' +
                    '<a>查看更多</a>' +
                '</div>' +
            '</div>';
    }

    var temp = '<div class="bd"><div class="mb">'+tagBody+btnMore+getRatingLabel(result,showInteractiveView)+'</div></div>';
    appendAnswer(temp, '', result.qId);

    scrollToQuestion();
    getQuestionTabs(result);
}

/**
 * 业绩变化
 * @param result
 * @param showInteractiveView
 */
function performanceChange(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var list = result.data || [];
    var col1 = ''; //第一列
    var arrCol = ['','','']; // 其余列
    var arrColName = ['profitNoticeTypeName','profitNoticeChangeMin','profitNoticeChangeMax']; // 其余列字段
    var arrHideCls = []; //隐藏类
    if(list.length>5){
        for(var m=0; m<4; m++){
            arrHideCls.push(generateRandomClassName('hide'));
        }
    }
    for (var i=0; i<list.length; i++){
        col1 += '<li class="'+(i>4?arrHideCls[0]:'')+'" style="height: 1.5rem;display: '+(i>4?'none':'')+'">'+generateDate(list[i].pubDate)+'</li>';

        for(var j=0; j<arrCol.length; j++){
            var value = list[i][arrColName[j]] || '--';
            if(['profitNoticeTypeName'].indexOf(arrColName[j]) === -1)
                value = value !== '--' ? value.toFixed(2) : value;

            var unit = '';
            if(['profitNoticeChangeMin', 'profitNoticeChangeMax'].indexOf(arrColName[j]) > -1)
                unit = value !== '--' ? '%' : '';

            arrCol[j] += '<li class="'+(i>4?arrHideCls[j+1]:'')+'" style="height: 1.5rem; padding: 0.5rem 0;display: '+(i>4?'none':'')+'">'+value+unit+'</li>';
        }
    }

    var tagBody =
        '<div class="box_conStock" style="margin: -1rem;">'+
            '<i class="icon-arrow_shape_left"></i>'+
            '<b></b>'+
            '<div class="conStock_hd">'+
                '<ul>'+
                    '<li>公告日期</li>'+
                    col1+
                '</ul>'+
            '</div>'+
            '<div class="conStock" onscroll="tableScrollHandler(event)">'+
                '<div class="box">'+
                    '<ul>'+
                        '<li>业绩预告类型</li>'+
                        arrCol[0]+
                    '</ul>'+
                    '<ul style="width: calc(35vw);">'+
                        '<li>净利润变动幅度下限</li>'+
                        arrCol[1]+
                    '</ul>'+
                    '<ul style="width: calc(35vw);">'+
                        '<li>净利润变动幅度上限</i></li>'+
                        arrCol[2]+
                    '</ul>'+
                '</div>'+
            '</div>'+
        '</div>';

    //加载更多
    var btnMore = '';
    if (list.length > 5) {
        var moreId = generateRandomClassName('moreId');
        btnMore =
            '<div id="' + moreId + '">' +
                '<div class="box_load" onclick="showMoreListItem(\'' + arrHideCls.join('|') + '\', \'' + moreId + '\', \'' + 5 + '\')">' +
                    '<a>查看更多</a>' +
                '</div>' +
            '</div>';
    }

    var temp = '<div class="bd"><div class="mb">'+tagBody+btnMore+generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result,showInteractiveView)+'</div></div>';
    appendAnswer(temp, '', result.qId);

    scrollToQuestion();
    getQuestionTabs(result);
}

/**
 * 业绩快报 achievementReport
 * @param result
 * @param showInteractiveView
 */
function achievementReport(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);
    var list = result.data || [];
    var col1 = ''; //第一列
    var arrCol = ['','','']; // 其余列
    var arrColName = ['thisYearValue','lastYearValue','changeRangeValue']; // 其余列字段
    for (var i=0; i<list.length; i++){
        col1 += '<li style="height: 2.8rem;font-size: .75rem;">'+list[i].displayName+'</li>';
        for(var j=0; j<arrCol.length; j++){
            var value = list[i][arrColName[j]] || '--';
            if(['thisYearValue','lastYearValue'].indexOf(arrColName[j]) === -1)
                value = value !== '--' ? value : value;
            var unit = '';
            if(['changeRangeValue'].indexOf(arrColName[j]) > -1)
                unit = value!== '--' ? '%' : '';
            if(unit=='%'){
                arrCol[j] += '<li style="height: 2.8rem;font-size: .75rem;line-height: 2.8rem">'+value.toFixed(2)+unit+'</li>';
            }else {
                arrCol[j] += '<li style="height: 2.8rem;font-size: .75rem;line-height: 2.8rem">'+ value.toLocaleString() +unit+'</li>';
            }
        }
    }
    var tagBody =
        '<div class="box_conStock" style="margin-top: -1rem">'+
        '<i class="icon-arrow_shape_left"></i>'+
        '<b></b>'+
        '<div class="conStock_hd conStock_hd_190301">'+
        '<ul>'+
        '<li>项目</li>'+
        col1+
        '</ul>'+
        '</div>'+
        '<div class="conStock" onscroll="tableScrollHandler(event)">'+
        '<div class="box">'+
        '<ul>'+
        '<li>本报告期</li>'+
        arrCol[0]+
        '</ul>'+
        '<ul style="width: calc(35vw);">'+
        '<li>上年同期</li>'+
        arrCol[1]+
        '</ul>'+
        '<ul style="width: calc(35vw);">'+
        '<li>增减变动幅度</i></li>'+
        arrCol[2]+
        '</ul>'+
        '</div>'+
        '</div>'+
        '</div>';
    var temp = '<p style="text-align: right;font-size: 0.875rem">单位：元</p><div class="bd"><div class="mb">'+tagBody+generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result,showInteractiveView)+'</div></div>';
    appendAnswer(temp, '', result.qId);

    scrollToQuestion();
    getQuestionTabs(result);
}

/**
 * 列表横向滚动，隐藏箭头
 * @param event
 */
function tableScrollHandler(event) {
    var target = $(event.currentTarget);
    if (target.scrollLeft() > 20){
        target.siblings(".icon-arrow_shape_left").hide();
    }
    else{
        target.siblings(".icon-arrow_shape_left").show();
    }
}

/**
 * tab 切换
 * @param event
 * @param tableContainerId
 */
function marginSubTabClick(event, tableContainerId) {
    // console.log($(event.currentTarget).index())
    var curTarget = $(event.currentTarget);
    var index = curTarget.index();
    curTarget.addClass('on').siblings().removeClass('on');
    $('#'+tableContainerId).find('> div').eq(index).addClass('show').siblings().removeClass('show');
    // $('#'+tableContainerId).children().eq(index).addClass('show').siblings().removeClass('show');
}
