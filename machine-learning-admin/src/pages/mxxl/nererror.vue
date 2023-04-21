<template>
  <div>
    <el-row type="flex" style="height: 60px;line-height: 60px;background-color: #FFFFFF;">
      <el-col align="left" style="padding-left: 30px;padding-top: 20px">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: 'trainresult?index=trainresult' }">模型训练</el-breadcrumb-item>
          <el-breadcrumb-item>错误分析{{errorTitle}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>


    <div style="margin: 20px">
      <el-table :data="nerErrorData" border v-loading="showListLoading">
        <el-table-column prop="content" label="人工标注">
          <template slot-scope="scope">
            <p @click="goPage('/mxxlcorpustaging?index='+$route.query.index+'',scope.row)" class="ellipsis" style="cursor: pointer">
              <span style="padding: 3px 0;display: inline-block" v-for="(item,index) in scope.row.content" :key="index" :data-index="item.id" v-html="item.name"></span>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="机器标注">
          <template slot-scope="scope">
            <p @click="goPage('/mxxlcorpustaging?index='+$route.query.index+'',scope.row)" class="ellipsis"
               style="cursor: pointer">
              <span style="padding: 3px 0;display: inline-block" v-for="(item,index) in scope.row.robotcontent" :key="index" :data-index="item.id" v-html="item.name"></span>
            </p>
          </template>
        </el-table-column>
      </el-table>
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
    </div>
  </div>
</template>

<script>
  import appHeader from '../../components/AppHeader';
  import {informationService} from '../../service/index';

  export default {
    name: "nererror",
    data() {
      return {
        errorTitle: '',
        nerErrorData: [],
        taskInfo: {},
        dataModel: {},
        showListLoading: false,
        loadingLeft: false,
        loadingRight: false,
        dictionaryColor:[],
        labelTypeModel:{},
        queryModel: {
          page: 1,
          size: 10
        },
        totalCount: 0,
      }
    },
    components: {
      appHeader
    },
    watch: {},
    methods: {
      //点击分页
      pageChange(page) {
        this.queryModel.cp = page;
        this.getList();
      },
      goPage(page, row) {
        this.$router.push({
          path: page,
          query: {
            humanLabelId: this.$route.query.humanLabelId,
            robotLabelId: this.$route.query.robotLabelId,
            labelTypeId: this.$route.query.labelTypeId,
            resultType:row.resultType,
            modelTrainId:row.modelTrainId,
            datasetId:row.datasetId,
            ids: row.id
          }
        });
      },
      //获取数据列表  verifyStatus: 0 已确认:1,未确认-0
      async getList() {
        let result = await informationService.corpusCheckconfusion(this.queryModel, this.$route.query.labelType);
        debugger
        if (result.message.code == 0) {
          this.nerErrorData = result.data.list;
          if (this.nerErrorData.length > 0) {
            if (this.nerErrorData.length > 0) {
              this.nerErrorData.forEach((ErrorItem,ErrorIndex)=>{
                let temp;
                temp = ErrorItem.corpus;
                let PrelabelTypeArr=this.$route.query.labelTypeId.toString().split(",");
                let arrTemp = JSON.parse(JSON.stringify(temp.humanLabels));
                arrTemp.forEach((ie,delIn)=>{
                  if(PrelabelTypeArr.indexOf(ie.labelTypeId) === -1){
                    temp.humanLabels.forEach((m,n)=>{
                      if(m.labelTypeId===ie.labelTypeId){
                        temp.humanLabels.splice(n,1)
                      }
                    })
                  }
                });
                temp.humanLabels.forEach((ite, inde) => {
                  if (!ite.labelInfos) {
                    ite.labelInfos = []
                  } else if (ite.labelInfos.length > 0) {
                    ite.labelInfos.forEach((a, b) => {
                      if (a.taggingDetail) {
                        let dd = a.taggingDetail.replace(/'/g, '"');
                        a.taggingDetail = JSON.parse(dd)
                      }
                    })
                  }
                });
                if(ErrorItem.robotLabels){
                  ErrorItem.robotLabels.forEach((ite, inde) => {
                    if (!ite.labelInfos) {
                      ite.labelInfos = []
                    } else if (ite.labelInfos.length > 0) {
                      ite.labelInfos.forEach((a, b) => {
                        if (a.taggingDetail != '') {
                          let cc = a.taggingDetail.replace(/'/g, '"');
                          a.taggingDetail = JSON.parse(cc)
                        }
                      })
                    }
                  });
                }
                let str = temp.content.split("");
                let arr = [];
                let arrRobot = [];
                str.forEach((item, index) => {
                  let obj = {
                    name: item,
                    id: index
                  };
                  arr.push(obj)
                  arrRobot.push(obj)
                });
                ErrorItem.content = arr;
                ErrorItem.robotcontent = arrRobot;
                ErrorItem.keywords = [];
                ErrorItem.robotLabelskeywords = [];
                ErrorItem.corpus.humanLabels.forEach((item, index) => {
                  if (item.labelInfos) {
                    item.labelInfos.forEach((ite, inx) => {
                      if (ite.taggingDetail) {
                        ite.taggingDetail.forEach((it, ix) => {
                          let obj = {
                            anchorOffset: it.end_span,
                            focusOffset: it.start_span,
                            text: it.ner,
                            labelName: ite.labelName,
                            labelId: ite.labelId,
                            labelType: {
                              id: item.labelTypeId
                            }
                          };
                           ErrorItem.keywords.push(obj)
                        })
                      }
                    })
                  }
                });
                if(ErrorItem.robotLabels){
                  ErrorItem.robotLabels.forEach((item, index) => {
                    if (item.labelInfos) {
                      item.labelInfos.forEach((ite, inx) => {
                        if (ite.taggingDetail) {
                          ite.taggingDetail.forEach((it, ix) => {
                            let obj = {
                              anchorOffset: it.end_span,
                              focusOffset: it.start_span,
                              text: it.ner,
                              labelName: ite.labelName,
                              labelId: ite.labelId,
                              labelType: {
                                id: item.labelTypeId
                              }
                            };
                            ErrorItem.robotLabelskeywords.push(obj)
                          })
                        }
                      })
                    }
                  });
                }
                this.highlightText(ErrorItem.content,ErrorItem.keywords)
                this.highlightText(ErrorItem.robotcontent,ErrorItem.robotLabelskeywords)
              });
              this.queryModel.cp = result.data.currentPage;
              this.totalCount = result.data.totalCount;
            }
          }

        }
      },
      highlightText(sourceText, keywords,type) {
        let colorIndex='';
        let this_=this;
        if (!sourceText)
          return '';
        if (!keywords)
          return sourceText;
        keywords.forEach(function (item) {
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
            }
          });
          let ColorArr=['bgcolor1','bgcolor2','bgcolor3','bgcolor4','bgcolor5','bgcolor6','bgcolor7','bgcolor8','bgcolor9','bgcolor10'];
          let arrI={
              id:ids,
              name:'<b class="ChooseLabel '+ ColorArr[colorIndex]+'"><span>'+ item.labelName +'：</span>' + item.text + '</b>'
            };

          sourceText.splice(deleteids[0], deleteids.length , arrI);
          window.getSelection().removeAllRanges();
        });
        this.LabelVisible=false;
        return sourceText;
      },
      //颜色字典表
      async getLabelTypeArr() {
        this.labelTypeModel.taskId = this.queryModel.taskId;
        let result = await informationService.labelClasses(this.labelTypeModel);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          let dictionaryNeed=[];
          tempArr.forEach((item, index) => {
            if(item.taggingType=="NER" || item.taggingType=="RELATION" || item.taggingType=="NER_LABEL_1"){
              dictionaryNeed.push(item.id)
            }
          });
          this.getdictionaryDialog(dictionaryNeed.toString());
          this.getList();

        }
      },
      async getdictionaryDialog(id) {
        let data = {
          taskId: this.queryModel.taskId,
          labelTypeIds: id,
          ps: 10000
        };
        debugger
        let result = await informationService.querylabel(data);

        if (result.message.code == 0) {
          let tempArr = result.data.list;
          this.dictionaryColor = [];
          tempArr.forEach((item, index) => {
            let colorObj={
              name: item.name,
              colorIndex:index
            };
            this.dictionaryColor.push(colorObj);
          });
        }
      },
    },
    mounted: function () {
    },
    created: function () {
      this.taskInfo = JSON.parse(sessionStorage.getItem("taskInfo"));
      this.queryModel.taskId = this.taskInfo.taskId;
      this.queryModel.resultType = this.$route.query.formUrl;
      this.queryModel.modelTrainId = this.$route.query.modelTrainId;
      this.queryModel.modelTrainId = this.$route.query.modelTrainId;
      this.queryModel.humanLabelId = this.$route.query.humanLabelId;
      this.queryModel.robotLabelId = this.$route.query.robotLabelId;

      if (this.$route.query.confusionLabels.length >0){
          this.queryModel.confusionLabels = this.$route.query.confusionLabels;
      }else {
          this.queryModel.labelTypeId = this.$route.query.labelTypeId;
      }

      debugger
      this.getLabelTypeArr();


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

  .goDT {
    text-align: left;
    cursor: pointer;
    color: rgb(64, 155, 258)
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
