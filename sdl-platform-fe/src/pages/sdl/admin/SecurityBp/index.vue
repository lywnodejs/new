<template>
  <div class="el-main">
    <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
      <div class="displayFlex">
        <el-form-item label="安全BP:">
          <el-select
            v-model="queryParam.keywords.security_bp"
            filterable
            clearable
            placeholder="请选择安全BP">
            <el-option
              v-for="item in securityBps"
              :key="item.id"
              :label="item.emp_name_zh + ' (' + item.emp_account + ')'"
              :value="item.emp_account"
              @clear="setSdlEngineerValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="odin节点:" style="margin-left: 30px;">
          <el-input
            v-model="queryParam.keywords.odin_module"
            clearable
            placeholder="请输入odin节点"
            auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="一级部门:" style="margin-left: 30px;">
          <el-input
            v-model="queryParam.keywords.department_T1"
            clearable
            placeholder="请输入一级部门"
            auto-complete="off">
          </el-input>
        </el-form-item>

      </div>
      <div class="displayFlex">
        <el-form-item label="二级部门:">
          <el-input
            v-model="queryParam.keywords.department_T2"
            clearable
            placeholder="请输入二级部门"
            auto-complete="off">
          </el-input>
        </el-form-item>
      </div>
      <el-row>

        <el-col :span="24">
          <el-form-item align="center">
            <button type="button" class="ratel-btn" @click="searchSecurityBp"><span>搜&nbsp;索</span></button>
            <button type="button"
              class="el-icon-circle-plus-outline ratel-button"
              @click="openDialog()"><span>添加安全BP</span>
            </button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="cutLine"></div>

    <!-- <div class="btnWrap">
      <el-button
        type="warning"
        class="el-icon-circle-plus-outline"
        @click="openDialog()"
        size="mini"
        style="background: #fc9153; border-radius: 4px; float:right; margin-right: 10px; border-color: #fc9153;">
        添加安全BP
      </el-button>
    </div> -->
    <el-table
      :data="securityBpList"
      v-loading>
      <el-table-column
        prop="id"
        label="ID" sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="security_bp"
        width="150"
        label="安全BP">
        <template slot-scope="scope">
          {{scope.row.security_bp_zh + " (" + scope.row.security_bp + ")"}}
        </template>
      </el-table-column>
      <el-table-column
        prop="department_T1"
        label="一级部门"
        width="150">
      </el-table-column>
      <el-table-column
        prop="department_T2"
        width="150"
        label="二级部门">
      </el-table-column>
      <el-table-column
        prop="odin_module"
        width="150"
        label="odin节点">
      </el-table-column>
      <el-table-column
        prop="update_time"
        width="150"
        label="更新时间">
      </el-table-column>
      <el-table-column
        prop="source_type"
        width="60"
        label="来源">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述">
      </el-table-column>
      <el-table-column
        width="100"
        label="操作">
        <template slot-scope="scope">
          <span style="color:#FC9153;cursor: pointer;" @click="openDialog(scope.row)">编辑&nbsp;&nbsp;</span>
          <span style="color:#FC9153;cursor: pointer;" @click="openDeleteDialog(scope.row.id)"> &nbsp;&nbsp;删除</span>
        </template>
      </el-table-column>
    </el-table>
    <div align="right" style="margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="queryParam.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="num">
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="460px">
      <el-form :model="securityBp" label-width="100px" label-position="left">
        <el-form-item label="一级部门">
          <el-input
            v-model="securityBp.department_T1"
            placeholder="请输入一级部门"
            clearable
            auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="二级部门">
          <el-input
            v-model="securityBp.department_T2"
            placeholder="请输入二级部门"
            clearable
            auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="安全BP">
          <el-select
            v-model="securityBp.security_bp"
            filterable
            clearable
            placeholder="请选择安全BP"
          >
            <el-option
              v-for="item in securityBps"
              :key="item.id"
              :label="item.emp_name_zh + ' (' + item.emp_account + ')'"
              :value="item.emp_account">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="odin节点">
          <el-input
            v-model="securityBp.odin_module"
            placeholder="请输入odin节点"
            clearable
            auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="来源">
          <el-select
            v-model="securityBp.source_type"
            filterable
            clearable
            placeholder="请选择来源">
            <el-option key="sdl" label="sdl" value="sdl"></el-option>
            <el-option key="odin" label="odin" value="odin"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input
            v-model="securityBp.description"
            placeholder="请输入描述信息"
            clearable
            type="textarea"
            auto-complete="off">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancelBtn" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="confirmBtn" type="warning" round style="background: #FC9153;border-radius: 4px;" @click="submitSecurityBpInfo">确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="400px">
      <span>确定删除该BP信息?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancelBtn" @click="deleteDialogVisible = false">取 消</el-button>
        <el-button class="confirmBtn" type="primary" round @click="deleteSecurityBpInfo" style="background: #FC9153;border-radius: 4px;">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {connect} from '@/lib'

  export default connect(() => {
    return {
      securityBpList: 'security_bp/securityBpList',
      num: 'security_bp/securityBpListLength'
    }
  }, {
    getSecurityBpList: 'security_bp/getSecurityBpList',
    createSecurityBp: 'security_bp/createSecurityBp',
    deleteSecurityBp: 'security_bp/deleteSecurityBp',
    updateSecurityBp: 'security_bp/updateSecurityBp',
    getSdlSecurityBp: 'sdl_security_bp/getSdlSecurityBp'

  })({
    name: 'unaudit-vul-index',
    data() {
      return {
        securityBps: [],
        dialogFormVisible: false,
        deleteDialogVisible: false,
        dialogTitle: '',
        delId: 0,
        securityBp: {
          id: '',
          department_T1: '',
          department_T2: '',
          odin_module: '',
          security_bp: '',
          source_type: '',
          description: ''
        },
        queryParam: {
          keywords: {
            id: '',
            department_T1: '',
            department_T2: '',
            odin_module: '',
            security_bp: ''
          },
          page: 1,
          limit: 10
        }
      }
    },
    created() {
      this.fetchData()
      this.getSdlSecurityBpList()
    },
    methods: {
      setSdlEngineerValue() {
        this.queryParam.keywords.security_bp = ''
      },

      getSdlSecurityBpList() {
        this.getSdlSecurityBp().then(res => {
          this.securityBps = res.data
        }).catch(() => {
          this.securityBps = []
        })
      },

      fetchData() {
        this.dialogFormVisible = false
        this.deleteDialogVisible = false
        let queryParam = {queryParam: this.queryParam}
        this.getSecurityBpList(queryParam).then(res => {
        })
      },
      createSecurityBpInfo() {
        this.createSecurityBp(this.securityBp).then(res => {
        })
        this.fetchData()
      },
      deleteSecurityBpInfo() {
        this.deleteSecurityBp(this.delId).then(res => {
        })
        this.fetchData()
      },
      updateSecurityBpInfo() {
        this.updateSecurityBp(this.securityBp).then(res => {
        })
        this.fetchData()
      },
      searchSecurityBp() {
        this.fetchData()
      },
      openDeleteDialog(id) {
        this.deleteDialogVisible = true
        this.delId = id
      },
      openDialog(data) {
        if (data) {
          this.dialogTitle = '安全BP更新'
          this.securityBp = {
            id: data.id,
            department_T1: data.department_T1,
            department_T2: data.department_T2,
            odin_module: data.odin_module,
            security_bp: data.security_bp,
            source_type: data.source_type,
            description: data.description
          }
        } else {
          this.dialogTitle = '安全BP添加'
          this.securityBp = {
            department_T1: '',
            department_T2: '',
            odin_module: '',
            security_bp: '',
            source_type: 'sdl',
            description: ''
          }
        }
        this.dialogFormVisible = true
      },
      handleSizeChange(val) {
        this.queryParam.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryParam.page = val
        this.fetchData()
      },
      submitSecurityBpInfo() {
        if (this.securityBp.id) {
          this.updateSecurityBpInfo()
        } else {
          this.createSecurityBpInfo()
        }
        this.dialogFormVisible = false
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
    margin-top: 5px;
    margin-left: 80px;
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
    margin-top: 5px;
    margin-left: 25px;
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

  .el-input {
    width: 230px;
  }

  .el-dialog {
    -webkit-font-smoothing: antialiased;
    .el-select {
      width: 320px;
    }
    .el-input {
      width: 320px;
    }
  }

  .el-main {
    width: 100%;
    box-sizing: border-box;
    background: white;
    /* margin-bottom: 20px; */
    /* padding: 20px; */
    /* margin-left: 0; */
    /* margin-top: -15px; */
    /* padding-right: -20px; */

  .displayFlex {
    display: flex;
  }
  .btnWrap {
    height: 40px;
  }

  .searchForm {

    .searchInput {
      width: 320px;
    }

  }
  .cancelBtn {
    width: 90px;
    height: 32px;
    padding: 0;
    font-size: 13px;
  }
  .confirmBtn {
    font-size: 13px;
    height: 32px;
    width: 90px;
    padding: 0;
    border: none;
  }
}
</style>
