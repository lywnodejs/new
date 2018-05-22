<template>
  <div>
	<el-header>
      <h1>聆刻互动P端管理平台</h1>
    </el-header>
    <el-container>  
      <el-form ref="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input clearable suffix-icon="el-icon-edit" v-model="form.name" autofocus placeholder="请输入用户名" ></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" clearable suffix-icon="el-icon-date" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" @keyup.enter="onSubmit">立即登录</el-button>
      </el-form-item>
        <img src="http://photocdn.sohu.com/20150720/mp23528575_1437394210780_13.jpeg" alt="">
      <a href="https://sm.myapp.com/original/Browser/66.0.3359.139_chrome_installer_x64.exe">推荐使用谷歌浏览器</a>	   
    </el-form>
  </el-container>
  <el-row class="footer">
      <el-col :span="24"><div>聆刻互动(北京)网络科技有限公司 版权所有©2017-2018 技术支持电话：010-85750629</div></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
    data() {
      return {
        form: {
          name:'',
          password:'',
        }
      }
    },
    methods: {
      onSubmit() {
        this.$http.post("http://love.lingkehudong.com:9098/user/login",{
          data:{
            name:this.form.name,
            password:this.form.password,
            isbg:true,
          } 
        },{
          emulateJSON:false
        }).then(function(msg){
          if(this.form.name==""||this.form.password==""){
            this.$message.error("请填写完整");            
          }else{
            if(!msg.data.success){
            this.$message.error('用户名或密码错误');
            }else{
              this.$router.push({path:"/list"});
              sessionStorage.setItem("token",msg.data.data.token);
              this.password="";this.name="";
              $('html,body').css({"background":"none"})       
            }
          }
        })
      }
    }
}
</script>


<style type="text/css" scoped>
h1{
  text-align: center;
  font-size: 40px;
  color: rgb(253, 253, 253);
  padding-top: 7%;
}
.el-button{
  margin-left: 17%;
}
a{
	text-decoration: none;
	color: black;
	font-size: 12px;
}
.el-main{
  width: 50%;
  height: 50%;
  border: 1px solid #ccc;
}
.el-form{
  margin:10% auto 0;
  background: #fff;
  padding:50px 90px 25px 60px;
  border-radius: 20px;
}
img{
  width: 20px;
  height: 20px;
  float: left;
  margin-top: 3px;
  margin-right: 10px;
  margin-left: 100px;
}
.footer{
  color: #fff;
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 20px;
}
</style>
