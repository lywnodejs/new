/**
 * Created by tm on 2019-07-9.
 * 折线图、柱状图混合图
 */

function KlineChart() {
    this.chart = null;
    this.height = 200;
    this.containerId = '';
    this.volumeScale = 0;
    this.series = [];
}

KlineChart.prototype.initialize = function () {
    this.render();
};

KlineChart.prototype.render = function () {
    Highcharts.setOptions({
        lang: {
            rangeSelectorZoom: '' //范围选择器缩放文字
        }
    });

    this.chart = Highcharts.stockChart(this.containerId, {
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
            height: (100 - this.volumeScale) + '%',
            resize: {
                enabled: true
            }
        }, {
            gridLineColor: '#E5E5E5',
            labels: {
                align: 'right',
                x: -3
            },
            top: this.volumeScale ? '0%' : '65%',
            height: this.volumeScale + '%',
            offset: 0
        }],
        plotOptions: {
            series: {
                dataGrouping: {
                    enabled: false
                }
            }
        },
        series: this.series
    });

    if(typeof chartObjs != "undefined"){
        chartObjs.push({containerId: 'chart<%= sn %>', chart: chart})
    }
};