<template>
  <div style="width: 100%;height: 100%" v-loading="showListLoading"
       element-loading-text="数据上传中，请稍后"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.5 )">
  <div class="container titlebold">
    <el-row type="flex" justify="space-around" style="padding-left: 30px;height: 60px;line-height: 60px;background-color: #FFFFFF;">
      <el-col align="left">
        <!--<span style="font-size: 14px;position: relative;color: #7F8FA4">语料集管理</span>-->
        <span style="font-size: 18px;font-weight: bold">语料集管理</span>
        <el-button size="mini" type="success" style="margin-left: 20px;font-size: 12px" @click="Addcorpus()">新建语料集</el-button>
        <el-button size="mini" type="primary" style="margin-left: 10px;font-size: 12px" @click="goPage2('/corpussearch?index=corpusmaintenance')">语料搜索</el-button>
        <el-button size="mini" type="primary" style="margin-left: 10px;font-size: 12px" @click="goPage2('/corpusimport?index=corpusmaintenance')">语料导入</el-button>
      </el-col>
    </el-row>

    <el-row style="margin: 20px">
      <el-table
        :data="listData"
        stripe
        :show-header="true"
        v-loading="Dataloading"
      element-loading-text="数据处理中，请稍后"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8 )"
        width="100%">
        <el-table-column width="" label="名称" prop="name">
          <template slot-scope="scope">
            <el-row type="flex">
              <el-button type="text" :disabled="scope.row.humanLabelTypeNumber==''" @click="goPage('/corpustagings?index=corpusmaintenance',scope.row)">{{scope.row.name}}</el-button>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column width="" label="语料id" prop="id"></el-table-column>
        <el-table-column label="标注进度">
          <template slot-scope="scope">
            <div style="display: inline-block;margin-right: 10px" v-for="item in scope.row.humanLabelTypeNumberArr">
              <span>{{item.name}}：</span><span style="color: #45B854; font-size: 22px;font-weight: bold">{{item.count}}</span><span>/{{scope.row.totalNumber}} </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="380px" label="操作" fixed="right" >
          <template slot-scope="scope" align='center'>
            <el-row type="flex">
            <el-button type="danger" size="mini"  @click="deleteEvent(scope.$index, scope.row)">删除</el-button>
              <el-button type="success" size="mini" @click="importClick(scope.$index, scope.row)">导入</el-button>
            <el-button type="primary" size="mini" @click="exportJson(scope.$index, scope.row)">导出已标注预料</el-button>
            <el-button type="primary" size="mini" @click="exportJsonAll(scope.$index, scope.row)">导出全部</el-button>
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
                       layout="total, prev, pager, next, jumper"
                       @current-change="pageChange"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="40%">
      <el-form :model="corpusModel">
        <el-form-item label="" :label-width="formLabelWidth2">

          <span v-if="this.currentTextName.length > 0">语料集名称：<span>{{this.currentTextName}}</span></span>
          <el-input v-else @input="changel()" v-model="corpusModel.name" placeholder="请输入样本集名称" autocomplete="off" ></el-input>

        </el-form-item>
        <el-form-item label="样本集来源：" :label-width="formLabelWidth">
          <el-radio-group v-model="corpusModel.datasetType">
            <el-radio label="OFFLINE">离线数据</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" >
          <el-radio v-model="corpusModel.importTagging" label="1">含机器预测标签</el-radio>
          <el-radio v-model="corpusModel.importTagging" label="0">含人工标注标签</el-radio>
        </el-form-item>
        <el-form-item label="选择文件格式:" >
          <el-select size="small" v-model="corpusModel.templateType" placeholder="请选择">
            <el-option
              v-for="item in templateTypeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-upload
          ref="upload"
          class="avatar-uploader"
          action="/information/corpus/dataset"
          :data="corpusModel"
          :show-file-list="true"
          :file-list="fileList3"
          :auto-upload="false"
          :on-change="handleChange"
          :on-remove="removeFile"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-upload="beforeAvatarUpload">
          <el-button size="small" type="primary"  >上传   <i class="el-icon-upload"></i></el-button>
        </el-upload>
        <i style="font-style: normal;margin-top: 20px;display: inline-block">仅限一个文件上传，文件格式为txt,json,zip，编码仅支持utf-8</i>
        <el-form-item label="" >
          <el-checkbox v-model="corpusModel.importType">导入时排重</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" :disabled="Sure" v-if="this.fileList3.length>0" @click="submitF()">确 定</el-button>
           <el-button type="primary" :disablled="Sure" v-if="this.fileList3.length===0" @click="submitFNofile()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
  </div>
</template>

<script>
  import appHeader from '../../components/AppHeader';
  import {informationService} from '../../service/index';
  import {mapActions, mapState} from 'vuex';
  import vue from 'vue'

  export default {
    name: "sdada",
    data() {
      return {
        Dataloading:false,
        templateTypeArr:[
          {
            value: 'TXT',
            label: 'TXT'
          }, {
            value: 'JSON',
            label: 'JSON'
          }, {
            value: 'ZIP',
            label: 'ZIP'
          }
        ],
        Sure:false,
        taskInfo:'',
        formLabelWidth:'100px',
        formLabelWidth2:'1px',
        dialogVisible:false,
        title:'新建语料样本集',
        currentTextName:'',
        corpusModel:{
          templateType:'TXT',
          importType:true,
          datasetType:'OFFLINE',//目前只支持离线
          importTagging:''
        },
        listData: [],
        showListLoading: false,
        queryModel: {
          taskId:'',
          direction:'DESC',
          cp: 1,
          ps: 10
        },
        totalCount: 0,
        fileList3: [],
        DataModel:{}
      }
    },
    methods: {

      changel(){

        this.$forceUpdate()
      },
      Addcorpus(){

        this.currentTextName = '';
        this.corpusModel.name = '';
        this.corpusModel.id = '';
        this.title = '新建预料样本集';
        this.dialogVisible=true
      },
      importClick(index, item){

         this.DataModel=JSON.parse(JSON.stringify(item))

         this.corpusModel.name = this.DataModel.name;
         this.corpusModel.id = this.DataModel.id;
         this.corpusModel.taskId = this.DataModel.taskId;

         this.dialogVisible=true
         this.title = '导入语料集';
         this.currentTextName = this.DataModel.name;
      },

      //上传相关
      handleChange(file, fileList) {
        this.fileList3 = fileList.slice(-1);

      },
      removeFile(res, file) {
        // this.fileList3 = file.slice(-1);
      },

      beforeAvatarUpload(file) {
        const isMP3 = file.type === 'text/plain' || file.type === 'application/json'|| file.type === 'application/zip'|| file.type === 'application/x-zip-compressed';
        debugger
        const isLt30M = file.size / 1024 / 1024 < 1024;
        if (!isMP3) {
          this.$message.error('上传只支持 txt,json,zip!');
          this.showListLoading=false
        }
        if (!isLt30M) {
          this.$message.error('文件大小不能超过1024M!');
          this.showListLoading=false
        }
        return isMP3 && isLt30M;
      },
      goPage(page,row) {
        this.$router.push({
          path: page,
          query: {
            name: row.name,
            id:row.id
          }
        });
      },
      goPage2(page,row) {
        this.$router.push({
          path: page,
        });
      },
      indexFilter(index) {
        return index + 10 * (this.queryModel.cp - 1) + 1;
      },
      //点击分页
      pageChange(page) {
        this.queryModel.cp = page;
        this.getList();
      },
      submitF(){

        if(this.corpusModel.name==undefined ||this.corpusModel.name==''){
          this.$message({
            showClose: true,
            message: '请输入名称',
            type: 'error'
          });
          return
        }
   /*     if(this.corpusModel.importType==undefined ||this.corpusModel.importType==''){
          this.$message({
            showClose: true,
            message: '请选择',
            type: 'error'
          });
          return
        }*/
        if(this.corpusModel.datasetType==undefined ||this.corpusModel.datasetType==''){
          this.$message({
            showClose: true,
            message: '请选择',
            type: 'error'
          });
          return
        }
    /*    if(this.fileList3.length==0){
          this.$message({
            showClose: true,
            message: '请选择文件',
            type: 'error'
          });
          return
        }*/
        if(this.corpusModel.importType){
          this.corpusModel.importType='1'
        }else {
          this.corpusModel.importType='0'
        }
        this.showListLoading=true;
        this.dialogVisible=false;
        this.Sure=true

        this.$refs.upload.submit();
      },
      handleSuccess(){
        this.Sure=false;
        this.showListLoading=false;
        this.$message({
          showClose: true,
          message: '语料新建成功',
          type: 'success'
        });
        this.$refs.upload.clearFiles()
        this.corpusModel.name='';
        this.corpusModel.id='';
        this.corpusModel.importType=true
        this.getList()
      },
      handleError(){
        this.dialogVisible=false;
        this.showListLoading=false;
        this.$message({
          showClose: true,
          message: '语料新建失败',
          type: 'error'
        });
        this.getList()
      },
      async submitFNofile(){
        if(this.corpusModel.importType){
          this.corpusModel.importType='1'
        }else {
          this.corpusModel.importType='0'
        }
        if(this.corpusModel.name==undefined ||this.corpusModel.name==''){
          this.$message({
            showClose: true,
            message: '请输入名称',
            type: 'error'
          });
          return
        }

        let result = await informationService.savecorpus(this.$qs.stringify(this.corpusModel));

        if (result.message.code == 0) {
          this.Sure=false;
          this.showListLoading=false;
          this.dialogVisible=false;
          this.corpusModel.name='';
          this.corpusModel.id='';
          this.corpusModel.importType=true
          this.$message({
            showClose: true,
            message: '语料新建成功',
            type: 'success'
          });
          this.getList()
        }
      },
      //获取数据列表
      async getList() {
        this.Dataloading=true;
        let result = await informationService.querycorpus(this.queryModel);
        if (result.message.code == 0) {
          this.Dataloading=false;
          let temp=result.data.list;
          temp.forEach((item,index)=>{
            if(item.humanLabelTypeNumber!=''){
              item.humanLabelTypeNumberArr=JSON.parse(item.humanLabelTypeNumber)
            }
          });
          this.listData = temp;
          this.totalCount = result.data.totalCount;
          this.queryModel.cp = result.data.currentPage;
        } else {
          this.Dataloading=false;
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },
      deleteEvent(index, row) {
        this.$confirm('确定删除该预料集么？', '提示', {type: 'warning'}).then(() => {
          this.confirmDelete(row.id)
        }).catch(() => {
        });
      },
      async confirmDelete(id) {
        this.Dataloading=true;
        let result = await informationService.deletecorpus({ids: id});
        if (result.message.code == 0) {
          let target = this;
          setTimeout(function () {
            target.getList();
          }, 1250)
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
      //导出已标注语料JSON格式
      async exportJson(index,row){
        let data={};
        data.taskId=this.queryModel.taskId;
        data.datasetId=row.id;
        data.humanLabelStatus='1';
        this.Dataloading=true
        let result = await informationService.corpusExport(data);
        window.location.href=vue.prototype.url;
        this.Dataloading=false
      },
      //导出全部语料JSON格式
      async exportJsonAll(index,row){
        let data={};
        data.taskId=this.queryModel.taskId;
        data.datasetId=row.id;
        this.Dataloading=true;
        let result = await informationService.corpusExport(data);
        window.location.href=vue.prototype.url;
        this.Dataloading=false
      }
    },
    components: {
      appHeader
    },
    mounted: function () {
    },
    watch: {},
    created: function () {

      this.taskInfo= JSON.parse(sessionStorage.getItem("taskInfo"));
      this.queryModel.taskId=this.taskInfo.taskId;
      this.corpusModel.taskId=this.taskInfo.taskId;
      this.getList()
    }
  }
</script>
<style scoped>
  .container {
    background-color: #EFF3F6;
    box-sizing: border-box;
  }
</style>
