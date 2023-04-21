<template>
  <div id="fatbirdRule">
    <div class="el-main">
      <el-form class="searchForm" label-position="left"  :inline='true'>
        <el-row :gutter="20">
          <el-col :span='8'>
            <el-form-item label="规则ID:" label-width="80px" prop="name">
              <el-input class="searchInput"
              clearable
              placeholder="请输入规则ID"
              v-model="inputVal.rule_id"
              auto-complete="off">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="规则名称:" label-width="80px" prop="name">
              <el-input class="searchInput"
              clearable
              placeholder="请输入规则名称"
              v-model="inputVal.rule_name"
              auto-complete="off">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="开发语言: " label-width="80px">
              <el-select 
                class="searchInput"
                v-model="inputVal.language"
                filterable
                placeholder="请选择开发语言"
                clearable
                :disabled = "!editable">
                <el-option v-for="item in vulLanguage"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='24'>
            <el-form-item align="center">
              <button type="button" class='cobraRule-button' @click="fetchData(inputVal)"><span>搜&nbsp;&nbsp;索</span></button>
              <button type="button" class='cobraRule-btn'  @click="openDialog('add')"><span>新增规则</span></button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="cutLine"></div>

      <!-- 展示数据 -->
      <el-table
        :data="cobraList"
        v-loading>
        <el-table-column
          prop="id"
          label="ID"
          align="center"
          width="60">
        </el-table-column>
        <el-table-column
          label="规则ID"
          width="100"
          align="center">
          <template slot-scope="scope">{{ scope.row.rule_id }}</template>
        </el-table-column>
        <el-table-column
          label="fatbird规则名"
          align="center">
          <template slot-scope="scope">{{ scope.row.rule_name }}</template>
        </el-table-column>
        <el-table-column
          label="规则描述"
          width="220"
          align="center">
          <template slot-scope="scope">{{ scope.row.rule_description }}</template>
        </el-table-column>
        <el-table-column
          label="开发语言"
          width="90"
          align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.language.split(',')" :key="item">{{item}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="规则可信度" 
          align="center"
          width="100">
          <template slot-scope="scope">{{ handleRuleCredibility(scope.row.rule_credibility) }}</template>
        </el-table-column>
        <el-table-column
          label="规则模式" 
          align="center"
          width="100">
          <template slot-scope="scope">{{ handleRuleModeValue(scope.row.rule_mode) }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button @click="openDialog('look', scope.row)"
              type="text"
              size="mini"
              class='fontColor'>查看
            </el-button>
            <el-button @click="openDialog('edit', scope.row)"
              type="text"
              size="mini"
              class='fontColor'>编辑
            </el-button>
            <el-button class='fontColor' type="text" size="mini" v-show="scope.row.is_disable==1" @click="enableCobra(scope.row)">启用</el-button>
            <el-button class='fontColor' type="text" size="mini" v-show="scope.row.is_disable==0" @click="disableCobra(scope.row)">禁用</el-button>
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
            :total="cobraNum">
        </el-pagination>
      </div>
    </div>
      <!-- 查看修改Cobra规则-->
    <el-dialog :title="action==2 ? '新建Fatbird规则':action==3?'查看Fatbird规则':'编辑Fatbird规则'" :visible.sync="dialogFormVisible" width="460px">
      <el-form :inline="true" label-width="100px" label-position="left">
        <el-form-item  v-if="action==1" label="ID">
          <el-input class="inputWidth"
                    v-model="cobraRule.id"
                    placeholder="ID"
                    clearable :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="规则ID">
          <el-input class="inputWidth"
                    v-model="cobraRule.rule_id"
                    placeholder="请输入规则id"
                    clearable
                    :disabled = "!editable">
          </el-input>
        </el-form-item>
        <el-form-item label="规则名称">
          <el-input class="inputWidth"
                    v-model="cobraRule.rule_name"
                    placeholder="请输入规则名称"
                    clearable
                    :disabled = "!editable">
          </el-input>
        </el-form-item>
        <el-form-item label="规则描述">
          <el-input class="inputWidth"
                    v-model="cobraRule.rule_description"
                    placeholder="请输入规则描述"
                    clearable
                    :disabled = "!editable">
          </el-input>
        </el-form-item>
        <el-form-item label="语言">
          <el-select 
            class="inputWidth"
            v-model="cobraRule.language"
            multiple
            filterable
            placeholder="请选择语言"
            clearable
            :disabled = "!editable">
            <el-option v-for="item in vulLanguage"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="漏洞类型" >
              <vul-type class="inputWidth" v-model="cobraRule.vul_type_id" :disabled="!editable"></vul-type>
        </el-form-item>
        <el-form-item label="规则模式">
          <el-select class="inputWidth" 
                    v-model="cobraRule.rule_mode" 
                    placeholder="请选择规则模式"
                    clearable
                    :disabled = "!editable">
            <el-option v-for="item in ruleMode"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则类型">
          <el-select class="inputWidth" 
                    v-model="cobraRule.rule_type" 
                    placeholder="请选择规则类型"
                    clearable
                    :disabled = "!editable">
            <el-option v-for="item in ruleType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则可信度">
          <el-select class="inputWidth" 
                    v-model="cobraRule.rule_credibility" 
                    placeholder="请选择规则模式"
                    clearable
                    :disabled = "!editable">
            <el-option v-for="item in trust"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则是否禁用">
          <el-select class="inputWidth" 
                    v-model="cobraRule.is_disable" 
                    placeholder="请选择是否禁用"
                    clearable
                    :disabled = "!editable">
            <el-option v-for="item in isDisabled"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" v-if="action==1||action ==3">
          <el-input class="inputWidth"
                    v-model="cobraRule.create_time"
                    placeholder=""
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="更新时间" v-if="action==1||action ==3">
          <el-input class="inputWidth"
                    v-model="cobraRule.update_time"
                    placeholder=""
                    disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button class="cobra-button" @click="dialogFormVisible = false">取消</el-button>
          <el-button v-if="action==1" class="cobra-btn" type="warning" round @click="updateCobraRuleInfo()">确定</el-button>
          <el-button v-if="action==2" class="cobra-btn" type="warning" round @click="createCobraRuleInfo()">创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { connect } from '@/lib'
import * as CONSTANTS from '@/commons/dolphin'
import vulLevel from '../testBaseManagement/components/index'
import mobilePlatform from '../testBaseManagement/components/platform'
import vulType from '../testBaseManagement/components/vulType'

export default connect(() => {
  return {
    cobraList: 'dolphin_baseline_relation/fatbirdList',
    cobraNum: 'dolphin_baseline_relation/fatbirdListLength'
  }
}, {
  getFatbirdList: 'dolphin_baseline_relation/getFatbirdList',
  createFatbirdRule: 'dolphin_fatbird_rule/createFatbirdRule',
  updateFatbirdRule: 'dolphin_fatbird_rule/updateFatbirdRule'
})({
    name: 'cobraRule',
    data() {
      return {
        editable: true,
        dialogFormVisible: false,
        newDialogFormVisible: false,
        deleteDialogVisible: false,
        didi_test_id: 0,
        didi_test_type: 3,
        action: 1,
        inputVal: {
          rule_name: '',
          rule_id: '',
          language: ''
        },
        vulLanguage: CONSTANTS.vulLanguage,
        isDisabled: CONSTANTS.isDisabled,
        ruleMode: CONSTANTS.ruleMode,
        trust: CONSTANTS.trust,
        ruleType: [{value: 0, label: '流规则'}, {value: 1, label: '正则规则'}],
        cobraRule: {
          id: 0,
          rule_id: '',
          rule_name: '',
          rule_mode: 0,
          rule_type: null,
          rule_credibility: 0,
          rule_description: '',
          is_disable: 0,
          language: [],
          vul_type_id: [],
          vul_type1_id: 0,
          vul_type2_id: 0,
          create_time: '',
          update_time: ''
        },
        queryParam: {
          page: 1,
          limit: 10,
          keywords: {
            rule_name: '',
            rule_id: '',
            language: ''
          }
        },
        vulQueryParam: {
          page: 1,
          limit: 10,
          keywords: {
            vul_knowledge_name: ''
          }
        },
        slnQueryParam: {
          page: 1,
          limit: 10,
          keywords: {
            sln_knowledge_name: ''
          }
        },
        cobraRuleRequest: {}
      }
    },
    created() {},
    mounted() {
      this.fetchData()
    },
    components: { vulLevel, mobilePlatform, vulType },
    methods: {
      fetchData(name) {
        if (name) {
          this.queryParam.keywords.rule_name = name.rule_name
          this.queryParam.keywords.rule_id = name.rule_id
          this.queryParam.keywords.language = name.language
        }
        let queryParam = this.queryParam
        this.getFatbirdList(queryParam).then(res => {
        })
      },
      openDialog(action = 'look', text) {
        if (action === 'edit' || action === 'look') {
          if (action === 'edit') {
            this.action = 1
            this.editable = true
          } else {
            this.action = 3
            this.editable = false
          }
          this.cobraRule = {
            id: text.id,
            rule_id: text.rule_id,
            rule_name: text.rule_name,
            rule_mode: text.rule_mode,
            rule_type: text.rule_type,
            rule_credibility: text.rule_credibility,
            rule_description: text.rule_description,
            is_disable: text.is_disable,
            language: text.language.split(','),
            create_time: text.create_time,
            update_time: text.update_time,
            vul_type_id: [text.vul_type1_id, text.vul_type2_id]
          }
          this.dialogFormVisible = true
        } else if (action === 'add') {
          this.action = 2
          this.editable = true
          this.cobraRule = {
            id: null,
            rule_id: '',
            rule_name: '',
            rule_type: null,
            rule_mode: null,
            rule_credibility: null,
            rule_description: '',
            is_disable: null,
            language: '',
            create_time: '',
            update_time: '',
            vul_type_id: []
          }
          this.dialogFormVisible = true
          this.newDialogFormVisible = true
        }
      },
      handleCobraRequestValue() {
        this.cobraRuleRequest = this.cobraRule
        this.cobraRuleRequest.rule_credibility = parseInt(this.cobraRuleRequest.rule_credibility)
        this.cobraRuleRequest.language = this.cobraRuleRequest.language.join(',')

        if (this.cobraRule.vul_type_id) {
          this.cobraRuleRequest.vul_type1_id = this.cobraRule.vul_type_id[0]
          this.cobraRuleRequest.vul_type2_id = this.cobraRule.vul_type_id[1]
          this.cobraRule.vul_type_id = []
        }
        delete this.cobraRuleRequest.vul_type_id
      },
      updateCobraRuleInfo() {
        this.handleCobraRequestValue()
        this.updateFatbirdRule(this.cobraRuleRequest).then(res => {
          this.fetchData()
          this.cobraRule.vul_type_id = []
        })
        this.dialogFormVisible = false
      },
      createCobraRuleInfo() {
        this.handleCobraRequestValue()
        this.createFatbirdRule(this.cobraRuleRequest).then(res => {
          this.fetchData()
          this.cobraRule.vul_type_id = []
        })
        this.dialogFormVisible = false
      },

      handleRuleCredibility(id) {
          for (let i = 0; i < this.trust.length; i++) {
              if (this.trust[i].value == id) return this.trust[i].label
          }
      },
      handleSizeChange(val) {
        this.queryParam.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryParam.page = val
        this.fetchData()
      },
      handleRuleModeValue(val) {
        for (let i = 0; i < CONSTANTS.ruleMode.length; i++) {
          if (val == CONSTANTS.ruleMode[i].value) {
            return CONSTANTS.ruleMode[i].label
          }
        }
      },
      enableCobra(row) {
        this.cobraRuleRequest = row
        this.cobraRuleRequest.rule_credibility = parseInt(this.cobraRuleRequest.rule_credibility)
        this.cobraRuleRequest.is_disable = 0
        this.updateCobraRule(this.cobraRuleRequest).then(res => {
          this.fetchData()
        })
      },
      disableCobra(row) {
        this.cobraRuleRequest = row
        this.cobraRuleRequest.rule_credibility = parseInt(this.cobraRuleRequest.rule_credibility)
        this.cobraRuleRequest.is_disable = 1
        this.updateCobraRule(this.cobraRuleRequest).then(res => {
          this.fetchData()
        })
      }
    }
})
</script>
<style lang="less">

#fatbirdRule{
    width: 100%;
    
  .el-main{
      width: 100%;
      box-sizing: border-box;
      background: white;
    .displayFlex{
      display: flex;
    }
    .searchForm{
      .searchInput{
        width: 230px;
      }
    }
  }
  .inputWidth{
    width: 320px;
  }
  .is-disabled {
    .el-cascader__label span{
      color: #c0c4cc;
    }
  }
  .cobraRule-btn{
    border: 1px solid #FC9153;
    border-radius: 4px;
    width: 105px;
    height: 32px;
    color: #FC9153;
    background: white;
    margin-left: 25px;
    cursor: pointer;
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
    span{
      font-family: Avenir,Helvetica,Arial,sans-serif;
    }
  }
  .cobraRule-button{
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
  .cobraRule-btn:hover{
      background-color: #fff3e8;
  }

  .mobilePlugin-button.dialog-btn {
    margin-left: 15px;
  }

  .cobra-button{
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    font-size: 13px;
  }
  .cobra-btn{
    background: #FC9153;
    border-radius: 4px;
    font-size: 13px;
    height: 32px;
    width: 80px;
    padding: 7px 15px;
    border: none;
  }
  .fontColor{
    color: #FC9153 !important;
  }
  .cutLine {
    margin-top: 5px;
    margin-bottom: 17px;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.10);
  }
}
</style>