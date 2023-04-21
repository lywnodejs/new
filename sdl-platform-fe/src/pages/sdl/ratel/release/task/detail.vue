<template>
    <div id="ratel-task-detail">
      <el-button type="primary" class="export-pdf" @click="pdf">导出PDF</el-button>
       <div id="export-pdf-id" class="el-main">
        <h4 class="myH4">详细信息</h4>
        <div class="basicContentDisplay">
          <div class="items">
            <span class="c1">任务ID：</span>
            <span class="c2">{{ratelTaskList.ratel_task_id}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">所属项目ID：</span>
            <span class="c2"><span class="href" @click="bounceUrl(ratelTaskList.ratel_project_id)">{{ratelTaskList.ratel_project_id}}</span></span>
          </div>
          <div class="items">
            <span class="c1">应用名称：</span>
            <span class="c2">
              <div class="flexbox">
                    <img class="appIcon" :src="projectTaskList.icon_link" alt="">&nbsp;
                    <span>{{projectTaskList.app_release_name}}</span>
                  </div>
            </span>
          </div>
          <div class="rightItem">
            <span class="c1">Git 路径：</span>
            <span class="c2">{{projectTaskList.git_url}}</span>
          </div>
          <div class="items">
            <span class="c1">应用标识：</span>
            <span class="c2">{{projectTaskList.app_package_name}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">代码分支：</span>
            <span class="c2">{{projectTaskList.git_branch}}</span>
          </div>
          <div class="items">
            <span class="c1">平台：</span>
            <span class="c2">{{projectTaskList.app_type}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">发版人：</span>
            <span class="c2">{{ratelTaskList.rd_zh}}</span>
          </div>
          <div class="items">
            <span class="c1">应用类型：</span>
            <span class="c2">{{ratelTaskList.app_type}}</span>
          </div>
          <div class="rightItem">
              <span class="c1">所属部门：</span>
            <span class="c2">{{ratelTaskList.dept_name}}</span>
          </div>
          <div class="items">
            <span class="c1">扫描开始时间：</span>
            <span class="c2">{{ratelTaskList.scan_begin_time}}</span>

          </div>
          <div class="rightItem">
              <span class="c1">证书：</span>
            <span class="c2">{{ratelTaskList.certification}}</span>
          </div>
          <div class="items">
            <span class="c1">扫描结束时间：</span>
            <span class="c2">{{ratelTaskList.scan_end_time}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">MD5：</span>
            <span class="c2">{{ratelTaskList.app_md5}}</span>
          </div>
          <div class="items">
            <span class="c1">任务创建时间：</span>
            <span class="c2">{{ratelTaskList.task_create_time}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">下载地址：</span>
            <span class="c2"><a :href="ratelTaskList.app_url" class="href">点击下载</a></span>
          </div>
          <div class="items">
            <span class="c1">任务结束时间：</span>
            <span class="c2">{{ratelTaskList.task_end_time}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">静态状态：</span>
            <span class="c2"><el-tag :type='judgeStatus(ratelTaskList.static_status)'>{{ratelTaskList.static_status_info}}</el-tag></span>
          </div>
          <div class="items">
            <span class="c1">动态状态：</span>
            <span class="c2"><el-tag :type='judgeStatus(ratelTaskList.dynamic_status)'>{{ratelTaskList.dynamic_status_info}}</el-tag></span>
          </div>
          <div class="rightItem"></div>
      </div>
      <!-- <el-collapse v-model="activeNames" class="collapse-info">
        <el-collapse-item :title='"引用SDK列表（"+ ratelTaskList.app_sdk.length + "个）"' name="1" >
            <div class="collapse-info__box">
                <span v-for="(item,index) in ratelTaskList.app_sdk" :key="index">{{item}}</span>&nbsp;
                <span></span>
            </div>
        </el-collapse-item>
        <el-collapse-item :title='"申请权限列表（"+ ratelTaskList.app_permission.length + "个）"' name="2">
            <div class="collapse-info__box">
                <span v-for="(item, index) in ratelTaskList.app_permission" :key="index">{{item}}</span>&nbsp;
                <span></span>
            </div>
        </el-collapse-item>
      </el-collapse> -->
        <div class="follower">
            <h4 class="myH4">申请权限列表</h4>
            <app-permission-list></app-permission-list>
        </div>
        <div class="follower">
            <h4 class="myH4">SDK检测列表</h4>
            <app-sdk-list ></app-sdk-list>
        </div>
        <div class="follower">
            <h4 class="myH4">静态检测结果</h4>
            <task-result-list :status='ratelTaskList.static_status'></task-result-list>
        </div>
        <div class="follower">
            <h4 class="myH4">移动沙箱检测结果</h4>
            <move-result-list :status='ratelTaskList.dynamic_status'></move-result-list>
        </div>
      </div>
      <div class="submitButton">
        <el-button v-show="ratelTaskList.dynamic_status===3 || ratelTaskList.static_status===3" type="warning" class="ratel-button" @click="ratelCommit" :disabled="isDisabled">提 交</el-button>
       <!-- <el-button  class="ratel-button" type="warning" @click="ratelCommit" :disabled="isDisabled">提 交</el-button> -->
      </div>
    </div>
</template>
<script>
import {connect} from '@/lib'
import taskResultList from './components/taskResultList'
import appPermissionList from './components/appPermissionList'
import appSdkList from './components/appSdkList'
import moveResultList from './components/moveResultList'

  export default connect(() => {
    return {
    }
  }, {
        getRatelTaskDetail: 'ratel_project/getRatelTaskDetail',
        getListByTaskId: 'ratel_project/getListByTaskId',
        getRatelCommit: 'ratel_project/getRatelCommit'
  })({
    data() {
        return {
          activeNames: [],
          ratel_task_id: parseInt(this.$route.query.ratel_task_id),
          projectTaskList: [],
          ratelTaskList: [],
          isDisabled: false
      }
    },
    created() {
        this.fetchData()
    },
    watch: {
      isDisabled(val) {
        if (val) {
          setTimeout(() => { this.isDisabled = false }, 1000);
        }
      }
    },
    components: {taskResultList, appSdkList, appPermissionList, moveResultList},
    methods: {
        fetchData() {
            let params = {ratel_task_id: this.ratel_task_id}
            this.getRatelTaskDetail(params).then(res => {

                // console.log(res)
                this.projectTaskList = res.ratel_project
                this.ratelTaskList = res.ratel_task
            })
        },
        pdf() {
          this.$getPdf(`${this.ratel_task_id}检测任务详情`, '#export-pdf-id')
        },
        ratelCommit() {
          this.isDisabled = true
            let params = {ratel_task_id: this.ratel_task_id}
            this.getRatelCommit(params).then(res => {

              // location.reload()
            })

            location.reload()
        },
        bounceUrl(id) {
          let url = '/sdl/ratel/release/project/detail?ratel_project_id=' + id
          window.open(url)
        },
        judgeStatus(status) {
          if (status >= 5) {
            return 'info'
          }
          if (status == 4) {
            return 'success'
          }
          if (status == 3) {
            return 'warning'
          }
          if (status == 2) {
            return 'danger'
          }
          if (status == 0 || status == 1) {
            return ''
          }
        }
    }
})
</script>
<style lang="less">
  #ratel-task-detail {
        margin: auto;
        width: 100%;
        height: 100%;
        background: white;
        // margin-top: -15px;
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        .export-pdf{
          position: absolute;
          z-index: 10000;
          top: 5px;
          right: 50px;
        }
        .el-main {
          .task {
            margin-top: 30px;
          }
          .myH4{
            color: #333333;
            font-size: 14px;
            margin: 0;
            font-weight: normal;
            margin-bottom: 10px;
          }
            width: 100%;
            box-sizing: border-box;
            background: white;
            .flexbox {
            display: flex;
            align-items: center;
            .appIcon {
              width: 15px;
              height: 15px;
              border-radius: 3px;
            }
          }
        }
        .ratel-button{
            background: #FC9153;
            border-radius: 4px;
            width: 95px;
            height: 32px;
            border: none;
            color: white;
            margin-top: 5px;
            font-size: 13px;
            -webkit-font-smoothing: antialiased;
            cursor: pointer;
            span {
            font-family: Avenir, Helvetica, Arial, sans-serif;
            }
        }
        .basicContentDisplay {
          margin-top: 10px;
          padding-bottom: 10px;
          display: flex;
          flex-wrap: wrap;
          background: #ffff;
          box-sizing: border-box;
          border: 1px solid #e2e2e2;
          border-radius: 8px;
          font-size: 13px;
          .items {
            padding-top: 10px;
            flex: 1;
            flex-basis: 40%;
            justify-content: center;
            display: flex;
            // font-size: 15px;
            font-family: "Helvetica Neue", "Helvetica", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\8F6F\96C5\9ED1", "Arial", "sans-serif";
            color: gray;
            .c1 {
                flex: 2;
                text-align: left;
                padding-left: 20px;
            }
            .c2 {
                flex: 5;
                color: black;
                font-family: PingFang-SC;
                .href{
                  color: #fc9153;
                  font-size: 13px;
                  text-decoration: underline;
                  cursor: pointer;
                }
            }
          }
          .rightItem {
            padding-top: 10px;
            flex: 2;
            flex-basis: 60%;
            justify-content: center;
            display: flex;
            // font-size: 15px;
            font-family: "Helvetica Neue", "Helvetica", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\8F6F\96C5\9ED1", "Arial", "sans-serif";
            color: gray;
            .c1 {
                flex: 2;
                text-align: left;
                padding-left: 20px;
            }
            .c2 {
                flex: 11;
                color: black;
                font-family: PingFang-SC;
                .href{
                  color: #fc9153;
                  font-size: 13px;
                  text-decoration: underline;
                }
                .el-tag{
                  position: relative;
                  top: -2px;
                  height: 25px;
                  line-height: 23px;
                }
            }
          }
        }
        .follower {
          margin-top: 30px;
          .followTag {
            // margin-top: -5px;
            .tag {
              border: none;
              color: #fc9153;
              background: white;
              font-size: 12px;
              span{
                font-weight: 400;
                cursor: pointer;
              }
            }
          }
        }
         .collapse-info{
           margin-top: 30px;
            margin-bottom: 20px;
            .el-table__expanded-cell{padding: 10px;}
            // .el-table__row>td{
            //     border: none;
            // }
            .el-table::before {
                left: 0;
                bottom: 0;
                width: 100%;
                height: 0px;
            }
            &__box{
                display: flex;
                width: 100%;
                // justify-content: space-around;
                flex-wrap: wrap;
                line-height: 25px;
                span{
                    color: #616367;
                    flex-flow: 1;
                    padding-left: 20px;
                    width: 40%;
                    margin: 0 auto;
                    align-self: center;
                    font-size: 12.5px;
                    font-style: monospace;
                }
            }
        }
        .el-button--warning.is-disabled, .el-button--warning.is-disabled:active, .el-button--warning.is-disabled:focus, .el-button--warning.is-disabled:hover {
            color: #bcbec2;
            background-color: #f4f4f5;
            border-color: #e9e9eb;
        }
  }

</style>
