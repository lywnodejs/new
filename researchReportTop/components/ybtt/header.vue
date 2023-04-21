<template>
    <header>
        <span @click="back()"><i class="iconfont icon-chevron-thin-left"></i></span>
        <span>{{title}}</span>
        <!-- <span v-show="show"><i class="iconfont icon-fenxiang3"></i></span> -->
        <!-- <span v-show="!show">&nbsp;&nbsp;&nbsp;&nbsp;</span> -->
        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </header>
</template>

<script>
export default {
    data(){
        return {
            title:"研报头条",
            show:true
        }
    },
    methods:{
        back(){
            window.history.go(-1);
        }
    },
    computed:{
        getTitle(){
           return this.$store.state.ybtt.title;
        }
    },
    watch:{
        getTitle:function(name){
            if(name=='研报头条'){
                this.show=true;
            }else{
                this.show=false;
            }
            this.title=name;
        }
    }
}
</script>




<style>
@import '../../static/ybtt/css/header.css';

</style>