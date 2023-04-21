/**
 * 蜘蛛图
 * @author 赵波
 * Created by BoBo on 2018-12-05.
 */

function PolygonChart(totalScore) {
    this.totalScore = totalScore || 0;
    this.fieldCategories = ['profitScore', 'growupScore', 'operationScore', 'debtScore', 'cashScore'];
    this.xCategories = ['盈利', '成长', '运营', '偿债', '现金流'];
}


/**
 * 初始化
 * @param containerId 容器Id
 * @param series Y轴数组
 */
PolygonChart.prototype.initialize = function (containerId, series) {
    this.render(containerId, series);
};

PolygonChart.prototype.render = function (containerId, scoreInfo) {
    // 构造数据
    var categories = this.fieldCategories;
    var series = [];
    for(var p in scoreInfo)
    {
        var data = [];
        for(var i=0; i<categories.length; i++)
        {
            data.push(scoreInfo[p][categories[i]]);
        }

        var serie = {
            type: 'area',
            fillOpacity: 0.5,
            name: getQuarterLabel(scoreInfo[p]['endDate'], 'zh'),
            data: data,
            pointPlacement: 'on',
            marker: {
                enabled: false
            }
        };
        series.push(serie);
    }

    // 图标
    // var categoryIcons = ['icon_finAna01-min.png', 'icon_finAna02-min.png', 'icon_finAna03-min.png', 'icon_finAna04-min.png', 'icon_finAna05-min.png'];
    var xCategories = this.xCategories;
    var chart = Highcharts.chart(containerId, {
        // totalScore: this.totalScore, // 综合评分 自定义
        textContents: [], // 缓存图上画的评分元素的对象
        colors: "#eab537 #4479ef #f45b5b #7798BF #aaeeee #ff0066 #eeaaee #55BF3B #DF5353 #7798BF #aaeeee".split(" "),
        chart: {
            polar: true,
            // type: 'line',
            height: 120,
            marginTop: 5,
            marginBottom: 0,
            marginRight: 0,
            marginLeft: 0,
            backgroundColor: 'rgba(0,0,0,0)',
            // backgroundColor: {
            //     linearGradient: {
            //         x1: 1, y1: 0, x2: 1, y2: 1
            //     }, stops: [[0, "#464957"], [1, "#2F2F39"]]
            // },
            events: {
                // render: onChartLoad
            }
        },
        title: {
            text: null,
            x: -80
        },
        pane: {
            size: '70%'
        },
        xAxis: {
            categories: xCategories,
            tickmarkPlacement: 'on',
            lineWidth: 0,
            gridLineColor: "#a1a2a8",
            labels: {
                // y: -17,
                distance: 3,
                zIndex: 1,
                style: {color: "#a1a2a8", fontSize: '10px'},
                // useHTML:true,
                // formatter: function () {
                //     if(this.pos === categoryIcons.length)
                //         return '';
                //     // 兼容发布后的路径
                //     var extraPath = '';
                //     if(location.host.indexOf('localhost') === -1 && location.port.indexOf('60001') === -1)
                //         extraPath = 'master/';
                //     return '<img src="../../'+extraPath+'images/' + categoryIcons[this.pos] + '" style="width: 20px; height: 20px"><p>'+this.value+'</p>'
                // }
            },
            // lineColor: "#a1a2a8",
            // minorGridLineColor: "#a1a2a8",
            tickColor: "#a1a2a8",
            // title: {style: {color: "#A0A0A3"}}
        },
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            max: 100,
            gridLineColor: "#a1a2a8",
            labels: {
                style: {color: "#E0E0E3"},
                enabled: false
            },
            lineColor: "#a1a2a8",
            // minorGridLineColor: "#505053",
            // tickAmount: 5,
            tickPositions: [0, 20, 40, 60, 80, 100],
            endOnTick: true,
            // tickInterval: 20,
            // tickColor: "#707073",
            tickWidth: 1,
            // title: {style: {color: "#A0A0A3"}}
        },
        tooltip: {
            // enabled: false,
            useHTML: true,
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <s>{point.y}</s><br/>',
            // backgroundColor: "rgba(0, 0, 0, 0.75)",
            // style: {color: "#F0F0F0", 'z-index': 9999}
        },
        legend: {
            enabled: false,
            align: 'center',
            verticalAlign: 'bottom',
            y: 20,
            layout: 'horizontal',
            // itemStyle: {color: "#E0E0E3"},
            itemHoverStyle: {color: "#FFF"},
            reversed: true
            // itemHiddenStyle: {color: "#606063"}
        },
        series: series,
        plotOptions: {
            area: {
                // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                // enableMouseTracking: false
            },
            series: {
                // 针对所有数据列有效
                lineWidth: 1,
                // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                enableMouseTracking: false,
                // fillOpacity: 0.6
                events: {
                    //控制图标的图例legend不允许切换
                    legendItemClick: function (event){
                        return false; //return  true 则表示允许切换
                    }
                }
            }
        },
        credits:{//隐藏Highchart.com
            enabled:false
        }
    });
    if(typeof chartObjs != "undefined"){
      chartObjs.push({containerId: containerId, chart: chart})
    }
};

/**
 * 画综合评分
 */
function onChartLoad(event) {
    var centerX = this.chartWidth/2,
        centerY = this.chartHeight/2;

    var label;
    var big5;
    var textContents = this.userOptions.textContents;
    if(textContents.length > 0){
        label = textContents[0];
        big5 = textContents[1];
    }else{
        // 综合评分
        label = this.renderer.text('综合评分')
            .attr({
                zIndex: 6
            })
            .css({
                color: '#FFFFFF',
                fontSize: '14px'
            })
            .add();

        // 分数
        big5 = this.renderer.text(this.userOptions.totalScore)
            .attr({
                zIndex: 6
            })
            .css({
                color: 'white',
                fontSize: '30px'
                // fontStyle: 'italic',
                // fontFamily: "'Brush Script MT', sans-serif"
            })
            .add();
    }

    var left = centerX - label.getBBox().width / 2,
        right = centerX + label.getBBox().width / 2;
    label.attr({
        x: left,
        y: centerY - 5
    });

    big5.attr({
        x: centerX - big5.getBBox().width / 2 - 5,
        y: centerY + 25
    });

    this.userOptions.textContents = [];
    this.userOptions.textContents.push(label);
    this.userOptions.textContents.push(big5);
}

// 转换日期为2017Q1 ||　2017一季报
function getQuarterLabel(value, type, shortYear){
    var en = {
        '00': '',
        '03': 'Q1',
        '06': 'Q2',
        '09': 'Q3',
        '12': 'Q4'
    };

    var zh = {
        '00': '',
        '03': '一季报',
        '06': '二季报',
        '09': '三季报',
        '12': '四季报'
    };

    var season = {
        '00': '',
        '03': '年第一季度',
        '06': '年第二季度',
        '09': '年第三季度',
        '12': '年第四季度'
    };

    var zh2 = {
        '00': '',
        '03': ' 一季报',
        '06': ' 中报',
        '09': ' 三季报',
        '12': ' 年报'
    };

    var quarter = en;
    if(type === 'zh')
        quarter = zh;
    if(type === 'zh2')
        quarter = zh2;
    else if(type === 'season')
        quarter = season;

    var month = '00';
    var year = '';
    var str = value.toString();
    year = str.substr(shortYear?2:0, shortYear?2:4);
    if(str.length > 4)
        month = str.substr(4, 2);

    return year+quarter[month];
}
