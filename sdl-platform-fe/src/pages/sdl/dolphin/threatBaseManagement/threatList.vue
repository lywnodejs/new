<template>
  <div class="threat">
    <div class="el-main">
      <el-form class="searchForm" label-position="left" label-width="80px"  :inline='true'>
        <div class="displayFlex">
          <el-form-item label="威胁名称:" prop="name">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入威胁名称"
                      v-model="queryParam.keywords.threat_name"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="攻击面:" style="margin-left:30px" prop="name">
            <app-surface class="searchInput" v-model="queryParam.keywords.attack_surface"></app-surface>
            <!-- <el-input class="searchInput"
            clearable
            placeholder="请输入攻击面"
            v-model="queryParam.keywords.attack_surface"
            auto-complete="off">
            </el-input> -->
          </el-form-item>
          <el-form-item label="威胁等级:" style="margin-left:30px" prop="name">
            <threat-level class="searchInput" v-model="queryParam.keywords.threat_level"></threat-level>
          </el-form-item>
        </div>
        <el-row>
          <el-col :span='24'>
            <el-form-item align="center">
              <button type="button" class='threat-button' @click="fetchData()"><span>搜&nbsp;&nbsp;索</span></button>
              <button type="button" class='threat-btn' @click="openDialog('add')"><span>新增威胁</span></button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="cutLine"></div>

      <el-table
        ref="threatTable"
        :data="threatList"
        v-loading>
        <el-table-column
          prop="didi_threat_id"
          label="威胁ID"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          property="threat_name"
          label="威胁名称"
          width="300"
          align="center">
        </el-table-column>
        <!-- <el-table-column
            prop="attack_surface"
            label="攻击面"
            align="center">
        </el-table-column> -->
        <el-table-column
          property="strideCN"
          label="STRIDE"
          align="center"
        >
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
            <el-button type="text" size="mini" v-show="scope.row.is_disable==1"
                       @click="enableThreat(scope.row.didi_threat_id)">启用
            </el-button>
            <el-button type="text" size="mini" v-show="scope.row.is_disable==0"
                       @click="disableThreat(scope.row.didi_threat_id)">禁用
            </el-button>
            <el-button @click="openDialog('vul', scope.row.didi_threat_id);"
                       type="text"
                       size="mini">漏洞知识
            </el-button>
            <el-button @click="openDialog('solution', scope.row.didi_threat_id)"
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
    <el-dialog :title="action==2 ? '新建威胁':action==3? '查看威胁':'编辑威胁'" :visible.sync="dialogFormVisible" width="460px">
      <el-form :inline="true" label-width="100px" label-position="left">
        <!-- <el-col> -->
          <el-form-item v-if="action==1" label="威胁ID">
            <el-input class="inputThreat" v-model="threat.didi_threat_id" placeholder="请输入威胁Id" clearable
                      :disabled="true"></el-input>
          </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col> -->
          <el-form-item label="威胁名称">
            <el-input class="inputThreat" v-model="threat.threat_name" placeholder="请输入威胁名称" clearable
                      :disabled="!editable"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="威胁等级">
            <threat-level class="inputThreat" v-model="threat.threat_level" :disabled="!editable"></threat-level>
            <!-- <el-input class="inputThreat" v-model="threat.threat_level" placeholder="请输入威胁等级" clearable :disabled="!editable"></el-input> -->
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="威胁描述">
            <el-input class="inputThreat" v-model="threat.threat_description" placeholder="请输入威胁描述" clearable
                      :disabled="!editable"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="攻击面">
            <!-- <el-input class="inputThreat" v-model="threat.attack_surface" placeholder="请输入攻击面" clearable :disabled="!editable"></el-input> -->
            <app-surface class="inputThreat" v-model="threat.attack_surface" multiple
                         :disabled="!editable"></app-surface>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="STRIDE">
            <!-- <el-input class="inputThreat" v-model="threat.stride" placeholder="请输入STRIDE" clearable :disabled="!editable"></el-input> -->
            <app-stride class="inputThreat" v-model="threat.stride" multiple :disabled="!editable"></app-stride>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="缓解机制">
            <el-input class="inputThreat" v-model="threat.mitigation" placeholder="请输入缓解机制或安全要求" clearable
                      :disabled="!editable"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="CAPEC ID">
            <el-input class="inputThreat" v-model="threat.capec_id" placeholder="请输入capec_id" clearable
                      :disabled="!editable"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="CWE ID">
            <el-input class="inputThreat" v-model="threat.cwe_id" placeholder="请输入cwe_id" clearable
                      :disabled="!editable"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item v-if="action!=2" label="创建时间">
            <el-input class="inputThreat" v-model="threat.create_time" placeholder="" clearable
                      :disabled="true"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item v-if="action!=2" label="更新时间">
            <el-input class="inputThreat" v-model="threat.update_time" placeholder="" clearable
                      :disabled="true"></el-input>
          </el-form-item>
        <!-- </el-col> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="threatEvalu-button" @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="action==1" class="threatEvalu-btn" type="warning" round @click="updateThreat(threat)">确定
        </el-button>
        <el-button v-if="action==2" class="threatEvalu-btn" type="warning" round @click="createThreat(threat)">创建
        </el-button>
      </div>
    </el-dialog>
    <!-- 绑定漏洞知识 -->
    <el-dialog title="关联漏洞知识" :visible.sync="vulDialogFormVisible" width="1200px">
      <div class="flex">
        <el-input placeholder="请输入漏洞名称" v-model="vulQueryParam.keywords.vul_knowledge_name"
                  style="width: 40%;margin-bottom: 20px;">

        </el-input>
        <button slot="append" @click="searchVul" class="threat-button dialog-btn">检&nbsp;索</button>
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
        <el-button class="threatEvalu-button" @click="vulDialogFormVisible=false">取消</el-button>
        <el-button class="threatEvalu-btn dialog-button" type="warning" round @click="bindVul()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 绑定安全方案 -->
    <el-dialog title="关联安全方案" :visible.sync="solutionDialogFormVisible" width="1200px">
      <div class="flex">
        <el-input placeholder="请输入安全方案名称" v-model="slnQueryParam.keywords.sln_knowledge_name"
                  style="width: 40%;margin-bottom: 10px;">
        </el-input>
        <button @click="searchSolution" class="threat-button dialog-btn">检&nbsp;索</button>
      </div>
      <el-table
        ref="slnTable"
        :data="slnKnowledgeList"
        border
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
        <el-button class="threatEvalu-button" @click="solutionDialogFormVisible = false">取消</el-button>
        <el-button class="threatEvalu-btn dialog-button" type="warning" round @click="bindSolution()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import appStride from '../threatBaseManagement/components/stride'
  import threatLevel from '../threatBaseManagement/components/threatLevel'
  import appSurface from '../threatBaseManagement/components/index'

  export default connect(() => {
    return {
      threatList: 'dolphin_threat/threatList',
      num: 'dolphin_threat/threatListLength',
      vulKnowledgeList: 'dolphin_knowledgeBase/vulKnowledgeList',
      vulNum: 'dolphin_knowledgeBase/vulListLength',
      slnKnowledgeList: 'dolphin_knowledgeBase/slnKnowledgeList',
      slnNum: 'dolphin_knowledgeBase/slnKnowledgeListLength',
      VulAndSolutionIds: 'knowledge_relation/VulAndSolutionIds'
    }
  }, {
    getThreatList: 'dolphin_threat/getThreatList',
    updateThreatList: 'dolphin_threat/updateThreatList',
    createThreatList: 'dolphin_threat/createThreatList',
    disableThreatList: 'dolphin_threat/disableThreatList',
    enableThreatList: 'dolphin_threat/enableThreatList',
    getVulKnowledgeData: 'dolphin_knowledgeBase/getVulKnowledgeList',
    getSlnKnowledge: 'dolphin_knowledgeBase/getSlnKnowledgeList',
    getVulAndSolutionIdsByThreatId: 'knowledge_relation/getVulAndSolutionIdsByThreatId',
    bindVulByThreatId: 'knowledge_relation/bindVulByThreatId',
    bindSolutionByThreatId: 'knowledge_relation/bindSolutionByThreatId'
  })({
    name: 'accack',
    data() {
      return {
        editable: true,
        dialogFormVisible: false,
        newDialogFormVisible: false,
        deleteDialogVisible: false,
        vulDialogFormVisible: false,
        solutionDialogFormVisible: false,
        didi_threat_id: 0,
        vulMultipleSelection: [],
        slnMultipleSelection: [],
        action: 1,
        threat: {
          capec_id: 0,
          threat_name: '',
          attack_surface: [],
          threat_description: '',
          threat_level: 1,
          stride: [],
          mitigation: '',
          cwe_id: 0
        },
        queryParam: {
          page: 1,
          limit: 10,
          keywords: {
            attack_surface: '',
            threat_name: '',
            threat_level: ''
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
        }
      }
    },
    components: {appSurface, appStride, threatLevel},
    created() {
      this.fetchData()
    },
    updated() {
      this.toggleSelection('vul')
      this.toggleSelection('sln')
    },
    methods: {
      openDialog(action = 'look', text) {
        if (action === 'edit') {
          let that = this
          this.action = 1
          this.editable = true
          this.threat = text
          if (typeof (that.threat.attack_surface) != 'object' && that.threat.attack_surface != '') this.threat.attack_surface = this.threat.attack_surface.split(',')
          if (typeof (that.threat.stride) != 'object' && that.threat.stride != '') this.threat.stride = this.threat.stride.split(',')
          if (that.threat.stride.length == ['']) that.threat.stride = []
          if (that.threat.attack_surface.length != 0) {
            for (let i = 0; i < that.threat.attack_surface.length; i++) {
              that.threat.attack_surface[i] = parseInt(that.threat.attack_surface[i])
            }
          } else that.threat.attack_surface = []
          this.dialogFormVisible = true
          this.fetchData()
        } else if (action === 'add') {
          this.action = 2
          this.threat.threat_name = ''
          this.threat.attack_surface = []
          this.threat.threat_description = ''
          this.threat.threat_level = 1
          this.threat.stride = []
          this.threat.mitigation = ''
          this.threat.cwe_id = 0
          this.threat.capec_id = 0
          this.editable = true
          this.dialogFormVisible = true
          this.newDialogFormVisible = true
          this.fetchData()
        } else if (action === 'vul') {
          this.didi_threat_id = text
          this.vulDialogFormVisible = true
          this.getVulAndSolutionIdsByThreatId(this.didi_threat_id)
          this.searchVul()
        } else if (action === 'solution') {
          this.didi_threat_id = text
          this.solutionDialogFormVisible = true
          this.getVulAndSolutionIdsByThreatId(this.didi_threat_id)
          this.searchSolution()
        } else {
          this.action = 3;
          let that = this
          this.threat = text
          if (typeof (that.threat.attack_surface) != 'object' && that.threat.attack_surface != '') this.threat.attack_surface = this.threat.attack_surface.split(',')
          if (typeof (that.threat.stride) != 'object' && that.threat.attack_surface != '') this.threat.stride = this.threat.stride.split(',')
          for (let i = 0; i < this.threat.attack_surface.length; i++) {
            this.threat.attack_surface[i] = parseInt(this.threat.attack_surface[i])
          }
          this.editable = false
          this.dialogFormVisible = true
          this.fetchData()
        }
      },
      fetchData() {
        if (!this.queryParam.keywords.threat_level) delete this.queryParam.keywords.threat_level
        else {
          this.queryParam.keywords.threat_level = parseInt(this.queryParam.keywords.threat_level)
        }
        this.queryParam.keywords.attack_surface = this.queryParam.keywords.attack_surface + ''
        let queryParam = {queryParam: this.queryParam}
        this.getThreatList(queryParam).then(res => {
          if (this.queryParam.keywords.attack_surface != '') {
            this.queryParam.keywords.attack_surface = parseInt(this.queryParam.keywords.attack_surface)
          }
        })
      },
      createThreat(params) {
        if (params.attack_surface) params.attack_surface = params.attack_surface.join(',')
        if (params.stride) params.stride = params.stride.join(',')
        if (params.capec_id != null) parseInt(params['capec_id'])
        if (params.create_time) delete params['create_time']
        if (params.update_time) delete params['update_time']
        if (params.cwe_id != null) params.cwe_id = parseInt(params.cwe_id)
        if (params.capec_id != null) params.capec_id = parseInt(params.capec_id)
        if (params.threat_level) params.threat_level = parseInt(params.threat_level)
        this.createThreatList(params)
        this.fetchData()
        this.dialogFormVisible = false
      },
      updateThreat(params) {
        params.attack_surface = params.attack_surface.join(',')
        params.stride = params.stride.join(',')
        this.updateThreatList(params)
        this.fetchData()
        this.dialogFormVisible = false
      },
      enableThreat(id) {
        this.enableThreatList(id).then(res => {
        })
        this.fetchData()
      },
      disableThreat(id) {
        this.disableThreatList(id).then(res => {
        })
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
          didi_threat_id: this.didi_threat_id,
          didi_threat_type: 1,
          vul_knowledge_ids: vulIdArray
        }
        this.bindVulByThreatId(postParam)
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
          didi_threat_id: this.didi_threat_id,
          didi_threat_type: 1,
          sln_knowledge_ids: slnIdArray
        }
        this.bindSolutionByThreatId(postParam)
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
      }
    }
  })
</script>
<style lang="less" scoped>
  .threat-btn {
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

  .threat-button {
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
  .threat-button.dialog-btn {
    margin-left: 20px;
  }

  .threat-btn:hover {
    background-color: #fff3e8;
  }

  .threatEvalu-button {
    width: 90px;
    font-size: 13px;
    height: 32px;
    padding: 0;

    // font-weight: 100;
  }

  .threatEvalu-btn {
    background: #FC9153;
    border-radius: 4px;
    height: 32px;
    font-size: 13px;
    width: 90px;
    padding: 0px;
    border: none;
    // font-weight: 100;
    // margin-right: 15px;
  }

  .threat {
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
    .threat {
      width: 100%;
      // margin-left: -5px;
      background: white;
      // margin-top: -15px;
      padding: 5px;
      .el-main {
        width: 100%;
        box-sizing: border-box;
        background: white;
        // margin-top: -15px;
        // padding: 20px;
        // margin-left: -5px;
        .displayFlex {
          display: flex;
        }
        .searchForm {
          .searchInput {
            width: 320px;
          }
        }
        .threat-btn {
          background: #FC9153;
          border-radius: 4px;
          width: 95px;
          height: 36px;
          border: none;
          color: white;
          margin-left: 100px;
          cursor: pointer;
          // font-weight: 100;
          line-height: 33px;
          span {
            font-family: Avenir, Helvetica, Arial, sans-serif;
            // font-weight: 100;
          }
        }
      }
    }
  }

  .inputThreat {
    width: 320px;
  }

  .el-button--text {
    // font-weight: 400;
  }

  .dialog-button {
    margin-right: 0px;
  }

  .dialog-btn {
    margin-left: 5px;
  }
</style>
