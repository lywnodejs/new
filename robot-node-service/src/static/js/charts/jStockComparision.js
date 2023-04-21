/**
 * Created by 1 on 2018/7/25.
 * 股票对比
 * url 来源小e H5页面  node服务端无该字段
 */
var stockComparision={
    HttpUrl: '',
    sourceUrl:'',
    getTarget: function (sn,url) {
        if(url){
            stockComparision.HttpUrl = '/robot/semantic/riskNotices';
            stockComparision.sourceUrl = '/static/';
        }
        var temp =
            '<nav>'+
                '<a id="chart0_a' + sn + '" class="on" onclick="stockComparision.chartShow(0,'+sn+')">净利润增长率</a>'+
                '<a id="chart1_a' + sn + '" onclick="stockComparision.chartShow(1,'+sn+')">总市值</a>'+
                '<a id="chart2_a' + sn + '" onclick="stockComparision.chartShow(2,'+sn+')">市盈率</a>'+
                '<a id="chart3_a' + sn + '" onclick="stockComparision.chartShow(3,'+sn+')">市净率</a>'+
            '</nav>'+
            '<div class="nav_con show" id="chart0_nav_con' + sn + '">'+
                '<div class="box_chart" id="box_chart0' + sn + '">'+
                    '<span style="color: #a1a2a8;font-size: 10px" >单位:%</span>'+
                    '<div id="chart0' + sn + '"></div>'+
                    /*'<span class="chart_pop" style="right:0; bottom:0;"><span class="t_orange">万科A：</span>10.24%<br><span class="t_blue">保利地产：</span>10.24%</span>'+*/
                '</div>'+
                '<div class="nodata" style="display: none" id="box_chart0_nodata' + sn + '"><img src="'+stockComparision.sourceUrl+'/images/nodata-min.png"></div>'+<!-- 无数据 -->
            '</div>'+
            '<div class="nav_con" id="chart1_nav_con' + sn + '">'+
                '<div class="box_chart" id="box_chart1' + sn + '">'+
                    '<span style="color: #a1a2a8;font-size: 10px" >单位:亿元</span>'+
                    '<div id="chart1' + sn + '"></div>'+
                    /*'<span class="chart_pop" style="right:0; bottom:0;">总市值</span>'+*/
                '</div>'+
                '<div class="nodata" style="display: none" id="box_chart1_nodata' + sn + '"><img src="'+stockComparision.sourceUrl+'/images/nodata-min.png"></div>'+<!-- 无数据 -->
            '</div>'+
            '<div class="nav_con" id="chart2_nav_con' + sn + '">'+
                '<div class="box_chart" id="box_chart2' + sn + '">'+
                    '<span style="color: #a1a2a8;font-size: 10px" >单位:倍</span>'+
                    '<div id="chart2' + sn + '"></div>'+
                    /*'<span class="chart_pop" style="right:0; bottom:0;">市盈率</span>'+*/
                '</div>'+
                '<div class="nodata" style="display: none" id="box_chart2_nodata' + sn + '"><img src="'+stockComparision.sourceUrl+'/images/nodata-min.png"></div>'+<!-- 无数据 -->
            '</div>'+
            '<div class="nav_con" id="chart3_nav_con' + sn + '">'+
                '<div class="box_chart" id="box_chart3' + sn + '">'+
                    '<span style="color: #a1a2a8;font-size: 10px" >单位:倍</span>'+
                    '<div id="chart3' + sn + '"></div>'+
                    /*'<span class="chart_pop" style="right:0; bottom:0;">市净率</span>'+*/
                '</div>'+
                '<div class="nodata" style="display: none" id="box_chart3_nodata' + sn + '"><img src="'+stockComparision.sourceUrl+'/images/nodata-min.png"></div>'+<!-- 无数据 -->
            '</div>';
        return temp;
    },

    init:function (market1,code1,market2,code2,sn) {
        stockComparision.emptyData();
        var chartW = $('.mb_tab tab_contrast').width();
        stockComparision.param.chartW = chartW;

        //净利润增长率
        stockComparision.getFinaceIndicator(market1,code1,market2,code2,sn);

        setTimeout(function () {
            //总市值
            stockComparision.getDailyFinaceIndicator('marValue',market1,code1,market2,code2,sn);
            //市盈率
            stockComparision.getDailyFinaceIndicator('peTtm',market1,code1,market2,code2,sn);
            //市净率
            stockComparision.getDailyFinaceIndicator('pb',market1,code1,market2,code2,sn);
        }, 500);
    },
    emptyData:function () {
        stockComparision.param.chartW = 0;
    },
    param:{
        chartW:0
    },

    chartShow:function (index,sn) {
        for(var i = 0;i<4;i++){
            if(i == index){
                $('#chart'+i+'_a'+sn).removeClass("on").addClass("on");
                $('#chart'+i+'_nav_con'+sn).removeClass("show").addClass("show");
            }else{
                $('#chart'+i+'_a'+sn).removeClass("on");
                $('#chart'+i+'_nav_con'+sn).removeClass("show");
            }
        }
    },

    //取两个数组的最大值.最小值
    formatterArr:function (arr1,arr2) {
        var arr = arr1.concat(arr2);
        var min=arr[0][0],max=arr[0][0];
        for(var i = 0;i<arr.length;i++){
            if(arr[i][0]<min){
                min = arr[i][0];
            }
            if(arr[i][0]>max){
                max = arr[i][0];
            }
        }
        var temp = [];
        temp.push(min);
        temp.push(max);
        return temp;
    },

    //净利润增长率 折线图
    getFinaceIndicator: function (market1,code1,market2,code2,sn) {
        var stockName1 = '';
        var data1 = [];//数据源
        var stockName2 = '';
        var data2 = [];//数据源
        jQuery.ajax(
            {
                url: stockComparision.HttpUrl + '/stock/compare/finace/indicator/history?market='+market1+'&code='+code1,
                type: 'get',
                async: null,
                data: null,
                dataType: 'jsonp',
                success: function (rs) {
                    if (rs) {

                        if(rs.message.code != 0) return;
                        var list = rs.data;

                        if(list.length>0){
                            stockName1 = rs.data[0].secName;
                            for(var j = 0;j<list.length;j++){
                                var _y = Number(list[j].endDate.toString().substr(0,4));
                                var _m = Number(list[j].endDate.toString().substr(4,2))-1;
                                var _d = Number(list[j].endDate.toString().substr(6,2));

                                var _date = Date.UTC(_y,  _m, _d);//转换成Date.UTC(1970,  5, 20)格式

                                if(list[j].sFaYoynetprofit){
                                    var temp = [];
                                    temp.push(_date);
                                    //temp.push(list[j].endDate.toString());
                                    temp.push(list[j].sFaYoynetprofit);
                                    data1.push(temp);
                                }
                            }
                        }

                        jQuery.ajax(
                            {
                                url: stockComparision.HttpUrl + '/stock/compare/finace/indicator/history?market='+market2+'&code='+code2,
                                type: 'get',
                                async: null,
                                data: null,
                                dataType: 'jsonp',
                                success: function (rs) {
                                    if (rs) {
                                        if(rs.message.code != 0) return;
                                        var list = rs.data;
                                        if(list.length>0){
                                            stockName2 = rs.data[0].secName;
                                            for(var j = 0;j<list.length;j++){
                                                var _y = Number(list[j].endDate.toString().substr(0,4));
                                                var _m = Number(list[j].endDate.toString().substr(4,2))-1;
                                                var _d = Number(list[j].endDate.toString().substr(6,2));

                                                var _date = Date.UTC(_y,  _m, _d);//转换成Date.UTC(1970,  5, 20)格式

                                                if(list[j].sFaYoynetprofit){
                                                    var temp = [];
                                                    temp.push(_date);
                                                    //temp.push(list[j].endDate.toString());
                                                    temp.push(list[j].sFaYoynetprofit);
                                                    data2.push(temp);
                                                }


                                            }
                                            stockComparision.createLineChart('chart0',stockName1,data1,stockName2,data2,sn,'line');
                                        }
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    handleException(XMLHttpRequest);
                                    ajaxErrorHandler(XMLHttpRequest, textStatus, errorThrown);
                                }
                            });
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    handleException(XMLHttpRequest);
                    ajaxErrorHandler(XMLHttpRequest, textStatus, errorThrown);
                }
            });
    },


    /**
     * 总市值 市盈率 市净率  展示近半年的数据  曲线图
     * @param type  总市值字段：marValue，单位：万元;市盈率字段：peTtm;市净率字段：pb;日期字段：tradeDate
     * @param market1
     * @param code1
     * @param market2
     * @param code2
     * @param sn
     */
    getDailyFinaceIndicator: function (type,market1,code1,market2,code2,sn) {
        //开始时间
        var dt = new Date();
        dt.setMonth( dt.getMonth()-6 );
        var month0 = dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
        var currentDate0 = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
        var d_start  = dt.getFullYear()+month0+currentDate0;
        //结束时间
        var date = new Date();
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var d_end  = ''+date.getFullYear()+month+currentDate;

        var stockName1 = '';
        var data1 = [];//数据源
        var stockName2 = '';
        var data2 = [];//数据源
        var divID = '';
        if(type == 'marValue'){
            divID = 'chart1';
        }
        if(type == 'peTtm'){
            divID = 'chart2';
        }
        if(type == 'pb'){
            divID = 'chart3';
        }
        jQuery.ajax(
            {
                url: stockComparision.HttpUrl + '/stock/compare/daily/fin/indicator?market='+market1+'&code='+code1+'&startDate='+d_start+'&endDate='+d_end+'&cp=1&ps=220',
                type: 'get',
                async: null,
                data: null,
                dataType: 'jsonp',
                success: function (rs) {
                    if (rs) {
                        var list = rs.data.list;
                        if (list.length > 0) {
                            stockName1 = list[0].secName;
                            for(var j = 0;j<list.length;j++){
                                var _y = Number(list[j].tradeDate.toString().substr(0,4));
                                var _m = Number(list[j].tradeDate.toString().substr(4,2))-1;
                                var _d = Number(list[j].tradeDate.toString().substr(6,2));

                                var _date = Date.UTC(_y,  _m, _d);//转换成Date.UTC(1970,  5, 20)格式


                                if(type == 'marValue'){
                                    if(list[j].marValue){
                                        var temp = [];
                                        temp.push(_date);
                                        temp.push(list[j].marValue);//总市值
                                        data1.push(temp);
                                    }
                                }
                                if(type == 'peTtm'){
                                    if(list[j].peTtm){
                                        var temp = [];
                                        temp.push(_date);
                                        temp.push(list[j].peTtm);//市盈率
                                        data1.push(temp);
                                    }
                                }
                                if(type == 'pb'){
                                    if(list[j].pb){
                                        var temp = [];
                                        temp.push(_date);
                                        temp.push(list[j].pb);//市净率
                                        data1.push(temp);
                                    }
                                }
                            }

                        }
                        jQuery.ajax(
                            {
                                url: stockComparision.HttpUrl + '/stock/compare/daily/fin/indicator?market='+market2+'&code='+code2+'&startDate='+d_start+'&endDate='+d_end+'&cp=1&ps=220',
                                type: 'get',
                                async: null,
                                data: null,
                                dataType: 'jsonp',
                                success: function (rs) {
                                    if (rs) {
                                        var list = rs.data.list;
                                        if (list.length > 0) {
                                            stockName2 = list[0].secName;
                                            for(var j = 0;j<list.length;j++){
                                                var _y = Number(list[j].tradeDate.toString().substr(0,4));
                                                var _m = Number(list[j].tradeDate.toString().substr(4,2))-1;
                                                var _d = Number(list[j].tradeDate.toString().substr(6,2));

                                                var _date = Date.UTC(_y,  _m, _d);//转换成Date.UTC(1970,  5, 20)格式

                                                if(type == 'marValue'){
                                                    if(list[j].marValue){
                                                        var temp = [];
                                                        temp.push(_date);
                                                        temp.push(list[j].marValue);//总市值
                                                        data2.push(temp);
                                                    }
                                                }
                                                if(type == 'peTtm'){
                                                    if(list[j].peTtm){
                                                        var temp = [];
                                                        temp.push(_date);
                                                        temp.push(list[j].peTtm);//市盈率
                                                        data2.push(temp);
                                                    }
                                                }
                                                if(type == 'pb'){
                                                    if(list[j].pb){
                                                        var temp = [];
                                                        temp.push(_date);
                                                        temp.push(list[j].pb);//市净率
                                                        data2.push(temp);
                                                    }
                                                }
                                            }
                                        }
                                        stockComparision.createSplineChart(divID,stockName1,data1,stockName2,data2,sn,type);
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    handleException(XMLHttpRequest);
                                    ajaxErrorHandler(XMLHttpRequest, textStatus, errorThrown);
                                }
                            });
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    handleException(XMLHttpRequest);
                    ajaxErrorHandler(XMLHttpRequest, textStatus, errorThrown);
                }
            });
    },


    /**
     * 创建图表 曲线图
     * @param id      图表ID
     * @param type    总市值字段：marValue，单位：万元;市盈率字段：peTtm;市净率字段：pb;日期字段：tradeDate
     * @param stockName1 第一支股票名称
     * @param data1  净利润增长率 折线图 第一支股票数据源
     * @param stockName2 第二支股票名称
     * @param data2  净利润增长率 折线图 第二支股票数据源
     * @param sn
     */
    createSplineChart:function (id,stockName1,data1,stockName2,data2,sn,type) {
        //X轴显示的起始日期
        var startDate = 0;
        var lastDate = 0;
        var dateArr = [];
        if(data1.length>0 || data2.length>0){
            dateArr = stockComparision.formatterArr(data1,data2);
            startDate = dateArr[0];
            lastDate = dateArr[dateArr.length - 1];
        }

        if(data1.length>0 || data2.length>0){
            if(type == 'marValue'){
                $('#box_chart1'+sn).show();
                $('#box_chart1_nodata'+sn).hide();
            }
            if(type == 'peTtm'){
                $('#box_chart2'+sn).show();
                $('#box_chart2_nodata'+sn).hide();
            }
            if(type == 'pb'){
                $('#box_chart3'+sn).show();
                $('#box_chart3_nodata'+sn).hide();
            }
            new Highcharts.StockChart({
                chart: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    type: 'spline',
                    width:stockComparision.param.chartW,
                    height:132,
                    spacingTop: 10,
                    spacingRight: 0,
                    spacingBottom: 0,
                    spacingLeft: 0,
                    //关闭平移  ok
                    panning: false,
                    pinchType: 'none',
                    zoomType: 'none',
                    renderTo: id+sn,
                    events: {
                        load: function () {
                            stockComparision.showTips(data1, startDate, lastDate, this, data2);
                        }
                    }
                },
                credits: {enabled:false},
                rangeSelector: {enabled:false},
                subtitle: {enabled:false},
                exporting: {enabled:false},
                scrollbar: {enabled:false},
                navigator: {enabled:false},
                title: {text: ''},
                xAxis: {
                    lineColor:'#ededed',//基线颜色
                    gridLineColor:'#ededed',//网格线颜色
                    title: {text: ''},
                    lineWidth:0.5,
                    tickLength:0,
                    labels: {
                        style: {
                            fontSize: '10px',
                            color:'#636a87'
                        },
                        formatter: function () {
                            var temptime = this.value;
                            var date = new Date(parseInt(temptime, 10));
                            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                            var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                            return  date.getFullYear()+'.'+month + "." + currentDate;
                        }
                    },
                    tickPositioner: function () {
                        var positions = [startDate, lastDate];
                        return positions;
                    }
                },
                yAxis: {
                    title: {text: ''},
                    lineColor:'#ededed',//基线颜色
                    gridLineColor:'#ededed',//网格线颜色
                    lineWidth:1,
                    opposite: false,
                    labels: { //x轴上对应刻度值或刻度类别的label标签属性设置
                        x:-5,
                        style: {
                            fontSize: '10px',
                            color:'#636a87'
                        },
                        formatter: function () {
                            if(type == 'pb'){
                                return  stockComparision.formatMoney(this.value,2);
                            }else if(type == 'marValue'){
                                return  Number(this.value*10000/100000000).toFixed(0);
                            }else{
                                return  stockComparision.formatMoney(this.value,0);
                            }
                        }
                    }
                },
                tooltip: {
                    headerFormat: '',
                    borderColor: '#e6e6ec',         // 边框颜色
                    borderRadius: 4,             // 边框圆角
                    borderWidth: 1,               // 边框宽度
                    shadow: true,
                    shared: true,
                    animation: false,
                    useHTML: true,
                    padding: 6,
                    crosshairs: true,
                    backgroundColor: '#fff',
                    formatter: function() {
                        var txt = '',txtClass = '',t = 0,val = 0;
                        for(var i = 0;i<this.points.length;i++){
                            txt += '<span style="color: '+this.points[i].color+';font-size:0.75rem;line-height:1rem;">';
                            txt += this.points[i].point.series.name;//'总市值字段';
                            if(type == 'marValue'){
                                val = (this.points[i].y)*10000;
                                val = Number(val/100000000).toFixed(2)+'亿元';
                            }else{
                                val = this.points[i].y;
                                val = Number(val).toFixed(2);
                            }
                            t = Highcharts.dateFormat('%Y-%m-%d',this.points[i].x);
                            txt += '</span>';
                            //txt += ' : '+ stockComparision.formatMoney(val,2) +'<br/>';
                            txt += ' : '+ val +'<br/>';
                        }
                        txt += '<span style="color: #333;font-size:0.75rem;line-height:1rem;">'+t+'</span>';
                        return txt;
                    }
                },
                credits:{enabled:false},
                legend: {enabled: false},
                plotOptions: {
                    spline: {
                        fillOpacity: 0.1,
                        lineWidth: 0.5,//曲线粗细
                        states: {
                            hover: {
                                lineWidth: 0.5
                            }
                        },
                        marker: {
                            enabled: false
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
                        }
                    }
                },

                series: [{name: stockName1,
                    data: data1,
                    dataGrouping: {enabled: false},
                    color:'#ec6b4d'//橙
                },{
                    name: stockName2,
                    data: data2,
                    dataGrouping: {enabled: false},
                    color:'#5d93f3'//蓝
                }]
            });

            //Y轴的坐标显示齐全
            var dataLabelNode;
            if(id == 'chart0'){
                dataLabelNode = $('#chart0'+sn+' .highcharts-yaxis-labels').find("text");//获取数据节点
            }
            if(id == 'chart1'){
                dataLabelNode = $('#chart1'+sn+' .highcharts-yaxis-labels').find("text");//获取数据节点
            }
            if(id == 'chart2'){
                dataLabelNode = $('#chart2'+sn+' .highcharts-yaxis-labels').find("text");//获取数据节点
            }
            if(id == 'chart3'){
                dataLabelNode = $('#chart3'+sn+' .highcharts-yaxis-labels').find("text");//获取数据节点
            }
            for(var i = 0; i<dataLabelNode.length; i++){
                var x = dataLabelNode[0].getAttribute("x");
                if(i == dataLabelNode.length-1){
                    var item = dataLabelNode[i];
                    item.setAttribute("x",x);
                    item.setAttribute("y","10");
                }
            }
        }
        else{
            if(type == 'marValue'){
                $('#box_chart1'+sn).hide();
                $('#box_chart1_nodata'+sn).show();
            }
            if(type == 'peTtm'){
                $('#box_chart2'+sn).hide();
                $('#box_chart2_nodata'+sn).show();
            }
            if(type == 'pb'){
                $('#box_chart3'+sn).hide();
                $('#box_chart3_nodata'+sn).show();
            }
        }
    },

    /**
     * 创建图表 折现图
     * @param id      图表ID
     * @param type    图表类型
     * @param stockName1 第一支股票名称
     * @param data1  净利润增长率 折线图 第一支股票数据源
     * @param stockName2 第二支股票名称
     * @param data2  净利润增长率 折线图 第二支股票数据源
     * @param sn
     */
    createLineChart:function (id,stockName1,data1,stockName2,data2,sn,type) {
        //X轴显示的起始日期
        var startDate = 0;
        var lastDate = 0;
        var dateArr = [];
        if(data1.length>0 || data2.length>0){
            dateArr = stockComparision.formatterArr(data1,data2);
            startDate = dateArr[0];
            lastDate = dateArr[dateArr.length - 1];
        }
        if(data1.length>0 || data2.length>0){
            $('#box_chart0'+sn).show();
            $('#box_chart0_nodata'+sn).hide();
            new Highcharts.StockChart({
                chart: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    type: 'line',
                    width:stockComparision.param.chartW,
                    height:132,
                    spacingTop: 5,
                    spacingRight: 0,
                    spacingBottom: 0,
                    spacingLeft: 0,
                    //关闭平移  ok
                    panning: false,
                    pinchType: 'none',
                    zoomType: 'none',
                    renderTo: id+sn
                },
                credits: {enabled:false},
                rangeSelector: {enabled:false},
                subtitle: {enabled:false},
                exporting: {enabled:false},
                scrollbar: {enabled:false},
                navigator: {enabled:false},
                title: {text: ''},
                xAxis: {
                    lineColor:'#ededed',//基线颜色
                    gridLineColor:'#ededed',//网格线颜色
                    title: {text: ''},
                    lineWidth:0.5,
                    tickLength:0,
                    labels: {
                        style: {
                            fontSize: '10px',
                            color:'#636a87'
                        },
                        formatter: function () {
                            var temptime = this.value;
                            var date = new Date(parseInt(temptime, 10));
                            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                            var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                            return  date.getFullYear()+'.'+month + "." + currentDate;
                        }
                    },
                    tickPositioner: function () {
                        var positions = [startDate, lastDate];
                        return positions;
                    }
                },
                yAxis: {
                    title: {text: ''},
                    lineColor:'#ededed',//基线颜色
                    gridLineColor:'#ededed',//网格线颜色
                    lineWidth:1,
                    opposite: false,
                    labels: { //x轴上对应刻度值或刻度类别的label标签属性设置
                        x:-5,
                        style: {
                            fontSize: '10px',
                            color:'#636a87'
                        },
                        formatter: function () {
                            return  stockComparision.formatMoney(this.value,0);
                        }
                    }
                },
                tooltip: {
                    headerFormat: '',
                    borderColor: '#e6e6ec',         // 边框颜色
                    borderRadius: 4,             // 边框圆角
                    borderWidth: 1,               // 边框宽度
                    shadow: true,
                    shared: true,
                    animation: false,
                    useHTML: true,
                    padding: 6,
                    crosshairs: true,
                    backgroundColor: '#fff',
                    formatter: function() {
                        var txt = '',txtClass = '',t = 0,val = 0;
                        for(var i = 0;i<this.points.length;i++){
                            txt += '<span style="color: '+this.points[i].color+';font-size:0.75rem;line-height:1rem;">';
                            txt += this.points[i].point.series.name;//'总市值字段';
                            val = this.points[i].y;
                            t = Highcharts.dateFormat('%Y-%m-%d',this.points[i].x);
                            txt += '</span>';
                            txt += ' : '+ stockComparision.formatMoney(val,2) +'<br/>';
                        }
                        txt += '<span style="color: #333;font-size:0.75rem;line-height:1rem;">'+t+'</span>';
                        return txt;
                    }
                },
                credits:{enabled:false},
                legend: {enabled: false},
                plotOptions: {
                    line: {
                        fillOpacity: 0.1,
                        lineWidth: 0.5,//曲线粗细
                        states: {
                            hover: {
                                lineWidth: 0.5
                            }
                        },
                        marker: {
                            enabled: false
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
                        }
                    }
                },
                series: [{name: stockName1,
                    data: data1,
                    dataGrouping: {enabled: false},
                    color:'#ec6b4d'//橙
                },{
                    name: stockName2,
                    data: data2,
                    dataGrouping: {enabled: false},
                    color:'#5d93f3'//蓝
                }]
            });
            /*chart = Highcharts.chart(id+sn, {
                chart: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    type: type,
                    width:stockComparision.param.chartW,
                    height:132,
                    spacingTop: 10,
                    spacingRight: 0,
                    spacingBottom: 0,
                    spacingLeft: 0
                },
                title: {text:''},
                xAxis: {
                    categories: [data1[0][0],data1[1][0],data1[2][0],data1[3][0]],
                    lineColor:'#ededed',//基线颜色
                    gridLineColor:'#ededed',//网格线颜色
                    title: {text: ''},
                    lineWidth:0.5,
                    tickLength:0,
                    labels: {
                        style: {
                            fontSize: '10px',
                            color:'#636a87'
                        },
                        formatter: function () {
                            var _y = this.value.substr(0,4);
                            var _m = this.value.substr(4,2);
                            var _d = this.value.substr(6,2);
                            return  _y+'.'+_m+'.'+_d;
                        }
                    }
                },
                yAxis: {
                    title: {text: ''},
                    lineColor:'#ededed',//基线颜色
                    gridLineColor:'#ededed',//网格线颜色
                    lineWidth:1,
                    labels: { //x轴上对应刻度值或刻度类别的label标签属性设置
                        style: {
                            fontSize: '10px',
                            color:'#636a87'
                        },
                        format: '{value}%'
                    }
                },
                tooltip: {
                    headerFormat: '',
                    borderColor: '#e6e6ec',         // 边框颜色
                    borderRadius: 4,             // 边框圆角
                    borderWidth: 1,               // 边框宽度
                    shadow: true,
                    shared: true,
                    animation: false,
                    useHTML: true,
                    padding: 6,
                    crosshairs: true,
                    backgroundColor: '#fff',
                    // headerFormat 和  footerFormat 是为了在外层加上  <div class="tooltip">， 方便添加样式
                    //headerFormat: '<div class="tooltip"><br/>',
                    //footerFormat: '</div>',
                    formatter: function() {
                        var txt = '',txtClass = '',t = 0,val = 0;
                        //txt = '<span class="chart_pop" style="right:0; bottom:0;position:absolute;z-index:10">';
                        for(var i = 0;i<this.points.length;i++){
                             txt += '<span style="color: '+this.points[i].color+';display: inline-block;width:60px;font-size:0.75rem;line-height:1rem;text-align:right">';
                             txt += this.points[i].point.series.name;//'我的收益';
                             val = this.points[i].y.toFixed(2);
                             txt += '</span>';
                             txt += ' : '+ val +'%<br/>';
                             /!*if(this.points[i].color == '#ec6b4d'){
                                 txtClass = 't_orange';
                             }
                            if(this.points[i].color == '#5d93f3'){
                                txtClass = 't_blue';
                            }

                            txt +='<span class="'+txtClass+'">'+this.points[i].point.series.name+'：</span>'+this.points[i].y.toFixed(2)+'%<br>';
*!/
                        }

                        //txt += '</span>';
                        return txt;
                    }
                },
                credits:{enabled:false},
                legend: {enabled: false},
                plotOptions: {
                    line: {
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        marker: {
                            enabled: false
                        }
                    },
                    series: {
                        events: {
                            legendItemClick: function(e) {
                                return false;
                            }
                        }
                    }
                },
                series: [{
                    name: stockName1,
                    data: data1,
                    color:'#ec6b4d'//橙
                },{
                    name: stockName2,
                    data: data2,
                    color:'#5d93f3'//蓝
                }]
            });*/

            //Y轴的坐标显示齐全
            var dataLabelNode = $(".highcharts-yaxis-labels").find("text");//获取数据节点
            for(var i = 0; i<dataLabelNode.length; i++){
                var x = dataLabelNode[0].getAttribute("x");//取X的坐标位置
                if(i == dataLabelNode.length-1){
                    var item = dataLabelNode[i];
                    item.setAttribute("x",x);
                    item.setAttribute("y","10");//设置Y的坐标位置
                }
            }
        }
        else{
            $('#box_chart0'+sn).hide();
            $('#box_chart0_nodata'+sn).show();
        }

    },

    //数字金额格式化
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

    /*
     * 这个方法用来控制K线上的flags的显示情况，当afterSetExtremes时触发该方法,通过flags显示当前时间区间最高价和最低价
     * minTime  当前k线图上最小的时间点
     * maxTime  当前k线图上最大的时间点
     * chart  当前的highstock对象
     */
    showTips:function (data1, minTime, maxTime, chart, data2) {
        //macd y坐标的最大值与最小值
        var max = 0,min = 0;
        if(data1.length>0){
            max = data1[0][1];
            min = data1[0][1];
        }else{
            max = data2[0][1];
            min = data2[0][1];
        }
        if(data1.length>0){
            for(var i =0;i<data1.length;i++){
                if(max < data1[i][1]){
                    max = data1[i][1];
                }
                if(min > data1[i][1]){
                    min = data1[i][1];
                }
            }
        }
        if(data2.length>0){
            for(var i =0;i<data2.length;i++){
                if(max < data2[i][1]){
                    max = data2[i][1];
                }
                if(min > data2[i][1]){
                    min = data2[i][1];
                }
            }
        }
        //Y轴坐标自适应
        chart.yAxis[0].update({
            min : Number(min-0.01),
            max : Number(Number(max)+Number(max/5)),
            tickPositioner:function(){
                var n0 = (min - 0.01).toFixed(2);
                var n1 = Number(Number(min) + (max - min) / 4).toFixed(2);
                var n2 = Number(Number(min) + 2 * (max - min) / 4).toFixed(2);
                var n3 = Number(Number(min) + 3 * (max - min) / 4).toFixed(2);
                var n4 = Number(max).toFixed(2);
                var positions = [Number(n0), Number(n1), Number(n2), Number(n3), Number(n4)];
                return positions;
            }
        });

    }
};
