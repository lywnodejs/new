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

'use strict';
/**
 * author           xj
 * @date            2016-08-29 13:51:33
 * @email           littlebearbond@qq.com
 * @description
 */
if (!Function.prototype.hasOwnProperty('bind')) {
	Function.prototype.bind = function(context) {
		var target = this;
		if (typeof target != "function") {
			throw new TypeError();
		}
		var sl = [].slice,
			args = sl.call(arguments, 1);
		return function() {
			return fn.apply(context || this, args.concat(sl.call(arguments)));
		};
	};
}

((function(root, factory) {
	"use strict";
	if (typeof define === "function") {
		define('common/carousel/autoplay',factory);
	} else {
		root.Carousel = factory();
	}
})(window, function() {
	var $ = function(selector, parent) {
		return typeof selector === 'string' ? (parent || document).querySelector(selector) : selector;
	};

	//获取tagName
	var getByTagName = function(tagName, oParent) {
		return (oParent || document).getElementsByTagName(tagName)
	};

	var each = function(obj, callback, context) {
		if (obj == null) {
			return;
		}
		var nativeForEach = Array.prototype.forEach;
		if (nativeForEach && obj.forEach === nativeForEach) {
			obj.forEach(callback, context);
		} else if (obj.length === +obj.length) {
			for (var i = 0, l = obj.length; i < l; i++) {
				if (callback.call(context, obj[i], i, obj) === false) {
					break;
				}
			}
		}
	};
	var prefix;
	(function() {
		var vendors = {
				Webkit: 'webkit',
				Moz: '',
				O: 'o'
			},
			testEl = document.createElement('div');
		for (var key in vendors) {
			if (testEl.style[key + 'TransitionProperty'] !== undefined) {
				prefix = '-' + key.toLowerCase() + '-';
				testEl = vendors = null;
				return false
			}
		}
	}());
	var fxTransitionEnd = (function() {
		var el = document.createElement('div'),
			transEndEventNames = {
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'oTransitionEnd otransitionend',
				'transition': 'transitionend'
			};
		for (var name in transEndEventNames) {
			if (el.style[name] !== undefined) {
				el = null;
				return transEndEventNames[name];
			}
		}
	}());
	var Carousel = function(selector, opts) {
		this.defOpts = {
			time: 4000,
			sepTime: 1000,
			width: 0,
			autoPlay: false,
			onresize: function() {}
		};

		opts = opts || {};
		for (var p in opts) {
			this.defOpts[p] = opts[p];
		}
		this.el = $(selector);
		this.ul = getByTagName('ul', this.el)[0];
		this.lis = Array.prototype.slice.call(getByTagName('li', this.ul));
		//克隆第一个插入到最后面
		this.lis.push(this.lis[0].cloneNode(true));
		this.ul.appendChild(this.lis[this.lis.length - 1]);

		this.ul.style.width = '80000px';

		//记录播放
		this.autoTimmer =
			//resize延时
			this.autoTimeOut = null;
		this.curr = 0;

		this.init();
	};

	Carousel.version = '1.0.0';

	Carousel.prototype = {
		constructor: Carousel,
		init: function() {
			var that = this;
			this.setElWidth();
			this.initELTransform();
			this.createPoint();
			this.aBtn = getByTagName("li", this.conutEl);
			this.el.addEventListener('mouseover', function() {
				clearInterval(that.autoTimmer);
			});

			this.el.addEventListener('mouseout', this.start.bind(this));

			each(this.aBtn, function(obj, index) {
				obj.index = index;
				obj.addEventListener('mouseover', function() {
					that.curr = obj.index;
					that.toggle(obj.index).doMove();
				});
			});
			this.initWindowEvent();
			this.toggle(0);
			this.defOpts.autoPlay && this.start();
		},
		getWinWidth: function() {
			var w = window,
				d = document,
				e = d.documentElement,
				g = d.getElementsByTagName('body')[0];
			return w.innerWidth || e.clientWidth || g.clientWidth;
		},
		initWindowEvent: function() {
			var that = this;
			window.addEventListener('resize', function() {
				clearTimeout(that.autoTimeOut);
				clearInterval(that.autoTimmer);
				that.autoTimeOut = setTimeout(that.start.bind(that), 50)
			});
			window.addEventListener('blur', this.stop.bind(this));
			window.addEventListener('focus', this.start.bind(this));
		},
		start: function() {
			this.defOpts.onresize.call(this);
			this.setElWidth();
			this.oneMoveLen = this.lis[0].offsetWidth;
			clearInterval(this.autoTimmer);
			this.autoTimmer = setInterval(this.next.bind(this), this.defOpts.time);
		},
		stop: function() {
			if (!this.autoTimmer) {
				return;
			}
			clearInterval(this.autoTimmer);
			this.autoTimmer = null;
		},
		setElWidth: function() {
			var width = this.getWinWidth();
			each(this.lis, function(obj) {
				obj.style.width = width + 'px';
			});
		},
		initELTransform: function(flag) {
			this.setCss3(this.ul, {
				'transform': 'translate3d(0,0,0)',
				'transition': 'none'
			});
		},
		setCss3: function(obj, s, v) {
			if (typeof s === 'string') {
				obj.style[prefix + s] = v;
				return;
			}

			for (var p in s) {
				if (!s.hasOwnProperty(p)) {
					continue;
				}
				obj.style[prefix + p] = obj.style[p] = s[p];
			}
		},
		createPoint: function() {
			this.conutEl = document.createElement('ul');
			this.conutEl.className = "slider-box-conut";
			var oFrag = document.createDocumentFragment(), //文档碎片
				oli, liHtmls,
				len = this.lis.length - 1,
				index = 0;

			while (index < len) {
				oli = document.createElement('li');
				oFrag.appendChild(oli);
				index++;
			}

			this.conutEl.appendChild(oFrag);
			this.el.appendChild(this.conutEl);
		},
		toggle: function(index) {
			each(this.aBtn, function(el, i) {
				el.className = '';
			});
			this.aBtn[index].className = "current";
			return this;
		},
		next: function() {
			this.curr++;
			var that = this;
			var resetPost = function() {
				that.initELTransform();
				that.ul.removeEventListener(fxTransitionEnd, resetPost);
			};
			if (this.curr < this.lis.length - 1) {
				this.toggle(this.curr).doMove();
				return this;
			}
			//到达最后一个
			if (this.curr === this.lis.length - 1) {
				//滚动到最后一个并且重置位置
				this.toggle(0);
				this.ul.addEventListener(fxTransitionEnd, resetPost, false);
				this.doMove();
				this.curr = 0;
				return this;
			}
		},
		/*pre: function() {
			this.curr--;
			this.curr < 0 && (this.curr = this.aBtn.length - 1);
			this.toggle();
			this.doMove();
			return this;
		},*/
		doMove: function() {
			var dis = -(this.curr * this.oneMoveLen);
			var that = this;
			requestAnimationFrame(function() {
				that.setCss3(that.ul, {
					'transform': 'translate3d(' + dis + 'px,0,0)',
					'transition': 'all ' + that.defOpts.sepTime + 'ms ease-in-out'
				});
			});
			/*var style = this.ul.style;
			style.webkitTransform = 'translate3d(' + dis + 'px,0,0)';
			style.msTransform = style.MozTransform = style.OTransform = 'translateX(' + dis + 'px)';*/
		}
	};

	return Carousel;
}));

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
'use strict';
/**
 * author           xj
 * @date            2016-08-29 11:19:19
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/index/index',['require','exports','module','../common/app','../../common/carousel/autoplay','./../common/add-water-mark'],function(require, exports, module) {
    var app = require('../common/app');
    var Carousel = require('../../common/carousel/autoplay');
    var addWaterMark = require('./../common/add-water-mark')

    app.controller('index', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
        addWaterMark($rootScope)
        $timeout(function() {
            var container = document.getElementById('js-slide-box');
            var autoplay = new Carousel(container, {
                onresize: function() {
                    //0.34285714   宽高比例. 后期需求调整 参数编程0.3
                    // container.style.height = this.getWinWidth() * 0.3 + 'px';
                },
                autoPlay: true
            });
        })
    }]);

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['myApp']);
    });
});


(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('@charset \"UTF-8\";.header:before,.header-right:before,.header:after,.header-right:after{content:\"\";display:table;}.header:after,.header-right:after{clear:both;}dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:\'...\\A..\\A.\';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.header{min-width:1100px;width:100%;height:70px;border-bottom:solid 1px #d4d6db;color:#262626;box-shadow:0 1px 2px 1px #f1f1f1;}.logo{margin-left:35px;line-height:70px;display:inline-block;background:url(/project/portals/i/logo.png?v=953c28) 0 center no-repeat;background-size:35px auto;font-size:22px;padding-left:41px;color:#262626;vertical-align:middle;cursor:pointer;text-decoration:none;}.logo:hover{text-decoration:none;color:#262626;}.header-list > li .p-dropdown,.header-right .msg .p-dropdown,.header-right .user .p-dropdown{display:block;position:absolute;width:160px;top:62px;left:50%;transition:transform 0.25s cubic-bezier(0.18,0.89,0.32,1.28);transform-origin:center top;transform:translate(-50%) scaleY(0);}.header-list > li:hover .p-dropdown,.header-right .msg:hover .p-dropdown,.header-right .wrap-user-img:hover .p-dropdown{transform:translate(-50%) scaleY(1);}.header-list{font-size:16px;display:inline-block;vertical-align:middle;margin-left:75px;list-style:none outside none;margin-bottom:0;}.header-list > li{padding:0 10px;margin-right:30px;float:left;line-height:70px;position:relative;cursor:pointer;}.header-list > li:last-child{margin-right:0;}.header-list > li:hover > a,.header-list > li.hover > a{color:#528be6;text-decoration:none;}.header-list > li:hover > i,.header-list > li.hover > i{left:0;right:0;}.header-list > li > a{transition:color .3s ease-out;color:#262626;display:block;text-align:center;line-height:70px;text-decoration:none;}.header-list > li > i{position:absolute;bottom:10px;left:50%;right:50%;height:4px;font-size:0;background-color:#528be6;transition-property:left,right;transition-duration:.3s;transition-timing-function:ease-out;}.header-right{line-height:70px;height:70px;font-size:0;margin-right:16px;float:right;}.header-right .msg{position:relative;color:#262626;line-height:70px;font-size:14px;float:left;cursor:pointer;}.header-right .msg a{text-decoration:none;color:#262626;}.header-right .msg b{font-weight:normal;color:#fa9027;margin-left:6px;}.header-right .wrap-user-img{float:left;}.header-right .wrap-user-img:hover .user:before{transform:rotate(-45deg);top:60%;}.header-right .wrap-img{float:left;height:70px;margin-left:46px;padding-top:15px;cursor:pointer;}.header-right .wrap-img img{vertical-align:top;border-radius:50%;width:40px;height:40px;}.header-right .user{padding-left:11px;margin-right:58px;cursor:pointer;position:relative;height:70px;float:left;}.header-right .user:before{content:\'\';display:block;width:8px;height:8px;border:solid #d8d8d8;border-width:2px 2px 0 0;position:absolute;top:50%;z-index:1;transform:rotate(135deg);}.header-right .user:before{right:-20px;margin-top:-5px;transition:all .3s linear;}.header-right .user .name{display:inline-block;vertical-align:middle;color:#343434;font-size:14px;}.p-dropdown{padding:6px 0;border-radius:8px;background-color:#ffffff;box-shadow:0 0 2px 2px #f1f1f1;position:relative;list-style:none outside none;z-index:1000;}.p-dropdown:before{content:\'\';position:absolute;top:-2px;left:50%;z-index:10;width:10px;height:10px;background-color:#fff;border:solid #f0f0f0;border-width:1px 0 0 1px;box-shadow:-1px -1px 2px #f1f1f1;transform:rotate(45deg) translate(-50%);}.p-dropdown > .list-item,.p-dropdown > li{color:#262626;font-size:14px;line-height:35px;padding:0 16px;}.p-dropdown > .list-item:hover,.p-dropdown > li:hover{background-color:#f5f5f5;}.p-dropdown > .list-item:last-child,.p-dropdown > li:last-child{border-radius:0 0 4px 4px;}.p-dropdown > .list-item:first-child,.p-dropdown > li:first-child{border-radius:4px 4px 0 0;}.p-dropdown > .list-item a,.p-dropdown > li a{color:#262626;}.p-dropdown > .list-item a:hover,.p-dropdown > li a:hover{color:#528be6;text-decoration:none;}.p-dropdown > .list-item > b,.p-dropdown > li > b{font-weight:normal;color:#fa8919;padding-right:8px;}@media (max-width:1000px){.header-list{margin-left:0;}.header-list > li{margin-right:15px;}}@media (max-width:1200px){.header-list{margin-left:0;}.header-list > li{margin-right:18px;}}');
