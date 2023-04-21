/**
 * Created by xdy on 2018/2/11.
 */

var chartRequestUtil={
    HttpUrl:'/robot/semantic/',
    /**
     * 获取最近一天k线的数据(上证指数+新股)
     * @param chartDivID  图表id
     * @param mathRandom 成页面时传入参数  随机数
     * @param val  市场类型
     * @param symbol 股票代码
     * @param ohlc K线原始数据（为了画图用）
     * @param stockName 股票名称（判断是否为ST股票 控制柱子的颜色）
     */
    getLastKData:function (chartDivID,mathRandom,val,symbol,ohlc,stockName){
        var url= '';
        url = 'https://jy.hczq.com/json/getReport.do?symbol='+val+symbol;
        jQuery.ajax(
            {
                url: url,
                type: 'get',
                async: null,
                data: null,
                dataType: 'jsonp',
                success: function(rs)
                {
                    if(rs.error){
                        onlykline.createOnlyKline (chartDivID,mathRandom,ohlc,stockName);
                        return;
                    }
                    /**
                     * 针对停牌的股票只画K线图
                     */
                    if(rs.open == 0 && rs.high == 0 && rs.low == 0 && rs.volume==0){
                        createKLineChart.createOnlyKline (chartDivID,mathRandom,ohlc,stockName);
                        return;
                    }

                    var temp = [];
                    temp.push(rs.time * 1000);
                    temp.push(rs.open);
                    temp.push(rs.high);
                    temp.push(rs.low);
                    temp.push(rs.newPrice);
                    temp.push(rs.lastClose);

                    if(ohlc.length>0){
                        var tt = new Date(rs.time*1000);
                        var tt1 = new Date(ohlc[ohlc.length-1].time);

                        if(tt.getDate() != tt1.getDate()){
                            ohlc.push(temp);
                        }
                        //去重 工作日与法定假日 会查重
                        if(Highcharts.dateFormat('%Y-%m-%d',ohlc[ohlc.length-1][0])  == Highcharts.dateFormat('%Y-%m-%d',ohlc[ohlc.length-2][0])){
                            ohlc.pop();
                        }
                    }else{
                        ohlc.push(temp);
                    }
                    createKLineChart.createOnlyKline(chartDivID,mathRandom,ohlc,stockName);
                },
                error: ajaxErrorHandler
            });
    },


    /**
     * 获取股票数据（上证指数+新股）
     * @param chartDivID 图表ID
     * @param mathRandom 成页面时传入参数  随机数
     * @param val 市场类型
     * @param symbol 股票代码
     * @param stockName 股票名称
     */
    getKData:function (chartDivID,mathRandom,val,symbol,stockName){
        jQuery.ajax(
            {
                url : '/hangqing-service/json/getKline?symbol='+val+symbol+'&daynum=52&XDR=1',
                type: 'get',
                async: null,
                data: null,
                dataType: 'jsonp',
                success: function(rs)
                {
                    if(rs){
                        var list = [];
                        list = rs.ks;
                        var len = list.length;
                        var ohlc = [];//蜡烛图数据
                        //K线数据组
                        if(list.length>0){
                            for(var j = 0;j<len;j++){
                                var _date = '';
                                _date = chartTimeUtil.dataFormatter(list[j].date.toString());
                                ohlc.push([
                                    _date,
                                    list[j].open,
                                    list[j].high,
                                    list[j].low,
                                    list[j].close,
                                    list[j].preClose
                                ]);
                            }
                        }else{
                            //alert("未返回K线数据");
                            ohlc = []
                        }
                        var d = new Date();
                        var str = d.getHours()+":"+ d.getMinutes();
                        if(d.getDay() == 0 || d.getDay() == 6){//非工作日
                            createKLineChart.createOnlyKline(chartDivID,mathRandom,ohlc,stockName);
                        }else{
                            if(chartTimeUtil.time_range("09:30", "15:00", str)){//如果开盘时间
                                chartRequestUtil.getLastKData(chartDivID,mathRandom,val,symbol,ohlc,stockName);
                            }else{
                                createKLineChart.createOnlyKline(chartDivID,mathRandom,ohlc,stockName);
                            }
                        }
                    }
                },
                error: ajaxErrorHandler
            });
    }
};
