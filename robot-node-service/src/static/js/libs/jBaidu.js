var _hmt = _hmt || [];
// 用户访问路径
var userURL= '';
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?e7cbeb67daeb6e557032c7c5e7be5b9b";
    var url=window.location.href;
    if(url.indexOf('staging')!==-1){
        if(url.indexOf('robot2')!==-1){
            hm.src = "https://hm.baidu.com/hm.js?66548e10166010dd461a52bf76842d81";//测试  robot2
        }else{
            hm.src = "https://hm.baidu.com/hm.js?20335e1190caaea984e5768c7acde2c3";//测试环境
        }
    }
    if(url.indexOf('dev')!==-1){
        if(url.indexOf('robot')!==-1){
            hm.src = "https://hm.baidu.com/hm.js?1a8e0abe8142e717cc5cb82183f8fb10";//dev robot
        }
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();


/**
 * 百度统计
 * 事件统计
 * 百度统计 在事件链接中加入事件跟踪参数：
 * _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
 * @param category：String 要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必选。
 * @param action：String 用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必选。
 * @param opt_label：String 事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项可选。
 * @param opt_value：Number 事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。
 * 例如：_hmt.push(['_trackEvent','个股技术分析','click','事件说明']);//技术分析 百度统计
 */
function baiduTrackEvent(category,action,opt_label,opt_value){
    // console.log("操作内容----"+category);
    if(category === undefined){
        category = '';
    }
    if(opt_label !== undefined){
        // console.log("操作内容----"+category+"============事件来源----"+opt_label);
        var url = userURL+opt_label;
        var str = url;
        if(str.indexOf("来源") !== -1){
            var strArr = str.split("来源");
            if(strArr.length>1){
                userURL = userURL+strArr[1];
            }else{
                userURL = userURL+strArr[0];
            }
        }else{
            userURL = url;
        }

        if(window.urlParams && window.urlParams.appKey){
            opt_label = urlParams.appKey+"/"+opt_label;
        }
        _hmt.push(['_trackEvent',category,action,opt_label,opt_value]);//百度统计
    }
}

/**
 * 百度统计
 * trackPageview  url统计
 * 百度统计 在事件链接中加入事件跟踪参数：
 * _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
 * @param pageURL：要必选  String 指定要统计PV的页面URL	必须是以"/"（斜杠）开头的相对路径
 * 例如：_hmt.push(['_trackPageview', '/virtual/login']);
 */
function baiduTrackPageview(pageURL){
    if(pageURL !== undefined)
    {
        // console.log(pageURL);
        var url = userURL+pageURL;
        var str = url;
        if(str.indexOf("来源") !== -1)
        {
            var strArr = str.split("来源");
            if(strArr.length>1){
                userURL = userURL+strArr[1];
            }else{
                userURL = userURL+strArr[0];
            }
        }else{
            userURL = url;
        }
        _hmt.push(['_trackPageview', pageURL]);
    }
}
