<template>
    <!--技能导航页页包含技能高级设置和策略设置-->
  <el-container class="el-container" >
    <el-header style="padding: 0px">
      <robotHeader v-bind:isShowTakeEffectBtns="true"></robotHeader>
    </el-header>
    <el-container>
      <el-aside width="250px" class="aside">
        <el-menu
          :default-active="indexStr"
          class="el-menu-vertical-demo"
          background-color="#273142"
          text-color="#fff"
          active-text-color="#1890FF">
          <div style="text-align: center;display: block;height: 105px">
            <span style="font-size: 16px;display: block;padding-top:30px;color: #7F8FA4;">{{skillData.skillName}}</span>
            <span style="font-size: 12px;display: block;padding-top:10px;color: #7F8FA4;">--{{skillData.skillType==0?"对话技能":"问答技能"}}--</span>
          </div>
          <el-submenu index="1">
            <template slot="title">
              <img v-if="this.$route.query.index==='tacticsmanagement'||
                         this.$route.query.index==='knowledgemanagement'||
                         this.$route.query.index=== 'qamanagent'||
                         this.$route.query.index==='addqapair'"
                   src="../../../static/images/navmenu-ylbz-select.png" style="margin: 0 10px">
              <img v-else src="../../../static/images/navmenu-ylbz.png" style="margin: 0 10px">
              <span>技能管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-if="skillData.skillType===0?false:true" index="knowledgemanagement" @click="goPage('/knowledgemanagement','knowledgemanagement')">
                <img v-if="this.$route.query.index==='knowledgemanagement'||this.$route.query.index==='qamanagent'||this.$route.query.index==='addqapair'" src="../../../static/images/navmenu-current.png" style="margin: 0 10px">
                <span v-else style="margin: 0 14px"/>
                知识管理
              </el-menu-item>
              <el-menu-item index="tacticsmanagement" @click="goPage('/tacticsmanagement','tacticsmanagement')">
                <img v-if="this.$route.query.index==='tacticsmanagement'" src="../../../static/images/navmenu-current.png" style="margin: 0 10px">
                <span v-else style="margin: 0 14px"/>
                {{skillData.skillType===0?"对话规则":"问答规则"}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <img v-if="this.$route.query.index==='skillmanagerment'"
                   src="../../../static/images/navmenu-mxgl-select.png" style="margin: 0 10px">
              <img v-else src="../../../static/images/navmenu-mxgl.png" style="margin: 0 10px">
              <span>技能设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="skillmanagerment" @click="goPage('/skillmanagerment','skillmanagerment')">
                <img v-if="this.$route.query.index==='skillmanagerment'" src="../../../static/images/navmenu-current.png" style="margin: 0 10px">
                <span v-else style="margin: 0 14px"/>
                技能设置
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import robotHeader from '../../components/robotConfig/RobotConfigHeader';

  export default {
      name: "SkillNavigation",
      components: {
        robotHeader
      },
      computed:{
        indexStr:{
          get:function () {

            if (this.$route.query.index =='qamanagent'||this.$route.query.index=='addqapair'){
               this.$route.query.index = 'knowledgemanagement'
            }
            return this.$route.query.index
          }
        }
      },
      data() {
          return {
            defaultActive:'',
            MTitle: '',
            skillId:'',
            robotName:'',
            skillType:'',
            skillData:{},
            taskId:'',
          }
      },

      methods: {
        goPage(page,index) {
          this.$router.push({path: page,query: {
              index:index,
              title:this.MTitle,
              id : this.skillId,
              taskId:this.taskId,
              robotName:this.robotName,
              skillData:JSON.stringify(this.skillData)
            }});
        },

      },//methods
      activated:function(){

      },
      created: function () {
        this.index = this.$route.query.index
        if (this.$route.query.index) {
          this.robotName = this.$route.query.robotName
          this.taskId  = this.$route.query.taskId
          if (this.$route.query.skillData) {
            this.skillData  = JSON.parse(this.$route.query.skillData)
            this.MTitle = this.skillData.skillName
            this.skillId=this.skillData.id//技能id
          }
        }
      },
      mounted(){
      }
    }
</script>

<style scoped>
  .el-main{
    padding: 0!important;
    background-color: #EFF3F6;
  }
.el-container{
  min-height: 100%;

}
.el-menu-vertical-demo{
  min-height: 100%;

}
  .el-menu-vertical-demo >>>  .el-menu-item{
    border-bottom: 1px solid #313D4F!important;
  }
  .el-menu-vertical-demo >>>  .el-submenu__title{
    border-bottom: 1px solid #313D4F!important;
  }

  .el-menu-vertical-demo >>> .el-menu-item-group__title{
    padding: 0px;
  }


</style>
