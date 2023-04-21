var _ = require('underscore');

module.exports = {
    formatBankAccount: function (account) {
        return this.formatMobile(account);
    },
    formatMobile: function (mobile1) {
        var mobile = mobile1.toString();
        if (!mobile || mobile.length < 4) {
            return mobile;
        }
        return mobile.substring(mobile.length - 4);
    },
    replaceByStar: function (text, start, end) {
        text += "";
        if (!text) {
            return '--';
        }
        start = start < 0 ? 0 : start;
        start = start >= text.length ? text.length - 1 : start;
        end = end < 0 ? 0 : end;
        end = end >= text.length ? text.length - 1 : end;
        var pre = text.substr(0, start);
        var after = text.substr(end);
        var middle = text.substr(0, end - start).replace(/[0-9]/g, '*');
        return pre + middle + after;
    },
    formatMoney: function (s, n) {
        if (isNaN(s)) {
            return '--';
        }
        var negative = false;
        if (s < 0) {
            negative = true;
            s = Math.abs(s);
        }
        try {
            n = n >= 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
            var t = "";
            for (var i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
            }
            r = r ? '.' + r : '';
            var result = t.split("").reverse().join("") + r;
            if (negative) {
                return '-' + result;
            } else {
                return result;
            }

        }
        catch (e) {
            return '';
        }
    },
    formatMoneyLessZero: function (s, n) {
        if (isNaN(s)) {
            return '--';
        }
        if (s < 0) {
            return '--'
        }
        try {
            n = n >= 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
            t = "";
            for (i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
            }
            r = r ? '.' + r : '';
            return t.split("").reverse().join("") + r;
        }
        catch (e) {
            return '';
        }
    },
    formatMoneyWithZeroReplace: function (s, n, replace) {
        replace = replace || '--';
        if (s) {
            return this.formatMoney(s, n);
        }
        return replace;
    },
    formatWan: function (s, n) {
        s = s / 10000;
        n = n || 0
        return this.formatMoney(s, n);
    },
    formatBaiWan: function (s, n) {
        s = s / 1000000;
        n = n || 0
        return this.formatMoney(s, n);
    },
    formatWanDot: function (s, n) {
        s = s / 10000;
        return this.formatMoney(s, n);
    },
    formatYi: function (s, n) {
        s = s / 100000000;
        if (typeof n == 'undefined') {
            n = 0;
        }
        return this.formatMoney(s, n);
    },
    formatDate: function (date) {
        return this.formatTime(date, 'yyyy-MM-dd');
    },
    formatDateNoSpace: function (date) {
        return this.formatTime(date, 'yyyyMMdd');
      },
    formatDesc: function (date) {
        return this.formatTime(date, 'hh:mm');
    },
    formatDateByDot: function (date) {
        return this.formatTime(date, 'yyyy.MM.dd');
    },
    formatDateByDotWithoutYear: function (date) {
        return this.formatTime(date, 'MM.dd')
    },
    formatDateMinusWithoutYear: function (date) {
        return this.formatTime(date, 'MM-dd')
    },
    formatDateWithDesc: function (date) {
        return this.formatTime(date, 'MM月dd日 hh:mm')
    },
    formatTime: function (date, fmt) {
        if (!date) {
            return '--';
        }
        if (_.isString(date)) {
            date = parseInt(date);
        }
        date = new Date(date);
        fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
        var o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    formatToFixed: function (num, fixed) {
        if (typeof num == "undefined" || num == null || num == "" || isNaN(num)) {
            return "--";
        } else {
            return num.toFixed(fixed);
        }
    },
    formatForNaN: function (num) {
        if (typeof num == "undefined" || num == null || num == "" || isNaN(num)) {
            return "--";
        } else {
            return num;
        }
    },
    formatForString: function (string) {
        if (typeof string == "undefined" || string == null || string == "") {
            return "--";
        } else {
            return string;
        }
    },

    isformatForString: function (string) {
        if (typeof string == "undefined" || string == null || string == "") {
            return false;
        } else {
            return true;
        }
    },
    formatObject: function (obj) {
        for (var key in obj) {
            obj[key] = obj[key] || '';
        }
    },
    moneyUnit: function (money) {
        if (parseFloat(money) < 1) {
            return money * 100 + '分'
        } else if (parseInt(money) < 10000) {
            return money + '元'
        } else if (parseInt(money) < 100000000) {
            return this.formatWan(money) + '万元'
        } else {
            return this.formatYi(money, 2) + '亿元'
        }
    },
    moneyUnitWithoutFormat: function (money) {
        if (parseFloat(money) < 1) {
            return money * 100 + '分'
        } else if (parseInt(money) < 10000) {
            return money + ''
        } else if (parseInt(money) < 100000000) {
            return parseInt(money) / 10000 + '万'
        } else {
            return parseInt(money) / 100000000 + '亿'
        }
    },
    // 格式化工具函数
    getLastDays: function (input, isShort) {
        input = Math.abs(input)
        var minSecondsPerDay = 86400 * 1000;
        var minSecondsPerHour = 3600 * 1000;
        var minSecondsPerMin = 60 * 1000;
        var days = Math.floor(input / minSecondsPerDay);
        var hours = Math.floor((input % minSecondsPerDay) / minSecondsPerHour);
        var minutes = Math.floor((input % minSecondsPerDay % minSecondsPerHour) / minSecondsPerMin);
        var seconds = Math.floor(input % minSecondsPerDay % minSecondsPerHour % minSecondsPerMin / 1000);
        /*    if (minutes < 10) {
              minutes = '0' + minutes;
            }
            if (seconds < 10) {
              seconds = '0' + seconds;
            }*/
        if (isShort) {
            if (days >= 1) {
                return days + '天' + hours + '小时';
            } else if (hours >= 1) {
                return hours + '小时' + minutes + '分'
            } else {
                return minutes + '分' + seconds + '秒';
            }
        }
        // alert(input);
        return days + '天' + hours + '时' + minutes + '分' + seconds + '秒';
    },

    /**取两位小数  四舍五入*/
    getFloatData: function (data) {

        if (data == 0) {
            return '0.00';
        }

        if (typeof data == "undefined" || data == null || data == "") {
            return "--";
        }
        if (isNaN(data)) {
            return '--';
        }
        var value = Math.round(parseFloat(data) * 100) / 100;
        var xsd = value.toString().split(".");
        if (xsd.length == 1) {
            value = value.toString() + ".00";
            return value;
        }
        if (xsd.length > 1) {
            if (xsd[1].length < 2) {
                value = value.toString() + "0";
            }
            return value;
        }
    },

    numFormat: function (num) {
        var c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        return c;
    },

    numFormat: function (num) {
        if (num.toString().indexOf('.') !== -1) {
            var b = num.toLocaleString();
            return b;
        } else {
            var c = num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            return c;
        }
    },

    getTimeLineMark: function (lastStr, str) {
        var lastData = formatTime(lastStr, "yyyy-MM-dd");
        var curData = formatTime(str, "yyyy-MM-dd");

        if (lastData == curData) {
            return "";
        } else {
            if (formatTime(new Date().getMilliseconds(), "yyyy-MM-dd") == curData) {
                return "今天"
            } else {
                return curData;
            }
        }

    },

    /**
     * @param str 20180102
     * @return {Date} 毫秒数
     */
    dataFormatter: function (str) {
        var d = str.toString();

        var _y = Number(d.substr(0, 4));
        var _m = Number(d.substr(4, 2)) - 1;
        var _d = Number(d.substr(6, 2));

        return _y + "年" + _m + "月" + _d + "日"
    },
      /**
       * @param str 20180102
       * @return {Date} 毫秒数
       */
      getTimeByDate: function (str) {
        var d = str.toString();
        
        var _y = Number(d.substr(0, 4));
        var _m = Number(d.substr(4, 2)) - 1;
        var _d = Number(d.substr(6, 2));
        
        var date = new Date();
        date.setFullYear(_y,_m,_d);
        date.setHours(0,0,0,0);
        return date.getTime();
      },

}

