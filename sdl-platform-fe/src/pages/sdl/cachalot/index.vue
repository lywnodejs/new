<template>
  <div id="cachalot">
    <!-- <span @click="toggleBox">展开收起</span> -->
    <!-- <transition name="mybox"> -->
    <div class="box">
      <el-form class="searchForm" label-position="left" label-width="140px" :inline='true'>
        <div class="displayFlex">
          <el-form-item label="漏洞单号">
            <el-input class="searchInput"
                      v-model="queryParam.keywords.vul_id"
                      placeholder="请输入漏洞单号"
                      clearable
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="漏洞名称" style="margin-left: 40px;">
            <el-input class="searchInput"
                      v-model="queryParam.keywords.vul_name"
                      placeholder="请输入漏洞名称"
                      clearable
                      auto-complete="off">
            </el-input>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="漏洞状态">
            <el-select class="searchInput"
                       v-model="queryParam.keywords.vul_status"
                       placeholder="请选择漏洞状态"
                       clearable>
              <el-option v-for="item in vulStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="漏洞等级" style="margin-left: 40px;">
            <el-select class="searchInput"
                       v-model="queryParam.keywords.vul_level_id"
                       placeholder="请选择漏洞等级"
                       clearable>
              <el-option v-for="item in vulLevel"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="漏洞分类">
            <el-cascader class="searchInput"
                       :options="vulType"
                       v-model="vulTypeArray"
                       change-on-select
                       placeholder="请选择漏洞分类"
                       clearable
                       @change="vulTypeValue"
                       expand-trigger="hover">
            </el-cascader>
          </el-form-item>
          <el-form-item label="漏洞来源" style="margin-left: 40px;">
            <el-cascader class="searchInput"
                       :options="vulSource"
                       v-model="vulSourceArray"
                       change-on-select
                       placeholder="请选择漏洞来源"
                       clearable
                       @change="vulSourceValue"
                       expand-trigger="hover">
            </el-cascader>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="部门名称">
            <app-department class="searchInput" v-model="queryParam.keywords.dept_id"></app-department>
          </el-form-item>
          <el-form-item label="R2漏洞" style="margin-left: 40px;">
            <el-select class="searchInput"
                       v-model="queryParam.keywords.is_r2"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in isR2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="未检出原因">
            <el-select class="searchInput"
                       v-model="queryParam.keywords.is_what_reason"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in isWhatReason"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="黑盒转化" style="margin-left: 40px;">
            <el-select class="searchInput"
                       v-model="queryParam.keywords.is_transform_black"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in isTransformBlack"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="白盒转化">
            <el-select class="searchInput"
                       v-model="queryParam.keywords.is_transform_white"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in isTransformWhite"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="移动端转化" style="margin-left: 40px;">
            <el-select class="searchInput"
                       v-model="queryParam.keywords.is_transform_mobile"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in isTransformMobile"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="设计转化">
            <el-select class="searchInput"
                       v-model="queryParam.keywords.is_transform_design"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in isTransformDesign"
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
              <button type="button" class='cachalot-btn' @click="searchVul"><span>搜&nbsp;索</span></button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- </transition> -->

    <div class="cutLine"></div>

    <el-table
      :data="tableData"
      v-loading
      border>
      <el-table-column
        prop="sdl_project_id"
        label="漏洞单号"
        sortable
        align="center"
        width="160">
        <template slot-scope="scope">
          <el-button class="button" type="text" size="mini" @click="goToUrl(scope.row.vul_id)">{{scope.row.vul_id}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="漏洞名称"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.vul_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="漏洞等级"
        sortable
        align="center"
        width="160">
        <template slot-scope="scope">
          <span>{{handleVulLevel(scope.row.vul_level_id)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="漏洞状态"
        sortable
        align="center"
        width="160">
        <template slot-scope="scope">
          <span>{{handleVulStatus(scope.row.vul_status)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        sortable
        align="center"
        width="200">
        <template slot-scope="scope" prop="is_disable">
          <el-button class="button" type="text" size="mini" @click="openDialog('look',scope.row)">查看</el-button>
          <el-button class="button" type="text" size="mini" @click="openDialog('edit',scope.row)">编辑</el-button>
          <el-button class="button" type="text" size="mini" @click="openDialog('delete',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div align="right" style="margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.page"
        :page-sizes="[10,20,30,50]"
        :page-size="queryParam.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="num">
      </el-pagination>
    </div>

    <!-- 编辑查看漏洞 -->
    <el-dialog :title="action==3 ? '查看漏洞':'编辑漏洞'"
               :visible.sync="dialogFormVisible"
               width="1100px"
               center>
      <el-form :inline="true" label-width="110px" label-position="right">
        <div class="displayFlex">
          <el-form-item label="漏洞单号">
            <el-input class="inputWidth" v-model="vulDetail.vul_id" placeholder="" clearable :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="漏洞名称">
            <el-input class="inputWidth" v-model="vulDetail.vul_name" placeholder="" clearable :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="漏洞状态">
            <el-select class="inputWidth" v-model="vulDetail.vul_status" placeholder="" clearable :disabled="true">
              <el-option v-for="item in vulStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="漏洞等级">
            <el-select class="inputWidth" v-model="vulDetail.vul_level_id" placeholder="" clearable :disabled="!editable">
              <el-option v-for="item in vulLevel"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="漏洞分类">
            <!-- <el-select class="" v-model="vulDetail.vul_type1_id" placeholder="" clearable :disabled="!editable">
              <el-option v-for="item in vulType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <el-cascader class="inputWidth"
                       :options="vulType"
                       v-model="vulTypeArrayDetail"
                       change-on-select
                       placeholder=""
                       clearable
                       @change="vulTypeValueDetail"
                       expand-trigger="hover"
                       :disabled="!editable">
            </el-cascader>
          </el-form-item>
          <el-form-item label="漏洞来源">
            <el-cascader class="inputWidth"
                       :options="vulSource"
                       v-model="vulSourceArrayDetail"
                       change-on-select
                       placeholder=""
                       clearable
                       @change="vulSourceValueDetail"
                       expand-trigger="hover"
                       :disabled="!editable">
            </el-cascader>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="上报时间">
            <el-input class="inputWidth" v-model="vulDetail.vul_post_time" placeholder="" clearable :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="确认时间">
            <el-input class="inputWidth" v-model="vulDetail.vul_confirm_time" placeholder="" clearable :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="超期时间">
            <el-input class="inputWidth" v-model="vulDetail.vul_expire_time" placeholder="" clearable :disabled="true"></el-input>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="git地址">
            <el-input class="inputWidth" v-model="vulDetail.vul_git_url" placeholder="" clearable :disabled="!editable"></el-input>
          </el-form-item>
          <el-form-item label="代码详情">
            <el-input class="inputWidth" v-model="vulDetail.vul_code_detail" placeholder="" clearable :disabled="!editable"></el-input>
          </el-form-item>
          <el-form-item label="漏洞计数">
            <el-input class="inputWidth" v-model="vulDetail.vul_count_amended" placeholder="" clearable :disabled="!editable"></el-input>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="部门名称">
            <el-input class="inputWidth" v-if="!editable" v-model="vulDetail.dept_name" clearable :disabled="true"></el-input>
            <app-department class="inputWidth" v-if="editable" v-model="vulDetail.dept_name" :disabled="!editable"></app-department>
          </el-form-item>
          <el-form-item label="同步时间">
            <el-input class="inputWidth" v-model="vulDetail.sync_time" placeholder="" clearable :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="不同步字段">
            <app-non-sync class="inputWidth" v-model="vulDetail.non_sync_column" multiple clearable :disabled="!editable"></app-non-sync>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="漏洞修复人">
            <el-button class="button" v-for="(vulRepairPeople, key) in vulRepairPeopleList" :key="key">{{vulRepairPeople.name}}</el-button>
          </el-form-item>
        </div>

        <div class="dialogCutLine"></div>

        <div class="displayFlex">
          <el-form-item label="R2漏洞">
            <el-select class="inputWidth" v-model="vulDetail.is_r2" placeholder="" clearable :disabled="!editable">
              <el-option v-for="item in isR2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="未发现原因">
            <el-select class="inputWidth" v-model="vulDetail.is_what_reason" placeholder="" clearable :disabled="!editable">
              <el-option v-for="item in isWhatReason"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="重复漏洞">
            <el-select class="inputWidth" v-model="vulDetail.is_repetitive" placeholder="" clearable :disabled="!editable">
              <el-option v-for="item in isRepetitive"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="漏洞责任方">
            <el-select class="inputWidth" v-model="vulDetail.is_whose_responsibility" placeholder="" clearable :disabled="!editable">
              <el-option v-for="item in isWhoseResponsibility"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="黑盒转化">
            <el-select class="inputWidth" v-model="vulDetail.is_transform_black" placeholder="" clearable :disabled="!editable">
              <el-option v-for="item in isTransformBlack"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="白盒转化 ">
            <el-select class="inputWidth" v-model="vulDetail.is_transform_white" placeholder="" clearable :disabled="!editable">
              <el-option v-for="item in isTransformWhite"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label=" 移动端转化">
            <el-select class="inputWidth" v-model="vulDetail.is_transform_mobile" placeholder="" clearable :disabled="!editable">
              <el-option v-for="item in isTransformMobile"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设计转化">
            <el-select class="inputWidth" v-model="vulDetail.is_transform_design" placeholder="" clearable :disabled="!editable">
              <el-option v-for="item in isTransformDesign"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button class="dialogCancelBtn" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="dialogConfirmBtn" type="warning" round @click="updateVul(vulDetail)">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示"
               :visible.sync="warnDialogVisible"
               width="30%">
      <span>是否确认删除此漏洞？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warnDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteVul(vulDetail.vul_id)">确定</el-button>
      </span>
    </el-dialog>

  </div>


</template>

<script>
import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/cachalot'
import * as CONSTANTS from '@/commons/cachalot'
import appDepartment from './vulnerability/components/department'
import appNonSync from './vulnerability/components/nonSyncColumn'

// import bus from '@/routes/eventBus'

export default {
  data() {
    return {
      num: 0,
      tableData: [],
      vulStatus: CONSTANTS.vulStatus,
      vulLevel: CONSTANTS.vulLevel,
      isR2: CONSTANTS.isR2,
      isRepetitive: CONSTANTS.isRepetitive,
      isWhatReason: CONSTANTS.isWhatReason,
      isWhoseResponsibility: CONSTANTS.isWhoseResponsibility,
      isTransformBlack: CONSTANTS.isTransformBlack,
      isTransformWhite: CONSTANTS.isTransformWhite,
      isTransformMobile: CONSTANTS.isTransformMobile,
      isTransformDesign: CONSTANTS.isTransformDesign,
      vulType: CONSTANTS.vulType,
      vulSource: CONSTANTS.vulSource,
      vulTypeArray: [],
      vulTypeArrayDetail: [],
      vulSourceArray: [],
      vulSourceArrayDetail: [],
      vulRepairPeopleList: [],
      dialogFormVisible: false,
      warnDialogVisible: false,
      editable: false,
      action: 0,
      vulDetail: {},
      nonSyncColumnList: [],
      queryParam: {
        page: 1,
        limit: 20,
        keywords: {
        vul_id: '',
        vul_name: '',
        vul_status: '',
        vul_level_id: '',
        vul_type1_id: '',
        vul_type2_id: '',
        vul_source1_id: '',
        vul_source2_id: '',
        dept_id: '',
        is_r2: '',
        is_what_reason: '',
        is_transform_black: '',
        is_transform_white: '',
        is_transform_mobile: '',
        is_transform_design: ''
        }
      },
      deleteParam: {
        vul_id: ''
      }
    }
  },
  components: {appDepartment, appNonSync},
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      let postJson = this.queryParam
      ajax.post(API.getVulList, postJson).then(response => {
        const vulData = response.data
        this.tableData = vulData.cachalot_vul_list
        this.num = vulData.count
      })
    },
    searchVul() {
      this.fetchData()
    },
    toggleBox() {
      this.show = !this.show;
    },
    handleSizeChange(val) {
      this.queryParam.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryParam.page = val
      this.fetchData()
    },
    vulTypeValue() {
      this.queryParam.keywords.vul_type1_id = this.vulTypeArray[0];
      this.queryParam.keywords.vul_type2_id = this.vulTypeArray[1];
    },
    vulTypeValueDetail() {
      this.vulDetail.vul_type1_id = this.vulTypeArrayDetail[0];
      this.vulDetail.vul_type2_id = this.vulTypeArrayDetail[1];
    },
    vulSourceValue() {
      this.queryParam.keywords.vul_source1_id = this.vulSourceArray[0];
      this.queryParam.keywords.vul_source2_id = this.vulSourceArray[1];
    },
    vulSourceValueDetail() {
      this.vulDetail.vul_source1_id = this.vulSourceArrayDetail[0];
      this.vulDetail.vul_source2_id = this.vulSourceArrayDetail[1];
    },
    handleVulLevel(vulLevelId) {
      let vulLevel
      if (vulLevelId == null) {
        vulLevel = ''
      } else {
        vulLevel = this.vulLevel[vulLevelId].label
      }
      return vulLevel
    },
    handleVulStatus(vulStatusId) {
      let vulStatus
      if (vulStatusId == null) {
        vulStatus = ''
      } else {
        vulStatus = this.vulStatus[vulStatusId].label
      }
      return vulStatus
    },
    openDialog(action = 'look', text) {
      if (action === 'edit') {
        let that = this
        this.action = 1
        this.editable = true
        this.vulDetail = text

        // 漏洞类型
        if (this.vulDetail.vul_type1_id != '') {
          this.vulTypeArrayDetail.splice(0, 1, this.vulDetail.vul_type1_id)
          if (this.vulDetail.vul_type2_id != '') {
            this.vulTypeArrayDetail.splice(1, 1, this.vulDetail.vul_type2_id)
          } else {
            this.vulTypeArrayDetail.splice(1, 1, '')
          }
        } else {
          this.vulTypeArrayDetail.splice(0, 1, '')
        }

        // 漏洞来源
        if (this.vulDetail.vul_source1_id != '') {
          this.vulSourceArrayDetail.splice(0, 1, this.vulDetail.vul_source1_id)
          if (this.vulDetail.vul_source2_id != '') {
            this.vulSourceArrayDetail.splice(1, 1, this.vulDetail.vul_source2_id)
          } else {
            this.vulSourceArrayDetail.splice(1, 1, '')
          }
        } else {
          this.vulSourceArrayDetail.splice(0, 1, '')
        }

        // 非同步字段
        if (typeof (that.vulDetail.non_sync_column) != 'object' && that.vulDetail.non_sync_column != '') {
          this.vulDetail.non_sync_column = this.vulDetail.non_sync_column.split('|')
        }

        if (that.vulDetail.non_sync_column.length == ['']) that.vulDetail.non_sync_column = []
        this.dialogFormVisible = true
        this.fetchData()
      } else if (action === 'delete') {
        this.warnDialogVisible = true
        this.vulDetail = text
      } else {
        let that = this
        this.action = 3
        this.vulDetail = text

        // 漏洞类型
        if (this.vulDetail.vul_type1_id != '') {
          this.vulTypeArrayDetail.splice(0, 1, this.vulDetail.vul_type1_id)
          if (this.vulDetail.vul_type2_id != '') {
            this.vulTypeArrayDetail.splice(1, 1, this.vulDetail.vul_type2_id)
          } else {
            this.vulTypeArrayDetail.splice(1, 1, '')
          }
        } else {
          this.vulTypeArrayDetail.splice(0, 1, '')
        }

        // 漏洞来源
        if (this.vulDetail.vul_source1_id != '') {
          this.vulSourceArrayDetail.splice(0, 1, this.vulDetail.vul_source1_id)
          if (this.vulDetail.vul_source2_id != '') {
            this.vulSourceArrayDetail.splice(1, 1, this.vulDetail.vul_source2_id)
          } else {
            this.vulSourceArrayDetail.splice(1, 1, '')
          }
        } else {
          this.vulSourceArrayDetail.splice(0, 1, '')
        }

        // 非同步字段
        if (typeof (that.vulDetail.non_sync_column) != 'object' && that.vulDetail.non_sync_column != '') {
          this.vulDetail.non_sync_column = this.vulDetail.non_sync_column.split('|')
        }

        // 漏洞修复人
        if (this.vulDetail.vul_repair_people != '') {
          console.log(this.vulDetail.vul_repair_people)
          this.vulRepairPeopleList = JSON.parse(this.vulDetail.vul_repair_people);
        }

        this.editable = false
        this.dialogFormVisible = true
        this.fetchData()
      }
    },
    updateVul(param) {
      let postJson = param
      param.non_sync_column = param.non_sync_column.join('|')
      ajax.post(API.updateVul, postJson).then(response => {
      })
      this.fetchData()
      this.dialogFormVisible = false
    },
    deleteVul(param) {
      this.deleteParam.vul_id = param
      let postJson = this.deleteParam
      ajax.post(API.deleteVul, postJson).then(response => {
      })
      this.fetchData()
      this.warnDialogVisible = false
    },
    goToUrl(id) {
      let myUrl = 'http://anquan.didichuxing.com/project/portals/pages/hole-detail.html?id=' + id
      window.open(myUrl)
    }
  }
}
</script>

<style lang='less'>
  #cachalot {
    background: white;
    margin-top: -15px;
    padding:20px;
    .cachalot-btn {
      background: #FC9153;
      border-radius: 4px;
      width: 95px;
      height: 36px;
      border: none;
      color: white;
      margin-left: 140px;
      cursor: pointer;
      font-weight: 100;
      line-height: 33px;
      span {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        font-weight: 100;
      }
    }
    .displayFlex {
      display: flex;
    }
    .searchInput {
      width: 300px;
    }
    .cutLine {
      // border: 1px solid
      margin-bottom: 13px;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.10);
      background: rgba(0, 0, 0, 0.10);
      border-radius: 4px;
    }
    .dialogCutLine {
      // border: 1px solid
      margin-top: 12px;
      margin-bottom: 22px;
      margin-left: auto;
      margin-right: auto;
      width: 96%;
      border-top: 1px solid rgba(0, 0, 0, 0.01);
      background: rgba(0, 0, 0, 0.10);
      border-radius: 4px;
    }
    .dialogCancelBtn {
      width: 90px;
      font-weight: 100;
    }
    .dialogConfirmBtn {
      background: #FC9153;
      border-radius: 4px;
      height:36px;
      width: 90px;
      padding: 5px;
      border: none;
      font-weight: 100;
      margin-right: 13px;
    }
    .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      .el-form-item {
        margin-bottom: 10px;
      }
      .inputWidth {
        width: 220px;
        margin-left: 5px;
      }
      .el-dialog__body {
        padding: 25px 20px 20px 20px;
        .button {
          border: none;
          color:#FC9153;
          padding: 0px;
          background-color: none;
        }
      }
      .el-cascader.is-disabled {
        span {
          color: #c0c4cc;
        }
      }
    }
  }
</style>

