
var stockCode;
var stockName;
var platform;
var tabIndex = 0;
var tab0 = 0;
var tab1 = 0;
var tab2 = 0;
var tab3 = 0;
$(document).ready(function () {
    stockCode = getQueryString('stockCode');
    stockName = getQueryString('stockName');
    platform = getQueryString('platform');
    tab0 += 1;

    if(!stockCode){
        stockCode = 'sh600600';
        stockName = '青岛啤酒';
    }
    initChart(stockCode,stockName);
});

$(".footer>ul>li").click(function(e){
    tabIndex = $(this).index();
    $(".footer>ul>li").removeClass("tab_red").children('em').removeClass("tab_emred");
    $(this).addClass("tab_red").children("em").addClass("tab_emred");
    $("#mainLine").children().addClass("hidd");
    $("#mainLine>div").eq($(this).index()).removeClass("hidd");
    if(tab0 ==0 || tab1 ==0 || tab2 == 0 || tab3 == 0){
        initChart(stockCode,stockName);
    }
    if($(this).index() == 0){
        tab0 += 1;
    }
    if($(this).index() == 1){
        tab1 += 1;
    }
    if($(this).index() == 2){
        tab2 += 1;
    }
    if($(this).index() == 3){
        tab3 += 1;
    }
});


function initChart(code,name) {
    code = code.substr(2,6);
    var t = generateRandomClassName('');
    if(tabIndex == 0){
        var target = newKlineCYQ.getTarget(t);
        $('#day').html(target);

        newKlineCYQ.init(stockCode,code,name,'c',t,false);
    }
    if(tabIndex == 1){
        var target = newKlineCYQ_week.getTarget_week(t);
        $('#week').html(target);

        newKlineCYQ_week.init(stockCode,code,name,'c',t);
    }
    if(tabIndex ==2){
        var target = newKlineCYQ_month.getTarget_month(t);
        $('#month').html(target);

        newKlineCYQ_month.init(stockCode,code,name,'c',t);
    }
    if(tabIndex ==3){
        var target = newKlineCYQ_min.getTarget_min(t);
        $('#min').html(target);

        newKlineCYQ_min.init(stockCode,code,name,'c',t);
    }
}

/**
 * 关闭页面
 */
function closePage() {
    try{
        if(platform === 'android')
            window.contestapp.back();
        else if(platform === 'ios')
            window.location.href = ("objc://dismiss");
    }catch (e){
        saveLog('jsError', e.message, 'dist-of-chips.js', 0, 'closePage()', e.stack.toString());
    }
}
