<template>
  <div id="ocean-baseline-baselineByTime">
    <div class="block">
        <el-col class="statistic-box" style="margin-left: 23px;">
          <div class="box-header">
            
            <span>基线指标-时间查询</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-date-picker
                  @change="changeTime(time)"
                    v-model="time"
                    type="daterange"
                    align="right"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <el-row>
            <el-col :span="8">
                <finish-by-time-chart :time='time'></finish-by-time-chart>
            </el-col>
            <el-col :span="8">
                <check-issue-time-chart :time='time'></check-issue-time-chart>
            </el-col>
            <el-col :span="8">
                <scan-task-time-chart :time='time'></scan-task-time-chart>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="12">
                <finish-by-time-chart :time='time'></finish-by-time-chart>
            </el-col>
            <el-col :span="12">
                <check-issue-time-chart :time='time'></check-issue-time-chart>
            </el-col>
          </el-row> -->
          <!-- <el-row :gutter="20" class="box-content">
            <el-col :span="6" class="item">
                <div class="content"><span class="color1 point">• </span>平均时间：<span class="color1 ">{{ handleTime(finishInfo.avg) }}</span></div>
                <div class="content"><span class="color3 point">• </span>最大时间：<span class="color3 ">{{ handleTime(finishInfo.max) }}</span></div>
                <div class="content"><span class="color2 point">• </span>最少时间：<span class="color2 ">{{ handleTime(finishInfo.min) }}</span></div>
                <div class="content-header">-项目完成时间-</div>
            </el-col>
            <el-col :span="6"  class="item">
                <div class="content"><span class="color1 point">• </span>平均时间：<span class="color1 ">{{ handleTime(checkIssueInfo.avg) }}</span></div>
                <div class="content"><span class="color3 point">• </span>最大时间：<span class="color3 ">{{ handleTime(checkIssueInfo.max) }}</span></div>
                <div class="content"><span class="color2 point">• </span>最少时间：<span class="color2 ">{{ handleTime(checkIssueInfo.min) }}</span></div>
                <div class="content-header">-查询人工审计时间-</div>
            </el-col>
            <el-col :span="6"  class="item">
                <div class="content"><span class="color1 point">• </span>平均时间：<span class="color1">{{ handleTime(scanTaskInfo.avg) }}</span></div>
                <div class="content"><span class="color3 point">• </span>最大时间：<span class="color3">{{ handleTime(scanTaskInfo.max) }}</span></div>
                <div class="content"><span class="color2 point">• </span>最少时间：<span class="color2">{{ handleTime(scanTaskInfo.min) }}</span></div>
                <div class="content-header">-fatbird首轮扫描时间-</div>
            </el-col>
            <el-col :span="5"  class="item">
                <div class="content"><span class="color1 point">• </span>平均时间：<span class="color1">{{ handleTime(processTimeData.fix_issue.avg) }}</span></div>
                <div class="content"><span class="color3 point">• </span>最大时间：<span class="color3">{{ handleTime(processTimeData.fix_issue.max) }}</span></div>
                <div class="content"><span class="color2 point">• </span>最少时间：<span class="color2">{{ handleTime(processTimeData.fix_issue.min) }}</span></div>
                <div class="content-header">-RD每两个时间动作间隔-</div>
            </el-col>
          </el-row> -->
        </el-col>
      </div>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import finishByTimeChart from './finishByTimeChart'
  import checkIssueTimeChart from './checkIssueByTimeChart'
  import scanTaskTimeChart from './scanTaskByTimeChart'

  export default connect(() => {
    return {
    }
  }, {
    baselineFinishByTime: 'ocean_baseline/baselineFinishByTime',
    baselineScanTaskByTime: 'ocean_baseline/baselineScanTaskByTime',
    baselineCheckIssueByTime: 'ocean_baseline/baselineCheckIssueByTime',
    baselineProcessTimeByTime: 'ocean_baseline/baselineProcessTimeByTime'
  })({
    data() {
      return {
        time: ['', ''],
        start_day: '',
        end_day: '',
        finishInfo: {},
        checkIssueInfo: {},
        scanTaskInfo: {},
        processTimeData: {}
      }
    },
    created() {
        this.getCurrentTime()
        this.changeTime(this.time)
        this.fetchData()
    },
    mounted() {
    },
    components: {finishByTimeChart, checkIssueTimeChart, scanTaskTimeChart},
    methods: {
      fetchData() {
      },
      decimalToPercent(val) {
        let percent = Number(val * 100).toFixed(1)
        percent += '%'
        return percent
      },
      handleTime(time) {
          if (!time) {
              return '暂无数据'
          }
          let arr = time.split(' ')
          let arr1 = arr[1].split(':')
          let str = arr[0] + ' 天 ' + arr1[0] + ' 时 ' + arr1[1] + ' 分 ' + arr1[2] + ' 秒 '
          return str
      },
      changeTime(time) {
        this.start_day = time[0]
        this.end_day = time[1]
        this.fetchData()
      },
      getCurrentTime() {
        let nowdate = new Date();
        let y = nowdate.getFullYear();
        let m = nowdate.getMonth() + 1;
        let d = nowdate.getDate();
        if (m < 10) {
          m = '0' + m
        }
        if (d < 10) {
          d = '0' + d
        }
        this.time[1] = y + '-' + m + '-' + d;
        nowdate.setMonth(nowdate.getMonth() - 1);
        y = nowdate.getFullYear();
        m = nowdate.getMonth() + 1;
        d = nowdate.getDate();
        if (m < 10) {
          m = '0' + m
        }
        if (d < 10) {
          d = '0' + d
        }
        this.time[0] = y + '-' + m + '-' + d;
      }
    }
  })
</script>

<style lang="less">
#ocean-baseline-baselineByTime{
    margin-top:11.5px;
     margin-right: 23px;
    .block {
    //   margin: 23px 11.5px 11.5px 11.5px;
      display: flex;
      .statistic-box {
        color: #333;
        background-color: white;
        .box-header {
          padding: 15px 23px;
          font-size: 12.5px;
          font-style: normal;
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
              padding-left: 10px;
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
}
</style>

