/**
 * Created by xdy on 17-01-12.
 * K线
 * 支撑线、压力线
 */

var klineByType_1 = {
    sn:'',
    params: {

        //symbol:'',
        //market:'',
        title:'',

        pressureDay:'',
        maxDay:'',
        minDay:'',
        supportDay:'',

        l1:[],
        l2:[],

        maxData:[],
        pressureData:[],
        minData:[],
        supportData:[],
        perIsShow:false,
        supIsShow:false,

        pressurePrice:0,
        supportPrice:0,

        currKey:0,//键盘按键
        StockCodeTable:[],//股票代码表
        index:0,//当前股票索引

        type:'day',//K线图  类别
        num:52,//分析接口返回的数据条数
        lastTime:0,//K线最后一天的数据

        robotAnalysisInfo:{},//错误信息将数据返回


        pressurePriceLine: 0,//压力位
        supportPriceLine:0,//支撑位

        pressurePriceLineData: [],//压力位
        supportPriceLineData:[],//支撑位
        _pressurePriceLineData: [],//压力位
        _supportPriceLineData:[]
    },

    /**
     * 将K线数据映射成坐标系中的点
     * @param str
     * @returns {number}
     */
    mapDataNoData:function(ohlc,volume){
        var _list=[];//将数据映射成坐标系中的点
        for(var j = 0;j<ohlc.length;j++){
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
            //console.log(param.l1);
        var l1 = klineByType_1.params.l1;
        var l2 = klineByType_1.params.l2;
        var data1 = [];
        var data2 = [];

        klineByType_1.params.lastTime = ohlc[ohlc.length-1][0];

        if(klineByType_1.params.l1.length>0){
            for(var i = 0;i<l1.length;i++){
                for(var j = 0;j<_list.length;j++){
                    if(l1[i][0] == _list[j][1]){
                        var temp = [];
                        temp.push(_list[j][0],l1[i][1]);
                        data1.push(temp);
                    }
                }
            }
            //console.log(data1);
            var a_1 = Number(data1[0][0]),
                b_1 = Number(data1[0][1]),
                c_1 = Number(data1[1][0]),
                d_1 = Number(data1[1][1]),


                y1 = 0;
            /*//交点公式
             x=[(b_1*c_1-a_1*d_1)*(c_2-a_2)-(c_1-a_1)*(b_2*c_2-a_2*d_2)]/[(b_1-d_1)*(c_2-a_2)-(c_1-a_1)*(b_2-d_2)];
             y=[(b_2*c_2-a_2*d_2)*(b_1-d_1)-(b_2-d_2)*(b_1*c_1-a_1*d_1)]/[(b_1-d_1)*(c_2-a_2)-(c_1-a_1)*(b_2-d_2)];*/


            //y1 = [(b_1*c_1-a_1*d_1)-52*(b_1-d_1)]/(c_1-a_1);
            if(klineByType_1.params.type == 'min60'){
                y1 = [(b_1*c_1-a_1*d_1)-Math.ceil(parseInt(klineByType_1.params.num)/4)*(b_1-d_1)]/(c_1-a_1);
            }else{
                y1 = [(b_1*c_1-a_1*d_1)-parseInt(ohlc.length)*(b_1-d_1)]/(c_1-a_1);
            }
            klineByType_1.params.l1.push([klineByType_1.params.lastTime,Number(y1.toFixed(2))]);
        }
        //console.log(param.l2);
        if(klineByType_1.params.l2.length>0){
            for(var i = 0;i<l2.length;i++){
                for(var j = 0;j<_list.length;j++){
                    if(l2[i][0] == _list[j][1]){
                        var temp = [];
                        temp.push(_list[j][0],l2[i][1]);
                        data2.push(temp);
                    }
                }
            }
            //console.log(data2);
            var a_2 = Number(data2[0][0]),
                b_2 = Number(data2[0][1]),
                c_2 = Number(data2[1][0]),
                d_2 = Number(data2[1][1]),

                y2=0;
            //y2 = [(b_2*c_2-a_2*d_2)-52*(b_2-d_2)]/(c_2-a_2);
            if(klineByType_1.params.type == 'min60'){
                y2 = [(b_2*c_2-a_2*d_2)-Math.ceil(parseInt(klineByType_1.params.num)/4)*(b_2-d_2)]/(c_2-a_2);
            }else{
                y2 = [(b_2*c_2-a_2*d_2)-parseInt(klineByType_1.params.num)*(b_2-d_2)]/(c_2-a_2);
            }

            klineByType_1.params.l2.push([klineByType_1.params.lastTime,Number(y2.toFixed(2))]);
        }


        klineByType_1.createChartNoData (ohlc,volume,klineByType_1.params.l1,klineByType_1.params.l2);
    },



    dataFormatter:function(str){
        var d = str.toString();

        var _y = Number(d.substr(0,4));
        var _m = Number(d.substr(4,2))-1;
        var _d = Number(d.substr(6,2));

        var _date = Date.UTC(_y,  _m, _d);//转换成Date.UTC(1970,  5, 20)格式[Date.UTC(1970,  9, 27), 0   ],
        return _date;
    },
    //年月日格式+小时分钟秒
    dataFormatter2:function(str,str1){
        var d = str.toString();
        var e = str1.toString();

        var _y = Number(d.substr(0,4));
        var _m = Number(d.substr(4,2))-1;
        var _d = Number(d.substr(6,2));

        var _h = Number(e.substr(0,2));
        var _min = Number(e.substr(3,2));
        var _s = Number(e.substr(6,2));

        var _date = Date.UTC(_y,  _m, _d, _h,_min);
        return _date;
    },


    // create the chart
    createChartNoData:function(ohlc,volume,l1,l2){
        //console.log(ohlc);
        var $reporting = $("#report"+kline.sn);

        var chartW = $('.box_stoInfo').width();

        if(l1.length > 2){
            l1.splice(1,1);
        }
        if(l2.length > 2){
            l2.splice(1,1);
        }
        //X轴显示的起始日期
        var startDate = ohlc[0][0];
        var lastDate = ohlc[ohlc.length-1][0];

        //判断开盘涨停的情况，以便于控制柱形图的颜色
        for(var i =0;i<ohlc.length;i++){
            var zf = parseFloat((parseFloat(ohlc[i][4])-parseFloat(ohlc[i][5]))/parseFloat(ohlc[i][5])*100);
            if(zf.toFixed(2) > 9.9){
                ohlc[i][4] =  parseFloat(ohlc[i][4])+0.01;
            }
        }

        return new Highcharts.StockChart( {
            chart:{
                //关闭平移
                panning:false,
                zoomType: 'none',
                pinchType:'none',
                renderTo : 'container'+klineByType_1.sn,
                resetZoomButton: {
                    theme: {
                        display: 'none'
                    }
                },
                spacingTop: 10,
                spacingLeft: 0,
                spacingRight:1,
                width:chartW
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
                verticalAlign: 'bottom',
                labelFormatter: function() {
                    var str = '';
                    if(klineByType_1.params._pressurePriceLineData.length>0){
                        if(this.name == "压力位"){
                            str = "压力位("+klineByType_1.params._pressurePriceLineData[0][1]+")";
                        }
                    }
                    if(klineByType_1.params._supportPriceLineData.length>0){
                        if(this.name == "支撑位"){
                            str = "支撑位("+klineByType_1.params._supportPriceLineData[0][1]+")";
                        }
                    }
                    if(this.name == "压力线"){
                        str = "压力线";
                    }
                    if(this.name == "支撑线"){
                        str = "支撑线";
                    }
                    return  '<label style="color: #000;font-family: 微软雅黑;font-size: 0.85em;font-weight:normal; text-align:center; line-height: 1.5em; height: 1.5em;">'+str+'</>';
                }
            },
            yAxis: [{
                title: {
                    enable:false
                },
                height: '100%',
                lineWidth:1,//Y轴边缘线条粗细
                gridLineColor: '#346691',
                gridLineWidth:0.1,
                opposite:true
            }],
            xAxis: {//自定义X轴显示格式
                labels: {
                    //step:1,//可以通过设置此参数为 1 来阻止自动计算
                    formatter: function() {
                        var date = new Date(parseInt(this.value, 10));
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                        return year +'-'+month+'-'+currentDate
                    }
                },
                tickPositioner:function(){
                    var positions=[startDate,lastDate];
                    return positions;
                }
            },
            title: {
                text: klineByType_1.params.title+' 前复权',
                align:'left',
                verticalAlign:'top',
                useHTML:true,
                text:"<span style='font-family: 微软雅黑;font-size: 0.625em;font-weight: normal'>"+klineByType_1.params.title+" 前复权</span>",
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
                //去掉曲线和蜡烛上的hover事件
                series: {
                    states: {
                        hover: {
                            enabled: false
                        }
                    },
                    line: {
                        marker: {
                            enabled: false
                        },
                        connectNulls: true
                    },
                    events: {
                        legendItemClick: function(e) {
                            return false; // 直接 return false 即可禁用图例点击事件
                        }
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
                    //console.log(this.points[0].point.open);
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
                    if(zdf>=0){
                        zdf = '+'+zdf+'%';
                        col = '#dd113c';
                    }else{
                        zdf = zdf+'%';
                        col = '#319c11';
                    }

                    $reporting.html(
                        '  <span style=" display:block; width:300px; height:20px; line-height: 20px; margin: 0 auto;"><span style="font-family: 微软雅黑;font-size: 0.75em;font-weight: normal; float: left; width: 24%; ">'+Highcharts.dateFormat('%Y-%m-%d',d)+'</span>'
                        + '<span style=" float: left; width: 22%;"><span style=" float: left;font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">开:</span>'
                        + '<span style=" float: left;color:'+col+';font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">'+open+'</span></span>'
                        + '<span style=" float: left; width: 22%;"><span style=" float: left;font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">收:</span>'
                        + '<span style=" float: left;color:'+col+';font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">'+close+'</span></span>'
                        + '<span style=" float: left; width: 24%;"><span style=" float: left;font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">幅:</span>'
                        + '<span style=" float: left;color:'+col+';font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">'+zdf+'</span></span></span>'
                    );
                }
            },
            series: [{
                type: 'candlestick',
                dataGrouping: {
                    enabled: false
                },
                name: 'K',
                data: ohlc,
                showInLegend: false // 设置为 false 即为不显示在图例中
            }, {
                type: 'spline',
                dataGrouping: {
                    enabled: false
                },
                name : '压力线',
                data : l1,
                color:'green',
                lineWidth:1,
                showInLegend: false
            },{
                type: 'line',
                dataGrouping: {
                    enabled: false
                },
                name : '支撑线',
                data : l2,
                color:'red',
                lineWidth:1,
                showInLegend: false
            },{
                type: 'line',
                dataGrouping: {
                    enabled: false
                },
                name: '压力位',
                data: klineByType_1.params.pressurePriceLineData,
                showInLegend: true,
                color:'green',
                lineWidth:1
            },{
                type: 'line',
                dataGrouping: {
                    enabled: false
                },
                name: '支撑位',
                data: klineByType_1.params.supportPriceLineData,
                showInLegend: true,
                color:'red',
                lineWidth:1
            }]
        });
    },


    /**
     * 判断所选时间(或者当前时间)是否在某一时间段
     */
    time_range:function (beginTime, endTime, nowTime) {
        var strb = beginTime.split (":");
        if (strb.length != 2) {
            return false;
        }

        var stre = endTime.split (":");
        if (stre.length != 2) {
            return false;
        }

        var strn = nowTime.split (":");
        if (stre.length != 2) {
            return false;
        }
        var b = new Date ();
        var e = new Date ();
        var n = new Date ();

        b.setHours (strb[0]);
        b.setMinutes (strb[1]);
        e.setHours (stre[0]);
        e.setMinutes (stre[1]);
        n.setHours (strn[0]);
        n.setMinutes (strn[1]);

        if (n.getTime () - b.getTime () > 0 && n.getTime () - e.getTime () < 0) {
            return true;
        } else {
            //alert ("当前时间是：" + n.getHours () + ":" + n.getMinutes () + "，不在该时间范围内！");
            return false;
        }
    }
}




var KLineServiceNoData = {

    getStockName: function (val,symbol,sn){
        klineByType_1.sn = sn;
        jQuery.ajax(
            {
                url: '/hangqing-service/json/getPrice?symbol='+val+symbol,
                type: 'get',
                async: null,
                data: null,
                dataType: 'jsonp',
                success: function(rs)
                {
                    if(rs){
                        var stockName = rs.stkName;
                        var stockCode = rs.stkCode;

                        var newPrice = rs.newPrice === 0 ? rs.lastClose : rs.newPrice;
                        var change = rs.newPrice === 0 ? '' : rs.change;
                        var rise = rs.newPrice === 0 ? '' : rs.rise;
                        var clsColor = '';
                        if(rise > 0)
                            clsColor = 't_red';
                        else if(rise < 0)
                            clsColor = 't_green';

                        var txt ='<li><p>'+stockName+' ('+stockCode+') </p><h6>'+changeTimeForMin(rs.time*1000)+'</h6></li>'+
                            '<li class="'+clsColor+'"><p>'+fixed2(newPrice)+'</p><h6>'+fixed2(change)+' ('+fixed2(rise)+'%)</h6></li>';

                        $('#title'+klineByType_1.sn).html(txt);

                        jQuery.ajax(
                            {
                                url: HttpUrl + 'robot/semantic//semantic-api-service/api/qa?question='+symbol,
                                type: 'get',
                                async: null,
                                data: null,
                                dataType: 'jsonp',
                                success: function(result)
                                {
                                    if(result){

                                        var analysisText = '';

                                        if (result.data.hasOwnProperty('stockTechnicalResult')){
                                            analysisText = result.data.stockTechnicalResult
                                        }
                                        else if(result.data.hasOwnProperty('indexTechnicalResult') && result.data.indexTechnicalResult ){
                                            analysisText = result.data.indexTechnicalResult ? result.data.indexTechnicalResult.analysisText : '';
                                        }else{
                                            analysisText = result.data.analysisText;
                                        }

                                        $('#explain'+klineByType_1.sn).html('<b>技术面分析：</b>'+analysisText);
                                    }

                                },
                                error: ajaxErrorHandler
                            });
                    }

                },
                error: ajaxErrorHandler
            });
    },


    getKLine: function (val,symbol,sn){
        klineByType_1.sn = sn;
        jQuery.ajax(
            {
                url: HttpUrl + 'stock-analysis-service/' +'stock/area/priceAnalysis/'+val+'/'+symbol+'?dayNum=150&min=60',
                type: 'get',
                async: null,
                data: null,
                dataType: 'jsonp',
                success: function(rs)
                {
                    if(rs){
                        klineByType_1.params.robotAnalysisInfo = rs;
                        if(rs.message.code == 0){
                            var list = rs.data;
                            if(rs.data){

                                klineByType_1.params.type = list.dataType;
                                klineByType_1.params.num = list.num;
                                //console.log(klineByType_1.params.type);
                                var str = '';
                                if(klineByType_1.params.type =='min60'){
                                    str = '小时K';
                                }
                                if(klineByType_1.params.type =='day'){
                                    str = '日K';
                                }
                                if(klineByType_1.params.type =='week'){
                                    str = '周K';
                                }

                                klineByType_1.params.title = str;

                                if(klineByType_1.params.type == 'min60'){
                                    if(list.pressureTime){
                                        klineByType_1.params.pressureDay = klineByType_1.dataFormatter2(list.pressureDay.toString(),list.pressureTime.toString().substr(0,5));
                                    }
                                    if(list.maxTime){
                                        klineByType_1.params.maxDay = klineByType_1.dataFormatter2(list.maxDay.toString(),list.maxTime.toString().substr(0,5));
                                    }
                                    if(list.minTime){
                                        klineByType_1.params.minDay = klineByType_1.dataFormatter2(list.minDay.toString(),list.minTime.toString().substr(0,5));
                                    }
                                    if(list.supportTime){
                                        klineByType_1.params.supportDay = klineByType_1.dataFormatter2(list.supportDay.toString(),list.supportTime.toString().substr(0,5));
                                    }
                                }else{

                                    klineByType_1.params.pressureDay = klineByType_1.dataFormatter(list.pressureDay.toString());
                                    klineByType_1.params.maxDay = klineByType_1.dataFormatter(list.maxDay.toString());

                                    klineByType_1.params.minDay = klineByType_1.dataFormatter(list.minDay.toString());
                                    klineByType_1.params.supportDay = klineByType_1.dataFormatter(list.supportDay.toString());
                                }
                                klineByType_1.params.pressurePrice = list.pressureDayPrice;
                                klineByType_1.params.supportPrice = list.supportDayPrice;

                                klineByType_1.params.pressurePriceLine = list.pressurePrice;
                                klineByType_1.params.supportPriceLine = list.supportPrice;

                                //压力线
                                if(list.pressureDay !=0 && list.maxDay !=0){
                                    if(klineByType_1.params.maxDay<klineByType_1.params.pressureDay){
                                        klineByType_1.params.l1.push(
                                            [klineByType_1.params.maxDay,list.maxPrice],
                                            [klineByType_1.params.pressureDay,list.pressureDayPrice]
                                        );
                                    }else{
                                        klineByType_1.params.l1.push(
                                            [klineByType_1.params.pressureDay,list.pressureDayPrice],
                                            [klineByType_1.params.maxDay,list.maxPrice]
                                        );
                                    }
                                }


                                //支撑线
                                if(list.supportDay!=0 && list.minDay!=0){
                                    if(klineByType_1.params.minDay < klineByType_1.params.supportDay){
                                        klineByType_1.params.l2.push(
                                            [klineByType_1.params.minDay,list.minPrice],
                                            [klineByType_1.params.supportDay,list.supportDayPrice]
                                        );
                                    }else{
                                        klineByType_1.params.l2.push(
                                            [klineByType_1.params.supportDay,list.supportDayPrice],
                                            [klineByType_1.params.minDay,list.minPrice]
                                        );
                                    }

                                }
                                //支撑位min   支撑位support
                                if(list.pressureDay !=0 && list.maxDay !=0){
                                    klineByType_1.params.maxData.push([klineByType_1.params.maxDay,list.maxPrice]);
                                    klineByType_1.params.pressureData.push([klineByType_1.params.pressureDay,list.pressureDayPrice]);

                                    klineByType_1.params.perIsShow = true;
                                }
                                //压力位max  压力位pressure
                                if(list.supportDay!=0 && list.minDay!=0){
                                    klineByType_1.params.minData.push([klineByType_1.params.minDay,list.minPrice]);
                                    klineByType_1.params.supportData.push([klineByType_1.params.supportDay,list.supportDayPrice]);

                                    klineByType_1.params.supIsShow  = true;
                                }
                                KLineServiceNoData.getKData_day(val,symbol);
                            }else{
                                alert("支撑压力线的接口返回数据为空");
                            }
                        }

                    }

                },
                error: ajaxErrorHandler
            });
    },

    getKData_day: function (val,symbol) {
        var url = '';
        //url = '/hangqing-service/json/getKline?symbol='+val+symbol+'&daynum=65'+'&XDR=1';
        if( klineByType_1.params.type == 'min60'){
            //url = Http+'/stock/minKData/'+val+'/'+symbol;
            url = HttpUrl+'/stock-analysis-service/stock/minKData/'+val+'/'+symbol+'?dayNum='+Math.ceil(parseInt(klineByType_1.params.num)/4)+'&min=60' ;
        }
        if( klineByType_1.params.type == 'day'){
            url = '/hangqing-service/json/getKline?symbol='+val+symbol+'&daynum='+parseInt(klineByType_1.params.num)+'&XDR=1';
        }
        if( klineByType_1.params.type == 'week'){
            //url = Http+'/stock/weekKData/'+val+'/'+symbol;
            url = HttpUrl+'/stock-analysis-service/stock/weekKData/'+val+'/'+symbol+'?dayNum='+parseInt(klineByType_1.params.num);
        }

        //K线
        $.ajax({
            type: 'get',
            url : url,
            dataType: "jsonp",
            jsonp: "callback",
            success: function(rs){

                if(rs){
                    var list = [];

                    if(klineByType_1.params.type == 'min60' || klineByType_1.params.type == 'week'){
                        list = rs.data;
                        if(rs.data.length > 0){
                            if(klineByType_1.params.type == 'min60'){
                                klineByType_1.params.lastTime = klineByType_1.dataFormatter2(list[list.length-1].date.toString(),list[list.length-1].time.toString());

                            }
                            if(klineByType_1.params.type == 'week'){
                                klineByType_1.params.lastTime = klineByType_1.dataFormatter(list[list.length-1].date.toString());
                            }
                        }

                    }else{
                        list = rs.ks;
                        if(rs.ks.length > 0){
                            klineByType_1.params.lastTime = klineByType_1.dataFormatter(list[list.length-1].date.toString());
                        }
                    }

                    var ohlc = [];//蜡烛图数据
                    var volume = [];//柱形图数据

                    if(list.length>0){
                        var len = list.length;
                        var endDate = list[len-1].date;

                        for(var j = 0;j<len;j++){
                            var _date = '';
                            if(klineByType_1.params.type == 'min60'){
                                _date = klineByType_1.dataFormatter2(list[j].date.toString(),list[j].time.toString());
                            }else{
                                _date = klineByType_1.dataFormatter(list[j].date.toString());
                            }
                            ohlc.push([
                                _date,
                                list[j].open,
                                list[j].high,
                                list[j].low,
                                list[j].close,
                                list[j].preClose
                            ]);

                            volume.push([
                                _date, // the date
                                list[j].volume // the volume
                            ]);

                            klineByType_1.params._pressurePriceLineData.push(
                                [
                                    _date, // the date
                                    klineByType_1.params.pressurePriceLine
                                ]
                            );
                            klineByType_1.params._supportPriceLineData.push(
                                [
                                    _date, // the date
                                    klineByType_1.params.supportPriceLine
                                ]
                            );
                            if(klineByType_1.params.l1.length > 0){
                                klineByType_1.params.pressurePriceLineData =[];

                            }else{
                                if(klineByType_1.params.pressurePriceLine == 0){
                                    klineByType_1.params.pressurePriceLineData =[];
                                }else{
                                    klineByType_1.params.pressurePriceLineData.push(
                                        [
                                            _date, // the date
                                            klineByType_1.params.pressurePriceLine
                                        ]
                                    );
                                }

                            }
                            if(klineByType_1.params.l2.length > 0){
                                klineByType_1.params.supportPriceLineData = [];

                            }else{
                                if(klineByType_1.params.supportPriceLine == 0){
                                    klineByType_1.params.supportPriceLineData = [];
                                }else{
                                    klineByType_1.params.supportPriceLineData.push(
                                        [
                                            _date, // the date
                                            klineByType_1.params.supportPriceLine
                                        ]
                                    );
                                }

                            }
                        }

                        var d = new Date();
                        var str = d.getHours()+":"+ d.getMinutes();
                        if(klineByType_1.params.type == 'day'){
                            if(d.getDay() == 0 || d.getDay() == 6){//非工作日
                                klineByType_1.mapDataNoData(ohlc,volume);
                            }else{
                                if(klineByType_1.time_range("09:30", "15:00", str)){//如果开盘时间
                                    KLineServiceNoData.getLastKData(val,symbol,ohlc,volume);
                                }else{
                                    klineByType_1.mapDataNoData(ohlc,volume);
                                }
                            }

                        }else{
                            klineByType_1.mapDataNoData(ohlc,volume);
                        }
                    }
                }
            },
            error: ajaxErrorHandler
        });
    },
    //获取最近一天k线的数据
    getLastKData:function(val,symbol,ohlc,volume){
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
                        alert(rs.error);
                        klineByType_1.createChartNoData (ohlc,volume,[],[]);
                        return;
                    }
                    /**
                     * 针对停牌的股票只画K线图
                     */
                    if(rs.open == 0 && rs.high == 0 && rs.low == 0 && rs.volume==0){
                        //klineByType_1.createChartNoData (ohlc,volume,param.l1,param.l2);
                        klineByType_1.mapDataNoData(ohlc,volume);
                        //alert("该股票停牌");
                        return;
                    }

                    klineByType_1.params.lastTime = rs.time * 1000 ;

                    var temp = [];
                    temp.push(rs.time * 1000);
                    temp.push(rs.open);
                    temp.push(rs.high);
                    temp.push(rs.low);
                    temp.push(rs.newPrice);
                    temp.push(rs.lastClose);


                    var tt = new Date(rs.time*1000);
                    var tt1 = new Date(ohlc[ohlc.length-1].time);

                    var temp1 = [];
                    temp1.push(rs.time * 1000);
                    temp1.push(rs.volume);


                    if(tt.getDate() != tt1.getDate()){
                        ohlc.push(temp);
                        volume.push(temp1);
                    }
                    //去重 工作日与法定假日 会查重
                    if(Highcharts.dateFormat('%Y-%m-%d',ohlc[ohlc.length-1][0])  == Highcharts.dateFormat('%Y-%m-%d',ohlc[ohlc.length-2][0])){
                        ohlc.pop();
                    }
                    klineByType_1.mapDataNoData(ohlc,volume);
                },
                error: ajaxErrorHandler
            });
    }
};





