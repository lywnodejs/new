<template>
  <div id="ocean-baseline-checkIssueTime-chart">
       
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-chart">
            <div id="baseline-by-checkIssueTime" class="chart-content"></div>
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
  import XLSX from 'xlsx'

  export default connect(() => {
    return {
    }
  }, {
    baselineCheckIssueByTime: 'ocean_baseline/baselineCheckIssueByTime'
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
          sdl_project_id: this.projectID,
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
          this.baselineCheckIssueByTime(param).then(res => {
              this.checkIssueInfo = res
              this.data = [
                  ['项目的平均时间', parseFloat(this.handleTimeByDay(this.checkIssueInfo.avg.all)), this.handleTime(this.checkIssueInfo.avg.all)],
                  ['A|B类平均时间', parseFloat(this.handleTimeByDay(this.checkIssueInfo.avg.ab.avg)), this.handleTime(this.checkIssueInfo.avg.ab.avg), this.checkIssueInfo.avg.ab.project_info],
                  ['C|D类平均时间', parseFloat(this.handleTimeByDay(this.checkIssueInfo.avg.cd.avg)), this.handleTime(this.checkIssueInfo.avg.cd.avg), this.checkIssueInfo.avg.cd.project_info],
                  ['最大时间', parseFloat(this.handleTimeByDay(this.checkIssueInfo.max)), this.handleTime(this.checkIssueInfo.max)],
                  ['最少时间', parseFloat(this.handleTimeByDay(this.checkIssueInfo.min)), this.handleTime(this.checkIssueInfo.min)]
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
        let that = this
        let baselineChart = echarts.init(document.getElementById('baseline-by-checkIssueTime'))
        let option = {
          color: ['#7CE0C3', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: '首轮人工审计时长/小时',
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
                readOnly: false,
                lang: ['数据视图', '关闭', '导出Excel'],
                contentToOption: function(Dom, opt) {
                  let filename = 'A|B|C|D类详细信息.xlsx';
                  let data = [[that.time[0], that.time[1]], ['项目ID', '项目等级', '首轮审计时长', '安全工程师']];
                  let abData = opt.dataset[0].source[1][3];
                  abData.forEach(element => {
                    data.push([element.sdl_project_id, element.project_level, element.time, element.sdl_engineer])
                  });
                  data.push([null, null, null, null], ['项目ID', '项目等级', '首轮审计时长', '安全工程师'])
                  let cdData = opt.dataset[0].source[2][3];
                  cdData.forEach(element => {
                    data.push([element.sdl_project_id, element.project_level, element.time, element.sdl_engineer])
                  });
                  let wsName = 'Sheet1';
                  let wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);
                  XLSX.utils.book_append_sheet(wb, ws, wsName);
                  XLSX.writeFile(wb, filename);
                },
                optionToContent: function(opt) {

                  let data = opt.dataset[0].source
                  let str = `<div class="content-header">首轮人工审计时长：</div>
                    <div class="content"><span class="color1 point">• </span>所有项目平均时长：<span class="color1 ">${data[0][2]}</span></div>
                    <div class="content"><span class="color4 point">• </span>A|B类平均时长：<span class="color4 ">${data[1][2]}</span></div>
                    <div class="content"><span class="color4 point">• </span>C|D类平均时长：<span class="color4 ">${data[2][2]}</span></div>
                    <div class="content"><span class="color3 point">• </span>最大时长：<span class="color3 ">${data[3][2]}</span></div>
                    <div class="content"><span class="color2 point">• </span>最少时长：<span class="color2 ">${data[4][2]}</span></div>`

                    // ab类项目详细信息
                    let abData = data[1][3];
                    let tdHeaders = '<td>项目ID</td><td>项目等级</td><td>审计时间</td><td>工程师</td>'
                    let table = `<br>ab类时长详细信息：(总计${abData.length}个)<br><div class="table-c"><table style="text-align:center;"><tbody><tr>${tdHeaders}</tr>`
                    let tdBodys = '';
                    for (let i = 0; i < abData.length; i++) {
                      tdBodys += `<tr><td>${abData[i].sdl_project_id}</td><td>${abData[i].project_level}</td><td>${abData[i].time}</td><td>${abData[i].sdl_engineer}</td></tr>`
                      table += tdBodys;
                      tdBodys = '';
                    }
                    table += '</tbody></table></div>';

                    //  cd类项目信息
                    let cdData = data[2][3];
                    let tdHeaders1 = '<td>项目ID</td><td>项目等级</td><td>审计时间</td><td>工程师</td>'
                    let table1 = `<br>cd类时长详细信息：(总计${cdData.length}个)<br><div class="table-c"><table style="text-align:center;"><tbody><tr>${tdHeaders1}</tr>`
                    let tdBodys1 = '';
                    for (let i = 0; i < cdData.length; i++) {
                      tdBodys1 += `<tr><td>${cdData[i].sdl_project_id}</td><td>${cdData[i].project_level}</td><td>${cdData[i].time}</td><td>${cdData[i].sdl_engineer}</td></tr>`
                      table1 += tdBodys1;
                      tdBodys1 = '';
                    }
                    table1 += '</tbody></table></div>';
                  return str + table + table1
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
#ocean-baseline-checkIssueTime-chart{
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
.table-c table{border-right:1px solid black;border-bottom:1px solid black} 
.table-c table td{border-left:1px solid black;border-top:1px solid black} 
// .table-c table td{border:1px solid black} 
</style>
