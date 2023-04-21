
//链接中的参数
var urlParams = {
    platform: '', //平台
    appKey: '',
    appVersion: '',
    phoneNumber: '',
    appW: '',
    appH: '',
    userId: ''
};

$(document).ready(function () {
    getParams();
});

/**
 * 获取并保存链接中的参数
 */
function getParams() {
    for(var p in urlParams){
        urlParams[p] = getQueryString(p) || ''
    }
    console.log(urlParams)
}