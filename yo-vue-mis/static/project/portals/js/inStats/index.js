define('normalize',{});
define('css',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});

define('css!modules/header/css/header',[],function(){});
define('text',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});

define('text!modules/header/tpl/header.html',[],function () { return '<div>\n    <a href="/project/portals/pages/index.html" class="logo">滴滴安全</a>\n    <!-- ul.header-list>(li>(a[href=javascript:]+i))*5 -->\n    <ul class="header-list">\n        <!--        <li ng-repeat="item in navData" ng-class="{hover:isCurrent(item)item.urlName==currPageName}" ng-cloak>-->\n        <li ng-repeat="item in navData" ng-class="{hover:isCurrent(item)}" ng-cloak>\n            <a ng-href="{{item.urlName === \'application-list\' ? item.url + \'#?formType=0\' :item.url}}">{{item.name}}</a>\n            <i></i>\n            <ul class="p-dropdown" ng-if="item.menu && item.menu.length">\n                <li ng-repeat="m in item.menu">\n                    <a ng-href="{{m.url}}">{{m.name}}</a>\n                </li>\n            </ul>\n        </li>\n    </ul>\n    <div class="header-right">\n        <div class="msg">\n            <a href="/project/portals/pages/task.html">\n                <span>待办</span>\n                <b>{{taskCount}}</b>\n            </a>\n            <!--<ul class="p-dropdown">\n                <li><b>3个</b>数据申请</li>\n            </ul>-->\n        </div>\n        <div class="wrap-user-img">\n            <div class="wrap-img">\n                <img err-src="http://static.galileo.xiaojukeji.com/static/tms/api/public/other/8355c3caf02679026151c10588307c5a.png" ng-src="http://home.didichuxing.com/DidiFile/Avatar/{{headerPageData.name}}.jpg">\n            </div>\n            <div class="user">\n                <span class="name" ng-bind="headerPageData.userName || headerPageData.name"></span>\n                <ul class="p-dropdown">\n                    <li ng-if="isDutyEmp()">\n                        <a href="/project/portals/pages/duty.html#/zhiban">值班管理</a>\n                    </li>\n                    <li ng-if="isDutyMgr()">\n                        <a href="/project/portals/pages/duty.html#/paiban">排班管理</a>\n                    </li>\n                    <li>\n                        <a href="/project/mis/sdl.html#/report/list">上报可疑事件</a>\n                    </li>\n                    <li ng-click="loginOut()">\n                        <a href="javascript:">注销</a>\n                    </li>\n                    <!-- <li><b>20个</b>新端口申请</li>\n                    <li>查看全部</li>-->\n                </ul>\n            </div>\n        </div>\n    </div>\n</div>';});

 define('common/http-provider/http-provider',['require','exports','module'],function (require, exports, module) {
     return function (app) {
         app.factory('myHttpInterceptor', ['$q', '$window', function ($q, $window) {
             return {
                 'request': function (config) {
                     config.headers.TaskId = (+new Date()) + '-' + String(Math.random()).slice(2);
                     return config;
                 },
                 'requestError': function (rejection) {
                     console.error('requestError:' + rejection.config.url, arguments);
                     return $q.reject(rejection);
                 },
                 'response': function (res) {
                     if (res.data && res.data.errno) {
                         if (String(res.data.errno) === '301') {
                             res.data.data.logoutURL && ($window.location.href = res.data.data.logoutURL.replace('${jumpto}', encodeURI(location.href)));
                             return $q.reject(res);
                         }
                         //请求返回的状态errno不是0，这里打个log
                         if (res.data.errno !== 0) {
                             console.error('res data error:', res.config.url, res);
                             return res;
                         }
                     }
                     return res;
                 },
                 'responseError': function (rejection) {
                     console.error('responseError:' + rejection.config.url, arguments);
                     //  alert('服务器开小差了，请刷新重试！');
                     return $q.reject(rejection);
                 }
             };
         }]);

         app.config(['$httpProvider', function ($httpProvider) {
             $httpProvider.defaults.useXDomain = true;
             $httpProvider.defaults.headers.common['X-Requested-With'] = "XMLHttpRequest";
             $httpProvider.interceptors.push('myHttpInterceptor');
         }]);
     }
 });
define('common/err-src/err-img-src',['require','exports','module'],function (require, exports, module) {
    return function (app) {
        app.directive('errSrc', function () {
            var fallbackSrc = {
                link: function postLink(scope, iElement, iAttrs) {
                    iElement.bind('error', function () {
                        if (this.isError === true) {
                            return;
                        }
                        this.isError = true;
                        angular.element(this).attr("src", iAttrs.errSrc);
                    });
                }
            }
            return fallbackSrc;
        });
    }
});
'use strict';
/**
 * author           xj
 * @date            2016-09-27 18:12:35
 * @email           littlebearbond@qq.com
 * @description
 */
define('modules/header/js/header',['require','exports','module','css!../css/header.css','text!../tpl/header.html','./../../../common/http-provider/http-provider','./../../../common/err-src/err-img-src'],function (require, exports, module) {
    require('css!../css/header.css');
    var headerTpl = require('text!../tpl/header.html');
    var headerApp = angular.module('header', []);
    require('./../../../common/http-provider/http-provider')(headerApp);
    require('./../../../common/err-src/err-img-src')(headerApp);

    headerApp.directive('headerHtml', ['$compile', function ($compile) {
        return {
            restrict: "AE",
            replace: true,
            template: function (tElement, tAttrs) {
                return headerTpl;
            },
            controller: ['$scope', '$http', '$location', '$rootScope', '$timeout', function ($scope, $http, $location, $rootScope, $timeout) {
                var getUrlName = function (url) {
                    return url.replace(/\.html(.+)?/, '').split('/').pop();
                }

                var filterData = function (data) {
                    data.forEach(function (val) {
                        val.urlName = getUrlName(val.url);
                    })
                    return data;
                }

                $scope.taskCount = 0;
                $scope.currPageName = '';
                $scope.navData = [];

                $rootScope.$on('header.cancelSelect', function () {
                    $scope.currPageUrl = null;
                })

                $rootScope.$on('header.select', function (data) {
                    $scope.currPageUrl = data;
                })

                $scope.loginOut = function () {
                    $http({
                        method: "GET",
                        url: '/logout'
                    }).success(function (res) {
                        if (String(res.errno) !== '0' || !res.data.logoutURL) {
                            console.log('error');
                            return;
                        }
                        location.href = res.data.logoutURL;
                    });
                };

                $http({
                    method: "GET",
                    url: '/sec/user'
                }).success(function (res) {
                    if (String(res.errno) !== '0') {
                        return;
                    }
                    $scope.headerPageData = res.data;
                    $rootScope.$user = res.data;
                    $scope.navData = filterData(res.data.menus);
                    $rootScope.$broadcast('init.user', res.data);
                    $timeout(function () {
                        $scope.currPageName = getUrlName($location.$$absUrl);
                    })
                });

                $http({
                    method: "GET",
                    url: '/process/getTaskCount'
                }).success(function (res) {
                    if (String(res.errno) !== '0') {
                        return;
                    }
                    $scope.taskCount = res.data >= 100 ? '99+' : res.data;
                });
                
                //  添加值班管理权限
                $scope.roles = [];
                $http({
                    method: "GET",
                    url: '/userInfo'
                }).success(function (resp) {
                    var roles = [],
                        datas = resp.roles;
                    $rootScope.empUser = resp;
                    datas.forEach(function(item) {
                        roles.push(item.name);
                    });
                    $scope.roles = roles;
                });
                //
                $scope.isDutyEmp = function() {                   
                    return $scope.roles.indexOf('dutyEmp') > -1;
                }
                
                $scope.isDutyMgr = function() {
                    return $scope.roles.indexOf('dutyMgr') > -1;
                }
                
                //  解析地址栏
                function parseMenu() {
                    let currentUrl = location.href,
                        regex = /^https?:\/\/[^/]+(\/.+\.html)[^#]*(#\/[a-zA-Z0-9/]*)?/,
                        values = currentUrl.match(regex),
                        masterMenu = values[1],
                        subMenu = values[2]
                     if(subMenu) {
                        return masterMenu + subMenu
                    }
                    return masterMenu
                }
                
                /**
                 *  判断当前菜单匹配
                 */
                $scope.isCurrent = function(item) {
                    var currentMenu = parseMenu()
                    if(item.url == currentMenu) {
                        return true
                    }
                    if(!item.menu) {
                        return false
                    }
                    for(let i = 0, len = item.menu.length; i < len; i ++) {
                        if(item.menu[i].url == currentMenu) {
                            return true
                        }
                    }
                    return false
                        
                }
                
            }]
        };
    }]);
    /*window.addEventListener('error', function (errorEvent) {
        var message = errorEvent.message;
        var msg = message.toLowerCase();
        var substring = "script error";
        if (msg.indexOf(substring) > -1) {
            console.log('Script Error: See Browser Console for Detail');
        } else {
            var messageArr = [
                'Message: ' + message,
                'filename: ' + errorEvent.filename,
                'Line: ' + errorEvent.lineno,
                'Column: ' + errorEvent.colno,
                'type: ' + errorEvent.type,
                'Error object: ' + JSON.stringify(errorEvent.error)
            ].join(' - ');
            console.log(messageArr);
        }
        return false;
    })*/
});
define('js/common/app',['require','exports','module','../../modules/header/js/header'],function(require, exports, module) {
    require('../../modules/header/js/header');
    return angular.module('myApp', ['header']);
});

//! moment.js
//! version : 2.18.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('moment',factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

var hookCallback;

function hooks () {
    return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback (callback) {
    hookCallback = callback;
}

function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

function isObject(input) {
    // IE8 will treat undefined and null as object if it wasn't for
    // input != null
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
}

function isObjectEmpty(obj) {
    var k;
    for (k in obj) {
        // even if its not own property I'd still call it non-empty
        return false;
    }
    return true;
}

function isUndefined(input) {
    return input === void 0;
}

function isNumber(input) {
    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

function map(arr, fn) {
    var res = [], i;
    for (i = 0; i < arr.length; ++i) {
        res.push(fn(arr[i], i));
    }
    return res;
}

function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}

function extend(a, b) {
    for (var i in b) {
        if (hasOwnProp(b, i)) {
            a[i] = b[i];
        }
    }

    if (hasOwnProp(b, 'toString')) {
        a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
        a.valueOf = b.valueOf;
    }

    return a;
}

function createUTC (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
}

function defaultParsingFlags() {
    // We need to deep clone this object.
    return {
        empty           : false,
        unusedTokens    : [],
        unusedInput     : [],
        overflow        : -2,
        charsLeftOver   : 0,
        nullInput       : false,
        invalidMonth    : null,
        invalidFormat   : false,
        userInvalidated : false,
        iso             : false,
        parsedDateParts : [],
        meridiem        : null,
        rfc2822         : false,
        weekdayMismatch : false
    };
}

function getParsingFlags(m) {
    if (m._pf == null) {
        m._pf = defaultParsingFlags();
    }
    return m._pf;
}

var some;
if (Array.prototype.some) {
    some = Array.prototype.some;
} else {
    some = function (fun) {
        var t = Object(this);
        var len = t.length >>> 0;

        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}

var some$1 = some;

function isValid(m) {
    if (m._isValid == null) {
        var flags = getParsingFlags(m);
        var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
            return i != null;
        });
        var isNowValid = !isNaN(m._d.getTime()) &&
            flags.overflow < 0 &&
            !flags.empty &&
            !flags.invalidMonth &&
            !flags.invalidWeekday &&
            !flags.nullInput &&
            !flags.invalidFormat &&
            !flags.userInvalidated &&
            (!flags.meridiem || (flags.meridiem && parsedParts));

        if (m._strict) {
            isNowValid = isNowValid &&
                flags.charsLeftOver === 0 &&
                flags.unusedTokens.length === 0 &&
                flags.bigHour === undefined;
        }

        if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
        }
        else {
            return isNowValid;
        }
    }
    return m._isValid;
}

function createInvalid (flags) {
    var m = createUTC(NaN);
    if (flags != null) {
        extend(getParsingFlags(m), flags);
    }
    else {
        getParsingFlags(m).userInvalidated = true;
    }

    return m;
}

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = hooks.momentProperties = [];

function copyConfig(to, from) {
    var i, prop, val;

    if (!isUndefined(from._isAMomentObject)) {
        to._isAMomentObject = from._isAMomentObject;
    }
    if (!isUndefined(from._i)) {
        to._i = from._i;
    }
    if (!isUndefined(from._f)) {
        to._f = from._f;
    }
    if (!isUndefined(from._l)) {
        to._l = from._l;
    }
    if (!isUndefined(from._strict)) {
        to._strict = from._strict;
    }
    if (!isUndefined(from._tzm)) {
        to._tzm = from._tzm;
    }
    if (!isUndefined(from._isUTC)) {
        to._isUTC = from._isUTC;
    }
    if (!isUndefined(from._offset)) {
        to._offset = from._offset;
    }
    if (!isUndefined(from._pf)) {
        to._pf = getParsingFlags(from);
    }
    if (!isUndefined(from._locale)) {
        to._locale = from._locale;
    }

    if (momentProperties.length > 0) {
        for (i = 0; i < momentProperties.length; i++) {
            prop = momentProperties[i];
            val = from[prop];
            if (!isUndefined(val)) {
                to[prop] = val;
            }
        }
    }

    return to;
}

var updateInProgress = false;

// Moment prototype object
function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    if (!this.isValid()) {
        this._d = new Date(NaN);
    }
    // Prevent infinite loop in case updateOffset creates new moment
    // objects.
    if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
    }
}

function isMoment (obj) {
    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
}

function absFloor (number) {
    if (number < 0) {
        // -0 -> 0
        return Math.ceil(number) || 0;
    } else {
        return Math.floor(number);
    }
}

function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }

    return value;
}

// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length),
        lengthDiff = Math.abs(array1.length - array2.length),
        diffs = 0,
        i;
    for (i = 0; i < len; i++) {
        if ((dontConvert && array1[i] !== array2[i]) ||
            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
            diffs++;
        }
    }
    return diffs + lengthDiff;
}

function warn(msg) {
    if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !==  'undefined') && console.warn) {
        console.warn('Deprecation warning: ' + msg);
    }
}

function deprecate(msg, fn) {
    var firstTime = true;

    return extend(function () {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
        }
        if (firstTime) {
            var args = [];
            var arg;
            for (var i = 0; i < arguments.length; i++) {
                arg = '';
                if (typeof arguments[i] === 'object') {
                    arg += '\n[' + i + '] ';
                    for (var key in arguments[0]) {
                        arg += key + ': ' + arguments[0][key] + ', ';
                    }
                    arg = arg.slice(0, -2); // Remove trailing comma and space
                } else {
                    arg = arguments[i];
                }
                args.push(arg);
            }
            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
            firstTime = false;
        }
        return fn.apply(this, arguments);
    }, fn);
}

var deprecations = {};

function deprecateSimple(name, msg) {
    if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
    }
}

hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;

function isFunction(input) {
    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}

function set (config) {
    var prop, i;
    for (i in config) {
        prop = config[i];
        if (isFunction(prop)) {
            this[i] = prop;
        } else {
            this['_' + i] = prop;
        }
    }
    this._config = config;
    // Lenient ordinal parsing accepts just a number in addition to
    // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
    // TODO: Remove "ordinalParse" fallback in next major release.
    this._dayOfMonthOrdinalParseLenient = new RegExp(
        (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
            '|' + (/\d{1,2}/).source);
}

function mergeConfigs(parentConfig, childConfig) {
    var res = extend({}, parentConfig), prop;
    for (prop in childConfig) {
        if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                res[prop] = {};
                extend(res[prop], parentConfig[prop]);
                extend(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
                res[prop] = childConfig[prop];
            } else {
                delete res[prop];
            }
        }
    }
    for (prop in parentConfig) {
        if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
            // make sure changes to properties don't modify parent config
            res[prop] = extend({}, res[prop]);
        }
    }
    return res;
}

function Locale(config) {
    if (config != null) {
        this.set(config);
    }
}

var keys;

if (Object.keys) {
    keys = Object.keys;
} else {
    keys = function (obj) {
        var i, res = [];
        for (i in obj) {
            if (hasOwnProp(obj, i)) {
                res.push(i);
            }
        }
        return res;
    };
}

var keys$1 = keys;

var defaultCalendar = {
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    nextWeek : 'dddd [at] LT',
    lastDay : '[Yesterday at] LT',
    lastWeek : '[Last] dddd [at] LT',
    sameElse : 'L'
};

function calendar (key, mom, now) {
    var output = this._calendar[key] || this._calendar['sameElse'];
    return isFunction(output) ? output.call(mom, now) : output;
}

var defaultLongDateFormat = {
    LTS  : 'h:mm:ss A',
    LT   : 'h:mm A',
    L    : 'MM/DD/YYYY',
    LL   : 'MMMM D, YYYY',
    LLL  : 'MMMM D, YYYY h:mm A',
    LLLL : 'dddd, MMMM D, YYYY h:mm A'
};

function longDateFormat (key) {
    var format = this._longDateFormat[key],
        formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
        return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
        return val.slice(1);
    });

    return this._longDateFormat[key];
}

var defaultInvalidDate = 'Invalid date';

function invalidDate () {
    return this._invalidDate;
}

var defaultOrdinal = '%d';
var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

function ordinal (number) {
    return this._ordinal.replace('%d', number);
}

var defaultRelativeTime = {
    future : 'in %s',
    past   : '%s ago',
    s  : 'a few seconds',
    ss : '%d seconds',
    m  : 'a minute',
    mm : '%d minutes',
    h  : 'an hour',
    hh : '%d hours',
    d  : 'a day',
    dd : '%d days',
    M  : 'a month',
    MM : '%d months',
    y  : 'a year',
    yy : '%d years'
};

function relativeTime (number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return (isFunction(output)) ?
        output(number, withoutSuffix, string, isFuture) :
        output.replace(/%d/i, number);
}

function pastFuture (diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
}

var aliases = {};

function addUnitAlias (unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
}

function normalizeUnits(units) {
    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}

function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
        normalizedProp,
        prop;

    for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
            }
        }
    }

    return normalizedInput;
}

var priorities = {};

function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
}

function getPrioritizedUnits(unitsObj) {
    var units = [];
    for (var u in unitsObj) {
        units.push({unit: u, priority: priorities[u]});
    }
    units.sort(function (a, b) {
        return a.priority - b.priority;
    });
    return units;
}

function makeGetSet (unit, keepTime) {
    return function (value) {
        if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
        } else {
            return get(this, unit);
        }
    };
}

function get (mom, unit) {
    return mom.isValid() ?
        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
}

function set$1 (mom, unit, value) {
    if (mom.isValid()) {
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }
}

// MOMENTS

function stringGet (units) {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
        return this[units]();
    }
    return this;
}


function stringSet (units, value) {
    if (typeof units === 'object') {
        units = normalizeObjectUnits(units);
        var prioritized = getPrioritizedUnits(units);
        for (var i = 0; i < prioritized.length; i++) {
            this[prioritized[i].unit](units[prioritized[i].unit]);
        }
    } else {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units](value);
        }
    }
    return this;
}

function zeroFill(number, targetLength, forceSign) {
    var absNumber = '' + Math.abs(number),
        zerosToFill = targetLength - absNumber.length,
        sign = number >= 0;
    return (sign ? (forceSign ? '+' : '') : '-') +
        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

var formatFunctions = {};

var formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken (token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
        func = function () {
            return this[callback]();
        };
    }
    if (token) {
        formatTokenFunctions[token] = func;
    }
    if (padded) {
        formatTokenFunctions[padded[0]] = function () {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
    }
    if (ordinal) {
        formatTokenFunctions[ordinal] = function () {
            return this.localeData().ordinal(func.apply(this, arguments), token);
        };
    }
}

function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
    var array = format.match(formattingTokens), i, length;

    for (i = 0, length = array.length; i < length; i++) {
        if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
        } else {
            array[i] = removeFormattingTokens(array[i]);
        }
    }

    return function (mom) {
        var output = '', i;
        for (i = 0; i < length; i++) {
            output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
        }
        return output;
    };
}

// format date using native date object
function formatMoment(m, format) {
    if (!m.isValid()) {
        return m.localeData().invalidDate();
    }

    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

    return formatFunctions[format](m);
}

function expandFormat(format, locale) {
    var i = 5;

    function replaceLongDateFormatTokens(input) {
        return locale.longDateFormat(input) || input;
    }

    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        localFormattingTokens.lastIndex = 0;
        i -= 1;
    }

    return format;
}

var match1         = /\d/;            //       0 - 9
var match2         = /\d\d/;          //      00 - 99
var match3         = /\d{3}/;         //     000 - 999
var match4         = /\d{4}/;         //    0000 - 9999
var match6         = /[+-]?\d{6}/;    // -999999 - 999999
var match1to2      = /\d\d?/;         //       0 - 99
var match3to4      = /\d\d\d\d?/;     //     999 - 9999
var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
var match1to3      = /\d{1,3}/;       //       0 - 999
var match1to4      = /\d{1,4}/;       //       0 - 9999
var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

var matchUnsigned  = /\d+/;           //       0 - inf
var matchSigned    = /[+-]?\d+/;      //    -inf - inf

var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


var regexes = {};

function addRegexToken (token, regex, strictRegex) {
    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
        return (isStrict && strictRegex) ? strictRegex : regex;
    };
}

function getParseRegexForToken (token, config) {
    if (!hasOwnProp(regexes, token)) {
        return new RegExp(unescapeFormat(token));
    }

    return regexes[token](config._strict, config._locale);
}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s) {
    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
        return p1 || p2 || p3 || p4;
    }));
}

function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var tokens = {};

function addParseToken (token, callback) {
    var i, func = callback;
    if (typeof token === 'string') {
        token = [token];
    }
    if (isNumber(callback)) {
        func = function (input, array) {
            array[callback] = toInt(input);
        };
    }
    for (i = 0; i < token.length; i++) {
        tokens[token[i]] = func;
    }
}

function addWeekParseToken (token, callback) {
    addParseToken(token, function (input, array, config, token) {
        config._w = config._w || {};
        callback(input, config._w, config, token);
    });
}

function addTimeToArrayFromToken(token, input, config) {
    if (input != null && hasOwnProp(tokens, token)) {
        tokens[token](input, config._a, config, token);
    }
}

var YEAR = 0;
var MONTH = 1;
var DATE = 2;
var HOUR = 3;
var MINUTE = 4;
var SECOND = 5;
var MILLISECOND = 6;
var WEEK = 7;
var WEEKDAY = 8;

var indexOf;

if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
} else {
    indexOf = function (o) {
        // I know
        var i;
        for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
                return i;
            }
        }
        return -1;
    };
}

var indexOf$1 = indexOf;

function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

// FORMATTING

addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
});

// ALIASES

addUnitAlias('month', 'M');

// PRIORITY

addUnitPriority('month', 8);

// PARSING

addRegexToken('M',    match1to2);
addRegexToken('MM',   match1to2, match2);
addRegexToken('MMM',  function (isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
});
addRegexToken('MMMM', function (isStrict, locale) {
    return locale.monthsRegex(isStrict);
});

addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    // if we didn't find a month name, mark the date as invalid.
    if (month != null) {
        array[MONTH] = month;
    } else {
        getParsingFlags(config).invalidMonth = input;
    }
});

// LOCALES

var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
function localeMonths (m, format) {
    if (!m) {
        return isArray(this._months) ? this._months :
            this._months['standalone'];
    }
    return isArray(this._months) ? this._months[m.month()] :
        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
}

var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
function localeMonthsShort (m, format) {
    if (!m) {
        return isArray(this._monthsShort) ? this._monthsShort :
            this._monthsShort['standalone'];
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}

function handleStrictParse(monthName, format, strict) {
    var i, ii, mom, llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
        // this is not used
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
            mom = createUTC([2000, i]);
            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeMonthsParse (monthName, format, strict) {
    var i, mom, regex;

    if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
    }

    // TODO: add sorting
    // Sorting makes sure if one month (or abbr) is a prefix of another
    // see sorting in computeMonthsParse
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
        }
        if (!strict && !this._monthsParse[i]) {
            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
            return i;
        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
            return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
        }
    }
}

// MOMENTS

function setMonth (mom, value) {
    var dayOfMonth;

    if (!mom.isValid()) {
        // No op
        return mom;
    }

    if (typeof value === 'string') {
        if (/^\d+$/.test(value)) {
            value = toInt(value);
        } else {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (!isNumber(value)) {
                return mom;
            }
        }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
}

function getSetMonth (value) {
    if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
    } else {
        return get(this, 'Month');
    }
}

function getDaysInMonth () {
    return daysInMonth(this.year(), this.month());
}

var defaultMonthsShortRegex = matchWord;
function monthsShortRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsShortStrictRegex;
        } else {
            return this._monthsShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsShortRegex')) {
            this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict ?
            this._monthsShortStrictRegex : this._monthsShortRegex;
    }
}

var defaultMonthsRegex = matchWord;
function monthsRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsStrictRegex;
        } else {
            return this._monthsRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsRegex')) {
            this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict ?
            this._monthsStrictRegex : this._monthsRegex;
    }
}

function computeMonthsParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom;
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        shortPieces.push(this.monthsShort(mom, ''));
        longPieces.push(this.months(mom, ''));
        mixedPieces.push(this.months(mom, ''));
        mixedPieces.push(this.monthsShort(mom, ''));
    }
    // Sorting makes sure if one month (or abbr) is a prefix of another it
    // will match the longer piece.
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 12; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
    }
    for (i = 0; i < 24; i++) {
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

// FORMATTING

addFormatToken('Y', 0, 0, function () {
    var y = this.year();
    return y <= 9999 ? '' + y : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function () {
    return this.year() % 100;
});

addFormatToken(0, ['YYYY',   4],       0, 'year');
addFormatToken(0, ['YYYYY',  5],       0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

addUnitAlias('year', 'y');

// PRIORITIES

addUnitPriority('year', 1);

// PARSING

addRegexToken('Y',      matchSigned);
addRegexToken('YY',     match1to2, match2);
addRegexToken('YYYY',   match1to4, match4);
addRegexToken('YYYYY',  match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);

addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array) {
    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken('YY', function (input, array) {
    array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken('Y', function (input, array) {
    array[YEAR] = parseInt(input, 10);
});

// HELPERS

function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// HOOKS

hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
};

// MOMENTS

var getSetYear = makeGetSet('FullYear', true);

function getIsLeapYear () {
    return isLeapYear(this.year());
}

function createDate (y, m, d, h, M, s, ms) {
    // can't just apply() to create a date:
    // https://stackoverflow.com/q/181348
    var date = new Date(y, m, d, h, M, s, ms);

    // the date constructor remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
        date.setFullYear(y);
    }
    return date;
}

function createUTCDate (y) {
    var date = new Date(Date.UTC.apply(null, arguments));

    // the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
    }
    return date;
}

// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
        fwd = 7 + dow - doy,
        // first-week day local weekday -- which local weekday is fwd
        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

    return -fwdlw + fwd - 1;
}

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7,
        weekOffset = firstWeekOffset(year, dow, doy),
        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
        resYear, resDayOfYear;

    if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
    } else {
        resYear = year;
        resDayOfYear = dayOfYear;
    }

    return {
        year: resYear,
        dayOfYear: resDayOfYear
    };
}

function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek, resYear;

    if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
    } else {
        resYear = mom.year();
        resWeek = week;
    }

    return {
        week: resWeek,
        year: resYear
    };
}

function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy),
        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}

// FORMATTING

addFormatToken('w', ['ww', 2], 'wo', 'week');
addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

addUnitAlias('week', 'w');
addUnitAlias('isoWeek', 'W');

// PRIORITIES

addUnitPriority('week', 5);
addUnitPriority('isoWeek', 5);

// PARSING

addRegexToken('w',  match1to2);
addRegexToken('ww', match1to2, match2);
addRegexToken('W',  match1to2);
addRegexToken('WW', match1to2, match2);

addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
});

// HELPERS

// LOCALES

function localeWeek (mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}

var defaultLocaleWeek = {
    dow : 0, // Sunday is the first day of the week.
    doy : 6  // The week that contains Jan 1st is the first week of the year.
};

function localeFirstDayOfWeek () {
    return this._week.dow;
}

function localeFirstDayOfYear () {
    return this._week.doy;
}

// MOMENTS

function getSetWeek (input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
}

function getSetISOWeek (input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
}

// FORMATTING

addFormatToken('d', 0, 'do', 'day');

addFormatToken('dd', 0, 0, function (format) {
    return this.localeData().weekdaysMin(this, format);
});

addFormatToken('ddd', 0, 0, function (format) {
    return this.localeData().weekdaysShort(this, format);
});

addFormatToken('dddd', 0, 0, function (format) {
    return this.localeData().weekdays(this, format);
});

addFormatToken('e', 0, 0, 'weekday');
addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

addUnitAlias('day', 'd');
addUnitAlias('weekday', 'e');
addUnitAlias('isoWeekday', 'E');

// PRIORITY
addUnitPriority('day', 11);
addUnitPriority('weekday', 11);
addUnitPriority('isoWeekday', 11);

// PARSING

addRegexToken('d',    match1to2);
addRegexToken('e',    match1to2);
addRegexToken('E',    match1to2);
addRegexToken('dd',   function (isStrict, locale) {
    return locale.weekdaysMinRegex(isStrict);
});
addRegexToken('ddd',   function (isStrict, locale) {
    return locale.weekdaysShortRegex(isStrict);
});
addRegexToken('dddd',   function (isStrict, locale) {
    return locale.weekdaysRegex(isStrict);
});

addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
    var weekday = config._locale.weekdaysParse(input, token, config._strict);
    // if we didn't get a weekday name, mark the date as invalid
    if (weekday != null) {
        week.d = weekday;
    } else {
        getParsingFlags(config).invalidWeekday = input;
    }
});

addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
    week[token] = toInt(input);
});

// HELPERS

function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
        return input;
    }

    if (!isNaN(input)) {
        return parseInt(input, 10);
    }

    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
        return input;
    }

    return null;
}

function parseIsoWeekday(input, locale) {
    if (typeof input === 'string') {
        return locale.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
}

// LOCALES

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
function localeWeekdays (m, format) {
    if (!m) {
        return isArray(this._weekdays) ? this._weekdays :
            this._weekdays['standalone'];
    }
    return isArray(this._weekdays) ? this._weekdays[m.day()] :
        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
}

var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
function localeWeekdaysShort (m) {
    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}

var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
function localeWeekdaysMin (m) {
    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}

function handleStrictParse$1(weekdayName, format, strict) {
    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._minWeekdaysParse = [];

        for (i = 0; i < 7; ++i) {
            mom = createUTC([2000, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeWeekdaysParse (weekdayName, format, strict) {
    var i, mom, regex;

    if (this._weekdaysParseExact) {
        return handleStrictParse$1.call(this, weekdayName, format, strict);
    }

    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
    }

    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already

        mom = createUTC([2000, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
        }
        if (!this._weekdaysParse[i]) {
            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
        }
    }
}

// MOMENTS

function getSetDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
        input = parseWeekday(input, this.localeData());
        return this.add(input - day, 'd');
    } else {
        return day;
    }
}

function getSetLocaleDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, 'd');
}

function getSetISODayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }

    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.

    if (input != null) {
        var weekday = parseIsoWeekday(input, this.localeData());
        return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
        return this.day() || 7;
    }
}

var defaultWeekdaysRegex = matchWord;
function weekdaysRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysStrictRegex;
        } else {
            return this._weekdaysRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ?
            this._weekdaysStrictRegex : this._weekdaysRegex;
    }
}

var defaultWeekdaysShortRegex = matchWord;
function weekdaysShortRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysShortStrictRegex;
        } else {
            return this._weekdaysShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ?
            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
}

var defaultWeekdaysMinRegex = matchWord;
function weekdaysMinRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysMinStrictRegex;
        } else {
            return this._weekdaysMinRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ?
            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
}


function computeWeekdaysParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom, minp, shortp, longp;
    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, 1]).day(i);
        minp = this.weekdaysMin(mom, '');
        shortp = this.weekdaysShort(mom, '');
        longp = this.weekdays(mom, '');
        minPieces.push(minp);
        shortPieces.push(shortp);
        longPieces.push(longp);
        mixedPieces.push(minp);
        mixedPieces.push(shortp);
        mixedPieces.push(longp);
    }
    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
    // will match the longer piece.
    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 7; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;

    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

// FORMATTING

function hFormat() {
    return this.hours() % 12 || 12;
}

function kFormat() {
    return this.hours() || 24;
}

addFormatToken('H', ['HH', 2], 0, 'hour');
addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('hmm', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});

addFormatToken('hmmss', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

addFormatToken('Hmm', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2);
});

addFormatToken('Hmmss', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

function meridiem (token, lowercase) {
    addFormatToken(token, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
}

meridiem('a', true);
meridiem('A', false);

// ALIASES

addUnitAlias('hour', 'h');

// PRIORITY
addUnitPriority('hour', 13);

// PARSING

function matchMeridiem (isStrict, locale) {
    return locale._meridiemParse;
}

addRegexToken('a',  matchMeridiem);
addRegexToken('A',  matchMeridiem);
addRegexToken('H',  match1to2);
addRegexToken('h',  match1to2);
addRegexToken('k',  match1to2);
addRegexToken('HH', match1to2, match2);
addRegexToken('hh', match1to2, match2);
addRegexToken('kk', match1to2, match2);

addRegexToken('hmm', match3to4);
addRegexToken('hmmss', match5to6);
addRegexToken('Hmm', match3to4);
addRegexToken('Hmmss', match5to6);

addParseToken(['H', 'HH'], HOUR);
addParseToken(['k', 'kk'], function (input, array, config) {
    var kInput = toInt(input);
    array[HOUR] = kInput === 24 ? 0 : kInput;
});
addParseToken(['a', 'A'], function (input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
});
addParseToken(['h', 'hh'], function (input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
});
addParseToken('Hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
});
addParseToken('Hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
});

// LOCALES

function localeIsPM (input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return ((input + '').toLowerCase().charAt(0) === 'p');
}

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
function localeMeridiem (hours, minutes, isLower) {
    if (hours > 11) {
        return isLower ? 'pm' : 'PM';
    } else {
        return isLower ? 'am' : 'AM';
    }
}


// MOMENTS

// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
var getSetHour = makeGetSet('Hours', true);

// months
// week
// weekdays
// meridiem
var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
    relativeTime: defaultRelativeTime,

    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,

    week: defaultLocaleWeek,

    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,

    meridiemParse: defaultLocaleMeridiemParse
};

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale;

function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
    var i = 0, j, next, locale, split;

    while (i < names.length) {
        split = normalizeLocale(names[i]).split('-');
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split('-') : null;
        while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
                return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                //the next array item is better than a shallower substring of this one
                break;
            }
            j--;
        }
        i++;
    }
    return null;
}

function loadLocale(name) {
    var oldLocale = null;
    // TODO: Find a better way to register and load all the locales in Node
    if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
        try {
            oldLocale = globalLocale._abbr;
            require('./locale/' + name);
            // because defineLocale currently also sets the global locale, we
            // want to undo that for lazy loaded locales
            getSetGlobalLocale(oldLocale);
        } catch (e) { }
    }
    return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale (key, values) {
    var data;
    if (key) {
        if (isUndefined(values)) {
            data = getLocale(key);
        }
        else {
            data = defineLocale(key, values);
        }

        if (data) {
            // moment.duration._locale = moment._locale = data;
            globalLocale = data;
        }
    }

    return globalLocale._abbr;
}

function defineLocale (name, config) {
    if (config !== null) {
        var parentConfig = baseConfig;
        config.abbr = name;
        if (locales[name] != null) {
            deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
            parentConfig = locales[name]._config;
        } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
                parentConfig = locales[config.parentLocale]._config;
            } else {
                if (!localeFamilies[config.parentLocale]) {
                    localeFamilies[config.parentLocale] = [];
                }
                localeFamilies[config.parentLocale].push({
                    name: name,
                    config: config
                });
                return null;
            }
        }
        locales[name] = new Locale(mergeConfigs(parentConfig, config));

        if (localeFamilies[name]) {
            localeFamilies[name].forEach(function (x) {
                defineLocale(x.name, x.config);
            });
        }

        // backwards compat for now: also set the locale
        // make sure we set the locale AFTER all child locales have been
        // created, so we won't end up with the child locale set.
        getSetGlobalLocale(name);


        return locales[name];
    } else {
        // useful for testing
        delete locales[name];
        return null;
    }
}

function updateLocale(name, config) {
    if (config != null) {
        var locale, parentConfig = baseConfig;
        // MERGE
        if (locales[name] != null) {
            parentConfig = locales[name]._config;
        }
        config = mergeConfigs(parentConfig, config);
        locale = new Locale(config);
        locale.parentLocale = locales[name];
        locales[name] = locale;

        // backwards compat for now: also set the locale
        getSetGlobalLocale(name);
    } else {
        // pass null for config to unupdate, useful for tests
        if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
                locales[name] = locales[name].parentLocale;
            } else if (locales[name] != null) {
                delete locales[name];
            }
        }
    }
    return locales[name];
}

// returns locale data
function getLocale (key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        //short-circuit everything else
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}

function listLocales() {
    return keys$1(locales);
}

function checkOverflow (m) {
    var overflow;
    var a = m._a;

    if (a && getParsingFlags(m).overflow === -2) {
        overflow =
            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
            -1;

        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
        }
        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
        }
        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
        }

        getParsingFlags(m).overflow = overflow;
    }

    return m;
}

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

var isoDates = [
    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
    ['YYYY-DDD', /\d{4}-\d{3}/],
    ['YYYY-MM', /\d{4}-\d\d/, false],
    ['YYYYYYMMDD', /[+-]\d{10}/],
    ['YYYYMMDD', /\d{8}/],
    // YYYYMM is NOT allowed by the standard
    ['GGGG[W]WWE', /\d{4}W\d{3}/],
    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
    ['YYYYDDD', /\d{7}/]
];

// iso time formats and regexes
var isoTimes = [
    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
    ['HH:mm', /\d\d:\d\d/],
    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
    ['HHmmss', /\d\d\d\d\d\d/],
    ['HHmm', /\d\d\d\d/],
    ['HH', /\d\d/]
];

var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

// date from iso format
function configFromISO(config) {
    var i, l,
        string = config._i,
        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
        allowTime, dateFormat, timeFormat, tzFormat;

    if (match) {
        getParsingFlags(config).iso = true;

        for (i = 0, l = isoDates.length; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
                dateFormat = isoDates[i][0];
                allowTime = isoDates[i][2] !== false;
                break;
            }
        }
        if (dateFormat == null) {
            config._isValid = false;
            return;
        }
        if (match[3]) {
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(match[3])) {
                    // match[2] should be 'T' or space
                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (timeFormat == null) {
                config._isValid = false;
                return;
            }
        }
        if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
        }
        if (match[4]) {
            if (tzRegex.exec(match[4])) {
                tzFormat = 'Z';
            } else {
                config._isValid = false;
                return;
            }
        }
        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
        configFromStringAndFormat(config);
    } else {
        config._isValid = false;
    }
}

// RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
var basicRfcRegex = /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/;

// date and time from ref 2822 format
function configFromRFC2822(config) {
    var string, match, dayFormat,
        dateFormat, timeFormat, tzFormat;
    var timezones = {
        ' GMT': ' +0000',
        ' EDT': ' -0400',
        ' EST': ' -0500',
        ' CDT': ' -0500',
        ' CST': ' -0600',
        ' MDT': ' -0600',
        ' MST': ' -0700',
        ' PDT': ' -0700',
        ' PST': ' -0800'
    };
    var military = 'YXWVUTSRQPONZABCDEFGHIKLM';
    var timezone, timezoneIndex;

    string = config._i
        .replace(/\([^\)]*\)|[\n\t]/g, ' ') // Remove comments and folding whitespace
        .replace(/(\s\s+)/g, ' ') // Replace multiple-spaces with a single space
        .replace(/^\s|\s$/g, ''); // Remove leading and trailing spaces
    match = basicRfcRegex.exec(string);

    if (match) {
        dayFormat = match[1] ? 'ddd' + ((match[1].length === 5) ? ', ' : ' ') : '';
        dateFormat = 'D MMM ' + ((match[2].length > 10) ? 'YYYY ' : 'YY ');
        timeFormat = 'HH:mm' + (match[4] ? ':ss' : '');

        // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
        if (match[1]) { // day of week given
            var momentDate = new Date(match[2]);
            var momentDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][momentDate.getDay()];

            if (match[1].substr(0,3) !== momentDay) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return;
            }
        }

        switch (match[5].length) {
            case 2: // military
                if (timezoneIndex === 0) {
                    timezone = ' +0000';
                } else {
                    timezoneIndex = military.indexOf(match[5][1].toUpperCase()) - 12;
                    timezone = ((timezoneIndex < 0) ? ' -' : ' +') +
                        (('' + timezoneIndex).replace(/^-?/, '0')).match(/..$/)[0] + '00';
                }
                break;
            case 4: // Zone
                timezone = timezones[match[5]];
                break;
            default: // UT or +/-9999
                timezone = timezones[' GMT'];
        }
        match[5] = timezone;
        config._i = match.splice(1).join('');
        tzFormat = ' ZZ';
        config._f = dayFormat + dateFormat + timeFormat + tzFormat;
        configFromStringAndFormat(config);
        getParsingFlags(config).rfc2822 = true;
    } else {
        config._isValid = false;
    }
}

// date from iso format or fallback
function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);

    if (matched !== null) {
        config._d = new Date(+matched[1]);
        return;
    }

    configFromISO(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    configFromRFC2822(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    // Final attempt, use Input Fallback
    hooks.createFromInputFallback(config);
}

hooks.createFromInputFallback = deprecate(
    'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
    'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
    'discouraged and will be removed in an upcoming major release. Please refer to ' +
    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
    function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    }
);

// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
    if (a != null) {
        return a;
    }
    if (b != null) {
        return b;
    }
    return c;
}

function currentDateArray(config) {
    // hooks is actually the exported moment object
    var nowValue = new Date(hooks.now());
    if (config._useUTC) {
        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
    }
    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray (config) {
    var i, date, input = [], currentDate, yearToUse;

    if (config._d) {
        return;
    }

    currentDate = currentDateArray(config);

    //compute day of the year from weeks and weekdays
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
        dayOfYearFromWeekInfo(config);
    }

    //if the day of the year is set, figure out what it is
    if (config._dayOfYear != null) {
        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

        if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
            getParsingFlags(config)._overflowDayOfYear = true;
        }

        date = createUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
    }

    // Default to current date.
    // * if no year, month, day of month are given, default to today
    // * if day of month is given, default month and year
    // * if month is given, default only year
    // * if year is given, don't default anything
    for (i = 0; i < 3 && config._a[i] == null; ++i) {
        config._a[i] = input[i] = currentDate[i];
    }

    // Zero out whatever was not defaulted, including time
    for (; i < 7; i++) {
        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
    }

    // Check for 24:00:00.000
    if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
        config._nextDay = true;
        config._a[HOUR] = 0;
    }

    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
    // Apply timezone offset from input. The actual utcOffset can be changed
    // with parseZone.
    if (config._tzm != null) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }

    if (config._nextDay) {
        config._a[HOUR] = 24;
    }
}

function dayOfYearFromWeekInfo(config) {
    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

    w = config._w;
    if (w.GG != null || w.W != null || w.E != null) {
        dow = 1;
        doy = 4;

        // TODO: We need to take the current isoWeekYear, but that depends on
        // how we interpret now (local, utc, fixed offset). So create
        // a now version of current config (take local/utc/offset flags, and
        // create now).
        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
        week = defaults(w.W, 1);
        weekday = defaults(w.E, 1);
        if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
        }
    } else {
        dow = config._locale._week.dow;
        doy = config._locale._week.doy;

        var curWeek = weekOfYear(createLocal(), dow, doy);

        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

        // Default to current week.
        week = defaults(w.w, curWeek.week);

        if (w.d != null) {
            // weekday -- low day numbers are considered next week
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
                weekdayOverflow = true;
            }
        } else if (w.e != null) {
            // local weekday -- counting starts from begining of week
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
                weekdayOverflow = true;
            }
        } else {
            // default to begining of week
            weekday = dow;
        }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
        getParsingFlags(config)._overflowWeeks = true;
    } else if (weekdayOverflow != null) {
        getParsingFlags(config)._overflowWeekday = true;
    } else {
        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }
}

// constant that refers to the ISO standard
hooks.ISO_8601 = function () {};

// constant that refers to the RFC 2822 form
hooks.RFC_2822 = function () {};

// date from string and format string
function configFromStringAndFormat(config) {
    // TODO: Move this to another part of the creation flow to prevent circular deps
    if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
    }
    if (config._f === hooks.RFC_2822) {
        configFromRFC2822(config);
        return;
    }
    config._a = [];
    getParsingFlags(config).empty = true;

    // This array is used to make a Date, either with `new Date` or `Date.UTC`
    var string = '' + config._i,
        i, parsedInput, tokens, token, skipped,
        stringLength = string.length,
        totalParsedInputLength = 0;

    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
        // console.log('token', token, 'parsedInput', parsedInput,
        //         'regex', getParseRegexForToken(token, config));
        if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
                getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
        }
        // don't parse if it's not a known token
        if (formatTokenFunctions[token]) {
            if (parsedInput) {
                getParsingFlags(config).empty = false;
            }
            else {
                getParsingFlags(config).unusedTokens.push(token);
            }
            addTimeToArrayFromToken(token, parsedInput, config);
        }
        else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token);
        }
    }

    // add remaining unparsed input length to the string
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
        getParsingFlags(config).unusedInput.push(string);
    }

    // clear _12h flag if hour is <= 12
    if (config._a[HOUR] <= 12 &&
        getParsingFlags(config).bigHour === true &&
        config._a[HOUR] > 0) {
        getParsingFlags(config).bigHour = undefined;
    }

    getParsingFlags(config).parsedDateParts = config._a.slice(0);
    getParsingFlags(config).meridiem = config._meridiem;
    // handle meridiem
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

    configFromArray(config);
    checkOverflow(config);
}


function meridiemFixWrap (locale, hour, meridiem) {
    var isPm;

    if (meridiem == null) {
        // nothing to do
        return hour;
    }
    if (locale.meridiemHour != null) {
        return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
        // Fallback
        isPm = locale.isPM(meridiem);
        if (isPm && hour < 12) {
            hour += 12;
        }
        if (!isPm && hour === 12) {
            hour = 0;
        }
        return hour;
    } else {
        // this is not supposed to happen
        return hour;
    }
}

// date from string and array of format strings
function configFromStringAndArray(config) {
    var tempConfig,
        bestMoment,

        scoreToBeat,
        i,
        currentScore;

    if (config._f.length === 0) {
        getParsingFlags(config).invalidFormat = true;
        config._d = new Date(NaN);
        return;
    }

    for (i = 0; i < config._f.length; i++) {
        currentScore = 0;
        tempConfig = copyConfig({}, config);
        if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
        }
        tempConfig._f = config._f[i];
        configFromStringAndFormat(tempConfig);

        if (!isValid(tempConfig)) {
            continue;
        }

        // if there is any input that was not parsed add a penalty for that format
        currentScore += getParsingFlags(tempConfig).charsLeftOver;

        //or tokens
        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

        getParsingFlags(tempConfig).score = currentScore;

        if (scoreToBeat == null || currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
        }
    }

    extend(config, bestMoment || tempConfig);
}

function configFromObject(config) {
    if (config._d) {
        return;
    }

    var i = normalizeObjectUnits(config._i);
    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
        return obj && parseInt(obj, 10);
    });

    configFromArray(config);
}

function createFromConfig (config) {
    var res = new Moment(checkOverflow(prepareConfig(config)));
    if (res._nextDay) {
        // Adding is smart enough around DST
        res.add(1, 'd');
        res._nextDay = undefined;
    }

    return res;
}

function prepareConfig (config) {
    var input = config._i,
        format = config._f;

    config._locale = config._locale || getLocale(config._l);

    if (input === null || (format === undefined && input === '')) {
        return createInvalid({nullInput: true});
    }

    if (typeof input === 'string') {
        config._i = input = config._locale.preparse(input);
    }

    if (isMoment(input)) {
        return new Moment(checkOverflow(input));
    } else if (isDate(input)) {
        config._d = input;
    } else if (isArray(format)) {
        configFromStringAndArray(config);
    } else if (format) {
        configFromStringAndFormat(config);
    }  else {
        configFromInput(config);
    }

    if (!isValid(config)) {
        config._d = null;
    }

    return config;
}

function configFromInput(config) {
    var input = config._i;
    if (isUndefined(input)) {
        config._d = new Date(hooks.now());
    } else if (isDate(input)) {
        config._d = new Date(input.valueOf());
    } else if (typeof input === 'string') {
        configFromString(config);
    } else if (isArray(input)) {
        config._a = map(input.slice(0), function (obj) {
            return parseInt(obj, 10);
        });
        configFromArray(config);
    } else if (isObject(input)) {
        configFromObject(config);
    } else if (isNumber(input)) {
        // from milliseconds
        config._d = new Date(input);
    } else {
        hooks.createFromInputFallback(config);
    }
}

function createLocalOrUTC (input, format, locale, strict, isUTC) {
    var c = {};

    if (locale === true || locale === false) {
        strict = locale;
        locale = undefined;
    }

    if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
        input = undefined;
    }
    // object construction must be done this way.
    // https://github.com/moment/moment/issues/1423
    c._isAMomentObject = true;
    c._useUTC = c._isUTC = isUTC;
    c._l = locale;
    c._i = input;
    c._f = format;
    c._strict = strict;

    return createFromConfig(c);
}

function createLocal (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
}

var prototypeMin = deprecate(
    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

var prototypeMax = deprecate(
    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn, moments) {
    var res, i;
    if (moments.length === 1 && isArray(moments[0])) {
        moments = moments[0];
    }
    if (!moments.length) {
        return createLocal();
    }
    res = moments[0];
    for (i = 1; i < moments.length; ++i) {
        if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
        }
    }
    return res;
}

// TODO: Use [].sort instead?
function min () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isBefore', args);
}

function max () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isAfter', args);
}

var now = function () {
    return Date.now ? Date.now() : +(new Date());
};

var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

function isDurationValid(m) {
    for (var key in m) {
        if (!(ordering.indexOf(key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
            return false;
        }
    }

    var unitHasDecimal = false;
    for (var i = 0; i < ordering.length; ++i) {
        if (m[ordering[i]]) {
            if (unitHasDecimal) {
                return false; // only allow non-integers for smallest unit
            }
            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                unitHasDecimal = true;
            }
        }
    }

    return true;
}

function isValid$1() {
    return this._isValid;
}

function createInvalid$1() {
    return createDuration(NaN);
}

function Duration (duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;

    this._isValid = isDurationValid(normalizedInput);

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
        seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
        weeks * 7;
    // It is impossible translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
        quarters * 3 +
        years * 12;

    this._data = {};

    this._locale = getLocale();

    this._bubble();
}

function isDuration (obj) {
    return obj instanceof Duration;
}

function absRound (number) {
    if (number < 0) {
        return Math.round(-1 * number) * -1;
    } else {
        return Math.round(number);
    }
}

// FORMATTING

function offset (token, separator) {
    addFormatToken(token, 0, 0, function () {
        var offset = this.utcOffset();
        var sign = '+';
        if (offset < 0) {
            offset = -offset;
            sign = '-';
        }
        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
    });
}

offset('Z', ':');
offset('ZZ', '');

// PARSING

addRegexToken('Z',  matchShortOffset);
addRegexToken('ZZ', matchShortOffset);
addParseToken(['Z', 'ZZ'], function (input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(matchShortOffset, input);
});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(matcher, string) {
    var matches = (string || '').match(matcher);

    if (matches === null) {
        return null;
    }

    var chunk   = matches[matches.length - 1] || [];
    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);

    return minutes === 0 ?
      0 :
      parts[0] === '+' ? minutes : -minutes;
}

// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input, model) {
    var res, diff;
    if (model._isUTC) {
        res = model.clone();
        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
        // Use low-level api, because this fn is low-level api.
        res._d.setTime(res._d.valueOf() + diff);
        hooks.updateOffset(res, false);
        return res;
    } else {
        return createLocal(input).local();
    }
}

function getDateOffset (m) {
    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
    // https://github.com/moment/moment/pull/1871
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
hooks.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset (input, keepLocalTime, keepMinutes) {
    var offset = this._offset || 0,
        localAdjust;
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    if (input != null) {
        if (typeof input === 'string') {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
                return this;
            }
        } else if (Math.abs(input) < 16 && !keepMinutes) {
            input = input * 60;
        }
        if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
        }
        this._offset = input;
        this._isUTC = true;
        if (localAdjust != null) {
            this.add(localAdjust, 'm');
        }
        if (offset !== input) {
            if (!keepLocalTime || this._changeInProgress) {
                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
            } else if (!this._changeInProgress) {
                this._changeInProgress = true;
                hooks.updateOffset(this, true);
                this._changeInProgress = null;
            }
        }
        return this;
    } else {
        return this._isUTC ? offset : getDateOffset(this);
    }
}

function getSetZone (input, keepLocalTime) {
    if (input != null) {
        if (typeof input !== 'string') {
            input = -input;
        }

        this.utcOffset(input, keepLocalTime);

        return this;
    } else {
        return -this.utcOffset();
    }
}

function setOffsetToUTC (keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
}

function setOffsetToLocal (keepLocalTime) {
    if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;

        if (keepLocalTime) {
            this.subtract(getDateOffset(this), 'm');
        }
    }
    return this;
}

function setOffsetToParsedOffset () {
    if (this._tzm != null) {
        this.utcOffset(this._tzm, false, true);
    } else if (typeof this._i === 'string') {
        var tZone = offsetFromString(matchOffset, this._i);
        if (tZone != null) {
            this.utcOffset(tZone);
        }
        else {
            this.utcOffset(0, true);
        }
    }
    return this;
}

function hasAlignedHourOffset (input) {
    if (!this.isValid()) {
        return false;
    }
    input = input ? createLocal(input).utcOffset() : 0;

    return (this.utcOffset() - input) % 60 === 0;
}

function isDaylightSavingTime () {
    return (
        this.utcOffset() > this.clone().month(0).utcOffset() ||
        this.utcOffset() > this.clone().month(5).utcOffset()
    );
}

function isDaylightSavingTimeShifted () {
    if (!isUndefined(this._isDSTShifted)) {
        return this._isDSTShifted;
    }

    var c = {};

    copyConfig(c, this);
    c = prepareConfig(c);

    if (c._a) {
        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
        this._isDSTShifted = this.isValid() &&
            compareArrays(c._a, other.toArray()) > 0;
    } else {
        this._isDSTShifted = false;
    }

    return this._isDSTShifted;
}

function isLocal () {
    return this.isValid() ? !this._isUTC : false;
}

function isUtcOffset () {
    return this.isValid() ? this._isUTC : false;
}

function isUtc () {
    return this.isValid() ? this._isUTC && this._offset === 0 : false;
}

// ASP.NET json date format regex
var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

function createDuration (input, key) {
    var duration = input,
        // matching against regexp is expensive, do it on demand
        match = null,
        sign,
        ret,
        diffRes;

    if (isDuration(input)) {
        duration = {
            ms : input._milliseconds,
            d  : input._days,
            M  : input._months
        };
    } else if (isNumber(input)) {
        duration = {};
        if (key) {
            duration[key] = input;
        } else {
            duration.milliseconds = input;
        }
    } else if (!!(match = aspNetRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y  : 0,
            d  : toInt(match[DATE])                         * sign,
            h  : toInt(match[HOUR])                         * sign,
            m  : toInt(match[MINUTE])                       * sign,
            s  : toInt(match[SECOND])                       * sign,
            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
        };
    } else if (!!(match = isoRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y : parseIso(match[2], sign),
            M : parseIso(match[3], sign),
            w : parseIso(match[4], sign),
            d : parseIso(match[5], sign),
            h : parseIso(match[6], sign),
            m : parseIso(match[7], sign),
            s : parseIso(match[8], sign)
        };
    } else if (duration == null) {// checks for null or undefined
        duration = {};
    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

        duration = {};
        duration.ms = diffRes.milliseconds;
        duration.M = diffRes.months;
    }

    ret = new Duration(duration);

    if (isDuration(input) && hasOwnProp(input, '_locale')) {
        ret._locale = input._locale;
    }

    return ret;
}

createDuration.fn = Duration.prototype;
createDuration.invalid = createInvalid$1;

function parseIso (inp, sign) {
    // We'd normally use ~~inp for this, but unfortunately it also
    // converts floats to ints.
    // inp may be undefined, so careful calling replace on it.
    var res = inp && parseFloat(inp.replace(',', '.'));
    // apply sign while we're at it
    return (isNaN(res) ? 0 : res) * sign;
}

function positiveMomentsDifference(base, other) {
    var res = {milliseconds: 0, months: 0};

    res.months = other.month() - base.month() +
        (other.year() - base.year()) * 12;
    if (base.clone().add(res.months, 'M').isAfter(other)) {
        --res.months;
    }

    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

    return res;
}

function momentsDifference(base, other) {
    var res;
    if (!(base.isValid() && other.isValid())) {
        return {milliseconds: 0, months: 0};
    }

    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
        res = positiveMomentsDifference(base, other);
    } else {
        res = positiveMomentsDifference(other, base);
        res.milliseconds = -res.milliseconds;
        res.months = -res.months;
    }

    return res;
}

// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
    return function (val, period) {
        var dur, tmp;
        //invert the arguments, but complain about it
        if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
            tmp = val; val = period; period = tmp;
        }

        val = typeof val === 'string' ? +val : val;
        dur = createDuration(val, period);
        addSubtract(this, dur, direction);
        return this;
    };
}

function addSubtract (mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
        days = absRound(duration._days),
        months = absRound(duration._months);

    if (!mom.isValid()) {
        // No op
        return;
    }

    updateOffset = updateOffset == null ? true : updateOffset;

    if (milliseconds) {
        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    }
    if (days) {
        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
    }
    if (months) {
        setMonth(mom, get(mom, 'Month') + months * isAdding);
    }
    if (updateOffset) {
        hooks.updateOffset(mom, days || months);
    }
}

var add      = createAdder(1, 'add');
var subtract = createAdder(-1, 'subtract');

function getCalendarFormat(myMoment, now) {
    var diff = myMoment.diff(now, 'days', true);
    return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
}

function calendar$1 (time, formats) {
    // We want to compare the start of today, vs this.
    // Getting start-of-today depends on whether we're local/utc/offset or not.
    var now = time || createLocal(),
        sod = cloneWithOffset(now, this).startOf('day'),
        format = hooks.calendarFormat(this, sod) || 'sameElse';

    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
}

function clone () {
    return new Moment(this);
}

function isAfter (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() > localInput.valueOf();
    } else {
        return localInput.valueOf() < this.clone().startOf(units).valueOf();
    }
}

function isBefore (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() < localInput.valueOf();
    } else {
        return this.clone().endOf(units).valueOf() < localInput.valueOf();
    }
}

function isBetween (from, to, units, inclusivity) {
    inclusivity = inclusivity || '()';
    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
}

function isSame (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input),
        inputMs;
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(units || 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() === localInput.valueOf();
    } else {
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
    }
}

function isSameOrAfter (input, units) {
    return this.isSame(input, units) || this.isAfter(input,units);
}

function isSameOrBefore (input, units) {
    return this.isSame(input, units) || this.isBefore(input,units);
}

function diff (input, units, asFloat) {
    var that,
        zoneDelta,
        delta, output;

    if (!this.isValid()) {
        return NaN;
    }

    that = cloneWithOffset(input, this);

    if (!that.isValid()) {
        return NaN;
    }

    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

    units = normalizeUnits(units);

    if (units === 'year' || units === 'month' || units === 'quarter') {
        output = monthDiff(this, that);
        if (units === 'quarter') {
            output = output / 3;
        } else if (units === 'year') {
            output = output / 12;
        }
    } else {
        delta = this - that;
        output = units === 'second' ? delta / 1e3 : // 1000
            units === 'minute' ? delta / 6e4 : // 1000 * 60
            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
            delta;
    }
    return asFloat ? output : absFloor(output);
}

function monthDiff (a, b) {
    // difference in months
    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
        // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months'),
        anchor2, adjust;

    if (b - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor - anchor2);
    } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor2 - anchor);
    }

    //check for negative zero, return zero if negative zero
    return -(wholeMonthDiff + adjust) || 0;
}

hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

function toString () {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

function toISOString() {
    if (!this.isValid()) {
        return null;
    }
    var m = this.clone().utc();
    if (m.year() < 0 || m.year() > 9999) {
        return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
    if (isFunction(Date.prototype.toISOString)) {
        // native implementation is ~50x faster, use it when we can
        return this.toDate().toISOString();
    }
    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
}

/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */
function inspect () {
    if (!this.isValid()) {
        return 'moment.invalid(/* ' + this._i + ' */)';
    }
    var func = 'moment';
    var zone = '';
    if (!this.isLocal()) {
        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
        zone = 'Z';
    }
    var prefix = '[' + func + '("]';
    var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
    var suffix = zone + '[")]';

    return this.format(prefix + year + datetime + suffix);
}

function format (inputString) {
    if (!inputString) {
        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
    }
    var output = formatMoment(this, inputString);
    return this.localeData().postformat(output);
}

function from (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function fromNow (withoutSuffix) {
    return this.from(createLocal(), withoutSuffix);
}

function to (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function toNow (withoutSuffix) {
    return this.to(createLocal(), withoutSuffix);
}

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale (key) {
    var newLocaleData;

    if (key === undefined) {
        return this._locale._abbr;
    } else {
        newLocaleData = getLocale(key);
        if (newLocaleData != null) {
            this._locale = newLocaleData;
        }
        return this;
    }
}

var lang = deprecate(
    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
    function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    }
);

function localeData () {
    return this._locale;
}

function startOf (units) {
    units = normalizeUnits(units);
    // the following switch intentionally omits break keywords
    // to utilize falling through the cases.
    switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
    }

    // weeks are a special case
    if (units === 'week') {
        this.weekday(0);
    }
    if (units === 'isoWeek') {
        this.isoWeekday(1);
    }

    // quarters are also special
    if (units === 'quarter') {
        this.month(Math.floor(this.month() / 3) * 3);
    }

    return this;
}

function endOf (units) {
    units = normalizeUnits(units);
    if (units === undefined || units === 'millisecond') {
        return this;
    }

    // 'date' is an alias for 'day', so it should be considered as such.
    if (units === 'date') {
        units = 'day';
    }

    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
}

function valueOf () {
    return this._d.valueOf() - ((this._offset || 0) * 60000);
}

function unix () {
    return Math.floor(this.valueOf() / 1000);
}

function toDate () {
    return new Date(this.valueOf());
}

function toArray () {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

function toObject () {
    var m = this;
    return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
    };
}

function toJSON () {
    // new Date(NaN).toJSON() === null
    return this.isValid() ? this.toISOString() : null;
}

function isValid$2 () {
    return isValid(this);
}

function parsingFlags () {
    return extend({}, getParsingFlags(this));
}

function invalidAt () {
    return getParsingFlags(this).overflow;
}

function creationData() {
    return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
    };
}

// FORMATTING

addFormatToken(0, ['gg', 2], 0, function () {
    return this.weekYear() % 100;
});

addFormatToken(0, ['GG', 2], 0, function () {
    return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken (token, getter) {
    addFormatToken(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg',     'weekYear');
addWeekYearFormatToken('ggggg',    'weekYear');
addWeekYearFormatToken('GGGG',  'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

addUnitAlias('weekYear', 'gg');
addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

addUnitPriority('weekYear', 1);
addUnitPriority('isoWeekYear', 1);


// PARSING

addRegexToken('G',      matchSigned);
addRegexToken('g',      matchSigned);
addRegexToken('GG',     match1to2, match2);
addRegexToken('gg',     match1to2, match2);
addRegexToken('GGGG',   match1to4, match4);
addRegexToken('gggg',   match1to4, match4);
addRegexToken('GGGGG',  match1to6, match6);
addRegexToken('ggggg',  match1to6, match6);

addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
    week[token.substr(0, 2)] = toInt(input);
});

addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
    week[token] = hooks.parseTwoDigitYear(input);
});

// MOMENTS

function getSetWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
}

function getSetISOWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
}

function getISOWeeksInYear () {
    return weeksInYear(this.year(), 1, 4);
}

function getWeeksInYear () {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    var weeksTarget;
    if (input == null) {
        return weekOfYear(this, dow, doy).year;
    } else {
        weeksTarget = weeksInYear(input, dow, doy);
        if (week > weeksTarget) {
            week = weeksTarget;
        }
        return setWeekAll.call(this, input, week, weekday, dow, doy);
    }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

    this.year(date.getUTCFullYear());
    this.month(date.getUTCMonth());
    this.date(date.getUTCDate());
    return this;
}

// FORMATTING

addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

addUnitAlias('quarter', 'Q');

// PRIORITY

addUnitPriority('quarter', 7);

// PARSING

addRegexToken('Q', match1);
addParseToken('Q', function (input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
});

// MOMENTS

function getSetQuarter (input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}

// FORMATTING

addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

addUnitAlias('date', 'D');

// PRIOROITY
addUnitPriority('date', 9);

// PARSING

addRegexToken('D',  match1to2);
addRegexToken('DD', match1to2, match2);
addRegexToken('Do', function (isStrict, locale) {
    // TODO: Remove "ordinalParse" fallback in next major release.
    return isStrict ?
      (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
      locale._dayOfMonthOrdinalParseLenient;
});

addParseToken(['D', 'DD'], DATE);
addParseToken('Do', function (input, array) {
    array[DATE] = toInt(input.match(match1to2)[0], 10);
});

// MOMENTS

var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
addUnitPriority('dayOfYear', 4);

// PARSING

addRegexToken('DDD',  match1to3);
addRegexToken('DDDD', match3);
addParseToken(['DDD', 'DDDD'], function (input, array, config) {
    config._dayOfYear = toInt(input);
});

// HELPERS

// MOMENTS

function getSetDayOfYear (input) {
    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
}

// FORMATTING

addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

addUnitAlias('minute', 'm');

// PRIORITY

addUnitPriority('minute', 14);

// PARSING

addRegexToken('m',  match1to2);
addRegexToken('mm', match1to2, match2);
addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

addUnitAlias('second', 's');

// PRIORITY

addUnitPriority('second', 15);

// PARSING

addRegexToken('s',  match1to2);
addRegexToken('ss', match1to2, match2);
addParseToken(['s', 'ss'], SECOND);

// MOMENTS

var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

addFormatToken('S', 0, 0, function () {
    return ~~(this.millisecond() / 100);
});

addFormatToken(0, ['SS', 2], 0, function () {
    return ~~(this.millisecond() / 10);
});

addFormatToken(0, ['SSS', 3], 0, 'millisecond');
addFormatToken(0, ['SSSS', 4], 0, function () {
    return this.millisecond() * 10;
});
addFormatToken(0, ['SSSSS', 5], 0, function () {
    return this.millisecond() * 100;
});
addFormatToken(0, ['SSSSSS', 6], 0, function () {
    return this.millisecond() * 1000;
});
addFormatToken(0, ['SSSSSSS', 7], 0, function () {
    return this.millisecond() * 10000;
});
addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
    return this.millisecond() * 100000;
});
addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
    return this.millisecond() * 1000000;
});


// ALIASES

addUnitAlias('millisecond', 'ms');

// PRIORITY

addUnitPriority('millisecond', 16);

// PARSING

addRegexToken('S',    match1to3, match1);
addRegexToken('SS',   match1to3, match2);
addRegexToken('SSS',  match1to3, match3);

var token;
for (token = 'SSSS'; token.length <= 9; token += 'S') {
    addRegexToken(token, matchUnsigned);
}

function parseMs(input, array) {
    array[MILLISECOND] = toInt(('0.' + input) * 1000);
}

for (token = 'S'; token.length <= 9; token += 'S') {
    addParseToken(token, parseMs);
}
// MOMENTS

var getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

addFormatToken('z',  0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

function getZoneAbbr () {
    return this._isUTC ? 'UTC' : '';
}

function getZoneName () {
    return this._isUTC ? 'Coordinated Universal Time' : '';
}

var proto = Moment.prototype;

proto.add               = add;
proto.calendar          = calendar$1;
proto.clone             = clone;
proto.diff              = diff;
proto.endOf             = endOf;
proto.format            = format;
proto.from              = from;
proto.fromNow           = fromNow;
proto.to                = to;
proto.toNow             = toNow;
proto.get               = stringGet;
proto.invalidAt         = invalidAt;
proto.isAfter           = isAfter;
proto.isBefore          = isBefore;
proto.isBetween         = isBetween;
proto.isSame            = isSame;
proto.isSameOrAfter     = isSameOrAfter;
proto.isSameOrBefore    = isSameOrBefore;
proto.isValid           = isValid$2;
proto.lang              = lang;
proto.locale            = locale;
proto.localeData        = localeData;
proto.max               = prototypeMax;
proto.min               = prototypeMin;
proto.parsingFlags      = parsingFlags;
proto.set               = stringSet;
proto.startOf           = startOf;
proto.subtract          = subtract;
proto.toArray           = toArray;
proto.toObject          = toObject;
proto.toDate            = toDate;
proto.toISOString       = toISOString;
proto.inspect           = inspect;
proto.toJSON            = toJSON;
proto.toString          = toString;
proto.unix              = unix;
proto.valueOf           = valueOf;
proto.creationData      = creationData;

// Year
proto.year       = getSetYear;
proto.isLeapYear = getIsLeapYear;

// Week Year
proto.weekYear    = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;

// Quarter
proto.quarter = proto.quarters = getSetQuarter;

// Month
proto.month       = getSetMonth;
proto.daysInMonth = getDaysInMonth;

// Week
proto.week           = proto.weeks        = getSetWeek;
proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
proto.weeksInYear    = getWeeksInYear;
proto.isoWeeksInYear = getISOWeeksInYear;

// Day
proto.date       = getSetDayOfMonth;
proto.day        = proto.days             = getSetDayOfWeek;
proto.weekday    = getSetLocaleDayOfWeek;
proto.isoWeekday = getSetISODayOfWeek;
proto.dayOfYear  = getSetDayOfYear;

// Hour
proto.hour = proto.hours = getSetHour;

// Minute
proto.minute = proto.minutes = getSetMinute;

// Second
proto.second = proto.seconds = getSetSecond;

// Millisecond
proto.millisecond = proto.milliseconds = getSetMillisecond;

// Offset
proto.utcOffset            = getSetOffset;
proto.utc                  = setOffsetToUTC;
proto.local                = setOffsetToLocal;
proto.parseZone            = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST                = isDaylightSavingTime;
proto.isLocal              = isLocal;
proto.isUtcOffset          = isUtcOffset;
proto.isUtc                = isUtc;
proto.isUTC                = isUtc;

// Timezone
proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;

// Deprecations
proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

function createUnix (input) {
    return createLocal(input * 1000);
}

function createInZone () {
    return createLocal.apply(null, arguments).parseZone();
}

function preParsePostFormat (string) {
    return string;
}

var proto$1 = Locale.prototype;

proto$1.calendar        = calendar;
proto$1.longDateFormat  = longDateFormat;
proto$1.invalidDate     = invalidDate;
proto$1.ordinal         = ordinal;
proto$1.preparse        = preParsePostFormat;
proto$1.postformat      = preParsePostFormat;
proto$1.relativeTime    = relativeTime;
proto$1.pastFuture      = pastFuture;
proto$1.set             = set;

// Month
proto$1.months            =        localeMonths;
proto$1.monthsShort       =        localeMonthsShort;
proto$1.monthsParse       =        localeMonthsParse;
proto$1.monthsRegex       = monthsRegex;
proto$1.monthsShortRegex  = monthsShortRegex;

// Week
proto$1.week = localeWeek;
proto$1.firstDayOfYear = localeFirstDayOfYear;
proto$1.firstDayOfWeek = localeFirstDayOfWeek;

// Day of Week
proto$1.weekdays       =        localeWeekdays;
proto$1.weekdaysMin    =        localeWeekdaysMin;
proto$1.weekdaysShort  =        localeWeekdaysShort;
proto$1.weekdaysParse  =        localeWeekdaysParse;

proto$1.weekdaysRegex       =        weekdaysRegex;
proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

// Hours
proto$1.isPM = localeIsPM;
proto$1.meridiem = localeMeridiem;

function get$1 (format, index, field, setter) {
    var locale = getLocale();
    var utc = createUTC().set(setter, index);
    return locale[field](utc, format);
}

function listMonthsImpl (format, index, field) {
    if (isNumber(format)) {
        index = format;
        format = undefined;
    }

    format = format || '';

    if (index != null) {
        return get$1(format, index, field, 'month');
    }

    var i;
    var out = [];
    for (i = 0; i < 12; i++) {
        out[i] = get$1(format, i, field, 'month');
    }
    return out;
}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl (localeSorted, format, index, field) {
    if (typeof localeSorted === 'boolean') {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    } else {
        format = localeSorted;
        index = format;
        localeSorted = false;

        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    }

    var locale = getLocale(),
        shift = localeSorted ? locale._week.dow : 0;

    if (index != null) {
        return get$1(format, (index + shift) % 7, field, 'day');
    }

    var i;
    var out = [];
    for (i = 0; i < 7; i++) {
        out[i] = get$1(format, (i + shift) % 7, field, 'day');
    }
    return out;
}

function listMonths (format, index) {
    return listMonthsImpl(format, index, 'months');
}

function listMonthsShort (format, index) {
    return listMonthsImpl(format, index, 'monthsShort');
}

function listWeekdays (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}

function listWeekdaysShort (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}

function listWeekdaysMin (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}

getSetGlobalLocale('en', {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (toInt(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});

// Side effect imports
hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

var mathAbs = Math.abs;

function abs () {
    var data           = this._data;

    this._milliseconds = mathAbs(this._milliseconds);
    this._days         = mathAbs(this._days);
    this._months       = mathAbs(this._months);

    data.milliseconds  = mathAbs(data.milliseconds);
    data.seconds       = mathAbs(data.seconds);
    data.minutes       = mathAbs(data.minutes);
    data.hours         = mathAbs(data.hours);
    data.months        = mathAbs(data.months);
    data.years         = mathAbs(data.years);

    return this;
}

function addSubtract$1 (duration, input, value, direction) {
    var other = createDuration(input, value);

    duration._milliseconds += direction * other._milliseconds;
    duration._days         += direction * other._days;
    duration._months       += direction * other._months;

    return duration._bubble();
}

// supports only 2.0-style add(1, 's') or add(duration)
function add$1 (input, value) {
    return addSubtract$1(this, input, value, 1);
}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
function subtract$1 (input, value) {
    return addSubtract$1(this, input, value, -1);
}

function absCeil (number) {
    if (number < 0) {
        return Math.floor(number);
    } else {
        return Math.ceil(number);
    }
}

function bubble () {
    var milliseconds = this._milliseconds;
    var days         = this._days;
    var months       = this._months;
    var data         = this._data;
    var seconds, minutes, hours, years, monthsFromDays;

    // if we have a mix of positive and negative values, bubble down first
    // check: https://github.com/moment/moment/issues/2166
    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
            (milliseconds <= 0 && days <= 0 && months <= 0))) {
        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
        days = 0;
        months = 0;
    }

    // The following code bubbles up values, see the tests for
    // examples of what that means.
    data.milliseconds = milliseconds % 1000;

    seconds           = absFloor(milliseconds / 1000);
    data.seconds      = seconds % 60;

    minutes           = absFloor(seconds / 60);
    data.minutes      = minutes % 60;

    hours             = absFloor(minutes / 60);
    data.hours        = hours % 24;

    days += absFloor(hours / 24);

    // convert days to months
    monthsFromDays = absFloor(daysToMonths(days));
    months += monthsFromDays;
    days -= absCeil(monthsToDays(monthsFromDays));

    // 12 months -> 1 year
    years = absFloor(months / 12);
    months %= 12;

    data.days   = days;
    data.months = months;
    data.years  = years;

    return this;
}

function daysToMonths (days) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return days * 4800 / 146097;
}

function monthsToDays (months) {
    // the reverse of daysToMonths
    return months * 146097 / 4800;
}

function as (units) {
    if (!this.isValid()) {
        return NaN;
    }
    var days;
    var months;
    var milliseconds = this._milliseconds;

    units = normalizeUnits(units);

    if (units === 'month' || units === 'year') {
        days   = this._days   + milliseconds / 864e5;
        months = this._months + daysToMonths(days);
        return units === 'month' ? months : months / 12;
    } else {
        // handle milliseconds separately because of floating point math errors (issue #1867)
        days = this._days + Math.round(monthsToDays(this._months));
        switch (units) {
            case 'week'   : return days / 7     + milliseconds / 6048e5;
            case 'day'    : return days         + milliseconds / 864e5;
            case 'hour'   : return days * 24    + milliseconds / 36e5;
            case 'minute' : return days * 1440  + milliseconds / 6e4;
            case 'second' : return days * 86400 + milliseconds / 1000;
            // Math.floor prevents floating point math errors here
            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
            default: throw new Error('Unknown unit ' + units);
        }
    }
}

// TODO: Use this.as('ms')?
function valueOf$1 () {
    if (!this.isValid()) {
        return NaN;
    }
    return (
        this._milliseconds +
        this._days * 864e5 +
        (this._months % 12) * 2592e6 +
        toInt(this._months / 12) * 31536e6
    );
}

function makeAs (alias) {
    return function () {
        return this.as(alias);
    };
}

var asMilliseconds = makeAs('ms');
var asSeconds      = makeAs('s');
var asMinutes      = makeAs('m');
var asHours        = makeAs('h');
var asDays         = makeAs('d');
var asWeeks        = makeAs('w');
var asMonths       = makeAs('M');
var asYears        = makeAs('y');

function get$2 (units) {
    units = normalizeUnits(units);
    return this.isValid() ? this[units + 's']() : NaN;
}

function makeGetter(name) {
    return function () {
        return this.isValid() ? this._data[name] : NaN;
    };
}

var milliseconds = makeGetter('milliseconds');
var seconds      = makeGetter('seconds');
var minutes      = makeGetter('minutes');
var hours        = makeGetter('hours');
var days         = makeGetter('days');
var months       = makeGetter('months');
var years        = makeGetter('years');

function weeks () {
    return absFloor(this.days() / 7);
}

var round = Math.round;
var thresholds = {
    ss: 44,         // a few seconds to seconds
    s : 45,         // seconds to minute
    m : 45,         // minutes to hour
    h : 22,         // hours to day
    d : 26,         // days to month
    M : 11          // months to year
};

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
    var duration = createDuration(posNegDuration).abs();
    var seconds  = round(duration.as('s'));
    var minutes  = round(duration.as('m'));
    var hours    = round(duration.as('h'));
    var days     = round(duration.as('d'));
    var months   = round(duration.as('M'));
    var years    = round(duration.as('y'));

    var a = seconds <= thresholds.ss && ['s', seconds]  ||
            seconds < thresholds.s   && ['ss', seconds] ||
            minutes <= 1             && ['m']           ||
            minutes < thresholds.m   && ['mm', minutes] ||
            hours   <= 1             && ['h']           ||
            hours   < thresholds.h   && ['hh', hours]   ||
            days    <= 1             && ['d']           ||
            days    < thresholds.d   && ['dd', days]    ||
            months  <= 1             && ['M']           ||
            months  < thresholds.M   && ['MM', months]  ||
            years   <= 1             && ['y']           || ['yy', years];

    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;
    return substituteTimeAgo.apply(null, a);
}

// This function allows you to set the rounding function for relative time strings
function getSetRelativeTimeRounding (roundingFunction) {
    if (roundingFunction === undefined) {
        return round;
    }
    if (typeof(roundingFunction) === 'function') {
        round = roundingFunction;
        return true;
    }
    return false;
}

// This function allows you to set a threshold for relative time strings
function getSetRelativeTimeThreshold (threshold, limit) {
    if (thresholds[threshold] === undefined) {
        return false;
    }
    if (limit === undefined) {
        return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    if (threshold === 's') {
        thresholds.ss = limit - 1;
    }
    return true;
}

function humanize (withSuffix) {
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var locale = this.localeData();
    var output = relativeTime$1(this, !withSuffix, locale);

    if (withSuffix) {
        output = locale.pastFuture(+this, output);
    }

    return locale.postformat(output);
}

var abs$1 = Math.abs;

function toISOString$1() {
    // for ISO strings we do not use the normal bubbling rules:
    //  * milliseconds bubble up until they become hours
    //  * days do not bubble at all
    //  * months bubble up until they become years
    // This is because there is no context-free conversion between hours and days
    // (think of clock changes)
    // and also not between days and months (28-31 days per month)
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var seconds = abs$1(this._milliseconds) / 1000;
    var days         = abs$1(this._days);
    var months       = abs$1(this._months);
    var minutes, hours, years;

    // 3600 seconds -> 60 minutes -> 1 hour
    minutes           = absFloor(seconds / 60);
    hours             = absFloor(minutes / 60);
    seconds %= 60;
    minutes %= 60;

    // 12 months -> 1 year
    years  = absFloor(months / 12);
    months %= 12;


    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
    var Y = years;
    var M = months;
    var D = days;
    var h = hours;
    var m = minutes;
    var s = seconds;
    var total = this.asSeconds();

    if (!total) {
        // this is the same as C#'s (Noda) and python (isodate)...
        // but not other JS (goog.date)
        return 'P0D';
    }

    return (total < 0 ? '-' : '') +
        'P' +
        (Y ? Y + 'Y' : '') +
        (M ? M + 'M' : '') +
        (D ? D + 'D' : '') +
        ((h || m || s) ? 'T' : '') +
        (h ? h + 'H' : '') +
        (m ? m + 'M' : '') +
        (s ? s + 'S' : '');
}

var proto$2 = Duration.prototype;

proto$2.isValid        = isValid$1;
proto$2.abs            = abs;
proto$2.add            = add$1;
proto$2.subtract       = subtract$1;
proto$2.as             = as;
proto$2.asMilliseconds = asMilliseconds;
proto$2.asSeconds      = asSeconds;
proto$2.asMinutes      = asMinutes;
proto$2.asHours        = asHours;
proto$2.asDays         = asDays;
proto$2.asWeeks        = asWeeks;
proto$2.asMonths       = asMonths;
proto$2.asYears        = asYears;
proto$2.valueOf        = valueOf$1;
proto$2._bubble        = bubble;
proto$2.get            = get$2;
proto$2.milliseconds   = milliseconds;
proto$2.seconds        = seconds;
proto$2.minutes        = minutes;
proto$2.hours          = hours;
proto$2.days           = days;
proto$2.weeks          = weeks;
proto$2.months         = months;
proto$2.years          = years;
proto$2.humanize       = humanize;
proto$2.toISOString    = toISOString$1;
proto$2.toString       = toISOString$1;
proto$2.toJSON         = toISOString$1;
proto$2.locale         = locale;
proto$2.localeData     = localeData;

// Deprecations
proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
proto$2.lang = lang;

// Side effect imports

// FORMATTING

addFormatToken('X', 0, 0, 'unix');
addFormatToken('x', 0, 0, 'valueOf');

// PARSING

addRegexToken('x', matchSigned);
addRegexToken('X', matchTimestamp);
addParseToken('X', function (input, array, config) {
    config._d = new Date(parseFloat(input, 10) * 1000);
});
addParseToken('x', function (input, array, config) {
    config._d = new Date(toInt(input));
});

// Side effect imports


hooks.version = '2.18.1';

setHookCallback(createLocal);

hooks.fn                    = proto;
hooks.min                   = min;
hooks.max                   = max;
hooks.now                   = now;
hooks.utc                   = createUTC;
hooks.unix                  = createUnix;
hooks.months                = listMonths;
hooks.isDate                = isDate;
hooks.locale                = getSetGlobalLocale;
hooks.invalid               = createInvalid;
hooks.duration              = createDuration;
hooks.isMoment              = isMoment;
hooks.weekdays              = listWeekdays;
hooks.parseZone             = createInZone;
hooks.localeData            = getLocale;
hooks.isDuration            = isDuration;
hooks.monthsShort           = listMonthsShort;
hooks.weekdaysMin           = listWeekdaysMin;
hooks.defineLocale          = defineLocale;
hooks.updateLocale          = updateLocale;
hooks.locales               = listLocales;
hooks.weekdaysShort         = listWeekdaysShort;
hooks.normalizeUnits        = normalizeUnits;
hooks.relativeTimeRounding = getSetRelativeTimeRounding;
hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks.calendarFormat        = getCalendarFormat;
hooks.prototype             = proto;

return hooks;

})));

!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define('echarts',[],e):"object"==typeof exports?exports.echarts=e():t.echarts=e()}(this,function(){return function(t){function e(n){if(i[n])return i[n].exports;var a=i[n]={exports:{},id:n,loaded:!1};return t[n].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){t.exports=i(2),i(113),i(107),i(117),i(197),i(339),i(327),i(354),i(301),i(297),i(293),i(334),i(344),i(278),i(283),i(290),i(322),i(314),i(338),i(349),i(289),i(213),i(214),i(221),i(240),i(58),i(381),i(378),i(259),i(260),i(369),i(376),i(231),i(203),i(395),i(224),i(223),i(222),i(385),i(232),i(247)},function(t,e){function i(t){if(null==t||"object"!=typeof t)return t;var e=t,n=G.call(t);if("[object Array]"===n){e=[];for(var a=0,o=t.length;a<o;a++)e[a]=i(t[a])}else if(B[n]){var r=t.constructor;if(t.constructor.from)e=r.from(t);else{e=new r(t.length);for(var a=0,o=t.length;a<o;a++)e[a]=i(t[a])}}else if(!V[n]&&!z(t)&&!I(t)){e={};for(var s in t)t.hasOwnProperty(s)&&(e[s]=i(t[s]))}return e}function n(t,e,a){if(!S(e)||!S(t))return a?i(e):t;for(var o in e)if(e.hasOwnProperty(o)){var r=t[o],s=e[o];!S(s)||!S(r)||_(s)||_(r)||I(s)||I(r)||M(s)||M(r)||z(s)||z(r)?!a&&o in t||(t[o]=i(e[o],!0)):n(r,s,a)}return t}function a(t,e){for(var i=t[0],a=1,o=t.length;a<o;a++)i=n(i,t[a],e);return i}function o(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);return t}function r(t,e,i){for(var n in e)e.hasOwnProperty(n)&&(i?null!=e[n]:null==t[n])&&(t[n]=e[n]);return t}function s(){return document.createElement("canvas")}function l(){return N||(N=$.createCanvas().getContext("2d")),N}function u(t,e){if(t){if(t.indexOf)return t.indexOf(e);for(var i=0,n=t.length;i<n;i++)if(t[i]===e)return i}return-1}function h(t,e){function i(){}var n=t.prototype;i.prototype=e.prototype,t.prototype=new i;for(var a in n)t.prototype[a]=n[a];t.prototype.constructor=t,t.superClass=e}function c(t,e,i){t="prototype"in t?t.prototype:t,e="prototype"in e?e.prototype:e,r(t,e,i)}function d(t){if(t)return"string"!=typeof t&&"number"==typeof t.length}function f(t,e,i){if(t&&e)if(t.forEach&&t.forEach===W)t.forEach(e,i);else if(t.length===+t.length)for(var n=0,a=t.length;n<a;n++)e.call(i,t[n],n,t);else for(var o in t)t.hasOwnProperty(o)&&e.call(i,t[o],o,t)}function p(t,e,i){if(t&&e){if(t.map&&t.map===q)return t.map(e,i);for(var n=[],a=0,o=t.length;a<o;a++)n.push(e.call(i,t[a],a,t));return n}}function g(t,e,i,n){if(t&&e){if(t.reduce&&t.reduce===j)return t.reduce(e,i,n);for(var a=0,o=t.length;a<o;a++)i=e.call(n,i,t[a],a,t);return i}}function m(t,e,i){if(t&&e){if(t.filter&&t.filter===F)return t.filter(e,i);for(var n=[],a=0,o=t.length;a<o;a++)e.call(i,t[a],a,t)&&n.push(t[a]);return n}}function v(t,e,i){if(t&&e)for(var n=0,a=t.length;n<a;n++)if(e.call(i,t[n],n,t))return t[n]}function y(t,e){var i=Z.call(arguments,2);return function(){return t.apply(e,i.concat(Z.call(arguments)))}}function x(t){var e=Z.call(arguments,1);return function(){return t.apply(this,e.concat(Z.call(arguments)))}}function _(t){return"[object Array]"===G.call(t)}function b(t){return"function"==typeof t}function w(t){return"[object String]"===G.call(t)}function S(t){var e=typeof t;return"function"===e||!!t&&"object"==e}function M(t){return!!V[G.call(t)]}function I(t){return"object"==typeof t&&"number"==typeof t.nodeType&&"object"==typeof t.ownerDocument}function T(t){return t!==t}function A(t){for(var e=0,i=arguments.length;e<i;e++)if(null!=arguments[e])return arguments[e]}function C(t,e){return null!=t?t:e}function L(t,e,i){return null!=t?t:null!=e?e:i}function D(){return Function.call.apply(Z,arguments)}function P(t){if("number"==typeof t)return[t,t,t,t];var e=t.length;return 2===e?[t[0],t[1],t[0],t[1]]:3===e?[t[0],t[1],t[2],t[1]]:t}function k(t,e){if(!t)throw new Error(e)}function O(t){t[U]=!0}function z(t){return t[U]}function E(t){t&&f(t,function(t,e){this.set(e,t)},this)}function R(t){return new E(t)}var N,V={"[object Function]":1,"[object RegExp]":1,"[object Date]":1,"[object Error]":1,"[object CanvasGradient]":1,"[object CanvasPattern]":1,"[object Image]":1,"[object Canvas]":1},B={"[object Int8Array]":1,"[object Uint8Array]":1,"[object Uint8ClampedArray]":1,"[object Int16Array]":1,"[object Uint16Array]":1,"[object Int32Array]":1,"[object Uint32Array]":1,"[object Float32Array]":1,"[object Float64Array]":1},G=Object.prototype.toString,H=Array.prototype,W=H.forEach,F=H.filter,Z=H.slice,q=H.map,j=H.reduce,U="__ec_primitive__",X="_ec_",Y=4;E.prototype={constructor:E,get:function(t){return this[X+t]},set:function(t,e){return this[X+t]=e,e},each:function(t,e){void 0!==e&&(t=y(t,e));for(var i in this)this.hasOwnProperty(i)&&t(this[i],i.slice(Y))},removeKey:function(t){delete this[X+t]}};var $={inherits:h,mixin:c,clone:i,merge:n,mergeAll:a,extend:o,defaults:r,getContext:l,createCanvas:s,indexOf:u,slice:D,find:v,isArrayLike:d,each:f,map:p,reduce:g,filter:m,bind:y,curry:x,isArray:_,isString:w,isObject:S,isFunction:b,isBuiltInObject:M,isDom:I,eqNaN:T,retrieve:A,retrieve2:C,retrieve3:L,assert:k,setAsPrimitive:O,createHashMap:R,normalizeCssArray:P,noop:function(){}};t.exports=$},function(t,e,i){function n(t){return function(e,i,n){e=e&&e.toLowerCase(),B.prototype[t].call(this,e,i,n)}}function a(){B.call(this)}function o(t,e,i){function n(t,e){return t.prio-e.prio}i=i||{},"string"==typeof e&&(e=ut[e]),this.id,this.group,this._dom=t;var o=this._zr=R.init(t,{renderer:i.renderer||"canvas",devicePixelRatio:i.devicePixelRatio,width:i.width,height:i.height});this._throttledZrFlush=E.throttle(N.bind(o.flush,o),17);var e=N.clone(e);e&&C(e,!0),this._theme=e,this._chartsViews=[],this._chartsMap={},this._componentsViews=[],this._componentsMap={},this._coordSysMgr=new T,this._api=b(this),B.call(this),this._messageCenter=new a,this._initEvents(),this.resize=N.bind(this.resize,this),this._pendingActions=[],G(lt,n),G(ot,n),o.animation.on("frame",this._onframe,this),N.setAsPrimitive(this)}function r(t,e,i){var n,a=this._model,o=this._coordSysMgr.getCoordinateSystems();e=z.parseFinder(a,e);for(var r=0;r<o.length;r++){var s=o[r];if(s[t]&&null!=(n=s[t](a,e,i)))return n}}function s(t,e,i,n,a){function o(n){n&&n.__alive&&n[e]&&n[e](n.__model,r,t._api,i)}var r=t._model;if(!n)return void H(t._componentsViews.concat(t._chartsViews),o);var s={};s[n+"Id"]=i[n+"Id"],s[n+"Index"]=i[n+"Index"],s[n+"Name"]=i[n+"Name"];var l={mainType:n,query:s};a&&(l.subType=a),r&&r.eachComponent(l,function(e,i){o(t["series"===n?"_chartsMap":"_componentsMap"][e.__viewId])},t)}function l(t,e){var i=t.type,n=t.escapeConnect,a=nt[i],o=a.actionInfo,r=(o.update||"update").split(":"),l=r.pop();r=null!=r[0]&&W(r[0]),this[$]=!0;var u=[t],h=!1;t.batch&&(h=!0,u=N.map(t.batch,function(e){return e=N.defaults(N.extend({},e),t),e.batch=null,e}));var c,d=[],f="highlight"===i||"downplay"===i;H(u,function(t){c=a.action(t,this._model,this._api),c=c||N.extend({},t),c.type=o.event||c.type,d.push(c),f?s(this,l,t,"series"):r&&s(this,l,t,r.main,r.sub)},this),"none"===l||f||r||(this[J]?(et.prepareAndUpdate.call(this,t),this[J]=!1):et[l].call(this,t)),c=h?{type:o.event||i,escapeConnect:n,batch:d}:d[0],this[$]=!1,!e&&this._messageCenter.trigger(c.type,c)}function u(t){for(var e=this._pendingActions;e.length;){var i=e.shift();l.call(this,i,t)}}function h(t){!t&&this.trigger("updated")}function c(t,e,i){var n=this._api;H(this._componentsViews,function(a){var o=a.__model;a[t](o,e,n,i),_(o,a)},this),e.eachSeries(function(a,o){var r=this._chartsMap[a.__viewId];r[t](a,e,n,i),_(a,r),x(a,r)},this),y(this._zr,e),H(st,function(t){t(e,n)})}function d(t,e){for(var i="component"===t,n=i?this._componentsViews:this._chartsViews,a=i?this._componentsMap:this._chartsMap,o=this._zr,r=0;r<n.length;r++)n[r].__alive=!1;e[i?"eachComponent":"eachSeries"](function(t,r){if(i){if("series"===t)return}else r=t;var s="_ec_"+r.id+"_"+r.type,l=a[s];if(!l){var u=W(r.type),h=i?P.getClass(u.main,u.sub):k.getClass(u.sub);if(!h)return;l=new h,l.init(e,this._api),a[s]=l,n.push(l),o.add(l.group)}r.__viewId=l.__id=s,l.__alive=!0,l.__model=r,l.group.__ecComponentInfo={mainType:r.mainType,index:r.componentIndex}},this);for(var r=0;r<n.length;){var s=n[r];s.__alive?r++:(o.remove(s.group),s.dispose(e,this._api),n.splice(r,1),delete a[s.__id],s.__id=s.group.__ecComponentInfo=null)}}function f(t,e){H(ot,function(i){i.func(t,e)})}function p(t){var e={};t.eachSeries(function(t){var i=t.get("stack"),n=t.getData();if(i&&"list"===n.type){var a=e[i];e.hasOwnProperty(i)&&a&&(n.stackedOn=a),e[i]=n}})}function g(t,e){var i=this._api;H(lt,function(n){n.isLayout&&n.func(t,i,e)})}function m(t,e,i){var n=this._api;t.clearColorPalette(),t.eachSeries(function(t){t.clearColorPalette()}),H(lt,function(a){(!i||!a.isLayout)&&a.func(t,n,e)})}function v(t,e){var i=this._api;H(this._componentsViews,function(n){var a=n.__model;n.render(a,t,i,e),_(a,n)},this),H(this._chartsViews,function(t){t.__alive=!1},this),t.eachSeries(function(n,a){var o=this._chartsMap[n.__viewId];o.__alive=!0,o.render(n,t,i,e),o.group.silent=!!n.get("silent"),_(n,o),x(n,o)},this),y(this._zr,t),H(this._chartsViews,function(e){e.__alive||e.remove(t,i)},this)}function y(t,e){var i=t.storage,n=0;i.traverse(function(t){t.isGroup||n++}),n>e.get("hoverLayerThreshold")&&!S.node&&i.traverse(function(t){t.isGroup||(t.useHoverLayer=!0)})}function x(t,e){var i=0;e.group.traverse(function(t){"group"===t.type||t.ignore||i++});var n=+t.get("progressive"),a=i>t.get("progressiveThreshold")&&n&&!S.node;a&&e.group.traverse(function(t){t.isGroup||(t.progressive=a?Math.floor(i++/n):-1,a&&t.stopAnimation(!0))});var o=t.get("blendMode")||null;e.group.traverse(function(t){t.isGroup||t.setStyle("blend",o)})}function _(t,e){var i=t.get("z"),n=t.get("zlevel");e.group.traverse(function(t){"group"!==t.type&&(null!=i&&(t.z=i),null!=n&&(t.zlevel=n))})}function b(t){var e=t._coordSysMgr;return N.extend(new I(t),{getCoordinateSystems:N.bind(e.getCoordinateSystems,e),getComponentByElement:function(e){for(;e;){var i=e.__ecComponentInfo;if(null!=i)return t._model.getComponent(i.mainType,i.index);e=e.parent}}})}function w(t){function e(t,e){for(var i=0;i<t.length;i++){var n=t[i];n[o]=e}}var i=0,n=1,a=2,o="__connectUpdateStatus";N.each(at,function(r,s){t._messageCenter.on(s,function(r){if(dt[t.group]&&t[o]!==i){if(r&&r.escapeConnect)return;var s=t.makeActionFromEvent(r),l=[];N.each(ct,function(e){e!==t&&e.group===t.group&&l.push(e)}),e(l,i),H(l,function(t){t[o]!==n&&t.dispatchAction(s)}),e(l,a)}})})}/*!
	 * ECharts, a javascript interactive chart library.
	 *
	 * Copyright (c) 2015, Baidu Inc.
	 * All rights reserved.
	 *
	 * LICENSE
	 * https://github.com/ecomfe/echarts/blob/master/LICENSE.txt
	 */
var S=i(10),M=i(144),I=i(106),T=i(26),A=i(145),C=i(152),L=i(13),D=i(17),P=i(68),k=i(30),O=i(3),z=i(5),E=i(37),R=i(93),N=i(1),V=i(22),B=i(23),G=i(52),H=N.each,W=L.parseClassType,F=1e3,Z=5e3,q=1e3,j=2e3,U=3e3,X=4e3,Y=5e3,$="__flagInMainProcess",K="__hasGradientOrPatternBg",J="__optionUpdated",Q=/^[a-zA-Z0-9_]+$/;a.prototype.on=n("on"),a.prototype.off=n("off"),a.prototype.one=n("one"),N.mixin(a,B);var tt=o.prototype;tt._onframe=function(){if(this[J]){var t=this[J].silent;this[$]=!0,et.prepareAndUpdate.call(this),this[$]=!1,this[J]=!1,u.call(this,t),h.call(this,t)}},tt.getDom=function(){return this._dom},tt.getZr=function(){return this._zr},tt.setOption=function(t,e,i){var n;if(N.isObject(e)&&(i=e.lazyUpdate,n=e.silent,e=e.notMerge),this[$]=!0,!this._model||e){var a=new A(this._api),o=this._theme,r=this._model=new M(null,null,o,a);r.init(null,null,o,a)}this._model.setOption(t,rt),i?(this[J]={silent:n},this[$]=!1):(et.prepareAndUpdate.call(this),this._zr.flush(),this[J]=!1,this[$]=!1,u.call(this,n),h.call(this,n))},tt.setTheme=function(){console.log("ECharts#setTheme() is DEPRECATED in ECharts 3.0")},tt.getModel=function(){return this._model},tt.getOption=function(){return this._model&&this._model.getOption()},tt.getWidth=function(){return this._zr.getWidth()},tt.getHeight=function(){return this._zr.getHeight()},tt.getDevicePixelRatio=function(){return this._zr.painter.dpr||window.devicePixelRatio||1},tt.getRenderedCanvas=function(t){if(S.canvasSupported){t=t||{},t.pixelRatio=t.pixelRatio||1,t.backgroundColor=t.backgroundColor||this._model.get("backgroundColor");var e=this._zr,i=e.storage.getDisplayList();return N.each(i,function(t){t.stopAnimation(!0)}),e.painter.getRenderedCanvas(t)}},tt.getDataURL=function(t){t=t||{};var e=t.excludeComponents,i=this._model,n=[],a=this;H(e,function(t){i.eachComponent({mainType:t},function(t){var e=a._componentsMap[t.__viewId];e.group.ignore||(n.push(e),e.group.ignore=!0)})});var o=this.getRenderedCanvas(t).toDataURL("image/"+(t&&t.type||"png"));return H(n,function(t){t.group.ignore=!1}),o},tt.getConnectedDataURL=function(t){if(S.canvasSupported){var e=this.group,i=Math.min,n=Math.max,a=1/0;if(dt[e]){var o=a,r=a,s=-a,l=-a,u=[],h=t&&t.pixelRatio||1;N.each(ct,function(a,h){if(a.group===e){var c=a.getRenderedCanvas(N.clone(t)),d=a.getDom().getBoundingClientRect();o=i(d.left,o),r=i(d.top,r),s=n(d.right,s),l=n(d.bottom,l),u.push({dom:c,left:d.left,top:d.top})}}),o*=h,r*=h,s*=h,l*=h;var c=s-o,d=l-r,f=N.createCanvas();f.width=c,f.height=d;var p=R.init(f);return H(u,function(t){var e=new O.Image({style:{x:t.left*h-o,y:t.top*h-r,image:t.dom}});p.add(e)}),p.refreshImmediately(),f.toDataURL("image/"+(t&&t.type||"png"))}return this.getDataURL(t)}},tt.convertToPixel=N.curry(r,"convertToPixel"),tt.convertFromPixel=N.curry(r,"convertFromPixel"),tt.containPixel=function(t,e){var i,n=this._model;return t=z.parseFinder(n,t),N.each(t,function(t,n){n.indexOf("Models")>=0&&N.each(t,function(t){var a=t.coordinateSystem;if(a&&a.containPoint)i|=!!a.containPoint(e);else if("seriesModels"===n){var o=this._chartsMap[t.__viewId];o&&o.containPoint&&(i|=o.containPoint(e,t))}},this)},this),!!i},tt.getVisual=function(t,e){var i=this._model;t=z.parseFinder(i,t,{defaultMainType:"series"});var n=t.seriesModel,a=n.getData(),o=t.hasOwnProperty("dataIndexInside")?t.dataIndexInside:t.hasOwnProperty("dataIndex")?a.indexOfRawIndex(t.dataIndex):null;return null!=o?a.getItemVisual(o,e):a.getVisual(e)},tt.getViewOfComponentModel=function(t){return this._componentsMap[t.__viewId]},tt.getViewOfSeriesModel=function(t){return this._chartsMap[t.__viewId]};var et={update:function(t){var e=this._model,i=this._api,n=this._coordSysMgr,a=this._zr;if(e){e.restoreData(),n.create(this._model,this._api),f.call(this,e,i),p.call(this,e),n.update(e,i),m.call(this,e,t),v.call(this,e,t);var o=e.get("backgroundColor")||"transparent",r=a.painter;if(r.isSingleCanvas&&r.isSingleCanvas())a.configLayer(0,{clearColor:o});else{if(!S.canvasSupported){var s=V.parse(o);o=V.stringify(s,"rgb"),0===s[3]&&(o="transparent")}o.colorStops||o.image?(a.configLayer(0,{clearColor:o}),this[K]=!0,this._dom.style.background="transparent"):(this[K]&&a.configLayer(0,{clearColor:null}),this[K]=!1,this._dom.style.background=o)}H(st,function(t){t(e,i)})}},updateView:function(t){var e=this._model;e&&(e.eachSeries(function(t){t.getData().clearAllVisual()}),m.call(this,e,t),c.call(this,"updateView",e,t))},updateVisual:function(t){var e=this._model;e&&(e.eachSeries(function(t){t.getData().clearAllVisual()}),m.call(this,e,t,!0),c.call(this,"updateVisual",e,t))},updateLayout:function(t){var e=this._model;e&&(g.call(this,e,t),c.call(this,"updateLayout",e,t))},prepareAndUpdate:function(t){var e=this._model;d.call(this,"component",e),d.call(this,"chart",e),et.update.call(this,t)}};tt.resize=function(t){this[$]=!0,this._zr.resize(t);var e=this._model&&this._model.resetOption("media"),i=e?"prepareAndUpdate":"update";et[i].call(this),this._loadingFX&&this._loadingFX.resize(),this[$]=!1;var n=t&&t.silent;u.call(this,n),h.call(this,n)},tt.showLoading=function(t,e){if(N.isObject(t)&&(e=t,t=""),t=t||"default",this.hideLoading(),ht[t]){var i=ht[t](this._api,e),n=this._zr;this._loadingFX=i,n.add(i)}},tt.hideLoading=function(){this._loadingFX&&this._zr.remove(this._loadingFX),this._loadingFX=null},tt.makeActionFromEvent=function(t){var e=N.extend({},t);return e.type=at[t.type],e},tt.dispatchAction=function(t,e){if(N.isObject(e)||(e={silent:!!e}),nt[t.type]&&this._model){if(this[$])return void this._pendingActions.push(t);l.call(this,t,e.silent),e.flush?this._zr.flush(!0):e.flush!==!1&&S.browser.weChat&&this._throttledZrFlush(),u.call(this,e.silent),h.call(this,e.silent)}},tt.on=n("on"),tt.off=n("off"),tt.one=n("one");var it=["click","dblclick","mouseover","mouseout","mousemove","mousedown","mouseup","globalout","contextmenu"];tt._initEvents=function(){H(it,function(t){this._zr.on(t,function(e){var i,n=this.getModel(),a=e.target;if("globalout"===t)i={};else if(a&&null!=a.dataIndex){var o=a.dataModel||n.getSeriesByIndex(a.seriesIndex);i=o&&o.getDataParams(a.dataIndex,a.dataType)||{}}else a&&a.eventData&&(i=N.extend({},a.eventData));i&&(i.event=e,i.type=t,this.trigger(t,i))},this)},this),H(at,function(t,e){this._messageCenter.on(e,function(t){this.trigger(e,t)},this)},this)},tt.isDisposed=function(){return this._disposed},tt.clear=function(){this.setOption({series:[]},!0)},tt.dispose=function(){if(!this._disposed){this._disposed=!0;var t=this._api,e=this._model;H(this._componentsViews,function(i){i.dispose(e,t)}),H(this._chartsViews,function(i){i.dispose(e,t)}),this._zr.dispose(),delete ct[this.id]}},N.mixin(o,B);var nt={},at={},ot=[],rt=[],st=[],lt=[],ut={},ht={},ct={},dt={},ft=new Date-0,pt=new Date-0,gt="_echarts_instance_",mt={version:"3.7.2",dependencies:{zrender:"3.6.2"}};mt.init=function(t,e,i){var n=mt.getInstanceByDom(t);if(n)return n;var a=new o(t,e,i);return a.id="ec_"+ft++,ct[a.id]=a,t.setAttribute?t.setAttribute(gt,a.id):t[gt]=a.id,w(a),a},mt.connect=function(t){if(N.isArray(t)){var e=t;t=null,N.each(e,function(e){null!=e.group&&(t=e.group)}),t=t||"g_"+pt++,N.each(e,function(e){e.group=t})}return dt[t]=!0,t},mt.disConnect=function(t){dt[t]=!1},mt.disconnect=mt.disConnect,mt.dispose=function(t){"string"==typeof t?t=ct[t]:t instanceof o||(t=mt.getInstanceByDom(t)),t instanceof o&&!t.isDisposed()&&t.dispose()},mt.getInstanceByDom=function(t){var e;return e=t.getAttribute?t.getAttribute(gt):t[gt],ct[e]},mt.getInstanceById=function(t){return ct[t]},mt.registerTheme=function(t,e){ut[t]=e},mt.registerPreprocessor=function(t){rt.push(t)},mt.registerProcessor=function(t,e){"function"==typeof t&&(e=t,t=F),ot.push({prio:t,func:e})},mt.registerPostUpdate=function(t){st.push(t)},mt.registerAction=function(t,e,i){"function"==typeof e&&(i=e,e="");var n=N.isObject(t)?t.type:[t,t={event:e}][0];t.event=(t.event||n).toLowerCase(),e=t.event,N.assert(Q.test(n)&&Q.test(e)),nt[n]||(nt[n]={action:i,actionInfo:t}),at[e]=n},mt.registerCoordinateSystem=function(t,e){T.register(t,e)},mt.getCoordinateSystemDimensions=function(t){var e=T.get(t);if(e)return e.getDimensionsInfo?e.getDimensionsInfo():e.dimensions.slice()},mt.registerLayout=function(t,e){"function"==typeof t&&(e=t,t=q),lt.push({prio:t,func:e,isLayout:!0})},mt.registerVisual=function(t,e){"function"==typeof t&&(e=t,t=U),lt.push({prio:t,func:e})},mt.registerLoading=function(t,e){ht[t]=e},mt.extendComponentModel=function(t){return L.extend(t)},mt.extendComponentView=function(t){return P.extend(t)},mt.extendSeriesModel=function(t){return D.extend(t)},mt.extendChartView=function(t){return k.extend(t)},mt.setCanvasCreator=function(t){N.createCanvas=t},mt.registerVisual(j,i(158)),mt.registerPreprocessor(C),mt.registerLoading("default",i(143)),mt.registerAction({type:"highlight",event:"highlight",update:"highlight"},N.noop),mt.registerAction({type:"downplay",event:"downplay",update:"downplay"},N.noop),mt.zrender=R,mt.List=i(14),mt.Model=i(11),mt.Axis=i(33),mt.graphic=i(3),mt.number=i(4),mt.format=i(7),mt.throttle=E.throttle,mt.matrix=i(19),mt.vector=i(6),mt.color=i(22),mt.util={},H(["map","each","filter","indexOf","inherits","reduce","filter","bind","curry","isArray","isString","isObject","isFunction","extend","defaults","clone","merge"],function(t){mt.util[t]=N[t]}),mt.helper=i(142),mt.PRIORITY={PROCESSOR:{FILTER:F,STATISTIC:Z},VISUAL:{LAYOUT:q,GLOBAL:j,CHART:U,COMPONENT:X,BRUSH:Y}},t.exports=mt},function(t,e,i){"use strict";function n(t){return null!=t&&"none"!=t}function a(t){return"string"==typeof t?I.lift(t,-.1):t}function o(t){if(t.__hoverStlDirty){var e=t.style.stroke,i=t.style.fill,o=t.__hoverStl;o.fill=o.fill||(n(i)?a(i):null),o.stroke=o.stroke||(n(e)?a(e):null);var r={};for(var s in o)null!=o[s]&&(r[s]=t.style[s]);t.__normalStl=r,t.__hoverStlDirty=!1}}function r(t){if(!t.__isHover){if(o(t),t.useHoverLayer)t.__zr&&t.__zr.addHover(t,t.__hoverStl);else{var e=t.style,i=e.insideRollbackOpt;i&&_(e),e.extendFrom(t.__hoverStl),i&&(x(e,e.insideOriginalTextPosition,i),null==e.textFill&&(e.textFill=i.autoColor)),t.dirty(!1),t.z2+=1}t.__isHover=!0}}function s(t){if(t.__isHover){var e=t.__normalStl;t.useHoverLayer?t.__zr&&t.__zr.removeHover(t):(e&&t.setStyle(e),t.z2-=1),t.__isHover=!1}}function l(t){"group"===t.type?t.traverse(function(t){"group"!==t.type&&r(t)}):r(t)}function u(t){"group"===t.type?t.traverse(function(t){"group"!==t.type&&s(t)}):s(t)}function h(t,e){t.__hoverStl=t.hoverStyle||e||{},t.__hoverStlDirty=!0,t.__isHover&&o(t)}function c(t){this.__hoverSilentOnTouch&&t.zrByTouch||!this.__isEmphasis&&l(this)}function d(t){this.__hoverSilentOnTouch&&t.zrByTouch||!this.__isEmphasis&&u(this)}function f(){this.__isEmphasis=!0,l(this)}function p(){this.__isEmphasis=!1,u(this)}function g(t,e,i,n){if(i=i||O,i.isRectText){var a=e.getShallow("position")||(n?null:"inside");"outside"===a&&(a="top"),t.textPosition=a,t.textOffset=e.getShallow("offset");var o=e.getShallow("rotate");null!=o&&(o*=Math.PI/180),t.textRotation=o,t.textDistance=w.retrieve2(e.getShallow("distance"),n?null:5)}var r,s=e.ecModel,l=s&&s.option.textStyle,u=m(e);if(u){r={};for(var h in u)if(u.hasOwnProperty(h)){var c=e.getModel(["rich",h]);v(r[h]={},c,l,i,n)}}return t.rich=r,v(t,e,l,i,n,!0),i.forceRich&&!i.textStyle&&(i.textStyle={}),t}function m(t){for(var e;t&&t!==t.ecModel;){var i=(t.option||O).rich;if(i){e=e||{};for(var n in i)i.hasOwnProperty(n)&&(e[n]=1)}t=t.parentModel}return e}function v(t,e,i,n,a,o){if(i=!a&&i||O,t.textFill=y(e.getShallow("color"),n)||i.color,t.textStroke=y(e.getShallow("textBorderColor"),n)||i.textBorderColor,t.textStrokeWidth=w.retrieve2(e.getShallow("textBorderWidth"),i.textBorderWidth),!a){if(o){var r=t.textPosition;t.insideRollback=x(t,r,n),t.insideOriginalTextPosition=r,t.insideRollbackOpt=n}null==t.textFill&&(t.textFill=n.autoColor)}t.fontStyle=e.getShallow("fontStyle")||i.fontStyle,t.fontWeight=e.getShallow("fontWeight")||i.fontWeight,t.fontSize=e.getShallow("fontSize")||i.fontSize,t.fontFamily=e.getShallow("fontFamily")||i.fontFamily,t.textAlign=e.getShallow("align"),t.textVerticalAlign=e.getShallow("verticalAlign")||e.getShallow("baseline"),t.textLineHeight=e.getShallow("lineHeight"),t.textWidth=e.getShallow("width"),t.textHeight=e.getShallow("height"),t.textTag=e.getShallow("tag"),o&&n.disableBox||(t.textBackgroundColor=y(e.getShallow("backgroundColor"),n),t.textPadding=e.getShallow("padding"),t.textBorderColor=y(e.getShallow("borderColor"),n),t.textBorderWidth=e.getShallow("borderWidth"),t.textBorderRadius=e.getShallow("borderRadius"),t.textBoxShadowColor=e.getShallow("shadowColor"),t.textBoxShadowBlur=e.getShallow("shadowBlur"),t.textBoxShadowOffsetX=e.getShallow("shadowOffsetX"),t.textBoxShadowOffsetY=e.getShallow("shadowOffsetY")),t.textShadowColor=e.getShallow("textShadowColor")||i.textShadowColor,t.textShadowBlur=e.getShallow("textShadowBlur")||i.textShadowBlur,t.textShadowOffsetX=e.getShallow("textShadowOffsetX")||i.textShadowOffsetX,t.textShadowOffsetY=e.getShallow("textShadowOffsetY")||i.textShadowOffsetY}function y(t,e){return"auto"!==t?t:e&&e.autoColor?e.autoColor:null}function x(t,e,i){var n,a=i.useInsideStyle;return null==t.textFill&&a!==!1&&(a===!0||i.isRectText&&e&&"string"==typeof e&&e.indexOf("inside")>=0)&&(n={textFill:null,textStroke:t.textStroke,textStrokeWidth:t.textStrokeWidth},t.textFill="#fff",null==t.textStroke&&(t.textStroke=i.autoColor,null==t.textStrokeWidth&&(t.textStrokeWidth=2))),n}function _(t){var e=t.insideRollback;e&&(t.textFill=e.textFill,t.textStroke=e.textStroke,t.textStrokeWidth=e.textStrokeWidth)}function b(t,e,i,n,a,o){"function"==typeof a&&(o=a,a=null);var r=n&&n.isAnimationEnabled();if(r){var s=t?"Update":"",l=n.getShallow("animationDuration"+s),u=n.getShallow("animationEasing"+s),h=n.getShallow("animationDelay"+s);"function"==typeof h&&(h=h(a,n.getAnimationDelayParams?n.getAnimationDelayParams(e,a):null)),"function"==typeof l&&(l=l(a)),l>0?e.animateTo(i,l,h||0,u,o,!!o):(e.stopAnimation(),e.attr(i),o&&o())}else e.stopAnimation(),e.attr(i),o&&o()}var w=i(1),S=i(186),M=i(8),I=i(22),T=i(19),A=i(6),C=i(61),L=i(12),D=Math.round,P=Math.max,k=Math.min,O={},z={};z.Group=i(36),z.Image=i(55),z.Text=i(91),z.Circle=i(177),z.Sector=i(183),z.Ring=i(182),z.Polygon=i(179),z.Polyline=i(180),z.Rect=i(181),z.Line=i(178),z.BezierCurve=i(176),z.Arc=i(175),z.CompoundPath=i(171),z.LinearGradient=i(105),z.RadialGradient=i(172),z.BoundingRect=L,z.extendShape=function(t){return M.extend(t)},z.extendPath=function(t,e){return S.extendFromString(t,e)},z.makePath=function(t,e,i,n){var a=S.createFromString(t,e),o=a.getBoundingRect();if(i){var r=o.width/o.height;if("center"===n){var s,l=i.height*r;l<=i.width?s=i.height:(l=i.width,s=l/r);var u=i.x+i.width/2,h=i.y+i.height/2;i.x=u-l/2,i.y=h-s/2,i.width=l,i.height=s}z.resizePath(a,i)}return a},z.mergePath=S.mergePath,z.resizePath=function(t,e){if(t.applyTransform){var i=t.getBoundingRect(),n=i.calculateTransform(e);t.applyTransform(n)}},z.subPixelOptimizeLine=function(t){var e=t.shape,i=t.style.lineWidth;return D(2*e.x1)===D(2*e.x2)&&(e.x1=e.x2=E(e.x1,i,!0)),D(2*e.y1)===D(2*e.y2)&&(e.y1=e.y2=E(e.y1,i,!0)),t},z.subPixelOptimizeRect=function(t){var e=t.shape,i=t.style.lineWidth,n=e.x,a=e.y,o=e.width,r=e.height;return e.x=E(e.x,i,!0),e.y=E(e.y,i,!0),e.width=Math.max(E(n+o,i,!1)-e.x,0===o?0:1),e.height=Math.max(E(a+r,i,!1)-e.y,0===r?0:1),t};var E=z.subPixelOptimize=function(t,e,i){var n=D(2*t);return(n+D(e))%2===0?n/2:(n+(i?1:-1))/2};z.setHoverStyle=function(t,e,i){t.__hoverSilentOnTouch=i&&i.hoverSilentOnTouch,"group"===t.type?t.traverse(function(t){"group"!==t.type&&h(t,e)}):h(t,e),t.on("mouseover",c).on("mouseout",d),t.on("emphasis",f).on("normal",p)},z.setLabelStyle=function(t,e,i,n,a,o,r){a=a||O;var s=a.labelFetcher,l=a.labelDataIndex,u=a.labelDimIndex,h=i.getShallow("show"),c=n.getShallow("show"),d=h||c?w.retrieve2(s?s.getFormattedLabel(l,"normal",null,u):null,a.defaultText):null,f=h?d:null,p=c?w.retrieve2(s?s.getFormattedLabel(l,"emphasis",null,u):null,d):null;null==f&&null==p||(R(t,i,o,a),R(e,n,r,a,!0)),t.text=f,e.text=p};var R=z.setTextStyle=function(t,e,i,n,a){return g(t,e,n,a),i&&w.extend(t,i),t.host&&t.host.dirty&&t.host.dirty(!1),t};z.setText=function(t,e,i){var n,a={isRectText:!0};i===!1?n=!0:a.autoColor=i,g(t,e,a,n),t.host&&t.host.dirty&&t.host.dirty(!1)},z.getFont=function(t,e){var i=e||e.getModel("textStyle");return[t.fontStyle||i&&i.getShallow("fontStyle")||"",t.fontWeight||i&&i.getShallow("fontWeight")||"",(t.fontSize||i&&i.getShallow("fontSize")||12)+"px",t.fontFamily||i&&i.getShallow("fontFamily")||"sans-serif"].join(" ")},z.updateProps=function(t,e,i,n,a){b(!0,t,e,i,n,a)},z.initProps=function(t,e,i,n,a){b(!1,t,e,i,n,a)},z.getTransform=function(t,e){for(var i=T.identity([]);t&&t!==e;)T.mul(i,t.getLocalTransform(),i),t=t.parent;return i},z.applyTransform=function(t,e,i){return e&&!w.isArrayLike(e)&&(e=C.getLocalTransform(e)),i&&(e=T.invert([],e)),A.applyTransform([],t,e)},z.transformDirection=function(t,e,i){var n=0===e[4]||0===e[5]||0===e[0]?1:Math.abs(2*e[4]/e[0]),a=0===e[4]||0===e[5]||0===e[2]?1:Math.abs(2*e[4]/e[2]),o=["left"===t?-n:"right"===t?n:0,"top"===t?-a:"bottom"===t?a:0];return o=z.applyTransform(o,e,i),Math.abs(o[0])>Math.abs(o[1])?o[0]>0?"right":"left":o[1]>0?"bottom":"top"},z.groupTransition=function(t,e,i,n){function a(t){var e={};return t.traverse(function(t){!t.isGroup&&t.anid&&(e[t.anid]=t)}),e}function o(t){var e={position:A.clone(t.position),rotation:t.rotation};return t.shape&&(e.shape=w.extend({},t.shape)),e}if(t&&e){var r=a(t);e.traverse(function(t){if(!t.isGroup&&t.anid){var e=r[t.anid];if(e){var n=o(t);t.attr(o(e)),z.updateProps(t,n,i,t.dataIndex)}}})}},z.clipPointsByRect=function(t,e){return w.map(t,function(t){var i=t[0];i=P(i,e.x),i=k(i,e.x+e.width);var n=t[1];return n=P(n,e.y),n=k(n,e.y+e.height),[i,n]})},z.clipRectByRect=function(t,e){var i=P(t.x,e.x),n=k(t.x+t.width,e.x+e.width),a=P(t.y,e.y),o=k(t.y+t.height,e.y+e.height);if(n>=i&&o>=a)return{x:i,y:a,width:n-i,height:o-a}},z.createIcon=function(t,e,i){e=w.extend({rectHover:!0},e);var n=e.style={strokeNoScale:!0};if(i=i||{x:-1,y:-1,width:2,height:2},t)return 0===t.indexOf("image://")?(n.image=t.slice(8),w.defaults(n,i),new z.Image(e)):z.makePath(t.replace("path://",""),e,i,"center")},t.exports=z},function(t,e,i){function n(t){return t.replace(/^\s+/,"").replace(/\s+$/,"")}function a(t){return Math.floor(Math.log(t)/Math.LN10)}var o=i(1),r={},s=1e-4;r.linearMap=function(t,e,i,n){var a=e[1]-e[0],o=i[1]-i[0];if(0===a)return 0===o?i[0]:(i[0]+i[1])/2;if(n)if(a>0){if(t<=e[0])return i[0];if(t>=e[1])return i[1]}else{if(t>=e[0])return i[0];if(t<=e[1])return i[1]}else{if(t===e[0])return i[0];if(t===e[1])return i[1]}return(t-e[0])/a*o+i[0]},r.parsePercent=function(t,e){switch(t){case"center":case"middle":t="50%";break;case"left":case"top":t="0%";break;case"right":case"bottom":t="100%"}return"string"==typeof t?n(t).match(/%$/)?parseFloat(t)/100*e:parseFloat(t):null==t?NaN:+t},r.round=function(t,e,i){return null==e&&(e=10),e=Math.min(Math.max(0,e),20),t=(+t).toFixed(e),i?t:+t},r.asc=function(t){return t.sort(function(t,e){return t-e}),t},r.getPrecision=function(t){if(t=+t,isNaN(t))return 0;for(var e=1,i=0;Math.round(t*e)/e!==t;)e*=10,i++;return i},r.getPrecisionSafe=function(t){var e=t.toString(),i=e.indexOf("e");if(i>0){var n=+e.slice(i+1);return n<0?-n:0}var a=e.indexOf(".");return a<0?0:e.length-1-a},r.getPixelPrecision=function(t,e){var i=Math.log,n=Math.LN10,a=Math.floor(i(t[1]-t[0])/n),o=Math.round(i(Math.abs(e[1]-e[0]))/n),r=Math.min(Math.max(-a+o,0),20);return isFinite(r)?r:20},r.getPercentWithPrecision=function(t,e,i){if(!t[e])return 0;var n=o.reduce(t,function(t,e){return t+(isNaN(e)?0:e)},0);if(0===n)return 0;for(var a=Math.pow(10,i),r=o.map(t,function(t){return(isNaN(t)?0:t)/n*a*100}),s=100*a,l=o.map(r,function(t){return Math.floor(t)}),u=o.reduce(l,function(t,e){return t+e},0),h=o.map(r,function(t,e){return t-l[e]});u<s;){for(var c=Number.NEGATIVE_INFINITY,d=null,f=0,p=h.length;f<p;++f)h[f]>c&&(c=h[f],d=f);++l[d],h[d]=0,++u}return l[e]/a},r.MAX_SAFE_INTEGER=9007199254740991,r.remRadian=function(t){var e=2*Math.PI;return(t%e+e)%e},r.isRadianAroundZero=function(t){return t>-s&&t<s};var l=/^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d\d)(?::(\d\d)(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/;r.parseDate=function(t){if(t instanceof Date)return t;if("string"==typeof t){var e=l.exec(t);if(!e)return new Date(NaN);if(e[8]){var i=+e[4]||0;return"Z"!==e[8].toUpperCase()&&(i-=e[8].slice(0,3)),new Date(Date.UTC(+e[1],+(e[2]||1)-1,+e[3]||1,i,+(e[5]||0),+e[6]||0,+e[7]||0))}return new Date(+e[1],+(e[2]||1)-1,+e[3]||1,+e[4]||0,+(e[5]||0),+e[6]||0,+e[7]||0)}return null==t?new Date(NaN):new Date(Math.round(t))},r.quantity=function(t){return Math.pow(10,a(t))},r.nice=function(t,e){var i,n=a(t),o=Math.pow(10,n),r=t/o;return i=e?r<1.5?1:r<2.5?2:r<4?3:r<7?5:10:r<1?1:r<2?2:r<3?3:r<5?5:10,t=i*o,n>=-20?+t.toFixed(n<0?-n:0):t},r.reformIntervals=function(t){function e(t,i,n){return t.interval[n]<i.interval[n]||t.interval[n]===i.interval[n]&&(t.close[n]-i.close[n]===(n?-1:1)||!n&&e(t,i,1))}t.sort(function(t,i){return e(t,i,0)?-1:1});for(var i=-(1/0),n=1,a=0;a<t.length;){for(var o=t[a].interval,r=t[a].close,s=0;s<2;s++)o[s]<=i&&(o[s]=i,r[s]=s?1:1-n),i=o[s],n=r[s];o[0]===o[1]&&r[0]*r[1]!==1?t.splice(a,1):a++}return t},r.isNumeric=function(t){return t-parseFloat(t)>=0},t.exports=r},function(t,e,i){function n(t,e){return t&&t.hasOwnProperty(e)}var a=i(7),o=i(4),r=i(11),s=i(1),l=s.each,u=s.isObject,h={};h.normalizeToArray=function(t){return t instanceof Array?t:null==t?[]:[t]},h.defaultEmphasis=function(t,e){if(t)for(var i=t.emphasis=t.emphasis||{},n=t.normal=t.normal||{},a=0,o=e.length;a<o;a++){var r=e[a];!i.hasOwnProperty(r)&&n.hasOwnProperty(r)&&(i[r]=n[r])}},h.TEXT_STYLE_OPTIONS=["fontStyle","fontWeight","fontSize","fontFamily","rich","tag","color","textBorderColor","textBorderWidth","width","height","lineHeight","align","verticalAlign","baseline","shadowColor","shadowBlur","shadowOffsetX","shadowOffsetY","textShadowColor","textShadowBlur","textShadowOffsetX","textShadowOffsetY","backgroundColor","borderColor","borderWidth","borderRadius","padding"],h.getDataItemValue=function(t){return t&&(null==t.value?t:t.value)},h.isDataItemOption=function(t){return u(t)&&!(t instanceof Array)},h.converDataValue=function(t,e){var i=e&&e.type;return"ordinal"===i?t:("time"===i&&"number"!=typeof t&&null!=t&&"-"!==t&&(t=+o.parseDate(t)),null==t||""===t?NaN:+t)},h.createDataFormatModel=function(t,e){var i=new r;return s.mixin(i,h.dataFormatMixin),i.seriesIndex=e.seriesIndex,i.name=e.name||"",i.mainType=e.mainType,i.subType=e.subType,i.getData=function(){return t},i},h.dataFormatMixin={getDataParams:function(t,e){var i=this.getData(e),n=this.getRawValue(t,e),o=i.getRawIndex(t),r=i.getName(t,!0),s=i.getRawDataItem(t),l=i.getItemVisual(t,"color");return{componentType:this.mainType,componentSubType:this.subType,seriesType:"series"===this.mainType?this.subType:null,seriesIndex:this.seriesIndex,seriesId:this.id,seriesName:this.name,name:r,dataIndex:o,data:s,dataType:e,value:n,color:l,marker:a.getTooltipMarker(l),$vars:["seriesName","name","value"]}},getFormattedLabel:function(t,e,i,n,o){e=e||"normal";var r=this.getData(i),s=r.getItemModel(t),l=this.getDataParams(t,i);null!=n&&l.value instanceof Array&&(l.value=l.value[n]);var u=s.get([o||"label",e,"formatter"]);return"function"==typeof u?(l.status=e,u(l)):"string"==typeof u?a.formatTpl(u,l):void 0},getRawValue:function(t,e){var i=this.getData(e),n=i.getRawDataItem(t);if(null!=n)return!u(n)||n instanceof Array?n:n.value},formatTooltip:s.noop},h.mappingToExists=function(t,e){e=(e||[]).slice();var i=s.map(t||[],function(t,e){return{exist:t}});return l(e,function(t,n){if(u(t)){for(var a=0;a<i.length;a++)if(!i[a].option&&null!=t.id&&i[a].exist.id===t.id+"")return i[a].option=t,void(e[n]=null);for(var a=0;a<i.length;a++){var o=i[a].exist;if(!(i[a].option||null!=o.id&&null!=t.id||null==t.name||h.isIdInner(t)||h.isIdInner(o)||o.name!==t.name+""))return i[a].option=t,void(e[n]=null)}}}),l(e,function(t,e){if(u(t)){for(var n=0;n<i.length;n++){var a=i[n].exist;if(!i[n].option&&!h.isIdInner(a)&&null==t.id){i[n].option=t;break}}n>=i.length&&i.push({option:t})}}),i},h.makeIdAndName=function(t){var e=s.createHashMap();l(t,function(t,i){var n=t.exist;n&&e.set(n.id,t)}),l(t,function(t,i){var n=t.option;s.assert(!n||null==n.id||!e.get(n.id)||e.get(n.id)===t,"id duplicates: "+(n&&n.id)),n&&null!=n.id&&e.set(n.id,t),!t.keyInfo&&(t.keyInfo={})}),l(t,function(t,i){var n=t.exist,a=t.option,o=t.keyInfo;if(u(a)){if(o.name=null!=a.name?a.name+"":n?n.name:"\0-",n)o.id=n.id;else if(null!=a.id)o.id=a.id+"";else{var r=0;do o.id="\0"+o.name+"\0"+r++;while(e.get(o.id))}e.set(o.id,t)}})},h.isIdInner=function(t){return u(t)&&t.id&&0===(t.id+"").indexOf("\0_ec_\0")},h.compressBatches=function(t,e){function i(t,e,i){for(var n=0,a=t.length;n<a;n++)for(var o=t[n].seriesId,r=h.normalizeToArray(t[n].dataIndex),s=i&&i[o],l=0,u=r.length;l<u;l++){var c=r[l];s&&s[c]?s[c]=null:(e[o]||(e[o]={}))[c]=1}}function n(t,e){var i=[];for(var a in t)if(t.hasOwnProperty(a)&&null!=t[a])if(e)i.push(+a);else{var o=n(t[a],!0);o.length&&i.push({seriesId:a,dataIndex:o})}return i}var a={},o={};return i(t||[],a),i(e||[],o,a),[n(a),n(o)]},h.queryDataIndex=function(t,e){return null!=e.dataIndexInside?e.dataIndexInside:null!=e.dataIndex?s.isArray(e.dataIndex)?s.map(e.dataIndex,function(e){return t.indexOfRawIndex(e)}):t.indexOfRawIndex(e.dataIndex):null!=e.name?s.isArray(e.name)?s.map(e.name,function(e){return t.indexOfName(e)}):t.indexOfName(e.name):void 0},h.makeGetter=function(){var t=0;return function(){var e="\0__ec_prop_getter_"+t++;return function(t){return t[e]||(t[e]={})}}}(),h.parseFinder=function(t,e,i){if(s.isString(e)){var a={};a[e+"Index"]=0,e=a}var o=i&&i.defaultMainType;!o||n(e,o+"Index")||n(e,o+"Id")||n(e,o+"Name")||(e[o+"Index"]=0);var r={};return l(e,function(n,a){var n=e[a];if("dataIndex"===a||"dataIndexInside"===a)return void(r[a]=n);var o=a.match(/^(\w+)(Index|Id|Name)$/)||[],l=o[1],u=(o[2]||"").toLowerCase();if(!(!l||!u||null==n||"index"===u&&"none"===n||i&&i.includeMainTypes&&s.indexOf(i.includeMainTypes,l)<0)){var h={mainType:l};"index"===u&&"all"===n||(h[u]=n);var c=t.queryComponents(h);r[l+"Models"]=c,r[l+"Model"]=c[0]}}),r},h.dataDimToCoordDim=function(t,e){var i=t.dimensions;e=t.getDimension(e);for(var n=0;n<i.length;n++){var a=t.getDimensionInfo(i[n]);if(a.name===e)return a.coordDim}},h.coordDimToDataDim=function(t,e){var i=[];return l(t.dimensions,function(n){var a=t.getDimensionInfo(n);a.coordDim===e&&(i[a.coordDimIndex]=a.name)}),i},h.otherDimToDataDim=function(t,e){var i=[];return l(t.dimensions,function(n){var a=t.getDimensionInfo(n),o=a.otherDims,r=o[e];null!=r&&r!==!1&&(i[r]=a.name)}),i},t.exports=h},function(t,e){var i="undefined"==typeof Float32Array?Array:Float32Array,n={create:function(t,e){var n=new i(2);return null==t&&(t=0),null==e&&(e=0),n[0]=t,n[1]=e,n},copy:function(t,e){return t[0]=e[0],t[1]=e[1],t},clone:function(t){var e=new i(2);return e[0]=t[0],e[1]=t[1],e},set:function(t,e,i){return t[0]=e,t[1]=i,t},add:function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t},scaleAndAdd:function(t,e,i,n){return t[0]=e[0]+i[0]*n,t[1]=e[1]+i[1]*n,t},sub:function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t},len:function(t){return Math.sqrt(this.lenSquare(t))},lenSquare:function(t){return t[0]*t[0]+t[1]*t[1]},mul:function(t,e,i){return t[0]=e[0]*i[0],t[1]=e[1]*i[1],t},div:function(t,e,i){return t[0]=e[0]/i[0],t[1]=e[1]/i[1],t},dot:function(t,e){return t[0]*e[0]+t[1]*e[1]},scale:function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t},normalize:function(t,e){var i=n.len(e);return 0===i?(t[0]=0,t[1]=0):(t[0]=e[0]/i,t[1]=e[1]/i),t},distance:function(t,e){return Math.sqrt((t[0]-e[0])*(t[0]-e[0])+(t[1]-e[1])*(t[1]-e[1]))},distanceSquare:function(t,e){return(t[0]-e[0])*(t[0]-e[0])+(t[1]-e[1])*(t[1]-e[1])},negate:function(t,e){return t[0]=-e[0],t[1]=-e[1],t},lerp:function(t,e,i,n){return t[0]=e[0]+n*(i[0]-e[0]),t[1]=e[1]+n*(i[1]-e[1]),t},applyTransform:function(t,e,i){var n=e[0],a=e[1];return t[0]=i[0]*n+i[2]*a+i[4],t[1]=i[1]*n+i[3]*a+i[5],t},min:function(t,e,i){return t[0]=Math.min(e[0],i[0]),t[1]=Math.min(e[1],i[1]),t},max:function(t,e,i){return t[0]=Math.max(e[0],i[0]),t[1]=Math.max(e[1],i[1]),t}};n.length=n.len,n.lengthSquare=n.lenSquare,n.dist=n.distance,n.distSquare=n.distanceSquare,t.exports=n},function(t,e,i){var n=i(1),a=i(4),o=i(16),r={};r.addCommas=function(t){return isNaN(t)?"-":(t=(t+"").split("."),t[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,"$1,")+(t.length>1?"."+t[1]:""))},r.toCamelCase=function(t,e){return t=(t||"").toLowerCase().replace(/-(.)/g,function(t,e){return e.toUpperCase()}),e&&t&&(t=t.charAt(0).toUpperCase()+t.slice(1)),t},r.normalizeCssArray=n.normalizeCssArray;var s=r.encodeHTML=function(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")},l=["a","b","c","d","e","f","g"],u=function(t,e){return"{"+t+(null==e?"":e)+"}"};r.formatTpl=function(t,e,i){n.isArray(e)||(e=[e]);var a=e.length;if(!a)return"";for(var o=e[0].$vars||[],r=0;r<o.length;r++){var h=l[r],c=u(h,0);t=t.replace(u(h),i?s(c):c)}for(var d=0;d<a;d++)for(var f=0;f<o.length;f++){var c=e[d][o[f]];t=t.replace(u(l[f],d),i?s(c):c)}return t},r.formatTplSimple=function(t,e,i){return n.each(e,function(e,n){t=t.replace("{"+n+"}",i?s(e):e)}),t},r.getTooltipMarker=function(t,e){return t?'<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+r.encodeHTML(t)+";"+(e||"")+'"></span>':""};var h=function(t){return t<10?"0"+t:t};r.formatTime=function(t,e,i){"week"!==t&&"month"!==t&&"quarter"!==t&&"half-year"!==t&&"year"!==t||(t="MM-dd\nyyyy");var n=a.parseDate(e),o=i?"UTC":"",r=n["get"+o+"FullYear"](),s=n["get"+o+"Month"]()+1,l=n["get"+o+"Date"](),u=n["get"+o+"Hours"](),c=n["get"+o+"Minutes"](),d=n["get"+o+"Seconds"]();return t=t.replace("MM",h(s)).replace("M",s).replace("yyyy",r).replace("yy",r%100).replace("dd",h(l)).replace("d",l).replace("hh",h(u)).replace("h",u).replace("mm",h(c)).replace("m",c).replace("ss",h(d)).replace("s",d)},r.capitalFirst=function(t){return t?t.charAt(0).toUpperCase()+t.substr(1):t},r.truncateText=o.truncateText,r.getTextRect=o.getBoundingRect,t.exports=r},function(t,e,i){function n(t){a.call(this,t),this.path=null}var a=i(38),o=i(1),r=i(27),s=i(168),l=i(75),u=l.prototype.getCanvasPattern,h=Math.abs,c=new r(!0);n.prototype={constructor:n,type:"path",__dirtyPath:!0,strokeContainThreshold:5,brush:function(t,e){var i=this.style,n=this.path||c,a=i.hasStroke(),o=i.hasFill(),r=i.fill,s=i.stroke,l=o&&!!r.colorStops,h=a&&!!s.colorStops,d=o&&!!r.image,f=a&&!!s.image;if(i.bind(t,this,e),this.setTransform(t),this.__dirty){var p;l&&(p=p||this.getBoundingRect(),this._fillGradient=i.getGradient(t,r,p)),h&&(p=p||this.getBoundingRect(),this._strokeGradient=i.getGradient(t,s,p))}l?t.fillStyle=this._fillGradient:d&&(t.fillStyle=u.call(r,t)),h?t.strokeStyle=this._strokeGradient:f&&(t.strokeStyle=u.call(s,t));var g=i.lineDash,m=i.lineDashOffset,v=!!t.setLineDash,y=this.getGlobalScale();n.setScale(y[0],y[1]),this.__dirtyPath||g&&!v&&a?(n.beginPath(t),g&&!v&&(n.setLineDash(g),n.setLineDashOffset(m)),this.buildPath(n,this.shape,!1),this.path&&(this.__dirtyPath=!1)):(t.beginPath(),this.path.rebuildPath(t)),o&&n.fill(t),g&&v&&(t.setLineDash(g),t.lineDashOffset=m),a&&n.stroke(t),g&&v&&t.setLineDash([]),this.restoreTransform(t),null!=i.text&&this.drawRectText(t,this.getBoundingRect())},buildPath:function(t,e,i){},createPathProxy:function(){this.path=new r},getBoundingRect:function(){var t=this._rect,e=this.style,i=!t;if(i){var n=this.path;n||(n=this.path=new r),this.__dirtyPath&&(n.beginPath(),this.buildPath(n,this.shape,!1)),t=n.getBoundingRect()}if(this._rect=t,e.hasStroke()){var a=this._rectWithStroke||(this._rectWithStroke=t.clone());if(this.__dirty||i){a.copy(t);var o=e.lineWidth,s=e.strokeNoScale?this.getLineScale():1;
e.hasFill()||(o=Math.max(o,this.strokeContainThreshold||4)),s>1e-10&&(a.width+=o/s,a.height+=o/s,a.x-=o/s/2,a.y-=o/s/2)}return a}return t},contain:function(t,e){var i=this.transformCoordToLocal(t,e),n=this.getBoundingRect(),a=this.style;if(t=i[0],e=i[1],n.contain(t,e)){var o=this.path.data;if(a.hasStroke()){var r=a.lineWidth,l=a.strokeNoScale?this.getLineScale():1;if(l>1e-10&&(a.hasFill()||(r=Math.max(r,this.strokeContainThreshold)),s.containStroke(o,r/l,t,e)))return!0}if(a.hasFill())return s.contain(o,t,e)}return!1},dirty:function(t){null==t&&(t=!0),t&&(this.__dirtyPath=t,this._rect=null),this.__dirty=!0,this.__zr&&this.__zr.refresh(),this.__clipTarget&&this.__clipTarget.dirty()},animateShape:function(t){return this.animate("shape",t)},attrKV:function(t,e){"shape"===t?(this.setShape(e),this.__dirtyPath=!0,this._rect=null):a.prototype.attrKV.call(this,t,e)},setShape:function(t,e){var i=this.shape;if(i){if(o.isObject(t))for(var n in t)t.hasOwnProperty(n)&&(i[n]=t[n]);else i[t]=e;this.dirty(!0)}return this},getLineScale:function(){var t=this.transform;return t&&h(t[0]-1)>1e-10&&h(t[3]-1)>1e-10?Math.sqrt(h(t[0]*t[3]-t[2]*t[1])):1}},n.extend=function(t){var e=function(e){n.call(this,e),t.style&&this.style.extendFrom(t.style,!1);var i=t.shape;if(i){this.shape=this.shape||{};var a=this.shape;for(var o in i)!a.hasOwnProperty(o)&&i.hasOwnProperty(o)&&(a[o]=i[o])}t.init&&t.init.call(this,e)};o.inherits(e,n);for(var i in t)"style"!==i&&"shape"!==i&&(e.prototype[i]=t[i]);return e},o.inherits(n,a),t.exports=n},function(t,e,i){"use strict";function n(t,e,i,n,a){var o=0,r=0;null==n&&(n=1/0),null==a&&(a=1/0);var s=0;e.eachChild(function(l,u){var h,c,d=l.position,f=l.getBoundingRect(),p=e.childAt(u+1),g=p&&p.getBoundingRect();if("horizontal"===t){var m=f.width+(g?-g.x+f.x:0);h=o+m,h>n||l.newline?(o=0,h=m,r+=s+i,s=f.height):s=Math.max(s,f.height)}else{var v=f.height+(g?-g.y+f.y:0);c=r+v,c>a||l.newline?(o+=s+i,r=0,c=v,s=f.width):s=Math.max(s,f.width)}l.newline||(d[0]=o,d[1]=r,"horizontal"===t?o=h+i:r=c+i)})}var a=i(1),o=i(12),r=i(4),s=i(7),l=r.parsePercent,u=a.each,h={},c=h.LOCATION_PARAMS=["left","right","top","bottom","width","height"],d=h.HV_NAMES=[["width","left","right"],["height","top","bottom"]];h.box=n,h.vbox=a.curry(n,"vertical"),h.hbox=a.curry(n,"horizontal"),h.getAvailableSize=function(t,e,i){var n=e.width,a=e.height,o=l(t.x,n),r=l(t.y,a),u=l(t.x2,n),h=l(t.y2,a);return(isNaN(o)||isNaN(parseFloat(t.x)))&&(o=0),(isNaN(u)||isNaN(parseFloat(t.x2)))&&(u=n),(isNaN(r)||isNaN(parseFloat(t.y)))&&(r=0),(isNaN(h)||isNaN(parseFloat(t.y2)))&&(h=a),i=s.normalizeCssArray(i||0),{width:Math.max(u-o-i[1]-i[3],0),height:Math.max(h-r-i[0]-i[2],0)}},h.getLayoutRect=function(t,e,i){i=s.normalizeCssArray(i||0);var n=e.width,a=e.height,r=l(t.left,n),u=l(t.top,a),h=l(t.right,n),c=l(t.bottom,a),d=l(t.width,n),f=l(t.height,a),p=i[2]+i[0],g=i[1]+i[3],m=t.aspect;switch(isNaN(d)&&(d=n-h-g-r),isNaN(f)&&(f=a-c-p-u),null!=m&&(isNaN(d)&&isNaN(f)&&(m>n/a?d=.8*n:f=.8*a),isNaN(d)&&(d=m*f),isNaN(f)&&(f=d/m)),isNaN(r)&&(r=n-h-d-g),isNaN(u)&&(u=a-c-f-p),t.left||t.right){case"center":r=n/2-d/2-i[3];break;case"right":r=n-d-g}switch(t.top||t.bottom){case"middle":case"center":u=a/2-f/2-i[0];break;case"bottom":u=a-f-p}r=r||0,u=u||0,isNaN(d)&&(d=n-g-r-(h||0)),isNaN(f)&&(f=a-p-u-(c||0));var v=new o(r+i[3],u+i[0],d,f);return v.margin=i,v},h.positionElement=function(t,e,i,n,r){var s=!r||!r.hv||r.hv[0],l=!r||!r.hv||r.hv[1],u=r&&r.boundingMode||"all";if(s||l){var c;if("raw"===u)c="group"===t.type?new o(0,0,+e.width||0,+e.height||0):t.getBoundingRect();else if(c=t.getBoundingRect(),t.needLocalTransform()){var d=t.getLocalTransform();c=c.clone(),c.applyTransform(d)}e=h.getLayoutRect(a.defaults({width:c.width,height:c.height},e),i,n);var f=t.position,p=s?e.x-c.x:0,g=l?e.y-c.y:0;t.attr("position","raw"===u?[p,g]:[f[0]+p,f[1]+g])}},h.sizeCalculable=function(t,e){return null!=t[d[e][0]]||null!=t[d[e][1]]&&null!=t[d[e][2]]},h.mergeLayoutParam=function(t,e,i){function n(i,n){var a={},s=0,h={},c=0,d=2;if(u(i,function(e){h[e]=t[e]}),u(i,function(t){o(e,t)&&(a[t]=h[t]=e[t]),r(a,t)&&s++,r(h,t)&&c++}),l[n])return r(e,i[1])?h[i[2]]=null:r(e,i[2])&&(h[i[1]]=null),h;if(c!==d&&s){if(s>=d)return a;for(var f=0;f<i.length;f++){var p=i[f];if(!o(a,p)&&o(t,p)){a[p]=t[p];break}}return a}return h}function o(t,e){return t.hasOwnProperty(e)}function r(t,e){return null!=t[e]&&"auto"!==t[e]}function s(t,e,i){u(t,function(t){e[t]=i[t]})}!a.isObject(i)&&(i={});var l=i.ignoreSize;!a.isArray(l)&&(l=[l,l]);var h=n(d[0],0),c=n(d[1],1);s(d[0],t,h),s(d[1],t,c)},h.getLayoutParams=function(t){return h.copyLayoutParams({},t)},h.copyLayoutParams=function(t,e){return e&&t&&u(c,function(i){e.hasOwnProperty(i)&&(t[i]=e[i])}),t},t.exports=h},function(t,e){function i(t){var e={},i={},n=t.match(/Firefox\/([\d.]+)/),a=t.match(/MSIE\s([\d.]+)/)||t.match(/Trident\/.+?rv:(([\d.]+))/),o=t.match(/Edge\/([\d.]+)/),r=/micromessenger/i.test(t);return n&&(i.firefox=!0,i.version=n[1]),a&&(i.ie=!0,i.version=a[1]),o&&(i.edge=!0,i.version=o[1]),r&&(i.weChat=!0),{browser:i,os:e,node:!1,canvasSupported:!!document.createElement("canvas").getContext,touchEventsSupported:"ontouchstart"in window&&!i.ie&&!i.edge,pointerEventsSupported:"onpointerdown"in window&&(i.edge||i.ie&&i.version>=11)}}var n={};n="undefined"==typeof navigator?{browser:{},os:{},node:!0,canvasSupported:!0}:i(navigator.userAgent),t.exports=n},function(t,e,i){function n(t,e,i){this.parentModel=e,this.ecModel=i,this.option=t}function a(t,e,i){for(var n=0;n<e.length&&(!e[n]||(t=t&&"object"==typeof t?t[e[n]]:null,null!=t));n++);return null==t&&i&&(t=i.get(e)),t}function o(t,e){var i=s.get(t,"getParent");return i?i.call(t,e):t.parentModel}var r=i(1),s=i(15),l=i(10);n.prototype={constructor:n,init:null,mergeOption:function(t){r.merge(this.option,t,!0)},get:function(t,e){return null==t?this.option:a(this.option,this.parsePath(t),!e&&o(this,t))},getShallow:function(t,e){var i=this.option,n=null==i?i:i[t],a=!e&&o(this,t);return null==n&&a&&(n=a.getShallow(t)),n},getModel:function(t,e){var i,r=null==t?this.option:a(this.option,t=this.parsePath(t));return e=e||(i=o(this,t))&&i.getModel(t),new n(r,e,this.ecModel)},isEmpty:function(){return null==this.option},restoreData:function(){},clone:function(){var t=this.constructor;return new t(r.clone(this.option))},setReadOnly:function(t){s.setReadOnly(this,t)},parsePath:function(t){return"string"==typeof t&&(t=t.split(".")),t},customizeGetParent:function(t){s.set(this,"getParent",t)},isAnimationEnabled:function(){if(!l.node){if(null!=this.option.animation)return!!this.option.animation;if(this.parentModel)return this.parentModel.isAnimationEnabled()}}},s.enableClassExtend(n);var u=r.mixin;u(n,i(150)),u(n,i(147)),u(n,i(151)),u(n,i(149)),t.exports=n},function(t,e,i){"use strict";function n(t,e,i,n){i<0&&(t+=i,i=-i),n<0&&(e+=n,n=-n),this.x=t,this.y=e,this.width=i,this.height=n}var a=i(6),o=i(19),r=a.applyTransform,s=Math.min,l=Math.max;n.prototype={constructor:n,union:function(t){var e=s(t.x,this.x),i=s(t.y,this.y);this.width=l(t.x+t.width,this.x+this.width)-e,this.height=l(t.y+t.height,this.y+this.height)-i,this.x=e,this.y=i},applyTransform:function(){var t=[],e=[],i=[],n=[];return function(a){if(a){t[0]=i[0]=this.x,t[1]=n[1]=this.y,e[0]=n[0]=this.x+this.width,e[1]=i[1]=this.y+this.height,r(t,t,a),r(e,e,a),r(i,i,a),r(n,n,a),this.x=s(t[0],e[0],i[0],n[0]),this.y=s(t[1],e[1],i[1],n[1]);var o=l(t[0],e[0],i[0],n[0]),u=l(t[1],e[1],i[1],n[1]);this.width=o-this.x,this.height=u-this.y}}}(),calculateTransform:function(t){var e=this,i=t.width/e.width,n=t.height/e.height,a=o.create();return o.translate(a,a,[-e.x,-e.y]),o.scale(a,a,[i,n]),o.translate(a,a,[t.x,t.y]),a},intersect:function(t){if(!t)return!1;t instanceof n||(t=n.create(t));var e=this,i=e.x,a=e.x+e.width,o=e.y,r=e.y+e.height,s=t.x,l=t.x+t.width,u=t.y,h=t.y+t.height;return!(a<s||l<i||r<u||h<o)},contain:function(t,e){var i=this;return t>=i.x&&t<=i.x+i.width&&e>=i.y&&e<=i.y+i.height},clone:function(){return new n(this.x,this.y,this.width,this.height)},copy:function(t){this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height},plain:function(){return{x:this.x,y:this.y,width:this.width,height:this.height}}},n.create=function(t){return new n(t.x,t.y,t.width,t.height)},t.exports=n},function(t,e,i){function n(t){var e=[];return o.each(h.getClassesByMainType(t),function(t){r.apply(e,t.prototype.dependencies||[])}),o.map(e,function(t){return l.parseClassType(t).main})}var a=i(11),o=i(1),r=Array.prototype.push,s=i(50),l=i(15),u=i(9),h=a.extend({type:"component",id:"",name:"",mainType:"",subType:"",componentIndex:0,defaultOption:null,ecModel:null,dependentModels:[],uid:null,layoutMode:null,$constructor:function(t,e,i,n){a.call(this,t,e,i,n),this.uid=s.getUID("componentModel")},init:function(t,e,i,n){this.mergeDefaultAndTheme(t,i)},mergeDefaultAndTheme:function(t,e){var i=this.layoutMode,n=i?u.getLayoutParams(t):{},a=e.getTheme();o.merge(t,a.get(this.mainType)),o.merge(t,this.getDefaultOption()),i&&u.mergeLayoutParam(t,n,i)},mergeOption:function(t,e){o.merge(this.option,t,!0);var i=this.layoutMode;i&&u.mergeLayoutParam(this.option,t,i)},optionUpdated:function(t,e){},getDefaultOption:function(){if(!l.hasOwn(this,"__defaultOption")){for(var t=[],e=this.constructor;e;){var i=e.prototype.defaultOption;i&&t.push(i),e=e.superClass}for(var n={},a=t.length-1;a>=0;a--)n=o.merge(n,t[a],!0);l.set(this,"__defaultOption",n)}return l.get(this,"__defaultOption")},getReferringComponents:function(t){return this.ecModel.queryComponents({mainType:t,index:this.get(t+"Index",!0),id:this.get(t+"Id",!0)})}});l.enableClassManagement(h,{registerWhenExtend:!0}),s.enableSubTypeDefaulter(h),s.enableTopologicalTravel(h,n),o.mixin(h,i(148)),t.exports=h},function(t,e,i){(function(e){function n(t,e){p.each(v.concat(e.__wrappedMethods||[]),function(i){e.hasOwnProperty(i)&&(t[i]=e[i])}),t.__wrappedMethods=e.__wrappedMethods}function a(t){this._array=t||[]}function o(t){return p.isArray(t)||(t=[t]),t}function r(t,e){var i=t.dimensions,a=new y(p.map(i,t.getDimensionInfo,t),t.hostModel);n(a,t);for(var o=a._storage={},r=t._storage,s=0;s<i.length;s++){var l=i[s],u=r[l];p.indexOf(e,l)>=0?o[l]=new u.constructor(r[l].length):o[l]=r[l]}return a}var s="undefined",l="undefined"==typeof window?e:window,u=typeof l.Float64Array===s?Array:l.Float64Array,h=typeof l.Int32Array===s?Array:l.Int32Array,c={float:u,int:h,ordinal:Array,number:Array,time:Array},d=i(11),f=i(43),p=i(1),g=i(5),m=p.isObject,v=["stackedOn","hasItemOption","_nameList","_idList","_rawData"];a.prototype.pure=!1,a.prototype.count=function(){return this._array.length},a.prototype.getItem=function(t){return this._array[t]};var y=function(t,e){t=t||["x","y"];for(var i={},n=[],a=0;a<t.length;a++){var o,r={};"string"==typeof t[a]?(o=t[a],r={name:o,coordDim:o,coordDimIndex:0,stackable:!1,type:"number"}):(r=t[a],o=r.name,r.type=r.type||"number",r.coordDim||(r.coordDim=o,r.coordDimIndex=0)),r.otherDims=r.otherDims||{},n.push(o),i[o]=r}this.dimensions=n,this._dimensionInfos=i,this.hostModel=e,this.dataType,this.indices=[],this._storage={},this._nameList=[],this._idList=[],this._optionModels=[],this.stackedOn=null,this._visual={},this._layout={},this._itemVisuals=[],this._itemLayouts=[],this._graphicEls=[],this._rawData,this._extent},x=y.prototype;x.type="list",x.hasItemOption=!0,x.getDimension=function(t){return isNaN(t)||(t=this.dimensions[t]||t),t},x.getDimensionInfo=function(t){return p.clone(this._dimensionInfos[this.getDimension(t)])},x.initData=function(t,e,i){t=t||[];var n=p.isArray(t);n&&(t=new a(t)),this._rawData=t;var o,r=this._storage={},s=this.indices=[],l=this.dimensions,u=this._dimensionInfos,h=t.count(),d=[],f={};e=e||[];for(var m=0;m<l.length;m++){var v=u[l[m]];0===v.otherDims.itemName&&(o=m);var y=c[v.type];r[l[m]]=new y(h)}var x=this;i||(x.hasItemOption=!1),i=i||function(t,e,i,n){var a=g.getDataItemValue(t);return g.isDataItemOption(t)&&(x.hasItemOption=!0),g.converDataValue(a instanceof Array?a[n]:a,u[e])};for(var m=0;m<h;m++){for(var _=t.getItem(m),b=0;b<l.length;b++){var w=l[b],S=r[w];S[m]=i(_,w,m,b)}s.push(m)}for(var m=0;m<h;m++){var _=t.getItem(m);!e[m]&&_&&(null!=_.name?e[m]=_.name:null!=o&&(e[m]=r[l[o]][m]));var M=e[m]||"",I=_&&_.id;!I&&M&&(f[M]=f[M]||0,I=M,f[M]>0&&(I+="__ec__"+f[M]),f[M]++),I&&(d[m]=I)}this._nameList=e,this._idList=d},x.count=function(){return this.indices.length},x.get=function(t,e,i){var n=this._storage,a=this.indices[e];if(null==a||!n[t])return NaN;var o=n[t][a];if(i){var r=this._dimensionInfos[t];if(r&&r.stackable)for(var s=this.stackedOn;s;){var l=s.get(t,e);(o>=0&&l>0||o<=0&&l<0)&&(o+=l),s=s.stackedOn}}return o},x.getValues=function(t,e,i){var n=[];p.isArray(t)||(i=e,e=t,t=this.dimensions);for(var a=0,o=t.length;a<o;a++)n.push(this.get(t[a],e,i));return n},x.hasValue=function(t){for(var e=this.dimensions,i=this._dimensionInfos,n=0,a=e.length;n<a;n++)if("ordinal"!==i[e[n]].type&&isNaN(this.get(e[n],t)))return!1;return!0},x.getDataExtent=function(t,e,i){t=this.getDimension(t);var n=this._storage[t],a=this.getDimensionInfo(t);e=a&&a.stackable&&e;var o,r=(this._extent||(this._extent={}))[t+!!e];if(r)return r;if(n){for(var s=1/0,l=-(1/0),u=0,h=this.count();u<h;u++)o=this.get(t,u,e),i&&!i(o,t,u)||(o<s&&(s=o),o>l&&(l=o));return this._extent[t+!!e]=[s,l]}return[1/0,-(1/0)]},x.getSum=function(t,e){var i=this._storage[t],n=0;if(i)for(var a=0,o=this.count();a<o;a++){var r=this.get(t,a,e);isNaN(r)||(n+=r)}return n},x.indexOf=function(t,e){var i=this._storage,n=i[t],a=this.indices;if(n)for(var o=0,r=a.length;o<r;o++){var s=a[o];if(n[s]===e)return o}return-1},x.indexOfName=function(t){for(var e=this.indices,i=this._nameList,n=0,a=e.length;n<a;n++){var o=e[n];if(i[o]===t)return n}return-1},x.indexOfRawIndex=function(t){var e=this.indices,i=e[t];if(null!=i&&i===t)return t;for(var n=0,a=e.length-1;n<=a;){var o=(n+a)/2|0;if(e[o]<t)n=o+1;else{if(!(e[o]>t))return o;a=o-1}}return-1},x.indicesOfNearest=function(t,e,i,n){var a=this._storage,o=a[t],r=[];if(!o)return r;null==n&&(n=1/0);for(var s=Number.MAX_VALUE,l=-1,u=0,h=this.count();u<h;u++){var c=e-this.get(t,u,i),d=Math.abs(c);c<=n&&d<=s&&((d<s||c>=0&&l<0)&&(s=d,l=c,r.length=0),r.push(u))}return r},x.getRawIndex=function(t){var e=this.indices[t];return null==e?-1:e},x.getRawDataItem=function(t){return this._rawData.getItem(this.getRawIndex(t))},x.getName=function(t){return this._nameList[this.indices[t]]||""},x.getId=function(t){return this._idList[this.indices[t]]||this.getRawIndex(t)+""},x.each=function(t,e,i,n){"function"==typeof t&&(n=i,i=e,e=t,t=[]),t=p.map(o(t),this.getDimension,this);var a=[],r=t.length,s=this.indices;n=n||this;for(var l=0;l<s.length;l++)switch(r){case 0:e.call(n,l);break;case 1:e.call(n,this.get(t[0],l,i),l);break;case 2:e.call(n,this.get(t[0],l,i),this.get(t[1],l,i),l);break;default:for(var u=0;u<r;u++)a[u]=this.get(t[u],l,i);a[u]=l,e.apply(n,a)}},x.filterSelf=function(t,e,i,n){"function"==typeof t&&(n=i,i=e,e=t,t=[]),t=p.map(o(t),this.getDimension,this);var a=[],r=[],s=t.length,l=this.indices;n=n||this;for(var u=0;u<l.length;u++){var h;if(s)if(1===s)h=e.call(n,this.get(t[0],u,i),u);else{for(var c=0;c<s;c++)r[c]=this.get(t[c],u,i);r[c]=u,h=e.apply(n,r)}else h=e.call(n,u);h&&a.push(l[u])}return this.indices=a,this._extent={},this},x.mapArray=function(t,e,i,n){"function"==typeof t&&(n=i,i=e,e=t,t=[]);var a=[];return this.each(t,function(){a.push(e&&e.apply(this,arguments))},i,n),a},x.map=function(t,e,i,n){t=p.map(o(t),this.getDimension,this);var a=r(this,t),s=a.indices=this.indices,l=a._storage,u=[];return this.each(t,function(){var i=arguments[arguments.length-1],n=e&&e.apply(this,arguments);if(null!=n){"number"==typeof n&&(u[0]=n,n=u);for(var a=0;a<n.length;a++){var o=t[a],r=l[o],h=s[i];r&&(r[h]=n[a])}}},i,n),a},x.downSample=function(t,e,i,n){for(var a=r(this,[t]),o=this._storage,s=a._storage,l=this.indices,u=a.indices=[],h=[],c=[],d=Math.floor(1/e),f=s[t],p=this.count(),g=0;g<o[t].length;g++)s[t][g]=o[t][g];for(var g=0;g<p;g+=d){d>p-g&&(d=p-g,h.length=d);for(var m=0;m<d;m++){var v=l[g+m];h[m]=f[v],c[m]=v}var y=i(h),v=c[n(h,y)||0];f[v]=y,u.push(v)}return a},x.getItemModel=function(t){var e=this.hostModel;return t=this.indices[t],new d(this._rawData.getItem(t),e,e&&e.ecModel)},x.diff=function(t){var e,i=this._idList,n=t&&t._idList,a="e\0\0";return new f(t?t.indices:[],this.indices,function(t){return null!=(e=n[t])?e:a+t},function(t){return null!=(e=i[t])?e:a+t})},x.getVisual=function(t){var e=this._visual;return e&&e[t]},x.setVisual=function(t,e){if(m(t))for(var i in t)t.hasOwnProperty(i)&&this.setVisual(i,t[i]);else this._visual=this._visual||{},this._visual[t]=e},x.setLayout=function(t,e){if(m(t))for(var i in t)t.hasOwnProperty(i)&&this.setLayout(i,t[i]);else this._layout[t]=e},x.getLayout=function(t){return this._layout[t]},x.getItemLayout=function(t){return this._itemLayouts[t]},x.setItemLayout=function(t,e,i){this._itemLayouts[t]=i?p.extend(this._itemLayouts[t]||{},e):e},x.clearItemLayouts=function(){this._itemLayouts.length=0},x.getItemVisual=function(t,e,i){var n=this._itemVisuals[t],a=n&&n[e];return null!=a||i?a:this.getVisual(e)},x.setItemVisual=function(t,e,i){var n=this._itemVisuals[t]||{};if(this._itemVisuals[t]=n,m(e))for(var a in e)e.hasOwnProperty(a)&&(n[a]=e[a]);else n[e]=i},x.clearAllVisual=function(){this._visual={},this._itemVisuals=[]};var _=function(t){t.seriesIndex=this.seriesIndex,t.dataIndex=this.dataIndex,t.dataType=this.dataType};x.setItemGraphicEl=function(t,e){var i=this.hostModel;e&&(e.dataIndex=t,e.dataType=this.dataType,e.seriesIndex=i&&i.seriesIndex,"group"===e.type&&e.traverse(_,e)),this._graphicEls[t]=e},x.getItemGraphicEl=function(t){return this._graphicEls[t]},x.eachItemGraphicEl=function(t,e){p.each(this._graphicEls,function(i,n){i&&t&&t.call(e,i,n)})},x.cloneShallow=function(){var t=p.map(this.dimensions,this.getDimensionInfo,this),e=new y(t,this.hostModel);return e._storage=this._storage,n(e,this),e.indices=this.indices.slice(),this._extent&&(e._extent=p.extend({},this._extent)),e},x.wrapMethod=function(t,e){var i=this[t];"function"==typeof i&&(this.__wrappedMethods=this.__wrappedMethods||[],this.__wrappedMethods.push(t),this[t]=function(){var t=i.apply(this,arguments);return e.apply(this,[t].concat(p.slice(arguments)))})},x.TRANSFERABLE_METHODS=["cloneShallow","downSample","map"],x.CHANGABLE_METHODS=["filterSelf"],t.exports=y}).call(e,function(){return this}())},function(t,e,i){function n(t){r.assert(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(t),'componentType "'+t+'" illegal')}function a(t,e){var i=r.slice(arguments,2);return this.superClass.prototype[e].apply(t,i)}function o(t,e,i){return this.superClass.prototype[e].apply(t,i)}var r=i(1),s={},l=".",u="___EC__COMPONENT__CONTAINER___",h="\0ec_\0";s.set=function(t,e,i){return t[h+e]=i},s.get=function(t,e){return t[h+e]},s.hasOwn=function(t,e){return t.hasOwnProperty(h+e)};var c=s.parseClassType=function(t){var e={main:"",sub:""};return t&&(t=t.split(l),e.main=t[0]||"",e.sub=t[1]||""),e};s.enableClassExtend=function(t,e){t.$constructor=t,t.extend=function(t){var e=this,i=function(){t.$constructor?t.$constructor.apply(this,arguments):e.apply(this,arguments)};return r.extend(i.prototype,t),i.extend=this.extend,i.superCall=a,i.superApply=o,r.inherits(i,this),i.superClass=e,i}},s.enableClassManagement=function(t,e){function i(t){var e=a[t.main];return e&&e[u]||(e=a[t.main]={},e[u]=!0),e}e=e||{};var a={};if(t.registerClass=function(t,e){if(e)if(n(e),e=c(e),e.sub){if(e.sub!==u){var o=i(e);o[e.sub]=t}}else a[e.main]=t;return t},t.getClass=function(t,e,i){var n=a[t];if(n&&n[u]&&(n=e?n[e]:null),i&&!n)throw new Error(e?"Component "+t+"."+(e||"")+" not exists. Load it first.":t+".type should be specified.");return n},t.getClassesByMainType=function(t){t=c(t);var e=[],i=a[t.main];return i&&i[u]?r.each(i,function(t,i){i!==u&&e.push(t)}):e.push(i),e},t.hasClass=function(t){return t=c(t),!!a[t.main]},t.getAllClassMainTypes=function(){var t=[];return r.each(a,function(e,i){t.push(i)}),t},t.hasSubTypes=function(t){t=c(t);var e=a[t.main];return e&&e[u]},t.parseClassType=c,e.registerWhenExtend){var o=t.extend;o&&(t.extend=function(e){var i=o.call(this,e);return t.registerClass(i,e.type)})}return t},s.setReadOnly=function(t,e){},t.exports=s},function(t,e,i){function n(t,e){e=e||A;var i=t+":"+e;if(S[i])return S[i];for(var n=(t+"").split("\n"),a=0,o=0,r=n.length;o<r;o++)a=Math.max(D.measureText(n[o],e).width,a);return M>I&&(M=0,S={}),M++,S[i]=a,a}function a(t,e,i,n,a,s,l){return s?r(t,e,i,n,a,s,l):o(t,e,i,n,a,l)}function o(t,e,i,a,o,r){var u=m(t,e,o,r),h=n(t,e);o&&(h+=o[1]+o[3]);var c=u.outerHeight,d=s(0,h,i),f=l(0,c,a),p=new b(d,f,h,c);return p.lineHeight=u.lineHeight,p}function r(t,e,i,n,a,o,r){var u=v(t,{rich:o,truncate:r,font:e,textAlign:i,textPadding:a}),h=u.outerWidth,c=u.outerHeight,d=s(0,h,i),f=l(0,c,n);return new b(d,f,h,c)}function s(t,e,i){return"right"===i?t-=e:"center"===i&&(t-=e/2),t}function l(t,e,i){return"middle"===i?t-=e/2:"bottom"===i&&(t-=e),t}function u(t,e,i){var n=e.x,a=e.y,o=e.height,r=e.width,s=o/2,l="left",u="top";switch(t){case"left":n-=i,a+=s,l="right",u="middle";break;case"right":n+=i+r,a+=s,u="middle";break;case"top":n+=r/2,a-=i,l="center",u="bottom";break;case"bottom":n+=r/2,a+=o+i,l="center";break;case"inside":n+=r/2,a+=s,l="center",u="middle";break;case"insideLeft":n+=i,a+=s,u="middle";break;case"insideRight":n+=r-i,a+=s,l="right",u="middle";break;case"insideTop":n+=r/2,a+=i,l="center";break;case"insideBottom":n+=r/2,a+=o-i,l="center",u="bottom";break;case"insideTopLeft":n+=i,a+=i;break;case"insideTopRight":n+=r-i,a+=i,l="right";break;case"insideBottomLeft":n+=i,a+=o-i,u="bottom";break;case"insideBottomRight":n+=r-i,a+=o-i,l="right",u="bottom"}return{x:n,y:a,textAlign:l,textVerticalAlign:u}}function h(t,e,i,n,a){if(!e)return"";var o=(t+"").split("\n");a=c(e,i,n,a);for(var r=0,s=o.length;r<s;r++)o[r]=d(o[r],a);return o.join("\n")}function c(t,e,i,a){a=_.extend({},a),a.font=e;var i=C(i,"...");a.maxIterations=C(a.maxIterations,2);var o=a.minChar=C(a.minChar,0);a.cnCharWidth=n("国",e);var r=a.ascCharWidth=n("a",e);a.placeholder=C(a.placeholder,"");for(var s=t=Math.max(0,t-1),l=0;l<o&&s>=r;l++)s-=r;var u=n(i);return u>s&&(i="",u=0),s=t-u,a.ellipsis=i,a.ellipsisWidth=u,a.contentWidth=s,a.containerWidth=t,a}function d(t,e){var i=e.containerWidth,a=e.font,o=e.contentWidth;if(!i)return"";var r=n(t,a);if(r<=i)return t;for(var s=0;;s++){if(r<=o||s>=e.maxIterations){t+=e.ellipsis;break}var l=0===s?f(t,o,e.ascCharWidth,e.cnCharWidth):r>0?Math.floor(t.length*o/r):0;t=t.substr(0,l),r=n(t,a)}return""===t&&(t=e.placeholder),t}function f(t,e,i,n){for(var a=0,o=0,r=t.length;o<r&&a<e;o++){var s=t.charCodeAt(o);a+=0<=s&&s<=127?i:n}return o}function p(t){return n("国",t)}function g(t,e){var i=_.getContext();return i.font=e||A,i.measureText(t)}function m(t,e,i,n){null!=t&&(t+="");var a=p(e),o=t?t.split("\n"):[],r=o.length*a,s=r;if(i&&(s+=i[0]+i[2]),t&&n){var l=n.outerHeight,u=n.outerWidth;if(null!=l&&s>l)t="",o=[];else if(null!=u)for(var h=c(u-(i?i[1]+i[3]:0),e,n.ellipsis,{minChar:n.minChar,placeholder:n.placeholder}),f=0,g=o.length;f<g;f++)o[f]=d(o[f],h)}return{lines:o,height:r,outerHeight:s,lineHeight:a}}function v(t,e){var i={lines:[],width:0,height:0};if(null!=t&&(t+=""),!t)return i;for(var n,a=T.lastIndex=0;null!=(n=T.exec(t));){var o=n.index;o>a&&y(i,t.substring(a,o)),y(i,n[2],n[1]),a=T.lastIndex}a<t.length&&y(i,t.substring(a,t.length));var r=i.lines,s=0,l=0,u=[],c=e.textPadding,d=e.truncate,f=d&&d.outerWidth,p=d&&d.outerHeight;c&&(null!=f&&(f-=c[1]+c[3]),null!=p&&(p-=c[0]+c[2]));for(var g=0;g<r.length;g++){for(var m=r[g],v=0,x=0,_=0;_<m.tokens.length;_++){var b=m.tokens[_],S=b.styleName&&e.rich[b.styleName]||{},M=b.textPadding=S.textPadding,I=b.font=S.font||e.font,A=b.textHeight=C(S.textHeight,D.getLineHeight(I));if(M&&(A+=M[0]+M[2]),b.height=A,b.lineHeight=L(S.textLineHeight,e.textLineHeight,A),b.textAlign=S&&S.textAlign||e.textAlign,b.textVerticalAlign=S&&S.textVerticalAlign||"middle",null!=p&&s+b.lineHeight>p)return{lines:[],width:0,height:0};b.textWidth=D.getWidth(b.text,I);var P=S.textWidth,k=null==P||"auto"===P;if("string"==typeof P&&"%"===P.charAt(P.length-1))b.percentWidth=P,u.push(b),P=0;else{if(k){P=b.textWidth;var O=S.textBackgroundColor,z=O&&O.image;z&&(z=w.findExistImage(z),w.isImageReady(z)&&(P=Math.max(P,z.width*A/z.height)))}var E=M?M[1]+M[3]:0;P+=E;var R=null!=f?f-x:null;null!=R&&R<P&&(!k||R<E?(b.text="",b.textWidth=P=0):(b.text=h(b.text,R-E,I,d.ellipsis,{minChar:d.minChar}),b.textWidth=D.getWidth(b.text,I),P=b.textWidth+E))}x+=b.width=P,S&&(v=Math.max(v,b.lineHeight))}m.width=x,m.lineHeight=v,s+=v,l=Math.max(l,x)}i.outerWidth=i.width=C(e.textWidth,l),i.outerHeight=i.height=C(e.textHeight,s),c&&(i.outerWidth+=c[1]+c[3],i.outerHeight+=c[0]+c[2]);for(var g=0;g<u.length;g++){var b=u[g],N=b.percentWidth;b.width=parseInt(N,10)/100*l}return i}function y(t,e,i){for(var n=""===e,a=e.split("\n"),o=t.lines,r=0;r<a.length;r++){var s=a[r],l={styleName:i,text:s,isLineHolder:!s&&!n};if(r)o.push({tokens:[l]});else{var u=(o[o.length-1]||(o[0]={tokens:[]})).tokens,h=u.length;1===h&&u[0].isLineHolder?u[0]=l:(s||!h||n)&&u.push(l)}}}function x(t){return(t.fontSize||t.fontFamily)&&[t.fontStyle,t.fontWeight,(t.fontSize||12)+"px",t.fontFamily||"sans-serif"].join(" ")||t.textFont||t.font}var _=i(1),b=i(12),w=i(53),S={},M=0,I=5e3,T=/\{([a-zA-Z0-9_]+)\|([^}]*)\}/g,A="12px sans-serif",C=_.retrieve2,L=_.retrieve3,D={getWidth:n,getBoundingRect:a,adjustTextPositionOnRect:u,truncateText:h,measureText:g,getLineHeight:p,parsePlainText:m,parseRichText:v,adjustTextX:s,adjustTextY:l,makeFont:x,DEFAULT_FONT:A};t.exports=D},function(t,e,i){"use strict";var n=i(1),a=i(7),o=i(15),r=i(5),s=i(13),l=i(65),u=i(10),h=i(9),c=o.set,d=o.get,f=a.encodeHTML,p=a.addCommas,g=s.extend({type:"series.__base__",seriesIndex:0,coordinateSystem:null,defaultOption:null,legendDataProvider:null,visualColorAccessPath:"itemStyle.normal.color",layoutMode:null,init:function(t,e,i,n){this.seriesIndex=this.componentIndex,this.mergeDefaultAndTheme(t,i);var a=this.getInitialData(t,i);c(this,"dataBeforeProcessed",a),this.restoreData()},mergeDefaultAndTheme:function(t,e){var i=this.layoutMode,a=i?h.getLayoutParams(t):{},o=this.subType;s.hasClass(o)&&(o+="Series"),n.merge(t,e.getTheme().get(this.subType)),n.merge(t,this.getDefaultOption()),r.defaultEmphasis(t.label,["show"]),this.fillDataTextStyle(t.data),i&&h.mergeLayoutParam(t,a,i)},mergeOption:function(t,e){t=n.merge(this.option,t,!0),this.fillDataTextStyle(t.data);var i=this.layoutMode;i&&h.mergeLayoutParam(this.option,t,i);var a=this.getInitialData(t,e);a&&(c(this,"data",a),c(this,"dataBeforeProcessed",a.cloneShallow()))},fillDataTextStyle:function(t){if(t)for(var e=["show"],i=0;i<t.length;i++)t[i]&&t[i].label&&r.defaultEmphasis(t[i].label,e)},getInitialData:function(){},getData:function(t){var e=d(this,"data");return null==t?e:e.getLinkedData(t)},setData:function(t){c(this,"data",t)},getRawData:function(){return d(this,"dataBeforeProcessed")},coordDimToDataDim:function(t){return r.coordDimToDataDim(this.getData(),t)},dataDimToCoordDim:function(t){return r.dataDimToCoordDim(this.getData(),t)},getBaseAxis:function(){var t=this.coordinateSystem;return t&&t.getBaseAxis&&t.getBaseAxis()},formatTooltip:function(t,e,i){function o(i){function o(t,i){var n=s.getDimensionInfo(i);if(n&&n.otherDims.tooltip!==!1){var o=n.type,r=(l?"- "+(n.tooltipName||n.name)+": ":"")+("ordinal"===o?t+"":"time"===o?e?"":a.formatTime("yyyy/MM/dd hh:mm:ss",t):p(t));r&&u.push(f(r))}}var l=n.reduce(i,function(t,e,i){var n=s.getDimensionInfo(i);return t|=n&&n.tooltip!==!1&&null!=n.tooltipName},0),u=[],h=r.otherDimToDataDim(s,"tooltip");return h.length?n.each(h,function(e){o(s.get(e,t),e)}):n.each(i,o),(l?"<br/>":"")+u.join(l?"<br/>":", ")}var s=d(this,"data"),l=this.getRawValue(t),u=n.isArray(l)?o(l):f(p(l)),h=s.getName(t),c=s.getItemVisual(t,"color");n.isObject(c)&&c.colorStops&&(c=(c.colorStops[0]||{}).color),c=c||"transparent";var g=a.getTooltipMarker(c),m=this.name;return"\0-"===m&&(m=""),m=m?f(m)+(e?": ":"<br/>"):"",e?g+m+u:m+g+(h?f(h)+": "+u:u)},isAnimationEnabled:function(){if(u.node)return!1;var t=this.getShallow("animation");return t&&this.getData().count()>this.getShallow("animationThreshold")&&(t=!1),t},restoreData:function(){c(this,"data",d(this,"dataBeforeProcessed").cloneShallow())},getColorFromPalette:function(t,e){var i=this.ecModel,n=l.getColorFromPalette.call(this,t,e);return n||(n=i.getColorFromPalette(t,e)),n},getAxisTooltipData:null,getTooltipPosition:null});n.mixin(g,r.dataFormatMixin),n.mixin(g,l),t.exports=g},function(t,e,i){var n=i(156),a=i(45);i(157),i(155);var o=i(34),r=i(4),s=i(1),l=i(16),u={};u.getScaleExtent=function(t,e){var i,n,a,o=t.type,l=e.getMin(),u=e.getMax(),h=null!=l,c=null!=u,d=t.getExtent();return"ordinal"===o?i=(e.get("data")||[]).length:(n=e.get("boundaryGap"),s.isArray(n)||(n=[n||0,n||0]),"boolean"==typeof n[0]&&(n=[0,0]),n[0]=r.parsePercent(n[0],1),n[1]=r.parsePercent(n[1],1),a=d[1]-d[0]||Math.abs(d[0])),null==l&&(l="ordinal"===o?i?0:NaN:d[0]-n[0]*a),null==u&&(u="ordinal"===o?i?i-1:NaN:d[1]+n[1]*a),"dataMin"===l?l=d[0]:"function"==typeof l&&(l=l({min:d[0],max:d[1]})),"dataMax"===u?u=d[1]:"function"==typeof u&&(u=u({min:d[0],max:d[1]})),(null==l||!isFinite(l))&&(l=NaN),(null==u||!isFinite(u))&&(u=NaN),t.setBlank(s.eqNaN(l)||s.eqNaN(u)),e.getNeedCrossZero()&&(l>0&&u>0&&!h&&(l=0),l<0&&u<0&&!c&&(u=0)),[l,u]},u.niceScaleExtent=function(t,e){var i=u.getScaleExtent(t,e),n=null!=e.getMin(),a=null!=e.getMax(),o=e.get("splitNumber");"log"===t.type&&(t.base=e.get("logBase"));var r=t.type;t.setExtent(i[0],i[1]),t.niceExtent({splitNumber:o,fixMin:n,fixMax:a,minInterval:"interval"===r||"time"===r?e.get("minInterval"):null,maxInterval:"interval"===r||"time"===r?e.get("maxInterval"):null});var s=e.get("interval");null!=s&&t.setInterval&&t.setInterval(s)},u.createScaleByModel=function(t,e){if(e=e||t.get("type"))switch(e){case"category":return new n(t.getCategories(),[1/0,-(1/0)]);case"value":return new a;default:return(o.getClass(e)||a).create(t)}},u.ifAxisCrossZero=function(t){var e=t.scale.getExtent(),i=e[0],n=e[1];return!(i>0&&n>0||i<0&&n<0)},u.getAxisLabelInterval=function(t,e,i,n){var a,o=0,r=0,s=1;e.length>40&&(s=Math.floor(e.length/40));for(var u=0;u<t.length;u+=s){var h=t[u],c=l.getBoundingRect(e[u],i,"center","top");c[n?"x":"y"]+=h,c[n?"width":"height"]*=1.3,a?a.intersect(c)?(r++,o=Math.max(o,r)):(a.union(c),r=0):a=c.clone()}return 0===o&&s>1?s:(o+1)*s-1},u.getFormattedLabels=function(t,e){var i=t.scale,n=i.getTicksLabels(),a=i.getTicks();return"string"==typeof e?(e=function(t){return function(e){return t.replace("{value}",null!=e?e:"")}}(e),s.map(n,e)):"function"==typeof e?s.map(a,function(i,n){return e(u.getAxisRawValue(t,i),n)},this):n},u.getAxisRawValue=function(t,e){return"category"===t.type?t.scale.getLabel(e):e},t.exports=u},function(t,e){var i="undefined"==typeof Float32Array?Array:Float32Array,n={create:function(){var t=new i(6);return n.identity(t),t},identity:function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},copy:function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t},mul:function(t,e,i){var n=e[0]*i[0]+e[2]*i[1],a=e[1]*i[0]+e[3]*i[1],o=e[0]*i[2]+e[2]*i[3],r=e[1]*i[2]+e[3]*i[3],s=e[0]*i[4]+e[2]*i[5]+e[4],l=e[1]*i[4]+e[3]*i[5]+e[5];return t[0]=n,t[1]=a,t[2]=o,t[3]=r,t[4]=s,t[5]=l,t},translate:function(t,e,i){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4]+i[0],t[5]=e[5]+i[1],t},rotate:function(t,e,i){var n=e[0],a=e[2],o=e[4],r=e[1],s=e[3],l=e[5],u=Math.sin(i),h=Math.cos(i);return t[0]=n*h+r*u,t[1]=-n*u+r*h,t[2]=a*h+s*u,t[3]=-a*u+h*s,t[4]=h*o+u*l,t[5]=h*l-u*o,t},scale:function(t,e,i){var n=i[0],a=i[1];return t[0]=e[0]*n,t[1]=e[1]*a,t[2]=e[2]*n,t[3]=e[3]*a,t[4]=e[4]*n,t[5]=e[5]*a,t},invert:function(t,e){var i=e[0],n=e[2],a=e[4],o=e[1],r=e[3],s=e[5],l=i*r-o*n;return l?(l=1/l,t[0]=r*l,t[1]=-o*l,t[2]=-n*l,t[3]=i*l,t[4]=(n*s-r*a)*l,t[5]=(o*a-i*s)*l,t):null}};t.exports=n},function(t,e,i){"use strict";function n(t){return t>-w&&t<w;
}function a(t){return t>w||t<-w}function o(t,e,i,n,a){var o=1-a;return o*o*(o*t+3*a*e)+a*a*(a*n+3*o*i)}function r(t,e,i,n,a){var o=1-a;return 3*(((e-t)*o+2*(i-e)*a)*o+(n-i)*a*a)}function s(t,e,i,a,o,r){var s=a+3*(e-i)-t,l=3*(i-2*e+t),u=3*(e-t),h=t-o,c=l*l-3*s*u,d=l*u-9*s*h,f=u*u-3*l*h,p=0;if(n(c)&&n(d))if(n(l))r[0]=0;else{var g=-u/l;g>=0&&g<=1&&(r[p++]=g)}else{var m=d*d-4*c*f;if(n(m)){var v=d/c,g=-l/s+v,y=-v/2;g>=0&&g<=1&&(r[p++]=g),y>=0&&y<=1&&(r[p++]=y)}else if(m>0){var x=b(m),w=c*l+1.5*s*(-d+x),S=c*l+1.5*s*(-d-x);w=w<0?-_(-w,I):_(w,I),S=S<0?-_(-S,I):_(S,I);var g=(-l-(w+S))/(3*s);g>=0&&g<=1&&(r[p++]=g)}else{var T=(2*c*l-3*s*d)/(2*b(c*c*c)),A=Math.acos(T)/3,C=b(c),L=Math.cos(A),g=(-l-2*C*L)/(3*s),y=(-l+C*(L+M*Math.sin(A)))/(3*s),D=(-l+C*(L-M*Math.sin(A)))/(3*s);g>=0&&g<=1&&(r[p++]=g),y>=0&&y<=1&&(r[p++]=y),D>=0&&D<=1&&(r[p++]=D)}}return p}function l(t,e,i,o,r){var s=6*i-12*e+6*t,l=9*e+3*o-3*t-9*i,u=3*e-3*t,h=0;if(n(l)){if(a(s)){var c=-u/s;c>=0&&c<=1&&(r[h++]=c)}}else{var d=s*s-4*l*u;if(n(d))r[0]=-s/(2*l);else if(d>0){var f=b(d),c=(-s+f)/(2*l),p=(-s-f)/(2*l);c>=0&&c<=1&&(r[h++]=c),p>=0&&p<=1&&(r[h++]=p)}}return h}function u(t,e,i,n,a,o){var r=(e-t)*a+t,s=(i-e)*a+e,l=(n-i)*a+i,u=(s-r)*a+r,h=(l-s)*a+s,c=(h-u)*a+u;o[0]=t,o[1]=r,o[2]=u,o[3]=c,o[4]=c,o[5]=h,o[6]=l,o[7]=n}function h(t,e,i,n,a,r,s,l,u,h,c){var d,f,p,g,m,v=.005,y=1/0;T[0]=u,T[1]=h;for(var _=0;_<1;_+=.05)A[0]=o(t,i,a,s,_),A[1]=o(e,n,r,l,_),g=x(T,A),g<y&&(d=_,y=g);y=1/0;for(var w=0;w<32&&!(v<S);w++)f=d-v,p=d+v,A[0]=o(t,i,a,s,f),A[1]=o(e,n,r,l,f),g=x(A,T),f>=0&&g<y?(d=f,y=g):(C[0]=o(t,i,a,s,p),C[1]=o(e,n,r,l,p),m=x(C,T),p<=1&&m<y?(d=p,y=m):v*=.5);return c&&(c[0]=o(t,i,a,s,d),c[1]=o(e,n,r,l,d)),b(y)}function c(t,e,i,n){var a=1-n;return a*(a*t+2*n*e)+n*n*i}function d(t,e,i,n){return 2*((1-n)*(e-t)+n*(i-e))}function f(t,e,i,o,r){var s=t-2*e+i,l=2*(e-t),u=t-o,h=0;if(n(s)){if(a(l)){var c=-u/l;c>=0&&c<=1&&(r[h++]=c)}}else{var d=l*l-4*s*u;if(n(d)){var c=-l/(2*s);c>=0&&c<=1&&(r[h++]=c)}else if(d>0){var f=b(d),c=(-l+f)/(2*s),p=(-l-f)/(2*s);c>=0&&c<=1&&(r[h++]=c),p>=0&&p<=1&&(r[h++]=p)}}return h}function p(t,e,i){var n=t+i-2*e;return 0===n?.5:(t-e)/n}function g(t,e,i,n,a){var o=(e-t)*n+t,r=(i-e)*n+e,s=(r-o)*n+o;a[0]=t,a[1]=o,a[2]=s,a[3]=s,a[4]=r,a[5]=i}function m(t,e,i,n,a,o,r,s,l){var u,h=.005,d=1/0;T[0]=r,T[1]=s;for(var f=0;f<1;f+=.05){A[0]=c(t,i,a,f),A[1]=c(e,n,o,f);var p=x(T,A);p<d&&(u=f,d=p)}d=1/0;for(var g=0;g<32&&!(h<S);g++){var m=u-h,v=u+h;A[0]=c(t,i,a,m),A[1]=c(e,n,o,m);var p=x(A,T);if(m>=0&&p<d)u=m,d=p;else{C[0]=c(t,i,a,v),C[1]=c(e,n,o,v);var y=x(C,T);v<=1&&y<d?(u=v,d=y):h*=.5}}return l&&(l[0]=c(t,i,a,u),l[1]=c(e,n,o,u)),b(d)}var v=i(6),y=v.create,x=v.distSquare,_=Math.pow,b=Math.sqrt,w=1e-8,S=1e-4,M=b(3),I=1/3,T=y(),A=y(),C=y();t.exports={cubicAt:o,cubicDerivativeAt:r,cubicRootAt:s,cubicExtrema:l,cubicSubdivide:u,cubicProjectPoint:h,quadraticAt:c,quadraticDerivativeAt:d,quadraticRootAt:f,quadraticExtremum:p,quadraticSubdivide:g,quadraticProjectPoint:m}},function(t,e,i){"use strict";function n(t){return t.getBoundingClientRect?t.getBoundingClientRect():{left:0,top:0}}function a(t,e,i,n){return i=i||{},n||!c.canvasSupported?o(t,e,i):c.browser.firefox&&null!=e.layerX&&e.layerX!==e.offsetX?(i.zrX=e.layerX,i.zrY=e.layerY):null!=e.offsetX?(i.zrX=e.offsetX,i.zrY=e.offsetY):o(t,e,i),i}function o(t,e,i){var a=n(t);i.zrX=e.clientX-a.left,i.zrY=e.clientY-a.top}function r(t,e,i){if(e=e||window.event,null!=e.zrX)return e;var n=e.type,o=n&&n.indexOf("touch")>=0;if(o){var r="touchend"!=n?e.targetTouches[0]:e.changedTouches[0];r&&a(t,r,e,i)}else a(t,e,e,i),e.zrDelta=e.wheelDelta?e.wheelDelta/120:-(e.detail||0)/3;var s=e.button;return null==e.which&&void 0!==s&&f.test(e.type)&&(e.which=1&s?1:2&s?3:4&s?2:0),e}function s(t,e,i){d?t.addEventListener(e,i):t.attachEvent("on"+e,i)}function l(t,e,i){d?t.removeEventListener(e,i):t.detachEvent("on"+e,i)}function u(t){return t.which>1}var h=i(23),c=i(10),d="undefined"!=typeof window&&!!window.addEventListener,f=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,p=d?function(t){t.preventDefault(),t.stopPropagation(),t.cancelBubble=!0}:function(t){t.returnValue=!1,t.cancelBubble=!0};t.exports={clientToLocal:a,normalizeEvent:r,addEventListener:s,removeEventListener:l,notLeftMouse:u,stop:p,Dispatcher:h}},function(t,e,i){function n(t){return t=Math.round(t),t<0?0:t>255?255:t}function a(t){return t=Math.round(t),t<0?0:t>360?360:t}function o(t){return t<0?0:t>1?1:t}function r(t){return n(t.length&&"%"===t.charAt(t.length-1)?parseFloat(t)/100*255:parseInt(t,10))}function s(t){return o(t.length&&"%"===t.charAt(t.length-1)?parseFloat(t)/100:parseFloat(t))}function l(t,e,i){return i<0?i+=1:i>1&&(i-=1),6*i<1?t+(e-t)*i*6:2*i<1?e:3*i<2?t+(e-t)*(2/3-i)*6:t}function u(t,e,i){return t+(e-t)*i}function h(t,e,i,n,a){return t[0]=e,t[1]=i,t[2]=n,t[3]=a,t}function c(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function d(t,e){T&&c(T,e),T=I.put(t,T||e.slice())}function f(t,e){if(t){e=e||[];var i=I.get(t);if(i)return c(e,i);t+="";var n=t.replace(/ /g,"").toLowerCase();if(n in M)return c(e,M[n]),d(t,e),e;if("#"!==n.charAt(0)){var a=n.indexOf("("),o=n.indexOf(")");if(a!==-1&&o+1===n.length){var l=n.substr(0,a),u=n.substr(a+1,o-(a+1)).split(","),f=1;switch(l){case"rgba":if(4!==u.length)return void h(e,0,0,0,1);f=s(u.pop());case"rgb":return 3!==u.length?void h(e,0,0,0,1):(h(e,r(u[0]),r(u[1]),r(u[2]),f),d(t,e),e);case"hsla":return 4!==u.length?void h(e,0,0,0,1):(u[3]=s(u[3]),p(u,e),d(t,e),e);case"hsl":return 3!==u.length?void h(e,0,0,0,1):(p(u,e),d(t,e),e);default:return}}h(e,0,0,0,1)}else{if(4===n.length){var g=parseInt(n.substr(1),16);return g>=0&&g<=4095?(h(e,(3840&g)>>4|(3840&g)>>8,240&g|(240&g)>>4,15&g|(15&g)<<4,1),d(t,e),e):void h(e,0,0,0,1)}if(7===n.length){var g=parseInt(n.substr(1),16);return g>=0&&g<=16777215?(h(e,(16711680&g)>>16,(65280&g)>>8,255&g,1),d(t,e),e):void h(e,0,0,0,1)}}}}function p(t,e){var i=(parseFloat(t[0])%360+360)%360/360,a=s(t[1]),o=s(t[2]),r=o<=.5?o*(a+1):o+a-o*a,u=2*o-r;return e=e||[],h(e,n(255*l(u,r,i+1/3)),n(255*l(u,r,i)),n(255*l(u,r,i-1/3)),1),4===t.length&&(e[3]=t[3]),e}function g(t){if(t){var e,i,n=t[0]/255,a=t[1]/255,o=t[2]/255,r=Math.min(n,a,o),s=Math.max(n,a,o),l=s-r,u=(s+r)/2;if(0===l)e=0,i=0;else{i=u<.5?l/(s+r):l/(2-s-r);var h=((s-n)/6+l/2)/l,c=((s-a)/6+l/2)/l,d=((s-o)/6+l/2)/l;n===s?e=d-c:a===s?e=1/3+h-d:o===s&&(e=2/3+c-h),e<0&&(e+=1),e>1&&(e-=1)}var f=[360*e,i,u];return null!=t[3]&&f.push(t[3]),f}}function m(t,e){var i=f(t);if(i){for(var n=0;n<3;n++)e<0?i[n]=i[n]*(1-e)|0:i[n]=(255-i[n])*e+i[n]|0;return w(i,4===i.length?"rgba":"rgb")}}function v(t,e){var i=f(t);if(i)return((1<<24)+(i[0]<<16)+(i[1]<<8)+ +i[2]).toString(16).slice(1)}function y(t,e,i){if(e&&e.length&&t>=0&&t<=1){i=i||[];var a=t*(e.length-1),r=Math.floor(a),s=Math.ceil(a),l=e[r],h=e[s],c=a-r;return i[0]=n(u(l[0],h[0],c)),i[1]=n(u(l[1],h[1],c)),i[2]=n(u(l[2],h[2],c)),i[3]=o(u(l[3],h[3],c)),i}}function x(t,e,i){if(e&&e.length&&t>=0&&t<=1){var a=t*(e.length-1),r=Math.floor(a),s=Math.ceil(a),l=f(e[r]),h=f(e[s]),c=a-r,d=w([n(u(l[0],h[0],c)),n(u(l[1],h[1],c)),n(u(l[2],h[2],c)),o(u(l[3],h[3],c))],"rgba");return i?{color:d,leftIndex:r,rightIndex:s,value:a}:d}}function _(t,e,i,n){if(t=f(t))return t=g(t),null!=e&&(t[0]=a(e)),null!=i&&(t[1]=s(i)),null!=n&&(t[2]=s(n)),w(p(t),"rgba")}function b(t,e){if(t=f(t),t&&null!=e)return t[3]=o(e),w(t,"rgba")}function w(t,e){if(t&&t.length){var i=t[0]+","+t[1]+","+t[2];return"rgba"!==e&&"hsva"!==e&&"hsla"!==e||(i+=","+t[3]),e+"("+i+")"}}var S=i(73),M={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]},I=new S(20),T=null;t.exports={parse:f,lift:m,toHex:v,fastLerp:y,fastMapToColor:y,lerp:x,mapToColor:x,modifyHSL:_,modifyAlpha:b,stringify:w}},function(t,e){var i=Array.prototype.slice,n=function(){this._$handlers={}};n.prototype={constructor:n,one:function(t,e,i){var n=this._$handlers;if(!e||!t)return this;n[t]||(n[t]=[]);for(var a=0;a<n[t].length;a++)if(n[t][a].h===e)return this;return n[t].push({h:e,one:!0,ctx:i||this}),this},on:function(t,e,i){var n=this._$handlers;if(!e||!t)return this;n[t]||(n[t]=[]);for(var a=0;a<n[t].length;a++)if(n[t][a].h===e)return this;return n[t].push({h:e,one:!1,ctx:i||this}),this},isSilent:function(t){var e=this._$handlers;return e[t]&&e[t].length},off:function(t,e){var i=this._$handlers;if(!t)return this._$handlers={},this;if(e){if(i[t]){for(var n=[],a=0,o=i[t].length;a<o;a++)i[t][a].h!=e&&n.push(i[t][a]);i[t]=n}i[t]&&0===i[t].length&&delete i[t]}else delete i[t];return this},trigger:function(t){if(this._$handlers[t]){var e=arguments,n=e.length;n>3&&(e=i.call(e,1));for(var a=this._$handlers[t],o=a.length,r=0;r<o;){switch(n){case 1:a[r].h.call(a[r].ctx);break;case 2:a[r].h.call(a[r].ctx,e[1]);break;case 3:a[r].h.call(a[r].ctx,e[1],e[2]);break;default:a[r].h.apply(a[r].ctx,e)}a[r].one?(a.splice(r,1),o--):r++}}return this},triggerWithContext:function(t){if(this._$handlers[t]){var e=arguments,n=e.length;n>4&&(e=i.call(e,1,e.length-1));for(var a=e[e.length-1],o=this._$handlers[t],r=o.length,s=0;s<r;){switch(n){case 1:o[s].h.call(a);break;case 2:o[s].h.call(a,e[1]);break;case 3:o[s].h.call(a,e[1],e[2]);break;default:o[s].h.apply(a,e)}o[s].one?(o.splice(s,1),r--):s++}}return this}},t.exports=n},function(t,e,i){"use strict";var n=i(3),a=i(12),o=n.extendShape({type:"triangle",shape:{cx:0,cy:0,width:0,height:0},buildPath:function(t,e){var i=e.cx,n=e.cy,a=e.width/2,o=e.height/2;t.moveTo(i,n-o),t.lineTo(i+a,n+o),t.lineTo(i-a,n+o),t.closePath()}}),r=n.extendShape({type:"diamond",shape:{cx:0,cy:0,width:0,height:0},buildPath:function(t,e){var i=e.cx,n=e.cy,a=e.width/2,o=e.height/2;t.moveTo(i,n-o),t.lineTo(i+a,n),t.lineTo(i,n+o),t.lineTo(i-a,n),t.closePath()}}),s=n.extendShape({type:"pin",shape:{x:0,y:0,width:0,height:0},buildPath:function(t,e){var i=e.x,n=e.y,a=e.width/5*3,o=Math.max(a,e.height),r=a/2,s=r*r/(o-r),l=n-o+r+s,u=Math.asin(s/r),h=Math.cos(u)*r,c=Math.sin(u),d=Math.cos(u);t.arc(i,l,r,Math.PI-u,2*Math.PI+u);var f=.6*r,p=.7*r;t.bezierCurveTo(i+h-c*f,l+s+d*f,i,n-p,i,n),t.bezierCurveTo(i,n-p,i-h+c*f,l+s+d*f,i-h,l+s),t.closePath()}}),l=n.extendShape({type:"arrow",shape:{x:0,y:0,width:0,height:0},buildPath:function(t,e){var i=e.height,n=e.width,a=e.x,o=e.y,r=n/3*2;t.moveTo(a,o),t.lineTo(a+r,o+i),t.lineTo(a,o+i/4*3),t.lineTo(a-r,o+i),t.lineTo(a,o),t.closePath()}}),u={line:n.Line,rect:n.Rect,roundRect:n.Rect,square:n.Rect,circle:n.Circle,diamond:r,pin:s,arrow:l,triangle:o},h={line:function(t,e,i,n,a){a.x1=t,a.y1=e+n/2,a.x2=t+i,a.y2=e+n/2},rect:function(t,e,i,n,a){a.x=t,a.y=e,a.width=i,a.height=n},roundRect:function(t,e,i,n,a){a.x=t,a.y=e,a.width=i,a.height=n,a.r=Math.min(i,n)/4},square:function(t,e,i,n,a){var o=Math.min(i,n);a.x=t,a.y=e,a.width=o,a.height=o},circle:function(t,e,i,n,a){a.cx=t+i/2,a.cy=e+n/2,a.r=Math.min(i,n)/2},diamond:function(t,e,i,n,a){a.cx=t+i/2,a.cy=e+n/2,a.width=i,a.height=n},pin:function(t,e,i,n,a){a.x=t+i/2,a.y=e+n/2,a.width=i,a.height=n},arrow:function(t,e,i,n,a){a.x=t+i/2,a.y=e+n/2,a.width=i,a.height=n},triangle:function(t,e,i,n,a){a.cx=t+i/2,a.cy=e+n/2,a.width=i,a.height=n}},c={};for(var d in u)u.hasOwnProperty(d)&&(c[d]=new u[d]);var f=n.extendShape({type:"symbol",shape:{symbolType:"",x:0,y:0,width:0,height:0},beforeBrush:function(){var t=this.style,e=this.shape;"pin"===e.symbolType&&"inside"===t.textPosition&&(t.textPosition=["50%","40%"],t.textAlign="center",t.textVerticalAlign="middle")},buildPath:function(t,e,i){var n=e.symbolType,a=c[n];"none"!==e.symbolType&&(a||(n="rect",a=c[n]),h[n](e.x,e.y,e.width,e.height,a.shape),a.buildPath(t,a.shape,i))}}),p=function(t){if("image"!==this.type){var e=this.style,i=this.shape;i&&"line"===i.symbolType?e.stroke=t:this.__isEmptyBrush?(e.stroke=t,e.fill="#fff"):(e.fill&&(e.fill=t),e.stroke&&(e.stroke=t)),this.dirty(!1)}},g={createSymbol:function(t,e,i,o,r,s){var l=0===t.indexOf("empty");l&&(t=t.substr(5,1).toLowerCase()+t.substr(6));var u;return u=0===t.indexOf("image://")?new n.Image({style:{image:t.slice(8),x:e,y:i,width:o,height:r}}):0===t.indexOf("path://")?n.makePath(t.slice(7),{},new a(e,i,o,r)):new f({shape:{symbolType:t,x:e,y:i,width:o,height:r}}),u.__isEmptyBrush=l,u.setColor=p,u.setColor(s),u}};t.exports=g},function(t,e,i){function n(t,e,i){function n(t,e,i){c[e]?t.otherDims[e]=i:(t.coordDim=e,t.coordDimIndex=i,m.set(e,!0))}function r(t,e,i){if(i||null!=e.get(t)){for(var n=0;null!=e.get(t+n);)n++;t+=n}return e.set(t,!0),t}e=e||[],i=i||{},t=(t||[]).slice();var f=(i.dimsDef||[]).slice(),p=o.createHashMap(i.encodeDef),g=o.createHashMap(),m=o.createHashMap(),v=[],y=i.dimCount;if(null==y){var x=a(e[0]);y=Math.max(o.isArray(x)&&x.length||1,t.length,f.length),s(t,function(t){var e=t.dimsDef;e&&(y=Math.max(y,e.length))})}for(var _=0;_<y;_++){var b=l(f[_])?{name:f[_]}:f[_]||{},w=b.name,S=v[_]={otherDims:{}};null!=w&&null==g.get(w)&&(S.name=S.tooltipName=w,g.set(w,_)),null!=b.type&&(S.type=b.type)}p.each(function(t,e){t=p.set(e,h(t).slice()),s(t,function(i,a){l(i)&&(i=g.get(i)),null!=i&&i<y&&(t[a]=i,n(v[i],e,a))})});var M=0;s(t,function(t,e){var i,t,a,r;l(t)?(i=t,t={}):(i=t.name,t=o.clone(t),a=t.dimsDef,r=t.otherDims,t.name=t.coordDim=t.coordDimIndex=t.dimsDef=t.otherDims=null);var c=h(p.get(i));if(!c.length)for(var d=0;d<(a&&a.length||1);d++){for(;M<v.length&&null!=v[M].coordDim;)M++;M<v.length&&c.push(M++)}s(c,function(e,o){var s=v[e];n(u(s,t),i,o),null==s.name&&a&&(s.name=s.tooltipName=a[o]),r&&u(s.otherDims,r)})});for(var I=i.extraPrefix||"value",T=0;T<y;T++){var S=v[T]=v[T]||{},A=S.coordDim;null==A&&(S.coordDim=r(I,m,i.extraFromZero),S.coordDimIndex=0,S.isExtraCoord=!0),null==S.name&&(S.name=r(S.coordDim,g)),null==S.type&&d(e,T)&&(S.type="ordinal")}return v}function a(t){return o.isArray(t)?t:o.isObject(t)?t.value:t}var o=i(1),r=i(5),s=o.each,l=o.isString,u=o.defaults,h=r.normalizeToArray,c={tooltip:1,label:1,itemName:1},d=n.guessOrdinal=function(t,e){for(var i=0,n=t.length;i<n;i++){var r=a(t[i]);if(!o.isArray(r))return!1;var r=r[e];if(null!=r&&isFinite(r)&&""!==r)return!1;if(l(r)&&"-"!==r)return!0}return!1};t.exports=n},function(t,e,i){"use strict";function n(){this._coordinateSystems=[]}var a=i(1),o={};n.prototype={constructor:n,create:function(t,e){var i=[];a.each(o,function(n,a){var o=n.create(t,e);i=i.concat(o||[])}),this._coordinateSystems=i},update:function(t,e){a.each(this._coordinateSystems,function(i){i.update&&i.update(t,e)})},getCoordinateSystems:function(){return this._coordinateSystems.slice()}},n.register=function(t,e){o[t]=e},n.get=function(t){return o[t]},t.exports=n},function(t,e,i){"use strict";var n=i(20),a=i(6),o=i(90),r=i(12),s=i(35).devicePixelRatio,l={M:1,L:2,C:3,Q:4,A:5,Z:6,R:7},u=[],h=[],c=[],d=[],f=Math.min,p=Math.max,g=Math.cos,m=Math.sin,v=Math.sqrt,y=Math.abs,x="undefined"!=typeof Float32Array,_=function(t){this._saveData=!t,this._saveData&&(this.data=[]),this._ctx=null};_.prototype={constructor:_,_xi:0,_yi:0,_x0:0,_y0:0,_ux:0,_uy:0,_len:0,_lineDash:null,_dashOffset:0,_dashIdx:0,_dashSum:0,setScale:function(t,e){this._ux=y(1/s/t)||0,this._uy=y(1/s/e)||0},getContext:function(){return this._ctx},beginPath:function(t){return this._ctx=t,t&&t.beginPath(),t&&(this.dpr=t.dpr),this._saveData&&(this._len=0),this._lineDash&&(this._lineDash=null,this._dashOffset=0),this},moveTo:function(t,e){return this.addData(l.M,t,e),this._ctx&&this._ctx.moveTo(t,e),this._x0=t,this._y0=e,this._xi=t,this._yi=e,this},lineTo:function(t,e){var i=y(t-this._xi)>this._ux||y(e-this._yi)>this._uy||this._len<5;return this.addData(l.L,t,e),this._ctx&&i&&(this._needsDash()?this._dashedLineTo(t,e):this._ctx.lineTo(t,e)),i&&(this._xi=t,this._yi=e),this},bezierCurveTo:function(t,e,i,n,a,o){return this.addData(l.C,t,e,i,n,a,o),this._ctx&&(this._needsDash()?this._dashedBezierTo(t,e,i,n,a,o):this._ctx.bezierCurveTo(t,e,i,n,a,o)),this._xi=a,this._yi=o,this},quadraticCurveTo:function(t,e,i,n){return this.addData(l.Q,t,e,i,n),this._ctx&&(this._needsDash()?this._dashedQuadraticTo(t,e,i,n):this._ctx.quadraticCurveTo(t,e,i,n)),this._xi=i,this._yi=n,this},arc:function(t,e,i,n,a,o){return this.addData(l.A,t,e,i,i,n,a-n,0,o?0:1),this._ctx&&this._ctx.arc(t,e,i,n,a,o),this._xi=g(a)*i+t,this._yi=m(a)*i+t,this},arcTo:function(t,e,i,n,a){return this._ctx&&this._ctx.arcTo(t,e,i,n,a),this},rect:function(t,e,i,n){return this._ctx&&this._ctx.rect(t,e,i,n),this.addData(l.R,t,e,i,n),this},closePath:function(){this.addData(l.Z);var t=this._ctx,e=this._x0,i=this._y0;return t&&(this._needsDash()&&this._dashedLineTo(e,i),t.closePath()),this._xi=e,this._yi=i,this},fill:function(t){t&&t.fill(),this.toStatic()},stroke:function(t){t&&t.stroke(),this.toStatic()},setLineDash:function(t){if(t instanceof Array){this._lineDash=t,this._dashIdx=0;for(var e=0,i=0;i<t.length;i++)e+=t[i];this._dashSum=e}return this},setLineDashOffset:function(t){return this._dashOffset=t,this},len:function(){return this._len},setData:function(t){var e=t.length;this.data&&this.data.length==e||!x||(this.data=new Float32Array(e));for(var i=0;i<e;i++)this.data[i]=t[i];this._len=e},appendPath:function(t){t instanceof Array||(t=[t]);for(var e=t.length,i=0,n=this._len,a=0;a<e;a++)i+=t[a].len();x&&this.data instanceof Float32Array&&(this.data=new Float32Array(n+i));for(var a=0;a<e;a++)for(var o=t[a].data,r=0;r<o.length;r++)this.data[n++]=o[r];this._len=n},addData:function(t){if(this._saveData){var e=this.data;this._len+arguments.length>e.length&&(this._expandData(),e=this.data);for(var i=0;i<arguments.length;i++)e[this._len++]=arguments[i];this._prevCmd=t}},_expandData:function(){if(!(this.data instanceof Array)){for(var t=[],e=0;e<this._len;e++)t[e]=this.data[e];this.data=t}},_needsDash:function(){return this._lineDash},_dashedLineTo:function(t,e){var i,n,a=this._dashSum,o=this._dashOffset,r=this._lineDash,s=this._ctx,l=this._xi,u=this._yi,h=t-l,c=e-u,d=v(h*h+c*c),g=l,m=u,y=r.length;for(h/=d,c/=d,o<0&&(o=a+o),o%=a,g-=o*h,m-=o*c;h>0&&g<=t||h<0&&g>=t||0==h&&(c>0&&m<=e||c<0&&m>=e);)n=this._dashIdx,i=r[n],g+=h*i,m+=c*i,this._dashIdx=(n+1)%y,h>0&&g<l||h<0&&g>l||c>0&&m<u||c<0&&m>u||s[n%2?"moveTo":"lineTo"](h>=0?f(g,t):p(g,t),c>=0?f(m,e):p(m,e));h=g-t,c=m-e,this._dashOffset=-v(h*h+c*c)},_dashedBezierTo:function(t,e,i,a,o,r){var s,l,u,h,c,d=this._dashSum,f=this._dashOffset,p=this._lineDash,g=this._ctx,m=this._xi,y=this._yi,x=n.cubicAt,_=0,b=this._dashIdx,w=p.length,S=0;for(f<0&&(f=d+f),f%=d,s=0;s<1;s+=.1)l=x(m,t,i,o,s+.1)-x(m,t,i,o,s),u=x(y,e,a,r,s+.1)-x(y,e,a,r,s),_+=v(l*l+u*u);for(;b<w&&(S+=p[b],!(S>f));b++);for(s=(S-f)/_;s<=1;)h=x(m,t,i,o,s),c=x(y,e,a,r,s),b%2?g.moveTo(h,c):g.lineTo(h,c),s+=p[b]/_,b=(b+1)%w;b%2!==0&&g.lineTo(o,r),l=o-h,u=r-c,this._dashOffset=-v(l*l+u*u)},_dashedQuadraticTo:function(t,e,i,n){var a=i,o=n;i=(i+2*t)/3,n=(n+2*e)/3,t=(this._xi+2*t)/3,e=(this._yi+2*e)/3,this._dashedBezierTo(t,e,i,n,a,o)},toStatic:function(){var t=this.data;t instanceof Array&&(t.length=this._len,x&&(this.data=new Float32Array(t)))},getBoundingRect:function(){u[0]=u[1]=c[0]=c[1]=Number.MAX_VALUE,h[0]=h[1]=d[0]=d[1]=-Number.MAX_VALUE;for(var t=this.data,e=0,i=0,n=0,s=0,f=0;f<t.length;){var p=t[f++];switch(1==f&&(e=t[f],i=t[f+1],n=e,s=i),p){case l.M:n=t[f++],s=t[f++],e=n,i=s,c[0]=n,c[1]=s,d[0]=n,d[1]=s;break;case l.L:o.fromLine(e,i,t[f],t[f+1],c,d),e=t[f++],i=t[f++];break;case l.C:o.fromCubic(e,i,t[f++],t[f++],t[f++],t[f++],t[f],t[f+1],c,d),e=t[f++],i=t[f++];break;case l.Q:o.fromQuadratic(e,i,t[f++],t[f++],t[f],t[f+1],c,d),e=t[f++],i=t[f++];break;case l.A:var v=t[f++],y=t[f++],x=t[f++],_=t[f++],b=t[f++],w=t[f++]+b,S=(t[f++],1-t[f++]);1==f&&(n=g(b)*x+v,s=m(b)*_+y),o.fromArc(v,y,x,_,b,w,S,c,d),e=g(w)*x+v,i=m(w)*_+y;break;case l.R:n=e=t[f++],s=i=t[f++];var M=t[f++],I=t[f++];o.fromLine(n,s,n+M,s+I,c,d);break;case l.Z:e=n,i=s}a.min(u,u,c),a.max(h,h,d)}return 0===f&&(u[0]=u[1]=h[0]=h[1]=0),new r(u[0],u[1],h[0]-u[0],h[1]-u[1])},rebuildPath:function(t){for(var e,i,n,a,o,r,s=this.data,u=this._ux,h=this._uy,c=this._len,d=0;d<c;){var f=s[d++];switch(1==d&&(n=s[d],a=s[d+1],e=n,i=a),f){case l.M:e=n=s[d++],i=a=s[d++],t.moveTo(n,a);break;case l.L:o=s[d++],r=s[d++],(y(o-n)>u||y(r-a)>h||d===c-1)&&(t.lineTo(o,r),n=o,a=r);break;case l.C:t.bezierCurveTo(s[d++],s[d++],s[d++],s[d++],s[d++],s[d++]),n=s[d-2],a=s[d-1];break;case l.Q:t.quadraticCurveTo(s[d++],s[d++],s[d++],s[d++]),n=s[d-2],a=s[d-1];break;case l.A:var p=s[d++],v=s[d++],x=s[d++],_=s[d++],b=s[d++],w=s[d++],S=s[d++],M=s[d++],I=x>_?x:_,T=x>_?1:x/_,A=x>_?_/x:1,C=Math.abs(x-_)>.001,L=b+w;C?(t.translate(p,v),t.rotate(S),t.scale(T,A),t.arc(0,0,I,b,L,1-M),t.scale(1/T,1/A),t.rotate(-S),t.translate(-p,-v)):t.arc(p,v,I,b,L,1-M),1==d&&(e=g(b)*x+p,i=m(b)*_+v),n=g(L)*x+p,a=m(L)*_+v;break;case l.R:e=n=s[d],i=a=s[d+1],t.rect(s[d++],s[d++],s[d++],s[d++]);break;case l.Z:t.closePath(),n=e,a=i}}}},_.CMD=l,t.exports=_},function(t,e,i){"use strict";function n(t){for(var e=0;e<t.length&&null==t[e];)e++;return t[e]}function a(t){var e=n(t);return null!=e&&!c.isArray(p(e))}function o(t,e,i){t=t||[];var n=e.get("coordinateSystem"),o=m[n],r=f.get(n),s={encodeDef:e.get("encode"),dimsDef:e.get("dimensions")},v=o&&o(t,e,i,s),y=v&&v.dimensions;y||(y=r&&(r.getDimensionsInfo?r.getDimensionsInfo():r.dimensions.slice())||["x","y"],y=h(y,t,s));var x=v?v.categoryIndex:-1,_=new u(y,e),b=l(v,t),w={},S=x>=0&&a(t)?function(t,e,i,n){return d.isDataItemOption(t)&&(_.hasItemOption=!0),n===x?i:g(p(t),y[n])}:function(t,e,i,n){var a=p(t),o=g(a&&a[n],y[n]);d.isDataItemOption(t)&&(_.hasItemOption=!0);var r=v&&v.categoryAxesModels;return r&&r[e]&&"string"==typeof o&&(w[e]=w[e]||r[e].getCategories(),o=c.indexOf(w[e],o),o<0&&!isNaN(o)&&(o=+o)),o};return _.hasItemOption=!1,_.initData(t,b,S),_}function r(t){return"category"!==t&&"time"!==t}function s(t){return"category"===t?"ordinal":"time"===t?"time":"float"}function l(t,e){var i,n=[],a=t&&t.dimensions[t.categoryIndex];if(a&&(i=t.categoryAxesModels[a.name]),i){var o=i.getCategories();if(o){var r=e.length;if(c.isArray(e[0])&&e[0].length>1){n=[];for(var s=0;s<r;s++)n[s]=o[e[s][t.categoryIndex||0]]}else n=o.slice(0)}}return n}var u=i(14),h=i(25),c=i(1),d=i(5),f=i(26),p=d.getDataItemValue,g=d.converDataValue,m={cartesian2d:function(t,e,i,n){var a=c.map(["xAxis","yAxis"],function(t){return i.queryComponents({mainType:t,index:e.get(t+"Index"),id:e.get(t+"Id")})[0]}),o=a[0],l=a[1],u=o.get("type"),d=l.get("type"),f=[{name:"x",type:s(u),stackable:r(u)},{name:"y",type:s(d),stackable:r(d)}],p="category"===u,g="category"===d;f=h(f,t,n);var m={};return p&&(m.x=o),g&&(m.y=l),{dimensions:f,categoryIndex:p?0:g?1:-1,categoryAxesModels:m}},singleAxis:function(t,e,i,n){var a=i.queryComponents({mainType:"singleAxis",index:e.get("singleAxisIndex"),id:e.get("singleAxisId")})[0],o=a.get("type"),l="category"===o,u=[{name:"single",type:s(o),stackable:r(o)}];u=h(u,t,n);var c={};return l&&(c.single=a),{dimensions:u,categoryIndex:l?0:-1,categoryAxesModels:c}},polar:function(t,e,i,n){var a=i.queryComponents({mainType:"polar",index:e.get("polarIndex"),id:e.get("polarId")})[0],o=a.findAxisModel("angleAxis"),l=a.findAxisModel("radiusAxis"),u=l.get("type"),c=o.get("type"),d=[{name:"radius",type:s(u),stackable:r(u)},{name:"angle",type:s(c),stackable:r(c)}],f="category"===c,p="category"===u;d=h(d,t,n);var g={};return p&&(g.radius=l),f&&(g.angle=o),{dimensions:d,categoryIndex:f?1:p?0:-1,categoryAxesModels:g}},geo:function(t,e,i,n){return{dimensions:h([{name:"lng"},{name:"lat"}],t,n)}}};t.exports=o},function(t,e){"use strict";var i={};t.exports={register:function(t,e){i[t]=e},get:function(t){return i[t]}}},function(t,e,i){function n(){this.group=new r,this.uid=s.getUID("viewChart")}function a(t,e){if(t&&(t.trigger(e),"group"===t.type))for(var i=0;i<t.childCount();i++)a(t.childAt(i),e)}function o(t,e,i){var n=u.queryDataIndex(t,e);null!=n?h.each(u.normalizeToArray(n),function(e){a(t.getItemGraphicEl(e),i)}):t.eachItemGraphicEl(function(t){a(t,i)})}var r=i(36),s=i(50),l=i(15),u=i(5),h=i(1);n.prototype={type:"chart",init:function(t,e){},render:function(t,e,i,n){},highlight:function(t,e,i,n){o(t.getData(),n,"emphasis")},downplay:function(t,e,i,n){o(t.getData(),n,"normal")},remove:function(t,e){this.group.removeAll()},dispose:function(){}};var c=n.prototype;c.updateView=c.updateLayout=c.updateVisual=function(t,e,i,n){this.render(t,e,i,n)},l.enableClassExtend(n,["dispose"]),l.enableClassManagement(n,{registerWhenExtend:!0}),t.exports=n},function(t,e,i){var n=i(1);t.exports=function(t){for(var e=0;e<t.length;e++)t[e][1]||(t[e][1]=t[e][0]);return function(e,i){for(var a={},o=0;o<t.length;o++){var r=t[o][1];if(!(e&&n.indexOf(e,r)>=0||i&&n.indexOf(i,r)<0)){var s=this.getShallow(r);null!=s&&(a[t[o][0]]=s)}}return a}}},function(t,e,i){"use strict";var n=i(3),a=i(1),o=i(2);i(60),i(122),o.extendComponentView({type:"grid",render:function(t,e){this.group.removeAll(),t.get("show")&&this.group.add(new n.Rect({shape:t.coordinateSystem.getRect(),style:a.defaults({fill:t.get("backgroundColor")},t.getItemStyle()),silent:!0,z2:-1}))}}),o.registerPreprocessor(function(t){t.xAxis&&t.yAxis&&!t.grid&&(t.grid={})})},function(t,e,i){function n(t,e){var i=t[1]-t[0],n=e,a=i/n/2;t[0]+=a,t[1]-=a}var a=i(4),o=a.linearMap,r=i(1),s=i(18),l=[0,1],u=function(t,e,i){this.dim=t,this.scale=e,this._extent=i||[0,0],this.inverse=!1,this.onBand=!1,this._labelInterval};u.prototype={constructor:u,contain:function(t){var e=this._extent,i=Math.min(e[0],e[1]),n=Math.max(e[0],e[1]);return t>=i&&t<=n},containData:function(t){return this.contain(this.dataToCoord(t))},getExtent:function(){return this._extent.slice()},getPixelPrecision:function(t){return a.getPixelPrecision(t||this.scale.getExtent(),this._extent)},setExtent:function(t,e){var i=this._extent;i[0]=t,i[1]=e},dataToCoord:function(t,e){var i=this._extent,a=this.scale;return t=a.normalize(t),this.onBand&&"ordinal"===a.type&&(i=i.slice(),n(i,a.count())),o(t,l,i,e)},coordToData:function(t,e){var i=this._extent,a=this.scale;this.onBand&&"ordinal"===a.type&&(i=i.slice(),n(i,a.count()));var r=o(t,i,l,e);return this.scale.scale(r)},pointToData:function(t,e){},getTicksCoords:function(t){if(this.onBand&&!t){for(var e=this.getBands(),i=[],n=0;n<e.length;n++)i.push(e[n][0]);return e[n-1]&&i.push(e[n-1][1]),i}return r.map(this.scale.getTicks(),this.dataToCoord,this)},getLabelsCoords:function(){return r.map(this.scale.getTicks(),this.dataToCoord,this)},getBands:function(){for(var t=this.getExtent(),e=[],i=this.scale.count(),n=t[0],a=t[1],o=a-n,r=0;r<i;r++)e.push([o*r/i+n,o*(r+1)/i+n]);return e},getBandWidth:function(){var t=this._extent,e=this.scale.getExtent(),i=e[1]-e[0]+(this.onBand?1:0);0===i&&(i=1);var n=Math.abs(t[1]-t[0]);return Math.abs(n)/i},getLabelInterval:function(){var t=this._labelInterval;if(!t){var e=this.model,i=e.getModel("axisLabel"),n=i.get("interval");"category"!==this.type||"auto"!==n?t="auto"===n?0:n:this.isHorizontal&&(t=s.getAxisLabelInterval(r.map(this.scale.getTicks(),this.dataToCoord,this),e.getFormattedLabels(),i.getFont(),this.isHorizontal())),this._labelInterval=t}return t}},t.exports=u},function(t,e,i){function n(t){this._setting=t||{},this._extent=[1/0,-(1/0)],this._interval=0,this.init&&this.init.apply(this,arguments)}var a=i(15),o=n.prototype;o.parse=function(t){return t},o.getSetting=function(t){return this._setting[t]},o.contain=function(t){var e=this._extent;return t>=e[0]&&t<=e[1]},o.normalize=function(t){var e=this._extent;return e[1]===e[0]?.5:(t-e[0])/(e[1]-e[0])},o.scale=function(t){var e=this._extent;return t*(e[1]-e[0])+e[0]},o.unionExtent=function(t){var e=this._extent;t[0]<e[0]&&(e[0]=t[0]),t[1]>e[1]&&(e[1]=t[1])},o.unionExtentFromData=function(t,e){this.unionExtent(t.getDataExtent(e,!0))},o.getExtent=function(){return this._extent.slice()},o.setExtent=function(t,e){var i=this._extent;isNaN(t)||(i[0]=t),isNaN(e)||(i[1]=e)},o.getTicksLabels=function(){for(var t=[],e=this.getTicks(),i=0;i<e.length;i++)t.push(this.getLabel(e[i]));return t},o.isBlank=function(){return this._isBlank},o.setBlank=function(t){this._isBlank=t},a.enableClassExtend(n),a.enableClassManagement(n,{registerWhenExtend:!0}),t.exports=n},function(t,e){var i=1;"undefined"!=typeof window&&(i=Math.max(window.devicePixelRatio||1,1));var n={debugMode:0,devicePixelRatio:i};t.exports=n},function(t,e,i){var n=i(1),a=i(69),o=i(12),r=function(t){t=t||{},a.call(this,t);for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);this._children=[],this.__storage=null,this.__dirty=!0};r.prototype={constructor:r,isGroup:!0,type:"group",silent:!1,children:function(){return this._children.slice()},childAt:function(t){return this._children[t]},childOfName:function(t){
for(var e=this._children,i=0;i<e.length;i++)if(e[i].name===t)return e[i]},childCount:function(){return this._children.length},add:function(t){return t&&t!==this&&t.parent!==this&&(this._children.push(t),this._doAdd(t)),this},addBefore:function(t,e){if(t&&t!==this&&t.parent!==this&&e&&e.parent===this){var i=this._children,n=i.indexOf(e);n>=0&&(i.splice(n,0,t),this._doAdd(t))}return this},_doAdd:function(t){t.parent&&t.parent.remove(t),t.parent=this;var e=this.__storage,i=this.__zr;e&&e!==t.__storage&&(e.addToStorage(t),t instanceof r&&t.addChildrenToStorage(e)),i&&i.refresh()},remove:function(t){var e=this.__zr,i=this.__storage,a=this._children,o=n.indexOf(a,t);return o<0?this:(a.splice(o,1),t.parent=null,i&&(i.delFromStorage(t),t instanceof r&&t.delChildrenFromStorage(i)),e&&e.refresh(),this)},removeAll:function(){var t,e,i=this._children,n=this.__storage;for(e=0;e<i.length;e++)t=i[e],n&&(n.delFromStorage(t),t instanceof r&&t.delChildrenFromStorage(n)),t.parent=null;return i.length=0,this},eachChild:function(t,e){for(var i=this._children,n=0;n<i.length;n++){var a=i[n];t.call(e,a,n)}return this},traverse:function(t,e){for(var i=0;i<this._children.length;i++){var n=this._children[i];t.call(e,n),"group"===n.type&&n.traverse(t,e)}return this},addChildrenToStorage:function(t){for(var e=0;e<this._children.length;e++){var i=this._children[e];t.addToStorage(i),i instanceof r&&i.addChildrenToStorage(t)}},delChildrenFromStorage:function(t){for(var e=0;e<this._children.length;e++){var i=this._children[e];t.delFromStorage(i),i instanceof r&&i.delChildrenFromStorage(t)}},dirty:function(){return this.__dirty=!0,this.__zr&&this.__zr.refresh(),this},getBoundingRect:function(t){for(var e=null,i=new o(0,0,0,0),n=t||this._children,a=[],r=0;r<n.length;r++){var s=n[r];if(!s.ignore&&!s.invisible){var l=s.getBoundingRect(),u=s.getLocalTransform(a);u?(i.copy(l),i.applyTransform(u),e=e||i.clone(),e.union(i)):(e=e||l.clone(),e.union(l))}}return e||i}},n.inherits(r,a),t.exports=r},function(t,e){var i={},n="\0__throttleOriginMethod",a="\0__throttleRate",o="\0__throttleType";i.throttle=function(t,e,i){function n(){h=(new Date).getTime(),c=null,t.apply(r,s||[])}var a,o,r,s,l,u=0,h=0,c=null;e=e||0;var d=function(){a=(new Date).getTime(),r=this,s=arguments;var t=l||e,d=l||i;l=null,o=a-(d?u:h)-t,clearTimeout(c),d?c=setTimeout(n,t):o>=0?n():c=setTimeout(n,-o),u=a};return d.clear=function(){c&&(clearTimeout(c),c=null)},d.debounceNextCall=function(t){l=t},d},i.createOrUpdate=function(t,e,r,s){var l=t[e];if(l){var u=l[n]||l,h=l[o],c=l[a];if(c!==r||h!==s){if(null==r||!s)return t[e]=u;l=t[e]=i.throttle(u,r,"debounce"===s),l[n]=u,l[o]=s,l[a]=r}return l}},i.clear=function(t,e){var i=t[e];i&&i[n]&&(t[e]=i[n])},t.exports=i},function(t,e,i){function n(t){t=t||{},r.call(this,t);for(var e in t)t.hasOwnProperty(e)&&"style"!==e&&(this[e]=t[e]);this.style=new o(t.style,this),this._rect=null,this.__clipPaths=[]}var a=i(1),o=i(76),r=i(69),s=i(92);n.prototype={constructor:n,type:"displayable",__dirty:!0,invisible:!1,z:0,z2:0,zlevel:0,draggable:!1,dragging:!1,silent:!1,culling:!1,cursor:"pointer",rectHover:!1,progressive:-1,beforeBrush:function(t){},afterBrush:function(t){},brush:function(t,e){},getBoundingRect:function(){},contain:function(t,e){return this.rectContain(t,e)},traverse:function(t,e){t.call(e,this)},rectContain:function(t,e){var i=this.transformCoordToLocal(t,e),n=this.getBoundingRect();return n.contain(i[0],i[1])},dirty:function(){this.__dirty=!0,this._rect=null,this.__zr&&this.__zr.refresh()},animateStyle:function(t){return this.animate("style",t)},attrKV:function(t,e){"style"!==t?r.prototype.attrKV.call(this,t,e):this.style.set(e)},setStyle:function(t,e){return this.style.set(t,e),this.dirty(!1),this},useStyle:function(t){return this.style=new o(t,this),this.dirty(!1),this}},a.inherits(n,r),a.mixin(n,s),t.exports=n},function(t,e){var i=function(t){this.colorStops=t||[]};i.prototype={constructor:i,addColorStop:function(t,e){this.colorStops.push({offset:t,color:e})}},t.exports=i},function(t,e,i){function n(t){var e={componentType:t.mainType};return e[t.mainType+"Index"]=t.componentIndex,e}function a(t,e,i,n){var a,o,r=v(i-t.rotation),s=n[0]>n[1],l="start"===e&&!s||"start"!==e&&s;return y(r-S/2)?(o=l?"bottom":"top",a="center"):y(r-1.5*S)?(o=l?"top":"bottom",a="center"):(o="middle",a=r<1.5*S&&r>S/2?l?"left":"right":l?"right":"left"),{rotation:r,textAlign:a,textVerticalAlign:o}}function o(t){var e=t.get("tooltip");return t.get("silent")||!(t.get("triggerEvent")||e&&e.show)}function r(t,e,i){var n=t.get("axisLabel.showMinLabel"),a=t.get("axisLabel.showMaxLabel");e=e||[],i=i||[];var o=e[0],r=e[1],u=e[e.length-1],h=e[e.length-2],c=i[0],d=i[1],f=i[i.length-1],p=i[i.length-2];n===!1?(s(o),s(c)):l(o,r)&&(n?(s(r),s(d)):(s(o),s(c))),a===!1?(s(u),s(f)):l(h,u)&&(a?(s(h),s(p)):(s(u),s(f)))}function s(t){t&&(t.ignore=!0)}function l(t,e,i){var n=t&&t.getBoundingRect().clone(),a=e&&e.getBoundingRect().clone();if(n&&a){var o=_.identity([]);return _.rotate(o,o,-t.rotation),n.applyTransform(_.mul([],o,t.getLocalTransform())),a.applyTransform(_.mul([],o,e.getLocalTransform())),n.intersect(a)}}function u(t){return"middle"===t||"center"===t}function h(t,e,i){var n=e.axis;if(e.get("axisTick.show")&&!n.scale.isBlank()){for(var a=e.getModel("axisTick"),o=a.getModel("lineStyle"),r=a.get("length"),s=C(a,i.labelInterval),l=n.getTicksCoords(a.get("alignWithLabel")),u=n.scale.getTicks(),h=e.get("axisLabel.showMinLabel"),c=e.get("axisLabel.showMaxLabel"),f=[],g=[],m=t._transform,v=[],y=l.length,x=0;x<y;x++)if(!A(n,x,s,y,h,c)){var _=l[x];f[0]=_,f[1]=0,g[0]=_,g[1]=i.tickDirection*r,m&&(b(f,f,m),b(g,g,m));var w=new p.Line(p.subPixelOptimizeLine({anid:"tick_"+u[x],shape:{x1:f[0],y1:f[1],x2:g[0],y2:g[1]},style:d.defaults(o.getLineStyle(),{stroke:e.get("axisLine.lineStyle.color")}),z2:2,silent:!0}));t.group.add(w),v.push(w)}return v}}function c(t,e,i){var a=e.axis,r=w(i.axisLabelShow,e.get("axisLabel.show"));if(r&&!a.scale.isBlank()){var s=e.getModel("axisLabel"),l=s.get("margin"),u=a.scale.getTicks(),h=e.getFormattedLabels(),c=(w(i.labelRotate,s.get("rotate"))||0)*S/180,f=T(i.rotation,c,i.labelDirection),m=e.get("data"),v=[],y=o(e),x=e.get("triggerEvent"),_=e.get("axisLabel.showMinLabel"),b=e.get("axisLabel.showMaxLabel");return d.each(u,function(o,r){if(!A(a,r,i.labelInterval,u.length,_,b)){var c=s;m&&m[o]&&m[o].textStyle&&(c=new g(m[o].textStyle,s,e.ecModel));var d=c.getTextColor()||e.get("axisLine.lineStyle.color"),w=a.dataToCoord(o),S=[w,i.labelOffset+i.labelDirection*l],M=a.scale.getLabel(o),I=new p.Text({anid:"label_"+o,position:S,rotation:f.rotation,silent:y,z2:10});p.setTextStyle(I.style,c,{text:h[r],textAlign:c.getShallow("align",!0)||f.textAlign,textVerticalAlign:c.getShallow("verticalAlign",!0)||c.getShallow("baseline",!0)||f.textVerticalAlign,textFill:"function"==typeof d?d("category"===a.type?M:"value"===a.type?o+"":o,r):d}),x&&(I.eventData=n(e),I.eventData.targetType="axisLabel",I.eventData.value=M),t._dumbGroup.add(I),I.updateTransform(),v.push(I),t.group.add(I),I.decomposeTransform()}}),v}}var d=i(1),f=i(7),p=i(3),g=i(11),m=i(4),v=m.remRadian,y=m.isRadianAroundZero,x=i(6),_=i(19),b=x.applyTransform,w=d.retrieve,S=Math.PI,M=function(t,e){this.opt=e,this.axisModel=t,d.defaults(e,{labelOffset:0,nameDirection:1,tickDirection:1,labelDirection:1,silent:!0}),this.group=new p.Group;var i=new p.Group({position:e.position.slice(),rotation:e.rotation});i.updateTransform(),this._transform=i.transform,this._dumbGroup=i};M.prototype={constructor:M,hasBuilder:function(t){return!!I[t]},add:function(t){I[t].call(this)},getGroup:function(){return this.group}};var I={axisLine:function(){var t=this.opt,e=this.axisModel;if(e.get("axisLine.show")){var i=this.axisModel.axis.getExtent(),n=this._transform,a=[i[0],0],o=[i[1],0];n&&(b(a,a,n),b(o,o,n)),this.group.add(new p.Line(p.subPixelOptimizeLine({anid:"line",shape:{x1:a[0],y1:a[1],x2:o[0],y2:o[1]},style:d.extend({lineCap:"round"},e.getModel("axisLine.lineStyle").getLineStyle()),strokeContainThreshold:t.strokeContainThreshold||5,silent:!0,z2:1})))}},axisTickLabel:function(){var t=this.axisModel,e=this.opt,i=h(this,t,e),n=c(this,t,e);r(t,n,i)},axisName:function(){var t=this.opt,e=this.axisModel,i=w(t.axisName,e.get("name"));if(i){var r,s=e.get("nameLocation"),l=t.nameDirection,h=e.getModel("nameTextStyle"),c=e.get("nameGap")||0,g=this.axisModel.axis.getExtent(),m=g[0]>g[1]?-1:1,v=["start"===s?g[0]-m*c:"end"===s?g[1]+m*c:(g[0]+g[1])/2,u(s)?t.labelOffset+l*c:0],y=e.get("nameRotate");null!=y&&(y=y*S/180);var x;u(s)?r=T(t.rotation,null!=y?y:t.rotation,l):(r=a(t,s,y||0,g),x=t.axisNameAvailableWidth,null!=x&&(x=Math.abs(x/Math.sin(r.rotation)),!isFinite(x)&&(x=null)));var _=h.getFont(),b=e.get("nameTruncate",!0)||{},M=b.ellipsis,I=w(t.nameTruncateMaxWidth,b.maxWidth,x),A=null!=M&&null!=I?f.truncateText(i,I,_,M,{minChar:2,placeholder:b.placeholder}):i,C=e.get("tooltip",!0),L=e.mainType,D={componentType:L,name:i,$vars:["name"]};D[L+"Index"]=e.componentIndex;var P=new p.Text({anid:"name",__fullText:i,__truncatedText:A,position:v,rotation:r.rotation,silent:o(e),z2:1,tooltip:C&&C.show?d.extend({content:i,formatter:function(){return i},formatterParams:D},C):null});p.setTextStyle(P.style,h,{text:A,textFont:_,textFill:h.getTextColor()||e.get("axisLine.lineStyle.color"),textAlign:r.textAlign,textVerticalAlign:r.textVerticalAlign}),e.get("triggerEvent")&&(P.eventData=n(e),P.eventData.targetType="axisName",P.eventData.name=i),this._dumbGroup.add(P),P.updateTransform(),this.group.add(P),P.decomposeTransform()}}},T=M.innerTextLayout=function(t,e,i){var n,a,o=v(e-t);return y(o)?(a=i>0?"top":"bottom",n="center"):y(o-S)?(a=i>0?"bottom":"top",n="center"):(a="middle",n=o>0&&o<S?i>0?"right":"left":i>0?"left":"right"),{rotation:o,textAlign:n,textVerticalAlign:a}},A=M.ifIgnoreOnTick=function(t,e,i,n,a,o){if(0===e&&a||e===n-1&&o)return!1;var r,s=t.scale;return"ordinal"===s.type&&("function"==typeof i?(r=s.getTicks()[e],!i(r,s.getLabel(r))):e%(i+1))},C=M.getInterval=function(t,e){var i=t.get("interval");return null!=i&&"auto"!=i||(i=e),i};t.exports=M},function(t,e,i){function n(t,e,i,n,s,l){var u=r.getAxisPointerClass(t.axisPointerClass);if(u){var h=o.getAxisPointerModel(e);h?(t._axisPointer||(t._axisPointer=new u)).render(e,h,n,l):a(t,n)}}function a(t,e,i){var n=t._axisPointer;n&&n.dispose(e,i),t._axisPointer=null}var o=i(47),r=i(2).extendComponentView({type:"axis",_axisPointer:null,axisPointerClass:null,render:function(t,e,i,a){this.axisPointerClass&&o.fixValue(t),r.superApply(this,"render",arguments),n(this,t,e,i,a,!0)},updateAxisPointer:function(t,e,i,a,o){n(this,t,e,i,a,!1)},remove:function(t,e){var i=this._axisPointer;i&&i.remove(e),r.superApply(this,"remove",arguments)},dispose:function(t,e){a(this,e),r.superApply(this,"dispose",arguments)}}),s=[];r.registerAxisPointerClass=function(t,e){s[t]=e},r.getAxisPointerClass=function(t){return t&&s[t]},t.exports=r},function(t,e,i){function n(t){return a.isObject(t)&&null!=t.value?t.value:t+""}var a=i(1),o=i(18);t.exports={getFormattedLabels:function(){return o.getFormattedLabels(this.axis,this.get("axisLabel.formatter"))},getCategories:function(){return"category"===this.get("type")&&a.map(this.get("data"),n)},getMin:function(t){var e=this.option,i=t||null==e.rangeStart?e.min:e.rangeStart;return this.axis&&null!=i&&"dataMin"!==i&&"function"!=typeof i&&!a.eqNaN(i)&&(i=this.axis.scale.parse(i)),i},getMax:function(t){var e=this.option,i=t||null==e.rangeEnd?e.max:e.rangeEnd;return this.axis&&null!=i&&"dataMax"!==i&&"function"!=typeof i&&!a.eqNaN(i)&&(i=this.axis.scale.parse(i)),i},getNeedCrossZero:function(){var t=this.option;return null==t.rangeStart&&null==t.rangeEnd&&!t.scale},getCoordSysModel:a.noop,setRange:function(t,e){this.option.rangeStart=t,this.option.rangeEnd=e},resetRange:function(){this.option.rangeStart=this.option.rangeEnd=null}}},function(t,e){"use strict";function i(t){return t}function n(t,e,n,a,o){this._old=t,this._new=e,this._oldKeyGetter=n||i,this._newKeyGetter=a||i,this.context=o}function a(t,e,i,n,a){for(var o=0;o<t.length;o++){var r="_ec_"+a[n](t[o],o),s=e[r];null==s?(i.push(r),e[r]=o):(s.length||(e[r]=s=[s]),s.push(o))}}n.prototype={constructor:n,add:function(t){return this._add=t,this},update:function(t){return this._update=t,this},remove:function(t){return this._remove=t,this},execute:function(){var t,e=this._old,i=this._new,n={},o={},r=[],s=[];for(a(e,n,r,"_oldKeyGetter",this),a(i,o,s,"_newKeyGetter",this),t=0;t<e.length;t++){var l=r[t],u=o[l];if(null!=u){var h=u.length;h?(1===h&&(o[l]=null),u=u.unshift()):o[l]=null,this._update&&this._update(u,t)}else this._remove&&this._remove(t)}for(var t=0;t<s.length;t++){var l=s[t];if(o.hasOwnProperty(l)){var u=o[l];if(null==u)continue;if(u.length)for(var c=0,h=u.length;c<h;c++)this._add&&this._add(u[c]);else this._add&&this._add(u)}}}},t.exports=n},function(t,e){t.exports={toolbox:{brush:{title:{rect:"矩形选择",polygon:"圈选",lineX:"横向选择",lineY:"纵向选择",keep:"保持选择",clear:"清除选择"}},dataView:{title:"数据视图",lang:["数据视图","关闭","刷新"]},dataZoom:{title:{zoom:"区域缩放",back:"区域缩放还原"}},magicType:{title:{line:"切换为折线图",bar:"切换为柱状图",stack:"切换为堆叠",tiled:"切换为平铺"}},restore:{title:"还原"},saveAsImage:{title:"保存为图片",lang:["右键另存为图片"]}}}},function(t,e,i){var n=i(4),a=i(7),o=i(34),r=i(67),s=n.round,l=o.extend({type:"interval",_interval:0,_intervalPrecision:2,setExtent:function(t,e){var i=this._extent;isNaN(t)||(i[0]=parseFloat(t)),isNaN(e)||(i[1]=parseFloat(e))},unionExtent:function(t){var e=this._extent;t[0]<e[0]&&(e[0]=t[0]),t[1]>e[1]&&(e[1]=t[1]),l.prototype.setExtent.call(this,e[0],e[1])},getInterval:function(){return this._interval},setInterval:function(t){this._interval=t,this._niceExtent=this._extent.slice(),this._intervalPrecision=r.getIntervalPrecision(t)},getTicks:function(){return r.intervalScaleGetTicks(this._interval,this._extent,this._niceExtent,this._intervalPrecision)},getTicksLabels:function(){for(var t=[],e=this.getTicks(),i=0;i<e.length;i++)t.push(this.getLabel(e[i]));return t},getLabel:function(t,e){if(null==t)return"";var i=e&&e.precision;return null==i?i=n.getPrecisionSafe(t)||0:"auto"===i&&(i=this._intervalPrecision),t=s(t,i,!0),a.addCommas(t)},niceTicks:function(t,e,i){t=t||5;var n=this._extent,a=n[1]-n[0];if(isFinite(a)){a<0&&(a=-a,n.reverse());var o=r.intervalScaleNiceTicks(n,t,e,i);this._intervalPrecision=o.intervalPrecision,this._interval=o.interval,this._niceExtent=o.niceTickExtent}},niceExtent:function(t){var e=this._extent;if(e[0]===e[1])if(0!==e[0]){var i=e[0];t.fixMax?e[0]-=i/2:(e[1]+=i/2,e[0]-=i/2)}else e[1]=1;var n=e[1]-e[0];isFinite(n)||(e[0]=0,e[1]=1),this.niceTicks(t.splitNumber,t.minInterval,t.maxInterval);var a=this._interval;t.fixMin||(e[0]=s(Math.floor(e[0]/a)*a)),t.fixMax||(e[1]=s(Math.ceil(e[1]/a)*a))}});l.create=function(){return new l},t.exports=l},function(t,e,i){function n(t){this.group=new o.Group,this._symbolCtor=t||r}function a(t,e,i){var n=t.getItemLayout(e);return n&&!isNaN(n[0])&&!isNaN(n[1])&&!(i&&i(e))&&"none"!==t.getItemVisual(e,"symbol")}var o=i(3),r=i(57),s=n.prototype;s.updateData=function(t,e){var i=this.group,n=t.hostModel,r=this._data,s=this._symbolCtor,l={itemStyle:n.getModel("itemStyle.normal").getItemStyle(["color"]),hoverItemStyle:n.getModel("itemStyle.emphasis").getItemStyle(),symbolRotate:n.get("symbolRotate"),symbolOffset:n.get("symbolOffset"),hoverAnimation:n.get("hoverAnimation"),labelModel:n.getModel("label.normal"),hoverLabelModel:n.getModel("label.emphasis"),cursorStyle:n.get("cursor")};t.diff(r).add(function(n){var o=t.getItemLayout(n);if(a(t,n,e)){var r=new s(t,n,l);r.attr("position",o),t.setItemGraphicEl(n,r),i.add(r)}}).update(function(u,h){var c=r.getItemGraphicEl(h),d=t.getItemLayout(u);return a(t,u,e)?(c?(c.updateData(t,u,l),o.updateProps(c,{position:d},n)):(c=new s(t,u),c.attr("position",d)),i.add(c),void t.setItemGraphicEl(u,c)):void i.remove(c)}).remove(function(t){var e=r.getItemGraphicEl(t);e&&e.fadeOut(function(){i.remove(e)})}).execute(),this._data=t},s.updateLayout=function(){var t=this._data;t&&t.eachItemGraphicEl(function(e,i){var n=t.getItemLayout(i);e.attr("position",n)})},s.remove=function(t){var e=this.group,i=this._data;i&&(t?i.eachItemGraphicEl(function(t){t.fadeOut(function(){e.remove(t)})}):e.removeAll())},t.exports=n},function(t,e,i){function n(t,e,i){var n=e.getComponent("tooltip"),o=e.getComponent("axisPointer"),s=o.get("link",!0)||[],u=[];c(i.getCoordinateSystems(),function(i){function h(n,h,c){var d=c.model.getModel("axisPointer",o),f=d.get("show");if(f&&("auto"!==f||n||l(d))){null==h&&(h=d.get("triggerTooltip")),d=n?a(c,v,o,e,n,h):d;var m=d.get("snap"),y=p(c.model),x=h||m||"category"===c.type,_=t.axesInfo[y]={key:y,axis:c,coordSys:i,axisPointerModel:d,triggerTooltip:h,involveSeries:x,snap:m,useHandle:l(d),seriesModels:[]};g[y]=_,t.seriesInvolved|=x;var b=r(s,c);if(null!=b){var w=u[b]||(u[b]={axesInfo:{}});w.axesInfo[y]=_,w.mapper=s[b].mapper,_.linkGroup=w}}}if(i.axisPointerEnabled){var f=p(i.model),g=t.coordSysAxesInfo[f]={};t.coordSysMap[f]=i;var m=i.model,v=m.getModel("tooltip",n);if(c(i.getAxes(),d(h,!1,null)),i.getTooltipAxes&&n&&v.get("show")){var y="axis"===v.get("trigger"),x="cross"===v.get("axisPointer.type"),_=i.getTooltipAxes(v.get("axisPointer.axis"));(y||x)&&c(_.baseAxes,d(h,!x||"cross",y)),x&&c(_.otherAxes,d(h,"cross",!1))}}})}function a(t,e,i,n,a,o){var r=e.getModel("axisPointer"),s={};c(["type","snap","lineStyle","shadowStyle","label","animation","animationDurationUpdate","animationEasingUpdate","z"],function(t){s[t]=u.clone(r.get(t))}),s.snap="category"!==t.type&&!!o,"cross"===r.get("type")&&(s.type="line");var l=s.label||(s.label={});if(null==l.show&&(l.show=!1),"cross"===a&&(l.show=!0,!o)){var d=s.lineStyle=r.get("crossStyle");d&&u.defaults(l,d.textStyle)}return t.model.getModel("axisPointer",new h(s,i,n))}function o(t,e){e.eachSeries(function(e){var i=e.coordinateSystem,n=e.get("tooltip.trigger",!0),a=e.get("tooltip.show",!0);i&&"none"!==n&&n!==!1&&"item"!==n&&a!==!1&&e.get("axisPointer.show",!0)!==!1&&c(t.coordSysAxesInfo[p(i.model)],function(t){var n=t.axis;i.getAxis(n.dim)===n&&(t.seriesModels.push(e),null==t.seriesDataCount&&(t.seriesDataCount=0),t.seriesDataCount+=e.getData().count())})},this)}function r(t,e){for(var i=e.model,n=e.dim,a=0;a<t.length;a++){var o=t[a]||{};if(s(o[n+"AxisId"],i.id)||s(o[n+"AxisIndex"],i.componentIndex)||s(o[n+"AxisName"],i.name))return a}}function s(t,e){return"all"===t||u.isArray(t)&&u.indexOf(t,e)>=0||t===e}function l(t){return!!t.get("handle.show")}var u=i(1),h=i(11),c=u.each,d=u.curry,f={};f.collect=function(t,e){var i={axesInfo:{},seriesInvolved:!1,coordSysAxesInfo:{},coordSysMap:{}};return n(i,t,e),i.seriesInvolved&&o(i,t),i},f.fixValue=function(t){var e=f.getAxisInfo(t);if(e){var i=e.axisPointerModel,n=e.axis.scale,a=i.option,o=i.get("status"),r=i.get("value");null!=r&&(r=n.parse(r));var s=l(i);null==o&&(a.status=s?"show":"hide");var u=n.getExtent().slice();u[0]>u[1]&&u.reverse(),(null==r||r>u[1])&&(r=u[1]),r<u[0]&&(r=u[0]),a.value=r,s&&(a.status=e.axis.scale.isBlank()?"hide":"show")}},f.getAxisInfo=function(t){var e=(t.ecModel.getComponent("axisPointer")||{}).coordSysAxesInfo;return e&&e.axesInfo[p(t)]},f.getAxisPointerModel=function(t){var e=f.getAxisInfo(t);return e&&e.axisPointerModel};var p=f.makeKey=function(t){return t.type+"||"+t.id};t.exports=f},function(t,e,i){function n(t){var e={};return c(["start","end","startValue","endValue","throttle"],function(i){t.hasOwnProperty(i)&&(e[i]=t[i])}),e}function a(t,e){var i=t._rangePropMode,n=t.get("rangeMode");c([["start","startValue"],["end","endValue"]],function(t,a){var o=null!=e[t[0]],r=null!=e[t[1]];o&&!r?i[a]="percent":!o&&r?i[a]="value":n?i[a]=n[a]:o&&(i[a]="percent")})}var o=i(1),r=i(10),s=i(2),l=i(5),u=i(82),h=i(204),c=o.each,d=u.eachAxisDim,f=s.extendComponentModel({type:"dataZoom",dependencies:["xAxis","yAxis","zAxis","radiusAxis","angleAxis","singleAxis","series"],defaultOption:{zlevel:0,z:4,orient:null,xAxisIndex:null,yAxisIndex:null,filterMode:"filter",throttle:null,start:0,end:100,startValue:null,endValue:null,minSpan:null,maxSpan:null,minValueSpan:null,maxValueSpan:null,rangeMode:null},init:function(t,e,i){this._dataIntervalByAxis={},this._dataInfo={},this._axisProxies={},this.textStyleModel,this._autoThrottle=!0,this._rangePropMode=["percent","percent"];var a=n(t);this.mergeDefaultAndTheme(t,i),this.doInit(a)},mergeOption:function(t){var e=n(t);o.merge(this.option,t,!0),this.doInit(e)},doInit:function(t){var e=this.option;r.canvasSupported||(e.realtime=!1),this._setDefaultThrottle(t),a(this,t),c([["start","startValue"],["end","endValue"]],function(t,i){"value"===this._rangePropMode[i]&&(e[t[0]]=null)},this),this.textStyleModel=this.getModel("textStyle"),this._resetTarget(),this._giveAxisProxies()},_giveAxisProxies:function(){var t=this._axisProxies;this.eachTargetAxis(function(e,i,n,a){var o=this.dependentModels[e.axis][i],r=o.__dzAxisProxy||(o.__dzAxisProxy=new h(e.name,i,this,a));t[e.name+"_"+i]=r},this)},_resetTarget:function(){var t=this.option,e=this._judgeAutoMode();d(function(e){var i=e.axisIndex;t[i]=l.normalizeToArray(t[i])},this),"axisIndex"===e?this._autoSetAxisIndex():"orient"===e&&this._autoSetOrient()},_judgeAutoMode:function(){var t=this.option,e=!1;d(function(i){null!=t[i.axisIndex]&&(e=!0)},this);var i=t.orient;return null==i&&e?"orient":e?void 0:(null==i&&(t.orient="horizontal"),"axisIndex")},_autoSetAxisIndex:function(){var t=!0,e=this.get("orient",!0),i=this.option,n=this.dependentModels;if(t){var a="vertical"===e?"y":"x";n[a+"Axis"].length?(i[a+"AxisIndex"]=[0],t=!1):c(n.singleAxis,function(n){t&&n.get("orient",!0)===e&&(i.singleAxisIndex=[n.componentIndex],t=!1)})}t&&d(function(e){if(t){var n=[],a=this.dependentModels[e.axis];if(a.length&&!n.length)for(var o=0,r=a.length;o<r;o++)"category"===a[o].get("type")&&n.push(o);i[e.axisIndex]=n,n.length&&(t=!1)}},this),t&&this.ecModel.eachSeries(function(t){this._isSeriesHasAllAxesTypeOf(t,"value")&&d(function(e){var n=i[e.axisIndex],a=t.get(e.axisIndex),r=t.get(e.axisId),s=t.ecModel.queryComponents({mainType:e.axis,index:a,id:r})[0];a=s.componentIndex,o.indexOf(n,a)<0&&n.push(a)})},this)},_autoSetOrient:function(){var t;this.eachTargetAxis(function(e){!t&&(t=e.name)},this),this.option.orient="y"===t?"vertical":"horizontal"},_isSeriesHasAllAxesTypeOf:function(t,e){var i=!0;return d(function(n){var a=t.get(n.axisIndex),o=this.dependentModels[n.axis][a];o&&o.get("type")===e||(i=!1)},this),i},_setDefaultThrottle:function(t){if(t.hasOwnProperty("throttle")&&(this._autoThrottle=!1),this._autoThrottle){var e=this.ecModel.option;this.option.throttle=e.animation&&e.animationDurationUpdate>0?100:20}},getFirstTargetAxisModel:function(){var t;return d(function(e){if(null==t){var i=this.get(e.axisIndex);i.length&&(t=this.dependentModels[e.axis][i[0]])}},this),t},eachTargetAxis:function(t,e){var i=this.ecModel;d(function(n){c(this.get(n.axisIndex),function(a){t.call(e,n,a,this,i)},this)},this)},getAxisProxy:function(t,e){return this._axisProxies[t+"_"+e]},getAxisModel:function(t,e){var i=this.getAxisProxy(t,e);return i&&i.getAxisModel()},setRawRange:function(t,e){c(["start","end","startValue","endValue"],function(e){this.option[e]=t[e]},this),!e&&a(this,t)},getPercentRange:function(){var t=this.findRepresentativeAxisProxy();if(t)return t.getDataPercentWindow()},getValueRange:function(t,e){if(null!=t||null!=e)return this.getAxisProxy(t,e).getDataValueWindow();var i=this.findRepresentativeAxisProxy();return i?i.getDataValueWindow():void 0},findRepresentativeAxisProxy:function(t){if(t)return t.__dzAxisProxy;var e=this._axisProxies;for(var i in e)if(e.hasOwnProperty(i)&&e[i].hostedBy(this))return e[i];for(var i in e)if(e.hasOwnProperty(i)&&!e[i].hostedBy(this))return e[i]},getRangePropMode:function(){return this._rangePropMode.slice()}});t.exports=f},function(t,e,i){var n=i(68);t.exports=n.extend({type:"dataZoom",render:function(t,e,i,n){this.dataZoomModel=t,this.ecModel=e,this.api=i},getTargetCoordInfo:function(){function t(t,e,i,n){for(var a,o=0;o<i.length;o++)if(i[o].model===t){a=i[o];break}a||i.push(a={model:t,axisModels:[],coordIndex:n}),a.axisModels.push(e)}var e=this.dataZoomModel,i=this.ecModel,n={};return e.eachTargetAxis(function(e,a){var o=i.getComponent(e.axis,a);if(o){var r=o.getCoordSysModel();r&&t(r,o,n[r.mainType]||(n[r.mainType]=[]),r.componentIndex)}},this),n}})},function(t,e,i){var n=i(1),a=i(15),o=a.parseClassType,r=0,s={},l="_";s.getUID=function(t){return[t||"",r++,Math.random()].join(l)},s.enableSubTypeDefaulter=function(t){var e={};return t.registerSubTypeDefaulter=function(t,i){t=o(t),e[t.main]=i},t.determineSubType=function(i,n){var a=n.type;if(!a){var r=o(i).main;t.hasSubTypes(i)&&e[r]&&(a=e[r](n))}return a},t},s.enableTopologicalTravel=function(t,e){function i(t){var i={},r=[];return n.each(t,function(s){var l=a(i,s),u=l.originalDeps=e(s),h=o(u,t);l.entryCount=h.length,0===l.entryCount&&r.push(s),n.each(h,function(t){n.indexOf(l.predecessor,t)<0&&l.predecessor.push(t);var e=a(i,t);n.indexOf(e.successor,t)<0&&e.successor.push(s)})}),{graph:i,noEntryList:r}}function a(t,e){return t[e]||(t[e]={predecessor:[],successor:[]}),t[e]}function o(t,e){var i=[];return n.each(t,function(t){n.indexOf(e,t)>=0&&i.push(t)}),i}t.topologicalTravel=function(t,e,a,o){function r(t){u[t].entryCount--,0===u[t].entryCount&&h.push(t)}function s(t){c[t]=!0,r(t)}if(t.length){var l=i(e),u=l.graph,h=l.noEntryList,c={};for(n.each(t,function(t){c[t]=!0});h.length;){var d=h.pop(),f=u[d],p=!!c[d];p&&(a.call(o,d,f.originalDeps.slice()),delete c[d]),n.each(f.successor,p?s:r)}n.each(c,function(){throw new Error("Circle dependency may exists")})}}},t.exports=s},function(t,e){t.exports=function(t,e,i,n,a){n.eachRawSeriesByType(t,function(t){var a=t.getData(),o=t.get("symbol")||e,r=t.get("symbolSize");a.setVisual({legendSymbol:i||o,symbol:o,symbolSize:r}),n.isSeriesFiltered(t)||("function"==typeof r&&a.each(function(e){var i=t.getRawValue(e),n=t.getDataParams(e);a.setItemVisual(e,"symbolSize",r(i,n))}),a.each(function(t){var e=a.getItemModel(t),i=e.getShallow("symbol",!0),n=e.getShallow("symbolSize",!0);null!=i&&a.setItemVisual(t,"symbol",i),null!=n&&a.setItemVisual(t,"symbolSize",n)}))})}},function(t,e){function i(t){for(var e=0;t>=h;)e|=1&t,t>>=1;return t+e}function n(t,e,i,n){var o=e+1;if(o===i)return 1;if(n(t[o++],t[e])<0){for(;o<i&&n(t[o],t[o-1])<0;)o++;a(t,e,o)}else for(;o<i&&n(t[o],t[o-1])>=0;)o++;return o-e}function a(t,e,i){for(i--;e<i;){var n=t[e];t[e++]=t[i],t[i--]=n}}function o(t,e,i,n,a){for(n===e&&n++;n<i;n++){for(var o,r=t[n],s=e,l=n;s<l;)o=s+l>>>1,a(r,t[o])<0?l=o:s=o+1;var u=n-s;switch(u){case 3:t[s+3]=t[s+2];case 2:t[s+2]=t[s+1];case 1:t[s+1]=t[s];break;default:for(;u>0;)t[s+u]=t[s+u-1],u--}t[s]=r}}function r(t,e,i,n,a,o){var r=0,s=0,l=1;if(o(t,e[i+a])>0){for(s=n-a;l<s&&o(t,e[i+a+l])>0;)r=l,l=(l<<1)+1,l<=0&&(l=s);l>s&&(l=s),r+=a,l+=a}else{for(s=a+1;l<s&&o(t,e[i+a-l])<=0;)r=l,l=(l<<1)+1,l<=0&&(l=s);l>s&&(l=s);var u=r;r=a-l,l=a-u}for(r++;r<l;){var h=r+(l-r>>>1);o(t,e[i+h])>0?r=h+1:l=h}return l}function s(t,e,i,n,a,o){var r=0,s=0,l=1;if(o(t,e[i+a])<0){for(s=a+1;l<s&&o(t,e[i+a-l])<0;)r=l,l=(l<<1)+1,l<=0&&(l=s);l>s&&(l=s);var u=r;r=a-l,l=a-u}else{for(s=n-a;l<s&&o(t,e[i+a+l])>=0;)r=l,l=(l<<1)+1,l<=0&&(l=s);l>s&&(l=s),r+=a,l+=a}for(r++;r<l;){var h=r+(l-r>>>1);o(t,e[i+h])<0?l=h:r=h+1}return l}function l(t,e){function i(t,e){h[y]=t,f[y]=e,y+=1}function n(){for(;y>1;){var t=y-2;if(t>=1&&f[t-1]<=f[t]+f[t+1]||t>=2&&f[t-2]<=f[t]+f[t-1])f[t-1]<f[t+1]&&t--;else if(f[t]>f[t+1])break;o(t)}}function a(){for(;y>1;){var t=y-2;t>0&&f[t-1]<f[t+1]&&t--,o(t)}}function o(i){var n=h[i],a=f[i],o=h[i+1],c=f[i+1];f[i]=a+c,i===y-3&&(h[i+1]=h[i+2],f[i+1]=f[i+2]),y--;var d=s(t[o],t,n,a,0,e);n+=d,a-=d,0!==a&&(c=r(t[n+a-1],t,o,c,c-1,e),0!==c&&(a<=c?l(n,a,o,c):u(n,a,o,c)))}function l(i,n,a,o){var l=0;for(l=0;l<n;l++)x[l]=t[i+l];var u=0,h=a,d=i;if(t[d++]=t[h++],0!==--o){if(1===n){for(l=0;l<o;l++)t[d+l]=t[h+l];return void(t[d+o]=x[u])}for(var f,g,m,v=p;;){f=0,g=0,m=!1;do if(e(t[h],x[u])<0){if(t[d++]=t[h++],g++,f=0,0===--o){m=!0;break}}else if(t[d++]=x[u++],f++,g=0,1===--n){m=!0;break}while((f|g)<v);if(m)break;do{if(f=s(t[h],x,u,n,0,e),0!==f){for(l=0;l<f;l++)t[d+l]=x[u+l];if(d+=f,u+=f,n-=f,n<=1){m=!0;break}}if(t[d++]=t[h++],0===--o){m=!0;break}if(g=r(x[u],t,h,o,0,e),0!==g){for(l=0;l<g;l++)t[d+l]=t[h+l];if(d+=g,h+=g,o-=g,0===o){m=!0;break}}if(t[d++]=x[u++],1===--n){m=!0;break}v--}while(f>=c||g>=c);if(m)break;v<0&&(v=0),v+=2}if(p=v,p<1&&(p=1),1===n){for(l=0;l<o;l++)t[d+l]=t[h+l];t[d+o]=x[u]}else{if(0===n)throw new Error;for(l=0;l<n;l++)t[d+l]=x[u+l]}}else for(l=0;l<n;l++)t[d+l]=x[u+l]}function u(i,n,a,o){var l=0;for(l=0;l<o;l++)x[l]=t[a+l];var u=i+n-1,h=o-1,d=a+o-1,f=0,g=0;if(t[d--]=t[u--],0!==--n){if(1===o){for(d-=n,u-=n,g=d+1,f=u+1,l=n-1;l>=0;l--)t[g+l]=t[f+l];return void(t[d]=x[h])}for(var m=p;;){var v=0,y=0,_=!1;do if(e(x[h],t[u])<0){if(t[d--]=t[u--],v++,y=0,0===--n){_=!0;break}}else if(t[d--]=x[h--],y++,v=0,1===--o){_=!0;break}while((v|y)<m);if(_)break;do{if(v=n-s(x[h],t,i,n,n-1,e),0!==v){for(d-=v,u-=v,n-=v,g=d+1,f=u+1,l=v-1;l>=0;l--)t[g+l]=t[f+l];if(0===n){_=!0;break}}if(t[d--]=x[h--],1===--o){_=!0;break}if(y=o-r(t[u],x,0,o,o-1,e),0!==y){for(d-=y,h-=y,o-=y,g=d+1,f=h+1,l=0;l<y;l++)t[g+l]=x[f+l];if(o<=1){_=!0;break}}if(t[d--]=t[u--],0===--n){_=!0;break}m--}while(v>=c||y>=c);if(_)break;m<0&&(m=0),m+=2}if(p=m,p<1&&(p=1),1===o){for(d-=n,u-=n,g=d+1,f=u+1,l=n-1;l>=0;l--)t[g+l]=t[f+l];t[d]=x[h]}else{if(0===o)throw new Error;for(f=d-(o-1),l=0;l<o;l++)t[f+l]=x[l]}}else for(f=d-(o-1),l=0;l<o;l++)t[f+l]=x[l]}var h,f,p=c,g=0,m=d,v=0,y=0;g=t.length,g<2*d&&(m=g>>>1);var x=[];v=g<120?5:g<1542?10:g<119151?19:40,h=[],f=[],this.mergeRuns=n,this.forceMergeRuns=a,this.pushRun=i}function u(t,e,a,r){a||(a=0),r||(r=t.length);var s=r-a;if(!(s<2)){var u=0;if(s<h)return u=n(t,a,r,e),void o(t,a,r,a+u,e);var c=new l(t,e),d=i(s);do{if(u=n(t,a,r,e),u<d){var f=s;f>d&&(f=d),o(t,a,a+f,a+u,e),u=f}c.pushRun(a,u),c.mergeRuns(),s-=u,a+=u}while(0!==s);c.forceMergeRuns()}}var h=32,c=7,d=256;t.exports=u},function(t,e,i){function n(){var t=this.__cachedImgObj;this.onload=this.__cachedImgObj=null;for(var e=0;e<t.pending.length;e++){var i=t.pending[e],n=i.cb;n&&n(this,i.cbPayload),i.hostEl.dirty()}t.pending.length=0}var a=i(73),o=new a(50),r={};r.findExistImage=function(t){if("string"==typeof t){var e=o.get(t);return e&&e.image}return t},r.createOrUpdateImage=function(t,e,i,a,r){if(t){if("string"==typeof t){if(e&&e.__zrImageSrc===t||!i)return e;var l=o.get(t),u={hostEl:i,cb:a,cbPayload:r};return l?(e=l.image,!s(e)&&l.pending.push(u)):(!e&&(e=new Image),e.onload=n,o.put(t,e.__cachedImgObj={image:e,pending:[u]}),e.src=e.__zrImageSrc=t),e}return t}return e};var s=r.isImageReady=function(t){return t&&t.width&&t.height};t.exports=r},function(t,e,i){var n=i(35);t.exports=function(){if(0!==n.debugMode)if(1==n.debugMode)for(var t in arguments)throw new Error(arguments[t]);else if(n.debugMode>1)for(var t in arguments)console.log(arguments[t])}},function(t,e,i){function n(t){a.call(this,t)}var a=i(38),o=i(12),r=i(1),s=i(53);n.prototype={constructor:n,type:"image",brush:function(t,e){var i=this.style,n=i.image;i.bind(t,this,e);var a=this._image=s.createOrUpdateImage(n,this._image,this);if(a&&s.isImageReady(a)){var o=i.x||0,r=i.y||0,l=i.width,u=i.height,h=a.width/a.height;if(null==l&&null!=u?l=u*h:null==u&&null!=l?u=l/h:null==l&&null==u&&(l=a.width,u=a.height),this.setTransform(t),i.sWidth&&i.sHeight){var c=i.sx||0,d=i.sy||0;t.drawImage(a,c,d,i.sWidth,i.sHeight,o,r,l,u)}else if(i.sx&&i.sy){var c=i.sx,d=i.sy,f=l-c,p=u-d;t.drawImage(a,c,d,f,p,o,r,l,u)}else t.drawImage(a,o,r,l,u);this.restoreTransform(t),null!=i.text&&this.drawRectText(t,this.getBoundingRect())}},getBoundingRect:function(){var t=this.style;return this._rect||(this._rect=new o(t.x||0,t.y||0,t.width||0,t.height||0)),this._rect}},r.inherits(n,a),t.exports=n},function(t,e,i){function n(t){if(t){t.font=m.makeFont(t);var e=t.textAlign;"middle"===e&&(e="center"),t.textAlign=null==e||w[e]?e:"left";var i=t.textVerticalAlign||t.textBaseline;
"center"===i&&(i="middle"),t.textVerticalAlign=null==i||S[i]?i:"top";var n=t.textPadding;n&&(t.textPadding=v.normalizeCssArray(t.textPadding))}}function a(t,e,i,n,a){var o=f(e,"font",n.font||m.DEFAULT_FONT),r=n.textPadding,l=t.__textCotentBlock;l&&!t.__dirty||(l=t.__textCotentBlock=m.parsePlainText(i,o,r,n.truncate));var c=l.outerHeight,p=l.lines,v=l.lineHeight,y=d(c,n,a),x=y.baseX,_=y.baseY,b=y.textAlign,w=y.textVerticalAlign;s(e,n,a,x,_);var S=m.adjustTextY(_,c,w),M=x,A=S,C=u(n);if(C||r){var L=m.getWidth(i,o),D=L;r&&(D+=r[1]+r[3]);var P=m.adjustTextX(x,D,b);C&&h(t,e,n,P,S,D,c),r&&(M=g(x,b,r),A+=r[0])}f(e,"textAlign",b||"left"),f(e,"textBaseline","middle"),f(e,"shadowBlur",n.textShadowBlur||0),f(e,"shadowColor",n.textShadowColor||"transparent"),f(e,"shadowOffsetX",n.textShadowOffsetX||0),f(e,"shadowOffsetY",n.textShadowOffsetY||0),A+=v/2;var k=n.textStrokeWidth,O=I(n.textStroke,k),z=T(n.textFill);O&&(f(e,"lineWidth",k),f(e,"strokeStyle",O)),z&&f(e,"fillStyle",z);for(var E=0;E<p.length;E++)O&&e.strokeText(p[E],M,A),z&&e.fillText(p[E],M,A),A+=v}function o(t,e,i,n,a){var o=t.__textCotentBlock;o&&!t.__dirty||(o=t.__textCotentBlock=m.parseRichText(i,n)),r(t,e,o,n,a)}function r(t,e,i,n,a){var o=i.width,r=i.outerWidth,c=i.outerHeight,f=n.textPadding,p=d(c,n,a),g=p.baseX,v=p.baseY,y=p.textAlign,x=p.textVerticalAlign;s(e,n,a,g,v);var _=m.adjustTextX(g,r,y),b=m.adjustTextY(v,c,x),w=_,S=b;f&&(w+=f[3],S+=f[0]);var M=w+o;u(n)&&h(t,e,n,_,b,r,c);for(var I=0;I<i.lines.length;I++){for(var T,A=i.lines[I],C=A.tokens,L=C.length,D=A.lineHeight,P=A.width,k=0,O=w,z=M,E=L-1;k<L&&(T=C[k],!T.textAlign||"left"===T.textAlign);)l(t,e,T,n,D,S,O,"left"),P-=T.width,O+=T.width,k++;for(;E>=0&&(T=C[E],"right"===T.textAlign);)l(t,e,T,n,D,S,z,"right"),P-=T.width,z-=T.width,E--;for(O+=(o-(O-w)-(M-z)-P)/2;k<=E;)T=C[k],l(t,e,T,n,D,S,O+T.width/2,"center"),O+=T.width,k++;S+=D}}function s(t,e,i,n,a){if(i&&e.textRotation){var o=e.textOrigin;"center"===o?(n=i.width/2+i.x,a=i.height/2+i.y):o&&(n=o[0]+i.x,a=o[1]+i.y),t.translate(n,a),t.rotate(-e.textRotation),t.translate(-n,-a)}}function l(t,e,i,n,a,o,r,s){var l=n.rich[i.styleName]||{},c=i.textVerticalAlign,d=o+a/2;"top"===c?d=o+i.height/2:"bottom"===c&&(d=o+a-i.height/2),!i.isLineHolder&&u(l)&&h(t,e,l,"right"===s?r-i.width:"center"===s?r-i.width/2:r,d-i.height/2,i.width,i.height);var p=i.textPadding;p&&(r=g(r,s,p),d-=i.height/2-p[2]-i.textHeight/2),f(e,"shadowBlur",_(l.textShadowBlur,n.textShadowBlur,0)),f(e,"shadowColor",l.textShadowColor||n.textShadowColor||"transparent"),f(e,"shadowOffsetX",_(l.textShadowOffsetX,n.textShadowOffsetX,0)),f(e,"shadowOffsetY",_(l.textShadowOffsetY,n.textShadowOffsetY,0)),f(e,"textAlign",s),f(e,"textBaseline","middle"),f(e,"font",i.font||m.DEFAULT_FONT);var v=I(l.textStroke||n.textStroke,x),y=T(l.textFill||n.textFill),x=b(l.textStrokeWidth,n.textStrokeWidth);v&&(f(e,"lineWidth",x),f(e,"strokeStyle",v),e.strokeText(i.text,r,d)),y&&(f(e,"fillStyle",y),e.fillText(i.text,r,d))}function u(t){return t.textBackgroundColor||t.textBorderWidth&&t.textBorderColor}function h(t,e,i,n,a,o,r){var s=i.textBackgroundColor,l=i.textBorderWidth,u=i.textBorderColor,h=v.isString(s);if(f(e,"shadowBlur",i.textBoxShadowBlur||0),f(e,"shadowColor",i.textBoxShadowColor||"transparent"),f(e,"shadowOffsetX",i.textBoxShadowOffsetX||0),f(e,"shadowOffsetY",i.textBoxShadowOffsetY||0),h||l&&u){e.beginPath();var d=i.textBorderRadius;d?y.buildPath(e,{x:n,y:a,width:o,height:r,r:d}):e.rect(n,a,o,r),e.closePath()}if(h)f(e,"fillStyle",s),e.fill();else if(v.isObject(s)){var p=s.image;p=x.createOrUpdateImage(p,null,t,c,s),p&&x.isImageReady(p)&&e.drawImage(p,n,a,o,r)}l&&u&&(f(e,"lineWidth",l),f(e,"strokeStyle",u),e.stroke())}function c(t,e){e.image=t}function d(t,e,i){var n=e.x||0,a=e.y||0,o=e.textAlign,r=e.textVerticalAlign;if(i){var s=e.textPosition;if(s instanceof Array)n=i.x+p(s[0],i.width),a=i.y+p(s[1],i.height);else{var l=m.adjustTextPositionOnRect(s,i,e.textDistance);n=l.x,a=l.y,o=o||l.textAlign,r=r||l.textVerticalAlign}var u=e.textOffset;u&&(n+=u[0],a+=u[1])}return{baseX:n,baseY:a,textAlign:o,textVerticalAlign:r}}function f(t,e,i){return t[e]=i,t[e]}function p(t,e){return"string"==typeof t?t.lastIndexOf("%")>=0?parseFloat(t)/100*e:parseFloat(t):t}function g(t,e,i){return"right"===e?t-i[1]:"center"===e?t+i[3]/2-i[1]/2:t+i[3]}var m=i(16),v=i(1),y=i(79),x=i(53),_=v.retrieve3,b=v.retrieve2,w={left:1,right:1,center:1},S={top:1,bottom:1,middle:1},M={};M.normalizeTextStyle=function(t){return n(t),v.each(t.rich,n),t},M.renderText=function(t,e,i,n,r){n.rich?o(t,e,i,n,r):a(t,e,i,n,r)};var I=M.getStroke=function(t,e){return null==t||e<=0||"transparent"===t||"none"===t?null:t.image||t.colorStops?"#000":t},T=M.getFill=function(t){return null==t||"none"===t?null:t.image||t.colorStops?"#000":t};M.needDrawText=function(t,e){return null!=t&&(t||e.textBackgroundColor||e.textBorderWidth&&e.textBorderColor||e.textPadding)},t.exports=M},function(t,e,i){function n(t,e){var i=t.getItemVisual(e,"symbolSize");return i instanceof Array?i.slice():[+i,+i]}function a(t){return[t[0]/2,t[1]/2]}function o(t,e,i){u.Group.call(this),this.updateData(t,e,i)}function r(t,e){this.parent.drift(t,e)}var s=i(1),l=i(24),u=i(3),h=i(4),c=i(97),d=o.prototype;d._createSymbol=function(t,e,i,n){this.removeAll();var o=e.hostModel,s=e.getItemVisual(i,"color"),h=l.createSymbol(t,-1,-1,2,2,s);h.attr({z2:100,culling:!0,scale:[0,0]}),h.drift=r,u.initProps(h,{scale:a(n)},o,i),this._symbolType=t,this.add(h)},d.stopSymbolAnimation=function(t){this.childAt(0).stopAnimation(t)},d.getSymbolPath=function(){return this.childAt(0)},d.getScale=function(){return this.childAt(0).scale},d.highlight=function(){this.childAt(0).trigger("emphasis")},d.downplay=function(){this.childAt(0).trigger("normal")},d.setZ=function(t,e){var i=this.childAt(0);i.zlevel=t,i.z=e},d.setDraggable=function(t){var e=this.childAt(0);e.draggable=t,e.cursor=t?"move":"pointer"},d.updateData=function(t,e,i){this.silent=!1;var o=t.getItemVisual(e,"symbol")||"circle",r=t.hostModel,s=n(t,e);if(o!==this._symbolType)this._createSymbol(o,t,e,s);else{var l=this.childAt(0);l.silent=!1,u.updateProps(l,{scale:a(s)},r,e)}this._updateCommon(t,e,s,i),this._seriesModel=r};var f=["itemStyle","normal"],p=["itemStyle","emphasis"],g=["label","normal"],m=["label","emphasis"];d._updateCommon=function(t,e,i,n){var o=this.childAt(0),r=t.hostModel,l=t.getItemVisual(e,"color");"image"!==o.type&&o.useStyle({strokeNoScale:!0}),n=n||null;var d=n&&n.itemStyle,v=n&&n.hoverItemStyle,y=n&&n.symbolRotate,x=n&&n.symbolOffset,_=n&&n.labelModel,b=n&&n.hoverLabelModel,w=n&&n.hoverAnimation,S=n&&n.cursorStyle;if(!n||t.hasItemOption){var M=t.getItemModel(e);d=M.getModel(f).getItemStyle(["color"]),v=M.getModel(p).getItemStyle(),y=M.getShallow("symbolRotate"),x=M.getShallow("symbolOffset"),_=M.getModel(g),b=M.getModel(m),w=M.getShallow("hoverAnimation"),S=M.getShallow("cursor")}else v=s.extend({},v);var I=o.style;o.attr("rotation",(y||0)*Math.PI/180||0),x&&o.attr("position",[h.parsePercent(x[0],i[0]),h.parsePercent(x[1],i[1])]),S&&o.attr("cursor",S),o.setColor(l),o.setStyle(d);var T=t.getItemVisual(e,"opacity");null!=T&&(I.opacity=T);var A=c.findLabelValueDim(t);null!=A&&u.setLabelStyle(I,v,_,b,{labelFetcher:r,labelDataIndex:e,defaultText:t.get(A,e),isRectText:!0,autoColor:l}),o.off("mouseover").off("mouseout").off("emphasis").off("normal"),o.hoverStyle=v,u.setHoverStyle(o);var C=a(i);if(w&&r.isAnimationEnabled()){var L=function(){var t=C[1]/C[0];this.animateTo({scale:[Math.max(1.1*C[0],C[0]+3),Math.max(1.1*C[1],C[1]+3*t)]},400,"elasticOut")},D=function(){this.animateTo({scale:C},400,"elasticOut")};o.on("mouseover",L).on("mouseout",D).on("emphasis",L).on("normal",D)}},d.fadeOut=function(t){var e=this.childAt(0);this.silent=e.silent=!0,e.style.text=null,u.updateProps(e,{scale:[0,0]},this._seriesModel,this.dataIndex,t)},s.inherits(o,u.Group),t.exports=o},function(t,e,i){var n=i(2),a=i(47),o=i(202),r=i(1);i(200),i(201),i(125),n.registerPreprocessor(function(t){if(t){(!t.axisPointer||0===t.axisPointer.length)&&(t.axisPointer={});var e=t.axisPointer.link;e&&!r.isArray(e)&&(t.axisPointer.link=[e])}}),n.registerProcessor(n.PRIORITY.PROCESSOR.STATISTIC,function(t,e){t.getComponent("axisPointer").coordSysAxesInfo=a.collect(t,e)}),n.registerAction({type:"updateAxisPointer",event:"updateAxisPointer",update:":updateAxisPointer"},o)},function(t,e){function i(t,e){var i=t[e]-t[1-e];return{span:Math.abs(i),sign:i>0?-1:i<0?1:e?-1:1}}function n(t,e){return Math.min(e[1],Math.max(e[0],t))}t.exports=function(t,e,a,o,r,s){e[0]=n(e[0],a),e[1]=n(e[1],a),t=t||0;var l=a[1]-a[0];null!=r&&(r=n(r,[0,l])),null!=s&&(s=Math.max(s,null!=r?r:0)),"all"===o&&(r=s=Math.abs(e[1]-e[0]),o=0);var u=i(e,o);e[o]+=t;var h=r||0,c=a.slice();u.sign<0?c[0]+=h:c[1]-=h,e[o]=n(e[o],c);var d=i(e,o);null!=r&&(d.sign!==u.sign||d.span<r)&&(e[1-o]=e[o]+u.sign*r);var d=i(e,o);return null!=s&&d.span>s&&(e[1-o]=e[o]+d.sign*s),e}},function(t,e,i){function n(t,e,i){return t.getCoordSysModel()===e}function a(t){var e,i=t.model,n=i.getFormattedLabels(),a=i.getModel("axisLabel"),o=1,r=n.length;r>40&&(o=Math.ceil(r/40));for(var s=0;s<r;s+=o)if(!t.isLabelIgnored(s)){var l=a.getTextRect(n[s]);e?e.union(l):e=l}return e}function o(t,e,i){this._coordsMap={},this._coordsList=[],this._axesMap={},this._axesList=[],this._initCartesian(t,e,i),this.model=t}function r(t,e,i){var n=t[e];if(i.onZero){var a=i.onZeroAxisIndex;if(null!=a){var o=n[a];return void(o&&s(o)&&(i.onZero=!1))}for(var r in n)if(n.hasOwnProperty(r)){var o=n[r];if(o&&!s(o)){a=+r;break}}null==a&&(i.onZero=!1),i.onZeroAxisIndex=a}}function s(t){return"category"===t.type||"time"===t.type||!v(t)}function l(t,e){var i=t.getExtent(),n=i[0]+i[1];t.toGlobalCoord="x"===t.dim?function(t){return t+e}:function(t){return n-t+e},t.toLocalCoord="x"===t.dim?function(t){return t-e}:function(t){return n-t+e}}function u(t,e){return f.map(_,function(e){var i=t.getReferringComponents(e)[0];return i})}function h(t){return"cartesian2d"===t.get("coordinateSystem")}var c=i(9),d=i(18),f=i(1),p=i(140),g=i(138),m=f.each,v=d.ifAxisCrossZero,y=d.niceScaleExtent;i(141);var x=o.prototype;x.type="grid",x.axisPointerEnabled=!0,x.getRect=function(){return this._rect},x.update=function(t,e){var i=this._axesMap;this._updateScale(t,this.model),m(i.x,function(t){y(t.scale,t.model)}),m(i.y,function(t){y(t.scale,t.model)}),m(i.x,function(t){r(i,"y",t)}),m(i.y,function(t){r(i,"x",t)}),this.resize(this.model,e)},x.resize=function(t,e,i){function n(){m(r,function(t){var e=t.isHorizontal(),i=e?[0,o.width]:[0,o.height],n=t.inverse?1:0;t.setExtent(i[n],i[1-n]),l(t,e?o.x:o.y)})}var o=c.getLayoutRect(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()});this._rect=o;var r=this._axesList;n(),!i&&t.get("containLabel")&&(m(r,function(t){if(!t.model.get("axisLabel.inside")){var e=a(t);if(e){var i=t.isHorizontal()?"height":"width",n=t.model.get("axisLabel.margin");o[i]-=e[i]+n,"top"===t.position?o.y+=e.height+n:"left"===t.position&&(o.x+=e.width+n)}}}),n())},x.getAxis=function(t,e){var i=this._axesMap[t];if(null!=i){if(null==e)for(var n in i)if(i.hasOwnProperty(n))return i[n];return i[e]}},x.getAxes=function(){return this._axesList.slice()},x.getCartesian=function(t,e){if(null!=t&&null!=e){var i="x"+t+"y"+e;return this._coordsMap[i]}f.isObject(t)&&(e=t.yAxisIndex,t=t.xAxisIndex);for(var n=0,a=this._coordsList;n<a.length;n++)if(a[n].getAxis("x").index===t||a[n].getAxis("y").index===e)return a[n]},x.getCartesians=function(){return this._coordsList.slice()},x.convertToPixel=function(t,e,i){var n=this._findConvertTarget(t,e);return n.cartesian?n.cartesian.dataToPoint(i):n.axis?n.axis.toGlobalCoord(n.axis.dataToCoord(i)):null},x.convertFromPixel=function(t,e,i){var n=this._findConvertTarget(t,e);return n.cartesian?n.cartesian.pointToData(i):n.axis?n.axis.coordToData(n.axis.toLocalCoord(i)):null},x._findConvertTarget=function(t,e){var i,n,a=e.seriesModel,o=e.xAxisModel||a&&a.getReferringComponents("xAxis")[0],r=e.yAxisModel||a&&a.getReferringComponents("yAxis")[0],s=e.gridModel,l=this._coordsList;if(a)i=a.coordinateSystem,f.indexOf(l,i)<0&&(i=null);else if(o&&r)i=this.getCartesian(o.componentIndex,r.componentIndex);else if(o)n=this.getAxis("x",o.componentIndex);else if(r)n=this.getAxis("y",r.componentIndex);else if(s){var u=s.coordinateSystem;u===this&&(i=this._coordsList[0])}return{cartesian:i,axis:n}},x.containPoint=function(t){var e=this._coordsList[0];if(e)return e.containPoint(t)},x._initCartesian=function(t,e,i){function a(i){return function(a,l){if(n(a,t,e)){var u=a.get("position");"x"===i?"top"!==u&&"bottom"!==u&&(u="bottom",o[u]&&(u="top"===u?"bottom":"top")):"left"!==u&&"right"!==u&&(u="left",o[u]&&(u="left"===u?"right":"left")),o[u]=!0;var h=new g(i,d.createScaleByModel(a),[0,0],a.get("type"),u),c="category"===h.type;h.onBand=c&&a.get("boundaryGap"),h.inverse=a.get("inverse"),h.onZero=a.get("axisLine.onZero"),h.onZeroAxisIndex=a.get("axisLine.onZeroAxisIndex"),a.axis=h,h.model=a,h.grid=this,h.index=l,this._axesList.push(h),r[i][l]=h,s[i]++}}}var o={left:!1,right:!1,top:!1,bottom:!1},r={x:{},y:{}},s={x:0,y:0};return e.eachComponent("xAxis",a("x"),this),e.eachComponent("yAxis",a("y"),this),s.x&&s.y?(this._axesMap=r,void m(r.x,function(e,i){m(r.y,function(n,a){var o="x"+i+"y"+a,r=new p(o);r.grid=this,r.model=t,this._coordsMap[o]=r,this._coordsList.push(r),r.addAxis(e),r.addAxis(n)},this)},this)):(this._axesMap={},void(this._axesList=[]))},x._updateScale=function(t,e){function i(t,e,i){m(i.coordDimToDataDim(e.dim),function(i){e.scale.unionExtentFromData(t,i)})}f.each(this._axesList,function(t){t.scale.setExtent(1/0,-(1/0))}),t.eachSeries(function(a){if(h(a)){var o=u(a,t),r=o[0],s=o[1];if(!n(r,e,t)||!n(s,e,t))return;var l=this.getCartesian(r.componentIndex,s.componentIndex),c=a.getData(),d=l.getAxis("x"),f=l.getAxis("y");"list"===c.type&&(i(c,d,a),i(c,f,a))}},this)},x.getTooltipAxes=function(t){var e=[],i=[];return m(this.getCartesians(),function(n){var a=null!=t&&"auto"!==t?n.getAxis(t):n.getBaseAxis(),o=n.getOtherAxis(a);f.indexOf(e,a)<0&&e.push(a),f.indexOf(i,o)<0&&i.push(o)}),{baseAxes:e,otherAxes:i}};var _=["xAxis","yAxis"];o.create=function(t,e){var i=[];return t.eachComponent("grid",function(n,a){var r=new o(n,t,e);r.name="grid_"+a,r.resize(n,e,!0),n.coordinateSystem=r,i.push(r)}),t.eachSeries(function(e){if(h(e)){var i=u(e,t),n=i[0],a=i[1],o=n.getCoordSysModel(),r=o.coordinateSystem;e.coordinateSystem=r.getCartesian(n.componentIndex,a.componentIndex)}}),i},o.dimensions=o.prototype.dimensions=p.prototype.dimensions,i(26).register("cartesian2d",o),t.exports=o},function(t,e,i){"use strict";function n(t){return t>s||t<-s}var a=i(19),o=i(6),r=a.identity,s=5e-5,l=function(t){t=t||{},t.position||(this.position=[0,0]),null==t.rotation&&(this.rotation=0),t.scale||(this.scale=[1,1]),this.origin=this.origin||null},u=l.prototype;u.transform=null,u.needLocalTransform=function(){return n(this.rotation)||n(this.position[0])||n(this.position[1])||n(this.scale[0]-1)||n(this.scale[1]-1)},u.updateTransform=function(){var t=this.parent,e=t&&t.transform,i=this.needLocalTransform(),n=this.transform;return i||e?(n=n||a.create(),i?this.getLocalTransform(n):r(n),e&&(i?a.mul(n,t.transform,n):a.copy(n,t.transform)),this.transform=n,this.invTransform=this.invTransform||a.create(),void a.invert(this.invTransform,n)):void(n&&r(n))},u.getLocalTransform=function(t){return l.getLocalTransform(this,t)},u.setTransform=function(t){var e=this.transform,i=t.dpr||1;e?t.setTransform(i*e[0],i*e[1],i*e[2],i*e[3],i*e[4],i*e[5]):t.setTransform(i,0,0,i,0,0)},u.restoreTransform=function(t){var e=t.dpr||1;t.setTransform(e,0,0,e,0,0)};var h=[];u.decomposeTransform=function(){if(this.transform){var t=this.parent,e=this.transform;t&&t.transform&&(a.mul(h,t.invTransform,e),e=h);var i=e[0]*e[0]+e[1]*e[1],o=e[2]*e[2]+e[3]*e[3],r=this.position,s=this.scale;n(i-1)&&(i=Math.sqrt(i)),n(o-1)&&(o=Math.sqrt(o)),e[0]<0&&(i=-i),e[3]<0&&(o=-o),r[0]=e[4],r[1]=e[5],s[0]=i,s[1]=o,this.rotation=Math.atan2(-e[1]/o,e[0]/i)}},u.getGlobalScale=function(){var t=this.transform;if(!t)return[1,1];var e=Math.sqrt(t[0]*t[0]+t[1]*t[1]),i=Math.sqrt(t[2]*t[2]+t[3]*t[3]);return t[0]<0&&(e=-e),t[3]<0&&(i=-i),[e,i]},u.transformCoordToLocal=function(t,e){var i=[t,e],n=this.invTransform;return n&&o.applyTransform(i,i,n),i},u.transformCoordToGlobal=function(t,e){var i=[t,e],n=this.transform;return n&&o.applyTransform(i,i,n),i},l.getLocalTransform=function(t,e){e=e||[],r(e);var i=t.origin,n=t.scale||[1,1],o=t.rotation||0,s=t.position||[0,0];return i&&(e[4]-=i[0],e[5]-=i[1]),a.scale(e,e,n),o&&a.rotate(e,e,o),i&&(e[4]+=i[0],e[5]+=i[1]),e[4]+=s[0],e[5]+=s[1],e},t.exports=l},function(t,e,i){var n=i(101),a=i(1),o=i(13),r=i(9),s=["value","category","time","log"];t.exports=function(t,e,i,l){a.each(s,function(o){e.extend({type:t+"Axis."+o,mergeDefaultAndTheme:function(e,n){var s=this.layoutMode,l=s?r.getLayoutParams(e):{},u=n.getTheme();a.merge(e,u.get(o+"Axis")),a.merge(e,this.getDefaultOption()),e.type=i(t,e),s&&r.mergeLayoutParam(e,l,s)},defaultOption:a.mergeAll([{},n[o+"Axis"],l],!0)})}),o.registerSubTypeDefaulter(t+"Axis",a.curry(i,t))}},function(t,e,i){"use strict";function n(t,e){return e.type||(e.data?"category":"value")}var a=i(13),o=i(1),r=i(62),s=a.extend({type:"cartesian2dAxis",axis:null,init:function(){s.superApply(this,"init",arguments),this.resetRange()},mergeOption:function(){s.superApply(this,"mergeOption",arguments),this.resetRange()},restoreData:function(){s.superApply(this,"restoreData",arguments),this.resetRange()},getCoordSysModel:function(){return this.ecModel.queryComponents({mainType:"grid",index:this.option.gridIndex,id:this.option.gridId})[0]}});o.merge(s.prototype,i(42));var l={offset:0};r("x",s,n,l),r("y",s,n,l),t.exports=s},function(t,e){t.exports=function(t,e){e.eachSeriesByType(t,function(t){var e=t.getData(),i=t.coordinateSystem;if(i){for(var n=[],a=i.dimensions,o=0;o<a.length;o++)n.push(t.coordDimToDataDim(i.dimensions[o])[0]);1===n.length?e.each(n[0],function(t,n){e.setItemLayout(n,isNaN(t)?[NaN,NaN]:i.dataToPoint(t))}):2===n.length&&e.each(n,function(t,n,a){e.setItemLayout(a,isNaN(t)||isNaN(n)?[NaN,NaN]:i.dataToPoint([t,n]))},!0)}})}},function(t,e,i){var n=i(15),a=n.set,o=n.get;t.exports={clearColorPalette:function(){a(this,"colorIdx",0),a(this,"colorNameMap",{})},getColorFromPalette:function(t,e){e=e||this;var i=o(e,"colorIdx")||0,n=o(e,"colorNameMap")||a(e,"colorNameMap",{});if(n.hasOwnProperty(t))return n[t];var r=this.get("color",!0)||[];if(r.length){var s=r[i];return t&&(n[t]=s),a(e,"colorIdx",(i+1)%r.length),s}}}},function(t,e){t.exports=function(t,e){var i=e.findComponents({mainType:"legend"});i&&i.length&&e.eachSeriesByType(t,function(t){var e=t.getData();e.filterSelf(function(t){for(var n=e.getName(t),a=0;a<i.length;a++)if(!i[a].isSelected(n))return!1;return!0},this)},this)}},function(t,e,i){function n(t,e,i){t[e]=Math.max(Math.min(t[e],i[1]),i[0])}var a=i(4),o=a.round,r={};r.intervalScaleNiceTicks=function(t,e,i,n){var s={},l=t[1]-t[0],u=s.interval=a.nice(l/e,!0);null!=i&&u<i&&(u=s.interval=i),null!=n&&u>n&&(u=s.interval=n);var h=s.intervalPrecision=r.getIntervalPrecision(u),c=s.niceTickExtent=[o(Math.ceil(t[0]/u)*u,h),o(Math.floor(t[1]/u)*u,h)];return r.fixExtent(c,t),s},r.getIntervalPrecision=function(t){return a.getPrecisionSafe(t)+2},r.fixExtent=function(t,e){!isFinite(t[0])&&(t[0]=e[0]),!isFinite(t[1])&&(t[1]=e[1]),n(t,0,e),n(t,1,e),t[0]>t[1]&&(t[0]=t[1])},r.intervalScaleGetTicks=function(t,e,i,n){var a=[];if(!t)return a;var r=1e4;e[0]<i[0]&&a.push(e[0]);for(var s=i[0];s<=i[1]&&(a.push(s),s=o(s+t,n),s!==a[a.length-1]);)if(a.length>r)return[];return e[1]>(a.length?a[a.length-1]:i[1])&&a.push(e[1]),a},t.exports=r},function(t,e,i){var n=i(36),a=i(50),o=i(15),r=function(){this.group=new n,this.uid=a.getUID("viewComponent")};r.prototype={constructor:r,init:function(t,e){},render:function(t,e,i,n){},dispose:function(){}};var s=r.prototype;s.updateView=s.updateLayout=s.updateVisual=function(t,e,i,n){},o.enableClassExtend(r),o.enableClassManagement(r,{registerWhenExtend:!0}),t.exports=r},function(t,e,i){"use strict";var n=i(74),a=i(23),o=i(61),r=i(184),s=i(1),l=function(t){o.call(this,t),a.call(this,t),r.call(this,t),this.id=t.id||n()};l.prototype={type:"element",name:"",__zr:null,ignore:!1,clipPath:null,drift:function(t,e){switch(this.draggable){case"horizontal":e=0;break;case"vertical":t=0}var i=this.transform;i||(i=this.transform=[1,0,0,1,0,0]),i[4]+=t,i[5]+=e,this.decomposeTransform(),this.dirty(!1)},beforeUpdate:function(){},afterUpdate:function(){},update:function(){this.updateTransform()},traverse:function(t,e){},attrKV:function(t,e){if("position"===t||"scale"===t||"origin"===t){if(e){var i=this[t];i||(i=this[t]=[]),i[0]=e[0],i[1]=e[1]}}else this[t]=e},hide:function(){this.ignore=!0,this.__zr&&this.__zr.refresh()},show:function(){this.ignore=!1,this.__zr&&this.__zr.refresh()},attr:function(t,e){if("string"==typeof t)this.attrKV(t,e);else if(s.isObject(t))for(var i in t)t.hasOwnProperty(i)&&this.attrKV(i,t[i]);return this.dirty(!1),this},setClipPath:function(t){var e=this.__zr;e&&t.addSelfToZr(e),this.clipPath&&this.clipPath!==t&&this.removeClipPath(),this.clipPath=t,t.__zr=e,t.__clipTarget=this,this.dirty(!1)},removeClipPath:function(){var t=this.clipPath;t&&(t.__zr&&t.removeSelfFromZr(t.__zr),t.__zr=null,t.__clipTarget=null,this.clipPath=null,this.dirty(!1))},addSelfToZr:function(t){this.__zr=t;var e=this.animators;if(e)for(var i=0;i<e.length;i++)t.animation.addAnimator(e[i]);this.clipPath&&this.clipPath.addSelfToZr(t)},removeSelfFromZr:function(t){this.__zr=null;var e=this.animators;if(e)for(var i=0;i<e.length;i++)t.animation.removeAnimator(e[i]);this.clipPath&&this.clipPath.removeSelfFromZr(t)}},s.mixin(l,r),s.mixin(l,o),s.mixin(l,a),t.exports=l},function(t,e,i){function n(t,e){return t[e]}function a(t,e,i){t[e]=i}function o(t,e,i){return(e-t)*i+t}function r(t,e,i){return i>.5?e:t}function s(t,e,i,n,a){var r=t.length;if(1==a)for(var s=0;s<r;s++)n[s]=o(t[s],e[s],i);else for(var l=r&&t[0].length,s=0;s<r;s++)for(var u=0;u<l;u++)n[s][u]=o(t[s][u],e[s][u],i)}function l(t,e,i){var n=t.length,a=e.length;if(n!==a){var o=n>a;if(o)t.length=a;else for(var r=n;r<a;r++)t.push(1===i?e[r]:_.call(e[r]))}for(var s=t[0]&&t[0].length,r=0;r<t.length;r++)if(1===i)isNaN(t[r])&&(t[r]=e[r]);else for(var l=0;l<s;l++)isNaN(t[r][l])&&(t[r][l]=e[r][l])}function u(t,e,i){if(t===e)return!0;var n=t.length;if(n!==e.length)return!1;if(1===i){for(var a=0;a<n;a++)if(t[a]!==e[a])return!1}else for(var o=t[0].length,a=0;a<n;a++)for(var r=0;r<o;r++)if(t[a][r]!==e[a][r])return!1;return!0}function h(t,e,i,n,a,o,r,s,l){var u=t.length;if(1==l)for(var h=0;h<u;h++)s[h]=c(t[h],e[h],i[h],n[h],a,o,r);else for(var d=t[0].length,h=0;h<u;h++)for(var f=0;f<d;f++)s[h][f]=c(t[h][f],e[h][f],i[h][f],n[h][f],a,o,r)}function c(t,e,i,n,a,o,r){var s=.5*(i-t),l=.5*(n-e);return(2*(e-i)+s+l)*r+(-3*(e-i)-2*s-l)*o+s*a+e}function d(t){if(x(t)){var e=t.length;if(x(t[0])){for(var i=[],n=0;n<e;n++)i.push(_.call(t[n]));return i}return _.call(t)}return t}function f(t){return t[0]=Math.floor(t[0]),t[1]=Math.floor(t[1]),t[2]=Math.floor(t[2]),"rgba("+t.join(",")+")"}function p(t){var e=t[t.length-1].value;return x(e&&e[0])?2:1}function g(t,e,i,n,a,d){var g=t._getter,y=t._setter,_="spline"===e,b=n.length;if(b){var w,S=n[0].value,M=x(S),I=!1,T=!1,A=M?p(n):0;n.sort(function(t,e){return t.time-e.time}),w=n[b-1].time;for(var C=[],L=[],D=n[0].value,P=!0,k=0;k<b;k++){C.push(n[k].time/w);var O=n[k].value;if(M&&u(O,D,A)||!M&&O===D||(P=!1),D=O,"string"==typeof O){var z=v.parse(O);z?(O=z,I=!0):T=!0}L.push(O)}if(d||!P){for(var E=L[b-1],k=0;k<b-1;k++)M?l(L[k],E,A):!isNaN(L[k])||isNaN(E)||T||I||(L[k]=E);M&&l(g(t._target,a),E,A);var R,N,V,B,G,H,W=0,F=0;if(I)var Z=[0,0,0,0];var q=function(t,e){var i;if(e<0)i=0;else if(e<F){for(R=Math.min(W+1,b-1),i=R;i>=0&&!(C[i]<=e);i--);i=Math.min(i,b-2)}else{for(i=W;i<b&&!(C[i]>e);i++);i=Math.min(i-1,b-2)}W=i,F=e;var n=C[i+1]-C[i];if(0!==n)if(N=(e-C[i])/n,_)if(B=L[i],V=L[0===i?i:i-1],G=L[i>b-2?b-1:i+1],H=L[i>b-3?b-1:i+2],M)h(V,B,G,H,N,N*N,N*N*N,g(t,a),A);else{var l;if(I)l=h(V,B,G,H,N,N*N,N*N*N,Z,1),l=f(Z);else{if(T)return r(B,G,N);l=c(V,B,G,H,N,N*N,N*N*N)}y(t,a,l)}else if(M)s(L[i],L[i+1],N,g(t,a),A);else{var l;if(I)s(L[i],L[i+1],N,Z,1),l=f(Z);else{if(T)return r(L[i],L[i+1],N);l=o(L[i],L[i+1],N)}y(t,a,l)}},j=new m({target:t._target,life:w,loop:t._loop,delay:t._delay,onframe:q,ondestroy:i});return e&&"spline"!==e&&(j.easing=e),j}}}var m=i(164),v=i(22),y=i(1),x=y.isArrayLike,_=Array.prototype.slice,b=function(t,e,i,o){this._tracks={},this._target=t,this._loop=e||!1,this._getter=i||n,this._setter=o||a,this._clipCount=0,this._delay=0,this._doneList=[],this._onframeList=[],this._clipList=[]};b.prototype={when:function(t,e){var i=this._tracks;for(var n in e)if(e.hasOwnProperty(n)){if(!i[n]){i[n]=[];var a=this._getter(this._target,n);if(null==a)continue;0!==t&&i[n].push({time:0,value:d(a)})}i[n].push({time:t,value:e[n]})}return this},during:function(t){return this._onframeList.push(t),this},pause:function(){for(var t=0;t<this._clipList.length;t++)this._clipList[t].pause();this._paused=!0},resume:function(){for(var t=0;t<this._clipList.length;t++)this._clipList[t].resume();this._paused=!1},isPaused:function(){return!!this._paused},_doneCallback:function(){this._tracks={},this._clipList.length=0;for(var t=this._doneList,e=t.length,i=0;i<e;i++)t[i].call(this)},start:function(t,e){var i,n=this,a=0,o=function(){a--,a||n._doneCallback()};for(var r in this._tracks)if(this._tracks.hasOwnProperty(r)){var s=g(this,t,o,this._tracks[r],r,e);s&&(this._clipList.push(s),a++,this.animation&&this.animation.addClip(s),i=s)}if(i){var l=i.onframe;i.onframe=function(t,e){l(t,e);for(var i=0;i<n._onframeList.length;i++)n._onframeList[i](t,e)}}return a||this._doneCallback(),this},stop:function(t){for(var e=this._clipList,i=this.animation,n=0;n<e.length;n++){var a=e[n];t&&a.onframe(this._target,1),i&&i.removeClip(a)}e.length=0},delay:function(t){return this._delay=t,this},done:function(t){return t&&this._doneList.push(t),this},getClips:function(){return this._clipList}},t.exports=b},function(t,e){t.exports="undefined"!=typeof window&&(window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.msRequestAnimationFrame&&window.msRequestAnimationFrame.bind(window)||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame)||function(t){setTimeout(t,16)}},function(t,e){var i=2*Math.PI;t.exports={normalizeRadian:function(t){return t%=i,t<0&&(t+=i),t}}},function(t,e){var i=function(){this.head=null,this.tail=null,this._len=0},n=i.prototype;n.insert=function(t){var e=new a(t);return this.insertEntry(e),e},n.insertEntry=function(t){this.head?(this.tail.next=t,t.prev=this.tail,t.next=null,this.tail=t):this.head=this.tail=t,this._len++},n.remove=function(t){var e=t.prev,i=t.next;e?e.next=i:this.head=i,i?i.prev=e:this.tail=e,t.next=t.prev=null,this._len--},n.len=function(){return this._len},n.clear=function(){this.head=this.tail=null,this._len=0};var a=function(t){this.value=t,this.next,this.prev},o=function(t){this._list=new i,this._map={},this._maxSize=t||10,this._lastRemovedEntry=null},r=o.prototype;r.put=function(t,e){var i=this._list,n=this._map,o=null;if(null==n[t]){var r=i.len(),s=this._lastRemovedEntry;if(r>=this._maxSize&&r>0){var l=i.head;i.remove(l),delete n[l.key],o=l.value,this._lastRemovedEntry=l}s?s.value=e:s=new a(e),s.key=t,i.insertEntry(s),n[t]=s}return o},r.get=function(t){var e=this._map[t],i=this._list;if(null!=e)return e!==i.tail&&(i.remove(e),i.insertEntry(e)),e.value},r.clear=function(){this._list.clear(),this._map={}},t.exports=o},function(t,e){var i=2311;t.exports=function(){return i++}},function(t,e){var i=function(t,e){this.image=t,this.repeat=e,this.type="pattern"};i.prototype.getCanvasPattern=function(t){return t.createPattern(this.image,this.repeat||"repeat")},t.exports=i},function(t,e){function i(t,e,i){var n=null==e.x?0:e.x,a=null==e.x2?1:e.x2,o=null==e.y?0:e.y,r=null==e.y2?0:e.y2;e.global||(n=n*i.width+i.x,a=a*i.width+i.x,o=o*i.height+i.y,r=r*i.height+i.y);var s=t.createLinearGradient(n,o,a,r);return s}function n(t,e,i){var n=i.width,a=i.height,o=Math.min(n,a),r=null==e.x?.5:e.x,s=null==e.y?.5:e.y,l=null==e.r?.5:e.r;e.global||(r=r*n+i.x,s=s*a+i.y,l*=o);var u=t.createRadialGradient(r,s,0,r,s,l);return u}var a=[["shadowBlur",0],["shadowOffsetX",0],["shadowOffsetY",0],["shadowColor","#000"],["lineCap","butt"],["lineJoin","miter"],["miterLimit",10]],o=function(t,e){this.extendFrom(t,!1),this.host=e};o.prototype={constructor:o,host:null,fill:"#000",stroke:null,opacity:1,lineDash:null,lineDashOffset:0,shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0,lineWidth:1,strokeNoScale:!1,text:null,font:null,textFont:null,fontStyle:null,fontWeight:null,fontSize:null,fontFamily:null,textTag:null,textFill:"#000",textStroke:null,textWidth:null,textHeight:null,textStrokeWidth:0,textLineHeight:null,textPosition:"inside",textRect:null,textOffset:null,textAlign:null,textVerticalAlign:null,textDistance:5,textShadowColor:"transparent",textShadowBlur:0,textShadowOffsetX:0,textShadowOffsetY:0,textBoxShadowColor:"transparent",textBoxShadowBlur:0,textBoxShadowOffsetX:0,textBoxShadowOffsetY:0,transformText:!1,textRotation:0,textOrigin:null,textBackgroundColor:null,textBorderColor:null,textBorderWidth:0,textBorderRadius:0,textPadding:null,rich:null,truncate:null,blend:null,bind:function(t,e,i){for(var n=this,o=i&&i.style,r=!o,s=0;s<a.length;s++){var l=a[s],u=l[0];(r||n[u]!==o[u])&&(t[u]=n[u]||l[1])}if((r||n.fill!==o.fill)&&(t.fillStyle=n.fill),(r||n.stroke!==o.stroke)&&(t.strokeStyle=n.stroke),(r||n.opacity!==o.opacity)&&(t.globalAlpha=null==n.opacity?1:n.opacity),(r||n.blend!==o.blend)&&(t.globalCompositeOperation=n.blend||"source-over"),this.hasStroke()){var h=n.lineWidth;t.lineWidth=h/(this.strokeNoScale&&e&&e.getLineScale?e.getLineScale():1)}},hasFill:function(){var t=this.fill;return null!=t&&"none"!==t},hasStroke:function(){var t=this.stroke;return null!=t&&"none"!==t&&this.lineWidth>0},extendFrom:function(t,e){if(t)for(var i in t)!t.hasOwnProperty(i)||e!==!0&&(e===!1?this.hasOwnProperty(i):null==t[i])||(this[i]=t[i])},set:function(t,e){"string"==typeof t?this[t]=e:this.extendFrom(t,!0)},clone:function(){var t=new this.constructor;return t.extendFrom(this,!0),t},getGradient:function(t,e,a){for(var o="radial"===e.type?n:i,r=o(t,e,a),s=e.colorStops,l=0;l<s.length;l++)r.addColorStop(s[l].offset,s[l].color);return r}};for(var r=o.prototype,s=0;s<a.length;s++){var l=a[s];l[0]in r||(r[l[0]]=l[1])}o.getGradient=r.getGradient,t.exports=o},function(t,e,i){var n=i(10),a=[["shadowBlur",0],["shadowColor","#000"],["shadowOffsetX",0],["shadowOffsetY",0]];t.exports=function(t){return n.browser.ie&&n.browser.version>=11?function(){var e,i=this.__clipPaths,n=this.style;if(i)for(var o=0;o<i.length;o++){var r=i[o],s=r&&r.shape,l=r&&r.type;if(s&&("sector"===l&&s.startAngle===s.endAngle||"rect"===l&&(!s.width||!s.height))){for(var u=0;u<a.length;u++)a[u][2]=n[a[u][0]],n[a[u][0]]=a[u][1];e=!0;break}}if(t.apply(this,arguments),e)for(var u=0;u<a.length;u++)n[a[u][0]]=a[u][2]}:t}},function(t,e,i){var n=i(174),a=i(173);t.exports={buildPath:function(t,e,i){var o=e.points,r=e.smooth;if(o&&o.length>=2){if(r&&"spline"!==r){var s=a(o,r,i,e.smoothConstraint);t.moveTo(o[0][0],o[0][1]);for(var l=o.length,u=0;u<(i?l:l-1);u++){var h=s[2*u],c=s[2*u+1],d=o[(u+1)%l];t.bezierCurveTo(h[0],h[1],c[0],c[1],d[0],d[1])}}else{"spline"===r&&(o=n(o,i)),t.moveTo(o[0][0],o[0][1]);for(var u=1,f=o.length;u<f;u++)t.lineTo(o[u][0],o[u][1])}i&&t.closePath()}}}},function(t,e){t.exports={buildPath:function(t,e){var i,n,a,o,r=e.x,s=e.y,l=e.width,u=e.height,h=e.r;l<0&&(r+=l,l=-l),u<0&&(s+=u,u=-u),"number"==typeof h?i=n=a=o=h:h instanceof Array?1===h.length?i=n=a=o=h[0]:2===h.length?(i=a=h[0],n=o=h[1]):3===h.length?(i=h[0],n=o=h[1],a=h[2]):(i=h[0],n=h[1],a=h[2],o=h[3]):i=n=a=o=0;var c;i+n>l&&(c=i+n,i*=l/c,n*=l/c),a+o>l&&(c=a+o,a*=l/c,o*=l/c),n+a>u&&(c=n+a,n*=u/c,a*=u/c),i+o>u&&(c=i+o,i*=u/c,o*=u/c),t.moveTo(r+i,s),
t.lineTo(r+l-n,s),0!==n&&t.quadraticCurveTo(r+l,s,r+l,s+n),t.lineTo(r+l,s+u-a),0!==a&&t.quadraticCurveTo(r+l,s+u,r+l-a,s+u),t.lineTo(r+o,s+u),0!==o&&t.quadraticCurveTo(r,s+u,r,s+u-o),t.lineTo(r,s+i),0!==i&&t.quadraticCurveTo(r,s,r+i,s)}}},function(t,e,i){var n=i(1),a={};a.layout=function(t,e,i){i=i||{};var a=t.coordinateSystem,o=e.axis,r={},s=o.position,l=o.onZero?"onZero":s,u=o.dim,h=a.getRect(),c=[h.x,h.x+h.width,h.y,h.y+h.height],d={left:0,right:1,top:0,bottom:1,onZero:2},f=e.get("offset")||0,p="x"===u?[c[2]-f,c[3]+f]:[c[0]-f,c[1]+f];if(o.onZero){var g=a.getAxis("x"===u?"y":"x",o.onZeroAxisIndex),m=g.toGlobalCoord(g.dataToCoord(0));p[d.onZero]=Math.max(Math.min(m,p[1]),p[0])}r.position=["y"===u?p[d[l]]:c[0],"x"===u?p[d[l]]:c[3]],r.rotation=Math.PI/2*("x"===u?0:1);var v={top:-1,bottom:1,left:-1,right:1};r.labelDirection=r.tickDirection=r.nameDirection=v[s],r.labelOffset=o.onZero?p[d[s]]-p[d.onZero]:0,e.get("axisTick.inside")&&(r.tickDirection=-r.tickDirection),n.retrieve(i.labelInside,e.get("axisLabel.inside"))&&(r.labelDirection=-r.labelDirection);var y=e.get("axisLabel.rotate");return r.labelRotate="top"===l?-y:y,r.labelInterval=o.getLabelInterval(),r.z2=1,r},t.exports=a},function(t,e,i){"use strict";function n(t,e,i,n){var a=n.getWidth(),o=n.getHeight();t[0]=Math.min(t[0]+e,a)-e,t[1]=Math.min(t[1]+i,o)-i,t[0]=Math.max(t[0],0),t[1]=Math.max(t[1],0)}var a=i(1),o=i(3),r=i(16),s=i(7),l=i(19),u=i(18),h=i(40),c={};c.buildElStyle=function(t){var e,i=t.get("type"),n=t.getModel(i+"Style");return"line"===i?(e=n.getLineStyle(),e.fill=null):"shadow"===i&&(e=n.getAreaStyle(),e.stroke=null),e},c.buildLabelElOption=function(t,e,i,a,o){var l=i.get("value"),u=c.getValueLabel(l,e.axis,e.ecModel,i.get("seriesDataIndices"),{precision:i.get("label.precision"),formatter:i.get("label.formatter")}),h=i.getModel("label"),d=s.normalizeCssArray(h.get("padding")||0),f=h.getFont(),p=r.getBoundingRect(u,f),g=o.position,m=p.width+d[1]+d[3],v=p.height+d[0]+d[2],y=o.align;"right"===y&&(g[0]-=m),"center"===y&&(g[0]-=m/2);var x=o.verticalAlign;"bottom"===x&&(g[1]-=v),"middle"===x&&(g[1]-=v/2),n(g,m,v,a);var _=h.get("backgroundColor");_&&"auto"!==_||(_=e.get("axisLine.lineStyle.color")),t.label={shape:{x:0,y:0,width:m,height:v,r:h.get("borderRadius")},position:g.slice(),style:{text:u,textFont:f,textFill:h.getTextColor(),textPosition:"inside",fill:_,stroke:h.get("borderColor")||"transparent",lineWidth:h.get("borderWidth")||0,shadowBlur:h.get("shadowBlur"),shadowColor:h.get("shadowColor"),shadowOffsetX:h.get("shadowOffsetX"),shadowOffsetY:h.get("shadowOffsetY")},z2:10}},c.getValueLabel=function(t,e,i,n,o){var r=e.scale.getLabel(t,{precision:o.precision}),s=o.formatter;if(s){var l={value:u.getAxisRawValue(e,t),seriesData:[]};a.each(n,function(t){var e=i.getSeriesByIndex(t.seriesIndex),n=t.dataIndexInside,a=e&&e.getDataParams(n);a&&l.seriesData.push(a)}),a.isString(s)?r=s.replace("{value}",r):a.isFunction(s)&&(r=s(l))}return r},c.getTransformedPosition=function(t,e,i){var n=l.create();return l.rotate(n,n,i.rotation),l.translate(n,n,i.position),o.applyTransform([t.dataToCoord(e),(i.labelOffset||0)+(i.labelDirection||1)*(i.labelMargin||0)],n)},c.buildCartesianSingleLabelElOption=function(t,e,i,n,a,o){var r=h.innerTextLayout(i.rotation,0,i.labelDirection);i.labelMargin=a.get("label.margin"),c.buildLabelElOption(e,n,a,o,{position:c.getTransformedPosition(n.axis,t,i),align:r.textAlign,verticalAlign:r.textVerticalAlign})},c.makeLineShape=function(t,e,i){return i=i||0,{x1:t[i],y1:t[1-i],x2:e[i],y2:e[1-i]}},c.makeRectShape=function(t,e,i){return i=i||0,{x:t[i],y:t[1-i],width:e[i],height:e[1-i]}},c.makeSectorShape=function(t,e,i,n,a,o){return{cx:t,cy:e,r0:i,r:n,startAngle:a,endAngle:o,clockwise:!0}},t.exports=c},function(t,e,i){var n=i(7),a=i(1),o={},r=["x","y","z","radius","angle","single"],s=["cartesian2d","polar","singleAxis"];o.isCoordSupported=function(t){return a.indexOf(s,t)>=0},o.createNameEach=function(t,e){t=t.slice();var i=a.map(t,n.capitalFirst);e=(e||[]).slice();var o=a.map(e,n.capitalFirst);return function(n,r){a.each(t,function(t,a){for(var s={name:t,capital:i[a]},l=0;l<e.length;l++)s[e[l]]=t+o[l];n.call(r,s)})}},o.eachAxisDim=o.createNameEach(r,["axisIndex","axis","index","id"]),o.createLinkedNodesFinder=function(t,e,i){function n(t,e){return a.indexOf(e.nodes,t)>=0}function o(t,n){var o=!1;return e(function(e){a.each(i(t,e)||[],function(t){n.records[e.name][t]&&(o=!0)})}),o}function r(t,n){n.nodes.push(t),e(function(e){a.each(i(t,e)||[],function(t){n.records[e.name][t]=!0})})}return function(i){function a(t){!n(t,s)&&o(t,s)&&(r(t,s),l=!0)}var s={nodes:[],records:{}};if(e(function(t){s.records[t.name]={}}),!i)return s;r(i,s);var l;do l=!1,t(a);while(l);return s}},t.exports=o},function(t,e,i){var n=i(1);t.exports={updateSelectedMap:function(t){this._targetList=t.slice(),this._selectTargetMap=n.reduce(t||[],function(t,e){return t.set(e.name,e),t},n.createHashMap())},select:function(t,e){var i=null!=e?this._targetList[e]:this._selectTargetMap.get(t),n=this.get("selectedMode");"single"===n&&this._selectTargetMap.each(function(t){t.selected=!1}),i&&(i.selected=!0)},unSelect:function(t,e){var i=null!=e?this._targetList[e]:this._selectTargetMap.get(t);i&&(i.selected=!1)},toggleSelected:function(t,e){var i=null!=e?this._targetList[e]:this._selectTargetMap.get(t);if(null!=i)return this[i.selected?"unSelect":"select"](t,e),i.selected},isSelected:function(t,e){var i=null!=e?this._targetList[e]:this._selectTargetMap.get(t);return i&&i.selected}}},function(t,e,i){function n(t){a.defaultEmphasis(t.label,["show"])}var a=i(5),o=i(1),r=i(10),s=i(7),l=s.addCommas,u=s.encodeHTML,h=i(2).extendComponentModel({type:"marker",dependencies:["series","grid","polar","geo"],init:function(t,e,i,n){this.mergeDefaultAndTheme(t,i),this.mergeOption(t,i,n.createdBySelf,!0)},isAnimationEnabled:function(){if(r.node)return!1;var t=this.__hostSeries;return this.getShallow("animation")&&t&&t.isAnimationEnabled()},mergeOption:function(t,e,i,a){var r=this.constructor,s=this.mainType+"Model";i||e.eachSeries(function(t){var i=t.get(this.mainType),l=t[s];return i&&i.data?(l?l.mergeOption(i,e,!0):(a&&n(i),o.each(i.data,function(t){t instanceof Array?(n(t[0]),n(t[1])):n(t)}),l=new r(i,this,e),o.extend(l,{mainType:this.mainType,seriesIndex:t.seriesIndex,name:t.name,createdBySelf:!0}),l.__hostSeries=t),void(t[s]=l)):void(t[s]=null)},this)},formatTooltip:function(t){var e=this.getData(),i=this.getRawValue(t),n=o.isArray(i)?o.map(i,l).join(", "):l(i),a=e.getName(t),r=u(this.name);return(null!=i||a)&&(r+="<br />"),a&&(r+=u(a),null!=i&&(r+=" : ")),null!=i&&(r+=u(n)),r},getData:function(){return this._data},setData:function(t){this._data=t}});o.mixin(h,a.dataFormatMixin),t.exports=h},function(t,e,i){var n=i(1);t.exports=i(2).extendComponentView({type:"marker",init:function(){this.markerGroupMap=n.createHashMap()},render:function(t,e,i){var n=this.markerGroupMap;n.each(function(t){t.__keep=!1});var a=this.type+"Model";e.eachSeries(function(t){var n=t[a];n&&this.renderSeries(t,n,e,i)},this),n.each(function(t){!t.__keep&&this.group.remove(t.group)},this)},renderSeries:function(){}})},function(t,e,i){function n(t){return!(isNaN(parseFloat(t.x))&&isNaN(parseFloat(t.y)))}function a(t){return!isNaN(parseFloat(t.x))&&!isNaN(parseFloat(t.y))}function o(t,e,i){var n=-1;do n=Math.max(l.getPrecision(t.get(e,i)),n),t=t.stackedOn;while(t);return n}function r(t,e,i,n,a,r){var s=[],l=m(e,n,t),u=e.indicesOfNearest(n,l,!0)[0];s[a]=e.get(i,u,!0),s[r]=e.get(n,u,!0);var h=o(e,n,u);return h=Math.min(h,20),h>=0&&(s[r]=+s[r].toFixed(h)),s}var s=i(1),l=i(4),u=s.indexOf,h=s.curry,c={min:h(r,"min"),max:h(r,"max"),average:h(r,"average")},d=function(t,e){var i=t.getData(),n=t.coordinateSystem;if(e&&!a(e)&&!s.isArray(e.coord)&&n){var o=n.dimensions,r=f(e,i,n,t);if(e=s.clone(e),e.type&&c[e.type]&&r.baseAxis&&r.valueAxis){var l=u(o,r.baseAxis.dim),h=u(o,r.valueAxis.dim);e.coord=c[e.type](i,r.baseDataDim,r.valueDataDim,l,h),e.value=e.coord[h]}else{for(var d=[null!=e.xAxis?e.xAxis:e.radiusAxis,null!=e.yAxis?e.yAxis:e.angleAxis],p=0;p<2;p++)if(c[d[p]]){var g=t.coordDimToDataDim(o[p])[0];d[p]=m(i,g,d[p])}e.coord=d}}return e},f=function(t,e,i,n){var a={};return null!=t.valueIndex||null!=t.valueDim?(a.valueDataDim=null!=t.valueIndex?e.getDimension(t.valueIndex):t.valueDim,a.valueAxis=i.getAxis(n.dataDimToCoordDim(a.valueDataDim)),a.baseAxis=i.getOtherAxis(a.valueAxis),a.baseDataDim=n.coordDimToDataDim(a.baseAxis.dim)[0]):(a.baseAxis=n.getBaseAxis(),a.valueAxis=i.getOtherAxis(a.baseAxis),a.baseDataDim=n.coordDimToDataDim(a.baseAxis.dim)[0],a.valueDataDim=n.coordDimToDataDim(a.valueAxis.dim)[0]),a},p=function(t,e){return!(t&&t.containData&&e.coord&&!n(e))||t.containData(e.coord)},g=function(t,e,i,n){return n<2?t.coord&&t.coord[n]:t.value},m=function(t,e,i){if("average"===i){var n=0,a=0;return t.each(e,function(t,e){isNaN(t)||(n+=t,a++)},!0),n/a}return t.getDataExtent(e,!0)["max"===i?1:0]};t.exports={dataTransform:d,dataFilter:p,dimValueGetter:g,getAxisInfo:f,numCalculate:m}},function(t,e,i){"use strict";function n(t){return t.get("stack")||d+t.seriesIndex}function a(t){return t.dim+t.index}function o(t,e){var i=[],n=t.axis,a="axis0";if("category"===n.type){for(var o=n.getBandWidth(),r=0;r<t.count;r++)i.push(u.defaults({bandWidth:o,axisKey:a,stackId:d+r},t));for(var l=s(i,e),h=[],r=0;r<t.count;r++){var c=l[a][d+r];c.offsetCenter=c.offset+c.width/2,h.push(c)}return h}}function r(t,e){var i=u.map(t,function(t){var e=t.getData(),i=t.coordinateSystem,o=i.getBaseAxis(),r=o.getExtent(),s="category"===o.type?o.getBandWidth():Math.abs(r[1]-r[0])/e.count(),l=c(t.get("barWidth"),s),u=c(t.get("barMaxWidth"),s),h=t.get("barGap"),d=t.get("barCategoryGap");return{bandWidth:s,barWidth:l,barMaxWidth:u,barGap:h,barCategoryGap:d,axisKey:a(o),stackId:n(t)}});return s(i,e)}function s(t,e){var i={};u.each(t,function(t,e){var n=t.axisKey,a=t.bandWidth,o=i[n]||{bandWidth:a,remainedWidth:a,autoWidthCount:0,categoryGap:"20%",gap:"30%",stacks:{}},r=o.stacks;i[n]=o;var s=t.stackId;r[s]||o.autoWidthCount++,r[s]=r[s]||{width:0,maxWidth:0};var l=t.barWidth;l&&!r[s].width&&(r[s].width=l,l=Math.min(o.remainedWidth,l),o.remainedWidth-=l);var u=t.barMaxWidth;u&&(r[s].maxWidth=u);var h=t.barGap;null!=h&&(o.gap=h);var c=t.barCategoryGap;null!=c&&(o.categoryGap=c)});var n={};return u.each(i,function(t,e){n[e]={};var i=t.stacks,a=t.bandWidth,o=c(t.categoryGap,a),r=c(t.gap,1),s=t.remainedWidth,l=t.autoWidthCount,h=(s-o)/(l+(l-1)*r);h=Math.max(h,0),u.each(i,function(t,e){var i=t.maxWidth;i&&i<h&&(i=Math.min(i,s),t.width&&(i=Math.min(i,t.width)),s-=i,t.width=i,l--)}),h=(s-o)/(l+(l-1)*r),h=Math.max(h,0);var d,f=0;u.each(i,function(t,e){t.width||(t.width=h),d=t,f+=t.width*(1+r)}),d&&(f-=d.width*r);var p=-f/2;u.each(i,function(t,i){n[e][i]=n[e][i]||{offset:p,width:t.width},p+=t.width*(1+r)})}),n}function l(t,e,i){var o=r(u.filter(e.getSeriesByType(t),function(t){return!e.isSeriesFiltered(t)&&t.coordinateSystem&&"cartesian2d"===t.coordinateSystem.type})),s={},l={};e.eachSeriesByType(t,function(t){if("cartesian2d"===t.coordinateSystem.type){var e=t.getData(),i=t.coordinateSystem,r=i.getBaseAxis(),u=n(t),h=o[a(r)][u],c=h.offset,d=h.width,f=i.getOtherAxis(r),p=t.get("barMinHeight")||0,g=r.onZero?f.toGlobalCoord(f.dataToCoord(0)):f.getGlobalExtent()[0],m=[t.coordDimToDataDim("x")[0],t.coordDimToDataDim("y")[0]],v=e.mapArray(m,function(t,e){return i.dataToPoint([t,e])},!0);s[u]=s[u]||[],l[u]=l[u]||[],e.setLayout({offset:c,size:d}),e.each(t.coordDimToDataDim(f.dim)[0],function(t,i){if(!isNaN(t)){s[u][i]||(s[u][i]={p:g,n:g},l[u][i]={p:g,n:g});var n,a,o,r,h=t>=0?"p":"n",m=v[i],y=s[u][i][h],x=l[u][i][h];f.isHorizontal()?(n=y,a=m[1]+c,o=m[0]-x,r=d,l[u][i][h]+=o,Math.abs(o)<p&&(o=(o<0?-1:1)*p),s[u][i][h]+=o):(n=m[0]+c,a=y,o=d,r=m[1]-x,l[u][i][h]+=r,Math.abs(r)<p&&(r=(r<=0?-1:1)*p),s[u][i][h]+=r),e.setItemLayout(i,{x:n,y:a,width:o,height:r})}},!0)}},this)}var u=i(1),h=i(4),c=h.parsePercent,d="__ec_stack_";l.getLayoutOnAxis=o,t.exports=l},function(t,e,i){function n(t){var e=t.pieceList;t.hasSpecialVisual=!1,g.each(e,function(e,i){e.originIndex=i,null!=e.visual&&(t.hasSpecialVisual=!0)})}function a(t){var e=t.categories,i=t.visual,n=t.categoryMap={};if(y(e,function(t,e){n[t]=e}),!g.isArray(i)){var a=[];g.isObject(i)?y(i,function(t,e){var i=n[e];a[null!=i?i:_]=t}):a[_]=i,i=f(t,a)}for(var o=e.length-1;o>=0;o--)null==i[o]&&(delete n[e[o]],e.pop())}function o(t,e){var i=t.visual,n=[];g.isObject(i)?y(i,function(t){n.push(t)}):null!=i&&n.push(i);var a={color:1,symbol:1};e||1!==n.length||a.hasOwnProperty(t.type)||(n[1]=n[0]),f(t,n)}function r(t){return{applyVisual:function(e,i,n){e=this.mapValueToVisual(e),n("color",t(i("color"),e))},_doMap:c([0,1])}}function s(t){var e=this.option.visual;return e[Math.round(v(t,[0,1],[0,e.length-1],!0))]||{}}function l(t){return function(e,i,n){n(t,this.mapValueToVisual(e))}}function u(t){var e=this.option.visual;return e[this.option.loop&&t!==_?t%e.length:t]}function h(){return this.option.visual[0]}function c(t){return{linear:function(e){return v(e,t,this.option.visual,!0)},category:u,piecewise:function(e,i){var n=d.call(this,i);return null==n&&(n=v(e,t,this.option.visual,!0)),n},fixed:h}}function d(t){var e=this.option,i=e.pieceList;if(e.hasSpecialVisual){var n=b.findPieceIndex(t,i),a=i[n];if(a&&a.visual)return a.visual[this.type]}}function f(t,e){return t.visual=e,"color"===t.type&&(t.parsedVisual=g.map(e,function(t){return m.parse(t)})),e}function p(t,e,i){return t?e<=i:e<i}var g=i(1),m=i(22),v=i(4).linearMap,y=g.each,x=g.isObject,_=-1,b=function(t){var e=t.mappingMethod,i=t.type,r=this.option=g.clone(t);this.type=i,this.mappingMethod=e,this._normalizeData=S[e];var s=w[i];this.applyVisual=s.applyVisual,this.getColorMapper=s.getColorMapper,this._doMap=s._doMap[e],"piecewise"===e?(o(r),n(r)):"category"===e?r.categories?a(r):o(r,!0):(g.assert("linear"!==e||r.dataExtent),o(r))};b.prototype={constructor:b,mapValueToVisual:function(t){var e=this._normalizeData(t);return this._doMap(e,t)},getNormalizer:function(){return g.bind(this._normalizeData,this)}};var w=b.visualHandlers={color:{applyVisual:l("color"),getColorMapper:function(){var t=this.option;return g.bind("category"===t.mappingMethod?function(t,e){return!e&&(t=this._normalizeData(t)),u.call(this,t)}:function(e,i,n){var a=!!n;return!i&&(e=this._normalizeData(e)),n=m.fastLerp(e,t.parsedVisual,n),a?n:m.stringify(n,"rgba")},this)},_doMap:{linear:function(t){return m.stringify(m.fastLerp(t,this.option.parsedVisual),"rgba")},category:u,piecewise:function(t,e){var i=d.call(this,e);return null==i&&(i=m.stringify(m.fastLerp(t,this.option.parsedVisual),"rgba")),i},fixed:h}},colorHue:r(function(t,e){return m.modifyHSL(t,e)}),colorSaturation:r(function(t,e){return m.modifyHSL(t,null,e)}),colorLightness:r(function(t,e){return m.modifyHSL(t,null,null,e)}),colorAlpha:r(function(t,e){return m.modifyAlpha(t,e)}),opacity:{applyVisual:l("opacity"),_doMap:c([0,1])},symbol:{applyVisual:function(t,e,i){var n=this.mapValueToVisual(t);if(g.isString(n))i("symbol",n);else if(x(n))for(var a in n)n.hasOwnProperty(a)&&i(a,n[a])},_doMap:{linear:s,category:u,piecewise:function(t,e){var i=d.call(this,e);return null==i&&(i=s.call(this,t)),i},fixed:h}},symbolSize:{applyVisual:l("symbolSize"),_doMap:c([0,1])}},S={linear:function(t){return v(t,this.option.dataExtent,[0,1],!0)},piecewise:function(t){var e=this.option.pieceList,i=b.findPieceIndex(t,e,!0);if(null!=i)return v(i,[0,e.length-1],[0,1],!0)},category:function(t){var e=this.option.categories?this.option.categoryMap[t]:t;return null==e?_:e},fixed:g.noop};b.listVisualTypes=function(){var t=[];return g.each(w,function(e,i){t.push(i)}),t},b.addVisualHandler=function(t,e){w[t]=e},b.isValidType=function(t){return w.hasOwnProperty(t)},b.eachVisual=function(t,e,i){g.isObject(t)?g.each(t,e,i):e.call(i,t)},b.mapVisual=function(t,e,i){var n,a=g.isArray(t)?[]:g.isObject(t)?{}:(n=!0,null);return b.eachVisual(t,function(t,o){var r=e.call(i,t,o);n?a=r:a[o]=r}),a},b.retrieveVisuals=function(t){var e,i={};return t&&y(w,function(n,a){t.hasOwnProperty(a)&&(i[a]=t[a],e=!0)}),e?i:null},b.prepareVisualTypes=function(t){if(x(t)){var e=[];y(t,function(t,i){e.push(i)}),t=e}else{if(!g.isArray(t))return[];t=t.slice()}return t.sort(function(t,e){return"color"===e&&"color"!==t&&0===t.indexOf("color")?1:-1}),t},b.dependsOn=function(t,e){return"color"===e?!(!t||0!==t.indexOf(e)):t===e},b.findPieceIndex=function(t,e,i){function n(e,i){var n=Math.abs(e-t);n<o&&(o=n,a=i)}for(var a,o=1/0,r=0,s=e.length;r<s;r++){var l=e[r].value;if(null!=l){if(l===t||"string"==typeof l&&l===t+"")return r;i&&n(l,r)}}for(var r=0,s=e.length;r<s;r++){var u=e[r],h=u.interval,c=u.close;if(h){if(h[0]===-(1/0)){if(p(c[1],t,h[1]))return r}else if(h[1]===1/0){if(p(c[0],h[0],t))return r}else if(p(c[0],h[0],t)&&p(c[1],t,h[1]))return r;i&&n(h[0],r),i&&n(h[1],r)}}if(i)return t===1/0?e.length-1:t===-(1/0)?0:a},t.exports=b},function(t,e){t.exports=function(t,e){var i={};e.eachRawSeriesByType(t,function(t){var n=t.getRawData(),a={};if(!e.isSeriesFiltered(t)){var o=t.getData();o.each(function(t){var e=o.getRawIndex(t);a[e]=t}),n.each(function(e){var r=a[e],s=null!=r&&o.getItemVisual(r,"color",!0);if(s)n.setItemVisual(e,"color",s);else{var l=n.getItemModel(e),u=l.get("itemStyle.normal.color")||t.getColorFromPalette(n.getName(e),i);n.setItemVisual(e,"color",u),null!=r&&o.setItemVisual(r,"color",u)}})}})}},function(t,e,i){var n=i(6),a=i(20),o={},r=Math.min,s=Math.max,l=Math.sin,u=Math.cos,h=n.create(),c=n.create(),d=n.create(),f=2*Math.PI;o.fromPoints=function(t,e,i){if(0!==t.length){var n,a=t[0],o=a[0],l=a[0],u=a[1],h=a[1];for(n=1;n<t.length;n++)a=t[n],o=r(o,a[0]),l=s(l,a[0]),u=r(u,a[1]),h=s(h,a[1]);e[0]=o,e[1]=u,i[0]=l,i[1]=h}},o.fromLine=function(t,e,i,n,a,o){a[0]=r(t,i),a[1]=r(e,n),o[0]=s(t,i),o[1]=s(e,n)};var p=[],g=[];o.fromCubic=function(t,e,i,n,o,l,u,h,c,d){var f,m=a.cubicExtrema,v=a.cubicAt,y=m(t,i,o,u,p);for(c[0]=1/0,c[1]=1/0,d[0]=-(1/0),d[1]=-(1/0),f=0;f<y;f++){var x=v(t,i,o,u,p[f]);c[0]=r(x,c[0]),d[0]=s(x,d[0])}for(y=m(e,n,l,h,g),f=0;f<y;f++){var _=v(e,n,l,h,g[f]);c[1]=r(_,c[1]),d[1]=s(_,d[1])}c[0]=r(t,c[0]),d[0]=s(t,d[0]),c[0]=r(u,c[0]),d[0]=s(u,d[0]),c[1]=r(e,c[1]),d[1]=s(e,d[1]),c[1]=r(h,c[1]),d[1]=s(h,d[1])},o.fromQuadratic=function(t,e,i,n,o,l,u,h){var c=a.quadraticExtremum,d=a.quadraticAt,f=s(r(c(t,i,o),1),0),p=s(r(c(e,n,l),1),0),g=d(t,i,o,f),m=d(e,n,l,p);u[0]=r(t,o,g),u[1]=r(e,l,m),h[0]=s(t,o,g),h[1]=s(e,l,m)},o.fromArc=function(t,e,i,a,o,r,s,p,g){var m=n.min,v=n.max,y=Math.abs(o-r);if(y%f<1e-4&&y>1e-4)return p[0]=t-i,p[1]=e-a,g[0]=t+i,void(g[1]=e+a);if(h[0]=u(o)*i+t,h[1]=l(o)*a+e,c[0]=u(r)*i+t,c[1]=l(r)*a+e,m(p,h,c),v(g,h,c),o%=f,o<0&&(o+=f),r%=f,r<0&&(r+=f),o>r&&!s?r+=f:o<r&&s&&(o+=f),s){var x=r;r=o,o=x}for(var _=0;_<r;_+=Math.PI/2)_>o&&(d[0]=u(_)*i+t,d[1]=l(_)*a+e,m(p,d,p),v(g,d,g))},t.exports=o},function(t,e,i){var n=i(38),a=i(1),o=i(16),r=i(56),s=function(t){n.call(this,t)};s.prototype={constructor:s,type:"text",brush:function(t,e){var i=this.style;this.__dirty&&r.normalizeTextStyle(i,!0),i.fill=i.stroke=i.shadowBlur=i.shadowColor=i.shadowOffsetX=i.shadowOffsetY=null;var n=i.text;null!=n&&(n+=""),i.bind(t,this,e),r.needDrawText(n,i)&&(this.setTransform(t),r.renderText(this,t,n,i),this.restoreTransform(t))},getBoundingRect:function(){var t=this.style;if(this.__dirty&&r.normalizeTextStyle(t,!0),!this._rect){var e=t.text;null!=e?e+="":e="";var i=o.getBoundingRect(t.text+"",t.font,t.textAlign,t.textVerticalAlign,t.textPadding,t.rich);if(i.x+=t.x||0,i.y+=t.y||0,r.getStroke(t.textStroke,t.textStrokeWidth)){var n=t.textStrokeWidth;i.x-=n/2,i.y-=n/2,i.width+=n,i.height+=n}this._rect=i}return this._rect}},a.inherits(s,n),t.exports=s},function(t,e,i){var n=i(56),a=i(12),o=new a,r=function(){};r.prototype={constructor:r,drawRectText:function(t,e){var i=this.style;e=i.textRect||e,this.__dirty&&n.normalizeTextStyle(i,!0);var a=i.text;if(null!=a&&(a+=""),n.needDrawText(a,i)){t.save();var r=this.transform;i.transformText?this.setTransform(t):r&&(o.copy(e),o.applyTransform(r),e=o),n.renderText(this,t,a,i,e),t.restore()}}},t.exports=r},function(t,e,i){function n(t){delete f[t]}/*!
	 * ZRender, a high performance 2d drawing library.
	 *
	 * Copyright (c) 2013, Baidu Inc.
	 * All rights reserved.
	 *
	 * LICENSE
	 * https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
	 */
var a=i(74),o=i(10),r=i(1),s=i(159),l=i(162),u=i(163),h=i(170),c=!o.canvasSupported,d={canvas:i(161)},f={},p={};p.version="3.6.2",p.init=function(t,e){var i=new g(a(),t,e);return f[i.id]=i,i},p.dispose=function(t){if(t)t.dispose();else{for(var e in f)f.hasOwnProperty(e)&&f[e].dispose();f={}}return p},p.getInstance=function(t){return f[t]},p.registerPainter=function(t,e){d[t]=e};var g=function(t,e,i){i=i||{},this.dom=e,this.id=t;var n=this,a=new l,f=i.renderer;if(c){if(!d.vml)throw new Error("You need to require 'zrender/vml/vml' to support IE8");f="vml"}else f&&d[f]||(f="canvas");var p=new d[f](e,a,i);this.storage=a,this.painter=p;var g=o.node?null:new h(p.getViewportRoot());this.handler=new s(a,p,g,p.root),this.animation=new u({stage:{update:r.bind(this.flush,this)}}),this.animation.start(),this._needsRefresh;var m=a.delFromStorage,v=a.addToStorage;a.delFromStorage=function(t){m.call(a,t),t&&t.removeSelfFromZr(n)},a.addToStorage=function(t){v.call(a,t),t.addSelfToZr(n)}};g.prototype={constructor:g,getId:function(){return this.id},add:function(t){this.storage.addRoot(t),this._needsRefresh=!0},remove:function(t){this.storage.delRoot(t),this._needsRefresh=!0},configLayer:function(t,e){this.painter.configLayer(t,e),this._needsRefresh=!0},refreshImmediately:function(){this._needsRefresh=!1,this.painter.refresh(),this._needsRefresh=!1},refresh:function(){this._needsRefresh=!0},flush:function(){this._needsRefresh&&this.refreshImmediately(),this._needsRefreshHover&&this.refreshHoverImmediately()},addHover:function(t,e){this.painter.addHover&&(this.painter.addHover(t,e),this.refreshHover())},removeHover:function(t){this.painter.removeHover&&(this.painter.removeHover(t),this.refreshHover())},clearHover:function(){this.painter.clearHover&&(this.painter.clearHover(),this.refreshHover())},refreshHover:function(){this._needsRefreshHover=!0},refreshHoverImmediately:function(){this._needsRefreshHover=!1,this.painter.refreshHover&&this.painter.refreshHover()},resize:function(t){t=t||{},this.painter.resize(t.width,t.height),this.handler.resize()},clearAnimation:function(){this.animation.clear()},getWidth:function(){return this.painter.getWidth()},getHeight:function(){return this.painter.getHeight()},pathToImage:function(t,e){return this.painter.pathToImage(t,e)},setCursorStyle:function(t){this.handler.setCursorStyle(t)},findHover:function(t,e){return this.handler.findHover(t,e)},on:function(t,e,i){this.handler.on(t,e,i)},off:function(t,e){this.handler.off(t,e)},trigger:function(t,e){this.handler.trigger(t,e)},clear:function(){this.storage.delRoot(),this.painter.clear()},dispose:function(){this.animation.stop(),this.clear(),this.storage.dispose(),this.painter.dispose(),this.handler.dispose(),this.animation=this.storage=this.painter=this.handler=null,n(this.id)}},t.exports=p},function(t,e,i){var n=i(2),a=i(1);t.exports=function(t,e){a.each(e,function(e){e.update="updateView",n.registerAction(e,function(i,n){var a={};return n.eachComponent({mainType:"series",subType:t,query:i},function(t){t[e.method]&&t[e.method](i.name,i.dataIndex);var n=t.getData();n.each(function(e){var i=n.getName(e);a[i]=t.isSelected(i)||!1})}),{name:i.name,selected:a}})})}},function(t,e,i){"use strict";var n=i(17),a=i(28);t.exports=n.extend({type:"series.__base_bar__",getInitialData:function(t,e){return a(t.data,this,e)},getMarkerPosition:function(t){var e=this.coordinateSystem;if(e){var i=e.dataToPoint(t,!0),n=this.getData(),a=n.getLayout("offset"),o=n.getLayout("size"),r=e.getBaseAxis().isHorizontal()?0:1;return i[r]+=a+o/2,i}return[NaN,NaN]},defaultOption:{zlevel:0,z:2,coordinateSystem:"cartesian2d",legendHoverLink:!0,barMinHeight:0,barMinAngle:0,itemStyle:{}}})},function(t,e,i){function n(t,e){"outside"===t.textPosition&&(t.textPosition=e)}var a=i(3),o={};o.setLabel=function(t,e,i,o,r,s,l){var u=i.getModel("label.normal"),h=i.getModel("label.emphasis");a.setLabelStyle(t,e,u,h,{labelFetcher:r,labelDataIndex:s,defaultText:r.getRawValue(s),isRectText:!0,autoColor:o}),n(t),n(e)},t.exports=o},function(t,e,i){var n=i(5),a={};a.findLabelValueDim=function(t){var e,i=n.otherDimToDataDim(t,"label");if(i.length)e=i[0];else for(var a,o=t.dimensions.slice();o.length&&(e=o.pop(),a=t.getDimensionInfo(e).type,"ordinal"===a||"time"===a););return e},t.exports=a},function(t,e,i){function n(t){return isNaN(t[0])||isNaN(t[1])}function a(t,e,i,a,o,r,l,m,v,y,x){for(var _=0,b=i,w=0;w<a;w++){var S=e[b];if(b>=o||b<0)break;if(n(S)){if(x){b+=r;continue}break}if(b===i)t[r>0?"moveTo":"lineTo"](S[0],S[1]),d(p,S);else if(v>0){var M=b+r,I=e[M];if(x)for(;I&&n(e[M]);)M+=r,I=e[M];var T=.5,A=e[_],I=e[M];if(!I||n(I))d(g,S);else{n(I)&&!x&&(I=S),s.sub(f,I,A);var C,L;if("x"===y||"y"===y){var D="x"===y?0:1;C=Math.abs(S[D]-A[D]),L=Math.abs(S[D]-I[D])}else C=s.dist(S,A),L=s.dist(S,I);T=L/(L+C),c(g,S,f,-v*(1-T))}u(p,p,m),h(p,p,l),u(g,g,m),h(g,g,l),t.bezierCurveTo(p[0],p[1],g[0],g[1],S[0],S[1]),c(p,S,f,v*T)}else t.lineTo(S[0],S[1]);_=b,b+=r}return w}function o(t,e){var i=[1/0,1/0],n=[-(1/0),-(1/0)];if(e)for(var a=0;a<t.length;a++){var o=t[a];o[0]<i[0]&&(i[0]=o[0]),o[1]<i[1]&&(i[1]=o[1]),o[0]>n[0]&&(n[0]=o[0]),o[1]>n[1]&&(n[1]=o[1])}return{min:e?i:n,max:e?n:i}}var r=i(8),s=i(6),l=i(77),u=s.min,h=s.max,c=s.scaleAndAdd,d=s.copy,f=[],p=[],g=[];t.exports={Polyline:r.extend({type:"ec-polyline",shape:{points:[],smooth:0,smoothConstraint:!0,smoothMonotone:null,connectNulls:!1},style:{fill:null,stroke:"#000"},brush:l(r.prototype.brush),buildPath:function(t,e){var i=e.points,r=0,s=i.length,l=o(i,e.smoothConstraint);if(e.connectNulls){for(;s>0&&n(i[s-1]);s--);for(;r<s&&n(i[r]);r++);}for(;r<s;)r+=a(t,i,r,s,s,1,l.min,l.max,e.smooth,e.smoothMonotone,e.connectNulls)+1}}),Polygon:r.extend({type:"ec-polygon",shape:{points:[],stackedOnPoints:[],smooth:0,stackedOnSmooth:0,smoothConstraint:!0,smoothMonotone:null,connectNulls:!1},brush:l(r.prototype.brush),buildPath:function(t,e){var i=e.points,r=e.stackedOnPoints,s=0,l=i.length,u=e.smoothMonotone,h=o(i,e.smoothConstraint),c=o(r,e.smoothConstraint);if(e.connectNulls){for(;l>0&&n(i[l-1]);l--);for(;s<l&&n(i[s]);s++);}for(;s<l;){var d=a(t,i,s,l,l,1,h.min,h.max,e.smooth,u,e.connectNulls);a(t,r,s+d-1,d,l,-1,c.min,c.max,e.stackedOnSmooth,u,e.connectNulls),s+=d+1,t.closePath()}}})}},function(t,e,i){var n=i(1),a={retrieveTargetInfo:function(t,e){if(t&&("treemapZoomToNode"===t.type||"treemapRootToNode"===t.type)){var i=e.getData().tree.root,n=t.targetNode;if(n&&i.contains(n))return{node:n};var a=t.targetNodeId;if(null!=a&&(n=i.getNodeById(a)))return{node:n}}},getPathToRoot:function(t){for(var e=[];t;)t=t.parentNode,t&&e.push(t);return e.reverse()},aboveViewRoot:function(t,e){var i=a.getPathToRoot(t);return n.indexOf(i,e)>=0},wrapTreePathInfo:function(t,e){for(var i=[];t;){var n=t.dataIndex;i.push({name:t.name,dataIndex:n,value:e.getRawValue(n)}),t=t.parentNode}return i.reverse(),i}};t.exports=a},function(t,e,i){function n(t){this.pointerChecker,this._zr=t,this._opt={};var e=d.bind,i=e(a,this),n=e(o,this),u=e(r,this),h=e(s,this),f=e(l,this);c.call(this),this.setPointerChecker=function(t){this.pointerChecker=t},this.enable=function(e,a){this.disable(),this._opt=d.defaults(d.clone(a)||{},{zoomOnMouseWheel:!0,moveOnMouseMove:!0,preventDefaultMouseMove:!0}),null==e&&(e=!0),e!==!0&&"move"!==e&&"pan"!==e||(t.on("mousedown",i),t.on("mousemove",n),t.on("mouseup",u)),e!==!0&&"scale"!==e&&"zoom"!==e||(t.on("mousewheel",h),t.on("pinch",f))},this.disable=function(){t.off("mousedown",i),t.off("mousemove",n),t.off("mouseup",u),t.off("mousewheel",h),t.off("pinch",f)},this.dispose=this.disable,this.isDragging=function(){return this._dragging},this.isPinching=function(){return this._pinching}}function a(t){if(!(f.notLeftMouse(t)||t.target&&t.target.draggable)){var e=t.offsetX,i=t.offsetY;this.pointerChecker&&this.pointerChecker(t,e,i)&&(this._x=e,this._y=i,this._dragging=!0)}}function o(t){if(!f.notLeftMouse(t)&&h(this,"moveOnMouseMove",t)&&this._dragging&&"pinch"!==t.gestureEvent&&!p.isTaken(this._zr,"globalPan")){var e=t.offsetX,i=t.offsetY,n=this._x,a=this._y,o=e-n,r=i-a;this._x=e,this._y=i,this._opt.preventDefaultMouseMove&&f.stop(t.event),this.trigger("pan",o,r,n,a,e,i)}}function r(t){f.notLeftMouse(t)||(this._dragging=!1)}function s(t){if(h(this,"zoomOnMouseWheel",t)&&0!==t.wheelDelta){var e=t.wheelDelta>0?1.1:1/1.1;u.call(this,t,e,t.offsetX,t.offsetY)}}function l(t){if(!p.isTaken(this._zr,"globalPan")){var e=t.pinchScale>1?1.1:1/1.1;u.call(this,t,e,t.pinchX,t.pinchY)}}function u(t,e,i,n){this.pointerChecker&&this.pointerChecker(t,i,n)&&(f.stop(t.event),this.trigger("zoom",e,i,n))}function h(t,e,i){var n=t._opt[e];return n&&(!d.isString(n)||i.event[n+"Key"])}var c=i(23),d=i(1),f=i(21),p=i(134);d.mixin(n,c),t.exports=n},function(t,e,i){var n=i(1),a={show:!0,zlevel:0,z:0,inverse:!1,name:"",nameLocation:"end",nameRotate:null,nameTruncate:{maxWidth:null,ellipsis:"...",placeholder:"."},nameTextStyle:{},nameGap:15,silent:!1,triggerEvent:!1,tooltip:{show:!1},axisPointer:{},axisLine:{show:!0,onZero:!0,onZeroAxisIndex:null,lineStyle:{color:"#333",width:1,type:"solid"}},axisTick:{show:!0,inside:!1,length:5,lineStyle:{width:1}},axisLabel:{show:!0,inside:!1,rotate:0,showMinLabel:null,showMaxLabel:null,margin:8,fontSize:12},splitLine:{show:!0,lineStyle:{color:["#ccc"],width:1,type:"solid"}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}}},o=n.merge({boundaryGap:!0,splitLine:{show:!1},axisTick:{alignWithLabel:!1,interval:"auto"},axisLabel:{interval:"auto"}},a),r=n.merge({boundaryGap:[0,0],splitNumber:5},a),s=n.defaults({scale:!0,min:"dataMin",max:"dataMax"},r),l=n.defaults({scale:!0,logBase:10},r);t.exports={categoryAxis:o,valueAxis:r,timeAxis:s,logAxis:l}},function(t,e){t.exports={containStroke:function(t,e,i,n,a,o,r){if(0===a)return!1;var s=a,l=0,u=t;if(r>e+s&&r>n+s||r<e-s&&r<n-s||o>t+s&&o>i+s||o<t-s&&o<i-s)return!1;if(t===i)return Math.abs(o-t)<=s/2;l=(e-n)/(t-i),u=(t*n-i*e)/(t-i);var h=l*o-r+u,c=h*h/(l*l+1);return c<=s/2*s/2}}},function(t,e,i){var n=i(20);t.exports={containStroke:function(t,e,i,a,o,r,s,l,u){if(0===s)return!1;var h=s;if(u>e+h&&u>a+h&&u>r+h||u<e-h&&u<a-h&&u<r-h||l>t+h&&l>i+h&&l>o+h||l<t-h&&l<i-h&&l<o-h)return!1;var c=n.quadraticProjectPoint(t,e,i,a,o,r,l,u,null);return c<=h/2}}},function(t,e){t.exports=function(t,e,i,n,a,o){if(o>e&&o>n||o<e&&o<n)return 0;if(n===e)return 0;var r=n<e?1:-1,s=(o-e)/(n-e);1!==s&&0!==s||(r=n<e?.5:-.5);var l=s*(i-t)+t;return l>a?r:0}},function(t,e,i){"use strict";var n=i(1),a=i(39),o=function(t,e,i,n,o,r){this.x=null==t?0:t,this.y=null==e?0:e,this.x2=null==i?1:i,this.y2=null==n?0:n,this.type="linear",this.global=r||!1,a.call(this,o)};o.prototype={constructor:o},n.inherits(o,a),t.exports=o},function(t,e,i){"use strict";function n(t){a.each(o,function(e){this[e]=a.bind(t[e],t)},this)}var a=i(1),o=["getDom","getZr","getWidth","getHeight","getDevicePixelRatio","dispatchAction","isDisposed","on","off","getDataURL","getConnectedDataURL","getModel","getOption","getViewOfComponentModel","getViewOfSeriesModel"];t.exports=n},function(t,e,i){var n=i(1);i(60),i(108),i(109);var a=i(87),o=i(2);o.registerLayout(n.curry(a,"bar")),o.registerVisual(function(t){t.eachSeriesByType("bar",function(t){var e=t.getData();e.setVisual("legendSymbol","roundRect")})}),i(32)},function(t,e,i){t.exports=i(95).extend({type:"series.bar",dependencies:["grid","polar"],brushSelector:"rect"})},function(t,e,i){"use strict";function n(t,e,i){i.style.text=null,l.updateProps(i,{shape:{width:0}},e,t,function(){i.parent&&i.parent.remove(i)})}function a(t,e,i){i.style.text=null,l.updateProps(i,{shape:{r:i.shape.r0}},e,t,function(){i.parent&&i.parent.remove(i)})}function o(t,e,i,n,a,o,r,h){var c=e.getItemVisual(i,"color"),d=e.getItemVisual(i,"opacity"),f=n.getModel("itemStyle.normal"),p=n.getModel("itemStyle.emphasis").getBarItemStyle();h||t.setShape("r",f.get("barBorderRadius")||0),t.useStyle(s.defaults({fill:c,opacity:d},f.getBarItemStyle()));var g=n.getShallow("cursor");g&&t.attr("cursor",g);var m=r?a.height>0?"bottom":"top":a.width>0?"left":"right";h||u.setLabel(t.style,p,n,c,o,i,m),l.setHoverStyle(t,p)}function r(t,e){var i=t.get(h)||0;return Math.min(i,Math.abs(e.width),Math.abs(e.height))}var s=i(1),l=i(3),u=i(96),h=["itemStyle","normal","barBorderWidth"];s.extend(i(11).prototype,i(110));var c=i(2).extendChartView({type:"bar",render:function(t,e,i){var n=t.get("coordinateSystem");return"cartesian2d"!==n&&"polar"!==n||this._render(t,e,i),this.group},dispose:s.noop,_render:function(t,e,i){var r,s=this.group,u=t.getData(),h=this._data,c=t.coordinateSystem,p=c.getBaseAxis();"cartesian2d"===c.type?r=p.isHorizontal():"polar"===c.type&&(r="angle"===p.dim);var g=t.isAnimationEnabled()?t:null;u.diff(h).add(function(e){if(u.hasValue(e)){var i=u.getItemModel(e),n=f[c.type](u,e,i),a=d[c.type](u,e,i,n,r,g);u.setItemGraphicEl(e,a),s.add(a),o(a,u,e,i,n,t,r,"polar"===c.type)}}).update(function(e,i){var n=h.getItemGraphicEl(i);if(!u.hasValue(e))return void s.remove(n);var a=u.getItemModel(e),p=f[c.type](u,e,a);n?l.updateProps(n,{shape:p},g,e):n=d[c.type](u,e,a,p,r,g,!0),u.setItemGraphicEl(e,n),s.add(n),o(n,u,e,a,p,t,r,"polar"===c.type)}).remove(function(t){var e=h.getItemGraphicEl(t);"cartesian2d"===c.type?e&&n(t,g,e):e&&a(t,g,e)}).execute(),this._data=u},remove:function(t,e){var i=this.group,o=this._data;t.get("animation")?o&&o.eachItemGraphicEl(function(e){"sector"===e.type?a(e.dataIndex,t,e):n(e.dataIndex,t,e)}):i.removeAll()}}),d={cartesian2d:function(t,e,i,n,a,o,r){var u=new l.Rect({shape:s.extend({},n)});if(o){var h=u.shape,c=a?"height":"width",d={};h[c]=0,d[c]=n[c],l[r?"updateProps":"initProps"](u,{shape:d},o,e)}return u},polar:function(t,e,i,n,a,o,r){var u=new l.Sector({shape:s.extend({},n)});if(o){var h=u.shape,c=a?"r":"endAngle",d={};h[c]=a?0:n.startAngle,d[c]=n[c],l[r?"updateProps":"initProps"](u,{shape:d},o,e)}return u}},f={cartesian2d:function(t,e,i){var n=t.getItemLayout(e),a=r(i,n),o=n.width>0?1:-1,s=n.height>0?1:-1;return{x:n.x+o*a/2,y:n.y+s*a/2,width:n.width-o*a,height:n.height-s*a}},polar:function(t,e,i){var n=t.getItemLayout(e);return{cx:n.cx,cy:n.cy,r0:n.r0,r:n.r,startAngle:n.startAngle,endAngle:n.endAngle}}};t.exports=c},function(t,e,i){var n=i(31)([["fill","color"],["stroke","borderColor"],["lineWidth","borderWidth"],["stroke","barBorderColor"],["lineWidth","barBorderWidth"],["opacity"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"]]);t.exports={getBarItemStyle:function(t){var e=n.call(this,t);if(this.getBorderLineDash){var i=this.getBorderLineDash();i&&(e.lineDash=i)}return e}}},function(t,e,i){function n(t){return"_"+t+"Type"}function a(t,e,i){var n=e.getItemVisual(i,"color"),a=e.getItemVisual(i,t),o=e.getItemVisual(i,t+"Size");if(a&&"none"!==a){f.isArray(o)||(o=[o,o]);var r=u.createSymbol(a,-o[0]/2,-o[1]/2,o[0],o[1],n);return r.name=t,r}}function o(t){var e=new c({name:"line"});return r(e.shape,t),e}function r(t,e){var i=e[0],n=e[1],a=e[2];t.x1=i[0],t.y1=i[1],t.x2=n[0],t.y2=n[1],t.percent=1,a?(t.cpx1=a[0],t.cpy1=a[1]):(t.cpx1=NaN,t.cpy1=NaN)}function s(){var t=this,e=t.childOfName("fromSymbol"),i=t.childOfName("toSymbol"),n=t.childOfName("label");if(e||i||!n.ignore){for(var a=1,o=this.parent;o;)o.scale&&(a/=o.scale[0]),o=o.parent;var r=t.childOfName("line");if(this.__dirty||r.__dirty){var s=r.shape.percent,l=r.pointAt(0),u=r.pointAt(s),c=h.sub([],u,l);if(h.normalize(c,c),e){e.attr("position",l);var d=r.tangentAt(0);e.attr("rotation",Math.PI/2-Math.atan2(d[1],d[0])),e.attr("scale",[a*s,a*s])}if(i){i.attr("position",u);var d=r.tangentAt(1);i.attr("rotation",-Math.PI/2-Math.atan2(d[1],d[0])),i.attr("scale",[a*s,a*s])}if(!n.ignore){n.attr("position",u);var f,p,g,m=5*a;if("end"===n.__position)f=[c[0]*m+u[0],c[1]*m+u[1]],p=c[0]>.8?"left":c[0]<-.8?"right":"center",g=c[1]>.8?"top":c[1]<-.8?"bottom":"middle";else if("middle"===n.__position){var v=s/2,d=r.tangentAt(v),y=[d[1],-d[0]],x=r.pointAt(v);y[1]>0&&(y[0]=-y[0],y[1]=-y[1]),f=[x[0]+y[0]*m,x[1]+y[1]*m],p="center",g="bottom";var _=-Math.atan2(d[1],d[0]);u[0]<l[0]&&(_=Math.PI+_),n.attr("rotation",_)}else f=[-c[0]*m+l[0],-c[1]*m+l[1]],p=c[0]>.8?"right":c[0]<-.8?"left":"center",g=c[1]>.8?"bottom":c[1]<-.8?"top":"middle";n.attr({style:{textVerticalAlign:n.__verticalAlign||g,textAlign:n.__textAlign||p},position:f,scale:[a,a]})}}}}function l(t,e,i){d.Group.call(this),this._createLine(t,e,i)}var u=i(24),h=i(6),c=i(196),d=i(3),f=i(1),p=i(4),g=["fromSymbol","toSymbol"],m=l.prototype;m.beforeUpdate=s,m._createLine=function(t,e,i){var r=t.hostModel,s=t.getItemLayout(e),l=o(s);l.shape.percent=0,d.initProps(l,{shape:{percent:1}},r,e),this.add(l);var u=new d.Text({name:"label"});this.add(u),f.each(g,function(i){var o=a(i,t,e);this.add(o),this[n(i)]=t.getItemVisual(e,i)},this),this._updateCommonStl(t,e,i)},m.updateData=function(t,e,i){var o=t.hostModel,s=this.childOfName("line"),l=t.getItemLayout(e),u={shape:{}};r(u.shape,l),d.updateProps(s,u,o,e),f.each(g,function(i){var o=t.getItemVisual(e,i),r=n(i);if(this[r]!==o){this.remove(this.childOfName(i));var s=a(i,t,e);this.add(s)}this[r]=o},this),this._updateCommonStl(t,e,i)},m._updateCommonStl=function(t,e,i){var n=t.hostModel,a=this.childOfName("line"),o=i&&i.lineStyle,r=i&&i.hoverLineStyle,s=i&&i.labelModel,l=i&&i.hoverLabelModel;if(!i||t.hasItemOption){var u=t.getItemModel(e);o=u.getModel("lineStyle.normal").getLineStyle(),r=u.getModel("lineStyle.emphasis").getLineStyle(),s=u.getModel("label.normal"),l=u.getModel("label.emphasis")}var h=t.getItemVisual(e,"color"),c=f.retrieve3(t.getItemVisual(e,"opacity"),o.opacity,1);a.useStyle(f.defaults({strokeNoScale:!0,fill:"none",stroke:h,opacity:c},o)),a.hoverStyle=r,f.each(g,function(t){var e=this.childOfName(t);e&&(e.setColor(h),e.setStyle({opacity:c}))},this);var m,v,y,x,_=s.getShallow("show"),b=l.getShallow("show"),w=this.childOfName("label");if(_||b){var S=n.getRawValue(e);v=null==S?v=t.getName(e):isFinite(S)?p.round(S):S,m=h||"#000",y=f.retrieve2(n.getFormattedLabel(e,"normal",t.dataType),v),x=f.retrieve2(n.getFormattedLabel(e,"emphasis",t.dataType),y)}if(_){var M=d.setTextStyle(w.style,s,{text:y},{autoColor:m});w.__textAlign=M.textAlign,w.__verticalAlign=M.textVerticalAlign,w.__position=s.get("position")||"middle"}else w.setStyle("text",null);b?w.hoverStyle={text:x,textFill:l.getTextColor(!0),fontStyle:l.getShallow("fontStyle"),fontWeight:l.getShallow("fontWeight"),fontSize:l.getShallow("fontSize"),fontFamily:l.getShallow("fontFamily")}:w.hoverStyle={text:null},w.ignore=!_&&!b,d.setHoverStyle(this)},m.highlight=function(){this.trigger("emphasis")},m.downplay=function(){this.trigger("normal")},m.updateLayout=function(t,e){this.setLinePoints(t.getItemLayout(e))},m.setLinePoints=function(t){var e=this.childOfName("line");r(e.shape,t),e.dirty()},f.inherits(l,d.Group),t.exports=l},function(t,e,i){function n(t){return isNaN(t[0])||isNaN(t[1])}function a(t){return!n(t[0])&&!n(t[1])}function o(t){this._ctor=t||s,this.group=new r.Group}var r=i(3),s=i(111),l=o.prototype;l.updateData=function(t){var e=this._lineData,i=this.group,n=this._ctor,o=t.hostModel,r={lineStyle:o.getModel("lineStyle.normal").getLineStyle(),hoverLineStyle:o.getModel("lineStyle.emphasis").getLineStyle(),labelModel:o.getModel("label.normal"),hoverLabelModel:o.getModel("label.emphasis")};t.diff(e).add(function(e){if(a(t.getItemLayout(e))){var o=new n(t,e,r);t.setItemGraphicEl(e,o),i.add(o)}}).update(function(o,s){var l=e.getItemGraphicEl(s);return a(t.getItemLayout(o))?(l?l.updateData(t,o,r):l=new n(t,o,r),t.setItemGraphicEl(o,l),void i.add(l)):void i.remove(l)}).remove(function(t){i.remove(e.getItemGraphicEl(t))}).execute(),this._lineData=t},l.updateLayout=function(){var t=this._lineData;t.eachItemGraphicEl(function(e,i){e.updateLayout(t,i)},this)},l.remove=function(){this.group.removeAll()},t.exports=o},function(t,e,i){var n=i(1),a=i(2),o=a.PRIORITY;i(114),i(115),a.registerVisual(n.curry(i(51),"line","circle","line")),a.registerLayout(n.curry(i(64),"line")),a.registerProcessor(o.PROCESSOR.STATISTIC,n.curry(i(154),"line")),i(32)},function(t,e,i){"use strict";var n=i(28),a=i(17);t.exports=a.extend({type:"series.line",dependencies:["grid","polar"],getInitialData:function(t,e){return n(t.data,this,e)},defaultOption:{zlevel:0,z:2,coordinateSystem:"cartesian2d",legendHoverLink:!0,hoverAnimation:!0,clipOverflow:!0,label:{normal:{position:"top"}},lineStyle:{normal:{width:2,type:"solid"}},step:!1,smooth:!1,smoothMonotone:null,symbol:"emptyCircle",symbolSize:4,symbolRotate:null,showSymbol:!0,showAllSymbol:!1,connectNulls:!1,sampling:"none",animationEasing:"linear",progressive:0,hoverLayerThreshold:1/0}})},function(t,e,i){"use strict";function n(t,e){if(t.length===e.length){for(var i=0;i<t.length;i++){var n=t[i],a=e[i];if(n[0]!==a[0]||n[1]!==a[1])return}return!0}}function a(t){return"number"==typeof t?t:t?.3:0}function o(t){var e=t.getGlobalExtent();if(t.onBand){var i=t.getBandWidth()/2-1,n=e[1]>e[0]?1:-1;e[0]+=n*i,e[1]-=n*i}return e}function r(t){return t>=0?1:-1}function s(t,e){var i=t.getBaseAxis(),n=t.getOtherAxis(i),a=0;if(!i.onZero){var o=n.scale.getExtent();o[0]>0?a=o[0]:o[1]<0&&(a=o[1])}var s=n.dim,l="x"===s||"radius"===s?1:0;return e.mapArray([s],function(n,o){for(var u,h=e.stackedOn;h&&r(h.get(s,o))===r(n);){u=h;break}var c=[];return c[l]=e.get(i.dim,o),c[1-l]=u?u.get(s,o,!0):a,t.dataToPoint(c)},!0)}function l(t,e,i){var n=o(t.getAxis("x")),a=o(t.getAxis("y")),r=t.getBaseAxis().isHorizontal(),s=Math.min(n[0],n[1]),l=Math.min(a[0],a[1]),u=Math.max(n[0],n[1])-s,h=Math.max(a[0],a[1])-l,c=i.get("lineStyle.normal.width")||2,d=i.get("clipOverflow")?c/2:Math.max(u,h);r?(l-=d,h+=2*d):(s-=d,u+=2*d);var f=new v.Rect({shape:{x:s,y:l,width:u,height:h}});return e&&(f.shape[r?"width":"height"]=0,v.initProps(f,{shape:{width:u,height:h}},i)),f}function u(t,e,i){var n=t.getAngleAxis(),a=t.getRadiusAxis(),o=a.getExtent(),r=n.getExtent(),s=Math.PI/180,l=new v.Sector({shape:{cx:t.cx,cy:t.cy,r0:o[0],r:o[1],startAngle:-r[0]*s,endAngle:-r[1]*s,clockwise:n.inverse}});return e&&(l.shape.endAngle=-r[0]*s,v.initProps(l,{shape:{endAngle:-r[1]*s}},i)),l}function h(t,e,i){return"polar"===t.type?u(t,e,i):l(t,e,i)}function c(t,e,i){for(var n=e.getBaseAxis(),a="x"===n.dim||"radius"===n.dim?0:1,o=[],r=0;r<t.length-1;r++){var s=t[r+1],l=t[r];o.push(l);var u=[];switch(i){case"end":u[a]=s[a],u[1-a]=l[1-a],o.push(u);break;case"middle":var h=(l[a]+s[a])/2,c=[];u[a]=c[a]=h,u[1-a]=l[1-a],c[1-a]=s[1-a],o.push(u),o.push(c);break;default:u[a]=l[a],u[1-a]=s[1-a],o.push(u)}}return t[r]&&o.push(t[r]),o}function d(t,e){var i=t.getVisual("visualMeta");if(i&&i.length&&t.count()){for(var n,a=i.length-1;a>=0;a--)if(i[a].dimension<2){n=i[a];break}if(n&&"cartesian2d"===e.type){var o=n.dimension,r=t.dimensions[o],s=e.getAxis(r),l=f.map(n.stops,function(t){return{coord:s.toGlobalCoord(s.dataToCoord(t.value)),color:t.color}}),u=l.length,h=n.outerColors.slice();u&&l[0].coord>l[u-1].coord&&(l.reverse(),h.reverse());var c=10,d=l[0].coord-c,p=l[u-1].coord+c,g=p-d;if(g<.001)return"transparent";f.each(l,function(t){t.offset=(t.coord-d)/g}),l.push({offset:u?l[u-1].offset:.5,color:h[1]||"transparent"}),l.unshift({offset:u?l[0].offset:.5,color:h[0]||"transparent"});var m=new v.LinearGradient(0,0,0,0,l,!0);return m[r]=d,m[r+"2"]=p,m}}}var f=i(1),p=i(46),g=i(57),m=i(116),v=i(3),y=i(5),x=i(98),_=i(30);t.exports=_.extend({type:"line",init:function(){var t=new v.Group,e=new p;this.group.add(e.group),this._symbolDraw=e,this._lineGroup=t},render:function(t,e,i){var o=t.coordinateSystem,r=this.group,l=t.getData(),u=t.getModel("lineStyle.normal"),p=t.getModel("areaStyle.normal"),g=l.mapArray(l.getItemLayout,!0),m="polar"===o.type,v=this._coordSys,y=this._symbolDraw,x=this._polyline,_=this._polygon,b=this._lineGroup,w=t.get("animation"),S=!p.isEmpty(),M=s(o,l),I=t.get("showSymbol"),T=I&&!m&&!t.get("showAllSymbol")&&this._getSymbolIgnoreFunc(l,o),A=this._data;A&&A.eachItemGraphicEl(function(t,e){t.__temp&&(r.remove(t),A.setItemGraphicEl(e,null))}),I||y.remove(),r.add(b);var C=!m&&t.get("step");x&&v.type===o.type&&C===this._step?(S&&!_?_=this._newPolygon(g,M,o,w):_&&!S&&(b.remove(_),_=this._polygon=null),b.setClipPath(h(o,!1,t)),I&&y.updateData(l,T),l.eachItemGraphicEl(function(t){t.stopAnimation(!0)}),n(this._stackedOnPoints,M)&&n(this._points,g)||(w?this._updateAnimation(l,M,o,i,C):(C&&(g=c(g,o,C),M=c(M,o,C)),x.setShape({points:g}),_&&_.setShape({points:g,stackedOnPoints:M})))):(I&&y.updateData(l,T),C&&(g=c(g,o,C),M=c(M,o,C)),x=this._newPolyline(g,o,w),S&&(_=this._newPolygon(g,M,o,w)),b.setClipPath(h(o,!0,t)));var L=d(l,o)||l.getVisual("color");x.useStyle(f.defaults(u.getLineStyle(),{fill:"none",stroke:L,lineJoin:"bevel"}));var D=t.get("smooth");if(D=a(t.get("smooth")),x.setShape({smooth:D,smoothMonotone:t.get("smoothMonotone"),connectNulls:t.get("connectNulls")}),_){var P=l.stackedOn,k=0;if(_.useStyle(f.defaults(p.getAreaStyle(),{fill:L,opacity:.7,lineJoin:"bevel"})),P){var O=P.hostModel;k=a(O.get("smooth"))}_.setShape({smooth:D,stackedOnSmooth:k,smoothMonotone:t.get("smoothMonotone"),connectNulls:t.get("connectNulls")})}this._data=l,this._coordSys=o,this._stackedOnPoints=M,this._points=g,this._step=C},dispose:function(){},highlight:function(t,e,i,n){var a=t.getData(),o=y.queryDataIndex(a,n);if(!(o instanceof Array)&&null!=o&&o>=0){var r=a.getItemGraphicEl(o);if(!r){var s=a.getItemLayout(o);if(!s)return;r=new g(a,o),r.position=s,r.setZ(t.get("zlevel"),t.get("z")),r.ignore=isNaN(s[0])||isNaN(s[1]),r.__temp=!0,a.setItemGraphicEl(o,r),r.stopSymbolAnimation(!0),this.group.add(r)}r.highlight()}else _.prototype.highlight.call(this,t,e,i,n)},downplay:function(t,e,i,n){var a=t.getData(),o=y.queryDataIndex(a,n);if(null!=o&&o>=0){var r=a.getItemGraphicEl(o);r&&(r.__temp?(a.setItemGraphicEl(o,null),this.group.remove(r)):r.downplay())}else _.prototype.downplay.call(this,t,e,i,n)},_newPolyline:function(t){var e=this._polyline;return e&&this._lineGroup.remove(e),e=new x.Polyline({shape:{points:t},silent:!0,z2:10}),this._lineGroup.add(e),this._polyline=e,e},_newPolygon:function(t,e){var i=this._polygon;return i&&this._lineGroup.remove(i),i=new x.Polygon({shape:{points:t,stackedOnPoints:e},silent:!0}),this._lineGroup.add(i),this._polygon=i,i},_getSymbolIgnoreFunc:function(t,e){var i=e.getAxesByScale("ordinal")[0];if(i&&i.isLabelIgnored)return f.bind(i.isLabelIgnored,i)},_updateAnimation:function(t,e,i,n,a){var o=this._polyline,r=this._polygon,s=t.hostModel,l=m(this._data,t,this._stackedOnPoints,e,this._coordSys,i),u=l.current,h=l.stackedOnCurrent,d=l.next,f=l.stackedOnNext;a&&(u=c(l.current,i,a),h=c(l.stackedOnCurrent,i,a),d=c(l.next,i,a),f=c(l.stackedOnNext,i,a)),o.shape.__points=l.current,o.shape.points=u,v.updateProps(o,{shape:{points:d}},s),r&&(r.setShape({points:u,stackedOnPoints:h}),v.updateProps(r,{shape:{points:d,stackedOnPoints:f}},s));for(var p=[],g=l.status,y=0;y<g.length;y++){var x=g[y].cmd;if("="===x){var _=t.getItemGraphicEl(g[y].idx1);_&&p.push({el:_,ptIdx:y})}}o.animators&&o.animators.length&&o.animators[0].during(function(){for(var t=0;t<p.length;t++){var e=p[t].el;e.attr("position",o.shape.__points[p[t].ptIdx])}})},remove:function(t){var e=this.group,i=this._data;this._lineGroup.removeAll(),this._symbolDraw.remove(!0),i&&i.eachItemGraphicEl(function(t,n){t.__temp&&(e.remove(t),i.setItemGraphicEl(n,null))}),this._polyline=this._polygon=this._coordSys=this._points=this._stackedOnPoints=this._data=null}})},function(t,e){function i(t){return t>=0?1:-1}function n(t,e,n){for(var a,o=t.getBaseAxis(),r=t.getOtherAxis(o),s=o.onZero?0:r.scale.getExtent()[0],l=r.dim,u="x"===l||"radius"===l?1:0,h=e.stackedOn,c=e.get(l,n);h&&i(h.get(l,n))===i(c);){a=h;break}var d=[];return d[u]=e.get(o.dim,n),d[1-u]=a?a.get(l,n,!0):s,t.dataToPoint(d)}function a(t,e){var i=[];return e.diff(t).add(function(t){i.push({cmd:"+",idx:t})}).update(function(t,e){i.push({cmd:"=",idx:e,idx1:t})}).remove(function(t){i.push({cmd:"-",idx:t})}).execute(),i}t.exports=function(t,e,i,o,r,s){for(var l=a(t,e),u=[],h=[],c=[],d=[],f=[],p=[],g=[],m=s.dimensions,v=0;v<l.length;v++){var y=l[v],x=!0;switch(y.cmd){case"=":var _=t.getItemLayout(y.idx),b=e.getItemLayout(y.idx1);(isNaN(_[0])||isNaN(_[1]))&&(_=b.slice()),u.push(_),h.push(b),c.push(i[y.idx]),d.push(o[y.idx1]),g.push(e.getRawIndex(y.idx1));break;case"+":var w=y.idx;u.push(r.dataToPoint([e.get(m[0],w,!0),e.get(m[1],w,!0)])),h.push(e.getItemLayout(w).slice()),c.push(n(r,e,w)),d.push(o[w]),g.push(e.getRawIndex(w));break;case"-":var w=y.idx,S=t.getRawIndex(w);S!==w?(u.push(t.getItemLayout(w)),h.push(s.dataToPoint([t.get(m[0],w,!0),t.get(m[1],w,!0)])),c.push(i[w]),d.push(n(s,t,w)),g.push(S)):x=!1}x&&(f.push(y),p.push(p.length))}p.sort(function(t,e){return g[t]-g[e]});for(var M=[],I=[],T=[],A=[],C=[],v=0;v<p.length;v++){var w=p[v];M[v]=u[w],I[v]=h[w],T[v]=c[w],A[v]=d[w],C[v]=f[w]}return{current:M,next:I,stackedOnCurrent:T,stackedOnNext:A,status:C}}},function(t,e,i){var n=i(1),a=i(2);i(118),i(119),i(94)("pie",[{type:"pieToggleSelect",event:"pieselectchanged",method:"toggleSelected"},{type:"pieSelect",event:"pieselected",method:"select"},{type:"pieUnSelect",event:"pieunselected",method:"unSelect"}]),a.registerVisual(n.curry(i(89),"pie")),a.registerLayout(n.curry(i(121),"pie")),a.registerProcessor(n.curry(i(66),"pie"))},function(t,e,i){"use strict";var n=i(14),a=i(1),o=i(5),r=i(4),s=i(25),l=i(83),u=i(2).extendSeriesModel({type:"series.pie",init:function(t){u.superApply(this,"init",arguments),this.legendDataProvider=function(){return this.getRawData()},this.updateSelectedMap(t.data),this._defaultLabelLine(t)},mergeOption:function(t){u.superCall(this,"mergeOption",t),this.updateSelectedMap(this.option.data)},getInitialData:function(t,e){var i=s(["value"],t.data),a=new n(i,this);return a.initData(t.data),a},getDataParams:function(t){var e=this.getData(),i=u.superCall(this,"getDataParams",t),n=[];return e.each("value",function(t){n.push(t)}),i.percent=r.getPercentWithPrecision(n,t,e.hostModel.get("percentPrecision")),i.$vars.push("percent"),i},_defaultLabelLine:function(t){o.defaultEmphasis(t.labelLine,["show"]);var e=t.labelLine.normal,i=t.labelLine.emphasis;e.show=e.show&&t.label.normal.show,i.show=i.show&&t.label.emphasis.show},defaultOption:{zlevel:0,z:2,legendHoverLink:!0,hoverAnimation:!0,center:["50%","50%"],radius:[0,"75%"],clockwise:!0,startAngle:90,minAngle:0,selectedOffset:10,hoverOffset:10,avoidLabelOverlap:!0,percentPrecision:2,stillShowZeroSum:!0,label:{normal:{rotate:!1,show:!0,position:"outer"},emphasis:{}},labelLine:{normal:{show:!0,length:15,length2:15,smooth:!1,lineStyle:{width:1,type:"solid"}}},itemStyle:{normal:{borderWidth:1},emphasis:{}},animationType:"expansion",animationEasing:"cubicOut",data:[]}});a.mixin(u,l),t.exports=u},function(t,e,i){function n(t,e,i,n){var o=e.getData(),r=this.dataIndex,s=o.getName(r),l=e.get("selectedOffset");n.dispatchAction({type:"pieToggleSelect",from:t,name:s,seriesId:e.id}),o.each(function(t){a(o.getItemGraphicEl(t),o.getItemLayout(t),e.isSelected(o.getName(t)),l,i)})}function a(t,e,i,n,a){var o=(e.startAngle+e.endAngle)/2,r=Math.cos(o),s=Math.sin(o),l=i?n:0,u=[r*l,s*l];a?t.animate().when(200,{position:u}).start("bounceOut"):t.attr("position",u)}function o(t,e){function i(){o.ignore=o.hoverIgnore,s.ignore=s.hoverIgnore}function n(){o.ignore=o.normalIgnore,s.ignore=s.normalIgnore}r.Group.call(this);var a=new r.Sector({z2:2}),o=new r.Polyline,s=new r.Text;this.add(a),this.add(o),this.add(s),this.updateData(t,e,!0),this.on("emphasis",i).on("normal",n).on("mouseover",i).on("mouseout",n)}var r=i(3),s=i(1),l=o.prototype;l.updateData=function(t,e,i){function n(){l.stopAnimation(!0),l.animateTo({shape:{r:c.r+u.get("hoverOffset")}},300,"elasticOut")}function o(){l.stopAnimation(!0),l.animateTo({shape:{r:c.r}},300,"elasticOut")}var l=this.childAt(0),u=t.hostModel,h=t.getItemModel(e),c=t.getItemLayout(e),d=s.extend({},c);if(d.label=null,i){l.setShape(d);var f=u.getShallow("animationType");"scale"===f?(l.shape.r=c.r0,r.initProps(l,{shape:{r:c.r}},u,e)):(l.shape.endAngle=c.startAngle,r.updateProps(l,{shape:{endAngle:c.endAngle}},u,e))}else r.updateProps(l,{
shape:d},u,e);var p=h.getModel("itemStyle"),g=t.getItemVisual(e,"color");l.useStyle(s.defaults({lineJoin:"bevel",fill:g},p.getModel("normal").getItemStyle())),l.hoverStyle=p.getModel("emphasis").getItemStyle();var m=h.getShallow("cursor");m&&l.attr("cursor",m),a(this,t.getItemLayout(e),h.get("selected"),u.get("selectedOffset"),u.get("animation")),l.off("mouseover").off("mouseout").off("emphasis").off("normal"),h.get("hoverAnimation")&&u.isAnimationEnabled()&&l.on("mouseover",n).on("mouseout",o).on("emphasis",n).on("normal",o),this._updateLabel(t,e),r.setHoverStyle(this)},l._updateLabel=function(t,e){var i=this.childAt(1),n=this.childAt(2),a=t.hostModel,o=t.getItemModel(e),s=t.getItemLayout(e),l=s.label,u=t.getItemVisual(e,"color");r.updateProps(i,{shape:{points:l.linePoints||[[l.x,l.y],[l.x,l.y],[l.x,l.y]]}},a,e),r.updateProps(n,{style:{x:l.x,y:l.y}},a,e),n.attr({rotation:l.rotation,origin:[l.x,l.y],z2:10});var h=o.getModel("label.normal"),c=o.getModel("label.emphasis"),d=o.getModel("labelLine.normal"),f=o.getModel("labelLine.emphasis"),u=t.getItemVisual(e,"color");r.setLabelStyle(n.style,n.hoverStyle={},h,c,{labelFetcher:t.hostModel,labelDataIndex:e,defaultText:t.getName(e),autoColor:u,useInsideStyle:!!l.inside},{textAlign:l.textAlign,textVerticalAlign:l.verticalAlign,opacity:t.getItemVisual(e,"opacity")}),n.ignore=n.normalIgnore=!h.get("show"),n.hoverIgnore=!c.get("show"),i.ignore=i.normalIgnore=!d.get("show"),i.hoverIgnore=!f.get("show"),i.setStyle({stroke:u,opacity:t.getItemVisual(e,"opacity")}),i.setStyle(d.getModel("lineStyle").getLineStyle()),i.hoverStyle=f.getModel("lineStyle").getLineStyle();var p=d.get("smooth");p&&p===!0&&(p=.4),i.setShape({smooth:p})},s.inherits(o,r.Group);var u=i(30).extend({type:"pie",init:function(){var t=new r.Group;this._sectorGroup=t},render:function(t,e,i,a){if(!a||a.from!==this.uid){var r=t.getData(),l=this._data,u=this.group,h=e.get("animation"),c=!l,d=t.get("animationType"),f=s.curry(n,this.uid,t,h,i),p=t.get("selectedMode");if(r.diff(l).add(function(t){var e=new o(r,t);c&&"scale"!==d&&e.eachChild(function(t){t.stopAnimation(!0)}),p&&e.on("click",f),r.setItemGraphicEl(t,e),u.add(e)}).update(function(t,e){var i=l.getItemGraphicEl(e);i.updateData(r,t),i.off("click"),p&&i.on("click",f),u.add(i),r.setItemGraphicEl(t,i)}).remove(function(t){var e=l.getItemGraphicEl(t);u.remove(e)}).execute(),h&&c&&r.count()>0&&"scale"!==d){var g=r.getItemLayout(0),m=Math.max(i.getWidth(),i.getHeight())/2,v=s.bind(u.removeClipPath,u);u.setClipPath(this._createClipPath(g.cx,g.cy,m,g.startAngle,g.clockwise,v,t))}this._data=r}},dispose:function(){},_createClipPath:function(t,e,i,n,a,o,s){var l=new r.Sector({shape:{cx:t,cy:e,r0:0,r:i,startAngle:n,endAngle:n,clockwise:a}});return r.initProps(l,{shape:{endAngle:n+(a?1:-1)*Math.PI*2}},s,o),l},containPoint:function(t,e){var i=e.getData(),n=i.getItemLayout(0);if(n){var a=t[0]-n.cx,o=t[1]-n.cy,r=Math.sqrt(a*a+o*o);return r<=n.r&&r>=n.r0}}});t.exports=u},function(t,e,i){"use strict";function n(t,e,i,n,a,o,r){function s(e,i,n,a){for(var o=e;o<i;o++)if(t[o].y+=n,o>e&&o+1<i&&t[o+1].y>t[o].y+t[o].height)return void l(o,n/2);l(i-1,n/2)}function l(e,i){for(var n=e;n>=0&&(t[n].y-=i,!(n>0&&t[n].y>t[n-1].y+t[n-1].height));n--);}function u(t,e,i,n,a,o){for(var r=o>0?e?Number.MAX_VALUE:0:e?Number.MAX_VALUE:0,s=0,l=t.length;s<l;s++)if("center"!==t[s].position){var u=Math.abs(t[s].y-n),h=t[s].len,c=t[s].len2,d=u<a+h?Math.sqrt((a+h+c)*(a+h+c)-u*u):Math.abs(t[s].x-i);e&&d>=r&&(d=r-10),!e&&d<=r&&(d=r+10),t[s].x=i+d*o,r=d}}t.sort(function(t,e){return t.y-e.y});for(var h,c=0,d=t.length,f=[],p=[],g=0;g<d;g++)h=t[g].y-c,h<0&&s(g,d,-h,a),c=t[g].y+t[g].height;r-c<0&&l(d-1,c-r);for(var g=0;g<d;g++)t[g].y>=i?p.push(t[g]):f.push(t[g]);u(f,!1,e,i,n,a),u(p,!0,e,i,n,a)}function a(t,e,i,a,o,r){for(var s=[],l=[],u=0;u<t.length;u++)t[u].x<e?s.push(t[u]):l.push(t[u]);n(l,e,i,a,1,o,r),n(s,e,i,a,-1,o,r);for(var u=0;u<t.length;u++){var h=t[u].linePoints;if(h){var c=h[1][0]-h[2][0];t[u].x<e?h[2][0]=t[u].x+3:h[2][0]=t[u].x-3,h[1][1]=h[2][1]=t[u].y,h[1][0]=h[2][0]+c}}}var o=i(16);t.exports=function(t,e,i,n){var r,s,l=t.getData(),u=[],h=!1;l.each(function(i){var n,a,c,d,f=l.getItemLayout(i),p=l.getItemModel(i),g=p.getModel("label.normal"),m=g.get("position")||p.get("label.emphasis.position"),v=p.getModel("labelLine.normal"),y=v.get("length"),x=v.get("length2"),_=(f.startAngle+f.endAngle)/2,b=Math.cos(_),w=Math.sin(_);r=f.cx,s=f.cy;var S="inside"===m||"inner"===m;if("center"===m)n=f.cx,a=f.cy,d="center";else{var M=(S?(f.r+f.r0)/2*b:f.r*b)+r,I=(S?(f.r+f.r0)/2*w:f.r*w)+s;if(n=M+3*b,a=I+3*w,!S){var T=M+b*(y+e-f.r),A=I+w*(y+e-f.r),C=T+(b<0?-1:1)*x,L=A;n=C+(b<0?-5:5),a=L,c=[[M,I],[T,A],[C,L]]}d=S?"center":b>0?"left":"right"}var D=g.getFont(),P=g.get("rotate")?b<0?-_+Math.PI:-_:0,k=t.getFormattedLabel(i,"normal")||l.getName(i),O=o.getBoundingRect(k,D,d,"top");h=!!P,f.label={x:n,y:a,position:m,height:O.height,len:y,len2:x,linePoints:c,textAlign:d,verticalAlign:"middle",rotation:P,inside:S},S||u.push(f.label)}),!h&&t.get("avoidLabelOverlap")&&a(u,r,s,e,i,n)}},function(t,e,i){var n=i(4),a=n.parsePercent,o=i(120),r=i(1),s=2*Math.PI,l=Math.PI/180;t.exports=function(t,e,i,u){e.eachSeriesByType(t,function(t){var e=t.get("center"),u=t.get("radius");r.isArray(u)||(u=[0,u]),r.isArray(e)||(e=[e,e]);var h=i.getWidth(),c=i.getHeight(),d=Math.min(h,c),f=a(e[0],h),p=a(e[1],c),g=a(u[0],d/2),m=a(u[1],d/2),v=t.getData(),y=-t.get("startAngle")*l,x=t.get("minAngle")*l,_=0;v.each("value",function(t){!isNaN(t)&&_++});var b=v.getSum("value"),w=Math.PI/(b||_)*2,S=t.get("clockwise"),M=t.get("roseType"),I=t.get("stillShowZeroSum"),T=v.getDataExtent("value");T[0]=0;var A=s,C=0,L=y,D=S?1:-1;if(v.each("value",function(t,e){var i;if(isNaN(t))return void v.setItemLayout(e,{angle:NaN,startAngle:NaN,endAngle:NaN,clockwise:S,cx:f,cy:p,r0:g,r:M?NaN:m});i="area"!==M?0===b&&I?w:t*w:s/_,i<x?(i=x,A-=x):C+=t;var a=L+D*i;v.setItemLayout(e,{angle:i,startAngle:L,endAngle:a,clockwise:S,cx:f,cy:p,r0:g,r:M?n.linearMap(t,T,[g,m]):m}),L=a},!0),A<s&&_)if(A<=.001){var P=s/_;v.each("value",function(t,e){if(!isNaN(t)){var i=v.getItemLayout(e);i.angle=P,i.startAngle=y+D*e*P,i.endAngle=y+D*(e+1)*P}})}else w=A/C,L=y,v.each("value",function(t,e){if(!isNaN(t)){var i=v.getItemLayout(e),n=i.angle===x?x:t*w;i.startAngle=L,i.endAngle=L+D*n,L+=D*n}});o(t,m,h,c)})}},function(t,e,i){"use strict";i(63),i(123)},function(t,e,i){var n=i(1),a=i(3),o=i(40),r=i(41),s=i(80),l=o.ifIgnoreOnTick,u=o.getInterval,h=["axisLine","axisTickLabel","axisName"],c=["splitArea","splitLine"],d=r.extend({type:"cartesianAxis",axisPointerClass:"CartesianAxisPointer",render:function(t,e,i,r){this.group.removeAll();var l=this._axisGroup;if(this._axisGroup=new a.Group,this.group.add(this._axisGroup),t.get("show")){var u=t.getCoordSysModel(),f=s.layout(u,t),p=new o(t,f);n.each(h,p.add,p),this._axisGroup.add(p.getGroup()),n.each(c,function(e){t.get(e+".show")&&this["_"+e](t,u,f.labelInterval)},this),a.groupTransition(l,this._axisGroup,t),d.superCall(this,"render",t,e,i,r)}},_splitLine:function(t,e,i){var o=t.axis;if(!o.scale.isBlank()){var r=t.getModel("splitLine"),s=r.getModel("lineStyle"),h=s.get("color"),c=u(r,i);h=n.isArray(h)?h:[h];for(var d=e.coordinateSystem.getRect(),f=o.isHorizontal(),p=0,g=o.getTicksCoords(),m=o.scale.getTicks(),v=t.get("axisLabel.showMinLabel"),y=t.get("axisLabel.showMaxLabel"),x=[],_=[],b=s.getLineStyle(),w=0;w<g.length;w++)if(!l(o,w,c,g.length,v,y)){var S=o.toGlobalCoord(g[w]);f?(x[0]=S,x[1]=d.y,_[0]=S,_[1]=d.y+d.height):(x[0]=d.x,x[1]=S,_[0]=d.x+d.width,_[1]=S);var M=p++%h.length;this._axisGroup.add(new a.Line(a.subPixelOptimizeLine({anid:"line_"+m[w],shape:{x1:x[0],y1:x[1],x2:_[0],y2:_[1]},style:n.defaults({stroke:h[M]},b),silent:!0})))}}},_splitArea:function(t,e,i){var o=t.axis;if(!o.scale.isBlank()){var r=t.getModel("splitArea"),s=r.getModel("areaStyle"),h=s.get("color"),c=e.coordinateSystem.getRect(),d=o.getTicksCoords(),f=o.scale.getTicks(),p=o.toGlobalCoord(d[0]),g=o.toGlobalCoord(d[0]),m=0,v=u(r,i),y=s.getAreaStyle();h=n.isArray(h)?h:[h];for(var x=t.get("axisLabel.showMinLabel"),_=t.get("axisLabel.showMaxLabel"),b=1;b<d.length;b++)if(!l(o,b,v,d.length,x,_)){var w,S,M,I,T=o.toGlobalCoord(d[b]);o.isHorizontal()?(w=p,S=c.y,M=T-w,I=c.height):(w=c.x,S=g,M=c.width,I=T-S);var A=m++%h.length;this._axisGroup.add(new a.Rect({anid:"area_"+f[b],shape:{x:w,y:S,width:M,height:I},style:n.defaults({fill:h[A]},y),silent:!0})),p=w+M,g=S+I}}}});d.extend({type:"xAxis"}),d.extend({type:"yAxis"})},function(t,e,i){"use strict";function n(){}function a(t,e,i,n){o(d(i).lastProp,n)||(d(i).lastProp=n,e?c.updateProps(i,n,t):(i.stopAnimation(),i.attr(n)))}function o(t,e){if(u.isObject(t)&&u.isObject(e)){var i=!0;return u.each(e,function(e,n){i=i&&o(t[n],e)}),!!i}return t===e}function r(t,e){t[e.get("label.show")?"show":"hide"]()}function s(t){return{position:t.position.slice(),rotation:t.rotation||0}}function l(t,e,i){var n=e.get("z"),a=e.get("zlevel");t&&t.traverse(function(t){"group"!==t.type&&(null!=n&&(t.z=n),null!=a&&(t.zlevel=a),t.silent=i)})}var u=i(1),h=i(15),c=i(3),d=i(5).makeGetter(),f=i(47),p=i(21),g=i(37),m=u.clone,v=u.bind;n.prototype={_group:null,_lastGraphicKey:null,_handle:null,_dragging:!1,_lastValue:null,_lastStatus:null,_payloadInfo:null,animationThreshold:15,render:function(t,e,i,n){var o=e.get("value"),r=e.get("status");if(this._axisModel=t,this._axisPointerModel=e,this._api=i,n||this._lastValue!==o||this._lastStatus!==r){this._lastValue=o,this._lastStatus=r;var s=this._group,h=this._handle;if(!r||"hide"===r)return s&&s.hide(),void(h&&h.hide());s&&s.show(),h&&h.show();var d={};this.makeElOption(d,o,t,e,i);var f=d.graphicKey;f!==this._lastGraphicKey&&this.clear(i),this._lastGraphicKey=f;var p=this._moveAnimation=this.determineAnimation(t,e);if(s){var g=u.curry(a,e,p);this.updatePointerEl(s,d,g,e),this.updateLabelEl(s,d,g,e)}else s=this._group=new c.Group,this.createPointerEl(s,d,t,e),this.createLabelEl(s,d,t,e),i.getZr().add(s);l(s,e,!0),this._renderHandle(o)}},remove:function(t){this.clear(t)},dispose:function(t){this.clear(t)},determineAnimation:function(t,e){var i=e.get("animation"),n=t.axis,a="category"===n.type,o=e.get("snap");if(!o&&!a)return!1;if("auto"===i||null==i){var r=this.animationThreshold;if(a&&n.getBandWidth()>r)return!0;if(o){var s=f.getAxisInfo(t).seriesDataCount,l=n.getExtent();return Math.abs(l[0]-l[1])/s>r}return!1}return i===!0},makeElOption:function(t,e,i,n,a){},createPointerEl:function(t,e,i,n){var a=e.pointer;if(a){var o=d(t).pointerEl=new c[a.type](m(e.pointer));t.add(o)}},createLabelEl:function(t,e,i,n){if(e.label){var a=d(t).labelEl=new c.Rect(m(e.label));t.add(a),r(a,n)}},updatePointerEl:function(t,e,i){var n=d(t).pointerEl;n&&(n.setStyle(e.pointer.style),i(n,{shape:e.pointer.shape}))},updateLabelEl:function(t,e,i,n){var a=d(t).labelEl;a&&(a.setStyle(e.label.style),i(a,{shape:e.label.shape,position:e.label.position}),r(a,n))},_renderHandle:function(t){if(!this._dragging&&this.updateHandleTransform){var e=this._axisPointerModel,i=this._api.getZr(),n=this._handle,a=e.getModel("handle"),o=e.get("status");if(!a.get("show")||!o||"hide"===o)return n&&i.remove(n),void(this._handle=null);var r;this._handle||(r=!0,n=this._handle=c.createIcon(a.get("icon"),{cursor:"move",draggable:!0,onmousemove:function(t){p.stop(t.event)},onmousedown:v(this._onHandleDragMove,this,0,0),drift:v(this._onHandleDragMove,this),ondragend:v(this._onHandleDragEnd,this)}),i.add(n)),l(n,e,!1);var s=["color","borderColor","borderWidth","opacity","shadowColor","shadowBlur","shadowOffsetX","shadowOffsetY"];n.setStyle(a.getItemStyle(null,s));var h=a.get("size");u.isArray(h)||(h=[h,h]),n.attr("scale",[h[0]/2,h[1]/2]),g.createOrUpdate(this,"_doDispatchAxisPointer",a.get("throttle")||0,"fixRate"),this._moveHandleToValue(t,r)}},_moveHandleToValue:function(t,e){a(this._axisPointerModel,!e&&this._moveAnimation,this._handle,s(this.getHandleTransform(t,this._axisModel,this._axisPointerModel)))},_onHandleDragMove:function(t,e){var i=this._handle;if(i){this._dragging=!0;var n=this.updateHandleTransform(s(i),[t,e],this._axisModel,this._axisPointerModel);this._payloadInfo=n,i.stopAnimation(),i.attr(s(n)),d(i).lastProp=null,this._doDispatchAxisPointer()}},_doDispatchAxisPointer:function(){var t=this._handle;if(t){var e=this._payloadInfo,i=this._axisModel;this._api.dispatchAction({type:"updateAxisPointer",x:e.cursorPoint[0],y:e.cursorPoint[1],tooltipOption:e.tooltipOption,axesInfo:[{axisDim:i.axis.dim,axisIndex:i.componentIndex}]})}},_onHandleDragEnd:function(t){this._dragging=!1;var e=this._handle;if(e){var i=this._axisPointerModel.get("value");this._moveHandleToValue(i),this._api.dispatchAction({type:"hideTip"})}},getHandleTransform:null,updateHandleTransform:null,clear:function(t){this._lastValue=null,this._lastStatus=null;var e=t.getZr(),i=this._group,n=this._handle;e&&i&&(this._lastGraphicKey=null,i&&e.remove(i),n&&e.remove(n),this._group=null,this._handle=null,this._payloadInfo=null)},doClear:function(){},buildLabel:function(t,e,i){return i=i||0,{x:t[i],y:t[1-i],width:e[i],height:e[1-i]}}},n.prototype.constructor=n,h.enableClassExtend(n),t.exports=n},function(t,e,i){"use strict";function n(t,e){var i={};return i[e.dim+"AxisIndex"]=e.index,t.getCartesian(i)}function a(t){return"x"===t.dim?0:1}var o=i(3),r=i(124),s=i(81),l=i(80),u=i(41),h=r.extend({makeElOption:function(t,e,i,a,o){var r=i.axis,u=r.grid,h=a.get("type"),d=n(u,r).getOtherAxis(r).getGlobalExtent(),f=r.toGlobalCoord(r.dataToCoord(e,!0));if(h&&"none"!==h){var p=s.buildElStyle(a),g=c[h](r,f,d,p);g.style=p,t.graphicKey=g.type,t.pointer=g}var m=l.layout(u.model,i);s.buildCartesianSingleLabelElOption(e,t,m,i,a,o)},getHandleTransform:function(t,e,i){var n=l.layout(e.axis.grid.model,e,{labelInside:!1});return n.labelMargin=i.get("handle.margin"),{position:s.getTransformedPosition(e.axis,t,n),rotation:n.rotation+(n.labelDirection<0?Math.PI:0)}},updateHandleTransform:function(t,e,i,a){var o=i.axis,r=o.grid,s=o.getGlobalExtent(!0),l=n(r,o).getOtherAxis(o).getGlobalExtent(),u="x"===o.dim?0:1,h=t.position;h[u]+=e[u],h[u]=Math.min(s[1],h[u]),h[u]=Math.max(s[0],h[u]);var c=(l[1]+l[0])/2,d=[c,c];d[u]=h[u];var f=[{verticalAlign:"middle"},{align:"center"}];return{position:h,rotation:t.rotation,cursorPoint:d,tooltipOption:f[u]}}}),c={line:function(t,e,i,n){var r=s.makeLineShape([e,i[0]],[e,i[1]],a(t));return o.subPixelOptimizeLine({shape:r,style:n}),{type:"Line",shape:r}},shadow:function(t,e,i,n){var o=t.getBandWidth(),r=i[1]-i[0];return{type:"Rect",shape:s.makeRectShape([e-o/2,i[0]],[o,r],a(t))}}};u.registerAxisPointerClass("CartesianAxisPointer",h),t.exports=h},function(t,e,i){var n=i(1),a=i(5);t.exports=function(t,e){var i,o=[],r=t.seriesIndex;if(null==r||!(i=e.getSeriesByIndex(r)))return{point:[]};var s=i.getData(),l=a.queryDataIndex(s,t);if(null==l||n.isArray(l))return{point:[]};var u=s.getItemGraphicEl(l),h=i.coordinateSystem;if(i.getTooltipPosition)o=i.getTooltipPosition(l)||[];else if(h&&h.dataToPoint)o=h.dataToPoint(s.getValues(n.map(h.dimensions,function(t){return i.coordDimToDataDim(t)[0]}),l,!0))||[];else if(u){var c=u.getBoundingRect().clone();c.applyTransform(u.transform),o=[c.x+c.width/2,c.y+c.height/2]}return{point:o,el:u}}},function(t,e,i){function n(t,e){function i(i,n){t.on(i,function(i){var o=s(e);c(h(t).records,function(t){t&&n(t,i,o.dispatchAction)}),a(o.pendings,e)})}h(t).initialized||(h(t).initialized=!0,i("click",u.curry(r,"click")),i("mousemove",u.curry(r,"mousemove")),i("globalout",o))}function a(t,e){var i,n=t.showTip.length,a=t.hideTip.length;n?i=t.showTip[n-1]:a&&(i=t.hideTip[a-1]),i&&(i.dispatchAction=null,e.dispatchAction(i))}function o(t,e,i){t.handler("leave",null,i)}function r(t,e,i,n){e.handler(t,i,n)}function s(t){var e={showTip:[],hideTip:[]},i=function(n){var a=e[n.type];a?a.push(n):(n.dispatchAction=i,t.dispatchAction(n))};return{dispatchAction:i,pendings:e}}var l=i(10),u=i(1),h=i(5).makeGetter(),c=u.each,d={};d.register=function(t,e,i){if(!l.node){var a=e.getZr();h(a).records||(h(a).records={}),n(a,e);var o=h(a).records[t]||(h(a).records[t]={});o.handler=i}},d.unregister=function(t,e){if(!l.node){var i=e.getZr(),n=(h(i).records||{})[t];n&&(h(i).records[t]=null)}},t.exports=d},function(t,e,i){var n=i(1),a=i(82),o=i(2);o.registerAction("dataZoom",function(t,e){var i=a.createLinkedNodesFinder(n.bind(e.eachComponent,e,"dataZoom"),a.eachAxisDim,function(t,e){return t.get(e.axisIndex)}),o=[];e.eachComponent({mainType:"dataZoom",query:t},function(t,e){o.push.apply(o,i(t).nodes)}),n.each(o,function(e,i){e.setRawRange({start:t.start,end:t.end,startValue:t.startValue,endValue:t.endValue})})})},function(t,e,i){function n(t,e,i){i.getAxisProxy(t.name,e).reset(i)}function a(t,e,i){i.getAxisProxy(t.name,e).filterData(i)}var o=i(2);o.registerProcessor(function(t,e){t.eachComponent("dataZoom",function(t){t.eachTargetAxis(n),t.eachTargetAxis(a)}),t.eachComponent("dataZoom",function(t){var e=t.findRepresentativeAxisProxy(),i=e.getDataPercentWindow(),n=e.getDataValueWindow();t.setRawRange({start:i[0],end:i[1],startValue:n[0],endValue:n[1]},!0)})})},function(t,e,i){function n(t){var e=t[r];return e||(e=t[r]=[{}]),e}var a=i(1),o=a.each,r="\0_ec_hist_store",s={push:function(t,e){var i=n(t);o(e,function(e,n){for(var a=i.length-1;a>=0;a--){var o=i[a];if(o[n])break}if(a<0){var r=t.queryComponents({mainType:"dataZoom",subType:"select",id:n})[0];if(r){var s=r.getPercentRange();i[0][n]={dataZoomId:n,start:s[0],end:s[1]}}}}),i.push(e)},pop:function(t){var e=n(t),i=e[e.length-1];e.length>1&&e.pop();var a={};return o(i,function(t,i){for(var n=e.length-1;n>=0;n--){var t=e[n][i];if(t){a[i]=t;break}}}),a},clear:function(t){t[r]=null},count:function(t){return n(t).length}};t.exports=s},function(t,e,i){i(13).registerSubTypeDefaulter("dataZoom",function(){return"slider"})},function(t,e,i){function n(t){V.call(this),this._zr=t,this.group=new G.Group,this._brushType,this._brushOption,this._panels,this._track=[],this._dragging,this._covers=[],this._creatingCover,this._creatingPanel,this._enableGlobalPan,this._uid="brushController_"+it++,this._handlers={},Z(nt,function(t,e){this._handlers[e]=B.bind(t,this)},this)}function a(t,e){var i=t._zr;t._enableGlobalPan||H.take(i,J,t._uid),Z(t._handlers,function(t,e){i.on(e,t)}),t._brushType=e.brushType,t._brushOption=B.merge(B.clone(et),e,!0)}function o(t){var e=t._zr;H.release(e,J,t._uid),Z(t._handlers,function(t,i){e.off(i,t)}),t._brushType=t._brushOption=null}function r(t,e){var i=at[e.brushType].createCover(t,e);return i.__brushOption=e,u(i,e),t.group.add(i),i}function s(t,e){var i=c(e);return i.endCreating&&(i.endCreating(t,e),u(e,e.__brushOption)),e}function l(t,e){var i=e.__brushOption;c(e).updateCoverShape(t,e,i.range,i)}function u(t,e){var i=e.z;null==i&&(i=Y),t.traverse(function(t){t.z=i,t.z2=i})}function h(t,e){c(e).updateCommon(t,e),l(t,e)}function c(t){return at[t.__brushOption.brushType]}function d(t,e,i){var n=t._panels;if(!n)return!0;var a,o=t._transform;return Z(n,function(t){t.isTargetByCursor(e,i,o)&&(a=t)}),a}function f(t,e){var i=t._panels;if(!i)return!0;var n=e.__brushOption.panelId;return null==n||i[n]}function p(t){var e=t._covers,i=e.length;return Z(e,function(e){t.group.remove(e)},t),e.length=0,!!i}function g(t,e){var i=q(t._covers,function(t){var e=t.__brushOption,i=B.clone(e.range);return{brushType:e.brushType,panelId:e.panelId,range:i}});t.trigger("brush",i,{isEnd:!!e.isEnd,removeOnClick:!!e.removeOnClick})}function m(t){var e=t._track;if(!e.length)return!1;var i=e[e.length-1],n=e[0],a=i[0]-n[0],o=i[1]-n[1],r=X(a*a+o*o,.5);return r>$}function v(t){var e=t.length-1;return e<0&&(e=0),[t[0],t[e]]}function y(t,e,i,n){var a=new G.Group;return a.add(new G.Rect({name:"main",style:w(i),silent:!0,draggable:!0,cursor:"move",drift:F(t,e,a,"nswe"),ondragend:F(g,e,{isEnd:!0})})),Z(n,function(i){a.add(new G.Rect({name:i,style:{opacity:0},draggable:!0,silent:!0,invisible:!0,drift:F(t,e,a,i),ondragend:F(g,e,{isEnd:!0})}))}),a}function x(t,e,i,n){var a=n.brushStyle.lineWidth||0,o=U(a,K),r=i[0][0],s=i[1][0],l=r-a/2,u=s-a/2,h=i[0][1],c=i[1][1],d=h-o+a/2,f=c-o+a/2,p=h-r,g=c-s,m=p+a,v=g+a;b(t,e,"main",r,s,p,g),n.transformable&&(b(t,e,"w",l,u,o,v),b(t,e,"e",d,u,o,v),b(t,e,"n",l,u,m,o),b(t,e,"s",l,f,m,o),b(t,e,"nw",l,u,o,o),b(t,e,"ne",d,u,o,o),b(t,e,"sw",l,f,o,o),b(t,e,"se",d,f,o,o))}function _(t,e){var i=e.__brushOption,n=i.transformable,a=e.childAt(0);a.useStyle(w(i)),a.attr({silent:!n,cursor:n?"move":"default"}),Z(["w","e","n","s","se","sw","ne","nw"],function(i){var a=e.childOfName(i),o=I(t,i);a&&a.attr({silent:!n,invisible:!n,cursor:n?tt[o]+"-resize":null})})}function b(t,e,i,n,a,o,r){var s=e.childOfName(i);s&&s.setShape(D(L(t,e,[[n,a],[n+o,a+r]])))}function w(t){return B.defaults({strokeNoScale:!0},t.brushStyle)}function S(t,e,i,n){var a=[j(t,i),j(e,n)],o=[U(t,i),U(e,n)];return[[a[0],o[0]],[a[1],o[1]]]}function M(t){return G.getTransform(t.group)}function I(t,e){if(e.length>1){e=e.split("");var i=[I(t,e[0]),I(t,e[1])];return("e"===i[0]||"w"===i[0])&&i.reverse(),i.join("")}var n={w:"left",e:"right",n:"top",s:"bottom"},a={left:"w",right:"e",top:"n",bottom:"s"},i=G.transformDirection(n[e],M(t));return a[i]}function T(t,e,i,n,a,o,r,s){var l=n.__brushOption,u=t(l.range),c=C(i,o,r);Z(a.split(""),function(t){var e=Q[t];u[e[0]][e[1]]+=c[e[0]]}),l.range=e(S(u[0][0],u[1][0],u[0][1],u[1][1])),h(i,n),g(i,{isEnd:!1})}function A(t,e,i,n,a){var o=e.__brushOption.range,r=C(t,i,n);Z(o,function(t){t[0]+=r[0],t[1]+=r[1]}),h(t,e),g(t,{isEnd:!1})}function C(t,e,i){var n=t.group,a=n.transformCoordToLocal(e,i),o=n.transformCoordToLocal(0,0);return[a[0]-o[0],a[1]-o[1]]}function L(t,e,i){var n=f(t,e);return n&&n!==!0?n.clipPath(i,t._transform):B.clone(i)}function D(t){var e=j(t[0][0],t[1][0]),i=j(t[0][1],t[1][1]),n=U(t[0][0],t[1][0]),a=U(t[0][1],t[1][1]);return{x:e,y:i,width:n-e,height:a-i}}function P(t,e,i){if(t._brushType){var n=t._zr,a=t._covers,o=d(t,e,i);if(!t._dragging)for(var r=0;r<a.length;r++){var s=a[r].__brushOption;if(o&&(o===!0||s.panelId===o.panelId)&&at[s.brushType].contain(a[r],i[0],i[1]))return}o&&n.setCursorStyle("crosshair")}}function k(t){var e=t.event;e.preventDefault&&e.preventDefault()}function O(t,e,i){return t.childOfName("main").contain(e,i)}function z(t,e,i,n){var a,o=t._creatingCover,u=t._creatingPanel,h=t._brushOption;if(t._track.push(i.slice()),m(t)||o){if(u&&!o){"single"===h.brushMode&&p(t);var c=B.clone(h);c.brushType=E(c.brushType,u),c.panelId=u===!0?null:u.panelId,o=t._creatingCover=r(t,c),t._covers.push(o)}if(o){var f=at[E(t._brushType,u)],g=o.__brushOption;g.range=f.getCreatingRange(L(t,o,t._track)),n&&(s(t,o),f.updateCommon(t,o)),l(t,o),a={isEnd:n}}}else n&&"single"===h.brushMode&&h.removeOnClick&&d(t,e,i)&&p(t)&&(a={isEnd:n,removeOnClick:!0});return a}function E(t,e){return"auto"===t?e.defaultBrushType:t}function R(t){if(this._dragging){k(t);var e=this.group.transformCoordToLocal(t.offsetX,t.offsetY),i=z(this,t,e,!0);this._dragging=!1,this._track=[],this._creatingCover=null,i&&g(this,i)}}function N(t){return{createCover:function(e,i){return y(F(T,function(e){var i=[e,[0,100]];return t&&i.reverse(),i},function(e){return e[t]}),e,i,[["w","e"],["n","s"]][t])},getCreatingRange:function(e){var i=v(e),n=j(i[0][t],i[1][t]),a=U(i[0][t],i[1][t]);return[n,a]},updateCoverShape:function(e,i,n,a){var o,r=f(e,i);if(r!==!0&&r.getLinearBrushOtherExtent)o=r.getLinearBrushOtherExtent(t,e._transform);else{var s=e._zr;o=[0,[s.getWidth(),s.getHeight()][1-t]]}var l=[n,o];t&&l.reverse(),x(e,i,l,a)},updateCommon:_,contain:O}}var V=i(23),B=i(1),G=i(3),H=i(134),W=i(43),F=B.curry,Z=B.each,q=B.map,j=Math.min,U=Math.max,X=Math.pow,Y=1e4,$=6,K=6,J="globalPan",Q={w:[0,0],e:[0,1],n:[1,0],s:[1,1]},tt={w:"ew",e:"ew",n:"ns",s:"ns",ne:"nesw",sw:"nesw",nw:"nwse",se:"nwse"},et={brushStyle:{lineWidth:2,stroke:"rgba(0,0,0,0.3)",fill:"rgba(0,0,0,0.1)"},transformable:!0,brushMode:"single",removeOnClick:!1},it=0;n.prototype={constructor:n,enableBrush:function(t){return this._brushType&&o(this),t.brushType&&a(this,t),this},setPanels:function(t){if(t&&t.length){var e=this._panels={};B.each(t,function(t){e[t.panelId]=B.clone(t)})}else this._panels=null;return this},mount:function(t){t=t||{},this._enableGlobalPan=t.enableGlobalPan;var e=this.group;return this._zr.add(e),e.attr({position:t.position||[0,0],rotation:t.rotation||0,scale:t.scale||[1,1]}),this._transform=e.getLocalTransform(),this},eachCover:function(t,e){Z(this._covers,t,e)},updateCovers:function(t){function e(t,e){return(null!=t.id?t.id:o+e)+"-"+t.brushType}function i(t,i){return e(t.__brushOption,i)}function n(e,i){var n=t[e];if(null!=i&&l[i]===d)u[e]=l[i];else{var a=u[e]=null!=i?(l[i].__brushOption=n,l[i]):s(c,r(c,n));h(c,a)}}function a(t){l[t]!==d&&c.group.remove(l[t])}t=B.map(t,function(t){return B.merge(B.clone(et),t,!0)});var o="\0-brush-index-",l=this._covers,u=this._covers=[],c=this,d=this._creatingCover;return new W(l,t,i,e).add(n).update(n).remove(a).execute(),this},unmount:function(){return this.enableBrush(!1),p(this),this._zr.remove(this.group),this},dispose:function(){this.unmount(),this.off()}},B.mixin(n,V);var nt={mousedown:function(t){if(this._dragging)R.call(this,t);else if(!t.target||!t.target.draggable){k(t);var e=this.group.transformCoordToLocal(t.offsetX,t.offsetY);this._creatingCover=null;var i=this._creatingPanel=d(this,t,e);i&&(this._dragging=!0,this._track=[e.slice()])}},mousemove:function(t){var e=this.group.transformCoordToLocal(t.offsetX,t.offsetY);if(P(this,t,e),this._dragging){k(t);var i=z(this,t,e,!1);i&&g(this,i)}},mouseup:R},at={lineX:N(0),lineY:N(1),rect:{createCover:function(t,e){return y(F(T,function(t){return t},function(t){return t}),t,e,["w","e","n","s","se","sw","ne","nw"])},getCreatingRange:function(t){var e=v(t);return S(e[1][0],e[1][1],e[0][0],e[0][1])},updateCoverShape:function(t,e,i,n){x(t,e,i,n)},updateCommon:_,contain:O},polygon:{createCover:function(t,e){var i=new G.Group;return i.add(new G.Polyline({name:"main",style:w(e),silent:!0})),i},getCreatingRange:function(t){return t},endCreating:function(t,e){e.remove(e.childAt(0)),e.add(new G.Polygon({name:"main",draggable:!0,drift:F(A,t,e),ondragend:F(g,t,{isEnd:!0})}))},updateCoverShape:function(t,e,i,n){e.childAt(0).setShape({points:L(t,e,i)})},updateCommon:_,contain:O}};t.exports=n},function(t,e){var i={},n={axisPointer:1,tooltip:1,brush:1};i.onIrrelevantElement=function(t,e,i){var a=e.getComponentByElement(t.topTarget),o=a&&a.coordinateSystem;return a&&a!==i&&!n[a.mainType]&&o&&o.model!==i},t.exports=i},function(t,e,i){function n(t){return t[a]||(t[a]={})}var a="\0_ec_interaction_mutex",o={take:function(t,e,i){var a=n(t);a[e]=i},release:function(t,e,i){var a=n(t),o=a[e];o===i&&(a[e]=null)},isTaken:function(t,e){return!!n(t)[e]}};i(2).registerAction({type:"takeGlobalCursor",event:"globalCursorTaken",update:"update"},function(){}),t.exports=o},function(t,e,i){var n=i(9),a=i(7),o=i(3);t.exports={layout:function(t,e,i){var a=e.getBoxLayoutParams(),o=e.get("padding"),r={width:i.getWidth(),height:i.getHeight()},s=n.getLayoutRect(a,r,o);n.box(e.get("orient"),t,e.get("itemGap"),s.width,s.height),n.positionElement(t,a,r,o)},makeBackground:function(t,e){var i=a.normalizeCssArray(e.get("padding")),n=e.getItemStyle(["color","opacity"]);n.fill=e.get("backgroundColor");var t=new o.Rect({shape:{x:t.x-i[3],y:t.y-i[0],width:t.width+i[1]+i[3],height:t.height+i[0]+i[2],r:e.get("borderRadius")},style:n,silent:!0,z2:-1});return t}}},function(t,e,i){"use strict";var n=i(1),a=i(11),o=i(2).extendComponentModel({type:"legend.plain",dependencies:["series"],layoutMode:{type:"box",ignoreSize:!0},init:function(t,e,i){this.mergeDefaultAndTheme(t,i),t.selected=t.selected||{}},mergeOption:function(t){o.superCall(this,"mergeOption",t)},optionUpdated:function(){this._updateData(this.ecModel);var t=this._data;if(t[0]&&"single"===this.get("selectedMode")){for(var e=!1,i=0;i<t.length;i++){var n=t[i].get("name");if(this.isSelected(n)){this.select(n),e=!0;break}}!e&&this.select(t[0].get("name"))}},_updateData:function(t){var e=n.map(this.get("data")||[],function(t){return"string"!=typeof t&&"number"!=typeof t||(t={name:t}),new a(t,this,this.ecModel)},this);this._data=e;var i=n.map(t.getSeries(),function(t){return t.name});t.eachSeries(function(t){if(t.legendDataProvider){var e=t.legendDataProvider();i=i.concat(e.mapArray(e.getName))}}),this._availableNames=i},getData:function(){return this._data},select:function(t){var e=this.option.selected,i=this.get("selectedMode");if("single"===i){var a=this._data;n.each(a,function(t){e[t.get("name")]=!1})}e[t]=!0},unSelect:function(t){"single"!==this.get("selectedMode")&&(this.option.selected[t]=!1)},toggleSelected:function(t){var e=this.option.selected;e.hasOwnProperty(t)||(e[t]=!0),this[e[t]?"unSelect":"select"](t)},isSelected:function(t){var e=this.option.selected;return!(e.hasOwnProperty(t)&&!e[t])&&n.indexOf(this._availableNames,t)>=0},defaultOption:{zlevel:0,z:4,show:!0,orient:"horizontal",left:"center",top:0,align:"auto",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderRadius:0,borderWidth:0,padding:5,itemGap:10,itemWidth:25,itemHeight:14,inactiveColor:"#ccc",textStyle:{color:"#333"},selectedMode:!0,tooltip:{show:!1}}});t.exports=o},function(t,e,i){function n(t,e){e.dispatchAction({type:"legendToggleSelect",name:t})}function a(t,e,i){var n=i.getZr().storage.getDisplayList()[0];n&&n.useHoverLayer||t.get("legendHoverLink")&&i.dispatchAction({type:"highlight",seriesName:t.name,name:e})}function o(t,e,i){var n=i.getZr().storage.getDisplayList()[0];n&&n.useHoverLayer||t.get("legendHoverLink")&&i.dispatchAction({type:"downplay",seriesName:t.name,name:e})}var r=i(1),s=i(24),l=i(3),u=i(135),h=i(9),c=r.curry,d=r.each,f=l.Group;t.exports=i(2).extendComponentView({type:"legend.plain",newlineDisabled:!1,init:function(){this.group.add(this._contentGroup=new f),this._backgroundEl},getContentGroup:function(){return this._contentGroup},render:function(t,e,i){if(this.resetInner(),t.get("show",!0)){var n=t.get("align");n&&"auto"!==n||(n="right"===t.get("left")&&"vertical"===t.get("orient")?"right":"left"),this.renderInner(n,t,e,i);var a=t.getBoxLayoutParams(),o={width:i.getWidth(),height:i.getHeight()},s=t.get("padding"),l=h.getLayoutRect(a,o,s),c=this.layoutInner(t,n,l),d=h.getLayoutRect(r.defaults({width:c.width,height:c.height},a),o,s);this.group.attr("position",[d.x-c.x,d.y-c.y]),this.group.add(this._backgroundEl=u.makeBackground(c,t))}},resetInner:function(){this.getContentGroup().removeAll(),this._backgroundEl&&this.group.remove(this._backgroundEl)},renderInner:function(t,e,i,s){var l=this.getContentGroup(),u=r.createHashMap(),h=e.get("selectedMode");d(e.getData(),function(r,d){var p=r.get("name");if(!this.newlineDisabled&&(""===p||"\n"===p))return void l.add(new f({newline:!0}));var g=i.getSeriesByName(p)[0];if(!u.get(p))if(g){var m=g.getData(),v=m.getVisual("color");"function"==typeof v&&(v=v(g.getDataParams(0)));var y=m.getVisual("legendSymbol")||"roundRect",x=m.getVisual("symbol"),_=this._createItem(p,d,r,e,y,x,t,v,h);_.on("click",c(n,p,s)).on("mouseover",c(a,g,null,s)).on("mouseout",c(o,g,null,s)),u.set(p,!0)}else i.eachRawSeries(function(i){if(!u.get(p)&&i.legendDataProvider){var l=i.legendDataProvider(),f=l.indexOfName(p);if(f<0)return;var g=l.getItemVisual(f,"color"),m="roundRect",v=this._createItem(p,d,r,e,m,null,t,g,h);v.on("click",c(n,p,s)).on("mouseover",c(a,i,p,s)).on("mouseout",c(o,i,p,s)),u.set(p,!0)}},this)},this)},_createItem:function(t,e,i,n,a,o,u,h,c){var d=n.get("itemWidth"),p=n.get("itemHeight"),g=n.get("inactiveColor"),m=n.isSelected(t),v=new f,y=i.getModel("textStyle"),x=i.get("icon"),_=i.getModel("tooltip"),b=_.parentModel;if(a=x||a,v.add(s.createSymbol(a,0,0,d,p,m?h:g)),!x&&o&&(o!==a||"none"==o)){var w=.8*p;"none"===o&&(o="circle"),v.add(s.createSymbol(o,(d-w)/2,(p-w)/2,w,w,m?h:g))}var S="left"===u?d+5:-5,M=u,I=n.get("formatter"),T=t;"string"==typeof I&&I?T=I.replace("{name}",null!=t?t:""):"function"==typeof I&&(T=I(t)),v.add(new l.Text({style:l.setTextStyle({},y,{text:T,x:S,y:p/2,textFill:m?y.getTextColor():g,
textAlign:M,textVerticalAlign:"middle"})}));var A=new l.Rect({shape:v.getBoundingRect(),invisible:!0,tooltip:_.get("show")?r.extend({content:t,formatter:b.get("formatter",!0)||function(){return t},formatterParams:{componentType:"legend",legendIndex:n.componentIndex,name:t,$vars:["name"]}},_.option):null});return v.add(A),v.eachChild(function(t){t.silent=!0}),A.silent=!c,this.getContentGroup().add(v),l.setHoverStyle(v),v.__legendDataIndex=e,v},layoutInner:function(t,e,i){var n=this.getContentGroup();h.box(t.get("orient"),n,t.get("itemGap"),i.width,i.height);var a=n.getBoundingRect();return n.attr("position",[-a.x,-a.y]),this.group.getBoundingRect()}})},function(t,e,i){var n=i(1),a=i(33),o=function(t,e,i,n,o){a.call(this,t,e,i),this.type=n||"value",this.position=o||"bottom"};o.prototype={constructor:o,index:0,onZero:!1,model:null,isHorizontal:function(){var t=this.position;return"top"===t||"bottom"===t},getGlobalExtent:function(t){var e=this.getExtent();return e[0]=this.toGlobalCoord(e[0]),e[1]=this.toGlobalCoord(e[1]),t&&e[0]>e[1]&&e.reverse(),e},getOtherAxis:function(){this.grid.getOtherAxis()},isLabelIgnored:function(t){if("category"===this.type){var e=this.getLabelInterval();return"function"==typeof e&&!e(t,this.scale.getLabel(t))||t%(e+1)}},pointToData:function(t,e){return this.coordToData(this.toLocalCoord(t["x"===this.dim?0:1]),e)},toLocalCoord:null,toGlobalCoord:null},n.inherits(o,a),t.exports=o},function(t,e,i){"use strict";function n(t){return this._axes[t]}var a=i(1),o=function(t){this._axes={},this._dimList=[],this.name=t||""};o.prototype={constructor:o,type:"cartesian",getAxis:function(t){return this._axes[t]},getAxes:function(){return a.map(this._dimList,n,this)},getAxesByScale:function(t){return t=t.toLowerCase(),a.filter(this.getAxes(),function(e){return e.scale.type===t})},addAxis:function(t){var e=t.dim;this._axes[e]=t,this._dimList.push(e)},dataToCoord:function(t){return this._dataCoordConvert(t,"dataToCoord")},coordToData:function(t){return this._dataCoordConvert(t,"coordToData")},_dataCoordConvert:function(t,e){for(var i=this._dimList,n=t instanceof Array?[]:{},a=0;a<i.length;a++){var o=i[a],r=this._axes[o];n[o]=r[e](t[o])}return n}},t.exports=o},function(t,e,i){"use strict";function n(t){o.call(this,t)}var a=i(1),o=i(139);n.prototype={constructor:n,type:"cartesian2d",dimensions:["x","y"],getBaseAxis:function(){return this.getAxesByScale("ordinal")[0]||this.getAxesByScale("time")[0]||this.getAxis("x")},containPoint:function(t){var e=this.getAxis("x"),i=this.getAxis("y");return e.contain(e.toLocalCoord(t[0]))&&i.contain(i.toLocalCoord(t[1]))},containData:function(t){return this.getAxis("x").containData(t[0])&&this.getAxis("y").containData(t[1])},dataToPoint:function(t,e){var i=this.getAxis("x"),n=this.getAxis("y");return[i.toGlobalCoord(i.dataToCoord(t[0],e)),n.toGlobalCoord(n.dataToCoord(t[1],e))]},pointToData:function(t,e){var i=this.getAxis("x"),n=this.getAxis("y");return[i.coordToData(i.toLocalCoord(t[0]),e),n.coordToData(n.toLocalCoord(t[1]),e)]},getOtherAxis:function(t){return this.getAxis("x"===t.dim?"y":"x")}},a.inherits(n,o),t.exports=n},function(t,e,i){"use strict";i(63);var n=i(13);t.exports=n.extend({type:"grid",dependencies:["xAxis","yAxis"],layoutMode:"box",coordinateSystem:null,defaultOption:{show:!1,zlevel:0,z:0,left:"10%",top:60,right:"10%",bottom:60,containLabel:!1,backgroundColor:"rgba(0,0,0,0)",borderWidth:1,borderColor:"#ccc"}})},function(t,e,i){var n=i(28),a=i(24),o=i(18),r=i(42),s=i(11),l=i(1);t.exports={createList:function(t){var e=t.get("data");return n(e,t,t.ecModel)},completeDimensions:i(25),createSymbol:a.createSymbol,createScale:function(t,e){var i=e;e instanceof s||(i=new s(e),l.mixin(i,r));var n=o.createScaleByModel(i);return n.setExtent(t[0],t[1]),o.niceScaleExtent(n,i),n},mixinAxisModelCommonMethods:function(t){l.mixin(t,r)}}},function(t,e,i){var n=i(3),a=i(1),o=Math.PI;t.exports=function(t,e){e=e||{},a.defaults(e,{text:"loading",color:"#c23531",textColor:"#000",maskColor:"rgba(255, 255, 255, 0.8)",zlevel:0});var i=new n.Rect({style:{fill:e.maskColor},zlevel:e.zlevel,z:1e4}),r=new n.Arc({shape:{startAngle:-o/2,endAngle:-o/2+.1,r:10},style:{stroke:e.color,lineCap:"round",lineWidth:5},zlevel:e.zlevel,z:10001}),s=new n.Rect({style:{fill:"none",text:e.text,textPosition:"right",textDistance:10,textFill:e.textColor},zlevel:e.zlevel,z:10001});r.animateShape(!0).when(1e3,{endAngle:3*o/2}).start("circularInOut"),r.animateShape(!0).when(1e3,{startAngle:3*o/2}).delay(300).start("circularInOut");var l=new n.Group;return l.add(r),l.add(s),l.add(i),l.resize=function(){var e=t.getWidth()/2,n=t.getHeight()/2;r.setShape({cx:e,cy:n});var a=r.shape.r;s.setShape({x:e-a,y:n-a,width:2*a,height:2*a}),i.setShape({x:0,y:0,width:t.getWidth(),height:t.getHeight()})},l.resize(),l}},function(t,e,i){function n(t,e){h.each(e,function(e,i){x.hasClass(i)||("object"==typeof e?t[i]=t[i]?h.merge(t[i],e,!1):h.clone(e):null==t[i]&&(t[i]=e))})}function a(t){t=t,this.option={},this.option[b]=1,this._componentsMap=h.createHashMap({series:[]}),this._seriesIndices=null,n(t,this._theme.option),h.merge(t,_,!1),this.mergeOption(t)}function o(t,e){h.isArray(e)||(e=e?[e]:[]);var i={};return f(e,function(e){i[e]=(t.get(e)||[]).slice()}),i}function r(t,e,i){var n=e.type?e.type:i?i.subType:x.determineSubType(t,e);return n}function s(t){return g(t,function(t){return t.componentIndex})||[]}function l(t,e){return e.hasOwnProperty("subType")?p(t,function(t){return t.subType===e.subType}):t}function u(t){}var h=i(1),c=i(5),d=i(11),f=h.each,p=h.filter,g=h.map,m=h.isArray,v=h.indexOf,y=h.isObject,x=i(13),_=i(146),b="\0_ec_inner",w=d.extend({constructor:w,init:function(t,e,i,n){i=i||{},this.option=null,this._theme=new d(i),this._optionManager=n},setOption:function(t,e){h.assert(!(b in t),"please use chart.getOption()"),this._optionManager.setOption(t,e),this.resetOption(null)},resetOption:function(t){var e=!1,i=this._optionManager;if(!t||"recreate"===t){var n=i.mountOption("recreate"===t);this.option&&"recreate"!==t?(this.restoreData(),this.mergeOption(n)):a.call(this,n),e=!0}if("timeline"!==t&&"media"!==t||this.restoreData(),!t||"recreate"===t||"timeline"===t){var o=i.getTimelineOption(this);o&&(this.mergeOption(o),e=!0)}if(!t||"recreate"===t||"media"===t){var r=i.getMediaOption(this,this._api);r.length&&f(r,function(t){this.mergeOption(t,e=!0)},this)}return e},mergeOption:function(t){function e(e,a){var l=c.normalizeToArray(t[e]),u=c.mappingToExists(n.get(e),l);c.makeIdAndName(u),f(u,function(t,i){var n=t.option;y(n)&&(t.keyInfo.mainType=e,t.keyInfo.subType=r(e,n,t.exist))});var d=o(n,a);i[e]=[],n.set(e,[]),f(u,function(t,a){var o=t.exist,r=t.option;if(h.assert(y(r)||o,"Empty component definition"),r){var s=x.getClass(e,t.keyInfo.subType,!0);if(o&&o instanceof s)o.name=t.keyInfo.name,o.mergeOption(r,this),o.optionUpdated(r,!1);else{var l=h.extend({dependentModels:d,componentIndex:a},t.keyInfo);o=new s(r,this,this,l),h.extend(o,l),o.init(r,this,this,l),o.optionUpdated(null,!0)}}else o.mergeOption({},this),o.optionUpdated({},!1);n.get(e)[a]=o,i[e][a]=o.option},this),"series"===e&&(this._seriesIndices=s(n.get("series")))}var i=this.option,n=this._componentsMap,a=[];f(t,function(t,e){null!=t&&(x.hasClass(e)?a.push(e):i[e]=null==i[e]?h.clone(t):h.merge(i[e],t,!0))}),x.topologicalTravel(a,x.getAllClassMainTypes(),e,this),this._seriesIndices=this._seriesIndices||[]},getOption:function(){var t=h.clone(this.option);return f(t,function(e,i){if(x.hasClass(i)){for(var e=c.normalizeToArray(e),n=e.length-1;n>=0;n--)c.isIdInner(e[n])&&e.splice(n,1);t[i]=e}}),delete t[b],t},getTheme:function(){return this._theme},getComponent:function(t,e){var i=this._componentsMap.get(t);if(i)return i[e||0]},queryComponents:function(t){var e=t.mainType;if(!e)return[];var i=t.index,n=t.id,a=t.name,o=this._componentsMap.get(e);if(!o||!o.length)return[];var r;if(null!=i)m(i)||(i=[i]),r=p(g(i,function(t){return o[t]}),function(t){return!!t});else if(null!=n){var s=m(n);r=p(o,function(t){return s&&v(n,t.id)>=0||!s&&t.id===n})}else if(null!=a){var u=m(a);r=p(o,function(t){return u&&v(a,t.name)>=0||!u&&t.name===a})}else r=o.slice();return l(r,t)},findComponents:function(t){function e(t){var e=a+"Index",i=a+"Id",n=a+"Name";return!t||null==t[e]&&null==t[i]&&null==t[n]?null:{mainType:a,index:t[e],id:t[i],name:t[n]}}function i(e){return t.filter?p(e,t.filter):e}var n=t.query,a=t.mainType,o=e(n),r=o?this.queryComponents(o):this._componentsMap.get(a);return i(l(r,t))},eachComponent:function(t,e,i){var n=this._componentsMap;if("function"==typeof t)i=e,e=t,n.each(function(t,n){f(t,function(t,a){e.call(i,n,t,a)})});else if(h.isString(t))f(n.get(t),e,i);else if(y(t)){var a=this.findComponents(t);f(a,e,i)}},getSeriesByName:function(t){var e=this._componentsMap.get("series");return p(e,function(e){return e.name===t})},getSeriesByIndex:function(t){return this._componentsMap.get("series")[t]},getSeriesByType:function(t){var e=this._componentsMap.get("series");return p(e,function(e){return e.subType===t})},getSeries:function(){return this._componentsMap.get("series").slice()},eachSeries:function(t,e){u(this),f(this._seriesIndices,function(i){var n=this._componentsMap.get("series")[i];t.call(e,n,i)},this)},eachRawSeries:function(t,e){f(this._componentsMap.get("series"),t,e)},eachSeriesByType:function(t,e,i){u(this),f(this._seriesIndices,function(n){var a=this._componentsMap.get("series")[n];a.subType===t&&e.call(i,a,n)},this)},eachRawSeriesByType:function(t,e,i){return f(this.getSeriesByType(t),e,i)},isSeriesFiltered:function(t){return u(this),h.indexOf(this._seriesIndices,t.componentIndex)<0},getCurrentSeriesIndices:function(){return(this._seriesIndices||[]).slice()},filterSeries:function(t,e){u(this);var i=p(this._componentsMap.get("series"),t,e);this._seriesIndices=s(i)},restoreData:function(){var t=this._componentsMap;this._seriesIndices=s(t.get("series"));var e=[];t.each(function(t,i){e.push(i)}),x.topologicalTravel(e,x.getAllClassMainTypes(),function(e,i){f(t.get(e),function(t){t.restoreData()})})}});h.mixin(w,i(65)),t.exports=w},function(t,e,i){function n(t){this._api=t,this._timelineOptions=[],this._mediaList=[],this._mediaDefault,this._currentMediaIndices=[],this._optionBackup,this._newBaseOption}function a(t,e,i){var n,a,o=[],r=[],s=t.timeline;if(t.baseOption&&(a=t.baseOption),(s||t.options)&&(a=a||{},o=(t.options||[]).slice()),t.media){a=a||{};var l=t.media;d(l,function(t){t&&t.option&&(t.query?r.push(t):n||(n=t))})}return a||(a=t),a.timeline||(a.timeline=s),d([a].concat(o).concat(u.map(r,function(t){return t.option})),function(t){d(e,function(e){e(t,i)})}),{baseOption:a,timelineOptions:o,mediaDefault:n,mediaList:r}}function o(t,e,i){var n={width:e,height:i,aspectratio:e/i},a=!0;return u.each(t,function(t,e){var i=e.match(m);if(i&&i[1]&&i[2]){var o=i[1],s=i[2].toLowerCase();r(n[s],t,o)||(a=!1)}}),a}function r(t,e,i){return"min"===i?t>=e:"max"===i?t<=e:t===e}function s(t,e){return t.join(",")===e.join(",")}function l(t,e){e=e||{},d(e,function(e,i){if(null!=e){var n=t[i];if(c.hasClass(i)){e=h.normalizeToArray(e),n=h.normalizeToArray(n);var a=h.mappingToExists(n,e);t[i]=p(a,function(t){return t.option&&t.exist?g(t.exist,t.option,!0):t.exist||t.option})}else t[i]=g(n,e,!0)}})}var u=i(1),h=i(5),c=i(13),d=u.each,f=u.clone,p=u.map,g=u.merge,m=/^(min|max)?(.+)$/;n.prototype={constructor:n,setOption:function(t,e){t=f(t,!0);var i=this._optionBackup,n=a.call(this,t,e,!i);this._newBaseOption=n.baseOption,i?(l(i.baseOption,n.baseOption),n.timelineOptions.length&&(i.timelineOptions=n.timelineOptions),n.mediaList.length&&(i.mediaList=n.mediaList),n.mediaDefault&&(i.mediaDefault=n.mediaDefault)):this._optionBackup=n},mountOption:function(t){var e=this._optionBackup;return this._timelineOptions=p(e.timelineOptions,f),this._mediaList=p(e.mediaList,f),this._mediaDefault=f(e.mediaDefault),this._currentMediaIndices=[],f(t?e.baseOption:this._newBaseOption)},getTimelineOption:function(t){var e,i=this._timelineOptions;if(i.length){var n=t.getComponent("timeline");n&&(e=f(i[n.getCurrentIndex()],!0))}return e},getMediaOption:function(t){var e=this._api.getWidth(),i=this._api.getHeight(),n=this._mediaList,a=this._mediaDefault,r=[],l=[];if(!n.length&&!a)return l;for(var u=0,h=n.length;u<h;u++)o(n[u].query,e,i)&&r.push(u);return!r.length&&a&&(r=[-1]),r.length&&!s(r,this._currentMediaIndices)&&(l=p(r,function(t){return f(t===-1?a.option:n[t].option)})),this._currentMediaIndices=r,l}},t.exports=n},function(t,e){var i="";"undefined"!=typeof navigator&&(i=navigator.platform||""),t.exports={color:["#c23531","#2f4554","#61a0a8","#d48265","#91c7ae","#749f83","#ca8622","#bda29a","#6e7074","#546570","#c4ccd3"],textStyle:{fontFamily:i.match(/^Win/)?"Microsoft YaHei":"sans-serif",fontSize:12,fontStyle:"normal",fontWeight:"normal"},blendMode:null,animation:"auto",animationDuration:1e3,animationDurationUpdate:300,animationEasing:"exponentialOut",animationEasingUpdate:"cubicOut",animationThreshold:2e3,progressiveThreshold:3e3,progressive:400,hoverLayerThreshold:3e3,useUTC:!1}},function(t,e,i){t.exports={getAreaStyle:i(31)([["fill","color"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["opacity"],["shadowColor"]])}},function(t,e){t.exports={getBoxLayoutParams:function(){return{left:this.get("left"),top:this.get("top"),right:this.get("right"),bottom:this.get("bottom"),width:this.get("width"),height:this.get("height")}}}},function(t,e,i){var n=i(31)([["fill","color"],["stroke","borderColor"],["lineWidth","borderWidth"],["opacity"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"],["textPosition"],["textAlign"]]);t.exports={getItemStyle:function(t,e){var i=n.call(this,t,e),a=this.getBorderLineDash();return a&&(i.lineDash=a),i},getBorderLineDash:function(){var t=this.get("borderType");return"solid"===t||null==t?null:"dashed"===t?[5,5]:[1,1]}}},function(t,e,i){var n=i(31)([["lineWidth","width"],["stroke","color"],["opacity"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"]]);t.exports={getLineStyle:function(t){var e=n.call(this,t),i=this.getLineDash(e.lineWidth);return i&&(e.lineDash=i),e},getLineDash:function(t){null==t&&(t=1);var e=this.get("type"),i=Math.max(t,2),n=4*t;return"solid"===e||null==e?null:"dashed"===e?[n,n]:[i,i]}}},function(t,e,i){var n=i(16),a=i(3),o=["textStyle","color"];t.exports={getTextColor:function(t){var e=this.ecModel;return this.getShallow("color")||(!t&&e?e.get(o):null)},getFont:function(){return a.getFont({fontStyle:this.getShallow("fontStyle"),fontWeight:this.getShallow("fontWeight"),fontSize:this.getShallow("fontSize"),fontFamily:this.getShallow("fontFamily")},this.ecModel)},getTextRect:function(t){return n.getBoundingRect(t,this.getFont(),this.getShallow("align"),this.getShallow("verticalAlign")||this.getShallow("baseline"),this.getShallow("padding"),this.getShallow("rich"),this.getShallow("truncateText"))}}},function(t,e,i){function n(t,e){e=e.split(",");for(var i=t,n=0;n<e.length&&(i=i&&i[e[n]],null!=i);n++);return i}function a(t,e,i,n){e=e.split(",");for(var a,o=t,r=0;r<e.length-1;r++)a=e[r],null==o[a]&&(o[a]={}),o=o[a];(n||null==o[e[r]])&&(o[e[r]]=i)}function o(t){c(l,function(e){e[0]in t&&!(e[1]in t)&&(t[e[1]]=t[e[0]])})}var r=i(1),s=i(153),l=[["x","left"],["y","top"],["x2","right"],["y2","bottom"]],u=["grid","geo","parallel","legend","toolbox","title","visualMap","dataZoom","timeline"],h=["bar","boxplot","candlestick","chord","effectScatter","funnel","gauge","lines","graph","heatmap","line","map","parallel","pie","radar","sankey","scatter","treemap"],c=r.each;t.exports=function(t,e){s(t,e);var i=t.series;c(r.isArray(i)?i:[i],function(t){if(r.isObject(t)){var e=t.type;if("pie"!==e&&"gauge"!==e||null!=t.clockWise&&(t.clockwise=t.clockWise),"gauge"===e){var i=n(t,"pointer.color");null!=i&&a(t,"itemStyle.normal.color",i)}for(var s=0;s<h.length;s++)if(h[s]===t.type){o(t);break}}}),t.dataRange&&(t.visualMap=t.dataRange),c(u,function(e){var i=t[e];i&&(r.isArray(i)||(i=[i]),c(i,function(t){o(t)}))})}},function(t,e,i){function n(t){var e=t&&t.itemStyle;if(e)for(var i=0,n=f.length;i<n;i++){var a=f[i],o=e.normal,r=e.emphasis;o&&o[a]&&(t[a]=t[a]||{},t[a].normal?u.merge(t[a].normal,o[a]):t[a].normal=o[a],o[a]=null),r&&r[a]&&(t[a]=t[a]||{},t[a].emphasis?u.merge(t[a].emphasis,r[a]):t[a].emphasis=r[a],r[a]=null)}}function a(t,e){var i=d(t)&&t[e],n=d(i)&&i.textStyle;if(n)for(var a=0,o=h.TEXT_STYLE_OPTIONS.length;a<o;a++){var e=h.TEXT_STYLE_OPTIONS[a];n.hasOwnProperty(e)&&(i[e]=n[e])}}function o(t){d(t)&&(a(t,"normal"),a(t,"emphasis"))}function r(t){if(d(t)){n(t),o(t.label),o(t.upperLabel),o(t.edgeLabel);var e=t.markPoint;n(e),o(e&&e.label);var i=t.markLine;n(t.markLine),o(i&&i.label);var r=t.markArea;o(r&&r.label),a(t,"axisLabel"),a(t,"title"),a(t,"detail");var s=t.data;if(s)for(var l=0;l<s.length;l++)n(s[l]),o(s[l]&&s[l].label);var e=t.markPoint;if(e&&e.data)for(var h=e.data,l=0;l<h.length;l++)n(h[l]),o(h[l]&&h[l].label);var i=t.markLine;if(i&&i.data)for(var c=i.data,l=0;l<c.length;l++)u.isArray(c[l])?(n(c[l][0]),o(c[l][0]&&c[l][0].label),n(c[l][1]),o(c[l][1]&&c[l][1].label)):(n(c[l]),o(c[l]&&c[l].label))}}function s(t){return u.isArray(t)?t:t?[t]:[]}function l(t){return(u.isArray(t)?t[0]:t)||{}}var u=i(1),h=i(5),c=u.each,d=u.isObject,f=["areaStyle","lineStyle","nodeStyle","linkStyle","chordStyle","label","labelLine"];t.exports=function(t,e){c(s(t.series),function(t){d(t)&&r(t)});var i=["xAxis","yAxis","radiusAxis","angleAxis","singleAxis","parallelAxis","radar"];e&&i.push("valueAxis","categoryAxis","logAxis","timeAxis"),c(i,function(e){c(s(t[e]),function(t){t&&(a(t,"axisLabel"),a(t.axisPointer,"label"))})}),c(s(t.parallel),function(t){var e=t&&t.parallelAxisDefault;a(e,"axisLabel"),a(e&&e.axisPointer,"label")}),c(s(t.calendar),function(t){a(t,"dayLabel"),a(t,"monthLabel"),a(t,"yearLabel")}),c(s(t.radar),function(t){a(t,"name")}),c(s(t.geo),function(t){d(t)&&(o(t.label),c(s(t.regions),function(t){o(t.label)}))}),o(l(t.timeline).label),a(l(t.axisPointer),"label"),a(l(t.tooltip).axisPointer,"label")}},function(t,e){var i={average:function(t){for(var e=0,i=0,n=0;n<t.length;n++)isNaN(t[n])||(e+=t[n],i++);return 0===i?NaN:e/i},sum:function(t){for(var e=0,i=0;i<t.length;i++)e+=t[i]||0;return e},max:function(t){for(var e=-(1/0),i=0;i<t.length;i++)t[i]>e&&(e=t[i]);return e},min:function(t){for(var e=1/0,i=0;i<t.length;i++)t[i]<e&&(e=t[i]);return e},nearest:function(t){return t[0]}},n=function(t,e){return Math.round(t.length/2)};t.exports=function(t,e,a){e.eachSeriesByType(t,function(t){var e=t.getData(),a=t.get("sampling"),o=t.coordinateSystem;if("cartesian2d"===o.type&&a){var r=o.getBaseAxis(),s=o.getOtherAxis(r),l=r.getExtent(),u=l[1]-l[0],h=Math.round(e.count()/u);if(h>1){var c;"string"==typeof a?c=i[a]:"function"==typeof a&&(c=a),c&&(e=e.downSample(s.dim,1/h,c,n),t.setData(e))}}},this)}},function(t,e,i){function n(t,e){return c(t,h(e))}var a=i(1),o=i(34),r=i(4),s=i(45),l=o.prototype,u=s.prototype,h=r.getPrecisionSafe,c=r.round,d=Math.floor,f=Math.ceil,p=Math.pow,g=Math.log,m=o.extend({type:"log",base:10,$constructor:function(){o.apply(this,arguments),this._originalScale=new s},getTicks:function(){var t=this._originalScale,e=this._extent,i=t.getExtent();return a.map(u.getTicks.call(this),function(a){var o=r.round(p(this.base,a));return o=a===e[0]&&t.__fixMin?n(o,i[0]):o,o=a===e[1]&&t.__fixMax?n(o,i[1]):o},this)},getLabel:u.getLabel,scale:function(t){return t=l.scale.call(this,t),p(this.base,t)},setExtent:function(t,e){var i=this.base;t=g(t)/g(i),e=g(e)/g(i),u.setExtent.call(this,t,e)},getExtent:function(){var t=this.base,e=l.getExtent.call(this);e[0]=p(t,e[0]),e[1]=p(t,e[1]);var i=this._originalScale,a=i.getExtent();return i.__fixMin&&(e[0]=n(e[0],a[0])),i.__fixMax&&(e[1]=n(e[1],a[1])),e},unionExtent:function(t){this._originalScale.unionExtent(t);var e=this.base;t[0]=g(t[0])/g(e),t[1]=g(t[1])/g(e),l.unionExtent.call(this,t)},unionExtentFromData:function(t,e){this.unionExtent(t.getDataExtent(e,!0,function(t){return t>0}))},niceTicks:function(t){t=t||10;var e=this._extent,i=e[1]-e[0];if(!(i===1/0||i<=0)){var n=r.quantity(i),a=t/i*n;for(a<=.5&&(n*=10);!isNaN(n)&&Math.abs(n)<1&&Math.abs(n)>0;)n*=10;var o=[r.round(f(e[0]/n)*n),r.round(d(e[1]/n)*n)];this._interval=n,this._niceExtent=o}},niceExtent:function(t){u.niceExtent.call(this,t);var e=this._originalScale;e.__fixMin=t.fixMin,e.__fixMax=t.fixMax}});a.each(["contain","normalize"],function(t){m.prototype[t]=function(e){return e=g(e)/g(this.base),l[t].call(this,e)}}),m.create=function(){return new m},t.exports=m},function(t,e,i){var n=i(1),a=i(34),o=a.prototype,r=a.extend({type:"ordinal",init:function(t,e){this._data=t,this._extent=e||[0,t.length-1]},parse:function(t){return"string"==typeof t?n.indexOf(this._data,t):Math.round(t)},contain:function(t){return t=this.parse(t),o.contain.call(this,t)&&null!=this._data[t]},normalize:function(t){return o.normalize.call(this,this.parse(t))},scale:function(t){return Math.round(o.scale.call(this,t))},getTicks:function(){for(var t=[],e=this._extent,i=e[0];i<=e[1];)t.push(i),i++;return t},getLabel:function(t){return this._data[t]},count:function(){return this._extent[1]-this._extent[0]+1},unionExtentFromData:function(t,e){this.unionExtent(t.getDataExtent(e,!1))},niceTicks:n.noop,niceExtent:n.noop});r.create=function(){return new r},t.exports=r},function(t,e,i){var n=i(1),a=i(4),o=i(7),r=i(67),s=i(45),l=s.prototype,u=Math.ceil,h=Math.floor,c=1e3,d=60*c,f=60*d,p=24*f,g=function(t,e,i,n){for(;i<n;){var a=i+n>>>1;t[a][2]<e?i=a+1:n=a}return i},m=s.extend({type:"time",getLabel:function(t){var e=this._stepLvl,i=new Date(t);return o.formatTime(e[0],i,this.getSetting("useUTC"))},niceExtent:function(t){var e=this._extent;if(e[0]===e[1]&&(e[0]-=p,e[1]+=p),e[1]===-(1/0)&&e[0]===1/0){var i=new Date;e[1]=+new Date(i.getFullYear(),i.getMonth(),i.getDate()),e[0]=e[1]-p}this.niceTicks(t.splitNumber,t.minInterval,t.maxInterval);var n=this._interval;t.fixMin||(e[0]=a.round(h(e[0]/n)*n)),t.fixMax||(e[1]=a.round(u(e[1]/n)*n))},niceTicks:function(t,e,i){t=t||10;var n=this._extent,o=n[1]-n[0],s=o/t;null!=e&&s<e&&(s=e),null!=i&&s>i&&(s=i);var l=v.length,c=g(v,s,0,l),d=v[Math.min(c,l-1)],f=d[2];if("year"===d[0]){var p=o/f,m=a.nice(p/t,!0);f*=m}var y=this.getSetting("useUTC")?0:60*new Date(+n[0]||+n[1]).getTimezoneOffset()*1e3,x=[Math.round(u((n[0]-y)/f)*f+y),Math.round(h((n[1]-y)/f)*f+y)];r.fixExtent(x,n),this._stepLvl=d,this._interval=f,this._niceExtent=x},parse:function(t){return+a.parseDate(t)}});n.each(["contain","normalize"],function(t){m.prototype[t]=function(e){return l[t].call(this,this.parse(e))}});var v=[["hh:mm:ss",1,c],["hh:mm:ss",5,5*c],["hh:mm:ss",10,10*c],["hh:mm:ss",15,15*c],["hh:mm:ss",30,30*c],["hh:mm\nMM-dd",1,d],["hh:mm\nMM-dd",5,5*d],["hh:mm\nMM-dd",10,10*d],["hh:mm\nMM-dd",15,15*d],["hh:mm\nMM-dd",30,30*d],["hh:mm\nMM-dd",1,f],["hh:mm\nMM-dd",2,2*f],["hh:mm\nMM-dd",6,6*f],["hh:mm\nMM-dd",12,12*f],["MM-dd\nyyyy",1,p],["week",7,7*p],["month",1,31*p],["quarter",3,380*p/4],["half-year",6,380*p/2],["year",1,380*p]];m.create=function(t){return new m({useUTC:t.ecModel.get("useUTC")})},t.exports=m},function(t,e,i){var n=i(39);t.exports=function(t){function e(e){var i=(e.visualColorAccessPath||"itemStyle.normal.color").split("."),a=e.getData(),o=e.get(i)||e.getColorFromPalette(e.get("name"));a.setVisual("color",o),t.isSeriesFiltered(e)||("function"!=typeof o||o instanceof n||a.each(function(t){a.setItemVisual(t,"color",o(e.getDataParams(t)))}),a.each(function(t){var e=a.getItemModel(t),n=e.get(i,!0);null!=n&&a.setItemVisual(t,"color",n)}))}t.eachRawSeries(e)}},function(t,e,i){"use strict";function n(t,e,i){return{type:t,event:i,target:e.target,topTarget:e.topTarget,cancelBubble:!1,offsetX:i.zrX,offsetY:i.zrY,gestureEvent:i.gestureEvent,pinchX:i.pinchX,pinchY:i.pinchY,pinchScale:i.pinchScale,wheelDelta:i.zrDelta,zrByTouch:i.zrByTouch,which:i.which}}function a(){}function o(t,e,i){if(t[t.rectHover?"rectContain":"contain"](e,i)){for(var n,a=t;a;){if(a.clipPath&&!a.clipPath.contain(e,i))return!1;a.silent&&(n=!0),a=a.parent}return!n||h}return!1}var r=i(1),s=i(6),l=i(185),u=i(23),h="silent";a.prototype.dispose=function(){};var c=["click","dblclick","mousewheel","mouseout","mouseup","mousedown","mousemove","contextmenu"],d=function(t,e,i,n){u.call(this),this.storage=t,this.painter=e,this.painterRoot=n,i=i||new a,this.proxy=i,i.handler=this,this._hovered={},this._lastTouchMoment,this._lastX,this._lastY,l.call(this),r.each(c,function(t){i.on&&i.on(t,this[t],this)},this)};d.prototype={constructor:d,mousemove:function(t){var e=t.zrX,i=t.zrY,n=this._hovered,a=n.target;a&&!a.__zr&&(n=this.findHover(n.x,n.y),a=n.target);var o=this._hovered=this.findHover(e,i),r=o.target,s=this.proxy;s.setCursor&&s.setCursor(r?r.cursor:"default"),a&&r!==a&&this.dispatchToElement(n,"mouseout",t),this.dispatchToElement(o,"mousemove",t),r&&r!==a&&this.dispatchToElement(o,"mouseover",t)},mouseout:function(t){this.dispatchToElement(this._hovered,"mouseout",t);var e,i=t.toElement||t.relatedTarget;do i=i&&i.parentNode;while(i&&9!=i.nodeType&&!(e=i===this.painterRoot));!e&&this.trigger("globalout",{event:t})},resize:function(t){this._hovered={}},dispatch:function(t,e){var i=this[t];i&&i.call(this,e)},dispose:function(){this.proxy.dispose(),this.storage=this.proxy=this.painter=null},setCursorStyle:function(t){var e=this.proxy;e.setCursor&&e.setCursor(t)},dispatchToElement:function(t,e,i){t=t||{};var a=t.target;if(!a||!a.silent){for(var o="on"+e,r=n(e,t,i);a&&(a[o]&&(r.cancelBubble=a[o].call(a,r)),a.trigger(e,r),a=a.parent,!r.cancelBubble););r.cancelBubble||(this.trigger(e,r),this.painter&&this.painter.eachOtherLayer(function(t){"function"==typeof t[o]&&t[o].call(t,r),t.trigger&&t.trigger(e,r)}))}},findHover:function(t,e,i){for(var n=this.storage.getDisplayList(),a={x:t,y:e},r=n.length-1;r>=0;r--){var s;if(n[r]!==i&&!n[r].ignore&&(s=o(n[r],t,e))&&(!a.topTarget&&(a.topTarget=n[r]),s!==h)){a.target=n[r];break}}return a}},r.each(["click","mousedown","mouseup","mousewheel","dblclick","contextmenu"],function(t){d.prototype[t]=function(e){var i=this.findHover(e.zrX,e.zrY),n=i.target;if("mousedown"===t)this._downEl=n,this._downPoint=[e.zrX,e.zrY],this._upEl=n;else if("mosueup"===t)this._upEl=n;else if("click"===t){if(this._downEl!==this._upEl||!this._downPoint||s.dist(this._downPoint,[e.zrX,e.zrY])>4)return;this._downPoint=null}this.dispatchToElement(i,t,e)}}),r.mixin(d,u),r.mixin(d,l),t.exports=d},function(t,e,i){function n(){return!1}function a(t,e,i,n){var a=document.createElement(e),o=i.getWidth(),r=i.getHeight(),s=a.style;return s.position="absolute",s.left=0,s.top=0,s.width=o+"px",s.height=r+"px",a.width=o*n,a.height=r*n,a.setAttribute("data-zr-dom-id",t),a}var o=i(1),r=i(35),s=i(76),l=i(75),u=function(t,e,i){var s;i=i||r.devicePixelRatio,"string"==typeof t?s=a(t,"canvas",e,i):o.isObject(t)&&(s=t,t=s.id),this.id=t,this.dom=s;var l=s.style;l&&(s.onselectstart=n,l["-webkit-user-select"]="none",l["user-select"]="none",l["-webkit-touch-callout"]="none",l["-webkit-tap-highlight-color"]="rgba(0,0,0,0)",l.padding=0,l.margin=0,l["border-width"]=0),this.domBack=null,this.ctxBack=null,this.painter=e,this.config=null,this.clearColor=0,this.motionBlur=!1,this.lastFrameAlpha=.7,this.dpr=i};u.prototype={constructor:u,elCount:0,__dirty:!0,initContext:function(){this.ctx=this.dom.getContext("2d"),this.ctx.__currentValues={},this.ctx.dpr=this.dpr},createBackBuffer:function(){var t=this.dpr;this.domBack=a("back-"+this.id,"canvas",this.painter,t),this.ctxBack=this.domBack.getContext("2d"),this.ctxBack.__currentValues={},1!=t&&this.ctxBack.scale(t,t)},resize:function(t,e){var i=this.dpr,n=this.dom,a=n.style,o=this.domBack;a.width=t+"px",a.height=e+"px",n.width=t*i,n.height=e*i,o&&(o.width=t*i,o.height=e*i,1!=i&&this.ctxBack.scale(i,i))},clear:function(t){var e=this.dom,i=this.ctx,n=e.width,a=e.height,o=this.clearColor,r=this.motionBlur&&!t,u=this.lastFrameAlpha,h=this.dpr;if(r&&(this.domBack||this.createBackBuffer(),this.ctxBack.globalCompositeOperation="copy",this.ctxBack.drawImage(e,0,0,n/h,a/h)),i.clearRect(0,0,n,a),o){var c;o.colorStops?(c=o.__canvasGradient||s.getGradient(i,o,{x:0,y:0,width:n,height:a}),o.__canvasGradient=c):o.image&&(c=l.prototype.getCanvasPattern.call(o,i)),i.save(),i.fillStyle=c||o,i.fillRect(0,0,n,a),i.restore()}if(r){var d=this.domBack;i.save(),i.globalAlpha=u,i.drawImage(d,0,0,n,a),i.restore()}}},t.exports=u},function(t,e,i){"use strict";function n(t){return parseInt(t,10)}function a(t){return!!t&&(!!t.__builtin__||"function"==typeof t.resize&&"function"==typeof t.refresh)}function o(t){t.__unusedCount++}function r(t){1==t.__unusedCount&&t.clear()}function s(t,e,i){return x.copy(t.getBoundingRect()),t.transform&&x.applyTransform(t.transform),_.width=e,_.height=i,!x.intersect(_)}function l(t,e){if(t==e)return!1;if(!t||!e||t.length!==e.length)return!0;for(var i=0;i<t.length;i++)if(t[i]!==e[i])return!0}function u(t,e){for(var i=0;i<t.length;i++){var n=t[i];n.setTransform(e),e.beginPath(),n.buildPath(e,n.shape),e.clip(),n.restoreTransform(e)}}function h(t,e){var i=document.createElement("div");return i.style.cssText=["position:relative","overflow:hidden","width:"+t+"px","height:"+e+"px","padding:0","margin:0","border-width:0"].join(";")+";",i}var c=i(35),d=i(1),f=i(54),p=i(12),g=i(52),m=i(160),v=i(71),y=5,x=new p(0,0,0,0),_=new p(0,0,0,0),b=function(t,e,i){this.type="canvas";var n=!t.nodeName||"CANVAS"===t.nodeName.toUpperCase();this._opts=i=d.extend({},i||{}),this.dpr=i.devicePixelRatio||c.devicePixelRatio,this._singleCanvas=n,this.root=t;var a=t.style;a&&(a["-webkit-tap-highlight-color"]="transparent",a["-webkit-user-select"]=a["user-select"]=a["-webkit-touch-callout"]="none",t.innerHTML=""),this.storage=e;var o=this._zlevelList=[],r=this._layers={};if(this._layerConfig={},n){null!=i.width&&(t.width=i.width),null!=i.height&&(t.height=i.height);var s=t.width,l=t.height;this._width=s,this._height=l;var u=new m(t,this,1);u.initContext(),r[0]=u,o.push(0),this._domRoot=t}else{this._width=this._getSize(0),this._height=this._getSize(1);var f=this._domRoot=h(this._width,this._height);t.appendChild(f)}this._progressiveLayers=[],this._hoverlayer,this._hoverElements=[]};b.prototype={constructor:b,getType:function(){return"canvas"},isSingleCanvas:function(){return this._singleCanvas},getViewportRoot:function(){return this._domRoot},getViewportRootOffset:function(){var t=this.getViewportRoot();if(t)return{offsetLeft:t.offsetLeft||0,offsetTop:t.offsetTop||0}},refresh:function(t){var e=this.storage.getDisplayList(!0),i=this._zlevelList;this._paintList(e,t);for(var n=0;n<i.length;n++){var a=i[n],o=this._layers[a];!o.__builtin__&&o.refresh&&o.refresh()}return this.refreshHover(),this._progressiveLayers.length&&this._startProgessive(),this},addHover:function(t,e){if(!t.__hoverMir){var i=new t.constructor({style:t.style,shape:t.shape});i.__from=t,t.__hoverMir=i,i.setStyle(e),this._hoverElements.push(i)}},removeHover:function(t){var e=t.__hoverMir,i=this._hoverElements,n=d.indexOf(i,e);n>=0&&i.splice(n,1),t.__hoverMir=null},clearHover:function(t){for(var e=this._hoverElements,i=0;i<e.length;i++){var n=e[i].__from;n&&(n.__hoverMir=null)}e.length=0},refreshHover:function(){var t=this._hoverElements,e=t.length,i=this._hoverlayer;if(i&&i.clear(),e){g(t,this.storage.displayableSortFunc),i||(i=this._hoverlayer=this.getLayer(1e5));var n={};i.ctx.save();for(var a=0;a<e;){var o=t[a],r=o.__from;r&&r.__zr?(a++,r.invisible||(o.transform=r.transform,o.invTransform=r.invTransform,o.__clipPaths=r.__clipPaths,this._doPaintEl(o,i,!0,n))):(t.splice(a,1),r.__hoverMir=null,e--)}i.ctx.restore()}},_startProgessive:function(){function t(){i===e._progressiveToken&&e.storage&&(e._doPaintList(e.storage.getDisplayList()),e._furtherProgressive?(e._progress++,v(t)):e._progressiveToken=-1)}var e=this;if(e._furtherProgressive){var i=e._progressiveToken=+new Date;e._progress++,v(t)}},_clearProgressive:function(){this._progressiveToken=-1,this._progress=0,d.each(this._progressiveLayers,function(t){t.__dirty&&t.clear()})},_paintList:function(t,e){
null==e&&(e=!1),this._updateLayerStatus(t),this._clearProgressive(),this.eachBuiltinLayer(o),this._doPaintList(t,e),this.eachBuiltinLayer(r)},_doPaintList:function(t,e){function i(t){var e=o.dpr||1;o.save(),o.globalAlpha=1,o.shadowBlur=0,n.__dirty=!0,o.setTransform(1,0,0,1,0,0),o.drawImage(t.dom,0,0,h*e,c*e),o.restore()}for(var n,a,o,r,s,l,u=0,h=this._width,c=this._height,p=this._progress,g=0,m=t.length;g<m;g++){var v=t[g],x=this._singleCanvas?0:v.zlevel,_=v.__frame;if(_<0&&s&&(i(s),s=null),a!==x&&(o&&o.restore(),r={},a=x,n=this.getLayer(a),n.__builtin__||f("ZLevel "+a+" has been used by unkown layer "+n.id),o=n.ctx,o.save(),n.__unusedCount=0,(n.__dirty||e)&&n.clear()),n.__dirty||e){if(_>=0){if(!s){if(s=this._progressiveLayers[Math.min(u++,y-1)],s.ctx.save(),s.renderScope={},s&&s.__progress>s.__maxProgress){g=s.__nextIdxNotProg-1;continue}l=s.__progress,s.__dirty||(p=l),s.__progress=p+1}_===p&&this._doPaintEl(v,s,!0,s.renderScope)}else this._doPaintEl(v,n,e,r);v.__dirty=!1}}s&&i(s),o&&o.restore(),this._furtherProgressive=!1,d.each(this._progressiveLayers,function(t){t.__maxProgress>=t.__progress&&(this._furtherProgressive=!0)},this)},_doPaintEl:function(t,e,i,n){var a=e.ctx,o=t.transform;if((e.__dirty||i)&&!t.invisible&&0!==t.style.opacity&&(!o||o[0]||o[3])&&(!t.culling||!s(t,this._width,this._height))){var r=t.__clipPaths;(n.prevClipLayer!==e||l(r,n.prevElClipPaths))&&(n.prevElClipPaths&&(n.prevClipLayer.ctx.restore(),n.prevClipLayer=n.prevElClipPaths=null,n.prevEl=null),r&&(a.save(),u(r,a),n.prevClipLayer=e,n.prevElClipPaths=r)),t.beforeBrush&&t.beforeBrush(a),t.brush(a,n.prevEl||null),n.prevEl=t,t.afterBrush&&t.afterBrush(a)}},getLayer:function(t){if(this._singleCanvas)return this._layers[0];var e=this._layers[t];return e||(e=new m("zr_"+t,this,this.dpr),e.__builtin__=!0,this._layerConfig[t]&&d.merge(e,this._layerConfig[t],!0),this.insertLayer(t,e),e.initContext()),e},insertLayer:function(t,e){var i=this._layers,n=this._zlevelList,o=n.length,r=null,s=-1,l=this._domRoot;if(i[t])return void f("ZLevel "+t+" has been used already");if(!a(e))return void f("Layer of zlevel "+t+" is not valid");if(o>0&&t>n[0]){for(s=0;s<o-1&&!(n[s]<t&&n[s+1]>t);s++);r=i[n[s]]}if(n.splice(s+1,0,t),i[t]=e,!e.virtual)if(r){var u=r.dom;u.nextSibling?l.insertBefore(e.dom,u.nextSibling):l.appendChild(e.dom)}else l.firstChild?l.insertBefore(e.dom,l.firstChild):l.appendChild(e.dom)},eachLayer:function(t,e){var i,n,a=this._zlevelList;for(n=0;n<a.length;n++)i=a[n],t.call(e,this._layers[i],i)},eachBuiltinLayer:function(t,e){var i,n,a,o=this._zlevelList;for(a=0;a<o.length;a++)n=o[a],i=this._layers[n],i.__builtin__&&t.call(e,i,n)},eachOtherLayer:function(t,e){var i,n,a,o=this._zlevelList;for(a=0;a<o.length;a++)n=o[a],i=this._layers[n],i.__builtin__||t.call(e,i,n)},getLayers:function(){return this._layers},_updateLayerStatus:function(t){var e=this._layers,i=this._progressiveLayers,n={},a={};this.eachBuiltinLayer(function(t,e){n[e]=t.elCount,t.elCount=0,t.__dirty=!1}),d.each(i,function(t,e){a[e]=t.elCount,t.elCount=0,t.__dirty=!1});for(var o,r,s=0,l=0,u=0,h=t.length;u<h;u++){var c=t[u],f=this._singleCanvas?0:c.zlevel,p=e[f],g=c.progressive;if(p&&(p.elCount++,p.__dirty=p.__dirty||c.__dirty),g>=0){r!==g&&(r=g,l++);var v=c.__frame=l-1;if(!o){var x=Math.min(s,y-1);o=i[x],o||(o=i[x]=new m("progressive",this,this.dpr),o.initContext()),o.__maxProgress=0}o.__dirty=o.__dirty||c.__dirty,o.elCount++,o.__maxProgress=Math.max(o.__maxProgress,v),o.__maxProgress>=o.__progress&&(p.__dirty=!0)}else c.__frame=-1,o&&(o.__nextIdxNotProg=u,s++,o=null)}o&&(s++,o.__nextIdxNotProg=u),this.eachBuiltinLayer(function(t,e){n[e]!==t.elCount&&(t.__dirty=!0)}),i.length=Math.min(s,y),d.each(i,function(t,e){a[e]!==t.elCount&&(c.__dirty=!0),t.__dirty&&(t.__progress=0)})},clear:function(){return this.eachBuiltinLayer(this._clearLayer),this},_clearLayer:function(t){t.clear()},configLayer:function(t,e){if(e){var i=this._layerConfig;i[t]?d.merge(i[t],e,!0):i[t]=e;var n=this._layers[t];n&&d.merge(n,i[t],!0)}},delLayer:function(t){var e=this._layers,i=this._zlevelList,n=e[t];n&&(n.dom.parentNode.removeChild(n.dom),delete e[t],i.splice(d.indexOf(i,t),1))},resize:function(t,e){var i=this._domRoot;i.style.display="none";var n=this._opts;if(null!=t&&(n.width=t),null!=e&&(n.height=e),t=this._getSize(0),e=this._getSize(1),i.style.display="",this._width!=t||e!=this._height){i.style.width=t+"px",i.style.height=e+"px";for(var a in this._layers)this._layers.hasOwnProperty(a)&&this._layers[a].resize(t,e);d.each(this._progressiveLayers,function(i){i.resize(t,e)}),this.refresh(!0)}return this._width=t,this._height=e,this},clearLayer:function(t){var e=this._layers[t];e&&e.clear()},dispose:function(){this.root.innerHTML="",this.root=this.storage=this._domRoot=this._layers=null},getRenderedCanvas:function(t){function e(t,e){var n=r._zlevelList;null==t&&(t=-(1/0));for(var a,o=0;o<n.length;o++){var s=n[o],l=r._layers[s];if(!l.__builtin__&&s>t&&s<e){a=l;break}}a&&a.renderToCanvas&&(i.ctx.save(),a.renderToCanvas(i.ctx),i.ctx.restore())}if(t=t||{},this._singleCanvas)return this._layers[0].dom;var i=new m("image",this,t.pixelRatio||this.dpr);i.initContext(),i.clearColor=t.backgroundColor,i.clear();for(var n,a=this.storage.getDisplayList(!0),o={},r=this,s=0;s<a.length;s++){var l=a[s];l.zlevel!==n&&(e(n,l.zlevel),n=l.zlevel),this._doPaintEl(l,i,!0,o)}return e(n,1/0),i.dom},getWidth:function(){return this._width},getHeight:function(){return this._height},_getSize:function(t){var e=this._opts,i=["width","height"][t],a=["clientWidth","clientHeight"][t],o=["paddingLeft","paddingTop"][t],r=["paddingRight","paddingBottom"][t];if(null!=e[i]&&"auto"!==e[i])return parseFloat(e[i]);var s=this.root,l=document.defaultView.getComputedStyle(s);return(s[a]||n(l[i])||n(s.style[i]))-(n(l[o])||0)-(n(l[r])||0)|0},pathToImage:function(t,e){e=e||this.dpr;var n=document.createElement("canvas"),a=n.getContext("2d"),o=t.getBoundingRect(),r=t.style,s=r.shadowBlur,l=r.shadowOffsetX,u=r.shadowOffsetY,h=r.hasStroke()?r.lineWidth:0,c=Math.max(h/2,-l+s),d=Math.max(h/2,l+s),f=Math.max(h/2,-u+s),p=Math.max(h/2,u+s),g=o.width+c+d,m=o.height+f+p;n.width=g*e,n.height=m*e,a.scale(e,e),a.clearRect(0,0,g,m),a.dpr=e;var v={position:t.position,rotation:t.rotation,scale:t.scale};t.position=[c-o.x,f-o.y],t.rotation=0,t.scale=[1,1],t.updateTransform(),t&&t.brush(a);var y=i(55),x=new y({style:{x:0,y:0,image:n}});return null!=v.position&&(x.position=t.position=v.position),null!=v.rotation&&(x.rotation=t.rotation=v.rotation),null!=v.scale&&(x.scale=t.scale=v.scale),x}},t.exports=b},function(t,e,i){"use strict";function n(t,e){return t.zlevel===e.zlevel?t.z===e.z?t.z2-e.z2:t.z-e.z:t.zlevel-e.zlevel}var a=i(1),o=i(10),r=i(36),s=i(52),l=function(){this._roots=[],this._displayList=[],this._displayListLen=0};l.prototype={constructor:l,traverse:function(t,e){for(var i=0;i<this._roots.length;i++)this._roots[i].traverse(t,e)},getDisplayList:function(t,e){return e=e||!1,t&&this.updateDisplayList(e),this._displayList},updateDisplayList:function(t){this._displayListLen=0;for(var e=this._roots,i=this._displayList,a=0,r=e.length;a<r;a++)this._updateAndAddDisplayable(e[a],null,t);i.length=this._displayListLen,o.canvasSupported&&s(i,n)},_updateAndAddDisplayable:function(t,e,i){if(!t.ignore||i){t.beforeUpdate(),t.__dirty&&t.update(),t.afterUpdate();var n=t.clipPath;if(n){e=e?e.slice():[];for(var a=n,o=t;a;)a.parent=o,a.updateTransform(),e.push(a),o=a,a=a.clipPath}if(t.isGroup){for(var r=t._children,s=0;s<r.length;s++){var l=r[s];t.__dirty&&(l.__dirty=!0),this._updateAndAddDisplayable(l,e,i)}t.__dirty=!1}else t.__clipPaths=e,this._displayList[this._displayListLen++]=t}},addRoot:function(t){t.__storage!==this&&(t instanceof r&&t.addChildrenToStorage(this),this.addToStorage(t),this._roots.push(t))},delRoot:function(t){if(null==t){for(var e=0;e<this._roots.length;e++){var i=this._roots[e];i instanceof r&&i.delChildrenFromStorage(this)}return this._roots=[],this._displayList=[],void(this._displayListLen=0)}if(t instanceof Array)for(var e=0,n=t.length;e<n;e++)this.delRoot(t[e]);else{var o=a.indexOf(this._roots,t);o>=0&&(this.delFromStorage(t),this._roots.splice(o,1),t instanceof r&&t.delChildrenFromStorage(this))}},addToStorage:function(t){return t.__storage=this,t.dirty(!1),this},delFromStorage:function(t){return t&&(t.__storage=null),this},dispose:function(){this._renderList=this._roots=null},displayableSortFunc:n},t.exports=l},function(t,e,i){"use strict";var n=i(1),a=i(21).Dispatcher,o=i(71),r=i(70),s=function(t){t=t||{},this.stage=t.stage||{},this.onframe=t.onframe||function(){},this._clips=[],this._running=!1,this._time,this._pausedTime,this._pauseStart,this._paused=!1,a.call(this)};s.prototype={constructor:s,addClip:function(t){this._clips.push(t)},addAnimator:function(t){t.animation=this;for(var e=t.getClips(),i=0;i<e.length;i++)this.addClip(e[i])},removeClip:function(t){var e=n.indexOf(this._clips,t);e>=0&&this._clips.splice(e,1)},removeAnimator:function(t){for(var e=t.getClips(),i=0;i<e.length;i++)this.removeClip(e[i]);t.animation=null},_update:function(){for(var t=(new Date).getTime()-this._pausedTime,e=t-this._time,i=this._clips,n=i.length,a=[],o=[],r=0;r<n;r++){var s=i[r],l=s.step(t,e);l&&(a.push(l),o.push(s))}for(var r=0;r<n;)i[r]._needsRemove?(i[r]=i[n-1],i.pop(),n--):r++;n=a.length;for(var r=0;r<n;r++)o[r].fire(a[r]);this._time=t,this.onframe(e),this.trigger("frame",e),this.stage.update&&this.stage.update()},_startLoop:function(){function t(){e._running&&(o(t),!e._paused&&e._update())}var e=this;this._running=!0,o(t)},start:function(){this._time=(new Date).getTime(),this._pausedTime=0,this._startLoop()},stop:function(){this._running=!1},pause:function(){this._paused||(this._pauseStart=(new Date).getTime(),this._paused=!0)},resume:function(){this._paused&&(this._pausedTime+=(new Date).getTime()-this._pauseStart,this._paused=!1)},clear:function(){this._clips=[]},animate:function(t,e){e=e||{};var i=new r(t,e.loop,e.getter,e.setter);return this.addAnimator(i),i}},n.mixin(s,a),t.exports=s},function(t,e,i){function n(t){this._target=t.target,this._life=t.life||1e3,this._delay=t.delay||0,this._initialized=!1,this.loop=null!=t.loop&&t.loop,this.gap=t.gap||0,this.easing=t.easing||"Linear",this.onframe=t.onframe,this.ondestroy=t.ondestroy,this.onrestart=t.onrestart,this._pausedTime=0,this._paused=!1}var a=i(165);n.prototype={constructor:n,step:function(t,e){if(this._initialized||(this._startTime=t+this._delay,this._initialized=!0),this._paused)return void(this._pausedTime+=e);var i=(t-this._startTime-this._pausedTime)/this._life;if(!(i<0)){i=Math.min(i,1);var n=this.easing,o="string"==typeof n?a[n]:n,r="function"==typeof o?o(i):i;return this.fire("frame",r),1==i?this.loop?(this.restart(t),"restart"):(this._needsRemove=!0,"destroy"):null}},restart:function(t){var e=(t-this._startTime-this._pausedTime)%this._life;this._startTime=t-e+this.gap,this._pausedTime=0,this._needsRemove=!1},fire:function(t,e){t="on"+t,this[t]&&this[t](this._target,e)},pause:function(){this._paused=!0},resume:function(){this._paused=!1}},t.exports=n},function(t,e){var i={linear:function(t){return t},quadraticIn:function(t){return t*t},quadraticOut:function(t){return t*(2-t)},quadraticInOut:function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)},cubicIn:function(t){return t*t*t},cubicOut:function(t){return--t*t*t+1},cubicInOut:function(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},quarticIn:function(t){return t*t*t*t},quarticOut:function(t){return 1- --t*t*t*t},quarticInOut:function(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)},quinticIn:function(t){return t*t*t*t*t},quinticOut:function(t){return--t*t*t*t*t+1},quinticInOut:function(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},sinusoidalIn:function(t){return 1-Math.cos(t*Math.PI/2)},sinusoidalOut:function(t){return Math.sin(t*Math.PI/2)},sinusoidalInOut:function(t){return.5*(1-Math.cos(Math.PI*t))},exponentialIn:function(t){return 0===t?0:Math.pow(1024,t-1)},exponentialOut:function(t){return 1===t?1:1-Math.pow(2,-10*t)},exponentialInOut:function(t){return 0===t?0:1===t?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(-Math.pow(2,-10*(t-1))+2)},circularIn:function(t){return 1-Math.sqrt(1-t*t)},circularOut:function(t){return Math.sqrt(1- --t*t)},circularInOut:function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},elasticIn:function(t){var e,i=.1,n=.4;return 0===t?0:1===t?1:(!i||i<1?(i=1,e=n/4):e=n*Math.asin(1/i)/(2*Math.PI),-(i*Math.pow(2,10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/n)))},elasticOut:function(t){var e,i=.1,n=.4;return 0===t?0:1===t?1:(!i||i<1?(i=1,e=n/4):e=n*Math.asin(1/i)/(2*Math.PI),i*Math.pow(2,-10*t)*Math.sin((t-e)*(2*Math.PI)/n)+1)},elasticInOut:function(t){var e,i=.1,n=.4;return 0===t?0:1===t?1:(!i||i<1?(i=1,e=n/4):e=n*Math.asin(1/i)/(2*Math.PI),(t*=2)<1?-.5*(i*Math.pow(2,10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/n)):i*Math.pow(2,-10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/n)*.5+1)},backIn:function(t){var e=1.70158;return t*t*((e+1)*t-e)},backOut:function(t){var e=1.70158;return--t*t*((e+1)*t+e)+1},backInOut:function(t){var e=2.5949095;return(t*=2)<1?.5*(t*t*((e+1)*t-e)):.5*((t-=2)*t*((e+1)*t+e)+2)},bounceIn:function(t){return 1-i.bounceOut(1-t)},bounceOut:function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},bounceInOut:function(t){return t<.5?.5*i.bounceIn(2*t):.5*i.bounceOut(2*t-1)+.5}};t.exports=i},function(t,e,i){var n=i(72).normalizeRadian,a=2*Math.PI;t.exports={containStroke:function(t,e,i,o,r,s,l,u,h){if(0===l)return!1;var c=l;u-=t,h-=e;var d=Math.sqrt(u*u+h*h);if(d-c>i||d+c<i)return!1;if(Math.abs(o-r)%a<1e-4)return!0;if(s){var f=o;o=n(r),r=n(f)}else o=n(o),r=n(r);o>r&&(r+=a);var p=Math.atan2(h,u);return p<0&&(p+=a),p>=o&&p<=r||p+a>=o&&p+a<=r}}},function(t,e,i){var n=i(20);t.exports={containStroke:function(t,e,i,a,o,r,s,l,u,h,c){if(0===u)return!1;var d=u;if(c>e+d&&c>a+d&&c>r+d&&c>l+d||c<e-d&&c<a-d&&c<r-d&&c<l-d||h>t+d&&h>i+d&&h>o+d&&h>s+d||h<t-d&&h<i-d&&h<o-d&&h<s-d)return!1;var f=n.cubicProjectPoint(t,e,i,a,o,r,s,l,h,c,null);return f<=d/2}}},function(t,e,i){"use strict";function n(t,e){return Math.abs(t-e)<x}function a(){var t=b[0];b[0]=b[1],b[1]=t}function o(t,e,i,n,o,r,s,l,u,h){if(h>e&&h>n&&h>r&&h>l||h<e&&h<n&&h<r&&h<l)return 0;var c=g.cubicRootAt(e,n,r,l,h,_);if(0===c)return 0;for(var d,f,p=0,m=-1,v=0;v<c;v++){var y=_[v],x=0===y||1===y?.5:1,w=g.cubicAt(t,i,o,s,y);w<u||(m<0&&(m=g.cubicExtrema(e,n,r,l,b),b[1]<b[0]&&m>1&&a(),d=g.cubicAt(e,n,r,l,b[0]),m>1&&(f=g.cubicAt(e,n,r,l,b[1]))),p+=2==m?y<b[0]?d<e?x:-x:y<b[1]?f<d?x:-x:l<f?x:-x:y<b[0]?d<e?x:-x:l<d?x:-x)}return p}function r(t,e,i,n,a,o,r,s){if(s>e&&s>n&&s>o||s<e&&s<n&&s<o)return 0;var l=g.quadraticRootAt(e,n,o,s,_);if(0===l)return 0;var u=g.quadraticExtremum(e,n,o);if(u>=0&&u<=1){for(var h=0,c=g.quadraticAt(e,n,o,u),d=0;d<l;d++){var f=0===_[d]||1===_[d]?.5:1,p=g.quadraticAt(t,i,a,_[d]);p<r||(h+=_[d]<u?c<e?f:-f:o<c?f:-f)}return h}var f=0===_[0]||1===_[0]?.5:1,p=g.quadraticAt(t,i,a,_[0]);return p<r?0:o<e?f:-f}function s(t,e,i,n,a,o,r,s){if(s-=e,s>i||s<-i)return 0;var l=Math.sqrt(i*i-s*s);_[0]=-l,_[1]=l;var u=Math.abs(n-a);if(u<1e-4)return 0;if(u%y<1e-4){n=0,a=y;var h=o?1:-1;return r>=_[0]+t&&r<=_[1]+t?h:0}if(o){var l=n;n=p(a),a=p(l)}else n=p(n),a=p(a);n>a&&(a+=y);for(var c=0,d=0;d<2;d++){var f=_[d];if(f+t>r){var g=Math.atan2(s,f),h=o?1:-1;g<0&&(g=y+g),(g>=n&&g<=a||g+y>=n&&g+y<=a)&&(g>Math.PI/2&&g<1.5*Math.PI&&(h=-h),c+=h)}}return c}function l(t,e,i,a,l){for(var h=0,p=0,g=0,y=0,x=0,_=0;_<t.length;){var b=t[_++];switch(b===u.M&&_>1&&(i||(h+=m(p,g,y,x,a,l))),1==_&&(p=t[_],g=t[_+1],y=p,x=g),b){case u.M:y=t[_++],x=t[_++],p=y,g=x;break;case u.L:if(i){if(v(p,g,t[_],t[_+1],e,a,l))return!0}else h+=m(p,g,t[_],t[_+1],a,l)||0;p=t[_++],g=t[_++];break;case u.C:if(i){if(c.containStroke(p,g,t[_++],t[_++],t[_++],t[_++],t[_],t[_+1],e,a,l))return!0}else h+=o(p,g,t[_++],t[_++],t[_++],t[_++],t[_],t[_+1],a,l)||0;p=t[_++],g=t[_++];break;case u.Q:if(i){if(d.containStroke(p,g,t[_++],t[_++],t[_],t[_+1],e,a,l))return!0}else h+=r(p,g,t[_++],t[_++],t[_],t[_+1],a,l)||0;p=t[_++],g=t[_++];break;case u.A:var w=t[_++],S=t[_++],M=t[_++],I=t[_++],T=t[_++],A=t[_++],C=(t[_++],1-t[_++]),L=Math.cos(T)*M+w,D=Math.sin(T)*I+S;_>1?h+=m(p,g,L,D,a,l):(y=L,x=D);var P=(a-w)*I/M+w;if(i){if(f.containStroke(w,S,I,T,T+A,C,e,P,l))return!0}else h+=s(w,S,I,T,T+A,C,P,l);p=Math.cos(T+A)*M+w,g=Math.sin(T+A)*I+S;break;case u.R:y=p=t[_++],x=g=t[_++];var k=t[_++],O=t[_++],L=y+k,D=x+O;if(i){if(v(y,x,L,x,e,a,l)||v(L,x,L,D,e,a,l)||v(L,D,y,D,e,a,l)||v(y,D,y,x,e,a,l))return!0}else h+=m(L,x,L,D,a,l),h+=m(y,D,y,x,a,l);break;case u.Z:if(i){if(v(p,g,y,x,e,a,l))return!0}else h+=m(p,g,y,x,a,l);p=y,g=x}}return i||n(g,x)||(h+=m(p,g,y,x,a,l)||0),0!==h}var u=i(27).CMD,h=i(102),c=i(167),d=i(103),f=i(166),p=i(72).normalizeRadian,g=i(20),m=i(104),v=h.containStroke,y=2*Math.PI,x=1e-4,_=[-1,-1,-1],b=[-1,-1];t.exports={contain:function(t,e,i){return l(t,0,!1,e,i)},containStroke:function(t,e,i,n){return l(t,e,!0,i,n)}}},function(t,e,i){"use strict";function n(t){var e=t[1][0]-t[0][0],i=t[1][1]-t[0][1];return Math.sqrt(e*e+i*i)}function a(t){return[(t[0][0]+t[1][0])/2,(t[0][1]+t[1][1])/2]}var o=i(21),r=function(){this._track=[]};r.prototype={constructor:r,recognize:function(t,e,i){return this._doTrack(t,e,i),this._recognize(t)},clear:function(){return this._track.length=0,this},_doTrack:function(t,e,i){var n=t.touches;if(n){for(var a={points:[],touches:[],target:e,event:t},r=0,s=n.length;r<s;r++){var l=n[r],u=o.clientToLocal(i,l,{});a.points.push([u.zrX,u.zrY]),a.touches.push(l)}this._track.push(a)}},_recognize:function(t){for(var e in s)if(s.hasOwnProperty(e)){var i=s[e](this._track,t);if(i)return i}}};var s={pinch:function(t,e){var i=t.length;if(i){var o=(t[i-1]||{}).points,r=(t[i-2]||{}).points||o;if(r&&r.length>1&&o&&o.length>1){var s=n(o)/n(r);!isFinite(s)&&(s=1),e.pinchScale=s;var l=a(o);return e.pinchX=l[0],e.pinchY=l[1],{type:"pinch",target:t[0].target,event:e}}}}};t.exports=r},function(t,e,i){function n(t){return"mousewheel"===t&&d.browser.firefox?"DOMMouseScroll":t}function a(t,e,i){var n=t._gestureMgr;"start"===i&&n.clear();var a=n.recognize(e,t.handler.findHover(e.zrX,e.zrY,null).target,t.dom);if("end"===i&&n.clear(),a){var o=a.type;e.gestureEvent=o,t.handler.dispatchToElement({target:a.target},o,a.event)}}function o(t){t._touching=!0,clearTimeout(t._touchTimer),t._touchTimer=setTimeout(function(){t._touching=!1},700)}function r(t){var e=t.pointerType;return"pen"===e||"touch"===e}function s(t){function e(t,e){return function(){if(!e._touching)return t.apply(e,arguments)}}h.each(x,function(e){t._handlers[e]=h.bind(w[e],t)}),h.each(b,function(e){t._handlers[e]=h.bind(w[e],t)}),h.each(y,function(i){t._handlers[i]=e(w[i],t)})}function l(t){function e(e,i){h.each(e,function(e){p(t,n(e),i._handlers[e])},i)}c.call(this),this.dom=t,this._touching=!1,this._touchTimer,this._gestureMgr=new f,this._handlers={},s(this),d.pointerEventsSupported?e(b,this):(d.touchEventsSupported&&e(x,this),e(y,this))}var u=i(21),h=i(1),c=i(23),d=i(10),f=i(169),p=u.addEventListener,g=u.removeEventListener,m=u.normalizeEvent,v=300,y=["click","dblclick","mousewheel","mouseout","mouseup","mousedown","mousemove","contextmenu"],x=["touchstart","touchend","touchmove"],_={pointerdown:1,pointerup:1,pointermove:1,pointerout:1},b=h.map(y,function(t){var e=t.replace("mouse","pointer");return _[e]?e:t}),w={mousemove:function(t){t=m(this.dom,t),this.trigger("mousemove",t)},mouseout:function(t){t=m(this.dom,t);var e=t.toElement||t.relatedTarget;if(e!=this.dom)for(;e&&9!=e.nodeType;){if(e===this.dom)return;e=e.parentNode}this.trigger("mouseout",t)},touchstart:function(t){t=m(this.dom,t),t.zrByTouch=!0,this._lastTouchMoment=new Date,a(this,t,"start"),w.mousemove.call(this,t),w.mousedown.call(this,t),o(this)},touchmove:function(t){t=m(this.dom,t),t.zrByTouch=!0,a(this,t,"change"),w.mousemove.call(this,t),o(this)},touchend:function(t){t=m(this.dom,t),t.zrByTouch=!0,a(this,t,"end"),w.mouseup.call(this,t),+new Date-this._lastTouchMoment<v&&w.click.call(this,t),o(this)},pointerdown:function(t){w.mousedown.call(this,t)},pointermove:function(t){r(t)||w.mousemove.call(this,t)},pointerup:function(t){w.mouseup.call(this,t)},pointerout:function(t){r(t)||w.mouseout.call(this,t)}};h.each(["click","mousedown","mouseup","mousewheel","dblclick","contextmenu"],function(t){w[t]=function(e){e=m(this.dom,e),this.trigger(t,e)}});var S=l.prototype;S.dispose=function(){for(var t=y.concat(x),e=0;e<t.length;e++){var i=t[e];g(this.dom,n(i),this._handlers[i])}},S.setCursor=function(t){this.dom.style.cursor=t||"default"},h.mixin(l,c),t.exports=l},function(t,e,i){var n=i(8);t.exports=n.extend({type:"compound",shape:{paths:null},_updatePathDirty:function(){for(var t=this.__dirtyPath,e=this.shape.paths,i=0;i<e.length;i++)t=t||e[i].__dirtyPath;this.__dirtyPath=t,this.__dirty=this.__dirty||t},beforeBrush:function(){this._updatePathDirty();for(var t=this.shape.paths||[],e=this.getGlobalScale(),i=0;i<t.length;i++)t[i].path||t[i].createPathProxy(),t[i].path.setScale(e[0],e[1])},buildPath:function(t,e){for(var i=e.paths||[],n=0;n<i.length;n++)i[n].buildPath(t,i[n].shape,!0)},afterBrush:function(){for(var t=this.shape.paths,e=0;e<t.length;e++)t[e].__dirtyPath=!1},getBoundingRect:function(){return this._updatePathDirty(),n.prototype.getBoundingRect.call(this)}})},function(t,e,i){"use strict";var n=i(1),a=i(39),o=function(t,e,i,n,o){this.x=null==t?.5:t,this.y=null==e?.5:e,this.r=null==i?.5:i,this.type="radial",this.global=o||!1,a.call(this,n)};o.prototype={constructor:o},n.inherits(o,a),t.exports=o},function(t,e,i){var n=i(6),a=n.min,o=n.max,r=n.scale,s=n.distance,l=n.add;t.exports=function(t,e,i,u){var h,c,d,f,p=[],g=[],m=[],v=[];if(u){d=[1/0,1/0],f=[-(1/0),-(1/0)];for(var y=0,x=t.length;y<x;y++)a(d,d,t[y]),o(f,f,t[y]);a(d,d,u[0]),o(f,f,u[1])}for(var y=0,x=t.length;y<x;y++){var _=t[y];if(i)h=t[y?y-1:x-1],c=t[(y+1)%x];else{if(0===y||y===x-1){p.push(n.clone(t[y]));continue}h=t[y-1],c=t[y+1]}n.sub(g,c,h),r(g,g,e);var b=s(_,h),w=s(_,c),S=b+w;0!==S&&(b/=S,w/=S),r(m,g,-b),r(v,g,w);var M=l([],_,m),I=l([],_,v);u&&(o(M,M,d),a(M,M,f),o(I,I,d),a(I,I,f)),p.push(M),p.push(I)}return i&&p.push(p.shift()),p}},function(t,e,i){function n(t,e,i,n,a,o,r){var s=.5*(i-t),l=.5*(n-e);return(2*(e-i)+s+l)*r+(-3*(e-i)-2*s-l)*o+s*a+e}var a=i(6);t.exports=function(t,e){for(var i=t.length,o=[],r=0,s=1;s<i;s++)r+=a.distance(t[s-1],t[s]);var l=r/2;l=l<i?i:l;for(var s=0;s<l;s++){var u,h,c,d=s/(l-1)*(e?i:i-1),f=Math.floor(d),p=d-f,g=t[f%i];e?(u=t[(f-1+i)%i],h=t[(f+1)%i],c=t[(f+2)%i]):(u=t[0===f?f:f-1],h=t[f>i-2?i-1:f+1],c=t[f>i-3?i-1:f+2]);var m=p*p,v=p*m;o.push([n(u[0],g[0],h[0],c[0],p,m,v),n(u[1],g[1],h[1],c[1],p,m,v)])}return o}},function(t,e,i){t.exports=i(8).extend({type:"arc",shape:{cx:0,cy:0,r:0,startAngle:0,endAngle:2*Math.PI,clockwise:!0},style:{stroke:"#000",fill:null},buildPath:function(t,e){var i=e.cx,n=e.cy,a=Math.max(e.r,0),o=e.startAngle,r=e.endAngle,s=e.clockwise,l=Math.cos(o),u=Math.sin(o);t.moveTo(l*a+i,u*a+n),t.arc(i,n,a,o,r,!s)}})},function(t,e,i){"use strict";function n(t,e,i){var n=t.cpx2,a=t.cpy2;return null===n||null===a?[(i?c:u)(t.x1,t.cpx1,t.cpx2,t.x2,e),(i?c:u)(t.y1,t.cpy1,t.cpy2,t.y2,e)]:[(i?h:l)(t.x1,t.cpx1,t.x2,e),(i?h:l)(t.y1,t.cpy1,t.y2,e)]}var a=i(20),o=i(6),r=a.quadraticSubdivide,s=a.cubicSubdivide,l=a.quadraticAt,u=a.cubicAt,h=a.quadraticDerivativeAt,c=a.cubicDerivativeAt,d=[];t.exports=i(8).extend({type:"bezier-curve",shape:{x1:0,y1:0,x2:0,y2:0,cpx1:0,cpy1:0,percent:1},style:{stroke:"#000",fill:null},buildPath:function(t,e){var i=e.x1,n=e.y1,a=e.x2,o=e.y2,l=e.cpx1,u=e.cpy1,h=e.cpx2,c=e.cpy2,f=e.percent;0!==f&&(t.moveTo(i,n),null==h||null==c?(f<1&&(r(i,l,a,f,d),l=d[1],a=d[2],r(n,u,o,f,d),u=d[1],o=d[2]),t.quadraticCurveTo(l,u,a,o)):(f<1&&(s(i,l,h,a,f,d),l=d[1],h=d[2],a=d[3],s(n,u,c,o,f,d),u=d[1],c=d[2],o=d[3]),t.bezierCurveTo(l,u,h,c,a,o)))},pointAt:function(t){return n(this.shape,t,!1)},tangentAt:function(t){var e=n(this.shape,t,!0);return o.normalize(e,e)}})},function(t,e,i){"use strict";t.exports=i(8).extend({type:"circle",shape:{cx:0,cy:0,r:0},buildPath:function(t,e,i){i&&t.moveTo(e.cx+e.r,e.cy),t.arc(e.cx,e.cy,e.r,0,2*Math.PI,!0)}})},function(t,e,i){t.exports=i(8).extend({type:"line",shape:{x1:0,y1:0,x2:0,y2:0,percent:1},style:{stroke:"#000",fill:null},buildPath:function(t,e){var i=e.x1,n=e.y1,a=e.x2,o=e.y2,r=e.percent;0!==r&&(t.moveTo(i,n),r<1&&(a=i*(1-r)+a*r,o=n*(1-r)+o*r),t.lineTo(a,o))},pointAt:function(t){var e=this.shape;return[e.x1*(1-t)+e.x2*t,e.y1*(1-t)+e.y2*t]}})},function(t,e,i){var n=i(78);t.exports=i(8).extend({type:"polygon",shape:{points:null,smooth:!1,smoothConstraint:null},buildPath:function(t,e){n.buildPath(t,e,!0)}})},function(t,e,i){var n=i(78);t.exports=i(8).extend({type:"polyline",shape:{points:null,smooth:!1,smoothConstraint:null},style:{stroke:"#000",fill:null},buildPath:function(t,e){n.buildPath(t,e,!1)}})},function(t,e,i){var n=i(79);t.exports=i(8).extend({type:"rect",shape:{r:0,x:0,y:0,width:0,height:0},buildPath:function(t,e){var i=e.x,a=e.y,o=e.width,r=e.height;e.r?n.buildPath(t,e):t.rect(i,a,o,r),t.closePath()}})},function(t,e,i){t.exports=i(8).extend({type:"ring",shape:{cx:0,cy:0,r:0,r0:0},buildPath:function(t,e){var i=e.cx,n=e.cy,a=2*Math.PI;t.moveTo(i+e.r,n),t.arc(i,n,e.r,0,a,!1),t.moveTo(i+e.r0,n),t.arc(i,n,e.r0,0,a,!0)}})},function(t,e,i){var n=i(8),a=i(77);t.exports=n.extend({type:"sector",shape:{cx:0,cy:0,r0:0,r:0,startAngle:0,endAngle:2*Math.PI,clockwise:!0},brush:a(n.prototype.brush),buildPath:function(t,e){var i=e.cx,n=e.cy,a=Math.max(e.r0||0,0),o=Math.max(e.r,0),r=e.startAngle,s=e.endAngle,l=e.clockwise,u=Math.cos(r),h=Math.sin(r);t.moveTo(u*a+i,h*a+n),t.lineTo(u*o+i,h*o+n),t.arc(i,n,o,r,s,!l),t.lineTo(Math.cos(s)*a+i,Math.sin(s)*a+n),0!==a&&t.arc(i,n,a,s,r,l),t.closePath()}})},function(t,e,i){"use strict";var n=i(70),a=i(1),o=a.isString,r=a.isFunction,s=a.isObject,l=i(54),u=function(){this.animators=[]};u.prototype={constructor:u,animate:function(t,e){var i,o=!1,r=this,s=this.__zr;if(t){var u=t.split("."),h=r;o="shape"===u[0];for(var c=0,d=u.length;c<d;c++)h&&(h=h[u[c]]);h&&(i=h)}else i=r;if(!i)return void l('Property "'+t+'" is not existed in element '+r.id);var f=r.animators,p=new n(i,e);return p.during(function(t){r.dirty(o)}).done(function(){f.splice(a.indexOf(f,p),1)}),f.push(p),s&&s.animation.addAnimator(p),p},stopAnimation:function(t){for(var e=this.animators,i=e.length,n=0;n<i;n++)e[n].stop(t);return e.length=0,this},animateTo:function(t,e,i,n,a,s){function l(){h--,h||a&&a()}o(i)?(a=n,n=i,i=0):r(n)?(a=n,n="linear",i=0):r(i)?(a=i,i=0):r(e)?(a=e,e=500):e||(e=500),this.stopAnimation(),this._animateToShallow("",this,t,e,i,n,a);var u=this.animators.slice(),h=u.length;h||a&&a();for(var c=0;c<u.length;c++)u[c].done(l).start(n,s)},_animateToShallow:function(t,e,i,n,o){var r={},l=0;for(var u in i)if(i.hasOwnProperty(u))if(null!=e[u])s(i[u])&&!a.isArrayLike(i[u])?this._animateToShallow(t?t+"."+u:u,e[u],i[u],n,o):(r[u]=i[u],l++);else if(null!=i[u])if(t){var h={};h[t]={},h[t][u]=i[u],this.attr(h)}else this.attr(u,i[u]);return l>0&&this.animate(t,!1).when(null==n?500:n,r).delay(o||0),this}},t.exports=u},function(t,e){function i(){this.on("mousedown",this._dragStart,this),this.on("mousemove",this._drag,this),this.on("mouseup",this._dragEnd,this),this.on("globalout",this._dragEnd,this)}function n(t,e){return{target:t,topTarget:e&&e.topTarget}}i.prototype={constructor:i,_dragStart:function(t){var e=t.target;e&&e.draggable&&(this._draggingTarget=e,e.dragging=!0,this._x=t.offsetX,this._y=t.offsetY,this.dispatchToElement(n(e,t),"dragstart",t.event))},_drag:function(t){var e=this._draggingTarget;if(e){var i=t.offsetX,a=t.offsetY,o=i-this._x,r=a-this._y;this._x=i,this._y=a,e.drift(o,r,t),this.dispatchToElement(n(e,t),"drag",t.event);var s=this.findHover(i,a,e).target,l=this._dropTarget;this._dropTarget=s,e!==s&&(l&&s!==l&&this.dispatchToElement(n(l,t),"dragleave",t.event),s&&s!==l&&this.dispatchToElement(n(s,t),"dragenter",t.event))}},_dragEnd:function(t){var e=this._draggingTarget;e&&(e.dragging=!1),this.dispatchToElement(n(e,t),"dragend",t.event),this._dropTarget&&this.dispatchToElement(n(this._dropTarget,t),"drop",t.event),this._draggingTarget=null,this._dropTarget=null}},t.exports=i},function(t,e,i){function n(t,e,i,n,a,o,r,s,l,u,p){var v=l*(f/180),y=d(v)*(t-i)/2+c(v)*(e-n)/2,x=-1*c(v)*(t-i)/2+d(v)*(e-n)/2,_=y*y/(r*r)+x*x/(s*s);_>1&&(r*=h(_),s*=h(_));var b=(a===o?-1:1)*h((r*r*(s*s)-r*r*(x*x)-s*s*(y*y))/(r*r*(x*x)+s*s*(y*y)))||0,w=b*r*x/s,S=b*-s*y/r,M=(t+i)/2+d(v)*w-c(v)*S,I=(e+n)/2+c(v)*w+d(v)*S,T=m([1,0],[(y-w)/r,(x-S)/s]),A=[(y-w)/r,(x-S)/s],C=[(-1*y-w)/r,(-1*x-S)/s],L=m(A,C);g(A,C)<=-1&&(L=f),g(A,C)>=1&&(L=0),0===o&&L>0&&(L-=2*f),1===o&&L<0&&(L+=2*f),p.addData(u,M,I,r,s,T,L,v,o)}function a(t){if(!t)return[];var e,i=t.replace(/-/g," -").replace(/  /g," ").replace(/ /g,",").replace(/,,/g,",");for(e=0;e<u.length;e++)i=i.replace(new RegExp(u[e],"g"),"|"+u[e]);var a,o=i.split("|"),r=0,l=0,h=new s,c=s.CMD;for(e=1;e<o.length;e++){var d,f=o[e],p=f.charAt(0),g=0,m=f.slice(1).replace(/e,-/g,"e-").split(",");m.length>0&&""===m[0]&&m.shift();for(var v=0;v<m.length;v++)m[v]=parseFloat(m[v]);for(;g<m.length&&!isNaN(m[g])&&!isNaN(m[0]);){var y,x,_,b,w,S,M,I=r,T=l;switch(p){case"l":r+=m[g++],l+=m[g++],d=c.L,h.addData(d,r,l);break;case"L":r=m[g++],l=m[g++],d=c.L,h.addData(d,r,l);break;case"m":r+=m[g++],l+=m[g++],d=c.M,h.addData(d,r,l),p="l";break;case"M":r=m[g++],l=m[g++],d=c.M,h.addData(d,r,l),p="L";break;case"h":r+=m[g++],d=c.L,h.addData(d,r,l);break;case"H":r=m[g++],d=c.L,h.addData(d,r,l);break;case"v":l+=m[g++],d=c.L,h.addData(d,r,l);break;case"V":l=m[g++],d=c.L,h.addData(d,r,l);break;case"C":d=c.C,h.addData(d,m[g++],m[g++],m[g++],m[g++],m[g++],m[g++]),r=m[g-2],l=m[g-1];break;case"c":d=c.C,h.addData(d,m[g++]+r,m[g++]+l,m[g++]+r,m[g++]+l,m[g++]+r,m[g++]+l),r+=m[g-2],l+=m[g-1];break;case"S":y=r,x=l;var A=h.len(),C=h.data;a===c.C&&(y+=r-C[A-4],x+=l-C[A-3]),d=c.C,I=m[g++],T=m[g++],r=m[g++],l=m[g++],h.addData(d,y,x,I,T,r,l);break;case"s":y=r,x=l;var A=h.len(),C=h.data;a===c.C&&(y+=r-C[A-4],x+=l-C[A-3]),d=c.C,I=r+m[g++],T=l+m[g++],r+=m[g++],l+=m[g++],h.addData(d,y,x,I,T,r,l);break;case"Q":I=m[g++],T=m[g++],r=m[g++],l=m[g++],d=c.Q,h.addData(d,I,T,r,l);break;case"q":I=m[g++]+r,T=m[g++]+l,r+=m[g++],l+=m[g++],d=c.Q,h.addData(d,I,T,r,l);break;case"T":y=r,x=l;var A=h.len(),C=h.data;a===c.Q&&(y+=r-C[A-4],x+=l-C[A-3]),r=m[g++],l=m[g++],d=c.Q,h.addData(d,y,x,r,l);break;case"t":y=r,x=l;var A=h.len(),C=h.data;a===c.Q&&(y+=r-C[A-4],x+=l-C[A-3]),r+=m[g++],l+=m[g++],d=c.Q,h.addData(d,y,x,r,l);break;case"A":_=m[g++],b=m[g++],w=m[g++],S=m[g++],M=m[g++],I=r,T=l,r=m[g++],l=m[g++],d=c.A,n(I,T,r,l,S,M,_,b,w,d,h);break;case"a":_=m[g++],b=m[g++],w=m[g++],S=m[g++],M=m[g++],I=r,T=l,r+=m[g++],l+=m[g++],d=c.A,n(I,T,r,l,S,M,_,b,w,d,h)}}"z"!==p&&"Z"!==p||(d=c.Z,h.addData(d)),a=d}return h.toStatic(),h}function o(t,e){var i=a(t);return e=e||{},e.buildPath=function(t){if(t.setData){t.setData(i.data);var e=t.getContext();e&&t.rebuildPath(e)}else{var e=t;i.rebuildPath(e)}},e.applyTransform=function(t){l(i,t),this.dirty(!0)},e}var r=i(8),s=i(27),l=i(187),u=["m","M","l","L","v","V","h","H","z","Z","c","C","q","Q","t","T","s","S","a","A"],h=Math.sqrt,c=Math.sin,d=Math.cos,f=Math.PI,p=function(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1])},g=function(t,e){return(t[0]*e[0]+t[1]*e[1])/(p(t)*p(e))},m=function(t,e){return(t[0]*e[1]<t[1]*e[0]?-1:1)*Math.acos(g(t,e))};t.exports={createFromString:function(t,e){return new r(o(t,e))},extendFromString:function(t,e){return r.extend(o(t,e))},mergePath:function(t,e){for(var i=[],n=t.length,a=0;a<n;a++){var o=t[a];o.path||o.createPathProxy(),o.__dirtyPath&&o.buildPath(o.path,o.shape,!0),i.push(o.path)}var s=new r(e);return s.createPathProxy(),s.buildPath=function(t){t.appendPath(i);var e=t.getContext();e&&t.rebuildPath(e)},s}}},function(t,e,i){function n(t,e){var i,n,o,h,c,d,f=t.data,p=a.M,g=a.C,m=a.L,v=a.R,y=a.A,x=a.Q;for(o=0,h=0;o<f.length;){switch(i=f[o++],h=o,n=0,i){case p:
n=1;break;case m:n=1;break;case g:n=3;break;case x:n=2;break;case y:var _=e[4],b=e[5],w=l(e[0]*e[0]+e[1]*e[1]),S=l(e[2]*e[2]+e[3]*e[3]),M=u(-e[1]/S,e[0]/w);f[o]*=w,f[o++]+=_,f[o]*=S,f[o++]+=b,f[o++]*=w,f[o++]*=S,f[o++]+=M,f[o++]+=M,o+=2,h=o;break;case v:d[0]=f[o++],d[1]=f[o++],r(d,d,e),f[h++]=d[0],f[h++]=d[1],d[0]+=f[o++],d[1]+=f[o++],r(d,d,e),f[h++]=d[0],f[h++]=d[1]}for(c=0;c<n;c++){var d=s[c];d[0]=f[o++],d[1]=f[o++],r(d,d,e),f[h++]=d[0],f[h++]=d[1]}}}var a=i(27).CMD,o=i(6),r=o.applyTransform,s=[[],[],[]],l=Math.sqrt,u=Math.atan2;t.exports=n},function(t,e,i){if(!i(10).canvasSupported){var n,a="urn:schemas-microsoft-com:vml",o=window,r=o.document,s=!1;try{!r.namespaces.zrvml&&r.namespaces.add("zrvml",a),n=function(t){return r.createElement("<zrvml:"+t+' class="zrvml">')}}catch(t){n=function(t){return r.createElement("<"+t+' xmlns="'+a+'" class="zrvml">')}}var l=function(){if(!s){s=!0;var t=r.styleSheets;t.length<31?r.createStyleSheet().addRule(".zrvml","behavior:url(#default#VML)"):t[0].addRule(".zrvml","behavior:url(#default#VML)")}};t.exports={doc:r,initVML:l,createNode:n}}},function(t,e,i){"use strict";var n=i(14),a=i(25),o=i(321),r=i(1),s={_baseAxisDim:null,getInitialData:function(t,e){var i,o,s=e.getComponent("xAxis",this.get("xAxisIndex")),l=e.getComponent("yAxis",this.get("yAxisIndex")),u=s.get("type"),h=l.get("type");"category"===u?(t.layout="horizontal",i=s.getCategories(),o=!0):"category"===h?(t.layout="vertical",i=l.getCategories(),o=!0):t.layout=t.layout||"horizontal";var c=["x","y"],d="horizontal"===t.layout?0:1,f=this._baseAxisDim=c[d],p=c[1-d],g=t.data;o&&r.each(g,function(t,e){t.value&&r.isArray(t.value)?t.value.unshift(e):r.isArray(t)&&t.unshift(e)});var m=this.defaultValueDimensions,v=[{name:f,otherDims:{tooltip:!1},dimsDef:["base"]},{name:p,dimsDef:m.slice()}];v=a(v,g,{encodeDef:this.get("encode"),dimsDef:this.get("dimensions"),dimCount:m.length+1});var y=new n(v,this);return y.initData(g,i?i.slice():null),y},getBaseAxis:function(){var t=this._baseAxisDim;return this.ecModel.getComponent(t+"Axis",this.get(t+"AxisIndex")).axis}},l={init:function(){var t=this._whiskerBoxDraw=new o(this.getStyleUpdater());this.group.add(t.group)},render:function(t,e,i){this._whiskerBoxDraw.updateData(t.getData())},remove:function(t){this._whiskerBoxDraw.remove()}};t.exports={seriesModelMixin:s,viewMixin:l}},function(t,e,i){function n(t,e,i){var n=this._targetInfoList=[],a={},r=o(e,t);p(_,function(t,e){(!i||!i.include||g(i.include,e)>=0)&&t(r,n,a)})}function a(t){return t[0]>t[1]&&t.reverse(),t}function o(t,e){return d.parseFinder(t,e,{includeMainTypes:y})}function r(t,e,i,n){var o=i.getAxis(["x","y"][t]),r=a(h.map([0,1],function(t){return e?o.coordToData(o.toLocalCoord(n[t])):o.toGlobalCoord(o.dataToCoord(n[t]))})),s=[];return s[t]=r,s[1-t]=[NaN,NaN],{values:r,xyMinMax:s}}function s(t,e,i,n){return[e[0]-n[t]*i[0],e[1]-n[t]*i[1]]}function l(t,e){var i=u(t),n=u(e),a=[i[0]/n[0],i[1]/n[1]];return isNaN(a[0])&&(a[0]=1),isNaN(a[1])&&(a[1]=1),a}function u(t){return t?[t[0][1]-t[0][0],t[1][1]-t[1][0]]:[NaN,NaN]}var h=i(1),c=i(3),d=i(5),f=i(191),p=h.each,g=h.indexOf,m=h.curry,v=["dataToPoint","pointToData"],y=["grid","xAxis","yAxis","geo","graph","polar","radiusAxis","angleAxis","bmap"],x=n.prototype;x.setOutputRanges=function(t,e){this.matchOutputRanges(t,e,function(t,e,i){if((t.coordRanges||(t.coordRanges=[])).push(e),!t.coordRange){t.coordRange=e;var n=S[t.brushType](0,i,e);t.__rangeOffset={offset:M[t.brushType](n.values,t.range,[1,1]),xyMinMax:n.xyMinMax}}})},x.matchOutputRanges=function(t,e,i){p(t,function(t){var n=this.findTargetInfo(t,e);n&&n!==!0&&h.each(n.coordSyses,function(n){var a=S[t.brushType](1,n,t.range);i(t,a.values,n,e)})},this)},x.setInputRanges=function(t,e){p(t,function(t){var i=this.findTargetInfo(t,e);if(t.range=t.range||[],i&&i!==!0){t.panelId=i.panelId;var n=S[t.brushType](0,i.coordSys,t.coordRange),a=t.__rangeOffset;t.range=a?M[t.brushType](n.values,a.offset,l(n.xyMinMax,a.xyMinMax)):n.values}},this)},x.makePanelOpts=function(t,e){return h.map(this._targetInfoList,function(i){var n=i.getPanelRect();return{panelId:i.panelId,defaultBrushType:e&&e(i),clipPath:f.makeRectPanelClipPath(n),isTargetByCursor:f.makeRectIsTargetByCursor(n,t,i.coordSysModel),getLinearBrushOtherExtent:f.makeLinearBrushOtherExtent(n)}})},x.controlSeries=function(t,e,i){var n=this.findTargetInfo(t,i);return n===!0||n&&g(n.coordSyses,e.coordinateSystem)>=0},x.findTargetInfo=function(t,e){for(var i=this._targetInfoList,n=o(e,t),a=0;a<i.length;a++){var r=i[a],s=t.panelId;if(s){if(r.panelId===s)return r}else for(var a=0;a<b.length;a++)if(b[a](n,r))return r}return!0};var _={grid:function(t,e){var i=t.xAxisModels,n=t.yAxisModels,a=t.gridModels,o=h.createHashMap(),r={},s={};(i||n||a)&&(p(i,function(t){var e=t.axis.grid.model;o.set(e.id,e),r[e.id]=!0}),p(n,function(t){var e=t.axis.grid.model;o.set(e.id,e),s[e.id]=!0}),p(a,function(t){o.set(t.id,t),r[t.id]=!0,s[t.id]=!0}),o.each(function(t){var a=t.coordinateSystem,o=[];p(a.getCartesians(),function(t,e){(g(i,t.getAxis("x").model)>=0||g(n,t.getAxis("y").model)>=0)&&o.push(t)}),e.push({panelId:"grid--"+t.id,gridModel:t,coordSysModel:t,coordSys:o[0],coordSyses:o,getPanelRect:w.grid,xAxisDeclared:r[t.id],yAxisDeclared:s[t.id]})}))},geo:function(t,e){p(t.geoModels,function(t){var i=t.coordinateSystem;e.push({panelId:"geo--"+t.id,geoModel:t,coordSysModel:t,coordSys:i,coordSyses:[i],getPanelRect:w.geo})})}},b=[function(t,e){var i=t.xAxisModel,n=t.yAxisModel,a=t.gridModel;return!a&&i&&(a=i.axis.grid.model),!a&&n&&(a=n.axis.grid.model),a&&a===e.gridModel},function(t,e){var i=t.geoModel;return i&&i===e.geoModel}],w={grid:function(){return this.coordSys.grid.getRect().clone()},geo:function(){var t=this.coordSys,e=t.getBoundingRect().clone();return e.applyTransform(c.getTransform(t)),e}},S={lineX:m(r,0),lineY:m(r,1),rect:function(t,e,i){var n=e[v[t]]([i[0][0],i[1][0]]),o=e[v[t]]([i[0][1],i[1][1]]),r=[a([n[0],o[0]]),a([n[1],o[1]])];return{values:r,xyMinMax:r}},polygon:function(t,e,i){var n=[[1/0,-(1/0)],[1/0,-(1/0)]],a=h.map(i,function(i){var a=e[v[t]](i);return n[0][0]=Math.min(n[0][0],a[0]),n[1][0]=Math.min(n[1][0],a[1]),n[0][1]=Math.max(n[0][1],a[0]),n[1][1]=Math.max(n[1][1],a[1]),a});return{values:a,xyMinMax:n}}},M={lineX:m(s,0),lineY:m(s,1),rect:function(t,e,i){return[[t[0][0]-i[0]*e[0][0],t[0][1]-i[0]*e[0][1]],[t[1][0]-i[1]*e[1][0],t[1][1]-i[1]*e[1][1]]]},polygon:function(t,e,i){return h.map(t,function(t,n){return[t[0]-i[0]*e[n][0],t[1]-i[1]*e[n][1]]})}};t.exports=n},function(t,e,i){function n(t){return o.create(t)}var a=i(133),o=i(12),r=i(3),s={};s.makeRectPanelClipPath=function(t){return t=n(t),function(e,i){return r.clipPointsByRect(e,t)}},s.makeLinearBrushOtherExtent=function(t,e){return t=n(t),function(i){var n=null!=e?e:i,a=n?t.width:t.height,o=n?t.x:t.y;return[o,o+(a||0)]}},s.makeRectIsTargetByCursor=function(t,e,i){return t=n(t),function(n,o,r){return t.contain(o[0],o[1])&&!a.onIrrelevantElement(n,e,i)}},t.exports=s},function(t,e,i){function n(t,e){var i=t.get("boundingCoords");if(null!=i){var n=i[0],a=i[1];isNaN(n[0])||isNaN(n[1])||isNaN(a[0])||isNaN(a[1])||this.setBoundingRect(n[0],n[1],a[0]-n[0],a[1]-n[1])}var o,s=this.getBoundingRect(),u=t.get("layoutCenter"),h=t.get("layoutSize"),c=e.getWidth(),d=e.getHeight(),f=t.get("aspectScale")||.75,p=s.width/s.height*f,g=!1;u&&h&&(u=[l.parsePercent(u[0],c),l.parsePercent(u[1],d)],h=l.parsePercent(h,Math.min(c,d)),isNaN(u[0])||isNaN(u[1])||isNaN(h)||(g=!0));var m;if(g){var m={};p>1?(m.width=h,m.height=h/p):(m.height=h,m.width=h*p),m.y=u[1]-m.height/2,m.x=u[0]-m.width/2}else o=t.getBoxLayoutParams(),o.aspect=p,m=r.getLayoutRect(o,{width:c,height:d});this.setViewRect(m.x,m.y,m.width,m.height),this.setCenter(t.get("center")),this.setZoom(t.get("zoom"))}function a(t,e){s.each(e.get("geoCoord"),function(e,i){t.addGeoCoord(i,e)})}var o=i(406),r=i(9),s=i(1),l=i(4),u={},h={dimensions:o.prototype.dimensions,create:function(t,e){var i=[];t.eachComponent("geo",function(t,r){var s=t.get("map"),l=u[s],h=new o(s+r,s,l&&l.geoJson,l&&l.specialAreas,t.get("nameMap"));h.zoomLimit=t.get("scaleLimit"),i.push(h),a(h,t),t.coordinateSystem=h,h.model=t,h.resize=n,h.resize(t,e)}),t.eachSeries(function(t){var e=t.get("coordinateSystem");if("geo"===e){var n=t.get("geoIndex")||0;t.coordinateSystem=i[n]}});var r={};return t.eachSeriesByType("map",function(t){if(!t.getHostGeoModel()){var e=t.getMapType();r[e]=r[e]||[],r[e].push(t)}}),s.each(r,function(t,r){var l=u[r],h=s.map(t,function(t){return t.get("nameMap")}),c=new o(r,r,l&&l.geoJson,l&&l.specialAreas,s.mergeAll(h));c.zoomLimit=s.retrieve.apply(null,s.map(t,function(t){return t.get("scaleLimit")})),i.push(c),c.resize=n,c.resize(t[0],e),s.each(t,function(t){t.coordinateSystem=c,a(c,t)})}),i},registerMap:function(t,e,i){e.geoJson&&!e.features&&(i=e.specialAreas,e=e.geoJson),"string"==typeof e&&(e="undefined"!=typeof JSON&&JSON.parse?JSON.parse(e):new Function("return ("+e+");")()),u[t]={geoJson:e,specialAreas:i}},getMap:function(t){return u[t]},getFilledRegions:function(t,e,i){var n=(t||[]).slice();i=i||{};var a=h.getMap(e),o=a&&a.geoJson;if(!o)return t;for(var r=s.createHashMap(),l=o.features,u=0;u<n.length;u++)r.set(n[u].name,n[u]);for(var u=0;u<l.length;u++){var c=l[u].properties.name;r.get(c)||(i.hasOwnProperty(c)&&(c=i[c]),n.push({name:c}))}return n}},c=i(2);c.registerMap=h.registerMap,c.getMap=h.getMap,c.parseGeoJSON=i(270),c.loadMap=function(){},c.registerCoordinateSystem("geo",h),t.exports=h},function(t,e,i){function n(t){if(t)for(var e in t)if(t.hasOwnProperty(e))return!0}var a=i(1),o=i(88),r=a.each,s={createVisualMappings:function(t,e,i){function n(){var t=function(){};t.prototype.__hidden=t.prototype;var e=new t;return e}var s={};return r(e,function(e){var l=s[e]=n();r(t[e],function(t,n){if(o.isValidType(n)){var r={type:n,visual:t};i&&i(r,e),l[n]=new o(r),"opacity"===n&&(r=a.clone(r),r.type="colorAlpha",l.__hidden.__alphaForOpacity=new o(r))}})}),s},replaceVisualOption:function(t,e,i){var o;a.each(i,function(t){e.hasOwnProperty(t)&&n(e[t])&&(o=!0)}),o&&a.each(i,function(i){e.hasOwnProperty(i)&&n(e[i])?t[i]=a.clone(e[i]):delete t[i]})},applyVisual:function(t,e,i,n,r,s){function l(t){return i.getItemVisual(d,t)}function u(t,e){i.setItemVisual(d,t,e)}function h(t,a){d=null==s?t:a;var o=i.getRawDataItem(d);if(!o||o.visualMap!==!1)for(var h=n.call(r,t),f=e[h],p=c[h],g=0,m=p.length;g<m;g++){var v=p[g];f[v]&&f[v].applyVisual(t,l,u)}}var c={};a.each(t,function(t){var i=o.prepareVisualTypes(e[t]);c[t]=i});var d;null==s?i.each(h,!0):i.each([s],h,!0)}};t.exports=s},function(t,e){function i(){throw new Error("setTimeout has not been defined")}function n(){throw new Error("clearTimeout has not been defined")}function a(t){if(h===setTimeout)return setTimeout(t,0);if((h===i||!h)&&setTimeout)return h=setTimeout,setTimeout(t,0);try{return h(t,0)}catch(e){try{return h.call(null,t,0)}catch(e){return h.call(this,t,0)}}}function o(t){if(c===clearTimeout)return clearTimeout(t);if((c===n||!c)&&clearTimeout)return c=clearTimeout,clearTimeout(t);try{return c(t)}catch(e){try{return c.call(null,t)}catch(e){return c.call(this,t)}}}function r(){g&&f&&(g=!1,f.length?p=f.concat(p):m=-1,p.length&&s())}function s(){if(!g){var t=a(r);g=!0;for(var e=p.length;e;){for(f=p,p=[];++m<e;)f&&f[m].run();m=-1,e=p.length}f=null,g=!1,o(t)}}function l(t,e){this.fun=t,this.array=e}function u(){}var h,c,d=t.exports={};!function(){try{h="function"==typeof setTimeout?setTimeout:i}catch(t){h=i}try{c="function"==typeof clearTimeout?clearTimeout:n}catch(t){c=n}}();var f,p=[],g=!1,m=-1;d.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)e[i-1]=arguments[i];p.push(new l(t,e)),1!==p.length||g||a(s)},l.prototype.run=function(){this.fun.apply(null,this.array)},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.versions={},d.on=u,d.addListener=u,d.once=u,d.off=u,d.removeListener=u,d.removeAllListeners=u,d.emit=u,d.prependListener=u,d.prependOnceListener=u,d.listeners=function(t){return[]},d.binding=function(t){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(t){throw new Error("process.chdir is not supported")},d.umask=function(){return 0}},function(t,e,i){function n(){this.group=new a.Group,this._symbolEl=new r({})}var a=i(3),o=i(24),r=a.extendShape({shape:{points:null,sizes:null},symbolProxy:null,buildPath:function(t,e){for(var i=e.points,n=e.sizes,a=this.symbolProxy,o=a.shape,r=0;r<i.length;r++){var s=i[r];if(!isNaN(s[0])&&!isNaN(s[1])){var l=n[r];l[0]<4?t.rect(s[0]-l[0]/2,s[1]-l[1]/2,l[0],l[1]):(o.x=s[0]-l[0]/2,o.y=s[1]-l[1]/2,o.width=l[0],o.height=l[1],a.buildPath(t,o,!0))}}},findDataIndex:function(t,e){for(var i=this.shape,n=i.points,a=i.sizes,o=n.length-1;o>=0;o--){var r=n[o],s=a[o],l=r[0]-s[0]/2,u=r[1]-s[1]/2;if(t>=l&&e>=u&&t<=l+s[0]&&e<=u+s[1])return o}return-1}}),s=n.prototype;s.updateData=function(t){this.group.removeAll();var e=this._symbolEl,i=t.hostModel;e.setShape({points:t.mapArray(t.getItemLayout),sizes:t.mapArray(function(e){var i=t.getItemVisual(e,"symbolSize");return i instanceof Array||(i=[i,i]),i})}),e.symbolProxy=o.createSymbol(t.getVisual("symbol"),0,0,0,0),e.setColor=e.symbolProxy.setColor,e.useStyle(i.getModel("itemStyle.normal").getItemStyle(["color"]));var n=t.getVisual("color");n&&e.setColor(n),e.seriesIndex=i.seriesIndex,e.on("mousemove",function(t){e.dataIndex=null;var i=e.findDataIndex(t.offsetX,t.offsetY);i>=0&&(e.dataIndex=i)}),this.group.add(e)},s.updateLayout=function(t){var e=t.getData();this._symbolEl.setShape({points:e.mapArray(e.getItemLayout)})},s.remove=function(){this.group.removeAll()},t.exports=n},function(t,e,i){function n(t){return isNaN(+t.cpx1)||isNaN(+t.cpy1)}var a=i(3),o=i(6),r=a.Line.prototype,s=a.BezierCurve.prototype;t.exports=a.extendShape({type:"ec-line",style:{stroke:"#000",fill:null},shape:{x1:0,y1:0,x2:0,y2:0,percent:1,cpx1:null,cpy1:null},buildPath:function(t,e){(n(e)?r:s).buildPath(t,e)},pointAt:function(t){return n(this.shape)?r.pointAt.call(this,t):s.pointAt.call(this,t)},tangentAt:function(t){var e=this.shape,i=n(e)?[e.x2-e.x1,e.y2-e.y1]:s.tangentAt.call(this,t);return o.normalize(i,i)}})},function(t,e,i){var n=i(1),a=i(2);i(198),i(199),a.registerVisual(n.curry(i(51),"scatter","circle",null)),a.registerLayout(n.curry(i(64),"scatter")),i(32)},function(t,e,i){"use strict";var n=i(28),a=i(17);t.exports=a.extend({type:"series.scatter",dependencies:["grid","polar","geo","singleAxis","calendar"],getInitialData:function(t,e){return n(t.data,this,e)},brushSelector:"point",defaultOption:{coordinateSystem:"cartesian2d",zlevel:0,z:2,legendHoverLink:!0,hoverAnimation:!0,symbolSize:10,large:!1,largeThreshold:2e3,itemStyle:{normal:{opacity:.8}}}})},function(t,e,i){var n=i(46),a=i(195);i(2).extendChartView({type:"scatter",init:function(){this._normalSymbolDraw=new n,this._largeSymbolDraw=new a},render:function(t,e,i){var n=t.getData(),a=this._largeSymbolDraw,o=this._normalSymbolDraw,r=this.group,s=t.get("large")&&n.count()>t.get("largeThreshold")?a:o;this._symbolDraw=s,s.updateData(n),r.add(s.group),r.remove(s===a?o.group:a.group)},updateLayout:function(t){this._symbolDraw.updateLayout(t)},remove:function(t,e){this._symbolDraw&&this._symbolDraw.remove(e,!0)},dispose:function(){}})},function(t,e,i){var n=i(2),a=n.extendComponentModel({type:"axisPointer",coordSysAxesInfo:null,defaultOption:{show:"auto",triggerOn:null,zlevel:0,z:50,type:"line",snap:!1,triggerTooltip:!0,value:null,status:null,link:[],animation:null,animationDurationUpdate:200,lineStyle:{color:"#aaa",width:1,type:"solid"},shadowStyle:{color:"rgba(150,150,150,0.3)"},label:{show:!0,formatter:null,precision:"auto",margin:3,color:"#fff",padding:[5,7,5,7],backgroundColor:"auto",borderColor:null,borderWidth:0,shadowBlur:3,shadowColor:"#aaa"},handle:{show:!1,icon:"M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z",size:45,margin:50,color:"#333",shadowBlur:3,shadowColor:"#aaa",shadowOffsetX:0,shadowOffsetY:2,throttle:40}}});t.exports=a},function(t,e,i){var n=i(127),a=i(2).extendComponentView({type:"axisPointer",render:function(t,e,i){var a=e.getComponent("tooltip"),o=t.get("triggerOn")||a&&a.get("triggerOn")||"mousemove|click";n.register("axisPointer",i,function(t,e,i){"none"!==o&&("leave"===t||o.indexOf(t)>=0)&&i({type:"updateAxisPointer",currTrigger:t,x:e&&e.offsetX,y:e&&e.offsetY})})},remove:function(t,e){n.disopse(e.getZr(),"axisPointer"),a.superApply(this._model,"remove",arguments)},dispose:function(t,e){n.unregister("axisPointer",e),a.superApply(this._model,"dispose",arguments)}})},function(t,e,i){function n(t,e,i){var n=t.currTrigger,o=[t.x,t.y],g=t,m=t.dispatchAction||p.bind(i.dispatchAction,i),_=e.getComponent("axisPointer").coordSysAxesInfo;if(_){f(o)&&(o=v({seriesIndex:g.seriesIndex,dataIndex:g.dataIndex},e).point);var b=f(o),w=g.axesInfo,S=_.axesInfo,M="leave"===n||f(o),I={},T={},A={list:[],map:{}},C={showPointer:x(r,T),showTooltip:x(s,A)};y(_.coordSysMap,function(t,e){var i=b||t.containPoint(o);y(_.coordSysAxesInfo[e],function(t,e){var n=t.axis,r=c(w,t);if(!M&&i&&(!w||r)){var s=r&&r.value;null!=s||b||(s=n.pointToData(o)),null!=s&&a(t,s,C,!1,I)}})});var L={};return y(S,function(t,e){var i=t.linkGroup;i&&!T[e]&&y(i.axesInfo,function(e,n){var a=T[n];if(e!==t&&a){var o=a.value;i.mapper&&(o=t.axis.scale.parse(i.mapper(o,d(e),d(t)))),L[t.key]=o}})}),y(L,function(t,e){a(S[e],t,C,!0,I)}),l(T,S,I),u(A,o,t,m),h(S,m,i),I}}function a(t,e,i,n,a){var r=t.axis;if(!r.scale.isBlank()&&r.containData(e)){if(!t.involveSeries)return void i.showPointer(t,e);var s=o(e,t),l=s.payloadBatch,u=s.snapToValue;l[0]&&null==a.seriesIndex&&p.extend(a,l[0]),!n&&t.snap&&r.containData(u)&&null!=u&&(e=u),i.showPointer(t,e,l,a),i.showTooltip(t,s,u)}}function o(t,e){var i=e.axis,n=i.dim,a=t,o=[],r=Number.MAX_VALUE,s=-1;return y(e.seriesModels,function(e,l){var u,h,c=e.coordDimToDataDim(n);if(e.getAxisTooltipData){var d=e.getAxisTooltipData(c,t,i);h=d.dataIndices,u=d.nestestValue}else{if(h=e.getData().indicesOfNearest(c[0],t,!1,"category"===i.type?.5:null),!h.length)return;u=e.getData().get(c[0],h[0])}if(null!=u&&isFinite(u)){var f=t-u,p=Math.abs(f);p<=r&&((p<r||f>=0&&s<0)&&(r=p,s=f,a=u,o.length=0),y(h,function(t){o.push({seriesIndex:e.seriesIndex,dataIndexInside:t,dataIndex:e.getData().getRawIndex(t)})}))}}),{payloadBatch:o,snapToValue:a}}function r(t,e,i,n){t[e.key]={value:i,payloadBatch:n}}function s(t,e,i,n){var a=i.payloadBatch,o=e.axis,r=o.model,s=e.axisPointerModel;if(e.triggerTooltip&&a.length){var l=e.coordSys.model,u=m.makeKey(l),h=t.map[u];h||(h=t.map[u]={coordSysId:l.id,coordSysIndex:l.componentIndex,coordSysType:l.type,coordSysMainType:l.mainType,dataByAxis:[]},t.list.push(h)),h.dataByAxis.push({axisDim:o.dim,axisIndex:r.componentIndex,axisType:r.type,axisId:r.id,value:n,valueLabelOpt:{precision:s.get("label.precision"),formatter:s.get("label.formatter")},seriesDataIndices:a.slice()})}}function l(t,e,i){var n=i.axesInfo=[];y(e,function(e,i){var a=e.axisPointerModel.option,o=t[i];o?(!e.useHandle&&(a.status="show"),a.value=o.value,a.seriesDataIndices=(o.payloadBatch||[]).slice()):!e.useHandle&&(a.status="hide"),"show"===a.status&&n.push({axisDim:e.axis.dim,axisIndex:e.axis.model.componentIndex,value:a.value})})}function u(t,e,i,n){if(f(e)||!t.list.length)return void n({type:"hideTip"});var a=((t.list[0].dataByAxis[0]||{}).seriesDataIndices||[])[0]||{};n({type:"showTip",escapeConnect:!0,x:e[0],y:e[1],tooltipOption:i.tooltipOption,position:i.position,dataIndexInside:a.dataIndexInside,dataIndex:a.dataIndex,seriesIndex:a.seriesIndex,dataByCoordSys:t.list})}function h(t,e,i){var n=i.getZr(),a="axisPointerLastHighlights",o=_(n)[a]||{},r=_(n)[a]={};y(t,function(t,e){var i=t.axisPointerModel.option;"show"===i.status&&y(i.seriesDataIndices,function(t){var e=t.seriesIndex+" | "+t.dataIndex;r[e]=t})});var s=[],l=[];p.each(o,function(t,e){!r[e]&&l.push(t)}),p.each(r,function(t,e){!o[e]&&s.push(t)}),l.length&&i.dispatchAction({type:"downplay",escapeConnect:!0,batch:l}),s.length&&i.dispatchAction({type:"highlight",escapeConnect:!0,batch:s})}function c(t,e){for(var i=0;i<(t||[]).length;i++){var n=t[i];if(e.axis.dim===n.axisDim&&e.axis.model.componentIndex===n.axisIndex)return n}}function d(t){var e=t.axis.model,i={},n=i.axisDim=t.axis.dim;return i.axisIndex=i[n+"AxisIndex"]=e.componentIndex,i.axisName=i[n+"AxisName"]=e.name,i.axisId=i[n+"AxisId"]=e.id,i}function f(t){return!t||null==t[0]||isNaN(t[0])||null==t[1]||isNaN(t[1])}var p=i(1),g=i(5),m=i(47),v=i(126),y=p.each,x=p.curry,_=g.makeGetter();t.exports=n},function(t,e,i){i(131),i(48),i(49),i(209),i(210),i(205),i(206),i(129),i(128)},function(t,e,i){function n(t,e,i){var n=[1/0,-(1/0)];return h(i,function(t){var i=t.getData();i&&h(t.coordDimToDataDim(e),function(t){var e=i.getDataExtent(t);e[0]<n[0]&&(n[0]=e[0]),e[1]>n[1]&&(n[1]=e[1])})}),n[1]<n[0]&&(n=[NaN,NaN]),a(t,n),n}function a(t,e){var i=t.getAxisModel(),n=i.getMin(!0),a="category"===i.get("type"),o=a&&(i.get("data")||[]).length;null!=n&&"dataMin"!==n&&"function"!=typeof n?e[0]=n:a&&(e[0]=o>0?0:NaN);var r=i.getMax(!0);return null!=r&&"dataMax"!==r&&"function"!=typeof r?e[1]=r:a&&(e[1]=o>0?o-1:NaN),i.get("scale",!0)||(e[0]>0&&(e[0]=0),e[1]<0&&(e[1]=0)),e}function o(t,e){var i=t.getAxisModel(),n=t._percentWindow,a=t._valueWindow;if(n){var o=l.getPixelPrecision(a,[0,500]);o=Math.min(o,20);var r=e||0===n[0]&&100===n[1];i.setRange(r?null:+a[0].toFixed(o),r?null:+a[1].toFixed(o))}}function r(t){var e=t._minMaxSpan={},i=t._dataZoomModel;h(["min","max"],function(n){e[n+"Span"]=i.get(n+"Span");var a=i.get(n+"ValueSpan");null!=a&&(e[n+"ValueSpan"]=a,a=t.getAxisModel().axis.scale.parse(a),null!=a&&(e[n+"Span"]=l.linearMap(a,t._dataExtent,[0,100],!0)))})}var s=i(1),l=i(4),u=i(82),h=s.each,c=l.asc,d=function(t,e,i,n){this._dimName=t,this._axisIndex=e,this._valueWindow,this._percentWindow,this._dataExtent,this._minMaxSpan,this.ecModel=n,this._dataZoomModel=i};d.prototype={constructor:d,hostedBy:function(t){return this._dataZoomModel===t},getDataValueWindow:function(){return this._valueWindow.slice()},getDataPercentWindow:function(){return this._percentWindow.slice()},getTargetSeriesModels:function(){var t=[],e=this.ecModel;return e.eachSeries(function(i){if(u.isCoordSupported(i.get("coordinateSystem"))){var n=this._dimName,a=e.queryComponents({mainType:n+"Axis",index:i.get(n+"AxisIndex"),id:i.get(n+"AxisId")})[0];this._axisIndex===(a&&a.componentIndex)&&t.push(i)}},this),t},getAxisModel:function(){return this.ecModel.getComponent(this._dimName+"Axis",this._axisIndex)},getOtherAxisModel:function(){var t,e,i=this._dimName,n=this.ecModel,a=this.getAxisModel(),o="x"===i||"y"===i;o?(e="gridIndex",t="x"===i?"y":"x"):(e="polarIndex",t="angle"===i?"radius":"angle");var r;return n.eachComponent(t+"Axis",function(t){(t.get(e)||0)===(a.get(e)||0)&&(r=t)}),r},getMinMaxSpan:function(){return s.clone(this._minMaxSpan)},calculateDataWindow:function(t){var e=this._dataExtent,i=this.getAxisModel(),n=i.axis.scale,a=this._dataZoomModel.getRangePropMode(),o=[0,100],r=[t.start,t.end],s=[];return h(["startValue","endValue"],function(e){s.push(null!=t[e]?n.parse(t[e]):null)}),h([0,1],function(t){var i=s[t],u=r[t];"percent"===a[t]?(null==u&&(u=o[t]),i=n.parse(l.linearMap(u,o,e,!0))):u=l.linearMap(i,e,o,!0),s[t]=i,r[t]=u}),{valueWindow:c(s),percentWindow:c(r)}},reset:function(t){if(t===this._dataZoomModel){this._dataExtent=n(this,this._dimName,this.getTargetSeriesModels());var e=this.calculateDataWindow(t.option);this._valueWindow=e.valueWindow,this._percentWindow=e.percentWindow,r(this),o(this)}},restore:function(t){t===this._dataZoomModel&&(this._valueWindow=this._percentWindow=null,o(this,!0))},filterData:function(t){function e(t){return t>=o[0]&&t<=o[1]}if(t===this._dataZoomModel){var i=this._dimName,n=this.getTargetSeriesModels(),a=t.get("filterMode"),o=this._valueWindow;if("none"!==a){var r=this.getOtherAxisModel();t.get("$fromToolbox")&&r&&"category"===r.get("type")&&(a="empty"),h(n,function(t){var n=t.getData(),r=t.coordDimToDataDim(i);"weakFilter"===a?n&&n.filterSelf(function(t){for(var e,i,a,s=0;s<r.length;s++){var l=n.get(r[s],t),u=!isNaN(l),h=l<o[0],c=l>o[1];if(u&&!h&&!c)return!0;u&&(a=!0),h&&(e=!0),c&&(i=!0)}return a&&e&&i}):n&&h(r,function(i){"empty"===a?t.setData(n.map(i,function(t){return e(t)?t:NaN})):n.filterSelf(i,e)})})}}}},t.exports=d},function(t,e,i){t.exports=i(48).extend({type:"dataZoom.inside",defaultOption:{disabled:!1,zoomLock:!1,zoomOnMouseWheel:!0,moveOnMouseMove:!0,preventDefaultMouseMove:!0}})},function(t,e,i){var n=i(49),a=i(1),o=i(59),r=i(211),s=a.bind,l=n.extend({type:"dataZoom.inside",init:function(t,e){this._range},render:function(t,e,i,n){l.superApply(this,"render",arguments),r.shouldRecordRange(n,t.id)&&(this._range=t.getPercentRange()),a.each(this.getTargetCoordInfo(),function(e,n){var o=a.map(e,function(t){return r.generateCoordId(t.model)});a.each(e,function(e){var a=e.model,l=t.option;r.register(i,{coordId:r.generateCoordId(a),allCoordIds:o,containsPoint:function(t,e,i){return a.coordinateSystem.containPoint([e,i])},dataZoomId:t.id,throttleRate:t.get("throttle",!0),panGetRange:s(this._onPan,this,e,n),zoomGetRange:s(this._onZoom,this,e,n),zoomLock:l.zoomLock,disabled:l.disabled,roamControllerOpt:{zoomOnMouseWheel:l.zoomOnMouseWheel,moveOnMouseMove:l.moveOnMouseMove,preventDefaultMouseMove:l.preventDefaultMouseMove}})},this)},this)},dispose:function(){r.unregister(this.api,this.dataZoomModel.id),l.superApply(this,"dispose",arguments),this._range=null},_onPan:function(t,e,i,n,a,r,s,l,h){var c=this._range.slice(),d=t.axisModels[0];if(d){var f=u[e]([r,s],[l,h],d,i,t),p=f.signal*(c[1]-c[0])*f.pixel/f.pixelLength;return o(p,c,[0,100],"all"),this._range=c}},_onZoom:function(t,e,i,n,a,r){var s=this._range.slice(),l=t.axisModels[0];if(l){var h=u[e](null,[a,r],l,i,t),c=(h.signal>0?h.pixelStart+h.pixelLength-h.pixel:h.pixel-h.pixelStart)/h.pixelLength*(s[1]-s[0])+s[0];n=Math.max(1/n,0),s[0]=(s[0]-c)*n+c,s[1]=(s[1]-c)*n+c;var d=this.dataZoomModel.findRepresentativeAxisProxy().getMinMaxSpan();return o(0,s,[0,100],0,d.minSpan,d.maxSpan),this._range=s}}}),u={grid:function(t,e,i,n,a){var o=i.axis,r={},s=a.model.coordinateSystem.getRect();return t=t||[0,0],"x"===o.dim?(r.pixel=e[0]-t[0],r.pixelLength=s.width,r.pixelStart=s.x,r.signal=o.inverse?1:-1):(r.pixel=e[1]-t[1],r.pixelLength=s.height,r.pixelStart=s.y,r.signal=o.inverse?-1:1),r},polar:function(t,e,i,n,a){var o=i.axis,r={},s=a.model.coordinateSystem,l=s.getRadiusAxis().getExtent(),u=s.getAngleAxis().getExtent();return t=t?s.pointToCoord(t):[0,0],e=s.pointToCoord(e),"radiusAxis"===i.mainType?(r.pixel=e[0]-t[0],r.pixelLength=l[1]-l[0],r.pixelStart=l[0],r.signal=o.inverse?1:-1):(r.pixel=e[1]-t[1],r.pixelLength=u[1]-u[0],r.pixelStart=u[0],r.signal=o.inverse?-1:1),r},singleAxis:function(t,e,i,n,a){var o=i.axis,r=a.model.coordinateSystem.getRect(),s={};return t=t||[0,0],"horizontal"===o.orient?(s.pixel=e[0]-t[0],s.pixelLength=r.width,s.pixelStart=r.x,s.signal=o.inverse?1:-1):(s.pixel=e[1]-t[1],s.pixelLength=r.height,s.pixelStart=r.y,s.signal=o.inverse?-1:1),s}};t.exports=l},function(t,e,i){var n=i(48);t.exports=n.extend({type:"dataZoom.select"})},function(t,e,i){t.exports=i(49).extend({type:"dataZoom.select"})},function(t,e,i){var n=i(48),a=n.extend({type:"dataZoom.slider",layoutMode:"box",defaultOption:{show:!0,right:"ph",top:"ph",width:"ph",height:"ph",left:null,bottom:null,backgroundColor:"rgba(47,69,84,0)",dataBackground:{lineStyle:{color:"#2f4554",width:.5,opacity:.3},areaStyle:{color:"rgba(47,69,84,0.3)",opacity:.3}},borderColor:"#ddd",fillerColor:"rgba(167,183,204,0.4)",handleIcon:"M8.2,13.6V3.9H6.3v9.7H3.1v14.9h3.3v9.7h1.8v-9.7h3.3V13.6H8.2z M9.7,24.4H4.8v-1.4h4.9V24.4z M9.7,19.1H4.8v-1.4h4.9V19.1z",handleSize:"100%",handleStyle:{color:"#a7b7cc"},labelPrecision:null,labelFormatter:null,showDetail:!0,showDataShadow:"auto",realtime:!0,zoomLock:!1,textStyle:{color:"#333"}}});t.exports=a},function(t,e,i){function n(t){var e={x:"y",y:"x",radius:"angle",angle:"radius"};return e[t]}function a(t){return"vertical"===t?"ns-resize":"ew-resize"}var o=i(1),r=i(3),s=i(37),l=i(49),u=r.Rect,h=i(4),c=h.linearMap,d=i(9),f=i(59),p=i(21),g=h.asc,m=o.bind,v=o.each,y=7,x=1,_=30,b="horizontal",w="vertical",S=5,M=["line","bar","candlestick","scatter"],I=l.extend({type:"dataZoom.slider",init:function(t,e){this._displayables={},this._orient,this._range,this._handleEnds,this._size,this._handleWidth,this._handleHeight,this._location,this._dragging,this._dataShadowInfo,this.api=e},render:function(t,e,i,n){return I.superApply(this,"render",arguments),s.createOrUpdate(this,"_dispatchZoomAction",this.dataZoomModel.get("throttle"),"fixRate"),this._orient=t.get("orient"),this.dataZoomModel.get("show")===!1?void this.group.removeAll():(n&&"dataZoom"===n.type&&n.from===this.uid||this._buildView(),void this._updateView())},remove:function(){I.superApply(this,"remove",arguments),s.clear(this,"_dispatchZoomAction")},dispose:function(){I.superApply(this,"dispose",arguments),s.clear(this,"_dispatchZoomAction")},_buildView:function(){var t=this.group;t.removeAll(),this._resetLocation(),this._resetInterval();var e=this._displayables.barGroup=new r.Group;this._renderBackground(),this._renderHandle(),this._renderDataShadow(),t.add(e),this._positionGroup()},_resetLocation:function(){var t=this.dataZoomModel,e=this.api,i=this._findCoordRect(),n={width:e.getWidth(),height:e.getHeight()},a=this._orient===b?{right:n.width-i.x-i.width,top:n.height-_-y,width:i.width,height:_}:{right:y,top:i.y,width:_,height:i.height},r=d.getLayoutParams(t.option);o.each(["right","top","width","height"],function(t){"ph"===r[t]&&(r[t]=a[t])});var s=d.getLayoutRect(r,n,t.padding);this._location={x:s.x,y:s.y},this._size=[s.width,s.height],this._orient===w&&this._size.reverse()},_positionGroup:function(){var t=this.group,e=this._location,i=this._orient,n=this.dataZoomModel.getFirstTargetAxisModel(),a=n&&n.get("inverse"),o=this._displayables.barGroup,r=(this._dataShadowInfo||{}).otherAxisInverse;o.attr(i!==b||a?i===b&&a?{scale:r?[-1,1]:[-1,-1]}:i!==w||a?{scale:r?[-1,-1]:[-1,1],rotation:Math.PI/2}:{scale:r?[1,-1]:[1,1],rotation:Math.PI/2}:{scale:r?[1,1]:[1,-1]});var s=t.getBoundingRect([o]);t.attr("position",[e.x-s.x,e.y-s.y])},_getViewExtent:function(){return[0,this._size[0]]},_renderBackground:function(){var t=this.dataZoomModel,e=this._size,i=this._displayables.barGroup;i.add(new u({silent:!0,shape:{x:0,y:0,width:e[0],height:e[1]},style:{fill:t.get("backgroundColor")},z2:-40})),i.add(new u({shape:{x:0,y:0,width:e[0],height:e[1]},style:{fill:"transparent"},z2:0,onclick:o.bind(this._onClickPanelClick,this)}))},_renderDataShadow:function(){var t=this._dataShadowInfo=this._prepareDataShadowInfo();if(t){var e=this._size,i=t.series,n=i.getRawData(),a=i.getShadowDim?i.getShadowDim():t.otherDim;if(null!=a){var s=n.getDataExtent(a),l=.3*(s[1]-s[0]);s=[s[0]-l,s[1]+l];var u,h=[0,e[1]],d=[0,e[0]],f=[[e[0],0],[0,0]],p=[],g=d[1]/(n.count()-1),m=0,v=Math.round(n.count()/e[0]);n.each([a],function(t,e){if(v>0&&e%v)return void(m+=g);var i=null==t||isNaN(t)||""===t,n=i?0:c(t,s,h,!0);i&&!u&&e?(f.push([f[f.length-1][0],0]),p.push([p[p.length-1][0],0])):!i&&u&&(f.push([m,0]),p.push([m,0])),f.push([m,n]),p.push([m,n]),m+=g,u=i});var y=this.dataZoomModel;this._displayables.barGroup.add(new r.Polygon({shape:{points:f},style:o.defaults({fill:y.get("dataBackgroundColor")},y.getModel("dataBackground.areaStyle").getAreaStyle()),silent:!0,z2:-20})),this._displayables.barGroup.add(new r.Polyline({shape:{points:p},style:y.getModel("dataBackground.lineStyle").getLineStyle(),silent:!0,z2:-19}))}}},_prepareDataShadowInfo:function(){var t=this.dataZoomModel,e=t.get("showDataShadow");if(e!==!1){var i,a=this.ecModel;return t.eachTargetAxis(function(r,s){var l=t.getAxisProxy(r.name,s).getTargetSeriesModels();o.each(l,function(t){if(!(i||e!==!0&&o.indexOf(M,t.get("type"))<0)){
var l,u=a.getComponent(r.axis,s).axis,h=n(r.name),c=t.coordinateSystem;null!=h&&c.getOtherAxis&&(l=c.getOtherAxis(u).inverse),i={thisAxis:u,series:t,thisDim:r.name,otherDim:h,otherAxisInverse:l}}},this)},this),i}},_renderHandle:function(){var t=this._displayables,e=t.handles=[],i=t.handleLabels=[],n=this._displayables.barGroup,o=this._size,s=this.dataZoomModel;n.add(t.filler=new u({draggable:!0,cursor:a(this._orient),drift:m(this._onDragMove,this,"all"),onmousemove:function(t){p.stop(t.event)},ondragstart:m(this._showDataInfo,this,!0),ondragend:m(this._onDragEnd,this),onmouseover:m(this._showDataInfo,this,!0),onmouseout:m(this._showDataInfo,this,!1),style:{fill:s.get("fillerColor"),textPosition:"inside"}})),n.add(new u(r.subPixelOptimizeRect({silent:!0,shape:{x:0,y:0,width:o[0],height:o[1]},style:{stroke:s.get("dataBackgroundColor")||s.get("borderColor"),lineWidth:x,fill:"rgba(0,0,0,0)"}}))),v([0,1],function(t){var o=r.createIcon(s.get("handleIcon"),{cursor:a(this._orient),draggable:!0,drift:m(this._onDragMove,this,t),onmousemove:function(t){p.stop(t.event)},ondragend:m(this._onDragEnd,this),onmouseover:m(this._showDataInfo,this,!0),onmouseout:m(this._showDataInfo,this,!1)},{x:-1,y:0,width:2,height:2}),l=o.getBoundingRect();this._handleHeight=h.parsePercent(s.get("handleSize"),this._size[1]),this._handleWidth=l.width/l.height*this._handleHeight,o.setStyle(s.getModel("handleStyle").getItemStyle());var u=s.get("handleColor");null!=u&&(o.style.fill=u),n.add(e[t]=o);var c=s.textStyleModel;this.group.add(i[t]=new r.Text({silent:!0,invisible:!0,style:{x:0,y:0,text:"",textVerticalAlign:"middle",textAlign:"center",textFill:c.getTextColor(),textFont:c.getFont()},z2:10}))},this)},_resetInterval:function(){var t=this._range=this.dataZoomModel.getPercentRange(),e=this._getViewExtent();this._handleEnds=[c(t[0],[0,100],e,!0),c(t[1],[0,100],e,!0)]},_updateInterval:function(t,e){var i=this.dataZoomModel,n=this._handleEnds,a=this._getViewExtent(),o=i.findRepresentativeAxisProxy().getMinMaxSpan(),r=[0,100];f(e,n,a,i.get("zoomLock")?"all":t,null!=o.minSpan?c(o.minSpan,r,a,!0):null,null!=o.maxSpan?c(o.maxSpan,r,a,!0):null),this._range=g([c(n[0],a,r,!0),c(n[1],a,r,!0)])},_updateView:function(t){var e=this._displayables,i=this._handleEnds,n=g(i.slice()),a=this._size;v([0,1],function(t){var n=e.handles[t],o=this._handleHeight;n.attr({scale:[o/2,o/2],position:[i[t],a[1]/2-o/2]})},this),e.filler.setShape({x:n[0],y:0,width:n[1]-n[0],height:a[1]}),this._updateDataInfo(t)},_updateDataInfo:function(t){function e(t){var e=r.getTransform(n.handles[t].parent,this.group),i=r.transformDirection(0===t?"right":"left",e),l=this._handleWidth/2+S,u=r.applyTransform([d[t]+(0===t?-l:l),this._size[1]/2],e);a[t].setStyle({x:u[0],y:u[1],textVerticalAlign:o===b?"middle":i,textAlign:o===b?i:"center",text:s[t]})}var i=this.dataZoomModel,n=this._displayables,a=n.handleLabels,o=this._orient,s=["",""];if(i.get("showDetail")){var l=i.findRepresentativeAxisProxy();if(l){var u=l.getAxisModel().axis,h=this._range,c=t?l.calculateDataWindow({start:h[0],end:h[1]}).valueWindow:l.getDataValueWindow();s=[this._formatLabel(c[0],u),this._formatLabel(c[1],u)]}}var d=g(this._handleEnds.slice());e.call(this,0),e.call(this,1)},_formatLabel:function(t,e){var i=this.dataZoomModel,n=i.get("labelFormatter"),a=i.get("labelPrecision");null!=a&&"auto"!==a||(a=e.getPixelPrecision());var r=null==t||isNaN(t)?"":"category"===e.type||"time"===e.type?e.scale.getLabel(Math.round(t)):t.toFixed(Math.min(a,20));return o.isFunction(n)?n(t,r):o.isString(n)?n.replace("{value}",r):r},_showDataInfo:function(t){t=this._dragging||t;var e=this._displayables.handleLabels;e[0].attr("invisible",!t),e[1].attr("invisible",!t)},_onDragMove:function(t,e,i){this._dragging=!0;var n=this._displayables.barGroup.getLocalTransform(),a=r.applyTransform([e,i],n,!0);this._updateInterval(t,a[0]);var o=this.dataZoomModel.get("realtime");this._updateView(!o),o&&o&&this._dispatchZoomAction()},_onDragEnd:function(){this._dragging=!1,this._showDataInfo(!1),this._dispatchZoomAction()},_onClickPanelClick:function(t){var e=this._size,i=this._displayables.barGroup.transformCoordToLocal(t.offsetX,t.offsetY);if(!(i[0]<0||i[0]>e[0]||i[1]<0||i[1]>e[1])){var n=this._handleEnds,a=(n[0]+n[1])/2;this._updateInterval("all",i[0]-a),this._updateView(),this._dispatchZoomAction()}},_dispatchZoomAction:function(){var t=this._range;this.api.dispatchAction({type:"dataZoom",from:this.uid,dataZoomId:this.dataZoomModel.id,start:t[0],end:t[1]})},_findCoordRect:function(){var t;if(v(this.getTargetCoordInfo(),function(e){if(!t&&e.length){var i=e[0].model.coordinateSystem;t=i.getRect&&i.getRect()}}),!t){var e=this.api.getWidth(),i=this.api.getHeight();t={x:.2*e,y:.2*i,width:.6*e,height:.6*i}}return t}});t.exports=I},function(t,e,i){function n(t){var e=t.getZr();return e[g]||(e[g]={})}function a(t,e){var i=new d(t.getZr());return i.on("pan",p(r,e)),i.on("zoom",p(s,e)),i}function o(t){c.each(t,function(e,i){e.count||(e.controller.dispose(),delete t[i])})}function r(t,e,i,n,a,o,r){l(t,function(s){return s.panGetRange(t.controller,e,i,n,a,o,r)})}function s(t,e,i,n){l(t,function(a){return a.zoomGetRange(t.controller,e,i,n)})}function l(t,e){var i=[];c.each(t.dataZoomInfos,function(t){var n=e(t);!t.disabled&&n&&i.push({dataZoomId:t.dataZoomId,start:n[0],end:n[1]})}),t.dispatchAction(i)}function u(t,e){t.dispatchAction({type:"dataZoom",batch:e})}function h(t){var e,i={},n={true:2,move:1,false:0,undefined:-1};return c.each(t,function(t){var a=!t.disabled&&(!t.zoomLock||"move");n[a]>n[e]&&(e=a),c.extend(i,t.roamControllerOpt)}),{controlType:e,opt:i}}var c=i(1),d=i(100),f=i(37),p=c.curry,g="\0_ec_dataZoom_roams",m={register:function(t,e){var i=n(t),r=e.dataZoomId,s=e.coordId;c.each(i,function(t,i){var n=t.dataZoomInfos;n[r]&&c.indexOf(e.allCoordIds,s)<0&&(delete n[r],t.count--)}),o(i);var l=i[s];l||(l=i[s]={coordId:s,dataZoomInfos:{},count:0},l.controller=a(t,l),l.dispatchAction=c.curry(u,t)),!l.dataZoomInfos[r]&&l.count++,l.dataZoomInfos[r]=e;var d=h(l.dataZoomInfos);l.controller.enable(d.controlType,d.opt),l.controller.setPointerChecker(e.containsPoint),f.createOrUpdate(l,"dispatchAction",e.throttleRate,"fixRate")},unregister:function(t,e){var i=n(t);c.each(i,function(t){t.controller.dispose();var i=t.dataZoomInfos;i[e]&&(delete i[e],t.count--)}),o(i)},shouldRecordRange:function(t,e){if(t&&"dataZoom"===t.type&&t.batch)for(var i=0,n=t.batch.length;i<n;i++)if(t.batch[i].dataZoomId===e)return!1;return!0},generateCoordId:function(t){return t.type+"\0_"+t.id}};t.exports=m},function(t,e,i){i(131),i(48),i(49),i(207),i(208),i(129),i(128)},function(t,e,i){function n(t,e,i,n){var a=i.type,o=f[a.charAt(0).toUpperCase()+a.slice(1)],r=new o(i);e.add(r),n.set(t,r),r.__ecGraphicId=t}function a(t,e){var i=t&&t.parent;i&&("group"===t.type&&t.traverse(function(t){a(t,e)}),e.removeKey(t.__ecGraphicId),i.remove(t))}function o(t){return t=c.extend({},t),c.each(["id","parentId","$action","hv","bounding"].concat(p.LOCATION_PARAMS),function(e){delete t[e]}),t}function r(t,e){var i;return c.each(e,function(e){null!=t[e]&&"auto"!==t[e]&&(i=!0)}),i}function s(t,e){var i=t.exist;if(e.id=t.keyInfo.id,!e.type&&i&&(e.type=i.type),null==e.parentId){var n=e.parentOption;n?e.parentId=n.id:i&&(e.parentId=i.parentId)}e.parentOption=null}function l(t,e,i){var n=c.extend({},i),a=t[e],o=i.$action||"merge";if("merge"===o)if(a){c.merge(a,n,!0),p.mergeLayoutParam(a,n,{ignoreSize:!0}),p.copyLayoutParams(i,a)}else t[e]=n;else"replace"===o?t[e]=n:"remove"===o&&a&&(t[e]=null)}function u(t,e){t&&(t.hv=e.hv=[r(e,["left","right"]),r(e,["top","bottom"])],"group"===t.type&&(null==t.width&&(t.width=e.width=0),null==t.height&&(t.height=e.height=0)))}var h=i(2),c=i(1),d=i(5),f=i(3),p=i(9);h.registerPreprocessor(function(t){var e=t.graphic;c.isArray(e)?e[0]&&e[0].elements?t.graphic=[t.graphic[0]]:t.graphic=[{elements:e}]:e&&!e.elements&&(t.graphic=[{elements:[e]}])});var g=h.extendComponentModel({type:"graphic",defaultOption:{elements:[],parentId:null},_elOptionsToUpdate:null,mergeOption:function(t){var e=this.option.elements;this.option.elements=null,g.superApply(this,"mergeOption",arguments),this.option.elements=e},optionUpdated:function(t,e){var i=this.option,n=(e?i:t).elements,a=i.elements=e?[]:i.elements,o=[];this._flatten(n,o);var r=d.mappingToExists(a,o);d.makeIdAndName(r);var h=this._elOptionsToUpdate=[];c.each(r,function(t,e){var i=t.option;i&&(h.push(i),s(t,i),l(a,e,i),u(a[e],i))},this);for(var f=a.length-1;f>=0;f--)null==a[f]?a.splice(f,1):delete a[f].$action},_flatten:function(t,e,i){c.each(t,function(t){if(t){i&&(t.parentOption=i),e.push(t);var n=t.children;"group"===t.type&&n&&this._flatten(n,e,t),delete t.children}},this)},useElOptionsToUpdate:function(){var t=this._elOptionsToUpdate;return this._elOptionsToUpdate=null,t}});h.extendComponentView({type:"graphic",init:function(t,e){this._elMap=c.createHashMap(),this._lastGraphicModel},render:function(t,e,i){t!==this._lastGraphicModel&&this._clear(),this._lastGraphicModel=t,this._updateElements(t,i),this._relocate(t,i)},_updateElements:function(t,e){var i=t.useElOptionsToUpdate();if(i){var r=this._elMap,s=this.group;c.each(i,function(t){var e=t.$action,i=t.id,l=r.get(i),u=t.parentId,h=null!=u?r.get(u):s;if("text"===t.type){var c=t.style;t.hv&&t.hv[1]&&(c.textVerticalAlign=c.textBaseline=null),!c.hasOwnProperty("textFill")&&c.fill&&(c.textFill=c.fill),!c.hasOwnProperty("textStroke")&&c.stroke&&(c.textStroke=c.stroke)}var d=o(t);e&&"merge"!==e?"replace"===e?(a(l,r),n(i,h,d,r)):"remove"===e&&a(l,r):l?l.attr(d):n(i,h,d,r);var f=r.get(i);f&&(f.__ecGraphicWidth=t.width,f.__ecGraphicHeight=t.height)})}},_relocate:function(t,e){for(var i=t.option.elements,n=this.group,a=this._elMap,o=i.length-1;o>=0;o--){var r=i[o],s=a.get(r.id);if(s){var l=s.parent,u=l===n?{width:e.getWidth(),height:e.getHeight()}:{width:l.__ecGraphicWidth||0,height:l.__ecGraphicHeight||0};p.positionElement(s,r,u,null,{hv:r.hv,boundingMode:r.bounding})}}},_clear:function(){var t=this._elMap;t.each(function(e){a(e,t)}),this._elMap=c.createHashMap()},dispose:function(){this._clear()}})},function(t,e,i){i(32),i(125),i(58)},function(t,e,i){i(136),i(218),i(137);var n=i(2);n.registerProcessor(i(219)),i(13).registerSubTypeDefaulter("legend",function(){return"plain"})},function(t,e,i){function n(t,e,i){var n=t.getOrient(),a=[1,1];a[n.index]=0,o.mergeLayoutParam(e,i,{type:"box",ignoreSize:a})}var a=i(136),o=i(9),r=a.extend({type:"legend.scroll",setScrollDataIndex:function(t){this.option.scrollDataIndex=t},defaultOption:{scrollDataIndex:0,pageButtonItemGap:5,pageButtonGap:null,pageButtonPosition:"end",pageFormatter:"{current}/{total}",pageIcons:{horizontal:["M0,0L12,-10L12,10z","M0,0L-12,-10L-12,10z"],vertical:["M0,0L20,0L10,-20z","M0,0L20,0L10,20z"]},pageIconColor:"#2f4554",pageIconInactiveColor:"#aaa",pageIconSize:15,pageTextStyle:{color:"#333"},animationDurationUpdate:800},init:function(t,e,i,a){var s=o.getLayoutParams(t);r.superCall(this,"init",t,e,i,a),n(this,t,s)},mergeOption:function(t,e){r.superCall(this,"mergeOption",t,e),n(this,this.option,t)},getOrient:function(){return"vertical"===this.get("orient")?{index:1,name:"vertical"}:{index:0,name:"horizontal"}}});t.exports=r},function(t,e,i){var n=i(1),a=i(3),o=i(9),r=i(137),s=a.Group,l=["width","height"],u=["x","y"],h=r.extend({type:"legend.scroll",newlineDisabled:!0,init:function(){h.superCall(this,"init"),this._currentIndex=0,this.group.add(this._containerGroup=new s),this._containerGroup.add(this.getContentGroup()),this.group.add(this._controllerGroup=new s)},resetInner:function(){h.superCall(this,"resetInner"),this._controllerGroup.removeAll(),this._containerGroup.removeClipPath(),this._containerGroup.__rectSize=null},renderInner:function(t,e,i,o){function r(t,i){var r=t+"DataIndex",h=a.createIcon(e.get("pageIcons",!0)[e.getOrient().name][i],{onclick:n.bind(s._pageGo,s,r,e,o)},{x:-u[0]/2,y:-u[1]/2,width:u[0],height:u[1]});h.name=t,l.add(h)}var s=this;h.superCall(this,"renderInner",t,e,i,o);var l=this._controllerGroup,u=e.get("pageIconSize",!0);n.isArray(u)||(u=[u,u]),r("pagePrev",0);var c=e.getModel("pageTextStyle");l.add(new a.Text({name:"pageText",style:{textFill:c.getTextColor(),font:c.getFont(),textVerticalAlign:"middle",textAlign:"center"},silent:!0})),r("pageNext",1)},layoutInner:function(t,e,i){var r=this.getContentGroup(),s=this._containerGroup,h=this._controllerGroup,c=t.getOrient().index,d=l[c],f=l[1-c],p=u[1-c];o.box(t.get("orient"),r,t.get("itemGap"),c?i.width:null,c?null:i.height),o.box("horizontal",h,t.get("pageButtonItemGap",!0));var g=r.getBoundingRect(),m=h.getBoundingRect(),v=g[d]>i[d],y=[-g.x,-g.y];y[c]=r.position[c];var x=[0,0],_=[-m.x,-m.y],b=n.retrieve2(t.get("pageButtonGap",!0),t.get("itemGap",!0));if(v){var w=t.get("pageButtonPosition",!0);"end"===w?_[c]+=i[d]-m[d]:x[c]+=m[d]+b}_[1-c]+=g[f]/2-m[f]/2,r.attr("position",y),s.attr("position",x),h.attr("position",_);var S=this.group.getBoundingRect(),S={x:0,y:0};if(S[d]=v?i[d]:g[d],S[f]=Math.max(g[f],m[f]),S[p]=Math.min(0,m[p]+_[1-c]),s.__rectSize=i[d],v){var M={x:0,y:0};M[d]=Math.max(i[d]-m[d]-b,0),M[f]=S[f],s.setClipPath(new a.Rect({shape:M})),s.__rectSize=M[d]}else h.eachChild(function(t){t.attr({invisible:!0,silent:!0})});var I=this._getPageInfo(t);return null!=I.pageIndex&&a.updateProps(r,{position:I.contentPosition},t),this._updatePageInfoView(t,I),S},_pageGo:function(t,e,i){var n=this._getPageInfo(e)[t];null!=n&&i.dispatchAction({type:"legendScroll",scrollDataIndex:n,legendId:e.id})},_updatePageInfoView:function(t,e){var i=this._controllerGroup;n.each(["pagePrev","pageNext"],function(n){var a=null!=e[n+"DataIndex"],o=i.childOfName(n);o&&(o.setStyle("fill",a?t.get("pageIconColor",!0):t.get("pageIconInactiveColor",!0)),o.cursor=a?"pointer":"default")});var a=i.childOfName("pageText"),o=t.get("pageFormatter"),r=e.pageIndex,s=null!=r?r+1:0,l=e.pageCount;a&&o&&a.setStyle("text",n.isString(o)?o.replace("{current}",s).replace("{total}",l):o({current:s,total:l}))},_getPageInfo:function(t){function e(t){var e=t.getBoundingRect().clone();return e[g]+=t.position[d],e}var i,n,a,o,r=t.get("scrollDataIndex",!0),s=this.getContentGroup(),h=s.getBoundingRect(),c=this._containerGroup.__rectSize,d=t.getOrient().index,f=l[d],p=l[1-d],g=u[d],m=s.position.slice();s.eachChild(function(t){t.__legendDataIndex===r&&(o=t)});var v=c?Math.ceil(h[f]/c):0;if(o){var y=o.getBoundingRect(),x=o.position[d]+y[g];m[d]=-x-h[g],i=Math.floor(v*(x+y[g]+c/2)/h[f]),i=h[f]&&v?Math.max(0,Math.min(v-1,i)):-1;var _={x:0,y:0};_[f]=c,_[p]=h[p],_[g]=-m[d]-h[g];var b,w=s.children();if(s.eachChild(function(t,i){var n=e(t);n.intersect(_)&&(null==b&&(b=i),a=t.__legendDataIndex),i===w.length-1&&n[g]+n[f]<=_[g]+_[f]&&(a=null)}),null!=b){var S=w[b],M=e(S);if(_[g]=M[g]+M[f]-_[f],b<=0&&M[g]>=_[g])n=null;else{for(;b>0&&e(w[b-1]).intersect(_);)b--;n=w[b].__legendDataIndex}}}return{contentPosition:m,pageIndex:i,pageCount:v,pagePrevDataIndex:n,pageNextDataIndex:a}}});t.exports=h},function(t,e,i){function n(t,e,i){var n,a={},r="toggleSelected"===t;return i.eachComponent("legend",function(i){r&&null!=n?i[n?"select":"unSelect"](e.name):(i[t](e.name),n=i.isSelected(e.name));var s=i.getData();o.each(s,function(t){var e=t.get("name");if("\n"!==e&&""!==e){var n=i.isSelected(e);a.hasOwnProperty(e)?a[e]=a[e]&&n:a[e]=n}})}),{name:e.name,selected:a}}var a=i(2),o=i(1);a.registerAction("legendToggleSelect","legendselectchanged",o.curry(n,"toggleSelected")),a.registerAction("legendSelect","legendselected",o.curry(n,"select")),a.registerAction("legendUnSelect","legendunselected",o.curry(n,"unSelect"))},function(t,e){t.exports=function(t){var e=t.findComponents({mainType:"legend"});e&&e.length&&t.filterSeries(function(t){for(var i=0;i<e.length;i++)if(!e[i].isSelected(t.name))return!1;return!0})}},function(t,e,i){i(2).registerAction("legendScroll","legendscroll",function(t,e){var i=t.scrollDataIndex;null!=i&&e.eachComponent({mainType:"legend",subType:"scroll",query:t},function(t){t.setScrollDataIndex(i)})})},function(t,e,i){i(215),i(216),i(217),i(220)},function(t,e,i){i(225),i(226),i(2).registerPreprocessor(function(t){t.markArea=t.markArea||{}})},function(t,e,i){i(227),i(228),i(2).registerPreprocessor(function(t){t.markLine=t.markLine||{}})},function(t,e,i){i(229),i(230),i(2).registerPreprocessor(function(t){t.markPoint=t.markPoint||{}})},function(t,e,i){t.exports=i(84).extend({type:"markArea",defaultOption:{zlevel:0,z:1,tooltip:{trigger:"item"},animation:!1,label:{normal:{show:!0,position:"top"},emphasis:{show:!0,position:"top"}},itemStyle:{normal:{borderWidth:0}}}})},function(t,e,i){function n(t){return!isNaN(t)&&!isFinite(t)}function a(t,e,i,a){var o=1-t;return n(e[o])&&n(i[o])}function o(t,e){var i=e.coord[0],n=e.coord[1];return!("cartesian2d"!==t.type||!i||!n||!a(1,i,n,t)&&!a(0,i,n,t))||(f.dataFilter(t,{coord:i,x:e.x0,y:e.y0})||f.dataFilter(t,{coord:n,x:e.x1,y:e.y1}))}function r(t,e,i,a,o){var r,s=a.coordinateSystem,l=t.getItemModel(e),u=h.parsePercent(l.get(i[0]),o.getWidth()),c=h.parsePercent(l.get(i[1]),o.getHeight());if(isNaN(u)||isNaN(c)){if(a.getMarkerPosition)r=a.getMarkerPosition(t.getValues(i,e));else{var d=t.get(i[0],e),f=t.get(i[1],e);r=s.dataToPoint([d,f],!0)}if("cartesian2d"===s.type){var p=s.getAxis("x"),g=s.getAxis("y"),d=t.get(i[0],e),f=t.get(i[1],e);n(d)?r[0]=p.toGlobalCoord(p.getExtent()["x0"===i[0]?0:1]):n(f)&&(r[1]=g.toGlobalCoord(g.getExtent()["y0"===i[1]?0:1]))}isNaN(u)||(r[0]=u),isNaN(c)||(r[1]=c)}else r=[u,c];return r}function s(t,e,i){var n,a,r=["x0","y0","x1","y1"];t?(n=l.map(t&&t.dimensions,function(t){var i=e.getData().getDimensionInfo(e.coordDimToDataDim(t)[0])||{};return i.name=t,i}),a=new u(l.map(r,function(t,e){return{name:t,type:n[e%2].type}}),i)):(n=[{name:"value",type:"float"}],a=new u(n,i));var s=l.map(i.get("data"),l.curry(p,e,t,i));t&&(s=l.filter(s,l.curry(o,t)));var h=t?function(t,e,i,n){return t.coord[Math.floor(n/2)][n%2]}:function(t){return t.value};return a.initData(s,null,h),a.hasItemOption=!0,a}var l=i(1),u=i(14),h=i(4),c=i(3),d=i(22),f=i(86),p=function(t,e,i,n){var a=f.dataTransform(t,n[0]),o=f.dataTransform(t,n[1]),r=l.retrieve,s=a.coord,u=o.coord;s[0]=r(s[0],-(1/0)),s[1]=r(s[1],-(1/0)),u[0]=r(u[0],1/0),u[1]=r(u[1],1/0);var h=l.mergeAll([{},a,o]);return h.coord=[a.coord,o.coord],h.x0=a.x,h.y0=a.y,h.x1=o.x,h.y1=o.y,h},g=[["x0","y0"],["x1","y0"],["x1","y1"],["x0","y1"]];i(85).extend({type:"markArea",updateLayout:function(t,e,i){e.eachSeries(function(t){var e=t.markAreaModel;if(e){var n=e.getData();n.each(function(e){var a=l.map(g,function(a){return r(n,e,a,t,i)});n.setItemLayout(e,a);var o=n.getItemGraphicEl(e);o.setShape("points",a)})}},this)},renderSeries:function(t,e,i,n){var a=t.coordinateSystem,o=t.name,u=t.getData(),h=this.markerGroupMap,f=h.get(o)||h.set(o,{group:new c.Group});this.group.add(f.group),f.__keep=!0;var p=s(a,t,e);e.setData(p),p.each(function(e){p.setItemLayout(e,l.map(g,function(i){return r(p,e,i,t,n)})),p.setItemVisual(e,{color:u.getVisual("color")})}),p.diff(f.__data).add(function(t){var e=new c.Polygon({shape:{points:p.getItemLayout(t)}});p.setItemGraphicEl(t,e),f.group.add(e)}).update(function(t,i){var n=f.__data.getItemGraphicEl(i);c.updateProps(n,{shape:{points:p.getItemLayout(t)}},e,t),f.group.add(n),p.setItemGraphicEl(t,n)}).remove(function(t){var e=f.__data.getItemGraphicEl(t);f.group.remove(e)}).execute(),p.eachItemGraphicEl(function(t,i){var n=p.getItemModel(i),a=n.getModel("label.normal"),o=n.getModel("label.emphasis"),r=p.getItemVisual(i,"color");t.useStyle(l.defaults(n.getModel("itemStyle.normal").getItemStyle(),{fill:d.modifyAlpha(r,.4),stroke:r})),t.hoverStyle=n.getModel("itemStyle.emphasis").getItemStyle(),c.setLabelStyle(t.style,t.hoverStyle,a,o,{labelFetcher:e,labelDataIndex:i,defaultText:p.getName(i)||"",isRectText:!0,autoColor:r}),c.setHoverStyle(t,{}),t.dataModel=e}),f.__data=p,f.group.silent=e.get("silent")||t.get("silent")}})},function(t,e,i){t.exports=i(84).extend({type:"markLine",defaultOption:{zlevel:0,z:5,symbol:["circle","arrow"],symbolSize:[8,16],precision:2,tooltip:{trigger:"item"},label:{normal:{show:!0,position:"end"},emphasis:{show:!0}},lineStyle:{normal:{type:"dashed"},emphasis:{width:3}},animationEasing:"linear"}})},function(t,e,i){function n(t){return!isNaN(t)&&!isFinite(t)}function a(t,e,i,a){var o=1-t,r=a.dimensions[t];return n(e[o])&&n(i[o])&&e[t]===i[t]&&a.getAxis(r).containData(e[t])}function o(t,e){if("cartesian2d"===t.type){var i=e[0].coord,n=e[1].coord;if(i&&n&&(a(1,i,n,t)||a(0,i,n,t)))return!0}return c.dataFilter(t,e[0])&&c.dataFilter(t,e[1])}function r(t,e,i,a,o){var r,s=a.coordinateSystem,l=t.getItemModel(e),u=h.parsePercent(l.get("x"),o.getWidth()),c=h.parsePercent(l.get("y"),o.getHeight());if(isNaN(u)||isNaN(c)){if(a.getMarkerPosition)r=a.getMarkerPosition(t.getValues(t.dimensions,e));else{var d=s.dimensions,f=t.get(d[0],e),p=t.get(d[1],e);r=s.dataToPoint([f,p])}if("cartesian2d"===s.type){var g=s.getAxis("x"),m=s.getAxis("y"),d=s.dimensions;n(t.get(d[0],e))?r[0]=g.toGlobalCoord(g.getExtent()[i?0:1]):n(t.get(d[1],e))&&(r[1]=m.toGlobalCoord(m.getExtent()[i?0:1]))}isNaN(u)||(r[0]=u),isNaN(c)||(r[1]=c)}else r=[u,c];t.setItemLayout(e,r)}function s(t,e,i){var n;n=t?l.map(t&&t.dimensions,function(t){var i=e.getData().getDimensionInfo(e.coordDimToDataDim(t)[0])||{};return i.name=t,i}):[{name:"value",type:"float"}];var a=new u(n,i),r=new u(n,i),s=new u([],i),h=l.map(i.get("data"),l.curry(f,e,t,i));t&&(h=l.filter(h,l.curry(o,t)));var d=t?c.dimValueGetter:function(t){return t.value};return a.initData(l.map(h,function(t){return t[0]}),null,d),r.initData(l.map(h,function(t){return t[1]}),null,d),s.initData(l.map(h,function(t){return t[2]})),s.hasItemOption=!0,{from:a,to:r,line:s}}var l=i(1),u=i(14),h=i(4),c=i(86),d=i(112),f=function(t,e,i,n){var a=t.getData(),o=n.type;if(!l.isArray(n)&&("min"===o||"max"===o||"average"===o||null!=n.xAxis||null!=n.yAxis)){var r,s,u;if(null!=n.yAxis||null!=n.xAxis)s=null!=n.yAxis?"y":"x",r=e.getAxis(s),u=l.retrieve(n.yAxis,n.xAxis);else{var h=c.getAxisInfo(n,a,e,t);s=h.valueDataDim,r=h.valueAxis,u=c.numCalculate(a,s,o)}var d="x"===s?0:1,f=1-d,p=l.clone(n),g={};p.type=null,p.coord=[],g.coord=[],p.coord[f]=-(1/0),g.coord[f]=1/0;var m=i.get("precision");m>=0&&"number"==typeof u&&(u=+u.toFixed(Math.min(m,20))),p.coord[d]=g.coord[d]=u,n=[p,g,{type:o,valueIndex:n.valueIndex,value:u}]}return n=[c.dataTransform(t,n[0]),c.dataTransform(t,n[1]),l.extend({},n[2])],n[2].type=n[2].type||"",l.merge(n[2],n[0]),l.merge(n[2],n[1]),n};i(85).extend({type:"markLine",updateLayout:function(t,e,i){e.eachSeries(function(t){var e=t.markLineModel;if(e){var n=e.getData(),a=e.__from,o=e.__to;a.each(function(e){r(a,e,!0,t,i),r(o,e,!1,t,i)}),n.each(function(t){n.setItemLayout(t,[a.getItemLayout(t),o.getItemLayout(t)])}),this.markerGroupMap.get(t.id).updateLayout()}},this)},renderSeries:function(t,e,i,n){function a(e,i,a){var o=e.getItemModel(i);r(e,i,a,t,n),e.setItemVisual(i,{symbolSize:o.get("symbolSize")||x[a?0:1],symbol:o.get("symbol",!0)||y[a?0:1],color:o.get("itemStyle.normal.color")||h.getVisual("color")})}var o=t.coordinateSystem,u=t.id,h=t.getData(),c=this.markerGroupMap,f=c.get(u)||c.set(u,new d);this.group.add(f.group);var p=s(o,t,e),g=p.from,m=p.to,v=p.line;e.__from=g,e.__to=m,e.setData(v);var y=e.get("symbol"),x=e.get("symbolSize");l.isArray(y)||(y=[y,y]),"number"==typeof x&&(x=[x,x]),p.from.each(function(t){a(g,t,!0),a(m,t,!1)}),v.each(function(t){var e=v.getItemModel(t).get("lineStyle.normal.color");v.setItemVisual(t,{color:e||g.getItemVisual(t,"color")}),v.setItemLayout(t,[g.getItemLayout(t),m.getItemLayout(t)]),v.setItemVisual(t,{fromSymbolSize:g.getItemVisual(t,"symbolSize"),fromSymbol:g.getItemVisual(t,"symbol"),toSymbolSize:m.getItemVisual(t,"symbolSize"),toSymbol:m.getItemVisual(t,"symbol")})}),f.updateData(v),p.line.eachItemGraphicEl(function(t,i){t.traverse(function(t){t.dataModel=e})}),f.__keep=!0,f.group.silent=e.get("silent")||t.get("silent")}})},function(t,e,i){t.exports=i(84).extend({type:"markPoint",defaultOption:{zlevel:0,z:5,symbol:"pin",symbolSize:50,tooltip:{trigger:"item"},label:{normal:{show:!0,position:"inside"},emphasis:{show:!0}},itemStyle:{normal:{borderWidth:2}}}})},function(t,e,i){function n(t,e,i){var n=e.coordinateSystem;t.each(function(a){var o,r=t.getItemModel(a),l=s.parsePercent(r.get("x"),i.getWidth()),u=s.parsePercent(r.get("y"),i.getHeight());if(isNaN(l)||isNaN(u)){if(e.getMarkerPosition)o=e.getMarkerPosition(t.getValues(t.dimensions,a));else if(n){var h=t.get(n.dimensions[0],a),c=t.get(n.dimensions[1],a);o=n.dataToPoint([h,c])}}else o=[l,u];isNaN(l)||(o[0]=l),isNaN(u)||(o[1]=u),t.setItemLayout(a,o)})}function a(t,e,i){var n;n=t?r.map(t&&t.dimensions,function(t){var i=e.getData().getDimensionInfo(e.coordDimToDataDim(t)[0])||{};return i.name=t,i}):[{name:"value",type:"float"}];var a=new l(n,i),o=r.map(i.get("data"),r.curry(u.dataTransform,e));return t&&(o=r.filter(o,r.curry(u.dataFilter,t))),a.initData(o,null,t?u.dimValueGetter:function(t){return t.value}),a}var o=i(46),r=i(1),s=i(4),l=i(14),u=i(86);i(85).extend({type:"markPoint",updateLayout:function(t,e,i){e.eachSeries(function(t){var e=t.markPointModel;e&&(n(e.getData(),t,i),this.markerGroupMap.get(t.id).updateLayout(e))},this)},renderSeries:function(t,e,i,r){var s=t.coordinateSystem,l=t.id,u=t.getData(),h=this.markerGroupMap,c=h.get(l)||h.set(l,new o),d=a(s,t,e);e.setData(d),n(e.getData(),t,r),d.each(function(t){var i=d.getItemModel(t),n=i.getShallow("symbolSize");"function"==typeof n&&(n=n(e.getRawValue(t),e.getDataParams(t))),d.setItemVisual(t,{symbolSize:n,color:i.get("itemStyle.normal.color")||u.getVisual("color"),symbol:i.getShallow("symbol")})}),c.updateData(d),this.group.add(c.group),d.eachItemGraphicEl(function(t){t.traverse(function(t){t.dataModel=e})}),c.__keep=!0,c.group.silent=e.get("silent")||t.get("silent")}})},function(t,e,i){"use strict";var n=i(2),a=i(3),o=i(9);n.extendComponentModel({type:"title",layoutMode:{type:"box",ignoreSize:!0},defaultOption:{zlevel:0,z:6,show:!0,text:"",target:"blank",subtext:"",subtarget:"blank",left:0,top:0,backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,itemGap:10,textStyle:{fontSize:18,fontWeight:"bolder",color:"#333"},subtextStyle:{color:"#aaa"}}}),n.extendComponentView({type:"title",render:function(t,e,i){if(this.group.removeAll(),t.get("show")){var n=this.group,r=t.getModel("textStyle"),s=t.getModel("subtextStyle"),l=t.get("textAlign"),u=t.get("textBaseline"),h=new a.Text({style:a.setTextStyle({},r,{text:t.get("text"),textFill:r.getTextColor()},{disableBox:!0}),z2:10}),c=h.getBoundingRect(),d=t.get("subtext"),f=new a.Text({style:a.setTextStyle({},s,{text:d,textFill:s.getTextColor(),y:c.height+t.get("itemGap"),textVerticalAlign:"top"},{disableBox:!0}),z2:10}),p=t.get("link"),g=t.get("sublink");h.silent=!p,f.silent=!g,p&&h.on("click",function(){window.open(p,"_"+t.get("target"))}),g&&f.on("click",function(){window.open(g,"_"+t.get("subtarget"))}),n.add(h),d&&n.add(f);var m=n.getBoundingRect(),v=t.getBoxLayoutParams();v.width=m.width,v.height=m.height;var y=o.getLayoutRect(v,{width:i.getWidth(),height:i.getHeight()},t.get("padding"));l||(l=t.get("left")||t.get("right"),"middle"===l&&(l="center"),"right"===l?y.x+=y.width:"center"===l&&(y.x+=y.width/2)),u||(u=t.get("top")||t.get("bottom"),"center"===u&&(u="middle"),"bottom"===u?y.y+=y.height:"middle"===u&&(y.y+=y.height/2),u=u||"top"),n.attr("position",[y.x,y.y]);var x={textAlign:l,textVerticalAlign:u};h.setStyle(x),f.setStyle(x),m=n.getBoundingRect();var _=y.margin,b=t.getItemStyle(["color","opacity"]);b.fill=t.get("backgroundColor");var w=new a.Rect({shape:{x:m.x-_[3],y:m.y-_[0],width:m.width+_[1]+_[3],height:m.height+_[0]+_[2],r:t.get("borderRadius")},style:b,silent:!0});a.subPixelOptimizeRect(w),n.add(w)}}})},function(t,e,i){i(233),i(234),i(239),i(237),i(235),i(236),i(238)},function(t,e,i){var n=i(29),a=i(1),o=i(2).extendComponentModel({type:"toolbox",layoutMode:{type:"box",ignoreSize:!0},mergeDefaultAndTheme:function(t){o.superApply(this,"mergeDefaultAndTheme",arguments),a.each(this.option.feature,function(t,e){var i=n.get(e);i&&a.merge(t,i.defaultOption)})},defaultOption:{show:!0,z:6,zlevel:0,orient:"horizontal",left:"right",top:"top",backgroundColor:"transparent",borderColor:"#ccc",borderRadius:0,borderWidth:0,padding:5,itemSize:15,itemGap:8,showTitle:!0,iconStyle:{normal:{borderColor:"#666",color:"none"},emphasis:{borderColor:"#3E98C5"}}}});t.exports=o},function(t,e,i){(function(e){function n(t){return 0===t.indexOf("my")}var a=i(29),o=i(1),r=i(3),s=i(11),l=i(43),u=i(135),h=i(16);t.exports=i(2).extendComponentView({type:"toolbox",render:function(t,e,i,c){function d(o,r){var l,u=y[o],h=y[r],d=m[u],p=new s(d,t,t.ecModel);if(u&&!h){if(n(u))l={model:p,onclick:p.option.onclick,featureName:u};else{var g=a.get(u);if(!g)return;l=new g(p,e,i)}v[u]=l}else{if(l=v[h],!l)return;l.model=p,l.ecModel=e,l.api=i}return!u&&h?void(l.dispose&&l.dispose(e,i)):!p.get("show")||l.unusable?void(l.remove&&l.remove(e,i)):(f(p,l,u),p.setIconStatus=function(t,e){var i=this.option,n=this.iconPaths;i.iconStatus=i.iconStatus||{},i.iconStatus[t]=e,n[t]&&n[t].trigger(e)},void(l.render&&l.render(p,e,i,c)))}function f(n,a,s){var l=n.getModel("iconStyle"),u=a.getIcons?a.getIcons():n.get("icon"),h=n.get("title")||{};if("string"==typeof u){var c=u,d=h;u={},h={},u[s]=c,h[s]=d}var f=n.iconPaths={};o.each(u,function(s,u){var c=r.createIcon(s,{},{x:-g/2,y:-g/2,width:g,height:g});c.setStyle(l.getModel("normal").getItemStyle()),c.hoverStyle=l.getModel("emphasis").getItemStyle(),r.setHoverStyle(c),t.get("showTitle")&&(c.__title=h[u],c.on("mouseover",function(){var t=l.getModel("emphasis").getItemStyle();c.setStyle({text:h[u],textPosition:t.textPosition||"bottom",textFill:t.fill||t.stroke||"#000",textAlign:t.textAlign||"center"})}).on("mouseout",function(){c.setStyle({textFill:null})})),c.trigger(n.get("iconStatus."+u)||"normal"),p.add(c),c.on("click",o.bind(a.onclick,a,e,i,u)),f[u]=c})}var p=this.group;if(p.removeAll(),t.get("show")){var g=+t.get("itemSize"),m=t.get("feature")||{},v=this._features||(this._features={}),y=[];o.each(m,function(t,e){y.push(e)}),new l(this._featureNames||[],y).add(d).update(d).remove(o.curry(d,null)).execute(),this._featureNames=y,u.layout(p,t,i),p.add(u.makeBackground(p.getBoundingRect(),t)),p.eachChild(function(t){var e=t.__title,n=t.hoverStyle;if(n&&e){var a=h.getBoundingRect(e,h.makeFont(n)),o=t.position[0]+p.position[0],r=t.position[1]+p.position[1]+g,s=!1;r+a.height>i.getHeight()&&(n.textPosition="top",s=!0);var l=s?-5-a.height:g+8;o+a.width/2>i.getWidth()?(n.textPosition=["100%",l],n.textAlign="right"):o-a.width/2<0&&(n.textPosition=[0,l],n.textAlign="left")}})}},updateView:function(t,e,i,n){o.each(this._features,function(t){t.updateView&&t.updateView(t.model,e,i,n)})},updateLayout:function(t,e,i,n){o.each(this._features,function(t){t.updateLayout&&t.updateLayout(t.model,e,i,n)})},remove:function(t,e){o.each(this._features,function(i){i.remove&&i.remove(t,e)}),this.group.removeAll()},dispose:function(t,e){o.each(this._features,function(i){i.dispose&&i.dispose(t,e)})}})}).call(e,i(194))},function(t,e,i){function n(t){var e={},i=[],n=[];return t.eachRawSeries(function(t){var a=t.coordinateSystem;if(!a||"cartesian2d"!==a.type&&"polar"!==a.type)i.push(t);else{var o=a.getBaseAxis();if("category"===o.type){var r=o.dim+"_"+o.index;e[r]||(e[r]={categoryAxis:o,valueAxis:a.getOtherAxis(o),series:[]},n.push({axisDim:o.dim,axisIndex:o.index})),e[r].series.push(t)}else i.push(t)}}),{seriesGroupByCategoryAxis:e,other:i,meta:n}}function a(t){var e=[];return p.each(t,function(t,i){var n=t.categoryAxis,a=t.valueAxis,o=a.dim,r=[" "].concat(p.map(t.series,function(t){return t.name})),s=[n.model.getCategories()];p.each(t.series,function(t){s.push(t.getRawData().mapArray(o,function(t){return t}))});for(var l=[r.join(y)],u=0;u<s[0].length;u++){for(var h=[],c=0;c<s.length;c++)h.push(s[c][u]);l.push(h.join(y))}e.push(l.join("\n"))}),e.join("\n\n"+v+"\n\n")}function o(t){return p.map(t,function(t){var e=t.getRawData(),i=[t.name],n=[];
return e.each(e.dimensions,function(){for(var t=arguments.length,a=arguments[t-1],o=e.getName(a),r=0;r<t-1;r++)n[r]=arguments[r];i.push((o?o+y:"")+n.join(y))}),i.join("\n")}).join("\n\n"+v+"\n\n")}function r(t){var e=n(t);return{value:p.filter([a(e.seriesGroupByCategoryAxis),o(e.other)],function(t){return t.replace(/[\n\t\s]/g,"")}).join("\n\n"+v+"\n\n"),meta:e.meta}}function s(t){return t.replace(/^\s\s*/,"").replace(/\s\s*$/,"")}function l(t){var e=t.slice(0,t.indexOf("\n"));if(e.indexOf(y)>=0)return!0}function u(t){for(var e=t.split(/\n+/g),i=s(e.shift()).split(x),n=[],a=p.map(i,function(t){return{name:t,data:[]}}),o=0;o<e.length;o++){var r=s(e[o]).split(x);n.push(r.shift());for(var l=0;l<r.length;l++)a[l]&&(a[l].data[o]=r[l])}return{series:a,categories:n}}function h(t){for(var e=t.split(/\n+/g),i=s(e.shift()),n=[],a=0;a<e.length;a++){var o,r=s(e[a]).split(x),l="",u=!1;isNaN(r[0])?(u=!0,l=r[0],r=r.slice(1),n[a]={name:l,value:[]},o=n[a].value):o=n[a]=[];for(var h=0;h<r.length;h++)o.push(+r[h]);1===o.length&&(u?n[a].value=o[0]:n[a]=o[0])}return{name:i,data:n}}function c(t,e){var i=t.split(new RegExp("\n*"+v+"\n*","g")),n={series:[]};return p.each(i,function(t,i){if(l(t)){var a=u(t),o=e[i],r=o.axisDim+"Axis";o&&(n[r]=n[r]||[],n[r][o.axisIndex]={data:a.categories},n.series=n.series.concat(a.series))}else{var a=h(t);n.series.push(a)}}),n}function d(t){this._dom=null,this.model=t}function f(t,e){return p.map(t,function(t,i){var n=e&&e[i];return p.isObject(n)&&!p.isArray(n)?(p.isObject(t)&&!p.isArray(t)&&(t=t.value),p.defaults({value:t},n)):t})}var p=i(1),g=i(21),m=i(44).toolbox.dataView,v=new Array(60).join("-"),y="\t",x=new RegExp("["+y+"]+","g");d.defaultOption={show:!0,readOnly:!1,optionToContent:null,contentToOption:null,icon:"M17.5,17.3H33 M17.5,17.3H33 M45.4,29.5h-28 M11.5,2v56H51V14.8L38.4,2H11.5z M38.4,2.2v12.7H51 M45.4,41.7h-28",title:p.clone(m.title),lang:p.clone(m.lang),backgroundColor:"#fff",textColor:"#000",textareaColor:"#fff",textareaBorderColor:"#333",buttonColor:"#c23531",buttonTextColor:"#fff"},d.prototype.onclick=function(t,e){function i(){n.removeChild(o),M._dom=null}var n=e.getDom(),a=this.model;this._dom&&n.removeChild(this._dom);var o=document.createElement("div");o.style.cssText="position:absolute;left:5px;top:5px;bottom:5px;right:5px;",o.style.backgroundColor=a.get("backgroundColor")||"#fff";var s=document.createElement("h4"),l=a.get("lang")||[];s.innerHTML=l[0]||a.get("title"),s.style.cssText="margin: 10px 20px;",s.style.color=a.get("textColor");var u=document.createElement("div"),h=document.createElement("textarea");u.style.cssText="display:block;width:100%;overflow:auto;";var d=a.get("optionToContent"),f=a.get("contentToOption"),m=r(t);if("function"==typeof d){var v=d(e.getOption());"string"==typeof v?u.innerHTML=v:p.isDom(v)&&u.appendChild(v)}else u.appendChild(h),h.readOnly=a.get("readOnly"),h.style.cssText="width:100%;height:100%;font-family:monospace;font-size:14px;line-height:1.6rem;",h.style.color=a.get("textColor"),h.style.borderColor=a.get("textareaBorderColor"),h.style.backgroundColor=a.get("textareaColor"),h.value=m.value;var x=m.meta,_=document.createElement("div");_.style.cssText="position:absolute;bottom:0;left:0;right:0;";var b="float:right;margin-right:20px;border:none;cursor:pointer;padding:2px 5px;font-size:12px;border-radius:3px",w=document.createElement("div"),S=document.createElement("div");b+=";background-color:"+a.get("buttonColor"),b+=";color:"+a.get("buttonTextColor");var M=this;g.addEventListener(w,"click",i),g.addEventListener(S,"click",function(){var t;try{t="function"==typeof f?f(u,e.getOption()):c(h.value,x)}catch(t){throw i(),new Error("Data view format error "+t)}t&&e.dispatchAction({type:"changeDataView",newOption:t}),i()}),w.innerHTML=l[1],S.innerHTML=l[2],S.style.cssText=b,w.style.cssText=b,!a.get("readOnly")&&_.appendChild(S),_.appendChild(w),g.addEventListener(h,"keydown",function(t){if(9===(t.keyCode||t.which)){var e=this.value,i=this.selectionStart,n=this.selectionEnd;this.value=e.substring(0,i)+y+e.substring(n),this.selectionStart=this.selectionEnd=i+1,g.stop(t)}}),o.appendChild(s),o.appendChild(u),o.appendChild(_),u.style.height=n.clientHeight-80+"px",n.appendChild(o),this._dom=o},d.prototype.remove=function(t,e){this._dom&&e.getDom().removeChild(this._dom)},d.prototype.dispose=function(t,e){this.remove(t,e)},i(29).register("dataView",d),i(2).registerAction({type:"changeDataView",event:"dataViewChanged",update:"prepareAndUpdate"},function(t,e){var i=[];p.each(t.newOption.series,function(t){var n=e.getSeriesByName(t.name)[0];if(n){var a=n.get("data");i.push({name:t.name,data:f(t.data,a)})}else i.push(p.extend({type:"scatter"},t))}),e.mergeOption(p.defaults({series:i},t.newOption))}),t.exports=d},function(t,e,i){"use strict";function n(t,e,i){(this._brushController=new l(i.getZr())).on("brush",s.bind(this._onBrush,this)).mount(),this._isZoomActive}function a(t){var e={};return s.each(["xAxisIndex","yAxisIndex"],function(i){e[i]=t[i],null==e[i]&&(e[i]="all"),(e[i]===!1||"none"===e[i])&&(e[i]=[])}),e}function o(t,e){t.setIconStatus("back",h.count(e)>1?"emphasis":"normal")}function r(t,e,i,n,o){var r=i._isZoomActive;n&&"takeGlobalCursor"===n.type&&(r="dataZoomSelect"===n.key&&n.dataZoomSelectActive),i._isZoomActive=r,t.setIconStatus("zoom",r?"emphasis":"normal");var s=new u(a(t.option),e,{include:["grid"]});i._brushController.setPanels(s.makePanelOpts(o,function(t){return t.xAxisDeclared&&!t.yAxisDeclared?"lineX":!t.xAxisDeclared&&t.yAxisDeclared?"lineY":"rect"})).enableBrush(!!r&&{brushType:"auto",brushStyle:{lineWidth:0,fill:"rgba(0,0,0,0.2)"}})}var s=i(1),l=i(132),u=i(190),h=i(130),c=i(59),d=i(44).toolbox.dataZoom,f=s.each;i(212);var p="\0_ec_\0toolbox-dataZoom_";n.defaultOption={show:!0,icon:{zoom:"M0,13.5h26.9 M13.5,26.9V0 M32.1,13.5H58V58H13.5 V32.1",back:"M22,1.4L9.9,13.5l12.3,12.3 M10.3,13.5H54.9v44.6 H10.3v-26"},title:s.clone(d.title)};var g=n.prototype;g.render=function(t,e,i,n){this.model=t,this.ecModel=e,this.api=i,r(t,e,this,n,i),o(t,e)},g.onclick=function(t,e,i){m[i].call(this)},g.remove=function(t,e){this._brushController.unmount()},g.dispose=function(t,e){this._brushController.dispose()};var m={zoom:function(){var t=!this._isZoomActive;this.api.dispatchAction({type:"takeGlobalCursor",key:"dataZoomSelect",dataZoomSelectActive:t})},back:function(){this._dispatchZoomAction(h.pop(this.ecModel))}};g._onBrush=function(t,e){function i(t,e,i){var a=e.getAxis(t),s=a.model,l=n(t,s,r),u=l.findRepresentativeAxisProxy(s).getMinMaxSpan();null==u.minValueSpan&&null==u.maxValueSpan||(i=c(0,i.slice(),a.scale.getExtent(),0,u.minValueSpan,u.maxValueSpan)),l&&(o[l.id]={dataZoomId:l.id,startValue:i[0],endValue:i[1]})}function n(t,e,i){var n;return i.eachComponent({mainType:"dataZoom",subType:"select"},function(i){var a=i.getAxisModel(t,e.componentIndex);a&&(n=i)}),n}if(e.isEnd&&t.length){var o={},r=this.ecModel;this._brushController.updateCovers([]);var s=new u(a(this.model.option),r,{include:["grid"]});s.matchOutputRanges(t,r,function(t,e,n){if("cartesian2d"===n.type){var a=t.brushType;"rect"===a?(i("x",n,e[0]),i("y",n,e[1])):i({lineX:"x",lineY:"y"}[a],n,e)}}),h.push(r,o),this._dispatchZoomAction(o)}},g._dispatchZoomAction=function(t){var e=[];f(t,function(t,i){e.push(s.clone(t))}),e.length&&this.api.dispatchAction({type:"dataZoom",from:this.uid,batch:e})},i(29).register("dataZoom",n),i(2).registerPreprocessor(function(t){function e(t,e){if(e){var a=t+"Index",o=e[a];null==o||"all"==o||s.isArray(o)||(o=o===!1||"none"===o?[]:[o]),i(t,function(e,i){if(null==o||"all"==o||s.indexOf(o,i)!==-1){var r={type:"select",$fromToolbox:!0,id:p+t+i};r[a]=i,n.push(r)}})}}function i(e,i){var n=t[e];s.isArray(n)||(n=n?[n]:[]),f(n,i)}if(t){var n=t.dataZoom||(t.dataZoom=[]);s.isArray(n)||(t.dataZoom=n=[n]);var a=t.toolbox;if(a&&(s.isArray(a)&&(a=a[0]),a&&a.feature)){var o=a.feature.dataZoom;e("xAxis",o),e("yAxis",o)}}}),t.exports=n},function(t,e,i){"use strict";function n(t){this.model=t}var a=i(1),o=i(44).toolbox.magicType;n.defaultOption={show:!0,type:[],icon:{line:"M4.1,28.9h7.1l9.3-22l7.4,38l9.7-19.7l3,12.8h14.9M4.1,58h51.4",bar:"M6.7,22.9h10V48h-10V22.9zM24.9,13h10v35h-10V13zM43.2,2h10v46h-10V2zM3.1,58h53.7",stack:"M8.2,38.4l-8.4,4.1l30.6,15.3L60,42.5l-8.1-4.1l-21.5,11L8.2,38.4z M51.9,30l-8.1,4.2l-13.4,6.9l-13.9-6.9L8.2,30l-8.4,4.2l8.4,4.2l22.2,11l21.5-11l8.1-4.2L51.9,30z M51.9,21.7l-8.1,4.2L35.7,30l-5.3,2.8L24.9,30l-8.4-4.1l-8.3-4.2l-8.4,4.2L8.2,30l8.3,4.2l13.9,6.9l13.4-6.9l8.1-4.2l8.1-4.1L51.9,21.7zM30.4,2.2L-0.2,17.5l8.4,4.1l8.3,4.2l8.4,4.2l5.5,2.7l5.3-2.7l8.1-4.2l8.1-4.2l8.1-4.1L30.4,2.2z",tiled:"M2.3,2.2h22.8V25H2.3V2.2z M35,2.2h22.8V25H35V2.2zM2.3,35h22.8v22.8H2.3V35z M35,35h22.8v22.8H35V35z"},title:a.clone(o.title),option:{},seriesIndex:{}};var r=n.prototype;r.getIcons=function(){var t=this.model,e=t.get("icon"),i={};return a.each(t.get("type"),function(t){e[t]&&(i[t]=e[t])}),i};var s={line:function(t,e,i,n){if("bar"===t)return a.merge({id:e,type:"line",data:i.get("data"),stack:i.get("stack"),markPoint:i.get("markPoint"),markLine:i.get("markLine")},n.get("option.line")||{},!0)},bar:function(t,e,i,n){if("line"===t)return a.merge({id:e,type:"bar",data:i.get("data"),stack:i.get("stack"),markPoint:i.get("markPoint"),markLine:i.get("markLine")},n.get("option.bar")||{},!0)},stack:function(t,e,i,n){if("line"===t||"bar"===t)return a.merge({id:e,stack:"__ec_magicType_stack__"},n.get("option.stack")||{},!0)},tiled:function(t,e,i,n){if("line"===t||"bar"===t)return a.merge({id:e,stack:""},n.get("option.tiled")||{},!0)}},l=[["line","bar"],["stack","tiled"]];r.onclick=function(t,e,i){var n=this.model,o=n.get("seriesIndex."+i);if(s[i]){var r={series:[]},u=function(e){var o=e.subType,l=e.id,u=s[i](o,l,e,n);u&&(a.defaults(u,e.option),r.series.push(u));var h=e.coordinateSystem;if(h&&"cartesian2d"===h.type&&("line"===i||"bar"===i)){var c=h.getAxesByScale("ordinal")[0];if(c){var d=c.dim,f=d+"Axis",p=t.queryComponents({mainType:f,index:e.get(name+"Index"),id:e.get(name+"Id")})[0],g=p.componentIndex;r[f]=r[f]||[];for(var m=0;m<=g;m++)r[f][g]=r[f][g]||{};r[f][g].boundaryGap="bar"===i}}};a.each(l,function(t){a.indexOf(t,i)>=0&&a.each(t,function(t){n.setIconStatus(t,"normal")})}),n.setIconStatus(i,"emphasis"),t.eachComponent({mainType:"series",query:null==o?null:{seriesIndex:o}},u),e.dispatchAction({type:"changeMagicType",currentType:i,newOption:r})}};var u=i(2);u.registerAction({type:"changeMagicType",event:"magicTypeChanged",update:"prepareAndUpdate"},function(t,e){e.mergeOption(t.newOption)}),i(29).register("magicType",n),t.exports=n},function(t,e,i){"use strict";function n(t){this.model=t}var a=i(130),o=i(44).toolbox.restore;n.defaultOption={show:!0,icon:"M3.8,33.4 M47,18.9h9.8V8.7 M56.3,20.1 C52.1,9,40.5,0.6,26.8,2.1C12.6,3.7,1.6,16.2,2.1,30.6 M13,41.1H3.1v10.2 M3.7,39.9c4.2,11.1,15.8,19.5,29.5,18 c14.2-1.6,25.2-14.1,24.7-28.5",title:o.title};var r=n.prototype;r.onclick=function(t,e,i){a.clear(t),e.dispatchAction({type:"restore",from:this.uid})},i(29).register("restore",n),i(2).registerAction({type:"restore",event:"restore",update:"prepareAndUpdate"},function(t,e){e.resetOption("recreate")}),t.exports=n},function(t,e,i){function n(t){this.model=t}var a=i(10),o=i(44).toolbox.saveAsImage;n.defaultOption={show:!0,icon:"M4.7,22.9L29.3,45.5L54.7,23.4M4.6,43.6L4.6,58L53.8,58L53.8,43.6M29.2,45.1L29.2,0",title:o.title,type:"png",name:"",excludeComponents:["toolbox"],pixelRatio:1,lang:o.lang.slice()},n.prototype.unusable=!a.canvasSupported;var r=n.prototype;r.onclick=function(t,e){var i=this.model,n=i.get("name")||t.get("title.0.text")||"echarts",o=document.createElement("a"),r=i.get("type",!0)||"png";o.download=n+"."+r,o.target="_blank";var s=e.getConnectedDataURL({type:r,backgroundColor:i.get("backgroundColor",!0)||t.get("backgroundColor")||"#fff",excludeComponents:i.get("excludeComponents"),pixelRatio:i.get("pixelRatio")});if(o.href=s,"function"!=typeof MouseEvent||a.browser.ie||a.browser.edge)if(window.navigator.msSaveOrOpenBlob){for(var l=atob(s.split(",")[1]),u=l.length,h=new Uint8Array(u);u--;)h[u]=l.charCodeAt(u);var c=new Blob([h]);window.navigator.msSaveOrOpenBlob(c,n+"."+r)}else{var d=i.get("lang"),f='<body style="margin:0;"><img src="'+s+'" style="max-width:100%;" title="'+(d&&d[0]||"")+'" /></body>',p=window.open();p.document.write(f)}else{var g=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!1});o.dispatchEvent(g)}},i(29).register("saveAsImage",n),t.exports=n},function(t,e,i){i(58),i(242),i(243),i(2).registerAction({type:"showTip",event:"showTip",update:"tooltip:manuallyShowTip"},function(){}),i(2).registerAction({type:"hideTip",event:"hideTip",update:"tooltip:manuallyHideTip"},function(){})},function(t,e,i){function n(t){var e="cubic-bezier(0.23, 1, 0.32, 1)",i="left "+t+"s "+e+",top "+t+"s "+e;return s.map(p,function(t){return t+"transition:"+i}).join(";")}function a(t){var e=[],i=t.get("fontSize"),n=t.getTextColor();return n&&e.push("color:"+n),e.push("font:"+t.getFont()),i&&e.push("line-height:"+Math.round(3*i/2)+"px"),c(["decoration","align"],function(i){var n=t.get(i);n&&e.push("text-"+i+":"+n)}),e.join(";")}function o(t){var e=[],i=t.get("transitionDuration"),o=t.get("backgroundColor"),r=t.getModel("textStyle"),s=t.get("padding");return i&&e.push(n(i)),o&&(f.canvasSupported?e.push("background-Color:"+o):(e.push("background-Color:#"+l.toHex(o)),e.push("filter:alpha(opacity=70)"))),c(["width","color","radius"],function(i){var n="border-"+i,a=d(n),o=t.get(a);null!=o&&e.push(n+":"+o+("color"===i?"":"px"))}),e.push(a(r)),null!=s&&e.push("padding:"+h.normalizeCssArray(s).join("px ")+"px"),e.join(";")+";"}function r(t,e){var i=document.createElement("div"),n=this._zr=e.getZr();this.el=i,this._x=e.getWidth()/2,this._y=e.getHeight()/2,t.appendChild(i),this._container=t,this._show=!1,this._hideTimeout;var a=this;i.onmouseenter=function(){a._enterable&&(clearTimeout(a._hideTimeout),a._show=!0),a._inContent=!0},i.onmousemove=function(e){if(e=e||window.event,!a._enterable){var i=n.handler;u.normalizeEvent(t,e,!0),i.dispatch("mousemove",e)}},i.onmouseleave=function(){a._enterable&&a._show&&a.hideLater(a._hideDelay),a._inContent=!1}}var s=i(1),l=i(22),u=i(21),h=i(7),c=s.each,d=h.toCamelCase,f=i(10),p=["","-webkit-","-moz-","-o-"],g="position:absolute;display:block;border-style:solid;white-space:nowrap;z-index:9999999;";r.prototype={constructor:r,_enterable:!0,update:function(){var t=this._container,e=t.currentStyle||document.defaultView.getComputedStyle(t),i=t.style;"absolute"!==i.position&&"absolute"!==e.position&&(i.position="relative")},show:function(t){clearTimeout(this._hideTimeout);var e=this.el;e.style.cssText=g+o(t)+";left:"+this._x+"px;top:"+this._y+"px;"+(t.get("extraCssText")||""),e.style.display=e.innerHTML?"block":"none",this._show=!0},setContent:function(t){this.el.innerHTML=null==t?"":t},setEnterable:function(t){this._enterable=t},getSize:function(){var t=this.el;return[t.clientWidth,t.clientHeight]},moveTo:function(t,e){var i,n=this._zr;n&&n.painter&&(i=n.painter.getViewportRootOffset())&&(t+=i.offsetLeft,e+=i.offsetTop);var a=this.el.style;a.left=t+"px",a.top=e+"px",this._x=t,this._y=e},hide:function(){this.el.style.display="none",this._show=!1},hideLater:function(t){!this._show||this._inContent&&this._enterable||(t?(this._hideDelay=t,this._show=!1,this._hideTimeout=setTimeout(s.bind(this.hide,this),t)):this.hide())},isShow:function(){return this._show}},t.exports=r},function(t,e,i){i(2).extendComponentModel({type:"tooltip",dependencies:["axisPointer"],defaultOption:{zlevel:0,z:8,show:!0,showContent:!0,trigger:"item",triggerOn:"mousemove|click",alwaysShowContent:!1,displayMode:"single",confine:!1,showDelay:0,hideDelay:100,transitionDuration:.4,enterable:!1,backgroundColor:"rgba(50,50,50,0.7)",borderColor:"#333",borderRadius:4,borderWidth:0,padding:5,extraCssText:"",axisPointer:{type:"line",axis:"auto",animation:"auto",animationDurationUpdate:200,animationEasingUpdate:"exponentialOut",crossStyle:{color:"#999",width:1,type:"dashed",textStyle:{}}},textStyle:{color:"#fff",fontSize:14}}})},function(t,e,i){function n(t){for(var e=t.pop();t.length;){var i=t.pop();i&&(i instanceof y&&(i=i.get("tooltip",!0)),"string"==typeof i&&(i={formatter:i}),e=new y(i,e,e.ecModel))}return e}function a(t,e){return t.dispatchAction||c.bind(e.dispatchAction,e)}function o(t,e,i,n,a,o,r){var l=s(i),u=l.width,h=l.height;return null!=o&&(t+u+o>n?t-=u+o:t+=o),null!=r&&(e+h+r>a?e-=h+r:e+=r),[t,e]}function r(t,e,i,n,a){var o=s(i),r=o.width,l=o.height;return t=Math.min(t+r,n)-r,e=Math.min(e+l,a)-l,t=Math.max(t,0),e=Math.max(e,0),[t,e]}function s(t){var e=t.clientWidth,i=t.clientHeight;if(document.defaultView&&document.defaultView.getComputedStyle){var n=document.defaultView.getComputedStyle(t);n&&(e+=parseInt(n.paddingLeft,10)+parseInt(n.paddingRight,10)+parseInt(n.borderLeftWidth,10)+parseInt(n.borderRightWidth,10),i+=parseInt(n.paddingTop,10)+parseInt(n.paddingBottom,10)+parseInt(n.borderTopWidth,10)+parseInt(n.borderBottomWidth,10))}return{width:e,height:i}}function l(t,e,i){var n=i[0],a=i[1],o=5,r=0,s=0,l=e.width,u=e.height;switch(t){case"inside":r=e.x+l/2-n/2,s=e.y+u/2-a/2;break;case"top":r=e.x+l/2-n/2,s=e.y-a-o;break;case"bottom":r=e.x+l/2-n/2,s=e.y+u+o;break;case"left":r=e.x-n-o,s=e.y+u/2-a/2;break;case"right":r=e.x+l+o,s=e.y+u/2-a/2}return[r,s]}function u(t){return"center"===t||"middle"===t}var h=i(241),c=i(1),d=i(7),f=i(4),p=i(3),g=i(126),m=i(9),v=i(10),y=i(11),x=i(127),_=i(18),b=i(81),w=c.bind,S=c.each,M=f.parsePercent,I=new p.Rect({shape:{x:-1,y:-1,width:2,height:2}});i(2).extendComponentView({type:"tooltip",init:function(t,e){if(!v.node){var i=new h(e.getDom(),e);this._tooltipContent=i}},render:function(t,e,i){if(!v.node){this.group.removeAll(),this._tooltipModel=t,this._ecModel=e,this._api=i,this._lastDataByCoordSys=null,this._alwaysShowContent=t.get("alwaysShowContent");var n=this._tooltipContent;n.update(),n.setEnterable(t.get("enterable")),this._initGlobalListener(),this._keepShow()}},_initGlobalListener:function(){var t=this._tooltipModel,e=t.get("triggerOn");x.register("itemTooltip",this._api,w(function(t,i,n){"none"!==e&&(e.indexOf(t)>=0?this._tryShow(i,n):"leave"===t&&this._hide(n))},this))},_keepShow:function(){var t=this._tooltipModel,e=this._ecModel,i=this._api;if(null!=this._lastX&&null!=this._lastY&&"none"!==t.get("triggerOn")){var n=this;clearTimeout(this._refreshUpdateTimeout),this._refreshUpdateTimeout=setTimeout(function(){n.manuallyShowTip(t,e,i,{x:n._lastX,y:n._lastY})})}},manuallyShowTip:function(t,e,i,n){if(n.from!==this.uid&&!v.node){var o=a(n,i);this._ticket="";var r=n.dataByCoordSys;if(n.tooltip&&null!=n.x&&null!=n.y){var s=I;s.position=[n.x,n.y],s.update(),s.tooltip=n.tooltip,this._tryShow({offsetX:n.x,offsetY:n.y,target:s},o)}else if(r)this._tryShow({offsetX:n.x,offsetY:n.y,position:n.position,event:{},dataByCoordSys:n.dataByCoordSys,tooltipOption:n.tooltipOption},o);else if(null!=n.seriesIndex){if(this._manuallyAxisShowTip(t,e,i,n))return;var l=g(n,e),u=l.point[0],h=l.point[1];null!=u&&null!=h&&this._tryShow({offsetX:u,offsetY:h,position:n.position,target:l.el,event:{}},o)}else null!=n.x&&null!=n.y&&(i.dispatchAction({type:"updateAxisPointer",x:n.x,y:n.y}),this._tryShow({offsetX:n.x,offsetY:n.y,position:n.position,target:i.getZr().findHover(n.x,n.y).target,event:{}},o))}},manuallyHideTip:function(t,e,i,n){var o=this._tooltipContent;this._alwaysShowContent||o.hideLater(this._tooltipModel.get("hideDelay")),this._lastX=this._lastY=null,n.from!==this.uid&&this._hide(a(n,i))},_manuallyAxisShowTip:function(t,e,i,a){var o=a.seriesIndex,r=a.dataIndex,s=e.getComponent("axisPointer").coordSysAxesInfo;if(null!=o&&null!=r&&null!=s){var l=e.getSeriesByIndex(o);if(l){var u=l.getData(),t=n([u.getItemModel(r),l,(l.coordinateSystem||{}).model,t]);if("axis"===t.get("trigger"))return i.dispatchAction({type:"updateAxisPointer",seriesIndex:o,dataIndex:r,position:a.position}),!0}}},_tryShow:function(t,e){var i=t.target,n=this._tooltipModel;if(n){this._lastX=t.offsetX,this._lastY=t.offsetY;var a=t.dataByCoordSys;a&&a.length?this._showAxisTooltip(a,t):i&&null!=i.dataIndex?(this._lastDataByCoordSys=null,this._showSeriesItemTooltip(t,i,e)):i&&i.tooltip?(this._lastDataByCoordSys=null,this._showComponentItemTooltip(t,i,e)):(this._lastDataByCoordSys=null,this._hide(e))}},_showOrMove:function(t,e){var i=t.get("showDelay");e=c.bind(e,this),clearTimeout(this._showTimout),i>0?this._showTimout=setTimeout(e,i):e()},_showAxisTooltip:function(t,e){var i=this._ecModel,a=this._tooltipModel,o=[e.offsetX,e.offsetY],r=[],s=[],l=n([e.tooltipOption,a]);S(t,function(t){S(t.dataByAxis,function(t){var e=i.getComponent(t.axisDim+"Axis",t.axisIndex),n=t.value,a=[];if(e&&null!=n){var o=b.getValueLabel(n,e.axis,i,t.seriesDataIndices,t.valueLabelOpt);c.each(t.seriesDataIndices,function(r){var l=i.getSeriesByIndex(r.seriesIndex),u=r.dataIndexInside,h=l&&l.getDataParams(u);h.axisDim=t.axisDim,h.axisIndex=t.axisIndex,h.axisType=t.axisType,h.axisId=t.axisId,h.axisValue=_.getAxisRawValue(e.axis,n),h.axisValueLabel=o,h&&(s.push(h),a.push(l.formatTooltip(u,!0)))});var l=o;r.push((l?d.encodeHTML(l)+"<br />":"")+a.join("<br />"))}})},this),r.reverse(),r=r.join("<br /><br />");var u=e.position;this._showOrMove(l,function(){this._updateContentNotChangedOnAxis(t)?this._updatePosition(l,u,o[0],o[1],this._tooltipContent,s):this._showTooltipContent(l,r,s,Math.random(),o[0],o[1],u)})},_showSeriesItemTooltip:function(t,e,i){var a=this._ecModel,o=e.seriesIndex,r=a.getSeriesByIndex(o),s=e.dataModel||r,l=e.dataIndex,u=e.dataType,h=s.getData(),c=n([h.getItemModel(l),s,r&&(r.coordinateSystem||{}).model,this._tooltipModel]),d=c.get("trigger");if(null==d||"item"===d){var f=s.getDataParams(l,u),p=s.formatTooltip(l,!1,u),g="item_"+s.name+"_"+l;this._showOrMove(c,function(){this._showTooltipContent(c,p,f,g,t.offsetX,t.offsetY,t.position,t.target)}),i({type:"showTip",dataIndexInside:l,dataIndex:h.getRawIndex(l),seriesIndex:o,from:this.uid})}},_showComponentItemTooltip:function(t,e,i){var n=e.tooltip;if("string"==typeof n){var a=n;n={content:a,formatter:a}}var o=new y(n,this._tooltipModel,this._ecModel),r=o.get("content"),s=Math.random();this._showOrMove(o,function(){this._showTooltipContent(o,r,o.get("formatterParams")||{},s,t.offsetX,t.offsetY,t.position,e)}),i({type:"showTip",from:this.uid})},_showTooltipContent:function(t,e,i,n,a,o,r,s){if(this._ticket="",t.get("showContent")&&t.get("show")){var l=this._tooltipContent,u=t.get("formatter");r=r||t.get("position");var h=e;if(u&&"string"==typeof u)h=d.formatTpl(u,i,!0);else if("function"==typeof u){var c=w(function(e,n){e===this._ticket&&(l.setContent(n),this._updatePosition(t,r,a,o,l,i,s))},this);this._ticket=n,h=u(i,n,c)}l.setContent(h),l.show(t),this._updatePosition(t,r,a,o,l,i,s)}},_updatePosition:function(t,e,i,n,a,s,h){var d=this._api.getWidth(),f=this._api.getHeight();e=e||t.get("position");var p=a.getSize(),g=t.get("align"),v=t.get("verticalAlign"),y=h&&h.getBoundingRect().clone();if(h&&y.applyTransform(h.transform),"function"==typeof e&&(e=e([i,n],s,a.el,y,{viewSize:[d,f],contentSize:p.slice()})),c.isArray(e))i=M(e[0],d),n=M(e[1],f);else if(c.isObject(e)){e.width=p[0],e.height=p[1];var x=m.getLayoutRect(e,{width:d,height:f});i=x.x,n=x.y,g=null,v=null}else if("string"==typeof e&&h){var _=l(e,y,p);i=_[0],n=_[1]}else{var _=o(i,n,a.el,d,f,g?null:20,v?null:20);i=_[0],n=_[1]}if(g&&(i-=u(g)?p[0]/2:"right"===g?p[0]:0),v&&(n-=u(v)?p[1]/2:"bottom"===v?p[1]:0),t.get("confine")){var _=r(i,n,a.el,d,f);i=_[0],n=_[1]}a.moveTo(i,n)},_updateContentNotChangedOnAxis:function(t){var e=this._lastDataByCoordSys,i=!!e&&e.length===t.length;return i&&S(e,function(e,n){var a=e.dataByAxis||{},o=t[n]||{},r=o.dataByAxis||[];i&=a.length===r.length,i&&S(a,function(t,e){var n=r[e]||{},a=t.seriesDataIndices||[],o=n.seriesDataIndices||[];i&=t.value===n.value&&t.axisType===n.axisType&&t.axisId===n.axisId&&a.length===o.length,i&&S(a,function(t,e){var n=o[e];i&=t.seriesIndex===n.seriesIndex&&t.dataIndex===n.dataIndex})})}),this._lastDataByCoordSys=t,!!i},_hide:function(t){this._lastDataByCoordSys=null,t({type:"hideTip",from:this.uid})},dispose:function(t,e){v.node||(this._tooltipContent.hide(),x.unregister("itemTooltip",e))}})},function(t,e,i){function n(t,e){var i=t.get("center"),n=t.get("radius"),a=e.getWidth(),o=e.getHeight(),r=s.parsePercent;this.cx=r(i[0],a),this.cy=r(i[1],o);var l=this.getRadiusAxis(),u=Math.min(a,o)/2;l.setExtent(0,r(n,u))}function a(t,e){var i=this,n=i.getAngleAxis(),a=i.getRadiusAxis();if(n.scale.setExtent(1/0,-(1/0)),a.scale.setExtent(1/0,-(1/0)),t.eachSeries(function(t){if(t.coordinateSystem===i){var e=t.getData();a.scale.unionExtentFromData(e,"radius"),n.scale.unionExtentFromData(e,"angle")}}),u(n.scale,n.model),u(a.scale,a.model),"category"===n.type&&!n.onBand){var o=n.getExtent(),r=360/n.scale.count();n.inverse?o[1]+=r:o[1]-=r,n.setExtent(o[0],o[1])}}function o(t,e){if(t.type=e.get("type"),t.scale=l.createScaleByModel(e),t.onBand=e.get("boundaryGap")&&"category"===t.type,"angleAxis"===e.mainType){var i=e.get("startAngle");t.inverse=e.get("inverse")^e.get("clockwise"),t.setExtent(i,i+(t.inverse?-360:360))}e.axis=t,t.model=e}var r=i(420),s=i(4),l=(i(1),i(18)),u=l.niceScaleExtent;i(421);var h={dimensions:r.prototype.dimensions,create:function(t,e){var i=[];return t.eachComponent("polar",function(t,s){var l=new r(s);l.resize=n,l.update=a;var u=l.getRadiusAxis(),h=l.getAngleAxis(),c=t.findAxisModel("radiusAxis"),d=t.findAxisModel("angleAxis");o(u,c),o(h,d),l.resize(t,e),i.push(l),t.coordinateSystem=l,l.model=t}),t.eachSeries(function(e){if("polar"===e.get("coordinateSystem")){var i=t.queryComponents({mainType:"polar",index:e.get("polarIndex"),id:e.get("polarId")})[0];e.coordinateSystem=i.coordinateSystem}}),i}};i(26).register("polar",h)},function(t,e,i){function n(t){return parseInt(t,10)}function a(t,e){s.initVML(),this.root=t,this.storage=e;var i=document.createElement("div"),n=document.createElement("div");i.style.cssText="display:inline-block;overflow:hidden;position:relative;width:300px;height:150px;",n.style.cssText="position:absolute;left:0;top:0;",t.appendChild(i),this._vmlRoot=n,this._vmlViewport=i,this.resize();var a=e.delFromStorage,o=e.addToStorage;e.delFromStorage=function(t){a.call(e,t),t&&t.onRemove&&t.onRemove(n)},e.addToStorage=function(t){t.onAdd&&t.onAdd(n),o.call(e,t)},this._firstPaint=!0}function o(t){return function(){r('In IE8.0 VML mode painter not support method "'+t+'"')}}var r=i(54),s=i(188);a.prototype={constructor:a,getType:function(){return"vml"},getViewportRoot:function(){return this._vmlViewport},getViewportRootOffset:function(){var t=this.getViewportRoot();if(t)return{offsetLeft:t.offsetLeft||0,offsetTop:t.offsetTop||0}},refresh:function(){var t=this.storage.getDisplayList(!0,!0);this._paintList(t)},_paintList:function(t){for(var e=this._vmlRoot,i=0;i<t.length;i++){var n=t[i];n.invisible||n.ignore?(n.__alreadyNotVisible||n.onRemove(e),n.__alreadyNotVisible=!0):(n.__alreadyNotVisible&&n.onAdd(e),n.__alreadyNotVisible=!1,n.__dirty&&(n.beforeBrush&&n.beforeBrush(),(n.brushVML||n.brush).call(n,e),n.afterBrush&&n.afterBrush())),n.__dirty=!1}this._firstPaint&&(this._vmlViewport.appendChild(e),this._firstPaint=!1)},resize:function(t,e){var t=null==t?this._getWidth():t,e=null==e?this._getHeight():e;if(this._width!=t||this._height!=e){this._width=t,this._height=e;var i=this._vmlViewport.style;i.width=t+"px",i.height=e+"px"}},dispose:function(){this.root.innerHTML="",this._vmlRoot=this._vmlViewport=this.storage=null},getWidth:function(){return this._width},getHeight:function(){return this._height},clear:function(){this._vmlViewport&&this.root.removeChild(this._vmlViewport)},_getWidth:function(){var t=this.root,e=t.currentStyle;return(t.clientWidth||n(e.width))-n(e.paddingLeft)-n(e.paddingRight)|0},_getHeight:function(){var t=this.root,e=t.currentStyle;return(t.clientHeight||n(e.height))-n(e.paddingTop)-n(e.paddingBottom)|0}};for(var l=["getLayer","insertLayer","eachLayer","eachBuiltinLayer","eachOtherLayer","getLayers","modLayer","delLayer","clearLayer","toDataURL","pathToImage"],u=0;u<l.length;u++){var h=l[u];a.prototype[h]=o(h)}t.exports=a},function(t,e,i){if(!i(10).canvasSupported){var n=i(6),a=i(12),o=i(27).CMD,r=i(22),s=i(16),l=i(56),u=i(92),h=i(38),c=i(55),d=i(91),f=i(8),p=i(27),g=i(39),m=i(188),v=Math.round,y=Math.sqrt,x=Math.abs,_=Math.cos,b=Math.sin,w=Math.max,S=n.applyTransform,M=",",I="progid:DXImageTransform.Microsoft",T=21600,A=T/2,C=1e5,L=1e3,D=function(t){t.style.cssText="position:absolute;left:0;top:0;width:1px;height:1px;",t.coordsize=T+","+T,t.coordorigin="0,0"},P=function(t){return String(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;")},k=function(t,e,i){return"rgb("+[t,e,i].join(",")+")"},O=function(t,e){e&&t&&e.parentNode!==t&&t.appendChild(e)},z=function(t,e){e&&t&&e.parentNode===t&&t.removeChild(e)},E=function(t,e,i){return(parseFloat(t)||0)*C+(parseFloat(e)||0)*L+i},R=function(t,e){return"string"==typeof t?t.lastIndexOf("%")>=0?parseFloat(t)/100*e:parseFloat(t):t},N=function(t,e,i){var n=r.parse(e);i=+i,isNaN(i)&&(i=1),n&&(t.color=k(n[0],n[1],n[2]),t.opacity=i*n[3])},V=function(t){var e=r.parse(t);return[k(e[0],e[1],e[2]),e[3]]},B=function(t,e,i){var n=e.fill;if(null!=n)if(n instanceof g){var a,o=0,r=[0,0],s=0,l=1,u=i.getBoundingRect(),h=u.width,c=u.height;if("linear"===n.type){a="gradient";var d=i.transform,f=[n.x*h,n.y*c],p=[n.x2*h,n.y2*c];d&&(S(f,f,d),S(p,p,d));var m=p[0]-f[0],v=p[1]-f[1];o=180*Math.atan2(m,v)/Math.PI,o<0&&(o+=360),o<1e-6&&(o=0)}else{a="gradientradial";var f=[n.x*h,n.y*c],d=i.transform,y=i.scale,x=h,_=c;r=[(f[0]-u.x)/x,(f[1]-u.y)/_],d&&S(f,f,d),x/=y[0]*T,_/=y[1]*T;var b=w(x,_);s=0/b,l=2*n.r/b-s}var M=n.colorStops.slice();M.sort(function(t,e){return t.offset-e.offset});for(var I=M.length,A=[],C=[],L=0;L<I;L++){var D=M[L],P=V(D.color);C.push(D.offset*l+s+" "+P[0]),0!==L&&L!==I-1||A.push(P)}if(I>=2){var k=A[0][0],O=A[1][0],z=A[0][1]*e.opacity,E=A[1][1]*e.opacity;t.type=a,t.method="none",t.focus="100%",t.angle=o,t.color=k,t.color2=O,t.colors=C.join(","),t.opacity=E,t.opacity2=z}"radial"===a&&(t.focusposition=r.join(","))}else N(t,n,e.opacity)},G=function(t,e){null!=e.lineDash&&(t.dashstyle=e.lineDash.join(" ")),null==e.stroke||e.stroke instanceof g||N(t,e.stroke,e.opacity)},H=function(t,e,i,n){var a="fill"==e,o=t.getElementsByTagName(e)[0];null!=i[e]&&"none"!==i[e]&&(a||!a&&i.lineWidth)?(t[a?"filled":"stroked"]="true",i[e]instanceof g&&z(t,o),o||(o=m.createNode(e)),a?B(o,i,n):G(o,i),O(t,o)):(t[a?"filled":"stroked"]="false",z(t,o))},W=[[],[],[]],F=function(t,e){var i,n,a,r,s,l,u=o.M,h=o.C,c=o.L,d=o.A,f=o.Q,p=[];for(r=0;r<t.length;){switch(a=t[r++],n="",i=0,a){case u:n=" m ",i=1,s=t[r++],l=t[r++],W[0][0]=s,W[0][1]=l;break;case c:n=" l ",i=1,s=t[r++],l=t[r++],W[0][0]=s,W[0][1]=l;break;case f:case h:n=" c ",i=3;var g,m,x=t[r++],w=t[r++],I=t[r++],C=t[r++];a===f?(g=I,m=C,I=(I+2*x)/3,C=(C+2*w)/3,x=(s+2*x)/3,w=(l+2*w)/3):(g=t[r++],m=t[r++]),W[0][0]=x,W[0][1]=w,W[1][0]=I,W[1][1]=C,W[2][0]=g,W[2][1]=m,s=g,l=m;break;case d:var L=0,D=0,P=1,k=1,O=0;e&&(L=e[4],D=e[5],P=y(e[0]*e[0]+e[1]*e[1]),k=y(e[2]*e[2]+e[3]*e[3]),O=Math.atan2(-e[1]/k,e[0]/P));var z=t[r++],E=t[r++],R=t[r++],N=t[r++],V=t[r++]+O,B=t[r++]+V+O;r++;var G=t[r++],H=z+_(V)*R,F=E+b(V)*N,x=z+_(B)*R,w=E+b(B)*N,Z=G?" wa ":" at ";Math.abs(H-x)<1e-4&&(Math.abs(B-V)>.01?G&&(H+=270/T):Math.abs(F-E)<1e-4?G&&H<z||!G&&H>z?w-=270/T:w+=270/T:G&&F<E||!G&&F>E?x+=270/T:x-=270/T),p.push(Z,v(((z-R)*P+L)*T-A),M,v(((E-N)*k+D)*T-A),M,v(((z+R)*P+L)*T-A),M,v(((E+N)*k+D)*T-A),M,v((H*P+L)*T-A),M,v((F*k+D)*T-A),M,v((x*P+L)*T-A),M,v((w*k+D)*T-A)),s=x,l=w;break;case o.R:var q=W[0],j=W[1];q[0]=t[r++],q[1]=t[r++],j[0]=q[0]+t[r++],j[1]=q[1]+t[r++],e&&(S(q,q,e),S(j,j,e)),q[0]=v(q[0]*T-A),j[0]=v(j[0]*T-A),q[1]=v(q[1]*T-A),j[1]=v(j[1]*T-A),p.push(" m ",q[0],M,q[1]," l ",j[0],M,q[1]," l ",j[0],M,j[1]," l ",q[0],M,j[1]);break;case o.Z:p.push(" x ")}if(i>0){p.push(n);for(var U=0;U<i;U++){var X=W[U];e&&S(X,X,e),p.push(v(X[0]*T-A),M,v(X[1]*T-A),U<i-1?M:"")}}}return p.join("")};f.prototype.brushVML=function(t){
var e=this.style,i=this._vmlEl;i||(i=m.createNode("shape"),D(i),this._vmlEl=i),H(i,"fill",e,this),H(i,"stroke",e,this);var n=this.transform,a=null!=n,o=i.getElementsByTagName("stroke")[0];if(o){var r=e.lineWidth;if(a&&!e.strokeNoScale){var s=n[0]*n[3]-n[1]*n[2];r*=y(x(s))}o.weight=r+"px"}var l=this.path||(this.path=new p);this.__dirtyPath&&(l.beginPath(),this.buildPath(l,this.shape),l.toStatic(),this.__dirtyPath=!1),i.path=F(l.data,this.transform),i.style.zIndex=E(this.zlevel,this.z,this.z2),O(t,i),null!=e.text?this.drawRectText(t,this.getBoundingRect()):this.removeRectText(t)},f.prototype.onRemove=function(t){z(t,this._vmlEl),this.removeRectText(t)},f.prototype.onAdd=function(t){O(t,this._vmlEl),this.appendRectText(t)};var Z=function(t){return"object"==typeof t&&t.tagName&&"IMG"===t.tagName.toUpperCase()};c.prototype.brushVML=function(t){var e,i,n=this.style,a=n.image;if(Z(a)){var o=a.src;if(o===this._imageSrc)e=this._imageWidth,i=this._imageHeight;else{var r=a.runtimeStyle,s=r.width,l=r.height;r.width="auto",r.height="auto",e=a.width,i=a.height,r.width=s,r.height=l,this._imageSrc=o,this._imageWidth=e,this._imageHeight=i}a=o}else a===this._imageSrc&&(e=this._imageWidth,i=this._imageHeight);if(a){var u=n.x||0,h=n.y||0,c=n.width,d=n.height,f=n.sWidth,p=n.sHeight,g=n.sx||0,x=n.sy||0,_=f&&p,b=this._vmlEl;b||(b=m.doc.createElement("div"),D(b),this._vmlEl=b);var T,A=b.style,C=!1,L=1,P=1;if(this.transform&&(T=this.transform,L=y(T[0]*T[0]+T[1]*T[1]),P=y(T[2]*T[2]+T[3]*T[3]),C=T[1]||T[2]),C){var k=[u,h],z=[u+c,h],R=[u,h+d],N=[u+c,h+d];S(k,k,T),S(z,z,T),S(R,R,T),S(N,N,T);var V=w(k[0],z[0],R[0],N[0]),B=w(k[1],z[1],R[1],N[1]),G=[];G.push("M11=",T[0]/L,M,"M12=",T[2]/P,M,"M21=",T[1]/L,M,"M22=",T[3]/P,M,"Dx=",v(u*L+T[4]),M,"Dy=",v(h*P+T[5])),A.padding="0 "+v(V)+"px "+v(B)+"px 0",A.filter=I+".Matrix("+G.join("")+", SizingMethod=clip)"}else T&&(u=u*L+T[4],h=h*P+T[5]),A.filter="",A.left=v(u)+"px",A.top=v(h)+"px";var H=this._imageEl,W=this._cropEl;H||(H=m.doc.createElement("div"),this._imageEl=H);var F=H.style;if(_){if(e&&i)F.width=v(L*e*c/f)+"px",F.height=v(P*i*d/p)+"px";else{var q=new Image,j=this;q.onload=function(){q.onload=null,e=q.width,i=q.height,F.width=v(L*e*c/f)+"px",F.height=v(P*i*d/p)+"px",j._imageWidth=e,j._imageHeight=i,j._imageSrc=a},q.src=a}W||(W=m.doc.createElement("div"),W.style.overflow="hidden",this._cropEl=W);var U=W.style;U.width=v((c+g*c/f)*L),U.height=v((d+x*d/p)*P),U.filter=I+".Matrix(Dx="+-g*c/f*L+",Dy="+-x*d/p*P+")",W.parentNode||b.appendChild(W),H.parentNode!=W&&W.appendChild(H)}else F.width=v(L*c)+"px",F.height=v(P*d)+"px",b.appendChild(H),W&&W.parentNode&&(b.removeChild(W),this._cropEl=null);var X="",Y=n.opacity;Y<1&&(X+=".Alpha(opacity="+v(100*Y)+") "),X+=I+".AlphaImageLoader(src="+a+", SizingMethod=scale)",F.filter=X,b.style.zIndex=E(this.zlevel,this.z,this.z2),O(t,b),null!=n.text&&this.drawRectText(t,this.getBoundingRect())}},c.prototype.onRemove=function(t){z(t,this._vmlEl),this._vmlEl=null,this._cropEl=null,this._imageEl=null,this.removeRectText(t)},c.prototype.onAdd=function(t){O(t,this._vmlEl),this.appendRectText(t)};var q,j="normal",U={},X=0,Y=100,$=document.createElement("div"),K=function(t){var e=U[t];if(!e){X>Y&&(X=0,U={});var i,n=$.style;try{n.font=t,i=n.fontFamily.split(",")[0]}catch(t){}e={style:n.fontStyle||j,variant:n.fontVariant||j,weight:n.fontWeight||j,size:0|parseFloat(n.fontSize||12),family:i||"Microsoft YaHei"},U[t]=e,X++}return e};s.measureText=function(t,e){var i=m.doc;q||(q=i.createElement("div"),q.style.cssText="position:absolute;top:-20000px;left:0;padding:0;margin:0;border:none;white-space:pre;",m.doc.body.appendChild(q));try{q.style.font=e}catch(t){}return q.innerHTML="",q.appendChild(i.createTextNode(t)),{width:q.offsetWidth}};for(var J=new a,Q=function(t,e,i,n){var a=this.style;this.__dirty&&l.normalizeTextStyle(a,!0);var o=a.text;if(null!=o&&(o+=""),o){if(a.rich){var r=s.parseRichText(o,a);o=[];for(var u=0;u<r.lines.length;u++){for(var h=r.lines[u].tokens,c=[],d=0;d<h.length;d++)c.push(h[d].text);o.push(c.join(""))}o=o.join("\n")}var f,p,g=a.textAlign,y=a.textVerticalAlign,x=K(a.font),_=x.style+" "+x.variant+" "+x.weight+" "+x.size+'px "'+x.family+'"';i=i||s.getBoundingRect(o,_,g,y);var b=this.transform;if(b&&!n&&(J.copy(e),J.applyTransform(b),e=J),n)f=e.x,p=e.y;else{var w=a.textPosition,I=a.textDistance;if(w instanceof Array)f=e.x+R(w[0],e.width),p=e.y+R(w[1],e.height),g=g||"left";else{var T=s.adjustTextPositionOnRect(w,e,I);f=T.x,p=T.y,g=g||T.textAlign,y=y||T.textVerticalAlign}}f=s.adjustTextX(f,i.width,g),p=s.adjustTextY(p,i.height,y),p+=i.height/2;var A,C,L,k=m.createNode,z=this._textVmlEl;z?(L=z.firstChild,A=L.nextSibling,C=A.nextSibling):(z=k("line"),A=k("path"),C=k("textpath"),L=k("skew"),C.style["v-text-align"]="left",D(z),A.textpathok=!0,C.on=!0,z.from="0 0",z.to="1000 0.05",O(z,L),O(z,A),O(z,C),this._textVmlEl=z);var N=[f,p],V=z.style;b&&n?(S(N,N,b),L.on=!0,L.matrix=b[0].toFixed(3)+M+b[2].toFixed(3)+M+b[1].toFixed(3)+M+b[3].toFixed(3)+",0,0",L.offset=(v(N[0])||0)+","+(v(N[1])||0),L.origin="0 0",V.left="0px",V.top="0px"):(L.on=!1,V.left=v(f)+"px",V.top=v(p)+"px"),C.string=P(o);try{C.style.font=_}catch(t){}H(z,"fill",{fill:a.textFill,opacity:a.opacity},this),H(z,"stroke",{stroke:a.textStroke,opacity:a.opacity,lineDash:a.lineDash},this),z.style.zIndex=E(this.zlevel,this.z,this.z2),O(t,z)}},tt=function(t){z(t,this._textVmlEl),this._textVmlEl=null},et=function(t){O(t,this._textVmlEl)},it=[u,h,c,f,d],nt=0;nt<it.length;nt++){var at=it[nt].prototype;at.drawRectText=Q,at.removeRectText=tt,at.appendRectText=et}d.prototype.brushVML=function(t){var e=this.style;null!=e.text?this.drawRectText(t,{x:e.x||0,y:e.y||0,width:0,height:0},this.getBoundingRect(),!0):this.removeRectText(t)},d.prototype.onRemove=function(t){this.removeRectText(t)},d.prototype.onAdd=function(t){this.appendRectText(t)}}},function(t,e,i){i(246),i(93).registerPainter("vml",i(245))},function(t,e,i){var n=i(1),a=i(249),o=i(2);o.registerAction({type:"geoRoam",event:"geoRoam",update:"updateLayout"},function(t,e){var i=t.componentType||"series";e.eachComponent({mainType:i,query:t},function(e){var o=e.coordinateSystem;if("geo"===o.type){var r=a.updateCenterAndZoom(o,t,e.get("scaleLimit"));e.setCenter&&e.setCenter(r.center),e.setZoom&&e.setZoom(r.zoom),"series"===i&&n.each(e.seriesGroup,function(t){t.setCenter(r.center),t.setZoom(r.zoom)})}})})},function(t,e){var i={};i.updateCenterAndZoom=function(t,e,i){var n=t.getZoom(),a=t.getCenter(),o=e.zoom,r=t.dataToPoint(a);if(null!=e.dx&&null!=e.dy){r[0]-=e.dx,r[1]-=e.dy;var a=t.pointToData(r);t.setCenter(a)}if(null!=o){if(i){var s=i.min||0,l=i.max||1/0;o=Math.max(Math.min(n*o,l),s)/n}t.scale[0]*=o,t.scale[1]*=o;var u=t.position,h=(e.originX-u[0])*(o-1),c=(e.originY-u[1])*(o-1);u[0]-=h,u[1]-=c,t.updateTransform();var a=t.pointToData(r);t.setCenter(a),t.setZoom(o*n)}return{center:t.getCenter(),zoom:t.getZoom()}},t.exports=i},function(t,e,i){var n=i(6);t.exports=function(t){var e=t.coordinateSystem;if(!e||"view"===e.type){var i=e.getBoundingRect(),a=t.getData(),o=a.graph,r=0,s=a.getSum("value"),l=2*Math.PI/(s||a.count()),u=i.width/2+i.x,h=i.height/2+i.y,c=Math.min(i.width,i.height)/2;o.eachNode(function(t){var e=t.getValue("value");r+=l*(s?e:1)/2,t.setLayout([c*Math.cos(r)+u,c*Math.sin(r)+h]),r+=l*(s?e:1)/2}),a.setLayout({cx:u,cy:h}),o.eachEdge(function(t){var e,i=t.getModel().get("lineStyle.normal.curveness")||0,a=n.clone(t.node1.getLayout()),o=n.clone(t.node2.getLayout()),r=(a[0]+o[0])/2,s=(a[1]+o[1])/2;+i&&(i*=3,e=[u*i+r*(1-i),h*i+s*(1-i)]),t.setLayout([a,o,e])})}}},function(t,e,i){var n=i(6);t.exports=function(t){t.eachEdge(function(t){var e=t.getModel().get("lineStyle.normal.curveness")||0,i=n.clone(t.node1.getLayout()),a=n.clone(t.node2.getLayout()),o=[i,a];+e&&o.push([(i[0]+a[0])/2-(i[1]-a[1])*e,(i[1]+a[1])/2-(a[0]-i[0])*e]),t.setLayout(o)})}},function(t,e,i){var n=i(251);t.exports=function(t){var e=t.coordinateSystem;if(!e||"view"===e.type){var i=t.getGraph();i.eachNode(function(t){var e=t.getModel();t.setLayout([+e.get("x"),+e.get("y")])}),n(i)}}},function(t,e,i){function n(t,e,i){a.Group.call(this),this.add(this.createLine(t,e,i)),this._updateEffectSymbol(t,e)}var a=i(3),o=i(111),r=i(1),s=i(24),l=i(6),u=i(20),h=n.prototype;h.createLine=function(t,e,i){return new o(t,e,i)},h._updateEffectSymbol=function(t,e){var i=t.getItemModel(e),n=i.getModel("effect"),a=n.get("symbolSize"),o=n.get("symbol");r.isArray(a)||(a=[a,a]);var l=n.get("color")||t.getItemVisual(e,"color"),u=this.childAt(1);this._symbolType!==o&&(this.remove(u),u=s.createSymbol(o,-.5,-.5,1,1,l),u.z2=100,u.culling=!0,this.add(u)),u&&(u.setStyle("shadowColor",l),u.setStyle(n.getItemStyle(["color"])),u.attr("scale",a),u.setColor(l),u.attr("scale",a),this._symbolType=o,this._updateEffectAnimation(t,n,e))},h._updateEffectAnimation=function(t,e,i){var n=this.childAt(1);if(n){var a=this,o=t.getItemLayout(i),s=1e3*e.get("period"),l=e.get("loop"),u=e.get("constantSpeed"),h=r.retrieve(e.get("delay"),function(e){return e/t.count()*s/3}),c="function"==typeof h;if(n.ignore=!0,this.updateAnimationPoints(n,o),u>0&&(s=this.getLineLength(n)/u*1e3),s!==this._period||l!==this._loop){n.stopAnimation();var d=h;c&&(d=h(i)),n.__t>0&&(d=-s*n.__t),n.__t=0;var f=n.animate("",l).when(s,{__t:1}).delay(d).during(function(){a.updateSymbolPosition(n)});l||f.done(function(){a.remove(n)}),f.start()}this._period=s,this._loop=l}},h.getLineLength=function(t){return l.dist(t.__p1,t.__cp1)+l.dist(t.__cp1,t.__p2)},h.updateAnimationPoints=function(t,e){t.__p1=e[0],t.__p2=e[1],t.__cp1=e[2]||[(e[0][0]+e[1][0])/2,(e[0][1]+e[1][1])/2]},h.updateData=function(t,e,i){this.childAt(0).updateData(t,e,i),this._updateEffectSymbol(t,e)},h.updateSymbolPosition=function(t){var e=t.__p1,i=t.__p2,n=t.__cp1,a=t.__t,o=t.position,r=u.quadraticAt,s=u.quadraticDerivativeAt;o[0]=r(e[0],n[0],i[0],a),o[1]=r(e[1],n[1],i[1],a);var l=s(e[0],n[0],i[0],a),h=s(e[1],n[1],i[1],a);t.rotation=-Math.atan2(h,l)-Math.PI/2,t.ignore=!1},h.updateLayout=function(t,e){this.childAt(0).updateLayout(t,e);var i=t.getItemModel(e).getModel("effect");this._updateEffectAnimation(t,i,e)},r.inherits(n,a.Group),t.exports=n},function(t,e,i){function n(t,e,i){a.Group.call(this),this._createPolyline(t,e,i)}var a=i(3),o=i(1),r=n.prototype;r._createPolyline=function(t,e,i){var n=t.getItemLayout(e),o=new a.Polyline({shape:{points:n}});this.add(o),this._updateCommonStl(t,e,i)},r.updateData=function(t,e,i){var n=t.hostModel,o=this.childAt(0),r={shape:{points:t.getItemLayout(e)}};a.updateProps(o,r,n,e),this._updateCommonStl(t,e,i)},r._updateCommonStl=function(t,e,i){var n=this.childAt(0),r=t.getItemModel(e),s=t.getItemVisual(e,"color"),l=i&&i.lineStyle,u=i&&i.hoverLineStyle;i&&!t.hasItemOption||(l=r.getModel("lineStyle.normal").getLineStyle(),u=r.getModel("lineStyle.emphasis").getLineStyle()),n.useStyle(o.defaults({strokeNoScale:!0,fill:"none",stroke:s},l)),n.hoverStyle=u,a.setHoverStyle(this)},r.updateLayout=function(t,e){var i=this.childAt(0);i.setShape("points",t.getItemLayout(e))},o.inherits(n,a.Group),t.exports=n},function(t,e,i){var n=i(14),a=i(432),o=i(272),r=i(25),s=i(26),l=i(1),u=i(28);t.exports=function(t,e,i,h,c){for(var d=new a(h),f=0;f<t.length;f++)d.addNode(l.retrieve(t[f].id,t[f].name,f),f);for(var p=[],g=[],m=0,f=0;f<e.length;f++){var v=e[f],y=v.source,x=v.target;d.addEdge(y,x,m)&&(g.push(v),p.push(l.retrieve(v.id,y+" > "+x)),m++)}var _,b=i.get("coordinateSystem");if("cartesian2d"===b||"polar"===b)_=u(t,i,i.ecModel);else{var w=s.get(b),S=r((w&&"view"!==w.type?w.dimensions||[]:[]).concat(["value"]),t);_=new n(S,i),_.initData(t)}var M=new n(["value"],i);return M.initData(g,p),c&&c(_,M),o({mainData:_,struct:d,structAttr:"graph",datas:{node:_,edge:M},datasAttr:{node:"data",edge:"edgeData"}}),d.update(),d}},function(t,e,i){var n=i(1),a={};a.layout=function(t,e){e=e||{};var i=t.coordinateSystem,a=t.axis,o={},r=a.position,s=a.orient,l=i.getRect(),u=[l.x,l.x+l.width,l.y,l.y+l.height],h={horizontal:{top:u[2],bottom:u[3]},vertical:{left:u[0],right:u[1]}};o.position=["vertical"===s?h.vertical[r]:u[0],"horizontal"===s?h.horizontal[r]:u[3]];var c={horizontal:0,vertical:1};o.rotation=Math.PI/2*c[s];var d={top:-1,bottom:1,right:1,left:-1};o.labelDirection=o.tickDirection=o.nameDirection=d[r],t.get("axisTick.inside")&&(o.tickDirection=-o.tickDirection),n.retrieve(e.labelInside,t.get("axisLabel.inside"))&&(o.labelDirection=-o.labelDirection);var f=e.rotate;return null==f&&(f=t.get("axisLabel.rotate")),o.labelRotation="top"===r?-f:f,o.labelInterval=a.getLabelInterval(),o.z2=1,o},t.exports=a},function(t,e,i){function n(t,e){var i=t.getItemStyle(),n=t.get("areaColor");return null!=n&&(i.fill=n),i}function a(t,e,i,n,a){i.off("click"),i.off("mousedown"),e.get("selectedMode")&&(i.on("mousedown",function(){t._mouseDownFlag=!0}),i.on("click",function(r){if(t._mouseDownFlag){t._mouseDownFlag=!1;for(var s=r.target;!s.__regions;)s=s.parent;if(s){var l={type:("geo"===e.mainType?"geo":"map")+"ToggleSelect",batch:c.map(s.__regions,function(t){return{name:t.name,from:a.uid}})};l[e.mainType+"Id"]=e.id,n.dispatchAction(l),o(e,i)}}}))}function o(t,e){e.eachChild(function(e){c.each(e.__regions,function(i){e.trigger(t.isSelected(i.name)?"emphasis":"normal")})})}function r(t,e){var i=new h.Group;this._controller=new s(t.getZr()),this._controllerHost={target:e?i:null},this.group=i,this._updateGroup=e,this._mouseDownFlag}var s=i(100),l=i(258),u=i(133),h=i(3),c=i(1);r.prototype={constructor:r,draw:function(t,e,i,r,s){var l="geo"===t.mainType,u=t.getData&&t.getData();l&&e.eachComponent({mainType:"series",subType:"map"},function(e){u||e.getHostGeoModel()!==t||(u=e.getData())});var d=t.coordinateSystem,f=this.group,p=d.scale,g={position:d.position,scale:p};!f.childAt(0)||s?f.attr(g):h.updateProps(f,g,t),f.removeAll();var m=["itemStyle","normal"],v=["itemStyle","emphasis"],y=["label","normal"],x=["label","emphasis"],_=c.createHashMap();c.each(d.regions,function(e){var i=_.get(e.name)||_.set(e.name,new h.Group),a=new h.CompoundPath({shape:{paths:[]}});i.add(a);var o,r=t.getRegionModel(e.name)||t,s=r.getModel(m),d=r.getModel(v),g=n(s,p),b=n(d,p),w=r.getModel(y),S=r.getModel(x);if(u){o=u.indexOfName(e.name);var M=u.getItemVisual(o,"color",!0);M&&(g.fill=M)}c.each(e.geometries,function(t){if("polygon"===t.type){a.shape.paths.push(new h.Polygon({shape:{points:t.exterior}}));for(var e=0;e<(t.interiors?t.interiors.length:0);e++)a.shape.paths.push(new h.Polygon({shape:{points:t.interiors[e]}}))}}),a.setStyle(g),a.style.strokeNoScale=!0,a.culling=!0;var I=w.get("show"),T=S.get("show"),A=u&&isNaN(u.get("value",o)),C=u&&u.getItemLayout(o);if(l||A&&(I||T)||C&&C.showLabel){var L,D=l?e.name:o;(!u||o>=0)&&(L=t);var P=new h.Text({position:e.center.slice(),scale:[1/p[0],1/p[1]],z2:10,silent:!0});h.setLabelStyle(P.style,P.hoverStyle={},w,S,{labelFetcher:L,labelDataIndex:D,defaultText:e.name,useInsideStyle:!1},{textAlign:"center",textVerticalAlign:"middle"}),i.add(P)}if(u)u.setItemGraphicEl(o,i);else{var r=t.getRegionModel(e.name);a.eventData={componentType:"geo",geoIndex:t.componentIndex,name:e.name,region:r&&r.option||{}}}var k=i.__regions||(i.__regions=[]);k.push(e),h.setHoverStyle(i,b,{hoverSilentOnTouch:!!t.get("selectedMode")}),f.add(i)}),this._updateController(t,e,i),a(this,t,f,i,r),o(t,f)},remove:function(){this.group.removeAll(),this._controller.dispose(),this._controllerHost={}},_updateController:function(t,e,i){function n(){var e={type:"geoRoam",componentType:s};return e[s+"Id"]=t.id,e}var a=t.coordinateSystem,o=this._controller,r=this._controllerHost;r.zoomLimit=t.get("scaleLimit"),r.zoom=a.getZoom(),o.enable(t.get("roam")||!1);var s=t.mainType;o.off("pan").on("pan",function(t,e){this._mouseDownFlag=!1,l.updateViewOnPan(r,t,e),i.dispatchAction(c.extend(n(),{dx:t,dy:e}))},this),o.off("zoom").on("zoom",function(t,e,a){if(this._mouseDownFlag=!1,l.updateViewOnZoom(r,t,e,a),i.dispatchAction(c.extend(n(),{zoom:t,originX:e,originY:a})),this._updateGroup){var o=this.group,s=o.scale;o.traverse(function(t){"text"===t.type&&t.attr("scale",[1/s[0],1/s[1]])})}},this),o.setPointerChecker(function(e,n,o){return a.getViewRectAfterRoam().contain(n,o)&&!u.onIrrelevantElement(e,i,t)})}},t.exports=r},function(t,e){var i={};i.updateViewOnPan=function(t,e,i){var n=t.target,a=n.position;a[0]+=e,a[1]+=i,n.dirty()},i.updateViewOnZoom=function(t,e,i,n){var a=t.target,o=t.zoomLimit,r=a.position,s=a.scale,l=t.zoom=t.zoom||1;if(l*=e,o){var u=o.min||0,h=o.max||1/0;l=Math.max(Math.min(h,l),u)}var c=l/t.zoom;t.zoom=l,r[0]-=(i-r[0])*(c-1),r[1]-=(n-r[1])*(c-1),s[0]*=c,s[1]*=c,a.dirty()},t.exports=i},function(t,e,i){function n(t,e){var i=t._model;return i.get("axisExpandable")&&i.get("axisExpandTriggerOn")===e}i(271),i(416),i(380);var a=i(2),o=i(1),r=i(37),s=5;a.extendComponentView({type:"parallel",render:function(t,e,i){this._model=t,this._api=i,this._handlers||(this._handlers={},o.each(l,function(t,e){i.getZr().on(e,this._handlers[e]=o.bind(t,this))},this)),r.createOrUpdate(this,"_throttledDispatchExpand",t.get("axisExpandRate"),"fixRate")},dispose:function(t,e){o.each(this._handlers,function(t,i){e.getZr().off(i,t)}),this._handlers=null},_throttledDispatchExpand:function(t){this._dispatchExpand(t)},_dispatchExpand:function(t){t&&this._api.dispatchAction(o.extend({type:"parallelAxisExpand"},t))}});var l={mousedown:function(t){n(this,"click")&&(this._mouseDownPoint=[t.offsetX,t.offsetY])},mouseup:function(t){var e=this._mouseDownPoint;if(n(this,"click")&&e){var i=[t.offsetX,t.offsetY],a=Math.pow(e[0]-i[0],2)+Math.pow(e[1]-i[1],2);if(a>s)return;var o=this._model.coordinateSystem.getSlidedAxisExpandWindow([t.offsetX,t.offsetY]);"none"!==o.behavior&&this._dispatchExpand({axisExpandWindow:o.axisExpandWindow})}this._mouseDownPoint=null},mousemove:function(t){if(!this._mouseDownPoint&&n(this,"mousemove")){var e=this._model,i=e.coordinateSystem.getSlidedAxisExpandWindow([t.offsetX,t.offsetY]),a=i.behavior;"jump"===a&&this._throttledDispatchExpand.debounceNextCall(e.get("axisExpandDebounce")),this._throttledDispatchExpand("none"===a?null:{axisExpandWindow:i.axisExpandWindow,animation:"jump"===a&&null})}}};a.registerPreprocessor(i(417))},function(t,e,i){i(431),i(365),i(427),i(58),i(368);var n=i(2);n.extendComponentView({type:"single"})},function(t,e,i){var n=i(2),a=i(1),o=i(10),r=i(274),s=i(88),l=i(193),u=s.mapVisual,h=i(5),c=s.eachVisual,d=i(4),f=a.isArray,p=a.each,g=d.asc,m=d.linearMap,v=a.noop,y=["#f6efa6","#d88273","#bf444c"],x=n.extendComponentModel({type:"visualMap",dependencies:["series"],stateList:["inRange","outOfRange"],replacableOptionKeys:["inRange","outOfRange","target","controller","color"],dataBound:[-(1/0),1/0],layoutMode:{type:"box",ignoreSize:!0},defaultOption:{show:!0,zlevel:0,z:4,seriesIndex:"all",min:0,max:200,dimension:null,inRange:null,outOfRange:null,left:0,right:null,top:null,bottom:0,itemWidth:null,itemHeight:null,inverse:!1,orient:"vertical",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",contentColor:"#5793f3",inactiveColor:"#aaa",borderWidth:0,padding:5,textGap:10,precision:0,color:null,formatter:null,text:null,textStyle:{color:"#333"}},init:function(t,e,i){this._dataExtent,this.targetVisuals={},this.controllerVisuals={},this.textStyleModel,this.itemSize,this.mergeDefaultAndTheme(t,i)},optionUpdated:function(t,e){var i=this.option;o.canvasSupported||(i.realtime=!1),!e&&l.replaceVisualOption(i,t,this.replacableOptionKeys),this.textStyleModel=this.getModel("textStyle"),this.resetItemSize(),this.completeVisualOption()},resetVisual:function(t){var e=this.stateList;t=a.bind(t,this),this.controllerVisuals=l.createVisualMappings(this.option.controller,e,t),this.targetVisuals=l.createVisualMappings(this.option.target,e,t)},getTargetSeriesIndices:function(){var t=this.option.seriesIndex,e=[];return null==t||"all"===t?this.ecModel.eachSeries(function(t,i){e.push(i)}):e=h.normalizeToArray(t),e},eachTargetSeries:function(t,e){a.each(this.getTargetSeriesIndices(),function(i){t.call(e,this.ecModel.getSeriesByIndex(i))},this)},isTargetSeries:function(t){var e=!1;return this.eachTargetSeries(function(i){i===t&&(e=!0)}),e},formatValueText:function(t,e,i){function n(t){return t===u[0]?"min":t===u[1]?"max":(+t).toFixed(Math.min(l,20))}var o,r,s=this.option,l=s.precision,u=this.dataBound,h=s.formatter;return i=i||["<",">"],a.isArray(t)&&(t=t.slice(),o=!0),r=e?t:o?[n(t[0]),n(t[1])]:n(t),a.isString(h)?h.replace("{value}",o?r[0]:r).replace("{value2}",o?r[1]:r):a.isFunction(h)?o?h(t[0],t[1]):h(t):o?t[0]===u[0]?i[0]+" "+r[1]:t[1]===u[1]?i[1]+" "+r[0]:r[0]+" - "+r[1]:r},resetExtent:function(){var t=this.option,e=g([t.min,t.max]);this._dataExtent=e},getDataDimension:function(t){var e=this.option.dimension;return null!=e?e:t.dimensions.length-1},getExtent:function(){return this._dataExtent.slice()},completeVisualOption:function(){function t(t){f(n.color)&&!t.inRange&&(t.inRange={color:n.color.slice().reverse()}),t.inRange=t.inRange||{color:y},p(this.stateList,function(e){var i=t[e];if(a.isString(i)){var n=r.get(i,"active",d);n?(t[e]={},t[e][i]=n):delete t[e]}},this)}function e(t,e,i){var n=t[e],a=t[i];n&&!a&&(a=t[i]={},p(n,function(t,e){if(s.isValidType(e)){var i=r.get(e,"inactive",d);null!=i&&(a[e]=i,"color"!==e||a.hasOwnProperty("opacity")||a.hasOwnProperty("colorAlpha")||(a.opacity=[0,0]))}}))}function i(t){var e=(t.inRange||{}).symbol||(t.outOfRange||{}).symbol,i=(t.inRange||{}).symbolSize||(t.outOfRange||{}).symbolSize,n=this.get("inactiveColor");p(this.stateList,function(o){var r=this.itemSize,s=t[o];s||(s=t[o]={color:d?n:[n]}),null==s.symbol&&(s.symbol=e&&a.clone(e)||(d?"roundRect":["roundRect"])),null==s.symbolSize&&(s.symbolSize=i&&a.clone(i)||(d?r[0]:[r[0],r[0]])),s.symbol=u(s.symbol,function(t){return"none"===t||"square"===t?"roundRect":t});var l=s.symbolSize;if(null!=l){var h=-(1/0);c(l,function(t){t>h&&(h=t)}),s.symbolSize=u(l,function(t){return m(t,[0,h],[0,r[0]],!0)})}},this)}var n=this.option,o={inRange:n.inRange,outOfRange:n.outOfRange},l=n.target||(n.target={}),h=n.controller||(n.controller={});a.merge(l,o),a.merge(h,o);var d=this.isCategory();t.call(this,l),t.call(this,h),e.call(this,l,"inRange","outOfRange"),i.call(this,h)},resetItemSize:function(){this.itemSize=[parseFloat(this.get("itemWidth")),parseFloat(this.get("itemHeight"))]},isCategory:function(){return!!this.option.categories},setSelected:v,getValueState:v,getVisualMeta:v});t.exports=x},function(t,e,i){var n=i(1),a=i(3),o=i(7),r=i(9),s=i(2),l=i(88);t.exports=s.extendComponentView({type:"visualMap",autoPositionValues:{left:1,right:1,top:1,bottom:1},init:function(t,e){this.ecModel=t,this.api=e,this.visualMapModel},render:function(t,e,i,n){return this.visualMapModel=t,t.get("show")===!1?void this.group.removeAll():void this.doRender.apply(this,arguments)},renderBackground:function(t){var e=this.visualMapModel,i=o.normalizeCssArray(e.get("padding")||0),n=t.getBoundingRect();t.add(new a.Rect({z2:-1,silent:!0,shape:{x:n.x-i[3],y:n.y-i[0],width:n.width+i[3]+i[1],height:n.height+i[0]+i[2]},style:{fill:e.get("backgroundColor"),stroke:e.get("borderColor"),lineWidth:e.get("borderWidth")}}))},getControllerVisual:function(t,e,i){function a(t){return u[t]}function o(t,e){u[t]=e}i=i||{};var r=i.forceState,s=this.visualMapModel,u={};if("symbol"===e&&(u.symbol=s.get("itemSymbol")),"color"===e){var h=s.get("contentColor");u.color=h}var c=s.controllerVisuals[r||s.getValueState(t)],d=l.prepareVisualTypes(c);return n.each(d,function(n){var r=c[n];i.convertOpacityToAlpha&&"opacity"===n&&(n="colorAlpha",r=c.__alphaForOpacity),l.dependsOn(n,e)&&r&&r.applyVisual(t,a,o)}),u[e]},positionGroup:function(t){var e=this.visualMapModel,i=this.api;r.positionElement(t,e.getBoxLayoutParams(),{width:i.getWidth(),height:i.getHeight()})},doRender:n.noop})},function(t,e,i){var n=i(1),a=i(9),o={getItemAlign:function(t,e,i){var n=t.option,o=n.align;if(null!=o&&"auto"!==o)return o;for(var r={width:e.getWidth(),height:e.getHeight()},s="horizontal"===n.orient?1:0,l=[["left","right","width"],["top","bottom","height"]],u=l[s],h=[0,null,10],c={},d=0;d<3;d++)c[l[1-s][d]]=h[d],c[u[d]]=2===d?i[0]:n[u[d]];var f=[["x","width",3],["y","height",0]][s],p=a.getLayoutRect(c,r,n.padding);return u[(p.margin[f[2]]||0)+p[f[0]]+.5*p[f[1]]<.5*r[f[1]]?0:1]},convertDataIndex:function(t){return n.each(t||[],function(e){null!=t.dataIndex&&(t.dataIndexInside=t.dataIndex,t.dataIndex=null)}),t}};t.exports=o},function(t,e,i){function n(t,e){return t&&t.hasOwnProperty&&t.hasOwnProperty(e)}var a=i(1),o=a.each;t.exports=function(t){var e=t&&t.visualMap;a.isArray(e)||(e=e?[e]:[]),o(e,function(t){if(t){n(t,"splitList")&&!n(t,"pieces")&&(t.pieces=t.splitList,delete t.splitList);var e=t.pieces;e&&a.isArray(e)&&o(e,function(t){a.isObject(t)&&(n(t,"start")&&!n(t,"min")&&(t.min=t.start),n(t,"end")&&!n(t,"max")&&(t.max=t.end))})}})}},function(t,e,i){i(13).registerSubTypeDefaulter("visualMap",function(t){return t.categories||(t.pieces?t.pieces.length>0:t.splitNumber>0)&&!t.calculable?"piecewise":"continuous"})},function(t,e,i){function n(t,e){t.eachTargetSeries(function(e){var i=e.getData();s.applyVisual(t.stateList,t.targetVisuals,i,t.getValueState,t,t.getDataDimension(i))})}function a(t){t.eachSeries(function(e){var i=e.getData(),n=[];t.eachComponent("visualMap",function(t){if(t.isTargetSeries(e)){var a=t.getVisualMeta(u.bind(o,null,e,t))||{stops:[],outerColors:[]};a.dimension=t.getDataDimension(i),n.push(a)}}),e.getData().setVisual("visualMeta",n)})}function o(t,e,i,n){function a(t){return u[t]}function o(t,e){u[t]=e}for(var r=e.targetVisuals[n],s=l.prepareVisualTypes(r),u={color:t.getData().getVisual("color")},h=0,c=s.length;h<c;h++){var d=s[h],f=r["opacity"===d?"__alphaForOpacity":d];f&&f.applyVisual(i,a,o)}return u.color}var r=i(2),s=i(193),l=i(88),u=i(1);r.registerVisual(r.PRIORITY.VISUAL.COMPONENT,function(t){t.eachComponent("visualMap",function(e){n(e,t)}),a(t)})},function(t,e,i){var n=i(2),a={type:"selectDataRange",event:"dataRangeSelected",update:"update"};n.registerAction(a,function(t,e){e.eachComponent({mainType:"visualMap",query:t},function(e){e.setSelected(t.selected)})})},function(t,e,i){function n(){l.call(this)}function a(t){this.name=t,this.zoomLimit,l.call(this),this._roamTransform=new n,this._viewTransform=new n,this._center,this._zoom}function o(t,e,i,n){var a=i.seriesModel,o=a?a.coordinateSystem:null;return o===this?o[t](n):null}var r=i(6),s=i(19),l=i(61),u=i(1),h=i(12),c=r.applyTransform;u.mixin(n,l),a.prototype={constructor:a,type:"view",dimensions:["x","y"],setBoundingRect:function(t,e,i,n){return this._rect=new h(t,e,i,n),this._rect},getBoundingRect:function(){return this._rect},setViewRect:function(t,e,i,n){this.transformTo(t,e,i,n),this._viewRect=new h(t,e,i,n)},transformTo:function(t,e,i,n){var a=this.getBoundingRect(),o=this._viewTransform;o.transform=a.calculateTransform(new h(t,e,i,n)),o.decomposeTransform(),this._updateTransform()},setCenter:function(t){t&&(this._center=t,this._updateCenterAndZoom())},setZoom:function(t){t=t||1;var e=this.zoomLimit;e&&(null!=e.max&&(t=Math.min(e.max,t)),null!=e.min&&(t=Math.max(e.min,t))),this._zoom=t,this._updateCenterAndZoom()},getDefaultCenter:function(){var t=this.getBoundingRect(),e=t.x+t.width/2,i=t.y+t.height/2;return[e,i]},getCenter:function(){return this._center||this.getDefaultCenter()},getZoom:function(){return this._zoom||1},getRoamTransform:function(){return this._roamTransform},_updateCenterAndZoom:function(){var t=this._viewTransform.getLocalTransform(),e=this._roamTransform,i=this.getDefaultCenter(),n=this.getCenter(),a=this.getZoom();n=r.applyTransform([],n,t),i=r.applyTransform([],i,t),e.origin=n,e.position=[i[0]-n[0],i[1]-n[1]],e.scale=[a,a],this._updateTransform()},_updateTransform:function(){var t=this._roamTransform,e=this._viewTransform;e.parent=t,t.updateTransform(),e.updateTransform(),e.transform&&s.copy(this.transform||(this.transform=[]),e.transform),this.transform?(this.invTransform=this.invTransform||[],s.invert(this.invTransform,this.transform)):this.invTransform=null,this.decomposeTransform()},getViewRect:function(){return this._viewRect},getViewRectAfterRoam:function(){var t=this.getBoundingRect().clone();return t.applyTransform(this.transform),t},dataToPoint:function(t){var e=this.transform;return e?c([],t,e):[t[0],t[1]]},pointToData:function(t){var e=this.invTransform;return e?c([],t,e):[t[0],t[1]]},convertToPixel:u.curry(o,"dataToPoint"),convertFromPixel:u.curry(o,"pointToData"),containPoint:function(t){return this.getViewRectAfterRoam().contain(t[0],t[1])}},u.mixin(a,l),t.exports=a},function(t,e,i){function n(t,e,i){if(this.name=t,this.geometries=e,i)i=[i[0],i[1]];else{var n=this.getBoundingRect();i=[n.x+n.width/2,n.y+n.height/2]}this.center=i}var a=i(275),o=i(12),r=i(90),s=i(6);n.prototype={constructor:n,properties:null,getBoundingRect:function(){var t=this._rect;if(t)return t;for(var e=Number.MAX_VALUE,i=[e,e],n=[-e,-e],a=[],l=[],u=this.geometries,h=0;h<u.length;h++)if("polygon"===u[h].type){var c=u[h].exterior;r.fromPoints(c,a,l),s.min(i,i,a),s.max(n,n,l)}return 0===h&&(i[0]=i[1]=n[0]=n[1]=0),this._rect=new o(i[0],i[1],n[0]-i[0],n[1]-i[1])},contain:function(t){var e=this.getBoundingRect(),i=this.geometries;if(!e.contain(t[0],t[1]))return!1;t:for(var n=0,o=i.length;n<o;n++)if("polygon"===i[n].type){var r=i[n].exterior,s=i[n].interiors;if(a.contain(r,t[0],t[1])){for(var l=0;l<(s?s.length:0);l++)if(a.contain(s[l]))continue t;return!0}}return!1},transformTo:function(t,e,i,n){var a=this.getBoundingRect(),r=a.width/a.height;i?n||(n=i/r):i=r*n;for(var l=new o(t,e,i,n),u=a.calculateTransform(l),h=this.geometries,c=0;c<h.length;c++)if("polygon"===h[c].type){for(var d=h[c].exterior,f=h[c].interiors,p=0;p<d.length;p++)s.applyTransform(d[p],d[p],u);for(var g=0;g<(f?f.length:0);g++)for(var p=0;p<f[g].length;p++)s.applyTransform(f[g][p],f[g][p],u)}a=this._rect,a.copy(l),this.center=[a.x+a.width/2,a.y+a.height/2]}},t.exports=n},function(t,e,i){function n(t){if(!t.UTF8Encoding)return t;var e=t.UTF8Scale;null==e&&(e=1024);for(var i=t.features,n=0;n<i.length;n++)for(var o=i[n],r=o.geometry,s=r.coordinates,l=r.encodeOffsets,u=0;u<s.length;u++){var h=s[u];if("Polygon"===r.type)s[u]=a(h,l[u],e);else if("MultiPolygon"===r.type)for(var c=0;c<h.length;c++){var d=h[c];h[c]=a(d,l[u][c],e)}}return t.UTF8Encoding=!1,t}function a(t,e,i){for(var n=[],a=e[0],o=e[1],r=0;r<t.length;r+=2){var s=t.charCodeAt(r)-64,l=t.charCodeAt(r+1)-64;s=s>>1^-(1&s),l=l>>1^-(1&l),s+=a,l+=o,a=s,o=l,n.push([s/i,l/i])}return n}var o=i(1),r=i(269);t.exports=function(t){return n(t),o.map(o.filter(t.features,function(t){return t.geometry&&t.properties&&t.geometry.coordinates.length>0}),function(t){var e=t.properties,i=t.geometry,n=i.coordinates,a=[];"Polygon"===i.type&&a.push({type:"polygon",exterior:n[0],interiors:n.slice(1)}),"MultiPolygon"===i.type&&o.each(n,function(t){t[0]&&a.push({type:"polygon",exterior:t[0],interiors:t.slice(1)})});var s=new r(e.name,a,e.cp);return s.properties=e,s})}},function(t,e,i){function n(t,e){var i=[];return t.eachComponent("parallel",function(n,o){var r=new a(n,t,e);r.name="parallel_"+o,r.resize(n,e),n.coordinateSystem=r,r.model=n,i.push(r)}),t.eachSeries(function(e){if("parallel"===e.get("coordinateSystem")){var i=t.queryComponents({mainType:"parallel",index:e.get("parallelIndex"),id:e.get("parallelId")})[0];e.coordinateSystem=i.coordinateSystem}}),i}var a=i(414);i(26).register("parallel",{create:n})},function(t,e,i){function n(t){var e=t.mainData,i=t.datas;i||(i={main:e},t.datasAttr={main:"data"}),t.datas=t.mainData=null,u(e,i,t),d(i,function(i){d(e.TRANSFERABLE_METHODS,function(e){i.wrapMethod(e,c.curry(a,t))})}),e.wrapMethod("cloneShallow",c.curry(r,t)),d(e.CHANGABLE_METHODS,function(i){e.wrapMethod(i,c.curry(o,t))}),c.assert(i[e.dataType]===e)}function a(t,e){if(l(this)){var i=c.extend({},this[f]);i[this.dataType]=e,u(e,i,t)}else h(e,this.dataType,this[p],t);return e}function o(t,e){return t.struct&&t.struct.update(this),e}function r(t,e){return d(e[f],function(i,n){i!==e&&h(i.cloneShallow(),n,e,t)}),e}function s(t){var e=this[p];return null==t||null==e?e:e[f][t];
}function l(t){return t[p]===t}function u(t,e,i){t[f]={},d(e,function(e,n){h(e,n,t,i)})}function h(t,e,i,n){i[f][e]=t,t[p]=i,t.dataType=e,n.struct&&(t[n.structAttr]=n.struct,n.struct[n.datasAttr[e]]=t),t.getLinkedData=s}var c=i(1),d=c.each,f="\0__link_datas",p="\0__link_mainData";t.exports=n},function(t,e,i){function n(){function t(e,n){if(n>=i.length)return e;for(var o=-1,r=e.length,s=i[n++],l={},u={};++o<r;){var h=s(e[o]),c=u[h];c?c.push(e[o]):u[h]=[e[o]]}return a.each(u,function(e,i){l[i]=t(e,n)}),l}function e(t,o){if(o>=i.length)return t;var r=[],s=n[o++];return a.each(t,function(t,i){r.push({key:i,values:e(t,o)})}),s?r.sort(function(t,e){return s(t.key,e.key)}):r}var i=[],n=[];return{key:function(t){return i.push(t),this},sortKeys:function(t){return n[i.length-1]=t,this},entries:function(i){return e(t(i,0),0)}}}var a=i(1);t.exports=n},function(t,e,i){var n=i(1),a={get:function(t,e,i){var a=n.clone((o[t]||{})[e]);return i&&n.isArray(a)?a[a.length-1]:a}},o={color:{active:["#006edd","#e0ffff"],inactive:["rgba(0,0,0,0)"]},colorHue:{active:[0,360],inactive:[0,0]},colorSaturation:{active:[.3,1],inactive:[0,0]},colorLightness:{active:[.9,.5],inactive:[0,0]},colorAlpha:{active:[.3,1],inactive:[0,0]},opacity:{active:[.3,1],inactive:[0,0]},symbol:{active:["circle","roundRect","diamond"],inactive:["none"]},symbolSize:{active:[10,50],inactive:[0,0]}};t.exports=a},function(t,e,i){function n(t,e){return Math.abs(t-e)<r}function a(t,e,i){var a=0,r=t[0];if(!r)return!1;for(var s=1;s<t.length;s++){var l=t[s];a+=o(r[0],r[1],l[0],l[1],e,i),r=l}var u=t[0];return n(r[0],u[0])&&n(r[1],u[1])||(a+=o(r[0],r[1],u[0],u[1],e,i)),0!==a}var o=i(104),r=1e-8;t.exports={contain:a}},function(t,e,i){var n=i(95).extend({type:"series.pictorialBar",dependencies:["grid"],defaultOption:{symbol:"circle",symbolSize:null,symbolRotate:null,symbolPosition:null,symbolOffset:null,symbolMargin:null,symbolRepeat:!1,symbolRepeatDirection:"end",symbolClip:!1,symbolBoundingData:null,symbolPatternSize:400,barGap:"-100%",progressive:0,hoverAnimation:!1},getInitialData:function(t){return t.stack=null,n.superApply(this,"getInitialData",arguments)}});t.exports=n},function(t,e,i){function n(t,e,i,n){var o=t.getItemLayout(e),u=i.get("symbolRepeat"),h=i.get("symbolClip"),c=i.get("symbolPosition")||"start",d=i.get("symbolRotate"),f=(d||0)*Math.PI/180||0,p=i.get("symbolPatternSize")||2,g=i.isAnimationEnabled(),m={dataIndex:e,layout:o,itemModel:i,symbolType:t.getItemVisual(e,"symbol")||"circle",color:t.getItemVisual(e,"color"),symbolClip:h,symbolRepeat:u,symbolRepeatDirection:i.get("symbolRepeatDirection"),symbolPatternSize:p,rotation:f,animationModel:g?i:null,hoverAnimation:g&&i.get("hoverAnimation"),z2:i.getShallow("z",!0)||0};a(i,u,o,n,m),r(t,e,o,u,h,m.boundingLength,m.pxSign,p,n,m),s(i,m.symbolScale,f,n,m);var v=m.symbolSize,y=i.get("symbolOffset");return T.isArray(y)&&(y=[P(y[0],v[0]),P(y[1],v[1])]),l(i,v,o,u,h,y,c,m.valueLineWidth,m.boundingLength,m.repeatCutLength,n,m),m}function a(t,e,i,n,a){var r,s=n.valueDim,l=t.get("symbolBoundingData"),u=n.coordSys.getOtherAxis(n.coordSys.getBaseAxis()),h=u.toGlobalCoord(u.dataToCoord(0)),c=1-+(i[s.wh]<=0);if(T.isArray(l)){var d=[o(u,l[0])-h,o(u,l[1])-h];d[1]<d[0]&&d.reverse(),r=d[c]}else r=null!=l?o(u,l)-h:e?n.coordSysExtent[s.index][c]-h:i[s.wh];a.boundingLength=r,e&&(a.repeatCutLength=i[s.wh]),a.pxSign=r>0?1:r<0?-1:0}function o(t,e){return t.toGlobalCoord(t.dataToCoord(t.scale.parse(e)))}function r(t,e,i,n,a,o,r,s,l,u){var h=l.valueDim,c=l.categoryDim,d=Math.abs(i[c.wh]),f=t.getItemVisual(e,"symbolSize");T.isArray(f)?f=f.slice():(null==f&&(f="100%"),f=[f,f]),f[c.index]=P(f[c.index],d),f[h.index]=P(f[h.index],n?d:Math.abs(o)),u.symbolSize=f;var p=u.symbolScale=[f[0]/s,f[1]/s];p[h.index]*=(l.isHorizontal?-1:1)*r}function s(t,e,i,n,a){var o=t.get(k)||0;o&&(z.attr({scale:e.slice(),rotation:i}),z.updateTransform(),o/=z.getLineScale(),o*=e[n.valueDim.index]),a.valueLineWidth=o}function l(t,e,i,n,a,o,r,s,l,u,h,c){var d=h.categoryDim,f=h.valueDim,p=c.pxSign,g=Math.max(e[f.index]+s,0),m=g;if(n){var v=Math.abs(l),y=T.retrieve(t.get("symbolMargin"),"15%")+"",x=!1;y.lastIndexOf("!")===y.length-1&&(x=!0,y=y.slice(0,y.length-1)),y=P(y,e[f.index]);var _=Math.max(g+2*y,0),b=x?0:2*y,w=L.isNumeric(n),S=w?n:I((v+b)/_),M=v-S*g;y=M/2/(x?S:S-1),_=g+2*y,b=x?0:2*y,w||"fixed"===n||(S=u?I((Math.abs(u)+b)/_):0),m=S*_-b,c.repeatTimes=S,c.symbolMargin=y}var A=p*(m/2),C=c.pathPosition=[];C[d.index]=i[d.wh]/2,C[f.index]="start"===r?A:"end"===r?l-A:l/2,o&&(C[0]+=o[0],C[1]+=o[1]);var D=c.bundlePosition=[];D[d.index]=i[d.xy],D[f.index]=i[f.xy];var k=c.barRectShape=T.extend({},i);k[f.wh]=p*Math.max(Math.abs(i[f.wh]),Math.abs(C[f.index]+A)),k[d.wh]=i[d.wh];var O=c.clipShape={};O[d.xy]=-i[d.xy],O[d.wh]=h.ecSize[d.wh],O[f.xy]=0,O[f.wh]=i[f.wh]}function u(t){var e=t.symbolPatternSize,i=C.createSymbol(t.symbolType,-e/2,-e/2,e,e,t.color);return i.attr({culling:!0}),"image"!==i.type&&i.setStyle({strokeNoScale:!0}),i}function h(t,e,i,n){function a(t){var e=c.slice(),n=i.pxSign,a=t;return("start"===i.symbolRepeatDirection?n>0:n<0)&&(a=f-1-t),e[d.index]=g*(a-f/2+.5)+c[d.index],{position:e,scale:i.symbolScale.slice(),rotation:i.rotation}}function o(){w(t,function(t){t.trigger("emphasis")})}function r(){w(t,function(t){t.trigger("normal")})}var s=t.__pictorialBundle,l=i.symbolSize,h=i.valueLineWidth,c=i.pathPosition,d=e.valueDim,f=i.repeatTimes||0,p=0,g=l[e.valueDim.index]+h+2*i.symbolMargin;for(w(t,function(t){t.__pictorialAnimationIndex=p,t.__pictorialRepeatTimes=f,p<f?S(t,null,a(p),i,n):S(t,null,{scale:[0,0]},i,n,function(){s.remove(t)}),v(t,i),p++});p<f;p++){var m=u(i);m.__pictorialAnimationIndex=p,m.__pictorialRepeatTimes=f,s.add(m);var y=a(p);S(m,{position:y.position,scale:[0,0]},{scale:y.scale,rotation:y.rotation},i,n),m.on("mouseover",o).on("mouseout",r),v(m,i)}}function c(t,e,i,n){function a(){this.trigger("emphasis")}function o(){this.trigger("normal")}var r=t.__pictorialBundle,s=t.__pictorialMainPath;s?S(s,null,{position:i.pathPosition.slice(),scale:i.symbolScale.slice(),rotation:i.rotation},i,n):(s=t.__pictorialMainPath=u(i),r.add(s),S(s,{position:i.pathPosition.slice(),scale:[0,0],rotation:i.rotation},{scale:i.symbolScale.slice()},i,n),s.on("mouseover",a).on("mouseout",o)),v(s,i)}function d(t,e,i){var n=T.extend({},e.barRectShape),a=t.__pictorialBarRect;a?S(a,null,{shape:n},e,i):(a=t.__pictorialBarRect=new A.Rect({z2:2,shape:n,silent:!0,style:{stroke:"transparent",fill:"transparent",lineWidth:0}}),t.add(a))}function f(t,e,i,n){if(i.symbolClip){var a=t.__pictorialClipPath,o=T.extend({},i.clipShape),r=e.valueDim,s=i.animationModel,l=i.dataIndex;if(a)A.updateProps(a,{shape:o},s,l);else{o[r.wh]=0,a=new A.Rect({shape:o}),t.__pictorialBundle.setClipPath(a),t.__pictorialClipPath=a;var u={};u[r.wh]=i.clipShape[r.wh],A[n?"updateProps":"initProps"](a,{shape:u},s,l)}}}function p(t,e){var i=t.getItemModel(e);return i.getAnimationDelayParams=g,i.isAnimationEnabled=m,i}function g(t){return{index:t.__pictorialAnimationIndex,count:t.__pictorialRepeatTimes}}function m(){return this.parentModel.isAnimationEnabled()&&!!this.getShallow("animation")}function v(t,e){t.off("emphasis").off("normal");var i=e.symbolScale.slice();e.hoverAnimation&&t.on("emphasis",function(){this.animateTo({scale:[1.1*i[0],1.1*i[1]]},400,"elasticOut")}).on("normal",function(){this.animateTo({scale:i.slice()},400,"elasticOut")})}function y(t,e,i,n){var a=new A.Group,o=new A.Group;return a.add(o),a.__pictorialBundle=o,o.attr("position",i.bundlePosition.slice()),i.symbolRepeat?h(a,e,i):c(a,e,i),d(a,i,n),f(a,e,i,n),a.__pictorialShapeStr=b(t,i),a.__pictorialSymbolMeta=i,a}function x(t,e,i){var n=i.animationModel,a=i.dataIndex,o=t.__pictorialBundle;A.updateProps(o,{position:i.bundlePosition.slice()},n,a),i.symbolRepeat?h(t,e,i,!0):c(t,e,i,!0),d(t,i,!0),f(t,e,i,!0)}function _(t,e,i,n){var a=n.__pictorialBarRect;a&&(a.style.text=null);var o=[];w(n,function(t){o.push(t)}),n.__pictorialMainPath&&o.push(n.__pictorialMainPath),n.__pictorialClipPath&&(i=null),T.each(o,function(t){A.updateProps(t,{scale:[0,0]},i,e,function(){n.parent&&n.parent.remove(n)})}),t.setItemGraphicEl(e,null)}function b(t,e){return[t.getItemVisual(e.dataIndex,"symbol")||"none",!!e.symbolRepeat,!!e.symbolClip].join(":")}function w(t,e,i){T.each(t.__pictorialBundle.children(),function(n){n!==t.__pictorialBarRect&&e.call(i,n)})}function S(t,e,i,n,a,o){e&&t.attr(e),n.symbolClip&&!a?i&&t.attr(i):i&&A[a?"updateProps":"initProps"](t,i,n.animationModel,n.dataIndex,o)}function M(t,e,i){var n=i.color,a=i.dataIndex,o=i.itemModel,r=o.getModel("itemStyle.normal").getItemStyle(["color"]),s=o.getModel("itemStyle.emphasis").getItemStyle(),l=o.getShallow("cursor");w(t,function(t){t.setColor(n),t.setStyle(T.defaults({fill:n,opacity:i.opacity},r)),A.setHoverStyle(t,s),l&&(t.cursor=l),t.z2=i.z2});var u={},h=e.valueDim.posDesc[+(i.boundingLength>0)],c=t.__pictorialBarRect;D.setLabel(c.style,u,o,n,e.seriesModel,a,h),A.setHoverStyle(c,u)}function I(t){var e=Math.round(t);return Math.abs(t-e)<1e-4?e:Math.ceil(t)}var T=i(1),A=i(3),C=i(24),L=i(4),D=i(96),P=L.parsePercent,k=["itemStyle","normal","borderWidth"],O=[{xy:"x",wh:"width",index:0,posDesc:["left","right"]},{xy:"y",wh:"height",index:1,posDesc:["top","bottom"]}],z=new A.Circle,E=i(2).extendChartView({type:"pictorialBar",render:function(t,e,i){var a=this.group,o=t.getData(),r=this._data,s=t.coordinateSystem,l=s.getBaseAxis(),u=!!l.isHorizontal(),h=s.grid.getRect(),c={ecSize:{width:i.getWidth(),height:i.getHeight()},seriesModel:t,coordSys:s,coordSysExtent:[[h.x,h.x+h.width],[h.y,h.y+h.height]],isHorizontal:u,valueDim:O[+u],categoryDim:O[1-u]};return o.diff(r).add(function(t){if(o.hasValue(t)){var e=p(o,t),i=n(o,t,e,c),r=y(o,c,i);o.setItemGraphicEl(t,r),a.add(r),M(r,c,i)}}).update(function(t,e){var i=r.getItemGraphicEl(e);if(!o.hasValue(t))return void a.remove(i);var s=p(o,t),l=n(o,t,s,c),u=b(o,l);i&&u!==i.__pictorialShapeStr&&(a.remove(i),o.setItemGraphicEl(t,null),i=null),i?x(i,c,l):i=y(o,c,l,!0),o.setItemGraphicEl(t,i),i.__pictorialSymbolMeta=l,a.add(i),M(i,c,l)}).remove(function(t){var e=r.getItemGraphicEl(t);e&&_(r,t,e.__pictorialSymbolMeta.animationModel,e)}).execute(),this._data=o,this.group},dispose:T.noop,remove:function(t,e){var i=this.group,n=this._data;t.get("animation")?n&&n.eachItemGraphicEl(function(e){_(n,e.dataIndex,t,e)}):i.removeAll()}});t.exports=E},function(t,e,i){var n=i(2);i(279),i(280),n.registerVisual(i(282)),n.registerLayout(i(281))},function(t,e,i){"use strict";var n=i(1),a=i(17),o=i(189),r=a.extend({type:"series.boxplot",dependencies:["xAxis","yAxis","grid"],defaultValueDimensions:["min","Q1","median","Q3","max"],dimensions:null,defaultOption:{zlevel:0,z:2,coordinateSystem:"cartesian2d",legendHoverLink:!0,hoverAnimation:!0,layout:null,boxWidth:[7,50],itemStyle:{normal:{color:"#fff",borderWidth:1},emphasis:{borderWidth:2,shadowBlur:5,shadowOffsetX:2,shadowOffsetY:2,shadowColor:"rgba(0,0,0,0.4)"}},animationEasing:"elasticOut",animationDuration:800}});n.mixin(r,o.seriesModelMixin,!0),t.exports=r},function(t,e,i){"use strict";function n(t,e,i){var n=e.getItemModel(i),a=n.getModel(u),o=e.getItemVisual(i,"color"),s=a.getItemStyle(["borderColor"]),l=t.childAt(t.whiskerIndex);l.style.set(s),l.style.stroke=o,l.dirty();var c=t.childAt(t.bodyIndex);c.style.set(s),c.style.stroke=o,c.dirty();var d=n.getModel(h).getItemStyle();r.setHoverStyle(t,d)}var a=i(1),o=i(30),r=i(3),s=i(189),l=o.extend({type:"boxplot",getStyleUpdater:function(){return n},dispose:a.noop});a.mixin(l,s.viewMixin,!0);var u=["itemStyle","normal"],h=["itemStyle","emphasis"];t.exports=l},function(t,e,i){function n(t){var e=[],i=[];return t.eachSeriesByType("boxplot",function(t){var n=t.getBaseAxis(),a=r.indexOf(i,n);a<0&&(a=i.length,i[a]=n,e[a]={axis:n,seriesModels:[]}),e[a].seriesModels.push(t)}),e}function a(t){var e,i,n=t.axis,a=t.seriesModels,o=a.length,s=t.boxWidthList=[],h=t.boxOffsetList=[],c=[];if("category"===n.type)i=n.getBandWidth();else{var d=0;u(a,function(t){d=Math.max(d,t.getData().count())}),e=n.getExtent(),Math.abs(e[1]-e[0])/d}u(a,function(t){var e=t.get("boxWidth");r.isArray(e)||(e=[e,e]),c.push([l(e[0],i)||0,l(e[1],i)||0])});var f=.8*i-2,p=f/o*.3,g=(f-p*(o-1))/o,m=g/2-f/2;u(a,function(t,e){h.push(m),m+=p+g,s.push(Math.min(Math.max(g,c[e][0]),c[e][1]))})}function o(t,e,i){var n,a=t.coordinateSystem,o=t.getData(),s=i/2,l=t.get("layout"),u="horizontal"===l?0:1,h=1-u,c=["x","y"],d=[];r.each(o.dimensions,function(t){var e=o.getDimensionInfo(t),i=e.coordDim;i===c[h]?d.push(t):i===c[u]&&(n=t)}),null==n||d.length<5||o.each([n].concat(d),function(){function t(t){var i=[];i[u]=c,i[h]=t;var n;return isNaN(c)||isNaN(t)?n=[NaN,NaN]:(n=a.dataToPoint(i),n[u]+=e),n}function i(t,e){var i=t.slice(),n=t.slice();i[u]+=s,n[u]-=s,e?y.push(i,n):y.push(n,i)}function n(t){var e=[t.slice(),t.slice()];e[0][u]-=s,e[1][u]+=s,v.push(e)}var r=arguments,c=r[0],f=r[d.length+1],p=t(r[3]),g=t(r[1]),m=t(r[5]),v=[[g,t(r[2])],[m,t(r[4])]];n(g),n(m),n(p);var y=[];i(v[0][1],0),i(v[1][1],1),o.setItemLayout(f,{chartLayout:l,initBaseline:p[h],median:p,bodyEnds:y,whiskerEnds:v})})}var r=i(1),s=i(4),l=s.parsePercent,u=r.each;t.exports=function(t){var e=n(t);u(e,function(t){var e=t.seriesModels;e.length&&(a(t),u(e,function(e,i){o(e,t.boxOffsetList[i],t.boxWidthList[i])}))})}},function(t,e){var i=["itemStyle","normal","borderColor"];t.exports=function(t,e){var n=t.get("color");t.eachRawSeriesByType("boxplot",function(e){var a=n[e.seriesIndex%n.length],o=e.getData();o.setVisual({legendSymbol:"roundRect",color:e.get(i)||a}),t.isSeriesFiltered(e)||o.each(function(t){var e=o.getItemModel(t);o.setItemVisual(t,{color:e.get(i,!0)})})})}},function(t,e,i){var n=i(2);i(284),i(285),n.registerPreprocessor(i(288)),n.registerVisual(i(287)),n.registerLayout(i(286))},function(t,e,i){"use strict";var n=i(1),a=i(17),o=i(189),r=a.extend({type:"series.candlestick",dependencies:["xAxis","yAxis","grid"],defaultValueDimensions:["open","close","lowest","highest"],dimensions:null,defaultOption:{zlevel:0,z:2,coordinateSystem:"cartesian2d",legendHoverLink:!0,hoverAnimation:!0,layout:null,itemStyle:{normal:{color:"#c23531",color0:"#314656",borderWidth:1,borderColor:"#c23531",borderColor0:"#314656"},emphasis:{borderWidth:2}},barMaxWidth:null,barMinWidth:null,barWidth:null,animationUpdate:!1,animationEasing:"linear",animationDuration:300},getShadowDim:function(){return"open"},brushSelector:function(t,e,i){var n=e.getItemLayout(t);return i.rect(n.brushRect)}});n.mixin(r,o.seriesModelMixin,!0),t.exports=r},function(t,e,i){"use strict";function n(t,e,i){var n=e.getItemModel(i),a=n.getModel(u),o=e.getItemVisual(i,"color"),s=e.getItemVisual(i,"borderColor")||o,l=a.getItemStyle(["color","color0","borderColor","borderColor0"]),c=t.childAt(t.whiskerIndex);c.useStyle(l),c.style.stroke=s;var d=t.childAt(t.bodyIndex);d.useStyle(l),d.style.fill=o,d.style.stroke=s;var f=n.getModel(h).getItemStyle();r.setHoverStyle(t,f)}var a=i(1),o=i(30),r=i(3),s=i(189),l=o.extend({type:"candlestick",getStyleUpdater:function(){return n},dispose:a.noop});a.mixin(l,s.viewMixin,!0);var u=["itemStyle","normal"],h=["itemStyle","emphasis"];t.exports=l},function(t,e,i){function n(t,e){var i,n=t.getBaseAxis(),a="category"===n.type?n.getBandWidth():(i=n.getExtent(),Math.abs(i[1]-i[0])/e.count()),s=r(o(t.get("barMaxWidth"),a),a),l=r(o(t.get("barMinWidth"),1),a),u=t.get("barWidth");return null!=u?r(u,a):Math.max(Math.min(a/2,s),l)}var a=i(1),o=i(1).retrieve,r=i(4).parsePercent,s=i(3);t.exports=function(t){t.eachSeriesByType("candlestick",function(t){var e,i=t.coordinateSystem,o=t.getData(),r=n(t,o),l=t.get("layout"),u="horizontal"===l?0:1,h=1-u,c=["x","y"],d=[];if(a.each(o.dimensions,function(t){var i=o.getDimensionInfo(t),n=i.coordDim;n===c[h]?d.push(t):n===c[u]&&(e=t)}),!(null==e||d.length<4)){var f=0;o.each([e].concat(d),function(){function t(t){var e=[];return e[u]=p,e[h]=t,isNaN(p)||isNaN(t)?[NaN,NaN]:i.dataToPoint(e)}function e(t,e){var i=t.slice(),n=t.slice();i[u]=s.subPixelOptimize(i[u]+r/2,1,!1),n[u]=s.subPixelOptimize(n[u]-r/2,1,!0),e?A.push(i,n):A.push(n,i)}function n(){var e=t(Math.min(m,v,y,x)),i=t(Math.max(m,v,y,x));return e[u]-=r/2,i[u]-=r/2,{x:e[0],y:e[1],width:h?r:i[0]-e[0],height:h?i[1]-e[1]:r}}function a(t){return t[u]=s.subPixelOptimize(t[u],1),t}var c=arguments,p=c[0],g=c[d.length+1],m=c[1],v=c[2],y=c[3],x=c[4],_=Math.min(m,v),b=Math.max(m,v),w=t(_),S=t(b),M=t(y),I=t(x),T=[[a(I),a(S)],[a(M),a(w)]],A=[];e(S,0),e(w,1);var C;C=m>v?-1:m<v?1:f>0?o.getItemModel(f-1).get()[2]<=v?1:-1:1,o.setItemLayout(g,{chartLayout:l,sign:C,initBaseline:m>v?S[h]:w[h],bodyEnds:A,whiskerEnds:T,brushRect:n()}),++f},!0)}})}},function(t,e){var i=["itemStyle","normal","borderColor"],n=["itemStyle","normal","borderColor0"],a=["itemStyle","normal","color"],o=["itemStyle","normal","color0"];t.exports=function(t,e){t.eachRawSeriesByType("candlestick",function(e){var r=e.getData();r.setVisual({legendSymbol:"roundRect"}),t.isSeriesFiltered(e)||r.each(function(t){var e=r.getItemModel(t),s=r.getItemLayout(t).sign;r.setItemVisual(t,{color:e.get(s>0?a:o),borderColor:e.get(s>0?i:n)})})})}},function(t,e,i){var n=i(1);t.exports=function(t){t&&n.isArray(t.series)&&n.each(t.series,function(t){n.isObject(t)&&"k"===t.type&&(t.type="candlestick")})}},function(t,e,i){function n(t){var e,i=t.type;if("path"===i){var n=t.shape;e=m.makePath(n.pathData,null,{x:n.x||0,y:n.y||0,width:n.width||0,height:n.height||0},"center"),e.__customPathData=t.pathData}else if("image"===i)e=new m.Image({}),e.__customImagePath=t.style.image;else if("text"===i)e=new m.Text({}),e.__customText=t.style.text;else{var a=m[i.charAt(0).toUpperCase()+i.slice(1)];e=new a}return e.__customGraphicType=i,e.name=t.name,e}function a(t,e,i,n,a,r){var s={},l=i.style||{};if(i.shape&&(s.shape=g.clone(i.shape)),i.position&&(s.position=i.position.slice()),i.scale&&(s.scale=i.scale.slice()),i.origin&&(s.origin=i.origin.slice()),i.rotation&&(s.rotation=i.rotation),"image"===t.type&&i.style){var u=s.style={};g.each(["x","y","width","height"],function(e){o(e,u,l,t.style,r)})}if("text"===t.type&&i.style){var u=s.style={};g.each(["x","y"],function(e){o(e,u,l,t.style,r)}),!l.hasOwnProperty("textFill")&&l.fill&&(l.textFill=l.fill),!l.hasOwnProperty("textStroke")&&l.stroke&&(l.textStroke=l.stroke)}if("group"!==t.type&&(t.useStyle(l),r)){t.style.opacity=0;var h=l.opacity;null==h&&(h=1),m.initProps(t,{style:{opacity:h}},n,e)}r?t.attr(s):m.updateProps(t,s,n,e),t.attr({z2:i.z2||0,silent:i.silent}),i.styleEmphasis!==!1&&m.setHoverStyle(t,i.styleEmphasis)}function o(t,e,i,n,a){null==i[t]||a||(e[t]=i[t],i[t]=n[t])}function r(t,e,i,n){function a(t){null==t&&(t=_),O&&(I=e.getItemModel(t),A=I.getModel(S),C=I.getModel(M),L=v.findLabelValueDim(e),D=e.getItemVisual(t,"color"),O=!1)}function o(t,i){return null==i&&(i=_),e.get(e.getDimension(t||0),i)}function r(i,n){null==n&&(n=_),a(n);var o=I.getModel(b).getItemStyle();null!=D&&(o.fill=D);var r=e.getItemVisual(n,"opacity");return null!=r&&(o.opacity=r),null!=L&&(m.setTextStyle(o,A,null,{autoColor:D,isRectText:!0}),o.text=A.getShallow("show")?g.retrieve2(t.getFormattedLabel(n,"normal"),e.get(L,n)):null),i&&g.extend(o,i),o}function l(i,n){null==n&&(n=_),a(n);var o=I.getModel(w).getItemStyle();return null!=L&&(m.setTextStyle(o,C,null,{isRectText:!0},!0),o.text=C.getShallow("show")?g.retrieve3(t.getFormattedLabel(n,"emphasis"),t.getFormattedLabel(n,"normal"),e.get(L,n)):null),i&&g.extend(o,i),o}function u(t,i){return null==i&&(i=_),e.getItemVisual(i,t)}function h(t){if(p.getBaseAxis){var e=p.getBaseAxis();return x.getLayoutOnAxis(g.defaults({axis:e},t),n)}}function c(){return i.getCurrentSeriesIndices()}function d(t){return m.getFont(t,i)}var f=t.get("renderItem"),p=t.coordinateSystem,y={};p&&(y=p.prepareCustoms?p.prepareCustoms():T[p.type](p));var _,I,A,C,L,D,P=g.defaults({getWidth:n.getWidth,getHeight:n.getHeight,getZr:n.getZr,getDevicePixelRatio:n.getDevicePixelRatio,value:o,style:r,styleEmphasis:l,visual:u,barLayout:h,currentSeriesIndices:c,font:d},y.api||{}),k={context:{},seriesId:t.id,seriesName:t.name,seriesIndex:t.seriesIndex,coordSys:y.coordSys,dataInsideLength:e.count(),encode:s(t.getData())},O=!0;return function(t){return _=t,O=!0,f&&f(g.defaults({dataIndexInside:t,dataIndex:e.getRawIndex(t)},k),P)||{}}}function s(t){var e={};return g.each(t.dimensions,function(i,n){var a=t.getDimensionInfo(i);if(!a.isExtraCoord){var o=a.coordDim,r=e[o]=e[o]||[];r[a.coordDimIndex]=n}}),e}function l(t,e,i,n,a,o){t=u(t,e,i,n,a,o),t&&o.setItemGraphicEl(e,t)}function u(t,e,i,o,r,s){var l=i.type;if(!t||l===t.__customGraphicType||"path"===l&&i.pathData===t.__customPathData||"image"===l&&i.style.image===t.__customImagePath||"text"===l&&i.style.text===t.__customText||(r.remove(t),t=null),null!=l){var c=!t;if(!t&&(t=n(i)),a(t,e,i,o,s,c),"group"===l){var d=t.children()||[],f=i.children||[];if(i.diffChildrenByName)h({oldChildren:d,newChildren:f,dataIndex:e,animatableModel:o,group:t,data:s});else{for(var p=0;p<f.length;p++)u(t.childAt(p),e,f[p],o,t,s);for(;p<d.length;p++)d[p]&&t.remove(d[p])}}return r.add(t),t}}function h(t){new _(t.oldChildren,t.newChildren,c,c,t).add(d).update(d).remove(f).execute()}function c(t,e){var i=t&&t.name;return null!=i?i:I+e}function d(t,e){var i=this.context,n=null!=t?i.newChildren[t]:null,a=null!=e?i.oldChildren[e]:null;u(a,i.dataIndex,n,i.animatableModel,i.group,i.data)}function f(t){var e=this.context,i=e.oldChildren[t];i&&e.group.remove(i)}var p=i(2),g=i(1),m=i(3),v=i(97),y=i(28),x=i(87),_=i(43),b=["itemStyle","normal"],w=["itemStyle","emphasis"],S=["label","normal"],M=["label","emphasis"],I="e\0\0",T={cartesian2d:i(405),geo:i(412),singleAxis:i(430),polar:i(423),calendar:i(404)};p.extendSeriesModel({type:"series.custom",dependencies:["grid","polar","geo","singleAxis","calendar"],defaultOption:{coordinateSystem:"cartesian2d",zlevel:0,z:2,legendHoverLink:!0},getInitialData:function(t,e){return y(t.data,this,e)}}),p.extendChartView({type:"custom",_data:null,render:function(t,e,i){var n=this._data,a=t.getData(),o=this.group,s=r(t,a,e,i);a.diff(n).add(function(e){a.hasValue(e)&&l(null,e,s(e),t,o,a)}).update(function(e,i){var r=n.getItemGraphicEl(i);a.hasValue(e)?l(r,e,s(e),t,o,a):r&&o.remove(r)}).remove(function(t){var e=n.getItemGraphicEl(t);e&&o.remove(e)}).execute(),this._data=a},dispose:g.noop})},function(t,e,i){var n=i(1),a=i(2);i(291),i(292),a.registerVisual(n.curry(i(51),"effectScatter","circle",null)),a.registerLayout(n.curry(i(64),"effectScatter"))},function(t,e,i){"use strict";var n=i(28),a=i(17);t.exports=a.extend({type:"series.effectScatter",dependencies:["grid","polar"],getInitialData:function(t,e){var i=n(t.data,this,e);return i},brushSelector:"point",defaultOption:{coordinateSystem:"cartesian2d",zlevel:0,z:2,legendHoverLink:!0,effectType:"ripple",progressive:0,showEffectOn:"render",rippleEffect:{period:4,scale:2.5,brushType:"fill"},symbolSize:10}})},function(t,e,i){var n=i(46),a=i(319);i(2).extendChartView({type:"effectScatter",init:function(){this._symbolDraw=new n(a)},render:function(t,e,i){var n=t.getData(),a=this._symbolDraw;a.updateData(n),this.group.add(a.group)},updateLayout:function(){this._symbolDraw.updateLayout()},remove:function(t,e){this._symbolDraw&&this._symbolDraw.remove(e)},dispose:function(){}})},function(t,e,i){var n=i(1),a=i(2);i(294),i(295),a.registerVisual(n.curry(i(89),"funnel")),a.registerLayout(i(296)),a.registerProcessor(n.curry(i(66),"funnel"))},function(t,e,i){"use strict";var n=i(14),a=i(5),o=i(25),r=i(2).extendSeriesModel({type:"series.funnel",init:function(t){r.superApply(this,"init",arguments),this.legendDataProvider=function(){return this.getRawData()},this._defaultLabelLine(t)},getInitialData:function(t,e){var i=o(["value"],t.data),a=new n(i,this);return a.initData(t.data),a},_defaultLabelLine:function(t){a.defaultEmphasis(t.labelLine,["show"]);var e=t.labelLine.normal,i=t.labelLine.emphasis;e.show=e.show&&t.label.normal.show,i.show=i.show&&t.label.emphasis.show},getDataParams:function(t){var e=this.getData(),i=r.superCall(this,"getDataParams",t),n=e.getSum("value");return i.percent=n?+(e.get("value",t)/n*100).toFixed(2):0,i.$vars.push("percent"),i},defaultOption:{zlevel:0,z:2,legendHoverLink:!0,left:80,top:60,right:80,bottom:60,minSize:"0%",maxSize:"100%",sort:"descending",gap:0,funnelAlign:"center",label:{normal:{show:!0,position:"outer"},emphasis:{show:!0}},labelLine:{normal:{show:!0,length:20,lineStyle:{width:1,type:"solid"}},emphasis:{}},itemStyle:{normal:{borderColor:"#fff",borderWidth:1},emphasis:{}}}});t.exports=r},function(t,e,i){function n(t,e){function i(){r.ignore=r.hoverIgnore,s.ignore=s.hoverIgnore}function n(){r.ignore=r.normalIgnore,s.ignore=s.normalIgnore}a.Group.call(this);var o=new a.Polygon,r=new a.Polyline,s=new a.Text;this.add(o),this.add(r),this.add(s),this.updateData(t,e,!0),this.on("emphasis",i).on("normal",n).on("mouseover",i).on("mouseout",n)}var a=i(3),o=i(1),r=n.prototype,s=["itemStyle","normal","opacity"];r.updateData=function(t,e,i){var n=this.childAt(0),r=t.hostModel,l=t.getItemModel(e),u=t.getItemLayout(e),h=t.getItemModel(e).get(s);h=null==h?1:h,n.useStyle({}),i?(n.setShape({points:u.points}),n.setStyle({opacity:0}),a.initProps(n,{style:{opacity:h}},r,e)):a.updateProps(n,{style:{opacity:h},shape:{points:u.points}},r,e);var c=l.getModel("itemStyle"),d=t.getItemVisual(e,"color");n.setStyle(o.defaults({lineJoin:"round",fill:d},c.getModel("normal").getItemStyle(["opacity"]))),n.hoverStyle=c.getModel("emphasis").getItemStyle(),this._updateLabel(t,e),a.setHoverStyle(this)},r._updateLabel=function(t,e){var i=this.childAt(1),n=this.childAt(2),o=t.hostModel,r=t.getItemModel(e),s=t.getItemLayout(e),l=s.label,u=t.getItemVisual(e,"color");a.updateProps(i,{shape:{points:l.linePoints||l.linePoints}},o,e),a.updateProps(n,{style:{x:l.x,y:l.y}},o,e),n.attr({rotation:l.rotation,origin:[l.x,l.y],z2:10});var h=r.getModel("label.normal"),c=r.getModel("label.emphasis"),d=r.getModel("labelLine.normal"),f=r.getModel("labelLine.emphasis"),u=t.getItemVisual(e,"color");a.setLabelStyle(n.style,n.hoverStyle={},h,c,{labelFetcher:t.hostModel,labelDataIndex:e,defaultText:t.getName(e),autoColor:u,useInsideStyle:!!l.inside},{textAlign:l.textAlign,textVerticalAlign:l.verticalAlign}),n.ignore=n.normalIgnore=!h.get("show"),n.hoverIgnore=!c.get("show"),i.ignore=i.normalIgnore=!d.get("show"),i.hoverIgnore=!f.get("show"),i.setStyle({stroke:u}),i.setStyle(d.getModel("lineStyle").getLineStyle()),i.hoverStyle=f.getModel("lineStyle").getLineStyle()},o.inherits(n,a.Group);var l=i(30).extend({type:"funnel",render:function(t,e,i){var a=t.getData(),o=this._data,r=this.group;a.diff(o).add(function(t){var e=new n(a,t);a.setItemGraphicEl(t,e),r.add(e)}).update(function(t,e){var i=o.getItemGraphicEl(e);i.updateData(a,t),r.add(i),a.setItemGraphicEl(t,i)}).remove(function(t){var e=o.getItemGraphicEl(t);r.remove(e)}).execute(),this._data=a},remove:function(){this.group.removeAll(),this._data=null},dispose:function(){}});t.exports=l},function(t,e,i){function n(t,e){return r.getLayoutRect(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()})}function a(t,e){for(var i=t.mapArray("value",function(t){return t}),n=[],a="ascending"===e,o=0,r=t.count();o<r;o++)n[o]=o;return"function"==typeof e?n.sort(e):"none"!==e&&n.sort(function(t,e){return a?i[t]-i[e]:i[e]-i[t]}),n}function o(t){t.each(function(e){var i,n,a,o,r=t.getItemModel(e),s=r.getModel("label.normal"),l=s.get("position"),u=r.getModel("labelLine.normal"),h=t.getItemLayout(e),c=h.points,d="inner"===l||"inside"===l||"center"===l;if(d)n=(c[0][0]+c[1][0]+c[2][0]+c[3][0])/4,a=(c[0][1]+c[1][1]+c[2][1]+c[3][1])/4,i="center",o=[[n,a],[n,a]];else{var f,p,g,m=u.get("length");"left"===l?(f=(c[3][0]+c[0][0])/2,p=(c[3][1]+c[0][1])/2,g=f-m,n=g-5,i="right"):(f=(c[1][0]+c[2][0])/2,p=(c[1][1]+c[2][1])/2,g=f+m,n=g+5,i="left");var v=p;o=[[f,p],[g,v]],a=v}h.label={linePoints:o,x:n,y:a,verticalAlign:"middle",textAlign:i,inside:d}})}var r=i(9),s=i(4),l=s.parsePercent;t.exports=function(t,e,i){t.eachSeriesByType("funnel",function(t){var i=t.getData(),r=t.get("sort"),u=n(t,e),h=a(i,r),c=[l(t.get("minSize"),u.width),l(t.get("maxSize"),u.width)],d=i.getDataExtent("value"),f=t.get("min"),p=t.get("max");null==f&&(f=Math.min(d[0],0)),null==p&&(p=d[1]);var g=t.get("funnelAlign"),m=t.get("gap"),v=(u.height-m*(i.count()-1))/i.count(),y=u.y,x=function(t,e){var n,a=i.get("value",t)||0,o=s.linearMap(a,[f,p],c,!0);switch(g){case"left":n=u.x;break;case"center":n=u.x+(u.width-o)/2;break;case"right":n=u.x+u.width-o}return[[n,e],[n+o,e]]};"ascending"===r&&(v=-v,m=-m,y+=u.height,h=h.reverse());for(var _=0;_<h.length;_++){var b=h[_],w=h[_+1],S=x(b,y),M=x(w,y+v);y+=v+m,i.setItemLayout(b,{points:S.concat(M.slice().reverse())})}o(i)})}},function(t,e,i){i(298),i(299)},function(t,e,i){var n=i(14),a=i(17),o=i(1),r=a.extend({type:"series.gauge",getInitialData:function(t,e){var i=new n(["value"],this),a=t.data||[];return o.isArray(a)||(a=[a]),i.initData(a),i},defaultOption:{zlevel:0,z:2,center:["50%","50%"],legendHoverLink:!0,radius:"75%",startAngle:225,endAngle:-45,clockwise:!0,min:0,max:100,splitNumber:10,axisLine:{show:!0,lineStyle:{color:[[.2,"#91c7ae"],[.8,"#63869e"],[1,"#c23531"]],width:30}},splitLine:{show:!0,length:30,lineStyle:{color:"#eee",width:2,type:"solid"}},axisTick:{show:!0,splitNumber:5,length:8,lineStyle:{color:"#eee",width:1,type:"solid"}},axisLabel:{show:!0,distance:5,color:"auto"},pointer:{show:!0,length:"80%",width:8},itemStyle:{normal:{color:"auto"}},title:{show:!0,offsetCenter:[0,"-40%"],color:"#333",fontSize:15},detail:{show:!0,backgroundColor:"rgba(0,0,0,0)",borderWidth:0,borderColor:"#ccc",width:100,height:null,padding:[5,10],offsetCenter:[0,"40%"],color:"auto",fontSize:30}}});t.exports=r},function(t,e,i){function n(t,e){var i=t.get("center"),n=e.getWidth(),a=e.getHeight(),o=Math.min(n,a),r=l(i[0],e.getWidth()),s=l(i[1],e.getHeight()),u=l(t.get("radius"),o/2);return{cx:r,cy:s,r:u}}function a(t,e){return e&&("string"==typeof e?t=e.replace("{value}",null!=t?t:""):"function"==typeof e&&(t=e(t))),t}var o=i(300),r=i(3),s=i(4),l=s.parsePercent,u=2*Math.PI,h=i(30).extend({type:"gauge",render:function(t,e,i){this.group.removeAll();var a=t.get("axisLine.lineStyle.color"),o=n(t,i);this._renderMain(t,e,i,a,o)},dispose:function(){},_renderMain:function(t,e,i,n,a){for(var o=this.group,s=t.getModel("axisLine"),l=s.getModel("lineStyle"),h=t.get("clockwise"),c=-t.get("startAngle")/180*Math.PI,d=-t.get("endAngle")/180*Math.PI,f=(d-c)%u,p=c,g=l.get("width"),m=0;m<n.length;m++){var v=Math.min(Math.max(n[m][0],0),1),d=c+f*v,y=new r.Sector({shape:{startAngle:p,endAngle:d,cx:a.cx,cy:a.cy,clockwise:h,r0:a.r-g,r:a.r},silent:!0});y.setStyle({fill:n[m][1]}),y.setStyle(l.getLineStyle(["color","borderWidth","borderColor"])),o.add(y),p=d}var x=function(t){if(t<=0)return n[0][1];for(var e=0;e<n.length;e++)if(n[e][0]>=t&&(0===e?0:n[e-1][0])<t)return n[e][1];return n[e-1][1]};if(!h){var _=c;c=d,d=_}this._renderTicks(t,e,i,x,a,c,d,h),this._renderPointer(t,e,i,x,a,c,d,h),this._renderTitle(t,e,i,x,a),this._renderDetail(t,e,i,x,a)},_renderTicks:function(t,e,i,n,o,u,h,c){for(var d=this.group,f=o.cx,p=o.cy,g=o.r,m=+t.get("min"),v=+t.get("max"),y=t.getModel("splitLine"),x=t.getModel("axisTick"),_=t.getModel("axisLabel"),b=t.get("splitNumber"),w=x.get("splitNumber"),S=l(y.get("length"),g),M=l(x.get("length"),g),I=u,T=(h-u)/b,A=T/w,C=y.getModel("lineStyle").getLineStyle(),L=x.getModel("lineStyle").getLineStyle(),D=0;D<=b;D++){var P=Math.cos(I),k=Math.sin(I);if(y.get("show")){var O=new r.Line({shape:{x1:P*g+f,y1:k*g+p,x2:P*(g-S)+f,y2:k*(g-S)+p},style:C,silent:!0});"auto"===C.stroke&&O.setStyle({stroke:n(D/b)}),d.add(O)}if(_.get("show")){var z=a(s.round(D/b*(v-m)+m),_.get("formatter")),E=_.get("distance"),R=n(D/b);d.add(new r.Text({style:r.setTextStyle({},_,{text:z,x:P*(g-S-E)+f,y:k*(g-S-E)+p,textVerticalAlign:k<-.4?"top":k>.4?"bottom":"middle",textAlign:P<-.4?"left":P>.4?"right":"center"},{autoColor:R}),silent:!0}))}if(x.get("show")&&D!==b){for(var N=0;N<=w;N++){var P=Math.cos(I),k=Math.sin(I),V=new r.Line({
shape:{x1:P*g+f,y1:k*g+p,x2:P*(g-M)+f,y2:k*(g-M)+p},silent:!0,style:L});"auto"===L.stroke&&V.setStyle({stroke:n((D+N/w)/b)}),d.add(V),I+=A}I-=A}else I+=T}},_renderPointer:function(t,e,i,n,a,u,h,c){var d=this.group,f=this._data;if(!t.get("pointer.show"))return void(f&&f.eachItemGraphicEl(function(t){d.remove(t)}));var p=[+t.get("min"),+t.get("max")],g=[u,h],m=t.getData();m.diff(f).add(function(e){var i=new o({shape:{angle:u}});r.initProps(i,{shape:{angle:s.linearMap(m.get("value",e),p,g,!0)}},t),d.add(i),m.setItemGraphicEl(e,i)}).update(function(e,i){var n=f.getItemGraphicEl(i);r.updateProps(n,{shape:{angle:s.linearMap(m.get("value",e),p,g,!0)}},t),d.add(n),m.setItemGraphicEl(e,n)}).remove(function(t){var e=f.getItemGraphicEl(t);d.remove(e)}).execute(),m.eachItemGraphicEl(function(t,e){var i=m.getItemModel(e),o=i.getModel("pointer");t.setShape({x:a.cx,y:a.cy,width:l(o.get("width"),a.r),r:l(o.get("length"),a.r)}),t.useStyle(i.getModel("itemStyle.normal").getItemStyle()),"auto"===t.style.fill&&t.setStyle("fill",n(s.linearMap(m.get("value",e),p,[0,1],!0))),r.setHoverStyle(t,i.getModel("itemStyle.emphasis").getItemStyle())}),this._data=m},_renderTitle:function(t,e,i,n,a){var o=t.getModel("title");if(o.get("show")){var u=o.get("offsetCenter"),h=a.cx+l(u[0],a.r),c=a.cy+l(u[1],a.r),d=+t.get("min"),f=+t.get("max"),p=t.getData().get("value",0),g=n(s.linearMap(p,[d,f],[0,1],!0));this.group.add(new r.Text({silent:!0,style:r.setTextStyle({},o,{x:h,y:c,text:t.getData().getName(0),textAlign:"center",textVerticalAlign:"middle"},{autoColor:g,forceRich:!0})}))}},_renderDetail:function(t,e,i,n,o){var u=t.getModel("detail"),h=+t.get("min"),c=+t.get("max");if(u.get("show")){var d=u.get("offsetCenter"),f=o.cx+l(d[0],o.r),p=o.cy+l(d[1],o.r),g=l(u.get("width"),o.r),m=l(u.get("height"),o.r),v=t.getData().get("value",0),y=n(s.linearMap(v,[h,c],[0,1],!0));this.group.add(new r.Text({silent:!0,style:r.setTextStyle({},u,{x:f,y:p,text:a(v,u.get("formatter")),textWidth:isNaN(g)?null:g,textHeight:isNaN(m)?null:m,textAlign:"center",textVerticalAlign:"middle"},{autoColor:y,forceRich:!0})}))}}});t.exports=h},function(t,e,i){t.exports=i(8).extend({type:"echartsGaugePointer",shape:{angle:0,width:10,r:10,x:0,y:0},buildPath:function(t,e){var i=Math.cos,n=Math.sin,a=e.r,o=e.width,r=e.angle,s=e.x-i(r)*o*(o>=a/3?1:2),l=e.y-n(r)*o*(o>=a/3?1:2);r=e.angle-Math.PI/2,t.moveTo(s,l),t.lineTo(e.x+i(r)*o,e.y+n(r)*o),t.lineTo(e.x+i(e.angle)*a,e.y+n(e.angle)*a),t.lineTo(e.x-i(r)*o,e.y-n(r)*o),t.lineTo(s,l)}})},function(t,e,i){var n=i(2),a=i(1);i(302),i(303),i(312),n.registerProcessor(i(305)),n.registerVisual(a.curry(i(51),"graph","circle",null)),n.registerVisual(i(306)),n.registerVisual(i(309)),n.registerLayout(i(313)),n.registerLayout(i(307)),n.registerLayout(i(311)),n.registerCoordinateSystem("graphView",{create:i(308)})},function(t,e,i){"use strict";var n=i(14),a=i(1),o=i(5),r=i(11),s=i(7),l=i(255),u=i(2).extendSeriesModel({type:"series.graph",init:function(t){u.superApply(this,"init",arguments),this.legendDataProvider=function(){return this._categoriesData},this.fillDataTextStyle(t.edges||t.links),this._updateCategoriesData()},mergeOption:function(t){u.superApply(this,"mergeOption",arguments),this.fillDataTextStyle(t.edges||t.links),this._updateCategoriesData()},mergeDefaultAndTheme:function(t){u.superApply(this,"mergeDefaultAndTheme",arguments),o.defaultEmphasis(t.edgeLabel,["show"])},getInitialData:function(t,e){function i(t,i){function n(t){return t=this.parsePath(t),t&&"label"===t[0]?s:this.parentModel}t.wrapMethod("getItemModel",function(t){var e=o._categoriesModels,i=t.getShallow("category"),n=e[i];return n&&(n.parentModel=t.parentModel,t.parentModel=n),t});var a=o.getModel("edgeLabel"),s=new r({label:a.option},a.parentModel,e);i.wrapMethod("getItemModel",function(t){return t.customizeGetParent(n),t})}var n=t.edges||t.links||[],a=t.data||t.nodes||[],o=this;if(a&&n)return l(a,n,this,!0,i).data},getGraph:function(){return this.getData().graph},getEdgeData:function(){return this.getGraph().edgeData},getCategoriesData:function(){return this._categoriesData},formatTooltip:function(t,e,i){if("edge"===i){var n=this.getData(),a=this.getDataParams(t,i),o=n.graph.getEdgeByIndex(t),r=n.getName(o.node1.dataIndex),l=n.getName(o.node2.dataIndex),h=[];return null!=r&&h.push(r),null!=l&&h.push(l),h=s.encodeHTML(h.join(" > ")),a.value&&(h+=" : "+s.encodeHTML(a.value)),h}return u.superApply(this,"formatTooltip",arguments)},_updateCategoriesData:function(){var t=a.map(this.option.categories||[],function(t){return null!=t.value?t:a.extend({value:0},t)}),e=new n(["value"],this);e.initData(t),this._categoriesData=e,this._categoriesModels=e.mapArray(function(t){return e.getItemModel(t,!0)})},setZoom:function(t){this.option.zoom=t},setCenter:function(t){this.option.center=t},isAnimationEnabled:function(){return u.superCall(this,"isAnimationEnabled")&&!("force"===this.get("layout")&&this.get("force.layoutAnimation"))},defaultOption:{zlevel:0,z:2,coordinateSystem:"view",legendHoverLink:!0,hoverAnimation:!0,layout:null,focusNodeAdjacency:!1,circular:{rotateLabel:!1},force:{initLayout:null,repulsion:[0,50],gravity:.1,edgeLength:30,layoutAnimation:!0},left:"center",top:"center",symbol:"circle",symbolSize:10,edgeSymbol:["none","none"],edgeSymbolSize:10,edgeLabel:{normal:{position:"middle"},emphasis:{}},draggable:!1,roam:!1,center:null,zoom:1,nodeScaleRatio:.6,label:{normal:{show:!1,formatter:"{b}"},emphasis:{show:!0}},itemStyle:{normal:{},emphasis:{}},lineStyle:{normal:{color:"#aaa",width:1,curveness:0,opacity:.5},emphasis:{}}}});t.exports=u},function(t,e,i){function n(t,e){return t.getVisual("opacity")||t.getModel().get(e)}function a(t,e,i){var a=t.getGraphicEl(),o=n(t,e);null!=i&&(null==o&&(o=1),o*=i),a.downplay&&a.downplay(),a.traverse(function(t){"group"!==t.type&&t.setStyle("opacity",o)})}function o(t,e){var i=n(t,e),a=t.getGraphicEl();a.highlight&&a.highlight(),a.traverse(function(t){"group"!==t.type&&t.setStyle("opacity",i)})}var r=i(46),s=i(112),l=i(100),u=i(258),h=i(133),c=i(3),d=i(304),f=i(1),p=["itemStyle","normal","opacity"],g=["lineStyle","normal","opacity"];i(2).extendChartView({type:"graph",init:function(t,e){var i=new r,n=new s,a=this.group;this._controller=new l(e.getZr()),this._controllerHost={target:a},a.add(i.group),a.add(n.group),this._symbolDraw=i,this._lineDraw=n,this._firstRender=!0},render:function(t,e,i){var n=t.coordinateSystem;this._model=t,this._nodeScaleRatio=t.get("nodeScaleRatio");var a=this._symbolDraw,o=this._lineDraw,r=this.group;if("view"===n.type){var s={position:n.position,scale:n.scale};this._firstRender?r.attr(s):c.updateProps(r,s,t)}d(t.getGraph(),this._getNodeGlobalScale(t));var l=t.getData();a.updateData(l);var u=t.getEdgeData();o.updateData(u),this._updateNodeAndLinkScale(),this._updateController(t,e,i),clearTimeout(this._layoutTimeout);var h=t.forceLayout,f=t.get("force.layoutAnimation");h&&this._startForceLayoutIteration(h,f),l.eachItemGraphicEl(function(e,n){var a=l.getItemModel(n);e.off("drag").off("dragend");var o=l.getItemModel(n).get("draggable");o&&e.on("drag",function(){h&&(h.warmUp(),!this._layouting&&this._startForceLayoutIteration(h,f),h.setFixed(n),l.setItemLayout(n,e.position))},this).on("dragend",function(){h&&h.setUnfixed(n)},this),e.setDraggable(o&&h),e.off("mouseover",e.__focusNodeAdjacency),e.off("mouseout",e.__unfocusNodeAdjacency),a.get("focusNodeAdjacency")&&(e.on("mouseover",e.__focusNodeAdjacency=function(){i.dispatchAction({type:"focusNodeAdjacency",seriesId:t.id,dataIndex:e.dataIndex})}),e.on("mouseout",e.__unfocusNodeAdjacency=function(){i.dispatchAction({type:"unfocusNodeAdjacency",seriesId:t.id})}))},this);var p="circular"===t.get("layout")&&t.get("circular.rotateLabel"),g=l.getLayout("cx"),m=l.getLayout("cy");l.eachItemGraphicEl(function(t,e){var i=t.getSymbolPath();if(p){var n=l.getItemLayout(e),a=Math.atan2(n[1]-m,n[0]-g);a<0&&(a=2*Math.PI+a);var o=n[0]<g;o&&(a-=Math.PI);var r=o?"left":"right";i.setStyle({textRotation:-a,textPosition:r,textOrigin:"center"}),i.hoverStyle&&(i.hoverStyle.textPosition=r)}else i.setStyle({textRotation:0})}),this._firstRender=!1},dispose:function(){this._controller&&this._controller.dispose(),this._controllerHost={}},focusNodeAdjacency:function(t,e,i,n){var r=this._model.getData(),s=n.dataIndex,l=r.getItemGraphicEl(s);if(l){var u=r.graph,h=l.dataType;if(null!==s&&"edge"!==h){u.eachNode(function(t){a(t,p,.1)}),u.eachEdge(function(t){a(t,g,.1)});var c=u.getNodeByIndex(s);o(c,p),f.each(c.edges,function(t){t.dataIndex<0||(o(t,g),o(t.node1,p),o(t.node2,p))})}}},unfocusNodeAdjacency:function(t,e,i,n){var o=this._model.getData().graph;o.eachNode(function(t){a(t,p)}),o.eachEdge(function(t){a(t,g)})},_startForceLayoutIteration:function(t,e){var i=this;!function n(){t.step(function(t){i.updateLayout(i._model),(i._layouting=!t)&&(e?i._layoutTimeout=setTimeout(n,16):n())})}()},_updateController:function(t,e,i){var n=this._controller,a=this._controllerHost,o=this.group;return n.setPointerChecker(function(e,n,a){var r=o.getBoundingRect();return r.applyTransform(o.transform),r.contain(n,a)&&!h.onIrrelevantElement(e,i,t)}),"view"!==t.coordinateSystem.type?void n.disable():(n.enable(t.get("roam")),a.zoomLimit=t.get("scaleLimit"),a.zoom=t.coordinateSystem.getZoom(),void n.off("pan").off("zoom").on("pan",function(e,n){u.updateViewOnPan(a,e,n),i.dispatchAction({seriesId:t.id,type:"graphRoam",dx:e,dy:n})}).on("zoom",function(e,n,o){u.updateViewOnZoom(a,e,n,o),i.dispatchAction({seriesId:t.id,type:"graphRoam",zoom:e,originX:n,originY:o}),this._updateNodeAndLinkScale(),d(t.getGraph(),this._getNodeGlobalScale(t)),this._lineDraw.updateLayout()},this))},_updateNodeAndLinkScale:function(){var t=this._model,e=t.getData(),i=this._getNodeGlobalScale(t),n=[i,i];e.eachItemGraphicEl(function(t,e){t.attr("scale",n)})},_getNodeGlobalScale:function(t){var e=t.coordinateSystem;if("view"!==e.type)return 1;var i=this._nodeScaleRatio,n=e.scale,a=n&&n[0]||1,o=e.getZoom(),r=(o-1)*i+1;return r/a},updateLayout:function(t){d(t.getGraph(),this._getNodeGlobalScale(t)),this._symbolDraw.updateLayout(),this._lineDraw.updateLayout()},remove:function(t,e){this._symbolDraw&&this._symbolDraw.remove(),this._lineDraw&&this._lineDraw.remove()}})},function(t,e,i){function n(t,e,i){for(var n,a=t[0],o=t[1],d=t[2],f=1/0,p=i*i,g=.1,m=.1;m<=.9;m+=.1){r[0]=u(a[0],o[0],d[0],m),r[1]=u(a[1],o[1],d[1],m);var v=c(h(r,e)-p);v<f&&(f=v,n=m)}for(var y=0;y<32;y++){var x=n+g;s[0]=u(a[0],o[0],d[0],n),s[1]=u(a[1],o[1],d[1],n),l[0]=u(a[0],o[0],d[0],x),l[1]=u(a[1],o[1],d[1],x);var v=h(s,e)-p;if(c(v)<.01)break;var _=h(l,e)-p;g/=2,v<0?_>=0?n+=g:n-=g:_>=0?n-=g:n+=g}return n}var a=i(20),o=i(6),r=[],s=[],l=[],u=a.quadraticAt,h=o.distSquare,c=Math.abs;t.exports=function(t,e){function i(t){var e=t.getVisual("symbolSize");return e instanceof Array&&(e=(e[0]+e[1])/2),e}var r=[],s=a.quadraticSubdivide,l=[[],[],[]],u=[[],[]],h=[];e/=2,t.eachEdge(function(t,a){var c=t.getLayout(),d=t.getVisual("fromSymbol"),f=t.getVisual("toSymbol");c.__original||(c.__original=[o.clone(c[0]),o.clone(c[1])],c[2]&&c.__original.push(o.clone(c[2])));var p=c.__original;if(null!=c[2]){if(o.copy(l[0],p[0]),o.copy(l[1],p[2]),o.copy(l[2],p[1]),d&&"none"!=d){var g=i(t.node1),m=n(l,p[0],g*e);s(l[0][0],l[1][0],l[2][0],m,r),l[0][0]=r[3],l[1][0]=r[4],s(l[0][1],l[1][1],l[2][1],m,r),l[0][1]=r[3],l[1][1]=r[4]}if(f&&"none"!=f){var g=i(t.node2),m=n(l,p[1],g*e);s(l[0][0],l[1][0],l[2][0],m,r),l[1][0]=r[1],l[2][0]=r[2],s(l[0][1],l[1][1],l[2][1],m,r),l[1][1]=r[1],l[2][1]=r[2]}o.copy(c[0],l[0]),o.copy(c[1],l[2]),o.copy(c[2],l[1])}else{if(o.copy(u[0],p[0]),o.copy(u[1],p[1]),o.sub(h,u[1],u[0]),o.normalize(h,h),d&&"none"!=d){var g=i(t.node1);o.scaleAndAdd(u[0],u[0],h,g*e)}if(f&&"none"!=f){var g=i(t.node2);o.scaleAndAdd(u[1],u[1],h,-g*e)}o.copy(c[0],u[0]),o.copy(c[1],u[1])}})}},function(t,e){t.exports=function(t){var e=t.findComponents({mainType:"legend"});e&&e.length&&t.eachSeriesByType("graph",function(t){var i=t.getCategoriesData(),n=t.getGraph(),a=n.data,o=i.mapArray(i.getName);a.filterSelf(function(t){var i=a.getItemModel(t),n=i.getShallow("category");if(null!=n){"number"==typeof n&&(n=o[n]);for(var r=0;r<e.length;r++)if(!e[r].isSelected(n))return!1}return!0})},this)}},function(t,e){t.exports=function(t){var e={};t.eachSeriesByType("graph",function(t){var i=t.getCategoriesData(),n=t.getData(),a={};i.each(function(n){var o=i.getName(n);a["ec-"+o]=n;var r=i.getItemModel(n),s=r.get("itemStyle.normal.color")||t.getColorFromPalette(o,e);i.setItemVisual(n,"color",s)}),i.count()&&n.each(function(t){var e=n.getItemModel(t),o=e.getShallow("category");null!=o&&("string"==typeof o&&(o=a["ec-"+o]),n.getItemVisual(t,"color",!0)||n.setItemVisual(t,"color",i.getItemVisual(o,"color")))})})}},function(t,e,i){var n=i(250);t.exports=function(t){t.eachSeriesByType("graph",function(t){"circular"===t.get("layout")&&n(t)})}},function(t,e,i){function n(t,e,i){var n=t.getBoxLayoutParams();return n.aspect=i,o.getLayoutRect(n,{width:e.getWidth(),height:e.getHeight()})}var a=i(268),o=i(9),r=i(90);t.exports=function(t,e){var i=[];return t.eachSeriesByType("graph",function(t){var o=t.get("coordinateSystem");if(!o||"view"===o){var s=t.getData(),l=s.mapArray(function(t){var e=s.getItemModel(t);return[+e.get("x"),+e.get("y")]}),u=[],h=[];r.fromPoints(l,u,h),h[0]-u[0]===0&&(h[0]+=1,u[0]-=1),h[1]-u[1]===0&&(h[1]+=1,u[1]-=1);var c=(h[0]-u[0])/(h[1]-u[1]),d=n(t,e,c);isNaN(c)&&(u=[d.x,d.y],h=[d.x+d.width,d.y+d.height]);var f=h[0]-u[0],p=h[1]-u[1],g=d.width,m=d.height,v=t.coordinateSystem=new a;v.zoomLimit=t.get("scaleLimit"),v.setBoundingRect(u[0],u[1],f,p),v.setViewRect(d.x,d.y,g,m),v.setCenter(t.get("center")),v.setZoom(t.get("zoom")),i.push(v)}}),i}},function(t,e){function i(t){return t instanceof Array||(t=[t,t]),t}t.exports=function(t){t.eachSeriesByType("graph",function(t){var e=t.getGraph(),n=t.getEdgeData(),a=i(t.get("edgeSymbol")),o=i(t.get("edgeSymbolSize")),r="lineStyle.normal.color".split("."),s="lineStyle.normal.opacity".split(".");n.setVisual("fromSymbol",a&&a[0]),n.setVisual("toSymbol",a&&a[1]),n.setVisual("fromSymbolSize",o&&o[0]),n.setVisual("toSymbolSize",o&&o[1]),n.setVisual("color",t.get(r)),n.setVisual("opacity",t.get(s)),n.each(function(t){var a=n.getItemModel(t),o=e.getEdgeByIndex(t),l=i(a.getShallow("symbol",!0)),u=i(a.getShallow("symbolSize",!0)),h=a.get(r),c=a.get(s);switch(h){case"source":h=o.node1.getVisual("color");break;case"target":h=o.node2.getVisual("color")}l[0]&&o.setVisual("fromSymbol",l[0]),l[1]&&o.setVisual("toSymbol",l[1]),u[0]&&o.setVisual("fromSymbolSize",u[0]),u[1]&&o.setVisual("toSymbolSize",u[1]),o.setVisual("color",h),o.setVisual("opacity",c)})})}},function(t,e,i){var n=i(6),a=n.scaleAndAdd;t.exports=function(t,e,i){for(var o=i.rect,r=o.width,s=o.height,l=[o.x+r/2,o.y+s/2],u=null==i.gravity?.1:i.gravity,h=0;h<t.length;h++){var c=t[h];c.p||(c.p=n.create(r*(Math.random()-.5)+l[0],s*(Math.random()-.5)+l[1])),c.pp=n.clone(c.p),c.edges=null}var d=.6;return{warmUp:function(){d=.5},setFixed:function(e){t[e].fixed=!0},setUnfixed:function(e){t[e].fixed=!1},step:function(i){for(var o=[],r=t.length,s=0;s<e.length;s++){var h=e[s],c=h.n1,f=h.n2;n.sub(o,f.p,c.p);var p=n.len(o)-h.d,g=f.w/(c.w+f.w);n.normalize(o,o),!c.fixed&&a(c.p,c.p,o,g*p*d),!f.fixed&&a(f.p,f.p,o,-(1-g)*p*d)}for(var s=0;s<r;s++){var m=t[s];m.fixed||(n.sub(o,l,m.p),n.scaleAndAdd(m.p,m.p,o,u*d))}for(var s=0;s<r;s++)for(var c=t[s],v=s+1;v<r;v++){var f=t[v];n.sub(o,f.p,c.p);var p=n.len(o);0===p&&(n.set(o,Math.random()-.5,Math.random()-.5),p=1);var y=(c.rep+f.rep)/p/p;!c.fixed&&a(c.pp,c.pp,o,y),!f.fixed&&a(f.pp,f.pp,o,-y)}for(var x=[],s=0;s<r;s++){var m=t[s];m.fixed||(n.sub(x,m.p,m.pp),n.scaleAndAdd(m.p,m.p,x,d),n.copy(m.pp,m.p))}d*=.992,i&&i(t,e,d<.01)}}}},function(t,e,i){var n=i(310),a=i(4),o=i(252),r=i(250),s=i(6),l=i(1);t.exports=function(t){t.eachSeriesByType("graph",function(t){var e=t.coordinateSystem;if(!e||"view"===e.type)if("force"===t.get("layout")){var i=t.preservedPoints||{},u=t.getGraph(),h=u.data,c=u.edgeData,d=t.getModel("force"),f=d.get("initLayout");t.preservedPoints?h.each(function(t){var e=h.getId(t);h.setItemLayout(t,i[e]||[NaN,NaN])}):f&&"none"!==f?"circular"===f&&r(t):o(t);var p=h.getDataExtent("value"),g=c.getDataExtent("value"),m=d.get("repulsion"),v=d.get("edgeLength");l.isArray(m)||(m=[m,m]),l.isArray(v)||(v=[v,v]),v=[v[1],v[0]];var y=h.mapArray("value",function(t,e){var i=h.getItemLayout(e),n=a.linearMap(t,p,m);return isNaN(n)&&(n=(m[0]+m[1])/2),{w:n,rep:n,fixed:h.getItemModel(e).get("fixed"),p:!i||isNaN(i[0])||isNaN(i[1])?null:i}}),x=c.mapArray("value",function(t,e){var i=u.getEdgeByIndex(e),n=a.linearMap(t,g,v);return isNaN(n)&&(n=(v[0]+v[1])/2),{n1:y[i.node1.dataIndex],n2:y[i.node2.dataIndex],d:n,curveness:i.getModel().get("lineStyle.normal.curveness")||0}}),e=t.coordinateSystem,_=e.getBoundingRect(),b=n(y,x,{rect:_,gravity:d.get("gravity")}),w=b.step;b.step=function(t){for(var e=0,n=y.length;e<n;e++)y[e].fixed&&s.copy(y[e].p,u.getNodeByIndex(e).getLayout());w(function(e,n,a){for(var o=0,r=e.length;o<r;o++)e[o].fixed||u.getNodeByIndex(o).setLayout(e[o].p),i[h.getId(o)]=e[o].p;for(var o=0,r=n.length;o<r;o++){var l=n[o],c=u.getEdgeByIndex(o),d=l.n1.p,f=l.n2.p,p=c.getLayout();p=p?p.slice():[],p[0]=p[0]||[],p[1]=p[1]||[],s.copy(p[0],d),s.copy(p[1],f),+l.curveness&&(p[2]=[(d[0]+f[0])/2-(d[1]-f[1])*l.curveness,(d[1]+f[1])/2-(f[0]-d[0])*l.curveness]),c.setLayout(p)}t&&t(a)})},t.forceLayout=b,t.preservedPoints=i,b.step()}else t.forceLayout=null})}},function(t,e,i){var n=i(2),a=i(249),o={type:"graphRoam",event:"graphRoam",update:"none"};n.registerAction(o,function(t,e){e.eachComponent({mainType:"series",query:t},function(e){var i=e.coordinateSystem,n=a.updateCenterAndZoom(i,t);e.setCenter&&e.setCenter(n.center),e.setZoom&&e.setZoom(n.zoom)})}),n.registerAction({type:"focusNodeAdjacency",event:"focusNodeAdjacency",update:"series.graph:focusNodeAdjacency"},function(){}),n.registerAction({type:"unfocusNodeAdjacency",event:"unfocusNodeAdjacency",update:"series.graph:unfocusNodeAdjacency"},function(){})},function(t,e,i){var n=i(252),a=i(251);t.exports=function(t,e){t.eachSeriesByType("graph",function(t){var e=t.get("layout"),i=t.coordinateSystem;if(i&&"view"!==i.type){var o=t.getData(),r=i.dimensions;o.each(r,function(){for(var t,e=arguments,n=[],a=0;a<r.length;a++)isNaN(e[a])||(t=!0),n.push(e[a]);var s=e[e.length-1];t?o.setItemLayout(s,i.dataToPoint(n)):o.setItemLayout(s,[NaN,NaN])}),a(o.graph)}else e&&"none"!==e||n(t)})}},function(t,e,i){i(316),i(317)},function(t,e,i){function n(){var t=o.createCanvas();this.canvas=t,this.blurSize=30,this.pointSize=20,this.maxOpacity=1,this.minOpacity=0,this._gradientPixels={}}var a=256,o=i(1);n.prototype={update:function(t,e,i,n,o,r){var s=this._getBrush(),l=this._getGradient(t,o,"inRange"),u=this._getGradient(t,o,"outOfRange"),h=this.pointSize+this.blurSize,c=this.canvas,d=c.getContext("2d"),f=t.length;c.width=e,c.height=i;for(var p=0;p<f;++p){var g=t[p],m=g[0],v=g[1],y=g[2],x=n(y);d.globalAlpha=x,d.drawImage(s,m-h,v-h)}if(!c.width||!c.height)return c;for(var _=d.getImageData(0,0,c.width,c.height),b=_.data,w=0,S=b.length,M=this.minOpacity,I=this.maxOpacity,T=I-M;w<S;){var x=b[w+3]/256,A=4*Math.floor(x*(a-1));if(x>0){var C=r(x)?l:u;x>0&&(x=x*T+M),b[w++]=C[A],b[w++]=C[A+1],b[w++]=C[A+2],b[w++]=C[A+3]*x*256}else w+=4}return d.putImageData(_,0,0),c},_getBrush:function(){var t=this._brushCanvas||(this._brushCanvas=o.createCanvas()),e=this.pointSize+this.blurSize,i=2*e;t.width=i,t.height=i;var n=t.getContext("2d");return n.clearRect(0,0,i,i),n.shadowOffsetX=i,n.shadowBlur=this.blurSize,n.shadowColor="#000",n.beginPath(),n.arc(-e,e,this.pointSize,0,2*Math.PI,!0),n.closePath(),n.fill(),t},_getGradient:function(t,e,i){for(var n=this._gradientPixels,a=n[i]||(n[i]=new Uint8ClampedArray(1024)),o=[0,0,0,0],r=0,s=0;s<256;s++)e[i](s/255,!0,o),a[r++]=o[0],a[r++]=o[1],a[r++]=o[2],a[r++]=o[3];return a}},t.exports=n},function(t,e,i){var n=i(17),a=i(28);t.exports=n.extend({type:"series.heatmap",getInitialData:function(t,e){return a(t.data,this,e)},defaultOption:{coordinateSystem:"cartesian2d",zlevel:0,z:2,geoIndex:0,blurSize:30,pointSize:20,maxOpacity:1,minOpacity:0}})},function(t,e,i){function n(t,e,i){var n=t[1]-t[0];e=l.map(e,function(e){return{interval:[(e.interval[0]-t[0])/n,(e.interval[1]-t[0])/n]}});var a=e.length,o=0;return function(t){for(var n=o;n<a;n++){var r=e[n].interval;if(r[0]<=t&&t<=r[1]){o=n;break}}if(n===a)for(var n=o-1;n>=0;n--){var r=e[n].interval;if(r[0]<=t&&t<=r[1]){o=n;break}}return n>=0&&n<a&&i[n]}}function a(t,e){var i=t[1]-t[0];return e=[(e[0]-t[0])/i,(e[1]-t[0])/i],function(t){return t>=e[0]&&t<=e[1]}}function o(t){var e=t.dimensions;return"lng"===e[0]&&"lat"===e[1]}var r=i(3),s=i(315),l=i(1);t.exports=i(2).extendChartView({type:"heatmap",render:function(t,e,i){var n;e.eachComponent("visualMap",function(e){e.eachTargetSeries(function(i){i===t&&(n=e)})}),this.group.removeAll();var a=t.coordinateSystem;"cartesian2d"===a.type||"calendar"===a.type?this._renderOnCartesianAndCalendar(a,t,i):o(a)&&this._renderOnGeo(a,t,n,i)},dispose:function(){},_renderOnCartesianAndCalendar:function(t,e,i){if("cartesian2d"===t.type)var n=t.getAxis("x"),a=t.getAxis("y"),o=n.getBandWidth(),s=a.getBandWidth();var u=this.group,h=e.getData(),c="itemStyle.normal",d="itemStyle.emphasis",f="label.normal",p="label.emphasis",g=e.getModel(c).getItemStyle(["color"]),m=e.getModel(d).getItemStyle(),v=e.getModel("label.normal"),y=e.getModel("label.emphasis"),x=t.type,_="cartesian2d"===x?[e.coordDimToDataDim("x")[0],e.coordDimToDataDim("y")[0],e.coordDimToDataDim("value")[0]]:[e.coordDimToDataDim("time")[0],e.coordDimToDataDim("value")[0]];h.each(function(i){var n;if("cartesian2d"===x){if(isNaN(h.get(_[2],i)))return;var a=t.dataToPoint([h.get(_[0],i),h.get(_[1],i)]);n=new r.Rect({shape:{x:a[0]-o/2,y:a[1]-s/2,width:o,height:s},style:{fill:h.getItemVisual(i,"color"),opacity:h.getItemVisual(i,"opacity")}})}else{if(isNaN(h.get(_[1],i)))return;n=new r.Rect({z2:1,shape:t.dataToRect([h.get(_[0],i)]).contentShape,style:{fill:h.getItemVisual(i,"color"),opacity:h.getItemVisual(i,"opacity")}})}var b=h.getItemModel(i);h.hasItemOption&&(g=b.getModel(c).getItemStyle(["color"]),m=b.getModel(d).getItemStyle(),v=b.getModel(f),y=b.getModel(p));var w=e.getRawValue(i),S="-";w&&null!=w[2]&&(S=w[2]),r.setLabelStyle(g,m,v,y,{labelFetcher:e,labelDataIndex:i,defaultText:S,isRectText:!0}),n.setStyle(g),r.setHoverStyle(n,h.hasItemOption?m:l.extend({},m)),u.add(n),h.setItemGraphicEl(i,n)})},_renderOnGeo:function(t,e,i,o){var l=i.targetVisuals.inRange,u=i.targetVisuals.outOfRange,h=e.getData(),c=this._hmLayer||this._hmLayer||new s;c.blurSize=e.get("blurSize"),c.pointSize=e.get("pointSize"),c.minOpacity=e.get("minOpacity"),c.maxOpacity=e.get("maxOpacity");var d=t.getViewRect().clone(),f=t.getRoamTransform().transform;d.applyTransform(f);var p=Math.max(d.x,0),g=Math.max(d.y,0),m=Math.min(d.width+d.x,o.getWidth()),v=Math.min(d.height+d.y,o.getHeight()),y=m-p,x=v-g,_=h.mapArray(["lng","lat","value"],function(e,i,n){var a=t.dataToPoint([e,i]);return a[0]-=p,a[1]-=g,a.push(n),a}),b=i.getExtent(),w="visualMap.continuous"===i.type?a(b,i.option.range):n(b,i.getPieceList(),i.option.selected);c.update(_,y,x,l.color.getNormalizer(),{inRange:l.color.getColorMapper(),outOfRange:u.color.getColorMapper()},w);var S=new r.Image({style:{width:y,height:x,x:p,y:g,image:c.canvas},silent:!0});this.group.add(S)}})},function(t,e,i){function n(t,e,i){r.call(this,t,e,i),this._lastFrame=0,this._lastFramePercent=0}var a=i(254),o=i(1),r=i(253),s=i(6),l=n.prototype;l.createLine=function(t,e,i){return new a(t,e,i)},l.updateAnimationPoints=function(t,e){this._points=e;for(var i=[0],n=0,a=1;a<e.length;a++){var o=e[a-1],r=e[a];n+=s.dist(o,r),i.push(n)}if(0!==n){for(var a=0;a<i.length;a++)i[a]/=n;this._offsets=i,this._length=n}},l.getLineLength=function(t){return this._length},l.updateSymbolPosition=function(t){var e=t.__t,i=this._points,n=this._offsets,a=i.length;if(n){var o,r=this._lastFrame;if(e<this._lastFramePercent){var l=Math.min(r+1,a-1);for(o=l;o>=0&&!(n[o]<=e);o--);o=Math.min(o,a-2)}else{for(var o=r;o<a&&!(n[o]>e);o++);o=Math.min(o-1,a-2)}s.lerp(t.position,i[o],i[o+1],(e-n[o])/(n[o+1]-n[o]));var u=i[o+1][0]-i[o][0],h=i[o+1][1]-i[o][1];t.rotation=-Math.atan2(h,u)-Math.PI/2,this._lastFrame=o,this._lastFramePercent=e,t.ignore=!1}},o.inherits(n,r),t.exports=n},function(t,e,i){function n(t){return r.isArray(t)||(t=[+t,+t]),t}function a(t,e){t.eachChild(function(t){t.attr({z:e.z,zlevel:e.zlevel,style:{stroke:"stroke"===e.brushType?e.color:null,fill:"fill"===e.brushType?e.color:null}})})}function o(t,e){c.call(this);var i=new h(t,e),n=new c;this.add(i),this.add(n),n.beforeUpdate=function(){this.attr(i.getScale())},this.updateData(t,e)}var r=i(1),s=i(24),l=i(3),u=i(4),h=i(57),c=l.Group,d=3,f=o.prototype;f.stopEffectAnimation=function(){this.childAt(1).removeAll()},f.startEffectAnimation=function(t){for(var e=t.symbolType,i=t.color,n=this.childAt(1),o=0;o<d;o++){var r=s.createSymbol(e,-1,-1,2,2,i);r.attr({style:{strokeNoScale:!0},z2:99,silent:!0,scale:[.5,.5]});var l=-o/d*t.period+t.effectOffset;r.animate("",!0).when(t.period,{scale:[t.rippleScale/2,t.rippleScale/2]}).delay(l).start(),r.animateStyle(!0).when(t.period,{opacity:0}).delay(l).start(),n.add(r)}a(n,t)},f.updateEffectAnimation=function(t){for(var e=this._effectCfg,i=this.childAt(1),n=["symbolType","period","rippleScale"],o=0;o<n.length;o++){var r=n[o];if(e[r]!==t[r])return this.stopEffectAnimation(),void this.startEffectAnimation(t)}a(i,t)},f.highlight=function(){this.trigger("emphasis")},f.downplay=function(){this.trigger("normal")},f.updateData=function(t,e){var i=t.hostModel;this.childAt(0).updateData(t,e);var a=this.childAt(1),o=t.getItemModel(e),r=t.getItemVisual(e,"symbol"),s=n(t.getItemVisual(e,"symbolSize")),l=t.getItemVisual(e,"color");a.attr("scale",s),a.traverse(function(t){t.attr({fill:l})});var h=o.getShallow("symbolOffset");if(h){var c=a.position;c[0]=u.parsePercent(h[0],s[0]),c[1]=u.parsePercent(h[1],s[1])}a.rotation=(o.getShallow("symbolRotate")||0)*Math.PI/180||0;var d={};if(d.showEffectOn=i.get("showEffectOn"),d.rippleScale=o.get("rippleEffect.scale"),d.brushType=o.get("rippleEffect.brushType"),d.period=1e3*o.get("rippleEffect.period"),d.effectOffset=e/t.count(),d.z=o.getShallow("z")||0,d.zlevel=o.getShallow("zlevel")||0,d.symbolType=r,d.color=l,this.off("mouseover").off("mouseout").off("emphasis").off("normal"),"render"===d.showEffectOn)this._effectCfg?this.updateEffectAnimation(d):this.startEffectAnimation(d),this._effectCfg=d;else{this._effectCfg=null,this.stopEffectAnimation();var f=this.childAt(0),p=function(){f.highlight(),"render"!==d.showEffectOn&&this.startEffectAnimation(d)},g=function(){f.downplay(),"render"!==d.showEffectOn&&this.stopEffectAnimation()};this.on("mouseover",p,this).on("mouseout",g,this).on("emphasis",p,this).on("normal",g,this)}this._effectCfg=d},f.fadeOut=function(t){this.off("mouseover").off("mouseout").off("emphasis").off("normal"),t&&t()},r.inherits(o,c),t.exports=o},function(t,e,i){function n(){this.group=new a.Group,this._lineEl=new s}var a=i(3),o=i(103),r=i(102),s=a.extendShape({shape:{polyline:!1,segs:[]},buildPath:function(t,e){for(var i=e.segs,n=e.polyline,a=0;a<i.length;a++){var o=i[a];if(n){t.moveTo(o[0][0],o[0][1]);for(var r=1;r<o.length;r++)t.lineTo(o[r][0],o[r][1])}else t.moveTo(o[0][0],o[0][1]),o.length>2?t.quadraticCurveTo(o[2][0],o[2][1],o[1][0],o[1][1]):t.lineTo(o[1][0],o[1][1])}},findDataIndex:function(t,e){for(var i=this.shape,n=i.segs,a=i.polyline,s=Math.max(this.style.lineWidth,1),l=0;l<n.length;l++){var u=n[l];if(a){for(var h=1;h<u.length;h++)if(r.containStroke(u[h-1][0],u[h-1][1],u[h][0],u[h][1],s,t,e))return l}else if(u.length>2){if(o.containStroke(u[0][0],u[0][1],u[2][0],u[2][1],u[1][0],u[1][1],s,t,e))return l}else if(r.containStroke(u[0][0],u[0][1],u[1][0],u[1][1],s,t,e))return l}return-1}}),l=n.prototype;l.updateData=function(t){this.group.removeAll();var e=this._lineEl,i=t.hostModel;e.setShape({segs:t.mapArray(t.getItemLayout),polyline:i.get("polyline")}),e.useStyle(i.getModel("lineStyle.normal").getLineStyle());var n=t.getVisual("color");n&&e.setStyle("stroke",n),e.setStyle("fill"),e.seriesIndex=i.seriesIndex,e.on("mousemove",function(t){e.dataIndex=null;var i=e.findDataIndex(t.offsetX,t.offsetY);i>0&&(e.dataIndex=i)}),this.group.add(e)},l.updateLayout=function(t){var e=t.getData();this._lineEl.setShape({segs:e.mapArray(e.getItemLayout)})},l.remove=function(){this.group.removeAll()},t.exports=n},function(t,e,i){function n(t,e,i,n){l.Group.call(this),this.bodyIndex,this.whiskerIndex,this.styleUpdater=i,this._createContent(t,e,n),this.updateData(t,e,n),this._seriesModel}function a(t,e,i){return s.map(t,function(t){return t=t.slice(),t[e]=i.initBaseline,t})}function o(t){var e={};return s.each(t,function(t,i){e["ends"+i]=t}),e}function r(t){this.group=new l.Group,this.styleUpdater=t}var s=i(1),l=i(3),u=i(8),h=u.extend({type:"whiskerInBox",shape:{},buildPath:function(t,e){for(var i in e)if(e.hasOwnProperty(i)&&0===i.indexOf("ends")){var n=e[i];t.moveTo(n[0][0],n[0][1]),t.lineTo(n[1][0],n[1][1])}}}),c=n.prototype;c._createContent=function(t,e,i){var n=t.getItemLayout(e),r="horizontal"===n.chartLayout?1:0,u=0;this.add(new l.Polygon({shape:{points:i?a(n.bodyEnds,r,n):n.bodyEnds},style:{strokeNoScale:!0},z2:100})),this.bodyIndex=u++;var c=s.map(n.whiskerEnds,function(t){return i?a(t,r,n):t});this.add(new h({shape:o(c),style:{strokeNoScale:!0},z2:100})),this.whiskerIndex=u++},c.updateData=function(t,e,i){var n=this._seriesModel=t.hostModel,a=t.getItemLayout(e),r=l[i?"initProps":"updateProps"];r(this.childAt(this.bodyIndex),{shape:{points:a.bodyEnds}},n,e),r(this.childAt(this.whiskerIndex),{shape:o(a.whiskerEnds)},n,e),this.styleUpdater.call(null,this,t,e)},s.inherits(n,l.Group);var d=r.prototype;d.updateData=function(t){var e=this.group,i=this._data,a=this.styleUpdater;t.diff(i).add(function(i){if(t.hasValue(i)){var o=new n(t,i,a,!0);t.setItemGraphicEl(i,o),e.add(o)}}).update(function(o,r){var s=i.getItemGraphicEl(r);return t.hasValue(o)?(s?s.updateData(t,o):s=new n(t,o,a),e.add(s),void t.setItemGraphicEl(o,s)):void e.remove(s)}).remove(function(t){var n=i.getItemGraphicEl(t);n&&e.remove(n)}).execute(),this._data=t},d.remove=function(){var t=this.group,e=this._data;this._data=null,e&&e.eachItemGraphicEl(function(e){e&&t.remove(e)})},t.exports=r},function(t,e,i){i(323),i(324);var n=i(2);n.registerLayout(i(325)),n.registerVisual(i(326))},function(t,e,i){"use strict";function n(t){var e=t.data;e&&e[0]&&e[0][0]&&e[0][0].coord&&(t.data=r.map(e,function(t){var e=[t[0].coord,t[1].coord],i={coords:e};return t[0].name&&(i.fromName=t[0].name),t[1].name&&(i.toName=t[1].name),r.mergeAll([i,t[0],t[1]])}))}var a=i(17),o=i(14),r=i(1),s=i(7),l=(i(26),a.extend({type:"series.lines",dependencies:["grid","polar"],visualColorAccessPath:"lineStyle.normal.color",init:function(t){n(t),l.superApply(this,"init",arguments)},mergeOption:function(t){n(t),l.superApply(this,"mergeOption",arguments)},getInitialData:function(t,e){var i=new o(["value"],this);return i.hasItemOption=!1,i.initData(t.data,[],function(t,e,n,a){if(t instanceof Array)return NaN;i.hasItemOption=!0;var o=t.value;return null!=o?o instanceof Array?o[a]:o:void 0}),i},formatTooltip:function(t){var e=this.getData(),i=e.getItemModel(t),n=i.get("name");if(n)return n;var a=i.get("fromName"),o=i.get("toName"),r=[];return null!=a&&r.push(a),null!=o&&r.push(o),s.encodeHTML(r.join(" > "))},defaultOption:{coordinateSystem:"geo",zlevel:0,z:2,legendHoverLink:!0,hoverAnimation:!0,xAxisIndex:0,yAxisIndex:0,symbol:["none","none"],symbolSize:[10,10],geoIndex:0,effect:{show:!1,period:4,constantSpeed:0,symbol:"circle",symbolSize:3,loop:!0,trailLength:.2},large:!1,largeThreshold:2e3,polyline:!1,label:{normal:{show:!1,position:"end"}},lineStyle:{normal:{opacity:.5}}}}))},function(t,e,i){var n=i(112),a=i(253),o=i(111),r=i(254),s=i(318),l=i(320);i(2).extendChartView({type:"lines",init:function(){},render:function(t,e,i){var u=t.getData(),h=this._lineDraw,c=t.get("effect.show"),d=t.get("polyline"),f=t.get("large")&&u.count()>=t.get("largeThreshold");
c===this._hasEffet&&d===this._isPolyline&&f===this._isLarge||(h&&h.remove(),h=this._lineDraw=f?new l:new n(d?c?s:r:c?a:o),this._hasEffet=c,this._isPolyline=d,this._isLarge=f);var p=t.get("zlevel"),g=t.get("effect.trailLength"),m=i.getZr(),v="svg"===m.painter.getType();if(v||m.painter.getLayer(p).clear(!0),null==this._lastZlevel||v||m.configLayer(this._lastZlevel,{motionBlur:!1}),c&&g){v||m.configLayer(p,{motionBlur:!0,lastFrameAlpha:Math.max(Math.min(g/10+.9,1),0)})}this.group.add(h.group),h.updateData(u),this._lastZlevel=p},updateLayout:function(t,e,i){this._lineDraw.updateLayout(t);var n=i.getZr(),a="svg"===n.painter.getType();a||n.painter.getLayer(this._lastZlevel).clear(!0)},remove:function(t,e){this._lineDraw&&this._lineDraw.remove(e,!0);var i=e.getZr(),n="svg"===i.painter.getType();n||i.painter.getLayer(this._lastZlevel).clear(!0)},dispose:function(){}})},function(t,e,i){t.exports=function(t){t.eachSeriesByType("lines",function(t){var e=t.coordinateSystem,i=t.getData();i.each(function(n){var a=i.getItemModel(n),o=a.option instanceof Array?a.option:a.get("coords"),r=[];if(t.get("polyline"))for(var s=0;s<o.length;s++)r.push(e.dataToPoint(o[s]));else{r[0]=e.dataToPoint(o[0]),r[1]=e.dataToPoint(o[1]);var l=a.get("lineStyle.normal.curveness");+l&&(r[2]=[(r[0][0]+r[1][0])/2-(r[0][1]-r[1][1])*l,(r[0][1]+r[1][1])/2-(r[1][0]-r[0][0])*l])}i.setItemLayout(n,r)})})}},function(t,e){function i(t){return t instanceof Array||(t=[t,t]),t}t.exports=function(t){t.eachSeriesByType("lines",function(t){var e=t.getData(),n=i(t.get("symbol")),a=i(t.get("symbolSize")),o="lineStyle.normal.opacity".split(".");e.setVisual("fromSymbol",n&&n[0]),e.setVisual("toSymbol",n&&n[1]),e.setVisual("fromSymbolSize",a&&a[0]),e.setVisual("toSymbolSize",a&&a[1]),e.setVisual("opacity",t.get(o)),e.each(function(t){var n=e.getItemModel(t),a=i(n.getShallow("symbol",!0)),r=i(n.getShallow("symbolSize",!0)),s=n.get(o);a[0]&&e.setItemVisual(t,"fromSymbol",a[0]),a[1]&&e.setItemVisual(t,"toSymbol",a[1]),r[0]&&e.setItemVisual(t,"fromSymbolSize",r[0]),r[1]&&e.setItemVisual(t,"toSymbolSize",r[1]),e.setItemVisual(t,"opacity",s)})})}},function(t,e,i){var n=i(2),a=n.PRIORITY;i(328),i(329),i(248),i(192),n.registerLayout(i(332)),n.registerVisual(i(333)),n.registerProcessor(a.PROCESSOR.STATISTIC,i(331)),n.registerPreprocessor(i(330)),i(94)("map",[{type:"mapToggleSelect",event:"mapselectchanged",method:"toggleSelected"},{type:"mapSelect",event:"mapselected",method:"select"},{type:"mapUnSelect",event:"mapunselected",method:"unSelect"}])},function(t,e,i){var n=i(14),a=i(17),o=i(1),r=i(25),s=i(7),l=s.encodeHTML,u=s.addCommas,h=i(83),c=i(192),d=a.extend({type:"series.map",dependencies:["geo"],layoutMode:"box",needsDrawMap:!1,seriesGroup:[],init:function(t){t=this._fillOption(t,this.getMapType()),this.option=t,d.superApply(this,"init",arguments),this.updateSelectedMap(t.data)},getInitialData:function(t){var e=r(["value"],t.data||[]),i=new n(e,this);return i.initData(t.data),i},mergeOption:function(t){t.data&&(t=this._fillOption(t,this.getMapType())),d.superCall(this,"mergeOption",t),this.updateSelectedMap(this.option.data)},getHostGeoModel:function(){var t=this.option.geoIndex;return null!=t?this.dependentModels.geo[t]:null},getMapType:function(){return(this.getHostGeoModel()||this).option.map},_fillOption:function(t,e){return t=o.extend({},t),t.data=c.getFilledRegions(t.data,e,t.nameMap),t},getRawValue:function(t){return this.getData().get("value",t)},getRegionModel:function(t){var e=this.getData();return e.getItemModel(e.indexOfName(t))},formatTooltip:function(t){for(var e=this.getData(),i=u(this.getRawValue(t)),n=e.getName(t),a=this.seriesGroup,o=[],r=0;r<a.length;r++){var s=a[r].originalData.indexOfName(n);isNaN(a[r].originalData.get("value",s))||o.push(l(a[r].name))}return o.join(", ")+"<br />"+l(n+" : "+i)},getTooltipPosition:function(t){if(null!=t){var e=this.getData().getName(t),i=this.coordinateSystem,n=i.getRegion(e);return n&&i.dataToPoint(n.center)}},setZoom:function(t){this.option.zoom=t},setCenter:function(t){this.option.center=t},defaultOption:{zlevel:0,z:2,coordinateSystem:"geo",map:"",left:"center",top:"center",aspectScale:.75,showLegendSymbol:!0,dataRangeHoverLink:!0,boundingCoords:null,center:null,zoom:1,scaleLimit:null,label:{normal:{show:!1,color:"#000"},emphasis:{show:!0,color:"rgb(100,0,0)"}},itemStyle:{normal:{borderWidth:.5,borderColor:"#444",areaColor:"#eee"},emphasis:{areaColor:"rgba(255,215,0,0.8)"}}}});o.mixin(d,h),t.exports=d},function(t,e,i){var n=i(3),a=i(1),o=i(257);i(2).extendChartView({type:"map",render:function(t,e,i,n){if(!n||"mapToggleSelect"!==n.type||n.from!==this.uid){var a=this.group;if(a.removeAll(),!t.getHostGeoModel()){if(n&&"geoRoam"===n.type&&"series"===n.componentType&&n.seriesId===t.id){var r=this._mapDraw;r&&a.add(r.group)}else if(t.needsDrawMap){var r=this._mapDraw||new o(i,!0);a.add(r.group),r.draw(t,e,i,this,n),this._mapDraw=r}else this._mapDraw&&this._mapDraw.remove(),this._mapDraw=null;t.get("showLegendSymbol")&&e.getComponent("legend")&&this._renderSymbols(t,e,i)}}},remove:function(){this._mapDraw&&this._mapDraw.remove(),this._mapDraw=null,this.group.removeAll()},dispose:function(){this._mapDraw&&this._mapDraw.remove(),this._mapDraw=null},_renderSymbols:function(t,e,i){var o=t.originalData,r=this.group;o.each("value",function(e,i){if(!isNaN(e)){var s=o.getItemLayout(i);if(s&&s.point){var l=s.point,u=s.offset,h=new n.Circle({style:{fill:t.getData().getVisual("color")},shape:{cx:l[0]+9*u,cy:l[1],r:3},silent:!0,z2:u?8:10});if(!u){var c=t.mainSeries.getData(),d=o.getName(i),f=c.indexOfName(d),p=o.getItemModel(i),g=p.getModel("label.normal"),m=p.getModel("label.emphasis"),v=c.getItemGraphicEl(f),y=a.retrieve2(t.getFormattedLabel(i,"normal"),d),x=a.retrieve2(t.getFormattedLabel(i,"emphasis"),y),_=function(){var t=n.setTextStyle({},m,{text:m.get("show")?x:null},{isRectText:!0,useInsideStyle:!1},!0);h.style.extendFrom(t),h.__mapOriginalZ2=h.z2,h.z2+=1},b=function(){n.setTextStyle(h.style,g,{text:g.get("show")?y:null,textPosition:g.getShallow("position")||"bottom"},{isRectText:!0,useInsideStyle:!1}),null!=h.__mapOriginalZ2&&(h.z2=h.__mapOriginalZ2,h.__mapOriginalZ2=null)};v.on("mouseover",_).on("mouseout",b).on("emphasis",_).on("normal",b),b()}r.add(h)}}})}})},function(t,e,i){var n=i(1);t.exports=function(t){var e=[];n.each(t.series,function(t){"map"===t.type&&e.push(t)}),n.each(e,function(t){t.map=t.map||t.mapType,n.defaults(t,t.mapLocation)})}},function(t,e,i){function n(t,e){var i={},n=["value"];return a.each(t,function(t){t.each(n,function(e,n){var a="ec-"+t.getName(n);i[a]=i[a]||[],isNaN(e)||i[a].push(e)})}),t[0].map(n,function(n,a){for(var o="ec-"+t[0].getName(a),r=0,s=1/0,l=-(1/0),u=i[o].length,h=0;h<u;h++)s=Math.min(s,i[o][h]),l=Math.max(l,i[o][h]),r+=i[o][h];var c;return c="min"===e?s:"max"===e?l:"average"===e?r/u:r,0===u?NaN:c})}var a=i(1);t.exports=function(t){var e={};t.eachSeriesByType("map",function(t){var i=t.getHostGeoModel(),n=i?"o"+i.id:"i"+t.getMapType();(e[n]=e[n]||[]).push(t)}),a.each(e,function(t,e){for(var i=n(a.map(t,function(t){return t.getData()}),t[0].get("mapValueCalculation")),o=0;o<t.length;o++)t[o].originalData=t[o].getData();for(var o=0;o<t.length;o++)t[o].seriesGroup=t,t[o].needsDrawMap=0===o&&!t[o].getHostGeoModel(),t[o].setData(i.cloneShallow()),t[o].mainSeries=t[0]})}},function(t,e,i){var n=i(1);t.exports=function(t){var e={};t.eachSeriesByType("map",function(i){var a=i.getMapType();if(!i.getHostGeoModel()&&!e[a]){var o={};n.each(i.seriesGroup,function(e){var i=e.coordinateSystem,n=e.originalData;e.get("showLegendSymbol")&&t.getComponent("legend")&&n.each("value",function(t,e){var a=n.getName(e),r=i.getRegion(a);if(r&&!isNaN(t)){var s=o[a]||0,l=i.dataToPoint(r.center);o[a]=s+1,n.setItemLayout(e,{point:l,offset:s})}})});var r=i.getData();r.each(function(t){var e=r.getName(t),i=r.getItemLayout(t)||{};i.showLabel=!o[e],r.setItemLayout(t,i)}),e[a]=!0}})}},function(t,e){t.exports=function(t){t.eachSeriesByType("map",function(t){var e=t.get("color"),i=t.getModel("itemStyle.normal"),n=i.get("areaColor"),a=i.get("color")||e[t.seriesIndex%e.length];t.getData().setVisual({areaColor:n,color:a})})}},function(t,e,i){var n=i(2);i(259),i(335),i(336),n.registerVisual(i(337))},function(t,e,i){function n(t,e,i){var n=t.get("data"),o=a(e);n&&n.length&&s.each(i,function(t){if(t){var e=s.indexOf(n,t[o]);t[o]=e>=0?e:NaN}})}function a(t){return+t.replace("dim","")}function o(t,e){var i=0;s.each(t,function(t){var e=a(t);e>i&&(i=e)});var n=e[0];n&&n.length-1>i&&(i=n.length-1);for(var o=[],r=0;r<=i;r++)o.push("dim"+r);return o}var r=i(14),s=i(1),l=i(17),u=i(25);t.exports=l.extend({type:"series.parallel",dependencies:["parallel"],visualColorAccessPath:"lineStyle.normal.color",getInitialData:function(t,e){var i=e.getComponent("parallel",this.get("parallelIndex")),a=i.parallelAxisIndex,l=t.data,h=i.dimensions,c=o(h,l),d=s.map(c,function(t,i){var o=s.indexOf(h,t),r=o>=0&&e.getComponent("parallelAxis",a[o]);return r&&"category"===r.get("type")?(n(r,t,l),{name:t,type:"ordinal"}):o<0&&u.guessOrdinal(l,i)?{name:t,type:"ordinal"}:t}),f=new r(d,this);return f.initData(l),this.option.progressive&&(this.option.animation=!1),f},getRawIndicesByActiveState:function(t){var e=this.coordinateSystem,i=this.getData(),n=[];return e.eachActiveState(i,function(e,a){t===e&&n.push(i.getRawIndex(a))}),n},defaultOption:{zlevel:0,z:2,coordinateSystem:"parallel",parallelIndex:0,label:{normal:{show:!1},emphasis:{show:!1}},inactiveOpacity:.05,activeOpacity:1,lineStyle:{normal:{width:1,opacity:.45,type:"solid"}},progressive:!1,smooth:!1,animationEasing:"linear"}})},function(t,e,i){function n(t,e,i){var n=t.model,a=t.getRect(),o=new l.Rect({shape:{x:a.x,y:a.y,width:a.width,height:a.height}}),r="horizontal"===n.get("layout")?"width":"height";return o.setShape(r,0),l.initProps(o,{shape:{width:a.width,height:a.height}},e,i),o}function a(t,e,i,n){for(var a=[],o=0;o<i.length;o++){var r=i[o],l=t.get(r,e);s(l,n.getAxis(r).type)||a.push(n.dataToPoint(l,r))}return a}function o(t,e,i,n,o){var r=a(t,i,n,o),s=new l.Polyline({shape:{points:r},silent:!0,z2:10});e.add(s),t.setItemGraphicEl(i,s)}function r(t,e){var i=t.hostModel.getModel("lineStyle.normal"),n=i.getLineStyle();t.eachItemGraphicEl(function(a,o){if(t.hasItemOption){var r=t.getItemModel(o),s=r.getModel("lineStyle.normal",i);n=s.getLineStyle(["color","stroke"])}a.useStyle(u.extend(n,{fill:null,stroke:t.getItemVisual(o,"color"),opacity:t.getItemVisual(o,"opacity")})),a.shape.smooth=e})}function s(t,e){return"category"===e?null==t:null==t||isNaN(t)}var l=i(3),u=i(1),h=.3,c=i(30).extend({type:"parallel",init:function(){this._dataGroup=new l.Group,this.group.add(this._dataGroup),this._data},render:function(t,e,i,n){this._renderForNormal(t,n)},dispose:function(){},_renderForNormal:function(t,e){function i(t){o(d,c,t,g,p,null,v)}function s(i,n){var o=f.getItemGraphicEl(n),r=a(d,i,g,p);d.setItemGraphicEl(i,o);var s=e&&e.animation===!1?null:t;l.updateProps(o,{shape:{points:r}},s,i)}function u(t){var e=f.getItemGraphicEl(t);c.remove(e)}var c=this._dataGroup,d=t.getData(),f=this._data,p=t.coordinateSystem,g=p.dimensions,m=t.option,v=m.smooth?h:null;if(d.diff(f).add(i).update(s).remove(u).execute(),r(d,v),!this._data){var y=n(p,t,function(){setTimeout(function(){c.removeClipPath()})});c.setClipPath(y)}this._data=d},remove:function(){this._dataGroup&&this._dataGroup.removeAll(),this._data=null}});t.exports=c},function(t,e){var i=["lineStyle","normal","opacity"];t.exports=function(t){t.eachSeriesByType("parallel",function(e){var n=e.getModel("itemStyle.normal"),a=e.getModel("lineStyle.normal"),o=t.get("color"),r=a.get("color")||n.get("color")||o[e.seriesIndex%o.length],s=e.get("inactiveOpacity"),l=e.get("activeOpacity"),u=e.getModel("lineStyle.normal").getLineStyle(),h=e.coordinateSystem,c=e.getData(),d={normal:u.opacity,active:l,inactive:s};h.eachActiveState(c,function(t,e){var n=c.getItemModel(e),a=d[t];if("normal"===t){var o=n.get(i,!0);null!=o&&(a=o)}c.setItemVisual(e,"opacity",a)}),c.setVisual("color",r)})}},function(t,e,i){var n=i(1);i(60),i(276),i(277);var a=i(87),o=i(2);o.registerLayout(n.curry(a,"pictorialBar")),o.registerVisual(n.curry(i(51),"pictorialBar","roundRect",null)),i(32)},function(t,e,i){var n=i(1),a=i(2);i(382),i(340),i(341),a.registerVisual(n.curry(i(89),"radar")),a.registerVisual(n.curry(i(51),"radar","circle",null)),a.registerLayout(i(343)),a.registerProcessor(n.curry(i(66),"radar")),a.registerPreprocessor(i(342))},function(t,e,i){"use strict";var n=i(17),a=i(14),o=i(25),r=i(1),s=i(7).encodeHTML,l=n.extend({type:"series.radar",dependencies:["radar"],init:function(t){l.superApply(this,"init",arguments),this.legendDataProvider=function(){return this.getRawData()}},getInitialData:function(t,e){var i=t.data||[],n=o([],i,{extraPrefix:"indicator_",extraFromZero:!0}),r=new a(n,this);return r.initData(i),r},formatTooltip:function(t){var e=this.getRawValue(t),i=this.coordinateSystem,n=i.getIndicatorAxes(),a=this.getData().getName(t);return s(""===a?this.name:a)+"<br/>"+r.map(n,function(t,i){return s(t.name+" : "+e[i])}).join("<br />")},defaultOption:{zlevel:0,z:2,coordinateSystem:"radar",legendHoverLink:!0,radarIndex:0,lineStyle:{normal:{width:2,type:"solid"}},label:{normal:{position:"top"}},symbol:"emptyCircle",symbolSize:4}});t.exports=l},function(t,e,i){function n(t){return o.isArray(t)||(t=[+t,+t]),t}var a=i(3),o=i(1),r=i(24);t.exports=i(2).extendChartView({type:"radar",render:function(t,e,i){function s(t,e){var i=t.getItemVisual(e,"symbol")||"circle",a=t.getItemVisual(e,"color");if("none"!==i){var o=n(t.getItemVisual(e,"symbolSize")),s=r.createSymbol(i,-1,-1,2,2,a);return s.attr({style:{strokeNoScale:!0},z2:100,scale:[o[0]/2,o[1]/2]}),s}}function l(e,i,n,o,r,l){n.removeAll();for(var u=0;u<i.length-1;u++){var h=s(o,r);h&&(h.__dimIdx=u,e[u]?(h.attr("position",e[u]),a[l?"initProps":"updateProps"](h,{position:i[u]},t,r)):h.attr("position",i[u]),n.add(h))}}function u(t){return o.map(t,function(t){return[h.cx,h.cy]})}var h=t.coordinateSystem,c=this.group,d=t.getData(),f=this._data;d.diff(f).add(function(e){var i=d.getItemLayout(e);if(i){var n=new a.Polygon,o=new a.Polyline,r={shape:{points:i}};n.shape.points=u(i),o.shape.points=u(i),a.initProps(n,r,t,e),a.initProps(o,r,t,e);var s=new a.Group,h=new a.Group;s.add(o),s.add(n),s.add(h),l(o.shape.points,i,h,d,e,!0),d.setItemGraphicEl(e,s)}}).update(function(e,i){var n=f.getItemGraphicEl(i),o=n.childAt(0),r=n.childAt(1),s=n.childAt(2),u={shape:{points:d.getItemLayout(e)}};u.shape.points&&(l(o.shape.points,u.shape.points,s,d,e,!1),a.updateProps(o,u,t),a.updateProps(r,u,t),d.setItemGraphicEl(e,n))}).remove(function(t){c.remove(f.getItemGraphicEl(t))}).execute(),d.eachItemGraphicEl(function(t,e){function i(){l.attr("ignore",m)}function n(){l.attr("ignore",g)}var r=d.getItemModel(e),s=t.childAt(0),l=t.childAt(1),u=t.childAt(2),h=d.getItemVisual(e,"color");c.add(t),s.useStyle(o.defaults(r.getModel("lineStyle.normal").getLineStyle(),{fill:"none",stroke:h})),s.hoverStyle=r.getModel("lineStyle.emphasis").getLineStyle();var f=r.getModel("areaStyle.normal"),p=r.getModel("areaStyle.emphasis"),g=f.isEmpty()&&f.parentModel.isEmpty(),m=p.isEmpty()&&p.parentModel.isEmpty();m=m&&g,l.ignore=g,l.useStyle(o.defaults(f.getAreaStyle(),{fill:h,opacity:.7})),l.hoverStyle=p.getAreaStyle();var v=r.getModel("itemStyle.normal").getItemStyle(["color"]),y=r.getModel("itemStyle.emphasis").getItemStyle(),x=r.getModel("label.normal"),_=r.getModel("label.emphasis");u.eachChild(function(t){t.setStyle(v),t.hoverStyle=o.clone(y),a.setLabelStyle(t.style,t.hoverStyle,x,_,{labelFetcher:d.hostModel,labelDataIndex:e,labelDimIndex:t.__dimIdx,defaultText:d.get(d.dimensions[t.__dimIdx],e),autoColor:h,isRectText:!0})}),t.off("mouseover").off("mouseout").off("normal").off("emphasis"),t.on("emphasis",i).on("mouseover",i).on("normal",n).on("mouseout",n),a.setHoverStyle(t)}),this._data=d},remove:function(){this.group.removeAll(),this._data=null},dispose:function(){}})},function(t,e,i){var n=i(1);t.exports=function(t){var e=t.polar;if(e){n.isArray(e)||(e=[e]);var i=[];n.each(e,function(e,a){e.indicator?(e.type&&!e.shape&&(e.shape=e.type),t.radar=t.radar||[],n.isArray(t.radar)||(t.radar=[t.radar]),t.radar.push(e)):i.push(e)}),t.polar=i}n.each(t.series,function(t){"radar"===t.type&&t.polarIndex&&(t.radarIndex=t.polarIndex)})}},function(t,e){t.exports=function(t){t.eachSeriesByType("radar",function(t){function e(t,e){n[e]=n[e]||[],n[e][o]=a.dataToPoint(t,o)}var i=t.getData(),n=[],a=t.coordinateSystem;if(a){for(var o=0;o<a.getIndicatorAxes().length;o++){var r=i.dimensions[o];i.each(r,e)}i.each(function(t){n[t][0]&&n[t].push(n[t][0].slice()),i.setItemLayout(t,n[t])})}})}},function(t,e,i){var n=i(2);i(345),i(346),n.registerLayout(i(347)),n.registerVisual(i(348))},function(t,e,i){var n=i(17),a=i(255),o=i(7).encodeHTML,r=n.extend({type:"series.sankey",layoutInfo:null,getInitialData:function(t){var e=t.edges||t.links,i=t.data||t.nodes;if(i&&e){var n=a(i,e,this,!0);return n.data}},getGraph:function(){return this.getData().graph},getEdgeData:function(){return this.getGraph().edgeData},formatTooltip:function(t,e,i){if("edge"===i){var n=this.getDataParams(t,i),a=n.data,s=a.source+" -- "+a.target;return n.value&&(s+=" : "+n.value),o(s)}return r.superCall(this,"formatTooltip",t,e)},defaultOption:{zlevel:0,z:2,coordinateSystem:"view",layout:null,left:"5%",top:"5%",right:"20%",bottom:"5%",nodeWidth:20,nodeGap:8,layoutIterations:32,label:{normal:{show:!0,position:"right",color:"#000",fontSize:12},emphasis:{show:!0}},itemStyle:{normal:{borderWidth:1,borderColor:"#333"}},lineStyle:{normal:{color:"#314656",opacity:.2,curveness:.5},emphasis:{opacity:.6}},animationEasing:"linear",animationDuration:1e3}});t.exports=r},function(t,e,i){function n(t,e,i){var n=new a.Rect({shape:{x:t.x-10,y:t.y-10,width:0,height:t.height+20}});return a.initProps(n,{shape:{width:t.width+20,height:t.height+20}},e,i),n}var a=i(3),o=a.extendShape({shape:{x1:0,y1:0,x2:0,y2:0,cpx1:0,cpy1:0,cpx2:0,cpy2:0,extent:0},buildPath:function(t,e){var i=e.extent/2;t.moveTo(e.x1,e.y1-i),t.bezierCurveTo(e.cpx1,e.cpy1-i,e.cpx2,e.cpy2-i,e.x2,e.y2-i),t.lineTo(e.x2,e.y2+i),t.bezierCurveTo(e.cpx2,e.cpy2+i,e.cpx1,e.cpy1+i,e.x1,e.y1+i),t.closePath()}});t.exports=i(2).extendChartView({type:"sankey",_model:null,render:function(t,e,i){var r=t.getGraph(),s=this.group,l=t.layoutInfo,u=t.getData(),h=t.getData("edge");this._model=t,s.removeAll(),s.position=[l.x,l.y],r.eachEdge(function(e){var i=new o;i.dataIndex=e.dataIndex,i.seriesIndex=t.seriesIndex,i.dataType="edge";var n=e.getModel("lineStyle.normal"),r=n.get("curveness"),l=e.node1.getLayout(),u=e.node2.getLayout(),c=e.getLayout();i.shape.extent=Math.max(1,c.dy);var d=l.x+l.dx,f=l.y+c.sy+c.dy/2,p=u.x,g=u.y+c.ty+c.dy/2,m=d*(1-r)+p*r,v=f,y=d*r+p*(1-r),x=g;switch(i.setShape({x1:d,y1:f,x2:p,y2:g,cpx1:m,cpy1:v,cpx2:y,cpy2:x}),i.setStyle(n.getItemStyle()),i.style.fill){case"source":i.style.fill=e.node1.getVisual("color");break;case"target":i.style.fill=e.node2.getVisual("color")}a.setHoverStyle(i,e.getModel("lineStyle.emphasis").getItemStyle()),s.add(i),h.setItemGraphicEl(e.dataIndex,i)}),r.eachNode(function(e){var i=e.getLayout(),n=e.getModel(),o=n.getModel("label.normal"),r=n.getModel("label.emphasis"),l=new a.Rect({shape:{x:i.x,y:i.y,width:e.getLayout().dx,height:e.getLayout().dy},style:n.getModel("itemStyle.normal").getItemStyle()}),h=e.getModel("itemStyle.emphasis").getItemStyle();a.setLabelStyle(l.style,h,o,r,{labelFetcher:t,labelDataIndex:e.dataIndex,defaultText:e.id,isRectText:!0}),l.setStyle("fill",e.getVisual("color")),a.setHoverStyle(l,h),s.add(l),u.setItemGraphicEl(e.dataIndex,l),l.dataType="node"}),!this._data&&t.get("animation")&&s.setClipPath(n(s.getBoundingRect(),t,function(){s.removeClipPath()})),this._data=t.getData()},dispose:function(){}})},function(t,e,i){function n(t,e){return M.getLayoutRect(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()})}function a(t,e,i,n,a,o,s){r(t,i,a),u(t,e,o,n,s),m(t)}function o(t){T.each(t,function(t){var e=x(t.outEdges,S),i=x(t.inEdges,S),n=Math.max(e,i);t.setLayout({value:n},!0)})}function r(t,e,i){for(var n=t,a=null,o=0,r=0;n.length;){a=[];for(var u=0,h=n.length;u<h;u++){var c=n[u];c.setLayout({x:o},!0),c.setLayout({dx:e},!0);for(var d=0,f=c.outEdges.length;d<f;d++)a.push(c.outEdges[d].node2)}n=a,++o}s(t,o),r=(i-e)/(o-1),l(t,r)}function s(t,e){T.each(t,function(t){t.outEdges.length||t.setLayout({x:e-1},!0)})}function l(t,e){T.each(t,function(t){var i=t.getLayout().x*e;t.setLayout({x:i},!0)})}function u(t,e,i,n,a){var o=I().key(function(t){return t.getLayout().x}).sortKeys(w).entries(t).map(function(t){return t.values});h(t,o,e,i,n),c(o,n,i);for(var r=1;a>0;a--)r*=.99,d(o,r),c(o,n,i),p(o,r),c(o,n,i)}function h(t,e,i,n,a){var o=[];T.each(e,function(t){var e=t.length,i=0;T.each(t,function(t){i+=t.getLayout().value});var r=(n-(e-1)*a)/i;o.push(r)}),o.sort(function(t,e){return t-e});var r=o[0];T.each(e,function(t){T.each(t,function(t,e){t.setLayout({y:e},!0);var i=t.getLayout().value*r;t.setLayout({dy:i},!0)})}),T.each(i,function(t){var e=+t.getValue()*r;t.setLayout({dy:e},!0)})}function c(t,e,i){T.each(t,function(t){var n,a,o,r=0,s=t.length;for(t.sort(b),o=0;o<s;o++){if(n=t[o],a=r-n.getLayout().y,a>0){var l=n.getLayout().y+a;n.setLayout({y:l},!0)}r=n.getLayout().y+n.getLayout().dy+e}if(a=r-e-i,a>0){var l=n.getLayout().y-a;for(n.setLayout({y:l},!0),r=n.getLayout().y,o=s-2;o>=0;--o)n=t[o],a=n.getLayout().y+n.getLayout().dy+e-r,a>0&&(l=n.getLayout().y-a,n.setLayout({y:l},!0)),r=n.getLayout().y}})}function d(t,e){T.each(t.slice().reverse(),function(t){T.each(t,function(t){if(t.outEdges.length){var i=x(t.outEdges,f)/x(t.outEdges,S),n=t.getLayout().y+(i-_(t))*e;t.setLayout({y:n},!0)}})})}function f(t){return _(t.node2)*t.getValue()}function p(t,e){T.each(t,function(t){T.each(t,function(t){if(t.inEdges.length){var i=x(t.inEdges,g)/x(t.inEdges,S),n=t.getLayout().y+(i-_(t))*e;t.setLayout({y:n},!0)}})})}function g(t){return _(t.node1)*t.getValue()}function m(t){T.each(t,function(t){t.outEdges.sort(v),t.inEdges.sort(y)}),T.each(t,function(t){var e=0,i=0;T.each(t.outEdges,function(t){t.setLayout({sy:e},!0),e+=t.getLayout().dy}),T.each(t.inEdges,function(t){t.setLayout({ty:i},!0),i+=t.getLayout().dy})})}function v(t,e){return t.node2.getLayout().y-e.node2.getLayout().y}function y(t,e){return t.node1.getLayout().y-e.node1.getLayout().y}function x(t,e){for(var i=0,n=t.length,a=-1;++a<n;){var o=+e.call(t,t[a],a);isNaN(o)||(i+=o)}return i}function _(t){return t.getLayout().y+t.getLayout().dy/2}function b(t,e){return t.getLayout().y-e.getLayout().y}function w(t,e){return t<e?-1:t>e?1:t===e?0:NaN}function S(t){return t.getValue()}var M=i(9),I=i(273),T=i(1);t.exports=function(t,e,i){t.eachSeriesByType("sankey",function(t){var i=t.get("nodeWidth"),r=t.get("nodeGap"),s=n(t,e);t.layoutInfo=s;var l=s.width,u=s.height,h=t.getGraph(),c=h.nodes,d=h.edges;o(c);var f=T.filter(c,function(t){return 0===t.getLayout().value}),p=0!==f.length?0:t.get("layoutIterations");a(c,d,i,r,l,u,p)})}},function(t,e,i){var n=i(88),a=i(1);t.exports=function(t,e){t.eachSeriesByType("sankey",function(t){var e=t.getGraph(),i=e.nodes;i.sort(function(t,e){return t.getLayout().value-e.getLayout().value});var o=i[0].getLayout().value,r=i[i.length-1].getLayout().value;a.each(i,function(e){var i=new n({type:"color",mappingMethod:"linear",dataExtent:[o,r],visual:t.get("color")}),a=i.mapValueToVisual(e.getLayout().value);e.setVisual("color",a);var s=e.getModel(),l=s.get("itemStyle.normal.color");null!=l&&e.setVisual("color",l)})})}},function(t,e,i){var n=i(2),a=i(1);i(260),i(350),i(351),n.registerLayout(i(352)),n.registerVisual(i(353)),n.registerProcessor(a.curry(i(66),"themeRiver"))},function(t,e,i){"use strict";var n=i(25),a=i(17),o=i(14),r=i(1),s=i(7),l=s.encodeHTML,u=i(273),h=2,c=a.extend({type:"series.themeRiver",dependencies:["singleAxis"],nameMap:null,init:function(t){c.superApply(this,"init",arguments),this.legendDataProvider=function(){return this.getRawData()}},fixData:function(t){for(var e=t.length,i=u().key(function(t){return t[2]}).entries(t),n=r.map(i,function(t){return{name:t.key,dataList:t.values}}),a=n.length,o=-1,s=-1,l=0;l<a;++l){var h=n[l].dataList.length;h>o&&(o=h,s=l)}for(var c=0;c<a;++c)if(c!==s)for(var d=n[c].name,f=0;f<o;++f){for(var p=n[s].dataList[f][0],g=n[c].dataList.length,m=-1,v=0;v<g;++v){var y=n[c].dataList[v][0];if(y===p){m=v;break}}m===-1&&(t[e]=[],t[e][0]=p,t[e][1]=0,t[e][2]=d,e++)}return t},getInitialData:function(t,e){var i=[],a=e.queryComponents({mainType:"singleAxis",index:this.get("singleAxisIndex"),id:this.get("singleAxisId")})[0],s=a.get("type");i=[{name:"time",type:"category"===s?"ordinal":"time"===s?"time":"float"},{name:"value",type:"float"},{name:"name",type:"ordinal"}];for(var l=r.filter(t.data,function(t){return void 0!==t[2]}),u=this.fixData(l||[]),c=[],d=this.nameMap=r.createHashMap(),f=0,p=0;p<u.length;++p)c.push(u[p][h]),d.get(u[p][h])||(d.set(u[p][h],f),f++);i=n(i,u);var g=new o(i,this);return g.initData(u,c),g},coordDimToDataDim:function(t){return["time"]},getLayerSeries:function(){function t(t,i){return e.get("time",t)-e.get("time",i)}for(var e=this.getData(),i=e.count(),n=[],a=0;a<i;++a)n[a]=a;for(var o=u().key(function(t){return e.get("name",t)}).entries(n),s=r.map(o,function(t){return{name:t.key,indices:t.values}}),l=0;l<s.length;++l)s[l].indices.sort(t);return s},getAxisTooltipData:function(t,e,i){r.isArray(t)||(t=t?[t]:[]);for(var n,a=this.getData(),o=this.getLayerSeries(),s=[],l=o.length,u=0;u<l;++u){for(var h=Number.MAX_VALUE,c=-1,d=o[u].indices.length,f=0;f<d;++f){var p=a.get(t[0],o[u].indices[f]),g=Math.abs(p-e);g<=h&&(n=p,h=g,c=o[u].indices[f])}s.push(c)}return{dataIndices:s,nestestValue:n}},formatTooltip:function(t){var e=this.getData(),i=e.get("name",t),n=e.get("value",t);return(isNaN(n)||null==n)&&(n="-"),l(i+" : "+n)},defaultOption:{zlevel:0,z:2,coordinateSystem:"singleAxis",boundaryGap:["10%","10%"],singleAxisIndex:0,animationEasing:"linear",label:{normal:{margin:4,textAlign:"right",show:!0,position:"left",color:"#000",fontSize:11},emphasis:{show:!0}}}});t.exports=c},function(t,e,i){(function(e){function n(t,e,i){var n=new o.Rect({shape:{x:t.x-10,y:t.y-10,width:0,height:t.height+20}});return o.initProps(n,{shape:{width:t.width+20,height:t.height+20}},e,i),n}var a=i(98),o=i(3),r=i(1),s=i(43);t.exports=i(2).extendChartView({type:"themeRiver",init:function(){this._layers=[]},render:function(t,e,i){function l(t){return t.name}function u(e,i,s){var l=this._layers;if("remove"===e)return void d.remove(l[i]);for(var u,p=[],g=[],m=f[i].indices,v=0;v<m.length;v++){var x=h.getItemLayout(m[v]),_=x.x,b=x.y0,w=x.y;p.push([_,b]),g.push([_,b+w]),u=c.getItemVisual(m[v],"color")}var S,M,I=h.getItemLayout(m[0]),T=h.getItemModel(m[v-1]),A=T.getModel("label.normal"),C=A.get("margin");if("add"===e){var L=y[i]=new o.Group;S=new a.Polygon({shape:{points:p,stackedOnPoints:g,smooth:.4,stackedOnSmooth:.4,smoothConstraint:!1},z2:0}),M=new o.Text({style:{x:I.x-C,y:I.y0+I.y/2}}),L.add(S),L.add(M),d.add(L),S.setClipPath(n(S.getBoundingRect(),t,function(){S.removeClipPath()}))}else{var L=l[s];S=L.childAt(0),M=L.childAt(1),d.add(L),y[i]=L,o.updateProps(S,{shape:{points:p,stackedOnPoints:g}},t),o.updateProps(M,{style:{x:I.x-C,y:I.y0+I.y/2}},t)}var D=T.getModel("itemStyle.emphasis"),P=T.getModel("itemStyle.normal");o.setTextStyle(M.style,A,{text:A.get("show")?t.getFormattedLabel(m[v-1],"normal")||h.getName(m[v-1]):null,textVerticalAlign:"middle"}),S.setStyle(r.extend({fill:u},P.getItemStyle(["color"]))),o.setHoverStyle(S,D.getItemStyle())}var h=t.getData(),c=t.getRawData();if(h.count()){var d=this.group,f=t.getLayerSeries(),p=h.getLayout("layoutInfo"),g=p.rect,m=p.boundaryGap;d.attr("position",[0,g.y+m[0]]);var v=new s(this._layersSeries||[],f,l,l),y={};v.add(r.bind(r.curry(u,"add"),this)).update(r.bind(r.curry(u,"update"),this)).remove(r.bind(r.curry(u,"remove"),this)).execute(),this._layersSeries=f,this._layers=y}},dispose:function(){}})}).call(e,i(194))},function(t,e,i){function n(t,e,i){if(t.count())for(var n,r=e.coordinateSystem,s=e.getLayerSeries(),l=o.map(s,function(e){return o.map(e.indices,function(e){var i=r.dataToPoint(t.get("time",e));return i[1]=t.get("value",e),i})}),u=a(l),h=u.y0,c=i/u.max,d=s.length,f=s[0].indices.length,p=0;p<f;++p){n=h[p]*c,t.setItemLayout(s[0].indices[p],{layerIndex:0,x:l[0][p][0],y0:n,y:l[0][p][1]*c});for(var g=1;g<d;++g)n+=l[g-1][p][1]*c,t.setItemLayout(s[g].indices[p],{layerIndex:g,x:l[g][p][0],y0:n,y:l[g][p][1]*c})}}function a(t){for(var e,i=t.length,n=t[0].length,a=[],o=[],r=0,s={},l=0;l<n;++l){for(var u=0,e=0;u<i;++u)e+=t[u][l][1];e>r&&(r=e),a.push(e)}for(var h=0;h<n;++h)o[h]=(r-a[h])/2;r=0;for(var c=0;c<n;++c){var d=a[c]+o[c];d>r&&(r=d)}return s.y0=o,s.max=r,s}var o=i(1),r=i(4);t.exports=function(t,e){t.eachSeriesByType("themeRiver",function(t){var e=t.getData(),i=t.coordinateSystem,a={},o=i.getRect();a.rect=o;var s=t.get("boundaryGap"),l=i.getAxis();if(a.boundaryGap=s,"horizontal"===l.orient){s[0]=r.parsePercent(s[0],o.height),s[1]=r.parsePercent(s[1],o.height);var u=o.height-s[0]-s[1];n(e,t,u)}else{s[0]=r.parsePercent(s[0],o.width),s[1]=r.parsePercent(s[1],o.width);var h=o.width-s[0]-s[1];n(e,t,h)}e.setLayout("layoutInfo",a)})}},function(t,e){t.exports=function(t){t.eachSeriesByType("themeRiver",function(t){var e=t.getData(),i=t.getRawData(),n=t.get("color");e.each(function(a){var o=e.getName(a),r=n[(t.nameMap.get(o)-1)%n.length];i.setItemVisual(a,"color",r)})})}},function(t,e,i){var n=i(2);i(356),i(357),i(358),n.registerVisual(i(360)),n.registerLayout(i(359))},function(t,e,i){function n(t){this.group=new r.Group,t.add(this.group)}function a(t,e,i,n,a,o){var r=[[a?t:t-d,e],[t+i,e],[t+i,e+n],[a?t:t-d,e+n]];return!o&&r.splice(2,0,[t+i+d,e+n/2]),!a&&r.push([t,e+n/2]),r}function o(t,e,i){t.eventData={componentType:"series",componentSubType:"treemap",seriesIndex:e.componentIndex,seriesName:e.name,seriesType:"treemap",selfType:"breadcrumb",nodeData:{dataIndex:i&&i.dataIndex,name:i&&i.name},treePathInfo:i&&u.wrapTreePathInfo(i,e)}}var r=i(3),s=i(9),l=i(1),u=i(99),h=8,c=8,d=5;n.prototype={constructor:n,render:function(t,e,i,n){var a=t.getModel("breadcrumb"),o=this.group;if(o.removeAll(),a.get("show")&&i){var r=a.getModel("itemStyle.normal"),l=r.getModel("textStyle"),u={pos:{left:a.get("left"),right:a.get("right"),top:a.get("top"),bottom:a.get("bottom")},box:{width:e.getWidth(),height:e.getHeight()},emptyItemWidth:a.get("emptyItemWidth"),totalWidth:0,renderList:[]};this._prepare(i,u,l),this._renderContent(t,u,r,l,n),s.positionElement(o,u.pos,u.box)}},_prepare:function(t,e,i){for(var n=t;n;n=n.parentNode){var a=n.getModel().get("name"),o=i.getTextRect(a),r=Math.max(o.width+2*h,e.emptyItemWidth);e.totalWidth+=r+c,e.renderList.push({node:n,text:a,width:r})}},_renderContent:function(t,e,i,n,u){for(var h=0,d=e.emptyItemWidth,f=t.get("breadcrumb.height"),p=s.getAvailableSize(e.pos,e.box),g=e.totalWidth,m=e.renderList,v=m.length-1;v>=0;v--){var y=m[v],x=y.node,_=y.width,b=y.text;g>p.width&&(g-=_-d,_=d,b=null);var w=new r.Polygon({shape:{points:a(h,0,_,f,v===m.length-1,0===v)},style:l.defaults(i.getItemStyle(),{lineJoin:"bevel",text:b,textFill:n.getTextColor(),textFont:n.getFont()}),z:10,onclick:l.curry(u,x)});this.group.add(w),o(w,t,x),h+=_+c}},remove:function(){this.group.removeAll()}},t.exports=n},function(t,e,i){function n(t){var e=0;s.each(t.children,function(t){n(t);var i=t.value;s.isArray(i)&&(i=i[0]),e+=i});var i=t.value;s.isArray(i)&&(i=i[0]),(null==i||isNaN(i))&&(i=e),i<0&&(i=0),s.isArray(t.value)?t.value[0]=i:t.value=i}function a(t,e){var i=e.get("color");if(i){t=t||[];var n;if(s.each(t,function(t){var e=new l(t),i=e.get("color");(e.get("itemStyle.normal.color")||i&&"none"!==i)&&(n=!0)}),!n){var a=t[0]||(t[0]={});a.color=i.slice()}return t}}var o=i(17),r=i(433),s=i(1),l=i(11),u=i(7),h=i(99),c=u.encodeHTML,d=u.addCommas;t.exports=o.extend({type:"series.treemap",layoutMode:"box",dependencies:["grid","polar"],_viewRoot:null,defaultOption:{
progressive:0,hoverLayerThreshold:1/0,left:"center",top:"middle",right:null,bottom:null,width:"80%",height:"80%",sort:!0,clipWindow:"origin",squareRatio:.5*(1+Math.sqrt(5)),leafDepth:null,drillDownIcon:"▶",zoomToNodeRatio:.1024,roam:!0,nodeClick:"zoomToNode",animation:!0,animationDurationUpdate:900,animationEasing:"quinticInOut",breadcrumb:{show:!0,height:22,left:"center",top:"bottom",emptyItemWidth:25,itemStyle:{normal:{color:"rgba(0,0,0,0.7)",borderColor:"rgba(255,255,255,0.7)",borderWidth:1,shadowColor:"rgba(150,150,150,1)",shadowBlur:3,shadowOffsetX:0,shadowOffsetY:0,textStyle:{color:"#fff"}},emphasis:{textStyle:{}}}},label:{normal:{show:!0,distance:0,padding:5,position:"inside",color:"#fff",ellipsis:!0}},upperLabel:{normal:{show:!1,position:[0,"50%"],height:20,color:"#fff",ellipsis:!0,verticalAlign:"middle"},emphasis:{show:!0,position:[0,"50%"],color:"#fff",ellipsis:!0,verticalAlign:"middle"}},itemStyle:{normal:{color:null,colorAlpha:null,colorSaturation:null,borderWidth:0,gapWidth:0,borderColor:"#fff",borderColorSaturation:null},emphasis:{}},visualDimension:0,visualMin:null,visualMax:null,color:[],colorAlpha:null,colorSaturation:null,colorMappingBy:"index",visibleMin:10,childrenVisibleMin:null,levels:[]},getInitialData:function(t,e){var i={name:t.name,children:t.data};n(i);var o=t.levels||[];return o=t.levels=a(o,e),r.createTree(i,this,o).data},optionUpdated:function(){this.resetViewRoot()},formatTooltip:function(t){var e=this.getData(),i=this.getRawValue(t),n=d(s.isArray(i)?i[0]:i),a=e.getName(t);return c(a+": "+n)},getDataParams:function(t){var e=o.prototype.getDataParams.apply(this,arguments),i=this.getData().tree.getNodeByDataIndex(t);return e.treePathInfo=h.wrapTreePathInfo(i,this),e},setLayoutInfo:function(t){this.layoutInfo=this.layoutInfo||{},s.extend(this.layoutInfo,t)},mapIdToIndex:function(t){var e=this._idIndexMap;e||(e=this._idIndexMap=s.createHashMap(),this._idIndexMapCount=0);var i=e.get(t);return null==i&&e.set(t,i=this._idIndexMapCount++),i},getViewRoot:function(){return this._viewRoot},resetViewRoot:function(t){t?this._viewRoot=t:t=this._viewRoot;var e=this.getData().tree.root;t&&(t===e||e.contains(t))||(this._viewRoot=e)}})},function(t,e,i){function n(){return{nodeGroup:[],background:[],content:[]}}function a(t,e,i,n,a,l,u,h,c,d){function f(e,i,n){i.dataIndex=u.dataIndex,i.seriesIndex=t.seriesIndex,i.setShape({x:0,y:0,width:L,height:D});var a=u.getVisual("borderColor",!0),o=V.get("borderColor");g(i,function(){var t={fill:a},e={fill:o};if(n){var r=L-2*P;y(t,e,a,r,R,{x:P,y:0,width:r,height:R})}else t.text=e.text=null;i.setStyle(t),s.setHoverStyle(i,e)}),e.add(i)}function p(e,i){i.dataIndex=u.dataIndex,i.seriesIndex=t.seriesIndex;var n=Math.max(L-2*P,0),a=Math.max(D-2*P,0);i.culling=!0,i.setShape({x:P,y:P,width:n,height:a});var o=u.getVisual("color",!0);g(i,function(){var t={fill:o},e=V.getItemStyle();y(t,e,o,n,a),i.setStyle(t),s.setHoverStyle(i,e)}),e.add(i)}function g(t,e){k?!t.invisible&&l.push(t):(e(),t.__tmWillVisible||(t.invisible=!1))}function y(e,i,n,a,o,l){var h=u.getModel(),c=r.retrieve(t.getFormattedLabel(u.dataIndex,"normal",null,null,l?"upperLabel":"label"),h.get("name"));if(!l&&C.isLeafRoot){var d=t.get("drillDownIcon",!0);c=d?d+" "+c:c}var f=h.getModel(l?w:_),p=h.getModel(l?S:b),g=f.getShallow("show");s.setLabelStyle(e,i,f,p,{defaultText:g?c:null,autoColor:n,isRectText:!0}),l&&(e.textRect=r.clone(l)),e.truncate=g&&f.get("ellipsis")?{outerWidth:a,outerHeight:o,minChar:2}:null}function x(t,n,r,s){var l=null!=z&&i[t][z],u=a[t];return l?(i[t][z]=null,M(u,l,t)):k||(l=new n({z:o(r,s)}),l.__tmDepth=r,l.__tmStorageName=t,A(u,l,t)),e[t][O]=l}function M(t,e,i){var n=t[O]={};n.old="nodeGroup"===i?e.position.slice():r.extend({},e.shape)}function A(t,e,i){var o=t[O]={},r=u.parentNode;if(r&&(!n||"drillDown"===n.direction)){var s=0,l=0,h=a.background[r.getRawIndex()];!n&&h&&h.old&&(s=h.old.width,l=h.old.height),o.old="nodeGroup"===i?[0,l]:{x:s,y:l,width:0,height:0}}o.fadein="nodeGroup"!==i}if(u){var C=u.getLayout();if(C&&C.isInView){var L=C.width,D=C.height,P=C.borderWidth,k=C.invisible,O=u.getRawIndex(),z=h&&h.getRawIndex(),E=u.viewChildren,R=C.upperHeight,N=E&&E.length,V=u.getModel("itemStyle.emphasis"),B=x("nodeGroup",m);if(B){if(c.add(B),B.attr("position",[C.x||0,C.y||0]),B.__tmNodeWidth=L,B.__tmNodeHeight=D,C.isAboveViewRoot)return B;var G=x("background",v,d,I);if(G&&f(B,G,N&&C.upperHeight),!N){var H=x("content",v,d,T);H&&p(B,H)}return B}}}}function o(t,e){var i=t*M+e;return(i-1)/i}var r=i(1),s=i(3),l=i(43),u=i(99),h=i(355),c=i(100),d=i(12),f=i(19),p=i(435),g=r.bind,m=s.Group,v=s.Rect,y=r.each,x=3,_=["label","normal"],b=["label","emphasis"],w=["upperLabel","normal"],S=["upperLabel","emphasis"],M=10,I=1,T=2;t.exports=i(2).extendChartView({type:"treemap",init:function(t,e){this._containerGroup,this._storage=n(),this._oldTree,this._breadcrumb,this._controller,this._state="ready"},render:function(t,e,i,n){var a=e.findComponents({mainType:"series",subType:"treemap",query:n});if(!(r.indexOf(a,t)<0)){this.seriesModel=t,this.api=i,this.ecModel=e;var o=u.retrieveTargetInfo(n,t),s=n&&n.type,l=t.layoutInfo,h=!this._oldTree,c=this._storage,d="treemapRootToNode"===s&&o&&c?{rootNodeGroup:c.nodeGroup[o.node.getRawIndex()],direction:n.direction}:null,f=this._giveContainerGroup(l),p=this._doRender(f,t,d);h||s&&"treemapZoomToNode"!==s&&"treemapRootToNode"!==s?p.renderFinally():this._doAnimation(f,p,t,d),this._resetController(i),this._renderBreadcrumb(t,i,o)}},_giveContainerGroup:function(t){var e=this._containerGroup;return e||(e=this._containerGroup=new m,this._initEvents(e),this.group.add(e)),e.attr("position",[t.x,t.y]),e},_doRender:function(t,e,i){function o(t,e,i,n,a){function s(t){return t.getId()}function u(r,s){var l=null!=r?t[r]:null,u=null!=s?e[s]:null,h=m(l,u,i,a);h&&o(l&&l.viewChildren||[],u&&u.viewChildren||[],h,n,a+1)}n?(e=t,y(t,function(t,e){!t.isRemoved()&&u(e,e)})):new l(e,t,s,s).add(u).update(u).remove(r.curry(u,null)).execute()}function s(t){var e=n();return t&&y(t,function(t,i){var n=e[i];y(t,function(t){t&&(n.push(t),t.__tmWillDelete=1)})}),e}function u(){y(v,function(t){y(t,function(t){t.parent&&t.parent.remove(t)})}),y(g,function(t){t.invisible=!0,t.dirty()})}var h=e.getData().tree,c=this._oldTree,d=n(),f=n(),p=this._storage,g=[],m=r.curry(a,e,f,p,i,d,g);o(h.root?[h.root]:[],c&&c.root?[c.root]:[],t,h===c||!c,0);var v=s(p);return this._oldTree=h,this._storage=f,{lastsForAnimation:d,willDeleteEls:v,renderFinally:u}},_doAnimation:function(t,e,i,n){if(i.get("animation")){var a=i.get("animationDurationUpdate"),o=i.get("animationEasing"),s=p.createWrap();y(e.willDeleteEls,function(t,e){y(t,function(t,i){if(!t.invisible){var r,l=t.parent;if(n&&"drillDown"===n.direction)r=l===n.rootNodeGroup?{shape:{x:0,y:0,width:l.__tmNodeWidth,height:l.__tmNodeHeight},style:{opacity:0}}:{style:{opacity:0}};else{var u=0,h=0;l.__tmWillDelete||(u=l.__tmNodeWidth/2,h=l.__tmNodeHeight/2),r="nodeGroup"===e?{position:[u,h],style:{opacity:0}}:{shape:{x:u,y:h,width:0,height:0},style:{opacity:0}}}r&&s.add(t,r,a,o)}})}),y(this._storage,function(t,i){y(t,function(t,n){var l=e.lastsForAnimation[i][n],u={};l&&("nodeGroup"===i?l.old&&(u.position=t.position.slice(),t.attr("position",l.old)):(l.old&&(u.shape=r.extend({},t.shape),t.setShape(l.old)),l.fadein?(t.setStyle("opacity",0),u.style={opacity:1}):1!==t.style.opacity&&(u.style={opacity:1})),s.add(t,u,a,o))})},this),this._state="animating",s.done(g(function(){this._state="ready",e.renderFinally()},this)).start()}},_resetController:function(t){var e=this._controller;e||(e=this._controller=new c(t.getZr()),e.enable(this.seriesModel.get("roam")),e.on("pan",g(this._onPan,this)),e.on("zoom",g(this._onZoom,this)));var i=new d(0,0,t.getWidth(),t.getHeight());e.setPointerChecker(function(t,e,n){return i.contain(e,n)})},_clearController:function(){var t=this._controller;t&&(t.dispose(),t=null)},_onPan:function(t,e){if("animating"!==this._state&&(Math.abs(t)>x||Math.abs(e)>x)){var i=this.seriesModel.getData().tree.root;if(!i)return;var n=i.getLayout();if(!n)return;this.api.dispatchAction({type:"treemapMove",from:this.uid,seriesId:this.seriesModel.id,rootRect:{x:n.x+t,y:n.y+e,width:n.width,height:n.height}})}},_onZoom:function(t,e,i){if("animating"!==this._state){var n=this.seriesModel.getData().tree.root;if(!n)return;var a=n.getLayout();if(!a)return;var o=new d(a.x,a.y,a.width,a.height),r=this.seriesModel.layoutInfo;e-=r.x,i-=r.y;var s=f.create();f.translate(s,s,[-e,-i]),f.scale(s,s,[t,t]),f.translate(s,s,[e,i]),o.applyTransform(s),this.api.dispatchAction({type:"treemapRender",from:this.uid,seriesId:this.seriesModel.id,rootRect:{x:o.x,y:o.y,width:o.width,height:o.height}})}},_initEvents:function(t){t.on("click",function(t){if("ready"===this._state){var e=this.seriesModel.get("nodeClick",!0);if(e){var i=this.findTarget(t.offsetX,t.offsetY);if(i){var n=i.node;if(n.getLayout().isLeafRoot)this._rootToNode(i);else if("zoomToNode"===e)this._zoomToNode(i);else if("link"===e){var a=n.hostTree.data.getItemModel(n.dataIndex),o=a.get("link",!0),r=a.get("target",!0)||"blank";o&&window.open(o,r)}}}}},this)},_renderBreadcrumb:function(t,e,i){function n(e){"animating"!==this._state&&(u.aboveViewRoot(t.getViewRoot(),e)?this._rootToNode({node:e}):this._zoomToNode({node:e}))}i||(i=null!=t.get("leafDepth",!0)?{node:t.getViewRoot()}:this.findTarget(e.getWidth()/2,e.getHeight()/2),i||(i={node:t.getData().tree.root})),(this._breadcrumb||(this._breadcrumb=new h(this.group))).render(t,e,i.node,g(n,this))},remove:function(){this._clearController(),this._containerGroup&&this._containerGroup.removeAll(),this._storage=n(),this._state="ready",this._breadcrumb&&this._breadcrumb.remove()},dispose:function(){this._clearController()},_zoomToNode:function(t){this.api.dispatchAction({type:"treemapZoomToNode",from:this.uid,seriesId:this.seriesModel.id,targetNode:t.node})},_rootToNode:function(t){this.api.dispatchAction({type:"treemapRootToNode",from:this.uid,seriesId:this.seriesModel.id,targetNode:t.node})},findTarget:function(t,e){var i,n=this.seriesModel.getViewRoot();return n.eachNode({attr:"viewChildren",order:"preorder"},function(n){var a=this._storage.background[n.getRawIndex()];if(a){var o=a.transformCoordToLocal(t,e),r=a.shape;if(!(r.x<=o[0]&&o[0]<=r.x+r.width&&r.y<=o[1]&&o[1]<=r.y+r.height))return!1;i={node:n,offsetX:o[0],offsetY:o[1]}}},this),i}})},function(t,e,i){for(var n=i(2),a=i(99),o=function(){},r=["treemapZoomToNode","treemapRender","treemapMove"],s=0;s<r.length;s++)n.registerAction({type:r[s],update:"updateView"},o);n.registerAction({type:"treemapRootToNode",update:"updateView"},function(t,e){function i(e,i){var n=a.retrieveTargetInfo(t,e);if(n){var o=e.getViewRoot();o&&(t.direction=a.aboveViewRoot(o,n.node)?"rollUp":"drillDown"),e.resetViewRoot(n.node)}}e.eachComponent({mainType:"series",subType:"treemap",query:t},i)})},function(t,e,i){function n(t,e,i){var n={mainType:"series",subType:"treemap",query:i};t.eachComponent(n,function(t){var n=e.getWidth(),o=e.getHeight(),r=t.option,s=v.getLayoutRect(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()}),l=r.size||[],u=w(S(s.width,l[0]),n),h=w(S(s.height,l[1]),o),p=i&&i.type,m=y.retrieveTargetInfo(i,t),_="treemapRender"===p||"treemapMove"===p?i.rootRect:null,b=t.getViewRoot(),I=y.getPathToRoot(b);if("treemapMove"!==p){var T="treemapZoomToNode"===p?c(t,m,b,u,h):_?[_.width,_.height]:[u,h],A=r.sort;A&&"asc"!==A&&"desc"!==A&&(A="desc");var C={squareRatio:r.squareRatio,sort:A,leafDepth:r.leafDepth};b.hostTree.clearLayouts();var L={x:0,y:0,width:T[0],height:T[1],area:T[0]*T[1]};b.setLayout(L),a(b,C,!1,0);var L=b.getLayout();M(I,function(t,e){var i=(I[e+1]||b).getValue();t.setLayout(g.extend({dataExtent:[i,i],borderWidth:0,upperHeight:0},L))})}var D=t.getData().tree.root;D.setLayout(d(s,_,m),!0),t.setLayoutInfo(s),f(D,new x(-s.x,-s.y,n,o),I,b,0)})}function a(t,e,i,n){var r,s;if(!t.isRemoved()){var l=t.getLayout();r=l.width,s=l.height;var c=t.getModel(),d=c.get(I),f=c.get(T)/2,g=p(c),m=Math.max(d,g),v=d-f,y=m-f,c=t.getModel();t.setLayout({borderWidth:d,upperHeight:m,upperLabelHeight:g},!0),r=_(r-2*v,0),s=_(s-v-y,0);var x=r*s,w=o(t,c,x,e,i,n);if(w.length){var S={x:v,y:y,width:r,height:s},M=b(r,s),A=1/0,C=[];C.area=0;for(var L=0,D=w.length;L<D;){var P=w[L];C.push(P),C.area+=P.getLayout().area;var k=u(C,M,e.squareRatio);k<=A?(L++,A=k):(C.area-=C.pop().getLayout().area,h(C,M,S,f,!1),M=b(S.width,S.height),C.length=C.area=0,A=1/0)}if(C.length&&h(C,M,S,f,!0),!i){var O=c.get("childrenVisibleMin");null!=O&&x<O&&(i=!0)}for(var L=0,D=w.length;L<D;L++)a(w[L],e,i,n+1)}}}function o(t,e,i,n,a,o){var u=t.children||[],h=n.sort;"asc"!==h&&"desc"!==h&&(h=null);var c=null!=n.leafDepth&&n.leafDepth<=o;if(a&&!c)return t.viewChildren=[];u=g.filter(u,function(t){return!t.isRemoved()}),s(u,h);var d=l(e,u,h);if(0===d.sum)return t.viewChildren=[];if(d.sum=r(e,i,d.sum,h,u),0===d.sum)return t.viewChildren=[];for(var f=0,p=u.length;f<p;f++){var m=u[f].getValue()/d.sum*i;u[f].setLayout({area:m})}return c&&(u.length&&t.setLayout({isLeafRoot:!0},!0),u.length=0),t.viewChildren=u,t.setLayout({dataExtent:d.dataExtent},!0),u}function r(t,e,i,n,a){if(!n)return i;for(var o=t.get("visibleMin"),r=a.length,s=r,l=r-1;l>=0;l--){var u=a["asc"===n?r-l-1:l].getValue();u/i*e<o&&(s=l,i-=u)}return"asc"===n?a.splice(0,r-s):a.splice(s,r-s),i}function s(t,e){return e&&t.sort(function(t,i){var n="asc"===e?t.getValue()-i.getValue():i.getValue()-t.getValue();return 0===n?"asc"===e?t.dataIndex-i.dataIndex:i.dataIndex-t.dataIndex:n}),t}function l(t,e,i){for(var n=0,a=0,o=e.length;a<o;a++)n+=e[a].getValue();var r,s=t.get("visualDimension");if(e&&e.length)if("value"===s&&i)r=[e[e.length-1].getValue(),e[0].getValue()],"asc"===i&&r.reverse();else{var r=[1/0,-(1/0)];M(e,function(t){var e=t.getValue(s);e<r[0]&&(r[0]=e),e>r[1]&&(r[1]=e)})}else r=[NaN,NaN];return{sum:n,dataExtent:r}}function u(t,e,i){for(var n,a=0,o=1/0,r=0,s=t.length;r<s;r++)n=t[r].getLayout().area,n&&(n<o&&(o=n),n>a&&(a=n));var l=t.area*t.area,u=e*e*i;return l?_(u*a/l,l/(u*o)):1/0}function h(t,e,i,n,a){var o=e===i.width?0:1,r=1-o,s=["x","y"],l=["width","height"],u=i[s[o]],h=e?t.area/e:0;(a||h>i[l[r]])&&(h=i[l[r]]);for(var c=0,d=t.length;c<d;c++){var f=t[c],p={},g=h?f.getLayout().area/h:0,m=p[l[r]]=_(h-2*n,0),v=i[s[o]]+i[l[o]]-u,y=c===d-1||v<g?v:g,x=p[l[o]]=_(y-2*n,0);p[s[r]]=i[s[r]]+b(n,m/2),p[s[o]]=u+b(n,x/2),u+=y,f.setLayout(p,!0)}i[s[r]]+=h,i[l[r]]-=h}function c(t,e,i,n,a){var o=(e||{}).node,r=[n,a];if(!o||o===i)return r;for(var s,l=n*a,u=l*t.option.zoomToNodeRatio;s=o.parentNode;){for(var h=0,c=s.children,d=0,f=c.length;d<f;d++)h+=c[d].getValue();var g=o.getValue();if(0===g)return r;u*=h/g;var v=s.getModel(),y=v.get(I),x=Math.max(y,p(v,y));u+=4*y*y+(3*y+x)*Math.pow(u,.5),u>m.MAX_SAFE_INTEGER&&(u=m.MAX_SAFE_INTEGER),o=s}u<l&&(u=l);var _=Math.pow(u/l,.5);return[n*_,a*_]}function d(t,e,i){if(e)return{x:e.x,y:e.y};var n={x:0,y:0};if(!i)return n;var a=i.node,o=a.getLayout();if(!o)return n;for(var r=[o.width/2,o.height/2],s=a;s;){var l=s.getLayout();r[0]+=l.x,r[1]+=l.y,s=s.parentNode}return{x:t.width/2-r[0],y:t.height/2-r[1]}}function f(t,e,i,n,a){var o=t.getLayout(),r=i[a],s=r&&r===t;if(!(r&&!s||a===i.length&&t!==n)){t.setLayout({isInView:!0,invisible:!s&&!e.intersect(o),isAboveViewRoot:s},!0);var l=new x(e.x-o.x,e.y-o.y,e.width,e.height);M(t.viewChildren||[],function(t){f(t,l,i,n,a+1)})}}function p(t){return t.get(A)?t.get(C):0}var g=i(1),m=i(4),v=i(9),y=i(99),x=i(12),y=i(99),_=Math.max,b=Math.min,w=m.parsePercent,S=g.retrieve,M=g.each,I=["itemStyle","normal","borderWidth"],T=["itemStyle","normal","gapWidth"],A=["upperLabel","normal","show"],C=["upperLabel","normal","height"];t.exports=n},function(t,e,i){function n(t,e,i,s,u,c){var d=t.getModel(),p=t.getLayout();if(p&&!p.invisible&&p.isInView){var m,v=t.getModel(g),y=i[t.depth],x=a(v,e,y,s),_=v.get("borderColor"),b=v.get("borderColorSaturation");null!=b&&(m=o(x,t),_=r(b,m)),t.setVisual("borderColor",_);var w=t.viewChildren;if(w&&w.length){var S=l(t,d,p,v,x,w);f.each(w,function(t,e){if(t.depth>=u.length||t===u[t.depth]){var a=h(d,x,t,e,S,c);n(t,a,i,s,u,c)}})}else m=o(x,t),t.setVisual("color",m)}}function a(t,e,i,n){var a=f.extend({},e);return f.each(["color","colorAlpha","colorSaturation"],function(o){var r=t.get(o,!0);null==r&&i&&(r=i[o]),null==r&&(r=e[o]),null==r&&(r=n.get(o)),null!=r&&(a[o]=r)}),a}function o(t){var e=s(t,"color");if(e){var i=s(t,"colorAlpha"),n=s(t,"colorSaturation");return n&&(e=d.modifyHSL(e,null,null,n)),i&&(e=d.modifyAlpha(e,i)),e}}function r(t,e){return null!=e?d.modifyHSL(e,null,null,t):null}function s(t,e){var i=t[e];if(null!=i&&"none"!==i)return i}function l(t,e,i,n,a,o){if(o&&o.length){var r=u(e,"color")||null!=a.color&&"none"!==a.color&&(u(e,"colorAlpha")||u(e,"colorSaturation"));if(r){var s=e.get("visualMin"),l=e.get("visualMax"),h=i.dataExtent.slice();null!=s&&s<h[0]&&(h[0]=s),null!=l&&l>h[1]&&(h[1]=l);var d=e.get("colorMappingBy"),f={type:r.name,dataExtent:h,visual:r.range};"color"!==f.type||"index"!==d&&"id"!==d?f.mappingMethod="linear":(f.mappingMethod="category",f.loop=!0);var p=new c(f);return p.__drColorMappingBy=d,p}}}function u(t,e){var i=t.get(e);return p(i)&&i.length?{name:e,range:i}:null}function h(t,e,i,n,a,o){var r=f.extend({},e);if(a){var s=a.type,l="color"===s&&a.__drColorMappingBy,u="index"===l?n:"id"===l?o.mapIdToIndex(i.getId()):i.getValue(t.get("visualDimension"));r[s]=a.mapValueToVisual(u)}return r}var c=i(88),d=i(22),f=i(1),p=f.isArray,g="itemStyle.normal";t.exports=function(t,e,i){var a={mainType:"series",subType:"treemap",query:i};t.eachComponent(a,function(t){var e=t.getData().tree,i=e.root,a=t.getModel(g);if(!i.isRemoved()){var o=f.map(e.levelModels,function(t){return t?t.get(g):null});n(i,{},o,a,t.getViewRoot().getAncestors(),t)}})}},function(t,e,i){"use strict";i(244),i(362)},function(t,e,i){"use strict";function n(t,e,i,n){var a=t.coordToPoint([e,n]),o=t.coordToPoint([i,n]);return{x1:a[0],y1:a[1],x2:o[0],y2:o[1]}}var a=i(1),o=i(3),r=i(11),s=["axisLine","axisLabel","axisTick","splitLine","splitArea"];i(41).extend({type:"angleAxis",axisPointerClass:"PolarAxisPointer",render:function(t,e){if(this.group.removeAll(),t.get("show")){var i=t.axis,n=i.polar,o=n.getRadiusAxis().getExtent(),r=i.getTicksCoords();"category"!==i.type&&r.pop(),a.each(s,function(e){!t.get(e+".show")||i.scale.isBlank()&&"axisLine"!==e||this["_"+e](t,n,r,o)},this)}},_axisLine:function(t,e,i,n){var a=t.getModel("axisLine.lineStyle"),r=new o.Circle({shape:{cx:e.cx,cy:e.cy,r:n[1]},style:a.getLineStyle(),z2:1,silent:!0});r.style.fill=null,this.group.add(r)},_axisTick:function(t,e,i,r){var s=t.getModel("axisTick"),l=(s.get("inside")?-1:1)*s.get("length"),u=a.map(i,function(t){return new o.Line({shape:n(e,r[1],r[1]+l,t)})});this.group.add(o.mergePath(u,{style:a.defaults(s.getModel("lineStyle").getLineStyle(),{stroke:t.get("axisLine.lineStyle.color")})}))},_axisLabel:function(t,e,i,n){for(var a=t.axis,s=t.get("data"),l=t.getModel("axisLabel"),u=t.getFormattedLabels(),h=l.get("margin"),c=a.getLabelsCoords(),d=0;d<i.length;d++){var f=n[1],p=e.coordToPoint([f+h,c[d]]),g=e.cx,m=e.cy,v=Math.abs(p[0]-g)/f<.3?"center":p[0]>g?"left":"right",y=Math.abs(p[1]-m)/f<.3?"middle":p[1]>m?"top":"bottom";s&&s[d]&&s[d].textStyle&&(l=new r(s[d].textStyle,l,l.ecModel));var x=new o.Text({silent:!0});this.group.add(x),o.setTextStyle(x.style,l,{x:p[0],y:p[1],textFill:l.getTextColor()||t.get("axisLine.lineStyle.color"),text:u[d],textAlign:v,textVerticalAlign:y})}},_splitLine:function(t,e,i,r){var s=t.getModel("splitLine"),l=s.getModel("lineStyle"),u=l.get("color"),h=0;u=u instanceof Array?u:[u];for(var c=[],d=0;d<i.length;d++){var f=h++%u.length;c[f]=c[f]||[],c[f].push(new o.Line({shape:n(e,r[0],r[1],i[d])}))}for(var d=0;d<c.length;d++)this.group.add(o.mergePath(c[d],{style:a.defaults({stroke:u[d%u.length]},l.getLineStyle()),silent:!0,z:t.get("z")}))},_splitArea:function(t,e,i,n){var r=t.getModel("splitArea"),s=r.getModel("areaStyle"),l=s.get("color"),u=0;l=l instanceof Array?l:[l];for(var h=[],c=Math.PI/180,d=-i[0]*c,f=Math.min(n[0],n[1]),p=Math.max(n[0],n[1]),g=t.get("clockwise"),m=1;m<i.length;m++){var v=u++%l.length;h[v]=h[v]||[],h[v].push(new o.Sector({shape:{cx:e.cx,cy:e.cy,r0:f,r:p,startAngle:d,endAngle:-i[m]*c,clockwise:g},silent:!0})),d=-i[m]*c}for(var m=0;m<h.length;m++)this.group.add(o.mergePath(h[m],{style:a.defaults({fill:l[m%l.length]},s.getAreaStyle()),silent:!0}))}})},function(t,e,i){function n(t,e,i){return i&&"axisAreaSelect"===i.type&&e.findComponents({mainType:"parallelAxis",query:i})[0]===t}function a(t){var e=t.axis;return r.map(t.activeIntervals,function(t){return{brushType:"lineX",panelId:"pl",range:[e.dataToCoord(t[0],!0),e.dataToCoord(t[1],!0)]}})}function o(t,e){return e.getComponent("parallel",t.get("parallelIndex"))}var r=i(1),s=i(40),l=i(132),u=i(191),h=i(3),c=["axisLine","axisTickLabel","axisName"],d=i(2).extendComponentView({type:"parallelAxis",init:function(t,e){d.superApply(this,"init",arguments),(this._brushController=new l(e.getZr())).on("brush",r.bind(this._onBrush,this))},render:function(t,e,i,a){if(!n(t,e,a)){this.axisModel=t,this.api=i,this.group.removeAll();var l=this._axisGroup;if(this._axisGroup=new h.Group,this.group.add(this._axisGroup),t.get("show")){var u=o(t,e),d=u.coordinateSystem,f=t.getAreaSelectStyle(),p=f.width,g=t.axis.dim,m=d.getAxisLayout(g),v=r.extend({strokeContainThreshold:p},m),y=new s(t,v);r.each(c,y.add,y),this._axisGroup.add(y.getGroup()),this._refreshBrushController(v,f,t,u,p,i);var x=a&&a.animation===!1?null:t;h.groupTransition(l,this._axisGroup,x)}}},updateVisual:function(t,e,i,n){this._brushController&&this._brushController.updateCovers(a(t))},_refreshBrushController:function(t,e,i,n,o,r){var s=i.axis.getExtent(),l=s[1]-s[0],c=Math.min(30,.1*Math.abs(l)),d=h.BoundingRect.create({x:s[0],y:-o/2,width:l,height:o});d.x-=c,d.width+=2*c,this._brushController.mount({enableGlobalPan:!0,rotation:t.rotation,position:t.position}).setPanels([{panelId:"pl",clipPath:u.makeRectPanelClipPath(d),isTargetByCursor:u.makeRectIsTargetByCursor(d,r,n),getLinearBrushOtherExtent:u.makeLinearBrushOtherExtent(d,0)}]).enableBrush({brushType:"lineX",brushStyle:e,removeOnClick:!0}).updateCovers(a(i))},_onBrush:function(t,e){var i=this.axisModel,n=i.axis,a=r.map(t,function(t){return[n.coordToData(t.range[0],!0),n.coordToData(t.range[1],!0)]});(!i.option.realtime===e.isEnd||e.removeOnClick)&&this.api.dispatchAction({type:"axisAreaSelect",parallelAxisId:i.id,intervals:a})},dispose:function(){this._brushController.dispose()}});t.exports=d},function(t,e,i){"use strict";function n(t,e,i){return{position:[t.cx,t.cy],rotation:i/180*Math.PI,labelDirection:-1,tickDirection:-1,nameDirection:1,labelRotate:e.getModel("axisLabel").get("rotate"),z2:1}}var a=i(1),o=i(3),r=i(40),s=["axisLine","axisTickLabel","axisName"],l=["splitLine","splitArea"];i(41).extend({type:"radiusAxis",axisPointerClass:"PolarAxisPointer",render:function(t,e){if(this.group.removeAll(),t.get("show")){var i=t.axis,o=i.polar,u=o.getAngleAxis(),h=i.getTicksCoords(),c=u.getExtent()[0],d=i.getExtent(),f=n(o,t,c),p=new r(t,f);a.each(s,p.add,p),this.group.add(p.getGroup()),a.each(l,function(e){t.get(e+".show")&&!i.scale.isBlank()&&this["_"+e](t,o,c,d,h)},this)}},_splitLine:function(t,e,i,n,r){var s=t.getModel("splitLine"),l=s.getModel("lineStyle"),u=l.get("color"),h=0;u=u instanceof Array?u:[u];for(var c=[],d=0;d<r.length;d++){var f=h++%u.length;c[f]=c[f]||[],c[f].push(new o.Circle({shape:{cx:e.cx,cy:e.cy,r:r[d]},silent:!0}))}for(var d=0;d<c.length;d++)this.group.add(o.mergePath(c[d],{style:a.defaults({stroke:u[d%u.length],fill:null},l.getLineStyle()),silent:!0}))},_splitArea:function(t,e,i,n,r){var s=t.getModel("splitArea"),l=s.getModel("areaStyle"),u=l.get("color"),h=0;u=u instanceof Array?u:[u];for(var c=[],d=r[0],f=1;f<r.length;f++){var p=h++%u.length;c[p]=c[p]||[],c[p].push(new o.Sector({shape:{cx:e.cx,cy:e.cy,r0:d,r:r[f],startAngle:0,endAngle:2*Math.PI},silent:!0})),d=r[f]}for(var f=0;f<c.length;f++)this.group.add(o.mergePath(c[f],{style:a.defaults({fill:u[f%u.length]},l.getAreaStyle()),silent:!0}))}})},function(t,e,i){var n=i(40),a=i(1),o=i(3),r=i(256),s=n.getInterval,l=n.ifIgnoreOnTick,u=["axisLine","axisTickLabel","axisName"],h="splitLine",c=i(41).extend({type:"singleAxis",axisPointerClass:"SingleAxisPointer",render:function(t,e,i,o){var s=this.group;s.removeAll();var l=r.layout(t),d=new n(t,l);a.each(u,d.add,d),s.add(d.getGroup()),t.get(h+".show")&&this["_"+h](t,l.labelInterval),c.superCall(this,"render",t,e,i,o)},_splitLine:function(t,e){var i=t.axis;if(!i.scale.isBlank()){var n=t.getModel("splitLine"),a=n.getModel("lineStyle"),r=a.get("width"),u=a.get("color"),h=s(n,e);u=u instanceof Array?u:[u];for(var c=t.coordinateSystem.getRect(),d=i.isHorizontal(),f=[],p=0,g=i.getTicksCoords(),m=[],v=[],y=t.get("axisLabel.showMinLabel"),x=t.get("axisLabel.showMaxLabel"),_=0;_<g.length;++_)if(!l(i,_,h,g.length,y,x)){var b=i.toGlobalCoord(g[_]);d?(m[0]=b,m[1]=c.y,v[0]=b,v[1]=c.y+c.height):(m[0]=c.x,m[1]=b,v[0]=c.x+c.width,v[1]=b);var w=p++%u.length;f[w]=f[w]||[],f[w].push(new o.Line(o.subPixelOptimizeLine({shape:{x1:m[0],y1:m[1],x2:v[0],y2:v[1]},style:{lineWidth:r},silent:!0})))}for(var _=0;_<f.length;++_)this.group.add(o.mergePath(f[_],{style:{stroke:u[_%u.length],lineDash:a.getLineDash(r),lineWidth:r},silent:!0}))}}});t.exports=c},function(t,e,i){var n=i(2),a={type:"axisAreaSelect",event:"axisAreaSelected",update:"updateVisual"};n.registerAction(a,function(t,e){e.eachComponent({mainType:"parallelAxis",query:t},function(e){e.axis.model.setActiveIntervals(t.intervals)})}),n.registerAction("parallelAxisExpand",function(t,e){e.eachComponent({mainType:"parallel",query:t},function(e){e.setAxisExpand(t)})})},function(t,e,i){"use strict";function n(t,e,i,n,a){var o=e.axis,s=o.dataToCoord(t),h=n.getAngleAxis().getExtent()[0];h=h/180*Math.PI;var c,d,f,p=n.getRadiusAxis().getExtent();if("radius"===o.dim){var g=l.create();l.rotate(g,g,h),l.translate(g,g,[n.cx,n.cy]),c=r.applyTransform([s,-a],g);var m=e.getModel("axisLabel").get("rotate")||0,v=u.innerTextLayout(h,m*Math.PI/180,-1);d=v.textAlign,f=v.textVerticalAlign}else{var y=p[1];c=n.coordToPoint([y+a,s]);var x=n.cx,_=n.cy;d=Math.abs(c[0]-x)/y<.3?"center":c[0]>x?"left":"right",f=Math.abs(c[1]-_)/y<.3?"middle":c[1]>_?"top":"bottom"}return{position:c,align:d,verticalAlign:f}}var a=i(7),o=i(124),r=i(3),s=i(81),l=i(19),u=i(40),h=i(41),c=o.extend({makeElOption:function(t,e,i,o,r){var l=i.axis;"angle"===l.dim&&(this.animationThreshold=Math.PI/18);var u,h=l.polar,c=h.getOtherAxis(l),f=c.getExtent();u=l["dataTo"+a.capitalFirst(l.dim)](e);var p=o.get("type");if(p&&"none"!==p){var g=s.buildElStyle(o),m=d[p](l,h,u,f,g);m.style=g,t.graphicKey=m.type,t.pointer=m}var v=o.get("label.margin"),y=n(e,i,o,h,v);s.buildLabelElOption(t,i,o,r,y)}}),d={line:function(t,e,i,n,a){return"angle"===t.dim?{type:"Line",shape:s.makeLineShape(e.coordToPoint([n[0],i]),e.coordToPoint([n[1],i]))}:{type:"Circle",shape:{cx:e.cx,cy:e.cy,r:i}}},shadow:function(t,e,i,n,a){var o=t.getBandWidth(),r=Math.PI/180;return"angle"===t.dim?{type:"Sector",shape:s.makeSectorShape(e.cx,e.cy,n[0],n[1],(-i-o/2)*r,(-i+o/2)*r)}:{type:"Sector",shape:s.makeSectorShape(e.cx,e.cy,i-o/2,i+o/2,0,2*Math.PI)}}};h.registerAxisPointerClass("PolarAxisPointer",c),t.exports=c},function(t,e,i){"use strict";function n(t){return t.isHorizontal()?0:1}function a(t,e){var i=t.getRect();return[i[h[e]],i[h[e]]+i[c[e]]]}var o=i(3),r=i(124),s=i(81),l=i(256),u=i(41),h=["x","y"],c=["width","height"],d=r.extend({makeElOption:function(t,e,i,o,r){var u=i.axis,h=u.coordinateSystem,c=a(h,1-n(u)),d=h.dataToPoint(e)[0],p=o.get("type");if(p&&"none"!==p){var g=s.buildElStyle(o),m=f[p](u,d,c,g);m.style=g,t.graphicKey=m.type,t.pointer=m}var v=l.layout(i);s.buildCartesianSingleLabelElOption(e,t,v,i,o,r)},getHandleTransform:function(t,e,i){var n=l.layout(e,{labelInside:!1});return n.labelMargin=i.get("handle.margin"),{position:s.getTransformedPosition(e.axis,t,n),rotation:n.rotation+(n.labelDirection<0?Math.PI:0)}},updateHandleTransform:function(t,e,i,o){var r=i.axis,s=r.coordinateSystem,l=n(r),u=a(s,l),h=t.position;h[l]+=e[l],h[l]=Math.min(u[1],h[l]),h[l]=Math.max(u[0],h[l]);var c=a(s,1-l),d=(c[1]+c[0])/2,f=[d,d];return f[l]=h[l],{position:h,rotation:t.rotation,cursorPoint:f,tooltipOption:{verticalAlign:"middle"}}}}),f={line:function(t,e,i,a){var r=s.makeLineShape([e,i[0]],[e,i[1]],n(t));return o.subPixelOptimizeLine({shape:r,style:a}),{type:"Line",shape:r}},shadow:function(t,e,i,a){var o=t.getBandWidth(),r=i[1]-i[0];return{type:"Rect",shape:s.makeRectShape([e-o/2,i[0]],[o,r],n(t))}}};u.registerAxisPointerClass("SingleAxisPointer",d),t.exports=d},function(t,e,i){i(2).registerPreprocessor(i(373)),i(375),i(370),i(371),i(372),i(394)},function(t,e,i){function n(t,e){return o.merge({brushType:t.brushType,brushMode:t.brushMode,transformable:t.transformable,brushStyle:new s(t.brushStyle).getItemStyle(),removeOnClick:t.removeOnClick,z:t.z},e,!0)}var a=i(2),o=i(1),r=i(193),s=i(11),l=["#ddd"],u=a.extendComponentModel({type:"brush",dependencies:["geo","grid","xAxis","yAxis","parallel","series"],defaultOption:{toolbox:null,brushLink:null,seriesIndex:"all",geoIndex:null,xAxisIndex:null,yAxisIndex:null,brushType:"rect",brushMode:"single",transformable:!0,brushStyle:{borderWidth:1,color:"rgba(120,140,180,0.3)",borderColor:"rgba(120,140,180,0.8)"},throttleType:"fixRate",throttleDelay:0,removeOnClick:!0,z:1e4},areas:[],brushType:null,brushOption:{},coordInfoList:[],optionUpdated:function(t,e){var i=this.option;!e&&r.replaceVisualOption(i,t,["inBrush","outOfBrush"]),i.inBrush=i.inBrush||{},i.outOfBrush=i.outOfBrush||{color:l}},setAreas:function(t){t&&(this.areas=o.map(t,function(t){return n(this.option,t)},this))},setBrushOption:function(t){this.brushOption=n(this.option,t),this.brushType=this.brushOption.brushType}});t.exports=u},function(t,e,i){function n(t,e,i,n){(!n||n.$from!==t.id)&&this._brushController.setPanels(t.brushTargetManager.makePanelOpts(i)).enableBrush(t.brushOption).updateCovers(t.areas.slice())}var a=i(1),o=i(132),r=i(2);t.exports=r.extendComponentView({type:"brush",init:function(t,e){this.ecModel=t,this.api=e,this.model,(this._brushController=new o(e.getZr())).on("brush",a.bind(this._onBrush,this)).mount()},render:function(t){return this.model=t,n.apply(this,arguments)},updateView:n,updateLayout:n,updateVisual:n,dispose:function(){this._brushController.dispose()},_onBrush:function(t,e){var i=this.model.id;this.model.brushTargetManager.setOutputRanges(t,this.ecModel),(!e.isEnd||e.removeOnClick)&&this.api.dispatchAction({type:"brush",brushId:i,areas:a.clone(t),$from:i})}})},function(t,e,i){var n=i(2);n.registerAction({type:"brush",event:"brush",update:"updateView"},function(t,e){e.eachComponent({mainType:"brush",query:t},function(e){e.setAreas(t.areas)})}),n.registerAction({type:"brushSelect",event:"brushSelected",update:"none"},function(){})},function(t,e,i){function n(t){var e={};a.each(t,function(t){e[t]=1}),t.length=0,a.each(e,function(e,i){t.push(i)})}var a=i(1),o=["rect","polygon","keep","clear"];t.exports=function(t,e){var i=t&&t.brush;if(a.isArray(i)||(i=i?[i]:[]),i.length){var r=[];a.each(i,function(t){var e=t.hasOwnProperty("toolbox")?t.toolbox:[];e instanceof Array&&(r=r.concat(e))});var s=t&&t.toolbox;a.isArray(s)&&(s=s[0]),s||(s={feature:{}},t.toolbox=[s]);var l=s.feature||(s.feature={}),u=l.brush||(l.brush={}),h=u.type||(u.type=[]);h.push.apply(h,r),n(h),e&&!h.length&&h.push.apply(h,o)}}},function(t,e,i){function n(t){var e=["x","y"],i=["width","height"];return{point:function(e,i,n){var o=n.range,r=e[t];return a(r,o)},rect:function(n,o,r){var s=r.range,l=[n[e[t]],n[e[t]]+n[i[t]]];return l[1]<l[0]&&l.reverse(),a(l[0],s)||a(l[1],s)||a(s[0],l)||a(s[1],l)}}}function a(t,e){return e[0]<=t&&t<=e[1]}function o(t,e,i,n,a){for(var o=0,s=a[a.length-1];o<a.length;o++){var l=a[o];if(r(t,e,i,n,l[0],l[1],s[0],s[1]))return!0;s=l}}function r(t,e,i,n,a,o,r,u){var h=l(i-t,a-r,n-e,o-u);if(s(h))return!1;var c=l(a-t,a-r,o-e,o-u)/h;if(c<0||c>1)return!1;
var d=l(i-t,a-t,n-e,o-e)/h;return!(d<0||d>1)}function s(t){return t<=1e-6&&t>=-1e-6}function l(t,e,i,n){return t*n-e*i}var u=i(275).contain,h=i(12),c={lineX:n(0),lineY:n(1),rect:{point:function(t,e,i){return i.boundingRect.contain(t[0],t[1])},rect:function(t,e,i){return i.boundingRect.intersect(t)}},polygon:{point:function(t,e,i){return i.boundingRect.contain(t[0],t[1])&&u(i.range,t[0],t[1])},rect:function(t,e,i){var n=i.range;if(n.length<=1)return!1;var a=t.x,r=t.y,s=t.width,l=t.height,c=n[0];return!!(u(n,a,r)||u(n,a+s,r)||u(n,a,r+l)||u(n,a+s,r+l)||h.create(t).contain(c[0],c[1])||o(a,r,a+s,r,n)||o(a,r,a,r+l,n)||o(a+s,r,a+s,r+l,n)||o(a,r+l,a+s,r+l,n))||void 0}}};t.exports=c},function(t,e,i){function n(t,e,i,n,o){if(o){var r=t.getZr();if(!r[x]){r[y]||(r[y]=a);var s=g.createOrUpdate(r,y,i,e);s(t,n)}}}function a(t,e){if(!t.isDisposed()){var i=t.getZr();i[x]=!0,t.dispatchAction({type:"brushSelect",batch:e}),i[x]=!1}}function o(t,e,i,n){for(var a=0,o=e.length;a<o;a++){var r=e[a];if(t[r.brushType](n,i,r.selectors,r))return!0}}function r(t){var e=t.brushSelector;if(d.isString(e)){var i=[];return d.each(p,function(t,n){i[n]=function(i,n,a,o){var r=n.getItemLayout(i);return t[e](r,a,o)}}),i}if(d.isFunction(e)){var n={};return d.each(p,function(t,i){n[i]=e}),n}return e}function s(t,e){var i=t.option.seriesIndex;return null!=i&&"all"!==i&&(d.isArray(i)?d.indexOf(i,e)<0:e!==i)}function l(t){var e=t.selectors={};return d.each(p[t.brushType],function(i,n){e[n]=function(n){return i(n,e,t)}}),t}function u(t){return new f(t[0][0],t[1][0],t[0][1]-t[0][0],t[1][1]-t[1][0])}var h=i(2),c=i(193),d=i(1),f=i(12),p=i(374),g=i(37),m=i(190),v=["inBrush","outOfBrush"],y="__ecBrushSelect",x="__ecInBrushSelectEvent",_=h.PRIORITY.VISUAL.BRUSH;h.registerLayout(_,function(t,e,i){t.eachComponent({mainType:"brush"},function(e){i&&"takeGlobalCursor"===i.type&&e.setBrushOption("brush"===i.key?i.brushOption:{brushType:!1});var n=e.brushTargetManager=new m(e.option,t);n.setInputRanges(e.areas,t)})}),h.registerVisual(_,function(t,e,i){var a,u,h=[];t.eachComponent({mainType:"brush"},function(e,i){function n(t){return"all"===x||_[t]}function f(t){return!!t.length}function p(t,e){var i=t.coordinateSystem;M|=i.hasAxisBrushed(),n(e)&&i.eachActiveState(t.getData(),function(t,e){"active"===t&&(w[e]=1)})}function g(i,a,l){var u=r(i);if(u&&!s(e,a)&&(d.each(I,function(n){u[n.brushType]&&e.brushTargetManager.controlSeries(n,i,t)&&l.push(n),M|=f(l)}),n(a)&&f(l))){var h=i.getData();h.each(function(t){o(u,l,h,t)&&(w[t]=1)})}}var m={brushId:e.id,brushIndex:i,brushName:e.name,areas:d.clone(e.areas),selected:[]};h.push(m);var y=e.option,x=y.brushLink,_=[],w=[],S=[],M=0;i||(a=y.throttleType,u=y.throttleDelay);var I=d.map(e.areas,function(t){return l(d.defaults({boundingRect:b[t.brushType](t)},t))}),T=c.createVisualMappings(e.option,v,function(t){t.mappingMethod="fixed"});d.isArray(x)&&d.each(x,function(t){_[t]=1}),t.eachSeries(function(t,e){var i=S[e]=[];"parallel"===t.subType?p(t,e,i):g(t,e,i)}),t.eachSeries(function(t,e){var i={seriesId:t.id,seriesIndex:e,seriesName:t.name,dataIndex:[]};m.selected.push(i);var a=r(t),s=S[e],l=t.getData(),u=n(e)?function(t){return w[t]?(i.dataIndex.push(l.getRawIndex(t)),"inBrush"):"outOfBrush"}:function(t){return o(a,s,l,t)?(i.dataIndex.push(l.getRawIndex(t)),"inBrush"):"outOfBrush"};(n(e)?M:f(s))&&c.applyVisual(v,T,l,u)})}),n(e,a,u,h,i)});var b={lineX:d.noop,lineY:d.noop,rect:function(t){return u(t.range)},polygon:function(t){for(var e,i=t.range,n=0,a=i.length;n<a;n++){e=e||[[1/0,-(1/0)],[1/0,-(1/0)]];var o=i[n];o[0]<e[0][0]&&(e[0][0]=o[0]),o[0]>e[0][1]&&(e[0][1]=o[0]),o[1]<e[1][0]&&(e[1][0]=o[1]),o[1]>e[1][1]&&(e[1][1]=o[1])}return e&&u(e)}}},function(t,e,i){"use strict";i(402),i(403),i(377)},function(t,e,i){"use strict";var n=i(1),a=i(3),o=i(7),r=i(4),s={EN:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],CN:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"]},l={EN:["S","M","T","W","T","F","S"],CN:["日","一","二","三","四","五","六"]};t.exports=i(2).extendComponentView({type:"calendar",_tlpoints:null,_blpoints:null,_firstDayOfMonth:null,_firstDayPoints:null,render:function(t,e,i){var n=this.group;n.removeAll();var a=t.coordinateSystem,o=a.getRangeInfo(),r=a.getOrient();this._renderDayRect(t,o,n),this._renderLines(t,o,r,n),this._renderYearText(t,o,r,n),this._renderMonthText(t,r,n),this._renderWeekText(t,o,r,n)},_renderDayRect:function(t,e,i){for(var n=t.coordinateSystem,o=t.getModel("itemStyle.normal").getItemStyle(),r=n.getCellWidth(),s=n.getCellHeight(),l=e.start.time;l<=e.end.time;l=n.getNextNDay(l,1).time){var u=n.dataToRect([l],!1).tl,h=new a.Rect({shape:{x:u[0],y:u[1],width:r,height:s},cursor:"default",style:o});i.add(h)}},_renderLines:function(t,e,i,n){function a(e){o._firstDayOfMonth.push(r.getDateInfo(e)),o._firstDayPoints.push(r.dataToRect([e],!1).tl);var a=o._getLinePointsOfOneWeek(t,e,i);o._tlpoints.push(a[0]),o._blpoints.push(a[a.length-1]),l&&o._drawSplitline(a,s,n)}var o=this,r=t.coordinateSystem,s=t.getModel("splitLine.lineStyle").getLineStyle(),l=t.get("splitLine.show"),u=s.lineWidth;this._tlpoints=[],this._blpoints=[],this._firstDayOfMonth=[],this._firstDayPoints=[];for(var h=e.start,c=0;h.time<=e.end.time;c++){a(h.formatedDate),0===c&&(h=r.getDateInfo(e.start.y+"-"+e.start.m));var d=h.date;d.setMonth(d.getMonth()+1),h=r.getDateInfo(d)}a(r.getNextNDay(e.end.time,1).formatedDate),l&&this._drawSplitline(o._getEdgesPoints(o._tlpoints,u,i),s,n),l&&this._drawSplitline(o._getEdgesPoints(o._blpoints,u,i),s,n)},_getEdgesPoints:function(t,e,i){var n=[t[0].slice(),t[t.length-1].slice()],a="horizontal"===i?0:1;return n[0][a]=n[0][a]-e/2,n[1][a]=n[1][a]+e/2,n},_drawSplitline:function(t,e,i){var n=new a.Polyline({z2:20,shape:{points:t},style:e});i.add(n)},_getLinePointsOfOneWeek:function(t,e,i){var n=t.coordinateSystem;e=n.getDateInfo(e);for(var a=[],o=0;o<7;o++){var r=n.getNextNDay(e.time,o),s=n.dataToRect([r.time],!1);a[2*r.day]=s.tl,a[2*r.day+1]=s["horizontal"===i?"bl":"tr"]}return a},_formatterLabel:function(t,e){return"string"==typeof t&&t?o.formatTplSimple(t,e):"function"==typeof t?t(e):e.nameMap},_yearTextPositionControl:function(t,e,i,n,a){e=e.slice();var o=["center","bottom"];"bottom"===n?(e[1]+=a,o=["center","top"]):"left"===n?e[0]-=a:"right"===n?(e[0]+=a,o=["center","top"]):e[1]-=a;var r=0;return"left"!==n&&"right"!==n||(r=Math.PI/2),{rotation:r,position:e,style:{textAlign:o[0],textVerticalAlign:o[1]}}},_renderYearText:function(t,e,i,n){var o=t.getModel("yearLabel");if(o.get("show")){var r=o.get("margin"),s=o.get("position");s||(s="horizontal"!==i?"top":"left");var l=[this._tlpoints[this._tlpoints.length-1],this._blpoints[0]],u=(l[0][0]+l[1][0])/2,h=(l[0][1]+l[1][1])/2,c="horizontal"===i?0:1,d={top:[u,l[c][1]],bottom:[u,l[1-c][1]],left:[l[1-c][0],h],right:[l[c][0],h]},f=e.start.y;+e.end.y>+e.start.y&&(f=f+"-"+e.end.y);var p=o.get("formatter"),g={start:e.start.y,end:e.end.y,nameMap:f},m=this._formatterLabel(p,g),v=new a.Text({z2:30});a.setTextStyle(v.style,o,{text:m}),v.attr(this._yearTextPositionControl(v,d[s],i,s,r)),n.add(v)}},_monthTextPositionControl:function(t,e,i,n,a){var o="left",r="top",s=t[0],l=t[1];return"horizontal"===i?(l+=a,e&&(o="center"),"start"===n&&(r="bottom")):(s+=a,e&&(r="middle"),"start"===n&&(o="right")),{x:s,y:l,textAlign:o,textVerticalAlign:r}},_renderMonthText:function(t,e,i){var o=t.getModel("monthLabel");if(o.get("show")){var r=o.get("nameMap"),l=o.get("margin"),u=o.get("position"),h=o.get("align"),c=[this._tlpoints,this._blpoints];n.isString(r)&&(r=s[r.toUpperCase()]||[]);var d="start"===u?0:1,f="horizontal"===e?0:1;l="start"===u?-l:l;for(var p="center"===h,g=0;g<c[d].length-1;g++){var m=c[d][g].slice(),v=this._firstDayOfMonth[g];if(p){var y=this._firstDayPoints[g];m[f]=(y[f]+c[0][g+1][f])/2}var x=o.get("formatter"),_=r[+v.m-1],b={yyyy:v.y,yy:(v.y+"").slice(2),MM:v.m,M:+v.m,nameMap:_},w=this._formatterLabel(x,b),S=new a.Text({z2:30});n.extend(a.setTextStyle(S.style,o,{text:w}),this._monthTextPositionControl(m,p,e,u,l)),i.add(S)}}},_weekTextPositionControl:function(t,e,i,n,a){var o="center",r="middle",s=t[0],l=t[1],u="start"===i;return"horizontal"===e?(s=s+n+(u?1:-1)*a[0]/2,o=u?"right":"left"):(l=l+n+(u?1:-1)*a[1]/2,r=u?"bottom":"top"),{x:s,y:l,textAlign:o,textVerticalAlign:r}},_renderWeekText:function(t,e,i,o){var s=t.getModel("dayLabel");if(s.get("show")){var u=t.coordinateSystem,h=s.get("position"),c=s.get("nameMap"),d=s.get("margin"),f=u.getFirstDayOfWeek();n.isString(c)&&(c=l[c.toUpperCase()]||[]);var p=u.getNextNDay(e.end.time,7-e.lweek).time,g=[u.getCellWidth(),u.getCellHeight()];d=r.parsePercent(d,g["horizontal"===i?0:1]),"start"===h&&(p=u.getNextNDay(e.start.time,-(7+e.fweek)).time,d=-d);for(var m=0;m<7;m++){var v=u.getNextNDay(p,m),y=u.dataToRect([v.time],!1).center,x=m;x=Math.abs((m+f)%7);var _=new a.Text({z2:30});n.extend(a.setTextStyle(_.style,s,{text:c[x]}),this._weekTextPositionControl(y,i,h,d,g)),o.add(_)}}}})},function(t,e,i){function n(t,e){e.update="updateView",a.registerAction(e,function(e,i){var n={};return i.eachComponent({mainType:"geo",query:e},function(i){i[t](e.name);var a=i.coordinateSystem;o.each(a.regions,function(t){n[t.name]=i.isSelected(t.name)||!1})}),{selected:n,name:e.name}})}i(407),i(192),i(379),i(248);var a=i(2),o=i(1);n("toggleSelected",{type:"geoToggleSelect",event:"geoselectchanged"}),n("select",{type:"geoSelect",event:"geoselected"}),n("unSelect",{type:"geoUnSelect",event:"geounselected"})},function(t,e,i){"use strict";var n=i(257);t.exports=i(2).extendComponentView({type:"geo",init:function(t,e){var i=new n(e,!0);this._mapDraw=i,this.group.add(i.group)},render:function(t,e,i,n){if(!n||"geoToggleSelect"!==n.type||n.from!==this.uid){var a=this._mapDraw;t.get("show")?a.draw(t,e,i,this,n):this._mapDraw.group.removeAll(),this.group.silent=t.get("silent")}},dispose:function(){this._mapDraw&&this._mapDraw.remove()}})},function(t,e,i){i(271),i(366),i(363)},function(t,e,i){"use strict";var n=i(1);i(244),i(361),i(384),i(58),i(367),i(2).registerLayout(n.curry(i(434),"bar")),i(2).extendComponentView({type:"polar"})},function(t,e,i){i(425),i(426),i(383)},function(t,e,i){var n=i(40),a=i(1),o=i(3),r=["axisLine","axisTickLabel","axisName"];t.exports=i(2).extendComponentView({type:"radar",render:function(t,e,i){var n=this.group;n.removeAll(),this._buildAxes(t),this._buildSplitLineAndArea(t)},_buildAxes:function(t){var e=t.coordinateSystem,i=e.getIndicatorAxes(),o=a.map(i,function(t){var i=new n(t.model,{position:[e.cx,e.cy],rotation:t.angle,labelDirection:-1,tickDirection:-1,nameDirection:1});return i});a.each(o,function(t){a.each(r,t.add,t),this.group.add(t.getGroup())},this)},_buildSplitLineAndArea:function(t){function e(t,e,i){var n=i%e.length;return t[n]=t[n]||[],n}var i=t.coordinateSystem,n=i.getIndicatorAxes();if(n.length){var r=t.get("shape"),s=t.getModel("splitLine"),l=t.getModel("splitArea"),u=s.getModel("lineStyle"),h=l.getModel("areaStyle"),c=s.get("show"),d=l.get("show"),f=u.get("color"),p=h.get("color");f=a.isArray(f)?f:[f],p=a.isArray(p)?p:[p];var g=[],m=[];if("circle"===r)for(var v=n[0].getTicksCoords(),y=i.cx,x=i.cy,_=0;_<v.length;_++){if(c){var b=e(g,f,_);g[b].push(new o.Circle({shape:{cx:y,cy:x,r:v[_]}}))}if(d&&_<v.length-1){var b=e(m,p,_);m[b].push(new o.Ring({shape:{cx:y,cy:x,r0:v[_],r:v[_+1]}}))}}else for(var w,S=a.map(n,function(t,e){var n=t.getTicksCoords();return w=null==w?n.length-1:Math.min(n.length-1,w),a.map(n,function(t){return i.coordToPoint(t,e)})}),M=[],_=0;_<=w;_++){for(var I=[],T=0;T<n.length;T++)I.push(S[T][_]);if(I[0]&&I.push(I[0].slice()),c){var b=e(g,f,_);g[b].push(new o.Polyline({shape:{points:I}}))}if(d&&M){var b=e(m,p,_-1);m[b].push(new o.Polygon({shape:{points:I.concat(M)}}))}M=I.slice().reverse()}var A=u.getLineStyle(),C=h.getAreaStyle();a.each(m,function(t,e){this.group.add(o.mergePath(t,{style:a.defaults({stroke:"none",fill:p[e%p.length]},C),silent:!0}))},this),a.each(g,function(t,e){this.group.add(o.mergePath(t,{style:a.defaults({fill:"none",stroke:f[e%f.length]},A),silent:!0}))},this)}}})},function(t,e,i){i(244),i(364)},function(t,e,i){var n=i(2);n.registerPreprocessor(i(391)),i(393),i(392),i(386),i(387)},function(t,e,i){var n=i(389),a=i(1),o=i(5),r=n.extend({type:"timeline.slider",defaultOption:{backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,orient:"horizontal",inverse:!1,tooltip:{trigger:"item"},symbol:"emptyCircle",symbolSize:10,lineStyle:{show:!0,width:2,color:"#304654"},label:{position:"auto",normal:{show:!0,interval:"auto",rotate:0,color:"#304654"},emphasis:{show:!0,color:"#c23531"}},itemStyle:{normal:{color:"#304654",borderWidth:1},emphasis:{color:"#c23531"}},checkpointStyle:{symbol:"circle",symbolSize:13,color:"#c23531",borderWidth:5,borderColor:"rgba(194,53,49, 0.5)",animation:!0,animationDuration:300,animationEasing:"quinticInOut"},controlStyle:{show:!0,showPlayBtn:!0,showPrevBtn:!0,showNextBtn:!0,itemSize:22,itemGap:12,position:"left",playIcon:"path://M31.6,53C17.5,53,6,41.5,6,27.4S17.5,1.8,31.6,1.8C45.7,1.8,57.2,13.3,57.2,27.4S45.7,53,31.6,53z M31.6,3.3 C18.4,3.3,7.5,14.1,7.5,27.4c0,13.3,10.8,24.1,24.1,24.1C44.9,51.5,55.7,40.7,55.7,27.4C55.7,14.1,44.9,3.3,31.6,3.3z M24.9,21.3 c0-2.2,1.6-3.1,3.5-2l10.5,6.1c1.899,1.1,1.899,2.9,0,4l-10.5,6.1c-1.9,1.1-3.5,0.2-3.5-2V21.3z",stopIcon:"path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z",nextIcon:"path://M18.6,50.8l22.5-22.5c0.2-0.2,0.3-0.4,0.3-0.7c0-0.3-0.1-0.5-0.3-0.7L18.7,4.4c-0.1-0.1-0.2-0.3-0.2-0.5 c0-0.4,0.3-0.8,0.8-0.8c0.2,0,0.5,0.1,0.6,0.3l23.5,23.5l0,0c0.2,0.2,0.3,0.4,0.3,0.7c0,0.3-0.1,0.5-0.3,0.7l-0.1,0.1L19.7,52 c-0.1,0.1-0.3,0.2-0.5,0.2c-0.4,0-0.8-0.3-0.8-0.8C18.4,51.2,18.5,51,18.6,50.8z",prevIcon:"path://M43,52.8L20.4,30.3c-0.2-0.2-0.3-0.4-0.3-0.7c0-0.3,0.1-0.5,0.3-0.7L42.9,6.4c0.1-0.1,0.2-0.3,0.2-0.5 c0-0.4-0.3-0.8-0.8-0.8c-0.2,0-0.5,0.1-0.6,0.3L18.3,28.8l0,0c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.3,0.1,0.5,0.3,0.7l0.1,0.1L41.9,54 c0.1,0.1,0.3,0.2,0.5,0.2c0.4,0,0.8-0.3,0.8-0.8C43.2,53.2,43.1,53,43,52.8z",normal:{color:"#304654",borderColor:"#304654",borderWidth:1},emphasis:{color:"#c23531",borderColor:"#c23531",borderWidth:2}},data:[]}});a.mixin(r,o.dataFormatMixin),t.exports=r},function(t,e,i){function n(t,e){return u.getLayoutRect(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()},t.get("padding"))}function a(t,e,i,n){var a=l.makePath(t.get(e).replace(/^path:\/\//,""),s.clone(n||{}),new p(i[0],i[1],i[2],i[3]),"center");return a}function o(t,e,i,n,a,o){var r=e.get("color");if(a)a.setColor(r),i.add(a),o&&o.onUpdate(a);else{var l=t.get("symbol");a=d.createSymbol(l,-1,-1,2,2,r),a.setStyle("strokeNoScale",!0),i.add(a),o&&o.onCreate(a)}var u=e.getItemStyle(["color","symbol","symbolSize"]);a.setStyle(u),n=s.merge({rectHover:!0,z2:100},n,!0);var h=t.get("symbolSize");h=h instanceof Array?h.slice():[+h,+h],h[0]/=2,h[1]/=2,n.scale=h;var c=t.get("symbolOffset");if(c){var f=n.position=n.position||[0,0];f[0]+=m.parsePercent(c[0],h[0]),f[1]+=m.parsePercent(c[1],h[1])}var p=t.get("symbolRotate");return n.rotation=(p||0)*Math.PI/180||0,a.attr(n),a.updateTransform(),a}function r(t,e,i,n,a){if(!t.dragging){var o=n.getModel("checkpointStyle"),r=i.dataToCoord(n.getData().get(["value"],e));a||!o.get("animation",!0)?t.attr({position:[r,0]}):(t.stopAnimation(!0),t.animateTo({position:[r,0]},o.get("animationDuration",!0),o.get("animationEasing",!0)))}}var s=i(1),l=i(3),u=i(9),h=i(390),c=i(388),d=i(24),f=i(18),p=i(12),g=i(19),m=i(4),v=i(7),y=v.encodeHTML,x=s.bind,_=s.each,b=Math.PI;t.exports=h.extend({type:"timeline.slider",init:function(t,e){this.api=e,this._axis,this._viewRect,this._timer,this._currentPointer,this._mainGroup,this._labelGroup},render:function(t,e,i,n){if(this.model=t,this.api=i,this.ecModel=e,this.group.removeAll(),t.get("show",!0)){var a=this._layout(t,i),o=this._createGroup("mainGroup"),r=this._createGroup("labelGroup"),s=this._axis=this._createAxis(a,t);t.formatTooltip=function(t){return y(s.scale.getLabel(t))},_(["AxisLine","AxisTick","Control","CurrentPointer"],function(e){this["_render"+e](a,o,s,t)},this),this._renderAxisLabel(a,r,s,t),this._position(a,t)}this._doPlayStop()},remove:function(){this._clearTimer(),this.group.removeAll()},dispose:function(){this._clearTimer()},_layout:function(t,e){var i=t.get("label.normal.position"),a=t.get("orient"),o=n(t,e);null==i||"auto"===i?i="horizontal"===a?o.y+o.height/2<e.getHeight()/2?"-":"+":o.x+o.width/2<e.getWidth()/2?"+":"-":isNaN(i)&&(i={horizontal:{top:"-",bottom:"+"},vertical:{left:"-",right:"+"}}[a][i]);var r={horizontal:"center",vertical:i>=0||"+"===i?"left":"right"},s={horizontal:i>=0||"+"===i?"top":"bottom",vertical:"middle"},l={horizontal:0,vertical:b/2},u="vertical"===a?o.height:o.width,h=t.getModel("controlStyle"),c=h.get("show"),d=c?h.get("itemSize"):0,f=c?h.get("itemGap"):0,p=d+f,g=t.get("label.normal.rotate")||0;g=g*b/180;var m,v,y,x,_=h.get("position",!0),c=h.get("show",!0),w=c&&h.get("showPlayBtn",!0),S=c&&h.get("showPrevBtn",!0),M=c&&h.get("showNextBtn",!0),I=0,T=u;return"left"===_||"bottom"===_?(w&&(m=[0,0],I+=p),S&&(v=[I,0],I+=p),M&&(y=[T-d,0],T-=p)):(w&&(m=[T-d,0],T-=p),S&&(v=[0,0],I+=p),M&&(y=[T-d,0],T-=p)),x=[I,T],t.get("inverse")&&x.reverse(),{viewRect:o,mainLength:u,orient:a,rotation:l[a],labelRotation:g,labelPosOpt:i,labelAlign:t.get("label.normal.align")||r[a],labelBaseline:t.get("label.normal.verticalAlign")||t.get("label.normal.baseline")||s[a],playPosition:m,prevBtnPosition:v,nextBtnPosition:y,axisExtent:x,controlSize:d,controlGap:f}},_position:function(t,e){function i(t){var e=t.position;t.origin=[c[0][0]-e[0],c[1][0]-e[1]]}function n(t){return[[t.x,t.x+t.width],[t.y,t.y+t.height]]}function a(t,e,i,n,a){t[n]+=i[n][a]-e[n][a]}var o=this._mainGroup,r=this._labelGroup,s=t.viewRect;if("vertical"===t.orient){var l=g.create(),u=s.x,h=s.y+s.height;g.translate(l,l,[-u,-h]),g.rotate(l,l,-b/2),g.translate(l,l,[u,h]),s=s.clone(),s.applyTransform(l)}var c=n(s),d=n(o.getBoundingRect()),f=n(r.getBoundingRect()),p=o.position,m=r.position;m[0]=p[0]=c[0][0];var v=t.labelPosOpt;if(isNaN(v)){var y="+"===v?0:1;a(p,d,c,1,y),a(m,f,c,1,1-y)}else{var y=v>=0?0:1;a(p,d,c,1,y),m[1]=p[1]+v}o.attr("position",p),r.attr("position",m),o.rotation=r.rotation=t.rotation,i(o),i(r)},_createAxis:function(t,e){var i=e.getData(),n=e.get("axisType"),a=f.createScaleByModel(e,n),o=i.getDataExtent("value");a.setExtent(o[0],o[1]),this._customizeScale(a,i),a.niceTicks();var r=new c("value",a,t.axisExtent,n);return r.model=e,r},_customizeScale:function(t,e){t.getTicks=function(){return e.mapArray(["value"],function(t){return t})},t.getTicksLabels=function(){return s.map(this.getTicks(),t.getLabel,t)}},_createGroup:function(t){var e=this["_"+t]=new l.Group;return this.group.add(e),e},_renderAxisLine:function(t,e,i,n){var a=i.getExtent();n.get("lineStyle.show")&&e.add(new l.Line({shape:{x1:a[0],y1:0,x2:a[1],y2:0},style:s.extend({lineCap:"round"},n.getModel("lineStyle").getLineStyle()),silent:!0,z2:1}))},_renderAxisTick:function(t,e,i,n){var a=n.getData(),r=i.scale.getTicks();_(r,function(t,r){var s=i.dataToCoord(t),u=a.getItemModel(r),h=u.getModel("itemStyle.normal"),c=u.getModel("itemStyle.emphasis"),d={position:[s,0],onclick:x(this._changeTimeline,this,r)},f=o(u,h,e,d);l.setHoverStyle(f,c.getItemStyle()),u.get("tooltip")?(f.dataIndex=r,f.dataModel=n):f.dataIndex=f.dataModel=null},this)},_renderAxisLabel:function(t,e,i,n){var a=n.getModel("label.normal");if(a.get("show")){var o=n.getData(),r=i.scale.getTicks(),s=f.getFormattedLabels(i,a.get("formatter")),u=i.getLabelInterval();_(r,function(n,a){if(!i.isLabelIgnored(a,u)){var r=o.getItemModel(a),h=r.getModel("label.normal"),c=r.getModel("label.emphasis"),d=i.dataToCoord(n),f=new l.Text({position:[d,0],rotation:t.labelRotation-t.rotation,onclick:x(this._changeTimeline,this,a),silent:!1});l.setTextStyle(f.style,h,{text:s[a],textAlign:t.labelAlign,textVerticalAlign:t.labelBaseline}),e.add(f),l.setHoverStyle(f,l.setTextStyle({},c))}},this)}},_renderControl:function(t,e,i,n){function o(t,i,o,d){if(t){var f={position:t,origin:[r/2,0],rotation:d?-s:0,rectHover:!0,style:u,onclick:o},p=a(n,i,c,f);e.add(p),l.setHoverStyle(p,h)}}var r=t.controlSize,s=t.rotation,u=n.getModel("controlStyle.normal").getItemStyle(),h=n.getModel("controlStyle.emphasis").getItemStyle(),c=[0,-r/2,r,r],d=n.getPlayState(),f=n.get("inverse",!0);o(t.nextBtnPosition,"controlStyle.nextIcon",x(this._changeTimeline,this,f?"-":"+")),o(t.prevBtnPosition,"controlStyle.prevIcon",x(this._changeTimeline,this,f?"+":"-")),o(t.playPosition,"controlStyle."+(d?"stopIcon":"playIcon"),x(this._handlePlayClick,this,!d),!0)},_renderCurrentPointer:function(t,e,i,n){var a=n.getData(),s=n.getCurrentIndex(),l=a.getItemModel(s).getModel("checkpointStyle"),u=this,h={onCreate:function(t){t.draggable=!0,t.drift=x(u._handlePointerDrag,u),t.ondragend=x(u._handlePointerDragend,u),r(t,s,i,n,!0)},onUpdate:function(t){r(t,s,i,n)}};this._currentPointer=o(l,l,this._mainGroup,{},this._currentPointer,h)},_handlePlayClick:function(t){this._clearTimer(),this.api.dispatchAction({type:"timelinePlayChange",playState:t,from:this.uid})},_handlePointerDrag:function(t,e,i){this._clearTimer(),this._pointerChangeTimeline([i.offsetX,i.offsetY])},_handlePointerDragend:function(t){this._pointerChangeTimeline([t.offsetX,t.offsetY],!0)},_pointerChangeTimeline:function(t,e){var i=this._toAxisCoord(t)[0],n=this._axis,a=m.asc(n.getExtent().slice());i>a[1]&&(i=a[1]),i<a[0]&&(i=a[0]),this._currentPointer.position[0]=i,this._currentPointer.dirty();var o=this._findNearestTick(i),r=this.model;(e||o!==r.getCurrentIndex()&&r.get("realtime"))&&this._changeTimeline(o)},_doPlayStop:function(){function t(){var t=this.model;this._changeTimeline(t.getCurrentIndex()+(t.get("rewind",!0)?-1:1))}this._clearTimer(),this.model.getPlayState()&&(this._timer=setTimeout(x(t,this),this.model.get("playInterval")))},_toAxisCoord:function(t){var e=this._mainGroup.getLocalTransform();return l.applyTransform(t,e,!0)},_findNearestTick:function(t){var e,i=this.model.getData(),n=1/0,a=this._axis;return i.each(["value"],function(i,o){var r=a.dataToCoord(i),s=Math.abs(r-t);s<n&&(n=s,e=o)}),e},_clearTimer:function(){this._timer&&(clearTimeout(this._timer),this._timer=null)},_changeTimeline:function(t){var e=this.model.getCurrentIndex();"+"===t?t=e+1:"-"===t&&(t=e-1),this.api.dispatchAction({type:"timelineChange",currentIndex:t,from:this.uid})}})},function(t,e,i){var n=i(1),a=i(33),o=i(18),r=function(t,e,i,n){a.call(this,t,e,i),this.type=n||"value",this._autoLabelInterval,this.model=null};r.prototype={constructor:r,getLabelInterval:function(){var t=this.model,e=t.getModel("label.normal"),i=e.get("interval");if(null!=i&&"auto"!=i)return i;var i=this._autoLabelInterval;return i||(i=this._autoLabelInterval=o.getAxisLabelInterval(n.map(this.scale.getTicks(),this.dataToCoord,this),o.getFormattedLabels(this,e.get("formatter")),e.getFont(),"horizontal"===t.get("orient"))),i},isLabelIgnored:function(t){if("category"===this.type){var e=this.getLabelInterval();return"function"==typeof e&&!e(t,this.scale.getLabel(t))||t%(e+1)}}},n.inherits(r,a),t.exports=r},function(t,e,i){var n=i(13),a=i(14),o=i(1),r=i(5),s=n.extend({type:"timeline",layoutMode:"box",defaultOption:{zlevel:0,z:4,show:!0,axisType:"time",realtime:!0,left:"20%",top:null,right:"20%",bottom:0,width:null,height:40,padding:5,controlPosition:"left",autoPlay:!1,rewind:!1,loop:!0,playInterval:2e3,currentIndex:0,itemStyle:{normal:{},emphasis:{}},label:{normal:{color:"#000"},emphasis:{}},data:[]},init:function(t,e,i){this._data,this._names,this.mergeDefaultAndTheme(t,i),this._initData()},mergeOption:function(t){s.superApply(this,"mergeOption",arguments),this._initData()},setCurrentIndex:function(t){null==t&&(t=this.option.currentIndex);var e=this._data.count();this.option.loop?t=(t%e+e)%e:(t>=e&&(t=e-1),t<0&&(t=0)),this.option.currentIndex=t},getCurrentIndex:function(){return this.option.currentIndex},isIndexMax:function(){return this.getCurrentIndex()>=this._data.count()-1},setPlayState:function(t){this.option.autoPlay=!!t},getPlayState:function(){return!!this.option.autoPlay},_initData:function(){var t=this.option,e=t.data||[],i=t.axisType,n=this._names=[];if("category"===i){var s=[];o.each(e,function(t,e){var i,a=r.getDataItemValue(t);o.isObject(t)?(i=o.clone(t),i.value=e):i=e,s.push(i),o.isString(a)||null!=a&&!isNaN(a)||(a=""),n.push(a+"")}),e=s}var l={category:"ordinal",time:"time"}[i]||"number",u=this._data=new a([{name:"value",type:l}],this);u.initData(e,n)},getData:function(){return this._data},getCategories:function(){if("category"===this.get("axisType"))return this._names.slice()}});t.exports=s},function(t,e,i){var n=i(68);t.exports=n.extend({type:"timeline"})},function(t,e,i){function n(t){var e=t.type,i={number:"value",time:"time"};if(i[e]&&(t.axisType=i[e],delete t.type),a(t),o(t,"controlPosition")){var n=t.controlStyle||(t.controlStyle={});o(n,"position")||(n.position=t.controlPosition),"none"!==n.position||o(n,"show")||(n.show=!1,delete n.position),delete t.controlPosition}r.each(t.data||[],function(t){r.isObject(t)&&!r.isArray(t)&&(!o(t,"value")&&o(t,"name")&&(t.value=t.name),a(t))})}function a(t){var e=t.itemStyle||(t.itemStyle={}),i=e.emphasis||(e.emphasis={}),n=t.label||t.label||{},a=n.normal||(n.normal={}),s={normal:1,emphasis:1};r.each(n,function(t,e){s[e]||o(a,e)||(a[e]=t)}),i.label&&!o(n,"emphasis")&&(n.emphasis=i.label,delete i.label)}function o(t,e){return t.hasOwnProperty(e)}var r=i(1);t.exports=function(t){var e=t&&t.timeline;r.isArray(e)||(e=e?[e]:[]),r.each(e,function(t){t&&n(t)})}},function(t,e,i){var n=i(2),a=i(1);n.registerAction({type:"timelineChange",event:"timelineChanged",update:"prepareAndUpdate"},function(t,e){var i=e.getComponent("timeline");return i&&null!=t.currentIndex&&(i.setCurrentIndex(t.currentIndex),!i.get("loop",!0)&&i.isIndexMax()&&i.setPlayState(!1)),e.resetOption("timeline"),a.defaults({currentIndex:i.option.currentIndex},t)}),n.registerAction({type:"timelinePlayChange",event:"timelinePlayChanged",update:"update"},function(t,e){var i=e.getComponent("timeline");i&&null!=t.playState&&i.setPlayState(t.playState)})},function(t,e,i){i(13).registerSubTypeDefaulter("timeline",function(){return"slider"})},function(t,e,i){"use strict";function n(t,e,i){this.model=t,this.ecModel=e,this.api=i,this._brushType,this._brushMode}var a=i(29),o=i(1),r=i(44).toolbox.brush;n.defaultOption={show:!0,type:["rect","polygon","lineX","lineY","keep","clear"],icon:{rect:"M7.3,34.7 M0.4,10V-0.2h9.8 M89.6,10V-0.2h-9.8 M0.4,60v10.2h9.8 M89.6,60v10.2h-9.8 M12.3,22.4V10.5h13.1 M33.6,10.5h7.8 M49.1,10.5h7.8 M77.5,22.4V10.5h-13 M12.3,31.1v8.2 M77.7,31.1v8.2 M12.3,47.6v11.9h13.1 M33.6,59.5h7.6 M49.1,59.5 h7.7 M77.5,47.6v11.9h-13",polygon:"M55.2,34.9c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1 s-3.1-1.4-3.1-3.1S53.5,34.9,55.2,34.9z M50.4,51c1.7,0,3.1,1.4,3.1,3.1c0,1.7-1.4,3.1-3.1,3.1c-1.7,0-3.1-1.4-3.1-3.1 C47.3,52.4,48.7,51,50.4,51z M55.6,37.1l1.5-7.8 M60.1,13.5l1.6-8.7l-7.8,4 M59,19l-1,5.3 M24,16.1l6.4,4.9l6.4-3.3 M48.5,11.6 l-5.9,3.1 M19.1,12.8L9.7,5.1l1.1,7.7 M13.4,29.8l1,7.3l6.6,1.6 M11.6,18.4l1,6.1 M32.8,41.9 M26.6,40.4 M27.3,40.2l6.1,1.6 M49.9,52.1l-5.6-7.6l-4.9-1.2",lineX:"M15.2,30 M19.7,15.6V1.9H29 M34.8,1.9H40.4 M55.3,15.6V1.9H45.9 M19.7,44.4V58.1H29 M34.8,58.1H40.4 M55.3,44.4 V58.1H45.9 M12.5,20.3l-9.4,9.6l9.6,9.8 M3.1,29.9h16.5 M62.5,20.3l9.4,9.6L62.3,39.7 M71.9,29.9H55.4",lineY:"M38.8,7.7 M52.7,12h13.2v9 M65.9,26.6V32 M52.7,46.3h13.2v-9 M24.9,12H11.8v9 M11.8,26.6V32 M24.9,46.3H11.8v-9 M48.2,5.1l-9.3-9l-9.4,9.2 M38.9-3.9V12 M48.2,53.3l-9.3,9l-9.4-9.2 M38.9,62.3V46.4",keep:"M4,10.5V1h10.3 M20.7,1h6.1 M33,1h6.1 M55.4,10.5V1H45.2 M4,17.3v6.6 M55.6,17.3v6.6 M4,30.5V40h10.3 M20.7,40 h6.1 M33,40h6.1 M55.4,30.5V40H45.2 M21,18.9h62.9v48.6H21V18.9z",clear:"M22,14.7l30.9,31 M52.9,14.7L22,45.7 M4.7,16.8V4.2h13.1 M26,4.2h7.8 M41.6,4.2h7.8 M70.3,16.8V4.2H57.2 M4.7,25.9v8.6 M70.3,25.9v8.6 M4.7,43.2v12.6h13.1 M26,55.8h7.8 M41.6,55.8h7.8 M70.3,43.2v12.6H57.2"},title:o.clone(r.title)};var s=n.prototype;s.render=s.updateView=s.updateLayout=function(t,e,i){var n,a,r;e.eachComponent({mainType:"brush"},function(t){n=t.brushType,a=t.brushOption.brushMode||"single",r|=t.areas.length}),this._brushType=n,this._brushMode=a,o.each(t.get("type",!0),function(e){t.setIconStatus(e,("keep"===e?"multiple"===a:"clear"===e?r:e===n)?"emphasis":"normal")})},s.getIcons=function(){var t=this.model,e=t.get("icon",!0),i={};return o.each(t.get("type",!0),function(t){e[t]&&(i[t]=e[t])}),i},s.onclick=function(t,e,i){var e=this.api,n=this._brushType,a=this._brushMode;"clear"===i?(e.dispatchAction({type:"axisAreaSelect",intervals:[]}),e.dispatchAction({type:"brush",command:"clear",areas:[]})):e.dispatchAction({type:"takeGlobalCursor",key:"brush",brushOption:{brushType:"keep"===i?n:n!==i&&i,brushMode:"keep"===i?"multiple"===a?"single":"multiple":a}})},a.register("brush",n),t.exports=n},function(t,e,i){i(400),i(401)},function(t,e,i){function n(t,e,i){if(i[0]===i[1])return i.slice();for(var n=200,a=(i[1]-i[0])/n,o=i[0],r=[],s=0;s<=n&&o<i[1];s++)r.push(o),o+=a;return r.push(i[1]),r}var a=i(261),o=i(1),r=i(4),s=[20,140],l=a.extend({type:"visualMap.continuous",defaultOption:{align:"auto",calculable:!1,range:null,realtime:!0,itemHeight:null,itemWidth:null,hoverLink:!0,hoverLinkDataSize:null,hoverLinkOnHandle:null},optionUpdated:function(t,e){l.superApply(this,"optionUpdated",arguments),this.resetExtent(),this.resetVisual(function(t){t.mappingMethod="linear",t.dataExtent=this.getExtent()}),this._resetRange()},resetItemSize:function(){l.superApply(this,"resetItemSize",arguments);var t=this.itemSize;"horizontal"===this._orient&&t.reverse(),(null==t[0]||isNaN(t[0]))&&(t[0]=s[0]),(null==t[1]||isNaN(t[1]))&&(t[1]=s[1])},_resetRange:function(){var t=this.getExtent(),e=this.option.range;!e||e.auto?(t.auto=1,this.option.range=t):o.isArray(e)&&(e[0]>e[1]&&e.reverse(),e[0]=Math.max(e[0],t[0]),e[1]=Math.min(e[1],t[1]))},completeVisualOption:function(){a.prototype.completeVisualOption.apply(this,arguments),o.each(this.stateList,function(t){var e=this.option.controller[t].symbolSize;e&&e[0]!==e[1]&&(e[0]=0)},this)},setSelected:function(t){this.option.range=t.slice(),this._resetRange()},getSelected:function(){var t=this.getExtent(),e=r.asc((this.get("range")||[]).slice());return e[0]>t[1]&&(e[0]=t[1]),e[1]>t[1]&&(e[1]=t[1]),e[0]<t[0]&&(e[0]=t[0]),e[1]<t[0]&&(e[1]=t[0]),e},getValueState:function(t){var e=this.option.range,i=this.getExtent();return(e[0]<=i[0]||e[0]<=t)&&(e[1]>=i[1]||t<=e[1])?"inRange":"outOfRange"},findTargetDataIndices:function(t){var e=[];return this.eachTargetSeries(function(i){var n=[],a=i.getData();a.each(this.getDataDimension(a),function(e,i){t[0]<=e&&e<=t[1]&&n.push(i)},!0,this),e.push({seriesId:i.id,dataIndex:n})},this),e},getVisualMeta:function(t){function e(e,i){o.push({value:e,color:t(e,i)})}for(var i=n(this,"outOfRange",this.getExtent()),a=n(this,"inRange",this.option.range.slice()),o=[],r=0,s=0,l=a.length,u=i.length;s<u&&(!a.length||i[s]<=a[0]);s++)i[s]<a[r]&&e(i[s],"outOfRange");for(var h=1;r<l;r++,h=0)h&&o.length&&e(a[r],"outOfRange"),e(a[r],"inRange");for(var h=1;s<u;s++)(!a.length||a[a.length-1]<i[s])&&(h&&(o.length&&e(o[o.length-1].value,"outOfRange"),h=0),e(i[s],"outOfRange"));var c=o.length;return{stops:o,outerColors:[c?o[0].color:"transparent",c?o[c-1].color:"transparent"]}}});t.exports=l},function(t,e,i){function n(t,e,i,n){return new h.Polygon({shape:{points:t},draggable:!!i,cursor:e,drift:i,onmousemove:function(t){v.stop(t.event)},ondragend:n})}function a(t,e){return 0===t?[[0,0],[e,0],[e,-e]]:[[0,0],[e,0],[e,e]]}function o(t,e,i,n){return t?[[0,-_(e,b(i,0))],[S,0],[0,_(e,b(n-i,0))]]:[[0,0],[5,-5],[5,5]];
}function r(t,e,i){var n=w/2,a=t.get("hoverLinkDataSize");return a&&(n=y(a,e,i,!0)/2),n}function s(t){var e=t.get("hoverLinkOnHandle");return!!(null==e?t.get("realtime"):e)}function l(t){return"vertical"===t?"ns-resize":"ew-resize"}var u=i(262),h=i(3),c=i(1),d=i(4),f=i(59),p=i(105),g=i(263),m=i(5),v=i(21),y=d.linearMap,x=c.each,_=Math.min,b=Math.max,w=12,S=6,M=u.extend({type:"visualMap.continuous",init:function(){M.superApply(this,"init",arguments),this._shapes={},this._dataInterval=[],this._handleEnds=[],this._orient,this._useHandle,this._hoverLinkDataIndices=[],this._dragging,this._hovering},doRender:function(t,e,i,n){n&&"selectDataRange"===n.type&&n.from===this.uid||this._buildView()},_buildView:function(){this.group.removeAll();var t=this.visualMapModel,e=this.group;this._orient=t.get("orient"),this._useHandle=t.get("calculable"),this._resetInterval(),this._renderBar(e);var i=t.get("text");this._renderEndsText(e,i,0),this._renderEndsText(e,i,1),this._updateView(!0),this.renderBackground(e),this._updateView(),this._enableHoverLinkToSeries(),this._enableHoverLinkFromSeries(),this.positionGroup(e)},_renderEndsText:function(t,e,i){if(e){var n=e[1-i];n=null!=n?n+"":"";var a=this.visualMapModel,o=a.get("textGap"),r=a.itemSize,s=this._shapes.barGroup,l=this._applyTransform([r[0]/2,0===i?-o:r[1]+o],s),u=this._applyTransform(0===i?"bottom":"top",s),c=this._orient,d=this.visualMapModel.textStyleModel;this.group.add(new h.Text({style:{x:l[0],y:l[1],textVerticalAlign:"horizontal"===c?"middle":u,textAlign:"horizontal"===c?u:"center",text:n,textFont:d.getFont(),textFill:d.getTextColor()}}))}},_renderBar:function(t){var e=this.visualMapModel,i=this._shapes,a=e.itemSize,o=this._orient,r=this._useHandle,s=g.getItemAlign(e,this.api,a),u=i.barGroup=this._createBarGroup(s);u.add(i.outOfRange=n()),u.add(i.inRange=n(null,r?l(this._orient):null,c.bind(this._dragHandle,this,"all",!1),c.bind(this._dragHandle,this,"all",!0)));var h=e.textStyleModel.getTextRect("国"),d=b(h.width,h.height);r&&(i.handleThumbs=[],i.handleLabels=[],i.handleLabelPoints=[],this._createHandle(u,0,a,d,o,s),this._createHandle(u,1,a,d,o,s)),this._createIndicator(u,a,d,o),t.add(u)},_createHandle:function(t,e,i,o,r){var s=c.bind(this._dragHandle,this,e,!1),u=c.bind(this._dragHandle,this,e,!0),d=n(a(e,o),l(this._orient),s,u);d.position[0]=i[0],t.add(d);var f=this.visualMapModel.textStyleModel,p=new h.Text({draggable:!0,drift:s,onmousemove:function(t){v.stop(t.event)},ondragend:u,style:{x:0,y:0,text:"",textFont:f.getFont(),textFill:f.getTextColor()}});this.group.add(p);var g=["horizontal"===r?o/2:1.5*o,"horizontal"===r?0===e?-(1.5*o):1.5*o:0===e?-o/2:o/2],m=this._shapes;m.handleThumbs[e]=d,m.handleLabelPoints[e]=g,m.handleLabels[e]=p},_createIndicator:function(t,e,i,a){var o=n([[0,0]],"move");o.position[0]=e[0],o.attr({invisible:!0,silent:!0}),t.add(o);var r=this.visualMapModel.textStyleModel,s=new h.Text({silent:!0,invisible:!0,style:{x:0,y:0,text:"",textFont:r.getFont(),textFill:r.getTextColor()}});this.group.add(s);var l=["horizontal"===a?i/2:S+3,0],u=this._shapes;u.indicator=o,u.indicatorLabel=s,u.indicatorLabelPoint=l},_dragHandle:function(t,e,i,n){if(this._useHandle){if(this._dragging=!e,!e){var a=this._applyTransform([i,n],this._shapes.barGroup,!0);this._updateInterval(t,a[1]),this._updateView()}e===!this.visualMapModel.get("realtime")&&this.api.dispatchAction({type:"selectDataRange",from:this.uid,visualMapId:this.visualMapModel.id,selected:this._dataInterval.slice()}),e?!this._hovering&&this._clearHoverLinkToSeries():s(this.visualMapModel)&&this._doHoverLinkToSeries(this._handleEnds[t],!1)}},_resetInterval:function(){var t=this.visualMapModel,e=this._dataInterval=t.getSelected(),i=t.getExtent(),n=[0,t.itemSize[1]];this._handleEnds=[y(e[0],i,n,!0),y(e[1],i,n,!0)]},_updateInterval:function(t,e){e=e||0;var i=this.visualMapModel,n=this._handleEnds,a=[0,i.itemSize[1]];f(e,n,a,t,0);var o=i.getExtent();this._dataInterval=[y(n[0],a,o,!0),y(n[1],a,o,!0)]},_updateView:function(t){var e=this.visualMapModel,i=e.getExtent(),n=this._shapes,a=[0,e.itemSize[1]],o=t?a:this._handleEnds,r=this._createBarVisual(this._dataInterval,i,o,"inRange"),s=this._createBarVisual(i,i,a,"outOfRange");n.inRange.setStyle({fill:r.barColor,opacity:r.opacity}).setShape("points",r.barPoints),n.outOfRange.setStyle({fill:s.barColor,opacity:s.opacity}).setShape("points",s.barPoints),this._updateHandle(o,r)},_createBarVisual:function(t,e,i,n){var a={forceState:n,convertOpacityToAlpha:!0},o=this._makeColorGradient(t,a),r=[this.getControllerVisual(t[0],"symbolSize",a),this.getControllerVisual(t[1],"symbolSize",a)],s=this._createBarPoints(i,r);return{barColor:new p(0,0,0,1,o),barPoints:s,handlesColor:[o[0].color,o[o.length-1].color]}},_makeColorGradient:function(t,e){var i=100,n=[],a=(t[1]-t[0])/i;n.push({color:this.getControllerVisual(t[0],"color",e),offset:0});for(var o=1;o<i;o++){var r=t[0]+a*o;if(r>t[1])break;n.push({color:this.getControllerVisual(r,"color",e),offset:o/i})}return n.push({color:this.getControllerVisual(t[1],"color",e),offset:1}),n},_createBarPoints:function(t,e){var i=this.visualMapModel.itemSize;return[[i[0]-e[0],t[0]],[i[0],t[0]],[i[0],t[1]],[i[0]-e[1],t[1]]]},_createBarGroup:function(t){var e=this._orient,i=this.visualMapModel.get("inverse");return new h.Group("horizontal"!==e||i?"horizontal"===e&&i?{scale:"bottom"===t?[-1,1]:[1,1],rotation:-Math.PI/2}:"vertical"!==e||i?{scale:"left"===t?[1,1]:[-1,1]}:{scale:"left"===t?[1,-1]:[-1,-1]}:{scale:"bottom"===t?[1,1]:[-1,1],rotation:Math.PI/2})},_updateHandle:function(t,e){if(this._useHandle){var i=this._shapes,n=this.visualMapModel,a=i.handleThumbs,o=i.handleLabels;x([0,1],function(r){var s=a[r];s.setStyle("fill",e.handlesColor[r]),s.position[1]=t[r];var l=h.applyTransform(i.handleLabelPoints[r],h.getTransform(s,this.group));o[r].setStyle({x:l[0],y:l[1],text:n.formatValueText(this._dataInterval[r]),textVerticalAlign:"middle",textAlign:this._applyTransform("horizontal"===this._orient?0===r?"bottom":"top":"left",i.barGroup)})},this)}},_showIndicator:function(t,e,i,n){var a=this.visualMapModel,r=a.getExtent(),s=a.itemSize,l=[0,s[1]],u=y(t,r,l,!0),c=this._shapes,d=c.indicator;if(d){d.position[1]=u,d.attr("invisible",!1),d.setShape("points",o(!!i,n,u,s[1]));var f={convertOpacityToAlpha:!0},p=this.getControllerVisual(t,"color",f);d.setStyle("fill",p);var g=h.applyTransform(c.indicatorLabelPoint,h.getTransform(d,this.group)),m=c.indicatorLabel;m.attr("invisible",!1);var v=this._applyTransform("left",c.barGroup),x=this._orient;m.setStyle({text:(i?i:"")+a.formatValueText(e),textVerticalAlign:"horizontal"===x?v:"middle",textAlign:"horizontal"===x?"center":v,x:g[0],y:g[1]})}},_enableHoverLinkToSeries:function(){var t=this;this._shapes.barGroup.on("mousemove",function(e){if(t._hovering=!0,!t._dragging){var i=t.visualMapModel.itemSize,n=t._applyTransform([e.offsetX,e.offsetY],t._shapes.barGroup,!0,!0);n[1]=_(b(0,n[1]),i[1]),t._doHoverLinkToSeries(n[1],0<=n[0]&&n[0]<=i[0])}}).on("mouseout",function(){t._hovering=!1,!t._dragging&&t._clearHoverLinkToSeries()})},_enableHoverLinkFromSeries:function(){var t=this.api.getZr();this.visualMapModel.option.hoverLink?(t.on("mouseover",this._hoverLinkFromSeriesMouseOver,this),t.on("mouseout",this._hideIndicator,this)):this._clearHoverLinkFromSeries()},_doHoverLinkToSeries:function(t,e){var i=this.visualMapModel,n=i.itemSize;if(i.option.hoverLink){var a=[0,n[1]],o=i.getExtent();t=_(b(a[0],t),a[1]);var l=r(i,o,a),u=[t-l,t+l],h=y(t,a,o,!0),c=[y(u[0],a,o,!0),y(u[1],a,o,!0)];u[0]<a[0]&&(c[0]=-(1/0)),u[1]>a[1]&&(c[1]=1/0),e&&(c[0]===-(1/0)?this._showIndicator(h,c[1],"< ",l):c[1]===1/0?this._showIndicator(h,c[0],"> ",l):this._showIndicator(h,h,"≈ ",l));var d=this._hoverLinkDataIndices,f=[];(e||s(i))&&(f=this._hoverLinkDataIndices=i.findTargetDataIndices(c));var p=m.compressBatches(d,f);this._dispatchHighDown("downplay",g.convertDataIndex(p[0])),this._dispatchHighDown("highlight",g.convertDataIndex(p[1]))}},_hoverLinkFromSeriesMouseOver:function(t){var e=t.target,i=this.visualMapModel;if(e&&null!=e.dataIndex){var n=this.ecModel.getSeriesByIndex(e.seriesIndex);if(i.isTargetSeries(n)){var a=n.getData(e.dataType),o=a.getDimension(i.getDataDimension(a)),r=a.get(o,e.dataIndex,!0);isNaN(r)||this._showIndicator(r,r)}}},_hideIndicator:function(){var t=this._shapes;t.indicator&&t.indicator.attr("invisible",!0),t.indicatorLabel&&t.indicatorLabel.attr("invisible",!0)},_clearHoverLinkToSeries:function(){this._hideIndicator();var t=this._hoverLinkDataIndices;this._dispatchHighDown("downplay",g.convertDataIndex(t)),t.length=0},_clearHoverLinkFromSeries:function(){this._hideIndicator();var t=this.api.getZr();t.off("mouseover",this._hoverLinkFromSeriesMouseOver),t.off("mouseout",this._hideIndicator)},_applyTransform:function(t,e,i,n){var a=h.getTransform(e,n?null:this.group);return h[c.isArray(t)?"applyTransform":"transformDirection"](t,a,i)},_dispatchHighDown:function(t,e){e&&e.length&&this.api.dispatchAction({type:t,batch:e})},dispose:function(){this._clearHoverLinkFromSeries(),this._clearHoverLinkToSeries()},remove:function(){this._clearHoverLinkFromSeries(),this._clearHoverLinkToSeries()}});t.exports=M},function(t,e,i){function n(t,e){var i=t.inverse;("vertical"===t.orient?!i:i)&&e.reverse()}var a=i(261),o=i(1),r=i(88),s=i(274),l=i(4).reformIntervals,u=a.extend({type:"visualMap.piecewise",defaultOption:{selected:null,minOpen:!1,maxOpen:!1,align:"auto",itemWidth:20,itemHeight:14,itemSymbol:"roundRect",pieceList:null,categories:null,splitNumber:5,selectedMode:"multiple",itemGap:10,hoverLink:!0,showLabel:null},optionUpdated:function(t,e){u.superApply(this,"optionUpdated",arguments),this._pieceList=[],this.resetExtent();var i=this._mode=this._determineMode();h[this._mode].call(this),this._resetSelected(t,e);var n=this.option.categories;this.resetVisual(function(t,e){"categories"===i?(t.mappingMethod="category",t.categories=o.clone(n)):(t.dataExtent=this.getExtent(),t.mappingMethod="piecewise",t.pieceList=o.map(this._pieceList,function(t){var t=o.clone(t);return"inRange"!==e&&(t.visual=null),t}))})},completeVisualOption:function(){function t(t,e,i){return t&&t[e]&&(o.isObject(t[e])?t[e].hasOwnProperty(i):t[e]===i)}var e=this.option,i={},n=r.listVisualTypes(),l=this.isCategory();o.each(e.pieces,function(t){o.each(n,function(e){t.hasOwnProperty(e)&&(i[e]=1)})}),o.each(i,function(i,n){var a=0;o.each(this.stateList,function(i){a|=t(e,i,n)||t(e.target,i,n)},this),!a&&o.each(this.stateList,function(t){(e[t]||(e[t]={}))[n]=s.get(n,"inRange"===t?"active":"inactive",l)})},this),a.prototype.completeVisualOption.apply(this,arguments)},_resetSelected:function(t,e){var i=this.option,n=this._pieceList,a=(e?i:t).selected||{};if(i.selected=a,o.each(n,function(t,e){var i=this.getSelectedMapKey(t);a.hasOwnProperty(i)||(a[i]=!0)},this),"single"===i.selectedMode){var r=!1;o.each(n,function(t,e){var i=this.getSelectedMapKey(t);a[i]&&(r?a[i]=!1:r=!0)},this)}},getSelectedMapKey:function(t){return"categories"===this._mode?t.value+"":t.index+""},getPieceList:function(){return this._pieceList},_determineMode:function(){var t=this.option;return t.pieces&&t.pieces.length>0?"pieces":this.option.categories?"categories":"splitNumber"},setSelected:function(t){this.option.selected=o.clone(t)},getValueState:function(t){var e=r.findPieceIndex(t,this._pieceList);return null!=e&&this.option.selected[this.getSelectedMapKey(this._pieceList[e])]?"inRange":"outOfRange"},findTargetDataIndices:function(t){var e=[];return this.eachTargetSeries(function(i){var n=[],a=i.getData();a.each(this.getDataDimension(a),function(e,i){var a=r.findPieceIndex(e,this._pieceList);a===t&&n.push(i)},!0,this),e.push({seriesId:i.id,dataIndex:n})},this),e},getRepresentValue:function(t){var e;if(this.isCategory())e=t.value;else if(null!=t.value)e=t.value;else{var i=t.interval||[];e=i[0]===-(1/0)&&i[1]===1/0?0:(i[0]+i[1])/2}return e},getVisualMeta:function(t){function e(e,o){var r=a.getRepresentValue({interval:e});o||(o=a.getValueState(r));var s=t(r,o);e[0]===-(1/0)?n[0]=s:e[1]===1/0?n[1]=s:i.push({value:e[0],color:s},{value:e[1],color:s})}if(!this.isCategory()){var i=[],n=[],a=this,r=this._pieceList.slice();if(r.length){var s=r[0].interval[0];s!==-(1/0)&&r.unshift({interval:[-(1/0),s]}),s=r[r.length-1].interval[1],s!==1/0&&r.push({interval:[s,1/0]})}else r.push({interval:[-(1/0),1/0]});var l=-(1/0);return o.each(r,function(t){var i=t.interval;i&&(i[0]>l&&e([l,i[0]],"outOfRange"),e(i.slice()),l=i[1])},this),{stops:i,outerColors:n}}}}),h={splitNumber:function(){var t=this.option,e=this._pieceList,i=Math.min(t.precision,20),n=this.getExtent(),a=t.splitNumber;a=Math.max(parseInt(a,10),1),t.splitNumber=a;for(var r=(n[1]-n[0])/a;+r.toFixed(i)!==r&&i<5;)i++;t.precision=i,r=+r.toFixed(i);var s=0;t.minOpen&&e.push({index:s++,interval:[-(1/0),n[0]],close:[0,0]});for(var u=n[0],h=s+a;s<h;u+=r){var c=s===a-1?n[1]:u+r;e.push({index:s++,interval:[u,c],close:[1,1]})}t.maxOpen&&e.push({index:s++,interval:[n[1],1/0],close:[0,0]}),l(e),o.each(e,function(t){t.text=this.formatValueText(t.interval)},this)},categories:function(){var t=this.option;o.each(t.categories,function(t){this._pieceList.push({text:this.formatValueText(t,!0),value:t})},this),n(t,this._pieceList)},pieces:function(){var t=this.option,e=this._pieceList;o.each(t.pieces,function(t,i){o.isObject(t)||(t={value:t});var n={text:"",index:i};if(null!=t.label&&(n.text=t.label),t.hasOwnProperty("value")){var a=n.value=t.value;n.interval=[a,a],n.close=[1,1]}else{for(var s=n.interval=[],l=n.close=[0,0],u=[1,0,1],h=[-(1/0),1/0],c=[],d=0;d<2;d++){for(var f=[["gte","gt","min"],["lte","lt","max"]][d],p=0;p<3&&null==s[d];p++)s[d]=t[f[p]],l[d]=u[p],c[d]=2===p;null==s[d]&&(s[d]=h[d])}c[0]&&s[1]===1/0&&(l[0]=0),c[1]&&s[0]===-(1/0)&&(l[1]=0),s[0]===s[1]&&l[0]&&l[1]&&(n.value=s[0])}n.visual=r.retrieveVisuals(t),e.push(n)},this),n(t,e),l(e),o.each(e,function(t){var e=t.close,i=[["<","≤"][e[1]],[">","≥"][e[0]]];t.text=t.text||this.formatValueText(null!=t.value?t.value:t.interval,!1,i)},this)}};t.exports=u},function(t,e,i){var n=i(262),a=i(1),o=i(3),r=i(24),s=i(9),l=i(263),u=n.extend({type:"visualMap.piecewise",doRender:function(){function t(t){var r=t.piece,s=new o.Group;s.onclick=a.bind(this._onItemClick,this,r),this._enableHoverLink(s,t.indexInModelPieceList);var d=i.getRepresentValue(r);if(this._createItemSymbol(s,d,[0,0,c[0],c[1]]),p){var f=this.visualMapModel.getValueState(d);s.add(new o.Text({style:{x:"right"===h?-n:c[0]+n,y:c[1]/2,text:r.text,textVerticalAlign:"middle",textAlign:h,textFont:l,textFill:u,opacity:"outOfRange"===f?.5:1}}))}e.add(s)}var e=this.group;e.removeAll();var i=this.visualMapModel,n=i.get("textGap"),r=i.textStyleModel,l=r.getFont(),u=r.getTextColor(),h=this._getItemAlign(),c=i.itemSize,d=this._getViewData(),f=d.endsText,p=a.retrieve(i.get("showLabel",!0),!f);f&&this._renderEndsText(e,f[0],c,p,h),a.each(d.viewPieceList,t,this),f&&this._renderEndsText(e,f[1],c,p,h),s.box(i.get("orient"),e,i.get("itemGap")),this.renderBackground(e),this.positionGroup(e)},_enableHoverLink:function(t,e){function i(t){var i=this.visualMapModel;i.option.hoverLink&&this.api.dispatchAction({type:t,batch:l.convertDataIndex(i.findTargetDataIndices(e))})}t.on("mouseover",a.bind(i,this,"highlight")).on("mouseout",a.bind(i,this,"downplay"))},_getItemAlign:function(){var t=this.visualMapModel,e=t.option;if("vertical"===e.orient)return l.getItemAlign(t,this.api,t.itemSize);var i=e.align;return i&&"auto"!==i||(i="left"),i},_renderEndsText:function(t,e,i,n,a){if(e){var r=new o.Group,s=this.visualMapModel.textStyleModel;r.add(new o.Text({style:{x:n?"right"===a?i[0]:0:i[0]/2,y:i[1]/2,textVerticalAlign:"middle",textAlign:n?a:"center",text:e,textFont:s.getFont(),textFill:s.getTextColor()}})),t.add(r)}},_getViewData:function(){var t=this.visualMapModel,e=a.map(t.getPieceList(),function(t,e){return{piece:t,indexInModelPieceList:e}}),i=t.get("text"),n=t.get("orient"),o=t.get("inverse");return("horizontal"===n?o:!o)?e.reverse():i&&(i=i.slice().reverse()),{viewPieceList:e,endsText:i}},_createItemSymbol:function(t,e,i){t.add(r.createSymbol(this.getControllerVisual(e,"symbol"),i[0],i[1],i[2],i[3],this.getControllerVisual(e,"color")))},_onItemClick:function(t){var e=this.visualMapModel,i=e.option,n=a.clone(i.selected),o=e.getSelectedMapKey(t);"single"===i.selectedMode?(n[o]=!0,a.each(n,function(t,e){n[e]=e===o})):n[o]=!n[o],this.api.dispatchAction({type:"selectDataRange",from:this.uid,visualMapId:this.visualMapModel.id,selected:n})}});t.exports=u},function(t,e,i){i(2).registerPreprocessor(i(264)),i(265),i(266),i(396),i(397),i(267)},function(t,e,i){i(2).registerPreprocessor(i(264)),i(265),i(266),i(398),i(399),i(267)},function(t,e,i){"use strict";function n(t,e,i){this._model=t}function a(t,e,i,n){var a=i.calendarModel,o=i.seriesModel,r=a?a.coordinateSystem:o?o.coordinateSystem:null;return r===this?r[t](n):null}var o=i(9),r=i(4),s=i(1),l=864e5;n.prototype={constructor:n,type:"calendar",dimensions:["time","value"],getDimensionsInfo:function(){return[{name:"time",type:"time"}]},getRangeInfo:function(){return this._rangeInfo},getModel:function(){return this._model},getRect:function(){return this._rect},getCellWidth:function(){return this._sw},getCellHeight:function(){return this._sh},getOrient:function(){return this._orient},getFirstDayOfWeek:function(){return this._firstDayOfWeek},getDateInfo:function(t){t=r.parseDate(t);var e=t.getFullYear(),i=t.getMonth()+1;i=i<10?"0"+i:i;var n=t.getDate();n=n<10?"0"+n:n;var a=t.getDay();return a=Math.abs((a+7-this.getFirstDayOfWeek())%7),{y:e,m:i,d:n,day:a,time:t.getTime(),formatedDate:e+"-"+i+"-"+n,date:t}},getNextNDay:function(t,e){return e=e||0,0===e?this.getDateInfo(t):(t=new Date(this.getDateInfo(t).time),t.setDate(t.getDate()+e),this.getDateInfo(t))},update:function(t,e){function i(t,e){return null!=t[e]&&"auto"!==t[e]}this._firstDayOfWeek=this._model.getModel("dayLabel").get("firstDay"),this._orient=this._model.get("orient"),this._lineWidth=this._model.getModel("itemStyle.normal").getItemStyle().lineWidth||0,this._rangeInfo=this._getRangeInfo(this._initRangeOption());var n=this._rangeInfo.weeks||1,a=["width","height"],r=this._model.get("cellSize").slice(),l=this._model.getBoxLayoutParams(),u="horizontal"===this._orient?[n,7]:[7,n];s.each([0,1],function(t){i(r,t)&&(l[a[t]]=r[t]*u[t])});var h={width:e.getWidth(),height:e.getHeight()},c=this._rect=o.getLayoutRect(l,h);s.each([0,1],function(t){i(r,t)||(r[t]=c[a[t]]/u[t])}),this._sw=r[0],this._sh=r[1]},dataToPoint:function(t,e){s.isArray(t)&&(t=t[0]),null==e&&(e=!0);var i=this.getDateInfo(t),n=this._rangeInfo,a=i.formatedDate;if(e&&!(i.time>=n.start.time&&i.time<=n.end.time))return[NaN,NaN];var o=i.day,r=this._getRangeInfo([n.start.time,a]).nthWeek;return"vertical"===this._orient?[this._rect.x+o*this._sw+this._sw/2,this._rect.y+r*this._sh+this._sh/2]:[this._rect.x+r*this._sw+this._sw/2,this._rect.y+o*this._sh+this._sh/2]},pointToData:function(t){var e=this.pointToDate(t);return e&&e.time},dataToRect:function(t,e){var i=this.dataToPoint(t,e);return{contentShape:{x:i[0]-(this._sw-this._lineWidth)/2,y:i[1]-(this._sh-this._lineWidth)/2,width:this._sw-this._lineWidth,height:this._sh-this._lineWidth},center:i,tl:[i[0]-this._sw/2,i[1]-this._sh/2],tr:[i[0]+this._sw/2,i[1]-this._sh/2],br:[i[0]+this._sw/2,i[1]+this._sh/2],bl:[i[0]-this._sw/2,i[1]+this._sh/2]}},pointToDate:function(t){var e=Math.floor((t[0]-this._rect.x)/this._sw)+1,i=Math.floor((t[1]-this._rect.y)/this._sh)+1,n=this._rangeInfo.range;return"vertical"===this._orient?this._getDateByWeeksAndDay(i,e-1,n):this._getDateByWeeksAndDay(e,i-1,n)},convertToPixel:s.curry(a,"dataToPoint"),convertFromPixel:s.curry(a,"pointToData"),_initRangeOption:function(){var t=this._model.get("range"),e=t;if(s.isArray(e)&&1===e.length&&(e=e[0]),/^\d{4}$/.test(e)&&(t=[e+"-01-01",e+"-12-31"]),/^\d{4}[\/|-]\d{1,2}$/.test(e)){var i=this.getDateInfo(e),n=i.date;n.setMonth(n.getMonth()+1);var a=this.getNextNDay(n,-1);t=[i.formatedDate,a.formatedDate]}/^\d{4}[\/|-]\d{1,2}[\/|-]\d{1,2}$/.test(e)&&(t=[e,e]);var o=this._getRangeInfo(t);return o.start.time>o.end.time&&t.reverse(),t},_getRangeInfo:function(t){t=[this.getDateInfo(t[0]),this.getDateInfo(t[1])];var e;t[0].time>t[1].time&&(e=!0,t.reverse());var i=Math.floor(t[1].time/l)-Math.floor(t[0].time/l)+1,n=new Date(t[0].time),a=n.getDate(),o=t[1].date.getDate();if(n.setDate(a+i-1),n.getDate()!==o)for(var r=n.getTime()-t[1].time>0?1:-1;n.getDate()!==o&&(n.getTime()-t[1].time)*r>0;)i-=r,n.setDate(a+i-1);var s=Math.floor((i+t[0].day+6)/7),u=e?-s+1:s-1;return e&&t.reverse(),{range:[t[0].formatedDate,t[1].formatedDate],start:t[0],end:t[1],allDay:i,weeks:s,nthWeek:u,fweek:t[0].day,lweek:t[1].day}},_getDateByWeeksAndDay:function(t,e,i){var n=this._getRangeInfo(i);if(t>n.weeks||0===t&&e<n.fweek||t===n.weeks&&e>n.lweek)return!1;var a=7*(t-1)-n.fweek+e,o=new Date(n.start.time);return o.setDate(n.start.d+a),this.getDateInfo(o)}},n.dimensions=n.prototype.dimensions,n.getDimensionsInfo=n.prototype.getDimensionsInfo,n.create=function(t,e){var i=[];return t.eachComponent("calendar",function(a){var o=new n(a,t,e);i.push(o),a.coordinateSystem=o}),t.eachSeries(function(t){"calendar"===t.get("coordinateSystem")&&(t.coordinateSystem=i[t.get("calendarIndex")||0])}),i},i(26).register("calendar",n),t.exports=n},function(t,e,i){"use strict";function n(t,e){var i=t.cellSize;o.isArray(i)?1===i.length&&(i[1]=i[0]):i=t.cellSize=[i,i];var n=o.map([0,1],function(t){return r.sizeCalculable(e,t)&&(i[t]="auto"),null!=i[t]&&"auto"!==i[t]});r.mergeLayoutParam(t,e,{type:"box",ignoreSize:n})}var a=i(13),o=i(1),r=i(9),s=a.extend({type:"calendar",coordinateSystem:null,defaultOption:{zlevel:0,z:2,left:80,top:60,cellSize:20,orient:"horizontal",splitLine:{show:!0,lineStyle:{color:"#000",width:1,type:"solid"}},itemStyle:{normal:{color:"#fff",borderWidth:1,borderColor:"#ccc"}},dayLabel:{show:!0,firstDay:0,position:"start",margin:"50%",nameMap:"en",color:"#000"},monthLabel:{show:!0,position:"start",margin:5,align:"center",nameMap:"en",formatter:null,color:"#000"},yearLabel:{show:!0,position:null,margin:30,formatter:null,color:"#ccc",fontFamily:"sans-serif",fontWeight:"bolder",fontSize:20}},init:function(t,e,i,a){var o=r.getLayoutParams(t);s.superApply(this,"init",arguments),n(t,o)},mergeOption:function(t,e){s.superApply(this,"mergeOption",arguments),n(this.option,t)}});t.exports=s},function(t,e,i){function n(t){var e=t.getRect(),i=t.getRangeInfo();return{coordSys:{type:"calendar",x:e.x,y:e.y,width:e.width,height:e.height,cellWidth:t.getCellWidth(),cellHeight:t.getCellHeight(),rangeInfo:{start:i.start,end:i.end,weeks:i.weeks,dayCount:i.allDay}},api:{coord:a.bind(t.dataToPoint,t)}}}var a=i(1);t.exports=n},function(t,e,i){function n(t,e){return e=e||[0,0],o.map(["x","y"],function(i,n){var a=this.getAxis(i),o=e[n],r=t[n]/2;return"category"===a.type?a.getBandWidth():Math.abs(a.dataToCoord(o-r)-a.dataToCoord(o+r))},this)}function a(t){var e=t.grid.getRect();return{coordSys:{type:"cartesian2d",x:e.x,y:e.y,width:e.width,height:e.height},api:{coord:o.bind(t.dataToPoint,t),size:o.bind(n,t)}}}var o=i(1);t.exports=a},function(t,e,i){function n(t,e,i,n,a){l.call(this,t),this.map=e,this._nameCoordMap=r.createHashMap(),this.loadGeoJson(i,n,a)}function a(t,e,i,n){var a=i.geoModel,o=i.seriesModel,r=a?a.coordinateSystem:o?o.coordinateSystem||(o.getReferringComponents("geo")[0]||{}).coordinateSystem:null;return r===this?r[t](n):null}var o=i(270),r=i(1),s=i(12),l=i(268),u=[i(410),i(411),i(409),i(408)];n.prototype={constructor:n,type:"geo",dimensions:["lng","lat"],containCoord:function(t){for(var e=this.regions,i=0;i<e.length;i++)if(e[i].contain(t))return!0;return!1},loadGeoJson:function(t,e,i){try{this.regions=t?o(t):[]}catch(t){throw"Invalid geoJson format\n"+t.message}e=e||{},i=i||{};for(var n=this.regions,a=r.createHashMap(),s=0;s<n.length;s++){var l=n[s].name;l=i.hasOwnProperty(l)?i[l]:l,n[s].name=l,a.set(l,n[s]),this.addGeoCoord(l,n[s].center);var h=e[l];h&&n[s].transformTo(h.left,h.top,h.width,h.height)}this._regionsMap=a,this._rect=null,r.each(u,function(t){t(this)},this)},transformTo:function(t,e,i,n){var a=this.getBoundingRect();a=a.clone(),a.y=-a.y-a.height;var o=this._viewTransform;o.transform=a.calculateTransform(new s(t,e,i,n)),o.decomposeTransform();var r=o.scale;r[1]=-r[1],o.updateTransform(),this._updateTransform()},getRegion:function(t){return this._regionsMap.get(t)},getRegionByCoord:function(t){for(var e=this.regions,i=0;i<e.length;i++)if(e[i].contain(t))return e[i]},addGeoCoord:function(t,e){this._nameCoordMap.set(t,e)},getGeoCoord:function(t){return this._nameCoordMap.get(t)},getBoundingRect:function(){if(this._rect)return this._rect;for(var t,e=this.regions,i=0;i<e.length;i++){var n=e[i].getBoundingRect();t=t||n.clone(),t.union(n)}return this._rect=t||new s(0,0,0,0)},dataToPoint:function(t){if("string"==typeof t&&(t=this.getGeoCoord(t)),t)return l.prototype.dataToPoint.call(this,t)},convertToPixel:r.curry(a,"dataToPoint"),convertFromPixel:r.curry(a,"pointToData")},r.mixin(n,l),t.exports=n},function(t,e,i){"use strict";var n=i(5),a=i(13),o=i(11),r=i(1),s=i(83),l=i(192),u=a.extend({type:"geo",coordinateSystem:null,layoutMode:"box",init:function(t){a.prototype.init.apply(this,arguments),n.defaultEmphasis(t.label,["show"])},optionUpdated:function(){var t=this.option,e=this;t.regions=l.getFilledRegions(t.regions,t.map,t.nameMap),this._optionModelMap=r.reduce(t.regions||[],function(t,i){return i.name&&t.set(i.name,new o(i,e)),t},r.createHashMap()),this.updateSelectedMap(t.regions)},defaultOption:{zlevel:0,z:0,show:!0,left:"center",top:"center",aspectScale:.75,silent:!1,map:"",boundingCoords:null,center:null,zoom:1,scaleLimit:null,label:{normal:{show:!1,color:"#000"},emphasis:{show:!0,color:"rgb(100,0,0)"}},itemStyle:{normal:{borderWidth:.5,borderColor:"#444",color:"#eee"},emphasis:{color:"rgba(255,215,0,0.8)"}},regions:[]},getRegionModel:function(t){return this._optionModelMap.get(t)||new o(null,this,this.ecModel)},getFormattedLabel:function(t,e){var i=this.getRegionModel(t),n=i.get("label."+e+".formatter"),a={name:t};return"function"==typeof n?(a.status=e,n(a)):"string"==typeof n?n.replace("{a}",null!=t?t:""):void 0},setZoom:function(t){this.option.zoom=t},setCenter:function(t){this.option.center=t}});r.mixin(u,s),t.exports=u},function(t,e){var i=[[[123.45165252685547,25.73527164402261],[123.49731445312499,25.73527164402261],[123.49731445312499,25.750734064600884],[123.45165252685547,25.750734064600884],[123.45165252685547,25.73527164402261]]];t.exports=function(t){if("china"===t.map)for(var e=0,n=t.regions.length;e<n;++e)"台湾"===t.regions[e].name&&t.regions[e].geometries.push({type:"polygon",exterior:i[0]})}},function(t,e,i){var n=i(1),a={Russia:[100,60],"United States":[-99,38],"United States of America":[-99,38]};t.exports=function(t){n.each(t.regions,function(t){var e=a[t.name];if(e){var i=t.center;i[0]=e[0],i[1]=e[1]}})}},function(t,e,i){for(var n=i(269),a=i(1),o=[126,25],r=[[[0,3.5],[7,11.2],[15,11.9],[30,7],[42,.7],[52,.7],[56,7.7],[59,.7],[64,.7],[64,0],[5,0],[0,3.5]],[[13,16.1],[19,14.7],[16,21.7],[11,23.1],[13,16.1]],[[12,32.2],[14,38.5],[15,38.5],[13,32.2],[12,32.2]],[[16,47.6],[12,53.2],[13,53.2],[18,47.6],[16,47.6]],[[6,64.4],[8,70],[9,70],[8,64.4],[6,64.4]],[[23,82.6],[29,79.8],[30,79.8],[25,82.6],[23,82.6]],[[37,70.7],[43,62.3],[44,62.3],[39,70.7],[37,70.7]],[[48,51.1],[51,45.5],[53,45.5],[50,51.1],[48,51.1]],[[51,35],[51,28.7],[53,28.7],[53,35],[51,35]],[[52,22.4],[55,17.5],[56,17.5],[53,22.4],[52,22.4]],[[58,12.6],[62,7],[63,7],[60,12.6],[58,12.6]],[[0,3.5],[0,93.1],[64,93.1],[64,0],[63,0],[63,92.4],[1,92.4],[1,3.5],[0,3.5]]],s=0;s<r.length;s++)for(var l=0;l<r[s].length;l++)r[s][l][0]/=10.5,r[s][l][1]/=-14,r[s][l][0]+=o[0],r[s][l][1]+=o[1];t.exports=function(t){"china"===t.map&&t.regions.push(new n("南海诸岛",a.map(r,function(t){return{type:"polygon",exterior:t}}),o))}},function(t,e,i){var n=i(1),a={"南海诸岛":[32,80],"广东":[0,-10],"香港":[10,5],"澳门":[-10,10],"天津":[5,5]};t.exports=function(t){n.each(t.regions,function(t){var e=a[t.name];if(e){var i=t.center;i[0]+=e[0]/10.5,i[1]+=-e[1]/14}})}},function(t,e,i){function n(t,e){return e=e||[0,0],o.map([0,1],function(i){var n=e[i],a=t[i]/2,o=[],r=[];return o[i]=n-a,r[i]=n+a,o[1-i]=r[1-i]=e[1-i],Math.abs(this.dataToPoint(o)[i]-this.dataToPoint(r)[i])},this)}function a(t){var e=t.getBoundingRect();return{coordSys:{type:"geo",x:e.x,y:e.y,width:e.width,height:e.height},api:{coord:o.bind(t.dataToPoint,t),size:o.bind(n,t)}}}var o=i(1);t.exports=a},function(t,e,i){function n(t,e){return e.type||(e.data?"category":"value")}var a=i(13),o=i(1),r=i(31),s=i(62),l=i(4),u=a.extend({type:"baseParallelAxis",axis:null,activeIntervals:[],getAreaSelectStyle:function(){return r([["fill","color"],["lineWidth","borderWidth"],["stroke","borderColor"],["width","width"],["opacity","opacity"]]).call(this.getModel("areaSelectStyle"))},setActiveIntervals:function(t){var e=this.activeIntervals=o.clone(t);if(e)for(var i=e.length-1;i>=0;i--)l.asc(e[i])},getActiveState:function(t){var e=this.activeIntervals;if(!e.length)return"normal";if(null==t)return"inactive";for(var i=0,n=e.length;i<n;i++)if(e[i][0]<=t&&t<=e[i][1])return"active";return"inactive"}}),h={type:"value",dim:null,areaSelectStyle:{width:20,borderWidth:1,borderColor:"rgba(160,197,232)",color:"rgba(160,197,232)",opacity:.3},realtime:!0,z:10};o.merge(u.prototype,i(42)),s("parallel",u,n,h),t.exports=u},function(t,e,i){function n(t,e,i){this._axesMap=u.createHashMap(),this._axesLayout={},this.dimensions=t.dimensions,this._rect,this._model=t,this._init(t,e,i)}function a(t,e){return m(v(t,e[0]),e[1])}function o(t,e){var i=e.layoutLength/(e.axisCount-1);return{position:i*t,axisNameAvailableWidth:i,axisLabelShow:!0}}function r(t,e){var i,n,a=e.layoutLength,o=e.axisExpandWidth,r=e.axisCount,s=e.axisCollapseWidth,l=e.winInnerIndices,u=s,h=!1;return t<l[0]?(i=t*s,n=s):t<=l[1]?(i=e.axisExpandWindow0Pos+t*o-e.axisExpandWindow[0],u=o,h=!0):(i=a-(r-1-t)*s,n=s),{position:i,axisNameAvailableWidth:u,axisLabelShow:h,nameTruncateMaxWidth:n}}var s=i(9),l=i(18),u=i(1),h=i(415),c=i(3),d=i(19),f=i(4),p=i(59),g=u.each,m=Math.min,v=Math.max,y=Math.floor,x=Math.ceil,_=f.round,b=Math.PI;n.prototype={type:"parallel",constructor:n,_init:function(t,e,i){var n=t.dimensions,a=t.parallelAxisIndex;g(n,function(t,i){var n=a[i],o=e.getComponent("parallelAxis",n),r=this._axesMap.set(t,new h(t,l.createScaleByModel(o),[0,0],o.get("type"),n)),s="category"===r.type;r.onBand=s&&o.get("boundaryGap"),r.inverse=o.get("inverse"),o.axis=r,r.model=o,r.coordinateSystem=o.coordinateSystem=this},this)},update:function(t,e){this._updateAxesFromSeries(this._model,t)},containPoint:function(t){var e=this._makeLayoutInfo(),i=e.axisBase,n=e.layoutBase,a=e.pixelDimIndex,o=t[1-a],r=t[a];return o>=i&&o<=i+e.axisLength&&r>=n&&r<=n+e.layoutLength},_updateAxesFromSeries:function(t,e){e.eachSeries(function(i){if(t.contains(i,e)){var n=i.getData();g(this.dimensions,function(t){var e=this._axesMap.get(t);e.scale.unionExtentFromData(n,t),l.niceScaleExtent(e.scale,e.model)},this)}},this)},resize:function(t,e){this._rect=s.getLayoutRect(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()}),this._layoutAxes()},getRect:function(){return this._rect},_makeLayoutInfo:function(){var t,e=this._model,i=this._rect,n=["x","y"],o=["width","height"],r=e.get("layout"),s="horizontal"===r?0:1,l=i[o[s]],u=[0,l],h=this.dimensions.length,c=a(e.get("axisExpandWidth"),u),d=a(e.get("axisExpandCount")||0,[0,h]),f=e.get("axisExpandable")&&h>3&&h>d&&d>1&&c>0&&l>0,p=e.get("axisExpandWindow");if(p)t=a(p[1]-p[0],u),p[1]=p[0]+t;else{t=a(c*(d-1),u);var g=e.get("axisExpandCenter")||y(h/2);p=[c*g-t/2],p[1]=p[0]+t}var m=(l-t)/(h-d);m<3&&(m=0);var v=[y(_(p[0]/c,1))+1,x(_(p[1]/c,1))-1],b=m/c*p[0];return{layout:r,pixelDimIndex:s,layoutBase:i[n[s]],layoutLength:l,axisBase:i[n[1-s]],axisLength:i[o[1-s]],axisExpandable:f,axisExpandWidth:c,axisCollapseWidth:m,axisExpandWindow:p,axisCount:h,winInnerIndices:v,axisExpandWindow0Pos:b}},_layoutAxes:function(){var t=this._rect,e=this._axesMap,i=this.dimensions,n=this._makeLayoutInfo(),a=n.layout;
e.each(function(t){var e=[0,n.axisLength],i=t.inverse?1:0;t.setExtent(e[i],e[1-i])}),g(i,function(i,s){var l=(n.axisExpandable?r:o)(s,n),u={horizontal:{x:l.position,y:n.axisLength},vertical:{x:0,y:l.position}},h={horizontal:b/2,vertical:0},c=[u[a].x+t.x,u[a].y+t.y],f=h[a],p=d.create();d.rotate(p,p,f),d.translate(p,p,c),this._axesLayout[i]={position:c,rotation:f,transform:p,axisNameAvailableWidth:l.axisNameAvailableWidth,axisLabelShow:l.axisLabelShow,nameTruncateMaxWidth:l.nameTruncateMaxWidth,tickDirection:1,labelDirection:1,labelInterval:e.get(i).getLabelInterval()}},this)},getAxis:function(t){return this._axesMap.get(t)},dataToPoint:function(t,e){return this.axisCoordToPoint(this._axesMap.get(e).dataToCoord(t),e)},eachActiveState:function(t,e,i){for(var n=this.dimensions,a=this._axesMap,o=this.hasAxisBrushed(),r=0,s=t.count();r<s;r++){var l,u=t.getValues(n,r);if(o){l="active";for(var h=0,c=n.length;h<c;h++){var d=n[h],f=a.get(d).model.getActiveState(u[h],h);if("inactive"===f){l="inactive";break}}}else l="normal";e.call(i,l,r)}},hasAxisBrushed:function(){for(var t=this.dimensions,e=this._axesMap,i=!1,n=0,a=t.length;n<a;n++)"normal"!==e.get(t[n]).model.getActiveState()&&(i=!0);return i},axisCoordToPoint:function(t,e){var i=this._axesLayout[e];return c.applyTransform([t,0],i.transform)},getAxisLayout:function(t){return u.clone(this._axesLayout[t])},getSlidedAxisExpandWindow:function(t){var e=this._makeLayoutInfo(),i=e.pixelDimIndex,n=e.axisExpandWindow.slice(),a=n[1]-n[0],o=[0,e.axisExpandWidth*(e.axisCount-1)];if(!this.containPoint(t))return{behavior:"none",axisExpandWindow:n};var r,s=t[i]-e.layoutBase-e.axisExpandWindow0Pos,l="slide",u=e.axisCollapseWidth,h=this._model.get("axisExpandSlideTriggerArea"),c=null!=h[0];if(u)c&&u&&s<a*h[0]?(l="jump",r=s-a*h[2]):c&&u&&s>a*(1-h[0])?(l="jump",r=s-a*(1-h[2])):(r=s-a*h[1])>=0&&(r=s-a*(1-h[1]))<=0&&(r=0),r*=e.axisExpandWidth/u,r?p(r,n,o,"all"):l="none";else{var a=n[1]-n[0],d=o[1]*s/a;n=[v(0,d-a/2)],n[1]=m(o[1],n[0]+a),n[0]=n[1]-a}return{axisExpandWindow:n,behavior:l}}},t.exports=n},function(t,e,i){var n=i(1),a=i(33),o=function(t,e,i,n,o){a.call(this,t,e,i),this.type=n||"value",this.axisIndex=o};o.prototype={constructor:o,model:null},n.inherits(o,a),t.exports=o},function(t,e,i){var n=i(1),a=i(13);i(413),a.extend({type:"parallel",dependencies:["parallelAxis"],coordinateSystem:null,dimensions:null,parallelAxisIndex:null,layoutMode:"box",defaultOption:{zlevel:0,z:0,left:80,top:60,right:80,bottom:60,layout:"horizontal",axisExpandable:!1,axisExpandCenter:null,axisExpandCount:0,axisExpandWidth:50,axisExpandRate:17,axisExpandDebounce:50,axisExpandSlideTriggerArea:[-.15,.05,.4],axisExpandTriggerOn:"click",parallelAxisDefault:null},init:function(){a.prototype.init.apply(this,arguments),this.mergeOption({})},mergeOption:function(t){var e=this.option;t&&n.merge(e,t,!0),this._initDimensions()},contains:function(t,e){var i=t.get("parallelIndex");return null!=i&&e.getComponent("parallel",i)===this},setAxisExpand:function(t){n.each(["axisExpandable","axisExpandCenter","axisExpandCount","axisExpandWidth","axisExpandWindow"],function(e){t.hasOwnProperty(e)&&(this.option[e]=t[e])},this)},_initDimensions:function(){var t=this.dimensions=[],e=this.parallelAxisIndex=[],i=n.filter(this.dependentModels.parallelAxis,function(t){return t.get("parallelIndex")===this.componentIndex});n.each(i,function(i){t.push("dim"+i.get("dim")),e.push(i.componentIndex)})}})},function(t,e,i){function n(t){if(!t.parallel){var e=!1;o.each(t.series,function(t){t&&"parallel"===t.type&&(e=!0)}),e&&(t.parallel=[{}])}}function a(t){var e=r.normalizeToArray(t.parallelAxis);o.each(e,function(e){if(o.isObject(e)){var i=e.parallelIndex||0,n=r.normalizeToArray(t.parallel)[i];n&&n.parallelAxisDefault&&o.merge(e,n.parallelAxisDefault,!1)}})}var o=i(1),r=i(5);t.exports=function(t){n(t),a(t)}},function(t,e,i){"use strict";function n(t,e){e=e||[0,360],o.call(this,"angle",t,e),this.type="category"}var a=i(1),o=i(33);n.prototype={constructor:n,pointToData:function(t,e){return this.polar.pointToData(t,e)["radius"===this.dim?0:1]},dataToAngle:o.prototype.dataToCoord,angleToData:o.prototype.coordToData},a.inherits(n,o),t.exports=n},function(t,e,i){"use strict";function n(t,e){return e.type||(e.data?"category":"value")}var a=i(1),o=i(13),r=i(62),s=o.extend({type:"polarAxis",axis:null,getCoordSysModel:function(){return this.ecModel.queryComponents({mainType:"polar",index:this.option.polarIndex,id:this.option.polarId})[0]}});a.merge(s.prototype,i(42));var l={angle:{startAngle:90,clockwise:!0,splitNumber:12,axisLabel:{rotate:!1}},radius:{splitNumber:5}};r("angle",s,n,l.angle),r("radius",s,n,l.radius)},function(t,e,i){"use strict";var n=i(422),a=i(418),o=function(t){this.name=t||"",this.cx=0,this.cy=0,this._radiusAxis=new n,this._angleAxis=new a,this._radiusAxis.polar=this._angleAxis.polar=this};o.prototype={type:"polar",axisPointerEnabled:!0,constructor:o,dimensions:["radius","angle"],model:null,containPoint:function(t){var e=this.pointToCoord(t);return this._radiusAxis.contain(e[0])&&this._angleAxis.contain(e[1])},containData:function(t){return this._radiusAxis.containData(t[0])&&this._angleAxis.containData(t[1])},getAxis:function(t){return this["_"+t+"Axis"]},getAxes:function(){return[this._radiusAxis,this._angleAxis]},getAxesByScale:function(t){var e=[],i=this._angleAxis,n=this._radiusAxis;return i.scale.type===t&&e.push(i),n.scale.type===t&&e.push(n),e},getAngleAxis:function(){return this._angleAxis},getRadiusAxis:function(){return this._radiusAxis},getOtherAxis:function(t){var e=this._angleAxis;return t===e?this._radiusAxis:e},getBaseAxis:function(){return this.getAxesByScale("ordinal")[0]||this.getAxesByScale("time")[0]||this.getAngleAxis()},getTooltipAxes:function(t){var e=null!=t&&"auto"!==t?this.getAxis(t):this.getBaseAxis();return{baseAxes:[e],otherAxes:[this.getOtherAxis(e)]}},dataToPoint:function(t,e){return this.coordToPoint([this._radiusAxis.dataToRadius(t[0],e),this._angleAxis.dataToAngle(t[1],e)])},pointToData:function(t,e){var i=this.pointToCoord(t);return[this._radiusAxis.radiusToData(i[0],e),this._angleAxis.angleToData(i[1],e)]},pointToCoord:function(t){var e=t[0]-this.cx,i=t[1]-this.cy,n=this.getAngleAxis(),a=n.getExtent(),o=Math.min(a[0],a[1]),r=Math.max(a[0],a[1]);n.inverse?o=r-360:r=o+360;var s=Math.sqrt(e*e+i*i);e/=s,i/=s;for(var l=Math.atan2(-i,e)/Math.PI*180,u=l<o?1:-1;l<o||l>r;)l+=360*u;return[s,l]},coordToPoint:function(t){var e=t[0],i=t[1]/180*Math.PI,n=Math.cos(i)*e+this.cx,a=-Math.sin(i)*e+this.cy;return[n,a]}},t.exports=o},function(t,e,i){"use strict";i(419),i(2).extendComponentModel({type:"polar",dependencies:["polarAxis","angleAxis"],coordinateSystem:null,findAxisModel:function(t){var e,i=this.ecModel;return i.eachComponent(t,function(t){t.getCoordSysModel()===this&&(e=t)},this),e},defaultOption:{zlevel:0,z:0,center:["50%","50%"],radius:"80%"}})},function(t,e,i){"use strict";function n(t,e){o.call(this,"radius",t,e),this.type="category"}var a=i(1),o=i(33);n.prototype={constructor:n,pointToData:function(t,e){return this.polar.pointToData(t,e)["radius"===this.dim?0:1]},dataToRadius:o.prototype.dataToCoord,radiusToData:o.prototype.coordToData},a.inherits(n,o),t.exports=n},function(t,e,i){function n(t,e){return o.map(["Radius","Angle"],function(i,n){var a=this["get"+i+"Axis"](),o=e[n],r=t[n]/2,s="dataTo"+i,l="category"===a.type?a.getBandWidth():Math.abs(a[s](o-r)-a[s](o+r));return"Angle"===i&&(l=l*Math.PI/180),l},this)}function a(t){var e=t.getRadiusAxis(),i=t.getAngleAxis(),a=e.getExtent();return a[0]>a[1]&&a.reverse(),{coordSys:{type:"polar",cx:t.cx,cy:t.cy,r:a[1],r0:a[0]},api:{coord:o.bind(function(n){var a=e.dataToRadius(n[0]),o=i.dataToAngle(n[1]),r=t.coordToPoint([a,o]);return r.push(a,o*Math.PI/180),r}),size:o.bind(n,t)}}}var o=i(1);t.exports=a},function(t,e,i){function n(t,e,i){o.call(this,t,e,i),this.type="value",this.angle=0,this.name="",this.model}var a=i(1),o=i(33);a.inherits(n,o),t.exports=n},function(t,e,i){function n(t,e,i){this._model=t,this.dimensions=[],this._indicatorAxes=a.map(t.getIndicatorModels(),function(t,e){var i="indicator_"+e,n=new o(i,new r);return n.name=t.get("name"),n.model=t,t.axis=n,this.dimensions.push(i),n},this),this.resize(t,i),this.cx,this.cy,this.r,this.startAngle}var a=i(1),o=i(424),r=i(45),s=i(4),l=i(18);n.prototype.getIndicatorAxes=function(){return this._indicatorAxes},n.prototype.dataToPoint=function(t,e){var i=this._indicatorAxes[e];return this.coordToPoint(i.dataToCoord(t),e)},n.prototype.coordToPoint=function(t,e){var i=this._indicatorAxes[e],n=i.angle,a=this.cx+t*Math.cos(n),o=this.cy-t*Math.sin(n);return[a,o]},n.prototype.pointToData=function(t){var e=t[0]-this.cx,i=t[1]-this.cy,n=Math.sqrt(e*e+i*i);e/=n,i/=n;for(var a,o=Math.atan2(-i,e),r=1/0,s=-1,l=0;l<this._indicatorAxes.length;l++){var u=this._indicatorAxes[l],h=Math.abs(o-u.angle);h<r&&(a=u,s=l,r=h)}return[s,+(a&&a.coodToData(n))]},n.prototype.resize=function(t,e){var i=t.get("center"),n=e.getWidth(),o=e.getHeight(),r=Math.min(n,o)/2;this.cx=s.parsePercent(i[0],n),this.cy=s.parsePercent(i[1],o),this.startAngle=t.get("startAngle")*Math.PI/180,this.r=s.parsePercent(t.get("radius"),r),a.each(this._indicatorAxes,function(t,e){t.setExtent(0,this.r);var i=this.startAngle+e*Math.PI*2/this._indicatorAxes.length;i=Math.atan2(Math.sin(i),Math.cos(i)),t.angle=i},this)},n.prototype.update=function(t,e){function i(t){var e=Math.pow(10,Math.floor(Math.log(t)/Math.LN10)),i=t/e;return 2===i?i=5:i*=2,i*e}var n=this._indicatorAxes,o=this._model;a.each(n,function(t){t.scale.setExtent(1/0,-(1/0))}),t.eachSeriesByType("radar",function(e,i){if("radar"===e.get("coordinateSystem")&&t.getComponent("radar",e.get("radarIndex"))===o){var r=e.getData();a.each(n,function(t){t.scale.unionExtentFromData(r,t.dim)})}},this);var r=o.get("splitNumber");a.each(n,function(t,e){var n=l.getScaleExtent(t.scale,t.model);l.niceScaleExtent(t.scale,t.model);var a=t.model,o=t.scale,u=a.getMin(),h=a.getMax(),c=o.getInterval();if(null!=u&&null!=h)o.setExtent(+u,+h),o.setInterval((h-u)/r);else if(null!=u){var d;do d=u+c*r,o.setExtent(+u,d),o.setInterval(c),c=i(c);while(d<n[1]&&isFinite(d)&&isFinite(n[1]))}else if(null!=h){var f;do f=h-c*r,o.setExtent(f,+h),o.setInterval(c),c=i(c);while(f>n[0]&&isFinite(f)&&isFinite(n[0]))}else{var p=o.getTicks().length-1;p>r&&(c=i(c));var g=Math.round((n[0]+n[1])/2/c)*c,m=Math.round(r/2);o.setExtent(s.round(g-m*c),s.round(g+(r-m)*c)),o.setInterval(c)}})},n.dimensions=[],n.create=function(t,e){var i=[];return t.eachComponent("radar",function(a){var o=new n(a,t,e);i.push(o),a.coordinateSystem=o}),t.eachSeriesByType("radar",function(t){"radar"===t.get("coordinateSystem")&&(t.coordinateSystem=i[t.get("radarIndex")||0])}),i},i(26).register("radar",n),t.exports=n},function(t,e,i){function n(t,e){return s.defaults({show:e},t)}var a=i(101),o=a.valueAxis,r=i(11),s=i(1),l=i(42),u=i(2).extendComponentModel({type:"radar",optionUpdated:function(){var t=this.get("boundaryGap"),e=this.get("splitNumber"),i=this.get("scale"),n=this.get("axisLine"),a=this.get("axisTick"),o=this.get("axisLabel"),u=this.get("name"),h=this.get("name.show"),c=this.get("name.formatter"),d=this.get("nameGap"),f=this.get("triggerEvent"),p=s.map(this.get("indicator")||[],function(p){null!=p.max&&p.max>0&&!p.min?p.min=0:null!=p.min&&p.min<0&&!p.max&&(p.max=0);var g=u;if(null!=p.color&&(g=s.defaults({color:p.color},u)),p=s.merge(s.clone(p),{boundaryGap:t,splitNumber:e,scale:i,axisLine:n,axisTick:a,axisLabel:o,name:p.text,nameLocation:"end",nameGap:d,nameTextStyle:g,triggerEvent:f},!1),h||(p.name=""),"string"==typeof c){var m=p.name;p.name=c.replace("{value}",null!=m?m:"")}else"function"==typeof c&&(p.name=c(p.name,p));var v=s.extend(new r(p,null,this.ecModel),l);return v.mainType="radar",v.componentIndex=this.componentIndex,v},this);this.getIndicatorModels=function(){return p}},defaultOption:{zlevel:0,z:0,center:["50%","50%"],radius:"75%",startAngle:90,name:{show:!0},boundaryGap:[0,0],splitNumber:5,nameGap:15,scale:!1,shape:"polygon",axisLine:s.merge({lineStyle:{color:"#bbb"}},o.axisLine),axisLabel:n(o.axisLabel,!1),axisTick:n(o.axisTick,!1),splitLine:n(o.splitLine,!0),splitArea:n(o.splitArea,!0),indicator:[]}});t.exports=u},function(t,e,i){function n(t,e){return e.type||(e.data?"category":"value")}var a=i(13),o=i(62),r=i(1),s=a.extend({type:"singleAxis",layoutMode:"box",axis:null,coordinateSystem:null,getCoordSysModel:function(){return this}}),l={left:"5%",top:"5%",right:"5%",bottom:"5%",type:"value",position:"bottom",orient:"horizontal",axisLine:{show:!0,lineStyle:{width:2,type:"solid"}},tooltip:{show:!0},axisTick:{show:!0,length:6,lineStyle:{width:2}},axisLabel:{show:!0,interval:"auto"},splitLine:{show:!0,lineStyle:{type:"dashed",opacity:.2}}};r.merge(s.prototype,i(42)),o("single",s,n,l),t.exports=s},function(t,e,i){function n(t,e,i){this.dimension="single",this.dimensions=["single"],this._axis=null,this._rect,this._init(t,e,i),this.model=t}var a=i(429),o=i(18),r=i(9);n.prototype={type:"singleAxis",axisPointerEnabled:!0,constructor:n,_init:function(t,e,i){var n=this.dimension,r=new a(n,o.createScaleByModel(t),[0,0],t.get("type"),t.get("position")),s="category"===r.type;r.onBand=s&&t.get("boundaryGap"),r.inverse=t.get("inverse"),r.orient=t.get("orient"),t.axis=r,r.model=t,r.coordinateSystem=this,this._axis=r},update:function(t,e){t.eachSeries(function(t){if(t.coordinateSystem===this){var e=t.getData(),i=this.dimension;this._axis.scale.unionExtentFromData(e,t.coordDimToDataDim(i)),o.niceScaleExtent(this._axis.scale,this._axis.model)}},this)},resize:function(t,e){this._rect=r.getLayoutRect({left:t.get("left"),top:t.get("top"),right:t.get("right"),bottom:t.get("bottom"),width:t.get("width"),height:t.get("height")},{width:e.getWidth(),height:e.getHeight()}),this._adjustAxis()},getRect:function(){return this._rect},_adjustAxis:function(){var t=this._rect,e=this._axis,i=e.isHorizontal(),n=i?[0,t.width]:[0,t.height],a=e.reverse?1:0;e.setExtent(n[a],n[1-a]),this._updateAxisTransform(e,i?t.x:t.y)},_updateAxisTransform:function(t,e){var i=t.getExtent(),n=i[0]+i[1],a=t.isHorizontal();t.toGlobalCoord=a?function(t){return t+e}:function(t){return n-t+e},t.toLocalCoord=a?function(t){return t-e}:function(t){return n-t+e}},getAxis:function(){return this._axis},getBaseAxis:function(){return this._axis},getAxes:function(){return[this._axis]},getTooltipAxes:function(){return{baseAxes:[this.getAxis()]}},containPoint:function(t){var e=this.getRect(),i=this.getAxis(),n=i.orient;return"horizontal"===n?i.contain(i.toLocalCoord(t[0]))&&t[1]>=e.y&&t[1]<=e.y+e.height:i.contain(i.toLocalCoord(t[1]))&&t[0]>=e.y&&t[0]<=e.y+e.height},pointToData:function(t){var e=this.getAxis();return[e.coordToData(e.toLocalCoord(t["horizontal"===e.orient?0:1]))]},dataToPoint:function(t){var e=this.getAxis(),i=this.getRect(),n=[],a="horizontal"===e.orient?0:1;return t instanceof Array&&(t=t[0]),n[a]=e.toGlobalCoord(e.dataToCoord(+t)),n[1-a]=0===a?i.y+i.height/2:i.x+i.width/2,n}},t.exports=n},function(t,e,i){var n=i(1),a=i(33),o=function(t,e,i,n,o){a.call(this,t,e,i),this.type=n||"value",this.position=o||"bottom",this.orient=null,this._labelInterval=null};o.prototype={constructor:o,model:null,isHorizontal:function(){var t=this.position;return"top"===t||"bottom"===t},pointToData:function(t,e){return this.coordinateSystem.pointToData(t,e)[0]},toGlobalCoord:null,toLocalCoord:null},n.inherits(o,a),t.exports=o},function(t,e,i){function n(t,e){var i=this.getAxis(),n=e instanceof Array?e[0]:e,a=(t instanceof Array?t[0]:t)/2;return"category"===i.type?i.getBandWidth():Math.abs(i.dataToCoord(n-a)-i.dataToCoord(n+a))}function a(t){var e=t.getRect();return{coordSys:{type:"singleAxis",x:e.x,y:e.y,width:e.width,height:e.height},api:{coord:o.bind(t.dataToPoint,t),size:o.bind(n,t)}}}var o=i(1);t.exports=a},function(t,e,i){function n(t,e){var i=[];return t.eachComponent("singleAxis",function(n,o){var r=new a(n,t,e);r.name="single_"+o,r.resize(n,e),n.coordinateSystem=r,i.push(r)}),t.eachSeries(function(e){if("singleAxis"===e.get("coordinateSystem")){var i=t.queryComponents({mainType:"singleAxis",index:e.get("singleAxisIndex"),id:e.get("singleAxisId")})[0];e.coordinateSystem=i&&i.coordinateSystem}}),i}var a=i(428);i(26).register("single",{create:n,dimensions:a.prototype.dimensions})},function(t,e,i){"use strict";function n(t){return"_EC_"+t}function a(t,e){this.id=null==t?"":t,this.inEdges=[],this.outEdges=[],this.edges=[],this.hostGraph,this.dataIndex=null==e?-1:e}function o(t,e,i){this.node1=t,this.node2=e,this.dataIndex=null==i?-1:i}var r=i(1),s=function(t){this._directed=t||!1,this.nodes=[],this.edges=[],this._nodesMap={},this._edgesMap={},this.data,this.edgeData},l=s.prototype;l.type="graph",l.isDirected=function(){return this._directed},l.addNode=function(t,e){t=t||""+e;var i=this._nodesMap;if(!i[n(t)]){var o=new a(t,e);return o.hostGraph=this,this.nodes.push(o),i[n(t)]=o,o}},l.getNodeByIndex=function(t){var e=this.data.getRawIndex(t);return this.nodes[e]},l.getNodeById=function(t){return this._nodesMap[n(t)]},l.addEdge=function(t,e,i){var r=this._nodesMap,s=this._edgesMap;if("number"==typeof t&&(t=this.nodes[t]),"number"==typeof e&&(e=this.nodes[e]),t instanceof a||(t=r[n(t)]),e instanceof a||(e=r[n(e)]),t&&e){var l=t.id+"-"+e.id;if(!s[l]){var u=new o(t,e,i);return u.hostGraph=this,this._directed&&(t.outEdges.push(u),e.inEdges.push(u)),t.edges.push(u),t!==e&&e.edges.push(u),this.edges.push(u),s[l]=u,u}}},l.getEdgeByIndex=function(t){var e=this.edgeData.getRawIndex(t);return this.edges[e]},l.getEdge=function(t,e){t instanceof a&&(t=t.id),e instanceof a&&(e=e.id);var i=this._edgesMap;return this._directed?i[t+"-"+e]:i[t+"-"+e]||i[e+"-"+t]},l.eachNode=function(t,e){for(var i=this.nodes,n=i.length,a=0;a<n;a++)i[a].dataIndex>=0&&t.call(e,i[a],a)},l.eachEdge=function(t,e){for(var i=this.edges,n=i.length,a=0;a<n;a++)i[a].dataIndex>=0&&i[a].node1.dataIndex>=0&&i[a].node2.dataIndex>=0&&t.call(e,i[a],a)},l.breadthFirstTraverse=function(t,e,i,o){if(e instanceof a||(e=this._nodesMap[n(e)]),e){for(var r="out"===i?"outEdges":"in"===i?"inEdges":"edges",s=0;s<this.nodes.length;s++)this.nodes[s].__visited=!1;if(!t.call(o,e,null))for(var l=[e];l.length;)for(var u=l.shift(),h=u[r],s=0;s<h.length;s++){var c=h[s],d=c.node1===u?c.node2:c.node1;if(!d.__visited){if(t.call(o,d,u))return;l.push(d),d.__visited=!0}}}},l.update=function(){for(var t=this.data,e=this.edgeData,i=this.nodes,n=this.edges,a=0,o=i.length;a<o;a++)i[a].dataIndex=-1;for(var a=0,o=t.count();a<o;a++)i[t.getRawIndex(a)].dataIndex=a;e.filterSelf(function(t){var i=n[e.getRawIndex(t)];return i.node1.dataIndex>=0&&i.node2.dataIndex>=0});for(var a=0,o=n.length;a<o;a++)n[a].dataIndex=-1;for(var a=0,o=e.count();a<o;a++)n[e.getRawIndex(a)].dataIndex=a},l.clone=function(){for(var t=new s(this._directed),e=this.nodes,i=this.edges,n=0;n<e.length;n++)t.addNode(e[n].id,e[n].dataIndex);for(var n=0;n<i.length;n++){var a=i[n];t.addEdge(a.node1.id,a.node2.id,a.dataIndex)}return t},a.prototype={constructor:a,degree:function(){return this.edges.length},inDegree:function(){return this.inEdges.length},outDegree:function(){return this.outEdges.length},getModel:function(t){if(!(this.dataIndex<0)){var e=this.hostGraph,i=e.data.getItemModel(this.dataIndex);return i.getModel(t)}}},o.prototype.getModel=function(t){if(!(this.dataIndex<0)){var e=this.hostGraph,i=e.edgeData.getItemModel(this.dataIndex);return i.getModel(t)}};var u=function(t,e){return{getValue:function(i){var n=this[t][e];return n.get(n.getDimension(i||"value"),this.dataIndex)},setVisual:function(i,n){this.dataIndex>=0&&this[t][e].setItemVisual(this.dataIndex,i,n)},getVisual:function(i,n){return this[t][e].getItemVisual(this.dataIndex,i,n)},setLayout:function(i,n){this.dataIndex>=0&&this[t][e].setItemLayout(this.dataIndex,i,n)},getLayout:function(){return this[t][e].getItemLayout(this.dataIndex)},getGraphicEl:function(){return this[t][e].getItemGraphicEl(this.dataIndex)},getRawIndex:function(){return this[t][e].getRawIndex(this.dataIndex)}}};r.mixin(a,u("hostGraph","data")),r.mixin(o,u("hostGraph","edgeData")),s.Node=a,s.Edge=o,t.exports=s},function(t,e,i){function n(t,e){this.root,this.data,this._nodes=[],this.hostModel=t,this.levelModels=o.map(e||[],function(e){return new r(e,t,t.ecModel)})}function a(t,e){var i=e.children;t.parentNode!==e&&(i.push(t),t.parentNode=e)}var o=i(1),r=i(11),s=i(14),l=i(272),u=i(25),h=function(t,e){this.name=t||"",this.depth=0,this.height=0,this.parentNode=null,this.dataIndex=-1,this.children=[],this.viewChildren=[],this.hostTree=e};h.prototype={constructor:h,isRemoved:function(){return this.dataIndex<0},eachNode:function(t,e,i){"function"==typeof t&&(i=e,e=t,t=null),t=t||{},o.isString(t)&&(t={order:t});var n,a=t.order||"preorder",r=this[t.attr||"children"];"preorder"===a&&(n=e.call(i,this));for(var s=0;!n&&s<r.length;s++)r[s].eachNode(t,e,i);"postorder"===a&&e.call(i,this)},updateDepthAndHeight:function(t){var e=0;this.depth=t;for(var i=0;i<this.children.length;i++){var n=this.children[i];n.updateDepthAndHeight(t+1),n.height>e&&(e=n.height)}this.height=e+1},getNodeById:function(t){if(this.getId()===t)return this;for(var e=0,i=this.children,n=i.length;e<n;e++){var a=i[e].getNodeById(t);if(a)return a}},contains:function(t){if(t===this)return!0;for(var e=0,i=this.children,n=i.length;e<n;e++){var a=i[e].contains(t);if(a)return a}},getAncestors:function(t){for(var e=[],i=t?this:this.parentNode;i;)e.push(i),i=i.parentNode;return e.reverse(),e},getValue:function(t){var e=this.hostTree.data;return e.get(e.getDimension(t||"value"),this.dataIndex)},setLayout:function(t,e){this.dataIndex>=0&&this.hostTree.data.setItemLayout(this.dataIndex,t,e)},getLayout:function(){return this.hostTree.data.getItemLayout(this.dataIndex)},getModel:function(t){if(!(this.dataIndex<0)){var e=this.hostTree,i=e.data.getItemModel(this.dataIndex),n=this.getLevelModel();return i.getModel(t,(n||e.hostModel).getModel(t))}},getLevelModel:function(){return(this.hostTree.levelModels||[])[this.depth]},setVisual:function(t,e){this.dataIndex>=0&&this.hostTree.data.setItemVisual(this.dataIndex,t,e)},getVisual:function(t,e){return this.hostTree.data.getItemVisual(this.dataIndex,t,e)},getRawIndex:function(){return this.hostTree.data.getRawIndex(this.dataIndex)},getId:function(){return this.hostTree.data.getId(this.dataIndex)}},n.prototype={constructor:n,type:"tree",eachNode:function(t,e,i){this.root.eachNode(t,e,i)},getNodeByDataIndex:function(t){var e=this.data.getRawIndex(t);return this._nodes[e]},getNodeByName:function(t){return this.root.getNodeByName(t)},update:function(){for(var t=this.data,e=this._nodes,i=0,n=e.length;i<n;i++)e[i].dataIndex=-1;for(var i=0,n=t.count();i<n;i++)e[t.getRawIndex(i)].dataIndex=i},clearLayouts:function(){this.data.clearItemLayouts()}},n.createTree=function(t,e,i){function r(t,e){var i=t.value;f=Math.max(f,o.isArray(i)?i.length:1),d.push(t);var n=new h(t.name,c);e?a(n,e):c.root=n,c._nodes.push(n);var s=t.children;if(s)for(var l=0;l<s.length;l++)r(s[l],n)}var c=new n(e,i),d=[],f=1;r(t),c.root.updateDepthAndHeight(0);var p=u([{name:"value"}],d,{dimCount:f}),g=new s(p,e);return g.initData(d),l({mainData:g,struct:c,structAttr:"tree"}),c.update(),c},t.exports=n},function(t,e,i){"use strict";function n(t){return t.get("stack")||"__ec_stack_"+t.seriesIndex}function a(t){return t.dim}function o(t,e,i){var o=i.getWidth(),u=i.getHeight(),h={},c={},d=r(s.filter(e.getSeriesByType(t),function(t){return!e.isSeriesFiltered(t)&&t.coordinateSystem&&"polar"===t.coordinateSystem.type}));e.eachSeriesByType(t,function(t){if("polar"===t.coordinateSystem.type){var e=t.getData(),i=t.coordinateSystem,r=i.getAngleAxis(),s=i.getBaseAxis(),f=n(t),p=d[a(s)][f],g=p.offset,m=p.width,v=i.getOtherAxis(s),y=t.get("center")||["50%","50%"],x=l(y[0],o),_=l(y[1],u),b=t.get("barMinHeight")||0,w=t.get("barMinAngle")||0,S=v.getExtent()[0],M=v.model.get("max"),I=v.model.get("min"),T=[t.coordDimToDataDim("radius")[0],t.coordDimToDataDim("angle")[0]],A=e.mapArray(T,function(t,e){return i.dataToPoint([t,e])},!0);h[f]=h[f]||[],c[f]=c[f]||[],e.each(t.coordDimToDataDim(v.dim)[0],function(t,n){if(!isNaN(t)){h[f][n]||(h[f][n]={p:S,n:S},c[f][n]={p:S,n:S});var a,o,s,l,u=t>=0?"p":"n",d=i.pointToCoord(A[n]),p=c[f][n][u];if("radius"===v.dim)a=p,o=d[0],s=(-d[1]+g)*Math.PI/180,l=s+m*Math.PI/180,Math.abs(o)<b&&(o=a+(o<0?-1:1)*b),c[f][n][u]=o;else{a=d[0]+g,o=a+m,null!=M&&(t=Math.min(t,M)),null!=I&&(t=Math.max(t,I));var y=r.dataToAngle(t);Math.abs(y-p)<w&&(y=p-(t<0?-1:1)*w),s=-p*Math.PI/180,l=-y*Math.PI/180;var T=r.getExtent(),C=y;C===T[0]&&t>0?C=T[1]:C===T[1]&&t<0&&(C=T[0]),c[f][n][u]=C}e.setItemLayout(n,{cx:x,cy:_,r0:a,r:o,startAngle:s,endAngle:l})}},!0)}},this)}function r(t,e){var i={};s.each(t,function(t,e){var o=t.getData(),r=t.coordinateSystem,s=r.getBaseAxis(),u=s.getExtent(),h="category"===s.type?s.getBandWidth():Math.abs(u[1]-u[0])/o.count(),c=i[a(s)]||{bandWidth:h,remainedWidth:h,autoWidthCount:0,categoryGap:"20%",gap:"30%",stacks:{}},d=c.stacks;i[a(s)]=c;var f=n(t);d[f]||c.autoWidthCount++,d[f]=d[f]||{width:0,maxWidth:0};var p=l(t.get("barWidth"),h),g=l(t.get("barMaxWidth"),h),m=t.get("barGap"),v=t.get("barCategoryGap");p&&!d[f].width&&(p=Math.min(c.remainedWidth,p),d[f].width=p,c.remainedWidth-=p),g&&(d[f].maxWidth=g),null!=m&&(c.gap=m),null!=v&&(c.categoryGap=v)});var o={};return s.each(i,function(t,e){o[e]={};var i=t.stacks,n=t.bandWidth,a=l(t.categoryGap,n),r=l(t.gap,1),u=t.remainedWidth,h=t.autoWidthCount,c=(u-a)/(h+(h-1)*r);c=Math.max(c,0),s.each(i,function(t,e){var i=t.maxWidth;i&&i<c&&(i=Math.min(i,u),t.width&&(i=Math.min(i,t.width)),u-=i,t.width=i,h--)}),c=(u-a)/(h+(h-1)*r),c=Math.max(c,0);var d,f=0;s.each(i,function(t,e){t.width||(t.width=c),d=t,f+=t.width*(1+r)}),d&&(f-=d.width*r);var p=-f/2;s.each(i,function(t,i){o[e][i]=o[e][i]||{offset:p,width:t.width},p+=t.width*(1+r)})}),o}var s=i(1),l=i(4).parsePercent;t.exports=o},function(t,e,i){function n(){var t,e=[],i={};return{add:function(t,n,o,r,s){return a.isString(r)&&(s=r,r=0),!i[t.id]&&(i[t.id]=1,e.push({el:t,target:n,time:o,delay:r,easing:s}),!0)},done:function(e){return t=e,this},start:function(){function n(){a--,a||(e.length=0,i={},t&&t())}for(var a=e.length,o=0,r=e.length;o<r;o++){var s=e[o];s.el.animateTo(s.target,s.time,s.delay,s.easing,n)}return this}}}var a=i(1);t.exports={createWrap:n}}])});
define('js/inStats/utils/ChartTable',[], function() {
   /* 合并子栏排列方式 */
   return function(datas, header) {
       if(!header) {
           header = '<thead><tr><th>一级类型</th><th>漏洞数量</th><th>二级类型</th><th>漏洞数量</th></tr><thead>'
       }
       var tabs = '<table class="table table-bordered table-striped">';
       tabs += header;
       for(var i = 0, len = datas.length; i < len; i ++) {
            var row = '<tr>',
                cl = datas[i].children.length;
            //  添加名称
            row += '<td rowspan="' + cl + '">' + datas[i].name +'</td>';
            //  添加值
            row += '<td class="td-value" rowspan="' + cl + '">' + datas[i].value +'</td>';
            if(datas[i].children && datas[i].children.length > 0) {
               row += '<td>' + datas[i].children[0].name + '</td>';
                row += '<td class="td-value">' + datas[i].children[0].value + '</td>'; 
            }                                
            row += '</tr>';
            for(var j = 1; j < cl; j++) {
                row += '<tr>';
                row += '<td>' + datas[i].children[j].name + '</td>';
                row += '<td class="td-value">' + datas[i].children[j].value + '</td>';
                row += '</tr>';
            }
            tabs += row;
        }
        return tabs + '</table>'
   }

});
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('js/inStats/macarons',['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }

    var colorPalette = [
        '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
        '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
        '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
        '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
    ];


    var theme = {
        color: colorPalette,

        title: {
            textStyle: {
                fontWeight: 'normal',
                color: '#008acd'
            }
        },

        visualMap: {
            itemWidth: 15,
            color: ['#5ab1ef','#e0ffff']
        },

        toolbox: {
            iconStyle: {
                normal: {
                    borderColor: colorPalette[0]
                }
            }
        },

        tooltip: {
            backgroundColor: 'rgba(50,50,50,0.5)',
            axisPointer : {
                type : 'line',
                lineStyle : {
                    color: '#008acd'
                },
                crossStyle: {
                    color: '#008acd'
                },
                shadowStyle : {
                    color: 'rgba(200,200,200,0.2)'
                }
            }
        },

        dataZoom: {
            dataBackgroundColor: '#efefff',
            fillerColor: 'rgba(182,162,222,0.2)',
            handleColor: '#008acd'
        },

        grid: {
            borderColor: '#eee'
        },

        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#008acd'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        valueAxis: {
            axisLine: {
                lineStyle: {
                    color: '#008acd'
                }
            },
            splitArea : {
                show : true,
                areaStyle : {
                    color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        timeline : {
            lineStyle : {
                color : '#008acd'
            },
            controlStyle : {
                normal : { color : '#008acd'},
                emphasis : { color : '#008acd'}
            },
            symbol : 'emptyCircle',
            symbolSize : 3
        },

        line: {
            smooth : true,
            symbol: 'emptyCircle',
            symbolSize: 3
        },

        candlestick: {
            itemStyle: {
                normal: {
                    color: '#d87a80',
                    color0: '#2ec7c9',
                    lineStyle: {
                        color: '#d87a80',
                        color0: '#2ec7c9'
                    }
                }
            }
        },

        scatter: {
            symbol: 'circle',
            symbolSize: 4
        },

        map: {
            label: {
                normal: {
                    textStyle: {
                        color: '#d87a80'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#eee',
                    areaColor: '#ddd'
                },
                emphasis: {
                    areaColor: '#fe994e'
                }
            }
        },

        graph: {
            color: colorPalette
        },

        gauge : {
            axisLine: {
                lineStyle: {
                    color: [[0.2, '#2ec7c9'],[0.8, '#5ab1ef'],[1, '#d87a80']],
                    width: 10
                }
            },
            axisTick: {
                splitNumber: 10,
                length :15,
                lineStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length :22,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer : {
                width : 5
            }
        }
    };

    echarts.registerTheme('macarons', theme);
}));
define('js/inStats/portals/LeakAll',['echarts', '../utils/ChartTable', 'js/inStats/macarons'], function(echarts, ChartTable) {
    
    function initLabel() {
        return  {
                normal: {
                    show : false,
                    formatter: '{a|{a}}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                  /*  shadowBlur:3,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                    shadowColor: '#999',*/
                    padding: [0, 7],
                    rich: {
                        a: {
                            color: '#999',
                            lineHeight: 22,
                            align: 'center'
                        },
/*                        abg: {
                             backgroundColor: '#333',
                             width: '100%',
                             align: 'right',
                             height: 22,
                             borderRadius: [4, 4, 0, 0]
                        },*/
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            fontSize: 12,
                            lineHeight: 33
                        },
                        per: {
                            color: '#eee',
                            backgroundColor: '#334455',
                            padding: [2, 4],
                            borderRadius: 2
                        }
                    }
                }
            };
    }
    
    //
    function initOption(legend, topDatas, sonDatas, datas) {
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                x: 'left',
                data : legend
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {
                        show: true,
                        readOnly: true,
                        title : '漏洞整体指标统计表',
                        optionToContent : function(opt) {
                            return ChartTable(datas);
                        }
                    },
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series: [
                {
                    name:'一级类型漏洞',
                    type:'pie',
                    selectedMode: 'single',
                    radius: [0, '30%'],

                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data : topDatas
                },
                {
                    name:'二级类型漏洞',
                    type:'pie',
                    radius: ['40%', '55%'],
                    label : initLabel(),
                    data : sonDatas
                }
            ]
        };
        return option;
    }
    
    //
    function fetchData($http, url, callback) {
        $http({
            method : "GET",
            url
        }).success(function (datas) {
            var legend = [],
                topDatas = [],
                sonDatas = [];
            //  判断数据是否为空
            if(datas && datas.length > 0) {
               for(var i = 0, len = datas.length; i < len; i ++) {
                   topDatas.push({
                       name : datas[i].name,
                       value : datas[i].value
                   })
                   for(var j = 0, jc = datas[i].children, jl = jc.length; j < jl; j ++) {
                       sonDatas.push({
                           name : jc[j].name,
                           value : jc[j].value
                       })
                       legend.push(jc[j].name);
                   }
               }
           }
           //  绘制统计图
           callback(legend, topDatas, sonDatas, datas);  
        });
    }
    
    //  初始化选中事件
    function initSelected(leakChart, datas) {
        var current = null;
        
        function findChilds(name) {
            for(var i = 0, len = datas.length; i < len; i ++) {
                if(datas[i].name == name) {
                    return datas[i].children;
                }
            }
        }
        
        leakChart.on('pieselectchanged', function(params) {
                var items = params.selected,
                    name = params.name,
                    childs = null
                    selected = items[name];
                if(current) {
                    childs = findChilds(current);
                    // 取消其他选中子项
                    for(var i = 0, len = childs.length; i < len; i ++) {
                          leakChart.dispatchAction({
                            type: 'pieUnSelect',
                            seriesIndex : 1,
                            name : childs[i].name
                          })
                    }
                }
                //  确定选中
                if(selected) {
                    //  选中自身子项
                    childs = findChilds(name);
                    for(var i = 0, len = childs.length; i < len; i ++) {
                          leakChart.dispatchAction({
                            type: 'pieSelect',
                            seriesIndex : 1,
                            name : childs[i].name
                          })
                    }
                    current = name;
                } else {
                    // 取消选中
                    current = false;    
                }

        })
    }
    
    //
    function initChart($scope, $http, id, url) {
        var leakChart = echarts.init(document.getElementById(id), 'macarons'),
            showLabel = false;
          //    获取数据并初始化图形
        fetchData($http, url, function(legend, topDatas, sonDatas, datas) {
              var option = initOption(legend, topDatas, sonDatas, datas);
              leakChart.setOption(option);
              initSelected(leakChart, datas);
        })           
        //  返回增强性功能
        return {
            
            toggleLabel : function() {
                showLabel = !showLabel;
                var position = showLabel? 'outsize' : 'inside',
                    formatter = showLabel? '{a|{a}}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}' : '';
                leakChart.setOption({
                      series : [{}, {
                          hoverAnimation : showLabel,
                          label : {
                            normal : {
                                show : showLabel,
                                position : position,
                                formatter : formatter
                            }
                          }
                      }]
                 });
                 return showLabel;
            }
            
        };
    }

    
    return initChart;
});
define('js/inStats/portals/LeakCategory',['echarts', '../utils/ChartTable', 'js/inStats/macarons'], function(echarts, ChartTable) {
    
    var legends = ['严重','高危','中危','低危','忽略'];
    function createSerie() {
        return {
            name: '',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: []
        };
    }
    
    function createOption(series, datas) {
        return {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['未修复', '修复中','已修复','不修复','已关闭', '已忽略'],
                left : 'left'
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {
                        show: true,
                        readOnly: true,
                        title : '漏洞等级分布趋势图',
                        optionToContent : function(opt) {
                            return ChartTable(datas, '<thead><tr><th>漏洞状态</th><th>漏洞数量</th><th>漏洞等级</th><th>漏洞数量</th></tr><thead>')
                        }
                    },
                    magicType : {
                        show: true,
                        type: ['stack', 'tiled', 'line', 'bar']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis:  {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: ['严重','高危','中危','低危','忽略']
            },
            series: series
        };
    }
    
    function fetchData($http, callback) {
        $http({
            method : "GET",
            url : '/inStats/leak/category'
        }).success(function (datas) {
            //  判断数据是否为空
            if(datas && datas.length > 0) {
               var series = [];
               for(var i = 0, len = datas.length; i < len; i ++) {
                   var serieOption = createSerie(),
                       childMap = {},
                       data = [];
                   //   首先转成Map
                   for(var j = 0, childs = datas[i].children, jl = childs.length; j < jl; j ++) {
                       //  需要排序
                       childMap[childs[j].name] = childs[j].value;
                   }
                   for(var x = 0, xl = legends.length; x < xl; x ++) {
                       data.push(childMap[legends[x]] || 0);
                   }
                   serieOption.name = datas[i].name;
                   serieOption.data = data;
                   series.push(serieOption);
               }
               callback(series, datas);               
           }
        });
    }
    
    //
    function initChart($rootScope, $scope, $http, routeParams) {
        var leakChart = echarts.init(document.getElementById('leakCategory'), 'macarons');
        fetchData($http, function(series, datas) {
            var option = createOption(series, datas);
            leakChart.setOption(option);
        });        
    }    
    return initChart;
    
});
define('js/inStats/utils/HHTable',[], function() {
    /*平行子栏排列方式*/
   function HhTables(datas, header, size, keys) {
       var tabs = '<table class="table table-bordered table-striped table-hover">',
           results = [],
           depts = [];
       if(!header) {
           header = '<thead><tr><th>一级类型</th><th>漏洞数量</th><th>二级类型</th><th>漏洞数量</th></tr><thead>'
       }
       tabs += header;
       
       function findByName(array, name) {
           for(var i = 0; i < array.length; i ++) {
               if(array[i].name === name) {
                   return array[i];
               }
           }
           return false;
       }
       //   处理数据
       for(var i = 0, len = datas.length; i < len; i ++) {
           for(var j = 0, jc = datas[i].children, jl = jc.length; j < jl; j ++) {
               var dept = jc[j].name,
                   name = datas[i].name,
                   item = findByName(results, dept),
                   value = jc[j].value;
               //   如果没有部门信息
               if(!item) {
                   item = {
                     name : dept
                   }
                   results.push(item);
               }
               item[name] = value;
           }
       }
       //   补齐缺失的数据
       for(i = 0, len = results.length; i < len; i ++) {
           var data = [],
               result = results[i];
           keys.forEach(function(key) {
               data.push(result[key] || 0);
           })
           results[i].data = data;
       }       
       console.log(results.length)
       
       var statsRow = ['总计', 0];
           
       //   准备生成表格
       for(x = 0, tlen = results.length; x < tlen; x ++) {
           var sum = 0,
               items = results[x].data,
               row = '<tr>';
           row += '<td>' + results[x].name + '</td>';
           //   计和
           for(i = 0, len = items.length; i < len; i ++) {
               if(statsRow[2 + i] === undefined) {
                   statsRow[2 + i] = 0;
               }
               sum += items[i];
               statsRow[2 + i] += items[i];
           }
           row += '<td class="td-value">' + sum + '</td>';
           //   添加单元格
           for(i = 0, len = items.length; i < len; i ++) {
               row += '<td class="td-value">' + items[i] + '</td>';
               row += '<td class="td-value">' + Number.prototype.toFixed.call((items[i] * 10000 / sum) / 100, 2) + '%</td>';
           }  
           //  添加空白表格
           for(; i < size; i ++) {
               row += '<td class="td-value">' + '-' + '</td>';
               row += '<td class="td-value">' + '-' + '</td>';
           }
           row += '</tr>';
           //   总计
           statsRow[1] += sum;
           tabs += row;
       }
       //
       var  lastRow = '<tr>';
       lastRow += '<td>' + statsRow[0] + '</td>';
       lastRow += '<td class="td-value">' + statsRow[1] + '</td>';
       for(i = 2, len = statsRow.length; i < len; i ++) {           
           lastRow += '<td class="td-value">' + statsRow[i] + '</td>';
           lastRow += '<td class="td-value">' + Number.prototype.toFixed.call((statsRow[i] * 10000 / statsRow[1]) / 100, 2) + '%</td>';
       }
       //  添加空白表格
       for(; i < size + 2; i ++) {
           lastRow += '<td class="td-value">' + '-' + '</td>';
           lastRow += '<td class="td-value">' + '-' + '</td>';
       }
       lastRow += '</tr>';
       tabs += lastRow;
       return tabs + '</table>'
   }
    
   return HhTables;
});
define('js/inStats/portals/LeakDepts',['echarts', '../utils/HHTable', 'js/inStats/macarons'], function(echarts, HHTable) {
    
    function createSerie() {
        return {
            name: '',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: []
        };
    }
    
    function createOption(series, depts, datas) {
        var keys = ['未修复', '修复中','已修复','不修复','已关闭', '已忽略'];
        return {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: keys,
                left : 'left'
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {
                        show: true,
                        readOnly: true,
                        title : '漏洞处理状态按业务线统计分布图',
                        optionToContent : function(opt) {
                            return HHTable(datas, '<thead><tr><th>业务线</th><th>漏洞总量</th><th>未修复</th><th>未修复占比</th><th>修复中</th><th>修复中占比</th><th>已修复</th><th>已修复占比</th><th>不修复</th><th>不修复占比</th><th>已关闭</th><th>已关闭占比</th><th>已忽略</th><th>已忽略占比</th></tr><thead>', 6, keys);
                            //  return ChartTable(datas, '<thead><tr><th>漏洞状态</th><th>漏洞数量</th><th>漏洞等级</th><th>漏洞数量</th></tr><thead>')
                        }
                    },
                    magicType : {
                        show: true,
                        type: ['stack', 'tiled', 'line', 'bar']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis:  {
                axisLabel: {
                    interval: 0,
                    rotate: 45
                },
                type : 'category',
                data : depts       
            },
            yAxis: {
                type: 'value',
                minInterval : 1
            },
            series: series
        };
    }
    
    function fetchData($http, callback) {
        $http({
            method : "GET",
            url : '/inStats/leak/depts'
        }).success(function (datas) {
            //  判断数据是否为空
            if(datas && datas.length > 0) {
               var series = [],
                   deptMap = {},
                   tmpArr = [],
                   depts = [];
               // 获得所有的单位
               for(var i = 0, len = datas.length; i < len; i ++) {
                    for(var j = 0, childs = datas[i].children, jl = childs.length; j < jl; j ++) {
                       //   放入单位并计和
                       deptMap[childs[j].name] = (deptMap[childs[j].name] || 0) + childs[j].value;
                    }
               }
               // 将Map转换为数组
               for(var dp in deptMap) {
                   tmpArr.push({
                       name : dp,
                       value : deptMap[dp]
                   })
               }
               tmpArr.sort(function(a, b) {
                   return b.value - a.value;
               })
               tmpArr.forEach(function(item) {
                   depts.push(item.name);
               });
               //   依次填入所有的数据
                
               for(i = 0, len = datas.length; i < len; i ++) {
                   var serieOption = createSerie(),
                       data = [],
                       maps = {};
                   //  将数据转换为MAP
                   for(j = 0, childs = datas[i].children, jl = childs.length; j < jl; j ++) {
                       maps[childs[j].name] = childs[j].value
                   }
                   //  依次填入单位的值
                   depts.forEach(function(item) {
                       var value = maps[item] || 0;
                       data.push(value);
                   });
                   serieOption.name = datas[i].name;
                   serieOption.data = data;
                   series.push(serieOption);
               }
               callback(series, depts, datas);               
           }
        });
    }
    
    //
    function initChart($rootScope, $scope, $http, routeParams) {
        var leakChart = echarts.init(document.getElementById('leakDepts'), 'macarons');
        fetchData($http, function(series, depts, datas) {
            var option = createOption(series, depts, datas);
            leakChart.setOption(option);
            
        });        
    }    
    return initChart;
    
});
define('js/inStats/utils/FieldTable',[], function() {
   /* 合并子栏排列方式 */
   return function(datas, headers, rowAction, endAction) {
       var tabs = '<table class="table table-bordered table-striped">',
           local = {};
       tabs += '<thead><tr>' + headers + '</tr></thead>';
       datas.forEach(function(item) {
           var row = '<tr>'
           row = row + rowAction(item, local);
           row = row + '</tr>';
           tabs = tabs + row;
       });
       if(endAction) {
           tabs += endAction(local)
       }
       return tabs + '</table>'
   }

});
define('js/inStats/portals/LeakTime',['echarts', '../utils/FieldTable', 'js/inStats/macarons'], function(echarts, FieldTable) {
    
    //  设置图表属性
    function createOption(times, values, datas) {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            toolbox: {
                show: true,
                feature : {
                     dataView: {
                        show: true, 
                        readOnly: false,
                        title : '数据表格',
                        optionToContent : function(options) {
                            var header = '<th class="text-center">日期</th><th class="text-right">漏洞数量</th>'
                            return FieldTable(datas, header, function(item, local) {
                                var row = '';
                                row += '<td class="text-center">' + item.name + '</td>'
                                row += '<td class="td-value">' + item.value + '</td>'
                                if(local.count === undefined) {
                                    local.count = 0;
                                }
                                local.count += item.value
                                return row
                            }, function(local) {
                                return '<tr><td>总计</td><td class="td-value">'+ local.count +'</td></tr>';
                            });
                        }
                    },
                    mark : {show: true},
                    magicType : {
                        show: true,
                        type: ['line', 'bar']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            xAxis:  {
                type: 'category',
                boundaryGap: true,
                data : times,
                axisLabel: {
                    interval: 0,
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    //  formatter: '{value} 个漏洞'
                    formatter: '{value}'
                },
                axisPointer: {
                    snap: true
                },
                minInterval : 1
            },

            series: [
                {
                    name:'漏洞数量',
                    type:'line',
                    smooth: true,
                    data: values,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ],
                        label : {
                            normal : {
                                formatter : '{b} : {c}'
                            }
                        }
                    },
                    markLine : {
                        label : {
                            normal : {
                                formatter : '{b} : {c}'
                            }
                        },
                        data : [
                            {type : 'average', name: '平均值'}
                        ]
                    }
                }
            ]
        };
    }
    
    //  获取数据
    function fetchData($http, callback) {
        $http({
            method : "GET",
            url : '/inStats/leak/time'
        }).success(function (datas) {
            //  判断数据是否为空
            if(datas && datas.length > 0) {
               var times = [],
                   values = [];
                for(var i = 0, len = datas.length; i < len; i ++) {
                    times.push(datas[i].name);
                    values.push(datas[i].value);
                }
                callback(times, values, datas);
           }
        });
    }
    
    function initChart($rootScope, $scope, $http, routeParams) {
        var leakChart = echarts.init(document.getElementById('leakTime'), 'macarons');
        fetchData($http, function(times, values, datas) {
            var option = createOption(times, values, datas);
            leakChart.setOption(option);
        });     
    }
    
    return initChart;
});
define('js/inStats/portals/LeakDeptFinished',['echarts', '../utils/FieldTable', 'js/inStats/macarons'], function(echarts, FieldTable) {
    
    //
    function initOption(depts, times, counts, datas) {
        var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataView: {
                            show: true, 
                            readOnly: false,
                            title : '数据表格',
                            optionToContent : function(options) {
                                var header = '<th>部门名称</th><th>漏洞个数</th><th>平均处理时间</th>'
                                return FieldTable(datas, header, function(item, local) {
                                    var row = '';
                                    row += '<td>' + item.dept_name + '</td>'
                                    row += '<td class="td-value">' + item.avg_time + '</td>'
                                    row += '<td class="td-value">' + item.value + '</td>'
                                    return row
                                });
                            }
                        },
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                legend: {
                    data:['漏洞个数','平均处理时间']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: depts,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: 45
                        }
                    }
                ],
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    containLabel: true
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '漏洞个数',
                        min: 0,
                        minInterval: 10,
                        axisLabel: {
                            formatter: '{value} 个'
                        }
                    },
                    {
                        type: 'value',
                        name: '平均处理时间',
                        min: 0,
                        minInterval: 1,
                        axisLabel: {
                            formatter: '{value} 天'
                        }
                    }
                ],
                series: [
                    {
                        name:'漏洞个数',
                        type:'bar',
                        data : counts
                    },
                    {
                        name:'平均处理时间',
                        type:'line',
                        yAxisIndex: 1,
                        data : times
                    }
                ]
            };
        return option;
    }
    
    //
    function fetchData($http, url, callback) {
        $http({
            method : "GET",
            url
        }).success(function (datas) {
           var depts = [],
               times = [],
               counts = [];
           if(datas && datas.length > 0) {
               datas.forEach(function(item) {
                   depts.push(item.dept_name);
                   times.push(item.avg_time);
                   counts.push(item.value);
               });
               //  绘制统计图
               callback(depts, times, counts, datas);  
           }    
        });
    }
    
   
    //
    function initChart($scope, $http, id, url) {
        var leakChart = echarts.init(document.getElementById(id), 'macarons');
          //    获取数据并初始化图形
        fetchData($http, url, function(depts, times, counts, datas) {
              var option = initOption(depts, times, counts, datas);
              leakChart.setOption(option);
        })           
        
    }

    
    return initChart;
});
define('js/inStats/utils/WeekTable',[], function() {
    /*平行子栏排列方式*/
   function HhTables(datas, header, size) {
       var tabs = '<table class="table table-bordered table-striped table-hover">',
           results = {},
           statsRow = ['总计', 0];
       if(!header) {
           header = '<thead><tr><th>类型</th><th>周日</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th></tr><thead>'
       }
       tabs += header;
       //   处理数据
       for(var prop in datas) {
           var row = '<tr>',
               data = datas[prop];
           row += '<td>' + prop + '</td>';
           for(var i = 0, len = data.length; i < len; i ++) {
               row += '<td class="td-value">' + data[i] + '</td>';
               statsRow[1] = statsRow[1] + data[i]
           }
           for(; i < size; i ++) {
               row += '<td class="td-value">' + '-' + '</td>';
           }
           row += '</tr>'
           tabs += row;
       }
       
       //
       var  lastRow = '<tr>';
       lastRow += '<td>' + statsRow[0] + '</td>';
       lastRow += '<td colspan="'+ size +'" class="td-value">' + statsRow[1] + '</td>';
       lastRow += '</tr>';
       tabs += lastRow;
       return tabs + '</table>'
   }
    
   return HhTables;
});
define('js/inStats/portals/AlarmRelative',['echarts', 'moment', '../utils/WeekTable', 'js/inStats/macarons'], function(echarts, moment, HHTable) {
    
    //  设置图表属性
    function createOption(series, legends, datas, xdatas) {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data : legends
            },
            
            toolbox: {
                show: true,
                feature : {
                    magicType : {
                        show: true,
                        type: ['line', 'bar']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}                    
                },
               
            },
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data : xdatas
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    //  formatter: '{value} 个漏洞'
                    formatter: '{value}'
                },
                axisPointer: {
                    snap: true
                }
            },

            series : series
        };
    }
    
    //  获取数据
    function fetchData($scope, $http, url, options, callback) {
        const  format = 'YYYY-MM-DD',
               endTime = moment().format(format),
               startTime = moment().subtract($scope.timeCount, $scope.timeUnit).format(format)
        $http({
            method : "GET",
            url : url,
            params : {
                startTime,
                endTime
            }
        }).success(function (datas) {
            const afterLoad = options.afterLoad
            //  判断数据是否为空
            if(datas) {
                const series = []
                if(afterLoad) {
                    datas = afterLoad(datas)
                }
                const legends = datas.names,
                      xdatas = datas.dates
                for(let prop in datas.datas) {
                    series.push({
                        name : prop,
                        type : 'line',
                        data : datas.datas[prop]
                    });
                }
                callback(series, legends, datas, xdatas);
           }
        });
    }
    
    function initChart($rootScope, $scope, $http, routeParams, options) {
        var id = options.el,
            url = options.url,
            leakChart = echarts.init(document.getElementById(id), 'macarons');
        //  修改
        function refresh() {
            fetchData($scope, $http, url, options, function(series, legends, datas, xdatas) {
                var option = createOption(series, legends, datas, xdatas);
                //  阻止合并
                leakChart.setOption(option, {notMerge : true});
            }); 
        }
        //
        refresh();
        return refresh;
    }
    
    return initChart;
});
define('js/common/add-water-mark',['require','exports','module'],function (require, exports, module) {
    return function ($rootScope) {
        $rootScope.$on('init.user', function () {
            waterMark && waterMark({
                systemId: '452',
                containerEl: document.querySelector('.content'),
                imgWidthDis: 100,
                imgHeightDis: 100,
                textStyle: 'rgba(0,0,0,0.08)',
                userId: $rootScope.$user.name
            })
        })
    }
});
define('js/inStats/utils/PieTable',[], function() {
    /*平行子栏排列方式*/
   function PieTable(datas, header) {
       var tabs = '<table class="table table-bordered table-striped table-hover">',
           sum = 0;
       if(!header) {
           header = '<thead><tr><th>名称</th><th>数量</th><th>占比</th></tr><thead>'
       }
       tabs += header;
       //   处理数据
       for(var i = 0, len = datas.length; i < len; i ++) {
           sum += datas[i].value;
       }
       var statsRow = ['总计', sum];
       //
        //   处理数据
       for(i = 0; i < len; i ++) {
           var row = '<tr>';
           row += '<td>' + datas[i].name + '</td>';
           row += '<td class="td-value">' + datas[i].value + '</td>';
           row += '<td class="td-value">' + Number.prototype.toFixed.call((datas[i].value * 10000 / sum) / 100, 2) + '%</td>';
           row += '</tr>';
           tabs += row;
       }
      
       //
       var  lastRow = '<tr>';
       lastRow += '<td>' + statsRow[0] + '</td>';
       lastRow += '<td class="td-value" colspan="2">' + statsRow[1] + '</td></tr>';
       tabs += lastRow;
       return tabs + '</table>'
   }
    
   return PieTable;
});
define('js/inStats/portals/DSRCLeak',['echarts', 'moment', '../utils/PieTable', 'js/inStats/macarons'], function (echarts, moment, PieTable) {

    function fetchData($http, url, $scope, id, callback) {
        var startTime = $scope['analysisStart'],
            endTime = $scope['analysisEnd'],
            params = {};
        if(startTime) {
            params.startTime = moment(startTime).format('YYYY-MM-DD');
        }
        if(endTime) {
             params.endTime = moment(endTime).format('YYYY-MM-DD');
        }
        $http({
            method: "GET",
            //  url : '/inStats/leak/alarmType'
            url: url,
            params: params
        }).success(function (datas) {
            //  判断数据是否为空
            if (datas.data) {
                let legends = ['DSRC运营平台推送漏洞数', '安全平台漏洞总数', '安全平台DSRC漏洞总数'],
                seriesData = [{
                    name: 'DSRC运营平台推送漏洞数',
                    value: datas.data.outerDsrcCount
                }, {
                    name: '安全平台漏洞总数',
                    value: datas.data.allCount
                }, {
                    name: '安全平台DSRC漏洞总数',
                    value: datas.data.allDsrcCount
                }]
                callback(legends, seriesData);
            }
        });
    }

    function createOption(legends, datas, title) {
        return {
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {
                        show: true,
                        readOnly: true,
                        title : title,
                        optionToContent : function(opt) {
                            return PieTable(datas)
                        }
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },            
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 5,
                top: 25,
                bottom: 15,
                data: legends
            },
            series: [
                {
                    name: title,
                    type: 'pie',
                    radius: '55%',
                    center: ['40%', '50%'],
                    data: datas,
                    label: {
                        show: true
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                    }
                ]
        };
    }

    function initChart($rootScope, $scope, $http, routeParams, id, url, title) {
        //  初始化图形
        var leakChart = echarts.init(document.getElementById(id), 'macarons'),
            showLabel = false;
        //  初始处理数据
        fetchData($http, url, $scope, id, function (legends, datas) {
            var option = createOption(legends, datas, title);
            leakChart.setOption(option, title);
        });
        
        //  注册事件，点击更新数据
        $scope[id + 'Submit'] = function() {
            fetchData($http, url, $scope, id, function (legends, datas) {
                var option = {
                    legend : {
                        data: legends
                    },
                    series : [{
                        data: datas
                    }]
                }
                leakChart.setOption(option);
            });
        }
    }
    
    return initChart;

});
define('js/inStats/LeakStatCtrl',['moment', './portals/LeakAll', './portals/LeakCategory', './portals/LeakDepts', './portals/LeakTime', './portals/LeakDeptFinished', './portals/AlarmRelative', './../common/add-water-mark', './portals/DSRCLeak'], function (moment, LeakAll, LeakCategory, LeakDepts, LeakTime, LeakDeptFinished, AlarmRelative, addWaterMark, DSRCLeak) {    
    return function (appMod) {
    
    appMod.filter('toInt', [function() {
        return function(input, args) {
            if(!args) {
                args = 0;
            }
            return parseInt(input) + args
        }
    }]);
        
    appMod.filter('numFmt', [function() {
        return function(input, pt) {
           var suffix = '';
           if(pt) {
               suffix = '%';
           }
           return input === 0 ? '0' : input + suffix;
        }
    }]);
        
     appMod.filter('ptFmt', [function() {
        return function(input) {
           return input === '-' ? '0' : input + '%';
        }
    }]);

    function createStartDate() {
        return new Date(1999, 0, 1)
    }
        
    appMod.controller('LeakStatCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$timeout',
                function($rootScope, $scope, $http, routeParams, $timeout) {
                    addWaterMark($rootScope)
                    $scope.active = 0;
                    $scope.tab1Inited = false;
                    $scope.timeEnums = [{name : 'days' ,label :'天'}, {name :'weeks', label : '周'}, {name : 'months', label :'月'}]
                     //  默认为30天
                    $scope.timeCount = 30
                    $scope.timeUnit = $scope.timeEnums[0].name
                    $scope.activeTab = function(index) {
                        this.active = index;
                        if(index > 0 && !$scope[`tab${index}Inited`]) {
                            $scope[`tab${index}Inited`] = true;
                            // 图片无法展开
                            $timeout(function () {
                                // index == 1 ? initTab1() : initTab2()
                                switch (index) {
                                    case 1:
                                        initTab1()
                                        break;
                                    case 2:
                                        initTab2()
                                        break
                                    case 3:
                                        $scope.analysisStart = new Date(moment().subtract(7, 'day'))
                                        break
                                }
                            }, 16)
                        }
                    };

                     //  初始化时间控件
                    angular.extend($scope, {
                        closeText: '关闭',
                        currentText: '今天',
                        clearText: '清除',
                        format: 'yyyy-MM-dd',
                        dateOptions: {
                            formatYear: 'yyyy',
                            maxDate: new Date(),
                            // minDate: createStartDate(),
                            startingDay: 1
                        }
                    });
                    //  初始化时间标识值
                    var timeComps = ['analysis'];
                    timeComps.forEach(function (item) {
                        var startTime = item + 'Start',
                            endTime = item + 'End',
                            startOpend = startTime + 'Opened',
                            endOpend = endTime + 'Opened',
                            startAction = startTime + 'Open',
                            endAction = endTime + 'Open'
                        $scope[startTime] = new Date(moment().subtract(7, 'day'))
                        $scope[startOpend] = false;
                        $scope[startAction] = function () {
                            $scope[startOpend] = !$scope[startOpend];
                        };
                        //
                        $scope[endTime] = new Date();
                        $scope[endOpend] = false;
                        $scope[endAction] = function () {
                            $scope[endOpend] = !$scope[endOpend];
                        };
                    });

                    
                    //  初始化漏洞整体指标
                    (function() {
                        var leakChart = LeakAll($scope, $http, 'leakAll', '/inStats/leak/all');
                        $scope.leakText = '显示提示';
                        $scope.toggle = function() {                 
                            var showLabel = leakChart.toggleLabel();
                            this.leakText = showLabel ? '关闭提示' : '显示提示'
                        }
                    })();
                    
                    //  初始化漏洞等级分布趋势图
                    (function() {
                        LeakCategory($rootScope, $scope, $http, routeParams);
                    })();
                    
                    //  初始化漏洞等级业务线分布趋势图
                    (function() {
                        LeakDepts($rootScope, $scope, $http, routeParams);
                    })();
                    
                    //  初始化漏洞数量时间趋势图
                    (function() {
                        LeakTime($rootScope, $scope, $http, routeParams);
                    })();
                    
                    //  初始化超期漏洞列表
                    (function() {
                        //  超时，未处理
                        $http({
                            method : 'GET',
                            url : '/inStats/leak/expire',
                        }).success(function (datas) {
                            $scope.datas = datas;
                        });
                    })();
                    
                    //  初始化平均时间
                    (function() {
                        $http({
                            method : 'GET',
                            url : '/inStats/leak/avgFinishedTime',
                        }).success(function (datas) {
                            $scope.avgTimes = datas;
                        });
                    })();
                    
                    //  初始化漏洞来源统计
                    (function() {
                        var sourceChart = LeakAll($scope, $http, 'sourceChart', '/inStats/leak/holeStatBySource');
                        $scope.sourceText = '显示提示';
                        $scope.toggleSource = function() {                 
                            var showLabel = sourceChart.toggleLabel();
                            this.sourceText = showLabel ? '关闭提示' : '显示提示'
                        }
                    })();
                    
                    //  各业务线已结束漏洞的数量及平均处理时间
                    (function() {
                         LeakDeptFinished($scope, $http, 'finishedChart', '/inStats/leak/finishedHoleByDept');
                    })();
                    
                    //  初始化漏洞SLA
                    function initTab2() {
                        (function() {
                            var now = moment().subtract(1, 'months'),
                                year = now.get('year'),
                                month = now.get('month');
                            //  初始化时间
                            $scope.yearEnums = [2017, 2018, 2019, 2020];
                            $scope.monthEnums = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
                            $scope.year = year;
                            $scope.month = month;

                            //  计算SLA
                            function computeSla(sla) {
                                sla.sum = sla.s0 + sla.s1 + sla.s2 + sla.s3 + sla.s4;
                                for(var i = 0; i < 5; i ++) {
                                    var name = 'sla' + i,
                                        sname = 's' + i,
                                        exname = 's'+ i +'ex';
                                    sla[name] = sla[sname] == 0 ? Number.prototype.toFixed.call(100.00, 2) : Number.prototype.toFixed.call(100 - (sla[exname] * 10000/ sla[sname]) / 100, 2);
                                }
                            }

                            function fetchSla() {
                                var monthStr = $scope.year + $scope.monthEnums[$scope.month];                        
                                //  超时，未处理
                                $http({
                                    method : 'GET',
                                    url : '/inStats/leak/holeSlaByMonth/' + monthStr,
                                }).success(function (datas) {
                                    for(var i = 0, len = datas.length; i < len; i ++) {
                                       computeSla(datas[i])
                                    }
                                    $scope.slas = datas;
                                    sortDatas();
                                });
                            }
                            //  数据排序
                            function sortDatas() {
                                var name = $scope.sortCol,
                                    dirt = $scope.asc;
                                $scope.slas.sort(function(a, b) {
                                    var result = a[name] - b[name];
                                    return dirt? result : - result;
                                })
                            }

                            //  获取数据
                            $scope.fetchSla = fetchSla;
                            //  确定排序方向
                            $scope.asc = false;
                            $scope.sortCol = 'sum';
                            $scope.isCurr = function(col) {
                                return this.sortCol === col;
                            }
                            $scope.sort = function(col) {
                                if(this.sortCol === col) {
                                    this.asc = !this.asc;
                                } else {
                                    this.asc = false;
                                    this.sortCol = col;
                                }
                                sortDatas();
                            }
                            fetchSla();
                        })();
                    }
                    
                    /** 相对指标 */
                    function initTab1() {
                        var relativeType = AlarmRelative($rootScope, $scope, $http, routeParams, {
                            el : 'relativeType',
                            url : '/inStats/leak/holetypetrend'
                        });
                        var relativeSource = AlarmRelative($rootScope, $scope, $http, routeParams, {
                            el : 'relativeSource',
                            url : '/inStats/leak/holesourcetrend'
                        });
                        var relativeLevel = AlarmRelative($rootScope, $scope, $http, routeParams, {
                            el : 'relativeLevel',
                            url : '/inStats/leak/holeleveltrend',
                            afterLoad (datas) {
                                const LEVELS = ["严重", "高危", "中危", "低危", "忽略"]
                                for(let i = 0, len = datas.names.length; i < len; i ++) {
                                    datas.names[i] = LEVELS[datas.names[i]]
                                }
                                for(const prop in datas.datas) {
                                    datas.datas[LEVELS[prop]] = datas.datas[prop]
                                    delete datas.datas[prop]
                                }
                                return datas
                            }
                        });

                        // 更改时刷新
                        $scope.changeUnit = function () {
                            relativeType()
                            relativeSource()
                            relativeLevel()
                        }
                    }

                    /** DSRC指标 */
                    (function() {
                        var dsrcLeak = DSRCLeak($rootScope, $scope, $http, routeParams, 'dsrcLeak','/inStats/dsrcHole/source')
                        $scope.dsrcLeakText = '显示提示';
                        $scope.toggleDSRC = function() {   
                            var showLabel = dsrcLeak.toggleLabel();
                            this.dsrcLeakText = showLabel ? '关闭提示' : '显示提示'
                        }
                    })()
                }
        ]);
    }

});
define('js/inStats/portals/AlarmType',['echarts', 'moment', '../utils/PieTable', 'js/inStats/macarons'], function (echarts, moment, PieTable) {

    function fetchData($http, url, $scope, id, callback) {
        var startTime = $scope[id + 'Start'],
            endTime = $scope[id + 'End'],
            params = {};
        if(startTime) {
            params.startTime = moment(startTime).format('YYYY-MM-DD');
        }
        if(endTime) {
             params.endTime = moment(endTime).format('YYYY-MM-DD');
        }
        $http({
            method: "GET",
            //  url : '/inStats/leak/alarmType'
            url: url,
            params: params
        }).success(function (datas) {
            //  判断数据是否为空
            if (datas) {
                var legends = [];
                for (var i = 0, len = datas.length; i < len; i++) {
                    legends.push(datas[i].name);
                }
                callback(legends, datas);
            }
        });
    }

    function createOption(legends, datas, title) {
        return {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {
                        show: true,
                        readOnly: true,
                        title : title,
                        optionToContent : function(opt) {
                            return PieTable(datas)
                        }
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },            
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 5,
                top: 25,
                bottom: 15,
                data: legends
            },
            series: [
                {
                    name: title,
                    type: 'pie',
                    radius: '55%',
                    center: ['40%', '50%'],
                    data: datas,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                    }
                ]
        };
    }

    function initChart($rootScope, $scope, $http, routeParams, id, url, title) {
        //  初始化图形
        var leakChart = echarts.init(document.getElementById(id + 'Chart'), 'macarons');
        //  初始处理数据
        fetchData($http, url, $scope, id, function (legends, datas) {
            var option = createOption(legends, datas, title);
            leakChart.setOption(option, title);
        });
        //  注册事件，点击更新数据
        $scope[id + 'Submit'] = function() {
            fetchData($http, url, $scope, id, function (legends, datas) {
                var option = {
                    legend : {
                        data: legends
                    },
                    series : [{
                        data: datas
                    }]
                }
                leakChart.setOption(option);
            });
        }
    }
    
    return initChart;

});
define('js/inStats/portals/AlarmWeek',['echarts', '../utils/WeekTable', 'js/inStats/macarons'], function(echarts, HHTable) {
    
    //  设置图表属性
    function createOption(series, legends, datas) {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data : legends
            },
            
            toolbox: {
                show: true,
                feature : {
                    dataView : {
                        show: true,
                        readOnly: true,
                        title : '数据视图',
                        optionToContent : function(options) {
                            return HHTable(datas, null, 7);
                            //  return ChartTable(datas, '<thead><tr><th>漏洞状态</th><th>漏洞数量</th><th>漏洞等级</th><th>漏洞数量</th></tr><thead>')
                        }
                    },
                    mark : {show: true},
                    magicType : {
                        show: true,
                        type: ['line', 'bar']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}                    
                },
               
            },
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data : ['周日', '周一','周二','周三','周四','周五','周六']
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    //  formatter: '{value} 个漏洞'
                    formatter: '{value}'
                },
                axisPointer: {
                    snap: true
                }
            },

            series : series
        };
    }
    
    //  获取数据
    function fetchData($scope, $http, url, callback) {
        var week = $scope.effectWeek,
            year = $scope.effectYear;
        $http({
            method : "GET",
            url : url,
            params : {
                week,
                year
            }
        }).success(function (datas) {
            //  判断数据是否为空
            if(datas) {
                var series = [],
                    legends = [];
                for(var prop in datas) {
                    legends.push(prop);
                    series.push({
                        name : prop,
                        type : 'line',
                        data : datas[prop]
                    });
                }
                callback(series, legends, datas);
           }
        });
    }
    
    function initChart($rootScope, $scope, $http, routeParams, options) {
        var id = options.el,
            url = options.url,
            leakChart = echarts.init(document.getElementById(id), 'macarons');
        //  修改
        function refresh() {
            fetchData($scope, $http, url, function(series, legends, datas) {
                var option = createOption(series, legends, datas);
                //  阻止合并
                leakChart.setOption(option, {notMerge : true});
            }); 
        }
        //
        refresh();
        return refresh;
    }
    
    return initChart;
});
define('js/inStats/portals/AlarmExpire',['echarts', '../utils/WeekTable', 'js/inStats/macarons'], function(echarts, HHTable) {
    
    //  设置图表属性
    function createOption(series, legends, datas) {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data : ['新增告警', '超时告警']
            },
            toolbox: {
                show: true,
                feature : {
                    mark : {show: true},
                    dataView : {
                        show: true,
                        readOnly: true,
                        title : '漏洞处理状态按业务线统计分布图',
                        optionToContent : function(opt) {
                            return HHTable(datas, '<thead><tr><th>业务线</th><th>新增告警</th><th>超时告警</th></tr><thead>', 2);
                            //  return ChartTable(datas, '<thead><tr><th>漏洞状态</th><th>漏洞数量</th><th>漏洞等级</th><th>漏洞数量</th></tr><thead>')
                        }
                    },
                    magicType : {
                        show: true,
                        type: ['line', 'bar']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            xAxis:  {
                type: 'category',
                boundaryGap: true,
                data : legends,
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    //  formatter: '{value} 个漏洞'
                    formatter: '{value}'
                },
                axisPointer: {
                    snap: true
                }
            },
            
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            series : series
        };
    }
    
    //  获取数据
    function fetchData($scope, $http, url, callback) {
         var week = $scope.effectWeek,
            year = $scope.effectYear;
        $http({
            method : "GET",
            url : url,
            params : {
                week,
                year
            }
        }).success(function (datas) {
            //  判断数据是否为空
            if(datas) {
                var series = [],
                    data1 = [],
                    data2 = [],
                    legends = [];
                for(var prop in datas) {
                    legends.push(prop);
                    data1.push(datas[prop][0]);
                    data2.push(datas[prop][1]);
                }
                series.push({
                    name : '新增告警',
                    type : 'bar',
                    data : data1
                });
                series.push({
                    name : '超时告警',
                    type : 'bar',
                    data : data2
                });
                callback(series, legends, datas);
           }
        });
    }
    
    function initChart($rootScope, $scope, $http, routeParams, options) {
        var id = options.el,
            url = options.url,
            leakChart = echarts.init(document.getElementById(id), 'macarons');
        function refresh() {
            fetchData($scope, $http, url, function(series, legends, datas) {
                var option = createOption(series, legends, datas);
                leakChart.setOption(option, {notMerge : true});
            }); 
        }
        refresh();
        return refresh;
    }
    
    return initChart;
});
define('js/inStats/portals/AlarmSla',['echarts', '../utils/HHTable', 'js/inStats/macarons'], function(echarts, HHTable) {
    
    //  设置图表属性
    function createOption(times, values, datas) {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            toolbox: {
                show: true,
                feature : {
                    mark : {show: true},
                    magicType : {
                        show: true,
                        type: ['line', 'bar']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data : times,
                axisLabel: {
                    interval: 0,
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                },
                axisPointer: {
                    snap: true
                },
                max : 1,
                min : 0
            },

            series: [
                {
                    name:'漏洞数量',
                    type:'line',
                    smooth: true,
                    data: values,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ],
                        label : {
                            normal : {
                                formatter : '{b} : {c}'
                            }
                        }
                    },
                    markLine : {
                        label : {
                            normal : {
                                formatter : '{b} : {c}'
                            }
                        },
                        data : [
                            {type : 'average', name: '平均值'}
                        ]
                    }
                }
            ]
        };
    }
    
    //  获取数据
    function fetchData($http, callback) {
        $http({
            method : "GET",
            url : '/inStats/alarm/sla'
        }).success(function (datas) {
            //  判断数据是否为空
            if(datas && datas.length > 0) {
               var times = [],
                   values = [];
                for(var i = 0, len = datas.length; i < len; i ++) {
                    times.push(datas[i].name);
                    values.push(datas[i].value);
                }
                callback(times, values, datas);
           }
        });
    }
    
    function initChart($rootScope, $scope, $http, routeParams) {
        var leakChart = echarts.init(document.getElementById('sla-chart'), 'macarons');
        fetchData($http, function(times, values, datas) {
            var option = createOption(times, values, datas);
            leakChart.setOption(option);
        });     
    }
    
    return initChart;
});
define('js/inStats/utils/AnalysisTable',[], function () {

    function createHeader(label, legends) {
        var thead = '<thead><tr>';
        thead = '<th>' + label + '</th>';
        for (var i = 0, len = legends.length; i < len; i++) {
            thead += '<th>' + legends[i] + '</th>';
        }
        return thead + '</tr></thead>';
    }
    /*平行子栏排列方式*/
    function AnalysisTables(datas, header, size) {
        var tabs = '<table class="table table-bordered table-striped table-hover">',
            results = {};
        tableHeader = createHeader('告警类型', header)
        tabs += tableHeader;
        //   处理数据
        for (var prop in datas) {
            var row = '<tr>',
                data = datas[prop];
            row += '<td>' + prop + '</td>';
            for (var i = 0, len = data.length; i < len; i++) {
                row += '<td class="td-value">' + data[i] + '</td>';
            }
            for (; i < header.length; i++) {
                row += '<td class="td-value">' + '-' + '</td>';
            }
            row += '</tr>'
            tabs += row;
        }

        return tabs + '</table>'
    }

    return AnalysisTables;
});
define('js/inStats/portals/AlarmAnalysis',['echarts', '../utils/AnalysisTable', 'moment'], function (echarts, AnalysisTable, moment) {

  //  设置图表属性
  function createOption(series, legends, xdatas, datas) {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        type: 'scroll',
        orient: series.length > 5 ? '' : 'horizontal',
        bottom: series.length > 5 ? 330 : 370,
        data: legends
      },

      toolbox: {
        show: true,
        feature: {
          dataView: {
            show: true,
            readOnly: true,
            title: '数据视图',
            optionToContent: function (options) {
              return AnalysisTable(datas, xdatas, 7);
              //  return ChartTable(datas, '<thead><tr><th>漏洞状态</th><th>漏洞数量</th><th>漏洞等级</th><th>漏洞数量</th></tr><thead>')
            }
          },
          mark: { show: true },
          magicType: {
            show: true,
            type: ['line', 'bar']
          },
          restore: { show: true },
          saveAsImage: { show: true }
        },

      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xdatas
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        },
        axisPointer: {
          snap: true
        }
      },

      grid: {
        top: series.length > 5 ? 100 : 50
      },

      series: series
    };
  }

  //  获取数据
  function fetchData($scope, $http, url, querys, callback) {
    //获取查询参数
    let startTime = moment($scope.analysisStart).format('YYYY-MM-DD')
    let endTime = moment($scope.analysisEnd).format('YYYY-MM-DD')
    querys.startTime = startTime
    querys.endTime = endTime
    $http({
      method: "GET",
      url: url,
      params: querys
    }).success(function (datas) {
      //  判断数据是否为空
      if (datas) {
        var series = [],
          legends = datas.names;
        for (var prop in datas.datas) {
          series.push({
            name: prop,
            type: 'line',
            data: datas.datas[prop]
          });
        }
        callback(series, legends, datas.dates, datas.datas)
      }
    });
  }

  function initChart($rootScope, $scope, $http, routeParams, options) {
    var id = options.el,
      url = options.url,
      querys = {
        startTime: options.startTime,
        endTime: options.endTime,
        alarmTypes: options.alarmTypes,
        rateType: options.rateType
      },
      leakChart = echarts.init(document.getElementById(options.el), 'macarons');
    //  修改
    function refresh() {
      fetchData($scope, $http, url, querys, function (series, legends, xdatas, datas) {
        var option = createOption(series, legends, xdatas, datas);
        //  阻止合并
        leakChart.setOption(option, { notMerge: true });
      });
    }
    //
    refresh();
    return refresh;
  }

  return initChart;
});
define('js/inStats/AlarmStatCtrl',['./portals/AlarmType', './portals/AlarmWeek', './portals/AlarmExpire', './portals/AlarmSla', './portals/AlarmRelative', './portals/AlarmAnalysis', 'moment', './../common/add-water-mark'], function (AlarmType, AlarmWeek, AlarmExpire, AlarmSla, AlarmRelative, AlarmAnalysis, moment, addWaterMark) {
    return function (appMod) {

        appMod.filter('numFilter', [function () {
            return function (input) {
                return input === 0 ? '-' : input
            }
        }]);

        appMod.filter('toInt', [function () {
            return function (input, args) {
                if (!args) {
                    args = 0;
                }
                return parseInt(input) + args
            }
        }]);

        function createStartDate() {
            return new Date(2017, 0, 1)
        }

        appMod.controller('AlarmStatCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$timeout',
            function ($rootScope, $scope, $http, routeParams, $timeout) {
                addWaterMark($rootScope)
                $scope.active = 0;
                $scope.tab1Inited = false;
                $scope.tab2Inited = false
                $scope.yearEnums = [2017, 2018, 2019, 2020];
                $scope.timeEnums = [{ name: 'days', label: '天' }, { name: 'weeks', label: '周' }, { name: 'months', label: '月' }]
                $scope.effectEnums = null;
                //  默认为30天
                $scope.timeCount = 30
                $scope.timeUnit = $scope.timeEnums[0].name
                //
                $scope.activeTab = function (index) {
                    this.active = index;
                    if (index > 0 && !$scope[`tab${index}Inited`]) {
                        $scope[`tab${index}Inited`] = true;
                        // 图片无法展开
                        $timeout(function () {
                            // index == 1 ? initTab1() : initTab2()
                            switch (index) {
                                case 1:
                                    initTab1()
                                    break;
                                case 2:
                                    initTab2()
                                    break
                                case 3:
                                    // $scope.analysisStart = new Date(2017, 08, 03)
                                    $scope.analysisStart = new Date(moment().subtract(3, 'month'))
                                    $scope.dateOptions.minDate = new Date(2017, 08, 03)
                                    initTab3()
                                    break
                            }
                        }, 16);
                    }
                }
                //  初始化时间控件
                angular.extend($scope, {
                    closeText: '关闭',
                    currentText: '今天',
                    clearText: '清除',
                    format: 'yyyy-MM-dd',
                    dateOptions: {
                        formatYear: 'yyyy',
                        maxDate: new Date(),
                        minDate: createStartDate(),
                        startingDay: 1
                    }
                });
                //  初始化时间标识值
                var timeComps = ['type', 'level', 'analysis'];
                timeComps.forEach(function (item) {
                    var startTime = item + 'Start',
                        endTime = item + 'End',
                        startOpend = startTime + 'Opened',
                        endOpend = endTime + 'Opened',
                        startAction = startTime + 'Open',
                        endAction = endTime + 'Open'
                    $scope[startTime] = createStartDate();
                    $scope[startOpend] = false;
                    $scope[startAction] = function () {
                        $scope[startOpend] = !$scope[startOpend];
                    };
                    //
                    $scope[endTime] = new Date();
                    $scope[endOpend] = false;
                    $scope[endAction] = function () {
                        $scope[endOpend] = !$scope[endOpend];
                    };
                });

                //  初始化 Tab0
                function initTab0() {
                    AlarmType($rootScope, $scope, $http, routeParams, 'type', '/inStats/alarm/alarmType', '告警类型');
                    AlarmType($rootScope, $scope, $http, routeParams, 'level', '/inStats/alarm/alarmCage', '告警等级');
                    AlarmSla($rootScope, $scope, $http, routeParams);
                    //  各类型告警处理状态数量分布
                    $http({
                        method: 'GET',
                        url: '/inStats/alarm/state',
                    }).success(function (datas) {
                        $scope.states = datas;
                    });

                    //  超时，未处理
                    $http({
                        method: 'GET',
                        url: '/inStats/alarm/orders',
                    }).success(function (datas) {
                        $scope.orders = datas;
                    });
                }
                initTab0();
                //  初始化Tab 1
                function initTab1() {
                    //  设置默认时间
                    $scope.effectYear = $scope.year;
                    $scope.effectWeek = $scope.week;

                    var r1 = AlarmWeek($rootScope, $scope, $http, routeParams, {
                        el: 'weekChart',
                        url: '/inStats/alarm/week'
                    });

                    var r2 = AlarmWeek($rootScope, $scope, $http, routeParams, {
                        el: 'handleChart',
                        url: '/inStats/alarm/handle'
                    });

                    var r3 = AlarmExpire($rootScope, $scope, $http, routeParams, {
                        el: 'expireChart',
                        url: '/inStats/alarm/expire'
                    });
                    //  注册事件
                    $scope.effectSure = function () {
                        r1();
                        r2();
                        r3();
                    }
                }
                //
                function initTab2() {
                    var relativeChart = AlarmRelative($rootScope, $scope, $http, routeParams, {
                        el: 'relativeChart',
                        url: '/inStats/alarm/alarmtypetrend'
                    });

                    // 更改时刷新
                    $scope.changeUnit = function () {
                        relativeChart()
                    }
                }

                function initTab3() {
                    // 告警准确率
                    var alarmAccuracyEvent = AlarmAnalysis($rootScope, $scope, $http, routeParams, {
                        el: 'AlarmAccuracyChart',
                        url: '/inStats/alarm/alarmratetrend',
                        startTime: moment($scope.analysisStart).format('YYYY-MM-DD'),
                        endTime: moment($scope.analysisEnd).format('YYYY-MM-DD'),
                        rateType: 'ar',
                        alarmTypes: '',
                    });
                    // 告警闭环率
                    var alarmCloseLoopEvent = AlarmAnalysis($rootScope, $scope, $http, routeParams, {
                        el: 'AlarmCloseLoopChart',
                        url: '/inStats/alarm/alarmratetrend',
                        startTime: moment($scope.analysisStart).format('YYYY-MM-DD'),
                        endTime: moment($scope.analysisEnd).format('YYYY-MM-DD'),
                        rateType: 'cr',
                        alarmTypes: '',
                    });
                    // 告警工单闭环率
                    var alarmOrderCloseLoopEvent = AlarmAnalysis($rootScope, $scope, $http, routeParams, {
                        el: 'AlarmOrderCloseLoopChart',
                        url: '/inStats/alarm/alarmratetrend',
                        startTime: moment($scope.analysisStart).format('YYYY-MM-DD'),
                        endTime: moment($scope.analysisEnd).format('YYYY-MM-DD'),
                        rateType: 'wcr',
                        alarmTypes: '',
                    });

                    // 告警MTTD（分钟）
                    var alarmMTTDEvent = AlarmAnalysis($rootScope, $scope, $http, routeParams, {
                        el: 'AlarmMTTDFChart',
                        url: '/inStats/alarm/alarmratetrend',
                        startTime: moment($scope.analysisStart).format('YYYY-MM-DD'),
                        endTime: moment($scope.analysisEnd).format('YYYY-MM-DD'),
                        rateType: 'mttd',
                        alarmTypes: '',
                    });

                    // 告警MTTR（分钟）
                    var alarmMTTREvent = AlarmAnalysis($rootScope, $scope, $http, routeParams, {
                        el: 'AlarmMTTRChart',
                        url: '/inStats/alarm/alarmratetrend',
                        startTime: moment($scope.analysisStart).format('YYYY-MM-DD'),
                        endTime: moment($scope.analysisEnd).format('YYYY-MM-DD'),
                        rateType: 'mttr',
                        alarmTypes: '',
                    });

                    // 更改时刷新
                    $scope.analysisSubmit = function () {
                        alarmAccuracyEvent()
                        alarmCloseLoopEvent()
                        alarmOrderCloseLoopEvent()
                        alarmMTTDEvent()
                        alarmMTTREvent()
                    }
                }

                //  改变年份
                $scope.changeEffectYear = function () {
                    fetchWeeks(this.effectYear, 'effectEnums');
                }
                //  初始化星期常量
                function fetchWeeks(year, prop) {
                    $http({
                        method: "GET",
                        url: '/inStats/weeks/' + year
                    }).success(function (datas) {
                        //  获取当前的时间
                        $scope[prop] = datas;
                    });
                }
                //  初始化当前时间
                (function () {
                    $http({
                        method: "GET",
                        url: '/inStats/weeks/now'
                    }).success(function (datas) {
                        //  设置共同用时间
                        $scope.week = datas.weeks;
                        $scope.year = datas.year;
                        //  抽取周数据
                        fetchWeeks($scope.year, 'effectEnums');
                    });
                })()

            }
        ]);
    }

});
define('js/inStats/portals/DataType',['echarts', '../utils/PieTable', 'js/inStats/macarons'], function (echarts, PieTable) {

    function fetchData($http, url, $scope, id, callback) {
        $http({
            method: "GET",
            url: url
        }).success(function (datas) {
            //  判断数据是否为空
            if (datas) {
                var legends = [];
                for (var i = 0, len = datas.length; i < len; i++) {
                    legends.push(datas[i].name);
                }
                callback(legends, datas);
            }
        });
    }

    function createOption(legends, datas, title) {
        return {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {
                        show: true,
                        readOnly: true,
                        title : title,
                        optionToContent : function(opt) {
                            return PieTable(datas)
                        }
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },            
            legend: {
                orient: 'vertical',
                left: 5,
                top: 25,
                bottom: 15,
                data: legends
            },
            series: [
                {
                    name: title,
                    type: 'pie',
                    radius: '55%',
                    center: ['40%', '50%'],
                    data: datas,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                    }
                ]
        };
    }

    function initChart($scope, $http, id, url, title) {
        //  初始化图形
        var leakChart = echarts.init(document.getElementById(id), 'macarons');
        //  初始处理数据
        fetchData($http, url, $scope, id, function (legends, datas) {
            var option = createOption(legends, datas, title);
            leakChart.setOption(option, title);
        });
    }
    
    return initChart;

});
define('js/inStats/portals/DataExpire',['echarts', 'js/inStats/macarons'], function(echarts) {
    
    function fetchData($http, url, callback) {
        $http({
            method: "GET",
            url: url
        }).success(function (datas) {
            //  判断数据是否为空
            if (datas) {
                var xdatas = [],
                    sdatas = [];
                datas.forEach(function(item) {
                    xdatas.push(item.name);
                    sdatas.push(item.value);
                });
                callback(xdatas, sdatas, datas);
            }
        });
    }
    
    function createOption(xdatas, sdatas, desc) {
        return {
             tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '25%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : xdatas,
                    axisLabel: {
                        interval: 0,
                        rotate: 30
                    },
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    min : 0                    
                }
            ],
            series : [
                {
                    name : desc,
                    type:'bar',
                    barWidth: '60%',
                    data : sdatas
                }
            ]
        }
    }
   
    //
    function initChart($rootScope, $scope, $http, url, id, desc) {
        var leakChart = echarts.init(document.getElementById(id), 'macarons');
        fetchData($http, url, function(xdatas, sdatas, datas) {
            var option = createOption(xdatas, sdatas, desc);
            leakChart.setOption(option);
        });        
    }    
    return initChart;
    
});
define('js/inStats/DataStatCtrl',['./portals/DataType', './portals/DataExpire', './../common/add-water-mark'], function (DataType, DataExpire, addWaterMark) {    
    return function (appMod) {
         appMod.controller('DataStatCtrl', ['$rootScope', '$scope', '$http', '$routeParams', 
                function($rootScope, $scope, $http, routeParams) {
                    addWaterMark($rootScope)
                    $scope.active = 0;
                    $scope.tab1Inited = false;
                    $scope.activeTab = function(index) {
                        this.active = index;
                        if(index == 1 && !$scope.tab1Inited) {
                            $scope.tab1Inited = true;
                            setTimeout(function() {
                                initTab1();
                            }, 50);
                        }
                    }

                    //  首次载入面板一
                    function initTab1() {
                        //  首次载入面板一
                        DataType($scope, $http, 'usedChart', '/inStats/data/use', '数据申请工单个状态数量分布');
                        DataType($scope, $http, 'levelChart', '/inStats/data/level', '涉及数委会处理的工单按照状态数量分布');
                        DataType($scope, $http, 'providerChart', '/inStats/data/provider', '涉及数委会处理的工单按照状态数量分布');
                        DataExpire($rootScope, $scope, $http, '/inStats/data/avg', 'avgChart', '消耗时间(分钟)');
                        DataExpire($rootScope, $scope, $http, '/inStats/data/dept', 'deptChart', '申请数量(个)');
                    }
                    
                    //  初始化面板0
                    function initTab0() {
                        DataType($scope, $http, 'typeChart', '/inStats/data/all', '数据申请工单个状态数量分布');
                        DataType($scope, $http, 'swhChart', '/inStats/data/swh', '涉及数委会处理的工单按照状态数量分布');
                        DataExpire($rootScope, $scope, $http, '/inStats/data/expire', 'expireChart', '未处理工单数量');
                    }
                    
                    //  初始化面板
                    initTab0();
                    
                    
                }]);
    }
});
define('js/inStats/utils/DefaultTable',[], function() {
    /*平行子栏排列方式*/
   function HhTables(legends, series, label) {
       var tabs = '<table class="table table-bordered table-striped table-hover">',
           thead = createHeader(label, legends),
           tbody = createBody(series, legends);
       tabs += thead;
       tabs += tbody;
       return tabs + '</table>'
   }
    
   function createHeader(label, legends) {
       var thead = '<thead><tr>';
       thead = '<th>' + label + '</th>';
       for(var i = 0, len = legends.length; i < len; i ++) {
           thead += '<th>' + legends[i] + '</th>';
       }
       return thead + '</tr></thead>';
   }
    
   function createBody(series, legends) {
       var tbody = '<tbody>',
           count = ['总计'],
           size = legends.length + 1;
       //   初始化统计行
       for(var l = 1; l < size; l ++) {
           count[l] = 0
       }
       //
       for(var i = 0, len = series.length; i < len; i ++) {
           var row = '<tr>',
               item = series[i],
               name = item.name,
              
               datas = item.data;
            row +=  '<td>' + name + '</td>'; 
            datas.forEach(function(data, j) {
                row +=  '<td class="td-value">' + (data == 0 ? '-': data) + '</td>';
                count[j + 1] += data; 
            })
            tbody += row + '</tr>'
       }
       // 添加统计行
       var lrow = '<tr>';
       count.forEach(function(data) {
            lrow +=  '<td class="td-value">' + (data == 0 ? '-': data) + '</td>'
       });
       tbody += lrow + '</tr>'          
       return tbody + '</tbody>'
   }
    
   return HhTables;
});
define('js/inStats/portals/EngHistory',['echarts', '../utils/DefaultTable', 'js/inStats/macarons'], function(echarts, HHTable) {
    
    function createSerie() {
        return {
            name: '',
            type: 'line',
            data: []
        };
    }
    
    function createOption(legends, xdatas, series, datas) {
        return {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: legends,
                orient: 'horizontal',
                y : 'bottom'
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {
                        show: true,
                        readOnly: true,
                        title : '数据明细表',
                        optionToContent : function(opt) {
                            return HHTable(xdatas, series, '姓名');
                        }
                    },
                    magicType : {
                        show: true,
                        type: ['line', 'bar']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis:  {
                axisLabel: {
                    interval: 0,
                    rotate: 45
                },
                type : 'category',
                boundaryGap: false,
                data : xdatas              
            },
            yAxis: {
                type: 'value',
                name : '告警数量(个)',
                minInterval : 1
            },
            series: series
        };
    }
    
    function fetchData($http, callback) {
        $http({
            method : "GET",
            url : '/inStats/eng/history'
        }).success(function (datas) {
            //  判断数据是否为空
            if(datas) {
               var legends = datas.names,
                   series = [],
                   xdatas = datas.weeks,
                   sdatas = datas.datas;
                for(var prop in sdatas) {
                    var serieOption = createSerie(),
                         data = sdatas[prop];
                    serieOption.name = prop;
                    serieOption.data = data;
                    series.push(serieOption);
                }
                callback(legends, xdatas, series, datas);               
           }
        });
    }
    
    //
    function initChart($rootScope, $scope, $http, routeParams) {
        var leakChart = echarts.init(document.getElementById('historyChart'), 'macarons');
        fetchData($http, function(legends, xdatas, series, datas) {
            var option = createOption(legends, xdatas, series, datas);
            leakChart.setOption(option);
/*            
            leakChart.on('legendscroll', function (params) {
                console.log(params);
            });*/

        });        
    }    
    return initChart;
    
});
define('js/inStats/portals/EngEffect',['echarts', '../utils/DefaultTable', 'js/inStats/macarons'], function(echarts, HHTable) {
    
    function createSerie() {
        return {
            name: '',
            type: 'line',
            smooth : false,
            data: []
        };
    }
    
    function createOption(legends, xdatas, series, datas) {
        return {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: legends,
                orient: 'horizontal',
                y : 'bottom'
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {
                        show: true,
                        readOnly: true,
                        title : '数据明细表',
                        optionToContent : function(opt) {
                            return HHTable(xdatas, series, '姓名');
                        }
                    },
                    magicType : {
                        show: true,
                        type: ['line', 'bar']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis:  {
                axisLabel: {
                    interval: 0,
                    rotate: 45
                },
                type : 'category',
                boundaryGap: false,
                data : xdatas              
            },
            yAxis: {
                type: 'value',
                name : '平均处理时间(分钟)',
                minInterval : 1
            },
            series: series
        };
    }
    
    function fetchData($scope, $http, callback) {
        var year = $scope.effectYear,
            week = $scope.effectWeek;
        $http({
            method : "GET",
            url : '/inStats/eng/effect',
            params : {
                year,
                week
            }
        }).success(function (datas) {
            //  判断数据是否为空
            if(datas) {
               var legends = datas.names,
                   series = [],
                   xdatas = datas.weeks,
                   sdatas = datas.datas;
                for(var prop in sdatas) {
                    var serieOption = createSerie(),
                         data = sdatas[prop];
                    serieOption.name = prop;
                    serieOption.data = data;
                    series.push(serieOption);
                }
                callback(legends, xdatas, series, datas);               
           }
        });
    }
    
    //
    function initChart($rootScope, $scope, $http, routeParams) {
        var leakChart = echarts.init(document.getElementById('effectChart'), 'macarons');
        
        function refresh() {
            fetchData($scope, $http, function(legends, xdatas, series, datas) {
                var option = createOption(legends, xdatas, series, datas);
                leakChart.setOption(option);
            });
        }
        //  执行默认调用
        refresh();
    }    
    return initChart;
    
});
define('js/inStats/EngStatCtrl',['./portals/EngHistory', './portals/EngEffect', './../common/add-water-mark'], function (EngHistory, EngEffect, addWaterMark) {    
    return function (appMod) {
        appMod.filter('numFilter', [function() {
            return function(input) {
                return input === 0 ? '-' : input
            }
        }]);
        
        appMod.filter('toInt', [function() {
            return function(input, args) {
                if(!args) {
                    args = 0;
                }
                return parseInt(input) + args
            }
        }]); 
        
         appMod.controller('EngStatCtrl', ['$rootScope', '$scope', '$http', '$routeParams',
             //                                   
             function($rootScope, $scope, $http, routeParams) {
                addWaterMark($rootScope)
                    $scope.active = 0;
                    $scope.tab1Inited = false;
                    $scope.yearEnums = [2017, 2018, 2019, 2020];
                    $scope.effectEnums = null;
                    //  激活标签页
                    $scope.activeTab = function(index) {
                        this.active = index;
                        if(index == 1 && !$scope.tab1Inited) {
                            $scope.tab1Inited = true;
                            setTimeout(function() {
                                initTab1();
                            }, 16);
                        }
                    }
                    //  改变年份
                    $scope.changeEffectYear = function() {
                        fetchWeeks(this.effectYear, 'effectEnums');
                    }
                   
                   

                    //  首次载入面板一
                    function initTab1() {
                        //  设置默认时间
                        $scope.effectYear = $scope.year;
                        $scope.effectWeek = $scope.week;
                        
                        function fetchDatas() {
                            var year = $scope.effectYear,
                                week = $scope.effectWeek;
                            $http({
                                method : "GET",
                                url : '/inStats/eng/weekday/' + year + '/' + week
                            }).success(function (datas) {
                                //  判断数据是否为空
                                if(datas) {
                                   var names = datas.names,
                                       series = datas.datas,
                                       weeks = datas.weeks;
                                   $scope.series = series;
                                   $scope.weeks = weeks    
                               }
                            });

                            $http({
                                method : "GET",
                                url : '/inStats/eng/all/' + year + '/' + week
                            }).success(function (datas) {
                                //  判断数据是否为空
                                if(datas) {
                                   $scope.alls = datas;
                               }
                            });
                        }
                        //  注册事件
                        $scope.effectSure = function() {
                             fetchDatas();
                        }
                        //  首次执行
                        fetchDatas();                        
                    }
                 
                    //  初始化星期常量
                    function fetchWeeks(year, prop) {
                        $http({
                            method : "GET",
                            url : '/inStats/weeks/' + year
                        }).success(function (datas) {
                            //  获取当前的时间
                            $scope[prop] = datas;
                        });
                    }
                    //  初始化当前时间
                    (function() {
                        $http({
                            method : "GET",
                            url : '/inStats/weeks/now'
                        }).success(function (datas) {
                            //  设置共同用时间
                            $scope.week = datas.weeks;
                            $scope.year = datas.year;
                            //  抽取周数据
                            fetchWeeks($scope.year, 'effectEnums');
                            //
                            EngHistory($rootScope, $scope, $http, routeParams);
                            EngEffect($rootScope, $scope, $http, routeParams);
                        });
                    })()
             }]);
    }
});
define('js/inStats/index',['require','exports','module','../common/app','./LeakStatCtrl','./AlarmStatCtrl','./DataStatCtrl','./EngStatCtrl'],function(require, exports, module) {
    var myApp = require('../common/app'),
        secApp = angular.module('secApp', ['myApp', 'ngRoute', 'ui.bootstrap']);
    
    /**
     *  构建相对路径
     */
    function buildUrl(path) {
        return '../js/inStats/' + path;
    }
    
    //  漏洞统计页面
    require('./LeakStatCtrl')(secApp);
    //  告警统计页面
    require('./AlarmStatCtrl')(secApp);
    //  数据申请统计页面
    require('./DataStatCtrl')(secApp);
    //  安全工程师
    require('./EngStatCtrl')(secApp);
    
    //  初始化路由
    secApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
         $routeProvider
            .when('/', {
              controller  : 'LeakStatCtrl as leak',
              templateUrl : buildUrl('leak.html'),
              reloadOnSearch : false
            })
            .when('/leak', {
              controller  : 'LeakStatCtrl as leak',
              templateUrl : buildUrl('leak.html'),
              reloadOnSearch : false
            })
            .when('/alarm', {
              controller  : 'AlarmStatCtrl as alarm',
              templateUrl : buildUrl('alarm.html'),
              reloadOnSearch : false
            })
            .when('/eng', {
              controller  : 'EngStatCtrl as eng',
              templateUrl : buildUrl('eng.html'),
              reloadOnSearch : false
            })
            .when('/data', {
              controller  : 'DataStatCtrl as df',
              templateUrl : buildUrl('data.html'),
              reloadOnSearch : false
            })
            .otherwise('/');
        //$locationProvider.html5Mode(true).hashPrefix();
    }]);


    angular.element(document).ready(function() {
        angular.bootstrap(document, ['secApp']);
    });
});

(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('@charset \"UTF-8\";.header:before,.header-right:before,.header:after,.header-right:after{content:\"\";display:table;}.header:after,.header-right:after{clear:both;}dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:\'...\\A..\\A.\';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.header{min-width:1100px;width:100%;height:70px;border-bottom:solid 1px #d4d6db;color:#262626;box-shadow:0 1px 2px 1px #f1f1f1;}.logo{margin-left:35px;line-height:70px;display:inline-block;background:url(/project/portals/i/logo.png?v=953c28) 0 center no-repeat;background-size:35px auto;font-size:22px;padding-left:41px;color:#262626;vertical-align:middle;cursor:pointer;text-decoration:none;}.logo:hover{text-decoration:none;color:#262626;}.header-list > li .p-dropdown,.header-right .msg .p-dropdown,.header-right .user .p-dropdown{display:block;position:absolute;width:160px;top:62px;left:50%;transition:transform 0.25s cubic-bezier(0.18,0.89,0.32,1.28);transform-origin:center top;transform:translate(-50%) scaleY(0);}.header-list > li:hover .p-dropdown,.header-right .msg:hover .p-dropdown,.header-right .wrap-user-img:hover .p-dropdown{transform:translate(-50%) scaleY(1);}.header-list{font-size:16px;display:inline-block;vertical-align:middle;margin-left:75px;list-style:none outside none;margin-bottom:0;}.header-list > li{padding:0 10px;margin-right:30px;float:left;line-height:70px;position:relative;cursor:pointer;}.header-list > li:last-child{margin-right:0;}.header-list > li:hover > a,.header-list > li.hover > a{color:#528be6;text-decoration:none;}.header-list > li:hover > i,.header-list > li.hover > i{left:0;right:0;}.header-list > li > a{transition:color .3s ease-out;color:#262626;display:block;text-align:center;line-height:70px;text-decoration:none;}.header-list > li > i{position:absolute;bottom:10px;left:50%;right:50%;height:4px;font-size:0;background-color:#528be6;transition-property:left,right;transition-duration:.3s;transition-timing-function:ease-out;}.header-right{line-height:70px;height:70px;font-size:0;margin-right:16px;float:right;}.header-right .msg{position:relative;color:#262626;line-height:70px;font-size:14px;float:left;cursor:pointer;}.header-right .msg a{text-decoration:none;color:#262626;}.header-right .msg b{font-weight:normal;color:#fa9027;margin-left:6px;}.header-right .wrap-user-img{float:left;}.header-right .wrap-user-img:hover .user:before{transform:rotate(-45deg);top:60%;}.header-right .wrap-img{float:left;height:70px;margin-left:46px;padding-top:15px;cursor:pointer;}.header-right .wrap-img img{vertical-align:top;border-radius:50%;width:40px;height:40px;}.header-right .user{padding-left:11px;margin-right:58px;cursor:pointer;position:relative;height:70px;float:left;}.header-right .user:before{content:\'\';display:block;width:8px;height:8px;border:solid #d8d8d8;border-width:2px 2px 0 0;position:absolute;top:50%;z-index:1;transform:rotate(135deg);}.header-right .user:before{right:-20px;margin-top:-5px;transition:all .3s linear;}.header-right .user .name{display:inline-block;vertical-align:middle;color:#343434;font-size:14px;}.p-dropdown{padding:6px 0;border-radius:8px;background-color:#ffffff;box-shadow:0 0 2px 2px #f1f1f1;position:relative;list-style:none outside none;z-index:1000;}.p-dropdown:before{content:\'\';position:absolute;top:-2px;left:50%;z-index:10;width:10px;height:10px;background-color:#fff;border:solid #f0f0f0;border-width:1px 0 0 1px;box-shadow:-1px -1px 2px #f1f1f1;transform:rotate(45deg) translate(-50%);}.p-dropdown > .list-item,.p-dropdown > li{color:#262626;font-size:14px;line-height:35px;padding:0 16px;}.p-dropdown > .list-item:hover,.p-dropdown > li:hover{background-color:#f5f5f5;}.p-dropdown > .list-item:last-child,.p-dropdown > li:last-child{border-radius:0 0 4px 4px;}.p-dropdown > .list-item:first-child,.p-dropdown > li:first-child{border-radius:4px 4px 0 0;}.p-dropdown > .list-item a,.p-dropdown > li a{color:#262626;}.p-dropdown > .list-item a:hover,.p-dropdown > li a:hover{color:#528be6;text-decoration:none;}.p-dropdown > .list-item > b,.p-dropdown > li > b{font-weight:normal;color:#fa8919;padding-right:8px;}@media (max-width:1000px){.header-list{margin-left:0;}.header-list > li{margin-right:15px;}}@media (max-width:1200px){.header-list{margin-left:0;}.header-list > li{margin-right:18px;}}');
