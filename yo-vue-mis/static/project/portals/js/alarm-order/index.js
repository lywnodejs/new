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
'use strict';

define('common/add-mark/index',['require','exports','module','../../js/common/debounce'],function (require, exports, module) {
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
        RIGHT: 39,
        CTRL: 17,
        BACKSPACE: 8,
        DELETE: 46,
        isHorizontalMovement: function isHorizontalMovement(k) {
            return ~[KEY.LEFT, KEY.RIGHT, KEY.BACKSPACE, KEY.DELETE].indexOf(k);
        }
    };

    var app = angular.module('ui.myAddMark', []).constant('defaultAddMarkConfig', {
        placeholder: '',
        limit: 10,
        maxlength: 100
    }).directive('uisAddMarkTranscludeAppend', ['$injector', function ($injector) {
        return {
            link: function link(scope, element, attrs, ctrl, transclude) {
                if ($injector.has('uisAddMarkTranscludeAppend')) {
                    return;
                }
                transclude(scope, function (clone) {
                    element.append(clone);
                });
            }
        };
    }]);

    app.controller('uiMyAddMarkCtrl', ['$scope', '$timeout', '$http', '$q', '$element', 'defaultAddMarkConfig', '$window', function ($scope, $timeout, $http, $q, $element, defaultAddMarkConfig, $window) {
        var ctrl = this;
        ctrl.searchVal = undefined;
        //选中的数据
        ctrl.selected = [];
        //set default options
        ctrl.placeholder = $scope.placeholder || defaultAddMarkConfig.placeholder;
        ctrl.maxlength = $scope.maxlength | 0 || defaultAddMarkConfig.maxlength;
        ctrl.inputName = $scope.name || '';
        ctrl.limit = $scope.limit | 0 || defaultAddMarkConfig.limit;

        ctrl.searchInputElement = angular.element($element[0].querySelector('input'));
        /**
         *
         * 选中某一项
         * @param {any} index
         */
        ctrl.addItem = function () {
            var item = (ctrl.searchVal || '').trim();
            if (!item || ctrl.hasItem(item)) {
                return;
            }
            $scope.$broadcast('uis:add-mark', item);
        };

        ctrl.hasItem = function (item) {
            return ctrl.selected.some(function (val) {
                return angular.equals(item, val);
            });
        };

        function _handleDropDownSelection(key) {
            switch (key) {
                case KEY.TAB:
                case KEY.ENTER:
                    ctrl.addItem();
                    break;
            }
        }

        ctrl.searchInputElement.on('keydown', function (e) {
            var key = e.which;
            if (key === KEY.ENTER || key === KEY.ESC) {
                e.preventDefault();
                e.stopPropagation();
            }
            $scope.$apply(function () {
                _handleDropDownSelection(key);
            });
        });

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

        var onResize = debounce(function () {
            ctrl.sizeSearchInput();
        }, 50);
        angular.element($window).bind('resize', onResize);
        $scope.$on('$destroy', function () {
            ctrl.searchInputElement.off('keyup keydown tagged blur paste');
        });
    }]);

    app.directive('uiMyAddMark', ['$timeout', 'defaultAddMarkConfig', '$parse', '$document', function ($timeout, defaultAddMarkConfig, $parse, $document, $element) {
        return {
            restrict: 'EA',
            templateUrl: function templateUrl(tElement, tAttrs) {
                return '/addMark/main.tpl.html';
            },
            scope: {
                placeholder: "@",
                limit: "@?",
                inputName: "@?",
                maxlength: "@?"
            },
            require: ['uiMyAddMark', '^ngModel'],
            replace: true,
            transclude: true,
            controllerAs: '$addMarkCtrl',
            controller: 'uiMyAddMarkCtrl',
            compile: function compile(tElement, tAttrs) {
                //compile
                tElement.append('<ui-selected-marks/>');
                //link
                return function (scope, element, attrs, ctrls, transcludeFn) {
                    var $addMarkCtrl = ctrls[0];
                    var $select = ctrls[0];
                    var ngModel = ctrls[1];
                    $select.ngModel = ngModel;
                    transcludeFn(scope, function (clone) {
                        var transcluded = angular.element('<div>').append(clone);

                        var transcludedMatch = transcluded.querySelectorAll('.ui-select-match');
                        transcludedMatch.removeAttr('ui-select-match');
                        transcludedMatch.removeAttr('data-ui-select-match');
                        if (transcludedMatch.length !== 1) {
                            throw Error('ui-select-match must be one');
                        }
                        element.querySelectorAll('.ui-select-match').replaceWith(transcludedMatch);
                    });
                };
            }
        };
    }]);

    app.directive('uiSelectMarkItem', ['$compile', '$window', function ($compile, $window) {
        return {
            restrict: 'EA',
            require: '^uiMyAddMark',
            templateUrl: function templateUrl(tElement, tAttrs) {
                tElement.addClass('ui-select-match');
                return '/addMark/SelectMultiple.tpl.html';
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

    app.directive('uiSelectedMarks', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            require: ['^uiMyAddMark', '^ngModel'],
            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                var ctrl = this,
                    $select = $scope.$addMarkCtrl,
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
            controllerAs: '$addMarksListCtrl',
            link: function link(scope, element, attrs, ctrls) {
                var $select = ctrls[0];
                var ngModel = scope.ngModel = ctrls[1];
                var $selectMultiple = scope.$addMarksListCtrl;

                scope.$on('uis:add-mark', function (event, item) {
                    var len = $select.selected.length,
                        index = 0;
                    if (len >= $select.limit) {
                        return;
                    }
                    while (index < len) {
                        if (angular.equals($select.selected[index], item)) {
                            return;
                        }
                        index++;
                    }
                    $select.selected.push(item);
                    $select.searchVal = '';
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

    angular.module("ui.myAddMark").run(["$templateCache", function ($templateCache) {
        $templateCache.put('/addMark/main.tpl.html', '\n                            <div class="ui-select-container ui-select-multiple ui-select-bootstrap dropdown form-control direction-up">\n                                <div>\n                                    <span class="ui-select-match"></span>\n                                    <input type="search"\n                                    autocomplete="off"\n                                    class="ui-select-search\n                                    auto-pointer"\n                                    ng-disabled="disable" \n                                    placeholder="{{$addMarkCtrl.placeholder}}"\n                                    maxlength="{{$addMarkCtrl.maxlength}}"\n                                    name="{{$addMarkCtrl.inputName}}"\n                                    ng-model="$addMarkCtrl.searchVal"\n                                    >\n                                </div>\n                            </div>');
    }]);

    angular.module("ui.myAddMark").run(["$templateCache", function ($templateCache) {
        $templateCache.put('/addMark/SelectMultiple.tpl.html', '\n                            <span class="ui-select-match" ng-show="$addMarkCtrl.selected.length">\n                                <span ng-repeat="$item in $addMarkCtrl.selected track by $index">\n                                    <span\n                                        class="ui-select-match-item btn btn-default btn-xs"\n                                        tabindex="-1"\n                                        type="button"\n                                        ng-click="$addMarksListCtrl.activeMatchIndex = $index;"\n                                        ng-class="{\'btn-primary\':$addMarksListCtrl.activeMatchIndex === $index}"\n                                    >\n                                        <span\n                                            class="close ui-select-match-close"\n                                            ng-hide="$addMarkCtrl.disabled"\n                                            ng-click="$addMarksListCtrl.removeChoice($index)"\n                                        >&nbsp;&times;</span>\n                                        <span uis-add-mark-transclude-append></span>\n                                    </span>\n                                </span>\n                            </span>');
    }]);
});
//# sourceMappingURL=index.js.map
;
define('normalize',{});
define('css',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});

define('css!js/../../../lib/angular-dialog/css/ngDialog',[],function(){});

define('css!js/../../../lib/angular-dialog/css/ngDialog-theme-default',[],function(){});

define('css!js/../../../lib/angular-dialog/css/ngDialog-theme-plain',[],function(){});
define('js/../../../lib/angular-dialog/js/dialog',['require','exports','module'],function(e,a,n){"use strict";var o=angular.module("ngDialog",[]),l=angular.element,t=angular.isDefined,i=(document.body||document.documentElement).style,r=t(i.animation)||t(i.WebkitAnimation)||t(i.MozAnimation)||t(i.MsAnimation)||t(i.OAnimation),s="animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend",c={html:!1,body:!1},d={},g=[],u=[],m=!1,p=!1,f=[];return o.provider("ngDialog",function(){var e=this.defaults={className:"ngdialog-theme-default",appendClassName:"",disableAnimation:!1,plain:!1,showClose:!0,closeByDocument:!0,closeByEscape:!0,closeByNavigation:!1,appendTo:!1,preCloseCallback:!1,onOpenCallback:!1,overlay:!0,cache:!0,trapFocus:!0,preserveFocus:!0,ariaAuto:!0,ariaRole:null,ariaLabelledById:null,ariaLabelledBySelector:null,ariaDescribedById:null,ariaDescribedBySelector:null,bodyClassName:"ngdialog-open",width:null,height:null};this.setForceHtmlReload=function(e){c.html=e||!1},this.setForceBodyReload=function(e){c.body=e||!1},this.setDefaults=function(a){angular.extend(e,a)},this.setOpenOnePerName=function(e){p=e||!1};var a,n=0,o=0,t={};this.$get=["$document","$templateCache","$compile","$q","$http","$rootScope","$timeout","$window","$controller","$injector",function(i,v,y,b,h,D,C,$,A,S){var E=[],w={onDocumentKeydown:function(e){27===e.keyCode&&B.close("$escape")},activate:function(e){e.data("$ngDialogOptions").trapFocus&&(e.on("keydown",w.onTrapFocusKeydown),E.body.on("keydown",w.onTrapFocusKeydown))},deactivate:function(e){e.off("keydown",w.onTrapFocusKeydown),E.body.off("keydown",w.onTrapFocusKeydown)},deactivateAll:function(e){angular.forEach(e,function(e){var a=angular.element(e);w.deactivate(a)})},setBodyPadding:function(e){var a=parseInt(E.body.css("padding-right")||0,10);E.body.css("padding-right",a+e+"px"),E.body.data("ng-dialog-original-padding",a),D.$broadcast("ngDialog.setPadding",e)},resetBodyPadding:function(){var e=E.body.data("ng-dialog-original-padding");e?E.body.css("padding-right",e+"px"):E.body.css("padding-right",""),D.$broadcast("ngDialog.setPadding",0)},performCloseDialog:function(e,n){var l=e.data("$ngDialogOptions"),i=e.attr("id"),c=d[i];if(w.deactivate(e),c){if(void 0!==$.Hammer){var u=c.hammerTime;u.off("tap",a),u.destroy&&u.destroy(),delete c.hammerTime}else e.unbind("click");1===o&&E.body.unbind("keydown",w.onDocumentKeydown),e.hasClass("ngdialog-closing")||(o-=1);var p=e.data("$ngDialogPreviousFocus");p&&p.focus&&p.focus(),D.$broadcast("ngDialog.closing",e,n),o=o<0?0:o,r&&!l.disableAnimation?(c.$destroy(),e.unbind(s).bind(s,function(){w.closeDialogElement(e,n)}).addClass("ngdialog-closing")):(c.$destroy(),w.closeDialogElement(e,n)),t[i]&&(t[i].resolve({id:i,value:n,$dialog:e,remainingDialogs:o}),delete t[i]),d[i]&&delete d[i],g.splice(g.indexOf(i),1),g.length||(E.body.unbind("keydown",w.onDocumentKeydown),m=!1),0==o&&(a=void 0)}},closeDialogElement:function(e,a){var n=e.data("$ngDialogOptions");e.remove(),u.splice(u.indexOf(n.bodyClassName),1),-1===u.indexOf(n.bodyClassName)&&(E.html.removeClass(n.bodyClassName),E.body.removeClass(n.bodyClassName)),0===o&&w.resetBodyPadding(),D.$broadcast("ngDialog.closed",e,a)},closeDialog:function(e,a){var n=e.data("$ngDialogPreCloseCallback");if(n&&angular.isFunction(n)){var o=n.call(e,a);if(angular.isObject(o))o.closePromise?o.closePromise.then(function(){w.performCloseDialog(e,a)},function(){return!1}):o.then(function(){w.performCloseDialog(e,a)},function(){return!1});else{if(!1===o)return!1;w.performCloseDialog(e,a)}}else w.performCloseDialog(e,a)},onTrapFocusKeydown:function(e){var a,n=angular.element(e.currentTarget);if(n.hasClass("ngdialog"))a=n;else if(null===(a=w.getActiveDialog()))return;var o=9===e.keyCode,l=!0===e.shiftKey;o&&w.handleTab(a,e,l)},handleTab:function(e,a,n){var o=w.getFocusableElements(e);if(0!==o.length){var l=document.activeElement,t=Array.prototype.indexOf.call(o,l),i=-1===t,r=0===t,s=t===o.length-1,c=!1;n?(i||r)&&(o[o.length-1].focus(),c=!0):(i||s)&&(o[0].focus(),c=!0),c&&(a.preventDefault(),a.stopPropagation())}else document.activeElement&&document.activeElement.blur&&document.activeElement.blur()},autoFocus:function(e){var a=e[0],n=a.querySelector("*[autofocus]");if(null===n||(n.focus(),document.activeElement!==n)){var o=w.getFocusableElements(e);if(o.length>0)o[0].focus();else{var t=w.filterVisibleElements(a.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span"));if(t.length>0){var i=t[0];l(i).attr("tabindex","-1").css("outline","0"),i.focus()}}}},getFocusableElements:function(e){var a=e[0].querySelectorAll("a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]"),n=w.filterTabbableElements(a);return w.filterVisibleElements(n)},filterTabbableElements:function(e){for(var a=[],n=0;n<e.length;n++){var o=e[n];"-1"!==l(o).attr("tabindex")&&a.push(o)}return a},filterVisibleElements:function(e){for(var a=[],n=0;n<e.length;n++){var o=e[n];(o.offsetWidth>0||o.offsetHeight>0)&&a.push(o)}return a},getActiveDialog:function(){var e=document.querySelectorAll(".ngdialog");return 0===e.length?null:l(e[e.length-1])},applyAriaAttributes:function(e,a){if(a.ariaAuto){if(!a.ariaRole){var n=w.getFocusableElements(e).length>0?"dialog":"alertdialog";a.ariaRole=n}a.ariaLabelledBySelector||(a.ariaLabelledBySelector="h1,h2,h3,h4,h5,h6"),a.ariaDescribedBySelector||(a.ariaDescribedBySelector="article,section,p")}a.ariaRole&&e.attr("role",a.ariaRole),w.applyAriaAttribute(e,"aria-labelledby",a.ariaLabelledById,a.ariaLabelledBySelector),w.applyAriaAttribute(e,"aria-describedby",a.ariaDescribedById,a.ariaDescribedBySelector)},applyAriaAttribute:function(e,a,n,o){if(n)e.attr(a,n);else if(o){var t=e.attr("id"),i=e[0].querySelector(o);if(!i)return;var r=t+"-"+a;return l(i).attr("id",r),e.attr(a,r),r}},detectUIRouter:function(){return S.has("$transitions")?"1.0.0+":!!S.has("$state")&&"legacy"},getRouterLocationEventName:function(){return w.detectUIRouter()?"$stateChangeStart":"$locationChangeStart"}},B={__PRIVATE__:w,open:function(i){function r(e,a){return(a=a||{}).headers=a.headers||{},angular.extend(a.headers,{Accept:"text/html"}),D.$broadcast("ngDialog.templateLoading",e),h.get(e,a).then(function(a){return D.$broadcast("ngDialog.templateLoaded",e),a.data||""})}var s=null;if(i=i||{},!(p&&i.name&&(s=i.name.toLowerCase().replace(/\s/g,"-")+"-dialog",this.isOpen(s)))){var c=angular.copy(e),O=++n;s=s||"ngdialog"+O,g.push(s),void 0!==c.data&&(void 0===i.data&&(i.data={}),i.data=angular.merge(angular.copy(c.data),i.data)),angular.extend(c,i);var k;t[s]=k=b.defer();var F;d[s]=F=angular.isObject(c.scope)?c.scope.$new():D.$new();var N,T,x,P=angular.extend({},c.resolve);return angular.forEach(P,function(e,a){P[a]=angular.isString(e)?S.get(e):S.invoke(e,null,null,a)}),b.all({template:function(e){return e?angular.isString(e)&&c.plain?e:"boolean"!=typeof c.cache||c.cache?r(e,{cache:v}):r(e,{cache:!1}):"Empty template"}(c.template||c.templateUrl),locals:b.all(P)}).then(function(e){var n=e.template,t=e.locals;c.showClose&&(n+='<button aria-label="Dismiss" class="ngdialog-close"></button>');var i=c.overlay?"":" ngdialog-no-overlay";if((N=l('<div id="'+s+'" class="ngdialog'+i+'"></div>')).html(c.overlay?'<div class="ngdialog-overlay"></div><div class="ngdialog-content" role="document">'+n+"</div>":'<div class="ngdialog-content" role="document">'+n+"</div>"),N.data("$ngDialogOptions",c),F.ngDialogId=s,c.data&&angular.isString(c.data)){var r=c.data.replace(/^\s*/,"")[0];F.ngDialogData="{"===r||"["===r?angular.fromJson(c.data):new String(c.data),F.ngDialogData.ngDialogId=s}else c.data&&angular.isObject(c.data)&&(F.ngDialogData=c.data,F.ngDialogData.ngDialogId=s);if(c.className&&N.addClass(c.className),c.appendClassName&&N.addClass(c.appendClassName),c.width&&(x=N[0].querySelector(".ngdialog-content"),angular.isString(c.width)?x.style.width=c.width:x.style.width=c.width+"px"),c.height&&(x=N[0].querySelector(".ngdialog-content"),angular.isString(c.height)?x.style.height=c.height:x.style.height=c.height+"px"),c.disableAnimation&&N.addClass("ngdialog-disabled-animation"),T=c.appendTo&&angular.isString(c.appendTo)?angular.element(document.querySelector(c.appendTo)):E.body,w.applyAriaAttributes(N,c),[{name:"$ngDialogPreCloseCallback",value:c.preCloseCallback},{name:"$ngDialogOnOpenCallback",value:c.onOpenCallback}].forEach(function(e){if(e.value){var a;angular.isFunction(e.value)?a=e.value:angular.isString(e.value)&&F&&(angular.isFunction(F[e.value])?a=F[e.value]:F.$parent&&angular.isFunction(F.$parent[e.value])?a=F.$parent[e.value]:D&&angular.isFunction(D[e.value])&&(a=D[e.value])),a&&N.data(e.name,a)}}),F.closeThisDialog=function(e){w.closeDialog(N,e)},c.controller&&(angular.isString(c.controller)||angular.isArray(c.controller)||angular.isFunction(c.controller))){var d;c.controllerAs&&angular.isString(c.controllerAs)&&(d=c.controllerAs);var g=A(c.controller,angular.extend(t,{$scope:F,$element:N}),!0,d);c.bindToController&&angular.extend(g.instance,{ngDialogId:F.ngDialogId,ngDialogData:F.ngDialogData,closeThisDialog:F.closeThisDialog,confirm:F.confirm}),"function"==typeof g?N.data("$ngDialogControllerController",g()):N.data("$ngDialogControllerController",g)}if(C(function(){var e=document.querySelectorAll(".ngdialog");w.deactivateAll(e),y(N)(F);var a=$.innerWidth-E.body.prop("clientWidth");E.html.addClass(c.bodyClassName),E.body.addClass(c.bodyClassName),u.push(c.bodyClassName);var n=a-($.innerWidth-E.body.prop("clientWidth"));n>0&&w.setBodyPadding(n),T.append(N),w.activate(N),c.trapFocus&&w.autoFocus(N),c.name?D.$broadcast("ngDialog.opened",{dialog:N,name:c.name}):D.$broadcast("ngDialog.opened",N);var o=N.data("$ngDialogOnOpenCallback");o&&angular.isFunction(o)&&o.call(N)}),m||(E.body.bind("keydown",w.onDocumentKeydown),m=!0),c.closeByNavigation&&f.push(N),c.preserveFocus&&N.data("$ngDialogPreviousFocus",document.activeElement),a=function(e){var a=!!c.closeByDocument&&l(e.target).hasClass("ngdialog-overlay"),n=l(e.target).hasClass("ngdialog-close");(a||n)&&B.close(N.attr("id"),n?"$closeButton":"$document")},void 0!==$.Hammer){(F.hammerTime=$.Hammer(N[0])).on("tap",a)}else N.bind("click",a);return o+=1,B}),{id:s,closePromise:k.promise,close:function(e){w.closeDialog(N,e)}}}},openConfirm:function(a){var n=b.defer(),o=angular.copy(e);a=a||{},void 0!==o.data&&(void 0===a.data&&(a.data={}),a.data=angular.merge(angular.copy(o.data),a.data)),angular.extend(o,a),o.scope=angular.isObject(o.scope)?o.scope.$new():D.$new(),o.scope.confirm=function(e){n.resolve(e);var a=l(document.getElementById(t.id));w.performCloseDialog(a,e)};var t=B.open(o);if(t)return t.closePromise.then(function(e){return e?n.reject(e.value):n.reject()}),n.promise},isOpen:function(e){return l(document.getElementById(e)).length>0},close:function(e,a){var n=l(document.getElementById(e));if(n.length)w.closeDialog(n,a);else if("$escape"===e){var o=g[g.length-1];(n=l(document.getElementById(o))).data("$ngDialogOptions").closeByEscape&&w.closeDialog(n,"$escape")}else B.closeAll(a);return B},closeAll:function(e){for(var a=document.querySelectorAll(".ngdialog"),n=a.length-1;n>=0;n--){var o=a[n];w.closeDialog(l(o),e)}},getOpenDialogs:function(){return g},getDefaults:function(){return e}};angular.forEach(["html","body"],function(e){if(E[e]=i.find(e),c[e]){var a=w.getRouterLocationEventName();D.$on(a,function(){E[e]=i.find(e)})}});var O=w.detectUIRouter();if("1.0.0+"===O){S.get("$transitions").onStart({},function(e){for(;f.length>0;){var a=f.pop();if(!1===w.closeDialog(a))return!1}})}else{var k="legacy"===O?"$stateChangeStart":"$locationChangeStart";D.$on(k,function(e){for(;f.length>0;){var a=f.pop();!1===w.closeDialog(a)&&e.preventDefault()}})}return B}]}),o.directive("ngDialog",["ngDialog",function(e){return{restrict:"A",scope:{ngDialogScope:"="},link:function(a,n,o){n.on("click",function(n){n.preventDefault();var l=angular.isDefined(a.ngDialogScope)?a.ngDialogScope:"noScope";angular.isDefined(o.ngDialogClosePrevious)&&e.close(o.ngDialogClosePrevious);var t=e.getDefaults();e.open({template:o.ngDialog,className:o.ngDialogClass||t.className,appendClassName:o.ngDialogAppendClass,controller:o.ngDialogController,controllerAs:o.ngDialogControllerAs,bindToController:o.ngDialogBindToController,disableAnimation:o.ngDialogDisableAnimation,scope:l,data:o.ngDialogData,showClose:"false"!==o.ngDialogShowClose&&("true"===o.ngDialogShowClose||t.showClose),closeByDocument:"false"!==o.ngDialogCloseByDocument&&("true"===o.ngDialogCloseByDocument||t.closeByDocument),closeByEscape:"false"!==o.ngDialogCloseByEscape&&("true"===o.ngDialogCloseByEscape||t.closeByEscape),overlay:"false"!==o.ngDialogOverlay&&("true"===o.ngDialogOverlay||t.overlay),preCloseCallback:o.ngDialogPreCloseCallback||t.preCloseCallback,onOpenCallback:o.ngDialogOnOpenCallback||t.onOpenCallback,bodyClassName:o.ngDialogBodyClass||t.bodyClassName})})}}}]),o});
define('js/../../../lib/angular-dialog/index',["css!./css/ngDialog.css","css!./css/ngDialog-theme-default.css","css!./css/ngDialog-theme-plain.css","./js/dialog"],function(s,c,e){});
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

define('css!common/angular-bootstrap-timepicker/timepicker',[],function(){});
define('text',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});

define('text!common/angular-bootstrap-timepicker/timepicker/timepicker.html',[],function () { return '<table class="uib-timepicker">\n  <tbody>\n    <tr class="text-center" ng-show="::showSpinners">\n      <td class="uib-increment hours"><a ng-click="incrementHours()" ng-class="{disabled: noIncrementHours()}" class="btn btn-link" ng-disabled="noIncrementHours()" tabindex="-1"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n      <td>&nbsp;</td>\n      <td class="uib-increment minutes"><a ng-click="incrementMinutes()" ng-class="{disabled: noIncrementMinutes()}" class="btn btn-link" ng-disabled="noIncrementMinutes()" tabindex="-1"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n      <td ng-show="showSeconds">&nbsp;</td>\n      <td ng-show="showSeconds" class="uib-increment seconds"><a ng-click="incrementSeconds()" ng-class="{disabled: noIncrementSeconds()}" class="btn btn-link" ng-disabled="noIncrementSeconds()" tabindex="-1"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n      <td ng-show="showMeridian"></td>\n    </tr>\n    <tr>\n      <td class="form-group uib-time hours" ng-class="{\'has-error\': invalidHours}">\n        <input type="text" placeholder="HH" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-readonly="::readonlyInput" maxlength="2" tabindex="{{::tabindex}}" ng-disabled="noIncrementHours()" ng-blur="blur()">\n      </td>\n      <td class="uib-separator">:</td>\n      <td class="form-group uib-time minutes" ng-class="{\'has-error\': invalidMinutes}">\n        <input type="text" placeholder="MM" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="::readonlyInput" maxlength="2" tabindex="{{::tabindex}}" ng-disabled="noIncrementMinutes()" ng-blur="blur()">\n      </td>\n      <td ng-show="showSeconds" class="uib-separator">:</td>\n      <td class="form-group uib-time seconds" ng-class="{\'has-error\': invalidSeconds}" ng-show="showSeconds">\n        <input type="text" placeholder="SS" ng-model="seconds" ng-change="updateSeconds()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2" tabindex="{{::tabindex}}" ng-disabled="noIncrementSeconds()" ng-blur="blur()">\n      </td>\n      <td ng-show="showMeridian" class="uib-time am-pm"><button type="button" ng-class="{disabled: noToggleMeridian()}" class="btn btn-default text-center" ng-click="toggleMeridian()" ng-disabled="noToggleMeridian()" tabindex="{{::tabindex}}">{{meridian}}</button></td>\n    </tr>\n    <tr class="text-center" ng-show="::showSpinners">\n      <td class="uib-decrement hours"><a ng-click="decrementHours()" ng-class="{disabled: noDecrementHours()}" class="btn btn-link" ng-disabled="noDecrementHours()" tabindex="-1"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n      <td>&nbsp;</td>\n      <td class="uib-decrement minutes"><a ng-click="decrementMinutes()" ng-class="{disabled: noDecrementMinutes()}" class="btn btn-link" ng-disabled="noDecrementMinutes()" tabindex="-1"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n      <td ng-show="showSeconds">&nbsp;</td>\n      <td ng-show="showSeconds" class="uib-decrement seconds"><a ng-click="decrementSeconds()" ng-class="{disabled: noDecrementSeconds()}" class="btn btn-link" ng-disabled="noDecrementSeconds()" tabindex="-1"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n      <td ng-show="showMeridian"></td>\n    </tr>\n  </tbody>\n</table>\n';});

define('common/angular-bootstrap-timepicker/timepicker',['require','exports','module'],function (require, exports, module) {
  angular.module('ui.bootstrap.timepicker', [])

    .constant('uibTimepickerConfig', {
      hourStep: 1,
      minuteStep: 1,
      secondStep: 1,
      showMeridian: true,
      showSeconds: false,
      meridians: null,
      readonlyInput: false,
      mousewheel: true,
      arrowkeys: true,
      showSpinners: true,
      templateUrl: 'uib/template/timepicker/timepicker.html'
    })

    .controller('UibTimepickerController', ['$scope', '$element', '$attrs', '$parse', '$log', '$locale', 'uibTimepickerConfig', function ($scope, $element, $attrs, $parse, $log, $locale, timepickerConfig) {
      var selected = new Date(),
        watchers = [],
        ngModelCtrl = {
          $setViewValue: angular.noop
        }, // nullModelCtrl
        meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS,
        padHours = angular.isDefined($attrs.padHours) ? $scope.$parent.$eval($attrs.padHours) : true;

      $scope.tabindex = angular.isDefined($attrs.tabindex) ? $attrs.tabindex : 0;
      $element.removeAttr('tabindex');

      this.init = function (ngModelCtrl_, inputs) {
        ngModelCtrl = ngModelCtrl_;
        ngModelCtrl.$render = this.render;
        ngModelCtrl.$formatters.unshift(function (modelValue) {
          return modelValue ? new Date(modelValue) : null;
        });

        var hoursInputEl = inputs.eq(0),
          minutesInputEl = inputs.eq(1),
          secondsInputEl = inputs.eq(2);

        var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepickerConfig.mousewheel;

        if (mousewheel) {
          this.setupMousewheelEvents(hoursInputEl, minutesInputEl, secondsInputEl);
        }

        var arrowkeys = angular.isDefined($attrs.arrowkeys) ? $scope.$parent.$eval($attrs.arrowkeys) : timepickerConfig.arrowkeys;
        if (arrowkeys) {
          this.setupArrowkeyEvents(hoursInputEl, minutesInputEl, secondsInputEl);
        }

        $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : timepickerConfig.readonlyInput;
        this.setupInputEvents(hoursInputEl, minutesInputEl, secondsInputEl);
      };

      var hourStep = timepickerConfig.hourStep;
      if ($attrs.hourStep) {
        watchers.push($scope.$parent.$watch($parse($attrs.hourStep), function (value) {
          hourStep = +value;
        }));
      }

      var minuteStep = timepickerConfig.minuteStep;
      if ($attrs.minuteStep) {
        watchers.push($scope.$parent.$watch($parse($attrs.minuteStep), function (value) {
          minuteStep = +value;
        }));
      }

      var min;
      watchers.push($scope.$parent.$watch($parse($attrs.min), function (value) {
        var dt = new Date(value);
        min = isNaN(dt) ? undefined : dt;
      }));

      var max;
      watchers.push($scope.$parent.$watch($parse($attrs.max), function (value) {
        var dt = new Date(value);
        max = isNaN(dt) ? undefined : dt;
      }));

      var disabled = false;
      if ($attrs.ngDisabled) {
        watchers.push($scope.$parent.$watch($parse($attrs.ngDisabled), function (value) {
          disabled = value;
        }));
      }

      $scope.noIncrementHours = function () {
        var incrementedSelected = addMinutes(selected, hourStep * 60);
        return disabled || incrementedSelected > max ||
          incrementedSelected < selected && incrementedSelected < min;
      };

      $scope.noDecrementHours = function () {
        var decrementedSelected = addMinutes(selected, -hourStep * 60);
        return disabled || decrementedSelected < min ||
          decrementedSelected > selected && decrementedSelected > max;
      };

      $scope.noIncrementMinutes = function () {
        var incrementedSelected = addMinutes(selected, minuteStep);
        return disabled || incrementedSelected > max ||
          incrementedSelected < selected && incrementedSelected < min;
      };

      $scope.noDecrementMinutes = function () {
        var decrementedSelected = addMinutes(selected, -minuteStep);
        return disabled || decrementedSelected < min ||
          decrementedSelected > selected && decrementedSelected > max;
      };

      $scope.noIncrementSeconds = function () {
        var incrementedSelected = addSeconds(selected, secondStep);
        return disabled || incrementedSelected > max ||
          incrementedSelected < selected && incrementedSelected < min;
      };

      $scope.noDecrementSeconds = function () {
        var decrementedSelected = addSeconds(selected, -secondStep);
        return disabled || decrementedSelected < min ||
          decrementedSelected > selected && decrementedSelected > max;
      };

      $scope.noToggleMeridian = function () {
        if (selected.getHours() < 12) {
          return disabled || addMinutes(selected, 12 * 60) > max;
        }

        return disabled || addMinutes(selected, -12 * 60) < min;
      };

      var secondStep = timepickerConfig.secondStep;
      if ($attrs.secondStep) {
        watchers.push($scope.$parent.$watch($parse($attrs.secondStep), function (value) {
          secondStep = +value;
        }));
      }

      $scope.showSeconds = timepickerConfig.showSeconds;
      if ($attrs.showSeconds) {
        watchers.push($scope.$parent.$watch($parse($attrs.showSeconds), function (value) {
          $scope.showSeconds = !!value;
        }));
      }

      // 12H / 24H mode
      $scope.showMeridian = timepickerConfig.showMeridian;
      if ($attrs.showMeridian) {
        watchers.push($scope.$parent.$watch($parse($attrs.showMeridian), function (value) {
          $scope.showMeridian = !!value;

          if (ngModelCtrl.$error.time) {
            // Evaluate from template
            var hours = getHoursFromTemplate(),
              minutes = getMinutesFromTemplate();
            if (angular.isDefined(hours) && angular.isDefined(minutes)) {
              selected.setHours(hours);
              refresh();
            }
          } else {
            updateTemplate();
          }
        }));
      }

      // Get $scope.hours in 24H mode if valid
      function getHoursFromTemplate() {
        var hours = +$scope.hours;
        var valid = $scope.showMeridian ? hours > 0 && hours < 13 :
          hours >= 0 && hours < 24;
        if (!valid || $scope.hours === '') {
          return undefined;
        }

        if ($scope.showMeridian) {
          if (hours === 12) {
            hours = 0;
          }
          if ($scope.meridian === meridians[1]) {
            hours = hours + 12;
          }
        }
        return hours;
      }

      function getMinutesFromTemplate() {
        var minutes = +$scope.minutes;
        var valid = minutes >= 0 && minutes < 60;
        if (!valid || $scope.minutes === '') {
          return undefined;
        }
        return minutes;
      }

      function getSecondsFromTemplate() {
        var seconds = +$scope.seconds;
        return seconds >= 0 && seconds < 60 ? seconds : undefined;
      }

      function pad(value, noPad) {
        if (value === null) {
          return '';
        }

        return angular.isDefined(value) && value.toString().length < 2 && !noPad ?
          '0' + value : value.toString();
      }

      // Respond on mousewheel spin
      this.setupMousewheelEvents = function (hoursInputEl, minutesInputEl, secondsInputEl) {
        var isScrollingUp = function (e) {
          if (e.originalEvent) {
            e = e.originalEvent;
          }
          //pick correct delta variable depending on event
          var delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
          return e.detail || delta > 0;
        };

        hoursInputEl.bind('mousewheel wheel', function (e) {
          if (!disabled) {
            $scope.$apply(isScrollingUp(e) ? $scope.incrementHours() : $scope.decrementHours());
          }
          e.preventDefault();
        });

        minutesInputEl.bind('mousewheel wheel', function (e) {
          if (!disabled) {
            $scope.$apply(isScrollingUp(e) ? $scope.incrementMinutes() : $scope.decrementMinutes());
          }
          e.preventDefault();
        });

        secondsInputEl.bind('mousewheel wheel', function (e) {
          if (!disabled) {
            $scope.$apply(isScrollingUp(e) ? $scope.incrementSeconds() : $scope.decrementSeconds());
          }
          e.preventDefault();
        });
      };

      // Respond on up/down arrowkeys
      this.setupArrowkeyEvents = function (hoursInputEl, minutesInputEl, secondsInputEl) {
        hoursInputEl.bind('keydown', function (e) {
          if (!disabled) {
            if (e.which === 38) { // up
              e.preventDefault();
              $scope.incrementHours();
              $scope.$apply();
            } else if (e.which === 40) { // down
              e.preventDefault();
              $scope.decrementHours();
              $scope.$apply();
            }
          }
        });

        minutesInputEl.bind('keydown', function (e) {
          if (!disabled) {
            if (e.which === 38) { // up
              e.preventDefault();
              $scope.incrementMinutes();
              $scope.$apply();
            } else if (e.which === 40) { // down
              e.preventDefault();
              $scope.decrementMinutes();
              $scope.$apply();
            }
          }
        });

        secondsInputEl.bind('keydown', function (e) {
          if (!disabled) {
            if (e.which === 38) { // up
              e.preventDefault();
              $scope.incrementSeconds();
              $scope.$apply();
            } else if (e.which === 40) { // down
              e.preventDefault();
              $scope.decrementSeconds();
              $scope.$apply();
            }
          }
        });
      };

      this.setupInputEvents = function (hoursInputEl, minutesInputEl, secondsInputEl) {
        if ($scope.readonlyInput) {
          $scope.updateHours = angular.noop;
          $scope.updateMinutes = angular.noop;
          $scope.updateSeconds = angular.noop;
          return;
        }

        var invalidate = function (invalidHours, invalidMinutes, invalidSeconds) {
          ngModelCtrl.$setViewValue(null);
          ngModelCtrl.$setValidity('time', false);
          if (angular.isDefined(invalidHours)) {
            $scope.invalidHours = invalidHours;
          }

          if (angular.isDefined(invalidMinutes)) {
            $scope.invalidMinutes = invalidMinutes;
          }

          if (angular.isDefined(invalidSeconds)) {
            $scope.invalidSeconds = invalidSeconds;
          }
        };

        $scope.updateHours = function () {
          var hours = getHoursFromTemplate(),
            minutes = getMinutesFromTemplate();

          ngModelCtrl.$setDirty();

          if (angular.isDefined(hours) && angular.isDefined(minutes)) {
            selected.setHours(hours);
            selected.setMinutes(minutes);
            if (selected < min || selected > max) {
              invalidate(true);
            } else {
              refresh('h');
            }
          } else {
            invalidate(true);
          }
        };

        hoursInputEl.bind('blur', function (e) {
          ngModelCtrl.$setTouched();
          if (modelIsEmpty()) {
            makeValid();
          } else if ($scope.hours === null || $scope.hours === '') {
            invalidate(true);
          } else if (!$scope.invalidHours && $scope.hours < 10) {
            $scope.$apply(function () {
              $scope.hours = pad($scope.hours, !padHours);
            });
          }
        });

        $scope.updateMinutes = function () {
          var minutes = getMinutesFromTemplate(),
            hours = getHoursFromTemplate();

          ngModelCtrl.$setDirty();

          if (angular.isDefined(minutes) && angular.isDefined(hours)) {
            selected.setHours(hours);
            selected.setMinutes(minutes);
            if (selected < min || selected > max) {
              invalidate(undefined, true);
            } else {
              refresh('m');
            }
          } else {
            invalidate(undefined, true);
          }
        };

        minutesInputEl.bind('blur', function (e) {
          ngModelCtrl.$setTouched();
          if (modelIsEmpty()) {
            makeValid();
          } else if ($scope.minutes === null) {
            invalidate(undefined, true);
          } else if (!$scope.invalidMinutes && $scope.minutes < 10) {
            $scope.$apply(function () {
              $scope.minutes = pad($scope.minutes);
            });
          }
        });

        $scope.updateSeconds = function () {
          var seconds = getSecondsFromTemplate();

          ngModelCtrl.$setDirty();

          if (angular.isDefined(seconds)) {
            selected.setSeconds(seconds);
            refresh('s');
          } else {
            invalidate(undefined, undefined, true);
          }
        };

        secondsInputEl.bind('blur', function (e) {
          if (modelIsEmpty()) {
            makeValid();
          } else if (!$scope.invalidSeconds && $scope.seconds < 10) {
            $scope.$apply(function () {
              $scope.seconds = pad($scope.seconds);
            });
          }
        });

      };

      this.render = function () {
        var date = ngModelCtrl.$viewValue;
        if (isNaN(date)) {
          ngModelCtrl.$setValidity('time', false);
          $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
        } else {
          if (date) {
            selected = date;
          }

          if (selected < min || selected > max) {
            ngModelCtrl.$setValidity('time', false);
            $scope.invalidHours = true;
            $scope.invalidMinutes = true;
          } else {
            makeValid();
          }
          updateTemplate();
        }
      };

      // Call internally when we know that model is valid.
      function refresh(keyboardChange) {
        makeValid();
        ngModelCtrl.$setViewValue(new Date(selected));
        updateTemplate(keyboardChange);
      }

      function makeValid() {
        ngModelCtrl.$setValidity('time', true);
        $scope.invalidHours = false;
        $scope.invalidMinutes = false;
        $scope.invalidSeconds = false;
      }

      function updateTemplate(keyboardChange) {
        if (!ngModelCtrl.$modelValue) {
          $scope.hours = null;
          $scope.minutes = null;
          $scope.seconds = null;
          $scope.meridian = meridians[0];
        } else {
          var hours = selected.getHours(),
            minutes = selected.getMinutes(),
            seconds = selected.getSeconds();

          if ($scope.showMeridian) {
            hours = hours === 0 || hours === 12 ? 12 : hours % 12; // Convert 24 to 12 hour system
          }

          $scope.hours = keyboardChange === 'h' ? hours : pad(hours, !padHours);
          if (keyboardChange !== 'm') {
            $scope.minutes = pad(minutes);
          }
          $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];

          if (keyboardChange !== 's') {
            $scope.seconds = pad(seconds);
          }
          $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
        }
      }

      function addSecondsToSelected(seconds) {
        selected = addSeconds(selected, seconds);
        refresh();
      }

      function addMinutes(selected, minutes) {
        return addSeconds(selected, minutes * 60);
      }

      function addSeconds(date, seconds) {
        var dt = new Date(date.getTime() + seconds * 1000);
        var newDate = new Date(date);
        newDate.setHours(dt.getHours(), dt.getMinutes(), dt.getSeconds());
        return newDate;
      }

      function modelIsEmpty() {
        return ($scope.hours === null || $scope.hours === '') &&
          ($scope.minutes === null || $scope.minutes === '') &&
          (!$scope.showSeconds || $scope.showSeconds && ($scope.seconds === null || $scope.seconds === ''));
      }

      $scope.showSpinners = angular.isDefined($attrs.showSpinners) ?
        $scope.$parent.$eval($attrs.showSpinners) : timepickerConfig.showSpinners;

      $scope.incrementHours = function () {
        if (!$scope.noIncrementHours()) {
          addSecondsToSelected(hourStep * 60 * 60);
        }
      };

      $scope.decrementHours = function () {
        if (!$scope.noDecrementHours()) {
          addSecondsToSelected(-hourStep * 60 * 60);
        }
      };

      $scope.incrementMinutes = function () {
        if (!$scope.noIncrementMinutes()) {
          addSecondsToSelected(minuteStep * 60);
        }
      };

      $scope.decrementMinutes = function () {
        if (!$scope.noDecrementMinutes()) {
          addSecondsToSelected(-minuteStep * 60);
        }
      };

      $scope.incrementSeconds = function () {
        if (!$scope.noIncrementSeconds()) {
          addSecondsToSelected(secondStep);
        }
      };

      $scope.decrementSeconds = function () {
        if (!$scope.noDecrementSeconds()) {
          addSecondsToSelected(-secondStep);
        }
      };

      $scope.toggleMeridian = function () {
        var minutes = getMinutesFromTemplate(),
          hours = getHoursFromTemplate();

        if (!$scope.noToggleMeridian()) {
          if (angular.isDefined(minutes) && angular.isDefined(hours)) {
            addSecondsToSelected(12 * 60 * (selected.getHours() < 12 ? 60 : -60));
          } else {
            $scope.meridian = $scope.meridian === meridians[0] ? meridians[1] : meridians[0];
          }
        }
      };

      $scope.blur = function () {
        ngModelCtrl.$setTouched();
      };

      $scope.$on('$destroy', function () {
        while (watchers.length) {
          watchers.shift()();
        }
      });
    }])

    .directive('uibTimepicker', ['uibTimepickerConfig', function (uibTimepickerConfig) {
      return {
        require: ['uibTimepicker', '?^ngModel'],
        restrict: 'A',
        controller: 'UibTimepickerController',
        controllerAs: 'timepicker',
        scope: {},
        templateUrl: function (element, attrs) {
          return attrs.templateUrl || uibTimepickerConfig.templateUrl;
        },
        link: function (scope, element, attrs, ctrls) {
          var timepickerCtrl = ctrls[0],
            ngModelCtrl = ctrls[1];
          if (ngModelCtrl) {
            timepickerCtrl.init(ngModelCtrl, element.find('input'));
          }
        }
      };
    }]);
})

;
define('common/angular-bootstrap-timepicker/index-nocss',['require','exports','module','text!./timepicker/timepicker.html','./timepicker'],function (require, exports, module) {
    var template = require('text!./timepicker/timepicker.html');
    require('./timepicker');

    var MODULE_NAME = 'ui.bootstrap.module.timepicker';

    angular.module(MODULE_NAME, ['ui.bootstrap.timepicker', 'uib/template/timepicker/timepicker.html']);
    angular.module("uib/template/timepicker/timepicker.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("uib/template/timepicker/timepicker.html", template);
    }]);
    module.exports = MODULE_NAME;
})
;
define('common/angular-bootstrap-timepicker/index',['require','exports','module','css!./timepicker.css','./index-nocss'],function (require, exports, module) {

    require('css!./timepicker.css');
    module.exports = require('./index-nocss');
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
define('js/common/table/initSort',['require','exports','module'],function (require, exports, module) {
    return function ($scope) {
        $scope.tableSortIndex = undefined;
        $scope.tableSortIsAsc = undefined;
        ['showTableHeaderFields', 'showTableFields', 'sortFields', 'tableHeaderFields', 'tableFields'].forEach(function (key) {
            $scope[key] = [];
        })
        $scope.sortFieldByName = function (index, isAsc) {
            if (index === $scope.tableSortIndex && $scope.tableSortIsAsc === isAsc) {
                $scope.tableSortIndex = $scope.tableSortIsAsc = undefined;
                $scope.getData();
                return;
            }
            //get data  有排序
            $scope.tableSortIndex = index;
            $scope.tableSortIsAsc = isAsc;

            $scope.getData({
                sortField: $scope.showTableFields[index],
                isAsc: isAsc
            });
        }
    }
});
define('js/common/table/initExpand',['require','exports','module'],function (require, exports, module) {
    return function ($scope, key) {
        key = key || 'id';
        $scope.expandRows = []
        $scope.isShowRows = function (data) {
            return $scope.expandRows.indexOf(data) >= 0;
        };
        $scope.tableExpand = function (data) {
            data.isExpand = !data.isExpand;
            if (data.isExpand) {
                $scope.expandRows.push(data);
            } else {
                $scope.expandRows = $scope.expandRows.filter(function (val) {
                    return val[key] !== data[key];
                });
            }
        };
    }
});
define('js/common/table/index',['require','exports','module','./initSort','./initExpand'],function (require, exports, module) {
    var initSort = require('./initSort');
    var initExpand = require('./initExpand');
    var ACTION_MAP = {
        sort: initSort,
        expand: initExpand
    }
    return function ($scope, action) {
        action = action || ['sort', 'expand']
        action.forEach(function (key) {
            ACTION_MAP[key]($scope)
        })
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
define('js/common/dialog/validateDialogForm',['require','exports','module','./../../../../../lib/es6-promise/es6-promise'],function (require, exports, module) {
    var Promise = require('./../../../../../lib/es6-promise/es6-promise');
    // return function (myForm, func, dialog, $innerScope, $timeout, isValidateBaseForm) {
    return function (myForm, dialog, $innerScope, $timeout, isValidateBaseForm) {
        return new Promise(function (resolve, reject) {
            if (dialog.sendDataing === true) {
                return;
            }
            angular.forEach(myForm.$error.required, function (field) {
                field.$setTouched();
            });
            $innerScope.showErrors = true;
            $timeout(function () {
                if (isValidateBaseForm) {
                    if (document.querySelector('.ng-invalid') || Object.keys(myForm.$error).length) {
                        console.log(myForm);
                        reject()
                        return;
                    }
                }
                //has error
                if (Object.keys(myForm.$error).length) {
                    console.log(myForm);
                    reject()
                    return;
                }
                // angular.isFunction(func) && func();
                resolve();
            });
        })

    };
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
define('js/common/datetimepicder-pop-init/time-option',['require','exports','module'],function (require, exports, module) {
    return {
        formatYear: 'yy',
        maxDate: new Date(2030, 5, 22),
        minDate: new Date(),
        initDate: new Date,
        showWeeks: true,
    }
});
//是编辑模式
define('js/common/datetimepicder-pop-init/index',['require','exports','module','./time-option'],function (require, exports, module) {
    var expireTimeOptions = require('./time-option');
    return function (ctrl, options) {

        ctrl.expireTimeOptions = angular.extend({}, expireTimeOptions, options);
        ctrl.expireTimeIsOpen = false;

        ctrl.expireTimeOpen = function () {
            ctrl.expireTimeIsOpen = true;
        }
        ctrl.expireTimeClose = function () {
            ctrl.expireTimeIsOpen = false;
        }
    }
});
/**
 * @author xiongjian
 * @email xiongjian@didichuxing.com
 * @create date 2017-08-15 05:37:40
 * @modify date 2017-08-15 05:37:40
 * @desc [description]
 */
define('js/alarm-order/page-init-data',['require','exports','module'],function (require, exports, module) {
    return {
        deptInfo: [],
        safetyEngineers: [],
        processers: [],
        followers: [],
        alarmTags: []
    };
});
define('js/bug/send-data',['require','exports','module','./../../../../lib/es6-promise/es6-promise'],function (require, exports, module) {
    var Promise = require('./../../../../lib/es6-promise/es6-promise');
    return function ($http, url, data, dialog, callback) {
        dialog.sendDataing = true;
        return new Promise(function (resolve, reject) {
            $http({
                method: 'POST',
                url: url,
                data: data
            }).success(function (res) {
                if (String(res.errno) !== '0') {
                    return;
                }
                dialog.close();
                //angular.isFunction(callback) && callback(res.data);
                resolve(res);
                dialog.sendDataing = false;
            }).error(function (data) {
                dialog.sendDataing = false;
                reject(data);
            });
        });
    };
});
define('js/alarm/setTableFields',['require','exports','module'],function (require, exports, module) {
    var KEYS_MAP_PRE = {
        checkbox: "checkbox",
        id: "ID",
        state: "状态",
        typeName: "类型",
        riskLevel: "等级",
        alarmTimeFormat: "报警时间"
    };

    var KEYS_MAP_END = {
        alarmWrokOrderId: "工单ID",
        processerJson: "处理人",
        updateTime: "处理时间",
        remark: "备注"
    };

    var KEYS_PRE = Object.keys(KEYS_MAP_PRE);
    var KEYS_END = Object.keys(KEYS_MAP_END);

    var KEYS_PRE_TEXT = KEYS_PRE.map(function (key) {
        return KEYS_MAP_PRE[key]
    });

    var KEYS_END_TEXT = KEYS_END.map(function (key) {
        return KEYS_MAP_END[key]
    });

    return function (data, $scope, alarmControl) {
        var tableHeaderText = data.map(function (val) {
            return val.fieldNameZh;
        });

        var tableBodyKeys = data.map(function (val) {
            return val.fieldNameEn;
        });

        $scope.tableHeaderFields = KEYS_PRE_TEXT.concat(tableHeaderText, KEYS_END_TEXT);
        $scope.tableFields = KEYS_PRE.concat(tableBodyKeys, KEYS_END);
        $scope.tableLinkFields = data.filter(function (val) {
            return val.fieldAdapter === 2
        }).map(function (val) {
            return val.fieldNameEn;
        });

        if (alarmControl !== 1) {
            $scope.tableHeaderFields.shift()
            $scope.tableFields.shift()
        }
    }
});
/**
 * @author xiongjian
 * @email xiongjian@didichuxing.com
 * @create date 2017-08-15 05:38:04
 * @modify date 2017-08-15 05:38:04
 * @desc [description]
*/
define('js/alarm-order/getFields',['require','exports','module','../alarm/setTableFields'],function (require, exports, module) {
    var setTableFields = require('../alarm/setTableFields');
    var SHOW_NUM = 8;
    return function ($scope, $http, alarmControl, params) {
        return $http({
            method: "GET",
            url: '/alarm/workOrder/getFields',
            params: params
        }).success(function (res) {
            setTableFields(res.data.fields, $scope, alarmControl)
            //表尾添加是否保留 表头添加数据展开操作
            $scope.showTableHeaderFields = $scope.tableHeaderFields.slice(0, SHOW_NUM)
            $scope.showTableHeaderFields.unshift('显示详情')

            $scope.showTableFields = $scope.tableFields.slice(0, SHOW_NUM)
            $scope.showTableFields.unshift('expand')
        });
    }
});
define('js/alarm-order/redirectPage',['require','exports','module'],function (require, exports, module) {
    return function (res) {
        if (String(res.errno) !== '0') {
            alert(res.errmsg)
            return;
        }
        if (res.data.state === 1) {
            window.location.href = "alarm-order-edit.html?id=" + res.data.id;
        } else {
            window.location.href = "alarm-order-detail.html?id=" + res.data.id;
        }
    }
});
define('js/alarm/adapterAlarmData',['require','exports','module'],function (require, exports, module) {
    return function (data, cacheIds, checkStatus) {
        cacheIds = cacheIds || {}
        if (!Array.isArray(data.datas) || !data.datas.length) {
            return data;
        }
        var keys = [];
        var itemData = data.datas[0].alarmData;
        if (itemData) {
            keys = Object.keys(itemData);
        }
        //把alarmData里面的数据拉升到一级
        data.datas.forEach(function (val) {
            //是否选中这一项 根据传入的参数进行判断
            if (val.id in cacheIds) {
                val.isChecked = checkStatus;
            }
            angular.isObject(val.alarmData) && keys.forEach(function (key) {
                val[key] = val.alarmData[key];
            });
        })
        return data;
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


define('text!js/alarm-order/dlp-confirm-dialog.html',[],function () { return '<form class="p-form" name="dlpForm">\n\n    <div class="p-form-item form-flex">\n        <span class="red-color label">是否发起“通报”审核流程？</span>\n        <div class="wrap-input form-flex-item">\n            <label class="item-label"><input type="radio" ng-model="isDlpConfirm" ng-required="true" ng-change="change()" ng-checked="true" value="1" name="isDlpConfirm" style="margin:0 5px">是</label>\n            <label class="item-label"><input type="radio" ng-model="isDlpConfirm" ng-required="true" ng-change="change()" value="0" name="isDlpConfirm" style="margin:0 5px">否</label>\n        </div>\n    </div>\n\n    <div class="p-form-item">\n        <label class="p-col-2"><i class="i-must" ng-show="isRequire">*</i>被通报人：</label>\n        <div class="wrap-input p-col-10" ng-class="{\'p-error\':!notifiers.length && isRequire && showErrors}">\n            <ui-my-auto-complete url="userList" placeholder="请输入关注人" ng-model="notifiers" ng-cloak>\n                <ui-select-match-item>{{$item.department.split(\'>\')[0]}}-{{$item.name}}</ui-select-match-item>\n                <ui-auto-complete-list>{{item.department}}-{{item.name}}-{{item.email}}</ui-auto-complete-list>\n            </ui-my-auto-complete>\n            <span class="p-error-msg" ng-class="{\'ng-invalid\':!notifiers.length && isRequire && showErrors  }" ng-show="!notifiers.length">请输入并选择被通报人</span>\n        </div>\n    </div>\n\n    <div class="p-form-item">\n        <label class="p-col-2"><i class="i-must" ng-show="isRequire">*</i>被通报上级：</label>\n        <div class="wrap-input p-col-10" ng-class="{\'p-error\':!leader.length && isRequire && showErrors}">\n            <ui-my-auto-complete url="userList" placeholder="请输入关注人" ng-model="leader" ng-cloak>\n                <ui-select-match-item>{{$item.department.split(\'>\')[0]}}-{{$item.name}}</ui-select-match-item>\n                <ui-auto-complete-list>{{item.department}}-{{item.name}}-{{item.email}}</ui-auto-complete-list>\n            </ui-my-auto-complete>\n            <span class="p-error-msg" ng-class="{\'ng-invalid\':!leader.length && isRequire && showErrors}" ng-show="!leader.length">请输入并选择被通报上级</span>\n        </div>\n    </div>\n\n    <div class="p-form-item">\n        <label class="p-col-2"><i class="i-must" ng-show="isRequire">*</i>被通报审核人：</label>\n        <div class="wrap-input p-col-10" ng-class="{\'p-error\':!reviewers.length && isRequire && showErrors}">\n            <ui-my-auto-complete url="userList" placeholder="请输入关注人" ng-model="reviewers" ng-cloak>\n                <ui-select-match-item>{{$item.department.split(\'>\')[0]}}-{{$item.name}}</ui-select-match-item>\n                <ui-auto-complete-list>{{item.department}}-{{item.name}}-{{item.email}}</ui-auto-complete-list>\n            </ui-my-auto-complete>\n            <span class="p-error-msg" ng-class="{\'ng-invalid\':!reviewers.length && isRequire && showErrors  }" ng-show="!reviewers.length">请输入并选择被通报审核人</span>\n        </div>\n    </div>\n\n    <div class="p-form-item">\n        <label class="p-col-2 p-muti"><i class="i-must ">*</i>原因：</label>\n        <div class="wrap-input p-col-10" ng-class="{\'p-error\':dlpForm.remark.$error.required && dlpForm.remark.$touched}">\n            <textarea class="p-form-control p-reason" ng-required="true" name="remark" placeholder="请输入备注" ng-model="remark"></textarea>\n            <span ng-show="dlpForm.remark.$error.required" class="p-error-msg">请输入备注</span>\n        </div>\n    </div>\n</form>\n<div class="wrap-center-btn">\n    <button class="p-btn" ng-click="pageAgree()">确认</button>\n    <button class="p-btn p-btn-gray" ng-click="dialogClose($event)">取消</button>\n</div>';});


define('text!common/export-data/tpl.html',[],function () { return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html lang="en">\n\n<head>\n    <meta charset="UTF-8">\n    <title>${title}</title>\n</head>\n\n<body>\n    ${data}\n</body>\n\n</html>';});

define('common/export-data/index',['require','exports','module','text!./tpl.html'],function (require, exports, module) {
    var tpl = require('text!./tpl.html');

    var EXT_NAME_MAP = {
        excel: 'xls'
        /*,txt: 'txt',
        json: 'json'*/
    };

    var getExtendName = function (type) {
        return EXT_NAME_MAP[type] || type;
    };

    var TYPE_FN = {
        excel: function (data) {
            return '<table>${thead}${tbody}</table>'.replace('${thead}', data.thead).replace('${tbody}', data.tbody);
        }
    }
    
    return function (data, name, extName) {
        if (!data) {
            console.trace('data is error');
            return;
        }
        var exportStr = tpl.replace('${data}', data).replace('${title}', name);
        var url = URL.createObjectURL(new Blob([exportStr], {
            type: 'text/html'
        }));
        var downloadBtn = document.createElement('a');
        document.body.appendChild(downloadBtn);
        downloadBtn.download = name + '.' + extName;
        downloadBtn.href = url;
        downloadBtn.click();
        setTimeout(function () {
            downloadBtn.parentElement.removeChild(downloadBtn);
        });
    }
});
define('common/export-data/export-excel',['require','exports','module','./index'],function (require, exports, module) {
    var exportData = require('./index');

    return function (data, name, extName) {
        if (!data) {
            console.log('data is error');
            return;
        }
        var Keys = Object.keys(data.thead);

        var exportStr = '<table> <thead> <tr>${thead}</tr> </thead> <tbody> ${tbody} </tbody></table>'.replace('${thead}',
            Object.keys(data.thead).map(function (key) {
                return '<th>' + data.thead[key] + '</th>';
            }).join('')).replace('${tbody}', data.tbody.map(function (val) {
            return '<tr>' + Keys.map(function (key) {
                return '<td>' + val[key] + '</td>';
            }).join('') + '</tr>';
        }).join(''));

        exportData(exportStr, name, extName);
    }
});
/**
 * @author xiongjian
 * @email xiongjian@didichuxing.com
 * @create date 2017-08-24 10:34:26
 * @modify date 2017-08-24 10:34:26
 * @desc [description]
 */

define('js/common/exportAlarmList',['require','exports','module','../../common/export-data/export-excel','../alarm/adapterAlarmData'],function (require, exports, module) {
    var exportExcel = require('../../common/export-data/export-excel');
    var adapterAlarmData = require('../alarm/adapterAlarmData');
    return function ($scope, $http, $filter, tableHeader, tableBody) {
        var EXPORT_MAP = {};
        tableHeader.forEach(function (key, index) {
            EXPORT_MAP[tableBody[index]] = key;
        })
        var filterData = function (data) {
            if (!Array.isArray(data)) {
                return data;
            }
            data.forEach(function (val) {
                val.processerJson = $filter('getName')(val.processerJson);
            })
            return data;
        }
        $scope.exportAlarmList = function () {
            $http({
                method: "GET",
                url: $scope.getDataUrl,
                params: {
                    page: 1,
                    size: $scope.totalItems || 10000
                }
            }).success(function (res) {
                if (String(res.errno) !== '0') {
                    return;
                }
                var data = filterData(adapterAlarmData({
                    datas: res.data
                }).datas)
                exportExcel({
                    thead: EXPORT_MAP,
                    tbody: data
                }, '告警信息', 'xls')
            });
        };
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

define('text!js/alarm-order/trun-to-event-dialog.html',[],function () { return '<h2 class="p-dialog-title">{{dialog.title}}</h2>\n    <div class="p-form-item flex-between">\n        <div class="p-col-12 form-flex">\n            <label class="item-label"><i class="i-must">*</i>事件名称：</label>\n            <div class="wrap-input form-flex-item">\n                <input class="p-form-control" type="text" name="event_name" id="event_name" ng-model="event_name" required>\n            </div>\n        </div>\n    </div>\n    <div class="p-form-item flex-between">\n        <div class="p-col-5 form-flex">\n            <label class="item-label "><i class="i-must">*</i>事件类型：</label>\n            <div class="wrap-input form-flex-item">\n                <select class="p-form-control" ng-model="type" id="type" ng-change="typeChange()" ng-required="!type">\n                    <option value="">请选择</option>\n                    <option ng-repeat="item in pageConfig.type" value="{{item.id}}">{{item.dName}}</option>\n                </select>\n            </div>\n        </div>\n        <div class="p-col-5 form-flex">\n            <label class="item-label "><i class="i-must">*</i>严重程度：</label>\n            <div class="wrap-input form-flex-item">\n                <select class="p-form-control" ng-model="level" id="level" ng-change="levelChange()" ng-required="!level">\n                    <option value="">请选择</option>\n                    <option ng-repeat="item in pageConfig.level" value="{{item.id}}">{{item.dName}}</option>\n                </select>\n            </div>\n        </div>\n    </div>\n    <div class="p-form-item flex-between">\n        <div class="p-col-5 form-flex">\n            <label class="item-label "><i class="i-must">*</i>发现方式：</label>\n            <div class="wrap-input form-flex-item">\n                <select class="p-form-control" ng-model="source" id="source" ng-change="sourceChange()" ng-required="!source">\n     `               <option value="">请选择</option>\n                    <option ng-repeat="item in pageConfig.source" value="{{item.id}}">{{item.dName}}</option>\n                </select>\n            </div>\n        </div>\n        <div class="p-col-5 form-flex">\n            <label class="item-label "><i class="i-must">*</i>事件状态：</label>\n            <div class="wrap-input form-flex-item">\n                <select class="p-form-control" ng-model="status" id="status" ng-change="statusChange()" ng-required="!status">\n                    <option value="">请选择</option>\n                    <option ng-repeat="item in pageConfig.status" value="{{item.id}}">{{item.dName}}</option>\n                </select>\n            </div>\n        </div>\n    </div>\n    <div class="p-form-item flex-between">\n        <div class="p-col-5 form-flex">\n            <label class="item-label ">\n                <span class="i-placeholder">x</span>发现时间：</label>\n            <div class="wrap-input form-flex-item">\n                <div class="input-group" style="margin-top: 36px;">\n                    <input id="occured_time" class="form-control js-date-picker" type="text" name="occured_time" readonly="readonly" uib-datepicker-popup\n                        close-text="关闭" clear-text="清除" current-text="今天" datepicker-popup="yyyy-MM-dd HH:mm:ss" datepicker-options="occuredTimeOptions"\n                        ng-required="true" is-open="occuredTimeIsOpen" onclose="occuredTimeClose()" ng-model="occured_time" ng-click="occuredTimeOpen()">\n                    <span class="input-group-btn" ng-click="occuredTimeOpen()">\n                        <button type="button" class="btn btn-default">\n                            <i class="glyphicon glyphicon-calendar"></i>\n                        </button>\n                    </span>\n                </div>\n                <div class="p-col-4" uib-timepicker ng-model="occured_time_h" ng-change="changed()" hour-step="hstep" minute-step="mstep" show-meridian="ismeridian"></div>\n            </div>\n        </div>\n        <div class="p-col-5 form-flex">\n            <label class="item-label ">\n                <i class="i-must">*</i>确认时间：</label>\n            <div class="wrap-input form-flex-item">\n                <div class="input-group" style="margin-top: 36px;">\n                    <input id="confirm_time" \n                        class="form-control js-date-picker readonly" \n                        type="text" \n                        name="confirm_time" \n                        uib-datepicker-popup\n                        close-text="关闭" \n                        clear-text="清除" \n                        current-text="今天" \n                        datepicker-popup="yyyy-MM-dd HH:mm:ss" \n                        datepicker-options="confirmTimeOptions"\n                        required="true" \n                        is-open="confirmTimeIsOpen" \n                        onclose="confirmTimeClose()" \n                        ng-model="confirm_time" \n                        ng-click="confirmTimeOpen()">\n                    <span class="input-group-btn" ng-click="confirmTimeOpen()">\n                        <button type="button" class="btn btn-default">\n                            <i class="glyphicon glyphicon-calendar"></i>\n                        </button>\n                    </span>\n                </div>\n                <div class="p-col-4" uib-timepicker ng-model="confirm_time_h" ng-change="changed()" hour-step="hstep" minute-step="mstep" show-meridian="ismeridian"></div>\n            </div>\n        </div>\n    </div>\n    <div class="p-form-item flex-between">\n        <div class="p-col-5 form-flex">\n            <label class="item-label "><span class="i-placeholder">x</span>发现系统：</label>\n            <div class="wrap-input form-flex-item">\n                <input class="p-form-control" type="text" name="system" id="system" ng-model="system">\n            </div>\n        </div>\n        <div class="p-col-5 form-flex">\n            <label class="item-label "><span class="i-placeholder">x</span>修复时间：</label>\n            <div class="wrap-input form-flex-item">\n                <div>\n                    <div class="input-group" style="margin-top: 36px;">\n                        <input id="repair_time" class="form-control js-date-picker" type="text" name="repair_time" readonly="readonly" uib-datepicker-popup\n                            close-text="关闭" clear-text="清除" current-text="今天" datepicker-popup="yyyy-MM-dd HH:mm:ss" datepicker-options="expireTimeOptions"\n                            ng-required="true" is-open="expireTimeIsOpen" onclose="expireTimeClose()" ng-model="repair_time" ng-click="expireTimeOpen()">\n                        <span class="input-group-btn" ng-click="expireTimeOpen()">\n                            <button type="button" class="btn btn-default">\n                                <i class="glyphicon glyphicon-calendar"></i>\n                            </button>\n                        </span>\n                    </div>\n                </div>\n                <div class="p-col-4" uib-timepicker ng-model="repair_time_h" ng-change="changed()" hour-step="hstep" minute-step="mstep" show-meridian="ismeridian"></div>\n            </div>\n        </div>\n    </div>\n    <div class="p-form-item flex-between">\n        <div class="p-col-12 form-flex">\n            <label class="item-label"><span class="i-placeholder">x</span>涉及人员：</label>\n            <div class="wrap-input form-flex-item">\n                <ui-my-auto-complete url="getUsersUrl" placeholder="请输入人员名称" name="accounts" ng-model="accounts">\n                    <ui-select-match-item>{{$item.department.split(\'>\')[0]}}-{{$item.name}} </ui-select-match-item>\n                    <ui-auto-complete-list>{{item.department}}-{{item.name}}-{{item.email}}</ui-auto-complete-list>\n                </ui-my-auto-complete>\n            </div>\n        </div>\n    </div>\n    <div class="p-form-item flex-between">\n        <div class="p-col-12 form-flex">\n            <label class="item-label"><span class="i-placeholder">x</span>涉及部门：</label>\n            <div class="wrap-input form-flex-item">\n                <ui-my-auto-complete url="getDepartmentUrl" placeholder="请输入部门名称" name="depts" ng-model="depts">\n                    <ui-select-match-item>{{$item.productName}} </ui-select-match-item>\n                    <ui-auto-complete-list>{{item.productName}}</ui-auto-complete-list>\n                </ui-my-auto-complete>\n            </div>\n        </div>\n    </div>\n\n    <div class="p-form-item flex-between">\n        <div class="p-col-12 form-flex" style="align-items: flex-start">\n            <label class="item-label"><span class="i-placeholder">x</span>调查结果：</label>\n            <div class="wrap-input form-flex-item">\n                <textarea class="p-form-control p-reason" style="height: 120px" name="survey_result" placeholder="请输入调查结果（非必填）" ng-model="survey_result"></textarea>\n            </div>\n        </div>\n    </div>\n    <div class="p-form-item flex-between">\n        <div class="p-col-12 form-flex" style="align-items: flex-start">\n            <label class="item-label"><span class="i-placeholder">x</span>处罚结果：</label>\n            <div class="wrap-input form-flex-item">\n                <textarea class="p-form-control p-reason" style="height: 120px" name="punish_result" placeholder="请输入处罚结果（非必填）" ng-model="punish_result"></textarea>\n            </div>\n        </div>\n    </div>\n    <div class="p-form-item flex-between">\n        <div class="p-col-12 form-flex" style="align-items: flex-start">\n            <label class="item-label"><span class="i-placeholder">x</span>备&#12288;&#12288;注：</label>\n            <div class="wrap-input form-flex-item">\n                <textarea class="p-form-control p-reason" style="height: 120px" name="remark" placeholder="请输入备注（非必填）" ng-model="remark"></textarea>\n            </div>\n        </div>\n    </div>\n\n<div class="p-form-item flex-around">\n    <button class="p-btn" type="submit" ng-click="handleSubmitClick($event)">提交</button>\n    <button class="p-btn" type="button" ng-click="handleCloseClick($event)">关闭</button>\n</div>\n';});


define('text!js/alarm/dialog.html',[],function () { return '<form class="p-form" name="reasonForm">\n    {{desc}}\n    <div class="p-form-item" ng-if="!customReason">\n        <div class="wrap-input p-col-12">\n            <textarea class="p-form-control p-reason" maxlength="50" name="reason" placeholder="请输入备注（非必填）" ng-model="reason"></textarea>\n        </div>\n    </div>\n</form>\n<div class="wrap-center-btn" ng-if="!customButton">\n    <button class="p-btn" ng-click="pageAgree()">{{confirmText}}</button>\n    <button class="p-btn p-btn-gray" ng-click="dialogClose($event)">{{cancelText}}</button>\n</div>';});

define('js/alarm/showConfirmDialog',['require','exports','module','../../common/angular-bootstrap-datepicker-ppopup/angular-bootstrap-datepicker-ppopup','text!./dialog.html','../common/datetimepicder-pop-init/index','./../common/add-water-mark'],function (require, exports, module) {
    require('../../common/angular-bootstrap-datepicker-ppopup/angular-bootstrap-datepicker-ppopup');
    var htmlStr = require('text!./dialog.html');
    var datetimepicderInit =  require('../common/datetimepicder-pop-init/index');
    var addWaterMark = require('./../common/add-water-mark')
    var defaultOpts = {
        width: 538,
        heigth: 320,
        tpl: '',
        htmlTpl: htmlStr,
        callback: function () {},
        data: {
            customReason: false
        }
    }
    return function (ngDialog, opts) {
        opts = angular.extend({}, defaultOpts, opts || {});
        var dialog = ngDialog.open({
            className: 'ngdialog-theme-default p-dialog',
            plain: true,
            width: opts.width,
            height: opts.height,
            showClose: true,
            name: 'show-desc',
            template: opts.htmlTpl.replace('{{desc}}', opts.tpl),
            controller: ['$scope', '$element', '$timeout', '$http', '$rootScope', function ($innerScope, $element, $timeout, $http, $rootScope) {
                addWaterMark($rootScope)
                $innerScope.dialogClose = function ($event) {
                    $event.stopImmediatePropagation();
                    dialog.close();
                };
                datetimepicderInit($innerScope)
                angular.extend($innerScope, opts.data)
                $innerScope.confirmText = '确认';
                $innerScope.cancelText = '取消';
                $innerScope.pageAgree = function () {
                    opts.callback(dialog, {
                        remark: $innerScope.reason
                    })
                };
                $innerScope.$on('ngDialog.opened', function (e, $dialog) {
                    typeof opts.onOpenCallback === 'function' && opts.onOpenCallback($innerScope, dialog);
                });
            }]
        });
    }
});

define('css!modules/header/css/header',[],function(){});

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

define('text!common/directive/progress/tpl.html',[],function () { return '<div class="p-progress-new">\n    <ul ng-cloak>\n        <li ng-repeat="item in processState" class="p-animated fadeIn" ng-class="{done:item.state==1,end:item.state==2}" ng-style="{\'animation-delay\':$index/4+\'s\', \'-webkit-animation-delay\':$index/4+\'s\'}">\n            <span class="in-text">{{ :: item.name}}</span>\n            <span class="circle" ng-class="{done:item.state==1,end:item.state==2}">{{ :: $index+1}}</span>\n            <span class="line" ng-class="{done:item.state==2,end:item.state==1,hide:$index===processState.length-1}"></span>\n        </li>\n    </ul>\n</div>';});

define('common/directive/progress/index',['require','exports','module','text!./tpl.html','../../../js/common/utils'],function (require, exports, module) {
    var tpl = require('text!./tpl.html');
    var utils = require('../../../js/common/utils');
    var urlData = utils.getUrlData();
    return function (app) {
        app.directive('progress', ['$timeout', '$http',
            function ($timeout, $http) {
                return {
                    restrict: 'EA',
                    replace: true,
                    transclude: true,
                    template: tpl,
                    scope: {
                        url: "@"
                    },
                    controller: ['$scope', '$http', function ($scope, $timeout) {
                        if (!$scope.url || !urlData.id) {
                            console.warn('progress url is null')
                            return;
                        }
                        $http({
                            method: 'GET',
                            url: $scope.url,
                            params: {
                                id: urlData.id
                            }
                        }).success(function (res) {
                            if (String(res.errno) !== '0') {
                                return;
                            }
                            $scope.processState = res.data;
                        });
                    }]
                }
            }
        ]);
    }
});

define('text!common/directive/record/tpl.html',[],function () { return '<div class="info-con p-col-dis" ng-cloak ng-show="processRecord && processRecord.length">\n    <span class="info-title">审批记录</span>\n    <div class="approval-record">\n        <ul ng-cloak>\n            <li ng-repeat="item in processRecord" class="p-animated fadeIn" ng-class="{done:item.state==1,end:item.state==2}" ng-style="{\'animation-delay\':$index/4+\'s\', \'-webkit-animation-delay\':$index/4+\'s\'}">\n                <i class="circle" ng-class="{done:item.state==1,end:item.state==2}">{{ :: $index}}</i>\n                <i class="line" ng-class="{done:item.state==2,end:item.state==1}" ng-if="$index!==getProcessRecord.length-1"></i>\n                <p ng-class="{\'deep-color\':item.color!==1,\'red-color\':item.color==1}">{{ :: item.name}}</p>\n                <p class="light-color">{{ :: item.info}}</p>\n                <p class="light-color" ng-if="item.time">{{ :: item.time}}</p>\n            </li>\n        </ul>\n    </div>\n</div>';});

define('common/directive/record/index',['require','exports','module','text!./tpl.html','../../../js/common/utils'],function (require, exports, module) {
    var tpl = require('text!./tpl.html');
    var utils = require('../../../js/common/utils');
    var urlData = utils.getUrlData();
    return function (app) {
        app.directive('recordHtml', ['$timeout', '$http',
            function ($timeout, $http) {
                return {
                    restrict: 'EA',
                    replace: true,
                    transclude: true,
                    template: tpl,
                    scope: {
                        url: "@"
                    },
                    controller: ['$scope', '$http', function ($scope, $timeout) {
                        if (!$scope.url || !urlData.id) {
                            console.warn('progress url is null')
                            return;
                        }
                        $http({
                            method: 'GET',
                            url: $scope.url,
                            params: {
                                id: urlData.id
                            }
                        }).success(function (res) {
                            if (String(res.errno) !== '0') {
                                return;
                            }
                            $scope.processRecord = res.data;
                        });
                    }]
                }
            }
        ]);
    }
});
'use strict';
/**
 * author           xj
 * @date            2016-12-07 16:35:08
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/textarea-utils',['require','exports','module'],function (require, exports, module) {
    // IE Support
    var docSelection = docSelection;
    var utils;
    return utils = {
        /**
         * 选中输入框里面的一段文字
         * @param {HTML elment} inputEL
         * @param {Number} selectionStart 开始位置
         * @param {Number} selectionEnd   结束位置
         */
        setSelectionRange: function (inputEL, selectionStart, selectionEnd) {
            if (inputEL.setSelectionRange) {
                inputEL.focus();
                inputEL.setSelectionRange(selectionStart, selectionEnd);
            } else if (inputEL.createTextRange) {
                var range = inputEL.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        },
        /**
         * 获取光标所在位置
         * @param  {HTML elment} inputEL
         * @return {NUmber}        光标位置
         */
        getCaretPosition: function (inputEL) {
            // Initialize
            var iCaretPos = 0;
            // IE Support
            if (docSelection) {
                // Set focus on the element
                inputEL.focus();
                // To get cursor position, get empty selection range
                var oSel = docSelection.createRange();
                // Move selection start to 0 position
                oSel.moveStart('character', -inputEL.value.length);
                // The caret position is selection length
                iCaretPos = oSel.text.length;
            }
            // Firefox support
            else if ('selectionStart' in inputEL) {
                iCaretPos = inputEL.selectionStart;
            }
            // Return results
            return iCaretPos;
        },
        /**
         * 在光标出，插入一段文字
         */
        insertAtCaret: function (el, myValue) {
            if (docSelection) {
                el.focus();
                sel = docSelection.createRange();
                sel.text = myValue;
                el.focus();
            } else if (el.selectionStart || String(el.selectionStart) === '0') {
                var startPos = el.selectionStart;
                var endPos = el.selectionEnd;
                var scrollTop = el.scrollTop;
                el.value = el.value.substring(0, startPos) + myValue + el.value.substring(endPos, el.value.length);
                el.focus();
                el.selectionStart = startPos + myValue.length;
                el.selectionEnd = startPos + myValue.length;
                el.scrollTop = scrollTop;
            } else {
                el.value += myValue;
                el.focus();
            }
        },
        /**
         * 在指定位置插入一段问，并把指定位置后面的一部分文字替换掉
         * @param  {HTML Element} el
         * @param  {String} text
         * @param  {Number} pos
         * @param  {Number} len
         * @return {null}
         */
        insertText: function (el, text, pos, len) {
            el.focus();
            end = end || 0;
            if (!docSelection) {
                var val = el.value,
                    //匹配的这部分将被去掉
                    start = pos - len,
                    end = start + text.length;
                el.value = val.slice(0, start) + text + val.slice(pos, val.length);
                utils.setSelectionRange(el, end, end);
            } else {
                var range = docSelection.createRange();
                range.moveStart("character", -len);
                range.text = text
            }
        }
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
define('js/common/comment/closet-class',['require','exports','module'],function (require, exports, module) {
    return function (el, className) {
        var parent = el.parentElement;
        while (parent) {
            if (~parent.className.indexOf(className)) {
                return parent;
            }
            parent = parent.parentElement
        }
    }
});
define('js/common/comment/close-popover',['require','exports','module','./closet-class'],function (require, exports, module) {
    var closetClass = require('./closet-class');
    return function (el, isRemove) {
        if (isRemove === true) {
            //confirm
            var $context = angular.element(el).parent().parent().parent().parent(); //$element.closest('.' + attrs.dismiss);
            var $contextScope = $context.scope();
            var phase = $contextScope.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                $contextScope.isOpen = false;
            } else {
                $contextScope.$apply(function () {
                    $contextScope.isOpen = false;
                });
            }
        } else {
            //cancel
            var el = closetClass(el[0], 'comments-op').querySelector('[data-type="0"]');
            angular.element(el).triggerHandler('click');
        }
    }
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
/**
 * author xj
 * @date    2015-04-30 17:26:23
 *
 */
define('js/common/validate-length',['require','exports','module','./throttle'],function (require, exports, module) {
    var throttle = require('./throttle');
    var app = function (opts) {
            if (!(this instanceof app)) {
                return new app(opts);
            }
            this.init(opts);
        },
        options = {
            showText: "还能输入<b>{num}</b>字",
            exceedText: '已超出<b class="i-error">{num}</b>字',
            selector: '[data-input-length]'
        },
        reg = /[\u4e00-\u9fa5]/;
    app.prototype = {
        constructor: app,
        init: function (opts) {
            var that = this;
            this.opts = opts || {};

            Object.keys(options).forEach(function (item) {
                that.opts[item] = that.opts[item] || options[item];
            });
            return that.initView();
        },
        initView: function () {
            this.el = document.querySelector(this.opts.selector);
            if (!this.el) {
                return;
            }
            this.bindEvent();
            return this;
        },
        bindEvent: function () {
            var that = this;
            var len = this.el.getAttribute('inputlength') | 0;
            var ignore = !!this.el.getAttribute('ignore');
            var showEl = document.querySelector(this.el.getAttribute('show-text'));
            var checkLength = throttle(function () {
                var $this = that.el,
                    val, valLen;
                if (!$this) {
                    return;
                }
                try {
                    val = ($this.value || "").trim();
                } catch (error) {
                    console.log(error)
                }
                valLen = ignore ? val.length : val.replace(/[\u4e00-\u9fa5]/g, '**').length;
                that.strLength = valLen;
                if (isNaN(len) || !showEl) {
                    return;
                }
                if (valLen > len) {
                    showEl.innerHTML = that.opts.exceedText.replace('{num}', (valLen - len));
                    return;
                }
                //alLen <= len
                showEl.innerHTML = that.opts.showText.replace('{num}', (len - valLen));
            }, 200);

            'blur paste  input'.split(/\s+/).forEach(function (name) {
                that.el.addEventListener(name, checkLength);
            });
            checkLength();
            that.el.__checklen = checkLength;
        }
    }
    return app;
});
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
 * @date            2016-12-07 16:35:08
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/textarea-height-auto',['require','exports','module','./throttle','./observer'],function (require, exports, module) {
    var throttle = require('./throttle');
    var observer = require('./observer');
    var addEvent;

    if (window.attachEvent) {
        addEvent = function (element, event, handler) {
            element.attachEvent('on' + event, handler);
        };
    } else {
        addEvent = function (element, event, handler) {
            element.addEventListener(event, handler, false);
        };
    }

    return function (el, opts) {
        opts = opts || {};
        var maxHeight = opts.maxHeight || 200;
        var delayedResize = throttle(resize, 50);
        var sHeight, elStyle = el.style,
            data;

        function resize() {
            sHeight = el.scrollHeight;
            if (sHeight > maxHeight) {
                elStyle.overflowY = 'scroll';
                elStyle.height = maxHeight + 'px';
                data = {
                    height: maxHeight + 'px',
                    overflowY: 'scroll'
                };
            } else {
                elStyle.overflowY = 'hidden';
                elStyle.height = 'auto';
                elStyle.height = el.scrollHeight + 'px';
                data = {
                    height: el.scrollHeight + 'px',
                    overflowY: 'hidden'
                };
            }
            observer.fire('text-resize-height', data);
        }

        addEvent(el, 'change', resize);

        ['cut', 'paste', 'drop', 'keyup'].forEach(function (name) {
            addEvent(el, name, delayedResize)
        });
        resize();
    }
});

define('js/common/comment/textareaInit',['require','exports','module','../validate-length','../textarea-height-auto'],function (require, exports, module) {
    var validateLength = require('../validate-length');
    var textareaHeightAuto = require('../textarea-height-auto');
    return function (textareaEl) {
       
        validateLength();
        //自动高度操作
        textareaHeightAuto(textareaEl);

        //样式交互
        textareaEl.addEventListener('focus', function () {
            textareaEl.parentElement.classList.add('focus');
        });

        textareaEl.addEventListener('blur', function () {
            textareaEl.parentElement.classList.remove('focus');
        });
    }
});
define('js/common/comment/closet',['require','exports','module'],function (require, exports, module) {
    return function ($el, tagName) {
        tagName = tagName.toUpperCase()
        var parent = $el.parentElement;
        while (parent) {
            if (parent.tagName === tagName) {
                return parent;
            }
            parent = parent.parentElement
        }
    }
});

define('text!js/common/comment/tpl.html',[],function () { return '<div class="info-con p-col-dis p-comment" ng-cloak>\n    <span class="info-title">评论</span>\n    <div class="wrap-textarea">\n        <textarea name="" class="p-comment-input" ng-model="commentText" id="js-comment-el" ng-keyup="textareaKeyup($event)" data-input-length ignore="true" placeholder="请输入评论" show-text="#show-comment-text" inputlength="200"></textarea>\n    </div>\n    <div class="operate">\n        <div class="l">\n            <span id="show-comment-text" class="show-text"></span>\n        </div>\n        <div class="r">\n            <button class="p-btn p-btn-sm" ng-click="addComment($event)" ng-class="{\n                disabled:!commentText || commentText.trim().length>200\n            }">发布<dot ng-show="isCommentSubmiting" ng-cloak></dot></button>\n        </div>\n    </div>\n    <div class="comments-list" ng-cloak ng-show="commentList && commentList.length">\n        <ul>\n            <li class="comments-item" ng-repeat="com in commentList" ng-class="{op0:currentCommentId==com.parent.commentId}" data-qid="{{com.parent.commentId}}">\n                <div class="wrap-avatar">\n                    <a href="http://home.didichuxing.com/person.html#/{{com.parent.user}}/1" target="_blank">\n                        <img err-src="http://static.galileo.xiaojukeji.com/static/tms/api/public/other/8355c3caf02679026151c10588307c5a.png"\n                        ng-src="http://home.didichuxing.com/DidiFile/Avatar/{{com.parent.user}}.jpg">\n                    </a>\n                </div>\n                <div class="comment-item-sub">\n                    <div class="comment-content pl0">\n                        <a href="http://home.didichuxing.com/person.html#/{{com.parent.user}}/1" target="_blank" class="username">{{com.parent.userName}}</a>\n                        : <span>{{com.parent.content}}</span>\n                        <div class="comments-op">\n                            <span class="comment-time">{{com.parent.time}}</span>\n                            <a href="javascript:" data-type="1" ng-click="replyComment(com.parent , com.parent.commentId)">回复</a>\n                            <a href="javascript:"\n                            data-type="0"\n                            ng-if="user.name===com.parent.user"\n                            ng-click="setcacheDeleteCommentData(com.parent)"\n                            uib-popover-template="commentPopoverTmplUrl">删除</a>\n                        </div>\n                        <ol>\n                            <li class="comments-item" ng-repeat="comItem in com.child" data-qid="{{comItem.commentId}}" ng-class="{op0:currentCommentId==comItem.commentId}">\n                                <div class="wrap-avatar">\n                                    <a href="http://home.didichuxing.com/person.html#/{{comItem.user}}/1" target="_blank">\n                                        <img err-src="http://static.galileo.xiaojukeji.com/static/tms/api/public/other/8355c3caf02679026151c10588307c5a.png"\n                                        ng-src="http://home.didichuxing.com/DidiFile/Avatar/{{comItem.user}}.jpg">\n                                    </a>\n                                </div>\n                                <div class="comment-content">\n                                    <a href="http://home.didichuxing.com/person.html#/{{comItem.user}}/1" target="_blank" class="username">{{comItem.userName}}</a>\n                                    <span>回复    <a href="http://home.didichuxing.com/person.html#/{{comItem.reply}}/1" target="_blank" class="username">{{comItem.replyName}}</a></span>\n                                    : <span>{{comItem.content}}</span>\n                                    <div class="comments-op">\n                                        <span class="comment-time">{{comItem.time}}</span>\n                                        <a href="javascript:" data-type="1" ng-click="replyComment(comItem,com.parent.commentId)">回复</a>\n                                        <a href="javascript:"\n                                        data-type="0"\n                                        ng-if="user.name === comItem.user"\n                                        popover-trigger="\'outsideClick\'"\n                                        ng-click="setcacheDeleteCommentData(comItem,com.parent.commentId)"\n                                        uib-popover-template="commentPopoverTmplUrl" >删除</a>\n                                    </div>\n                                </div>\n                            </li>\n                        </ol>\n                    </div>\n                </div>\n            </li>\n        </ul>\n    </div>\n</div>';});

define('js/common/comment/directive-dismiss',['require','exports','module','./close-popover'],function (require, exports, module) {
    var closePopover = require('./close-popover');
    // var closePopover = require('./close-popover');
    return function (app) {
        app.directive('dismiss', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function (scope, $element, attrs) {
                    $element.on('click', function () {
                        $timeout(function () {
                            closePopover($element);
                        });
                    });
                }
            };
        }]);
    }
});

define('css!common/angular-bootstrap-popover/ui-bootstrap-custom-2.5.0-csp',[],function(){});
define('common/angular-bootstrap-popover/ui-bootstrap-custom-tpls-2.5.0',['require','exports','module','css!./ui-bootstrap-custom-2.5.0-csp.css'],function (require, exports, module) {
    require('css!./ui-bootstrap-custom-2.5.0-csp.css');
    /*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 2.5.0 - 2017-01-28
 * License: MIT
 */
    angular.module("ui.bootstrap-popover", [
        "ui.bootstrap.tpls",
        "ui.bootstrap.popover",
        "ui.bootstrap.tooltip",
        "ui.bootstrap.position",
        "ui.bootstrap.stackedMap"
    ]);

    angular.module("ui.bootstrap.tpls", ["uib/template/popover/popover-html.html",
        "uib/template/popover/popover-template.html",
        "uib/template/popover/popover.html",
        "uib/template/tooltip/tooltip-html-popup.html",
        "uib/template/tooltip/tooltip-popup.html",
        "uib/template/tooltip/tooltip-template-popup.html"
    ]);
    /**
     * The following features are still outstanding: popup delay, animation as a
     * function, placement as a function, inside, support for more triggers than
     * just mouse enter/leave, and selector delegatation.
     */
    angular.module('ui.bootstrap.popover', ['ui.bootstrap.tooltip'])

        .directive('uibPopoverTemplatePopup', function () {
            return {
                restrict: 'A',
                scope: {
                    uibTitle: '@',
                    contentExp: '&',
                    originScope: '&'
                },
                templateUrl: 'uib/template/popover/popover-template.html'
            };
        })

        .directive('uibPopoverTemplate', ['$uibTooltip', function ($uibTooltip) {
            return $uibTooltip('uibPopoverTemplate', 'popover', 'click', {
                useContentExp: true
            });
        }])

        .directive('uibPopoverHtmlPopup', function () {
            return {
                restrict: 'A',
                scope: {
                    contentExp: '&',
                    uibTitle: '@'
                },
                templateUrl: 'uib/template/popover/popover-html.html'
            };
        })

        .directive('uibPopoverHtml', ['$uibTooltip', function ($uibTooltip) {
            return $uibTooltip('uibPopoverHtml', 'popover', 'click', {
                useContentExp: true
            });
        }])

        .directive('uibPopoverPopup', function () {
            return {
                restrict: 'A',
                scope: {
                    uibTitle: '@',
                    content: '@'
                },
                templateUrl: 'uib/template/popover/popover.html'
            };
        })

        .directive('uibPopover', ['$uibTooltip', function ($uibTooltip) {
            return $uibTooltip('uibPopover', 'popover', 'click');
        }]);

    /**
     * The following features are still outstanding: animation as a
     * function, placement as a function, inside, support for more triggers than
     * just mouse enter/leave, html tooltips, and selector delegation.
     */
    angular.module('ui.bootstrap.tooltip', ['ui.bootstrap.position', 'ui.bootstrap.stackedMap'])

        /**
         * The $tooltip service creates tooltip- and popover-like directives as well as
         * houses global options for them.
         */
        .provider('$uibTooltip', function () {
            // The default options tooltip and popover.
            var defaultOptions = {
                placement: 'top',
                placementClassPrefix: '',
                animation: true,
                popupDelay: 0,
                popupCloseDelay: 0,
                useContentExp: false
            };

            // Default hide triggers for each show trigger
            var triggerMap = {
                'mouseenter': 'mouseleave',
                'click': 'click',
                'outsideClick': 'outsideClick',
                'focus': 'blur',
                'none': ''
            };

            // The options specified to the provider globally.
            var globalOptions = {};

            /**
             * `options({})` allows global configuration of all tooltips in the
             * application.
             *
             *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
             *     // place tooltips left instead of top by default
             *     $tooltipProvider.options( { placement: 'left' } );
             *   });
             */
            this.options = function (value) {
                angular.extend(globalOptions, value);
            };

            /**
             * This allows you to extend the set of trigger mappings available. E.g.:
             *
             *   $tooltipProvider.setTriggers( { 'openTrigger': 'closeTrigger' } );
             */
            this.setTriggers = function setTriggers(triggers) {
                angular.extend(triggerMap, triggers);
            };

            /**
             * This is a helper function for translating camel-case to snake_case.
             */
            function snake_case(name) {
                var regexp = /[A-Z]/g;
                var separator = '-';
                return name.replace(regexp, function (letter, pos) {
                    return (pos ? separator : '') + letter.toLowerCase();
                });
            }

            /**
             * Returns the actual instance of the $tooltip service.
             * TODO support multiple triggers
             */
            this.$get = ['$window', '$compile', '$timeout', '$document', '$uibPosition', '$interpolate', '$rootScope', '$parse', '$$stackedMap', function ($window, $compile, $timeout, $document, $position, $interpolate, $rootScope, $parse, $$stackedMap) {
                var openedTooltips = $$stackedMap.createNew();
                $document.on('keyup', keypressListener);

                $rootScope.$on('$destroy', function () {
                    $document.off('keyup', keypressListener);
                });

                function keypressListener(e) {
                    if (e.which === 27) {
                        var last = openedTooltips.top();
                        if (last) {
                            last.value.close();
                            last = null;
                        }
                    }
                }

                return function $tooltip(ttType, prefix, defaultTriggerShow, options) {
                    options = angular.extend({}, defaultOptions, globalOptions, options);

                    /**
                     * Returns an object of show and hide triggers.
                     *
                     * If a trigger is supplied,
                     * it is used to show the tooltip; otherwise, it will use the `trigger`
                     * option passed to the `$tooltipProvider.options` method; else it will
                     * default to the trigger supplied to this directive factory.
                     *
                     * The hide trigger is based on the show trigger. If the `trigger` option
                     * was passed to the `$tooltipProvider.options` method, it will use the
                     * mapped trigger from `triggerMap` or the passed trigger if the map is
                     * undefined; otherwise, it uses the `triggerMap` value of the show
                     * trigger; else it will just use the show trigger.
                     */
                    function getTriggers(trigger) {
                        var show = (trigger || options.trigger || defaultTriggerShow).split(' ');
                        var hide = show.map(function (trigger) {
                            return triggerMap[trigger] || trigger;
                        });
                        return {
                            show: show,
                            hide: hide
                        };
                    }

                    var directiveName = snake_case(ttType);

                    var startSym = $interpolate.startSymbol();
                    var endSym = $interpolate.endSymbol();
                    var template =
                        '<div ' + directiveName + '-popup ' +
                        'uib-title="' + startSym + 'title' + endSym + '" ' +
                        (options.useContentExp ?
                            'content-exp="contentExp()" ' :
                            'content="' + startSym + 'content' + endSym + '" ') +
                        'origin-scope="origScope" ' +
                        'class="uib-position-measure ' + prefix + '" ' +
                        'tooltip-animation-class="fade"' +
                        'uib-tooltip-classes ' +
                        'ng-class="{ in: isOpen }" ' +
                        '>' +
                        '</div>';

                    return {
                        compile: function (tElem, tAttrs) {
                            var tooltipLinker = $compile(template);

                            return function link(scope, element, attrs, tooltipCtrl) {
                                var tooltip;
                                var tooltipLinkedScope;
                                var transitionTimeout;
                                var showTimeout;
                                var hideTimeout;
                                var positionTimeout;
                                var adjustmentTimeout;
                                var appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false;
                                var triggers = getTriggers(undefined);
                                var hasEnableExp = angular.isDefined(attrs[prefix + 'Enable']);
                                var ttScope = scope.$new(true);
                                var repositionScheduled = false;
                                var isOpenParse = angular.isDefined(attrs[prefix + 'IsOpen']) ? $parse(attrs[prefix + 'IsOpen']) : false;
                                var contentParse = options.useContentExp ? $parse(attrs[ttType]) : false;
                                var observers = [];
                                var lastPlacement;

                                var positionTooltip = function () {
                                    // check if tooltip exists and is not empty
                                    if (!tooltip || !tooltip.html()) {
                                        return;
                                    }

                                    if (!positionTimeout) {
                                        positionTimeout = $timeout(function () {
                                            var ttPosition = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);
                                            var initialHeight = angular.isDefined(tooltip.offsetHeight) ? tooltip.offsetHeight : tooltip.prop('offsetHeight');
                                            var elementPos = appendToBody ? $position.offset(element) : $position.position(element);
                                            tooltip.css({
                                                top: ttPosition.top + 'px',
                                                left: ttPosition.left + 'px'
                                            });
                                            var placementClasses = ttPosition.placement.split('-');

                                            if (!tooltip.hasClass(placementClasses[0])) {
                                                tooltip.removeClass(lastPlacement.split('-')[0]);
                                                tooltip.addClass(placementClasses[0]);
                                            }

                                            if (!tooltip.hasClass(options.placementClassPrefix + ttPosition.placement)) {
                                                tooltip.removeClass(options.placementClassPrefix + lastPlacement);
                                                tooltip.addClass(options.placementClassPrefix + ttPosition.placement);
                                            }

                                            adjustmentTimeout = $timeout(function () {
                                                var currentHeight = angular.isDefined(tooltip.offsetHeight) ? tooltip.offsetHeight : tooltip.prop('offsetHeight');
                                                var adjustment = $position.adjustTop(placementClasses, elementPos, initialHeight, currentHeight);
                                                if (adjustment) {
                                                    tooltip.css(adjustment);
                                                }
                                                adjustmentTimeout = null;
                                            }, 0, false);

                                            // first time through tt element will have the
                                            // uib-position-measure class or if the placement
                                            // has changed we need to position the arrow.
                                            if (tooltip.hasClass('uib-position-measure')) {
                                                $position.positionArrow(tooltip, ttPosition.placement);
                                                tooltip.removeClass('uib-position-measure');
                                            } else if (lastPlacement !== ttPosition.placement) {
                                                $position.positionArrow(tooltip, ttPosition.placement);
                                            }
                                            lastPlacement = ttPosition.placement;

                                            positionTimeout = null;
                                        }, 0, false);
                                    }
                                };

                                // Set up the correct scope to allow transclusion later
                                ttScope.origScope = scope;

                                // By default, the tooltip is not open.
                                // TODO add ability to start tooltip opened
                                ttScope.isOpen = false;

                                function toggleTooltipBind() {
                                    if (!ttScope.isOpen) {
                                        showTooltipBind();
                                    } else {
                                        hideTooltipBind();
                                    }
                                }

                                // Show the tooltip with delay if specified, otherwise show it immediately
                                function showTooltipBind() {
                                    if (hasEnableExp && !scope.$eval(attrs[prefix + 'Enable'])) {
                                        return;
                                    }

                                    cancelHide();
                                    prepareTooltip();

                                    if (ttScope.popupDelay) {
                                        // Do nothing if the tooltip was already scheduled to pop-up.
                                        // This happens if show is triggered multiple times before any hide is triggered.
                                        if (!showTimeout) {
                                            showTimeout = $timeout(show, ttScope.popupDelay, false);
                                        }
                                    } else {
                                        show();
                                    }
                                }

                                function hideTooltipBind() {
                                    cancelShow();

                                    if (ttScope.popupCloseDelay) {
                                        if (!hideTimeout) {
                                            hideTimeout = $timeout(hide, ttScope.popupCloseDelay, false);
                                        }
                                    } else {
                                        hide();
                                    }
                                }

                                // Show the tooltip popup element.
                                function show() {
                                    cancelShow();
                                    cancelHide();

                                    // Don't show empty tooltips.
                                    if (!ttScope.content) {
                                        return angular.noop;
                                    }

                                    createTooltip();

                                    // And show the tooltip.
                                    ttScope.$evalAsync(function () {
                                        ttScope.isOpen = true;
                                        assignIsOpen(true);
                                        positionTooltip();
                                    });
                                }

                                function cancelShow() {
                                    if (showTimeout) {
                                        $timeout.cancel(showTimeout);
                                        showTimeout = null;
                                    }

                                    if (positionTimeout) {
                                        $timeout.cancel(positionTimeout);
                                        positionTimeout = null;
                                    }
                                }

                                // Hide the tooltip popup element.
                                function hide() {
                                    if (!ttScope) {
                                        return;
                                    }

                                    // First things first: we don't show it anymore.
                                    ttScope.$evalAsync(function () {
                                        if (ttScope) {
                                            ttScope.isOpen = false;
                                            assignIsOpen(false);
                                            // And now we remove it from the DOM. However, if we have animation, we
                                            // need to wait for it to expire beforehand.
                                            // FIXME: this is a placeholder for a port of the transitions library.
                                            // The fade transition in TWBS is 150ms.
                                            if (ttScope.animation) {
                                                if (!transitionTimeout) {
                                                    transitionTimeout = $timeout(removeTooltip, 150, false);
                                                }
                                            } else {
                                                removeTooltip();
                                            }
                                        }
                                    });
                                }

                                function cancelHide() {
                                    if (hideTimeout) {
                                        $timeout.cancel(hideTimeout);
                                        hideTimeout = null;
                                    }

                                    if (transitionTimeout) {
                                        $timeout.cancel(transitionTimeout);
                                        transitionTimeout = null;
                                    }
                                }

                                function createTooltip() {
                                    // There can only be one tooltip element per directive shown at once.
                                    if (tooltip) {
                                        return;
                                    }

                                    tooltipLinkedScope = ttScope.$new();
                                    tooltip = tooltipLinker(tooltipLinkedScope, function (tooltip) {
                                        if (appendToBody) {
                                            $document.find('body').append(tooltip);
                                        } else {
                                            element.after(tooltip);
                                        }
                                    });

                                    openedTooltips.add(ttScope, {
                                        close: hide
                                    });

                                    prepObservers();
                                }

                                function removeTooltip() {
                                    cancelShow();
                                    cancelHide();
                                    unregisterObservers();

                                    if (tooltip) {
                                        tooltip.remove();

                                        tooltip = null;
                                        if (adjustmentTimeout) {
                                            $timeout.cancel(adjustmentTimeout);
                                        }
                                    }

                                    openedTooltips.remove(ttScope);

                                    if (tooltipLinkedScope) {
                                        tooltipLinkedScope.$destroy();
                                        tooltipLinkedScope = null;
                                    }
                                }

                                /**
                                 * Set the initial scope values. Once
                                 * the tooltip is created, the observers
                                 * will be added to keep things in sync.
                                 */
                                function prepareTooltip() {
                                    ttScope.title = attrs[prefix + 'Title'];
                                    if (contentParse) {
                                        ttScope.content = contentParse(scope);
                                    } else {
                                        ttScope.content = attrs[ttType];
                                    }

                                    ttScope.popupClass = attrs[prefix + 'Class'];
                                    ttScope.placement = angular.isDefined(attrs[prefix + 'Placement']) ? attrs[prefix + 'Placement'] : options.placement;
                                    var placement = $position.parsePlacement(ttScope.placement);
                                    lastPlacement = placement[1] ? placement[0] + '-' + placement[1] : placement[0];

                                    var delay = parseInt(attrs[prefix + 'PopupDelay'], 10);
                                    var closeDelay = parseInt(attrs[prefix + 'PopupCloseDelay'], 10);
                                    ttScope.popupDelay = !isNaN(delay) ? delay : options.popupDelay;
                                    ttScope.popupCloseDelay = !isNaN(closeDelay) ? closeDelay : options.popupCloseDelay;
                                }

                                function assignIsOpen(isOpen) {
                                    if (isOpenParse && angular.isFunction(isOpenParse.assign)) {
                                        isOpenParse.assign(scope, isOpen);
                                    }
                                }

                                ttScope.contentExp = function () {
                                    return ttScope.content;
                                };

                                /**
                                 * Observe the relevant attributes.
                                 */
                                attrs.$observe('disabled', function (val) {
                                    if (val) {
                                        cancelShow();
                                    }

                                    if (val && ttScope.isOpen) {
                                        hide();
                                    }
                                });

                                if (isOpenParse) {
                                    scope.$watch(isOpenParse, function (val) {
                                        if (ttScope && !val === ttScope.isOpen) {
                                            toggleTooltipBind();
                                        }
                                    });
                                }

                                function prepObservers() {
                                    observers.length = 0;

                                    if (contentParse) {
                                        observers.push(
                                            scope.$watch(contentParse, function (val) {
                                                ttScope.content = val;
                                                if (!val && ttScope.isOpen) {
                                                    hide();
                                                }
                                            })
                                        );

                                        observers.push(
                                            tooltipLinkedScope.$watch(function () {
                                                if (!repositionScheduled) {
                                                    repositionScheduled = true;
                                                    tooltipLinkedScope.$$postDigest(function () {
                                                        repositionScheduled = false;
                                                        if (ttScope && ttScope.isOpen) {
                                                            positionTooltip();
                                                        }
                                                    });
                                                }
                                            })
                                        );
                                    } else {
                                        observers.push(
                                            attrs.$observe(ttType, function (val) {
                                                ttScope.content = val;
                                                if (!val && ttScope.isOpen) {
                                                    hide();
                                                } else {
                                                    positionTooltip();
                                                }
                                            })
                                        );
                                    }

                                    observers.push(
                                        attrs.$observe(prefix + 'Title', function (val) {
                                            ttScope.title = val;
                                            if (ttScope.isOpen) {
                                                positionTooltip();
                                            }
                                        })
                                    );

                                    observers.push(
                                        attrs.$observe(prefix + 'Placement', function (val) {
                                            ttScope.placement = val ? val : options.placement;
                                            if (ttScope.isOpen) {
                                                positionTooltip();
                                            }
                                        })
                                    );
                                }

                                function unregisterObservers() {
                                    if (observers.length) {
                                        angular.forEach(observers, function (observer) {
                                            observer();
                                        });
                                        observers.length = 0;
                                    }
                                }

                                // hide tooltips/popovers for outsideClick trigger
                                function bodyHideTooltipBind(e) {
                                    if (!ttScope || !ttScope.isOpen || !tooltip) {
                                        return;
                                    }
                                    // make sure the tooltip/popover link or tool tooltip/popover itself were not clicked
                                    if (!element[0].contains(e.target) && !tooltip[0].contains(e.target)) {
                                        hideTooltipBind();
                                    }
                                }

                                // KeyboardEvent handler to hide the tooltip on Escape key press
                                function hideOnEscapeKey(e) {
                                    if (e.which === 27) {
                                        hideTooltipBind();
                                    }
                                }

                                var unregisterTriggers = function () {
                                    triggers.show.forEach(function (trigger) {
                                        if (trigger === 'outsideClick') {
                                            element.off('click', toggleTooltipBind);
                                        } else {
                                            element.off(trigger, showTooltipBind);
                                            element.off(trigger, toggleTooltipBind);
                                        }
                                        element.off('keypress', hideOnEscapeKey);
                                    });
                                    triggers.hide.forEach(function (trigger) {
                                        if (trigger === 'outsideClick') {
                                            $document.off('click', bodyHideTooltipBind);
                                        } else {
                                            element.off(trigger, hideTooltipBind);
                                        }
                                    });
                                };

                                function prepTriggers() {
                                    var showTriggers = [],
                                        hideTriggers = [];
                                    var val = scope.$eval(attrs[prefix + 'Trigger']);
                                    unregisterTriggers();

                                    if (angular.isObject(val)) {
                                        Object.keys(val).forEach(function (key) {
                                            showTriggers.push(key);
                                            hideTriggers.push(val[key]);
                                        });
                                        triggers = {
                                            show: showTriggers,
                                            hide: hideTriggers
                                        };
                                    } else {
                                        triggers = getTriggers(val);
                                    }

                                    if (triggers.show !== 'none') {
                                        triggers.show.forEach(function (trigger, idx) {
                                            if (trigger === 'outsideClick') {
                                                element.on('click', toggleTooltipBind);
                                                $document.on('click', bodyHideTooltipBind);
                                            } else if (trigger === triggers.hide[idx]) {
                                                element.on(trigger, toggleTooltipBind);
                                            } else if (trigger) {
                                                element.on(trigger, showTooltipBind);
                                                element.on(triggers.hide[idx], hideTooltipBind);
                                            }
                                            element.on('keypress', hideOnEscapeKey);
                                        });
                                    }
                                }

                                prepTriggers();

                                var animation = scope.$eval(attrs[prefix + 'Animation']);
                                ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation;

                                var appendToBodyVal;
                                var appendKey = prefix + 'AppendToBody';
                                if (appendKey in attrs && attrs[appendKey] === undefined) {
                                    appendToBodyVal = true;
                                } else {
                                    appendToBodyVal = scope.$eval(attrs[appendKey]);
                                }

                                appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody;

                                // Make sure tooltip is destroyed and removed.
                                scope.$on('$destroy', function onDestroyTooltip() {
                                    unregisterTriggers();
                                    removeTooltip();
                                    ttScope = null;
                                });
                            };
                        }
                    };
                };
            }];
        })

        // This is mostly ngInclude code but with a custom scope
        .directive('uibTooltipTemplateTransclude', [
            '$animate', '$sce', '$compile', '$templateRequest',
            function ($animate, $sce, $compile, $templateRequest) {
                return {
                    link: function (scope, elem, attrs) {
                        var origScope = scope.$eval(attrs.tooltipTemplateTranscludeScope);

                        var changeCounter = 0,
                            currentScope,
                            previousElement,
                            currentElement;

                        var cleanupLastIncludeContent = function () {
                            if (previousElement) {
                                previousElement.remove();
                                previousElement = null;
                            }

                            if (currentScope) {
                                currentScope.$destroy();
                                currentScope = null;
                            }

                            if (currentElement) {
                                $animate.leave(currentElement).then(function () {
                                    previousElement = null;
                                });
                                previousElement = currentElement;
                                currentElement = null;
                            }
                        };

                        scope.$watch($sce.parseAsResourceUrl(attrs.uibTooltipTemplateTransclude), function (src) {
                            var thisChangeId = ++changeCounter;

                            if (src) {
                                //set the 2nd param to true to ignore the template request error so that the inner
                                //contents and scope can be cleaned up.
                                $templateRequest(src, true).then(function (response) {
                                    if (thisChangeId !== changeCounter) {
                                        return;
                                    }
                                    var newScope = origScope.$new();
                                    var template = response;

                                    var clone = $compile(template)(newScope, function (clone) {
                                        cleanupLastIncludeContent();
                                        $animate.enter(clone, elem);
                                    });

                                    currentScope = newScope;
                                    currentElement = clone;

                                    currentScope.$emit('$includeContentLoaded', src);
                                }, function () {
                                    if (thisChangeId === changeCounter) {
                                        cleanupLastIncludeContent();
                                        scope.$emit('$includeContentError', src);
                                    }
                                });
                                scope.$emit('$includeContentRequested', src);
                            } else {
                                cleanupLastIncludeContent();
                            }
                        });

                        scope.$on('$destroy', cleanupLastIncludeContent);
                    }
                };
            }
        ])

        /**
         * Note that it's intentional that these classes are *not* applied through $animate.
         * They must not be animated as they're expected to be present on the tooltip on
         * initialization.
         */
        .directive('uibTooltipClasses', ['$uibPosition', function ($uibPosition) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    // need to set the primary position so the
                    // arrow has space during position measure.
                    // tooltip.positionTooltip()
                    if (scope.placement) {
                        // // There are no top-left etc... classes
                        // // in TWBS, so we need the primary position.
                        var position = $uibPosition.parsePlacement(scope.placement);
                        element.addClass(position[0]);
                    }

                    if (scope.popupClass) {
                        element.addClass(scope.popupClass);
                    }

                    if (scope.animation) {
                        element.addClass(attrs.tooltipAnimationClass);
                    }
                }
            };
        }])

        .directive('uibTooltipPopup', function () {
            return {
                restrict: 'A',
                scope: {
                    content: '@'
                },
                templateUrl: 'uib/template/tooltip/tooltip-popup.html'
            };
        })

        .directive('uibTooltip', ['$uibTooltip', function ($uibTooltip) {
            return $uibTooltip('uibTooltip', 'tooltip', 'mouseenter');
        }])

        .directive('uibTooltipTemplatePopup', function () {
            return {
                restrict: 'A',
                scope: {
                    contentExp: '&',
                    originScope: '&'
                },
                templateUrl: 'uib/template/tooltip/tooltip-template-popup.html'
            };
        })

        .directive('uibTooltipTemplate', ['$uibTooltip', function ($uibTooltip) {
            return $uibTooltip('uibTooltipTemplate', 'tooltip', 'mouseenter', {
                useContentExp: true
            });
        }])

        .directive('uibTooltipHtmlPopup', function () {
            return {
                restrict: 'A',
                scope: {
                    contentExp: '&'
                },
                templateUrl: 'uib/template/tooltip/tooltip-html-popup.html'
            };
        })

        .directive('uibTooltipHtml', ['$uibTooltip', function ($uibTooltip) {
            return $uibTooltip('uibTooltipHtml', 'tooltip', 'mouseenter', {
                useContentExp: true
            });
        }]);

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
                    var scrollbarWidth = this.scrollbarWidth(BODY_REGEX.test(scrollParent.tagName));

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

    angular.module('ui.bootstrap.stackedMap', [])
        /**
         * A helper, internal data structure that acts as a map but also allows getting / removing
         * elements in the LIFO order
         */
        .factory('$$stackedMap', function () {
            return {
                createNew: function () {
                    var stack = [];

                    return {
                        add: function (key, value) {
                            stack.push({
                                key: key,
                                value: value
                            });
                        },
                        get: function (key) {
                            for (var i = 0; i < stack.length; i++) {
                                if (key === stack[i].key) {
                                    return stack[i];
                                }
                            }
                        },
                        keys: function () {
                            var keys = [];
                            for (var i = 0; i < stack.length; i++) {
                                keys.push(stack[i].key);
                            }
                            return keys;
                        },
                        top: function () {
                            return stack[stack.length - 1];
                        },
                        remove: function (key) {
                            var idx = -1;
                            for (var i = 0; i < stack.length; i++) {
                                if (key === stack[i].key) {
                                    idx = i;
                                    break;
                                }
                            }
                            return stack.splice(idx, 1)[0];
                        },
                        removeTop: function () {
                            return stack.pop();
                        },
                        length: function () {
                            return stack.length;
                        }
                    };
                }
            };
        });
    angular.module("uib/template/popover/popover-html.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("uib/template/popover/popover-html.html",
            "<div class=\"arrow\"></div>\n" +
            "\n" +
            "<div class=\"popover-inner\">\n" +
            "    <h3 class=\"popover-title\" ng-bind=\"uibTitle\" ng-if=\"uibTitle\"></h3>\n" +
            "    <div class=\"popover-content\" ng-bind-html=\"contentExp()\"></div>\n" +
            "</div>\n" +
            "");
    }]);

    angular.module("uib/template/popover/popover-template.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("uib/template/popover/popover-template.html",
            "<div class=\"arrow\"></div>\n" +
            "\n" +
            "<div class=\"popover-inner\">\n" +
            "    <h3 class=\"popover-title\" ng-bind=\"uibTitle\" ng-if=\"uibTitle\"></h3>\n" +
            "    <div class=\"popover-content\"\n" +
            "      uib-tooltip-template-transclude=\"contentExp()\"\n" +
            "      tooltip-template-transclude-scope=\"originScope()\"></div>\n" +
            "</div>\n" +
            "");
    }]);

    angular.module("uib/template/popover/popover.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("uib/template/popover/popover.html",
            "<div class=\"arrow\"></div>\n" +
            "\n" +
            "<div class=\"popover-inner\">\n" +
            "    <h3 class=\"popover-title\" ng-bind=\"uibTitle\" ng-if=\"uibTitle\"></h3>\n" +
            "    <div class=\"popover-content\" ng-bind=\"content\"></div>\n" +
            "</div>\n" +
            "");
    }]);

    angular.module("uib/template/tooltip/tooltip-html-popup.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("uib/template/tooltip/tooltip-html-popup.html",
            "<div class=\"tooltip-arrow\"></div>\n" +
            "<div class=\"tooltip-inner\" ng-bind-html=\"contentExp()\"></div>\n" +
            "");
    }]);

    angular.module("uib/template/tooltip/tooltip-popup.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("uib/template/tooltip/tooltip-popup.html",
            "<div class=\"tooltip-arrow\"></div>\n" +
            "<div class=\"tooltip-inner\" ng-bind=\"content\"></div>\n" +
            "");
    }]);

    angular.module("uib/template/tooltip/tooltip-template-popup.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("uib/template/tooltip/tooltip-template-popup.html",
            "<div class=\"tooltip-arrow\"></div>\n" +
            "<div class=\"tooltip-inner\"\n" +
            "  uib-tooltip-template-transclude=\"contentExp()\"\n" +
            "  tooltip-template-transclude-scope=\"originScope()\"></div>\n" +
            "");
    }]);
    angular.module('ui.bootstrap.tooltip').run(function () {
        !angular.$$csp().noInlineStyle && !angular.$$uibTooltipCss && angular.element(document).find('head').prepend('<style type="text/css">[uib-tooltip-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-bottom > .tooltip-arrow,[uib-popover-popup].popover.top-left > .arrow,[uib-popover-popup].popover.top-right > .arrow,[uib-popover-popup].popover.bottom-left > .arrow,[uib-popover-popup].popover.bottom-right > .arrow,[uib-popover-popup].popover.left-top > .arrow,[uib-popover-popup].popover.left-bottom > .arrow,[uib-popover-popup].popover.right-top > .arrow,[uib-popover-popup].popover.right-bottom > .arrow,[uib-popover-html-popup].popover.top-left > .arrow,[uib-popover-html-popup].popover.top-right > .arrow,[uib-popover-html-popup].popover.bottom-left > .arrow,[uib-popover-html-popup].popover.bottom-right > .arrow,[uib-popover-html-popup].popover.left-top > .arrow,[uib-popover-html-popup].popover.left-bottom > .arrow,[uib-popover-html-popup].popover.right-top > .arrow,[uib-popover-html-popup].popover.right-bottom > .arrow,[uib-popover-template-popup].popover.top-left > .arrow,[uib-popover-template-popup].popover.top-right > .arrow,[uib-popover-template-popup].popover.bottom-left > .arrow,[uib-popover-template-popup].popover.bottom-right > .arrow,[uib-popover-template-popup].popover.left-top > .arrow,[uib-popover-template-popup].popover.left-bottom > .arrow,[uib-popover-template-popup].popover.right-top > .arrow,[uib-popover-template-popup].popover.right-bottom > .arrow{top:auto;bottom:auto;left:auto;right:auto;margin:0;}[uib-popover-popup].popover,[uib-popover-html-popup].popover,[uib-popover-template-popup].popover{display:block !important;}</style>');
        angular.$$uibTooltipCss = true;
    });
    angular.module('ui.bootstrap.position').run(function () {
        !angular.$$csp().noInlineStyle && !angular.$$uibPositionCss && angular.element(document).find('head').prepend('<style type="text/css">.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}</style>');
        angular.$$uibPositionCss = true;
    });
});
define('js/common/comment/index',['require','exports','module','../textarea-utils','../slideUpDown','../scroll-animation','../utils','./close-popover','./textareaInit','./closet','text!./tpl.html','./directive-dismiss','../../../common/angular-bootstrap-popover/ui-bootstrap-custom-tpls-2.5.0'],function (require, exports, module) {
    var textareaUtils = require('../textarea-utils');
    var slideUpDown = require('../slideUpDown');
    var scrollAnimation = require('../scroll-animation');
    var utils = require('../utils');
    var closerPopover = require('./close-popover');
    var textareaInit = require('./textareaInit');
    var closet = require('./closet');
    var tpl = require('text!./tpl.html');
    var urlData = utils.getUrlData();
    var directiveDismiss = require('./directive-dismiss')
    require('../../../common/angular-bootstrap-popover/ui-bootstrap-custom-tpls-2.5.0')

    /**
     * obj ={
     *  id:
     *  type
     * }
     */
    var defaultOptions = {
        id: urlData.id,
        type: 0,
        commentSelector: '#js-comment-el'
    }

    return function (app, data) {
        directiveDismiss(app);
        app.requires.push('ngSanitize', 'ui.bootstrap-popover');
        app.directive('commentHtml', function () {
            return {
                restrict: 'EA',
                replace: true,
                transclude: true,
                template: tpl,
                controller: ['$http', '$scope', '$rootScope', '$timeout', function ($http, $scope, $rootScope, $timeout) {
                    if (!urlData.id) {
                        console.warn('progress id is null')
                        return;
                    }

                    obj = angular.extend({}, defaultOptions, data || {});

                    $scope.commentText = '';
                    $scope.commentList = [];
                    $scope.isCommentSubmiting = false;
                    $scope.commentPopoverTmplUrl = 'commentPopoverTemplate.html';
                    $scope.currentCommentId = '';
                    var textareaEl = document.querySelector(obj.commentSelector);

                    //回复人 和回复的parent id
                    var commentData = {
                        reply: '',
                        parentId: ''
                    };

                    var cacheResetCommentData = function () {
                        commentData.reply = '';
                        commentData.parentId = '';
                        commentData.userName = '';
                    }

                    var cacheDeleteCommentData = {};

                    var deleteCommentData = function (commentId, parentId) {
                        var findIndex;
                        //一级
                        if (!parentId) {
                            findIndex = $scope.commentList.findIndex(function (val) {
                                if (val.parent.commentId === commentId) {
                                    return true;
                                }
                            })
                            findIndex > -1 && $scope.commentList.splice(findIndex, 1);
                            return;
                        }
                        //先找到一级
                        findIndex = $scope.commentList.findIndex(function (val) {
                            if (val.parent.commentId === parentId) {
                                return true;
                            }
                        });
                        if (findIndex === -1) {
                            consle.warn('error parentId not found');
                            return;
                        }
                        var item = $scope.commentList[findIndex];
                        //查找到二级的这个节点
                        var index = item.child.findIndex(function (val) {
                            if (val.commentId === commentId) {
                                return true;
                            }
                        });
                        index > -1 && item.child.splice(index, 1);
                    }

                    var scrollCommentToView = function (id) {
                        var el = document.querySelector('[data-qid="' + id + '"]');
                        if (!el) {
                            return;
                        }
                        el.classList.add('comment-in');
                        var sTop = utils.getScroll().top;
                        var toTop = utils.getElOffset(el).top - innerHeight + el.clientHeight;
                        if (sTop > toTop) {
                            return;
                        }
                        scrollAnimation(toTop);
                    }

                    $scope.textareaKeyup = function (e) {
                        if (e.keyCode === 13 && e.ctrlKey) {
                            $scope.addComment();
                        }
                    };

                    $scope.setcacheDeleteCommentData = function (item, parentId) {
                        cacheDeleteCommentData.id = item.commentId;
                        cacheDeleteCommentData.parentId = parentId;
                    }

                    $scope.deleteComment = function ($event) {
                        if (!cacheDeleteCommentData.id) {
                            return;
                        }
                        $http({
                            method: 'POST',
                            url: '/comments/' + cacheDeleteCommentData.id
                        }).success(function (res) {
                            if (String(res.errno) !== '0') {
                                return;
                            }
                            closerPopover($event.srcElement, true)
                            var li = closet($event.srcElement, 'li');
                            slideUpDown(li, 700, 0);
                            $timeout(function () {
                                deleteCommentData(cacheDeleteCommentData.id, cacheDeleteCommentData.parentId)
                            }, 800);
                        });
                    };

                    $scope.addComment = function () {
                        var commentText = $scope.commentText.trim();
                        if (!commentText || commentText.length > 200) {
                            return;
                        }
                        $scope.isCommentSubmiting = true;

                        //检验回复人是否被移除
                        if (commentData.reply) {
                            var reg = new RegExp('^回复：' + commentData.userName + ' ', 'g');
                            if (!reg.test(commentText)) {
                                cacheResetCommentData();
                            } else {
                                commentText = commentText.replace(reg, '');
                            }
                        }

                        $http({
                            method: 'POST',
                            url: '/comments',
                            data: {
                                sourceId: obj.id,
                                type: obj.type,
                                user: $scope.user.name,
                                content: commentText,

                                reply: commentData.reply,
                                parentId: commentData.parentId
                            }
                        }).success(function (res) {
                            if (String(res.errno) !== '0') {
                                return;
                            }
                            var commentItem = {
                                user: $scope.user.name,
                                userName: $scope.user.userName,
                                content: commentText,
                                commentId: res.data.commentId,
                                time: res.data.time,
                                reply: commentData.reply,
                                replyName: commentData.userName
                            }
                            $scope.currentCommentId = res.data.commentId;
                            //以及评论
                            if (commentData.parentId === '') {
                                $scope.commentList.push({
                                    "parent": commentItem,
                                    "child": []
                                })
                            } else {
                                //二级评论
                                $scope.commentList.forEach(function (val) {
                                    if (val.parent.commentId === commentData.parentId) {
                                        if (!Array.isArray(val.child)) {
                                            val.child = [];
                                        }
                                        val.child.push(commentItem)
                                    }
                                });
                            }

                            //reset data;
                            $scope.commentText = '';
                            cacheResetCommentData();
                            $timeout(function () {
                                scrollCommentToView(res.data.commentId)
                                textareaEl.__checklen();
                            });
                        }).finally(function () {
                            $scope.isCommentSubmiting = false;
                        });
                    };

                    $scope.replyComment = function (item, parentId) {
                        //cache data
                        commentData.reply = item.user;
                        commentData.userName = item.userName;
                        commentData.parentId = parentId;
                        //reset page data
                        $scope.commentText = '';
                        textareaEl.value = '';
                        textareaEl.focus();
                        //set textarea data
                        $timeout(function () {
                            textareaUtils.insertAtCaret(textareaEl, '回复：' + item.userName + ' ');
                        });
                    }

                    //初始话评论
                    textareaInit(textareaEl);
                    $rootScope.$on('init.user', function () {
                        $scope.user = {
                            name: $rootScope.$user.name,
                            userName: $rootScope.$user.userName,
                        }
                        $rootScope.showLoading = false;
                        //getData
                        $http({
                            method: 'GET',
                            url: '/comments',
                            params: {
                                sourceId: obj.id,
                                type: obj.type
                            }
                        }).success(function (res) {
                            if (String(res.errno) !== '0') {
                                return;
                            }
                            $scope.commentList = res.data;
                        });
                    })
                }]
            }
        });
    }
});
define('js/common/require-common',['require','exports','module','../common/filter/filter','../../common/directive/loading/loading','../../common/directive/progress/index','../../common/directive/record/index','../common/comment/index'],function (require, exports, module) {
    return function (app, type) {
        require('../common/filter/filter')(app);
        require('../../common/directive/loading/loading')(app);
        require('../../common/directive/progress/index')(app);
        require('../../common/directive/record/index')(app);
        require('../common/comment/index')(app, {
            type: type
        });
    }
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
/**
 * @author xiongjian
 * @email xiongjian@didichuxing.com
 * @create date 2017-08-15 05:37:19
 * @modify date 2017-08-15 06:09:00
 * @desc [description]
 */

//https://dalelotts.github.io/angular-bootstrap-datetimepicker/
define('js/alarm-order/index',['require','exports','module','../../common/autocomplete-muti/index','../../common/add-mark/index','../../../../lib/angular-dialog/index','../../common/angular-pagination/index','../../common/angular-bootstrap-datepicker-ppopup/angular-bootstrap-datepicker-ppopup','../../common/angular-bootstrap-timepicker/index','moment','../common/utils','../common/form/checkForm','../common/table/index','./../common/dialog/showSuccessDialog','./../common/dialog/validateDialogForm','../common/editor/load-ueditor','./../common/datetimepicder-pop-init/index','./page-init-data','./../bug/send-data','./getFields','./redirectPage','../alarm/adapterAlarmData','./../bug/page-config','text!./dlp-confirm-dialog.html','../common/exportAlarmList','./../common/add-water-mark','text!./trun-to-event-dialog.html','./../alarm/showConfirmDialog','../common/app','../common/require-common','../common/service/service'],function (require, exports, module) {
    require('../../common/autocomplete-muti/index');
    require('../../common/add-mark/index');
    require('../../../../lib/angular-dialog/index');
    require('../../common/angular-pagination/index');
    require('../../common/angular-bootstrap-datepicker-ppopup/angular-bootstrap-datepicker-ppopup');
    require('../../common/angular-bootstrap-timepicker/index');

    var moment = require('moment');
    var utils = require('../common/utils');
    var checkForm = require('../common/form/checkForm');
    var initTable = require('../common/table/index');
    var showSuccessDialog = require('./../common/dialog/showSuccessDialog');
    var validateDialogForm = require('./../common/dialog/validateDialogForm');
    var loadUeditor = require('../common/editor/load-ueditor');
    var initDatetimepickerPop = require('./../common/datetimepicder-pop-init/index');
    var pageInitData = require('./page-init-data')
    var sendData = require('./../bug/send-data');
    var getFields = require('./getFields')
    var redirectPage = require('./redirectPage')
    var adapterAlarmData = require('../alarm/adapterAlarmData');
    var pageConfig = require('./../bug/page-config');
    var dialogTpl = require('text!./dlp-confirm-dialog.html');
    var exportAlarmList = require('../common/exportAlarmList');
    var addWaterMark = require('./../common/add-water-mark')
    var dialogEvent = require('text!./trun-to-event-dialog.html');
    var showConfirmDialog = require('./../alarm/showConfirmDialog');

    var app = require('../common/app');
    app.requires.push('ngSanitize', 'ui.bootstrap-pagination', 'ui.myAutoComplete', 'ngDialog', 'ui.myAddMark', 'ui.bootstrap-datepickerPopup', 'ui.bootstrap-popover', 'ui.bootstrap.module.timepicker')
    require('../common/require-common')(app, 3);
    require('../common/service/service')(app);
    var urlData = utils.getUrlData();

    if (!urlData.id && !urlData.alarmId) {
        window.location.href = "alarm.html";
    }
    app.controller('alarm-order-ctrl', ['$rootScope', '$scope', '$http', '$element', '$timeout', 'ngDialog', '$filter', 'mypagination',
        function ($rootScope, $scope, $http, $element, $timeout, ngDialog, $filter, mypagination) {
            var ctrl = this;
            var alarmControl = $scope.alarmControl = 0;
            var removeCacheIds = {};
            $scope.hstep = 1, $scope.mstep = 1

            addWaterMark($rootScope)
            
            ctrl.pageConfig = {
                initPageData: {
                    currentTime: new Date()
                },
                riskLevel: pageConfig.riskLevel, //编辑页面有忽略
                alarmType: []
            };
            ctrl.isEdit = !!~location.href.indexOf('alarm-order-edit');
            ctrl.editors = {};

            //获取产品线
            ctrl.getDepartmentUrl = '/process/department';
            //获取人
            ctrl.getUsersUrl = '/process/getUserList';
            //初始是否显示错误信息
            ctrl.showErrors = false;

            var getAlarmType = function () {
                return $http({
                    method: "GET",
                    url: '/dictionary/listByParentId/1103'
                }).success(function (res) {
                    ctrl.pageConfig.alarmType = res.data;
                    // ctrl.pageData.typeId = res.data[0].id + '';
                });
            }

            //缓存所有被去掉的选择项
            var setRemoveCacheIds = function () {
                $scope.datas.forEach(function (val) {
                    val.isChecked ? (delete removeCacheIds[val.id]) : (removeCacheIds[val.id] = true);
                })
            }

            /**
             * 获取表单的数据，在编辑页面的时候数据需要做一些处理
             */
            var getFormData = function () {
                var pageData = angular.copy(ctrl.pageData)
                setRemoveCacheIds()
                pageData.alarmInfo = {
                    ids: Object.keys(removeCacheIds),
                    infoId: urlData.alarmId || ctrl.pageData.alarmId
                }
                pageData.id = urlData.id;
                delete pageData.state

                for (var key in ctrl.editors) {
                    if (ctrl.editors.hasOwnProperty(key)) {
                        pageData[key] = ctrl.editors[key].getContent();
                    }
                }
                pageData.expireTime = utils.isDate(pageData.expireTime) ? pageData.expireTime.toJSON() : pageData.expireTime;
                return pageData;
            };

            var initTableList = function (id) {
                //获取字段信息之后再获取页面数据
                getFields($scope, $http, alarmControl, {
                    id: id
                }).then(function () {
                    exportAlarmList($scope, $http, $filter, $scope.tableHeaderFields.slice(0), $scope.tableFields.slice(0))
                    $scope.showTableHeaderFields.push('是否保留')
                    $scope.showTableFields.push('checkbox')
                    //排序字段的处理
                    $scope.sortFields = [] //$scope.showTableHeaderFields.slice(1, $scope.showTableHeaderFields.length - 1);
                }).then(function () {
                    $scope.getData();
                })
            }

            var adapterData = function (data) {
                data.expireTime = new Date(data.expireTime.replace(/\-/g, '/'));
                data.trunEvent = '1'
                return data;
            }

            var validateForm = function () {
                return checkForm(ctrl, $scope, $timeout, function () {} /*  initEditor.validateUeditorContent */ , editorArr, $element)
            }

            //富文本编辑器
            var editorArr = ['alarmDesc'];
            var initEditor = loadUeditor($timeout, ctrl.editors, editorArr);

            var processSubmit = function (url, msg, success) {
                validateForm()
                    .then(function () {
                        return $http({
                            method: 'POST',
                            url: url,
                            data: getFormData()
                        }).finally(function () {
                            ctrl.isSubmitDataIng = false;
                        });
                    }).then(function (res) {
                        var dia = showSuccessDialog(ngDialog, $rootScope, {
                            msg: msg,
                            successFn: function () {
                                redirectPage(res.data)
                            },
                            timeout: 1300
                        });
                    });
            }

            ctrl.submitData = function () {
                var formData = getFormData();
                delete formData.id
                
                // 创建工单时，期望日期转换
                if (formData.expireTime) {
                    formData.expireTime = moment(formData.expireTime).format('YYYY-MM-DD HH:mm:ss')
                }
                validateForm()
                    .then(function () {
                        //提交数据
                        $http({
                            method: 'POST',
                            data: formData,
                            url: '/alarm/workOrder/create' //漏洞确认 /hole/confirm
                        }).success(redirectPage).then(function (res) {
                            if (res.data.errno != 0) {
                                ctrl.isSubmitDataIng = false;
                            }
                        });;
                    })
            };

            if (ctrl.isEdit) {
                $scope.turnEvent = function () {
                    if (ctrl.pageData.trunEvent == 1 && ctrl.pageData.state == '已处理') {
                        validateForm().then(function () {
                            var formData = getFormData()
                            let firstAlarmData = $scope.datas ? $scope.datas[0] : ''

                            var setDefaultDept = function(scope) {
                                if (formData.deptInfo && formData.deptInfo.length > 0) {
                                    formData.deptInfo.forEach(item => {
                                        scope.depts.push({'productId': item.productId, 'productName': item.productName})
                                    })
                                }
                            }

                            // 设置默认告警等级
                            var setAlarmLevel = function(scope) {

                                switch(formData.riskLevel + '') {
                                    case '0': 
                                        scope.level = '1304'
                                        break;
                                    case '1': 
                                        scope.level = '1303'
                                        break;
                                    case '2': 
                                        scope.level = '1302'
                                        break
                                    case '3':
                                    case '4':
                                        scope.level = '1301'
                                        break;
                                    default:
                                        scope.level = '1301'
                                }
                            }
                            var data = {
                                event_name: formData.name ? formData.name : '',
                                type: null,
                                level: null,
                                source: null,
                                status: null,
                                system: '',
                                repair_time: new Date(),
                                confirm_time: firstAlarmData.alarmTimeFormat ? moment(firstAlarmData.alarmTimeFormat).toDate() : null,
                                confirm_time_h: firstAlarmData.alarmTimeFormat ? moment(firstAlarmData.alarmTimeFormat).toDate() : null,
                                occured_time: firstAlarmData.occuredTimeFormat ? moment(firstAlarmData.occuredTimeFormat).toDate() : null,
                                occured_time_h: firstAlarmData.occuredTimeFormat ? moment(firstAlarmData.occuredTimeFormat).toDate() : null,
                                mode: '1',
                                accounts: [],
                                depts: [],
                                punish_result: '',
                                survey_result: '',
                                remark: '',
                                dialog: {
                                    title: '安全工单转安全事件'
                                },
                                pageConfig: {}
                            }

                            data.hstep = 1, data.mstep = 1,
                            data.repair_time_h = new Date()

                            var getRecords = function (scope) {
                                return $http({
                                    method: "GET",
                                    url: '/alarm/workOrder/getRecords',
                                    params: {
                                        id: formData.id
                                    }
                                }).success(function (res) {
                                    if (res.data && res.data.length > 0) {
                                        res.data.forEach(item => {
                                            if (item.info) {
                                                scope.survey_result += item.info + '\n'
                                            }
                                        })
                                    }
                                });
                            }

                            var getComments = function (scope) {
                                return $http({
                                    method: "GET",
                                    url: '/comments',
                                    params: {
                                        sourceId: formData.id,
                                        type: 3
                                    }
                                }).success(function (res) {
                                    if (res.data && res.data.length > 0) {
                                        res.data.forEach(item => {
                                            if (item.parent && item.parent.content) {
                                                scope.survey_result += item.parent.content + '\n'
                                            }
                                            if (item.child && item.child.length > 0) {
                                                item.child.forEach(c => {
                                                    scope.survey_result += c.content + '\n'
                                                })
                                            }
                                        })
                                    }
                                });
                            }
        
                            var getEventType = function (scope) {
                                return $http({
                                    method: "GET",
                                    url: '/dictionary/listByDataAuth/1330'
                                }).success(function (res) {
                                    scope.pageConfig.type = res.data;
                                });
                            }
                            var getEventLevel = function (scope) {
                                return $http({
                                    method: "GET",
                                    url: '/dictionary/listByDataAuth/1300'
                                }).success(function (res) {
                                    scope.pageConfig.level = res.data;
                                    setAlarmLevel(scope)
                                });
                            }
                            var getEventSource = function (scope) {
                                return $http({
                                    method: "GET",
                                    url: '/dictionary/listByDataAuth/1310'
                                }).success(function (res) {
                                    scope.pageConfig.source = res.data;
                                });
                            }
                            var getEventStatus = function (scope) {
                                return $http({
                                    method: "GET",
                                    url: '/dictionary/listByDataAuth/1320'
                                }).success(function (res) {
                                    scope.pageConfig.status = res.data;
                                });
                            }
                            var initDatetimepicker = function (ctrl) {
                                ['occuredTime', 'confirmTime', 'repaireTime', 'expireTime'].forEach(function (key) {
                                    ctrl[key + 'Options'] = angular.extend({}, {
                                        formatYear: 'yy',
                                        maxDate: new Date(2030, 5, 22),
                                        minDate: new Date(),
                                        showWeeks: true,
                                    });
                                    ctrl[key + 'IsOpen'] = false;
                                    ctrl[key + 'Open'] = function () {
                                        ctrl[key + 'IsOpen'] = true;
                                    }
                                    ctrl[key + 'Close'] = function () {
                                        ctrl[key + 'IsOpen'] = false;
                                    }
                                });
                            }
                            var exist = function (array, predicate) {
                                var len = array.length
                                if (typeof predicate !== 'function') {
                                    throw new TypeError('predicate must be a function');
                                }
            
                                var thisArg = arguments[1];
                                var k = 0;
            
                                while (k < len) {
                                    var kValue = array[k].productId;
            
                                    if (predicate.call(thisArg, kValue, k, array)) {
                                        return k;
                                    }
                                    k++;
                                }
                                return -1;
                            }
        
                            data.batch = true
                            data.customReason = true
                            data.customButton = true
                            data.getUsersUrl = '/process/getUserList'
                            data.getDepartmentUrl = '/process/department'
        
                            // 注册事件处理函数
                            data.handleSubmitClick = function ($event) {
                                var self = this
                                if (this.event_name && this.type && this.level && this.source && this.status && this.confirm_time) {
                                    let paramData = formData
                                    paramData['secEventAlarmParam'] = {
                                        mode: 3,
                                        event_name: this.event_name,
                                        type: this.type,
                                        level: this.level,
                                        source: this.source,
                                        status: this.status,
                                        system: this.system,
                                        repair_time: this.repair_time ? moment(this.repair_time).set({
                                            'hour': this.repair_time_h ? moment(this.repair_time_h).hour() : 0,
                                            'minute': this.repair_time_h ? moment(this.repair_time_h).minute() : 0,
                                            'second': 0
                                        }).format('YYYY-MM-DD HH:mm:ss') : '',
                                        occured_time: this.occured_time ? moment(this.occured_time).set({
                                            'hour': this.occured_time_h ? moment(this.occured_time_h).hour() : 0,
                                            'minute': this.occured_time_h ? moment(this.occured_time_h).minute() : 0,
                                            'second': 0
                                        }).format('YYYY-MM-DD HH:mm:ss') : '',
                                        confirm_time: this.confirm_time ? moment(this.confirm_time).set({
                                            'hour': this.confirm_time_h ? moment(this.confirm_time_h).hour() : 0,
                                            'minute': this.confirm_time_h ? moment(this.confirm_time_h).minute() : 0,
                                            'second': 0
                                        }).format('YYYY-MM-DD HH:mm:ss') : '',
                                        accounts: this.accounts.map(function (account) { return account.email.split('@')[0]}).join(','),
                                        depts: this.depts.map(function (depts) { return depts.productId }).join(','),
                                        punish_result: this.punish_result,
                                        survey_result: this.survey_result,
                                        remark: this.remark,
                                        alarmWorkOrderId: formData.id
                                    }
                                    checkForm(paramData, $scope, $timeout, function () {} /*  initEditor.validateUeditorContent */ , editorArr, $element).then(function() {
                                        $http({
                                            method: 'POST',
                                            url: '/alarm/workOrder/confirm',
                                            data: paramData
                                        }).success(function (res) {
                                            self.dialogClose($event)
                                            ctrl.isSubmitDataIng = false;
                                            var dia = showSuccessDialog(ngDialog, $rootScope, {
                                                msg: res.errmsg,
                                                successFn: function () {
                                                    redirectPage(res)
                                                },
                                                timeout: 1300
                                            });
                                        })
                                    })
                                }
                            }
                            data.handleCloseClick = function ($event) {
                                $event.stopImmediatePropagation();
                                this.dialogClose($event)
                            }
        
                            showConfirmDialog(ngDialog, {
                                width: 1000,
                                tpl: dialogEvent,
                                data: Object.assign({}, data),
                                onOpenCallback: function(scope) {
                                    getRecords(scope)
                                    getComments(scope)
                                    setDefaultDept(scope)
                                    initDatetimepicker(scope)
                                    getEventLevel(scope)
                                    getEventSource(scope)
                                    getEventStatus(scope)
                                    getEventType(scope)
                                    document.getElementById('confirm_time').addEventListener('keydown', function(e){
                                        e.preventDefault()
                                    }).addEventListener('paste', function(e) {
                                        e.preventDefault()
                                    })
                                    scope.$watch('accounts', function (accounts, oldValue) {
                                        var depts = accounts.map(function (accounts){
                                            return {
                                                department: accounts.department,
                                                deptId: accounts.deptId
                                            }
                                        })
                                        var len = depts.length
                                        var newest = len > 0 ? depts[len - 1] : ''
            
                                        if (len > oldValue.length && exist(scope.depts, function(dept) {
                                            return dept === newest.deptId
                                        }) == -1) {
                                           newest && scope.depts.push({'productId': newest.deptId, 'productName': newest.department})
                                        }
                                    }, true)
                                }
                            });
                        
                        })
                    } else {
                            processSubmit('/alarm/workOrder/confirm', '操作成功')
                        }
                    }

                ctrl.updateInfo = function () {
                    processSubmit('/alarm/workOrder/save', '更新信息成功！')
                }

                ctrl.ignore = function () {
                    processSubmit('/alarm/workOrder/ignore', '忽略成功！')
                }
                

                ctrl.dlpConfirmInfo = function () {
                    var dialog = ngDialog.open({
                        template: dialogTpl,
                        className: 'ngdialog-theme-default p-dialog',
                        plain: true,
                        width: 780,
                        showClose: true,
                        overlay: true,
                        name: 'showArgee',
                        controller: ['$scope', '$element', '$http', function ($innerScope, $element, $http) {

                            $innerScope.dialogClose = function ($event) {
                                $event.stopImmediatePropagation();
                                dialog.close();
                            };

                            $innerScope.showErrors = false;
                            $innerScope.userList = ctrl.getUsersUrl;
                            $innerScope.isDlpConfirm = 1;
                            $innerScope.isRequire = $innerScope.isDlpConfirm == 1;
                            $innerScope.notifiers = [];
                            $innerScope.leader = [];
                            $innerScope.reviewers = [];
                            $innerScope.remark = '';

                            $innerScope.pageAgree = function () {
                                validateDialogForm($innerScope.dlpForm, dialog, $innerScope, $timeout)
                                    .then(function () {
                                        var data = {
                                            id: urlData.id
                                        };
                                        ['isDlpConfirm', 'notifiers', 'leader', 'reviewers', 'remark'].forEach(function (key) {
                                            data[key] = $innerScope[key];
                                        })
                                        sendData($http, '/alarm/workOrder/dlpConfirm', data, dialog).then(function (res) {
                                            showSuccessDialog(ngDialog, $rootScope, {
                                                msg: '提交成功',
                                                successFn: function () {
                                                    redirectPage(res)
                                                },
                                                timeout: 1300
                                            });
                                        });
                                    });
                            };
                        }]
                    });
                }

                ctrl.isShowLoading = true;
                $http({
                    method: 'GET',
                    url: '/alarm/workOrder/getDetail',
                    params: {
                        id: urlData.id
                    }
                }).success(function (res) {
                    if (String(res.errno) !== '0') {
                        window.location.href = "/project/portals/pages/noauth.html";
                        return;
                    }
                    ctrl.pageData = adapterData(res.data.viewInfo);

                    initTableList(ctrl.pageData.alarmId);
                    $timeout(function () {
                        //reset muti-auto input width
                        angular.element(window).triggerHandler('resize');
                        initEditor.promise.then(function () {
                            ctrl.editors.alarmDesc.ready(function () {
                                ctrl.editors.alarmDesc.setContent(ctrl.pageData.alarmDesc);
                            });
                        });
                        ctrl.isShowLoading = false;
                    })
                });
            } else {
                ctrl.pageData = angular.extend({
                    alarmType: urlData.alarmType
                }, pageInitData);
                $rootScope.$on('init.user', function () {
                    ctrl.pageData.safetyEngineers = [{
                        department: $rootScope.$user.department,
                        email: $rootScope.$user.email,
                        name: $rootScope.$user.userName
                    }]
                    ctrl.pageData.processers = [{
                        department: $rootScope.$user.department,
                        email: $rootScope.$user.email,
                        name: $rootScope.$user.userName
                    }]
                    angular.element(window).triggerHandler('resize');
                });
            }

            //init page data
            ['datas'].forEach(function (key) {
                $scope[key] = [];
            })

            //分页相关处理
            $scope.isShowTableLoading = false;
            $scope.getDataUrl = '/alarm/workOrder/getAlarmList';
            mypagination.initPageination($http, $rootScope, $timeout, $scope);
            $scope.$on('data', function (e, data) {
                $scope.isShowTableLoading = false;
                //默认设置为全部选中
                data.datas.forEach(function (val) {
                    val.isChecked = true;
                    val.isExpand = false;
                })
                angular.extend($scope, adapterAlarmData(data, removeCacheIds, false));
            });

            $scope.getExtendData = function () {
                $scope.isShowTableLoading = true;
                setRemoveCacheIds();
                return {
                    id: urlData.alarmId || ctrl.pageData.alarmId
                }
            };

            //页面相关数据初始化
            initDatetimepickerPop(ctrl);
            getAlarmType()

            //table 相关处理
            initTable($scope)
            if (!ctrl.isEdit) {
                initTableList(urlData.alarmId)
            }
        }
    ]);

    angular.element(document).ready(function () {
        
        angular.bootstrap(document, ['myApp']);
    });
});

(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('@-webkit-keyframes ngdialog-fadeout{0%{opacity:1}100%{opacity:0}}@keyframes ngdialog-fadeout{0%{opacity:1}100%{opacity:0}}@-webkit-keyframes ngdialog-fadein{0%{opacity:0}100%{opacity:1}}@keyframes ngdialog-fadein{0%{opacity:0}100%{opacity:1}}.ngdialog{box-sizing:border-box}.ngdialog *,.ngdialog :after,.ngdialog :before{box-sizing:inherit}.ngdialog{position:fixed;overflow:auto;-webkit-overflow-scrolling:touch;z-index:10000;top:0;right:0;bottom:0;left:0}.ngdialog.ngdialog-disabled-animation,.ngdialog.ngdialog-disabled-animation .ngdialog-content,.ngdialog.ngdialog-disabled-animation .ngdialog-overlay{-webkit-animation:none!important;animation:none!important}.ngdialog-overlay{position:fixed;background:rgba(0,0,0,.4);top:0;right:0;bottom:0;left:0;-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadein .5s;animation:ngdialog-fadein .5s}.ngdialog-no-overlay{pointer-events:none}.ngdialog.ngdialog-closing .ngdialog-overlay{-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadeout .5s;animation:ngdialog-fadeout .5s}.ngdialog-content{background:#fff;-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadein .5s;animation:ngdialog-fadein .5s;pointer-events:all}.ngdialog.ngdialog-closing .ngdialog-content{-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadeout .5s;animation:ngdialog-fadeout .5s}.ngdialog-close:before{font-family:Helvetica,Arial,sans-serif;content:\'\\00D7\';cursor:pointer}body.ngdialog-open,html.ngdialog-open{overflow:initial}@-webkit-keyframes ngdialog-flyin{0%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes ngdialog-flyin{0%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@-webkit-keyframes ngdialog-flyout{0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}}@keyframes ngdialog-flyout{0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}}.ngdialog.ngdialog-theme-default{padding-bottom:160px;padding-top:160px}.ngdialog.ngdialog-theme-default.ngdialog-closing .ngdialog-content{-webkit-animation:ngdialog-flyout .5s;animation:ngdialog-flyout .5s}.ngdialog.ngdialog-theme-default .ngdialog-content{-webkit-animation:ngdialog-flyin .5s;animation:ngdialog-flyin .5s;background:#f0f0f0;border-radius:5px;color:#444;font-family:Helvetica,sans-serif;font-size:1.1em;line-height:1.5em;margin:0 auto;max-width:100%;padding:1em;position:relative;width:450px}.ngdialog.ngdialog-theme-default .ngdialog-close{padding:0;border:none;border-radius:5px;cursor:pointer;position:absolute;right:0;top:0}.ngdialog.ngdialog-theme-default .ngdialog-close:before{background:0 0;border-radius:3px;color:#bbb;content:\'\\00D7\';font-size:26px;font-weight:400;height:30px;line-height:26px;position:absolute;right:3px;text-align:center;top:3px;width:30px}.ngdialog.ngdialog-theme-default .ngdialog-close:active:before,.ngdialog.ngdialog-theme-default .ngdialog-close:hover:before{color:#777}.ngdialog.ngdialog-theme-default .ngdialog-message{margin-bottom:.5em}.ngdialog.ngdialog-theme-default .ngdialog-input{margin-bottom:1em}.ngdialog.ngdialog-theme-default .ngdialog-input input[type=email],.ngdialog.ngdialog-theme-default .ngdialog-input input[type=password],.ngdialog.ngdialog-theme-default .ngdialog-input input[type=text],.ngdialog.ngdialog-theme-default .ngdialog-input input[type=url],.ngdialog.ngdialog-theme-default .ngdialog-input textarea{background:#fff;border:0;border-radius:3px;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0 0 .25em;min-height:2.5em;padding:.25em .67em;width:100%}.ngdialog.ngdialog-theme-default .ngdialog-input input[type=email]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input input[type=password]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input input[type=text]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input input[type=url]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input textarea:focus{box-shadow:inset 0 0 0 2px #8dbdf1;outline:0}.ngdialog.ngdialog-theme-default .ngdialog-buttons:after{content:\'\';display:table;clear:both}.ngdialog.ngdialog-theme-default .ngdialog-button{border:0;border-radius:3px;cursor:pointer;float:right;font-family:inherit;font-size:.8em;letter-spacing:.1em;line-height:1em;margin:0 0 0 .5em;padding:.75em 2em;text-transform:uppercase}.ngdialog.ngdialog-theme-default .ngdialog-button:focus{-webkit-animation:ngdialog-pulse 1.1s infinite;animation:ngdialog-pulse 1.1s infinite;outline:0}@media (max-width:568px){.ngdialog.ngdialog-theme-default .ngdialog-button:focus{-webkit-animation:none;animation:none}}.ngdialog.ngdialog-theme-default .ngdialog-button.ngdialog-button-primary{background:#3288e6;color:#fff}.ngdialog.ngdialog-theme-default .ngdialog-button.ngdialog-button-secondary{background:#e0e0e0;color:#777}.ngdialog.ngdialog-theme-plain{padding-bottom:160px;padding-top:160px}.ngdialog.ngdialog-theme-plain .ngdialog-content{background:#fff;color:#444;font-family:\'Helvetica Neue\',sans-serif;font-size:1.1em;line-height:1.5em;margin:0 auto;max-width:100%;padding:1em;position:relative;width:450px}.ngdialog.ngdialog-theme-plain .ngdialog-content h1,.ngdialog.ngdialog-theme-plain .ngdialog-content h2,.ngdialog.ngdialog-theme-plain .ngdialog-content h3,.ngdialog.ngdialog-theme-plain .ngdialog-content h4,.ngdialog.ngdialog-theme-plain .ngdialog-content h5,.ngdialog.ngdialog-theme-plain .ngdialog-content h6,.ngdialog.ngdialog-theme-plain .ngdialog-content li,.ngdialog.ngdialog-theme-plain .ngdialog-content p,.ngdialog.ngdialog-theme-plain .ngdialog-content ul{color:inherit}.ngdialog.ngdialog-theme-plain .ngdialog-close{cursor:pointer;position:absolute;right:0;top:0}.ngdialog.ngdialog-theme-plain .ngdialog-close:before{background:0 0;color:#bbb;content:\"\\00D7\";font-size:26px;font-weight:400;height:30px;line-height:26px;position:absolute;right:3px;text-align:center;top:3px;width:30px}.ngdialog.ngdialog-theme-plain .ngdialog-close:active:before,.ngdialog.ngdialog-theme-plain .ngdialog-close:hover:before{color:#777}.ngdialog.ngdialog-theme-plain .ngdialog-message{margin-bottom:.5em}.ngdialog.ngdialog-theme-plain .ngdialog-input{margin-bottom:1em}.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=email],.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=password],.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=text],.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=url],.ngdialog.ngdialog-theme-plain .ngdialog-input textarea{background:#f0f0f0;border:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0 0 .25em;min-height:2.5em;padding:.25em .67em;width:100%}.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=email]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=password]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=text]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=url]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input textarea:focus{box-shadow:inset 0 0 0 2px rgba(0,0,0,.2);outline:0}.ngdialog.ngdialog-theme-plain .ngdialog-buttons:after{clear:both;content:\'\';display:table}.ngdialog.ngdialog-theme-plain .ngdialog-button{border:0;cursor:pointer;float:right;font-family:inherit;font-size:.8em;letter-spacing:.1em;line-height:1em;margin:0 0 0 .5em;padding:.75em 2em;text-transform:uppercase}.ngdialog.ngdialog-theme-plain .ngdialog-button:focus{-webkit-animation:ngdialog-pulse 1.1s infinite;animation:ngdialog-pulse 1.1s infinite;outline:0}@media (max-width:568px){.ngdialog.ngdialog-theme-plain .ngdialog-button:focus{-webkit-animation:none;animation:none}}.ngdialog.ngdialog-theme-plain .ngdialog-button.ngdialog-button-primary{background:#3288e6;color:#fff}.ngdialog.ngdialog-theme-plain .ngdialog-button.ngdialog-button-secondary{background:#e0e0e0;color:#777}.pagination{display:inline-block;padding-left:0;margin:20px 0;border-radius:4px}.pagination>li{display:inline}.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:6px 12px;margin-left:-1px;line-height:1.42857143;color:#337ab7;text-decoration:none;background-color:#fff;border:1px solid #ddd}.pagination>li:first-child>a,.pagination>li:first-child>span{margin-left:0;border-top-left-radius:4px;border-bottom-left-radius:4px}.pagination>li:last-child>a,.pagination>li:last-child>span{border-top-right-radius:4px;border-bottom-right-radius:4px}.pagination>li>a:focus,.pagination>li>a:hover,.pagination>li>span:focus,.pagination>li>span:hover{z-index:3;color:#23527c;background-color:#eee;border-color:#ddd}.pagination>.active>a,.pagination>.active>a:focus,.pagination>.active>a:hover,.pagination>.active>span,.pagination>.active>span:focus,.pagination>.active>span:hover{z-index:2;color:#fff;cursor:default;background-color:#337ab7;border-color:#337ab7}.pagination>.disabled>a,.pagination>.disabled>a:focus,.pagination>.disabled>a:hover,.pagination>.disabled>span,.pagination>.disabled>span:focus,.pagination>.disabled>span:hover{color:#777;cursor:not-allowed;background-color:#fff;border-color:#ddd}.pagination-lg>li>a,.pagination-lg>li>span{padding:10px 16px;font-size:18px;line-height:1.3333333}.pagination-lg>li:first-child>a,.pagination-lg>li:first-child>span{border-top-left-radius:6px;border-bottom-left-radius:6px}.pagination-lg>li:last-child>a,.pagination-lg>li:last-child>span{border-top-right-radius:6px;border-bottom-right-radius:6px}.pagination-sm>li>a,.pagination-sm>li>span{padding:5px 10px;font-size:12px;line-height:1.5}.pagination-sm>li:first-child>a,.pagination-sm>li:first-child>span{border-top-left-radius:3px;border-bottom-left-radius:3px}.pagination-sm>li:last-child>a,.pagination-sm>li:last-child>span{border-top-right-radius:3px;border-bottom-right-radius:3px}.uib-datepicker-popup{line-height:1.42857143;}.uib-datepicker-popup.dropdown-menu{display:block;float:none;margin:0;}.uib-button-bar{padding:10px 9px 2px;}.uib-datepicker .uib-title{width:100%;}.uib-day button,.uib-month button,.uib-year button{min-width:100%;}.uib-left,.uib-right{width:100%}.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}.uib-time input{width:50px;}@charset \"UTF-8\";.header:before,.header-right:before,.header:after,.header-right:after{content:\"\";display:table;}.header:after,.header-right:after{clear:both;}dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:\'...\\A..\\A.\';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.header{min-width:1100px;width:100%;height:70px;border-bottom:solid 1px #d4d6db;color:#262626;box-shadow:0 1px 2px 1px #f1f1f1;}.logo{margin-left:35px;line-height:70px;display:inline-block;background:url(/project/portals/i/logo.png?v=953c28) 0 center no-repeat;background-size:35px auto;font-size:22px;padding-left:41px;color:#262626;vertical-align:middle;cursor:pointer;text-decoration:none;}.logo:hover{text-decoration:none;color:#262626;}.header-list > li .p-dropdown,.header-right .msg .p-dropdown,.header-right .user .p-dropdown{display:block;position:absolute;width:160px;top:62px;left:50%;transition:transform 0.25s cubic-bezier(0.18,0.89,0.32,1.28);transform-origin:center top;transform:translate(-50%) scaleY(0);}.header-list > li:hover .p-dropdown,.header-right .msg:hover .p-dropdown,.header-right .wrap-user-img:hover .p-dropdown{transform:translate(-50%) scaleY(1);}.header-list{font-size:16px;display:inline-block;vertical-align:middle;margin-left:75px;list-style:none outside none;margin-bottom:0;}.header-list > li{padding:0 10px;margin-right:30px;float:left;line-height:70px;position:relative;cursor:pointer;}.header-list > li:last-child{margin-right:0;}.header-list > li:hover > a,.header-list > li.hover > a{color:#528be6;text-decoration:none;}.header-list > li:hover > i,.header-list > li.hover > i{left:0;right:0;}.header-list > li > a{transition:color .3s ease-out;color:#262626;display:block;text-align:center;line-height:70px;text-decoration:none;}.header-list > li > i{position:absolute;bottom:10px;left:50%;right:50%;height:4px;font-size:0;background-color:#528be6;transition-property:left,right;transition-duration:.3s;transition-timing-function:ease-out;}.header-right{line-height:70px;height:70px;font-size:0;margin-right:16px;float:right;}.header-right .msg{position:relative;color:#262626;line-height:70px;font-size:14px;float:left;cursor:pointer;}.header-right .msg a{text-decoration:none;color:#262626;}.header-right .msg b{font-weight:normal;color:#fa9027;margin-left:6px;}.header-right .wrap-user-img{float:left;}.header-right .wrap-user-img:hover .user:before{transform:rotate(-45deg);top:60%;}.header-right .wrap-img{float:left;height:70px;margin-left:46px;padding-top:15px;cursor:pointer;}.header-right .wrap-img img{vertical-align:top;border-radius:50%;width:40px;height:40px;}.header-right .user{padding-left:11px;margin-right:58px;cursor:pointer;position:relative;height:70px;float:left;}.header-right .user:before{content:\'\';display:block;width:8px;height:8px;border:solid #d8d8d8;border-width:2px 2px 0 0;position:absolute;top:50%;z-index:1;transform:rotate(135deg);}.header-right .user:before{right:-20px;margin-top:-5px;transition:all .3s linear;}.header-right .user .name{display:inline-block;vertical-align:middle;color:#343434;font-size:14px;}.p-dropdown{padding:6px 0;border-radius:8px;background-color:#ffffff;box-shadow:0 0 2px 2px #f1f1f1;position:relative;list-style:none outside none;z-index:1000;}.p-dropdown:before{content:\'\';position:absolute;top:-2px;left:50%;z-index:10;width:10px;height:10px;background-color:#fff;border:solid #f0f0f0;border-width:1px 0 0 1px;box-shadow:-1px -1px 2px #f1f1f1;transform:rotate(45deg) translate(-50%);}.p-dropdown > .list-item,.p-dropdown > li{color:#262626;font-size:14px;line-height:35px;padding:0 16px;}.p-dropdown > .list-item:hover,.p-dropdown > li:hover{background-color:#f5f5f5;}.p-dropdown > .list-item:last-child,.p-dropdown > li:last-child{border-radius:0 0 4px 4px;}.p-dropdown > .list-item:first-child,.p-dropdown > li:first-child{border-radius:4px 4px 0 0;}.p-dropdown > .list-item a,.p-dropdown > li a{color:#262626;}.p-dropdown > .list-item a:hover,.p-dropdown > li a:hover{color:#528be6;text-decoration:none;}.p-dropdown > .list-item > b,.p-dropdown > li > b{font-weight:normal;color:#fa8919;padding-right:8px;}@media (max-width:1000px){.header-list{margin-left:0;}.header-list > li{margin-right:15px;}}@media (max-width:1200px){.header-list{margin-left:0;}.header-list > li{margin-right:18px;}}@charset \"UTF-8\";dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:\'...\\A..\\A.\';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.p-loading-wrap{}@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}.p-loading-wrap .mask{height:100%;width:100%;background-color:#fff;position:absolute;left:0;top:0;z-index:1000;}.p-loading-wrap .loading-content{z-index:1001;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;width:100%;height:32px;line-height:32px;text-align:center;vertical-align:middle;}.p-loading-wrap .loading{position:relative;display:inline-block;width:32px;height:32px;vertical-align:middle;}.p-loading-wrap .loading:after{margin:12px 12px 0;display:block;content:\'\';width:3px;height:3px;border-radius:100%;box-shadow:0 -10px 0 1px #ccc,10px 0px #ccc,0 10px #ccc,-10px 0 #ccc,-7px -7px 0 0.5px #ccc,7px -7px 0 1.5px #ccc,7px 7px #ccc,-7px 7px #ccc;animation:spin 1s steps(8) infinite;}[uib-tooltip-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-bottom > .tooltip-arrow,[uib-popover-popup].popover.top-left > .arrow,[uib-popover-popup].popover.top-right > .arrow,[uib-popover-popup].popover.bottom-left > .arrow,[uib-popover-popup].popover.bottom-right > .arrow,[uib-popover-popup].popover.left-top > .arrow,[uib-popover-popup].popover.left-bottom > .arrow,[uib-popover-popup].popover.right-top > .arrow,[uib-popover-popup].popover.right-bottom > .arrow,[uib-popover-html-popup].popover.top-left > .arrow,[uib-popover-html-popup].popover.top-right > .arrow,[uib-popover-html-popup].popover.bottom-left > .arrow,[uib-popover-html-popup].popover.bottom-right > .arrow,[uib-popover-html-popup].popover.left-top > .arrow,[uib-popover-html-popup].popover.left-bottom > .arrow,[uib-popover-html-popup].popover.right-top > .arrow,[uib-popover-html-popup].popover.right-bottom > .arrow,[uib-popover-template-popup].popover.top-left > .arrow,[uib-popover-template-popup].popover.top-right > .arrow,[uib-popover-template-popup].popover.bottom-left > .arrow,[uib-popover-template-popup].popover.bottom-right > .arrow,[uib-popover-template-popup].popover.left-top > .arrow,[uib-popover-template-popup].popover.left-bottom > .arrow,[uib-popover-template-popup].popover.right-top > .arrow,[uib-popover-template-popup].popover.right-bottom > .arrow{top:auto;bottom:auto;left:auto;right:auto;margin:0;}[uib-popover-popup].popover,[uib-popover-html-popup].popover,[uib-popover-template-popup].popover{display:block !important;}.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}');
