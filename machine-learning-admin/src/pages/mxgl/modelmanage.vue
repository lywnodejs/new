<template>
  <div class="container">
    <el-tabs v-model="activeName" style="background-color: #ffffff; height: 60px;line-height: 60px;padding-left: 20px;" >
      <el-tab-pane label="验证集" name="first"  ></el-tab-pane>
      <el-tab-pane label="测试集" name="second" >  </el-tab-pane>
      <el-tab-pane label="训练集" name="third"  >  </el-tab-pane>
    </el-tabs>
    <el-row style="padding: 20px">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column prop="createAt" label="时间" width="200" :formatter="format_Time"></el-table-column>
 <!--trainTT-->
      <el-table-column v-if="activeName==='first'" prop="verifyAccuracy" label="准确率" width="" align="left" key='1'>
        <template slot-scope="scope">
          {{scope.row.verifyAccuracy == -1 ? '--' : scope.row.verifyAccuracy}}
        </template>
      </el-table-column>
      <el-table-column v-if="activeName==='first'" prop="verifyRecall" label="召回率" width="" align="left" key='2'>
        <template slot-scope="scope">
          {{scope.row.verifyRecall == -1 ? '--' : scope.row.verifyRecall}}
        </template>
      </el-table-column>
      <el-table-column v-if="activeName==='first'" prop="verify_f1" label="f1值" width="" align="left" key='3'>
        <template slot-scope="scope">
          {{scope.row.verify_f1 == -1 ? '--' : scope.row.verify_f1}}
        </template>
      </el-table-column>

      <el-table-column v-if="activeName==='second'" prop="testAccuracy" label="准确率" width="" align="left" key='4'>
        <template slot-scope="scope">
          {{scope.row.testAccuracy == -1 ? '--' : scope.row.testAccuracy}}
        </template>
      </el-table-column>
      <el-table-column v-if="activeName==='second'" prop="testRecall" label="召回率" width="" align="left" key='5'>
        <template slot-scope="scope">
          {{scope.row.testRecall == -1 ? '--' : scope.row.testRecall}}
        </template>
      </el-table-column>
      <el-table-column v-if="activeName==='second'" prop="test_f1" label="f1值" width="" align="left" key='6'>
        <template slot-scope="scope">
          {{scope.row.test_f1 == -1 ? '--' : scope.row.test_f1}}
        </template>
      </el-table-column>

      <el-table-column v-if="activeName==='third'" prop="trainAccuracy" label="准确率" width="" align="left" key='7'>
        <template slot-scope="scope">
          {{scope.row.trainAccuracy == -1 ? '--' : scope.row.trainAccuracy}}
        </template>
      </el-table-column>
      <el-table-column v-if="activeName==='third'" prop="trainRecall" label="召回率" width="" align="left" key='8'>
        <template slot-scope="scope">
          {{scope.row.trainRecall == -1 ? '--' : scope.row.trainRecall}}
        </template>
      </el-table-column>
      <el-table-column v-if="activeName==='third'" prop="train_f1" label="f1值" width="" align="left" key='9'>
        <template slot-scope="scope">
          {{scope.row.train_f1 == -1 ? '--' : scope.row.train_f1}}
        </template>
      </el-table-column>
      <el-table-column prop="model.modelType" label="模型类型" width="" align="left" :formatter="ModeltatusF"></el-table-column>
      <el-table-column label="任务类型" width="200" align="left">
        <template slot-scope="scope">
          {{showTaskTypeName(scope.row.model.labelTypeIds)}}
        </template>
      </el-table-column>

      <el-table-column v-if="activeName==='first'" prop="trainStatus" label="验证状态" width="" :formatter="trainStatusF" align="left"></el-table-column>
      <el-table-column v-if="activeName==='second'" prop="testStatus" label="测试状态" width="" :formatter="testStatusF" align="left"></el-table-column>
      <el-table-column v-if="activeName==='third'" prop="trainStatus" label="训练状态" width="" :formatter="trainStatusF" align="left"></el-table-column>

      <el-table-column  v-if="activeName==='first'" prop="province" label="验证结果" width="" align="left" key='10'>
        <template slot-scope="scope">
          <el-button @click="checkSee('/verificationresult?index=verificationresult',scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="activeName==='second'"  prop="province" label="测试结果" width="" align="left" key='11'>
        <template slot-scope="scope">
          <el-button @click="checkSee('/testresult?index=testresult',scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="activeName==='third'"  prop="province" label="训练结果" width="" align="left" key='12'>
        <template slot-scope="scope">
          <el-button @click="checkSee('/trainresult?index=trainresult',scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="province" label="操作" width="200" align="left">
        <template slot-scope="scope">
          <!--<el-button @click="deleteEvent(scope.row)" type="text" size="small">删除</el-button>-->

          <el-button v-if="scope.row.publishStatus == 0" @click="modelPublishEvent(scope.row)" type="text" size="small">发布</el-button>
          <el-button v-else @click="modelPublishEvent(scope.row)" type="text" size="small">撤销发布</el-button>

          <el-button @click="modelSetup(scope.row)" type="text" size="small">模型设置</el-button>
          <el-button @click="exportJson(scope.row)" type="text" size="small">导出</el-button>

        </template>
      </el-table-column>

    </el-table>

      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%" style="font-weight: bold">

          <el-card class="box-card" shadow="never" header="任务类型" style="font-weight: bold">

            <el-row>
              <el-checkbox-group v-model="labelTypeIdsArr" :disabled = true>
                <el-checkbox  v-for="(item,index) in modelLabelTypes" :key = "index" :label="item.id">
                  {{item.name}}
                </el-checkbox>
              </el-checkbox-group>
            </el-row>

          </el-card>
        <el-card class="box-card" shadow="never" header="维度信息" style="font-weight: bold" v-if="modeldataTypes.length>0">

          <el-row>
            <el-checkbox-group v-model="datatypeArr" :disabled = true>
              <el-checkbox  v-for="(item,index) in modeldataTypes" :key = "index" :label="item">
                {{item | NameFilter}}
              </el-checkbox>
            </el-checkbox-group>
          </el-row>

        </el-card>

          <el-card class="box-card" style="margin-top:20px" shadow="never">
            <div slot="header" class="clearfix">
              <span class="span-title" style="font-weight: bold">数据集划分比例：训练集/验证集</span>
            </div>
            <el-row>
              <el-radio-group v-model="this.modelConfig.data_size">
                <el-radio :label="this.modelConfig.data_size">{{this.modelConfig.data_size}}</el-radio>
              </el-radio-group>
            </el-row>
          </el-card>

          <el-card class="box-card" style="margin-top:20px" shadow="never">
            <div slot="header" class="clearfix">
              <span class="span-title" style="font-weight: bold">模型选择</span>
            </div>
            <el-row>
              <el-radio>{{this.taggingType}}</el-radio>
            </el-row>
          </el-card>

          <el-card class="box-card" style="margin-top:20px" shadow="never">
            <div slot="header" class="clearfix">
              <span class="span-title" style="font-weight: bold">高级设置</span>
            </div>
            <el-collapse-transition>
              <div  class="transition-box">
                <el-form  label-width="100px" style="width: 80%"
                         :labelPosition="labelPosition">
                  <h3>预处理</h3>
                  <el-form-item label="停止词：">
                    <el-row>
                  <span class="LeftItem" v-for="(item,index) in this.stopwordArr">
                    <el-button size="mini">{{item}}</el-button>
                  </span>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="词典：">
                    <el-row>
                  <span class="LeftItem" v-for="(item,index) in this.worddictArr">
                    <el-button size="mini">{{item}}</el-button>
                  </span>
                    </el-row>
                  </el-form-item>
                  <h3>分词工具</h3>
                  <el-form-item label-width="0" label="">
                    <el-radio-group  class="LeftItem" v-model="this.modelConfig.fenci">
                      <el-radio :label="this.modelConfig.fenci">{{this.modelConfig.fenci}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <h3>特征工程</h3>
                  <el-form-item label="特征向量：">
                    <el-radio-group class="LeftItem" v-model="this.modelConfig.features_vector">
                      <el-radio :label="this.modelConfig.features_vector">{{this.modelConfig.features_vector}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="特征：">
                    <el-checkbox-group  v-model="featureArr" :disabled = true>
                      <el-checkbox v-for="city in featureArr" :label="city" :key="city">{{city}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-form>
              </div>
            </el-collapse-transition>
          </el-card>


      </el-dialog>


      <el-row type="flex" justify="center" class="zoom-pagi" style="padding: 20px;background-color: #fff">
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
    </el-row>
  </div>
</template>

<script>
  import appHeader from '../../components/AppHeader';
  import {format_Date} from '../../utils/commonUtil';
  import {informationService} from '../../service/index';
  export default {
    name: "modelmanage",
    data() {
      return {
        promptMessageModel:[],
        labelTypeIdsArr:[],
        datatypeArr:[],
        labelPosition:'right',
        modelConfig:{},
        featureArr:['词性'],
        worddictArr:[],
        stopwordArr:[],
        modelLabelTypes:[],
        modeldataTypes:[],
        taggingType:'',
        dialogVisible: false,
        activeName: 'first',
        taskInfo: {},
        showListLoading: false,
        tableData: [],
        queryModel: {
          cp: 1,
          ps: 10,
        },
        totalCount: 0,
        modelPublishParams:{
          ids:'',
          publishStatus: ''
        },
        taskTypeQueryParam:{}, //任务类型的请求参数
        taskTypeModel:[] //任务类型列表
      }
    },
    components: {
      appHeader
    },
    watch: {},
    methods: {

      exportJson(item){

        if (item.modelAddress.indexOf("http") >= 0) {

          window.location.href = item.modelAddress;

        }else {

          this.$message({
            showClose: true,
            message: '无效的导出链接',
            type: 'error'
          });

        }
      },
      modelSetup(item){

        this.promptMessageModel = item;
        this.modelLabelTypes = this.promptMessageModel.model.labelTypes;
        this.modelConfig = JSON.parse(this.promptMessageModel.model.modelConfig);
        this.featureArr =  JSON.parse( this.modelConfig.feature);
        this.modeldataTypes =  JSON.parse( this.modelConfig.datatype);
        this.worddictArr = JSON.parse( this.modelConfig.worddict);
        this.stopwordArr = JSON.parse( this.modelConfig.stopword);
        this.taggingType = this.modelLabelTypes[0].taggingType;
        var _this = this;
        $.each(this.promptMessageModel.model.labelTypes,function (key,item) {
          _this.labelTypeIdsArr.push(item.id);
        });
        $.each( this.modeldataTypes,function (key,item) {
          _this.datatypeArr.push(item);
        });


        this.dialogVisible = true;
      },
      checkSee(page,row){
        this.$router.push({
          path: page,
          query: {
            modelTrainId:row.id,
            fromPage: 'modelmanage'
          }
        });
      },
      //点击分页
      pageChange(page) {
        this.queryModel.cp = page;
        this.getList();
      },
      format_Time(value, row) {
        let date = new Date(value[row.property]);
        return (date && date != 'Invalid Date') ? format_Date(date) : '--';
      },
      trainTT(row){
        if(row.trainStatus<0){
          return '--'
        }
      },
      ModeltatusF(row){
        if(row.model.modelType=='TEXTCNN'){
          return 'TC'
        }else {
          return row.model.modelType
        }
      },
      trainStatusF(row){
        if(row.trainStatus=='0'){
          return '未开始'
        }
        if(row.trainStatus=='1'){
          return '正在进行'
        }
        if(row.trainStatus=='2'){
          return '成功'
        }
        if(row.trainStatus=='-1'){
          return '失败'
        }
      },
      testStatusF(row){
        if(row.testStatus=='0'){
          return '未开始'
        }
        if(row.testStatus=='1'){
          return '正在进行'
        }
        if(row.testStatus=='2'){
          return '成功'
        }
        if(row.testStatus=='-1'){
          return '失败'
        }
      },
      //根据id去遍历任务类型列表，展示任务类型名称
      showTaskTypeName(id) {

        var arr = id.split(',');
        console.log( 'showTaskTypeName' + JSON.stringify(arr));

        var nameLabels = '';
        arr.forEach((item,index)=>{

          if (index >0){
            nameLabels = nameLabels + ',' + this.getTypeName(item);
          } else {
            nameLabels = this.getTypeName(item);
          }
        });

        return nameLabels;
      },

      getTypeName(id){
        for (let i = 0; i < this.taskTypeModel.length; i++) {
          if (parseInt(id) == this.taskTypeModel[i].id) {
            return this.taskTypeModel[i].name;
          }
        }
      },

      async getList() {
        let result = await informationService.getResultOne(this.queryModel);
        if (result.message.code == 0) {
          this.tableData = result.data.list;
          this.totalCount = result.data.totalCount;
          this.queryModel.cp = result.data.currentPage;
        }
      },
  // 获取任务类型
  async getTaskType() {
    let result = await informationService.querylabelcategory(this.taskTypeQueryParam);
    if (result.message.code == 0) {
      this.taskTypeModel= result.data.list;
    }
  },
      deleteEvent(index) {
        this.$confirm('确定删除吗？删除后该模型除了语料预测信息保留，其对应的训练信息都将删除！', '提示', {type: 'warning'}).then(() => {
          this.confirmDelete(index.id)
        }).catch(() => {
        });
      },
  //模型发布
  async modelPublishEvent(index) {
    this.modelPublishParams.ids = index.id;
    this.modelPublishParams.publishStatus = index.publishStatus == 1 ? 0 : 1;
    let result = await informationService.modelPublish(this.modelPublishParams);
    if (result.message.code == 0) {
      let target = this;
      setTimeout(function () {
        target.getList();
      }, 1250);
      this.$message({
        showClose: true,
        message: '操作成功',
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
      async confirmDelete(id) {
        let result = await informationService.deleteModel({ids: id});
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
    filters:{
      NameFilter(val){
        if(val==='TITLE'){return "标题"}else {
          return  "上下文"
        }
      }
    },
    created: function () {
      this.taskInfo = JSON.parse(sessionStorage.getItem("taskInfo"));
      this.queryModel.taskId = this.taskInfo.taskId;
      this.taskTypeQueryParam.taskId = this.taskInfo.taskId;
      this.getList();
      this.getTaskType();
    }
  }
</script>

<style scoped>
  .container {
    width: 100%;
    background-color: #EFF3F6;
    box-sizing: border-box;
    min-height: 100%;
  }
  .line {
    height: 2px;
    width: 100%;
    margin: 10px 0;
    background: rgb(228, 231, 237);
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    display: inline-block;
    padding-bottom: 15px;
  }
</style>
