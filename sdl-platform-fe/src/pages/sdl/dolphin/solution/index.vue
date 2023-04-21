<template>
    <div class="loophole">
        <div class="block">
            <div class="flex">
                <div class="syn"></div>
                <span class="menu">安全方案</span>
                <input @keyup="searchSolution" type="text" placeholder="请输入关键字" v-model="inputVal" class="input-with-select">
                <button slot="append" @click="searchSolution" class="loophole-btn">搜 索</button>
            </div>
            <div class="recommendWords">
                <span>为你推荐：</span>
                <router-link
                :to="{ path : '/sdl/dolphin/solution/solutionDetail', query: {solutionId: 2}}">
                <span>Passport安全接入&nbsp;</span>
                </router-link>
                <router-link
                :to="{ path : '/sdl/dolphin/solution/solutionDetail', query: {solutionId: 8}}">
                <span>开放API接口认证安全&nbsp;</span>
                </router-link>
                <router-link
                :to="{ path : '/sdl/dolphin/solution/solutionDetail', query: {solutionId: 14}}">
                <span>运营类系统安全&nbsp;</span>
                </router-link>
            </div>
        </div>
        <!-- <table v-for="items in slnKnowledge" :key="items.name" class="myTable">
            <tr>
                <li>
                    <router-link :to="{ path : '/sdl/dolphin/solution/solutionDetail', query: {solutionId: items.sln_knowledge_id}}">
                        {{items.sln_knowledge_name}}
                    </router-link>
                </li>
            </tr>
        </table> -->
        <div class="block" v-if="slnKnowledge.length!=0">
            <div class="searchResult">
                <span>共搜索到 {{sln_count}} 个结果</span>
            </div>
            <div class="table">
                <div class="tableTr" v-for="items in slnKnowledge" :key="items.name">
                    <div class="border" v-if="items.num"></div>
                        <!-- <div> -->
                            <div class="tableTitle">
                                <router-link :to="{ path : '/sdl/dolphin/solution/solutionDetail', query: {solutionId: items.sln_knowledge_id}}">
                            
                                <span>{{items.sln_knowledge_name}}</span>
                                </router-link>
                            </div>
                            
                        <!-- </div>   -->
                    <div class="tableTime">更新时间: {{items.update_time}}</div>
                    
                </div>
            </div>
        </div>
        <div class="blankTip" v-show="slnKnowledge.length==0">
            <span>未搜索到结果</span>
        </div>
    </div>
</template>
<script>
import { connect } from '@/lib'

export default connect(() => {
  return {

    //   slnKnowledge: 'dolphin/slnKnowledge'
  }
}, {
  getSlnKnowledge: 'dolphin/getSlnKnowledge'
})({
    name: 'SDL-loophole',
    data() {
        return {
            tableData: [],
            inputVal: '',
            slnKnowledge: [],
            sln_count: 0,
            queryParam: {
                page: 1,
                limit: 100,
                keywords: {sln_knowledge_name: ''}
            }
        }
    },
    created() {
        this.searchSolution()
    },
    methods: {
        searchSolution() {
        this.queryParam.keywords.sln_knowledge_name = this.inputVal
            let queryParam = {queryParam: this.queryParam}
            this.getSlnKnowledge(queryParam).then(res => {
                this.slnKnowledge = res
                this.sln_count = res.length
                for (let i = 0; i < this.slnKnowledge.length; i++) {
                    this.slnKnowledge[i].update_time = this.slnKnowledge[i].update_time.split(' ')[0]
                    if (i == 0) this.slnKnowledge[i].num = 0
                    else this.slnKnowledge[i].num = 1
                }
            })
        }
    }
})
</script>
<style lang="less" scoped>
.loophole{
    // height: 100%;
    width: auto;
    box-sizing: border-box;
    // background: white;
    // margin-top: -15px;
    // margin-bottom: 20px;
    // padding: 20px;
    margin: 23px;
    // overflow:hidden;

    h1{
        text-align: center;
        margin-top: 50px;
    }
    .block {
        padding-top: 30px;
        padding-bottom: 15px;
        background-color: #fff;
        margin-bottom: 23px;
        border-radius: 4px;
        -webkit-font-smoothing: antialiased;
        .searchResult {
            span {
            color: #999999;
            font-size: 11px;
            -webkit-font-smoothing: antialiased;
            margin-left: 55px;
            }
        }
        .syn{
            float: left;
            border-left: 2px solid #FC9153;
            height: 14px;
            margin-left: 18px;
            margin-right: 5px;
            margin-top: 10px;
            line-height: 50px;
        }
        .menu {
            color:r#333333;
            font-size: 13px;
            margin-right: 10px;
        }
        .recommendWords {
            color: #999999;
            font-size: 11px;
            -webkit-font-smoothing: antialiased;
            margin-top: 5px;
            margin-left: 135px;
            a {
                color: #999999;
                :hover {
                    color: #FC9153;
                }
            }
        }
    }
    .flex{
        // display: flex;
        margin-left: 40px;
        justify-content: center;
        align-content: center;
        height: auto;
        // margin-right: 80px;
        // padding-top: 30px;
        // padding-bottom: 30px;
        .input-with-select{
            width: 75%;
            border-radius: 4px;
            // border-right: none;
            border: 1px solid rgb(226, 226, 226);
            // border-right: none;
            font-size: 13px;
            color: rgb(85, 86, 90);
            padding-left: 10px;
            transition:border 0.4s;
            height: 33px;
            margin-right:10px;
        }
        .input-with-select:focus{
            border-color: #FC9153 ;
        }
        .loophole-btn{
            background: #FC9153;
            border-radius: 4px;
            width: 80px;
            height: 30px;
            border: none;
            color: #fff;
            font-size: 13px;
            cursor: pointer;
            // font-weight: 100;
            line-height: 25px;
            padding: 2px;
            -webkit-font-smoothing: antialiased;
        }
        .loophole-btn:hover{
            box-shadow:0 1px 3px rgb(226, 226, 226);
        }
    }
    
    .myTable{
        display: flex;
        justify-content: center;
        align-content: center;
        margin: 0 auto;
        background-color: #fff;
        li{
            width: 560px;
            
            list-style:disc;
            list-style-type:disc;
            color: #666666;
            font-size: 16px;
        }
        li:hover{
            text-decoration: underline;
        }
        
    }
    .table{
        margin: 5px 55px 20px 55px;
        // width: 560px;
        width: auto;
        border: 0.5px solid #e2e2e2;
        border-left: none;
        border-right: none;

        // border-radius: 5px;
        .tableTr{
            display: block;
            // width: 560px;
            width: auto;
            // height: 50px;
        }
        
        .tableTd{
            display: inline-block;
            width: 100%;
            height: 20px;
            font-size: 15px;
            margin-left: 20px;
            margin-top: 5px;
        }
        
        .tableTitle{
            // display: inline-block;
            position: relative;
            // top: 2px;            
            // width: 100%;
            width: auto;
            height: 20px;
            font-size: 14px;
            margin-top: 15px;
            margin-bottom: 10px;
            span{
                color: black;
            }
        }
        .tableTitle span:hover{
            text-decoration: underline ;
            color: #FC9153;
        }
        .tableId{
            display: inline-block;
            position: relative;
            color: #999999;
            padding-left: 10px;
            width: 60px;
        }
        .tableTime{
            // padding-left: 10px;
            color: #999999;
            // padding-top: 4px;
            font-size: 11px;
            display: inline-block;
            // font-weight: 100;
            // margin-bottom: 10px;
        }
        .tablelangu{
            display: inline-block;
            padding-left: 10px;
            color: #999999;
            width: 100px;
            font-size: 11px;
            // font-weight: 100;
        }
        .tablelplat{
            display: inline-block;
            padding-left: 10px;
            width: 100px;
            font-size: 11px;
            color: #999999;
            // font-weight: 100;
        }
        .border{
            border-bottom: 1px solid #e2e2e2;
            // margin: 0 10px;
            width: auto;
        }
        
    }
    .blankTip {
        height: 40px;
        width: auto;
        // background-color: white;
        font-size: 13px;
        -webkit-font-smoothing: antialiased;
        color: #999999;
        text-align: center;
    }
}

</style>

