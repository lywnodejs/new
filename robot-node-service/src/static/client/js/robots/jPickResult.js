
var resultParams = {
  conditions: ''  //URL参数中的条件
};


// 是否正在查询
var isSearching = false;

$(document).ready(function () {
    // URL中的条件参数
    resultParams.conditions = getQueryString('conditions') || '';
    if(resultParams.conditions){
        var temp = JSON.parse(resultParams.conditions);
        for(var i=0; i<temp.length; i++) {
            temp[i].intervalMap = temp[i].intervals[0];
            delete temp[i].intervals;
        }
        // console.log(temp)
        resultParams.conditions = JSON.stringify(temp);
        getDataFromFix(resultParams.conditions);
    }
    else if (localStorage) {
        // if(urlParams.platform !== 'ios'){
            var queryTxt = localStorage.getItem('searchConditions');
            // alert(queryTxt)
            if (queryTxt){
                getDataFromFix(queryTxt);
            }
        // }
    }
});

/**
 * ios原生调用
 * @param params
 */
function callFromApp(params) {
    if(params && !resultParams.conditions){
        resultParams.conditions = params;
        getDataFromFix(params);
    }
}

/**
 * 条件选股
 * @param result
 * @param showInteractiveView 是否展示与原生交互部分
 */
function pickStockByCondition(result, showInteractiveView) {
    // console.log(result)
    // 无答案处理
    if(!result.data || !result.data.stocks || result.data.stocks.length === 0){
        noAnswer('没有查到符合条件的股票');
        return;
    }

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
            labelConditions += '<b onclick="showMoreWord(\''+item+'\')">'+truncateString(item, 14)+'</b>';
        else
            labelConditions += '<b>'+item+'</b>';

        //如果存在此条件，则标题需要展示额外的说明
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
    for(var i=0; i<len; i++)
    {
        item = result.data.stocks[i];

        //如未传股票名称那么从行情数据中取
        if(item.stockName)
            stockName = item.stockName;
        else
            stockName = (item.quotation?item.quotation.name:'') || item.stockCode;

        //股票列，弹窗中的股票名称不可点击
          tagStockCol += '<li onclick="stockClick(\''+item.marketType+'\',\''+item.stockCode+'\',\''+stockName+'\')">';
        tagStockCol +=
                                '<p>'+stockName+'</p>'+
                                '<h6>'+item.stockCode+'</h6>'+
                            '</li>';

        //最新价
        if(item.quotation){
            newPrice = item.quotation.newprice ? (item.quotation.newprice/10000).toFixed(2) : '--';
            raise = !isNaN(item.quotation.raise) ? (item.quotation.raise/10000).toFixed(2) : '--';
        }else{
            newPrice = '--';
            raise = '--';
        }

        var cls = 't_gray';
        if(raise > 0)
            cls = 't_red';
        else if(raise < 0)
            cls = 't_green';

        //停牌股判断
        if(item.quotation && item.quotation.isStop === 1){
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

                //拼条件，过长字符截断
                if(type === '所属热点') {
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
                    if ((''+colValue).length < 10)
                        arrConditions[j] += '<li>'+colValue+'</li>';
                    else
                        arrConditions[j] += '<li onclick="showMoreWord(\''+colValue+'\')">'+truncateString(colValue, 10)+'</li>';
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
    // if(showExtraTitle)
    //     timeStr += '，股票停牌不计入数据统计';

    //是否展示箭头
    var tagArrow = '';
    if(colCount > 1)
        tagArrow = '<i class="icon-arrow_shape_left"></i>';

    //主标签
    var tagBody =
        // '<h6 class="date">'+timeStr+'</h6>'+
        '<div class="condition clearfix">'+
            '<h5 class="fl">已选条件:</h5>'+
            '<div id="'+conditionsId+'" class="conditionDetail">'+
                labelConditions+
            '</div>'+
        '</div>'+
        '<div class="backPosition"></div>'+

        // 头
        '<div class="box_title">'+
            '<span class="fl">筛选结果('+result.data.totalCount+')</span>'+
            '<em class="fr">'+timeStr+'</em>'+
        '</div>'+

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
        '</div>';

    //追加答案到页面
    $('.content').html(tagBody);
    $('footer').show();

    var ul_num = $(".box_conStock .conStock ul").length,
        ul_total = ul_num > 1 ? 50 * ul_num + "%" : '100%',
        ul_w = 100 / ul_num + "%";
    //表格
    $(".box_conStock .conStock .box").css("width",ul_total);
    $(".box_conStock .conStock ul").css("width",ul_w);

    /* 条件选股 */
    $(".box_conStock .conStock").scroll(function(){
        if ($(this).scrollLeft() > 20){
            $(this).siblings(".icon-arrow_shape_left").hide();
        }
        else{
            $(this).siblings(".icon-arrow_shape_left").show();
        }
    });

    /* 筛选条件 表格内只显示最新价 */
    $(".box_conStock .conStock").each(function() {
        var ul_num = $(this).find("ul").length;
        if( ul_num == 1){
            $(this).find("ul").addClass("ul_1");
            $(this).parents(".box_conStock").children(".icon-arrow_shape_left").hide();
        }
    });

    //继续筛选点击
    $('#'+keepConditionsId).click(function () {
        $('#txaConditions').html(result.data.conditions.join('，'));
        $('#pickStockConditionBox').show();
    });
}

/**
 * 无答案样式
 * @param msg
 */
function noAnswer(msg) {
    var temp = '<div id="noMatchView" class="noData">'+
                    '<i></i>'+
                    '<h5>'+msg+'</h5>'+
                    // '<div class="conditionDetail" style="padding-top: 30px; text-align: center"><b onclick="gotoPickPage()" style="color: #4479ef;font-size: 1rem;padding: 0.5rem 1rem;border-radius: 1.5rem;">重新筛选</b></div>'+
                '</div>';
    $('body').html(temp);
}

/**
 * 点击股票去App个股详情页
 * @param marketType
 * @param stockCode
 * @param stockName
 */
function stockClick(marketType, stockCode, stockName) {
    var params = {
        pageId: 'hs_market_stock_detail',
        stockCode : stockCode
    };

    if(urlParams.appKey === 'appEzt' || urlParams.appKey === 'appTopC')
    {
        // 去App
        if(urlParams.platform === 'android'){
            commonCallback('navigationNative', JSON.stringify(params));
            // baiduTrackEvent('android股票详情','click','选股结果页-股票点击');
        }
        else if (urlParams.platform === 'ios') {
            commonCallback('routerNative', JSON.stringify(params));
            // baiduTrackEvent('ios股票详情','click','选股结果页-股票点击');
        }
    }
}

//策略名称输入
function strategyChange() {
    var txt = $('#txtStrategyName').val();
    $('#btnSaveCondition').attr('class', txt ? 'button' : 'buttonNo');
    $('#strategyErrMsg').hide();
}

/**
 * 保存当前条件为我的策略
 */
function saveCustomConditions(event) {
    var className = event.currentTarget.className;
    if(className === 'buttonNo')
        return;

    var strategyName = $('#txtStrategyName').val();
    strategyName = $.trim(strategyName);
    if (strategyName) {
        var customConditions = [];
        if (localStorage.customConditions) {
            customConditions = JSON.parse(localStorage.customConditions);
        }

        if(customConditions.length >= 9){
            $('#strategyErrMsg').html('最多只能保存9个自定义策略').show();
            // alert('最多只能保存9个自定义策略');
            return;
        }

        if (strategyName.length > 7) {
            $('#strategyErrMsg').html('条件名称过长').show();
            // alert('条件名称过长');
            return;
        } else {
            for (var i = 0; i < customConditions.length; i++) {
                if (customConditions[i].strategyName === strategyName) {
                    // alert('名称已存在');
                    $('#strategyErrMsg').html('名称已存在').show();
                    return;
                }
            }
        }

        if (localStorage)
        {
            var searchConditions = '';
            if(resultParams.conditions)
                searchConditions = JSON.parse(resultParams.conditions);
            else if(localStorage.searchConditions)
                searchConditions = JSON.parse(localStorage.searchConditions);
            else {
                showMoreWord('没有可供保存的条件');
            }

            if(searchConditions)
            {
                customConditions.push({strategyName: strategyName, conditions: searchConditions});
                localStorage.customConditions = JSON.stringify(customConditions);
                // 从缓存中移除查询条件
                localStorage.removeItem('searchConditions');
                //
                closeSaveBox();
                $('footer').hide();
                showMoreWord('保存成功');
                $('.content').css('bottom', 0);
                baiduTrackEvent('保存策略', 'click', strategyName);
            }
        }else{
            showMoreWord('当前设备不支持保存策略');
        }
    } else {
        $('#strategyErrMsg').html('请输入有效字符').show();
        // alert('请输入策略名称');
    }
}

//点击遮罩部分时隐藏弹窗
function hidePopUp(event) {
    if(event.target.className === 'fullScreen'){
        closeSaveBox();
    }
}

//打开保存弹窗
function showSaveBox() {
    $('.bg').show();
    $('.fullScreenFixed').show();
    $('.choosePanel').show();
    $('.moreStategy').hide();
    baiduTrackEvent('保存策略按钮', 'click', '')
}

//关闭保存弹窗
function closeSaveBox() {
    $('#txtStrategyName').val('');
    $('.fullScreenFixed').hide();
    $('.bg').hide();
}

/**
 * 展示条件详情弹窗
 * @param conditionName
 */
function showMoreWord(conditionName){
    $('.bg').show();
    $('.choosePanel').hide();
    $('.fullScreenFixed').show();
    $('.wordPanel').find('b').html(conditionName);
    $('.moreStategy').show();
    baiduTrackEvent('更多内容弹窗', 'click', conditionName)
}

/**
 * 隐藏条件详情弹窗
 * @param conditionName
 */
function hideWordPanel(conditionName){
    $('.bg').hide();
    $('.fullScreenFixed').hide();
    $('.wordPanel').find('b').html('');
    $('.moreStategy').hide();
}

/**
 * 根据条件查询结果
 * @param params
 */
function getStockByConditions(params) {
    if(isSearching)
        return;
    else
        isSearching = true;

    var url = '/robot/semantic/conditionalStock/stocks';
    $.ajax({
        type: "POST",
        url: url,
        data: params,
        contentType: "application/json",
        timeout: 10000,
        success: pickStockByCondition,
        complete: function (XMLHttpRequest) {
            if(XMLHttpRequest.status >= 400)
                noAnswer('查询失败，请稍后重试');
        }
    })
}

// 固定问答查询
function getDataFromFix(conditions) {
    if(isSearching)
        return;
    else
        isSearching = true;
    // console.log(conditions)

    var url = HttpUrl + "/semantic-api-service/api/qa/fix";

    var questions = []
    conditions = JSON.parse(conditions)
    for (var i=0; i<conditions.length; i++) {
        if (conditions[i].fromRobot)
            questions.push(conditions[i].conditionName)
        else
            questions.push(conditions[i].intervalMap.talk)
    }
    // console.log(questions)

    var params = {}
    params.predicateType = '条件选股';
    params.question = questions.join(',');
    try {
        params.userId = urlParams.userId;
        params.clientId = urlParams.clientId;
        params.organization = urlParams.appKey;
    } catch (e) {
    }
    // params.fundAccount = fundAccount;
    // params.recordLog = recordLog;
    $.ajax({
        type: "get",
        url: url,
        data: params,
        dataType: "jsonp",
        timeout: 20000,
        jsonp: "callback",
        success: function (json) {
            // console.log(json);
            pickStockByCondition(json)
        }
    });
}

//条件选股：查询热点关联原因，并在弹窗中展示
function getRelatedReason(subjectCode, subjectName, subjectMarket, subjectRawValue) {
  expoitFixedAnswerForShare(subjectCode, subjectName, subjectMarket, subjectRawValue, '行业个股推荐理由', function (result) {
    var content = '';
    if (result.answerResultType !== '呼叫投顾' && result.data.list && result.data.list.length>0) {
      var item = result.data.list[0];
      content = item.analyseText || item.text;
      content = replaceLineBreak(content);
      var cludeTitleContent = "<h4 style='font-size:0.875rem;padding:3px 0;font-weight:bold;'>" + (item.title || '') + "</h4>";
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
    showMoreWord(cludeTitleContent)
  }, null)
}

/**
 * 固定回答获取个股解析
 */
function expoitFixedAnswerForShare(subjectCode, subjectName, subjectMarket, subjectRawValue, predicateType, success, errorHandler) {
  var url = HttpUrl + "/semantic-api-service/api/qa/fix";
  $.ajax({
    type: "get",
    url: url,
    data: {
      subjectCode: subjectCode,
      subjectName: subjectName,
      subjectMarket: subjectMarket,
      subjectRawValue: subjectRawValue,
      predicateType: '行业个股推荐理由',
      userId: urlParams.userId,
      clientId: urlParams.clientId,
      organization: urlParams.appKey
    },
    timeout: 20000,
    success: success,
    error: errorHandler
  })
}
