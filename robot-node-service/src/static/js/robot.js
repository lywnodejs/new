// var host = "http://10.0.0.22:10033";//开发
// var host = "http://10.0.0.105:10025/";//测试
var host = "/policy";//测试

var head = document.getElementsByTagName('head')[0];

var link = document.createElement('link');
link.type='text/css';
link.rel = 'stylesheet';
link.href = host+"/static/css/yy_icon.css";

var link1 = document.createElement('link');
link1.type='text/css';
link1.rel = 'stylesheet';
link1.href = host+"/static/css/yy_style_v1.css";

var link2 = document.createElement('link');
link2.type='text/css';
link2.rel = 'stylesheet';
link2.href = host+"/static/css/yy_style_v2.css?t=20190504";

var link3 = document.createElement('link');
link3.type='text/css';
link3.rel = 'stylesheet';
link3.href = host+"/static/css/hpc_style.css";

var link4 = document.createElement('link');
link4.type='text/css';
link4.rel = 'stylesheet';
link4.href = host+"/static/css/jser_style.css";

head.appendChild(link);
head.appendChild(link1);
head.appendChild(link2);
head.appendChild(link3);
head.appendChild(link4);

const js1 = document.createElement('script');
js1.type = 'text/javascript';
js1.src = host + '/static/js/charts/jKline_stock_analysis.js';

const js2 = document.createElement('script');
js2.type = 'text/javascript';
js2.src = host + '/static/js/libs/jquery-1.11.2.min.js';

const js3 = document.createElement('script');
js3.type = 'text/javascript';
js3.src = host + '/static/js/utils/popUtil.js';

const js4 = document.createElement('script');
js4.type = 'text/javascript';
js4.src = host + '/static/js/utils/toolsUtil.js';

const js5 = document.createElement('script');
js5.type = 'text/javascript';
js5.src = host + '/static/js/libs/7.0/highstock.src.js';

const js6 = document.createElement('script');
js6.type = 'text/javascript';
js6.src = host + '/static/js/libs/clipboard.min.js';

const js7 = document.createElement('script');
js7.type = 'text/javascript';
js7.src = host + '/static/js/charts/sh_kLine.js';

const js8 = document.createElement('script');
js8.type = 'text/javascript';
js8.src = host + '/static/js/utils/logUtil.js';

const js9 = document.createElement('script');
js9.type = 'text/javascript';
js9.src = host + '/static/js/utils/timeUtil.js?t=1';

const js10 = document.createElement('script');
js10.type = 'text/javascript';
js10.src = host + '/static/js/utils/requestUtil.js?t=1';

if (js1.addEventListener) {
  js1.addEventListener('load', function () {
    head.appendChild(js2);
  }, false);
} else if (js1.attachEvent) {
  js1.attachEvent('onreadystatechange', function () {
    var target = window.event.srcElement;
    if (target.readyState == 'loaded') {
      head.appendChild(js2);
    }
  });
}
if (js2.addEventListener) {
  js2.addEventListener('load', function () {
    head.appendChild(js3);
  }, false);
} else if (js2.attachEvent) {
  js2.attachEvent('onreadystatechange', function () {
    var target = window.event.srcElement;
    if (target.readyState == 'loaded') {
      head.appendChild(js3);
    }
  });
}
if (js3.addEventListener) {
  js3.addEventListener('load', function () {
    head.appendChild(js4);
  }, false);
} else if (js3.attachEvent) {
  js3.attachEvent('onreadystatechange', function () {
    var target = window.event.srcElement;
    if (target.readyState == 'loaded') {
      head.appendChild(js4);
    }
  });
}
if (js4.addEventListener) {
  js4.addEventListener('load', function () {
    head.appendChild(js5);
  }, false);
} else if (js4.attachEvent) {
  js4.attachEvent('onreadystatechange', function () {
    var target = window.event.srcElement;
    if (target.readyState == 'loaded') {
      head.appendChild(js5);
    }
  });
}
if (js5.addEventListener) {
  js5.addEventListener('load', function () {
    head.appendChild(js6);
  }, false);
} else if (js5.attachEvent) {
  js5.attachEvent('onreadystatechange', function () {
    var target = window.event.srcElement;
    if (target.readyState == 'loaded') {
      head.appendChild(js6);
    }
  });
}
if (js6.addEventListener) {
  js6.addEventListener('load', function () {
    head.appendChild(js7);
  }, false);
} else if (js6.attachEvent) {
  js6.attachEvent('onreadystatechange', function () {
    var target = window.event.srcElement;
    if (target.readyState == 'loaded') {
      head.appendChild(js7);
    }
  });
}
if (js7.addEventListener) {
  js7.addEventListener('load', function () {
    head.appendChild(js8);
  }, false);
} else if (js7.attachEvent) {
  js7.attachEvent('onreadystatechange', function () {
    var target = window.event.srcElement;
    if (target.readyState == 'loaded') {
      head.appendChild(js8);
    }
  });
}
if (js8.addEventListener) {
  js8.addEventListener('load', function () {
    head.appendChild(js9);
  }, false);
} else if (js8.attachEvent) {
  js8.attachEvent('onreadystatechange', function () {
    var target = window.event.srcElement;
    if (target.readyState == 'loaded') {
      head.appendChild(js9);
    }
  });
}
if (js9.addEventListener) {
  js9.addEventListener('load', function () {
    head.appendChild(js10);
  }, false);
} else if (js9.attachEvent) {
  js9.attachEvent('onreadystatechange', function () {
    var target = window.event.srcElement;
    if (target.readyState == 'loaded') {
      head.appendChild(js10);
    }
  });
}
if (js10.addEventListener) {
  js10.addEventListener('load', function () {
    requestUtil.params.local = host;
  }, false);
} else if (js10.attachEvent) {
  js10.attachEvent('onreadystatechange', function () {
    var target = window.event.srcElement;
    if (target.readyState == 'loaded') {
      requestUtil.params.local = host;
    }
  });
}

head.appendChild(js1);
function checkLoaded(){

}
