/*!
 * jquery.date.js v1.4.3
 * By 雾空 https://github.com/weijhfly/jqueryDatePlugin
 * Date:2017/1/24
*/
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';
 
    var d = new Date(),
        doc = window.document,
        nowYear = d.getFullYear(),
        nowMonth = d.getMonth() + 1,
        domDate,
        createDate,
        time,
        body = $('body'),
        emptyStr = "<li></li>",
        isTouch = "ontouchend" in doc,
        tstart = isTouch ? "touchstart" : "mousedown",
        tmove = isTouch ? "touchmove" : "mousemove",
        tend = isTouch ? "touchend" : "mouseup",
        tcancel = isTouch ? "touchcancel" : "mouseleave",
        isEnglish = (navigator.language || navigator.browserLanguage).toLowerCase().indexOf('zh') == -1,
        //基于40px的高度滑动,如需改动要改这，不能用样式覆盖 如 document.documentElement.clientWidth <= 320? 30:40
        h = 40,
        dpr = $('html').attr('data-dpr') || 1,
        resH = h*dpr,
        //支持的时间格式展示
        dateFormat = [
            //年月日 时分秒
            ['YYYY-MM-DD hh:mm:ss','YY-MM-DD hh:mm:ss','YYYY/MM/DD hh:mm:ss','YY/MM/DD hh:mm:ss'],
            //年月日 时分
            ['YYYY-MM-DD hh:mm','YY-MM-DD hh:mm','YYYY/MM/DD hh:mm','YY/MM/DD hh:mm'],
            //年月日
            ['YYYY-MM-DD','YY-MM-DD','YYYY/MM/DD','YY/MM/DD'],
            //年月
            ['YYYY-MM','YY-MM','YYYY/MM','YY/MM'],
            //时分秒 时分
            ['hh:mm:ss','hh:mm']
        ],
        
        opts = {            
            beginYear: 2010,        
            endYear: 2088, //可不填，结束年份不会小于当前年份           
            type:'YYYY-MM-DD',
            limitTime:false,//限制选择时间 today 今天之前的时间不可选 tomorrow 明天之前的不可选
            location:null, //before 跳转至之前选择的时间，如果为空则跳转至当前时间
            callback:null//回调函数
        };
    //dom渲染
    domDate = '<div id="date-wrapper"><h3>选择日期</h3><div id="d-content"><div id="d-bg"><ol id="d-year"></ol><ol id="d-month"></ol><ol id="d-day"></ol></div></div><a id="d-cancel" href="javascript:">取消</a><a id="d-confirm" href="javascript:">确定</a></div><div id="d-mask"></div>';
    
    if(isEnglish){
        domDate = domDate.replace('安装时间','DatePicker').replace('取消','cancel').replace('确定','confirm');
        css = css.replace('</style>','#date-wrapper #d-tit{display:none;}</style>');
    }
    if(h != 40){
        css = css.replace(/40px/g,h+'px').replace(/120px/g,h*3+'px');
    }
    if(dpr != 1){
        css = css.replace(/(\d+)px/g,function(i){
            return i.replace(/\D/g,'')*dpr + 'px';
        });
    }
    body.append(domDate);
    
    createDate = {
        y:function(begin,end){
            var domYear = '',
                end = end <= nowYear ? (end + 10) :end;
                
            for (var i = begin; i <= end; i++){
                domYear += '<li><span>' + i +'</span></li>';
            }
            $('#d-year').html(emptyStr + domYear + emptyStr);
        },
        m:function(){
            var domMonth = '';
            for (var j = 1; j <= 12; j++) {
                j = j<10?'0'+j:j;
                domMonth += '<li><span>' + j + '</span></li>';
            }
            $('#d-month').html(emptyStr + domMonth+ emptyStr);
        },
        d:function(end,active){
            var end = end || createDate.bissextile(nowYear,nowMonth),
                domDay = '';
            for (var k = 1; k <= end; k++) {
                k = k<10?'0'+k:k;
                if(active && active == k){
                    domDay += '<li class="active"><span>' + k + '</span></li>';
                }else{
                    domDay += '<li><span>' + k + '</span></li>';
                }
            }
            $('#d-day').html(emptyStr + domDay + emptyStr);
        },
        hm:function(){
            var domHours = '',domMinutes = '';
            
            for (var i = 0; i <= 23; i++) {i = i<10?'0'+i:i;domHours += '<li><span>' + i + '</span></li>';}
            $('#d-hours').html(emptyStr + domHours + emptyStr);
            
            for (var j = 0; j <= 59; j++) {j = j<10?'0'+j:j;domMinutes += '<li><span>' + j + '</span></li>';}
            $('#d-minutes').html(emptyStr + domMinutes + emptyStr);
            
        },
        s:function(){
            var domSeconds = '';
            
            for (var i = 0; i <= 59; i++) {i = i<10?'0'+i:i;domSeconds += '<li><span>' + i + '</span></li>';}
            $('#d-seconds').html(emptyStr + domSeconds + emptyStr);
        },
        bissextile:function(year,month){
            var day;
            if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                day = 31
            } else if (month == 4 || month == 6 || month == 11 || month == 9) {
                day = 30
            } else if (month == 2) {
                if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) { //闰年
                    day = 29
                } else {
                    day = 28
                }

            }
            return day;
        },
        slide:function(el){
            //滑动
            var T,mT,isPress = false,el = $('#date-wrapper ol');
            el.bind(tstart, function(e){
                e.stopPropagation();
                e.preventDefault();
                var e = e.originalEvent;
                T = e.pageY || e.touches[0].pageY;
                if(!isTouch){isPress = true;}
            })
            el.bind(tmove, function(e){
                e.stopPropagation();
                e.preventDefault();
                var e = e.originalEvent,that = $(this);
                if(!isTouch && !isPress){return false};
                mT = e.pageY || e.touches[0].pageY;
                that.css('top', that.position().top + (mT - T) + 'px');
                T = mT;
                if (that.position().top > 0) that.css('top', '0');
                if (that.position().top < -(that.height() - (3*resH))) that.css('top', '-' + (that.height() - (3*resH)) + 'px');
            })
            el.bind(tend, function(e){
                e.stopPropagation();
                e.preventDefault();
                var e = e.originalEvent,that = $(this);
                isPress = false;
                dragEnd(that);
            })
            el.bind(tcancel, function(e){
                e.stopPropagation();
                e.preventDefault();
                var e = e.originalEvent,that = $(this);
                isPress = false;
                // 解决一个pc端莫名触发问题
                if(!isTouch && + new Date() > time + 600){
                    dragEnd(that);
                }
            })
            function dragEnd(that){
                //滚动调整
                var t = that.position().top;
                that.css('top',Math.round(t/resH)*resH+'px');
                //定位active
                t = Math.round(Math.abs($(that).position().top));
                var li = that.children('li').get(t/resH+1);
                $(li).addClass('active').siblings().removeClass('active');
                //修正日期
                var id = that.attr('id');
                if(id == 'd-month' || id == 'd-year'){
                    var elDay = $('#d-day');
                    if(elDay.length == 0){return false;}
                    var end = createDate.bissextile($('#d-year .active').text(),$('#d-month .active').text());
                    if(end != (elDay.children().length-2)){
                        var active = elDay.children('.active').text();
                        
                        active > end && (active = end);
                        createDate.d(end,active);
                        if(Math.abs(elDay.position().top) > elDay.height()-3*resH)elDay.css('top','-'+(elDay.height()-3*resH)+'px');
                    }
                }
            }
        },
        show:function(isShow){
            var domMain = $('#date-wrapper'),
                domMask = $('#d-mask');
            if (isShow) {
                domMain.show();
                domMask.show();
                time = + new Date();
                body.css('overflow','hidden');
            } else {
                domMain.hide();
                domMask.hide();
                body.css('overflow','auto');
            }
        },
        resetActive:function(el){
             var d = new Date(),
                 date = el.data('fullDate');
  
             if(opt.location == 'before' && date){
                d = new Date(date);
                //if(d == 'Invalid Date'){d = new Date();}
                var end = createDate.bissextile(d.getFullYear(),d.getMonth() + 1);
                if($('#d-day>li').length != end + 2){
                    createDate.d(end);
                }
             }
            if(opt.limitTime == 'tomorrow' && !opt.location){
                d.setDate(d.getDate()+1);
            }
            $('#date-wrapper ol').each(function() {
                var e = $(this),
                eId = e.attr('id');
                e.children('li').each(function() {
                    var li = $(this),liText = Number(li.text() == ''? 'false':li.text());
                    if (eId == 'd-year' && liText === d.getFullYear()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-month' && liText === (d.getMonth() + 1)) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-day' && liText === d.getDate()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-hours' && liText === d.getHours()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-minutes' && liText === d.getMinutes()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-seconds' && liText === d.getSeconds()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    }
                })
            })
        },
        toNow:function(refresh){
            if (!refresh) {
                $('#date-wrapper ol').each(function(){
                    var that = $(this);
                    var liTop = -(that.children('.active').position().top -resH);
                    that.animate({
                        top: liTop
                    },
                    600);
                })
            } else {
                $('#date-wrapper ol').each(function() {
                    $(this).animate({
                        top: 0
                    },
                    0);
                })
            }
        },
        clear:function(){
            createDate.toNow(true);
            createDate.show(false);
        }
    }
    createDate.m();
    createDate.d();
    createDate.hm();
    createDate.s();
    createDate.slide();
    
    var opt,
        userOption,
        el = $('#date-wrapper'),
        elTit = $('#d-tit'),
        elBg = $('#d-bg'),
        prevY = '';
        
    function DateTool(obj){
        var that = $(obj);
        that.bind('click',function() {
            if(that.get(0).tagName == 'INPUT'){that.blur();}
            userOption = that.data('options');
            if(typeof(userOption) == 'string'){userOption = JSON.parse(userOption.replace(/'/g,'"'));}
            if (!el.is(':visible')) {
                opt = null;
                opt = $.extend({},opts,userOption || {});
                var y = '' + opt.beginYear + opt.endYear;
                if(prevY != y){
                    createDate.y(opt.beginYear,opt.endYear);
                    prevY = y;
                }
                if(dateFormat[0].indexOf(opt.type) != -1){//年月日 时分秒
                    elTit.children().show();
                    elBg.children().show();
                    el.attr('class','');
                }else if(dateFormat[1].indexOf(opt.type) != -1){//年月日 时分
                    elTit.children().show().end().children(':gt(4)').hide();
                    elBg.children().show().end().children(':gt(4)').hide();
                    el.attr('class','five');
                }else if(dateFormat[2].indexOf(opt.type) != -1){//年月日
                    elTit.children().show().end().children(':gt(2)').hide();
                    elBg.children().show().end().children(':gt(2)').hide();
                    el.attr('class','three');
                }else if(dateFormat[3].indexOf(opt.type) != -1){//年月
                    elTit.children().show().end().children(':gt(1)').hide();
                    elBg.children().show().end().children(':gt(1)').hide();
                    el.attr('class','two');
                }else if(dateFormat[4].indexOf(opt.type) == 0){//时分秒
                    elTit.children().show().end().children(':lt(3)').hide();
                    elBg.children().show().end().children(':lt(3)').hide();
                    el.attr('class','three hms');
                }else if(dateFormat[4].indexOf(opt.type) == 1){//时分
                    elTit.children().show().end().children(':lt(3)').hide().parent().children().eq(5).hide();
                    elBg.children().show().end().children(':lt(3)').hide().parent().children().eq(5).hide();
                    el.attr('class','two hm');
                }
                createDate.resetActive(that);
                createDate.show(true);
                createDate.toNow(false);
                $('#d-confirm').attr('d-id', obj);
            }
        });
    }
    $.date = function(obj){
        DateTool(obj);
    }
    //取消
    $('#d-cancel,#d-mask').bind('click',function(){
        createDate.clear();
    })
    //确定
    $('#d-confirm').bind('click',function(){
        var y = $('#d-year .active').text(),
            m = $('#d-month .active').text(),
            d = $('#d-day .active').text(),
            h = $('#d-hours .active').text(),
            min = $('#d-minutes .active').text(),
            s = $('#d-seconds .active').text(),
            str,
            that = $($(this).attr('d-id')),
            index = dateFormat[0].indexOf(opt.type),
            index1 = dateFormat[1].indexOf(opt.type),
            index2 = dateFormat[2].indexOf(opt.type),
            index3 = dateFormat[3].indexOf(opt.type),
            index4 = dateFormat[4].indexOf(opt.type);
            
        if( index != -1){//年月日 时分秒
            switch(index){
                case 0:
                  str = y+'-'+m+'-'+d+' '+h+':'+min+':'+s;
                  break;
                case 1:
                  str = y.substring(2)+'-'+m+'-'+d+' '+h+':'+min+':'+s;
                  break;
                case 2:
                  str = y+'/'+m+'/'+d+' '+h+':'+min+':'+s;
                  break;
                case 3:
                  str = y.substring(2)+'/'+m+'/'+d+' '+h+':'+min+':'+s;
                  break;
            }  
        }else if(index1 != -1){//年月日 时分
            switch(index1){
                case 0:
                  str = y+'-'+m+'-'+d+' '+h+':'+min;
                  break;
                case 1:
                  str = y.substring(2)+'-'+m+'-'+d+' '+h+':'+min;
                  break;
                case 2:
                  str = y+'/'+m+'/'+d+' '+h+':'+min;
                  break;
                case 3:
                  str = y.substring(2)+'/'+m+'/'+d+' '+h+':'+min;
                  break;
            }  
        }else if(index2 != -1){//年月日
            switch(index2){
                case 0:
                  str = y+'-'+m+'-'+d;
                  break;
                case 1:
                  str = y.substring(2)+'-'+m+'-'+d;
                  break;
                case 2:
                  str = y+'/'+m+'/'+d;
                  break;
                case 3:
                  str = y.substring(2)+'/'+m+'/'+d;
                  break;
            }  
        }else if(index3 != -1){//年月
            switch(index3){
                case 0:
                  str = y+'-'+m;
                  break;
                case 1:
                  str = y.substring(2)+'-'+m;
                  break;
                case 2:
                  str = y+'/'+m;
                  break;
                case 3:
                  str = y.substring(2)+'/'+m;
                  break;
            }  
        }else if(index4 == 0){//时分秒
            str = h+':'+min+':'+s;
        }else if(index4 == 1){//时分
            str = h+':'+ min;
        }

        if(opt.limitTime == 'today'){
            var d = new Date(),
                error = !isEnglish ? '不能选择过去的时间':'You can\'t choose the past time';
            //当前日期
            var day = String(d.getFullYear())+'-'+String(d.getMonth() + 1)+'-'+String(d.getDate());
            var d1 = new Date(str.replace(/\-/g, "\/")); 
            var d2 = new Date(day.replace(/\-/g, "\/"));
            if(d1 < d2){
                alert(error);
                return false;
            }  
        }else if(opt.limitTime == 'tomorrow'){
            var d = new Date(),
                error = !isEnglish ? '时间最少选择明天':'Choose tomorrow at least';
            //当前日期+1
            var day = String(d.getFullYear())+'-'+String(d.getMonth() + 1)+'-'+String(d.getDate()+1);
            var d1 = new Date(str.replace(/\-/g, "\/")); 
            var d2 = new Date(day.replace(/\-/g, "\/"));
            if(d1 < d2){
                alert(error);
                return false;
            }  
        }
        // 回调函数
        var fun = opt.callback;
        if(fun){
            if(fun.indexOf('.') == -1){
                var flag = window[fun](str);
            }else{
                var arr = fun.split('.'),
                    flag = window[arr[0]][arr[1]](str);
            }
            if(flag == false){
                return false;
            }else if(flag){
                str = flag;
            }
        }
        //赋值
        if(that.get(0).tagName == 'INPUT'){
            that.val(str);
        }else{
            that.text(str);
        }
        
        if(opt.location){
            that.data('fullDate',y+'-'+m+'-'+d+' '+h+':'+min+':'+s);
        }
        createDate.show(false);
        createDate.toNow(true);
    })
}))