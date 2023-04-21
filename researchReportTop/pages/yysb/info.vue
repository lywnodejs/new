<template>
<div>
    <header>
       <i class="iconfont icon-xiangzuo" @click="back()"></i>
       <p>{{this.$route.query.content}}</p>
    </header>
    <div class="wenti">
        问题
    </div>
    <div class="main">
        <li v-for="(item,index) in items" @click="to_index_data(item)">{{item}}</li>
    </div>
</div>
</template>


<script>
import { yysbClientService } from '../../service/client/index.js';
export default {
    layout:'yysb',
    // head:{
    //     title:'问题列表'
    // },
    data(){
        return {
            content:'',
            items:[],
        }
    },
    methods:{
        back(){
            window.history.go(-1);
            sessionStorage.setItem('off',false);
        },
        to_index_data(msg){
            window.history.go(-1);
            sessionStorage.setItem('content',msg);
            sessionStorage.setItem('off',true);
        },
        async getData(){
           var data={};
        //    data.type='补退费异常查询';
           data.type=this.$route.query.content;
           let info = await yysbClientService.getInfoList(data);
           this.items=info[0].content;
        }
    },
    mounted() {
        this.getData();
    },
}
</script>

<style scoped src="../../static/yysb/css/info.css"></style>

