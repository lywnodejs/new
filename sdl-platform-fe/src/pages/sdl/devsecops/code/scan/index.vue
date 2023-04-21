<template>
  <div id="devsecops">
      <code-scan :datas='codeScanData'></code-scan>
      <ops-scan :datas='opsScanData'></ops-scan>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import codeScan from './components/code-scan'
  import opsScan from './components/ops-scan'

  export default connect(() => {
    return {
    }
  }, {
    getAllResults: 'devsecops_index/getAllResults',
    updateRuleResult: 'devsecops_index/updateRuleResult',
    updateBaselineResult: 'devsecops_index/updateBaselineResult',
    updateVulResult: 'devsecops_index/updateVulResult'
  })({
    data() {
      return {
        codeScanData: null,
        opsScanData: null,
        taskId: this.$route.query['taskId'] || 0
      }
    },
    components: { codeScan, opsScan },
    created() {
        this.fetchData()

        // this.updateRuleResult({taskId: 51})
        // this.updateBaselineResult({taskId: 51})
        // this.updateVulResult({taskId: 51})
    },
    mounted() {
    },
    methods: {
      fetchData() {
        this.getAllResults({taskId: parseInt(this.taskId)}).then(res => {
          let data = res.data
          console.log(data)
          this.codeScanData = data ? data.codeScan : ''
          this.opsScanData = data ? data.opsScan : ''
        })
      }
    }
  })
</script>

<style lang="less">
#devsecops{
  background: white;
    margin: 23px 20px;
    .container{
        width: 100%;
        background: #596385;
        height: 50px;
        .items{
            margin-top: 9px;
            margin-left: 5px;
            color: white !important;
        }
    }
}
</style>

