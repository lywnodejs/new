<template>
  <div id="ocean-baseline-baselineByID">
    <div class="block">
        <el-col class="statistic-box" style="margin-left: 23px;">
          <div class="box-header">
            
            <span>基线指标-项目ID查询</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-input class="inputWidth"
                        v-model="sdl_project_id"
                        placeholder="请输入项目ID"
                        clearable></el-input>
            <button type="button" class='ocean-btn' @click="fetchData"><span>查&nbsp;询</span></button>
          </div>
          <el-row v-show="sdlProjectID">
            <el-col :span="12">
                <finish-id-chart :projectID='sdlProjectID'></finish-id-chart>
            </el-col>
            <el-col :span="12">
                <scan-task-id-chart :projectID='sdlProjectID'></scan-task-id-chart>
            </el-col>
          </el-row>
          <el-row v-show="sdlProjectID">
            <el-col :span="12">
                <check-issue-id-chart :projectID='sdlProjectID'></check-issue-id-chart>
            </el-col>
            <el-col :span="12">
                <process-time-id-chart :projectID='sdlProjectID'></process-time-id-chart>
            </el-col>
          </el-row>
          <el-row v-show="!sdlProjectID">
            <el-col :span="24" class="elCol">暂无数据</el-col>
          </el-row>
          <!-- <el-row :gutter="20" class="box-content">
            <el-col :span="6" class="item">
                <div class="content"><span class="color1 point">• </span>平均时间：<span class="color1 ">{{ handleTime(finishInfo) }}</span></div>
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
                <div class="content"><span class="color1 point">• </span>创建项目-选择基线状态：<span class="color1">{{ handleTime(processTimeData.create_project_to_output_confirm.time_interval) }}</span></div>
                <div class="content"><span class="color3 point">• </span>选择基线状态-提交检测：<span class="color3">{{ handleTime(processTimeData.output_confirm_material_submit.time_interval) }}</span></div>
                <div class="content"><span class="color2 point">• </span>等待修复问题-复测：<span class="color2">{{ handleTime(processTimeData.wait_fix_issue_retest.time_interval) }}</span></div>
                <div class="content-header">-RD每两个时间动作间隔-</div>
            </el-col>
          </el-row> -->
        </el-col>
      </div>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import finishIdChart from './finishByIdChart'
  import scanTaskIdChart from './scanTaskByIdChart'
  import checkIssueIdChart from './checkIssueByIdChart'
  import processTimeIdChart from './processTimeByIdChart'

  export default connect(() => {
    return {
    }
  }, {
    baselineFinishById: 'ocean_baseline/baselineFinishById',
    baselineScanTaskById: 'ocean_baseline/baselineScanTaskById',
    baselineCheckIssueById: 'ocean_baseline/baselineCheckIssueById',
    baselineProcessTimeById: 'ocean_baseline/baselineProcessTimeById'
  })({
    data() {
      return {
        sdl_project_id: null,
        finishInfo: {},
        checkIssueInfo: {},
        scanTaskInfo: {},
        processTimeData: {},
        sdlProjectID: null
      }
    },
    created() {

        // this.fetchData()
    },
    mounted() {
    },
    components: { finishIdChart, scanTaskIdChart, checkIssueIdChart, processTimeIdChart },
    methods: {
      fetchData() {

        //   let param = {
        //     sdl_project_id: this.sdl_project_id
        //   }
        //   this.baselineFinishById(param).then(res => {
        //       this.finishInfo = res.time_interval
        //   })
        //   this.baselineCheckIssueById(param).then(res => {
        //       this.checkIssueInfo = res.test_task
        //   })
        //   this.baselineScanTaskById(param).then(res => {
        //       this.scanTaskInfo = res.test_task
        //   })
        //   this.baselineProcessTimeById(param).then(res => {
        //       this.processTimeData = res
        //   })
        this.sdlProjectID = this.sdl_project_id
      },
      handleTime(time) {
          if (!time) {
              return '暂无数据'
          }
          let arr = time.split(' ')
          let arr1 = arr[1].split(':')
          let str = arr[0] + ' 天 ' + arr1[0] + ' 时 ' + arr1[1] + ' 分 ' + arr1[2] + ' 秒 '
          return str
      }
    }
  })
</script>

<style lang="less">
#ocean-baseline-baselineByID{
     margin-top:11.5px;
     margin-right: 23px;
    .block {
     
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
        .elCol{
          display: flex;
          height: 100px;
          color: #888;
          justify-content: center;
          align-items: center;
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
    .inputWidth {
        width: 160px;
    }
    .ocean-btn {
      background: #FC9153;
      border-radius: 4px;
      width: 95px;
      height: 32px;
      border: none;
      color: white;
      margin-top: 8px;
      margin-left: 50px;
      font-size: 13px;
      -webkit-font-smoothing: antialiased;
      cursor: pointer;
      span {
        font-family: Avenir, Helvetica, Arial, sans-serif;
      }
    }
}
</style>

