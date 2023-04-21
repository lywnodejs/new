/**
 * @author xiongjian
 * @email xiongjian@didichuxing.com
 * @create date 2017-09-03 12:22:54
 * @modify date 2017-09-03 12:22:54
 * @desc [description]
 */

import getJsonpData from '../getJsonpData'
import readCookie from './readCookie'
import createCookie from './createCookie'
import getSelectionHtml from './getSelectionHtml'
import isOpenConsole from './isOpenConsole'
import renderUrl from './renderUrl'
import extend from './extend'
import debounce from './debounce'
import getTextWidth from './getTextWidth'
import isIPhone from './isIPhone'
import uuidv4 from './uuidv4'
import md5 from './md5'

//保存完整水印的keyx
export const SAVE_KEY = '__hash__wa'
//保存原有水印字段的key
export const SAVE_END_HASH_KEY = '__hash__cache'

/**
 * 发送数据
 *
 * @param {String} type
 * @param {String} url
 * @param {Object} data
 * @param {Function} success
 * @param {Function} failed
 */
export const sendData = function (url: string, data: any, success: (...args: any[]) => any, failed: () => any) {
    if (typeof data === 'object') {
        data = renderUrl(data)
    }
    getJsonpData(url + '?' + data, 'callback', success, failed);
}

/**
 * 检测是否支持canvas
 */
export const isCanvasSupported: boolean = (function () {
    let elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}());

export const stopEvent = function (evt: KeyboardEvent) {
    evt.preventDefault && evt.preventDefault()
    evt.stopImmediatePropagation && evt.stopImmediatePropagation()
}

/**
 * 禁止拷贝
 * @param {HTMLElement} elm
 */
export function disableCopy(elm: HTMLElement) {
    elm.addEventListener('copy', function (event: KeyboardEvent) {
        event.preventDefault && event.preventDefault();
        event.stopPropagation && event.stopPropagation();
        return false;
    });

    elm.addEventListener('keydown', function (evt: KeyboardEvent) {
        let c = evt.keyCode
        let ctrlDown = evt.ctrlKey || evt.metaKey // Mac support
        // Check for Alt+Gr (http://en.wikipedia.org/wiki/AltGr_key)
        if (ctrlDown && evt.altKey) {
            return true
        }
        // Check for ctrl+c, v and x
        else if (ctrlDown && c === 67) {
            stopEvent(evt)
            return false
        } // c
        else if (ctrlDown && c === 88) {
            stopEvent(evt)
            return false
        } // x
        /*else if (ctrlDown && c == 86) {
            return false
        } */ // v
        return true
    });
}

/**
 * 禁止右键
 */
export function disableContextMenu() {
    document.addEventListener('contextmenu', function (event: KeyboardEvent) {
        stopEvent(event)
        return false;
    });
}

/**
 * 添加样式到头部
 * @param {String} text
 */
export function addStyleToHead(text: string) {
    let headEl = document.head || document.getElementsByTagName('head')[0];
    let styleEl = document.createElement('style') as any;
    styleEl.type = 'text/css';
    if ('styleSheet' in styleEl) {
        styleEl.styleSheet.cssText = text;
    } else {
        styleEl.appendChild(document.createTextNode(text));
    }
    headEl.appendChild(styleEl);
}

/**
 * 禁止一个元素里面的 文字能选择
 * @param {HTMLElement} disableSelectEl
 */
export function disableSelectElFn(disableSelectEl: HTMLElement) {
    const cssText = `
        .noselect {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }`
    addStyleToHead(cssText);
    disableSelectEl.style.userSelect = 'none';
    disableSelectEl.className += (disableSelectEl.className + ' noselect');
}

/**
 * 获取一个格式化的时间
 */
export function getFormateDate(): string {
    var dateObj = new Date();
    var month: string | number = dateObj.getUTCMonth() + 1; //months from 1-12
    var day: string | number = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    return '' + year + month + day;
}

export const myLocalStorage = {
    get: (name: string) => {
        try {
            let cacheData = localStorage.getItem(name)
            if (cacheData) {
                return cacheData;
            }
            const value = readCookie(name)
            value && localStorage.setItem(name, value);
            return value;
        } catch (error) {
            return ''
        }
    },
    set: (name: string, value: string) => {
        try {
            localStorage.setItem(name, value);
            createCookie(name, value, 360);
        } catch (error) {
            try {
                createCookie(name, value, 360)
            } catch (err) { }
        }
    }
}

/**
 * 生成一个UID,uid前面是本机当前日期，后面是系统id 用户id 加上随机戳
 * @param {String} id
 */
export function getNewUserHash(id = '', currDate: string | number = getFormateDate(), oldEndHash: string) {
    try {
        const oldKey = `${currDate}-${id}-${oldEndHash || uuidv4()}`;
        myLocalStorage.set(SAVE_KEY, oldKey)
        return oldKey;
    } catch (error) {
        return `${currDate}-${id}-exception-${oldEndHash || uuidv4()}`
    }
}

/**
 * 生成一个UID,uid前面是本机当前日期，后面是系统id 用户id 加上随机戳
 * @param {String} id
 */
export function updateUserHash(userHash: string, oldEndHash: string) {
    myLocalStorage.set(SAVE_KEY, userHash)
    myLocalStorage.set(SAVE_END_HASH_KEY, oldEndHash)
}

export const isMobile = (function detectmob() {
    const ua = navigator.userAgent;
    if (ua.match(/Android/i) ||
        ua.match(/webOS/i) ||
        ua.match(/iPhone/i) ||
        ua.match(/iPad/i) ||
        ua.match(/iPod/i) ||
        ua.match(/BlackBerry|PlayBook/i) ||
        ua.match(/Mobile/i) ||
        ua.match(/Windows Phone/i)
    ) {
        return true;
    } else {
        return false;
    }
}())

export function formatText(text: string) {
    return text.replace(/[\n\r\t]/g, ' ').replace(/\s{2,}/g, ' ')
}

// export { default } from './isIPhone';
export {
    readCookie,
    createCookie,
    getSelectionHtml,
    isOpenConsole,
    renderUrl,
    extend,
    debounce,
    getTextWidth,
    isIPhone,
    uuidv4,
    md5
}
