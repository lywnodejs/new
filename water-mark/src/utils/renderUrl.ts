import { IStringTMap } from './tsType'

/**
 * 把object转为字符串键值对
 * @param {Object} data
 */
export default function renderUrl(data: IStringTMap<string>): string {
    let str = '';
    if (typeof data === 'object') {
        for (let key in data) {
            str += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
        }
        str = str.replace(/&$/, '');
    }
    return str;
}
