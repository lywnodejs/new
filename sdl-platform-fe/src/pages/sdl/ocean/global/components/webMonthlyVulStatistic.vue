<template>
  <div id="web-monthly-vul-statistic-by-department">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-chart">
            <div id="web-monthly-vul-statistic-by-department-chart" class="chart-content"></div>
            <div class="select-month">
              <el-select class="yearInput"
                    v-model="year"
                    placeholder="请选择月份"
                    @change="changeYear(year)">
                        <el-option
                            v-for="item in years"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                </el-select>
                <el-select class="monthInput"
                    v-model="month"
                    placeholder="请选择月份"
                    @change="changeMonth(month)">
                        <el-option
                            v-for="item in months"
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
  import * as CONSTANTS from '@/commons/ocean'

  export default connect(() => {
    return {
      monthlyVulStatisticByDepartment: 'ocean_global/monthlyVulStatisticByDepartment'
    }
  }, {
      getMonthlyVulStatisticByDepartment: 'ocean_global/getMonthlyVulStatisticByDepartment'
  })({
    data() {
      return {
        years: CONSTANTS.years,
        months: CONSTANTS.months,
        year: '2020',
        month: '06',
        vulSumByDepartment: {},
        webMonthlyVulStatisticByDepartment: {},
        vulFixRate: {},
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
          itemSize: 11,
          feature: {
            dataView: {}

            // magicType: {type: ['bar', 'pie', 'line']},
            // restore: {},
            // saveAsImage: {}
          }
        }
      }
    },
    created() {
      this.initMonth()
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.getWebMonthlyVulStatisticByDepartment(`${this.year}-${this.month}`)
      },
      getWebMonthlyVulStatisticByDepartment(month) {
        let param = {
          'year_month_date': month,
          'vul_type1_id': 1001
        }
        this.getMonthlyVulStatisticByDepartment(param).then(res => {
          this.drawWebMonthlyVulStatisticByDepartmentChart(res)
        })
      },
      initMonth() {
          let date = new Date()
          this.year = date.getFullYear()
          if (this.year == '2020') {
              let currentMonth = date.getMonth()
              this.months = this.months.slice(0, currentMonth + 1)
              this.month = this.months[currentMonth].value
          }
          if (date.getMonth() < 10) {
              this.month = '0' + (date.getMonth() + 1)
          } else {
              this.month = date.getMonth() + 1
          }
      },
      changeYear(year) {
          if (year == '2020') {
              let date = new Date()
              let currentMonth = date.getMonth()
              this.months = this.months.slice(0, currentMonth + 1)
              this.month = this.months[currentMonth].value
              this.getWebMonthlyVulStatisticByDepartment(`${year}-${this.month}`)
          } else {
              this.months = CONSTANTS.months
              this.getWebMonthlyVulStatisticByDepartment(`${year}-${this.month}`)
          }
      },
      changeMonth(month) {
          this.getWebMonthlyVulStatisticByDepartment(`${this.year}-${month}`)
      },
      drawWebMonthlyVulStatisticByDepartmentChart(res) {
        let webMonthlyVulStatisticByDepartmentChart = echarts.init(document.getElementById('web-monthly-vul-statistic-by-department-chart'))
        let option = {
          color: ['#7CE0C3', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: '月度Web漏洞业务线统计',
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
            bottom: 80
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
#web-monthly-vul-statistic-by-department{
    position: relative;
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
    .yearInput {
        width: 100px;
        height: 28px;
        position: absolute;
        right: 110px;
        .el-input__inner {
            height: 28px;
            font-size: 12px;
        }
        .el-select__caret {
            font-size: 12px;
        }
    }
}

</style>
