/**
 * @author 熊建
 * @email xiongjian@didichuxing.com
 * @create date 2018-05-03 03:54:25
 * @modify date 2018-05-03 03:54:25
 * @desc [description]
 */
import readCookie from '../../src/utils/readCookie';
import createCookie from '../../src/utils/createCookie';

const SAVE_KEY = 'water-mark-hash'
const SAVE_OLD_HASH = 'water-mark-old-endhash'

/**
 * 用于隐藏浏览器指纹数据
 */
window.addEventListener('message', ({ source, data = {} }) => {

    //接受父级页面传过来的指纹
    if (source !== window.parent) {
        return;
    }
    const { userHash, oldEndHash } = data;
    userHash && createCookie(SAVE_KEY, userHash, 360)
    oldEndHash && createCookie(SAVE_OLD_HASH, oldEndHash, 360)
}, false);

//把指纹发送到父级页面
window.parent && window.parent.postMessage({
    userHash: readCookie(SAVE_KEY) || '',
    oldEndHash: readCookie(SAVE_OLD_HASH) || '',
}, "*");
