<template>
  <el-steps
    align-center
    finish-status="success"
    process-status="process">
    <el-step class="workflowStatus"
      title="项目创建" @click.native='jump("#basic")'
      :description=workflow.create_project_step_description
      :status=workflow.create_project_step_status>
    </el-step>
    <el-step class="workflowStatus" v-if="!isBaselineWorkflow"
      title="设计安全评估" @click.native='jump("#design")'
      :description=workflow.design_eva_step_description
      :status=workflow.design_eva_step_status>
    </el-step>
    <el-step class="workflowStatus" v-if="isBaselineWorkflow"
      title="设计安全评估" @click.native='jump("#baselineRequirement")'
      :description=workflow.design_eva_step_description
      :status=workflow.design_eva_step_status>
    </el-step>
    <el-step class="workflowStatus" v-if="!isBaselineWorkflow"
      title="代码安全评估" @click.native='jump("#codeEvaluation")'
      :description=workflow.code_eva_step_description
      :status=workflow.code_eva_step_status>
    </el-step>
    <el-step class="workflowStatus" v-if="isBaselineWorkflow"
      title="代码安全评估" @click.native='jump("#evaMaterial")'
      :description=workflow.code_eva_step_description
      :status=workflow.code_eva_step_status>
    </el-step>
    <el-step class="workflowStatus"
      title="评估结束" @click.native='jump("#codeResult")'
      :description=workflow.close_project_step_description
      :status=workflow.close_project_step_status>
    </el-step>

  </el-steps>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      url: ''
    }
  },
  props: {
    workflow: {},
    isBaselineWorkflow: {
      default: false
    }
  },
  mounted: function() {

    // this.$nextTick(function() {
    //   window.addEventListener('scroll', this.jump)
    // })
  },
  methods: {
    jump(index) {
      try {
        document.querySelectorAll('.app-container__main')[0].style.marginTop = '0'
        document.querySelectorAll(index)[0].scrollIntoView({behavior: 'smooth'})

        // document.querySelectorAll('.app-container__main')[0].style.marginTop = '10px'
      } catch (error) {

        // document.querySelectorAll('.app-container__main')[0].style.marginTop = '12px'
      }
    }
  }
}
</script>
<style lang="less">
  .el-steps {
    background-color: #FFFFFF;
  }
  .el-step__icon{
      width: 36px;
      height: 36px;
  }
  .el-step__icon.is-text{
    border-width: 1px;
  }
  .el-step__head.is-success{
    .el-step__icon.is-text{
      background-color:  #FC9153;
      color: white;
    }
  }
  .el-step.is-center .el-step__line{
    left: 60%;
    right: -40%;
  }
  .el-step.is-horizontal .el-step__line{
    top:17px;
    height: 1px;
  }
  .el-step__title.is-success{
    color: #FC9153;
  }
  .el-step__description.is-success{
    color: #FC9153;
  }
  .el-step__description.is-process{
    color: #FC9153;
  }
  .el-step__head.is-process{
    color: #FC9153;
    border: #FC9153;
  }
  .el-step__title.is-process{
    color: #FC9153;
  }
  // .el-step__icon.is-text{
  //   bor
  // }
  .el-step.is-center .el-step__description{
    // color: #FC9153
  }
  .el-step__description.is_wait{
    color: #c0c4cc
  }
  .workflowStatus{
    cursor: pointer;
  }
</style>
