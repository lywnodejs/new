<template><!--研报tab页面-->
  <div>
    <div class="rxhBD_menu" v-show="tabNameArr.length>0">
      <a class="rxhBD_menu_fold" @click="meunbtnClick()">
        <i :class="tabName=='研报类型'? 'rxh-icon-arrow6_t':'rxh-icon-arrow6_b'"></i>
      </a>
      <div class="rxhBD_menu_nav">
        <a v-for="(item,index) in tabNameArr"
           @click="tabbtnClick(index,item,$event)">{{item}}</a>
      </div>
      <div class="rxhBD_menu_shadow"></div>
    </div>
    <div class="rxhBD_menu_box" :class="tabName=='研报类型'? 'rxhBD_show':''">
      <div class="rxhBD_menu_content">
        <div class="rxhBD_menu_item" v-show="tabName=='研报类型'" :class=" tabName=='研报类型'?'rxh_show':'' ">
          <div class="rxhBD_menu_hd">
            <span>所有类型（{{menusArr.reportTypesArrLength}}）</span>
            <a class="rxhBD_btn_all" :class="reportTypesAllSelect?'rxhBD_btn_selected':''" @click="reportTypesAllClick()"><b></b></a>
          </div>
          <div class="rxhBD_menu_bd">
            <div class="rxhBD_menu_list rxhBD_menu_list2">
              <ul>
                <li v-for="(item,index) in reportTypesCheckboxNameArr" >
                  <div>
                    <span @click="reportTypesOneCheckboxClick(index,item,$event)"><!--@click="reportTypesOneCheckboxClick(index,item,$event)"-->
                      <i :class="item.selected?'rxh-icon-check':'rxh-icon-check_un'" @click="reportTypesOneCheckboxClick_i(index,item,$event)"></i>{{item.term}} ({{item.count}})
                    </span>
                    <b v-show="item.list.length>0" class="rxh-icon-arrow_d" @click="reportTypesOpenClick(index,item,$event)"></b>
                  </div>
                  <ul>
                    <li v-for="(item2,index2) in item.list">
                      <div>
                        <span @click="reportTypesTwoCheckboxClick(index,item,index2,item2,$event)"><!--@click="reportTypesTwoCheckboxClick(index,item,index2,item2,$event)"-->
                          <i :class="item2.selected?'rxh-icon-check':'rxh-icon-check_un'" @click="reportTypesTwoCheckboxClick_i(index,item,index2,item2,$event)"></i>{{item2.term | nameFormatter_}} ({{item2.count}})
                        </span>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="rxhBD_menu_item " v-show="tabName=='评级'" :class=" tabName=='评级'?'rxh_show':'' ">
          <div class="rxhBD_menu_bd">
            <div class="rxhBD_menu_grade">
              <a v-for="(item,index) in menusArr.ratingResultArr"
                 :class="setPJcolor(index,item)"
                 @click="pjClick(index,item)">
                <i :class="pjArr.includes(item)?'rxh-icon-check':'rxh-icon-check_un'"></i>{{item.term}}
              </a><!--（{{item.count}}）-->
            </div>
          </div>
        </div>
        <div class="rxhBD_menu_item " v-show="tabName=='研究机构'" :class=" tabName=='研究机构'?'rxh_show':'' ">
          <div class="rxhBD_menu_hd">
            <span>所有机构（{{menusArr.organizationArrLength}}）</span>
            <a class="rxhBD_btn_all" :class="organizationArr.length==menusArr.organizationArr.length?'rxhBD_btn_selected':''"
               @click="organizationAllClick()"><b></b></a>
          </div>
          <div class="rxhBD_menu_bd">
            <div class="rxhBD_menu_list rxhBD_menu_list1">
              <ul>
                <li v-for="(item,index) in menusArr.organizationArr" @click="organizationCheckboxClick(index,item)">
                  <div><span><i :class="organizationArr.includes(item)?'rxh-icon-check':'rxh-icon-check_un' "></i>{{item.term}}（{{item.count}}）</span></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="rxhBD_menu_item " v-show="tabName=='页数'" :class=" tabName=='页数'?'rxh_show':'' ">
          <div class="rxhBD_menu_hd">
            <span>所选页数</span>
          </div>
          <div class="rxhBD_menu_bd">
            <div class="rxhBD_menu_list rxhBD_menu_list1 rxhBD_menu_radio">
              <ul>
                <li v-for="(item,index) in menusArr.pageSizeArr" @click="pageCheckboxClick(index,item)">
                  <div><span><i :class="pageArr.includes(item)?'rxh-icon-check2_full':'rxh-icon-check2_un'"></i>{{item.termName}}（{{item.count}}）</span></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="rxhBD_menu_item " v-show="tabName=='时间'" :class=" tabName=='时间'?'rxh_show':''">
          <div class="rxhBD_menu_hd">
            <span>所选时间</span>
          </div>
          <div class="rxhBD_menu_bd">
            <div class="rxhBD_menu_list rxhBD_menu_list1 rxhBD_menu_radio">
              <ul>
                <li v-for="(item,index) in menusArr.timeArr" @click="timeCheckboxClick(index,item)">
                  <div><span><i :class="timeArr.includes(item)?'rxh-icon-check2_full':'rxh-icon-check2_un' "></i>{{item.term}}（{{item.count}}）</span></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="rxhBD_menu_btn">
        <a class="rxhBD_btn_clear" @click="clearBtnClick()">清除条件</a>
        <a class="rxhBD_btn_ok" @click="submitBtnClick()">确认</a>
      </div>
    </div>
    <div class="rxhBD_menu_bg" @click="menuBgClick()"></div>
  </div>
</template>

<script>
  import {infoevent, getStockName } from "../service";
  import {to_date} from "../lib/methods";
    export default {
        name: "reportTab",
      props:['topName'],
      data() {
        return {
          inputVal:"",
          selectionTabIndex:0,
          tabName:"",
          isselectTabIndex:0,
          menuEventIndex:0,//菜单图标按钮点击次数，判断菜单是否展开
          reportTypesAllSelect:false,

          tabNameArr:[],//格式["研报类型","评级","研究机构","页数","时间"],
          reportTypesCheckboxNameArr:[],//格式{term:"行业研究",count:"1234",selected:false,list:[{term:"行业研究_行业日报",count:"123",selected:false},{term:"行业研究_长期策略",count:"134",selected:false},{term:"行业研究_点评报告",count:"134",selected:false}]},

          reportTypesData:[//研报标准类型
            {term:"行业研究",list:["行业日报","长期策略","点评报告","深度研究","专题概念","动态报告"]},
            {term:"公司研究",list:["业绩点评","事件点评","深度研究","调研访谈","新股研究","动态研究"]},
            {term:"宏观研究",list:["宏观资讯","宏观点评","定期报告","宏观预测","专题报告"]},
            {term:"固定收益",list:["债市资讯","定价分析","定期报告","专题报告"]},
            {term:"金融工程",list:["市场统计","方法研究","量化分析","专题报告"]},
            {term:"基金研究",list:["基市资讯","仓位研究","定期报告","专题报告"]},
            {term:"金融衍生品",list:["贵金属","商品期货","权证","股指期货","外汇","金融期货","期权"]},
            {term:"策略研究",list:["短期策略","长期策略","专题策略"]},
            {term:"晨会纪要",list:["晨会纪要","早间资讯"]},
            {term:"商品期货",list:["农产品","能源","化工","贵金属","基本金属","物流","综合"]},
            {term:"预测评级",list:[]},
            {term:"投资参考",list:[]},
            {term:"投资组合",list:[]},
            {term:"投行研究",list:[]},
            {term:"理财",list:[]},
            {term:"金典报告",list:[]},
            ],
          reportTypesArr:[],//选中的研报类型数据
          pjArr:[],//选中的评级数据
          timeArr:[],//选中的时间数据
          pageArr:[],//选中的页码数据
          organizationArr:[],//选中的机构数据
          organizationAllBtnIndex:0,
          reportTypesAllBtnIndex:0,
          noMenuDataList:false,//menu无数据
          menusArr: {
            reportTypesArr: [],//研报类型
            ratingResultArr: [],//评级
            organizationArr: [],//机构
            pageSizeArr: [],//页码
            timeArr: [],//时间
            organizationArrLength:0//机构数据条数
          },
          //过滤参数
          responseArr: {
            begin:"",
            end:"",
            reportTypesArr: [],//研报类型
            ratingResultArr: [],//评级
            organizationArr: [],//机构
            pageArr: [],//页码
            reportTypesStr:"",
            ratingResultStr:"",
            organizationStr:"",
            pageStr:""
          },
          inputValData: {
            title: '',
            content: '',
            code: '',
            author: '',
          },
          topSelectedName:"",//研报头部下拉框选择项
          select_i:false,
          selectTwo_i:false,
        };
      },
      watch:{
        topName(val){
          //console.log("tab--tab===="+val);
          this.topSelectedName = val;
          this.initInputVal(val);
          this.initData();
        },
        tabNameArr(val){
          //console.log(val);
          this.$emit('listenToChildEvent',this.tabNameArr)
        },
        pjArr(val){
          let idx = this.tabNameArr.indexOf("评级");
          if(val.length !== 0){
            $('.rxhBD_menu_nav').find('a').eq(idx).addClass('rxhBD_selected')
          }else{
            $('.rxhBD_menu_nav').find('a').eq(idx).removeClass('rxhBD_selected')
          }
        },
        timeArr(val){
          let idx = this.tabNameArr.indexOf("时间");
          if(val.length !== 0){
            $('.rxhBD_menu_nav').find('a').eq(idx).addClass('rxhBD_selected')
          }else{
            $('.rxhBD_menu_nav').find('a').eq(idx).removeClass('rxhBD_selected')
          }
        },
        pageArr(val){
          let idx = this.tabNameArr.indexOf("页数");
          if(val.length !== 0){
            $('.rxhBD_menu_nav').find('a').eq(idx).addClass('rxhBD_selected')
          }else{
            $('.rxhBD_menu_nav').find('a').eq(idx).removeClass('rxhBD_selected')
          }
        },
        organizationArr(val){
          let idx = this.tabNameArr.indexOf("研究机构");
          if(val.length !== 0){
            $('.rxhBD_menu_nav').find('a').eq(idx).addClass('rxhBD_selected')
          }else{
            $('.rxhBD_menu_nav').find('a').eq(idx).removeClass('rxhBD_selected')
          }
        },
        reportTypesArr:{//深度监听，可监听到对象、数组的变化
          handler(val, oldVal){
            //是否有选中项
            for(let i = 0;i<this.reportTypesArr.length;i++){
              if(this.reportTypesArr[i].selected == true){
                $('.rxhBD_menu_nav').find('a').eq(0).addClass('rxhBD_selected');
                return;
              }else{
                $('.rxhBD_menu_nav').find('a').eq(0).removeClass('rxhBD_selected');
                if(this.reportTypesArr[i].hasOwnProperty("list")){
                  if(this.reportTypesArr[i].list.length>0){
                    for(let j = 0;j<this.reportTypesArr[i].list.length;j++){
                      if(this.reportTypesArr[i].list[j].selected  == true){
                        $('.rxhBD_menu_nav').find('a').eq(0).addClass('rxhBD_selected')
                        return;
                      }else{
                        $('.rxhBD_menu_nav').find('a').eq(0).removeClass('rxhBD_selected')
                      }
                    }
                  }
                }
              }
            }
          },
          deep:true //true 深度监听
        }
      },
      filters:{
        nameFormatter_(val){
          //研报  研报类型  二级类型名称过滤器
          if (!val) return ''
          val = val.toString()
          return val.split("_")[1]
        }
      },
      methods: {
        //承接父页面
        fliteData(data) {
          this.inputVal = data.inputVal;
          this.inputValData = data.inputValData;
          this.initData();
          this.getMenuData();
        },
        initData(){
          this.selectionTabIndex = 0;
          this.isselectTabIndex = 0;
          this.menuEventIndex = 0;
          this.tabName="";
          this.tabNameArr=[];
          this.reportTypesArr=[];
          this.pjArr=[];
          this.timeArr=[];
          this.pageArr=[];
          this.organizationArr=[];
          this.reportTypesAllSelect =false;
          this.organizationAllBtnIndex=0;
          this.reportTypesAllBtnIndex=0;
          this.noMenuDataList=false;

          this._menu_box_slideUp();
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
            this.inputValData.code = this.inputVal;
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
          //评级btn初始样式
        setPJcolor(i,item){
          let color=''
          color = item.className;

          if(this.pjArr.includes(item)){
            color = color +' rxhBD_selected'
          }
          return color
        },
        pjClick(i,item){
          this.selectionTabIndex = i;
          let idx = this.pjArr.indexOf(item);
          let _t = this;
          if(idx !== -1){
            this.pjArr.splice(idx,1);
          }else{
            this.pjArr.push(item);
          }
        },
        timeCheckboxClick(i,item){
          let len = this.timeArr.length;
          let idx = this.timeArr.indexOf(item);
          if(len > 0){
            if(idx !== -1){
              this.timeArr.splice(idx,1);
            }else{
              this.timeArr = [];
              this.timeArr.push(item);
            }
          }else{
            this.timeArr.push(item);
          }
        },

        pageCheckboxClick(i,item){
          let len = this.pageArr.length;
          let idx = this.pageArr.indexOf(item);
          if(len > 0){
            if(idx !== -1){
              this.pageArr.splice(idx,1);
            }else{
              this.pageArr = [];
              this.pageArr.push(item);
            }
          }else{
            this.pageArr.push(item);
          }
        },
        organizationCheckboxClick(i,item){
          let idx = this.organizationArr.indexOf(item);
          let _t = this;
          if(idx !== -1){
            this.organizationArr.splice(idx,1);
          }else{
            this.organizationArr.push(item);
          }
        },
        organizationAllClick(){
          this.organizationAllBtnIndex++;
          if(this.organizationAllBtnIndex % 2 == 0){
            this.organizationArr =[];
          }else{//全选
            for(let i= 0;i<this.menusArr.organizationArr.length;i++){
              this.organizationArr.push(this.menusArr.organizationArr[i]);
            }
          }
        },
        reportTypesOneCheckboxClick(i,item,event){
          if(this.select_i == false){
            this.reportTypesArr = this.reportTypesCheckboxNameArr;
            //let idx = this.reportTypesArr.indexOf(item);
            let target = event.target;
            if( item.selected == false){
              item.selected = true;
              if(item.list.length>0){
                for(let i = 0;i<item.list.length;i++){
                  item.list[i].selected = true;
                }
              }
            }
            else{
              item.selected = false;
              if(item.list.length>0){
                for(let i = 0;i<item.list.length;i++){
                  item.list[i].selected = false;
                }
              }
            }
            this.reportTypesAllSelect = true;
            for(let i = 0;i<this.reportTypesArr.length;i++){
              if(this.reportTypesArr[i].selected == false){
                this.reportTypesAllSelect = false;
                return;
              }
            }
          }
          this.select_i = false;
        },
        reportTypesOneCheckboxClick_i(i,item,event){
          this.select_i = true;
          this.select_i_index = i;
          this.reportTypesArr = this.reportTypesCheckboxNameArr;
          //let idx = this.reportTypesArr.indexOf(item);
          let target = event.target;
          if( item.selected == false){
            item.selected = true;
            if(item.list.length>0){
              for(let i = 0;i<item.list.length;i++){
                item.list[i].selected = true;
              }
            }
          }
          else{
            item.selected = false;
            if(item.list.length>0){
              for(let i = 0;i<item.list.length;i++){
                item.list[i].selected = false;
              }
            }
          }
          this.reportTypesAllSelect = true;
          for(let i = 0;i<this.reportTypesArr.length;i++){
            if(this.reportTypesArr[i].selected == false){
              this.reportTypesAllSelect = false;
              return;
            }
          }
        },
        reportTypesTwoCheckboxClick(i_one,item_one,i_two,item_two,event){
          if(this.selectTwo_i == false){
            let idx = this.reportTypesArr.indexOf(item_one);
            let target = event.target;
            if(idx !== -1){
              if( $(target).find("i").hasClass("rxh-icon-check_un")){
                this.reportTypesArr[idx].selected =true;
                this.reportTypesArr[idx].list[i_two].selected =true;
                if(this.reportTypesArr[idx].list.length>0){
                  for(let i = 0;i<this.reportTypesArr[idx].list.length;i++){
                    if(this.reportTypesArr[idx].list[i].selected==false){
                      this.reportTypesArr[idx].selected = false;
                    }
                  }
                }
              }
              else{
                this.reportTypesArr[idx].selected =false;
                this.reportTypesArr[idx].list[i_two].selected =false;
                this.reportTypesAllSelect = false;
              }
            }else{
              item_one.list[i_two].selected =true;
              this.reportTypesArr.push(item_one);
            }
            this.reportTypesAllSelect = true;
            for(let i = 0;i<this.reportTypesArr.length;i++){
              if(this.reportTypesArr[i].selected == false){
                this.reportTypesAllSelect = false;
                return;
              }
            }
          }
          this.selectTwo_i = false;
        },
        reportTypesTwoCheckboxClick_i(i_one,item_one,i_two,item_two,event){
          this.selectTwo_i = true;
          let idx = this.reportTypesArr.indexOf(item_one);
          let target = event.target;
          if(idx !== -1){
            if( $(target).hasClass("rxh-icon-check_un")){
              this.reportTypesArr[idx].selected =true;
              this.reportTypesArr[idx].list[i_two].selected =true;
              if(this.reportTypesArr[idx].list.length>0){
                for(let i = 0;i<this.reportTypesArr[idx].list.length;i++){
                  if(this.reportTypesArr[idx].list[i].selected==false){
                    this.reportTypesArr[idx].selected = false;
                  }
                }
              }
            }
            else{
              this.reportTypesArr[idx].selected =false;
              this.reportTypesArr[idx].list[i_two].selected =false;
              this.reportTypesAllSelect = false;
            }
          }else{
            item_one.list[i_two].selected =true;
            this.reportTypesArr.push(item_one);
          }
          this.reportTypesAllSelect = true;
          for(let i = 0;i<this.reportTypesArr.length;i++){
            if(this.reportTypesArr[i].selected == false){
              this.reportTypesAllSelect = false;
              return;
            }
          }
        },
        reportTypesAllClick(){
          this.reportTypesAllBtnIndex++;
          this.reportTypesArr = this.reportTypesCheckboxNameArr;
          if(this.reportTypesAllBtnIndex % 2 == 0){
            this.reportTypesAllSelect = false;
            for(let i = 0;i<this.reportTypesArr.length;i++){
              this.reportTypesArr[i].selected = false;
              if(this.reportTypesArr[i].hasOwnProperty("list")){
                if(this.reportTypesArr[i].list.length>0){
                  for(let j = 0;j<this.reportTypesArr[i].list.length;j++){
                    this.reportTypesArr[i].list[j].selected = false;
                  }
                }
              }
            }
          }else{//全选
            this.reportTypesAllSelect = true;

            for(let i = 0;i<this.reportTypesArr.length;i++){
              this.reportTypesArr[i].selected = true;
              if(this.reportTypesArr[i].hasOwnProperty("list")){
                if(this.reportTypesArr[i].list.length>0){
                  for(let j = 0;j<this.reportTypesArr[i].list.length;j++){
                    this.reportTypesArr[i].list[j].selected = true;
                  }
                }
              }
            }
          }
        },
        reportTypesOpenClick(index,item,event){
          let target = event.target;
          if( $(target).hasClass("rxh-icon-arrow_d")){
            $(target).attr("class","rxh-icon-arrow_t");
            $(target).parents("li").siblings().find("b").attr("class", "rxh-icon-arrow_d");
            $(target).parents("li").siblings().find("ul").slideUp(300);

            $(target).parent().next("ul").slideDown(300);
          }else{
            $(target).attr("class","rxh-icon-arrow_d");
            $(target).parent().next("ul").slideUp(300);
          }
        },
        // 点击遮罩层，关闭
        menuBgClick(){
          this._menu_box_slideUp();
        },
        // 菜单标签切换
        meunbtnClick() {
          this.menuEventIndex++;
          if(this.menuEventIndex == 1){
            $(".rxhBD_menu_nav a").eq(0).addClass("rxhBD_on");
          }
          $(".rxhBD_menu_box").slideToggle(300);

          if( !$(".rxhBD_menu_box").hasClass("rxhBD_show")){
            this._menu_box_show();
            this.tabName = "研报类型";
          }else{
            this.tabName = "";
            this._menu_box_hide();
          }
        },
        tabbtnClick(index,item,event){
          let target = event.target;
          this.tabName = item;
          this.isselectTabIndex = index;
          $(target).addClass("rxhBD_on").siblings().removeClass("rxhBD_on");

          if( !$(".rxhBD_menu_box").hasClass("rxhBD_show")){
            this._menu_box_show();
            $(".rxhBD_menu_box").slideDown(300);

            $(".rxhBD_menu_fold").find("i").attr("class", "rxh-icon-arrow6_t");
          }
          //$(".rxhBD_menu_content .rxhBD_menu_item").eq(index).addClass("rxh_show").siblings().removeClass("rxh_show");
        },
        // 菜单显示、隐藏
        _menu_box_show(){
          $(".rxhBD_menu_bg").show();
          $(".rxhBD_menu_box").addClass("rxhBD_show");
        },
        // 菜单显示、隐藏
        _menu_box_slideUp(){
          $(".rxhBD_menu_fold i").attr("class", "rxh-icon-arrow6_b");
          $(".rxhBD_menu_box").slideUp(300);
          this._menu_box_hide();
          this. _menu_nav_un_on();
        },
        // 清除 当前
        _menu_nav_un_on(){
          $(".rxhBD_menu_nav a").each(function () {
            $(this).removeClass("rxhBD_on");
          });
        },
        // 菜单显示、隐藏
        _menu_box_hide(){
          $(".rxhBD_menu_bg").hide();
          $(".rxhBD_menu_box").removeClass("rxhBD_show");
        },
        // 清除 已选
        _menu_nav_un_selected(){
          $(".rxhBD_menu_nav a").each(function () {
            $(this).removeClass("rxhBD_selected");
          });
        },
        returnResponseArr(arr){
          let resArr = []
          for (let i = 0; i < arr.length; i++) {
            resArr.push(arr[i].term);
          }
          return resArr
        },
        returnResponseTimeArr(arr){
          let timestamp=new Date().getTime();//当前时间戳
          let sdtime = "";
          for (let i = 0; i < arr.length; i++) {
            if(arr[i].term == "1周内"){
              sdtime = new Date()-7*24*3600*1000;
            }else if(arr[i].term == "1月内"){
              sdtime = new Date().setMonth(new Date().getMonth()-1);
            }else if(arr[i].term == "3月内"){
              sdtime = new Date().setMonth(new Date().getMonth()-3);
            }else if(arr[i].term == "半年内"){
              sdtime = new Date().setMonth(new Date().getMonth()-6);
            }else if(arr[i].term == "两年内"){
              sdtime=new Date().setFullYear((new Date().getFullYear()-2));
            }
            else if(arr[i].term == "全部"){
              sdtime= "";
            }
          }
          this.responseArr.begin= sdtime;
          this.responseArr.end= "";
        },
        returnResponseReportTypesArr(arr){
          let resArr = []
          for (let i = 0; i < arr.length; i++) {
            if(arr[i].selected == true){
              resArr.push(arr[i].term);
            }else{
              if(arr[i].hasOwnProperty("list")){
                if(arr[i].list.length > 0){
                  for(let j = 0; j < arr[i].list.length; j++){
                    if(arr[i].list[j].selected == true){
                      resArr.push(arr[i].list[j].term);
                    }
                  }
                }
              }
            }
          }
          return resArr
        },
        returnString(arr){
          let resStr = ""
          for (let i = 0; i < arr.length; i++) {
            resStr += arr[i]+","
          }
          return resStr
        },
        // 清除按钮
        clearBtnClick(){
          this.pjArr =[];
          this.timeArr =[];
          this.pageArr =[];
          this.organizationArr =[];
          //研报类型
          for(let i = 0;i<this.reportTypesArr.length;i++){
            this.reportTypesArr[i].selected = false;
            if(this.reportTypesArr[i].hasOwnProperty("list")){
              if(this.reportTypesArr[i].list.length>0){
                for(let j = 0;j<this.reportTypesArr[i].list.length;j++){
                  this.reportTypesArr[i].list[j].selected = false;
                }
              }
            }
          }

        },
        // 确认按钮
        submitBtnClick(){
          this._menu_box_slideUp();
          this.responseArr.ratingResultArr= this.returnResponseArr(this.pjArr);
          this.responseArr.pageArr= this.returnResponseArr(this.pageArr);
          this.responseArr.organizationArr= this.returnResponseArr(this.organizationArr);
          //时间格式化
          this.returnResponseTimeArr(this.timeArr);
          //研报格式化
          this.responseArr.reportTypesArr = this.returnResponseReportTypesArr(this.reportTypesArr);

          this.responseArr.reportTypesStr = this.returnString(this.responseArr.reportTypesArr);
          this.responseArr.ratingResultStr = this.returnString(this.responseArr.ratingResultArr);
          this.responseArr.organizationStr = this.returnString(this.responseArr.organizationArr);
          this.responseArr.pageStr = this.returnString(this.responseArr.pageArr);

          let _t = this;
          _t.$emit("changeTab", {
            reportTypesStr: _t.responseArr.reportTypesStr,
            ratingResultStr: _t.responseArr.ratingResultStr,
            organizationStr: _t.responseArr.organizationStr,
            pageStr: _t.responseArr.pageStr,
            begin: _t.responseArr.begin,
            end: _t.responseArr.end,
          });
        },
        //统计接口菜单数据
        async getMenuData() {
          let data = {
            title: this.inputValData.title,
            content: this.inputValData.content,
            code: this.inputValData.code,
            author: this.inputValData.author,
            facetFields: "reportTypes,ratingResult,organization,pageSize,publishAt",
            facetSize: 200,
            cp: 1,
            ps: 0,
            dataTypes:"REPORT"
          };
          let info = await infoevent.getCommonSelect(data);
          let dataRes = (info && info.data && info.data.facetResults) || [];
          if(!dataRes.length){
            this.noMenuDataList = true;
          }
          this.menusArr.reportTypesArr = this.returnTypeArr(dataRes, "reportTypes");
          this.menusArr.ratingResultArr = this.returnTypeArr(dataRes, "ratingResult");
          this.menusArr.organizationArr = this.returnTypeArr(dataRes, "organization");
          this.menusArr.pageSizeArr = this.returnTypeArr(dataRes, "pageSize");
          this.menusArr.timeArr = this.returnTypeArr(dataRes, "publishAt");

          this.menusArr.reportTypesArrLength = this.returnTypeArrLenght(dataRes, "reportTypes");
          this.menusArr.organizationArrLength = this.returnTypeArrLenght(dataRes, "organization");

          this.menusArr.ratingResultArr = this.returnPJArrFormatter(this.menusArr.ratingResultArr);
          this.menusArr.pageSizeArr = this.returnPageArrFormatter(this.menusArr.pageSizeArr);
          this.menusArr.reportTypesArr = this.returnReportTypesArrFormatter(this.menusArr.reportTypesArr);
          this.reportTypesCheckboxNameArr = this.menusArr.reportTypesArr;
          if(this.menusArr.reportTypesArrLength >0){
            this.tabNameArr.push("研报类型");
          }
          if(this.menusArr.ratingResultArr.length >0){
            this.tabNameArr.push("评级");
          }
          if(this.menusArr.organizationArr.length >0){
            this.tabNameArr.push("研究机构");
          }
          if(this.menusArr.pageSizeArr.length >0){
            this.tabNameArr.push("页数");
          }
          if(this.returnTypeArrLenght(dataRes, "publishAt") >0){
            this.tabNameArr.push("时间");
          }
        },
        returnTypeArr(arr, str) {
          let resArr = []
          for (let i = 0; i < arr.length; i++) {
            if (str == arr[i].name) {
              resArr =  arr[i].entries;
              /*if(str == "publishAt"){
                resArr.push({count:arr[i].totalCount,term:"所有时间"});
              }*/
            }
          }
          return resArr
        },
        returnTypeArrLenght(arr, str) {
          let length =0;
          for (let i = 0; i < arr.length; i++) {
            if (str == arr[i].name) {
              length =  arr[i].totalCount;
            }
          }
          return length
        },
        returnPJArrFormatter(arr){
          let resArr = [];
          let resArr2 = [];
          let pjArr = ["买入","增持","中性","减持","卖出"];
          for (let i = 0; i < arr.length; i++) {
            if(arr[i].term !== "优于大市" && arr[i].term !== "同步大市" && arr[i].term !== "弱于大市"){
              resArr.push(arr[i]);
            }
          }
          for (let i = 0; i < pjArr.length; i++) {
            for(let j = 0; j < resArr.length; j++){
              if(pjArr[i] == resArr[j].term){
                let temp ={};
                temp.count = resArr[j].count;
                temp.term = resArr[j].term;
                if(pjArr[i] == "买入" || pjArr[i] == "增持"){
                  temp.className = "rxhBD_red";
                }else if(pjArr[i] == "中性"){
                  temp.className = "rxhBD_yellow";
                }else if(pjArr[i] == "减持" || pjArr[i] == "卖出"){
                  temp.className = "rxhBD_green";
                }
                resArr2.push(temp);
              }
            }
          }
          return resArr2;
        },
        returnPageArrFormatter(arr){
          let resArr = [];
          for (let i = 0; i < arr.length; i++) {
            let itemArr = arr[i].term.split(":");
            let item = "";
            let temp = {};
            temp.count = arr[i].count;
            temp.term = arr[i].term;
            if(itemArr[0] == 0){
              item = "小于"+itemArr[1]+"页";
            }else if(itemArr[1] == ""){
              item = "大于"+itemArr[0]+"页";
            }else{
              item = itemArr[0]+"-"+itemArr[1]+"页";
            }
            temp.termName = item;
            resArr.push(temp);
          }
          return resArr;
        },
        returnReportTypesArrFormatter(arr){
          let resArr = [];
          for(let i = 0; i < arr.length; i++){
            let item = arr[i].term;
            let oneObj = {};
            oneObj.count = arr[i].count;
            oneObj.selected = false;
            if(item.indexOf(";")){
              let itemArr = item.split(";");
              oneObj.term = itemArr[0].split(":")[0];
              oneObj.list = [];
              for(let j = 1; j < itemArr.length; j++){
                let itemArritem = itemArr[j];
                if(itemArritem.indexOf("_")){
                  let twoObj = {};
                  twoObj.term = itemArritem.split(":")[0];
                  twoObj.count = itemArritem.split(":")[1];
                  twoObj.selected = false;
                  oneObj.list.push(twoObj)
                }
              }
            }else{
              oneObj.term = arr[i].term.split(":")[0];
              oneObj.list = [];
            }
            resArr.push(oneObj)
          }
          return resArr;
        },
      },
      mounted() {
        $('.rxhBD_all_bd_ul li').css('height','2.13rem')
        $('.rxhBD_all_bd').css('minHeight','7.25rem');
        // 页面滚动展开收起 过滤栏
        $(window).scroll(function() {
          let rxh_scrollT = $(this).scrollTop();

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

      }
    }
</script>

<style scoped>

</style>
