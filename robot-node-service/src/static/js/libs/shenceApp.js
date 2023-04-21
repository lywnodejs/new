(function (para) {
    var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script', x = null, y = null;
    w['sensorsDataAnalytic201505'] = n;
    w[n] = w[n] || function (a) { return function () { (w[n]._q = w[n]._q || []).push([a, arguments]); } };
    var ifs = ['track', 'quick', 'register', 'registerPage', 'registerOnce', 'clearAllRegister', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify', 'login', 'logout', 'trackLink', 'clearAllRegister'];
    for (var i = 0; i < ifs.length; i++) {
        w[n][ifs[i]] = w[n].call(null, ifs[i]);
    }
    if (!w[n]._t) {
        x = d.createElement(s), y = d.getElementsByTagName(s)[0];
        x.async = 1;
        x.src = p;
        y.parentNode.insertBefore(x, y);
        w[n].para = para;
    }
})({
    sdk_url: 'static/js/libs/sensorsdata.min.js',
    name: 'sa',
    server_url: 'http://ezt.hczq.com:8006/sa?project=e_test_project',
    web_url:'https://ezt.hczq.com:8007/',
    show_log: 0, // 是否在控制台输出日志
    heatmap: {
        //是否开启点击图，默认 default 表示开启，可以设置 'not_collect' 表示关闭
        clickmap:'default',
        //是否开启触达注意力图，默认 default 表示开启，可以设置 'not_collect' 表示关闭
        scroll_notice_map:'default',
        //设置成 true 后，我们会自动给 a 标签绑定一个 sa.trackLink() 方法（详见本页 3.3 ）。
        //如果是单页面 a 标签不涉及页面跳转或者 a 标签的点击是下载功能，建议不要打开。默认 false 。
        isTrackLink: false,
        //设置多少毫秒后开始渲染点击图,因为刚打开页面时候页面有些元素还没加载
        loadTimeout:  3000,
        //返回真会采集当前页面的数据，返回假表示不采集当前页面,设置这个函数后，内容为空的话，是返回假的。不设置函数默认是采集所有页面
        collect_url: function(){
            //如果只采集首页
            if(location.origin === 'http://localhost:20022'||location.origin === 'http://dev.robot.jinhui001.com:8080/master'||location.origin === 'http://dev.robot2.jinhui001.com:8080/master'|| location.origin === 'http://staging.robot.jinhui001.com/master' || location.origin === 'http://robot.rxhui.com/master'){
                return true;
            }
        },
        //用户点击（a，button，input）这些元素时会触发这个函数，让你来判断是否要采集当前这个元素，返回真表示采集，返回假表示不采集。
        //不设置这个函数，默认是采集 a button input 这些标签。
        collect_element: function(element_target){
            // 如果这个元素有属性sensors-disable=true时候，不采集
            if(element_target.getAttribute('sensors-disable') === 'true'){
                return false;
            }else{
                return true;
            }
        },
        //考虑到用户隐私，这里可以设置input里的内容是否采集
        //如果返回真，表示采集input内容，返回假表示不采集input内容,默认不采集
        collect_input:function(element_target){
            //例如如果元素的id是a，就采集这个元素里的内容
            if(element_target.id === 'a'){
                return true;
            }
        },
        //假如要在 $WebClick 事件增加自定义属性，可以通过（a，button，input）这三类标签的特征来判断是否要增加
        custom_property:function( element_target ){
            //比如您需要给有 data=test 属性的标签的点击事件增加自定义属性 name:'aa' ，则代码如下
            if(element_target.getAttribute('data') === 'test'){
                return {
                    name:'aa'
                }
            }
            if(element_target.id === 'technical'){
                return {
                    name:'技术面分析'
                }
            }
            if(element_target.id === 'riskHints'){
                return {
                    name:'风险提示'
                }
            }
            if(element_target.id === 'fund'){
                return {
                    name:'资金面'
                }
            }
            if(element_target.id === 'finance'){
                return {
                    name:'财务面'
                }
            }
            if(element_target.id === 'rating'){
                return {
                    name:'估值评级'
                }
            }
        },
        // 设置触达图的有效停留时间，默认超过4秒以上算有效停留
        scroll_delay_time: 4000
    }
});
// sa.quick('autoTrack'); //神策系统必须是1.4最新版及以上


window.onload = function () {
    var appFrom = getQueryString("appKey");
    if('appEzt' == appFrom){
        appFrom = "e智通";
    }else if('appXgw' == appFrom){
        appFrom = "知了选股";
    }else{
        appFrom = "web浏览器";
    }
    if(isWeiXin()){
        appFrom = "微信";
    }
    // alert(appFrom)
    // var userName = getQueryString("userId");
    var userName = window.phoneNumber || '';
    if(null == userName){
        userName = "guest";
    }
    var isFirst = false;
    if (localStorage) {
        //首次运行
        if (!localStorage.hasOwnProperty('disclaimerAgreed')) {
            isFirst = true;
        }
    }
    if(userName){
        sa.login(userName);
        sa.quick('autoTrack')
    }

    sa.track('Start',{Channel: appFrom,$is_first_time:isFirst});
}
//获取浏览器参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r !== null) return decodeURI(r[2]); return null;
}


//判断是否是微信浏览器的函数
function isWeiXin(){
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    var ua = window.navigator.userAgent.toLowerCase();
    //通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}
