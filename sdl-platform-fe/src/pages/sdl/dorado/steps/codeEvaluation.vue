<template>
  <div id="codeEvaluation">
    <!-- <span>
      <h3>代码安全评估材料</h3>
    </span> -->
    <div class="codeEvaluationTitle" v-if="!isBaselineWorkflow">代码安全评估材料</div>
    <code-white-evaluation :currentStatus="currentStatus" :isBaselineWorkflow="isBaselineWorkflow"></code-white-evaluation>
    <code-black-evaluation :currentStatus="currentStatus" :isBaselineWorkflow="isBaselineWorkflow"></code-black-evaluation>
    <button v-if="currentStatus=='5' && !isBaselineWorkflow" type="button" class="codeEval-btn" @click="confirmSubmitCodeEvaluation">确认提交
    </button>
  </div>
</template>

<script>
  import CodeWhiteEvaluation from '@/pages/sdl/dorado/steps/codeWhiteEvaluation'
  import CodeBlackEvaluation from '@/pages/sdl/dorado/steps/codeBlackEvaluation'
  import ajax from '@/plugin/ajax'
  import * as API from '@/commons/api/dorado'

  export default {
    components: {
      CodeWhiteEvaluation,
      CodeBlackEvaluation
    },
    props: {
      currentStatus: {},
      isBaselineWorkflow: {
        default: false
      }
    },

    // [
    //   'currentStatus',
    //   'isBaselineWorkflow'
    // ],
    inject: ['getWorkFlow'],
    name: 'code-evalution',
    methods: {
      confirmSubmitCodeEvaluation() {
        let postJson = {
          sdl_project_id: this.$route.query['projectId']
        }
        ajax.post(API.confirmCodeEvaluationInfo, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '成功',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.getWorkFlow()
        })
      }
    }

  }
</script>
<style lang="less" scoped>
  #codeEvaluation {
    padding-top: 40px;
    .codeEvaluationTitle {
      color: #333333;
      font-size: 14px;
      -webkit-font-smoothing: antialiased;
    }
  }
  .codeEval-btn {
    margin-top: 15px;
    height: 32px;
    width: 100px;
    padding: 5px;
    font-size: 12px;
    background: #fc9153;
    border-radius: 4px;
    border: none;
    color: white;
    cursor: pointer;
    // font-weight: 100;
    -webkit-font-smoothing: antialiased;
  }
</style>
