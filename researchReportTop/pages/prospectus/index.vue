<!--
 * @Date: 2018-12-26 15:46:12
 * @Author: 刘亚伟
 * @LastEditTime: 2019-06-13 15:07:57
 -->
<template>
    <div class="box">
        <header>
            <i class="iconfont icon-xiangzuo" @click="back_()"></i>
            <span>科创板招股说明书</span>
            <div class="search">
                <i class="iconfont icon-fangdajing"
                   @click="search()"></i>
                <label>
                    <input type="search"
                           v-model="title"
                           @keyup.enter="search()"
                           placeholder="搜索查询目标企业"/>
                </label>
            </div>
        </header>
        <main>
            <ul>
                <div class="bg"></div>
                <li v-for="item in items" @click="toInfo(item)">
                    <h3 style="text-overflow: ellipsis;overflow : hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;">
                        {{item.display=="0"? item.title.substr(0,item.title.length-2):item.title}}</h3>
                    <h4>披露日期：{{item.publishAt |setDate}}</h4>
                </li>
            </ul>
            <div class="infinity">
                <span v-show="infinityShow" @click="infinity()">点击加载更多</span>
                <div v-show="loading"
                     class="sk-circle login_">
                    <div class="sk-circle1 sk-child"></div>
                    <div class="sk-circle2 sk-child"></div>
                    <div class="sk-circle3 sk-child"></div>
                    <div class="sk-circle4 sk-child"></div>
                    <div class="sk-circle5 sk-child"></div>
                    <div class="sk-circle6 sk-child"></div>
                    <div class="sk-circle7 sk-child"></div>
                    <div class="sk-circle8 sk-child"></div>
                    <div class="sk-circle9 sk-child"></div>
                    <div class="sk-circle10 sk-child"></div>
                    <div class="sk-circle11 sk-child"></div>
                    <div class="sk-circle12 sk-child"></div>
                </div>
                <div class="nodata" v-show="nodata">
                    <img src="../../static/zxrb/images/nodata2.png" alt="">
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import {to_date,functionForShowPDF} from '../../lib/methods.js';
    import {eventClientService} from '../../service/client/index.js';

    export default {
        layout: 'prospectus',
        head: {
            title: '招股说明书',
        },
        data() {
            return {
                items: [],//数据链表
                cp: 1,
                infinityShow: false,
                loading: false,//加载中
                title: '',//本段标题
                nodata: false,//无数据时显示
            }
        },
        filters: {
            setDate(val) {
                return to_date(val);
            }
        },
        methods: {
            back_(){
                try {
                    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                        window.webkit.messageHandlers['back'].postMessage('1')
                    } else if (/(Android)/i.test(navigator.userAgent)) {
                        window.contestapp.back()
                    }
                } catch (error) {
                    this.$router.back();
                }
            },
            infinity() {
                this.cp += 1;
                this.getData();
            },
            search() {
                this.cp = 1;
                this.items = [];
                this.getData();
            },
            toInfo(item) {//进入科创板详情页
                this.$router.push({
                    path: 'prospectus',
                    query: {
                        type: '全部',
                        right: item.author,
                        hideBackIcon:this.$route.query.hideBackIcon,
                        top: this.$route.query.top || 0
                    }
                })
            },
            async getData() {//获取首页数据
                this.loading = true;
                this.nodata = false;
                this.infinityShow = false;
                var data = {
                    cp: this.cp,
                    ps: 10,
                    title: this.title
                };
                var info = await eventClientService.getProspectus(data);
                if (info.data.list.length === 0) {
                    this.nodata = true;
                }
                if (info.data.list.length >= 10) {
                    this.infinityShow = true;
                } else {
                    this.infinityShow = false;
                }
                this.loading = false;
                for (var i = 0; i < info.data.list.length; i++) {
                    this.items.push(info.data.list[i]);
                }
                if (info.data.totalCount <= this.items.length) {
                    this.infinityShow = false;
                }
            }
        },
        mounted() {
            this.getData();
            if(this.$route.query.hideBackIcon==1){
                $('header .icon-xiangzuo').hide();
            }
            var top = this.$route.query.top || 0;
            setTimeout(function () {
                $('header').css({
                    paddingTop: top + 'px'
                });
                $('header i').css({
                    top: parseInt(top) + 4 + 'px'
                })
                $('main').css({
                    marginTop: parseInt(top) + $('header').height() + 'px'
                })
            },100)

        },

    }
</script>

<style scoped src="../../static/prospectus/css/index.css"></style>
