var conf={
    isServer: true, //true：发请求
    host: 'http://tteest.96079.com.cn:30040/p/makeNumberKeyboard/kbd',
    // http://192.168.33.164:8080/PasswordServlet
    //host:'https://tt.csii.com.cn/minapp/',

    API_Login: "ValidServlet",
    API_createPasswordKeyboard:"PasswordServlet"
};

var globalData={
    scene:'',
    userInfo: {},
    isLogin: false,
    userAcctList: [],
    passrsa:{},
    passpublicRsa:'bad3b5789d743eb87561907a80a0de2de32c8b3cd6997049ac8778c3bdd0b0cac4d6091390cfee451f2c0a33ed5b23412714238f55bbb8e0cd31c39a18712d8956b23cdef98a26cf2491871e465162a7ff82340920944d17680eebaa55a9feb42c2df2b89babd1f1b7645ad8fd7f322ccb25716c5aa7118e6dd1445fdca57fc5',
    passhexPublic:'10001'
};

module.exports.conf=conf;
module.exports.globalData=globalData;
