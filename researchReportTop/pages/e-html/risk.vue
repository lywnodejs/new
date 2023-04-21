<!--
 * @Date: 2018-12-28 16:50:11
 * @Author: 刘亚伟
 * @LastEditTime: 2019-05-27 15:42:36
 -->
<template>
    <div>
        <div class="top_nav"></div>
        <div class="top">
            <i class="iconfont icon-angle-left" @click="back_()"></i>
            <span>股权质押风险排行</span>
            <span class="right"><i class="iconfont icon-38"></i></span>
        </div>
        <table cellspacing='0'>
            <thead>
                <tr>
                    <td>个股名称/代码</td>
                    <td @click="getDataMax(0)">总风险 <i class="iconfont icon-arrow-down"></i></td>
                    <td @click="getDataMax(1)">价格风险 <i class="iconfont icon-arrow-down"></i></td>
                    <td @click="getDataMax(2)">质押比率风险 <i class="iconfont icon-arrow-down"></i></td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in items" v-show="index<isshow" @click="toApp(item.secCode,index)">
                    <td><p>{{item.secName}}</p> <span>{{item.secCode}}</span></td>
                    <td>{{item.secTotriskLevel}}</td>
                    <td>{{item.secPririskLevel}}({{item.secPririsk | to_fixed}}%)</td>
                    <td>{{item.secPleriskLevel}}({{item.secPlerisk |to_fixed}}%)</td>
                </tr>
            </tbody>
        </table>
        <div style="text-align:center;font-size:.7rem;padding:1rem 0;" v-show="isshow==10" @click="isshow=50">点击查看更多</div>

        <!-- alert弹窗 -->
        <div class="alert">
            <div class="alert1">
                <img src="../../static/e-html/images/bg_23.png" alt="">
                <p>1. <span>总风险度</span>=风险度+质押比例风险>=7时列入高风险</p>
                <p>2. <span>价格风险度</span>=当前质押品价格/质押时价格=5时列入高风险</p>
                <p>3. <span>质押比率风险度</span>=有风险的质押总数量/总股本=5列入高风险</p>
                <button class="off">我知道了</button>
            </div>
        </div>
    </div>
</template>

<script>
import {
  eventClientService,
  quotaClientService
} from '../../service/client/index.js'
export default {
    layout:'e-html',
    data(){
        return {
            items:[],
            isshow:0
        }
    },
    methods: {
        back_(){
            window.history.go(-1);
        },
        async getData(){
             let info = await eventClientService.getRtPledge();
             this.items=info.data;
             this.isshow=10;
             this.getDataMax(0);
        },
        getDataMax(type){
            var arr=this.items;
            $('table thead tr i').css({color:'#a1a2a8'});
            $('table thead tr td').css({color:'#a1a2a8'});
            $('table thead tr i').eq(type).css({color:'#277ad8'});
            $('table thead tr td').eq(type+1).css({color:'#277ad8'});
            for(var i=0;i<arr.length;i++){
                var max = arr[i];
                var maxIndex = i;
                if(type==0){
                    for(var j=i+1;j<arr.length;j++){
                        if(max.secTotriskLevel<arr[j].secTotriskLevel){
                            max = arr[j];
                            maxIndex = j;
                        }
                    }
                }else if(type==1){
                    for(var j=i+1;j<arr.length;j++){
                        if(max.secPririsk>arr[j].secPririsk){
                            max = arr[j];
                            maxIndex = j;
                        }
                    }
                }else if(type==2){
                    for(var j=i+1;j<arr.length;j++){
                        if(max.secPlerisk<arr[j].secPlerisk){
                            max = arr[j];
                            maxIndex = j;
                        }
                    }
                }

                arr.splice(i,0,max);
                arr.splice(maxIndex+1,1);
            }
            this.items=arr;
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
    },
    created() {
        this.getData();
    },
    mounted() {
        if(this.$route.query.hideBackIcon==1){
            $('.top .icon-angle-left').hide();
        }
        $('.top .right').click(function (e) {
            $('.alert').fadeToggle(200);
            $('html,body').css({
                overflow:'hidden'
            })
        });
        $('.alert1 .off').click(function(){
            $('.alert').fadeToggle(200);
            $('html,body').css({
                overflow:'auto'
            })
        });
        setTimeout(function(){
            var top=this.$route.query.top || 0;
            $('.top_nav').css({
            height:top+'px'
            })
            $('.top').css({
            top:top+'px'
            })
            $('table').css({
            marginTop:$('.top').height()+$('.top_nav').height()+'px'
            })
        }.bind(this),100)
    },
    filters: {
        time: function(val) {
        if (val !== '') {
            try {
            var str = val.slice(0, 4) + '-' + val.slice(4, 6) + '-' + val.slice(6, 8)
            } catch (error) {
            return val
            }
        } else {
            return ''
        }
        return str
        },
        to_fixed(val) {
            if (val !== '') {
                return val.toFixed(2)
            } else {
                return ''
            }
        }
    },
}
</script>

<style scoped src="../../static/e-html/css/risk.css"></style>

