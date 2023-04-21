<template>
    <div>
        <CommonSelect ref="commonSelectPage" @changeCommonSelect="changeCommonSelect($event)"/>
        <div class="appendBox_All_Mes appendBox_Common">
            <div class="freeQusetionBox"></div>
            <div class="listContent"></div>
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
    import {eventService, infoevent,freeQuestionService} from "../service";
    import CommonSelect  from './commonSelect'
    import store from "../store"
    export default {
        props: ['inputVal'],
        name: "allResultMes",
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
                this.$refs.commonSelectPage.fliteData(this.inputVal || '',0,true)

                this.selectData.persons = '';
                this.selectData.stocks = '';
                this.selectData.industries = '';
                this.page.cp = 1;
                this.freeQuestionFun();
                this.getData(true);
            },
            fliteData(data){
                let back = data.back || false
                if(this.isgetData || back){
                    if(data.searchVal){
                        this.inputVal = data.searchVal || '';
                    }
                    this.freeQuestionFun();
                    this.getData()
                    //调用子组件方法
                    this.$refs.commonSelectPage.fliteData(this.inputVal || '',0)
                    this.isgetData = false;
                }else {
                    if(this.lastInputVal != this.inputVal){
                        this.selectData.persons = '';
                        this.selectData.stocks = '';
                        this.selectData.industries = '';
                        this.page.cp = 1;
                        this.freeQuestionFun();
                        this.getData(true)
                        this.$refs.commonSelectPage.fliteData(this.inputVal || '',0,true)
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
                    dataTypes: '',
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
                        $('.appendBox_All_Mes .listContent').html('').append(info.content);
                    }else if(this.page.cp >1){
                        $('.appendBox_All_Mes .rxhBD_main').append(info.content);
                    }else {
                        $('.appendBox_All_Mes .listContent').append(info.content);
                    }
                }else {
                    $('.appendBox_All_Mes .listContent').html('');
                    this.noData = true;
                    this.moreData = false;
                }
            },
            async freeQuestionFun() {
                let info = await freeQuestionService.freeQuestion({question:this.inputVal,d: 'j',appKey:'appZXCX'})
                let type = info && info.info && info.info.answerResultType || ''
                if(type === '行业简介' || type === '行业数据'
                    || type === '个股综评' || type === '资金流向'
                    || type === '财务分析' || type === '公司上下游'
                    || type === '行业上下游' || type === '行业数据'
                    || type === '行业简介' || type === '行业细分'
                    || type === '基础报价数据是' || type === '所属题材'
                    || type === '现价' || type === '最高价'
                    || type === '最低价' || type === '涨跌幅'
                    || type === '成交量' || type === '成交额'
                    || type === '换手率' || type === '振幅'
                    || type === '总市值' || type === '流通市值'
                    || type === '市盈率' || type === '市净率'
                    || type === '市销率' || type === '权益利润率'
                    || type === '加权平均成本' || type === '投资回报率'
                    || type === '每股现金流' || type === '总资产收益率'
                    || type === '毛利率' || type === '营业收入同比增长'
                    || type === '净利润增长率' || type === '净资产收益率'
                    || type === '资产负债率' || type === '流动负债率' || type === '流动比率' || type === '速动比率'
                    || type === '总资产周转率' || type === '存货周转率' || type === '应收账款周转天数' || type === '每股净资产'
                    || type === '营业收入' || type === '净利润' || type === '每股盈利' || type === '每股公积金'
                    || type === '每股未分配利润' || type === '每股经营现金流' || type === '毛利润' || type === '归属母公司净利润'
                    || type === '净利率' || type === '存货周转天数' || type === '应收账款占比' || type === '净利润率'
                    || type === '现金流分数' || type === '现金流量允当比率' || type === '现金再投资比率' || type === '偿债能力分数'
                    || type === '总资产' || type === '总负债' || type === '成长能力分数' || type === '运营能力分数'
                    || type === '营业周期' || type === '盈利能力分数' || type === '政府补贴占净利润比例' || type === '营业收入增长率'
                    || type === '重要客户集中度' || type === '营业利润' || type === '营业费用率' || type === '营业利润率'
                    || type === '经营活动现金净流量' || type === '投资活动现金净流量' || type === '融资活动现金净流量' || type === '经营活动现金净流量/营业利润'
                    || type === '自由现金流' || type === '营业利润' || type === '营业费用率' || type === '营业利润率'
                    || type === '重要客户集中度' || type === '净资本增长率' || type === '可持续增长率' || type === '流动资产周转率'
                    || type === '固定资产周转率' || type === '应收账款周转率' || type === '总资产周转天数' || type === '政府补贴占净利润比'
                    || type === '净资产' || type === '净资本' || type === '商誉风险' || type === '资产收益率'
                    || type === '政策文件列表' || type === '政策内容列表' || type === '政策内容列表无点击' || type === '政府数据对比'
                    || type === '各地方指标维度' || type === '全国指标维度' || type === '政策新闻列表' || type === '会议有'
                    || type === '考察调研有' || type === '资讯搜索' || type === '数据中心答案' || type=== '资讯' || type==='研报'

                ){
                    if(info.content){
                        let content = '<div class="rxh_bd">' + info.content + '</div>'
                        $('.freeQusetionBox').html('').append(content)
                        if(type === '财务分析'){
                            var jsArr = info.jsArray;
                            loadJs(jsArr,window['financialAnalysisView'].onViewReady);
                        }
                        this.noData = false;
                    }
                }else {
                    $('.freeQusetionBox').html('')
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
            $('.rxhBD_main').css('marginBottom','0')
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
        margin-bottom: 0!important;
    }
</style>
