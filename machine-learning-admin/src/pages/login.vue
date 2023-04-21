<!--登录页-->
<template>
  <div class="demo-ruleForm login-container">
    <h3 class="title">人工智能自动化工具</h3>
    <el-tabs v-model="userType" type="border-card">
      <el-form :model="adminModel" :rules="adminRules" ref="adminForm" label-position="left" label-width="0px">
        <el-form-item prop="account">
          <el-input type="text" v-model="adminModel.name" auto-complete="off" placeholder="请输入管理员账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="adminModel.password" auto-complete="off" placeholder="密码"
                    @keyup.13.native="adminLoginHandler"></el-input>
        </el-form-item>
        <el-checkbox v-model="saveAdminPwd" class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="adminLoginHandler">登录</el-button>
        </el-form-item>
      </el-form>
    </el-tabs>
  </div>
</template>


<script>
  import {informationService} from '../service/index';
  import {SetCookie} from '../utils/commonUtil';
  import {mapState, mapActions} from 'vuex';

  export default {
    name: 'login',
    components: {},
    data() {
      return {
        userType: 'admin',
        taskType:'tagging',
        adminModel: {
          account: '',
          password: ''
        },
        strategyModel: {
          account: '',
          password: ''
        },
        userId: '',
        //登录验证
        adminRules: {
          name: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        },
        saveAdminPwd: false, //是否保存admin密码
//      saveStrategyPwd: false, //是否保存密码
        strategyList: [],
        strategyLoaded: false,
        intervalId: -1
      }
    },
    mounted: function () {
      //admin
      this.saveAdminPwd = !!(localStorage.saveAdminPwd && localStorage.saveAdminPwd === 'true');
      if (localStorage.saveAdminPwd) {
        this.adminModel.account = localStorage.adminAccount;
        this.adminModel.password = localStorage.adminPassword;
      }
    },
    methods: {
      ...mapActions([
        'setUserInfo',
        'setFiledName'
      ]),

      //admin登录
      adminLoginHandler() {
        this.$refs['adminForm'].validate((valid) => {
          if (valid) {
            this.doAdminLogin();
          }
        })
      },

      //管理员登录请求（2019,11,8号 之前的登录接口更换为这个）
      async doAdminLogin() {
        let params = {
          name: this.adminModel.name,
          password: this.adminModel.password,
        };
        let result = await informationService.userLogin(params);
        if (result.message.code === 0) {
          this.userId = result.data.id;
          SetCookie('userId', result.data.id);//保存用户id
          SetCookie('userName',result.data.name);//保存用户名
          SetCookie('passWord',this.adminModel.password);//保存用户名
          if (this.taskType == 'dialogue'){
            this.$router.push('/myrobot')
          } else {
            this.$router.push('/mytask')
          }
        }
        else {
          this.$message({
            type: 'error',
            showClose: true,
            message: '账号或密码错误'
          })
        }
      },


      // //管理员登录请求
      // async doAdminLogin() {
      //   let params = {
      //         name: this.adminModel.name,
      //         password: this.adminModel.password,
      //       };
      //   let result = await informationService.logSign(params);
      //   if (result.message.code === 0) {
      //     this.userId = result.data;
      //     SetCookie('userId', result.data);
      //     SetCookie('userName',this.adminModel.name);
      //     if (this.taskType == 'dialogue'){
      //       this.$router.push('/myrobot')
      //     } else {
      //        this.$router.push('/mytask')
      //     }
      //
      //   }
      //   else {
      //     this.$message({
      //       type: 'error',
      //       showClose: true,
      //       message: '账号或密码错误'
      //     })
      //   }
      // },


      //操持token可用
      async keepTokenAvailabel() {
//      console.log('keepTokenAvailabel')
        let token = sessionStorage.getItem('token');
        if (token) {
          let result = await alive({token: token});
        }
      }
    },
    watch: {},
    created(){
       if (this.$route.query.taskType) {
         this.taskType = this.$route.query.taskType
       }
    },
  }
</script>

<style scoped>
  .login-container {
    border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 35px 35px;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    background-color: #ffffff;
  }

  .title {
    margin: 0 auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .remember {
    margin: 0 0 20px 0;
  }

  .el-form-item {
    padding-bottom: 10px;
  }
</style>

