<template>
    <div class="eventDetail">
        <div class="back">
            <i class="icon-arrow_L"></i>
            <div class="title">台风“利奇马”</div>
        </div>
        <div class="header_top">
            <i class="icon-arrow_L"></i>
            <div class="title">台风“利奇马”</div>
            <div class="bottom">
                <p>自然灾害 </p>
                <span class="alertClick">09-08更新 &nbsp;&nbsp;  热度：120&nbsp;&nbsp;  查看概述></span>
            </div>
        </div>
        <div class="nav">
            <li :class="navIndex === index ? 'on' :'' " v-for="(item,index) in items" @click="navclick(index)">{{item}} <span></span></li>
        </div>
        <div class="content" v-html="contentA" v-show="navIndex===0"></div>
        <div class="content" v-html="contentB" v-show="navIndex===1"></div>
        <div class="content" v-html="contentC" v-show="navIndex===2"></div>
        <div class="content" v-html="contentD" v-show="navIndex===3" style="padding-top: 0;"></div>
        <div class="alertBox">
            <div class="alert">
                <i class="icon-close" @click="alertShow=false"></i>
                <h3><span></span>事件概述</h3>
                <h4>最强台风“利奇马”过境山东，从8月10日起山东大部分地区迎来强降水，临沂、潍坊、滨州、淄博等部分地区出现较严重的内涝。山东省电解铝产能占比全国近25%，台风过境可能对铝价有一定影响。据SMM消息，山东当地电解铝企业电解槽运转正常，但铝水运输受阻。而从期货盘面看，台风对铝价的影响不大。</h4>
            </div>
        </div>
    </div>
</template>

<script>
    import {eventService, infoevent} from "../service";
    export default {
        name: "eventDetail",
        data(){
          return {
              items:['最新进展','相关资讯','专家观点','相关股票'],
              navIndex:0,
              contentA:'',
              contentB:'',
              contentC:'',
              contentD:'',
          }
        },
        methods:{
            navclick(index){
                  this.navIndex=index;
            },
            async getDataA() {
                var data={
                  type:'eventEvolve'
                };
                let info = await eventService.getEventList(data);
                this.contentA=info;
            },
            async getDataB() {
                var data={
                    type:'eventInformation'
                };
                let info = await eventService.getEventList(data);
                this.contentB=info;
            },
            async getDataC() {
                var data={
                    type:'eventviewpoint'
                };
                let info = await eventService.getEventList(data);
                this.contentC=info;
            },
            async getDataD() {
                var data={
                    type:'eventstock'
                };
                let info = await eventService.getEventList(data);
                this.contentD=info;
            },
        },
        watch:{
            navIndex(val){
                if(val===1){
                    if(!this.contentB){
                        this.getDataB();
                    }
                }else if(val===2){
                    if(!this.contentC){
                        this.getDataC();
                    }
                }else if(val===3){
                    if(!this.contentD){
                        this.getDataD();
                    }
                }
            }
        },
        mounted(){
            this.getDataA();
            $('html,body').css({'background':'#ffffff'});
            var nav_top_ = $('.header_top').height() - $('.nav').height();
            var Top_ = $(window).scrollTop();
            $(window).scroll(function () {
                Top_ = $(window).scrollTop();
                nav_scroll();
            });
            function nav_scroll() {
                if (Top_ >= nav_top_) {
                    $('.back').show();
                    $('.nav').css({
                        position:'fixed',
                        top:'2.77rem'
                    })
                } else {
                    $('.back').hide();
                    $('.nav').css({
                        position:'absolute',
                        top:'7.1rem'
                    })
                }
            }
            $('.alertClick').click(function () {
                $('.alertBox').fadeIn(100);
            })
            $('.alertBox i').click(function () {
                $('.alertBox').fadeOut(100);
            })
        }
    }
</script>

<style scoped src="../../static/common/css/eventdetail.css"></style>
