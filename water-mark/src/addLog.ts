/**
 * @author xiongjian
 * @email xiongjian@didichuxing.com
 * @create date 2017-09-03 12:22:32
 * @modify date 2017-09-03 12:22:32
 * @desc [description]
 */

import {
    sendData,
    extend
} from './utils'
import {
    actionMap,
    WATER_VERSION,
    IdefaultOpts
} from './configs'

let errorTime: number;

export default function (options: IdefaultOpts, action: string, data = {}, callback = () => { }) {
    let submitData;
    //处理action
    data = {
        action: actionMap[action] || '',
        ...data
    };
    if (!options.url) {
        return;
    }
    //发生错误就五分钟尝试发一次
    if (errorTime && +new Date() - errorTime < 1000 * 60 * 5) {
        return;
    }

    let currData = {
        currentUrl: location.href,
        systemId: options.systemId,
        userId: options.userId,
        version: WATER_VERSION,
        timestamp: options.timestamp || '',
        ...data
    };

    if (options.data && Object.keys(options.data).length > 0) {
        submitData = extend(options.data || {}, currData)
    } else {
        submitData = currData;
    }

    sendData(options.url, submitData, () => {
        //重置错误时间
        errorTime = null;
        callback()
    }, () => {
        errorTime = +new Date()
    });
};
