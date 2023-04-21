<template>
<div class="yysb">
    <header>
        <ul>
            <li :class=" tabshow ? 'header_li_click' : ''" @click="tabshow=true,tab()">语义识别</li>    
            <li :class=" !tabshow ? 'header_li_click' : ''" @click="tabshow=false,tab()">意图热度</li>
        </ul>
    </header>
    <div v-show="tabshow">
        <main>
            <div class="box">
                <div v-for="(item,index) in items">
                    <div class="right"><span>{{item.left}}</span></div>
                    <div class="left">
                        <p class="title">问题意图</p>
                        <p class="info">{{item.right.type}}</p>
                        <div class="line"></div>
                        <p class="title title_ys">知识库要素</p>
                        <table>
                            <tbody>
                                <tr v-for="(item_,index_) in item.right.item">
                                    <td valign="middle">{{item_[0]}}</td>
                                    <td valign="middle">{{item_[1]}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
        <div class="footer">
            <input type="text" v-model="text" placeholder="请输入..." @keyup.enter="send()" @focus="focus_()">  <button @click="send()"></button>  
        </div>
    </div>
    <!-- //意图 -->
    <div class="yitu" v-show="!tabshow">
        <ul>
            <li v-for="(item,index) in hotData" @click="to_info(item)">
                <span>{{index+1}}</span>
                <span>{{item.text}}</span>
                <span>{{item.num}}热度</span>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import { yysbClientService2 } from '../../service/client/index.js';
export default {
    layout:'yysb',
    head:{
        title:'语义识别'
    },
    data(){
        return {
            tabshow:true,
            text:'',
            off:false,
            hotData:[
                {"text":"催单处理","num":"58313"},{"text":"充值缴费处理","num":"45701"},{"text":"取消订单处理","num":"34099"},{"text":"业务办理异常处理","num":"25136"},{"text":"号卡释放","num":"17916"},{"text":"资源配置异常处理","num":"16332"},{"text":"优惠异常处理","num":"9605"},{"text":"审核请求","num":"8126"},{"text":"在途单异常处理","num":"7014"},{"text":"退款处理","num":"6286"},{"text":"工号权限处理","num":"5429"},{"text":"订单归档请求","num":"5164"},{"text":"号码续用","num":"4681"},{"text":"安装处理请求","num":"4670"},{"text":"身份信息修改请求","num":"3968"},{"text":"系统异常处理","num":"3791"},{"text":"业务退订处理","num":"3398"},{"text":"验证异常","num":"3164"},{"text":"资费标准","num":"3158"},{"text":"优惠活动查询","num":"3079"},{"text":"网络异常处理","num":"3023"},{"text":"电话呼叫异常处理","num":"2971"},{"text":"测速不达标处理","num":"2775"},{"text":"业务产品加改咨询","num":"2754"},{"text":"优惠活动办理","num":"2419"},{"text":"串号请求释放","num":"2396"},{"text":"业务办理流程查询","num":"2262"},{"text":"客户信息查询","num":"2198"},{"text":"空单流转","num":"2150"},{"text":"补卡故障","num":"2130"},{"text":"串号领用异常","num":"2108"},{"text":"业务续费异常处理","num":"1965"},{"text":"订单受理人信息查询","num":"1937"},{"text":"发票信息修改","num":"1664"},{"text":"社保续延","num":"1598"},{"text":"发票打印异常处理","num":"1597"},{"text":"计费失败处理","num":"1487"},{"text":"验证申请","num":"1485"},{"text":"派发工单异常处理","num":"1473"},{"text":"申请免拍照免读卡","num":"1369"},{"text":"退单原因查询","num":"1354"},{"text":"无纸化故障处理请求","num":"1350"},{"text":"密码查询变更处理","num":"1319"},{"text":"开缓装库","num":"1269"},{"text":"社保登录","num":"1195"},{"text":"保底信息查询","num":"1169"},{"text":"积分兑换","num":"1167"},{"text":"费用明细查询","num":"1163"},{"text":"流转环节查询","num":"1047"},{"text":"工号密码重置","num":"979"},{"text":"订单修改故障","num":"971"},{"text":"订单业务信息查询","num":"950"},{"text":"工号密码重置异常","num":"932"},{"text":"业务生效时间查询异常","num":"893"},{"text":"归档异常","num":"886"},{"text":"网络注册异常处理","num":"871"},{"text":"会员权益异常处理","num":"785"},{"text":"开待装库","num":"763"},{"text":"订单修改请求","num":"746"},{"text":"来电显示异常处理","num":"742"},{"text":"身份证无磁","num":"653"},{"text":"佣金奖励处理","num":"646"},{"text":"发票作废","num":"498"},{"text":"临时身份证","num":"487"},{"text":"派发工单请求","num":"359"},{"text":"取消兑换积分返还","num":"214"},{"text":"特殊规则审核申请","num":"132"}
            ],
            items:[]
        }
    },
    methods:{
        send(){
            if(this.text.trim()=='') return ;
            $('main').scrollTop(60000000);
            this.getData(this.text);
            this.text="";
        },
        focus_(){
            setTimeout(function(){
                 $(window).scrollTop(60000000);
            },300)
        },
        tab(){
            // this.tabshow=!this.tabshow;
            if(this.tabshow){
                sessionStorage.setItem('off','11');
                sessionStorage.setItem('content',false);
            }
        },
        to_info(item){
            this.$router.push({
                path:'info',
                query:{
                    content:item.text
                }
            })
        },
       async getData(msg){
           var data={};
           data.type='telecom';
           data.content=msg;
           let info = await yysbClientService2.getList(data);
           var data=info[0];
           var arr=['--'];
           if(data.entity!==""){
               arr=[];
               var data_=data.entity.split('\n');
               for(var i=0;i<data_.length;i++){
                   if(data_[i]!==''){
                       var item=data_[i].split(':');
                       arr.push(item)
                   }
               }
           }
           this.items.push({
               left:msg,
                right:{
                    type:data.type,
                    item:arr
                }
           })
           setTimeout(function(){
            $('main').scrollTop(60000000);
           },100)
        }
    },
    mounted() {


        // var text=''
                // var arr=[]
                // // console.log(text.split('\n')[2].trim());
                // for(var i=0;i<text.split('\n').length;i++){
                //     var item=text.split('\n')[i].trim();
                //     // console.log(item.split(':'));
                //     arr.push({
                //         text:item.split(':')[0],
                //         num:item.split(':')[1]
                //     })
                // }
                // console.log(JSON.stringify(arr))
        if(sessionStorage.getItem('off')=='false'){
            this.tabshow=false;
        }
        if(sessionStorage.getItem('content')){
            if(sessionStorage.getItem('off')=='true'){
                this.text=sessionStorage.getItem('content');
                this.send();
            }
        }
        $('.yysb').css({'height':$(window).height()-$('header').height()})
        $('main').css({'height':$(window).height()-$('header').height()-$('footer').height()})
    },
    
}
</script>

<style scoped src="../../static/yysb/css/index.css"></style>
