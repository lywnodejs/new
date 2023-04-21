<template>
  <div class="safety-platform">
    <div class="safety-platform__search">
      <label class="safety-platform__search--title">安全平台指标</label>
      <el-date-picker
        v-model="confirm_time"
        type="daterange"
        :picker-options="DATE_OPTIONS"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :clearable="false"
        align="right">
      </el-date-picker>
      <button class="btn btn-primary" @click="initInStats">确定</button>
    </div>
    <div calss="safety-platform__content">
      <el-row>
        <el-col :span="24">
          <div class="safety-platform__content--chart">
            <div class="safety-platform__content--chart__header">
              <label>安全平台用户访问PV及UV</label>
            </div>
            <div class="safety-platform__content--chart__content" id="oneChart"></div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="safety-platform__content--chart">
            <div class="safety-platform__content--chart__header">
              <label>安全平台各功能用户访问PV</label>
            </div>
            <div class="safety-platform__content--chart__content" id="twoChart"></div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="safety-platform__content--chart">
            <div class="safety-platform__content--chart__header">
              <label>安全平台各功能用户访问UV</label>
            </div>
            <div class="safety-platform__content--chart__content" id="threeChart"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { DATE_OPTIONS } from '@/constants.es6'
import moment from 'moment'
import echarts from 'echarts'
import LineTable from './LineTable'

export default {
  data() {
    return {
      DATE_OPTIONS,
      confirm_time: [new Date(moment().subtract(30, 'day')), moment()]
    }
  },
  methods: {
    initInStats() {

      this.getChartData('oneChart', '安全平台用户访问PV及UV', 'platform_pv_uv') // 1.安全平台用户访问PV及UV
      this.getChartData('twoChart', '安全平台用户访问PV', 'sub_pv') // 2.安全平台各功能用户访问PV
      this.getChartData('threeChart', '安全平台用户访问UV', 'sub_uv') // 3.安全平台各功能用户访问UV
    },

    // 2.安全平台各功能用户访问PV
    getChartData(domId, title, indicatorType) {
      let deptLevelParams = {
        indicatorType: indicatorType,
        startTime: moment(this.confirm_time[0]).format('YYYY-MM-DD'),
        endTime: moment(this.confirm_time[1]).format('YYYY-MM-DD')
      }
      this.$http.get("inStats/platform/opindicator", { params: deptLevelParams }).then(res => {
        if (res.data.errno == 0) {
          let datas = res.data.data,
              legends = datas ? Object.keys(datas) : [],
              xdatas = [],
              seriesData = {
              },
              series = []

          if(datas && legends.length > 0) {
            legends.forEach((item, i) => {
              seriesData[item] = []
              if (datas[item] && datas[item].length > 0) {
                datas[item].forEach((value, index) => {
                  if (i == 0) {
                    xdatas[index] = value.date
                  }
                  seriesData[item][index] = value.nums
                })
              }
            })

            for (var prop in seriesData) {
              series.push({
                name: prop,
                type: 'line',
                label: {
                    normal: {
                        show: false,
                        color: '#000'

                    }
                },
                smooth: 0.3,
                data: seriesData[prop]
              });
            }
          }
          this.drowLine(series, xdatas, legends, domId, '类型', title, datas)
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    drowLine(series, xdatas, legends, id, title, tableColumnName, deptDatas) {
      let _this = this
      let eventChart = echarts.init(document.getElementById(id), 'macarons')
      let charOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          type: 'scroll',
          orient: series.length > 5 ? '' : 'horizontal',
          bottom: series.length > 5 ? 345 : 370,
          data: legends
        },

        toolbox: {
          show: true,
          feature: {
            dataView: {
              show: true,
              readOnly: true,
              title: '数据视图',
              optionToContent: function (options) {
                return LineTable(series, xdatas, '类型');
              }
            },
            mark: { show: true },
            magicType: {
              show: true,
              type: ['line', 'bar']
            },
            restore: { show: true },
            saveAsImage: { show: true }
          },

        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            rotate: 45
          },
          data: xdatas
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          axisPointer: {
            snap: true
          }
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },

        series: series
      };
      eventChart.setOption(charOptions)
    }
  },

  created() {
    this.initInStats()
  }
}
</script>

<style lang="less">
  .safety-platform {
    &__search {
      &--title {
        font-size: 16px;
        font-weight: bold;
        margin-right: 15px;
      }

      .el-radio+.el-radio {
        margin-left: 15px;
        margin-right: 15px;
      }
      margin-bottom: 15px;
    }

    &__content {
      &--chart {
        border: 1px solid #ddd;
        background-color: #fff;
        min-height: 450px;
        margin-bottom: 15px;

        &__header {
          border-bottom: 1px solid #ddd;
          line-height: 25px;
          padding: 5px 15px;
          font-size: 14px;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
        }

        &__content {
          width: 100%;
          height: 400px;
        }
      }
    }
  }
</style>

