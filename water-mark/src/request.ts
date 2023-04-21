interface Ioptions {
    method: string
    url: string
    data?: any
    success?: (response: string) => void
    error?: (status: number, statusText: string, response: string) => void
}

const defaultOpts: Ioptions = {
    // 请求方法
    method: 'GET',
    // 请求地址
    url: '',
    // 请求数据
    data: {},
    // 成功回调
    success: () => {},
    // 错误回调
    error: () => {}
}

function request(opt: Ioptions) {
    const _opt = Object.assign(defaultOpts, opt)

    let xhr: XMLHttpRequest

    if (XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    const params = [];

    for (var key in _opt.data){
        if (_opt.data.hasOwnProperty( key)) {
            params.push(key + '=' + _opt.data[key]);
        }
    }

    const postData = params.join('&');

    if (_opt.method.toUpperCase() === 'GET') {
        xhr.open(opt.method, opt.url + '?' + postData, true);
        xhr.send(null);
    } else if (opt.method.toUpperCase() === 'POST') {
        xhr.open(opt.method, opt.url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhr.send(postData);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                opt.success(xhr.responseText);
            } else {
                opt.error(xhr.status, xhr.statusText, xhr.responseText);
            }
        }
    };
}

export default request
