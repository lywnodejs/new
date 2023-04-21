//日期格式
var popUtil = {
  /**
   * 追加答案到底部弹窗中
   * @param html
   */
  appendAnswerToPopup(html, addClass) {

    var pop = '<div id="bottomPopup" class="pop_BTT pop_BottomToTop" style="display: none">'+
      <!--遮罩-->
      '<div class="bg" style="display: none"></div>'+
      <!--白框容器-->
      '<div id="bottomContainer" class="box">'+
      <!--关闭按钮-->
      '<a class="close icon-pop_close" onclick="popUtil.closePopup()"></a>'+
      '<div class="sumUp">'+
      <!--浮层_title-->
      '<div class="sumUp_tech">'+
      '<div id="bottomPopupTitle" class="pop_hd">'+
      '</div>'+
      <!--答案容器-->
      '<div id="bottomAnswerContainer" class="pop_bd mb_tab">'+
      '</div>'+
      '</div>'+
      '</div>'+

      '</div>'+
      '</div>'

    $('body').append(pop);

    if (addClass) {
      $("#sumUp").addClass('sumUp_conExec');
      $('#sumUp').html(html).removeClass();
    } else {
      $('#bottomAnswerContainer').html(html);
    }
  },

  /**
   * 打开弹窗
   */
  showPopup(title) {
    if($('#bottomPopup').html()){
    }else{
      var pop = '<div id="bottomPopup" class="pop_BTT pop_BottomToTop" style="display: none">'+
        '<div class="bg" style="display: none"></div>'+
        '<div id="bottomContainer" class="box">'+
        '<a class="close icon-pop_close" onclick="popUtil.closePopup()"></a>'+
        '<div class="sumUp">'+
        '<div class="sumUp_tech">'+
        '<div id="bottomPopupTitle" class="pop_hd">'+
        '</div>'+
        '<div id="bottomAnswerContainer" class="pop_bd mb_tab">'+
        '</div>'+
        '</div>'+
        '</div>'+

        '</div>'+
        '</div>'
      $('body').append(pop);
    }
    setTimeout(function () {
      popUtil.goWord();
      $('#bottomPopupTitle').html(title);
      $('#bottomPopup').show();
      $('.pop_BottomToTop .bg').show();
      $(".pop_BottomToTop").fadeIn();
      $(".pop_BottomToTop .box").slideDown(300);
      $('#bottomContainer').removeClass("box_hide").addClass("box_show");
    },200)

  },

  /**
   * 输入方法的切换
   */
  goWord() {
    $("footer.f_voice").addClass("hide");
    $("footer.f_keyboard").removeClass("hide");
    $(".icon-Send").removeClass("hide");
  },

  /**
   * 关闭底部弹窗
   */
  closePopup() {
    $(".pop_BottomToTop .box").slideUp(150);
    $(".pop_BottomToTop .box").removeClass("box_show").addClass("box_hide");
    $(".pop_BottomToTop").fadeOut();
    $('#bottomAnswerContainer').html('');
    setTimeout(function () {
      $('#bottomPopup').remove();
    }, 300);
  }

};

