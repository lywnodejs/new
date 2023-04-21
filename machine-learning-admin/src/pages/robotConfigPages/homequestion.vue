<template>
    <!--机器人首页问题设置页面-->
  <el-container class="container">
    <el-header style="padding: 0px">
      <robotHeader></robotHeader>
    </el-header>
    <el-main>
      <!--面包屑-->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/myrobot' }">{{robotData.name}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/homequestioncategory' }">问题类别</el-breadcrumb-item>
        <el-breadcrumb-item>{{questionType}}</el-breadcrumb-item>

      </el-breadcrumb>

       <el-row class="contentClass" style="margin:20px 130px">
         <!--<el-button size="small" type="primary" @click="addQuestionCategory">添加问题类别</el-button>-->
         <!--<el-button size="small" type="primary" @click="homeQuestionCategory">问题类别管理</el-button>-->

         <el-row style="background-color: white;margin-top: 20px;padding: 15px">
           <!--<el-tabs style=" " v-model="editableTabsValue" type="card"  @edit="handleTabsEdit">-->
             <!--<el-tab-pane-->
               <!--:key="item.name"-->
               <!--v-for="(item, index) in editableTabs"-->
               <!--:label="item.question"-->
               <!--:name="item.name"-->
             <!--&gt;-->
             <!--</el-tab-pane>-->
             <el-table :data="listData"  v-loading="showListLoading" style="width: 100% " :header-cell-style="headerStyle">
               <el-table-column   prop="rank" align="left" width="100" label="顺序"></el-table-column>
               <el-table-column   label="问题" prop="recommendQuestion" align="center">
                 <template slot-scope="scope">
                   <el-input
                     placeholder="请填写问题"
                     v-model="scope.row.recommendQuestion"
                     clearable>
                   </el-input>
                 </template>
               </el-table-column>
               <el-table-column  width="180" label="操作" align="center"  resizeable="false">
                 <template slot-scope="scope">
                   <el-button  class="elButtonDele" type="danger" size="mini" @click="deleteQuestion(scope.$index, scope.row)">删除</el-button>
                 </template>

               </el-table-column>
             </el-table>
           <!--</el-tabs>-->
           <el-row style="margin-top: 40px;margin-bottom: 40px" >
             <el-col  align="center">
               <el-button   type="primary"  @click="addQuestion">添加问题</el-button>
               <el-button   type="success"  @click="saveQuestion">保存</el-button>
             </el-col>
           </el-row>
         </el-row>
       </el-row>
    </el-main>


  </el-container>
</template>

<script>

  import {robotConfigService} from '../../service/index';
  import robotHeader from '../../components/robotConfig/RobotConfigHeader';
  import {SetCookie,getJoinCookie} from '../../utils/commonUtil';

    export default {
        name: "homequestion",
        components: {
        robotHeader
        },
        data() {
          return{
            homeQuestionListModel:{
              taskId:'',
              indexQuestionTypeId:'',//问题类别ID
              direction:['ASC'],//排序方向
              orderBy:['rank'],//排序字段
              ps:1000,
            },
            robotData:{},//机器人对象数据
            questCategoryObj:{},//类别对象
            questionType:'',
            listData:[],//问题列表数据
            showListLoading:false,
            headerStyle:{
              color: '#7F8FA4'
            },
          }
        },

        methods:{
          /************************接口相关的方法*******************************/
          //请求首页问题类别列表
          async homeQuestionList(){
            this.showListLoading=true;
            let result = await robotConfigService.getHomeQuestionList(this.homeQuestionListModel);
            this.showListLoading=false;
            if (result.message.code == 0) {
              this.listData = result.data.list
            } else {
              this.$message({
                showClose: true,
                message:'请求超时',
                type: 'error'
              });
            }
          },
          //保存首页问题类别
          async savehomeQuestionRequest(params){
            this.showListLoading=true;
            let result = await robotConfigService.addHomeQuestion(params);
            this.showListLoading=false;
            if (result.message.code == 0) {
              let target = this;
              setTimeout(function () {
                target.homeQuestionList();
              }, 1250);
              this.$message({
                showClose: true,
                message: '保存成功',
                type: 'success'
              });
            } else {
              this.$message({
                showClose: true,
                message:'请求超时',
                type: 'error'
              });
            }

          },
          //删除问题类别列表
          async deleteQuestionRequest(id){
            this.showListLoading=true;
            let result = await robotConfigService.deleHomeQuestion({indexQuestionId:id});
            if (result.message.code == 0) {
              this.showListLoading=false;
              let target = this;
              setTimeout(function () {
                target.homeQuestionList();
              }, 1250);
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
            } else {
              this.showListLoading=false;
              this.$message({
                showClose: true,
                message: result.message.message,
                type: 'error'
              });
            }
          },
          /************************交互相关的方法*******************************/
          //删除问题
          deleteQuestion(index,object){
            if(!object.id){
              this.listData.splice(index,1)
              return
            }
            this.$confirm('确认删除该问题吗？删除后对应页面问题也将同步删除', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //点击确定
              this.deleteQuestionRequest(object.id);
            }).catch(() => {
              //点击取消
            });

          },
          //保存问题
          saveQuestion(){
            let homeQuestionList = []
            for(let index in this.listData){
              let homeQuestionObj = this.listData[index]
              homeQuestionObj.task = this.robotData
              homeQuestionObj.indexQuestionType = this.questCategoryObj
              homeQuestionObj.preview = 'test'
              homeQuestionList.push(homeQuestionObj)
            }
            this.savehomeQuestionRequest(homeQuestionList)
          },
          //添加问题
          addQuestion(){
            this.listData.push({recommendQuestion:'',rank:this.listData.length+1})

          },


        },
        created:function () {
          this.robotData= JSON.parse(sessionStorage.getItem("robotObj"));
          this.homeQuestionListModel.taskId = this.robotData.id
          if(this.$route.query.questCategoryObj){
            this.questCategoryObj = JSON.parse(this.$route.query.questCategoryObj)
            this.questionType = this.questCategoryObj.questionType
            this.homeQuestionListModel.indexQuestionTypeId = this.questCategoryObj.id
          }

        },
        mounted:function () {
        this.homeQuestionList()
        }

    }
</script>

<style scoped>
  .container >>> .el-main{
    padding: 0;
  }
  .contentClass >>> .el-tabs__header{
    margin: 0px;
  }
  /*.contentClass >>> .el-table--fit {*/
    /*border-left: 1px solid #EBEEF4;*/
    /*border-right: 1px solid #EBEEF4;*/
    /*border-top: 0px solid #EBEEF4;*/
  /*}*/
  /*.contentClass >>> .el-tabs--card>.el-tabs__header .el-tabs__nav{*/
    /*background-color: white;*/
    /*border-bottom: 1px solid #EBEEF4;*/

  /*}*/

  .breadcrumb{
    background-color: #fff;
    height: 60px;
    padding-left: 60px;
    line-height: 60px;
    text-align: center;

  }
  .elButtonDele
  {
    padding: 6px 10px;
    background-color: red;
    border: none;
  }

</style>
