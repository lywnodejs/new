<template>
  <div id="department-coverage-rate">
       
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-chart">
            <div id="department-coverage-rate-chart" class="chart-content"></div>
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
    departmentCoverageRate: 'ocean_global/DepartmentCoverageRate'
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
          this.departmentCoverageRate({}).then(res => {
              res.forEach(item => {
                  this.data.push([item.dept_name, Number(item.department_coverage)])
              })
              this.data.sort((a, b) => {
                return b[1] - a[1]
              })

            //   this.data = [
            //     ['误报-项目信息填错率', monitorExcProjectInfoRate, monitorExcProjectInfoRateInfo, monitorExcProjectInfoIndex, monitorExcProjectInfoDetail],
            //     ['误报-基线误报率', monitorUnapplicabilityBaselineRate, monitorUnapplicabilityBaselineRateInfo, monitorUnapplicabilityBaselineIndex, monitorUnapplicabilityBaselineDetail],
            //     ['误报-白盒首轮错误率', monitorTestingInaccurateRate, monitorTestingInaccurateRateInfo, monitorTestingInaccurateIndex, monitorTestingInaccurateDetail],
            //     ['异常-总异常率率', res.monitor_exec_total, this.decimalToPercent(res.monitor_exec_total)],
            //     ['异常-项目打包错误率', monitorBuildErrorRate, monitorBuildErrorRateInfo, monitorBuildErrorIndex, monitorBuildErrorDetail],
            //     ['异常-项目扫描异常率', monitorTestExceptionRate, monitorTestExceptionRateInfo, monitorTestExceptionIndex, monitorTestExceptionDetail],
            //     ['异常-项目扫描轮次异常率', monitorRoundExceedLimitRate, monitorRoundExceedLimitRateInfo, monitorRoundExceedLimitIndex, monitorRoundExceedLimitDetail]
            //   ]
              this.drawBaselineChart()
          })
      },
      decimalToPercent(val) {
        let percent = Number(val).toFixed(1)
        percent += '%'
        return percent
      },
      drawBaselineChart() {
        let baselineChart = echarts.init(document.getElementById('department-coverage-rate-chart'))
        let option = {
          color: ['#7CE0C3', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: '部门公网域名覆盖率',
            left: 20,
            top: 20,
            textStyle: this.chartTitleStyle
          },
          tooltip: {
            trigger: 'axis',

            // position: function(point, params, dom, rect, size) {
            //   if (dom.children[0].innerText === '误报-项目信息填错率' || dom.children[0].innerText === '误报-基线误报率' || dom.children[0].innerText === '误报-白盒首轮错误率') {
            //     return [10, 0]
            //   }
            // },
            formatter: function(params) {
                let str = `<span class='title'>${params[0].data[0]}</span>：${params[0].data[1]}`
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
                show: true,
                readOnly: false,
                lang: ['数据视图', '关闭', '刷新'],

                optionToContent: function(opt) {

                  // console.log(opt)

                  let data = opt.dataset[0].source
                  let str = `<div class="content-header">部门公网域名覆盖率：</div>`
                  for (let i = 1; i < data.length; i++) {
                      str = str + `<div class="content"><span class="color3 point">• </span>${data[i][0]}：<span class="color3 ">${data[i][1]}</span></div>`
                  }

                //   str = `<div class="content-header">部门覆盖率：</div>
                //     <div class="content"><span class="color3 point">• </span>${data[0][0]}：<span class="color3 ">${data[0][1]}</span></div>
                //     <div class="content"><span class="color3 point">• </span>${data[1][0]}：<span class="color3 ">${data[1][1]}</span></div>
                //     <div class="content"><span class="color3 point">• </span>${data[2][0]}：<span class="color3 ">${data[2][1]}</span></div>
                //     <div class="content"><span class="color3 point">• </span>${data[3][0]}：<span class="color3 ">${data[3][1]}</span></div>
                //     <div class="content"><span class="color3 point">• </span>${data[4][0]}：<span class="color3 ">${data[4][1]}</span></div>
                //     <div class="content"><span class="color3 point">• </span>${data[6][0]}：<span class="color3 ">${data[6][1]}</span></div>`
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
            bottom: 70
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
#department-coverage-rate{
    .point {
          font-weight: bold;
    }
    .color1 {
        color: #73A6F7;
    }
    .color2 {
      color: #98e23e;
    }
    .color3 {
      color: #FF7B41;
    }
    .color4 {
      color: #E6A23C;
    }
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

