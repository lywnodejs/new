<template>
  <div class="app-wrap">
  <div class="app-container__header">
    <div class="app-container__header__nav">
      <app-header></app-header>
    </div>
  </div>
  <div class="sdl-home">

    <el-main class="content">
      <el-carousel :height="height" arrow='never' :interval="4000">
        <el-carousel-item v-for="item in 3" :key="item">
          <!-- <h3>{{ item }}</h3> -->
          <!-- <img src="" alt=""> -->
        </el-carousel-item>
      </el-carousel>


      <div class="sdl-box clearfloat">
        <p class="server">我们提供的服务</p>
        <p class="exp"><span>为滴滴软件全生命周期提供安全保障</span></p>
        <div class="flexBox clearfloat">
          <div class="items">
            <div class="box"><img src="../assets/sdl-icon/安全评估.png" alt=""></div>
            <p class="title">安全评估</p>
            <p>设计安全与代码安全专家建议<br>适用用户：RD</p>
            <button class="useOrder" @click="bounceUrl('163616033')">使用指南</button>
            <button class="interFunc" @click="changeUrl('/sdl/dorado')">进入功能</button>
            <!-- <p class="useOrder" @click="bounceUrl('163616033')">使用指南</p> -->
          </div>
          <div class="items">
            <div class="box"><img src="../assets/sdl-icon/黑盒扫描.png" alt=""></div>
            <p class="title">黑盒扫描</p>
            <p>自主研发的被动式漏洞扫描器<br>适用用户：RD、QA</p>
            <button class="useOrder" @click="bounceUrl('146620959')">使用指南</button>
            <button class="interFunc" @click="changeUrl('/sdl/octopus')">进入功能</button>
          </div>
          <div class="items">
            <div class="box"><img src="../assets/sdl-icon/白盒检测.png" alt=""></div>
            <p class="title">白盒检测</p>
            <p>源代码级静态安全分析引擎<br>适用用户：RD、QA</p>
            <button class="useOrder" @click="bounceUrl('180475681')">使用指南</button>
            <button class="interFunc" @click="changeUrl('/sdl/otter')">进入功能</button>
          </div>
        </div>
        <div class="flexBox clearfloat">
          <div class="items">
            <div class="box"><img src="../assets/sdl-icon/APP检测.png" alt=""></div>
            <p class="title">APP检测</p>
            <p>移动端、IoT安全检测服务<br>适用用户：RD、QA</p>
            <button class="useOrder" @click="bounceUrl('163616033')">使用指南</button>
            <button class="interFunc" @click="changeUrl('/sdl/ratel')">进入功能</button>
          </div>
          <div class="items">
            <div class="box"><img src="../assets/sdl-icon/知识培训.png" alt=""></div>
            <p class="title">知识培训</p>
            <p>漏洞知识、安全方案、培训视频<br>适用用户：RD、QA、OP</p>
            <button class="useOrder" @click="bounceUrl('163616033')">使用指南</button>
            <button class="interFunc" @click="changeUrl('/sdl/dolphin/vulnerability')">进入功能</button>
          </div>
          <div class="items1">

          </div>
        </div>
      </div>

      <div class="sdl-footer clearfloat">
        <div class="float-left">
          <h3>SDL平台</h3>
          <p>SDL平台提供软件安全开发生命周期的一站式服务，覆盖需求分析、系统设计、编码开发、测试部署、应急响应、研发培训等各个环节。
            SDL平台作为滴滴安全开发门户，为研发、测试、运维、安全共同参与软件安全建设提供入口，为滴滴软件安全生命周期提供安全保障。</p>
          <div class="feedback"><p>反馈邮箱：xxx@xxxxxxx.com</p></div>
        </div>
        <!-- <div class="QRcode"><img src="../assets/d-chatQRCode.png" alt="">
          <p>D-Chat反馈群</p></div>
        <div class="pic"><img src="../assets/SSTG-LOGO.png" alt="" srcset=""> -->
        <!-- </div> -->
      </div>

    </el-main>
  </div>
  </div>
</template>


<script>
  import appHeader from '@/components/header'

  export default {
    name: 'shouye',
    data() {
      return {
        path: 'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=163616033',
        clientWidth: document.body.clientWidth,
        height: document.body.clientWidth > 1536 ? document.body.clientWidth / 1920 * 500 + 'px' : '400px',
        imgs: [require('@/assets/sdl-banner.jpg'), require('@/assets/octopus.png'), require('@/assets/otter.png')]
      }
    },
    inject: ['reload'],
    components: {
      appHeader
    },
    mounted() {
      this.reload()
      let that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.clientWidth = window.screenWidth
        })()
      }
    },
    watch: {
      clientWidth(val) {
        if (!this.timer) {
            this.clientWidth = val
            this.timer = true
            let that = this
            if (this.clientWidth <= 1536) {
              this.height = '400px'
            } else {
              this.height = this.clientWidth / 1920 * 500 + 'px'
            }
            setTimeout(function() {
              that.timer = false
            }, 20)
        }
      }
    },
    methods: {
      changeUrl(url) {
        window.open(window.location.origin + url);
      },
      bounceUrl(url) {

        // let urll = 'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=' + url
        // window.open(urll)
        window.location.href = '/'
      }
    }
  }
</script>

<style lang='less'>

  .sdl-home {
    overflow: auto;
    // height: 100%;
    position: absolute;
    top: 60.5px;
    bottom:0;
    left: 0;
    right: 0;
    background-color: white;
    .content {
      padding: 0;
      margin-top: 0px;
      margin-bottom: -15px;
      @media screen and (min-width: 0px) and (max-width: 1536px) {
        .el-carousel__item:nth-child(3) {
          background: url('../assets/otter.png') no-repeat;
          background-size: 1536px 400px;
          background-position: center top 0px;
        }
        .el-carousel__item:nth-child(2) {
          background: url('../assets/octopus.png') no-repeat;
          background-size: 1536px 400px;
          background-position: center top 0px;
        }
        .el-carousel__item:nth-child(1) {
          background: url('../assets/sdl-banner.jpg') no-repeat;
          background-size: 1536px 400px;
          background-position: center top 0px;
        }
      }
      @media screen and (min-width: 1536px) and (max-width: 1920px) {
        .el-carousel__item:nth-child(3) {
          background: url('../assets/otter.png') no-repeat;
          background-size: 100% 100%;
          background-position: center top 0px;
        }
        .el-carousel__item:nth-child(2) {
          background: url('../assets/octopus.png') no-repeat;
          background-size: 100% 100%;
          background-position: center top 0px;
        }
        .el-carousel__item:nth-child(1) {
          background: url('../assets/sdl-banner.jpg') no-repeat;
          background-size: 100% 100%;
          background-position: center top 0px;
        }
      }
    }
    .explain:hover {
      color: #fc9153;
    }
    .sdl-box {
      margin-top: 50px;
      width: 100%;
      .server {
        text-align: center;
        font-family: "微软雅黑" !important;
        font-size: 20px;
        color: #333;
      }
      .exp {
        text-align: center;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
        color: #999;
        line-height: 30px;
        margin-bottom: 40px;
        span {
          -webkit-font-smoothing: antialiased;
        }
      }
      .flexBox {
        display: flex;
        margin-left: 200px;
        margin-right: 200px;
      }
      .items1 {
        justify-content: center;
        width: 180px;
        height: 183px;
        text-align: center;
        margin: 0 auto;
        margin-bottom: 40px;
        float: left;
      }
      .items {
        // transform: box-shadow 2s;
        justify-content: center;
        width: 180px;
        height: 193px;
        text-align: center;
        margin: 0 auto;
        margin-bottom: 40px;
        float: left;
        // margin-left: 80px;
        .box {
          width: 55px;
          height: 55px;
          margin: 10px auto;
          img {
            width: 55px;
            height: 55px;
          }
        }
        .title {
          font-size: 14px;
          color: #666;
          font-weight: 400;
        }
        p {
          -webkit-font-smoothing: antialiased;
          font-size: 12px;
          color: #999999;
        }
        .useOrder {
          -webkit-font-smoothing: antialiased;
          margin-top: 10px;
          margin-right: 5px;
          display: none;
          font-size: 12px;
          border: 1px solid #fc9153;
          color: #fc9153;
          padding: 2px 10px;
          border-radius: 5px;
          background: white;
        }
        .interFunc {
          -webkit-font-smoothing: antialiased;
          margin-top: 10px;
          margin-left: 4px;
          display: none;
          background: #fc9153;
          border: 1px solid #fc9153;
          color: white;
          font-size: 12px;
          padding: 2px 10px;
          border-radius: 5px;
          // font-weight: 100;
        }
      }
      .items:hover {
        transition: all .3s ease-in-out;
        -webkit-box-shadow: rgb(211, 210, 210) 0px 0px 7px;
        -moz-box-shadow: rgb(211, 210, 210) 0px 0px 7px;
        box-shadow: rgb(211, 210, 210) 0px 0px 7px;
        .border {
          display: block;
        }
        .useOrder {
          display: inline-block;
        }
        .interFunc {
          display: inline-block;
        }
      }
      .title:hover {
        color: #fc9153;
      }
      .useOrder:hover {
        cursor: pointer;
        color: #fc9153;
      }
      .interFunc:hover {
        cursor: pointer;
      }
    }
    .sdl-footer {
      height: 200px;
      // background: linear-gradient(to right, rgb(100, 100, 102), rgb(53, 53, 54));
      // background: rgb(53, 53, 54);
      background: #4a4a4a;
      -webkit-font-smoothing: antialiased;
      color: white;
      .float-left {
        float: left;
        margin-top: 37px;
        margin-left: 100px;
        h3 {
          // font-weight: normal;
          font-family: PingFangSC-Regular;
          font-size: 20px;
        }
        p {
          width: 520px;
          font-size: 12px;
          text-align: justify;
          color: #fff;
          // font-weight: 100;
          line-height: 15px;
          margin-top: 15px;
        }
      }
      .QRcode {
        float: left;
        margin-left: 30px;
        margin-top: 50px;
        width: 80px;
        height: 80px;
        img {
          width: 80px;
          height: 80px;
        }
        p {
          text-align: center;
          // font-weight: 100;
          font-size: 10px;
        }
      }
      .pic {
        float: right;
        margin-right: 100px;
        margin-top: 65px;
        img {
          width: 200px;
          height: 68px;
        }
      }
      .feedback {
        display: block;
      }
    }
  }

  // 清除浮动代码
  .clearfloat:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .clearfloat {
    zoom: 1;
  }
</style>
