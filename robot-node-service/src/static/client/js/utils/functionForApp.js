// 原生在加载H5页面时，会默认调用一些方法，为防止页面报错，添加这些空方法

/**
 * @returns {{params: {description: string, title: string, url: string}, show: string, shareType: string}}
 */
function getShareparams(){
    return {
        "params": {
            "description": "",
            "title": "",
            "url": ""
        }, "show": "false", "shareType": ""
    };
}

function getWebViewTitle() {
    // return "";
}