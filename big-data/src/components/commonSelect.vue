<template>
  <div>
    <div class="appendBox_comSelect">
      <!-- 过滤 -->

      <div class="rxhBD_filter">
        <!-- 过滤全部 -->
        <div class="rxhBD_all">
          <ul class="rxhBD_all_hd">
            <li>相关股票：</li>
            <li>相关人物：</li>
            <li>相关产业：</li>
          </ul>
          <ul class="rxhBD_all_bd rxhBD_all_bd_ul">
            <li>
              <a
                :class=" checkbox.includes(item.stkCode)?'rxhBD_on':'' "
                v-for="(item,index) in resStockNameArr"
                @click="changeStocks(index,item)"
              >{{item.stkName}}</a>
              <span class="noSelectList" v-show="stocksLen">暂无</span>
            </li>
            <li>
              <a
                :class=" checkboxPerson.includes(item.term)?'rxhBD_on':'' "
                v-for="(item,index) in commonArr.personsArr"
                @click="changePersons(index,item)"
              >{{item.term}}</a>
              <span class="noSelectList" v-show="personsLen">暂无</span>
            </li>
            <li>
              <a
                :class=" checkboxIndustries.includes(item.term)?'rxhBD_on':'' "
                v-for="(item,index) in commonArr.dustriesArr"
                @click="changeDustries(index,item)"
              >{{item.term}}</a>
              <span class="noSelectList" v-show="commonArr.dustriesArr.length ===0">暂无</span>
            </li>
          </ul>
        </div>

        <!-- 过滤结果 -->
        <div class="rxhBD_result">
          <span>全部股票</span>·
          <span>全部人物</span>·
          <span>全部产业</span>
          <i class="icon-arrow_D"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {infoevent, getStockName } from "../service";
import store from "../store"
export default {
  name: "commonSelect",
  data() {
    return {
      isgetData: true,
      inputVal: "",
      commonArr: {
        stocksArr: [],
        personsArr: [],
        dustriesArr: []
      },
      commonSelectData: {
        stocks: [],
        persons: [],
        industries: []
      },
      resStockNameArr: [],
      checkbox: [],
      checkboxPerson: [],
      checkboxIndustries: [],
      noDataList: false,
      resStocksStr: '',
      resPersonsStr: '',
      resIndustriesStr: '',
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
    };
  },
  methods: {
    fliteData(inputVal,type,ifInit,tabData,inputValData) {
      this.inputVal = inputVal;
      if(ifInit){
        this.checkbox = [];
        this.checkboxPerson = [];
        this.checkboxIndustries = [];

      }
      if(ifInit && type == 4){//研报
        this.tabData = tabData;
        this.inputValData = inputValData;
      }else{
        this.inputValData.title = this.inputVal;
        this.inputValData.content = this.inputVal;
        this.inputValData.code = "";
        this.inputValData.author = "";
      }
      if(type == 1){
        this.commonApiDataType = 'NEWS,GREAT_WISDOM_DATA';
      } else if(type == 2){
        this.commonApiDataType = 'NOTICE';
      }else if(type == 4){
        this.commonApiDataType = 'REPORT';
      }else if(type == 0){
        this.commonApiDataType = '';
      }
      this.getData();
    },
    async getData(callback) {
      var data = {
        title: this.inputValData.title,
        content: this.inputValData.content,
        code:this.inputValData.code,//this.inputVal,
        facetFields: "persons,stocks,industries",
        facetSize: 50,
        ps: 0,
        dataTypes: this.commonApiDataType,
        person: this.checkboxPerson.length ? this.checkboxPerson.join(',') : '',
        stocks: this.checkbox.length ? this.checkbox.join(',') : '',
        industries: this.checkboxIndustries.length ? this.checkboxIndustries.join(',') : '',
        onlyFacet: '1',
        reportTypes:this.tabData.reportTypes,
        ratingResult:this.tabData.ratingResult,
        organization:this.tabData.organization,
        pageSize:this.tabData.pageSize,
        begin:this.tabData.begin,
        end:this.tabData.end
      };
      let info = await infoevent.getCommonSelect(data);
      let dataRes = (info && info.data && info.data.facetResults) || [];
      if(!dataRes.length){
        this.noDataList = true;
      }
      this.commonArr.stocksArr = this.returnTypeArr(dataRes, "stocks");
      this.commonArr.personsArr = this.returnTypeArr(dataRes, "persons");
      this.commonArr.dustriesArr = this.returnTypeArr(
        dataRes,
        "industries"
      );
      callback && callback()
      this.getStockName() //调用接口获取股票名称
    },
    changeStocks(i,item) {
      var idx = this.checkbox.indexOf(item.stkCode);
      let _t = this;
      if(idx !== -1){
        this.checkbox.splice(idx,1);
        //let valIndex = this.commonSelectData.stocks.indexOf(item.stkCode);
        //this.commonSelectData.stocks.splice(valIndex,1)
      }else{
        this.checkbox.push(item.stkCode);
        //this.commonSelectData.stocks.push(item.stkCode)
      }

      //将最终被选中的，页面中却没有的值过滤
      this.getData(()=>{
        _t.resStocksStr = _t.Util.findRepeatArr(_t.checkbox,_t.commonArr.stocksArr);
        _t.resPersonsStr = _t.Util.findRepeatArr(_t.checkboxPerson,_t.commonArr.personsArr);
        _t.resIndustriesStr = _t.Util.findRepeatArr(_t.checkboxIndustries,_t.commonArr.dustriesArr);
        _t.$emit("changeCommonSelect", {
            stocks: _t.resStocksStr,
            persons: _t.resPersonsStr,
            industries: _t.resIndustriesStr
        });
      });
    },
    changePersons(i,item) {
        let _t = this;
        var idx = this.checkboxPerson.indexOf(item.term);
        if(idx !== -1){
          this.checkboxPerson.splice(idx,1);
        }else{
          this.checkboxPerson.push(item.term);
        }
        this.getData(()=>{
          _t.resStocksStr = _t.Util.findRepeatArr(_t.checkbox,_t.commonArr.stocksArr);
          _t.resPersonsStr = _t.Util.findRepeatArr(_t.checkboxPerson,_t.commonArr.personsArr);
          _t.resIndustriesStr = _t.Util.findRepeatArr(_t.checkboxIndustries,_t.commonArr.dustriesArr);
          _t.$emit("changeCommonSelect", {
              stocks: _t.resStocksStr,
              persons: _t.resPersonsStr,
              industries: _t.resIndustriesStr
          });
        });
    },
    changeDustries(i,item) {
        let _t = this;
        var idx = this.checkboxIndustries.indexOf(item.term);
        if(idx !== -1){
          this.checkboxIndustries.splice(idx,1);
        }else{
          this.checkboxIndustries.push(item.term);
        }
        this.getData(()=>{
          _t.resStocksStr = _t.Util.findRepeatArr(_t.checkbox,_t.commonArr.stocksArr);
          _t.resPersonsStr = _t.Util.findRepeatArr(_t.checkboxPerson,_t.commonArr.personsArr);
          _t.resIndustriesStr = _t.Util.findRepeatArr(_t.checkboxIndustries,_t.commonArr.dustriesArr);
          _t.$emit("changeCommonSelect", {
              stocks: _t.resStocksStr,
              persons: _t.resPersonsStr,
              industries: _t.resIndustriesStr
          });
        });
    },
    returnTypeArr(arr, str) {
      let resArr = []
      for (let i = 0; i < arr.length; i++) {
        if (str == arr[i].name) {
          resArr =  arr[i].entries;
        }
      }
      return resArr
    },
    async getStockName() {
      let stockArr = this.commonArr.stocksArr || [];
      let stocksCode = [],
        stocksCodeStr = null;
      if(stockArr.length > 0){
        for(let i = 0; i<stockArr.length; i++){
          if(stockArr[i].term.substr(0,1) == "0" || stockArr[i].term.substr(0,1) == "3"){
            stocksCode.push('sz' + stockArr[i].term)
          }else {
            stocksCode.push('sh' + stockArr[i].term)
          }

        }
      }
      stocksCodeStr =  stocksCode.join()
      if(stocksCodeStr.length>0){
        let data = {
          symbol: stocksCodeStr
        }
        let info = await getStockName.getStockName(data);
        this.resStockNameArr = info.items || [];
      }else{
        this.resStockNameArr = [];
      }
    }
  },
  mounted() {
      $('.rxhBD_all_bd_ul li').css('height','2.13rem')
      $('.rxhBD_all_bd').css('minHeight','7.25rem');
    // 页面滚动展开收起 过滤栏
    $(window).scroll(function() {
      var rxh_scrollT = $(this).scrollTop();

      if (rxh_scrollT > 95) {
        $(".rxhBD_filter .rxhBD_all").slideUp(200);
        $(".rxhBD_filter .rxhBD_result").slideDown(200);
      } else {
        $(".rxhBD_filter .rxhBD_all").slideDown(200);
        $(".rxhBD_filter .rxhBD_result").slideUp(200);
      }
    });

    // 点击过滤结果，显示过滤全部
    $(".rxhBD_filter .rxhBD_result").click(function() {
      $(".rxhBD_filter .rxhBD_all").slideDown(200);
      $(".rxhBD_filter .rxhBD_result").slideUp(200);
    });
  },
  computed:{
    stocksLen(){
      return this.resStockNameArr.length === 0
    },
    personsLen(){
      return this.commonArr.personsArr.length === 0
    }
  }
};
</script>

<style scoped>
.appendBox_info {
  width: 100%;
  height: auto;
  position: fixed;
  top: 6.1rem;
}
.noSelectList{
    display: block;
    font-size: 0.938rem;
    line-height: 2.13rem;
    margin-left: .7rem;
}
/*.rxhBD_filter .rxhBD_all .rxhBD_all_hd{
  top: .2rem;
}*/
/*.rxhBD_filter .rxhBD_all .rxhBD_all_hd li{
  line-height: 2.13rem;
  padding: 0;
  padding-left:.875rem;
  margin-top: .625rem;
}
.rxhBD_filter .rxhBD_all .rxhBD_all_hd li:nth-child(1){
  margin-top: .525rem;
}
.rxhBD_filter .rxhBD_all .rxhBD_all_hd li:nth-child(2){
  margin: .525rem 0;
}*/
</style>
