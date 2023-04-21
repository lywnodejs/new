<template>
  <div id="codeResult">
    <div>
      <!-- <h3>代码安全评估结果</h3> -->
      <div class="codeResultTitle">代码安全评估结果</div>
      <app-permission>
        <el-button
          type="warning"
          class="el-icon-circle-plus-outline loopholeBtn"
          size="mini"
          @click="addVul">
          添加漏洞
        </el-button>
      </app-permission>
      <app-permission>
        <el-button
          type="warning"
          class="el-icon-refresh loopholeBtn"
          size="mini"
          @click="syncScanVuls">
          漏洞同步
        </el-button>
      </app-permission>
      <app-permission>
        <el-button
          type="warning"
          class="el-icon-circle-plus-outline loopholeBtn"
          size="mini"
          @click="bindVul">
          添加绑定
        </el-button>
      </app-permission>
    </div>
    <el-table @cell-click='cellClick'
              :data="tableData" :cell-style="cellStyle"
              empty-text='暂未发现安全漏洞'
              style="margin-top: 15px;width: 100%">
      <el-table-column
        prop="vul_id"
        label="ID"
        width="70">
      </el-table-column>
      <el-table-column
        class="cellVulname"
        prop="vul_name"
        align="center"
        label="漏洞名称 (点击跳转详情页)">
      </el-table-column>
      <el-table-column
        prop="vul_level"
        label="等级"
        width="100">
      </el-table-column>
      <el-table-column
        prop="vul_status"
        label="状态"
        width="100">
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="创建时间"
        width="160">
      </el-table-column>
      <el-table-column
        prop="sdl_engineer"
        label="漏洞创建人"
        width="140">
      </el-table-column>
      <app-permission>
        <el-table-column
          align="center"
          label="操作"
          width="90">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon=""
              @click="deleteCodeResult(scope.row.vul_id)">删除
            </el-button>
          </template>
        </el-table-column>
      </app-permission>
    </el-table>
    <app-permission>
      <div>
        <button type="button" class="codeResultInfo-btn" @click="publishCodeResult">发布结果</button>
        <button type="button" v-if="currentStatus>=7" class='codeResultInfo-btn' @click="confirmCodeResult">确认结果
        </button>
        <button type="button" class="codeResultInfo-btn" @click="closeCodeResult">审核通过</button>
      </div>
      <div>
        <button v-if="currentStatus==7" type="button" class='codeResultInfo-btn' @click="confirmCodeResult">确认结果
        </button>
      </div>
    </app-permission>

    <!-- 添加或更新白盒扫描信息dialog -->
    <el-dialog title="安全漏洞添加" :visible.sync="dialogFormVisible" width="500px">
      <el-form label-width="100px" label-position="left" v-model="vul">
        <el-form-item label="所属任务">
          <el-cascader
            class="inputWidth"
            v-model="vul.evaluateInfo"
            :options="evaluate_info"
            placeholder="请选择所属项目"
            clearable
            filterable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="题目">
          <el-input
            class="inputWidth"
            v-model="vul.holeName"
            placeholder="请输入题目"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="漏洞类型">
          <el-cascader
            class="inputWidth"
            v-model="vul.holeType"
            :options="vul_type"
            placeholder="请选择漏洞类型"
            clearable
            filterable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select class="inputWidth" placeholder="请选择风险等级" v-model="vul.riskLevel" filterable>
            <el-option
              class="inputWidth"
              v-for="item in vul_level"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期望修复时间">
          <el-date-picker
          class="inputWidth"
            v-model="vul.expireTime"
            type="date"
            placeholder="请选择期望修复时间"
            clearable
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="漏洞来源地址">
          <el-input
            class="inputWidth"
            v-model="vul.holeSourceAddress"
            placeholder="url格式：已http://或https://开通 Web类和无线及PC客户端安全SQL注入类必须填写URL地址"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="部门-产品线">
          <app-department class="inputWidth" v-model="vul.holeEffectProductline"></app-department>
        </el-form-item>
        <el-form-item label="受影响URL\APP">
          <el-input
            class="inputWidth"
            v-model="vul.holeEffectInfo"
            placeholder="请输入受影响URL\APP"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="漏洞详情">
          <!-- <el-input
            v-model="vul.holeDetail"
            placeholder="请输入漏洞详情"
            type="textarea"
            clearable>
          </el-input> -->
          <mavon-editor ref=md :ishljs="false" :subfield='false' class='mavon'
                            v-model="vul.holeDetail"/>
        </el-form-item>
        <el-form-item label="漏洞危害">
          <el-input
            class="inputWidth"
            v-model="vul.holeHarm"
            auto-complete="off"
            placeholder="请填写漏洞危害"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="修复建议">
          <el-input 
            class="inputWidth"
            v-model="vul.repairRecommend"
            type="textarea"
            auto-complete="off"
            placeholder="备注"
            clearable>
          </el-input>
        </el-form-item>

        <el-form-item label="修复人">
          <app-employee class="inputWidth" v-model="vul.repairPeople" multiple></app-employee>
        </el-form-item>
        <el-form-item label="关注人">
          <app-employee class="inputWidth" v-model="vul.followers" multiple></app-employee>
        </el-form-item>
        <el-form-item label="同步至安全平台">
          <el-radio class="label" v-model="vul.postAnquan" label='yes'>是</el-radio>
          <el-radio class="label" v-model="vul.postAnquan" label='no'>否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="codeResult-button" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="codeResult-btn" type="warning" round @click="submitVulInfo">确定</el-button>
      </div>
    </el-dialog>
    <!-- 绑定vul -->
    <el-dialog title="添加绑定" :visible.sync="bindVulVisible" width="460px">
      <el-form label-width="120px" label-position="left" v-model="vul">

        <el-form-item label="黑盒评估任务">
          <a-select v-model="bindVulList.black_eva_id" :selectData='blackData' :disabled='blackDisable'></a-select>
        </el-form-item>
        <el-form-item label="白盒评估任务">
          <a-select v-model="bindVulList.white_eva_id" :selectData='whiteData' :disabled='whiteDisable'></a-select>
        </el-form-item>
        <el-form-item label="安全平台漏洞ID">
          <el-input
            v-model="bindVulList.anquan_hole_id"
            auto-complete="off"
            placeholder="请填写安全平台漏洞ID"
            clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="bindVul-button" @click="bindVulVisible = false">取消</el-button>
        <el-button class="bindVul-btn" type="warning" round @click="submitBindVulInfo">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ajax from '@/plugin/ajax'
  import * as API from '@/commons/api/dorado'
  import aSelect from './components/index'
  import {mavonEditor} from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'

  export default {
    name: 'design-result',
    data() {
      return {
        dialogFormVisible: false,
        vul_level: '',
        vul_from: [],
        vul_type: [],
        evaluate_info: [],
        tableData: [],
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        bindVulVisible: false,
        vul: {
          evaluateInfo: '',
          sdl_project_id: '',
          holeName: '',
          holeType: '',
          riskLevel: '',
          holeDetail: '',
          holeHarm: '',
          holeEffectProductline: '',
          holeEffectInfo: '',
          holeSourceAddress: 'http://sdl.xiaojukeji.com',
          followers: '',
          repairRecommend: '',
          repairPeople: '',
          expireTime: '',
          postAnquan: 'yes'
        },
        bindVulList: {
          sdl_project_id: '',
          black_eva_id: '',
          white_eva_id: '',
          anquan_hole_id: ''
        },
        whiteData: [],
        blackData: []
      }
    },
    props: ['currentStatus'],
    inject: ['getWorkFlow'],
    created() {
      this.vul.sdl_project_id = this.$route.query['projectId']
      this.fetchData()
      this.getPreInfo()
    },
    computed: {
      blackDisable: function() {
        if (this.bindVulList.white_eva_id != '') {
          return true
        }
      },
      whiteDisable: function() {
        if (this.bindVulList.black_eva_id != '') {
          return true
        }
      }
    },
    components: { aSelect, mavonEditor },
    methods: {
      fetchData() {
        let postJson = {
          sdl_project_id: parseInt(this.vul.sdl_project_id)
        }
        ajax.post(API.getCodeVulInfo, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            const vulList = response.data.vul_info_list

            //   alert(JSON.stringify(response.data))
            for (let i = 0; i < vulList.length; i++) {
              for (let j = 0; j < this.vul_level.length; j++) {
                if (this.vul_level[j]['value'] === vulList[i]['vul_level']) {
                  vulList[i]['vul_level'] = this.vul_level[j]['label']
                  break;
                }
              }
            }
            this.tableData = response.data.vul_info_list
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
        })
      },
      confirmCodeResult() {
        let postJson = {
          sdl_project_id: this.vul.sdl_project_id
        }
        ajax.post(API.confirmCodeResult, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '确认代码评估信息结果',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.getWorkFlow()
        })

        // this.editable = false
      },
      publishCodeResult() {
        let postJson = {
          sdl_project_id: this.vul.sdl_project_id
        }
        ajax.post(API.publishCodeResult, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '发布代码评估信息结果',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.getWorkFlow()
        })
      },
      closeCodeResult() {
        let postJson = {
          sdl_project_id: this.vul.sdl_project_id
        }
        ajax.post(API.closeProjectWorkflow, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '审核通过',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.getWorkFlow()
        })
      },
      getPreInfo() {
        ajax.post(API.getPreInfo, {}).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          const data = response.data
          if (errno === 0) {
            this.vul_level = data.vul_level
            this.vul_from = data.vul_from
            this.vul_type = data.vul_type
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
        })
      },
      getSimpleEvaluateInfo() {
        let postJson = {
          sdl_project_id: this.vul.sdl_project_id
        }
        ajax.post(API.getSimpleEvaluateInfo, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          const data = response.data
          if (errno === 0) {

            // this.$notify({
            //   title: '成功',
            //   message: errmsg,
            //   type: 'success'
            // })
            this.evaluate_info = data
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
        })
      },
      addVul() {
        this.getSimpleEvaluateInfo()
        this.dialogFormVisible = true
      },
      bindVul() {
        let postJson = {
          sdl_project_id: this.vul.sdl_project_id
        }
        ajax.post(API.getSimpleEvaluateInfo, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          const data = response.data
          if (errno === 0) {
            this.evaluate_info = data
            this.whiteData = this.evaluate_info[1].children
            this.blackData = this.evaluate_info[0].children
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.bindVulVisible = true
        })
      },
      deleteCodeResult(id) {
        let postJson = {
          vul_id: id
        }
        ajax.post(API.deleteCodeResult, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '删除成功',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '删除失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.fetchData()
        })
      },
      syncScanVuls() {
        let postJson = {
          sdl_project_id: this.vul.sdl_project_id
        }
        ajax.post(API.getCodeVulInfo, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          const data = response.data
          if (errno === 0) {
            this.$notify({
              title: '漏洞同步成功',
              message: errmsg,
              type: 'success'
            })
            this.evaluate_info = data
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
        })
      },
      submitVulInfo() {
        let postJson = {
          vul: this.vul
        }
        ajax.post(API.submitVulInfo, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          const data = response.data
          if (errno === 0) {
            this.evaluate_info = data
            this.fetchData()
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.dialogFormVisible = false
        })
      },
      submitBindVulInfo() {
        this.bindVulList.sdl_project_id = this.vul.sdl_project_id
        if (this.bindVulList.anquan_hole_id != '') {
          this.bindVulList.anquan_hole_id = parseInt(this.bindVulList.anquan_hole_id)
        }
        ajax.post(API.bindCodeResult, this.bindVulList).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '绑定成功',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.bindVulVisible = false
        })
      },
      cellClick(row, column, cell, event) {
        if (column.property == 'vul_name') {
          window.open(row.anquan_plat_vul_url, '_blank')
        }
      },
      cellStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 1) {
          return 'cursor:pointer'
        }
      }
    }
  }
</script>

<style scoped lang="less">
#codeResult {
    -webkit-font-smoothing: antialiased;
    padding-top: 40px;
    .codeResultTitle {
      color: #333333;
      font-size: 14px;
      display: inline-block;
      line-height: 28px;
    }
    .codeResult-button {
    width: 90px;
    font-size: 13px;
    height: 32px;
    padding: 0px;
    // font-weight: 100;
  }
  .codeResult-btn {
    font-size: 13px;
    background: #fc9153;
    border-radius: 4px;
    height: 32px;
    width: 90px;
    padding: 0px;
    border: none;
    // font-weight: 100;
  }
  .bindVul-button {
    width: 90px;
    height:32px;
    padding: 0;
    font-size: 13px;
    // font-weight: 100;
  }
  .bindVul-btn {
    font-size: 13px;
    background: #fc9153;
    border-radius: 4px;
    height: 32px;
    width: 90px;
    padding: 0px;
    border: none;
    // font-weight: 100;
    // margin-right: 30px;
  }
  .codeResultInfo-btn {
    margin-top: 20px;
    font-size: 12px;
    margin-right: 15px;
    background: #fc9153;
    border-radius: 4px;
    height: 32px;
    width: 100px;
    padding: 0px;
    border: none;
    color: white;
    cursor: pointer;
    // font-weight: 100;
  }
  .loopholeBtn {
    background: white;
    color: #fc9153;
    border-radius: 4px;
    height: 28px;
    width: 96px;
    float: right;
    border: 1px solid #fc9153;
    margin-left: 15px;
    position: relative;
    // bottom: 20px;
  }
  .loopholeBtn:hover {
    background: #fff7f2;
  }
  .cellVulname:hover {
    cursor: pointer;
    color: #fc9153;
  }
  .mavon {
    word-wrap: break-word;
    // width: 420px;
    width: 100%;
    // font-size: 10px;
  }
  .inputWidth {
    // width: 420px;
    width: 100%;
  }
  .el-dialog {
    .el-select {
      width: 100%;
    }
  }
}
  
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
