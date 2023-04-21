<template>
  <div id="ocean-nps-evaluate-ocean">
       
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-chart">
            <div id="nps-evaluate-ocean" class="chart-content"></div>
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
    npsOcean: 'ocean_baseline/npsOcean'
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
          npsOceanInfo: {},
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
        let params = {
            start_day: this.time[0],
            end_day: this.time[1],
            index: 'nps_evaluate'
        }
        this.npsOcean(params).then(res => {
              this.npsOceanInfo = res
              this.data = [
                ['平均数', this.npsOceanInfo.avg, this.npsOceanInfo.avg],
                ['中位数', this.npsOceanInfo.median, this.npsOceanInfo.median],
                ['nps值', this.npsOceanInfo.nps, this.npsOceanInfo.nps],
                ['方差', this.npsOceanInfo.variance, this.npsOceanInfo.variance]
              ]
              this.drawBaselineChart()
          })
      },
      decimalToPercent(val) {
        let percent = Number(val).toFixed(1)
        percent += '%'
        return percent
      },
      drawBaselineChart() {
        let baselineChart = echarts.init(document.getElementById('nps-evaluate-ocean'))
        let option = {
          color: ['#7CE0C3', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: 'nps指标',
            left: 20,
            top: 20,
            textStyle: this.chartTitleStyle
          },
          tooltip: {
            trigger: 'axis',
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
                show: true,
                readOnly: false,
                optionToContent: function(opt) {

                  // console.log(opt)

                  let data = opt.dataset[0].source
                  let str = `<div class="content-header">nps指标：</div>
                    <div class="content"><span class="color3 point">• </span><span class="color3">平均数：</span><span class="color3 ">${data[0][2]}</span></div>
                    <div class="content"><span class="color4 point">• </span>中位数：<span class="color4 ">${data[1][2]}</span></div>
                    <div class="content"><span class="color4 point">• </span>nps值：<span class="color4 ">${data[2][2]}</span></div>
                    <div class="content"><span class="color4 point">• </span>方差：<span class="color4 ">${data[3][2]}</span></div>`
                  return str
                },
                contentToOption: function(Dom, opt) {

                  let data = opt.dataset[0].source
                  let str = `<div class="content-header">nps指标：</div>
                    <div class="content"><span class="color3 point">• </span><span class="color3">平均数：</span><span class="color3 ">${data[0][2]}</span></div>
                    <div class="content"><span class="color4 point">• </span>中位数：<span class="color4 ">${data[1][2]}</span></div>
                    <div class="content"><span class="color4 point">• </span>nps值：<span class="color4 ">${data[2][2]}</span></div><br>
                    <div class="content"><span class="color4 point">• </span>方差：<span class="color4 ">${data[3][2]}</span></div><br>`
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
#ocean-nps-evaluate-ocean{
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

