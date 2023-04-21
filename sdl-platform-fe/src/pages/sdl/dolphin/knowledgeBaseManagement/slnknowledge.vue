<template>
  <!-- 安全方案 -->
  <div class="slnknowledge">
    <div class="el-main">
      <el-form class="searchForm" label-position="left" :inline='true'>
        <div class="displayFlex">
          <el-form-item label="方案名称:" label-width="80px" prop="name">
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
              <button type="button" class='slnknowledge-button' @click="fetchData(inputVal)"><span>搜&nbsp;&nbsp;索</span>
              </button>
              <button type="button" class='slnknowledge-btn' @click="openDialog('add')"><span>新增安全方案</span></button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="cutLine"></div>

      <!-- 展示数据 -->
      <el-table
        :data="slnKnowledgeList"
        v-loading>
        <el-table-column
          prop="sln_knowledge_id"
          label="ID"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="sln_knowledge_name"
          label="安全方案名称"
          align="center">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button @click="bounceUrl(scope.row.sln_knowledge_id)" type="text" size="mini">
              <router-link style="color:#FC9153"
                           :to="{ path : '/sdl/dolphin/solution/solutionDetail', query: {solutionId: scope.row.sln_knowledge_id}}"
                           target=_blank>
                查看
              </router-link>
            </el-button>
            <el-button @click="openDialog('edit', scope.row)"
                       type="text"
                       size="mini">编辑
            </el-button>
            <el-button type="text" size="mini" v-show="scope.row.is_disable==1"
                       @click="enableSln(scope.row.sln_knowledge_id)">启用
            </el-button>
            <el-button type="text" size="mini" v-show="scope.row.is_disable==0"
                       @click="disableSln(scope.row.sln_knowledge_id)">禁用
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
    <el-dialog :title="action==2 ? '新建安全方案':'编辑安全方案'" :visible.sync="dialogFormVisible" width="974px">
      <el-form :inline="true" label-width="100px" label-position="left">
        <!-- <el-col> -->
          <el-form-item v-if="action==1" label="ID">
            <el-input class="input" v-model="slnKnowledge.sln_knowledge_id" placeholder="请输入Id" clearable
                      :disabled="true"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="解决方案名称">
            <el-input class="input" v-model="slnKnowledge.sln_knowledge_name" placeholder="请输入解决方案名称" clearable
                      :disabled="!editable"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item v-if="action!=2" label="创建时间">
            <el-input class="input" v-model="slnKnowledge.create_time" placeholder="" clearable
                      :disabled="true"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item v-if="action!=2" label="更新时间">
            <el-input class="input" v-model="slnKnowledge.update_time" placeholder="" clearable
                      :disabled="true"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="背景">
            <div class="mavonWidth">
              <mavon-editor :subfield='false' :ishljs="true" class='mavon' v-model="slnKnowledge.sln_background"/>
            </div>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="方案详情">
            <div class="mavonWidth">
              <mavon-editor :subfield='false' :ishljs="true" class='mavon' v-model="slnKnowledge.sln_detail"/>
            </div>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="方案选型">
            <div class="mavonWidth">
              <mavon-editor :ishljs="true" :fullScreen='true' :subfield='false' class='mavon'
                            v-model="slnKnowledge.sln_selection"/>
            </div>

          </el-form-item>
        <!-- </el-col> -->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="slnEvalu-button" @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="action==1" class="slnEvalu-btn" type="warning" round @click="updateSln(slnKnowledge)">确定
        </el-button>
        <el-button v-if="action==2" class="slnEvalu-btn" type="warning" round @click="createSln(slnKnowledge)">创建
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import {mavonEditor} from 'mavon-editor'  //  来自https://github.com/hinesboy/mavonEditor
  import 'mavon-editor/dist/css/index.css'

  export default connect(() => {
    return {

      slnKnowledgeList: 'dolphin_knowledgeBase/slnKnowledgeList',
      num: 'dolphin_knowledgeBase/slnKnowledgeListLength'
    }
  }, {
    getSlnKnowledgeList: 'dolphin_knowledgeBase/getSlnKnowledgeList',
    createSlnKnowledge: 'dolphin_knowledgeBase/createSlnKnowledge',
    updateSlnKnowledge: 'dolphin_knowledgeBase/updateSlnKnowledge',
    disableSlnKnowledge: 'dolphin_knowledgeBase/disableSlnKnowledge',
    enableSlnKnowledge: 'dolphin_knowledgeBase/enableSlnKnowledge',
    uploadPic: 'dolphin_knowledgeBase/uploadPic'
  })({
    name: 'SlnKnowledge',
    data() {
      return {
        value: '',
        editable: true,
        dialogFormVisible: false,
        action: 1,
        inputVal: '',
        slnKnowledge: {
          sln_knowledge_id: 1,
          sln_knowledge_name: '',
          sln_background: '',
          sln_detail: '',
          sln_selection: ''
        },
        queryParam: {
          page: 1,
          limit: 10,
          keywords: {sln_knowledge_name: ''}
        }
      }
    },
    components: {
      mavonEditor
    },
    created() {
      this.fetchData()
    },
    methods: {
      openDialog(action = 'look', text) {
        if (action === 'edit') {
          this.action = 1
          this.editable = true
          this.slnKnowledge = text
          this.dialogFormVisible = true
        } else if (action === 'add') {
          this.action = 2
          if (this.slnKnowledge.sln_knowledge_id) delete this.slnKnowledge.sln_knowledge_id
          this.editable = true
          this.dialogFormVisible = true
        } else {
          this.slnKnowledge = text
          this.editable = false
          this.dialogFormVisible = true
        }
      },
      fetchData(name) {
        this.queryParam.keywords.sln_knowledge_name = name
        let queryParam = {queryParam: this.queryParam}
        this.getSlnKnowledgeList(queryParam).then(res => {
        })
      },
      updateSln(params) {
        this.updateSlnKnowledge(params)
        this.fetchData()
        this.dialogFormVisible = false
      },
      createSln(params) {
        if (params.sln_knowledge_id) delete params['sln_knowledge_id']
        this.createSlnKnowledge(params)
        this.fetchData()
        this.dialogFormVisible = false
      },
      enableSln(id) {
        this.enableSlnKnowledge(id).then(res => {
        })
        this.fetchData()
      },
      disableSln(id) {
        this.disableSlnKnowledge(id).then(res => {
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
      bounceUrl(url) {
        let urll = '/sdl/dolphin/solution/solutionDetail?solutionId=' + url
        window.open(urll)
      }
    }
  })
</script>
<style lang="less" scoped>
  .slnknowledge-btn {
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

  .slnknowledge-btn:hover {
    background-color: #fff3e8;
  }

  .slnknowledge-button {
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
  .slnEvalu-button {
    width: 90px;
    padding: 0px;
    font-size: 13px;
    height: 32px;
    // font-weight: 100;
  }
  .slnEvalu-btn {
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
    .mavon {
      word-wrap: break-word;
    }
  }
  .input {
    width: 310px;
    margin-right: 30px;
  }
  .slnknowledge {
    width: 100%;
    // background: white;
    // margin-top: -15px;
    // padding: 5px;
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
  .cutLine {
  // border: 1px solid
    margin-top: 5px;
    margin-bottom: 17px;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.10);
    // background: rgba(0, 0, 0, 0.10);
    // border-radius: 4px;
  }
  .el-button--text {
    // font-weight: 400;
  }
</style>
