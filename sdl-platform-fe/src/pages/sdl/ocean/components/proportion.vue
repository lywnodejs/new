<template>
  <div id="ocean-department-proportion">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-chart">
            <div id="web-monthly-vul-type-proportion-chart" class="chart-content"></div>
            <div class="select-month">
              <el-select class="monthInput"
              v-model="selectedMonth"
              placeholder="请选择月份"
              @change="getWebMonthlyVulTypeProportion(selectedMonth, selectedvulType)">
                <el-option
                  v-for="item in availableMonths"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select class="monthInput"
              v-model="selectedvulType"
              placeholder="请选择月份"
              @change="getWebMonthlyVulTypeProportion(selectedMonth, selectedvulType)">
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
          webMonthlyVulTypeProportionChart: {},
          availableMonths: [],
          initMonth: '',
          selectedMonth: '',
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
        this.handleAvailableMonth()
        this.fetchData()
    },
    mounted() {
    },
    methods: {
      fetchData() {
          this.getWebMonthlyVulTypeProportion(this.selectedMonth, this.selectedvulType)
      },
      getWebMonthlyVulTypeProportion(month, vulType) {
        let param = {
          year_month_date: month,
          vul_type1_id: vulType,
          dept_id: this.deptId
        }
        this.getDepartmentMonthlyVulTypeProportion(param).then(res => {
          this.drawWebMonthlyVulTypeProportionChart(res)
        })
      },
      drawWebMonthlyVulTypeProportionChart(res) {
        let webMonthlyVulTypeProportionChart = echarts.init(document.getElementById('web-monthly-vul-type-proportion-chart'))
        let option = {
          color: ['#ADDE72', '#7CE0C3', '#5BC9F1', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: '月度漏洞类型占比',
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
            center: ['38%', '60%']
          }]
        }
        webMonthlyVulTypeProportionChart.setOption(option)
      },
      handleAvailableMonth() {
        let date = new Date()
        this.availableMonths = []
        let currentMonth = date.getMonth() + 1
        this.initMonth = currentMonth < 10 ? date.getFullYear() + '-' + '0' + currentMonth : date.getFullYear() + '-' + currentMonth
        this.selectedMonth = this.initMonth
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
      }
    }
  })
</script>

<style lang="less">
#ocean-department-proportion{
    .content-chart {
      background-color: #fff;
      min-height: 330px;
      margin: 11.5px 23px 0px 11.5px;
      position: relative;
      .chart-content {
        display: flex;
        width: auto;
        height: 320px;
      }
      .select-month {
        width: 205px;
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

