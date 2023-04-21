/***********************************************************************************/
/******************************       智能问答v2.0       ****************************/
/*******************************      前端开发：阎延     *****************************/
/***********************************************************************************/
/**********************************       弹窗       *******************************/
/***********************************************************************************/

$(function () {
    var winH = $(window).height();
    /*
    //协议滚到底部，才可以点击关闭
    $(".pop_pact_v2 .txt").scroll(function () {
        var viewH = $(this).height(),    //可见高度
            contentH = $(this).get(0).scrollHeight,  //内容高度
            scrollT = $(this).scrollTop();     //滚动高度

        //可点
        if (contentH - viewH == scrollT) {
            $(this).siblings(".btn").children("a").attr("class", "t_blue");

            $(this).siblings(".btn").click(function () {
                $(this).parents(".pop_pact_v2").addClass("hide").removeClass("show");
            });
        }
    });
    */



    //点击《免责声明》，显示协议弹窗
    // $(".md_pact_v2 .a_pact").click(function () {
    //     $(".pop_pact_v2").addClass("show").removeClass("hide");
    // });
    //
    // //隐藏协议弹窗
    // $(".pop_pact_v2 .btn a").click(function () {
    //     $(this).parents(".pop_pact_v2").addClass("hide").removeClass("show");
    // });


    /******************************************************************************/

    //reEnter
    $("li.reEnter").click(function() {
        $(".pop_reEnter_v2").addClass("show").removeClass("hide");
    });
    $(".pop_reEnter_v2 ul.btn li").click(function() {
        $(".pop_reEnter_v2").addClass("hide").removeClass("show");
    });

    //弹窗 请输入其他选股条件
    // $(".box_condition .a_condition").click(function() {
    //     $(".pop_condition").addClass("show").removeClass("hide");
    // });
    // $(".pop_condition ul.btn li").click(function() {
    //     $(".pop_condition").addClass("hide").removeClass("show");
    // });



    /******************************************************************************/

    /* 风险信息 提示弹窗 */
    //$(".box_risk .box_timeLine_factor .space_between span:first-child").click(function () {
    // $(".box_risk .box_timeLine_factor li").click(function () {
    //     $(".pop_prompt_risk").addClass("show").removeClass("hide");

    //      var propH = $(".pop_prompt_risk .box").height(),
    //          propT = (winH - propH) / 2 - 20;
    //      $(".pop_prompt .box").css({"top": propT});
    // });

    //隐藏 风险信息 提示弹窗
    // $(".pop_prompt_risk .btn a").click(function () {
    //     $(this).parents(".pop_prompt_risk").addClass("hide").removeClass("show");
    // });



    /******************************************************************************/

    /* 技术分析优化v1.2 ++   趋势量能，提示弹窗 */
    // $(".box_risk .box_timeLine_factor .space_between span:first-child").click(function () {
    $(".box_analysis_1_2 .item .hd a").click(function () {
        $(".pop_analysis_1_2_trendSystem").addClass("show").removeClass("hide");

         var propH = $(".pop_analysis_1_2_trendSystem .box").height(),
             propT = (winH - propH) / 2 - 20;
         $(".pop_prompt .box").css({"top": propT});
    });

    // 隐藏 投入产出分析，提示弹窗
    $(".pop_analysis_1_2_trendSystem .btn a").click(function () {
        $(this).parents(".pop_analysis_1_2_trendSystem").addClass("hide").removeClass("show");
    });



    /******************************************************************************/

    /* 技术分析优化v1.2 ++   短线决策，提示弹窗 */

    $(".box_analysis_1_2 .item:first-child h5.hd a").click(function () {
        $(".pop_analysis_1_2_trendQuantization").addClass("show").removeClass("hide");

        var propH = $(".pop_analysis_1_2_trendQuantization .box").height(),
            propT = (winH - propH) / 2 - 20;
        $(".pop_prompt .box").css({"top": propT});
    });

    // 隐藏 投入产出分析，提示弹窗
    $(".pop_analysis_1_2_trendQuantization .btn a").click(function () {
        $(this).parents(".pop_analysis_1_2_trendQuantization").addClass("hide").removeClass("show");
    });



    /******************************************************************************/

    /* 技术分析优化v1.2 ++   短线决策，提示弹窗 */

    $(".box_analysis_1_2 .chart_note2 strong:nth-child(3)").click(function () {
        $(".pop_analysis_1_2_shortPolicy").addClass("show").removeClass("hide");

        var propH = $(".pop_analysis_1_2_trendSystem .box").height(),
            propT = (winH - propH) / 2 - 20;
        $(".pop_prompt .box").css({"top": propT});
    });

    // 隐藏 投入产出分析，提示弹窗
    $(".pop_analysis_1_2_shortPolicy .btn a").click(function () {
        $(this).parents(".pop_analysis_1_2_shortPolicy").addClass("hide").removeClass("show");
    });



    /******************************************************************************/

    /* 190321 条件选股优化 */

    $(".ul_pop a").click(function () {
        $(".pop_bottomClose").show();
    });

    // 隐藏 投入产出分析，提示弹窗
    $(".pop_bottomClose .a_close").click(function () {
        $(this).parents(".pop_bottomClose").hide();
    });



    /******************************************************************************/

    /* 190610 选择弹窗，热点偏好筛选 */
    $(".a_hotPreScreen").click(function () {
        $(".pop_hotPreScreen").show();
    });

    // 隐藏弹窗
    $(".pop_hotPreScreen .a_close").click(function () {
        $(this).parents(".pop_hotPreScreen").hide();
    });
    $(".pop_hotPreScreen .btn").click(function () {
        $(this).parents(".pop_hotPreScreen").hide();
    });

    // 单选
    $(".pop_hotPreScreen .bd li").click(function () {
        if( $(this).find("i").hasClass("icon-select_no")){
            console.log(11);
            $(this).find("i").removeClass("icon-select_no").addClass("icon-select");
            $(this).siblings().find("i").removeClass("icon-select").addClass("icon-select_no");
        }else{
            $(this).find("i").removeClass("icon-select").addClass("icon-select_no");
        }
    });



    /******************************************************************************/
});
