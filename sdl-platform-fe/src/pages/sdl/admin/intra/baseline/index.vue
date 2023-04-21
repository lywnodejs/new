<template>
  <div id="admin-intra-baseline">
    <div class="el-main">
      <div class="btnWrap">
        <button type="button" class='base-line-btn' @click="openDialog()"><span>测试基线生成规则</span></button>
        <button type="button" class='base-line-btn' @click="openCreateDialog()"><span>新增基线生成规则</span></button>
      </div>
      <el-table
        ref="baselineTable"
        :data="data"
        v-loading>
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="table-expand" label-width="90px">
              <el-form-item label="ID:">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="项目类型:">
                <span>{{ props.row.condition_project_type.join(', ') }}</span>
              </el-form-item>
              <el-form-item label="项目属性:">
                <span>{{ props.row.condition_project_property.join(', ') }}</span>
              </el-form-item>
              <el-form-item label="主要开发语言:">
                <span>{{ props.row.condition_language.join(', ') }}</span>
              </el-form-item>
              <el-form-item label="数据等级:">
                <span>{{ props.row.condition_data_level.join(', ') }}</span>
              </el-form-item>
              <el-form-item label="用户类型:">
                <span>{{ props.row.condition_target_user.join(', ') }}</span>
              </el-form-item>
              <el-form-item label="直接调用方:">
                <span>{{ props.row.condition_service_invoker.join(', ') }}</span>
              </el-form-item>
              <el-form-item label="外网访问:">
                <span>{{ handleParam(props.row.condition_is_internet, accessInternet) }}</span>
              </el-form-item>
              <el-form-item label="外包开发:">
                <span>{{ handleParam(props.row.condition_is_offshore, isOffshore) }}</span>
              </el-form-item>
              <el-form-item label="外采系统:">
                <span>{{ handleParam(props.row.condition_is_purchase, isPurchase) }}</span>
              </el-form-item>
              <el-form-item label="添加基线:">
                <p v-for="item in props.row.add_baselines" :key="item">{{ handleOperationValue(item, true) }}</p>
              </el-form-item>
              <el-form-item label="移除基线:">
                <p v-for="item in props.row.remove_baselines" :key="item">{{ handleOperationValue(item, true) }}</p>
              </el-form-item>
              <el-form-item label="优先级:">
                <span>{{ props.row.match_order }}</span>
              </el-form-item>
              <el-form-item label="创建时间:">
                <span>{{ props.row.create_time }}</span>
              </el-form-item>
              <el-form-item label="更新时间:">
                <span>{{ props.row.update_time }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column> -->
        <el-table-column
          property="id"
          label="ID"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          property="condition_language"
          label="语言"
          align="center">
        </el-table-column>
        <el-table-column
          property="condition_project_level"
          label="项目等级"
          align="center">
        </el-table-column>
        <el-table-column
          property="security_bp"
          label="安全BP"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          property="rule_type"
          label="规则类型"
          align="center"
          width="100">
          <template slot-scope="scope">
            {{ handleRuleType(scope.row.rule_type) }}
          </template>
        </el-table-column>
        <el-table-column
          property="match_order"
          label="优先级"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          property="create_time"
          label="创建时间"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          property="update_time"
          label="更新时间"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="openUpdateDialog(scope.row.id, scope.row.security_bp)"
                       type="text"
                       size="mini">编辑
            </el-button>
            <el-button type="text"
                       size="mini"
                       @click="openDeleteDialog(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div align="right" style="margin-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParam.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="queryParam.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="num">
        </el-pagination>
      </div> -->
    </div>

    <test-baseline-securityBp :testBaselineDialog='testDialogVisible' @testDialogVisible='getTestFormDialog'></test-baseline-securityBp>
    <delete-baseline-securityBp :deleteBaselineDialog='deleteDialogVisible' :baselineId='deleteId' @deleteDialogVisible='getDeleteFormDialog'></delete-baseline-securityBp>
    <update-baseline-securityBp :updateBaselineDialog='updateDialogVisible' :info='updateInfo' @updateDialogVisible='getUpdateFormDialog'></update-baseline-securityBp>
    <create-baseline-securityBp :createBaselineDialog='createDialogVisible' @createDialogVisible='getCreateFormDialog'></create-baseline-securityBp>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import testBaselineSecurityBp from './components/testBaselineSecurityBp'
  import deleteBaselineSecurityBp from './components/deleteBaselineSecurityBp'
  import updateBaselineSecurityBp from './components/updateBaselineSecurityBp'
  import createBaselineSecurityBp from './components/createBaselineSecurityBp'

  import * as CONSTANTS from '@/commons/admin'

  export default connect(() => {
    return {
    }
  }, {
    listAllBaselineSecurityBp: 'security_bp/listAllBaselineSecurityBp'
  })({
    name: 'baselineRule',
    data() {
      return {
        data: [],
        num: 0,
        testDialogVisible: false,
        updateDialogVisible: false,
        createDialogVisible: false,
        deleteDialogVisible: false,
        deleteId: '',
        updateInfo: {},
        ruleType: CONSTANTS.ruleType
      }
    },
    created() {
      this.fetchData()
    },
    components: { testBaselineSecurityBp, deleteBaselineSecurityBp, updateBaselineSecurityBp, createBaselineSecurityBp },
    mounted() {
    },
    methods: {
      fetchData() {
        this.listAllBaselineSecurityBp().then(res => {
          this.num = res.count;
          this.data = res.security_bp_generate_rule_list;
        })
      },
      handleRuleType(type) {
        for (let i = 0; i < CONSTANTS.ruleType.length; i++) {
          if (CONSTANTS.ruleType[i].value === type) {
            return CONSTANTS.ruleType[i].label
          }
        }
      },
      openDialog() {
        this.testDialogVisible = true
      },
      openDeleteDialog(id) {
        this.deleteDialogVisible = true
        this.deleteId = id
      },
      openUpdateDialog(id, securityBp) {
        this.updateInfo = {
          id: id,
          security_bp: securityBp
        }
        this.updateDialogVisible = true
      },
      openCreateDialog() {
        this.createDialogVisible = true
      },
      getTestFormDialog(val) {
        this.testDialogVisible = val
      },
      getDeleteFormDialog(val) {
        this.deleteDialogVisible = val
      },
      getUpdateFormDialog(val) {
        this.updateDialogVisible = val
      },
      getCreateFormDialog(val) {
        this.createDialogVisible = val
      }
    }
  })
</script>
<style lang="less" scoped>
  .btnWrap {
    height: 40px;
    .base-line-btn {
      border: 1px solid #FC9153;
      border-radius: 4px;
      float: right;
      width: 120px;
      height: 32px;
      color: white;
      background: #FC9153;
      margin-left: 15px;
      cursor: pointer;
      -webkit-font-smoothing: antialiased;
      padding: 0;
      font-size: 13px;
      span {
        font-family: Avenir, Helvetica, Arial, sans-serif;
      }
    }
  }

  .base-line-diaolog-button {
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    font-size: 13px;
  }

  .base-line-diaolog-btn {
    background: #FC9153;
    border-radius: 4px;
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    font-size: 13px;
    border: none;
  }

  .baselineRule {
    width: 100%;
    background: white;
    // margin-top: -10px;
    // padding: 5px;
    // padding-top: 10px;
    .el-main {
      width: 100%;
      box-sizing: border-box;
      // margin-top: -15px;
      // padding: 20px;
      // margin-left: -5px;
      .displayFlex {
        display: flex;
      }
      .searchForm {
        .searchInput {
          width: 230px;
        }
      }
    }
  }

  .inputBaseline {
    width: 320px;
  }

  .el-select {
    width: 320px;
  }

  .el-button--text {
    font-weight: 400;
  }

  .table-expand {
    font-size: 0;
    padding: 3px 20px;
  }

  .table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
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
  .lengthLimit {
    max-width: 360px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

<style lang="less">
.admin-intra-baseline {
  .table-expand label {
    // color: #7e8fa7;
    color: #596385;
    font-size: 12.5px;
  }
}
</style>
s