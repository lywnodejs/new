/**
 * Created by xdy on 17-04-17.
 * K线，
 * 象限线
 * 支撑线。压力线
 * 左肩  右肩
 * 首先将取出的象限值进行排序，确定哪个象限值有数据
 * 根据，k线数据与象限值来确定Y轴的label显示
 * 如果有第一象限的最低值，则显示最低值，否则显示k线数据label的最小值
 * 添加历史建议
 */

var kline = {
    sn: 0,
    HttpUrl: '/robot/semantic/',
    //HttpUrl:'http://staging.robot.jinhui001.com/robot/semantic/',
    getTarget: function (sn) {
        kline.sn = sn;
        var temp =
            '<div class="box_stoInfo" id="title' + sn + '"></div>' +//标头
            '<div class="box_bRed box_bRed01" id="legend' + sn + '"><li>操作建议：由<b>【买入】</b>转为<b>【卖出】</b></li></div>' +
            '<div id="report' + sn + '" class="box_stoDay t_red"></div>' +
            '<div class="box_chart01">' +//chart_box
            '<div class="box" style="position:relative; height:320px !important;">' +//box
            '<div id="MACD' + sn + '" style=" width:100%; font-size:0.875em; height:1.333em; position:absolute; z-index:101; left:0; top:161px;"></div>' +
            '<div style="height:100%;">' +//div
            '<div id="container' + sn + '" class="box_chart01" style="height: 310px; position:absolute; z-index:100;"></div>' +
            '</div>' +//div
            '</div>' +//box
            '</div>' +//chart_box
            '<h5 id="explain' + sn + '"></h5>' +
            '<div class="box_timeLine">' +//<!-- 时间轴 -->
            '<a class="openList_xdy' + sn + '" onclick="openList(' + sn + ')">历史建议<i class="icon-arrow_shape_down"></i></a>' +
            '<div class="timeLine" id="timeLine' + sn + '"></div>' +
            '</div>';
        return temp;
    },


    init: function (symbol, question, stockNameFrom) {
        kline.emptyData();
        kline.param.symbol = symbol == null ? 'sh600773' : symbol;//sh603903
        //问题
        kline.param.question = question == null ? '603903' : question;
        var str_qz = kline.param.symbol.toString().substr(0, 2);
        var str_symbol = kline.param.symbol.toString().substr(2, 6);
        kline.param.maker = str_qz;
        if (str_symbol) {
            //根据股票代码查新名称
            KLineService.getKLine(str_qz, str_symbol, stockNameFrom);
        }
    },

    emptyData: function () {
        kline.param.symbol = '';
        kline.param.question = '';
        kline.param.listStr = '';
        kline.param.Q_Data = [];
        kline.param.max = 0;
        kline.param.min = 0;
        kline.param.Q_1_qMinLowPrice = '';
        kline.param.Q_1_qMaxHighPrice = '';
        kline.param.Q_2_qMinLowPrice = '';
        kline.param.Q_2_qMaxHighPrice = '';
        kline.param.Q_3_qMinLowPrice = '';
        kline.param.Q_3_qMaxHighPrice = '';
        kline.param.Q_1_qMinLowPriceData = [];
        kline.param.Q_1_qMaxHighPriceData = [];
        kline.param.Q_2_qMinLowPriceData = [];
        kline.param.Q_2_qMaxHighPriceData = [];
        kline.param.Q_3_qMinLowPriceData = [];
        kline.param.Q_3_qMaxHighPriceData = [];

        kline.param.pressureData = [];
        kline.param.supportData = [];
        kline.param.pressureStartAtLong = '';
        kline.param.pressureStartPrice = '';
        kline.param.pressureEndAtLong = '';
        kline.param.pressureEndPrice = '';

        kline.param.supportStartAtLong = '';
        kline.param.supportStartPrice = '';
        kline.param.supportEndAtLong = '';
        kline.param.pressureEndPrice = '';

        kline.param.lastTime = 0;
        kline.param.title = '';

        kline.param.moduleData = [];
        kline.param.zeroData = [];

        kline.param.difData = [];
        kline.param.deaData = [];
        kline.param.ohlc = [];
    },

    param: {
        symbol: '',
        question: '',
        listStr: '',//接口返回的数据字符串形式
        Q_Data: [],//象限值从小到大排序
        max: 0,
        min: 0,
        Q_1_qMinLowPrice: '123',//第一象限最低值
        Q_1_qMaxHighPrice: '',//第一象限最高值

        Q_2_qMinLowPrice: '',//第二象限最低值
        Q_2_qMaxHighPrice: '',//第二象限最高值

        Q_3_qMinLowPrice: '',//第三象限最低值
        Q_3_qMaxHighPrice: '',//第三象限最高值

        Q_1_qMinLowPriceData: [123],//第一象限最低值数组
        Q_1_qMaxHighPriceData: [],//第一象限最高值数组

        Q_2_qMinLowPriceData: [],//第二象限最低值数组
        Q_2_qMaxHighPriceData: [],//第二象限最高值数组

        Q_3_qMinLowPriceData: [],//第三象限最低值数组
        Q_3_qMaxHighPriceData: [],//第三象限最高值数组

        pressureData: [],//压力线
        supportData: [],//支撑线

        pressureLevelHighPrice: '',//压力位
        supportLevelLowPrice: '',//支撑位

        pressureStartAtLong: '',
        pressureStartPrice: '',
        pressureEndAtLong: '',
        pressureEndPrice: '',

        supportStartAtLong: '',
        supportStartPrice: '',
        supportEndAtLong: '',
        supportEndPrice: '',

        lastTime: 0,//最后一天的时间值
        title: '',//图表标题
        moduleData: [],//9大区域

        zeroData: [],//零坐标

        difData: [],//MACD
        deaData: [],//MACD
        ohlc: []//蜡烛图
    },

    /*
     * 这个方法用来控制K线上的flags的显示情况，当afterSetExtremes时触发该方法,通过flags显示当前时间区间最高价和最低价
     * minTime  当前k线图上最小的时间点
     * maxTime  当前k线图上最大的时间点
     * chart  当前的highstock对象
     */
    showTips: function (ohlcArray, minTime, maxTime, chart, deaarray, difarray) {

        //chart.showLoading();
        //定义当前时间区间中最低价的最小值，最高价的最大值 以及对应的时间
        var lowestPrice, highestPrice, array = [], highestArray = [], lowestArray = [], highestTime, lowestTime,
            flagsMaxData_1 = [], flagsMaxData_2 = [], flagsMinData_1, flagsMinData_2;

        for (var i = 0; i < ohlcArray.length - 1; i++) {
            if (ohlcArray[i][0] >= minTime && ohlcArray[i][0] <= maxTime) {
                array.push([
                    ohlcArray[i][0],
                    ohlcArray[i][2], //最高价
                    ohlcArray[i][3] //最低价
                ])
            }
        }

        if (!array.length > 0) {
            return;
        }
        highestArray = array.sort(function (x, y) {
            return y[1] - x[1];
        })[0];// 根据最高价降序排列
        highestTime = highestArray[0];
        highestPrice = highestArray[1].toFixed(2);

        lowestArray = array.sort(function (x, y) {
            return x[2] - y[2];
        })[0]; //根据最低价升序排列
        lowestTime = lowestArray[0];
        lowestPrice = lowestArray[2].toFixed(2);
        flagsMaxData_2 = [
            {
                x: highestTime,
                title: highestPrice
            }
        ];

        flagsMinData_2 = [
            {
                x: lowestTime,
                title: lowestPrice
            }
        ];
        var min = parseFloat(flagsMinData_2[0].title) - parseFloat(flagsMinData_2[0].title) * 0.05;
        var max = parseFloat(flagsMaxData_2[0].title) + parseFloat(flagsMaxData_2[0].title) * 0.05;
        var tickInterval = (( max - min) / 3).toFixed(1) * 1;


        //Y轴坐标自适应
        chart.yAxis[0].update({
            min: Number(lowestPrice),
            max: Number(highestPrice),
            //tickInterval: tickInterval
            tickPositioner: function () {
                var n0 = (lowestPrice - 0.01).toFixed(2);
                var n1 = Number(Number(lowestPrice) + (highestPrice - lowestPrice) / 4).toFixed(2);
                var n2 = Number(Number(lowestPrice) + 2 * (highestPrice - lowestPrice) / 4).toFixed(2);
                var n3 = Number(Number(lowestPrice) + 3 * (highestPrice - lowestPrice) / 4).toFixed(2);
                var n4 = Number(highestPrice).toFixed(2);
                var positions = [Number(n0), Number(n1), Number(n2), Number(n3), Number(n4)];
                return positions;
            }
        });


        var macdMax, macdMin,
            macdDeaMaxArray = [], macdDeaMax, macdDeaMinArray = [], macdDeaMin,
            macdDifMaxArray = [], macdDifMax, macdDifMinArray = [], macdDifMin;
        macdDeaMaxArray = deaarray.sort(function (x, y) {
            return y[1] - x[1];
        })[0];
        macdDeaMinArray = deaarray.sort(function (x, y) {
            return x[1] - y[1];
        })[0];
        macdDeaMax = Number(macdDeaMaxArray[1]).toFixed(2);
        macdDeaMin = Number(macdDeaMinArray[1]).toFixed(2);

        macdDifMaxArray = difarray.sort(function (x, y) {
            return y[1] - x[1];
        })[0];
        macdDifMinArray = difarray.sort(function (x, y) {
            return x[1] - y[1];
        })[0];
        macdDifMax = Number(macdDifMaxArray[1]).toFixed(2);
        macdDifMin = Number(macdDifMinArray[1]).toFixed(2);

        if (macdDeaMax > macdDifMax) {
            macdMax = macdDeaMax
        } else {
            macdMax = macdDifMax
        }

        if (macdDeaMin > macdDifMin) {
            macdMin = macdDifMin
        } else {
            macdMin = macdDeaMin
        }
        var tickInterval_macd = (( macdMax - macdMin)).toFixed(1) * 1;
        var min_macd = Number(macdMin - 0.01).toFixed(2);
        var max_macd = Number(macdMax + 0.01).toFixed(2);
        /*chart.yAxis[1].update({
         min : min_macd,
         max : max_macd,
         tickPositioner:function(){
         var positions=[min_macd,max_macd];
         return positions;
         }
         });*/


        chart.xAxis[0].update({
            tickPositioner: function () {
                var positions = [minTime, maxTime];
                return positions;
            }
        });
    }
};

var processData = {
    //判断数据为日K、周K或小时K
    setTitle: function (res) {
        if (res.dataType == 'DAY') {
            kline.param.title = '日K';
        }
        if (res.dataType == 'WEEK') {
            kline.param.title = '周K';
        }
        if (res.dataType == 'HOUR') {
            kline.param.title = '小时K';
        }
    },
    //小时K  与  日K  添加最后一根K线
    //日K判断日期是否一样
    //小时K判断是否在15点之前
    //最新价的open是0的时候不用添加到k线，open是0的是停牌或者没开市的时候
    addKlineData: function (rs, ohlc) {

        if (rs.data[0].dataType == 'DAY' || rs.data[0].dataType == 'HOUR') {

            if (rs.data[0].dataType == 'DAY') {
                if (kline.param.listStr.indexOf('newStockData') != -1) {
                    if (rs.data[0].newStockData.newPrice) {
                        if (rs.data[0].newStockData.newPrice !== 0) {
                            if (new Date(ohlc[ohlc.length - 1][0]).getDate() != new Date(rs.data[0].newStockData.tradeAtLong).getDate()) {
                                if (rs.data[0].newStockData.open !== 0) {
                                    ohlc.push([
                                        rs.data[0].newStockData.tradeAtLong,
                                        rs.data[0].newStockData.open,
                                        rs.data[0].newStockData.high,
                                        rs.data[0].newStockData.low,
                                        rs.data[0].newStockData.newPrice,
                                        rs.data[0].newStockData.preClose
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
            if (rs.data[0].dataType == 'HOUR') {
                if (kline.param.listStr.indexOf('newStockData') != -1) {
                    if (rs.data[0].newStockData.newPrice) {
                        if (rs.data[0].newStockData.newPrice !== 0) {
                            var d = new Date(rs.data[0].newStockData.tradeAtLong);
                            var str = d.getHours() + ":" + d.getMinutes();
                            if (chartTimeUtil.time_range("09:30", "15:00", str)) {
                                if (rs.data[0].newStockData.open !== 0) {
                                    ohlc.push([
                                        rs.data[0].newStockData.tradeAtLong,
                                        rs.data[0].newStockData.open,
                                        rs.data[0].newStockData.high,
                                        rs.data[0].newStockData.low,
                                        rs.data[0].newStockData.newPrice,
                                        rs.data[0].newStockData.preClose
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
        }
        return ohlc
    },
    /**
     * 股票名称 代码 时间 时间对应的涨幅
     */
    getStockBaseInfo: function (rs) {
        var newPrice = '--',
            zd = '--',
            zf = 0,
            zfColor = '',
            txt = '',
            stockName = '--',
            stockCode = '--',
            tradeAt = '--';

        if (kline.param.listStr.indexOf('stockName') != -1) {
            stockName = rs.data[0].stockName;
            if (stockName == null || stockName == "null") {
                stockName = stockNameFrom;
            }
        }
        if (kline.param.listStr.indexOf('stockCode') != -1) {
            stockCode = rs.data[0].stockCode;
        }

        if (kline.param.listStr.indexOf('newPrice') != -1) {//昨收，
            newPrice = rs.data[0].newStockData.newPrice;
            newPrice = newPrice.toFixed(2);
        }

        if (kline.param.listStr.indexOf('rise') != -1) {//涨幅，
            zf = rs.data[0].newStockData.rise;
            zf = zf.toFixed(2);
            if (zf > 0) {
                zf = '+' + zf;
                zfColor = 't_red';
                $("#report" + kline.sn).removeClass("t_red").removeClass("t_green").addClass("t_red");
            } else if (zf < 0) {
                zfColor = 't_green';
                $("#report" + kline.sn).removeClass("t_red").removeClass("t_green").addClass("t_green");
            } else {
                zfColor = '';
                $("#report" + kline.sn).removeClass("t_red").removeClass("t_green");
            }
        }
        if (kline.param.listStr.indexOf('change') != -1) {//涨跌，
            zd = rs.data[0].newStockData.change;
            zd = zd.toFixed(2);
        }

        if (kline.param.listStr.indexOf('tradeAtLong') != -1) {//返回时间
            var date = new Date(parseInt(rs.data[0].newStockData.tradeAtLong, 10));
            var year = date.getFullYear();
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            tradeAt = year + '-' + month + '-' + currentDate + ' ' + hours + ':' + minutes + ':' + seconds;
        }

        txt = "<li><p>" + stockName + " (" + stockCode + ") </p><h6>" + tradeAt + "</h6></li><li class='" + zfColor + "'><p>" + newPrice + "</p><h6>" + zd + "(" + zf + "%)</h6></li>";

        $('#title' + kline.sn).html(txt);
        $("#report" + kline.sn).html('<span>' + year + '-' + month + '-' + currentDate + '</span><span>开<em>' + rs.data[0].newStockData.open + '</em></span><span>收<em>' + newPrice + '</em></span><span>幅<em>' + zf + '%</em></span>');

        return newPrice
    },
    /**
     * 红框白字一行
     * 支撑位大  压力位
     * 操作建议
     * 观望字符 不显示(0123-静静赵伟)
     */
    getLegendtxt: function (rs, list, newPrice) {
        var legend_txt = '';
        //支撑位 支撑取最低，
        if (kline.param.listStr.indexOf('supportLevelLowPrice') !== -1) {
            kline.param.supportLevelLowPrice = list.Q_1.supportLevelLowPrice
        } else {
            kline.param.supportLevelLowPrice = '';
        }

        //压力位 压力位取最高
        if (kline.param.listStr.indexOf('pressureLevelHighPrice') !== -1) {
            kline.param.pressureLevelHighPrice = list.Q_1.pressureLevelHighPrice
        } else {
            kline.param.pressureLevelHighPrice = '';
        }

        //操作建议
        var isPreEntrustBs = (rs.data[0].preEntrustBs == 0 || rs.data[0].preEntrustBs == 1 || rs.data[0].preEntrustBs == 2) ? true : false;
        var isEntrustBs = (rs.data[0].entrustBs == 0 || rs.data[0].entrustBs == 1 || rs.data[0].entrustBs == 2) ? true : false;

        if (isEntrustBs) {
            if (0 == rs.data[0].entrustBs) {
                legend_txt += '';
            } else {
                legend_txt += getTXT(rs.data[0].entrustBs) + '&nbsp;&nbsp;&nbsp;&nbsp;';
            }
        } else {
            legend_txt += '';
        }

        /**
         * 支撑位大于现价 && 压力位小于现价 就不显示红色条
         */
        if (kline.param.pressureLevelHighPrice && kline.param.pressureLevelHighPrice > newPrice) {
            legend_txt += '压力位：' + kline.param.pressureLevelHighPrice;
        }
        if (kline.param.supportLevelLowPrice && kline.param.supportLevelLowPrice < newPrice) {
            legend_txt += '支撑位：' + kline.param.supportLevelLowPrice;
        }

        if (legend_txt.length > 0) {
            $("#legend" + kline.sn).show();
        } else {
            $("#legend" + kline.sn).hide();
        }

        $("#legend" + kline.sn).html('<li>' + legend_txt + '</li>');
    },
    //压力线
    getPressureData: function (list) {
        if (kline.param.listStr.indexOf('pressureStartAtLong') !== -1 && kline.param.listStr.indexOf('pressureStartPrice') !== -1 && kline.param.listStr.indexOf('pressureEndAtLong') !== -1 && kline.param.listStr.indexOf('pressureEndPrice') !== -1) {
            if (list.Q_1.pressureStartAtLong && list.Q_1.pressureStartPrice && list.Q_1.pressureEndAtLong && list.Q_1.pressureEndPrice && list.Q_1.pressureStartAtLong != list.Q_1.pressureEndAtLong) {
                kline.param.pressureStartAtLong = list.Q_1.pressureStartAtLong;
                kline.param.pressureStartPrice = list.Q_1.pressureStartPrice;
                kline.param.pressureEndAtLong = list.Q_1.pressureEndAtLong;
                kline.param.pressureEndPrice = list.Q_1.pressureEndPrice;

                kline.param.pressureData.push(
                    [list.Q_1.pressureStartAtLong, list.Q_1.pressureStartPrice],
                    [list.Q_1.pressureEndAtLong, list.Q_1.pressureEndPrice]
                )
            } else {
                kline.param.pressureStartAtLong = '';
                kline.param.pressureStartPrice = '';
                kline.param.pressureEndAtLong = '';
                kline.param.pressureEndPrice = '';
                kline.param.pressureData = [];
            }

        } else {
            kline.param.pressureStartAtLong = '';
            kline.param.pressureStartPrice = '';
            kline.param.pressureEndAtLong = '';
            kline.param.pressureEndPrice = '';
            kline.param.pressureData = [];
        }
    },
    //支撑线
    getSupportData: function (list) {
        if (kline.param.listStr.indexOf('supportStartAtLong') !== -1 && kline.param.listStr.indexOf('supportStartPrice') !== -1 && kline.param.listStr.indexOf('supportEndAtLong') !== -1 && kline.param.listStr.indexOf('supportEndPrice') !== -1) {
            if (list.Q_1.supportStartAtLong && list.Q_1.supportStartPrice && list.Q_1.supportEndAtLong && list.Q_1.supportEndPrice && list.Q_1.supportStartAtLong != list.Q_1.supportEndAtLong) {
                kline.param.supportStartAtLong = list.Q_1.supportStartAtLong;
                kline.param.supportStartPrice = list.Q_1.supportStartPrice;
                kline.param.supportEndAtLong = list.Q_1.supportEndAtLong;
                kline.param.supportEndPrice = list.Q_1.supportEndPrice;

                kline.param.supportData.push(
                    [list.Q_1.supportStartAtLong, list.Q_1.supportStartPrice],
                    [list.Q_1.supportEndAtLong, list.Q_1.supportEndPrice]
                )
            } else {
                kline.param.supportStartAtLong = '';
                kline.param.supportStartPrice = '';
                kline.param.supportEndAtLong = '';
                kline.param.supportEndPrice = '';
                kline.param.supportData = [];
            }
        } else {
            kline.param.supportStartAtLong = '';
            kline.param.supportStartPrice = '';
            kline.param.supportEndAtLong = '';
            kline.param.supportEndPrice = '';
            kline.param.supportData = [];
        }
    },
    //macd
    getMACDData: function (rs) {
        if (kline.param.listStr.indexOf('macdData') !== -1) {
            if (rs.data[0].macdData) {
                var macdList = rs.data[0].macdData;
                var difData = [];//dif数据
                var deaData = [];//dea数据
                for (var k = 0; k < macdList.length; k++) {
                    difData.push([
                        macdList[k].tradeAtLong,
                        macdList[k].dif
                    ]);
                    deaData.push([
                        macdList[k].tradeAtLong,
                        macdList[k].dea
                    ]);
                    kline.param.zeroData.push([
                        macdList[k].tradeAtLong,
                        0
                    ]);
                }

                kline.param.difData = difData;
                kline.param.deaData = deaData;
            }

        } else {
            alert("未返回macd数据");
        }
    },
    //历史建议
    setHistoryFlowData: function (rs) {
        if (kline.param.listStr.indexOf('flowData') !== -1) {
            if (rs.data[0].flowData) {
                var flowList = rs.data[0].flowData.sort(compare('entrustBsStartAt'));

                var txt = '', li_class = '', li_tit = '', pre_li_txt = '', en_li_txt = '', getLength = 0;
                txt += '<ul>';
                if (flowList.length > 5) {
                    getLength = 5;
                } else {
                    getLength = flowList.length;
                }
                if(flowList.length == 0){//暂无历史建议
                    txt += '<li class=' + li_class + '>' +
                        '<dt>' +
                        '<b></b>' +
                        '<s><i></i></s>' +
                        '</dt>' +
                        '<dd>' +
                        '<div class="space_between">' +
                        '<span>暂无历史建议</span>' +
                        '</div>' +
                        '</dd>' +
                        '</li>';
                }else{
                    for (var k = 0; k < getLength; k++) {
                        var isPreEntrustBs = (flowList[k].preEntrustBs == 0 || flowList[k].preEntrustBs == 1 || flowList[k].preEntrustBs == 2) ? true : false;
                        var isEntrustBs = (flowList[k].entrustBs == 0 || flowList[k].entrustBs == 1 || flowList[k].entrustBs == 2) ? true : false;

                        if (isPreEntrustBs && isEntrustBs) {
                            if (flowList[k].preEntrustBs == flowList[k].entrustBs) {
                                li_tit = '发出' + getTXT(flowList[k].preEntrustBs) + '信号';
                            } else {
                                li_tit = li_tit = '由' + getTXT(flowList[k].preEntrustBs) + '转为' + getTXT(flowList[k].entrustBs) + '信号';
                            }
                        } else if (isPreEntrustBs && !isEntrustBs) {
                            li_tit = '发出' + getTXT(flowList[k].preEntrustBs) + '信号';
                        } else if (!isPreEntrustBs && isEntrustBs) {
                            li_tit = '发出' + getTXT(flowList[k].entrustBs) + '信号';
                        } else {
                            li_tit = '';
                        }

                        var date = new Date(parseInt(flowList[k].entrustBsStartAt, 10));
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

                        txt += '<li class=' + li_class + '>' +
                            '<dt>' +
                            '<b></b>' +
                            '<s><i></i></s>' +
                            '</dt>' +
                            '<dd>' +
                            '<div class="space_between">' +
                            '<span>' + year + '-' + month + '-' + currentDate + li_tit + '</span>' +
                            /*'<span class="date">'+Highcharts.dateFormat("%Y/%m/%d",flowList[k].entrustBsStartAt)+'</span>'+*/
                            '</div>' +
                            /*'<h5>'+flowList[k].analysisText+'</h5>'+*/
                            '</dd>' +
                            '</li>';
                    }
                }
                txt += '</ul>';
                $('#timeLine' + kline.sn).html(txt);
            }
        } else {
            //alert("未返回历史建议");
            var txt = '';
            txt += '<ul>' +
                '<li class=' + li_class + '>' +
                '<dt>' +
                '<b></b>' +
                '<s><i></i></s>' +
                '</dt>' +
                '<dd>' +
                '<div class="space_between">' +
                '<span>暂无历史建议</span>' +
                '</div>' +
                '</dd>' +
                '</li>'+
                '</ul>';
            $('#timeLine' + kline.sn).html(txt);
        }
    },
    //获取象限最大值最小值
    getQuadrantPrice: function (list, paramArr) {

        var Q_Data = [],
            Q_1_qMinLowPrice = '',
            Q_1_qMaxHighPrice = '',
            Q_2_qMinLowPrice = '',
            Q_2_qMaxHighPrice = '',
            Q_3_qMinLowPrice = '',
            Q_3_qMaxHighPrice = '',
            max = 0, min = 1000;

        /**
         * 取出每个象限值最大值 最小值
         * 对所有象限值里的最大值 最小值进行比较，取得其中的最大值赋给max，最小值赋给min
         */
        for (var param in paramArr) {
            var quadrantParam = paramArr[param]
            var qMinLowPrice = eval(paramArr[param] + '_qMinLowPrice');
            var qMaxHighPrice = eval(paramArr[param] + '_qMaxHighPrice');
            if (kline.param.listStr.indexOf(quadrantParam) != -1) {
                if (kline.param.listStr.indexOf('qMinLowPrice') !== -1) {
                    if (list[quadrantParam].qMinLowPrice) {
                        qMinLowPrice = list[quadrantParam].qMinLowPrice;
                        if (max < qMinLowPrice) {
                            max = qMinLowPrice;
                        }
                        if (min > qMinLowPrice) {
                            min = qMinLowPrice;
                        }
                        var temp = [];
                        temp.push(quadrantParam + "_qMinLowPrice");
                        temp.push(qMinLowPrice);
                        Q_Data.push(temp);
                    }
                } else {
                    max = 0;
                    min = 0;
                }
                if (kline.param.listStr.indexOf('qMaxHighPrice') !== -1) {
                    if (list[quadrantParam].qMaxHighPrice) {
                        qMaxHighPrice = list[quadrantParam].qMaxHighPrice;
                        if (max < qMaxHighPrice) {
                            max = qMaxHighPrice;
                        }
                        if (min > qMaxHighPrice) {
                            min = qMaxHighPrice;
                        }
                        var temp = [];
                        temp.push(quadrantParam + "_qMaxHighPrice");
                        temp.push(qMaxHighPrice);
                        Q_Data.push(temp);
                    }
                } else {
                    max = 0;
                    min = 0;
                }
            } else {
                qMinLowPrice = '';
                qMaxHighPrice = '';
            }
        }
        kline.param.max = max;
        kline.param.min = min;
        kline.param[quadrantParam+ "_qMinLowPrice"] = qMinLowPrice
        kline.param[quadrantParam+ "_qMaxHighPrice"] = qMaxHighPrice

        return Q_Data
    },
    //取象限区间的数值组
    getQuadrantPriceData: function(ohlc, paramArr){
        for (var i = 0; i < ohlc.length; i++) {
            for (var param in paramArr) {
                var qMinLowPrice = paramArr[param] + '_qMinLowPrice';
                var qMaxHighPrice = paramArr[param] + '_qMaxHighPrice';
                var qMinLowPriceData = paramArr[param] + '_qMinLowPriceData';
                var qMaxHighPriceData = paramArr[param] + '_qMaxHighPriceData';
                //第n象限最低
                if (kline.param[qMinLowPrice]) {
                    var temp = [];
                    temp.push(ohlc[i][0]);
                    temp.push(kline.param[qMinLowPrice]);
                    kline.param[qMinLowPriceData].push(temp);
                } else {
                    kline.param[qMinLowPriceData] = [];
                }
                //第n象限最高
                if (kline.param[qMaxHighPrice]) {
                    var temp = [];
                    temp.push(ohlc[i][0]);
                    temp.push(kline.param[qMaxHighPrice]);
                    kline.param[qMaxHighPriceData].push(temp);
                } else {
                    kline.param[qMaxHighPriceData] = [];
                }
            }

        }
    }
}

var KLineService = {
    getKLine: function (val, symbol, stockNameFrom) {
        jQuery.ajax(
            {
                //url: "http://stock-analysis-service:31001/trend/analysis/"+val+"/"+symbol,
                url: kline.HttpUrl + "/stock-analysis-service/trend/analysis/" + val + "/" + symbol,
                type: 'get',
                async: null,
                data: null,
                dataType: 'jsonp',
                success: function (rs) {
                    if (rs) {

                        //有数据  用永奂技术分析的接口
                        //无数据的情况下，将不能打开技术面分析弹窗
                        //如果下一步有需求变动，无数据时也可以打开技术面分析弹窗，则用丛丛 支撑压力的接口
                        if (rs.data.length > 0) {
                            kline.param.listStr = JSON.stringify(rs.data[0]);

                            //判断日K、周K或小时K
                            processData.setTitle(rs.data[0])

                            /**
                             * K线数据组
                             */
                            var stockList = rs.data[0].stockData;
                            var ohlc = [];//蜡烛图数据
                            var list = ''
                            if (stockList.length > 0) {
                                var len = stockList.length;

                                for (var j = 0; j < len; j++) {
                                    ohlc.push([
                                        stockList[j].tradeAtLong,
                                        stockList[j].open,
                                        stockList[j].high,
                                        stockList[j].low,
                                        stockList[j].close,
                                        stockList[j].preClose
                                    ]);
                                }
                            } else {
                                alert("未返回K线数据");
                            }
                            //小时K  与  日K  添加最后一根K线
                            //日K判断日期是否一样
                            //小时K判断是否在15点之前
                            //最新价的open是0的时候不用添加到k线，open是0的是停牌或者没开市的时候
                            ohlc = processData.addKlineData(rs, ohlc)
                            list = rs.data[0].quadrants;

                            kline.param.ohlc = ohlc;

                            /**
                             * 股票名称 代码、价格、时间、时间对应的涨幅
                             */
                            var newPrice = '--'
                            newPrice = processData.getStockBaseInfo(rs)

                            /**
                             * 红框白字一行
                             * 支撑位大  压力位
                             * 操作建议
                             * 观望字符 不显示(0123-静静赵伟)
                             */
                            processData.getLegendtxt(rs, list, newPrice)
                            /**
                             * 支撑线，压力线。左肩。右肩。
                             * 首先将取出的象限值进行排序，确定哪个象限值有数据
                             */
                            //压力线数据
                            processData.getPressureData(list)
                            //支撑线数据
                            processData.getSupportData(list)
                            //macd数据
                            processData.getMACDData(rs)

                            //话术
                            if (kline.param.listStr.indexOf('analysisText') !== -1) {

                                $('#explain' + kline.sn).html('<b>技术面分析：</b>' + rs.data[0].analysisText.replace('null', stockNameFrom));
                            }

                            /**
                             * 历史建议  排序以后取前五条
                             */
                            processData.setHistoryFlowData(rs)


                            var Q_Data = [];
                            var paramArr = ['Q_1', 'Q_2', 'Q_3']
                            /**
                             * 取出每个象限值最大值 最小值
                             * 对所有象限值里的最大值 最小值进行比较，取得其中的最大值赋给max，最小值赋给min
                             */
                            Q_Data = processData.getQuadrantPrice(list, paramArr)
                            /**
                             * 象限值 Q_Data
                             * 从小到大排序
                             */
                            kline.param.Q_Data = Q_Data.sort(function (a, b) {
                                return a[1] - b[1]
                            });

                            //取象限区间的数值组
                            processData.getQuadrantPriceData(ohlc, paramArr)

                            //确定Y轴的最大值与最小值
                            kline.param.max = ohlc[0][2];
                            kline.param.min = ohlc[0][3];

                            for (var i = 0; i < ohlc.length; i++) {
                                if (kline.param.max < ohlc[i][2]) {//坐标最大值
                                    kline.param.max = ohlc[i][2]
                                }
                                if (kline.param.min > ohlc[i][3]) {//坐标最小值
                                    kline.param.min = ohlc[i][3]
                                }
                            }

                            //获得K线图底部线的数据
                            if (kline.param.Q_1_qMinLowPriceData.length == 0) {
                                for (var i = 0; i < ohlc.length; i++) {
                                    var temp = [];
                                    temp.push(ohlc[i][0]);
                                    temp.push(kline.param.min);
                                    kline.param.Q_1_qMinLowPriceData.push(temp);
                                }
                            }

                            // if (!kline.param.Q_3_qMaxHighPrice) {//当没有象限值时，y轴的最高点显示
                            //     kline.param.Q_3_qMaxHighPrice = kline.param.max;
                            // }
                            // if (!kline.param.Q_1_qMinLowPrice) {//当没有象限值时，y轴的最低点显示
                            //     kline.param.Q_1_qMinLowPrice = kline.param.min;
                            // }

                            /**
                             * 9大区域
                             */
                            if (kline.param.listStr.indexOf('moduleData') != -1) {
                                kline.param.moduleData = rs.data[0].directionData;
                            }
                            mapData(kline.param.ohlc, kline.param.difData, kline.param.deaData);

                        }
                        else {
                            //查询股票代码、名称。现价。涨跌幅等
                            KLineServiceNoData.getStockName(val, symbol, kline.sn);
                            //K线数据
                            KLineServiceNoData.getKLine(val, symbol, kline.sn);
                        }

                    }

                },
                error: ajaxErrorHandler
            });
    }
};

/**
 * 将K线数据映射成坐标系中的点
 * @param str
 * @returns {number}
 */
function mapData(ohlc, difData, deaData) {
    kline.param.lastTime = ohlc[ohlc.length - 1][0];
    var _list = [];//将数据映射成坐标系中的点
    for (var j = 0; j < ohlc.length; j++) {
        _list.push([
            j,
            ohlc[j][0]
        ]);
    }

    /**
     * 将切线数据装换成坐标系中的点
     * @type {Array}
     */

    /**
     * 两条切线方程
     * (b1-d1)x+(c1-a1)y = b1c1-a1d1     (max,pre)
     * (b2-d2)x+(c2-a2)y = b2c2-a2d2     (min,sup)
     * 一共有53条数据，最后一天映射坐标系中的点（52，y）
     * 当x=52时，求y
     *
     */


    var l1 = kline.param.pressureData;
    var l2 = kline.param.supportData;
    var data1 = [];
    var data2 = [];

    //压力线
    if (kline.param.pressureData.length > 0) {
        for (var i = 0; i < l1.length; i++) {
            for (var j = 0; j < _list.length; j++) {
                if (l1[i][0] == _list[j][1]) {
                    var temp = [];
                    temp.push(_list[j][0], l1[i][1]);
                    data1.push(temp);
                }
            }
        }
        var a_1 = Number(data1[0][0]),
            b_1 = Number(data1[0][1]),
            c_1 = Number(data1[1][0]),
            d_1 = Number(data1[1][1]),

            x1 = 0,
            y1 = 0;
        //交点公式
        /*x=[(b_1*c_1-a_1*d_1)*(c_2-a_2)-(c_1-a_1)*(b_2*c_2-a_2*d_2)]/[(b_1-d_1)*(c_2-a_2)-(c_1-a_1)*(b_2-d_2)];
         y=[(b_2*c_2-a_2*d_2)*(b_1-d_1)-(b_2-d_2)*(b_1*c_1-a_1*d_1)]/[(b_1-d_1)*(c_2-a_2)-(c_1-a_1)*(b_2-d_2)];*/

        //y1 = [(b_1*c_1-a_1*d_1)-52*(b_1-d_1)]/(c_1-a_1);
        x1 = [(b_1 * c_1 - a_1 * d_1) - kline.param.Q_1_qMinLowPrice * (c_1 - a_1)] / (b_1 - d_1);

        y1 = [(b_1 * c_1 - a_1 * d_1) - parseInt(ohlc.length) * (b_1 - d_1)] / (c_1 - a_1);
        var temp = 0;
        for (var j = 0; j < ohlc.length; j++) {
            if (Math.floor(x1) == _list[j][0]) {
                temp = _list[j][1]
            }
        }
        /**
         * 如果与z轴交点不在k线返回数据范围内，则与最后一根线相交
         */
        if (x1 < ohlc.length) {
            kline.param.pressureData.push([temp, kline.param.Q_1_qMinLowPrice]);
        } else {
            kline.param.pressureData.push([kline.param.lastTime, Number(y1.toFixed(2))]);
        }

    }
    //支撑线
    if (kline.param.supportData.length > 0) {
        for (var i = 0; i < l2.length; i++) {
            for (var j = 0; j < _list.length; j++) {
                if (l2[i][0] == _list[j][1]) {
                    var temp = [];
                    temp.push(_list[j][0], l2[i][1]);
                    data2.push(temp);
                }
            }
        }

        var a_2 = Number(data2[0][0]),
            b_2 = Number(data2[0][1]),
            c_2 = Number(data2[1][0]),
            d_2 = Number(data2[1][1]),

            y2 = 0;
        //y2 = [(b_2*c_2-a_2*d_2)-52*(b_2-d_2)]/(c_2-a_2);

        y2 = [(b_2 * c_2 - a_2 * d_2) - parseInt(ohlc.length) * (b_2 - d_2)] / (c_2 - a_2);

        kline.param.supportData.push([kline.param.lastTime, Number(y2.toFixed(2))]);
    }
    createChart(kline.param.ohlc, kline.param.difData, kline.param.deaData);
}

// create the chart
var chart

function createChart(ohlc, difData, deaData) {
    //var chartW = parseInt(window.parent.innerWidth)*0.88;
    var chartW = $('.box_stoInfo').width();
    var chartH = $("#container" + kline.sn).height();

    var $reporting = $("#report" + kline.sn);

    var $macd = $("#MACD" + kline.sn);
    $macd.html('<span style="font-family: 微软雅黑;font-size: 0.825em;font-weight: normal;color: #000">MACD&nbsp;</span>'
        + '<span style="font-family: 微软雅黑;font-size: 0.825em;font-weight: normal;color: #d75d04">DIF:&nbsp;</span>'
        + '<span style="font-family: 微软雅黑;font-size: 0.825em;font-weight: normal;color: #056ceb">DEA:</span>'
    );

    //判断支撑线。压力线、左肩、右肩图例的显示隐藏
    var pressureDataLegend = false,
        supportDataLegend = false,
        leftDataLegend = false,
        rightDataLegend = false,
        legendName = '';

    if (kline.param.pressureData.length > 0) {
        pressureDataLegend = true;
    }
    if (kline.param.supportData.length > 0) {
        supportDataLegend = true;
    }


    //X轴显示的起始日期
    var startDate = ohlc[0][0];
    var lastDate = ohlc[ohlc.length - 1][0];

    //macd y坐标的最大值与最小值

    var macdMax = difData[0][1];
    var macdMin = difData[0][1];
    var macdMaxData = [];
    if (difData.length > 0) {
        for (var i = 0; i < difData.length; i++) {
            if (macdMax < difData[i][1]) {
                macdMax = difData[i][1];
            }
            if (macdMin > difData[i][1]) {
                macdMin = difData[i][1];
            }
        }
    }
    if (deaData.length > 0) {
        for (var i = 0; i < deaData.length; i++) {
            if (macdMax < deaData[i][1]) {
                macdMax = deaData[i][1];
            }
            if (macdMin > deaData[i][1]) {
                macdMin = deaData[i][1];
            }
        }
    }
    //判断开盘涨停的情况，以便于控制柱形图的颜色
    for (var i = 0; i < ohlc.length; i++) {
        var zf = parseFloat((parseFloat(ohlc[i][4]) - parseFloat(ohlc[i][5])) / parseFloat(ohlc[i][5]) * 100);
        if (zf.toFixed(2) > 9.9) {
            ohlc[i][4] = parseFloat(ohlc[i][4]) + 0.01;
        }

    }
    for (var i = 0; i < difData.length; i++) {
        macdMaxData.push([difData[i][0], Number((macdMax + 0.01).toFixed(2))]);
    }

    Highcharts.setOptions({
        lang: {
            contextButtonTitle: "图表导出菜单",
            decimalPoint: ".",
            downloadJPEG: "下载JPEG图片",
            downloadPDF: "下载PDF文件",
            downloadPNG: "下载PNG文件",
            downloadSVG: "下载SVG文件",
            drillUpText: "返回 {series.name}",
            loading: "加载中",
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            noData: "没有数据",
            numericSymbols: ["千", "兆", "G", "T", "P", "E"],
            printChart: "打印图表",
            resetZoom: "恢复缩放",
            resetZoomTitle: "恢复图表",
            shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            thousandsSep: ",",
            weekdays: ["星期一", "星期二", "星期三", "星期三", "星期四", "星期五", "星期六", "星期天"]
        }
    });

    var c = new Highcharts.StockChart({
        chart: {
            //关闭平移  ok
            panning: false,
            pinchType: 'none',
            zoomType: 'x',
            renderTo: 'container' + kline.sn,
            spacingTop: 5,
            spacingLeft: 3,
            spacingRight: 0,
            width: chartW,
            events: {
                load: function () {
                    kline.showTips(ohlc, ohlc[0][0], ohlc[ohlc.length - 1][0], this, deaData, difData);
                    //add9Area(this);
                },
                selection: function (event) {
                    if (event.xAxis) {
                        event.xAxis[0].axis.tickPositions = [Number(startDate), Number(lastDate)];
                    }
                }
            }
        },
        loading: {
            labelStyle: {
                position: 'relative',
                top: '10em',
                zindex: 1000
            }
        },
        credits: {//隐藏Highchart.com
            enabled: false
        },
        rangeSelector: {
            enabled: false,//隐藏日期选择器
            inputDateFormat: '%Y-%m-%d'  //设置右上角的日期格式

        },
        legend: {//图例
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            itemDistance: 10,
            symbolPadding: 3,
            symbolWidth: 10,
            itemMarginTop: -8,
            itemMarginBottom: -8
        },
        yAxis: [
            {
                title: {
                    enable: false
                },
                height: '63%',
                lineWidth: 1,//Y轴边缘线条粗细
                gridLineColor: 'rgba(0,0,0,0)',
                gridLineWidth: 0.1,
                opposite: false,
                labels: {
                    align: 'left',
                    x: 0,
                    formatter: function () {
                        return this.value;
                    }
                }
            }, {
                title: {
                    enable: false
                },
                opposite: false,
                top: '70%',
                height: '30%',
                gridLineColor: 'rgba(0,0,0,0)',
                gridLineWidth: 0.1,
                lineWidth: 1,
                labels: {
                    align: 'left',
                    x: 0,
                    formatter: function () {
                        return this.value;
                    }
                },
                tickPositioner: function () {
                    var positions = [Number((macdMin - 0.01).toFixed(2)), Number((macdMax + 0.01).toFixed(2))];
                    return positions;

                }
            }],
        xAxis: {//自定义X轴显示格式
            gridLineColor: 'rgba(0,0,0,0)',
            type: 'datetime',
            labels: {
                formatter: function () {
                    return Highcharts.dateFormat('%Y-%m-%d', this.value);
                }
            },
            tickPositioner: function () {
                var positions = [startDate, lastDate];
                return positions;
            },
            events: {
                afterSetExtremes: function (e) {
                    var minTime = Highcharts.dateFormat("%Y-%m-%d", e.min);
                    var maxTime = Highcharts.dateFormat("%Y-%m-%d", e.max);
                    var chart = this.chart;
                    //当图形需要有缩放时，添加此方法
                    // kline.showTips(ohlc, e.min, e.max, chart, deaData, difData);
                }
            }
        },
        title: {
            align: 'left',
            verticalAlign: 'top',
            useHTML: true,
            text: "<span style='font-family: 微软雅黑;font-size: 0.625em;font-weight: normal'>" + kline.param.title + " 前复权</span>",
            floating: true
        },
        subtitle: {
            enable: false
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
                maker: {
                    states: {
                        hover: {
                            enabled: false
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
                    legendItemClick: function (e) {
                        return false; // 直接 return false 即可禁用图例点击事件
                    }
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
            enabled: true,
            backgroundColor: 'transparent',   // 背景颜色
            borderColor: 'transparent',         // 边框颜色
            borderRadius: 10,             // 边框圆角
            borderWidth: 3,               // 边框宽度
            shadow: false,                 // 是否显示阴影
            animation: false,               // 是否启用动画效果

            formatter: function () {
                formatterTooltip(this, $reporting, $macd, ohlc)
            }
        },
        series: [
            {
                type: 'candlestick',
                dataGrouping: {enabled: false},
                name: 'K',
                data: ohlc,
                showInLegend: false // 设置为 false 即为不显示在图例中
            }, {
                type: 'line',
                dataGrouping: {enabled: false},
                name: '第一象限',
                data: kline.param.Q_1_qMinLowPriceData,
                id: 'k-dataseries',
                showInLegend: false,
                color: '#606060',
                lineWidth: 0.5
            }, {
                type: 'line',
                dataGrouping: {enabled: false},
                name: '第一象限',
                data: kline.param.Q_1_qMaxHighPriceData,
                showInLegend: false,
                dashStyle: 'ShortDash',
                color: '#becad6',
                lineWidth: 0.25
            }, {
                type: 'line',
                dataGrouping: {enabled: false},
                name: '第二象限',
                data: kline.param.Q_2_qMinLowPriceData,
                showInLegend: false,
                dashStyle: 'ShortDash',
                color: '#becad6',
                lineWidth: 0.25
            }, {
                type: 'line',
                dataGrouping: {enabled: false},
                name: '第二象限',
                data: kline.param.Q_2_qMaxHighPriceData,
                showInLegend: false,
                dashStyle: 'ShortDash',
                color: '#becad6',
                lineWidth: 0.25
            }, {
                type: 'line',
                dataGrouping: {enabled: false},
                name: '第三象限',
                data: kline.param.Q_3_qMinLowPriceData,
                showInLegend: false,
                dashStyle: 'ShortDash',
                color: '#becad6',
                lineWidth: 0.25
            }, {
                type: 'line',
                dataGrouping: {enabled: false},
                name: '第三象限',
                data: kline.param.Q_3_qMaxHighPriceData,
                showInLegend: false,
                dashStyle: 'ShortDash',
                color: '#becad6',
                lineWidth: 0.5
            }, {
                type: 'line',
                dataGrouping: {enabled: false},
                name: '压力',
                data: kline.param.pressureData,
                color: 'green',//绿色
                lineWidth: 1,
                dashStyle: 'ShortDash',
                showInLegend: pressureDataLegend
            }, {
                type: 'line',
                dataGrouping: {enabled: false},
                name: '支撑',
                data: kline.param.supportData,
                color: '#dd113c',//红色
                lineWidth: 1,
                showInLegend: supportDataLegend
            }, {
                type: 'line',
                name: '零轴',
                dataGrouping: {enabled: false},
                showInLegend: false,
                data: kline.param.zeroData,
                color: '#9c9c9c',//
                lineWidth: 0.5,
                dashStyle: 'ShortDash',
                yAxis: 1
            }, {
                type: 'line',
                name: 'macd封顶线',
                dataGrouping: {enabled: false},
                showInLegend: false,
                data: macdMaxData,
                color: '#606060',
                lineWidth: 0.5,
                yAxis: 1
            }, {
                type: 'line',
                name: 'DEA',
                dataGrouping: {enabled: false},
                showInLegend: false,
                color: '#056ceb',//黑色
                data: deaData,
                lineWidth: 1,
                yAxis: 1
            }, {
                type: 'line',
                name: 'DIF',
                dataGrouping: {enabled: false},
                showInLegend: false,
                color: '#d75d04',//蓝色
                data: difData,
                lineWidth: 1,
                yAxis: 1
            }]
    });

    chart = $('#container' + kline.sn).highcharts();
    return c;
}

function formatterTooltip($this, $reporting, $macd, ohlc) {

    var open = 0;
    var close = 0;

    /**
     * this.points
     * 9大区域 返回的是object
     * 其他返回的是array
     */
    var gettype = Object.prototype.toString;//获取更精确的区分数据类型

    if (gettype.call($this.points) == '[object Undefined]') {//9大区域
        return;
    } else {
        if ($this.points[0]) {
            if ($this.points[0].point.open == undefined) {
                return;
            }
            open = $this.points[0].point.open.toFixed(2);
            close = $this.points[0].point.close.toFixed(2);
        }
        var zdf = 0;//涨跌幅=（今收-昨收）/昨收
        var date = new Date(parseInt($this.x, 10));
        var year = date.getFullYear();
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        var d = $this.x;
        //console.log(ohlc);
        for (var i = 0; i < ohlc.length; i++) {
            if (Highcharts.dateFormat('%Y-%m-%d', $this.x) == Highcharts.dateFormat('%Y-%m-%d', ohlc[i][0])) {
                zdf = parseFloat((parseFloat(ohlc[i][4]) - parseFloat(ohlc[i][5])) / parseFloat(ohlc[i][5]) * 100).toFixed(2);
            }
        }
        var col = '#dd113c';
        if (zdf > 9.9) {
            close = parseFloat(parseFloat(close) - 0.01).toFixed(2);
        }
        if (zdf > 0) {
            zdf = '+' + zdf + '%';
            col = '#dd113c';
            $("#report" + kline.sn).removeClass("t_red").removeClass("t_green").addClass("t_red");
        } else if (zdf < 0) {
            zdf = zdf + '%';
            col = '#319c11';
            $("#report" + kline.sn).removeClass("t_red").removeClass("t_green").addClass("t_green");
        } else {
            zdf = 0.00;
            col = '#333';
            $("#report" + kline.sn).removeClass("t_red").removeClass("t_green");
        }
        if (kline.param.title == "小时K") {//现在接口中小时K，返回的昨收为0，暂时不计算涨幅
            $reporting.html('<span>' + year + '-' + month + '-' + currentDate + ' ' + hours + ':' + minutes + ':' + seconds + '</span><span>开<em>' + open + '</em></span><span>收<em>' + close + '</em></span><span>幅<em>' + zdf + '</em></span>');
        } else {
            $reporting.html('<span>' + year + '-' + month + '-' + currentDate + '</span><span>开<em>' + open + '</em></span><span>收<em>' + close + '</em></span><span>幅<em>' + zdf + '</em></span>');
        }

        var dif = 0;
        var dea = 0;

        if ($this.points) {
            var len = $this.points.length;
            if ($this.points.length < 2) {
                return;
            }
            if ($this.points[len - 2].y == undefined) {
                return;
            }
            if ($this.points[len - 1].y == undefined) {
                return;
            }

            dif = $this.points[len - 1].y.toFixed(2);
            dea = $this.points[len - 2].y.toFixed(2);
        }

        //console.log(dif+"----------"+dea);
        $macd.html('<span style="font-family: 微软雅黑;font-size: 0.825em;font-weight: normal;color: #000">MACD&nbsp;</span>'
            + '<span style="font-family: 微软雅黑;font-size: 0.825em;font-weight: normal;color: #d75d04">DIF:' + dif + '&nbsp;</span>'
            + '<span style="font-family: 微软雅黑;font-size: 0.825em;font-weight: normal;color: #056ceb">DEA:' + dea + '</span>'
        );
    }
}

//更改MACD的文字
var changeTitlt = function (difData, deaData) {
    var subtitle = {
        text: 'MACD DIF DEA',
        align: 'left',
        y: 170,
        useHTML: true,
        text: "<span style='font-family: 微软雅黑;font-size: 0.825em;font-weight: normal;color: #000'>MACD&nbsp;</span>" + "<span style='font-family: 微软雅黑;font-size: 0.825em;font-weight: normal;color: #d75d04'>DIF:" + difData + "&nbsp;</span>" + "<span style='font-family: 微软雅黑;font-size: 0.825em;font-weight: normal;color: #056ceb'>DEA:" + deaData + "</span>",
        floating: true
    };
    chart.setTitle(null, subtitle);
};

function add9Area() {
    var chart = $('#container' + kline.sn).highcharts();
    var moduleDataList = kline.param.moduleData;
    var buyData = [], sellData = [];//区块颜色说明
    var moduleUpData = [], moduleDownData = [];//向上区域,向下区域

    /**
     * 9大区域
     * 由于9大区域的数据条数不确定所以现加载
     * 3、区域和箭头优化，区域
     * （1）上涨，红色向上箭头，开始k最低价、结束k最高价、区域最高价
     * （2）下跌，绿色向下箭头，开始k最高价、结束k最低价、区域最低价     *
     * kline.param.max Y轴最大值
     *  kline.param.min Y轴最小值
     * */
    if (moduleDataList.length > 0) {
        for (var i = 0; i < moduleDataList.length; i++) {
            var direction = moduleDataList[i].direction;
            if (direction == "UP") {
                var temp0 = [];
                temp0.push(moduleDataList[i].startAt + 10000);
                temp0.push(moduleDataList[i].startLow - 0.2);
                buyData.push(temp0);

                moduleUpData = [];
                var temp = [];
                temp.push([moduleDataList[i].startAt, kline.param.min, kline.param.max]);
                temp.push([moduleDataList[i].endAt, kline.param.min, kline.param.max]);
                moduleUpData.push(temp);

                var zf = 0;
                if (moduleDataList[i].low != 0) {
                    zf = Number((moduleDataList[i].high - moduleDataList[i].low) / moduleDataList[i].low * 100).toFixed(1) + '%';
                } else {
                    zf = '0.00';
                }

                chart.addSeries({
                    showInLegend: false,
                    dataGrouping: {enabled: false},
                    type: 'arearange',
                    color: '#f3bab9',
                    fillOpacity: 0.5,
                    data: moduleUpData[0],
                    lineWidth: 0.1,
                    lineColor: '#f3bab9',
                    name: '多头',
                    enableMouseTracking: false,
                    marker: {enabled: false}
                });
            }
            else if (direction == "DOWN") {
                var temp0 = [];
                temp0.push(moduleDataList[i].startAt + 1000);
                temp0.push(moduleDataList[i].startHigh + 0.2);
                sellData.push(temp0);


                moduleDownData = [];
                var temp = [];
                temp.push([moduleDataList[i].startAt, kline.param.min, kline.param.max]);
                temp.push([moduleDataList[i].endAt, kline.param.min, kline.param.max]);
                moduleDownData.push(temp);

                var zf = 0;
                if (moduleDataList[i].low != 0) {
                    zf = Number((moduleDataList[i].high - moduleDataList[i].low) / moduleDataList[i].low * 100).toFixed(1) + '%';
                } else {
                    zf = '0.00';
                }

                chart.addSeries({
                    showInLegend: false,
                    dataGrouping: {enabled: false},
                    type: 'arearange',
                    color: '#99acf9',
                    fillOpacity: 0.5,
                    data: moduleDownData[0],
                    lineWidth: 0.1,
                    lineColor: '#99acf9',
                    enableMouseTracking: false,
                    name: '空头',
                    marker: {enabled: false}
                });
            }
        }

        //在图例中显示
        var buyLegend = (buyData.length > 0 ? true : false);
        var sellLegend = (sellData.length > 0 ? true : false);

        chart.addSeries({
            showInLegend: buyLegend,
            dataGrouping: {enabled: false},
            type: 'scatter',
            name: '多头',
            data: buyData,
            marker: {symbol: 'url(images/duo.png)', width: 0.1, height: 10}
        });
        chart.addSeries({
            showInLegend: sellLegend,
            dataGrouping: {enabled: false},
            type: 'scatter',
            name: '空头',
            data: sellData,
            marker: {symbol: 'url(images/kong.png)', width: 0.1, height: 10}
        });
    } else {
        moduleUpData = [];
        moduleDownData = [];
        buyData = [];
        sellData = [];
    }
}


/**
 * 历史建议展开
 */
function openList(sn) {
    var a = document.getElementsByClassName("openList_xdy" + sn);
    if ($(a).find("i").hasClass("icon-arrow_shape_down")) {
        $(a).find("i").removeClass("icon-arrow_shape_down").addClass("icon-arrow_shape_up");
        $(a).next(".timeLine").slideDown();
    } else if ($(a).find("i").hasClass("icon-arrow_shape_up")) {
        $(a).find("i").removeClass("icon-arrow_shape_up").addClass("icon-arrow_shape_down");
        $(a).next(".timeLine").slideUp();
    }
    baiduTrackEvent('li','click','历史建议');//百度统计
}

//排序
function compare(propertyName) {
    return function (object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value2 < value1) {
            return -1;
        } else if (value2 > value1) {
            return 1;
        } else {
            return 0;
        }
    }
}

/**
 * 文字格式化
 */
var getTXT = function (val) {
    if (val == 1) {
        return '买入';
    } else if (val == 2) {
        return '卖出';
    } else if (val == 0) {
        return '观望';
    } else {
        return '';
    }

};

