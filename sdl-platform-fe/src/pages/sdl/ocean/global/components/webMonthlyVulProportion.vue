<template>
  <div id="web-monthly-vul-type-proportion">
    <el-row :gutter="20">
        <el-col :span="12">
          <div class="content-chart">
            <div id="web-monthly-vul-type-proportion-chart" class="chart-content"></div>
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
        <slot name="SDKCoverChart"></slot>
    </el-row>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import echarts from '@/lib/echarts'
  import * as CONSTANTS from '@/commons/ocean'

  export default connect(() => {
    return {
      monthlyVulTypeProportion: 'ocean_global/monthlyVulTypeProportion'
    }
  }, {
      getMonthlyVulTypeProportion: 'ocean_global/getMonthlyVulTypeProportion'
  })({
    data() {
      return {
        years: CONSTANTS.years,
        months: CONSTANTS.months,
        year: '2020',
        month: '06',
        webMonthlyVulTypeProportion: {},
        mobileMonthlyVulTypeProportion: {},
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
        this.getWebMonthlyVulTypeProportion(`${this.year}-${this.month}`)
      },
      getWebMonthlyVulTypeProportion(month) {
        let param = {
          'year_month_date': month,
          'vul_type1_id': 1001
        }
        this.getMonthlyVulTypeProportion(param).then(res => {
          this.drawWebMonthlyVulTypeProportionChart(res)
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
              this.getWebMonthlyVulTypeProportion(`${year}-${this.month}`)
          } else {
              this.months = CONSTANTS.months
              this.getWebMonthlyVulTypeProportion(`${year}-${this.month}`)
          }
      },
      changeMonth(month) {
          this.getWebMonthlyVulTypeProportion(`${this.year}-${month}`)
      },
      drawWebMonthlyVulTypeProportionChart(res) {
        let webMonthlyVulTypeProportionChart = echarts.init(document.getElementById('web-monthly-vul-type-proportion-chart'))
        let option = {
          color: ['#ADDE72', '#7CE0C3', '#5BC9F1', '#9DC5F3', '#73A6F7', '#2665B4'],

          // color: ['#2665B4', '#7CE0C3', '#73A6F7', '#4486F7', '#93B2DA', '#5BC9F1', '#ADDE72', '#BBBBBB'],
          title: {
            text: '月度Web漏洞类型占比',
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
      }
    }
  })
</script>
<style lang="less">
#web-monthly-vul-type-proportion{
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
