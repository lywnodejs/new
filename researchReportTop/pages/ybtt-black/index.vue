<!--
 * @Date: 2018-12-17 10:52:31
 * @Author: 刘亚伟
 * @LastEditTime: 2019-01-07 15:07:16
 -->

<template>
<div class="index_box">
  
  <div class="infinfty_top">
    <div class="la">
      <img src="../../static/ybtt-black/images/load_04.png" alt=""> 释放刷新
    </div>
    <div class="jz">
      <img src="../../static/ybtt-black/images/gx_08.png" alt=""> 更新中...
    </div>
  </div>

  <div class="">

    <!-- ----------------------------------头部---------------------------- -->
    <!-- <Header/> -->

    <!-- --------------------------------banner-------------------------------------- -->
    <div class="banner">
      <dl>
        <dt>{{time.day}}</dt>
        <dd>{{time.week}}</dd>
        <dd>{{time.year}}</dd>
      </dl>
      <p>近一周更新了<span>{{numBox}}</span>篇研报，精炼出<span>{{length}}</span>条内容</p>
    </div>

    
    <!-- ------------------------------链表-------------------------------- -->
    <main>
      <div class="nav">
        <ul>
          <li v-for="(item,index) in li_item" 
            :class="nav_index==index? 'border_nav' : '' "
            @click="nav_click(index)">
            {{item.cn}}<span>({{item.count}})</span>
          </li>
        </ul>
      </div>
      <div class="clear"></div>
      <li v-for="(item,index) in items"
          @click='to_info(item)'>
        <h3>{{item.knowledgeTypeName}}</h3>
        <p :class="getclass(item.rise)">
          <span>{{item.entityRightOri}}</span>
          <span>&nbsp;({{item.entityRight}})</span>
          <span v-if='item.rise<0&&item.newPrice!==0'>{{item.rise | tofixed}}%</span>
          <span v-if='item.rise>0&&item.newPrice!==0'>+{{item.rise | tofixed}}%</span>
          <span v-if='item.rise==0&&item.newPrice!==0'>0.00%</span>
          <span v-if="item.newPrice!==0">{{item.newPrice | tofixed}}</span>
          <span v-if="item.newPrice==0&&item.rise==0">停牌</span>
        </p>
        <div class="clear_float"></div>
        <h6
          style="overflow: hidden;text-overflow:ellipsis;display: -webkit-box;-webkit-line-clamp: 4;-webkit-box-orient: vertical;">
          {{item.text}}</h6>
        <div class="bottom_right">
          <span>{{item.organization}}</span>&nbsp;
          <span>{{item.publishTime | to_date}}</span>
        </div>
      </li>
      <div class="sk-circle login_" v-show="login">
          <div class="sk-circle1 sk-child"></div>
          <div class="sk-circle2 sk-child"></div>
          <div class="sk-circle3 sk-child"></div>
          <div class="sk-circle4 sk-child"></div>
          <div class="sk-circle5 sk-child"></div>
          <div class="sk-circle6 sk-child"></div>
          <div class="sk-circle7 sk-child"></div>
          <div class="sk-circle8 sk-child"></div>
          <div class="sk-circle9 sk-child"></div>
          <div class="sk-circle10 sk-child"></div>
          <div class="sk-circle11 sk-child"></div>
          <div class="sk-circle12 sk-child"></div>
        </div>
    </main>
  </div>
</div>
</template>

<script>
  import Header from '../../components/ybtt/header.vue';
  import { to_date } from '../../lib/methods.js';
  import { eventClientService , quotaClientService } from '../../service/client/index.js';

  export default {
    layout: 'index',
    head: {
      title: '研报头条'
    },
    components: {
      Header
    },
    data() {
      return {
        nav_index: 0, //nav的当前index
        items: [],
        items_:[],
        isclick:true,
        cp:1,
        length:0,
        show:false,
        off:false,
        data:[],
        GuPiaoCode:[],//股票代码
        GuPiao:[],//股票代码值
        obj:{},
        left:0.5,//left值
        stop:1,//步长
        login:false,
        li_item:[],
        autoget:false,
        noclick:true,
        numBox:0,//总条数
        time: {   //时间
          year: '',
          day: '',
          week: '',
          preDate: ''
        }
      }
    },
    methods: {
      to_info(item) {
        if(!this.noclick) return; 
        var msg={
          pageId:"rh_h5",
          pageParameters:{
            title:item.knowledgeTypeName,
            url:"http://"+window.location.host+'/ybtt-black/info?id='+item.indexID
          }
        }
      if(/(TGPZS)/i.test(navigator.userAgent)){
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            msg.pageId='webView';
            window.webkit.messageHandlers['routerNative'].postMessage(msg);
            return 
        }else if (/(Android)/i.test(navigator.userAgent)) {
            window.contestapp.routerNative(JSON.stringify(msg));
            return 
        }
      }
        // sessionStorage.setItem('info',JSON.stringify(arr));
        sessionStorage.setItem('navIndex',this.nav_index);
        this.$router.push({
          path: 'info',
          query:{
            index:this.nav_index,
            id:item.indexID
          }
        })
      },
      nav_click(index){//当点击nav的li后nav的left值变化
      if(!this.isclick){
        return
      }
      	this.nav_index =index;
        $('.nav').removeClass('li_click');
        $('.nav').css({
            'box-shadow': 'none'
          });
        $('.show_li').attr('data_click', 'true');
      },
      infinite(){ //加载更多
        var type=this.li_item[this.nav_index].term;
        this.getData(type);
      },
      async reportInfo(){
        	let data = {};
          data.kindId='0200';
          data.ps=1;
          data.start = this.time.preDate;
        let info = await eventClientService.reportInfo(data);
        this.numBox=info.data.totalCount;
      },
      async getsearchN(){
      	let data = {}
        data.begin = this.time.preDate;
        data.facetFields='knowledgeType';
        data.facetSize=100;
        data.ps=0;
      	let info = await eventClientService.searchN(data);
      	this.li_item=info.data.facetResults[0].entries;
      	this.li_item.forEach(function(item,index){
      		if(item.term=='COMPANY_SUMMARY_MAIN_POINT'){
            this.length=item.count
      			item.cn='全部';
      		}else if(item.term=='FINANCIAL_STATEMENTS_REVIEW'){
      			item.cn='财报点评';
      		}else if(item.term=='TECHNICAL_BREAKTHROUGH'){
      			item.cn='技术突破';
      		}else if(item.term=='PRODUCT_INNOVATION'){
      			item.cn='产品创新';
      		}else if(item.term=='BUSINESS_ADJUSTMENT'){
      			item.cn='业务调整';
      		}else if(item.term=='MARKET_EXPANSION'){
      			item.cn='市场拓展';
      		}else if(item.term=='INCOME_STRUCTURE'){
      			item.cn='收入结构';
      		}else if(item.term=='COST_COMPOSITION'){
      			item.cn='成本构成';
      		}else if(item.term=='SALES_MODEL'){
      			item.cn='销售模式';
      		}else if(item.term=='MARKET_SHARE_INCREASE'){
      			item.cn='市占率提升';
      		}else if(item.term=='MAIN_CUSTOMER'){
      			item.cn='主要客户';
      		}else if(item.term=='REORGANIZATION_MERGER_ACQUISITION'){
      			item.cn='重组并购';
      		}else if(item.term=='DEVELOPMENT_COOPERATION'){
      			item.cn='发展合作';
      		}else if(item.term=='EQUITY_INCENTIVE'){
      			item.cn='股权激励';
      		}else if(item.term=='COMPANY_MAIN_BUSINESS'){
      			item.cn='公司主营';
      		}else if(item.term=='COMPETITIVE_ADVANTAGE,'){
      			item.cn='竞争优势';
          }
          this.autoget=true;
      	}.bind(this))
      },
      async getData(type) { //获取数据
      this.isclick=false;
        this.login=true;
        this.off=false;
        let data = {}
        data.begin = this.time.preDate;
        data.ps=15;
        data.cp=this.cp;
        let info = await eventClientService.industry(type, data);
        if (info.message.code == 0) {
          if (info.data.length !== 0) {
            this.cp++;
            this.show=true;
            this.items_=info.data;
            this.GuPiaoCode=[];
            info.data.forEach( function(item, index) {
              this.GuPiaoCode.push(item.entityRight[0]);
            }.bind(this));
            this.getGuPiaoCode();
          }else{
            this.show=false;
            this.off=false;
            this.login=false;
              return; 
          }
        }
      },
      async getGuPiaoCode(){
        var data=[];
        for(var i=0;i<this.GuPiaoCode.length;i++){
          if(this.GuPiaoCode[i].trim().length<6){
            continue ;
          }
          if(this.GuPiaoCode[i].trim().substr(0,1)=='6'){
            data.push('sh'+this.GuPiaoCode[i].trim());
          }else{
            data.push('sz'+this.GuPiaoCode[i].trim());
          }
        }
        this.obj.symbol=data.join(',');
        let info = await quotaClientService.getQuota(this.obj);
        if(info.items.length!==0){
          this.off=true;
          this.show=true;
          this.login=true;
        }else{
          this.off=false;
          this.show=false;
          this.login=false;
        }
         if (info.items.length <5) {
            this.show=false;
            this.off=false;
            this.login=false;
          }
        for(var i=0;i<this.items_.length;i++){
          if(!info.items[i]){
            info.items.splice(i,0,{newPrice:0,rise:0})
          }
          if('newPrice' in info.items[i] !=-1){
            this.items_[i].newPrice=info.items[i].newPrice;
          }else{
            this.items_[i].newPrice='--';
          }
          // this.items_[i].newPrice=info.items[i].newPrice;
          this.items_[i].rise=info.items[i].rise;
          this.items_[i].entityRightOri=this.items_[i].entityRightOri[0]
          this.items_[i].entityRight=this.items_[i].entityRight[0];
        }
        this.GuPiao.push(info.items);
        // this.items=this.items_;
        for(var i in this.items_){
          this.items.push(this.items_[i]);
        }
        this.isclick=true;

        $('.index_box').animate({
            paddingTop:'0rem'
        })
        setTimeout(function(){
          $('.jz').hide(0);
          $('.la').show(0);
        },300)
        
      },
      time_() {
        var date = new Date(),
            week_ = ['日', '一', '二', '三', '四', '五', '六']
        this.time.day = date.getDate();
        this.time.week = '星期' + week_[date.getDay()]
        this.time.year = date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
        this.time.preDate = date.getTime() - (24 * 60 * 60 * 1000)*7//七天前
        // this.time.preDate = 0//前一天
      },
      getclass(val){
          if(val>0){
              return 't_red'
          }else if(val<0){
              return 't_green'
          }else{
              return ''
          }
      },
    },
    filters: {
      to_date: function(val) {
        return to_date(val)
      },
      tofixed: function(val) {
      	if(val){
      		return val.toFixed(2)
      	}
      }
    },
    watch:{
    	nav_index:function(index){
        this.cp=1;
        this.items=[];
        this.getData(this.li_item[index].term);
    		if(index<3){
          this.left=0.5;
          this.stop=1;
    		}else{
          this.stop=index-1;
          if(index>=this.li_item.length-2){
            this.left=-(5*(this.li_item.length-5)+4.5);
            // this.stop=this.li_item.length-3;
          }else{
            this.left=-(5*(index-3)+4.5);
          }
    		}
    		setTimeout(function(){
    			$('.nav ul').css({
    				'left': this.left + 'rem'
    			})
    		}.bind(this),100)
    	}
    },
    created(){
      this.time_();
      this.reportInfo();
      this.getsearchN();
      this.getData('COMPANY_SUMMARY_MAIN_POINT');//全部
      this.$store.commit("ybtt/getTitle",'研报头条');
    },
    mounted() {
      $('html,body').css({
        'background':'#191a22',
        height:'120vh'
      })
    var this_=this;
      // setInterval(function(){
      //   if(sessionStorage.getItem('navIndex')&&this.autoget){
      //     setTimeout(function(){
      //       this.nav_index=sessionStorage.getItem('navIndex');
      //       this.autoget=false;
      //     }.bind(this),300)
      //   }
      // }.bind(this),50)
      var this_ = this

      //判断nav是否固定-----------------
      var nav_top_ = $('.banner').height();
      var Top_ = $(window).scrollTop();
      nav_scroll()
      $(window).scroll(function() {
        Top_ = $(window).scrollTop();
        nav_scroll();
         var ul_height=$('main').height();
        var scroll_height_=$('main').offset().top-($(window).scrollTop()+$(window).height());
        if(ul_height+scroll_height_<=10){
          if(!this_.off) return ;
          this_.infinite();
        }
      })
      function nav_scroll() {
        if (Top_ >= nav_top_) {
          $('.nav').css({
            'position': 'fixed',
            'top': '0rem',
          })
          $('main').css({
            paddingTop:'4.5rem'
          })
        } else {
          $('.nav').css({
            'position': '',
            'top': '0rem',
          })
          $('main').css({
            paddingTop:'0rem'
          })
        }
      }

      //----------------------------------------
      var div=window;
        var start=0,move=0,top=0,move_;
        div.addEventListener("touchstart",function(e){
          top=parseInt($('.index_box').css('margin-top'))
         var t=e.touches[0];
            start=t.clientY;
        },false)
        div.addEventListener("touchmove",function(e){
          var t=e.touches[0];
          move=t.clientY;
          if($(window).scrollTop()==0&&move>start){
            move_=(move-start)/3;
            $('.index_box').css({
              paddingTop:top+move_+'px'
            })
          }
        },false)
        div.addEventListener("touchend", function(e){
          if($(window).scrollTop()==0&&move>start&&move-start>250){
            $('.la').hide(0);
            $('.jz').show(0);
            $('.index_box').animate({
                paddingTop:'2.4rem'
            })
            this_.cp=1;
            this_.items=[];
            this_.getData(this_.li_item[this_.nav_index].term);
            move=0;start=0;
          }else{
            $('.index_box').animate({
                paddingTop:'0rem'
            })
          }
        } ,false)
      //----------------------------------
    }
  }
</script>
<style scoped src='../../static/ybtt-black/css/index.css'></style>

