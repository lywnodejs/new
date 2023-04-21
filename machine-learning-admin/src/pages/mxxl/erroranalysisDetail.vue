<template>
  <div>
    <el-row type="flex" style="height: 60px;line-height: 60px;background-color: #FFFFFF;">
      <el-col align="left" style="padding-left: 20px;padding-top: 22px">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{path:$route.query.index+'?index='+$route.query.index}">模型训练</el-breadcrumb-item>
<!--          erroranalysis?index=verificationresult&modelTrainId=736&formUrl=VERIFY&labelType=LABEL_1&labelTypeId=318-->
          <el-breadcrumb-item
            :to="{path:'erroranalysis?index='+$route.query.index+'&modelTrainId='+$route.query.modelTrainId+'&formUrl='+$route.query.formUrl+'&labelType='+$route.query.labelType+'&labelTypeId='+$route.query.labelTypeId+'&humanLabelId='+queryModel.humanLabelId+'&robotLabelId='+queryModel.robotLabelId}"
          >错误分析</el-breadcrumb-item>
          <el-breadcrumb-item >错误分析详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <div style="box-sizing: border-box;padding: 20px;">
      <el-row
        style="position: relative;border-left:1px solid rgb(223, 226, 229);border-right:1px solid rgb(223, 226, 229);height: 24px;">
        <VueAudio ref="children" :send-obj="TestModelObj"></VueAudio>
      </el-row>
      <el-row style="border: solid 1px #DFE2E5" v-if="listData.length>0">
        <div class="textWrap" v-model="dataModel">
          <div class="corpusContent" v-loading="corpusContentLoading"
               element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)">{{dataModel.content}}
          </div>
          <i class="textBtn left" style="width: 14px;display: inline-block;cursor: pointer" v-if="this.DPage>1"  @click="prev()">
            <img style="width: 100%;height: auto" src="../../../static/images/icon-Left.png" alt="">
          </i>
          <i class="textBtn right" style="width: 14px;display: inline-block;cursor: pointer" v-if="this.DPage<this.RightShow"  @click="next()">
            <img style="width: 100%;height: auto" src="../../../static/images/icon-Right.png" alt="">
          </i>
        </div>

        <div style="background: #fff">
          <div style="display: inline-block;width: 100%;">
            <div class=" PL15" v-for="(item,index) in ShowLabelTypeArr" :key="index"
                 style="width: 100%;position: relative;padding: 10px 0 10px 10px"
                 v-if="item.id==queryModel.labelTypeId">
              <h4 style="display: inline-block">{{item.name}}&nbsp;&nbsp;></h4>
              人工标签：<span class="humanLabel" v-for="HItem in humanLabelFilter(item.id)">{{HItem}}</span>
              机器预测：
              <span v-for="RItem in RobotLabelFilter(item.id)">
               <span class="RobotLabel">{{RItem.labelName?RItem.labelName:'-'}}</span>
               <span style="position: absolute;right: 16px;top: 14px;"
                     v-if="RItem.confidence">置信度：{{RItem.confidence}}</span>
            </span>
              <a @click="reviseLabel(item,dataModel)" class="revise">修改</a>
            </div>
          </div>
        </div>
      </el-row>
      <span style="text-align: center;display: inline-block;width: 100%;margin-top: 100px;" v-else>暂无数据</span>

      <!--三个大按钮box-->
      <div style="margin-top: 20px;margin-left: 84px" v-if="listData.length>0">
        <!--对勾-->
        <a @click="corpusBiaozhu('all')"><img style="width: 90px;height: auto;cursor: pointer"
                                              src="../../../static/images/Tick.png" alt=""></a>
        <!--叉号-->
        <!--   <a @click="showLabel" style="margin: 0 10px"><img style="width: 90px;height: auto;cursor: pointer"
                                                             src="../../../static/images/pass.png" alt=""></a>-->
        <!--删除-->
        <a @click="Deletecorpu()"><img style="width: 90px;height: auto;cursor: pointer"
                                       src="../../../static/images/delete.png" alt=""></a>
      </div>

      <!--标签弹窗-->
      <el-dialog :visible.sync="LabelVisible" width="50%" class="Water box-shadow" :modal="false">
        <div>
          <el-input size="small" style="width: 200px" v-model="searchStr" placeholder="请输入标签内容"
                    @keyup.enter.native="searchLabelFun">
            <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="searchLabelFun"> </i>
          </el-input>
        </div>
        <!--单标签-->
        <el-radio-group v-model="LABEL_N1" v-if="D_N_Ner.taggingType!='LABEL_N'" class="radioGroup"
        >
          <el-radio size="small" class="labelGroup" border v-for="(item,index) in LabelArrDialog" :label="item.id"
                    :value="item.name"
                    :key="index">
            {{item.name}}
          </el-radio>
        </el-radio-group>
        <!--多标签-->
        <el-checkbox-group v-model="LABEL_NList" v-if="D_N_Ner.taggingType=='LABEL_N'" class="radioGroup">
          <el-checkbox size="small" class="labelGroup" border v-for="(item,index) in LabelArrDialog" :label="item.id"
                       :value="item.name"
                       :key="index">
            {{item.name}}
          </el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="LabelVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="corpusBiaozhu('subtask')">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import appHeader from '../../components/AppHeader';
  import VueAudio from '../../components/VueAudio';
  import {informationService} from '../../service/index';
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
          orderBy: 'verifyAt',
          direction: 'DESC',
          labelTypeId: '',
          cp: 1,
          ps: 1,
        },
        totalCount: 0,
        RightShow: 0,
        options: [
          {name: '全部', id: ''}
        ],
        DPage: 1,//当前页

      }
    },
    methods: {
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
      goPage(page) {
        this.$router.push({path: page});
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
          this.listData = result.data.list;
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
            this.reviseLabel(this.D_N_Ner, this.dataModel, 'getlist');
          }
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
      humanLabelFilter: function (val) {
        let _this = this;
        let res = '-';
        let arr = _this.dataModel.humanLabels;
        if (arr) {
          arr.forEach((item, index) => {
            if (item.labelTypeId == val) {
              if (item.labelInfos && item.labelInfos.length > 0) {
                // console.log(item.labelInfos);
                let NameArr = [];
                item.labelInfos.forEach((ite, ind) => {
                  NameArr.push(ite.labelName);
                });
                res = NameArr
              } else if (item.labelStatus == '1') {
                res = '空';
              }
            }
          });
        }
        return res
      },
      RobotLabelFilter: function (val) {
        let res = '-';
        let arr = this.robotLabels;
        if (arr) {
          arr.forEach((item, index) => {
            if (item.labelTypeId == val) {
              if (item.labelInfos && item.labelInfos.length > 0) {
                let NameArr = [];
                item.labelInfos.forEach((ite, ind) => {
                  let obj = {
                    labelName: ite.labelName,
                    confidence: ite.confidence,
                  };
                  NameArr.push(obj);
                  res = NameArr

                });
              } else if (item.labelStatus == '1') {
                res = '空';
              }
            }
          });
        }
        return res
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
      this.queryModel.modelTrainId = this.$route.query.modelTrainId;
      if(this.$route.query.humanLabelId){
        this.queryModel.humanLabelId = this.$route.query.humanLabelId;
      }else {
        this.queryModel.humanLabelId=''
      }
      if(this.$route.query.robotLabelId){
        this.queryModel.robotLabelId = this.$route.query.robotLabelId;
      }else {
        this.queryModel.robotLabelId=''
      }
      this.queryModel.labelTypeId = this.$route.query.labelTypeId;
      this.queryModel.cp = this.$route.query.Cpindex;
      this.queryModel.verifyStatus = this.$route.query.verifyStatus;
      this.DPage= this.$route.query.Cpindex;
      // this.queryModel.ids = this.$route.query.ids;
      if (this.$route.query.humanLabelId) {
        this.leftTitle = this.$route.query.humanLabel;
        this.RightTitle = this.$route.query.robotLabel;
      }
      this.getList();
      this.getLabelTypeArr();
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
