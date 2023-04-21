<template>
    <div :class="theme == 'black' ? 'knowBox' :'knowBox2'" id="knowBox">
<!--        <div class="knowheader">-->
<!--            <i class="iconfont iconback_"></i>-->
<!--        </div>-->
        <div class="knowheader">
            <div class="inpBox">
                <i class="iconfont iconback_" @click="back()"></i>
                <input style="font-weight: 600;font-size: 1.2rem;" type="text" v-model="input2" disabled>
            </div>
            <i v-show="!showInfo" class="iconfont iconsearch" @click="showAlert()"></i>
        </div>
<!--        切换按钮-->
        <i id="databack" onclick="databackCLick()" :class="theme == 'black' ? 'backdata' : 'backdata2' " class="iconfont iconback_"></i>
        <div class="iconBut">
            <i :class="showInfo? 'iconguanxitu':'iconliebiao'" class="iconfont" @click="butinfo()"></i>
        </div>
        <div class="alertInfoBox" v-show="showInfo">
            <know-list :knowData="this.knowData"/>
        </div>

        <div class="knowSvg">

        </div>

        <div class="footer" :class="showInp? 'alertInp':'' ">
            <div class="history" v-show="history">
                <div class="linkLi" v-for="(item,index) in historyListNav"><li><p @click="reData2(item.baseName,item.type,item.label)">{{item.label}}{{item.type=='st'? ' ('+item.baseName +')':''}}</p> <i class="iconfont iconarrow-left-bottom"></i></li></div>
            </div>
            <p v-show="historyList.length!==0 && historyShow">历史搜索 :</p>
            <div v-show="historyList.length!==0 && historyShow" class="scroll"><span v-for="(item,index) in historyList" @click="reData2(item.name,item.type,item.disName)">{{item.disName}}</span></div>
            <div class="inpBox">
                <i class="iconfont iconsearch"></i>
                <input v-model="input" id="text" ref="text" type="text" placeholder="输入你想了解的公司、行业" @keyup.enter="reData2(input)" @focus="focueInp()" @blur="inputBlur()">
            </div>
            <button @click="reData2(input)">搜索</button>
        </div>

        <div :class="theme=='white' ? 'alertBox2':'alertBox'" id="alertBox_3">
                <div class="top">
                    <i class="iconfont iconclose"></i>
                    <span>公司高管</span>
                    <i id="alertBox_3_i" class="iconfont iconguanxitu">   展开</i>
                </div>
                <div class="content">
                    <h4 style="margin-top: 1rem;margin-bottom: 0.6rem;"><span></span></h4>
                    <p style="line-height: 1.6rem;"></p>
                    <h4 style="margin-top: 1.6rem;margin-bottom: 0.6rem;"><span></span> </h4>
                    <p></p>
                </div>
            <button>公司详细报告</button>
        </div>

        <div class="alertExternal">
            <div>
                <p>您已达到每日50次体验上限</p>
                <p>您的帐户已达到7天体验上限，获得更多权益请电联：010-59370700</p>
                <button @click="back()">我知道了</button>
            </div>
        </div>

        <div id="loading">
            <div class="mop-load-1" style="text-align: center;"><div class="mop-load-div"><div class="mop-css-1 double-bounce"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div></div>
        </div>
    </div>
</template>

<script>
  import {nodeService, eventService} from '../service/index'
  import knowList from "./knowList";

  export default {
    name: 'know',
    components: {knowList},
    data() {
      return {
        knowData:{},
        history: false,
        showInp: false,
        showInfo: false,
        theme: this.$route.query.color,
        input: '',
        input2: this.$route.query.disName || this.$route.query.input,
        disName: this.$route.query.disName,
        historyListNav: [],
        historyList: [],
        historyShow: false,
      }
    },
    methods: {
      showAlert() {
        this.showInp = true;
        this.$refs.text.focus();
      },
      focueInp(){
        this.historyShow=true;
        // setTimeout(function () {
        //   $(window).scrollTop(0);
        // },200)
      },
      butinfo() {
        this.showInfo = !this.showInfo;
        this.knowData = window.knowData;
        if (this.theme == 'white') {
          if(this.$route.query.color=='white'){return}
          this.theme = 'black'
        } else {
          this.theme = 'white'
        }
      },
      inputBlur() {
        setTimeout(function () {
          this.historyShow = false;
          this.showInp=false;
          this.history=false;
          document.body.scrollTop = document.documentElement.scrollTop = 0
        }.bind(this), 500)
      },
      back() {
        window.history.back();
      },
      async getinputTxt(input) {
        var data = {
          count: '10',
          query: input
        };
        let result = await eventService.getInput(data);
        this.historyListNav = result.data;
        if (this.historyListNav.length !== 0 && this.showInp==true) {
          this.history = true;
        } else {
          this.history = false;
        }
      },
      reData2(item,type,disName){
        if(!type){
          var arr = {
            name:item,
            disName:item,
            type:''
          }
        }else {
          var arr = {
            name: item,
            disName: disName,
            type: type
          }
        }
        if(item.trim() !='' && JSON.stringify(this.historyList).indexOf(JSON.stringify(arr))==-1){
          if(this.historyList.length<=4){
            this.historyList.unshift(arr);
            localStorage.setItem('data2',JSON.stringify(this.historyList));
          }else{
            this.historyList.pop();
            this.historyList.unshift(arr);
            localStorage.setItem('data2',JSON.stringify(this.historyList));
          }
        }
        this.reData(arr.name,arr.type,arr.disName);
      },
      async reData(val, type, name) {
        // this.input = name;
        this.input2 = name;
        // var data = {
        //   type: 'knowAtlas',
        //   color: this.$route.query.color,
        //   disName: name,
        //   entityType: type,
        //   showtext: false,
        //   input: val,
        // }
        // let res = await nodeService.gettemplate(data);

        let modeParams = {};
        modeParams.color = this.$route.query.color;
        modeParams.dataTypes = "knowledgeGraph";
        modeParams.type = "knowledgeGraph";
        modeParams.disName = name;
        modeParams.entityType = type;
        modeParams.showtext = false;
        modeParams.admin=sessionStorage.getItem('name');
        var valB = parseInt(val)+'';
        if(valB != 'NaN'){
            if(val[0]!='6'){
                val = 'sz'+val
            }else{
                 val = 'sh'+val
            }
        }
        modeParams.input = val;
        let data = {
          d:"",
          chartId: "",
          qp: JSON.stringify(modeParams)
        };
        let res = await nodeService.getNodeTemplatePost(data);
        this.history = false;
        $('#text').blur();
        $('.knowSvg').html(res);
        $('.knowSvg #main').css({height:$('html,body').height()});
        this.knowData = window.knowData;
        this.input='';
      },
      async template() {
        // var data = {
        //   type: 'knowAtlas',
        //   color: this.$route.query.color,
        //   input: this.$route.query.input,
        //   disName: this.disName,
        //   showtext: false,
        //   entityType: this.$route.query.entityType
        // }
        // let res = await nodeService.gettemplate(data);
        let modeParams = {};
        modeParams.color = this.$route.query.color;
        modeParams.disName = this.disName;
        modeParams.dataTypes = "knowledgeGraph";
        modeParams.type = "knowledgeGraph";
        modeParams.entityType = this.$route.query.entityType;
        modeParams.showtext = false;
        modeParams.admin=sessionStorage.getItem('name');
        modeParams.input = this.$route.query.input;
        let data = {
          d:"",
          chartId: "",
          qp: JSON.stringify(modeParams)
        };
        let res = await nodeService.getNodeTemplatePost(data);
        $('.knowSvg').html(res);
        $('.knowSvg #main').css({height:$('html,body').height()});

      }
    },
    mounted() {
      var that = this;
      that.template();
      if (localStorage.getItem('data2')) {
        this.historyList = JSON.parse(localStorage.getItem('data2'));
      }
      //获取cookie
      window.getJoinCookie=function(name)//取cookies函数
      {
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) return unescape(arr[2]); return null;
      }

      window.setCookie=function(name, value) {
        var exp  = new Date();    //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + 2*1000*60*60);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
      };

      if(this.$route.query.admin=='true'){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger"){
          $('.knowheader .iconback_').show(0);
        }else{
          $('.knowheader .iconback_').hide(0);
        }
      }

      if(!getJoinCookie('name')){
        if(this.$route.query.admin=='true'){
          window.setCookie('name','rxhui');
          return
        }
        window.location.href='https://kg.rxhui.com';
      }

    },
    watch: {
      historyShow(boolean) {
        if (boolean && this.historyList.length !== 0) {
          $('.footer').css({height: '6.2rem'})
        } else if (boolean && this.historyList.length == 0) {
          $('.footer').css({height: '3.5rem'})
        } else {
          $('.footer').css({height: '3.5rem'})
        }
      },
      input(val) {
        this.historyShow=false;
        this.getinputTxt(val);
      }
    }
  }
</script>

<style scoped>
.alertExternal{
    width: 100%;
    height: 100%;
    background: rgba(17, 15, 13, 0.79);
    z-index: 1000;
    position: fixed;
    top: 0;
    display: none;
}
.alertExternal > div{
    width: 50%;
    height: auto;
    background: #ffffff;
    position: absolute;
    border-radius: 1rem;
    top: 50%;
    left: 50%;
    font-size: 1rem;
    text-align: center;
    line-height: 1.4rem;
    padding: 1rem;
    box-sizing: border-box;
    transform: translate(-50%,-50%);
}
    .alertExternal div p{
        display: none;
    }
    .alertExternal button{
        padding: 0.4rem 0.8rem;
        border-radius: 0.2rem;
        margin-top: 0.6rem;
        border: none;
        outline: none;
        color: #ffffff;
        font-size: 0.9rem;
        background: #3E85FF;
    }
</style>
