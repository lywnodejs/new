<template>
  <div class="container neymar_div">
    <el-tabs v-model="activeName" @tab-click="handleClick" style="background-color:  #EFF3F6;padding:0 20px">
      <el-tab-pane label="机器学习" name="MACHINE_LEARNING">

        <corpus-choose @resultChange="resultParams"></corpus-choose>

        <el-card class="box-card" style="margin-top: 20px;font-weight: bold" shadow="never" header="维度信息">
          <!--维度信息-->
          <el-row>
            <el-checkbox-group v-model="datatypeArr">
              <span style="margin-right: 15px;font-size: 14px">维度:</span>
              <el-checkbox label="CONTEXT">上下文</el-checkbox>
              <el-checkbox label="TITLE">标题</el-checkbox>
            </el-checkbox-group>
          </el-row>
        </el-card>
        <!--taskTypeArr-->
        <el-card class="box-card" style="margin-top: 20px;font-weight: bold" shadow="never" header="任务类型">
          <el-select v-model="labelTypeIdsArr" value-key="index" placeholder="请选择" size="mini" @change="acvb">
            <el-option
              v-for="(item,index) in taskTypeArr" :key="index"
              :label="index"
              :value="item">
            </el-option>
          </el-select>
          <el-select v-model="labelTypeIdsArrs" @change="ChangeSelectItem" :multiple-limit="2" multiple placeholder="请选择" size="mini">
            <el-option
              v-for="(ite,inde) in taskTypeListDataS" :key="inde"
              :label="ite.name"
              :value="ite.id">
            </el-option>
          </el-select>
          <!--分类-->
          <!--          <el-row>-->
          <!--            <el-checkbox-group v-model="labelTypeIdsArr" v-if="isHiddenCategory">-->
          <!--              <span style="margin-right: 15px;font-size: 14px">分类:</span>-->
          <!--              <el-checkbox style="margin-bottom: 10px" v-for="(item,index) in taskTypeListData" :key="index"-->
          <!--                           :label="item.id" v-if="item.taggingType == 'LABEL_1' || item.taggingType == 'LABEL_N'"-->
          <!--                           @change.native="clickitemleft(item)">-->
          <!--                {{item.name}}-->
          <!--              </el-checkbox>-->
          <!--            </el-checkbox-group>-->
          <!--          </el-row>-->
          <!--  目标分类-->
          <!--          <el-row>-->
          <!--            <el-radio-group v-model="labelTypeIdsArrNerLabel">-->
          <!--              <span style="margin-right: 15px;font-size: 14px">目标分类:</span>-->
          <!--              <el-radio style="margin-bottom: 10px" v-for="(item,index) in taskTypeListData" :key="index"-->
          <!--                        :label="item.id" v-if="item.taggingType == 'NER_LABEL_1'" @change.native="clickitemleft(item)">-->
          <!--                {{item.name}}-->
          <!--              </el-radio>-->
          <!--            </el-radio-group>-->
          <!--          </el-row>-->

        </el-card>

        <el-card class="box-card" style="margin-top:20px" shadow="never">
          <div slot="header" class="clearfix">
            <span class="span-title" style="font-weight: bold">数据集划分比例：训练集/验证集</span>
          </div>
          <el-row>
            <el-radio-group v-model="data_size">
              <el-radio label="90%:10%">90%：10%</el-radio>
            </el-radio-group>
            <el-input size="small" style="width: 280px;margin-left: 20px" v-model="data_size"
                      placeholder="自定义输入（训练集+验证集=100%）"></el-input>
          </el-row>
        </el-card>

        <el-card class="box-card" style="margin-top:20px" shadow="never">
          <div slot="header" class="clearfix">
            <span class="span-title" style="font-weight: bold">模型选择</span>
            <span style="margin-left: 10px;font-size: 12px">SVM 普通分类任务 ESVM 行业实体分类任务</span>
          </div>
          <el-row>
            <el-radio-group v-model="TrainModel.modelType">
              <el-radio :label="item.modelType" v-for="(item,index) in modelTypeArr" :key="index">
                {{item.modelType}}
              </el-radio>
            </el-radio-group>
          </el-row>
        </el-card>

        <el-card class="box-card" style="margin-top:20px" shadow="never">
          <div slot="header" class="clearfix">
            <span class="span-title" style="font-weight: bold">高级设置</span>
            <el-button type="text" style="float: right;color: #354052;font-size: 14px;" @click="show2 = !show2">
              {{show2?'收起':'展开'}}
              <i v-if="show2" class="el-icon-caret-top el-icon--right"></i>
              <i v-else class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
          </div>
          <el-collapse-transition>
            <div v-show="show2" class="transition-box">
              <el-form ref="formLeft" :model="formLeft" label-width="100px" style=""
                       :labelPosition="labelPosition">
                <h3>预处理</h3>
                <el-form-item label="停止词：">
                  <el-row>
                  <span class="LeftItem" v-for="(item,index) in this.stopWord" :key="index">
                    <el-button size="mini">{{item}}</el-button>
                  </span>
                  </el-row>
                </el-form-item>
                <el-form-item label="切分方式：">
                  <el-checkbox-group v-model="segmentation" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="city in segmentationArr" :label="city" :key="city">{{city | NameFilter}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="词典：">
                  <el-row>
                <span class="LeftItem" v-for="(item,index) in this.Words">
                    <el-button size="mini">{{item}}</el-button>
                  </span>
                  </el-row>
                </el-form-item>
                <h3>分词工具</h3>
                <el-form-item label-width="0" label="">
                  <el-radio-group class="LeftItem" v-model="formLeft.fenci"
                                  v-for="(item,index) in participleArr" :key='index'>
                    <el-radio :label="item"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <h3>特征工程 <span style="margin-left: 10px;font-size: 12px;font-weight: normal">ngram 该词的相邻词</span></h3>
                <el-form-item label="特征向量：">
                  <el-radio-group class="LeftItem" v-model="formLeft.vector"
                                  v-for="(item,index) in vectorArr" :key='index'>
                    <el-radio :label="item"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="特征：">
                  <el-checkbox-group v-model="feature" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="city in featureArr" :label="city" :key="city">{{city}}</el-checkbox>
                    <el-input-number v-if='feature.indexOf("ngram")>0' size="mini" v-model="data_ngram"
                                     style="display: inline-block" @change="handleChange" :min="2" :max="5"
                                     label="2-5"></el-input-number>
                  </el-checkbox-group>
                </el-form-item>
                <h3>模型参数</h3>
                <el-form-item label="alpha_c：">
                  <el-input size="small" style="width: 280px;margin-left: 20px" v-model="alpha_c"
                            placeholder="输入数字默认1.0"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-transition>
        </el-card>

        <el-row type="flex" justify="center">
          <el-button type="success" size="small" @click="Train()" :loading="isUploading"
                     style="margin: 40px 0;width: 180px;height: 50px;font-size: 14px">训练并生效新模型
          </el-button>
        </el-row>
      </el-tab-pane>
      <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~这是一条分割线~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
      <el-tab-pane label="深度学习" name="DEEP_LEARNING" :disabled="disabledM">

        <corpus-choose @resultChange="resultParams"></corpus-choose>

        <el-card class="box-card" style="margin-top: 20px;font-weight: bold" shadow="never" header="维度信息">
          <!--维度信息-->
          <el-row>
            <el-checkbox-group v-model="datatypeArr">
              <span style="margin-right: 15px;font-size: 14px">维度:</span>
              <el-checkbox label="CONTEXT">上下文</el-checkbox>
              <el-checkbox label="TITLE">标题</el-checkbox>
            </el-checkbox-group>
          </el-row>
        </el-card>

        <el-card class="box-card" style="margin-top: 20px;font-weight: bold" shadow="never" header="任务类型">
          <el-select v-model="labelTypeIdsArr" value-key="index" placeholder="请选择" size="mini" @change="acvb">
            <el-option
              v-for="(item,index) in taskTypeArr" :key="index"
              :label="index"
              :value="item">
            </el-option>
          </el-select>
          <el-select v-model="labelTypeIdsArrs" @change="ChangeSelectItem" :multiple-limit="2" multiple placeholder="请选择" size="mini">
            <el-option
              v-for="(ite,inde) in taskTypeListDataS" :key="inde"
              :label="ite.name"
              :value="ite.id">
            </el-option>
          </el-select>
<!--          <el-row v-for="(item,index) in taskTypeArr" :key="index">-->
<!--            <el-checkbox-group v-model="labelTypeIdsArr">-->
<!--              <span style="margin-right: 15px;font-size: 14px">{{index}}：</span>-->
<!--              <el-checkbox style="margin-bottom: 10px" v-for="(ite,inde) in dataFilter(item,taskTypeListData)"-->
<!--                           :key="inde"-->
<!--                           :label="ite.id"-->
<!--                           @change="clickitemleft(activeName,ite,item)">-->
<!--                {{ite.name}}-->
<!--              </el-checkbox>-->
<!--            </el-checkbox-group>-->
<!--          </el-row>-->
          <!-- <el-row>
             <el-checkbox-group v-model="labelTypeIdsArrCategory" v-if="isHiddenCategory">
               <span style="margin-right: 15px;font-size: 14px">分类:</span>
               <el-checkbox style="margin-bottom: 10px" v-for="(item,index) in taskTypeListData" :key="index"
                            :label="item.id" v-if="item.taggingType == 'LABEL_1' || item.taggingType == 'LABEL_N'"
                            @change.native="clickitem(item)">
                 {{item.name}}
               </el-checkbox>
             </el-checkbox-group>
           </el-row>

           &lt;!&ndash;关系&ndash;&gt;
           <el-row>
             <el-checkbox-group v-model="labelTypeIdsArrRelation" v-if="isHiddenRelation">
               <span style="margin-right: 15px;font-size: 14px">关系:</span>
               <el-checkbox style="margin-bottom: 10px" v-for="(item,index) in taskTypeListData" :key="index"
                            :label="item.id" v-if="item.taggingType == 'RELATION'" @change.native="clickitem(item)">
                 {{item.name}}
               </el-checkbox>
             </el-checkbox-group>
           </el-row>


           &lt;!&ndash;NER&ndash;&gt;
           <el-row>
             <el-checkbox-group v-model="labelTypeIdsArrNer" v-if="isHiddenNer">
               <span style="margin-right: 15px;font-size: 14px">NER:</span>
               <el-checkbox style="margin-bottom: 10px" v-for="(item,index) in taskTypeListData" :key="index"
                            :label="item.id" v-if="item.taggingType == 'NER'" @change.native="clickitem(item)">
                 {{item.name}}
               </el-checkbox>
             </el-checkbox-group>
           </el-row>

           &lt;!&ndash;目标分类&ndash;&gt;
           <el-row>
             <el-radio-group v-model="labelTypeIdsArrNerLabel">
               <span style="margin-right: 15px;font-size: 14px">目标分类:</span>
               <el-radio style="margin-bottom: 10px" v-for="(item,index) in taskTypeListData" :key="index"
                         :label="item.id" v-if="item.taggingType == 'NER_LABEL_1'" @change.native="clickitem(item)">
                 {{item.name}}
               </el-radio>
             </el-radio-group>
           </el-row>-->
        </el-card>

        <el-card class="box-card" style="margin-top:20px" shadow="never">
          <div slot="header" class="clearfix">
            <span class="span-title" style="font-weight: bold">数据集划分比例：训练集/验证集</span>
            <!--<el-input size="small" style="float: right; width: 280px;margin-left: 20px" v-model="TrainModel.data_size" placeholder="自定义输入（训练集+验证集=100%）"></el-input>-->
          </div>
          <el-row>
            <el-radio-group v-model="data_size">
              <el-radio label="90%:10%">90%：10%</el-radio>
            </el-radio-group>
            <el-input size="small" style="width: 280px;margin-left: 20px" v-model="data_size"
                      placeholder="自定义输入（训练集+验证集=100%）"></el-input>
          </el-row>
        </el-card>

        <el-card class="box-card" style="margin-top:20px" shadow="never">
          <div slot="header" class="clearfix">
            <span class="span-title" style="font-weight: bold">模型选择</span>
          </div>
          <el-row>
            <!--    <el-radio v-if="this.typeLabelsString.indexOf('LABEL_1') >= 0 || this.typeLabelsString.indexOf('LABEL_N') >= 0"  v-model="TrainModel.modelType" label="TEXTCNN">TC</el-radio>
                <el-radio v-if="this.typeLabelsString.indexOf('LABEL_1') >= 0 || this.typeLabelsString.indexOf('LABEL_N') >= 0" v-model="TrainModel.modelType" label="QA_LSTM">QA_LSTM</el-radio>
                <el-radio v-if="this.typeLabelsString ==='NER' " v-model="TrainModel.modelType" label="NER">NER</el-radio>
                <el-radio v-if="this.typeLabelsString.indexOf('RELATION') >= 0" v-model="TrainModel.modelType" label="RELATION">RELATION</el-radio>
                <div>1234567890</div>-->
            <el-radio-group v-model="TrainModel.modelType">
              <el-radio :label="item.modelType" v-for="(item,index) in modelTypeArr" :key="index">
                {{item.modelType}}
              </el-radio>
            </el-radio-group>

          </el-row>
        </el-card>

        <el-card class="box-card" style="margin-top:20px" shadow="never">
          <div slot="header" class="clearfix">
            <span class="span-title" style="font-weight: bold">高级设置</span>
            <el-button type="text" style="float: right;color: #354052;font-size: 14px;" @click="show2 = !show2">
              {{show2?'收起':'展开'}}
              <i v-if="show2" class="el-icon-caret-top el-icon--right"></i>
              <i v-else class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
          </div>
          <el-collapse-transition>
            <div v-show="show2" class="transition-box">
              <el-form ref="formLeft" :model="formLeft" label-width="100px" style="width: 80%"
                       :labelPosition="labelPosition">
                <h3>预处理</h3>
                <el-form-item label="停止词：">
                  <el-row>
                  <span class="LeftItem" v-for="(item,index) in this.stopWord">
                    <el-button size="mini">{{item}}</el-button>
                  </span>
                  </el-row>
                </el-form-item>
                <el-form-item label="词典：">
                  <el-row>
                <span class="LeftItem" v-for="(item,index) in this.Words">
                    <el-button size="mini">{{item}}</el-button>
                  </span>
                  </el-row>
                </el-form-item>
                <h3>分词工具</h3>
                <el-form-item label-width="0" label="">
                  <el-radio-group class="LeftItem" v-model="formLeft.fenci"
                                  v-for="(item,index) in participleArr" :key='index'>
                    <el-radio :label="item"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <h3>特征工程</h3>
                <el-form-item label="特征向量：">
                  <el-radio-group class="LeftItem" v-model="formLeft.vector"
                                  v-for="(item,index) in vectorArr" :key='index'>
                    <el-radio :label="item"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="特征：">
                  <el-checkbox-group v-model="feature" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="city in featureArr" :label="city" :key="city">{{city}}</el-checkbox>
                    <el-input-number v-if='feature.indexOf("ngram")>0' size="mini" v-model="data_ngram"
                                     style="display: inline-block" @change="handleChange" :min="2" :max="5"
                                     label="2-5"></el-input-number>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-transition>
        </el-card>

        <el-row type="flex" justify="center">
          <el-button type="success" size="small" @click="Train()" :loading="isUploading"
                     style="margin: 40px 0;width: 180px;height: 50px;font-size: 14px">训练并生效新模型
          </el-button>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import appHeader from '../../components/AppHeader';
  import corpusChoose from '../../components/CorpusChoose';
  import {informationService} from '../../service/index';
  import {SetCookie, getJoinCookie} from '../../utils/commonUtil';

  export default {
    name: "trainsetting",
    data() {
      return {
        //：句号（ 。）、问号（ ？）、感叹号（ ！）、逗号（ ，）顿号（、）、分号（；）和冒号（：） 空格space。
        segmentation: [],//数据分方式
        segmentationArr: ["。", "？", "！", "，", "、", "；", "：", "space", "line"],//数据分方式预选数组
        datatypeArr: [],
        isHiddenCategory: false,
        isHiddenRelation: false,
        isHiddenNer: false,
        taskTypeArr: '',//任务类型数组
        modelTypeArr: '',//选择分类下所支持的模型
        alpha_c: '1.0',//模型参数
        isUploading: false, //是否正在提交中
        taskInfo: {},
        labelTypeIdsArr: [],
        labelTypeIdsArrs: '',
        labelTypeIdsArrCategory: [],
        labelTypeIdsArrRelation: [],
        labelTypeIdsArrNer: [],
        labelTypeIdsArrNerLabel: [],
        data_ngram: '',
        modelTypeObj: {
          MACHINE_Arr: [],//机器学习
          DEEP_Arr: [],//深度学习
        },
        modelTypeObjCopy: {},
        TrainModel: {
          modelConfig: {},
          datasetIds: '',//数据集编号,多个逗号分隔 ,
          labelTypeIds: '', //标签类别编号,多个逗号分隔 ,
          taskId: '',//任务id，任务编号
          modelType: 'SVM', //模型类型,多个逗号分隔 ,
          modelTrainId: '', //模型训练编号 ,
        },
        data_size: '90%:10%',
        stopWord: [],
        feature: ['词性'],
        featureArr: ['词性', 'pinyin', 'ngram'],//特征
        Words: [],
        participleArr: ['jieba', 'hanlp', 'ansj'],//分词工具
        vectorArr: ['tfidf', 'word2vec'],//特征向量
        labelPosition: 'right',
        machineModel: {
          radio: '3',
          model: '1',
          checkList: [],
        },
        formLeft: {
          fenci: 'ansj',
          vector: 'tfidf'
        },
        show2: false,
        activeName: 'MACHINE_LEARNING',
        queryModel: {
          taskId: '',
          cp: 1,
          ps: 10
        },
        taskTypeListData: [],
        taskTypeListDataS: [],
        disabledM: false,
        typeLabelsString: 'RELATION,NER,LABEL_1,LABEL_N'
      }
    },
    components: {
      appHeader,
      corpusChoose
    },
    watch: {},
    methods: {
      acvb(val) {
        this.labelTypeIdsArrs=[];
        let data = [];
        for (let k = 0; k < val.length; k++) {
          for (let i = 0; i < this.taskTypeListData.length; i++) {
            if (val[k].taggingType === this.taskTypeListData[i].taggingType) {
              data.push(this.taskTypeListData[i])
            }
          }
        }
        this.taskTypeListDataS = data
      },
      handleChange() {

      },
      handleCheckedCitiesChange() {

      },
      ChangeSelectItem(){
        let arr = [];
        this.labelTypeIdsArrs.forEach((ite, index) => {
          for (let i = 0; i < this.taskTypeListData.length; i++) {
            if (ite === this.taskTypeListData[i].id) {
              arr.push(this.taskTypeListData[i].taggingType)
            }
          }

        })
        let mustTaggingTypes = arr.toString();
        this.getModelTypeChooseItem(this.activeName, mustTaggingTypes);
      },
      handleClick(value) {
        this.labelTypeIdsArr=[];
        this.labelTypeIdsArrs=[];
        this.taskTypeListDataS=[];
        this.modelTypeArr=[];
        this.getModelTypeItem(value.name);
        if (this.activeName == 'DEEP_LEARNING') {
          this.TrainModel.modelType = 'TEXTCNN';
          this.formLeft.vector = 'word2vec'
        } else {
          this.TrainModel.modelType = 'SVM';
          this.formLeft.vector = 'tfidf'
        }
      },
      resultParams(data) {
        this.TrainModel.datasetIds = data.join(',')
      },
      goPage2(page) {
        this.$router.push({
          path: page,
        });
      },
      //获取任务类型
      async getTaskType() {
        let result = await informationService.querylabelcategory(this.queryModel);
        if (result.message.code == 0) {
          this.taskTypeListData = result.data.list;
        }
      },
      async Train() {
        let Obj = this.TrainModel.modelConfig;
        this.TrainModel.modelConfig.stopword = this.stopWord;//停止词
        this.TrainModel.modelConfig.worddict = this.Words;//字典
        this.TrainModel.modelConfig.fenci = this.formLeft.fenci;//分词
        this.TrainModel.modelConfig.feature = this.feature;//特征
        this.feature.forEach((item, index) => {
          if (item === 'ngram') {
            let data = "ngram:" + this.data_ngram;
            this.feature.splice(index, 1, data)
          }
        });
        this.TrainModel.modelConfig.features_vector = this.formLeft.vector;//特征向量
        this.TrainModel.modelConfig.datatype = this.datatypeArr;//维度变量
        this.TrainModel.modelConfig.data_size = this.data_size;//数据集划分
        this.TrainModel.modelConfig.alpha_c = this.alpha_c;//模型参数
        this.TrainModel.modelConfig.segmentation = this.segmentation;//数据切分方式

        if (this.TrainModel.datasetIds == undefined || this.TrainModel.datasetIds.length == 0) {
          this.$message({
            showClose: true,
            message: '请选择语料集',
            type: 'error'
          });
          return
        }

        if (this.labelTypeIdsArr.length == 0) {
          this.$message({
            showClose: true,
            message: '请选择任务类型',
            type: 'error'
          });
          return
        }


        //将数组内id值转成字符串
        this.TrainModel.labelTypeIds = this.labelTypeIdsArrs.join(',');


        this.isUploading = true;
        let result = await informationService.modelTrain([this.TrainModel]);
        if (result.message.code == 0) {
          let target = this;
          target.isUploading = false;
          setTimeout(function () {
            target.goPage2('/trainresult?index=trainresult');
          }, 1250);
          this.$message({
            showClose: true,
            message: '提交成功',
            type: 'success'
          });
          this.feature = ['词性'];
        } else {
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },
      //cp=1&distictField=taggingType&learningTypes=MACHINE_LEARNING&ps=1000&showDisp=true
      //模型类型分组接口调用------获取任务类型相关数据
      async getModelTypeItem(choose) {
        let params = {
          cp: 1,
          ps: 100,
          distictField: 'taggingType',
          learningTypes: choose,
          showDisp: true
        };
        let result = await informationService.getModelTypeGroup(params);
        if (result.message.code === 0) {
          let obj = {};
          let temp = result.data.list
          temp.forEach((item, index) => {
            let key = item.modelTypeGroup;
            if (obj[key]) {
              obj[key].push(item)
            } else {
              obj[key] = [];
              obj[key].push(item)
            }
          });
          this.taskTypeArr = obj;
        }
      },
      //cp=1&distictField=modelType&learningTypes=MACHINE_LEARNING&mustTaggingTypes=LABEL_1&ps=1000&showDisp=true
      //模型类型分组接口调用------获取模型选择相关数据
      async getModelTypeChooseItem(learningTypes, mustTaggingTypes) {
        if(mustTaggingTypes===''){
          this.modelTypeArr=[]
        }else {
          let params = {
            cp: 1,
            ps: 100,
            distictField: 'modelType',
            learningTypes: learningTypes,
            mustTaggingTypes: mustTaggingTypes,
            showDisp: true
          };
          let result = await informationService.getModelTypeGroup(params);
          if (result.message.code === 0) {
            this.modelTypeArr = result.data.list;

          }
        }
      }

    },
    mounted: function () {
    },
    filters: {
      NameFilter(val) {
        if (val === "space") {
          return "空格"
        } else if (val === "line") {
          return "回车"
        } else {
          return val
        }

      }
    },
    created: function () {
      if (getJoinCookie('userId')) {
        let userid = getJoinCookie('userId');
        if (userid > 10) {
          this.disabledM = true;
          this.formLeft.fenci = 'jieba'
        }
      }
      this.taskInfo = JSON.parse(sessionStorage.getItem("taskInfo"));
      this.TrainModel.taskId = this.taskInfo.taskId;
      this.queryModel.taskId = this.taskInfo.taskId;
      this.getTaskType();
      this.getModelTypeItem("MACHINE_LEARNING");

    }
  }
</script>
<style>
  .neymar_div .el-tabs__nav {
    padding: 10px 0;
  }
</style>
<style scoped>
  .span-title {
    color: #354052;
    font-size: 14px;
  }

  .container {
    width: 100%;
    background-color: #EFF3F6;
    box-sizing: border-box;
    min-height: 100%;
  }

  .LeftItem {
    margin-right: 10px;
  }

  .radio_neymar .el-radio__label {
    padding-left: 0 !important;
    margin-left: -4px;
  }

  .neymar_text .el-textarea.is-disabled .el-textarea__inner {
    background-color: inherit;
    border-color: #E4E7ED;
    color: inherit;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    display: inline-block;
    padding-bottom: 15px;
  }

  .line {
    height: 2px;
    width: 100%;
    margin: 10px 0;
    background: rgb(228, 231, 237);
  }

  .transition-box {

  }
</style>
