/**
 * @author 熊建
 * @email xiongjian@didichuxing.com
 * @create date 2018-05-03 03:52:19
 * @modify date 2018-05-03 03:52:19
 * @desc [description]
 */
import { ISomeObject } from './tsType'

export default function extend(...args: any[]) {
    let src: ISomeObject = {};
    let toStr = Object.prototype.toString;
    for (let item of args) {
        if (item !== null && toStr.call(item) === '[object Object]') {
            Object.keys(item).forEach((key) => {
                //不做深拷贝
                src[key] = item[key];
            })
        }
    }
    return src;
};
