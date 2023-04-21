<!--
 * @Date: 2018-12-26 15:46:12
 * @Author: 刘亚伟
 * @LastEditTime: 2019-06-14 11:30:04
 -->
<template>
    <div class="box">
        <header>
            <i class="iconfont icon-xiangzuo" @click="back_()"></i>
            <span>智能解读</span>
        </header>
        <main>
            <li>
                <h3>{{!display? title.substr(0,title.length-2):title}}</h3>
                <h4>披露日期：{{date | setDate}}</h4>
                <div class="deload" style="display: none;">
                    <button @click="toPDF()">下载查看原文</button>
                </div>
            </li>
            <div class="boxMain" v-show="display"">
                <div class="navBox" style="top: 0; height: 2.4rem;">
                    <div class="nav">
                        <div class="swiper-container" style="height:1.4rem;">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide"
                                     v-for="(item,index_) in items"
                                     :class="index===index_? 'on':''"
                                     @click="swiperTo(index_,item)">
                                    {{item.name}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="nav_tow">
                        <li v-for="(item,index_) in items"
                            :class="index===index_? 'on':'' "
                            @click="swiperTo(index_,item)">{{item.name}}
                        </li>
                    </div>
                    <div class="icon">
                        <i class="iconfont icon-xiangxia"></i>
                    </div>
                </div>
                <ul>
                    <li v-for="item in dataItems" v-show="name===item.knowledgeTypeName||name==='全部'">
                        <span>{{item.knowledgeTypeName}}</span>
                        <p v-html="item.text"></p>
                    </li>
                </ul>
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

        <!-- 弹窗 -->
        <div class="modal" @click="modal()"></div>
        <div class="modalBox">
            <div class="sk-circle login_" style="top:45%;">
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
        </div>
    </div>
</template>

<script>
    import {to_date, functionForShowPDF} from '../../lib/methods.js';
    import {
        eventClientService
    } from '../../service/client/index.js';

    var mySwiper = null;
    export default {
        layout: 'prospectus',
        head: {
            title: '招股说明书',
        },
        data() {
            return {
                items: [],
                items2: [
                    {name: '全部', type: 'KE_CHUANG_PLATE'},
                    {name: '主营业务', type: 'MAIN_BUSINESS'},
                    {name: '经营模式', type: 'MANAGEMENT_MODEL'},
                    {name: '研发能力', type: 'R_D_CAPABILITY'},
                    {name: '研发费用', type: 'R_D_COSTS'},
                    {name: '主要客户', type: 'MAIN_CUSTOMER'},
                    {name: '主要供应商', type: 'MAJOR_SUPPLIERS'},
                    {name: '行业地位', type: 'INDUSTRY_STATUS'},
                    {name: '行业竞争格局', type: 'INDUSTRY_COMPETITION_PATTERN'},
                    {name: '发展历程', type: 'DEVELOPMENT_HISTORY'},
                    {name: '股权结构', type: 'OWNERSHIP_STRUCTURE'},
                    {name: '财务状况', type: 'FINANCIAL_POSITION'},
                    {name: '募集资金投向', type: 'RAISING_FUNDS_2_INVEST'},
                    {name: '未来规划', type: 'FUTURE_PLANNING'},
                    {name: '企业风险提示', type: 'ENTERPRISE_RISK_TIPS'},
                    {name: '企业优势', type: 'ENTERPRISE_ADVANTAGE'},
                    {name: '企业增长潜力', type: 'ENTERPRISE_GROWTH_POTENTTIAL'},
                ],
                type: this.$route.query.type,
                name: '全部',
                index: 0,
                loading: false,
                nodata: false,
                dataItems: [],//数据链表
                title: '',//标题
                date: '',//时间
                list: ['全部'],
                display: false,
                pdfUrl: ''
            }
        },
        methods: {
            async getData() {
                this.loading = true;
                this.nodata = false;
                this.dataItems = [];
                let data = {
                    ps: 20,
                    right: this.$route.query.right
                };
                let info = await eventClientService.getProspectusInfo('KE_CHUANG_PLATE', data);
                this.loading = false;
                $('.modalBox').remove();
                if (!this.display) {
                    $('.deload').show();
                }
                if (info.data.list.length !== 0) {
                    for (var l = 0; l < info.data.list.length; l++) {
                        this.list.push(info.data.list[l].knowledgeTypeName);
                        if (info.data.list[l].knowledgeTypeName == '股权结构') {
                            var str = '<table cellspacing="0" style="border-right: 1px solid #e1e1e1;">' +
                                '<thead style="background: #1d79e2;color:#fff;">' +
                                '<tr>' +
                                '    <td style="width:50%;padding: 3px;font-size:14px;border-left: 1px solid #e1e1e1;border-bottom: 1px solid #e1e1e1">股东</td>' +
                                '    <td style="padding: 3px;font-size:14px;border-left: 1px solid #e1e1e1;border-bottom: 1px solid #e1e1e1">持有股份(股)</td>' +
                                '    <td style="padding: 3px;font-size:14px;border-left: 1px solid #e1e1e1;border-bottom: 1px solid #e1e1e1">持有比例</td>' +
                                '</tr>' +
                                '</thead>' +
                                '<tbody>';
                            var arr = eval(info.data.list[l].text);
                            for (var o = 0; o < arr.length; o++) {
                                var hldAmount = arr[o].hldAmount || '--';
                                var hldPercent = arr[o].hldPercent.toFixed(2) || '--';
                                str += '<tr>' +
                                    '<td style="padding: 3px;font-size:14px;border-left: 1px solid #e1e1e1;border-bottom: 1px solid #e1e1e1">' + arr[o].shldName + '</td>' +
                                    '<td style="padding: 3px;font-size:14px;border-left: 1px solid #e1e1e1;border-bottom: 1px solid #e1e1e1;text-align: right;">' + hldAmount + '</td>' +
                                    '<td style="padding: 3px;font-size:14px;border-left: 1px solid #e1e1e1;border-bottom: 1px solid #e1e1e1;text-align: right;">' + hldPercent + '%</td>' +
                                    ' </tr>'
                            }
                            str += '</tbody></table>'
                            info.data.list[l].text = str;
                        } else if (info.data.list[l].knowledgeTypeName == '财务状况') {
                            var str = '<table cellspacing="0" style="border-right: 1px solid #e1e1e1;">' +
                                '<thead style="background: #1d79e2;color:#fff;">' +
                                '<tr>' +
                                '    <td style="padding: 3px;font-size:14px;border-left: 1px solid #e1e1e1;border-bottom: 1px solid #e1e1e1">指标/时间</td>';

                            var arr = eval(info.data.list[l].text);
                            for (var o = 0; o < arr.length; o++) {
                                var date = (arr[o].endDate + '').substring(0, 4);
                                var date2 = (arr[o].endDate + '').substring(4, 6);
                                var date3 = (arr[o].endDate + '').substring(6, 8);
                                var date4 = date + '/' + date2 + '/' + date3;
                                str += '<td style="padding: 3px;font-size:14px;border-left: 1px solid #e1e1e1;border-bottom: 1px solid #e1e1e1">' + date4 + '</td>'
                            }
                            str += '</tr>' + '</thead>' + '<tbody>';
                            var arr2 = ['总资产(亿)', '净资产(亿)', '营业收入(万)', '净利润(万)', '资本公积金(万)', '每股未分配利润(元)', '每股净资产(元)', '基本每股收益(元)', '每股经营现金流(元)', '加权净资产收益率(%)']
                            for (var o = 0; o < arr2.length; o++) {
                                str += '<tr>' +
                                    '<td style="padding: 3px;font-size:14px;border-left: 1px solid #e1e1e1;border-bottom: 1px solid #e1e1e1;text-align: left;">' + arr2[o] + '</td>'
                                for (var n = 0; n < arr.length; n++) {
                                    var value = '';
                                    switch (arr2[o]) {
                                        case '总资产(亿)':
                                            if (arr[n].totAssets) {
                                                value = (arr[n].totAssets / 100000000).toFixed(2);
                                            } else {
                                                value = '--';
                                            }
                                            break;
                                        case '净资产(亿)':
                                            if (arr[n].totShrhldrEqyExclMinInt) {
                                                value = (arr[n].totShrhldrEqyExclMinInt / 100000000).toFixed(2);
                                            } else {
                                                value = '--';
                                            }
                                            break;
                                        case '营业收入(万)':
                                            if (arr[n].operRev) {
                                                value = (arr[n].operRev / 10000).toFixed(2);
                                            } else {
                                                value = '--';
                                            }
                                            break;
                                        case '净利润(万)':
                                            if (arr[n].netProfit) {
                                                value = (arr[n].netProfit / 10000).toFixed(2)
                                            } else {
                                                value = '--';
                                            }

                                            break;
                                        case '资本公积金(万)':
                                            if (arr[n].capRsrv) {
                                                value = (arr[n].capRsrv / 10000).toFixed(2)
                                            } else {
                                                value = '--';
                                            }
                                            break;
                                        case '每股未分配利润(元)':
                                            if (arr[n].sFaUndistributedps) {
                                                value = arr[n].sFaUndistributedps.toFixed(2)
                                            } else {
                                                value = '--';
                                            }
                                            break;
                                        case '每股净资产(元)':
                                            if (arr[n].sFaBps) {
                                                value = arr[n].sFaBps.toFixed(2)
                                            } else {
                                                value = '--';
                                            }
                                            break;
                                        case '基本每股收益(元)':
                                            if (arr[n].epsBasic) {
                                                value = arr[n].epsBasic.toFixed(2)
                                            } else {
                                                value = '--';
                                            }
                                            break;
                                        case '每股经营现金流(元)':
                                            if (arr[n].sFaOcfps) {
                                                value = arr[n].sFaOcfps.toFixed(2)
                                            } else {
                                                value = '--';
                                            }
                                            break;
                                        case '加权净资产收益率(%)':
                                            if (arr[n].waaRoe) {
                                                value = arr[n].waaRoe;
                                            } else {
                                                value = '--';
                                            }
                                            break;
                                        default:
                                            value = '--';
                                    }
                                    str += '<td style="padding: 3px;font-size:14px;border-left: 1px solid #e1e1e1;border-bottom: 1px solid #e1e1e1;text-align: right">' + value + '</td>'
                                }
                            }
                            console.log(arr);
                            info.data.list[l].text = str;
                        }
                    }
                    ;

                    var arr = [];
                    for (var i = 0; i < this.items2.length; i++) {
                        if (this.list.indexOf(this.items2[i].name) !== -1) {
                            arr.push(this.items2[i]);
                        }

                        var i_name = this.items2[i].name;
                        for (var l = 0; l < info.data.list.length; l++) {
                            if (i_name === info.data.list[l].knowledgeTypeName) {
                                this.dataItems.push(info.data.list[l]);
                            }
                            ;
                        }
                        ;
                    }
                    ;
                    this.items = arr;
                    setTimeout(function () {
                        mySwiper = new Swiper('.swiper-container', {
                            freeMode: true,
                            slidesPerView: 'auto',
                            spaceBetween: 10,
                            autoHeight: true,
                            slideToClickedSlide: true,
                        });
                        for (var i = 0; i < this.items.length; i++) {
                            if (this.$route.query.type == this.items[i].name) {
                                this.swiperTo(i, this.items[i]);
                            }
                        }
                    }.bind(this), 100)
                    this.nodata = false;
                } else {
                    this.nodata = true;
                }
                ;
            },
            async getTitle() {//通过router的right(author)获取title
                let data = {
                    companyNames: this.$route.query.right
                };
                let info = await eventClientService.getProspectus(data);
                this.title = info.data.list[0].title;
                this.date = info.data.list[0].publishAt;
                if (info.data.list[0].display == '0') {
                    this.display = false;
                    this.pdfUrl = info.data.list[0].url;
                } else {
                    this.display = true;
                }
            },
            back_() {//返回
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
            toPDF() {
                var url = this.pdfUrl;
                functionForShowPDF(this.title, url);
            },
            modal() {//点击蒙层关闭
                $('.icon').find('i').addClass('icon-xiangxia');
                $('.icon').find('i').removeClass('icon-xiangshang');
                $('.nav').show(0);
                $('.nav_tow').slideUp(100);
                $('.modal').hide(0);
                $('.navBox').css({
                    'height': '2.4rem'
                })
            },
            swiperTo(num, item) {
                mySwiper.slideTo(num);
                this.index = num;
                this.name = item.name;
                this.type = item.type;
                $('.icon').find('i').addClass('icon-xiangxia');
                $('.icon').find('i').removeClass('icon-xiangshang');
                $('.nav').show(0);
                $('.nav_tow').slideUp(100);
                $('.modal').hide(0);
                $(window).scrollTop(0);
                $('.navBox').css({
                    'height': '2.4rem'
                })
            },
        },
        created() {
            this.getTitle();
        },
        filters: {
            setDate(val) {
                return to_date(val);
            }
        },
        mounted() {
            var _this = this;
            if(this.$route.query.hideBackIcon==1){
                $('header .icon-xiangzuo').hide();
            }
            $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.2/css/swiper.min.css">');
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.2/js/swiper.min.js");
            script.onload = function () {
                _this.getData();
            };
            $('head').get(0).appendChild(script);

            $('.icon').click(function () {
                if ($(this).find('i').hasClass('icon-xiangxia')) {
                    $(this).find('i').removeClass('icon-xiangxia');
                    $(this).find('i').addClass('icon-xiangshang');
                    $('.nav').hide(0);
                    $('.modal').show(0);
                    $('.nav_tow').slideDown(100);
                    $('.navBox').css({
                        'height': '10rem'
                    })
                } else {
                    $(this).find('i').addClass('icon-xiangxia');
                    $(this).find('i').removeClass('icon-xiangshang');
                    $('.nav').show(0);
                    $('.nav_tow').slideUp(100);
                    $('.modal').hide(0);
                    $('.navBox').css({
                        'height': '2.4rem'
                    })
                }

            });


            // 改变头部高度
            var top = this.$route.query.top || 0;
            setTimeout(function () {
                $('header').css({
                    paddingTop: top + 'px'
                });
                $('main>li h3').css({
                    paddingTop: top + 'px'
                });
                $('header i').css({
                    top: parseInt(top) + 4 + 'px'
                });
                nav_scroll();
                $('.navBox').css({
                    'position': 'absolute',
                    'top': '0rem',
                })
                // $('.icon').click();
                $(this).find('i').addClass('icon-xiangxia');
                // setTimeout(function () {
                //     $('.icon').click();
                // }, 100)
            }, 150)

            //判断nav是否固定-----------------
            var Top_ = $(window).scrollTop();
            $(window).scroll(function () {
                Top_ = $(window).scrollTop();
                nav_scroll();
            });

            function nav_scroll() {
                var top = _this.$route.query.top || 0;
                if (Top_ >= $('main>li').height() + $('header').height() - top) {
                    $('.navBox').css({
                        'position': 'fixed',
                        'top': $('header').height() + parseInt(top) + 'px',
                    })
                } else {
                    $('.navBox').css({
                        'position': 'absolute',
                        'top': '0rem',
                    })
                }
            }
        },


    }
</script>

<style scoped src="../../static/prospectus/css/jd.css"></style>
