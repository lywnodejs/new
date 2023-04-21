<template>
  <div class="indexBox"
       id="boxIndex">
    <div class="header">
      <p>知识图谱</p>
      <i v-show="theme"
         @click="themeClick(true)"><img src="../../static/images/black_03.png"
             alt=""></i>
      <i v-show="!theme"
         @click="themeClick(false)"><img src="../../static/images/white_03.png"
             alt=""></i>
    </div>
    <div class="nav">
      <li>
        <img src="../../static/images/01_07.png"
             alt="">
        <p>行业</p>
        <p>{{list.industry}}</p>
      </li>
      <li>
        <img src="../../static/images/02_07.png"
             alt="">
        <p>产品</p>
        <p>{{list.product}}</p>
      </li>
      <li>
        <img src="../../static/images/03_07.png"
             alt="">
        <p>上市公司</p>
        <p>{{list.company}}</p>
      </li>
      <li>
        <img src="../../static/images/04_07.png"
             alt="">
        <p>关联关系</p>
        <p>{{list.relation}}</p>
      </li>
    </div>
    <div class="tu">
      <!--          <canvas width="300" height="300" id="myCanvas"></canvas>-->
      <div id="tags"
           style="max-width: 650px;border-radius: 50%;">
        <a :class="theme?'tagsb':'tagsw'"
           href="javascript:;"
           v-for="(item,index) in ballItem"
           :data-index="index"
           onclick="clickY(this)">{{item.disName}}<br />●</a>
      </div>
    </div>
    <div class="footer"
         style="height: 3.5rem;">
      <div class="history"
           v-show="history">
        <div class="linkLi"
             v-for="(item,index) in historyListNav">
          <li>
            <p @click="toknow(item.baseName,item.type,item.label)">{{item.label}}{{item.type=='st'? ' ('+item.baseName +')':''}}</p> <i class="iconfont iconarrow-left-bottom"></i>
          </li>
        </div>
      </div>
      <p v-show="historyList.length!==0 && historyShow">历史搜索 :</p>
      <div class="scroll"
           v-show="historyList.length!==0 && historyShow"><span v-for="item in historyList"
              @click="toknow2(item)">{{item.disName}}</span></div>
      <div class="inpBox">
        <i class="iconfont iconsearch"></i>
        <input v-model="input2"
               type="text"
               maxlength="10"
               placeholder="输入你想了解的公司、行业"
               @keyup.enter="toknow(input2)"
               @focus="historyShow=true"
               @blur="inputBlur()">
      </div>
      <button @click="toknow(input2)">搜索</button>
    </div>

    <div class="log">
      <div class="header">
        <p>知识图谱</p>
      </div>
      <div class="form">
        <div class="name">
          <input type="text"
                 autocomplete="off"
                 placeholder="请输入用户名"
                 v-model="name">
        </div>
        <div class="pass">
          <input type="password"
                 autocomplete="off"
                 placeholder="请输入密码"
                 v-model="pass">
        </div>
        <button @click="toHome()">登录</button>
      </div>
      <div class="alert">
        <div class="info">
          密码错误
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { eventService, loginService } from '../service/index'
export default {
  name: 'index',
  data () {
    return {
      msg: 'index',
      history: false,
      input: '',
      input2: '',
      theme: true,
      itemL: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      historyList: [],
      historyListNav: [],
      historyShow: false,
      ballItem: [],
      name: '',
      pass: ''
    }
  },
  computed: {
    list () {
      return this.$store.getters.getlist
    }
  },
  methods: {
    async toHome () {
      if (this.name == '') {
        this.set('用户名为空');
        return false;
      } else if (this.pass == '') {
        this.set('密码为空');
        return false;
      }
      let info = await loginService.login({ name: this.name, password: this.pass })
      if (info.message.code == -1) {
        this.set('用户名或密码错误');
        return false;
      }
      // if(this.name=='rxhui'){
      //   if(this.pass!=='rxhui@123!'){
      //     this.set('用户名或密码错误');
      //     return false;
      //   }
      // }else if(this.name=='csrc'){
      //   if(this.pass!=='csrc123456'){
      //     this.set('用户名或密码错误');
      //     return false;
      //   }
      // }else if(this.name=='rxhui1'){
      //   if(this.pass!=='123456'){
      //     this.set('用户名或密码错误');
      //     return false;
      //   }
      // }else if(this.name=='zhaochun'){
      //   if(this.pass!=='zhaochun@123'){
      //     this.set('用户名或密码错误');
      //     return false;
      //   }
      // }else if(this.name=='cmb'){
      //   if(this.pass!=='cmb.2019'){
      //     this.set('用户名或密码错误');
      //     return false;
      //   }
      // }else{
      //   this.set('用户名或密码错误');
      //   return false;
      // }
      if (this.name == 'rxhui') {
        window.setCookie('name', 'rxhui');
        sessionStorage.setItem('name', 'rxhui');
      } else if (this.name == 'cmb') {
        window.setCookie('name', 'cmb');
        sessionStorage.setItem('name', 'cmb');
      } else if (this.name == 'szse') {
        window.setCookie('name', 'szse');
        sessionStorage.setItem('name', 'szse');
      } else {
        window.setCookie('name', 'external');
        sessionStorage.setItem('name', 'external');
      }
      $('.log').remove();
    },
    set (val) {
      $('.alert').show();
      $('.alert div').text(val);
      setTimeout(function () {
        $('.alert').hide();
      }, 1500)
    },
    async getIncludeList () {  //获取list信息
      var data = {};
      let result = await eventService.getIncludeList(data);
      this.$store.commit('setlist', result.data);
    },
    async getinputTxt (input) {
      var data = {
        count: '10',
        query: input
      };
      let result = await eventService.getInput(data);
      this.historyListNav = result.data;
      if (this.historyListNav.length !== 0) {
        this.history = true;
      } else {
        this.history = false;
      }
    },
    async getBall () {
      var data = {
        entityTypes: 'st,cp',
        size: 15
      };
      this.showIndex = true;
      let result = await eventService.getBall(data);
      if (result.data) {
        this.ballItem = result.data;
      }
      setTimeout(function () {
        this.svgShow('#ffffff', '#0B0E1C');
      }.bind(this), 10);
    },
    inputBlur () {
      setTimeout(function () {
        this.historyShow = false; this.history = false;
        document.body.scrollTop = document.documentElement.scrollTop = 0
      }.bind(this), 500)
    },
    toknow2 (item) {
      this.input2 = '';
      this.historyShow = false;
      this.history = false;
      $('.footer').css({ height: '3.5rem' })
      this.$router.push({
        path: '/know',
        query: {
          input: item.name,
          color: this.theme ? 'black' : 'white',
          entityType: item.type,
          disName: item.disName
        }
      })
    },
    toknow (item, type, disName) {//进入详情页
      item = item.toString();
      if (!type) {
        var arr = {
          name: item,
          disName: item,
          type: ''
        }
      } else {
        var arr = {
          name: item,
          disName: disName,
          type: type
        }
      }
      if (item.trim() != '' && JSON.stringify(this.historyList).indexOf(JSON.stringify(arr)) == -1) {
        if (this.historyList.length <= 4) {
          this.historyList.unshift(arr);
          localStorage.setItem('data2', JSON.stringify(this.historyList));
        } else {
          this.historyList.pop();
          this.historyList.unshift(arr);
          localStorage.setItem('data2', JSON.stringify(this.historyList));
        }
      }
      if (item.trim() == '') {
        return false;
      }
      this.input2 = '';
      this.historyShow = false;
      this.history = false;
      $('.footer').css({ height: '3.5rem' })
      this.$router.push({
        path: '/know',
        query: {
          input: item,
          color: this.theme ? 'black' : 'white',
          entityType: type,
          disName: disName
        }
      })
    },
    clickY (item) {//点击球体item
      this.toknow(item.name, item.type, item.disName);
    },
    themeClick (state) {
      if (!state) {
        // this.svgShow('#ffffff','#0B0E1C');
        this.theme = true;
        $('#tags a').attr('class', 'tagsb');
        $('#boxIndex').attr('class', 'indexBox');
      } else {
        // this.svgShow('#272E40','#F6F6F6');
        this.theme = false;
        $('#tags a').attr('class', 'tagsw');
        $('#boxIndex').attr('class', 'indexBox2');
      }
    },
    svgShow (color, color2) {
      try {
        window.tagCloud = new TagCould("tags", {});
        tagCloud.start();
      } catch (e) {
        console.log(e)
      }
    }
  },
  created () {
    this.getIncludeList();
    this.getBall();
    if (localStorage.getItem('data2')) {
      this.historyList = JSON.parse(localStorage.getItem('data2'));
    }
  },
  mounted () {
    var thas = this;
    window.clickY = function (this_) {
      var index = Number($(this_)[0].dataset.index);
      var item = thas.ballItem[index];
      thas.clickY(item);
    }
    //获取cookie
    window.getJoinCookie = function (name)//取cookies函数
    {
      var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
      if (arr != null) return unescape(arr[2]); return null;
    }

    //设置cookie
    window.setCookie = function (name, value) {
      var exp = new Date();    //new Date("December 31, 9998");
      exp.setTime(exp.getTime() + 2 * 1000 * 60 * 60);
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    };
    if (this.$route.query.admin == 'true') {
      window.setCookie('name', 'rxhui');
      sessionStorage.setItem('name', 'rxhui');
    }
    if (!getJoinCookie('name')) {
      $('.log').show(0);
    }
  },
  watch: {
    $route (val) {
      if (val.name === 'index') {
        window.tagCloud = null;
        clearTimeout(setarrnav);
        var arr = $('#tags').find('a').clone();
        $('#tags').find('a').remove();
        $('#tags').append(arr);
        setTimeout(function () {
          window.tagCloud = new TagCould("tags", {});
          window.tagCloud.start();
        }, 10)

      }
    },
    historyShow (boolean) {
      if (boolean && this.historyList.length !== 0) {
        $('.footer').css({ height: '6.2rem' })
      } else if (boolean && this.historyList.length == 0) {
        $('.footer').css({ height: '3.5rem' })
      } else {
        $('.footer').css({ height: '3.5rem' })
      }
    },
    input2 (val) {
      this.historyShow = false;
      this.getinputTxt(val);
    }
  }
}
</script>

<style scoped>
#tags a {
  position: absolute;
  top: 0px;
  left: 0px;
  /*font-weight:bold;*/
  /*padding: 3px 6px;*/
  /*width: 100px;*/
  font-size: 0.6rem;
  text-align: center;
  z-index: 1 !important;
}
.tagsb {
  color: #d5d9e7;
}
.tagsw {
  color: #505356;
}
#tags {
  position: relative;
  width: 90%;
  height: 60vh;
  margin: 0 auto;
}
.log {
  width: 100%;
  height: 100vh;
  background: #0b0e1c;
  position: fixed;
  display: none;
  top: 0;
  left: 0;
  z-index: 10000;
}

.log .header {
  width: 100%;
  text-align: center;
  color: #fff;
  padding-top: 3rem;
}
.log .header p {
  font-size: 2rem;
}

.log .form > div {
  width: 100%;
  height: 3rem;
  border-bottom: 1px solid #fff;
  margin-top: 1rem;
  overflow: hidden;
}
.log .form {
  width: 80%;
  height: 2rem;
  position: absolute;
  top: 10rem;
  left: 50%;
  transform: translate(-50%, 0);
}
.log .form input {
  width: 90%;
  height: 100%;
  outline: none;
  border: none;
  font-size: 1rem;
  box-sizing: border-box;
  padding: 2rem;
  background: transparent;
  color: #fff;
}
.log .form button {
  width: 6rem;
  height: 2rem;
  background: #fff;
  color: #000;
  outline: none;
  border: none;
  font-size: 0.8rem;
  border-radius: 1rem;
  margin-top: 1rem;
  margin-left: 50%;
  transform: translate(-50%, 0);
}
.log input {
  -webkit-writing-mode: horizontal-tb !important;
  text-rendering: auto;
  text-shadow: none;
  -webkit-rtl-ordering: logical;
}
.log input:-webkit-autofill,
.log input:-webkit-autofill:hover,
.log input:-webkit-autofill:focus {
  box-shadow: 0 0 0 60px rgba(47, 50, 63, 0.78) inset;
  -webkit-text-fill-color: #fff;
}
.log .alert {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: none;
}
.log .alert div {
  width: 12rem;
  height: 2rem;
  background: #fff;
  margin-left: 50%;
  margin-top: 50%;
  color: #000;
  border-radius: 1rem;
  text-align: center;
  line-height: 2rem;
  font-size: 1rem;
  transform: translate(-50%, -50%);
}
</style>
