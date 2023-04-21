<template>
    <div id="mobileRule">
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
                            <button type="button" class='mobileRule-button' @click="fetchData(inputVal)"><span>搜&nbsp;&nbsp;索</span></button>
                            <button type="button" class='mobileRule-btn'  @click="openDialog('add')"><span>新增规则</span></button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div class="cutLine"></div>

            <!-- 展示数据 -->
            <el-table
                :data="mobileRuleList"
                v-loading>
                <el-table-column
                    prop="mobile_rule_id"
                    label="ID"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="mobile_rule_name"
                    label="移动端规则名"
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
                    prop="vul_platform"
                    label="平台"
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
                        size="mini"
                        class='fontColor' >查看
                      </el-button>
                      <el-button @click="openDialog('edit', scope.row)"
                        type="text"
                        size="mini"
                        class='fontColor'>编辑
                      </el-button>
                      <el-button class='fontColor' type="text" size="mini" v-show="scope.row.is_disable==1" @click="enableMobile(scope.row.mobile_rule_id)">启用</el-button>
                      <el-button class='fontColor' type="text" size="mini" v-show="scope.row.is_disable==0" @click="disableMobile(scope.row.mobile_rule_id)">禁用</el-button>
                      <el-button class='fontColor' @click="openDialog('vul', scope.row.mobile_rule_id);"
                                 type="text"
                                 size="mini">漏洞知识
                      </el-button>
                      <el-button class='fontColor' @click="openDialog('solution', scope.row.mobile_rule_id)"
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
        <!-- 查看修改移动端-->
        <el-dialog :title="action==2 ? '新建移动端规则':action==3?'查看移动端规则':'编辑移动端规则'" :visible.sync="dialogFormVisible" width="460px">
            <el-form :inline="true" label-width="100px" label-position="left">
              <!-- <el-col> -->
                <el-form-item  v-if="action==1" label="移动端规则 ID" >
                    <el-input class="inputWidth" v-model="mobileRule.mobile_rule_id" placeholder="请输入移动端规则ID" clearable :disabled="true"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="移动端规则名" >
                    <el-input class="inputWidth" v-model="mobileRule.mobile_rule_name" placeholder="请输入移动端规则名" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="英文规则名" >
                    <el-input class="inputWidth" v-model="mobileRule.mobile_rule_name_en" placeholder="请输入移动端规则名(英文)" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="漏洞类型" >
                    <vul-type class="inputWidth" v-model="mobileRule.vul_type2_id" :disabled="!editable"></vul-type>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="漏洞等级" >
                    <vul-level  class="inputWidth" v-model="mobileRule.vul_level_id"  :disabled="!editable"></vul-level>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="漏洞描述" >
                    <el-input class="inputWidth" v-model="mobileRule.vul_description" placeholder="请输入漏洞描述" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="漏洞危害" >
                    <el-input class="inputWidth" v-model="mobileRule.vul_harmfulness" placeholder="请输入漏洞危害" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="漏洞修复建议" >
                    <el-input class="inputWidth" v-model="mobileRule.vul_fix_suggestion" placeholder="请输入漏洞修复建议" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="cvss评分" >
                    <el-input class="inputWidth" v-model="mobileRule.vul_cvss" placeholder="请输入cvss评分" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="CWE ID" >
                    <el-input class="inputWidth" v-model="mobileRule.vul_cwe" placeholder="请输入CWE ID" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="平台" >
                    <mobile-platform class="inputWidth" v-model="mobileRule.vul_platform" :disabled="!editable"></mobile-platform>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item v-if="action!=2" label="创建时间" >
                    <el-input class="inputWidth" v-model="mobileRule.create_time" placeholder="" clearable :disabled="true"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item v-if="action!=2" label="更新时间" >
                    <el-input class="inputWidth" v-model="mobileRule.update_time" placeholder="" clearable :disabled="true"></el-input>
                </el-form-item>
              <!-- </el-col> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="mobileEvalu-button" @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="action==1" class="mobileEvalu-btn" type="warning" round @click="updateMobile(mobileRule)">确定</el-button>
                <el-button v-if="action==2" class="mobileEvalu-btn" type="warning" round @click="createMobile(mobileRule)">创建</el-button>
            </div>
        </el-dialog>
      <!--
        2018/11/1 @huanqi
        绑定漏洞知识
      -->
      <el-dialog title="关联漏洞知识" :visible.sync="vulDialogFormVisible" width="1200px">
        <div class="flex">
          <el-input placeholder="请输入漏洞名称" v-model="vulQueryParam.keywords.vul_knowledge_name"
                    style="width: 40%;margin-bottom: 20px;">

          </el-input>
          <button slot="append" @click="searchVul" class="mobilePlugin-button dialog-btn">检&nbsp;索</button>
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
            <template slot-scope="scope">{{ scope.row.vul_type2_id }}</template>
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
          <el-button class="mobileEvalu-button" @click="vulDialogFormVisible=false">取消</el-button>
          <el-button class="mobileEvalu-btn dialog-button" type="warning" round @click="bindVul()">确定</el-button>
        </div>
      </el-dialog>
      <!-- 绑定安全方案 -->
      <el-dialog title="关联安全方案" :visible.sync="solutionDialogFormVisible" width="1200px">
        <div class="flex">
          <el-input placeholder="请输入安全方案名称" v-model="slnQueryParam.keywords.sln_knowledge_name"
                    style="width: 40%;margin-bottom: 20px;">
          </el-input>
          <button @click="searchSolution" class="mobilePlugin-button dialog-btn">检&nbsp;索</button>
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
          <el-button class="mobileEvalu-button" @click="solutionDialogFormVisible = false">取消</el-button>
          <el-button class="mobileEvalu-btn dialog-button" type="warning" round @click="bindSolution()">确定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { connect } from '@/lib'
import vulLevel from '../../dolphin/testBaseManagement/components/index'
import mobilePlatform from '../../dolphin/testBaseManagement/components/platform'
import vulType from '../../dolphin/testBaseManagement/components/vulType'

export default connect(() => {
  return {

      mobileRuleList: 'dolphin_mobile/mobileRule',
      num: 'dolphin_mobile/mobileRuleLength',
      vulKnowledgeList: 'dolphin_knowledgeBase/vulKnowledgeList',  // 属性 @huanqi 2018/10/31
      vulNum: 'dolphin_knowledgeBase/vulListLength',
      slnKnowledgeList: 'dolphin_knowledgeBase/slnKnowledgeList',
      slnNum: 'dolphin_knowledgeBase/slnKnowledgeListLength',
      VulAndSolutionIds: 'knowledge_relation/VulAndSolutionIds'
  }
}, {
  getMobileRule: 'dolphin_mobile/getMobileRule',
  createMobileRule: 'dolphin_mobile/createMobileRule',
  updateMobileRule: 'dolphin_mobile/updateMobileRule',
  disableMobileRule: 'dolphin_mobile/disableMobileRule',
  enableMobileRule: 'dolphin_mobile/enableMobileRule',
  getVulAndSolutionIdsByTestId: 'knowledge_relation/getVulAndSolutionIdsByTestId', // 方法 @huanqi 2018/10/31
  bindVulByTestId: 'knowledge_relation/bindVulByTestId',
  bindSolutionByTestId: 'knowledge_relation/bindSolutionByTestId',
  getVulKnowledgeData: 'dolphin_knowledgeBase/getVulKnowledgeList',
  getSlnKnowledge: 'dolphin_knowledgeBase/getSlnKnowledgeList',
  getPreInfo: 'dolphin_knowledgeBase/getPreInfo'
})({
    name: 'mobileRule',
    data() {
      return {
        editable: true,
        dialogFormVisible: false,
        newDialogFormVisible: false,
        deleteDialogVisible: false,
        vulDialogFormVisible: false,
        solutionDialogFormVisible: false,
        didi_test_id: 0,
        didi_test_type: 3,
        vulTypeList: [],
        vulMultipleSelection: [],
        slnMultipleSelection: [],
        action: 1,
        inputVal: '',
        mobileRule: {
            mobile_rule_id: 0,
            mobile_rule_name: '',
            mobile_rule_name_en: '',
            vul_type2_id: 0,
            vul_level_id: 0,
            vul_description: '',
            vul_harmfulness: '',
            vul_fix_suggestion: '',
            vul_cvss: 0,
            vul_cwe: 0,
            vul_platform: ''
        },
        queryParam: {
          page: 1,
          limit: 10,
          keywords: {mobile_rule_name: ''}
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
    components: { vulLevel, mobilePlatform, vulType },
    methods: {
        openDialog(action = 'look', text) {
            if (action === 'edit') {
                this.action = 1
                this.editable = true
                this.mobileRule = {
                  mobile_rule_id: text.mobile_rule_id,
                  mobile_rule_name: text.mobile_rule_name,
                  mobile_rule_name_en: text.mobile_rule_name_en,
                  vul_type2_id: text.vul_type2_id,
                  vul_level_id: text.vul_level_id,
                  vul_description: text.vul_description,
                  vul_harmfulness: text.vul_harmfulness,
                  vul_fix_suggestion: text.vul_fix_suggestion,
                  vul_cvss: text.vul_cvss,
                  vul_cwe: text.vul_cwe,
                  vul_platform: text.vul_platform
                }
                this.dialogFormVisible = true
                this.fetchData()
            } else if (action === 'add') {
                this.action = 2
                this.editable = true
                this.mobileRule = {
                  mobile_rule_id: 0,
                  mobile_rule_name: '',
                  mobile_rule_name_en: '',
                  vul_type2_id: [],
                  vul_level_id: 0,
                  vul_description: '',
                  vul_harmfulness: '',
                  vul_fix_suggestion: '',
                  vul_cvss: 0,
                  vul_cwe: 0,
                  vul_platform: ''
                }
                this.dialogFormVisible = true
                this.newDialogFormVisible = true
            } else if (action === 'vul') {

              /**
               * 增加漏洞知识和方案对话框。 @huanqi
               * 2018/10/31
               */
              this.didi_test_id = text
              this.vulDialogFormVisible = true
              let postParam = {
                didi_test_id: this.didi_test_id,
                didi_test_type: this.didi_test_type
              }
              this.getVulAndSolutionIdsByTestId(postParam)
              this.searchVul()
            } else if (action === 'solution') {
              this.didi_test_id = text
              this.solutionDialogFormVisible = true
              let postParam = {
                didi_test_id: this.didi_test_id,
                didi_test_type: this.didi_test_type
              }
              this.getVulAndSolutionIdsByTestId(postParam)
              this.searchSolution()

              /**
               *
               */
            } else {
                this.action = 3
                this.mobileRule = text
                this.editable = false
                this.dialogFormVisible = true
            }
        },
        fetchData(name) {
            this.queryParam.keywords.mobile_rule_name = name
            let queryParam = {queryParam: this.queryParam}
            this.getMobileRule(queryParam).then(res => {
              for (let i = 0; i < this.mobileRuleList.length; i++) {
                this.mobileRuleList[i].vul_type2_id = this.getVulType(this.mobileRuleList[i].vul_type2_id)
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
        updateMobile(params) {
            if (params.vul_cwe)params.vul_cwe = parseInt(params.vul_cwe)
            if (params.vul_type2_id)params.vul_type2_id = parseInt(params.vul_type2_id[1])
            if (params.vul_level_id)params.vul_level_id = parseInt(params.vul_level_id)
            if (params.vul_cvss)params.vul_cvss = parseFloat(params.vul_cvss)
            this.updateMobileRule(params)
            this.fetchData()
            this.dialogFormVisible = false
        },
        createMobile(params) {
            if (params.mobile_rule_id != null) delete params['mobile_rule_id']
            if (params.vul_cwe)params.vul_cwe = parseInt(params.vul_cwe)
            if (params.vul_type2_id)params.vul_type2_id = parseInt(params.vul_type2_id[1])
            if (params.vul_level_id)params.vul_level_id = parseInt(params.vul_level_id)
            if (params.vul_cvss)params.vul_cvss = parseFloat(params.vul_cvss)
            this.createMobileRule(params)
            this.fetchData()
            this.dialogFormVisible = false
        },
        enableMobile(id) {
            this.enableMobileRule(id).then(res => {})
            this.fetchData()
        },
        disableMobile(id) {
            this.disableMobileRule(id).then(res => {})
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
          didi_test_type: this.didi_test_type,
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
          didi_test_type: this.didi_test_type,
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

#mobileRule{
    width: 100%;
    // background: white;
    // margin-top: -15px;
    // padding: 5px;
    
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
  .mobileRule-btn{
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
  .mobileRule-button{
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
  .mobileRule-btn:hover{
      background-color: #fff3e8;
  }

  .mobilePlugin-button.dialog-btn {
    margin-left: 15px;
  }

  .mobileEvalu-button{
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    font-size: 13px;
  }
  .mobileEvalu-btn{
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
    // font-weight: 300;
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
