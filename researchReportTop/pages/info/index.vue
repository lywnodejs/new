<!--
 * @Date: 2018-12-26 15:46:12
 * @Author: 刘亚伟
 * @LastEditTime: 2019-03-04 17:52:42
 -->
<template>
    <div class="info_box">
        <!-- <header>
            <i class="iconfont icon-zuojiantou-01"></i>
            <p>资讯详情</p>
        </header> -->
        <div class="title" style="padding-top:0.3rem">
            {{title}}
        </div>
        <div class="info">
            <span>{{publishAt}}</span>
            <span>{{mediaFrom}}</span>
        </div>
        <div class="main" v-html="content"></div>
        <div class="xianguan" v-if="show">
             <div class="top">相关股票</div>
             <ul class="listTop">
                 <li>股票名称</li>
                 <li>现价</li>
                 <li>涨跌幅</li>
             </ul>
             <ul class="listBottom" v-for="(item,index) in items" :class="getclass(item.rise)" @click="toApp(item)">
                 <li> <span>{{item.stkName}}</span> <img src="../../static/info/images/sheng.png" alt="" v-show="item.stkCode.substr(0,1)!=6"> <img src="../../static/info/images/hu.png" alt="" v-show="item.stkCode.substr(0,1)==6"> <span class="num">{{item.stkCode}}</span> </li>
                 <li>{{item.newPrice.toFixed(2)}}</li>
                 <li v-if="item.rise!=0">{{item.rise.toFixed(2)}}% <i class="iconfont icon-arrow-up" v-show="item.rise>0"></i><i class="iconfont icon-arrow-down" v-show="item.rise<0"></i></li>
                 <li v-if="item.rise==0">--</li>
             </ul>
         </div>
         <div class="noData" v-show="nodata">
             <img src="../../static/e-html/images/nodata.png" alt="">
             <p>暂无相关数据</p>
         </div>
    </div>
</template>

<script>
import { to_date_info } from '../../lib/methods.js';
import { infoClientService , eventClientService ,quotaClientService_,IndustryClientService} from '../../service/client/index.js';
export default {
    layout: 'info',
	head: {
	  title: '知行日报',
    },
    data(){
        return {
            id:this.$route.query.id,
            title:'',
            content:'',
            publishAt:'',
            mediaFrom:'',
            show:false,
            nodata:false,
            items:[],
        }
    },
    methods: {
       async getData(){
            let info =await eventClientService.infoID(this.id);
            if(info.message.code==0){
                this.title=info.data.title;
                this.content=info.data.content;
                this.publishAt=to_date_info(info.data.publishAt);
                this.mediaFrom='来源： '+info.data.mediaFrom;
                this.nodata=false;
            }
        },
        async getData2(){
            var data={
                reportIds:this.id
            }
            try {
                let info =await IndustryClientService.getreport(data);
                if(info.message.code==0&&info.data.list[0].createAt!==''){
                    this.title=info.data.list[0].title;
                    this.content=info.data.list[0].summary;
                    this.publishAt=to_date_info(info.data.list[0].pubAt);
                    this.mediaFrom='来源：'+info.data.list[0].orgnizationName;
                    this.nodata=false;
                }else{
                    this.nodata=true;
                    this.show=false;
                }
            } catch (error) {
                this.nodata=true;
                this.show=false;
            }
        },
        async getData3(){
            var data={
                ids:this.id
            }
            let info =await eventClientService.getArticleList(data);
            if(info.message.code==0){
                this.title=info.data.objects.list[0].title;
                this.content=info.data.objects.list[0].content;
                this.publishAt=to_date_info(info.data.objects.list[0].publishAt);
                this.mediaFrom='来源：'+info.data.objects.list[0].mediaFrom;
                this.nodata=false;
                if($.isEmptyObject(info.data.objects.list[0].info.stockCodes)){
                    this.show_bottom=false;
                    return
                }
                var data=[];
                for(var i=0;i<info.data.objects.list[0].info.stockCodes.length;i++){
                    var item=info.data.objects.list[0].info.stockCodes[i];
                    data.push(item);
                }
                this.getguqiao(data);
            }
        },
        getData4(){
            var this_=this;
            var id=this.id;
            $.ajax({
                type: "get",
                url: `/legalProceeding/legal/detail/queryByCaseNumber?caseNumber=${id}`,
                dataType: "json",
                success: function (msg) {
                    if(msg.message.code!==0){
                        this_.nodata=true;
                        return;
                    }
                    if(msg.data){
                        var str=msg.data.crTxt;
                        var arr=str.split("\\r\\n");
                        if(arr.length==1){
                            arr=str.split("\\n\\t");
                        }
                        try {
                             if(arr.length==1){
                                arr=str.split("\\n");
                            }
                        } catch (error) {

                        }

                        var TXT='';
                        for(var i=0;i<arr.length;i++){
                            TXT+='<p>'+arr[i]+'<p/>';
                        }

                        this_.title=msg.data.crTitle;
                        this_.content=TXT;
                        this_.publishAt=to_date_info(msg.data.updateAt);
                        // this_.mediaFrom=''
                        this_.nodata=false;
                    }else{
                        this_.nodata=true;
                    }
                },
                error:function(){
                    this_.nodata=true;
                }
            });
        },
        async getData5(){
            var this_=this;
            var id=this.id;
            var signalType=this.$route.query.signalType;
            var data={
                crId:id,
                type:'focus',
                signalType:signalType
            };
             let info =await eventClientService.focus(data);
             if(info.message.code!==0||!info.data){
                 return this.nodata=true;
             }
             this.title=info.data.newsTitle;
             this.content=info.data.newsText||info.data.newsTextMe;
             this.mediaFrom='来源：'+info.data.newsSource;
             this.publishAt=to_date_info(Number(info.data.publishTime));
             this.nodata=false;
             if(this.$route.query.stocks){
                this.show=true;
                let obj = {};
                obj.symbol=this.$route.query.stocks;
                let info_ =await quotaClientService_.getQuotas(obj);
                if(info_.items.length!==0){
                    this.items=info_.items;
                    this.show=true;
                }else{
                    this.show=false;
                }
            }
        },
        async getData6(){
            var this_=this;
            var id=this.id;
            var signalType=this.$route.query.signalType;
            var data={
                crId:id,
                type:'industry',
                signalType:signalType
            };
            if(signalType=='积极信号'){
                let info =await eventClientService.focus(data);
                if(info.message.code!==0){
                    return this.nodata=true;
                }
                this.title=info.data.newsTitle;
                this.content=info.data.newsText||info.data.newsTextMe;
                this.mediaFrom='来源：'+info.data.newsSource;
                this.publishAt=to_date_info(Number(info.data.publishTime));
                this.nodata=false;
                let obj = {};
                obj.symbol=this.$route.query.stocks;
                let info_ =await quotaClientService_.getQuotas(obj);
                if(info_.items.length!==0){
                    this.items=info_.items;
                    this.show=true;
                }else{
                    this.show=false;
                }
            }
            if(signalType=='风险信号'){
                var data_={
                    industry:this.$route.query.industry,
                    size:1
                }
                let info =await eventClientService.recommend(data_);
                if(info.message.code!==0){
                    return this.nodata=true;
                }
                var getguqiaoCode=info.data[0].term;
                if(getguqiaoCode.substr(0,1)=='6'){
                    getguqiaoCode='sh'+getguqiaoCode;
                }else{
                    getguqiaoCode='sz'+getguqiaoCode;
                }
                var msg={
                    crId:id,
                    type:'industry',
                    signalType:signalType
                };
                let mes = await eventClientService.focus(msg);
                if(!mes.message){return this.nodata=true;};
                if(mes.message.code!==0){
                    return this.nodata=true;
                }else{
                    this.nodata=false;
                }
                if(!mes.data.newsTitle){return this.nodata=true;};
                this.title=mes.data.newsTitle;
                this.content=mes.data.newsText||mes.data.newsTextMe;
                this.mediaFrom='来源：'+mes.data.newsSource;
                this.publishAt=to_date_info(Number(mes.data.publishTime));
                let obj = {};
                obj.symbol=getguqiaoCode;
                let info_ =await quotaClientService_.getQuotas(obj);
                if(info_.items.length!==0){
                    this.items=info_.items;
                    this.show=true;
                }else{
                    this.show=false;
                }
            }
        },
        getData7(){
            var this_=this;
            var id=this.id;
            $.ajax({
                type: "get",
                url: `/legalProceeding/credit/detail/queryBySerialNumber?serialNumber=${id}`,
                dataType: "json",
                success: function (msg) {
                    if(msg.message.code!==0){
                        this_.nodata=true;
                        return;
                    }
                    if(msg.data){
                        var str_=msg.data.it0026_032;
                        var arr=str_.split("\\r\\n");
                        if(arr.length==1){
                            arr=str_.split("\\n\\t");
                        }
                        if(arr.length==1){
                            arr=str_.split("\n");
                        }
                        var TXT='';
                        for(var i=0;i<arr.length;i++){
                            TXT+='<p>'+arr[i]+'<p/>';
                        }
                        // var str=msg.data.it0026_032;
                        this_.title=msg.data.it0026_007;
                        this_.content=TXT;
                        this_.publishAt=to_date_info(msg.data.updateAt);
                        this_.nodata=false;
                    }else{
                        this_.nodata=true;
                    }
                },
                error:function(){
                    this_.nodata=true;
                }
            });
        },
        getData8(){
            var this_=this;
            var id=this.id;
            $.ajax({
                type: "get",
                url: `/auto/report/information/detail/${id}`,
                dataType: "json",
                success: function (msg) {
                    if(msg.message.code!==0){
                        this_.nodata=true;
                        return;
                    }
                    if(msg.data){
                        this_.title=msg.data.title;
                        this_.content=msg.data.content;
                        this_.publishAt=to_date_info(msg.data.publishAt);
                        this_.mediaFrom='来源：'+msg.data.mediaFrom;
                        this_.nodata=false;
                    }else{
                        this_.nodata=true;
                    }
                },
                error:function(){
                    this_.nodata=true;
                }
            });
        },
        async getguqiao(data){
            var item=[];
          for(var i=0;i<data.length;i++){
                if(data[i].substr(0,1)=='6'){
                    item.push('sh'+data[i].trim());
                }else{
                    item.push('sz'+data[i].trim());
                }
            }
            let obj = {};
            obj.symbol = item.join(",");
            let info =await quotaClientService_.getQuotas(obj);
            if(info.items.length!==0){
                this.items=info.items;
                this.show=true;
            }else{
                this.show=false;
            }
        },
        toApp(item){
            var parame={
                pageId:'hs_market_stock_detail',
                stockCode:item.stkCode
            }
            try {
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                    window.webkit.messageHandlers['routerNative'].postMessage(parame)
                } else if (/(Android)/i.test(navigator.userAgent)) {
                    window.contestapp.navigationNative(JSON.stringify(parame))
                }
            } catch (error) {
                console.log(error);
            }
        },
        getclass(data){
          if(data>0){
              return 'color_red'
          }else if(data<0){
              return 'color_green'
          }else{
              return ''
          }
      },
    },
    mounted() {
        if(this.$route.query.type==='政策'){
            this.getData();
        }else if(this.$route.query.type==='产业'){
            this.getData2();
        }else if(this.$route.query.type==='焦点'){
            this.getData3();
        }else if(this.$route.query.type==='LegalProceeding'){
            this.getData4();
        }else if(this.$route.query.type==='focus'){
            this.getData5();
        }else if(this.$route.query.type==='industry'){
            this.getData6();
        }else if(this.$route.query.type==='CreditIllegal'){
            this.getData7();
        }else if(this.$route.query.type==='宏观'){
            this.getData8();
        }else{
            this.nodata=true;
            $('.noData p').text('type错误或者id错误');
        }

        $('.main p').css({
            marginTop:'3rem'
        })
        setTimeout(function(){
            $('.main p').css({
            marginBottom:'0.6rem'
        })
        },300)
    },

}
</script>

<style>
html,body{
    overflow-x: hidden;
}
h1{
    line-height: 1.5rem;
    font-size: 0.7rem;
    font-weight: 400;
}
.info_box img{
    width: 100%;
}
</style>

<style scoped src="../../static/info/css/index.css"></style>
