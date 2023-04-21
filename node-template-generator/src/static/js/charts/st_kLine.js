/**
 * Created by xdy on 18-02-11.
 * K线，
 * 支撑线。压力线
 * 新股。st股
 */

var onlykline = {
    sn:0,
    HttpUrl:'/robot/semantic/',
    getTarget: function(sn) {
        onlykline.sn = sn;
        var temp =
            '<div id="report'+sn+'" style="height:20px; width: 100%; margin:0 auto;"></div>'+
            '<div id="container_st'+sn+'" class="box_chart01"></div>';
        return temp;
    },

    init:function(symbol,stockName) {
        var chartW = $('.box_chart01').width();
        $("#report"+onlykline.sn).width(chartW);
        symbol = symbol==null ? 'sh600773' : symbol;//sh603903
        stockName = stockName==null ? '' : stockName;
        if(stockName.length>0){
            stockName  = stockName.toLowerCase();
        }

        var str_qz = symbol.toString().substr(0,2);
        var str_symbol = symbol.toString().substr(2,6);

        if(str_symbol){
            //根据股票代码查新名称
            var chartDivID = 'container_st';
            chartRequestUtil.getKData(chartDivID,onlykline.sn,str_qz,str_symbol,stockName);
            //KLineOnlyKDataService.getKLine(str_qz,str_symbol,stockName);
        }
    },

    getReport:function (d,col,open,close,zdf) {
        var $reporting = $("#report"+onlykline.sn);
        $reporting.html(
            '  <span style=" display:block; width:100%; height:20px; line-height: 20px; margin: 0 auto;"><span style="font-family: 微软雅黑;font-size: 0.75em;font-weight: normal; float: left; width: 30%; ">'+Highcharts.dateFormat('%Y-%m-%d',d)+'</span>'
            + '<span style=" float: left; width: 22%;"><span style=" float: left;font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">开:</span>'
            + '<span style=" float: left;color:'+col+';font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">'+open+'</span></span>'
            + '<span style=" float: left; width: 22%;"><span style=" float: left;font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">收:</span>'
            + '<span style=" float: left;color:'+col+';font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">'+close+'</span></span>'
            + '<span style=" float: left; width: 26%;"><span style=" float: left;font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">幅:</span>'
            + '<span style=" float: left;color:'+col+';font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">'+zdf+'</span></span></span>'
        );
    }
};


