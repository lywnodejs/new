<template>
  <div id="ocean-baseline-monitor-chart">
       
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-chart">
            <div id="baseline-by-monitor" class="chart-content"></div>
          </div>
        </el-col>
      </el-row>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import echarts from '@/lib/echarts'
  import XLSX from 'xlsx'

  export default connect(() => {
    return {
    }
  }, {
    baselineMonitor: 'ocean_baseline/baselineMonitor'
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
          monitorInfo: {},
          finishInfo: {},
          data: [],
          excelData: []
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
          this.baselineMonitor(param).then(res => {
              this.monitorInfo = res
              let excelCutOffLine = [null, null, null, null]

              //  误报-项目信息填错率
              let monitorExcProjectInfoRate = this.monitorInfo.monitor_exc_project_info.numerator / this.monitorInfo.monitor_exc_project_info.denominator * 100
              let monitorExcProjectInfoRateInfo = this.decimalToPercent(monitorExcProjectInfoRate) + '（' + this.monitorInfo.monitor_exc_project_info.numerator + '/' + this.monitorInfo.monitor_exc_project_info.denominator + '）'
              let monitorExcProjectInfoIndex = this.monitorInfo.monitor_exc_project_info.index
              let monitorExcProjectInfoExcel = [['误报-项目信息填错率', `指标:${monitorExcProjectInfoIndex}`], ['Project ID', '是否提供外网访问', '目标用户', '业务调用方']]
              let monitorExcProjectInfoDetail = ''
              res.monitor_exc_project_info.info.forEach(element => {
                monitorExcProjectInfoDetail += `<br>PID：${element.sdl_project_id}/ 是否提供外网访问：${element.is_internet ? '是' : '否'}/ 目标用户：${element.target_user}/ 业务调用方：${element.service_invoker}`
                monitorExcProjectInfoExcel.push([element.sdl_project_id, element.is_internet ? '是' : '否', element.target_user, element.service_invoker])
              });

              //  误报-基线误报率
              let monitorUnapplicabilityBaselineRate = res.monitor_unapplicability_baseline.numerator / res.monitor_unapplicability_baseline.denominator * 100
              let monitorUnapplicabilityBaselineRateInfo = this.decimalToPercent(monitorUnapplicabilityBaselineRate) + '（' + this.monitorInfo.monitor_unapplicability_baseline.numerator + '/' + this.monitorInfo.monitor_unapplicability_baseline.denominator + '）'
              let monitorUnapplicabilityBaselineIndex = res.monitor_unapplicability_baseline.index
              let monitorUnapplicabilityBaselineExcel = [['误报-基线误报率', `指标:${monitorUnapplicabilityBaselineIndex}`], ['Project ID', '数量', '基线备注']]
              let monitorUnapplicabilityBaselineDetail = ''
              res.monitor_unapplicability_baseline.info.forEach(element => {
                monitorUnapplicabilityBaselineDetail += `<br>PID：${element.sdl_project_id}/ 数量：${element.count}/ 基线备注：${element.basline_remark.map(item => { return `${item.baseline_no}:${item.remark} ` })}`
                let arr = []
                arr.push(element.sdl_project_id, element.count)
                element.basline_remark.forEach(item => {
                  arr.push(`${item.baseline_no}:${item.remark};`)
                })
                monitorUnapplicabilityBaselineExcel.push(arr)
              });

              //  误报-白盒首轮错误率
              let monitorTestingInaccurateRate = res.monitor_testing_inaccurate.numerator / res.monitor_testing_inaccurate.denominator * 100
              let monitorTestingInaccurateRateInfo = this.decimalToPercent(monitorTestingInaccurateRate) + '（' + this.monitorInfo.monitor_testing_inaccurate.numerator + '/' + this.monitorInfo.monitor_testing_inaccurate.denominator + '）'
              let monitorTestingInaccurateIndex = res.monitor_testing_inaccurate.index
              let monitorTestingInaccurateExcel = [['误报-白盒首轮错误率', `指标:${monitorTestingInaccurateIndex}`], ['Project ID', '误报数', '检测轮次', '操作人', 'issue_primary_id', '基线备注']]
              let monitorTestingInaccurateDetail = ''
              res.monitor_testing_inaccurate.info.forEach(element => {
                let ctrData = JSON.parse(element.ctr_data)
                let remark = []
                if (ctrData.remark) {
                  let remarkKeys = Object.keys(ctrData.remark)
                  remarkKeys.forEach(item => {
                    remark.push({baseline_no: item, remark: ctrData.remark[item]})
                  })
                }
                let baselineRemark = ctrData.basline_remark || remark
                monitorTestingInaccurateDetail += `<br>PID：${ctrData.sdl_project_id}/ 误报数：${ctrData.count}/ 检测轮次：${ctrData.round}/ 操作人：${ctrData.source}/ 基线备注：${baselineRemark.map(item => { return `${item.baseline_no}:${item.remark} ` })}/ 问题ID：${ctrData.issue_primary_id_list}`
                let arr = []
                arr.push(ctrData.sdl_project_id, ctrData.count, ctrData.round, ctrData.source, ctrData.issue_primary_id_list.join(','))
                baselineRemark.forEach(item => {
                  arr.push(`${item.baseline_no}:${item.remark};`)
                })
                monitorTestingInaccurateExcel.push(arr)
              });

              //  异常-项目打包错误率
              let monitorBuildErrorRate = res.monitor_build_error.numerator / res.monitor_build_error.denominator * 100
              let monitorBuildErrorRateInfo = this.decimalToPercent(monitorBuildErrorRate) + '（' + this.monitorInfo.monitor_build_error.numerator + '/' + this.monitorInfo.monitor_build_error.denominator + '）'
              let monitorBuildErrorIndex = res.monitor_build_error.index
              let monitorBuildErrorExcel = [['异常-项目打包错误率', `指标:${monitorBuildErrorIndex}`], ['Project ID', 'fatbird_task_id']]
              let monitorBuildErrorDetail = ''
              res.monitor_build_error.info.forEach(element => {
                let ctrData = JSON.parse(element.ctr_data)
                monitorBuildErrorDetail += `<br>PID：${ctrData.sdl_project_id}/ fatbird_task_id：${ctrData.task_error_status ? ctrData.task_error_status.map(item => { return `${item.fatbird_task_id}:${item.status} ` }) : ctrData.fatbird_task_id}`
                let arr = []
                arr.push(ctrData.sdl_project_id)
                if (!ctrData.task_error_status) {
                  arr.push(ctrData.fatbird_task_id)
                } else {
                  ctrData.task_error_status.forEach(item => {
                    arr.push(`${item.fatbird_task_id}:${item.status}`)
                  })
                }
                monitorBuildErrorExcel.push(arr)
              });

              //  异常-项目扫描异常率
              let monitorTestExceptionRate = res.monitor_test_exception.numerator / res.monitor_test_exception.denominator * 100
              let monitorTestExceptionRateInfo = this.decimalToPercent(monitorTestExceptionRate) + '（' + this.monitorInfo.monitor_test_exception.numerator + '/' + this.monitorInfo.monitor_test_exception.denominator + '）'
              let monitorTestExceptionIndex = res.monitor_test_exception.index
              let monitorTestExceptionExcel = [['异常-项目扫描异常率', `指标:${monitorTestExceptionIndex}`], ['Project ID', 'fatbird_task_id']]
              let monitorTestExceptionDetail = ''
              res.monitor_test_exception.info.forEach(element => {
                let ctrData = JSON.parse(element.ctr_data)
                monitorTestExceptionDetail += `<br>PID：${ctrData.sdl_project_id}/ fatbird_task_id：${ctrData.task_error_status ? ctrData.task_error_status.map(item => { return `${item.fatbird_task_id}:${item.status} ` }) : ctrData.fatbird_task_id}`
                let arr = []
                arr.push(ctrData.sdl_project_id)
                if (!ctrData.task_error_status) {
                  arr.push(ctrData.fatbird_task_id)
                } else {
                  ctrData.task_error_status.forEach(item => {
                    arr.push(`${item.fatbird_task_id}:${item.status}`)
                  })
                }
                monitorTestExceptionExcel.push(arr)
              });

              //  异常-项目扫描轮次异常率
              let monitorRoundExceedLimitRate = res.monitor_round_exceed_limit.numerator / res.monitor_round_exceed_limit.denominator * 100
              let monitorRoundExceedLimitRateInfo = this.decimalToPercent(monitorRoundExceedLimitRate) + '（' + this.monitorInfo.monitor_round_exceed_limit.numerator + '/' + this.monitorInfo.monitor_round_exceed_limit.denominator + '）'
              let monitorRoundExceedLimitIndex = res.monitor_round_exceed_limit.index
              let monitorRoundExceedLimitExcel = [['异常-项目扫描轮次异常率', `指标:${monitorRoundExceedLimitIndex}`], ['Project ID', '扫描轮次']]
              let monitorRoundExceedLimitDetail = ''
              res.monitor_round_exceed_limit.info.forEach(element => {
                let ctrData = JSON.parse(element.ctr_data)
                monitorRoundExceedLimitDetail += `<br>PID：${ctrData.sdl_project_id}/ 扫描轮次：${ctrData.scan_round}`
                monitorRoundExceedLimitExcel.push([ctrData.sdl_project_id, ctrData.scan_round])
              });

              this.data = [
                ['误报-项目信息填错率', monitorExcProjectInfoRate, monitorExcProjectInfoRateInfo, monitorExcProjectInfoIndex, monitorExcProjectInfoDetail],
                ['误报-基线误报率', monitorUnapplicabilityBaselineRate, monitorUnapplicabilityBaselineRateInfo, monitorUnapplicabilityBaselineIndex, monitorUnapplicabilityBaselineDetail],
                ['误报-白盒首轮错误率', monitorTestingInaccurateRate, monitorTestingInaccurateRateInfo, monitorTestingInaccurateIndex, monitorTestingInaccurateDetail],
                ['异常-总异常率率', res.monitor_exec_total, this.decimalToPercent(res.monitor_exec_total)],
                ['异常-项目打包错误率', monitorBuildErrorRate, monitorBuildErrorRateInfo, monitorBuildErrorIndex, monitorBuildErrorDetail],
                ['异常-项目扫描异常率', monitorTestExceptionRate, monitorTestExceptionRateInfo, monitorTestExceptionIndex, monitorTestExceptionDetail],
                ['异常-项目扫描轮次异常率', monitorRoundExceedLimitRate, monitorRoundExceedLimitRateInfo, monitorRoundExceedLimitIndex, monitorRoundExceedLimitDetail]
              ]
              this.excelData = [[this.time[0], this.time[1]], excelCutOffLine,
                                ...monitorExcProjectInfoExcel, excelCutOffLine,
                                ...monitorUnapplicabilityBaselineExcel, excelCutOffLine,
                                ...monitorTestingInaccurateExcel, excelCutOffLine,
                                ...monitorBuildErrorExcel, excelCutOffLine,
                                ...monitorTestExceptionExcel, excelCutOffLine,
                                ...monitorRoundExceedLimitExcel]
              this.drawBaselineChart()
          })
      },
      decimalToPercent(val) {
        let percent = Number(val).toFixed(1)
        percent += '%'
        return percent
      },
      drawBaselineChart() {
        let that = this
        let baselineChart = echarts.init(document.getElementById('baseline-by-monitor'))
        let option = {
          color: ['#7CE0C3', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: '异常监控告警/%',
            left: 20,
            top: 20,
            textStyle: this.chartTitleStyle
          },
          tooltip: {
            trigger: 'axis',

            position: function(point, params, dom, rect, size) {
              if (dom.children[0].innerText === '误报-项目信息填错率' || dom.children[0].innerText === '误报-基线误报率' || dom.children[0].innerText === '误报-白盒首轮错误率') {
                return [10, 0]
              }
            },
            formatter: function(params) {
                let str = `<span class='title'>${params[0].data[0]}</span>：${params[0].data[2]}
                          ${params[0].data[4] ? params[0].data[4] : ''}`
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
                lang: ['数据视图', '关闭', '导出Excel'],
                optionToContent: function(opt) {

                  // console.log(opt)

                  let data = opt.dataset[0].source
                  let str = `<div class="content-header">异常监控告警：</div>
                    <div class="content"><span class="color3 point">• </span><span class="color3">误报-项目信息填错率：</span><span class="color3 ">${data[0][2]}  &nbsp;&nbsp; <span class='color1'>选错的项目数/总项目数</span></span></div>
                    <div class="content"><span class="color4 point">• </span>误报-基线误报率：<span class="color4 ">${data[1][2]}  &nbsp;&nbsp;<span class='color1'>(评估完成的项目)不需要的基线/总基线数</span></span></div>
                    <div class="content"><span class="color4 point">• </span>误报-白盒首轮错误率：<span class="color4 ">${data[2][2]}  &nbsp;&nbsp;<span class='color1'>检测不准数/检测出的问题总数</span></span></div><br>
                    <div class="content"><span class="color3 point">• </span><span class="color3">异常-总异常率率：</span><span class="color3 ">${data[3][2]}  &nbsp;&nbsp;<span class='color1'>(打包报错+扫描报错+扫描超3轮)去重后的项目数/白盒扫描完成项目总数</span></span></div>
                    <div class="content"><span class="color4 point">• </span>异常-项目打包错误率：<span class="color4 ">${data[4][2]}  &nbsp;&nbsp;<span class='color1'>打包报错的项目数/白盒扫描完成项目总数</span></span></div>
                    <div class="content"><span class="color4 point">• </span>异常-项目扫描异常率：<span class="color4 ">${data[5][2]}  &nbsp;&nbsp;<span class='color1'>扫描报错的项目数/白盒扫描完成项目总数</span></span></div>
                    <div class="content"><span class="color4 point">• </span>异常-项目扫描轮次异常率：<span class="color4 ">${data[6][2]}  &nbsp;&nbsp;<span class='color1'>扫描超3轮的项目数/白盒扫描完成项目总数</span></span></div>`
                  return str
                },
                contentToOption: function(Dom, opt) {
                  let filename = '异常详细信息.xlsx';
                  let data = that.excelData
                  let wsName = 'Sheet1';
                  let wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);
                  XLSX.utils.book_append_sheet(wb, ws, wsName);
                  XLSX.writeFile(wb, filename);
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
#ocean-baseline-monitor-chart{
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

