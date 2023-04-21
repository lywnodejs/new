<template>
  <div id="year-on-time-rate-of-fixed-of-r2-vul-list" >
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

//         data = [
//           ['部门名称', '修复率'],
// ['网约车平台公司', 0.4444444444444444],
// ['车主服务公司', 0.5555555555555556],
// ['云平台事业群', 0.6],
// ['金融事业部', 0.5],
// ['地图与公交事业部', 0],
// ['创意设计部', 1],
// ['安全产品技术部', 0],
// ['效能平台部', 0.2857142857142857],
// ['智慧交通事业部', 0.5],
// ['地方事务部', 1],
// ['数据科学与智能部', 1],
// ['R lab', 0.3333333333333333],
// ['AI Tech', 0.2],
// ['车载设备事业部', 0],
// ['普惠产品技术部', 0.4444444444444444],
// ['两轮车事业部', 0],
// ['企业级事业部', 0.4444444444444444]
//         ]

        if (data.length === 1) {
          data = [['部门名称', '修复率'], ['无', 0]]
        } else {
          let tempData = data.slice(1, data.length)
          tempData.sort(function(a, b) {
            return b[1] - a[1]
          })
          data = data.slice(0, 1).concat(tempData)
        }

          // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('year-on-time-rate-of-fixed-of-r2-vul-list'))

        // 指定图表的配置项和数据
        let option = {
          color: ['#4b82eb', '#c9c5da'],
          title: {
            text: '各业务线R2漏洞按时修复率/%',
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
                        label: {
                            formatter: (param) => {
                              if (param.data[1] === 1) return 100 + '%'
                              if (param.data[1] === 0) return 0 + '%'
                              return (param.data[1] * 100).toFixed(0) + '%'
                            },
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
#year-on-time-rate-of-fixed-of-r2-vul-list{
    padding-top: 100px;
    width: 100%;
    height: 460px;
    margin: 0 auto;
}
</style>

