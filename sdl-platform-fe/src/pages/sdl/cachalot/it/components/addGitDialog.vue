<template>
    <el-dialog :title="title" 
            id="cachalot-onlineVul-it-dialog" 
            :visible.sync="dialogVisible" 
            width="440px">
       <el-form :inline="true" label-width="80px" label-position="left" >
           <el-form-item label="ID">
                <el-input class="inputWidth"
                            disabled
                            v-model="queryParam.it_domain_id"
                            placeholder="请输入ID"
                            clearable></el-input>
            </el-form-item>
            <el-form-item label="Git地址">
                <el-select
                    class="inputWidth"
                    filterable
                    remote
                    multiple
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    v-model="queryParam.git_url"
                    :loading="loading">
                    <el-option
                        v-for="item in options"
                        :key="item.git_url"
                        :label="item.git_url"
                        :value="item.git_url">
                    </el-option>
                </el-select>
                <!-- <el-input class="inputWidth"
                            @input="gitChange"
                            v-model="queryParam.git_url"
                            placeholder="请输入Git 地址"
                            clearable></el-input> -->
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
  dimqueryDomain: 'cachalot_domain/dimqueryDomain',
  modifyItDomain: 'cachalot_domain/modifyItDomain'
})({
  props: ['visible', 'data'],
  data() {
    return {
      dialogVisible: null,
      scopeRow: this.data,
      queryParam: {
          it_domain_id: null,
          git_url: []
      },
      title: '添加Git地址',
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
        this.queryParam.it_domain_id = val.it_domain_id
        this.queryParam.git_url = val.git_url ? val.git_url : []
    }
  },
  methods: {
    updateInfo() {
        this.modifyItDomain(this.queryParam).then(res => {
            this.dialogVisible = false

            // this.$emit('updateData', {domain_id: res.domain_id, git_url: res.git_url_new})
            this.$parent.fetchData()
        })
    },
    focusMethod() {
        this.dimqueryDomain({git_url: this.queryParam.git_url}).then(res => {
            this.options = res.cachalot_git_general_list
        })
    },
    remoteMethod(url) {
        this.dimqueryDomain({git_url: url}).then(res => {
            this.options = res.cachalot_git_general_list
        })
    }
  }
})
</script>
<style lang="less">
#cachalot-onlineVul-it-dialog{
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