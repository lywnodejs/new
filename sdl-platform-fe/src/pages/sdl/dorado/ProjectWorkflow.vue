<template>
  <div class="workflow" id="workflow">
    <div class="el-main">
      <sticky class="dorado-sticky">
        <steps :workflow="workflowStatusDescription">
        </steps>
      </sticky>
      <basic v-if="basic_show" v-show="basic_show">
      </basic>
      <design v-if="design_eva_show" v-show="design_eva_show" :currentStatus="current_status" :skipDesign="skip_design">
      </design>
      <design v-if='design_skip_show' :currentStatus="current_status" :skipDesign="skip_design">
      </design>
      <app-permission v-if="design_eva_result_show">
        <design-result :currentStatus="current_status">
        </design-result>
        <design-result v-if="current_status>=4" :currentStatus="current_status">
        </design-result>
      </app-permission>
      <code-evaluation v-if="code_eva_show" :currentStatus="current_status">
      </code-evaluation>
      <app-permission v-if="code_eva_result_show">
        <code-result :currentStatus="current_status">
        </code-result>
        <code-result v-if="current_status>=7" :currentStatus="current_status">
        </code-result>
      </app-permission>
      <div class="follower">
        <!-- <h3>关注人列表</h3> -->
        <div class="followerTitle">关注人列表</div>
        <div class="followTag">
          <el-tag type="info" v-for="item in followers" :key="item.username" class="tag"><span @click="bouncePerson(item.username)">{{item.name}}</span></el-tag>
        </div>
        <app-employee class="inputFollow" v-model="follower" multiple></app-employee>
        <button class="follower-btn" type="button" @click="addFollower(sdl_project_id, follower)">添&nbsp;加</button>
      </div>
    </div>
  </div>

</template>

<script>
  import Steps from '@/components/steps'
  import Sticky from '@/components/sticky'
  import Basic from './steps/basic'
  import Design from './steps/design'
  import DesignResult from './steps/designResult'
  import CodeEvaluation from './steps/codeEvaluation'
  import CodeResult from './steps/codeResult'
  import ajax from '@/plugin/ajax'
  import * as API from '@/commons/api/dorado'

  export default {
    name: 'project-flow',
    components: {
      Steps,
      Sticky,
      Basic,
      Design,
      DesignResult,
      CodeEvaluation,
      CodeResult
    },
    data() {
      return {
        followers: [],
        follower: [],
        sdl_project_id: 0,
        skip_design: 1,
        current_status: 3,

        workflowStatusDescription: {},
        basic_show: false,
        design_skip_show: false,
        design_eva_show: false,
        design_eva_result_show: false,
        code_eva_show: false,
        code_eva_result_show: false
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
    },
    methods: {
      getWorkFlow() {

        let postJson = {
          sdl_project_id: this.sdl_project_id
        }

        // this.getCurrentWorkflow(this.sdl_project_id)

        ajax.post(API.getWorkflow, postJson).then(response => {
          const workflowInfo = response.data
          this.skip_design = workflowInfo.is_skip_design
          this.current_status = workflowInfo.workflow.current_status
          this.workflowStatusDescription = workflowInfo.workflow.status_description
          if (this.workflowStatusDescription.create_project_step_status !== 'wait') {
            this.basic_show = true
          }
          if (this.skip_design === 1) {
            this.design_eva_show = false
            this.design_eva_result_show = false
            this.design_skip_show = true
          } else {
            if (this.current_status >= 2) {
              this.design_eva_show = true
            } else {
              this.design_eva_show = false
            }

            // 状态3：设计安全评估中

            if (this.current_status >= 3) {
              this.design_eva_result_show = true
            } else {
              this.design_eva_result_show = false
            }
          }

          if (this.current_status >= 5) {
            this.code_eva_show = true
          } else {
            this.code_eva_show = false
          }
          if (this.current_status >= 6) {
            this.code_eva_result_show = true
          } else {
            this.code_eva_result_show = false
          }
        })
      },
      addFollower(id, followers) {
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
      }
    }
  }
</script>
<style lang="less">
  .workflow {
    background-color: white;
    // margin-top: -15px;
  }
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

</style>
