<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 20px; background: #fff">
      <el-breadcrumb-item :to="{ path: '/trainresult?index=trainresult' }">模型训练</el-breadcrumb-item>
      <el-breadcrumb-item v-if="this.$route.query.resultType==undefined"><a @click="goPage('checkconfusion?index=verificationresult')">查新混淆语料</a></el-breadcrumb-item>
      <el-breadcrumb-item v-if="this.$route.query.resultType==undefined" >语料标注</el-breadcrumb-item>
      <el-breadcrumb-item v-if="this.$route.query.resultType" >错误语料</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row style="position: relative;border-left:1px solid rgb(223, 226, 229);border-right:1px solid rgb(223, 226, 229);height: 24px;">
      <VueAudio ref="children" :send-obj="TestModelObj"></VueAudio>
    </el-row>
    <div style="box-sizing: border-box;padding: 0 20px">
      <el-row style="border: solid 1px #DFE2E5;margin-top: 20px" class="Water">
        <div class="corpusContent">
          <span  @mouseup="mouseUp($event)"  @mousedown="mouseDown($event)" v-for="(item,index) in dataModel.content" :key="index" :data-index="item.id" v-html="item.name"></span>
        </div>
        <el-dialog id="NER" style="position: initial" :visible.sync="LabelVisibleMouse"  class="MouseUp box-shadow" :modal="false">
          <div>
            <el-input size="small" style="width: 200px" v-model="searchStr" placeholder="请输入标签内容"
                      @keyup.enter.native="searchLabelFun">
              <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="searchLabelFun"> </i>
            </el-input>
            <span  v-if="mouseTarget!=''">选中内容：{{mouseTarget}}</span>
          </div>
          <!--单标签-->
          <el-radio-group v-model="LABEL_N1" v-if="labelClassShow!='LABEL_N'" class="radioGroup"
          >
            <el-radio size="small" class="labelGroup" border v-for="(item,index) in LabelArrDialog" :label="item.id"
                      :value="item.name"
                      :key="index">
              {{item.name}}
            </el-radio>
          </el-radio-group>
        </el-dialog>
        <div style="background: #fff">
          <div style="display: inline-block;width: 100%"  v-if="D_N_Ner.taggingType!='NER' && D_N_Ner.taggingType!='RELATION' && D_N_Ner.taggingType!='NER_LABEL_1'">
            <div class="tabP PL15" v-for="(item,index) in ShowLabelTypeArr" v-if="item.taggingType!='NER' && item.taggingType!='RELATION'&& item.taggingType!='NER_LABEL_1'" :key="index" style="width: 100%;position: relative">
              <h4 style="display: inline-block">{{item.name}}&nbsp;&nbsp;></h4>
              人工标签：<span class="humanLabel" v-for="HItem in humanLabelFilter(item.id)">{{HItem}}</span>
              机器预测：
              <span v-for="RItem in RobotLabelFilter(item.id)">
               <span class="RobotLabel">{{RItem.labelName?RItem.labelName:'-'}}</span>
               <span style="position: absolute;right: 16px;top: 14px;" v-if="RItem.confidence">置信度：{{RItem.confidence}}</span>
              </span>
              <a @click="reviseLabel(item,dataModel)" class="revise">修改</a>
            </div>
            <el-button v-if="canShowbiuaozhu"  @click="CheckMachine()"  style="background: #7F8FA4;color: #fff;border: none;margin: 10px 0 10px" size="small">
              查看机器预测
            </el-button>
          </div>
        </div>
      </el-row>

      <!--三个大按钮box-->
      <div  style="margin-top: 20px;margin-left: 84px" >
        <!--对勾-->
        <a @click="corpusBiaozhu()"><img style="width: 90px;height: auto;cursor: pointer"
                                         src="../../../static/images/Tick.png" alt=""></a>
        <!--删除-->
        <a @click="Deletecorpu()" ><img style="width: 90px;height: auto;cursor: pointer" src="../../../static/images/delete.png" alt=""></a>
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
        <el-radio-group v-model="LABEL_N1" v-if="labelClassShow!='LABEL_N'" class="radioGroup"
        >
          <el-radio size="small" class="labelGroup" border v-for="(item,index) in LabelArrDialog" :label="item.id"
                    :value="item.name"
                    :key="index">
            {{item.name}}
          </el-radio>
        </el-radio-group>
        <!--多标签-->
        <el-checkbox-group v-model="LABEL_NList" v-if="labelClassShow=='LABEL_N'" class="radioGroup">
          <el-checkbox size="small" class="labelGroup" border v-for="(item,index) in LabelArrDialog" :label="item.id"
                       :value="item.name"
                       :key="index">
            {{item.name}}
          </el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="LabelVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="corpusBiaozhu">确 定</el-button>
      </span>
      </el-dialog>

      <!--机器预测-->
      <el-dialog title="机器预测结果" :visible.sync="CheckMachineVisible" width="80%" >
        <div class="corpusContent" v-model="dataModel">
          <span v-for="(item,index) in dataModel.robotcontent" :key="index" :data-index="item.id" v-html="item.name"></span>
        </div>
        <span slot="footer" class="dialog-footer">
           <el-button size="small" @click="CheckMachineVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
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
        TestModelObj:{},
        LabelArrDialog: [],
        ShowLabelTypeArr: [],//语料下方展示标注信息
        D_N_Ner: '',
        LABEL_NList: [],//多选选中数据
        LABEL_N1: '',//单选选中数据
        labelTypeModel: {//分类
          ps: 10000
        },
        ALLLabelArr: [],
        state: '',
        searchStr: '',
        dataModel: {},
        //
        humanLabelId: '',
        robotLabelId: '',
        humanLabel: '',
        robotLabel: '',
        Dtag: true,
        loading: true,
        CheckMachineVisible: false,
        value: '',
        LabelArr: [],
        corpusSearchModel: {},
        listData: [],
        showListLoading: false,
        queryModel: {
          page: 1,
          size: 10
        },
        labelModel: {
          ps: 10000
        },
        SLabelArr: [],
        LabelVisible: false,
        LabelVisibleMouse: false,//标签列表弹窗
        taggingDetail:{},
        keywords:[],
        robotLabelskeywords:[],
        keywordsFacing:[],
        mouseTarget:'',//鼠标选中内容,
        Event:'',
        MouseDownIndex:'',
        MouseUpIndex:'',
        MouseUpIndexText:'',
        MouseDownIndexText:'',
        labelClassShow:'',
        canShowbiuaozhu:false,
        dictionaryColor:[]
      }
    },
    methods: {
      //查看机器预测
      CheckMachine() {
        this.CheckMachineVisible=true;
        // this.highlightText(this.dataModel.robotcontent,this.robotLabelskeywords,'robot');
      },
      mouseDown(event){
        this.MouseDownIndex=Number($(event.target).attr('data-index'))
        this.MouseDownIndexText= $(event.target)[0].innerHTML
      },
      //鼠标抬起
      mouseUp(){
        let topA=0;
        let leftA=0;
        let targetWrapWidth=0;
        topA=$(event.target)[0].offsetTop-$(".corpusContent").scrollTop();
        leftA=$(event.target)[0].offsetLeft;
        let target=$("#NER .el-dialog");
        targetWrapWidth=document.body.clientWidth-300;
        if(leftA+400>targetWrapWidth){
          target[0].style.right=0+'px';
          target[0].style.left='';
          target[0].style.top=topA+35+'px';
        }else {
          target[0].style.left=leftA+26+'px';
          target[0].style.top=topA+35+'px';
        }
        this.labelClassShow='mouseUp';
        let labelTypeId=[];
        let selection_textArr=[];
        if(this.$route.query.labelTypeId){
          labelTypeId.push(this.$route.query.labelTypeId)
        }
        this.getLabelArrDialog(labelTypeId.toString());
        let selection_text = window.getSelection().toString();
        selection_textArr= selection_text.split("");
        this.MouseUpIndex=Number($(event.target).attr('data-index'));
        this.MouseUpIndexText= $(event.target)[0].innerHTML
        this.LABEL_N1='';
        let text=[];
        let focusOffset,anchorOffset;
        if(this.MouseDownIndex<this.MouseUpIndex){
          if(selection_textArr[selection_textArr.length-1]!=this.MouseUpIndexText){
            this.MouseUpIndex=this.MouseUpIndex-1;
            if(leftA+400>targetWrapWidth){
              target[0].style.left=''
            }else {
              target[0].style.left=leftA+6+'px';
            }
          }
          if(selection_textArr[0]!=this.MouseDownIndexText){
            this.MouseDownIndex=this.MouseDownIndex+1
          }
          focusOffset=this.MouseDownIndex;
          anchorOffset=this.MouseUpIndex;
        }else {
          if(selection_textArr[0]!=this.MouseUpIndexText){
            this.MouseUpIndex=this.MouseUpIndex+1
          }
          if(selection_textArr[selection_textArr.length-1]!=this.MouseDownIndexText){
            this.MouseDownIndex=this.MouseDownIndex-1
          }
          focusOffset=this.MouseUpIndex;
          anchorOffset=this.MouseDownIndex;
        }
        for(let i=0;i<this.dataModel.content.length;i++){
          for (let j = focusOffset;j< anchorOffset+1;j++){
            if(this.dataModel.content[i].id==j){
              text.push(this.dataModel.content[i].name)
            }
          }
        }
        let taggingDetail={
          focusOffset: focusOffset,//开始索引
          anchorOffset:anchorOffset,//结束索引
          text:text.join(''),
        };
        this.mouseTarget=taggingDetail.text;
        this.keywordsFacing=[taggingDetail];
        for(let a=0;a<this.ShowLabelTypeArr.length;a++){
           if(this.mouseTarget!=='' && (this.ShowLabelTypeArr[a].taggingType==='NER' || this.ShowLabelTypeArr[a].taggingType==='RELATION'|| this.ShowLabelTypeArr[a].taggingType==='NER_LABEL_1')){
             this.LabelVisibleMouse=true;
           }
        }
        if(this.mouseTarget!==''){
           this.LabelVisible=false;
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
              if(itx.colorIndex>9){
                colorIndex=0
              }
            }
          });
          let ColorArr=['bgcolor1','bgcolor2','bgcolor3','bgcolor4','bgcolor5','bgcolor6','bgcolor7','bgcolor8','bgcolor9','bgcolor10'];
          let arrI;
          if(type=='robot'){
            arrI={
              id:ids,
              name:'<b class="ChooseLabel '+ ColorArr[colorIndex]+'"><span>'+ item.labelName +'：</span>' + item.text + '</b>'
            };
          }else {
            arrI={
              id:ids,
              name:'<b class="ChooseLabel '+ ColorArr[colorIndex]+'"><i class="deleteIcon" onclick="getResponse(this)">X</i><span>'+ item.labelName +'：</span>' + item.text + '</b>'
            };
          }
          sourceText.splice(deleteids[0], deleteids.length , arrI);
          window.getSelection().removeAllRanges();
        });
        this.LabelVisible=false;
        this.LabelVisibleMouse=false;
        return sourceText;
      },
      showLabel() {
        this.LabelVisible = true;
      },
      //删除语料  需要确认接口是否正确
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
          this.goPage('checkconfusion?index=verificationresult');
        }
      },
      //获取全部标签值
      async getAllLabelArr() {
        let data={
          taskId:this.queryModel.taskId,
          ps:10000
        };
        let result = await informationService.querylabel(data);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          this.ALLLabelArr = [{name:'空',id:'kong'}];
          tempArr.forEach((item, index) => {
            let obj = {
              labelType:item.labelType,
              name: item.name,
              id: item.id
            };
            this.ALLLabelArr.push(obj);
          });
        }
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
              } else if(item.labelStatus=='1'){
                res = '空';
              }
            }
          });
        }
        return res
      },
      RobotLabelFilter: function (val) {
        let res = '-';
        let arr = this.dataModel.robotLabels;
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
              } else if(item.labelStatus=='1'){
                res = '空';
              }
            }
          });
        }
        return res
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
      async getLabelTypeArr() {
        this.labelTypeModel.taskId = this.queryModel.taskId;
        let result = await informationService.labelClasses(this.labelTypeModel);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          let dictionaryNeed=[];
          this.ShowLabelTypeArr=tempArr
          let PrelabelTypeArr=[];
          PrelabelTypeArr.push(Number(this.$route.query.labelTypeId))
          let arrTemp = JSON.parse(JSON.stringify(this.ShowLabelTypeArr));
          let thia=this
          arrTemp.forEach((ie,delIn)=>{
            if(PrelabelTypeArr.indexOf(ie.id) === -1){
              thia.ShowLabelTypeArr.forEach((m,n)=>{
                if(m.id===ie.id){
                  thia.ShowLabelTypeArr.splice(n,1)
                }
              })
            }
          });
          this.LabelTypeOptions = [{name: '全部', id: '', taggingType: 'ALL'}];
          this.distributeTab = [];
          tempArr.forEach((item, index) => {
            if(item.taggingType=="NER" || item.taggingType=="RELATION"|| item.taggingType=="NER_LABEL_1"){
              dictionaryNeed.push(item.id)
            }
            let obj = {
              taggingType: item.taggingType,
              name: item.name,
              id: item.id
            };
            this.LabelTypeOptions.push(obj);
            this.distributeTab.push(obj);
          });
          this.getdictionaryDialog(dictionaryNeed.toString());
          if(this.$route.query.modelTrainId){
            this.queryModel.resultType = this.$route.query.resultType;
            this.queryModel.modelTrainId = this.$route.query.modelTrainId;
            this.getList('nererror');
          }else {
            this.getList();
          }
        }
      },
      reviseLabel(item, dataModel) {
        this.D_N_Ner = item;
        this.labelClassShow=item.taggingType;
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
            }
          })
        }
        this.LabelVisible = true;
        this.getLabelArrDialog(item.id);
      },
      //弹窗内标签dialog
      async getLabelArrDialog(fa,name) {
        let data={
          name:name,
          taskId:this.queryModel.taskId,
          labelTypeIds:fa,
          ps:10000
        };
        let result = await informationService.querylabel(data);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          this.LabelArrDialog = [];
          tempArr.forEach((item, index) => {
            let obj = {
              name: item.name,
              id: item.id
            };
            this.LabelArrDialog.push(obj);
          });
        }
      },
      goPage(page) {
        this.$router.push({
          path: page,
          query: {
            humanLabel: this.$route.query.humanLabel,
            robotLabel: this.$route.query.robotLabel,
            humanLabelId: this.$route.query.humanLabelId,
            robotLabelId: this.$route.query.robotLabelId
          }
        });
      },
      indexFilter(index) {
        return index + 10 * (this.queryModel.cp - 1) + 1;
      },
      //点击分页
      pageChange(page) {
        this.queryModel.cp = page;
        this.getList();
      },
      //获取数据列表
      async getList(nererror) {
        let result;
        if(nererror=='nererror'){
          result = await informationService.corpusCheckconfusion(this.queryModel);
        }else {
          result = await informationService.corpusCheck(this.queryModel);
        }
        if (result.message.code == 0) {
          this.listData = result.data.list;
          if (this.listData.length > 0) {
            let temp;
            let robot;
            if(nererror=='nererror'){
              this.canShowbiuaozhu=true
              temp = result.data.list[0].corpus;
              robot = result.data.list[0].robotLabels;
            }else {
              temp = result.data.list[0];
              this.TestModelObj=result.data.list[0];
            }
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
            if(temp.humanLabels){
              temp.humanLabels.forEach((ite, inde) => {
                if (!ite.labelInfos) {
                  ite.labelInfos = []
                }else if(ite.labelInfos.length>0){
                  ite.labelInfos.forEach((a,b)=>{
                    if(a.taggingDetail){
                      let dd= a.taggingDetail.replace(/'/g, '"');
                      a.taggingDetail=JSON.parse(dd)
                    }
                  })
                }
              });
            }
            if(temp.robotLabels){
              temp.robotLabels.forEach((ite, inde) => {
                if (!ite.labelInfos) {
                  ite.labelInfos = []
                }else if(ite.labelInfos.length>0){
                  ite.labelInfos.forEach((a,b)=>{
                    if(a.taggingDetail &&  a.taggingDetail!=''){
                      let cc= a.taggingDetail.replace(/'/g, '"');
                      a.taggingDetail=JSON.parse(cc)
                    }
                  })
                }
              });
            }

            this.dataModel = temp;
            this.modelTrainId = result.data.list[0].modelTrainId;
            let str = this.dataModel.content.split("");
            let arr=[];
            let arrRobot=[];
            str.forEach((item,index)=>{
              let obj={
                name:item,
                id:index
              };
              arr.push(obj)
              arrRobot.push(obj)
            });
            this.dataModel.content=arr;
            this.dataModel.robotcontent=arrRobot;
            this.keywords=[];
            this.robotLabelskeywords=[];
            this.dataModel.humanLabels.forEach((item,index)=>{
              if(item.labelInfos){
                item.labelInfos.forEach((ite,inx)=>{
                  if(ite.taggingDetail){
                    ite.taggingDetail.forEach((it,ix)=>{
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
                      if(this.labelModel.labelTypeIds=='' || this.labelModel.labelTypeIds==undefined){
                        this.keywords.push(obj)
                      }else {
                        if(obj.labelType.id==this.labelModel.labelTypeIds){
                          this.keywords.push(obj)
                        }
                      }
                    })
                  }
                })
              }
            });
            if(robot){
              robot.forEach((item,index)=>{
                if(item.labelInfos){
                  item.labelInfos.forEach((ite,inx)=>{

                    if(ite.taggingDetail){
                      let cc= ite.taggingDetail.replace(/'/g, '"');
                      ite.taggingDetail=JSON.parse(cc)
                      ite.taggingDetail.forEach((it,ix)=>{
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
                        if(this.labelModel.labelTypeIds=='' || this.labelModel.labelTypeIds==undefined){
                          this.robotLabelskeywords.push(obj)
                        }else {
                          if(obj.labelType.id==this.labelModel.labelTypeIds){
                            this.robotLabelskeywords.push(obj)
                          }
                        }
                      })
                    }
                  })
                }
              });
            }
            this.highlightText(this.dataModel.content,this.keywords);
            this.highlightText(this.dataModel.robotcontent,this.robotLabelskeywords,'robot');
            this.queryModel.cp = result.data.currentPage;
          }
        }
      },
      //搜索
      async onSearch() {
        let result = await informationService.logSign(this.queryModel);
        if (result.message.code == 0) {
          this.listData = result.data.list;
          this.totalCount = result.data.totalCount;
          this.queryModel.cp = result.data.currentPage;
        }
      },
      searchLabelFun() {
        this.getLabelArrDialog(this.D_N_Ner.id,this.searchStr)
      },
      async getLabelArr() {
        this.labelModel.taskId = this.queryModel.taskId;
        let result = await informationService.querylabel(this.labelModel);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          this.LabelArr=[];
          this.SLabelArr=[];
          tempArr.forEach((item, index) => {
            let obj = {
              name: item.name,
              id: item.id
            };
            this.LabelArr.push(obj);
            this.SLabelArr.push(obj);
          });
        }
      },
      async corpusBiaozhu() {
        let labelTypeIds=[];
        let labelIN=[];
        this.dataModel.humanLabels.forEach((item,index)=>{
          if(item.labelInfos) {
            if(item.labelInfos.length=='0' && item.labelStatus=='0'){
              labelTypeIds.push(item.labelTypeId)
            }else {
              item.labelInfos.forEach((ite, inde) => {
                if (ite.labelId == 'kong') {
                  item.labelInfos.splice(inde, 1);
                }
              });
              item.labelStatus='1'
              labelIN.push(item)
            }
          }
        });
        let dataS = [
          {
            labelTypeIds:labelTypeIds,
            corpusId: this.dataModel.id,//语料ID
            labels:labelIN,
            taskId: this.queryModel.taskId,//任务ID
          }
        ];

        let result = await informationService.corpusBiaozhu(dataS);
        if (result.message.code == 0) {
          if (result.message.code == 0) {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            });
            this.LabelArr = [];
            this.searchStr = '';
            this.LabelVisible = false;
            this.getLabelArr();
            this.getList()

          } else {
            this.$message({
              showClose: true,
              message: result.message.message,
              type: 'error'
            });
          }
        }
      },

    },
    components: {
      appHeader,VueAudio
    },
    mounted: function () {
    },
    watch: {
      'LABEL_N1': function (va) {
        if (va) {
          let this_ = this;
          let target;
          let arr = this_.ALLLabelArr;
          arr.forEach((item, index) => {
            if (item.id == va) {
              target = {
                labelId: item.id,
                labelType:item.labelType,
                labelName: item.name,
              }
            }
          });
          if(this.labelClassShow==='mouseUp'){
            let ojk={
              anchorOffset:this.keywordsFacing[0].anchorOffset,
              focusOffset:this.keywordsFacing[0].focusOffset,
              text:this.keywordsFacing[0].text,
              labelName:target.labelName,
              labelId:target.labelId,
              labelType:target.labelType
            };
            this.keywords.unshift(ojk);
          }
          let arra=[this.keywords[0]];
          if (this_.dataModel.humanLabels) {
            let humanLabelsArr = this_.dataModel.humanLabels;
            humanLabelsArr.forEach((item, index) => {
              if (item.labelTypeId == this_.D_N_Ner.id && this_.D_N_Ner.taggingType!='NER' && this_.D_N_Ner.taggingType!='RELATION' && this.labelClassShow!='mouseUp') {
                this_.dataModel.humanLabels[index].labelInfos = [];
                this_.dataModel.humanLabels[index].labelInfos.push(target);
              }else if(arra[0] &&  arra[0].labelType.id==item.labelTypeId){
                this_.dataModel.humanLabels[index].labelInfos = [];
                let arr=[];
                this_.keywords.forEach((a,b)=>{
                  if(item.labelTypeId==a.labelType.id){
                    let info={
                      labelId:a.labelId,
                      labelName:a.labelName,
                      ner:a.text,
                      start_span:a.focusOffset,
                      end_span:a.anchorOffset,
                    };
                    arr.push(info);
                    let map = {}, dest = [];
                    for (let i = 0; i < arr.length; i++) {
                      let ai = arr[i];
                      if (!map[ai.labelId]) {
                        dest.push({
                          labelId: ai.labelId,
                          labelName: ai.labelName,
                          taggingDetail: [{
                            ner: ai.ner,
                            start_span: ai.start_span,
                            end_span: ai.end_span
                          }]
                        });
                        map[ai.labelId] = ai;
                      } else {
                        for (let j = 0; j < dest.length; j++) {
                          let dj = dest[j];
                          if (dj.labelId == ai.labelId) {
                            dj.taggingDetail.push({
                              ner: ai.ner,
                              start_span: ai.start_span,
                              end_span: ai.end_span
                            });
                            break;
                          }
                        }
                      }
                    }
                    this_.dataModel.humanLabels[index].labelInfos=dest;
                  }
                })
              }
            });
          }
          if(this.labelClassShow==='mouseUp'){
            this.highlightText(this.dataModel.content,arra);
          }
          this.mouseTarget='';
        }
      },
      'LABEL_NList': function (va) {
        if (va && this.D_N_Ner.taggingType!='NER' && this.D_N_Ner.taggingType!='RELATION'){
          console.log(this.D_N_Ner);
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
            if (item.labelTypeId == this.D_N_Ner.id && this.labelClassShow!='mouseUp') {
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
      if (this.$route.query.ids) {
        this.corpusSearchModel = this.$route.query.datasetId;
        this.taskInfo = JSON.parse(sessionStorage.getItem("taskInfo"));
        this.queryModel.taskId = this.taskInfo.taskId;
        this.queryModel.ids = this.$route.query.ids;
        this.getLabelTypeArr();

        this.getLabelArr();
        this.getAllLabelArr();
      }
      this.$root.$on('getResponse',(_this) => {
        let that=this;
        if(_this){
          let str=_this.parentNode.parentNode;
          let arrStr= $(str).attr('data-index');
          let numIndex=_this.parentNode.textContent.indexOf("：")+1;
          let textStr=_this.parentNode.textContent.substr(numIndex);
          debugger
          let arr=arrStr.split(',').map(Number);
          let arrtextStr=textStr.split('').reverse();
          that.keywords.forEach((item,index)=>{
            if(item.focusOffset==arr[0]){
              that.keywords.splice(index, 1);
              that.dataModel.humanLabels.forEach((items,index)=>{
                items.labelInfos.forEach((ite,inde)=>{
                  if(ite.taggingDetail){
                    ite.taggingDetail.forEach((it,ind)=>{
                      if(it.start_span==item.focusOffset){
                        ite.taggingDetail.splice(ind, 1);
                      }
                    })
                  }
                })
              });
              /*console.log(that.dataModel);*/
              that.dataModel.content.forEach((a,b)=>{
                if(a.id.toString()==arr.toString()){
                  that.dataModel.content.splice(b,1);
                  arr.reverse().forEach((arrStrA,arrStrIndex)=>{
                    let obj={
                      id:arrStrA,
                      name:arrtextStr[arrStrIndex]
                    };
                    that.dataModel.content.splice(b,0,obj);
                  });
                }
              });
            }
          });
        }
      });
      this.$root.$emit('getResponse');
    }
  }
</script>

<style scoped>
  .PL15 {
    padding-left: 15px
  }

  .tabP span {
    display: inline-block;
    padding: 5px 10px;
    /*background: rgb(242, 242, 242);*/
  }

  .el-radio.is-bordered + .el-radio.is-bordered {
    margin-left: 0;
  }

  .labelGroup {
    margin-right: 10px;
    margin-top: 10px;
    margin-left: 0;
  }
</style>
