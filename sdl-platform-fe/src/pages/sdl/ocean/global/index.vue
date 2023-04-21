<template>
  <div id="global">
    <div class="content">
      <global-statistic></global-statistic>
      <department-coverage-rate></department-coverage-rate>
      <web-monthly-vul-statistic></web-monthly-vul-statistic>
      <!-- <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-chart">
            <div id="web-monthly-vul-statistic-by-department-chart" class="chart-content"></div>
            <div class="select-month">
              <el-select class="monthInput"
              v-model="selectedMonth1"
              placeholder="请选择月份"
              @change="getWebMonthlyVulStatisticByDepartment(selectedMonth1)">
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
      </el-row> -->
      <!-- <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-chart">
            <div id="web-monthly-vul-type-proportion-chart" class="chart-content"></div>
            <div class="select-month">
              <el-select class="monthInput"
              v-model="selectedMonth2"
              placeholder="请选择月份"
              @change="getWebMonthlyVulTypeProportion(selectedMonth2)">
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
      </el-row> -->
      <web-monthly-vul-proportion>
        <template #SDKCoverChart>
          <sdkCoverChart />
        </template>

      </web-monthly-vul-proportion>
      <mobile-monthly-vul></mobile-monthly-vul>
      <!-- <el-row :gutter="20">
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
      </el-row> -->
    </div>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import echarts from '@/lib/echarts'
  import globalStatistic from './components/globalStatistic'
  import departmentCoverageRate from './components/departmentCoverageRate'
  import mobileMonthlyVul from './components/mobileMonthlyVul'
  import webMonthlyVulProportion from './components/webMonthlyVulProportion'
  import webMonthlyVulStatistic from './components/webMonthlyVulStatistic'
  import sdkCoverChart from './components/sdkCoverChart';

  export default connect(() => {
    return {
      monthlyVulStatisticByDepartment: 'ocean_global/monthlyVulStatisticByDepartment',
      monthlyVulTypeProportion: 'ocean_global/monthlyVulTypeProportion'
    }
  }, {
      getMonthlyVulStatisticByDepartment: 'ocean_global/getMonthlyVulStatisticByDepartment',
      getMonthlyVulTypeProportion: 'ocean_global/getMonthlyVulTypeProportion',
      globalVulFixRate: 'ocean_global/globalVulFixRate'
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

      // this.fetchData()
    },
    components: {globalStatistic, departmentCoverageRate, mobileMonthlyVul, webMonthlyVulProportion, webMonthlyVulStatistic, sdkCoverChart},
    methods: {
      fetchData() {
        this.getWebMonthlyVulStatisticByDepartment(this.initMonth)
        this.getWebMonthlyVulTypeProportion(this.initMonth)
        this.getMobileMonthlyVulStatisticByDepartment(this.initMonth)
        this.getMobileMonthlyVulTypeProportion(this.initMonth)
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
      getWebMonthlyVulTypeProportion(month) {
        let param = {
          'year_month_date': month,
          'vul_type1_id': 1001
        }
        this.getMonthlyVulTypeProportion(param).then(res => {
          this.drawWebMonthlyVulTypeProportionChart(res)
        })
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
          date.getFullYear() + '-' + currentMonth
        }
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

      // calculateSum(val) {
      //   let sum = 0
      //   for (let i = 1; i < val.length; i++) {
      //     sum = val[i][1] + val[i][2]
      //     this.vulSumByDepartment[val[i][0]] = sum
      //   }
      //   console.log(this.vulSumByDepartment)
      //   console.log(this.vulSumByDepartment['IBT'])
      // },

      // compareDepartmentName(val) {

      //   // for(let i = 0; i < this.vulSumByDepartment.length; i++) {
      //   //   if(val == this.vulSumByDepartment[i]) {
      //   //     return vulSumByDepartment
      //   //   }
      //   // }
      //   console.log(val)

      //   // return this.vulSumByDepartment[val.name]
      // },
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

              // {
              //   name: '总数',
              //   type: 'bar',
              //   stack: 'a',
              //   label: {
              //     normal: {
              //       show: true,
              //       position: 'top',
              //       textStyle: {
              //         color: '#666'
              //       },
              //       formatter: {}

              //       // function(value) {
              //       //   return this.compareDepartmentName(value)
              //       // }
              //     }
              //   },
              //   data: [['网约车平台公司', 0], ['车主服务公司', 0]]
              // }
          ]
        }

        // let series = option['series']
        // let compareDepartmentName = function(param) {

        //   // console.log(param.name)
        //   console.log(that.vulSumByDepartment)
        //   console.log(JSON.stringify(that.vulSumByDepartment))
        //   return that.vulSumByDepartment[param.name]
        // }
        // series[series.length - 1]['label']['normal']['formatter'] = compareDepartmentName

        // window.addEventListener('resize', function() {
        //   monthlyVulStatisticByDepartmentChart.resize()
        // }
        webMonthlyVulStatisticByDepartmentChart.setOption(option)
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
<style lang="less">
#global {
  .content {
    width: auto;
    box-sizing: border-box;
    // background: white;
    margin: 11.5px;
    // padding: 20px;
    // margin-top: -15px;
    // padding-right: -20px;
    -webkit-font-smoothing: antialiased;
    .block {
      margin: 23px 11.5px 11.5px 11.5px;
      // background: #fff;
      // padding: 23px;
      display: flex;
      .statistic-box {
        color: #333;
        // border: 1px solid #E4E4E4;
        height: 150px;
        background-color: white;
        // box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        .box-header {
          padding: 15px 23px;
          font-size: 12.5px;
          font-style: normal;
          // border-bottom: 1px solid #E4E4E4;
        }
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
        .box-content {
          padding: 3px 23px;
          // margin-left: 40%;
          text-align: center;
          font-size: 30px;
          .popover-btn{
            border: none;
            // color:  #7CE0C3;
            font-size: 45px;
            // font-weight: bold;
          }
          // .el-button:hover {
          //   background-color: none;
          // }
          // .el-button:focus {
          //   background-color: none;
          // }
          .el-button:hover {
            background: none;
          }
          .el-button:focus {
            background: none;
          }
        }
      }
    }
    .content-chart {
      background-color: #fff;
      min-height: 330px;
      margin: 11.5px;
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
  }
}
</style>
<style lang="less">
.el-popover.statisticDetail{
  padding: 15px 15px;
  min-width: 250px;
  line-height: 20px;
  font-size: 12.5px;
  // background-color: rgba(230,230,230,0.7);
  background-color: rgba(50,50,50,0.8);
  color: #fff;
  border-radius: 4px;
  border: none;
  p {
    opacity: 0.7
  }
  // height: 200px;
  // overflow: auto;
  // position: absolute;
  // top: 80px !important;
  .highLightNum {
    opacity: 1;
    color: white;
  }
  .popper__arrow {
    border: none;
  }
  .popper__arrow:after{
    border-right-color: rgba(50,50,50,0.7);
    border-left-color: rgba(50,50,50,0.7);
  }
}
</style>

