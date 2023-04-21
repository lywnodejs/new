/**
 * 判断浏览器控制台是否打开
 */
let isOpen = false

export default function isOpenConsole(): boolean {
    const threshold = 200;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
	const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const win = window as any;

    if ((!(heightThreshold && widthThreshold) && ((win.Firebug && win.Firebug.chrome && win.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold))) {
        if (!isOpen) {
            // 控制台已经打开情况下，不再上报数据
            return isOpen = true
        }
    } else {
        if (isOpen) {
            return isOpen = false
        }
    }
    return false
}
