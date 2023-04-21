<template>
    <div id="blackPlugin">
        <div class="el-main">
            <el-form class="searchForm" label-position="left"  :inline='true'>
                <div class="displayFlex">
                    <el-form-item label="插件名称:" label-width="80px" prop="name">
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
                            <button type="button" class='blackPlugin-button' @click="fetchData(inputVal)"><span>搜&nbsp;&nbsp;索</span></button>
                            <button type="button" class='blackPlugin-btn'  @click="openDialog('add')"><span>新增黑盒插件</span></button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div class="cutLine"></div>

            <!-- 展示数据 -->
            <el-table
                :data="blackPluginList"
                v-loading>
                <el-table-column
                    prop="black_plugin_id"
                    label="ID"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="black_plugin_name"
                    label="插件名称"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="black_plugin_octopus_mark"
                    label="扫描器标识"
                    width="150"
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
                      <el-button type="text" size="mini" v-show="scope.row.is_disable==1" @click="enableBlack(scope.row.black_plugin_id)">启用</el-button>
                      <el-button type="text" size="mini" v-show="scope.row.is_disable==0" @click="disableBlack(scope.row.black_plugin_id)">禁用</el-button>
                      <el-button @click="openDialog('vul', scope.row.black_plugin_id);"
                                 type="text"
                                 size="mini">漏洞知识
                      </el-button>
                      <el-button @click="openDialog('solution', scope.row.black_plugin_id)"
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
        <!-- 黑盒信息-->
        <el-dialog :title="action==2 ? '新建黑盒插件':action==3?'查看黑盒插件':'编辑黑盒插件'" :visible.sync="dialogFormVisible" width="460px">
            <el-form ref="blackPlugin" :model="blackPlugin" :inline="true" :rules='rules' label-width="100px" label-position="left">
              <!-- <el-col> -->
                <el-form-item v-if="action==1" label="黑盒插件 ID">
                    <el-input  class="inputWidth" v-model="blackPlugin.black_plugin_id" placeholder="请输入黑盒插件ID" clearable :disabled="true"></el-input>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="黑盒插件名称" prop="black_plugin_name">
                    <el-input class="inputWidth" v-model="blackPlugin.black_plugin_name" placeholder="请输入黑盒插件名称" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="扫描器标识"  prop="black_plugin_octopus_mark">
                    <el-input class="inputWidth" v-model="blackPlugin.black_plugin_octopus_mark" placeholder="请输入扫描器标识" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="漏洞类型" prop="vul_type_id">
                    <vul-type class="inputWidth" v-model="blackPlugin.vul_type_id"  :disabled="!editable"></vul-type>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="漏洞等级" prop="vul_level_id">
                    <vul-level  class="inputWidth" v-model="blackPlugin.vul_level_id"  :disabled="!editable"></vul-level>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="漏洞描述" >
                    <el-input class="inputWidth" v-model="blackPlugin.vul_description" placeholder="请输入漏洞描述" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="漏洞危害" >
                    <el-input class="inputWidth" v-model="blackPlugin.vul_harmfulness" placeholder="请输入漏洞危害" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="漏洞修复建议" >
                    <el-input class="inputWidth" v-model="blackPlugin.vul_fix_suggestion" placeholder="请输入漏洞修复建议" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item v-if="action!=2" label="创建时间" >
                    <el-input class="inputWidth" v-model="blackPlugin.create_time" placeholder="" clearable :disabled="true"></el-input>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item v-if="action!=2" label="更新时间" >
                    <el-input class="inputWidth" v-model="blackPlugin.update_time" placeholder="" clearable :disabled="true"></el-input>
                </el-form-item>
              <!-- </el-col> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="blackEvalu-button" @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="action==1" class="blackEvalu-btn" type="warning" round @click="updateBlack(blackPlugin)">确定</el-button>
                <el-button v-if="action==2" class="blackEvalu-btn" type="warning" round @click="createBlack(blackPlugin)">创建</el-button>
            </div>
        </el-dialog>
      <!--
        2018/10/31 @huanqi
        绑定漏洞知识
      -->
      <el-dialog title="关联漏洞知识" :visible.sync="vulDialogFormVisible" width="1200px">
        <div class="flex">
          <el-input placeholder="请输入漏洞名称" v-model="vulQueryParam.keywords.vul_knowledge_name"
                    style="width: 40%; margin-bottom: 20px;">

          </el-input>
          <button slot="append" @click="searchVul" class="blackPlugin-button dialog-btn">检&nbsp;索</button>
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
            width="200"
            show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.vul_description }}</template>
          </el-table-column>
          <el-table-column
            label="漏洞危害"
            width="200"
            show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.vul_harmfulness }}</template>
          </el-table-column>
          <el-table-column
            label="修复建议"
            width="200"
            show-overflow-tooltip="true">
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
          <el-button class="blackEvalu-button" @click="vulDialogFormVisible=false">取消</el-button>
          <el-button class="blackEvalu-btn dialog-button" type="warning" round @click="bindVul()">确定</el-button>
        </div>
      </el-dialog>
      <!-- 绑定安全方案 -->
      <el-dialog title="关联安全方案" :visible.sync="solutionDialogFormVisible" width="1200px">
        <div class="flex">
          <el-input placeholder="请输入安全方案名称" v-model="slnQueryParam.keywords.sln_knowledge_name"
                    style="width: 40%; margin-bottom: 20px;">
          </el-input>
          <button @click="searchSolution" class="blackPlugin-button dialog-btn">检&nbsp;索</button>
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
            width="300"
            show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.sln_background }}</template>
          </el-table-column>
          <el-table-column
            label="方案详情"
            width="300"
            show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.sln_detail }}</template>
          </el-table-column>
          <el-table-column
            label="方案选型"
            width="300"
            show-overflow-tooltip="true">
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
          <el-button class="blackEvalu-button" @click="solutionDialogFormVisible = false">取消</el-button>
          <el-button class="blackEvalu-btn dialog-button" type="warning" round @click="bindSolution()">确定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { connect } from '@/lib'
import vulLevel from '../testBaseManagement/components/index'
import vulType from '../testBaseManagement/components/vulType'

export default connect(() => {
  return {

      blackPluginList: 'dolphin_black/blackPlugin',
      num: 'dolphin_black/blackPluginLength',
      vulKnowledgeList: 'dolphin_knowledgeBase/vulKnowledgeList',  // 属性 @huanqi 2018/10/31
      vulNum: 'dolphin_knowledgeBase/vulListLength',
      slnKnowledgeList: 'dolphin_knowledgeBase/slnKnowledgeList',
      slnNum: 'dolphin_knowledgeBase/slnKnowledgeListLength',
      VulAndSolutionIds: 'knowledge_relation/VulAndSolutionIds'
  }
}, {
  getBlackPlugin: 'dolphin_black/getBlackPlugin',
  createBlackPlugin: 'dolphin_black/createBlackPlugin',
  updateBlackPlugin: 'dolphin_black/updateBlackPlugin',
  disableBlackPlugin: 'dolphin_black/disableBlackPlugin',
  enableBlackPlugin: 'dolphin_black/enableBlackPlugin',
  getVulAndSolutionIdsByTestId: 'knowledge_relation/getVulAndSolutionIdsByTestId', // 方法 @huanqi 2018/10/31
  bindVulByTestId: 'knowledge_relation/bindVulByTestId',
  bindSolutionByTestId: 'knowledge_relation/bindSolutionByTestId',
  getVulKnowledgeData: 'dolphin_knowledgeBase/getVulKnowledgeList',
  getSlnKnowledge: 'dolphin_knowledgeBase/getSlnKnowledgeList',
  getPreInfo: 'dolphin_knowledgeBase/getPreInfo'
})({
    name: 'blackPlugin',
    data() {
      return {
        editable: true,
        vulTypeList: [],
        dialogFormVisible: false,
        newDialogFormVisible: false,
        deleteDialogVisible: false,
        vulDialogFormVisible: false,
        solutionDialogFormVisible: false,
        didi_test_id: 0,
        vulMultipleSelection: [],
        slnMultipleSelection: [],
        action: 1,
        inputVal: '',
        blackPlugin: {
            black_plugin_id: 0,
            black_plugin_name: '',
            black_plugin_octopus_mark: '',
            vul_type_id: [],
            vul_level_id: 0,
            vul_description: '',
            vul_harmfulness: '',
            vul_fix_suggestion: ''
        },

        rules: {
          black_plugin_name: [{required: true, message: '请输入黑盒插件名称', trigger: 'blur'}],
          black_plugin_octopus_mark: [{required: true, message: '请输入扫描器标识', trigger: 'blur'}],
          vul_type_id: [{required: true, message: '请选择漏洞类型', trigger: 'blur'}],
          vul_level_id: [{required: true, message: '请选择漏洞等级', trigger: 'blur'}]
        },
        queryParam: {
          page: 1,
          limit: 10,
          keywords: {black_plugin_name: ''}
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
    components: { vulLevel, vulType },
    methods: {
        openDialog(action = 'look', text) {
          if (this.$refs.blackPlugin != undefined) {
            this.$refs.blackPlugin.clearValidate()
          }
            if (action === 'edit') {
              this.action = 1
              this.editable = true
              this.blackPlugin = {
                black_plugin_id: text.black_plugin_id,
                black_plugin_name: text.black_plugin_name,
                black_plugin_octopus_mark: text.black_plugin_octopus_mark,
                vul_type_id: [],
                vul_level_id: text.vul_level_id,
                vul_description: text.vul_description,
                vul_harmfulness: text.vul_harmfulness,
                vul_fix_suggestion: text.vul_fix_suggestion,
                create_time: text.create_time,
                update_time: text.update_time
              }
              if (text.vul_type_id) {
                this.blackPlugin.vul_type_id.splice(0, 1, text.vul_type_id[0])
                this.blackPlugin.vul_type_id.splice(1, 1, text.vul_type_id[1])
              } else {
                this.blackPlugin.vul_type_id.splice(0, 1, '')
                this.blackPlugin.vul_type_id.splice(1, 1, '')
              }
            this.dialogFormVisible = true
            } else if (action === 'add') {
                this.action = 2
                this.editable = true
                this.blackPlugin = {
                  black_plugin_id: 0,
                  black_plugin_name: '',
                  black_plugin_octopus_mark: '',
                  vul_type_id: [],
                  vul_level_id: '',
                  vul_description: '',
                  vul_harmfulness: '',
                  vul_fix_suggestion: ''
                }
                this.blackPlugin.vul_type_id.splice(0, 1, '')
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
                didi_test_type: 2
              }
              this.getVulAndSolutionIdsByTestId(postParam)
              this.searchVul()
            } else if (action === 'solution') {
              this.didi_test_id = text
              this.solutionDialogFormVisible = true
              console.log(this.didi_test_id)
              let postParam = {
                didi_test_id: this.didi_test_id,
                didi_test_type: 2
              }
              this.getVulAndSolutionIdsByTestId(postParam)
              this.searchSolution()

              /**
               *
               */
            } else {
                this.action = 3
                this.blackPlugin = {
                  black_plugin_id: text.black_plugin_id,
                  black_plugin_name: text.black_plugin_name,
                  black_plugin_octopus_mark: text.black_plugin_octopus_mark,
                  vul_type_id: [],
                  vul_level_id: text.vul_level_id,
                  vul_description: text.vul_description,
                  vul_harmfulness: text.vul_harmfulness,
                  vul_fix_suggestion: text.vul_fix_suggestion,
                  create_time: text.create_time,
                  update_time: text.update_time
                }

                // 给vul_type_id数组赋值
                if (text.vul_type_id) {
                  this.blackPlugin.vul_type_id.splice(0, 1, text.vul_type_id[0])
                  this.blackPlugin.vul_type_id.splice(1, 1, text.vul_type_id[1])
                } else {
                  this.blackPlugin.vul_type_id.splice(0, 1, '')
                  this.blackPlugin.vul_type_id.splice(1, 1, '')
                }
                this.editable = false
                this.fetchData()
                this.dialogFormVisible = true
            }
        },
        fetchData(name) {
            this.queryParam.keywords.black_plugin_name = name
            let queryParam = {queryParam: this.queryParam}
            this.getBlackPlugin(queryParam).then(res => {
              for (let i = 0; i < this.blackPluginList.length; i++) {
                this.blackPluginList[i].vul_type_id = this.getVulType(this.blackPluginList[i].vul_type_id)
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
        validate(project, rules) {
          for (let name in rules) {
            if (Object.prototype.hasOwnProperty.call(rules, name)) {
              if (project[name] != '') {
                this.confirm = true
              } else {
                this.confirm = false
                return alert('请填写' + name)
              }
            }
          }
        },
        updateBlack(params) {
            if (params.vul_type_id)params.vul_type_id = parseInt(params.vul_type_id[1])
            if (params.vul_type_id) {
              params.vul_type_id = parseInt(params.vul_type_id[1])
            } else {
              params.vul_type_id = ''
            }
            this.$refs.blackPlugin.validate((valid) => {
              console.log(valid)
              if (valid) {
                this.updateBlackPlugin(params)
                this.fetchData()
                this.dialogFormVisible = false
              } else {
                console.log('error submit!!');
                return false;
              }
            })
        },
        createBlack(params) {
            if (params.black_plugin_id != null) delete params['black_plugin_id']
            if (params.vul_type_id) {
              params.vul_type_id = parseInt(params.vul_type_id[1])
            } else {
              params.vul_type_id = ''
            }
            if (params.vul_level_id)params.vul_level_id = parseInt(params.vul_level_id)
            this.$refs.blackPlugin.validate((valid) => {
              console.log(valid)
              if (valid) {
                this.createBlackPlugin(params)
                this.fetchData()
                this.dialogFormVisible = false
              } else {
                console.log('error submit!!');
                return false;
              }
            })
        },
        enableBlack(id) {
            this.enableBlackPlugin(id).then(res => {})
            this.fetchData()
        },
        disableBlack(id) {
            this.disableBlackPlugin(id).then(res => {})
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
          if (this.vulKnowledge) {
            for (let i = 0; i < this.vulKnowledge.length; i++) {
              this.vulKnowledge[i].vul_level_id = this.pretreatVulLevel(this.vulKnowledge[i].vul_level_id)
            }
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
          didi_test_type: 2,
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
          didi_test_type: 2,
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
#blackPlugin{
    width: 100%;
    // margin-top: -15px;
  .blackPlugin-btn{
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
  .blackPlugin-button{
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
  .blackPlugin-btn:hover{
      background-color: #fff3e8;
  }

  .blackPlugin-button.dialog-btn {
    margin-left: 15px;
  }

  .blackEvalu-button{
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    font-size: 13px;
  }
  .blackEvalu-btn{
    background: #FC9153;
    border-radius: 4px;
    font-size: 13px;
    height: 32px;
    width: 80px;
    padding: 7px 15px;
    border: none;
  }
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
  .cutLine {
  // border: 1px solid
    margin-top: 5px;
    margin-bottom: 17px;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.10);
    // background: rgba(0, 0, 0, 0.10);
    // border-radius: 4px;
  }
  .is-disabled {
      .el-cascader__label span{
        color: #c0c4cc;
      }
  }
}

</style>
