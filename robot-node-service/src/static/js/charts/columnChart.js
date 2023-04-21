/**
 * 柱状图
 * @author 赵波
 * @constructor
 */

function ColumnChart() {

}

/**
 * 初始化
 * @param containerId 容器Id
 * @param categories X横轴数据数组
 * @param series Y轴数组
 * @param unit 数据的单位
 */
ColumnChart.prototype.initialize = function (containerId, categories, series, unit) {
    this.render(containerId, categories, series, unit);
};

ColumnChart.prototype.render = function (containerId, categories, series, unit) {
    Highcharts.chart(containerId,{
        chart: {
            type: 'column',
            height: 250,
            spacingLeft: 0,
            marginRight: 0
        },
        colors: ['#5e98f4', '#ed665a', '#77c3c8'],
        credits:{//隐藏Highchart.com
            enabled:false
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top'
        },
        title: {
            text: null
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: ''
            },
            tickAmount: 5,
            // lineWidth: 1,
            labels: {
                align: 'right',
                x: 0,
                // reserveSpace: false,  // 轴标签不占用空间
                format: '{value}'+unit
            }
        },
        tooltip: {
            // enabled: false,
            valueDecimals: 2,
            valueSuffix: unit,
            shared: true
        },
        plotOptions: {
            column: {
                // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                // enableMouseTracking: false
            },
            series: {
                events: {
                    //控制图标的图例legend不允许切换
                    legendItemClick: function (event){
                        return false; //return  true 则表示允许切换
                    }
                }
            }
        },
        series: series
    });
};