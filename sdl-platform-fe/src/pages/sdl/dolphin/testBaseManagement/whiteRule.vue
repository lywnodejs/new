<template>
    <div id="whiteRule">
        <div class="el-main">
            <el-form class="searchForm" label-position="left"  :inline='true'>
                <div class="displayFlex">
                    <el-form-item label="规则名称:" label-width="80px" prop="name">
                        <el-input class="searchInput"
                        clearable
                        placeholder="请输入规则名称"
                        v-model="inputVal"
                        auto-complete="off">
                        </el-input>
                    </el-form-item>
                </div>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item align="center">
                            <button type="button" class='whiteRule-button' @click="fetchData(inputVal)"><span>搜&nbsp;&nbsp;索</span></button>
                            <button type="button" class='whiteRule-btn'  @click="openDialog('add')"><span>新增规则</span></button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div class="cutLine"></div>

            <!-- 展示数据 -->
            <el-table
                :data="whiteRuleList"
                v-loading>
                <el-table-column
                    prop="white_rule_id"
                    label="ID"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="checkmarx_id"
                    label="Checkmarx ID"
                    align="center"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="white_rule_name"
                    label="规则名称"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="漏洞等级"
                    width="100"
                    align="center">
                    <template slot-scope="scope">{{pretreatVulLevel(scope.row.vul_level_id)}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="rule_language"
                    label="语言类型"
                    width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                    width="300">
                    <template slot-scope="scope">
                      <el-button @click="openDialog('look', scope.row)"
                        type="text"
                        size="mini">查看
                      </el-button>
                      <el-button @click="openDialog('edit', scope.row)"
                          type="text"
                          size="mini">编辑
                      </el-button>
                      <el-button type="text" size="mini" v-show="scope.row.is_disable==1" @click="enableWhite(scope.row.white_rule_id)">启用</el-button>
                      <el-button type="text" size="mini" v-show="scope.row.is_disable==0" @click="disableWhite(scope.row.white_rule_id)">禁用</el-button>
                      <el-button @click="openDialog('vul', scope.row.white_rule_id);"
                                 type="text"
                                 size="mini">漏洞知识
                      </el-button>
                      <el-button @click="openDialog('solution', scope.row.white_rule_id)"
                                 type="text"
                                 size="mini">安全方案
                      </el-button>
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
        <!-- 查看修改威胁 -->
        <el-dialog :title="action==2 ? '新建白盒规则': action==3?'查看白盒规则':'编辑白盒规则'" :visible.sync="dialogFormVisible" width="460px">
            <el-form :inline="true" label-width="100px" label-position="left">
              <!-- <el-col> -->
                <el-form-item v-if="action==1" label="白盒规则 ID" >
                    <el-input class="inputWidth" v-model="whiteRule.white_rule_id" placeholder="请输入白盒规则Id" clearable :disabled="true"></el-input>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="Checkmarx ID" >
                    <el-input class="inputWidth" v-model="whiteRule.checkmarx_id" placeholder="请输入CheckmarxId" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="白盒规则名称" >
                    <el-input class="inputWidth" v-model="whiteRule.white_rule_name" placeholder="请输入白盒规则名称" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="漏洞类型" >
                    <vul-type class="inputWidth" v-model="whiteRule.vul_type_id" :disabled="!editable"></vul-type>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="漏洞等级" >
                    <vul-level  class="inputWidth" v-model="whiteRule.vul_level_id"  :disabled="!editable"></vul-level>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="编程语言" >
                    <white-language v-model="whiteRule.rule_language" class="inputWidth" :disabled="!editable"></white-language>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="漏洞危害" >
                    <el-input class="inputWidth" v-model="whiteRule.vul_harmfulness" placeholder="请输入漏洞危害" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="漏洞描述" >
                    <el-input class="inputWidth" v-model="whiteRule.vul_description" placeholder="请输入漏洞描述" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="漏洞修复建议" >
                    <el-input class="inputWidth" v-model="whiteRule.vul_fix_suggestion" placeholder="请输入漏洞修复建议" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="可信度" >
                    <el-input class="inputWidth" v-model="whiteRule.rule_credibility" placeholder="请输入可信度" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item v-if="action!=2" label="创建时间" >
                    <el-input class="inputWidth" v-model="whiteRule.create_time" placeholder="" clearable :disabled="true"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item v-if="action!=2" label="更新时间" >
                    <el-input class="inputWidth" v-model="whiteRule.update_time" placeholder="" clearable :disabled="true"></el-input>
                </el-form-item>
              <!-- </el-col> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="whiteEvalu-button" @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="action==1" class="whiteEvalu-btn" type="warning" round @click="updateWhite(whiteRule)">确定</el-button>
                <el-button v-if="action==2" class="whiteEvalu-btn" type="warning" round @click="createWhite(whiteRule)">创建</el-button>
            </div>
        </el-dialog>
      <!--
        2018/10/30 @huanqi
        绑定漏洞知识
      -->
      <el-dialog title="关联漏洞知识" :visible.sync="vulDialogFormVisible" width="1200px">
        <div class="flex">
          <el-input placeholder="请输入漏洞名称" v-model="vulQueryParam.keywords.vul_knowledge_name"
                    style="width: 40%;margin-bottom: 20px;">

          </el-input>
          <button slot="append" @click="searchVul" class="whiteRule-button dialog-btn">检&nbsp;索</button>
        </div>
        <el-table
          ref="vulTable"
          :data="vulKnowledgeList"
          tooltip-effect="dark"
          @selection-change="handleVulSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="ID"
            width="55">
            <template slot-scope="scope">{{ scope.row.vul_knowledge_id }}</template>
          </el-table-column>
          <el-table-column
            label="漏洞名称">
            <template slot-scope="scope">{{ scope.row.vul_knowledge_name }}</template>
          </el-table-column>
          <el-table-column
            label="漏洞类型"
            width="120">
            <template slot-scope="scope">{{ scope.row.vul_type_id }}</template>
          </el-table-column>
          <el-table-column
            label="漏洞级别"
            width="100">
            <template slot-scope="scope">{{ scope.row.vul_level_id }}</template>
          </el-table-column>
          <el-table-column
            label="开发语言"
            width="100">
            <template slot-scope="scope">{{ scope.row.vul_language }}</template>
          </el-table-column>
          <el-table-column
            label="漏洞描述"
            show-overflow-tooltip="true"
            width="200">
            <template slot-scope="scope">{{ scope.row.vul_description }}</template>
          </el-table-column>
          <el-table-column
            label="漏洞危害"
            show-overflow-tooltip="true"
            width="200">
            <template slot-scope="scope">{{ scope.row.vul_harmfulness }}</template>
          </el-table-column>
          <el-table-column
            label="修复建议"
            show-overflow-tooltip="true"
            width="200">
            <template slot-scope="scope">{{ scope.row.vul_fix_suggestion }}</template>
          </el-table-column>
        </el-table>
        <div align="right" style="margin-top: 10px;">
          <el-pagination
            @size-change="handleVulSizeChange"
            @current-change="handleVulCurrentChange"
            :current-page="vulQueryParam.page"
            :page-sizes="[10,20,30, 50]"
            :page-size="vulQueryParam.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="vulNum">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="whiteEvalu-button" @click="vulDialogFormVisible=false">取消</el-button>
          <el-button class="whiteEvalu-btn dialog-button" type="warning" round @click="bindVul()">确定</el-button>
        </div>
      </el-dialog>
      <!-- 绑定安全方案 -->
      <el-dialog title="关联安全方案" :visible.sync="solutionDialogFormVisible" width="1200px">
        <div class="flex">
          <el-input placeholder="请输入安全方案名称" v-model="slnQueryParam.keywords.sln_knowledge_name"
                    style="width: 40%;margin-bottom: 20px;">
          </el-input>
          <button @click="searchSolution" class="whiteRule-button dialog-btn">检&nbsp;索</button>
        </div>
        <el-table
          ref="slnTable"
          :data="slnKnowledgeList"
          tooltip-effect="dark"
          @selection-change="handleSlnSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="ID"
            width="55">
            <template slot-scope="scope">{{ scope.row.sln_knowledge_id }}</template>
          </el-table-column>
          <el-table-column
            label="安全方案名称">
            <template slot-scope="scope">{{ scope.row.sln_knowledge_name }}</template>
          </el-table-column>
          <el-table-column
            label="背景"
            show-overflow-tooltip="true"
            width="300">
            <template slot-scope="scope">{{ scope.row.sln_background }}</template>
          </el-table-column>
          <el-table-column
            label="方案详情"
            show-overflow-tooltip="true"
            width="300">
            <template slot-scope="scope">{{ scope.row.sln_detail }}</template>
          </el-table-column>
          <el-table-column
            label="方案选型"
            show-overflow-tooltip="true"
            width="300">
            <template slot-scope="scope">{{ scope.row.sln_selection }}</template>
          </el-table-column>
        </el-table>
        <div align="right" style="margin-top: 10px;">
          <el-pagination
            @size-change="handleSlnSizeChange"
            @current-change="handleSlnCurrentChange"
            :current-page="slnQueryParam.page"
            :page-sizes="[10,20,30, 50]"
            :page-size="slnQueryParam.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="slnNum">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="whiteEvalu-button" @click="solutionDialogFormVisible = false">取消</el-button>
          <el-button class="whiteEvalu-btn dialog-button" type="warning" round @click="bindSolution()">确定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { connect } from '@/lib'
import vulLevel from '../testBaseManagement/components/index'
import whiteLanguage from '../testBaseManagement/components/language'
import vulType from '../testBaseManagement/components/vulType'

export default connect(() => {
  return {

      whiteRuleList: 'dolphin_white/whiteRule',
      num: 'dolphin_white/whiteRuleList',
      vulKnowledgeList: 'dolphin_knowledgeBase/vulKnowledgeList',
      vulNum: 'dolphin_knowledgeBase/vulListLength',
      slnKnowledgeList: 'dolphin_knowledgeBase/slnKnowledgeList',
      slnNum: 'dolphin_knowledgeBase/slnKnowledgeListLength',
      VulAndSolutionIds: 'knowledge_relation/VulAndSolutionIds'
  }
}, {
  getWhiteRule: 'dolphin_white/getWhiteRule',
  createWhiteRule: 'dolphin_white/createWhiteRule',
  updateWhiteRule: 'dolphin_white/updateWhiteRule',
  disableWhiteRule: 'dolphin_white/disableWhiteRule',
  enableWhiteRule: 'dolphin_white/enableWhiteRule',
  getVulAndSolutionIdsByTestId: 'knowledge_relation/getVulAndSolutionIdsByTestId', // @huanqi 2018/10/30
  bindVulByTestId: 'knowledge_relation/bindVulByTestId',
  bindSolutionByTestId: 'knowledge_relation/bindSolutionByTestId',
  getVulKnowledgeData: 'dolphin_knowledgeBase/getVulKnowledgeList',
  getSlnKnowledge: 'dolphin_knowledgeBase/getSlnKnowledgeList',
  getPreInfo: 'dolphin_knowledgeBase/getPreInfo'
})({
    name: 'whiteRule',
    data() {
      return {
        editable: true,
        dialogFormVisible: false,
        newDialogFormVisible: false,
        deleteDialogVisible: false,
        vulDialogFormVisible: false,
        solutionDialogFormVisible: false,
        didi_test_id: 0,
        vulTypeList: [],
        vulMultipleSelection: [],
        slnMultipleSelection: [],
        action: 1,
        inputVal: '',
        whiteRule: {
            white_rule_id: 0,
            white_rule_name: '',
            checkmarx_id: 0,
            vul_type_id: 0,
            vul_level_id: 0,
            rule_language: '',
            vul_description: '',
            vul_harmfulness: '',
            vul_fix_suggestion: '',
            rule_credibility: 0
        },
        queryParam: {
          page: 1,
          limit: 10,
          keywords: {white_rule_name: ''}
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
        }
      }
    },
    created() {
      this.getPreInfo().then(response => {
        const data = response.vul_type
        this.vulTypeList = data
      })
    },
    mounted() {
      this.fetchData()
    },
    updated() {
      this.toggleSelection('vul')
      this.toggleSelection('sln')
    },
    components: { vulLevel, whiteLanguage, vulType },
    methods: {
        openDialog(action = 'look', text) {
            if (action === 'edit') {
                this.action = 1
                this.editable = true
                this.whiteRule = {
                  white_rule_id: text.white_rule_id,
                  white_rule_name: text.white_rule_name,
                  checkmarx_id: text.checkmarx_id,
                  vul_type_id: text.vul_type_id,
                  vul_level_id: text.vul_level_id,
                  rule_language: text.rule_language,
                  vul_description: text.vul_description,
                  vul_harmfulness: text.vul_harmfulness,
                  vul_fix_suggestion: text.vul_fix_suggestion,
                  rule_credibility: text.rule_credibility,
                  create_time: text.create_time,
                  update_time: text.update_time
                }
                console.log(this.whiteRule.vul_type_id)
                this.dialogFormVisible = true
            } else if (action === 'add') {
                this.action = 2
                this.editable = true
                this.whiteRule = {
                  white_rule_id: 0,
                  white_rule_name: '',
                  checkmarx_id: 0,
                  vul_type_id: [],
                  vul_level_id: 0,
                  rule_language: '',
                  vul_description: '',
                  vul_harmfulness: '',
                  vul_fix_suggestion: '',
                  rule_credibility: 0
                }
                this.dialogFormVisible = true
                this.newDialogFormVisible = true
            } else if (action === 'vul') {

              /**
               * 增加漏洞知识和方案对话框。 @angelwhu
               * 2018/10/29
               */
              this.didi_test_id = text
              this.vulDialogFormVisible = true
              let postParam = {
                didi_test_id: this.didi_test_id,
                didi_test_type: 1
              }
              this.getVulAndSolutionIdsByTestId(postParam)
              this.searchVul()
            } else if (action === 'solution') {
              this.didi_test_id = text
              this.solutionDialogFormVisible = true
              let postParam = {
                didi_test_id: this.didi_test_id,
                didi_test_type: 1
              }
              this.getVulAndSolutionIdsByTestId(postParam)
              this.searchSolution()

              /**
               *
               */
            } else {
                this.action = 3
                this.whiteRule = text
                this.editable = false
                this.dialogFormVisible = true
            }
        },
        fetchData(name) {
            this.queryParam.keywords.white_rule_name = name
            let queryParam = {queryParam: this.queryParam}
            this.getWhiteRule(queryParam).then(res => {
              for (let i = 0; i < this.whiteRuleList.length; i++) {
                this.whiteRuleList[i].vul_type_id = this.getVulType(this.whiteRuleList[i].vul_type_id)
              }
            })
        },
        getVulType(myId) {
            for (let i = 0; i < this.vulTypeList.length; i++) {
              let id = this.vulTypeList[i].value
              for (let j = 0; j < this.vulTypeList[i].children.length; j++) {
                if (this.vulTypeList[i].children[j].value == myId) {
                  return [id, myId]
                }
              }
            }
        },
        updateWhite(params) {
            if (params.checkmarx_id)params.checkmarx_id = parseInt(params.checkmarx_id)
            if (params.vul_type_id)params.vul_type_id = parseInt(params.vul_type_id[1])
            if (params.vul_level_id)params.vul_level_id = parseInt(params.vul_level_id)
            if (params.rule_credibility)params.rule_credibility = parseInt(params.rule_credibility)
            this.updateWhiteRule(params)
            this.fetchData()
            this.dialogFormVisible = false
        },
        createWhite(params) {
            if (params.white_rule_id != null) delete params['white_rule_id']
            if (params.checkmarx_id)params.checkmarx_id = parseInt(params.checkmarx_id)
            if (params.vul_type_id)params.vul_type_id = parseInt(params.vul_type_id[1])
            if (params.vul_level_id)params.vul_level_id = parseInt(params.vul_level_id)
            if (params.rule_credibility)params.rule_credibility = parseInt(params.rule_credibility)
            this.createWhiteRule(params)
            this.fetchData()
            this.dialogFormVisible = false
        },
        enableWhite(id) {
            this.enableWhiteRule(id).then(res => {})
            this.fetchData()
        },
        disableWhite(id) {
            this.disableWhiteRule(id).then(res => {})
            this.fetchData()
        },
        handleSizeChange(val) {
        this.queryParam.limit = val
        this.fetchData()
        },
        handleCurrentChange(val) {
            this.queryParam.page = val
            this.fetchData()
        },
        pretreatVulLevel(vulLevel) {
            if (vulLevel == 0) {
                vulLevel = '严重(S0)'
            } else if (vulLevel == 1) {
                vulLevel = '高危(S1)'
            } else if (vulLevel == 2) {
                vulLevel = '中危(S2)'
            } else if (vulLevel == 3) {
                vulLevel = '低危(S3)'
            }
            return vulLevel
        },

      // 绑定漏洞知识
      handleVulSelectionChange(val) {
        this.vulMultipleSelection = val;
      },
      handleVulSizeChange(val) {
        this.vulQueryParam.limit = val
        this.searchVul()
      },
      handleVulCurrentChange(val) {
        this.vulQueryParam.page = val
        this.searchVul()
      },
      searchVul() {
        let queryParam = {queryParam: this.vulQueryParam}
        this.getVulKnowledgeData(queryParam).then(res => {
          for (let i = 0; i < this.vulKnowledge.length; i++) {
            this.vulKnowledge[i].vul_level_id = this.pretreatVulLevel(this.vulKnowledge[i].vul_level_id)
          }
        })
      },
      bindVul() {
        let vulIdArray = []
        this.vulMultipleSelection.forEach(vul => {
          vulIdArray.push(vul.vul_knowledge_id)
        })
        let postParam = {
          didi_test_id: this.didi_test_id,
          didi_test_type: 1,
          vul_knowledge_ids: vulIdArray
        }
        this.bindVulByTestId(postParam)
        this.vulDialogFormVisible = false
      },

      // 绑定安全方案
      handleSlnSizeChange(val) {
        this.slnQueryParam.limit = val
        this.searchSolution()
      },
      handleSlnCurrentChange(val) {
        this.slnQueryParam.page = val
        this.searchSolution()
      },
      handleSlnSelectionChange(val) {
        this.slnMultipleSelection = val;
      },
      searchSolution() {
        let queryParam = {queryParam: this.slnQueryParam}
        this.getSlnKnowledge(queryParam).then(res => {
        })
      },
      bindSolution() {
        let slnIdArray = []
        this.slnMultipleSelection.forEach(sln => {
          slnIdArray.push(sln.sln_knowledge_id)
        })
        let postParam = {
          didi_test_id: this.didi_test_id,
          didi_test_type: 1,
          sln_knowledge_ids: slnIdArray
        }
        this.bindSolutionByTestId(postParam)
        this.solutionDialogFormVisible = false
      },
      toggleSelection(type = 'vul') {
        if (type === 'vul') {
          let rows = this.VulAndSolutionIds.vul_knowledge_ids
          if (this.$refs.vulTable !== undefined) {
            if (rows) {
              rows.forEach(row => {
                this.vulKnowledgeList.forEach(vul => {
                  if (row === vul.vul_knowledge_id) {
                    this.$refs.vulTable.toggleRowSelection(vul);
                  }
                })
              });
            }
          }
        } else {
          let rows = this.VulAndSolutionIds.sln_knowledge_ids
          if (this.$refs.slnTable !== undefined) {
            if (rows) {
              rows.forEach(row => {
                this.slnKnowledgeList.forEach(sln => {
                  if (row === sln.sln_knowledge_id) {
                    this.$refs.slnTable.toggleRowSelection(sln);
                  }
                })
              });
            }
          }
        }
      }
    }
})
</script>
<style lang="less">
#whiteRule{
    width: 100%;
    // margin-top: -15px;
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
  .is-disabled {
     .el-cascader__label span{
      color: #c0c4cc;
    }
   }
.inputWidth{
    width: 320px;
}
.whiteRule-btn{
  border: 1px solid #FC9153;
  border-radius: 4px;
  width: 95px;
  height: 32px;
  color: #FC9153;
  background: white;
  margin-left: 25px;
  cursor: pointer;
  font-size: 13px;
  -webkit-font-smoothing: antialiased;
  // line-height: 33px;
  span{
    font-family: Avenir,Helvetica,Arial,sans-serif;
    // font-weight: 100;
  }
}
.whiteRule-btn:hover{
    background-color: #fff3e8;
}
.whiteRule-button{
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
.whiteRule-button.dialog-btn {
  margin-left: 20px;
}
.whiteEvalu-button{
  width: 80px;
  height: 32px;
  padding: 7px 15px;
  font-size: 13px;
}
.whiteEvalu-btn{
  background: #FC9153;
  border-radius: 4px;
  font-size: 13px;
  height: 32px;
  width: 80px;
  padding: 7px 15px;
  border: none;
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
}

</style>
