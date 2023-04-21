/**
 * Created by xdy on 18-01-03.
 * K线
 * 筹码分布
 * 5/10/30均线
 * 1、返回接口中的换手率已乘100%
 * 2、换手率   上一个交易日（终点）累加至超过100%的日期，即为标准日（起点）
 * 3、查找 起点。终点 之间区域的K线数据的最高，最低 作为 筹码分布的坐标区间
 * 4、三角分布函数
 * 5、从起点开始。计算每天的筹码分布  累加
 */
var newKlineCYQChart={
    //筹码分布  日K  周K  月K
    getKLine: function (symbol,mathRandom,chartDivID,period,url){
        if(!url){
            url = "";
        }
        var daynum = 1000;
        if(period == 0){
            daynum = 1000;
        }else if(period == 1){
            daynum = 500;
        }else if(period == 2){
            daynum = 200;
        }
        // console.log(symbol)
        jQuery.ajax(
            {
                //url: '/hangqing-service/json/getKline?symbol='+symbol+'&daynum='+daynum+'&period='+period,
                url: url+'/api/stock/kline?symbol='+symbol+'&daynum='+daynum+'&period='+period,
                type: 'get',
                async: null,
                data: null,
                //dataType: 'jsonp',
                success: function(rs)
                {
                    if(rs){
                        //有数据  用永奂技术分析的接口
                        if(rs.ks){
                            /**
                             * K线数据组
                             */
                            var stockData = rs.ks,stockList = [],tempData =[],
                                ohlc = [],//蜡烛图数据
                                volumeArray=[];//成交量柱形图

                            if(stockData.length>0){
                                //去重
                                var len = stockData.length;
                                for(var j = 0;j<len;j++){
                                    if(tempData.indexOf(stockData[j].date)  == -1){
                                        stockList.push(stockData[j])
                                    }
                                    tempData.push(stockData[j].date);
                                }
                                var ma5Data =  newKlineCYQChart.calculateMA(5,stockList),
                                    ma10Data =  newKlineCYQChart.calculateMA(10,stockList),
                                    ma20Data =  newKlineCYQChart.calculateMA(20,stockList);
                                var _len = stockList.length;
                                for(var j = 0;j<_len;j++){
                                    //K线
                                    ohlc.push([
                                        timeUtil.dataFormatter(stockList[j].date),
                                        stockList[j].open,
                                        stockList[j].high,
                                        stockList[j].low,
                                        stockList[j].close,
                                        stockList[j].preClose,
                                        stockList[j].turnover,//换手率
                                        stockList[j].volume,//成交量
                                        stockList[j].amount//成交额
                                    ]);
                                    //成交量柱形图
                                    volumeArray.push([
                                        timeUtil.dataFormatter(stockList[j].date),
                                        stockList[j].volume//成交量
                                    ]);
                                }
                            }else{
                                alert("未返回K线数据");
                            }

                            $('#lastShowDate'+mathRandom).html('最后日期：'+timeUtil.getTimeStr(ohlc[ohlc.length-1][0]));

                            //获取上一交易日的标题
                            var open = 0,close = 0,zdf = 0,change = 0,col = '',volume=0,amount=0,turnover=0,high=0,low=0;
                            open = ohlc[ohlc.length-1][1].toFixed(2);
                            close = ohlc[ohlc.length-1][4].toFixed(2);

                            zdf = parseFloat((parseFloat(ohlc[ohlc.length-1][4])-parseFloat(ohlc[ohlc.length-1][5]))/parseFloat(ohlc[ohlc.length-1][5])*100).toFixed(2);
                            change = parseFloat(parseFloat(ohlc[ohlc.length-1][4])-parseFloat(ohlc[ohlc.length-1][5])).toFixed(2);
                            volume = parseFloat(ohlc[ohlc.length-1][7]).toFixed(2);
                            amount = parseFloat(ohlc[ohlc.length-1][8]).toFixed(2);
                            turnover = parseFloat(ohlc[ohlc.length-1][6]).toFixed(2);

                            high = ohlc[ohlc.length-1][2].toFixed(2);
                            low = ohlc[ohlc.length-1][3].toFixed(2);
                            //涨停样式
                            if(zdf>9.9){
                                close = parseFloat(parseFloat(close) - 0.01).toFixed(2);
                            }

                            if(chartDivID.indexOf('containerCYQday') >=0){
                                newKlineCYQUtil.getHeaderHtml(parseInt(ohlc[ohlc.length-1][0], 10),open,close,high,low,zdf,change,volume,amount,turnover,ma5Data[ma5Data.length-1][1],ma10Data[ma10Data.length-1][1],ma20Data[ma20Data.length-1][1]);

                            }

                            //确定KlineY轴的最大值与最小值
                            var lineYAxisMax = newKlineCYQ.sortArr(ohlc,2,'max');
                            var lineYAxisMin = newKlineCYQ.sortArr(ohlc,3,'min');

                            var klineData = ohlc.slice(ohlc.length-100,ohlc.length),
                                _volumeData  = volumeArray.slice(volumeArray.length-100,volumeArray.length),
                                _ma5Data  = ma5Data.slice(ma5Data.length-100,ma5Data.length),
                                _ma10Data = ma10Data.slice(ma10Data.length-100,ma10Data.length),
                                _ma20Data = ma20Data.slice(ma20Data.length-100,ma20Data.length);

                            // console.log(klineData);console.log(_volumeData);
                            if(newKlineCYQ.param.type == 'c'){//横屏显示K线图
                                // console.log(1111111)
                                createKLineChart.createCYQChartKline(chartDivID,ohlc,klineData,_volumeData,_ma5Data,_ma10Data,_ma20Data,mathRandom,lineYAxisMax,lineYAxisMin);
                            }
                            newKlineCYQChart.creatCYQChartCss(chartDivID,ohlc,parseInt(ohlc[ohlc.length-1][0], 10),close,high,low,mathRandom,lineYAxisMax,lineYAxisMin);
                        }else{

                        }
                    }
                }
            });
    },
    //筹码分布 分钟k
    getKLineMin: function (symbol,mathRandom,chartDivID){
        jQuery.ajax(
            {
                url: '/hangqing-service/json/getMinKline?symbol='+symbol+'&daynum=100&min=60',
                type: 'get',
                async: null,
                data: null,
                //dataType: 'jsonp',
                success: function(rs)
                {
                    if(rs){
                        //有数据  用永奂技术分析的接口
                        if(rs.ks){
                            /**
                             * K线数据组
                             */
                            var stockData = rs.ks,stockList = [],
                                ohlc = [],//蜡烛图数据
                                volumeArray=[];//成交量柱形图
                            var tempData = [];


                            if(stockData.length>0){
                                //去重
                                var len = stockData.length;
                                for(var j = 0;j<len;j++){
                                    if(tempData.indexOf(stockData[j].time)  == -1){
                                        stockList.push(stockData[j])
                                    }
                                    tempData.push(stockData[j].time);
                                }

                                var ma5Data =  newKlineCYQChart.calculateMAInMin(5,stockList),
                                    ma10Data =  newKlineCYQChart.calculateMAInMin(10,stockList),
                                    ma20Data =  newKlineCYQChart.calculateMAInMin(20,stockList);

                                var _len = stockList.length;
                                for(var j = 0;j<_len;j++){
                                    //K线
                                    ohlc.push([
                                        stockList[j].time*1000,
                                        stockList[j].open,
                                        stockList[j].high,
                                        stockList[j].low,
                                        stockList[j].close,
                                        stockList[j].preClose,
                                        stockList[j].volume,//成交量
                                        stockList[j].amount//成交额
                                    ]);
                                    //成交量柱形图
                                    volumeArray.push([
                                        stockList[j].time*1000,
                                        stockList[j].volume//成交量
                                    ]);
                                }
                            }else{
                                alert("未返回K线数据");
                            }

                            //确定KlineY轴的最大值与最小值
                            var lineYAxisMax = newKlineCYQ.sortArr(ohlc,2,'max');
                            var lineYAxisMin = newKlineCYQ.sortArr(ohlc,3,'min');

                            var klineData = ohlc.slice(ohlc.length-100,ohlc.length),
                                _volumeData  = volumeArray.slice(volumeArray.length-100,volumeArray.length),
                                _ma5Data  = ma5Data.slice(ma5Data.length-100,ma5Data.length),
                                _ma10Data = ma10Data.slice(ma10Data.length-100,ma10Data.length),
                                _ma20Data = ma20Data.slice(ma20Data.length-100,ma20Data.length);
                            // console.log(_ma5Data);
                            if(newKlineCYQ.param.type == 'c'){//横屏显示K线图
                                createKLineChart.createCYQChartKline(chartDivID,ohlc,klineData,_volumeData,_ma5Data,_ma10Data,_ma20Data,mathRandom,lineYAxisMax,lineYAxisMin);
                            }
                        }else{

                        }
                    }
                }
            });
    },

    /*
     * 日K  周K  月K
     * 计算均线
     * dayCount  5,10,20,30
     * data  K线数据
     */
    calculateMA:function (dayCount, data) {

        var result = [];
        for (var i = 0, len = data.length; i < len; i++) {
            if (i < dayCount - 1) {
                result.push([timeUtil.dataFormatter(data[i].date),0]);
                continue;
            }

            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
                sum += data[i-j].close;
            }
            result.push([timeUtil.dataFormatter(data[i].date),Number((sum / dayCount).toFixed(3))]);
        }

        return result;
    },
    /*
     * 分钟线
     * 计算均线
     * dayCount  5,10,20,30
     * data  K线数据
     */
    calculateMAInMin:function (dayCount, data) {

        var result = [];
        for (var i = 0, len = data.length; i < len; i++) {
            if (i < dayCount - 1) {
                result.push([data[i].time*1000,0]);
                continue;
            }

            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
                sum += data[i-j].close;
            }
            result.push([data[i].time*1000,Number((sum / dayCount).toFixed(3))]);
        }

        return result;
    },

    /**
     * 三角分布
     * c= (a+b)/2
     * f(x|a,b,c)={█(2(x-a)/(b-a)(c-a) ,a≤x≤c   @2(b-x)/(b-a)(b-c) ,c<x≤b)┤ *
     */
    triangularDistribution:function (arr,low,high,mid) {
        var data = [];

        for(var i=0;i<arr.length;i++){
            if(arr[i] >= low && arr[i] <= mid ){
                data.push(2*(arr[i]-low)/((high-low)*(mid-low)));
            }
            if(arr[i] > mid && arr[i] <= high){
                data.push(2*(high - arr[i])/((high-low)*(high-mid)));
            }
        }
        return data;
    },
    triangular:function (val,low,high,mid) {
        var value = 0;

        if(val >= low && val <= mid ){
            value = 2*(val-low)/((high-low)*(mid-low));
        }
        if(val > mid && val <= high){
            value = 2*(high - val)/((high-low)*(high-mid));
        }
        return value;
    },

    /**
     * 画筹码分布
     * 1.根据鼠标点到日期与计算标准日期，计算出区域的最高值与最低值作为筹码分布柱形图的Y轴
     * 2.筹码分布公式
     * chartDivID: 对应的图标所在divID
     * ohlc: K线数据
     * mouseDate: 鼠标所点柱子的日期
     * close：鼠标所点柱子的日期的收盘价
     * high：鼠标所点柱子的日期的最高价
     * low：鼠标所点柱子的日期的最低价
     * mathRandom：建议表格时对应的随机数（确保一一对应）
     * lineYAxisMax：成交量的最大值
     * lineYAxisMin：成交量的最小值
     */
    creatCYQChartCss:function (chartDivID,ohlc,mouseDate,close,high,low,mathRandom,lineYAxisMax,lineYAxisMin) {
        // console.log("4444");
        var space = 0.01;//确定价格分割步长
        if(high - low <=20){
            space = 0.01;
        }else if(21 < high - low <=50){
            space = 0.1;
        }else if(50 < high - low <=100){
            space = 1;
        }else{
            space = 5;
        }

        var dataObj = newKlineCYQ.getNewObject();
        //确定筹码分布的区间
        var mouseDate_indexOf = chartUtil.indexOfArr(ohlc,mouseDate);

        /**
         * 换手率累加，至100.获取标准日
         */
        var turnoverSum  = 0,//换手率部分和（获取标准成交量对应的成交日的日期）
            markDate=0,//标准日
            colume_max=0,//筹码分布柱形图的最大值
            colume_min=0,//筹码分布柱形图的最小值
            data = [];//筹码分布所选区间的数据组

        for(var i = mouseDate_indexOf-1;i>=0;i--){
            //获取标准成交量对应的成交日的日期
            var ohlcEle = ohlc[i],index=0;
            if(0 == index){
                if(turnoverSum <= 100){
                    turnoverSum += ohlcEle[6];
                    markDate = ohlcEle[0];
                }else{
                    index = index+1;
                    break;//种植循环
                }
            }
        }
        // console.log(turnoverSum);console.log(markDate);console.log(index);
        var markDate_indexOf = chartUtil.indexOfArr(ohlc,markDate);//标准日日期

        if(mouseDate>markDate){
            data = ohlc.slice(markDate_indexOf,mouseDate_indexOf+1);
            colume_max = data[0][2];
            colume_min = data[0][3];
        }else if(mouseDate<markDate){
            data = ohlc.slice(mouseDate_indexOf,markDate_indexOf+1);
            colume_max = data[0][2];
            colume_min = data[0][3];
        }else{
            data = ohlc[mouseDate_indexOf];
            colume_max = data[2];
            colume_min = data[3];
        }

        //筹码分布图的Y轴的最大值与最小值
        if(data.length>1){
            if(mouseDate!=markDate){
                for(var i =0;i<data.length;i++){
                    if(colume_max < data[i][2]){//坐标最大值
                        colume_max = data[i][2]
                    }
                    if(colume_min > data[i][3]){//坐标 最小值
                        colume_min = data[i][3]
                    }
                }
            }
        }

        var len=data.length
        for(var k = 0;k<len;k++){
            //getItem(data[k][2],data[k][3])
            //根据最大值。最小值与间隔，确定Y轴的数值
            var high = data[k][2],
                low = data[k][3],
                x_data = [];

            if(high!=low){
                x_data.push(low);
                for(var i =0;i<(high-low)/space;i++){
                    x_data.push(low+space*i);
                }
            }else if(high==low){//例如乐视网，最高价与最低价相同情况
                x_data.push(low);
            }

            if(x_data[x_data.length-1] < high){
                x_data.push(high);
            }

            var x_data_min = x_data[0];
            var x_data_max = x_data[x_data.length-1];
            var x_data_mid = (Number(x_data_max)+Number(x_data_min))/2;


            if(x_data.length == 1){//例如乐视网，最高价与最低价相同情况
                dataObj[x_data[0]] = '--';
            }else{
                for(var i = 0;i<x_data.length;i++){
                    var price = x_data[i].toFixed(2);
                    if(dataObj[price]){
                        dataObj[price] += newKlineCYQChart.triangular(price,x_data_min,x_data_max,x_data_mid);
                    }else{
                        dataObj[price] = newKlineCYQChart.triangular(price,x_data_min,x_data_max,x_data_mid);
                    }
                }
            }
        }
        // console.log("33333");console.log(dataObj);
        var chartData = [],l_data = [],index= 0,index0 = 0,li_max = 0,txt = '',ind = 1,closeDiv = '';
        for(var i in dataObj){
            var obj = [];
            obj.push(Number(i));
            obj.push(Math.round(dataObj[i]*100)/100);
            chartData.push(obj);
        }

        chartData = chartData.sort(function(x, y){  return x[0] - y[0];}); //根据最低价升序排列

        var step = Math.round(chartData.length/50); //价格区间的间隔

        for(var i = 0;i<chartData.length;i++){
            if(chartData[i][0] >= lineYAxisMin && chartData[i][0] <= lineYAxisMax){
                if(i == index && index0<50){
                    l_data.push(chartData[i]);
                    index = i+step;
                    index0 += 1;
                }
            }
            if(li_max < chartData[i][1]){
                li_max = chartData[i][1];
            }
        }

        var h =  0,cyqH2 = 0;
        if(newKlineCYQ.param.type == 'c'){//横屏显示K线图
            h =  document.body.clientHeight;
            if(chartDivID.indexOf('containerCYQday') >= 0){
                $('#higPrice').html(l_data[l_data.length-1][0]);
                $('#lowPrice').html(l_data[0][0]);
            }else if(chartDivID.indexOf('containerCYQweek') >= 0){
                $('#higPrice_week').html(l_data[l_data.length-1][0]);
                $('#lowPrice_week').html(l_data[0][0]);
            }else if(chartDivID.indexOf('containerCYQmonth') >= 0){
                $('#higPrice_month').html(l_data[l_data.length-1][0]);
                $('#lowPrice_month').html(l_data[0][0]);
            }
            cyqH2 = Math.floor(h*0.7) / 100;
        }else{
            h =  210;
            $('#higPrice'+mathRandom).html(l_data[l_data.length-1][0]);
            $('#lowPrice'+mathRandom).html(l_data[0][0]);
            cyqH2 = Math.floor(h*0.95) / 100;
        }

        var ul_liW = Math.floor(document.body.clientWidth*0.8*0.8);
        for(var i = l_data.length-1;i>=0;i--){
            var item = 0;
            if(isNaN(l_data[i][1])){//例如乐视网，最高价与最低价相同情况,宽度为100%
                item = 100;
            }else{
                item = Math.floor(l_data[i][1]/li_max*100);
            }
            var col = '';
            if(l_data[i][0] <= close){
                col = 'b_red';
                if(ind == 1){
                    closeDiv = '<div class="cloPrice">收盘价：'+close+'</div>';
                    ind += 1;
                }else{
                    closeDiv = '&nbsp;';
                }
            }
            txt += '<li class="'+col+'" style="margin-top:'+cyqH2+'px;height:'+cyqH2+'px;width: '+item+'%">'+closeDiv+'</li>';
        }

        if(newKlineCYQ.param.type == 'c'){//横屏显示K线图
            if(chartDivID.indexOf('containerCYQday') >=0){
                $('#ul_li').html(txt);
            }else if(chartDivID.indexOf('containerCYQweek') >=0){
                $('#ul_li_week').html(txt);
            }else if(chartDivID.indexOf('containerCYQmonth') >=0){
                $('#ul_li_month').html(txt);
            }
            var w = $('#ul_li').width();
            $('.cloPrice').css("width",w*0.9);
        }else{
            $('#ul_li'+mathRandom).html(txt);
            $('.cloPrice').css("width",ul_liW);
        }
    }
};

var chartUtil = {
    indexOfArr:function (arr,d) {
        var n = 0;
        for(var i =0;i<arr.length;i++){
            if(arr[i][0] == d){
                n = i+1;
            }
        }
        return n;
    }
};
