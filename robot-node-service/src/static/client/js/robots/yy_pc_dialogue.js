/***********************************************************************************/
/**************************       pc版对话框——航天云网      *************************/
/*******************************      前端开发：阎延     *****************************/
/***********************************************************************************/

function resizeWin() {
    var rxh_winH = $(window).height();          // 浏览器高度
    var rxh_headH = $(".rxh_pcDia_hd").height();        // 头部高度
    var rxh_footH = $(".rxh_pc_dialogue .bottom").height();     // 底部高度
    var rxh_mainH = rxh_winH - rxh_headH - rxh_footH;       // 内容区域高度
    var rxh_big_TB = 40;        // 全屏时，上下留白

    $(".rxh_pc_dialogue .page_body_v2").css("height", rxh_mainH);       // 设置内容区域高度
    $(".rxh_pc_dialogue footer .box_input .icon-Send").addClass("rxh_pcDia_a_btn").removeClass("icon-Send");        // 改发送按钮样式
    $(".rxh_pc_dialogue footer .box_input .rxh_pcDia_a_btn").html("Send");        // 改发送按钮上的文字

    // 最大化
    var rxh_parameter = getQueryString('windowType');
    if( rxh_parameter === "big"){
        $(".rxh_pc_dialogue").addClass("rxh_pcDia_big");        // 添加全屏样式

        $(".rxh_pcDia_big").css("height", rxh_winH - rxh_big_TB);       // 全屏高度
        // $(".rxh_pcDia_big").css("width", $(window).width() - rxh_big_TB);       // 全屏高度
        $(".rxh_pcDia_big .page_body_v2").css("height", rxh_mainH - rxh_big_TB);        // 全屏内容区域高度
    }
}

resizeWin();

window.onresize = resizeWin;

