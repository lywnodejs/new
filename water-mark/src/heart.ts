/**
 * 心跳数据上报
 */
const INTERVAL = 30 * 60 * 1000; // 间隔30分钟

/**
 * setTimeout实现版本
 * 需要在窗口失焦的情况下手动停止上报
 * @param callback
 * @param interval
 */
function heart(callback: () => void, interval = INTERVAL) {
    let active = true, lastTime = new Date().getTime();
    let timer: any;
    let doc = document as any;

    // 心跳数据上报
    function heartbeat(restart?: boolean) {
        // 重新计时
        if (restart) {
            lastTime = new Date().getTime();
            callback()
        }
        clearTimeout(timer)
        const currTime = new Date().getTime();

        if (active && currTime - lastTime >= interval) {
            lastTime = new Date().getTime();
            callback()
        }
        timer = setTimeout(heartbeat, interval)
    }

    function start() {
        active = true
        // 重新计时
        heartbeat(true)
    }

    function stop() {
        active = false
        // 会导致重新计时
        clearTimeout(timer)
    }

    let hidden: string = 'hidden', visibilityChange: string;

    if (hidden in document) {
        visibilityChange = 'visibilitychange'
    } else if ((hidden = "mozHidden") in document) {
        visibilityChange = 'mozvisibilitychange'
    } else if ((hidden = "webkitHidden") in document) {
        visibilityChange = 'webkitvisibilitychange'
    } else if ((hidden = "msHidden") in document) {
        visibilityChange = 'msvisibilitychange'
    }

    if (typeof doc[hidden] === "undefined") {
        // 不支持visibilitychange使用focus和blur
        window.onfocus = start;
        window.onblur = stop
    } else {
        // 监听visibilityChange事件
        document.addEventListener(visibilityChange, () => doc[hidden] ? stop() : start(), false);
    }

    // 首次上报数据
    heartbeat(true)
}

export default heart
