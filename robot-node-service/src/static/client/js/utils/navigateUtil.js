
// 页面跳转 util 赵波 2019.11.14
var navigateUtil = {

  /**
   * 跳转函数，包括跳原生或者跳网页
   * @param param 可以为object 或者 json格式的字符串
   * @param answerType 答案类型
   */
  navigate: function (param, answerType) {
    console.log(param)
    if (typeof (param) === 'string') {
      param = param.replace(/~/g, '"');
      param = JSON.parse(param);
    }

    var robotKey = param.appKey || appKey || '';
    var robotFrom = param.appFrom || appFrom || '';
    var url = param.url || '';

    if(robotKey === 'appEzt' || robotKey === 'appTopC')
    {
      if (robotFrom === 'android' || robotFrom === 'ios') {
        var params = {
          pageId: answerType === '个股分析报告' ? 'rh_node' : 'webView', // webView
          url: url,
          animationStyle: 'kHsPageAnimationPush',
          screenCanZoom: true, //页面是否可以缩放
          hasActionBar: 'false'
          // title: ''
        };

        //ios多传一个参数
        if (robotFrom === 'ios'){
          params.navigationStyle = 'HsNavigationStatusNone';
          if(robotKey === 'appTopC')
            params.NaviBarHidden = 'true';
        }

        try {
          switch (robotFrom) {
            case 'ios':
              window.webkit.messageHandlers['routerNative'].postMessage(params);
              break;
            case "android":
              var str = params === 1 || params === "1" ? '' : JSON.stringify(params);
              window.contestapp['routerNative'](str);
              break;
          }
          scrollToBodyEnd();
        }
        catch (e) {
          console.log(e)
          // sendPreAnswerContent('出错啦...请退出重试');
          // saveLog('jsError', e.message, 'eztCommon.js', 0, 'commonCallback()', e.stack.toString());
        }
      } else {
        window.open(url, '_black');
      }
    }
    else if (appKey === 'appHcVtm') {
      postMessageToOutside({openUrl: url});
    }
    else {
      window.open(url, '_black');
    }
  }
};
