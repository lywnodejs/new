<template>
    <div class="rxhBD_body_index">
        <div class="rxhBD_logo">
            <img src="../../static/common/images/logo.png">
        </div>


        <div class="rxhBD_search_index">
            <div class="rxhBD_box">
                <input type="text" v-model="inputVal" @keyup.enter="search()">
                <i class="icon-search" @click="search()"></i>
            </div>
        </div>


<!--        <div class="rxhBD_label_index">-->
<!--            <a>李保芳</a><a>贵州茅台</a><a>李保芳</a><a>贵州茅台</a><a>李保芳</a><a>贵州茅台</a><a>李保芳</a><a>贵州茅台</a><a>李保芳</a><a>贵州茅台</a><a>李保芳</a><a>贵州茅台</a>-->
<!--        </div>-->


        <div class="rxhBD_hot_index">
            <div class="rxhBD_hd">
                <h5>热门搜索</h5>
<!--                <h6>07-21 12:11更新</h6>-->
            </div>
            <div class="rxhBD_bd">

                <dl v-for="(item,index) in items" @click="toSearchPage(item.question)">
                    <dt>
                        <b>{{index+1}}</b>
                    </dt>
                    <dd>{{item.question}}</dd>
                </dl>

            </div>
        </div>
    </div>
</template>

<script>
    import {infoevent} from "../service";
    import store from '../store'
    export default {
        name: "home",
        data(){
            return {
                items:[],
                inputVal: ''
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.name == '首页' || from.name === null) { 
                store.dispatch('KEEPALIVE_LIST','')
            }
            next()
        },
        beforeRouteLeave(to, from, next) {
            if (to.name == '首页') { 
                store.dispatch('KEEPALIVE_LIST','index')
            }
            next()
        },
        methods:{
            async getData() {
                var data={
                    type:9,
                    ps:10
                };
                let info = await infoevent.getHome(data);
                //console.log(info);
                this.items=info.data[0][9];
            },
            search() {
                if(this.inputVal){
                    this.$router.push({
                        path: '/index',
                        query: {
                            searchVal: this.inputVal
                        }
                    })
                }else {
                     this.$createToast({
                        txt: '搜索内容不能为空！',
                        type: 'txt'
                    }).show();
                }
            },
            toSearchPage(val) {
                this.$router.push({
                    path: '/index',
                    query: {
                        searchVal: val
                    }
                })
            }
        },
        mounted(){
            this.getData();
        }
    }
</script>

<style scoped>

</style>
