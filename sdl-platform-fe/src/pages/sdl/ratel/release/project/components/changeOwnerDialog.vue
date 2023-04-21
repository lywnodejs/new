<template>
       <el-dialog 
            id="ratel-release-changeowner-dialog" 
            :visible.sync="dialogVisible" 
            title="变更应用负责人"
            width="460px">
       <el-form :inline="true" label-width="100px" label-position="left" >
        
        <el-form-item label="应用负责人">
          <app-employee class="inputWidth" v-model="queryParam.app_owner"></app-employee>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="dialogVisible = false">取消</el-button>
        <el-button class="octopus-diaolog-btn" type="primary" @click="fetchData()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>

// import * as CONSTANTS from '@/commons/dorado'
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
    changeRatelAppOwner: 'ratel_project/changeRatelAppOwner'
})({
  props: ['dialogFormVisible'],
  data() {
    return {
      dialogVisible: null,
      queryParam: {
          app_owner: null,
          ratel_project_id: parseInt(this.$route.query['ratel_project_id'])
      }
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    dialogFormVisible(val) {
        this.dialogVisible = val
    },
    dialogVisible(val) {
        this.$emit('getFormVisible', this.dialogVisible)
    }
  },
  methods: {
    fetchData() {
        this.changeRatelAppOwner(this.queryParam).then(res => {

            this.$parent.middleMethod()

            // location.reload()
            this.dialogFormVisible = false
        })
    }
  }
})
</script>
<style lang="less">
#ratel-release-changeowner-dialog{
    .octopus-diaolog-button {
        width: 80px;
        height: 32px;
        padding: 7px 15px;
        line-height: 10px;
        font-size: 13px;
    }

    .octopus-diaolog-btn {
        background: #FC9153;
        border-radius: 4px;
        width: 80px;
        height: 32px;
        padding: 7px 15px;
        line-height: 10px;
        font-size: 13px;
        border: none;
    }
    .inputWidth{
        width: 320px;
    }
}
</style>