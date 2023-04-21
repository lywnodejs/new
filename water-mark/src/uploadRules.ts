/**
 * @author 熊建
 * @email xiongjian@didichuxing.com
 * @create date 2018-05-03 10:59:07
 * @modify date 2018-05-03 10:59:07
 * @desc [description]
 */
import {
    extend,
    createCookie,
    readCookie
} from './utils'
import {
    RULES_UPLOAD_URL,
    WATER_VERSION,
    FP_CANVAS_NAME,
    IdefaultOpts
} from './configs'
import addLog from './addLog'
import initIframeHash from './initIframeHash'

const setFpCanvasToCookie = (fpCanvas: string) => {
    if (readCookie(FP_CANVAS_NAME) !== fpCanvas) {
        createCookie(FP_CANVAS_NAME, fpCanvas, 360)
    }
}

const uploadRules = (opts: IdefaultOpts, callback: (fp_canvas: string) => any) => {
    let uploadData = extend(opts, {
        version: WATER_VERSION
    })
    if (uploadData.containerEl) {
        uploadData.containerEl = String(opts.containerEl)
    }
    let timer: any;
    let isRun = false;
    const sendRules = () => {
        clearTimeout(timer)
        if (isRun) {
            return;
        }
        //设置指纹到cookie
        if (opts.data && opts.data.fp_canvas) {
            setFpCanvasToCookie(opts.data.fp_canvas)
            callback(opts.data.fp_canvas)
        }
        isRun = true;
        //收集用户使用的配置信息
        addLog({
            ...opts,
            url: RULES_UPLOAD_URL
        }, '', uploadData);
    }
    timer = setTimeout(sendRules, 5000);
    initIframeHash(opts, sendRules)
}

export default uploadRules
