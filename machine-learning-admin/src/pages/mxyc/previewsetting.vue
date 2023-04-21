<template>
  <div class="container">
    <el-row style="padding: 20px">
      <corpus-choose
        v-bind:showCheckBox="true"
        @checkedChange="checkedStatus"
        @resultChange="resultParams"></corpus-choose>
    </el-row>
    <el-row style="padding-left: 20px; padding-right: 20px; padding-bottom: 20px">

      <el-card class="box-card" shadow="never">

        <el-tabs type="border-card" style="min-height: 300px;-webkit-box-shadow:none;box-shadow:none" v-model="activeName">
          <el-tab-pane label="模型选择" name="first" class="titlebold">
            <el-table
              :data="listData"
              v-loading="showListLoading"
              style="width: 100%">
              <el-table-column align="center" width="86" label="模型选择">
                <template slot-scope="scope">
                  <el-radio v-model="chooseModel" :label="scope.row.id"
                            @change.native="SelectionChange(scope.row)">&nbsp;
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column width="" align="left" label="时间" prop="createAt"  :formatter="format_Time"></el-table-column>
              <el-table-column width="" align="left" label="验证准确率" prop="verifyAccuracy"></el-table-column>
              <el-table-column width="" align="left" label="模型类型" prop="model.modelType"  :formatter="ModeltatusF"></el-table-column>
              <el-table-column width="" align="left" label="任务类型" >
                <template slot-scope="scope">
                  {{showTaskTypeName(scope.row.model.labelTypeIds)}}
                </template>
              </el-table-column>

            </el-table>
          </el-tab-pane>
          <el-tab-pane label="规则模型" name="second">

            <el-row style="margin-top: 10px;margin-bottom: 30px">
              <span>任务类型：</span>
              <el-radio-group v-model="TaskTypeModel.labelTypeIds">
                <el-radio
                  v-for="(item,index) in taskTypeListData" :key="index"
                  :label="item.id"
                  @change.native="SelectTaskTypeChange(item)">
                  <!--v-if="item.taggingType != 'NER'"-->
                  {{item.name}}
                </el-radio>

                <!--<el-button v-if="isNerHidden" size="mini" type="primary" @click="addRuleModel()">新增规则</el-button>-->

              </el-radio-group>
            </el-row>

            <el-table v-if="!isNerHidden"
              :data="ruleModelData"
              style="width: 100%" key="table">
              <el-table-column width="" align="center">
                <template slot="header" slot-scope="scope">
                  <el-button size="mini" type="primary" @click="addRuleModel()">新增规则</el-button>
                </template>
                <template slot-scope="scope">
                  <el-select v-model="scope.row.label" filterable placeholder="选择标签">
                    <el-option
                      v-for="item in labelList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="关键词选择" width="" align="center">
                <el-table-column label="全部包含" width="">
                  <template slot-scope="scope">
                    <el-input type="textarea" autosize v-model="scope.row.and" placeholder="输入关键词"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="partContain" label="部分包含" width="">
                  <template slot-scope="scope">
                    <el-input type="textarea" autosize v-model="scope.row.or" placeholder="输入关键词"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="notContain" label="不包含" width="">
                  <template slot-scope="scope">
                    <el-input type="textarea" autosize v-model="scope.row.not" placeholder="输入关键词"></el-input>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="regEx" label="正则表达式" width="">
                <template slot-scope="scope">
                  <el-input type="textarea" autosize v-model="scope.row.re" placeholder="输入具体正则表达式"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-row type="flex">
                    <el-button type="text" size="mini" @click="deleteRuleModel(scope.$index)">删除</el-button>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>



            <el-table v-if="isNerHidden"
                      :data="ruleModelData"
                      style="width: 100%;" key="tableNer">
              <el-table-column width="150" align="center" label="标签" prop="createAt" >

                <template slot="header" slot-scope="scope">
                  <el-button size="mini" type="primary" @click="addRuleModel()">新增规则</el-button>
                </template>

                <template slot-scope="scope">
                  <el-select v-model="scope.row.label" filterable placeholder="选择标签">
                    <el-option
                      v-for="item in labelList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>

              </el-table-column>

              <el-table-column label="关键词选择" width="" align="center">

                <el-table-column width="" align="left" label="左边" prop="">
                  <template slot-scope="scope">
                    <el-input  autosize v-model="scope.row.left" placeholder="输入多个关键词，逗号为分隔符"></el-input>
                  </template>
                </el-table-column>

                <el-table-column width="" align="left" label="ner" >
                  <template slot-scope="scope">
                    <el-input  autosize v-model="scope.row.ner" placeholder="输入多个关键词，逗号为分隔符"></el-input>
                  </template>
                </el-table-column>

                <el-table-column width="" align="left" label="右边" prop="">
                  <template slot-scope="scope">
                    <el-input  autosize v-model="scope.row.right" placeholder="输入多个关键词，逗号为分隔符"></el-input>
                  </template>
                </el-table-column>

              </el-table-column>

              <el-table-column width="70" align="left" label="操作" >
                <template slot-scope="scope">
                  <el-row type="flex">
                    <el-button type="text" size="mini" @click="deleteRuleModel(scope.$index)">删除</el-button>
                  </el-row>
                </template>
              </el-table-column>

            </el-table>

          </el-tab-pane>


        </el-tabs>

        <el-row type="flex" justify="center">
          <el-button style="margin-top: 20px;width: 180px;height: 50px" type="success" @click="testSet()" :loading="isUploading">模型预测</el-button>
        </el-row>
    </el-card>
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

        isNerHidden:false,
        isUploading:false, //是否正在提交中
        checked:true, //“未标注预料”是否选中
        showCheckBox: true, //显示“未标注预料”的选择框
        activeName: 'first',
        showListLoading: false,
        PreModel:{
          modelConfig:{
            list:[]
          }
        },
        chooseModel:{},

        taskInfo:{},
        listData: [],
        radio: [],
        queryModel: {
          trainStatus:2,
          cp: 1,
          ps: 5,
          orderBy:'trainAt',
          direction:'DESC'
        },
        totalCount: 20,
        taskTypeQueryModel: {
          taskId: '',
          cp: 1,
          ps: 10
        },
        taskTypeListData: [],
        TaskTypeModel: {
          labelTypeIds:''
        },
        ruleModelData: [],
        ruleModelDataNer: [],
        queryLabelParams:{
          taskId: '',
          cp: 1,
          ps: 100
        },
        labelList:[]
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
      checkedStatus(data){
        this.checked = data
      },
      resultParams(data){
        this.PreModel.datasetIds=data.join(',')
      },
      format_Time(value,row){
        let date = new Date(value[row.property]);
        return (date && date != 'Invalid Date')?format_Date(date):'--';
      },
      //点击分页
      pageChange(page) {
        this.queryModel.cp = page;
        this.getList();
      },
      goPage(page) {

        this.$router.push({ path: page,
          query: {
            modelTrainId:this.PreModel.modelTrainId,
            keyWords:this.getKeyWords()
          }
        });
      },
      SelectionChange(row){
        this.PreModel.modelTrainId=row.id;
      },
      sortBy(field) {
        return function(a,b) {
          return b[field] - a[field] ;
        }
      },
      getKeyWords(){

        var keyWords = '';

        if (this.TaskTypeModel.taggingType == 'LABEL_1' || this.TaskTypeModel.taggingType == 'LABEL_N') {

          for(var i = 0 ; i<this.ruleModelData.length; i++){

            var object = this.ruleModelData[i];

            $.each(object,function (key,value) {

              if (key == 'not' ||key == 'or' || key == 'and' )

                keyWords+=value + ',';
            })
          }
          keyWords = keyWords.substring(0,keyWords.length-1);
        }
        return keyWords;
      },
      SelectTaskTypeChange(taskType) {

        if (taskType.taggingType == 'NER'){

          this.isNerHidden = true;

        } else {

          this.isNerHidden = false;
        }

        //根据选择标签去请求对应任务类型下的标签
        this.TaskTypeModel.labelTypeIds == taskType.id;
        this.TaskTypeModel.taggingType == taskType.taggingType;
        this.getLabelsByTaskType();



        //处理数组
        this.ruleModelData.splice(0);
        this.TaskTypeModel.labelTypeIds = taskType.id;
        this.getLabelsByTaskType();
      },
      SelectDictionaryChange(){

      },
      //匹配词典弹框
      matchDictionaryClick(index){

        this.dialogVisible = true;
      },
      //删除一行规则模型
      deleteRuleModel(index){

        this.ruleModelData.splice(index, 1);
      },
      //添加一行新的规则模型
      addRuleModel() {
        this.ruleModelData.splice(0, 0, {'ner':'','right':'','left':''});
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
        for (let i = 0; i < this.taskTypeListData.length; i++) {
          if (parseInt(id) == this.taskTypeListData[i].id) {
            return this.taskTypeListData[i].name;
          }
        }
      },

      //根据任务类型获取标签列表
      async getLabelsByTaskType() {
        this.queryLabelParams.labelTypeIds = this.TaskTypeModel.labelTypeIds;
        let result = await informationService.querylabel(this.queryLabelParams);

        if (result.message.code == 0) {
          this.labelList = result.data.list;
        }
      },
      async getList(){
        let result = await informationService.getResultOne(this.queryModel);
        if (result.message.code == 0) {
          this.listData=result.data.list.sort(this.sortBy('verifyAccuracy'));
        }
      },
      async testSet(){

         if(this.PreModel.datasetIds==undefined || this.PreModel.datasetIds.length == 0){
           this.$message({
             showClose: true,
             message: '请选择语料集',
             type: 'error'
           });
            return
         }

        if (this.activeName == 'second') {
          this.PreModel.modelConfig.list= this.ruleModelData;
          this.PreModel.modelType = 'RULE';
        } else {
          if(this.PreModel.modelTrainId==undefined || this.PreModel.modelTrainId==''){
            this.$message({
              showClose: true,
              message: '请选择模型',
              type: 'error'
            });
            return
          }
        }

        this.PreModel.labelTypeIds=this.TaskTypeModel.labelTypeIds;
        this.PreModel.datasetLabelStatus = this.checked ? 0 : 2; //数据集标注状态:2-全部语料;0-仅未标注;1-仅已标注
        this.isUploading = true;

        let result = await informationService.modelPre([this.PreModel]);

        if (result.message.code == 0) {
          let target = this;
          target.isUploading = false;
          setTimeout(function () {
            target.goPage('/previewresult?index=previewresult');
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
      //获取任务类型
      async getTaskType() {
        let result = await informationService.querylabelcategory(this.taskTypeQueryModel);

        if (result.message.code == 0) {
          this.taskTypeListData = result.data.list;
          this.taskTypeQueryModel.cp = result.data.currentPage;

          if (this.taskTypeListData.length > 0) {
            this.TaskTypeModel.labelTypeIds = this.taskTypeListData[0].id;
            this.TaskTypeModel.taggingType = this.taskTypeListData[0].taggingType;

            this.isNerHidden = this.taskTypeListData[0].taggingType == 'NER';
            this.getLabelsByTaskType();
          }
        }
      }

    },
    mounted: function () {},
    created: function () {
      this.taskInfo= JSON.parse(sessionStorage.getItem("taskInfo"));
      this.PreModel.taskId=this.taskInfo.taskId;
      this.queryModel.taskId=this.taskInfo.taskId;
      this.taskTypeQueryModel.taskId=this.taskInfo.taskId;
      this.queryLabelParams.taskId=this.taskInfo.taskId;
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
