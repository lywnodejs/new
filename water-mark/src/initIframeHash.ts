// import {
//     getNewUserHash
// } from './utils'
import { IFRAME_SRC, IdefaultOpts } from './configs'
import { getNewUserHash, extend, uuidv4, updateUserHash } from './utils'

interface IpostChildData {
    oldEndHash?: string;
    userHash?: string
}

export default function (opts: IdefaultOpts, callback = () => { }) {
    const iframe = document.createElement('iframe');
    const $a = document.createElement('a');
    $a.href = IFRAME_SRC;

    //应该有超时机制
    window.addEventListener('message', (event: MessageEvent) => {
        const {
            data = {}, origin
        } = event;
        if (origin === `http://${$a.host}` || origin === `https://${$a.host}`) {
            let { userHash, oldEndHash } = data;
            const postChildData: IpostChildData = {}
            //后缀hash为空
            if (!oldEndHash || oldEndHash === 'undefined') {
                //生成一个新的
                oldEndHash = postChildData.oldEndHash = uuidv4()
            }
            //用户hash为空
            if (!userHash || userHash === 'undefined') {
                userHash = getNewUserHash(`${opts.systemId}-${opts.userId}`, opts.timestamp, oldEndHash)
                postChildData.userHash = userHash
            }
            //给opts 的data赋值
            opts.data = extend(opts.data || {}, { 'fp_canvas': userHash })
            //给子页面发消息，更新指纹
            Object.keys(postChildData).length && iframe.contentWindow.postMessage(postChildData, "*");
            //本域名也存一份
            updateUserHash(userHash, oldEndHash)
            //回调发送
            callback()
            setTimeout(() => {
                try {
                    iframe.parentNode.removeChild(iframe)
                } catch (error) { }
            }, 2000)
        }
    }, false);

    iframe.setAttribute('id', 'js-watermark-iframe');
    iframe.setAttribute("src", IFRAME_SRC);
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);
}
