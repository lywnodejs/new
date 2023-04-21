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

/**
 *  定义常量
 */
define('js/busiSec/EnumConstants',['require','exports','module'],function(require, exports, module) {
    //  exports.moduleName = '于个'
    module.exports = {
        levelOpts: ['正常', '高危', '异常'],
        statusOpts: {1162:'未打击',
                    1164: '已打击'},
        osOpts:['其它', 'Android', 'iOS']
    }
    /**
    //  exports.moduleName = '于个'
    return {
        levelOpts: ['正常', '高位', '异常'],
        statusOpts: ['未确认', '未处理', '已处理']
    }
    **/
})
;
/**
 * 枚举过滤器
 */
define('js/busiSec/EnumFilter',['./EnumConstants'], function(enums) {
    return function(appMod) {
        
        
        appMod.filter('enumFilter', ['$http', function($http) {
            
            /**
             * @param input 输入的值
             * @param key 枚举的主键
             */
            return function(input, key) {
                var values = enums[key] || {};
                return values[input];
            }
        }]); 
    };
});
define('js/common/slideUpDown',['require','exports','module'],function (require, exports, module) {
    return function funTransitionHeight(element, time, newHeight) { // time, 数值，可缺省
        if (typeof window.getComputedStyle === "undefined") {
            return;
        }
        if (+newHeight === newHeight) {
            newHeight = newHeight + 'px'
        }
        var height = window.getComputedStyle(element).height;
        element.style.height = "auto";
        var styleObj = window.getComputedStyle(element)
        //再次获取高度
        var targetHeight = typeof newHeight !== 'undefined' ? newHeight : styleObj.height;
        if (targetHeight !== '0px') {
            targetHeight = parseInt(targetHeight, 10) + parseInt(element.dataset.paddingTop || 0, 10) + parseInt(element.dataset.paddingBottom || 0, 10) + 'px';
        }
        element.style.height = height;
        /*if (newHeight === 0) {
            var timmer, done = function () {
                element.removeEventListener("transitionend", done);
                clearTimeout(timmer);
                // element.style.display = "none";
            }
            element.addEventListener("transitionend", done, false);
            timmer = setTimeout(done, time);
        } */
        setTimeout(function () {
            if (time) {
                element.style.transition = "height " + time + "ms ease-in-out,padding-top " + time + "ms ease-in-out,padding-bottom " + time + "ms ease-in-out";
            }
            element.style.height = targetHeight;
            if (!element.dataset) {
                element.dataset = {};
            }
            if (targetHeight === '0px') {
                //cache old padding
                element.dataset.paddingTop = styleObj.paddingTop;
                element.dataset.paddingBottom = styleObj.paddingBottom;
                element.dataset.overflow = styleObj.overflow;
                element.style.paddingTop = 0;
                element.style.paddingBottom = 0;
                element.style.overflow = 'hidden';
            } else {
                element.style.paddingTop = element.dataset.paddingTop;
                element.style.paddingBottom = element.dataset.paddingBottom;
                element.style.overflow = 'hidden';
                setTimeout(function () {
                    element.style.overflow = element.dataset.overflow;
                }, time)
            }
        }, 15);
    };
});
define('js/common/form/slideForm',['require','exports','module','../slideUpDown'],function (require, exports, module) {
    var slideUpDown = require('../slideUpDown');
    return function ($scope, name) {
        $scope.formIsOpen = true;
        name = name || 'slideForm';
        return $scope[name] = function ($event) {
            var hasClass = !!~$event.currentTarget.className.indexOf('open');
            $scope.formIsOpen = !$scope.formIsOpen;
            slideUpDown(document.querySelector('.p-form'), 350, !hasClass ? 0 : undefined)
        }
    }
});
define('js/busiSec/RuleFilter',['require'], function(require) {
    return function(ctrl, $http) {
        var ruleUrl = '/bsSec/rules',
            rules;
        
        $http({
            method : "GET",
            url : ruleUrl
        }).success(function (res) {
            rules = res;
            ctrl.ruleFormat = function(ids) {
                if(ids) {
                    var idArray = ids.split(','),
                        result = [],
                        i = 0,
                        len = rules.length;
                    for(; i < len; i++) {
                        var rule_id = idArray[i];
                        //  
                        for(var j = 0; j < rules.length; j ++) {
                            if(rules[j].rule_id == rule_id) {
                                result.push(rules[j].rule_name);
                                break;
                            }                            
                        }                        
                    }
                    if(ids.length > 0) {
                        return result.join(',')
                    }                    
                }
                return ids
            }
            //
            ctrl.ruleTable = function(ids) {
                if(ids) {
                   var idArray = ids.split(','),
                        result = [],
                        i = 0,
                        len = rules.length;
                    for(; i < len; i++) {
                        var rule_id = idArray[i];
                        //  
                        for(var j = 0; j < rules.length; j ++) {
                            if(rules[j].rule_id == rule_id) {
                                result.push(rules[j]);
                                break;
                            }                            
                        }                        
                    }
                    return result      
                }                  
            }
            /**
            appMod.filter('ruleFilter', function() {
                return function(input) {
                    var ids = input.split(',');
                    return ids.length
                }
            });
            **/
        });
       
        
    }
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
define('js/busiSec/CheatingListCtrl',['require', '../common/form/slideForm', './EnumConstants', './RuleFilter', './../common/add-water-mark'], function (require, slideForm, enums, ruleFilter, addWaterMark) {
    return function (appMod) {
            appMod.controller('CheatingListCtrl', 
                              ['$rootScope', '$scope', '$http', '$uibModal',
                function ($rootScope, $scope, $http, $uibModal) {
                    addWaterMark($rootScope)
                    var ctrl = this,
                        listUrl = '/bsSec/list',
                        initDomain = function () {
                            var endTime = new Date(),    
                                st = endTime.valueOf() - 1000 * 60 * 60 * 24;
                            return {
                                startTime: new Date(st),
                                endTime,
                                id: '',
                                
                                level: '',
                                status: '',
                                user_id_multi: '',
                                order_id : '',
                                app_name : '',
                                rule : '',
                                app_version : '',
                                os : ''
                            }
                        };
                    //  激活查询菜单收缩功能
                    slideForm($scope);
                    //  激活规则过滤器
                    ruleFilter($scope, $http);
                    //  初始化词典
                    angular.extend(this, {
                        levelOpts: enums.levelOpts,
                        statusOpts: enums.statusOpts,
                        osOpts : enums.osOpts,
                        closeText: '关闭',
                        currentText: '今天',
                        clearText: '清除',
                        format: 'yyyy-MM-dd',
                        dateOptions: {
                            formatYear: 'yyyy',
                            maxDate: new Date(),
                            minDate: new Date(2012, 5, 22),
                            startingDay: 1
                        }
                    });
                    
                    //  初始化$scope
                    angular.extend($scope, {
                            currPage : 1,
                            itemsOfPage : 10,
                            totalItems : 0,
                            datas : [],
                            pages : 1,
                            searching : false,
                            idSearch : false,
                            updatePages () {
                                this.pages = Math.ceil(this.totalItems / this.itemsOfPage);    
                            },                 
                            //  时间控制
                            startTimeOpened: false,
                            endTimeOpened: false,
                            //  注册日期点击事件
                            startTimeOpen() {
                                this.startTimeOpened = true
                            },
                        
                            //  注册日期点击事件
                            endTimeOpen() {
                                this.endTimeOpened = true
                            },

                            //  初始化业务对象
                            init() {
                                angular.extend(ctrl, initDomain())
                                this.search();
                            },
                        
                            getParams () {
                                var params = initDomain();
                                for(var prop in params) {
                                    params[prop] = ctrl[prop];
                                }
                                if(params.startTime) {
                                    params.startTime.setHours(0)
                                    params.startTime.setMinutes(0)
                                    params.startTime.setSeconds(0)
                                    params.startTime.setMilliseconds(0)
                                    params.startTime = params.startTime.valueOf();
                                }
                                if(params.endTime) {
                                    params.endTime = params.endTime.valueOf();
                                }
                                
                                //  提取分页信息
                                params.page = this.currPage;
                                params.size = this.itemsOfPage;
                                return params;
                            },

                            //  查询对象
                            search() {
                                var _this = this,
                                    params = this.getParams();
                                $scope.searching = true
                                $http({
                                    method : "GET",
                                    url : listUrl,
                                    params: params
                                }).success(function (res) {
                                    _this.totalItems = res.total;
                                    _this.datas = res.data;
                                    _this.updatePages();
                                    //  后台数据记录条数减少
                                    if(_this.currPage > _this.pages && _this.currPage > 0) {
                                        _this.currPage = _this.pages;
                                    }
                                    //  控制显示
                                    $scope.searching = false
                                });
                            },
                        
                            findById (id) {
                                if(this.datas && this.datas.length > 0) {
                                    for(var i = 0; i < this.datas.length; i ++) {
                                        if(this.datas[i].id == id) {
                                            return this.datas[i]
                                        }
                                    }
                                }                                
                            }
                    });
                    // 初始化业务对象
                    $scope.init()
                    var listScope = $scope;
                    
                    //
                    $scope.detail = function(id) {
                        
                        $uibModal.open({
                          animation: true,
                          ariaLabelledBy: 'modal-title-top',
                          ariaDescribedBy: 'modal-body-top',
                          templateUrl: 'detailModal.html',
                          size: 'lg',
                          backdrop : false,
                          controller: ['$scope', '$uibModalInstance', '$http', function($scope, $uibModalInstance, $http) {
                            //  激活规则过滤器
                            ruleFilter($scope, $http);
                            var domain = listScope.findById(id);
                            //  如果没有在缓存中找到
                            if(domain) {
                                angular.extend($scope, domain)
                            } else {
                                var detailUrl = '/bsSec/detail/' + id;
                                $scope.idSearch = true;
                                $http({
                                    method : "GET",
                                    url : detailUrl
                                }).success(function (res) {
                                    angular.extend($scope, res)
                                    $scope.idSearch = false;
                                });
                            }
                            
                              
                            $scope.close = function() {
                               $uibModalInstance.close();
                            }
                          }]
                        });
                    }
                    
            }
        ]);
    }
});
define('js/busiSec/CheatingDetailCtrl',['require', './RuleFilter', './../common/add-water-mark'], function (require, ruleFilter, addWaterMark) {
    
    return function (appMod) {
    appMod.controller('CheatingDetailCtrl', ['$rootScope', '$scope', '$http', '$routeParams',   function($rootScope, $scope, $http, routeParams) {
        addWaterMark($rootScope)        
        var detailUrl = '/bsSec/detail/' + routeParams.id;
                //  激活规则过滤器
                ruleFilter($scope, $http);
                $http({
                    method : "GET",
                    url : detailUrl
                }).success(function (res) {
                    angular.extend($scope, res)
                });
            }
        ]);
    }

});
define('js/busiSec/index',['require','exports','module','../common/app','./EnumFilter','./CheatingListCtrl','./CheatingDetailCtrl'],function(require, exports, module) {
    var myApp = require('../common/app'),
        secApp = angular.module('secApp', ['myApp', 'ngRoute', 'ui.bootstrap']);
    
    /**
     *  构建相对路径
     */
    function buildUrl(path) {
        return '../js/busiSec/' + path;
    }
    
    //  初始化路由
    secApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
         $routeProvider
            .when('/', {
              controller  : 'CheatingListCtrl as ctrl',
              templateUrl : buildUrl('index.html'),
              reloadOnSearch : false
            })
            .when('/detail/:id', {
                controller : 'CheatingDetailCtrl as ctrl',
                templateUrl : buildUrl('detail.html')
            })
            .otherwise('/');
        //$locationProvider.html5Mode(true).hashPrefix();
    }]);
    //  注册过滤器
    require('./EnumFilter')(secApp);
    require('./CheatingListCtrl')(secApp);
    //  加载明细页面
    require('./CheatingDetailCtrl')(secApp);

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['secApp']);
    });
});

(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('@charset \"UTF-8\";.header:before,.header-right:before,.header:after,.header-right:after{content:\"\";display:table;}.header:after,.header-right:after{clear:both;}dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:\'...\\A..\\A.\';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.header{min-width:1100px;width:100%;height:70px;border-bottom:solid 1px #d4d6db;color:#262626;box-shadow:0 1px 2px 1px #f1f1f1;}.logo{margin-left:35px;line-height:70px;display:inline-block;background:url(/project/portals/i/logo.png?v=953c28) 0 center no-repeat;background-size:35px auto;font-size:22px;padding-left:41px;color:#262626;vertical-align:middle;cursor:pointer;text-decoration:none;}.logo:hover{text-decoration:none;color:#262626;}.header-list > li .p-dropdown,.header-right .msg .p-dropdown,.header-right .user .p-dropdown{display:block;position:absolute;width:160px;top:62px;left:50%;transition:transform 0.25s cubic-bezier(0.18,0.89,0.32,1.28);transform-origin:center top;transform:translate(-50%) scaleY(0);}.header-list > li:hover .p-dropdown,.header-right .msg:hover .p-dropdown,.header-right .wrap-user-img:hover .p-dropdown{transform:translate(-50%) scaleY(1);}.header-list{font-size:16px;display:inline-block;vertical-align:middle;margin-left:75px;list-style:none outside none;margin-bottom:0;}.header-list > li{padding:0 10px;margin-right:30px;float:left;line-height:70px;position:relative;cursor:pointer;}.header-list > li:last-child{margin-right:0;}.header-list > li:hover > a,.header-list > li.hover > a{color:#528be6;text-decoration:none;}.header-list > li:hover > i,.header-list > li.hover > i{left:0;right:0;}.header-list > li > a{transition:color .3s ease-out;color:#262626;display:block;text-align:center;line-height:70px;text-decoration:none;}.header-list > li > i{position:absolute;bottom:10px;left:50%;right:50%;height:4px;font-size:0;background-color:#528be6;transition-property:left,right;transition-duration:.3s;transition-timing-function:ease-out;}.header-right{line-height:70px;height:70px;font-size:0;margin-right:16px;float:right;}.header-right .msg{position:relative;color:#262626;line-height:70px;font-size:14px;float:left;cursor:pointer;}.header-right .msg a{text-decoration:none;color:#262626;}.header-right .msg b{font-weight:normal;color:#fa9027;margin-left:6px;}.header-right .wrap-user-img{float:left;}.header-right .wrap-user-img:hover .user:before{transform:rotate(-45deg);top:60%;}.header-right .wrap-img{float:left;height:70px;margin-left:46px;padding-top:15px;cursor:pointer;}.header-right .wrap-img img{vertical-align:top;border-radius:50%;width:40px;height:40px;}.header-right .user{padding-left:11px;margin-right:58px;cursor:pointer;position:relative;height:70px;float:left;}.header-right .user:before{content:\'\';display:block;width:8px;height:8px;border:solid #d8d8d8;border-width:2px 2px 0 0;position:absolute;top:50%;z-index:1;transform:rotate(135deg);}.header-right .user:before{right:-20px;margin-top:-5px;transition:all .3s linear;}.header-right .user .name{display:inline-block;vertical-align:middle;color:#343434;font-size:14px;}.p-dropdown{padding:6px 0;border-radius:8px;background-color:#ffffff;box-shadow:0 0 2px 2px #f1f1f1;position:relative;list-style:none outside none;z-index:1000;}.p-dropdown:before{content:\'\';position:absolute;top:-2px;left:50%;z-index:10;width:10px;height:10px;background-color:#fff;border:solid #f0f0f0;border-width:1px 0 0 1px;box-shadow:-1px -1px 2px #f1f1f1;transform:rotate(45deg) translate(-50%);}.p-dropdown > .list-item,.p-dropdown > li{color:#262626;font-size:14px;line-height:35px;padding:0 16px;}.p-dropdown > .list-item:hover,.p-dropdown > li:hover{background-color:#f5f5f5;}.p-dropdown > .list-item:last-child,.p-dropdown > li:last-child{border-radius:0 0 4px 4px;}.p-dropdown > .list-item:first-child,.p-dropdown > li:first-child{border-radius:4px 4px 0 0;}.p-dropdown > .list-item a,.p-dropdown > li a{color:#262626;}.p-dropdown > .list-item a:hover,.p-dropdown > li a:hover{color:#528be6;text-decoration:none;}.p-dropdown > .list-item > b,.p-dropdown > li > b{font-weight:normal;color:#fa8919;padding-right:8px;}@media (max-width:1000px){.header-list{margin-left:0;}.header-list > li{margin-right:15px;}}@media (max-width:1200px){.header-list{margin-left:0;}.header-list > li{margin-right:18px;}}');
