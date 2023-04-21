var to_date = function (val) {
    if (typeof val !== 'number') {
        return '----'
    }
    var now = new Date(val);
    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate(); //日

    var hh = now.getHours(); //时
    var mm = now.getMinutes(); //分

    var clock = year + "-";
    if (month < 10)
        clock += "0";

    clock += month + "-";

    if (day < 10)
        clock += "0";

    clock += day + " ";
    // if(hh < 10)
    // clock += "0";

    // clock += hh + ":";
    // if (mm < 10) clock += '0';
    // clock += mm;
    return (clock);
};

var to_date_zxrb = function (val) {
    var now = new Date(val);

    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate(); //日

    var hh = now.getHours(); //时
    var mm = now.getMinutes(); //分

    var clock = year + "/";

    if (month < 10)
        clock += "0";

    clock += month + "/";

    if (day < 10)
        clock += "0";

    clock += day + " ";

    // if(hh < 10)
    // clock += "0";

    // clock += hh + ":";
    // if (mm < 10) clock += '0';
    // clock += mm;
    return (clock);
};

var to_date_info = function (val) {
    var now = new Date(val);

    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate(); //日

    var hh = now.getHours(); //时
    var mm = now.getMinutes(); //分

    var clock = year + "-";

    if (month < 10)
        clock += "0";

    clock += month + "-";

    if (day < 10)
        clock += "0";

    clock += day + " ";

    if (hh < 10)
        clock += "0";

    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm;
    return (clock);
};

var textShow = function ($event) {
    for (var i = 0; i < $event.length; i++) {
        var t_length = $event.eq(i).text().length - 4;
        var t_w = $event.eq(i).width();
        var t_f = parseInt($event.eq(i).css('font-size'));
        var t_num = t_w / t_f;
        var t_h = t_length / t_num;
        // console.log(t_h>=4.3)
        if (t_h >= 5.8) {
            $event.eq(i).find('span').show(0);
        } else {
            $event.eq(i).find('span').hide(0);
        }
    }
    $event.find('span').click(function () {
        $(this).hide(0).attr('data_show', 'hide')
        $(this).parent().css({
            'overflow': 'auto',
            paddingBottom: '1rem',
            display: 'block'
        });
        $(this).parent().find('p').show(0);
    })
    $event.find('p').click(function () {
        $(this).hide(0).attr('data_show', 'show')
        $(this).parent().css({
            'overflow': 'hidden',
            'display': '-webkit-box',
            paddingBottom: '0',
        });
        $(this).parent().find('span').show(0);
    })
}

var checkVersion = function (minVersion, currentVersion) {
    var flag = false;

    if (!minVersion || !currentVersion)
        return flag;

    if (minVersion === currentVersion) {
        flag = true;
    } else {
        var arrMin = minVersion.split('.');
        var arrCurrent = currentVersion.split('.');
        var len = arrMin.length;
        for (var i = 0; i < len && i < arrCurrent.length; i++) {
            if (parseInt(arrCurrent[i]) > parseInt(arrMin[i])) {
                flag = true;
                break;
            } else if (parseInt(arrCurrent[i]) < parseInt(arrMin[i])) {
                flag = false;
                break;
            }
        }
    }

    return flag;
}
var functionForShowPDF = function (title, url) {
    var params = {
        pageId: 'webView',
        url: url,
        title: title,
        navigationStyle: 'HsNavigationStatusModel'
    };
    try {
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.webkit.messageHandlers['routerNative'].postMessage(JSON.stringify(params));
        } else if (/(Android)/i.test(navigator.userAgent)) {
            window.contestapp.openPDFWindow(url,title );
        }
    } catch (error) {
        window.open(url);
    }
}


export {
    to_date,
    to_date_zxrb,
    textShow,
    to_date_info,
    checkVersion,
    functionForShowPDF
}
