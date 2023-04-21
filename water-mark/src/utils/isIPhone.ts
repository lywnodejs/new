/**
 * 是否是iPhone
 */
const isIPhone = (function detectmob() {
    const ua = navigator.userAgent;
    if (ua.match(/iPhone/i)) {
        return true;
    } else {
        return false;
    }
}())

export default isIPhone
