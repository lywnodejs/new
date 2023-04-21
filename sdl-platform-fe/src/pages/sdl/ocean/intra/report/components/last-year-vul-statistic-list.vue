<template>
  <div id="last-year-vul-statistic-list" >
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

          // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('last-year-vul-statistic-list'))

        // let that = this
        let option = {
          color: ['#4b82eb', '#c9c5da'],
          title: {
            text: '月度Web漏洞业务线统计/个',
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
            data: ['SDL发现', '线上发现'],
            textStyle: {
              color: '#999999',
              fontSize: 12
            }
          },
          dataset: {

            // source: this.monthlyVulStatisticByDepartment
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
          series: [
            {
              type: 'bar',
              barWidth: 20,
              stack: 'a',
              itemStyle: {
                normal: {
                  label: {
                    formatter: (param) => { return param.data[1] + param.data[2] },
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
            },
            {
              type: 'bar',
              barWidth: 20,
              stack: 'a'
            }

              // {
              //   name: '总数',
              //   type: 'bar',
              //   stack: 'a',
              //   label: {
              //     normal: {
              //       show: true,
              //       position: 'top',
              //       textStyle: {
              //         color: '#666'
              //       },
              //       formatter: {}

              //       // function(value) {
              //       //   return this.compareDepartmentName(value)
              //       // }
              //     }
              //   },
              //   data: [['网约车平台公司', 0], ['车主服务公司', 0]]
              // }
          ]
        }

        // 使用刚指定的配置项和数据显示图表。
        myChart.clear()
        myChart.setOption(option);
      }
    }
  })
</script>

<style lang="less">
#last-year-vul-statistic-list{
    padding-top: 100px;
    width: 100%;
    height: 460px;
    margin: 0 auto;
}
</style>

