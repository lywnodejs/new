/**
 * Created by xdy on 18-01-03.
 * K线，
 * chartTimeUtil 周K 月K  分钟线(60)
 * 页面初始化
 */
//chartTimeUtil
var newKlineCYQ = {
    getTarget: function(sn) {//KLine
        var temp ='<div id="containerCYQday'+sn+'" ></div>';
        return temp;
    },
    getTarget_CYQ_FS: function(sn) {
        var t = (new Date()).getTime();
        var temp =
            '<h6 class="date" id="lastShowDate'+sn+'">最后日期 '+chartTimeUtil.getTimeStr(t)+'</h6>'+
            '<div class="box_show">'+
            '<ul class="cmfb_shares">'+
            '<li class="cmfb_name" id="titleCYQ'+sn+'"></li>'+
            '</ul>'+
            '<div class="cmfb_cyq">'+
            '<div>'+
            '<div class="box_ChipDis" id="box_ChipDis'+sn+'" style="width: 220px; height: 210px;">'+
            '<div class="higPrice" id="higPrice'+sn+'">0.0</div>'+
            '<div class="lowPrice" id="lowPrice'+sn+'">0.0</div>'+
            '<ul id="ul_li'+sn+'"></ul>'+
            '</div>'+'</div>'+
            '<i id="fs'+sn+'" class="icon-full"></i>'+
            '</div>'+
            '</div>';
        return temp;
    },

    init:function(symbol,stockCode,stockName,type,mathRandom,showInteractiveView,url) {
        newKlineCYQ.emptyData();
        var _symbol='',_stockCode='',_stockName='';
        _symbol = symbol==null ? 'sh600600' : symbol;//sh603903
        _stockCode = stockCode;
        _stockName = stockName;

        newKlineCYQ.param.stockName = _stockName;
        newKlineCYQ.param.stockCode = _stockCode;
        newKlineCYQ.param.type = type==null ? 'v' : type;//横屏c还是竖屏v

        $('#titleCYQ'+mathRandom).html('<p>'+_stockName+'</p><h6>('+_stockCode+')</h6>');

        var height = document.body.clientHeight;
        var width = document.body.clientWidth;
        if(newKlineCYQ.param.type == 'c'){
            var cyqW = Math.floor(width*0.32);
            var cyqH = Math.floor(height*0.68);
            $('#box_ChipDis').css("width",cyqW);
            $('#box_ChipDis').css("height",cyqH);
            $('#ul_li').css("width",cyqW*0.8);
            $('.cloPrice').css("width",cyqW*0.8);
        }else{
            var cyqW = Math.floor(width*0.8);
            $('#box_ChipDis'+mathRandom).css("width",cyqW);
            $('#box_ChipDis'+mathRandom).css("height","210px");
            var ul_liW = Math.floor(width*0.8*0.8);
            $('#ul_li'+mathRandom).css("width",ul_liW);
        }

        //是否显示全凭  true显示  否则不显示
        if(showInteractiveView){
            $('#fs'+mathRandom).show();

        }else{
            $('#fs'+mathRandom).hide();
        }
        $('#fs'+mathRandom).click(function(e){
            chipsFullscreen(symbol,stockName);
        });

        if(_symbol){
            //根据股票代码查新名称
            var chartDivID = 'containerCYQday'+mathRandom;
            newKlineCYQChart.getKLine(_symbol,mathRandom,chartDivID,0,url);
        }
    },

    emptyData:function () {
        newKlineCYQ.param.type = 'v';//横屏c还是竖屏v
        newKlineCYQ.param.stockName = '';
        newKlineCYQ.param.stockCode = '';
    },

    param: {
        type:'v',
        stockName:'',
        stockCode:''
    },

    //数字格式化（亿、万）
    formatMoney:function (value,fix) {
        var re = /(\d{1,3})(?=(\d{3})+(?:\.))/g;//千分位 正则公式
        //保留小数的位数  只有曲线图保留整数
        if(fix != 0){
            fix = 2;
        }
        fix = Number(fix);
        value = Number(value);
        if(!isNaN(value))
        {
            var prefix = "";
            if(value < 0)
                prefix = "-";
            if(value === 0)
                return value.toFixed(fix);

            value = value.toFixed(fix);

            if(value < -10000 && value > -10000*10000)
                return  (value/10000).toFixed(fix) + '万';
            else if(value < -10000*10000)
                return  (value/100000000).toFixed(fix) + '亿';
            else if(value > 10000 && value < 10000*10000)
                return prefix + (value/10000).toFixed(fix) + '万';
            else if(value > 10000*10000)
                return prefix + (value/100000000).toFixed(fix) + '亿';
            else
                return value.replace(re, "$1,");
        }
        else
        {
            return '0.00';
        }
    },

    getNewObject:function () {
        var obj = {};
        return obj
    },
    /**
     *数组排序  得到最小值、最大值
     * @param arr
     * @param n
     * @param type(min.max)
     * @returns {*}
     */
    sortArr:function (arr,n,type) {
        var data = []; //根据n升序排列
        for(var i = 0;i<arr.length;i++){
            data.push(arr[i][n]);
        }
        data = data.sort(function(x, y){  return x - y;});
        if(type == 'min'){
            return data[0];
        }else if(type == 'max'){
            return data[arr.length-1];
        }
    }
};
//周K
var newKlineCYQ_week = {
    getTarget_week: function(sn) {
        var temp ='<div id="containerCYQweek'+sn+'" ></div>';
        return temp;
    },
    init:function(symbol,stockCode,stockName,type,mathRandom) {
        newKlineCYQ_week.emptyData();

        var _symbol='',
        _symbol = symbol==null ? 'sh600600' : symbol;//sh603903

        var height = document.body.clientHeight;
        var width = document.body.clientWidth;

        var cyqW = Math.floor(width*0.32);
        var cyqH = Math.floor(height*0.68);

        $('#box_ChipDis_week').css("width",cyqW);
        $('#box_ChipDis_week').css("height",cyqH);
        $('#ul_li_week').css("width",cyqW*0.8);

        if(_symbol){
            //根据股票代码查新名称
            var chartDivID = 'containerCYQweek'+mathRandom;
            newKlineCYQChart.getKLine(_symbol,mathRandom,chartDivID,1);
        }
    },

    emptyData:function () {

        newKlineCYQ_week.param.ohlc = [];

        newKlineCYQ_week.param.max = 0;
        newKlineCYQ_week.param.min = 0;

    },

    param: {
        max:0,//蜡烛图的最高值
        min :0,//蜡烛图的最高值
        ohlc:[],//蜡烛图
    }
};
//月K
var newKlineCYQ_month = {
    getTarget_month: function(sn) {
        var temp ='<div id="containerCYQmonth'+sn+'" ></div>';
        return temp;
    },
    init:function(symbol,stockCode,stockName,type,mathRandom) {
        newKlineCYQ_month.emptyData();

        var _symbol='',
            _symbol = symbol==null ? 'sh600600' : symbol;//sh603903

        var height = document.body.clientHeight;
        var width = document.body.clientWidth;

        var cyqW = Math.floor(width*0.32);
        var cyqH = Math.floor(height*0.68);

        $('#box_ChipDis_month').css("width",cyqW);
        $('#box_ChipDis_month').css("height",cyqH);
        $('#ul_li_week').css("width",cyqW*0.8);

        if(_symbol){
            //根据股票代码查新名称
            var chartDivID = 'containerCYQmonth'+mathRandom;
            newKlineCYQChart.getKLine(_symbol,mathRandom,chartDivID,2);
        }
    },

    emptyData:function () {

        newKlineCYQ_month.param.ohlc = [];

        newKlineCYQ_month.param.max = 0;
        newKlineCYQ_month.param.min = 0;

    },

    param: {
        max:0,//蜡烛图的最高值
        min :0,//蜡烛图的最高值
        ohlc:[],//蜡烛图
    }
};
//分钟线（60）
var newKlineCYQ_min = {
    getTarget_min: function(sn) {
        var temp ='<div id="containerCYQmin'+sn+'" ></div>';
        return temp;
    },
    init:function(symbol,stockCode,stockName,type,mathRandom) {
        newKlineCYQ_min.emptyData();

        var _symbol = symbol==null ? 'sh600600' : symbol;//sh603903

        var height = document.body.clientHeight;
        var width = document.body.clientWidth;

        var cyqW = Math.floor(width*0.32);
        var cyqH = Math.floor(height*0.68);

        $('#box_ChipDis_month').css("width",cyqW);
        $('#box_ChipDis_month').css("height",cyqH);
        $('#ul_li_week').css("width",cyqW*0.8);

        if(_symbol){
            //根据股票代码查新名称
            var chartDivID = 'containerCYQmin'+mathRandom;
            newKlineCYQChart.getKLineMin(_symbol,mathRandom,chartDivID,2);
        }
    },

    emptyData:function () {

        newKlineCYQ_min.param.ohlc = [];

        newKlineCYQ_min.param.max = 0;
        newKlineCYQ_min.param.min = 0;

    },

    param: {
        max:0,//蜡烛图的最高值
        min :0,//蜡烛图的最高值
        ohlc:[],//蜡烛图
    }
};

var newKlineCYQUtil={
    //Report  div  头部
    getHeaderHtml:function (time,open,close,high,low,zf,change,volume,amount,turnover,ma5,ma10,ma20) {
        open = parseFloat(open).toFixed(2);
        close = parseFloat(close).toFixed(2);
        zf = parseFloat(zf).toFixed(2);
        change = parseFloat(change).toFixed(2);

        ma5 = parseFloat(ma5).toFixed(2);
        ma10 = parseFloat(ma10).toFixed(2);
        ma20 = parseFloat(ma20).toFixed(2);
        var col = '';
        //涨停样式
        if(zf > 0){
            zf = '+'+zf;
            col = 'cmfb_red';
        }else if(zf < 0){
            zf = zf;
            col = 'cmfb_green';
        }else{
            zf = 0.00;
            col = '';
        }
        var tagHeader = '';
        tagHeader +=
            '<div class="header_name fl">'+
            '<div>'+newKlineCYQ.param.stockName+'('+newKlineCYQ.param.stockCode+')'+'</div>';

        if(turnover== -1){
            tagHeader += '<div>'+chartTimeUtil.getTimeStr_more(time)+'</div>';
        }else{
            tagHeader += '<div>'+chartTimeUtil.getTimeStr(time)+'</div>';
        }

        if(turnover== '' || turnover== -1){
            turnover = '&nbsp;&nbsp;&nbsp;&nbsp;'+'--'
        }else{
            turnover = parseFloat(turnover).toFixed(2);
        }
        tagHeader +='</div>'+
            '<div class="header_increase fl">'+
            '<div id="newPrice" class="'+col+'">'+close+'</div>'+
            '<div id="raise" class="'+col+'">'+zf+'%&nbsp;'+change+'</div>'+
            '</div>'+
            '<div class="header_msg fl">'+<!--涨跌幅 红色类名:cmfb_red 绿色类名:cmfb_green-->
            '<ul>'+
            '<li><i>高</i> <em class="'+col+'" id="high">'+high+'</em></li>'+
            '<li><i>开</i> <em class="'+col+'" id="open">'+open+'</em></li>'+
            '<li><i>额</i> <em id="amount">'+newKlineCYQ.formatMoney(amount)+'</em></li>'+
            '</ul>'+
            '<ul>'+
            '<li><i>低</i> <em class="'+col+'" id="low">'+low+'</em></li>'+
            '<li><i>换</i> <em id="change">'+turnover+'%</em></li>'+
            '<li><i>量</i> <em id="volume">'+toolsUtil.formatVolume(volume)+'</em></li>'+
            '</ul>'+
            '</div>'+
            '<div class="header_close" onclick="closePage()"></div>';


        var MA =<!--均线 橘色:cmfb_orange 酒红色:cmfb_claret 蓝色:cmfb_blue-->
            '<li class="cmfb_orange">MA5:'+ma5+'</li>'+
            '<li class="cmfb_claret">MA10:'+ma10+'</li>'+
            '<li class="cmfb_blue">MA20:'+ma20+'</li>';

        $('#header').html(tagHeader);

        $('#MA').html(MA);

    }
};

