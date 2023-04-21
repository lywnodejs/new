<!--
 * @Date: 2019-01-07 09:55:49
 * @Author: 刘亚伟
 * @LastEditTime: 2019-05-23 15:05:43
 -->
<template>
  <div>
    <div class="top_nav"></div>
    <div class="box_alert" v-show="alertShow">
      <div class="info">
        <i class="iconfont icon-cuo" @click="alertShow=false;"></i>
        行情热度：按照热点指数的涨跌幅排序，从行情上体现热度的变化。<br><br>市场热度：按照一周内相关舆情热度排序，体现市场对热点的情绪变化。
      </div>
    </div>
    <header>
      <i class="iconfont icon-angle-left" @click="back_()"></i>
      <span>发现热点</span>
      <img @click="alertShow=true;" src="../../static/e-html/images/wet.png" alt="">
        <nav>
          <div class="info" v-if="this.tabT">{{this.text[0]}} · {{this.textA[this.tabT_A]}} · {{this.textB[this.tabT_B]}}</div>
          <div class="info" v-if="!this.tabT">{{this.text[1]}} · {{this.textC[this.tabT_C]}}</div>
          <li :class="tabT? 'on':''" @click="tabclick(1)">行情热度 <span></span></li>
          <li :class="!tabT? 'on':''"  @click="tabclick(2)">市场热度 <span></span></li>
          <div class="list">
            <p>排序： <span @click="tabT_a(0)" :class="tabT_A==0? 'on' : ''">热度排序</span> <span :class="tabT_A==1? 'on' : ''" @click="tabT_a(1)">变化排序</span></p>
            <p>排序： <span  @click="tabT_c(0)" :class="tabT_C==0? 'on' : ''">热度排序</span> <span   @click="tabT_c(1)" :class="tabT_C==1? 'on' : ''">变化排序</span></p>
            <p>周期： <span @click="tabT_b(0)" :class="tabT_B==0? 'on' : ''">1日</span> 
                      <span @click="tabT_b(1)" :class="tabT_B==1? 'on' : ''">5日</span> 
                      <span @click="tabT_b(2)" :class="tabT_B==2? 'on' : ''">10日</span> 
                      <span @click="tabT_b(3)" :class="tabT_B==3? 'on' : ''">20日</span></p>
          </div>
        </nav>
    </header>
    <main class="main_list">
        <ul class="tlBox_hsList ul_box">
          <li class="row" v-for="(item, index) in items" @click="to_info(item)">
            <b></b>
            <i>HOTSPOT</i>
            <div class="box">
              <div class="hd">
                <h3>{{item.data.ranking<10? "0"+item.data.ranking : item.data.ranking}}</h3>
                <h4>{{item.data.hotName}} <span v-show="item.data.indexRateValue" :class="item.data.indexRateValue>0? 't_red_s':'t_green_s'">{{item.data.indexRateValue>0? '+'+item.data.indexRateValue+'%' : item.data.indexRateValue+'%'}}</span></h4>
                <h5 class="t_red" v-show="item.data.rankingChange>0"><span>热度变化：</span><em style="color:#e82c3a;">{{item.data.rankingChange}}</em><i class="iconfont icon-arrow-up"></i></h5>
                <h5 class="t_green" v-show="item.data.rankingChange<0"><span>热度变化：</span><em style="color:#00b167;">{{Math.abs(item.data.rankingChange)}}</em><i class="iconfont icon-arrow-down"></i></h5>
                <h5 v-show="item.data.rankingChange==0||!item.data.rankingChange">热度变化：-</h5>
              </div>
              <h6 style="margin-top:0.3rem;">{{item.data.introduction || '--'}}</h6>
              <!-- <div class="fd" v-show="!show_data"> -->
                <!-- <h6 class="hangqing_text">-- -->
                  <!-- <em></em>-- -->
                <!-- </h6> -->
                <!-- <h6 class="hangqing_text">-- -->
                  <!-- <em></em>-- -->
                <!-- </h6> -->
              <!-- </div> -->
              <div class="fd">
                <h6
                  class="hangqing_text"
                  v-show="item.guqiao[0]!=='--'"
                  @click.stop="toApp(item.guqiao[0],index)"
                >
                  <span>{{stkName[item.guqiao[0]]}}</span>
                  <em :class="getclass(rise[item.guqiao[0]])">{{toF(rise[item.guqiao[0]])}}</em>
                </h6>
                <h6
                  class="hangqing_text"
                  v-show="item.guqiao[1]!=='--'&&item.guqiao[0]!==item.guqiao[1]"
                  @click.stop="toApp(item.guqiao[1],index)"
                >
                  <span>{{stkName[item.guqiao[1]]}}</span>
                  <em :class="getclass(rise[item.guqiao[1]])">{{toF(rise[item.guqiao[1]])}}</em>
                </h6>
              </div>
            </div>
          </li>
        </ul>
    </main>
  </div>
</template>

<script>
import {checkVersion} from '../../lib/methods.js';
import {
  eventClientService,
  quotaClientService_
} from '../../service/client/index.js'
export default {
  layout:'e-html',
  data() {
    return {
      items: [],
      stkName: {},
      rise: {},
      text_data: [],
      cp: 1,
      ps: 20,
      hang_qing: [],
      istrue: true,
      isoff: false,
      alertShow:false,
      obj: {},
      show_data: true,
      hangqing_data: [],
      url:'',
      tabT:true,
      tabT_A:0,
      tabT_B:0,
      tabT_C:0,
      text:['行情热度','市场热度'],
      textA:['热度排序','变化排序'],
      textB:['1日','5日','10日','20日'],
      textC:['热度排序','变化排序'],
    }
  },
  methods: {
    infinite(done) {
      if (!this.istrue) {
        return false
      }
      this.getlist(this.cp)
    },
    get(){
      this.cp=1;
      this.items=[];
      this.hang_qing=[];
      this.getlist();
    },
    tabT_a(index){
      this.tabT_A=index;
      this.tabT_C=0;
      this.get();
    },
    tabT_b(index){
      this.tabT_B=index;
      this.tabT_C=0;
      this.get();
    },
    tabT_c(index){
      this.tabT_C=index;
      this.tabT_A=0;
      this.tabT_B=0;
      this.get();
    },
    tabclick(id){
      if(id==1){
        this.tabT=true;
        $('.list>p').eq(1).hide(0);
        $('.list>p').eq(0).show(0);
        $('.list>p').eq(2).show(0);
        $('main').css({
          marginTop:'201px'
        })
      }else{
        this.tabT=false;
        $('.list>p').eq(1).show(0);
        $('.list>p').eq(0).hide(0);
        $('.list>p').eq(2).hide(0);
        $('main').css({
          marginTop:'155px'
        });
        $('nav').css({
          height:'auto'
        })
      }
      this.get();
    },
    to_info(item) {
      var url = this.url+"/focus/focus-detail/?hotName="+item.data.hotName;
       var parame={
         pageId:'rh_node',
         url:url
       }
       
      var iosData={
        navigationStyle:'HsNavigationStatusNone',
        pageId:'rh_node',
        url:url
      }
      
      try {
          if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            if(!checkVersion('1.9.24',this.$route.query.appVersion)){
                iosData.pageId='webView';
                iosData.url=iosData.url+'&isIosOld=true'
            }
            window.webkit.messageHandlers['routerNative'].postMessage(iosData);
          } else if (/(Android)/i.test(navigator.userAgent)) {
            window.contestapp.routerNative(JSON.stringify(parame))
          }
      } catch (error) {
          return false;
      }

    },
    toApp(item,index){
        var data=item;
        var data_ios = {
          pageId: 'hs_market_stock_detail',
          stockCode: item
        }
      try {
          if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.webkit.messageHandlers['routerNative'].postMessage(data_ios);
          } else if (/(Android)/i.test(navigator.userAgent)) {
            window.contestapp.gotoDetail(data);
          }
      } catch (error) {
          return false;
      }
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
    async getlist() {
      this.istrue = false
      let data = {}
      data.cp = this.cp
      data.ps = this.ps;
      if(this.tabT){
          var arr=['QUOTATION_1_DAY','QUOTATION_5_DAY','QUOTATION_10_DAY','QUOTATION_20_DAY']
          data.type=arr[this.tabT_B];
        if(this.tabT_A==0){
          data.orderBy='ranking';
          data.sortDirection='asc';
        }
        if(this.tabT_A==1){
          data.orderBy='rankingChange';
          data.sortDirection='desc';
        }
      }else{
        if(this.tabT_C==0){
          data.orderBy='ranking';
          data.sortDirection='asc';
        }
        if(this.tabT_C==1){
          data.orderBy='rankingChange';
          data.sortDirection='desc';
        }
      }
      let result = await eventClientService.getEventList(data)
      this.show_data = false
      if(!result.data.list){return};
      if(result.data.list.length==0){return};
      if (result.message.status == 200) {
        this.istrue = true
        this.cp++
        this.hang_qing = []
        for (var i = 0; i < result.data.list.length; i++) {
          var gupiao = []
          if (result.data.list[i].stocks !== undefined) {
            if (result.data.list[i].stocks.length == 1) {
              this.hang_qing.push(result.data.list[i].stocks[0].trim())
              gupiao.push(result.data.list[i].stocks[0].trim())
              this.hang_qing.push('')
              gupiao.push('--')
            }else if(result.data.list[i].stocks.length == 2) {
              gupiao.push(result.data.list[i].stocks[0].trim())
              gupiao.push(result.data.list[i].stocks[1].trim())
              this.hang_qing.push(result.data.list[i].stocks[0].trim())
              this.hang_qing.push(result.data.list[i].stocks[1].trim())
            }else{
              gupiao = ['--', '--']
            }
          } else {
            gupiao = ['--', '--']
          }
          this.items.push({
            data: result.data.list[i],
            guqiao: gupiao
          })
        }
        this.get_hang_qing()
      }
    },
    async get_hang_qing() {
      var data = []
      for (var i = 0; i < this.hang_qing.length; i++) {
        if (this.hang_qing[i].trim().length < 6) {
          continue
        }
        if (this.hang_qing[i].trim().substr(0, 1) == '6') {
          data.push('sh' + this.hang_qing[i].trim())
        } else {
          data.push('sz' + this.hang_qing[i].trim())
        }
      }
      this.obj.symbol = data.join(',')
      let result = await quotaClientService_.getQuotas(this.obj)
      for (var i = 0; i < result.items.length; i++) {
        this.hangqing_data.push(result.items[i])
      }
      this.stkName = {}
      for (var i = 0; i < this.hangqing_data.length; i++) {
        var data = this.hangqing_data[i]
        this.stkName[data.stkCode] = data.stkName
        this.rise[data.stkCode] = data.rise
      }
      this.stkName['--'] = {
        stkName: '--',
        rise: '--'
      }
      this.isoff = true
      this.show_data = true
      console.log(this.items);
      
    },
    getclass(data) {
      if (data > 0) {
        return 't_red'
      } else if (data < 0) {
        return 't_green'
      } else {
        return ''
      }
    },
    toF(val) {
      if (val > 0) {
        return '+' + Math.abs(val).toFixed(2) + '%'
      } else if (val < 0) {
        return '-' + Math.abs(val).toFixed(2) + '%'
      } else {
        return Math.abs(val).toFixed(2) + '%'
      }
    }
  },
  filters:{
      text(val){

      }
  },
  mounted() {
    var url=window.location.href;
    if(url.indexOf('c-project.rxhui.com')!=-1){
        this.url='https://mezt.rxhui.com';
    }else if(url.indexOf('10.0.0.105:8086')!=-1){
      this.url='http://mezt-staging.rxhui.com';
    }else{
      this.url='http://mezt-dev.rxhui.com';
    }
    
    this.getlist();
    var this_=this;
    setTimeout(function(){
      var heightNav=$('nav').height();
        $(document).on('scroll',function(){
          if($(document).scrollTop()<$('header').height()+$('.top_nav').height()+$('nav').height()+15){
            $('nav').css({
              height:heightNav-$(document).scrollTop()
            })
            if(!this_.tabT){
              $('nav').css({
              height:'auto'
            })
            }
            $('nav .info').hide(0);
          }
          if($(document).scrollTop()>$('header').height()+$('.top_nav').height()+$('nav').height()+15){
            $('nav').css({
              height:'1.8rem'
            })
            $('nav .info').show(0);
          }
          
            var ul_height=$('.ul_box').height();
            var scroll_height_=$('.ul_box').offset().top-($(window).scrollTop()+$(window).height());
            if(ul_height+scroll_height_<=10){
                this_.infinite();
            }
    });
    },100);
    setTimeout(function(){
      var top=this_.$route.query.top || 0;
      $('.top_nav').css({
        height:top+'px'
      })
      $('header').css({
        top:top+'px'
      })
      $('main').css({
        marginTop:$('header').height()+$('.top_nav').height()+$('nav').height()+15+'px'
      })
    },50)
  }
}
</script>


<style src="../../static/e-html/css/list.css" scoped></style>

