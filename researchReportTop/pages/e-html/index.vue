<!--
 * @Date: 2018-12-27 17:27:03
 * @Author: 刘亚伟
 * @LastEditTime: 2020-03-11 11:40:52
 -->

<template>
  <div>
    <div class="top_nav"></div>
    <div class="top">
      <i class="iconfont icon-angle-left" @click="back_()"></i>
      <span v-show="!noData">{{topData.stkName}}-股权质押</span>
      <span class="right" @click="torisk()"  v-show="!noData">风险排行</span>
    </div>
    <header :class="getClass(topData.rise)" @click="to_App()" v-show="!noData">
      <p class="left">
        <span class="title">{{topData.stkName}}</span>
        <span class="gupiao">{{topData.stkCode}}</span><br>
        <span class="time font_num" v-show="!noData">{{time_ | time}}</span>
      </p>
      <p class="right">{{topData.newPrice}}</p>
      <p class="bottom">{{topData.change}} &nbsp; {{topData.rise}}%</p>
      <i class="iconfont icon-chevron-thin-right"></i>
    </header>

    <!-- 风险 -->
    <div class="fenxian" v-if="topItems!==''" v-show="!noData">
      <li v-show ='topItems.secTotriskLevel'>
        <span>总风险度</span>
        <span>{{topItems.secTotriskLevel}}级</span>
        <i></i>
      </li>
      <li v-show ='topItems.secPririskLevel'>
        <span>价格风险度</span>
        <span>{{topItems.secPririskLevel}}级</span>
        <i></i>
      </li>
      <li v-show ='topItems.secPleriskLevel'>
        <span>质押比率风险度</span>
        <span>{{topItems.secPleriskLevel}}级</span>
        <i></i>
      </li>
      <div class="clear"></div>
      <p>累计质押比例：{{pledgeRatio}}%</p>
      <p v-show="holdingRatio||holdingRatio!=0">控股股东累计质押比例：{{holdingRatio}}%</p>
    </div>
    <div class="clear"></div>
    <!-- 触达预警和平仓的质押 -->
    <div class="main_top" v-show="!noData" v-if="stopData.length!==0">
      <p>
        <span>触达预警和平仓的质押</span>
      </p>
      <div class="list" v-for="(item,index) in stopData">
        <ul>
          <p
            :class="item.newPAdjclose<=item.referWarnPrice&&item.newPAdjclose>item.referClosePrice? '':'hide'"
          >达预警线</p>
          <p
            :class="item.newPAdjclose<item.referClosePrice? '':'hide'"
          >达平仓线</p>
          <img
            class="icon_click"
            data-_click="true"
            src="../../static/e-html/images/icon_13.png"
            alt
            @click="popClick()"
          >
          <li>{{item.pubDt |time}}</li>
          <li>
            <span>股东名称</span>
            <span>{{item.sHolderName}}</span>
          </li>
          <li>
            <span>质押方</span>
            <span>{{item.sPledgor}}</span>
          </li>
          <li>
            <span>质押股数</span>
            <span>{{item.sPledgeShares | to_fixed}}万</span>
          </li>
          <li>
            <span>占总股本比</span>
            <span class="text">{{item.sPledgeShrRatio | to_fixed}}%</span>
            <span class="right">占持股比</span>
            <span>{{item.sPledgeHoldingRatio | to_fixed}}%</span>
          </li>
          <li>
            <span>预警线(估算)</span>
            <span class="text">{{item.referWarnPrice | to_fixed}}</span>
            <span class="right">平仓线(估算)</span>
            <span>{{item.referClosePrice | to_fixed}}</span>
          </li>
          <li>
            <span>质押日期</span>
            <span class="text">{{item.sPledgeBgdate |time}}</span>
            <span class="right">质押日收盘价</span>
            <span class="text" v-if="item.pledgeCost">{{item.pledgeCost |time}}</span>
            <span class="text" v-if="!item.pledgeCost">暂无</span>
          </li>
          <li>
            <span>解押日期</span>
            <span class="text" v-if="item.sPledgeEnddate">{{item.sPledgeEnddate |time}}</span>
            <span class="text" v-if="!item.sPledgeEnddate">暂无</span>
            <span class="zong">占总股本比
              <br>(累计)
            </span>
           <span class="zong_" v-if="item.sHoldingShrRatio">{{item.sHoldingShrRatio | to_fixed}}%</span>
            <span class="zong_" v-if="!item.sHoldingShrRatio">暂无</span>
          </li>
        </ul>
      </div>
      <div class="infinity all">
        <img
          src="../../static/e-html/images/infinity_03.jpg"
          alt
          @click="clickInfinity()"
          v-show="showBox"
        >
        <img src="../../static/e-html/images/all_10.png" alt @click="falseinfinity()">
      </div>
    </div>

    <!-- 当前存续的股权质押 -->
    <div class="main_top" v-if="stopData2.length!==0">
      <p>
        <span>当前存续的股权质押</span>
      </p>
      <div class="list" v-for="(item,index) in stopData2">
        <ul>
          <p
            :class="item.newPAdjclose<=item.referWarnPrice&&item.newPAdjclose>item.referClosePrice? '':'hide'"
          >达预警线</p>
          <p
            :class="item.newPAdjclose<=item.referClosePrice? '':'hide'"
          >达平仓线</p>
          <img
            class="icon_click"
            data-_click="true"
            src="../../static/e-html/images/icon_13.png"
            alt
            @click="popClick()"
          >
          <li>{{item.pubDt |time}}</li>
          <li>
            <span>股东名称</span>
            <span>{{item.sHolderName}}</span>
          </li>
          <li>
            <span>质押方</span>
            <span>{{item.sPledgor}}</span>
          </li>
          <li>
            <span>质押股数</span>
            <span>{{item.sPledgeShares | to_fixed}}万</span>
          </li>
          <li>
            <span>占总股本比</span>
            <span class="text">{{item.sPledgeShrRatio | to_fixed}}%</span>
            <span class="right">占持股比</span>
            <span>{{item.sPledgeHoldingRatio | to_fixed}}%</span>
          </li>
          <li>
            <span>预警线(估算)</span>
            <span class="text">{{item.referWarnPrice | to_fixed}}</span>
            <span class="right">平仓线(估算)</span>
            <span>{{item.referClosePrice | to_fixed}}</span>
          </li>
          <li>
            <span>质押日期</span>
            <span class="text">{{item.sPledgeBgdate |time}}</span>
            <span class="right">质押日收盘价</span>
            <span>{{item.pledgeCost | to_fixed}}</span>
          </li>
          <li>
            <span>解押日期</span>
            <span class="text" v-if="item.sPledgeEnddate">{{item.sPledgeEnddate |time}}</span>
            <span class="text" v-if="!item.sPledgeEnddate">暂无</span>
            <span class="zong">占总股本比
              <br>(累计)
            </span>
            <span class="zong_" v-if="item.sHoldingShrRatio">{{item.sHoldingShrRatio | to_fixed}}%</span>
            <span class="zong_" v-if="!item.sHoldingShrRatio">暂无</span>
          </li>
        </ul>
      </div>
      <div class="infinity all">
        <img
          src="../../static/e-html/images/infinity_03.jpg"
          alt
          @click="clickInfinity2()"
          v-show="showBox2"
        >
        <img src="../../static/e-html/images/all_10.png" alt @click="falseinfinity2()">
      </div>
    </div>
    <div class="nodata" v-show="noData"><img src="../../static/e-html/images/nodata.png" alt=""> <p>暂无相关信息</p></div>

    <!-- alert弹窗 -->
    <div class="alert">
      <div class="alert1">
        <img src="../../static/e-html/images/topbg_05.png" alt>
        <p>
          1.
          <span>总风险度</span>
          =风险度+质押比例风险>=7列入高风险
        </p>
        <p>
          2.
          <span>价格风险度</span>
          =当前质押品价格/质押时价格=5时列入高风险
        </p>
        <p>
          3.
          <span>质押比率风险度</span>
          =有风险的质押总数量/总股本=5列入高风险
        </p>
        <p>
          4.
          <span>累计质押比例:</span>
          >=60%为高风险
        </p>
        <p>
          5.
          <span>控股股东累计质押比例:</span>
          >=80%为高风险
        </p>
        <button class="off">我知道了</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  eventClientService,
  quotaClientService_
} from '../../service/client/index.js'
export default {
  layout: 'e-html',
  data() {
    return {
      holdingRatio: '',
      pledgeRatio: '',
      topData: {},
      noData:false,
      time_: '',
      obj: [],
      topItems: [],
      stopData: [],
      stopData2: [],
      stop: 2,
      stop2: 2,
      showBox: true,
      showBox2: true,
      tradeDt: '',
      lableTrtRiskList: [], // 触达预警和平场的质押
      trtRiskList: [] // 触达预警和平场的质押
    }
  },
  methods: {
    async getdata() {
      var data = {
        marType: this.$route.query.marType,
        secCode: this.$route.query.secCode
      }
      let info = await eventClientService.getcontroller(data);
      if(info.data==undefined){
         this.noData=true;
         return
      }
      try {
        if (info.message.code == 0) {
        if(info.data.lableTrtRiskList.length==0&&info.data.trtRiskList.length==0){
          this.noData=true;
          return
        }
        this.lableTrtRiskList = info.data.lableTrtRiskList;
        if(info.data.lableTrtRiskList.length!==0){
          this.time_ = this.lableTrtRiskList[0].tradeDt;
          this.tradeDt = this.lableTrtRiskList[0].tradeDt;
          if(info.data.lableTrtRiskList.length>=2){
            for (var i = 0; i < 2; i++) {
              this.stopData.push(this.lableTrtRiskList[i])
            }
          }else{
             for (var i = 0; i < 1; i++) {
              this.stopData.push(this.lableTrtRiskList[i])
            }
          }
        }
        this.pledgeRatio = info.data.pledgeRatio;
        this.holdingRatio = info.data.holdingRatio || 0;
        this.topItems = info.data.trtPTotRisk || '';
        this.trtRiskList = info.data.trtRiskList;
        if(info.data.trtRiskList.length!==0){
          for (var i = 0; i < 2; i++) {
            this.stopData2.push(this.trtRiskList[i])
          }
        }
        if (info.data.lableTrtRiskList.length <= 2) {
          this.showBox = false
        }
        if (info.data.trtRiskList.length <= 2) {
          this.showBox2 = false
        }
        }
      } catch (error) {
         this.noData=true;
      }
    },
    async getGuPiaoCode() {
      var data = {
        symbol: this.$route.query.marType + this.$route.query.secCode
      }
      let info = await quotaClientService_.getQuota(data)
      this.topData = info
    },
    clickInfinity() {
      var num = this.stop
      if (this.stop + 2 < this.lableTrtRiskList.length) {
        this.stop += 2
      } else if (this.stop + 1 <= this.lableTrtRiskList.length) {
        this.stop += 1
      }
      for (var i = num; i < this.stop; i++) {
        this.stopData.push(this.lableTrtRiskList[i])
      }
    },
    clickInfinity2() {
      var num = this.stop2
      if (this.stop2 + 2 < this.trtRiskList.length) {
        this.stop2 += 2
      } else if (this.stop2 + 1 <= this.trtRiskList.length) {
        this.stop2 += 1
      }
      for (var i = num; i < this.stop2; i++) {
        this.stopData2.push(this.trtRiskList[i])
      }
    },
    falseinfinity() {
      this.stopData = this.stopData.splice(0, 2)
      this.stop = 2
    },
    falseinfinity2() {
      this.stopData2 = this.stopData2.splice(0, 2)
      this.stop2 = 2
    },
    popClick() {
      var img = event.target
      if (
        $(img).attr('data_click') == undefined ||
        $(img).attr('data_click') == 'true'
      ) {
        $(img).attr('data_click', 'false')
        $(img)
          .parent()
          .parent()
          .animate(
            {
              height: '0.4rem'
            },
            200
          )
      } else {
        $(img).attr('data_click', 'true')
        $(img)
          .parent()
          .parent()
          .animate(
            {
              height: '9.64444rem'
            },
            200
          )
      }
      $(img).toggleClass('img_click')
    },
    getClass(val) {
      if (val > 0) {
        return 't_red'
      } else if (val < 0) {
        return 't_green'
      } else {
        return ''
      }
    },
    torisk() {
      this.$router.push({
        path: 'risk',
        query: {
          top:this.$route.query.top,
          hideBackIcon:this.$route.query.hideBackIcon
        }
      })
    },
    back_() {
      try {
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          window.webkit.messageHandlers['back'].postMessage('1')
        } else if (/(Android)/i.test(navigator.userAgent)) {
          window.contestapp.back()
        }
      } catch (error) {
        return
      }
    },
    to_App() {
      try {
        var data = this.topData.stkCode
        var data_ios = {
          pageId: 'hs_market_stock_detail',
          stockCode: data
        }
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          window.webkit.messageHandlers['routerNative'].postMessage(data_ios)
        } else if (/(Android)/i.test(navigator.userAgent)) {
          window.contestapp.gotoDetail(data)
        }
      } catch (error) {
        return
      }
    }
  },
  watch: {
    stop: function(val) {
      if (this.stop == this.trtRiskList.length) {
        this.showBox = false
      } else {
        this.showBox = true
      }
    },
    stop2: function(val) {
      if (this.stop2 == this.trtRiskList.length) {
        this.showBox2 = false
      } else {
        this.showBox2 = true
      }
    }
  },
  filters: {
    time: function(val) {
      if (val !== '') {
        try {
          var str =
            val.slice(0, 4) + '-' + val.slice(4, 6) + '-' + val.slice(6, 8)
        } catch (error) {
          return val
        }
      } else {
        return '--'
      }
      return str
    },
    to_fixed(val) {
      if (val) {
        return val.toFixed(2)
      } else {
        return ''
      }
    }
  },
  created() {
    this.getGuPiaoCode()
    this.getdata()
  },
  mounted() {
    var than=this;
    if(this.$route.query.hideBackIcon==1){
      $('.top .icon-angle-left').hide();
    }
    $('.fenxian li').click(function(e) {
      $('.alert').fadeToggle(200)
      $('html,body').css({
        overflow: 'hidden'
      })
    })
    $('.alert1 .off').click(function() {
      $('.alert').fadeToggle(200)
      $('html,body').css({
        overflow: 'auto'
      })
    });
    setTimeout(function(){
      var top=than.$route.query.top || 0;
      $('.top_nav').css({
        height:top+'px'
      })
      $('.top').css({
        top:top+'px'
      })
      $('header').css({
        marginTop:$('.top').height()+$('.top_nav').height()+'px'
      })
    },50)
  }
}
</script>

<style scoped src="../../static/e-html/css/index.css"></style>

