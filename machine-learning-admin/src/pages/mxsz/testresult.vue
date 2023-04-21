<template>
  <div>

    <el-row type="flex" justify="space-around" class="row-train-status" v-model="TestStatusModel">
      <el-col align="left" :class="TestStatusModel.statusStyle">
        <span class="span-train-status">{{TestStatusModel.statusName}}</span>
      </el-col>
    </el-row>

    <el-tabs  v-model="activeName"  @tab-click="handleClick" style="background-color: #ffffff;height: 40px;line-height: 40px;padding-left: 20px">
      <el-tab-pane  v-for="item in ShowLabelTypeArr" :label="item.name" :name="item.id" :key="item.id">
      </el-tab-pane>
    </el-tabs>

    <el-card class="box-card titlebold" style="margin: 20px" shadow="never">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold">模型衡量指标</span>
        <el-button v-if="!this.taskTypeModel.isShowConfusionList" style="margin-left: 20px" type="primary" size="mini" @click="goPage2()">错误分析修改</el-button>
      </div>

      <!--testAccuracy-->
      <!--testRecall-->
      <el-row v-if="this.isShowCompareList">
        <el-col :span="2"><span>线上模型：</span></el-col>
        <el-col :span="3"><span>准确率：<span v-if="this.TestStatusModel.testStatus == '2' && this.TestStatusModel.onLineTestStatus == '2'">{{OnLineTestStateModel.testAccuracy}}</span><span v-else>--</span></span></el-col>
        <el-col :span="3"><span>召回率：<span v-if="this.TestStatusModel.testStatus == '2' && this.TestStatusModel.onLineTestStatus == '2'">{{OnLineTestStateModel.testRecall}}</span><span v-else>--</span></span></el-col>
        <el-col :span="8"><span>模型路径：<span v-if="this.TestStatusModel.testStatus == '2' && this.TestStatusModel.onLineTestStatus == '2'">{{OnLineTestStateModel.modelAddress }}</span><span v-else>--</span></span></el-col>
      </el-row>
      <el-row v-if="this.ShowLabelTypeArr.length >1  &&  (this.isShowCompareList && this.showLastTimeModel)">
        <el-col :span="2"><span>{{this.currentName}}</span></el-col>
        <el-col :span="3"><span>准确率：<span v-if="OnLineTestStateModel.accuracy>=0">{{OnLineTestStateModel.accuracy}}</span><span v-else>--</span></span></el-col>
        <el-col :span="3"><span>召回率：<span v-if="OnLineTestStateModel.recall>=0">{{OnLineTestStateModel.recall}}</span><span v-else>--</span></span></el-col>
      </el-row>

      <el-row v-if="!this.isShowCompareList && this.showLastTimeModel">
        <el-col :span="2"><span>上次模型：</span></el-col>
        <el-col :span="3"><span>准确率：<span v-if="this.TestStatusModel.testStatus == '2' && this.TestStatusModel.onLineTestStatus == '2'">{{LastTimeTestStateModel.testAccuracy}}</span><span v-else>--</span></span></el-col>
        <el-col :span="3"><span>召回率：<span v-if="this.TestStatusModel.testStatus == '2' && this.TestStatusModel.onLineTestStatus == '2'">{{LastTimeTestStateModel.testRecall}}</span><span v-else>--</span></span></el-col>
        <el-col :span="8"><span>模型路径：<span v-if="this.TestStatusModel.testStatus == '2' && this.TestStatusModel.onLineTestStatus == '2'">{{LastTimeTestStateModel.modelAddress }}</span><span v-else>--</span></span></el-col>
      </el-row>
      <el-row v-if="this.ShowLabelTypeArr.length >1  &&  (!this.isShowCompareList && this.showLastTimeModel)">
        <el-col :span="2"><span>{{this.currentName}}</span></el-col>
        <el-col :span="3"><span>准确率：<span v-if="LastTimeTestStateModel.accuracy>=0">{{LastTimeTestStateModel.accuracy}}</span><span v-else>--</span></span></el-col>
        <el-col :span="3"><span>召回率：<span v-if="LastTimeTestStateModel.recall>=0">{{LastTimeTestStateModel.recall}}</span><span v-else>--</span></span></el-col>
      </el-row>


      <el-row style="margin-top: 8px">
        <el-col :span="2"><span>本次模型：</span></el-col>
        <el-col :span="3"><span>准确率：<span v-if="this.TestStatusModel.testStatus == '2' && this.TestStatusModel.onLineTestStatus == '2'">{{TestStateModel.testAccuracy}}</span><span v-else>--</span></span></el-col>
        <el-col :span="3"><span>召回率：<span v-if="this.TestStatusModel.testStatus == '2' && this.TestStatusModel.onLineTestStatus == '2'">{{TestStateModel.testRecall}}</span><span v-else>--</span></span></el-col>
        <el-col :span="8"><span>模型路径：<span v-if="this.TestStatusModel.testStatus == '2' && this.TestStatusModel.onLineTestStatus == '2'">{{TestStateModel.modelAddress }}</span><span v-else>--</span></span></el-col>
      </el-row>
      <el-row  v-if="this.ShowLabelTypeArr.length >1">
        <el-col :span="2"><span>{{this.currentName}}</span></el-col>
        <el-col :span="3"><span>准确率：<span v-if="TestStateModel.accuracy>=0">{{TestStateModel.accuracy}}</span><span v-else>--</span></span></el-col>
        <el-col :span="3"><span>召回率：<span v-if="TestStateModel.recall>=0">{{TestStateModel.recall}}</span><span v-else>--</span></span></el-col>
      </el-row>
      <div class="line" style="margin-top: 20px"></div>
      <el-row style="padding-top: 20px; padding-bottom: 10px" v-if="this.isShowCompareList">
      <!--<el-row style="padding-top: 20px; padding-bottom: 10px" v-if="this.isShowCompareList && this.TestStatusModel.testStatus == '2' && this.TestStatusModel.onLineTestStatus == '2'">-->
        <span style="font-weight: bold">模型对比情况如下</span>
      </el-row>
      <!--v-if="this.taskTypeModel.isShowConfusionList && this.isShowCompareList && this.showLastTimeModel"-->
      <el-table
        v-if="this.isShowCompareList"
        :data="compareModelData"
        v-loading="showListLoading"
        style="width: 100%;">
        <el-table-column width="" prop="labels[0].name" label="分类"></el-table-column>
        <el-table-column width="" prop="" label="准确率">
          <template slot-scope="scope">
            {{scope.row.accuracy.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column width="" prop="" label="跟线上模型对比">
          <template slot-scope="scope">
            {{showCompareAccuracy(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column width="" prop="" label="召回率">
          <template slot-scope="scope">
            {{scope.row.recall.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column width="" prop="" label="跟线上模型对比">
          <template slot-scope="scope">
            {{showCompareRecall(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column width="" prop="f1" label="F1">
          <template slot-scope="scope">
            {{scope.row.f1.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column width="" prop="" label="跟线上模型对比">
          <template slot-scope="scope">
            {{showCompareF1(scope.row)}}
          </template>
        </el-table-column>
      </el-table>
      <el-row
        v-if="this.taskTypeModel.isShowConfusionList && this.isShowCompareList && this.showLastTimeModel"
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

      <el-row class="neymar" v-if="isHiddenNer && this.TestStatusModel.testStatus == '2' && this.TestStatusModel.onLineTestStatus == '2'" >
        <el-tabs type="border-card" style="margin-top: 20px;min-height: 300px;-webkit-box-shadow:none;box-shadow:none">
          <el-tab-pane label="分类报告">
            <!--<el-input  type="textarea"  :rows="10"  placeholder=""  v-model="TrainResultModel.categoryReport"></el-input>-->
            <p class="resultOver"  v-html="TrainResultModel.categoryReport"></p>
            <!--<p style="overflow: auto" v-html="srrr"></p>-->
          </el-tab-pane>
          <el-tab-pane label="混淆矩阵">
            <!--<el-input  type="textarea"  :rows="10"  placeholder=""  v-model="TrainResultModel.confusionMatrix"></el-input>-->
            <p class="resultOver" v-html="TrainResultModel.confusionMatrix"></p>
          </el-tab-pane>
        </el-tabs>
      </el-row>

    </el-card>

    <el-card class="box-card titlebold" style="margin: 20px" shadow="never" v-if="this.taskTypeModel.isShowConfusionList && isHiddenNer">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold">标签混淆排行</span>
        <el-button style="margin-left: 20px" type="primary" size="mini" @click="goPage2()">错误分析修改</el-button>
      </div>
      <el-table class="titlebold" empty-text="暂无数据"
        :data="listData"
        v-loading="showListLoading" v-if="this.TestStatusModel.testStatus == '2' && this.TestStatusModel.onLineTestStatus == '2'"
        style="width: 100%;"  @sort-change="getOrder" >
        <el-table-column type="index" :index="indexFilter" width="200" label="序号"></el-table-column>
        <el-table-column width="" label="人工标注" prop="humanLabel" sortable="custom"></el-table-column>
        <el-table-column width="" label="机器预测" prop="robotLabel" sortable="custom"></el-table-column>
        <el-table-column label="混淆语料条数" prop="count" align="left" sortable="custom">
          <template slot-scope="scope">
            <el-row type="flex">
              <el-button type="text" @click="goCheckPage('/erroranalysis?index=testresult',scope.row)">{{scope.row.count}}</el-button>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column width="" label="标签语料对比查看" resizeable="false">
          <template slot-scope="scope">
            <el-row type="flex">
              <el-button type="primary" size="small" @click="goCheckPage('/checkconfusion?index=testresult',scope.row)">查看</el-button>
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
        currentName:'',
        isHiddenNer:false,
        activeName:'',
        TestStatusModel:{ //测试状态Model
          testStatus: '', //本次模型测试状态值
          onLineTestStatus: '', //线上模型测试状态值
          statusName:'', //显示的状态名称
          statusStyle:'train-status-nostart' //状态栏的背景颜色
        },
        showLastTimeModel:false,//是否显示上次模型，从模型管理进来的不显示
        showListLoading:false,
        taskInfo:{},
        QueryTestStateModel:{ //请求测试状态的参数
          orderBy:'testAt',
          direction:'DESC'
        },
        TestStateModel:{}, //本次测试状态结果

        LastTimeTestStateModel:{}, //上次测试状态结果
        OnLineTestStateModel:{}, //线上测试状态结果
        ResultModel:{
          resultType:'TEST'
        },
        listData:[
          {
            title:'选股票',
            topAt:'条件选股',
            num1:'24'
          }
        ],
        TrainResultModel:{}, //分类报告和混淆矩阵model
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
          isShowConfusionList: true, //是否显示混淆排行
        },
        isShowCompareList: false, //是否显示模型对比情况
        totalCount: 0,
        timer: null,
        queryCompareModel:{
          direction:'DESC',
          cp: 1,
          ps: 10,
          totalCount:0
        },
        compareModelData:[],
        onLineCompareModelData:[],
        labelType:'',
        labelTypeId:'',
        ShowLabelTypeArr:[],
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
      'TestStatusModel.onLineTestStatus':function(){
        //当有对比模型时，需要同时判断testStatus和onLineTestStatus值，两个值都为2时，才算成功
        //当没有对比模型时，testStatus和onLineTestStatus值是一样的
        if (this.TestStatusModel.testStatus == '0'||this.TestStatusModel.onLineTestStatus == '0') {
          this.TestStatusModel.statusName = '未开始';
          this.TestStatusModel.statusStyle = 'train-status-nostart';
        } else if (this.TestStatusModel.testStatus == '1'||this.TestStatusModel.onLineTestStatus == '1') {
          this.TestStatusModel.statusName = '测试中···';
          this.TestStatusModel.statusStyle = 'train-status-during';
        } else if (this.TestStatusModel.testStatus == '2' && this.TestStatusModel.onLineTestStatus == '2') {
          this.TestStatusModel.statusName = '测试完成';
          this.TestStatusModel.statusStyle = 'train-status-success';
          clearInterval(this.timer);
        } else if (this.TestStatusModel.testStatus == '-1'||this.TestStatusModel.onLineTestStatus == '-1') {
          this.TestStatusModel.statusName = '测试失败';
          this.TestStatusModel.statusStyle = 'train-status-failure';
        } else {
          this.TestStatusModel.statusName = '';
          this.TestStatusModel.statusStyle = 'train-status-nostart';
        }
      }
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

        this.getconfusiongroup();
      },
      handleClick (){

        console.log("切换标签  == " + this.activeName);
        this.QueryTestStateModel.labelTypeIds = this.activeName;

        this.requestModelResult();

        if (this.isShowCompareList) {

          this.getOnLineTestState();
        }

      },

      //模型对比情况列表：准确率和线上对比
      showCompareAccuracy(item) {
        for (let i = 0; i < this.onLineCompareModelData.length; i++) {
          if (this.onLineCompareModelData[i].labelIds == item.labelIds) {
            return (item.accuracy - this.onLineCompareModelData[i].accuracy).toFixed(2);
          }
        }
      },
      //模型对比情况列表：召回率和线上对比
      showCompareRecall(item) {
        for (let i = 0; i < this.onLineCompareModelData.length; i++) {
          if (this.onLineCompareModelData[i].labelIds == item.labelIds) {
            return (item.recall - this.onLineCompareModelData[i].recall).toFixed(2);
          }
        }
      },
      //模型对比情况列表：f1和线上对比
      showCompareF1(item) {
        for (let i = 0; i < this.onLineCompareModelData.length; i++) {
          if (this.onLineCompareModelData[i].labelIds == item.labelIds) {
            return (item.f1 - this.onLineCompareModelData[i].f1).toFixed(2);
          }
        }
      },
      async getLabelTypeArr() {
        this.ShowLabelTypeArr.splice(0);
        this.labelTypeModel.taskId =this.QueryTestStateModel.taskId;
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
          this.currentName = this.ShowLabelTypeArr[0].name;

        }
      },
      indexFilter(index) {
        return index + 10 * (this.queryModel.cp - 1) + 1;
      },
      //点击分页
      pageChange(page) {
        this.queryModel.cp = page;
        this.getconfusiongroup()
      },
      //点击分页
      comparePageChange(page) {
        this.queryCompareModel.cp = page;
        this.getCompareModelData();
      },
      goPage2() {
        console.log(this.activeName);
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
          page = '/nererror?index=trainresult'
        } else {
          page = '/erroranalysis?index=trainresult'
        }
        this.$router.push({path: page,
          query: {
            modelTrainId:this.TestStateModel.id,
            formUrl:'TEST',
            labelType:this.labelType,
            labelTypeId:this.labelTypeId
          }
        });
      }, goPage(page) {
        this.$router.push({path: page});
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
            modelTrainId:this.TestStateModel.id,
            humanLabelId:row.humanLabelId,
            robotLabelId:row.robotLabelId,
            humanLabel:row.humanLabel,
            robotLabel:row.robotLabel,
            formUrl:'TEST',
            labelType:this.labelType,
            labelTypeId:this.labelTypeId
          }
        });
      },
      // 获取训练状态，取第一条的labelTypeIds作为参数再请求一次这个接口，得到的前两条数据为本次和上次
      // 如果有对比模型的话，需要两个模型都成功才算成功
      async getTestState() {
        let result = await informationService.getResultOne(this.QueryTestStateModel);

        if (result.message.code == 0) {
          let arr=result.data.list;
          if(arr.length>0){
            this.QueryTestStateModel.labelTypeIds = result.data.list[0].model.labelTypeIds;
            this.labelTypeModel.ids = result.data.list[0].model.labelTypeIds;

            if (this.ShowLabelTypeArr.length ==0){

              this.getLabelTypeArr();
            }

            this.getSameLabelTypeIdsTrainState();
          }
        }
      },
      async getSameLabelTypeIdsTrainState(){

        delete this.QueryTestStateModel['resultType'];
        delete this.QueryTestStateModel['ids'];
        delete this.QueryTestStateModel['modelTrainId'];
        delete this.QueryTestStateModel['ps'];
        delete this.QueryTestStateModel['cp'];
        this.QueryTestStateModel.orderBy = 'testAt';

        let result = await informationService.getResultOne(this.QueryTestStateModel);

        if (result.message.code == 0) {
          let arr=result.data.list;
          if(arr.length>0){
            //首条为本次模型数据
            this.TestStateModel=result.data.list[0];
            //不管上次是否选择了对比模型，在这里都先把testStatus和onLineTestStatus赋一样的值
            this.TestStatusModel.testStatus = this.TestStateModel.testStatus;
            // this.TestStatusModel.onLineTestStatus = this.TestStateModel.testStatus;

            //如果testCompareModelTrainId>0，说明上次选择了对比模型，需要去请求对比模型的数据，并展示模型对比情况
            this.isShowCompareList = this.TestStateModel.testCompareModelTrainId > 0;
            console.log('this.TestStateModel.testCompareModelTrainId = ' + this.TestStateModel.testCompareModelTrainId);
            this.ResultModel.modelTrainId=this.TestStateModel.id;
            console.log("刷新了~~~~" +  this.isShowCompareList);

            //本次模型成功后在请求线上模型数据
            if (this.isShowCompareList && this.TestStateModel.testStatus == '2') {

                this.getOnLineTestState();

            } else { //否则显示上次模型，即第二条数据
              this.TestStatusModel.onLineTestStatus = this.TestStateModel.testStatus;
              if (arr.length > 1) {
                this.LastTimeTestStateModel = result.data.list[1];
                this.ResultModel.modelTrainId=this.ResultModel.modelTrainId + ',' + this.LastTimeTestStateModel.id;
              }
            }
              this.requestModelResult();
          }
        }
      },

      async requestModelResult(){

        this.queryModel.labelTypeId = this.activeName;
        this.ShowLabelTypeArr.forEach((item,index)=>{
          if(item.id == this.activeName){

            this.taskTypeModel = item;
            this.taskTypeModel.isShowConfusionList = this.taskTypeModel.taggingType == 'LABEL_1';
            this.currentName = item.name;
            this.isHiddenNer = item.taggingType != 'NER';
          }
        });

        //请求单标签混淆，否则请求多标签混淆
        this.getconfusiongroup();
        this.TrainResult();


      },
      //获取所对比模型的测试状态及准确率、召回率等数据
      async getOnLineTestState() {

        this.QueryTestStateModel.ids= this.TestStateModel.testCompareModelTrainId;
        let result = await informationService.getResultOne(this.QueryTestStateModel);

        if (result.message.code == 0) {

          var arr = result.data.list;

          if(arr.length > 0){

            this.OnLineTestStateModel = arr[0];
            this.TestStatusModel.onLineTestStatus = this.OnLineTestStateModel.testStatus;

            this.QueryTestStateModel.modelTrainId= this.TestStateModel.testCompareModelTrainId;
            this.QueryTestStateModel.resultType = 'TEST';
            this.QueryTestStateModel.ps  = '10';
            this.QueryTestStateModel.cp  = '1';
            delete this.QueryTestStateModel['orderBy'];
            delete this.QueryTestStateModel['ids'];

            //再次请求新接口 召回率、准确率等
            let resultNew = await informationService.getModelResult(this.QueryTestStateModel);

            var arrNew = resultNew.data.list;

            if(arrNew.length>0){

              this.OnLineTestStateModel.accuracy = arrNew[0].accuracy;
              this.OnLineTestStateModel.recall = arrNew[0].recall;
              //到这里说明上次选择了对比模型，更新onLineTestStatus的值
              this.TestStatusModel.onLineTestStatus = this.OnLineTestStateModel.testStatus;
              this.getCompareModelData();
            }
          }
        }
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
              this.getconfusiongroup();
            }
          }
        }
      },
      //  获取训练结果：分类报告、混淆矩阵
      async TrainResult() {

        this.ResultModel.labelTypeIds = this.activeName;
        let result = await informationService.getModelResult(this.ResultModel);

        if (result.message.code == 0) {
          let arr=result.data.list;

          if(arr.length>0){

            arr.forEach((item,index)=>{

              //把接口里的召回率、准确率再存入到 model接口返回的数据中
              if (this.TestStateModel.id == item.modelTrainId) {

                // this.TestStateModel.accuracy = item.accuracy;
                // this.TestStateModel.recall = item.recall;

                this.$set(this.TestStateModel,'accuracy',item.accuracy)
                this.$set(this.TestStateModel,'recall',item.recall)

                this.TrainResultModel=item;

              }
              if (this.LastTimeTestStateModel.id == item.modelTrainId) {

                // this.LastTimeTestStateModel.accuracy = item.accuracy;
                // this.LastTimeTestStateModel.recall = item.recall;

                this.$set(this.LastTimeTestStateModel,'accuracy',item.accuracy)
                this.$set(this.LastTimeTestStateModel,'recall',item.recall)
              }
            });

            if (!this.isShowCompareList){

                this.TestStatusModel.onLineTestStatus = this.TestStateModel.testStatus;
            }
          }
        }
      },
      //获取本次测试模型各分类详细数据（准确率、召回率、f1）
      async getCompareModelData() {

        this.queryCompareModel.modelTrainId = this.TestStateModel.id;
        this.queryCompareModel.labelTypeIds = this.activeName;
        // this.queryCompareModel.labelTypeIds = this.TestStateModel.model.labelTypeIds;

        this.queryCompareModel.resultType = 'TEST';
        let result = await informationService.compareModelGroup(this.queryCompareModel);

        if (result.message.code == 0) {

          this.compareModelData = result.data.list;
          this.queryCompareModel.totalCount = result.data.totalCount;
          this.queryCompareModel.cp = result.data.currentPage;
          this.getOnlineCompareModelData();
        }
      },
      //获取线上模型各分类详细数据（准确率、召回率、f1）
      async getOnlineCompareModelData() {
        this.queryCompareModel.modelTrainId = this.TestStateModel.testCompareModelTrainId;
        this.queryCompareModel.labelTypeIds = this.TestStateModel.model.labelTypeIds;
        this.queryCompareModel.resultType = 'TEST';
        let result = await informationService.compareModelGroup(this.queryCompareModel);
        if (result.message.code == 0) {
          this.onLineCompareModelData = result.data.list;
        }
      },
      //  混淆语料分组统计
      async getconfusiongroup() {

          this.queryModel.modelTrainId=this.TestStateModel.id;
          this.queryModel.resultType='TEST';

          //多任务需要传所有的lablesId
          // this.queryModel.labelTypeId =  this.QueryTestStateModel.labelTypeIds;

          let result = await informationService.getLabelConfusionGroup(this.queryModel);

          if (result.message.code == 0) {

              this.listData=result.data.list;
              this.totalCount = result.data.totalCount;
              this.queryModel.cp = result.data.currentPage;
          }
      }
    },
    mounted: function () {
      if(this.timer){
        clearInterval(this.timer)
      }else {
        this.timer = setInterval( () => {
          this.getTestState();
          // this.getSameLabelTypeIdsTrainState();
        }, 5000)
      }
    },
    created: function () {
      this.showLastTimeModel = this.$route.query.fromPage != "modelmanage";
      if (this.$route.query.modelTrainId) {
        this.QueryTestStateModel.ids=this.$route.query.modelTrainId
      }
      this.taskInfo= JSON.parse(sessionStorage.getItem("taskInfo"));
      this.QueryTestStateModel.taskId=this.taskInfo.taskId;
      this.ResultModel.taskId=this.taskInfo.taskId;
      this.taskTypeQueryParam.taskId=this.taskInfo.taskId;
      this.queryCompareModel.taskId=this.taskInfo.taskId;
      this.getTestState();
    },
    destroyed: function () {
      clearInterval(this.timer)
    },
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
    margin: 10px 0;
    background: rgb(228,231,237);
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    display: inline-block;
    padding-bottom: 15px;
  }
  .state-class{

    justify-content: center;
    align-items: center;
  }
</style>
