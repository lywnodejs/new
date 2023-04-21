<template>
  <div class="vulknowledge">
    <div class="el-main">
      <el-form class="searchForm" label-position="left" label-width="80px" :inline='true' close-on-click-modal='false'>
        <div class="displayFlex">
          <el-form-item label="漏洞名称:" prop="name">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入漏洞名称"
                      v-model="queryParam.keywords.vul_knowledge_name"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="漏洞等级:" style="margin-left:30px" prop="name">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入漏洞等级"
                      v-model="queryParam.keywords.vul_level_id"
                      auto-complete="off">
            </el-input>
          </el-form-item>
        </div>
        <el-row>
          <el-col :span='24'>
            <el-form-item align="center">
              <button type="button" class='vulknowledge-button' @click="fetchData()"><span>搜&nbsp;&nbsp;索</span>
              </button>
              <button type="button" class='vulknowledge-btn' @click="openDialog('add')"><span>新增漏洞知识</span></button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="cutLine"></div>

      <!-- 展示数据 -->
      <el-table
        :data="vulKnowledgeList"
        v-loading>
        <el-table-column
          prop="vul_knowledge_id"
          label="ID"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="vul_knowledge_name"
          label="漏洞知识名称"
          align="center">
        </el-table-column>
        <el-table-column
          label="漏洞等级"
          align="center"
          width="100">
          <template slot-scope="scope">{{pretreatVulLevel(scope.row.vul_level_id)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="vul_cvss"
          label="CVSS评分"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="vul_capec"
          label="capec ID"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="vul_cwe"
          label="CWE ID"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button @click="bounceUrl(scope.row.vul_knowledge_id)" type="text" size="mini">
              <span>查看</span>
              <!-- <router-link style="color:#FC9153" :to="{ path : '/sdl/dolphin/vulnerability/knowledgeDetail', query: {knowledgeId: scope.row.vul_knowledge_id}}" target=_blank>
              查看
              </router-link> -->
            </el-button>
            <el-button @click="openDialog('edit', scope.row)"
                       type="text"
                       size="mini">编辑
            </el-button>
            <el-button type="text" size="mini" v-show="scope.row.is_disable==1"
                       @click="enableVul(scope.row.vul_knowledge_id)">启用
            </el-button>
            <el-button type="text" size="mini" v-show="scope.row.is_disable==0"
                       @click="disableVul(scope.row.vul_knowledge_id)">禁用
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
    <!-- 漏洞知识弹框 -->
    <el-dialog :title="action==2 ? '新建漏洞知识':'编辑漏洞知识'" :visible.sync="dialogFormVisible" width="930px">
      <el-form :inline="true" label-width="100px" label-position="left">
        <!-- <el-col> -->
          <el-form-item class="formItem" v-if="action==1" label="ID">
            <el-input class="input" v-model="vulKnowledge.vul_knowledge_id" placeholder="请输入Id" clearable
                      :disabled="true"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item class="formItem" label="漏洞知识名称">
            <el-input class="input" v-model="vulKnowledge.vul_knowledge_name" placeholder="请输入漏洞知识名称" clearable
                      :disabled="!editable"></el-input>
          </el-form-item>
          <el-form-item class="formItem" label="漏洞类型">
            <el-cascader
              :disabled="!editable"
              class="input"
              v-model="vulKnowledge.vul_type"
              :options="vul_type"
              placeholder="请选择漏洞类型"
              clearable
              filterable>
            </el-cascader>
            <!-- <el-input  class="input" v-model="vulKnowledge.vul_type_id" placeholder="请输入漏洞类型ID" clearable :disabled="!editable"></el-input> -->
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item class="formItem" label="漏洞等级">
            <vul-level class="input" v-model="vulKnowledge.vul_level_id" :disabled="!editable"></vul-level>
          </el-form-item>
          <el-form-item class="formItem" label="CVSS评分">
            <el-input class="input" v-model="vulKnowledge.vul_cvss" placeholder="请输入CVSS评分" clearable
                      :disabled="!editable"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item class="formItem" label="CAPEC ID">
            <el-input class="input" v-model="vulKnowledge.vul_capec" placeholder="请输入CAPEC ID" clearable
                      :disabled="!editable"></el-input>
          </el-form-item>
          <el-form-item class="formItem" label="CWE ID">
            <el-input class="input" v-model="vulKnowledge.vul_cwe" placeholder="请输入CWE ID" clearable
                      :disabled="!editable"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item class="formItem" label="编程语言">
            <vul-language class="input" v-model="vulKnowledge.vul_language" :disabled="!editable"></vul-language>
          </el-form-item>
          <el-form-item class="formItem" label="平台">
            <vul-platform class="input" v-model="vulKnowledge.vul_platform" :disabled="!editable"></vul-platform>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item class="formItem" v-if="action!=2" label="创建时间">
            <el-input class="input" v-model="vulKnowledge.create_time" placeholder="" clearable
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item class="formItem" v-if="action!=2" label="更新时间">
            <el-input class="input" v-model="vulKnowledge.update_time" placeholder="" clearable
                      :disabled="true"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="漏洞描述">
            <div class="mavonWidth">
              <mavon-editor ref=md @imgAdd="$imgAdd" @change='$htmlCode' :ishljs="false" :subfield='false' class='mavon'
                            v-model="vulKnowledge.vul_description"/>
            </div>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="漏洞危害">
            <div class="mavonWidth">
              <mavon-editor @imgAdd="$imgAdd" :ishljs="false" :subfield='false' class='mavon'
                            v-model="vulKnowledge.vul_harmfulness"/>
            </div>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="漏洞修复建议">
            <div class="mavonWidth">
              <mavon-editor @imgAdd="$imgAdd" :ishljs="true" :subfield='false' class='mavon'
                            v-model="vulKnowledge.vul_fix_suggestion"/>
            </div>
          </el-form-item>
        <!-- </el-col> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="vulEvalu-button" @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="action==1" class="vulEvalu-btn" type="warning" round @click="updateVul(vulKnowledge)">确定
        </el-button>
        <el-button v-if="action==2" class="vulEvalu-btn" type="warning" round @click="createVul(vulKnowledge)">创建
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import {mavonEditor} from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import vulLevel from '../knowledgeBaseManagement/components/index'
  import vulLanguage from '../knowledgeBaseManagement/components/language'
  import vulPlatform from '../knowledgeBaseManagement/components/platform'
  import ajax from '@/plugin/ajax'

  export default connect(() => {
    return {

      vulKnowledgeList: 'dolphin_knowledgeBase/vulKnowledgeList',
      num: 'dolphin_knowledgeBase/vulListLength'
    }
  }, {
    getVulKnowledgeList: 'dolphin_knowledgeBase/getVulKnowledgeList',
    createVulKnowledge: 'dolphin_knowledgeBase/createVulKnowledge',
    updateVulKnowledge: 'dolphin_knowledgeBase/updateVulKnowledge',
    disableVulKnowledge: 'dolphin_knowledgeBase/disableVulKnowledge',
    enableVulKnowledge: 'dolphin_knowledgeBase/enableVulKnowledge',
    getPreInfo: 'dolphin_knowledgeBase/getPreInfo',
    uploadPic: 'dolphin_knowledgeBase/uploadPic'
  })({
    name: 'VulKnowledge',
    data() {
      return {
        editable: true,
        dialogFormVisible: false,
        newDialogFormVisible: false,
        action: 1,
        vul_level: '',
        vul_from: [],
        vul_type: [],
        fileList: [],
        vulKnowledge: {
          vul_knowledge_id: 1,
          vul_knowledge_name: '',
          vul_type: [],
          vul_type_id: 0,
          vul_level_id: 0,
          vul_description: '',
          vul_harmfulness: '',
          vul_fix_suggestion: '',
          vul_cvss: 0,
          vul_capec: 0,
          vul_cwe: 0,
          vul_language: '',
          vul_platform: ''
        },
        queryParam: {
          page: 1,
          limit: 10,
          keywords: {
            vul_level_id: '',
            vul_knowledge_name: ''
          }
        }
      }
    },
    components: {
      mavonEditor, vulLevel, vulLanguage, vulPlatform
    },
    created() {
      this.fetchData()
      this.getPreInfoList()
    },
    methods: {
      openDialog(action = 'look', text) {
        if (action === 'edit') {
          this.action = 1
          this.editable = true
          this.vulKnowledge = text
          this.vulKnowledge.vul_type = [this.getPreInfoId(text.vul_type_id), text.vul_type_id]
          this.dialogFormVisible = true
        } else if (action === 'add') {
          this.vulKnowledge = {
            vul_knowledge_name: '',
            vul_type: [],
            vul_type_id: 0,
            vul_level_id: 0,
            vul_description: '',
            vul_harmfulness: '',
            vul_fix_suggestion: '',
            vul_cvss: 0,
            vul_capec: 0,
            vul_cwe: 0,
            vul_language: '',
            vul_platform: ''
          }
          if (this.vulKnowledge.vul_knowledge_id) delete this.vulKnowledge.vul_knowledge_id
          this.action = 2
          this.editable = true
          this.dialogFormVisible = true
          this.newDialogFormVisible = true
        } else {
          this.vulKnowledge = text
          this.editable = false
          this.dialogFormVisible = true
        }
      },
      fetchData() {
        if (this.queryParam.keywords.vul_level_id == '') delete this.queryParam.keywords.vul_level_id
        else parseInt(this.queryParam.keywords.vul_level_id)
        let queryParam = {queryParam: this.queryParam}
        this.getVulKnowledgeList(queryParam).then(res => {
        })
      },
      $htmlCode(bol, str) {
      },
      $imgAdd(pos, $file) {
        let formdata = new FormData();
        formdata.append('image', $file);
        console.log(formdata)
        console.log('******************')
        console.log($file)
        ajax({
          url: '/api/common/file/upload',
          method: 'post',
          data: formdata,
          headers: {'Content-Type': 'multipart/form-data'},
          dataType: 'json'
        }).then((url) => {
          alert(url)

          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          /**
           * $vm 指为mavonEditor实例，可以通过如下两种方式获取
           * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
           * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
           */
          this.$refs.md.$img2Url(pos, url);
        })
      },
      updateVul(params) {

        if (params.vul_type) {
          params.vul_type_id = params.vul_type[params.vul_type.length - 1]
        }
        this.updateVulKnowledge(params).then(res => {
          this.fetchData()
        })
        this.dialogFormVisible = false
      },
      createVul(params) {
        if (params.vul_type) {
          params.vul_type_id = params.vul_type[params.vul_type.length - 1]
          delete params.vul_type
        }
        if (params.vul_knowledge_id) delete params['vul_knowledge_id']
        if (params.vul_cwe) params.vul_cwe = parseInt(params.vul_cwe)
        if (params.vul_level_id) params.vul_level_id = parseInt(params.vul_level_id)
        if (params.vul_capec) params.vul_capec = parseInt(params.vul_capec)
        if (params.vul_cvss) params.vul_cvss = parseFloat(params.vul_cvss)
        this.createVulKnowledge(params).then(res => {
          this.fetchData()
        })
        this.dialogFormVisible = false
      },
      getPreInfoList() {
        this.getPreInfo().then(response => {
          const data = response
          this.vul_level = data.vul_level
          this.vul_from = data.vul_from
          this.vul_type = data.vul_type
        })
      },
      enableVul(id) {
        this.enableVulKnowledge(id).then(res => {
        })
        this.fetchData()
      },
      disableVul(id) {
        this.disableVulKnowledge(id).then(res => {
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
      getPreInfoId(myId) {
        for (let i = 0; i < this.vul_type.length; i++) {
          let id = this.vul_type[i].value
          for (let j = 0; j < this.vul_type[i].children.length; j++) {
            if (this.vul_type[i].children[j].value == myId) {
              return id
            }
          }
        }
      },
      bounceUrl(url) {
        let urll = '/sdl/dolphin/vulnerability/knowledgeDetail?knowledgeId=' + url
        window.open(urll)
      }
    }
  })
</script>
<style lang="less" scoped>
  .vulknowledge-btn {
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

  .vulknowledge-btn:hover {
    background-color: #fff3e8;
  }

  .vulknowledge-button {
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

  .cutLine {
  // border: 1px solid
    margin-top: 5px;
    margin-bottom: 17px;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.10);
    // background: rgba(0, 0, 0, 0.10);
    // border-radius: 4px;
  }

  .vulEvalu-button {
    width: 90px;
    padding: 0px;
    font-size: 13px;
    height: 32px;
    // font-weight: 100;
  }

  .vulEvalu-btn {
    background: #FC9153;
    border-radius: 4px;
    height: 32px;
    font-size: 13px;
    width: 90px;
    padding: 0px;
    border: none;
    // font-weight: 100;
    margin-right: 12px;
  }

  .mavonWidth {
    margin-top: 5px;
    width: 770px;
    // width: 100%;
    .mavon {
      word-wrap: break-word;
    }
  }

  .formItem {
    margin-right: 30px;
    .input {
      width: 310px;
    }
  }

  .vulknowledge {
    width: 100%;
    // margin-top: -15px;
    .el-main {
      width: 100%;
      box-sizing: border-box;
      background: white;
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
</style>
