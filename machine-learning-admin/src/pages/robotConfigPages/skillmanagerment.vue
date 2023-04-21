<template>
  <!--技能设置页-->
  <div>
    <!--面包屑-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/skillhome', query: {
            skillData:JSON.stringify(skillData),
            robotName:robotName
            }}">我的技能</el-breadcrumb-item>
      <el-breadcrumb-item>技能设置</el-breadcrumb-item>
    </el-breadcrumb>
  <el-card class="box-card">
    <div slot="header" class="header">
      <span>清空对话session的条件设置</span>
    </div>
    <el-form label-width="150px" class="demo-ruleForm">
      <el-form-item label="用户切换技能时:">
        <el-select v-model="form.changeIntentValue">
          <el-option  value="清空"></el-option>
          <el-option  value="不清空"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户技能达到满足时:">
        <el-select v-model="form.IntentSatisfyValue">
          <el-option  value="清空"></el-option>
          <el-option  value="不清空"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="固定对话次数:">
          <span>清空&nbsp&nbsp</span>
        <el-input class="clearDialogue" v-model="form.clearDialogueValue" placeholder="输入数字"></el-input>
          <!--<el-select v-model="form.clearDialogueValue" size="mini" class="clearDialogue">-->
            <!--<el-option  value="1"></el-option>-->
            <!--<el-option  value="2"></el-option>-->
            <!--<el-option  value="3"></el-option>-->
          <!--</el-select>-->
        <span>轮对话之前的session</span>
      </el-form-item>
      <el-form-item>
        <el-button class="preserveBtn" type="success" size="small" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>

  </el-card>
  </div>

</template>

<script>
  import {robotConfigService,informationService} from '../../service/index';


  export default {
    name: "SkillManagerment",
    components: {

    },
    data() {
      return {
        robotName:'',
        robotData:{},
        skillId:'',
        skillData:{},
        form:{
          changeIntentValue:'不清空',
          IntentSatisfyValue:'不清空',
          clearDialogueValue:''
        },

      }
    },

    methods: {


      /****************************接口相关的方法***************************/
      //请求技能设置信息
      async getSkillInfo() {
        // this.loading = true
        let result = await robotConfigService.getSkillList({ids:this.skillData.id,taskId:this.robotData.id});
        // this.loading = false
        if (result.message.code == 0) {
          let skillObj = result.data.list[0]
          this.form.changeIntentValue = skillObj.switchIntentionClean=="1"?"不清空":"清空"
          this.form.IntentSatisfyValue = skillObj.satisfyIntentionClean=="1"?"不清空":"清空"
          this.form.clearDialogueValue = skillObj.retainSessionNum
        }
      },

      //编辑技能请求
      async editSkillRequest(parmas) {
        let result = await robotConfigService.editSkill([parmas]);
        if (result.message.code == 0) {
          let target = this;
          setTimeout(function () {
            // target.getSkillList();
          }, 1250);
          this.$message({
            showClose: true,
            message: '设置成功',
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

      /******************************交互相关的方法************************************/
      //点击保存
      submitForm(from){
          var params = {};
          params.skillName = this.skillData.skillName//技能名称
          params.skillType = this.skillData.skillType//技能类型 对话/回答
          params.skillDescription = this.skillData.skillDescription//技能详情
          // params.userId = this.skillListModel.userId
          // params.taskId = this.skillData.task.id//机器人Id
          params.task = this.robotData
          params.retainSessionNum =  parseInt(this.form.clearDialogueValue)
          params.switchIntentionClean = this.form.changeIntentValue=='不清空'?"1":"0" //技能切换是(默认不清理)
          params.satisfyIntentionClean = this.form.IntentSatisfyValue=='不清空'?"1":"0" //技能满足时(默认不清理)
          params.id = this.skillData.id//技能id
          this.editSkillRequest(params);
      },


    },//methods

    created: function () {
      if (this.$route.query.index) {
        this.robotName=this.$route.query.robotName
        this.skillId=this.$route.query.id
        this.robotData= JSON.parse(sessionStorage.getItem("robotObj"));
        if (this.$route.query.skillData) {
          this.skillData  = JSON.parse(this.$route.query.skillData)
        }
      }
       this.getSkillInfo()

    },

    mounted() {
     }
    }
</script>

<style scoped>

  .breadcrumb{
    background-color: #fff;
    height: 60px;
    padding-left: 20px;
    line-height: 60px;
    text-align: center;

  }
  .box-card{
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;

  }
  .header{
    font-size: 14px;
    font-weight: bold;
  }
  .clearDialogue{
    width: 100px;
    height: 20px;
  }
  .preserveBtn{
  }
</style>
