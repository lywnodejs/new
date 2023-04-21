<!--
 * @Date: 2018-12-17 10:52:31
 * @Author: 刘亚伟
 * @LastEditTime: 2018-12-24 15:59:44
 -->

<template>
  <div class="index_info">

    <!-- ----------------------------------头部---------------------------- -->
    <!-- <Header/> -->
    <!-- 头部信息 -->
    <div class="top">
      <dl>
        <dt>{{entityRightOri}} <span v-show="show">({{entityRight}})</span></dt>
        <dd class="dd_red" v-if="data2.rise>0&&data2.newPrice!==0">{{data2.newPrice | tofixed}}<span>+{{data2.rise | tofixed}}%</span></dd>
        <dd class="dd_green" v-if="data2.rise<0&&data2.newPrice!==0">{{data2.newPrice | tofixed}}<span>{{data2.rise | tofixed}}%</span></dd>
        <dd style="color:#fff;"v-if="data2.rise==0&&data2.newPrice!==0">{{data2.newPrice | tofixed}}<span>0.00%</span></dd>
        <dd class="" v-if="data2.rise==0&&data2.newPrice==0"><span>停牌</span></dd>
      </dl>
      <!-- <button class=""><i class="iconfont icon-jia"></i>加自选</button> -->
    </div>
    <div class="footer">
      <p v-html="data.text"></p>
      <div class="info">
        <span>{{data.organization}}</span>&nbsp;&nbsp;
        <span>{{data.publishTime | to_date}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../components/ybtt/header.vue';
import { to_date } from '../../lib/methods.js'
import {eventClientService, quotaClientService} from '../../service/client/index.js'
export default {
  scrollToTop:true,
  head:{
    title:"财报点评",
  },
    components:{
        Header
    },
    data(){
      return {
        nav_index:0,
        id:this.$route.query.id,
        data:[],
        entityRight:'',
        entityRightOri:'',
        code:[],
        data2:[],
        show:false
    }
    },
    methods:{
      async getData(){
        let info = await eventClientService.searchID(this.id,'');
        this.entityRightOri=info.data.entityRightOri[0];
        this.entityRight=info.data.entityRight[0];
        this.code=info.data.entityRight[0];
        this.getGuPiaoCode(info.data);
      },
      async getGuPiaoCode(data_){
        var data=[];
          if(this.code.trim().substr(0,1)=='6'){
            data.push('sh'+this.code.trim());
          }else{
            data.push('sz'+this.code.trim());
          }
        var obj={};
        obj.symbol=data.join(',');
        let info = await quotaClientService.getQuota(obj);
        this.data=data_;
        this.data2={
          rise:info.items[0].rise,
          newPrice:info.items[0].newPrice,
        }
        this.show=true;
      },
    },
    created() {
      this.getData()
    },
    filters: {
      to_date: function(val) {
        if(!val){
          return ''
        }
        return to_date(val)
      },
      tofixed: function(val) {
      	if(val){
      		return val.toFixed(2)
      	}
      }
    },
    mounted(){
      this.$store.commit("ybtt/getTitle",this.data.knowledgeTypeName);
    },
}
</script>

<style scoped src='../../static/ybtt-black/css/info.css'></style>
