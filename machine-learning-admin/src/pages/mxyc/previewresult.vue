<template>
  <div>
    <el-col style="text-align: right;padding-right: 10px; padding-top: 10px;">

    </el-col>
    <div style="clear: both"></div>
    <div style="box-sizing: border-box;padding: 0 20px">
      <el-row style="">
        <div class="selectWrap">
          <el-select size="small" v-model="labelModel.labelTypeIds" :disabled="MarkDisabled" filterable placeholder="请选择"
                     @change="markArrchange">
            <el-option
              v-for="item in labelTypeIdsArr"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <el-popover width="400" trigger="click">
          <el-tabs type="border-card" v-model="distributeModel" @tab-click="distributeTabClick()">
            <el-tab-pane  v-for="(item,index) in distributeTab"
                         :label="item.name" :value="item.id" :key="index" style="max-height: 200px;overflow: auto"
                         v-loading="distributeTabLoading"
                         element-loading-text="拼命加载中"
                         element-loading-spinner="el-icon-loading"
            >
              <div>
                <p class="distributeP">
                  <span>标签</span>
                  <span>机器预测对</span>
                  <span>人工修改</span>
                </p>
                <!--<p class="distributeP">
                  <span>总计</span>
                  <span></span>
                  <span></span>
                </p>-->
              </div>
              <div v-for="LabelItem in distributeListArr ">
                <p class="distributeP" v-if="RobotNumberF(LabelItem.id)!=0 || humanNumberF(LabelItem.id)!=0">
                  <span>{{LabelItem.name}}</span>
                  <span>{{RobotNumberF(LabelItem.id)}}</span>
                  <span>{{humanNumberF(LabelItem.id)}}</span>
                </p>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-button slot="reference" @click="showDistribute()"
                     style="background: #7F8FA4;color: #fff;border: none;float: right;margin-top: 7px" size="small">
            标注分布统计
          </el-button>
        </el-popover>
        <div style="margin-right: 10px;display: block;float: right">
          <p style="float: right;width: 200px;margin-left: 20px;margin-top: 16px">
            <el-progress :percentage="parseInt(humanLabelNumberTotalNumber)" :stroke-width="14"
                         color="#45B854">
            </el-progress>
          </p>
          <span style="float: right">已标注:
            <span style="color:#45B854;font-size: 30px">{{this.humanLabelNumber}}</span>
            <span
              style="color: #000000;font-size: 18px;">&nbsp;/&nbsp;{{this.humanLabelNumber+this.WtotalNumber}}</span>
          </span>
        </div>

      </el-row>
      <el-tabs type="border-card" v-model="borderCard">
        <el-tab-pane label="语料标注">
          <el-form :inline="true" :model="queryModel" class="demo-form-inline">
            <el-form-item label="机器预测：" style="float: right;margin-bottom: 0" v-if="labelModel.labelTypeIds!=''">
              <el-select size="small" v-model="queryModel.robotLabelId" filterable placeholder="请选择"
                         @change="changeSearchCondition">
                <el-option
                  v-for="(item,index) in optionsS"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{item.name}}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px" v-if="item.name!='全部'">{{SpeedFilter(item.id)}}</span>
                </el-option>
              </el-select>
              <!--置信度选项-->
              <el-select size="small" v-model="queryModel.direction" filterable placeholder="请选择"  @change="changeSearchCondition">
                <el-option
                  v-for="(item,index) in directionArr"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="语料审核">
          <el-form :inline="true" :model="queryModel" class="demo-form-inline">
            <el-form-item label="机器预测：" style="float: right;margin-bottom: 0" v-if="labelModel.labelTypeIds!=''">
              <el-select size="small" v-model="queryModel.robotLabelId" filterable placeholder="请选择"
                         @change="changeSearchCondition">
                <el-option
                  v-for="(item,index) in optionsS"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{item.name}}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px" v-if="item.name!='全部'">{{SpeedFilter(item.id)}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="人工标签：" style="float: right;margin-bottom: 0" v-if="labelModel.labelTypeIds!=''">
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
        <!--<span style="text-align: center;display: inline-block;width: 100%;margin: 10px 0;" v-if="listData.length<1" >暂无数据</span>-->
        <span style="text-align: center;display: inline-block;width: 100%;margin: 10px 0;" v-if="preStates!='2'">{{this.preStates | preStatesFilter }}</span>
      </el-tabs>
      <el-row style="position: relative;border-left:1px solid rgb(223, 226, 229);border-right:1px solid rgb(223, 226, 229);height: 24px;">
        <VueAudio ref="children" :send-obj="TestModelObj"></VueAudio>
      </el-row>
      <el-row style="border: solid 1px #DFE2E5;border-top: none;" v-if="listData.length>0">
        <div class="textWrap Water" v-model="dataModel">
          <div class="corpusContent" v-if="!ShowClassesContent"  v-loading="corpusContentLoading"
               element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)">
            <!--{{dataModel.content}}-->
            <span  @mouseup="mouseUp($event)"  @mousedown="mouseDown($event)" v-for="(item,index) in dataModel.content" :key="index" :data-index="item.id" v-html="item.name"></span>
          </div>
          <div v-loading="corpusContentLoading"
               element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)"
               class="corpusContent" v-if="ShowClassesContent" v-html="UnderlineText(ClassesContent,UnderlineTextArr)"></div>

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
             v-if="this.DPage<RightShow" @click="next()">
            <img style="width: 100%;height: auto" src="../../../static/images/icon-Right.png" alt="">
          </i>
        </div>
        <div style="background: #fff">
          <div style="display: inline-block;width: 100%;padding: 10px 0 " v-if="D_N_Ner.taggingType!='NER' && D_N_Ner.taggingType!='RELATION' && D_N_Ner.taggingType!='NER_LABEL_1'">
            <div class="PL15" v-for="(item,index) in labelTypeIdsArr" :key="index"
                 v-if="labelModel.labelTypeIds!=''?D_N_Ner.id==item.id:true && item.taggingType!='NER' && item.taggingType!='RELATION'&& item.taggingType!='NER_LABEL_1'&& item.taggingType!='' " style="width: 100%;position: relative">
              <h4 style="display: inline-block">{{item.name}}&nbsp;&nbsp;></h4>
              人工标签：<span class="humanLabel" v-for="HItem in humanLabelFilter(item.id)">{{HItem}}</span>
              机器预测：
              <span v-for="RItem in RobotLabelFilter(item.id)">
               <a class="RobotLabel" target="_blank" :href="RItem.url">{{RItem.labelName?RItem.labelName:'-'}}</a>
               <span style="position: absolute;right: 16px;top: 8px;"
                     v-if="RItem.confidence">置信度：{{RItem.confidence}}</span>
              </span>
              <a @click="reviseLabel(item,dataModel)" class="revise">修改</a>
            </div>
          </div>
          <div  v-for="(item,index) in labelTypeIdsArr" :key="index" v-if="D_N_Ner.taggingType==='NER' || D_N_Ner.taggingType==='RELATION'|| D_N_Ner.taggingType==='NER_LABEL_1'">
            <el-button  @click="CheckMachine()" style="background: #7F8FA4;color: #fff;border: none;margin: 10px 0 10px" size="small">
              查看机器预测
            </el-button>
            <span v-for="RItem in nerRobotLabelFilter(item.id)" style="position: absolute;right: 16px;bottom: 45px" >
               <span v-if="RItem.confidence">置信度：{{RItem.confidence.toFixed(3)}}</span>
            </span>
          </div>

        </div>
        <div style="display: inline-block;float: right">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="DPage"
            :page-size="1"
            layout="jumper">
          </el-pagination>
        </div>
      </el-row>
      <!--三个大按钮box-->
      <div style="margin-top: 30px;margin-left: 84px" v-if="listData.length>0">
        <!--对勾-->
        <a @click="corpusBiaozhu('all')"><img style="width: 90px;height: auto;cursor: pointer"
                                               src="../../../static/images/Tick.png" alt=""></a>
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
          <el-switch v-if="labelModel.labelTypeIds!='' && this.labelClassShow!='mouseUp'" style="float: right;margin-right: 30px;margin-top: 3px;"
                     v-model="showSwitch" active-text="悬浮"></el-switch>
        </div>
        <!--单标签-->
        <el-radio-group v-model="LABEL_N1" v-if="labelClassShow!='LABEL_N'" class="radioGroup">

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
            <el-button size="small" type="primary" @click="corpusBiaozhu('subtask')">修 改</el-button>
      </span>
      </el-dialog>

      <!--机器预测-->
      <el-dialog title="机器预测结果" :visible.sync="CheckMachineVisible" width="80%" v-dialogDrag>
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
        corpusContentLoading:false,//预料loading
        directionArr:[
          {
            value: 'ASC',
            label: '置信度正序'
          }, {
            value: 'DESC',
            label: '置信度倒序'
          }
        ],
        UnderlineTextArr:[],
        ShowClassesContent:false,
        ClassesContent:'',//分类展示内容
        //标注分布统计，
        labelTypeIdsArr:[],
        labelTypeIdsArrTAb:[],
        MarkDisabled:false,
        CheckMachineVisible:false,
        distributeListTable: false,
        modelTrainId: '',
        D_N_Ner: '',
        distributeListArr: [],//全部标签
        //全部标注进度
        AllNumber: 0,//全部已标注数
        AllNumberPercent: 0,//全部已标注数百分比
        distributeTabLoading: false,
        distribute: false,//标注分布统计显示隐藏开关
        distributeTab: [],//切换显示类别
        distributeModel: '0',//切换显示类别
        distributeList: [],
        showSwitch: true,
        LABEL_NList: [],//多选选中数据
        LABEL_N1: '',//单选选中数据
        LabelVisible: false,//标签列表弹窗
        LabelVisibleMouse: false,//标签列表弹窗
        LabelArrDialog: [],
        ALLLabelArr: [],
        LabelTypeOptions: [],
        ArrByHumanLabelTypeId: [],
        ArrByHumanLabelEditType: [],
        labelTypeModel: {//分类
          ps: 10000
        },
        labelModel: {
          labelTypeIds: '',
          ps: 10000
        },
        totalNumber: 0,
        changeChoose: '',
        borderCard: '',
        StopNumber: '',
        humanLabelNumberTotalNumber: 0,
        //已标注、未标注
        WtotalNumber: 0,//未标注
        humanLabelNumber: 0,//已标注
        searchStr: '',//标签搜索

        dataModel: {},
        SureBtn: false,
        Dtag: true,
        radio: '',
        loading: true,
        value: '',
        checkboxGroup1: ['条件选股'],
        corpusSearchModel: {},
        listData: [],
        RightShow: 0,
        LabelArr: [],
        SLabelArr: [],
        showListLoading: false,
        queryModel: {
          humanLabelStatus: '0',
          orderBy: 'updateAt',
          cp: 1,
          ps: 1,
        },
        totalCount: '',
        options: [
          {name: '全部', id: ''}
        ],
        optionsS: [
          {name: '全部', id: ''}
        ],
        // url:'http://knows.rxhui.com/knowledge/info?',
        Linkurl: 'http://report.rxhui.com/knows.html?',
        DPage: 1,//当前页
        timer: null,
        humanLabelTypeId: '',
        //  机器预测标签列表中进度值
        AllRobotArr: [],
        AllRobotArrStatus1: [],
        preModel: {
          model:{
            labelTypeIds:''
          }
        },//获取预测状态
        preStates: '',//获取预测状态

        taggingDetail:{},
        keywords:[],
        robotLabelskeywords:[],
        robotLabelskeywordsBase:[],
        keywordsFacing:[],
        mouseTarget:'',//鼠标选中内容,
        Event:'',
        MouseDownIndex:'',
        MouseUpIndex:'',
        MouseUpIndexText:'',
        MouseDownIndexText:'',
        labelClassShow:'',
        canShowbiuaozhu:'',
        dictionaryColor:[],
        fuzhi:false,
        PrestateSuccess:false
      }
    },
    methods: {
      handleCurrentChange(page){
        this.queryModel.cp=page
        this.DPage=page
        this.getList();
      },
      //查看机器预测
      CheckMachine() {
        this.CheckMachineVisible=true;
        // this.highlightText(this.dataModel.robotcontent,this.robotLabelskeywords,'robot');
      },

      mouseDown(event){

        this.MouseDownIndex=Number($(event.target).attr('data-index'))
        this.MouseDownIndexText= $(event.target)[0].innerHTML
        /* $(event.target).addClass('bg2')*/
      },
      //鼠标抬起
      mouseUp(){

        let topA=0;
        let leftA=0;
        let targetWrapWidth=0;
        topA=$(event.target)[0].offsetTop-$(".corpusContent").scrollTop();;
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
          this.labelTypeIdsArr.forEach((a,b)=>{
            if(a.taggingType=='NER' || a.taggingType=='RELATION'|| a.taggingType=='NER_LABEL_1'){
              this.canShowbiuaozhu=a.taggingType;
              this.labelClassShow='mouseUp';
              this.LABEL_N1='';
              labelTypeId.push(a.id)
            }
          });
        }else {
          this.labelTypeIdsArr.forEach((a,b)=>{
            if(a.id==this.labelModel.labelTypeIds){
              this.canShowbiuaozhu=a.taggingType
              if(a.taggingType==='NER' || a.taggingType==='RELATION' || a.taggingType==='NER_LABEL_1'){
                this.labelClassShow='mouseUp';
                this.LABEL_N1='';
              }
            }
          });
          labelTypeId.push(this.labelModel.labelTypeIds)
        }
        if(labelTypeId.toString()===''){
          return
        }else{
          this.getLabelArrDialog(labelTypeId.toString());
        }
        let selection_text = window.getSelection().toString();
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
      highlightText(sourceText, keywords,type) {
        // debugger
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
          if(type==='robot'){

            arrI={
              id:ids,
              name:'<b class="ChooseLabel '+ ColorArr[colorIndex]+'"><span>'+ item.labelName +'：</span>' + item.text + '</b>'
            };
          }else {

            arrI={
              id:ids,
              name:'<b class="ChooseLabel '+ ColorArr[colorIndex]+'"><h class="chooseLabel_score">'+ item.score.toFixed(3) +'</h><i class="deleteIcon" onclick="getResponse(this)">X</i><span>'+ item.labelName +'：</span>' + item.text + '</b>'
            };
          }
          sourceText.splice(deleteids[0], deleteids.length , arrI);
          window.getSelection().removeAllRanges();
        });
        this.LabelVisibleMouse=false;

        return sourceText;
      },

      UnderlineText(sourceText,keywords){
        if (!sourceText)
          return '';
        if (!keywords)
          return sourceText;
        keywords.forEach(function (item) {
          sourceText = sourceText.replace(eval('/' + (item.indexOf('*')!==-1?'\\'+item:item) + '/g'), '<span class="textUnder">' + item + '</span>');
        });
        return sourceText;
      },

      //  获取训练状态
      async Prestate() {
        let data = {
          taskId: this.queryModel.taskId,
          orderBy: 'predictionAt',
          direction: 'DESC'
        };
        let result = await informationService.getResultOne(data);
        if (result.message.code == 0) {
          let arr = result.data.list;
          if (arr.length > 0) {
            this.preModel = result.data.list[0];
            let arr=this.preModel.model.labelTypeIds.split(',');
            let arr2=[];
            let distributeTab=[];
            arr.forEach((item,index)=>{
              this.LabelTypeOptions.forEach((itm,isx)=>{
                 if(itm.id==item){
                    arr2.push(itm)
                   distributeTab.push(itm)
                 }
              })
            });
            this.labelTypeIdsArr=arr2;
            this.distributeTab=distributeTab;
            this.preStates = this.preModel.predictionStatus;
            let Model=this.preModel.model;
            if(Model.labelTypes[0].taggingType==='LABEL_1' || Model.labelTypes[0].taggingType==='LABEL_N'){
              this.ShowClassesContent=true;
              this.UnderlineTextArr=[];
              let arrA=JSON.parse(Model.modelConfig).list;
              if(arrA!==undefined && arrA){
                let arrAAAA=JSON.parse(arrA);
                arrAAAA.forEach((item,index)=>{
                  if(item.or){
                    let teAr=[];
                    teAr=item.or.split(",");
                    teAr.forEach((a,b)=>{
                      this.UnderlineTextArr.push(a);
                    });
                  }
                  if(item.not){
                    let teAr=[];
                    teAr=item.not.split(",");
                    teAr.forEach((a,b)=>{
                      this.UnderlineTextArr.push(a);
                    });
                  }
                  if(item.and){
                    let teAr=[];
                    teAr=item.and.split(",");
                    teAr.forEach((a,b)=>{
                      this.UnderlineTextArr.push(a);
                    });
                  }
                })
              }
            }
            if (this.$route.query.modelTrainId) {
              this.queryModel.modelTrainId = this.$route.query.modelTrainId;
            } else {
              this.queryModel.modelTrainId = this.preModel.id;
            }
            if(arr.length<2){
              this.labelModel.labelTypeIds=parseInt(this.labelTypeIdsArr[0].id);
              this.markArrchange(this.labelModel.labelTypeIds);
              this.MarkDisabled=true;
            }else {
              let obj={
                name:'全部',
                id:'',
                taggingType:''
              };
              this.labelTypeIdsArr.unshift(obj)
              this.markArrchange('');
            }
            this.PrestateSuccess=true;
          }
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
          this.getcurrentcurpos(this.labelModel.labelTypeIds);
        }
      },

      showLabel() {
        this.LabelVisible = true;
      },
      showDistribute() {
        this.distributeTabClick();
      },
      distributeTabClick() {
        this.distributeTab.forEach((item, index) => {
          if (index == this.distributeModel) {
            this.distributeListA(item.id);
          }
        });
        this.checkdistribute1();
        this.checkdistribute2();

      },
      RobotNumberF(id) {
        let num = 0;
        this.ArrByHumanLabelEditType.forEach((item, index) => {
          let a = item.groupBy['humanLabels.labelInfos.labelId'];
          if (id == a) {
            num = item.count
          }
        });
        return num
      },
      humanNumberF(id) {
        let num = 0;
        this.ArrByHumanLabelTypeId.forEach((item, index) => {
          let a = item.groupBy['humanLabels.labelInfos.labelId'];
          if (id == a) {
            num = item.count
          }
        });
        return num
      },

      async checkdistribute1() {
        let data
        this.distributeTab.forEach((item, index) => {
          if (index == this.distributeModel) {

            data = {
              taskId: this.queryModel.taskId,
              humanLabelStatus: '1',
              humanLabelTypeId: item.id,
              humanLabelEditType: '1',
              groupBy: 'humanLabels.labelInfos.labelId',
              datasetId: this.queryModel.datasetId,
              modelTrainId: this.queryModel.modelTrainId
            };

          }
        });
        this.distributeTabLoading = true;
        let result = await informationService.checkdistributePre(data);
        if (result.message.code == 0) {
          this.ArrByHumanLabelTypeId = result.data;
          this.distributeTabLoading = false
        }
      },
      async checkdistribute2() {
        let data
        this.distributeListTable = !this.distributeListTable;
        this.distributeTab.forEach((item, index) => {
          if (index == this.distributeModel) {
            data = {
              taskId: this.queryModel.taskId,
              humanLabelStatus: '1',
              groupBy: 'humanLabels.labelInfos.labelId',
              datasetId: this.queryModel.datasetId,
              humanLabelTypeId: item.id,
              humanLabelEditType: '2',
              modelTrainId: this.queryModel.modelTrainId
            };

          }
        });
        this.distributeTabLoading = true;
        let result = await informationService.checkdistributePre(data);
        if (result.message.code == 0) {
          this.distributeTabLoading = false;
          this.ArrByHumanLabelEditType = result.data;

        }
      },
      changeSearchCondition() {
        this.DPage = 1;
        this.queryModel.cp = this.DPage;
        this.getList();
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
      //获取数据列表
      async getList() {
        this.corpusContentLoading=true;
        let result = await informationService.corpusCheckprediction(this.queryModel);
        if (result.message.code === 0) {
          this.corpusContentLoading=false;
          this.listData = result.data.list;
          if (this.DPage > 1 && this.listData.length === 0 && (this.queryModel.humanLabelStatus === '0' || this.queryModel.superiorHumanLabelStatus === 0)) {
            this.DPage = 1;
            this.queryModel.cp = this.DPage;
            this.getList();
          }
          this.RightShow = result.data.totalCount;
          if (this.listData.length > 0) {
            let temp,tempRobot;
            temp = result.data.list[0].corpus;
            this.TestModelObj=result.data.list[0].corpus;
            this.ClassesContent=temp.content;
            tempRobot = result.data.list[0].robotLabels;
            //   console.log(this.preModel.model.labelTypeIds); 预测模型的标签类型
            let PrelabelTypeArr=this.preModel.model.labelTypeIds.split(",");
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
              }else if(ite.labelInfos.length>0){
                ite.labelInfos.forEach((a,b)=>{
                  if(a.taggingDetail && a.taggingDetail!=''){
                    let dd= a.taggingDetail.replace(/'/g, '"');
                    a.taggingDetail=JSON.parse(dd)
                  }
                })
              }
            });
            tempRobot.forEach((ite, inde) => {
              if (!ite.labelInfos) {
                ite.labelInfos = []
              }else if(ite.labelInfos.length>0){
                ite.labelInfos.forEach((a,b)=>{
                  if(a.taggingDetail && a.taggingDetail!=''){
                    let cc= a.taggingDetail.replace(/'/g, '"');
                    a.taggingDetail=JSON.parse(cc)
                  }
                })
              }
            });
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
            this.robotLabelskeywordsBase=[];
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
            tempRobot.forEach((item,index)=>{
              if(item.labelInfos){
                item.labelInfos.forEach((ite,inx)=>{
                  if(ite.taggingDetail){
                    ite.taggingDetail.forEach((it,ix)=>{
                      let obj={
                        anchorOffset:it.end_span,
                        focusOffset:it.start_span,
                        text:it.ner,
                        score:it.score,
                        labelName:ite.labelName,
                        labelId:ite.labelId,
                        labelType:{
                          id:item.labelTypeId
                        },

                      };
                      if(this.labelModel.labelTypeIds=='' || this.labelModel.labelTypeIds==undefined){
                        this.robotLabelskeywords.push(obj)
                        this.robotLabelskeywordsBase.push(obj)
                      }else {
                        if(obj.labelType.id==this.labelModel.labelTypeIds){
                          this.robotLabelskeywords.push(obj)
                          this.robotLabelskeywordsBase.push(obj)
                        }
                      }
                    })
                  }
                })
              }
            });
            this.dataModel.humanLabels.forEach((item,index)=>{
              if(item.labelStatus==1){
                this.fuzhi=true
              }
            });
            if(this.D_N_Ner.taggingType==="NER" || this.D_N_Ner.taggingType==="RELATION"|| this.D_N_Ner.taggingType==="NER_LABEL_1"){
              if(this.keywords.length==0 && !this.fuzhi){
                this.keywords=this.robotLabelskeywords;
                this.dataModel.humanLabels=tempRobot
              }
            }

            this.highlightText(this.dataModel.content,this.keywords);
            this.highlightText(this.dataModel.robotcontent,this.robotLabelskeywords,'robot');
            this.queryModel.cp = result.data.currentPage;
          }else {
            this.TestModelObj=result.data.list[0];
          }
        }
      },
      //未标注数
      async getListTotle(searchNumber) {
        let data = {
          taskId: this.queryModel.taskId,
          humanLabelStatus: 0,
          humanLabelTypeId: searchNumber,
          cp:1,
          ps:1,
          modelTrainId: this.queryModel.modelTrainId
        };
        if (this.labelModel.labelTypeIds == '') {
          data.superiorHumanLabelStatus = 0;
          data.humanLabelStatus = ''
        }
        let result = await informationService.corpusCheckprediction(data);
        if (result.message.code == 0) {
          this.WtotalNumber = result.data.totalCount;
          this.StopNumber = this.WtotalNumber + this.humanLabelNumber;
          this.humanLabelNumberTotalNumber = this.humanLabelNumber / (this.WtotalNumber + this.humanLabelNumber) * 100
          if (isNaN(this.humanLabelNumberTotalNumber)) {
            this.humanLabelNumberTotalNumber = 0;
          }
        }
      },
      //获取yi标注数
      async getcurrentcurpos(searchNumber) {
        let data = {
          cp:1,
          ps:1,
          taskId: this.queryModel.taskId,
          humanLabelStatus: 1,
          humanLabelTypeId: searchNumber,
          modelTrainId: this.queryModel.modelTrainId
        };
        if (this.labelModel.labelTypeIds == '') {
          data.superiorHumanLabelStatus = 1;
          data.humanLabelStatus = ''
        }
        let result = await informationService.corpusCheckprediction(data);
        if (result.message.code == 0) {
          this.humanLabelNumber = result.data.totalCount;
          this.getListTotle(searchNumber)
        }
      },
      markArrchange(id) {
        this.LabelVisible = false;
        this.distributeListTable = false;
        this.queryModel.robotLabelId = '';
        this.queryModel.humanLabelId = '';
        this.queryModel.superiorHumanLabelStatus = '';
        this.humanLabelTypeId = id;
        this.getLabelArr(id);
        this.RobotSpeed();
        this.RobotSpeedAll();
        this.DPage = 1;
        if (id === '' || id === undefined) {
          if(this.borderCard=='0'){
            this.queryModel.superiorHumanLabelStatus='0';
            this.queryModel.humanLabelStatus =''
          }else {
            this.queryModel.superiorHumanLabelStatus='1';
            this.queryModel.humanLabelStatus =''
          }
          this.queryModel.orderBy = 'updateAt';
          this.queryModel.direction = 'DESC';
        }else {
          this.queryModel.humanLabelTypeId=id;
          this.queryModel.robotLabelTypeId=id;
          this.queryModel.orderBy = 'confidences';
          this.queryModel.direction = 'ASC';
          if(this.borderCard=='0'){
            this.queryModel.superiorHumanLabelStatus='';
            this.queryModel.humanLabelStatus ='0'
          }else {
            this.queryModel.superiorHumanLabelStatus='';
            this.queryModel.humanLabelStatus ='1'
          }
        }
        this.queryModel.cp = this.DPage;
        this.getcurrentcurpos(id);
        this.getList();
        let type = {};
        this.LabelTypeOptions.forEach((item, index) => {
          if (id == item.id) {
            type = item
          }
        });
        this.D_N_Ner = type;
      },
      // distributeListArr
      async distributeListA(fa) {
        let data = {
          taskId: this.queryModel.taskId,
          labelTypeIds: fa,
          ps: 10000
        };
        let result = await informationService.querylabel(data);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          this.distributeListArr = [];
          tempArr.forEach((item, index) => {
            let obj = {
              name: item.name,
              id: item.id
            };
            this.distributeListArr.push(obj);
          });
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
          let dictionaryNeed=[];
          if(tempArr.length>1){
            this.LabelTypeOptions = [{name: '全部', id: '', taggingType: 'ALL'}];
          }else {
            this.LabelTypeOptions=[]
          }
          this.distributeTab = [];
          tempArr.forEach((item, index) => {
            if(item.taggingType==="NER" || item.taggingType==="RELATION"|| item.taggingType==="NER_LABEL_1"){
              dictionaryNeed.push(item.id)
            }
            let obj = {
              taggingType: item.taggingType,
              name: item.name,
              id: item.id
            };
            this.LabelTypeOptions.push(obj);
            // this.distributeTab.push(obj);
          });
          this.getdictionaryDialog(dictionaryNeed.toString());
          this.Prestate();
        }
      },
      //  reviseLabel
      reviseLabel(item, dataModel,getlist) {
        this.D_N_Ner = item;
        this.labelClassShow=item.taggingType;
        this.LABEL_NList = [];//与语料标注页面不用
        this.LABEL_N1 = '';
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
              console.log(this.LABEL_NList);
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

      nerRobotLabelFilter: function (val) {
        let res = '-';
        let arr = this.dataModel.robotLabels;
        let NameArr = [];
        if (arr) {
          arr.forEach((item, index) => {
            if (item.labelTypeId == val) {
              if (item.labelInfos && item.labelInfos.length > 0) {

                let obj = {
                  confidence: item.confidence,
                };
                //保留最小的置信度
                if (NameArr.length > 0){
                  var confidence = NameArr[0].confidence;
                  if (confidence > obj.confidence ){
                    NameArr = [];
                    NameArr.push(obj);
                  }
                }else {
                  NameArr.push(obj);
                }
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
                      url:ite.labelName.indexOf('(') > 0 ? this.Linkurl +'illegalType='+ ite.labelName.substr(0, ite.labelName.indexOf('(')) : this.Linkurl +'illegalType='+ ite.labelName
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
      equar(a, b) {
        // 判断数组的长度
        if (a.length !== b.length) {
          return false
        } else {
          // 循环遍历数组的值进行比较
          for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
              return false
            }
          }
          return true;
        }
      },
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
        let thia=this;
        this.dataModel.humanLabels.forEach((item, index) => {
          if (item.labelTypeId == this.labelModel.labelTypeIds && item.labelInfos  && par==='all') {
            if(thia.equar(thia.robotLabelskeywordsBase,thia.keywords) && thia.keywords.length!=0){
              labelTypeIds.push(item.labelTypeId)
            }else {
              if(item.labelInfos.length=='0' && item.labelStatus=='0'){
                labelTypeIds.push(item.labelTypeId)
              }else {
                item.labelInfos.forEach((ite, inde) => {
                  if (ite.labelId == 'kong') {
                    item.labelInfos.splice(ite, 1);
                  }
                  item.labelStatus='1'
                });
                labelIN.push(item)
              }
            }
          } else if (this.labelModel.labelTypeIds == '' && item.labelInfos  && par==='all') {
            if(item.labelInfos.length=='0' && item.labelStatus=='0'){
              labelTypeIds.push(item.labelTypeId)
            }else {
              item.labelInfos.forEach((ite, inde) => {
                if (ite.labelId == 'kong') {
                  item.labelInfos.splice(inde, 1);
                }
                item.labelStatus='1'
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
            modelTrainId: this.modelTrainId,
          }
        ];
        this.corpusContentLoading=true;
        let result = await informationService.corpusBiaozhuprediction(dataS);
        debugger
        if (result.message.code == 0) {
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
            if (par === 'all') {
              if (this.queryModel.humanLabelStatus == '0' || this.queryModel.superiorHumanLabelStatus == '0') {
                this.DPage--;
              }
              this.next();
            }else if(this.labelModel.labelTypeIds != ''){
               this.getList();
            }
            if (this.labelModel.labelTypeIds === '') {
              this.LabelVisible = false;
            } else if (!this.showSwitch) {
              this.LabelVisible = false;
            }
            this.getLabelArr();
            this.getcurrentcurpos(this.labelModel.labelTypeIds);
            this.RobotSpeed();
            this.RobotSpeedAll();
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
      async getLabelArr() {
        this.labelModel.taskId = this.queryModel.taskId;
        let result = await informationService.querylabel(this.labelModel);
        if (result.message.code == 0) {
          let tempArr = result.data.list;
          this.LabelArr = [];
          this.SLabelArr = [];
          this.optionsS = [{name: '全部', id: ''}];
          this.options = [{name: '全部', id: ''}];
          tempArr.forEach((item, index) => {
            let obj = {
              name: item.name,
              id: item.id
            };
            this.LabelArr.push(obj);
            this.SLabelArr.push(obj);
            this.optionsS.push(obj);
            this.options.push(obj);
          });
        }
      },
      //  机器预测标签列表中进度值
      //   AllRobotArr:[],this.labelModel.labelTypeIds
      //   AllRobotArrStatus1:[],
      async RobotSpeed() {
        if(!this.labelModel.labelTypeIds){
          return
        }
        let data = {
          taskId: this.queryModel.taskId,
          humanLabelTypeId: this.labelModel.labelTypeIds,
          robotLabelTypeId: this.labelModel.labelTypeIds,
          verifyStatus: '1',
          groupBy: 'robotLabels.labelInfos.labelId',
          modelTrainId: this.modelTrainId,
        };
        let result = await informationService.checkdistributePre(data);
        if (result.message.code == 0) {
          this.AllRobotArrStatus1 = result.data;

        }
      },
      async RobotSpeedAll() {
        if(!this.labelModel.labelTypeIds){
          return
        }
        let data = {
          taskId: this.queryModel.taskId,
          humanLabelTypeId: this.labelModel.labelTypeIds,
          robotLabelTypeId: this.labelModel.labelTypeIds,
          groupBy: 'robotLabels.labelInfos.labelId',
          modelTrainId: this.modelTrainId,
        };
        let result = await informationService.checkdistributePre(data);
        if (result.message.code == 0) {
          this.AllRobotArr = result.data;

        }
      },
      SpeedFilter(val) {
        let res = '';
        let numerator = 0;//分子
        let denominator = 0;//分母
        //   AllRobotArr:[],
        //   AllRobotArrStatus1:[],
        this.AllRobotArr.forEach((item, index) => {
          if (item.groupBy['robotLabels.labelInfos.labelId'] == val) {
            denominator = item.count
          }
        });
        this.AllRobotArrStatus1.forEach((item, index) => {
          if (item.groupBy['robotLabels.labelInfos.labelId'] == val) {
            numerator = item.count
          }
        });
        res = numerator + '/' + denominator;
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
      appHeader,VueAudio
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
      if (this.timer) {
        clearInterval(this.timer)
      } else {
        this.timer = setInterval(() => {
          this.getList();
          this.Prestate()
          this.getcurrentcurpos();
        }, 5000)
      }
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
              if (item.labelTypeId == this_.D_N_Ner.id && this_.D_N_Ner.taggingType!='NER' && this_.D_N_Ner.taggingType!='RELATION'&& this_.D_N_Ner.taggingType!='NER_LABEL_1' && this.labelClassShow!='mouseUp') {
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
        if (va && this.D_N_Ner.taggingType!='NER' && this.D_N_Ner.taggingType!='RELATION'&& this.D_N_Ner.taggingType!='NER_LABEL_1'){
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
      "preStates": function (val) {
        if (val != '1') {
          clearInterval(this.timer)
        }
      },
      'borderCard': function (val) {
        this.fuzhi=false
        this.queryModel.robotLabelId = '';
        this.queryModel.humanLabelId = '';
        if (val == '0') {
          this.DPage = 1;
          this.queryModel.cp = this.DPage;
          if (this.labelModel.labelTypeIds == '') {
            this.queryModel.humanLabelStatus = '';
            this.queryModel.superiorHumanLabelStatus = 0;
          } else {
            this.queryModel.humanLabelStatus = 0;
            this.queryModel.superiorHumanLabelStatus = '';
          }
          this.queryModel.orderBy = 'updateAt';
          if(this.labelModel.labelTypeIds!=''){
            this.queryModel.orderBy = 'confidences';
            this.queryModel.direction = 'ASC';
          }
          // this.getcurrentcurpos();
          if(this.PrestateSuccess){
            this.getList()
          }
        } else if (val == '1') {
          this.DPage = 1;
          this.queryModel.cp = this.DPage;
          if (this.labelModel.labelTypeIds == '') {
            this.queryModel.humanLabelStatus = '';
            this.queryModel.superiorHumanLabelStatus = 1;
          } else {
            this.queryModel.humanLabelStatus = 1;
          }

          this.queryModel.orderBy = 'updateAt';
          this.queryModel.direction = 'DESC';
          // this.getcurrentcurpos();
          if(this.PrestateSuccess){
            this.getList()
          }
        }
      },

    },
    created: function () {
      this.taskInfo = JSON.parse(sessionStorage.getItem("taskInfo"));
      this.queryModel.taskId = this.taskInfo.taskId;
      this.getAllLabelArr();
      this.getLabelTypeArr();
      this.$root.$on('getResponse',(_this) => {

        let that=this;
        if(_this){
          let str=_this.parentNode.parentNode;
          let arrStr= $(str).attr('data-index');
          let numIndex=_this.parentNode.textContent.indexOf("：")+1;
          let textStr=_this.parentNode.textContent.substr(numIndex);
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
    },
    destroyed: function () {
      clearInterval(this.timer)
    },
    filters: {
      preStatesFilter: function (val) {
        if (val == '1') {
          return '预测正在进行'
        }
        if (val == '0') {
          return '预测未开始'
        }
        if (val == '2') {
          return '成功'
        }
        if (val == '-1') {
          return '预测失败'
        }
      }
    },
  }
</script>
<style>
  .pl100 {
    padding-left: 20px
  }

  .el-progress-bar__outer {
    background: #D9D9D9;
  }

  .el-tabs--border-card {
    box-shadow: none !important;
  }
</style>
<style scoped>
  .textWrap {
    width: 100%;

    border-bottom: 1px solid rgb(204, 204, 204);
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
