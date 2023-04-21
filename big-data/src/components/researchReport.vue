<template><!--研报页面-->
    <div>
      <!--研报tab页面-->
      <div class="rxhBD_menu_report" :class="this.tabNameArr.length>0? '':'rxhBD_report_noMenu'">
        <ReportTab ref="reportTabMenu" :topName="topName" @listenToChildEvent="showMsgFromChild" @changeTab="changeTab($event)"></ReportTab>
      </div>
      <!--研报select btn页面-->
      <div class="rxhBD_filter_report" :class="this.tabNameArr.length>0? '':'rxhBD_filter_report_noMenu'">
        <CommonSelect ref="commonSelectPage" @changeCommonSelect="changeCommonSelect($event)"/>
      </div>
      <!--研报list页面-->
      <div class="rxhBD_main_report" :class="this.tabNameArr.length>0? '':'rxhBD_main_report_noMenu'">
        <div class="appendBox_researchReport appendBox_Common">
          <div :class="this.tabNameArr.length>0? 'freeQusetionBox':'freeQusetionBox_noMenu'"></div>
          <div class="listContent"></div>
        </div>
      </div>
      <div class="infinity" v-show="moreData" @click="infinity()">查看更多</div>
      <div class="noData" v-show="noData"><img src="../../static/common/images/nodata.png" alt=""></div>
      <div class="loading" v-show="loading"><cube-loading :size="30"></cube-loading></div>
    </div>
</template>

<script>
    import {eventService, infoevent ,freeQuestionService} from "../service";
    import CommonSelect  from './commonSelect'
    import ReportTab  from './reportTab'
    export default {
        props: ['inputVal','topName'],
        name: "informationMes",
        components: {CommonSelect,ReportTab},
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
              lastInputVal: null,
              //以下为研报优化新添加-----------------
              code:"",
              tabData: {
                reportTypes: '',
                ratingResult: '',
                organization: '',
                pageSize: '',
                begin: '',
                end: ''
              },
              inputValData: {
                title: '',
                content: '',
                code: '',
                author: '',
              },
              topSelectedName:"",//研报头部下拉框选择项
              tabNameArr:[]
            }
        },
      watch:{
          topName(val){
            //console.log("report--tab===="+val);
            if(this.lastInputVal == this.inputVal || this.inputVal==""){
              this.code = ""
              this.topSelectedName = val;
              this.initInputVal(val);
              this.getData(true);
              this.freeQuestionFun();
              this.$refs.commonSelectPage.fliteData(this.inputVal || '',4,true,this.tabData,this.inputValData);
              this.$refs.reportTabMenu.fliteData({inputVal:this.inputVal || '',inputValData:this.inputValData});
            }

          }
      },
        methods:{
            flite_click(data){//父组件调用 例如文本框内容改变时
              this.code = data.code;
              this.inputVal = data.input;
              this.initInputVal(this.topSelectedName);
              this.$refs.reportTabMenu.fliteData({inputVal:this.inputVal || '',inputValData:this.inputValData});
              this.emptyTabData();

              this.$refs.commonSelectPage.fliteData(this.inputVal || '',4,true,this.tabData,this.inputValData);
              this.selectData.persons = '';
              this.selectData.stocks = '';
              this.selectData.industries = '';
              this.page.cp = 1;
              this.freeQuestionFun();
              this.getData(true);
            },
            fliteData(data){
              this.code = data.code;
              this.topSelectedName = data.topName;
              this.initInputVal(data.topName)
              if(this.isgetData){

                this.getData()
                //调用子组件方法
                this.$refs.commonSelectPage.fliteData(this.inputVal || '',4,false,this.tabData,this.inputValData)
                this.isgetData = false;
                //console.log("01111111111==="+this.inputVal);
                this.$refs.reportTabMenu.fliteData({inputVal:this.inputVal || '',inputValData:this.inputValData})
              }else {
                //console.log("02222222222==="+this.inputVal);
                if(this.lastInputVal != this.inputVal){
                  //console.log("03333333333==="+this.inputVal);
                  this.emptyTabData();
                  this.selectData.persons = '';
                  this.selectData.stocks = '';
                  this.selectData.industries = '';
                  this.page.cp = 1;
                  this.getData(true)
                  this.$refs.commonSelectPage.fliteData(this.inputVal || '',4,true,this.tabData,this.inputValData)
                  this.$refs.reportTabMenu.fliteData({inputVal:this.inputVal || '',inputValData:this.inputValData})
                }
              }
              this.freeQuestionFun()
            },
          initInputVal(val){
            if(val == "全部"){
              this.inputValData.title = this.inputVal;
              this.inputValData.content = this.inputVal;
              this.inputValData.code = "";
              this.inputValData.author = "";
            }else if(val == "股票"){
              this.inputValData.title = "";
              this.inputValData.content = "";
              this.inputValData.code = this.code;
              this.inputValData.author = "";
            }else if(val == "标题"){
              this.inputValData.title = this.inputVal;
              this.inputValData.content = "";
              this.inputValData.code = "";
              this.inputValData.author = "";
            }else if(val == "作者"){
              this.inputValData.title = "";
              this.inputValData.content = "";
              this.inputValData.code = "";
              this.inputValData.author = this.inputVal;
            }
          },
          emptyTabData(){
            this.tabData.reportTypes = '';
            this.tabData.ratingResult = '';
            this.tabData.organization = '';
            this.tabData.pageSize = '';
            this.tabData.begin = '';
            this.tabData.end = '';
          },
          async freeQuestionFun() {
              if(this.inputVal){
                let info = await freeQuestionService.freeQuestion({question:this.inputVal,d: 'j'})
                let type = info && info.info && info.info.answerResultType || ''
                if(type === '行业简介' || type === '行业数据'){
                  $('.freeQusetionBox').html('').append(info.content)
                  this.noData = false;
                }else {
                  $('.freeQusetionBox').html('')
                }
              }else {
                $('.freeQusetionBox').html('')
              }

          },
          //查看更多
          async infinity() {
            this.page.cp ++
            this.getData()
          },
          async getData(flag) {//查询列表
            this.loading = true;
            this.twoApiClik = flag || false;
            var data = {
              type: 'infomationMes',
              title: this.inputValData.title,
              content: this.inputValData.content,
              code:this.inputValData.code,
              author:this.inputValData.author,
              person: this.selectData.persons,
              stocks: this.selectData.stocks,
              industries: this.selectData.industries,
              dataTypes: 'REPORT',
              plainHighlightedFieldName: 'title,content',
              d: 'j',
              cp: this.page.cp,
              ps: this.page.ps,
              reportTypes:this.tabData.reportTypes,
              ratingResult:this.tabData.ratingResult,
              organization:this.tabData.organization,
              pageSize:this.tabData.pageSize,
              begin:this.tabData.begin,
              end:this.tabData.end
            };
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
                $('.appendBox_researchReport .listContent').html('').append(info.content);
              }else if(this.page.cp >1){
                $('.appendBox_researchReport .rxhBD_main').append(info.content);
              }else {
                $('.appendBox_researchReport .listContent').append(info.content);
              }
            }else {
              $('.appendBox_researchReport .listContent').html('');
              this.noData = true;
              this.moreData = false;
            }
          },
          //CommonSelect 按钮过滤时
          changeCommonSelect(val) {
            this.selectData.stocks = val.stocks || ''
            this.selectData.persons = val.persons || ''
            this.selectData.industries = val.industries || ''

            this.page.cp = 1;
            this.getData(true)
          },
          //tabSelect 按钮过滤时
          changeTab(val){
            this.tabData.reportTypes = val.reportTypesStr || ''
            this.tabData.ratingResult = val.ratingResultStr || ''
            this.tabData.organization = val.organizationStr || ''
            this.tabData.pageSize = val.pageStr || ''
            this.tabData.begin = val.begin || ''
            this.tabData.end = val.end || ''
            this.page.cp = 1;
            this.getData(true)
            this.$refs.commonSelectPage.fliteData(this.inputVal || '',4,true,this.tabData,this.inputValData)
          },
          showMsgFromChild(data){
              this.tabNameArr = data;
          }
        },
        mounted(){
            $('.rxhBD_main').css('marginBottom','0')
        }
    }
</script>

<style scoped>
  .appendBox_report{
    width: 100%;
    top: 6.1rem;
    background: #fff;
    z-index: 100000000000;
  }
   /* .appendBox_Common{
        padding: 0;
        background: #F6F6F6;
    }*/

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
      padding-top: 0.875rem;
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
    .freeQusetionBox{
      margin-top: 18.875rem;
      background: #ffffff;
      width: 100%;
    }
  .freeQusetionBox_noMenu{
    margin-top: 14.875rem;
    background: #ffffff;
    width: 100%;
  }
</style>
