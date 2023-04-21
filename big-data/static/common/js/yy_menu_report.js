/************************************************************************************/
/* 大搜素 */
/* web前端  */
/* yanyan */
/* 2020/02/28 */
/************************************************************************************/

$(function () {


  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 菜单显示、隐藏
  /////////////////////////////////////////////////////////////////////////////////////////////////

  function _menu_box_show(){
    $(".rxhBD_menu_bg").show();
    $(".rxhBD_menu_box").addClass("rxhBD_show");
  }

  function _menu_box_hide(){
    $(".rxhBD_menu_bg").hide();
    $(".rxhBD_menu_box").removeClass("rxhBD_show");
  }

  function _menu_box_slideUp() {
    $(".rxhBD_menu_fold i").attr("class", "rxh-icon-arrow6_b");
    $(".rxhBD_menu_box").slideUp(300);
    _menu_box_hide();
    _menu_nav_un_on();
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 标签
  /////////////////////////////////////////////////////////////////////////////////////////////////

  // 清除 已选
  function _menu_nav_un_selected(){
    $(".rxhBD_menu_nav a").each(function () {
      $(this).removeClass("rxhBD_selected");
    });
  }

  // 清除 当前
  function _menu_nav_un_on(){
    $(".rxhBD_menu_nav a").each(function () {
      $(this).removeClass("rxhBD_on");
    });
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 展开菜单项
  /////////////////////////////////////////////////////////////////////////////////////////////////

  $(".rxhBD_menu_fold").click(function () {

    var $menu_fold_i = $(this).find("i");
    if( $menu_fold_i.hasClass("rxh-icon-arrow6_b")){
      // 显示
      $menu_fold_i.attr("class", "rxh-icon-arrow6_t");
      $(".rxhBD_menu_nav a").eq(0).addClass("rxhBD_on");
    }else{
      // 隐藏
      $menu_fold_i.attr("class", "rxh-icon-arrow6_b");
      _menu_nav_un_on();
    }


    $(".rxhBD_menu_box").slideToggle(300);

    if( ! $(".rxhBD_menu_box").hasClass("rxhBD_show")){
      _menu_box_show();
    }else{
      _menu_box_hide();
      _menu_nav_un_on();
    }

  });



  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 点击遮罩层，关闭
  /////////////////////////////////////////////////////////////////////////////////////////////////

  $(".rxhBD_menu_report .rxhBD_menu_bg").click(function () {
    _menu_box_slideUp();
  });



  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 菜单标签切换
  /////////////////////////////////////////////////////////////////////////////////////////////////

  $(".rxhBD_menu_nav a").click(function () {
    var nav_a_N = $(this).index();
    // if( ! $(this).hasClass("rxhBD_selected")){
    $(this).addClass("rxhBD_on").siblings().removeClass("rxhBD_on");
    // }


    if( ! $(".rxhBD_menu_box").hasClass("rxhBD_show")){
      _menu_box_show();
      $(".rxhBD_menu_box").slideDown(300);

      $(".rxhBD_menu_fold").find("i").attr("class", "rxh-icon-arrow6_t");
    }

    $(".rxhBD_menu_content .rxhBD_menu_item").eq(nav_a_N).addClass("rxh_show").siblings().removeClass("rxh_show");
  });



  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 判断是否有选中项，有的话菜单选项标识为已选
  /////////////////////////////////////////////////////////////////////////////////////////////////

  function _slected_N() {
    var i_item = [];
    var item_i = $(".rxhBD_menu_item").length;
    for( var i=0; i< item_i; i++){
      var i_total = 0;
      $(".rxhBD_menu_item").eq(i).find("i").each(function (index) {
        if ( $(this).hasClass("rxh-icon-check")) {
          i_total = index + 1;
        }
        else if( $(this).hasClass("rxh-icon-check2_full")){
          i_total = index + 1;
        }
        i_item = [i, i_total];

        if( i_total > 0 && ! $(".rxhBD_menu_nav a").eq(i).hasClass("rxhBD_selected")){
          $(".rxhBD_menu_nav a").eq(i).addClass("rxhBD_selected");
        }
        else if(i_total == 0){
          $(".rxhBD_menu_nav a").eq(i).removeClass("rxhBD_selected");
        }
      });
      // console.log(i_item);
    }
  }
  _slected_N();



  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 点击全选/取消
  /////////////////////////////////////////////////////////////////////////////////////////////////

  var $btn_all = $(".rxhBD_menu_item .rxhBD_btn_all");
  $btn_all.click(function () {
    if( $(this).hasClass("rxhBD_btn_selected")){
      // 全取消
      $(this).removeClass("rxhBD_btn_selected");

      // 动效
      $(this).find("b").css({
        "-moz-animation": "slide_left 0.3s 1",
        "-webkit-animation": "slide_left 0.3s 1",
        "animation": "slide_left 0.3s 1"
      });


      // 联动所有的
      $(this).parent().next(".rxhBD_menu_bd").find("li").each(function () {
        $(this).find("span > i").attr("class", "rxh-icon-check_un");
      });

    }
    else{
      // 全选
      $(this).addClass("rxhBD_btn_selected");

      // 动效
      $(this).find("b").css({
        "-moz-animation": "slide_right 0.3s 1",
        "-webkit-animation": "slide_right 0.3s 1",
        "animation": "slide_right 0.3s 1"
      });

      // 联动所有的
      $(this).parent().next(".rxhBD_menu_bd").find("li").each(function () {
        $(this).find("i").attr("class", "rxh-icon-check");
      });

    }

    _slected_N();
  });



  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 展开二级
  /////////////////////////////////////////////////////////////////////////////////////////////////

  $(".rxhBD_menu_list li b").click(function () {
    if( $(this).hasClass("rxh-icon-arrow_d")){
      $(this).attr("class","rxh-icon-arrow_t");
      $(this).parents("li").siblings().find("b").attr("class", "rxh-icon-arrow_d");
      $(this).parents("li").siblings().find("ul").slideUp(300);

      $(this).parent().next("ul").slideDown(300);
    }else{
      $(this).attr("class","rxh-icon-arrow_d");
      $(this).parent().next("ul").slideUp(300);
    }
  });



  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 点击一级的多选按钮
  /////////////////////////////////////////////////////////////////////////////////////////////////

  $(".rxhBD_menu_list > ul >li > div span").click(function () {
    // 单选
    if( $(this).parents(".rxhBD_menu_list").hasClass("rxhBD_menu_radio")){
      if( $(this).find("i").hasClass("rxh-icon-check2_un")){
        $(this).find("i").attr("class", "rxh-icon-check2_full");
        $(this).parents("li").siblings().find("i").attr("class", "rxh-icon-check2_un");
      }
      else{
        $(this).find("i").attr("class", "rxh-icon-check2_un");
      }
    }
    // 其它
    else{
      if( $(this).find("i").hasClass("rxh-icon-check_un")){
        $(this).find("i").attr("class", "rxh-icon-check");
        $(this).parent().next("ul").find("li").each(function () {
          $(this).find("i").attr("class", "rxh-icon-check");
        });
      }
      else{
        $(this).find("i").attr("class", "rxh-icon-check_un");
        $(this).parent
        ().next("ul").find("li").each(function () {
          $(this).find("i").attr("class", "rxh-icon-check_un");
        });
      }
    }

    _slected_N();
  });



  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 点击二级的多选按钮
  /////////////////////////////////////////////////////////////////////////////////////////////////

  // var li2_chk_i = 0;
  $(".rxhBD_menu_list2 li ul li div span").click(function () {

    if( $(this).find("i").hasClass("rxh-icon-check_un")){
      $(this).find("i").attr("class","rxh-icon-check");
    }else{
      $(this).find("i").attr("class","rxh-icon-check_un");
    }


    // 计算二级是否全选
    var $ul2 = $(this).parent().parent().parent("ul");
    var $li2 = $ul2.find("li");
    var li2_N = $li2.length;
    var chech_N = 0;
    $li2.each(function () {
      if( $(this).find("i").hasClass("rxh-icon-check")){
        chech_N = chech_N + 1;
      }
    });
    if(chech_N < li2_N){
      $ul2.prev().find("i").attr("class","rxh-icon-check_un");
    }else{
      $ul2.prev().find("i").attr("class","rxh-icon-check");
    }

    _slected_N();
  });



  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 评级
  /////////////////////////////////////////////////////////////////////////////////////////////////

  $(".rxhBD_menu_grade a").click(function () {
    if( $(this).hasClass("rxhBD_selected")){
      $(this).removeClass("rxhBD_selected");
      $(this).find("i").attr("class", "rxh-icon-check_un");
    }else{
      $(this).addClass("rxhBD_selected");
      $(this).find("i").attr("class", "rxh-icon-check");
    }

    _slected_N();
  });



  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 按钮：清除条件
  /////////////////////////////////////////////////////////////////////////////////////////////////

  $(".rxhBD_menu_btn .rxhBD_btn_clear").click(function () {
    // 所有已选改成未选
    $(".rxhBD_menu_content li").each(function () {
      $(this).find("span > i").attr("class", "rxh-icon-check_un");
    });
    $(".rxhBD_menu_content .rxhBD_menu_grade a").each(function () {
      $(this).removeClass("rxhBD_selected");
      $(this).find("i").attr("class", "rxh-icon-check_un");
    });

    _menu_nav_un_selected();
  });



  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 按钮：确认
  /////////////////////////////////////////////////////////////////////////////////////////////////

  $(".rxhBD_menu_btn .rxhBD_btn_ok").click(function () {
    _menu_box_slideUp();
  });



  /////////////////////////////////////////////////////////////////////////////////////////////////



});
