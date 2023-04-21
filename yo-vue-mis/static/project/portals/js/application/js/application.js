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

define('css!js/../../../lib/angular-dialog/css/ngDialog',[],function(){});

define('css!js/../../../lib/angular-dialog/css/ngDialog-theme-default',[],function(){});

define('css!js/../../../lib/angular-dialog/css/ngDialog-theme-plain',[],function(){});
define('js/../../../lib/angular-dialog/js/dialog',['require','exports','module'],function(e,a,n){"use strict";var o=angular.module("ngDialog",[]),l=angular.element,t=angular.isDefined,i=(document.body||document.documentElement).style,r=t(i.animation)||t(i.WebkitAnimation)||t(i.MozAnimation)||t(i.MsAnimation)||t(i.OAnimation),s="animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend",c={html:!1,body:!1},d={},g=[],u=[],m=!1,p=!1,f=[];return o.provider("ngDialog",function(){var e=this.defaults={className:"ngdialog-theme-default",appendClassName:"",disableAnimation:!1,plain:!1,showClose:!0,closeByDocument:!0,closeByEscape:!0,closeByNavigation:!1,appendTo:!1,preCloseCallback:!1,onOpenCallback:!1,overlay:!0,cache:!0,trapFocus:!0,preserveFocus:!0,ariaAuto:!0,ariaRole:null,ariaLabelledById:null,ariaLabelledBySelector:null,ariaDescribedById:null,ariaDescribedBySelector:null,bodyClassName:"ngdialog-open",width:null,height:null};this.setForceHtmlReload=function(e){c.html=e||!1},this.setForceBodyReload=function(e){c.body=e||!1},this.setDefaults=function(a){angular.extend(e,a)},this.setOpenOnePerName=function(e){p=e||!1};var a,n=0,o=0,t={};this.$get=["$document","$templateCache","$compile","$q","$http","$rootScope","$timeout","$window","$controller","$injector",function(i,v,y,b,h,D,C,$,A,S){var E=[],w={onDocumentKeydown:function(e){27===e.keyCode&&B.close("$escape")},activate:function(e){e.data("$ngDialogOptions").trapFocus&&(e.on("keydown",w.onTrapFocusKeydown),E.body.on("keydown",w.onTrapFocusKeydown))},deactivate:function(e){e.off("keydown",w.onTrapFocusKeydown),E.body.off("keydown",w.onTrapFocusKeydown)},deactivateAll:function(e){angular.forEach(e,function(e){var a=angular.element(e);w.deactivate(a)})},setBodyPadding:function(e){var a=parseInt(E.body.css("padding-right")||0,10);E.body.css("padding-right",a+e+"px"),E.body.data("ng-dialog-original-padding",a),D.$broadcast("ngDialog.setPadding",e)},resetBodyPadding:function(){var e=E.body.data("ng-dialog-original-padding");e?E.body.css("padding-right",e+"px"):E.body.css("padding-right",""),D.$broadcast("ngDialog.setPadding",0)},performCloseDialog:function(e,n){var l=e.data("$ngDialogOptions"),i=e.attr("id"),c=d[i];if(w.deactivate(e),c){if(void 0!==$.Hammer){var u=c.hammerTime;u.off("tap",a),u.destroy&&u.destroy(),delete c.hammerTime}else e.unbind("click");1===o&&E.body.unbind("keydown",w.onDocumentKeydown),e.hasClass("ngdialog-closing")||(o-=1);var p=e.data("$ngDialogPreviousFocus");p&&p.focus&&p.focus(),D.$broadcast("ngDialog.closing",e,n),o=o<0?0:o,r&&!l.disableAnimation?(c.$destroy(),e.unbind(s).bind(s,function(){w.closeDialogElement(e,n)}).addClass("ngdialog-closing")):(c.$destroy(),w.closeDialogElement(e,n)),t[i]&&(t[i].resolve({id:i,value:n,$dialog:e,remainingDialogs:o}),delete t[i]),d[i]&&delete d[i],g.splice(g.indexOf(i),1),g.length||(E.body.unbind("keydown",w.onDocumentKeydown),m=!1),0==o&&(a=void 0)}},closeDialogElement:function(e,a){var n=e.data("$ngDialogOptions");e.remove(),u.splice(u.indexOf(n.bodyClassName),1),-1===u.indexOf(n.bodyClassName)&&(E.html.removeClass(n.bodyClassName),E.body.removeClass(n.bodyClassName)),0===o&&w.resetBodyPadding(),D.$broadcast("ngDialog.closed",e,a)},closeDialog:function(e,a){var n=e.data("$ngDialogPreCloseCallback");if(n&&angular.isFunction(n)){var o=n.call(e,a);if(angular.isObject(o))o.closePromise?o.closePromise.then(function(){w.performCloseDialog(e,a)},function(){return!1}):o.then(function(){w.performCloseDialog(e,a)},function(){return!1});else{if(!1===o)return!1;w.performCloseDialog(e,a)}}else w.performCloseDialog(e,a)},onTrapFocusKeydown:function(e){var a,n=angular.element(e.currentTarget);if(n.hasClass("ngdialog"))a=n;else if(null===(a=w.getActiveDialog()))return;var o=9===e.keyCode,l=!0===e.shiftKey;o&&w.handleTab(a,e,l)},handleTab:function(e,a,n){var o=w.getFocusableElements(e);if(0!==o.length){var l=document.activeElement,t=Array.prototype.indexOf.call(o,l),i=-1===t,r=0===t,s=t===o.length-1,c=!1;n?(i||r)&&(o[o.length-1].focus(),c=!0):(i||s)&&(o[0].focus(),c=!0),c&&(a.preventDefault(),a.stopPropagation())}else document.activeElement&&document.activeElement.blur&&document.activeElement.blur()},autoFocus:function(e){var a=e[0],n=a.querySelector("*[autofocus]");if(null===n||(n.focus(),document.activeElement!==n)){var o=w.getFocusableElements(e);if(o.length>0)o[0].focus();else{var t=w.filterVisibleElements(a.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span"));if(t.length>0){var i=t[0];l(i).attr("tabindex","-1").css("outline","0"),i.focus()}}}},getFocusableElements:function(e){var a=e[0].querySelectorAll("a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]"),n=w.filterTabbableElements(a);return w.filterVisibleElements(n)},filterTabbableElements:function(e){for(var a=[],n=0;n<e.length;n++){var o=e[n];"-1"!==l(o).attr("tabindex")&&a.push(o)}return a},filterVisibleElements:function(e){for(var a=[],n=0;n<e.length;n++){var o=e[n];(o.offsetWidth>0||o.offsetHeight>0)&&a.push(o)}return a},getActiveDialog:function(){var e=document.querySelectorAll(".ngdialog");return 0===e.length?null:l(e[e.length-1])},applyAriaAttributes:function(e,a){if(a.ariaAuto){if(!a.ariaRole){var n=w.getFocusableElements(e).length>0?"dialog":"alertdialog";a.ariaRole=n}a.ariaLabelledBySelector||(a.ariaLabelledBySelector="h1,h2,h3,h4,h5,h6"),a.ariaDescribedBySelector||(a.ariaDescribedBySelector="article,section,p")}a.ariaRole&&e.attr("role",a.ariaRole),w.applyAriaAttribute(e,"aria-labelledby",a.ariaLabelledById,a.ariaLabelledBySelector),w.applyAriaAttribute(e,"aria-describedby",a.ariaDescribedById,a.ariaDescribedBySelector)},applyAriaAttribute:function(e,a,n,o){if(n)e.attr(a,n);else if(o){var t=e.attr("id"),i=e[0].querySelector(o);if(!i)return;var r=t+"-"+a;return l(i).attr("id",r),e.attr(a,r),r}},detectUIRouter:function(){return S.has("$transitions")?"1.0.0+":!!S.has("$state")&&"legacy"},getRouterLocationEventName:function(){return w.detectUIRouter()?"$stateChangeStart":"$locationChangeStart"}},B={__PRIVATE__:w,open:function(i){function r(e,a){return(a=a||{}).headers=a.headers||{},angular.extend(a.headers,{Accept:"text/html"}),D.$broadcast("ngDialog.templateLoading",e),h.get(e,a).then(function(a){return D.$broadcast("ngDialog.templateLoaded",e),a.data||""})}var s=null;if(i=i||{},!(p&&i.name&&(s=i.name.toLowerCase().replace(/\s/g,"-")+"-dialog",this.isOpen(s)))){var c=angular.copy(e),O=++n;s=s||"ngdialog"+O,g.push(s),void 0!==c.data&&(void 0===i.data&&(i.data={}),i.data=angular.merge(angular.copy(c.data),i.data)),angular.extend(c,i);var k;t[s]=k=b.defer();var F;d[s]=F=angular.isObject(c.scope)?c.scope.$new():D.$new();var N,T,x,P=angular.extend({},c.resolve);return angular.forEach(P,function(e,a){P[a]=angular.isString(e)?S.get(e):S.invoke(e,null,null,a)}),b.all({template:function(e){return e?angular.isString(e)&&c.plain?e:"boolean"!=typeof c.cache||c.cache?r(e,{cache:v}):r(e,{cache:!1}):"Empty template"}(c.template||c.templateUrl),locals:b.all(P)}).then(function(e){var n=e.template,t=e.locals;c.showClose&&(n+='<button aria-label="Dismiss" class="ngdialog-close"></button>');var i=c.overlay?"":" ngdialog-no-overlay";if((N=l('<div id="'+s+'" class="ngdialog'+i+'"></div>')).html(c.overlay?'<div class="ngdialog-overlay"></div><div class="ngdialog-content" role="document">'+n+"</div>":'<div class="ngdialog-content" role="document">'+n+"</div>"),N.data("$ngDialogOptions",c),F.ngDialogId=s,c.data&&angular.isString(c.data)){var r=c.data.replace(/^\s*/,"")[0];F.ngDialogData="{"===r||"["===r?angular.fromJson(c.data):new String(c.data),F.ngDialogData.ngDialogId=s}else c.data&&angular.isObject(c.data)&&(F.ngDialogData=c.data,F.ngDialogData.ngDialogId=s);if(c.className&&N.addClass(c.className),c.appendClassName&&N.addClass(c.appendClassName),c.width&&(x=N[0].querySelector(".ngdialog-content"),angular.isString(c.width)?x.style.width=c.width:x.style.width=c.width+"px"),c.height&&(x=N[0].querySelector(".ngdialog-content"),angular.isString(c.height)?x.style.height=c.height:x.style.height=c.height+"px"),c.disableAnimation&&N.addClass("ngdialog-disabled-animation"),T=c.appendTo&&angular.isString(c.appendTo)?angular.element(document.querySelector(c.appendTo)):E.body,w.applyAriaAttributes(N,c),[{name:"$ngDialogPreCloseCallback",value:c.preCloseCallback},{name:"$ngDialogOnOpenCallback",value:c.onOpenCallback}].forEach(function(e){if(e.value){var a;angular.isFunction(e.value)?a=e.value:angular.isString(e.value)&&F&&(angular.isFunction(F[e.value])?a=F[e.value]:F.$parent&&angular.isFunction(F.$parent[e.value])?a=F.$parent[e.value]:D&&angular.isFunction(D[e.value])&&(a=D[e.value])),a&&N.data(e.name,a)}}),F.closeThisDialog=function(e){w.closeDialog(N,e)},c.controller&&(angular.isString(c.controller)||angular.isArray(c.controller)||angular.isFunction(c.controller))){var d;c.controllerAs&&angular.isString(c.controllerAs)&&(d=c.controllerAs);var g=A(c.controller,angular.extend(t,{$scope:F,$element:N}),!0,d);c.bindToController&&angular.extend(g.instance,{ngDialogId:F.ngDialogId,ngDialogData:F.ngDialogData,closeThisDialog:F.closeThisDialog,confirm:F.confirm}),"function"==typeof g?N.data("$ngDialogControllerController",g()):N.data("$ngDialogControllerController",g)}if(C(function(){var e=document.querySelectorAll(".ngdialog");w.deactivateAll(e),y(N)(F);var a=$.innerWidth-E.body.prop("clientWidth");E.html.addClass(c.bodyClassName),E.body.addClass(c.bodyClassName),u.push(c.bodyClassName);var n=a-($.innerWidth-E.body.prop("clientWidth"));n>0&&w.setBodyPadding(n),T.append(N),w.activate(N),c.trapFocus&&w.autoFocus(N),c.name?D.$broadcast("ngDialog.opened",{dialog:N,name:c.name}):D.$broadcast("ngDialog.opened",N);var o=N.data("$ngDialogOnOpenCallback");o&&angular.isFunction(o)&&o.call(N)}),m||(E.body.bind("keydown",w.onDocumentKeydown),m=!0),c.closeByNavigation&&f.push(N),c.preserveFocus&&N.data("$ngDialogPreviousFocus",document.activeElement),a=function(e){var a=!!c.closeByDocument&&l(e.target).hasClass("ngdialog-overlay"),n=l(e.target).hasClass("ngdialog-close");(a||n)&&B.close(N.attr("id"),n?"$closeButton":"$document")},void 0!==$.Hammer){(F.hammerTime=$.Hammer(N[0])).on("tap",a)}else N.bind("click",a);return o+=1,B}),{id:s,closePromise:k.promise,close:function(e){w.closeDialog(N,e)}}}},openConfirm:function(a){var n=b.defer(),o=angular.copy(e);a=a||{},void 0!==o.data&&(void 0===a.data&&(a.data={}),a.data=angular.merge(angular.copy(o.data),a.data)),angular.extend(o,a),o.scope=angular.isObject(o.scope)?o.scope.$new():D.$new(),o.scope.confirm=function(e){n.resolve(e);var a=l(document.getElementById(t.id));w.performCloseDialog(a,e)};var t=B.open(o);if(t)return t.closePromise.then(function(e){return e?n.reject(e.value):n.reject()}),n.promise},isOpen:function(e){return l(document.getElementById(e)).length>0},close:function(e,a){var n=l(document.getElementById(e));if(n.length)w.closeDialog(n,a);else if("$escape"===e){var o=g[g.length-1];(n=l(document.getElementById(o))).data("$ngDialogOptions").closeByEscape&&w.closeDialog(n,"$escape")}else B.closeAll(a);return B},closeAll:function(e){for(var a=document.querySelectorAll(".ngdialog"),n=a.length-1;n>=0;n--){var o=a[n];w.closeDialog(l(o),e)}},getOpenDialogs:function(){return g},getDefaults:function(){return e}};angular.forEach(["html","body"],function(e){if(E[e]=i.find(e),c[e]){var a=w.getRouterLocationEventName();D.$on(a,function(){E[e]=i.find(e)})}});var O=w.detectUIRouter();if("1.0.0+"===O){S.get("$transitions").onStart({},function(e){for(;f.length>0;){var a=f.pop();if(!1===w.closeDialog(a))return!1}})}else{var k="legacy"===O?"$stateChangeStart":"$locationChangeStart";D.$on(k,function(e){for(;f.length>0;){var a=f.pop();!1===w.closeDialog(a)&&e.preventDefault()}})}return B}]}),o.directive("ngDialog",["ngDialog",function(e){return{restrict:"A",scope:{ngDialogScope:"="},link:function(a,n,o){n.on("click",function(n){n.preventDefault();var l=angular.isDefined(a.ngDialogScope)?a.ngDialogScope:"noScope";angular.isDefined(o.ngDialogClosePrevious)&&e.close(o.ngDialogClosePrevious);var t=e.getDefaults();e.open({template:o.ngDialog,className:o.ngDialogClass||t.className,appendClassName:o.ngDialogAppendClass,controller:o.ngDialogController,controllerAs:o.ngDialogControllerAs,bindToController:o.ngDialogBindToController,disableAnimation:o.ngDialogDisableAnimation,scope:l,data:o.ngDialogData,showClose:"false"!==o.ngDialogShowClose&&("true"===o.ngDialogShowClose||t.showClose),closeByDocument:"false"!==o.ngDialogCloseByDocument&&("true"===o.ngDialogCloseByDocument||t.closeByDocument),closeByEscape:"false"!==o.ngDialogCloseByEscape&&("true"===o.ngDialogCloseByEscape||t.closeByEscape),overlay:"false"!==o.ngDialogOverlay&&("true"===o.ngDialogOverlay||t.overlay),preCloseCallback:o.ngDialogPreCloseCallback||t.preCloseCallback,onOpenCallback:o.ngDialogOnOpenCallback||t.onOpenCallback,bodyClassName:o.ngDialogBodyClass||t.bodyClassName})})}}}]),o});
define('js/../../../lib/angular-dialog/index',["css!./css/ngDialog.css","css!./css/ngDialog-theme-default.css","css!./css/ngDialog-theme-plain.css","./js/dialog"],function(s,c,e){});
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
define('js/common/config/index',['require','exports','module'],function (require, exports, module) {
    return {
        //提供方式
        dataProvideMethod: ['API接口', '邮件发送', '线下传递', '其他'],
        dataLevel: ['公开数据(C1)', '内部数据(C2)', '秘密数据(C3)', '机密数据(C4)'],
        dataRequestFrequency: ['仅此一次', '每天', '每周', '每月', '每季', '每年'],
    }
});
/**
 * author           xj
 * @date            2016-11-11 11:32:26
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/scroll-animation',['require','exports','module','./utils'],function (require, exports, module) {
    var utils = require('./utils');
    var requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (c) {
                window.setTimeout(c, 1000 / 60);
            };
    })();

    return function (scrollTopVal, time, callback) {
        time = time || 300;
        var startTop = utils.getScroll().top;
        var dis = scrollTopVal - startTop;
        var startTime = +new Date();
        (time | 0) < 100 && (time *= 1000);
        var scrollFn = function () {
            var runTime = +new Date() - startTime;
            runTime = runTime >= time ? time : runTime;
            window.scrollTo(0, startTop + ((runTime * dis) / time));
            if (runTime >= time) {
                typeof callback === 'function' && callback();
                return;
            }
            requestAnimFrame(scrollFn);
        }
        scrollFn();
    }
});
define('js/../../../lib/es6-promise/es6-promise',['require','exports','module'],function(t,e,n){"use strict";function r(t){return"function"==typeof t}function o(){var t=setTimeout;return function(){return t(i,1)}}function i(){for(var t=0;t<E;t+=2){(0,F[t])(F[t+1]),F[t]=void 0,F[t+1]=void 0}E=0}function s(){try{var e=t("vertx");return void 0!==(T=e.runOnLoop||e.runOnContext)?function(){T(i)}:o()}catch(t){return o()}}function u(t,e){var n=arguments,r=this,o=new this.constructor(a);void 0===o[K]&&w(o);var i=r._state;return i?function(){var t=n[i-1];C(function(){return b(i,o,t,r._result)})}():d(r,o,t,e),o}function c(t){if(t&&"object"==typeof t&&t.constructor===this)return t;var e=new this(a);return h(e,t),e}function a(){}function f(t){try{return t.then}catch(t){return W.error=t,W}}function l(t,e,n){e.constructor===t.constructor&&n===u&&e.constructor.resolve===c?function(t,e){e._state===N?v(t,e._result):e._state===U?_(t,e._result):d(e,void 0,function(e){return h(t,e)},function(e){return _(t,e)})}(t,e):n===W?_(t,W.error):void 0===n?v(t,e):r(n)?function(t,e,n){C(function(t){var r=!1,o=function(t,e,n,r){try{t.call(e,n,r)}catch(t){return t}}(n,e,function(n){r||(r=!0,e!==n?h(t,n):v(t,n))},function(e){r||(r=!0,_(t,e))},t._label);!r&&o&&(r=!0,_(t,o))},t)}(t,e,n):v(t,e)}function h(t,e){t===e?_(t,new TypeError("You cannot resolve a promise with itself")):!function(t){return"function"==typeof t||"object"==typeof t&&null!==t}(e)?v(t,e):l(t,e,f(e))}function p(t){t._onerror&&t._onerror(t._result),y(t)}function v(t,e){t._state===L&&(t._result=e,t._state=N,0!==t._subscribers.length&&C(y,t))}function _(t,e){t._state===L&&(t._state=U,t._result=e,C(p,t))}function d(t,e,n,r){var o=t._subscribers,i=o.length;t._onerror=null,o[i]=e,o[i+N]=n,o[i+U]=r,0===i&&t._state&&C(y,t)}function y(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r=void 0,o=void 0,i=t._result,s=0;s<e.length;s+=3)r=e[s],o=e[s+n],r?b(n,r,o,i):o(i);t._subscribers.length=0}}function m(){this.error=null}function b(t,e,n,o){var i=r(n),s=void 0,u=void 0,c=void 0,a=void 0;if(i){if((s=function(t,e){try{return t(e)}catch(t){return q.error=t,q}}(n,o))===q?(a=!0,u=s.error,s=null):c=!0,e===s)return void _(e,new TypeError("A promises callback cannot return that same promise."))}else s=o,c=!0;e._state!==L||(i&&c?h(e,s):a?_(e,u):t===N?v(e,s):t===U&&_(e,s))}function w(t){t[K]=z++,t._state=void 0,t._result=void 0,t._subscribers=[]}function g(t,e){this._instanceConstructor=t,this.promise=new t(a),this.promise[K]||w(this.promise),S(e)?(this._input=e,this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?v(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&v(this.promise,this._result))):_(this.promise,new Error("Array Methods must be provided an Array"))}function A(t){this[K]=z++,this._result=this._state=void 0,this._subscribers=[],a!==t&&("function"!=typeof t&&function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}(),this instanceof A?function(t,e){try{e(function(e){h(t,e)},function(e){_(t,e)})}catch(e){_(t,e)}}(this,t):function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}())}var j=void 0,S=j=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},E=0,T=void 0,M=void 0,C=function(t,e){F[E]=t,F[E+1]=e,2===(E+=2)&&(M?M(i):D())},O="undefined"!=typeof window?window:void 0,P=O||{},x=P.MutationObserver||P.WebKitMutationObserver,Y="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),k="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,F=new Array(1e3),D=void 0;D=Y?function(){return process.nextTick(i)}:x?function(){var t=0,e=new x(i),n=document.createTextNode("");return e.observe(n,{characterData:!0}),function(){n.data=t=++t%2}}():k?function(){var t=new MessageChannel;return t.port1.onmessage=i,function(){return t.port2.postMessage(0)}}():void 0===O&&"function"==typeof t?s():o();var K=Math.random().toString(36).substring(16),L=void 0,N=1,U=2,W=new m,q=new m,z=0;return g.prototype._enumerate=function(){for(var t=this.length,e=this._input,n=0;this._state===L&&n<t;n++)this._eachEntry(e[n],n)},g.prototype._eachEntry=function(t,e){var n=this._instanceConstructor,r=n.resolve;if(r===c){var o=f(t);if(o===u&&t._state!==L)this._settledAt(t._state,e,t._result);else if("function"!=typeof o)this._remaining--,this._result[e]=t;else if(n===A){var i=new n(a);l(i,t,o),this._willSettleAt(i,e)}else this._willSettleAt(new n(function(e){return e(t)}),e)}else this._willSettleAt(r(t),e)},g.prototype._settledAt=function(t,e,n){var r=this.promise;r._state===L&&(this._remaining--,t===U?_(r,n):this._result[e]=n),0===this._remaining&&v(r,this._result)},g.prototype._willSettleAt=function(t,e){var n=this;d(t,void 0,function(t){return n._settledAt(N,e,t)},function(t){return n._settledAt(U,e,t)})},A.all=function(t){return new g(this,t).promise},A.race=function(t){var e=this;return new e(S(t)?function(n,r){for(var o=t.length,i=0;i<o;i++)e.resolve(t[i]).then(n,r)}:function(t,e){return e(new TypeError("You must pass an array to race."))})},A.resolve=c,A.reject=function(t){var e=new this(a);return _(e,t),e},A._setScheduler=function(t){M=t},A._setAsap=function(t){C=t},A._asap=C,A.prototype={constructor:A,then:u,catch:function(t){return this.then(null,t)}},A.polyfill=function(){var t=void 0;if("undefined"!=typeof global)t=global;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;if(e){var n=null;try{n=Object.prototype.toString.call(e.resolve())}catch(t){}if("[object Promise]"===n&&!e.cast)return}t.Promise=A},A.Promise=A,A});
define('js/common/form/checkForm',['require','exports','module','./../scroll-animation','./../utils','./../../../../../lib/es6-promise/es6-promise'],function (require, exports, module) {
    var scrollAnimation = require('./../scroll-animation');
    var utils = require('./../utils');
    var Promise = require('./../../../../../lib/es6-promise/es6-promise');
    return function (ctrl, $scope, $timeout, validateUeditorContent, editorArr, $element) {
        return new Promise(function (resolve, reject) {
            if (ctrl.isSubmitDataIng) {
                return;
            }
            ctrl.isSubmitDataIng = true;
            var myForm = $scope.myForm;
            angular.forEach(myForm.$error.required, function (field) {
                field.$setTouched();
            });
            ctrl.showErrors = true;
            validateUeditorContent(ctrl.editors, editorArr);
            $timeout(function () {
                var firstInvalidEl = $element[0].querySelector('form').querySelector('.ng-invalid');
                //时间控件的验证特殊处理，非要显示长期这两个字符，这个不是时间格式，会导致时间控件验证报错，这里必须要忽略
                var hasInValidEL = firstInvalidEl && !angular.element(firstInvalidEl).hasClass('ng-invalid-date-disabled');
                if (hasInValidEL) {
                    var offset = utils.getElOffset(firstInvalidEl);
                    scrollAnimation(offset.top - 200, .3);
                    console.log(firstInvalidEl)
                    // console.log(myForm);
                    ctrl.isSubmitDataIng = false;
                    return;
                }
                ctrl.isSubmitDataIng = true;
                resolve();
            });
        });
    }
});
define('js/common/editor/validateUeditorContent',['require','exports','module'],function (require, exports, module) {
    return function (editors, editorArr) {
        var content, id, el;
        editorArr.forEach(function (key) {
            id = "js-" + key;
            content = editors[key].getContent();
            el = angular.element(document.getElementById(id).parentElement);
            el[!content ? 'addClass' : 'removeClass']('ng-invalid p-error');
        });
    }
});
define('js/common/editor/load-ueditor',['require','exports','module','../../../../../lib/es6-promise/es6-promise','./validateUeditorContent'],function (require, exports, module) {
    var Promise = require('../../../../../lib/es6-promise/es6-promise');
    var promise = new Promise(function (resolve, reject) {
        require(["../../../../../common/plugin/ueditor/ueditor.all"], function () {
            resolve();
        }, function () {
            reject();
        });
    }).catch(function (err) {
        console.error('请使用高级浏览器');
    });
    var validateUeditorContent = require('./validateUeditorContent');
    return function ($timeout, editors, editorArr) {
        promise.then(function () {
            //init Editor
            editorArr.forEach(function (val) {
                editors[val] = UE.getEditor("js-" + val);
                // set editor height
                editors[val].addListener('ready', function (editor) {
                    editors[val].setHeight(250);
                });
            });
        });
        return {
            validateUeditorContent: validateUeditorContent,
            promise: promise
        };
    }
});
define('js/common/dialog/showSuccessDialog',['require','exports','module'],function (require, exports, module) {
    var defaultOptions = {
        msg: '数据提交成功',
        content: '',
        time: 0,
        timeout: 0,
        width: 450,
        data: {},
        successFn: function successFn() {
            window.location.reload();
        }
    };
    return function (ngDialog, $rootScope, opts) {
        opts = angular.extend({}, defaultOptions, opts || {});
        var template = opts.template || '<p class="success-lg-text i-tc">' + (opts.msg || "") + '</p>' +
            (opts.content ? ('<div style="text-align:center">' + opts.content + '</div>') : '') +
            '<div class="wrap-center-btn"> <button class="p-btn" ng-click="dialogConfirm()">确认</button> </div>';
        var successDialog = ngDialog.open({
            template: template,
            className: 'ngdialog-theme-default p-dialog js-showSuccessDialog',
            plain: true,
            width: opts.width,
            showClose: false,
            trapFocus: false,
            overlay: true,
            name: 'showSuccessDialog',
            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                var closeDialog = function closeDialog() {
                    if (successDialog.closeEd) {
                        return;
                    }
                    successDialog.closeEd = true;
                    successDialog.close();
                    //提交成功刷新页面
                    //传递data 主要是漏洞页面 的跳转需要根据返回的数据进行判断
                    opts.successFn(opts.data);
                };
                $scope.dialogConfirm = closeDialog;
                $rootScope.$on('ngDialog.closed', function (e, $dialog) {
                    if ($dialog.hasClass('js-showSuccessDialog')) {
                        closeDialog();
                    }
                });
                opts.timeout && $timeout(function () {
                    closeDialog();
                }, opts.timeout);
            }]
        });
        successDialog.closeEd = false;
        return successDialog;
    };
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
define('js/application/js/time-option',['require','exports','module','../../common/datetimepicder-pop-init/time-option'],function (require, exports, module) {
    return require('../../common/datetimepicder-pop-init/time-option')
});

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
'use strict';
/**
 * author           xj
 * @date            2016-09-12 12:12:49
 * @email           littlebearbond@qq.com
 * @description
 */

define('js/application/js/application',['require','exports','module','../../../common/autocomplete-muti/index','../../../common/angular-bootstrap-datepicker-ppopup/angular-bootstrap-datepicker-ppopup','../../../../../lib/angular-dialog/index','../../common/utils','../../common/config/index','../../common/form/checkForm','../../common/editor/load-ueditor','../../common/dialog/showSuccessDialog','./time-option','../../common/app','./../../common/add-water-mark'],function (require, exports, module) {
    require('../../../common/autocomplete-muti/index');
    require('../../../common/angular-bootstrap-datepicker-ppopup/angular-bootstrap-datepicker-ppopup');
    require('../../../../../lib/angular-dialog/index');
    var utils = require('../../common/utils');
    var config = require('../../common/config/index');
    var checkForm = require('../../common/form/checkForm');
    var loadUeditor = require('../../common/editor/load-ueditor');
    var showSuccessDialog = require('../../common/dialog/showSuccessDialog');
    var endTimeOptions = require('./time-option');
    var app = require('../../common/app');
    var addWaterMark = require('./../../common/add-water-mark')

    app.requires.push('ngSanitize', 'ui.myAutoComplete', 'ui.bootstrap-datepickerPopup', 'ngDialog');

    var defaultOpts = {
        url: {
            //获取部门数据的url
            getDepartmentUrl: '/process/departmentT1',
            //获取用户
            userList: '/process/getUserList',
            //数据提交
            applyData: '/process/applyData',
            //获取初始数据，现在没有编辑页面这个也就废除了
            getTaskDetail: '/process/getTaskDetail',
            getApplyInfo: '/process/getApplyInfo'
        },
        isEdit: false
    };

    var urlData = utils.getUrlData();

    app.controller('application', ['$rootScope', '$scope', '$http', '$element', '$timeout', 'ngDialog',
        function ($rootScope, $scope, $http, $element, $timeout, ngDialog) {
            var ctrl = this;
            ctrl.pageData = {
                //数据申请题目
                name: '',
                //数据申请人产品线
                applyProduct: '',
                //数据申请人职位
                applyPosition: '',
                //数据提供方产品线
                provideProduct: [],
                //List关注人
                followers: [],
                //数据方提供人
                providers: [],
                //String  数据等级
                dataLevel: '',
                //String  数据提供方式
                dataProvideMethod: '',
                //数据量
                dataVolume: '',
                //数据量其他文本
                dataVolumeOtherText: '',
                // Sting   数据请求频次
                dataRequestFrequency: '',
                // Date    截止时期
                endTime: new Date(),
                //包括以下数据
                dataType: {},

                //文本编辑器
                //String  数据字段
                field: '',
                // String  背景描述
                description: '',
                //  String  安全措施:'',
                safetyMeasures: '',

                //数据使用方
                dataConsumer: '',
                dataConsumerIn: [],

                dataConsumerOut: '',
                dataConsumerOutOther: {},
                dataConsumerOutOtherText: '',
            };

            addWaterMark($rootScope)

            ctrl.config = config;
            ctrl.department = [];
            ctrl.endTimeIsOpen = false;
            ctrl.getUsersUrl = defaultOpts.url.userList;
            ctrl.getDepartmentUrl = defaultOpts.url.getDepartmentUrl;
            ctrl.isEdit = !!urlData.id;
            ctrl.editors = {};

            var editorArr = ['description'];
            var initEditor = loadUeditor($timeout, ctrl.editors, editorArr);

            //选择公司以外，处理是否选择其他，如果选择其他这个时候要把对应的输入框也显示出来
            ctrl.dataConsumerOutChange = function (flag) {
                if (flag === '1' && ctrl.pageData.dataConsumerOutOther[4]) {
                    ctrl.pageData.dataConsumerOutOther[4] = true;
                }
            };

            ctrl.endTimeOptions = endTimeOptions;

            ctrl.endTimeOpen = function () {
                ctrl.pageData.endTimeIsOpen = true;
            }

            ctrl.endTimeClose = function () {
                ctrl.pageData.endTimeIsOpen = false;
                ctrl.pageData.endTime = new Date('2100');
                $timeout(function () {
                    $element[0].querySelector('.js-date-picker').value = '长期';
                });
            }

            ctrl.getObjectLength = function (obj) {
                return obj && Object.keys(obj).some(function (key) {
                    return obj[key];
                });
            }

            //获取部门数据
            /*department.getDepartmentList(function(data) {
                ctrl.departmentData = data;
            });*/

            /**
             * {0:false,1:true,2:false}===>[1] 取出值为true的key
             * @param  {Object} obj
             * @return {Array}
             */
            var getSelectData = function (obj) {
                var data = [];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key) && obj[key] === true) {
                        data.push(key);
                    }
                }
                return data;
            };

            var getPageData = function () {
                var pageData = {};
                for (var key in ctrl.pageData) {
                    if (!ctrl.pageData.hasOwnProperty(key)) {
                        continue;
                    }
                    var value = ctrl.pageData[key];
                    if (!angular.isObject(value)) {
                        pageData[key] = value;
                        continue;
                    }
                    if (angular.isArray(value) || angular.isDate(value)) {
                        pageData[key] = value;
                        continue;
                    }
                    //{'1':true}==>['1']
                    //不是数组是Object的只取key
                    //反向adapterData 转换
                    pageData[key] = getSelectData(value);
                }
                for (var key in ctrl.editors) {
                    if (ctrl.editors.hasOwnProperty(key)) {
                        pageData[key] = ctrl.editors[key].getContent();
                    }
                }
                return pageData;
            };

            //对获取到的数据进行转换
            var adapterData = function (data) {
                var data = angular.extend({}, data);
                //['1']===> {'1':true} 转换之后方便angular页面初始话显示
                ['dataType', 'dataConsumerOutOther'].forEach(function (val) {
                    var innerVal = data[val];
                    var obj = {};
                    if (angular.isArray(innerVal)) {
                        innerVal.map(function (key, index) {
                            obj[key + ''] = true
                        });
                        data[val] = obj;
                    }
                });
                // endTime must be DateTime
                data.endTime = new Date(data.endTime);
                return data;
            };

            /**
             * remove $$hashKey
             * @param  {Array} data
             * @return {null}
             */
            var removeHashKey = function (data) {
                angular.isArray(data) && data.forEach(function (val) {
                    delete val.$$hashKey;
                });
            };

            ctrl.isSubmitDataIng = false;
            ctrl.submitData = function () {
                checkForm(ctrl, $scope, $timeout, initEditor.validateUeditorContent, editorArr, $element)
                    .then(function () {
                        var formData = angular.extend({}, getPageData());
                        ['dataConsumerIn', 'provideProduct'].forEach(function (key) {
                            removeHashKey(formData[key]);
                        });
                        //提交数据
                        $http({
                            method: 'POST',
                            data: formData,
                            url: defaultOpts.url.applyData
                        }).success(function (res) {
                            ctrl.isSubmitDataIng = false;
                            if (String(res.errno) !== '0') {
                                alert(res.msg || 'error');
                                console.error(res);
                                return;
                            }
                            //跳转到列表页
                            showSuccessDialog(ngDialog, $rootScope, {
                                msg: '数据提交成功，即将后跳转至任务列表',
                                successFn: function () {
                                    window.location.href = ("/project/portals/pages/application-detail.html?id=" + res.data);
                                },
                                width: 538
                            })
                        }).error(function () {
                            ctrl.isSubmitDataIng = false;
                        });
                    })
            };
            //编辑时候需要初始话数据
            if (ctrl.isEdit) {
                $http({
                    method: "GET",
                    url: defaultOpts.url.getTaskDetail,
                    params: {
                        id: urlData.id
                    }
                }).success(function (res) {
                    if (String(res.errno) !== '0') {
                        window.location.href = "/project/portals/pages/application-list.html";
                        console.error(res);
                        return;
                    }
                    ctrl.pageData = adapterData(res.data);
                    //处理endTime
                    if (new Date('2100').getDate() == ctrl.pageData.endTime.getDate()) {
                        ctrl.endTimeClose();
                    }
                    $timeout(function () {
                        angular.element(window).triggerHandler('resize');
                        initEditor.promise.then(function () {
                            //set ueditor content
                            ctrl.editors.description.ready(function () {
                                ctrl.editors.description.setContent(ctrl.pageData.description);
                            })
                        });
                    });
                });
            }
        }
    ]);

    return function (options) {
        defaultOpts = angular.extend({}, defaultOpts, options || {});
        angular.element(document).ready(function () {
            angular.bootstrap(document, ['myApp']);
        });
        return app;
    };
});

(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('.uib-datepicker-popup{line-height:1.42857143;}.uib-datepicker-popup.dropdown-menu{display:block;float:none;margin:0;}.uib-button-bar{padding:10px 9px 2px;}.uib-datepicker .uib-title{width:100%;}.uib-day button,.uib-month button,.uib-year button{min-width:100%;}.uib-left,.uib-right{width:100%}.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}@-webkit-keyframes ngdialog-fadeout{0%{opacity:1}100%{opacity:0}}@keyframes ngdialog-fadeout{0%{opacity:1}100%{opacity:0}}@-webkit-keyframes ngdialog-fadein{0%{opacity:0}100%{opacity:1}}@keyframes ngdialog-fadein{0%{opacity:0}100%{opacity:1}}.ngdialog{box-sizing:border-box}.ngdialog *,.ngdialog :after,.ngdialog :before{box-sizing:inherit}.ngdialog{position:fixed;overflow:auto;-webkit-overflow-scrolling:touch;z-index:10000;top:0;right:0;bottom:0;left:0}.ngdialog.ngdialog-disabled-animation,.ngdialog.ngdialog-disabled-animation .ngdialog-content,.ngdialog.ngdialog-disabled-animation .ngdialog-overlay{-webkit-animation:none!important;animation:none!important}.ngdialog-overlay{position:fixed;background:rgba(0,0,0,.4);top:0;right:0;bottom:0;left:0;-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadein .5s;animation:ngdialog-fadein .5s}.ngdialog-no-overlay{pointer-events:none}.ngdialog.ngdialog-closing .ngdialog-overlay{-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadeout .5s;animation:ngdialog-fadeout .5s}.ngdialog-content{background:#fff;-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadein .5s;animation:ngdialog-fadein .5s;pointer-events:all}.ngdialog.ngdialog-closing .ngdialog-content{-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadeout .5s;animation:ngdialog-fadeout .5s}.ngdialog-close:before{font-family:Helvetica,Arial,sans-serif;content:\'\\00D7\';cursor:pointer}body.ngdialog-open,html.ngdialog-open{overflow:initial}@-webkit-keyframes ngdialog-flyin{0%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes ngdialog-flyin{0%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@-webkit-keyframes ngdialog-flyout{0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}}@keyframes ngdialog-flyout{0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}}.ngdialog.ngdialog-theme-default{padding-bottom:160px;padding-top:160px}.ngdialog.ngdialog-theme-default.ngdialog-closing .ngdialog-content{-webkit-animation:ngdialog-flyout .5s;animation:ngdialog-flyout .5s}.ngdialog.ngdialog-theme-default .ngdialog-content{-webkit-animation:ngdialog-flyin .5s;animation:ngdialog-flyin .5s;background:#f0f0f0;border-radius:5px;color:#444;font-family:Helvetica,sans-serif;font-size:1.1em;line-height:1.5em;margin:0 auto;max-width:100%;padding:1em;position:relative;width:450px}.ngdialog.ngdialog-theme-default .ngdialog-close{padding:0;border:none;border-radius:5px;cursor:pointer;position:absolute;right:0;top:0}.ngdialog.ngdialog-theme-default .ngdialog-close:before{background:0 0;border-radius:3px;color:#bbb;content:\'\\00D7\';font-size:26px;font-weight:400;height:30px;line-height:26px;position:absolute;right:3px;text-align:center;top:3px;width:30px}.ngdialog.ngdialog-theme-default .ngdialog-close:active:before,.ngdialog.ngdialog-theme-default .ngdialog-close:hover:before{color:#777}.ngdialog.ngdialog-theme-default .ngdialog-message{margin-bottom:.5em}.ngdialog.ngdialog-theme-default .ngdialog-input{margin-bottom:1em}.ngdialog.ngdialog-theme-default .ngdialog-input input[type=email],.ngdialog.ngdialog-theme-default .ngdialog-input input[type=password],.ngdialog.ngdialog-theme-default .ngdialog-input input[type=text],.ngdialog.ngdialog-theme-default .ngdialog-input input[type=url],.ngdialog.ngdialog-theme-default .ngdialog-input textarea{background:#fff;border:0;border-radius:3px;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0 0 .25em;min-height:2.5em;padding:.25em .67em;width:100%}.ngdialog.ngdialog-theme-default .ngdialog-input input[type=email]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input input[type=password]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input input[type=text]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input input[type=url]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input textarea:focus{box-shadow:inset 0 0 0 2px #8dbdf1;outline:0}.ngdialog.ngdialog-theme-default .ngdialog-buttons:after{content:\'\';display:table;clear:both}.ngdialog.ngdialog-theme-default .ngdialog-button{border:0;border-radius:3px;cursor:pointer;float:right;font-family:inherit;font-size:.8em;letter-spacing:.1em;line-height:1em;margin:0 0 0 .5em;padding:.75em 2em;text-transform:uppercase}.ngdialog.ngdialog-theme-default .ngdialog-button:focus{-webkit-animation:ngdialog-pulse 1.1s infinite;animation:ngdialog-pulse 1.1s infinite;outline:0}@media (max-width:568px){.ngdialog.ngdialog-theme-default .ngdialog-button:focus{-webkit-animation:none;animation:none}}.ngdialog.ngdialog-theme-default .ngdialog-button.ngdialog-button-primary{background:#3288e6;color:#fff}.ngdialog.ngdialog-theme-default .ngdialog-button.ngdialog-button-secondary{background:#e0e0e0;color:#777}.ngdialog.ngdialog-theme-plain{padding-bottom:160px;padding-top:160px}.ngdialog.ngdialog-theme-plain .ngdialog-content{background:#fff;color:#444;font-family:\'Helvetica Neue\',sans-serif;font-size:1.1em;line-height:1.5em;margin:0 auto;max-width:100%;padding:1em;position:relative;width:450px}.ngdialog.ngdialog-theme-plain .ngdialog-content h1,.ngdialog.ngdialog-theme-plain .ngdialog-content h2,.ngdialog.ngdialog-theme-plain .ngdialog-content h3,.ngdialog.ngdialog-theme-plain .ngdialog-content h4,.ngdialog.ngdialog-theme-plain .ngdialog-content h5,.ngdialog.ngdialog-theme-plain .ngdialog-content h6,.ngdialog.ngdialog-theme-plain .ngdialog-content li,.ngdialog.ngdialog-theme-plain .ngdialog-content p,.ngdialog.ngdialog-theme-plain .ngdialog-content ul{color:inherit}.ngdialog.ngdialog-theme-plain .ngdialog-close{cursor:pointer;position:absolute;right:0;top:0}.ngdialog.ngdialog-theme-plain .ngdialog-close:before{background:0 0;color:#bbb;content:\"\\00D7\";font-size:26px;font-weight:400;height:30px;line-height:26px;position:absolute;right:3px;text-align:center;top:3px;width:30px}.ngdialog.ngdialog-theme-plain .ngdialog-close:active:before,.ngdialog.ngdialog-theme-plain .ngdialog-close:hover:before{color:#777}.ngdialog.ngdialog-theme-plain .ngdialog-message{margin-bottom:.5em}.ngdialog.ngdialog-theme-plain .ngdialog-input{margin-bottom:1em}.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=email],.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=password],.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=text],.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=url],.ngdialog.ngdialog-theme-plain .ngdialog-input textarea{background:#f0f0f0;border:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0 0 .25em;min-height:2.5em;padding:.25em .67em;width:100%}.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=email]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=password]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=text]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=url]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input textarea:focus{box-shadow:inset 0 0 0 2px rgba(0,0,0,.2);outline:0}.ngdialog.ngdialog-theme-plain .ngdialog-buttons:after{clear:both;content:\'\';display:table}.ngdialog.ngdialog-theme-plain .ngdialog-button{border:0;cursor:pointer;float:right;font-family:inherit;font-size:.8em;letter-spacing:.1em;line-height:1em;margin:0 0 0 .5em;padding:.75em 2em;text-transform:uppercase}.ngdialog.ngdialog-theme-plain .ngdialog-button:focus{-webkit-animation:ngdialog-pulse 1.1s infinite;animation:ngdialog-pulse 1.1s infinite;outline:0}@media (max-width:568px){.ngdialog.ngdialog-theme-plain .ngdialog-button:focus{-webkit-animation:none;animation:none}}.ngdialog.ngdialog-theme-plain .ngdialog-button.ngdialog-button-primary{background:#3288e6;color:#fff}.ngdialog.ngdialog-theme-plain .ngdialog-button.ngdialog-button-secondary{background:#e0e0e0;color:#777}@charset \"UTF-8\";.header:before,.header-right:before,.header:after,.header-right:after{content:\"\";display:table;}.header:after,.header-right:after{clear:both;}dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:\'...\\A..\\A.\';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.header{min-width:1100px;width:100%;height:70px;border-bottom:solid 1px #d4d6db;color:#262626;box-shadow:0 1px 2px 1px #f1f1f1;}.logo{margin-left:35px;line-height:70px;display:inline-block;background:url(/project/portals/i/logo.png?v=953c28) 0 center no-repeat;background-size:35px auto;font-size:22px;padding-left:41px;color:#262626;vertical-align:middle;cursor:pointer;text-decoration:none;}.logo:hover{text-decoration:none;color:#262626;}.header-list > li .p-dropdown,.header-right .msg .p-dropdown,.header-right .user .p-dropdown{display:block;position:absolute;width:160px;top:62px;left:50%;transition:transform 0.25s cubic-bezier(0.18,0.89,0.32,1.28);transform-origin:center top;transform:translate(-50%) scaleY(0);}.header-list > li:hover .p-dropdown,.header-right .msg:hover .p-dropdown,.header-right .wrap-user-img:hover .p-dropdown{transform:translate(-50%) scaleY(1);}.header-list{font-size:16px;display:inline-block;vertical-align:middle;margin-left:75px;list-style:none outside none;margin-bottom:0;}.header-list > li{padding:0 10px;margin-right:30px;float:left;line-height:70px;position:relative;cursor:pointer;}.header-list > li:last-child{margin-right:0;}.header-list > li:hover > a,.header-list > li.hover > a{color:#528be6;text-decoration:none;}.header-list > li:hover > i,.header-list > li.hover > i{left:0;right:0;}.header-list > li > a{transition:color .3s ease-out;color:#262626;display:block;text-align:center;line-height:70px;text-decoration:none;}.header-list > li > i{position:absolute;bottom:10px;left:50%;right:50%;height:4px;font-size:0;background-color:#528be6;transition-property:left,right;transition-duration:.3s;transition-timing-function:ease-out;}.header-right{line-height:70px;height:70px;font-size:0;margin-right:16px;float:right;}.header-right .msg{position:relative;color:#262626;line-height:70px;font-size:14px;float:left;cursor:pointer;}.header-right .msg a{text-decoration:none;color:#262626;}.header-right .msg b{font-weight:normal;color:#fa9027;margin-left:6px;}.header-right .wrap-user-img{float:left;}.header-right .wrap-user-img:hover .user:before{transform:rotate(-45deg);top:60%;}.header-right .wrap-img{float:left;height:70px;margin-left:46px;padding-top:15px;cursor:pointer;}.header-right .wrap-img img{vertical-align:top;border-radius:50%;width:40px;height:40px;}.header-right .user{padding-left:11px;margin-right:58px;cursor:pointer;position:relative;height:70px;float:left;}.header-right .user:before{content:\'\';display:block;width:8px;height:8px;border:solid #d8d8d8;border-width:2px 2px 0 0;position:absolute;top:50%;z-index:1;transform:rotate(135deg);}.header-right .user:before{right:-20px;margin-top:-5px;transition:all .3s linear;}.header-right .user .name{display:inline-block;vertical-align:middle;color:#343434;font-size:14px;}.p-dropdown{padding:6px 0;border-radius:8px;background-color:#ffffff;box-shadow:0 0 2px 2px #f1f1f1;position:relative;list-style:none outside none;z-index:1000;}.p-dropdown:before{content:\'\';position:absolute;top:-2px;left:50%;z-index:10;width:10px;height:10px;background-color:#fff;border:solid #f0f0f0;border-width:1px 0 0 1px;box-shadow:-1px -1px 2px #f1f1f1;transform:rotate(45deg) translate(-50%);}.p-dropdown > .list-item,.p-dropdown > li{color:#262626;font-size:14px;line-height:35px;padding:0 16px;}.p-dropdown > .list-item:hover,.p-dropdown > li:hover{background-color:#f5f5f5;}.p-dropdown > .list-item:last-child,.p-dropdown > li:last-child{border-radius:0 0 4px 4px;}.p-dropdown > .list-item:first-child,.p-dropdown > li:first-child{border-radius:4px 4px 0 0;}.p-dropdown > .list-item a,.p-dropdown > li a{color:#262626;}.p-dropdown > .list-item a:hover,.p-dropdown > li a:hover{color:#528be6;text-decoration:none;}.p-dropdown > .list-item > b,.p-dropdown > li > b{font-weight:normal;color:#fa8919;padding-right:8px;}@media (max-width:1000px){.header-list{margin-left:0;}.header-list > li{margin-right:15px;}}@media (max-width:1200px){.header-list{margin-left:0;}.header-list > li{margin-right:18px;}}');
