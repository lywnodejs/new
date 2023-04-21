<template>
    <!--新建和编辑问题对-->
  <el-container>
    <!--面包屑-->
    <el-header style="background-color: #fff; padding: 0px;height: 45px">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/skillhome', query: {
            skillData:JSON.stringify(skillData),
            robotName:robotName
            }}">我的技能</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/knowledgemanagement', query: {
            skillData:JSON.stringify(skillData),
            robotName:robotName,
            index:'knowledgemanagement'
            }}">知识类别管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/qamanagent', query: {
            skillData:JSON.stringify(skillData),
            robotName:robotName,
            knowledgeData:JSON.stringify(knowledgeData),
            index:'qamanagent'}}">{{categoryTitle}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{addOrEditTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-card class="box-card" shadow="never" ref="contentView" >
      <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent label-width="100px" class="demo-form">
        <el-row style="margin-bottom: 20px">
          <span class="title">问题模板</span>
        </el-row>
        <el-form-item  label="标准问题"   prop="standardQuestion">
          <el-input class="problemClass" v-model="form.standardQuestion" type="textarea" placeholder="请输入问题"></el-input>
        </el-form-item>
        <el-form-item  label="相似问题">
          <div class="guideQuestion" v-for="(item,index) in similarityQuestion" :key = "index">
            <el-input v-model="similarityQuestion[index]" placeholder="请输入问题"   @keyup.enter.native="addGuideQuestion" style="width: 500px">
              <div slot="append" @click="deleGuideQuestion(index)">删除</div>
            </el-input>
          </div>
          <i class="el-icon-circle-plus-outline" @click="addGuideQuestion">
            <span style="">&nbsp&nbsp添加相似问题</span>
          </i>
        </el-form-item>
        <el-row style="margin-bottom: 20px">
          <span class="title">答案模板</span>
        </el-row>
        <el-form-item class="answeItem" label="答案" prop="answer">
          <el-input
            class="answerClass"
            :rows="4"
            type="textarea"
            placeholder="请输入答案,最多5000个字"
            maxlength="5000"
            show-word-limit
            v-model="form.answer"
          ></el-input>
        </el-form-item>
        <el-form-item class="answeItem" label="虚拟人答案" >
          <el-row type="flex">
            <el-checkbox style="margin-top: 12px" v-model="textChecked"></el-checkbox>
            <el-button v-if="textChecked" type="text" style="margin-left: 20px" @click="isActionConfig = true">插入动作</el-button>
            <span v-if="!textChecked" class="virtualHumanSpan" >(配置虚拟人可选择此项)</span>
            <span v-if="textChecked" class="virtualHumanSpan" >(可在对应的文本位置加入动作)</span>
          </el-row>

          <el-input
            id="virtualHumanInput"
            class="virtualHumanAnswerClass"
            :rows="4"
            type="textarea"
            placeholder="请输入虚拟人答案,最多5000个字"
            maxlength="5000"
            show-word-limit
            v-if="textChecked"
            v-model="form.virtualHumanAnswer"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="success" size="small" style="margin-top:30px;margin-left: 80px" @click="onSubmit('form')">确定</el-button>
    </el-card>

    <el-dialog
      width="30%"
      :visible.sync="isActionConfig"
      custom-class="actionConfigClass"
      >
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
  </el-container>
</template>

<script>
  import {stringForArray,arrayForString,arrayAddIndex} from '../../utils/commonUtil';
  import {robotConfigService} from '../../service/index';

  export default {
      name: "addqapair",
      data(){
        return{
          disabled: false,
          categoryTitle:'',//知识类别的名称
          addOrEditTitle:'',
          robotName:'',
          skillData:{},
          screenHeight:'',
          qaObject:{},//问答对对象
          knowledgeData:{},//知识类别对象
          similarityQuestion:[''],//用于控制相似问题
          form:{
            standardQuestion:'',//标准问题
            similarityQuestion:[''],//相似问题
            answer:'',//答案
            virtualHumanAnswer:'',//虚拟人配置
            id:'',//答案对Id
            preview:'test'
          },
          rules: {
            standardQuestion: [
              {required: true, message: '请输入问题', trigger: 'blur'}
            ],
            answer: [{required: true, message: '请输入答案', trigger: 'blur'}],
          },
          textChecked:false,
          isActionConfig:false,
          virtualHumanActions:[],//选中的虚拟人动作
          virtualHumanActionList:['站立','点头','左手指','右招手'],//动作列表

        }
      },
      methods:{
        /****************接口相关的方法***********************/
        //新建和编辑问题对
        async addAndEditQaRequest(params){
          let result = await robotConfigService.addAndEditQaKnowledge([params]);
          if (result.message.code == 0) {
            let target = this;
            let message = '新建成功'
            if(target.addOrEditTitle==="编辑问题对"){
              message='编辑成功'
            }
            setTimeout(function () {
              //回到问答对列表
              target.gotoPage()
            },1250);
            this.$message({
              showClose: true,
              message: message,
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
        //在编辑状态下删除相似问题(真删除,不必点击确定,新加改方法用于post提交,因为此次删除后不需要跳转到列表页)
        async editToDeleteSimilarityQuestion(params){
          let result = await robotConfigService.addAndEditQaKnowledge([params]);
          if (result.message.code == 0) {
            setTimeout(function () {
              // target.gotoPage()
            },1250);
            this.$message({
              showClose: true,
              message: '删除成功',
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
        /****************交互相关的方法***********************/
        //点击确定
        onSubmit(formName){
          //去掉相似问题数组中的空问题

          for(let i =0; i<this.similarityQuestion.length;i++){
            if (this.similarityQuestion[i].trim().length===0){
              this.similarityQuestion.splice(i,1)
            }
          }
          this.$refs[formName].validate((valid) => {
            if (valid) {
              var params = {};
              params.standardQuestion = this.form.standardQuestion
              params.similarityQuestion =stringForArray(this.similarityQuestion,'\n')
              params.answer = this.form.answer
              params.virtualHumanAnswer = this.form.virtualHumanAnswer
              params.preview = this.form.preview
              params.qaKnowledgeType = this.knowledgeData
              params.skillConfInfo = this.skillData
              params.task = this.skillData.task
              let standarQuestion = this.form.standardQuestion.trim()
              let answer = this.form.answer.trim()
              if(standarQuestion.length===0){
                this.$message({
                  showClose: true,
                  message:'标准问题不能为空',
                  type: 'warning'
                });
                return
              }
              if(answer.length===0){
                this.$message({
                  showClose: true,
                  message:'答案不能为空',
                  type: 'warning'
                });
                return
              }
              if(this.addOrEditTitle ==='新建问题对'){
                this.addAndEditQaRequest(params);
              }else if(this.addOrEditTitle ==='编辑问题对'){
                params.id = this.form.id
                this.addAndEditQaRequest(params);
              }
            } else {
              return false;
            }
          });
        },
        //增加引导问题输入框
        addGuideQuestion(){
          this.similarityQuestion.push('')
        },
        //删除引导问题输入框
        deleGuideQuestion(index){
          var text = '确定删除该条相似问题吗!'
          this.$confirm(text, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //点击确定
            this.similarityQuestion.splice(index,1)

            if(this.addOrEditTitle==="编辑问题对"){
              var params = {};
              params.standardQuestion = this.form.standardQuestion
              params.similarityQuestion =stringForArray(this.similarityQuestion,'\n')
              params.answer = this.form.answer
              params.virtualHumanAnswer = this.form.virtualHumanAnswer
              params.preview = this.form.preview
              params.qaKnowledgeType = this.knowledgeData
              params.skillConfInfo = this.skillData
              params.task = this.skillData.task
              params.id = this.form.id
              this.editToDeleteSimilarityQuestion(params);
            }
          }).catch(() => {
            //点击取消
          });
        },
        //新建和编辑成功后都要回到问题对列表
        gotoPage(){
          this.$router.push({
            path: '/qamanagent?index=qamanagent',
            query: {
              knowledgeData:JSON.stringify(this.knowledgeData),//类别数据对象
              robotName:this.robotName,
              skillData:JSON.stringify(this.skillData)//技能对象
            }
          });
        },
        //确认动作
        validationAction(){
          debugger
          this.isActionConfig = false;
          //拼接虚拟人答案
          let actionStr = ''
          if(this.virtualHumanActions.length>0){
            for(let index in this.virtualHumanActions){
              //动作要用<action>动作</action> 拼接
              let leftTag = '<action>'
              let rightTag = '</action>'
              let actionItem = leftTag + this.virtualHumanActions[index] + rightTag
              actionStr =  actionStr +  actionItem
            }
          }

          this.form.virtualHumanAnswer = this.insertInputTxt('virtualHumanInput',actionStr)
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
      },//methods

      created(){

        if(this.$route.query.skillData) {
          this.skillData = JSON.parse(this.$route.query.skillData)
          this.robotName = this.$route.query.robotName
        }
        if (this.$route.query.knowledgeData){
          this.knowledgeData = JSON.parse(this.$route.query.knowledgeData)
          this.categoryTitle = this.knowledgeData.knowledgeType
        }
        if(this.$route.query.qaObject) {
          this.addOrEditTitle = '编辑问题对'
          this.qaObject = JSON.parse(this.$route.query.qaObject)
          this.form.standardQuestion = this.qaObject.standardQuestion
          this.similarityQuestion = arrayForString(this.qaObject.similarityQuestion,'\n')
          this.form.answer = this.qaObject.answer
          this.form.virtualHumanAnswer =  this.qaObject.virtualHumanAnswer
          if(this.form.virtualHumanAnswer.length){
             this.textChecked = true
          }
          this.form.id = this.qaObject.id
        }else {
          this.addOrEditTitle = '新建问题对'
        }
      },
      mounted(){
        // this.$refs['contentView'].$el.style.height = (window.innerHeight-60-40-20-30)+'px'
        const that = this
        window.onresize =()  =>{
          return (()=>{
            window.screenHeight = window.innerHeight
            that.screenHeight = window.screenHeight;
          })()
        }
      },
      //监听屏幕的变化去改变控件的高度
      watch:{
        screenHeight(val){
          this.screenHeight = val
          // this.$refs['contentView'].$el.style.height = (this.screenHeight-60-40-20-30)+'px'
        }
      },

    }
</script>
<style>
  .el-input-number--mini {
    width: 100px !important;
    line-height: 26px !important;
  }
</style>

<style scoped>
  .breadcrumb{
    background-color: #fff;
    height: 45px;
    padding-left: 20px;
    line-height: 45px;
    text-align: center;
  }
  .box-card{
    background-color: white;
    margin: 20px 20px 103px 20px;
  }
  .title{
    color: #333333;
    font-weight: bold;
  }
  .title::before{
    content: '';
    display: inline-block;
    width: 5px;
    height: 15px;
    margin-right: 6px;
    background-color:#45B854;
    vertical-align: -3px;

  }
  .problemClass{
    width: 500px;

  }
  .answerClass{
    width: 500px;
  }
  .virtualHumanAnswerClass{
    width: 500px;
    margin-top: 5px;

  }
  .guideQuestion{
    margin-bottom: 10px;

  }
  .answeItem >>> .el-form-item__content {
    line-height: 10px;
    position: relative;
    font-size: 14px;
  }
  .virtualHumanSpan{
    font-size: 12px;
    color:darkgrey;
    margin-left: 10px;
    display: block;
    height: 40px;
    line-height: 40px;
  }

</style>
