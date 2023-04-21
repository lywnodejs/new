import commonUtil from '../utils/commonUtil';
var chartDataForView = {
  generateDataForChart:function (renderChartData,type) {
    var info = renderChartData.info ;
    if(type == "valuationGrade"){
      info = renderChartData.datas;
    }
    let chartData = info.chartData;
    var categories =  chartData.categories || [];
    var series = chartData.series || [];
    var units = chartData.units || [];
    var yTitles = [];
    var valueDecimals = 2;
    
    var yAxis = null;
    var yAxisVisible = true;
    var xAxisVisible = true;
    var yEnabled = true;
    var legendEnabled = true;
    var tooltipEnabled = true;
    var yGridLineWidth = 1;
    var showDataLabels = false;
    
    if(type == "valuationGrade"){
       yEnabled = false;
       legendEnabled = false;
       yGridLineWidth = 1;
       showDataLabels = true;
       tooltipEnabled = false;
       series =  chartData.yRatingArr;
       categories = chartData.xRatingName;
    }
    var renderData = {
      chart: {
        zoomType: 'xy',
        spacingLeft: 0,
        spacingRight: 0,
        spacingBottom: 0,
        width:600,
        height:300,
      },
      title: {
        text: null
      },
      credits: {
        enabled: false,
      },
      subtitle: {
        text: null
      },
      xAxis: [{
        categories: categories,
        crosshair: true,
        lineWidth: 0,//去掉x轴线
        gridLineWidth: 0,
        tickWidth: 0,//去掉刻度
        labels: {
          style: {
            fontSize: '10px',
            color: 'rgba(154,154,156,1)',
            fontFamily: 'DINAlternate-Bold'
          }
        },
        visible: true || xAxisVisible
      }],
      yAxis:  yAxis || [{
        title: {
          text: ( yTitles[0] ?  yTitles[0] : "")
        },
        style: {
          fontSize: '10px',
          color: 'rgba(154,154,156,1)',
          fontFamily: 'DINAlternate-Bold'
        },
        lineWidth: 0,//去掉x轴线
        gridLineWidth:  yGridLineWidth,
        tickWidth: 0,//去掉刻度
        // gridLineDashStyle: 'Solid',
        labels: {
          enabled:  yEnabled,
          style: {
            fontSize: '10px',
            color: 'rgba(154,154,156,1)',
            fontFamily: 'DINAlternate-Bold'
          },
          format: '{value}' + ( units[0] ?  units[0] : "")
        },
        visible:  yAxisVisible
      }, {
        title: {
          text: ( yTitles[1] ?  yTitles[1] : "")
        },
        style: {
          fontSize: '10px',
          color: 'rgba(154,154,156,1)',
          fontFamily: 'DINAlternate-Bold'
        },
        lineWidth: 0,//去掉x轴线
        gridLineWidth: 1,
        tickWidth: 0,//去掉刻度
        // gridLineDashStyle: 'Dash',
        labels: {
          style: {
            fontSize: '10px',
            color: 'rgba(154,154,156,1)',
            fontFamily: 'DINAlternate-Bold'
          },
          format: '{value}' + ( units[1] ?  units[1] : "")
        },
        visible:  yAxisVisible,
        opposite: true
      }],
      legend: {
        enabled:  legendEnabled,
        align: "center", //程度标的目标地位
        verticalAlign: "top", //垂直标的目标地位
        x: 0, //间隔x轴的间隔
        y: 20 //间隔Y轴的间隔
      },
      exporting: {
        enabled: false
      },
      series:  series,
      tooltip: {
        enabled: tooltipEnabled,
        backgroundColor: 'rgba(102,102,102,0.8)',
        borderColor: 'rgba(0,0,0,0)',
        borderWitch: '0',
        crosshairs: true,
        shared: true,
        shadow: false,
        style: {
          // fontSize: '10px',
          lineHeight: 16,
          color: 'rgba(255,255,255,1)',
          textOutline: "none"
        },
        valueDecimals:  valueDecimals//数据值保留小数位数
      }, plotOptions: {
        spline: {
          // 关闭鼠标跟踪，对应的提示框、点击事件会失效
          // enableMouseTracking: false
          states: {
            hover: {
              lineWidth: 2,
              halo: {
                size: 4
              }
            }
          }
        },
        line: {
          // 关闭鼠标跟踪，对应的提示框、点击事件会失效
          // enableMouseTracking: false
        },
        column: {
          // 关闭鼠标跟踪，对应的提示框、点击事件会失效
          // enableMouseTracking: false,
          dataLabels: {
            format: '{y:.2f}',
            enabled:  showDataLabels,
            allowOverlap: true // 允许数据标签重叠
          },
          // borderWidth: 0
          maxPointWidth: 30
        },
        series: {
          events: {
            //控制图标的图例legend不允许切换
            legendItemClick: function (event) {
              return false; //return  true 则表示允许切换
            }
          }
        }
      }
    }
    return renderData;
  },
  generateDataForPieChart:function (renderData) {
    var info = renderData.info;
    var series =  info.chartData ||[];

    var resultData = { chart: {
      spacing: [40, 0, 40, 0],
      width:600,
      height:300
    },
      title: {
        floating: true,
        text: ''
      },
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: 'black'
            }
          },
        }
      },
      series: [{
        type: 'pie',
        innerSize: '60%',
        name: '市场份额',
        data:  series
      }]}
    return resultData;
  },
  generateDataForKLineChart:function (renderData) {
    var info = renderData.info;
    var series =  info.chartData ||[];
    var volumeScale = info.volumeScale || 0;
    var resultData ={
      chart: {
        width:600,
        height:300
      },
      rangeSelector: {
        enabled: false
      },
      navigator: {
        buttonOptions: {
          enabled: false
        },
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      title: {
        floating: true,
        text: ''
      },
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: true,
        align: "center", //程度标的目标地位
        verticalAlign: "top", //垂直标的目标地位
        x: 0, //间隔x轴的间隔
        y: 0, //间隔Y轴的间隔
        margin: 3,
        padding: 12
      },
      xAxis: {
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%m-%d',
          week: '%m-%d',
          month: '%y-%m',
          year: '%Y'
        }
      },
      tooltip: {
        shared: true,
        split: false,
        shadow: false,
        borderWidth: 0,
        backgroundColor: '#00000000',
        positioner: function () {
          return {x: 0, y: 0};
        }
      },
      yAxis: [{
        crosshair: true,
        gridLineColor: '#E5E5E5',
        labels: {
          align: 'right',
          x: -3
        },
        height: (100 -  volumeScale) + '%',
        resize: {
          enabled: true
        }
      }, {
        gridLineColor: '#E5E5E5',
        labels: {
          align: 'right',
          x: -3
        },
        top:  volumeScale ? '0%' : '65%',
        height:  volumeScale + '%',
        offset: 0
      }],
      plotOptions: {
        series: {
          dataGrouping: {
            enabled: false
          }
        }
      },
      series:  series,
      lang: {
        rangeSelectorZoom: '' //范围选择器缩放文字
      }
    }
    return resultData;
  },
  generateDataForPercentChart:function (renderData) {
    var info = renderData.info;
    var seriesOptions = [];
    var stkName = renderData.stock.stkName;
    var  names = ['沪深300', stkName];
    for (var i = 0; i < names.length; i++) {
      seriesOptions.push({
        name: names[i],
        data: info.data[i]
      })
    }
    var resultData =  {
      colors: "#eab537 #4479ef #f45b5b #7798BF #aaeeee #ff0066 #eeaaee #55BF3B #DF5353 #7798BF #aaeeee".split(" "),
      chart: {
        width:600,
        height:300
      },
      title: {
        floating: true,
        text: ''
      },
      rangeSelector: {
       enabled: false
      },
      navigator: {
        buttonOptions: {
          enabled: false
        },
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      exporting:{
        enabled: false
      },
      legend: {
        enabled: true,
          align: "center", //程度标的目标地位
          verticalAlign: "bottom", //垂直标的目标地位
          x: 0, //间隔x轴的间隔
          y: 0, //间隔Y轴的间隔
          margin: 3,
          padding: 12
      },
      xAxis: {
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m-%d',
            week: '%m-%d',
            month: '%y-%m',
            year: '%Y'
        }
      },
      yAxis: {
        title:"",
        gridLineColor: '#E5E5E5',
        opposite: false,
        labels: {
          enabled:  true,
          style: {
            fontSize: '10px',
            color: 'rgba(154,154,156,1)',
            fontFamily: 'DINAlternate-Bold'
          },
          format: '{value}' + "%"
        },
        plotLines: [{
          value: 0,
          width: 2,
          color: 'silver'
        }]
      },
      plotOptions: {
        series: {
          compare: 'percent'
        }
      },
      series: seriesOptions
    }
    return resultData;
  },
  generateData:function(renderData,templateName){
    if(templateName == "splineAndColumnView" ){
      return this.generateDataForChart(renderData);
    } else if(templateName == "pieView" ) {
      return this.generateDataForPieChart(renderData);
    }else if(templateName == "klineChartView" ) {
      return this.generateDataForKLineChart(renderData);
    } else if(templateName == "tableView"){
      if (renderData.info.chartData){
        renderData.info.chartData.push({text:'wind',type:'source'});
      }
      if(renderData.info.updateTime){
        renderData.info.chartData.push({text:commonUtil.formatDataDay(renderData.info.updateTime),type:'time'});
      }
      return  renderData.info.chartData;
    } else if(templateName == "valuationGrade"){
      return this.generateDataForChart(renderData,templateName);
    }else if(templateName == "knowAtlasView"){
      return renderData.chartData;
    }else if(templateName == "financialStatement"){
      return renderData.info;
    } else if(templateName == 'contrastStockView'){
      return this.generateDataForPercentChart(renderData);
    }
  }
};
export default chartDataForView;
