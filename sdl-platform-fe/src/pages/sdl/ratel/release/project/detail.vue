<template>
    <div id="ratel-project-detail">
      <div class="el-main">
        <h4 class="myH4">详细信息</h4>
        <div class="basicContentDisplay">
          <div class="items">
            <span class="c1">ID：</span>
            <span class="c2">{{projectTaskList.ratel_project_id}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">应用名称：</span>
            <span class="c2">
                  <div class="flexbox">
                    <img class="appIcon" :src="projectTaskList.icon_link" alt="">&nbsp;
                    <span>{{projectTaskList.app_release_name}}</span>
                  </div>
            </span>
          </div>
          <div class="items">
            <span class="c1">应用标识：</span>
            <span class="c2">{{projectTaskList.app_package_name}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">Git 路径：</span>
            <span class="c2">{{projectTaskList.git_url}}</span>
          </div>
          <div class="items">
            <span class="c1">平台：</span>
            <span class="c2">{{projectTaskList.app_type}}</span>
          </div>
           <div class="rightItem">
            <span class="c1">代码分支：</span>
            <span class="c2">{{projectTaskList.git_branch}}</span>
          </div>
          <div class="items">
            <span class="c1">创建时间：</span>
            <span class="c2">{{projectTaskList.create_time}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">应用负责人：</span>
            <span class="c2">{{projectTaskList.app_owner_zh}}
                <span class="el-icon-edit myIcon" @click="openDialog"></span>
              
            </span>
          </div>
           
          <div class="items">
            <span class="c1">最近检测时间：</span>
            <span class="c2">{{projectTaskList.last_check_time}}</span>
          </div>
          <div class="rightItem">
              <span class="c1">所属部门：</span>
            <span class="c2">{{projectTaskList.dept_name}}</span>
          </div>
          
          <div class="rightItem">
          </div>
      </div>
      <div class="follower">
            <h4 class="myH4">任务列表</h4>
            <task-list ref="taskList"></task-list>
      </div>
      <div class="follower">
            <h4 class="myH4">漏洞列表</h4>
            <vul-list ref="vulList"></vul-list>
      </div>
      <div class="follower">
          <h4 class="myH4">关注人列表</h4>
          <div class="followTag">
            <el-tag type="info" v-for="item in followers" :key="item.account" class="tag"><span @click="bouncePerson(item.account)">{{item.name_zh}}</span></el-tag>
          </div>
          <app-employee class="inputFollow" v-model="follower" multiple></app-employee>
          <button class="follower-btn" type="button" @click="addFollower(follower)">添&nbsp;加</button>
        </div>
      </div>
      <owner-dialog :dialogFormVisible='dialogVisible' @getFormVisible='getFormVisible'></owner-dialog>
    </div>
</template>
<script>
import {connect} from '@/lib'
import vulList from './components/vulList'
import taskList from './components/taskList'
import ownerDialog from './components/changeOwnerDialog'

  export default connect(() => {
    return {
    }
  }, {
    getRatelProjectDetail: 'ratel_project/getRatelProjectDetail',
    getRatelFollower: 'ratel_project/getRatelFollower',
    addRatelFollower: 'ratel_project/addRatelFollower'
  })({
    data() {
        return {
            ratel_project_id: parseInt(this.$route.query.ratel_project_id),
            projectTaskList: [],
            followers: [],
            follower: [],
            dialogVisible: false
      }
    },
    created() {
        this.fetchData()
      this.getFollower(this.ratel_project_id)
    },
    components: {vulList, taskList, ownerDialog},
    methods: {
        fetchData() {
            this.getRatelProjectDetail({ratel_project_id: this.ratel_project_id}).then(res => {
                console.log(res)
                this.projectTaskList = res
            })
        },
        middleMethod() {
          this.fetchData()
          this.$refs.taskList.fetchData()
          this.$refs.vulList.fetchData()
          this.getFollower(this.ratel_project_id)
        },
        openDialog() {
          this.dialogVisible = true
        },
        getFormVisible(val) {
          this.dialogVisible = val
        },
        addFollower(followers) {
          this.addRatelFollower({ratel_project_id: this.ratel_project_id, follower_list: followers}).then(res => {
            this.getFollower(this.$route.query.ratel_project_id)
            this.follower = []
          })
        },
        getFollower(id) {
            this.getRatelFollower({ratel_project_id: id}).then(res => {
              this.followers = res
            })
        },
        bouncePerson(name) {
            let url = 'http://i.xiaojukeji.com/space/personal/' + name
            window.open(url)
        }
    }
})
</script>
<style lang="less">
  #ratel-project-detail {
        margin: auto;
        width: 100%;
        height: 100%;
        background: white;
        // margin-top: -15px;
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
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
            .displayFlex {
                display: flex;
            }
            .searchForm {
                .searchInput {
                width: 320px;
                }
            }
          .aLink{
            color: #FC9153;
          }
          .flexbox {
            display: flex;
            align-items: center;
            .appIcon {
              width: 15px;
              height: 15px;
              border-radius: 3px;
            }
          }
          .el-tag{
            height: 25px;
            line-height: 25px;
          }
          .blue{
            background-color: rgba(64,158,255,.1);
            color: #409eff;
            border: 1px solid rgba(64,158,255,.2);
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
                .myIcon{
                  color: #fc9153;
                  cursor: pointer;
                  font-size: 15px;
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
          .inputFollow {
            margin-top: 10px;
            width: 100%;
          }
          .follower-btn {
            height: 32px;
            width: 100px;
            text-align: center;
            padding: 5px;
            border: 1px solid #fc9153;
            background: #fc9153;
            border-radius: 4px;
            // font-weight: 100;
            color: white;
            cursor: pointer;
            margin-top: 15px;
            font-size: 12px;
          }
        }
        .linkClass{
          cursor: pointer;
          color: #FC9153;
        }
  }
  .vulEvalu-btn {
    background: #FC9153;
    border-radius: 4px;
    height: 36px;
    width: 90px;
    padding: 5px;
    border: none;
    // font-weight: 100;
    margin-right: 12px;
  }

</style>

