/**
 * Created by tm on 2019-07-9.
 * 折线图、柱状图混合图
 */

function SplineAndColumnChart() {
    this.chart = null;
    // this.title = null;
    this.height = 200;
    this.categories = [];
    this.series = [];
    this.units = [];
    this.yTitles = [];
    this.containerId = '';
    this.valueDecimals = 2;
    // this.colors = ['#3E85FF', '#E63435', '#F5BA42', '#49C7E7', '#D46B08', '#9254DE'];
    this.yAxis = null;
    this.xAxis = null;
    this.yAxisVisible = true;
    this.xAxisVisible = true;
    this.yEnabled = true;
    this.legendEnabled = true;
    this.tooltipEnabled = true;
    this.yGridLineWidth = 1;
    this.showDataLabels = false;
    this.isStockLine = false;
}

SplineAndColumnChart.prototype.initialize = function () {
    this.render();
};

SplineAndColumnChart.prototype.render = function () {
    if (this.isStockLine) {
        this.series = this.initializeStock(this.categories, this.series);
        var config = {
            colors: "#eab537 #4479ef #f45b5b #7798BF #aaeeee #ff0066 #eeaaee #55BF3B #DF5353 #7798BF #aaeeee".split(" "),
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
            // rangeSelector: {
            //   selected: 4
            // },
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
                gridLineColor: '#E5E5E5',
                opposite: false,
                labels: {
                    formatter: function () {
                        return (this.value > 0 ? ' + ' : '') + this.value + '%';
                    }
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
                formatter: function () {
                    var txt = '', t = 0, val = 0;
                    for (var i = 0; i < this.points.length; i++) {
                        txt += '<span style="color: ' + this.points[i].color + ';font-size:0.75rem;line-height:1rem;">';
                        txt += this.points[i].point.series.name;//'总市值字段';
                        val = this.points[i].y;
                        val = Number(val).toFixed(2);
                        t = Highcharts.dateFormat('%Y-%m-%d', this.points[i].x);
                        txt += '</span>';
                        txt += ' : ' + val + '<br/>';
                    }
                    txt += '<span style="color: #333;font-size:0.75rem;line-height:1rem;">' + t + '</span>';
                    return txt;
                }
            },
            series: this.series
        }
        console.log(JSON.stringify(config));
        this.chart = Highcharts.stockChart(this.containerId, config);
    } else {
        this.chart = Highcharts.chart(this.containerId, {
            chart: {
                zoomType: 'xy',
                spacingLeft: 0,
                spacingRight: 0,
                spacingBottom: 0,
                height: this.height
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
            xAxis: this.xAxis || [{
                categories: this.categories,
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
                visible: true || this.xAxisVisible
            }],
            yAxis: this.yAxis || [{
                title: {
                    text: (this.yTitles[0] ? this.yTitles[0] : "")
                },
                style: {
                    fontSize: '10px',
                    color: 'rgba(154,154,156,1)',
                    fontFamily: 'DINAlternate-Bold'
                },
                lineWidth: 0,//去掉x轴线
                gridLineWidth: this.yGridLineWidth,
                tickWidth: 0,//去掉刻度
                // gridLineDashStyle: 'Solid',
                labels: {
                    enabled: this.yEnabled,
                    style: {
                        fontSize: '10px',
                        color: 'rgba(154,154,156,1)',
                        fontFamily: 'DINAlternate-Bold'
                    },
                    format: '{value}' + (this.units[0] ? this.units[0] : "")
                },
                visible: this.yAxisVisible
            }, {
                title: {
                    text: (this.yTitles[1] ? this.yTitles[1] : "")
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
                    format: '{value}' + (this.units[1] ? this.units[1] : "")
                },
                visible: this.yAxisVisible,
                opposite: true
            }],
            legend: {
                enabled: this.legendEnabled,
                align: "center", //程度标的目标地位
                verticalAlign: "top", //垂直标的目标地位
                x: 0, //间隔x轴的间隔
                y: 20 //间隔Y轴的间隔
            },
            exporting: {
                enabled: false
            },
            series: this.series,
            tooltip: {
                enabled: this.tooltipEnabled,
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
                valueDecimals: this.valueDecimals//数据值保留小数位数
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
                        // format: '{y:.2f}',
                        enabled: this.showDataLabels,
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
        })
    }
    if (typeof chartObjs != "undefined") {
        chartObjs.push({containerId: this.containerId, chart: this.chart})
    }
};
SplineAndColumnChart.prototype.initializeStock = function (categories, series) {
    var result = [];
    for (var p = 0; p < series.length; p++) {
        result.push({name: series[p].name, data: []});
    }
    for (let i = 0; i < categories.length; i++) {
        var k = categories[i];
        var year = k.substring(0, 4);
        var mon = k.substring(4, 6);
        var day = k.substring(6, 8);
        var res = new Date(year + '-' + mon + '-' + day).getTime();
        for (var j = 0; j < series.length; j++) {
            var value = series[j].data[i];
            result[j].data[i] = [res, value];
        }
    }
    return result;
};