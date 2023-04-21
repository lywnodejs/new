<template>
  <div id="octopus-index">
    <div class="content">
      <div class="block">
        <div class="flexDis">
          <el-col  class="info-box flexItem sLight2">
            <span class="info-box-icon suqare2">
              <i class="myIcon icon iconfont icon-mob-task" style="font-size: 45px"></i>
            </span>

            <div class="info-box-content">
              <span class="info-box-text">已结束项目数</span>
              <span class="info-box-number">{{endTaskCount}}</span>
            </div>
          </el-col>

          <el-col  :offset="1" class="info-box flexItem sLight1">
            <span class="info-box-icon suqare1">
              <i class="myIcon icon iconfont icon-vul" style="font-size: 45px"></i>
            </span>

            <div class="info-box-content">
              <span class="info-box-text">漏洞总数</span>
              <span class="info-box-number">{{vulTotalCount}}</span>
            </div>
          </el-col>

          <el-col :offset="1" class="info-box flexItem sLight">
            <span class="info-box-icon suqare">
              <i class="myIcon icon iconfont icon-mob-asset" style="font-size: 45px"></i>
            </span>

            <div class="info-box-content">
              <span class="info-box-text">资产总数</span>
              <span class="info-box-number">{{targetTotalCount}}</span>
            </div>
          </el-col>
        </div>
        <div class="flexDis">
          <el-col class="myBox flexItem">
            <el-col :span="12" class="leftContent">
              <span class="taskTit">任务数上限</span><br>
              <span class="squareColor suqare2"></span>&nbsp;<span class="taskContent">任务数&nbsp;{{authInfo.task_total_count}}</span><br>
              <span class="sLightColor sLight2"></span>&nbsp;<span class="taskContent">任务上限&nbsp;{{authInfo.task_total_count_max}}</span>
            </el-col>
            <el-col :span="12" class="rightContent">
              <el-progress class="svgColor2" color="#41A6EE" type="circle" :percentage="getPercentage(authInfo.task_total_count, authInfo.task_total_count_max)||0" :stroke-width='10'></el-progress>
            </el-col>
          </el-col>

          <el-col  class="myBox flexItem" :offset="1">
            <el-col :span="12" class="leftContent">
              <span class="taskTit">每日任务数上限</span><br>
              <span class="squareColor suqare1"></span>&nbsp;<span class="taskContent">今日任务数&nbsp;{{authInfo.task_day_count}}</span><br>
              <span class="sLightColor sLight1"></span>&nbsp;<span class="taskContent">每日任务数上限&nbsp;{{authInfo.task_day_count_max}}</span>
            </el-col>
            <el-col :span="12" class="rightContent">
              <el-progress class="svgColor1" color="#51639C" type="circle" :percentage="getPercentage(authInfo.task_day_count, authInfo.task_day_count_max)||0" :stroke-width='10'></el-progress>
            </el-col>
          </el-col>

          <el-col class="myBox flexItem" :offset="1">
            <el-col :span="12" class="leftContent">
              <span class="taskTit">扫描中任务数上限</span><br>
              <span class="squareColor suqare"></span>&nbsp;<span class="taskContent">扫描中任务数&nbsp;{{authInfo.task_running_task}}</span><br>
              <span class="sLightColor sLight"></span>&nbsp;<span class="taskContent">扫描中任务数上限&nbsp;{{authInfo.task_running_task_max}}</span>
            </el-col>
            <el-col :span="12" class="rightContent">
              <el-progress class="svgColor" color="#64CA92" type="circle" :percentage="getPercentage(authInfo.task_running_task, authInfo.task_running_task_max)||0" :stroke-width='10'></el-progress>
            </el-col>
          </el-col>
        </div>
      </div>
      <!-- <el-row :gutter="20">
        <el-col :span="12">
          <div class="content-chart">
            <div class="chart-header"><label>TOP10任务</label></div>
            <ve-bar
              :data="topTenVulTask"
              :toolbox="barToolbox">
            </ve-bar>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="content-chart">
            <div class="chart-header"><label>TOP10漏洞类型</label></div>
            <ve-bar
              :data="topTenVulType"
              :toolbox="barToolbox">
            </ve-bar>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-chart">
            <div class="chart-header"><label>TOP10资产</label></div>
            <ve-histogram
              :data="topTenTargetUse"
              :toolbox="barToolbox">
            </ve-histogram>
          </div>
        </el-col>
      </el-row> -->

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="content-chart">
            <!-- <div class="chart-header"><label>TOP10任务</label></div> -->
            <div id="top-ten-vul-task-chart" class="chart-content"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="content-chart">
            <!-- <div class="chart-header"><label>TOP10漏洞类型</label></div> -->
            <div id="top-ten-vul-type-chart" class="chart-content"></div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <div class="content-chart">
            <!-- <div class="chart-header"><label>TOP10资产</label></div> -->
            <div id="top-ten-target-use-chart" class="chart-content"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import VeLine from 'v-charts/lib/line.common'
  import VeBar from 'v-charts/lib/bar.common'
  import VeHistogram from 'v-charts/lib/histogram.common'
  import 'v-charts/lib/index.common'
  import 'echarts/lib/component/toolbox'
  import signAgree from './../components/signAgree'
  import {connect} from '@/lib'
  import echarts from '@/lib/echarts'

  export default connect(() => {
    return {
      authInfo: 'octopus_index/authInfo',
      endTaskCount: 'octopus_index/endTaskCount',
      topTenVulTask: 'octopus_index/topTenVulTask',
      topTenVulType: 'octopus_index/topTenVulType',
      vulTotalCount: 'octopus_index/vulTotalCount',
      topTenTargetUse: 'octopus_index/topTenTargetUse',
      targetTotalCount: 'octopus_index/targetTotalCount',
      user: 'user/user'
    }
  }, {
    getAuthInfoStatistic: 'octopus_index/getAuthInfoStatistic',
    getTaskCountStatistic: 'octopus_index/getTaskCountStatistic',
    getVulCountStatistic: 'octopus_index/getVulCountStatistic',
    getTargetCountStatistic: 'octopus_index/getTargetCountStatistic',
    signAgreementUserAuth: 'octopus_userauth/signAgreementUserAuth',
    getUserAuth: 'octopus_userauth/getUserAuth'
  })({
    data() {
      return {
        barToolbox: {
          align: 'right',
          y: 20,
          right: 10,
          itemSize: 11,
          feature: {
            dataView: {},
            magicType: {type: ['bar', 'pie', 'line']},
            restore: {},
            saveAsImage: {}
          }
        },
        chartTitleStyle: {
          color: '#000',
          fontWeight: 'normal',
          fontSize: 13
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
        hBarXAxisStyle: {
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
        hBarYAxisStyle: {
          type: 'category',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#999999'
            }
          },
          axisTick: {show: false}
        },
        vBarXAxisStyle: {
          type: 'category',
          axisLabel: {
            rotate: 45
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#999999'
            }
          },
          axisTick: {show: false}
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
        }
      }
    },
    created() {
      this.getUserInfo()
      this.fetchData()
    },
    components: {VeLine, VeBar, VeHistogram, signAgree},
    watch: {
      topTenVulTask() {
        this.drawTopTenVulTaskChart()
      },
      topTenVulType() {
        this.drawTopTenVulTypeChart()
      },
      topTenTargetUse() {
        this.drawTopTenTargetUseChart()
      }
    },
    methods: {
      fetchData() {
        this.getAuthInfoStatistic().then(res => {
        })
        this.getTaskCountStatistic().then(res => {
        })
        this.getVulCountStatistic().then(res => {
        })
        this.getTargetCountStatistic().then(res => {
        })
      },
      getPercentage(a, b) {
        return a / b * 100
      },
      getUserInfo() {
        let param = {username: this.user.username}
        this.getUserAuth(param).then(res => {
          if (res.data.user_agreement_status !== 'yes') {
            this.open()
          }
        })
      },
      confirm() {
        let param = {user_agreement_status: 'yes'}
        this.signAgreementUserAuth(param).then(res => {
          if (res.errno == 0) {

          }
          this.$notify({
              title: '成功',
              message: '已开通权限',
              type: 'success'
            })
        })
      },
      open() {
        let text = `<div>
          1.创建任务时扫描目标只能是自己负责的机器、WEB服务等，不可扫描他人的任何形式的IT资源。<br>
          2.因黑盒扫描任务对扫目标造成的任何不利影响、违规事件等责任均由扫描任务创建者自行承担。<br><br>
          如果不同意上述条款，将无法使用黑盒服务。
        </div>`
        this.$alert(text, '使用黑盒扫描服务前请遵守以下约定:  ', {
          confirmButtonText: '同意',
          dangerouslyUseHTMLString: true,
          showClose: false,
          callback: action => {
            this.confirm()
          }
        });
      },
      drawTopTenVulTaskChart() {
        let topTenVulTaskChart = echarts.init(document.getElementById('top-ten-vul-task-chart'))
        topTenVulTaskChart.setOption({
          color: ['#7CE0C3', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: 'TOP10任务',
            left: 20,
            top: 20,
            textStyle: this.chartTitleStyle
          },
          tooltip: {
            trigger: 'axis'
          },
          toolbox: this.barToolbox,
          legend: this.legendStyle,
          dataset: {
            dimensions: this.topTenVulTask.columns,
            source: this.topTenVulTask.rows
          },
          xAxis: this.hBarXAxisStyle,
          yAxis: this.hBarYAxisStyle,
          grid: {
            left: 170,
            right: 135,
            top: 70,
            bottom: 50
          },
          series: [{
              type: 'bar',

              // barCategoryGap: '60%',
              // barMinWidth: 10,
              // barMaxWidth: 25
              barWidth: 20

              // itemStyle: {
              //   normal: {
              //     color: function(params) {
              //         let colorList = ['#2665B4', '#4486F7', '#73A6F7', '#DFEAFF'];
              //         return colorList[params.dataIndex];
              //     }
              //   }
              // }
            }
          ]
        })
        window.addEventListener('resize', function() {
          topTenVulTaskChart.resize()
        })
      },
      drawTopTenVulTypeChart() {
        let topTenVulTypeChart = echarts.init(document.getElementById('top-ten-vul-type-chart'))
        topTenVulTypeChart.setOption({
          color: ['#7CE0C3', '#9DC5F3', '#73A6F7', '#2665B4'],
          title: {
            text: 'TOP10漏洞类型',
            left: 20,
            top: 20,
            textStyle: this.chartTitleStyle
          },
          tooltip: {
            trigger: 'axis'
          },
          toolbox: this.barToolbox,
          legend: this.legendStyle,
          dataset: {
            dimensions: this.topTenVulType.columns,
            source: this.topTenVulType.rows
          },
          xAxis: this.hBarXAxisStyle,
          yAxis: this.hBarYAxisStyle,
          grid: {
            left: 170,
            right: 135,
            top: 70,
            bottom: 50
          },
          series: [{
              type: 'bar',
              barWidth: 20

              // barMinWidth: 20,
              // barMaxWidth: 30
              // barCategoryGap: '60%'

              // itemStyle: {
              //   normal: {
              //     color: function(params) {
              //         let colorList = ['#2665B4', '#4486F7', '#73A6F7', '#DFEAFF'];
              //         return colorList[params.dataIndex];
              //     }
              //   }
              // }
            }
          ]
        })
        window.addEventListener('resize', function() {
          topTenVulTypeChart.resize()
        })
      },
      drawTopTenTargetUseChart() {
        let topTenTargetUseChart = echarts.init(document.getElementById('top-ten-target-use-chart'))
        topTenTargetUseChart.setOption({
          color: ['#7193C6', '#73A6F7', '#2665B4', '#4486F7', '#DFEAFF'],
          title: {
            text: 'TOP10资产',
            left: 20,
            top: 20,
            textStyle: this.chartTitleStyle
          },
          tooltip: {
            trigger: 'axis'
          },
          toolbox: this.barToolbox,
          legend: this.legendStyle,
          dataset: {
            dimensions: this.topTenTargetUse.columns,
            source: this.topTenTargetUse.rows
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
            bottom: 140,
            left: 100,
            right: 135,
            top: 70
          },
          series: [{
              type: 'bar',
              barWidth: 20

              // barCategoryGap: '60%',
              // barMinWidth: 20,
              // barMaxWidth: 30

              // itemStyle: {
              //   normal: {
              //     color: function(params) {
              //         let colorList = ['#2665B4', '#4486F7', '#73A6F7', '#DFEAFF'];
              //         return colorList[params.dataIndex];
              //     }
              //   }
              // }
              // barWidth: 40
            }
          ]
        })
        window.addEventListener('resize', function() {
          topTenTargetUseChart.resize()
        })
      }
    }
  })
</script>
<style lang="less">
#octopus-index {
  // position: absolute;
  // top: 0;
  // bottom: 0;
  // .box {
  //   position: relative;
  //   border-radius: 3px;
  //   background: #fff;
  //   border-top: 3px solid #d2d6de;
  //   margin-bottom: 20px;
  //   width: 100%;
  //   box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  // }

  // .box-footer {
  //   border-top-left-radius: 0;
  //   border-top-right-radius: 0;
  //   border-bottom-right-radius: 3px;
  //   border-bottom-left-radius: 3px;
  //   border-top: 1px solid #f4f4f4;
  //   padding: 10px;
  //   background-color: #fff;
  // }

  // .box .border-right {
  //   border-right: 2px solid #f5f5f5;
  // }

  // .box-widget {
  //   border: none;
  //   position: relative;
  // }

  // .widget-user .widget-user-header {
  //   padding: 20px;
  //   height: 120px;
  //   border-top-right-radius: 3px;
  //   border-top-left-radius: 3px;
  // }

  // .widget-user .widget-user-username {
  //   margin-top: 0;
  //   margin-bottom: 5px;
  //   font-size: 25px;
  //   font-weight: 300;
  //   text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  // }

  // .widget-user .widget-user-desc {
  //   margin-top: 0;
  // }

  // .widget-user .widget-user-image {
  //   position: absolute;
  //   top: 65px;
  //   left: 50%;
  //   margin-left: -45px;
  // }

  // .widget-user .widget-user-image > img {
  //   width: 90px;
  //   height: auto;
  //   border: 3px solid #fff;
  // }

  // .widget-user .box-footer {
  //   padding-top: 30px;
  // }

  // .user-avatar {
  //   border-radius: 100%;
  //   width: 32px;
  //   height: 32px;
  //   margin-right: 10px;
  // }

  // .description-block {
  //   display: block;
  //   margin: 10px 0;
  //   text-align: center;
  // }

  // .description-block.margin-bottom {
  //   margin-bottom: 25px;
  // }

  // .description-block > .description-header {
  //   margin: 0;
  //   padding: 0;
  //   font-weight: 600;
  //   font-size: 16px;
  // }

  // .description-block > .description-text {
  //   text-transform: uppercase;
  // }

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
      background: #fff;
      padding: 23px;
    }
    .myBox {
      // border: 1px solid #d2d6de;
      border: 1px solid #E4E4E4;
      margin-top: 20px;
      .svgColor svg > path:first-of-type{
        stroke: #92D9B2 !important;
      }
      .svgColor1 svg > path:first-of-type{
        stroke: #8591B9 !important;
      }
      .svgColor2 svg > path:first-of-type{
        stroke: #9ADBFF !important;
      }
      .leftContent{
        padding: 10px !important;
        .taskTit{
          font-size: 13px;
          // font-weight: 200;
        }
        .taskContent{
          font-size: 13px;
        }
        .squareColor{
          display: inline-block;
          position: relative;
          top: 2px;
          width: 13px;
          height: 13px;
        }
        .sLightColor{
          display: inline-block;
          position: relative;
          top: 2px;
          width: 13px;
          height: 13px;
        }
      }
      .rightContent{
        padding: 10px !important;;
      }
    }
    .flexDis{
      display: flex;
      .flexItem{
        flex: 1;
      }
    }
  }

  .info-box small {
    font-size: 14px;
  }

  .info-box .progress {
    background: rgba(0, 0, 0, 0.2);
    margin: 5px -10px 5px -10px;
    height: 2px;
  }

  .info-box .progress, .info-box .progress .progress-bar {
    border-radius: 0;
  }

  .info-box .progress .progress-bar {
    background: #fff;
  }

  .info-box-icon {
    border-top-left-radius: 2px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 2px;
    color: white;
    display: block;
    float: left;
    height: 80px;
    width: 80px;
    text-align: center;
    font-size: 45px;
    line-height: 80px;
    // background: rgba(0, 0, 0, 0.2);
  }

  .info-box-icon > img {
    max-width: 100%;
  }

  .info-box-content {
    padding: 5px 10px;
    margin-left: 80px;
    // font-weight: 300;
    color: white;
  }

  .info-box-number {
    display: block;
    // font-weight: 400;
    font-size: 13.5px;
    color: white;
  }

  .progress-description, .info-box-text {
    display: block;
    font-size: 13.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .info-box-text {
    text-transform: uppercase;
  }

  .info-box-more {
    display: block;
  }

  .bg-red, .bg-yellow, .bg-green, .bg-black, .bg-red-active, .bg-yellow-active, .bg-green-active, .bg-black-active {
    color: #fff !important;
  }
  .suqare {background-color: #64CA92;}
  .suqare1 {background-color: #51639C;}
  .suqare2 {background-color: #41A6EE ;}
  .sLight {background-color: #92D9B2;}
  .sLight1 {background-color: #8591B9;}
  .sLight2 {background-color: #9ADBFF;}
  .bg-red {
    background-color: #dd4b39 !important
  }

  .bg-green {
    background-color: #00a65a !important
  }

  .bg-yellow {
    background-color: #f39c12 !important;
  }

  .bg-black {
    background-color: #111 !important;
  }

  .bg-black-active {
    background-color: #000 !important;
  }

  // .content-chart {
  //   border: 1px solid #ddd;
  //   background-color: #fff;
  //   min-height: 450px;
  //   margin-bottom: 15px;
  //   margin-top: 15px;
  // }

  .content-chart {
    background-color: #fff;
    min-height: 330px;
    margin: 11.5px;
  }
  .el-col {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .chart-header {
    border-bottom: 1px solid #ddd;
    line-height: 25px;
    padding: 5px 15px;
    font-size: 14px;
    // font-weight: bold;
    display: flex;
    justify-content: space-between;
  }
  .chart-content {
    display: flex;
    width: auto;
    height: 320px;
  }
}
  

</style>

