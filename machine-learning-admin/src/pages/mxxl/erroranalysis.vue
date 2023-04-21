<template>
  <div>
    <el-row type="flex" style="height: 60px;line-height: 60px;background-color: #FFFFFF;">
      <el-col align="left" style="padding-left: 20px;padding-top: 22px">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path:$route.query.index+'?index='+$route.query.index}">模型训练</el-breadcrumb-item>
<!--          <el-breadcrumb-item v-if="this.leftTitle!=''">{{leftTitle}}和{{RightTitle}}的错误语料</el-breadcrumb-item>-->
          <el-breadcrumb-item>错误分析</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
<!--humanLabelId=8344&robotLabelId=9407&humanLabel=化工&robotLabel=其他&formUrl=VERIFY&labelType=LABEL_1&labelTypeId=318-->
<!--&modelTrainId=736&formUrl=VERIFY&labelType=LABEL_1&labelTypeId=318&humanLabelId=8344&robotLabelId=8344-->
    <el-row>
      <el-form style="padding: 5px 0 0;background: #fff;border: solid 1px #DFE2E5;border-bottom: none" :inline="true"
               :model="queryModel" class="demo-form-inline">
        <el-form-item label="审核状态：" style="margin-bottom: 0;margin-left: 20px" class="neymar">
          <el-radio-group v-model="queryModel.verifyStatus" size="small" @change="changeSearch()">
            <el-radio-button label="0">未确认</el-radio-button>
            <el-radio-button style="margin-left: 10px;border-left: solid 1px #DFE2E5;" label="1">已确认</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="float: right;margin-bottom: 0">
          <div>
            <p style="float: right;width: 200px;margin-top: 16px">
              <el-progress :percentage="parseInt(humanLabelNumberTotalNumber)" :stroke-width="14"
                           color="#45B854">
              </el-progress>
            </p>
            <span style="float: right;margin-right: 10px">已确认:
            <span style="color:#45B854;font-size: 30px">{{this.verifyStatusZero}}</span>
            <span style="color: #000000;font-size: 18px;">&nbsp;/&nbsp;{{this.totalCount}}</span>
          </span>
            <div style="clear: both"></div>
          </div>
        </el-form-item>
        <div style="clear: both"></div>
      </el-form>
    </el-row>

    <el-row>
      <el-table :data="listData" v-loading="showListLoading" :show-header="false">
        <el-table-column label="标注进度" prop="content">
          <template slot-scope="scope">
            <div @click="goPage('/erroranalysisdetail',scope.row)" class="ellipsis" style="cursor: pointer">
              <!--{{scope.row.content}}-->
              <span v-for="(item,index) in parsingData(scope.row)" :key="index" :data-index="item.id"
                    v-html="item.name"></span>
            </div>

            <div style="margin-top: 5px" v-for="(item,index) in LabelTypeOptions" :key="index" v-if="item.taggingType!='NER' && item.taggingType!='RELATION' && item.taggingType!='ALL'">
              <span
                v-if="humanLabelFilter(item.name,scope.row.humanLabels).length > 0  || humanLabelFilter(item.name,scope.row.robotLabels).length >0"
                style="font-weight: bold">{{item.name}} > </span>
              <span v-if="humanLabelFilter(item.name,scope.row.humanLabels).length > 0 ">人工标签：</span>

              <span class="humanLabel list" v-for="(ite,index) in humanLabelFilter(item.name,scope.row.humanLabels)">
                     {{ite.labelName}}
                 </span>

              <span v-if="humanLabelFilter(item.name,scope.row.robotLabels).length >0">机器预测：</span>
              <span class="RobotLabel list" v-for="(ite,indx) in humanLabelFilter(item.name,scope.row.robotLabels)">
                     {{ite.labelName}}
                 </span>
              <span v-if="confidenceFilter(item.name,scope.row.robotLabels) !=''">置信度：{{confidenceFilter(item.name,scope.row.robotLabels)}}</span>
            </div>

          </template>

        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="zoom-pagi" style="padding: 20px;background-color: #fff">
      <el-col type="flex" justify="center">
        <el-pagination align="center"
                       :current-page.sync="queryModel.cp"
                       :page-size="queryModel.ps"
                       :total="ListtotalCount"
                       :page-sizes="[10, 20, 30, 40, 50]"
                       class="pagination"
                       layout="sizes, total, prev, pager, next, jumper"
                       @current-change="pageChange"
                       @size-change="pageSizeChange"
        >
        </el-pagination>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import appHeader from '../../components/AppHeader';
  import VueAudio from '../../components/VueAudio';
  import {informationService} from '../../service/index';
  import {mapActions, mapState} from 'vuex';

  export default {
    name: "corpushtaging",
    data() {
      return {
        TestModelObj: {},
        corpusContentLoading: false,//loading
        LabelTypeClass: 'LABEL_1',//LABEL_1  NER
        modelTrainId: '',
        resultType: '',
        humanLabelNumberTotalNumber: 0,
        numberModel: {},
        verifyStatusOne: '',//已确认
        verifyStatusZero: 0,//未确认
        leftTitle: '',
        RightTitle: '',
        labelModel: {
          ps: 10000
        },
        searchStr: '',//标签搜索
        dataModel: {},
        robotLabels: [],//另外取值机器预测标签值
        SureBtn: false,
        LabelArrDialog: [],
        ALLLabelArr: [],//全部标签值
        LABEL_NList: [],//多选选中数据
        LABEL_N1: '',//单选选中数据
        LabelVisible: false,//标签列表弹窗
        ShowLabelTypeArr: [],//语料下方展示标注信息
        labelTypeModel: {//分类
          ps: 10000
        },
        D_N_Ner: '',
        Dtag: true,
        radio: '',
        loading: true,
        listData: [],
        LabelArr: [],
        SLabelArr: [],
        showListLoading: false,
        queryModel: {
          verifyStatus: "0",
          orderBy: 'verifyAt',
          direction: 'DESC',
          deleteStatus: '0',
          labelTypeId: '',
          cp: 1,
          ps: 10,
        },
        totalCount: 0,
        ListtotalCount: 0,//列表版总数
        RightShow: 0,
        options: [
          {name: '全部', id: ''}
        ],
        DPage: 1,//当前页

      }
    },
    methods: {
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
      parsingData(data) {
        this.keywords = [];
        var strArr = data.corpus.content.split('');
        let arr = [];
        strArr.forEach((item, index) => {
          let obj = {
            name: item,
            id: index
          };
          arr.push(obj)
        });
        data.humanLabels.forEach((item, index) => {

          if (item.taggingType == "NER") {

            if (item.labelInfos) {
              item.labelInfos.forEach((ite, inx) => {
                if (ite.taggingDetail) {

                  var taggingDetail = JSON.parse(ite.taggingDetail);

                  taggingDetail.forEach((it, ix) => {
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
                    this.keywords.push(obj);
                  })
                }
              })
            }
          }
        });

        if (this.keywords.length > 0) {

          return this.highlightText(arr, this.keywords);

        } else {

          return arr;
        }

      },
      Deletecorpu() {
        this.$confirm('删除该语料相关子任务的语料也会消失，确定删除吗？', '提示', {type: 'warning'}).then(() => {
          this.confirmDelete(this.dataModel.id)
        }).catch(() => {
        });
      },
      async confirmDelete(id) {
        let data = {
          ids: id,
        };
        let result = await informationService.Deletecorpu(data);
        if (result.message.code == 0) {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          });
          this.queryModel.cp = this.DPage;
          this.getList();
          this.getListByverifyStatusTo();
        }
      },
      showLabel() {
        this.LabelVisible = true;
      },
      changeSearch() {
        this.DPage = 1;
        this.queryModel.cp = this.DPage;
        this.getList()
      },
      // 下一页
      next() {
        this.DPage++;
        this.queryModel.cp = this.DPage;
        // if (this.radio && this.radio != this.dataModel.humanLabelId) {
        //   this.corpusBiaozhu()
        // }
        this.getList();
      },
      // 上一页
      prev() {
        this.DPage--;
        if (this.DPage < 1) {
          this.DPage = 1;
        }
        this.queryModel.cp = this.DPage;
        this.getList();
      },
      goPage(page,row) {
        this.$router.push({
          path: page+'?index='+this.$route.query.index,
          query:{
            formUrl : this.$route.query.formUrl,
            modelTrainId: this.$route.query.modelTrainId,
            labelTypeId: this.$route.query.labelTypeId,
            labelType:this.$route.query.labelType,
            humanLabelId:this.$route.query.humanLabelId,
            robotLabelId:this.$route.query.robotLabelId,
            Cpindex:row.Cpindex,
            verifyStatus:this.queryModel.verifyStatus,
          }
        });
      },
      indexFilter(index) {
        return index + 10 * (this.queryModel.cp - 1) + 1;
      },
      searchL() {
        this.DPage = 0;
        this.DPage++;
        this.queryModel.cp = this.DPage;
        this.getList();
      },
      //点击分页
      pageChange(page) {
        this.queryModel.cp = page;
        this.getList();
      },
      pageSizeChange(ps){
        this.queryModel.ps = ps;
        this.getList();
      },

      //获取数据列表  verifyStatus: 0 已确认:1,未确认-0
      async getList() {
        this.corpusContentLoading = true;
        let result = await informationService.corpusCheckconfusion(this.queryModel, this.$route.query.labelType);
        if (result.message.code == 0) {
          this.corpusContentLoading = false;
          let arrResult = result.data.list;
          arrResult.forEach((item,index)=>{
            item.Cpindex=index+1
          })
          this.listData = arrResult;

          if (this.DPage > 1 && this.listData.length === 0 && this.queryModel.verifyStatus === '0') {
            this.DPage = 1;
            this.queryModel.cp = this.DPage;
            this.getList();
          }
          this.RightShow = result.data.totalCount;
          if (this.listData.length > 0) {
            this.dataModel = result.data.list[0].corpus;
            this.TestModelObj = result.data.list[0].corpus;
            this.robotLabels = result.data.list[0].robotLabels;
            this.modelTrainId = result.data.list[0].modelTrainId;
            this.resultType = result.data.list[0].resultType
            // this.radio = Number(this.dataModel.humanLabelId);
            this.queryModel.cp = result.data.currentPage;
            this.ListtotalCount = result.data.totalCount;
            this.reviseLabel(this.D_N_Ner, this.dataModel, 'getlist');
          }
        }
      },
      //获取未标注数量
      async getListByverifyStatus() {
        let data = {
          taskId: this.queryModel.taskId,
          verifyStatus: 1,
          deleteStatus: 0,
          resultType: this.queryModel.resultType,
          modelTrainId: this.queryModel.modelTrainId,
          humanLabelId: this.numberModel.humanLabelId,
          robotLabelId: this.numberModel.robotLabelId
        };

        let result = await informationService.corpusCheckconfusion(data, this.$route.query.labelType);
        if (result.message.code == 0) {
          this.verifyStatusZero = result.data.totalCount;

          this.humanLabelNumberTotalNumber = (this.verifyStatusZero / this.totalCount) * 100
          if (isNaN(this.humanLabelNumberTotalNumber)) {
            this.humanLabelNumberTotalNumber = 0
          }
        }
      },
      //获取总数
      async getListByverifyStatusTo() {
        this.numberModel.resultType = this.queryModel.resultType;
        this.numberModel.taskId = this.queryModel.taskId;
        this.numberModel.deleteStatus = 0;
        this.numberModel.modelTrainId = this.queryModel.modelTrainId;
        let result = await informationService.corpusCheckconfusion(this.numberModel, this.$route.query.labelType);
        if (result.message.code == 0) {
          // this.listData = result.data.list;
          this.totalCount = result.data.totalCount;
          this.getListByverifyStatus()
        }
      },
      //获取全部标签值
      async getAllLabelArr() {
        let data = {
          taskId: this.queryModel.taskId,
          ps: 10000
        };
        let result = await informationService.querylabel(data);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          this.ALLLabelArr = [{name: '空', id: 'kong'}];
          tempArr.forEach((item, index) => {
            let obj = {
              name: item.name,
              id: item.id
            };
            this.ALLLabelArr.push(obj);
          });
        }
      },
      //弹窗内标签dialog
      async getLabelArrDialog(fa, name) {
        let data = {
          name: name,
          taskId: this.queryModel.taskId,
          labelTypeIds: fa,
          ps: 10000
        };
        let result = await informationService.querylabel(data);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          this.LabelArrDialog = [{name: '空', id: 'kong'}];
          tempArr.forEach((item, index) => {
            let obj = {
              name: item.name,
              id: item.id
            };
            this.LabelArrDialog.push(obj);
          });
        }
      },
      //  reviseLabel
      reviseLabel(item, dataModel, getlist) {
        this.D_N_Ner = item;
        this.reviseId = item.id;
        if (dataModel.humanLabels) {
          dataModel.humanLabels.forEach((it, inx) => {
            if (item.id == it.labelTypeId) {
              if (it.labelInfos) {
                let arr = [];
                it.labelInfos.forEach((ita, ina) => {
                  arr.push(ita.labelId);
                });
                this.LABEL_NList = arr.map(Number);
                this.LABEL_N1 = this.LABEL_NList[0]
              }
              // console.log(this.LABEL_N1);
              // console.log(this.LABEL_NList);
            }
          })
        }
        if (getlist != 'getlist') {
          this.LabelVisible = true;
        }
        this.getLabelArrDialog(item.id);
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
        this.labelTypeModel.taskId = this.queryModel.taskId;
        let result = await informationService.labelClasses(this.labelTypeModel);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          this.ShowLabelTypeArr = tempArr
          this.LabelTypeOptions = [{name: '全部', id: '', taggingType: 'ALL'}];
          this.distributeTab = [];
          tempArr.forEach((item, index) => {
            let obj = {
              taggingType: item.taggingType,
              name: item.name,
              id: item.id
            };
            this.LabelTypeOptions.push(obj);
            this.distributeTab.push(obj);
          });
        }
      },
      async corpusBiaozhu(par) {
        let labelTypeIds = [];
        let labelIN = [];
        this.dataModel.humanLabels.forEach((item, index) => {
          if (item.labelTypeId == this.queryModel.labelTypeId) {
            if (item.labelInfos) {
              if (item.labelStatus == '1') {
                item.labelInfos.forEach((ite, inde) => {
                  if (ite.labelId == 'kong') {
                    item.labelInfos.splice(inde, 1)
                  }
                });
                labelIN.push(item)
              }
            }
          }
          if (item.labelTypeId == this.queryModel.labelTypeId && item.labelStatus != '1') {
            item.labelStatus = '1';
            if (!item.labelInfos || item.labelInfos.length == 0) {
              labelTypeIds.push(item.labelTypeId)
            }
          }
        });
        let dataS = [
          {
            labelTypeIds: labelTypeIds,
            corpusId: this.dataModel.id,//语料ID
            labels: labelIN,
            taskId: this.queryModel.taskId,//任务ID
            modelTrainId: this.modelTrainId,
            resultType: this.queryModel.resultType
          }
        ];
        this.corpusContentLoading = true;
        let result = await informationService.corpusBiaozhuconfusion(dataS, this.$route.query.labelType);
        if (result.message.code == 0) {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          });
          this.labelModel.name = '';
          this.LabelArr = [];
          this.searchStr = '';
          this.radio = '';
          this.LabelVisible = false;
          this.corpusContentLoading = false;
          if (par === 'all') {
            if (this.queryModel.verifyStatus == '0') {
              this.DPage--;
            }
            this.next();
          } else {

          }
          this.getLabelArr();
          this.getListByverifyStatusTo();
        } else {
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },
      //标签搜索
      searchLabelFun() {
        this.getLabelArrDialog(this.D_N_Ner.id, this.searchStr)
      },
      async getLabelArr() {
        this.labelModel.taskId = this.queryModel.taskId;
        let result = await informationService.querylabel(this.labelModel);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          this.LabelArr = [];
          this.SLabelArr = [];
          this.options = [];
          tempArr.forEach((item, index) => {
            let obj = {
              name: item.name,
              id: item.id
            };
            this.LabelArr.push(obj);
            this.SLabelArr.push(obj);
            this.options.push(obj);
          });
        }
      },
    },
    components: {
      appHeader, VueAudio
    },
    mounted: function () {
      let that = this;
      document.onkeyup = function (event) {
        if (event.keyCode == 39) {
          that.next()
        }
        if (event.keyCode == 37) {
          that.prev()
        }
      };
    },
    watch: {
      'LABEL_N1': function (va) {
        if (va) {
          let this_ = this;
          let target;
          let arr = this_.ALLLabelArr;
          arr.forEach((item, index) => {
            // console.log(va);
            if (item.id == va) {
              target = {
                labelId: item.id,
                labelName: item.name
              }
            }
          });
          if (this_.dataModel.humanLabels) {
            let humanLabelsArr = this_.dataModel.humanLabels;
            humanLabelsArr.forEach((item, index) => {
              if (item.labelTypeId == this_.reviseId) {
                this_.dataModel.humanLabels[index].labelInfos = [];
                this_.dataModel.humanLabels[index].labelInfos.push(target);
              }
            });
          }

        }
      },
      'LABEL_NList': function (va) {
        if (va) {
          let Br = this.LABEL_NList;
          let targetArr = [];
          let arr = this.ALLLabelArr;
          arr.forEach((item, index) => {
            Br.forEach((ite, inde) => {
              if (ite == item.id) {
                let obj = {
                  labelId: item.id,
                  labelName: item.name
                };
                targetArr.push(obj)
              }
            });
          });
          let humanLabelsArr = this.dataModel.humanLabels;
          humanLabelsArr.forEach((item, index) => {
            if (item.labelTypeId == this.reviseId) {
              this.dataModel.humanLabels[index].labelInfos = [];
              for (let i = 0; i < targetArr.length; i++) {
                this.dataModel.humanLabels[index].labelInfos.push(targetArr[i])
              }
            }
          });
        }
      },
    },
    created: function () {
      this.taskInfo = JSON.parse(sessionStorage.getItem("taskInfo"));
      this.queryModel.taskId = this.taskInfo.taskId;
      this.queryModel.resultType = this.$route.query.formUrl;
      this.queryModel.modelTrainId = this.$route.query.modelTrainId;
      this.queryModel.labelTypeId = this.$route.query.labelTypeId;
      this.queryModel.modelTrainId = this.$route.query.modelTrainId;
      this.queryModel.humanLabelId = this.$route.query.humanLabelId;
      this.queryModel.robotLabelId = this.$route.query.robotLabelId;
      this.numberModel.humanLabelId = this.$route.query.humanLabelId;
      this.numberModel.labelTypeId = this.$route.query.labelTypeId;
      this.numberModel.robotLabelId = this.$route.query.robotLabelId;
      if (this.$route.query.humanLabelId) {
        this.leftTitle = this.$route.query.humanLabel;
        this.RightTitle = this.$route.query.robotLabel;
      }
      this.getList();
      this.getLabelArr();
      this.getLabelTypeArr();
      this.getListByverifyStatusTo()
      this.getAllLabelArr();
    }
  }
</script>
<style>
  .neymar .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0;
  }

  .neymar .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0
  }

  .el-progress-bar__outer {
    background: #D9D9D9;
  }

  .el-tabs--border-card {
    box-shadow: none;
  }
</style>
<style scoped>
  .textWrap {
    width: 100%;
    /*   max-height: 400px;
       min-height: 300px;*/
    border-bottom: 1px solid rgb(204, 204, 204);
    position: relative;
    box-sizing: border-box;
    padding: 5px;
    /*overflow: auto;*/
  }

  .textBtn {
    position: absolute;
    top: 50%;
    margin-top: -14px;
  }

  .textBtn.left {
    left: 8px;
  }

  .textBtn.right {
    right: 8px;
  }

  .textBtn.prev {
  }

  .textBtn.next {
    float: right
  }

  .PL15 {
    padding-left: 15px
  }

  .el-carousel ul.el-carousel__indicators {
    display: none !important;
  }

  .tabP span {
    display: inline-block;
    padding: 5px 10px;
  }

  .el-radio.is-bordered + .el-radio.is-bordered {
    margin-left: 0;
  }

  .labelGroup {
    margin-right: 10px;
    margin-top: 10px;
    margin-left: 0;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
