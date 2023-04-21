//https://www.jianshu.com/p/b5c9e4c7b1e1
const win = window as any
export default win.MutationObserver ||
    win.WebKitMutationObserver ||
    win.MozMutationObserver;
