<template>
  <div>
    <el-row :gutter="20">
        <el-col :span="12">
          <div class="content-chart">
            <div id="mobile-monthly-vul-statistic-by-department-chart" class="chart-content"></div>
            <div class="select-month">
              <el-select class="monthInput"
              v-model="selectedMonth3"
              placeholder="请选择月份"
              @change="getMobileMonthlyVulStatisticByDepartment(selectedMonth3)">
                <el-option
                  v-for="item in availableMonths"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="content-chart">
            <div id="mobile-monthly-vul-type-proportion-chart" class="chart-content"></div><div class="select-month">
              <el-select class="monthInput"
              v-model="selectedMonth4"
              placeholder="请选择月份"
              @change="getMobileMonthlyVulTypeProportion(selectedMonth4)">
                <el-option
                  v-for="item in availableMonths"
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
      getMonthlyVulStatisticByDepartment: 'ocean_global/getMonthlyVulStatisticByDepartment',
      getMonthlyVulTypeProportion: 'ocean_global/getMonthlyVulTypeProportion'
  })({
    data() {
      return {
        availableMonths: [],
        initMonth: '',
        selectedMonth1: '',
        selectedMonth2: '',
        selectedMonth3: '',
        selectedMonth4: '',
        vulSumByDepartment: {},
        webMonthlyVulStatisticByDepartment: {},
        webMonthlyVulTypeProportion: {},
        mobileMonthlyVulStatisticByDepartment: {},
        mobileMonthlyVulTypeProportion: {},
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
      this.handleAvailableMonth()
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.getMobileMonthlyVulStatisticByDepartment(this.initMonth)
        this.getMobileMonthlyVulTypeProportion(this.initMonth)
      },
      getMobileMonthlyVulStatisticByDepartment(month) {
        let param = {
          'year_month_date': month,
          'vul_type1_id': 1003
        }
        this.getMonthlyVulStatisticByDepartment(param).then(res => {
          this.drawMobileMonthlyVulStatisticByDepartmentChart(res)
        })
      },
      getMobileMonthlyVulTypeProportion(month) {
        let param = {
          'year_month_date': month,
          'vul_type1_id': 1003
        }
        this.getMonthlyVulTypeProportion(param).then(res => {
          this.drawMobileMonthlyVulTypeProportionChart(res)
        })
      },
      handleAvailableMonth() {
        let date = new Date()
        this.availableMonths = []
        let currentMonth = date.getMonth()
        if (currentMonth === 0) {
          this.initMonth = date.getFullYear() - 1 + '-' + '12'
        } else if (currentMonth < 10) {
          this.initMonth = date.getFullYear() + '-' + '0' + currentMonth
        } else {
          this.initMonth = date.getFullYear() + '-' + currentMonth
        }
        console.log(this.initMonth)
        this.selectedMonth1 = this.initMonth
        this.selectedMonth2 = this.initMonth
        this.selectedMonth3 = this.initMonth
        this.selectedMonth4 = this.initMonth
        for (let i = 0; i < 6; i++) {
          let month = ''
          if (currentMonth - i > 0) {
            if (currentMonth - i < 10) {
              month = date.getFullYear() + '-' + '0' + (currentMonth - i)
            } else {
              month = date.getFullYear() + '-' + (currentMonth - i)
            }
          } else {
            if (12 - (i - currentMonth) < 10) {
              month = (date.getFullYear() - 1) + '-' + '0' + (12 - (i - currentMonth))
            } else {
              month = (date.getFullYear() - 1) + '-' + (12 - (i - currentMonth))
            }
          }
          let monthJson = {
            value: month,
            label: month
          }
          this.availableMonths.push(monthJson)
        }
      },
      drawMobileMonthlyVulStatisticByDepartmentChart(res) {
        let mobileMonthlyVulStatisticByDepartmentChart = echarts.init(document.getElementById('mobile-monthly-vul-statistic-by-department-chart'))
        let option = {
          color: ['#7CE0C3', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: '月度移动端漏洞业务线统计',
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
            left: 80,
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
        mobileMonthlyVulStatisticByDepartmentChart.setOption(option)
      },
      drawMobileMonthlyVulTypeProportionChart(res) {
        let mobileMonthlyVulTypeProportionChart = echarts.init(document.getElementById('mobile-monthly-vul-type-proportion-chart'))
        let option = {
          color: ['#ADDE72', '#7CE0C3', '#5BC9F1', '#9DC5F3', '#73A6F7', '#2665B4'],

          // color: ['#2665B4', '#7CE0C3', '#73A6F7', '#4486F7', '#93B2DA', '#5BC9F1', '#ADDE72', '#BBBBBB'],
          title: {
            text: '月度移动端漏洞类型占比',
            left: 20,
            top: 20,
            textStyle: this.chartTitleStyle
          },
          legend: {
            align: 'right',
            top: 65,
            right: 20,
            orient: 'vertical',
            itemGap: 10,
            textStyle: {
              color: '#999999',
              fontSize: 12
            }
          },
          toolbox: this.barToolbox,
          tooltip: {
            trigger: 'item',
            formatter: function(value) {
              return value.marker + value.name + ':  ' + value.value[1] + ' (' + value.percent + '%) ';
            }
          },
          dataset: {
            source: res
          },
          series: [{
            type: 'pie',
            radius: ['48%', '62%'],
            center: ['40%', '58%']
          }]
        }
        mobileMonthlyVulTypeProportionChart.setOption(option)
      }
    }
  })
</script>
