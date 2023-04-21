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
        holders.push(item.shldAmount);
        if(item.endPrice){
            prices.push(item.endPrice);
        }else{
            prices.push("--");
        }

        dates.push(item.endDate);
    });

   var chart = Highcharts.chart(container, {
        chart: {
            // zoomType: 'xy',
            height: 300,
            // spacingRight: -10,
            // spacingLeft: -20,
            // spacingBottom: 0
        },
        credits:{//隐藏Highchart.com
            enabled: false
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        xAxis: [{
            categories: dates,
            // crosshair: true
        }],
        yAxis: [
            { // 股价
                labels: {
                    // format: '{value}户',
                    style: {
                        color: '#639df5'
                    }
                },
                title: {
                    text: '单位：元',
                    align: 'high',
                    offset: 0,
                    rotation: 0,
                    y: -15,
                    // style: {
                    //     color: Highcharts.getOptions().colors[1]
                    // }
                },
                offset: -20,
                opposite: true
            },
            { // 股东
                title: {
                    text: '单位：户',
                    align: 'high',
                    offset: 0,
                    rotation: 0,
                    y: -15,
                    // style: {
                    //     color: Highcharts.getOptions().colors[0]
                    // }
                },
                labels: {
                    // format: '{value} 元',
                    style: {
                        color: '#e1c022'
                    }
                },
                offset: -20
            }
        ],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            x: 0,
            verticalAlign: 'top',
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
        }],
        plotOptions: {
            series: {
                events: {
                    //控制图标的图例legend不允许切换
                    legendItemClick: function (event){
                        return false; //return  true 则表示允许切换
                    }
                }
            }
        },
    });
   if(typeof chartObjs != "undefined"){
     chartObjs.push({containerId: container, chart: chart})
   }
}
