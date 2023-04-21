<template>
  <div id="ocean-baseline-baselineByTime-chart">
       
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-chart">
            <div id="baseline-by-baselineByTime" class="chart-content"></div>
            <!-- <div class="select-month">
                <el-input class="monthInput"
                        v-model="sdl_project_id"
                        placeholder="请输入项目ID"
                        clearable></el-input>
            </div> -->
          </div>
        </el-col>
      </el-row>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import echarts from '@/lib/echarts'

  export default connect(() => {
    return {
    }
  }, {
    baselineFinishByTime: 'ocean_baseline/baselineFinishByTime'
  })({
    data() {
      return {
          chartTitleStyle: {
            color: '#000',
            fontWeight: 'normal',
            fontSize: 12.5
          },
          vBarYAxisStyle: {
            axisLine: {
              show: false,
              lineStyle: {
                color: '#999999'
              },
              name: '小时'
            },
            splitLine: {
              lineStyle: {
                color: '#E4E4E4'
              }
            },
            axisTick: {show: false}
          },
          barToolbox: {
            align: 'right',
            y: 20,
            right: 20,
            itemSize: 11,
            feature: {
              dataView: {
                readOnly: true
              }
            }
          },
          sdl_project_id: this.projectID,
          finishInfo: {},
          checkIssueInfo: {},
          scanTaskInfo: {},
          processTimeData: {},
          data: []
      }
    },
    props: ['time'],
    created() {
        this.fetchData()
    },
    mounted() {
    },
    watch: {
        time(val) {
            this.fetchData()
        }
    },
    methods: {
      fetchData() {
          let param = {
            start_day: this.time[0],
            end_day: this.time[1]
          }
          this.baselineFinishByTime(param).then(res => {
              this.finishInfo = res
              this.data = [
                ['项目平均时长', parseFloat(this.handleTimeByDay(this.finishInfo.avg.all)), this.handleTime(this.finishInfo.avg.all)],
                ['A|B类平均时长', parseFloat(this.handleTimeByDay(this.finishInfo.avg.ab)), this.handleTime(this.finishInfo.avg.ab)],
                ['C|D类平均时长', parseFloat(this.handleTimeByDay(this.finishInfo.avg.cd)), this.handleTime(this.finishInfo.avg.cd)],
                ['最大时间', parseFloat(this.handleTimeByDay(this.finishInfo.max)), this.handleTime(this.finishInfo.max)],
                ['最少时间', parseFloat(this.handleTimeByDay(this.finishInfo.min)), this.handleTime(this.finishInfo.min)]
              ]
              this.drawBaselineChart()
          })
      },
      handleTime(time) {
          if (!time) {
              return '暂无数据'
          }
          let arr = time.split(' ')
          let arr1 = arr[1].split(':')
          let str = arr[0] + ' 天 ' + arr1[0] + ' 时 ' + arr1[1] + ' 分 ' + arr1[2] + ' 秒'
          return str
      },
      handleTimeByDay(time) {
        if (!time) {
            return 0
        }
        let day = parseInt(time.split(' ')[0])
        let hour = time.split(' ')[1].split(':')
        let hours = (day * 24) + parseInt(hour[0]) + (parseInt(hour[1]) / 60) + (parseInt(hour[2]) / 60 / 60)
        return hours
      },
      drawBaselineChart(res) {
        let baselineChart = echarts.init(document.getElementById('baseline-by-baselineByTime'))
        let option = {
          color: ['#7CE0C3', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: '项目完成时长/小时',
            left: 20,
            top: 20,
            textStyle: this.chartTitleStyle
          },
          tooltip: {
            trigger: 'axis',

            position: function(point, params, dom, rect, size) {
                return [100, 100]
            },
            formatter: function(params) {
              let str = params[0].data[0] + '：' + params[0].data[2]
              return str
            }
          },
          toolbox: {
            align: 'right',
            y: 20,
            right: 20,
            itemSize: 11,
            feature: {
              dataView: {
                readOnly: true,
                optionToContent: function(opt) {

                  let data = opt.dataset[0].source
                  let str = `<div class="content-header">项目完成时长：</div>
                    <div class="content"><span class="color1 point">• </span>所有项目平均时长：<span class="color1 ">${data[0][2]}</span></div>
                    <div class="content"><span class="color4 point">• </span>A|B类平均时长：<span class="color4 ">${data[1][2]}</span></div>
                    <div class="content"><span class="color4 point">• </span>C|D类平均时长：<span class="color4 ">${data[2][2]}</span></div>
                    <div class="content"><span class="color3 point">• </span>最大时长：<span class="color3 ">${data[3][2]}</span></div>
                    <div class="content"><span class="color2 point">• </span>最少时长：<span class="color2 ">${data[4][2]}</span></div>`
                  return str
                }
              }
            }
          },
          legend: {
            align: 'right',
            top: 65,
            right: 20,
            orient: 'vertical',
            itemGap: 10,
            data: ['时间'],
            textStyle: {
              color: '#999999',
              fontSize: 12
            }
          },
          dataset: {
            source: this.data
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
            bottom: 60
          },
          series: [
            {
              type: 'bar',
              barWidth: 20
            }
          ]
        }
        baselineChart.clear()
        baselineChart.setOption(option)
      }
    }
  })
</script>

<style lang="less">
#ocean-baseline-baselineByTime-chart{
    .content-chart {
      background-color: #fff;
      min-height: 340px;
      margin: 11.5px 11.5px 0px 23px;
      // position: relative;
      .chart-content {
        display: flex;
        width: auto;
        height: 320px;
      }
      .select-month {
        width: 100px;
        height: 30px;
        position: absolute;
        top: 18px;
        right: 60px;
        // background-color: orange;
        .monthInput {
          width: 100px;
          height: 28px;
          .el-input__inner {
            height: 28px;
            font-size: 12px;
          }
          .el-select__caret {
            font-size: 12px;
          }
        }
      }
    }
    .el-col {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .el-row {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    .el-form-item__label{
        color: white;
        width: 60px;
    }
}
</style>

