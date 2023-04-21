/**
 * 相似K线
 * Created by BoBo on 2017-11-10.
 * url 来源小e H5页面  node服务端无该字段
 */
var smallKLine = {
    randomId: 0,
    HttpUrl: '',
    getTarget: function(randomId,url) {
        if(!url){
            smallKLine.HttpUrl = '';
        }else{
            smallKLine.HttpUrl = '/hangqing-service/json/getKline';
        }

        smallKLine.randomId = randomId;
        var temp =
            // '<div id="report'+randomId+'" style="height:20px; width: 100%; margin:0 auto"></div>'+
            '<div id="container'+randomId+'"></div>';
        return temp;
    },

    /**
     * 初始化
     * @param randomId
     * @param symbol
     * @param stockName
     * @param startAt
     * @param endAt
     */
    init: function(randomId, symbol, stockName, startAt, endAt)
    {
        smallKLine.emptyData();

        smallKLine.param.symbol = !symbol ? 'sh600773' : symbol; //sh603903
        smallKLine.param.stockName = !stockName ? '' : stockName;

        //阴影区域的起始时间
        smallKLine.param.time[randomId] = {};
        smallKLine.param.time[randomId].startAt = startAt;//阴影区域的开始时间
        smallKLine.param.time[randomId].endAt = endAt;//阴影区域的开始时间
        // console.log(startAt);

        if(smallKLine.param.stockName){
            smallKLine.param.stockName  = smallKLine.param.stockName.toLowerCase();
        }
        // console.log(smallKLine.param.stockName);

        var str_qz = smallKLine.param.symbol.toString().substr(0,2);
        var str_symbol = smallKLine.param.symbol.toString().substr(2,6);

        //console.log(str_qz+''+str_symbol);
        if(str_symbol){
            //根据股票代码查新名称
            smallKLineDataService.getKLine(str_qz,str_symbol, randomId);
        }
    },

    //重置
    emptyData: function () {
        smallKLine.param.symbol = '';
        smallKLine.param.stockName = '';
        // smallKLine.param.time = {};
        smallKLine.param.startAt = '';
        smallKLine.param.endAt = '';
        // smallKLine.param.areaData = [];
    },

    //参数
    param: {
        symbol: '',
        stockName: '',
        time: {},
        startAt: 0,//阴影区域的开始时间
        endAt: 0,//阴影区域的开始时间
        areaData: []//阴影区域的数据源
    },

    // create the chart
    createChartOnlyKData:function (ohlc, randomId){
        var chartW = $('.box_chart01').width();
        $("#report"+randomId).width(chartW);

        //X轴显示的起始日期
        var startDate = ohlc[0][0];
        var lastDate = ohlc[ohlc.length-1][0];

        //确定Y轴的最大值与最小值
        var y_max = ohlc[0][2];
        var y_min = ohlc[0][3];

        for(var i =0;i<ohlc.length;i++){
            if(y_max < ohlc[i][2]){//坐标最大值
                y_max = ohlc[i][2];
            }
            if(y_min > ohlc[i][3]){//坐标最小值
                y_min = ohlc[i][3];
            }
        }

        //阴影部分的数据绑定
        if(smallKLine.param.time[randomId].startAt && smallKLine.param.time[randomId].endAt){
            smallKLine.param.areaData[randomId] = [];
            smallKLine.param.areaData[randomId].push([smallKLine.param.time[randomId].startAt,y_min]);
            smallKLine.param.areaData[randomId].push([smallKLine.param.time[randomId].startAt,y_max]);
            smallKLine.param.areaData[randomId].push([smallKLine.param.time[randomId].endAt,y_max]);
            smallKLine.param.areaData[randomId].push([smallKLine.param.time[randomId].endAt,y_min]);
        }else{
            smallKLine.param.areaData[randomId] = [];
        }
        // console.log(smallKLine.param.areaData);

        var max= 0,min=0;
        //判断开盘涨停的情况，以便于控制柱形图的颜色
        for(i =0;i<ohlc.length;i++){
            var zf = parseFloat((parseFloat(ohlc[i][4])-parseFloat(ohlc[i][5]))/parseFloat(ohlc[i][5])*100);
            if(zf.toFixed(2) > 9.9){
                ohlc[i][4] =  parseFloat(ohlc[i][4])+0.01;
            }
            if(max<ohlc[i][2]){//坐标最大值
                max = ohlc[i][2];
            }
            if(min>ohlc[i][3]){//坐标最小值
                min = ohlc[i][3];
            }
            //ST新股涨幅判断条件为>4.9
            if(smallKLine.param.stockName.indexOf('st') !== -1){
                if(parseFloat(zf.toFixed(2)) > 4.9){
                    ohlc[i][4] =  parseFloat(ohlc[i][4])+0.01;
                }
            }
        }

        return new Highcharts.StockChart( {
            chart:{
                //关闭平移
                panning:false,
                zoomType: 'none',
                pinchType:'none',
                renderTo : 'container'+randomId,
                resetZoomButton: {
                    theme: {
                        display: 'none'
                    }
                },
                spacingTop: 0,
                spacingLeft: 10,
                spacingRight: 10,
                spacingBottom: 5,
                width:chartW,
                height:160,
                events: {
                    load:function(){
                        smallKLine.showTips(ohlc,ohlc[0][0],ohlc[ohlc.length-1][0],this);
                    }
                }
            },
            loading: {
                labelStyle: {
                    position: 'relative',
                    top: '10em',
                    zindex:1000
                }
            },
            credits:{//隐藏Highchart.com
                enabled:false
            },
            rangeSelector: {
                enabled:false,//隐藏日期选择器
                inputDateFormat: '%Y-%m-%d'  //设置右上角的日期格式

            },
            legend: {//图例
                enabled: false
            },
            yAxis: [{
                title: {
                    enable:false
                },
                opposite:false,
                height: '100%',
                lineWidth:1,//Y轴边缘线条粗细
                lineColor: '#C0D0E0',
                gridLineColor: 'rgba(0,0,0,0)',
                labels: {
                    align: 'left',
                    x: 0,
                    formatter: function () {
                        return this.value;
                    }
                }
            }],
            xAxis: {//自定义X轴显示格式
                gridLineColor:'#346691',
                crosshair: {width: 0},
                labels: {
                    //step:1,//可以通过设置此参数为 1 来阻止自动计算
                    formatter: function() {
                        return Highcharts.dateFormat('%Y-%m-%d',this.value);
                    }
                },
                tickPositioner:function(){
                    var positions=[startDate,lastDate];
                    return positions;
                }
            },
            title: {
                align:'left',
                verticalAlign:'top',
                useHTML:true,
                text:"<span style='font-family: 微软雅黑;font-size: 0.625em;font-weight: normal'>"+'日K'+" 前复权</span>",
                floating:true
            },
            exporting: {
                enabled: false  //设置导出按钮不可用
            },
            plotOptions: {
                //修改蜡烛颜色
                candlestick: {
                    color: '#33AA11',
                    upColor: '#DD2200',
                    lineColor: '#33AA11',
                    upLineColor: '#DD2200',
                    maker:{
                        states:{
                            hover:{
                                enabled:false
                            }
                        }
                    }
                },
                series: {
                    states: {//去掉曲线和蜡烛上的hover事件
                        hover: {
                            enabled: false
                        }
                    },
                    dataGrouping: {enabled: false},
                    events: {
                        legendItemClick: function(e) {
                            return false; // 直接 return false 即可禁用图例点击事件
                        }
                    },

                    marker: {
                        enabled: false
                    },
                    line: {
                        connectNulls: true
                    }
                }
            },

            scrollbar: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            tooltip: {
                enabled:false
            },
            series: [{
                type: 'candlestick',
                dataGrouping: {enabled: false},
                name: 'K',
                data: ohlc
            },{
                showInLegend: false,
                dataGrouping: {enabled: false},
                type: 'area',
                color: '#99acf9',
                fillOpacity: 0.5,
                data: smallKLine.param.areaData[randomId],
                lineWidth: 0,
                lineColor: '#99acf9',
                enableMouseTracking: false,
                marker: {
                    enabled: false
                }
            }]
        });
    },



    /*
     * 这个方法用来控制K线上的flags的显示情况，当afterSetExtremes时触发该方法,通过flags显示当前时间区间最高价和最低价
     * minTime  当前k线图上最小的时间点
     * maxTime  当前k线图上最大的时间点
     * chart  当前的highstock对象
     */
    showTips: function (ohlcArray,minTime,maxTime,chart){

        //chart.showLoading();
        //定义当前时间区间中最低价的最小值，最高价的最大值 以及对应的时间
        var lowestPrice,highestPrice,array=[],highestArray=[],lowestArray=[],highestTime,lowestTime,flagsMaxData_1=[],flagsMaxData_2=[],flagsMinData_1,flagsMinData_2;

        for(var i=0;i<ohlcArray.length-1;i++){
            if(ohlcArray[i][0]>=minTime && ohlcArray[i][0]<=maxTime){
                array.push([
                    ohlcArray[i][0],
                    ohlcArray[i][2], //最高价
                    ohlcArray[i][3] //最低价
                ])
            }
        }

        if(!array.length>0){
            return;
        }
        highestArray = array.sort(function(x, y){  return y[1] - x[1];})[0];// 根据最高价降序排列
        highestTime =highestArray[0];
        highestPrice =highestArray[1].toFixed(2);

        lowestArray = array.sort(function(x, y){  return x[2] - y[2];})[0]; //根据最低价升序排列
        lowestTime =lowestArray[0];
        lowestPrice =lowestArray[2].toFixed(2);
        flagsMaxData_2 = [
            {
                x : highestTime,
                title : highestPrice
            }
        ];

        flagsMinData_2 = [
            {
                x : lowestTime,
                title : lowestPrice
            }
        ];
        var min =  parseFloat(flagsMinData_2[0].title) - parseFloat(flagsMinData_2[0].title)*0.05;
        var max =  parseFloat(flagsMaxData_2[0].title)+parseFloat(flagsMaxData_2[0].title)*0.05;
        var tickInterval = (( max-min)/3).toFixed(1)*1;

        //console.log(chart);
        //Y轴坐标自适应
        //console.log("min=="+kline.param.min+"---------------=max="+kline.param.max+"---==tickInterval="+tickInterval);
        chart.yAxis[0].update({
            min : Number(lowestPrice),
            max : Number(highestPrice),
            //tickInterval: tickInterval
            tickPositioner:function(){
                var n0 = (lowestPrice-0.01).toFixed(2);
                var n1 = Number(Number(lowestPrice)+(highestPrice-lowestPrice)/4).toFixed(2);
                var n2 = Number(Number(lowestPrice)+2*(highestPrice-lowestPrice)/4).toFixed(2);
                var n3 = Number(Number(lowestPrice)+3*(highestPrice-lowestPrice)/4).toFixed(2);
                var n4 = Number(highestPrice).toFixed(2);
                var positions=[Number(n0),Number(n1),Number(n2),Number(n3),Number(n4)];
                //console.log(n0+"---------------=="+n1+"---==="+n2+"---==="+n3+"---==="+n4);
                return positions;
            }
        });

        chart.xAxis[0].update({
            tickPositioner:function(){
                var positions=[minTime,maxTime];
                return positions;
            }
        });
    }
};

var smallKLineDataService = {
    getKLine: function (val,symbol, randomId){
        jQuery.ajax(
            {
                url : smallKLine.HttpUrl+'?symbol='+val+symbol+'&daynum=66&XDR=1',
                type: 'get',
                async: null,
                data: null,
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
                                _date = timeUtil.dataFormatter(list[j].date.toString());
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
                            ohlc = [];
                        }
                        var d = new Date();
                        var str = d.getHours()+":"+ d.getMinutes();
                        if(d.getDay() == 0 || d.getDay() == 6){//非工作日
                            smallKLine.createChartOnlyKData(ohlc, randomId);
                        }else{
                            if(timeUtil.time_range("09:30", "15:00", str)){//如果开盘时间
                                smallKLineDataService.getLastKData(val,symbol,ohlc, randomId);
                            }else{
                                smallKLine.createChartOnlyKData(ohlc, randomId);
                            }
                        }
                    }
                }
            });
    },

    //获取最近一天k线的数据
    getLastKData:function(val,symbol,ohlc,randomId){
        var url= '';
        url = '/api/stock/getprice?symbol='+val+symbol;
        jQuery.ajax(
            {
                url: url,
                type: 'get',
                async: null,
                data: null,
                success: function(rs)
                {
                    if(rs.error){
                        smallKLine.createChartOnlyKData (ohlc, randomId);
                        return;
                    }
                    /**
                     * 针对停牌的股票只画K线图
                     */
                    if(rs.open == 0 && rs.high == 0 && rs.low == 0 && rs.volume==0){
                        smallKLine.createChartOnlyKData (ohlc, randomId);
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
                    smallKLine.createChartOnlyKData(ohlc, randomId);
                }
            });
    }
};


