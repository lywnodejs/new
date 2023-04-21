/**
 * 基础图
 * @author 赵波
 * @constructor
 * @date 2019-01-30
 */

function BaseChart() {
    this.chart = null;
    // this.title = null;
    this.categories = [];
    this.series = [];
    this.unit = '';
    this.containerId = '';
    this.valueDecimals = 2;
    this.colors = ['#5e98f4', '#eab537', '#ed665a'];
    this.yAxis = null;
    this.yAxisVisible = true;
    this.xAxisVisible = true;
    this.showDataLabels = false;
}

BaseChart.prototype.initialize = function () {
    this.render();
};

BaseChart.prototype.render = function () {
    this.chart = Highcharts.chart(this.containerId, {
        chart: {
            // width: 375,
            height: 200,
            spacingLeft: 0,
            spacingTop: 0,
            spacingRight: 0,
            spacingBottom: 0,
            // zoomType: 'x',
            // panning: true,
            // panKey: 'shift'
        },
        colors: this.colors,
        credits:{
            enabled:false
        },
        title: {
            text: null,
            style: {
                    fontSize: '16px'
                }
        },
        subtitle: {
            text: null
        },
        xAxis: {
            categories: this.categories,
            labels: {
                enabled: false
                // rotation: -90
            },
            tickWidth: 0,
            // visible: true || this.xAxisVisible
        },
        yAxis: this.yAxis || [{
            title: {
                text: ''
            },
            // lineWidth: 1,
            labels: {
                align: 'right',
                x: 0,
                // reserveSpace: false,  // 轴标签不占用空间
                format: '{value:.2f}'+this.unit
            },
            visible: this.yAxisVisible
        },
            {
                title: {
                    text: ''
                },
                // lineWidth: 1,
                labels: {
                    align: 'right',
                    x: 0,
                    // reserveSpace: false,  // 轴标签不占用空间
                    format: '{value:.2f}'+this.unit
                },
                visible: this.yAxisVisible
            }],
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
            itemDistance: 2,
            symbolPadding: 2,
            padding: 3,
            margin: 3
        },
        exporting: {
            enabled: false
        },
        tooltip: {
            // enabled: false,
            shared: true,
            valueDecimals: this.valueDecimals,
            // valueSuffix: unit
        },
        plotOptions: {
            spline: {
                // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                enableMouseTracking: false
            },
            line: {
                // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                enableMouseTracking: false
            },
            column: {
                // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                enableMouseTracking: false,
                dataLabels: {
                    format: '{y:.2f}',
                    enabled: this.showDataLabels,
                    allowOverlap: true // 允许数据标签重叠
                },
                borderWidth: 0
            },
            series: {
                // marker: {
                //     enabled: false
                // },
                events: {
                    //控制图标的图例legend不允许切换
                    legendItemClick: function (event){
                        return false; //return  true 则表示允许切换
                    }
                }
            }
        },
        series: this.series
    })
};
