<template>
  <div class="irft-event">
    <div class="irft-event__search">
      <label class="irft-event__search--title">IRFT指标</label>
      <el-radio v-model="timeType" label="month">按月</el-radio>
      <el-radio v-model="timeType" label="week">按周</el-radio>
      <span v-if="timeType == 'month'" class="demonstration">请选择月份</span>
      <el-date-picker
        v-if="timeType == 'month'"
        value-format="yyyy-MM"
        v-model="month"
        type="month"
        placeholder="请选择月份">
      </el-date-picker>
      <span v-if="timeType == 'week'"  class="demonstration">请选择周数</span>
      <el-date-picker
        v-if="timeType == 'week'"
        v-model="week"
        type="week"
        format="yyyy 第 WW 周"
        placeholder="选择周">
      </el-date-picker>
      <button class="btn btn-primary" @click="initInStats">确定</button>
    </div>
    <div calss="irft-event__content">
      <el-row :gutter="15">
        <el-col :span="12">
          <div class="irft-event__content--chart">
            <div class="irft-event__content--chart__header">
              <label>{{ title1 }}</label>
            </div>
            <div class="irft-event__content--chart__content" id="levelChart"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="irft-event__content--chart">
            <div class="irft-event__content--chart__header">
              <label>{{ title2 }}</label>
            </div>
            <div class="irft-event__content--chart__content" id="typeChart"></div>
          </div>
          </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="irft-event__content--chart">
            <div class="irft-event__content--chart__header">
              <label>{{ title3 }}</label>
            </div>
            <div class="irft-event__content--chart__content" style="height: 500px;" id="deptLevelChart"></div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="irft-event__content--chart">
            <div class="irft-event__content--chart__header">
              <label>{{ title4 }}</label>
            </div>
            <div class="irft-event__content--chart__content" style="height: 500px;"  id="deptTypeChart"></div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="irft-event__content--chart">
            <div class="irft-event__content--chart__header">
              <label>{{ title5 }}</label>
            </div>
            <div class="irft-event__content--chart__content" id="timeLevelChart"></div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="irft-event__content--chart">
            <div class="irft-event__content--chart__header">
              <label>{{ title6 }}</label>
            </div>
            <div class="irft-event__content--chart__content" id="sixChart"></div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="irft-event__content--chart">
            <div class="irft-event__content--chart__header">
              <label>{{ title7 }}</label>
            </div>
            <div class="irft-event__content--chart__content" id="sevenChart"></div>
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

      timeType: 'month',
      month: moment().format('YYYY-MM'),
      week: moment().day(-6).toDate(),

      title1: '',
      title2: '',
      title3: '',
      title4: '',
      title5: '',
      title6: '',
      title7: '',
      title8: '',

      eventAction1: false, // 防止查询时多次注册click事件
      eventAction2: false,
      eventAction3: false,
      eventAction5: false,
      eventAction6: false,
      eventAction7: false,
      eventAction8: false,

      // 存放结果，获取单位id使用
      datas3: {},
      datas4: {},
      datas6: {},
      datas7: {}

    }
  },

  computed: {
    params: function() {
      let params = {
        timeType: this.timeType
      }
      if (this.timeType == 'month') {
        params['year'] = this.month.substring(0, 4)
        params['month'] = this.month.substring(this.month.length-2, this.month.length)
      } else {
        params['year'] = this.week.getFullYear()
        params['week'] = moment(this.week).week()
      }

      return params
    },

    searchTime: function() {
      let startTime = null, endTime = null
      if (this.timeType == 'month') {
        let year = this.month.substring(0, 4), month = this.month.substring(this.month.length-2, this.month.length)
        startTime = moment().set({
          year: year,
          month: month - 1,
          date: 1
        }).format('YYYY-MM-DD')
        endTime = moment(startTime).endOf('month').format('YYYY-MM-DD')
      } else {
        startTime = moment(this.week).day(0).format('YYYY-MM-DD')
        endTime = moment(this.week).day(6).format('YYYY-MM-DD')
      }
      return {
        startTime,
        endTime
      }
    }
  },

  methods: {
    initInStats() {
      this.getTitleName()
      this.getLevelPieData() // 1.本月/周安全违规事件等级分布

      this.getTypePieData() // 2.本月/周安全违规事件各类型分布

      this.getDeptLevelLineData() // 3.本月/周各部门违规事件等级分布

      this.getDeptTypeLineData() // 4.本月/周各部门违规事件类型分布

      this.getTimeLevelLineData() // 5.本年度月/周事件数量对比

      this.getSixLineData() // 6. 规事件环比数量变动情况

      this.getSevenLineData()

    },

    getTitleName() {
      let pre = ''
      if (this.timeType == 'month') {
        pre = this.params.year + '年' + this.params.month + '月'
        this.title5 = '本年度01月至' + pre.substring(pre.length-3, pre.length) + '事件数量对比'
        this.title6 = pre + '较上月违规事件数量变动情况'
      } else {
        pre = this.params.year + '年' + this.params.week + '周'
        this.title5 = '本年度第' + pre.substring(pre.length-3, pre.length) + '前12周事件数量对比'
        this.title6 = pre + '较上周违规事件数量变动情况'
      }

      this.title1 = pre + '安全违规事件等级分布'
      this.title2 = pre + '安全违规事件各类型分布'
      this.title3 = pre + '各部门违规事件等级分布'
      this.title4 = pre + '各部门违规事件类型分布'
      this.title7 = '截止到' + pre + '因违规导致的安全事件分数得分'

    },

    // 1.本月/周安全违规事件等级分布
    getLevelPieData() {
      let levelParams = this.params
      levelParams['indicatorType'] = 'se_irft_level'
      this.$http.get("inStats/secevent/irftstatindicator", { params: levelParams }).then(res => {
        if (res.data.errno == 0) {
          let sourceData = res.data.data,
              legends = sourceData.map(item => {
                return item.name
              })
          this.drowPie(sourceData, legends, 'levelChart', this.title1)
          this.eventAction1 = true
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    // 2.本月/周安全违规事件各类型分布
    getTypePieData() {
      let typeParams = this.params
      typeParams['indicatorType'] = 'se_irft_type'
      this.$http.get("inStats/secevent/irftstatindicator", { params: typeParams }).then(res => {
        if (res.data.errno == 0) {
          let sourceData = res.data.data,
              legends = sourceData.map(item => {
                return item.name
              })
          this.drowPie(sourceData, legends, 'typeChart', this.title2)
          this.eventAction2 = true
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    // 3.本月/周各部门违规事件等级分布
    getDeptLevelLineData() {
      let deptLevelParams = this.params
      deptLevelParams['indicatorType'] = 'se_irft_dept_level'
      this.$http.get("inStats/secevent/irftstatindicator", { params: deptLevelParams }).then(res => {
        if (res.data.errno == 0) {
          let datas = res.data.data,
              legends = ['一级', '二级', '三级', '四级'],
              xdatas = [],
              seriesData = {
                '一级': [],
                '二级': [],
                '三级': [],
                '四级': []
              },
              series = []

          if(datas) {
            datas.forEach((item, index) => {
              xdatas[index] = item.deptName
              seriesData['一级'][index] = item.level_1
              seriesData['二级'][index] = item.level_2
              seriesData['三级'][index] = item.level_3
              seriesData['四级'][index] = item.level_4
            })

            for (var prop in seriesData) {
              series.push({
                name: prop,
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        color: '#000'

                    }
                },
                data: seriesData[prop]
              });
            }
          }
          this.datas3 = datas
          this.drowLine(series, xdatas, legends, 'deptLevelChart', this.title3, '部门名称', datas)
          this.eventAction3 = true
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    // 4.本月/周各部门违规事件类型分布
    getDeptTypeLineData() {
      let deptTypeParams = this.params
      deptTypeParams['indicatorType'] = 'se_irft_dept_type'
      this.$http.get("inStats/secevent/irftstatindicator", { params: deptTypeParams }).then(res => {
        if (res.data.errno == 0) {
          let datas = res.data.data,
              legends = ['信息泄露', '权限滥用', '账号共享', '司机隐私', '乘客隐私'],
              xdatas = [],
              seriesData = {
                '信息泄露': [],
                '权限滥用': [],
                '账号共享': [],
                '司机隐私': [],
                '乘客隐私': []
              },
              series = []

          if(datas) {
            datas.forEach((item, index) => {
              xdatas[index] = item.deptName
              seriesData['信息泄露'][index] = item['信息泄露']
              seriesData['权限滥用'][index] = item['权限滥用']
              seriesData['账号共享'][index] = item['账号共享']
              // seriesData['端口转发'][index] = item['端口转发']
              seriesData['司机隐私'][index] = item['司机隐私']
              seriesData['乘客隐私'][index] = item['乘客隐私']
            })

            for (var prop in seriesData) {
              series.push({
                name: prop,
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        color: '#000'

                    }
                },
                data: seriesData[prop]
              });
            }
          }
          this.datas4 = datas
          this.drowLine(series, xdatas, legends, 'deptTypeChart', this.title4, '部门名称', datas)
          this.eventAction4 = true
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    // 5.本年度月/周事件数量对比
    getTimeLevelLineData() {
      let timeLevelParams = this.params
      timeLevelParams['indicatorType'] = 'se_irft_time_level'
      this.$http.get("inStats/secevent/irftstatindicator", { params: timeLevelParams }).then(res => {
        if (res.data.errno == 0) {
          let datas = res.data.data,
              legends = ['一级', '二级', '三级', '四级', '总数'],
              xdatas = [],
              seriesData = {
                '一级': [],
                '二级': [],
                '三级': [],
                '四级': [],
                '总数': []
              },
              series = []

          if(datas) {
            datas.forEach((item, index) => {
              xdatas[index] = item.stat_time
              seriesData['一级'][index] = item.level_1
              seriesData['二级'][index] = item.level_2
              seriesData['三级'][index] = item.level_3
              seriesData['四级'][index] = item.level_4
              seriesData['总数'][index] = item.total
            })

            for (var prop in seriesData) {
              series.push({
                name: prop,
                type: prop == '总数' ? 'line' : 'bar',
                stack: prop == '总数' ? '' : '总量',
                label: {
                    normal: {
                        show: true,
                        color: '#000'

                    }
                },
                data: seriesData[prop]
              });
            }
          }
          this.drowLine(series, xdatas, legends, 'timeLevelChart', this.title3, '告警等级', datas)
          this.eventAction5 = true
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    // 6.违规事件环比数量变动情况
    getSixLineData() {
      let timeLevelParams = this.params
      timeLevelParams['indicatorType'] = 'se_irft_dept_quarter'
      this.$http.get("inStats/secevent/irftstatindicator", { params: timeLevelParams }).then(res => {
        if (res.data.errno == 0) {
          let datas = res.data.data,
              legends = [res.data.previousStr, res.data.currentStr, '变化情况'],
              xdatas = [],
              seriesData = {},
              series = []

          seriesData[res.data.previousStr] = []
          seriesData[res.data.currentStr] = []
          seriesData['变化情况'] = []

          if(datas) {
            datas.forEach((item, index) => {
              xdatas[index] = item.deptName
              seriesData[res.data.previousStr][index] = item.previous
              seriesData[res.data.currentStr][index] = item.current
              seriesData['变化情况'][index] = item.diff
            })

            for (var prop in seriesData) {
              series.push({
                name: prop,
                type: prop == '变化情况' ? 'line' : 'bar',
                label: {
                    normal: {
                        show: true,
                        color: '#000'
                    }
                },
                yAxisIndex: prop == '变化情况' ? 1 : 0,
                data: seriesData[prop]
              });
            }
          }
          this.datas6 = datas
          this.drowLine(series, xdatas, legends, 'sixChart', this.title6, '部门名称', datas)
          this.eventAction6 = true
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    // 7.截止到当前时间因违规导致的安全事件数级得分
    getSevenLineData() {
      let timeLevelParams = this.params
      timeLevelParams['indicatorType'] = 'se_irft_dept_score'
      this.$http.get("inStats/secevent/irftstatindicator", { params: timeLevelParams }).then(res => {
        if (res.data.errno == 0) {
          let datas = res.data.data,
              legends = ['一级', '二级', '三级', '四级', '得分'],
              xdatas = [],
              seriesData = {
                '一级': [],
                '二级': [],
                '三级': [],
                '四级': [],
                '得分': []
              },
              series = []

          if(datas) {
            datas.forEach((item, index) => {
              xdatas[index] = item.deptName
              seriesData['一级'][index] = item.level_1
              seriesData['二级'][index] = item.level_2
              seriesData['三级'][index] = item.level_3
              seriesData['四级'][index] = item.level_4
              seriesData['得分'][index] = item.score
            })

            for (var prop in seriesData) {
              series.push({
                name: prop,
                type: prop == '得分' ? 'line' : 'bar',
                label: {
                    normal: {
                        show: true,
                        color: '#000'
                    }
                },
                stack: prop == '得分' ? '' : '总量',
                yAxisIndex: prop == '得分' ? 1 : 0,
                data: seriesData[prop]
              });
            }
          }
          this.datas7 = datas
          this.drowLine(series, xdatas, legends, 'sevenChart', this.title7, '部门名称', datas)
          this.eventAction7 = true
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    },

    drowPie(seriesData, legends, id, title) {
      let eventChart = echarts.init(document.getElementById(id), 'macarons')
      let charOptions = {
        color: id == 'levelChart' ?['#b1cf95', '#fffd54', '#f6c143', '#eb3223'] : ['#fad978', '#e98244', '#4c73be', '#c67670'],
        textStyle: {
          color: '#000'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          show : true,
          feature : {
            mark : {show: true},
            dataView : {
              show: true,
              readOnly: true,
              title : title,
              optionToContent : function(opt) {
                return PieTable(seriesData)
              }
            },
            restore : {show: true},
            saveAsImage : {show: true}
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
            },
            labelLine: {
              lineStyle: {
                color: '#000'
              }
            }
          }
        ]
      }
      eventChart.setOption(charOptions);
      if (!this.eventAction1 || !this.eventAction2) {
        eventChart.on('click', (params) => {
          let searchParam = {
            occured_begin_time: this.searchTime.startTime,
            occured_end_time: this.searchTime.endTime
          }
          searchParam['type'] = '1358,1530,1331,1545,1332,1355,1338,1337,1339'
          if (id == 'levelChart') {
            let level_name = params.data.name
            if(level_name) {
              switch(level_name) {
                case '一级(低危)':
                  searchParam['level'] = '1301'
                  break;
                case '二级(中危)':
                  searchParam['level'] = '1302'
                  break;
                case '三级(高危)':
                  searchParam['level'] = '1303'
                  break;
                case '四级(严重)':
                  searchParam['level'] = '1304'
                  break;
              }
            }

          } else if (id == 'typeChart') {
           let type_name = params.data.name
            if(type_name) {
              switch(type_name) {
                case '账号共享':
                  searchParam['type'] = '1338'
                  break;
                case '权限滥用':
                  searchParam['type'] = '1337'
                  break;
                case '信息泄露':
                  searchParam['type'] = '1530,1545,1355,1339,1331'
                  break;
                // case '端口转发':
                //   searchParam['type'] = '1344'
                //   break;
                case '司机隐私':
                  searchParam['type'] = '1358'
                  break;
                case '乘客隐私':
                  searchParam['type'] = '1332'
                  break;
              }
            }
          }
          this.$router.push({
            path: 'secEvent/event',
            query: searchParam
            }
          )
          params.event.event.stopPropagation()
        })
      }
    },

    drowLine(series, xdatas, legends, id, title, tableColumnName, deptDatas) {
      let _this = this
      let eventChart = echarts.init(document.getElementById(id), 'macarons')
      let charOptions = {
        color: id == 'deptLevelChart' || id == 'timeLevelChart' || id == 'sevenChart' ? ['#b1cf95', '#fffd54', '#f6c143', '#eb3223', '#4c73be'] : id == 'sixChart' ? ['#e98244', '#4c73be', '#c67670', '#fffd54'] : ['#fad978', '#e98244', '#4c73be', '#c67670', '#fffd54'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: id == 'mttdrChart' ? '{b}<br/>{a}: {c} 小时' : ''
        },
        legend: {
          type: 'scroll',
          orient: series.length > 5 ? '' : 'horizontal',
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
                if (id == 'deptLevelChart' || id == 'deptTypeChart') {
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
          boundaryGap: true,
          axisLabel: {
            rotate: 45
          },
          data: xdatas
        },
        yAxis: id == 'sixChart' || id == 'sevenChart' ? [{
          type: 'value',
          min: 0,
          boundaryGap: [0.2, 0.2]
        },
        {
          type: 'value',
          splitLine: {
      　　　　show:false
      　　 },
          boundaryGap: [0.2, 0.2]
        }] : {
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
      if(!_this.eventAction3 || !_this.eventAction4 || !_this.eventAction5 || !_this.eventAction6 || !_this.eventAction7) {
        eventChart.on('click', (params) => {
          let searchParam = {
            occured_begin_time: _this.searchTime.startTime,
            occured_end_time: _this.searchTime.endTime
          }
          searchParam['type'] = '1358,1530,1331,1545,1332,1355,1338,1337,1339'
          if(id === 'deptLevelChart') {
            let dept_id = -1, dept_name = '未知部门'
            _this.datas3.forEach(item => {
              if(params.name === item.deptName && item.deptId && item.deptId !='null') {
                dept_id = item.deptId,
                dept_name = item.deptName
              }
            })
            searchParam['dept_id'] = dept_id,
            searchParam['dept_name'] = dept_name
            let level_name = params.seriesName
            if(level_name) {
              switch(level_name) {
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
          } else if(id === 'deptTypeChart') {
            let dept_id = -1, dept_name = '未知部门'
            _this.datas4.forEach(item => {
              if(params.name === item.deptName && item.deptId && item.deptId !='null') {
                dept_id = item.deptId,
                dept_name = item.deptName
              }
            })
            searchParam['dept_id'] = dept_id,
            searchParam['dept_name'] = dept_name
            let type_name = params.seriesName
            if(type_name) {
              switch(type_name) {
                case '账号共享':
                  searchParam['type'] = '1338'
                  break;
                case '权限滥用':
                  searchParam['type'] = '1337'
                  break;
                case '信息泄露':
                  searchParam['type'] = '1530,1545,1355,1339,1331'
                  break;
                // case '端口转发':
                //   searchParam['type'] = '1344'
                //   break;
                case '司机隐私':
                  searchParam['type'] = '1358'
                  break;
                case '乘客隐私':
                  searchParam['type'] = '1332'
                  break;
              }
            }
          } else if (id == 'timeLevelChart') {
            let level_name = params.seriesName
            if(level_name) {
              switch(level_name) {
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

            // 计算时间
            if (_this.timeType == 'month') {
              let year = params.name.substring(0, 4), month = params.name.substring(params.name.length-2, params.name.length)
              let start = moment().set({
                year: year,
                month: Number(month) - 1,
                date: 1
              }).format('YYYY-MM-DD'),
              end = moment(start).endOf('month').format('YYYY-MM-DD')
              searchParam['occured_begin_time'] = start
              searchParam['occured_end_time'] = end
            } else {
              let year = params.name.substring(0, 4), week = params.name.substring(params.name.length-2, params.name.length)
              let start = moment().set('year', year).week(week).day(0).format('YYYY-MM-DD')
              let end = moment().set('year', year).weeks(week).day(6).format('YYYY-MM-DD')
              searchParam['occured_begin_time'] = start
              searchParam['occured_end_time'] = end
            }
          }
          else if (id == 'sixChart') {
            let dept_id = -1, dept_name = '未知部门'
            _this.datas6.forEach(item => {
              if(params.name === item.deptName && item.deptId && item.deptId !='null') {
                dept_id = item.deptId,
                dept_name = item.deptName
              }
            })
            searchParam['dept_id'] = dept_id,
            searchParam['dept_name'] = dept_name
            // 计算时间
            if (params.seriesName != '变化情况') {
              if (_this.timeType == 'month') {
                let year = params.seriesName.substring(0, 4), month = params.seriesName.substring(params.seriesName.length-2, params.seriesName.length)
                let start = moment().set({
                  year: year,
                  month: Number(month) - 1,
                  date: 1
                }).format('YYYY-MM-DD'),
                end = moment(start).endOf('month').format('YYYY-MM-DD')
                searchParam['occured_begin_time'] = start
                searchParam['occured_end_time'] = end
              } else {
                let year = params.seriesName.substring(0, 4), week = params.seriesName.substring(params.seriesName.length-2, params.seriesName.length)
                let start = moment().set('year', year).week(week).day(0).format('YYYY-MM-DD')
                let end = moment().set('year', year).weeks(week).day(6).format('YYYY-MM-DD')
                searchParam['occured_begin_time'] = start
                searchParam['occured_end_time'] = end
              }
            }
          } else if (id == 'sevenChart') {

            // 开始事件设置为1月1号
            searchParam.occured_begin_time = moment(_this.searchTime.startTime).set({
              month: 0,
              date: 1
            }).format('YYYY-MM-DD')
            let dept_id = -1, dept_name = '未知部门'
            _this.datas6.forEach(item => {
              if(params.name === item.deptName && item.deptId && item.deptId !='null') {
                dept_id = item.deptId,
                dept_name = item.deptName
              }
            })
            searchParam['dept_id'] = dept_id,
            searchParam['dept_name'] = dept_name
            let level_name = params.seriesName
            if(level_name) {
              switch(level_name) {
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
          }
          if (params.seriesName != '总数' && params.seriesName != '变化情况' && params.seriesName != '得分') {
            _this.$router.push({
              path: 'secEvent/event',
              query: searchParam
            })
          }

          params.event.event.stopPropagation()
        })
      }
    }
  },

  created() {
    this.initInStats()
  }
}
</script>

<style lang="less">
  .irft-event {
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

