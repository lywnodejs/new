<!--登录页-->
<template>
  <div class="demo-ruleForm login-container">
    <h3 class="title">知识图谱后台系统</h3>

    <el-tabs v-model="userType" type="border-card">
      <!--管理员账号-->
      <!--<el-tab-pane label="管理员账号" name="admin">-->
      <el-form
        :model="adminModel"
        :rules="adminRules"
        ref="adminForm"
        label-position="left"
        label-width="0px"
      >
        <el-form-item prop="account">
          <el-input
            type="text"
            v-model="adminModel.account"
            auto-complete="off"
            placeholder="请输入管理员账号"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="adminModel.password"
            auto-complete="off"
            placeholder="密码"
            @keyup.13.native="adminLoginBtn"
          ></el-input>
        </el-form-item>

        <el-checkbox v-model="saveAdminPwd" class="remember">记住密码</el-checkbox>

        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="adminLoginBtn">登录</el-button>
        </el-form-item>
      </el-form>
      <!--</el-tab-pane>-->
    </el-tabs>
    <!--<pan-kou></pan-kou>-->
  </div>
</template>


<script>
var md5 = require("md5");
import { userService } from "../config/serviceConfig";
export default {
  name: "login",
  components: {},
  data() {
    return {
      userType: "admin",
      adminModel: {
        account: "",
        password: ""
      },
      strategyModel: {
        account: "",
        password: ""
      },
      //登录验证
      adminRules: {
        account: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      saveAdminPwd: false, //是否保存admin密码
      //      saveStrategyPwd: false, //是否保存密码
      strategyList: [],
      strategyLoaded: false,
      intervalId: -1
    };
  },
  mounted: function() {
    //admin
    // this.saveAdminPwd = !!(
    //   localStorage.saveAdminPwd && localStorage.saveAdminPwd === "true"
    // );
    // if (localStorage.saveAdminPwd) {
    //   this.adminModel.account = localStorage.adminAccount;
    //   this.adminModel.password = localStorage.adminPassword;
    // }
    if (this.getQueryString("token")) {
      let token = decodeURIComponent(this.getQueryString("token"));
      let decryStr = window.atob(token);

      let obj = decodeURIComponent(decryStr);
      obj = JSON.parse(obj);

      this.adminModel.account = obj.userName;
      this.adminModel.password = obj.ps;
      this.adminLoginBtn();
    }
  },
  methods: {
    async adminLoginBtn() {
      // if (!this.adminModel.account) {
      //   this.$message({
      //     message: "请输入账号！",
      //     type: "warning"
      //   });
      //   return;
      // }

      // if (!this.adminModel.password) {
      //   this.$message({
      //     message: "请输入密码！",
      //     type: "warning"
      //   });
      //   return;
      // }

      let result = await userService.login({
        name: this.adminModel.account,
        password: this.adminModel.password
      });
      let res = result || {};
      if (res.message && res.message.code == 0) {
        //登录成功后记录缓存
        window.localStorage.setItem("isLogin", true);
        setTimeout(function() {
          window.localStorage.removeItem("isLogin");
        }, 7200000);
        this.$router.push({ path: "/relationContrl" });
      } else {
        this.$message({
          message: "账号或密码不正确！",
          type: "error"
        });
        return;
      }
    },
    //获取浏览器参数
    getQueryString: function(key) {
      var after = window.location.search;
      //if (after.indexOf("?") === -1) return null; //如果url中没有传参直接返回空

      //key存在先通过search取值如果取不到就通过hash来取
      after = after.substr(1) || window.location.hash.split("?")[1];

      if (after) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        var r = after.match(reg);
        if (r != null) {
          return decodeURIComponent(r[2]);
        } else {
          return null;
        }
      }
    }

    //admin登录
    // adminLoginHandler() {
    //   this.$refs["adminForm"].validate(valid => {
    //     if (valid) {
    //       this.doAdminLogin();
    //     }
    //   });
    // },

    //定时心跳
    // doInterval() {
    //   //      console.log('doInterval')
    //   if (this.intervalId !== -1) clearInterval(this.intervalId);
    //   this.intervalId = setInterval(this.keepTokenAvailable, 60 * 1000);
    // },

    //管理员登录请求
    // async doAdminLogin() {
    //   let params = {
    //     userName: this.adminModel.account,
    //     password: md5(this.adminModel.password)
    //   };
    //   params = this.$qs.stringify(params);
    //   let result = await userService.login(params);
    //   result = JSON.parse(result);

    //   if (result.message.code === 0) {
    //     this.doInterval();
    //     if (this.saveAdminPwd) {
    //       localStorage.adminAccount = this.adminModel.account;
    //       localStorage.adminPassword = this.adminModel.password;
    //     } else {
    //       localStorage.removeItem("adminAccount");
    //       localStorage.removeItem("adminPassword");
    //     }
    //     //cache userName to session
    //     sessionStorage.userName = this.adminModel.account;
    //     //          sessionStorage.token = result.item.token||{};
    //     //cash to local
    //     localStorage.saveAdminPwd = this.saveAdminPwd;
    //     //set token
    //     //          setToken(result.item.token);
    //     //        console.log(getToken())
    //     //登录成功后记录缓存
    //     window.localStorage.setItem("isLogin", true);
    //     setTimeout(function() {
    //       window.localStorage.removeItem("isLogin");
    //     }, 7200000);
    //     this.$router.push({ path: "/relationContrl" });
    //     // let redirectUrl = this.$route.query.redirect || ''
    //     // if (redirectUrl) {
    //     //     this.$router.push({ path: redirectUrl })
    //     // } else {
    //     //     this.$router.push({ path: '/relationContrl' });
    //     // }
    //   } else {
    //     this.$message({
    //       type: "error",
    //       showClose: true,
    //       message: result.message.message
    //     });
    //   }
    //},

    //操持token可用
    // async keepTokenAvailable() {
    //   //      console.log('keepTokenAvailable')
    //   let token = sessionStorage.getItem("token");
    //   if (token) {
    //     let result = await alive({ token: token });
    //   }
    // }
  },
  watch: {}
};
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

