<template>
  <div class="select-user-list">
    <el-form label-width="100px">
      <div class='select-user-list__search'>
        <el-form-item :label="$t('deptInterfacer.userAccount')" prop="level">
          <el-input v-model="emp_username"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="query">{{ $t('buttons.query') }}</el-button>
          <el-button @click="reset">{{ $t('buttons.reset') }}</el-button>
        </el-form-item>
      </div>
    </el-form>

    <sdl-table
      url="process/deptInterfacer/getEmpList"
      border
      style="width: 100%"
      ref="userListTable"
      :query-params="userListQueryList"
      >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column
        prop="name"
        :label="$t('deptInterfacer.name')">
      </el-table-column>

      <el-table-column
        prop="email"
        :label="$t('deptInterfacer.email')">
      </el-table-column>

      <el-table-column
        prop="dept"
        :label="$t('deptInterfacer.dName')">
      </el-table-column>

      <el-table-column
        prop="job_desc"
        :label="$t('deptInterfacer.job')">
      </el-table-column>
    </sdl-table>

    <el-row :gutter="20">
      <el-col :offset="10" :span="12">
        <el-button type="primary" @click="saveSelect">{{ $t('buttons.update') }}</el-button>
        <el-button style="margin-top: 15px;" @click="close">{{ $t('buttons.offset') }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'SELECT-USER-LIST',

  props: {
    deptId: {
      type: Number | String,
      default: null
    }
  },

  data() {
    return {
      emp_username: ''
    }
  },

  methods: {

    /**
     * 查询按钮
     */
    query() {
      this.$refs.userListTable.reload()
    },

    /**
     * 重置查询参数
     */
    reset() {
      this.emp_username = ''
    },

    /**
     * 查询参数
     */
    userListQueryList() {
      return {
        emp_username: this.emp_username
      }
    },

    // 获取选中的数据
    saveSelect() {
      let selectData = this.$refs.userListTable.getSelection()
      if (selectData.length > 1) {
        this.$message.warning('只能选择一条数据进行操作')
      } else if (selectData.length == 1) {
        this.$http.post('/process/deptInterfacer/update', {
          interfacer_id: selectData[0].id,
          dept_id: this.deptId
        }, { emulateJSON: true }).then(res => {
          if (res.data.errno == 0) {
            this.$emit('close', true)
            this.$message.success(res.data.errmsg)
          } else {
            this.$message.error(res.data.errmsg)
          }
        })
      } else if(selectData.length < 1) {
        this.$message.warning('当前未选择数据')
      }
    },

    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less">
  .select-user-list {
    .el-table__header th {
      color: #494b55;
      text-align: center;
      background-color: #f3f4f5;
    }
    .el-form-item {
      margin-bottom: 5px;
    }

    &__search {
      display: flex;
      justify-content: space-between;
    }
  }
</style>


