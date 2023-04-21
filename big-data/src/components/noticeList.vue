<template>
    <div>
        <CommonSelect ref="commonSelectPage" @changeCommonSelect="changeCommonSelect($event)"/>
        <div class="appendBox_noticeList appendBox_Common">

        </div>
        <div class="infinity" v-show="moreData" @click="infinity()">
            查看更多
        </div>
        <div class="noData" v-show="noData">
            <img src="../../static/common/images/nodata.png" alt="">
        </div>
        <div class="loading" v-show="loading">
            <cube-loading :size="30"></cube-loading>
        </div>
    </div>


</template>

<script>
    import {eventService, infoevent} from "../service";
    import CommonSelect  from './commonSelect'
    import store from "../store"
    export default {
        props: ['inputVal'],
        name: "informationMes",
        components: {CommonSelect},
        data(){
            return {
                isgetData: true,
                loading: false,
                infinity_: false,
                noData: false,
                page: {
                    cp: 1,
                    ps: 10
                },
                selectData: {
                    stocks: '',
                    persons: '',
                    Industries: ''
                },
                countFlag: [],
                twoApiClik: false,
                moreData: false,
                lastInputVal: null
            }
        },
        methods:{
            flite_click(){//父组件调用
                this.$refs.commonSelectPage.fliteData(this.inputVal || '',2,true)

                this.selectData.persons = '';
                this.selectData.stocks = '';
                this.selectData.industries = '';
                this.page.cp = 1;
                this.getData(true);
            },
            fliteData(data){
                if(this.isgetData){
                    this.getData()
                    //调用子组件方法
                    this.$refs.commonSelectPage.fliteData(this.inputVal || '',2)
                    this.isgetData = false;
                }else {
                    if(this.lastInputVal != this.inputVal){
                        this.selectData.persons = '';
                        this.selectData.stocks = '';
                        this.selectData.industries = '';
                        this.page.cp = 1;
                        this.getData(true)
                        this.$refs.commonSelectPage.fliteData(this.inputVal || '',2,true)
                    }
                }
            },
            async infinity() {
                this.page.cp ++
                this.getData()
            },
            async getData(flag) {
                this.loading = true;
                this.twoApiClik = flag || false;
                var data = {
                    type: 'infomationMes',
                    title: this.inputVal,
                    content: this.inputVal,
                    person: this.selectData.persons,
                    stocks: this.selectData.stocks,
                    industries: this.selectData.industries,
                    dataTypes: 'NOTICE',
                    plainHighlightedFieldName: 'title,content',
                    d: 'j',
                    cp: this.page.cp,
                    ps: this.page.ps
                }
                let info = await eventService.getInfomationMes(data);
                let dataList = info && info.info && info.info.data && info.info.data.list || [];
                this.loading = false;
                this.lastInputVal = this.inputVal;
                if($.trim(info.content)){
                    this.noData = false;
                    if(dataList.length < this.page.ps){
                        this.moreData = false;
                    }else {
                        this.moreData = true;
                    }
                    if(this.twoApiClik){
                         window.scrollTo(0,0);
                        $('.appendBox_noticeList').html('').append(info.content);
                    }else if(this.page.cp >1){
                        $('.appendBox_noticeList .rxhBD_main').append(info.content);
                    }else {
                        $('.appendBox_noticeList').append(info.content);
                    }
                }else {
                    $('.appendBox_noticeList').html('');
                    this.noData = true;
                    this.moreData = false;
                }
            },
            changeCommonSelect(val) {
                this.selectData.stocks = val.stocks || ''
                this.selectData.persons = val.persons || ''
                this.selectData.industries = val.industries || ''

                this.page.cp = 1;
                this.getData(true)
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>
    .appendBox_Common{
        padding: 0;
        background: #F6F6F6;
    }

    .loading {
        width: 100%;
        color: #000;
        position: relative;
    }

    .loading span {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .noData {
        width: 100%;
        height: auto;
        background: #ffffff;
    }

    .noData img {
        width: 50%;
        margin-left: 50%;
        transform: translate(-50%, 0);
    }
    .infinity{
        width: 100%;
        text-align: center;
        color: #000;
        font-size: 16px;
        padding-bottom: 20px;
        margin-top: 20px;
        cursor: pointer;
    }
    .rxhBD_main{
        margin-bottom: 0;
    }
</style>
