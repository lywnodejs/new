<template>
  <div>
    <div class="header">
      <header-vue></header-vue>
    </div>
    
    <el-menu
      background-color="#231F20"
      text-color="#fff"
      active-text-color="#ffd04b"
      router="true"
      :collapse="isCollapse">
     <el-menu-item>
        <span slot="title" @click="isCollapse_()">聆刻互动P端管理</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span slot="title">C端管理</span>
        </template>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
      </el-submenu>
      <el-menu-item 
      :index="getRouter(index)"
       v-for="(item,index) in listMenu"
       >
        <i class="el-icon-menu"></i>
        <span slot="title">{{item.title}}</span>
      </el-menu-item>
    </el-menu>
    <div class="right">
      <transition name="el-zoom-in-top">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>


<script>
import headerVue from '../header'
  export default {
    components:{
      headerVue
    },
     data() {
      return {
        isCollapse: false,
        listMenu:[],
        listMenus:[],
      }
    },
    mounted(){
      this.getList()
    },
    methods: {
      isCollapse_(){
        this.isCollapse=!this.isCollapse;
      },
      getList(){
        this.$http.post("http://love.lingkehudong.com:9098/user/listMenu",{
          "data":{},
          "token":sessionStorage.getItem("token")
        }).then(function(msg){
          console.log(msg)
          if(msg.data.success){
            var this_=this;
            msg.data.data.forEach(function(item,index){
              let arr=item.route.split('/');
              if(arr.length==1){
                this_.listMenu.push(item);
              }
            });
            this.$router.push("/list/"+msg.data.data[0].route);
          }
        })
      },
      getRouter(index){
        return "/list/" + this.listMenu[index].route       
      }
    },
  }
</script>

<style lang="css" scoped>
 .el-menu:not(.el-menu--collapse) {
    width: 200px;
  }
  .el-menu{
    float: left;
    position:absolute;
    top:0;
    left:0;
    border:none;
  }
  .right{
    float: left;
    position:absolute;
    top:60px;
    left:220px;
    width:82%;
  }
  .header{
    position:absolute;
    top:0px;
    left:200px;
    width:85%;
    height:100px;
    border-button:1px solid #ccc;
  }
</style>

