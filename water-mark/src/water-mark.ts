/**
 * author           xj
 * @date            2017-04-26 12:09:43
 * @email           littlebearbond@qq.com
 * @description
 */
// http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=93848478
import 'core-js/features/symbol';
import "core-js/features/set";
import "core-js/features/object/assign";
import defaultOpts, {
    textConfig,
    COLLECTION_URL,
    GET_UID_URL,
    ANIMATE_CSS,
    IS_BRAZIL,
    CUT_LEN,
    DISABLE_WATER_MSG,
    WATER_VERSION,
    IdefaultOpts,
    LCA_PORTS,
    IlcaInfo
} from './configs'
import request from './request'
import getJsonpData from './getJsonpData'
import MonitorFn, { IMonitorFn } from './MonitorFn'
import addLog from './addLog'
import heart from './heart'
import {
    extend,
    getSelectionHtml,
    getTextWidth,
    disableCopy,
    disableContextMenu,
    disableSelectElFn,
    myLocalStorage,
    isCanvasSupported,
    addStyleToHead,
    getFormateDate,
    isMobile,
    isIPhone,
    debounce,
    isOpenConsole,
    SAVE_KEY,
    formatText,
    md5
} from './utils'
import uploadRules from './uploadRules'
// import observerDocument from './observerDocument'
import MutationObserver from './utils/MutationObserver'
import { ISomeObject } from './utils/tsType';

let isInit = false;
let monitorObj: IMonitorFn;
let LCAInfo: IlcaInfo = {
    AgentUuid: '',
    LocalUserAccount: ''
};

(function() {
    let query

    if (isMobile) return

    for (let i = 0, len = LCA_PORTS.length; i < len; i++) {
        query = requestLCA(LCA_PORTS[i], query)
    }
    query()

    function requestLCA(port: number, callback: () => void) {
        return function () {
            request({
                url: `http://127.0.0.1:${port}/lcainfo`,
                method: "GET",
                success: function(result) {
                    try {
                        LCAInfo = JSON.parse(result)
                    } catch (e) {
                        LCAInfo = {
                            AgentUuid: '',
                            LocalUserAccount: ''
                        }
                    }
                },
                error: function() {
                    callback && callback()
                }
            })
        }
    }
})()

// http://jsbin.com/bajuqi/1/edit?html,js,output
// https://addyosmani.com/blog/mutation-observers/
const OBSERVER_CONFIG = {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
};
const win = window as any;
/**
 *
 * @param {String} oldValue
 * @param {String} target
 *
 * 获取用户修改或者移除水印的属性
 */
const getModifyStyleProps = (oldValue: string, target: HTMLElement) => {
    const reg = /;\s+/;
    const arrOldVal = oldValue.replace(/;$/, '').split(reg)
    const newCssText = target.style.cssText.replace(/;$/, '').split(reg);
    //添加新属性
    const addStyle = newCssText.filter(val => arrOldVal.indexOf(val) === -1)
    //移除修改原有属性
    const removeStyle = arrOldVal.filter(val => newCssText.indexOf(val) === -1)
    const allModify = [...addStyle, ...removeStyle];
    const addModifyProps = allModify.map(val => val.split(':')[0]).join('-');
    if (!allModify.length) {
        return '';
    }
    return addModifyProps;
}

/**
 * 设置显示文本
 * @param opts
 */
const setText = function(opts: IdefaultOpts) {
    //有可能接口报错，导致页面显示新字符和中文的情况
    if (/^\d+$/.test(opts.text)) {
        opts.text = parseInt(opts.uid, 10).toString(32) + parseInt(`${opts.timestamp}`, 10).toString(32);
    }
    //巴西的系统加上后缀
    if (IS_BRAZIL) {
        opts.text += 'z';
    }
}

/**
 * 禁用设置和事件监听
 * @param opts
 * @param monitorObj
 * @param warpAddLog
 */
const beforeWaterMarkInit = function (opts: IdefaultOpts, monitorObj: MonitorFn, warpAddLog: (action: string, data?: ISomeObject, callback?: () => void) => void) {
    // 上传心跳数据
    heart(() => {
        let { AgentUuid, LocalUserAccount } = LCAInfo

        warpAddLog('heart', {
            AgentUuid,
            LocalUserAccount
        });
    })

    // 设置为true，默认是禁用元素是body ,可以直接设置元素
    if (opts.disableSelect || opts.disableSelectEl) {
        opts.disableSelectEl = opts.disableSelectEl || document.body;
        disableSelectElFn(opts.disableSelectEl);
    }

    // 右键处理
    if (opts.disableContextMenu) {
        disableContextMenu();
    }

    // 禁用拷贝
    if (opts.disableCopy || opts.disableCopyEl) {
        disableCopy(opts.disableCopyEl || document.body);
        if (!opts.disableSelect && !opts.disableSelectEl) {
            opts.disableSelectEl = opts.disableSelectEl || document.body
            disableSelectElFn(opts.disableSelectEl);
        }
    }

    // 禁止打印
    if (opts.disablePrint) {
        let conOuterHTML: string;
        opts.printCssText = opts.printCssText.replace('{printColor}', opts.printColor)
        const createPrintLayer = () => {
            const frag = document.createDocumentFragment();
            let num = opts.elCount;
            let el;
            while (num--) {
                el = document.createElement('span');
                el.style.cssText = opts.printCssText;
                el.innerHTML = opts.text;
                frag.appendChild(el);
            }
            let con = document.createElement('div');
            con.style.cssText = opts.printConCssText;
            con.setAttribute('id', 'js-print-con');
            con.appendChild(frag);
            document.body.appendChild(con);
            conOuterHTML = con.outerHTML.replace(/\s*(opacity):\s*0;/, '');
        };
        createPrintLayer();
        monitorObj.addMonitor(() => {
            let el = document.getElementById('js-print-con');
            if (!el) {
                warpAddLog('removePrintLayer');
                createPrintLayer()
            } else if (el.outerHTML.replace(/\s*(opacity):\s*0;/, '') !== conOuterHTML) {
                warpAddLog('modifyPrintLayer');
                el.parentNode.removeChild(el);
                createPrintLayer()
            }
        });
    }

    // 监听拷贝事件
    document.addEventListener('copy', () => {
        const text = formatText((getSelectionHtml() || '').trim());
        const { length } = text;

        text && warpAddLog('copy', {
            copyText: length > CUT_LEN ? `${text.slice(0, CUT_LEN - 100)}--前后拼接--${text.slice(200 - CUT_LEN)}` : text,
            copyTextLen: length,
            copyHash: md5(text)
        });
    });

    // 监听黏贴事件
    document.addEventListener('paste', (event) => {
        for (var i = 0, len = (event as any).clipboardData.items.length; i < len; i++) {
            var item = (event as any).clipboardData.items[i];

            if (item.type === "text/plain") {
                item.getAsString(function (str: string) {
                    const text = formatText(str.trim());
                    const { length } = text;

                    warpAddLog('paste', {
                        pasteText: length > CUT_LEN ? `${text.slice(0, CUT_LEN - 100)}--前后拼接--${text.slice(200 - CUT_LEN)}` : text,
                        pasteTextLen: length,
                        pasteHash: md5(text)
                    })
                })
            }
        }
    })

    // 监听是否移除不可选择文字的设置
    if (opts.disableSelect || opts.disableSelectEl || opts.disableCopy) {
        monitorObj.addMonitor(() => {
            if ((opts.disableSelect || opts.disableSelectEl) && opts.disableSelectEl.style.userSelect !== 'none') {
                opts.disableSelectEl.style.userSelect = 'none';
                warpAddLog('removeBodyUserSelect');
            }
        });
    }

    // 监听打印
    let mediaQueryList = win.matchMedia('print');
    mediaQueryList && mediaQueryList.addListener(function (mql: any) {
        let el = document.getElementById('js-print-con');
        el && (el.style.opacity = mql.matches ? '1' : '0')
        if (mql.matches) {
            warpAddLog('onbeforeprint');
        } else {
            warpAddLog('onafterprint');
        }
    });

    // 拦截getEventListeners
    if (opts.disableGetEventListeners) {
        win.getEventListeners = () => {
            warpAddLog('getEventListeners');
            return {};
        };
    }

    const checkIsOpenConsole = () => {
        if (isOpenConsole()) {
            warpAddLog('openConsole');
        }
    }

    // 监听打开控制台
    win.addEventListener('resize', debounce(checkIsOpenConsole, 2000), false);
    checkIsOpenConsole()
}

/**
 *
 * @param {Object} options
 */
const waterMarkInit = function (options: IdefaultOpts) {
    let outerHtml: string, observer: MutationObserver, showWaterMark: (options: IdefaultOpts) => void;
    let initTimes = 1;

    options.__id = options.id;

    const stopWaterMarkObserver = () => {
        observer.disconnect();
        monitorObj.stop();
    }

    const removeOldWaterMark = () => {
        const $el = document.getElementById(options.id);
        $el.parentNode.removeChild($el)
    }

    const startWaterMarkObserver = () => {
        showWaterMark(options);
        monitorObj.start();
    }

    showWaterMark = function (options: IdefaultOpts) {
        options.id = options.__id + initTimes;
        initTimes++;
        let canvas = document.createElement('canvas');
        let ww = getTextWidth(options.text, textConfig.textFont);
        //高度 宽度 按比例计算出一个差值，不传入高度和宽度可实现高宽自动设置,文字起始有旋转，加上问题初始位置不是(0,0) 所依计算canvas的宽度加了一些差值
        canvas.width = options.imgWidth ? parseInt(`${options.imgWidth}`, 10) : (ww + 2 - ww / 20) + options.imgWidthDis;
        canvas.height = options.imgHeight ? parseInt(`${options.imgHeight}`, 10) : (ww + 30) * Math.sin(Math.PI / 6) + options.imgHeightDis;

        // canvas.id = options.id;
        const ctx = canvas.getContext('2d');
        ctx.shadowOffsetX = 0; //X轴阴影距离，负值表示往上，正值表示往下
        ctx.shadowOffsetY = 0; //Y轴阴影距离，负值表示往左，正值表示往右
        ctx.shadowBlur = textConfig.textshadowBlur; //阴影的模糊程度
        ctx.shadowColor = textConfig.textshadowColor;
        ctx.font = options.textFont; //设置字体和字体大小
        ctx.fillStyle = options.textStyle;
        ctx.rotate(textConfig.textRotate * Math.PI / 180);
        ctx.textAlign = 'left';
        //初始位置15 7
        ctx.fillText(options.text, 15, 7);

        /*ctx.fillStyle = "rgb(200,0,0,.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);*/

        const waterNode = document.createElement('div');
        waterNode.setAttribute("id", options.id);

        // Fix: 增加display和visibility样式，消除通过样式覆盖隐藏水印的情况
        let cssText = 'pointer-events: none;width:100%!important;height:100%!important;top:' + (options.top || 0) + '!important;left:0!important;position:absolute!important;z-index:' + options.zIndex + '!important;opacity:1;display:block!important;visibility:visible!important;animation-duration:.5s;animation-fill-mode:both;animation-name:water-fadeIn;';
        //默认是body的时候直接fixed
        if (options.containerEl.tagName === "BODY") {
            cssText = cssText.replace('absolute', 'fixed');
        }
        waterNode.style.cssText = cssText
        const base64Img = canvas.toDataURL('image/png');
        //canvas被禁用了
        if (typeof base64Img === 'boolean' && base64Img === false) {
            addLog(options, 'disableWaterMark', {}, () => alert(DISABLE_WATER_MSG))
            return;
        }
        // waterNode.style.background = `url(${base64Img}) top left repeat`;
        waterNode.style.cssText += `background:url(${base64Img}) top left repeat!important`;

        // Fix: 移除class，消除通过修改class隐藏水印的情况
        // waterNode.className = "water-animated water-fadeIn"

        //不是body 需要检测下元素的position属性
        if (options.containerEl.tagName !== "BODY" && win.getComputedStyle(options.containerEl).position === 'static') {
            options.containerEl.style.position = 'relative';
        }
        options.containerEl.appendChild(waterNode);
        canvas = null;
        let el = document.getElementById(options.id)
        outerHtml = el.outerHTML;
        if (MutationObserver) {
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            observer = new MutationObserver((mutations: MutationRecord[]) => {
                mutations.forEach((mutation: MutationRecord) => {
                    const {
                        oldValue,
                        target
                    } = mutation;
                    const targetNode = target as HTMLElement
                    switch (mutation.type) {
                        case "attributes":
                            if (oldValue === targetNode.style.cssText) {
                                return;
                            }
                            stopWaterMarkObserver()
                            isIPhone || addLog(options, 'modifyWaterMark', {
                                'modify-style-props': getModifyStyleProps(oldValue, targetNode)
                            });
                            target.parentNode.removeChild(target);
                            startWaterMarkObserver()
                            break;
                        case "childList":
                            break;
                        case "characterData":
                            break;
                    }
                });
            });
            observer.observe(el, OBSERVER_CONFIG);
        }
    };

    startWaterMarkObserver()

    //监听document 如果发现replace body的情况，水印重新初始话,只监控明水印就行
    /* options.__id === 'js-wartermark' && observerDocument(() => {
        //重新设置document.body
        options.containerEl = document.body
        addLog(options, 'replaceBody', {
            'body-replace': 'body-replace to stop MutationObserver'
        })
        stopWaterMarkObserver()
        removeOldWaterMark()
        startWaterMarkObserver();
    }); */

    if (options.__id === 'js-wartermark') {
        let $body = document.body;
        monitorObj.addMonitor(() => {
            if (document.body !== $body) {
                options.containerEl = $body = document.body
                addLog(options, 'replaceBody', {
                    'body-replace': 'body-replace to stop MutationObserver'
                })
                stopWaterMarkObserver()
                removeOldWaterMark()
                startWaterMarkObserver();
            }
        });
    }

    let mFn = MutationObserver ? () => {
        let canvas = document.getElementById(options.id);
        //监控水印
        if (!canvas) {
            showWaterMark(options);
            addLog(options, 'removeWaterMark');
        }
    } : () => {
        let canvas = document.getElementById(options.id);
        //监控水印
        if (!canvas) {
            showWaterMark(options);
            addLog(options, 'removeWaterMark');
        } else if (canvas.outerHTML !== outerHtml) {
            canvas.remove();
            showWaterMark(options);
            isIPhone || addLog(options, 'modifyWaterMark');
        }
    }
    monitorObj.addMonitor(mFn);
};

/**
 * 初始化水印监控
 * @param opts
 */
function initWaterMarkMonitor(opts: IdefaultOpts) {
    if (isInit) {
        console.warn('repeat init watermark');
        return;
    }
    isInit = true;
    opts.url = COLLECTION_URL; // 设置收集地址
    monitorObj = new MonitorFn(opts.time) // 设置监听器，异步执行回调
    addStyleToHead(ANIMATE_CSS); // 添加样式
    // 上传用户配置信息，由于指纹信息采用跨域存储，如要保证数据完整性，需要改为同步执行
    uploadRules(opts, fp_canvas => {
        opts = extend(defaultOpts, opts) as IdefaultOpts;
        // 更新指纹信息
        opts.data.fp_canvas = fp_canvas

        const warpAddLog = (action: string, data?: ISomeObject, callback?: () => void) => {
            addLog(opts, action, data, callback);
        }

        // 禁用设置和事件监听
        beforeWaterMarkInit(opts, monitorObj, warpAddLog)

        // 水印初始化
        if (isCanvasSupported) {
            setText(opts)
            // 明水印
            waterMarkInit(extend(opts, {
                id: 'js-wartermark',
                textFont: textConfig.textFont
            }));
            // 暗水印，密度和样式单独控制
            waterMarkInit(extend(opts, {
                id: 'js-wartermarkhd',
                textFont: textConfig.textFont,
                textStyle: 'rgba(255, 0, 0, 0.01)',
                containerEl: document.body,
                top: '30px',
                //密度写死
                imgWidthDis: 10,
                imgHeightDis: 10
            }));
        } else {
            warpAddLog('disableWaterMark', {}, () => alert(DISABLE_WATER_MSG))
        }
    })
};

/**
 * 初始化水印
 * @param opts
 */
function initWaterMark(opts: IdefaultOpts) {
    opts.timestamp = getFormateDate()
    opts.containerEl = opts.containerEl || document.body; // 如果业务使用方把代码放在了header且没设置containerEl，初始的时候config代码可能取不到document.body，这里dom ready 再处理下
    const url = `${GET_UID_URL}?system_id=${opts.systemId}&user_id=${opts.userId}&fp_canvas=${myLocalStorage.get(SAVE_KEY)}`;

    // 获取用户uid和时间
    getJsonpData(url, 'callback', (res = {}) => {
        if (res.errno === 0 && res.data && res.data.uid) {
            // 设置为服务端返回的时间
            opts.timestamp = res.data.timestamp || opts.timestamp;
            // 页面显示原始文本
            opts.text = res.data.uid + opts.timestamp;
            opts.uid = res.data.uid;
        } else {
            console.error(`${url} error\n errmsg:${res.errmsg}`)
            opts.text = opts.systemId + opts.userId + opts.timestamp;
        }
        initWaterMarkMonitor(opts);
    }, () => {
        console.error(`${url} error`)
        // 发生错误就默认显示不缩短没处理的原始文案
        // initWaterMark(opts)
        opts.text = opts.systemId + opts.userId + opts.timestamp;
        initWaterMarkMonitor(opts);
    }, 10);
}

interface IwaterMark {
    (opts: IdefaultOpts): void | string;
    version: number | string
}

const waterMark = <IwaterMark>function (opts: IdefaultOpts = { systemId: '', userId: '' }) {
    if (!opts.systemId || !opts.userId) {
        console.warn('必须指定： systemId userId ');
        return;
    }
    // 经初始话过了
    if (isInit) {
        console.warn('repeat init');
        return '不要反复初始话';
    }

    let initFn = () => {
        document.removeEventListener("DOMContentLoaded", initFn, false);
        win.removeEventListener("load", initFn, false);
        initWaterMark(opts);
    }
    // rom jquery
    if (document.readyState === "complete") {
        setTimeout(() => initWaterMark(opts));
    } else {
        document.addEventListener('DOMContentLoaded', initFn, false);
        win.addEventListener("load", initFn, false);
    }
}

waterMark.version = WATER_VERSION;

module.exports = waterMark;
