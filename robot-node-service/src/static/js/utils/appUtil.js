var appUtil = {

  /**
   * 展示PDF触发的事件
   * @param {*} title
   * @param {*} pdfUrl
   */
  functionForShowPDF:function(title,pdfUrl,appFrom,appKey){
    if(appFrom === 'ios'){
      var params = {
        pageId: 'webView',
        url: pdfUrl,
        title: title,
        navigationStyle: 'HsNavigationStatusModel'
      };
      appUtil.commonCallback('routerNative', JSON.stringify(params), appFrom, appKey);
    }
    else if(appFrom === 'android')
      window.contestapp.openPDFWindow(pdfUrl, title, appFrom, appKey);
    else if(appFrom === 'wx')
      window.open(pdfUrl)
  },

  /**
   * Created by neville on 2017/10/25.
   */
  /**
   * 调用移动端的公共方法
   * @param callbackMethod    移动端执行的方法名
   * @param params    方法所需参数（对象类型）
   * @param timeOut   是否超时
   * @param timeString    定时器的ID（用于倒计时后执行移动端的方法）
   */
  commonCallback:function(callbackMethod, params, appFrom, appKey) {
    if(appKey === 'appEzt' || appKey === 'appTopC'){
      if (typeof (params) === 'string') {
        params = params.replace(/~/g, '"');
        params = JSON.parse(params);
      }
      try {
        switch (appFrom) {
          case 'ios':
            window.webkit.messageHandlers[callbackMethod].postMessage(params);
            break;
          case "android":
            var str = params === 1 || params === "1" ? '' : JSON.stringify(params);
            window.contestapp[callbackMethod](str);
            break;
        }
      }
      catch (e) {
        // sendPreAnswerContent(e.toString());
        // sendPreAnswerContent('出错啦...请退出重试');
        // scrollToBodyEnd();
        saveLog('jsError', e.message, 'eztCommon.js', 0, 'commonCallback()', e.stack.toString());
      }
    }
  },


  /**
   * Created by BoBo on 2018-03-21.
   */
  /**
   * 获取不同App的配置设置，与原生交互的功能点
   * @param appKey APP标识
   * @param appVersion App版本号
   * @param configName 要获取的配置名称
   * @return true || false
   */
  getConfigByApp:function(appKey, appVersion, configName, appFrom) {
    var flag = false;
    if(!appKey)
      return flag;

    var config;
    switch (appKey){
      //华创e智通
      case 'appEzt':
        config = {
          //是否使用原生输入框
          useAppInput: {
            android: '1.1.9',
            ios: '1.9.9'
          },
          //是否在免责声明弹窗下面使用原生的遮罩
          useAppMaskUnderDisclaimer: {
            android: '1.1.9',
            ios: '1.9.9'
          },
          //是否使用App原生另外打开一个页面
          useAppNativeView: {
            android: '1.1.9',
            ios: '1.9.9'
          },
          //APP是否支持打开PDF
          pdfSupport: {
            android: '1.1.9',
            ios: '1.9.11'
          },
          //调用浏览器打开html静态页面
          htmlOutBrowserSupport:{
            android: '1.3.4',
            ios: '1.9.16'
          },
          //热点板块轮播按钮点击时是否打开原生新页面
          hotSpotButtonJump:{
            android: '1.3.8',
            ios: '1.9.21'
          },
          // 一键生成研报是否支持在App中打开
          openReportInApp: {
            android: '1.3.6',
            ios: '1.9.18'
          }
        };
        break;

      // C端
      case 'appTopC':
        config = {
          //是否使用原生输入框
          useAppInput: {
            android: '1.0.0',
            ios: '1.0.0'
          },
          //是否在免责声明弹窗下面使用原生的遮罩
          useAppMaskUnderDisclaimer: {
            android: '1.0.0',
            ios: '1.0.0'
          },
          //是否使用App原生另外打开一个页面
          useAppNativeView: {
            android: '1.0.0',
            ios: '1.0.0'
          },
          //APP是否支持打开PDF
          pdfSupport: {
            android: '1.0.0',
            ios: '1.0.0'
          },
          //调用浏览器打开html静态页面
          htmlOutBrowserSupport:{
            android: '1.0.0',
            ios: '1.0.0'
          },
          //热点板块轮播按钮点击时是否打开原生新页面
          hotSpotButtonJump:{
            android: '1.0.0',
            ios: '1.0.0'
          },
          // 一键生成研报是否支持在App中打开
          openReportInApp: {
            android: '1.0.0',
            ios: '1.0.0'
          }
        };
        break;

      //紫薯财富
      case 'appZscf':
        config = {
          useAppInput: {
            android: '1.1.0',
            ios: '1.1.0'
          },
          useAppMaskUnderDisclaimer: {
            android: '1.1.0',
            ios: '1.1.0'
          },
          useAppNativeView: {
            android: '1.1.0',
            ios: '1.1.0'
          }
        };
        break;
    }

    if(appVersion){ //判断是否传递版本号
      if(config){ //判断是否有匹配的配置项
        if(configName){ //判断是否传递要获取的配置项名称
          if(appFrom){ //判断平台
            if(config.hasOwnProperty(configName)&&config[configName][appFrom]){ //综合判断
              var minVersion = config[configName][appFrom];
              flag = appUtil.checkVersion(minVersion, appVersion); //校验版本号
              if(!flag)
                console.log(configName+'配置：当前版本低于最低版本，将使用H5处理');
              else
                console.log(configName+'配置：当前版本高于最低版本，将由原生处理')
            }else{
              console.log('在'+appFrom+'平台未配置'+configName+'项')
            }
          }else{
            console.log('未获取appFrom: '+appFrom)
          }

        }else{
          console.log('未获取configName：'+configName)
        }
      }else{
        console.log('未匹配appKey: '+appKey)
      }
    }else{
      console.log('未传appVersion')
    }
    var temp = '配置类型：'+configName+'，平台：'+appFrom+'，App：'+appKey+'，最低版本：'+(minVersion?minVersion:'无')+'，当前版本：'+appVersion+'，原生支持: '+flag;
    console.log(temp);
    // sendPreAnswerContent(temp);
    return flag;
  },


  /**
   * 版本比较，如果currentVersion>=minVersion返回true，否则返回false
   * @param minVersion
   * @param currentVersion
   */
  checkVersion:function(minVersion, currentVersion) {
    var flag = false;

    if (!minVersion || !currentVersion)
      return flag;

    if (minVersion === currentVersion) {
      flag = true;
    }
    else {
      var arrMin = minVersion.split('.');
      var arrCurrent = currentVersion.split('.');
      var len = arrMin.length;
      for (var i = 0; i < len && i < arrCurrent.length; i++) {
        if (parseInt(arrCurrent[i]) > parseInt(arrMin[i])) {
          flag = true;
          break;
        } else if (parseInt(arrCurrent[i]) < parseInt(arrMin[i])) {
          flag = false;
          break;
        }
      }
    }

    return flag;
  }
}


