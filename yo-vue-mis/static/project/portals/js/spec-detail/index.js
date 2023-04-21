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
 * @date            2016-11-04 11:25:12
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/spec-detail/build-dir',['require','exports','module'],function (require, exports, module) {
    var getLevel = function (el) {
        return el.nodeName.replace('H', '') | 0;
    };

    var checkHasChild = function (curr, headerEl, index) {
        var currLevel = getLevel(curr);
        var nextEl = headerEl[index + 1];
        if (!nextEl) {
            return false;
        }
        return currLevel < getLevel(nextEl);
    };

    var buildDir = function (id) {
        var containerEl = document.getElementById(id || 'js-spec-content');
        var headerEl = containerEl.querySelectorAll('h1,h2,h3');
        var len = headerEl.length;
        var index = 0;
        //假设最小为3，比这个大的都要隐藏。
        //实际中一般是h1，也可能是h2，所以这个这个需要判断
        var minLevel = 3;
        var curr, nodeName, text, href, level, idStr = 'navigator-',
            data = [],
            hasChild = false;
        while (index < len) {
            curr = headerEl[index];
            text = curr.innerText || curr.textContent;
            //没有内容忽略
            if (!text || !text.trim()) {
                index++;
                continue;
            }
            level = getLevel(curr);
            minLevel = level < minLevel ? level : minLevel;
            hasChild = checkHasChild(curr, headerEl, index);
            href = idStr + index;
            curr.setAttribute('id', href);
            curr.setAttribute('name', href);
            data.push({
                text: text,
                level: level,
                href: href,
                hasChild: hasChild
            });
            index++;
        }
        data.forEach(function (val) {
            val.minLevel = minLevel;
        });
        return data;
    };

    var toggleItem = function (e) {
        var $el = angular.element(e.srcElement);
        var $currentLi = $el.parent();
        var isOpen = $el.hasClass('open');
        //没有子项
        if (!$el.hasClass('child')) {
            return;
        }

        $el[!isOpen ? 'addClass' : 'removeClass']('open');
        //显示或者隐藏子项目
        var hasNext = true;
        var nextLi, nextLevel, diffVal;
        //当前的层级
        var currLevel = $currentLi.attr('level') | 0;

        //展开的时候，值展开当前层级的下一级
        //收起的时候需要把 子层级全部都收起来
        while (hasNext) {
            nextLi = $currentLi.next();
            nextLevel = (nextLi.attr('level') | 0);
            diffVal = nextLevel - currLevel;
            //遇到和自己同级别的，或者大于自己级别的节点
            if (diffVal <= 0 || !$currentLi || nextLevel === 0) {
                break;
            }
            //当前是展开 现在应该收起
            if (isOpen) {
                //比当前level大的全部收起，直到遇到小于等于当前level的停止
                //子级被收起,有子级的状态被箭头状态重置
                if (nextLi.attr('has-child') && isOpen) {
                    nextLi.find('i').removeClass('open');
                }
                nextLi.addClass('hidden')
            } else {
                //当前是收起 现在应该展开
                //展开，只展开下一级别，再高级别不展开.可以写成else if 
                //这里这样写方便理解
                if (diffVal === 1) {
                    nextLi.removeClass('hidden')
                }
            }
            $currentLi = nextLi;
        }
    }
    return {
        buildDir: buildDir,
        toggleItem: toggleItem
    };
});
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

define('css!common/show-large-img/css',[],function(){});
/** 
 * 最后时间延长waitTime 再执行
 */
define('js/common/debounce',['require','exports','module'],function (require, exports, module) {
    return function (callback, waitTime) {
        var timeout, args, context, timestamp, result, currTime, later = function () {
            currTime = (+new Date) - timestamp;
            if (currTime < waitTime && currTime >= 0) {
                timeout = setTimeout(later, waitTime - currTime);
            } else {
                timeout = null;
                result = callback.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            }
        };
        return function () {
            context = this;
            args = arguments;
            timestamp = +new Date;
            if (!timeout) {
                timeout = setTimeout(later, waitTime)
            }
            return result;
        };
    };
});
define('common/show-large-img/index',['require','exports','module','css!./css.css','../../js/common/utils','../../js/common/debounce'],function (require, exports, module) {
    require('css!./css.css');
    var utils = require('../../js/common/utils');
    var debounce = require('../../js/common/debounce');
    var app = angular.module('ui.showLargeImg', []);
    app.controller('showImgCtrl', ['$scope', '$timeout', '$http', '$q', '$element', '$window',
        function ($scope, $timeout, $http, $q, $element, $window) {
            // console.log('controller', arguments)
        }
    ]);
    app.directive('uiShowLargeImg', ['$timeout', '$parse', '$document',
        function ($timeout, $parse, $document, $element) {
            return {
                restrict: 'A',
                controllerAs: '$showImgCtrl',
                controller: 'showImgCtrl',
                link: function (scope, element, attrs, ctrls) {
                    var $layer = document.createElement('div');
                    var $body = angular.element(document.body);
                    var moving = false;
                    var isRemoveIng = false;
                    var isShowIng = false;
                    var sourceImg;
                    $layer.setAttribute('layer-id', 'js-large-layer');
                    $layer.className = "i-img-layer";
                    $body.append($layer);

                    var getElPos = function (el) {
                        var offset = utils.getElOffset(el);
                        var scroll = utils.getScroll();
                        var left = offset.left;
                        var top = offset.top - scroll.top;

                        var nodeW = el.clientWidth;
                        var nodeH = el.clientHeight;
                        return {
                            width: nodeW + 'px',
                            height: nodeH + 'px',
                            left: left + 'px',
                            top: top + 'px'
                        }
                    }

                    var cloneImg = function (node) {
                        return angular.element(node).clone().css(angular.extend({
                            position: "fixed",
                            zIndex: 105
                        }, getElPos(node))).addClass('i-img-tran')[0];
                    };

                    var justifyImg = function (el) {
                        $el = angular.element(el);
                        if (!$el.attr("src")) {
                            return;
                        }
                        $el.addClass('i-tran');
                        $el.css("cursor", "move").attr("data-large-img", 1);
                        var dW = window.innerWidth;
                        var dH = window.innerHeight;
                        var img = new Image();
                        img.onload = function () {
                            var width, height;
                            if (this.width > this.height) {
                                width = this.width >= dW - 18 ? dW - 18 : this.width;
                                height = this.height / this.width * width;
                            } else {
                                height = this.height >= dH - 18 ? dH - 18 : this.height;
                                width = this.width / this.height * height;
                            }
                            $el.css({
                                width: width + 'px',
                                height: height + 'px',
                                left: (dW - width) / 2 + 'px',
                                top: (dH - height) / 2 + 'px'
                            });
                        };
                        img.src = $el.attr("src");
                    };

                    window.addEventListener('resize', debounce(function () {
                        justifyImg(document.querySelector('[data-large-img]'));
                    }, 100));

                    var removeLargeImg = function () {
                        $layer.classList.remove('i-show');
                        var el = document.querySelector("img[data-large-img]");
                        if (!el || isRemoveIng) {
                            return;
                        }
                        isRemoveIng = true;
                        el.classList.add('i-tran');
                        el.classList.add('remove');

                        angular.element(el).css(angular.extend({
                            position: "fixed",
                            zIndex: 105
                        }, getElPos(sourceImg)));
                        sourceImg = null;
                        setTimeout(function () {
                            isRemoveIng = false;
                            el && el.parentElement && el.parentElement.removeChild(el);
                        }, 500)
                    }

                    var offFn = function ($el) {
                        setTimeout(function () {
                            moving = false;
                        }, 300);
                        $el.prop("draggable", true);
                        $body.off("mousemove touchmove mouseup mouseleave  touchend touchcancel");
                        removeLargeImg();
                    }

                    $body.on("mousedown touchstart", function (evt) {
                        var $el = angular.element(evt.srcElement);
                        if ($el.attr('data-large-img') != 1) {
                            return;
                        }
                        $el.removeClass('i-tran');
                        evt.stopImmediatePropagation();
                        var oY = evt.pageY;
                        var oX = evt.pageX;
                        $el.prop("draggable", false);
                        $body.on("mousemove touchmove", function (evt) {
                            evt.stopImmediatePropagation();
                            moving = true;
                            var dY = evt.pageY - oY;
                            var dX = evt.pageX - oX;
                            oX = evt.pageX;
                            oY = evt.pageY;
                            $el.css({
                                top: parseInt($el[0].style.top, 10) + dY + 'px',
                                left: parseInt($el[0].style.left, 10) + dX + 'px',
                            });
                        });
                        $body.on("mouseup mouseleave touchend touchcancel", function (evt) {
                            evt.stopImmediatePropagation();
                            offFn($el);
                        });
                    });

                    ['click', 'keydown', 'touchstart'].forEach(function (name) {
                        document.addEventListener(name, function (evt) {
                            if (moving || isRemoveIng || isShowIng) {
                                return;
                            }
                            if (evt.type === "keydown" && evt.keyCode === 27) {
                                removeLargeImg()
                                return;
                            }
                            var $this = angular.element(evt.srcElement);
                            if ($this.attr('data-large-img') == 1 || $this.attr('layer-id') === 'js-large-layer') {
                                removeLargeImg()
                                return;
                            }
                        })
                    }, false);

                    element.on('click', function (e) {
                        var el = e.srcElement;
                        if (el.nodeName !== 'IMG') {
                            return;
                        }
                        e.preventDefault();
                        e.stopPropagation()
                        sourceImg = el;
                        $layer.classList.add('i-show');
                        isShowIng = true;
                        var cloneEL = cloneImg(el);
                        $body.append(cloneEL)
                        justifyImg(cloneEL);
                        setTimeout(function () {
                            isShowIng = false;
                        }, 800)
                    });
                }
            };
        }
    ]);
});
'use strict';
/**
 * author           xj
 * @date            2016-10-31 14:50:16
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/addTableClass',['require','exports','module'],function (require, exports, module) {
    return function (selector) {
        Array.prototype.slice.call(document.querySelector(selector || '#js-spec-content').querySelectorAll('table'))
            .forEach(function (el) {
                angular.element(el).addClass('table table-bordered');
            });
    }
});
'use strict';
/**
 * author           xj
 * @date            2016-11-17 11:08:08
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/addTitleClass',['require','exports','module'],function (require, exports, module) {
    return function (selector) {
        Array.prototype.slice.call(document.querySelector(selector || '#js-spec-content').querySelectorAll('h1'))
            .forEach(function (el) {
                angular.element(el).addClass('p-title');
            });
    }
});
'use strict';
/**
 * author           xj
 * @date            2016-09-05 10:54:42
 * @email           littlebearbond@qq.com
 * @description
 */

define('js/common/product-spec-detail/common',['require','exports','module','../addTableClass','../addTitleClass'],function (require, exports, module) {
    var addTableClass = require('../addTableClass');
    var addTitleClass = require('../addTitleClass');
    var keyMap = {
        'spec-detail': 'standard-view',
        'product-detail': 'product-view'
    };

    return function (app) {
        app.factory('myFactory', function () {
            //这里可以做成一个factory 或者service
            return {
                getData: function getData($scope, $http, $timeout, urlData, cb) {

                    if (!urlData.id) {
                        //"http://127.0.0.1:3000/project/portals/pages/product-detail.html?id=1"
                        var href = location.href;
                        var pageName = href.replace(/\.html(.*)?/, '').split('/').pop();
                        var key = keyMap[pageName];
                        var data = localStorage.getItem(key);

                        var redirectToList = function redirectToList() {
                            //发生错误直接调回列表页面
                            location.href = '/project/portals/pages/' + pageName.replace('-detail', '') + '.html';
                        };

                        if (!key || !data) {
                            redirectToList();
                            return;
                        }

                        try {
                            data = JSON.parse(data);
                        } catch (error) {
                            redirectToList();
                            return;
                        }

                        //后台数据需要二次json.parse
                        ["personInCharge", "logoList", "fileList", "tagList"].forEach(function (keyName) {
                            try {
                                if (data[keyName]) {
                                    data[keyName] = JSON.parse(data[keyName]);
                                }
                            } catch (error) {
                                console.info(error);
                            }
                        });

                        $scope.datas = data;
                        cb && cb();
                        $timeout(function () {
                            addTableClass();
                            addTitleClass();
                        });
                        localStorage.removeItem(key);
                        return;
                    }

                    $http.get("/getDocByID/?id=" + urlData.id).success(function (response) {
                        $scope.datas = response.data;
                        cb && cb();
                        $timeout(function () {
                            addTableClass();
                            addTitleClass();
                        });
                    });
                },
                initHashPos: function initHashPos($location, $anchorScroll) {
                    if (!!~location.hash.indexOf('#')) {
                        var hashStr = location.hash;
                        location.hash = "";
                        $location.hash(hashStr.replace(/#\/?/, ''));
                        $anchorScroll();
                    }
                }
            };
        });
    };
});
//# sourceMappingURL=common.js.map
;
'use strict';
/**
 * author           xj
 * @date            2016-09-06 10:08:20
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/filter/filter',['require','exports','module','../utils'],function (require, exports, module) {
    var utils = require('../utils');
    var getLink = function (data) {
        if (data.email && data.name) {
            return '<a href="http://home.didichuxing.com/person.html#/' + (data.email && data.email.split('@')[0]) + '/1" target="_blank">' + data.name + '</a>';
        }
        return ''
        // return '<a href="http://home.didichuxing.com/person.html#/' + data.email.split('@') && data.email.split('@')[0] + '/1" target="_blank">' + data.name + '</a>';
        
    };
    var STATE = ["未处理", "已处理", "误报库", "问题库", "已发单"]
    var RISK_LEVEL = ['S0(严重)', 'S1(高危)', 'S2(中危)', 'S3(低危)', '忽略']
    return function (app) {
        app.filter('to_trusted', ['$sce', function ($sce) {
            return function (text) {
                if (text) {
                    return $sce.trustAsHtml(utils.removeScriptTags(text));
                }
                return ''
            };
        }]).filter('getName', function () {
            return function (data) {
                return data && data.map(function (val) {
                    // return `<a href="http://home.didichuxing.com/person.html#/${val.email && val.email.split('@')[0]}/1" target="_blank>"${val.name}</a>`
                    return '<a href="http://home.didichuxing.com/person.html#/' + (val.email && val.email.split('@')[0]) + '/1" target="_blank">' + val.name + '</a>';
                }).join(',') || "无";
            }
        }).filter('getEmail', function () {
            return function (data) {
                return data && data.map(function (val) {
                    return val.email ;
                }).join(",");
            }
        }).filter('getEmailLink', function () {
            return function (data) {
                if (data) {
                    return getLink(data);
                }
            }
        }).filter('getArrEmailLink', function () {
            return function (data) {
                if (Array.isArray(data) && data.length) {
                    return data.map(function (val) {
                        return getLink(val);
                    }).join(',');
                }
            }
        }).filter('getStateText', function () {
            return function (state) {
                return STATE[state] || ""
            }
        }).filter('getRiskLevel', function () {
            return function (state) {
                return RISK_LEVEL[state] || ""
            }
        });
    } //
});

define('css!common/directive/loading/css/loading',[],function(){});
'use strict';
/**
 * author           xj
 * @date            2016-09-07 11:08:14
 * @email           littlebearbond@qq.com
 * @description
 */
define('common/directive/loading/loading',['require','exports','module','css!./css/loading'],function (require, exports, module) {
    require('css!./css/loading');
    return function (app) {
        app.directive('loading', ['$http', '$rootScope', function ($http, $rootScope) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    loadingtext: '@?',
                    isloading: '=',
                    opacity: '@?'
                },
                template: ['<div class="p-loading-wrap">',
                    '   <div class="mask" ng-style="{opacity:opacity}"></div>',
                    '   <div class="loading-content">',
                    '       <span class="loading"></span>',
                    '       <span ng-cloak>{{loadingtext}}<dot></dot></span>',
                    '   </div>',
                    '</div>'
                ].join(''),
                link: function (scope, element, attr) {
                    scope.loadingtext = attr.loadingtext || '数据加载中';
                    scope.opacity = attr.opacity || 1;

                    scope.isShowLoading = function () {
                        if (scope.isloading === true) {
                            return true
                        }
                        return $http.pendingRequests.length > 0 && $rootScope.showLoading !== false;
                    };

                    scope.$watch(scope.isShowLoading, function (v) {
                        element.css({
                            display: !v ? 'none' : 'block'
                        });
                    });
                }
            }
        }])
    }
});
'use strict';
/**
 * author           xj
 * @date            2016-08-30 15:11:46
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/spec-detail/index',['require','exports','module','../common/utils','./build-dir','../common/app','./../common/add-water-mark','../../common/show-large-img/index','../common/product-spec-detail/common','../common/filter/filter','../../common/directive/loading/loading'],function (require, exports, module) {
    var utils = require('../common/utils');
    var buildDir = require('./build-dir');
    var app = require('../common/app');
    app.requires.push('ui.showLargeImg');
    var addWaterMark = require('./../common/add-water-mark')
    require('../../common/show-large-img/index');
    require('../common/product-spec-detail/common')(app);
    require('../common/filter/filter')(app);
    require('../../common/directive/loading/loading')(app);

    app.controller('spec-detail', ['$rootScope', '$scope', '$http', '$timeout', 'myFactory', '$location', '$anchorScroll',
        function ($rootScope, $scope, $http, $timeout, myFactory, $location, $anchorScroll) {
            addWaterMark($rootScope)
            $scope.datas = {
                fileLists: []
            };
            $scope.dirData = [];

            $scope.toggleItem = buildDir.toggleItem;

            $scope.goToView = function ($event, id) {
                location.hash = id;
            };
            var urlData = utils.getUrlData();

            myFactory.getData($scope, $http, $timeout, urlData, function () {
                $timeout(function () {
                    $scope.dirData = buildDir.buildDir();
                    myFactory.initHashPos($location, $anchorScroll);
                });
            });
        }
    ]);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['myApp']);
    });
});

(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('@charset \"UTF-8\";.header:before,.header-right:before,.header:after,.header-right:after{content:\"\";display:table;}.header:after,.header-right:after{clear:both;}dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:\'...\\A..\\A.\';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.header{min-width:1100px;width:100%;height:70px;border-bottom:solid 1px #d4d6db;color:#262626;box-shadow:0 1px 2px 1px #f1f1f1;}.logo{margin-left:35px;line-height:70px;display:inline-block;background:url(/project/portals/i/logo.png?v=953c28) 0 center no-repeat;background-size:35px auto;font-size:22px;padding-left:41px;color:#262626;vertical-align:middle;cursor:pointer;text-decoration:none;}.logo:hover{text-decoration:none;color:#262626;}.header-list > li .p-dropdown,.header-right .msg .p-dropdown,.header-right .user .p-dropdown{display:block;position:absolute;width:160px;top:62px;left:50%;transition:transform 0.25s cubic-bezier(0.18,0.89,0.32,1.28);transform-origin:center top;transform:translate(-50%) scaleY(0);}.header-list > li:hover .p-dropdown,.header-right .msg:hover .p-dropdown,.header-right .wrap-user-img:hover .p-dropdown{transform:translate(-50%) scaleY(1);}.header-list{font-size:16px;display:inline-block;vertical-align:middle;margin-left:75px;list-style:none outside none;margin-bottom:0;}.header-list > li{padding:0 10px;margin-right:30px;float:left;line-height:70px;position:relative;cursor:pointer;}.header-list > li:last-child{margin-right:0;}.header-list > li:hover > a,.header-list > li.hover > a{color:#528be6;text-decoration:none;}.header-list > li:hover > i,.header-list > li.hover > i{left:0;right:0;}.header-list > li > a{transition:color .3s ease-out;color:#262626;display:block;text-align:center;line-height:70px;text-decoration:none;}.header-list > li > i{position:absolute;bottom:10px;left:50%;right:50%;height:4px;font-size:0;background-color:#528be6;transition-property:left,right;transition-duration:.3s;transition-timing-function:ease-out;}.header-right{line-height:70px;height:70px;font-size:0;margin-right:16px;float:right;}.header-right .msg{position:relative;color:#262626;line-height:70px;font-size:14px;float:left;cursor:pointer;}.header-right .msg a{text-decoration:none;color:#262626;}.header-right .msg b{font-weight:normal;color:#fa9027;margin-left:6px;}.header-right .wrap-user-img{float:left;}.header-right .wrap-user-img:hover .user:before{transform:rotate(-45deg);top:60%;}.header-right .wrap-img{float:left;height:70px;margin-left:46px;padding-top:15px;cursor:pointer;}.header-right .wrap-img img{vertical-align:top;border-radius:50%;width:40px;height:40px;}.header-right .user{padding-left:11px;margin-right:58px;cursor:pointer;position:relative;height:70px;float:left;}.header-right .user:before{content:\'\';display:block;width:8px;height:8px;border:solid #d8d8d8;border-width:2px 2px 0 0;position:absolute;top:50%;z-index:1;transform:rotate(135deg);}.header-right .user:before{right:-20px;margin-top:-5px;transition:all .3s linear;}.header-right .user .name{display:inline-block;vertical-align:middle;color:#343434;font-size:14px;}.p-dropdown{padding:6px 0;border-radius:8px;background-color:#ffffff;box-shadow:0 0 2px 2px #f1f1f1;position:relative;list-style:none outside none;z-index:1000;}.p-dropdown:before{content:\'\';position:absolute;top:-2px;left:50%;z-index:10;width:10px;height:10px;background-color:#fff;border:solid #f0f0f0;border-width:1px 0 0 1px;box-shadow:-1px -1px 2px #f1f1f1;transform:rotate(45deg) translate(-50%);}.p-dropdown > .list-item,.p-dropdown > li{color:#262626;font-size:14px;line-height:35px;padding:0 16px;}.p-dropdown > .list-item:hover,.p-dropdown > li:hover{background-color:#f5f5f5;}.p-dropdown > .list-item:last-child,.p-dropdown > li:last-child{border-radius:0 0 4px 4px;}.p-dropdown > .list-item:first-child,.p-dropdown > li:first-child{border-radius:4px 4px 0 0;}.p-dropdown > .list-item a,.p-dropdown > li a{color:#262626;}.p-dropdown > .list-item a:hover,.p-dropdown > li a:hover{color:#528be6;text-decoration:none;}.p-dropdown > .list-item > b,.p-dropdown > li > b{font-weight:normal;color:#fa8919;padding-right:8px;}@media (max-width:1000px){.header-list{margin-left:0;}.header-list > li{margin-right:15px;}}@media (max-width:1200px){.header-list{margin-left:0;}.header-list > li{margin-right:18px;}}.i-img-layer{position:fixed;left:0;right:0;top:0;bottom:0;height:0;width:0;z-index:101;background:#000;opacity:0;transition:opacity .3s ease-in-out;}.i-img-layer.i-show{opacity:.6;height:100%;width:100%;}.i-img-tran.i-tran{transition:all .5s ease-in-out;}.i-img-tran.remove{opacity:.8;}@charset \"UTF-8\";dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:\'...\\A..\\A.\';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.p-loading-wrap{}@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}.p-loading-wrap .mask{height:100%;width:100%;background-color:#fff;position:absolute;left:0;top:0;z-index:1000;}.p-loading-wrap .loading-content{z-index:1001;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;width:100%;height:32px;line-height:32px;text-align:center;vertical-align:middle;}.p-loading-wrap .loading{position:relative;display:inline-block;width:32px;height:32px;vertical-align:middle;}.p-loading-wrap .loading:after{margin:12px 12px 0;display:block;content:\'\';width:3px;height:3px;border-radius:100%;box-shadow:0 -10px 0 1px #ccc,10px 0px #ccc,0 10px #ccc,-10px 0 #ccc,-7px -7px 0 0.5px #ccc,7px -7px 0 1.5px #ccc,7px 7px #ccc,-7px 7px #ccc;animation:spin 1s steps(8) infinite;}');
