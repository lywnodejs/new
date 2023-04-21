/**
 * @author 熊建
 * @email xiongjian@didichuxing.com
 * @create date 2018-05-30 03:41:35
 * @modify date 2018-05-30 03:41:35
 * @desc [description]
*/
export interface ISomeObject {
    [key: string]: string | number | boolean | HTMLElement | ISomeObject;
}

export interface IStringTMap<T> { [key: string]: T; };
