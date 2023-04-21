/***********************************************************************************/
/******************************       智能问答v2.0       ****************************/
/*******************************      前端开发：阎延     *****************************/
/***********************************************************************************/

//各浏览器兼容

$(function () {
    var explorer = navigator.userAgent,
        winH = $(window).height(),
        footH = $("footer").height();

    // alert(explorer);

    ///////////////////////////////////////////////////////////////////////
    ///截取字符串
    ///////////////////////////////////////////////////////////////////////

    var str_arr = explorer.split("/");
    var str_arr_item, str_need, str_need_arr;

    //360浏览器
    if(explorer.indexOf('Chrome') != -1){
        for(var i = 0;i<str_arr.length-1;i++){
            str_arr_item = str_arr[i];
            if(str_arr_item.indexOf('Chrome') != -1){
                str_need = str_arr_item;
            }
        }
        str_need_arr = str_need.split(".");
        //alert(str_need_arr[0]);
    }
    else if(explorer.indexOf('Safari') != -1){
        for(var i = 0;i<str_arr.length-1;i++){
            str_arr_item = str_arr[i];
            if(str_arr_item.indexOf('Safari') != -1){
                str_need = str_arr_item;
            }
        }
        str_need_arr = str_need.substring(0,2);
        //alert(str_need_arr);
    }

    ///////////////////////////////////////////////////////////////////////

    if(explorer.indexOf("Chrome") >= 0){

        if(str_need_arr[0] <= 4){
            //alert("360浏览器");

            //////////////////////////////////////////////////////////////////////////
            //Android4版本  360浏览器  360手机上bug

            $("body").addClass("compatible360");

            //////////////////////////////////////////////////////////////////////////

        }
    }
    else if (explorer.indexOf("Safari") >= 0) {
        // alert("Safari");
        $("body").addClass("safari");
    }



    /*

     else if (explorer.indexOf("Safari") >= 0) {
     //alert("Safari");

     //////////////////////////////////////////////////////////////////////////

     $("body").addClass("saf");

     //var bodyH = winH - footH - 50;
     //$(".body_v2").css("height",bodyH);
     //$(".body_v2").addClass("saf");

     scrollFoot();

     //////////////////////////////////////////////////////////////////////////

     if(str_need_arr <= 12){
     //alert(str_need_arr);

     /*
     function scrollFoot(){
     $(".body_v2").scrollTop( $(".body_v2")[0].scrollHeight - $("header").height());    //文字内容滚动到底

     setTimeout(function () {
     $("body").scrollTop( $("body")[0].scrollHeight - $("header").height());            //输入框滚动到底
     },500);
     alert("scrollFoot");
     }
}
}


    if (explorer.indexOf("MSIE") >= 0) {
        alert("ie");
    }
    else if (explorer.indexOf("Firefox") >= 0) {
        alert("Firefox");
    }
    else if (explorer.indexOf("UCBrowser") >= 0) {
        //alert('UC');

    }
    else if (explorer.indexOf("Opera") >= 0) {
        alert("Opera");
    }
    else if (explorer.indexOf("Netscape") >= 0) {
        alert('Netscape');
    }
    */
});