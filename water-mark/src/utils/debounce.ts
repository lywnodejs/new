/**
 * 程序触发频率限制
 * @param {Function} callback
 * @param {Number} waitTime
 */
export default function debounce(callback: () => void, waitTime: number): () => void {
    let timeout: any;
    let args: IArguments;
    let context: any;
    let timestamp: number;
    let result: any;
    let currTime;
    let later = function () {
        currTime = (+new Date()) - timestamp;
        if (currTime < waitTime && currTime >= 0) {
            timeout = setTimeout(later, waitTime - currTime);
        } else {
            timeout = null;
            result = callback.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        }
    };
    return function () {
        context = this;
        args = arguments;
        timestamp = +new Date();
        if (!timeout) {
            timeout = setTimeout(later, waitTime)
        }
        return result;
    };
};
