<template>
    <!--首页问题类别管理-->
  <el-container class="container">
    <el-header style="padding: 0px">
      <robotHeader></robotHeader>
    </el-header>
    <el-main>
      <!--面包屑-->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/myrobot' }">{{robotData.name}}</el-breadcrumb-item>
        <el-breadcrumb-item>首页问题</el-breadcrumb-item>
        <el-breadcrumb-item>类别管理</el-breadcrumb-item>
      </el-breadcrumb>

      <el-row class="contentClass" style="background-color: white; margin:20px 130px;padding: 10px">
          <el-table :data="listData"   v-loading="showListLoading" style="width: 100%;" :header-cell-style="headerStyle">
            <el-table-column   prop="rank"  align="left" width="100" label="顺序"></el-table-column>
            <el-table-column   label="问题类别" prop="questionType" align="center">
              <template slot-scope="scope">
                <el-input
                  placeholder="请填写问题类别"
                  v-model="scope.row.questionType"
                  clearable>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column   width="320" label="操作" align="center"  resizeable="false">
              <template slot-scope="scope">
                <el-row type="flex" style="margin-left: 35px" >
                  <el-button  class="elButtonEdit" :disabled="scope.$index===0" type="primary" size="mini" @click="upMove(scope.$index, scope.row)">上移</el-button>
                  <el-button  class="elButtonEdit" :disabled="scope.$index===listData.length-1" type="primary" size="mini" @click="downMove(scope.$index, scope.row)">下移</el-button>
                  <el-button  class="elButtonEdit" :disabled="!scope.row.id"type="primary" size="mini" @click="editQuestion(scope.$index, scope.row)">编辑问题</el-button>
                  <el-button  class="elButtonDele" type="danger" size="mini" @click="deleteQuestCategory(scope.$index, scope.row)">删除</el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        <el-row style="margin-top: 40px;margin-bottom: 40px" >
          <el-col  align="center">
            <el-button   type="primary"  @click="addQuestionCategory">添加问题类别</el-button>
            <el-button   type="success"  @click="saveQuestionCategory">保存</el-button>
          </el-col>

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
        name: "homequestioncategory",
        components: {
          robotHeader
        },
        data(){
          return{
            questioncategoryListModel:{
              taskId:'',
              direction:['ASC'],//排序方向
              orderBy:['rank'],//排序字段
              ps:1000,
            },
            robotData:{},//机器人对象数据
            showListLoading:false,
            listData:[],
            headerStyle:{
              color: '#7F8FA4'
            },
          }
        },

        methods:{
          /**************************接口请求相关方法***************************************/
          //请求首页问题类别列表
          async questionCategoryList(){
            this.showListLoading=true;
            let result = await robotConfigService.getQuestionCategoryList(this.questioncategoryListModel);
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
          async saveQuestionCategoryRequest(params){
            this.showListLoading=true;
            let result = await robotConfigService.addQuestionCategory(params);
            this.showListLoading=false;
            if (result.message.code == 0) {
              let target = this;
              setTimeout(function () {
                target.questionCategoryList();
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
          async deleteQuestCategoryRequest(id){
            this.showListLoading=true;
            let result = await robotConfigService.deleQuestionCategory({indexQuestionTypeId:id});
            if (result.message.code == 0) {
              this.showListLoading=false;
              let target = this;
              setTimeout(function () {
                target.questionCategoryList();
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
          /**************************交互相关方法***************************************/

          //删除问题类别
          deleteQuestCategory(index,obiect){
            if(!obiect.id){
              this.listData.splice(index,1)
              return
            }
            this.$confirm('确认删除该问题类别吗？删除后对应页面问题的类别也将同步删除', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //点击确定
              this.deleteQuestCategoryRequest(obiect.id);
            }).catch(() => {
              //点击取消
            });

          },
          //编辑类别下问题
          editQuestion(index,object){
            this.$router.push({path: '/homequestion', query: {
                questCategoryObj:JSON.stringify(object)
              }});
          },
          //添加问题类别
          addQuestionCategory(){
          this.listData.push({questionType:'',rank:this.listData.length+1})
          },
          //保存
          saveQuestionCategory(){
           let questionCategoryList = []
            for(let index in this.listData){
               let questionCategoryObj = this.listData[index]
               questionCategoryObj.task = this.robotData
               questionCategoryObj.preview = 'test'
              questionCategoryList.push(questionCategoryObj)
            }
             this.saveQuestionCategoryRequest(questionCategoryList)
          },
          //上移
          upMove(index,obiect){
            obiect.rank =  parseInt(obiect.rank)-1
            let questionCategoryObj = this.listData[index-1]
            questionCategoryObj.rank = parseInt(questionCategoryObj.rank)+1
            this.listData= this.arrayMove(this.listData, index, index - 1)
          },
          //下移
          downMove(index,obiect){
            obiect.rank =  parseInt(obiect.rank) +1
            let questionCategoryObj = this.listData[index+1]
            questionCategoryObj.rank = parseInt(questionCategoryObj.rank)-1
            this.listData=this.arrayMove(this.listData, index, index + 1)
          },
          arrayMove(arr, index1, index2){
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
          },

        },
        created:function () {
          this.robotData= JSON.parse(sessionStorage.getItem("robotObj"));
          this.questioncategoryListModel.taskId = this.robotData.id
        },
        mounted:function () {
          this.questionCategoryList()
        }
    }
</script>

<style scoped>
  .container >>> .el-main{
    padding: 0;
  }
  .breadcrumb{
    background-color: #fff;
    height: 60px;
    padding-left: 60px;
    line-height: 60px;
    text-align: center;

  }
  .elButtonEdit,
  .elButtonDele
  {
    padding: 6px 10px;
  }
  .elButtonDele{
    background-color: red;
    border: none;
  }

</style>
