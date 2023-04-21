/**
 * Created by BoBo on 2018-10-23.
 */

/**
 * 判断元素是否在当前App版本展示
 * @param elName
 * @returns {boolean}
 */
function showElement(elName) {
    var flag = false;
    if (!elName)
        return flag;

    var version;
    switch (elName)
    {
        case "条件选股轮播按钮":
            version = {
                "android": {
                    // "appZscf": "0.0.0",
                    "appEzt": "1.3.8",
                    "appTopC": "1.0.0",
                    // "appXgw": "7.0.0",
                    "app": ""
                },
                "ios": {
                    // "appZscf": "0.0.0",
                    "appEzt": "1.9.21",
                    "appTopC": "1.0.0",
                    // "appXgw": "7.0.0",
                    "app": ""
                }
            };
            break;

        default:
            break;
    }

    //版本检查
    if (version) {
        //平台
        if (version[appFrom]) {
            //APP
            if (version[appFrom][appKey]) {
                //比较版本
                var minVersion = version[appFrom][appKey];
                if (appVersion) {
                    flag = checkVersion(minVersion, appVersion);
                    if (!flag)
                        console.log('当前版本[' + appVersion + ']低于最小原生支持版本[' + minVersion + ']，将不展示'+elName)
                } else {
                    console.log('未获取appVersion：' + appVersion)
                }
            } else {
                console.log('未匹配有效AppKey：' + appKey)
            }
        } else {
            console.log('未匹配有效平台类型：' + appFrom)
        }
    } else {
        console.log('此元素无版本控制');
    }
    var temp = '页面元素：' + elName + '，平台：' + appFrom + '，App：' + appKey + '，最低版本：' + (minVersion ? minVersion : '无') + '，当前版本：' + appVersion + '，是否可见: ' + flag;
    console.log(temp);
    // sendPreAnswerContent(temp);

    return flag;
}
