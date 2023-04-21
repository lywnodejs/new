<template>
  <div id="ocean-department-statistics">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-chart">
            <div id="web-monthly-vul-statistic-by-department-chart" class="chart-content"></div>
            <div class="select-month">
              <el-select class="monthInput"
              v-model="selectedvulType"
              placeholder="请选择月份"
              @change="getWebMonthlyVulStatisticByDepartment(selectedvulType)">
                <el-option
                  v-for="item in vulType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
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
    getDepartmentMonthlyVulStatistic: 'ocean_department/getDepartmentMonthlyVulStatistic',
    getDepartmentMonthlyVulTypeProportion: 'ocean_department/getDepartmentMonthlyVulTypeProportion'
  })({
    data() {
      return {
          vulType: [{label: 'Web漏洞', value: 1001}, {label: '移动端漏洞', value: 1003}],
          selectedvulType: 1001,
          webMonthlyVulStatisticByDepartment: {},
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
              }
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
          }
      }
    },
    props: ['deptId'],
    created() {
        this.fetchData()
    },
    mounted() {
    },
    methods: {
      fetchData() {
          this.getWebMonthlyVulStatisticByDepartment(this.selectedvulType)
      },
      getWebMonthlyVulStatisticByDepartment(selectedvulType) {
        let param = {
          dept_id: this.deptId,
          vul_type1_id: selectedvulType
        }
        this.getDepartmentMonthlyVulStatistic(param).then(res => {
          this.drawWebMonthlyVulStatisticByDepartmentChart(res)
        })
      },
      drawWebMonthlyVulStatisticByDepartmentChart(res) {
        let webMonthlyVulStatisticByDepartmentChart = echarts.init(document.getElementById('web-monthly-vul-statistic-by-department-chart'))
        let option = {
          color: ['#7CE0C3', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: '月度漏洞数量统计',
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
            source: res
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
              barWidth: 20,
              stack: 'a'
            },
            {
              type: 'bar',
              barWidth: 20,
              stack: 'a'
            }
          ]
        }
        webMonthlyVulStatisticByDepartmentChart.setOption(option)
      }
    }
  })
</script>

<style lang="less">
#ocean-department-statistics{
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

