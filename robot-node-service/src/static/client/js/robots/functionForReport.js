// 供报告类答案加载js用
var jsNo = 0;
var jsArr = [];

function loadJsE(arr, callback, jsHost, sn) {
  jsNo = 0;
  jsArr = arr;
  if (arr && arr.length > 0) {
    beginLoadE(jsNo, callback, jsHost, sn)
  }
}

function beginLoadE(jIndex, callback, jsHost, sn) {
  if (jsArr[jIndex].indexOf('highstock') !== -1) {
    jsNo++;
    checkLoadedE(callback, jsHost, sn)
    return
  }
  // onViewReady
  var js = document.createElement('script');
  js.type = 'text/javascript';
  js.src = jsHost + jsArr[jIndex] + ".js";
  // console.log('loadJs:'+ js.src)
  if (js.addEventListener) {
    js.addEventListener('load', function () {
      jsNo++;
      checkLoadedE(callback, jsHost, sn)
    }, false);
  } else if (js.attachEvent) {
    js.attachEvent('onreadystatechange', function () {
      var target = window.event.srcElement;
      if (target.readyState == 'loaded') {
        jsNo++;
        checkLoadedE(callback, jsHost, sn)
      }
    });
  }

  var es=document.getElementsByTagName(js?'script':'link');
  var isLoaded = false;
  for(var i=0;i<es.length;i++){
    if(es[i][js?'src':'href'].indexOf(jsArr[jIndex])!=-1){
      isLoaded = true;
    }
  }
  if(!isLoaded){
    document.body.appendChild(js);
  }else{
    jsNo++;
    checkLoadedE(callback, jsHost, sn)
  }
}

function checkLoadedE(callback, jsHost, sn) {
  if(jsNo < jsArr.length){
    beginLoadE(jsNo, callback, jsHost, sn);
  }else{
    setTimeout(function () {
      if (typeof callback === 'string') {
        var fun = callback+sn+'()';
        try {
          eval(fun)
        } catch (e) {
        }
      } else {
        callback();
      }
    },200)
  }
}
