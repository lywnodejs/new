/***
  * 跟后端约定的是在没有登录的情况下返回数据如下：
 * {
 * "data": "http://mis-test.diditaxi.com.cn/auth/sso/login?app_id=888&jumpto=index&version=1.0.0",
 * "code": 401,
 * "msg": "no login"
 * }
 * 所以我们只要跳转到 data 指定的地址就好了
***/
export default function checkLogin({code, data}) {
  if (code === 401) {
    data = data.split('&')

    data[data.findIndex(item => item.indexOf('jumpto') > -1)] = 'jumpto=' + encodeURIComponent(location.href)

    window.location.href = data.join('&');
  }
}
