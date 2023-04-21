<template>
    <div>
        <div class="loading" style="margin-top: 8rem;" v-show="loading">
            <cube-loading :size="30"></cube-loading>
        </div>
        <div class="appendBox_info">

        </div>
    </div>
</template>

<script>
    import {eventService} from "../service";
    export default {
        name: "infomation",
        data(){
            return {
                off:true,
                loading:true,
                inp:''
            }
        },
        methods:{
            async getData(inp) {
                if(!this.off && inp===this.inp && this.inp!==''){
                    return ;
                }
                if(this.inp !==inp && this.inp!==''){
                    this.search(inp);
                    return;
                }
                this.inp=inp;
                this.off=false;
                var data = {
                    type: 'ZXCXHeaderScreen',
                    d:'j'
                };
                let info = await eventService.getEventList(data);
                $('.appendBox_info').append(info.content);
                this.loading=false;
                HeaderScreenView.onViewReady();
                if(inp){
                    window.searchInput(inp);
                }
            },
            search(val){
                if(this.inp!==val){
                    this.inp=val;
                    window.searchInput(val);
                }
            }
        },
        mounted(){
            // this.getData();
            // var script = document.createElement("script");
            // script.setAttribute("type", "text/javascript");
            // script.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.2/js/swiper.min.js");
            // script.onload = function () {
            //     _this.getData();
            // };
            // $('head').get(0).appendChild(script);
        }
    }
</script>

<style>
.appendBox_info{
    width: 100%;
    top: 6.1rem;
    background: #fff;
    z-index: 100000000000;
}
.ZXCXScreenBox{
    position: fixed !important;
    top: 6rem !important;
}
#zhpx{
    padding-top: 6rem;
}
</style>

<style src="../../static/common/css/lywscreenList.css"></style>