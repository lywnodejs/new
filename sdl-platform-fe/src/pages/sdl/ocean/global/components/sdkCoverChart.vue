<template>
  <div >
    <el-col :span="12">
      <div class="content-chart">
        <div id="web-monthly-vul-type-proportion-chart-sdk" class="chart-content"></div>
      </div>
    </el-col>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import echarts from '@/lib/echarts'

  export default connect(() => {
    return {
      sdkCoverChartRate: 'ocean_global/sdkCoverChartRate'
    }
  }, {
    getSdkCoverChartRate: 'ocean_global/getSdkCoverChartRate'
  })({
    data() {
      return {
        webMonthlyVulTypeProportion: {},
        mobileMonthlyVulTypeProportion: {},
        echartData: {},
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
            dataView: {
              optionToContent: option => {
                const str = `
                  <li>白盒确认存在漏洞git总数：${this.echartData.total_git_count}</li>
                  <li>float go sdk覆盖率：${this.echartData.go_sdk_coverage}</li>
                  <li>float java sdk覆盖率：${this.echartData.java_sdk_coverage}</li>
                   <li>float php sdk覆盖率：${this.echartData.php_sdk_coverage}</li>
                  <li>float go sdk覆盖数：${this.echartData.go_sdk_git_count}</li>
                  <li>float java sdk覆盖数：${this.echartData.java_sdk_git_count}</li>
                  <li>float php sdk覆盖数：${this.echartData.php_sdk_git_count}</li>
                `
                return str
              }
            }

            // magicType: {type: ['bar', 'pie', 'line']},
            // restore: {},
            // saveAsImage: {}
          }
        }
      }
    },
    created() { },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.getSdkCoverChartRate().then(res => {
          this.echartData = res;
          const data = [
            {value: 100 - res.total_sdk_coverage, name: '未覆盖'},
            {value: res.go_sdk_coverage, name: 'float go sdk覆盖率'},
            {value: res.java_sdk_coverage, name: 'float java sdk覆盖率'},
            {value: res.php_sdk_coverage, name: 'float php sdk覆盖率'}
          ]
          this.drawWebMonthlyVulTypeProportionChart(data)
        })
      },
      drawWebMonthlyVulTypeProportionChart(res) {
        let webMonthlyVulTypeProportionChartSdk = echarts.init(document.getElementById('web-monthly-vul-type-proportion-chart-sdk'))
        let option = {
          color: ['#dddada', '#7CE0C3', '#5BC9F1', '#9DC5F3', '#73A6F7', '#2665B4'],

          // color: ['#2665B4', '#7CE0C3', '#73A6F7', '#4486F7', '#93B2DA', '#5BC9F1', '#ADDE72', '#BBBBBB'],
          title: {
            text: 'sdk覆盖率',
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
              if (value.data === 1) { return '' }
              return value.marker + value.name + ':  ' + value.value['value'] + '%) ';
            }
          },
          dataset: {
            source: res
          },
          series: [{
            type: 'pie',
            label: {
              normal: {
                show: false,
                formatter: function(value) {
                  return value.value['value'] + '%\n' + value.name;
                },
                position: 'center',
                lineHight: 16
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            radius: ['60%', '70%'],
            center: ['38%', '60%']
          }],
          contentToOption: function() { // 数据视图刷新的方法
            this.fetchData()
          }
        }
        webMonthlyVulTypeProportionChartSdk.setOption(option)
      }
    }
  })
</script>
