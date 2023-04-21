'use strict';
/**
 * author           xj
 * @date            2016-12-07 16:35:08
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/observer',['require','exports','module'],function (require, exports, module) {
    var Observer = function () {
        this.func = {};
    };
    var slice = Array.prototype.slice;
    Observer.prototype = {
        constructor: Observer,
        fire: function (name) {
            if (!name) {
                return;
            }
            var args = slice.call(arguments, 1);
            var funcs = this.func[name];
            funcs && funcs.length && funcs.forEach(function (fn) {
                fn.apply(this, args);
            });
            return this;
        },
        on: function (name, fn) {
            if (typeof fn === 'undefined') {
                return this;
            }
            (this.func[name] || (this.func[name] = [])).push(fn);
            return this;
        },
        remove: function (name, fn) {
            if (arguments.length === 0) {
                this.func = {};
                return this;
            }
            var funcs = this.func[name];
            if (!funcs) {
                return this;
            }
            if (typeof fn === 'undefined') {
                delete this.func[name];
                return this;
            }
            var index = this.func[name].indexOf(fn);
            if (index === -1) {
                return this;
            }
            this.func[name].splice(index, 1);
            return this;
        },
        hasName: function (name) {
            return (name in this.func)
        }
    };
    return new Observer;
});

'use strict';
/**
 * author           xj
 * @date            2016-09-06 13:12:31
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/utils',['require','exports','module'],function (require, exports, module) {
    var utils = {
        isDate: function (value) {
            return {}.toString.call(value) === '[object Date]';
        },
        pageName: function () {
            return location.href.replace(/\.html(.+)?/, '').split('/').pop()
        },
        getUrlData: function (url) {
            var match = (url || location.href.replace(/#.*/g, '')).match(/\?(.*)/);
            var objData = {};
            match = match && match[1];
            if (!match) {
                return objData;
            }
            match = match.split('&');
            var strKey, strVal;
            match.forEach(function (val) {
                val = val.split('=');
                strKey = decodeURIComponent(val[0]);
                strVal = val[1] === 'null' || val[1] == null ? '' : decodeURIComponent(val[1]);
                strKey && (objData[strKey] = strVal);
            });
            return objData;
        },
        getHashData: function () {
            return utils.getUrlData(location.hash);
        },
        removeScriptTags: function (str) {
            
            return str && str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<link\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/link>/gi, '');
        },
        getElOffset: function (elem) {
            if (!elem) {
                console.log('elem is null');
                return {};
            }
            var box = elem.getBoundingClientRect();
            var body = document.body;
            var docEl = document.documentElement;
            // Make sure element is not hidden (display: none) or disconnected
            if (box.width || box.height || elem.getClientRects().length) {
                var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
                var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

                var clientTop = docEl.clientTop || body.clientTop || 0;
                var clientLeft = docEl.clientLeft || body.clientLeft || 0;

                var top = box.top + scrollTop - clientTop;
                var left = box.left + scrollLeft - clientLeft;

                return {
                    top: Math.round(top),
                    left: Math.round(left)
                };
            }
            console.log('elem is hidde');
            return {};
        },
        getScroll: function () {
            var doc = document.documentElement;
            var body = document.body;
            return {
                left: (window.scrollX || window.pageXOffset || doc.scrollLeft || body.scrollLeft) - (doc.clientLeft || body.clientLeft || 0),
                top: (window.scrollY || window.pageYOffset || doc.scrollTop || body.scrollTop) - (doc.clientTop || body.clientTop || 0)
            }
        }
    }
    return utils;
});
'use strict';
/**
 * author           xj
 * @date            2016-12-07 16:35:08
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/KEY',['require','exports','module'],function (require, exports, module) {
    var KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        COMMAND: 91,
        isControl: function (e) {
            var k = e.which;
            switch (k) {
                case KEY.COMMAND:
                case KEY.SHIFT:
                case KEY.CTRL:
                case KEY.ALT:
                    return true;
            }

            if (e.metaKey || e.ctrlKey || e.altKey) return true;

            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        },
        isVerticalMovement: function (k) {
            return ~[KEY.UP, KEY.DOWN].indexOf(k);
        },
        isHorizontalMovement: function (k) {
            return ~[KEY.LEFT, KEY.RIGHT, KEY.BACKSPACE, KEY.DELETE].indexOf(k);
        }
    };
    return KEY;
});

/** 
 * 每隔waitTime 执行一次
 */
define('js/common/throttle',['require','exports','module'],function (require, exports, module) {
    return function (callback, waitTime) {
        var args, context, result, remaining;
        var lastTime = 0,
            timeout = null,
            later = function () {
                lastTime = +new Date;
                timeout = null;
                result = callback.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            };
        return function () {
            var now = +new Date;
            args = arguments;
            context = this;
            remaining = waitTime - (now - lastTime);
            if (remaining <= 0 || remaining > waitTime) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                lastTime = now;
                result = callback.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            } else if (!timeout) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        }
    };
});
define('js/common/at-user-list',['require','exports','module','./observer','./utils','./KEY','./throttle'],function (require, exports, module) {
    var observer = require('./observer');
    var utils = require('./utils');
    var KEY = require('./KEY');
    var throttle = require('./throttle');
    return function (app, textareaEl) {
        app.controller('uiUserListCtrl', ['$http', '$q', '$rootScope', '$scope', '$element', function ($http, $q, $rootScope, $scope, $element) {
            var ctrl = this;
            ctrl.activeIndex = 1;
            ctrl.isShowTip = true;
            ctrl.isShowUserList = false;
            ctrl.userList = [];

            var getUserList = ctrl.getUserList = function (name) {
                var ajaxData = {};
                if (ctrl.ajaxCanceler) {
                    ctrl.ajaxCanceler.resolve();
                    ctrl.ajaxCanceler = null;
                }
                ctrl.ajaxCanceler = $q.defer();

                ctrl.ajaxGetData = $http({
                    timeout: ctrl.ajaxCanceler.promise,
                    url: ctrl.url,
                    method: "GET",
                    params: {
                        name: name
                    }
                }).success(function (res) {
                    if (String(res.errno) !== '0') {
                        console.error(res);
                        return;
                    }
                    ctrl.isShowTip = false;
                    ctrl.userList = res.data.slice(0, ctrl.showNum | 0);
                    ctrl.activeIndex = 0;
                });
            };

            var elStyle = $element[0].style;
            elStyle.display = "none";

            ctrl.hideUserList = function () {
                elStyle.display = "none";
                ctrl.isShowUserList = false;
            };

            // ctrl.loadingtext = attr.loadingtext ? attr.loadingtext : '数据加载中';
            observer.on('show-user-list', throttle(function (atText, pos, textareaEl) {
                var top;
                elStyle.display = "block";
                ctrl.isShowUserList = true;
                elStyle.left = pos.left + "px";
                //超过最大高度，已经产生滚动条
                if (textareaEl.offsetHeight >= 300) {
                    top = utils.getElOffset(textareaEl).top + 300;
                } else {
                    top = pos.top
                }
                elStyle.top = top + "px";
                if (atText) {
                    ctrl.isShowTip = false;
                    ctrl.getUserList(atText);
                } else {
                    ctrl.isShowTip = true;
                    ctrl.activeIndex = 1;
                }
            }, 100));

            observer.on('hide-user-list', ctrl.hideUserList);

            ctrl.selectItem = function (index) {
                observer.fire('insert-text', ctrl.userList[index]);
                ctrl.hideUserList();
            };

            var handleDropDownSelection = function (key) {
                switch (key) {
                    case KEY.DOWN:
                        (ctrl.activeIndex < ctrl.userList.length - 1) ? ctrl.activeIndex++: (ctrl.activeIndex = 0);
                        break;
                    case KEY.UP:
                        ctrl.activeIndex > 0 ? ctrl.activeIndex-- : (ctrl.activeIndex = ctrl.userList.length - 1);
                        break;
                    case KEY.TAB:
                    case KEY.ENTER:
                        ctrl.selectItem(ctrl.activeIndex);
                        break;
                    case KEY.ESC:
                        ctrl.hideUserList();
                        break;
                }
            };
            var keys = [KEY.UP, KEY.DOWN, KEY.ENTER, KEY.ESC, KEY.TAB];

            textareaEl.addEventListener('keyup', function (e) {
                var key = e.which;
                //其他按键不处理
                if (!ctrl.isShowUserList || !~keys.indexOf(e.which)) {
                    return;
                }
                $scope.$apply(function () {
                    handleDropDownSelection(key);
                });
            });

            textareaEl.addEventListener('keydown', function (e) {
                if (!ctrl.isShowUserList && ctrl.userList.length) {
                    return;
                }
                if (~keys.indexOf(e.which)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }]);

        app.directive('atUserList', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
            return {
                restrict: 'E',
                require: ['atUserList'],
                scope: {
                    // loadingtext: '@'
                    showNum: '@'
                },
                replace: true,
                transclude: true,
                controllerAs: '$userListCtrl',
                controller: 'uiUserListCtrl',
                template: ` <div class="i-layer-user">
                    <ul>
                        <li class="suggest_title" ng-show="$userListCtrl.isShowTip">选择最近@的人或直接输入</li>
                        <li ng-repeat="item in $userListCtrl.userList"
                            ng-click="$userListCtrl.selectItem($index)"
                            ng-class="{hover:$userListCtrl.activeIndex===$index}"
                            >
                            <img err-src="http://static.galileo.xiaojukeji.com/static/tms/api/public/other/8355c3caf02679026151c10588307c5a.png"
                            ng-src="http://home.didichuxing.com/DidiFile/Avatar/{{item.email && item.email.split('@)[0]}}.jpg" />
                            {{item.name}}
                        </li>
                    </ul>
                </div>`,
                link: function ($scope, element, attr, ctrls) {
                    var ctrl = ctrls[0];
                    ctrl.url = attr.url;
                    ctrl.showNum = (attr.showNum | 0) || 10;
                    if (!ctrl.url) {
                        console.error('error url is null');
                    }
                }
            }
        }]);
    }
});
