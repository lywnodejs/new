<!--
 * @Date: 2018-12-26 15:46:12
 * @Author: 刘亚伟
 * @LastEditTime: 2019-05-31 14:57:47
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
             <div class="top" style="width:90%;" v-show="items.length>=10">{{num}}只股票符合，成功率前10如下  <span>交易日16:00更新</span></div>
             <div class="top" style="width:90%;" v-show="items.length<10">{{num}}只股票符合 <span style="float:right;color:rgb(151, 151, 151);font-size:0.5rem;;line-height:1rem;">交易日16:00更新</span></div>
             <ul class="listTop">
                 <li>个股名称/代码</li>
                 <li>成功率</li>
                 <li style="flex:4;">出现次数</li>
             </ul>
             <ul class="listBottom" v-for="(item,index) in items" v-show="index<=10">
                  <li> <span>{{item.stockData.fullName}}</span> <img src="../../static/info/images/sheng.png" alt="" v-show="item.stockData.market=='sz'"> <img src="../../static/info/images/hu.png" alt="" v-show="item.stockData.market!=='sz'"> <span class="num">{{item.stockData.code}}</span> </li>
                 <li><span>{{item.winRate}}%</span></li>
                 <li><span>{{item.patternCount}}</span></li>
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
            num:0,
            show:false,
            nodata:false,
            items:[],
        }
    },
    methods: {
        getData(){
            var type=this.$route.query.type,
                thas=this,
                date=this.$route.query.date;
            $.ajax({
                url:'/DOUBLE_TOP/pattern/'+type+'/'+date,
                dataType:'json',
                success:function(msg){
                    if(msg.message.code==0){
                        if(msg.data==null){
                            return  thas.nodata=true;
                        }
                        thas.title=msg.data.patterText;
                        thas.num=msg.data.stockCount;
                        thas.items=msg.data.linesPatternBoList;
                    }else{
                        thas.nodata=true;
                    }
                },
                error:function(err){
                    thas.nodata=true;
                }
            })
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

            }
        },
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
</style>

<style scoped src="../../static/info/css/index.css"></style>
