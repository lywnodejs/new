/**
 * 股东人数变化图表
 * @param container 图表父容器id
 * @param list 数据列表
 * @constructor
 */
function LineColumnChart(container, list) {
    var holders = [],
        prices = [],
        dates = [];

    //提取数据
    list.forEach(function (item, index) {
        holders.push(item.shldAmount || null);
        prices.push(item.endPrice || null);
        dates.push(item.endDate);
    });

    Highcharts.chart(container, {
        chart: {
            zoomType: 'xy',
            width: $('.box_chart01').width()+15,
            height: 300,
            spacingRight: -10,
            spacingLeft: -20,
            spacingBottom: 0
        },
        credits:{//隐藏Highchart.com
            enabled: false
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: [{
            categories: dates,
            crosshair: true
        }],
        yAxis: [{ // 股价
            labels: {
                // format: '{value}户',
                style: {
                    color: '#639df5'
                }
            },
            title: {
                text: null,
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            offset: -20,
            opposite: true
        }, { // 股东
            title: {
                text: null,
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                // format: '{value} 元',
                style: {
                    color: '#e1c022'
                }
            },
            offset: -20
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            x: 0,
            verticalAlign: 'bottom',
            y: 0
            // floating: true,
            // backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: '股东',
            type: 'column',
            yAxis: 1,
            data: holders,
            color:  '#e1c022',
            tooltip: {
                valueSuffix: ' 户'
            }

        }, {
            name: '股价',
            type: 'line',
            data: prices,
            color: '#639df5',
            tooltip: {
                valueSuffix: ' 元'
            },
            marker: {
                lineWidth: 2,
                lineColor: '#639df5',
                fillColor: 'white'
            }
        }]
    });
}
