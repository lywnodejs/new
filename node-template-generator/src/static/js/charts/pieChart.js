/**
 * Created by tm on 2019-07-9.
 * 折线图、柱状图混合图
 */

function PieChart() {
    this.chart = null;
    this.height = 200;
    this.containerId = '';
    this.series = [];
    this.indicatorConvertedUnit = '';
    this.pieValuesType = 1;
}

PieChart.prototype.initialize = function () {
    this.render();
};

PieChart.prototype.render = function () {
    let indicatorConvertedUnit = this.indicatorConvertedUnit;
    let pieValuesType = this.pieValuesType;
    this.chart = Highcharts.chart(this.containerId, {
        chart: {
            height: this.height,
        },
        title: {
            floating: true,
            text: ''
        },
        credits: {
            enabled: false,
        },
        tooltip: {
            // pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>',
            formatter: function () {
                if (pieValuesType === 1) {
                    return '<span>' + this.point.name + ':<br/>' + this.percentage.toFixed(2) + '%</span>';
                } else if (pieValuesType === 2) {
                    return '<span>' + this.point.name + ':<br/>' + this.y.toFixed(2) + indicatorConvertedUnit + '</span>';
                } else {
                    return '<span>' + this.point.name + ':<br/>' + this.y.toFixed(2) + indicatorConvertedUnit + '(' + this.percentage.toFixed(2) + '%)</span>';
                }
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    // format: '<b>{point.name}</b>: <br/>{point.percentage:.2f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    formatter: function () {
                        //this 为当前的点（扇区）对象，可以通过  console.log(this) 来查看详细信息
                        if (pieValuesType === 1) {
                            return '<span>' + this.point.name + ':<br/>' + this.percentage.toFixed(2) + '%</span>';
                        } else if (pieValuesType === 2) {
                            return '<span>' + this.point.name + ':<br/>' + this.y.toFixed(2) + indicatorConvertedUnit + '</span>';
                        } else {
                            return '<span>' + this.point.name + ':<br/>' + this.y.toFixed(2) + indicatorConvertedUnit + '(' + this.percentage.toFixed(2) + '%)</span>';
                        }
                    }
                },
            }
        },
        series: [{
            type: 'pie',
            name: "",
            innerSize: '60%',
            data: this.series
        }]
    });

    if (typeof chartObjs != "undefined") {
        chartObjs.push({containerId: this.containerId, chart: this.chart})
    }
};