<template>
    <div class="rxhBD_body">
        <div class="rxhBD_top_event" style="top: 0;">
            <div class="rxhBD_search rxhBD_searchYW" style="height: 2.88rem;padding-top: 1rem;">
                <div class="rxhBD_box" style="border-radius: 0.5rem;">
                  <i class="icon-search" style="float: left;"></i>
                  <form id="searchForm" @submit="search()" action="" enctype='applicaion/json' style="width: 75%;float: left;">
                    <input type="search" placeholder="智能搜索 快人一步" v-model="content" @keyup.enter="search()" style="width: 100%">
                  </form>
                    <i @click="clearTxt()" v-show="content!==''" style="float: right;margin-right: 1rem;font-size: 0.38rem;line-height: 1rem;" class="icon-close"></i>
                    <iframe style="display: none" id="rfFrame"  name="rfFrame" src="about:blank"></iframe>
                </div>
            </div>
            <div class="rxhBD_nav">
                <!-- 点击后a标签加样式名：rxhBD_show -->
                <a class="rxhBD_selectEvent"><span :class="eventIndex!==-1?'color_active':''">{{eventIndex!==-1? eventItem[eventIndex]:'搜全部'}}</span><i class="icon-arrow4_D"></i><b></b></a>
                <a class="rxhBD_selectEntity" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"><span :class="shiTiSelected.length!==0?'color_active':''">{{shiTiSelected.length!==0? shiTiSelected.join(','):'相关实体'}}</span><i class="icon-arrow4_D"></i><b></b></a>
                <a class="rxhBD_selectDate"><span :class="beginDate!==''||dateSelectIndex!==-1?'color_active':''">{{dateSelectIndex!==-1? dateSelect[dateSelectIndex]: '日期选择'}}</span><i class="icon-arrow4_D"></i><b></b></a>
                <a class="rxhBD_selectL"><span :class="sortIndex!==-1?'color_active':''">{{sortIndex==-1? '排序':sortItem[sortIndex]}}</span><i class="icon-arrow4_D"></i><b></b></a>
            </div>
        </div>


        <!-- 内容区域 -->
        <div class="rxhBD_main_event" style="margin-top: 5rem;padding-top: 3rem">

        </div>
        <div class="infinity" v-show="infinity_" @click="infinity()">
            查看更多
        </div>
        <div class="loading" v-show="loading">
            <cube-loading :size="30"></cube-loading>
        </div>
        <div class="noData" v-show="noData">
            <img src="../../static/common/images/nodata.png" alt="">
        </div>

        <!-- 弹窗_搜事件 -->
        <div class="pop_rxhBD_event pop_rxhBD_selectEvent" style="top: 6.8rem;">
            <div class="pop_rxhBD_bg"></div>
            <div class="pop_rxhBD_box">
                <ul>
                    <li v-for="(item,index) in eventItem" @click="searchEvent(item,index)"
                        :class="eventIndex==index? 'rxhBD_on':''"><h5>{{item}}</h5><i class="icon-check3"></i></li>
                </ul>
            </div>
        </div>
        <!-- 弹窗_相关实体 -->
        <div class="pop_rxhBD_event pop_rxhBD_entity" style="top: 6.8rem;">
            <div class="pop_rxhBD_bg"></div>
            <div class="pop_rxhBD_box">
                <ul>
                    <div class="ulBox">
                        <li v-for="(item,index) in shiTiItem"
                            :class="shiTiSelected.indexOf(item.term)!==-1?'rxhBD_on':''"
                            @click="shiTiClick(item,index)"><h5>
                            {{item.term}}</h5><i class="icon-check3"></i></li>
                    </div>

                </ul>
                <div class="rxhBD_pop_btn">
                    <a class="rxhBD_btnRe" @click="clearAll(1)">重置</a>
                    <a class="rxhBD_btnOk" @click="search()">确定</a>
                </div>
            </div>
        </div>


        <!-- 弹窗_选择日期 -->
        <div class="pop_rxhBD_event pop_rxhBD_date" style="top: 6.8rem;">
            <div class="pop_rxhBD_bg"></div>
            <div class="pop_rxhBD_box">
                <ul>
                    <li v-for="(item,index) in dateSelect" :class="dateSelectIndex==index?'rxhBD_on':''"
                        @click="dateClick(item,index)"><h5>{{item}}</h5><i class="icon-check3"></i></li>
                </ul>
                <div class="rxhBD_custom">
                    <h5 class="rxh_line_halfT">自定义时间</h5>
                    <div class="rxhBD_box">
                        <input id="rxhBD_selectDate1" type="text" placeholder="选择开始日期" @click="showDatePicker()"
                               v-model="beginDate">
                        <input id="rxhBD_selectDate2" type="text" placeholder="选择结束日期" @click="showDatePicker2()"
                               v-model="endDate">
                    </div>
                </div>
            </div>
        </div>
        <!-- 弹窗_选择排序 -->
        <div class="pop_rxhBD_event pop_rxhBD_sort" style="top: 6.8rem;">
            <div class="pop_rxhBD_bg"></div>
            <div class="pop_rxhBD_box">
                <ul>
                    <li v-for="(item,index) in sortItem" :class="sortIndex==index?'rxhBD_on':''"
                        @click="sortClick(item,index)"><h5>{{item}}</h5><i class="icon-check3"></i></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    window.$ = $;
    window.jQuery = $;
    import {eventService, infoevent} from "../service";
    import {to_date,to_date_zxrb} from '../lib/methods.js';

    export default {
        name: "event",
        data() {
            return {
                loading: true,
                infinity_:false,
                noData: false,
                eventItem: ['搜事件描述','搜主语','搜谓语','搜宾语','搜实体'],
                eventIndex: -1,
                shiTiItem: [],
                shiTiSelected: [],
                dateSelect: ['近一天', '近七天', '近一个月', '近一年'],
                sortItem:['按热度','按时间'],
                clickTime:new Date(new Date().toLocaleDateString()).getTime(),
                sortIndex:-1,
                dateSelectIndex: -1,
                datePicker: null,
                datePicker2: null,
                beginDate: '',
                endDate: '',
                content:'',
                cp:1
            }
        },
        methods: {
            clearTxt(){
                this.content='';
            },
            async getData() {
                this.noData=false;
                var data = {
                    type: 'informationEvent',
                    d:'j',
                    orderBy: 'publishAt',
                    expend:true,
                    direction: 'desc'
                }
                let info = await eventService.getEventList(data);
                $('.rxhBD_main_event').append(info.content);
                this.loading = false;
                this.infinity_=true;
                if(info.info.data.totalCount<=10){
                    this.infinity_=false;
                }
                // window.click_item();
            },
            async getEntity() {
                var data = {
                    facetFields: 'ners',
                    cp: 1,
                    facetSize: 30,
                    ps: 0,
                }
                let info = await infoevent.getEvent(data);
                if (info.data && info.data.facetResults[0].entries && info.data.facetResults[0].entries.length !== 0) {
                    this.shiTiItem = info.data.facetResults[0].entries;
                }
            },
            async newData() {
                this.infinity_=false;
                var begin_ = '';
                var end_ = '';
                if(this.dateSelectIndex!==-1){
                    if(this.dateSelect[this.dateSelectIndex]==='近一天'){
                        // begin_=this.clickTime;
                        // begin_=to_date_zxrb(begin_);
                        // begin_=new Date(begin_).getTime();
                      begin_=this.clickTime;
                    }else if(this.dateSelect[this.dateSelectIndex]==='近七天'){
                        begin_=this.clickTime-60*60*24*1000*7
                    }else if(this.dateSelect[this.dateSelectIndex]==='近一个月'){
                        begin_=this.clickTime-60*60*24*1000*30
                    }else if(this.dateSelect[this.dateSelectIndex]==='近一年'){
                        begin_=this.clickTime-60*60*24*1000*365
                    }
                    end_='';
                }else{
                    begin_=new Date(this.beginDate.replace(/-/g,'/')).getTime() || "";
                    end_ = new Date(this.endDate.replace(/-/g,'/')).getTime()+60*60*24*1000-1000 || "";
                }
                this.noData = false;
                var data = {
                    type: 'informationEvent',
                    d: 'j',
                    facetFields: 'ners',
                    orderBy: 'hot',
                    direction: 'desc',
                    cp: 1,
                    ps: 10,
                    ners: this.shiTiSelected.join(','),
                    begin:begin_,
                    end: end_,
                    expend:true,
                    content:this.content
                };
                if(this.sortIndex===0){
                    data.orderBy='hot';
                }else if(this.sortIndex===1){
                    data.orderBy='publishAt';
                }else{
                    data.orderBy='';
                }
                if(this.eventIndex!==-1){
                    if(this.eventItem[this.eventIndex]==='搜主语'){
                        data.subject=this.content;
                        data.content='';
                    }else if(this.eventItem[this.eventIndex]==='搜谓语'){
                        data.predicate=this.content;
                        data.content='';
                    }else if(this.eventItem[this.eventIndex]==='搜宾语'){
                        data.object=this.content;
                        data.content='';
                    }else if(this.eventItem[this.eventIndex]==='搜事件描述'){
                        data.content=this.content;
                    }else if(this.eventItem[this.eventIndex]==='搜实体'){
                        data.content='';
                        data.ners=this.content;
                    }
                }

                let info = await eventService.getEventList(data);
                $('.rxhBD_main_event').html('');
                $('.rxhBD_main_event').append(info.content);
                this.loading = false;
                if (info.info.data.list.length == 0) {
                    this.noData = true;
                }
                if(info.info.data.totalCount<=10){
                    this.infinity_=false;
                }else{
                    this.infinity_=true;
                }
                // window.click_item();
            },
            search() {
                $('.rxhBD_main_event').html('');
                this.infinity_=false;
                this.loading = true;
                this.newData();
                $(".pop_rxhBD_date").hide();
                $(".pop_rxhBD_selectEvent").hide();
                $(".pop_rxhBD_entity").hide();
                $('.pop_rxhBD_sort').hide();
                $('.rxhBD_top_event .rxhBD_nav a').eq(1).css({'overflow':'hidden'});
                $('.rxhBD_top_event .rxhBD_nav a').eq(0).css({'overflow':'hidden'});
                $(".rxhBD_top_event .rxhBD_nav a").removeClass("rxhBD_show");
            },
            searchEvent(item, index) {
                this.eventIndex = index;
                this.search();
            },
            shiTiClick(item, index) {
                if (this.shiTiSelected.indexOf(item.term) === -1) {
                    this.shiTiSelected.push(item.term);
                } else {
                    this.shiTiSelected.splice(this.shiTiSelected.indexOf(item.term), 1);
                }
            },
            dateClick(item, index) {
                this.dateSelectIndex = index;
                this.beginDate='';
                this.endDate='';
                this.search();
            },
            sortClick(item,index){
                this.sortIndex=index;
                this.search();
            },
            showDatePicker() {
                $(".pop_rxhBD_date").hide();
                if (!this.datePicker) {
                    this.datePicker = this.$createDatePicker({
                        title: '选择开始时间',
                        min: new Date(2008, 7, 8),
                        max: new Date(),
                        value: new Date(),
                        onSelect: this.selectHandle,
                        onCancel: this.cancelHandle
                    })
                }
                this.datePicker.show();
                $(".rxhBD_nav a").each(function () {
                    $(this).removeClass("rxhBD_show");
                });
            },
            showDatePicker2() {
                $(".pop_rxhBD_date").hide();
                if (!this.datePicker2) {
                    this.datePicker2 = this.$createDatePicker({
                        title: '选择结束时间',
                        min: new Date(2008, 7, 8),
                        max: new Date(),
                        value: new Date(),
                        onSelect: this.selectHandle2,
                        onCancel: this.cancelHandle
                    })
                }
                this.datePicker2.show();
                $(".rxhBD_nav a").each(function () {
                    $(this).removeClass("rxhBD_show");
                });
            },
            selectHandle(date) {
                this.dateSelectIndex=-1;
                this.beginDate = to_date(new Date(date).getTime());
                this.datePicker.hide();
                if(this.endDate!==''){
                    this.search();
                }else{
                    $(".pop_rxhBD_date").show();
                    $(".rxhBD_top_event .rxhBD_nav a").eq(2).addClass("rxhBD_show");
                }
            },
            selectHandle2(date) {
                this.dateSelectIndex=-1;
                this.endDate = to_date(new Date(date).getTime());
                this.datePicker2.hide();
                if(this.beginDate!==''){
                    this.search();
                }else{
                    $(".pop_rxhBD_date").show();
                    $(".rxhBD_top_event .rxhBD_nav a").eq(2).addClass("rxhBD_show");
                }
            },
            cancelHandle() {
                try {
                    this.datePicker.hide();
                } catch (e) {
                    this.datePicker2.hide();
                }
            },
            clearAll(index) {
                this.shiTiSelected = [];
                this.loading=true;
                this.infinity_=false;
                $('.rxhBD_main_event').html('');
                this.cp=1;
                this.getData();
            },
            toDetail(id){
                console.log(id);
            },
            async infinity(){
                this.loading=true;
                this.infinity_=false;
                this.cp++;
                var begin_ = '';
                var end_ = '';
                if(this.dateSelectIndex!==-1){
                    if(this.dateSelect[this.dateSelectIndex]==='近一天'){
                      begin_=this.clickTime;
                    }else if(this.dateSelect[this.dateSelectIndex]==='近七天'){
                        begin_=this.clickTime-60*60*24*1000*7
                    }else if(this.dateSelect[this.dateSelectIndex]==='近一个月'){
                        begin_=this.clickTime-60*60*24*1000*30
                    }else if(this.dateSelect[this.dateSelectIndex]==='近一年'){
                        begin_=this.clickTime-60*60*24*1000*365
                    }
                    end_='';
                }else{
                    begin_=new Date(this.beginDate.replace(/-/g,'/')).getTime() || "";
                    end_ = new Date(this.endDate.replace(/-/g,'/')).getTime()+60*60*24*1000-1000 || "";
                }
                this.noData = false;
                var data = {
                    type: 'informationEvent',
                    d: 'j',
                    facetFields: 'ners',
                    orderBy: 'hot',
                    direction: 'desc',
                    cp: this.cp,
                    ps: 10,
                    ners: this.shiTiSelected.join(','),
                    begin:begin_,
                    end: end_,
                    content:this.content
                };
                if(this.sortIndex===0){
                    data.orderBy='hot';
                }else if(this.sortIndex===1){
                    data.orderBy='publishAt';
                }else{
                    data.orderBy='';
                }
                if(this.eventIndex!==-1){
                    if(this.eventItem[this.eventIndex]==='搜主语'){
                        data.subject=this.content;
                        data.content='';
                    }else if(this.eventItem[this.eventIndex]==='搜谓语'){
                        data.predicate=this.content;
                        data.content='';
                    }else if(this.eventItem[this.eventIndex]==='搜宾语'){
                        data.object=this.content;
                        data.content='';
                    }else if(this.eventItem[this.eventIndex]==='搜事件描述'){
                        data.content=this.content;
                    }
                }

                let info = await eventService.getEventList(data);
                $('.rxhBD_main_event').append(info.content);
                this.loading = false;
                if (info.info.data.list.length == 0) {
                    this.noData = true;
                }else{
                    this.infinity_=true;
                }
                if(info.info.data.totalCount<=this.cp*10){
                    this.infinity_=false;
                }
                // window.click_item();
            }
        },
        mounted() {
            var this_=this;
            this.getData();
            this.getEntity();
            window.openDetail=function(id){
                this_.toDetail(id);
            };
            window.timeUtil={
                getTimeStr: function (time) {
                    var date = new Date();
                    if (time != undefined && time != "")
                        date.setTime(time);
                    var month = date.getMonth() + 1;
                    var monthStr = timeUtil.getTwoNumber(month);
                    var day = date.getDate();
                    var dayStr = timeUtil.getTwoNumber(day);
                    return date.getFullYear() + '-' + monthStr + '-' + dayStr;
                },
                getTwoNumber: function (number) {
                    return String((number >= 10) ? number : ("0" + number));
                },
            };
            // 顶部导航
            $(".rxhBD_top_event .rxhBD_nav a").click(function () {
                $(this).addClass("rxhBD_show").siblings().removeClass("rxhBD_show");

                if ($(this).hasClass("rxhBD_selectEvent")) {      // 点击搜事件
                    $(".pop_rxhBD_selectEvent").show();
                    $(".pop_rxhBD_entity").hide();
                    $(".pop_rxhBD_date").hide();
                    $('.pop_rxhBD_sort').hide();
                    $('.rxhBD_top_event .rxhBD_nav a').eq(1).css({'overflow':'hidden'});
                } else if ($(this).hasClass("rxhBD_selectEntity")) {    // 点击相关实体
                    $(this).css({'overflow':'visible'});
                    $(".pop_rxhBD_entity").show();
                    $(".pop_rxhBD_selectEvent").hide();
                    $(".pop_rxhBD_date").hide();
                    $('.pop_rxhBD_sort').hide();
                } else if ($(this).hasClass("rxhBD_selectDate")) {     // 点击日期选择
                    $(".pop_rxhBD_date").show();
                    $(".pop_rxhBD_selectEvent").hide();
                    $(".pop_rxhBD_entity").hide();
                    $('.pop_rxhBD_sort').hide();
                    $('.rxhBD_top_event .rxhBD_nav a').eq(1).css({'overflow':'hidden'});
                }else if($(this).hasClass("rxhBD_selectL")){
                    $('.pop_rxhBD_sort').show();
                    $(".pop_rxhBD_date").hide();
                    $(".pop_rxhBD_selectEvent").hide();
                    $(".pop_rxhBD_entity").hide();
                    $('.rxhBD_top_event .rxhBD_nav a').eq(1).css({'overflow':'hidden'});
                }
            });
            $('.pop_rxhBD_bg').click(function () {
                $(".pop_rxhBD_date").hide();
                $(".pop_rxhBD_selectEvent").hide();
                $(".pop_rxhBD_entity").hide();
                $('.pop_rxhBD_sort').hide();
                $('.rxhBD_top_event .rxhBD_nav a').eq(1).css({'overflow':'hidden'});
                $(".rxhBD_top_event .rxhBD_nav a").removeClass("rxhBD_show");
            })

            //////////////////////////////////////////////////////////////////////////////////////////////

            $(".rxhBD_pop_btn a").click(function () {
                $(".pop_rxhBD_event").hide();

                // 导航部分样式清空
                $(".rxhBD_nav a").each(function () {
                    $(this).removeClass("rxhBD_show");
                });
            });

        }
    }
</script>
<style>
    *{
        user-select: text;
    }
    .ulBox {
        width: 100%;
        max-height: 140px;
        overflow-y: auto;
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
    .color_active{
        color: #2F54EB;
    }
    .rxhBD_searchYW{
        height: 2.88rem;
        padding-top: 1rem;
        background: -moz-linear-gradient(left, #151B33 0%, #454F76 100%);
        background: -webkit-linear-gradient(left, #151B33 0%,#454F76 100%);
        background: -o-linear-gradient(left, #151B33 0%,#454F76 100%);
        background: -ms-linear-gradient(left, #151B33 0%,#454F76 100%);
        background: linear-gradient(to right, #151B33 0%,#454F76 100%);
    }
</style>

