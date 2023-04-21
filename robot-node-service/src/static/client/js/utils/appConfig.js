/**
 * Created by BoBo on 2018-03-21.
 */
/**
 * 获取不同App的配置设置，与原生交互的功能点
 * @param appKey APP标识
 * @param appVersion App版本号
 * @param configName 要获取的配置名称
 * @return true || false
 */
function getConfigByApp(appKey, appVersion, configName) {
    var flag = false;
    if(!appKey)
        return flag;

    var config;
    switch (appKey){
        //华创e智通
        case 'appEzt':
            config = {
                //是否使用原生输入框
                useAppInput: {
                    android: '1.1.9',
                    ios: '1.9.9'
                },
                //是否在免责声明弹窗下面使用原生的遮罩
                useAppMaskUnderDisclaimer: {
                    android: '1.1.9',
                    ios: '1.9.9'
                },
                //是否使用App原生另外打开一个页面
                useAppNativeView: {
                    android: '1.1.9',
                    ios: '1.9.9'
                },
                //APP是否支持打开PDF
                pdfSupport: {
                    android: '1.1.9',
                    ios: '1.9.11'
                },
                //调用浏览器打开html静态页面
                htmlOutBrowserSupport:{
                    android: '1.3.4',
                    ios: '1.9.16'
                },
                //热点板块轮播按钮点击时是否打开原生新页面
                hotSpotButtonJump:{
                    android: '1.3.8',
                    ios: '1.9.21'
                },
                // 一键生成研报是否支持在App中打开
                openReportInApp: {
                    android: '1.3.6',
                    ios: '1.9.18'
                }
            };
            break;

        // C端
        case 'appTopC':
            config = {
                //是否使用原生输入框
                useAppInput: {
                    android: '1.0.0',
                    ios: '1.0.0'
                },
                //是否在免责声明弹窗下面使用原生的遮罩
                useAppMaskUnderDisclaimer: {
                    android: '1.0.0',
                    ios: '1.0.0'
                },
                //是否使用App原生另外打开一个页面
                useAppNativeView: {
                    android: '1.0.0',
                    ios: '1.0.0'
                },
                //APP是否支持打开PDF
                pdfSupport: {
                    android: '1.0.0',
                    ios: '1.0.0'
                },
                //调用浏览器打开html静态页面
                htmlOutBrowserSupport:{
                    android: '1.0.0',
                    ios: '1.0.0'
                },
                //热点板块轮播按钮点击时是否打开原生新页面
                hotSpotButtonJump:{
                    android: '1.0.0',
                    ios: '1.0.0'
                },
                // 一键生成研报是否支持在App中打开
                openReportInApp: {
                    android: '1.0.0',
                    ios: '1.0.0'
                }
            };
            break;

        //紫薯财富
        case 'appZscf':
            config = {
                useAppInput: {
                    android: '1.1.0',
                    ios: '1.1.0'
                },
                useAppMaskUnderDisclaimer: {
                    android: '1.1.0',
                    ios: '1.1.0'
                },
                useAppNativeView: {
                    android: '1.1.0',
                    ios: '1.1.0'
                }
            };
            break;
    }

    if(appVersion){ //判断是否传递版本号
        if(config){ //判断是否有匹配的配置项
            if(configName){ //判断是否传递要获取的配置项名称
                if(appFrom){ //判断平台
                    if(config.hasOwnProperty(configName)&&config[configName][appFrom]){ //综合判断
                        var minVersion = config[configName][appFrom];
                        flag = checkVersion(minVersion, appVersion); //校验版本号
                        if(!flag)
                            console.log(configName+'配置：当前版本低于最低版本，将使用H5处理');
                        else
                            console.log(configName+'配置：当前版本高于最低版本，将由原生处理')
                    }else{
                        console.log('在'+appFrom+'平台未配置'+configName+'项')
                    }
                }else{
                    console.log('未获取appFrom: '+appFrom)
                }

            }else{
                console.log('未获取configName：'+configName)
            }
        }else{
            console.log('未匹配appKey: '+appKey)
        }
    }else{
        // console.log('未传appVersion')
    }
    var temp = '配置类型：'+configName+'，平台：'+appFrom+'，App：'+appKey+'，最低版本：'+(minVersion?minVersion:'无')+'，当前版本：'+appVersion+'，原生支持: '+flag;
    console.log(temp);
    // sendPreAnswerContent(temp);
    return flag;
}
