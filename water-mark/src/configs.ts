/**
 * @author xiongjian
 * @email xiongjian@didichuxing.com
 * @create date 2017-09-03 12:22:41
 * @modify date 2017-09-03 12:22:41
 * @desc [description]
 */
import { IStringTMap, ISomeObject } from './utils/tsType'

const IS_FILE = location.protocol === "file:"

function fitURL(url: string, protocol: string = 'https'): string {
    return IS_FILE ? `${protocol}:${url}` : url
}

//开发环境的url
let PRE_URL = fitURL('//shuiyin.sec.xiaojukeji.com/'); //'//10.94.98.13:8000/';

let IFRAME_SRC = fitURL('//127.0.0.1:8080/dist/save-hash-iframe.html')

//线上环境的url
if (process.env.TARGET === 'domestic') {
    IFRAME_SRC = fitURL('//sec-aegisfe.didistatic.com/static/aegisfe/save-hash-iframe.html')
} else if (process.env.TARGET === 'global' ) {
    IFRAME_SRC = fitURL('//img0.didiglobal.com/static/watermaskglobal/save-hash-iframe.html')
    PRE_URL = fitURL('//watermark.intra.xiaojukeji.com/');
}

//收集数据的地址
export const COLLECTION_URL = `${PRE_URL}data_upload`;

//获取系统id+邮箱=uid
export const GET_UID_URL = `${PRE_URL}get_uid`;

//上报用户配置数据的接口
export const RULES_UPLOAD_URL = `${PRE_URL}rules_upload`;

//巴西系统的后缀
export const BRAZIL_URLS = [/99taxis\.mobi/];

//是否是巴西的系统
export const IS_BRAZIL: boolean = (function () {
    const href = window.location.href;
    for (let item of BRAZIL_URLS) {
        if (item.test(href)) {
            return true;
        }
    }
    return false;
}())

//拷贝内容截取长度
export const CUT_LEN = 300;

// LCA本地服务端口
export const LCA_PORTS = [18988, 18788, 18888];

export interface IlcaInfo {
    AgentUuid: string,
    LocalUserAccount: string
}

export interface ItextConfig extends ISomeObject {
    textFont?: string,
    textshadowColor?: string, //阴影颜色
    textshadowBlur?: number,
    textRotate?: number
}

export interface IdefaultOpts extends ItextConfig {
    systemId?: string,
    userId?: string,
    timestamp?: string,
    containerEl?: HTMLElement,
    data?: any,
    imgWidth?: number | string,
    imgHeight?: number | string,
    imgWidthDis?: number,
    imgHeightDis?: number,
    textStyle?: string,
    zIndex?: number,
    time?: number,
    disableContextMenu?: boolean,
    disableSelect?: boolean,
    disableSelectEl?: HTMLElement,
    disableCopy?: boolean,
    disableCopyEl?: HTMLElement,
    listernerCopy?: boolean,
    disableGetEventListeners?: boolean,
    disablePrint?: boolean,
    elCount?: number,
    printColor?: string,
    printCssText?: string,
    printConCssText?: string,

    url?: string,
    __id?: string,
    id?: string,
    text?: string,
    uid?: string,
}

export const textConfig: ItextConfig = {
    //字体样式参考
    // textFont: '24px serif',
    // textFont: '24px Times New Roman',
    // 调整字体增加区分度
    textFont: '24px Menlo, Monaco, \'Microsoft Sans Serif\', monospace',
    //文字阴影 http://www.w3school.com.cn/tags/canvas_shadowcolor.asp
    textshadowColor: 'rgba(0, 0, 0, 0)', //阴影颜色
    //阴影的模糊度
    textshadowBlur: 0,
    //文字旋转角度
    textRotate: 30
};

//用户动作，收集用户日子的时候会传回用户动作，这里可以设置用户动作的名字
export const actionMap: IStringTMap<string> = {
    //移除打印水印
    removePrintLayer: 'remove-print-layer',
    //修改打印水印
    modifyPrintLayer: 'modify-print-layer',
    //移除禁止用户选择设置
    removeBodyUserSelect: 'remove-body-userSelect',
    //打开控制台
    openConsole: 'open-console',
    //启用打印前
    onbeforeprint: 'onbeforeprint',
    //打印后
    onafterprint: 'onafterprint',
    //使用getEventListenersAPI
    getEventListeners: 'getEventListeners',
    //移除水印
    removeWaterMark: 'remove-water-mark',
    //修改水印
    modifyWaterMark: 'modify-water-mark',
    //修改水印
    disableWaterMark: 'disable-water-mark',
    //企图替换body，从而移除水印
    //http://0c7566aa.wiz03.com/share/s/0ctmqG2TXk8C2eM7h_1hoGQ-0WLfCA2SlQUY2iaPXy3mHmQY
    replaceBody: 'replace-body',
    //拷贝内容
    copy: 'copy',
    // 心跳数据
    heart: 'heart-beat',
    // 粘贴
    paste: 'paste'
};

const defaultOpts: IdefaultOpts = {
    //系统ID
    systemId: '',
    //当前用户ID  邮箱前缀
    userId: '',
    //unix时间戳 :20170606
    timestamp: '',
    //需要打水印的容器 El的position不能是static，如果是static会被默认改为relative
    containerEl: document.body,
    //每次发送求情携带的数据
    data: {},
    //水印单张图片宽度,不指定高宽代码会自己动计算出一个高宽进行设置
    imgWidth: 0,
    //水印单张图片高，不指定高宽代码会自己动计算出一个高宽进行设置
    imgHeight: 0,

    //主要作用：在没有设置imgWidth imgHeight的时候内部会根据文字自动获取一个宽高，但是使用者可能觉得宽高不够，水印太密集，这个时候可以设置这两个参数加大水印文字间距
    //宽度上的间距，在没有设置imgWidth的时候，内部会根据文字长度自动获取一个宽度，再加上这个imgWidthDis -->width = imgWidth + imgWidthDis
    imgWidthDis: 50,
    //高度上的间距，在没有设置imgHeight的时候，内部会根据文字长度自动获取一个高度，再加上这个imgWidthDis -->height = imgHeight + imgHeightDis
    imgHeightDis: 50,

    //文字样式
    textStyle: 'rgba(0, 0, 0, 0.15)',

    //水印的z-index
    zIndex: 10000,
    //监视时间间隔
    time: 2500,
    //是否直接禁用掉鼠标右键Î
    disableContextMenu: false,
    //是否启用，不让其选择，默认不启用
    disableSelect: false,
    //不能选择的区域，传入一个原生dom元素
    // disableSelectEl: null,
    //是否禁止拷贝
    disableCopy: false,
    //禁止复制的元素容器
    // disableCopyEl: null,
    //是否监听用户拷贝
    listernerCopy: true,
    //禁用getEventListeners,防止用户通过这个方法获取元素绑定的时间，然后移除事件
    disableGetEventListeners: true,
    //打印预览时加上水印
    disablePrint: false,
    elCount: 50,
    //打印水印的字体样式
    printColor: 'rgba(0, 0, 0, 0.15)',
    printCssText: 'font-size: 24px;line-height: 100px; width:200px;color:{printColor}',
    printConCssText: 'pointer-events: none; transform: rotate(30deg); display: flex; flex-wrap: wrap; flex-direction: row; width: 100%; height: 100%; top: 0; left: 0; position: fixed; z-index: 1000; opacity:0;'
};

export const ANIMATE_CSS = `
    @keyframes water-fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }
`
//提示信息
export const DISABLE_WATER_MSG = "检测到你的水印显示异常，请谨慎操作！请联系xiongjian@didichuxing.com";

declare const VERSION: string;
//水印版本
export const WATER_VERSION = VERSION

//指纹写到cookie里面的key
export const FP_CANVAS_NAME = 'user-fingerprint-water-mark'

export {
    IFRAME_SRC
};
export default defaultOpts;
