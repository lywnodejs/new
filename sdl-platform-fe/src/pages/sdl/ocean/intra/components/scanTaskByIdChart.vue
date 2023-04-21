<template>
  <div id="ocean-baseline-scanTaskByID-chart">
       
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-chart">
            <div id="baseline-by-projectid" class="chart-content"></div>
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
    baselineFinishById: 'ocean_baseline/baselineFinishById',
    baselineScanTaskById: 'ocean_baseline/baselineScanTaskById',
    baselineCheckIssueById: 'ocean_baseline/baselineCheckIssueById',
    baselineProcessTimeById: 'ocean_baseline/baselineProcessTimeById'
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
          scanTaskInfo: {},
          processTimeData: {},
          data: []
      }
    },
    props: ['projectID'],
    created() {
        this.fetchData()
    },
    mounted() {
    },

    watch: {
        projectID(val) {
            this.sdl_project_id = val
            this.fetchData()
        }
    },
    methods: {
      fetchData() {
          let param = {
            sdl_project_id: this.sdl_project_id
          }
          this.baselineScanTaskById(param).then(res => {
              this.scanTaskInfo = res.test_task
              this.data = [
                [
                    '扫描时间',
                    parseFloat(this.handleTimeByDay(this.scanTaskInfo.avg)),
                    parseFloat(this.handleTimeByDay(this.scanTaskInfo.max)),
                    parseFloat(this.handleTimeByDay(this.scanTaskInfo.min)),
                    [this.handleTime(this.scanTaskInfo.avg), this.handleTime(this.scanTaskInfo.max), this.handleTime(this.scanTaskInfo.min)]
                ]
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
        let min = (day * 24 * 60) + (parseInt(hour[0]) * 60) + parseInt(hour[1]) + (parseInt(hour[2]) / 60)
        return min
      },
      drawBaselineChart(res) {
        let baselineChart = echarts.init(document.getElementById('baseline-by-projectid'))
        let option = {
          color: ['#7CE0C3', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: 'fatbird扫描时间/分钟',
            left: 20,
            top: 20,
            textStyle: this.chartTitleStyle
          },
          tooltip: {
            trigger: 'axis',
                        formatter: function(params) {
                            let data = params[0].data[4]
                            let htm = `<div>fatbrid首轮扫描平均时间：${data[0]}</div>
                                        <div>fatbrid首轮扫描最大时间：${data[1]}</div>
                                        <div>fatbrid首轮扫描最少时间：${data[2]}</div>`
                            return htm
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

                  let data = opt.dataset[0].source[0]
                  let str = `<div class="content-header">fatbird首轮扫描时间：</div>
                    <div class="content"><span class="color1 point">• </span>平均时间：<span class="color1 ">${data[4][0]}</span></div>
                    <div class="content"><span class="color3 point">• </span>最大时间：<span class="color3 ">${data[4][1]}</span></div>
                    <div class="content"><span class="color2 point">• </span>最少时间：<span class="color2 ">${data[4][2]}</span></div>`
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
            },
            {
              type: 'bar',
              barWidth: 20
            },
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
#ocean-baseline-scanTaskByID-chart{
    .content-chart {
      background-color: #fff;
      min-height: 330px;
      margin: 11.5px 11.5px 0px 23px;
      position: relative;
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

