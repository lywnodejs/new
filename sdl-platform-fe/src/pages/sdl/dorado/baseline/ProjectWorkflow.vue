<template>
  <div class="baseline-workflow" id="baseline-workflow">
    <div class="el-main">
      <!-- 流程进度 -->
      <sticky class="dorado-sticky">
        <steps :workflow="workflowStatusDescription" :isBaselineWorkflow="true"></steps>
      </sticky>
      <!-- 基本信息 -->
      <basic v-if="basic_show" @enginner='getEnginner' :isBaselineWorkflow="true" :currentStatus="current_status">
      </basic>
      <!-- 基线要求 -->
      <baseline-requirement v-if="baseline_req_show"
        :currentStatus="current_status">
      </baseline-requirement>
      <!-- 安全评估材料 -->
      <eva-material v-if="design_eva_show"
        :currentStatus="current_status" 
        :enginner='sdl_enginner'
        :isBaselineWorkflow="true">
      </eva-material>
      <!-- SDL审计检测结果 -->
      <app-permission  v-if="audit_result_show">
        <audit-result></audit-result>
      </app-permission>
      <!-- 问题列表 -->
      <problem-list v-if="problem_list_show"  :currentStatus="current_status"></problem-list>
      <!-- 基线任务查看 -->
      <app-permission v-if="test_task_info">
        <test-taskinfo></test-taskinfo>
      </app-permission>
      <loophole-order   v-show="loophole_order" :currentStatus="current_status"></loophole-order>
      <!-- 评论 -->
      <comments></comments>
      <!-- 关注人列表 -->
      <div class="follower"> 
        <div class="followerTitle">关注人列表</div>
        <div class="followTag">
          <el-tag type="info" v-for="item in followers" :key="item.username" class="tag"><span @click="bouncePerson(item.username)">{{item.name}}</span></el-tag>
        </div>
        <app-employee class="inputFollow" v-model="follower" multiple></app-employee>
        <button class="follower-btn" type="button" @click="addFollower(sdl_project_id, follower)">添&nbsp;加</button>
        <!-- <throttle-debounce :time='2000' !isDebounce>
            <button  @click='test'>测试节流</button>
        </throttle-debounce> -->
        <!-- <button class="follower-btn" type="button" @click="throttleButton(addFollower,sdl_project_id, follower)">添&nbsp;加</button> -->
      </div>
      <evaluate-dialog :dialogVisible='dialogVisible' @projectDialog='getFormVisible'></evaluate-dialog>
    </div>
  </div>
</template>
<script>
  import Steps from '@/components/steps'
  import Sticky from '@/components/sticky'
  import Basic from '../steps/basic'
  import BaselineRequirement from '../steps/baselineRequirement'
  import EvaMaterial from '../steps/evaluationMaterial'
  import CodeEvaluation from '../steps/codeEvaluation'
  import AuditResult from '../steps/auditResult'
  import ProblemList from '../steps/problemList'
  import TestTaskinfo from '../steps/testTaskInfo'
  import loopholeOrder from '../steps/loopholeOrder'
  import evaluateDialog from '../steps/dialogs/evaluateDialog'
  import comments from '../steps/comments'
  import * as API from '@/commons/api/dorado'
  import ajax from '@/plugin/ajax'
  import { connect } from '@/lib'
  import throttle from '@/plugin/throttle'
  import * as CONSTANTS from '@/commons/dorado';

export default connect(() => {
  return {
  }
}, {
    questionnaireAuth: 'baseline_requirement/questionnaireAuth'
})({
    name: 'baseline-flow',
    components: {
        Steps,
        Sticky,
        Basic,
        BaselineRequirement,
        EvaMaterial,
        CodeEvaluation,
        AuditResult,
        ProblemList,
        TestTaskinfo,
        loopholeOrder,
        comments,
        evaluateDialog
    },
    data() {
      return {
        followers: [],
        follower: [],
        workflowStatusDescription: {},
        basic_show: false,
        baseline_req_show: false,
        design_eva_show: false,
        audit_result_show: false,
        problem_list_show: false,
        test_task_info: false,
        loophole_order: false,
        current_status: '',

        // design_eva_show: false,
        // code_eva_show: false
        isBaselineWorkFlow: true,
        dialogVisible: false,
        sdl_enginner: ''
      }
    },
    provide() {
      return {
        getWorkFlow: this.getWorkFlow
      }
    },
    created() {
      this.sdl_project_id = this.$route.query['projectId']
      this.getWorkFlow()
      this.getFollower(this.sdl_project_id)

      // this.$throttle(this.test('aaa'), 3000)
    },
    mounted() {

      // this.hint()
    },
    methods: {
      test() {
        console.log(123)
      },
      getEnginner(val) {
        this.sdl_enginner = val
        CONSTANTS.engineer.forEach(item => {
          if (item.value === val) {
            this.sdl_enginner = `${item.label}(${item.value})`
          }
        })
      },
      getWorkFlow() {
        let postJson = {
          sdl_project_id: this.sdl_project_id
        }
        ajax.post(API.getWorkflow, postJson).then(response => {
          const workflowInfo = response.data
          this.current_status = workflowInfo.workflow.current_status
          this.workflowStatusDescription = workflowInfo.workflow.status_description

          // 100: '待确认基线要求'
          // 101: '待提交评估材料'
          // 102: 'SDL复核基线确认结果'
          // 103: '代码检测中'
          // 104: 'SDL审计基线检测结果'
          // 105: '待修复检出问题'
          // 106: '代码复测中'
          // 107: '已完成'
          // this.current_status = 105
          this.basic_show = true
          this.baseline_req_show = true
          this.design_eva_show = false
          this.audit_result_show = false
          this.problem_list_show = false
          this.test_task_info = false

          if (this.current_status === 100) {
            this.design_eva_show = false

            this.$alert('<i class="el-icon-warning"></i> &nbsp;为确保评估效率，请及时反馈基线要求', {
              title: '提示',
              confirmButtonText: '确定',
              dangerouslyUseHTMLString: true,
              type: 'warning',
              customClass: 'baseline-alert'
            }).then(res => {
              document.getElementById('baselineRequirement').scrollIntoView(true)

              let setinterval = setInterval(function() {
                if (document.getElementsByClassName('selectInput')[0]) {
                  clearInterval(setinterval)
                  document.getElementsByClassName('selectInput')[0].click()
                }
              }, 100)
            });

            // this.$confirm('此操作将永久删除该文件, 是否继续?', '<i class="el-icon-warning"></i>提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'warning',
            //   center: true
            // })
          } else if (this.current_status === 101) {
            this.design_eva_show = true
          } else if (this.current_status === 102) {
            this.design_eva_show = false
          } else if (this.current_status === 103) {
            this.design_eva_show = true
            this.test_task_info = true
          } else if (this.current_status === 104) {
            this.design_eva_show = true
            this.audit_result_show = true
            this.problem_list_show = false
          } else if (this.current_status === 105) {
            this.design_eva_show = true
            this.problem_list_show = true
            this.audit_result_show = false
          } else if (this.current_status === 106) {
          } else if (this.current_status === 107) {
            this.problem_list_show = true
            this.design_eva_show = true
            this.loophole_order = true
          }
        })
        this.questionnaireAuth({sdl_project_id: this.sdl_project_id}).then(res => {
          if (res) {
            this.dialogVisible = true
          }
        })
      },
      throttleButton: throttle(function(func) {

        // console.log(func)
        let args = Array.from(arguments).slice(1);
        func.apply(this, args);
      }, 1200),
      hint() {
        const setCookie = (name, value, time) => {
          let currentTime = new Date().getTime();
          let expireTime = new Date(currentTime + time);
          document.cookie = name + '=' + value + ';expires=' + expireTime.toGMTString();
        }
        const getCookie = name => {
            let strCookie = document.cookie;
            let arrCookie = strCookie.split(';');
            for (let i = 0; i < arrCookie.length; i++) {
                let temp = arrCookie[i].split('=');
                if (temp[0] === name) {
                    return temp[1];
                }
            }
            return '';
        }

        // let h = this.$createElement;
        console.log(getCookie('hint'))
        if (!getCookie('hint')) {
          setCookie('hint', true, 60 * 1000 * 60 * 12)
        } else {

          return
        }
        this.$notify({
          title: '提示',
          dangerouslyUseHTMLString: true,
          message: '<span><i>1. A/B类项目预计2-3个工作日完成,C/D类项目预计1-2个工作日完成；</i></span><br/><span><i>2. 未完成评估的项目上线或开放外网，需要T2管理者邮件同意。</i></span>',

          // message: h('i', {style: 'color: red'}, '1. A/B类项目预计2-3个工作日完成,C/D类项目预计1-2个工作日完成；2. 未完成评估的项目上线或开放外网，需要T2管理者邮件同意。'),
          // message: `1. A/B类项目预计2-3个工作日完成,C/D类项目预计1-2个工作日完成；
          //           2. 未完成评估的项目上线或开放外网，需要T2管理者邮件同意。`,
          type: 'warning',
          duration: 10000
        });
      },
      addFollower(id, followers) {
        if (followers.length === 0) return
        ajax.post(API.addfollower, {sdl_project_id: id, follower_list: followers}).then(res => {
          this.getFollower(id)
          this.follower = []
        })
      },
      getFollower(id) {
        ajax.post(API.getfollower, {sdl_project_id: id}).then(res => {
          this.followers = res.data
        })
      },
      bouncePerson(name) {
        let url = 'http://i.xiaojukeji.com/space/personal/' + name
        window.open(url)
      },
      getFormVisible(val) {
        this.dialogVisible = val
      }
    }
  })
</script>
<style lang="less">
// .hint{
//   text-align: center;
//   margin-bottom: 20px;
// }
  .follower {
    -webkit-font-smoothing: antialiased;
    padding-top: 40px;
    .followerTitle {
      color: #333333;
      font-size: 14px;
    }
    .followTag {
      .tag {
        margin-top: 10px;
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
    span {
      // font-weight: bold;
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
  .baseline-alert{
    .el-message-box__title{
      color: red;
    }
    .el-message-box__message{
      color: red;
    }
    .el-message-box__status:before {
      padding-left: 1px;
    }
    .el-icon-warning:before {
        content: "\e62e";
    }
  }
  
</style>


