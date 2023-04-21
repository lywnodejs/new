import {
  isProduction, isPreRelease, isQa, isOverseaTest, isOversea
} from './env';

// 自适配当前host，可能为 //upm.xiaojukeji.com 或者 //auth.99taxis.mobi
let apiHost = '//upm-test.xiaojukeji.com';
// let apiHost = '//upm-pre.intra.xiaojukeji.com/';
// let bpmAdmin = '';
// let bpmHost = '';
// head.appendChild(script);
if (isPreRelease || isQa || isOverseaTest) {
  apiHost = '//upm-test.xiaojukeji.com';
  // bpmAdmin = '//bpm.admin-test.didichuxing.com';
  // apiHost = '//upm-iter.intra.xiaojukeji.com';
  // bpmHost = '//bpm-test.didichuxing.com';
  // apiHost = '//upm.xiaojukeji.com'
  // var Omega = Omega || {
  //   appKey: 'omegab51bef9066',
  //   autoPosition: false
  // };
  // window.Omega = Omega;
  // //添加埋点
  // let head = document.getElementsByTagName('head')[0],
  //     script = document.createElement('script');

  // script.type = 'text/javascript';
  // script.crossOrigin ="Anonymous"
  // script.src = 'https://tracker.didistatic.com/static/tracker/latest2x/omega.min.js';
  // head.appendChild(script);
}
else if (isProduction && !isOversea) {
  apiHost = window.location.origin;
  // bpmAdmin = '//bpm.admin.didichuxing.com';
  // bpmHost = '//bpm.didichuxing.com';
  var Omega = Omega || {
    appKey: 'omegab51bef9066',
    autoPosition: false
  };
  window.Omega = Omega;
  //添加埋点
  let head = document.getElementsByTagName('head')[0],
    script = document.createElement('script');

  script.type = 'text/javascript';
  script.crossOrigin = 'Anonymous';
  script.src = 'https://tracker.didistatic.com/static/tracker/latest2x/omega.min.js';
  head.appendChild(script);
} else if (isOversea) {
  apiHost = window.location.origin;
  // var Omega = Omega || {
  //   appKey: 'omegab51bef9066',
  //   autoPosition: false
  // };
  // window.Omega = Omega;
  // //添加埋点
  // let head = document.getElementsByTagName('head')[0],
  //   script = document.createElement('script');

  // script.type = 'text/javascript';
  // script.crossOrigin = 'Anonymous';
  // script.src = 'https://tracker.didiglobal.com/static/tracker_global/latest2x/omega.min.js';
  // head.appendChild(script);
}

export {
  apiHost,
  // bpmAdmin,
  // bpmHost
};
