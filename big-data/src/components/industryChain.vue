<template>
    <div>
        <div class="appendBox_industry">

        </div>
        <div class="noData" v-show="noData">
            <img src="../../static/common/images/nodata.png" alt="">
        </div>
    </div>
</template>

<script>
    import {eventService, infoevent} from "../service";
    export default {
        props: ['inputVal'],
        name: "infomation",
        data(){
            return {
                isgetData: true,
                noData: false
            }
        },
        methods:{
            flite_click(){
                this.getData();
            },
            fliteData(data){
                if(this.isgetData){
                    this.getData()
                    this.isgetData = false;
                }
            },
            async getData() {
                var data = {
                    type: 'knowMap',
                    code: '000001',
                    q: this.inputVal
                };
                let info = await eventService.getindustryChain(data);
                let infoNo = info && info.nodata || false;
                if(!infoNo){
                    this.noData = false;
                    $('.appendBox_industry').html('').append(info);
                }else{
                    $('.appendBox_industry').html('');
                    this.noData = true;
                }
                
            },
        },
        mounted(){
        }
    }
</script>

<style scoped>

</style>