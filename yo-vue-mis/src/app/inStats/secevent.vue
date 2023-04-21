<template>
  <div class="secevent">
    <div class="secevent__search">
      <label class="secevent__search--title">安全事件指标</label>
      <el-date-picker v-model="alarm_time" type="daterange" :picker-options="DATE_OPTIONS" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" align="right">
      </el-date-picker>
      <el-input placeholder="请输入事件名称" v-model="event_name" prefix-icon="el-icon-search" clearable class="secevent__search--input" />
      <button class="btn btn-primary" @click="initInStats">指标分析</button>
    </div>
    <div calss="secevent__content">
      <el-row :gutter="15">
        <el-col :span="12">
          <div class="secevent__content--chart">
            <div class="secevent__content--chart__header">
              <label>安全事件来源分布统计</label>
              <div>
                <el-select v-model="sourceLevel" placeholder="严重程度" multiple @change="sourceSelectBlur">
                  <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>

                <el-select v-model="sourceType" placeholder="事件类型" multiple @change="sourceSelectBlur">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="secevent__content--chart__content" id="sourceChart"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="secevent__content--chart">
            <div class="secevent__content--chart__header">
              <label>安全事件类型统计</label>
            </div>
            <div class="secevent__content--chart__content" id="typeChart"></div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="secevent__content--chart">
            <div class="secevent__content--chart__header">
              <label>安全事件状态分布统计</label>
              <div>
                <el-select v-model="statusLevel" placeholder="严重程度" multiple @change="statusSelectBlur">
                  <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="statusType" placeholder="事件类型" multiple @change="statusSelectBlur">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="secevent__content--chart__content" id="statusChart"></div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="secevent__content--chart">
            <div class="secevent__content--chart__header">
              <label>安全事件平均MTTD与MTTR趋势统计</label>
              <div>
                <el-select v-model="mttdrLevel" placeholder="严重程度" multiple @change="mttdrSelectBlur">
                  <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="mttdrType" placeholder="事件类型" multiple @change="mttdrSelectBlur">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="secevent__content--chart__content" id="mttdrChart"></div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="secevent__content--chart">
            <div class="secevent__content--chart__header">
              <label>安全事件严重程度分布统计</label>
            </div>
            <div class="secevent__content--chart__content" id="levelChart"></div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="secevent__content--chart">
            <div class="secevent__content--chart__header">
              <label>各部门安全事件统计</label>
              <div>
                <el-select v-model="deptLevel" placeholder="严重程度" multiple @change="deptSelectBlur">
                  <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="deptType" placeholder="事件类型" multiple @change="deptSelectBlur">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="secevent__content--chart__content" style="height: 500px;" id="deptChart"></div>
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
import PieTable from './PieTable'
import LineTable from './LineTable'
import DeptLineTable from './DeptLineTable'

export default {
  data() {
    return {
      DATE_OPTIONS,
      alarm_time: [new Date(moment().subtract(1, 'month').set('date', 1)), moment().subtract(1, 'month').endOf('month')],
      event_name: '', // 事件名称

      levelOptions: [], // 严重程度
      typeOptions: [], // 事件类型

      sourceLevel: [],
      sourceType: [],

      statusLevel: [],
      statusType: [],

      mttdrLevel: [],
      mttdrType: [],

      deptLevel: [],
      deptType: [],

      eventAction1: false,
      eventAction2: false,
      eventAction3: false,
      eventAction5: false,
      eventAction6: false

    }
  },

  computed: {
    startTime() {
      if (this.alarm_time && this.alarm_time.length > 0) {
        return moment(this.alarm_time[0]).format('YYYY-MM-DD')
      }
    },

    endTime() {
      if (this.alarm_time && this.alarm_time.length > 0) {
        return moment(this.alarm_time[1]).format('YYYY-MM-DD')
      }
    }
  },

  methods: {
    initInStats() {
      this.getSourcePieData()
      this.getTypePieData()

      this.getStatusLineData()

      this.getMttdrLineData()

      this.getLevelLineData()
      this.getDeptLineData()
      this.eventAction = true

      datas: { } //存单位数据，做查询单位ID使用

    },

    sourceSelectBlur() {
      this.getSourcePieData()
    },

    statusSelectBlur() {
      this.getStatusLineData()
    },

    mttdrSelectBlur() {
      this.getMttdrLineData()
    },

    deptSelectBlur() {
      this.getDeptLineData()
    },

    // 1.安全事件来源分布统计
    getSourcePieData() {
      let params = {
        startTime: this.startTime,
        endTime: this.endTime,
        indicatorType: 'se_source',
        level: this.sourceLevel.join(','),
        type: this.sourceType.join(','),
        name: this.event_name
      }
      this.$http.get("inStats/alarm/secevent", { params }).then(res => {
        if (res.data.errno == 0) {
          let sourceData = res.data.data,
            legends = sourceData.map(item => {
              return item.name
            })
          this.drowPie(sourceData, legends, 'sourceChart', '安全事件来源分布统计')
          this.eventAction1 = true
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    // 2.安全事件类型统计
    getTypePieData() {
      let params = {
        startTime: this.startTime,
        endTime: this.endTime,
        indicatorType: 'se_type',
        name: this.event_name
      }
      this.$http.get("inStats/alarm/secevent", { params }).then(res => {
        if (res.data.errno == 0) {
          let sourceData = res.data.data,
            legends = sourceData.map(item => {
              return item.name
            })
          this.drowPie(sourceData, legends, 'typeChart', '安全事件类型统计')
          this.eventAction2 = true
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    // 3.安全事件状态分布统计
    getStatusLineData() {
      let params = {
        startTime: this.startTime,
        endTime: this.endTime,
        indicatorType: 'se_cr',
        level: this.statusLevel.join(','),
        type: this.statusType.join(','),
        name: this.event_name
      }
      this.$http.get("inStats/alarm/secevent", { params }).then(res => {
        if (res.data.errno == 0) {
          let datas = res.data.data,
            legends = ['调查中', '处置中', '已关闭', '终止', '误报'],
            seriesData = {
              '调查中': [],
              '处置中': [],
              '已关闭': [],
              '终止': [],
              '误报': []
            },
            xdatas = [],
            series = []

          if (datas) {
            datas.forEach((item, index) => {
              xdatas[index] = item.stat_time
              seriesData['调查中'][index] = item.stat_finding
              seriesData['处置中'][index] = item.stat_disposal
              seriesData['已关闭'][index] = item.stat_close
              seriesData['终止'][index] = item.stat_stop
              seriesData['误报'][index] = item.stat_misreport

              // seriesData['全部'][index] = item.stat_total
            })

            for (var prop in seriesData) {
              series.push({
                name: prop,
                type: 'bar',
                data: seriesData[prop]
              });
            }
          }
          this.drowLine(series, xdatas, legends, 'statusChart', '安全事件状态分布统计', '事件状态')
          this.eventAction3 = true
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    // 4.安全事件状态分布统计
    getMttdrLineData() {
      let params = {
        startTime: this.startTime,
        endTime: this.endTime,
        indicatorType: 'se_mttdr',
        level: this.mttdrLevel.join(','),
        type: this.mttdrType.join(','),
        name: this.event_name
      }
      this.$http.get("inStats/alarm/secevent", { params }).then(res => {
        if (res.data.errno == 0) {
          let datas = res.data.data,
            legends = ['MTTD', 'MTTR'],
            seriesData = {
              'MTTD': [],
              'MTTR': []
            },
            xdatas = [],
            series = []

          if (datas) {
            datas.forEach((item, index) => {
              xdatas[index] = item.stat_time
              seriesData['MTTD'][index] = item.stat_mttd
              seriesData['MTTR'][index] = item.stat_mttr

              // seriesData['事件数量'][index] = item.stat_total
            })

            for (var prop in seriesData) {
              series.push({
                name: prop,
                type: 'bar',
                data: seriesData[prop]
              });
            }
          }
          this.drowLine(series, xdatas, legends, 'mttdrChart', '安全事件平均MTTD与MTTR趋势统计', '')
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    // 5.安全事件状态分布统计
    getLevelLineData() {
      let params = {
        startTime: this.startTime,
        endTime: this.endTime,
        indicatorType: 'se_level',
        name: this.event_name
      }
      this.$http.get("inStats/alarm/secevent", { params }).then(res => {
        if (res.data.errno == 0) {
          let datas = res.data.data,
            legends = ['一级', '二级', '三级', '四级'],
            seriesData = {
              '一级': [],
              '二级': [],
              '三级': [],
              '四级': []
            },
            xdatas = [],
            series = []

          if (datas) {
            datas.forEach((item, index) => {
              xdatas[index] = item.stat_time
              seriesData['一级'][index] = item.stat_level1
              seriesData['二级'][index] = item.stat_level2
              seriesData['三级'][index] = item.stat_level3
              seriesData['四级'][index] = item.stat_level4

              // seriesData['全部'][index] = item.stat_total
            })

            for (var prop in seriesData) {
              series.push({
                name: prop,
                type: 'bar',
                data: seriesData[prop]
              });
            }
          }
          this.drowLine(series, xdatas, legends, 'levelChart', '安全事件严重程度分布统计', '告警等级')
          this.eventAction5 = true
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    // 6.各部门安全事件统计
    getDeptLineData() {
      let params = {
        startTime: this.startTime,
        endTime: this.endTime,
        indicatorType: 'se_dept',
        level: this.deptLevel.join(','),
        type: this.deptType.join(','),
        name: this.event_name
      }
      this.$http.get("inStats/alarm/secevent", { params }).then(res => {
        if (res.data.errno == 0) {
          let datas = res.data.data,
            xdatas = [],
            series = []

          if (datas) {
            datas.forEach((item, index) => {
              xdatas[index] = item.name
              series[index] = item.value
            })
          }
          this.datas = datas
          this.drowLine([{
            data: series,
            type: 'bar'
          }], xdatas, [], 'deptChart', '各部门安全事件统计', '部门名称', datas)
          this.eventAction6 = true
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    drowPie(seriesData, legends, id, title) {
      let eventChart = echarts.init(document.getElementById(id), 'macarons')
      let charOptions = {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: {
              show: true,
              readOnly: true,
              title: title,
              optionToContent: function (opt) {
                return PieTable(seriesData)
              }
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: 5,
          top: 25,
          bottom: 15,
          data: legends
        },
        series: [
          {
            name: title,
            type: 'pie',
            radius: '50%',
            center: ['60%', '50%'],
            data: seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      eventChart.setOption(charOptions);
      if (!this.eventAction1 || !this.eventAction2) {
        eventChart.on('click', (params) => {
          let searchParam = {
            confirm_begin_time: this.startTime,
            confirm_end_time: this.endTime,
            event_name: this.event_name
          }
          if (id == 'sourceChart') {
            searchParam['level'] = this.sourceLevel.join(',')
            searchParam['type'] = this.sourceType.join(',')
            searchParam['source'] = params.data.id
            //  console.log(params.data)
          } else if (id == 'typeChart') {
            searchParam['type'] = params.data.id
          }
          /*  window.location.href = this.$router.resolve({
             path: 'secEvent/event',
             query: searchParam
           }).href */
          this.$router.push({
            path: '/secEvent/event',
            query: searchParam
          })
          params.event.event.stopPropagation()
        })
      }
    },

    drowLine(series, xdatas, legends, id, title, tableColumnName, deptDatas) {
      let eventChart = echarts.init(document.getElementById(id), 'macarons')
      let charOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: id == 'mttdrChart' ? '{b}<br/>{a0}: {c0} 小时<br/>{a1}: {c1} 小时' : ''
        },
        legend: {
          type: 'scroll',
          orient: series.length > 5 ? '' : 'horizontal',
          bottom: series.length > 5 ? 330 : 370,
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
                if (id == 'deptChart') {
                  return DeptLineTable(series, xdatas, tableColumnName)
                }
                return LineTable(series, xdatas, tableColumnName);
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
          boundaryGap: id == 'deptChart' ? true : true,
          axisLabel: {
            rotate: id == 'deptChart' ? 45 : 0
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
          top: series.length > 5 ? 100 : 50,
          bottom: id == 'deptChart' ? '28%' : '15%'
        },

        series: series
      };
      eventChart.setOption(charOptions)
      if (!this.eventAction3 || !this.eventAction5 || !this.eventAction6) {
        eventChart.on('click', (params) => {
          let searchParam = {
            event_name: this.event_name,
            confirm_begin_time: this.startTime,
            confirm_end_time: this.endTime
          }
          if (id == 'statusChart') {
            searchParam['level'] = this.statusLevel.join(',')
            searchParam['type'] = this.statusType.join(',')
            let status_name = params.seriesName
            switch (status_name) {
              case '调查中':
                searchParam['status'] = '1321'
                break
              case '处置中':
                searchParam['status'] = '1322'
                break
              case '已关闭':
                searchParam['status'] = '1323'
                break
              case '终止':
                searchParam['status'] = '1324'
                break
              case '误报':
                searchParam['status'] = '1325'
                break
            }
            if (series.length > 0) {
              let currentMonth = moment(params.name).endOf('month').format("YYYY-MM-DD")
              searchParam['confirm_begin_time'] = moment(params.name).set('date', 1).format("YYYY-MM-DD")
              searchParam['confirm_end_time'] = currentMonth
            }
          } else if (id == 'levelChart') {
            let level_name = params.seriesName
            if (level_name) {
              switch (level_name) {
                case '一级':
                  searchParam['level'] = '1301'
                  break;
                case '二级':
                  searchParam['level'] = '1302'
                  break;
                case '三级':
                  searchParam['level'] = '1303'
                  break;
                case '四级':
                  searchParam['level'] = '1304'
                  break;
              }
            }

            if (series.length > 0) {
              let currentMonth = moment(params.name).endOf('month').format("YYYY-MM-DD")
              searchParam['confirm_begin_time'] = moment(params.name).set('date', 1).format("YYYY-MM-DD")
              searchParam['confirm_end_time'] = currentMonth
            }
          } else if (id === 'deptChart') {
            searchParam['level'] = this.deptLevel.join(',')
            searchParam['type'] = this.deptType.join(',')
            let dept_id = -1, dept_name = '未知部门'
            this.datas.forEach(item => {
              if (params.name === item.name && item.id && item.id != 'null') {
                dept_id = item.id,
                  dept_name = item.name
              }
            })
            searchParam['dept_id'] = dept_id,
              searchParam['dept_name'] = dept_name
          }
          if (id != 'mttdrChart') {
            /* window.location.href = this.$router.resolve({
              path: 'secEvent/event',
              query: searchParam
            }).href */
            this.$router.push({
              path: '/secEvent/event',
              query: searchParam
            })
          }
          params.event.event.stopPropagation()
        })
      }
    },

    /**
     * 获取下拉列表初始化参数
     */
    getSelectOptions(id) {
      let url = 'dictionary/listByParentId/' + id
      this.$http.get(url).then(({ body }) => {
        let options = body.data.map(({ id: value, dName: label }) => {
          return {
            value,
            label
          };
        });
        switch (id) {
          case 1330:
            this.typeOptions = options
            break
          case 1300:
            this.levelOptions = options
            break;
        }
      })
    }
  },

  created() {

    this.initInStats()

    this.getSelectOptions(1330)
    this.getSelectOptions(1300)
  }
}
</script>

<style lang="less">
.secevent {
  &__search {
    &--title {
      font-size: 16px;
      font-weight: bold;
      margin-right: 15px;
    }
    margin-bottom: 15px;
  }
  &--input {
  }
  .el-input {
    width: 210px;
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

