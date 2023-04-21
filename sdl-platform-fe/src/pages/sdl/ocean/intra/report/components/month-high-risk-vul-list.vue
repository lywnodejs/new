<template>
  <div id="month-high-risk-vul-list" >
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import echarts from '@/lib/echarts'

  export default connect(() => {
    return {
    }
  }, {
  })({
    data() {
      return {
        chartData: [],
        chartTitleStyle: {
          color: '#000',
          fontWeight: 'normal',
          fontSize: 13
        },
        vBarYAxisStyle: {
          axisLine: {
            show: false,
            lineStyle: {
              color: '#999999'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#E4E4E4'
            }
          },
          axisTick: {show: false}
        },
        legendStyle: {
          align: 'right',
          top: 65,
          right: 20,
          orient: 'vertical',
          itemGap: 10,

          // width: 20,
          textStyle: {

            color: '#999999',
            fontSize: 12
          }
        },
        barToolbox: {
          align: 'right',
          y: 20,
          right: 20,
          itemSize: 11
        }
      }
    },
    components: {},
    created() {

      // this.fetchData()
    },
    mounted() {
        this.drawChat(this.chartData)
    },
    props: ['data'],
    watch: {
        data(val) {
            this.chartData = val
            this.drawChat(this.chartData)
        }
    },
    methods: {
      fetchData() {
      },
      drawChat(data) {
        if (data.length === 1) {
          data = [['部门名称', '数量'], ['无', 0]]
        } else {
          let tempData = data.slice(1, data.length)
          tempData.sort(function(a, b) {
            return b[1] - a[1]
          })
          data = data.slice(0, 1).concat(tempData)
        }

          // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('month-high-risk-vul-list'))

        // 指定图表的配置项和数据
        let option = {
          color: ['#7CE0C3', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: '接受风险上线的基线数量/个',
            left: 20,
            top: 20,
            textStyle: this.chartTitleStyle
          },
          tooltip: {
            trigger: 'axis'
          },
          toolbox: this.barToolbox,
          legend: {
            align: 'right',
            top: 65,
            right: 20,
            orient: 'vertical',
            itemGap: 10,
            data: ['修复率'],
            textStyle: {
              color: '#999999',
              fontSize: 12
            }
          },
          dataset: {
            source: data
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              rotate: 45,
              formatter: function(value, index) {
                let v = value.substring(0, 29) + '...'
                return value.length > 30 ? v : value
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#999999'
              }
            },
            axisTick: {show: false}
          },
          yAxis: this.vBarYAxisStyle,
          grid: {
            left: 100,
            right: 135,
            top: 70,
            bottom: 80
          },
          series: [{
              type: 'bar',
              barWidth: 20,
              stack: 'a',
              itemStyle: {
                    normal: {
                        color: '#496cd6',
                        label: {
                            formatter: '{@[1]}',
                            show: true,
                            position: 'top',
                            textStyle: {
                            fontWeight: 'bolder',
                            fontSize: '12',
                            color: 'rgb(186, 186, 186)'
                            }
                        }
                    }
              }
          }]
        }

        // 使用刚指定的配置项和数据显示图表。
        myChart.clear()
        myChart.setOption(option);
      }
    }
  })
</script>

<style lang="less">
#month-high-risk-vul-list{
    padding-top: 100px;
    width: 100%;
    height:460px;
    margin: 0 auto;
}
</style>

