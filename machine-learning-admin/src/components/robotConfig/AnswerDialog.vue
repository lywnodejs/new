<template>
  <!--新建答案和编辑答案弹窗-->
  <el-dialog  :visible.sync="dialogFormVisible" @close="close()"  custom-class="dialogClass"  >
    <div slot="title">{{formTitle}}</div>
    <el-form :model="form" :rules="rules" ref="form" label-width="110px" >
      <el-form-item label="答案类型:" prop="radio"  >
        <el-select v-model="form.radio" placeholder="请选择答案类型" @change="changeAnswerType">
          <el-option
            v-for="item in answerTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="this.form.radio!==1" label="答案名称:"   prop="answerName">
        <el-input v-model="form.answerName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item v-else label="答案名称:"   prop="templateAnswerName.reportName">
        <el-select  style="margin-right: 10px" v-model="form.templateAnswerName" value-key="id" filterable  placeholder="选择答案名称">
          <el-option
            v-for="item in templateAnswers"
            :key="item.id"
            :label="item.reportName"
            :value="item">
          </el-option>
        </el-select>
        <template v-if="form.templateAnswerName.reportName">
          <el-button type="text" @click="answerPreView(form.templateAnswerName)">答案预览</el-button>
          <el-button type="text" @click="toTemplatePlatform">配置新答案</el-button>
        </template>

      </el-form-item>
      <el-form-item label="无数据时话术" label-width="110px"  prop="unusualMsg">
        <el-input  type="textarea" v-model="form.unusualMsg" placeholder="请输入话术"></el-input>
      </el-form-item>
      <!--答案配置中心特有-->
      <template v-if="this.form.radio===1">
        <!--答案参数-->
        <el-form-item class="answerInfo" label="答案参数:">
          <answerParamsConfig :answerParameList="templateAnswerParameList"></answerParamsConfig>
        </el-form-item>
        <el-form-item  label="引导语">
          <el-input v-model="templateAnswer.guideLanguage" placeholder="请输入引导语"></el-input>
        </el-form-item>
      </template>
      <!--第三方跳转特有-->
      <template v-if="this.form.radio===4">
        <el-form-item label="跳转类型:" label-width="110px" required >
          <el-radio-group v-model="threePartyJump.jumpType" size="mini">
            <el-radio-button label="原生页面"></el-radio-button>
            <el-radio-button label="H5页面"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item  label="答案地址:">
          <el-input v-model="threePartyJump.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item  label="功能页面:">
          <el-input v-model="threePartyJump.functionPage" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item  class="loginclass" label="是否登录:">
          <el-checkbox v-model="threePartyJump.islogin">登录</el-checkbox>
        </el-form-item>
        <el-form-item  label="跳转协议:">
          <el-input v-model="threePartyJump.jumpProtocol" placeholder="请输入协议"></el-input>
        </el-form-item>
        <!--答案参数-->
        <el-form-item class="answerInfo" label="答案参数:">
          <answerParamsConfig  :answerParameList="threeJumpAnswerParameList"></answerParamsConfig>
        </el-form-item>
        <el-form-item  label="引导语:">
          <el-input v-model="threePartyJump.guideLanguage" placeholder="请输入引导语"></el-input>
        </el-form-item>
      </template>
      <!--文本答案特有-->
      <template v-if="this.form.radio===2">
        <el-form-item  label="答案内容:">
          <el-input type="textarea" v-model="textAnswer.textContent" placeholder="请输入答案"></el-input>
        </el-form-item>
        <el-form-item class="answeItem" label="虚拟人答案" >
          <el-checkbox v-model="textChecked"></el-checkbox>
          <el-button v-if="textChecked" type="text" style="margin-left: 20px" @click="isActionConfig = true">插入动作</el-button>
          <span v-if="!textChecked" style="font-size: 10px;color:darkgrey;margin-left: 10px">(配置虚拟人可选择此项)</span>
          <span v-if="textChecked" style="font-size: 10px;color:darkgrey">(可在对应的文本位置加入动作)</span>
          <el-input
            id='textInput'
            v-if="textChecked"
            :rows="4"
            type="textarea"
            placeholder="请输入虚拟人答案"
            maxlength="5000"
            show-word-limit
            v-model="textAnswer.virtualHumanContent"
          ></el-input>
        </el-form-item>
        <el-form-item  label="引导语:">
          <el-input v-model="textAnswer.guideLanguage" placeholder="请输入引导语"></el-input>
        </el-form-item>
      </template>
      <!--基础知识特有-->
      <el-form-item v-if="this.form.radio===3" label-width="120px" class="threshold" label="答案阈值设置:" required>
        <el-tooltip placement="top">
          <div slot="content">问答阈值设置说明---相似度原理<br/>1.一看相似,二看该词在文档里出现频次,<br/>&nbsp&nbsp&nbsp&nbsp如果频次很高就得分低,频次低得分高<br/>2.共有字符算法:问的问题和匹配语料的共有字符.</div>
          <span class="tipsDiv">?</span>
        </el-tooltip>
        <el-row>
          <el-input-number class="inputNum2" v-model="sliderValueRight" size="mini" @change="handleChange2" :min="0" :max="100"></el-input-number>
          <!--此处的滑块用的是Ant Design Vue中的控件因为element无法满足 后来发现用计算属性可以控制故去掉了ant design组件库-->
          <!--<a-slider class="slider" v-model="sliderValue" range :step="1" :autoFocus="true" :defaultValue="[20, 50]" @change="onChange"/>-->
          <el-slider
            v-model="sliderValue"
            @input="onChange"
            range
            :show-tooltip="false"
            :max="100">
          </el-slider>
          <div style="line-height: 8px">
            <span style="color:#707070;font-size: 8px">0</span>
            <span style="display: inline-block;float: right;color:#707070;font-size: 8px">100</span>
          </div>
          <el-row>
            <el-input-number class="inputNum1" v-model="sliderValueleft" size="mini" @change="handleChange1" :min="0" :max="100"></el-input-number>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-radio-group v-model="matchingradio" size="mini" @change="matchingChange">
              <el-radio-button label="低匹配率"></el-radio-button>
              <el-radio-button label="中匹配率"></el-radio-button>
              <el-radio-button label="高匹配率"></el-radio-button>
            </el-radio-group>
          </el-row>
          <el-row>
            <div style="line-height: 15px;font-size: 12px;color: #707070">{{thresholdMsg}}</div>
          </el-row>
          <el-row style="margin-top: 20px">
            <span>引导语:</span>
            <el-input style="width: 370px;height: 20px" v-if="matchingradio==='低匹配率'"  v-model="lowMatchingRate.guidanceMsg" placeholder="请输入引导语"></el-input>
            <el-input style="width: 370px" v-if="matchingradio==='中匹配率'"  v-model="mediumMatchingRate.guidanceMsg" placeholder="请输入引导语"></el-input>
            <el-input style="width: 370px" v-if="matchingradio==='高匹配率'"  v-model="highMatchingRate.guidanceMsg" placeholder="请输入引导语"></el-input>
          </el-row>
          <el-row style="margin-top: 20px">
            <span>推荐问题数量:</span>
            <el-select class="recommendSelect" style="width: 70px" v-if="matchingradio==='低匹配率'" v-model="lowMatchingRate.recommendationNum">
              <el-option
                v-for="item in recommendOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-select class="recommendSelect" style="width: 70px" v-if="matchingradio==='中匹配率'" v-model="mediumMatchingRate.recommendationNum">
              <el-option
                v-for="item in recommendOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-select class="recommendSelect" style="width: 70px" v-if="matchingradio==='高匹配率'" v-model="highMatchingRate.recommendationNum">
              <el-option
                v-for="item in recommendOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-row>
          <el-row style="margin-top: 20px">
            <span v-if="matchingradio==='中匹配率'||matchingradio==='低匹配率'">虚拟人配置:</span>
            <template v-if="matchingradio==='低匹配率'">
              <el-checkbox v-model="lowChecked"></el-checkbox>
              <el-button v-if="lowChecked" type="text" style="margin-left: 20px" @click="isActionConfig = true">插入动作</el-button>
              <span v-if="!lowChecked" style="font-size: 10px;color:darkgrey;margin-left: 10px">(配置虚拟人可选择此项)</span>
              <span v-if="lowChecked" style="font-size: 10px;color:darkgrey">(可在对应的文本位置加入动作)</span>
              <el-input
                id='lowInput'
                class="answerClass"
                :rows="4"
                type="textarea"
                placeholder="请输入虚拟人答案,最多5000个字"
                maxlength="5000"
                show-word-limit
                v-if="lowChecked"
                v-model="lowMatchingRate.virtualHuman"
              ></el-input>
            </template>

            <template v-if="matchingradio==='中匹配率'">
              <el-checkbox v-model="mediumChecked"></el-checkbox>
              <el-button v-if="mediumChecked" type="text" style="margin-left: 20px" @click="isActionConfig = true">插入动作</el-button>
              <span v-if="!mediumChecked" style="font-size: 10px;color:darkgrey;margin-left: 10px">(配置虚拟人可选择此项)</span>
              <span v-if="mediumChecked" style="font-size: 10px;color:darkgrey">(可在对应的文本位置加入动作)</span>
              <el-input
                id='mediumInput'
                class="answerClass"
                :rows="4"
                type="textarea"
                placeholder="请输入虚拟人答案,最多5000个字"
                maxlength="5000"
                show-word-limit
                v-if="mediumChecked"
                v-model="mediumMatchingRate.virtualHuman"
              ></el-input>
            </template>
          </el-row>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
              <el-button @click="close">取 消</el-button>
              <el-button type="primary" @click="onSubmit('form')">确定</el-button>
    </span>
    <el-dialog
      width="30%"
      :visible.sync="isActionConfig"
      custom-class="actionConfigClass"
      append-to-body>
      <div slot="title">虚拟人动作</div>
      <el-form>
        <el-form-item  label="添加动作:" label-width="20">
          <el-select clearable multiple v-model="virtualHumanActions" placeholder="请选择动作">
            <el-option
              v-for="action in virtualHumanActionList"
              :key="action"
              :label="action"
              :value="action">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
              <el-button @click="isActionConfig = false">取 消</el-button>
              <el-button type="primary" @click="validationAction">确定</el-button>
        </span>

    </el-dialog>
  </el-dialog>

</template>

<script>
  import {robotConfigService} from '../../service/index';
  import {SetCookie,getJoinCookie,getCurrentTemplateAnswerHost,getTemplatePlatformHost} from '../../utils/commonUtil';
  import answerParamsConfig from './AnswerParamsConfig';
    export default {
       name: "AnswerDialog",
       props: ['dialogVisible','formTitle'],
       components: {
        answerParamsConfig
       },
       computed:{
         dialogFormVisible:{
           get: function () {
             return this.dialogVisible
           },
           // setter
           set: function () {
           }
         },
         //element双滑块采用计算属性实现了外面值改变滑块位置
         sliderValue:{
           get:function () {
             let array = [];
             array.splice(0,1,this.sliderValueleft)
             array.splice(1,1,this.sliderValueRight)
             return array
           },

           set:function () {
           }
         },
       },
       data(){
         return{
           templateAnswers:[],//模板答案
           templateAnswerParameList:[],//模板答案参数配置列表
           threeJumpAnswerParameList:[],//第三方配置参数配置列表
           form:{
             radio:'',//类型选择
             answerName:'',//名称
             unusualMsg:'',//无答案话术
             otherAnswerName:'',
             id:'',
             answerContentJson:{},
             templateAnswerName:{},//模板答案对象
           },
           answerTypes:[{
             value: 0,
             label: '原有小e答案'
           }, {
             value: 1,
             label: '答案配置中心'
           }, {
             value: 2,
             label: '文本答案'
           }, {
             value: 3,
             label: '基础知识'
           }, {
             value: 4,
             label: '页面跳转'
           }],
           templateListModel:{
             userName:getJoinCookie('userId'),
             published:'1',//已发布的报告模板
             ps:1000,
           },
           //模板答案私有特有
           templateAnswer:{
             guideLanguage:'',
           },
           //文本答案特有
           textAnswer:{
             textContent:'',
             guideLanguage:'',
             virtualHumanContent:'',//虚拟人配置
           },
           //第三方跳转配置
           threePartyJump:{
             jumpType:'原生页面',
             address:'',//答案地址
             guideLanguage:'',
             functionPage:'',//功能页面
             jumpProtocol:'',//跳转协议
             islogin:false,//是否登录
           },
           sliderValueleft:20,
           sliderValueRight:50,
           oldsliderValue:[20,50],
           matchingradio:'低匹配率',
           recommendValue:1,
           recommendOptions:[1,2,3,4,5],
           thresholdMsg:'最高相似度在0-20',
           lowMatchingRate:{//低匹配率对象
             threshold:'',//阈值
             guidanceMsg:'',
             recommendationNum:1,//推荐问题数量
             virtualHuman:'' //虚拟人配置

           },
           mediumMatchingRate:{//中匹配率
             threshold:'',//阈值
             guidanceMsg:'',
             recommendationNum:1,//推荐问题数量
             virtualHuman:'' //虚拟人配置

           },
           highMatchingRate:{//高匹配率
             threshold:'',//阈值
             guidanceMsg:'',
             recommendationNum:1,//推荐问题数量
             virtualHuman:'' //虚拟人配置

           },
           rules: {
             'templateAnswerName.reportName':[
               {required: true, message: '请选择答案名称', trigger: 'change'}
             ],
             answerName: [
               {required: true, message: '请输入名称', trigger: 'change'}
             ],
             unusualMsg: [
               {required: true, message: '请输入话术', trigger: 'change'}
             ],
             radio:[{required: true, message: '请选择答案类型', trigger: 'change'}
             ],
           },
           textChecked:false,
           lowChecked:false,
           mediumChecked:false,
           isActionConfig:false,
           virtualHumanActions:[],//选中的虚拟人动作
           virtualHumanActionList:['站立','点头','左手指','右招手'],//动作列表

         }
       },
       methods:{
         /***********************接口请求相关方法**************************************/
         //请求模板答案列表
         async requestTemplateList(){
           let result  = await robotConfigService.getTemplateAnswerList(this.templateListModel);
           if (result.message.code ==0){
             this.templateAnswers = result.data.list;
           }

         },
         //新增答案提交请求
         async addAnswerRequest(params){
           let result = await robotConfigService.addAnswer([params]);
           if (result.message.code == 0) {
             this.close()
             let target = this;
             setTimeout(function () {
               target.$emit('addNewAnswerSuccess')
             },1250);
             this.$message({
               showClose: true,
               message: '创建成功',
               type: 'success'
             });
           }else {
             this.$message({
               showClose: true,
               message: result.message.message,
               type: 'error'
             });
           }
         },
         /************************交互相关的方法***********************************************/
         //模板答案预览
         answerPreView(templateData){
           let newPageUrl = getCurrentTemplateAnswerHost();
           let newPage = newPageUrl+'/report/template?id='+templateData.id
           window.open(newPage, '_blank');
         },
         //跳转到模板配置平台
         toTemplatePlatform(){
           let newPageUrl =  getTemplatePlatformHost();
           window.open(newPageUrl, '_blank');
         },
         //确认动作
         validationAction(){
           this.isActionConfig = false;
           //拼接虚拟人答案
           let actionStr = ''
           if(this.virtualHumanActions.length>0){
             for(let index in this.virtualHumanActions){
               //动作要用<action>动作</action> 拼接
               // let leftTag = '&lt;'+'action'+ '&gt;'
               // let rightTag = '&lt;/'+'action'+ '&gt;'
               let leftTag = '<action>'
               let rightTag = '</action>'
               let actionItem = leftTag + this.virtualHumanActions[index] + rightTag
               actionStr =  actionStr +  actionItem
             }
           }

           if(this.form.radio===2){
             //文本答案类型
             this.textAnswer.virtualHumanContent = this.insertInputTxt('textInput',actionStr)

           }else if(this.form.radio===3&&this.matchingradio==='低匹配率'){
             //基础答案类型
             this.lowMatchingRate.virtualHuman = this.insertInputTxt('lowInput',actionStr)

           }else if(this.form.radio===3&&this.matchingradio==='中匹配率'){
             this.mediumMatchingRate.virtualHuman = this.insertInputTxt('mediumInput',actionStr)

           }
           this.virtualHumanActions = []

         },


         insertInputTxt(id, actionStr){
           var elInput = document.getElementById(id);
           var startPos = elInput.selectionStart;
           var endPos = elInput.selectionEnd;
           if (startPos === undefined || endPos === undefined) return
           var txt = elInput.value;
           var result = txt.substring(0, startPos) + actionStr + txt.substring(endPos)
           elInput.value = result;
           elInput.focus();
           elInput.selectionStart = startPos + actionStr.length;
           elInput.selectionEnd = startPos + actionStr.length;
           return result;
         },

         //点击新建和编辑答案提交后台方法
         onSubmit(formName) {
           let aray =  this.templateAnswerParameList
           this.$refs[formName].validate((valid) => {
             if (valid) {
               var params = {};
               params.answerName = this.form.answerName
               params.answerType = this.form.radio
               params.noAnswerLanguage = this.form.unusualMsg
               params.userId = getJoinCookie('userId');
               if (this.form.radio ===3){
                 //基础知识
                 this.form.answerContentJson.mixScore = this.sliderValueleft
                 this.form.answerContentJson.maxScore = this.sliderValueRight
                 this.form.answerContentJson.highRecommendNum = this.highMatchingRate.recommendationNum
                 this.form.answerContentJson.highGuideLanguage = this.highMatchingRate.guidanceMsg
                 this.form.answerContentJson.virtualHumanHighContent = ''//没有高匹配的虚拟人设置
                 this.form.answerContentJson.middleRecommendNum = this.mediumMatchingRate.recommendationNum
                 this.form.answerContentJson.middleGuideLanguage = this.mediumMatchingRate.guidanceMsg
                 this.form.answerContentJson.virtualHumanMiddleContent =this.mediumMatchingRate.virtualHuman
                 this.form.answerContentJson.lowRecommendNum = this.lowMatchingRate.recommendationNum
                 this.form.answerContentJson.lowGuideLanguage = this.lowMatchingRate.guidanceMsg
                 this.form.answerContentJson.virtualHumanLowContent = this.lowMatchingRate.virtualHuman
                 let waringstr =''
                 if (this.highMatchingRate.guidanceMsg.length===0){
                   waringstr ='请配置高匹配率引导语'
                 }else if (this.mediumMatchingRate.guidanceMsg.length===0){
                   waringstr ='请配置中匹配率引导语'
                 } else if(this.lowMatchingRate.guidanceMsg.length===0){
                   waringstr ='请配置低匹配率引导语'
                 }
                 if (waringstr.length>0) {
                   this.$message({
                     showClose: true,
                     message:waringstr,
                     type: 'error'
                   });
                   return;
                 }
               }else if(this.form.radio===2){
                 //文本答案
                 this.form.answerContentJson.textContent =  this.textAnswer.textContent
                 this.form.answerContentJson.guideLanguage = this.textAnswer.guideLanguage
                 this.form.answerContentJson.virtualHumanContent =this.textAnswer.virtualHumanContent
               }else if(this.form.radio===1) {
                 //模板配置平台
                 params.answerName = this.form.templateAnswerName.reportName
                 this.form.answerContentJson.reportConfig = this.form.templateAnswerName
                 this.form.answerContentJson.guideLanguage = this.templateAnswer.guideLanguage
                 let templateParameObj = {}
                 for (let index in this.templateAnswerParameList ) {
                   let keys= this.templateAnswerParameList[index].name
                   templateParameObj[keys]= this.templateAnswerParameList[index].value
                 }
                 this.form.answerContentJson.reportParams = templateParameObj
               }else  if(this.form.radio===4){
                 //第三方跳转
                 this.form.answerContentJson.linkType = this.threePartyJump.jumpType
                 this.form.answerContentJson.url = this.threePartyJump.address
                 this.form.answerContentJson.linkProtocol = this.threePartyJump.jumpProtocol
                 this.form.answerContentJson.functionPageName = this.threePartyJump.functionPage
                 this.form.answerContentJson.needLogin = this.threePartyJump.islogin?'yes':'no'
                 this.form.answerContentJson.guideLanguage = this.threePartyJump.guideLanguage

                 let threePartyJumpObj = {}
                 for (let index in this.threeJumpAnswerParameList ) {
                   let keys= this.threeJumpAnswerParameList[index].name
                   threePartyJumpObj[keys]= this.threeJumpAnswerParameList[index].value
                 }
                 this.form.answerContentJson.linkParams = threePartyJumpObj
               }else {
                 this.form.answerContentJson = {}

               }
               params.answerContentJson = JSON.stringify(this.form.answerContentJson)
               if(this.formTitle ==='新建答案'){
                 this.addAnswerRequest(params);
               }

             } else {
               return false;
             }
           });
         },
         //选择答案类型的回调
         changeAnswerType(type){
           if (this.form.answerContentJson){
             this.form.answerContentJson= {}
           }
         },
         //滑块滑动回调
         onChange(value){
           //取出之前数组的值
           let oldone = this.oldsliderValue[0]
           let oldtwo = this.oldsliderValue[1]
           let newone = value[0]
           let newtwo = value[1]
           let isleft = true
           let isright = true
           if(oldone ===newone){
             isleft = false
           }else  if(oldtwo == newtwo){
             isright = false
           }
           this.oldsliderValue = value
           this.sliderValueleft = newone;
           this.sliderValueRight = newtwo;

           this.getThresholdMsg(this.matchingradio);
           if(isleft){
             let moveLeft = value[0].toString() + '%'
             $(".inputNum1").css("left",moveLeft)
           }else if(isright&&value[1]<80){
             let moveRight = value[1].toString() + '%'
             $(".inputNum2").css("left",moveRight)
           }
         },
         //数值设定回调
         handleChange1(value){
           let moveLeft = value.toString() + '%'
           $(".inputNum1").css("left",moveLeft)

           // this.sliderValue.splice(0,1,parseInt(value));
           this.getThresholdMsg(this.matchingradio);
         },
         handleChange2(value){
           if(value<80){
             let moveRight = value.toString() + '%'
             $(".inputNum2").css("left",moveRight)
           }
           // this.sliderValue.splice(1,1,parseInt(value));
           this.getThresholdMsg(this.matchingradio);
         },
         //低中高匹配切换
         matchingChange(label){
           this.getThresholdMsg(label)
         },
         getThresholdMsg(label){
           let matchingValue=''
           if(label === '低匹配率'){
             matchingValue = 0+'-'+this.sliderValueleft
             this.thresholdMsg = '最高相似度在'+matchingValue
           } else if(label === '中匹配率'){
             matchingValue = this.sliderValueleft+'-'+this.sliderValueRight
             this.thresholdMsg = '最高相似度在'+matchingValue+'返回多个相似问题'
           }else if(label === '高匹配率'){
             matchingValue = this.sliderValueRight+'-'+100
             this.thresholdMsg = '最高相似度在'+matchingValue+'返回最相似问题的对应答案'
           }
         },
         //关闭
         close() {
           this.$emit('closeDialog')
           this.$refs['form'].resetFields()
           this.form.answerName=''//名称
           this.form.guidanceMsg=''//引导语
           this.form.unusualMsg=''//无答案话术
           this.form. otherAnswerName=''
           this.sliderValueRight=50
           this.sliderValueleft = 20
           this.lowMatchingRate.guidanceMsg=''
           this.mediumMatchingRate.guidanceMsg=''
           this.highMatchingRate.guidanceMsg=''
           this.lowMatchingRate.recommendationNum=1
           this.mediumMatchingRate.recommendationNum=1
           this.highMatchingRate.recommendationNum=1
           this.matchingradio='低匹配率'
           this.textAnswer.textContent = ''
           this.textAnswer.guideLanguage = ''
           this.templateAnswerParameList=[]//模板答案参数配置列表
           this.threeJumpAnswerParameList=[]
           this.templateAnswer.guideLanguage=''
           this.threePartyJump.jumpType = '原生页面'
           this.threePartyJump.address  = ''
           this.threePartyJump.jumpProtocol = ''
           this.threePartyJump.functionPage = ''
           this.threePartyJump.islogin = false
           this.threePartyJump.guideLanguage =''
           this.form.templateAnswerName = {}
           this.form.answerContentJson = {}
           this.form.radio = ''
           this.textChecked = false
           this.mediumChecked = false
           this.lowChecked = false
           this.textAnswer.virtualHumanContent = ''
           this.lowMatchingRate.virtualHuman = ''
           this.mediumMatchingRate.virtualHuman = ''

         }

       },
    }
</script>

<style scoped>
  .elButtonEdit,
  .elButtonDele
  {
    padding: 4px 8px;

  }
  .elButtonDele{
    background-color: red;
    border: none;
  }
  .inputNum1{
    position: relative;
    left:20%;
    top: -5px;
  }
  .inputNum2{
    position: absolute;
    left:50%;
    top: -35px;
  }
  .slider{
    margin: 0px 0px 0px 0px;
  }
  .tipsDiv{
    padding: 0px 5px;
    border-radius: 10px;
    font-size: 9px;
    border: #707070 1px solid;
    margin-left: -7px;
  }
  .recommendSelect >>>.el-input__inner {
    height: 30px;
  }
  .answerInfo >>> .el-table td, .el-table th{
    padding: 0px;
  }
  .answerInfo  >>> .el-input__inner{
    border:none;
  }
  .loginclass >>> .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #409EFF !important;
    border-color: #409EFF !important;
  }

</style>
