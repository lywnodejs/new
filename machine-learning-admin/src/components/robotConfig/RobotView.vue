<template>

  <div class="robotView" @click="toSkill">
    <el-card  :body-style="{ padding: '0px'}" class="box-card" >
      <el-row type="flex">
        <el-col :span="6">
          <div class="robotLogo">
            <img class="robotImage"  style="width: 48px; height: 48px; border-radius:50%;" :src="url"/>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="rightView">
            <div class="robotNameDiv">
              <span  class="robotName">{{itemData.name}}</span>
              <el-button  size="mini" class="elBtn homeQuestion" @click.stop="homequestion">首页问题</el-button>
            </div>
            <div class="robotId">ID:{{itemData.id}}</div>
            <div class="robotDesc">{{itemData.taskDesc?itemData.taskDesc:'无'}}</div>
            <div class="bottom ">
              <el-button type="primary" size="mini" class="elBtn" @click.stop="takeEffectTest">生效测试</el-button>
              <el-button type="success" size="mini" class="elBtn" @click.stop="takeEffectProduction">发布线上</el-button>
              <i class="el-icon-setting" @click.stop="setupRobot"></i>
              <i class="el-icon-edit"    @click.stop="editRobot"></i>
              <i class="el-icon-delete"  @click.stop="deleteRobot"></i>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>


</template>

<script>
  export default {
    name: "RobotView",
    props:{
      itemData:{
        type:Object,
        required:true
      }

    },
    data () {
      return {
        url: require('../../assets/images/robotLogo.png'),
        desc:''
      }
    },
    methods:{

      setupRobot:function(){
        this.$emit('robotSet',this.itemData);
      },

      editRobot:function(){
        this.$emit('editRobot',this.itemData);
      },

      deleteRobot:function () {
        this.$emit("deleteRobot",this.itemData);
      },
      toSkill(){
        let robotObj= JSON.stringify(this.itemData);
        sessionStorage.setItem("robotObj", robotObj);
        this.$emit("toSkill",this.itemData);
      },
      //首页问题
      homequestion(){
        let robotObj= JSON.stringify(this.itemData);
        sessionStorage.setItem("robotObj", robotObj);
        this.$emit("homequestion",this.itemData);
      },
      //测试生效
      takeEffectTest(){
        this.$emit("takeEffectTest",this.itemData);

      },
      //发布线上
      takeEffectProduction(){
        this.$emit("takeEffectProduction",this.itemData);

      },

    },//methods
    mounted: function () {
      //页面加载完成
      if (this.itemData.taskDesc){
        this.desc = this.itemData.taskDesc
      } else {
        this.desc = '无'
      }
    },


  }

</script>

<style scoped>

  .robotNameDiv{
    font-size:18px;
    font-weight:bold;
    /*background-color: red;*/
    padding-top: 20px;
    margin-right:20px;
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
  }
  .robotName{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /*background-color: yellow;*/
    width: 150px;
    display: inline-block;
  }
  .robotId{
    font-size:14px;
    padding-top: 5px;
    color: #7F8FA4;

  }
  .robotDesc{
    padding-top: 10px;
    display: -webkit-box;
    display: -moz-box;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:2;   /*显示行数*/
    padding-right: 20px;
    font-size: 14px;
    font-family: PingFangSC;
    color: rgba(0,0,0,0.45);

  }


  .bottom {
    /*background: bisque;*/
    position:absolute;
    bottom:0;
    width: 75%;
    height: 50px;



  }

  .bottomBtn{
    width:100%;
    margin-top: 5px;
    border-style: none solid solid none;
    border-width: 0.5px;
  }

  .box-card {
    height: 200px;
    /*position:relative;*/
  }
  .robotLogo{
    height: 200px;
    /*background-color: red;*/

  }
  .rightView{
    height: 200px;
    /*background-color: yellow;*/

  }
  .robotImage{
   margin-top: 20px;
   margin-left: 15px;

  }
  .elBtn{
    margin-left: 2px;
    padding: 7px 10px;
  }
  .el-icon-setting{
    position:absolute;
    right: 70px;
    top: 5px;
    color: #7F8FA4;
    font-size: 16px;
  }
  .el-icon-edit{
    position:absolute;
    right: 45px;
    top: 5px;
    color: #7F8FA4;
    font-size: 16px;

  }
  .el-icon-delete{
    position:absolute;
    right: 20px;
    top: 5px;
    color: #7F8FA4;
    font-size: 16px;
  }
  .homeQuestion{
    float: right;
  }


</style>

