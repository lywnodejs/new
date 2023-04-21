<template>
    <!--问答对管理-->
  <el-container>
    <!--面包屑-->
    <el-header style="background-color: #fff; padding: 0px;height: 45px">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/skillhome', query: {
            skillData:JSON.stringify(skillData),
            robotName:robotName
            }}">我的技能</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/knowledgemanagement', query: {
            skillData:JSON.stringify(skillData),
            robotName:robotName,
            index:'knowledgemanagement',
            }}">知识类别管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{categoryTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-row class="topView" >
      <el-button size="small" type="success" style="margin-left: 20px" @click="addQa()">新建问答对</el-button>
      <el-input  class="searchInput" v-model="qaPairListParams.keywords" size="small" placeholder="搜索关键词" style="width: 200px"></el-input>
      <el-button class="searchBtn" type="primary" size="small" @click="searchClick">搜索</el-button>
      <!--<el-button  style="position: absolute;right: 20px;top: 20px;" type="primary" size="small" @click="saveClick">保存</el-button>-->
    </el-row>

    <el-row class="tableList">
      <el-table :data="qaPairList"  v-loading="showListLoading" :header-cell-style="headerStyle">
        <el-table-column  width="350" label="问题" prop="similarityQuestion" align="left">
          <template slot-scope="scope" >
            <span v-html="scope.row.standardQuestion+'<br/>'"></span>
            <span v-html="replaceEnter(scope.row.similarityQuestion)">
            </span>
          </template>
        </el-table-column>
        <el-table-column  label="答案" prop="answer" align="left" ></el-table-column>
        <el-table-column  label="虚拟人答案" prop="virtualHumanAnswer" align="left" ></el-table-column>
        <el-table-column  width="180" label="操作" align="center"  resizeable="false">
          <template slot-scope="scope">
            <el-row type="flex"  style="margin-left: 15px">
              <el-button class="elButtonEdit" type="primary" size="mini"  @click.stop="editQa(scope.$index, scope.row)">编辑</el-button>
              <el-button  class="elButtonDele"type="primary" size="mini" style="background-color: red ; border-color: red" @click.stop="deleteQa(scope.$index, scope.row)">删除</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="zoom-pagi" style="padding-top: 30px;padding-bottom: 30px">
      <el-col type="flex" justify="center">
        <el-pagination align="center"
                       :current-page.sync= "qaPairListParams.cp"
                       :total="totalCount"
                       class="pagination"
                       layout="total, prev, pager, next, jumper"
                       @current-change="pageChange"
        >
        </el-pagination>
      </el-col>
    </el-row>


  </el-container>

</template>

<script>
  import {robotConfigService} from '../../service/index';

  export default {
      name: "qamanagent",
      data(){
        return{
          showListLoading:false,
          qaPairList:[],
          skillData:{},
          knowledgeData:{},
          robotName:'',
          categoryTitle:'',//知识类别的名称
          headerStyle:{color: '#7F8FA4'},
          totalCount:1,
          qaPairListParams:{
            qaKnowledgeTypeId:'',//问答对类别ID
            skillId:'',//技能ID
            taskId:'',//任务ID
            keywords:'',//搜索关键字
            direction:'ASC',//排序方向
            orderBy:'id',//排序字段
            cp:1,
            ps:10,
          },
        }
      },
      methods:{
        /******************************接口相关的方法********************************************/
        //获取答案对列表
        async getQaPairList(){

          this.showListLoading=true;
          let result = await robotConfigService.getQaKnowledgeList(this.qaPairListParams);
          if (result.message.code === 0) {
            debugger
            this.showListLoading=false;
            this.qaPairList = result.data.list;
            this.totalCount = result.data.totalCount;
            this.qaPairList.cp = result.data.currentPage;
          }
        },
        //删除问答对
        async deleteQaPairRequest(id){
          let result = await robotConfigService.deleQaKnowledge({qaKnowledgeId:id});
          if (result.message.code == 0) {
            let target = this;
            setTimeout(function () {
              target.getQaPairList();
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
        /******************************交互相关的方法*******************************************/
        //保存
        saveClick(){

        },
        //搜索
        searchClick(){
          this.getQaPairList()
        },
        //新建问题对
        addQa(){
          this.$router.push({path: '/addqapair',query: {
              index:'addqapair',
              robotName:this.robotName,
              skillData:JSON.stringify(this.skillData),
              knowledgeData:JSON.stringify(this.knowledgeData),

            }});
        },
        //编辑问题对
        editQa(idnex,qaObject){
          this.$router.push({path: '/addqapair',query: {
              index:'addqapair',
              robotName:this.robotName,
              skillData:JSON.stringify(this.skillData),
              knowledgeData:JSON.stringify(this.knowledgeData),
              qaObject:JSON.stringify(qaObject),
            }});

        },
        //删除问题对
        deleteQa(idnex,qaObject){
          var text = '确定删除该条知识对吗？删除后所有相关信息都将删除!'
          this.$confirm(text, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //点击确定
            this.deleteQaPairRequest(qaObject.id);
          }).catch(() => {
            //点击取消
          });

        },
        pageChange(page) {
          this.qaPairListParams.cp = page;
          this.getQaPairList();
        },
        //转换回车符
        replaceEnter(str){
          let oldstr = str.replace(/\n/g,"<br/>")
          return oldstr
        },


      },
      created(){
        if(this.$route.query.skillData){
          this.skillData  = JSON.parse(this.$route.query.skillData)
          this.robotName = this.$route.query.robotName
        }
        if(this.$route.query.knowledgeData){
          this.knowledgeData = JSON.parse(this.$route.query.knowledgeData)
          this.categoryTitle =this.knowledgeData.knowledgeType
        }
      },
      mounted(){
        this.qaPairListParams.qaKnowledgeTypeId = this.knowledgeData.id
        this.qaPairListParams.skillId = this.skillData.id
        this.qaPairListParams.taskId = this.skillData.task.id
        this.getQaPairList();
      },

    }
</script>

<style scoped>
  .breadcrumb{
    background-color: #fff;
    height: 45px;
    padding-left: 20px;
    line-height: 45px;
    text-align: center;
  }
  .topView{
    height: 70px;
    line-height: 70px;

  }
  .searchInput{
    vertical-align: -1px;
    margin-left: 20px;
    margin-right: 10px;

  }
  .searchBtn{
  }
  .tableList{
    margin-left: 20px;
    margin-right: 20px;
  }
</style>
