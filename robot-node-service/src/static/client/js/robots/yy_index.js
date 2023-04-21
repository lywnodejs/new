/***********************************************************************************/
/******************************        智能问答v2.0      ****************************/
/*******************************      前端开发：阎延     *****************************/
/***********************************************************************************/



function scrollFoot(){
    // $(".body_v2").scrollTop( $(".body_v2")[0].scrollHeight);    //文字内容滚动到底
    $(".page_body_v2").scrollTop( $(".page_body_v2")[0].scrollHeight);    //文字内容滚动到底

    setTimeout(function () {
        $("body").scrollTop( $("body")[0].scrollHeight);            //输入框滚动到底
    },500);
}


$(function () {

    /******************************************************************************/
    /* 股票综评、竞争优势、F10-高管简介、F10-公司概况 */
    /******************************************************************************/

    //多余固定高度，隐藏文字，显示展开按钮
    var winW = $(window).width(),
        fs = 0.875,         //此处字号
        fl = 1.5,           //标准字行高
        row = 5,            //显示行数
        fEM, fLH, maxH;

    //标准字号
    if( winW <= 320){       //判断屏幕宽度320
        fEM = 14;
    }else{
        fEM = 16;
    }

    fLH = fEM * fs * fl;    //字行高 = 标准字号 * 此处字号 * 标准字行高
    maxH = fLH * row;         //最多显示高度


    $(".box_show_btn h5").each(function() {
        var txtH = $(this).outerHeight();       //实际字高度
        if( txtH <= maxH){      //实际字高度 <= 最多显示高度
            $(this).siblings(".a_more").hide();     //隐藏“展开”按钮
        }
        else{
            $(this).addClass("show_row" + row);      //只显示行数
            $(this).siblings(".a_more").show();     //显示“展开”按钮
        }
    });



    /******************************************************************************/

    //点击展开按钮

    $(".box_show .a_more").click(function() {
        row = 0;
        if ($(this).parents(".box_show").hasClass("box_show_r6")){
            row = 6;        //显示6行
        }
        else if($(this).parents(".box_show").hasClass("box_show_r3")){
            row = 3;        //显示3行
        }
        else if($(this).parents(".box_show").hasClass("box_show_btn")){
            row = 5;        //显示5行
        }

        $(this).siblings("h5").removeClass("show_row"+ row);      //显示全部文字
        $(this).hide();     //显示“展开”按钮
    });




    /******************************************************************************/
    /* 推荐股票new */
    /******************************************************************************/

    //带标题栏的收缩列表（收缩显示是文字）
    $(".box_show_olBD .box_bd.on .box_txt").show();      //显示li标签class=on的  h5标签

    $(".box_show_olBD .box_bd li:last-child").click(function() {
        $(this).parents(".box_bd").siblings().find("li:nth-child(3) h6").html("【展开】");   //其他li的文字换成“展开”
        $(this).children("h6").html("【收起】");  //当前li的文字换成“收起”

        if($(this).parents(".box_bd").hasClass("on")){
            $(this).parents(".box_bd").removeClass("on");         //移除li标签的样式名：on
            $(this).find("h6").html("【展开】");  //当前li的文字换成“展开”
        }else{
            $(this).parents(".box_bd").siblings().removeClass("on");    //移除其他li标签的样式名：on
            $(this).parents(".box_bd").addClass("on");            //当前li标签的添加样式名：on
        }

        $(this).parents(".box_bd").siblings().find("> .box_txt").slideUp();   //展开、收缩
        $(this).parents("ul").siblings(".box_txt").slideToggle();
    });



    /******************************************************************************/
    /* 推荐热点概念new */
    /******************************************************************************/

    //收缩列表（收缩显示是icon）
    $(".box_show_tlBD li.on .box_txt").show();      //显示li标签class=on的  h5标签

    $(".box_show_tlBD .box_hd a").click(function() {
        $(this).parents("li").siblings().find("a").html("【展开】");   //其他li的icon换成关闭状态
        $(this).html("【收起】");  //当前li的icon换成打开状态

        if($(this).parents("li").hasClass("on")){
            $(this).parents("li").removeClass("on");         //移除li标签的样式名：on
            $(this).html("【展开】");  //当前li的icon换成关闭状态
        }else{
            $(this).parents("li").siblings().removeClass("on");    //移除其他li标签的样式名：on
            $(this).parents("li").addClass("on");            //当前li标签的添加样式名：on
        }

        $(this).parents("li").siblings().find(".box_txt").slideUp();   //展开、收缩
        $(this).parent().siblings(".box_txt").slideToggle();
    });



    /******************************************************************************/
    /* 所属题材、推荐热点概念 */
    /******************************************************************************/

    //收缩列表（收缩显示是icon）
    $(".box_show_tl li.on h5").show();      //显示li标签class=on的  h5标签

    $(".box_show_tl .box_hd").click(function() {
        $(this).parent("li").siblings().find("i").attr("class","icon-arrow_closed");    //其他li的icon换成关闭状态
        $(this).find("i").addClass("icon-arrow_open");  //当前li的icon换成打开状态

        if($(this).parent("li").hasClass("on")){
            $(this).parent("li").removeClass("on");         //移除li标签的样式名：on
            $(this).find("i").attr("class","icon-arrow_closed");  //当前li的icon换成关闭状态
        }else{
            $(this).parent("li").siblings().removeClass("on");    //移除其他li标签的样式名：on
            $(this).parent("li").addClass("on");            //当前li标签的添加样式名：on
        }

        $(this).parent("li").siblings().find("h5").slideUp();   //展开、收缩
        $(this).siblings("h5").slideToggle(200);
    });


    /******  171103
    $(".box_show_tl .box_hd").click(function() {
        $(this).parent("li").siblings().find("i").attr("class","icon-arrow_closed2");    //其他li的icon换成关闭状态
        $(this).find("i").addClass("icon-arrow_open");  //当前li的icon换成打开状态

        if($(this).parent("li").hasClass("on")){
            $(this).parent("li").removeClass("on");         //移除li标签的样式名：on
            $(this).find("a").attr("class","icon-arrow_closed2");  //当前li的icon换成关闭状态
        }else{
            $(this).parent("li").siblings().removeClass("on");    //移除其他li标签的样式名：on
            $(this).parent("li").addClass("on");            //当前li标签的添加样式名：on
        }

        $(this).parent("li").siblings().find("h5").slideUp();   //展开、收缩
        $(this).siblings("h5").slideToggle();
    });
    */



    /******************************************************************************/
    /* 题材感念股、推荐股票、F10-股东持仓列表、F10-分红配股方案 */
    /******************************************************************************/

    //带标题栏的收缩列表（收缩显示是文字）
    $(".box_show_ol .box_bd.on>h5").show();      //显示li标签class=on的  h5标签

    $(".box_show_ol .box_bd li:nth-child(3)").click(function() {
        $(this).parents(".box_bd").siblings().find("li:nth-child(3) h6").html("【展开】");   //其他li的文字换成“展开”
        $(this).children("h6").html("【收起】");  //当前li的文字换成“收起”

        if($(this).parents(".box_bd").hasClass("on")){
            $(this).parents(".box_bd").removeClass("on");         //移除li标签的样式名：on
            $(this).find("h6").html("【展开】");  //当前li的文字换成“展开”
        }else{
            $(this).parents(".box_bd").siblings().removeClass("on");    //移除其他li标签的样式名：on
            $(this).parents(".box_bd").addClass("on");            //当前li标签的添加样式名：on
        }

        $(this).parents(".box_bd").siblings().find("> h5").slideUp();   //展开、收缩
        $(this).parents("ul").siblings("h5").slideToggle();
    });



    /******************************************************************************/
    /* 底部 */
    /******************************************************************************/

    $("footer textarea").click(function(){
        setTimeout(function () {
            scrollFoot();
        },500);
    });

    /******************************************************************************/

    //底部输入框最大、最小高度
    $("footer textarea").autoTextarea({
        maxHeight:72,
        minHeight:24
    });

    /******************************************************************************/

    //切换语音
    $("footer .icon-voice").click(function () {
        $("footer.f_keyboard").addClass("hide");
        $("footer.f_voice").removeClass("hide");
    });

    //切换输入
    $("footer .icon-keyboard").click(function () {
        $("footer.f_voice").addClass("hide");
        $("footer.f_keyboard").removeClass("hide");
    });



    /******************************************************************************/
    /* 七期 */
    /******************************************************************************/

    /* 加自选 */
    $(".mb_btn .box_set a").click(function () {
        $(this).parents(".mb_btn").next(".mb_noBord").addClass("show").removeClass("hide");
        $(this).parents(".mb_btn").hide();
    });


    /******************************************************************************/

    /* 重大事件tab */

    $(".mb_tab nav a").click(function () {
        $(this).addClass("on").siblings().removeClass("on");
        var order = $(this).index();
        //alert(order);

        $(this).parent().siblings().each(function () {
            //$(this).addClass("a" + order);
            $(this).removeClass("show");
        });
        //$(this).parent("nav").sibling(".nav_con").removeClass("show");
        $(this).parent().siblings().eq(order).addClass("show");
    });


    /******************************************************************************/

    /* 时间轴 */
    $(".box_timeLine > a").click(function () {
        if( $(this).find("i").hasClass("icon-arrow_shape_down")){
            $(this).find("i").removeClass("icon-arrow_shape_down").addClass("icon-arrow_shape_up");
            $(this).next(".timeLine").slideDown();
        }else if( $(this).find("i").hasClass("icon-arrow_shape_up")){
            $(this).find("i").removeClass("icon-arrow_shape_up").addClass("icon-arrow_shape_down");
            $(this).next(".timeLine").slideUp();
        }
    });


    /******************************************************************************/

    /* 财务面分析 */
    $(".box_analysis .analysis").scroll(function(){
        if ($(this).scrollLeft() > 20){
            $(this).siblings("i").hide();
        }
        else{
            $(this).siblings("i").show();
        }
    });


    /******************************************************************************/

    /* 综评 */
    $(".pop_BottomToTop").hide();
    $(".pop_BottomToTop .box").hide();
    $(".pop_BottomToTop .box .sumUp > div").hide();

    function _btt_show() {
        $(".pop_BottomToTop").fadeIn();
        $(".pop_BottomToTop .box").slideDown(500);
        $(".pop_BottomToTop .box").removeClass("box_hide").addClass("box_show");
    }


    //弹出全部
    $(".ul_sumUp li .box_bd2 > a").click(function () {
        var li = $(this).parents("li").attr('class');
        $(".pop_BottomToTop .box .sumUp > div").each(function () {
            if($(this).hasClass(li)){
                $(this).show();
            };
        });

        _btt_show();
    });


    //弹出全部 -- 选股条件 查看更多
    $(".box_conStock_more > a").click(function () {

        $(".pop_BottomToTop .box .sumUp > .sumUp_conStock").show();

        _btt_show();
    });


    //关闭弹窗
    $(".pop_BottomToTop a.close").click(function () {
        $(".pop_BottomToTop .box").slideUp(150);
        $(".pop_BottomToTop .box").removeClass("box_show").addClass("box_hide");
        setTimeout(function(){
            $(".pop_BottomToTop").fadeOut();
        },160);

        $(".pop_BottomToTop .box .sumUp > div").each(function () {
            $(this).hide();
        });
    });

    //加载更多
    $(".ul_sumUp + .box_load a").click(function () {
        $(this).parent(".box_load").siblings(".ul_sumUp").find("li").each(function () {
            $(this).removeClass("hide");
        });

        $(this).parent().hide();
    });



    /******************************************************************************/
    /* 条件选股第一期 */
    /******************************************************************************/

    /* 条件选股 */
    $(".box_conStock .conStock").scroll(function(){
        if ($(this).scrollLeft() > 20){
            $(this).siblings(".icon-arrow_shape_left").hide();
        }
        else{
            $(this).siblings(".icon-arrow_shape_left").show();
        }
    });

    /* 筛选条件 表格内只显示最新价 */
    $(".box_conStock .conStock").each(function() {
        var ul_num = $(this).find("ul").length;
        if( ul_num == 1){
            $(this).find("ul").addClass("ul_1");
            $(this).parents(".box_conStock").children(".icon-arrow_shape_left").hide();
        }
    });


    /******************************************************************************/
    /* 首页 智能推荐  */
    /******************************************************************************/

    var airW = $(".md_AIRecommend .box .hd").width();
    $(".md_AIRecommend .box .bd li").css({ "width": airW, "max-width": airW});



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
    $(".bottom nav ul li:nth-child(n+3)").click(function () {
        $(".pop_bottomNav").fadeIn();
        $(".pop_bottomNav > .box").slideDown(500);
        $(".pop_bottomNav > .box").removeClass("box_hide").addClass("box_show");

        // _fixed();
    });

    function _close_bottomNav() {
        $(".pop_bottomNav > .box").slideUp(150);
        $(".pop_bottomNav > .box").removeClass("box_show").addClass("box_hide");
        setTimeout(function(){
            $(".pop_bottomNav").fadeOut();
        },160);

        // $(".pop_bottomNav .box .sumUp").each(function () {
        //     $(this).hide();
        // });

        $(".pop_bottomNav .pop_nav li").eq(0).addClass("on").siblings().removeClass("on");
        $(".pop_bottomNav .pop_con .box").eq(0).addClass("show").siblings().removeClass("show");

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

    /* 180613  综评优化  */
    /******************************************************************************/

    // 柱形图
    var col_li = $(".box_columnar li"),
        tMax = 0,   // 最大数
        minH = 1,   // 柱最小高度
        col_num, col_percent;

    // 判断最大值
    col_li.each(function() {
        col_num = $(this).find(".txt").text();
        tMax = Math.max( parseInt(col_num) + minH , tMax) ;
    });

    // li每个的占比
    col_li.each(function() {
        col_num = $(this).find(".txt").text();
        col_num = parseInt(col_num) + minH;
        col_percent = col_num / tMax * 100 + "%";

        $(this).find(".txt").css("bottom", col_percent);
        $(this).find(".bar").css("height", col_percent);
    });


    /******************************************************************************/

    /* 弹出全部 -- 浮层__机构评级 */
    $(".box_comReview .InsRating").click(function () {
        $(".pop_BottomToTop .box .sumUp > .sumUp_InsRating").show();

        _btt_show();
    });


    /* 研报精选 */
    var ir_Li = $(".sumUp_InsRating .resReport li"),
        ir_liN;

    // 研报精选 只显示前三个
    ir_Li.each(function () {
        ir_liN = $(this).index();
        if( ir_liN >2){
            $(this).hide();
        }
    });

    // 研报精选 点击“加载更多”
    $(".sumUp_InsRating .box_load").click(function () {
        ir_Li.each(function () {
            ir_liN = $(this).index();
            if( ir_liN >2){
                $(this).show();
            }
        });
        $(this).hide();
    });

    // 研报精选中的展开、收起
    $(".sumUp_InsRating li .a_more").click(function () {
        $(this).hide();
        $(this).siblings("h5").addClass("show_all");
    });


    /******************************************************************************/

    /* 弹出全部 -- 浮层__财务面 */
    var bBlueH;
    $(".box_comReview .capFinance li:last-child").click(function () {
        $(".pop_BottomToTop .box .sumUp > .sumUp_finance2").show();

        _btt_show();

        _bBlueH();
    });


    // 标签切换
    $(".sumUp_finance2 .nav li").click(function () {
        var aN = $(this).index(),
            con_ul = $(this).parents(".box_fix").siblings(".content_ul").find(".box_con").eq(aN);
        $(this).addClass("on").siblings().removeClass("on");

        con_ul.addClass("show");
        con_ul.siblings().removeClass("show");
    });

    function _bBlueH() {
        bBlueH = $(".sumUp_finance2 .box_bgBlue").outerHeight();
        // console.log(bBlueH);
    }

    // 固定ol 部分
    $(".sumUp_finance2 .pop_bd").scroll(function () {
        var sT = $(this).scrollTop();

        if (sT > bBlueH){
            $(this).find(".box_fix").addClass("fix");
        }else{
            $(this).find(".box_fix").removeClass("fix");
        }
    });


    /******************************************************************************/

    /* 弹出全部 -- 浮层__风险提示 */
    $(".box_comReview .riskHints").click(function () {
        $(".pop_BottomToTop .box .sumUp > .sumUp_riskHints").show();

        _btt_show();
    });


    /******************************************************************************/

    /* 弹出全部 -- 浮层__资金面 */
    $(".box_comReview .capFinance li:first-child").click(function () {
        $(".pop_BottomToTop .box .sumUp > .sumUp_capital").show();

        _btt_show();
    });


    /******************************************************************************/

    /* 老版弹窗 -- 浮层__所属概念 */
    $(".box_comReview .subMatter").click(function () {
        $(".pop_BottomToTop .box .sumUp > .sumUp_conOwn").show();

        _btt_show();
    });


    /* 老版弹窗 -- 浮层__技术面分析 */
    $(".box_comReview .technical").click(function () {
        $(".pop_BottomToTop .box .sumUp > .sumUp_tech").show();

        _btt_show();
    });


    //


    /******************************************************************************/
    /* 180705   底部导航按下效果 */
    /******************************************************************************/

    var $li = $(".bottom nav li");
    $li.click(function () {
        $(this).addClass("active");

        setTimeout(function(){
            $li.removeClass("active");
        },300);
    });


    /******************************************************************************/
    /* 180724   技术分析优化v1.1 */
    /******************************************************************************/

    // 标签切换
    $(".box_analysis2 .nav li").click(function () {
        var aN = $(this).index(),
            con_ul = $(this).parents(".nav").siblings(".content_ul").find(".box_con").eq(aN);
        $(this).addClass("on").siblings().removeClass("on");

        con_ul.addClass("show");
        con_ul.siblings().removeClass("show");
    });


    // 指标说明
    $(".box_analysis2 .box_con .btn").click(function () {
        var btnI = $(this).find("i");
        if(btnI.hasClass("icon-arrow2_B_small")){
            btnI.removeClass().addClass("icon-arrow2_T_small");
            $(this).siblings(".box_explain").slideDown();
        }else{
            btnI.removeClass().addClass("icon-arrow2_B_small");
            $(this).siblings(".box_explain").slideUp();
        }
    });


    /******************************************************************************/
    /* 180813   综评优化三期 */
    /******************************************************************************/

    /* 弹出全部 -- 浮层__财务面 */
    $(".box_comReview .cfi li:nth-child(2)").click(function () {
        $(".pop_BottomToTop .box .sumUp > .sumUp_finance2").show();

        _btt_show();

        _bBlueH();
    });


    /* 弹出全部 -- 浮层__机构面 */
    $(".box_comReview .cfi li:last-child").click(function () {
        $(".pop_BottomToTop .box .sumUp > .sumUp_InsRating").show();

        _btt_show();

        _bBlueH();
    });


    /******************************************************************************/
    /* 180913   技术分析v1.2 */
    /******************************************************************************/

    // 标签切换
    $(".box_analysis_1_2 .tab li").click(function () {
       // $(this).addClass("on");
        var liN = $(this).index();

        $(this).addClass("on").siblings().removeClass("on");

        $(this).parents(".tab").next().children(".item").siblings().removeClass("show");
        $(this).parents(".tab").next().children(".item").eq(liN).addClass("show");
    });


    // 百叶窗切换
    $(".box_analysis_1_2 .blinds_kdj .title").click(function () {
        $(this).parents("li").find(".box").slideUp();
        if( $(this).parents("li").hasClass("on") > 0){
            $(this).parents("li").removeClass("on");
            $(this).find("i").attr("class", "icon-arrow_open");
        }else{
            $(this).parents("li").siblings().find(".box").slideUp();
            $(this).parents("li").find(".box").slideDown();
            $(this).parents("li").addClass("on").siblings().removeClass("on");
            $(this).find("i").attr("class", "icon-arrow_closed2");
            $(this).parents("li").siblings().find("i").attr("class", "icon-arrow_open");
        }
    });


    /******************************************************************************/
    /* 181226    */
    /******************************************************************************/

    // 标签切换
    $(".box_marginBalance .tab li").click(function () {
        // $(this).addClass("on");
        var liN = $(this).index();

        $(this).addClass("on").siblings().removeClass("on");

        $(this).parents(".tab").next().children(".item").siblings().removeClass("show");
        $(this).parents(".tab").next().children(".item").eq(liN).addClass("show");
    });




    /******************************************************************************/

});
