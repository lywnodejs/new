<!--
 * @Date: 2018-12-26 15:46:12
 * @Author: 刘亚伟
 * @LastEditTime: 2019-05-31 16:18:20
 -->
<template>
    <div class="info_box">
        <!-- <header>
            <i class="iconfont icon-zuojiantou-01"></i>
            <p>资讯详情</p>
        </header> -->
        <div class="title" style="padding-top:0.1rem;font-weight:400;font-size:0.6rem;color:rgb(151, 151, 151);">
            {{title}}
        </div>
        <!-- <div class="info" style="height:0;" v-show="!nodata"></div> -->
        <!-- <div class="main">33333333333333333333333333333333333333333333333333333333334444444456765432345678765434567</div> -->
        <!-- <div class="main" v-html="content"></div> -->
        <div class="xianguan" v-show="!nodata">
             <div class="top" style="width:90%;" v-show="items.length>=10">{{info==0? '自低点累计涨幅': '自高点累计跌幅'}}前10如下,  <span>交易日16:00更新</span></div>
             <div class="top" style="width:90%;" v-show="items.length<10"><span style="float:right;color:rgb(151, 151, 151);font-size:0.5rem;;line-height:1rem;">交易日16:00更新</span></div>
             <ul class="listTop">
                 <li>个股名称/代码</li>
                 <li>触发日收盘价</li>
                 <li v-if="info==0" style="flex:4;position:relative;">累计涨幅 <i class="iconfont infoPeriodic_i icon-arrow-down"></i></li>
                 <li v-if="info!=0" style="flex:4;position:relative;">累计跌幅 <i class="iconfont infoPeriodic_i icon-arrow-up"></i></li>
             </ul>
             <ul class="listBottom" v-for="(item,index) in items" v-show="index<=10" @click="toApp(item.stockData.code,index)">
                  <li> <span>{{item.stockData.name}}</span> <img src="../../static/info/images/sheng.png" alt="" v-show="item.stockData.market=='sz'"> <img src="../../static/info/images/hu.png" alt="" v-show="item.stockData.market!=='sz'"> <span class="num">{{item.stockData.code}}</span> </li>
                 <li><span>{{item.closePrice}}</span></li>
                 <li><span>{{item.cumulativeIncrease}}%</span></li>
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
            info:this.$route.query.info,
            content:'',
            publishAt:'',
            mediaFrom:'',
            num:0,
            show:false,
            nodata:false,
            items:[],
        }
    },
    methods: {
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
        getData(){
            var type=this.$route.query.type,
                thas=this,
                date=this.$route.query.date;
            $.ajax({
                url:'/DOUBLE_TOP/pattern/periodic/'+type+'/'+date,
                dataType:'json',
                success:function(msg){
                    if(msg.message.code==0){
                        if(msg.data==null){
                            return  thas.nodata=true;
                        }
                        thas.title=msg.data.patterText;
                        thas.num=msg.data.stockCount;
                        thas.items=msg.data.linesPeriodicBoList;
                    }else{
                        thas.nodata=true;
                    }
                },
                error:function(err){
                    thas.nodata=true;
                }
            })
        }
    },
    mounted() {
        this.getData();
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
.infoPeriodic_i{
    position: absolute;
    top: 0.2rem;
    right: -0.3rem;
    font-size: 0.5rem;
}
</style>

<style scoped src="../../static/info/css/index.css"></style>
