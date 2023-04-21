var crypto = require("../lib/crypto.js");
var conf = require("../utils/conf.js").conf;

function alert(msg,successCallback){
    wx.showModal({
        title: '提示',
        showCancel: false,
        content: msg,
        success: successCallback
    });
}

function request(url, postData, doSuccess, doFail, doComplete) {
    if (conf.isServer) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 5000,
            mask:true
        });
        
        var host = conf.host;
        var session_id = wx.getStorageSync('JSESSIONID');//本地取存储的sessionID  
        if (session_id != "" && session_id != null) {
            var header = { 'content-type': 'application/json; charset=UTF-8', 'Cookie': 'JSESSIONID=' + session_id }
        } else {
            var header = { 'content-type': 'application/json; charset=UTF-8' }
        }
        wx.request({
            url: host,
            data: postData,
            method: 'GET',
            header: header,
            success: function (res) {
                // success
                var resdata = res.data;
                var session = res.cookies[0];
                if(session){
                    var sessionid = session.substr(11,32);
                    wx.setStorageSync('JSESSIONID', sessionid);
                }
                doSuccess(resdata);
                if (resdata._RejCode == "000000") {
                    //服务端正确返回
                    if (typeof doSuccess == "function") {
                        
                    }
                } else if (resdata._RejCode == "validation.invalid_keys") {
                    alert("会话已超时，请重新登录",function (res) {
                        if (res.confirm) {
                            wx.reLaunch({
                                url: 'pages/subPages/login/login'
                            });
                        }
                    });
                }  else if (resdata._RejCode == "pe.submit_failed; nested exception is java.net.ConnectException: Connection refused: connect") {
                    alert("与后端系统连接超时");
                } 
                // else {
                //     //服务端出错
                //     if (resdata._RejMsg) {
                //         alert(resdata._RejMsg);
                //     } else {
                //         alert('交易失败');
                //     }
                // }
            },
            fail: function () {
                alert('系统异常，请稍后再试');
            },
            complete: function () {
                wx.hideToast();
                wx.stopPullDownRefresh();
                if (typeof doComplete == "function") {
                    doComplete();
                }
            }
        });
    } else {
        //模拟数据返回成功码，不做判断
        var name = url.split(".")[0];
        var res = data.data[name];
        if (typeof doSuccess == "function") {
            doSuccess(res);
        }
    }
}

//请求短信验证码
function getSmsToken(postData) {
    var pages = getCurrentPages(),
        that = pages[pages.length - 1];
    var count = 60;
    that.setData({
        tokenLoading: true,
        tokenCounter: count
    });

    var timer = setInterval(function () {
        count--;
        that.setData({ tokenCounter: count });
        if (count <= 0) {
            that.setData({
                tokenLoading: false,
                tokenCounter: 0
            });
            clearInterval(timer);
        }
    }, 1000);

    request(conf.API_GetSmsToken, postData,
        resdata => {
            alert(resdata.MobileMessage);
        }
    );
}

//查询账户余额
function qryAccountBalance(postData, doSuccess) {
    request(conf.API_QueryBalance, postData,
        res => {
            if (typeof doSuccess == "function") {
                doSuccess(res);
            } else {
                var pages = getCurrentPages(),
                    self = pages[pages.length - 1];
                self.setData({
                    balance: res.Balance
                });
            }
        }
    );
}
module.exports.qryAccountBalance = qryAccountBalance;
module.exports.getSmsToken = getSmsToken;
module.exports.request = request;