// 航天云网用

var htywUtil = {
  // 最小，大化，关闭按钮点击时通知你窗口
  titleBarClick: function (eventName) {
    console.log(eventName)
    if (eventName) {
      window.parent !== window && window.parent.postMessage(JSON.stringify({
        name: "robot_"+eventName+"_window",
        data: ""
      }), "*")
    }
  },

  // 打开独立窗口
  goSinglePage: function (event) {
    // console.log(window.screen.availHeight)
    // console.log(event.screenX, event.screenY)
    var search = window.location.search;
    var url = window.location.href;
    var symbol = '';
    if (search) {
        symbol = '&'
    } else {
      if (url.indexOf('?') === -1)
        symbol = '?'
    }
    url = url + symbol + 'windowType=big';
    window.open(
       url,
      "_blank",
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1050, height="+(window.screen.availHeight-150)+"，left=50, top=10"
    )
  }
};
