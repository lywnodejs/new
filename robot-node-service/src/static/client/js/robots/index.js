/**
 * Created by BoBo on 2017-08-07.
 */
//头像
// var headImg = +'static/images/avatar-min.png';

//插件加载完成后是否加载历史问题
var showHistoryQ = false;

//输入框
var txtInput;

//主页面容器
var mainContent;

//解决输入框被遮挡的bug的定时器
var timerId = null;

//用户ID，没有就生成时间戳
var userId = '';

// 目前C端用
var clientId = '';

//缓存的内容数组
var cookieArray = [];

//最后的问题
var lastQuestion = '';
//最后问题容器ID
var lastQuestionId = '';

//市场代码
var market1 = '';

//图表插件是否加载完成
var isChartPluginLoaded = false;

var historyIndex = 5;

//屏幕宽高
var winW, winH;

//文本3行占的高度
var maxH;

var isDisclaimerAgreed = false,
    isUserGuideRead = false;

//缓存地址栏中的参数
var params = {
    platform: '', //平台
    appKey: '',
    appVersion: '',
    stockCode: '', //浏览器参数，股票代码
    stockName: '', //浏览器参数，股票名称
    predicateType: '', //浏览器参数，谓语类别
    // confUserName: '', // 2019.08.23 雨农要求新增
    preview: '' // 2019.08.23 雨农要求新增
};

//固定回答的请求参数集合（每个值为Json格式的符串）
var questionAnalyseArr = {};

//人工问题记录
var divId = '';

//股东第一的占比
var topPer = '';

//系统来源
var appFrom = getQueryString("platform");
//app来源
var appKey = getQueryString("appKey") || 'webPage';
//机器人Id  // 2019.08.29 雨农要求新增
var robotId = getQueryString("robotId") || '';
//是否调用历史接口
var isPush = getQueryString("isPush");
var h5Version = getQueryString("h5Version");
//App版本
var appVersion = getQueryString("appVersion");
//接收浏览器传过来的屏幕高宽参数
var appW = getQueryString("appW");
var appH = getQueryString("appH");
//资金账号
var fundAccount = getQueryString("fundAccount");
//手机号码
var phoneNumber = '';

var messageIdsList = "";
// 推送进来的语句
var pushTxtResult = '';

var explorer = "";

//条件选股中用
// var stockConditions = ['市盈率', '市净率', '涨跌幅', '换手率', '振幅', '股价', '总市值', '成交额',
//     '成交量', '流通市值', '量比', '委比', '日主力资金', '每股净收益', '发行价', '历史最高价', '历史最低价',
//     '质押比例', '质押占总股本比例', '预警线估值', '平仓线估值', '累计涨跌幅', '每股净收益'];

//是否使用原生输入框
var useAppInput;
//是否在免责声明弹窗下面使用原生的遮罩
var useAppMaskUnderDisclaimer;
//是否使用App原生视图
var useAppNativeView;
var popTitle;
//APP是否支持打开PDF
var pdfSupport;
//外部浏览器打开html页面
var htmlOutBrowserSupport;
//首页推荐  初始随机数
var getPresetQuestionCP;
//首页个性推荐 页码
var personalizedCustomizationCP;
// tabs获取到的数据
var tabsQuestion;
// 二级tabs获取的数据
var secondTabsListData;
// 用户访问路径
var userURL= '';

// 第三方嵌入iframe的id
var iframeId = '';

// 是否后端记录日志，供测试用
var recordLog = true;

// 储存从Ezt等跳转过来的参数
var fixParams = {
    subjectCode: '',
    subjectName: '',
    subjectMarket: '',
    subjectType: '',
    subjectRawValue: '',
    objectCode: '',
    objectName: '',
    objectMarket: '',
    objectRawValue: '',
    objectType: '',
    predicateType: '',  // 谓语分类，必填
    frontPredicateType: '', // 谓语分类，供展示用
    question: '',
    attribute: '',
    attributeType: '',
    userId: '',
    fundAccount: '',
    questionId: '',
    userQuestionId: '',
    organization: ''
};

// 底部轮播按钮最后一次有效点击时间
var lastTabBtnClickTime = 0;

var socket;

var lastQuestionTime = 0;

var showDivBottom = true;

$(document).ready(function ()
{
    // 航天云网根据域名设置appKey，机器人
    if (location.hostname.indexOf('htyw') === 0) {
        appKey = 'appHtyw';
        robotId = 160 // dev：157，staging：150
    }

    if (appKey === 'appHtyw' || appKey === 'appEdu') {
        $('#icon-help').hide();
        // $('.md_pact_v2').hide(); // 免责声明
    }
    else if (appKey.toUpperCase().indexOf('JFTG') !== -1) { // 巨丰投顾
        appKey = 'appJftg';
    }
    else{
        // $(document).attr("title","智能小e 股票问答");
    }

    var test = window.location.search;//(设置或获取 href 属性中跟在问号后面的部分)
    if(test.length>0){
        if(appKey === 'appEzt'){
            baiduTrackPageview('/'+appKey+'/site/'+'E智通访问');
        }
        else if(appKey === 'appZsfc'){
            baiduTrackPageview('/'+appKey+'/site/'+'紫薯财富访问');
        }
        else if(appKey === 'appJftg'){
            baiduTrackPageview('/'+appKey+'/site/'+'巨峰投顾访问');
        }
        else if(appKey === 'appTopC'){
            baiduTrackPageview('/'+appKey+'/site/'+'Top股票助手访问');
        }
        else if(appKey === 'appHtyw'){
            baiduTrackPageview('/'+appKey+'/site/'+'航天云网访问');
        }
        else if(appKey === 'appEdu'){
            baiduTrackPageview('/'+appKey+'/site/'+'教育版访问');
        }
        else if(appKey === 'appAvatar'){
            baiduTrackPageview('/'+appKey+'/site/'+'Avatar访问');
        }
        else{
            baiduTrackPageview('/'+appKey+'/site/'+'访问');
        }
    }else{
        baiduTrackPageview('/site/'+'直接访问');
    }

    // getPresetQuestionCP = 10 * Math.random();//首页推荐  初始随机数
    personalizedCustomizationCP = 1;

    //声明
    txtInput = $('#txtInput');
    mainContent = document.getElementById("mainContent");

    //双重方式获取/检测平台类型，如果链接中有传那么以链接为准，否则根据浏览器类型判断
    if (isPC()) {
        appFrom = appFrom || 'pc';
    }
    else {
        appFrom = appFrom || getMobileType();
    }

    if (getQueryString('hideBottom') === 'true') {
        $('#divBottom').hide();
        showDivBottom = false;
    }

    //提取配置
    if (appKey === 'appAvatar') {
      // avatar渠道在app中使用时，无输入框，在对话管理平台中使用时要有
      useAppInput = !isPC();
        if (useAppInput) {
            $('#divBottom').hide();
            showDivBottom = false;
        }
    }
    else if(['appHcVtm'].indexOf(appKey) !== -1) {
      useAppInput = true;
    }
    else {
      useAppInput = getConfigByApp(appKey, appVersion, 'useAppInput');
    }
    useAppMaskUnderDisclaimer = getConfigByApp(appKey, appVersion, 'useAppMaskUnderDisclaimer');
    useAppNativeView = getConfigByApp(appKey, appVersion, 'useAppNativeView');
    pdfSupport = getConfigByApp(appKey, appVersion, 'pdfSupport');
    htmlOutBrowserSupport = getConfigByApp(appKey, appVersion, 'htmlOutBrowserSupport');

    try{
        switch (appFrom) {
            case 'ios':
                //IOS 子浩
                phoneNumber = getQueryString('phoneNumber') ? getQueryString('phoneNumber') : '';
                break;
            case "android":
                // 正伦
                phoneNumber = window.contestapp['getRegisteredPhoneNum']();
                break;
        }
    }catch (e) {
        // saveLog('jsError', e.message, 'index.js', 0, '获取手机号码', e.stack.toString());
    }

    //转为整型
    if (h5Version)
        h5Version = parseInt(h5Version);

    //浏览器
    explorer = navigator.userAgent;

    //取视窗的宽高，如果没取到那么再从URL链接参数里取（此方式需要减去原生的导航栏高度）
    winW = $(window).width() || appW;
    // console.log($(window).width(), appW, winW);
    // winH = $(window).height() || appH - 44 || getHeightByWidth(winW) - 44;
    winH = $(window).height() || (appH ? (appH - 44) : 0);
    // console.log($(window).height(), appH ? (appH - 44) : 0, winH);
    // alert('window.innerHeight:'+window.innerHeight+" $(window).height():"+$(window).height())

    if (appKey === 'appAvatar' && useAppInput) {
        $(".rxhE_hkws").css({
            "max-height": winH,
        });
    }

    // 2018-06-05 调整底部导航 by fxl
    // document.body.style.overflow = 'hidden';
    function _preventDefault(e) {
        if (e.target.id == "pageBody" || e.target.id == "txtInput" || e.target.id == "footer" || e.target.id == "icon-voice" || e.target.id == "icon-help" || e.target.id == "icon-Send") {
            e.preventDefault();
        }
    }

    //使用原生输入框，页面全屏，
    if (useAppInput)
        $('#pageBody').height('100%');
    else
        $('#pageBody').height(winH - 77);

    //双重判断是否显示顶部标题，1，从浏览器中取参数；2，如果在PC上运行
    // var hideTitleBar = getQueryString('hideTitle');
    // if (hideTitleBar === "0" || !isPC()) {
    //     $('#titleBar').remove();
    //     $('#mainContent').addClass('pt_0');
    // } else {
    //     // if(appKey !== 'appHtyw' && appKey !== 'appEdu')
    //     //     $("#titleBar").show();
    //     $('#mainContent').removeClass('pt_0');
    // }

    //取参
    params.platform = getQueryString('platform');
    params.appKey = getQueryString('appKey');
    params.appVersion = getQueryString('appVersion');
    params.stockCode = getQueryString('stockCode');
    params.stockName = getQueryString('stockName');
    params.predicateType = getQueryString('predicateType');
    // params.confUserName = getQueryString('confUserName') || 'hczq';
    params.preview = getQueryString('preview') || 'production';

    userId = getQueryString('userId') || '';
    clientId = getQueryString('clientId') || '';
    iframeId = getQueryString('iframeId') || '';
    recordLog = getQueryString('recordLog') || true;

    //停止App的加载动画
    stopLoad();
    setTitleBarBtn(12);

    //加载对应的免责声明
    //     $.get(url + '?time=' + new Date().getTime(), {}, function (response, status) {
    //         if (status === 'success')
    //             $("#txtDisclaimer").html(response);
    //     });
    if (disclaimer) {
        $('.md_pact_v2').show()
    } else {
        $('.md_pact_v2').hide()
    }

    if (localStorage) {
        // this.isUserGuideRead = localStorage.isUserGuideRead;
        // if(appKey !== 'appHtyw' && appKey !== 'appEdu'){
            //首次运行时弹出免责同意书
            if (disclaimerAutoPopUp && !localStorage.hasOwnProperty('disclaimerAgreed')) {
                //针对低版本安卓的弹窗样式
                if (appFrom === 'android') {
                    var androidVersion;
                    var version = getQueryString('androidVersion');
                    if (version && version.length > 0) {
                        androidVersion = parseInt(version.substr(0, 1));
                    }
                    if (androidVersion < 5) {
                        var W = winW * 0.8,
                            L = winW * 0.1,
                            H = winH * 0.60,
                            T = winH * 0.18;
                        var divDisContent = $('#divDisContent');
                        divDisContent.css('width', W);
                        divDisContent.css('left', L);
                        divDisContent.css('height', H);
                        divDisContent.css('top', T);
                        $('#txtDisclaimer').css('height', H - 90);
                    }
                } else {
                    isDisclaimerAgreed = localStorage.disclaimerAgreed;
                }
                //打开免责弹窗
                $(".pop_pact_v2").addClass("show").removeClass("hide");
            }

            //判断本地缓存免责属性
            if (localStorage.hasOwnProperty('disclaimerAgreed')) {
                //如果免责已读，而且本地没有缓存过appVersion，则调用原生唤醒功能
                if (localStorage.disclaimerAgreed) {
                    if (!localStorage.hasOwnProperty('appVersion') && appVersion) {
                        localStorage.appVersion = appVersion;
                        notifyAppFirstRun();
                        // if (h5Version && h5Version > 101) {
                        if (useAppMaskUnderDisclaimer) {
                            //打开原生遮罩
                            eVoiceForRelief(appFrom, false);
                        }
                    }
                }
            } else {
                eVoiceForRelief(appFrom, true);
            }


            //判断是否需要激活唤醒功能，如果不存在此属性
            // if (!localStorage.hasOwnProperty('isUserGuideRead')) {
            //     //如果本地已存在isGuide属性，说明已经点击过我知道了，那么直接激活
            //     //如果无，那么应该走免责
            //     if (localStorage.hasOwnProperty('isGuide')) {
            //     }
            //     if (localStorage.isGuide) {
            //         localStorage.isUserGuideRead = true;
            //     }
            // } else {
            //     // alert('本地已缓存属性：isUserGuideRead')
            // }

            if (ifRecordQuestion) {
                cookieArray = localStorage.cookieArray ? JSON.parse(localStorage.cookieArray) : [];
                var divShowHistory = $("#divShowHistory");
                cookieArray.length > 0 ? divShowHistory.show() : divShowHistory.hide();
            }
        // }
    }

    //URL里没有userId参数
    if (!userId) {
        //检查本地是否缓存
        if (!localStorage.hasOwnProperty('userId')) {
            userId = localStorage.userId = new Date().getTime();
        } else {
            userId = localStorage.userId;
        }
    }

    //文本3行最多显示高度
    var fs = 0.875,
        fl = 1.5,
        fEM, fLH;
    //判断屏幕宽度是320的时候
    if (winW <= 320) {
        fEM = 14;
    } else {
        fEM = 16;
    }
    fLH = fEM * fs * fl;    //字行高
    maxH = fLH * 3;         //最多显示高度

    //仅E智通，兼容用，此两个版本底部输入框部分与原生有交互
    // if (appKey === "appEzt") {
    //     if (appVersion === '1.1.7' || appVersion === '1.1.8' || appVersion === '1.9.8' || appVersion === '1.9.9') {
    //         $(".icon-voice").show();
    //         $(".icon-help").removeClass("icon-help").addClass("icon-plus");
    //         //每次斤都调用原声的方法
    //         notifyAppFirstRun();
    //         if (appFrom === 'android') {
    //             var help_w = $("footer .icon-plus").width();
    //             $("footer .icon-Send").css({ "right": help_w });
    //         }
    //     }
    // }

    //延迟加载图表插件
    setTimeout(function () {
        LazyLoad.loadOnce([
            'static/js/libs/7.0/highstock.src.js',
            'static/js/libs/7.0/highcharts-more.js',
            'static/js/libs/popups.js',
            'static/js/libs/clipboard.min.js',
        ], loadComplete);

        if (ifSupportWebAudio) {
            LazyLoad.loadOnce([
                'static/js/libs/base64.js',
                'static/js/libs/md5.js',
                'static/js/libs/Recorder.js',
                'static/js/libs/jRecorder.js',
                'static/js/libs/jRecorder2.js'
            ], function () {
                console.log('lazy')
            });
        }
    }, 10);

    /**
     * 获取历史的方法(未读的主动推送的历史数据)
     * 静静 20180809 需求
     * 小E主动推送的内容，用户没有读取，这个时候进入小E的时候，不展示主动推送的内容，展示个性化首页
     */
    if (!isPush && appKey === 'appEzt') {
        getHistoryMessage();
        //setTimeout('deleteHistory(messageIdsList)', 1000);
    }

    //非E智通进入小E 不查询主动推送时，查询首页热门问题推荐
    if (showIndexCarousel && appKey !== 'appEzt') {
        console.log("非E智通进入小E");
        // getPresetHotQuestion(function (result) {
        //     setPresetQuestion(result, true);
        // });
        // 查询首页轮播问题--新版
        getNewPresetQuestion(function (result) {
          console.log(result)
          setNewPresetQuestion(result)
        })
    }

    // userId = '75cf33e0021a33bcb5af39fe80adf076'
    // pushMessageSkipE('{"stockMessageIds":"f93237dddbf047dab09c2b2606b4d5c2,e8d7df87f07e482c9722fea0cad6c9a2,ae73816c46e246b3a1c00057d8e6c1aa,87737fb549c248259063a88460630683,bf61379002b24176b588778ebbc439c7,96e99d9fbd4044bbb73dca384afa584b,fda2e452cd364aa5af20cadc10666b0c,f682292a58934f62bc3a4487eeca10eb,13df82272c954d94a882b047d8f7e430","shortStockRecommendMessageId":"d7065d6b3fb74586972dc48eda3074c4","industryRecommendMessageId":"6782af84b670459097dfda2442b9a7fe","longStockRecommendMessageId":"5f8e45211af9462998e5b246fa27432d"}','晨间消息','您关注的万  科Ａ和平安银行等股票有重要消息更新');
    // pushMessageSkipE('21170', '股价变更', '上证指数涨幅于18:34达到2.00%');
    // pushMessageSkipE('46c5cbfbcb8438e81561125308fb1e71', '风险提示', '随便什么吧！');
    // pushMessageSkipE('31da30fd46bdb2c49131f3e02beacb97','风险提示','{body = "\U8b66\U793a\Uff01\U3010002256 \U5146\U65b0\U80a1\U4efd\U3011\U89e6\U53d1\U80a1\U6743\U8d28\U62bc\U98ce\U9669";title = "\U98ce\U9669\U63d0\U9192";}');

    //不使用原生输入框，展示底部H5输入框
    if (!useAppInput) {
        if (!ifSupportWebAudio)
            $('#icon-voice').hide();
        $("#footer").addClass('show_flex').removeClass('hide');
        $('body').removeClass('body_hideFoot');
        if (showDivBottom) {
            $('#divBottom').show();
        }
    }

    getDefaultTabs();

    // var hotSpotButtonJump = getConfigByApp(appKey, appVersion, 'hotSpotButtonJump');
    //给默认轮播按钮添加事件
    $('.bottom nav ul').delegate('li', 'click', function (e) {
        var time = new Date().getTime();
        if((time - lastTabBtnClickTime) < 1000)
            return;
        else
            lastTabBtnClickTime = time;

        var index = e.currentTarget.attributes.itemindex.nodeValue;
        var spanId = e.currentTarget.attributes.spanid.nodeValue;
        var innerText = e.currentTarget.innerText;
        var ifParams = tabsQuestion.default;
        // console.log(tabsQuestion);

        if(innerText === '条件选股'){
            openStockConditionPage();
            return;
        } else if (innerText === '人工服务') {
            callAdviser2();
            return;
        }

        // debugger
        clickTabs(index, tabsQuestion.tabList[index], spanId,innerText,ifParams);
        addActClass(e.currentTarget);
        console.log(tabsQuestion);
    });
    // 给二级页面tabs切换标签添加事件
    $(".pop_bottomNav .pop_nav").delegate('li', 'click', function (e) {
        var liN = $(this).index();
        $(this).addClass("on").siblings().removeClass("on");
        $(this).parents(".pop_nav").siblings(".pop_con").children(".box").eq(liN).addClass("show").siblings().removeClass("show");
        getSencondTabsList(e);
        addActClass(e.currentTarget);
    });
    // 给二级页面内容按钮添加事件
    $('.pop_bottomNav .box .pop_con .box').delegate('a', 'click', function (e) {
        var time = new Date().getTime();
        if((time - lastTabBtnClickTime) < 1000)
            return;
        else
            lastTabBtnClickTime = time;
        var index = +e.currentTarget.attributes.itemindex.nodeValue;
        var spanId = e.currentTarget.attributes.spanid.nodeValue;
        var data = secondTabsListData[index];
        var innerText = e.currentTarget.innerText;
        clickTabs(index, data, spanId,innerText);
        addActClass(e.currentTarget);
    });

    //每秒钟取一次页面高度，取到后清除定时器，针对首次无法获取页面高度的问题
    var intervalId = setInterval(function () {
        var height = $(window).height();
        // sendPreAnswerContent(height+":"+winH+":"+appH);
        //当取到页面高度大于100，及上次获取页面高度不正确时
        if (height > 100 && winH <= 0) {
            winH = Math.max(height, winH);
            $('#pageBody').height(winH - 77);
            clearInterval(intervalId);
        }
        else if (height > 100 && winH > 100) {
            clearInterval(intervalId);
        }
    }, 1000);

    // App里带参跳转
    // 有谓语分类的走固定问答
    var predicateType = getQueryString('predicateType');
    var question = getQueryString("question");

    //兼容旧版
    if (question) {
            divId = showParamQuestion(question);
    }
    else if (params.stockName) { //原Ezt首页三支股票跳转参数及国信
        var type = getQueryString('type');
        if (type === 'jsfx' || type === 'indexAnalysis') {
            // divId = showParamQuestion(params.stockName + "技术分析");
        }
        else if (params.stockCode) {
            divId = showParamQuestion(params.stockName + "后市如何操作？");
        }
    }else if(predicateType){ // Ezt首页改版后6大模块参数
        // 循环从地址栏中取参数
        for (var n in fixParams) {
            fixParams[n] = getQueryString(n) || '';
        }
        // 处理传值为null的情况
        if (fixParams.subjectName.indexOf('null') !== -1)
            fixParams.subjectName = '';
        divId = showParamQuestion(fixParams.subjectName + getCustomPredicateType(fixParams));
    }

    // 获取推送历史消息
    if (ifSupportSocketPush) {
        getPushHistoryMessage({
            appId: userId,
            source: appKey
        }, function (result) {
            // console.log(result)
            try {
                var list = result.data || [];
                for (var i=0; i<list.length; i++) {
                    socketPushAnswer(list[i].content, 'pull');
                }
            } catch (e) {
                // sendPreAnswerContent(e.toString())
            }

            initSocket();
        }, function (err) {
            initSocket();
        });
    }

    if (appKey === 'appHtyw') {
        sendPreAnswerContent("Hi, welcome to INDICS.com. How may I help you? I'm Alex")
        //Welcome to INDICS, how can I help you please?
        lastQuestionTime = new Date().getTime();
        startInterval();
    } else if (appKey === 'appHcVtm') {
        sendPreAnswerContent('我已经学习了理财新技能，如果您有理财的需求可以和我交流')
    }
});

// 目前航天云网用，当用户长时间未提问时发送提醒文字
var questionIntervalId = -1;
function startInterval() {
    if (questionIntervalId !== -1) {
        clearInterval(questionIntervalId)
    }

    questionIntervalId = setInterval(function () {
        if (new Date().getTime() - lastQuestionTime > 20000) {
            lastQuestionTime = new Date().getTime();
            sendPreAnswerContent('Welcome to INDICS, how can I help you please?');
            clearInterval(questionIntervalId);
        }
    }, 1000)
}

// 页面刷新或关闭之前关闭socket连接
function onbeforeunloadHandler(event) {
    // event.returnValue="确定离开当前页面吗111？";
    disconnect();
}
// window.onbeforeunload=function(e){
//     // var e = window.event||e;
//     // e.returnValue=("确定离开当前页面吗？");
//     disconnect();
// };
// window.onunload=function(e){
//     disconnect();
// };

/**
 * 初始化socket连接
 */
function initSocket() {
    // return;
    var url;
    // test
    // var url = '/test?appId='+userId+'&source='+appKey; ////
    // 开发环境
    // var url = location.protocol+'//chat.jinhui001.com?appId='+userId+'&source='+appKey;
    // var url = '//chat.jinhui001.com?appId='+userId+'&source='+appKey;
    // var url = 'ws://chat.jinhui001.com?appId='+userId+'&source='+appKey;
    // 测试
    // var url = 'http://gemantic-chat-service:31004?appId='+userId+'&source='+appKey
    //
    if (env && env === 'local') {
        return;
    } else {
        url = '/?appId='+userId+'&source='+appKey; ////
    }
    socket = io.connect(url);
    socket.on('messageevent', function(data) {
        // sendPreAnswerContent('收到消息：'+data);
        socketPushAnswer(data, 'push');
    });
    socket.on('connect', function() {
        // sendPreAnswerContent('连接socket服务器成功!');
    });
    socket.on('connect_error', function(error) {
        // sendPreAnswerContent('连接socket错误!');
    });
    socket.on('connect_timeout', function(timeout) {
        // sendPreAnswerContent('连接socket超时!');
    });
    socket.on('connecting', function() {
        // sendPreAnswerContent('正在连接socket!');
    });
    socket.on('connect_failed', function() {
        // sendPreAnswerContent('连接socket失败!');
    });
    socket.on('message', function() {
        // sendPreAnswerContent('message!');
    });
    socket.on('anything', function() {
        // sendPreAnswerContent('anything!');
    });
    socket.on('reconnect_failed', function() {
        // sendPreAnswerContent('重连socket失败!');
    });
    socket.on('reconnect', function(attemptNumber) {
        // sendPreAnswerContent('成功重连socket!');
    });
    socket.on('reconnect_attempt', function(attemptNumber) {
        // sendPreAnswerContent('尝试重连socket。。!');
    });
    socket.on('reconnect_error', function(error) {
        // sendPreAnswerContent('重连socket错误!');
    });
    socket.on('reconnecting', function() {
        // sendPreAnswerContent('正在重连socket!');
    });
    socket.on('disconnect', function(reason) {
        // sendPreAnswerContent('socket服务器断开连接!');
        if (reason === 'io server disconnect') {
        //     // the disconnection was initiated by the server, you need to reconnect manually
            socket.connect();
        }
    });
    socket.on('error', function(error) {
        // sendPreAnswerContent('发生错误!');
    });
}

/**
 * 关闭socket连接
 * @returns {boolean}
 */
function disconnect() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    return true;
}

function sendMsgToSocketServer(message) {
    var msg = {appId: userId, content: message};
    socket.emit('report', msg);
}

/**
 * 获取自定义的谓语分类字段
 * @param params
 * @returns {*|string}
 */
function getCustomPredicateType(params) {
    var strQ = '';
    if(!params.frontPredicateType || params.frontPredicateType==='(null)' || params.frontPredicateType==='null')
        strQ = params.predicateType;
    else
        strQ = params.frontPredicateType;
    return strQ;
}

// 获取默认tabs
function getDefaultTabs(from) {
    if(appKey === 'appHtyw' || appKey === 'appEdu' || appKey === 'appAvatar')
        return;
    getDefaultTabsInterface(null, function (result) {
        if (result.message.code == '0') {
            var temp = '';
            if (from === '呼叫投顾') {
                temp += '<li itemIndex="' + -1 + '" spanId="">人工服务</li>'
            }
            result.data.tabList.forEach(function (item, index)
            {
                // 判断是否可见
                if(item.name === '条件选股')
                {
                    var flag = showElement('条件选股轮播按钮');
                    if(!flag)
                        return false;
                }
                temp += '<li itemIndex="' + index + '" spanId="">' + item.name + '</li>'
            });
            $('.bottom nav ul').removeClass('show').html(temp);
            setInterval(function () {
                $('.bottom nav ul').addClass('show');
            }, 200);
            // debugger
            tabsQuestion = result.data;
            getSecondTitleList(result, '');
        }
    });
}
// 获取有二级list的tabs
function getSecondTitleList(result, spanId) {
    var hasSecondList = [];
    for (var i = 0; i < result.data.tabList.length; i++) {
        var item = result.data.tabList[i];
        if (!!!item.leaf) {
            hasSecondList.push(item);
        }
    }
    var temp = '';
    hasSecondList.forEach(function (item, index) {
        if(item.name !== '小e首页' && item.name !== '首页')
            temp += '<li itemIndex="' + index + '" spanId="' + spanId + '">' + item.name + '<b></b></li>'
    });
    $('.pop_bottomNav .pop_nav ul').html(temp);
}
//问问题后点击获取tabs
function getQuestionTabs(data) {
    if(appKey === 'appHtyw' || appKey === 'appEdu' || appKey === 'appAvatar' || !data.questionAnalyse)
        return;

    var param = data.questionAnalyse[0];
    // 部分推送的答案可能没有语义分析内容，因此获取底部tab列表需要判断，防止报错
    if (!param.semanticProperties) {
        return;
    }

    //存下来
    // questionAnalyseArr = [];
    questionAnalyseArr[data.spanId] = JSON.stringify(param);
    var type = "predicate";
    var name = param.semanticProperties.convertPredicate;

    // 跳转类型的指令
    if(data.hasOwnProperty('jumpResult')){
        name = data.jumpResult.jumpResultType;
    }else if(data.answerResultType === '股权质押页面'){
        name = data.data.operateType;
    }else if(param.hasOwnProperty('entity') && param.entity.length === 0 || !isStock(data)){
        // 最新资讯等没有实体的，大盘，概念等的取默认tab
        getDefaultTabs();
        return;
    }

    var params = {
        type: type,
        name: name

    };
    getTabsInterface(params, function (result) {
        // if(param.hasOwnProperty('entity')&&param.entity.length<=0&&(name==='资讯'||name==='研报'||name==='公告'))
        // else{
            var temp = '';
            result.data.tabList.forEach(function (item, index) {
                // 判断是否可见
                if(item.name === '条件选股')
                {
                    var flag = showElement('条件选股轮播按钮');
                    if(!flag)
                        return false;
                }
                temp += '<li itemIndex="' + index + '" spanId="' + data.spanId + '">' + item.name + '</li>'
            });
            $('.bottom nav ul').removeClass('show').html(temp);
            setInterval(function () {
                $('.bottom nav ul').addClass('show');
            }, 200);
            tabsQuestion = result.data;
            getSecondTitleList(result, data.spanId);
        // }

    });
}
//获取二级tabs 按钮的接口
function getSencondTabsList(data) {
    // var data;
    var params = {
        type: 'tab',
        name: data.name
    };
    var spanId;
    if (!!!data.hasOwnProperty('name')) {
        params.name = data.currentTarget.innerText;
        spanId = data.currentTarget.attributes.spanid.nodeValue;
    } else {
        spanId = data.spanId;
    }
    getTabsInterface(params, function (result) {
        var temp = '';
        var data = [];
        for (var i = 0; i < result.data.tabList.length; i++) {
            if (result.data.tabList[i].leaf) {
                data.push(result.data.tabList[i]);
            }
        }
        data.forEach(function (item, index) {
            temp += '<a itemIndex="' + index + '" spanId="' + spanId + '">' + item.name + '</a>'
        });
        $('.pop_bottomNav .box .pop_con .box').html(temp);
        secondTabsListData = data;
    });
}

// 点击tabs触发的事件
function clickTabs(index, data, spanId,innerText,ifParams) {
    var source = '/来源：底部悬浮按钮('+innerText+')';

    // 特殊处理
    if(innerText === '行业分析' || innerText === '热点概念'){
        var analysis = JSON.parse(questionAnalyseArr[spanId]);

        var predicateType = '行业分析';
        if(innerText === '')
            predicateType = '专家行业观点';
        else if(innerText === '热点概念')
            predicateType = '行业推荐';

        var nameStr = analysis.entity[0].property.name || analysis.entity[0].rawValue;
        var params = {
            subjectType: analysis.entity[0].type,
            subjectName: nameStr,
            subjectRawValue: nameStr,
            predicateType: predicateType
        };
        requestFixedAnswer(params, nameStr+data.name, '', true, source);
        return; //！！！
    }

    if (!!data.leaf) {
        var code, name, marketType, rawValue, item, objectName, objectType,subjectType,subjectName;
        index = +index;
        var secondList;
        if(secondTabsListData){
            secondList = secondTabsListData;
            if(secondList.length>index){
                objectName = secondList[index].hasOwnProperty('properties') ? secondList[index].properties.objectName : '';
                objectType = secondList[index].hasOwnProperty('properties') ? secondList[index].properties.objectType : '';
            }
        }
        if(questionAnalyseArr[spanId]&&JSON.parse(questionAnalyseArr[spanId])&&JSON.parse(questionAnalyseArr[spanId]).hasOwnProperty('entity')&&JSON.parse(questionAnalyseArr[spanId]).entity.length>0){
            var data2 = JSON.parse(questionAnalyseArr[spanId]);
            subjectType = data2.entity[0].type;
            subjectName = data2.entity[0].property.name || data2.entity[0].rawValue;
        }
        if (spanId&&JSON.parse(questionAnalyseArr[spanId]).hasOwnProperty('entity')) {
            item = JSON.parse(questionAnalyseArr[spanId]);
            for (var i = 0; i < item.entity.length; i++) {
                if (item.entity[i].type === '股票') {
                    marketType = item.entity[i].property.marketType;
                    code = item.entity[i].property.code;
                    name = item.entity[i].property.name;
                    rawValue = item.entity[i].property.rawValue;
                    break;
                }
            }
        }

        // debugger
        var paramsForTabs = {
            subjectCode: code,

            subjectMarket: marketType,
            subjectRawValue: rawValue,
            predicateType: data.predicateType,
            objectName: objectName,
            objectType: objectType,
            attribute: data.hasOwnProperty('properties') ? data.properties.attribute : '',
            attributeType: data.hasOwnProperty('properties') ? data.properties.attributeType : ''
        };
        if(!ifParams){
            paramsForTabs.subjectType = subjectType||'股票';
            paramsForTabs.subjectName = subjectName||name;
        }
        requestFixedAnswer(paramsForTabs, data.name, '', true,source);
        _close_bottomNav();
    } else {
        baiduTrackPageview('/'+appKey+'/module/问答/'+ '底部悬浮按钮：('+innerText+')' + source);
        if (data.name === '小e首页' || data.name === '首页') {
            helpClick();
            // getDefaultTabs();
        }
        else if (data.name == '问点别的') {
            getDefaultTabs();
        } else {
            var items = $(".pop_bottomNav .pop_nav li");
            for (var i = 0; i < items.length; i++) {
                if (items[i].innerText == data.name) {
                    items.eq(i).addClass("on").siblings().removeClass("on");
                }
            }

            data.spanId = spanId;
            getSencondTabsList(data);
            showTabsPop();
        }

        // alert('有子节点，请求新的节点');
    }
    // console.log(innerText);
    /*sa.track('tabsClick',{
        innerText:innerText,
        spanId:spanId
    });*/
}
// 展开tabs下面弹窗的方法
function showTabsPop() {
    $(".pop_bottomNav").fadeIn();
    $(".pop_bottomNav > .box").removeClass("box_hide").addClass("box_show");
    $(".pop_bottomNav > .box").slideDown(500);
}
/**
 * 延迟加载完成
 */
function loadComplete() {
    isChartPluginLoaded = true;
    if (showHistoryQ)
        showHistoryQuestion();

    //App里带参跳转
    var question = getQueryString("question");
    $("#questionId" + divId).remove();
    $("#loadingId" + divId).remove();

    if (question)
    {
        //兼容旧版
        freeQuestion(question);
    }
    else if (params.stockName)
    {
        // type for 国信
        var type = getQueryString('type');
        if(type){
            freeQuestion(params.stockName+'技术分析');
        }
        else{
            if(params.stockCode && params.predicateType){
                requestFixedAnswer(
                    {
                        subjectCode: params.stockCode,
                        subjectName: params.stockName,
                        predicateType: params.predicateType
                    },
                    params.stockName + "后市如何操作？",
                    '',
                    true
                )
            }else{
                freeQuestion(params.stockName);
            }
        }
    }
    else if(fixParams.predicateType)
    {
        if (fixParams.subjectType === '股票' && fixParams.subjectName === '' && !fixParams.question && fixParams.frontPredicateType)
            fixParams.question = fixParams.frontPredicateType;

        // 后端固定问答接口，需要多拼上question
        if (fixParams.predicateType === '股东增减持是') {
            fixParams.question = fixParams.subjectName + fixParams.predicateType;
        }

        requestFixedAnswer(fixParams, fixParams.subjectName + getCustomPredicateType(fixParams), fixParams.marketType, true);
    }
}

/**
 * 加载历史提问记录
 */
function showHistoryQuestion() {
    if (!isChartPluginLoaded) {
        showHistoryQ = true;
        return;
    }
    cookieArray = localStorage.cookieArray ? JSON.parse(localStorage.cookieArray) : [];
    if (cookieArray.length > 0) {
        $("#divShowHistory").hide();
        baiduTrackPageview('/'+appKey+'/module/问答/'+ '点击查看历史');
        var divId;
        for (var i = 0; i < cookieArray.length; i++) {
            if (cookieArray[i].hasOwnProperty("pushType")) {
                if (cookieArray[i].pushType == '股价变更') {
                    setAnswerForHistory(cookieArray[i].json.data.list[0]);
                } else {
                    setAnswerForHistoryForMorning(cookieArray[i].json.data, cookieArray[i].pushType);
                }
            } else {
                if (cookieArray[i].json.answerResultType == '股票推荐' || cookieArray[i].json.answerResultType == '所属题材') {
                    divId = sendQuestion(cookieArray[i].txt, cookieArray[i].time);
                    cookieArray[i].json.qId = divId;
                    setAnswer(cookieArray[i].json, '', true);
                    historyIndex = i;
                    break;
                } else {
                    if (cookieArray[i].json.answerResultType == '') {
                        successForBuyEntrust(cookieArray[i]);
                    } else {
                        divId = sendQuestion(cookieArray[i].txt, cookieArray[i].time);
                        cookieArray[i].json.qId = divId;
                        setAnswer(cookieArray[i].json, '', true,'来源:点击查看历史');
                    }

                }
            }
        }
        setTimeout("setTimeForHistory()", 300);
    }
}
/*
 延迟加载历史问题
 */
function setTimeForHistory() {
    if (historyIndex < 5) {
        var divId;
        for (var j = historyIndex + 1; j < cookieArray.length; j++) {
            divId = sendQuestion(cookieArray[j].txt, cookieArray[j].time);
            cookieArray[j].json.qId = divId;
            setAnswer(cookieArray[j].json, '', true);
        }
    }
}

/**
 * 通知原生激活唤醒功能
 */
function notifyAppFirstRun() {
    // alert('调用：notifyAppFirstRun: '+appFrom)
    try {
        // if(appKey === 'appEzt' || appKey === 'appTopC'){
            if (appFrom === 'android')
                window.contestapp.robotFirstRun();
            else if (appFrom === 'ios')
                window.webkit.messageHandlers.robotFirstRun.postMessage(1);
        // }
    } catch (e) {
        // alert('调用App方法出错：' + e.toString())
        // saveLog('jsError', e.message, 'index.js', 0, 'notifyAppFirstRun()', e.stack.toString());
    }
}

/**
 * 从App里传过来的语音问题，不可删除！
 * @param qtxt
 */
function questionFromApp(qtxt) {
    // console.log(qtxt)
    freeQuestion(qtxt, '', true);
    if (appKey === 'appAvatar') {
        try {
            // 问新问题时把弹窗关闭
            closePopup();
            // node
            $("div[class^=policy_]").hide();
            $("#policyDetail").hide();
        } catch (e) {
        }
    }
}

/**
 * 供外部调用
 * @param question
 */
function sendQuestionToRobot(question) {
    freeQuestion(question);
}

/**
 * 显示免责声明弹窗
 */
function showDisclaimer() {
    $("#divDisclaimer").addClass("show").removeClass("hide");
    eVoiceForRelief(appFrom, true);
}

/**
 * 同意免责声明
 */
function agreeDisclaimer() {
    $("#divDisclaimer").addClass("hide").removeClass("show");

    //缓存到本地
    if (localStorage) {
        if (!localStorage.hasOwnProperty('disclaimerAgreed'))
            localStorage.disclaimerAgreed = true;
    }

    eVoiceForRelief(appFrom, false);
}

/**
 * 在文本框中回车
 * @param event
 */
function sendQ(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        doSend();
    }
}

/**
 * 发送问题
 */
function doSend() {
    if ($.trim(txtInput.val())) {
        txtInput.blur();
        if (txtInput.val().indexOf('@小e') !== -1)
            feedback();
        else
            freeQuestion(txtInput.val(),"","","","","","来源：txtInput");
        clearInput();
    }
}

/**
 * 清空对话框文字
 */
function clearInput() {
    txtInput.val("");
    if (appFrom === 'pc') {
      txtInput.focus();
    }
}

/**
 * 问号点击
 */
function helpClick() {
    var helpHtml = $('#divHelp').html() || '';

    //添加loading
    // var divCircle = document.createElement("DIV");
    // divCircle.className = 'spinnerCircle';
    // document.getElementById("mainContent").appendChild(divCircle);
    // scrollToBodyEnd();

    var help_t = (new Date()).getTime();
    var div = document.createElement("DIV");
    div.id = "divHelp" + help_t;
    div.innerHTML = helpHtml;

    // setTimeout(function () {
        mainContent.appendChild(div);
        scrollToBodyEnd();
    //     setHelpCss(help_t);
    //     $('.spinnerCircle').remove();
    // },500);

    if (helpHtml) {
        getDefaultTabs();
    }
}

/**
 * 展示首页推荐 热门问题
 */
function showPresetHotQuestion(isShow) {
    if (isShow === false) {//点击主动推送  进入小E 不显示  首页热门推荐
        $('#divHelp').hide();
    } else {
        $('#divHelp').show();
        // setHelpCss(1);
    }
}

function helpClickSwitch() {
    // if (appFrom === 'ios' || appFrom === 'android') {
    //     //
    //     if (appKey === "appEzt" && checkVersion('1.1.7', appVersion)) {
    //         goSetting();
    //     } else {
    //         helpClick();
    //     }
    // } else {
        helpClick();
    // }
}

/**
 * 页面滚到最底端
 */
function scrollToBodyEnd() {
    var h = $(document).height() - $(window).height();
    $(document).scrollTop(h);
}

/**
 * 页面滚到问题
 */
function scrollToQuestion() {
    if (lastQuestionId) {
        try {
            document.getElementById(lastQuestionId).scrollIntoView();
        } catch (e) {
        }
    }
}

/**
 * 显示的问题跟实际发送给后台的区分
 * @param sendTxt 发送给后台的
 * @param showTxt 显示的问题
 */
function alterFreeQuestion(sendTxt, showTxt) {
    freeQuestion(sendTxt, showTxt);
}

/**
 * 给输入框添加“@”
 */
function setFeedbackMode() {
    if (appKey === 'appHtyw')
        return

    //使用原生输入框时将文本拷贝到原生
    if (useAppInput) {
        copyTxtToInput('@小e ');
    } else {
        var txt = txtInput.val();
        if (txt.indexOf('@小e') === -1)
            txtInput.val('@小e ');
        txtInput.focus();
    }
}

/**
 * 意见反馈
 */
function feedback() {
    var txt = txtInput.val();
    if (txt.replace('@小e', '') !== ' ') {
        sendQuestion(txt);
        //do send
        sendFeedback(txt, function (result) {
            if (result.code === 0) {
                txtInput.val('');
                sendPreAnswerContent('反馈成功送达，程序猿们会努力改进');
            } else {
                sendPreAnswerContent('发送失败，请稍后尝试');
            }
            scrollToBodyEnd();
        });
    } else {
        sendPreAnswerContent('呃，对小e说点什么吧...');
        scrollToBodyEnd();
    }
}

/**
 * 概念股 股票点击
 * @param stockCode
 * @param stockName
 * @param market
 */
function stockClick(stockCode, stockName, market) {
    var market1;
    if (market && market !== 'undefined')
        market1 = market;
    var params = {
        subjectCode: stockCode,
        subjectName: stockName,
        subjectType: '股票',
        predicateType: '股票'
    };
    requestFixedAnswer(params, stockName, market1 ? market1 : '', true);
    closePopup();
}

//重置呼叫投顾右对齐
function resetCallButton() {
    $(".md_fastNav ul").each(function () {
        if ($(this).hasClass('alignRight')) {
            $(this).parent().parent().addClass("short");
        } else {
            $(this).parent().parent().removeClass("short");
        }
    })
}

/**
 * 判断文字内容较多时是否需要收缩内容及显示展开按钮
 * @param ids [contentId, expandBtnId], contentId：内容容器Id， expandBtnId：展开按钮Id
 */
function checkTextOverflow(ids) {
    for (var i = 0; i < ids.length; i++) {
        var contentId, expandBtnId;
        contentId = ids[i][0];
        expandBtnId = ids[i][1];
        var content = $('#' + contentId);
        // console.log(content[0].scrollHeight, content.height())
        if (content[0].scrollHeight <= content.height())
            $('#' + expandBtnId).hide();
        else {
            content.addClass('show_row3');
            $('#' + expandBtnId).show();
        }
    }
}

/**
 * 展开隐藏内容
 * @param expandBtnId
 * @param contentId
 * @param foldBtnId
 */
function expandContent(expandBtnId, contentId, foldBtnId) {
    $('#' + expandBtnId).hide();
    $('#' + foldBtnId).show();
    $('#' + contentId).removeClass('show_row3');
}

/**
 * 展开研报精选隐藏内容
 * @param expandBtnId
 * @param contentId
 */
function expandResContent(expandBtnId, contentId,title) {
    $('#' + expandBtnId).hide();
    $('#' + contentId).removeClass('show_row3').addClass('show_all');
    baiduTrackEvent('研报精选展开点击','click',title+':研报精选展开点击');//百度统计
}

/**
 * 收缩内容
 * @param foldBtnId
 * @param contentId
 * @param expandBtnId
 */
function foldContent(foldBtnId, contentId, expandBtnId) {
    $('#' + foldBtnId).hide();
    $('#' + contentId).addClass('show_row3');
    $('#' + expandBtnId).show();
}

/**
 * 输入框获取焦点
 */
function txtInputOnFocus() {
    // var cnt = 0;
    // timerId = setInterval(function () {
    //     if (cnt < 3) {
    //         $(".page_body_v2").scrollTop($(".page_body_v2")[0].scrollHeight);    //文字内容滚动到底
    //         cnt++;
    //     } else {
    //         clearInterval(timerId);
    //         timerId = null;
    //     }
    // }, 300);
    //
    // scrollFoot();
}

/**
 * 滚动输入框
 */
function scrollFoot() {
    $(".page_body_v2").scrollTop($(".page_body_v2")[0].scrollHeight);    //文字内容滚动到底

    var v = getIOSVersion();
    if (compareVersion(v)) {
        setTimeout(function () {
            scrollToBodyEnd();
            $("body").scrollTop($("body")[0].scrollHeight);            //输入框滚动到底
        }, 500);
    }
}

function compareVersion(v) {
    if (v == "" || v == null) {
        return true;
    }
    if (explorer.indexOf("Safari") == -1) {
        return true;
    }
    v = v.split("_");
    if (v.length == 1) {
        v.push("0", "0");
    } else if (v.length == 2) {
        v.push("0");
    }
    v = v.join("");
    v = Number(v);
    if (v < 1112) {
        return true;
    } else {
        return false;
    }
}

function getIOSVersion() {
    var ver = navigator.userAgent;
    var isIos = (/iPhone|iPad|iPod/i).test(ver);
    var str1, str2;
    if (isIos) {
        str1 = ver.indexOf("OS");
        str2 = ver.indexOf("like Mac OS X");
        ver = ver.substring(str1 + 3, str2);

        ver = ver = $.trim(ver);
        return ver;
    }
}

/**
 * 点击跳转到APP语音输入方法
 */
function goVoice() {
    // alert("goVoice!");
    if (ifSupportWebAudio) {
        $('#icon-voice').hide();
        $('.box_input').hide();
        $('#icon-help').hide();
        $('#icon-keyboard').show();
        $('#recBtn').show();
    } else {
        $("footer.f_keyboard").addClass("hide");
        $("footer.f_voice").removeClass("hide");
        $(".icon-Send").addClass("hide");

        try {
            switch (appFrom) {
                case 'ios':
                    window.webkit.messageHandlers.showHintView.postMessage(true);
                    break;
                case "android":
                    window.contestapp.showEMicrophone(true);
                    break;
            }
        }
        catch (e) {
            saveLog('jsError', e.message, 'index.js', 0, 'goVoice()', e.stack.toString());
        }
    }
}

/**
 * 隐藏录音按钮等操作
 */
function hideVoice() {
    $('#icon-voice').show();
    $('#icon-help').show();
    $('.box_input').show();
    $('#recBtn').hide();
    $('#icon-keyboard').hide();
    try {
        if (isRecording) {
            $(".sayBg").click()
        }
    } catch (e) {}
}

/**
 * 输入方法的切换
 */
function goWord() {
    $("footer.f_voice").addClass("hide");
    $("footer.f_keyboard").removeClass("hide");
    $(".icon-Send").removeClass("hide");
    try {
        switch (appFrom) {
            case 'ios':
                window.webkit.messageHandlers.showHintView.postMessage(false);
                break;
            case "android":
                window.contestapp.showEMicrophone(false);
                break;
        }
    }
    catch (e) {
        // saveLog('jsError', e.message, 'index.js', 0, 'goWord()', e.stack.toString());
    }
}

/**
 * 点击设置按钮
 */
function goSetting() {
    try {
        switch (appFrom) {
            case 'ios':
                window.webkit.messageHandlers.showSettingPage.postMessage(1);
                break;
            case "android":
                window.contestapp.showESetting();
                break;
        }
    }
    catch (e) {
        saveLog('jsError', e.message, 'index.js', 0, 'goSetting()', e.stack.toString());
    }
}

$(".mb_btn .box_set a").click(function () {
    $(this).parents(".mb_btn").next(".mb_noBord").addClass("show").removeClass("hide");
    $(this).parents(".mb_btn").hide();
});
/******************************************************************************/
/* 180605   底部导航 */
/******************************************************************************/

// 点击显示更多项
$(".bottom nav ul li:first-child").click(function () {
    $(this).parents("ul").removeClass("show").siblings().addClass("show");
});


// 底部导航弹窗
$(".pop_bottomNav").hide();
$(".pop_bottomNav .box").hide();
// $(".pop_bottomNav").show();
// $(".pop_bottomNav > .box").addClass("box_show");
//

// 点击展开
$(".bottom nav ul li:nth-child(n+2)").click(function () {
    $(".pop_bottomNav").fadeIn();
    $(".pop_bottomNav > .box").removeClass("box_hide").addClass("box_show");
    $(".pop_bottomNav > .box").slideDown(500);


    // _fixed();
});

function _close_bottomNav() {
    $(".pop_bottomNav > .box").slideUp(150);
    $(".pop_bottomNav > .box").removeClass("box_show").addClass("box_hide");
    setTimeout(function () {
        $(".pop_bottomNav").fadeOut();
    }, 160);

    // $(".pop_bottomNav .box .sumUp").each(function () {
    //     $(this).hide();
    // });

    // $(".pop_bottomNav .pop_nav li").eq(0).addClass("on").siblings().removeClass("on");
    // $(".pop_bottomNav .pop_con .box").eq(0).addClass("show").siblings().removeClass("show");

}

//关闭弹窗
$(".pop_bottomNav a.close").click(function () {
    _close_bottomNav();
    // _fixed_cancel();
});


// 标签
$(".pop_bottomNav .pop_nav li").click(function () {
    var liN = $(this).index();
    $(this).addClass("on").siblings().removeClass("on");
    $(this).parents(".pop_nav").siblings(".pop_con").children(".box").eq(liN).addClass("show").siblings().removeClass("show");
});

// 点击弹窗标签内
$(".pop_bottomNav .pop_con .box a").click(function () {
    _close_bottomNav();
});
// 隐藏  技术分析优化v1.3 ++ 操盘线，提示弹窗
$(".pop_analysis_1_3_expma .btn a").click(function () {
    $(this).parents(".pop_analysis_1_3_expma").addClass("hide").removeClass("show");
});
// 隐藏  技术分析优化v1.2 ++ 短线决策，提示弹窗
$(".pop_analysis_1_2_shortPolicy .btn a").click(function () {
    $(this).parents(".pop_analysis_1_2_shortPolicy").addClass("hide").removeClass("show");
});
// 隐藏  技术分析优化v1.2 ++ 弹窗__趋势体系说明，提示弹窗
$(".pop_analysis_1_2_trendQuantization .btn a").click(function () {
    $(this).parents(".pop_analysis_1_2_trendQuantization").addClass("hide").removeClass("show");
});

/******************************************************************************/

/**
 * 打开弹窗
 */
function showPopup(title) {
    // if (useAppInput) {
    //     if(appKey === 'appEzt' || appKey === 'appTopC')
            hideInputAndShowTitleCover(appFrom, true);
    // }
    $('#bottomPopupTitle').html(title);
    $('#bottomPopup').show();
    $('.pop_BottomToTop .bg').show();
    $(".pop_BottomToTop").fadeIn();
    $(".pop_BottomToTop .box").slideDown(300);
    $('#bottomContainer').removeClass("box_hide").addClass("box_show");
}

/**
 * 关闭底部弹窗
 */
function closePopup() {
    setTimeout(function () {
        $(".pop_BottomToTop .box").slideUp(150);
        $(".pop_BottomToTop .box").removeClass("box_show").addClass("box_hide");
        $(".pop_BottomToTop").fadeOut();
        $('#bottomAnswerContainer').html('');
    }, 160);

    if (useAppInput && appKey !== 'appAvatar') {
        setTimeout(function () {
            hideInputAndShowTitleCover(appFrom, false)
        }, 500);
    }
}

function getExploer() {
    var userAgent = navigator.userAgent;
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    } //判断是否Opera浏览器
    else if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    else if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    else if (userAgent.indexOf("Safari") >= 0) {
        return "Safari";
    }
    return 'other';
}

/**
 * 弹出条件选股弹窗
 * @param conditions 筛选条件
 * @param showInteractiveView
 */
function showConditionBox(conditions, showInteractiveView) {
    if((appKey === 'appEzt' && appFrom === 'android' && checkVersion('1.3.8', appVersion))
        || (appKey === 'appEzt' && appFrom === 'ios' && checkVersion('1.9.20', appVersion))
        || appKey === 'appTopC'){
        openStockConditionPage();
        return;
    }

    //打开原生遮罩
    eVoiceForRelief(appFrom, true);
    $('#txaConditions').val(conditions ? conditions : '');

    //不为空则展示条件
    if (conditions)
        $('#btnConditionConfirm').removeClass('btnGray').addClass('btnBlue');

    //是否展示与原生交互界面
    if (useAppNativeView)
        $('#btnShowConditionExp').show();
    else
        $('#btnShowConditionExp').hide();

    $('#pickStockConditionBox').show();
}

/**
 * 关闭条件选股弹窗
 */
function closeConditionBox() {
    //关闭原生遮罩
    eVoiceForRelief(appFrom, false);
    $('#txaConditions').html('');
    $('#pickStockConditionBox').hide();
}

/**
 * 条件选股弹窗中点击确定
 */
function conditionChange() {
    var condition = $('#txaConditions').val();
    if (!condition)
        return;

    //关闭原生遮罩
    eVoiceForRelief(appFrom, false);
    $('#pickStockConditionBox').hide();
    //用正则过滤掉全是空格的情况
    var len = condition.length;
    var reg = new RegExp('\\s{' + len + '}');
    if (condition && !reg.test(condition)) {
        requestFixedAnswer({ question: condition, predicateType: '条件选股' }, condition, '', true);
    } else {
        pickStockByCondition({ data: {}, preAnswerContent: '我暂时还不知道符合以上条件的股票有哪些，换个条件试试？' });
    }
}

/**
 * 条件输入框中判断是否输入文字修改按钮颜色
 */
function conditionKeyup() {
    var condition = $('#txaConditions').val();
    if (condition)
        $('#btnConditionConfirm').removeClass('btnGray').addClass('btnBlue');
    else
        $('#btnConditionConfirm').removeClass('btnBlue').addClass('btnGray');
}

/**
 * 弹出条件说明页：2种方式
 */
function showConditionExp() {
    //调用原生打开
    if (appFrom === 'android' || appFrom === 'ios') {
        var params = {
            pageId: 'webView',
            url: 'https://moblie.hczq.com/xiaoe/tjxg.html?showCloseBtn=true',
            animationStyle: 'kHsPageAnimationFromTop'
        };
        //ios多传一个参数
        if (appFrom === 'ios')
            params.navigationStyle = 'HsNavigationStatusNone';
        commonCallback('routerNative', JSON.stringify(params));
    } else {
        //H5打开
        var temp = "<iframe src='https://moblie.hczq.com/xiaoe/tjxg.html?showCloseBtn=false&t=" + new Date().getTime() + "' style='border:none;' width='100%' height='100%' scrolling='auto'></iframe>";
        $("#expContainer").fadeIn().animate({ top: 0 });
        $('#expBox').html(temp);
    }
}

/**
 * 关闭条件说明页
 */
function closeConditionExp() {
    $('#expContainer').animate({ top: winH }).fadeOut();
}

/**
 * 某些原生APP不支持的功能给用户的提示
 */
function showUnRecognizedMsg() {
    sendPreAnswerContent('当前版本不支持此功能');
}

//打开投入产出分析说明弹窗
function inOutputAnalysisExp() {
    $('#inOutputAnalysisExpBox').show();
}

/**
 * 关闭投入产出分析说明弹窗
 */
function closeInOutputAnalysisExpBox() {
    $('#inOutputAnalysisExpBox').hide();
}
/**
 * 关闭弹出的pdf的弹窗
 */
function closePDFPop() {
    $(".pdfForAuto").addClass("hide").removeClass("show");
}

function closePDFPopForHand() {
    $(".pdfForHand").hide();
}

function addActClass(target){
    $(target).addClass("active");
        setTimeout(function(){
            $(target).removeClass("active");
        },300);
}

/**
 * 供原生调用Fix接口
 * @param params Json格式的字符串
 * @param outputQuestion 输出到页面的问题
 * @param marketType 市场代码
 */
function callJsFixApi(params, outputQuestion, marketType) {
    if(params && params !== '(null)'){
        if(outputQuestion){
            params = JSON.parse(params);
            requestFixedAnswer(params, outputQuestion, marketType);
        }else{
            sendPreAnswerContent('第二参数outputQuestion不能为空');
        }
    }else{
        sendPreAnswerContent('第一个参数params不能为空');
    }
}

// if(appKey === 'guoxin'){
//     (function($, h, c) {
//         var a = $([]),
//             e = $.resize = $.extend($.resize, {}),
//             i,
//             k = "setTimeout",
//             j = "resize",
//             d = j + "-special-event",
//             b = "delay",
//             f = "throttleWindow";
//         e[b] = 250;
//         e[f] = true;
//         $.event.special[j] = {
//             setup: function() {
//                 if (!e[f] && this[k]) {
//                     return false;
//                 }
//                 var l = $(this);
//                 a = a.add(l);
//                 $.data(this, d, {
//                     w: l.width(),
//                     h: l.height()
//                 });
//                 if (a.length === 1) {
//                     g();
//                 }
//             },
//             teardown: function() {
//                 if (!e[f] && this[k]) {
//                     return false;
//                 }
//                 var l = $(this);
//                 a = a.not(l);
//                 l.removeData(d);
//                 if (!a.length) {
//                     clearTimeout(i);
//                 }
//             },
//             add: function(l) {
//                 if (!e[f] && this[k]) {
//                     return false;
//                 }
//                 var n;
//                 function m(s, o, p) {
//                     var q = $(this),
//                         r = $.data(this, d);
//                     r.w = o !== c ? o: q.width();
//                     r.h = p !== c ? p: q.height();
//                     n.apply(this, arguments);
//                 }
//                 if ($.isFunction(l)) {
//                     n = l;
//                     return m;
//                 } else {
//                     n = l.handler;
//                     l.handler = m;
//                 }
//             }
//         };
//         function g() {
//             i = h[k](function() {
//                     a.each(function() {
//                         var n = $(this),
//                             m = n.width(),
//                             l = n.height(),
//                             o = $.data(this, d);
//                         if (m !== o.w || l !== o.h) {
//                             n.trigger(j, [o.w = m, o.h = l]);
//                         }
//                     });
//                     g();
//                 },
//                 e[b]);
//         }
//     })(jQuery, window);
//
//     var lastAnswerId = '';
//     var lastAnswerHeight = 0;
//     var parentWindow = window.parent;
//     $('div').resize(function(event)
//     {
//         if(!lastAnswerId)
//             return;
//
//         var h = $('#mainContent').height();
//         // var h = $('#'+lastAnswerId).height();
//         if(h > 0 && lastAnswerHeight !== h){
//             // console.log(h)
//             lastAnswerHeight = h;
//             parentWindow.postMessage({iframeId: iframeId, height: h}, '*');
//         }
//     });
// }

/**
 * 关闭页面
 */
function closePage() {
    try {
        disconnect();
        if (appFrom === 'android')
            window.contestapp.back();
        else if (appFrom === 'ios')
            commonCallback('back', 1);
    } catch (e) {
    }
}
