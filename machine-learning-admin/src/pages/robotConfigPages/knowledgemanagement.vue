<template>
    <!--知识类别管理-->
  <el-container    v-loading="loading"
                   element-loading-text="正在上传,请耐心等待"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(0, 0, 0, 0.8)">
    <!--面包屑-->
    <el-header style="background-color: #fff; padding: 0px;height: 45px">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/skillhome', query: {
            skillData:JSON.stringify(skillData),
            robotName:robotName
            }}">我的技能</el-breadcrumb-item>
        <el-breadcrumb-item>技能管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-row class="topView">
        <span style="">知识类别管理</span>
        <el-button size="small" type="success" style="margin-left: 15px" @click="addKnowled()">新建知识类别</el-button>
        <el-button size="small" type="primary" style="margin-left: 15px" @click="uploadExcel()">
          <i class="el-icon-download"></i>&nbsp导入</el-button>
        <el-button size="small" type="primary" style="margin-left: 3px" @click="downloadExcel()">
          <i class="el-icon-upload2"></i>&nbsp导出</el-button>
    </el-row>
    <el-row class="tableList">
      <el-table :data="listData"  v-loading="showListLoading" :header-cell-style="headerStyle">
        <el-table-column  width="300" label="名称" prop="knowledgeType" align="left">
          <template slot-scope="scope">
            <el-row type="flex">
              <el-button type="text" @click="goPage('/qamanagent?index=qamanagent',scope.row)">{{scope.row.knowledgeType}}</el-button>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column  label="描述" prop="knowledgeDescription" :formatter="formatDescription" align="left" ></el-table-column>
        <el-table-column  width="180" label="操作" align="center"  resizeable="false">
          <template slot-scope="scope">
            <el-row type="flex"  style="margin-left: 15px">
              <el-button class="elButtonEdit" type="primary" size="mini"  @click.stop="editKnowled(scope.$index, scope.row)">编辑</el-button>
              <el-button  class="elButtonDele"type="primary" size="mini" style="background-color: red ; border-color: red" @click.stop="deleteKnowled(scope.$index, scope.row)">删除</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="zoom-pagi" style="padding-top: 30px;padding-bottom: 30px">
      <el-col type="flex" justify="center">
        <el-pagination align="center"
                       :current-page.sync= "knowledListParams.cp"
                       :total="totalCount"
                       class="pagination"
                       layout="total, prev, pager, next, jumper"
                       @current-change="pageChange"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <!--新建知识分类和编辑知识分类弹窗-->
    <el-dialog  :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="close()"  custom-class="dialogClass"   >
      <div slot="title">{{formTitle}}</div>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
        <el-form-item  label="名称"   prop="knowledgeType">
          <el-input v-model="form.knowledgeType" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input  type="textarea" v-model="form.knowledgeDescription" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit('form')">确定</el-button>
          </span>
    </el-dialog>
    <!--导入弹窗-->
    <el-dialog  class="uploadDialog" :visible.sync="uploadDialogVisible" :close-on-click-modal="false" @close="uploadClose()"  custom-class="dialogClass" center >
      <div slot="title" style="text-align: left">导入问答知识对</div>
      <el-row style="text-align: center;margin-top: 20px" >
        <el-upload
          class="upload-demo"
          name="file"
          action="/robotConfig/qaKnowledge/type/import"
          :on-error="uploadFalse"
          :on-success="uploadSuccess"
          :before-upload="beforeAvatarUpload"
          :data="uploadModel"
          :auto-upload = 'false'
          ref="upload"
          :show-file-list="true"
        >
          <el-button slot="trigger" style="width: 146px;height: 46px" type="success" @click="onSubmit('form')">选择文件</el-button>
        </el-upload>
      </el-row>
      <el-row style="margin-top: 40px">
        <span style="font-size: 14px;margin-bottom: 10px">限一个excel文件,上传格式是.xls或者.xlsx,大小不超过256M.</span>
        <span style="display: block;color:#ED1C24;font-size: 14px;">*导入时会覆盖当前平台的所有知识类别及对应的知识对,请谨慎操作</span>
      </el-row>
      <span slot="footer"  class="dialog-footer">
              <el-button size="mini" type="info" @click="cancelUpload">取 消</el-button>
              <el-button size="mini" type="primary" @click="submitUpload">上传</el-button>
          </span>
    </el-dialog>



  </el-container>
</template>

<script>
  import {robotConfigService} from '../../service/index';
  import {stringForArray,arrayForString,arrayAddIndex} from '../../utils/commonUtil';
  import {SetCookie,getJoinCookie} from '../../utils/commonUtil';
  import vue from 'vue'


  export default {
      name: "knowledgemanagement",
      data(){
        return{
          showListLoading:false,
          loading:false,
          listData:[],//知识类别列表
          totalCount:1,
          robotName:'',
          //请求策略列表params
          knowledListParams: {
            taskId:'',//任务id 机器人id
            skillId:'',//技能id
            cp:1,
            ps:10,
          },
          skillData:{},
          headerStyle:{color: '#7F8FA4'},
          dialogFormVisible:false,
          uploadDialogVisible:false,
          formTitle:'',
          form:{
            knowledgeType:'',//分类类别名称
            knowledgeDescription:'',//描述
            id:'',//类别id

          },
          rules: {
            knowledgeType: [
              {required: true, message: '请输入名称', trigger: 'blur'}
            ],
          },
          uploadModel:{
            skillId:'',
            taskId:'',
          },
        }
      },
      methods:{
        /******************接口相关接口*************************/
        //获取知识分类列表
        async getKnowledList(){
          this.showListLoading=true;
          let result = await robotConfigService.getKnowledgeList(this.knowledListParams);
          if (result.message.code == 0) {
            debugger
            this.showListLoading=false;
            this.listData = result.data.list;
            this.totalCount = result.data.totalCount;
            this.knowledListParams.cp = result.data.currentPage;
          }
        },
        //新增知识分类
        async addKnowledRequest(params){
          this.showListLoading=true;
          let result = await robotConfigService.addAndeditKnowledge([params]);
          this.dialogFormVisible = false
          if (result.message.code == 0) {
            this.showListLoading=false;
            let target = this;
            let message = '创建成功'
            if(target.formTitle==="编辑知识分类"){
              message='编辑成功'
            }
            setTimeout(function () {
              target.getKnowledList();
            },1250);
            this.$message({
              showClose: true,
              message: message,
              type: 'success'
            });
          }else {
            this.showListLoading=false;
            this.$message({
              showClose: true,
              message: result.message.message,
              type: 'error'
            });
          }

        },
        //删除知识分类
        async deleKnowledRequest(id){
          let result = await robotConfigService.deleKnowledge({qaKnowledgeTypeId:id});
          if (result.message.code == 0) {
            let target = this;
            setTimeout(function () {
              target.getKnowledList();
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
        //导出excel表
        async exportExcel(params){
          let result = await robotConfigService.exportKnowledgeExcel(params);
          window.location.href=vue.prototype.url


        },
        /***********************交互相关方法*******************************/
        //新增
        addKnowled(){
          this.formTitle = '新建知识分类'
          this.dialogFormVisible = true
        },
        //编辑
        editKnowled(index,knowledObj){
          this.formTitle = '编辑知识分类'
          this.dialogFormVisible = true
          this.form.knowledgeType = knowledObj.knowledgeType
          this.form.knowledgeDescription = knowledObj.knowledgeDescription
          this.form.id = knowledObj.id
        },
        //删除
        deleteKnowled(index,knowledObj){
          var text = '确认删除知识分类'+knowledObj.knowledgeType+'?删除后该标签类别下的所有相关信息都将删除!'
          this.$confirm(text, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //点击确定
            this.deleKnowledRequest(knowledObj.id);
          }).catch(() => {
            //点击取消
          });

        },
        //点击确定
        onSubmit(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              var params = {};
              params.knowledgeType = this.form.knowledgeType
              params.knowledgeDescription = this.form.knowledgeDescription
              params.skillId = this.skillData.id
              params.taskId  =this.skillData.task.id
              if(this.formTitle =='新建知识分类'){
                this.addKnowledRequest(params);
              }else if(this.formTitle =='编辑知识分类'){
                params.id = this.form.id
                this.addKnowledRequest(params);
              }
            } else {
              return false;
            }
          });
        },
        // //上传文件的地址
        // uploadUrl(){
        //   return 'http://ai-api-service:31001/qaKnowledge/type/import'
        // },
        //上传失败的回调
        uploadFalse(){

        },
        //上传成功的回调
        uploadSuccess(response, file, fileList){
          this.$refs.upload.clearFiles();
          this.loading = false
          this.getKnowledList();
        },
        //上传之前的回调
        beforeAvatarUpload(file){
          debugger
          this.uploadModel.taskId = this.skillData.task.id
          this.uploadModel.skillId = this.skillData.id
          const isText = file.type === 'application/vnd.ms-excel'
          const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          const isLt256M = file.size / 1024 / 1024 < 256;
          if (!(isText||isTextComputer)) {
            this.$message.error('上传文件格式错误');
          }
          if (!isLt256M) {
            this.$message.error('文件大小不能超过256M!');
          }
          return (isText || isTextComputer) && isLt256M
        },
        submitUpload() {
          //上传
          debugger
          if (this.$refs.upload.uploadFiles.length==0){
            this.$message.error('请选择要上传的文件');
            return
          }
          this.$refs.upload.submit();
          this.uploadDialogVisible = false
          this.loading = true

        },
        cancelUpload(){
          // this.$refs.upload.abort();
          this.$refs.upload.clearFiles();
          this.uploadDialogVisible = false
        },
        //导入(上传excel文件)
        uploadExcel(){
         this.uploadDialogVisible = true
        },
        //导出(下载excel文件)
        downloadExcel(){
          this.uploadModel.taskId = this.skillData.task.id
          this.uploadModel.skillId = this.skillData.id
         this.exportExcel(this.uploadModel)
        },
        //跳转到问答对对管理(点击整行跳转)
        // rowClick(event){
        //   this.$router.push({path: '/qamanagent',query: {
        //       index:'qamanagent',
        //       robotName:this.robotName,
        //       skillData:JSON.stringify(this.skillData)
        //     }});
        // },
        //跳转到问答对管理(点击类别名称)
        goPage(page,row) {
          this.$router.push({
            path: page,
            query: {
              knowledgeData:JSON.stringify(row),//类别数据对象
              robotName:this.robotName,
              skillData:JSON.stringify(this.skillData)//技能对象
            }
          });
        },
        pageChange(page) {
          this.knowledListParams.cp = page;
          this.getKnowledList();
        },
        //新建知识弹窗关闭的回调
        close(){
          //关闭是清空数据
          this.$refs['form'].resetFields()
          this.form.knowledgeType=''//名称
          this.form.knowledgeDescription=''//描述

        },
        //导入弹窗关闭回调
        uploadClose(){

        },
        formatDescription(row, column, cellValue, index){
          return cellValue?cellValue:'--'
        },
      },//methods
      created(){
        this.knowledListParams.userId=getJoinCookie('userId');
        if(this.$route.query.skillData){
          this.skillData  = JSON.parse(this.$route.query.skillData)
          this.knowledListParams.skillId = this.skillData.id
          this.knowledListParams.taskId = this.skillData.task.id
          this.robotName = this.$route.query.robotName
        }
      },
      mounted(){
        //请求列表
        this.getKnowledList();
      }

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
  }
  .topView span{
    font-size: 14px;
    color: #333333;
    padding-left: 20px;
    line-height: 70px;
  }
  .tableList{
    margin-left: 20px;
    margin-right: 20px;
  }
  .uploadDialog >>> .el-dialog__header{
    border-bottom: #DFE2E5 1px solid;
  }

</style>
