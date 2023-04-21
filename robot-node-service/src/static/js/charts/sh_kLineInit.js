/**
 * Created by xdy on 18-02-11.
 * K线，压力线  支撑线  支撑位 压力位
 * 只展示上证指数
 * num:52,//K线数据条数，当接口有数据返回时，则使用接口返回的数据，当接口没有数据返回时则使用52
 * pressurePriceLine: 0,//压力位
 * supportPriceLine:0//支撑位
 */
var klineByType = {
    HttpUrl:'/robot/semantic/',
    getTarget: function(sn) {
        var temp =
            '<div class="box_bRed" id="legend'+sn+'"></div>'+
            '<div id="report'+sn+'" style="height:18px; width: 280px; margin:0 auto;"></div>'+
            '<div id="container_sh'+sn+'" class="box_chart01"></div>';
        return temp;
    },


    init:function(symbol,chart_t,price,name) {
        symbol = symbol==null ? 'sh600773' : symbol;//sh603903

        var str_qz = symbol.toString().substr(0,2);
        var str_symbol = symbol.toString().substr(2,6);

        if(str_symbol){
            //根据股票代码查新名称
            KLineByTypeService.getKLine(str_qz,str_symbol,chart_t,price,name);
        }
    },

    /**
     * 将K线数据映射成坐标系中的点
     * 获得支撑线和压力线与y轴的交点坐标，添加到支撑线/压力线数组中
     * @paramByType str
     * @returns {number}
     */
    mapDataByType:function (ohlc,volume,l1,l2,chart_t,num,pressurePrice,supportPrice){
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

        var data1 = [];
        var data2 = [];

        var lastTime = ohlc[ohlc.length-1][0];

        if(l1.length>0){
            for(var i = 0;i<l1.length;i++){
                for(var j = 0;j<_list.length;j++){
                    if(l1[i][0] == _list[j][1]){
                        var temp = [];
                        temp.push(_list[j][0],l1[i][1]);
                        data1.push(temp);
                    }
                }
            }
            var a_1 = Number(data1[0][0]),
                b_1 = Number(data1[0][1]),
                c_1 = Number(data1[1][0]),
                d_1 = Number(data1[1][1]),


                y1 = 0;
            /*//交点公式
             x=[(b_1*c_1-a_1*d_1)*(c_2-a_2)-(c_1-a_1)*(b_2*c_2-a_2*d_2)]/[(b_1-d_1)*(c_2-a_2)-(c_1-a_1)*(b_2-d_2)];
             y=[(b_2*c_2-a_2*d_2)*(b_1-d_1)-(b_2-d_2)*(b_1*c_1-a_1*d_1)]/[(b_1-d_1)*(c_2-a_2)-(c_1-a_1)*(b_2-d_2)];*/


            //y1 = [(b_1*c_1-a_1*d_1)-52*(b_1-d_1)]/(c_1-a_1);
            y1 = [(b_1*c_1-a_1*d_1)-parseInt(ohlc.length)*(b_1-d_1)]/(c_1-a_1);
            l1.push([lastTime,Number(y1.toFixed(2))]);
        }
        if(l2.length>0){
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
            y2 = [(b_2*c_2-a_2*d_2)-parseInt(num)*(b_2-d_2)]/(c_2-a_2);

            l2.push([lastTime,Number(y2.toFixed(2))]);
        }
        var obj = {};
        obj.ohlc = ohlc;
        obj.volume = volume;
        obj.l1 = l1;
        obj.l2 = l2;
        obj.chart_t = chart_t;
        obj.num = num;
        obj.pressurePrice = pressurePrice;
        obj.supportPrice = supportPrice;

        sh_kLine.createChart (obj);
    }
};


var KLineByTypeService = {
    getKLine: function (val,symbol,chart_t,price,name){
        jQuery.ajax(
            {
                url: klineByType.HttpUrl + 'stock-analysis-service/' +'stock/area/priceAnalysis/'+val+'/'+symbol+'?dayNum=150&min=60',
                type: 'get',
                async: null,
                data: null,
                dataType: 'jsonp',
                success: function(rs)
                {
                    var voiceTxt = '';
                    if(rs){
                        if(rs.message.code == 0){
                            var num = 52;
                            var list = rs.data;
                            if(rs.data){
                                num = list.num?list.num:num;

                                var l1=[],l2=[];
                                if(list.dataType == 'day'){

                                    var $legend = $("#legend"+chart_t);
                                    $legend.html('<li>压力位　'+list.pressurePrice+'</li><li>支撑位　'+list.supportPrice+'</li>');

                                    voiceTxt = '目前技术上来看，' + (name||'') + '压力位'+list.pressurePrice+'，支撑位'+list.supportPrice;

                                    //压力线
                                    var maxDay = timeUtil.dataFormatter(list.maxDay.toString()),
                                        pressureDay = timeUtil.dataFormatter(list.pressureDay.toString()),
                                        minDay = timeUtil.dataFormatter(list.minDay.toString()),
                                        supportDay = timeUtil.dataFormatter(list.supportDay.toString());
                                    if(list.pressureDay !=0 && list.maxDay !=0){
                                        if(list.maxDay < list.pressureDay){
                                            l1.push(
                                                [maxDay,list.maxPrice],
                                                [pressureDay,list.pressureDayPrice]
                                            );
                                        }else{
                                            l1.push(
                                                [pressureDay,list.pressureDayPrice],
                                                [maxDay,list.maxPrice]
                                            );
                                        }
                                    }


                                    //支撑线
                                    if(list.supportDay!=0 && list.minDay!=0){
                                        if(list.minDay < list.supportDay){
                                            l2.push(
                                                [minDay,list.minPrice],
                                                [supportDay,list.supportDayPrice]
                                            );
                                        }else{
                                            l2.push(
                                                [supportDay,list.supportDayPrice],
                                                [minDay,list.minPrice]
                                            );
                                        }
                                    }
                                    KLineByTypeService.getKData_day(val,symbol,l1,l2,chart_t,price,num,list.pressurePrice,list.supportPrice);
                                }

                            }else{
                                alert("支撑压力线的接口返回数据为空");
                            }
                        }

                    }

                    // 语音
                    if (name !== '上证指数') {
                        playVoiceAnswerLite(voiceTxt);
                    }
                }
            });
    },

    getKData_day: function (val,symbol,l1,l2,chart_t,price,num,pressurePrice,supportPrice) {
        var url = '';
        url = '/hangqing-service/json/getKline?symbol='+val+symbol+'&daynum='+parseInt(num)+'&XDR=1';
        //K线
        $.ajax({
            type: 'get',
            url : url,
            dataType: "jsonp",
            jsonp: "callback",
            success: function(rs){
                if(rs){
                    var list = rs.ks,
                        ohlc = [],//蜡烛图数据
                        volume = [];//柱形图数据

                    if(list.length>0){
                        var len = list.length;

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

                            volume.push([
                                _date, // the date
                                list[j].volume // the volume
                            ]);


                        }
                        KLineByTypeService.getLastKData(val,symbol,ohlc,volume,l1,l2,chart_t,price,num,pressurePrice,supportPrice);
                    }
                }
            }
        });
    },
    //获取最近一天k线的数据
    getLastKData:function(val,symbol,ohlc,volume,l1,l2,chart_t,price,num,pressurePrice,supportPrice){
        if(price){
            var temp = [];
            temp.push(price.time * 1000);
            temp.push(price.open);
            temp.push(price.high);
            temp.push(price.low);
            temp.push(price.newPrice);
            temp.push(price.lastClose);


            var tt = new Date(price.time*1000);
            var tt1 = new Date(ohlc[ohlc.length-1].time);

            var temp1 = [];
            temp1.push(price.time * 1000);
            temp1.push(price.volume);


            if(tt.getDate() != tt1.getDate()){
                if(price.open !=0 && price.high !=0 && price.low !=0){//当天未开盘情况
                    ohlc.push(temp);
                    volume.push(temp1);
                }

            }
            //去重 工作日与法定假日 会查重
            if(Highcharts.dateFormat('%Y-%m-%d',ohlc[ohlc.length-1][0])  == Highcharts.dateFormat('%Y-%m-%d',ohlc[ohlc.length-2][0])){
                ohlc.pop();
            }
            klineByType.mapDataByType(ohlc,volume,l1,l2,chart_t,num,pressurePrice,supportPrice);
            return;
        }

        var url= '';
        url = 'https://jy.hczq.com/json/getReport.do?symbol='+val+symbol;
        jQuery.ajax({
            url: url,
            type: 'get',
            async: null,
            data: null,
            dataType: 'jsonp',
            success: function(rs)
            {

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
                    if(rs.open !=0 && rs.high !=0 && rs.low !=0){//当天未开盘情况
                        ohlc.push(temp);
                        volume.push(temp1);
                    }
                }
                //去重 工作日与法定假日 会查重
                if(Highcharts.dateFormat('%Y-%m-%d',ohlc[ohlc.length-1][0])  == Highcharts.dateFormat('%Y-%m-%d',ohlc[ohlc.length-2][0])){
                    ohlc.pop();
                }
                klineByType.mapDataByType(ohlc,volume,l1,l2,chart_t,num,pressurePrice,supportPrice);
            }
        });
    }
};





