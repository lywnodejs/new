<template>

  <div style="background-color: #EFF3F6;">

    <el-row type="flex" style="height: 60px;line-height: 60px;background-color: #FFFFFF;">
      <el-col align="left" style="padding-left: 30px;padding-top: 20px">
        <el-breadcrumb separator="/" >
          <el-breadcrumb-item :to="{ path: '/corpusmaintenance?index=corpusmaintenance' }">语料样本集</el-breadcrumb-item>
          <el-breadcrumb-item>语料导入</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>


    <el-row>
      <el-card class="box-card" shadow="never" style="margin:20px; min-height: 100%">
        <el-form ref="queryModel" :inline="true"  :model="queryModel" label-width="80px">
          <el-form-item label="">
            <el-input size="small" style="width: 335px" v-model="queryModel.keywords"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="success" @click="getList">搜索</el-button>
            <el-button :disabled="btnChangeEnable"  size="small" type="success" @click="dialogVisible = true">导入语料</el-button>
          </el-form-item>
        </el-form>
        <el-form ref="queryModel" :inline="true"  :model="queryModel" label-width="80px">
          <el-form-item label="">

            <el-select size="small" style="width: 160px" v-model="queryModel.searchName" placeholder="来源" filterable>
              <el-option v-for="(item,index) in corpusfromArr" :key="index" :label="item.name" :value="item.id" ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="" >
            <el-select v-if="queryModel.searchName != 'NEWS_TITLE'" size="small" style="width: 160px" v-model="queryModel.contentType" placeholder="语料类型" filterable>
              <el-option v-for="(item,index) in corpustypeArr" :key="index" :label="item.name" :value="item.id" ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="margin-right: 50px">
            <el-button type="text"  @click="timeSortingClick()">时间排序<i class="el-icon-sort"></i></el-button>
          </el-form-item>

        </el-form>
        <div v-if="totalCount>0" style="margin-bottom: 20px;color: rgb(151,161,158);font-size: 18px">为您找到相关结果{{this.totalCount}}个</div>
        <el-table  empty-text="当前数据没有，请搜索..." :data="listData" v-loading="showListLoading" :show-header="false" >
          <el-table-column>
            <template slot-scope="scope">
              <div class="ellipsis" style="cursor: pointer">

                <span v-if="scope.row.highlightContent!=undefined" v-html="scope.row.highlightContent"></span>
                <span v-else>{{scope.row.content}}</span>
              </div>
              <div style="text-align: right">
                 <span>
                     {{format_Time(scope.row.publishAt)}}
                 </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" class="zoom-pagi" style="margin-top: 20px">
          <el-col type="flex" justify="center">
            <el-pagination align="center"
                           :current-page.sync="queryModel.cp"
                           :page-size="queryModel.ps"
                           :total="totalCount"
                           class="pagination"
                           layout="total, prev, pager, next, jumper"
                           @current-change="pageChange">
            </el-pagination>
          </el-col>
        </el-row>
      </el-card>

      <el-dialog title="选择语料样本集" :visible.sync="dialogVisible" width="40%">
        <div  style="max-height: 400px;overflow: auto">
          <el-table
            :data="sourcelistData"
            style="width: 100%;">
            <el-table-column align="left" width="40">

              <template slot-scope="scope">
                <el-radio v-model="importModel.importDatasetId" @change.native="clickitem(scope.row)" :label="scope.row.id"></el-radio>
              </template>

            </el-table-column>
            <el-table-column  label="名称" prop="name" width="150px"></el-table-column>

            <el-table-column  label="" prop="name"  >

              <template slot-scope="scope" :model="importModel">

                <el-input v-if="scope.row.id == ''"  size="small" v-model="importModel.importDatasetName" placeholder="输入语料集名字" :disabled="importModel.importDatasetId>0"></el-input>

              </template>

            </el-table-column>


            <el-table-column label="标注进度">
              <template slot-scope="scope">
                <div style="display: inline-block;margin-right: 10px" v-for="item in scope.row.humanLabelTypeNumberArr">
                  <span>{{item.name}}：{{item.count}}/{{scope.row.totalNumber}} </span>
                </div>
              </template>
            </el-table-column>

            <p slot="append" style="text-align:center; line-height:30px;" v-loading="loading" v-if="isShowLoadMore">
              <a href="javascript:;"  @click="getMoreData()">加载更多</a>
            </p>
          </el-table>


          <!--<el-form  label-width="120px" style="margin-top: 20px" :inline="true" :model="importModel" class="demo-form-inline ">-->
            <!--<el-form-item label="新建语料集：" >-->
              <!--<el-input  size="small" v-model="importModel.importDatasetName" placeholder="输入语料集名字" :disabled="importModel.importDatasetId>0"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-form>-->

          <el-form  label-width="120px" :inline="true" :model="importModel" style="margin-top: 20px" class="demo-form-inline">
            <el-form-item label="输入语料条数：">
              <el-input  size="small"  v-model="importModel.importNumber" placeholder="输入语料条数"></el-input>
            </el-form-item>

            <el-form-item label="">
              <el-form-item label="语料字数设置：" >
                <el-input size="small" v-model="importModel.importContentMinLength" placeholder="输入语料条数"></el-input>
              </el-form-item>
              <span>以上</span>
            </el-form-item>

          </el-form>

        </div>

        <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="importClick()">确 定</el-button>
        </span>

      </el-dialog>

    </el-row>

  </div>

</template>

<script>

  import appHeader from '../../components/AppHeader';
  import {format_Date} from '../../utils/commonUtil';
  import {informationService} from '../../service/index';
  import {mapActions, mapState} from 'vuex';

    export default {
        name: "corpusimport",

        data() {

          return {

            formInline: {
              user: '',
              region: ''
            },

            corpusfromArr:[
              {
                name:'全部',
                id:'ALL'
              },
              {
                name:'新闻',
                id:'NEWS'
              }, {
                name:'新闻标题',
                id:'NEWS_TITLE'
              },
              {
                name:'研报全文',
                id:'RESEARCH_REPORT'
              },
              {
                name:'研报摘要',
                id:'RESEARCH_REPORT_SUMMARY'
              }
            ],
            corpustypeArr:[
             {
                name:'段落',
                id:'PARAGRAPH'
              }, {
                name:'句子',
                id:'SENTENCE'
              },

            ],
            sourcelistData:[],
            totalCount:0,
            showListLoading: false,
            dialogVisible:false,
            isShowLoadMore: false, //是否显示“加载更多”
            btnChangeEnable:true, //导入按钮禁用
            listData: [],
            importModel:{
              importDatasetId:'',
              importDatasetName:'',
              importNumber:10000,
              importContentMinLength:1
            },
            selectedId:'',
            queryModel: {
              importType:'1',
              highlight:true,
              cp: 1,
              ps: 10
            },
            corpusModel: {
              direction:'DESC',
              page: 1,
              size: 10
            },
          }
        },
      methods:{

        //选择标签
        clickitem(item){

          this.importModel.importDatasetId = item.id;
          this.queryModel.importType = item.importType;

        },
        timeSortingClick(){

          this.queryModel.orderBy = 'publishAt';

          this.queryModel.direction =  this.queryModel.direction == 'DESC'?'ASC':'DESC';

          this.getList();

        },
        //请求语料集
        async getCorpusList(){

          let result = await informationService.querycorpus(this.corpusModel);

          if (result.message.code == 0) {
            let temp = result.data.list;
            temp.forEach((item, index) => {
              // debugger
              if (item.humanLabelTypeNumber) {

                item.humanLabelTypeNumberArr = JSON.parse(item.humanLabelTypeNumber)

              }

            });

            this.sourcelistData = temp;
            this.sourcelistData.push({name: '新建语料集',id:''})

            this.isShowLoadMore = this.totalPage > this.queryModel.cp;
          }
        },
        //搜索
        async getList () {

          if ((this.queryModel.contentType == undefined ||this.queryModel.searchName == undefined) && this.queryModel.searchName != 'NEWS_TITLE') {

            this.$message({
              showClose: true,
              message: '请选择查询条件',
              type: 'error'
            });
            return;
          }

          this.showListLoading=true;

          if (this.queryModel.searchName == 'NEWS_TITLE') {

            this.$set(this.queryModel,'contentType','OTHER')
          }

          let result = await informationService.getCorpusSource(this.queryModel);

          if (this.queryModel.searchName == 'NEWS_TITLE'){

             this.queryModel.contentType = undefined;
          }

          if (result.message.code == 0) {
            this.showListLoading=false;
            this.btnChangeEnable = false;
            this.listData = result.data.list;
            this.totalCount = result.data.totalCount;
            this.queryModel.cp = result.data.currentPage;
          }
        },
        //点击分页
        pageChange(page) {
          this.showListLoading=true;
          this.queryModel.cp = page;
          this.getList();
        },
        //加载更多
        async getMoreData() {
          debugger
        },
        //导入数据集
        async importClick(){

          // if (this.queryModel.keywords == undefined ||this.queryModel.keywords == '') {
          //
          //   this.$message({
          //     showClose: true,
          //     message: '请输入关键词',
          //     type: 'error'
          //   });
          //   return;
          // }

          if (this.importModel.importNumber < 1) {

            this.$message({
              showClose: true,
              message: '导入语料数量不能小于1',
              type: 'error'
            });
            return;
          }

          if ((this.importModel.importDatasetId ==undefined || this.importModel.importDatasetId == '') && (this.importModel.importDatasetName == '' || this.importModel.importDatasetName == undefined)) {

            this.$message({
              showClose: true,
              message: '必须选择语料集或者新建语料集',
              type: 'error'
            });
            return;
          }

          this.importModel.contentType = this.queryModel.searchName == 'NEWS_TITLE'?'OTHER':this.queryModel.contentType;
          this.importModel.searchName = this.queryModel.searchName;
          this.importModel.keywords = this.queryModel.keywords;
          this.importModel.importType = this.queryModel.importType;
          this.importModel.orderBy = this.queryModel.orderBy;
          this.importModel.direction = this.queryModel.direction;

          const loading = this.$loading({
            lock: true,
            text: '正在导入语料，请稍后...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          let result = await  informationService.importCorpusSource(this.$qs.stringify(this.importModel));

          var  message = '导入成功';

          if (result.message.code != 0) {

             message = '导入失败';
          }
          this.$message({
            showClose: true,
            message: message,
            type: 'success'
          });

          this.dialogVisible = false;
          loading.close();
          this.importModel.importDatasetName = '';
          this.importModel.importContentMinLength = '1';
          this.importModel.importNumber = '10000',
          this.getCorpusList();

        },
        format_Time(value) {
          let date = new Date(value);
          return (date && date != 'Invalid Date') ? format_Date(date) : '--';
        }
      },

      created: function () {
        this.taskInfo= JSON.parse(sessionStorage.getItem("taskInfo"));
        // this.queryModel.taskId=this.taskInfo.taskId;
        this.corpusModel.taskId=this.taskInfo.taskId;
        this.importModel.importTaskId=this.taskInfo.taskId;
        this.getCorpusList();

      }
    }
</script>

<style>

  .redItem .el-form-item__label{

    color: #F01819;
  }

  .inputColor .el-input__inner{

    border:1px solid #F01819;
  }

</style>
