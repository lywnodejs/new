/**
 * 写入cookie
 * @param {String} name
 * @param {String} value
 * @param {Number} days
 */
export default function createCookie(name: string, value: string | number, days: number) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
