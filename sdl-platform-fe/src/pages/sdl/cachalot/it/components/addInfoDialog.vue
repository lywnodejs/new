<template>
    <el-dialog :title="title" 
            id="cachalot-onlineVul-dialog" 
            :visible.sync="dialogVisible" 
            width="440px">
       <el-form :inline="true" label-width="80px" label-position="left" >
            <el-form-item label="ID">
                <el-input class="inputWidth"
                            disabled
                            v-model="queryParam.id"
                            placeholder="请输入ID"
                            clearable></el-input>
            </el-form-item>
            <el-form-item label="域名">
                <el-input class="inputWidth"
                            v-model="queryParam.domain_fullname"
                            placeholder="请输入域名"
                            clearable></el-input>
            </el-form-item>
            <el-form-item label="研发">
                <app-employee class="inputWidth" v-model="queryParam.rd"></app-employee>
                <!-- <el-input class="inputWidth"
                            v-model="queryParam.rd"
                            placeholder="请输入研发"
                            clearable></el-input> -->
            </el-form-item>
            <el-form-item label="研发上级">
                <app-employee class="inputWidth" v-model="queryParam.rd_leader"></app-employee>
                <!-- <el-input class="inputWidth"
                            v-model="queryParam.rd_leader"
                            placeholder="请输入研发上级"
                            clearable></el-input> -->
            </el-form-item>
            <el-form-item label="运维">
                <app-employee class="inputWidth" v-model="queryParam.op"></app-employee>
            </el-form-item>
            <el-form-item label="备注">
                <el-input class="inputWidth"
                            type="textarea"
                            v-model="queryParam.remark"
                            placeholder="请输入备注"
                            clearable></el-input>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="dialogVisible = false">取消</el-button>
        <el-button class="octopus-diaolog-btn" type="primary" @click="updateInfo()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
  updateItDomain: 'cachalot_domain/updateItDomain'
})({
  props: ['visible', 'data'],
  data() {
    return {
      dialogVisible: null,
      scopeRow: this.data,
      queryParam: {
          id: null,
          domain_fullname: '',
          rd: '',
          rd_leader: '',
          remark: '',
          op: ''
      },
      title: '编辑信息',
      loading: false,
      options: []
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    visible(val) {
        this.dialogVisible = val
    },
    dialogVisible(val) {
        this.$emit('dialog', this.dialogVisible)
    },
    data(val) {
      this.queryParam.id = val.id
      this.queryParam.domain_fullname = val.domain_fullname
      this.queryParam.rd = val.rd
      this.queryParam.rd_leader = val.rd_leader
      this.queryParam.remark = val.remark
      this.queryParam.op = val.op
    }
  },
  methods: {
    updateInfo() {
        this.updateItDomain(this.queryParam).then(res => {
            this.dialogVisible = false

            // this.$emit('updateData', {domain_id: res.domain_id, git_url: res.git_url_new})
            this.$parent.fetchData()
        })
    }
  }
})
</script>
<style lang="less">
#cachalot-onlineVul-dialog{
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