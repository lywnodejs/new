var sh_kLine = {

  showTips:function (chart,min,max) {
    //删除标示线
    chart.yAxis[0].removePlotLine('plot-line-1');
    chart.yAxis[0].removePlotLine('plot-line-2');

    //支撑线
    chart.yAxis[0].addPlotLine({           //在x轴上增加标示线   x轴线
      value:min,
      width:1,
      color: 'red',
      id: 'plot-line-1'                  //标示线的id，在删除该标示线的时候需要该id标示
    });
    //压力线
    chart.yAxis[0].addPlotLine({           //在x轴上增加标示线   x轴线
      value:max,
      width:1,
      color: 'green',
      id: 'plot-line-2'                  //标示线的id，在删除该标示线的时候需要该id标示
    });
  },

  // create the chart
  createChart:function (obj){

    //ohlc,volume,l1,l2,chart_t
    var l1 = obj.l1;
    var l2 = obj.l2;
    var ohlc = obj.ohlc;
    var volume = obj.volume;
    var chart_t = obj.chart_t;


    console.log(chart_t)
    var chartW = $('.box_chart01').width();
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
        width:chartW,
        height:230,
        panning:false,
        zoomType: 'none',
        pinchType:'none',
        renderTo : 'container_sh'+chart_t,
        resetZoomButton: {
          theme: {
            display: 'none'
          }
        },
        events: {
          load:function(){ //当不存在压力线和支撑线时，绘制平行于x轴的压力标识线和支撑压力线
            var min=0,max=0;
            if(l1.length > 0){//压力标示线
              max ='';
            }else{
              if(obj.pressurePrice == 0){
                max ='';
              }else{
                max = obj.pressurePrice
              }
            }
            if(l2.length > 0){//支撑标示线
              min = '';
            }else{
              if(obj.supportPrice == 0){
                min = '';
              }else{
                min = obj.supportPrice;
              }
            }
            sh_kLine.showTips(this,min,max);
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
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        labelFormatter: function() {
          var str = '';
          if(this.name == "压力位"){
            str = "压力位("+obj.pressurePrice+")";
          }
          if(this.name == "支撑位"){
            str = "支撑位("+obj.supportPrice+")";
          }
          return  '<label style="color: #000;font-family: 微软雅黑;font-size: 0.85em;font-weight:normal; text-align:center; line-height: 1.5em; height: 1.5em;">'+str+'</label>';
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
            return Highcharts.dateFormat('%Y-%m-%d',this.value)
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
        text:"<span style='font-family: 微软雅黑;font-size: 0.625em;font-weight: normal'>日K 前复权</span>",
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
          sh_kLine.getReport(d,col,open,close,zdf,chart_t);
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
        name : '压力位',
        data : [],color:'green'
      },{
        type: 'line',
        name : '支撑位',
        data : [],color:'red'
      }]
    });
  },

  getReport:function (d,col,open,close,zdf,chart_t) {
    var $reporting = $("#report"+chart_t);

    $reporting.html(
      '  <span style=" display:block; width:300px; height:20px; line-height: 20px; margin: 0 auto;"><span style="font-family: 微软雅黑;font-size: 0.75em;font-weight: normal; float: left; width: 24%; ">'+Highcharts.dateFormat('%Y-%m-%d',d)+'</span>'
      + '<span style=" float: left; width: 24%;"><span style=" float: left;font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">开:</span>'
      + '<span style=" float: left;color:'+col+';font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">'+open+'</span></span>'
      + '<span style=" float: left; width: 24%;"><span style=" float: left;font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">收:</span>'
      + '<span style=" float: left;color:'+col+';font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">'+close+'</span></span>'
      + '<span style=" float: left; width: 24%;"><span style=" float: left;font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">幅:</span>'
      + '<span style=" float: left;color:'+col+';font-family: 微软雅黑;font-size: 0.75em;font-weight: normal">'+zdf+'</span></span></span>'
    );
  }

}


