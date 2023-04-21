// 这个文件里放一些备份的答案，如可能问不出的，或者已经不在使用的

/**
 * 投入产出分析
 * @param result
 * @param showInteractiveView
 */
function inputOutputAnalysis(result, showInteractiveView) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word);
    var data = result.data;
    var tagLabels = '';
    var investAdviseDesc = data.hasOwnProperty('investAdviseDesc') ? data.investAdviseDesc : '';
    if (data.tags.length > 0) {
        data.tags.forEach(function (item, index) {
            tagLabels += '<b>' + item + '</b>';
        });
    }

    var tagBody =
        '<div class="box_bBlue box_capStr box_outAnalysis">'+
            '<h5>'+
                '<span class="box_label">'+
                    tagLabels+
                '</span>'+investAdviseDesc+
            '</h5>'+
            '<a class="icon-add_help" onclick="inOutputAnalysisExp()"></a>'+
        '</div>'+

        // <!-- 表格 -->
        '<div class="box_conStock lBox_outAnalysis">'+
            '<i class="icon-arrow_shape_left"></i>'+
            '<div class="outAnalysis_hd">'+
                '<ul>'+
                    '<li></li>'+
                    '<li>投资回报率(ROIC)</li>'+
                    '<li>投资回报率行业均值</li>'+
                    '<li>净资产收益率(ROE)</li>'+
                    '<li>净资产收益率行业均值</li>'+
                    '<li>加权平均成本(WACC)</li>'+
                    '<li>加权平均成本行业均值</li>'+
                '</ul>'+
            '</div>'+
            '<div class="conStock" onscroll=analysisScroll(event)>'+
                '<div class="box">';
                if(data.investReturns.length>0){
                    data.investReturns.forEach(function(item,index){
                        tagBody+=
                        '<ul>'+
                            '<li>'+changeTime(item.statEndDate)+'</li>'+
                            '<li>'+addPerForPositiveAndNegative(item.roic)+'</li>'+
                            '<li>'+addPerForPositiveAndNegative(item.induRoic)+'</li>'+
                            '<li>'+addPerForPositiveAndNegative(item.roe)+'</li>'+
                            '<li>'+addPerForPositiveAndNegative(item.induRoe)+'</li>'+
                            '<li>'+addPerForPositiveAndNegative(item.wacc)+'</li>'+
                            '<li>'+addPerForPositiveAndNegative(item.induWacc)+'</li>'+
                        '</ul>';
                    });
                }
                tagBody+='</div>'+
            '</div>'+
        '</div>';

    var temp = '<div class="bd"><div class="mb">' + tagBody + getRatingLabel(result, showInteractiveView) + '</div></div>';

    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
}

/**
 * 帮助引导问题
 * 首页推荐  改版  杨超  2018.07.05
 * @param result
 * @param isShow 主动推送进入小e isShow ==true  显示首页； isShow ==  false不显示首页
 * @param arr 个性化首页查询结果
 */
function setPresetQuestion(result, isShow, arr) {
    var list = result.data || [];
    var temp = '';
    temp += '<div class="md_AIRecommend">' +
                '<div class="swiper-container">' +
                    '<div class="swiper-wrapper">';
    // 您可能关注的
    var userFocus = '';
    //个性化首页结果
    if (arr) {
        var res = arr.data.userQuestions;
        if (res.length > 0) {
            userFocus += '<div class="swiper-slide">' +
                            '<div class="box">' +
                                '<div class="hd">您可能关注的</div>' +
                                    '<ul class="bd personalizedCustomization">';
            for (var i = 0; i <= res.length - 1; i++) {
                if (res[i].question) {
                    if(res[i].dimension == '资讯'){
                        userFocus += "<li onclick=\"showInformationDetail('" + res[i].dimensionUniqueKey + "','" + res[i].dimension + "','homePage','" + res[i].indexId + "')\">" + res[i].question + '</li>';
                    }else {
                        var from = '来源：个性化首页';
                        //参数 依次为  sendTxt, showTxt, voiceQuestion, isPopup,questionId,userQuestionId
                        userFocus += '<li onclick="freeQuestion(\'' + res[i].question + '\',\'\',\'\',\'\',\'' + res[i].questionsId + '\',\'' + res[i].indexId + '\',\'' + from + '\')">' + res[i].question + '</li>';
                        /*var from = '';
                        if(res[i].dimension == '个股技术分析'){
                            from = 'homePage';
                        }else{
                            from = '';
                        }
                        //参数 依次为  sendTxt, showTxt, voiceQuestion, isPopup,questionId,userQuestionId
                        temp += '<li onclick="freeQuestion(\'' + res[i].question + '\',\'\',\'\',\'\',\'' + res[i].questionsId + '\',\'' + res[i].indexId + '\',\'' + from + '\')">' + res[i].question + '</li>';
                    */}

                }
            }
            userFocus += '</ul>';
            //首页没有下一页，换一换置灰 不可点击
            if (arr.data.hasNextPage) {
                userFocus += '<div class="btn_refresh" onclick="getPersonalizedCustomizationRef(this)"><span><i class="icon-refresh"></i><em>换一换</em></span></div>';
            } else {
                userFocus += '<div class="btn_refresh t_gray"><span><i class="icon-refresh"></i><em>换一换</em></span></div>';
            }
            userFocus += '</div></div>';
        }
    }

    for (var n=0; n<list.length; n++) {
        var options = list[n];
        //首页热门问题推荐
        for (var i in options) {//用javascript的for/in循环遍历对象的属性
            /**
             * 问题类型
             * 8->科创板
             * 0->诊股
             * 1->选股
             * 2->业务办理（紫薯财股+巨丰投顾不显示）C端不支持
             * 3->指令(只有E智通里包含指令板块)C端不支持
             * 4->百科问答
             */
            var item = options[i];
            if (appKey !== "appEzt") {
                // temp += userFocus;
                if(appKey === "appZscf" || appKey === "appJftg" || appKey === "appTopC"){
                    if (i == 2) {
                        return;
                    }else if(i == 3){
                        return;
                    }else{
                      // if(i == 4 && appKey === 'appTopC')
                      //   continue;

                        temp += '<div class="swiper-slide">' +
                            '<div class="box">' +
                            '<div class="hd">' + getTxt(i) + '</div>' +
                            '<ul class="bd">';
                        for (var j = 0; j < item.length; j++) {
                            //temp +='<li onclick="freeQuestion(\'' + item[j].question + '\')"><b></b>'+item[j].question+'</li>';//前面样式有圈
                            //temp += '<li onclick="freeQuestion(\'' + item[j].question + '\')">' + item[j].question + '</li>';
                            temp += '<li onclick="freeQuestion(\'' + item[j].question + '\',\'\',\'\',\'\',\'\',\'\',\'来源:小e会什么\')">' + item[j].question + '</li>';
                        }
                        temp += '</ul><div class="btn_refresh" onclick="getPresetQuestionByType(this)"><span><i class="icon-refresh"></i><em>换一换</em></span></div>' +
                            '</div>' +
                            '</div>';
                    }
                }else{
                    if (i == 2 || i == 3) {
                        continue;
                    } else {
                        temp += '<div class="swiper-slide">' +
                            '<div class="box">' +
                            '<div class="hd">' + getTxt(i) + '</div>' +
                            '<ul class="bd">';
                        for (var j = 0; j < item.length; j++) {
                            //temp +='<li onclick="freeQuestion(\'' + item[j].question + '\')"><b></b>'+item[j].question+'</li>';//前面样式有圈
                            //temp += '<li onclick="freeQuestion(\'' + item[j].question + '\')">' + item[j].question + '</li>';
                            temp += '<li onclick="freeQuestion(\'' + item[j].question + '\',\'\',\'\',\'\',\'\',\'\',\'来源:小e会什么\')">' + item[j].question + '</li>';
                        }
                        temp += '</ul><div class="btn_refresh" onclick="getPresetQuestionByType(this)"><span><i class="icon-refresh"></i><em>换一换</em></span></div>' +
                            '</div>' +
                            '</div>';
                    }
                }
            } else {//E智通内的小E 显示指令
                temp += '<div class="swiper-slide">' +
                            '<div class="box">' +
                                '<div class="hd">' + getTxt(i) + '</div>' +
                                    '<ul class="bd">';
                for (var j = 0; j < item.length; j++) {
                    //temp +='<li onclick="freeQuestion(\'' + item[j].question + '\')"><b></b>'+item[j].question+'</li>';//前面样式有圈
                    //temp += '<li onclick="freeQuestion(\'' + item[j].question + '\')">' + item[j].question + '</li>';
                    temp += '<li onclick="freeQuestion(\'' + item[j].question + '\',\'\',\'\',\'\',\'\',\'\',\'来源:小e会什么\')">' + item[j].question + '</li>';
                }
                temp += '</ul><div class="btn_refresh" onclick="getPresetQuestionByType(this)"><span><i class="icon-refresh"></i><em>换一换</em></span></div>' +
                        '</div>' +
                        '</div>';

                if (i == 8) {
                    temp += userFocus;
                }
            }
        }
    }
    temp += '</div>' +
            '</div>' +
            '<div class="swiper-pagination"></div>' +
            '</div>';

    $('#divHelp').append(temp);

    function getTxt(index) {
        var txt = '';
        if (index == 8) {
            txt = '直击科创板';
        }
        else if (index == 0) {
            txt = '诊股';
        }
        else if (index == 1) {
            txt = '选股';
        }
        else if (index == 2) {
            txt = '业务办理';
        }
        else if (index == 3) {
            txt = '指令';
        }
        else if (index == 4) {
            txt = '百科问答';
        }
        return txt;
    }
    showPresetHotQuestion(isShow);
    scrollToQuestion();
}


/**
 *  首页 智能推荐 热门语句  按照type，ps，cp，organization
 *  @param type 问题类型：8->科创板、0->诊股、1->选股、2->业务办理、3->指令、4->百科问答
 *  @param ps   展示5条
 *  @param cp   页码
 *  @param organization 来源：appEzt(e智通)，appZscf(紫薯财富)
 */
function getPresetQuestionByType(obj) {
    var thisObj = $(obj);//js对象转jquery对象
    var title = thisObj.siblings('.hd').html();
    var type = 0, organization = '';
    if (title === "直击科创板") {
        type = 8;
    }
    else if (title === "诊股") {
        type = 0;
    }
    else if (title === "选股") {
        type = 1;
    }
    else if (title === "业务办理") {
        type = 2;
    }
    else if (title === "指令") {
        type = 3;
        organization = 'appEzt';
    }
    else if (title === "百科问答") {
        type = 4;
    }
    getPresetQuestionCP = getPresetQuestionCP + 1;

    $.ajax({
        type: "get",
        url: HttpUrl + "semantic-api-service/page/question/new",
        data: {
            userId: userId,
            type: type,
            ps: 5,
            cp: getPresetQuestionCP,
            organization: appKey
        },
        dataType: "jsonp",
        timeout: 15000,
        jsonp: "callback",
        success: function (result) {
            var list = result.data || [];
            var temp = '';
            for (var n=0; n<list.length; n++) {
                var options = list[n];
                var item = options[type] || [];
                for (var j = 0; j < item.length; j++) {
                    //temp +='<li onclick="freeQuestion(\'' + item[j].question + '\')"><b></b>'+item[j].question+'</li>';
                    //temp += '<li onclick="freeQuestion(\'' + item[j].question + '\')">' + item[j].question + '</li>';
                    //temp += '<li onclick="freeQuestion(\'' + item[j].question + '\',\'\',\'\',\'\',\'\',\'\',\'\',\'来源:个性化首页\')"> + item[j].question + '</li>';
                    temp += '<li onclick="freeQuestion(\'' + item[j].question + '\',\'\',\'\',\'\',\'\',\'\',\'来源:小e会什么\')">' + item[j].question + '</li>';
                }
            }
            thisObj.siblings('.bd').html(temp);
        }
    });

}


/**
 *  首页 智能推荐 热门语句
 *  产品经理 杨超
 *  @param success
 *  @param type 问题类型：0->诊股、1->选股、2->业务办理、3->指令、4->百科问答
 *  @param ps   展示5条
 *  @param cp   页码
 *  @param organization 来源：appEzt(e智通)，appZscf(紫薯财富)
 */
function getPresetHotQuestion(success, organization) {
    getPresetQuestionCP = getPresetQuestionCP+1;
    organization = '';
    if(appKey){
        organization = appKey;
    }
    $.ajax({
        type: "get",
        url: HttpUrl + "/semantic-api-service/page/question/new",
        data: {
            userId: userId,
            clientId: clientId,
            type: '',
            ps: 5,
            cp: getPresetQuestionCP,
            organization: organization
        },
        dataType: "jsonp",
        // timeout: 15000,
        jsonp: "callback",
        success: success
    });
}

/**
 * 财务指标答案输出
 * @param result
 */
function financialIndex(result) {
    var word = '';
    if (result.hasOwnProperty('words')) {
        word = result.words;
    }
    sendPreAnswerContent(word + result.preAnswerContent);

    var item = result.questionAnalyse[0];
    var subject = item.entity[0].property;

    var temp = '';
    temp = "<div class='bd'><div class='mb'><div class='md_v1 md_tlbox md_col3table'>";
    // 文本内容
    temp += "<h4>" + subject.name + "  " + subject.code + "&nbsp;&nbsp;|&nbsp;&nbsp;" + changeTime(result.data.endAt) + getSeasonByTime(result.data.endAt) + "</h4>";
    temp += "<ul><li><div><h5>每股收益</h5><h3>" + fixed2(result.data.eps) + "</h3></div></li><li><div><h5>每股净资产</h5><h3>" + fixed2(result.data.naps) + "</h3></div></li><li class='li_last'><div><h5>净资产收益率<em>摊薄</em></h5><h3>" + addPer(result.data.roe) + "</h3></div></li></ul>";
    temp += "<ul><li><div><h5>市盈率</h5><h3>" + fixed2(result.data.pe) + "</h3></div></li><li><div><h5>市净率</h5><h3>" + fixed2(result.data.pb) + "</h3></div></li><li class='li_last'><div><h5>市销率</h5><h3>" + fixed2(result.data.ps) + "</h3></div></li></ul>";
    temp += "<ul><li><div><h5>净利润</h5><h3>" + formatMoney(result.data.netProfitForParent) + "</h3></div></li><li><div><h5>净利润增长率</h5><h3>" + addPer(result.data.netProfitForParentGrowth) + "</h3></div></li><li class='li_last'>&nbsp;</li></ul>";
    temp += "<div class='link_half link_half2 mt_0'></div></div>";

    // 点赞按钮
    temp += getRatingLabel(result);
    temp += "</div></div>";

    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
}


/**
 * 核心竞争力
 * @param result
 * @param showInteractiveView
 */
function coreCompetence(result, showInteractiveView) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word);
    var data = result.data;

    var ifShowD0 = "show";
    var lineClass0 = generateRandomClassName('hideArticle0');
    if (result.data[0].showword < 120) {
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

    var tagBody=
        '<div class="tab_shareholdersTop tab_coreComp">'+
            '<nav>'+
                '<a class="on">专家言论<b></b></a>'+
                '<a>公司言论<b></b></a>'+
            '</nav>'+
        // <!-- 专家言论 -->
            '<div class="nav_con show">'+
                '<h4>2017年报告期内核心进整理分析</h4>'+
                '<h5 class="show_row6">本集团以建设具有核心竞争优势的现代金融服务企业的愿景为引领，围绕全面提升综合化金融服务能力、打造高绩效全能型银行集团的战略目标，以推进“集团化、专业化、数字化、轻型化、国际化、集约化”战略任务为主线，以“做强交易银行、做强投行与资管、做强同业与托管、做零售与小微、做强投行与资管、做强交易银行”。补充文字补充文字补充文字补充文字补充文字补充文字补充文字</h5>'+
                 +temp0+
            '</div>'+
        // <!-- 公司言论 -->
            '<div class="nav_con">'+
                '<h4>公司言论公司言论公司言论公司言论</h4>'+
                '<h5 class="show_row6">本集团以建设具有核心竞争优势的现代金融服务企业的愿景为引领，围绕全面提升综合化金融服务能力、打造高绩效全能型银行集团的战略目标，以推进“集团化、专业化、数字化、轻型化、国际化、集约化”战略任务为主线，以“做强交易银行、做强投行与资管、做强同业与托管、做零售与小微、做强投行与资管、做强交易银行”。补充文字补充文字补充文字补充文字补充文字补充文字补充文字</h5>'+
                +temp1+
            +'</div>' +
        '</div>';

    var temp = '<div class="bd"><div class="mb">'+tagBody+'</div></div>';

    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}

/**
 * 帮助引导问题
 * @param result
 */
function setPresetQuestionOld(result) {
    console.log("你可以这样问我");
    var list = result.data;

    var listP = '';
    list.forEach(function (item, index) {
        if (index <= 4) {
            listP += '<p onclick="freeQuestion(\'' + item + '\')">“' + item + '”</p>';
        }
    });

    var temp = '<h3>你可以这样问我：</h3>' + listP;
    $('#divHelp').append(temp);


}

/**
 * 新版首页问题
 * @param result
 * @param isShow 主动推送进入小e isShow ==true  显示首页； isShow ==  false不显示首页
 * @param personalResult 个性化首页查询结果
 */
function setNewPresetQuestion (result, isShow, personalResult) {
    if (!result || !result.data) {
        return;
    }
    // 您可能关注的
    var userFocus = '';
    // 个性化首页结果
    if (personalResult) {
        var focusList = personalResult.data.userQuestions || [];
        if (focusList.length > 0) {
            userFocus += '<div class="swiper-slide">' +
                            '<div class="box">' +
                                '<div class="hd">您可能关注的</div>' +
                                    '<ul class="bd personalizedCustomization">';
            for (var i in focusList) {
                if (focusList[i].question) {
                    if(focusList[i].dimension === '资讯'){
                        userFocus += "<li onclick=\"showInformationDetail('" + focusList[i].dimensionUniqueKey + "','" + focusList[i].dimension + "','homePage','" + focusList[i].indexId + "')\">" + focusList[i].question + '</li>';
                    }else {
                        var from = '来源：个性化首页';
                        //参数 依次为  sendTxt, showTxt, voiceQuestion, isPopup,questionId,userQuestionId
                        userFocus += '<li onclick="freeQuestion(\'' + focusList[i].question + '\',\'\',\'\',\'\',\'' + focusList[i].questionsId + '\',\'' + focusList[i].indexId + '\',\'' + from + '\')">' + focusList[i].question + '</li>';
                    }
                }
            }
            userFocus += '</ul>' +
                  '<div class="btn_refresh" style="display: '+(focusList.length<=5?'none':'')+'" data-pageNo="1" data-totalPage="'+Math.ceil(focusList.length/5)+'" data-totalCount="'+focusList.length+'" onclick="getPresetQuestionByPage(event)"><span><i class="icon-refresh"></i><em>换一换</em></span></div>' +
              '</div>' +
          '</div>';
        }
    }

    var recommendQuestion = result.data.recommendQuestion;
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
            tagQlist += '<li style="display: '+displayCls+'" onclick="freeQuestion(\''+qList[i].recommendQuestion+'\')">' + qList[i].recommendQuestion + '</li>'
        }
        tagQlist += '</ul>' +
                  '<div class="btn_refresh" style="display: '+(qList.length<=5?'none':'')+'" data-pageNo="1" data-totalPage="'+Math.ceil(qList.length/5)+'" data-totalCount="'+qList.length+'" onclick="getPresetQuestionByPage(event)"><span><i class="icon-refresh"></i><em>换一换</em></span></div>' +
              '</div>' +
          '</div>';
    }

    var tagCard =
        '<div class="md_AIRecommend">' +
            '<div class="swiper-container">' +
                '<div class="swiper-wrapper">' +
      userFocus +
                    tagQlist +
                '</div>' +
            '</div>' +
            '<div class="swiper-pagination"></div>' +
        '</div>';

    if (tagQlist) {
        $('#divHelp').append(tagCard).show();
        // setHelpCss(1);
    }
}

/**
 * 首页 智能推荐 热门语句 页面样式
 */
function setHelpCss(t) {
    if (1 === t) {
        t = '';
    }
    /* 首页 智能推荐 begin */
    certifySwiper = new Swiper('#divHelp' + t + ' .md_AIRecommend .swiper-container', {
        //        initialSlide :2,    //设置初始个数，从0开始
        watchSlidesProgress: true,
        keyboard: true,
        slidesPerView: 1.4,     //容器能够同时显示的slides数量
        centeredSlides: true,   //active slide会居中，而不是默认状态下的居左
        //        loop: true,             //循环。默认：false
        //        autoplay: true,         //自动播放。默认：false
        pagination: {
            el: '#divHelp' + t + ' .swiper-pagination',
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
