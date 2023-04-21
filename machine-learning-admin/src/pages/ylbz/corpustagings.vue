<!--
 * @Date: 2019-09-03 13:57:24
 * @Author: 刘亚伟
 * @LastEditTime: 2020-03-23 11:19:27
 -->
<template>
  <div>
    <el-row type="flex" style="height: 60px;line-height: 60px;background-color: #FFFFFF;">
      <el-col align="left" style="padding-left: 30px;padding-top: 20px">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/corpusmaintenance?index=corpusmaintenance' }">语料样本集</el-breadcrumb-item>
          <el-breadcrumb-item>{{MTitle}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col style="text-align: right">
        <el-button size="small" type="primary" style="background: #45B854;border: none;margin-right: 10px"
                   @click="addAnswer()">新增语料
        </el-button>
        <el-popover trigger="click" style="float: right;margin-top: 8px;margin-right: 20px">
          <el-tabs type="border-card" v-model="distributeModel" @tab-click="distributeTabClick()">
            <el-tab-pane v-for="(item,index) in distributeTab"
                         :label="item.name" :value="item.id" :key="index" style="max-height: 200px;overflow: auto;"
                         v-loading="distributeTabLoading"
                         element-loading-text="拼命加载中"
                         element-loading-spinner="el-icon-loading">

              <div v-for="(item,index) in distributeList" :key="index" style="line-height: 26px;min-width: 200px">
                <span style="float: left">{{item.groupBy.label}}</span>
                <span style="float: right;margin-left: 20px;margin-right: 5px">{{item.count}}</span>
                <div style="clear: both"></div>
              </div>
              <p v-if="distributeList.length<1" style="text-align: center">暂无分布统计数据</p>
            </el-tab-pane>
          </el-tabs>
          <el-button slot="reference" @click="showDistribute()"
                     style="background: #7F8FA4;color: #fff;border: none;float: right;margin-top: 7px" size="small">
            标注分布统计
          </el-button>
        </el-popover>
      </el-col>
    </el-row>

    <div style="clear: both"></div>
    <div style="box-sizing: border-box;padding: 0 20px" class="Water">
      <el-row style="">
        <div class="selectWrap">
          <el-select size="small" v-model="labelModel.labelTypeIds" :disabled="MarkDisabled" filterable
                     placeholder="请选择"
                     @change="markArrchange">
            <el-option
              v-for="item in LabelTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div style="display: inline-block;float: right" v-if="labelModel.labelTypeIds===''">
          <div style="margin-top: 10px">
          <span style="float: right;width: 200px;margin-left: 20px;margin-top: 16px">
            <el-progress :percentage="parseInt(AllNumberPercent)" :stroke-width="14"
                         color="#45B854"></el-progress>
          </span>
            <span style="float: right">全部已标注:
            <span style="color:#45B854;font-size: 30px">{{AllNumber}}</span>
            <span style="color: #000000;font-size: 18px;">&nbsp;/&nbsp;{{totalNumber}}</span>
          </span>
            <div style="clear: both"></div>
          </div>
        </div>

        <div style="display: inline-block;float: right" v-for="(item,index) in humanLabelNumberARR" :key="index">
          <div v-if="labelModel.labelTypeIds==item.id" style="margin-top: 10px">
          <span style="float: right;width: 200px;margin-left: 20px;margin-top: 16px">
            <el-progress :percentage="parseInt(item.humanLabelNumberPercent)" :stroke-width="14"
                         color="#45B854"></el-progress>
          </span>
            <span style="float: right">{{item.name}}已标注:
            <span style="color:#45B854;font-size: 30px">{{item.count}}</span>
            <span style="color: #000000;font-size: 18px;">&nbsp;/&nbsp;{{totalNumber}}</span>
          </span>
            <div style="clear: both"></div>
          </div>
        </div>
      </el-row>
      <el-tabs type="border-card" v-model="borderCard">
        <el-tab-pane label="语料标注">
          <el-form :inline="true" :model="queryModel" class="demo-form-inline">
            <el-form-item label="机器预测" style="float: right;margin-bottom: 0">
              <el-select size="small" v-model="queryModel.robotLabelId" filterable placeholder="请选择"
                         @change="changeSearchCondition">
                <el-option
                  v-for="(item,index) in optionsS"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="语料审核">
          <el-form :inline="true" :model="queryModel" class="demo-form-inline">
            <el-form-item label="机器预测" style="float: right;margin-bottom: 0">
              <el-select size="small" v-model="queryModel.robotLabelId" filterable placeholder="请选择"
                         @change="changeSearchCondition">
                <el-option
                  v-for="(item,index) in optionsS"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="人工标签" style="float: right;margin-bottom: 0">
              <el-select size="small" v-model="queryModel.humanLabelId" filterable placeholder="请选择"
                         @change="changeSearchCondition">
                <el-option
                  v-for="(item,index) in options"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

          </el-form>
        </el-tab-pane>
        <span style="text-align: center;display: inline-block;width: 100%;margin: 10px 0;"
              v-if="listData.length<1">暂无数据</span>
      </el-tabs>
      <el-row style="position: relative;border-left:1px solid rgb(223, 226, 229);border-right:1px solid rgb(223, 226, 229);height: 24px;">
        <VueAudio ref="children" :send-obj="TestModelObj"></VueAudio>
      </el-row>
      <el-row style="border: solid 1px #DFE2E5;border-top: none;position: relative;" v-if="listData.length>0">
        <div class="textWrap" v-model="dataModel" style="background: #EFF3F6">
          <div class="corpusContent"  v-loading="corpusContentLoading"
               onclick="removeLink(this)"
               element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)">
               <p>
                  <span style="white-space: pre-wrap;" onclick="link_click(this)" v-if="item.id!='_n'"  @mouseup="mouseUp($event)"  @mousedown="mouseDown($event)" v-for="(item,index) in dataModel.content" :key="index" :data-index="item.id" v-html="item.name"></span>
                <br v-else>
               </p>
              <canvas id="myCanvas"></canvas>
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
          <i class="textBtn left" style="width: 14px;display: inline-block;cursor: pointer" v-if="this.DPage>1"
             @click="prev()">
            <img style="width: 100%;height: auto" src="../../../static/images/icon-Left.png" alt="">
          </i>
          <i class="textBtn right" style="width: 14px;display: inline-block;cursor: pointer"
             v-if="this.DPage<this.totalCount" @click="next()">
            <img style="width: 100%;height: auto" src="../../../static/images/icon-Right.png" alt="">
          </i>
        </div>
        <div style="background: #fff;padding: 10px 0;box-sizing: border-box" v-if="D_N_Ner.taggingType!='NER' && D_N_Ner.taggingType!='RELATION' && D_N_Ner.taggingType!='NER_LABEL_1' ">

          <div style="display: inline-block;width: 100%">
            <div class="tabP PL15" v-for="(item,index) in ShowLabelTypeArr" :key="index"
                 v-if="labelModel.labelTypeIds!=''?D_N_Ner.id==item.id:true && item.taggingType!='NER' && item.taggingType!='RELATION'&& item.taggingType!='NER_LABEL_1' " style="width: 100%;position: relative">
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
          <div style="display: inline-block;float: right;">
            <p class="PL15" v-if="dataModel.currentRobotLabel">
              置信度：<span
              v-if="dataModel.currentRobotLabel && dataModel.currentConfidence">{{dataModel.currentConfidence}}</span><span
              v-else>--</span>
            </p>
          </div>
        </div>
      </el-row>
      <div style="display: inline-block;float: right">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="DPage"
          :page-size="1"
          layout="jumper">
        </el-pagination>
      </div>
      <!--三个大按钮box-->
      <div class="pl100">
        <!--对勾-->
        <a @click="corpusBiaozhu('all')"><img style="width: 90px;height: auto;cursor: pointer"
                                              src="../../../static/images/Tick.png" alt=""></a>
        <!--删除-->
        <a @click="Deletecorpu()"><img style="width: 90px;height: auto;cursor: pointer"
                                       src="../../../static/images/delete.png" alt=""></a>
      </div>
      <!--标签弹窗-->
      <el-dialog id="NER" :visible.sync="LabelVisible" width="50%" class="Water box-shadow" :modal="false">
        <div>
          <el-input size="small" style="width: 200px" v-model="searchStr" placeholder="请输入标签内容"
                    @keyup.enter.native="searchLabelFun">
            <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="searchLabelFun"> </i>
          </el-input>
          <el-switch v-if="labelModel.labelTypeIds!=''" style="float: right;margin-right: 30px;margin-top: 3px;"
                     v-model="showSwitch" active-text="悬浮"></el-switch>
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
        <!--&& labelClassShow!='mouseUp'-->
        <el-checkbox-group v-model="LABEL_NList" v-if="labelClassShow=='LABEL_N'" class="radioGroup">
          <el-checkbox size="small" class="labelGroup" border v-for="(item,index) in LabelArrDialog" :label="item.id"
                       :value="item.name"
                       :key="index">
            {{item.name}}
          </el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer" v-if="labelModel.labelTypeIds!=''">
            <el-button size="small" @click="LabelVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="corpusBiaozhu('subtask')">修 改</el-button>
      </span>
      </el-dialog>
    </div>
    <el-dialog title="新增语料" :visible.sync="AddcurposVisible" width="30%">
      <el-input v-model="input" placeholder="请输入要添加的语料"></el-input>
      <span slot="footer" class="dialog-footer" >
            <el-button @click="AddcurposVisible = false">取 消</el-button>
            <el-button type="primary" @click="SureaddAnswer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import appHeader from '../../components/AppHeader';
  import VueAudio from '../../components/VueAudio';
  import {informationService} from '../../service/index';
  import {mapActions, mapState} from 'vuex';
import { log } from 'util';

  export default {
    name: "corpushtaging",
    data() {
      return {
        TestModelObj:{},
        corpusContentLoading:false,
        //全部标注进度
        MarkDisabled: false,
        AllNumber: 0,//全部已标注数
        AllNumberPercent: 0,//全部已标注数百分比
        distributeTabLoading: false,
        distribute: false,//标注分布统计显示隐藏开关
        distributeTab: [],//切换显示类别
        distributeModel: '0',//切换显示类别
        distributeList: [],
        reviseId: '',//修改的分类标签labelTypeId ID
        showSwitch: true,
        LABEL_NList: [],//多选选中数据
        LABEL_N1: '',//单选选中数据
        LabelVisible: false,//标签列表弹窗
        LabelVisibleMouse: false,//标签列表弹窗
        humanLabelNumberARR: [],
        borderCard: '',
        AddcurposVisible: false,
        //已标注、未标注
        totalNumber: '',//总数
        humanLabelNumber: '',//已标注
        labelArr2: [],
        searchStr: '',//标签搜索
        labelModel: {//分类下的标签
          ps: 10000,
          labelTypeIds: ''
        },
        labelTypeModel: {//分类
          ps: 10000
        },
        dataModel: {},
        dataOld: {},
        SureBtn: false,
        input: '',
        MTitle: '',
        Dtag: true,
        defultIndex: 0,
        radio: '',
        loading: true,
        value: '',
        listData: [],
        LabelArr: [],
        LabelArrDialog: [],
        ALLLabelArr: [],
        showListLoading: false,
        queryModel: {
          humanLabelStatus: '0',
          direction: 'DESC',
          orderBy: 'updateAt',
          cp: 1,
          ps: 1,
        },
        totalCount: '',
        LabelTypeOptions: [
          {name: '全部', id: ''}
        ],
        ShowLabelTypeArr: [],//语料下方展示标注信息
        options: [
          {name: '全部', id: ''}
        ],
        optionsS: [
          {name: '全部', id: ''}
        ],
        DPage: 1,//当前页
        markArr: [],//标注标签弹窗中下拉框选出的数据,
        D_N_Ner: '',
        taggingDetail:{},
        keywords:[],
        keywordsFacing:[],
        mouseTarget:'',//鼠标选中内容,
        originalStr:[],//原本文本内容
        TheInnerHTML:'123456789123456789',
        Event:'',
        MouseUpIndexText:'',
        MouseDownIndexText:'',
        MouseDownIndex:'',
        MouseUpIndex:'',
        ELElocation:[],//元素坐标系
        linkHistory:[],//canvas历史记录
        isLabel:false,//是否开始标注信息
        labelClassShow:'',
        canShowbiuaozhu:'',
        OtherClass:'ChooseLabel',
        dictionaryColor:[],//颜色字典表
      }
    },
    methods: {
      handleCurrentChange(page){
        this.queryModel.cp=page;
        this.DPage=page;
        this.getList();
      },
      mouseDown(event){
        this.MouseDownIndex=Number($(event.target).attr('data-index'));
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
        let labelTypeId=[];
        let selection_textArr=[];
        if(this.labelModel.labelTypeIds==''|| this.labelModel.labelTypeIds==undefined){
          this.LabelTypeOptions.forEach((a,b)=>{
            if(a.taggingType==='NER' || a.taggingType==='RELATION' || a.taggingType==='NER_LABEL_1'){
              this.canShowbiuaozhu=a.taggingType;
              this.labelClassShow='mouseUp';
              this.LABEL_N1='';
              labelTypeId.push(a.id)
            }
          });
        }else {
          this.LabelTypeOptions.forEach((a,b)=>{
            if(a.id===this.labelModel.labelTypeIds){
              this.canShowbiuaozhu=a.taggingType;
              if(a.taggingType==='NER' || a.taggingType==='RELATION' || a.taggingType==='NER_LABEL_1'){
                this.labelClassShow='mouseUp';
                this.LABEL_N1='';
              }
            }
          });
          labelTypeId.push(this.labelModel.labelTypeIds)
        }
        this.getLabelArrDialog(labelTypeId.toString());
        let selection_text = window.getSelection().toString();
        if(selection_text.indexOf("\n")>0){
          window.getSelection().removeAllRanges();
          this.$message({
            showClose: true,
            message: '您当前选择为两段文字，不符合标注标准，请重新选择',
            type: 'error'
          });
          return
        }
        selection_textArr= selection_text.split("");
        this.MouseUpIndex=Number($(event.target).attr('data-index'));
        this.MouseUpIndexText= $(event.target)[0].innerHTML
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
         if(this.mouseTarget!==''){
           if(this.canShowbiuaozhu==='NER' || this.canShowbiuaozhu==='RELATION'|| this.canShowbiuaozhu==='NER_LABEL_1'){
             this.LabelVisibleMouse=true;
             this.LabelVisible=false;
           }
         }
      },
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
            name:'<b class="ChooseLabel '+ ColorArr[colorIndex]+'"><i class="deleteIcon" onclick="getResponse(this)">X</i><span>'+ item.labelName +'：</span>' + item.text + '</b>'
          };
          sourceText.splice(deleteids[0], deleteids.length , arrI);
          window.getSelection().removeAllRanges();
        });
        // this.LabelVisible=false;
        this.LabelVisibleMouse=false;
        return sourceText;
      },
      formattingLink(data){//格式化获取到的数据 画出线条
      window.coord = [];
      window.numIndex = 0;
      window.data_index = [];
      window.activeText = [];
        $('canvas').attr('height', $('.corpusContent p').height() + 900);
        $('canvas').attr('width', $('.textWrap').width());
        let that =this;
        this.linkHistory=[];
        this.ELElocation=[];
        for(var i=0;i<$('.corpusContent>p>span').length;i++){
          if($('.corpusContent>p>span').eq(i).find('b').length!==0){
            this.getLocation($('.corpusContent>p>span').eq(i));
          }
        }
        data.humanLabels.forEach((item,index)=>{
            if(item.taggingDetail){
              item.taggingDetail = JSON.parse(item.taggingDetail);
              item.taggingDetail.forEach((itemB,indexB)=>{
                let coord = new Array(10);
                let arrName = new Array(2);
                for(var i=0;i<that.ELElocation.length;i++){
                  if(itemB.left_start_span === that.ELElocation[i].index.split(',')[0] && itemB.left_end_span === that.ELElocation[i].index.split(',')[that.ELElocation[i].index.split(',').length-1]){
                    coord[0] = that.ELElocation[i].x;
                    coord[1] = that.ELElocation[i].y;
                    coord[2] = $('.corpusContent p').height() + 30 + 40 *this.linkHistory.length;
                    coord[6] = that.ELElocation[i].index;
                    arrName[0] = itemB.left_ner;
                    coord[8] = arrName;
                  } else if(itemB.right_start_span === that.ELElocation[i].index.split(',')[0] && itemB.right_end_span === that.ELElocation[i].index.split(',')[that.ELElocation[i].index.split(',').length-1]){
                    coord[3] = that.ELElocation[i].x;
                    coord[4] = that.ELElocation[i].y;
                    coord[7] = that.ELElocation[i].index;
                    arrName[1] = itemB.right_ner;
                    coord[8] = arrName;
                  }
                }
                if(itemB.left_ner === coord[8][0] && itemB.right_ner === coord[8][1]){
                  coord[5] = itemB.relation;
                  coord[9] = itemB.relation_id;
                  coord[10] =parseInt(item.labelTypeId);
                }
                arrName=[0,0];
                that.linkHistory.push(coord);
              })
            }
          });
        window.resetSvg(that.linkHistory);
      },
      showDistribute() {
        this.distribute = !this.distribute;
        this.distributeTabClick();
      },
      async distributeTabClick() {
        console.log(this.distributeModel);
        let data;
        this.distributeTab.forEach((item, index) => {
          if (index == this.distributeModel) {
            data = {
              taskId: this.queryModel.taskId,
              humanLabelStatus: '1',
              humanLabelTypeId: item.id,
              groupBy: 'humanLabels.labelInfos.labelId',
              datasetId: this.queryModel.datasetId
            };
          }
        });
        this.distributeTabLoading = true;
        let result = await informationService.checkdistribute(data);
        if (result.message.code == 0) {
          this.distributeList = result.data;
          this.distributeTabLoading = false
        }
      },
      //标注分布统计
      async checkdistribute() {
        let data = {
          taskId: this.queryModel.taskId,
          humanLabelStatus: '1',
          groupBy: 'humanLabelId',
          datasetId: this.queryModel.datasetId
        };
        let result = await informationService.checkdistribute(data);
        if (result.message.code == 0) {
          this.distributeList = result.data
        }
      },
      //搜索条件已标注，未标注变化
      changeSearchCondition() {
        this.DPage = 1;
        this.queryModel.cp = this.DPage;
        this.getList()
      },
      // 下一页
      next() {
        this.DPage++;
        this.queryModel.cp = this.DPage;
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
      //
      addAnswer() {
        this.AddcurposVisible = true;
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
          this.AllListNumber();
          this.getcurrentcurpos();
        }
      },
      //新增语料
      async SureaddAnswer() {
        let data = [{
          taskId: this.queryModel.taskId,
          datasetId: this.queryModel.datasetId,
          content: this.input
        }];
        let result = await informationService.Savecorpus(data);
        if (result.message.code == 0) {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          });
          this.input = '';
          this.DPage = 1;
          this.AddcurposVisible = false;
          this.queryModel.cp = this.DPage;
          this.getcurrentcurpos();
          this.getList();
        }
      },
      goPage(page) {
        this.$router.push({path: page});
      },
      goPage2(page) {
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
      //获取数据列表
      async getList() {
        this.corpusContentLoading=true;
        let result = await informationService.corpusCheck(this.queryModel);

        if (result.message.code === 0) {
          this.corpusContentLoading=false;
          this.listData = result.data.list;
          this.TestModelObj=result.data.list[0];
          if (this.DPage > 1 && this.listData.length === 0 && (this.queryModel.humanLabelStatus === '0' || this.queryModel.superiorHumanLabelStatus === 0)) {
            this.DPage = 1;
            this.queryModel.cp = this.DPage;
            this.getList();
          }
          if (this.listData.length > 0) {
            let temp;
            temp = result.data.list[0];
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
            this.dataModel = temp;
            let basestr = this.dataModel.content;
            let str = basestr.split("");
            let arr=[];
            str.forEach((item,index)=>{
              let obj={
                name:item,
                id:index
              };
              if(item=="\n"){
                obj.id="_n"
              }
              arr.push(obj)
            });
            debugger
            this.dataModel.content=arr;
            this.originalStr=arr;
            this.keywords=[];
            this.dataModel.humanLabels.forEach((item,index)=>{
              if(item.labelInfos){
                item.labelInfos.forEach((ite,inx)=>{

                    if(ite.taggingDetail){
                      ite.taggingDetail.forEach((it,ix)=>{

                        //修改已标注的结构，在 taggingDetail 加入 labelId  labelName，用于最后标注提交
                        it.labelId = ite.labelId;
                        it.labelName = ite.labelName;
                        ite.taggingDetail[ix] = it;

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

            this.highlightText(this.dataModel.content,this.keywords);
            // this.reviseLabel(this.D_N_Ner,this.dataModel,'getlist');
            this.totalCount = result.data.totalCount;
            this.queryModel.cp = result.data.currentPage;

            setTimeout(function () {
              window.clearCan();

              this.formattingLink(temp);
            }.bind(this),100);
          }
        }
      },
      //获取当前语料
      async getcurrentcurpos() {
        let data = {
          taskId: this.queryModel.taskId,
          ids: this.queryModel.datasetId
        };
        let result = await informationService.querycorpus(data);
        if (result.message.code == 0) {
          let temp = result.data.list;
          temp.forEach((item, index) => {
            if (item.humanLabelTypeNumberArr != '') {
              if(item.humanLabelTypeNumber !='') {
                item.humanLabelTypeNumberArr = JSON.parse(item.humanLabelTypeNumber)
              }
            }
          });
          let arr = temp;
          if (arr.length > 0) {
            this.totalNumber = arr[0].totalNumber;
            this.humanLabelNumberARR = arr[0].humanLabelTypeNumberArr;
            this.humanLabelNumberARR.forEach((ite, inde) => {
              ite.humanLabelNumberPercent = (ite.count / this.totalNumber) * 100
            });
          }
        }
      },
      markArrchange(id) {
        this.LabelVisible = false;
        this.queryModel.robotLabelId = '';
        this.queryModel.humanLabelId = '';
        this.queryModel.humanLabelTypeId = id;
        this.getLabelArr(id);
        this.getLabelArrDialog(id);
        this.DPage = 1;
        if (id === '' || id === undefined) {
          this.AllListNumber();
          this.queryModel.superiorHumanLabelStatus = this.queryModel.humanLabelStatus;
          this.queryModel.humanLabelStatus = ''
        } else {
          if (this.borderCard == '0') {
            this.queryModel.superiorHumanLabelStatus = '';
            this.queryModel.humanLabelStatus = '0'
          } else {
            this.queryModel.orderBy = 'humanLabels.labelAt';
            this.queryModel.superiorHumanLabelStatus = '';
            this.queryModel.humanLabelStatus = '1'
          }
        }
        this.queryModel.cp = this.DPage;
        this.getList();
        let type = {};
        this.LabelTypeOptions.forEach((item, index) => {
          if (id == item.id) {
            type = item
          }
        });
        this.D_N_Ner = type;

      },
      //获取全部下的标注进度
      async AllListNumber() {
        let data = {
          taskId: this.queryModel.taskId,
          superiorHumanLabelStatus: 1,
          datasetId: this.queryModel.datasetId,
          orderBy: 'updateAt',
          direction: 'DESC'
        };
        let result = await informationService.corpusCheck(data);
        if (result.message.code == 0) {
          this.AllNumber = result.data.totalCount;
          this.AllNumberPercent = (this.AllNumber / this.totalNumber) * 100;
          if (isNaN(this.AllNumberPercent)) {
            this.AllNumberPercent = 0;
          }
        }
      },
      //subtask  点击完成，all,点击对勾
      async corpusBiaozhu(par) {

        if(par==='subtask'){
          if(this.D_N_Ner.taggingType=="LABEL_1" && this.labelModel.labelTypeIds!=''){
            this.LABEL_1(this.LABEL_N1);
          }else if(this.D_N_Ner.taggingType=="LABEL_N"  && this.labelModel.labelTypeIds!=''){
            this.LABEL_N(this.LABEL_NList);
          }
        }
        let labelTypeIds = [];
        let labelIN = [];

        this.dataModel.humanLabels.forEach((item, index) => {
          if (item.labelTypeId == this.labelModel.labelTypeIds && item.labelInfos && par==='all') {

            if (item.labelInfos.length == '0' && item.labelStatus == '0') {
              labelTypeIds.push(item.labelTypeId)
            } else {
              item.labelInfos.forEach((ite, inde) => {
                if (ite.labelId == 'kong') {
                  item.labelInfos.splice(ite, 1);
                }
                item.labelStatus = '1'
              });
              labelIN.push(item)
            }
          } else if (this.labelModel.labelTypeIds == '' && item.labelInfos  && par==='all') {
            if (item.labelInfos.length == '0' && item.labelStatus == '0') {
              labelTypeIds.push(item.labelTypeId)
            } else {
              item.labelInfos.forEach((ite, inde) => {
                if (ite.labelId == 'kong') {
                  item.labelInfos.splice(inde, 1);
                }
                item.labelStatus = '1'
              });
              labelIN.push(item)
            }
          }else if(par === 'subtask' && item.labelTypeId==this.D_N_Ner.id){

            if (item.labelInfos.length == '0' && item.labelStatus == '0') {
              labelTypeIds.push(item.labelTypeId)
            } else {
              item.labelInfos.forEach((ite, inde) => {
                if (ite.labelId == 'kong') {
                  item.labelInfos.splice(inde, 1);
                }
                item.labelStatus = '1'
              });
              labelIN.push(item)
            }
          }
        });
        let dataS = [
          {
            labelTypeIds: labelTypeIds,
            corpusId: this.dataModel.id,//语料ID
            labels: labelIN,
            taskId: this.queryModel.taskId,//任务ID
          }
        ];
        debugger
        this.corpusContentLoading=true;
        let arrLink =[];
        console.log(this.linkHistory);

        for(var i=0;i<this.linkHistory.length;i++){//格式化数据
          let text_link_active={};
          let leftLabelId = '';
          let leftLabelName = '';
          let rightLabelId = '';
          let rightLabelName = '';
            for(var k=0;k<this.keywords.length;k++){
              if(this.linkHistory[i][8][0] === this.keywords[k].text){
                  leftLabelId = this.keywords[k].labelId;
                  leftLabelName = this.keywords[k].labelName;
              }
              if(this.linkHistory[i][8][1] === this.keywords[k].text){
                  rightLabelId = this.keywords[k].labelId;
                  rightLabelName = this.keywords[k].labelName;
              }
          }
            text_link_active.left_label_id = leftLabelId;
            text_link_active.left_label_name = leftLabelName;
            text_link_active.left_ner=this.linkHistory[i][8][0];
            text_link_active.left_start_span=this.linkHistory[i][6].split(',')[0];
            text_link_active.left_end_span=this.linkHistory[i][6].split(',')[this.linkHistory[i][6].split(',').length-1];
            text_link_active.right_label_id = rightLabelId;
            text_link_active.right_label_name = rightLabelName;
            text_link_active.right_ner=this.linkHistory[i][8][1];
            text_link_active.right_start_span=this.linkHistory[i][7].split(',')[0];
            text_link_active.right_end_span=this.linkHistory[i][7].split(',')[this.linkHistory[i][7].split(',').length-1];
            text_link_active.relation = this.linkHistory[i][5];
            text_link_active.relation_id = this.linkHistory[i][9];
            text_link_active.id = this.linkHistory[i][10];
            arrLink.push(text_link_active);
        }//end

        for(var l=0;l<dataS[0].labels.length;l++){
          var arrBox = [];
            for(var i=0;i<arrLink.length;i++){
              if(arrLink[i].id === parseInt(dataS[0].labels[l].labelTypeId)){
                delete arrLink[i].id;
                arrBox.push(arrLink[i]);
              }
            }
          dataS[0].labels[l].taggingDetail=arrBox;
        }

        let result = await informationService.corpusBiaozhu(dataS);
        debugger
        if (result.message.code == 0) {
          if (result.message.code == 0) {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            });
            window.clearCan();//清空画布
            this.ELElocation=[];//元素坐标
            this.linkHistory=[];
            this.labelModel.name = '';
            this.LabelArr = [];
            this.searchStr = '';
            if (this.labelModel.labelTypeIds === '') {
              this.LabelVisible = false;
            } else if (!this.showSwitch) {
              this.LabelVisible = false;
            }
            this.radio = '';
            if (par === 'all') {
              if (this.queryModel.humanLabelStatus == '0' || this.queryModel.superiorHumanLabelStatus == '0') {
                this.DPage--;
              }
              this.next();
            }else if(this.labelModel.labelTypeIds != ''){
               this.getList();
            }
            this.getcurrentcurpos();
            this.AllListNumber();
          } else {
            this.$message({
              showClose: true,
              message: result.message.message,
              type: 'error'
            });
          }
        }
      },
      //标签搜索
       searchLabelFun() {
         this.getLabelArrDialog(this.D_N_Ner.id,this.searchStr)
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

      //弹窗内标签dialog
      async getLabelArrDialog(fa,name) {
        let data = {
          name:name,
          taskId: this.queryModel.taskId,
          labelTypeIds: fa,
          ps: 10000
        };
        let result = await informationService.querylabel(data);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
         if(this.labelClassShow==='mouseUp'){
           this.LabelArrDialog = []
         }else {
           this.LabelArrDialog = [{name: '空', id: 'kong'}]
         }
          tempArr.forEach((item, index) => {
            let obj = {
              name: item.name,
              id: item.id
            };
            this.LabelArrDialog.push(obj);
          });
        }
      },

      async getLabelArr(fa) {
        let data = {
          taskId: this.queryModel.taskId,
          labelTypeIds: fa,
          ps: 10000
        };
        let result = await informationService.querylabel(data);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          this.LabelArr = [];
          this.optionsS = [{name: '全部', id: ''}];
          this.options = [{name: '全部', id: ''}];
          tempArr.forEach((item, index) => {
            let obj = {
              name: item.name,
              id: item.id
            };
            this.LabelArr.push(obj);
            this.options.push(obj);
            this.optionsS.push(obj);
          });
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
              labelType:item.labelType,
              name: item.name,
              id: item.id
            };
            this.ALLLabelArr.push(obj);
          });
        }
      },
      async getLabelTypeArr() {
        this.labelTypeModel.taskId = this.queryModel.taskId;
        let result = await informationService.labelClasses(this.labelTypeModel);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          this.ShowLabelTypeArr = tempArr;
          this.LabelTypeOptions = [{name: '全部', id: '', taggingType: 'ALL'}];
          this.distributeTab = [];
          let dictionaryNeed=[];
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
          if (this.LabelTypeOptions.length < 3) {
            this.labelModel.labelTypeIds = this.LabelTypeOptions[1].id;
            this.markArrchange(this.labelModel.labelTypeIds);
            this.MarkDisabled = true
          }
        }
      },
      //  reviseLabel
      reviseLabel(item, dataModel,getlist) {
        this.labelClassShow=item.taggingType;
        this.D_N_Ner = item;
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
        if(getlist!='getlist'){
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
              if(item.taggingType!='NER'){
                if (item.labelInfos && item.labelInfos.length > 0) {
                  let NameArr = [];
                  item.labelInfos.forEach((ite, ind) => {
                    NameArr.push(ite.labelName);
                  });
                  res = NameArr
                } else if (item.labelStatus == '1') {
                  res = '空';
                }
              }
            }
          });
        }
        return res
      },
      getLocation(thas){
        var index =thas.attr('data-index');
        var eleX = thas[0].offsetLeft;//选中元素的坐标系X
        var eleY = thas[0].offsetTop;//选中元素的坐标系Y
        var startX = eleX + (thas.width() / 1.5);//开始的位置X
        var startY = eleY + 38;//开始的位置Y
        this.ELElocation.push({
          index:index,
          x:startX,
          y:startY,
        })
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
              } else if (item.labelStatus == '1') {
                res = '空';
              }
            }
          });
        }
        return res
      },
      LABEL_1: function (va) {
        if (va) {
          let this_ = this;
          let target;
          let arr = this_.ALLLabelArr;
          arr.forEach((item, index) => {
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
              if (item.labelTypeId == this_.D_N_Ner.id) {
                this_.dataModel.humanLabels[index].labelInfos = [];
                this_.dataModel.humanLabels[index].labelInfos.push(target);
              }
            });
          }
        }
      },
      LABEL_N: function (va) {
        if (va) {
          let Br = this.LABEL_NList;
          let targetArr = [];
          let this_ = this;
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
            if (item.labelTypeId == this_.D_N_Ner.id) {
              this.dataModel.humanLabels[index].labelInfos = [];
              for (let i = 0; i < targetArr.length; i++) {
                this.dataModel.humanLabels[index].labelInfos.push(targetArr[i])
              }
            }
          });
        }
      }
    },
    components: {
      appHeader,
      VueAudio
    },
    mounted: function () {
      let that = this;
      setTimeout(function () {
        $('canvas').attr('height', $('.corpusContent p').height() + 900);
        $('canvas').attr('width', $('.textWrap').width());
      }, 100);
      document.onkeyup = function (event) {
        if (event.keyCode == 39) {
          that.next()
        }
        if (event.keyCode == 37) {
          that.prev()
        }
      };

      //划线start
      window.coord = [];
      window.numIndex = 0;
      window.data_index = [];
      window.activeText = [];
      window.link_click = function (thas) {
        numIndex++;
        if($(thas).find('b').length === 0){
          return false;
        }
        activeText.push($(thas).text().split('：')[1]);
        data_index.push($(thas).attr('data-index'));
        var eleX = $(thas)[0].offsetLeft;//选中元素的坐标系X
        var eleY = $(thas)[0].offsetTop;//选中元素的坐标系Y
        var startX = eleX + ($(thas).width() / 1.5);//开始的位置X
        var startY = eleY + 38;//开始的位置Y
        var startXto = $('.corpusContent p').height() + 30 + 40 * that.linkHistory.length;//到底部的像素点
        // for (var i = 0; i < that.linkHistory.length; i++) {//是同一个元素有多个指标的话X轴减10像素
        //   if (that.linkHistory[i][0] === startX || that.linkHistory[i][3] === startX) {
        //     startX -= 6;
        //   }
        // }
        if (numIndex === 1) {
          coord.push(startX);//添加开始坐标X
          coord.push(startY);//添加开始坐标Y
          coord.push(startXto);//到底部的像素点
          that.LabelVisible=false;
        } else if (numIndex === 2) {
          coord.push(startX);//添加结束坐标X
          coord.push(startY);//添加结束坐标Y
          coord.push('请选择关系');//添加文本
          coord.push(data_index[0]);
          coord.push(data_index[1]);
          coord.push(activeText);
          data_index=[];
          if (coord[0] == coord[3]) {//判断第一次点击和第二次点击是否在同一个元素  是同一个return 不执行
            coord = [];
            data_index=[];
            activeText=[];
            numIndex = 0;
            that.$message.error('错了哦，请勿在同一个标签上添加关系');
            return
          }
          for(var i=0;i<that.linkHistory.length;i++){
            var item = that.linkHistory[i];
            if(item[0]==coord[0]&& item[1] == coord[1] && item[3] == coord[3] && item[4] ==coord[4]){
              coord = [];
            data_index=[];
            activeText=[];
            numIndex = 0;
            that.$message.error('错了哦，请勿在同一个关系上添加标注');
            return
            }
          }
          that.isLabel=true;
          that.LabelVisible=true;
          that.linkHistory.push(coord);
          coord = [];
          numIndex = 0;
          activeText=[];
          clearCan();
          for (var i = 0; i < that.linkHistory.length; i++) {
            startLink(that.linkHistory[i]);
          }
        }
      };
      //点击其他元素
      window.removeLink=function(thas){
        var e = window.event;
        if(e.target.nodeName === 'I'){
          return;
        }
        var linkHistory= that.linkHistory;
        var topDiv = $('.corpusContent').scrollTop();
        var eleX = e.clientX - $(thas)[0].getBoundingClientRect().left;//选中元素的坐标系X
        var eleY = e.clientY - $(thas)[0].getBoundingClientRect().top + topDiv;//选中元素的坐标系Y
        if(linkHistory.length===0){
          return;
        }
        for(var i=0;i<linkHistory.length;i++){
          //是否靠近X轴
          if((eleX < linkHistory[i][0] && eleX+5 > linkHistory[i][0] && eleY < linkHistory[i][2] ) || (eleX > linkHistory[i][0] && eleX-5 < linkHistory[i][0] && eleY < linkHistory[i][2]) || (eleX === linkHistory[i][0] && eleY < linkHistory[i][2]) || (eleX < linkHistory[i][3] && eleX+5 > linkHistory[i][3] && eleY < linkHistory[i][2]) || (eleX > linkHistory[i][3] && eleX-5 < linkHistory[i][3] && eleY < linkHistory[i][2]) || (eleX === linkHistory[i][3] && eleY < linkHistory[i][2])){
            linkHistory.splice(i,1);
            //是否靠近Y轴
          }else if((eleY < linkHistory[i][2] && eleY+5 > linkHistory[i][2] && eleX > linkHistory[i][0] && eleX < linkHistory[i][3]) || (eleY > linkHistory[i][2] && eleY-5 < linkHistory[i][2] && eleX > linkHistory[i][3] && eleX < linkHistory[i][3])){
            linkHistory.splice(i,1);
          }
        }
        that.linkHistory = linkHistory;
        window.resetSvg(that.linkHistory)
      };
      window.resetSvg = function(data){
        clearCan();
        for(var i=0;i<data.length;i++){
          startLink(data[i]);
        }
      };
      /**
       * @deprecated 添加线条
       * @param coord 4个坐标点 一个显示文本字段
       */
      function startLink (coord) {
        // console.log(coord);
        var myCanvas = $('#myCanvas')[0];
        //声明当前画布是2d  canvas 还是 3d   webgl
        var pen = myCanvas.getContext('2d');
        pen.beginPath(); //要开始画了
        pen.lineWidth='1';
        pen.strokeStyle="#F7981C";
        pen.moveTo(coord[0],coord[1]);
        pen.lineTo(coord[0],coord[2]);
        pen.lineTo(coord[3],coord[2]);
        pen.lineTo(coord[3],coord[4]);
        pen.stroke();
        pen.beginPath(); //要开始画了
        pen.font = "14px Arial";
        pen.textAlign = "center";
        pen.fillStyle = "#008600";
        var textX = (coord[0]+coord[3])/2;
        var textY = coord[2]+15;
        pen.fillText(coord[5], textX, textY);
      }
      window.clearCan = function() {//清空画布
        var myCanvas = $('#myCanvas')[0];
        var pen = myCanvas.getContext('2d');
        pen.clearRect(0,0,$('#myCanvas').width(),$('#myCanvas').height());//清空画布
      }
      //end


    },
    filters: {
      //上传完语料之后再添加标签类别humanLabels不会对应显示对应内容
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
          if(this.isLabel && this.linkHistory[this.linkHistory.length-1][5] === '请选择关系'){
            this.linkHistory[this.linkHistory.length-1][5] = target.labelName;
            this.linkHistory[this.linkHistory.length-1][9]=target.labelId;
            this.linkHistory[this.linkHistory.length-1][10]=target.labelType.id;
            window.resetSvg(this.linkHistory);
            this.isLabel=false;
            this.LabelVisible=false;
            return
          }
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
                              end_span: ai.end_span,
                              labelId: ai.labelId,
                              labelName: ai.labelName,
                            }]
                          });
                          map[ai.labelId] = ai;
                        } else {
                          for (let j = 0; j < dest.length; j++) {
                            let dj = dest[j];
                            if (dj.labelId == ai.labelId) {
                              dj.taggingDetail.push({
                                // labelId: ai.labelId,
                                // labelName: ai.labelName,
                                ner: ai.ner,
                                start_span: ai.start_span,
                                end_span: ai.end_span
                              });
                              break;
                            }
                          }
                        }
                      }
                      debugger
                      this_.dataModel.humanLabels[index].labelInfos=dest;
                    }
                  })
              }
            });
          }
          setTimeout(function () {
            this.ELElocation=[];
            for(var i=0;i<$('.corpusContent span').length;i++){
              if($('.corpusContent span').eq(i).find('b').length!==0){
                this.getLocation($('.corpusContent span').eq(i));
              }
            }
            for(var i=0;i<this.linkHistory.length;i++){
              for(var k=0;k<this.ELElocation.length;k++){
                if(this.linkHistory[i][6] === this.ELElocation[k].index){
                  this.linkHistory[i][0] = this.ELElocation[k].x;
                  this.linkHistory[i][1] = this.ELElocation[k].y;
                }
                if(this.linkHistory[i][7] === this.ELElocation[k].index){
                  this.linkHistory[i][3] = this.ELElocation[k].x;
                  this.linkHistory[i][4] = this.ELElocation[k].y;
                }
              }
            }
            // for (var i = 0; i < this.linkHistory.length; i++) {//是同一个元素有多个指标的话X轴减6像素
            //   for(var k=1;k<this.linkHistory.length;k++){
            //     if(i===k){
            //       continue;
            //     }
            //     if (this.linkHistory[i][0] === this.linkHistory[k][0]) {
            //       this.linkHistory[k][0] = this.linkHistory[k][0];
            //     }
            //     if (this.linkHistory[i][0] === this.linkHistory[k][3]) {
            //       this.linkHistory[k][3] = this.linkHistory[k][3];
            //     }
            //     if (this.linkHistory[i][3] === this.linkHistory[k][3]) {
            //       this.linkHistory[k][3] = this.linkHistory[k][3];
            //     }
            //     if (this.linkHistory[i][3] === this.linkHistory[k][0]) {
            //       this.linkHistory[k][0] = this.linkHistory[k][0];
            //     }
            //   }
            // }
            window.resetSvg(this.linkHistory);
          }.bind(this),80);
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
debugger
            if (item.labelTypeId == this.D_N_Ner.id && this.labelClassShow!='mouseUp') {
              this.dataModel.humanLabels[index].labelInfos = [];
              for (let i = 0; i < targetArr.length; i++) {
                this.dataModel.humanLabels[index].labelInfos.push(targetArr[i])
              }
            }
          });
        }
      },
      'borderCard': function (val) {
        this.TestModelObj={};
        this.queryModel.robotLabelId = '';
        this.queryModel.humanLabelId = '';
        if (val == '0') {
          if (this.labelModel.labelTypeIds == '') {
            this.queryModel.humanLabelStatus = '';
            this.queryModel.superiorHumanLabelStatus = 0;
          } else {
            this.queryModel.superiorHumanLabelStatus = '';
            this.queryModel.humanLabelStatus = 0;
          }
          this.DPage = 1;
          this.queryModel.orderBy = 'updateAt';
          this.queryModel.cp = this.DPage;
          this.getList()
        } else if (val == '1') {
          if (this.labelModel.labelTypeIds == '') {
            this.queryModel.orderBy = 'updateAt';
            this.queryModel.humanLabelStatus = '';
            this.queryModel.superiorHumanLabelStatus = 1;
          } else {
            this.queryModel.orderBy = 'humanLabels.labelAt';
            this.queryModel.superiorHumanLabelStatus = '';
            this.queryModel.humanLabelStatus = 1;
          }
          this.DPage = 1;
          this.queryModel.cp = this.DPage;
          this.getList()
        }
      }
    },
    created: function () {
      if (this.$route.query.name) {
        this.MTitle = this.$route.query.name;
        this.queryModel.datasetId = this.$route.query.id;
        this.taskInfo = JSON.parse(sessionStorage.getItem("taskInfo"));
        this.queryModel.taskId = this.taskInfo.taskId;
        this.getLabelTypeArr();
        // this.getList();
        this.getLabelArr();
        this.getcurrentcurpos();
        this.getAllLabelArr();
        this.markArrchange();
        this.$root.$on('getResponse',(_this) => {
          let that=this;
          if(_this){
            let str=_this.parentNode.parentNode;
            let arrStr= $(str).attr('data-index');
            let numIndex=_this.parentNode.textContent.indexOf("：")+1;
            let textStr=_this.parentNode.textContent.substr(numIndex);
            let arr=arrStr.split(',').map(Number);
            let arrtextStr=textStr.split('').reverse();
            setTimeout(function () {
              that.ELElocation=[];
              for(var i=0;i<$('.corpusContent span').length;i++){
                if($('.corpusContent span').eq(i).find('b').length!==0){
                  that.getLocation($('.corpusContent span').eq(i));
                }
              }
              setTimeout(function () {
                for(let i=0;i<that.linkHistory.length;i++){
                  if(that.linkHistory[i][8][0] === textStr || that.linkHistory[i][8][1] === textStr){
                    that.linkHistory.splice(i,1);
                  }
                }
                for(var i=0;i<that.linkHistory.length;i++){
                  for(var k=0;k<that.ELElocation.length;k++){
                    if(that.linkHistory[i][6] === that.ELElocation[k].index){
                      that.linkHistory[i][0] = that.ELElocation[k].x;
                      that.linkHistory[i][1] = that.ELElocation[k].y;
                    }
                    if(that.linkHistory[i][7] === that.ELElocation[k].index){
                      that.linkHistory[i][3] = that.ELElocation[k].x;
                      that.linkHistory[i][4] = that.ELElocation[k].y;
                    }
                  }
                }
                window.resetSvg(that.linkHistory);//删除重绘
              },0);
            },0);
            that.keywords.forEach((item,index)=>{
              debugger

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
  }
</script>
<style>
  .el-progress-bar__outer {
    background: #D9D9D9;
  }

  .el-tabs--border-card {
    box-shadow: none !important;
  }

  .pl100 {
    padding-top: 30px;
    padding-left: 88px
  }
  .bg2{
    background: red;
  }
</style>
<style scoped>
  .textWrap {
    width: 100%;
    border-bottom: 1px solid #DFE2E5;
    position: relative;
    box-sizing: border-box;
    padding: 5px;
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

  .textBtn.next {
    float: right
  }

  .PL15 {
    padding-left: 15px;
    /*background-color: #EFF3F6;*/
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
  canvas{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .corpusContent p{
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 100;
  }
  .corpusContent{
    overflow-x: hidden;
  }
</style>
