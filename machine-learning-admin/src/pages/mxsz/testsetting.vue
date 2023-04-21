<template>
  <div class="container">
    <el-row style="padding: 20px">
      <corpus-choose @resultChange="resultParams"></corpus-choose>
    </el-row>

    <el-row style="padding-left: 20px; padding-right: 20px; padding-bottom: 20px">

      <el-card class="box-card titlebold" shadow="never" >

        <div slot="header" class="clearfix">
          <span style="font-weight: bold">模型选择</span>
          <el-select clearable @change="changeTypeLabel" v-model="typeLabel_value" placeholder="请选择" style="width: 150px;margin-left: 20px">
            <el-option
              v-for="(value,key) in taskTypeSelectedArray"
              :key="key"
              :label="value.name"
              :value="value.id">
            </el-option>
          </el-select>
        </div>

        <el-table
          :data="listData"
          v-loading="showListLoading"
          style="width: 100%;">
          <el-table-column align="center" width="86" label="模型选择" >
            <template slot-scope="scope">
              <el-radio v-model="chooseModel" :label="scope.row.id"
                        @change.native="SelectionChange(scope.row)">&nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column width="" align="left" label="时间" prop="createAt" :formatter="format_Time"></el-table-column>
          <el-table-column width="" align="left" label="验证准确率" prop="verifyAccuracy"></el-table-column>
          <el-table-column width="" align="left" label="模型类型" prop="model.modelType" :formatter="ModeltatusF"></el-table-column>
          <el-table-column width="" align="left" label="任务类型" >
            <template slot-scope="scope">
              {{showTaskTypeName(scope.row.model.labelTypeIds)}}
            </template>
          </el-table-column>

          <el-table-column width="" align="left" label="模型ID" >
            <template slot-scope="scope">
              {{scope.row.id}}
            </template>
          </el-table-column>

        </el-table>
      </el-card>

      <el-card class="box-card titlebold" shadow="never" header="模型对比" style="margin-top: 20px;font-weight: bold">
        <el-table
          :data="compareListData"
          v-loading="showListLoading"
          style="width: 100%;">
          <el-table-column align="center" width="86" label="模型选择">
            <template slot-scope="scope">
              <el-radio v-model="compareChooseModel" :label="scope.row.id"
                        @change.native="CompareSelectionChange(scope.row)">&nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column width="" align="left" label="时间" prop="createAt" :formatter="format_Time"></el-table-column>
          <el-table-column width="" align="left" label="验证准确率" prop="verifyAccuracy"></el-table-column>
          <el-table-column width="" align="left" label="模型类型" prop="model.modelType" :formatter="ModeltatusF"></el-table-column>
          <el-table-column width="" align="left" label="任务类型">
            <template slot-scope="scope">
              {{showTaskTypeName(scope.row.model.labelTypeIds)}}
            </template>
          </el-table-column>

          <el-table-column width="" align="left" label="模型ID" >
            <template slot-scope="scope">
              {{scope.row.id}}
            </template>
          </el-table-column>

        </el-table>

      </el-card>
    </el-row>

    <el-row type="flex" justify="center">
      <el-button style="margin-top: 20px;width: 180px;height: 50px;font-size: 14px" type="success" @click="testSet()" :loading="isUploading">
        模型测试
      </el-button>
    </el-row>
  </div>
</template>

<script>
  import {format_Date} from '../../utils/commonUtil';
  import appHeader from '../../components/AppHeader';
  import corpusChoose from '../../components/CorpusChoose';
  import {informationService} from '../../service/index';

  export default {
    name: "testsetting",
    data() {
      return {

        typeLabel_value:'全部',
        taskTypeSelectedArray:[],
        isUploading:false, //是否正在提交中
        showListLoading: false,
        TestModel:{},
        chooseModel:{},
        compareChooseModel:{},
        taskInfo:{},
        listData: [],
        compareListData: [],
        radio: [],
        queryModel: {
          cp: 1,
          ps: 5,
          trainStatus:2,
          orderBy:'trainAt',
          direction:'DESC'
        },
        compareQueryModel: {
          cp: 1,
          ps: 5,
          trainStatus:2,
          orderBy:'publishAt',
          direction:'DESC',
          publishStatus:'1'
        },
        totalCount: 20,
        taskTypeQueryParam:{}, //任务类型的请求参数
        taskTypeModel:[], //任务类型列表
        SelectedModelLabelTypeIds: '', //选中的模型的标签类型id（任务类型）
        ComparedModelLabelTypeIds: '', //对比的模型的标签类型id（任务类型）
      }
    },
    components: {
      appHeader,
      corpusChoose
    },

    methods: {
      ModeltatusF(row){
        if(row.model.modelType=='TEXTCNN'){
          return 'TC'
        }else {
          return row.model.modelType
        }
      },

      changeTypeLabel(){

        this.queryModel.labelTypeIds = this.typeLabel_value;
        this.compareQueryModel.labelTypeIds = this.typeLabel_value;
        console.log("changeTypeLabel == " + this.typeLabel_value);
        this.getList();
        this.getCompareListData()
      },

      resultParams(data){
        this.TestModel.datasetIds=data.join(',')
      },
      format_Time(value,row){
        let date = new Date(value[row.property]);
        return (date && date != 'Invalid Date')?format_Date(date):'--';
      },
      //点击分页
//      pageChange(page) {
//        this.queryModel.cp = page;
//        this.getList();
//      },
      goPage(page) {
        this.$router.push({ path: page,  });
      },
      SelectionChange(row){
        this.TestModel.modelTrainId=row.id;
        this.SelectedModelLabelTypeIds = row.model.labelTypeIds

      },
      CompareSelectionChange(row){
        this.TestModel.compareModelTrainId=row.id;
        this.ComparedModelLabelTypeIds = row.model.labelTypeIds
      },
      sortBy(field) {
        return function(a,b) {
          return b[field] -a[field] ;
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
      // 获取任务类型
      async getTaskType() {
        let result = await informationService.querylabelcategory(this.taskTypeQueryParam);
        if (result.message.code == 0) {

          this.taskTypeModel= result.data.list;
        }
      },

      //获取模型的所有类型
      async  getModelLabels(){

        let result = await informationService.getModelLabels(this.taskTypeQueryParam);

        if (result.data.length > 0){

          result.data.forEach((item,index)=>{

            var name = '';
            var id = '';

            //处理id和文字显示
            item.forEach((item,index)=>{

             if (index>0){
               name = name + ',' + item.name;
               id  = id + ',' + item.id;
             }else {
               name = item.name;
               id = item.id;
             }
            });
            this.taskTypeSelectedArray.push({'name':name,'id':id});
          });

          this.taskTypeSelectedArray.splice(0,0,{'name':'全部','id':''});
        }
      },
      async getList(){
        let result = await informationService.getResultOne(this.queryModel);
        if (result.message.code == 0) {
          this.listData=result.data.list.sort(this.sortBy('verifyAccuracy'));
        }
      },
      async getCompareListData(){
        let result = await informationService.getResultOne(this.compareQueryModel);
        if (result.message.code == 0) {
          this.compareListData=result.data.list;
        }
      },

      async testSet(){
        if(this.TestModel.datasetIds==undefined || this.TestModel.datasetIds==''){
          this.$message({
            showClose: true,
            message: '请选择语料集',
            type: 'error'
          });
          return
        }
        if(this.TestModel.modelTrainId==undefined || this.TestModel.modelTrainId==''){
          this.$message({
            showClose: true,
            message: '请选择模型',
            type: 'error'
          });
          return
        }
        //当选择了对比模型时，对比模型和测试模型必须是同任务类型
        if((this.TestModel.compareModelTrainId != undefined && this.TestModel.compareModelTrainId != '') && this.SelectedModelLabelTypeIds != this.ComparedModelLabelTypeIds){

          this.$message({
            showClose: true,
            message: '请选择相同任务类型的模型对比',
            type: 'error'
          });
          return
        }
        this.isUploading = true;
        let result = await informationService.modelTest([this.TestModel]);
        if (result.message.code == 0) {
          let target = this;
          target.isUploading = false;
          setTimeout(function () {
            target.goPage('/testresult?index=testresult');
          }, 1250);
          this.$message({
            showClose: true,
            message: '提交成功',
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
    mounted: function () {},
    created: function () {
      this.taskInfo= JSON.parse(sessionStorage.getItem("taskInfo"));
      this.TestModel.taskId=this.taskInfo.taskId;
      this.queryModel.taskId=this.taskInfo.taskId;
      this.compareQueryModel.taskId=this.taskInfo.taskId;
      this.taskTypeQueryParam.taskId = this.taskInfo.taskId;
      this.getModelLabels();
      this.getList();
      this.getCompareListData();
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
