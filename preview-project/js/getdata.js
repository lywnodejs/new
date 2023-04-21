var typeB = [];
var arrTypeC=[];
var arrTypeD=[];
function init(ele, data, val) {
    Highcharts.addEvent(
        Highcharts.seriesTypes.networkgraph,
        'afterSetOptions',
        function (e) {
            var nodes = {};
            e.options.data.forEach(function (link) {
                if (link[0] === val) {
                    if(val == ""){
                        nodes[val] = {
                            id: val,
                            marker: {
                                radius: 60
                            },
                            color: '#ffffff'
                        };
                        nodes[link[1]] = {
                            id: link[1],
                            marker: {
                                radius: 40
                            },
                            color: '#E63435'
                        };
                        // nodes[link[2]] = {
                        //     id: link[2],
                        //     marker: {
                        //         radius: 30
                        //     },
                        //     color: '#3E85FF'
                        // };
                    }else{
                        nodes[val] = {
                            id: val,
                            marker: {
                                radius: 40
                            },
                            color: '#E63435'
                        };
                        nodes[link[1]] = {
                            id: link[1],
                            marker: {
                                radius: 30
                            },
                            color: '#3E85FF'
                        };
                    }

                    // if (typeB.indexOf(link[1])!==-1) {
                    //     nodes[link[1]] = {
                    //         id: link[1],
                    //         marker: {
                    //             radius: 30
                    //         },
                    //         color: '#FF6600'
                    //     };
                    // } else {
                    //     nodes[link[1]] = {
                    //         id: link[1],
                    //         marker: {
                    //             radius: 30
                    //         },
                    //         color: '#666699'
                    //     };
                    // }
                } else if (nodes[link[0]] && nodes[link[0]].color) {
                    nodes[link[1]] = {
                        id: link[1],
                        color: '#3E85FF',
                        marker: {
                            radius: 30
                        },
                    };
                }
            });
            e.options.nodes = Object.keys(nodes).map(function (id) {
                return nodes[id];
            });
        }
    );
    window.chart = Highcharts.chart(ele, {
        chart: {
            type: 'networkgraph',
            height: '600px',
            backgroundColor: 'rgba(0,0,0,0)'
        },
        tooltip: {
            useHTML: true,
            borderRadius:15,
            borderWidth:0,
            shadow:false,
            backgroundColor:"rgba(0,0,0,0.6)",
            formatter: function () {
                // if(this.point.name.indexOf('第')!==-1){
                //     this.point.name=this.point.name.substr(this.point.name.indexOf('第'),this.point.name.length);
                // }
                //  if(this.point.name==='解释'){
                //      return '<div style="width: 150px;text-align: center; white-space: pre-wrap">'+text+'</div>'
                //  }else{
                //      return '<div style="width: 150px;text-align: center; white-space: pre-wrap">'+filter(this.point.name)+'</div>'
                //  }
                return '<div style="width: 100px;text-align: center; white-space: pre-wrap">' + this.point.name + '</div>'
            }

        },
        credits: {enabled: false},
        exporting: {enabled: false},
        title: {
            text: ' '
        },
        plotOptions: {
            networkgraph: {
                keys: ['from', 'to'],
                layoutAlgorithm: {
                    enableSimulation: true
                }
            },
        },
        series: [{
            dataLabels: {
                borderWidth:0,
                enabled: true,
                verticalAlign:'middle',
                style:{
                    "textOutline": "0px 0px contrast"
                },
                color:"#ffffff",
                // linkFormat:'{point.toNode.name}',
                linkFormatter: function (e) {
                    if(arrTypeC.indexOf(this.point.to)!==-1){
                        return '</div style="color:#000;">行业个股</div>';
                    }
                    if(arrTypeD.indexOf(this.point.to)!==-1){
                        return '</div style="color:#000;">下游行业</div>';
                    }
                    return '';
                    // if(this.point.to==lawTXT){
                    //     return '</div style="color:#000;">违法类别</div>';
                    // }
                    // if(this.point.to=='违法类别'){
                    //     return '</div style="color:#000;">违法类别</div>';
                    // }
                    // if(this.point.to=='相关法律'){
                    //     return '相关法律';
                    // }
                    // var linkType_='</div style="color:#000;">'+22+'</div>';
                    // return linkType_;
                },
                formatter: function (e) {
                    if (this.point.name.length >= 8) {
                        return this.point.name.substr(0, 5) + '...';
                    } else {
                        return this.point.name;
                    }
                }
            },
            lineWidth:0,
            events: {
                click: function (e) {
                    // getData(e.point.name,getParent(e.point.name))

                }
            },
            data: data
        }]
    },function (chart) {
        if (!chart.renderer.forExport) {
            var list = chart.series[0].data;
            for(var i=0;i<list.length;i++){
                console.log(list[i].from)
                if(list[i].from == ""){
                    chart.series[0].data[i].graphic.element.remove();
                }
            }
            var nodes = chart.series[0].nodes;
            for(var i=0;i<nodes.length;i++){
                if(nodes[i].id == ""){
                    nodes[i].graphic.element.remove();
                }
            }

            setInterval(function () {
                // chart.series[0].data[0].graphic.element.remove();
                // console.log(chart.series[0].data[0].graphic.element)
            }, 1000);
        }
    });
};
$('.rightTop button').click(function () {
    // init('contentSVG', [], 1);
    $('.loading').show();
    arrTypeC=[];
    arrTypeD=[];
    var array_data = [];
    var inp = $('.inp').val();
    var data = {
        content: inp,
        customDicEnable: true
    }
    $.ajax({
        url: '/information/platform/public/knowledge/industryUpDownExtract',
        data: data,
        dataType: 'json',
        success: function (res) {
            if (res.data.length!==0) {
                for(var j=0;j<res.data.length;j++){
                    if(res.data[j].result.length!==0){
                        typeB.push(res.data[j].result[0].upperIndustry);
                        array_data.push(['', res.data[j].result[0].upperIndustry]);
                        for (var i = 0; i < res.data[j].result.length; i++) {
                            arrTypeD.push(res.data[j].result[i].lowerIndustry);
                            array_data.push([res.data[j].result[i].upperIndustry, res.data[j].result[i].lowerIndustry]);
                        }
                    }

                }


            }
            getData2(array_data);
        }
    })
});


/**
 @description 获取第二个接口
 **/
function getData2(arr) {
    var array_data = [];
    var inp = $('.inp').val();
    var data = {
        content: inp,
    }
    $.ajax({
        url: '/information/platform/public/knowledge/industryStockExtract',
        data: data,
        dataType: 'json',
        success: function (res) {
            $('.loading').hide();
            for (var k = 0; k < res.data.length; k++) {
                var list = res.data[k].result;
                console.log(list);
                if (list && list[0] && list[0].stocks.length !== 0) {
                    for (var i = 0; i < list.length; i++) {
                        arr.push(["", list[i].industry]);
                        for (var j = 0; j < list[i].stocks.length; j++) {
                            arrTypeC.push(list[i].stocks[j]);
                            arr.push([list[i].industry, list[i].stocks[j]]);
                        }
                    }
                }
            }
            console.log(arr);
            var len = 0;
            for(var i=0;i<arr.length;i++){
                if(arr[i][0] == ""){
                    len ++;
                }
            }
            if(len == 1){
                for(var i=0;i<arr.length;i++){
                    if(arr[i][0] == ""){
                        arr.splice(i,1);
                    }
                }
                init('contentSVG', arr, arr[0][0]);
            }else{
                init('contentSVG', arr, '');
            }

        }
    })
}

