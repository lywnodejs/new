/**
 * Created by BoBo on 2017-08-07.
 */

//中长期
function midAndLongTermSuggest() {
    requestFixedAnswer({
        predicateType: '股票推荐',
        attribute: '明年',
        attributeType: '时间'
    }, '中长期具有投资价值的个股', '', true)
}

function exportShowMore(className, subjectCode, subjectName, subjectMarket, subjectRawValue, predicateType, timeType, num) {
    $("." + className).parents(".box_show_ol").find("li:nth-child(3) h6").html("【展开】");
    $("." + className).find("li:nth-child(3) h6").html("【收起】");
    if ($("." + className).hasClass("on")) {
        $("." + className).removeClass("on");
        $("." + className).find("li:nth-child(3) h6").html("【展开】");
    } else {
        $("." + className).siblings().removeClass("on");
        $("." + className).addClass("on");
    }
    $("." + className).siblings().find("> h5").slideUp();
    $("." + className).find("ul").siblings("h5").slideToggle();

    var ifRequest = $("." + className).find("h5")[1].innerHTML != '' ? true : false;
    if (!$('.' + className).hasClass('on') || ifRequest) {

    } else {
        var attribute = timeType;
        if (timeType === '行业短期股票推荐') {
            attribute = '短期';
        } else if (timeType === '行业中长期股票推荐') {
            attribute = '中长期';
        }
        if (timeType === '行业短期股票推荐' || timeType === '行业中长期股票推荐') {
            expoitFixedAnswerForShare(subjectCode, subjectName, subjectMarket, subjectRawValue, predicateType, function (result) {
                var content;
                if (result.answerResultType !== '呼叫投顾' && result.data.list && result.data.list.length>0) {
                    var item = result.data.list[0];
                    content = item.analyseText || item.text;
                    content = replaceLineBreak(content);
                    var cludeTitleContent = "<p style='font-size:0.875rem;padding:3px 0;font-weight:bold;'>" + (item.title || '') + "</p>";
                    var redH = "<s class='t_red'>" + num + "</s>";
                    if (cludeTitleContent.indexOf(num) !== -1) {
                        var regH = "/" + num + "/g";
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
                    cludeTitleContent += content;
                } else {
                    cludeTitleContent = handleErrorRequest(className, '暂无数据');
                }
                $("." + className).find("> h5").html(cludeTitleContent);
            }, function (XMLHttpRequest,textStatus,errorThrown) {
              handleErrorRequest(className);
                saveLog('ajaxError', 'readyState:'+XMLHttpRequest.readyState+',status:'+XMLHttpRequest.status+',statusText:'+XMLHttpRequest.statusText, 'answer-2.js', 0, 0, errorThrown);
            });
        } else {
            if (timeType === "中长期") {
                var subjectRawValue = num;
                expoitFixedAnswerForShare(subjectCode, subjectName, subjectMarket, subjectRawValue, predicateType, function (result) {
                    var content;
                    if (result.answerResultType !== '呼叫投顾' && result.data.list && result.data.list.length>0) {
                        var item = result.data.list[0];
                        content = item.analyseText || item.text;
                        content = replaceLineBreak(content);
                        var cludeTitleContent = "<p style='font-size:0.875rem;padding:3px 0;font-weight:bold;'>" + (item.title || '') + "</p>";
                        var redH = "<s class='t_red'>" + num + "</s>";
                        if (cludeTitleContent.indexOf(num) !== -1) {
                            var regH = "/" + num + "/g";
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
                        cludeTitleContent += content;
                    } else {
                        cludeTitleContent = handleErrorRequest(className, '暂无数据');
                    }
                    $("." + className).find("> h5").html(cludeTitleContent);
                }, function (XMLHttpRequest,textStatus,errorThrown) {
                  handleErrorRequest(className);
                    saveLog('ajaxError', 'readyState:'+XMLHttpRequest.readyState+',status:'+XMLHttpRequest.status+',statusText:'+XMLHttpRequest.statusText, 'answer-2.js', 0, 0, errorThrown);
                });
            } else {
                expoitFixedAnswer(subjectCode, subjectName, subjectMarket, subjectRawValue, predicateType, attribute, function (result) {
                    var content;
                    if (result.answerResultType !== '呼叫投顾' && result.data.list && result.data.list.length>0) {
                        var item = result.data.list[0];
                        content = item.analyseText || item.text;
                        content = replaceLineBreak(content);
                        var cludeTitleContent = "<p style='font-size:0.875rem;padding:3px 0;font-weight:bold;'>" + (item.title || '') + "</p>";
                        var redH = "<s class='t_red'>" + num + "</s>";
                        if (cludeTitleContent.indexOf(num) !== -1) {
                            var regH = "/" + num + "/g";
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
                        cludeTitleContent += content;
                    } else {
                        cludeTitleContent = handleErrorRequest(className, '暂无数据');
                    }
                    $("." + className).find("> h5").html(cludeTitleContent);
                }, function (XMLHttpRequest,textStatus,errorThrown) {
                  handleErrorRequest(className);
                    saveLog('ajaxError', 'readyState:'+XMLHttpRequest.readyState+',status:'+XMLHttpRequest.status+',statusText:'+XMLHttpRequest.statusText, 'answer-2.js', 0, 0, errorThrown);
                });
            }
        }
    }
}
//错误UI展示
function handleErrorRequest(className, errMsg) {
    var temp =
            '<span class="box_error">'+
                '<i class="icon-error"></i><span>'+(errMsg ? errMsg : '加载失败')+'</span>'+
            '</span>';
    if(errMsg)
        return temp;
    else
        $("." + className).find("> h5").html(temp);
}


//展示更多的内容
function showMoreTheme(className, subjectCode, subjectName, subjectMarket, subjectRawValue, predicateType, source) {
    if ($("." + className).hasClass("on") == false) {
        baiduTrackEvent('行业概念展开','click',source+':行业概念展开');//百度统计
        $("." + className).siblings().removeClass("on");
        $("." + className).addClass("on");
        $("." + className).siblings().find("i").attr("class", "icon-arrow_open");
        $("." + className).find("i").attr("class", "icon-arrow_closed2");
    } else {
        $("." + className).find("i").attr("class", "icon-arrow_open");
        $("." + className).removeClass("on");
    }
    $("." + className).siblings().find("h5").slideUp();
    $("." + className).find("h5").slideToggle();
    var ifRequest = $("." + className).find("h5")[0].innerHTML != '' ? true : false;
    if (!$('.' + className).hasClass('on') || ifRequest) {
    } else {
        industryFixedAnswer(subjectCode, subjectName, subjectMarket, subjectRawValue, predicateType, function (result) {
            var content = '';
            if (result.answerResultType == '行业推荐理由' || result.answerResultType == '个股行业推荐理由') {
                if (result.data.hasOwnProperty('list')) {
                    var item = result.data.list[0];
                    content = "<p style='font-size:0.875rem;padding:3px 0;font-weight:bold;'>" + (item.title || '') + "</p>";

                    if (result.answerResultType == '个股行业推荐理由') {
                        content = "<p style='font-size:0.875rem;padding:3px 0;font-weight:bold;'>" + (item.title || '') + "</p>";
                    }

                    var redT = "<s class='t_red'>" + subjectRawValue + "</s>";
                    if (content.indexOf(subjectRawValue) != -1) {
                        var regT = "/" + subjectRawValue + "/g";
                        content = content.replace(eval(regT), redT);
                    }
                    var sharesR = "<s class='t_red'>" + subjectCode + "</s>";
                    if (content.indexOf(subjectCode) != -1) {
                        var regR = "/" + subjectCode + "/g";
                        content = content.replace(eval(regR), sharesR);
                    }
                    var sharesRC = "<s class='t_red'>" + subjectName + "</s>";
                    if (content.indexOf(subjectName) != -1) {
                        var regRC = "/" + subjectName + "/g";
                        content = content.replace(eval(regRC), sharesRC);
                    }
                    content += item.analyseText || item.text;
                    $("." + className).find("> h5").html(content);
                }
            } else {
                content += handleErrorRequest(className, "暂无数据");
                $("." + className).find("> h5").html(content);
            }
        })

    }
}
//展示更多行业
function showMoreIndustry(className, subjectName, attribute) {
    if ($("." + className).hasClass("on") == false) {
        $("." + className).siblings().removeClass("on");
        $("." + className).addClass("on");
    } else {
        $("." + className).removeClass("on");
    }
    $("." + className).siblings().find("h5").slideUp();
    $("." + className).find("h5").slideToggle();
    var ifRequest = $("." + className).find("h5")[0].innerHTML != '' ? true : false;
    if (!$('.' + className).hasClass('on') || ifRequest) {

    } else {
        industryRecommendationReasons(subjectName, attribute, function (result) {
            if (result.answerResultType === '行业推荐理由') {
                var content = "";
                // 赵老师那边的
                if (result.data.list && result.data.list.length > 0) {
                    if (attribute === "短期") {
                        content += result.data.list[0].analyseResults['sh000001短期行业推荐'] || result.data.list[0].analyseResults['sh000001短期日策略行业推荐'] || result.data.list[0].analyseResults['sh000001日策略行业推荐'] || result.data.list[0].analyseResults['sh000001短期日策略大盘行情展望'] || result.data.list[0].analyseResults['sh000001日策略创业板分析'] || result.data.list[0].analyseResults['sh000001行业推荐'] || result.data.list[0].analyseResults['行业分析'] || result.data.list[0].analyseResults['sh000001大盘行情展望'] || result.data.list[0].analyseResults['sh000001短期大盘行情展望'];
                        var contentS = result.data.list[0].analyseResults['sh000001短期行业推荐'] || result.data.list[0].analyseResults['sh000001短期日策略行业推荐'] || result.data.list[0].analyseResults['sh000001日策略行业推荐'] || result.data.list[0].analyseResults['sh000001短期日策略大盘行情展望'] || result.data.list[0].analyseResults['sh000001日策略创业板分析'] || result.data.list[0].analyseResults['sh000001行业推荐'] || result.data.list[0].analyseResults['行业分析'] || result.data.list[0].analyseResults['sh000001大盘行情展望'] || result.data.list[0].analyseResults['sh000001短期大盘行情展望'];
                        if (contentS == result.data.list[0].analyseResults['sh000001短期行业推荐'] && result.data.list[0].analyseResults['sh000001短期日策略行业推荐']) {
                            content += "<br><p style='height:10px;'></p>" + result.data.list[0].analyseResults['sh000001短期日策略行业推荐'];
                        }
                    } else {
                        var keyPoints = result.data.list[0].analyseFlags;
                        keyPoints.forEach(function (item) {
                            content += '<br/>' + result.data.list[0].analyseResults['sh000001' + item];
                        });
                        var contentS = result.data.list[0].analyseResults['sh000001中长期行业推荐'] || result.data.list[0].analyseResults['sh000001中长期日策略行业推荐'] || result.data.list[0].analyseResults['sh000001日策略行业推荐'] || result.data.list[0].analyseResults['sh000001中长期日策略大盘行情展望'] || result.data.list[0].analyseResults['sh000001日策略创业板分析'] || result.data.list[0].analyseResults['sh000001行业推荐'] || result.data.list[0].analyseResults['行业分析'] || result.data.list[0].analyseResults['sh000001大盘行情展望'] || result.data.list[0].analyseResults['sh000001中长期大盘行情展望'];
                        if (contentS == result.data.list[0].analyseResults['sh000001中长期行业推荐'] && result.data.list[0].analyseResults['sh000001中长期日策略行业推荐']) {
                            content += "<br><p style='height:10px;'></p>" + result.data.list[0].analyseResults['sh000001中长期日策略行业推荐'];
                        }
                    }
                    content = "<p style='font-size:0.875rem;padding:3px 0;font-weight:bold;'>" + result.data.list[0].title + "</p>" + content;
                } else {
                    content += handleErrorRequest(className, "暂无数据");
                }

                // 结束赵老师那里
                var redT = "<s class='t_red'>" + subjectName + "</s>";
                if (content.indexOf(subjectName) !== -1) {
                    var regT = "/" + subjectName + "/g";
                    content = content.replace(eval(regT), redT);
                }

                content = replaceLineBreak(content);
                $("." + className).find("> h5").html(content);
                $(".box_show_tl .on>h5").show();
            }
        }, function (XMLHttpRequest,textStatus,errorThrown) {
          handleErrorRequest(className);
            saveLog('ajaxError', 'readyState:'+XMLHttpRequest.readyState+',status:'+XMLHttpRequest.status+',statusText:'+XMLHttpRequest.statusText, 'answer-2.js', 0, 0, errorThrown);
        })
    }
}

//股票推荐答案输出
function stockRecommend(result) {
    var word = result.hasOwnProperty('words') ? (result.words + result.preAnswerContent) : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);


    //长期还是短期
    var timeType = result.data.timeType;
    // 专家观点
    var expertOpt = '';
    var arrIndustry = result.data.recommendStocks ? result.data.recommendStocks : [];
    // 技术选股
    var tagTechAnalysis = '';
    var arrRecStock = result.data.techniqueRecommendStocks ? result.data.techniqueRecommendStocks : [];
    var symbolList = '';
    var predicateType = '股票推荐理由';

    try{
      if (result.questionAnalyse[0].hasOwnProperty('entity') && result.questionAnalyse[0].entity.length > 0) {
        predicateType = '行业个股推荐理由';
      }
    }catch (e) {
        saveLog('jsError', e.message, 'answer-2.js', 0, 'stockRecommend()', e.stack.toString());
    }

    // 拼股票代码
    for (var i = 0; i < arrIndustry.length && i<10; i++) {
        symbolList += arrIndustry[i].marketType + "_" + arrIndustry[i].stockCode + ",";
    }
    for (var n = 0; n < arrRecStock.length && n<10; n++) {
        symbolList += arrRecStock[n].marketType + "_" + arrRecStock[n].stockCode + ",";
    }

    var industryNum = '';
    var tagSuggest = '';
    var hideClass = generateRandomClassName('hideClass');
    for (var j = 0; j < arrIndustry.length; j++) {
        var ifOn = '';
        var content = '';
        var showTxt = '展开';
        industryNum = arrIndustry[j].industry;
        var lineClass = generateRandomClassName('recommended');
        var display = j > 9 ? 'none' : '';
        // 股票推荐答案中的股票行情分页取，否则多了取不到
        expertOpt += "<div symbol='"+(arrIndustry[j].marketType+"_"+arrIndustry[j].stockCode)+"' class='box_bd " + ifOn + " " + lineClass + " " + (j>9?hideClass:'') + "' style='display: "+display+"'>" +
                          "<ul>" +
                              "<li onclick=\"alterQuestion('" + arrIndustry[j].stockName + "')\">" +
                                  "<p>" + arrIndustry[j].stockName + "</p>" +
                                  "<h6>" + arrIndustry[j].stockCode + "</h6>" +
                              "</li>" +
                              "<li id='"+('stockColor'+arrIndustry[j].stockCode)+"'>" +
                                  "<p class='"+('stockPrice'+arrIndustry[j].stockCode)+"'></p>" +
                                  "<h6 class='"+('stockRise'+arrIndustry[j].stockCode)+"'></h6>" +
                              "</li>" +
                              "<li onclick=\"exportShowMore(\'" + lineClass + "','" + arrIndustry[j].stockCode + "','" + arrIndustry[j].stockName + "','" + arrIndustry[j].marketType + "','" + industryNum + "','" + predicateType + "','" + timeType + "','" + industryNum + "')\">" +
                                  "<h5>" + industryNum + "</h5>" +
                                  "<h6>【" + showTxt + "】</h6>" +
                              "</li>" +
                          "</ul>"+
                          "<h5>" + content + "</h5>" +
                      "</div>";
    }

    if (timeType === '短期') {
        tagTechAnalysis += "<div class='box_hd2 box_hd2_blue'>" +
                              "<span>技术选股</span>" +
                              "<b><i class='i_t'></i><i class='i_b'></i></b>" +
                              "<em>专注趋势，捕捉操作机会</em>" +
                          "</div>";


        if(arrRecStock.length>0){
            tagTechAnalysis += "<div class='box_show_ol2'><ol><li>股票名称</li><li></li></ol>";
            for (var m = 0; m < arrRecStock.length; m++) {
                tagTechAnalysis += "<ul>" +
                  "<li onclick=\"alterQuestion('" + arrRecStock[m].stockName + "')\">" +
                  "<p>" + arrRecStock[m].stockName + "</p>" +
                  "<h6>" + arrRecStock[m].stockCode + "</h6>" +
                  "</li>" +
                  "<li id='"+('stockColor'+arrRecStock[m].stockCode)+"'>" +
                  "<p class='"+('stockPrice'+arrRecStock[m].stockCode)+"'></p>" +
                  "<h6 class='"+('stockRise'+arrRecStock[m].stockCode)+"'></h6>" +
                  "</li>" +
                  "</ul>";
            }
        }else{
            tagTechAnalysis += "<div class='box_show_ol2'><ol><li style='text-align: center;'>今日无波段买点个股</li></ol>";
        }
        tagTechAnalysis += "</div>";
    }

    if (timeType === '短期') {
        tagSuggest = '<div class="box_tl_hot">' +
                        '<h5><a onclick="midAndLongTermSuggest()">您还想了解中长期有投资价值的个股吗？</a></h5>' +
                        '<h5><a onclick="freeQuestion(\'' + '最近热点概念' + '\')">最近热点概念？</a></h5>' +
                    '</div>';
    } else if (timeType === '中长期') {
        tagSuggest = '<div class="box_tl_hot">' +
                        '<h5><a onclick="freeQuestion(\'' + '股票推荐' + '\')">您还想了解近期可关注的个股吗？</a></h5>' +
                        '<h5><a onclick="freeQuestion(\'' + '最近热点概念' + '\')">最近热点概念？</a></h5>' +
                    '</div>';
    }

    //某个概念下的股票
    var temp = '';
    if (timeType === '行业短期股票推荐') {
        temp = "<div class='bd'>";
        temp += "<div class='mb'>";
        temp += "<div class='box_show_ol'><ol><li>股票名称</li><li></li><li>强相关概念</li></ol>";
        temp += expertOpt + "</div>";

        if (arrIndustry.length > 10) {
            var moreId = generateRandomClassName('moreId');
            temp += "<div id=" + moreId + " class='box_load'><a onclick=showMoreArticle('" + hideClass + "','" + moreId + "',5,1)>点击加载更多</a></div>";
        }
        temp += getRatingLabel(result) + "</div>";

        temp += "</div>";
        temp += "</div></div>";
    }
    else {
        temp = "<div class='bd'><div class='mb'>";
        temp += tagTechAnalysis;
        temp += "<div class='box_hd2 box_hd2_red'><span>专家观点</span><b><i class='i_t'></i><i class='i_b'></i></b><em>跟踪市场热点，深挖个股投资价值</em></div>";
        temp += "<div class='box_show_ol'><ol><li>股票名称</li><li></li><li>强相关概念</li></ol>";
        temp += expertOpt + "</div>";
        temp += tagSuggest + getRatingLabel(result) + "</div>";
        temp += "</div></div></div>";
    }

    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
    scrollToQuestion();

    // 取行情
    getPriceList(symbolList, function (priceResult) {
        predicateType = '行业个股推荐理由';

        priceResult.items.forEach(function (quota, index) {
          $('p.stockPrice'+quota.stkCode).each(function (index, item) {
            $(this).html(quota.newPrice.toFixed(2))
          });
          $('h6.stockRise'+quota.stkCode).each(function (index, item) {
            $(this).html(quota.rise.toFixed(2)+'%')
          });
          $('li#stockColor'+quota.stkCode).each(function (index, item) {
            $(this).attr('class', quota.rise > 0 ? 't_red' : (quota.rise===0?'':'t_green'))
          });
        })
    });
}

function alterQuestion(txt) {
    freeQuestion(txt);
}


/**
 * 所属题材答案输出
 * @param result
 * @param isPopup  是否添加到弹出框
 * @param source  来源  百度统计
 */
function personalTheme(result, isPopup, showInteractiveView,source) {
    if (!isPopup) {
        var word = result.hasOwnProperty('words') ? result.words + result.data.guide : result.data.guide;
        sendPreAnswerContent(word, '', '', result.qId);
    }else{
        if(popTitle){
            $('#bottomPopupTitle').html(result.questionAnalyse[0].entity[0].property.name+popTitle);
        }
    }

    var personThemeList = "";
    var list = result.data.recommends.entries;
    var totalCount = list.length;
    var item = list;
    var itemData = result.questionAnalyse[0].entity[0].property;
    var ifOn = '';
    var fname = '';
    var fClass = '';
    var randomTime = new Date().getTime();
    var hideClass = '';
    var hideClassR = '';

    if (!isPopup) {
        personThemeList += "<div class='bd'><div class='mb'>";
    } else {
        personThemeList += "<div><div>";
    }

    personThemeList += "<div class='box_show_tl'>";
    hideClass = generateRandomClassName('hideClass');
    var j = 0;
    for (var i = 0; i < totalCount; i++) {
        // 过滤掉“酒”的概念，杨超
        if (['高档白酒', '酒','茅台酒','高端酒','名酒','基酒','次高端白酒','地产酒','烟酒'].indexOf(item[i].term) !== -1) {
            continue;
        }
        var lineClass = generateRandomClassName('hideArticle');
        if (i == 0) {
            fClass = lineClass;
        }
        ifOn = i == 0 ? '' : '';
        if (i == 0) {
            fname = item[i].term;
        }
        hideClassR = j >= 10 ? hideClass : '';
        if (isPopup) {
            personThemeList += "<li style='" + (j >= 10 ? 'display:none' : '') + "' onclick=\"showMoreTheme(\'" + lineClass + "','" + itemData.code + "','" + itemData.name + "','" + itemData.marketType + "','" + item[i].term + "','个股行业推荐理由','" + source + "')\" class=\'" + ifOn + " " + lineClass + " " + hideClassR + "' style='" + (j >= 5 ? 'display:none' : '') + "'><a class='box_hd'><span onclick=\"industryClick('" + item[i].term + "','" + isPopup + "')\">" + (j + 1) + "、" + item[i].term + "</span><i class='icon-arrow_open'></i></a><h5></h5></li>"
        }
        else {
            personThemeList += "<li class=\'" + ifOn + " " + lineClass + " " + hideClassR + "' style='" + (j >= 10 ? 'display:none' : '') + "'><a class='box_hd'><span onclick=\"industryClick('" + item[i].term + "','" + isPopup + "')\">" + (j + 1) + "、" + item[i].term + "</span><i class='icon-arrow_open' onclick=\"showMoreTheme(\'" + lineClass + "','" + itemData.code + "','" + itemData.name + "','" + itemData.marketType + "','" + item[i].term + "','个股行业推荐理由','" + source + "')\"></i></a><h5></h5></li>"

        }
        j++
    }

    var moreId = 'moreId' + randomTime;
    if (j > 10) {
        personThemeList += "</div><div id=" + moreId + " class='box_load'><a onclick=showMoreArticle('" + hideClassR + "','" + moreId + "',5)>点击加载更多</a></div>";
    } else {
        personThemeList += "</div>";
    }

    if (!isPopup) {
        personThemeList += generateGuideQuestionList(result.guidanceQuestions);
        personThemeList += getRatingLabel(result, showInteractiveView) + '';
        appendAnswer(personThemeList, " ", result.qId);
        getQuestionTabs(result);
        scrollToQuestion();
    } else {
        appendAnswerToPopup(personThemeList);
    }
}

/**
 * 展示概念成分股
 * @param result
 */
function showPlate(result, isPopup, showInteractiveView) {
    //输出前值语
    if (!isPopup) {
        var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
        sendPreAnswerContent(word, '', '', result.qId);
    }
    if(popTitle){
        $('#bottomPopupTitle').html(result.questionAnalyse[0].entity[0].property.name+popTitle);
    }
    var list = result.data.list;
    var temp = '';
    var len = list.length;
    var id = 'stock' + new Date().getTime();
    var moreId = 'more' + new Date().getTime();
    var hideMore = 'hide' + new Date().getTime();

    var caption = '';
    if (len > 9) {
        caption = "<div class='btn_show'>" + '<a id="' + moreId + '" class="btn_down ' + moreId + '" onclick="showAllTheme(\'' + hideMore + '\',\'' + moreId + '\')">展开<i class="icon-arrow_closed"></i></a><a style="display: none;" onclick="hideAllTheme(\'' + moreId + '\',\'' + hideMore + '\')" class="btn_up ' + hideMore + '">收起<i class="icon-arrow_open"></i></a>' + "</div>";
    } else {
        caption = "<div class='btn_show'></div>";
    }
    //第一次最多显示9支
    for (var i = 0; i < len; i++) {
        var item = list[i];
        if (i <= 8) {
            temp += '<li><span onclick="getPersonalTheme(\'' + result.spanId + '\', \'' + list[i].name + '\')">' + item.name + '</span></li>';
        } else {
            temp += '<li class="showMoreTheme" style="display:none;"><span onclick="getPersonalTheme(\'' + result.spanId + '\', \'' + list[i].name + '\')">' + item.name + '</span></li>';
        }
    }

    //整体内容
    var body = '';
    if (!isPopup) {
        body += '<div class="mb">';
    }
    body += '<div class="md_tlbox md_col3">' + caption;
    body += '<ul id="' + id + '">';
    body += temp;
    body += '</ul>';
    body += caption;
    if (!isPopup) {
        body += generateGuideQuestionList(result.guidanceQuestions);
        body += getRatingLabel(result, showInteractiveView);
    }
    body += '</div>';
    if (!isPopup) {
        body += '</div>';
    }
    if (!isPopup) {
        appendAnswer(body, "", result.qId);
        getQuestionTabs(result);
        scrollToQuestion();
    } else {
        appendAnswerToPopup(body);
    }
}

/**
 * 行业推荐
 * @param result
 */
function industryRecommend(result) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);

    var personThemeList = "";
    var listLong = result.data.hasOwnProperty('longRecommendIndustries')?result.data.longRecommendIndustries.entries:[];
    var totalCountLong = listLong.length;
    var itemLong = listLong;
    var listShort = result.data.hasOwnProperty('shortRecommendIndustries')?result.data.shortRecommendIndustries.entries:[];
    var totalCountShort = listShort.length;
    var itemShort = listShort;
    var ifOn = '';
    var fname = '';
    var fClass = '';

    personThemeList += "<div class='bd'>";
    personThemeList += "<div class='mb'>";
    personThemeList += "<div class='box_hd2 box_hd2_red'><span>短期市场热点</span><b><i class='i_t'></i><i class='i_b'></i></b>";
    personThemeList += "</div>";
    personThemeList += "<div class='box_show_tl box_show_tlBD'>";

    var i = 0;
    var lineClass = '';
  for (i = 0; i < totalCountShort && i < 3; i++) {
        lineClass = generateRandomClassName('hideArticle');

        if (i == 0) {
            fClass = lineClass;
        }
        ifOn = i == 0 ? '' : '';
        if (i == 0) {
            fname = itemShort[i].term;
        }
        personThemeList += "<li class=\'" + ifOn + " " + lineClass + "'><div class='box_hd'><span onclick=\"industryClick('" + itemShort[i].term + "')\">" + (i + 1) + "、" + itemShort[i].term + "</span><a class='icon-arrow_open' onclick=\"showMoreIndustry(\'" + lineClass + "','" + itemShort[i].term + "','短期')\"></a></div><h5></h5></li>";
    }

    personThemeList += "</div>";
    personThemeList += "<div class='box_hd2 box_hd2_blue'><span>中长期投资方向</span><b><i class='i_t'></i><i class='i_b'></i></b>";
    personThemeList += "</div>";
    personThemeList += "<div class='box_show_tl box_show_tlBD'>";

    for (i = 0; i < totalCountLong && i < 3; i++) {
        lineClass = generateRandomClassName('hideArticle');
        ifOn = i == 0 ? '' : '';
        personThemeList += "<li class=\'" + ifOn + " " + lineClass + "'><div class='box_hd'><span onclick=\"industryClick('" + itemLong[i].term + "')\">" + (i + 1) + "、" + itemLong[i].term + "</span><a class='icon-arrow_open' onclick=\"showMoreIndustry(\'" + lineClass + "','" + itemLong[i].term + "','中长期')\"></a></div><h5></h5></li>";
    }

    personThemeList += "</div>";
    personThemeList += generateGuideQuestionList(result.guidanceQuestions);
    personThemeList += getRatingLabel(result);
    personThemeList += "</div>";
    personThemeList += "</div>";

    appendAnswer(personThemeList, "", result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}

function industryClick(industryName, isPopup) {
    // if (!isPopup || isPopup == 'undefined') {
        requestFixedAnswer({
            subjectType: '行业概念',
            subjectRawValue: industryName,
            predicateType: '行业'
        }, industryName, '', true)
    // } else {
    //
    // }
    closePopup()
}


/**
 * 推荐列表
 * @param result
 */
function recommendedQuestion(result) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);

    var temp = '';
    $.each(result.data, function (index, item) {
        temp += '<li onclick=labelClick(event)><span>' + item + '</span></li>'
    });

    var inputEl = '';
    if (appKey !== 'appAvatar') {
        inputEl = '<li id="' + recQId + '" class="reEnter"><span>我要重新输入股票名称或代码</span></li>'
    } else {
        inputEl = '<li>&nbsp;</li>'
    }

    var recQId = 'recQ' + new Date().getTime();
    var list = '<div class="md_v1 md_tlbox">' +
                    '<ul>' +
                        temp +
                        inputEl +
                    '</ul>' +
                    '<div class="mgtNegative">' +
                        getRatingLabel(result, true) +
                    '</div>' +
                '</div> ';
    appendAnswer(list, 'mb', result.qId);

    if (appKey === 'appEzt') {
        var tagButtons =
                      '<div style="padding-top: 10px;">' +
                          '<div class="md_fastNav">' +
                              '<ul class="alignRight">' +
                                '<li class="" onclick="recordQuestion(\'' + result.spanId + '\',\'' + result.qId + '\');callAdviser();">人工服务</li>' +
                              '</ul>' +
                          '</div>' +
                      '</div> ';
        appendAnswer(tagButtons, '', result.qId);
        resetCallButton();
    }

    getQuestionTabs(result);
    scrollToQuestion();
    $('#' + recQId).on('click', showInputPanel);
}

// 事件概述
function eventOverview(result, isPopup) {
    if (!isPopup) {
        var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
        sendPreAnswerContent(word, '', '', result.qId);
    }

    var reportList = result.data.list;
    var item;
    var temp = "";
    var eventLength = result.data.list.length;

    if (!isPopup) {
        temp += "<div class='bd'>";
        temp += "<div class='mb mb_tab'>";
    }

    if (eventLength > 1) {
        // 事件概述的tabs
        temp += "<nav>";
        for (var i = 0; i < eventLength; i++) {
            var ifEventOn = i == 0 ? 'on' : '';
            var eventName = changeNumToHan(i + 1);
            temp += "<a class=' " + ifEventOn + "' onclick=changeTabs(event)>事件" + eventName + "</a>";
        }
        temp += "</nav>";
    }

    for (var i = 0; i < reportList.length; i++) {
        item = reportList[i];
        var symbol = getSymbolByEntity(result.questionAnalyse[0].entity, false);
        var sourceFrom = item.docType,
            organization = sourceFrom === "weixin" ? item.weChatName : item.organization,
            author = item.author;
        var ifEventShow = i == 0 ? 'show' : '';
        temp += "<div class='nav_con " + ifEventShow + "'>";
        temp += " <h6 class='space_between'>";
        temp += "<span>来源：" + organization + "／" + author + "</span>";
        temp += "<span class='date'>" + changeTime(item.publishAt) + "</span>";
        temp += "</h6>";
        //此事件内容标题
        var analyseFlagsList = item.analyseFlags;
        //此事件内容
        var analyseResultsList = item.analyseResults;
        var ifShowD = "show";
        for (j = 0; j < analyseFlagsList.length; j++) {
            var lineClass = generateRandomClassName('hideArticle');
            var analyseResultsContent = analyseResultsList[symbol + analyseFlagsList[j]];
            temp += "<div class='box_show box_show_btn " + lineClass + "'>";
            temp += "  <h4>" + analyseFlagsList[j] + "</h4>";
            temp += "  <h5 class='show_row5 '>" + analyseResultsContent + "</h5>";
            if (analyseResultsContent.length < 120) {
                ifShowD = 'hide';
            }
            temp += "   <a " + ifShowD + " class='a_more a" + lineClass + "' onclick=showMoreh5AndShowUp('" + lineClass + "')>展开<i class='icon-arrowD'></i></a>";
            temp += "<a style='display:none;' class='a_more aShow" + lineClass + "' onclick=hideMoreh5AndShowUp('" + lineClass + "')>收起<i class='icon-arrowT'></i></a>";
            temp += "</div>";
        }
        temp += "</div>";
    }
    if (!isPopup) {
        temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result);
        temp += "</div>";
        temp += "</div>";
    }

    if (!isPopup) {
        appendAnswer(temp, '', result.qId);
        getQuestionTabs(result);
    } else {
        appendAnswerToPopup(temp);
    }
}
// 事件概述tab的切换
function changeTabs(event) {
    $(event.target).addClass("on").siblings().removeClass("on");
    var order = $(event.target).index();
    $(event.target).parent().siblings().each(function () {
        $(this).removeClass("show");
    });
    $(event.target).parent().siblings().eq(order).addClass("show");
}

// 竞争优势
function competitiveEdge(result, isPopup, showInteractiveView) {
    if (!isPopup) {
        var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
        sendPreAnswerContent(word, '', '', result.qId);
    }

    var reportList = result.data.list;
    var randomTime = new Date().getTime();
    var moreId = 'moreId' + randomTime;
    var item;
    var temp = "";
    if (!isPopup) {
        temp += "<div class='bd'>";
        temp += " <div class='mb'>";
    } else {
        temp += " <div></div>";
    }
    var ifShowD = 'show';
    var hideClass = generateRandomClassName('hideClass');
    for (var i = 0; i < reportList.length; i++) {
        item = reportList[i];
        var symbol = getSymbolByEntity(result.questionAnalyse[0].entity, false);
        var sourceFrom = item.docType;
        var analyseResultsList = item.analyseResults,
            organization = sourceFrom === "weixin" ? item.weChatName : item.organization,
            author = item.author;
        var index = reportList[i].analyseFlags.indexOf('竞争优势');
        var analyseTxt = reportList[i].analyseFlags[index===-1?0:index];
        var analyseResultsContent = analyseResultsList[symbol + analyseTxt];
        var lineClass = generateRandomClassName('hideArticle');
        var ifHideMore = i > 1 ? "none" : "block";
        var ifHideClass = i > 1 ? hideClass : "";

        temp += "<div style='display:" + ifHideMore + "' class='" + ifHideClass + " box_show box_show_btn " + lineClass + "'>";
        temp += "<h4 class='space_between'>";
        temp += "<span>" + organization + " | " + author + "</span>";
        temp += "<span class='date'>" + changeTime(item.publishAt) + "</span>";
        temp += "</h4>";
        temp += "<h5 class='show_row5'>" + analyseResultsContent.replace(/\n/g, '<br>') + "</h5>";
        if (analyseResultsContent.length < 120) {
            ifShowD = 'hide';
        }
        temp += "<a class='" + ifShowD + " a_more a" + lineClass + "' onclick=showMoreh5AndShowUp('" + lineClass + "')>展开<i class='icon-arrowD'></i></a>";
        temp += "<a style='display:none;' class='a_more aShow" + lineClass + "' onclick=hideMoreh5AndShowUp('" + lineClass + "')>收起<i class='icon-arrowT'></i></a>";
        temp += "</div>";
    }
    if (reportList.length > 2) {
        temp += "<div id=" + moreId + " class='box_load'><a onclick=showMoreArticle('" + hideClass + "','" + moreId + "')>点击加载更多</a></div>";
    }
    temp += isPopup ? '' : (generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView));
    temp += "</div>";
    temp += "</div>";
    if (!isPopup) {
        appendAnswer(temp, '', result.qId);
        getQuestionTabs(result);
    } else {
        appendAnswerToPopup(temp);
    }

}
// 财务指标
function financialIndexNew(result, isPopup, showInteractiveView) {
    if (!isPopup) {
        var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
        sendPreAnswerContent(word, '', '', result.qId);
    }
    var items = result.data;
    var temp = "";
    var property = result.questionAnalyse[0].entity[0].property
    var boxClass = generateRandomClassName('sumUp_finance2');

    if (!isPopup) {
        temp += "<div class='bd'>";
        temp += "<div class='mb sumUp_finance2 "+boxClass+"'>";
        temp += '<div class="stock">' +
            '<div>'+property.name+'<span class="num">'+property.code+'</span></div>' +
            '<div class="num t_red"></div>' +
            '</div>'
    } else {
        temp += "<div class='sumUp_finance2'>";
    }
    //蓝底白字
    temp += '<div class="box_bgBlue">' +
        '<b>'+items[0].conclusion+'</b></div>'

    //时间
    temp += '<div class="box_fix"> <div class="nav"><ul>'

    var year, date;

    for(var i=0; i<items.length; i++){
        year = formatTime(items[i].endAt, 'year')
        date = formatTime(items[i].endAt, 'date')
        var li = '<li onclick="changeFinaTabs(this,\'' + result.answerResultType +'\')">'
        if(i === 0){
            li = '<li class="on" onclick="changeFinaTabs(this,\'' + result.answerResultType +'\')">'
        }
        temp += li +
            '<h5>'+year+'</h5>' +
            '<h6>'+date+'</h6>' +
            '<b></b>' +
            '</li>'
        year -= 1
    }

    temp += "</ul>" +
        "<div class='bottom'></div>" +
        "</div>" +
        "<div class='content'>" +
        "<ol>" +
        "<li></li>" +
        "<li>财务数据</li>" +
        "<li>行业排名</li>" +
        "</ol>" +
        "</div></div>"; //box_fix结束


    // 内容
    temp += setFinanceCont(result); //box_con结束
    if (!isPopup) {
        temp += getRatingLabel(result, showInteractiveView);
        temp += "</div>"; //mb结束
    }
    temp += "</div>"; //bd结束

    if (isPopup) {
        appendAnswerToPopup(temp);
    } else {
        appendAnswer(temp, 'md_left_v2', result.qId);
        //股票价格和涨跌幅
        //生成随机数，作为class名
        var symbol = property.marketType + property.code
        getStockPrice(symbol, setStockPrice, boxClass)
        getQuestionTabs(result);
    }
}

function setFinanceCont(result){
    var items = {}
    var dimensions = []
    var temp = ''
    console.log(result)
    temp += '<div class="content_ul">'
    for(var i = 0; i < 4; i++){
        if(i===0){
            temp += '<div class="box_con show">'
        }else {
            temp += '<div class="box_con">'
        }

        if(!result.data[i]){
            dimensions = [
                {"indicators":[{"name":"市销率"},{"name":"净资产收益率"},{"name":"加权平均成本"},{"name":"投资回报率"},{"name":"每股现金流"}],"name":"关键指标"},
                {"indicators":[{"name":"总资产收益率"},{"name":"毛利率"},{"name":"净利率"}],"name":"盈利能力"},
                {"indicators":[{"name":"营业收入同比增长"},{"name":"净利润同比增长"}],"name":"成长能力"},
                {"indicators":[{"name":"资产负债率"},{"name":"流动负债/总负债"},{"name":"流动比率"},{"name":"速动比率"}],"name":"偿债能力"},
                {"indicators":[{"name":"总资产周转率"},{"name":"存货周转率"},{"name":"应收账款周转天数"}],"name":"运营能力"}];
        }else {
            items = result.data[i]
            dimensions = items.dimensions
        }
        for (var cont = 0; cont < dimensions.length; cont++) {

            var levelHtml = ''
            //设置不同水平下的标签
            if(cont !== 0 && result.data){
                levelHtml = setLevel(cont, dimensions[cont].level)
            }
            temp += '<h6>'+dimensions[cont].name+levelHtml+'</h6>'

            var indicators = dimensions[cont].indicators

            for(var dimen=0; dimen<indicators.length; dimen++){

                temp += '<ul>' +
                    '<li>'+indicators[dimen].name+'</li>';
                if(!result.data[i]){
                    temp += '<li>--</li>' +
                        '<li>--<em>/</em><span>--</span></li>'
                }else {
                    temp += '<li>'+indicators[dimen].valueToDisplay+'</li>' +
                        '<li>'+(indicators[dimen].rank?indicators[dimen].rank:'--')+'<em>/</em><span>'+items.comTotal+'</span></li>'
                }
                temp += '</ul>'
            }

        }
        temp += '</div>'
    }

    temp += '</div>'
    return temp;

}

function setLevel(cont, level) {
    var levelCla = ''
    if(cont === 1){
        levelCla = 'icon-ir_yl' + level
    }else if(cont === 2){
        levelCla = 'icon-ir_cz' + level
    }else if(cont === 3){
        if(level<4){
            levelCla = 'icon-ir_nl' + level
        }else {
            levelCla = 'icon-ir_zwfx' + level
        }
    }else if(cont === 4){
        levelCla = 'icon-ir_nl' + level
    }
    return '<i class="'+levelCla+'"></i>'
}


function changeFinaTabs(thisLi,title){
    var aN = $(thisLi).index()
    var con_ul = $(thisLi).parents(".box_fix").siblings(".content_ul").find(".box_con").eq(aN);
    $(thisLi).addClass("on").siblings().removeClass("on");
    con_ul.addClass("show");
    con_ul.siblings().removeClass("show");

    var txt = $(thisLi)[0].textContent+'点击';
    baiduTrackEvent(title+':年份标签','click',title+':'+txt);//百度统计
}

function labelClick(event) {
    freeQuestion(event.target.innerText);
}

// 显示输入框弹窗
function showInputPanel() {
    $(".box_reEnter_v2").addClass("show").removeClass("hide");
    $("#txtSymbol").focus();
}

//重新输入股票名称后点击确定
function confirmInputSymbol(event) {
    var txt = $('#txtSymbol').val();
    if (txt) {
        freeQuestion(txt);
        $('#txtSymbol').val('');
        $(".box_reEnter_v2").addClass("hide").removeClass("show");
    }
}
//引导页我知道了
function iKnowGuide() {
    localStorage.isGuide = true;
    $(".page_guide").hide();
    if (params.appVersion)
        localStorage.appVersion = params.appVersion;
    notifyAppFirstRun();
}

/**
 * 股东列表
 * @param result
 */
function shareHolderList(result, showInteractiveView) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);

    var data = result.data;
    var list = "<h6 class='date'>截止日期：" + changeTime(result.time) + "</h6><ul class='box_liBar'>";
    var per;
    for (var i = 0; i < data.length; i++) {
        if (i == 0) {
            topPer = data[i].holdingPercent;
            per = '100';
        } else {
            per = (data[i].holdingPercent / topPer) * 100;
        }

        list += "<li><h5>" + (i + 1) + "、" + data[i].stockholderName + "</h5>";
        list += "<div class='box_bar'><b style='width: " + per + "%'><span>" + data[i].holdingPercent + "%</span></b></div></li>";
    }
    list += "</ul>" + getRatingLabel(result, showInteractiveView);

    appendAnswer(list, 'mb', result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}

// 通用单个答案
function universalSingleAnswer(result) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);
    var temp = "";

    var item = result.data;
    var messageContent = "";
    var updateAt = "";
    var messageTitle = "";

    var time = result.hasOwnProperty("time") ? result.time : "";
    temp += "<div class='bd'>";
    temp += "<div class='mb'>";

    temp += time ? "<h6 class='date'>更新日期：" + changeTime(time) + "</h6>" : "";
    temp += "<div class='box_show'>";
    for (var i = 0; i < item.length; i++) {
        messageContent = item[i].hasOwnProperty("messageContent") ? item[i].messageContent : "";
        updateAt = item[i].hasOwnProperty("updateAt") ? item[i].updateAt : "";
        messageTitle = item[i].hasOwnProperty("messageTitle") ? item[i].messageTitle : "";
        temp += "<h4>" + messageTitle + "</h4>";
        temp += "<h5><b></b>" + messageContent + "</h5>";
        temp += "<h6 class='date'>" + changeTime(updateAt) + "</h6>";
    }

    temp += "</div>";
    temp += "</div>";
    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}

// 通用答案
function universalAnswer(result, showInteractiveView) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;

    var showBody = true;
    // 如果引导语为空
    if (!word) {
        // 且类型为通用答案，并且没有推荐问题
        if (result.guidanceQuestions && result.guidanceQuestions.length===0) {
            // 那么引导语展示为通用答案中的文本
            if (result.data) {
                word = result.data.answerContent || '';
                showBody = false;
            }
        }
    }

    sendPreAnswerContent(word, '', '', result.qId, result);

    if (showBody) {
        var temp = "";

        temp += "<div class='bd'>";
        temp += "<div class='mb'><h5>";
        temp += result.data.answerContent.replace(/\n/g, '<br>') + "</h5>";
        temp += generateGuideQuestionList(result.guidanceQuestions)
        temp += getRatingLabel(result, showInteractiveView);
        temp += "</div>";
        temp += "</div>";

        appendAnswer(temp, '', result.qId);
    }

    getQuestionTabs(result);
    scrollToQuestion();
}
/**
 * 高管简介
 * @param result
 * @param showInteractiveView 是否展示原生界面
 */
function executiveProfile1(result, showInteractiveView) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);

    var winW = $(window).width(),
        fs = 0.875,
        fl = 1.5,
        fEM, fLH, maxH, txtH;

    //判断屏幕宽度是320的时候
    if (winW <= 320) {
        fEM = 14;
    } else {
        fEM = 16;
    }

    fLH = fEM * fs * fl;    //字行高
    maxH = fLH * 5;         //最多显示高度
    var randomTime = new Date().getTime();
    var data = result.data;
    var moreId = 'moreId' + randomTime;
    var list = "";
    var ifShowD = 'show';

    var hideClass = generateRandomClassName('hideClass');
    for (var i = 0; i < data.length; i++) {
        var lineClass = generateRandomClassName('hideArticle');
        data[i].resume = data[i].resume || '';
        var cls = 'show_row5';
        if (data[i].resume.length < 120) {
            ifShowD = 'hide';
            cls = ''
        } else {
            ifShowD = 'show';
        }

        if (i > 1) {
            list += "<div style='display:none;' class='box_show box_show_btn " + lineClass + " " + hideClass + "'><h4>" + data[i].managerName + "<b>/</b><span>" + data[i].post + "</span></h4>";
            list += "<h6><b>任职日：</b>" + generateDate(data[i].pubDate) + "</h6><h5 class='"+cls+"'>" + data[i].resume.replace(/\n/g, '<br>') + "</h5>";
            list += "<a class='a" + lineClass + " a_more " + ifShowD + "' onclick=showMoreh5('" + lineClass + "')>展开<i class='icon-arrowD'></i></a></div>";
        } else {
            list += "<div class='box_show box_show_btn " + lineClass + "'><h4>" + data[i].managerName + "<b>/</b><span>" + data[i].post + "</span></h4>";
            list += "<h6><b>任职日：</b>" + generateDate(data[i].pubDate) + "</h6><h5 class='"+cls+"'>" + data[i].resume.replace(/\n/g, '<br>') + "</h5>";
            list += "<a class='a" + lineClass + " a_more " + ifShowD + "' onclick=showMoreh5('" + lineClass + "')>展开<i class='icon-arrowD'></i></a></div>";
        }
    }

    if (data.length > 2) {
        list += "<div id=" + moreId + " class='box_load'><a onclick=showMoreArticle('" + hideClass + "','" + moreId + "')>点击加载更多</a></div></div>";
    }
    list += "<div class='mgtNegative'>" + generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) + "</div>";

    appendAnswer(list, 'mb', result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}

function showMoreh5(className) {
    $("." + className).find("h5").removeClass("show_row5");
    $(".a" + className).removeClass("show").addClass("hide");
}
function showMoreh5AndShowUp(className) {
    $("." + className).find("h5").removeClass("show_row5");
    $(".a" + className).removeClass("show").addClass("hide");
    $(".aShow" + className).show();
}
function hideMoreh5AndShowUp(className) {
    $("." + className).find("h5").addClass("show_row5");
    $(".a" + className).removeClass("hide").addClass("show");
    $(".aShow" + className).hide();
}
function showMoreRow2AndShowUp(className) {
    $("." + className).find("h5").removeClass("show_row2");
    $(".a" + className).removeClass("show").addClass("hide");
    $(".aShow" + className).show();
}
function hideMoreRow2AndShowUp(className) {
    $("." + className).find("h5").addClass("show_row2");
    $(".a" + className).removeClass("hide").addClass("show");
    $(".aShow" + className).hide();
}

//点击题材或概念触发的fix接口
function getPersonalTheme(spanId, blockName) {
    var params = {
        subjectRawValue: blockName,
        subjectType: '行业概念',
        predicateType: '概念股'
    };
    requestFixedAnswer(params, blockName, '', true);
}
function showAllTheme(className, sClassName) {
    $(".showMoreTheme").show();
    $("." + className).show();
    $("." + sClassName).hide();
}
function hideAllTheme(className, hClassName) {
    $(".showMoreTheme").hide();
    $("." + className).show();
    $("." + hClassName).hide();
}

/**
 * 公司高管
 * @param result
 * @param showInteractiveView
 */
function companyExecutives(result, showInteractiveView) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);
    var data = result.data;
    var hideClass = generateRandomClassName('hideClass');
    var moreId = generateRandomClassName('moreId');
    var tagBody =
        '<div class="box_show_ol2 box_conExec">';
    if (data.length > 0) {
        tagBody += '<ol>' +
            '<li>姓名</li>' +
            '<li>职位</li>' +
            '<li>持股</li>' +
            '</ol>';
        data.forEach(function (item, index) {
            var ifHideClass = index > 4 ? 'none' : 'flex';
            var hideClassLine = index > 4 ? hideClass : '';
            var itemInfoList = item.infoList[0];
            if (typeof item === 'object') {
                tagBody +=
                    '<ul style="display:' + ifHideClass + '" class="' + hideClassLine + '" onclick="getExecutiveInfo(\'' + JSON.stringify(itemInfoList).replace(/"/g, '&quot;') + '\')">' +
                    '<li>' + item.managerName + '</li>' +
                    '<li><h6>' + itemInfoList.post + '</h6></li>' +
                    '<li>' + formatNumber(itemInfoList.hldAmount, 2, false) + '<i class="icon-arrow_closed"></i></li>' +
                    '</ul>';
            }
        });

        tagBody += '</div>';
    } else {
        tagBody += '<div><ul><li>暂无</ul></li></div></div>'
    }

    if (data.length > 5) {
        tagBody +=
            // <!--加载更多-->
            '<div id="' + moreId + '" class="box_load" onclick=showMoreArticle("' + hideClass + '","' + moreId + '",5)>' +
            '<a>查看更多</a>' +
            '</div>';
    }


    var temp = '<div class="bd"><div class="mb">' + tagBody;
    temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) + "</div></div>";

    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}
//查询高管详情
function getExecutiveInfo(data) {
    data = JSON.parse(data);
    var tagBody =
        '<div class="sumUp_conExec">' +
        '<div class="hd">' +
        '<h3>' + data.managerName + '</h3>' +
        '<b>/</b>' +
        '<h5>' + data.post + '</h5>' +
        '</div>' +
        '<h5><strong>任职日<span></span></strong><b>：</b>' + timeChange(data.managerStartdateTimestamp) + '</h5>' +
        '<h5><strong>持有股份</strong><b>：</b>' + formatNumber(data.hldAmount, '', false) + '</h5>' +
        '<h5><strong>持股比例</strong><b>：</b>' + addPerForMin(data.hldAmount, data.hldPercent) + '</h5>' +
        '<h5><strong>股权质押</strong><b>：</b>' + ifNone(data.pledgeStype) + formatNumber(data.totalPledgeSamount) + (data.pledgeStype ? '股' : '') + timeChangeForPledgeUpDate(data.pledgeUpDateTimestamp) + '</h5>' +
        '<h5><strong>高管简介</strong><b>：</b>' + ifUndefined(data.resume) + '</h5>' +

        '</div>';
    appendAnswerToPopup(tagBody);
    showPopup('公司高管');
}
/**
 * 高管图谱
 * @param result
 * @param showInteractiveView
 */
function executiveAtlas(result, showInteractiveView) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);

    var data = result.data;
    var hideClass = generateRandomClassName('hideClass');
    var moreId = generateRandomClassName('moreId');
    var boxClass = data.length > 0 ? 'box_execAtlas' : null;
    var tagBody = '<div class="' + boxClass + '">';

    if (data.length > 0) {
        data.forEach(function (item, index) {
            var ifHideClass = index > 1 ? 'none' : 'block';
            var hideClassLine = index > 1 ? hideClass : '';

            tagBody +=
                '<div style="display:' + ifHideClass + '" class="box ' + hideClassLine + '">' +
                '<h3>' + item.managerName + '</h3>';

            if (item.infoList && item.infoList.length > 0) {
                item.infoList.forEach(function (el, i) {

                    tagBody +=
                        '<ul>' +
                        '<li>' +
                        '<h5>' + (el.secName || '--') + '</h5>' +
                        '<h6 class="num">' + el.secCode + '</h6>' +
                        '</li>' +
                        '<li>' +
                        '<h5>' + el.post + '</h5>' +
                        '</li>' +
                        '<li>' +
                        '<h5 class="num">' + addPerForMin(el.hldAmount, el.hldPercent) + '</h5>' +
                        '<h6>持股比例</h6>' +
                        '</li>' +
                        '</ul>';
                });
            }

            tagBody += '</div>';
        });
    } else {
        tagBody += '<div><ul><li>暂无</li></ul></div>'
    }

    if (data.length > 2) {
        tagBody +=
            '<div id="' + moreId + '" class="box_load" onclick=showMoreArticle("' + hideClass + '","' + moreId + '",3)>' +
            '<a>查看更多</a>' +
            '</div>';
    }
    var temp = '<div class="bd"><div class="mb">' + tagBody + '</div>';
    temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) + "</div>";
    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}
/**
 * 持股变动
 * @param result
 * @param showInteractiveView
 */
function shareholdersInOrDe(result, showInteractiveView) {
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);

    var data = result.data || [];
    var hideClass = generateRandomClassName('hideClass');
    var moreId = generateRandomClassName('moreId');
    var tagBody =
        '<div class="box_timeLine box_timeLine_factor">' +
        '<div class="timeLine">' +
        '<ul>';

    var voiceTxt = '';
    if (data.length > 0) {
        data.forEach(function (item, index) {
            var ifHideClass = index > 4 ? 'none' : 'flex';
            var hideClassLine = index > 4 ? hideClass : '';

            var holdPercent = '';
            if(item.oldHldRate && item.newHldRate)
                holdPercent = '，持股比例由'+(item.oldHldRate||'--')+'%'+(item.chanType.replace('持',''))+'至'+(item.newHldRate||'--')+'%';

            var content = (item.chanReason ? '通过' : '') + (item.chanReason || '') + '以每股' + (formatNumber(item.chanPrice) || '--') + '元' + (item.chanAmount > 0 ? '增' : '减') + '持' + (formatNumber(Math.abs(item.chanAmount), '', false) || '--') + '股'+holdPercent+'。';
            tagBody +=
                '<li style="display:' + ifHideClass + '" class="' + hideClassLine + '">' +
                    '<dt>' +
                        '<b></b>' +
                        '<s><i></i></s>' +
                    '</dt>' +
                    '<dd>' +
                        '<div class="space_between">' +
                            '<span>' + item.shldName + '</span>' +
                        '</div>' +
                        '<div class="space_between">' +
                            '<span class="date">' + generateDate(item.chanEnd) + '</span>' +
                        '</div>' +
                        '<h6>' + (item.relatedPost || '') + (item.relatedName || '') + (item.managerRelation || '') + '</h6>' +
                        '<h5>' + content +'</h5>' +
                    '</dd>' +
                '</li>';

            if (index === 0) {
                voiceTxt = item.shldName + content;
            }
        });
    } else {
        tagBody +=
            '<li>' +
                '<dt>' +
                    '<b></b>' +
                    '<s><i></i></s>' +
                '</dt>' +
                '<dd>' +
                    '<div class="space_between">' +
                        '<span>暂无持股信息变动</span>' +
                    '</div>' +
                '</dd>' +
            '</li>';
    }
    tagBody +=
                '</ul>' +
            '</div>' +
        '</div>';

    if (data.length > 5) {
        tagBody +=
            '<div id="' + moreId + '" class="box_load" onclick=showMoreArticle("' + hideClass + '","' + moreId + '","5")>' +
            '<a>查看更多</a>' +
            '</div>';
    }

    // 语音
    playVoiceAnswerLite(voiceTxt);

    var temp = '<div class="bd"><div class="mb">' + tagBody;
    temp += generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) + "</div></div>";
    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}
// 获取列表（新股中签）
function getList(cp,ps,randomClass){
    var hasNextPage = true;
    var stocksList = '';
    getListStocks(cp,ps,function(result){
        hasNextPage = result.data.hasNextPage;
        result.data.infoList.forEach(function(item,index){
            stocksList+=
            '<ul>'+
                '<li onclick="stockFixQuestion(\'' + item.stockCode + '\', \'' + item.stockName + '\', \'\',\''+'个股综评'+'\')">'+
                    '<p>'+item.stockName+'</p>'+
                    '<h6>'+item.stockCode+'</h6>'+
                '</li>'+
                '<li class="t_red">'+(item.luckyProfit?item.luckyProfit.toFixed(0):'--')+'元</li>'+
                '<li>'+(item.stockCode.indexOf('688')===0?'--':(item.limitUpDays+'天'))+'</li>'+
                '<li>'+changeTime(item.listDate, '.')+'</li>'+
            '</ul>';
        });
        $('.'+randomClass).append(stocksList);
        if(!hasNextPage){
            $('.more_'+randomClass).hide();
        }else{
            var btn = '<a onclick=getList('+(cp+1)+','+ps+',"'+randomClass+'")>查看更多</a>'
            $('.more_'+randomClass).html(btn);
        }
    });
}
/**
 * 中签策略
 * @param result
 * @param showInteractiveView
 */
function drawingLotsStrategy(result, showInteractiveView){
    var word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
    sendPreAnswerContent(word, '', '', result.qId);

    var tagBody = '';
    var secName = result.data.secName || '--';
    var induSw = result.data.induSw || '--';
    var ipoPe = result.data.ipoPe || '';
    var indicatorPeTtm = result.data.indicatorPeTtm || '';
    var subnewPeTtm = result.data.subnewPeTtm || '';
    var randomClass = generateRandomClassName('randomClass');
    var cp = 1;
    var ps = 10;

    getList(cp,ps,randomClass);

    var secondNewList = '';
    var dailyFinList = result.data.dailyFin || []
    dailyFinList.forEach(function(item,index){
        secondNewList+='<h5>次新股里同行业的（近1年上市的新股）'+item.secName+'目前估值'+fixed2(item.peTtm)+'PE</h5>'
    });

    tagBody+=
        '<div class="bd">'+
            '<div class="mb">'+
                '<div class="box_hd2 box_hd2_red">'+
                    '<span>估值面</span>'+
                    '<b><i class="i_t"></i><i class="i_b"></i></b>'+
                    '<em></em>'+
                '</div>'+
                '<div class="tBox">'+
                    '<h5>'+secName+'属于'+induSw+'行业，发行估值为'+fixed2(ipoPe)+'PE，当前'+induSw+'板块整体估值是'+fixed2(indicatorPeTtm)+'PE</h5>'+
                    secondNewList+
                    '<h5>次新股整体估值'+fixed2(subnewPeTtm)+'PE</h5>'+
                '</div>'+
                '<div class="box_hd2 box_hd2_blue">'+
                    '<span>技术面</span>'+
                    '<b><i class="i_t"></i><i class="i_b"></i></b>'+
                    '<em></em>'+
                '</div>'+
                '<div class="tBox">'+
                    '<h5>在新股上市后如果放量，则需根据市场气氛和估值选择去留，近3个月上市公司表现</h5>'+
                '</div>'+
                '<div class="box_show_ol box_show_ol4 '+randomClass+'">'+
                    '<ol>'+
                        '<li>股票名称</li>'+
                        '<li>每中一签获利</li>'+
                        '<li>连续涨停</li>'+
                        '<li>上市时间</li>'+
                    '</ol>'+
                '</div>'+
                '<div class="box_load more_'+randomClass+'">'+
                    '<a onclick=getList('+(cp+1)+','+ps+',\''+randomClass+'\')>查看更多</a>'+
                '</div>'+
      generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) +
            '</div>'+
        '</div>';
        appendAnswer(tagBody, '', result.qId);
        getQuestionTabs(result);
        scrollToQuestion();
}

/**
 * 科创板资讯
 * @param res
 */
function kcbNews(res) {
    sendPreAnswerContent(res.preAnswerContent, '', '', res.qId);
    // 取科创板资讯列表 数据来源：华创官网投教知识栏目
    getEduArticles(function (result) {
        var list = result.data.list || [];

        var tagMore = '';
        var hideClass = '';
        var pageSize = 5;
        if (list.length > 10) {
            hideClass = generateRandomClassName('hide');
            var moreId = generateRandomClassName('moreId');
            tagMore =
                '<div id="' + moreId + '" class="box_load" style="padding: 5px 0 18px 0; margin-top: 0;" onclick="showMoreArticle(\'' + hideClass + '\', \'' + moreId + '\', \'' + pageSize + '\')">' +
                '<a>查看更多</a>' +
                '</div>'
        }

        var temp = "";
        temp += "<div class='bd'>";
        temp += "<div class='mb infoAndResearch'>";
        temp += "<div class='box_tl02'><h5>";
        for (var i = 0; i < list.length; i++) {
            temp += '<li class="'+(i >= pageSize?hideClass:'')+'" style="display: '+(i >= pageSize?'none':'')+';">' +
                        "<a onclick=\"showInformationDetail('" + list[i].infoId + "','科创板资讯')\">" + list[i].title + "</a>";
            if (list[i].hasOwnProperty('publishAt')) {
                temp += '<h6 class="t_gray">' + getDataGridTimeFormat(list[i].publishAt) + '</h6>';
            }
            temp += "</li>";
        }
        temp += "</h5></div>";
        temp += tagMore;
        temp += "</div>";
        temp += "</div>";

        appendAnswer(temp, '', res.qId);
        scrollToQuestion();
        getQuestionTabs(res);
    })
}

/**
 * 资金面回购
 * @param result
 * @param showInteractiveView
 */
function financialBuyback(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var data = [];
    if (result.data && result.data.messageDisps)
        data = result.data.messageDisps;
    var hideClass = generateRandomClassName('hideClass');

    var tagBody =
        '<div class="box_timeLine box_timeLine_factor">' +
            '<div class="timeLine">' +
                '<ul>';

    if (data.length > 0) {
        data.forEach(function (item, index) {
            var ifHideClass = index > 4 ? 'none' : 'flex';
            var hideClassLine = index > 4 ? hideClass : '';

            tagBody +=
                '<li style="display:' + ifHideClass + '" class="' + hideClassLine + '">' +
                    '<dt>' +
                        '<b></b>' +
                        '<s><i></i></s>' +
                    '</dt>' +
                    '<dd>' +
                        '<div class="space_between">' +
                            '<span>'+(JSON.parse(item.messageContent).status || '')+'</span>'+
                            '<span class="date">' + changeTime(item.publishAt) + '</span>' +
                        '</div>' +
                        '<h5 class="b_fa">' + item.messageDisp + '</h5>' +
                    '</dd>' +
                '</li>';
        });
    } else {
        tagBody +=
            '<li>' +
                '<dt>' +
                    '<b></b>' +
                    '<s><i></i></s>' +
                '</dt>' +
                '<dd>' +
                    '<div class="space_between">' +
                        '<span>暂无信息</span>' +
                    '</div>' +
                '</dd>' +
            '</li>';
    }

    tagBody +=
                '</ul>' +
            '</div>' +
        '</div>';

    if (data.length > 5) {
        var moreId = generateRandomClassName('moreId');
        tagBody +=
            '<div id="' + moreId + '" class="box_load" onclick=showMoreArticle("' + hideClass + '","' + moreId + '",5)>' +
                '<a>查看更多</a>' +
            '</div>';
    }

    var temp = '<div class="bd"><div class="mb">' + tagBody + generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result, showInteractiveView) + "</div></div>";

    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}
