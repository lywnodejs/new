<template>
  <div style="background-color: #EFF3F6;">

    <el-row type="flex" style="height: 60px;line-height: 60px;background-color: #FFFFFF;">
      <el-col align="left" style="padding-left: 30px;padding-top: 20px">
        <el-breadcrumb separator="/" >
          <el-breadcrumb-item :to="{ path: '/corpusmaintenance?index=corpusmaintenance' }">语料样本集</el-breadcrumb-item>
          <el-breadcrumb-item>语料搜索</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row>
      <el-card class="box-card" shadow="never" style="margin:20px; min-height: 100%">
        <el-form ref="queryModel" :inline="true"  :model="queryModel" label-width="80px">
          <el-form-item label="">
            <el-input size="small" style="width: 510px" v-model="queryModel.content"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="success" @click="getList">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-form ref="queryModel" :inline="true"  :model="queryModel" label-width="80px">
          <el-form-item label="">
            <span>语料集</span>
            <el-select size="small" style="width: 160px" v-model="queryModel.datasetId" placeholder="语料集" filterable @change="change()">
              <el-option v-for="(item,index) in CorpusArr" :key="index" :label="item.name" :value="item.id" ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <template>
              <el-checkbox-group v-model="checked" @change="change()">
                <el-checkbox   >按对话顺序排序(适用对话语料)</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>

          <el-form-item label="" style="margin-left: 20px">
            <span>标签</span>
            <el-select size="small" style="width: 160px" v-model="LabelModel.labelTypeIds" placeholder="标签类型" filterable @change="change2()">
              <el-option v-for="(item,index) in LabelTypeOptions" :key="index" :label="item.name" :value="item.id" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=""  >
            <el-select size="small" style="width: 160px" v-model="LabelModel.humanLabelId" placeholder="标签值" filterable @change="labelTypeChange()">
              <el-option v-for="(item,index) in LabelArr" :key="index" :label="item.name" :value="item.id" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" style="margin-left: 20px">
            <span>标注状态</span>
            <el-select size="small" style="width: 160px" v-model="HumanLabelStatusAA" placeholder="标注状态" @change="change()">
              <el-option label="全部" value=""></el-option>
              <el-option label="已标注" value="1"></el-option>
              <el-option label="未标注" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div v-if="totalCount>0" style="margin-bottom: 20px;color: rgb(151,161,158);font-size: 18px">为您找到相关结果{{this.totalCount}}个</div>
      <el-table :data="listData" v-loading="showListLoading" :show-header="false" >
        <el-table-column label="标注进度" prop="content">
          <template slot-scope="scope">
             <div @click="goPage('/corpustaging?index=corpusmaintenance',scope.$index )"  class="ellipsis" style="cursor: pointer">
                <!--{{scope.row.content}}-->

               <span  v-for="(item,index) in parsingData(scope.row)" :key="index" :data-index="item.id" v-html="item.name"></span>

             </div>

            <div style="margin-top: 5px" v-for="(item,index) in LabelTypeOptions" :key="index" v-if="item.taggingType!='NER' && item.taggingType!='RELATION' && item.taggingType!='ALL'">

              <span v-if="humanLabelFilter(item.name,scope.row.humanLabels).length > 0  || humanLabelFilter(item.name,scope.row.robotLabels).length >0" style="font-weight: bold">{{item.name}} > </span>
              <span v-if="humanLabelFilter(item.name,scope.row.humanLabels).length > 0 ">人工标签：</span>

                 <span class="humanlabelClass" v-for="(ite,index) in humanLabelFilter(item.name,scope.row.humanLabels)">
                     {{ite.labelName}}
                 </span>

              <span v-if="humanLabelFilter(item.name,scope.row.robotLabels).length >0">机器预测：</span>
                 <span class="robotlabelClass" v-for="(ite,indx) in humanLabelFilter(item.name,scope.row.robotLabels)">
                     {{ite.labelName}}
                 </span>

              <span v-if="confidenceFilter(item.name,scope.row.robotLabels) !=''">置信度：{{confidenceFilter(item.name,scope.row.robotLabels)}}</span>
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
                           @current-change="pageChange"
            >
            </el-pagination>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import appHeader from '../../components/AppHeader';
  import {informationService} from '../../service/index';
  import {mapActions, mapState} from 'vuex';

  export default {
    name: "sdada",
    data() {
      return {

        humanLabels:[],
        CorpusArr:[
          {
            name:'全部',
            id:''
          }
        ],//语料数组
        HumanLabelStatusAA:'',
        LabelTypeOptions:[],
        LabelArr:[
          {
            name:'全部',
            id:''
          }
        ],//标签数组
        taskInfo:'',
        corpusSearchModel:{},
        listData: [],
        showListLoading: false,
        queryModel: {
          cp: 1,
          ps: 10
        },
        LabelModel: {
          cp: 1,
          humanLabelId:'',
          labelTypeIds:'',
          ps: 10000
        },
        totalCount: 0,
        fileList3: [],
        checked: false,
        dictionaryColor:[],//颜色字典表
      }
    },
    methods: {
      goPage(page,row) {
       this.setSessionStorageData();
        this.$router.push({
          path: page,
          query: {
            // datasetId:row.id,l
            list:this.listData,
            selectedIndex:row
          }
        });
      },
      indexFilter(index) {
        return index + 10 * (this.queryModel.cp - 1) + 1;
      },

      labelTypeChange(){

        // console.log('LabelTypeOptions' +this.LabelModel.labelTypeIds);
        // console.log('LabelTypeOptions' +this.LabelTypeOptions);
        // console.log('LabelArr' +this.LabelArr);
        // console.log('LabelModel.humanLabelId' +this.LabelModel.humanLabelId);

        for (var i=0;i<this.LabelArr.length;i++){
          let item = this.LabelArr[i];
          if (item.id == this.LabelModel.humanLabelId) {
            this.LabelModel.labelTypeIds = item.labelTypeName;
            for (var j=0;j<this.LabelTypeOptions.length;j++){
              let item2 = this.LabelTypeOptions[j];
              if (item2.name == item.labelTypeName){
                this.LabelModel.labelTypeIds = item2.id;
                break
              }
            }
            break
          }
        }
        if (this.HumanLabelStatusAA == ""){
          this.HumanLabelStatusAA = '0'
        }
        this.change()
      },
      //标签值 id
      change(){
        this.queryModel.cp = 1;
        this.getList();
      },

      //标签id
      change2(){
        this.LabelArr=[
          {
            name:'全部',
            id:''
          }
        ];
        this.LabelModel.humanLabelId='';
        this.queryModel.cp = 1;

        this.getList();
        this.getLabelArr()
      },
      //点击分页
      pageChange(page) {
        this.queryModel.cp = page;
        this.getList();
      },
      //获取数据列表
      async getList() {

        this.showListLoading=true;
        if(this.queryModel.labelTypeIds!='' && this.queryModel.labelTypeIds!=undefined){
           this.queryModel.humanLabelStatus=this.HumanLabelStatusAA;
           this.queryModel.superiorHumanLabelStatus=''
        }else {
          this.queryModel.humanLabelStatus='';
          this.queryModel.superiorHumanLabelStatus=this.HumanLabelStatusAA
        }

        //LabelModel  labelTypeIds humanLabelId
        this.queryModel.labelTypeIds=this.LabelModel.labelTypeIds;
        this.queryModel.humanLabelId=this.LabelModel.humanLabelId;


        //解决多伦标注问题
        if (this.checked){

          this.queryModel.direction = 'ASC';
          this.queryModel.orderBy = 'filePath,contentIndex';
        }else {
          this.$delete(this.queryModel,'direction');
          this.$delete(this.queryModel,'orderBy');
        }

        let result = await informationService.corpusCheck(this.queryModel);



        if (result.message.code == 0) {
          this.showListLoading=false;
          this.listData = result.data.list;
          this.totalCount = result.data.totalCount;
          this.queryModel.cp = result.data.currentPage;
        }
      },

      //解析需要加载的数据
      parsingData(data){

        this.keywords=[];
        var strArr = data.content.split('');
        let arr=[];
        strArr.forEach((item,index)=>{
          let obj={
            name:item,
            id:index
          };
          arr.push(obj)
        });
        data.humanLabels.forEach((item,index)=>{

          if (item.taggingType == "NER") {

            if(item.labelInfos){
              item.labelInfos.forEach((ite,inx)=>{
                if(ite.taggingDetail){
                  let dd= ite.taggingDetail.replace(/'/g, '"');
                  let taggingDetail = JSON.parse(dd)
                  taggingDetail.forEach((it,ix)=>{
                    let obj={
                      anchorOffset:it.end_span,
                      focusOffset:it.start_span,
                      text:it.ner,
                      labelName:ite.labelName,
                      labelId:ite.labelId,
                      labelType:{
                        id:item.labelTypeId
                      }
                    };
                    this.keywords.push(obj);
                  })
                }
              })
            }
          }
        });

        if (this.keywords.length > 0){

          return this.highlightText(arr,this.keywords);

        } else {

          return arr;
        }

      },
      async getCorpusArr() {
        this.queryModel.ps=1000;
        let result = await informationService.querycorpus(this.queryModel);
        if (result.message.code == 0) {
          let tempArr=result.data.list;
          tempArr.forEach((item,index)=>{
              let obj={
                name:item.name,
                id:item.id
              };
            this.CorpusArr.push(obj)
          })
        }
      },
      //搜索
      onSearch(){
        debugger
        getList()
      },
      async getLabelArr() {
        this.LabelModel.taskId=this.queryModel.taskId;
        let result = await informationService.querylabel(this.LabelModel);

        if (result.message.code == 0) {
          // this.LabelArr = result.data.list;
          let tempArr=result.data.list;
          this.LabelArr=[
            {
              name:'全部',
              id:''
            }
          ]
          tempArr.forEach((item,index)=>{
            let obj={
              name:item.name,
              id:item.id,
              labelTypeName:item.labelType.name
            };
            this.LabelArr.push(obj)
          })
        }
      },

      confidenceFilter: function (val,data) {
        let arr = data;
        let confidence = '';
        if (arr) {
          arr.forEach((item, index) => {

            if (item.labelTypeName == val){
              if (item.labelInfos && item.confidence) {
                confidence = item.confidence;
              }
            }
          });
        }
        return confidence;
      },

      humanLabelFilter: function (val,data) {
        let arr = data;
        let item_arr = [];
        if (arr) {
          arr.forEach((item, index) => {
            if (item.labelTypeName == val){
              if (item.labelInfos) {

                // console.log("满足条件的" + JSON.stringify(item.labelInfos));
                item_arr = item.labelInfos;
              }
            }
          });
        }
        return item_arr;
      },
      async getLabelTypeArr() {
        this.LabelModel.taskId=this.queryModel.taskId;
        this.LabelTypeOptions.splice(0);
        let result = await informationService.labelClasses(this.LabelModel);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          let dictionaryNeed=[];
          this.LabelTypeOptions = [{name: '全部', id: '', taggingType: 'ALL'}];
          tempArr.forEach((item, index) => {
            if(item.taggingType=="NER" || item.taggingType=="RELATION"){
              dictionaryNeed.push(item.id)
            }
            let obj = {
              taggingType: item.taggingType,
              name: item.name,
              id: item.id
            };
            this.LabelTypeOptions.push(obj);
          });
          this.getdictionaryDialog(dictionaryNeed.toString());
        }
      },

      //颜色字典表
      async getdictionaryDialog(id) {
        let data = {
          taskId: this.queryModel.taskId,
          labelTypeIds: id,
          ps: 10000
        };
        let result = await informationService.querylabel(data);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          this.dictionaryColor = []
          tempArr.forEach((item, index) => {
            let colorObj={
              name: item.name,
              colorIndex:index
            };
            this.dictionaryColor.push(colorObj);
          });
        }
      },
      //绘制标注
      highlightText(sourceText, keywords) {
        if (!sourceText)
          return '';
        if (!keywords)
          return sourceText;
        let colorIndex='';
        let this_=this;
        keywords.forEach(function (item,index) {
          let deleteids=[];
          let ids=[];
          for(let i= item.focusOffset;i<item.anchorOffset+1;i++){
            ids.push(i);
            sourceText.forEach((a,b)=>{
              if(a.id==i){
                deleteids.push(b);
              }
            })
          }
          this_.dictionaryColor.forEach((itx,inx)=>{
            if(item.labelName===itx.name){
              colorIndex=itx.colorIndex
              if(itx.colorIndex>9){
                colorIndex=0
              }
            }
          });
          let ColorArr=['bgcolor1','bgcolor2','bgcolor3','bgcolor4','bgcolor5','bgcolor6','bgcolor7','bgcolor8','bgcolor9','bgcolor10'];
          let arrI={
            id:ids,
            name:'<b class="markLabelClass '+ ColorArr[colorIndex]+'"><span>'+ item.labelName +'：</span>' + item.text + '</b>'
          };

          console.log(arrI)
          sourceText.splice(deleteids[0], deleteids.length , arrI);
          window.getSelection().removeAllRanges();
        });
        return sourceText;
      },
      //解析缓存数据
      getSessionStorageData(){

        this.queryModel = JSON.parse(sessionStorage.getItem("queryModel"));
        this.LabelModel = JSON.parse(sessionStorage.getItem("LabelModel"));
        this.CorpusArr  = JSON.parse(sessionStorage.getItem("CorpusArr"));
        this.listData   = JSON.parse(sessionStorage.getItem("listData"));
        this.totalCount = JSON.parse(sessionStorage.getItem("totalCount"));
        this.checked    = JSON.parse(sessionStorage.getItem("checked"));

        this.HumanLabelStatusAA = sessionStorage.getItem("HumanLabelStatusAA");

        if (this.HumanLabelStatusAA == "已标注"){
          this.HumanLabelStatusAA = "1";
        } else if(this.HumanLabelStatusAA == "未标注"){
          this.HumanLabelStatusAA = "0";
        }
        sessionStorage.removeItem("queryModel");
        sessionStorage.removeItem("LabelModel");
        sessionStorage.removeItem("HumanLabelStatusAA");
        sessionStorage.removeItem("CorpusArr");
        sessionStorage.removeItem("listData");
        sessionStorage.removeItem("totalCount");
      },
      setSessionStorageData(){

        let labelModelStr  = JSON.stringify(this.LabelModel);
        let queryModelStr  = JSON.stringify(this.queryModel);
        let corpusArrlStr  = JSON.stringify(this.CorpusArr);
        let listDatalStr   = JSON.stringify(this.listData);
        let totalCount     = JSON.stringify(this.totalCount);

        let humanLabelStatusAAStr = '';

        if (this.HumanLabelStatusAA == "1"){
          humanLabelStatusAAStr = "已标注";
        } else if(this.HumanLabelStatusAA == "0"){
          humanLabelStatusAAStr = "未标注";
        }
        sessionStorage.setItem("LabelModel",labelModelStr);
        sessionStorage.setItem("queryModel",queryModelStr);
        sessionStorage.setItem("HumanLabelStatusAA",humanLabelStatusAAStr);
        sessionStorage.setItem("CorpusArr",corpusArrlStr);
        sessionStorage.setItem("listData",listDatalStr);
        sessionStorage.setItem("totalCount",totalCount);
        sessionStorage.setItem("checked", JSON.stringify(this.checked));
      },
    },
    components: {
      appHeader
    },
    mounted: function () {
    },
    watch: {

    },
    created: function () {

        if (sessionStorage.getItem("queryModel") && sessionStorage.getItem("LabelModel")){

          this.getSessionStorageData();

        }else {

          this.taskInfo= JSON.parse(sessionStorage.getItem("taskInfo"));
          this.queryModel.taskId=this.taskInfo.taskId;
          this.getCorpusArr();
          // this.getList();
        }
         this.getLabelArr();
         this.getLabelTypeArr()

    }
  }
</script>

<style scoped>

  .markLabelClass{    position: relative;  font-weight: normal;}

  .humanlabelClass{
    display: inline-block;box-sizing: border-box;padding:0 5px;border-radius: 5px;color: #fff;border: solid 1px #F7981C;background-color:#F7981C; font-size: 12px;line-height: 20px;margin-right: 5px;
  }
  .robotlabelClass{
    display: inline-block;box-sizing: border-box;padding:0 5px;border-radius: 5px;color: #fff;border: solid 1px #7F8FA4;background-color:#7F8FA4; font-size: 12px;line-height: 20px;margin-right: 5px;
  }
  .humanSta1{
    display: inline-block;box-sizing: border-box;padding:0 5px;border-radius: 5px;color: rgb(80,188,94);border: solid 1px  rgb(80,188,94);font-size: 12px;line-height: initial;
  }
  .humanSta0{
    display: inline-block;box-sizing: border-box;padding:0 5px;border-radius: 5px;color: rgb(73,168,421);border: solid 1px rgb(73,168,421);font-size: 12px;line-height: initial;
  }
.ellipsis{
  line-height: 18px;
  max-height: 54px; overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp:3;
  -webkit-box-orient: vertical;
}
</style>
