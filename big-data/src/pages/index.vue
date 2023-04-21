<template>
    <div class="indexBox">
        <div class="header">
            <div class="inputBox" :class="isrightsearch? 'inputreport':''">
                <!-- <i class="cubeic-search"></i> -->
                <!-- <input type="text" placeholder="锂电池 行业竞争" v-model="input" @keyup.enter="search()">
                <i class="cubeic-wrong" @click="clearSearch" v-show="input !== ''"></i> -->
              <!--<div>
                <i class="icon-search" style="float: left;"></i>
                <form id="searchForm" action="" enctype='applicaion/json' style="width: 75%;float: left;">
                  <input type="search" id="J_search_content" placeholder="锂电池 行业竞争" v-model="input" @keyup.enter="search()" style="width: 100%">
                </form>
                <i @click="input=''" v-show="input!==''" style="float: right;margin-right: 1rem;font-size: 1rem;line-height: 2rem;" class="icon-close"></i>
                <iframe style="display: none" id="rfFrame"  name="rfFrame" src="about:blank"></iframe>
              </div>-->
              <i class="icon-search" style="float: left;"></i>
              <form id="searchForm" action="" enctype='applicaion/json' style="width: 75%;float: left;">
                <!--非研报-->
                <input v-show="!isrightsearch" type="search" id="J_search_content" placeholder="锂电池 行业竞争" v-model="input" @keyup.enter="search()" style="width: 100%">
                <!--研报  非股票-->
                <input v-show="isrightsearch && topTab[topTabIndex] != '股票'" type="search" id="J_search_content_no_code" placeholder="锂电池 行业竞争" v-model="input" @keyup.enter="search()" style="width: 100%">
                <!--研报  股票 @focus="input_focus()"-->
                <input v-show="isrightsearch && topTab[topTabIndex] == '股票'" @input="showDefault()" type="search" id="J_search_content_code" placeholder="锂电池 行业竞争" v-model="input" @keyup.enter="search()" style="width: 100%">
                <div class="rxhBD_pop_search_report" :class="this.input_code_pop?'rxh_show':''">
                  <ul>
                    <li v-for="(item,index) in stockTable" @click="itemCodeClick(index,item)">{{item.content}}</li>
                    <!--<li>东边</li>-->
                  </ul>

                </div>
                <div class="rxhBD_pop_search_report_bg" v-show="this.input_code_pop?'rxh_show':''" @click="hideSearchStockPop"></div>
              </form>
              <i @click="input=''" v-show="input!==''" style="float: right;margin-right: 1rem;font-size: 1rem;line-height: 2rem;" class="icon-close"></i>
              <iframe style="display: none" id="rfFrame"  name="rfFrame" src="about:blank"></iframe>
            </div>
          <a class="rxhBD_scope_A" v-show="isrightsearch" @click="clickALl()">
            <span>{{topTab[topTabIndex]}}</span>
            <i class="rxh-icon-arrow4_d"></i>
          </a>
          <div class="clear"></div>
            <div class="nav">
                <cube-scroll-nav-bar :current="current" :labels="labels" @change="changeHandler"></cube-scroll-nav-bar>
            </div>
        </div>
      <div class="rxhBD_head_report_pop" :class="showseleALl? 'show':'hide'">
        <div class="rxhBD_pop_bg" @click="showseleALl=false"></div>
        <div class="rxhBD_pop_box">
          <ul>
            <li v-for="(item,index) in topTab" :class="topTabIndex == index? 'rxhBD_on':''" @click="topClick(index)">{{item}}</li>
          </ul>
          <b></b>
        </div>
      </div>
        <div class="contentComponent" v-show="indexName=='事件'">
            <Event ref="event" :input="input" @newInput="setInput()"/>
        </div>
        <div class="infomationTemp" v-show="indexName=='政策'">
            <Infomation ref="infomationTemp" />
        </div>
        <div class="informationMes" v-show="indexName=='全部'">
            <AllResult ref="allResultMes" :inputVal="input"/>
        </div>
        <div class="informationMes" v-show="indexName=='新闻'">
            <InfomationMes ref="informationMes"  :inputVal="input" :labelsIndex="labelsIndex"/>
        </div>
        <div class="informationMes" v-show="indexName=='公告'">
            <NoticeList ref="noticeListMes" :inputVal="input"/>
        </div>
        <div class="informationMes" v-show="indexName=='研报'">
            <ResearchReport ref="researchReportMes"  :inputVal="input" :topName="topTab[topTabIndex]" />
        </div>
        <div class="contentComponent" v-show="indexName=='产业链'">
            <IndustryChain ref="industryChainMes" :inputVal="input"/>
        </div>
        <div class="alertBoxModule">
            <div class="alert_module">
                <p>详情</p>
                <i class="icon-close" onclick="$('.alertBoxModule').fadeOut(200);"></i>
                <div class="scroll_A">
                    <div class="scroll_B">
                        <div class="title">{{title}}</div>
                        <div class="date">{{publishAt | toDate_}}</div>
                        <div class="content" v-html="content"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import {eventService, infoevent} from "../service";
    import {to_date,to_date_zxrb} from '../lib/methods.js';
    import Event from '../components/event'
    import Infomation from '../components/infomation'
    import AllResult from '../components/allResult'
    import CommonSelect  from '../components/commonSelect'
    import InfomationMes  from '../components/infomationMes'
    import NoticeList  from '../components/noticeList'
    import IndustryChain  from '../components/industryChain'
    import ResearchReport  from '../components/researchReport'
    import store from '../store'
    import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';

    export default {
        name: "index",
        components: {Event,Infomation,AllResult,CommonSelect,InfomationMes,NoticeList,IndustryChain,ResearchReport},
        data() {
            return {
                labels: ['全部','新闻', '公告', '政策', '研报'],
                topTab:['全部','股票','标题','作者'],
                topTabIndex:0,
                current: '全部',//默认的nav值
                labelsIndex: 0,//当前选中的nav下标
                input: '',//输入框的值
              code: '',//研报下拉选中股票 输入框的值对应的股票代码
                indexName: '全部',
                title:'',
                content:'',
                mediaForm:'',
                publishAt:'',
                alived: true,
                showseleALl:false,
              stockTable:[],//键盘精灵数据
              input_code_pop:false//是否展示键盘精灵页面
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.name === null) {
                store.dispatch('KEEPALIVE_LIST','index')
            }
            next()
        },
      watch:{
        value(val){
          console.log(val);
        }
      },
        mounted(){
            let _this = this;
            $('.rxhBD_pop_bg').css({'height':$(window).height()})
            $('.alertBoxModule').hide();
            //var this_=this;
            window.openDetail=(id) =>{
                this.toDetail(id);
            };

          let searchVal = this.$route.query.searchVal || '';
            this.input =searchVal;
            this.$refs.allResultMes.fliteData({typeIndex: 0,searchVal: searchVal})
            //屏蔽form表单会自动触发提交刷新页面的事件
            document.getElementById("searchForm").onsubmit = function () {
                var title = document.getElementById("J_search_content").value;
                document.getElementById("J_search_content").blur()
                document.getElementById("J_search_content_no_code").blur()
                document.getElementById("J_search_content_code").blur()
                _this.search()
                return false;
            };
        },
        filters:{
            toDate_(val){
                return to_date(val);
            }
        },
      computed:{
        ...mapState([
          'isrightsearch'
        ])
      },
        methods: {
          change(value, index, text) {
            console.log('change', value, index, text)
          },
          inputOnchange(){

          },

          ...mapActions({
            setrightsearch: 'ISRIGHTSEARCH'
          }),
          ...mapGetters({
            getrightsearch:'getrightsearch'
          }),
          topClick(i){
            //console.log(i);
            this.topTabIndex=i;
            this.showseleALl=false;
            if(i == 1){
              this.input = "";
            }else{
              this.hideSearchStockPop();
              //this.input_code_pop=false
            }
          },
          clickALl(){
            this.showseleALl = ! this.showseleALl;
          },
            toDetail(id){
                if(this.current === '事件'){return false};
                this.title='';
                this.content='';
                this.mediaForm='';
                this.publishAt='';
                //$('.alertBoxModule').fadeIn(200);
                //console.log(this.current)
                if(this.current=='政策'){
                    //this.getDataA(id)
                    this.$router.push({
                        path: '/detail',
                        query: {
                            type: this.current,
                            id: id
                        }
                    })
                } else if(this.current=='全部'|| this.current=='新闻'|| this.current=='公告' || this.current=='研报'){
                    //this.getDataInformationMes(id)
                    this.$router.push({
                        path: '/detail',
                        query: {
                            type: this.current,
                            id: id
                        }
                    })
                } else if(this.current=='公告'){
                    this.getDataInformationMes(id)
                }
            },
            changeHandler(val) {
                this.labelsIndex = this.labels.indexOf(val);
                this.current=val;
                this.indexName = val;
                if (this.indexName == '事件') {
                    this.$refs.event.fliteData(this.input);
                }else if(this.indexName == '新闻'){
                    this.$refs.informationMes.fliteData({typeIndex: 1})
                }else if(this.indexName == '公告'){
                    this.$refs.noticeListMes.fliteData({typeIndex: 2})
                }else if(this.indexName == '研报'){
                    this.$refs.researchReportMes.fliteData({typeIndex: 4,topName: this.topTab[this.topTabIndex],code:this.code})
                }else if(this.indexName == '政策'){
                    this.$refs.infomationTemp.getData(this.input);
                }else if(this.indexName == '产业链'){
                    this.$refs.industryChainMes.getData();
                }else if(this.indexName == '全部'){
                    this.$refs.allResultMes.fliteData({typeIndex: 0});
                }

                if(this.indexName==='研报'){
                  this.setrightsearch(true);
                }else{
                  this.setrightsearch(false)
                }
            },
            search() {
              this.topTabIndex = 0;
                if (this.indexName == '事件') {
                    this.$refs.event.flite_click(this.input);
                } else if(this.indexName == '新闻'){
                    this.$refs.informationMes.flite_click(this.input);
                }else if(this.indexName == '政策'){
                    this.$refs.infomationTemp.search(this.input);
                }else if(this.indexName == '公告'){
                    this.$refs.noticeListMes.flite_click(this.input);
                }else if(this.indexName == '研报'){
                    this.$refs.researchReportMes.flite_click({input:this.input,code:this.code});
                }else if(this.indexName == '产业链'){
                    this.$refs.industryChainMes.flite_click();
                }else if(this.indexName == '全部'){
                    this.$refs.allResultMes.flite_click();
                }
            },
            setInput(val){//子组件改变父级的input
                this.input=val;
            },
            async getDataA(id) {
                let info = await infoevent.getZXCXdetail(id);
                let data = info && info.data || '';
                if(data){
                    this.title=data.title;
                    this.content=data.content;
                    this.mediaForm=data.mediaForm;
                    this.publishAt=data.publishAt;
                }

            },
            async getDataInformationMes(id) {
                let info = await infoevent.getCommonSelect({id:id|| ''});
                let data = info && info.data && info.data.list[0] || '';
                if(data){
                    this.title=data.title;
                    this.content=data.content || '暂无内容';
                    this.mediaForm=data.mediaForm;
                    this.publishAt=data.publishAt;
                    if(data.url&&this.content==='暂无内容'){
                        this.content='<a target="_blank" href="'+data.url+'">原文地址'+data.url+'</a>'
                    }
                }

            },

            clearSearch: function(){
                this.input =  '';
            },
            initCreat: function(){
                let searchVal = this.$route.query.searchVal || '';
                this.input =searchVal;
                this.$refs.allResultMes.fliteData({typeIndex: 0,searchVal: searchVal})
            },
          /**
           * 键盘精灵
           * 查询股票列表
           */
          async searchStock (value) {
            if (value) {
              let params = {
                type: 100,
                query: value,
                count: 10
              }
              let result = await infoevent.searchStock(params)
              if (result && result.data) {
                this.stockTable = result.data
              } else {
                this.stockTable = []
              }
            } else {
              this.stockTable = []
            }
            this.stockTable = this.formatterStockTable(this.stockTable)
            this.input_code_pop = true;
          },

          showDefault() {
            if(this.topTab[this.topTabIndex] == "股票"){
              //H5禁止手机自带键盘弹出 input获取焦点时禁止手机键盘弹出
              /*$("#J_search_content_code").focus(function(){
                document.activeElement.blur();
              });*/

              this.searchStock(this.input)
            }else{
              this.hideSearchStockPop();
              //this.input_code_pop = false;
            }
          },
          formatterStockTable(arr){
            var resArr = [];
            if(arr.length>0){
              for (let i = 0; i < arr.length; i++) {
                let temp = {};
                temp.content = arr[i].disName;
                temp.code = arr[i].code;
                temp.align = "left";
                resArr.push(temp);
              }
            }else{
              let temp = {};
              temp.content =  '无';
              temp.code = "";
              resArr.push(temp);
            }
            return resArr;
          },
          showSearchStockPop(){
            this.$createActionSheet({
              title: '',
              data: this.stockTable,
              onSelect: (item, index) => {
                if(item.content !== "无"){
                  this.input =  item.content
                  this.code =  item.code
                  this.$refs.researchReportMes.flite_click({input:this.input,code:this.code});
                }else{
                  this.input =  ""
                  this.code =  ""
                }
                /*this.$createToast({
                  txt: `Clicked ${item.content}`,
                  time: 1000
                }).show()*/
              }
            }).show()
          },
          hideSearchStockPop(){
            //this.$createActionSheet({}).hide()
            this.input_code_pop = false;
            this.input =  "";
            this.code =  "";
          },
          itemCodeClick(i,item){
            if(item.content !== "无"){
              this.input =  item.content
              this.code =  item.code
              this.$refs.researchReportMes.flite_click({input:this.input,code:this.code});
            }else{
              this.input =  ""
              this.code =  ""
            }
            this.input_code_pop = false;
          }

        }
    }
</script>

<style scoped>
    .indexBox {
        width: 100%;
        height: 100%;
    }
    .alertBoxModule{
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.62);
        z-index: 1000000000000000;
    }
    .alert_module{
        width: 100%;
        height: 80vh;
        position: absolute;
        bottom: 0;
        left: 0;
        background: #ffffff;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
    }
    .alert_module .icon-close{
        position: absolute;
        right: 1rem;
        top: 1rem;
    }
    .alert_module>p{
        width: 100%;
        height: 2rem;
        font-size: 1.1rem;
        margin-top: 1rem;
        line-height: 1rem;
        box-sizing: border-box;
        padding-left: 1rem;
        border-bottom: 1px solid #d0d2d8;
    }
    .alert_module .scroll_A{
        width: 100%;
        height: calc(80vh - 2rem);
        background: #ffffff;
        overflow: auto;
    }
    .scroll_B{
        width: 100%;
    }
    .scroll_B .title{
        width: 100%;
        height: auto;
        font-size: 1.225rem;
        color: #000000;
        margin-bottom: 0.5rem;
        line-height: 1.6rem;
        box-sizing: border-box;
        padding-left: 1rem;
        padding-top: 1rem;
    }
    .scroll_B .date{
        width: 100%;
        height: auto;
        color: #9599A1;
        box-sizing: border-box;
        padding-left: 1rem;
        font-size: 0.95rem;
    }
    .scroll_B .content{
        width: 100%;
        height: auto;
        color: #000000;
        box-sizing: border-box;
        padding: 1rem;
        font-size: 1.025rem;
        line-height: 1.5rem;
        text-indent: 2rem;
        word-break: break-word;
    }
    .header {
        width: 100%;
        height: calc(2.75rem + 2.45rem);
        padding-top: 0.75rem;
        position: fixed;
        top: 0;
        z-index: 10000;
        background-image: -webkit-linear-gradient(left,#151B33 , #454F76 );
        background-image: -moz-linear-gradient(left,#151B33 , #454F76 );
        background-image: -o-linear-gradient(left,#151B33 , #454F76 );
        background-image: linear-gradient(left,#151B33 , #454F76 );
    }

    .inputBox {
        width: 90%;
        height: 2.13rem;
        background: #EFF2F6;
        margin: 0 auto;
        border-radius: 0.3rem;
    }

    .inputBox i {
        color: #AAAFBB;
        float: left;
        margin-left: 0.79rem;
        font-size: 0.88rem;
        line-height: 2.13rem;
    }

    .inputBox input {
        width: 80%;
        float: left;
        height: 2.1rem;
        border: none;
        outline: none;
        background: #EFF2F6;
        padding-left: 0.4rem;
        font-size: 0.88rem;
        color: #333333;
        line-height: 2.13rem;
    }

    .nav {
        width: 100%;
        height: 2.75rem;
        background-image: -webkit-linear-gradient(left,#151B33 , #454F76 );
        background-image: -moz-linear-gradient(left,#151B33 , #454F76 );
        background-image: -o-linear-gradient(left,#151B33 , #454F76 );
        background-image: linear-gradient(left,#151B33 , #454F76 );
    }

    .contentComponent {
        margin-top: 8.5rem;
        background: #F6F6F6;
    }
    .infomationTemp{
        margin-top: 6.2rem;
    }

    .cube-scroll-nav-bar {
        height: 2.75rem;
        background-image: -webkit-linear-gradient(left,#151B33 , #454F76 );
        background-image: -moz-linear-gradient(left,#151B33 , #454F76 );
        background-image: -o-linear-gradient(left,#151B33 , #454F76 );
        background-image: linear-gradient(left,#151B33 , #454F76 );
    }
    .informationMes{
        margin-top: 15rem;
    }
  .rxhBD_pop_search_report_bg{
    width: 100%;
    position: absolute;
    left: 0;
    top: 2.75rem;
    background-color: rgba(0,0,0,.57);
    height: calc(100vh);
    z-index: 2001;
  }
</style>
