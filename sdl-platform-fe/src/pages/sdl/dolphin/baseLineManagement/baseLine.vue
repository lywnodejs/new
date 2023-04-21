<template>
  <div id="baselineManagement">
    <div class="el-main">
      <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
        <div class="displayFlex">
          <el-form-item label="基线类型:">
            <el-cascader id="el-cascader"
                        class="searchInput"
                        :options="baselineType"
                        v-model="baselineTypeArraySearch"
                        clearable
                        change-on-select
                        @change="handleBaselineTypeArraySearch"
                        placeholder="请选择基线类型"
                        expand-trigger="hover">
            </el-cascader>
          </el-form-item>
          <el-form-item label="基线编号:" style="margin-left:30px">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入基线编号"
                      v-model="queryParam.keywords.baseline_no"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="基线名称:" style="margin-left:30px">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入基线名称"
                      v-model="queryParam.keywords.baseline_name"
                      auto-complete="off">
            </el-input>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="是否强制:">
            <el-select class="searchInput"
                      clearable
                      placeholder="请选择是否强制"
                      v-model="queryParam.keywords.is_forced"
                      auto-complete="off">
              <el-option v-for="item in isForced"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-row>
          <el-col :span='24'>
            <el-form-item align="center">
              <button type="button" class='base-line-button' @click="fetchData()"><span>搜&nbsp;&nbsp;索</span></button>
              <button type="button" class='base-line-btn' @click="openDialog()"><span>新增基线</span></button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="cutLine"></div>

      <el-table
        ref="baselineTable"
        :data="baselineList"
        v-loading>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="table-expand" label-width="70px">
              <el-form-item label="基线编号:">
                <span>&nbsp;{{ props.row.baseline_no }}</span>
              </el-form-item>
              <el-form-item label="基线名称:">
                <span>&nbsp;{{ props.row.baseline_name }}</span>
              </el-form-item>
              <el-form-item label="基线类型:">
                <span>&nbsp;{{ handleTableBaselineType(props.row.baseline_no.split('-')[0]) }} </span>
              </el-form-item>
              <el-form-item label="安全要求:">
                <span>&nbsp;{{ props.row.security_requirements }}</span>
              </el-form-item>
              <el-form-item label="安全规范:">
                <span>&nbsp;{{ props.row.check_method }}</span>
              </el-form-item>
              <el-form-item label="加固方案:">
                <span>&nbsp;{{ props.row.mitigation }}</span>
              </el-form-item>
              <el-form-item label="是否强制:">
                <span>&nbsp;{{ props.row.is_forced == 0 ? '否' : '是' }}</span>
              </el-form-item>
              <el-form-item label="威胁列表:">
                <span>&nbsp;{{ handleThreatList(props.row.threat_list) }}</span>
              </el-form-item>
              <el-form-item label="STRIDE:">
                <!-- <span>&nbsp;{{ props.row.stride }}</span> -->
                <span>&nbsp;{{ handleStrideList(props.row.stride) }}</span>
              </el-form-item>
              <el-form-item label="设计原则:">
                <span>&nbsp;{{ props.row.design_principle }}</span>
              </el-form-item>
              <el-form-item label="创建时间:">
                <span>&nbsp;{{ props.row.create_time }}</span>
              </el-form-item>
              <el-form-item label="更新时间:">
                <span>&nbsp;{{ props.row.update_time }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          align="center"
          width="55">
        </el-table-column>
        <el-table-column
          prop="baseline_no"
          label="基线编号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          property="baseline_name"
          label="基线名称"
          >
        </el-table-column>
        <el-table-column
          label="基线类型"
          width="240"
          align="center">
          <template slot-scope="scope">
            {{ handleTableBaselineType(scope.row.baseline_no.split('-')[0]) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="260">
          <template slot-scope="scope">
            <el-button @click="openDialog(scope.row)"
                       type="text"
                       size="mini">编辑</el-button>
            <el-button type="text"
                       size="mini"
                       @click="openWarnDialog(scope.row.id)">删除</el-button>
            <el-button type="text"
                       size="mini"
                       @click="openRulesDialog('Cobra', scope.row.id, 1)">Cobra规则</el-button>
            <el-button type="text"
                       size="mini"
                       @click="openRulesDialog('Fatbird', scope.row.id, 2)">Fatbird规则</el-button>
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
    </div>

    <baseline-dialog :dialogVisible='dialogFormVisible' :formData='tranData' @formVisible='getFormDialog'></baseline-dialog>

    <baseline-delete-dialog  :didiBaselineId='didi_baseline_id' :dialogWarnVisible='dialogWarnVisible'  @deleteVisible="getDeleteDialogData"></baseline-delete-dialog>

    <cobra-dialog :didiBaselineId='didi_baseline_id' :dialogCobraVisible='dialogCobraRuleVisible' @cobraVisible="getCobraData"></cobra-dialog>

    <fatbird-dialog :didiBaselineId='didi_baseline_id' :dialogFatbirdVisible='dialogFatbirdRuleVisible' @fatbirdVisible="getFatbirdData"></fatbird-dialog>


  </div>
</template>
<script>
  import {connect} from '@/lib'
  import * as CONSTANTS from '@/commons/dolphin'
  import cobraDialog from './components/cobraDialog'
  import fatbirdDialog from './components/fatbirdDialog'
  import baselineDeleteDialog from './components/baselineDeleteDialog'
  import baselineDialog from './components/baselineDialog'

  export default connect(() => {
    return {
      baselineList: 'dolphin_baseline/baselineList',
      num: 'dolphin_baseline/baselineListLength',
      threatList: 'dolphin_threat/threatList',
      cobraList: 'dolphin_baseline_relation/cobraList'
    }
  }, {
    getThreatList: 'dolphin_threat/getThreatList',
    getBaselineList: 'dolphin_baseline/getBaselineList'
  })({
    name: 'baseline',
    data() {
      return {
        dialogFormVisible: false,
        dialogCobraRuleVisible: false,
        dialogFatbirdRuleVisible: false,
        dialogWarnVisible: false,
        tranData: {},
        isForced: CONSTANTS.isForced,
        stride: CONSTANTS.stride,
        baselineType: CONSTANTS.baselineType,
        didi_baseline_id: 0,
        baselineTypeArraySearch: [],  // 检索框绑定值
        queryParam: {
          page: 1,
          limit: 10,
          keywords: {
            baseline_no: '',
            baseline_type1: '',
            baseline_type2: '',
            baseline_type3: '',
            baseline_name: '',
            is_forced: ''
          }
        }
      }
    },
    watch: {

      // cobraIds() {
      //   this.toggleSelection('cobra')
      // }
    },
    components: { cobraDialog, fatbirdDialog, baselineDeleteDialog, baselineDialog },
    created() {
      this.fetchData()
      this.getThreatList().then(res => {
      })
    },
    methods: {
      fetchData() {
        let queryParam = this.queryParam
        if (queryParam.keywords.is_forced == null) {
          queryParam.keywords.is_forced = ''
        }
        this.getBaselineList(queryParam).then(res => {
        })
      },
      getFormDialog(val) {
        this.dialogFormVisible = val
      },
      getCobraData(val) {
        this.dialogCobraRuleVisible = val
      },
      getFatbirdData(val) {
        this.dialogFatbirdRuleVisible = val
      },
      getDeleteDialogData(val) {
        this.dialogWarnVisible = val
      },
      openDialog(data) {
        if (data) {
          this.tranData = data
        } else {
          this.tranData = null
        }
        this.dialogFormVisible = true
      },
      openRulesDialog(rule, id, type) {
        this.didi_baseline_id = id.toString()
        if (rule == 'Cobra') {
          this.dialogCobraRuleVisible = true
        } else {
          this.dialogFatbirdRuleVisible = true
        }
      },
      openWarnDialog(id) {
        this.dialogWarnVisible = true
        this.didi_baseline_id = id
      },
      handleSizeChange(val) {
        this.queryParam.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryParam.page = val
        this.fetchData()
      },
      handleBaselineTypeArraySearch() {
        this.queryParam.keywords.baseline_type1 = this.baselineTypeArraySearch[0]
        this.queryParam.keywords.baseline_type2 = this.baselineTypeArraySearch[1]
        this.queryParam.keywords.baseline_type3 = this.baselineTypeArraySearch[2]
        if (!this.baselineTypeArraySearch[2]) {
          this.queryParam.keywords.baseline_type3 = ''
          if (!this.baselineTypeArraySearch[1]) {
            this.queryParam.keywords.baseline_type2 = ''
            if (!this.baselineTypeArraySearch[0]) {
              this.queryParam.keywords.baseline_type1 = ''
            }
          }
        }
      },
      handleStrideList(strideList) {
        let arr = strideList.split(',')
        let strideCN = ''
        for (let j = 0; j < arr.length; j++) {
          for (let k = 0; k < CONSTANTS.stride.length; k++) {
            if (arr[j] == CONSTANTS.stride[k].value) {
              strideCN += CONSTANTS.stride[k].label + ' '
            }
          }
        }
        return strideCN
      },
      handleThreatList(threatList) {
        let arr = threatList.split(',')
        let newArr = []
        for (let j = 0; j < arr.length; j++) {
          for (let k = 0; k < this.threatList.length; k++) {
            if (arr[j] == this.threatList[k].didi_threat_id) {
              newArr.push(this.threatList[k].threat_name)
            }
          }
        }
        return newArr.join(', ')
      },
      handleTableBaselineType(baselineType) {
        let arr = baselineType.split('.')
        let newArr = []

        // 将1.1.2这种形式的baselineType转换为文字，以“-”分割，逐级与CONSTANT中的值相比较\
        if (CONSTANTS.baselineType) {
          for (let i = 0; i < CONSTANTS.baselineType.length; i++) {
            if (arr[0] == CONSTANTS.baselineType[i].value) {
              newArr.push(CONSTANTS.baselineType[i].label)
              if (CONSTANTS.baselineType[i].children) {
                for (let j = 0; j < CONSTANTS.baselineType[i].children.length; j++) {
                  if (arr[1] == CONSTANTS.baselineType[i].children[j].value) {
                    newArr.push(CONSTANTS.baselineType[i].children[j].label)
                    if (CONSTANTS.baselineType[i].children[j].children) {
                      for (let k = 0; k < CONSTANTS.baselineType[i].children[j].children.length; k++) {
                        if (arr[2] == CONSTANTS.baselineType[i].children[j].children[k].value) {
                          newArr.push(CONSTANTS.baselineType[i].children[j].children[k].label)
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return newArr.join(' - ')
      }
    }
  })
</script>
<style lang="less" scoped>
  .base-line-btn {
    border: 1px solid #FC9153;
    border-radius: 4px;
    width: 95px;
    height: 32px;
    color: #FC9153;
    background: white;
    margin-left: 25px;
    cursor: pointer;
    -webkit-font-smoothing: antialiased;
    padding: 0;
    font-size: 13px;
    span {
      font-family: Avenir, Helvetica, Arial, sans-serif;
    }
  }

  .base-line-button {
    background: #FC9153;
    border-radius: 4px;
    width: 95px;
    height: 32px;
    padding: 0;
    border: 1px solid #FC9153;
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

  .base-line-btn:hover {
    background-color: #fff3e8;
  }
  #baselineManagement {
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

  .el-button--text {
    font-weight: 400;
  }
  .table-expand {
    padding: 10px 20px;
  }
  
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    word-wrap: break-word;
    span {
      display: inline-block;
      width: 100%;
      font-size: 12.5px;
    }
    
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
</style>

<style lang="less">
#baselineManagement {
  .table-expand label {
    // color: #7e8fa7;
    color: #596385;
    font-size: 12.5px;
  }
}
</style>
