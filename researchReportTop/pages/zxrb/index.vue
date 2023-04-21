<!--
 * @Date: 2018-12-05 09:28:55
 * @Author: 刘亚伟
 * @LastEditTime: 2019-02-20 16:03:45
 -->
<template>
  <div class="zxrb_index">
    <header>
      <p class="time_" @click="openPicker()">
        <span>{{time}}</span>
        <img src="../../static/zxrb/images/bottom_03.jpg" alt>
      </p>
      <p>
        <span>知行日报 ·</span>
        <span>{{week}}</span>
      </p>
    </header>
    <div class="main">
      <div class="list" v-for="(item,index) in items">
        <h2>
          <img src="../../static/zxrb/images/left_11.png" alt>
          <span>{{item[0].catogories[0]}}</span>
          <img src="../../static/zxrb/images/right_11.png" alt>
        </h2>
        <div class="list_info" v-for="(item_,index_) in item">
          <h3 v-show="JSON.stringify(item_.outlines)=='[]'||item_.outlines==undefined" @click="toUrl(item_.url)">{{item_.title}}</h3>
          <h3 v-if="JSON.stringify(item_.outlines)!='[]'&&item_.outlines!==undefined" @click="toUrl(item_.outlines[0].relationMethod!=='LINK'&&item_.outlines[0].url!==''? item_.outlines[0].url: item_.url)">{{item_.title}}</h3>
          <div v-if="JSON.stringify(item_.outlines)!='[]'&&item_.outlines!==undefined" class="text" @click="toUrl(item_.outlines[0].url!==''? item_.outlines[0].url:item_.url)">{{item_.outlines[0].content? item_.outlines[0].content: '--'}}</div>
          <!-- 相关话题 -->
          <div class="xianguan" v-if="JSON.stringify(item_.relatedTopics)!='[]'&&item_.relatedTopics!==undefined">
            <span>相关话题：</span>
            <span
              v-if="item_.relatedTopics.length!==0"
              v-for="(xgitem,xgindex) in item_.relatedTopics"
              @click="go_topic(xgitem,item[0].catogories[0])"
            >
              {{xgitem}}&nbsp;
              <i>
                <img src="../../static/zxrb/images/jia_03.jpg" alt>
              </i>
            </span>
          </div>
          <!-- 作者 -->
          <div
            class="zuoze_box"
            v-show="item_.influenceIds!==undefined"
            v-for="(yxitem,yxindex) in item_.influences"
          >
            <div class="zuoze">
              <div class="img_">
                <img
                  src="../../static/zxrb/images/noimg_43.jpg"
                  alt
                >
              </div>
              <div class="zuoze_name">{{yxitem.specialId ? yxitem.specialist.personName : '专家'}}</div>
              <div
                class="zuoze_info"
              >{{yxitem.specialId ? yxitem.specialist.company : '--'}} {{yxitem.specialId ? yxitem.specialist.jobs :''}}</div>
              <div class="clear_float"></div>
              <div
                class="zuoze_text"
                style="display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;text-overflow: ellipsis;overflow: hidden;"
              >
                {{yxitem.content}}
                <span data-_show="show">
                  ...
                  <a href="javascript:;">[展开]</a>
                </span>
                <p>[收起]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nodata" v-show="showBox">
      <img src="../../static/zxrb/images/nodata2.png" alt>
    </div>
    <mt-datetime-picker
      v-model="pickerValue"
      ref="picker"
      type="date"
      :endDate="endDate"
      :startDate="startDate"
      @confirm="gettime"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
    ></mt-datetime-picker>
  </div>
</template>

<script>
import { to_date_zxrb, textShow } from '../../lib/methods.js'
import Vue from 'vue'
import {
  eventClientService,
  shareClientService
} from '../../service/client/index.js'
var items = []
var time = {
  week_: '',
  time:''
}
export default {
  layout: 'zxrb',
  head: {
    title: '知行日报'
  },
  data() {
    return {
      pickerValue: new Date(),
      startDate: new Date('2018/10/01'),
      endDate: new Date(),
      time: '',
      week: '',
      items: [],
      title: '',
      showBox: false,
      one:0,
    }
  },
  methods: {
    openPicker() {
      this.$refs.picker.open()
    },
    gettime(val) {
      this.time = to_date_zxrb(val)
      var date = new Date(val),
        week_ = ['日', '一', '二', '三', '四', '五', '六']
      this.week = '星期' + week_[date.getDay()]
      time.week_ = '星期' + week_[date.getDay()]
      time.time = to_date_zxrb(val)
      if (time.week_ !== '') {
        this.time = time.time;
        this.week=time.week_;
      }
      items = []
      this.getData()
    },
    toUrl(url) {
      if(url=='') return;
      this.$router.push({
        path: 'url',
        query: {
          url
        }
      })
    },
    go_topic(item, index) {
      this.$router.push({
        path: 'topic',
        query: {
          name: item,
          index: index
        }
      })
    },
    async wxShare() {
      var title=this.items[0][0].outlines[0].title;
      var desc=this.items[0][0].outlines[0].content;
      var link=window.location.href;
      var data = {
        redirectUri: decodeURIComponent(window.location.href)
      }
      let info = await shareClientService.share(data);
      var wx = Vue.prototype.wx;
      wx.config({
        debug:false,
        appId: 'wx341a7851a9d0a304',
        timestamp: info.timeStamp,
        // 必填，生成签名的时间戳
        nonceStr: info.nonce,
        // 必填，生成签名的随机串
        signature: info.signature,
        //必填，签名
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
      })
      
    wx.ready(function() {
      wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接
        desc:desc,    //分享描述
        imgUrl: '', // 分享图标
        success: function() {
          // 用户确认分享后执行的回调函数
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
        }
      })
      wx.onMenuShareAppMessage({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: link, // 分享链接
          imgUrl: '', // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        })
        // wx.onMenuShareQQ({
        //     title: detail.title, // 分享标题
        //     desc: detail.desc, // 分享描述
        //     link: detail.callback, // 分享链接
        //     imgUrl: detail.base_url, // 分享图标
        //     type: '', // 分享类型,music、video或link，不填默认为link
        //     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        //     success: function () {
        //         // 用户确认分享后执行的回调函数
        //     },
        //     cancel: function () {
        //         // 用户取消分享后执行的回调函数
        //     }
        // });
      })
    },
    async getData() {
      this.one++;
      if (items.length !== 0) {
        this.items = items
        this.time = time.time
        return
      }
      var begin = new Date(this.time).getTime();
      var end = new Date(this.time).getTime()+1000 * 60 * 60 * 24;      
      var data = {}
      data.begin = begin
      data.end = end
      let info = await eventClientService.zxrbIndex(data);
      if (info.message.code == 0) {
        if (info.data.list.length !== 0) {
          this.items = info.data.list
          items = this.items
          this.showBox = false
        } else {
          this.items = [];
          if(this.one!=1){
            this.showBox = true
          }
        }
      }
      this.wxShare()
      setTimeout(function() {
        textShow($('.zuoze_text'));
        if(info.data.list.length==0&& this.one==1){
          this.gettime(new Date(new Date(this.time).getTime()-1000 * 60 * 60 * 24));
          this.pickerValue=new Date(new Date(this.time).getTime()-1000 * 60 * 60 * 24);
          this.getData();
        }
      }.bind(this), 100)
    }
  },
  mounted() {
    var this_ = this
    // this.wxShare()
    var date = new Date(),
      week_ = ['日', '一', '二', '三', '四', '五', '六']
      
    if (time.week_ !== '') {
      this.time = time.time;
      this.week=time.week_;
    }else{
      this.week = '星期' + week_[date.getDay()]
      this.time = to_date_zxrb(new Date())
      time.week_ = '星期' + week_[date.getDay()]
      time.time = to_date_zxrb(this_.time);
    }
    this.getData()
    setTimeout(function() {
      textShow($('.zuoze_text'))
    }, 100)
    //

    
  }
}
</script>

<style scoped src="../../static/zxrb/css/index.css"></style>