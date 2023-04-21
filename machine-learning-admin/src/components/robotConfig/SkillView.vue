<template>
    <!--技能卡片-->
  <div class="robotView">
    <el-card  :body-style="{ padding: '0px'}" class="box-card" >

      <div style="height: 150px;" @click="goPage">
        <el-row type="flex">
          <div class="skillName">{{itemData.skillName}}</div>
          <div class="skillType">{{itemData.skillType===1?'问答':'对话'}}</div>
        </el-row>
        <div class="skillDesc">{{itemData.skillDescription}}</div>
      </div>
      <div class="bottomView">
        <el-row type="flex">
          <i class="el-icon-edit"  @click="editSkill"></i>
          <i class="el-icon-delete" @click="deleteSkill"></i>
        </el-row>

      </div>


    </el-card>
  </div>
</template>

<script>
    export default {
        name: "SkillView",
        props:{
          itemData:{
            type:Object,
            required:true
          }

        },

        methods:{
          goPage:function(){

            this.$emit('goPage',this.itemData);

          },
          editSkill:function(){
            this.$emit('editSkill',this.itemData);
          },

          deleteSkill:function () {
            this.$emit("deleteSkill",this.itemData);

          },

        },//methods
    }
</script>

<style scoped>
  .box-card {
    height: 200px;
  }
  .skillName{
    /*background-color: bisque;*/
    font-size: 24px;
    margin-left: 29px;
    margin-top: 29px;
    font-family: Microsoft YaHei Regular;

  }
  .skillType{
    margin-left: 10px;
    margin-top: 35px;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    padding-left: 12px;
    padding-right: 12px;
    text-align: center;
    border-radius:13px;
    color: #1C93EC;
    border:1px solid #1C93EC;
  }
  .skillDesc{
    padding-left: 29px;
    padding-top: 20px;
    font-size: 14px;
    padding-right: 29px;
    display: -webkit-box;
    display: -moz-box;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    /* !autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    -webkit-line-clamp:2;   /*显示行数*/
    font-family: PingFangSC;
    color: #7F8FA4;

  }
  .bottomView{
    background-color: #EFF3F6;

    height: 50px;
  }
  .el-icon-edit,
  .el-icon-delete{
    position:absolute;
    top: 14px;
    font-size: 16px;
    color: #7F8FA4;

  }
  .el-icon-edit{
    right: 60px;
  }

  .el-icon-delete{
    right: 20px;
  }

</style>
