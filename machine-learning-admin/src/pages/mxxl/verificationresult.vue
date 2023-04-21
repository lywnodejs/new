<template>
  <div>

    <el-row type="flex" justify="space-around" class="row-train-status">
      <el-col align="left" class="train-status-nostart" v-if="TrainStateModel.trainStatus=='0'">
        <span class="span-train-status">未开始</span>
      </el-col>
      <el-col align="left" class="train-status-during" v-else-if="TrainStateModel.trainStatus=='1'">
        <span class="span-train-status">训练中···</span>
      </el-col>
      <el-col align="left" class="train-status-success" v-else-if="TrainStateModel.trainStatus=='2'">
        <span class="span-train-status">训练完成</span>
      </el-col>
      <el-col align="left" class="train-status-failure" v-else-if="TrainStateModel.trainStatus=='-1'">
        <span class="span-train-status">信息故障</span>
      </el-col>
      <el-col align="left" class="train-status-nostart" v-else>

      </el-col>
    </el-row>

    <el-tabs  v-model="activeName"  @tab-click="handleClick" style="background-color: #ffffff;height: 40px;line-height: 40px;padding-left: 20px">
      <el-tab-pane  v-for="item in ShowLabelTypeArr" :label="item.name" :name="item.id" :key="item.id">
      </el-tab-pane>
    </el-tabs>


    <el-card class="box-card" style="margin: 20px" shadow="never">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold">模型衡量指标</span>
        <el-button v-if="!this.taskTypeModel.isShowConfusionList" style="margin-left: 20px" type="primary" size="mini" @click="goPage2()">错误分析修改</el-button>
      </div>

      <!--老接口字段 verifyAccuracy、verifyRecall、modelAddress-->
      <!--新接口字段  accuracy、recall-->
      <!--状态和模型地址用老接口，只有召回率和准确率用新接口-->
      <el-row v-if="this.showLastTimeModel">
        <el-col :span="2"><span>上次模型：</span></el-col>
        <el-col :span="3"><span>准确率：<span v-if="TrainStateModel.trainStatus=='2'">{{LastTimeResult.verifyAccuracy}}</span><span v-else>--</span></span></el-col>
        <el-col :span="3"><span>召回率：<span v-if="TrainStateModel.trainStatus=='2'">{{LastTimeResult.verifyRecall}}</span><span v-else>--</span></span></el-col>
        <el-col :span="8"><span>模型路径：<span v-if="TrainStateModel.trainStatus=='2'">{{LastTimeResult.modelAddress }} </span><span v-else>--</span></span></el-col>
      </el-row>

      <el-row v-if="this.showLastTimeModel && this.ShowLabelTypeArr.length >1">
        <el-col :span="2"><span>{{this.currentName}}</span></el-col>
        <el-col :span="3"><span>准确率：<span v-if="TrainStateModel.trainStatus=='2'">{{LastTimeResult.accuracy}}</span><span v-else>--</span></span></el-col>
        <el-col :span="3"><span>召回率：<span v-if="TrainStateModel.trainStatus=='2'">{{LastTimeResult.recall}}</span><span v-else>--</span></span></el-col>
      </el-row>

      <el-row style="margin-top: 8px">
        <el-col :span="2"><span>本次模型：</span></el-col>
        <el-col :span="3"><span>准确率：<span v-if="TrainStateModel.trainStatus=='2'">{{TrainStateModel.verifyAccuracy}}</span><span v-else>--</span></span></el-col>
        <el-col :span="3"><span>召回率：<span v-if="TrainStateModel.trainStatus=='2'">{{TrainStateModel.verifyRecall}}</span><span v-else>--</span></span></el-col>
        <el-col :span="8"><span>模型路径：<span v-if="TrainStateModel.trainStatus=='2'">{{TrainStateModel.modelAddress}} </span><span v-else>--</span></span></el-col>
      </el-row>
      <el-row v-if="this.ShowLabelTypeArr.length >1">
        <el-col :span="2"><span>{{this.currentName}}</span></el-col>
        <el-col :span="3"><span>准确率：<span v-if="TrainStateModel.trainStatus=='2'">{{TrainStateModel.accuracy}}</span><span v-else>--</span></span></el-col>
        <el-col :span="3"><span>召回率：<span v-if="TrainStateModel.trainStatus=='2'">{{TrainStateModel.recall}}</span><span v-else>--</span></span></el-col>
      </el-row>


      <div class="line" style="margin-top: 20px"></div>

      <el-row v-if="isHiddenNer" class="neymar" >
        <el-tabs type="border-card" style="margin-top: 20px;min-height: 300px;-webkit-box-shadow:none;box-shadow:none">
          <el-tab-pane label="分类报告">
            <!--<el-input  type="textarea"  :rows="10"  placeholder=""  v-model="TrainResultModel.categoryReport"></el-input>-->
            <p class="resultOver" v-html="TrainResultModel.categoryReport"></p>
          </el-tab-pane>
          <el-tab-pane label="混淆矩阵">
            <!--<el-input  type="textarea"  :rows="10"  placeholder=""  v-model="TrainResultModel.confusionMatrix"></el-input>-->
            <p class="resultOver" v-html="TrainResultModel.confusionMatrix"></p>
          </el-tab-pane>
        </el-tabs>
      </el-row>

    </el-card>

    <el-row style="padding-left: 20px; padding-right: 20px;padding-bottom: 20px" v-if="isHiddenNer">
    <el-card class="box-card titlebold" shadow="never" v-if="this.taskTypeModel.isShowConfusionList">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold">标签混淆排行</span>
        <el-button style="margin-left: 20px" type="primary" size="mini" @click="goPage2()">错误分析修改</el-button>
      </div>
      <el-table
        :data="listData"
        v-loading="showListLoading"
        style="width: 100%;" @sort-change="getOrder">
        <el-table-column type="index" :index="indexFilter" width="200" label="序号"></el-table-column>
        <el-table-column width="" label="人工标注" prop="humanLabel" sortable="custom"></el-table-column>
        <el-table-column width="" label="机器预测" prop="robotLabel" sortable="custom"></el-table-column>
        <el-table-column label="混淆语料条数" prop="count" align="left" sortable="custom">
          <template slot-scope="scope">
            <el-row type="flex">
              <el-button type="text" @click="goCheckPage('/erroranalysis?index=verificationresult',scope.row)">{{scope.row.count}}</el-button>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column width="" label="标签语料对比查看" resizeable="false">
          <template slot-scope="scope">
            <el-row type="flex">
              <el-button type="primary" size="small" @click="goCheckPage('/checkconfusion?index=verificationresult',scope.row)">查看</el-button>
            </el-row>
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
                         @current-change="pageChange"
          >
          </el-pagination>
        </el-col>
      </el-row>

    </el-card>
      </el-row>


    <el-card class="box-card titlebold" shadow="never" v-if="!this.isHiddenNer && TrainStateModel.trainStatus=='2'" style="margin:0 20px">
      <el-row>

        <el-table
          :data="labelsList"
          v-loading="showListLoading"
          style="width: 100%;">
<!--          <el-table-column width="" prop="labels[0].name" label="NER"></el-table-column>-->
          <el-table-column width=""  prop="" label="NER">
            <template slot-scope="scope">
              <el-link type="primary" @click="goPage2(scope.row)">{{scope.row.labels[0].name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column width="" prop="" label="准确率">
            <template slot-scope="scope">
              {{scope.row.accuracy.toFixed(2)}}
            </template>
          </el-table-column>

          <el-table-column width="" prop="" label="召回率">
            <template slot-scope="scope">
              {{scope.row.recall.toFixed(2)}}
            </template>
          </el-table-column>

          <el-table-column width="" prop="f1" label="F1">
            <template slot-scope="scope">
              {{scope.row.f1.toFixed(2)}}
            </template>
          </el-table-column>
        </el-table
        >

        <el-row
          type="flex" justify="center" class="zoom-pagi" style="margin-top: 20px">
          <el-col type="flex" justify="center">
            <el-pagination align="center"
                           :current-page.sync="queryCompareModel.cp"
                           :page-size="queryCompareModel.ps"
                           :total="queryCompareModel.totalCount"
                           class="pagination"
                           layout="total, prev, pager, next, jumper"
                           @current-change="comparePageChange"
            >
            </el-pagination>
          </el-col>
        </el-row>

      </el-row>
    </el-card>


  </div>
</template>

<script>
  import appHeader from '../../components/AppHeader';
  import {informationService} from '../../service/index';
  import {mapState,mapActions} from 'vuex';
  export default {
    name: "trainresult",
    data() {
      return {
        queryCompareModel:{
          direction:'DESC',
          cp: 1,
          ps: 10,
          totalCount:0
        },
        labelsList:[],
        currentName:'',
        isHiddenNer:false,
        activeName: '',//默认展示的nav标签
        taskTypeArray:[],//任务类型数组
        showLastTimeModel:false,//是否显示上次模型，从模型管理进来的不显示
        showListLoading:false,
        taskInfo:{},
        TrainModel:{
          orderBy:'trainAt',
          direction:'DESC'
        },
        ResultModel:{
          resultType:'VERIFY'
        },
        listData:[
          {
            title:'选股票',
            topAt:'条件选股',
            num1:'24'
          }
        ],
        LastTimeResult:{},
        TrainStateModel:{},
        TrainResultModel:{},
        queryModel: {
          cp: 1,
          ps: 10
        },
        taskTypeQueryParam:{
          taskId:'',
          ids:''
        },
        taskTypeModel:{
          name:'',
          isShowConfusionList: true
        },
        totalCount: 0,
        labelType:'',
        labelTypeId:'',
        ShowLabelTypeArr:[],
        timer: null,
        labelTypeModel:{
          ps:10000
        },
      }
    },
    components: {
      appHeader
    },
    computed: {
      ...mapState([
        'parameter'
      ]),

    },
    watch: {

    },
    methods: {

      getOrder(params){

        if (params.prop == 'humanLabel'){
          this.queryModel.orderBy = 'humanLabelId';
        }
        if (params.prop == 'robotLabel'){
          this.queryModel.orderBy = 'robotLabelId';
        }
        if (params.prop == 'count'){
          this.queryModel.orderBy = 'totalNumber';
        }
        if (params.order == 'ascending') {

          this.queryModel.direction = 'ASC';

        }else  if (params.order == 'descending') {

          this.queryModel.direction = 'DESC';

        }else{
          this.queryModel.direction = '';
        }

        this.getconfusiongroupData();
      },

      handleClick (){

        this.TrainModel.labelTypeIds = this.activeName;
        this.requestModelResult();

        this.TrainStateModel.accuracy = '--';
        this.TrainStateModel.recall = '--';
        this.TrainResultModel={};
        this.LastTimeResult.accuracy = '--';
        this.LastTimeResult.recall = '--';

      },

      async getLabelTypeArr() {
        this.labelTypeModel.taskId =this.TrainModel.taskId;
        let result = await informationService.labelClasses(this.labelTypeModel);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          tempArr.forEach((item, index) => {
            let obj = {
              taggingType: item.taggingType,
              name: item.name,
              id: item.id.toString()
            };
            this.ShowLabelTypeArr.push(obj);
          });
          this.activeName =  this.ShowLabelTypeArr[0].id.toString();


          this.TrainState();
        }
      },
      indexFilter(index) {
        return index + 10 * (this.queryModel.cp - 1) + 1;
      },
      //点击分页
      pageChange(page) {
        this.queryModel.cp = page;
        this.getconfusiongroupData();
      },
      goPage(page) {
        this.$router.push({path: page
        });
      },
      goPage2(data) {
        console.log(this.activeName);
        var confusionLabels = [];

        if (data){
          confusionLabels = data.labelIds.split(',');
        }

        let type;
        let page='';
        this.ShowLabelTypeArr.forEach((item,index)=>{
          if(item.id == this.TrainResultModel.labelTypeIds){
            this.labelType=item.taggingType;
            this.labelTypeId=item.id
          }
          if(item.id===this.activeName){
            type=item.taggingType
          }
        });
        if (type === 'NER' || type === 'NER_LABEL_1') {
          page = '/nererror?index=verificationresult'
        } else {
          page = '/erroranalysis?index=verificationresult'
        }
        this.$router.push({path: page,
          query: {
            confusionLabels:confusionLabels,
            modelTrainId:this.TrainStateModel.id,
            formUrl:'VERIFY',
            labelType:this.labelType,
            labelTypeId:this.labelTypeId
          }
        });
      },

      //点击分页
      comparePageChange(page) {
        this.queryCompareModel.cp = page;
        this.getLabelResult();
      },

      goCheckPage(page,row) {
        this.ShowLabelTypeArr.forEach((item,index)=>{
          if(item.id == this.TrainResultModel.labelTypeIds){
            this.labelType=item.taggingType;
            this.labelTypeId=item.id
          }
        });
        this.$router.push({path: page,
          query: {
            modelTrainId:this.TrainStateModel.id,
            humanLabelId:row.humanLabelId,
            robotLabelId:row.robotLabelId,
            humanLabel:row.humanLabel,
            robotLabel:row.robotLabel,
            formUrl:'VERIFY',
            labelType:this.labelType,
            labelTypeId:this.labelTypeId
          }
        });
      },


      //获取训练状态，取第一条的labelTypeIds作为参数再请求一次这个接口，得到的前两条数据为本次和上次
      async firstRequest(){

        let result = await informationService.getResultOne(this.TrainModel);

        if (result.message.code == 0) {
          let arr=result.data.list;
          if(arr.length>0){
            this.TrainModel.labelTypeIds = result.data.list[0].model.labelTypeIds;
            //根据labelTypeIds去请求所有的任务标签
            this.labelTypeModel.ids =  this.TrainModel.labelTypeIds;
            this.getLabelTypeArr()
          }
        }
      },
    //  获取训练状态
      async TrainState() {
        console.log(" TrainState  == " + this.TrainModel.labelTypeIds);

        let result = await informationService.getResultOne(this.TrainModel);

        //用这个接口请求回来具体的id（本地id  和上次id），然后去result接口 （TrainResult() 获取训练结果）请求具体的准确率、分类报告等
        if (result.message.code == 0) {
          let arr=result.data.list;
          if(arr.length>0){

            this.TrainStateModel=result.data.list[0];
            this.ResultModel.modelTrainId=this.TrainStateModel.id;

            if(arr.length>1){
              this.LastTimeResult=result.data.list[1];
              this.ResultModel.modelTrainId=this.ResultModel.modelTrainId + ',' + this.LastTimeResult.id;
            }

            this.requestModelResult();
          }
        }
      },

      //每次切换标签的时候直接请求  model/result 接口
       requestModelResult(){

        this.queryModel.labelTypeId = this.activeName;

        this.ShowLabelTypeArr.forEach((item,index)=>{
          if(item.id == this.activeName){

            this.currentName = item.name;
            this.taskTypeModel = item;
            this.taskTypeModel.isShowConfusionList = this.taskTypeModel.taggingType == 'LABEL_1';
            this.isHiddenNer = item.taggingType != 'NER';
          }
        });

        //请求单标签混淆
        this.getconfusiongroupData();
        this.TrainResult();

         //如果是new模型，展示具体的子标签的准确率召回率
         if (!this.isHiddenNer){
           this.getLabelResult();
         }
      },

      //标签Result
      async getLabelResult() {

        this.queryCompareModel.modelTrainId = this.TrainStateModel.id;
        this.queryCompareModel.labelTypeIds = this.queryModel.labelTypeId;
        this.queryCompareModel.resultType = 'VERIFY';

        let result = await informationService.compareModelGroup(this.queryCompareModel);

        if (result.message.code == 0) {

          this.labelsList = result.data.list;
          this.queryCompareModel.totalCount = result.data.totalCount;
          this.queryCompareModel.cp = result.data.currentPage;
        }

        // debugger
      },

      // 获取任务类型
      async getTaskType() {
        let result = await informationService.querylabelcategory(this.taskTypeQueryParam);
        if (result.message.code == 0) {
          let arr= result.data.list;
          if(arr.length>0){
            this.taskTypeModel = arr[0];
            this.taskTypeModel.isShowConfusionList = this.taskTypeModel.taggingType == 'LABEL_1';
            if (this.taskTypeModel.isShowConfusionList) {
              this.getconfusiongroupData();
            }
          }
        }
      },
      //  获取训练结果(召回率等字段加入了这个接口，可以以这个接口为准)
      async TrainResult() {

        this.ResultModel.labelTypeIds = this.activeName;
        let result = await informationService.getModelResult(this.ResultModel);

        // 准确率 accuracy    召回率recall
        this.TrainResultModel = {}

        if (result.message.code == 0) {
          let arr=result.data.list;

          if(arr.length>0){

            arr.forEach((item,index)=>{

              //把接口里的召回率、准确率再存入到 model接口返回的数据中
              if (this.TrainStateModel.id == item.modelTrainId) {

                  // this.TrainStateModel.accuracy = item.accuracy;
                  // this.TrainStateModel.recall = item.recall;

                this.$set(this.TrainStateModel,'accuracy',item.accuracy)
                this.$set(this.TrainStateModel,'recall',item.recall)

                this.TrainResultModel=item;


                  console.log('本次 === ' + this.TrainStateModel.id + ' verifyAccuracy=' +  this.TrainStateModel.verifyAccuracy + 'verifyRecall=' +  this.TrainStateModel.verifyRecall);
                  console.log('本次 === ' + this.TrainStateModel.id + ' accuracy=' + item.accuracy + 'recall=' + item.recall);
                  console.log('本次 === ' + this.TrainStateModel.id + ' accuracy=' + this.TrainStateModel.accuracy + 'recall=' + this.TrainStateModel.recall);


              }
              if (this.LastTimeResult.id == item.modelTrainId) {

                  // this.LastTimeResult.accuracy = item.accuracy;
                  // this.LastTimeResult.recall = item.recall;

                this.$set(this.LastTimeResult,'accuracy',item.accuracy)
                this.$set(this.LastTimeResult,'recall',item.recall)


                  console.log('上次 === ' + this.LastTimeResult.id + ' verifyAccuracy=' +  this.LastTimeResult.verifyAccuracy + 'verifyRecall=' +  this.LastTimeResult.verifyRecall);
                  console.log('上次 === ' + this.LastTimeResult.id + ' accuracy=' + item.accuracy + 'recall=' + item.recall);
                  console.log('上次 === ' + this.LastTimeResult.id + ' accuracy=' +  this.LastTimeResult.accuracy + 'recall=' +  this.LastTimeResult.recall);

              }
            });
          }
        }
      },
      //  混淆语料分组统计
      async getconfusiongroupData() {

        if (this.taskTypeModel.isShowConfusionList){

          //单标签混淆语料分组统计
          this.queryModel.modelTrainId=this.TrainStateModel.id;
          this.queryModel.resultType='VERIFY';
          // this.queryModel.labelTypeId = this.TrainModel.labelTypeIds;

          let result = await informationService.getLabelConfusionGroup(this.queryModel);


          if (result.message.code == 0) {
            this.listData=result.data.list;
            this.totalCount = result.data.totalCount;
            this.queryModel.cp = result.data.currentPage;
          }
        }
      }
    },
    mounted: function () {
    },
    created: function () {
      this.showLastTimeModel = this.$route.query.fromPage != "modelmanage";
      if (this.$route.query.modelTrainId) {
        this.TrainModel.ids=this.$route.query.modelTrainId
      }
      console.log(this.parameter);
      this.taskInfo= JSON.parse(sessionStorage.getItem("taskInfo"));
      this.TrainModel.taskId=this.taskInfo.taskId;
      this.ResultModel.taskId=this.taskInfo.taskId;
      this.taskTypeQueryParam.taskId=this.taskInfo.taskId;
      // this.getLabelTypeArr();
      // this.TrainState();
      this.firstRequest();

    }
  }
</script>

<style scoped>
  .train-status-during {
    background-color: #1991EB;
  }
  .train-status-nostart {
    background-color: #909399;
  }
  .train-status-success {
    background-color: #3EB04D;
  }
  .train-status-failure {
    background-color: #ED2F36;
  }
  .row-train-status {
    height: 60px;
    line-height: 60px;
  }
  .span-train-status {
    padding-left: 30px;
    font-size: 18px;
    position: relative;
    color: #FFFFFF;
    margin-right: 20px;
  }


  .line{
    height: 1px;
    width: 100%;
    background: rgb(228,231,237);
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    display: inline-block;
    padding-bottom: 15px;
  }

</style>
