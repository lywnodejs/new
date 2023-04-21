/**
 * @author xiongjian
 * @email xiongjian@didichuxing.com
 * @create date 2017-09-03 12:23:24
 * @modify date 2017-09-03 12:23:24
 * @desc [description]
 */

// const MAX_TIMES = 30;
// const TIME_RANGE = 100 * 1000
// let oldTime = new Date();
// let times = 0;

// function checkIsOften() {
//     const currentTime = new Date()
//     //重置初始数据
//     if (+currentTime - (+oldTime) >= TIME_RANGE) {
//         oldTime = currentTime;
//         times = 0;
//     }
//     times++;
//     if (times > MAX_TIMES) {
//         //刻意阻塞程序
//         confirm('操作太频繁！请确定你是否是在正常操作？')
//         oldTime = currentTime;
//         times = 0;
//     }
// }

interface IGetJsonpData {
    (url: string, jsonpCallbackName: string, successFn: (arg?: any) => any, failFn: (arg?: any) => any, timeout?: number): void;
    timer: number
}

/**
 * 通过jsonp方式发送数据
 *
 * @param {String} url
 * @param {String} jsonpCallbackName
 * @param {Function} successFn
 * @param {Function} failFn
 */
let getJsonpData = <IGetJsonpData>function (url, jsonpCallbackName = "callback", successFn, failFn, timeout = 30) {
    // 由于无法定位个别用户操作造成的频繁上报，先去除限制
    // checkIsOften();
    let timmer: any;
    const cbname = '__getjsonpdata' + getJsonpData.timer++;
    //encodeURIComponent
    url = url + (/\?/.test(url) ? '&' : '?') + jsonpCallbackName + '=' + cbname;
    const win = window as any;
    win[cbname] = function (data: any) {
        try {
            successFn(data);
        } finally {
            destoryFn();
        }
    }
    const node = document.createElement('script');
    node.type = 'text/javascript';
    node.charset = 'utf-8';
    node.src = url;
    node.async = true;

    const destoryFn = function () {
        window.clearTimeout(timmer);
        node.parentNode.removeChild(node);
        delete win[cbname];
    }

    const errorFn = function () {
        destoryFn();
        failFn();
    };

    node.onerror = errorFn
    timmer = window.setTimeout(errorFn, timeout * 1000);
    (document.head || document.getElementsByTagName('head')[0]).appendChild(node)
}
getJsonpData.timer = 1;


export default getJsonpData;
