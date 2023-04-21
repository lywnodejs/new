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
define('js/common/angular-bind-html-compile',['require','exports','module'],function (require, exports, module) {

    var bindHtmlCompile = angular.module('angular-bind-html-compile', []);

    bindHtmlCompile.directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    // In case value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }]);
    if (module && module.exports) {
        module.exports = bindHtmlCompile.name;
    }

});
define('js/common/get-buttons-html',['require','exports','module','./angular-bind-html-compile'],function (require, exports, module) {
    require('./angular-bind-html-compile');
    /**
        "data": [{
                    "name": "新建漏洞",
                    "url": "/project/portals/pages/hole.html"
                }, {
                    "name": "批量导入",
                    "url": "#"
                }]

        buttons:{
            批量导入:" <a href="javascript:" class="p-btn i-fr upload-file"><input id="js-upload" type="file" name="filename" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">批量导入</a>"
            数据申请:" <a href="/project/portals/pages/application.html" ng-if="formType==='0'" class="p-btn i-fr">数据申请</a>"
        }

        <a href="{{url}}" class="p-btn i-fr">{{name}}</a>
     */
    var getButtonsHtml = function (data, buttons) {
        if (!data || !Array.isArray(data) || !data.length) {
            return null
        }
        var htmlStr = '';
        //获取所有的按钮名称
        var names = data.map(function (val) {
            return val.name;
        })

        //获取有权限的按钮，配置项传入的按钮用户不一定都有权限，这里把有权限的都过滤出来
        var buttonNames = Object.keys(buttons).filter(function (name) {
            return names.indexOf(name) >= 0
        });

        //过滤出是链接的按钮，排除掉配置事件按钮，剩下的就是连接按钮
        var filterNames = names.filter(function (name) {
            return buttonNames.indexOf(name) === -1;
        })

        //先组装是链接的按钮
        data.forEach(function (val) {
            //链接按钮
            if (!!~filterNames.indexOf(val.name)) {
                htmlStr += '<a href="' + val.url + '" class="p-btn i-fr">' + val.name + '</a>';
                //配置事件按钮
            } else if (!!~buttonNames.indexOf(val.name)) {
                htmlStr += buttons[val.name];
            }
        })
        return htmlStr;
    }

    var getPathname = function () {
        return '/project/portals/pages/' + location.href.replace(/\.html(.+)?/, '').split('/').pop() + '.html';
    }

    var getCurrentMenu = function (data) {
        //获取当前页面的url
        var currentUrl = location.pathname || getPathname()
        var obj = data.filter(function (d) {
            return d.url === currentUrl
        });
        if (!obj || !obj[0]) {
            return []
        }
        return obj[0].action;
    }

    return function ($rootScope, $scope, buttons, callback) {
        $scope.buttonsHtml = '';
        $rootScope.$on('init.user', function (e, data) {
            $scope.buttonsHtml = getButtonsHtml(getCurrentMenu(data.menus), buttons)
            typeof callback === 'function' && callback()
        });
    }
});
define('js/bug/init-page-select',['require','exports','module'],function (require, exports, module) {
    return function (ctrl, $http, $timeout, $scope) {
        var getData = function (url, key, callback, param) {
            $http({
                method: "GET",
                url: url,
                params: param || {}
            }).success(function (res) {
                ctrl.pageConfig[key] = res.data;
                angular.isFunction(callback) && callback(res.data);
            });
        };

        //初始话漏洞类型
        getData('/dictionary/listByParentId/1000', 'holeType1');
        ctrl.holeType1Change = function (callback) {
            if (typeof ctrl.pageData.holeType1 === 'undefined') {
                ctrl.pageConfig.holeType2 = [];
                ctrl.pageData.holeType2 = undefined;
                return;
            }
            $scope.$broadcast('holeType1Change');
            getData('/dictionary/listByParentId/' + ctrl.pageData.holeType1, 'holeType2',
                function (data) {
                    //没有值的时候不需要处理
                    ctrl.pageData.holeType2 && $timeout(function () {
                        ctrl.pageData.holeType2 = data.some(function (val) {
                            return val.id == ctrl.pageData.holeType2
                        }) ? ctrl.pageData.holeType2 : undefined;
                    });
                    angular.isFunction(callback) && callback();
                });
        };

        //初始话漏漏洞来源
        getData('/dictionary/listByParentId/1055', 'holeSource1');
        ctrl.holeSource1Change = function (callback) {
            if (typeof ctrl.pageData.holeSource1 === 'undefined') {
                ctrl.pageConfig.holeSource2 = [];
                ctrl.pageData.holeSource2 = undefined;
                return;
            }
            getData('/dictionary/listByParentId/' + ctrl.pageData.holeSource1, 'holeSource2',
                function (data) {
                    ctrl.pageData.holeSource2 && $timeout(function () {
                        ctrl.pageData.holeSource2 = data.some(function (val) {
                            return val.id == ctrl.pageData.holeSource2
                        }) ? ctrl.pageData.holeSource2 : undefined;
                    });
                    angular.isFunction(callback) && callback();
                });
        };
    }
});
define('js/common/datetimepicder-pop-init/time-option',['require','exports','module'],function (require, exports, module) {
    return {
        formatYear: 'yy',
        maxDate: new Date(2030, 5, 22),
        minDate: new Date(),
        initDate: new Date,
        showWeeks: true,
    }
});
define('js/common/init-range-time/keys',['require','exports','module'],function (require, exports, module) {
    return ['postStartTime', 'postEndTime', 'expireStartTime', 'expireEndTime']
});
/**
 * @author xiongjian
 * @email xiongjian@didichuxing.com
 * @create date 2017-09-07 03:10:49
 * @modify date 2017-09-07 03:10:49
 * @desc [description]
 */
define('js/common/init-range-time/index',['require','exports','module','../datetimepicder-pop-init/time-option','../utils','./keys'],function (require, exports, module) {
    var dateTimeOption = require('../datetimepicder-pop-init/time-option');
    var utils = require('../utils');
    var keys = require('./keys');
    return function (ctrl, $scope) {
        delete dateTimeOption.minDate;
        [
            [keys[0], keys[1]],
            [keys[2], keys[3]]
        ].forEach(function (item) {
            item.forEach(function (key, index) {
                ctrl[key + 'TimeOption'] = angular.extend({}, dateTimeOption);
                ctrl[key + 'IsOpen'] = false;
                ctrl[key + 'Open'] = function () {
                    ctrl[key + 'IsOpen'] = true;
                }
                ctrl[key + 'Close'] = function () {
                    ctrl[key + 'IsOpen'] = false;
                }
                ctrl[key + 'Change'] = (function (i) {
                    return function () {
                        ctrl[item[i === 0 ? 1 : 0] + 'Option'].minDate = ctrl.pageData[key];
                    }
                }(index));
            });
        });
        var fn = function (pageData) {
            var data = angular.copy(pageData);
            keys.forEach(function (key) {
                data[key] && (data[key] = utils.isDate(data[key]) ? data[key].toJSON() : data[key]);
            });
            return data;
        }
        fn.keys = keys;
        return fn;
    }
});
define('js/common/init-range-time/transfer-time',['require','exports','module','./keys'],function (require, exports, module) {
    var keys = require('./keys');
    return function (initData, setKey) {
        (setKey || keys).forEach(function (key) {
            if (initData[key]) {
                initData[key] = new Date(initData[key].replace(/T.+/, ''))
            }
        })
        return initData;
    }
});
define('common/upload-excel/index',['require','exports','module'],function (require, exports, module) {
    return function (selector, submit) {
        var sel = document.querySelector(selector);
        if (!sel) {
            return;
        }
        sel.addEventListener('change', function (e) {
            if (!this.files || !this.files.length) {
                return;
            }
            var fileName = this.files[0].name;
            if (!fileName.endsWith('xls') && !fileName.endsWith('xlsx')) {
                return;
            }
            submit(this.files[0])
        });
    }
});
 define('js/bug/page-config',['require','exports','module'],function(require, exports, module) {
     return {
         initPageData: {
             currentTime: new Date()
         },
         //下面都是页面配置数据
         riskLevel: ['S0(严重)', 'S1(高危)', 'S2(中危)', 'S3(低危)', '忽略'], //编辑页面有忽略
         //初始页面的配置数据
         holeType1: [],
         holeType2: [],
         holeSource1: [],
         holeSource2: [],
         effectBizOptions: [],
         recurrentLevelOptions: [],
         usedLevelOptions: [],
         volumeLevelOptions: [],
         discoverLevelOptions: [],
         selfLevelOptions: [],
         analyses: ['真实入侵', '违规操作', '测试', '误报'], 
         process: ['派发工单', '线下处理',]
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
define('common/../../../lib/angular-bootstrap/angular-locale_zh-cn',['require','exports','module'],function(e,E,a){"use strict";angular.module("ngLocale",[],["$provide",function(e){var E={ZERO:"zero",ONE:"one",TWO:"two",FEW:"few",MANY:"many",OTHER:"other"};e.value("$locale",{DATETIME_FORMATS:{AMPMS:["上午","下午"],DAY:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],ERANAMES:["公元前","公元"],ERAS:["公元前","公元"],FIRSTDAYOFWEEK:6,MONTH:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],SHORTDAY:["周日","周一","周二","周三","周四","周五","周六"],SHORTMONTH:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],STANDALONEMONTH:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],WEEKENDRANGE:[5,6],fullDate:"y年M月d日EEEE",longDate:"y年M月d日",medium:"y年M月d日 ah:mm:ss",mediumDate:"y年M月d日",mediumTime:"ah:mm:ss",short:"y/M/d ah:mm",shortDate:"y/M/d",shortTime:"ah:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"¥",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-¤",negSuf:"",posPre:"¤",posSuf:""}]},id:"zh-cn",localeID:"zh_CN",pluralCat:function(e,a){return E.OTHER}})}])});
define('common/angular-bootstrap-datepicker-ppopup/js/ui-bootstrap-custom-tpls-2.1.3',['require','exports','module','../../../../../lib/angular-bootstrap/angular-locale_zh-cn'],function (require, exports, module) {
  require('../../../../../lib/angular-bootstrap/angular-locale_zh-cn');
  /*
   * angular-ui-bootstrap
   * http://angular-ui.github.io/bootstrap/

   * Version: 2.1.3 - 2016-08-25
   * License: MIT
   */
  angular.module("ui.bootstrap-datepickerPopup", [
    "ui.bootstrap.datepickerPopup",
    "ui.bootstrap.datepicker",
    "ui.bootstrap.dateparser",
    "ui.bootstrap.isClass",
    "ui.bootstrap.position",
    "uib/template/datepickerPopup/popup.html",
    "uib/template/datepicker/datepicker.html",
    "uib/template/datepicker/day.html",
    "uib/template/datepicker/month.html",
    "uib/template/datepicker/year.html"
  ]);
  angular.module('ui.bootstrap.datepickerPopup', ['ui.bootstrap.datepicker', 'ui.bootstrap.position'])

    .value('$datepickerPopupLiteralWarning', true)

    .constant('uibDatepickerPopupConfig', {
      altInputFormats: [],
      appendToBody: false,
      clearText: 'Clear',
      closeOnDateSelection: true,
      closeText: 'Done',
      currentText: 'Today',
      datepickerPopup: 'yyyy-MM-dd',
      datepickerPopupTemplateUrl: 'uib/template/datepickerPopup/popup.html',
      datepickerTemplateUrl: 'uib/template/datepicker/datepicker.html',
      html5Types: {
        date: 'yyyy-MM-dd',
        'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
        'month': 'yyyy-MM'
      },
      onOpenFocus: true,
      showButtonBar: true,
      placement: 'auto bottom-left'
    })

    .controller('UibDatepickerPopupController', ['$scope', '$element', '$attrs', '$compile', '$log', '$parse', '$window', '$document', '$rootScope', '$uibPosition', 'dateFilter', 'uibDateParser', 'uibDatepickerPopupConfig', '$timeout', 'uibDatepickerConfig', '$datepickerPopupLiteralWarning',
      function ($scope, $element, $attrs, $compile, $log, $parse, $window, $document, $rootScope, $position, dateFilter, dateParser, datepickerPopupConfig, $timeout, datepickerConfig, $datepickerPopupLiteralWarning) {
        var cache = {},
          isHtml5DateInput = false;
        var dateFormat, closeOnDateSelection, appendToBody, onOpenFocus,
          datepickerPopupTemplateUrl, datepickerTemplateUrl, popupEl, datepickerEl, scrollParentEl,
          ngModel, ngModelOptions, $popup, altInputFormats, watchListeners = [];

        this.init = function (_ngModel_) {
          ngModel = _ngModel_;
          ngModelOptions = angular.isObject(_ngModel_.$options) ?
            _ngModel_.$options : {
              timezone: null
            };
          closeOnDateSelection = angular.isDefined($attrs.closeOnDateSelection) ?
            $scope.$parent.$eval($attrs.closeOnDateSelection) :
            datepickerPopupConfig.closeOnDateSelection;
          appendToBody = angular.isDefined($attrs.datepickerAppendToBody) ?
            $scope.$parent.$eval($attrs.datepickerAppendToBody) :
            datepickerPopupConfig.appendToBody;
          onOpenFocus = angular.isDefined($attrs.onOpenFocus) ?
            $scope.$parent.$eval($attrs.onOpenFocus) : datepickerPopupConfig.onOpenFocus;
          datepickerPopupTemplateUrl = angular.isDefined($attrs.datepickerPopupTemplateUrl) ?
            $attrs.datepickerPopupTemplateUrl :
            datepickerPopupConfig.datepickerPopupTemplateUrl;
          datepickerTemplateUrl = angular.isDefined($attrs.datepickerTemplateUrl) ?
            $attrs.datepickerTemplateUrl : datepickerPopupConfig.datepickerTemplateUrl;
          altInputFormats = angular.isDefined($attrs.altInputFormats) ?
            $scope.$parent.$eval($attrs.altInputFormats) :
            datepickerPopupConfig.altInputFormats;

          $scope.showButtonBar = angular.isDefined($attrs.showButtonBar) ?
            $scope.$parent.$eval($attrs.showButtonBar) :
            datepickerPopupConfig.showButtonBar;

          if (datepickerPopupConfig.html5Types[$attrs.type]) {
            dateFormat = datepickerPopupConfig.html5Types[$attrs.type];
            isHtml5DateInput = true;
          } else {
            dateFormat = $attrs.uibDatepickerPopup || datepickerPopupConfig.datepickerPopup;
            $attrs.$observe('uibDatepickerPopup', function (value, oldValue) {
              var newDateFormat = value || datepickerPopupConfig.datepickerPopup;
              // Invalidate the $modelValue to ensure that formatters re-run
              // FIXME: Refactor when PR is merged: https://github.com/angular/angular.js/pull/10764
              if (newDateFormat !== dateFormat) {
                dateFormat = newDateFormat;
                ngModel.$modelValue = null;

                if (!dateFormat) {
                  throw new Error('uibDatepickerPopup must have a date format specified.');
                }
              }
            });
          }

          if (!dateFormat) {
            throw new Error('uibDatepickerPopup must have a date format specified.');
          }

          if (isHtml5DateInput && $attrs.uibDatepickerPopup) {
            throw new Error('HTML5 date input types do not support custom formats.');
          }

          // popup element used to display calendar
          popupEl = angular.element('<div uib-datepicker-popup-wrap><div uib-datepicker></div></div>');

          popupEl.attr({
            'ng-model': 'date',
            'ng-change': 'dateSelection(date)',
            'template-url': datepickerPopupTemplateUrl
          });

          // datepicker element
          datepickerEl = angular.element(popupEl.children()[0]);
          datepickerEl.attr('template-url', datepickerTemplateUrl);

          if (!$scope.datepickerOptions) {
            $scope.datepickerOptions = {};
          }

          if (isHtml5DateInput) {
            if ($attrs.type === 'month') {
              $scope.datepickerOptions.datepickerMode = 'month';
              $scope.datepickerOptions.minMode = 'month';
            }
          }

          datepickerEl.attr('datepicker-options', 'datepickerOptions');

          if (!isHtml5DateInput) {
            // Internal API to maintain the correct ng-invalid-[key] class
            ngModel.$$parserName = 'date';
            ngModel.$validators.date = validator;
            ngModel.$parsers.unshift(parseDate);
            ngModel.$formatters.push(function (value) {
              if (ngModel.$isEmpty(value)) {
                $scope.date = value;
                return value;
              }

              if (angular.isNumber(value)) {
                value = new Date(value);
              }

              $scope.date = dateParser.fromTimezone(value, ngModelOptions.timezone);

              return dateParser.filter($scope.date, dateFormat);
            });
          } else {
            ngModel.$formatters.push(function (value) {
              $scope.date = dateParser.fromTimezone(value, ngModelOptions.timezone);
              return value;
            });
          }

          // Detect changes in the view from the text box
          ngModel.$viewChangeListeners.push(function () {
            $scope.date = parseDateString(ngModel.$viewValue);
          });

          $element.on('keydown', inputKeydownBind);

          $popup = $compile(popupEl)($scope);
          // Prevent jQuery cache memory leak (template is now redundant after linking)
          popupEl.remove();

          if (appendToBody) {
            $document.find('body').append($popup);
          } else {
            $element.after($popup);
          }

          $scope.$on('$destroy', function () {
            if ($scope.isOpen === true) {
              if (!$rootScope.$$phase) {
                $scope.$apply(function () {
                  $scope.isOpen = false;
                });
              }
            }

            $popup.remove();
            $element.off('keydown', inputKeydownBind);
            $document.off('click', documentClickBind);
            if (scrollParentEl) {
              scrollParentEl.off('scroll', positionPopup);
            }
            angular.element($window).off('resize', positionPopup);

            //Clear all watch listeners on destroy
            while (watchListeners.length) {
              watchListeners.shift()();
            }
          });
        };

        $scope.getText = function (key) {
          return $scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
        };

        $scope.isDisabled = function (date) {
          if (date === 'today') {
            date = dateParser.fromTimezone(new Date(), ngModelOptions.timezone);
          }

          var dates = {};
          angular.forEach(['minDate', 'maxDate'], function (key) {
            if (!$scope.datepickerOptions[key]) {
              dates[key] = null;
            } else if (angular.isDate($scope.datepickerOptions[key])) {
              dates[key] = new Date($scope.datepickerOptions[key]);
            } else {
              if ($datepickerPopupLiteralWarning) {
                $log.warn('Literal date support has been deprecated, please switch to date object usage');
              }

              dates[key] = new Date(dateFilter($scope.datepickerOptions[key], 'medium'));
            }
          });

          return $scope.datepickerOptions &&
            dates.minDate && $scope.compare(date, dates.minDate) < 0 ||
            dates.maxDate && $scope.compare(date, dates.maxDate) > 0;
        };

        $scope.compare = function (date1, date2) {
          return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
        };

        // Inner change
        $scope.dateSelection = function (dt, evt) {
          $scope.date = dt;
          var date = $scope.date ? dateParser.filter($scope.date, dateFormat) : null; // Setting to NULL is necessary for form validators to function
          $element.val(date);
          ngModel.$setViewValue(date);

          if (closeOnDateSelection) {
            $scope.isOpen = false;
            $element[0].focus();
            $scope.close(evt);
          }
        };

        $scope.keydown = function (evt) {
          if (evt.which === 27) {
            evt.stopPropagation();
            $scope.isOpen = false;
            $element[0].focus();
          }
        };

        $scope.select = function (date, evt) {
          evt.stopPropagation();

          if (date === 'today') {
            var today = new Date();
            if (angular.isDate($scope.date)) {
              date = new Date($scope.date);
              date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
            } else {
              date = dateParser.fromTimezone(today, ngModelOptions.timezone);
              date.setHours(0, 0, 0, 0);
            }
          }
          $scope.dateSelection(date, evt);
        };

        $scope.close = function (evt) {
          (evt || window.event).stopPropagation();

          $scope.isOpen = false;
          $element[0].focus();
          angular.isFunction($scope.onclose) && $scope.onclose();
        };

        $scope.disabled = angular.isDefined($attrs.disabled) || false;
        if ($attrs.ngDisabled) {
          watchListeners.push($scope.$parent.$watch($parse($attrs.ngDisabled), function (disabled) {
            $scope.disabled = disabled;
          }));
        }

        $scope.$watch('isOpen', function (value) {
          if (value) {
            if (!$scope.disabled) {
              $timeout(function () {
                positionPopup();

                if (onOpenFocus) {
                  $scope.$broadcast('uib:datepicker.focus');
                }

                $document.on('click', documentClickBind);

                var placement = $attrs.popupPlacement ? $attrs.popupPlacement : datepickerPopupConfig.placement;
                if (appendToBody || $position.parsePlacement(placement)[2]) {
                  scrollParentEl = scrollParentEl || angular.element($position.scrollParent($element));
                  if (scrollParentEl) {
                    scrollParentEl.on('scroll', positionPopup);
                  }
                } else {
                  scrollParentEl = null;
                }

                angular.element($window).on('resize', positionPopup);
              }, 0, false);
            } else {
              $scope.isOpen = false;
            }
          } else {
            $document.off('click', documentClickBind);
            if (scrollParentEl) {
              scrollParentEl.off('scroll', positionPopup);
            }
            angular.element($window).off('resize', positionPopup);
          }
        });

        function cameltoDash(string) {
          return string.replace(/([A-Z])/g, function ($1) {
            return '-' + $1.toLowerCase();
          });
        }

        function parseDateString(viewValue) {
          var date = dateParser.parse(viewValue, dateFormat, $scope.date);
          if (isNaN(date)) {
            for (var i = 0; i < altInputFormats.length; i++) {
              date = dateParser.parse(viewValue, altInputFormats[i], $scope.date);
              if (!isNaN(date)) {
                return date;
              }
            }
          }
          return date;
        }

        function parseDate(viewValue) {
          if (angular.isNumber(viewValue)) {
            // presumably timestamp to date object
            viewValue = new Date(viewValue);
          }

          if (!viewValue) {
            return null;
          }

          if (angular.isDate(viewValue) && !isNaN(viewValue)) {
            return viewValue;
          }

          if (angular.isString(viewValue)) {
            var date = parseDateString(viewValue);
            if (!isNaN(date)) {
              return dateParser.fromTimezone(date, ngModelOptions.timezone);
            }
          }

          return ngModel.$options && ngModel.$options.allowInvalid ? viewValue : undefined;
        }

        function validator(modelValue, viewValue) {
          var value = modelValue || viewValue;

          if (!$attrs.ngRequired && !value) {
            return true;
          }

          if (angular.isNumber(value)) {
            value = new Date(value);
          }

          if (!value) {
            return true;
          }

          if (angular.isDate(value) && !isNaN(value)) {
            return true;
          }

          if (angular.isString(value)) {
            return !isNaN(parseDateString(value));
          }

          return false;
        }

        function documentClickBind(event) {
          if (!$scope.isOpen && $scope.disabled) {
            return;
          }

          var popup = $popup[0];
          var dpContainsTarget = $element[0].contains(event.target);
          // The popup node may not be an element node
          // In some browsers (IE) only element nodes have the 'contains' function
          var popupContainsTarget = popup.contains !== undefined && popup.contains(event.target);
          if ($scope.isOpen && !(dpContainsTarget || popupContainsTarget)) {
            $scope.$apply(function () {
              $scope.isOpen = false;
              $scope.close()
            });
          }
        }

        function inputKeydownBind(evt) {
          if (evt.which === 27 && $scope.isOpen) {
            evt.preventDefault();
            evt.stopPropagation();
            $scope.$apply(function () {
              $scope.isOpen = false;
            });
            $element[0].focus();
          } else if (evt.which === 40 && !$scope.isOpen) {
            evt.preventDefault();
            evt.stopPropagation();
            $scope.$apply(function () {
              $scope.isOpen = true;
            });
          }
        }

        function positionPopup() {
          if ($scope.isOpen) {
            var dpElement = angular.element($popup[0].querySelector('.uib-datepicker-popup'));
            var placement = $attrs.popupPlacement ? $attrs.popupPlacement : datepickerPopupConfig.placement;
            var position = $position.positionElements($element, dpElement, placement, appendToBody);
            dpElement.css({
              top: position.top + 'px',
              left: position.left + 'px'
            });
            if (dpElement.hasClass('uib-position-measure')) {
              dpElement.removeClass('uib-position-measure');
            }
          }
        }

        $scope.$on('uib:datepicker.mode', function () {
          $timeout(positionPopup, 0, false);
        });
      }
    ])

    .directive('uibDatepickerPopup', function () {
      return {
        require: ['ngModel', 'uibDatepickerPopup'],
        controller: 'UibDatepickerPopupController',
        scope: {
          datepickerOptions: '=?',
          isOpen: '=?',
          currentText: '@',
          clearText: '@',
          closeText: '@',
          onclose: '&?'
        },
        link: function (scope, element, attrs, ctrls) {
          var ngModel = ctrls[0],
            ctrl = ctrls[1];

          ctrl.init(ngModel);
        }
      };
    })

    .directive('uibDatepickerPopupWrap', function () {
      return {
        restrict: 'A',
        transclude: true,
        templateUrl: function (element, attrs) {
          return attrs.templateUrl || 'uib/template/datepickerPopup/popup.html';
        }
      };
    });

  angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.dateparser', 'ui.bootstrap.isClass'])

    .value('$datepickerSuppressError', false)

    .value('$datepickerLiteralWarning', true)

    .constant('uibDatepickerConfig', {
      datepickerMode: 'day',
      formatDay: 'dd',
      formatMonth: 'MMMM',
      formatYear: 'yyyy',
      formatDayHeader: 'EEE',
      formatDayTitle: 'MMMM yyyy',
      formatMonthTitle: 'yyyy',
      maxDate: null,
      maxMode: 'year',
      minDate: null,
      minMode: 'day',
      monthColumns: 3,
      ngModelOptions: {},
      shortcutPropagation: false,
      showWeeks: true,
      yearColumns: 5,
      yearRows: 4
    })

    .controller('UibDatepickerController', ['$scope', '$element', '$attrs', '$parse', '$interpolate', '$locale', '$log', 'dateFilter', 'uibDatepickerConfig', '$datepickerLiteralWarning', '$datepickerSuppressError', 'uibDateParser',
      function ($scope, $element, $attrs, $parse, $interpolate, $locale, $log, dateFilter, datepickerConfig, $datepickerLiteralWarning, $datepickerSuppressError, dateParser) {
        var self = this,
          ngModelCtrl = {
            $setViewValue: angular.noop
          }, // nullModelCtrl;
          ngModelOptions = {},
          watchListeners = [];

        $element.addClass('uib-datepicker');
        $attrs.$set('role', 'application');

        if (!$scope.datepickerOptions) {
          $scope.datepickerOptions = {};
        }

        // Modes chain
        this.modes = ['day', 'month', 'year'];

        [
          'customClass',
          'dateDisabled',
          'datepickerMode',
          'formatDay',
          'formatDayHeader',
          'formatDayTitle',
          'formatMonth',
          'formatMonthTitle',
          'formatYear',
          'maxDate',
          'maxMode',
          'minDate',
          'minMode',
          'monthColumns',
          'showWeeks',
          'shortcutPropagation',
          'startingDay',
          'yearColumns',
          'yearRows'
        ].forEach(function (key) {
          switch (key) {
            case 'customClass':
            case 'dateDisabled':
              $scope[key] = $scope.datepickerOptions[key] || angular.noop;
              break;
            case 'datepickerMode':
              $scope.datepickerMode = angular.isDefined($scope.datepickerOptions.datepickerMode) ?
                $scope.datepickerOptions.datepickerMode : datepickerConfig.datepickerMode;
              break;
            case 'formatDay':
            case 'formatDayHeader':
            case 'formatDayTitle':
            case 'formatMonth':
            case 'formatMonthTitle':
            case 'formatYear':
              self[key] = angular.isDefined($scope.datepickerOptions[key]) ?
                $interpolate($scope.datepickerOptions[key])($scope.$parent) :
                datepickerConfig[key];
              break;
            case 'monthColumns':
            case 'showWeeks':
            case 'shortcutPropagation':
            case 'yearColumns':
            case 'yearRows':
              self[key] = angular.isDefined($scope.datepickerOptions[key]) ?
                $scope.datepickerOptions[key] : datepickerConfig[key];
              break;
            case 'startingDay':
              if (angular.isDefined($scope.datepickerOptions.startingDay)) {
                self.startingDay = $scope.datepickerOptions.startingDay;
              } else if (angular.isNumber(datepickerConfig.startingDay)) {
                self.startingDay = datepickerConfig.startingDay;
              } else {
                self.startingDay = ($locale.DATETIME_FORMATS.FIRSTDAYOFWEEK + 8) % 7;
              }

              break;
            case 'maxDate':
            case 'minDate':
              $scope.$watch('datepickerOptions.' + key, function (value) {
                if (value) {
                  if (angular.isDate(value)) {
                    self[key] = dateParser.fromTimezone(new Date(value), ngModelOptions.timezone);
                  } else {
                    if ($datepickerLiteralWarning) {
                      $log.warn('Literal date support has been deprecated, please switch to date object usage');
                    }

                    self[key] = new Date(dateFilter(value, 'medium'));
                  }
                } else {
                  self[key] = datepickerConfig[key] ?
                    dateParser.fromTimezone(new Date(datepickerConfig[key]), ngModelOptions.timezone) :
                    null;
                }

                self.refreshView();
              });

              break;
            case 'maxMode':
            case 'minMode':
              if ($scope.datepickerOptions[key]) {
                $scope.$watch(function () {
                  return $scope.datepickerOptions[key];
                }, function (value) {
                  self[key] = $scope[key] = angular.isDefined(value) ? value : $scope.datepickerOptions[key];
                  if (key === 'minMode' && self.modes.indexOf($scope.datepickerOptions.datepickerMode) < self.modes.indexOf(self[key]) ||
                    key === 'maxMode' && self.modes.indexOf($scope.datepickerOptions.datepickerMode) > self.modes.indexOf(self[key])) {
                    $scope.datepickerMode = self[key];
                    $scope.datepickerOptions.datepickerMode = self[key];
                  }
                });
              } else {
                self[key] = $scope[key] = datepickerConfig[key] || null;
              }

              break;
          }
        });

        $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);

        $scope.disabled = angular.isDefined($attrs.disabled) || false;
        if (angular.isDefined($attrs.ngDisabled)) {
          watchListeners.push($scope.$parent.$watch($attrs.ngDisabled, function (disabled) {
            $scope.disabled = disabled;
            self.refreshView();
          }));
        }

        $scope.isActive = function (dateObject) {
          if (self.compare(dateObject.date, self.activeDate) === 0) {
            $scope.activeDateId = dateObject.uid;
            return true;
          }
          return false;
        };

        this.init = function (ngModelCtrl_) {
          ngModelCtrl = ngModelCtrl_;
          ngModelOptions = ngModelCtrl_.$options ||
            $scope.datepickerOptions.ngModelOptions ||
            datepickerConfig.ngModelOptions;
          if ($scope.datepickerOptions.initDate) {
            self.activeDate = dateParser.fromTimezone($scope.datepickerOptions.initDate, ngModelOptions.timezone) || new Date();
            $scope.$watch('datepickerOptions.initDate', function (initDate) {
              if (initDate && (ngModelCtrl.$isEmpty(ngModelCtrl.$modelValue) || ngModelCtrl.$invalid)) {
                self.activeDate = dateParser.fromTimezone(initDate, ngModelOptions.timezone);
                self.refreshView();
              }
            });
          } else {
            self.activeDate = new Date();
          }

          var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : new Date();
          this.activeDate = !isNaN(date) ?
            dateParser.fromTimezone(date, ngModelOptions.timezone) :
            dateParser.fromTimezone(new Date(), ngModelOptions.timezone);

          ngModelCtrl.$render = function () {
            self.render();
          };
        };

        this.render = function () {
          if (ngModelCtrl.$viewValue) {
            var date = new Date(ngModelCtrl.$viewValue),
              isValid = !isNaN(date);

            if (isValid) {
              this.activeDate = dateParser.fromTimezone(date, ngModelOptions.timezone);
            } else if (!$datepickerSuppressError) {
              $log.error('Datepicker directive: "ng-model" value must be a Date object');
            }
          }
          this.refreshView();
        };

        this.refreshView = function () {
          if (this.element) {
            $scope.selectedDt = null;
            this._refreshView();
            if ($scope.activeDt) {
              $scope.activeDateId = $scope.activeDt.uid;
            }

            var date = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
            date = dateParser.fromTimezone(date, ngModelOptions.timezone);
            ngModelCtrl.$setValidity('dateDisabled', !date ||
              this.element && !this.isDisabled(date));
          }
        };

        this.createDateObject = function (date, format) {
          var model = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
          model = dateParser.fromTimezone(model, ngModelOptions.timezone);
          var today = new Date();
          today = dateParser.fromTimezone(today, ngModelOptions.timezone);
          var time = this.compare(date, today);
          var dt = {
            date: date,
            label: dateParser.filter(date, format),
            selected: model && this.compare(date, model) === 0,
            disabled: this.isDisabled(date),
            past: time < 0,
            current: time === 0,
            future: time > 0,
            customClass: this.customClass(date) || null
          };

          if (model && this.compare(date, model) === 0) {
            $scope.selectedDt = dt;
          }

          if (self.activeDate && this.compare(dt.date, self.activeDate) === 0) {
            $scope.activeDt = dt;
          }

          return dt;
        };

        this.isDisabled = function (date) {
          return $scope.disabled ||
            this.minDate && this.compare(date, this.minDate) < 0 ||
            this.maxDate && this.compare(date, this.maxDate) > 0 ||
            $scope.dateDisabled && $scope.dateDisabled({
              date: date,
              mode: $scope.datepickerMode
            });
        };

        this.customClass = function (date) {
          return $scope.customClass({
            date: date,
            mode: $scope.datepickerMode
          });
        };

        // Split array into smaller arrays
        this.split = function (arr, size) {
          var arrays = [];
          while (arr.length > 0) {
            arrays.push(arr.splice(0, size));
          }
          return arrays;
        };

        $scope.select = function (date) {
          if ($scope.datepickerMode === self.minMode) {
            var dt = ngModelCtrl.$viewValue ? dateParser.fromTimezone(new Date(ngModelCtrl.$viewValue), ngModelOptions.timezone) : new Date(0, 0, 0, 0, 0, 0, 0);
            dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
            dt = dateParser.toTimezone(dt, ngModelOptions.timezone);
            ngModelCtrl.$setViewValue(dt);
            ngModelCtrl.$render();
          } else {
            self.activeDate = date;
            setMode(self.modes[self.modes.indexOf($scope.datepickerMode) - 1]);

            $scope.$emit('uib:datepicker.mode');
          }

          $scope.$broadcast('uib:datepicker.focus');
        };

        $scope.move = function (direction) {
          var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
            month = self.activeDate.getMonth() + direction * (self.step.months || 0);
          self.activeDate.setFullYear(year, month, 1);
          self.refreshView();
        };

        $scope.toggleMode = function (direction) {
          direction = direction || 1;

          if ($scope.datepickerMode === self.maxMode && direction === 1 ||
            $scope.datepickerMode === self.minMode && direction === -1) {
            return;
          }

          setMode(self.modes[self.modes.indexOf($scope.datepickerMode) + direction]);

          $scope.$emit('uib:datepicker.mode');
        };

        // Key event mapper
        $scope.keys = {
          13: 'enter',
          32: 'space',
          33: 'pageup',
          34: 'pagedown',
          35: 'end',
          36: 'home',
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down'
        };

        var focusElement = function () {
          self.element[0].focus();
        };

        // Listen for focus requests from popup directive
        $scope.$on('uib:datepicker.focus', focusElement);

        $scope.keydown = function (evt) {
          var key = $scope.keys[evt.which];

          if (!key || evt.shiftKey || evt.altKey || $scope.disabled) {
            return;
          }

          evt.preventDefault();
          if (!self.shortcutPropagation) {
            evt.stopPropagation();
          }

          if (key === 'enter' || key === 'space') {
            if (self.isDisabled(self.activeDate)) {
              return; // do nothing
            }
            $scope.select(self.activeDate);
          } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
            $scope.toggleMode(key === 'up' ? 1 : -1);
          } else {
            self.handleKeyDown(key, evt);
            self.refreshView();
          }
        };

        $element.on('keydown', function (evt) {
          $scope.$apply(function () {
            $scope.keydown(evt);
          });
        });

        $scope.$on('$destroy', function () {
          //Clear all watch listeners on destroy
          while (watchListeners.length) {
            watchListeners.shift()();
          }
        });

        function setMode(mode) {
          $scope.datepickerMode = mode;
          $scope.datepickerOptions.datepickerMode = mode;
        }
      }
    ])

    .controller('UibDaypickerController', ['$scope', '$element', 'dateFilter', function (scope, $element, dateFilter) {
      var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      this.step = {
        months: 1
      };
      this.element = $element;

      function getDaysInMonth(year, month) {
        return month === 1 && year % 4 === 0 &&
          (year % 100 !== 0 || year % 400 === 0) ? 29 : DAYS_IN_MONTH[month];
      }

      this.init = function (ctrl) {
        angular.extend(ctrl, this);
        scope.showWeeks = ctrl.showWeeks;
        ctrl.refreshView();
      };

      this.getDates = function (startDate, n) {
        var dates = new Array(n),
          current = new Date(startDate),
          i = 0,
          date;
        while (i < n) {
          date = new Date(current);
          dates[i++] = date;
          current.setDate(current.getDate() + 1);
        }
        return dates;
      };

      this._refreshView = function () {
        var year = this.activeDate.getFullYear(),
          month = this.activeDate.getMonth(),
          firstDayOfMonth = new Date(this.activeDate);

        firstDayOfMonth.setFullYear(year, month, 1);

        var difference = this.startingDay - firstDayOfMonth.getDay(),
          numDisplayedFromPreviousMonth = difference > 0 ?
          7 - difference : -difference,
          firstDate = new Date(firstDayOfMonth);

        if (numDisplayedFromPreviousMonth > 0) {
          firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
        }

        // 42 is the number of days on a six-week calendar
        var days = this.getDates(firstDate, 42);
        for (var i = 0; i < 42; i++) {
          days[i] = angular.extend(this.createDateObject(days[i], this.formatDay), {
            secondary: days[i].getMonth() !== month,
            uid: scope.uniqueId + '-' + i
          });
        }

        scope.labels = new Array(7);
        for (var j = 0; j < 7; j++) {
          scope.labels[j] = {
            abbr: dateFilter(days[j].date, this.formatDayHeader),
            full: dateFilter(days[j].date, 'EEEE')
          };
        }

        scope.title = dateFilter(this.activeDate, this.formatDayTitle);
        scope.rows = this.split(days, 7);

        if (scope.showWeeks) {
          scope.weekNumbers = [];
          var thursdayIndex = (4 + 7 - this.startingDay) % 7,
            numWeeks = scope.rows.length;
          for (var curWeek = 0; curWeek < numWeeks; curWeek++) {
            scope.weekNumbers.push(
              getISO8601WeekNumber(scope.rows[curWeek][thursdayIndex].date));
          }
        }
      };

      this.compare = function (date1, date2) {
        var _date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
        var _date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
        _date1.setFullYear(date1.getFullYear());
        _date2.setFullYear(date2.getFullYear());
        return _date1 - _date2;
      };

      function getISO8601WeekNumber(date) {
        var checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
        var time = checkDate.getTime();
        checkDate.setMonth(0); // Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
      }

      this.handleKeyDown = function (key, evt) {
        var date = this.activeDate.getDate();

        if (key === 'left') {
          date = date - 1;
        } else if (key === 'up') {
          date = date - 7;
        } else if (key === 'right') {
          date = date + 1;
        } else if (key === 'down') {
          date = date + 7;
        } else if (key === 'pageup' || key === 'pagedown') {
          var month = this.activeDate.getMonth() + (key === 'pageup' ? -1 : 1);
          this.activeDate.setMonth(month, 1);
          date = Math.min(getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth()), date);
        } else if (key === 'home') {
          date = 1;
        } else if (key === 'end') {
          date = getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth());
        }
        this.activeDate.setDate(date);
      };
    }])

    .controller('UibMonthpickerController', ['$scope', '$element', 'dateFilter', function (scope, $element, dateFilter) {
      this.step = {
        years: 1
      };
      this.element = $element;

      this.init = function (ctrl) {
        angular.extend(ctrl, this);
        ctrl.refreshView();
      };

      this._refreshView = function () {
        var months = new Array(12),
          year = this.activeDate.getFullYear(),
          date;

        for (var i = 0; i < 12; i++) {
          date = new Date(this.activeDate);
          date.setFullYear(year, i, 1);
          months[i] = angular.extend(this.createDateObject(date, this.formatMonth), {
            uid: scope.uniqueId + '-' + i
          });
        }

        scope.title = dateFilter(this.activeDate, this.formatMonthTitle);
        scope.rows = this.split(months, this.monthColumns);
        scope.yearHeaderColspan = this.monthColumns > 3 ? this.monthColumns - 2 : 1;
      };

      this.compare = function (date1, date2) {
        var _date1 = new Date(date1.getFullYear(), date1.getMonth());
        var _date2 = new Date(date2.getFullYear(), date2.getMonth());
        _date1.setFullYear(date1.getFullYear());
        _date2.setFullYear(date2.getFullYear());
        return _date1 - _date2;
      };

      this.handleKeyDown = function (key, evt) {
        var date = this.activeDate.getMonth();

        if (key === 'left') {
          date = date - 1;
        } else if (key === 'up') {
          date = date - this.monthColumns;
        } else if (key === 'right') {
          date = date + 1;
        } else if (key === 'down') {
          date = date + this.monthColumns;
        } else if (key === 'pageup' || key === 'pagedown') {
          var year = this.activeDate.getFullYear() + (key === 'pageup' ? -1 : 1);
          this.activeDate.setFullYear(year);
        } else if (key === 'home') {
          date = 0;
        } else if (key === 'end') {
          date = 11;
        }
        this.activeDate.setMonth(date);
      };
    }])

    .controller('UibYearpickerController', ['$scope', '$element', 'dateFilter', function (scope, $element, dateFilter) {
      var columns, range;
      this.element = $element;

      function getStartingYear(year) {
        return parseInt((year - 1) / range, 10) * range + 1;
      }

      this.yearpickerInit = function () {
        columns = this.yearColumns;
        range = this.yearRows * columns;
        this.step = {
          years: range
        };
      };

      this._refreshView = function () {
        var years = new Array(range),
          date;

        for (var i = 0, start = getStartingYear(this.activeDate.getFullYear()); i < range; i++) {
          date = new Date(this.activeDate);
          date.setFullYear(start + i, 0, 1);
          years[i] = angular.extend(this.createDateObject(date, this.formatYear), {
            uid: scope.uniqueId + '-' + i
          });
        }

        scope.title = [years[0].label, years[range - 1].label].join(' - ');
        scope.rows = this.split(years, columns);
        scope.columns = columns;
      };

      this.compare = function (date1, date2) {
        return date1.getFullYear() - date2.getFullYear();
      };

      this.handleKeyDown = function (key, evt) {
        var date = this.activeDate.getFullYear();

        if (key === 'left') {
          date = date - 1;
        } else if (key === 'up') {
          date = date - columns;
        } else if (key === 'right') {
          date = date + 1;
        } else if (key === 'down') {
          date = date + columns;
        } else if (key === 'pageup' || key === 'pagedown') {
          date += (key === 'pageup' ? -1 : 1) * range;
        } else if (key === 'home') {
          date = getStartingYear(this.activeDate.getFullYear());
        } else if (key === 'end') {
          date = getStartingYear(this.activeDate.getFullYear()) + range - 1;
        }
        this.activeDate.setFullYear(date);
      };
    }])

    .directive('uibDatepicker', function () {
      return {
        templateUrl: function (element, attrs) {
          return attrs.templateUrl || 'uib/template/datepicker/datepicker.html';
        },
        scope: {
          datepickerOptions: '=?'
        },
        require: ['uibDatepicker', '^ngModel'],
        restrict: 'A',
        controller: 'UibDatepickerController',
        controllerAs: 'datepicker',
        link: function (scope, element, attrs, ctrls) {
          var datepickerCtrl = ctrls[0],
            ngModelCtrl = ctrls[1];

          datepickerCtrl.init(ngModelCtrl);
        }
      };
    })

    .directive('uibDaypicker', function () {
      return {
        templateUrl: function (element, attrs) {
          return attrs.templateUrl || 'uib/template/datepicker/day.html';
        },
        require: ['^uibDatepicker', 'uibDaypicker'],
        restrict: 'A',
        controller: 'UibDaypickerController',
        link: function (scope, element, attrs, ctrls) {
          var datepickerCtrl = ctrls[0],
            daypickerCtrl = ctrls[1];

          daypickerCtrl.init(datepickerCtrl);
        }
      };
    })

    .directive('uibMonthpicker', function () {
      return {
        templateUrl: function (element, attrs) {
          return attrs.templateUrl || 'uib/template/datepicker/month.html';
        },
        require: ['^uibDatepicker', 'uibMonthpicker'],
        restrict: 'A',
        controller: 'UibMonthpickerController',
        link: function (scope, element, attrs, ctrls) {
          var datepickerCtrl = ctrls[0],
            monthpickerCtrl = ctrls[1];

          monthpickerCtrl.init(datepickerCtrl);
        }
      };
    })

    .directive('uibYearpicker', function () {
      return {
        templateUrl: function (element, attrs) {
          return attrs.templateUrl || 'uib/template/datepicker/year.html';
        },
        require: ['^uibDatepicker', 'uibYearpicker'],
        restrict: 'A',
        controller: 'UibYearpickerController',
        link: function (scope, element, attrs, ctrls) {
          var ctrl = ctrls[0];
          angular.extend(ctrl, ctrls[1]);
          ctrl.yearpickerInit();

          ctrl.refreshView();
        }
      };
    });

  angular.module('ui.bootstrap.dateparser', [])

    .service('uibDateParser', ['$log', '$locale', 'dateFilter', 'orderByFilter', function ($log, $locale, dateFilter, orderByFilter) {
      // Pulled from https://github.com/mbostock/d3/blob/master/src/format/requote.js
      var SPECIAL_CHARACTERS_REGEXP = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

      var localeId;
      var formatCodeToRegex;

      this.init = function () {
        localeId = $locale.id;

        this.parsers = {};
        this.formatters = {};

        formatCodeToRegex = [{
          key: 'yyyy',
          regex: '\\d{4}',
          apply: function (value) {
            this.year = +value;
          },
          formatter: function (date) {
            var _date = new Date();
            _date.setFullYear(Math.abs(date.getFullYear()));
            return dateFilter(_date, 'yyyy');
          }
        }, {
          key: 'yy',
          regex: '\\d{2}',
          apply: function (value) {
            value = +value;
            this.year = value < 69 ? value + 2000 : value + 1900;
          },
          formatter: function (date) {
            var _date = new Date();
            _date.setFullYear(Math.abs(date.getFullYear()));
            return dateFilter(_date, 'yy');
          }
        }, {
          key: 'y',
          regex: '\\d{1,4}',
          apply: function (value) {
            this.year = +value;
          },
          formatter: function (date) {
            var _date = new Date();
            _date.setFullYear(Math.abs(date.getFullYear()));
            return dateFilter(_date, 'y');
          }
        }, {
          key: 'M!',
          regex: '0?[1-9]|1[0-2]',
          apply: function (value) {
            this.month = value - 1;
          },
          formatter: function (date) {
            var value = date.getMonth();
            if (/^[0-9]$/.test(value)) {
              return dateFilter(date, 'MM');
            }

            return dateFilter(date, 'M');
          }
        }, {
          key: 'MMMM',
          regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
          apply: function (value) {
            this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value);
          },
          formatter: function (date) {
            return dateFilter(date, 'MMMM');
          }
        }, {
          key: 'MMM',
          regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
          apply: function (value) {
            this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value);
          },
          formatter: function (date) {
            return dateFilter(date, 'MMM');
          }
        }, {
          key: 'MM',
          regex: '0[1-9]|1[0-2]',
          apply: function (value) {
            this.month = value - 1;
          },
          formatter: function (date) {
            return dateFilter(date, 'MM');
          }
        }, {
          key: 'M',
          regex: '[1-9]|1[0-2]',
          apply: function (value) {
            this.month = value - 1;
          },
          formatter: function (date) {
            return dateFilter(date, 'M');
          }
        }, {
          key: 'd!',
          regex: '[0-2]?[0-9]{1}|3[0-1]{1}',
          apply: function (value) {
            this.date = +value;
          },
          formatter: function (date) {
            var value = date.getDate();
            if (/^[1-9]$/.test(value)) {
              return dateFilter(date, 'dd');
            }

            return dateFilter(date, 'd');
          }
        }, {
          key: 'dd',
          regex: '[0-2][0-9]{1}|3[0-1]{1}',
          apply: function (value) {
            this.date = +value;
          },
          formatter: function (date) {
            return dateFilter(date, 'dd');
          }
        }, {
          key: 'd',
          regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
          apply: function (value) {
            this.date = +value;
          },
          formatter: function (date) {
            return dateFilter(date, 'd');
          }
        }, {
          key: 'EEEE',
          regex: $locale.DATETIME_FORMATS.DAY.join('|'),
          formatter: function (date) {
            return dateFilter(date, 'EEEE');
          }
        }, {
          key: 'EEE',
          regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|'),
          formatter: function (date) {
            return dateFilter(date, 'EEE');
          }
        }, {
          key: 'HH',
          regex: '(?:0|1)[0-9]|2[0-3]',
          apply: function (value) {
            this.hours = +value;
          },
          formatter: function (date) {
            return dateFilter(date, 'HH');
          }
        }, {
          key: 'hh',
          regex: '0[0-9]|1[0-2]',
          apply: function (value) {
            this.hours = +value;
          },
          formatter: function (date) {
            return dateFilter(date, 'hh');
          }
        }, {
          key: 'H',
          regex: '1?[0-9]|2[0-3]',
          apply: function (value) {
            this.hours = +value;
          },
          formatter: function (date) {
            return dateFilter(date, 'H');
          }
        }, {
          key: 'h',
          regex: '[0-9]|1[0-2]',
          apply: function (value) {
            this.hours = +value;
          },
          formatter: function (date) {
            return dateFilter(date, 'h');
          }
        }, {
          key: 'mm',
          regex: '[0-5][0-9]',
          apply: function (value) {
            this.minutes = +value;
          },
          formatter: function (date) {
            return dateFilter(date, 'mm');
          }
        }, {
          key: 'm',
          regex: '[0-9]|[1-5][0-9]',
          apply: function (value) {
            this.minutes = +value;
          },
          formatter: function (date) {
            return dateFilter(date, 'm');
          }
        }, {
          key: 'sss',
          regex: '[0-9][0-9][0-9]',
          apply: function (value) {
            this.milliseconds = +value;
          },
          formatter: function (date) {
            return dateFilter(date, 'sss');
          }
        }, {
          key: 'ss',
          regex: '[0-5][0-9]',
          apply: function (value) {
            this.seconds = +value;
          },
          formatter: function (date) {
            return dateFilter(date, 'ss');
          }
        }, {
          key: 's',
          regex: '[0-9]|[1-5][0-9]',
          apply: function (value) {
            this.seconds = +value;
          },
          formatter: function (date) {
            return dateFilter(date, 's');
          }
        }, {
          key: 'a',
          regex: $locale.DATETIME_FORMATS.AMPMS.join('|'),
          apply: function (value) {
            if (this.hours === 12) {
              this.hours = 0;
            }

            if (value === 'PM') {
              this.hours += 12;
            }
          },
          formatter: function (date) {
            return dateFilter(date, 'a');
          }
        }, {
          key: 'Z',
          regex: '[+-]\\d{4}',
          apply: function (value) {
            var matches = value.match(/([+-])(\d{2})(\d{2})/),
              sign = matches[1],
              hours = matches[2],
              minutes = matches[3];
            this.hours += toInt(sign + hours);
            this.minutes += toInt(sign + minutes);
          },
          formatter: function (date) {
            return dateFilter(date, 'Z');
          }
        }, {
          key: 'ww',
          regex: '[0-4][0-9]|5[0-3]',
          formatter: function (date) {
            return dateFilter(date, 'ww');
          }
        }, {
          key: 'w',
          regex: '[0-9]|[1-4][0-9]|5[0-3]',
          formatter: function (date) {
            return dateFilter(date, 'w');
          }
        }, {
          key: 'GGGG',
          regex: $locale.DATETIME_FORMATS.ERANAMES.join('|').replace(/\s/g, '\\s'),
          formatter: function (date) {
            return dateFilter(date, 'GGGG');
          }
        }, {
          key: 'GGG',
          regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
          formatter: function (date) {
            return dateFilter(date, 'GGG');
          }
        }, {
          key: 'GG',
          regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
          formatter: function (date) {
            return dateFilter(date, 'GG');
          }
        }, {
          key: 'G',
          regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
          formatter: function (date) {
            return dateFilter(date, 'G');
          }
        }];
      };

      this.init();

      function createParser(format) {
        var map = [],
          regex = format.split('');

        // check for literal values
        var quoteIndex = format.indexOf('\'');
        if (quoteIndex > -1) {
          var inLiteral = false;
          format = format.split('');
          for (var i = quoteIndex; i < format.length; i++) {
            if (inLiteral) {
              if (format[i] === '\'') {
                if (i + 1 < format.length && format[i + 1] === '\'') { // escaped single quote
                  format[i + 1] = '$';
                  regex[i + 1] = '';
                } else { // end of literal
                  regex[i] = '';
                  inLiteral = false;
                }
              }
              format[i] = '$';
            } else {
              if (format[i] === '\'') { // start of literal
                format[i] = '$';
                regex[i] = '';
                inLiteral = true;
              }
            }
          }

          format = format.join('');
        }

        angular.forEach(formatCodeToRegex, function (data) {
          var index = format.indexOf(data.key);

          if (index > -1) {
            format = format.split('');

            regex[index] = '(' + data.regex + ')';
            format[index] = '$'; // Custom symbol to define consumed part of format
            for (var i = index + 1, n = index + data.key.length; i < n; i++) {
              regex[i] = '';
              format[i] = '$';
            }
            format = format.join('');

            map.push({
              index: index,
              key: data.key,
              apply: data.apply,
              matcher: data.regex
            });
          }
        });

        return {
          regex: new RegExp('^' + regex.join('') + '$'),
          map: orderByFilter(map, 'index')
        };
      }

      function createFormatter(format) {
        var formatters = [];
        var i = 0;
        var formatter, literalIdx;
        while (i < format.length) {
          if (angular.isNumber(literalIdx)) {
            if (format.charAt(i) === '\'') {
              if (i + 1 >= format.length || format.charAt(i + 1) !== '\'') {
                formatters.push(constructLiteralFormatter(format, literalIdx, i));
                literalIdx = null;
              }
            } else if (i === format.length) {
              while (literalIdx < format.length) {
                formatter = constructFormatterFromIdx(format, literalIdx);
                formatters.push(formatter);
                literalIdx = formatter.endIdx;
              }
            }

            i++;
            continue;
          }

          if (format.charAt(i) === '\'') {
            literalIdx = i;
            i++;
            continue;
          }

          formatter = constructFormatterFromIdx(format, i);

          formatters.push(formatter.parser);
          i = formatter.endIdx;
        }

        return formatters;
      }

      function constructLiteralFormatter(format, literalIdx, endIdx) {
        return function () {
          return format.substr(literalIdx + 1, endIdx - literalIdx - 1);
        };
      }

      function constructFormatterFromIdx(format, i) {
        var currentPosStr = format.substr(i);
        for (var j = 0; j < formatCodeToRegex.length; j++) {
          if (new RegExp('^' + formatCodeToRegex[j].key).test(currentPosStr)) {
            var data = formatCodeToRegex[j];
            return {
              endIdx: i + data.key.length,
              parser: data.formatter
            };
          }
        }

        return {
          endIdx: i + 1,
          parser: function () {
            return currentPosStr.charAt(0);
          }
        };
      }

      this.filter = function (date, format) {
        if (!angular.isDate(date) || isNaN(date) || !format) {
          return '';
        }

        format = $locale.DATETIME_FORMATS[format] || format;

        if ($locale.id !== localeId) {
          this.init();
        }

        if (!this.formatters[format]) {
          this.formatters[format] = createFormatter(format);
        }

        var formatters = this.formatters[format];

        return formatters.reduce(function (str, formatter) {
          return str + formatter(date);
        }, '');
      };

      this.parse = function (input, format, baseDate) {
        if (!angular.isString(input) || !format) {
          return input;
        }

        format = $locale.DATETIME_FORMATS[format] || format;
        format = format.replace(SPECIAL_CHARACTERS_REGEXP, '\\$&');

        if ($locale.id !== localeId) {
          this.init();
        }

        if (!this.parsers[format]) {
          this.parsers[format] = createParser(format, 'apply');
        }

        var parser = this.parsers[format],
          regex = parser.regex,
          map = parser.map,
          results = input.match(regex),
          tzOffset = false;
        if (results && results.length) {
          var fields, dt;
          if (angular.isDate(baseDate) && !isNaN(baseDate.getTime())) {
            fields = {
              year: baseDate.getFullYear(),
              month: baseDate.getMonth(),
              date: baseDate.getDate(),
              hours: baseDate.getHours(),
              minutes: baseDate.getMinutes(),
              seconds: baseDate.getSeconds(),
              milliseconds: baseDate.getMilliseconds()
            };
          } else {
            if (baseDate) {
              $log.warn('dateparser:', 'baseDate is not a valid date');
            }
            fields = {
              year: 1900,
              month: 0,
              date: 1,
              hours: 0,
              minutes: 0,
              seconds: 0,
              milliseconds: 0
            };
          }

          for (var i = 1, n = results.length; i < n; i++) {
            var mapper = map[i - 1];
            if (mapper.matcher === 'Z') {
              tzOffset = true;
            }

            if (mapper.apply) {
              mapper.apply.call(fields, results[i]);
            }
          }

          var datesetter = tzOffset ? Date.prototype.setUTCFullYear :
            Date.prototype.setFullYear;
          var timesetter = tzOffset ? Date.prototype.setUTCHours :
            Date.prototype.setHours;

          if (isValid(fields.year, fields.month, fields.date)) {
            if (angular.isDate(baseDate) && !isNaN(baseDate.getTime()) && !tzOffset) {
              dt = new Date(baseDate);
              datesetter.call(dt, fields.year, fields.month, fields.date);
              timesetter.call(dt, fields.hours, fields.minutes,
                fields.seconds, fields.milliseconds);
            } else {
              dt = new Date(0);
              datesetter.call(dt, fields.year, fields.month, fields.date);
              timesetter.call(dt, fields.hours || 0, fields.minutes || 0,
                fields.seconds || 0, fields.milliseconds || 0);
            }
          }

          return dt;
        }
      };

      // Check if date is valid for specific month (and year for February).
      // Month: 0 = Jan, 1 = Feb, etc
      function isValid(year, month, date) {
        if (date < 1) {
          return false;
        }

        if (month === 1 && date > 28) {
          return date === 29 && (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0);
        }

        if (month === 3 || month === 5 || month === 8 || month === 10) {
          return date < 31;
        }

        return true;
      }

      function toInt(str) {
        return parseInt(str, 10);
      }

      this.toTimezone = toTimezone;
      this.fromTimezone = fromTimezone;
      this.timezoneToOffset = timezoneToOffset;
      this.addDateMinutes = addDateMinutes;
      this.convertTimezoneToLocal = convertTimezoneToLocal;

      function toTimezone(date, timezone) {
        return date && timezone ? convertTimezoneToLocal(date, timezone) : date;
      }

      function fromTimezone(date, timezone) {
        return date && timezone ? convertTimezoneToLocal(date, timezone, true) : date;
      }

      //https://github.com/angular/angular.js/blob/622c42169699ec07fc6daaa19fe6d224e5d2f70e/src/Angular.js#L1207
      function timezoneToOffset(timezone, fallback) {
        timezone = timezone.replace(/:/g, '');
        var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
        return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
      }

      function addDateMinutes(date, minutes) {
        date = new Date(date.getTime());
        date.setMinutes(date.getMinutes() + minutes);
        return date;
      }

      function convertTimezoneToLocal(date, timezone, reverse) {
        reverse = reverse ? -1 : 1;
        var dateTimezoneOffset = date.getTimezoneOffset();
        var timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
        return addDateMinutes(date, reverse * (timezoneOffset - dateTimezoneOffset));
      }
    }]);

  // Avoiding use of ng-class as it creates a lot of watchers when a class is to be applied to
  // at most one element.
  angular.module('ui.bootstrap.isClass', [])
    .directive('uibIsClass', [
      '$animate',
      function ($animate) {
        //                    11111111          22222222
        var ON_REGEXP = /^\s*([\s\S]+?)\s+on\s+([\s\S]+?)\s*$/;
        //                    11111111           22222222
        var IS_REGEXP = /^\s*([\s\S]+?)\s+for\s+([\s\S]+?)\s*$/;

        var dataPerTracked = {};

        return {
          restrict: 'A',
          compile: function (tElement, tAttrs) {
            var linkedScopes = [];
            var instances = [];
            var expToData = {};
            var lastActivated = null;
            var onExpMatches = tAttrs.uibIsClass.match(ON_REGEXP);
            var onExp = onExpMatches[2];
            var expsStr = onExpMatches[1];
            var exps = expsStr.split(',');

            return linkFn;

            function linkFn(scope, element, attrs) {
              linkedScopes.push(scope);
              instances.push({
                scope: scope,
                element: element
              });

              exps.forEach(function (exp, k) {
                addForExp(exp, scope);
              });

              scope.$on('$destroy', removeScope);
            }

            function addForExp(exp, scope) {
              var matches = exp.match(IS_REGEXP);
              var clazz = scope.$eval(matches[1]);
              var compareWithExp = matches[2];
              var data = expToData[exp];
              if (!data) {
                var watchFn = function (compareWithVal) {
                  var newActivated = null;
                  instances.some(function (instance) {
                    var thisVal = instance.scope.$eval(onExp);
                    if (thisVal === compareWithVal) {
                      newActivated = instance;
                      return true;
                    }
                  });
                  if (data.lastActivated !== newActivated) {
                    if (data.lastActivated) {
                      $animate.removeClass(data.lastActivated.element, clazz);
                    }
                    if (newActivated) {
                      $animate.addClass(newActivated.element, clazz);
                    }
                    data.lastActivated = newActivated;
                  }
                };
                expToData[exp] = data = {
                  lastActivated: null,
                  scope: scope,
                  watchFn: watchFn,
                  compareWithExp: compareWithExp,
                  watcher: scope.$watch(compareWithExp, watchFn)
                };
              }
              data.watchFn(scope.$eval(compareWithExp));
            }

            function removeScope(e) {
              var removedScope = e.targetScope;
              var index = linkedScopes.indexOf(removedScope);
              linkedScopes.splice(index, 1);
              instances.splice(index, 1);
              if (linkedScopes.length) {
                var newWatchScope = linkedScopes[0];
                angular.forEach(expToData, function (data) {
                  if (data.scope === removedScope) {
                    data.watcher = newWatchScope.$watch(data.compareWithExp, data.watchFn);
                    data.scope = newWatchScope;
                  }
                });
              } else {
                expToData = {};
              }
            }
          }
        };
      }
    ]);
  angular.module('ui.bootstrap.position', [])

    /**
     * A set of utility methods for working with the DOM.
     * It is meant to be used where we need to absolute-position elements in
     * relation to another element (this is the case for tooltips, popovers,
     * typeahead suggestions etc.).
     */
    .factory('$uibPosition', ['$document', '$window', function ($document, $window) {
      /**
       * Used by scrollbarWidth() function to cache scrollbar's width.
       * Do not access this variable directly, use scrollbarWidth() instead.
       */
      var SCROLLBAR_WIDTH;
      /**
       * scrollbar on body and html element in IE and Edge overlay
       * content and should be considered 0 width.
       */
      var BODY_SCROLLBAR_WIDTH;
      var OVERFLOW_REGEX = {
        normal: /(auto|scroll)/,
        hidden: /(auto|scroll|hidden)/
      };
      var PLACEMENT_REGEX = {
        auto: /\s?auto?\s?/i,
        primary: /^(top|bottom|left|right)$/,
        secondary: /^(top|bottom|left|right|center)$/,
        vertical: /^(top|bottom)$/
      };
      var BODY_REGEX = /(HTML|BODY)/;

      return {

        /**
         * Provides a raw DOM element from a jQuery/jQLite element.
         *
         * @param {element} elem - The element to convert.
         *
         * @returns {element} A HTML element.
         */
        getRawNode: function (elem) {
          return elem.nodeName ? elem : elem[0] || elem;
        },

        /**
         * Provides a parsed number for a style property.  Strips
         * units and casts invalid numbers to 0.
         *
         * @param {string} value - The style value to parse.
         *
         * @returns {number} A valid number.
         */
        parseStyle: function (value) {
          value = parseFloat(value);
          return isFinite(value) ? value : 0;
        },

        /**
         * Provides the closest positioned ancestor.
         *
         * @param {element} element - The element to get the offest parent for.
         *
         * @returns {element} The closest positioned ancestor.
         */
        offsetParent: function (elem) {
          elem = this.getRawNode(elem);

          var offsetParent = elem.offsetParent || $document[0].documentElement;

          function isStaticPositioned(el) {
            return ($window.getComputedStyle(el).position || 'static') === 'static';
          }

          while (offsetParent && offsetParent !== $document[0].documentElement && isStaticPositioned(offsetParent)) {
            offsetParent = offsetParent.offsetParent;
          }

          return offsetParent || $document[0].documentElement;
        },

        /**
         * Provides the scrollbar width, concept from TWBS measureScrollbar()
         * function in https://github.com/twbs/bootstrap/blob/master/js/modal.js
         * In IE and Edge, scollbar on body and html element overlay and should
         * return a width of 0.
         *
         * @returns {number} The width of the browser scollbar.
         */
        scrollbarWidth: function (isBody) {
          if (isBody) {
            if (angular.isUndefined(BODY_SCROLLBAR_WIDTH)) {
              var bodyElem = $document.find('body');
              bodyElem.addClass('uib-position-body-scrollbar-measure');
              BODY_SCROLLBAR_WIDTH = $window.innerWidth - bodyElem[0].clientWidth;
              BODY_SCROLLBAR_WIDTH = isFinite(BODY_SCROLLBAR_WIDTH) ? BODY_SCROLLBAR_WIDTH : 0;
              bodyElem.removeClass('uib-position-body-scrollbar-measure');
            }
            return BODY_SCROLLBAR_WIDTH;
          }

          if (angular.isUndefined(SCROLLBAR_WIDTH)) {
            var scrollElem = angular.element('<div class="uib-position-scrollbar-measure"></div>');
            $document.find('body').append(scrollElem);
            SCROLLBAR_WIDTH = scrollElem[0].offsetWidth - scrollElem[0].clientWidth;
            SCROLLBAR_WIDTH = isFinite(SCROLLBAR_WIDTH) ? SCROLLBAR_WIDTH : 0;
            scrollElem.remove();
          }

          return SCROLLBAR_WIDTH;
        },

        /**
         * Provides the padding required on an element to replace the scrollbar.
         *
         * @returns {object} An object with the following properties:
         *   <ul>
         *     <li>**scrollbarWidth**: the width of the scrollbar</li>
         *     <li>**widthOverflow**: whether the the width is overflowing</li>
         *     <li>**right**: the amount of right padding on the element needed to replace the scrollbar</li>
         *     <li>**rightOriginal**: the amount of right padding currently on the element</li>
         *     <li>**heightOverflow**: whether the the height is overflowing</li>
         *     <li>**bottom**: the amount of bottom padding on the element needed to replace the scrollbar</li>
         *     <li>**bottomOriginal**: the amount of bottom padding currently on the element</li>
         *   </ul>
         */
        scrollbarPadding: function (elem) {
          elem = this.getRawNode(elem);

          var elemStyle = $window.getComputedStyle(elem);
          var paddingRight = this.parseStyle(elemStyle.paddingRight);
          var paddingBottom = this.parseStyle(elemStyle.paddingBottom);
          var scrollParent = this.scrollParent(elem, false, true);
          var scrollbarWidth = this.scrollbarWidth(scrollParent, BODY_REGEX.test(scrollParent.tagName));

          return {
            scrollbarWidth: scrollbarWidth,
            widthOverflow: scrollParent.scrollWidth > scrollParent.clientWidth,
            right: paddingRight + scrollbarWidth,
            originalRight: paddingRight,
            heightOverflow: scrollParent.scrollHeight > scrollParent.clientHeight,
            bottom: paddingBottom + scrollbarWidth,
            originalBottom: paddingBottom
          };
        },

        /**
         * Checks to see if the element is scrollable.
         *
         * @param {element} elem - The element to check.
         * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
         *   default is false.
         *
         * @returns {boolean} Whether the element is scrollable.
         */
        isScrollable: function (elem, includeHidden) {
          elem = this.getRawNode(elem);

          var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
          var elemStyle = $window.getComputedStyle(elem);
          return overflowRegex.test(elemStyle.overflow + elemStyle.overflowY + elemStyle.overflowX);
        },

        /**
         * Provides the closest scrollable ancestor.
         * A port of the jQuery UI scrollParent method:
         * https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
         *
         * @param {element} elem - The element to find the scroll parent of.
         * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
         *   default is false.
         * @param {boolean=} [includeSelf=false] - Should the element being passed be
         * included in the scrollable llokup.
         *
         * @returns {element} A HTML element.
         */
        scrollParent: function (elem, includeHidden, includeSelf) {
          elem = this.getRawNode(elem);

          var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
          var documentEl = $document[0].documentElement;
          var elemStyle = $window.getComputedStyle(elem);
          if (includeSelf && overflowRegex.test(elemStyle.overflow + elemStyle.overflowY + elemStyle.overflowX)) {
            return elem;
          }
          var excludeStatic = elemStyle.position === 'absolute';
          var scrollParent = elem.parentElement || documentEl;

          if (scrollParent === documentEl || elemStyle.position === 'fixed') {
            return documentEl;
          }

          while (scrollParent.parentElement && scrollParent !== documentEl) {
            var spStyle = $window.getComputedStyle(scrollParent);
            if (excludeStatic && spStyle.position !== 'static') {
              excludeStatic = false;
            }

            if (!excludeStatic && overflowRegex.test(spStyle.overflow + spStyle.overflowY + spStyle.overflowX)) {
              break;
            }
            scrollParent = scrollParent.parentElement;
          }

          return scrollParent;
        },

        /**
         * Provides read-only equivalent of jQuery's position function:
         * http://api.jquery.com/position/ - distance to closest positioned
         * ancestor.  Does not account for margins by default like jQuery position.
         *
         * @param {element} elem - The element to caclulate the position on.
         * @param {boolean=} [includeMargins=false] - Should margins be accounted
         * for, default is false.
         *
         * @returns {object} An object with the following properties:
         *   <ul>
         *     <li>**width**: the width of the element</li>
         *     <li>**height**: the height of the element</li>
         *     <li>**top**: distance to top edge of offset parent</li>
         *     <li>**left**: distance to left edge of offset parent</li>
         *   </ul>
         */
        position: function (elem, includeMagins) {
          elem = this.getRawNode(elem);

          var elemOffset = this.offset(elem);
          if (includeMagins) {
            var elemStyle = $window.getComputedStyle(elem);
            elemOffset.top -= this.parseStyle(elemStyle.marginTop);
            elemOffset.left -= this.parseStyle(elemStyle.marginLeft);
          }
          var parent = this.offsetParent(elem);
          var parentOffset = {
            top: 0,
            left: 0
          };

          if (parent !== $document[0].documentElement) {
            parentOffset = this.offset(parent);
            parentOffset.top += parent.clientTop - parent.scrollTop;
            parentOffset.left += parent.clientLeft - parent.scrollLeft;
          }

          return {
            width: Math.round(angular.isNumber(elemOffset.width) ? elemOffset.width : elem.offsetWidth),
            height: Math.round(angular.isNumber(elemOffset.height) ? elemOffset.height : elem.offsetHeight),
            top: Math.round(elemOffset.top - parentOffset.top),
            left: Math.round(elemOffset.left - parentOffset.left)
          };
        },

        /**
         * Provides read-only equivalent of jQuery's offset function:
         * http://api.jquery.com/offset/ - distance to viewport.  Does
         * not account for borders, margins, or padding on the body
         * element.
         *
         * @param {element} elem - The element to calculate the offset on.
         *
         * @returns {object} An object with the following properties:
         *   <ul>
         *     <li>**width**: the width of the element</li>
         *     <li>**height**: the height of the element</li>
         *     <li>**top**: distance to top edge of viewport</li>
         *     <li>**right**: distance to bottom edge of viewport</li>
         *   </ul>
         */
        offset: function (elem) {
          elem = this.getRawNode(elem);

          var elemBCR = elem.getBoundingClientRect();
          return {
            width: Math.round(angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
            height: Math.round(angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
            top: Math.round(elemBCR.top + ($window.pageYOffset || $document[0].documentElement.scrollTop)),
            left: Math.round(elemBCR.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft))
          };
        },

        /**
         * Provides offset distance to the closest scrollable ancestor
         * or viewport.  Accounts for border and scrollbar width.
         *
         * Right and bottom dimensions represent the distance to the
         * respective edge of the viewport element.  If the element
         * edge extends beyond the viewport, a negative value will be
         * reported.
         *
         * @param {element} elem - The element to get the viewport offset for.
         * @param {boolean=} [useDocument=false] - Should the viewport be the document element instead
         * of the first scrollable element, default is false.
         * @param {boolean=} [includePadding=true] - Should the padding on the offset parent element
         * be accounted for, default is true.
         *
         * @returns {object} An object with the following properties:
         *   <ul>
         *     <li>**top**: distance to the top content edge of viewport element</li>
         *     <li>**bottom**: distance to the bottom content edge of viewport element</li>
         *     <li>**left**: distance to the left content edge of viewport element</li>
         *     <li>**right**: distance to the right content edge of viewport element</li>
         *   </ul>
         */
        viewportOffset: function (elem, useDocument, includePadding) {
          elem = this.getRawNode(elem);
          includePadding = includePadding !== false ? true : false;

          var elemBCR = elem.getBoundingClientRect();
          var offsetBCR = {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          };

          var offsetParent = useDocument ? $document[0].documentElement : this.scrollParent(elem);
          var offsetParentBCR = offsetParent.getBoundingClientRect();

          offsetBCR.top = offsetParentBCR.top + offsetParent.clientTop;
          offsetBCR.left = offsetParentBCR.left + offsetParent.clientLeft;
          if (offsetParent === $document[0].documentElement) {
            offsetBCR.top += $window.pageYOffset;
            offsetBCR.left += $window.pageXOffset;
          }
          offsetBCR.bottom = offsetBCR.top + offsetParent.clientHeight;
          offsetBCR.right = offsetBCR.left + offsetParent.clientWidth;

          if (includePadding) {
            var offsetParentStyle = $window.getComputedStyle(offsetParent);
            offsetBCR.top += this.parseStyle(offsetParentStyle.paddingTop);
            offsetBCR.bottom -= this.parseStyle(offsetParentStyle.paddingBottom);
            offsetBCR.left += this.parseStyle(offsetParentStyle.paddingLeft);
            offsetBCR.right -= this.parseStyle(offsetParentStyle.paddingRight);
          }

          return {
            top: Math.round(elemBCR.top - offsetBCR.top),
            bottom: Math.round(offsetBCR.bottom - elemBCR.bottom),
            left: Math.round(elemBCR.left - offsetBCR.left),
            right: Math.round(offsetBCR.right - elemBCR.right)
          };
        },

        /**
         * Provides an array of placement values parsed from a placement string.
         * Along with the 'auto' indicator, supported placement strings are:
         *   <ul>
         *     <li>top: element on top, horizontally centered on host element.</li>
         *     <li>top-left: element on top, left edge aligned with host element left edge.</li>
         *     <li>top-right: element on top, lerightft edge aligned with host element right edge.</li>
         *     <li>bottom: element on bottom, horizontally centered on host element.</li>
         *     <li>bottom-left: element on bottom, left edge aligned with host element left edge.</li>
         *     <li>bottom-right: element on bottom, right edge aligned with host element right edge.</li>
         *     <li>left: element on left, vertically centered on host element.</li>
         *     <li>left-top: element on left, top edge aligned with host element top edge.</li>
         *     <li>left-bottom: element on left, bottom edge aligned with host element bottom edge.</li>
         *     <li>right: element on right, vertically centered on host element.</li>
         *     <li>right-top: element on right, top edge aligned with host element top edge.</li>
         *     <li>right-bottom: element on right, bottom edge aligned with host element bottom edge.</li>
         *   </ul>
         * A placement string with an 'auto' indicator is expected to be
         * space separated from the placement, i.e: 'auto bottom-left'  If
         * the primary and secondary placement values do not match 'top,
         * bottom, left, right' then 'top' will be the primary placement and
         * 'center' will be the secondary placement.  If 'auto' is passed, true
         * will be returned as the 3rd value of the array.
         *
         * @param {string} placement - The placement string to parse.
         *
         * @returns {array} An array with the following values
         * <ul>
         *   <li>**[0]**: The primary placement.</li>
         *   <li>**[1]**: The secondary placement.</li>
         *   <li>**[2]**: If auto is passed: true, else undefined.</li>
         * </ul>
         */
        parsePlacement: function (placement) {
          var autoPlace = PLACEMENT_REGEX.auto.test(placement);
          if (autoPlace) {
            placement = placement.replace(PLACEMENT_REGEX.auto, '');
          }

          placement = placement.split('-');

          placement[0] = placement[0] || 'top';
          if (!PLACEMENT_REGEX.primary.test(placement[0])) {
            placement[0] = 'top';
          }

          placement[1] = placement[1] || 'center';
          if (!PLACEMENT_REGEX.secondary.test(placement[1])) {
            placement[1] = 'center';
          }

          if (autoPlace) {
            placement[2] = true;
          } else {
            placement[2] = false;
          }

          return placement;
        },

        /**
         * Provides coordinates for an element to be positioned relative to
         * another element.  Passing 'auto' as part of the placement parameter
         * will enable smart placement - where the element fits. i.e:
         * 'auto left-top' will check to see if there is enough space to the left
         * of the hostElem to fit the targetElem, if not place right (same for secondary
         * top placement).  Available space is calculated using the viewportOffset
         * function.
         *
         * @param {element} hostElem - The element to position against.
         * @param {element} targetElem - The element to position.
         * @param {string=} [placement=top] - The placement for the targetElem,
         *   default is 'top'. 'center' is assumed as secondary placement for
         *   'top', 'left', 'right', and 'bottom' placements.  Available placements are:
         *   <ul>
         *     <li>top</li>
         *     <li>top-right</li>
         *     <li>top-left</li>
         *     <li>bottom</li>
         *     <li>bottom-left</li>
         *     <li>bottom-right</li>
         *     <li>left</li>
         *     <li>left-top</li>
         *     <li>left-bottom</li>
         *     <li>right</li>
         *     <li>right-top</li>
         *     <li>right-bottom</li>
         *   </ul>
         * @param {boolean=} [appendToBody=false] - Should the top and left values returned
         *   be calculated from the body element, default is false.
         *
         * @returns {object} An object with the following properties:
         *   <ul>
         *     <li>**top**: Value for targetElem top.</li>
         *     <li>**left**: Value for targetElem left.</li>
         *     <li>**placement**: The resolved placement.</li>
         *   </ul>
         */
        positionElements: function (hostElem, targetElem, placement, appendToBody) {
          hostElem = this.getRawNode(hostElem);
          targetElem = this.getRawNode(targetElem);

          // need to read from prop to support tests.
          var targetWidth = angular.isDefined(targetElem.offsetWidth) ? targetElem.offsetWidth : targetElem.prop('offsetWidth');
          var targetHeight = angular.isDefined(targetElem.offsetHeight) ? targetElem.offsetHeight : targetElem.prop('offsetHeight');

          placement = this.parsePlacement(placement);

          var hostElemPos = appendToBody ? this.offset(hostElem) : this.position(hostElem);
          var targetElemPos = {
            top: 0,
            left: 0,
            placement: ''
          };

          if (placement[2]) {
            var viewportOffset = this.viewportOffset(hostElem, appendToBody);

            var targetElemStyle = $window.getComputedStyle(targetElem);
            var adjustedSize = {
              width: targetWidth + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginLeft) + this.parseStyle(targetElemStyle.marginRight))),
              height: targetHeight + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginTop) + this.parseStyle(targetElemStyle.marginBottom)))
            };

            placement[0] = placement[0] === 'top' && adjustedSize.height > viewportOffset.top && adjustedSize.height <= viewportOffset.bottom ? 'bottom' :
              placement[0] === 'bottom' && adjustedSize.height > viewportOffset.bottom && adjustedSize.height <= viewportOffset.top ? 'top' :
              placement[0] === 'left' && adjustedSize.width > viewportOffset.left && adjustedSize.width <= viewportOffset.right ? 'right' :
              placement[0] === 'right' && adjustedSize.width > viewportOffset.right && adjustedSize.width <= viewportOffset.left ? 'left' :
              placement[0];

            placement[1] = placement[1] === 'top' && adjustedSize.height - hostElemPos.height > viewportOffset.bottom && adjustedSize.height - hostElemPos.height <= viewportOffset.top ? 'bottom' :
              placement[1] === 'bottom' && adjustedSize.height - hostElemPos.height > viewportOffset.top && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom ? 'top' :
              placement[1] === 'left' && adjustedSize.width - hostElemPos.width > viewportOffset.right && adjustedSize.width - hostElemPos.width <= viewportOffset.left ? 'right' :
              placement[1] === 'right' && adjustedSize.width - hostElemPos.width > viewportOffset.left && adjustedSize.width - hostElemPos.width <= viewportOffset.right ? 'left' :
              placement[1];

            if (placement[1] === 'center') {
              if (PLACEMENT_REGEX.vertical.test(placement[0])) {
                var xOverflow = hostElemPos.width / 2 - targetWidth / 2;
                if (viewportOffset.left + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.right) {
                  placement[1] = 'left';
                } else if (viewportOffset.right + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.left) {
                  placement[1] = 'right';
                }
              } else {
                var yOverflow = hostElemPos.height / 2 - adjustedSize.height / 2;
                if (viewportOffset.top + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom) {
                  placement[1] = 'top';
                } else if (viewportOffset.bottom + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.top) {
                  placement[1] = 'bottom';
                }
              }
            }
          }

          switch (placement[0]) {
            case 'top':
              targetElemPos.top = hostElemPos.top - targetHeight;
              break;
            case 'bottom':
              targetElemPos.top = hostElemPos.top + hostElemPos.height;
              break;
            case 'left':
              targetElemPos.left = hostElemPos.left - targetWidth;
              break;
            case 'right':
              targetElemPos.left = hostElemPos.left + hostElemPos.width;
              break;
          }

          switch (placement[1]) {
            case 'top':
              targetElemPos.top = hostElemPos.top;
              break;
            case 'bottom':
              targetElemPos.top = hostElemPos.top + hostElemPos.height - targetHeight;
              break;
            case 'left':
              targetElemPos.left = hostElemPos.left;
              break;
            case 'right':
              targetElemPos.left = hostElemPos.left + hostElemPos.width - targetWidth;
              break;
            case 'center':
              if (PLACEMENT_REGEX.vertical.test(placement[0])) {
                targetElemPos.left = hostElemPos.left + hostElemPos.width / 2 - targetWidth / 2;
              } else {
                targetElemPos.top = hostElemPos.top + hostElemPos.height / 2 - targetHeight / 2;
              }
              break;
          }

          targetElemPos.top = Math.round(targetElemPos.top);
          targetElemPos.left = Math.round(targetElemPos.left);
          targetElemPos.placement = placement[1] === 'center' ? placement[0] : placement[0] + '-' + placement[1];

          return targetElemPos;
        },

        /**
         * Provides a way to adjust the top positioning after first
         * render to correctly align element to top after content
         * rendering causes resized element height
         *
         * @param {array} placementClasses - The array of strings of classes
         * element should have.
         * @param {object} containerPosition - The object with container
         * position information
         * @param {number} initialHeight - The initial height for the elem.
         * @param {number} currentHeight - The current height for the elem.
         */
        adjustTop: function (placementClasses, containerPosition, initialHeight, currentHeight) {
          if (placementClasses.indexOf('top') !== -1 && initialHeight !== currentHeight) {
            return {
              top: containerPosition.top - currentHeight + 'px'
            };
          }
        },

        /**
         * Provides a way for positioning tooltip & dropdown
         * arrows when using placement options beyond the standard
         * left, right, top, or bottom.
         *
         * @param {element} elem - The tooltip/dropdown element.
         * @param {string} placement - The placement for the elem.
         */
        positionArrow: function (elem, placement) {
          elem = this.getRawNode(elem);

          var innerElem = elem.querySelector('.tooltip-inner, .popover-inner');
          if (!innerElem) {
            return;
          }

          var isTooltip = angular.element(innerElem).hasClass('tooltip-inner');

          var arrowElem = isTooltip ? elem.querySelector('.tooltip-arrow') : elem.querySelector('.arrow');
          if (!arrowElem) {
            return;
          }

          var arrowCss = {
            top: '',
            bottom: '',
            left: '',
            right: ''
          };

          placement = this.parsePlacement(placement);
          if (placement[1] === 'center') {
            // no adjustment necessary - just reset styles
            angular.element(arrowElem).css(arrowCss);
            return;
          }

          var borderProp = 'border-' + placement[0] + '-width';
          var borderWidth = $window.getComputedStyle(arrowElem)[borderProp];

          var borderRadiusProp = 'border-';
          if (PLACEMENT_REGEX.vertical.test(placement[0])) {
            borderRadiusProp += placement[0] + '-' + placement[1];
          } else {
            borderRadiusProp += placement[1] + '-' + placement[0];
          }
          borderRadiusProp += '-radius';
          var borderRadius = $window.getComputedStyle(isTooltip ? innerElem : elem)[borderRadiusProp];

          switch (placement[0]) {
            case 'top':
              arrowCss.bottom = isTooltip ? '0' : '-' + borderWidth;
              break;
            case 'bottom':
              arrowCss.top = isTooltip ? '0' : '-' + borderWidth;
              break;
            case 'left':
              arrowCss.right = isTooltip ? '0' : '-' + borderWidth;
              break;
            case 'right':
              arrowCss.left = isTooltip ? '0' : '-' + borderWidth;
              break;
          }

          arrowCss[placement[1]] = borderRadius;

          angular.element(arrowElem).css(arrowCss);
        }
      };
    }]);

  angular.module("uib/template/datepickerPopup/popup.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/datepickerPopup/popup.html",
      "<ul class=\"uib-datepicker-popup dropdown-menu uib-position-measure\" dropdown-nested ng-if=\"isOpen\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n" +
      "  <li ng-transclude></li>\n" +
      "  <li ng-if=\"showButtonBar\" class=\"uib-button-bar\">\n" +
      "    <span class=\"btn-group pull-left\">\n" +
      "      <button type=\"button\" class=\"btn btn-sm btn-info uib-datepicker-current\" ng-click=\"select('today', $event)\" ng-disabled=\"isDisabled('today')\">{{ getText('current') }}</button>\n" +
      "      <button type=\"button\" class=\"btn btn-sm btn-danger uib-clear\" ng-click=\"select(null, $event)\">{{ getText('clear') }}</button>\n" +
      "    </span>\n" +
      "    <button type=\"button\" class=\"btn btn-sm btn-success pull-right uib-close\" ng-click=\"close($event)\">{{ getText('close') }}</button>\n" +
      "  </li>\n" +
      "</ul>\n" +
      "");
  }]);

  angular.module("uib/template/datepicker/datepicker.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/datepicker/datepicker.html",
      "<div ng-switch=\"datepickerMode\">\n" +
      "  <div uib-daypicker ng-switch-when=\"day\" tabindex=\"0\" class=\"uib-daypicker\"></div>\n" +
      "  <div uib-monthpicker ng-switch-when=\"month\" tabindex=\"0\" class=\"uib-monthpicker\"></div>\n" +
      "  <div uib-yearpicker ng-switch-when=\"year\" tabindex=\"0\" class=\"uib-yearpicker\"></div>\n" +
      "</div>\n" +
      "");
  }]);

  angular.module("uib/template/datepicker/day.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/datepicker/day.html",
      "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
      "  <thead>\n" +
      "    <tr>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
      "      <th colspan=\"{{::5 + showWeeks}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
      "    </tr>\n" +
      "    <tr>\n" +
      "      <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n" +
      "      <th ng-repeat=\"label in ::labels track by $index\" class=\"text-center\"><small aria-label=\"{{::label.full}}\">{{::label.abbr}}</small></th>\n" +
      "    </tr>\n" +
      "  </thead>\n" +
      "  <tbody>\n" +
      "    <tr class=\"uib-weeks\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
      "      <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
      "      <td ng-repeat=\"dt in row\" class=\"uib-day text-center\" role=\"gridcell\"\n" +
      "        id=\"{{::dt.uid}}\"\n" +
      "        ng-class=\"::dt.customClass\">\n" +
      "        <button type=\"button\" class=\"btn btn-default btn-sm\"\n" +
      "          uib-is-class=\"\n" +
      "            'btn-info' for selectedDt,\n" +
      "            'active' for activeDt\n" +
      "            on dt\"\n" +
      "          ng-click=\"select(dt.date)\"\n" +
      "          ng-disabled=\"::dt.disabled\"\n" +
      "          tabindex=\"-1\"><span ng-class=\"::{'text-muted': dt.secondary, 'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
      "      </td>\n" +
      "    </tr>\n" +
      "  </tbody>\n" +
      "</table>\n" +
      "");
  }]);

  angular.module("uib/template/datepicker/month.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/datepicker/month.html",
      "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
      "  <thead>\n" +
      "    <tr>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
      "      <th colspan=\"{{::yearHeaderColspan}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
      "    </tr>\n" +
      "  </thead>\n" +
      "  <tbody>\n" +
      "    <tr class=\"uib-months\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
      "      <td ng-repeat=\"dt in row\" class=\"uib-month text-center\" role=\"gridcell\"\n" +
      "        id=\"{{::dt.uid}}\"\n" +
      "        ng-class=\"::dt.customClass\">\n" +
      "        <button type=\"button\" class=\"btn btn-default\"\n" +
      "          uib-is-class=\"\n" +
      "            'btn-info' for selectedDt,\n" +
      "            'active' for activeDt\n" +
      "            on dt\"\n" +
      "          ng-click=\"select(dt.date)\"\n" +
      "          ng-disabled=\"::dt.disabled\"\n" +
      "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
      "      </td>\n" +
      "    </tr>\n" +
      "  </tbody>\n" +
      "</table>\n" +
      "");
  }]);

  angular.module("uib/template/datepicker/year.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/datepicker/year.html",
      "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
      "  <thead>\n" +
      "    <tr>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
      "      <th colspan=\"{{::columns - 2}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
      "    </tr>\n" +
      "  </thead>\n" +
      "  <tbody>\n" +
      "    <tr class=\"uib-years\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
      "      <td ng-repeat=\"dt in row\" class=\"uib-year text-center\" role=\"gridcell\"\n" +
      "        id=\"{{::dt.uid}}\"\n" +
      "        ng-class=\"::dt.customClass\">\n" +
      "        <button type=\"button\" class=\"btn btn-default\"\n" +
      "          uib-is-class=\"\n" +
      "            'btn-info' for selectedDt,\n" +
      "            'active' for activeDt\n" +
      "            on dt\"\n" +
      "          ng-click=\"select(dt.date)\"\n" +
      "          ng-disabled=\"::dt.disabled\"\n" +
      "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
      "      </td>\n" +
      "    </tr>\n" +
      "  </tbody>\n" +
      "</table>\n" +
      "");
  }]);
  angular.module('ui.bootstrap.datepickerPopup').run(function () {
    !angular.$$csp().noInlineStyle && !angular.$$uibDatepickerpopupCss && angular.element(document).find('head').prepend('<style type="text/css">.uib-datepicker-popup.dropdown-menu{display:block;float:none;margin:0;}.uib-button-bar{padding:10px 9px 2px;}</style>');
    angular.$$uibDatepickerpopupCss = true;
  });
  angular.module('ui.bootstrap.datepicker').run(function () {
    !angular.$$csp().noInlineStyle && !angular.$$uibDatepickerCss && angular.element(document).find('head').prepend('<style type="text/css">.uib-datepicker .uib-title{width:100%;}.uib-day button,.uib-month button,.uib-year button{min-width:100%;}.uib-left,.uib-right{width:100%}</style>');
    angular.$$uibDatepickerCss = true;
  });
  angular.module('ui.bootstrap.position').run(function () {
    !angular.$$csp().noInlineStyle && !angular.$$uibPositionCss && angular.element(document).find('head').prepend('<style type="text/css">.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}</style>');
    angular.$$uibPositionCss = true;
  });
});
define('normalize',{});
define('css',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});

define('css!common/angular-bootstrap-datepicker-ppopup/css/ui-bootstrap-custom-2.1.3-csp',[],function(){});
define('common/angular-bootstrap-datepicker-ppopup/angular-bootstrap-datepicker-ppopup',['require','exports','module','./js/ui-bootstrap-custom-tpls-2.1.3','css!./css/ui-bootstrap-custom-2.1.3-csp.css'],function (require, exports, module) {
    //http://stackoverflow.com/questions/31096130/how-to-json-stringify-a-javascript-date-and-preserve-timezone
    Date.prototype.toJSON = function () {
        var timezoneOffsetInHours = -(this.getTimezoneOffset() / 60); //UTC minus local time
        var sign = timezoneOffsetInHours >= 0 ? '+' : '-';
        var leadingZero = (timezoneOffsetInHours < 10) ? '0' : '';

        //It's a bit unfortunate that we need to construct a new Date instance 
        //(we don't want _this_ Date instance to be modified)
        var correctedDate = new Date(this.getFullYear(), this.getMonth(),
            this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(),
            this.getMilliseconds());
        correctedDate.setHours(this.getHours() + timezoneOffsetInHours);
        var iso = correctedDate.toISOString().replace('Z', '');

        return iso + sign + leadingZero + Math.abs(timezoneOffsetInHours).toString() + ':00';
    }
    require('./js/ui-bootstrap-custom-tpls-2.1.3');
    require('css!./css/ui-bootstrap-custom-2.1.3-csp.css');
});
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 2.1.3 - 2016-08-25
 * License: MIT
 */
angular.module("ui.bootstrap-pagination", ["uib/template/pagination/pagination.html", "ui.bootstrap.pagination", "ui.bootstrap.paging", "ui.bootstrap.tabindex"]);
angular.module('ui.bootstrap.pagination', ['ui.bootstrap.paging', 'ui.bootstrap.tabindex'])
    .controller('UibPaginationController', ['$scope', '$attrs', '$parse', 'uibPaging', 'uibPaginationConfig', function ($scope, $attrs, $parse, uibPaging, uibPaginationConfig) {
        var ctrl = this;
        // Setup configuration parameters
        var maxSize = angular.isDefined($attrs.maxSize) ? $scope.$parent.$eval($attrs.maxSize) : uibPaginationConfig.maxSize,
            rotate = angular.isDefined($attrs.rotate) ? $scope.$parent.$eval($attrs.rotate) : uibPaginationConfig.rotate,
            forceEllipses = angular.isDefined($attrs.forceEllipses) ? $scope.$parent.$eval($attrs.forceEllipses) : uibPaginationConfig.forceEllipses,
            boundaryLinkNumbers = angular.isDefined($attrs.boundaryLinkNumbers) ? $scope.$parent.$eval($attrs.boundaryLinkNumbers) : uibPaginationConfig.boundaryLinkNumbers,
            pageLabel = angular.isDefined($attrs.pageLabel) ? function (idx) {
                return $scope.$parent.$eval($attrs.pageLabel, {
                    $page: idx
                });
            } : angular.identity;
        $scope.boundaryLinks = angular.isDefined($attrs.boundaryLinks) ? $scope.$parent.$eval($attrs.boundaryLinks) : uibPaginationConfig.boundaryLinks;
        $scope.directionLinks = angular.isDefined($attrs.directionLinks) ? $scope.$parent.$eval($attrs.directionLinks) : uibPaginationConfig.directionLinks;

        uibPaging.create(this, $scope, $attrs);

        if ($attrs.maxSize) {
            ctrl._watchers.push($scope.$parent.$watch($parse($attrs.maxSize), function (value) {
                maxSize = parseInt(value, 10);
                ctrl.render();
            }));
        }

        // Create page object used in template
        function makePage(number, text, isActive) {
            return {
                number: number,
                text: text,
                active: isActive
            };
        }

        function getPages(currentPage, totalPages) {
            var pages = [];

            // Default page limits
            var startPage = 1,
                endPage = totalPages;
            var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

            // recompute if maxSize
            if (isMaxSized) {
                if (rotate) {
                    // Current page is displayed in the middle of the visible ones
                    startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
                    endPage = startPage + maxSize - 1;

                    // Adjust if limit is exceeded
                    if (endPage > totalPages) {
                        endPage = totalPages;
                        startPage = endPage - maxSize + 1;
                    }
                } else {
                    // Visible pages are paginated with maxSize
                    startPage = (Math.ceil(currentPage / maxSize) - 1) * maxSize + 1;

                    // Adjust last page if limit is exceeded
                    endPage = Math.min(startPage + maxSize - 1, totalPages);
                }
            }

            // Add page number links
            for (var number = startPage; number <= endPage; number++) {
                var page = makePage(number, pageLabel(number), number === currentPage);
                pages.push(page);
            }

            // Add links to move between page sets
            if (isMaxSized && maxSize > 0 && (!rotate || forceEllipses || boundaryLinkNumbers)) {
                if (startPage > 1) {
                    if (!boundaryLinkNumbers || startPage > 3) { //need ellipsis for all options unless range is too close to beginning
                        var previousPageSet = makePage(startPage - 1, '...', false);
                        pages.unshift(previousPageSet);
                    }
                    if (boundaryLinkNumbers) {
                        if (startPage === 3) { //need to replace ellipsis when the buttons would be sequential
                            var secondPageLink = makePage(2, '2', false);
                            pages.unshift(secondPageLink);
                        }
                        //add the first page
                        var firstPageLink = makePage(1, '1', false);
                        pages.unshift(firstPageLink);
                    }
                }

                if (endPage < totalPages) {
                    if (!boundaryLinkNumbers || endPage < totalPages - 2) { //need ellipsis for all options unless range is too close to end
                        var nextPageSet = makePage(endPage + 1, '...', false);
                        pages.push(nextPageSet);
                    }
                    if (boundaryLinkNumbers) {
                        if (endPage === totalPages - 2) { //need to replace ellipsis when the buttons would be sequential
                            var secondToLastPageLink = makePage(totalPages - 1, totalPages - 1, false);
                            pages.push(secondToLastPageLink);
                        }
                        //add the last page
                        var lastPageLink = makePage(totalPages, totalPages, false);
                        pages.push(lastPageLink);
                    }
                }
            }
            return pages;
        }

        var originalRender = this.render;
        this.render = function () {
            originalRender();
            if ($scope.page > 0 && $scope.page <= $scope.totalPages) {
                $scope.pages = getPages($scope.page, $scope.totalPages);
            }
        };
    }])

    .constant('uibPaginationConfig', {
        itemsPerPage: 10,
        boundaryLinks: false,
        boundaryLinkNumbers: false,
        directionLinks: true,
        firstText: 'First',
        previousText: 'Previous',
        nextText: 'Next',
        lastText: 'Last',
        rotate: true,
        forceEllipses: false
    })

    .directive('uibPagination', ['$parse', 'uibPaginationConfig', function ($parse, uibPaginationConfig) {
        return {
            scope: {
                totalItems: '=',
                firstText: '@',
                previousText: '@',
                nextText: '@',
                lastText: '@',
                ngDisabled: '='
            },
            require: ['uibPagination', '?ngModel'],
            restrict: 'A',
            controller: 'UibPaginationController',
            controllerAs: 'pagination',
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'uib/template/pagination/pagination.html';
            },
            link: function (scope, element, attrs, ctrls) {
                element.addClass('pagination');
                var paginationCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                if (!ngModelCtrl) {
                    return; // do nothing if no ng-model
                }

                paginationCtrl.init(ngModelCtrl, uibPaginationConfig);
            }
        };
    }]);

angular.module('ui.bootstrap.paging', [])
    /**
     * Helper internal service for generating common controller code between the
     * pager and pagination components
     */
    .factory('uibPaging', ['$parse', function ($parse) {
        return {
            create: function (ctrl, $scope, $attrs) {
                ctrl.setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;
                ctrl.ngModelCtrl = {
                    $setViewValue: angular.noop
                }; // nullModelCtrl
                ctrl._watchers = [];

                ctrl.init = function (ngModelCtrl, config) {
                    ctrl.ngModelCtrl = ngModelCtrl;
                    ctrl.config = config;

                    ngModelCtrl.$render = function () {
                        ctrl.render();
                    };

                    if ($attrs.itemsPerPage) {
                        ctrl._watchers.push($scope.$parent.$watch($attrs.itemsPerPage, function (value) {
                            ctrl.itemsPerPage = parseInt(value, 10);
                            $scope.totalPages = ctrl.calculateTotalPages();
                            ctrl.updatePage();
                        }));
                    } else {
                        ctrl.itemsPerPage = config.itemsPerPage;
                    }

                    $scope.$watch('totalItems', function (newTotal, oldTotal) {
                        if (angular.isDefined(newTotal) || newTotal !== oldTotal) {
                            $scope.totalPages = ctrl.calculateTotalPages();
                            ctrl.updatePage();
                        }
                    });
                };

                ctrl.calculateTotalPages = function () {
                    var totalPages = ctrl.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / ctrl.itemsPerPage);
                    return Math.max(totalPages || 0, 1);
                };

                ctrl.render = function () {
                    $scope.page = parseInt(ctrl.ngModelCtrl.$viewValue, 10) || 1;
                };

                $scope.selectPage = function (page, evt) {
                    if (evt) {
                        evt.preventDefault();
                    }

                    var clickAllowed = !$scope.ngDisabled || !evt;
                    if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
                        if (evt && evt.target) {
                            evt.target.blur();
                        }
                        ctrl.ngModelCtrl.$setViewValue(page);
                        ctrl.ngModelCtrl.$render();
                    }
                };

                $scope.getText = function (key) {
                    return $scope[key + 'Text'] || ctrl.config[key + 'Text'];
                };

                $scope.noPrevious = function () {
                    return $scope.page === 1;
                };

                $scope.noNext = function () {
                    return $scope.page === $scope.totalPages;
                };

                ctrl.updatePage = function () {
                    ctrl.setNumPages($scope.$parent, $scope.totalPages); // Readonly variable

                    if ($scope.page > $scope.totalPages) {
                        $scope.selectPage($scope.totalPages);
                    } else {
                        ctrl.ngModelCtrl.$render();
                    }
                };

                $scope.$on('$destroy', function () {
                    while (ctrl._watchers.length) {
                        ctrl._watchers.shift()();
                    }
                });
            }
        };
    }]);

angular.module('ui.bootstrap.tabindex', [])
    .directive('uibTabindexToggle', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                attrs.$observe('disabled', function (disabled) {
                    attrs.$set('tabindex', disabled ? -1 : null);
                });
            }
        };
    });

angular.module("uib/template/pagination/pagination.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/pagination/pagination.html",
        "<li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-first\"><a href ng-click=\"selectPage(1, $event)\" ng-disabled=\"noPrevious()||ngDisabled\" uib-tabindex-toggle>{{::getText('first')}}</a></li>\n" +
        "<li ng-if=\"::directionLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-prev\"><a href ng-click=\"selectPage(page - 1, $event)\" ng-disabled=\"noPrevious()||ngDisabled\" uib-tabindex-toggle>{{::getText('previous')}}</a></li>\n" +
        "<li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active,disabled: ngDisabled&&!page.active}\" class=\"pagination-page\"><a href ng-click=\"selectPage(page.number, $event)\" ng-disabled=\"ngDisabled&&!page.active\" uib-tabindex-toggle>{{page.text}}</a></li>\n" +
        "<li ng-if=\"::directionLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-next\"><a href ng-click=\"selectPage(page + 1, $event)\" ng-disabled=\"noNext()||ngDisabled\" uib-tabindex-toggle>{{::getText('next')}}</a></li>\n" +
        "<li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-last\"><a href ng-click=\"selectPage(totalPages, $event)\" ng-disabled=\"noNext()||ngDisabled\" uib-tabindex-toggle>{{::getText('last')}}</a></li>\n" +
        "");
}]);
define("common/angular-pagination/js/pagination", function(){});


define('css!common/angular-pagination/css/page',[],function(){});
define('common/angular-pagination/index',['require','exports','module','./js/pagination','css!./css/page.css'],function(require, exports, module) {
    require('./js/pagination');
    require('css!./css/page.css');
});

/*!
 * ui-select
 * http://github.com/angular-ui/ui-select
 * Version: 0.19.8 - 2017-04-18T05:43:43.673Z
 * License: MIT
 */


(function () {
    "use strict";
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

        MAP: {
            91: "COMMAND", 8: "BACKSPACE", 9: "TAB", 13: "ENTER", 16: "SHIFT", 17: "CTRL", 18: "ALT", 19: "PAUSEBREAK", 20: "CAPSLOCK", 27: "ESC", 32: "SPACE", 33: "PAGE_UP", 34: "PAGE_DOWN", 35: "END", 36: "HOME", 37: "LEFT", 38: "UP", 39: "RIGHT", 40: "DOWN", 43: "+", 44: "PRINTSCREEN", 45: "INSERT", 46: "DELETE", 48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 59: ";", 61: "=", 65: "A", 66: "B", 67: "C", 68: "D", 69: "E", 70: "F", 71: "G", 72: "H", 73: "I", 74: "J", 75: "K", 76: "L", 77: "M", 78: "N", 79: "O", 80: "P", 81: "Q", 82: "R", 83: "S", 84: "T", 85: "U", 86: "V", 87: "W", 88: "X", 89: "Y", 90: "Z", 96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7", 104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111: "/", 112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12", 144: "NUMLOCK", 145: "SCROLLLOCK", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'"
        },

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
        },
        toSeparator: function (k) {
            var sep = { ENTER: "\n", TAB: "\t", SPACE: " " }[k];
            if (sep) return sep;
            // return undefined for special keys other than enter, tab or space.
            // no way to use them to cut strings.
            return KEY[k] ? undefined : k;
        }
    };

    function isNil(value) {
        return angular.isUndefined(value) || value === null;
    }

    /**
     * Add querySelectorAll() to jqLite.
     *
     * jqLite find() is limited to lookups by tag name.
     * TODO This will change with future versions of AngularJS, to be removed when this happens
     *
     * See jqLite.find - why not use querySelectorAll? https://github.com/angular/angular.js/issues/3586
     * See feat(jqLite): use querySelectorAll instead of getElementsByTagName in jqLite.find https://github.com/angular/angular.js/pull/3598
     */
    if (angular.element.prototype.querySelectorAll === undefined) {
        angular.element.prototype.querySelectorAll = function (selector) {
            return angular.element(this[0].querySelectorAll(selector));
        };
    }

    /**
     * Add closest() to jqLite.
     */
    if (angular.element.prototype.closest === undefined) {
        angular.element.prototype.closest = function (selector) {
            var elem = this[0];
            var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;

            while (elem) {
                if (matchesSelector.bind(elem)(selector)) {
                    return elem;
                } else {
                    elem = elem.parentElement;
                }
            }
            return false;
        };
    }

    var latestId = 0;

    var uis = angular.module('ui.select', [])

        .constant('uiSelectConfig', {
            theme: 'bootstrap',
            searchEnabled: true,
            sortable: false,
            placeholder: '', // Empty by default, like HTML tag <select>
            refreshDelay: 1000, // In milliseconds
            closeOnSelect: true,
            skipFocusser: false,
            dropdownPosition: 'auto',
            removeSelected: true,
            resetSearchInput: true,
            generateId: function () {
                return latestId++;
            },
            appendToBody: false,
            spinnerEnabled: false,
            spinnerClass: 'glyphicon glyphicon-refresh ui-select-spin',
            backspaceReset: true
        })

        // See Rename minErr and make it accessible from outside https://github.com/angular/angular.js/issues/6913
        .service('uiSelectMinErr', function () {
            var minErr = angular.$$minErr('ui.select');
            return function () {
                var error = minErr.apply(this, arguments);
                var message = error.message.replace(new RegExp('\nhttp://errors.angularjs.org/.*'), '');
                return new Error(message);
            };
        })

        // Recreates old behavior of ng-transclude. Used internally.
        .directive('uisTranscludeAppend', function () {
            return {
                link: function (scope, element, attrs, ctrl, transclude) {
                    transclude(scope, function (clone) {
                        element.append(clone);
                    });
                }
            };
        })

        /**
         * Highlights text that matches $select.search.
         *
         * Taken from AngularUI Bootstrap Typeahead
         * See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L340
         */
        .filter('highlight', function () {
            function escapeRegexp(queryToEscape) {
                return ('' + queryToEscape).replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
            }

            return function (matchItem, query) {
                return query && matchItem ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="ui-select-highlight">$&</span>') : matchItem;
            };
        })

        /**
         * A read-only equivalent of jQuery's offset function: http://api.jquery.com/offset/
         *
         * Taken from AngularUI Bootstrap Position:
         * See https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js#L70
         */
        .factory('uisOffset',
            ['$document', '$window',
                function ($document, $window) {

                    return function (element) {
                        var boundingClientRect = element[0].getBoundingClientRect();
                        return {
                            width: boundingClientRect.width || element.prop('offsetWidth'),
                            height: boundingClientRect.height || element.prop('offsetHeight'),
                            top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
                            left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
                        };
                    };
                }]);

    uis.directive('uiSelectChoices',
        ['uiSelectConfig', 'uisRepeatParser', 'uiSelectMinErr', '$compile', '$window',
            function (uiSelectConfig, RepeatParser, uiSelectMinErr, $compile, $window) {

                return {
                    restrict: 'EA',
                    require: '^uiSelect',
                    replace: true,
                    transclude: true,
                    templateUrl: function (tElement) {
                        // Needed so the uiSelect can detect the transcluded content
                        tElement.addClass('ui-select-choices');

                        // Gets theme attribute from parent (ui-select)
                        var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
                        return theme + '/choices.tpl.html';
                    },

                    compile: function (tElement, tAttrs) {

                        if (!tAttrs.repeat) throw uiSelectMinErr('repeat', "Expected 'repeat' expression.");

                        // var repeat = RepeatParser.parse(attrs.repeat);
                        var groupByExp = tAttrs.groupBy;
                        var groupFilterExp = tAttrs.groupFilter;

                        if (groupByExp) {
                            var groups = tElement.querySelectorAll('.ui-select-choices-group');
                            if (groups.length !== 1) throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-group but got '{0}'.", groups.length);
                            groups.attr('ng-repeat', RepeatParser.getGroupNgRepeatExpression());
                        }

                        var parserResult = RepeatParser.parse(tAttrs.repeat);

                        var choices = tElement.querySelectorAll('.ui-select-choices-row');
                        if (choices.length !== 1) {
                            throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-row but got '{0}'.", choices.length);
                        }

                        choices.attr('ng-repeat', parserResult.repeatExpression(groupByExp))
                            .attr('ng-if', '$select.open'); //Prevent unnecessary watches when dropdown is closed


                        var rowsInner = tElement.querySelectorAll('.ui-select-choices-row-inner');
                        if (rowsInner.length !== 1) {
                            throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-row-inner but got '{0}'.", rowsInner.length);
                        }
                        rowsInner.attr('uis-transclude-append', ''); //Adding uisTranscludeAppend directive to row element after choices element has ngRepeat

                        // If IE8 then need to target rowsInner to apply the ng-click attr as choices will not capture the event.
                        var clickTarget = $window.document.addEventListener ? choices : rowsInner;
                        clickTarget.attr('ng-click', '$select.select(' + parserResult.itemName + ',$select.skipFocusser,$event)');

                        return function link(scope, element, attrs, $select) {


                            $select.parseRepeatAttr(attrs.repeat, groupByExp, groupFilterExp); //Result ready at $select.parserResult
                            $select.disableChoiceExpression = attrs.uiDisableChoice;
                            $select.onHighlightCallback = attrs.onHighlight;
                            $select.minimumInputLength = parseInt(attrs.minimumInputLength) || 0;
                            $select.dropdownPosition = attrs.position ? attrs.position.toLowerCase() : uiSelectConfig.dropdownPosition;

                            scope.$watch('$select.search', function (newValue) {
                                if (newValue && !$select.open && $select.multiple) $select.activate(false, true);
                                $select.activeIndex = $select.tagging.isActivated ? -1 : 0;
                                if (!attrs.minimumInputLength || $select.search.length >= attrs.minimumInputLength) {
                                    $select.refresh(attrs.refresh);
                                } else {
                                    $select.items = [];
                                }
                            });

                            attrs.$observe('refreshDelay', function () {
                                // $eval() is needed otherwise we get a string instead of a number
                                var refreshDelay = scope.$eval(attrs.refreshDelay);
                                $select.refreshDelay = refreshDelay !== undefined ? refreshDelay : uiSelectConfig.refreshDelay;
                            });

                            scope.$watch('$select.open', function (open) {
                                if (open) {
                                    tElement.attr('role', 'listbox');
                                    $select.refresh(attrs.refresh);
                                } else {
                                    element.removeAttr('role');
                                }
                            });
                        };
                    }
                };
            }]);

    /**
     * Contains ui-select "intelligence".
     *
     * The goal is to limit dependency on the DOM whenever possible and
     * put as much logic in the controller (instead of the link functions) as possible so it can be easily tested.
     */
    uis.controller('uiSelectCtrl',
        ['$scope', '$element', '$timeout', '$filter', '$$uisDebounce', 'uisRepeatParser', 'uiSelectMinErr', 'uiSelectConfig', '$parse', '$injector', '$window',
            function ($scope, $element, $timeout, $filter, $$uisDebounce, RepeatParser, uiSelectMinErr, uiSelectConfig, $parse, $injector, $window) {

                var ctrl = this;

                var EMPTY_SEARCH = '';

                ctrl.placeholder = uiSelectConfig.placeholder;
                ctrl.searchEnabled = uiSelectConfig.searchEnabled;
                ctrl.sortable = uiSelectConfig.sortable;
                ctrl.refreshDelay = uiSelectConfig.refreshDelay;
                ctrl.paste = uiSelectConfig.paste;
                ctrl.resetSearchInput = uiSelectConfig.resetSearchInput;
                ctrl.refreshing = false;
                ctrl.spinnerEnabled = uiSelectConfig.spinnerEnabled;
                ctrl.spinnerClass = uiSelectConfig.spinnerClass;
                ctrl.removeSelected = uiSelectConfig.removeSelected; //If selected item(s) should be removed from dropdown list
                ctrl.closeOnSelect = true; //Initialized inside uiSelect directive link function
                ctrl.skipFocusser = false; //Set to true to avoid returning focus to ctrl when item is selected
                ctrl.search = EMPTY_SEARCH;

                ctrl.activeIndex = 0; //Dropdown of choices
                ctrl.items = []; //All available choices

                ctrl.open = false;
                ctrl.focus = false;
                ctrl.disabled = false;
                ctrl.selected = undefined;

                ctrl.dropdownPosition = 'auto';

                ctrl.focusser = undefined; //Reference to input element used to handle focus events
                ctrl.multiple = undefined; // Initialized inside uiSelect directive link function
                ctrl.disableChoiceExpression = undefined; // Initialized inside uiSelectChoices directive link function
                ctrl.tagging = { isActivated: false, fct: undefined };
                ctrl.taggingTokens = { isActivated: false, tokens: undefined };
                ctrl.lockChoiceExpression = undefined; // Initialized inside uiSelectMatch directive link function
                ctrl.clickTriggeredSelect = false;
                ctrl.$filter = $filter;
                ctrl.$element = $element;

                // Use $injector to check for $animate and store a reference to it
                ctrl.$animate = (function () {
                    try {
                        return $injector.get('$animate');
                    } catch (err) {
                        // $animate does not exist
                        return null;
                    }
                })();

                ctrl.searchInput = $element.querySelectorAll('input.ui-select-search');
                if (ctrl.searchInput.length !== 1) {
                    throw uiSelectMinErr('searchInput', "Expected 1 input.ui-select-search but got '{0}'.", ctrl.searchInput.length);
                }

                ctrl.isEmpty = function () {
                    return isNil(ctrl.selected) || ctrl.selected === '' || (ctrl.multiple && ctrl.selected.length === 0);
                };

                function _findIndex(collection, predicate, thisArg) {
                    if (collection.findIndex) {
                        return collection.findIndex(predicate, thisArg);
                    } else {
                        var list = Object(collection);
                        var length = list.length >>> 0;
                        var value;

                        for (var i = 0; i < length; i++) {
                            value = list[i];
                            if (predicate.call(thisArg, value, i, list)) {
                                return i;
                            }
                        }
                        return -1;
                    }
                }

                // Most of the time the user does not want to empty the search input when in typeahead mode
                function _resetSearchInput() {
                    if (ctrl.resetSearchInput) {
                        ctrl.search = EMPTY_SEARCH;
                        //reset activeIndex
                        if (ctrl.selected && ctrl.items.length && !ctrl.multiple) {
                            ctrl.activeIndex = _findIndex(ctrl.items, function (item) {
                                return angular.equals(this, item);
                            }, ctrl.selected);
                        }
                    }
                }

                function _groupsFilter(groups, groupNames) {
                    var i, j, result = [];
                    for (i = 0; i < groupNames.length; i++) {
                        for (j = 0; j < groups.length; j++) {
                            if (groups[j].name == [groupNames[i]]) {
                                result.push(groups[j]);
                            }
                        }
                    }
                    return result;
                }

                // When the user clicks on ui-select, displays the dropdown list
                ctrl.activate = function (initSearchValue, avoidReset) {
                    if (!ctrl.disabled && !ctrl.open) {
                        if (!avoidReset) _resetSearchInput();

                        $scope.$broadcast('uis:activate');
                        ctrl.open = true;
                        ctrl.activeIndex = ctrl.activeIndex >= ctrl.items.length ? 0 : ctrl.activeIndex;
                        // ensure that the index is set to zero for tagging variants
                        // that where first option is auto-selected
                        if (ctrl.activeIndex === -1 && ctrl.taggingLabel !== false) {
                            ctrl.activeIndex = 0;
                        }

                        var container = $element.querySelectorAll('.ui-select-choices-content');
                        var searchInput = $element.querySelectorAll('.ui-select-search');
                        if (ctrl.$animate && ctrl.$animate.on && ctrl.$animate.enabled(container[0])) {
                            var animateHandler = function (elem, phase) {
                                if (phase === 'start' && ctrl.items.length === 0) {
                                    // Only focus input after the animation has finished
                                    ctrl.$animate.off('removeClass', searchInput[0], animateHandler);
                                    $timeout(function () {
                                        ctrl.focusSearchInput(initSearchValue);
                                    });
                                } else if (phase === 'close') {
                                    // Only focus input after the animation has finished
                                    ctrl.$animate.off('enter', container[0], animateHandler);
                                    $timeout(function () {
                                        ctrl.focusSearchInput(initSearchValue);
                                    });
                                }
                            };

                            if (ctrl.items.length > 0) {
                                ctrl.$animate.on('enter', container[0], animateHandler);
                            } else {
                                ctrl.$animate.on('removeClass', searchInput[0], animateHandler);
                            }
                        } else {
                            $timeout(function () {
                                ctrl.focusSearchInput(initSearchValue);
                                if (!ctrl.tagging.isActivated && ctrl.items.length > 1) {
                                    _ensureHighlightVisible();
                                }
                            });
                        }
                    }
                    else if (ctrl.open && !ctrl.searchEnabled) {
                        // Close the selection if we don't have search enabled, and we click on the select again
                        ctrl.close();
                    }
                };

                ctrl.focusSearchInput = function (initSearchValue) {
                    ctrl.search = initSearchValue || ctrl.search;
                    ctrl.searchInput[0].focus();
                };

                ctrl.findGroupByName = function (name) {
                    return ctrl.groups && ctrl.groups.filter(function (group) {
                        return group.name === name;
                    })[0];
                };

                ctrl.parseRepeatAttr = function (repeatAttr, groupByExp, groupFilterExp) {
                    function updateGroups(items) {
                        var groupFn = $scope.$eval(groupByExp);
                        ctrl.groups = [];
                        angular.forEach(items, function (item) {
                            var groupName = angular.isFunction(groupFn) ? groupFn(item) : item[groupFn];
                            var group = ctrl.findGroupByName(groupName);
                            if (group) {
                                group.items.push(item);
                            }
                            else {
                                ctrl.groups.push({ name: groupName, items: [item] });
                            }
                        });
                        if (groupFilterExp) {
                            var groupFilterFn = $scope.$eval(groupFilterExp);
                            if (angular.isFunction(groupFilterFn)) {
                                ctrl.groups = groupFilterFn(ctrl.groups);
                            } else if (angular.isArray(groupFilterFn)) {
                                ctrl.groups = _groupsFilter(ctrl.groups, groupFilterFn);
                            }
                        }
                        ctrl.items = [];
                        ctrl.groups.forEach(function (group) {
                            ctrl.items = ctrl.items.concat(group.items);
                        });
                    }

                    function setPlainItems(items) {
                        ctrl.items = items || [];
                    }

                    ctrl.setItemsFn = groupByExp ? updateGroups : setPlainItems;

                    ctrl.parserResult = RepeatParser.parse(repeatAttr);

                    ctrl.isGrouped = !!groupByExp;
                    ctrl.itemProperty = ctrl.parserResult.itemName;

                    //If collection is an Object, convert it to Array

                    var originalSource = ctrl.parserResult.source;

                    //When an object is used as source, we better create an array and use it as 'source'
                    var createArrayFromObject = function () {
                        var origSrc = originalSource($scope);
                        $scope.$uisSource = Object.keys(origSrc).map(function (v) {
                            var result = {};
                            result[ctrl.parserResult.keyName] = v;
                            result.value = origSrc[v];
                            return result;
                        });
                    };

                    if (ctrl.parserResult.keyName) { // Check for (key,value) syntax
                        createArrayFromObject();
                        ctrl.parserResult.source = $parse('$uisSource' + ctrl.parserResult.filters);
                        $scope.$watch(originalSource, function (newVal, oldVal) {
                            if (newVal !== oldVal) createArrayFromObject();
                        }, true);
                    }

                    ctrl.refreshItems = function (data) {
                        data = data || ctrl.parserResult.source($scope);
                        var selectedItems = ctrl.selected;
                        //TODO should implement for single mode removeSelected
                        if (ctrl.isEmpty() || (angular.isArray(selectedItems) && !selectedItems.length) || !ctrl.multiple || !ctrl.removeSelected) {
                            ctrl.setItemsFn(data);
                        } else {
                            if (data !== undefined && data !== null) {
                                var filteredItems = data.filter(function (i) {
                                    return angular.isArray(selectedItems) ? selectedItems.every(function (selectedItem) {
                                        return !angular.equals(i, selectedItem);
                                    }) : !angular.equals(i, selectedItems);
                                });
                                ctrl.setItemsFn(filteredItems);
                            }
                        }
                        if (ctrl.dropdownPosition === 'auto' || ctrl.dropdownPosition === 'up') {
                            $scope.calculateDropdownPos();
                        }
                        $scope.$broadcast('uis:refresh');
                    };

                    // See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L259
                    $scope.$watchCollection(ctrl.parserResult.source, function (items) {
                        if (items === undefined || items === null) {
                            // If the user specifies undefined or null => reset the collection
                            // Special case: items can be undefined if the user did not initialized the collection on the scope
                            // i.e $scope.addresses = [] is missing
                            ctrl.items = [];
                        } else {
                            if (!angular.isArray(items)) {
                                throw uiSelectMinErr('items', "Expected an array but got '{0}'.", items);
                            } else {
                                //Remove already selected items (ex: while searching)
                                //TODO Should add a test
                                ctrl.refreshItems(items);

                                //update the view value with fresh data from items, if there is a valid model value
                                if (angular.isDefined(ctrl.ngModel.$modelValue)) {
                                    ctrl.ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
                                }
                            }
                        }
                    });

                };

                var _refreshDelayPromise;

                /**
                 * Typeahead mode: lets the user refresh the collection using his own function.
                 *
                 * See Expose $select.search for external / remote filtering https://github.com/angular-ui/ui-select/pull/31
                 */
                ctrl.refresh = function (refreshAttr) {
                    if (refreshAttr !== undefined) {
                        // Debounce
                        // See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L155
                        // FYI AngularStrap typeahead does not have debouncing: https://github.com/mgcrea/angular-strap/blob/v2.0.0-rc.4/src/typeahead/typeahead.js#L177
                        if (_refreshDelayPromise) {
                            $timeout.cancel(_refreshDelayPromise);
                        }
                        _refreshDelayPromise = $timeout(function () {
                            if ($scope.$select.search.length >= $scope.$select.minimumInputLength) {
                                var refreshPromise = $scope.$eval(refreshAttr);
                                if (refreshPromise && angular.isFunction(refreshPromise.then) && !ctrl.refreshing) {
                                    ctrl.refreshing = true;
                                    refreshPromise.finally(function () {
                                        ctrl.refreshing = false;
                                    });
                                }
                            }
                        }, ctrl.refreshDelay);
                    }
                };

                ctrl.isActive = function (itemScope) {

                    return false
                    // if (!ctrl.open) {
                    //     return false;
                    // }
                    // var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
                    // var isActive = itemIndex == ctrl.activeIndex;

                    // if (!isActive || itemIndex < 0) {
                    //     return false;
                    // }

                    // if (isActive && !angular.isUndefined(ctrl.onHighlightCallback)) {
                    //     itemScope.$eval(ctrl.onHighlightCallback);
                    // }

                    // return isActive;
                };

                var _isItemSelected = function (item) {
                    return (ctrl.selected && angular.isArray(ctrl.selected) &&
                        ctrl.selected.filter(function (selection) { return angular.equals(selection, item); }).length > 0);
                };

                var disabledItems = [];

                function _updateItemDisabled(item, isDisabled) {
                    var disabledItemIndex = disabledItems.indexOf(item);
                    if (isDisabled && disabledItemIndex === -1) {
                        disabledItems.push(item);
                    }

                    if (!isDisabled && disabledItemIndex > -1) {
                        disabledItems.splice(disabledItemIndex, 1);
                    }
                }

                function _isItemDisabled(item) {
                    return disabledItems.indexOf(item) > -1;
                }

                ctrl.isDisabled = function (itemScope) {

                    if (!ctrl.open) return;

                    var item = itemScope[ctrl.itemProperty];
                    var itemIndex = ctrl.items.indexOf(item);
                    var isDisabled = false;

                    if (itemIndex >= 0 && (angular.isDefined(ctrl.disableChoiceExpression) || ctrl.multiple)) {

                        if (item.isTag) return false;

                        if (ctrl.multiple) {
                            isDisabled = _isItemSelected(item);
                        }

                        if (!isDisabled && angular.isDefined(ctrl.disableChoiceExpression)) {
                            isDisabled = !!(itemScope.$eval(ctrl.disableChoiceExpression));
                        }

                        _updateItemDisabled(item, isDisabled);
                    }

                    return isDisabled;
                };


                // When the user selects an item with ENTER or clicks the dropdown
                ctrl.select = function (item, skipFocusser, $event) {
                    if (isNil(item) || !_isItemDisabled(item)) {

                        if (!ctrl.items && !ctrl.search && !ctrl.tagging.isActivated) return;

                        if (!item || !_isItemDisabled(item)) {
                            // if click is made on existing item, prevent from tagging, ctrl.search does not matter
                            ctrl.clickTriggeredSelect = false;
                            if ($event && ($event.type === 'click' || $event.type === 'touchend') && item)
                                ctrl.clickTriggeredSelect = true;

                            if (ctrl.tagging.isActivated && ctrl.clickTriggeredSelect === false) {
                                // if taggingLabel is disabled and item is undefined we pull from ctrl.search
                                if (ctrl.taggingLabel === false) {
                                    if (ctrl.activeIndex < 0) {
                                        if (item === undefined) {
                                            item = ctrl.tagging.fct !== undefined ? ctrl.tagging.fct(ctrl.search) : ctrl.search;
                                        }
                                        if (!item || angular.equals(ctrl.items[0], item)) {
                                            return;
                                        }
                                    } else {
                                        // keyboard nav happened first, user selected from dropdown
                                        item = ctrl.items[ctrl.activeIndex];
                                    }
                                } else {
                                    // tagging always operates at index zero, taggingLabel === false pushes
                                    // the ctrl.search value without having it injected
                                    if (ctrl.activeIndex === 0) {
                                        // ctrl.tagging pushes items to ctrl.items, so we only have empty val
                                        // for `item` if it is a detected duplicate
                                        if (item === undefined) return;

                                        // create new item on the fly if we don't already have one;
                                        // use tagging function if we have one
                                        if (ctrl.tagging.fct !== undefined && typeof item === 'string') {
                                            item = ctrl.tagging.fct(item);
                                            if (!item) return;
                                            // if item type is 'string', apply the tagging label
                                        } else if (typeof item === 'string') {
                                            // trim the trailing space
                                            item = item.replace(ctrl.taggingLabel, '').trim();
                                        }
                                    }
                                }
                                // search ctrl.selected for dupes potentially caused by tagging and return early if found
                                if (_isItemSelected(item)) {
                                    ctrl.close(skipFocusser);
                                    return;
                                }
                            }
                            _resetSearchInput();
                            $scope.$broadcast('uis:select', item);

                            if (ctrl.closeOnSelect) {
                                ctrl.close(skipFocusser);
                            }
                        }
                    }
                };

                // Closes the dropdown
                ctrl.close = function (skipFocusser) {
                    if (!ctrl.open) return;
                    if (ctrl.ngModel && ctrl.ngModel.$setTouched) ctrl.ngModel.$setTouched();
                    ctrl.open = false;
                    _resetSearchInput();
                    $scope.$broadcast('uis:close', skipFocusser);

                };

                ctrl.setFocus = function () {
                    if (!ctrl.focus) ctrl.focusInput[0].focus();
                };

                ctrl.clear = function ($event) {
                    ctrl.select(null);
                    $event.stopPropagation();
                    $timeout(function () {
                        ctrl.focusser[0].focus();
                    }, 0, false);
                };

                // Toggle dropdown
                ctrl.toggle = function (e) {
                    if (ctrl.open) {
                        ctrl.close();
                        e.preventDefault();
                        e.stopPropagation();
                    } else {
                        ctrl.activate();
                    }
                };

                // Set default function for locked choices - avoids unnecessary
                // logic if functionality is not being used
                ctrl.isLocked = function () {
                    return false;
                };

                $scope.$watch(function () {
                    return angular.isDefined(ctrl.lockChoiceExpression) && ctrl.lockChoiceExpression !== "";
                }, _initaliseLockedChoices);

                function _initaliseLockedChoices(doInitalise) {
                    if (!doInitalise) return;

                    var lockedItems = [];

                    function _updateItemLocked(item, isLocked) {
                        var lockedItemIndex = lockedItems.indexOf(item);
                        if (isLocked && lockedItemIndex === -1) {
                            lockedItems.push(item);
                        }

                        if (!isLocked && lockedItemIndex > -1) {
                            lockedItems.splice(lockedItemIndex, 1);
                        }
                    }

                    function _isItemlocked(item) {
                        return lockedItems.indexOf(item) > -1;
                    }

                    ctrl.isLocked = function (itemScope, itemIndex) {
                        var isLocked = false,
                            item = ctrl.selected[itemIndex];

                        if (item) {
                            if (itemScope) {
                                isLocked = !!(itemScope.$eval(ctrl.lockChoiceExpression));
                                _updateItemLocked(item, isLocked);
                            } else {
                                isLocked = _isItemlocked(item);
                            }
                        }

                        return isLocked;
                    };
                }


                var sizeWatch = null;
                var updaterScheduled = false;
                ctrl.sizeSearchInput = function () {

                    ctrl.searchInput.css('display', 'inline-block');
                    var input = ctrl.searchInput[0],
                        container = ctrl.$element[0],
                        calculateContainerWidth = function () {
                            // Return the container width only if the search input is visible
                            return container.clientWidth * !!input.offsetParent;
                        },
                        updateIfVisible = function (containerWidth) {
                            if (containerWidth === 0) {
                                return false;
                            }
                            var inputWidth = containerWidth - input.offsetLeft - 20;
                            if (inputWidth < 50) inputWidth = containerWidth;
                            ctrl.searchInput.css('width', inputWidth + 'px');
                            return true;
                        };

                    ctrl.searchInput.css('width', '10px');
                    $timeout(function () { //Give tags time to render correctly
                        if (sizeWatch === null && !updateIfVisible(calculateContainerWidth())) {
                            sizeWatch = $scope.$watch(function () {
                                if (!updaterScheduled) {
                                    updaterScheduled = true;
                                    $scope.$$postDigest(function () {
                                        updaterScheduled = false;
                                        if (updateIfVisible(calculateContainerWidth())) {
                                            sizeWatch();
                                            sizeWatch = null;
                                        }
                                    });
                                }
                            }, angular.noop);
                        }
                    });
                };

                function _handleDropDownSelection(key) {
                    var processed = true;
                    switch (key) {
                        case KEY.DOWN:
                            if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
                            else if (ctrl.activeIndex < ctrl.items.length - 1) {
                                var idx = ++ctrl.activeIndex;
                                while (_isItemDisabled(ctrl.items[idx]) && idx < ctrl.items.length) {
                                    ctrl.activeIndex = ++idx;
                                }
                            }
                            break;
                        case KEY.UP:
                            var minActiveIndex = (ctrl.search.length === 0 && ctrl.tagging.isActivated) ? -1 : 0;
                            if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
                            else if (ctrl.activeIndex > minActiveIndex) {
                                var idxmin = --ctrl.activeIndex;
                                while (_isItemDisabled(ctrl.items[idxmin]) && idxmin > minActiveIndex) {
                                    ctrl.activeIndex = --idxmin;
                                }
                            }
                            break;
                        case KEY.TAB:
                            if (!ctrl.multiple || ctrl.open) ctrl.select(ctrl.items[ctrl.activeIndex], true);
                            break;
                        case KEY.ENTER:
                            if (ctrl.open && (ctrl.tagging.isActivated || ctrl.activeIndex >= 0)) {
                                ctrl.select(ctrl.items[ctrl.activeIndex], ctrl.skipFocusser); // Make sure at least one dropdown item is highlighted before adding if not in tagging mode
                            } else {
                                ctrl.activate(false, true); //In case its the search input in 'multiple' mode
                            }
                            break;
                        case KEY.ESC:
                            ctrl.close();
                            break;
                        default:
                            processed = false;
                    }
                    return processed;
                }

                // Bind to keyboard shortcuts
                ctrl.searchInput.on('keydown', function (e) {

                    var key = e.which;

                    if (~[KEY.ENTER, KEY.ESC].indexOf(key)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    $scope.$apply(function () {

                        var tagged = false;

                        if (ctrl.items.length > 0 || ctrl.tagging.isActivated) {
                            if (!_handleDropDownSelection(key) && !ctrl.searchEnabled) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (ctrl.taggingTokens.isActivated) {
                                for (var i = 0; i < ctrl.taggingTokens.tokens.length; i++) {
                                    if (ctrl.taggingTokens.tokens[i] === KEY.MAP[e.keyCode]) {
                                        // make sure there is a new value to push via tagging
                                        if (ctrl.search.length > 0) {
                                            tagged = true;
                                        }
                                    }
                                }
                                if (tagged) {
                                    $timeout(function () {
                                        ctrl.searchInput.triggerHandler('tagged');
                                        var newItem = ctrl.search.replace(KEY.MAP[e.keyCode], '').trim();
                                        if (ctrl.tagging.fct) {
                                            newItem = ctrl.tagging.fct(newItem);
                                        }
                                        if (newItem) ctrl.select(newItem, true);
                                    });
                                }
                            }
                        }

                    });

                    if (KEY.isVerticalMovement(key) && ctrl.items.length > 0) {
                        _ensureHighlightVisible();
                    }

                    if (key === KEY.ENTER || key === KEY.ESC) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                });

                ctrl.searchInput.on('paste', function (e) {
                    var data;

                    if (window.clipboardData && window.clipboardData.getData) { // IE
                        data = window.clipboardData.getData('Text');
                    } else {
                        data = (e.originalEvent || e).clipboardData.getData('text/plain');
                    }

                    // Prepend the current input field text to the paste buffer.
                    data = ctrl.search + data;

                    if (data && data.length > 0) {
                        // If tagging try to split by tokens and add items
                        if (ctrl.taggingTokens.isActivated) {
                            var items = [];
                            for (var i = 0; i < ctrl.taggingTokens.tokens.length; i++) {  // split by first token that is contained in data
                                var separator = KEY.toSeparator(ctrl.taggingTokens.tokens[i]) || ctrl.taggingTokens.tokens[i];
                                if (data.indexOf(separator) > -1) {
                                    items = data.split(separator);
                                    break;  // only split by one token
                                }
                            }
                            if (items.length === 0) {
                                items = [data];
                            }
                            var oldsearch = ctrl.search;
                            angular.forEach(items, function (item) {
                                var newItem = ctrl.tagging.fct ? ctrl.tagging.fct(item) : item;
                                if (newItem) {
                                    ctrl.select(newItem, true);
                                }
                            });
                            ctrl.search = oldsearch || EMPTY_SEARCH;
                            e.preventDefault();
                            e.stopPropagation();
                        } else if (ctrl.paste) {
                            ctrl.paste(data);
                            ctrl.search = EMPTY_SEARCH;
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                });

                ctrl.searchInput.on('tagged', function () {
                    $timeout(function () {
                        _resetSearchInput();
                    });
                });

                // See https://github.com/ivaynberg/select2/blob/3.4.6/select2.js#L1431
                function _ensureHighlightVisible() {
                    var container = $element.querySelectorAll('.ui-select-choices-content');
                    var choices = container.querySelectorAll('.ui-select-choices-row');
                    if (choices.length < 1) {
                        throw uiSelectMinErr('choices', "Expected multiple .ui-select-choices-row but got '{0}'.", choices.length);
                    }

                    if (ctrl.activeIndex < 0) {
                        return;
                    }

                    var highlighted = choices[ctrl.activeIndex];
                    var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
                    var height = container[0].offsetHeight;

                    if (posY > height) {
                        container[0].scrollTop += posY - height;
                    } else if (posY < highlighted.clientHeight) {
                        if (ctrl.isGrouped && ctrl.activeIndex === 0)
                            container[0].scrollTop = 0; //To make group header visible when going all the way up
                        else
                            container[0].scrollTop -= highlighted.clientHeight - posY;
                    }
                }

                var onResize = $$uisDebounce(function () {
                    ctrl.sizeSearchInput();
                }, 50);

                angular.element($window).bind('resize', onResize);

                $scope.$on('$destroy', function () {
                    ctrl.searchInput.off('keyup keydown tagged blur paste');
                    angular.element($window).off('resize', onResize);
                });

                $scope.$watch('$select.activeIndex', function (activeIndex) {
                    if (activeIndex)
                        $element.find('input').attr(
                            'aria-activedescendant',
                            'ui-select-choices-row-' + ctrl.generatedId + '-' + activeIndex);
                });

                $scope.$watch('$select.open', function (open) {
                    if (!open)
                        $element.find('input').removeAttr('aria-activedescendant');
                });
            }]);

    uis.directive('uiSelect',
        ['$document', 'uiSelectConfig', 'uiSelectMinErr', 'uisOffset', '$compile', '$parse', '$timeout',
            function ($document, uiSelectConfig, uiSelectMinErr, uisOffset, $compile, $parse, $timeout) {

                return {
                    restrict: 'EA',
                    templateUrl: function (tElement, tAttrs) {
                        var theme = tAttrs.theme || uiSelectConfig.theme;
                        return theme + (angular.isDefined(tAttrs.multiple) ? '/select-multiple.tpl.html' : '/select.tpl.html');
                    },
                    replace: true,
                    transclude: true,
                    require: ['uiSelect', '^ngModel'],
                    scope: true,

                    controller: 'uiSelectCtrl',
                    controllerAs: '$select',
                    compile: function (tElement, tAttrs) {

                        // Allow setting ngClass on uiSelect
                        var match = /{(.*)}\s*{(.*)}/.exec(tAttrs.ngClass);
                        if (match) {
                            var combined = '{' + match[1] + ', ' + match[2] + '}';
                            tAttrs.ngClass = combined;
                            tElement.attr('ng-class', combined);
                        }

                        //Multiple or Single depending if multiple attribute presence
                        if (angular.isDefined(tAttrs.multiple))
                            tElement.append('<ui-select-multiple/>').removeAttr('multiple');
                        else
                            tElement.append('<ui-select-single/>');

                        if (tAttrs.inputId)
                            tElement.querySelectorAll('input.ui-select-search')[0].id = tAttrs.inputId;

                        return function (scope, element, attrs, ctrls, transcludeFn) {

                            var $select = ctrls[0];
                            var ngModel = ctrls[1];

                            $select.generatedId = uiSelectConfig.generateId();
                            $select.baseTitle = attrs.title || 'Select box';
                            $select.focusserTitle = $select.baseTitle + ' focus';
                            $select.focusserId = 'focusser-' + $select.generatedId;

                            $select.closeOnSelect = function () {
                                if (angular.isDefined(attrs.closeOnSelect)) {
                                    return $parse(attrs.closeOnSelect)();
                                } else {
                                    return uiSelectConfig.closeOnSelect;
                                }
                            }();

                            scope.$watch('skipFocusser', function () {
                                var skipFocusser = scope.$eval(attrs.skipFocusser);
                                $select.skipFocusser = skipFocusser !== undefined ? skipFocusser : uiSelectConfig.skipFocusser;
                            });

                            $select.onSelectCallback = $parse(attrs.onSelect);
                            $select.onRemoveCallback = $parse(attrs.onRemove);

                            //Set reference to ngModel from uiSelectCtrl
                            $select.ngModel = ngModel;

                            $select.choiceGrouped = function (group) {
                                return $select.isGrouped && group && group.name;
                            };

                            if (attrs.tabindex) {
                                attrs.$observe('tabindex', function (value) {
                                    $select.focusInput.attr('tabindex', value);
                                    element.removeAttr('tabindex');
                                });
                            }

                            scope.$watch(function () { return scope.$eval(attrs.searchEnabled); }, function (newVal) {
                                $select.searchEnabled = newVal !== undefined ? newVal : uiSelectConfig.searchEnabled;
                            });

                            scope.$watch('sortable', function () {
                                var sortable = scope.$eval(attrs.sortable);
                                $select.sortable = sortable !== undefined ? sortable : uiSelectConfig.sortable;
                            });

                            attrs.$observe('backspaceReset', function () {
                                // $eval() is needed otherwise we get a string instead of a boolean
                                var backspaceReset = scope.$eval(attrs.backspaceReset);
                                $select.backspaceReset = backspaceReset !== undefined ? backspaceReset : true;
                            });

                            attrs.$observe('limit', function () {
                                //Limit the number of selections allowed
                                $select.limit = (angular.isDefined(attrs.limit)) ? parseInt(attrs.limit, 10) : undefined;
                            });

                            scope.$watch('removeSelected', function () {
                                var removeSelected = scope.$eval(attrs.removeSelected);
                                $select.removeSelected = removeSelected !== undefined ? removeSelected : uiSelectConfig.removeSelected;
                            });

                            attrs.$observe('disabled', function () {
                                // No need to use $eval() (thanks to ng-disabled) since we already get a boolean instead of a string
                                $select.disabled = attrs.disabled !== undefined ? attrs.disabled : false;
                            });

                            attrs.$observe('resetSearchInput', function () {
                                // $eval() is needed otherwise we get a string instead of a boolean
                                var resetSearchInput = scope.$eval(attrs.resetSearchInput);
                                $select.resetSearchInput = resetSearchInput !== undefined ? resetSearchInput : true;
                            });

                            attrs.$observe('paste', function () {
                                $select.paste = scope.$eval(attrs.paste);
                            });

                            attrs.$observe('tagging', function () {
                                if (attrs.tagging !== undefined) {
                                    // $eval() is needed otherwise we get a string instead of a boolean
                                    var taggingEval = scope.$eval(attrs.tagging);
                                    $select.tagging = { isActivated: true, fct: taggingEval !== true ? taggingEval : undefined };
                                }
                                else {
                                    $select.tagging = { isActivated: false, fct: undefined };
                                }
                            });

                            attrs.$observe('taggingLabel', function () {
                                if (attrs.tagging !== undefined) {
                                    // check eval for FALSE, in this case, we disable the labels
                                    // associated with tagging
                                    if (attrs.taggingLabel === 'false') {
                                        $select.taggingLabel = false;
                                    }
                                    else {
                                        $select.taggingLabel = attrs.taggingLabel !== undefined ? attrs.taggingLabel : '(new)';
                                    }
                                }
                            });

                            attrs.$observe('taggingTokens', function () {
                                if (attrs.tagging !== undefined) {
                                    var tokens = attrs.taggingTokens !== undefined ? attrs.taggingTokens.split('|') : [',', 'ENTER'];
                                    $select.taggingTokens = { isActivated: true, tokens: tokens };
                                }
                            });

                            attrs.$observe('spinnerEnabled', function () {
                                // $eval() is needed otherwise we get a string instead of a boolean
                                var spinnerEnabled = scope.$eval(attrs.spinnerEnabled);
                                $select.spinnerEnabled = spinnerEnabled !== undefined ? spinnerEnabled : uiSelectConfig.spinnerEnabled;
                            });

                            attrs.$observe('spinnerClass', function () {
                                var spinnerClass = attrs.spinnerClass;
                                $select.spinnerClass = spinnerClass !== undefined ? attrs.spinnerClass : uiSelectConfig.spinnerClass;
                            });

                            //Automatically gets focus when loaded
                            if (angular.isDefined(attrs.autofocus)) {
                                $timeout(function () {
                                    $select.setFocus();
                                });
                            }

                            //Gets focus based on scope event name (e.g. focus-on='SomeEventName')
                            if (angular.isDefined(attrs.focusOn)) {
                                scope.$on(attrs.focusOn, function () {
                                    $timeout(function () {
                                        $select.setFocus();
                                    });
                                });
                            }

                            function onDocumentClick(e) {
                                if (!$select.open) return; //Skip it if dropdown is close

                                var contains = false;

                                if (window.jQuery) {
                                    // Firefox 3.6 does not support element.contains()
                                    // See Node.contains https://developer.mozilla.org/en-US/docs/Web/API/Node.contains
                                    contains = window.jQuery.contains(element[0], e.target);
                                } else {
                                    contains = element[0].contains(e.target);
                                }

                                if (!contains && !$select.clickTriggeredSelect) {
                                    var skipFocusser;
                                    if (!$select.skipFocusser) {
                                        //Will lose focus only with certain targets
                                        var focusableControls = ['input', 'button', 'textarea', 'select'];
                                        var targetController = angular.element(e.target).controller('uiSelect'); //To check if target is other ui-select
                                        skipFocusser = targetController && targetController !== $select; //To check if target is other ui-select
                                        if (!skipFocusser) skipFocusser = ~focusableControls.indexOf(e.target.tagName.toLowerCase()); //Check if target is input, button or textarea
                                    } else {
                                        skipFocusser = true;
                                    }
                                    $select.close(skipFocusser);
                                    scope.$digest();
                                }
                                $select.clickTriggeredSelect = false;
                            }

                            // See Click everywhere but here event http://stackoverflow.com/questions/12931369
                            $document.on('click', onDocumentClick);

                            scope.$on('$destroy', function () {
                                $document.off('click', onDocumentClick);
                            });

                            // Move transcluded elements to their correct position in main template
                            transcludeFn(scope, function (clone) {
                                // See Transclude in AngularJS http://blog.omkarpatil.com/2012/11/transclude-in-angularjs.html

                                // One day jqLite will be replaced by jQuery and we will be able to write:
                                // var transcludedElement = clone.filter('.my-class')
                                // instead of creating a hackish DOM element:
                                var transcluded = angular.element('<div>').append(clone);

                                var transcludedMatch = transcluded.querySelectorAll('.ui-select-match');
                                transcludedMatch.removeAttr('ui-select-match'); //To avoid loop in case directive as attr
                                transcludedMatch.removeAttr('data-ui-select-match'); // Properly handle HTML5 data-attributes
                                if (transcludedMatch.length !== 1) {
                                    throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-match but got '{0}'.", transcludedMatch.length);
                                }
                                element.querySelectorAll('.ui-select-match').replaceWith(transcludedMatch);

                                var transcludedChoices = transcluded.querySelectorAll('.ui-select-choices');
                                transcludedChoices.removeAttr('ui-select-choices'); //To avoid loop in case directive as attr
                                transcludedChoices.removeAttr('data-ui-select-choices'); // Properly handle HTML5 data-attributes
                                if (transcludedChoices.length !== 1) {
                                    throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-choices but got '{0}'.", transcludedChoices.length);
                                }
                                element.querySelectorAll('.ui-select-choices').replaceWith(transcludedChoices);

                                var transcludedNoChoice = transcluded.querySelectorAll('.ui-select-no-choice');
                                transcludedNoChoice.removeAttr('ui-select-no-choice'); //To avoid loop in case directive as attr
                                transcludedNoChoice.removeAttr('data-ui-select-no-choice'); // Properly handle HTML5 data-attributes
                                if (transcludedNoChoice.length == 1) {
                                    element.querySelectorAll('.ui-select-no-choice').replaceWith(transcludedNoChoice);
                                }
                            });

                            // Support for appending the select field to the body when its open
                            var appendToBody = scope.$eval(attrs.appendToBody);
                            if (appendToBody !== undefined ? appendToBody : uiSelectConfig.appendToBody) {
                                scope.$watch('$select.open', function (isOpen) {
                                    if (isOpen) {
                                        positionDropdown();
                                    } else {
                                        resetDropdown();
                                    }
                                });

                                // Move the dropdown back to its original location when the scope is destroyed. Otherwise
                                // it might stick around when the user routes away or the select field is otherwise removed
                                scope.$on('$destroy', function () {
                                    resetDropdown();
                                });
                            }

                            // Hold on to a reference to the .ui-select-container element for appendToBody support
                            var placeholder = null,
                                originalWidth = '';

                            function positionDropdown() {
                                // Remember the absolute position of the element
                                var offset = uisOffset(element);

                                // Clone the element into a placeholder element to take its original place in the DOM
                                placeholder = angular.element('<div class="ui-select-placeholder"></div>');
                                placeholder[0].style.width = offset.width + 'px';
                                placeholder[0].style.height = offset.height + 'px';
                                element.after(placeholder);

                                // Remember the original value of the element width inline style, so it can be restored
                                // when the dropdown is closed
                                originalWidth = element[0].style.width;

                                // Now move the actual dropdown element to the end of the body
                                $document.find('body').append(element);

                                element[0].style.position = 'absolute';
                                element[0].style.left = offset.left + 'px';
                                element[0].style.top = offset.top + 'px';
                                element[0].style.width = offset.width + 'px';
                            }

                            function resetDropdown() {
                                if (placeholder === null) {
                                    // The dropdown has not actually been display yet, so there's nothing to reset
                                    return;
                                }

                                // Move the dropdown element back to its original location in the DOM
                                placeholder.replaceWith(element);
                                placeholder = null;

                                element[0].style.position = '';
                                element[0].style.left = '';
                                element[0].style.top = '';
                                element[0].style.width = originalWidth;

                                // Set focus back on to the moved element
                                $select.setFocus();
                            }

                            // Hold on to a reference to the .ui-select-dropdown element for direction support.
                            var dropdown = null,
                                directionUpClassName = 'direction-up';

                            // Support changing the direction of the dropdown if there isn't enough space to render it.
                            scope.$watch('$select.open', function () {

                                if ($select.dropdownPosition === 'auto' || $select.dropdownPosition === 'up') {
                                    scope.calculateDropdownPos();
                                }

                            });

                            var setDropdownPosUp = function (offset, offsetDropdown) {

                                offset = offset || uisOffset(element);
                                offsetDropdown = offsetDropdown || uisOffset(dropdown);

                                dropdown[0].style.position = 'absolute';
                                dropdown[0].style.top = (offsetDropdown.height * -1) + 'px';
                                element.addClass(directionUpClassName);

                            };

                            var setDropdownPosDown = function (offset, offsetDropdown) {

                                element.removeClass(directionUpClassName);

                                offset = offset || uisOffset(element);
                                offsetDropdown = offsetDropdown || uisOffset(dropdown);

                                dropdown[0].style.position = '';
                                dropdown[0].style.top = '';

                            };

                            var calculateDropdownPosAfterAnimation = function () {
                                // Delay positioning the dropdown until all choices have been added so its height is correct.
                                $timeout(function () {
                                    if ($select.dropdownPosition === 'up') {
                                        //Go UP
                                        setDropdownPosUp();
                                    } else {
                                        //AUTO
                                        element.removeClass(directionUpClassName);

                                        var offset = uisOffset(element);
                                        var offsetDropdown = uisOffset(dropdown);

                                        //https://code.google.com/p/chromium/issues/detail?id=342307#c4
                                        var scrollTop = $document[0].documentElement.scrollTop || $document[0].body.scrollTop; //To make it cross browser (blink, webkit, IE, Firefox).

                                        // Determine if the direction of the dropdown needs to be changed.
                                        if (offset.top + offset.height + offsetDropdown.height > scrollTop + $document[0].documentElement.clientHeight) {
                                            //Go UP
                                            setDropdownPosUp(offset, offsetDropdown);
                                        } else {
                                            //Go DOWN
                                            setDropdownPosDown(offset, offsetDropdown);
                                        }
                                    }

                                    // Display the dropdown once it has been positioned.
                                    dropdown[0].style.opacity = 1;
                                });
                            };

                            var opened = false;

                            scope.calculateDropdownPos = function () {
                                if ($select.open) {
                                    dropdown = angular.element(element).querySelectorAll('.ui-select-dropdown');

                                    if (dropdown.length === 0) {
                                        return;
                                    }

                                    // Hide the dropdown so there is no flicker until $timeout is done executing.
                                    if ($select.search === '' && !opened) {
                                        dropdown[0].style.opacity = 0;
                                        opened = true;
                                    }

                                    if (!uisOffset(dropdown).height && $select.$animate && $select.$animate.on && $select.$animate.enabled(dropdown)) {
                                        var needsCalculated = true;

                                        $select.$animate.on('enter', dropdown, function (elem, phase) {
                                            if (phase === 'close' && needsCalculated) {
                                                calculateDropdownPosAfterAnimation();
                                                needsCalculated = false;
                                            }
                                        });
                                    } else {
                                        calculateDropdownPosAfterAnimation();
                                    }
                                } else {
                                    if (dropdown === null || dropdown.length === 0) {
                                        return;
                                    }

                                    // Reset the position of the dropdown.
                                    dropdown[0].style.opacity = 0;
                                    dropdown[0].style.position = '';
                                    dropdown[0].style.top = '';
                                    element.removeClass(directionUpClassName);
                                }
                            };
                        };
                    }
                };
            }]);

    uis.directive('uiSelectMatch', ['uiSelectConfig', function (uiSelectConfig) {
        return {
            restrict: 'EA',
            require: '^uiSelect',
            replace: true,
            transclude: true,
            templateUrl: function (tElement) {
                // Needed so the uiSelect can detect the transcluded content
                tElement.addClass('ui-select-match');

                var parent = tElement.parent();
                // Gets theme attribute from parent (ui-select)
                var theme = getAttribute(parent, 'theme') || uiSelectConfig.theme;
                var multi = angular.isDefined(getAttribute(parent, 'multiple'));

                return theme + (multi ? '/match-multiple.tpl.html' : '/match.tpl.html');
            },
            link: function (scope, element, attrs, $select) {
                $select.lockChoiceExpression = attrs.uiLockChoice;
                attrs.$observe('placeholder', function (placeholder) {
                    $select.placeholder = placeholder !== undefined ? placeholder : uiSelectConfig.placeholder;
                });

                function setAllowClear(allow) {
                    $select.allowClear = (angular.isDefined(allow)) ? (allow === '') ? true : (allow.toLowerCase() === 'true') : false;
                }

                attrs.$observe('allowClear', setAllowClear);
                setAllowClear(attrs.allowClear);

                if ($select.multiple) {
                    $select.sizeSearchInput();
                }

            }
        };

        function getAttribute(elem, attribute) {
            if (elem[0].hasAttribute(attribute))
                return elem.attr(attribute);

            if (elem[0].hasAttribute('data-' + attribute))
                return elem.attr('data-' + attribute);

            if (elem[0].hasAttribute('x-' + attribute))
                return elem.attr('x-' + attribute);
        }
    }]);

    uis.directive('uiSelectMultiple', ['uiSelectMinErr', '$timeout', function (uiSelectMinErr, $timeout) {
        return {
            restrict: 'EA',
            require: ['^uiSelect', '^ngModel'],

            controller: ['$scope', '$timeout', function ($scope, $timeout) {

                var ctrl = this,
                    $select = $scope.$select,
                    ngModel;

                if (angular.isUndefined($select.selected))
                    $select.selected = [];

                //Wait for link fn to inject it
                $scope.$evalAsync(function () { ngModel = $scope.ngModel; });

                ctrl.activeMatchIndex = -1;

                ctrl.updateModel = function () {
                    ngModel.$setViewValue(Date.now()); //Set timestamp as a unique string to force changes
                    ctrl.refreshComponent();
                };

                ctrl.refreshComponent = function () {
                    //Remove already selected items
                    //e.g. When user clicks on a selection, the selected array changes and
                    //the dropdown should remove that item
                    if ($select.refreshItems) {
                        $select.refreshItems();
                    }
                    if ($select.sizeSearchInput) {
                        $select.sizeSearchInput();
                    }
                };

                // Remove item from multiple select
                ctrl.removeChoice = function (index) {

                    // if the choice is locked, don't remove it
                    if ($select.isLocked(null, index)) return false;

                    var removedChoice = $select.selected[index];

                    var locals = {};
                    locals[$select.parserResult.itemName] = removedChoice;

                    $select.selected.splice(index, 1);
                    ctrl.activeMatchIndex = -1;
                    $select.sizeSearchInput();

                    // Give some time for scope propagation.
                    $timeout(function () {
                        $select.onRemoveCallback($scope, {
                            $item: removedChoice,
                            $model: $select.parserResult.modelMapper($scope, locals)
                        });
                    });

                    ctrl.updateModel();

                    return true;
                };

                ctrl.getPlaceholder = function () {
                    //Refactor single?
                    // if ($select.selected && $select.selected.length) return;
                    return $select.placeholder;
                };


            }],
            controllerAs: '$selectMultiple',

            link: function (scope, element, attrs, ctrls) {

                var $select = ctrls[0];
                var ngModel = scope.ngModel = ctrls[1];
                var $selectMultiple = scope.$selectMultiple;

                //$select.selected = raw selected objects (ignoring any property binding)

                $select.multiple = true;

                //Input that will handle focus
                $select.focusInput = $select.searchInput;

                //Properly check for empty if set to multiple
                ngModel.$isEmpty = function (value) {
                    return !value || value.length === 0;
                };

                //From view --> model
                ngModel.$parsers.unshift(function () {
                    var locals = {},
                        result,
                        resultMultiple = [];
                    for (var j = $select.selected.length - 1; j >= 0; j--) {
                        locals = {};
                        locals[$select.parserResult.itemName] = $select.selected[j];
                        result = $select.parserResult.modelMapper(scope, locals);
                        resultMultiple.unshift(result);
                    }
                    return resultMultiple;
                });

                // From model --> view
                ngModel.$formatters.unshift(function (inputValue) {
                    var data = $select.parserResult && $select.parserResult.source(scope, { $select: { search: '' } }), //Overwrite $search
                        locals = {},
                        result;
                    if (!data) return inputValue;
                    var resultMultiple = [];
                    var checkFnMultiple = function (list, value) {
                        if (!list || !list.length) return;
                        for (var p = list.length - 1; p >= 0; p--) {
                            locals[$select.parserResult.itemName] = list[p];
                            result = $select.parserResult.modelMapper(scope, locals);
                            if ($select.parserResult.trackByExp) {
                                var propsItemNameMatches = /(\w*)\./.exec($select.parserResult.trackByExp);
                                var matches = /\.([^\s]+)/.exec($select.parserResult.trackByExp);
                                if (propsItemNameMatches && propsItemNameMatches.length > 0 && propsItemNameMatches[1] == $select.parserResult.itemName) {
                                    if (matches && matches.length > 0 && result[matches[1]] == value[matches[1]]) {
                                        resultMultiple.unshift(list[p]);
                                        return true;
                                    }
                                }
                            }
                            if (angular.equals(result, value)) {
                                resultMultiple.unshift(list[p]);
                                return true;
                            }
                        }
                        return false;
                    };
                    if (!inputValue) return resultMultiple; //If ngModel was undefined
                    for (var k = inputValue.length - 1; k >= 0; k--) {
                        //Check model array of currently selected items
                        if (!checkFnMultiple($select.selected, inputValue[k])) {
                            //Check model array of all items available
                            if (!checkFnMultiple(data, inputValue[k])) {
                                //If not found on previous lists, just add it directly to resultMultiple
                                resultMultiple.unshift(inputValue[k]);
                            }
                        }
                    }
                    return resultMultiple;
                });

                //Watch for external model changes
                scope.$watchCollection(function () { return ngModel.$modelValue; }, function (newValue, oldValue) {
                    if (oldValue != newValue) {
                        //update the view value with fresh data from items, if there is a valid model value
                        if (angular.isDefined(ngModel.$modelValue)) {
                            ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
                        }
                        $selectMultiple.refreshComponent();
                    }
                });

                ngModel.$render = function () {
                    // Make sure that model value is array
                    if (!angular.isArray(ngModel.$viewValue)) {
                        // Have tolerance for null or undefined values
                        if (isNil(ngModel.$viewValue)) {
                            ngModel.$viewValue = [];
                        } else {
                            throw uiSelectMinErr('multiarr', "Expected model value to be array but got '{0}'", ngModel.$viewValue);
                        }
                    }
                    $select.selected = ngModel.$viewValue;
                    $selectMultiple.refreshComponent();
                    scope.$evalAsync(); //To force $digest
                };

                scope.$on('uis:select', function (event, item) {
                    if ($select.selected.length >= $select.limit) {
                        return;
                    }
                    $select.selected.push(item);
                    var locals = {};
                    locals[$select.parserResult.itemName] = item;

                    $timeout(function () {
                        $select.onSelectCallback(scope, {
                            $item: item,
                            $model: $select.parserResult.modelMapper(scope, locals)
                        });
                    });
                    $selectMultiple.updateModel();
                });

                scope.$on('uis:activate', function () {
                    $selectMultiple.activeMatchIndex = -1;
                });

                scope.$watch('$select.disabled', function (newValue, oldValue) {
                    // As the search input field may now become visible, it may be necessary to recompute its size
                    if (oldValue && !newValue) $select.sizeSearchInput();
                });

                $select.searchInput.on('keydown', function (e) {
                    var key = e.which;
                    scope.$apply(function () {
                        var processed = false;
                        // var tagged = false; //Checkme
                        if (KEY.isHorizontalMovement(key)) {
                            processed = _handleMatchSelection(key);
                        }
                        if (processed && key != KEY.TAB) {
                            //TODO Check si el tab selecciona aun correctamente
                            //Crear test
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    });
                });
                function _getCaretPosition(el) {
                    if (angular.isNumber(el.selectionStart)) return el.selectionStart;
                    // selectionStart is not supported in IE8 and we don't want hacky workarounds so we compromise
                    else return el.value.length;
                }
                // Handles selected options in "multiple" mode
                function _handleMatchSelection(key) {
                    var caretPosition = _getCaretPosition($select.searchInput[0]),
                        length = $select.selected.length,
                        // none  = -1,
                        first = 0,
                        last = length - 1,
                        curr = $selectMultiple.activeMatchIndex,
                        next = $selectMultiple.activeMatchIndex + 1,
                        prev = $selectMultiple.activeMatchIndex - 1,
                        newIndex = curr;

                    if (caretPosition > 0 || ($select.search.length && key == KEY.RIGHT)) return false;

                    $select.close();

                    function getNewActiveMatchIndex() {
                        switch (key) {
                            case KEY.LEFT:
                                // Select previous/first item
                                if (~$selectMultiple.activeMatchIndex) return prev;
                                // Select last item
                                else return last;
                                break;
                            case KEY.RIGHT:
                                // Open drop-down
                                if (!~$selectMultiple.activeMatchIndex || curr === last) {
                                    $select.activate();
                                    return false;
                                }
                                // Select next/last item
                                else return next;
                                break;
                            case KEY.BACKSPACE:
                                // Remove selected item and select previous/first
                                if (~$selectMultiple.activeMatchIndex) {
                                    if ($selectMultiple.removeChoice(curr)) {
                                        return prev;
                                    } else {
                                        return curr;
                                    }

                                } else {
                                    // If nothing yet selected, select last item
                                    return last;
                                }
                                break;
                            case KEY.DELETE:
                                // Remove selected item and select next item
                                if (~$selectMultiple.activeMatchIndex) {
                                    $selectMultiple.removeChoice($selectMultiple.activeMatchIndex);
                                    return curr;
                                }
                                else return false;
                        }
                    }

                    newIndex = getNewActiveMatchIndex();

                    if (!$select.selected.length || newIndex === false) $selectMultiple.activeMatchIndex = -1;
                    else $selectMultiple.activeMatchIndex = Math.min(last, Math.max(first, newIndex));

                    return true;
                }

                $select.searchInput.on('keyup', function (e) {

                    if (!KEY.isVerticalMovement(e.which)) {
                        scope.$evalAsync(function () {
                            $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
                        });
                    }
                    // Push a "create new" item into array if there is a search string
                    if ($select.tagging.isActivated && $select.search.length > 0) {

                        // return early with these keys
                        if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || KEY.isVerticalMovement(e.which)) {
                            return;
                        }
                        // always reset the activeIndex to the first item when tagging
                        $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
                        // taggingLabel === false bypasses all of this
                        if ($select.taggingLabel === false) return;

                        var items = angular.copy($select.items);
                        var stashArr = angular.copy($select.items);
                        var newItem;
                        var item;
                        var hasTag = false;
                        var dupeIndex = -1;
                        var tagItems;
                        var tagItem;

                        // case for object tagging via transform `$select.tagging.fct` function
                        if ($select.tagging.fct !== undefined) {
                            tagItems = $select.$filter('filter')(items, { 'isTag': true });
                            if (tagItems.length > 0) {
                                tagItem = tagItems[0];
                            }
                            // remove the first element, if it has the `isTag` prop we generate a new one with each keyup, shaving the previous
                            if (items.length > 0 && tagItem) {
                                hasTag = true;
                                items = items.slice(1, items.length);
                                stashArr = stashArr.slice(1, stashArr.length);
                            }
                            newItem = $select.tagging.fct($select.search);
                            // verify the new tag doesn't match the value of a possible selection choice or an already selected item.
                            if (
                                stashArr.some(function (origItem) {
                                    return angular.equals(origItem, newItem);
                                }) ||
                                $select.selected.some(function (origItem) {
                                    return angular.equals(origItem, newItem);
                                })
                            ) {
                                scope.$evalAsync(function () {
                                    $select.activeIndex = 0;
                                    $select.items = items;
                                });
                                return;
                            }
                            if (newItem) newItem.isTag = true;
                            // handle newItem string and stripping dupes in tagging string context
                        } else {
                            // find any tagging items already in the $select.items array and store them
                            tagItems = $select.$filter('filter')(items, function (item) {
                                return item.match($select.taggingLabel);
                            });
                            if (tagItems.length > 0) {
                                tagItem = tagItems[0];
                            }
                            item = items[0];
                            // remove existing tag item if found (should only ever be one tag item)
                            if (item !== undefined && items.length > 0 && tagItem) {
                                hasTag = true;
                                items = items.slice(1, items.length);
                                stashArr = stashArr.slice(1, stashArr.length);
                            }
                            newItem = $select.search + ' ' + $select.taggingLabel;
                            if (_findApproxDupe($select.selected, $select.search) > -1) {
                                return;
                            }
                            // verify the the tag doesn't match the value of an existing item from
                            // the searched data set or the items already selected
                            if (_findCaseInsensitiveDupe(stashArr.concat($select.selected))) {
                                // if there is a tag from prev iteration, strip it / queue the change
                                // and return early
                                if (hasTag) {
                                    items = stashArr;
                                    scope.$evalAsync(function () {
                                        $select.activeIndex = 0;
                                        $select.items = items;
                                    });
                                }
                                return;
                            }
                            if (_findCaseInsensitiveDupe(stashArr)) {
                                // if there is a tag from prev iteration, strip it
                                if (hasTag) {
                                    $select.items = stashArr.slice(1, stashArr.length);
                                }
                                return;
                            }
                        }
                        if (hasTag) dupeIndex = _findApproxDupe($select.selected, newItem);
                        // dupe found, shave the first item
                        if (dupeIndex > -1) {
                            items = items.slice(dupeIndex + 1, items.length - 1);
                        } else {
                            items = [];
                            if (newItem) items.push(newItem);
                            items = items.concat(stashArr);
                        }
                        scope.$evalAsync(function () {
                            $select.activeIndex = 0;
                            $select.items = items;

                            if ($select.isGrouped) {
                                // update item references in groups, so that indexOf will work after angular.copy
                                var itemsWithoutTag = newItem ? items.slice(1) : items;
                                $select.setItemsFn(itemsWithoutTag);
                                if (newItem) {
                                    // add tag item as a new group
                                    $select.items.unshift(newItem);
                                    $select.groups.unshift({ name: '', items: [newItem], tagging: true });
                                }
                            }
                        });
                    }
                });
                function _findCaseInsensitiveDupe(arr) {
                    if (arr === undefined || $select.search === undefined) {
                        return false;
                    }
                    var hasDupe = arr.filter(function (origItem) {
                        if ($select.search.toUpperCase() === undefined || origItem === undefined) {
                            return false;
                        }
                        return origItem.toUpperCase() === $select.search.toUpperCase();
                    }).length > 0;

                    return hasDupe;
                }
                function _findApproxDupe(haystack, needle) {
                    var dupeIndex = -1;
                    if (angular.isArray(haystack)) {
                        var tempArr = angular.copy(haystack);
                        for (var i = 0; i < tempArr.length; i++) {
                            // handle the simple string version of tagging
                            if ($select.tagging.fct === undefined) {
                                // search the array for the match
                                if (tempArr[i] + ' ' + $select.taggingLabel === needle) {
                                    dupeIndex = i;
                                }
                                // handle the object tagging implementation
                            } else {
                                var mockObj = tempArr[i];
                                if (angular.isObject(mockObj)) {
                                    mockObj.isTag = true;
                                }
                                if (angular.equals(mockObj, needle)) {
                                    dupeIndex = i;
                                }
                            }
                        }
                    }
                    return dupeIndex;
                }

                $select.searchInput.on('blur', function () {
                    $timeout(function () {
                        $selectMultiple.activeMatchIndex = -1;
                    });
                });

            }
        };
    }]);

    uis.directive('uiSelectNoChoice',
        ['uiSelectConfig', function (uiSelectConfig) {
            return {
                restrict: 'EA',
                require: '^uiSelect',
                replace: true,
                transclude: true,
                templateUrl: function (tElement) {
                    // Needed so the uiSelect can detect the transcluded content
                    tElement.addClass('ui-select-no-choice');

                    // Gets theme attribute from parent (ui-select)
                    var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
                    return theme + '/no-choice.tpl.html';
                }
            };
        }]);

    uis.directive('uiSelectSingle', ['$timeout', '$compile', function ($timeout, $compile) {
        return {
            restrict: 'EA',
            require: ['^uiSelect', '^ngModel'],
            link: function (scope, element, attrs, ctrls) {

                var $select = ctrls[0];
                var ngModel = ctrls[1];

                //From view --> model
                ngModel.$parsers.unshift(function (inputValue) {
                    // Keep original value for undefined and null
                    if (isNil(inputValue)) {
                        return inputValue;
                    }

                    var locals = {},
                        result;
                    locals[$select.parserResult.itemName] = inputValue;
                    result = $select.parserResult.modelMapper(scope, locals);
                    return result;
                });

                //From model --> view
                ngModel.$formatters.unshift(function (inputValue) {
                    // Keep original value for undefined and null
                    if (isNil(inputValue)) {
                        return inputValue;
                    }

                    var data = $select.parserResult && $select.parserResult.source(scope, { $select: { search: '' } }), //Overwrite $search
                        locals = {},
                        result;
                    if (data) {
                        var checkFnSingle = function (d) {
                            locals[$select.parserResult.itemName] = d;
                            result = $select.parserResult.modelMapper(scope, locals);
                            return result === inputValue;
                        };
                        //If possible pass same object stored in $select.selected
                        if ($select.selected && checkFnSingle($select.selected)) {
                            return $select.selected;
                        }
                        for (var i = data.length - 1; i >= 0; i--) {
                            if (checkFnSingle(data[i])) return data[i];
                        }
                    }
                    return inputValue;
                });

                //Update viewValue if model change
                scope.$watch('$select.selected', function (newValue) {
                    if (ngModel.$viewValue !== newValue) {
                        ngModel.$setViewValue(newValue);
                    }
                });

                ngModel.$render = function () {
                    $select.selected = ngModel.$viewValue;
                };

                scope.$on('uis:select', function (event, item) {
                    $select.selected = item;
                    var locals = {};
                    locals[$select.parserResult.itemName] = item;

                    $timeout(function () {
                        $select.onSelectCallback(scope, {
                            $item: item,
                            $model: isNil(item) ? item : $select.parserResult.modelMapper(scope, locals)
                        });
                    });
                });

                scope.$on('uis:close', function (event, skipFocusser) {
                    $timeout(function () {
                        $select.focusser.prop('disabled', false);
                        if (!skipFocusser) $select.focusser[0].focus();
                    }, 0, false);
                });

                scope.$on('uis:activate', function () {
                    focusser.prop('disabled', true); //Will reactivate it on .close()
                });

                //Idea from: https://github.com/ivaynberg/select2/blob/79b5bf6db918d7560bdd959109b7bcfb47edaf43/select2.js#L1954
                var focusser = angular.element("<input ng-disabled='$select.disabled' class='ui-select-focusser ui-select-offscreen' type='text' id='{{ $select.focusserId }}' aria-label='{{ $select.focusserTitle }}' aria-haspopup='true' role='button' />");
                $compile(focusser)(scope);
                $select.focusser = focusser;

                //Input that will handle focus
                $select.focusInput = focusser;

                element.parent().append(focusser);
                focusser.bind("focus", function () {
                    scope.$evalAsync(function () {
                        $select.focus = true;
                    });
                });
                focusser.bind("blur", function () {
                    scope.$evalAsync(function () {
                        $select.focus = false;
                    });
                });
                focusser.bind("keydown", function (e) {

                    if (e.which === KEY.BACKSPACE && $select.backspaceReset !== false) {
                        e.preventDefault();
                        e.stopPropagation();
                        $select.select(undefined);
                        scope.$apply();
                        return;
                    }

                    if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                        return;
                    }

                    if (e.which == KEY.DOWN || e.which == KEY.UP || e.which == KEY.ENTER || e.which == KEY.SPACE) {
                        e.preventDefault();
                        e.stopPropagation();
                        $select.activate();
                    }

                    scope.$digest();
                });

                focusser.bind("keyup input", function (e) {

                    if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || e.which == KEY.ENTER || e.which === KEY.BACKSPACE) {
                        return;
                    }

                    $select.activate(focusser.val()); //User pressed some regular key, so we pass it to the search input
                    focusser.val('');
                    scope.$digest();

                });


            }
        };
    }]);

    // Make multiple matches sortable
    uis.directive('uiSelectSort', ['$timeout', 'uiSelectConfig', 'uiSelectMinErr', function ($timeout, uiSelectConfig, uiSelectMinErr) {
        return {
            require: ['^^uiSelect', '^ngModel'],
            link: function (scope, element, attrs, ctrls) {
                if (scope[attrs.uiSelectSort] === null) {
                    throw uiSelectMinErr('sort', 'Expected a list to sort');
                }

                var $select = ctrls[0];
                var $ngModel = ctrls[1];

                var options = angular.extend({
                    axis: 'horizontal'
                },
                    scope.$eval(attrs.uiSelectSortOptions));

                var axis = options.axis;
                var draggingClassName = 'dragging';
                var droppingClassName = 'dropping';
                var droppingBeforeClassName = 'dropping-before';
                var droppingAfterClassName = 'dropping-after';

                scope.$watch(function () {
                    return $select.sortable;
                }, function (newValue) {
                    if (newValue) {
                        element.attr('draggable', true);
                    } else {
                        element.removeAttr('draggable');
                    }
                });

                element.on('dragstart', function (event) {
                    element.addClass(draggingClassName);

                    (event.dataTransfer || event.originalEvent.dataTransfer).setData('text', scope.$index.toString());
                });

                element.on('dragend', function () {
                    removeClass(draggingClassName);
                });

                var move = function (from, to) {
                    /*jshint validthis: true */
                    this.splice(to, 0, this.splice(from, 1)[0]);
                };

                var removeClass = function (className) {
                    angular.forEach($select.$element.querySelectorAll('.' + className), function (el) {
                        angular.element(el).removeClass(className);
                    });
                };

                var dragOverHandler = function (event) {
                    event.preventDefault();

                    var offset = axis === 'vertical' ? event.offsetY || event.layerY || (event.originalEvent ? event.originalEvent.offsetY : 0) : event.offsetX || event.layerX || (event.originalEvent ? event.originalEvent.offsetX : 0);

                    if (offset < (this[axis === 'vertical' ? 'offsetHeight' : 'offsetWidth'] / 2)) {
                        removeClass(droppingAfterClassName);
                        element.addClass(droppingBeforeClassName);

                    } else {
                        removeClass(droppingBeforeClassName);
                        element.addClass(droppingAfterClassName);
                    }
                };

                var dropTimeout;

                var dropHandler = function (event) {
                    event.preventDefault();

                    var droppedItemIndex = parseInt((event.dataTransfer || event.originalEvent.dataTransfer).getData('text'), 10);

                    // prevent event firing multiple times in firefox
                    $timeout.cancel(dropTimeout);
                    dropTimeout = $timeout(function () {
                        _dropHandler(droppedItemIndex);
                    }, 20);
                };

                var _dropHandler = function (droppedItemIndex) {
                    var theList = scope.$eval(attrs.uiSelectSort);
                    var itemToMove = theList[droppedItemIndex];
                    var newIndex = null;

                    if (element.hasClass(droppingBeforeClassName)) {
                        if (droppedItemIndex < scope.$index) {
                            newIndex = scope.$index - 1;
                        } else {
                            newIndex = scope.$index;
                        }
                    } else {
                        if (droppedItemIndex < scope.$index) {
                            newIndex = scope.$index;
                        } else {
                            newIndex = scope.$index + 1;
                        }
                    }

                    move.apply(theList, [droppedItemIndex, newIndex]);

                    $ngModel.$setViewValue(Date.now());

                    scope.$apply(function () {
                        scope.$emit('uiSelectSort:change', {
                            array: theList,
                            item: itemToMove,
                            from: droppedItemIndex,
                            to: newIndex
                        });
                    });

                    removeClass(droppingClassName);
                    removeClass(droppingBeforeClassName);
                    removeClass(droppingAfterClassName);

                    element.off('drop', dropHandler);
                };

                element.on('dragenter', function () {
                    if (element.hasClass(draggingClassName)) {
                        return;
                    }

                    element.addClass(droppingClassName);

                    element.on('dragover', dragOverHandler);
                    element.on('drop', dropHandler);
                });

                element.on('dragleave', function (event) {
                    if (event.target != element) {
                        return;
                    }

                    removeClass(droppingClassName);
                    removeClass(droppingBeforeClassName);
                    removeClass(droppingAfterClassName);

                    element.off('dragover', dragOverHandler);
                    element.off('drop', dropHandler);
                });
            }
        };
    }]);

    /**
     * Debounces functions
     *
     * Taken from UI Bootstrap $$debounce source code
     * See https://github.com/angular-ui/bootstrap/blob/master/src/debounce/debounce.js
     *
     */
    uis.factory('$$uisDebounce', ['$timeout', function ($timeout) {
        return function (callback, debounceTime) {
            var timeoutPromise;

            return function () {
                var self = this;
                var args = Array.prototype.slice.call(arguments);
                if (timeoutPromise) {
                    $timeout.cancel(timeoutPromise);
                }

                timeoutPromise = $timeout(function () {
                    callback.apply(self, args);
                }, debounceTime);
            };
        };
    }]);

    uis.directive('uisOpenClose', ['$parse', '$timeout', function ($parse, $timeout) {
        return {
            restrict: 'A',
            require: 'uiSelect',
            link: function (scope, element, attrs, $select) {
                $select.onOpenCloseCallback = $parse(attrs.uisOpenClose);

                scope.$watch('$select.open', function (isOpen, previousState) {
                    if (isOpen !== previousState) {
                        $timeout(function () {
                            $select.onOpenCloseCallback(scope, {
                                isOpen: isOpen
                            });
                        });
                    }
                });
            }
        };
    }]);

    /**
     * Parses "repeat" attribute.
     *
     * Taken from AngularJS ngRepeat source code
     * See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L211
     *
     * Original discussion about parsing "repeat" attribute instead of fully relying on ng-repeat:
     * https://github.com/angular-ui/ui-select/commit/5dd63ad#commitcomment-5504697
     */

    uis.service('uisRepeatParser', ['uiSelectMinErr', '$parse', function (uiSelectMinErr, $parse) {
        var self = this;

        /**
         * Example:
         * expression = "address in addresses | filter: {street: $select.search} track by $index"
         * itemName = "address",
         * source = "addresses | filter: {street: $select.search}",
         * trackByExp = "$index",
         */
        self.parse = function (expression) {


            var match;
            //var isObjectCollection = /\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)/.test(expression);
            // If an array is used as collection

            // if (isObjectCollection){
            // 000000000000000000000000000000111111111000000000000000222222222222220033333333333333333333330000444444444444444444000000000000000055555555555000000000000000000000066666666600000000
            match = expression.match(/^\s*(?:([\s\S]+?)\s+as\s+)?(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(\s*[\s\S]+?)?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

            // 1 Alias
            // 2 Item
            // 3 Key on (key,value)
            // 4 Value on (key,value)
            // 5 Source expression (including filters)
            // 6 Track by

            if (!match) {
                throw uiSelectMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
                    expression);
            }

            var source = match[5],
                filters = '';

            // When using (key,value) ui-select requires filters to be extracted, since the object
            // is converted to an array for $select.items 
            // (in which case the filters need to be reapplied)
            if (match[3]) {
                // Remove any enclosing parenthesis
                source = match[5].replace(/(^\()|(\)$)/g, '');
                // match all after | but not after ||
                var filterMatch = match[5].match(/^\s*(?:[\s\S]+?)(?:[^\|]|\|\|)+([\s\S]*)\s*$/);
                if (filterMatch && filterMatch[1].trim()) {
                    filters = filterMatch[1];
                    source = source.replace(filters, '');
                }
            }

            return {
                itemName: match[4] || match[2], // (lhs) Left-hand side,
                keyName: match[3], //for (key, value) syntax
                source: $parse(source),
                filters: filters,
                trackByExp: match[6],
                modelMapper: $parse(match[1] || match[4] || match[2]),
                repeatExpression: function (grouped) {
                    var expression = this.itemName + ' in ' + (grouped ? '$group.items' : '$select.items');
                    if (this.trackByExp) {
                        expression += ' track by ' + this.trackByExp;
                    }
                    return expression;
                }
            };

        };

        self.getGroupNgRepeatExpression = function () {
            return '$group in $select.groups track by $group.name';
        };

    }]);

}());
angular.module("ui.select").run(["$templateCache", function ($templateCache) {
    $templateCache.put("bootstrap/choices.tpl.html", "<ul class=\"ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu\" ng-show=\"$select.open && $select.items.length > 0\"><li class=\"ui-select-choices-group\" id=\"ui-select-choices-{{ $select.generatedId }}\"><div class=\"divider\" ng-show=\"$select.isGrouped && $index > 0\"></div><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label dropdown-header\" ng-bind=\"$group.name\"></div><div ng-attr-id=\"ui-select-choices-row-{{ $select.generatedId }}-{{$index}}\" class=\"ui-select-choices-row\" ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\" role=\"option\"><span class=\"ui-select-choices-row-inner\"></span></div></li></ul>");
    $templateCache.put("bootstrap/match-multiple.tpl.html", "<span class=\"ui-select-match\"><span ng-repeat=\"$item in $select.selected track by $index\"><span class=\"ui-select-match-item btn btn-default btn-xs\" tabindex=\"-1\" type=\"button\" ng-disabled=\"$select.disabled\" ng-click=\"$selectMultiple.activeMatchIndex = $index;\" ng-class=\"{\'btn-primary\':$selectMultiple.activeMatchIndex === $index, \'select-locked\':$select.isLocked(this, $index)}\" ui-select-sort=\"$select.selected\"><span class=\"close ui-select-match-close\" ng-hide=\"$select.disabled\" ng-click=\"$selectMultiple.removeChoice($index)\">&nbsp;&times;</span> <span uis-transclude-append=\"\"></span></span></span></span>");
    $templateCache.put("bootstrap/match.tpl.html", "<div class=\"ui-select-match\" ng-hide=\"$select.open && $select.searchEnabled\" ng-disabled=\"$select.disabled\" ng-class=\"{\'btn-default-focus\':$select.focus}\"><span tabindex=\"-1\" class=\"btn btn-default form-control ui-select-toggle\" aria-label=\"{{ $select.baseTitle }} activate\" ng-disabled=\"$select.disabled\" ng-click=\"$select.activate()\" style=\"outline: 0;\"><span ng-show=\"$select.isEmpty()\" class=\"ui-select-placeholder text-muted\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"ui-select-match-text pull-left\" ng-class=\"{\'ui-select-allow-clear\': $select.allowClear && !$select.isEmpty()}\" ng-transclude=\"\"></span> <i class=\"caret pull-right\" ng-click=\"$select.toggle($event)\"></i> <a ng-show=\"$select.allowClear && !$select.isEmpty() && ($select.disabled !== true)\" aria-label=\"{{ $select.baseTitle }} clear\" style=\"margin-right: 10px\" ng-click=\"$select.clear($event)\" class=\"btn btn-xs btn-link pull-right\"><i class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></i></a></span></div>");
    $templateCache.put("bootstrap/no-choice.tpl.html", "<ul class=\"ui-select-no-choice dropdown-menu\" ng-show=\"$select.items.length == 0\"><li ng-transclude=\"\"></li></ul>");
    $templateCache.put("bootstrap/select-multiple.tpl.html", "<div class=\"ui-select-container ui-select-multiple ui-select-bootstrap dropdown form-control\" ng-class=\"{open: $select.open}\"><div><div class=\"ui-select-match\"></div><input type=\"search\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"ui-select-search input-xs\" placeholder=\"{{$selectMultiple.getPlaceholder()}}\" ng-disabled=\"$select.disabled\" ng-click=\"$select.activate()\" ng-model=\"$select.search\" role=\"combobox\" aria-expanded=\"{{$select.open}}\" aria-label=\"{{$select.baseTitle}}\" ng-class=\"{\'spinner\': $select.refreshing}\" ondrop=\"return false;\"></div><div class=\"ui-select-choices\"></div><div class=\"ui-select-no-choice\"></div></div>");
    $templateCache.put("bootstrap/select.tpl.html", "<div class=\"ui-select-container ui-select-bootstrap dropdown\" ng-class=\"{open: $select.open}\"><div class=\"ui-select-match\"></div><span ng-show=\"$select.open && $select.refreshing && $select.spinnerEnabled\" class=\"ui-select-refreshing {{$select.spinnerClass}}\"></span> <input type=\"search\" autocomplete=\"off\" tabindex=\"-1\" aria-expanded=\"true\" aria-label=\"{{ $select.baseTitle }}\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" class=\"form-control ui-select-search\" ng-class=\"{ \'ui-select-search-hidden\' : !$select.searchEnabled }\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-show=\"$select.open\"><div class=\"ui-select-choices\"></div><div class=\"ui-select-no-choice\"></div></div>");
    $templateCache.put("select2/choices.tpl.html", "<ul tabindex=\"-1\" class=\"ui-select-choices ui-select-choices-content select2-results\"><li class=\"ui-select-choices-group\" ng-class=\"{\'select2-result-with-children\': $select.choiceGrouped($group) }\"><div ng-show=\"$select.choiceGrouped($group)\" class=\"ui-select-choices-group-label select2-result-label\" ng-bind=\"$group.name\"></div><ul id=\"ui-select-choices-{{ $select.generatedId }}\" ng-class=\"{\'select2-result-sub\': $select.choiceGrouped($group), \'select2-result-single\': !$select.choiceGrouped($group) }\"><li role=\"option\" ng-attr-id=\"ui-select-choices-row-{{ $select.generatedId }}-{{$index}}\" class=\"ui-select-choices-row\" ng-class=\"{\'select2-highlighted\': $select.isActive(this), \'select2-disabled\': $select.isDisabled(this)}\"><div class=\"select2-result-label ui-select-choices-row-inner\"></div></li></ul></li></ul>");
    $templateCache.put("select2/match-multiple.tpl.html", "<span class=\"ui-select-match\"><li class=\"ui-select-match-item select2-search-choice\" ng-repeat=\"$item in $select.selected track by $index\" ng-class=\"{\'select2-search-choice-focus\':$selectMultiple.activeMatchIndex === $index, \'select2-locked\':$select.isLocked(this, $index)}\" ui-select-sort=\"$select.selected\"><span uis-transclude-append=\"\"></span> <a href=\"javascript:;\" class=\"ui-select-match-close select2-search-choice-close\" ng-click=\"$selectMultiple.removeChoice($index)\" tabindex=\"-1\"></a></li></span>");
    $templateCache.put("select2/match.tpl.html", "<a class=\"select2-choice ui-select-match\" ng-class=\"{\'select2-default\': $select.isEmpty()}\" ng-click=\"$select.toggle($event)\" aria-label=\"{{ $select.baseTitle }} select\"><span ng-show=\"$select.isEmpty()\" class=\"select2-chosen\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"select2-chosen\" ng-transclude=\"\"></span> <abbr ng-if=\"$select.allowClear && !$select.isEmpty()\" class=\"select2-search-choice-close\" ng-click=\"$select.clear($event)\"></abbr> <span class=\"select2-arrow ui-select-toggle\"><b></b></span></a>");
    $templateCache.put("select2/no-choice.tpl.html", "<div class=\"ui-select-no-choice dropdown\" ng-show=\"$select.items.length == 0\"><div class=\"dropdown-content\"><div data-selectable=\"\" ng-transclude=\"\"></div></div></div>");
    $templateCache.put("select2/select-multiple.tpl.html", "<div class=\"ui-select-container ui-select-multiple select2 select2-container select2-container-multi\" ng-class=\"{\'select2-container-active select2-dropdown-open open\': $select.open, \'select2-container-disabled\': $select.disabled}\"><ul class=\"select2-choices\"><span class=\"ui-select-match\"></span><li class=\"select2-search-field\"><input type=\"search\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" role=\"combobox\" aria-expanded=\"true\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-label=\"{{ $select.baseTitle }}\" aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" class=\"select2-input ui-select-search\" placeholder=\"{{$selectMultiple.getPlaceholder()}}\" ng-disabled=\"$select.disabled\" ng-hide=\"$select.disabled\" ng-model=\"$select.search\" ng-click=\"$select.activate()\" style=\"width: 34px;\" ondrop=\"return false;\"></li></ul><div class=\"ui-select-dropdown select2-drop select2-with-searchbox select2-drop-active\" ng-class=\"{\'select2-display-none\': !$select.open || $select.items.length === 0}\"><div class=\"ui-select-choices\"></div></div></div>");
    $templateCache.put("select2/select.tpl.html", "<div class=\"ui-select-container select2 select2-container\" ng-class=\"{\'select2-container-active select2-dropdown-open open\': $select.open, \'select2-container-disabled\': $select.disabled, \'select2-container-active\': $select.focus, \'select2-allowclear\': $select.allowClear && !$select.isEmpty()}\"><div class=\"ui-select-match\"></div><div class=\"ui-select-dropdown select2-drop select2-with-searchbox select2-drop-active\" ng-class=\"{\'select2-display-none\': !$select.open}\"><div class=\"search-container\" ng-class=\"{\'ui-select-search-hidden\':!$select.searchEnabled, \'select2-search\':$select.searchEnabled}\"><input type=\"search\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" ng-class=\"{\'select2-active\': $select.refreshing}\" role=\"combobox\" aria-expanded=\"true\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-label=\"{{ $select.baseTitle }}\" class=\"ui-select-search select2-input\" ng-model=\"$select.search\"></div><div class=\"ui-select-choices\"></div><div class=\"ui-select-no-choice\"></div></div></div>");
    $templateCache.put("selectize/choices.tpl.html", "<div ng-show=\"$select.open\" class=\"ui-select-choices ui-select-dropdown selectize-dropdown\" ng-class=\"{\'single\': !$select.multiple, \'multi\': $select.multiple}\"><div class=\"ui-select-choices-content selectize-dropdown-content\"><div class=\"ui-select-choices-group optgroup\"><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label optgroup-header\" ng-bind=\"$group.name\"></div><div role=\"option\" class=\"ui-select-choices-row\" ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\"><div class=\"option ui-select-choices-row-inner\" data-selectable=\"\"></div></div></div></div></div>");
    $templateCache.put("selectize/match-multiple.tpl.html", "<div class=\"ui-select-match\" data-value=\"\" ng-repeat=\"$item in $select.selected track by $index\" ng-click=\"$selectMultiple.activeMatchIndex = $index;\" ng-class=\"{\'active\':$selectMultiple.activeMatchIndex === $index}\" ui-select-sort=\"$select.selected\"><span class=\"ui-select-match-item\" ng-class=\"{\'select-locked\':$select.isLocked(this, $index)}\"><span uis-transclude-append=\"\"></span> <span class=\"remove ui-select-match-close\" ng-hide=\"$select.disabled\" ng-click=\"$selectMultiple.removeChoice($index)\">&times;</span></span></div>");
    $templateCache.put("selectize/match.tpl.html", "<div ng-hide=\"$select.searchEnabled && ($select.open || $select.isEmpty())\" class=\"ui-select-match\"><span ng-show=\"!$select.searchEnabled && ($select.isEmpty() || $select.open)\" class=\"ui-select-placeholder text-muted\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty() || $select.open\" ng-transclude=\"\"></span></div>");
    $templateCache.put("selectize/no-choice.tpl.html", "<div class=\"ui-select-no-choice selectize-dropdown\" ng-show=\"$select.items.length == 0\"><div class=\"selectize-dropdown-content\"><div data-selectable=\"\" ng-transclude=\"\"></div></div></div>");
    $templateCache.put("selectize/select-multiple.tpl.html", "<div class=\"ui-select-container selectize-control multi plugin-remove_button\" ng-class=\"{\'open\': $select.open}\"><div class=\"selectize-input\" ng-class=\"{\'focus\': $select.open, \'disabled\': $select.disabled, \'selectize-focus\' : $select.focus}\" ng-click=\"$select.open && !$select.searchEnabled ? $select.toggle($event) : $select.activate()\"><div class=\"ui-select-match\"></div><input type=\"search\" autocomplete=\"off\" tabindex=\"-1\" class=\"ui-select-search\" ng-class=\"{\'ui-select-search-hidden\':!$select.searchEnabled}\" placeholder=\"{{$selectMultiple.getPlaceholder()}}\" ng-model=\"$select.search\" ng-disabled=\"$select.disabled\" aria-expanded=\"{{$select.open}}\" aria-label=\"{{ $select.baseTitle }}\" ondrop=\"return false;\"></div><div class=\"ui-select-choices\"></div><div class=\"ui-select-no-choice\"></div></div>");
    $templateCache.put("selectize/select.tpl.html", "<div class=\"ui-select-container selectize-control single\" ng-class=\"{\'open\': $select.open}\"><div class=\"selectize-input\" ng-class=\"{\'focus\': $select.open, \'disabled\': $select.disabled, \'selectize-focus\' : $select.focus}\" ng-click=\"$select.open && !$select.searchEnabled ? $select.toggle($event) : $select.activate()\"><div class=\"ui-select-match\"></div><input type=\"search\" autocomplete=\"off\" tabindex=\"-1\" class=\"ui-select-search ui-select-toggle\" ng-class=\"{\'ui-select-search-hidden\':!$select.searchEnabled}\" ng-click=\"$select.toggle($event)\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-hide=\"!$select.isEmpty() && !$select.open\" ng-disabled=\"$select.disabled\" aria-label=\"{{ $select.baseTitle }}\"></div><div class=\"ui-select-choices\"></div><div class=\"ui-select-no-choice\"></div></div>");
}]);
define("common/angular-select/js/select", function(){});


define('css!common/angular-select/css/select',[],function(){});
define('common/angular-select/index',['require','exports','module','./js/select','css!./css/select.css'],function (require, exports, module) {
    require('./js/select');
    require('css!./css/select.css');
});


define('css!js/../../../lib/angular-dialog/css/ngDialog',[],function(){});

define('css!js/../../../lib/angular-dialog/css/ngDialog-theme-default',[],function(){});

define('css!js/../../../lib/angular-dialog/css/ngDialog-theme-plain',[],function(){});
define('js/../../../lib/angular-dialog/js/dialog',['require','exports','module'],function(e,a,n){"use strict";var o=angular.module("ngDialog",[]),l=angular.element,t=angular.isDefined,i=(document.body||document.documentElement).style,r=t(i.animation)||t(i.WebkitAnimation)||t(i.MozAnimation)||t(i.MsAnimation)||t(i.OAnimation),s="animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend",c={html:!1,body:!1},d={},g=[],u=[],m=!1,p=!1,f=[];return o.provider("ngDialog",function(){var e=this.defaults={className:"ngdialog-theme-default",appendClassName:"",disableAnimation:!1,plain:!1,showClose:!0,closeByDocument:!0,closeByEscape:!0,closeByNavigation:!1,appendTo:!1,preCloseCallback:!1,onOpenCallback:!1,overlay:!0,cache:!0,trapFocus:!0,preserveFocus:!0,ariaAuto:!0,ariaRole:null,ariaLabelledById:null,ariaLabelledBySelector:null,ariaDescribedById:null,ariaDescribedBySelector:null,bodyClassName:"ngdialog-open",width:null,height:null};this.setForceHtmlReload=function(e){c.html=e||!1},this.setForceBodyReload=function(e){c.body=e||!1},this.setDefaults=function(a){angular.extend(e,a)},this.setOpenOnePerName=function(e){p=e||!1};var a,n=0,o=0,t={};this.$get=["$document","$templateCache","$compile","$q","$http","$rootScope","$timeout","$window","$controller","$injector",function(i,v,y,b,h,D,C,$,A,S){var E=[],w={onDocumentKeydown:function(e){27===e.keyCode&&B.close("$escape")},activate:function(e){e.data("$ngDialogOptions").trapFocus&&(e.on("keydown",w.onTrapFocusKeydown),E.body.on("keydown",w.onTrapFocusKeydown))},deactivate:function(e){e.off("keydown",w.onTrapFocusKeydown),E.body.off("keydown",w.onTrapFocusKeydown)},deactivateAll:function(e){angular.forEach(e,function(e){var a=angular.element(e);w.deactivate(a)})},setBodyPadding:function(e){var a=parseInt(E.body.css("padding-right")||0,10);E.body.css("padding-right",a+e+"px"),E.body.data("ng-dialog-original-padding",a),D.$broadcast("ngDialog.setPadding",e)},resetBodyPadding:function(){var e=E.body.data("ng-dialog-original-padding");e?E.body.css("padding-right",e+"px"):E.body.css("padding-right",""),D.$broadcast("ngDialog.setPadding",0)},performCloseDialog:function(e,n){var l=e.data("$ngDialogOptions"),i=e.attr("id"),c=d[i];if(w.deactivate(e),c){if(void 0!==$.Hammer){var u=c.hammerTime;u.off("tap",a),u.destroy&&u.destroy(),delete c.hammerTime}else e.unbind("click");1===o&&E.body.unbind("keydown",w.onDocumentKeydown),e.hasClass("ngdialog-closing")||(o-=1);var p=e.data("$ngDialogPreviousFocus");p&&p.focus&&p.focus(),D.$broadcast("ngDialog.closing",e,n),o=o<0?0:o,r&&!l.disableAnimation?(c.$destroy(),e.unbind(s).bind(s,function(){w.closeDialogElement(e,n)}).addClass("ngdialog-closing")):(c.$destroy(),w.closeDialogElement(e,n)),t[i]&&(t[i].resolve({id:i,value:n,$dialog:e,remainingDialogs:o}),delete t[i]),d[i]&&delete d[i],g.splice(g.indexOf(i),1),g.length||(E.body.unbind("keydown",w.onDocumentKeydown),m=!1),0==o&&(a=void 0)}},closeDialogElement:function(e,a){var n=e.data("$ngDialogOptions");e.remove(),u.splice(u.indexOf(n.bodyClassName),1),-1===u.indexOf(n.bodyClassName)&&(E.html.removeClass(n.bodyClassName),E.body.removeClass(n.bodyClassName)),0===o&&w.resetBodyPadding(),D.$broadcast("ngDialog.closed",e,a)},closeDialog:function(e,a){var n=e.data("$ngDialogPreCloseCallback");if(n&&angular.isFunction(n)){var o=n.call(e,a);if(angular.isObject(o))o.closePromise?o.closePromise.then(function(){w.performCloseDialog(e,a)},function(){return!1}):o.then(function(){w.performCloseDialog(e,a)},function(){return!1});else{if(!1===o)return!1;w.performCloseDialog(e,a)}}else w.performCloseDialog(e,a)},onTrapFocusKeydown:function(e){var a,n=angular.element(e.currentTarget);if(n.hasClass("ngdialog"))a=n;else if(null===(a=w.getActiveDialog()))return;var o=9===e.keyCode,l=!0===e.shiftKey;o&&w.handleTab(a,e,l)},handleTab:function(e,a,n){var o=w.getFocusableElements(e);if(0!==o.length){var l=document.activeElement,t=Array.prototype.indexOf.call(o,l),i=-1===t,r=0===t,s=t===o.length-1,c=!1;n?(i||r)&&(o[o.length-1].focus(),c=!0):(i||s)&&(o[0].focus(),c=!0),c&&(a.preventDefault(),a.stopPropagation())}else document.activeElement&&document.activeElement.blur&&document.activeElement.blur()},autoFocus:function(e){var a=e[0],n=a.querySelector("*[autofocus]");if(null===n||(n.focus(),document.activeElement!==n)){var o=w.getFocusableElements(e);if(o.length>0)o[0].focus();else{var t=w.filterVisibleElements(a.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span"));if(t.length>0){var i=t[0];l(i).attr("tabindex","-1").css("outline","0"),i.focus()}}}},getFocusableElements:function(e){var a=e[0].querySelectorAll("a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]"),n=w.filterTabbableElements(a);return w.filterVisibleElements(n)},filterTabbableElements:function(e){for(var a=[],n=0;n<e.length;n++){var o=e[n];"-1"!==l(o).attr("tabindex")&&a.push(o)}return a},filterVisibleElements:function(e){for(var a=[],n=0;n<e.length;n++){var o=e[n];(o.offsetWidth>0||o.offsetHeight>0)&&a.push(o)}return a},getActiveDialog:function(){var e=document.querySelectorAll(".ngdialog");return 0===e.length?null:l(e[e.length-1])},applyAriaAttributes:function(e,a){if(a.ariaAuto){if(!a.ariaRole){var n=w.getFocusableElements(e).length>0?"dialog":"alertdialog";a.ariaRole=n}a.ariaLabelledBySelector||(a.ariaLabelledBySelector="h1,h2,h3,h4,h5,h6"),a.ariaDescribedBySelector||(a.ariaDescribedBySelector="article,section,p")}a.ariaRole&&e.attr("role",a.ariaRole),w.applyAriaAttribute(e,"aria-labelledby",a.ariaLabelledById,a.ariaLabelledBySelector),w.applyAriaAttribute(e,"aria-describedby",a.ariaDescribedById,a.ariaDescribedBySelector)},applyAriaAttribute:function(e,a,n,o){if(n)e.attr(a,n);else if(o){var t=e.attr("id"),i=e[0].querySelector(o);if(!i)return;var r=t+"-"+a;return l(i).attr("id",r),e.attr(a,r),r}},detectUIRouter:function(){return S.has("$transitions")?"1.0.0+":!!S.has("$state")&&"legacy"},getRouterLocationEventName:function(){return w.detectUIRouter()?"$stateChangeStart":"$locationChangeStart"}},B={__PRIVATE__:w,open:function(i){function r(e,a){return(a=a||{}).headers=a.headers||{},angular.extend(a.headers,{Accept:"text/html"}),D.$broadcast("ngDialog.templateLoading",e),h.get(e,a).then(function(a){return D.$broadcast("ngDialog.templateLoaded",e),a.data||""})}var s=null;if(i=i||{},!(p&&i.name&&(s=i.name.toLowerCase().replace(/\s/g,"-")+"-dialog",this.isOpen(s)))){var c=angular.copy(e),O=++n;s=s||"ngdialog"+O,g.push(s),void 0!==c.data&&(void 0===i.data&&(i.data={}),i.data=angular.merge(angular.copy(c.data),i.data)),angular.extend(c,i);var k;t[s]=k=b.defer();var F;d[s]=F=angular.isObject(c.scope)?c.scope.$new():D.$new();var N,T,x,P=angular.extend({},c.resolve);return angular.forEach(P,function(e,a){P[a]=angular.isString(e)?S.get(e):S.invoke(e,null,null,a)}),b.all({template:function(e){return e?angular.isString(e)&&c.plain?e:"boolean"!=typeof c.cache||c.cache?r(e,{cache:v}):r(e,{cache:!1}):"Empty template"}(c.template||c.templateUrl),locals:b.all(P)}).then(function(e){var n=e.template,t=e.locals;c.showClose&&(n+='<button aria-label="Dismiss" class="ngdialog-close"></button>');var i=c.overlay?"":" ngdialog-no-overlay";if((N=l('<div id="'+s+'" class="ngdialog'+i+'"></div>')).html(c.overlay?'<div class="ngdialog-overlay"></div><div class="ngdialog-content" role="document">'+n+"</div>":'<div class="ngdialog-content" role="document">'+n+"</div>"),N.data("$ngDialogOptions",c),F.ngDialogId=s,c.data&&angular.isString(c.data)){var r=c.data.replace(/^\s*/,"")[0];F.ngDialogData="{"===r||"["===r?angular.fromJson(c.data):new String(c.data),F.ngDialogData.ngDialogId=s}else c.data&&angular.isObject(c.data)&&(F.ngDialogData=c.data,F.ngDialogData.ngDialogId=s);if(c.className&&N.addClass(c.className),c.appendClassName&&N.addClass(c.appendClassName),c.width&&(x=N[0].querySelector(".ngdialog-content"),angular.isString(c.width)?x.style.width=c.width:x.style.width=c.width+"px"),c.height&&(x=N[0].querySelector(".ngdialog-content"),angular.isString(c.height)?x.style.height=c.height:x.style.height=c.height+"px"),c.disableAnimation&&N.addClass("ngdialog-disabled-animation"),T=c.appendTo&&angular.isString(c.appendTo)?angular.element(document.querySelector(c.appendTo)):E.body,w.applyAriaAttributes(N,c),[{name:"$ngDialogPreCloseCallback",value:c.preCloseCallback},{name:"$ngDialogOnOpenCallback",value:c.onOpenCallback}].forEach(function(e){if(e.value){var a;angular.isFunction(e.value)?a=e.value:angular.isString(e.value)&&F&&(angular.isFunction(F[e.value])?a=F[e.value]:F.$parent&&angular.isFunction(F.$parent[e.value])?a=F.$parent[e.value]:D&&angular.isFunction(D[e.value])&&(a=D[e.value])),a&&N.data(e.name,a)}}),F.closeThisDialog=function(e){w.closeDialog(N,e)},c.controller&&(angular.isString(c.controller)||angular.isArray(c.controller)||angular.isFunction(c.controller))){var d;c.controllerAs&&angular.isString(c.controllerAs)&&(d=c.controllerAs);var g=A(c.controller,angular.extend(t,{$scope:F,$element:N}),!0,d);c.bindToController&&angular.extend(g.instance,{ngDialogId:F.ngDialogId,ngDialogData:F.ngDialogData,closeThisDialog:F.closeThisDialog,confirm:F.confirm}),"function"==typeof g?N.data("$ngDialogControllerController",g()):N.data("$ngDialogControllerController",g)}if(C(function(){var e=document.querySelectorAll(".ngdialog");w.deactivateAll(e),y(N)(F);var a=$.innerWidth-E.body.prop("clientWidth");E.html.addClass(c.bodyClassName),E.body.addClass(c.bodyClassName),u.push(c.bodyClassName);var n=a-($.innerWidth-E.body.prop("clientWidth"));n>0&&w.setBodyPadding(n),T.append(N),w.activate(N),c.trapFocus&&w.autoFocus(N),c.name?D.$broadcast("ngDialog.opened",{dialog:N,name:c.name}):D.$broadcast("ngDialog.opened",N);var o=N.data("$ngDialogOnOpenCallback");o&&angular.isFunction(o)&&o.call(N)}),m||(E.body.bind("keydown",w.onDocumentKeydown),m=!0),c.closeByNavigation&&f.push(N),c.preserveFocus&&N.data("$ngDialogPreviousFocus",document.activeElement),a=function(e){var a=!!c.closeByDocument&&l(e.target).hasClass("ngdialog-overlay"),n=l(e.target).hasClass("ngdialog-close");(a||n)&&B.close(N.attr("id"),n?"$closeButton":"$document")},void 0!==$.Hammer){(F.hammerTime=$.Hammer(N[0])).on("tap",a)}else N.bind("click",a);return o+=1,B}),{id:s,closePromise:k.promise,close:function(e){w.closeDialog(N,e)}}}},openConfirm:function(a){var n=b.defer(),o=angular.copy(e);a=a||{},void 0!==o.data&&(void 0===a.data&&(a.data={}),a.data=angular.merge(angular.copy(o.data),a.data)),angular.extend(o,a),o.scope=angular.isObject(o.scope)?o.scope.$new():D.$new(),o.scope.confirm=function(e){n.resolve(e);var a=l(document.getElementById(t.id));w.performCloseDialog(a,e)};var t=B.open(o);if(t)return t.closePromise.then(function(e){return e?n.reject(e.value):n.reject()}),n.promise},isOpen:function(e){return l(document.getElementById(e)).length>0},close:function(e,a){var n=l(document.getElementById(e));if(n.length)w.closeDialog(n,a);else if("$escape"===e){var o=g[g.length-1];(n=l(document.getElementById(o))).data("$ngDialogOptions").closeByEscape&&w.closeDialog(n,"$escape")}else B.closeAll(a);return B},closeAll:function(e){for(var a=document.querySelectorAll(".ngdialog"),n=a.length-1;n>=0;n--){var o=a[n];w.closeDialog(l(o),e)}},getOpenDialogs:function(){return g},getDefaults:function(){return e}};angular.forEach(["html","body"],function(e){if(E[e]=i.find(e),c[e]){var a=w.getRouterLocationEventName();D.$on(a,function(){E[e]=i.find(e)})}});var O=w.detectUIRouter();if("1.0.0+"===O){S.get("$transitions").onStart({},function(e){for(;f.length>0;){var a=f.pop();if(!1===w.closeDialog(a))return!1}})}else{var k="legacy"===O?"$stateChangeStart":"$locationChangeStart";D.$on(k,function(e){for(;f.length>0;){var a=f.pop();!1===w.closeDialog(a)&&e.preventDefault()}})}return B}]}),o.directive("ngDialog",["ngDialog",function(e){return{restrict:"A",scope:{ngDialogScope:"="},link:function(a,n,o){n.on("click",function(n){n.preventDefault();var l=angular.isDefined(a.ngDialogScope)?a.ngDialogScope:"noScope";angular.isDefined(o.ngDialogClosePrevious)&&e.close(o.ngDialogClosePrevious);var t=e.getDefaults();e.open({template:o.ngDialog,className:o.ngDialogClass||t.className,appendClassName:o.ngDialogAppendClass,controller:o.ngDialogController,controllerAs:o.ngDialogControllerAs,bindToController:o.ngDialogBindToController,disableAnimation:o.ngDialogDisableAnimation,scope:l,data:o.ngDialogData,showClose:"false"!==o.ngDialogShowClose&&("true"===o.ngDialogShowClose||t.showClose),closeByDocument:"false"!==o.ngDialogCloseByDocument&&("true"===o.ngDialogCloseByDocument||t.closeByDocument),closeByEscape:"false"!==o.ngDialogCloseByEscape&&("true"===o.ngDialogCloseByEscape||t.closeByEscape),overlay:"false"!==o.ngDialogOverlay&&("true"===o.ngDialogOverlay||t.overlay),preCloseCallback:o.ngDialogPreCloseCallback||t.preCloseCallback,onOpenCallback:o.ngDialogOnOpenCallback||t.onOpenCallback,bodyClassName:o.ngDialogBodyClass||t.bodyClassName})})}}}]),o});
define('js/../../../lib/angular-dialog/index',["css!./css/ngDialog.css","css!./css/ngDialog-theme-default.css","css!./css/ngDialog-theme-plain.css","./js/dialog"],function(s,c,e){});
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
'use strict';

define('common/autocomplete-muti/index',['require','exports','module','../../js/common/debounce'],function (require, exports, module) {
    var debounce = require('../../js/common/debounce');
    if (angular.element.prototype.querySelectorAll === undefined) {
        angular.element.prototype.querySelectorAll = function (selector) {
            return angular.element(this[0].querySelectorAll(selector));
        };
    }
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
        isControl: function isControl(e) {
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
        isFunctionKey: function isFunctionKey(k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        },
        isVerticalMovement: function isVerticalMovement(k) {
            return ~[KEY.UP, KEY.DOWN].indexOf(k);
        },
        isHorizontalMovement: function isHorizontalMovement(k) {
            return ~[KEY.LEFT, KEY.RIGHT, KEY.BACKSPACE, KEY.DELETE].indexOf(k);
        }
    };

    var app = angular.module('ui.myAutoComplete', []).constant('autoDefaultConfig', {
        placeholder: '',
        showNum: 10,
        limit: 30,
        searchKey: 'searchText',
        refreshDelay: 100,
        removeSelected: true,
        isSample: false
    }).service('uiMySelectMinErr', function () {
        var minErr = angular.$$minErr('ui.select');
        return function () {
            var error = minErr.apply(this, arguments);
            var message = error.message.replace(new RegExp('\nhttp://errors.angularjs.org/.*'), '');
            return new Error(message);
        };
    }).directive('uisMyTranscludeAppend', ['$injector', function ($injector) {
        return {
            link: function link(scope, element, attrs, ctrl, transclude) {
                if ($injector.has('uisMyTranscludeAppend')) {
                    return;
                }
                transclude(scope, function (clone) {
                    element.append(clone);
                });
            }
        };
    }]).factory('$$uisDebounce', ['$timeout', function ($timeout) {
        return debounce;
    }]);

    app.controller('uiMyAutoCompleteCtrl', ['$scope', '$timeout', '$http', '$q', '$element', 'autoDefaultConfig', '$window', '$$uisDebounce', '$document', function ($scope, $timeout, $http, $q, $element, autoDefaultConfig, $window, $$uisDebounce, $document) {
        var ctrl = this;
        ctrl.showAdd = false;
        ctrl.isOpen = false;
        ctrl.searchVal = undefined;
        ctrl.showNum = $scope.showNum || autoDefaultConfig.showNum;
        //获取到的数据
        ctrl.listItemData = [];
        //显示的key
        //选中的数据
        ctrl.selected = [];
        ctrl.activeIndex = -1;

        //可以用extend搞定这个逻辑
        ctrl.placeholder = $scope.placeholder || autoDefaultConfig.placeholder;
        ctrl.inputName = $scope.name || '';
        ctrl.refreshDelay = $scope.refreshDelay || autoDefaultConfig.refreshDelay;
        ctrl.searchKey = $scope.searchKey || autoDefaultConfig.searchKey;
        ctrl.limit = $scope.limit | 0 || autoDefaultConfig.limit;

        ctrl.searchInputElement = angular.element($element[0].querySelector('input'));

        var escClose = function escClose(e) {
            if (e.which === KEY.ESC) {
                $scope.$apply(function () {
                    ctrl.close();
                    ctrl.showAdd = false;
                });
            }
        };

        ctrl.setState = function (flag) {
            ctrl.isOpen = flag;
        };

        ctrl.open = function () {
            ctrl.setState(true);
            $document.on('keyup', escClose);
        };

        ctrl.close = function () {
            ctrl.setState(false);
            $document.off('keyup', escClose);
        };

        ctrl.getData = function () {
            var ajaxData = {};
            if (ctrl.ajaxCanceler) {
                ctrl.ajaxCanceler.resolve();
                ctrl.ajaxCanceler = null;
            }
            ctrl.ajaxCanceler = $q.defer();
            ajaxData[ctrl.searchKey] = (ctrl.searchVal || '').trim();
            ctrl.ajaxGetData = $http({
                timeout: ctrl.ajaxCanceler.promise,
                url: $scope.url,
                method: "GET",
                params: ajaxData
            }).success(function (res) {
                if (String(res.errno) !== '0') {
                    console.error(res);
                    return;
                }
                ctrl.listItemData = res.data.slice(0, ctrl.showNum);
                ctrl.activeIndex = -1;
                ctrl.open();
            });
        };

        /**
         *
         * 选中某一项
         * @param {any} index
         */
        ctrl.selectItem = function (index) {
            if (index < 0) {
                return;
            }
            var item = ctrl.listItemData[index];
            if (!item || ctrl.isDisabled({
                item: item
            })) {
                return;
            }
            ctrl.activeIndex = index;
            // ctrl.searchVal = data.text;
            $scope.$broadcast('uis:select', item);
            // ctrl.close();
            ctrl.removeSelected && ctrl.removeSelectItem(item);
            // ctrl.showAdd = false;
        };

        /**
         * 添加
         * 工单新增需求
         */
        ctrl.add = function () {
            ctrl.showAdd = true;
            var timer = setTimeout(function () {
                ctrl.searchInputElement[0].focus();
                clearTimeout(timer);
                timer = null;
            }, 0);
        };

        ctrl.removeSelectItem = function (selectedItems) {
            $timeout(function () {
                ctrl.listItemData = ctrl.listItemData.filter(function (data) {
                    return !angular.equals(data, selectedItems);
                });
                //清空输入的文本
                ctrl.searchVal = "";
            });
        };

        ctrl.isDisabled = function (obj) {
            var newItem = angular.extend(Object.create(null), obj.item);
            return ctrl.selected.some(function (val) {
                return angular.equals(newItem, val);
            });
        };

        function _handleDropDownSelection(key) {
            var processed = true;
            if (!ctrl.isOpen) {
                return processed;
            }
            switch (key) {
                case KEY.DOWN:
                    if (ctrl.activeIndex < ctrl.listItemData.length - 1) {
                        ctrl.activeIndex++;
                    } else {
                        ctrl.activeIndex = 0;
                    }
                    break;
                case KEY.UP:
                    if (ctrl.activeIndex > 0) {
                        ctrl.activeIndex--;
                    } else {
                        ctrl.activeIndex = ctrl.listItemData.length - 1;
                    }
                    break;
                case KEY.TAB:
                case KEY.ENTER:
                    ctrl.selectItem(ctrl.activeIndex);
                    break;
                case KEY.ESC:
                    ctrl.close();
                    break;
                default:
                    processed = false;
            }
            return processed;
        }

        function _ensureHighlightVisible() {
            var container = $element.querySelectorAll('.ui-select-choices-content');
            var choices = container.querySelectorAll('.ui-select-choices-row');
            if (choices.length < 1) {
                return;
            }

            if (ctrl.activeIndex < 0) {
                return;
            }

            var highlighted = choices[ctrl.activeIndex];
            var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
            var height = container[0].offsetHeight;

            if (posY > height) {
                //保证这个元素在底部位置
                container[0].scrollTop += posY - height;
            } else if (posY < highlighted.clientHeight) {
                if (ctrl.isGrouped && ctrl.activeIndex === 0) {
                    container[0].scrollTop = 0;
                } else {
                    container[0].scrollTop -= highlighted.clientHeight - posY;
                }
            }
        }

        ctrl.searchInputElement.on('keydown', function (e) {
            var key = e.which;
            if (key === KEY.ENTER || key === KEY.ESC) {
                e.preventDefault();
                e.stopPropagation();
            }
            $scope.$apply(function () {
                if (!ctrl.listItemData.length) {
                    return;
                }
                _handleDropDownSelection(key);
                if (KEY.isVerticalMovement(key)) {
                    _ensureHighlightVisible();
                }
            });
        });

        ctrl.searchInputElement.on('keyup input', debounce(function (e) {
            var el = e.target;
            if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || e.which == KEY.ENTER || KEY.isVerticalMovement(e.which)
            //删除文字也需要重写请求
            /* || e.which === KEY.BACKSPACE*/
            ) {
                    return;
                }
            if (!el.value) {
                $timeout(function () {
                    ctrl.close();
                });
                return;
            }
            ctrl.getData();
        }, ctrl.refreshDelay));

        var sizeWatch = null;
        var updaterScheduled = false;

        ctrl.sizeSearchInput = function () {
            var input = ctrl.searchInputElement[0],
                container = ctrl.searchInputElement.parent().parent()[0],
                calculateContainerWidth = function calculateContainerWidth() {
                return container.clientWidth * !!input.offsetParent;
            },
                updateIfVisible = function updateIfVisible(containerWidth) {
                if (containerWidth === 0) {
                    return false;
                }
                var inputWidth = containerWidth - input.offsetLeft - 2;
                if (inputWidth < 60) {
                    inputWidth = containerWidth;
                }
                ctrl.searchInputElement.css('width', inputWidth + 'px');
                return true;
            };
            ctrl.searchInputElement.css('width', '10px');
            $timeout(function () {
                //Give tags time to render correctly
                if (sizeWatch === null && !updateIfVisible(calculateContainerWidth())) {
                    sizeWatch = $scope.$watch(function () {
                        if (!updaterScheduled) {
                            updaterScheduled = true;
                            $scope.$$postDigest(function () {
                                updaterScheduled = false;
                                if (updateIfVisible(calculateContainerWidth())) {
                                    sizeWatch();
                                    sizeWatch = null;
                                }
                            });
                        }
                    }, angular.noop);
                }
            });
        };

        ctrl.searchInputElement.on('paste', function (e) {
            var data;
            if (window.clipboardData && window.clipboardData.getData) {
                // IE
                data = window.clipboardData.getData('Text');
            } else {
                data = (e.originalEvent || e).clipboardData.getData('text/plain');
            }
            data = (ctrl.searchVal || '') + data;
            if (data && data.length > 0) {
                ctrl.searchVal = data;
                ctrl.getData();
                e.preventDefault();
                e.stopPropagation();
            }
        });

        var onResize = $$uisDebounce(function () {
            ctrl.sizeSearchInput();
        }, 50);

        angular.element($window).bind('resize', onResize);

        $scope.$on('$destroy', function () {
            ctrl.searchInputElement.off('keyup keydown tagged blur paste');
        });
    }]);

    app.directive('uiMyAutoComplete', ['$timeout', 'autoDefaultConfig', '$parse', '$document', function ($timeout, autoDefaultConfig, $parse, $document, $element) {
        return {
            restrict: 'EA',
            templateUrl: function templateUrl(tElement, tAttrs) {
                return '/autocomplete/main.tpl.html';
            },
            scope: {
                url: "=",
                params: "=",
                placeholder: "@",
                searchKey: "@?",
                limit: "@?",
                inputName: "@?",
                removeSelected: "@?",
                isSample: "@?",
                sampleShowName: "@?"
            },
            require: ['uiMyAutoComplete', '^ngModel'],
            replace: true,
            transclude: true,
            controllerAs: '$autoCom',
            controller: 'uiMyAutoCompleteCtrl',
            compile: function compile(tElement, tAttrs) {
                //compile
                tElement.append('<ui-selected-item-list/>');
                //link
                return function (scope, element, attrs, ctrls, transcludeFn) {
                    var $autoCom = ctrls[0];
                    var $select = ctrls[0];
                    var ngModel = ctrls[1];
                    /*scope.$watch('removeSelected', function () {
                        var removeSelected = scope.$eval(attrs.removeselected);
                        $select.removeSelected = removeSelected !== undefined ? removeSelected : autoDefaultConfig.removeSelected;
                    });*/
                    $select.isSample = typeof attrs.issample === 'undefined' ? autoDefaultConfig.isSample : attrs.issample === 'true';
                    $select.removeSelected = typeof attrs.removeselected === 'undefined' ? autoDefaultConfig.removeSelected : attrs.removeselected === 'true'; //If selected item(s) should be removed from dropdown list
                    $select.sampleShowName = attrs.sampleshowname || '';

                    $select.ngModel = ngModel;

                    function onDocumentClick(e) {
                        var contains = false;
                        if (window.jQuery) {
                            contains = window.jQuery.contains(element[0], e.target);
                        } else {
                            contains = element[0].contains(e.target);
                        }
                        if (!contains) {
                            $timeout(function () {
                                $autoCom.showAdd = false;
                            });
                            if (!$autoCom.isOpen) {
                                return;
                            }
                            $timeout(function () {
                                scope.$apply(function () {
                                    $autoCom.close();
                                });
                            });
                        }
                    }

                    $document.on('click', onDocumentClick);

                    scope.$on('$destroy', function () {
                        $document.off('click', onDocumentClick);
                    });

                    transcludeFn(scope, function (clone) {
                        var transcluded = angular.element('<div>').append(clone);

                        var transcludedMatch = transcluded.querySelectorAll('.ui-select-match');
                        transcludedMatch.removeAttr('ui-select-match');
                        transcludedMatch.removeAttr('data-ui-select-match');
                        if (transcludedMatch.length !== 1) {
                            throw Error('ui-select-match must be one');
                        }
                        element.querySelectorAll('.ui-select-match').replaceWith(transcludedMatch);

                        var autocompleteList = transcluded.querySelectorAll('.ui-select-choices');
                        if (autocompleteList.length !== 1) {
                            throw Error('auto-complete-list must be one');
                        }
                        autocompleteList.removeAttr('ui-select-choices');
                        autocompleteList.removeAttr('data-ui-select-choices');
                        element.querySelectorAll('.ui-select-choices').replaceWith(autocompleteList);
                    });
                };
            }
        };
    }]);

    app.directive('uiAutoCompleteList', ['$compile', '$window', function ($compile, $window) {
        return {
            restrict: 'EA',
            require: '^uiMyAutoComplete',
            templateUrl: function templateUrl(tElement, tAttrs) {
                tElement.addClass('ui-select-choices');
                return '/autocomplete/list.tpl.html';
            },
            replace: true,
            transclude: true
        };
    }]);

    app.directive('uiSelectMatchItem', ['$compile', '$window', function ($compile, $window) {
        return {
            restrict: 'EA',
            require: '^uiMyAutoComplete',
            templateUrl: function templateUrl(tElement, tAttrs) {
                tElement.addClass('ui-select-match');
                return '/autocomplete/SelectMultiple.tpl.html';
            },
            replace: true,
            transclude: true,
            compile: function compile(tElement, tAttrs) {
                return function (scope, element, attrs, $select, transcludeFn) {
                    $select.sizeSearchInput();
                };
            }
        };
    }]);

    app.directive('uiSelectedItemList', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            require: ['^uiMyAutoComplete', '^ngModel'],
            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                var ctrl = this,
                    $select = $scope.$autoCom,
                    ngModel;

                if (angular.isUndefined($select.selected)) {
                    $select.selected = [];
                }
                //Wait for link fn to inject it
                $scope.$evalAsync(function () {
                    ngModel = $scope.ngModel;
                });
                ctrl.activeMatchIndex = -1;
                ctrl.removeChoice = function (index) {
                    $select.selected.splice(index, 1);
                    ctrl.activeMatchIndex = -1;
                    $select.sizeSearchInput();
                    return true;
                };
            }],
            controllerAs: '$selectedItemList',
            link: function link(scope, element, attrs, ctrls) {
                var $select = ctrls[0];
                var ngModel = scope.ngModel = ctrls[1];
                var $selectMultiple = scope.$selectedItemList;

                scope.$on('uis:select', function (event, item) {
                    var len = $select.selected.length,
                        index = 0,
                        newItem;
                    if (len >= $select.limit) {
                        return;
                    }
                    newItem = angular.extend(Object.create(null), item);
                    while (index < len) {
                        if (angular.equals($select.selected[index], newItem)) {
                            return;
                        }
                        index++;
                    }
                    if ($select.isSample) {
                        if (len === 1) {
                            $select.selected[0] = item;
                        } else {
                            $select.selected.push(item);
                        }
                        $select.searchVal = item[$select.sampleShowName];
                        if ($select.isSample) {
                            $select.close();
                        }
                    } else {
                        $select.selected.push(newItem);
                    }
                    $select.sizeSearchInput();
                });

                function _getCaretPosition(el) {
                    if (angular.isNumber(el.selectionStart)) {
                        return el.selectionStart;
                    } else {
                        return el.value.length;
                    }
                }

                function _handleMatchSelection(key) {
                    var caretPosition = _getCaretPosition($select.searchInputElement[0]),
                        length = $select.selected.length,

                    // none  = -1,
                    first = 0,
                        last = length - 1,
                        curr = $selectMultiple.activeMatchIndex,
                        next = $selectMultiple.activeMatchIndex + 1,
                        prev = $selectMultiple.activeMatchIndex - 1,
                        newIndex = curr;

                    if (caretPosition > 0 || $select.searchVal && $select.searchVal.length && key == KEY.RIGHT) {
                        return false;
                    }

                    // $select.close();
                    function getNewActiveMatchIndex() {
                        switch (key) {
                            case KEY.LEFT:
                                return ~$selectMultiple.activeMatchIndex ? prev : last;
                            case KEY.RIGHT:
                                return curr === last ? 0 : next;
                            case KEY.BACKSPACE:
                                if (~$selectMultiple.activeMatchIndex) {
                                    return $selectMultiple.removeChoice(curr) ? prev : curr;
                                }
                                return last;
                            case KEY.DELETE:
                                if (~$selectMultiple.activeMatchIndex) {
                                    $selectMultiple.removeChoice($selectMultiple.activeMatchIndex);
                                    return curr;
                                }
                                return false;
                        }
                    }
                    newIndex = getNewActiveMatchIndex();

                    if (!$select.selected.length || newIndex === false) {
                        $selectMultiple.activeMatchIndex = -1;
                    } else {
                        $selectMultiple.activeMatchIndex = Math.min(last, Math.max(first, newIndex));
                    }
                    return true;
                }

                $select.searchInputElement.on('keydown', function (e) {
                    var key = e.which;
                    scope.$apply(function () {
                        var processed = false;
                        if (KEY.isHorizontalMovement(key)) {
                            processed = _handleMatchSelection(key);
                        }
                        if (processed && key != KEY.TAB) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    });
                });

                $select.searchInputElement.on('blur', function () {
                    $timeout(function () {
                        $select.activeMatchIndex = -1;
                    });
                });

                ngModel.$isEmpty = function (value) {
                    return !value || value.length === 0;
                };
                ngModel.$render = function () {
                    // Make sure that model value is array
                    if (!angular.isArray(ngModel.$viewValue)) {
                        // Have tolerance for null or undefined values
                        if (angular.isUndefined(ngModel.$viewValue) || ngModel.$viewValue === null) {
                            ngModel.$viewValue = [];
                        } else {
                            throw Error('multiarr', "Expected model value to be array but got '{0}'");
                        }
                    }
                    //单个选择的时候初始话
                    if ($select.isSample && ngModel.$viewValue && ngModel.$viewValue.length === 1) {
                        scope.$broadcast('uis:select', ngModel.$viewValue[0]);
                    }
                    $select.selected = ngModel.$viewValue;
                    scope.$evalAsync(); //To force $digest
                };
                // From model --> view
                ngModel.$formatters.unshift(function (inputValue) {
                    return inputValue;
                });
            }
        };
    }]);

    angular.module("ui.myAutoComplete").run(["$templateCache", function ($templateCache) {
        $templateCache.put('/autocomplete/main.tpl.html', '\n                            <div class="ui-select-container ui-select-multiple ui-select-bootstrap dropdown form-control direction-up"\n                                ng-class="{open:$autoCom.isOpen}"\n                            >\n                                <div>\n                                    <span class="ui-select-match"></span>\n                                    <span class="ui-select-add iconfont icon-plus" ng-show="!$autoCom.isSample && !$autoCom.showAdd" ng-click="$autoCom.add()"></span>\n                                    <input type="search"\n                                    autocomplete="off"\n                                    class="ui-select-search"\n                                    ng-show="$autoCom.isSample || $autoCom.showAdd"\n                                    auto-pointer"\n                                    placeholder="{{$autoCom.placeholder}}"\n                                    name="{{$autoCom.inputName}}"\n                                    ng-model="$autoCom.searchVal"\n                                    >\n                                </div>\n                                <div class="ui-select-choices"></div>\n                            </div>');
    }]);

    angular.module("ui.myAutoComplete").run(["$templateCache", function ($templateCache) {
        $templateCache.put('/autocomplete/list.tpl.html', '\n                            <ul class="ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu" ng-show="$autoCom.listItemData && $autoCom.listItemData.length">\n                                    <li class="ui-select-choices-group">\n                                        <div class="ui-select-choices-group-label dropdown-header"></div>\n                                        <div\n                                            ng-repeat="item in $autoCom.listItemData"\n                                            ng-class="{\'ui-select-choices-row\':true, active:$index===$autoCom.activeIndex, disabled: $autoCom.isDisabled(this)}"\n                                            ng-click="$autoCom.selectItem($index)"\n                                         >\n                                            <span class="ui-select-choices-row-inner" data-id="{{item.id}}">\n                                                <div uis-my-transclude-append></div>\n                                            </span>\n                                        </div>\n                                    </li>\n                                </ul>');
    }]);

    angular.module("ui.myAutoComplete").run(["$templateCache", function ($templateCache) {
        $templateCache.put('/autocomplete/SelectMultiple.tpl.html', '\n                            <span class="ui-select-match" ng-show="$autoCom.selected.length  && !$autoCom.isSample">\n                                <span ng-repeat="$item in $autoCom.selected track by $index">\n                                    <span\n                                        class="ui-select-match-item btn btn-default btn-xs"\n                                        tabindex="-1"\n                                        type="button"\n                                        ng-click="$selectedItemList.activeMatchIndex = $index;"\n                                        ng-class="{\'btn-primary\':$selectedItemList.activeMatchIndex === $index}"\n                                    >\n                                        <span uis-my-transclude-append class="ui-select-match-content"></span>\n                                        <span\n                                            class="close ui-select-match-close ui-select-remove iconfont icon-reduce"\n                                            ng-hide="$autoCom.disabled"\n                                            ng-click="$selectedItemList.removeChoice($index)"\n                                        ></span>\n                                    </span>\n                                </span>\n                            </span>');
    }]);
});
//# sourceMappingURL=index.js.map
;

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
 * @date            2016-08-31 19:08:41
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/service/service',['require','exports','module','../utils'],function (require, exports, module) {
    var utils = require('../utils');
    return function (app) {
        app.factory('mypagination', function () {
            var obj = {
                initList: function ($http, $rootScope, $timeout, $scope) {
                    var initData = utils.getHashData();
                    $scope.searchText = initData.searchText || '';
                    $scope.getExtendData = function () {
                        return {
                            searchText: $scope.searchText,
                            type: $scope.type,
                            docType: utils.getHashData().docType
                        }
                    }
                    $scope.$on('data', function (e, data) {
                        angular.extend($scope, data);
                    });
                    $rootScope.$on('menu.filterData', function () {
                        $scope.getData();
                    });
                    obj.initPageination($http, $rootScope, $timeout, $scope);
                    $scope.getData(utils.getHashData());
                    $scope.isSetHash = true;
                },
                initPageination: function ($http, $rootScope, $timeout, $scope) {
                    var initData = utils.getHashData();
                    $scope.pageSize = (initData.size | 0) || 10;
                    $scope.currentPage = (initData.page | 0) || 1;
                    $scope.totalItems = 100000;
                    $scope.pageSizeOptions = [10, 20, 30, 50];
                    $scope.maxSize = 5;
                    $scope.totalPage = 0;
                    $scope.jumpPageNum = '';
                    $scope.pageSizeOptions.indexOf($scope.pageSize) < 0 && ($scope.pageSize = 10)

                    //缓存搜索文本
                    $scope.oldSearchText = '';
                    var setHash = function (obj) {
                        var hashStr = '';
                        for (var key in obj) {
                            if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
                                hashStr += (key + "=" + (typeof obj[key] === 'object' ? encodeURIComponent(JSON.stringify(obj[key])) : obj[key]) + "&");
                            }
                        }
                        location.hash = '?' + hashStr.replace(/&$/, '');
                    }

                    $scope.keyUp = function ($event) {
                        if ($event.keyCode !== 13 || $scope.searchText === $scope.oldSearchText) {
                            return;
                        }
                        $scope.oldSearchText = $scope.searchText;
                        $scope.currentPage = 1;
                        $scope.getData();
                    };

                    $scope.jumpPage = function ($event) {
                        if ($event && $event.keyCode !== 13) {
                            return;
                        }
                        var pageNum = parseInt($scope.jumpPageNum, 10);
                        if (isNaN(pageNum) || pageNum === $scope.currentPage || pageNum <= 0) {
                            $scope.jumpPageNum = '';
                            return;
                        }
                        if (pageNum >= $scope.totalPage) {
                            pageNum = $scope.totalPage;
                        }
                        $scope.currentPage = pageNum;
                        $scope.getData();
                        $scope.jumpPageNum = '';
                    };

                    $scope.changePageSize = function () {
                        $scope.getData();
                    };

                    var that = $scope;
                    $scope.getData = function (obj) {
                        $scope.isShow = false;
                        var paramsData = {
                            page: $scope.currentPage,
                            size: $scope.pageSize
                        };
                        if (angular.isFunction($scope.getExtendData)) {
                            paramsData = angular.extend({}, $scope.getExtendData() || {}, paramsData);
                        }
                        if (Object.keys(obj || {}).length) {
                            angular.extend(paramsData, obj);
                        }
                        return $http({
                            url: $scope.getDataUrl,
                            method: "GET",
                            params: paramsData
                        }).success(function (response) {
                            if (String(response.errno) !== '0') {
                                console.log('error');
                                return;
                            }
                            $rootScope.$broadcast('data', {
                                datas: response.data,
                                totalItems: response.total || 0,
                                totalPage: Math.ceil(response.total / that.pageSize)
                            });
                            $scope.isSetHash === true && $timeout(function () {
                                setHash(paramsData);
                                $scope.isShow = true;
                            });
                        });
                    };
                }
            };
            return obj;
        });
    }
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
 * @date            2016-10-26 17:48:26
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/filter/application-filter',['require','exports','module'],function (require, exports, module) {
    var mapData = {
        dataConsumerMap: ['公安部', '检察院', '法院', '交通委', '其他'],
        dataTypeMap: ['订单相关汇总类数据', '补贴和定价策略相关数据', '财务报表类数据', '其它有争议数据', '司机三证和背景调查信息'],
        dataProvideMethodMap: ['API接口', '邮件发送', '线下传递', '其他'],
        dataVolumeMap: ['>=50万', '<50万']
    };

    return function (app) {
        app.filter('getKeysJoin', function () {
            return function (data, key, separator) {
                return data.map(function (val) {
                    return val[key];
                }).join(separator || ',');
            }
        });
        for (var key in mapData) {
            if (!mapData.hasOwnProperty(key)) {
                continue;
            }
            (function (data, key) {
                app.filter(key.replace('Map', ''), function () {
                    return function (index) {
                        return data[index | 0];
                    }
                });
            }(mapData[key], key))

        }
        app.filter('getRedirectPage', function () {
            return function (data) {
                data = data | 0
                if (!data) {
                    return 'application-detail'
                }
                if (~[1, 5].indexOf(data)) {
                    return 'hole-edit';
                }
                if (~[200].indexOf(data)) {
                    return 'alarm-order-detail';
                }
                if (~[201].indexOf(data)) {
                    return 'alarm-order-edit';
                }
                return 'hole-detail';
            }
        });
    }
});
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
define('js/common/app-list-init',['require','exports','module','./service/service','../../common/directive/loading/loading','./filter/application-filter','./filter/filter'],function (require, exports, module) {
    return function (app) {
        require('./service/service')(app);
        require('../../common/directive/loading/loading')(app);
        require('./filter/application-filter')(app);
        require('./filter/filter')(app);
    }
});
'use strict';
/**
 * author           xj
 * @date            2016-12-19 10:46:53
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/bug-list/index',['require','exports','module','../common/utils','../common/form/slideForm','./../common/get-buttons-html','./../bug/init-page-select','./../common/init-range-time/index','./../common/init-range-time/transfer-time','../../common/upload-excel/index','./../bug/page-config','./../common/add-water-mark','../../common/angular-bootstrap-datepicker-ppopup/angular-bootstrap-datepicker-ppopup','../../common/angular-pagination/index','../../common/angular-select/index','../../../../lib/angular-dialog/index','../../common/autocomplete-muti/index','../common/app','../common/app-list-init'],function (require, exports, module) {
    var utils = require('../common/utils');
    var slideForm = require('../common/form/slideForm');
    var getButtonsHtml = require('./../common/get-buttons-html');
    var initPageSelect = require('./../bug/init-page-select');
    var initDatetimepickerPop = require('./../common/init-range-time/index');
    var transferTime = require('./../common/init-range-time/transfer-time');
    var uploadExcel = require('../../common/upload-excel/index');
    var config = require('./../bug/page-config');
    var addWaterMark = require('./../common/add-water-mark')

    require('../../common/angular-bootstrap-datepicker-ppopup/angular-bootstrap-datepicker-ppopup');
    require('../../common/angular-pagination/index');
    require('../../common/angular-select/index');
    require('../../../../lib/angular-dialog/index');
    require('../../common/autocomplete-muti/index');

    var app = require('../common/app');
    app.requires.push('ui.bootstrap-pagination', 'ui.myAutoComplete', 'ui.bootstrap-datepickerPopup', 'ui.select', 'ngSanitize', 'ngDialog', 'angular-bind-html-compile');
    require('../common/app-list-init')(app);

    app.controller('bug-list', ['$rootScope', '$scope', '$http', '$timeout', 'mypagination', 'ngDialog',
        function ($rootScope, $scope, $http, $timeout, mypagination, ngDialog) {
            addWaterMark($rootScope)
            function transferState(data, states) {
                var state = data.holeState
                if (state) {
                    data.holeState = state.split(',').map(function(item) {
                        return states[item]
                    })
                }
                return data
            }

            $scope.itemArray = [
                { id: 1, name: 'first' },
                { id: 2, name: 'second' },
                { id: 3, name: 'third' },
                { id: 4, name: 'fourth' },
                { id: 5, name: 'fifth' },
            ];

            var ctrl = this;

            //获取产品线
            ctrl.getDepartmentUrl = '/process/department';
            ctrl.deptInfo = []

            ctrl.pageConfig = {
                holeState: ['待确认', '待修复', '待修复且延期中', '修复中', '修复中且延期中', '已修复', '确认不修复', '验证不修复', '不修复结束', '修复完成', '确认被忽略', '已忽略'].map(function(state, index) {return {value: index, name: state}}),
                riskLevel: config.riskLevel
            };

            var initData = transferState(utils.getHashData(), ctrl.pageConfig.holeState);

            ctrl.pageData = angular.extend({
                page: 1,
                size: 10
            }, transferTime(initData));

            ctrl.isSubmitDataIng = false;
            //初始话页面下拉框，动态获取数据，并且级联
            initPageSelect(ctrl, $http, $timeout, $scope);
            ctrl.holeType1Change(function () {
                //init isApp  
                angular.element(document.getElementById('js-holeType')).triggerHandler('change');
            });
            //get holesource
            ctrl.holeSource1Change();

            slideForm($scope);
            var filterPickerData = initDatetimepickerPop(ctrl, $scope);
            getButtonsHtml($rootScope, $scope, {
                批量导入: '<a href="javascript:" class="p-btn i-fr upload-file"><input id="js-upload" type="file" name="filename" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">批量导入</a>',
            }, function () {
                $timeout(function () {
                    uploadExcel('#js-upload', function (fileData) {
                        var formData = new FormData();
                        formData.append('filename', fileData);
                        $http({
                                method: 'POST',
                                url: '/hole/batchImport',
                                data: formData,
                                headers: {
                                    'Content-Type': undefined
                                },
                                transformRequest: angular.identity
                            })
                            .success(function (res) {
                                if (String(res.errno) !== '0') {
                                    ngDialog.open({
                                        template: '<p style="text-align:center;margin-bottom: 0;">' + (res.errmsg || "导入失败，可能是数据有问题") + '</p>',
                                        plain: true
                                    });
                                    return;
                                }
                                var dialog = ngDialog.open({
                                    template: '<p style="text-align:center;margin-bottom: 0;">导入数据成功</p>',
                                    plain: true,
                                    width: 200
                                });
                                setTimeout(function () {
                                    dialog.close()
                                }, 2000);
                            });
                    });

                })
            })

            $scope.getDataUrl = '/hole/getHoleList';
            $scope.type = initData.type || '';
            $scope.activeIndex = initData.type | 0;

            $scope.resetForm = function () {
                for (var key in ctrl.pageData) {
                    ctrl.pageData[key] = '';
                }
                ctrl.deptInfo = []
                $scope.currentPage = 1;
                $scope.getData();
            };

            var filterData = function (pageData) {
                var data = filterPickerData(pageData);
                delete data.size
                delete data.page
                return data;
            }
            $rootScope.showLoading = false;
            $scope.getExtendData = function () {
                var _holeState = ''
                $rootScope.showLoading = true;
                if (angular.isArray(ctrl.pageData.holeState)) {
                    _holeState = ctrl.pageData.holeState.map(function(state){ return state.value}).join(',')
                }
                ctrl.pageData.deptId = ctrl.deptInfo.length === 1 ? ctrl.deptInfo[0].productId : undefined 
                return angular.extend(filterData(ctrl.pageData), {
                    type: $scope.type,
                    holeState: _holeState
                });
            };
            $scope.$on('data', function (e, data) {
                $rootScope.showLoading = false;
                angular.extend($scope, data);
            });

            $scope.filterDataAndIndex = function (index) {
                $scope.activeIndex = index;
                if (index === 0) {
                    $scope.type = '';
                } else {
                    $scope.type = index;
                }
                $scope.getData();
            };

            mypagination.initPageination($http, $rootScope, $timeout, $scope);
            //init getdata
            $scope.getData();
            $scope.isSetHash = true;
        }
    ]);
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['myApp']);
    });
});

(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('.uib-datepicker-popup{line-height:1.42857143;}.uib-datepicker-popup.dropdown-menu{display:block;float:none;margin:0;}.uib-button-bar{padding:10px 9px 2px;}.uib-datepicker .uib-title{width:100%;}.uib-day button,.uib-month button,.uib-year button{min-width:100%;}.uib-left,.uib-right{width:100%}.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}.pagination{display:inline-block;padding-left:0;margin:20px 0;border-radius:4px}.pagination>li{display:inline}.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:6px 12px;margin-left:-1px;line-height:1.42857143;color:#337ab7;text-decoration:none;background-color:#fff;border:1px solid #ddd}.pagination>li:first-child>a,.pagination>li:first-child>span{margin-left:0;border-top-left-radius:4px;border-bottom-left-radius:4px}.pagination>li:last-child>a,.pagination>li:last-child>span{border-top-right-radius:4px;border-bottom-right-radius:4px}.pagination>li>a:focus,.pagination>li>a:hover,.pagination>li>span:focus,.pagination>li>span:hover{z-index:3;color:#23527c;background-color:#eee;border-color:#ddd}.pagination>.active>a,.pagination>.active>a:focus,.pagination>.active>a:hover,.pagination>.active>span,.pagination>.active>span:focus,.pagination>.active>span:hover{z-index:2;color:#fff;cursor:default;background-color:#337ab7;border-color:#337ab7}.pagination>.disabled>a,.pagination>.disabled>a:focus,.pagination>.disabled>a:hover,.pagination>.disabled>span,.pagination>.disabled>span:focus,.pagination>.disabled>span:hover{color:#777;cursor:not-allowed;background-color:#fff;border-color:#ddd}.pagination-lg>li>a,.pagination-lg>li>span{padding:10px 16px;font-size:18px;line-height:1.3333333}.pagination-lg>li:first-child>a,.pagination-lg>li:first-child>span{border-top-left-radius:6px;border-bottom-left-radius:6px}.pagination-lg>li:last-child>a,.pagination-lg>li:last-child>span{border-top-right-radius:6px;border-bottom-right-radius:6px}.pagination-sm>li>a,.pagination-sm>li>span{padding:5px 10px;font-size:12px;line-height:1.5}.pagination-sm>li:first-child>a,.pagination-sm>li:first-child>span{border-top-left-radius:3px;border-bottom-left-radius:3px}.pagination-sm>li:last-child>a,.pagination-sm>li:last-child>span{border-top-right-radius:3px;border-bottom-right-radius:3px}.ui-select-container,.ui-select-container .dropdown-menu{font-size:12px}.ui-select-highlight{font-weight:bold;}.ui-select-offscreen{clip:rect(0 0 0 0) !important;width:1px !important;height:1px !important;border:0 !important;margin:0 !important;padding:0 !important;overflow:hidden !important;position:absolute !important;outline:0 !important;left:0px !important;top:0px !important;}.ui-select-choices-row:hover{background-color:#f5f5f5;}.ng-dirty.ng-invalid>a.select2-choice{border-color:#D44950;}.select2-result-single{padding-left:0;}.select2-locked>.select2-search-choice-close{display:none;}.select-locked>.ui-select-match-close{display:none;}body>.select2-container.open{z-index:9999;}.ui-select-container[theme=\"select2\"].direction-up .ui-select-match,.ui-select-container.select2.direction-up .ui-select-match{border-radius:4px;border-top-left-radius:0;border-top-right-radius:0;}.ui-select-container[theme=\"select2\"].direction-up .ui-select-dropdown,.ui-select-container.select2.direction-up .ui-select-dropdown{border-radius:4px;border-bottom-left-radius:0;border-bottom-right-radius:0;border-top-width:1px;border-top-style:solid;box-shadow:0 -4px 8px rgba(0,0,0,0.25);margin-top:-4px;}.ui-select-container[theme=\"select2\"].direction-up .ui-select-dropdown .select2-search,.ui-select-container.select2.direction-up .ui-select-dropdown .select2-search{margin-top:4px;}.ui-select-container[theme=\"select2\"].direction-up.select2-dropdown-open .ui-select-match,.ui-select-container.select2.direction-up.select2-dropdown-open .ui-select-match{border-bottom-color:#5897fb;}.ui-select-container[theme=\"select2\"] .ui-select-dropdown .ui-select-search-hidden,.ui-select-container[theme=\"select2\"] .ui-select-dropdown .ui-select-search-hidden input{opacity:0;height:0;min-height:0;padding:0;margin:0;border:0;}.selectize-input.selectize-focus{border-color:#007FBB !important;}.selectize-control.single>.selectize-input>input{width:100%;}.selectize-control.multi>.selectize-input>input{margin:0 !important;}.selectize-control>.selectize-dropdown{width:100%;}.ng-dirty.ng-invalid>div.selectize-input{border-color:#D44950;}.ui-select-container[theme=\"selectize\"].direction-up .ui-select-dropdown{box-shadow:0 -4px 8px rgba(0,0,0,0.25);margin-top:-2px;}.ui-select-container[theme=\"selectize\"] input.ui-select-search-hidden{opacity:0;height:0;min-height:0;padding:0;margin:0;border:0;width:0;}.btn-default-focus{color:#333;background-color:#EBEBEB;border-color:#ADADAD;text-decoration:none;outline:5px auto -webkit-focus-ring-color;outline-offset:-2px;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(102,175,233,0.6);}.ui-select-bootstrap .ui-select-toggle{position:relative;}.ui-select-bootstrap .ui-select-toggle>.caret{position:absolute;height:10px;top:50%;right:10px;margin-top:-2px;}.input-group>.ui-select-bootstrap.dropdown{position:static;}.input-group>.ui-select-bootstrap>input.ui-select-search.form-control{border-radius:4px;border-top-right-radius:0;border-bottom-right-radius:0;}.input-group>.ui-select-bootstrap>input.ui-select-search.form-control.direction-up{border-radius:4px !important;border-top-right-radius:0 !important;border-bottom-right-radius:0 !important;}.ui-select-bootstrap .ui-select-search-hidden{opacity:0;height:0;min-height:0;padding:0;margin:0;border:0;}.ui-select-bootstrap>.ui-select-match>.btn{text-align:left !important;}.ui-select-bootstrap>.ui-select-match>.caret{position:absolute;top:45%;right:15px;}.ui-select-bootstrap>.ui-select-choices,.ui-select-bootstrap>.ui-select-no-choice{width:100%;height:auto;max-height:200px;overflow-x:hidden;margin-top:-1px;}body>.ui-select-bootstrap.open{z-index:1000;}.ui-select-multiple.ui-select-bootstrap{height:auto;padding:0 10px;}.ui-select-multiple.ui-select-bootstrap input.ui-select-search{height:35px;padding:6px 0;background-color:transparent !important;border:none;outline:none;margin-bottom:3px;}.ui-select-multiple.ui-select-bootstrap input.ui-select-search::-moz-placeholder{color:#98999e;opacity:1;}.ui-select-multiple.ui-select-bootstrap input.ui-select-search:-ms-input-placeholder{color:#98999e;}.ui-select-multiple.ui-select-bootstrap input.ui-select-search::-webkit-input-placeholder{color:#98999e;}.ui-select-multiple.ui-select-bootstrap .ui-select-match .close{font-size:1.6em;line-height:0.75;}.ui-select-multiple.ui-select-bootstrap .ui-select-match-item{outline:0;margin:0 3px 3px 0;}.ui-select-multiple .ui-select-match-item{position:relative;}.ui-select-multiple .ui-select-match-item.dropping .ui-select-match-close{pointer-events:none;}.ui-select-multiple:hover .ui-select-match-item.dropping-before:before{content:\"\";position:absolute;top:0;right:100%;height:100%;margin-right:2px;border-left:1px solid #428bca;}.ui-select-multiple:hover .ui-select-match-item.dropping-after:after{content:\"\";position:absolute;top:0;left:100%;height:100%;margin-left:2px;border-right:1px solid #428bca;}.ui-select-bootstrap .ui-select-choices-row>span{cursor:pointer;display:block;padding:3px 20px;clear:both;font-weight:400;line-height:1.42857143;color:#333;white-space:nowrap;}.ui-select-bootstrap .ui-select-choices-row>span:hover,.ui-select-bootstrap .ui-select-choices-row>span:focus{text-decoration:none;color:#262626;background-color:#f5f5f5;}.ui-select-bootstrap .ui-select-choices-row.active>span{color:#fff;text-decoration:none;outline:0;background-color:#428bca;}.ui-select-bootstrap .ui-select-choices-row.disabled>span,.ui-select-bootstrap .ui-select-choices-row.active.disabled>span{color:#777;cursor:not-allowed;background-color:#fff;}.ui-select-match.ng-hide-add,.ui-select-search.ng-hide-add{display:none !important;}.ui-select-bootstrap.ng-dirty.ng-invalid>button.btn.ui-select-match{border-color:#D44950;}.ui-select-container[theme=\"bootstrap\"].direction-up .ui-select-dropdown{box-shadow:0 -4px 8px rgba(0,0,0,0.25);}.ui-select-bootstrap .ui-select-match-text{width:100%;padding-right:1em;}.ui-select-bootstrap .ui-select-match-text span{display:inline-block;width:100%;overflow:hidden;}.ui-select-bootstrap .ui-select-toggle>a.btn{position:absolute;height:10px;right:10px;margin-top:-2px;}.ui-select-refreshing.glyphicon{position:absolute;right:0;padding:8px 27px;}@-webkit-keyframes ui-select-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg);}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg);}}@keyframes ui-select-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg);}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg);}}.ui-select-spin{-webkit-animation:ui-select-spin 2s infinite linear;animation:ui-select-spin 2s infinite linear;}.ui-select-refreshing.ng-animate{-webkit-animation:none 0s;}@-webkit-keyframes ngdialog-fadeout{0%{opacity:1}100%{opacity:0}}@keyframes ngdialog-fadeout{0%{opacity:1}100%{opacity:0}}@-webkit-keyframes ngdialog-fadein{0%{opacity:0}100%{opacity:1}}@keyframes ngdialog-fadein{0%{opacity:0}100%{opacity:1}}.ngdialog{box-sizing:border-box}.ngdialog *,.ngdialog :after,.ngdialog :before{box-sizing:inherit}.ngdialog{position:fixed;overflow:auto;-webkit-overflow-scrolling:touch;z-index:10000;top:0;right:0;bottom:0;left:0}.ngdialog.ngdialog-disabled-animation,.ngdialog.ngdialog-disabled-animation .ngdialog-content,.ngdialog.ngdialog-disabled-animation .ngdialog-overlay{-webkit-animation:none!important;animation:none!important}.ngdialog-overlay{position:fixed;background:rgba(0,0,0,.4);top:0;right:0;bottom:0;left:0;-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadein .5s;animation:ngdialog-fadein .5s}.ngdialog-no-overlay{pointer-events:none}.ngdialog.ngdialog-closing .ngdialog-overlay{-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadeout .5s;animation:ngdialog-fadeout .5s}.ngdialog-content{background:#fff;-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadein .5s;animation:ngdialog-fadein .5s;pointer-events:all}.ngdialog.ngdialog-closing .ngdialog-content{-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadeout .5s;animation:ngdialog-fadeout .5s}.ngdialog-close:before{font-family:Helvetica,Arial,sans-serif;content:\'\\00D7\';cursor:pointer}body.ngdialog-open,html.ngdialog-open{overflow:initial}@-webkit-keyframes ngdialog-flyin{0%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes ngdialog-flyin{0%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@-webkit-keyframes ngdialog-flyout{0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}}@keyframes ngdialog-flyout{0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}}.ngdialog.ngdialog-theme-default{padding-bottom:160px;padding-top:160px}.ngdialog.ngdialog-theme-default.ngdialog-closing .ngdialog-content{-webkit-animation:ngdialog-flyout .5s;animation:ngdialog-flyout .5s}.ngdialog.ngdialog-theme-default .ngdialog-content{-webkit-animation:ngdialog-flyin .5s;animation:ngdialog-flyin .5s;background:#f0f0f0;border-radius:5px;color:#444;font-family:Helvetica,sans-serif;font-size:1.1em;line-height:1.5em;margin:0 auto;max-width:100%;padding:1em;position:relative;width:450px}.ngdialog.ngdialog-theme-default .ngdialog-close{padding:0;border:none;border-radius:5px;cursor:pointer;position:absolute;right:0;top:0}.ngdialog.ngdialog-theme-default .ngdialog-close:before{background:0 0;border-radius:3px;color:#bbb;content:\'\\00D7\';font-size:26px;font-weight:400;height:30px;line-height:26px;position:absolute;right:3px;text-align:center;top:3px;width:30px}.ngdialog.ngdialog-theme-default .ngdialog-close:active:before,.ngdialog.ngdialog-theme-default .ngdialog-close:hover:before{color:#777}.ngdialog.ngdialog-theme-default .ngdialog-message{margin-bottom:.5em}.ngdialog.ngdialog-theme-default .ngdialog-input{margin-bottom:1em}.ngdialog.ngdialog-theme-default .ngdialog-input input[type=email],.ngdialog.ngdialog-theme-default .ngdialog-input input[type=password],.ngdialog.ngdialog-theme-default .ngdialog-input input[type=text],.ngdialog.ngdialog-theme-default .ngdialog-input input[type=url],.ngdialog.ngdialog-theme-default .ngdialog-input textarea{background:#fff;border:0;border-radius:3px;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0 0 .25em;min-height:2.5em;padding:.25em .67em;width:100%}.ngdialog.ngdialog-theme-default .ngdialog-input input[type=email]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input input[type=password]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input input[type=text]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input input[type=url]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input textarea:focus{box-shadow:inset 0 0 0 2px #8dbdf1;outline:0}.ngdialog.ngdialog-theme-default .ngdialog-buttons:after{content:\'\';display:table;clear:both}.ngdialog.ngdialog-theme-default .ngdialog-button{border:0;border-radius:3px;cursor:pointer;float:right;font-family:inherit;font-size:.8em;letter-spacing:.1em;line-height:1em;margin:0 0 0 .5em;padding:.75em 2em;text-transform:uppercase}.ngdialog.ngdialog-theme-default .ngdialog-button:focus{-webkit-animation:ngdialog-pulse 1.1s infinite;animation:ngdialog-pulse 1.1s infinite;outline:0}@media (max-width:568px){.ngdialog.ngdialog-theme-default .ngdialog-button:focus{-webkit-animation:none;animation:none}}.ngdialog.ngdialog-theme-default .ngdialog-button.ngdialog-button-primary{background:#3288e6;color:#fff}.ngdialog.ngdialog-theme-default .ngdialog-button.ngdialog-button-secondary{background:#e0e0e0;color:#777}.ngdialog.ngdialog-theme-plain{padding-bottom:160px;padding-top:160px}.ngdialog.ngdialog-theme-plain .ngdialog-content{background:#fff;color:#444;font-family:\'Helvetica Neue\',sans-serif;font-size:1.1em;line-height:1.5em;margin:0 auto;max-width:100%;padding:1em;position:relative;width:450px}.ngdialog.ngdialog-theme-plain .ngdialog-content h1,.ngdialog.ngdialog-theme-plain .ngdialog-content h2,.ngdialog.ngdialog-theme-plain .ngdialog-content h3,.ngdialog.ngdialog-theme-plain .ngdialog-content h4,.ngdialog.ngdialog-theme-plain .ngdialog-content h5,.ngdialog.ngdialog-theme-plain .ngdialog-content h6,.ngdialog.ngdialog-theme-plain .ngdialog-content li,.ngdialog.ngdialog-theme-plain .ngdialog-content p,.ngdialog.ngdialog-theme-plain .ngdialog-content ul{color:inherit}.ngdialog.ngdialog-theme-plain .ngdialog-close{cursor:pointer;position:absolute;right:0;top:0}.ngdialog.ngdialog-theme-plain .ngdialog-close:before{background:0 0;color:#bbb;content:\"\\00D7\";font-size:26px;font-weight:400;height:30px;line-height:26px;position:absolute;right:3px;text-align:center;top:3px;width:30px}.ngdialog.ngdialog-theme-plain .ngdialog-close:active:before,.ngdialog.ngdialog-theme-plain .ngdialog-close:hover:before{color:#777}.ngdialog.ngdialog-theme-plain .ngdialog-message{margin-bottom:.5em}.ngdialog.ngdialog-theme-plain .ngdialog-input{margin-bottom:1em}.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=email],.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=password],.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=text],.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=url],.ngdialog.ngdialog-theme-plain .ngdialog-input textarea{background:#f0f0f0;border:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0 0 .25em;min-height:2.5em;padding:.25em .67em;width:100%}.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=email]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=password]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=text]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=url]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input textarea:focus{box-shadow:inset 0 0 0 2px rgba(0,0,0,.2);outline:0}.ngdialog.ngdialog-theme-plain .ngdialog-buttons:after{clear:both;content:\'\';display:table}.ngdialog.ngdialog-theme-plain .ngdialog-button{border:0;cursor:pointer;float:right;font-family:inherit;font-size:.8em;letter-spacing:.1em;line-height:1em;margin:0 0 0 .5em;padding:.75em 2em;text-transform:uppercase}.ngdialog.ngdialog-theme-plain .ngdialog-button:focus{-webkit-animation:ngdialog-pulse 1.1s infinite;animation:ngdialog-pulse 1.1s infinite;outline:0}@media (max-width:568px){.ngdialog.ngdialog-theme-plain .ngdialog-button:focus{-webkit-animation:none;animation:none}}.ngdialog.ngdialog-theme-plain .ngdialog-button.ngdialog-button-primary{background:#3288e6;color:#fff}.ngdialog.ngdialog-theme-plain .ngdialog-button.ngdialog-button-secondary{background:#e0e0e0;color:#777}@charset \"UTF-8\";.header:before,.header-right:before,.header:after,.header-right:after{content:\"\";display:table;}.header:after,.header-right:after{clear:both;}dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:\'...\\A..\\A.\';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.header{min-width:1100px;width:100%;height:70px;border-bottom:solid 1px #d4d6db;color:#262626;box-shadow:0 1px 2px 1px #f1f1f1;}.logo{margin-left:35px;line-height:70px;display:inline-block;background:url(/project/portals/i/logo.png?v=953c28) 0 center no-repeat;background-size:35px auto;font-size:22px;padding-left:41px;color:#262626;vertical-align:middle;cursor:pointer;text-decoration:none;}.logo:hover{text-decoration:none;color:#262626;}.header-list > li .p-dropdown,.header-right .msg .p-dropdown,.header-right .user .p-dropdown{display:block;position:absolute;width:160px;top:62px;left:50%;transition:transform 0.25s cubic-bezier(0.18,0.89,0.32,1.28);transform-origin:center top;transform:translate(-50%) scaleY(0);}.header-list > li:hover .p-dropdown,.header-right .msg:hover .p-dropdown,.header-right .wrap-user-img:hover .p-dropdown{transform:translate(-50%) scaleY(1);}.header-list{font-size:16px;display:inline-block;vertical-align:middle;margin-left:75px;list-style:none outside none;margin-bottom:0;}.header-list > li{padding:0 10px;margin-right:30px;float:left;line-height:70px;position:relative;cursor:pointer;}.header-list > li:last-child{margin-right:0;}.header-list > li:hover > a,.header-list > li.hover > a{color:#528be6;text-decoration:none;}.header-list > li:hover > i,.header-list > li.hover > i{left:0;right:0;}.header-list > li > a{transition:color .3s ease-out;color:#262626;display:block;text-align:center;line-height:70px;text-decoration:none;}.header-list > li > i{position:absolute;bottom:10px;left:50%;right:50%;height:4px;font-size:0;background-color:#528be6;transition-property:left,right;transition-duration:.3s;transition-timing-function:ease-out;}.header-right{line-height:70px;height:70px;font-size:0;margin-right:16px;float:right;}.header-right .msg{position:relative;color:#262626;line-height:70px;font-size:14px;float:left;cursor:pointer;}.header-right .msg a{text-decoration:none;color:#262626;}.header-right .msg b{font-weight:normal;color:#fa9027;margin-left:6px;}.header-right .wrap-user-img{float:left;}.header-right .wrap-user-img:hover .user:before{transform:rotate(-45deg);top:60%;}.header-right .wrap-img{float:left;height:70px;margin-left:46px;padding-top:15px;cursor:pointer;}.header-right .wrap-img img{vertical-align:top;border-radius:50%;width:40px;height:40px;}.header-right .user{padding-left:11px;margin-right:58px;cursor:pointer;position:relative;height:70px;float:left;}.header-right .user:before{content:\'\';display:block;width:8px;height:8px;border:solid #d8d8d8;border-width:2px 2px 0 0;position:absolute;top:50%;z-index:1;transform:rotate(135deg);}.header-right .user:before{right:-20px;margin-top:-5px;transition:all .3s linear;}.header-right .user .name{display:inline-block;vertical-align:middle;color:#343434;font-size:14px;}.p-dropdown{padding:6px 0;border-radius:8px;background-color:#ffffff;box-shadow:0 0 2px 2px #f1f1f1;position:relative;list-style:none outside none;z-index:1000;}.p-dropdown:before{content:\'\';position:absolute;top:-2px;left:50%;z-index:10;width:10px;height:10px;background-color:#fff;border:solid #f0f0f0;border-width:1px 0 0 1px;box-shadow:-1px -1px 2px #f1f1f1;transform:rotate(45deg) translate(-50%);}.p-dropdown > .list-item,.p-dropdown > li{color:#262626;font-size:14px;line-height:35px;padding:0 16px;}.p-dropdown > .list-item:hover,.p-dropdown > li:hover{background-color:#f5f5f5;}.p-dropdown > .list-item:last-child,.p-dropdown > li:last-child{border-radius:0 0 4px 4px;}.p-dropdown > .list-item:first-child,.p-dropdown > li:first-child{border-radius:4px 4px 0 0;}.p-dropdown > .list-item a,.p-dropdown > li a{color:#262626;}.p-dropdown > .list-item a:hover,.p-dropdown > li a:hover{color:#528be6;text-decoration:none;}.p-dropdown > .list-item > b,.p-dropdown > li > b{font-weight:normal;color:#fa8919;padding-right:8px;}@media (max-width:1000px){.header-list{margin-left:0;}.header-list > li{margin-right:15px;}}@media (max-width:1200px){.header-list{margin-left:0;}.header-list > li{margin-right:18px;}}@charset \"UTF-8\";dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:\'...\\A..\\A.\';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.p-loading-wrap{}@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}.p-loading-wrap .mask{height:100%;width:100%;background-color:#fff;position:absolute;left:0;top:0;z-index:1000;}.p-loading-wrap .loading-content{z-index:1001;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;width:100%;height:32px;line-height:32px;text-align:center;vertical-align:middle;}.p-loading-wrap .loading{position:relative;display:inline-block;width:32px;height:32px;vertical-align:middle;}.p-loading-wrap .loading:after{margin:12px 12px 0;display:block;content:\'\';width:3px;height:3px;border-radius:100%;box-shadow:0 -10px 0 1px #ccc,10px 0px #ccc,0 10px #ccc,-10px 0 #ccc,-7px -7px 0 0.5px #ccc,7px -7px 0 1.5px #ccc,7px 7px #ccc,-7px 7px #ccc;animation:spin 1s steps(8) infinite;}');
