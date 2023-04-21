<template>
  <div class="sdl-security-bp">
    <div class="app-flex app-flex--right">
      <button type="button" class="el-icon-circle-plus-outline ratel-button" @click="handleAddBp"><span>添加安全BP</span></button>
    </div>
    <div class="cutLine"></div>
    <app-table
      :pagination="true"
      url='/admin/getlist'
      ref="sdlSecurityBpTable"
    >
      <el-table-column
        prop="emp_name_zh"
        :label="$t('安全BP')"
      >
      <template slot-scope="scope">
        <div>
          {{ scope.row.emp_name_zh + ' (' + scope.row.emp_account + ')' }}
        </div>
      </template>
      </el-table-column>
      <el-table-column
        prop="phone_number"
        :label="$t('手机号')"
      >
      </el-table-column>
      <el-table-column
        prop="create_time"
        :label="$t('创建时间')"
        :formatter="fmtCreateTime"
      >
      </el-table-column>
      <el-table-column
        prop=""
        width="125px"
        align="center"
        :label="$t('操作')"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDelete(scope.row)">{{$t('删除')}}</el-button>
        </template>
      </el-table-column>
    </app-table>
    <el-dialog
      title="添加安全BP"
      :visible.sync="bpDialogVisibla"
      width="40%"
      @close="handleDialogClose">
      <el-form :model="form" :rules="rules" label-width="100px" ref="sdlSecurityBpForm">
        <el-row>
          <el-col :span="22">
            <el-form-item :label="$t('安全BP')" prop="emp_account">
              <el-select
                v-model="form.emp_account"
                placeholder="请输入邮箱前缀选取"
                filterable
                remote
                clearable
                reserve-keyword
                :multiple="false"
                :remote-method="handleGetRD">
                <el-option
                  v-for="(item, index) in rds"
                  :key="index"
                  :label="item.name + ' (' + item.email + ')'"
                  :value="item.account">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click.stop="handleSecurityBpSubmit">{{ $t('添加') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {connect} from '@/lib'
  import moment from 'moment'
  import * as COMMON_API from '@/commons/api/common'
  import ajax from '@/plugin/ajax'

  export default connect(() => {
    return {
    }
  }, {
    deleteSdlSecurityBp: 'sdl_security_bp/deleteSdlSecurityBp',
    createSdlSecurityBp: 'sdl_security_bp/createSdlSecurityBp'
  })({
    name: 'sdl-security-bp',
    data() {
      return {
        form: {
          emp_account: ''
        },
        rds: [],
        bpDialogVisibla: false,

        rules: {
          emp_account: [{ required: true, message: '请输入后选择安全bp', trigger: 'change' }]
        }
      }
    },

    methods: {

      handleSecurityBpSubmit() {
        this.$refs.sdlSecurityBpForm.validate((valid) => {
        if (valid) {
          this.createSdlSecurityBp(this.form).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('添加成功')
            })
            this.handleDialogClose()
          })
        } else {
          return false
        }
      })
      },

      handleGetRD(query) {
        let postJson = {
          account: query
        }
        ajax.get(COMMON_API.queryEmployee, postJson).then(res => {
          this.rds = res.data
        })
      },

      handleDialogClose() {
        this.bpDialogVisibla = false
        this.$refs.sdlSecurityBpForm.resetFields()
        this.$refs.sdlSecurityBpTable.reload()
      },

      handleAddBp() {
        this.bpDialogVisibla = true
      },

      fmtCreateTime(row, column, cellValue, index) {
        if (cellValue) {
          return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        }
        return cellValue
      },

      handleDelete(row) {
        this.$confirm(this.$t('请确认是否删除?'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.deleteSdlSecurityBp(row.id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('删除成功!')
            })
            this.$refs.sdlSecurityBpTable.reload()
          })
        })
      }
    }
  })
</script>

<style scoped lang='less'>
  .ratel-btn {
    background: #FC9153;
    border-radius: 4px;
    width: 95px;
    height: 32px;
    border: none;
    color: white;
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
    cursor: pointer;
    span {
      font-family: Avenir, Helvetica, Arial, sans-serif;
    }
  }
  .ratel-button {
    background:white;
    border-radius: 4px;
    width: 110px;
    height: 32px;
    border: 1px solid #FC9153;
    color:  #FC9153;
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
    cursor: pointer;
    span {
      font-family: Avenir, Helvetica, Arial, sans-serif;
    }
  }
  .ratel-button:hover {
    background-color: #fff7f2;
  }

  .cutLine {
    // border: 1px solid
    margin-top: 5px;
    margin-bottom: 17px;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.10);
    // background: rgba(0, 0, 0, 0.10);
    // border-radius: 4px;
  }

  .el-table th {
    background: #ddd !important;
    font-size: large;
  }

  .el-select {
    width: 230px;
  }

  .el-dialog {
    -webkit-font-smoothing: antialiased;
    .el-select {
      width: 320px;
    }
  }
</style>
