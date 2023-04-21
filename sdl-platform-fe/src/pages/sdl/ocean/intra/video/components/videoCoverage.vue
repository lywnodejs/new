<template>
  <div id="ocean-intra-video-coverage">
    <div class="block">
        <el-col class="statistic-box" >
          <div class="box-header">
            <span>视频部门覆盖率</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-select
                  v-model="dept_id"
                  filterable
                  clearable
                  @change="deptChange"
                  placeholder="请选择一级部门">
                    <el-option
                    v-for="item in deptList"
                    :key="item.dept_id"
                    :label="item.dept_name"
                    :value="item.dept_id">
                    </el-option>
            </el-select>
          </div>
          <el-row>
            <el-col :span="24">
                <div class="content-chart">
                    <div id="video-coverage-detail" class="chart-content"></div>
                </div>
            </el-col>
          </el-row>
        </el-col>
      </div>
      <!-- <div class="designTitle" style="margin-bottom: 15px;">视频部门覆盖率</div>
    <el-form class="searchForm" label-position="left"  :inline='true'>
        <el-form-item label="部分" label-width="60px" class="items" style=" color:white;">
                <el-select
                  v-model="dept_id"
                  filterable
                  clearable
                  placeholder="请选择一级部门">
                    <el-option
                    v-for="item in deptList"
                    :key="item.dept_id"
                    :label="item.dept_name"
                    :value="item.dept_id">
                    </el-option>
                </el-select>
        </el-form-item>
    </el-form>
    <div class="basicContentDisplay" v-for="item in coverageData" :key="item.dept_t1_id">
          <div class="items">
            <span class="c1">部门名称：</span>
            <span class="c2">{{item.dept_name}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">覆盖率：</span>
            <span class="c2">{{item.coverage}}</span>
          </div>
          <div class="items">
            <span class="c1">完成数：</span>
            <span class="c2">{{item.finished}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">未完成数：</span>
            <span class="c2">{{item.unfinished}}</span>
          </div>
          <div class="items">
            <span class="c1">总计：</span>
            <span class="c2">{{item.total}}</span>
          </div>
          <div class="rightItem">
          </div>
    </div> -->
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import echarts from '@/lib/echarts'

  export default connect(() => {
    return {
    }
  }, {
    getDeptList: 'ocean_department/getDeptList',
    videoCoverage: 'ocean_video/videoCoverage'
  })({
    data() {
      return {
        dept_id: null,
        deptList: [],
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
              },
              name: '小时'
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
        },
        coverageData: null,
        data: []
      }
    },
    created() {
        this.getDeptList().then(data => {
            this.deptList = data.dept_list
        })
        this.fetchData()
    },
    mounted() {
    },
    components: {},
    methods: {
      fetchData() {
          this.videoCoverage({'dept_id_list': [this.dept_id]}).then(res => {
            this.coverageData = res
            for (let i = 0; i < res.length; i++) {
                this.data.push([res[i].dept_name, res[i].coverage, `${res[i].finished}/${res[i].total}(完成数/总数)`])
            }
            this.drawBaselineChart()
          })
      },
      deptChange(val) {
          this.fetchData()
      },
      drawBaselineChart(res) {
        let baselineChart = echarts.init(document.getElementById('video-coverage-detail'))
        let option = {
          color: ['#7CE0C3', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: '视频完成覆盖率/%',
            left: 20,
            top: 20,
            textStyle: this.chartTitleStyle
          },
          tooltip: {
            trigger: 'axis',

            position: function(point, params, dom, rect, size) {
                return [100, 100]
            },
            formatter: function(params) {
              let str = params[0].data[0] + '：' + params[0].data[2]
              return str
            }
          },
          toolbox: {
            align: 'right',
            y: 20,
            right: 20,
            itemSize: 11,
            feature: {
              dataView: {
                readOnly: true,
                optionToContent: function(opt) {

                  let data = opt.dataset[0].source
                  let str = `<div class="content-header">项目完成时长：</div>
                    <div class="content"><span class="color1 point">• </span>所有项目平均时长：<span class="color1 ">${data[0][2]}</span></div>
                    <div class="content"><span class="color4 point">• </span>A|B类平均时长：<span class="color4 ">${data[1][2]}</span></div>
                    <div class="content"><span class="color4 point">• </span>C|D类平均时长：<span class="color4 ">${data[2][2]}</span></div>
                    <div class="content"><span class="color3 point">• </span>最大时长：<span class="color3 ">${data[3][2]}</span></div>
                    <div class="content"><span class="color2 point">• </span>最少时长：<span class="color2 ">${data[4][2]}</span></div>`
                  return str
                }
              }
            }
          },
          legend: {
            align: 'right',
            top: 65,
            right: 20,
            orient: 'vertical',
            itemGap: 10,
            data: ['时间'],
            textStyle: {
              color: '#999999',
              fontSize: 12
            }
          },
          dataset: {
            source: this.data
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
              barWidth: 20
            }
          ]
        }
        baselineChart.clear()
        baselineChart.setOption(option)
      }
    }
  })
</script>

<style lang="less">
#ocean-intra-video-coverage{
    //  margin-right: 23px;
    .block {
    //   margin: 23px 11.5px 11.5px 11.5px;
      display: flex;
      .statistic-box {
        // color: #333;
        background-color: white;
        .box-header {
        //   padding: 15px 23px;
        //   font-size: 12.5px;
        //   font-style: normal;
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
          margin-top: 10px;
          margin-bottom: 20px;
          .item{
            //   text-align: center;
            //   padding-left: 10px;
              margin: 0 auto;
              .content{
                  margin-left: 40px;
                  line-height: 25px;
              }
              .content-header{
                  line-height: 30px;
                  text-align: center;
              }
              .box-card{

              }
          }
          .popover-btn{
            border: none;
            font-size: 45px;
          }
          .el-button:hover {
            background: none;
          }
          .el-button:focus {
            background: none;
          }
        }
      }
    }
    .domainCoverageDetail{
      color: #73A6F7;
      cursor: pointer;
    }
    .el-form-item__label{
        color: white;
        width: 60px;
    }
    .nps-xslx-btn{
      position: relative;
      margin-left: 80px;
      height: 32px;
      line-height: 10px;
      margin-top: 1px;
      color: #FF7B41;
      border-color: #FF7B41;
    }
    .content-chart {
      background-color: #fff;
      min-height: 340px;
      margin: 11.5px 11.5px 0px 23px;
      // position: relative;
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
