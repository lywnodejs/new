/***********************************************************************************/
/********************************       智能问答       ******************************/
/*******************************      前端开发：阎延     *****************************/
/***********************************************************************************/
/***********************************************************************************/

$(function(){

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    var f_sendW = 0;
    // 兼容ios8,android4
    function css_lowVer(){

        ////////////////////////////////////////////////////////////

        // 静态页面低版本需要带yy传参
        // var parameter = location.search; //.substring(1);
        // if( parameter == "yy"){
        //     $('head').append('<link rel="stylesheet" href="/css/yy_style_lowVer.css?v=1.4" />');
        // }else{
        //     $('head').append('<link rel="stylesheet" href="css/yy_style_lowVer.css?v=1.4" />');
        // }

        // 静态页面低版本
        var url = window.location.href;
        if(url.indexOf("/html/") >= 0 ) {
            $('head').append('<link rel="stylesheet" href="/css/yy_style_lowVer.css?v=1.4" />');
        }else{
            $('head').append('<link rel="stylesheet" href="css/yy_style_lowVer.css?v=1.4" />');
        }


        ////////////////////////////////////////////////////////////

        //低版本样式
        var winW = $(window).width(),		//屏幕宽度
            winH = $(window).height(),
            pactLabW = $(".md_pact_v2 label").width(),
            pactAW = $(".md_pact_v2 .a_pact").width(),
            pactW = pactLabW + pactAW + 32,		//协议宽度

            pactMT = (winW - pactW) /2;
        $(".md_pact_v2").css("margin-left", pactMT);


        ////////////////////////////////////////////////////////////

        //协议
        var popH = winH * 0.65,
            popT = winH * 0.175;
        $(".pop_pact_v2 .box").css({"height":popH, "top":popT});


        ////////////////////////////////////////////////////////////

        //底部
        var f_helpW = $("footer .icon-help").width(),
            f_boxW = winW - f_helpW *2 - 24,
            f_areaW = f_boxW - f_sendW;
        f_sendW = $("footer .icon-Send").width();
        $("footer .box").css("width", f_boxW);
        $("footer .box_input").css("width", f_boxW);
        $("footer .box_input textarea").css("width", f_areaW);


        ////////////////////////////////////////////////////////////

        //模板
        var footH = $("footer").height(),
            bodyH = winH - footH;
        $(".body_v2").css("height", bodyH);


        ////////////////////////////////////////////////////////////

        //答
        var l_txtW = winW - 80; //左右边距：16*2=32，头像+右边距：48
        //alert(l_txtW);
        $(".md_left_v2 > h4").css("width", l_txtW);


        ////////////////////////////////////////////////////////////

        //带背景色的标题框
        var box_hdW = winW - 16 * 4,
            box_hd_spanW = $(".box_hd2 span").outerWidth(),
            box_hd_bW = $(".box_hd2 b").width(),
            box_hd_emW = box_hdW - box_hd_spanW - box_hd_bW - 8*2;
        $(".box_hd2 em").css("width", box_hd_emW);

        var box_hd_emH = $(".box_hd2 em").height() + 2;
        $(".box_hd2 b").css("height", box_hd_emH + 6*2);
        $(".box_hd2 span").css({"height": box_hd_emH});


        ////////////////////////////////////////////////////////////

        //技术面分析
        var ddW = winW - 32 - 36 - 16,
            ddH = $(".box_timeLine .timeLine li dd").outerHeight() + 43;
        //alert(ddW);
        $(".box_timeLine .timeLine li").css({"height": ddH});
        $(".box_timeLine .timeLine li dt").css({"height": ddH});
        $(".box_timeLine .timeLine li dd").css({"width": ddW});


        ////////////////////////////////////////////////////////////

        //综评、晨间推送
        var pop_boxH = winH * 0.9,
            pop_bdH = winH * 0.9 - 110;
            // finance2_W = winW + 28*2;
        $(".pop_BottomToTop").css({"height": winH});
        $(".pop_BottomToTop .bg").css({"height": winH});
        $(".pop_BottomToTop .box").css({"height": pop_boxH});
        $(".pop_BottomToTop .box_show").css({"height": pop_boxH});
        $(".pop_BottomToTop .pop_bd").css({"height": pop_bdH});
        // $(".sumUp_finance2 .fix").css({"width": finance2_W, "background": "red"});


        ////////////////////////////////////////////////////////////
        //条件选股第一期
        ////////////////////////////////////////////////////////////

        var //筛选条件
            boxCon_w = $(".box_condition").width(),
            boxH5_w = $(".box_condition h5").width(),
            boxConR_w = boxCon_w - boxH5_w,

            //表格
            ul_num = $(".box_conStock .conStock ul").length,
            ul_total = 50 * ul_num + "%",
            ul_w = 100 / ul_num + "%";

        //筛选条件
        $(".box_condition .box_R").css("width",boxConR_w);

        //表格
        $(".box_conStock .conStock .box").css("width",ul_total);
        $(".box_conStock .conStock ul").css("width",ul_w);


        ////////////////////////////////////////////////////////////

    };

    // css_lowVer();


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    var ver = navigator.userAgent;
    // console.log(navigator.userAgent)
    var isIos = (/iPhone|iPad|iPod/i).test(ver);
    var isAndroid = (/Android/i).test(ver);
    var str, str1, str2;
    if (isAndroid) {
        var index = ver.indexOf("Android");
        var strVer = ver.slice(index+8);
        var androidVersion = parseFloat(strVer);
        if (androidVersion < 5){
            css_lowVer();
            // alert("Android低版本:"+androidVersion);
            $("footer .box_input").css("margin-top","14px");
            $("footer .box_input .icon-Send").css("margin-left",f_sendW);
        }
    }
    else if(isIos){
        str1=ver.indexOf("OS");
        str2=ver.indexOf("like Mac OS X");
        ver = ver.substring(str1+3,str2);
        str = ver.toString().split('_');
        ver = parseInt(str[0]);
        if (ver < 9){
            css_lowVer();
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
});
