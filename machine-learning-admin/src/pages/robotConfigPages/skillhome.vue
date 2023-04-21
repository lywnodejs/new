<template>
    <!--技能首页  技能页面暂时把复制的功能去掉了-->
  <el-container>
    <el-header style="padding: 0px">
      <robotHeader></robotHeader>
    </el-header>
    <el-main v-loading="loading">
      <!--面包屑-->
      <el-breadcrumb separator="/" class="breadcrumb">
        <!--<el-breadcrumb-item :to="{ path: '/myrobot' }">我的机器人</el-breadcrumb-item>-->
        <el-breadcrumb-item :to="{ path: '/myrobot' }">{{robotName}}</el-breadcrumb-item>
        <el-breadcrumb-item>我的技能</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row type="flex" justify="space-around" style="padding-bottom: 10px;height: 90px">
        <el-col align="left">
          <span style="font-size: 18px;position: relative;top: 30px;left: 116px">我的技能</span>
          <el-button size="small" type="success" style="margin-left: 15px;position: relative;top: 30px;left: 116px" @click="addSkill()">新建技能</el-button>
        </el-col>
      </el-row>
      <!--没有技能是的展示-->
      <div class="noSkillView" v-if="showNoSkillView">
        <div class="noSkillText" >你还没有任何技能</div>
        <el-button type="success" size="medium" class="addSkillBtn" @click="addSkill()">马上新建技能&nbsp&nbsp></el-button>
      </div>
      <!--技能列表-->
      <div  class="mySkill">
        <el-col :span="8" class="elrow" v-for="(item,index) of listData" :key = "index">
          <skillView  v-bind:itemData="item" @goPage="goPage($event)" @editSkill="editSkill($event)" @deleteSkill = "deleteSkill($event)">
          </skillView>
        </el-col>
      </div>
      <!--分页选择器-->
      <el-col type="flex" justify="center" style="padding-bottom: 30px" v-if="showPagination">
        <el-pagination align="center"
                       :current-page.sync= "skillListModel.cp"
                       :page-size="skillListModel.ps"
                       :total="totalCount"
                       class="pagination"
                       layout="total, prev, pager, next, jumper"
                       @current-change="pageChange"
        >
        </el-pagination>
      </el-col>
      <!--新建技能和编辑技能弹窗-->
      <el-dialog custom-class="skillDiaStyle" :close-on-click-modal="false" :visible.sync="dialogFormVisible" @close="close()"  center >
        <div slot="title" class="title" style="font-size: 16px">{{formTitle}}
          <div class="titleBottomLine"></div>
        </div>
        <el-container class="el-containerTitle">
          <div class="markView"></div>
          <div class="typeTitle">自建技能</div>
        </el-container>
        <el-form :model="form" :rules="rules" ref="form" class="demo-rule">
          <el-form-item  style="margin-top: 10px;margin-bottom: 10px" >
            <el-button class="dialogueBtn" v-bind:class="form.skillType=='0' ? 'selectBtn':'noSelectBtn'"   icon="el-icon-connection" @click="dialogSkillClick">对话技能</el-button>
            <el-button class="qaBtn" v-bind:class="form.skillType=='0' ? 'noSelectBtn':'selectBtn'"   icon="el-icon-chat-line-square"  @click="answerSkillClick">问答技能</el-button>
          </el-form-item>
          <span>{{form.skillType=='0'?dialogueNotes:answerNotes}}</span>

          <el-form-item label="技能名称:" :label-width="formLabelWidth" style="margin-top: 20px" prop="skillName">
            <el-input v-model="form.skillName" style="width: 400px" placeholder="请输入名称"></el-input>
          </el-form-item>

          <el-form-item label="技能描述:" :label-width="formLabelWidth">
            <el-input  type="textarea" v-model="form.skillDescription" style="width: 400px" placeholder="请输入描述"></el-input>
          </el-form-item>

          <!--<el-form-item label="复制技能:" :label-width="formLabelWidth">-->
          <!--<el-select v-model="selectRobotId" placeholder="选择机器人" @change="selectRobot">-->
          <!--<el-option-->
          <!--v-for="item in robotListData"-->
          <!--:key="item.id"-->
          <!--:label="item.name"-->
          <!--:value="item.id">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--<el-select v-model="selectRobotSkillId" placeholder="选择技能">-->
          <!--<el-option-->
          <!--v-for="item in selectRobotSkillList"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="onSubmit('form')">确定</el-button>
        </span>
      </el-dialog>

    </el-main>


  </el-container>

</template>

<script>
  import skillView from "../../components/robotConfig/SkillView"
  import {robotConfigService} from '../../service/index';
  import robotHeader from '../../components/robotConfig/RobotConfigHeader';
  import {SetCookie,getJoinCookie} from '../../utils/commonUtil';


  export default {
    name: "skillhome",
    components: {
      skillView,
      robotHeader
    },
    data() {
      return {
        robotName: '',
        listData: [],
        robotListData:[],
        robotData:{},//机器人对象上级页面传过来的
        selectRobotId:'',
        selectRobotSkillId:'',
        selectRobotSkillList:[],
        skillListModel: {
          userId: '',
          taskId:'',//任务Id 机器人Id
          cp: 1,
          ps: 9
        },
        totalCount: 1,
        dialogFormVisible: false,
        formTitle: '',
        showNoSkillView: false,
        showPagination: true,
        dialogueNotes:'对话技能通过参数化配置构建对话能力,如:预定【明天】去【北京】的火车票',
        answerNotes:'问答技能通过问答内容构建对话能力,如:火车票可以提前多少天购买',
        formLabelWidth:'100px',
        rules: {
          skillName: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ]
        },
        form:{
          skillName:'',
          skillType:'0',//0-对话类型技能 1-问答类型技能
          skillDescription:'',
          copyRobotId:'',
          copySkillId:'',
          id:'',//技能id

        },
        //获取机器人列表的params
        robotListModel:{
          userId:'1',
          taskType:'DIALOGUE',
          orderBy:'createAt',
        },
        loading:true,

      }
    },

    methods: {
      /***************请求接口相关的方法*******************************/
      //获取技能列表
      async getSkillList() {
        this.loading = true
        let result = await robotConfigService.getSkillList(this.skillListModel);
        this.loading = false
        if (result.message.code == 0) {
          this.listData = result.data.list;
          this.totalCount = result.data.totalCount;
          this.skillListModel.cp = result.data.currentPage
          if (this.listData.length){
            this.showPagination = true
            this.showNoSkillView = false
          }else {
            this.showNoSkillView = true
            this.showPagination = false
          }
        }
      },
      //新增技能请求
      async addSkillRequest(params) {
        let result = await robotConfigService.addSkill([params]);
        this.dialogFormVisible = false
        if (result.message.code == 0) {
          let target = this;
          setTimeout(function () {
            target.getSkillList();
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
      //删除技能请求
      async deleteSkillRequest(id) {
        let result = await robotConfigService.deleSkill({skillId: id});
        if (result.message.code == 0) {
          let target = this;
          setTimeout(function () {
            target.getSkillList();
          }, 1250);
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          });
        } else {
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },
      //编辑技能请求
      async editSkillRequest(parmas) {
        let result = await robotConfigService.editSkill([parmas]);
        this.dialogFormVisible = false
        if (result.message.code == 0) {
          let target = this;
          setTimeout(function () {
            target.getSkillList();
          }, 1250);
          this.$message({
            showClose: true,
            message: '编辑成功',
            type: 'success'
          });
        } else {
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },
      //获取机器人列表用于复制选项
      async getRobotList() {
        let result = await robotConfigService.getRobotList(this.robotListModel);
        if (result.message.code == 0) {
          this.robotListData = result.data.list;
        }
      },
      //根据机器人Id获取该机器人的技能列表
      async getRobotSkillList(robotId){
        let result = await robotConfigService.getSkillList({taskId:robotId});
        if (result.message.code == 0) {
          this.selectRobotSkillList = result.data.list;
        }
      },
      /**********************交互相关的方法************************************/
      //新增技能
      addSkill() {
        this.dialogFormVisible = true
        this.formTitle = '新建技能'
      },
      //编辑技能
      editSkill(skillData) {
        this.dialogFormVisible = true
        this.formTitle = '编辑技能'
        this.form.skillName = skillData.skillName
        this.form.skillDescription = skillData.skillDescription
        this.form.skillType = skillData.skillType
        this.form.id = skillData.id
      },
      //删除技能
      deleteSkill(skillData) {
        var text = '技能删除后不可恢复,所有与其相关的信息都将删除,你确定要删除技能"' + skillData.skillName + '"吗?'
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //点击确定
          this.deleteSkillRequest(skillData.id);
        }).catch(() => {
          //点击取消
        });

      },
      //选择复制的机器人回调方法
      selectRobot(copyRobotId){
         this.getRobotSkillList(copyRobotId)
      },
      //点击弹窗的对话技能
      dialogSkillClick(){
        this.form.skillType = '0'
      },
      //点击弹窗的问答技能
      answerSkillClick(){
        this.form.skillType = '1'
      },
      //点击确定
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = {};
            params.skillName = this.form.skillName//技能名称
            params.skillType = this.form.skillType//技能类型 对话/回答
            params.skillDescription = this.form.skillDescription//技能详情
            params.userId = this.skillListModel.userId
            params.copyRobotId =''//复制机器人Id
            params.copySkillId =''//复制技能Id
            params.taskId = this.skillListModel.taskId//机器人Id
            params.retainSessionNum = 1//默认保留1轮
            params.switchIntentionClean = '1'//技能切换是(默认不清理)
            params.satisfyIntentionClean = '1'//技能满足时(默认不清理)
            params.task = this.robotData//把机器人对象传给后端
            if(this.formTitle =='新建技能'){
              this.addSkillRequest(params);
            }else if(this.formTitle =='编辑技能'){
              params.id = this.form.id//技能id
              this.editSkillRequest(params);
            }
          } else {
            return false;
          }
        });
      },
      //点击分页
      pageChange(page) {
        this.skillListModel.cp = page;
        this.getSkillList();
      },
      //跳转到技能设置页
      goPage(skillData){
        let path = '/tacticsmanagement?index=tacticsmanagement'
        if (  skillData.skillType===1) {
          path ='/knowledgemanagement?index=knowledgemanagement'
        }
        this.$router.push({
          path:path, query: {
            title: skillData.skillName,
            id:    skillData.id,
            robotName:this.robotName,
            taskId:this.skillListModel.taskId,
            skillType: skillData.skillType,
            skillData:JSON.stringify(skillData)

          }
        });
      },
      //弹窗关闭的回调
      close(){
        //关闭是清空数据
        this.resetData()
        this.form.radio = 0
      },
      //清空数据
      resetData(){
        this.$refs['form'].resetFields()
        this.form.skillName=''
        this.form.guidanceMsg=''
        this.form.skillDescription=''
      }
    },//methods

    created: function () {
      this.skillListModel.userId=getJoinCookie('userId');
      if (this.$route.query.robotName) {
        this.robotName = this.$route.query.robotName
        this.skillListModel.taskId = this.$route.query.robotId
        if(this.$route.query.skillData) {
          let skillData = JSON.parse(this.$route.query.skillData)
          this.skillListModel.taskId =skillData.task.id
        }
        this.robotData= JSON.parse(sessionStorage.getItem("robotObj"));
      }
      this.getSkillList()
    },

    mounted() {
     this.getRobotList()
    }
  }
</script>
<style>

  .skillDiaStyle{
    border-radius: 5px !important;
    width: 580px !important;
  }
  .skillDiaStyle>div:nth-child(1){
    border-bottom: #DFE2E5 1px solid;
  }
  .skillDiaStyle>div:nth-child(2){
    padding:20px 30px;
  }
</style>

<style scoped>
  .el-main{
    padding: 0!important;
  }
  .el-container{
    min-height: 100%;

  }
  .mySkill {
    /*background: red;*/
    padding-left: 100px;
    padding-right: 100px;

  }

  .breadcrumb{
    background-color: #fff;
    height: 60px;
    padding-left: 60px;
    line-height: 60px;
    text-align: center;

  }
  .elrow{
    padding-right:10px;
    padding-left: 10px;
    padding-bottom:30px;

  }

  .noSkillView{
    background-color: #fff;
    /*position: relative;*/
    width: 80%;
    position: absolute;
    left: 120px;
    top: 200px;
    bottom: 40px;


  }
  .content{
    background-color: red;

    height: 100%;
  }
  .noSkillText{
    font-size: 20px;
    font-weight: bold;
    position:absolute;
    top: 165px;
    left: 50%;
    margin-left: -60px;


  }
  .addSkillBtn{
    position:absolute;
    top: 200px;
    left: 50%;
    margin-left: -50px;

  }
  .titleBottomLine{

  }
  .title{
    text-align: left;
  }
  .el-containerTitle{
    /*background-color: yellow;*/
  }
  .markView{
    width: 5px;
    height: 15px;
    background-color: #45B854;
  }
  .typeTitle{
    font-size: 14px;
    margin-left: 10px;
    margin-top: -3px;
  }
  .selectBtn,.selectBtn:active,.selectBtn:hover,.selectBtn:focus
  {
    background-color: #45B854;
    border: none;
    color: #fff;
    width: 250px;
    height: 50px;
   font-size: 16px;
  }
  .noSelectBtn, .noSelectBtn:active,.noSelectBtn:focus,.noSelectBtn:hover{
    width: 250px;
    height: 50px;
    font-size: 16px;
    background-color: #EFF3F6;
    color: rgba(51,51,51,0.3);
    border: none;


  }
</style>
