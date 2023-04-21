<template>
    <div class="rxhBD_body">
        <div class="rxhBD_top_eveDetail rxh_line_halfB">
            <div class="rxhBD_head">
                <a class="rxhBD_back" href="javascript:;" @click="goBack_()"><i class="icon-arrow_L"></i></a>
                <h4>信息详情</h4>
              <a class="rxhBD_right" v-show="isReport" @click="openPDF()">浏览全文</a>
            </div>
        </div>

        <div class="rxhBD_main_eveDetail">
            <div class="rxhBD_md_eveDetail">
                <div class="rxhBD_hd rxh_line_halfB">
                    <h3 v-html="title"></h3>
                    <h6>{{publishAt | toDate_}}  {{mediaForm || ''}}</h6>
                </div>
                <div class="rxhBD_bd" v-html="content"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import {eventService, infoevent} from "../service";
    import {to_date,to_date_zxrb} from '../lib/methods.js';
    import store from '../store'

    export default {
        name: "detail",
        data() {
            return {
                title:'',
                content:'',
                mediaForm:'',
                publishAt:'',
                contentMes: '',
              pdfUrl:'',
              isReport:false
            }
        },
        filters:{
            toDate_(val){
                return to_date(val);
            }
        },
        methods: {
          goBack_(){
            try {
              if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                window.webkit.messageHandlers['back'].postMessage('1')
              } else if (/(Android)/i.test(navigator.userAgent)) {
                window.contestapp.back()
              }else{
                window.history.go(-1);
              }
            } catch (error) {
              window.history.go(-1);
            }
          },
          openPDF(){
            var hearUrl = "http://rxhui-yanbao.oss-cn-beijing.aliyuncs.com/";
            this.pdfUrl = hearUrl + this.pdfUrl.replace(/\\/g,"/");
            window.open(this.pdfUrl)
          },
            async getDataA() {
                let info = await infoevent.getZXCXdetail(this.$route.query.id);
                let data = info && info.data || '';
                if(data){
                    this.title=data.title;
                    this.content= data.content.replace(/size=/g,'');
                    this.mediaForm=data.mediaForm;
                    this.publishAt=data.publishAt;
                    if(this.$route.query.highLight){
                      var a = this.$route.query.highLight;
                      var test = a.split(',');
                      for(var i = 0;i<test.length;i++){
                        var b = test[i];
                        this.title = this.title.replace(new RegExp(b,'g'),'<span style="color:red;font-weight: 600;">'+b+'</span>')
                        this.content=this.content.replace(new RegExp(b,'g'),'<span style="color:red;">'+b+'</span>')
                      }
                    }
                  }

            },
            async getDataInformationMes() {
                let info = await infoevent.getCommonSelect({id:this.$route.query.id|| ''});
                let data = info && info.data && info.data.list[0] || '';
                if(data){
                    var str = '<a style="word-break: break-word;" target="_blank" href="'+data.url+'">原文地址'+data.url+'</a>'
                    this.title=data.title;
                    if(data.content){
                        this.content = data.content.replace(/\n/g,'<div style="width: 100%;height: 10px;"></div>')
                    }else{
                        this.content = str;
                    }
                    this.content= this.content.replace(/size=/g,'');
                    if(this.$route.query.highLight){
                      var a = this.$route.query.highLight;
                      var test = a.split(',');
                      for(var i = 0;i<test.length;i++){
                        var b = test[i];
                        if(b){
                          this.title = this.title.replace(new RegExp(b,'g'),'<span style="color:red;font-weight: 600;">'+b+'</span>')
                          this.content=this.content.replace(new RegExp(b,'g'),'<span style="color:red;">'+b+'</span>')
                        }
                      }
                    }
                    this.mediaForm=data.mediaForm;
                    this.publishAt=data.publishAt;
                  if(this.$route.query.type=='研报'){
                    this.isReport = true;
                    this.pdfUrl=data.url;
                  }else{
                    this.isReport = false;
                  }
                }
            },
            prevBtn: function(){
                this.$router.push({
                    path: 'index',
                })
            }
        },
        mounted() {
          var this_ = this;
            if(this.$route.query.type=='政策'){
                this.getDataA()
            } else if(this.$route.query.type=='全部'||this.$route.query.type=='新闻'|| this.$route.query.type=='公告' || this.$route.query.type=='研报'){
                this.getDataInformationMes()
            } else if(this.$route.query.type=='公告'){
                this.getDataInformationMes()
            }

          function isIphonex() {
            if(this_.$route.query.appKey=='appEzt'){
              if (typeof window !== 'undefined' && window) {
                return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812;
              }
              return false;
            }else{
              return false;
            }
          }

          if(isIphonex()){
            $('.rxhBD_top_eveDetail').css({height:'5rem'})
            $('.rxhBD_main_eveDetail').css({paddingTop:'4.75rem'})
            $('.rxhBD_head, .rxhBD_head').css({
              height:'6rem',
              lineHeight:'6rem'
            })
            $('.rxhBD_head h4,.rxhBD_head a,.rxhBD_head i').css({
              lineHeight:'6.75rem'
            })
          }

        }
    }
</script>
