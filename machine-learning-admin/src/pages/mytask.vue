<!--首页&策略列表页-->
<template>
  <el-container>
    <el-header style="padding: 0px">
      <app-header v-if="!showRobotHeader"></app-header>
      <robotHeader v-if="showRobotHeader" ></robotHeader>
    </el-header>
    <el-container>
      <div class="container">
        <el-row>
          <el-row type="flex" justify="space-around" style="padding-left: 30px;height: 60px;line-height: 60px;background-color: #FFFFFF;">
            <el-col align="left">
              <span style="font-size: 14px;position: relative;color: #7F8FA4">我的任务</span>
              <el-button v-if="showAddTaskBtn" size="mini" type="success" style="margin-left: 20px;font-size: 12px" @click="AddTask()">新建任务</el-button>
            </el-col>
          </el-row>
          <el-row style="margin: 30px">
            <!--对话任务的样式-->
            <el-table
              v-if="queryModel.taskType==='DIALOGUE'"
              :data="listData"
              stripe
              v-loading="showListLoading"
              style="width: 100%">
              <el-table-column type="index" :index="indexFilter" align="center" width="100" label="序号"></el-table-column>
              <el-table-column label="任务" prop="name" align="left">
                <template slot-scope="scope">
                  <el-row type="flex">
                    <el-button type="text" size="small" style="font-size: 14px" @click="goPage('/labelcategory?index=labelcategory',scope.row)">
                      {{scope.row.name}}
                    </el-button>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column width="250" label="语料生效">
                <template slot-scope="scope">
                  <el-row type="flex">
                    <el-button type="primary" size="mini" @click="corpusTest(scope.$index, scope.row)">语料生效</el-button>
                    <el-button type="success" size="mini" @click="corpusProduction(scope.$index, scope.row)">语料发布</el-button>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column width="150" label="任务id" prop="id"></el-table-column>
              <el-table-column width="150" label="类型" prop="taskType" :formatter="taskType"></el-table-column>
              <el-table-column width="300" label="描述" prop="taskDesc"></el-table-column>
              <el-table-column width="100" label="操作" resizeable="false">
                <template slot-scope="scope">
                  <el-row type="flex">
                    <el-button type="danger" size="mini" @click="deleteEvent(scope.$index, scope.row)">删除</el-button>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
            <!--标注任务的样式-->
            <el-table
              v-else
              :data="listData"
              stripe
              v-loading="showListLoading"
              style="width: 100%">
              <el-table-column type="index" :index="indexFilter" align="center" width="100" label="序号"></el-table-column>
              <el-table-column label="任务" prop="name" align="left">
                <template slot-scope="scope">
                  <el-row type="flex">
                    <el-button type="text" size="small" style="font-size: 14px" @click="goPage('/labelcategory?index=labelcategory',scope.row)">
                      {{scope.row.name}}
                    </el-button>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column width="200" label="任务id" prop="id"></el-table-column>
              <el-table-column width="200" label="类型" prop="taskType" :formatter="taskType"></el-table-column>
              <el-table-column width="400" label="描述" prop="taskDesc"></el-table-column>
              <el-table-column width="100" label="操作" resizeable="false">
                <template slot-scope="scope">
                  <el-row type="flex">
                    <el-button type="danger" size="mini" @click="deleteEvent(scope.$index, scope.row)">删除</el-button>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
            <el-col type="flex" justify="center" style="background-color: #FFF; padding: 20px 0">
              <el-pagination align="center"
                             :current-page.sync="queryModel.page"
                             :page-size="queryModel.size"
                             :total="totalCount"
                             class="pagination"
                             layout="total,prev, pager, next, jumper"
                             @current-change="pageChange"
              >
              </el-pagination>
            </el-col>
          </el-row>
        </el-row>

        <el-dialog  title="新建任务" :visible.sync="dialogVisible"  width="50%"  >
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="任务描述" prop="taskDesc">
              <el-input type="textarea" v-model="ruleForm.taskDesc"></el-input>
            </el-form-item>
        </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit('ruleForm')">立即创建</el-button>
          </span>
        </el-dialog>


      </div>
    </el-container>
  </el-container>
</template>
<script>
  import appHeader from '../components/AppHeader';
  import {informationService} from '../service/index';
  import {SetCookie,getJoinCookie} from '../utils/commonUtil';
  import {mapActions, mapState} from 'vuex';
  import robotHeader from '../components/robotConfig/RobotConfigHeader';

  export default {
    name: 'mytask',
    data() {
      return {
        ruleForm: {
          name: '',
          taskDesc: '',
          taskType: 'TAGGING',
          userId: 1
        },
        rules: {
          name: [
            {required: true, message: '任务名称', trigger: 'blur'}
          ]
        },
        listData: [],
        dialogVisible:false,
        showListLoading: false,
        queryModel: {
          orderBy:'createAt',
          taskType: 'TAGGING',
          userId:'',
          direction:'DESC',
          cp:'1',
          ps:'10',
        },
        totalCount: 20,
        showRobotHeader:false,
        showAddTaskBtn:true

      }
    },
    components: {
      appHeader,
      robotHeader
    },
    methods: {
      taskType(value, row) {
        let text = value.taskType;
        if(text=="DIALOGUE"){
          return  '对话'
        }else if(text=="TAGGING"){
          return  '标注'
        }
      },

      goPage(page, row) {
        this.$router.push({
          path: page, query: {
            title: row.name,
            id: row.id,
            taskType:this.queryModel.taskType
          }
        });
        let Cookieobj={
           name:row.name,
           taskId:row.id
        };


        let str= JSON.stringify(Cookieobj);
        sessionStorage.setItem("taskInfo", str);
      },
      indexFilter(index) {
        return index + 10 * (this.queryModel.cp - 1) + 1;
      },
      //点击分页
      pageChange(page) {
        this.queryModel.cp = page;
        this.getList();
      },
      //新建任务
      AddTask() {
         this.dialogVisible=true
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveTask()
          } else {
            return false;
          }
        });
      },
      //语料生效
      corpusTest(index,robotObject){
        let refreshCorpusModel = {}
        refreshCorpusModel.confUserId = robotObject.userId
        refreshCorpusModel.preview = 'test'
        refreshCorpusModel.robotId = robotObject.id
        this.refreshCorpusRequest(refreshCorpusModel)
      },
      //语料发布
      corpusProduction(index,robotObject){
        let refreshCorpusModel = {}
        refreshCorpusModel.confUserId = robotObject.userId
        refreshCorpusModel.preview = 'production'
        refreshCorpusModel.robotId = robotObject.id
        this.refreshCorpusRequest(refreshCorpusModel)
      },
      async refreshCorpusRequest(params){
        let result = await informationService.refreshClassification(params);
        let message =''
        if (params.preview ==='test'){
          message ='语料正在生效，请勿再次点击'
        } else if(params.preview ==='production'){
          message ='语料正在发布，请勿再次点击'
        }
        if (result.message.code == 0) {
          this.$message({
            showClose: true,
            message:message ,
            type: 'warning'
          });
        }else {
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }

      },
      async saveTask(){
        let result = await informationService.savetask(this.ruleForm);
        if (result.message.code == 0) {
          let target = this;
          setTimeout(function () {
            target.dialogVisible=false;
            target.getList();
            target.ruleForm.name='';
            target.ruleForm.taskDesc=''
          },1250);
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          });
        }else {
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },
      //获取数据列表
      async getList() {
        this.showListLoading=true;
        let result = await informationService.querytask(this.queryModel);
        if (result.message.code == 0) {
          this.showListLoading=false;
          this.listData = result.data.list;
          this.totalCount = result.data.totalCount;
          this.queryModel.cp = result.data.currentPage;
        }
      },
      deleteEvent(index, row) {
        this.$confirm('确定删除任务《'+ row.name+' 》吗？删除后该任务下的所有相关信息都将删除！', '提示', {type: 'warning'}).then(() => {
          this.confirmDelete(row.id)
        }).catch(() => {
        });
      },
      async confirmDelete(id) {
        this.showListLoading=true;
        let result = await informationService.deletetask({ids: id});
        if (result.message.code == 0) {
          let target = this;
          setTimeout(function () {
            target.getList();
          }, 1250);
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          });
        } else {
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },

    },
    mounted: function () {
    },
    watch: {},
    created: function () {
      /**对话机器人配置平台跳转到该页面需要处理:1.导航条 2.请求tasktype 3.去掉新建任务 4.列表中增加语料生效功能**/
      if (this.$route.query.taskType) {
        this.queryModel.taskType=this.$route.query.taskType//技能id
        if (this.queryModel.taskType == 'DIALOGUE'){
          this.showRobotHeader = true
          this.showAddTaskBtn = false
        }
      }
      if(getJoinCookie('userId')){
        this.ruleForm.userId=getJoinCookie('userId');
        this.queryModel.userId=getJoinCookie('userId');
        this.getList();
      }else {
        this.$router.push({path: '/login'})
      }
    }
  }
</script>
<style scoped>
  .container {
    width: 100%;
    background-color: #EFF3F6;
    box-sizing: border-box;
  }
  .el-table {
    background: #EFF3F6;
  }
</style>
