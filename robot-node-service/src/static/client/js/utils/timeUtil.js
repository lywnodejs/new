
//日期格式
var timeUtil = {
    /**
     * @param number 数字
     * @return 小于10则返回前面加0的字符串，大于10则直接返回对应的字符串
     */
    getTwoNumber:function(number)
    {
        return String((number >= 10) ? number : ("0" + number));
    },
    /**
     * @param time 1970.1.1日起的毫秒数，
     * @return {string}  yyyy-mm-dd hh:mm:ss格式的字符串
     */
    getTimeStr_more0:function(time)
    {
        var date = new Date(time);
        return timeUtil.getTimeStr(time) + " " + timeUtil.getTwoNumber(date.getHours()) + ":" + timeUtil.getTwoNumber(date.getMinutes()) + ":" + timeUtil.getTwoNumber(date.getSeconds());
    },
    /**
     * @param time 1970.1.1日起的毫秒数，
     * @return {string}  yyyy-mm-dd hh:mm格式的字符串
     */
    getTimeStr_more:function(time)
    {
        var date = new Date(time);
        return timeUtil.getTimeStr(time) + " " + timeUtil.getTwoNumber(date.getHours()) + ":" + timeUtil.getTwoNumber(date.getMinutes()) ;
    },
    /**
     * @param time 1970.1.1日起的毫秒数
     * @return {string} YYYY-MM-DD格式的字符串
     */
    getTimeStr:function(time)
    {
        var date = new Date();
        if(time != undefined && time != "")
            date.setTime(time);
        var month = date.getMonth() + 1;
        var monthStr = timeUtil.getTwoNumber( month );
        var day = date.getDate();
        var dayStr = timeUtil.getTwoNumber( day );
        return date.getFullYear() + '-' + monthStr + '-' + dayStr;
    },
    /**
     * @param time 1970.1.1日起的毫秒数
     * @return {string} YYYY-MM-DD格式的字符串 没有时间显示--
     */
    getTimeStr2:function(time)
    {
        var date = new Date();
        if(time != undefined && time != ""){
            date.setTime(time);
            var month = date.getMonth() + 1;
            var monthStr = timeUtil.getTwoNumber( month );
            var day = date.getDate();
            var dayStr = timeUtil.getTwoNumber( day );
            return date.getFullYear() + '-' + monthStr + '-' + dayStr;
        }else{
            return '--';
        }

    },

    /**
     * @param str 20180102
     * @return {Date} 毫秒数
     */
    dataFormatter:function(str){
        var d = str.toString();

        var _y = Number(d.substr(0,4));
        var _m = Number(d.substr(4,2))-1;
        var _d = Number(d.substr(6,2));

        var _date = Date.UTC(_y,  _m, _d);//转换成Date.UTC(1970,  5, 20)格式[Date.UTC(1970,  9, 27), 0   ],
        return _date;
    },

    //年月日格式+小时分钟秒
    dataFormatter2:function(str,str1){
        var d = str.toString();
        var e = str1.toString();

        var _y = Number(d.substr(0,4));
        var _m = Number(d.substr(4,2))-1;
        var _d = Number(d.substr(6,2));

        var _h = Number(e.substr(0,2));
        var _min = Number(e.substr(3,2));
        var _s = Number(e.substr(6,2));

        var _date = Date.UTC(_y,  _m, _d, _h,_min);
        return _date;
    },
    /**
     * 判断所选时间(或者当前时间)是否在某一时间段
     */
    time_range:function (beginTime, endTime, nowTime) {
        var strb = beginTime.split (":");
        if (strb.length != 2) {
            return false;
        }

        var stre = endTime.split (":");
        if (stre.length != 2) {
            return false;
        }

        var strn = nowTime.split (":");
        if (stre.length != 2) {
            return false;
        }
        var b = new Date ();
        var e = new Date ();
        var n = new Date ();

        b.setHours (strb[0]);
        b.setMinutes (strb[1]);
        e.setHours (stre[0]);
        e.setMinutes (stre[1]);
        n.setHours (strn[0]);
        n.setMinutes (strn[1]);

        if (n.getTime () - b.getTime () > 0 && n.getTime () - e.getTime () < 0) {
            return true;
        } else {
            //alert ("当前时间是：" + n.getHours () + ":" + n.getMinutes () + "，不在该时间范围内！");
            return false;
        }
    },
    /**
     * @param time 1970.1.1日起的毫秒数
     * @return {string} MM月DD日格式的字符串
     */
    getTimeStr_m_d:function(time)
    {
        var date = new Date();
        if(time != undefined && time != "")
            date.setTime(time);
        var month = date.getMonth() + 1;
        var monthStr = timeUtil.getTwoNumber( month );
        var day = date.getDate();
        var dayStr = timeUtil.getTwoNumber( day );
        return monthStr + '月' + dayStr + '日';
    }

};
