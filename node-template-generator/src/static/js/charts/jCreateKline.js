/**
 * Created by xdy on 18-01-03.
 * 创建K线图，
 */
var createKLineChart={

    /**
     * Kline  K线图(筹码分布)
     * chartDivID  图表ID
     * containerCYQday--筹码分布日K  containerCYQweek--筹码分布周K  containerCYQmonth--筹码分布月K  containerCYQmin--筹码分布分钟线
     * ohlc  原始K线数据
     * klineData  截取以后的K线数据（筹码分布截取100条）
     * volumeData 成交量数据
     * ma5Data  5日均线
     * ma10Data  10日均线
     * ma20Data  20日均线
     * mathRandom  生成页面时传入参数  随机数
     * lineYAxisMax  原始K线数据 最大值，（筹码分布  价格区间  <= 最大值）
     * lineYAxisMin 原始K线数据 最小值，筹码分布  价格区间  >= 最小值）
     */
    createCYQChartKline:function (chartDivID,ohlc,klineData,volumeData,ma5Data,ma10Data,ma20Data,mathRandom,lineYAxisMax,lineYAxisMin){

        //判断开盘涨停的情况，以便于控制柱形图的颜色
        for(var i =0;i<ohlc.length;i++){
            var zf = parseFloat((parseFloat(ohlc[i][4])-parseFloat(ohlc[i][5]))/parseFloat(ohlc[i][5])*100);
            if(zf.toFixed(2) > 9.9){
                ohlc[i][4] =  parseFloat(ohlc[i][4])+0.01;
            }
        }
        //修改colum条的颜色（重写了源码方法6.0.2）
        var originalDrawPoints = Highcharts.seriesTypes.column.prototype.drawPoints;
        Highcharts.seriesTypes.column.prototype.drawPoints = function () {
            var series = this,
                chart  = this.chart,
                points = series.points,
                i      = points.length;
            while (i--) {
                var candlePoint = chart.series[0].points[i];
                if(candlePoint){
                    if(candlePoint.open != undefined && candlePoint.close !=  undefined){  //如果是K线图 改变矩形条颜色，否则不变
                        var color = (candlePoint.open < candlePoint.close) ? '#DD2200' : '#33AA11';
                        series.points[i].color = color;
                    }
                }

            }
            originalDrawPoints.call(this);
        };

        //X轴显示的起始日期
        var startDate = klineData[0][0];
        var lastDate = klineData[klineData.length-1][0];

        var chartH = document.body.clientHeight*0.70;

        return new Highcharts.StockChart( {
            chart:{
                height: chartH,
                spacingTop: 0,
                renderTo : chartDivID,
                resetZoomButton: {//隐藏方法按钮
                    theme: {display: 'none'}
                },
                events: {
                    load:function(){
                        createKLineChart.showTips(klineData,volumeData,klineData[0][0],klineData[klineData.length-1][0],this);
                    }
                }
            },
            rangeSelector: {enabled:false},
            credits:{enabled:false},//隐藏Highchart.com
            exporting: {enabled: false},//设置导出按钮不可用
            scrollbar: {enabled: false},
            navigator: {enabled: false},
            legend: {enabled: false},
            title: {
                enabled: false,
                align:'left',
                verticalAlign:'top',
                useHTML:true,
                text:"",
                floating:true
            },
            subtitle:{enabled: false},
            yAxis: [
                {
                    title: {enable:false},
                    crosshair: true,
                    height: '66%',
                    lineWidth:1,//Y轴边缘线条粗细
                    gridLineColor: 'rgba(0,0,0,0)',
                    gridLineWidth:0.1,
                    opposite:false,
                    labels: {
                        align: 'left',
                        x: 0,
                        formatter: function () {
                            return this.value;
                        }
                    }
                },{
                    title: {
                        enable:false
                    },
                    opposite:false,
                    top: '75%',
                    height: '25%',
                    gridLineColor: 'rgba(0,0,0,0)',
                    gridLineWidth:0.1,
                    lineWidth: 1,
                    labels: {
                        align: 'left',
                        x: 0,
                        formatter: function () {
                            return this.value/1000000;
                        }
                    }
                }],
            xAxis: {//自定义X轴显示格式
                gridLineColor:'rgba(0,0,0,0)',
                crosshair: true,
                type: 'datetime',
                labels: {
                    formatter: function() {
                        var temptime = this.value;
                        var date = new Date(parseInt(temptime, 10));
                        return  chartTimeUtil.getTimeStr(parseInt(temptime, 10));
                    }
                },
                tickPositioner:function(){
                    var positions=[startDate,lastDate];
                    return positions;
                },
                events: {
                    afterSetExtremes: function(e) {
                        var minTime = Highcharts.dateFormat("%Y-%m-%d", e.min);
                        var maxTime = Highcharts.dateFormat("%Y-%m-%d", e.max);
                        var chart = this.chart;
                        createKLineChart.showTips(klineData,volumeData,e.min,e.max,chart);
                    }
                }
            },
            tooltip: {
                enabled:true,
                backgroundColor: 'transparent',   // 背景颜色
                borderColor: 'transparent',         // 边框颜色
                borderRadius: 10,             // 边框圆角
                borderWidth: 3,               // 边框宽度
                shadow: false,                 // 是否显示阴影
                animation: false,               // 是否启用动画效果
                formatter:function(){
                    var d = 0;
                    var open = 0,close = 0,high=0,low=0,col = '#dd113c';
                    var zdf = 0;//涨跌幅=（今收-昨收）/昨收*100
                    var change = 0;//涨跌=（今收-昨收）close - preclose
                    var volume=0,amount=0,turnover=0;
                    var ma5 = 0,ma10 = 0,ma20 = 0,ma30 = 0;

                    d = this.x;

                    if(this.points[0]){
                        if(this.points[0].point.open == undefined){
                            return;
                        }
                        open = this.points[0].point.open.toFixed(2);
                        close = this.points[0].point.close.toFixed(2);
                        high = this.points[0].point.high.toFixed(2);
                        low = this.points[0].point.low.toFixed(2);
                    }
                    for(var i =0;i<ohlc.length;i++){
                        if(Highcharts.dateFormat('%Y-%m-%d',this.x) == Highcharts.dateFormat('%Y-%m-%d',ohlc[i][0])){
                            zdf = parseFloat((parseFloat(ohlc[i][4])-parseFloat(ohlc[i][5]))/parseFloat(ohlc[i][5])*100).toFixed(2);
                            change = parseFloat(parseFloat(ohlc[i][4])-parseFloat(ohlc[i][5])).toFixed(2);
                            volume=parseFloat(parseFloat(ohlc[i][7])).toFixed(2);
                            amount=parseFloat(parseFloat(ohlc[i][8])).toFixed(2);
                            turnover=parseFloat(parseFloat(ohlc[i][6])).toFixed(2);
                        }
                    }
                    for(var i = 0;i<this.points.length;i++){
                        var item = this.points[i];

                        if(item.color == "#ee6b00"){//MD5
                            ma5 = this.y;
                        }
                        if(item.color == "#e1028c"){//MD10
                            ma10 = this.y;
                        }
                        if(item.color == "#105afe"){//MD20
                            ma20 = this.y;
                        }
                        if(item.color == "#8085e9"){//MD30
                            ma30 = this.y;
                        }
                    }
                    if(zdf>9.9){
                        close = close - 0.01.toFixed(2);
                    }

                    if(chartDivID.indexOf('containerCYQmin') >= 0){//分钟线
                        newKlineCYQUtil.getHeaderHtml(parseInt(d, 10),open,close,high,low,zdf,change,volume,amount,-1,ma5,ma10,ma20,ma30);
                    }else{
                        newKlineCYQUtil.getHeaderHtml(parseInt(d, 10),open,close,high,low,zdf,change,volume,amount,turnover,ma5,ma10,ma20,ma30);
                        newKlineCYQChart.creatCYQChartCss(chartDivID,ohlc,parseInt(d, 10),close,high,low,mathRandom,lineYAxisMax,lineYAxisMin);
                    }
                    return ''
                },
                valueDecimals: 2

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
                    showInLegend:false,
                    dataGrouping: {enabled: false},
                    animation: false,//去动画
                    states: {//去掉曲线和蜡烛上的hover事件
                        hover: {
                            enabled: false
                        }
                    },
                    events: {
                        legendItemClick: function(e) {
                            return false; // 直接 return false 即可禁用图例点击事件
                        }
                    },
                    line: {
                        connectNulls: true
                    }
                }
            },
            series: [
                {
                    type: 'candlestick',

                    name: 'K',
                    data: klineData,
                    id:'k-dataseries'
                },{
                    type: 'column',//2
                    name: '成交量',
                    data: volumeData,
                    yAxis: 1,
                    fillColor : {
                        linearGradient : {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops : [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    }
                },{
                    type: 'line',
                    name: 'MA5',
                    color: '#ee6b00',lineWidth:0.5,
                    data: ma5Data
                },{
                    type: 'line',
                    name: 'MA10',
                    color: '#e1028c',lineWidth:0.5,
                    data: ma10Data
                },{
                    type: 'line',
                    name: 'MA20',
                    color: '#105afe',lineWidth:0.5,
                    data: ma20Data
                }]
        });
    },

    /*
     * 这个方法用来控制K线上的flags的显示情况，当afterSetExtremes时触发该方法,通过flags显示当前时间区间最高价和最低价
     * minTime  当前k线图上最小的时间点
     * maxTime  当前k线图上最大的时间点
     * chart  当前的highstock对象
     * volumeData  K线数据
     * ohlcArray  成交量数据
     */
    showTips:function (ohlcArray,volumeData,minTime,maxTime,chart){
        //删除标示线
        chart.yAxis[0].removePlotLine('plot-line-1');
        chart.yAxis[0].removePlotLine('plot-line-2');
        chart.yAxis[1].removePlotLine('plot-line-3');
        //chart.showLoading();
        //定义当前时间区间中最低价的最小值，最高价的最大值 以及对应的时间
        var lowestPrice,highestPrice,array=[],
            highestArray=[],lowestArray=[],
            highestTime,lowestTime,flagsMaxData_1=[],
            flagsMaxData_2=[],flagsMinData_1,flagsMinData_2,volumeArr,volumeMax=0;
        for(var i=0;i<ohlcArray.length;i++){
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
        volumeArr = volumeData.sort(function(x, y){  return y[1] - x[1];})[0];// 根据最高价降序排列
        volumeMax = volumeArr[1];

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


        //Y轴坐标自适应
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

        chart.yAxis[0].addPlotLine({           //在x轴上增加标示线   x轴线
            value:Number(lowestPrice-0.01),
            width:0.25,
            color: '#606060',
            id: 'plot-line-1'                  //标示线的id，在删除该标示线的时候需要该id标示
        });
        chart.yAxis[0].addPlotLine({           //在x轴上增加标示线   x轴线
            value:Number(highestPrice),
            width:0.25,
            color: '#606060',
            id: 'plot-line-2'                  //标示线的id，在删除该标示线的时候需要该id标示
        });
        chart.yAxis[1].addPlotLine({           //在x轴上增加标示线   x轴线
            value:Number(volumeMax),
            width:0.25,
            color: '#606060',
            label:{
                text: formatVolume(volumeMax),
                align: 'left',
                x: 0,
                style: {
                    color: '#666666',
                    fontWeight: 'normal'
                }
            },
            id: 'plot-line-3'                  //标示线的id，在删除该标示线的时候需要该id标示
        });
    },

    /**
     * Kline  K线图（上证指数+新股）
     * chartDivID  图表ID
     * mathRandom 成页面时传入参数  随机数
     * containerCYQday--筹码分布日K  containerCYQweek--筹码分布周K  containerCYQmonth--筹码分布月K  containerCYQmin--筹码分布分钟线
     * ohlc  原始K线数据
     * stockName  （判断是否为ST股票 控制柱子的颜色）
     */
    createOnlyKline:function (chartDivID,mathRandom,ohlc,stockName){
        var chartW = $('.box_chart01').width();

        if(ohlc.length > 0){
            //X轴显示的起始日期
            var startDate = ohlc[0][0];
            var lastDate = ohlc[ohlc.length-1][0];
            //判断开盘涨停的情况，以便于控制柱形图的颜色
            for(var i =0;i<ohlc.length;i++){
                //判断开盘涨停的情况，以便于控制柱形图的颜色
                var zf = parseFloat((parseFloat(ohlc[i][4])-parseFloat(ohlc[i][5]))/parseFloat(ohlc[i][5])*100);
                if(zf.toFixed(2) > 9.9){
                    ohlc[i][4] =  parseFloat(ohlc[i][4])+0.01;
                }
                if(stockName){
                    //ST新股涨幅判断条件为>4.9
                    if(stockName.indexOf('st') !== -1){
                        if(zf.toFixed(2) > 4.9){
                            ohlc[i][4] =  parseFloat(ohlc[i][4])+0.01;
                        }
                    }
                }
            }
            //console.log(ohlc);
            return new Highcharts.StockChart( {
                chart:{
                    //关闭平移
                    panning:false,
                    zoomType: 'none',
                    pinchType:'none',
                    renderTo : 'container_st'+mathRandom,
                    resetZoomButton: {
                        theme: {
                            display: 'none'
                        }
                    },
                    spacingTop: 10,
                    spacingLeft: 2,
                    spacingRight: 1,
                    width:chartW,
                    height:230
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
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'bottom'
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
                    labels: {
                        //step:1,//可以通过设置此参数为 1 来阻止自动计算
                        formatter: function() {
                            return Highcharts.dateFormat('%Y-%m-%d',this.value)
                        }
                    },
                    tickPositioner:function(){
                        var positions=[startDate,lastDate];
                        return positions;
                    }
                },
                title: {
                    text: '日K'+' 前复权',
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
                    enabled:true,
                    backgroundColor: 'transparent',   // 背景颜色
                    borderColor: 'transparent',         // 边框颜色
                    borderRadius: 10,             // 边框圆角
                    borderWidth: 3,               // 边框宽度
                    shadow: false,                 // 是否显示阴影
                    animation: false,               // 是否启用动画效果

                    formatter:function(){
                        var open = 0;
                        var close = 0;
                        if(this.points[0]){
                            open = this.points[0].point.open.toFixed(2);
                            close = this.points[0].point.close.toFixed(2);
                        }
                        var zdf = 0;//涨跌幅=（今收-昨收）/昨收
                        var d = this.x;
                        for(var i =0;i<ohlc.length;i++){
                            if(Highcharts.dateFormat('%Y-%m-%d',this.x) == Highcharts.dateFormat('%Y-%m-%d',ohlc[i][0])){
                                zdf = parseFloat((parseFloat(ohlc[i][4])-parseFloat(ohlc[i][5]))/parseFloat(ohlc[i][5])*100).toFixed(2);
                            }
                        }
                        var col = '#dd113c';
                        if(zdf>9.9){
                            close = parseFloat(parseFloat(close) - 0.01).toFixed(2);
                        }
                        if(stockName){
                            //ST新股涨幅判断条件为>4.9
                            if(stockName.indexOf('st') !== -1){
                                if(zdf > 4.9){
                                    close = parseFloat(parseFloat(close) - 0.01).toFixed(2);
                                }
                            }
                        }
                        if(zdf>=0){
                            zdf = '+'+zdf+'%';
                            col = '#dd113c';
                        }else{
                            zdf = zdf+'%';
                            col = '#319c11';
                        }
                        onlykline.getReport(d,col,open,close,zdf);
                    }
                },
                series: [{
                    type: 'candlestick',
                    dataGrouping: {enabled: false},
                    name: 'K',
                    data: ohlc,
                    showInLegend: false // 设置为 false 即为不显示在图例中
                }]
            });
        }

    }

};
