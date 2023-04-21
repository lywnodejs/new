define('normalize',{});
define('css',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});

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

define('css!common/show-large-img/css',[],function(){});
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
define('js/../../../lib/es6-promise/es6-promise',['require','exports','module'],function(t,e,n){"use strict";function r(t){return"function"==typeof t}function o(){var t=setTimeout;return function(){return t(i,1)}}function i(){for(var t=0;t<E;t+=2){(0,F[t])(F[t+1]),F[t]=void 0,F[t+1]=void 0}E=0}function s(){try{var e=t("vertx");return void 0!==(T=e.runOnLoop||e.runOnContext)?function(){T(i)}:o()}catch(t){return o()}}function u(t,e){var n=arguments,r=this,o=new this.constructor(a);void 0===o[K]&&w(o);var i=r._state;return i?function(){var t=n[i-1];C(function(){return b(i,o,t,r._result)})}():d(r,o,t,e),o}function c(t){if(t&&"object"==typeof t&&t.constructor===this)return t;var e=new this(a);return h(e,t),e}function a(){}function f(t){try{return t.then}catch(t){return W.error=t,W}}function l(t,e,n){e.constructor===t.constructor&&n===u&&e.constructor.resolve===c?function(t,e){e._state===N?v(t,e._result):e._state===U?_(t,e._result):d(e,void 0,function(e){return h(t,e)},function(e){return _(t,e)})}(t,e):n===W?_(t,W.error):void 0===n?v(t,e):r(n)?function(t,e,n){C(function(t){var r=!1,o=function(t,e,n,r){try{t.call(e,n,r)}catch(t){return t}}(n,e,function(n){r||(r=!0,e!==n?h(t,n):v(t,n))},function(e){r||(r=!0,_(t,e))},t._label);!r&&o&&(r=!0,_(t,o))},t)}(t,e,n):v(t,e)}function h(t,e){t===e?_(t,new TypeError("You cannot resolve a promise with itself")):!function(t){return"function"==typeof t||"object"==typeof t&&null!==t}(e)?v(t,e):l(t,e,f(e))}function p(t){t._onerror&&t._onerror(t._result),y(t)}function v(t,e){t._state===L&&(t._result=e,t._state=N,0!==t._subscribers.length&&C(y,t))}function _(t,e){t._state===L&&(t._state=U,t._result=e,C(p,t))}function d(t,e,n,r){var o=t._subscribers,i=o.length;t._onerror=null,o[i]=e,o[i+N]=n,o[i+U]=r,0===i&&t._state&&C(y,t)}function y(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r=void 0,o=void 0,i=t._result,s=0;s<e.length;s+=3)r=e[s],o=e[s+n],r?b(n,r,o,i):o(i);t._subscribers.length=0}}function m(){this.error=null}function b(t,e,n,o){var i=r(n),s=void 0,u=void 0,c=void 0,a=void 0;if(i){if((s=function(t,e){try{return t(e)}catch(t){return q.error=t,q}}(n,o))===q?(a=!0,u=s.error,s=null):c=!0,e===s)return void _(e,new TypeError("A promises callback cannot return that same promise."))}else s=o,c=!0;e._state!==L||(i&&c?h(e,s):a?_(e,u):t===N?v(e,s):t===U&&_(e,s))}function w(t){t[K]=z++,t._state=void 0,t._result=void 0,t._subscribers=[]}function g(t,e){this._instanceConstructor=t,this.promise=new t(a),this.promise[K]||w(this.promise),S(e)?(this._input=e,this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?v(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&v(this.promise,this._result))):_(this.promise,new Error("Array Methods must be provided an Array"))}function A(t){this[K]=z++,this._result=this._state=void 0,this._subscribers=[],a!==t&&("function"!=typeof t&&function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}(),this instanceof A?function(t,e){try{e(function(e){h(t,e)},function(e){_(t,e)})}catch(e){_(t,e)}}(this,t):function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}())}var j=void 0,S=j=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},E=0,T=void 0,M=void 0,C=function(t,e){F[E]=t,F[E+1]=e,2===(E+=2)&&(M?M(i):D())},O="undefined"!=typeof window?window:void 0,P=O||{},x=P.MutationObserver||P.WebKitMutationObserver,Y="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),k="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,F=new Array(1e3),D=void 0;D=Y?function(){return process.nextTick(i)}:x?function(){var t=0,e=new x(i),n=document.createTextNode("");return e.observe(n,{characterData:!0}),function(){n.data=t=++t%2}}():k?function(){var t=new MessageChannel;return t.port1.onmessage=i,function(){return t.port2.postMessage(0)}}():void 0===O&&"function"==typeof t?s():o();var K=Math.random().toString(36).substring(16),L=void 0,N=1,U=2,W=new m,q=new m,z=0;return g.prototype._enumerate=function(){for(var t=this.length,e=this._input,n=0;this._state===L&&n<t;n++)this._eachEntry(e[n],n)},g.prototype._eachEntry=function(t,e){var n=this._instanceConstructor,r=n.resolve;if(r===c){var o=f(t);if(o===u&&t._state!==L)this._settledAt(t._state,e,t._result);else if("function"!=typeof o)this._remaining--,this._result[e]=t;else if(n===A){var i=new n(a);l(i,t,o),this._willSettleAt(i,e)}else this._willSettleAt(new n(function(e){return e(t)}),e)}else this._willSettleAt(r(t),e)},g.prototype._settledAt=function(t,e,n){var r=this.promise;r._state===L&&(this._remaining--,t===U?_(r,n):this._result[e]=n),0===this._remaining&&v(r,this._result)},g.prototype._willSettleAt=function(t,e){var n=this;d(t,void 0,function(t){return n._settledAt(N,e,t)},function(t){return n._settledAt(U,e,t)})},A.all=function(t){return new g(this,t).promise},A.race=function(t){var e=this;return new e(S(t)?function(n,r){for(var o=t.length,i=0;i<o;i++)e.resolve(t[i]).then(n,r)}:function(t,e){return e(new TypeError("You must pass an array to race."))})},A.resolve=c,A.reject=function(t){var e=new this(a);return _(e,t),e},A._setScheduler=function(t){M=t},A._setAsap=function(t){C=t},A._asap=C,A.prototype={constructor:A,then:u,catch:function(t){return this.then(null,t)}},A.polyfill=function(){var t=void 0;if("undefined"!=typeof global)t=global;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;if(e){var n=null;try{n=Object.prototype.toString.call(e.resolve())}catch(t){}if("[object Promise]"===n&&!e.cast)return}t.Promise=A},A.Promise=A,A});
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
define('text',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});

define('text!js/application-detail/tpl/dialog-tpl.html',[],function () { return '<form class="p-form" name="reasonForm">\n    <div class="p-form-item" ng-show="isInsertTask">\n        <label class="p-12-percent"><i class="i-must ">*</i>加签方式：</label>\n        <div class="wrap-input" ng-class="{\'p-error\':isInsertTask && !op}" >\n            <select class="p-form-control" ng-model="op" ng-required="isInsertTask">\n                <option value="">请选择</option>\n                <option value="0">加签在当前审批人之前</option>\n                <option value="1">加签在当前审批人之后</option>\n            </select>\n            <span class="p-error-msg" ng-class="{\'ng-invalid\':isInsertTask && !op}"  ng-show="isInsertTask && !op">请选加签方式</span>\n        </div>\n        <div class="wrap-input" ng-show="op===\'0\'"> 需要准备加签的人审批，审批后回到当前处理人 </div>\n        <div class="wrap-input" ng-show="op===\'1\'"> 需要准备加签的人审批，审批后直接到下一流程</div>\n    </div>\n\n    <div class="p-form-item" ng-show="isAdmin">\n        <label class="p-12-percent"><i class="i-must ">*</i>任务属性：</label>\n        <div class="wrap-input p-col-10" ng-class="{\'p-error\':!taskId&& showErrors && isAdmin}">\n                <select class="p-form-control" ng-model="taskId" name="taskId" ng-required="isAdmin" >\n                    <option value="">请选择</option>\n                    <option ng-repeat="o in taskInfoOptions" value="{{o.taskId}}">{{o.taskId+\'-\'+o.processer.join(\'-\')}}</option>\n                </select> \n            <span class="p-error-msg" ng-class="{\'ng-invalid\':!taskId && showErrors && isAdmin}"  ng-show="!taskId">请选转任务属性</span>\n        </div>\n    </div>\n\n    <div class="p-form-item">\n        <label class="p-12-percent"><i class="i-must ">*</i>转移给：</label>\n        <div class="wrap-input p-col-10" ng-class="{\'p-error\':!followers.length&& showErrors}">\n            <ui-my-auto-complete url="userList" placeholder="请输入关注人" ng-model="followers" ng-cloak>\n                <ui-select-match-item>{{$item.department.split(\'>\')[0]}}-{{$item.name}}</ui-select-match-item>\n                <ui-auto-complete-list>{{item.department}}-{{item.name}}-{{item.email}}</ui-auto-complete-list>\n            </ui-my-auto-complete>\n            <span class="p-error-msg" ng-class="{\'ng-invalid\':!followers.length && showErrors}"  ng-show="!followers.length">请选转移人</span>\n        </div>\n    </div>\n\n    <div class="p-form-item">\n        <label class="p-12-percent p-muti"><i class="i-must ">*</i>原因：</label>\n        <div class="wrap-input p-col-10" ng-class="{\'p-error\':reasonForm.reason.$error.required && reasonForm.reason.$touched}">\n            <textarea class="p-form-control p-reason" ng-required="true" name="reason" placeholder="请输入原因" ng-model="reason"></textarea>\n            <span ng-show="reasonForm.reason.$error.required" class="p-error-msg">请输入原因</span>\n        </div>\n    </div>\n</form>\n<div class="wrap-center-btn">\n    <button class="p-btn" ng-click="pageAgree()">确认</button>\n    <button class="p-btn p-btn-gray" ng-click="dialogClose($event)">取消</button>\n</div>';});

'use strict';

define('js/application-detail/js/adapter-data',['require','exports','module'],function (require, exports, module) {
    var levelMap = ['公开数据(C1)', '内部数据(C2)', '秘密数据(C3)', '机密数据(C4)'];
    var getLevel = function getLevel(level) {
        return levelMap[level | 0] || '';
    };
    return function ($filter, data) {
        //数组object 转为字符串链接的字符串
        var eachData = {
            // followers: 'name',
            provideProduct: 'productName'
        };

        //关注人 和产品线多个
        for (var key in eachData) {
            if (angular.isArray(data[key])) {
                data[key] = $filter('getKeysJoin')(data[key], eachData[key]);
            }
        }
        ['followers', 'currentProcesser', 'providers'].forEach(function (key) {
            if (data[key] && data[key].length) {
                data[key] = data[key].map(function (val) {
                    return val && '<a href="http://home.didichuxing.com/person.html#/' + (val.email && val.email.split('@')[0]) + '/1" target="_blank">' + val.name + '</a>';
                }).join(',');
            } else {
                data[key] = '无';
            }
        });
        data.dataApplyPerson = '<a href="http://home.didichuxing.com/person.html#/' + (data.dataApplyPerson.email && data.dataApplyPerson.email.split('@')[0]) + '/1" target="_blank">' + data.dataApplyPerson.name + '</a>';

        //数据使用方 三级级联
        //dataConsumer dataConsumerIn dataConsumerOut dataConsumerOutOther dataConsumerOutOtherText
        var dataConsumer = '';
        if (String(data.dataConsumer) === '0') {
            dataConsumer += '公司以内;';
            if (angular.isArray(data.dataConsumerIn) && data.dataConsumerIn.length) {
                dataConsumer += $filter('getKeysJoin')(data.dataConsumerIn, 'productName');
            }
        } else {
            dataConsumer += '公司以外;';
            //非政府机构
            if (String(data.dataConsumerOut) === '0') {
                dataConsumer += "非政府机构;";
                if (data.dataConsumerOutOtherText) {
                    dataConsumer += data.dataConsumerOutOtherText;
                }
            } else {
                //政府机构
                if (String(data.dataConsumerOut) === '1') {
                    dataConsumer += "政府机构;";
                }
                if (angular.isArray(data.dataConsumerOutOther) && data.dataConsumerOutOther.length) {
                    dataConsumer += data.dataConsumerOutOther.map(function (val) {
                        return $filter('dataConsumer')(val);
                    }).join(',') + ';';
                }
                if (!!~data.dataConsumerOutOther.indexOf('4') && data.dataConsumerOutOtherText) {
                    dataConsumer += data.dataConsumerOutOtherText;
                }
            }
        }
        data.dataConsumer = dataConsumer.replace(/;$/, '');

        //dataType 包括数据：
        if (angular.isArray(data.dataType)) {
            data.dataType = data.dataType.length ? data.dataType.map(function (val) {
                return $filter('dataType')(val);
            }).join(',') : '';
        }

        //dataLevel 数据等级
        data.dataLevel = getLevel(data.dataLevel);

        //dataProvideMethod
        data.dataProvideMethod = $filter('dataProvideMethod')(data.dataProvideMethod);
        if (data.dataProvideMethod === '其他') {
            data.dataProvideMethod += ';' + data.dataProvideMethodOtherText;
        }

        //dataRequestFrequency
        // data.dataRequestFrequency = dataRequestFrequencyMap[data.dataRequestFrequency | 0];

        //处理endTime
        if (data.dataRequestFrequency !== '仅此一次') {
            if (new Date('2100').getDate() == new Date(data.endTime).getDate()) {
                data.dataRequestFrequency += "; 截止日期：长期";
            } else {
                data.dataRequestFrequency += "; 截止日期：" + $filter('date')(data.endTime, 'yyyy-MM-dd HH:mm:ss');
            }
        }

        //dataVolume
        data.dataVolume = $filter('dataVolume')(data.dataVolume);

        return data;
    };
});
//# sourceMappingURL=adapter-data.js.map
;
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
'use strict';
define('js/application-detail/js/showSuccessDialog',['require','exports','module','./../../common/dialog/showSuccessDialog'],function (require, exports, module) {
    return require('./../../common/dialog/showSuccessDialog');
});
//# sourceMappingURL=showSuccessDialog.js.map;

define('text!js/common/dialog/tpl/input-resaon.html',[],function () { return '<form class="p-form" name="reasonForm">\n    <div class="p-form-item">\n        <div class="wrap-input p-col-12" ng-class="{\'p-error\':reasonForm.reason.$error.required && reasonForm.reason.$touched}">\n            <textarea class="p-form-control p-reason" ng-required="true" name="reason" placeholder="请输入原因" ng-model="reason"></textarea>\n            <span ng-show="reasonForm.reason.$error.required" class="p-error-msg">请输入原因</span>\n        </div>\n    </div>\n</form>\n<div class="wrap-center-btn">\n    <button class="p-btn" ng-click="pageAgree()">确认</button>\n    <button class="p-btn p-btn-gray" ng-click="dialogClose($event)">取消</button>\n</div>';});

define('js/application-detail/js/input-resaon-opts',['require','exports','module','text!./../../common/dialog/tpl/input-resaon.html'],function (require, exports, module) {
    return {
        template: require('text!./../../common/dialog/tpl/input-resaon.html'),
        className: 'ngdialog-theme-default p-dialog',
        plain: true,
        width: 538,
        height: 320,
        showClose: true,
        overlay: true,
        name: 'showArgee'
    };
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

define('js/application-detail/js/detail',['require','exports','module','../../../../../lib/angular-dialog/index','../../../common/autocomplete-muti/index','../../../common/show-large-img/index','../../common/addTableClass','../../common/utils','../../common/dialog/validateDialogForm','text!./../tpl/dialog-tpl.html','./adapter-data','./showSuccessDialog','./input-resaon-opts','../../common/app','../../common/filter/application-filter','../../common/require-common'],function (require, exports, module) {
    require('../../../../../lib/angular-dialog/index');
    require('../../../common/autocomplete-muti/index');
    require('../../../common/show-large-img/index');

    var addTableClass = require('../../common/addTableClass');
    var utils = require('../../common/utils');
    var validateDialogForm = require('../../common/dialog/validateDialogForm');
    var dialogTpl = require('text!./../tpl/dialog-tpl.html');
    var adapterData = require('./adapter-data');
    var showSuccessDialog = require('./showSuccessDialog');
    var inputReasonOpts = require('./input-resaon-opts');
    var app = require('../../common/app');
    app.requires.push('ui.myAutoComplete', 'ngDialog', 'ui.showLargeImg');
    app.requires.push('ngSanitize', 'ui.bootstrap-popover');

    require('../../common/filter/application-filter')(app);
    require('../../common/require-common')(app, 1);
    var urlData = utils.getUrlData();
    var URLS = {
        getTaskDetail: '/process/getTaskDetail',
        getTaskInfo: '/process/getTaskInfo',
        agree: '/process/agree',
        refuse: '/process/refuse',
        changeTask: '/process/changeTask',
        userList: '/process/getUserList',
        insertTask: '/process/insertTask'
    };
    var remindKey = 'potals-remind-time-' + urlData.id;

    app.controller('application-detail', ['$rootScope', '$scope', '$http', '$timeout', 'ngDialog', '$filter', function ($rootScope, $scope, $http, $timeout, ngDialog, $filter) {
        $scope.processState = $scope.processRecord = [];
        $scope.pageId = 0;
        $scope.url = URLS;
        $scope.taskInfoOptions = [];

        $scope.remindTime = new Date(localStorage.getItem(remindKey) || '2017-11-10 12:34:56');
        $scope.isEnableRemind = new Date().getTime() - $scope.remindTime.getTime() >= 4 * 60 * 60 * 1000;
        $scope.isEnableRemind && localStorage.removeItem(remindKey);
        var ctrl = this;
        var getTaskInfo = function getTaskInfo($c) {
            $http({
                method: 'GET',
                url: URLS.getTaskInfo,
                params: {
                    id: urlData.id
                }
            }).success(function (res) {
                if (String(res.errno) !== '0') {
                    return;
                }
                $c.taskInfoOptions = $scope.taskInfoOptions = res.data;
            });
        };

        var sendData = function sendData(url, data, dialog) {
            dialog.sendDataing = true;
            $http({
                method: 'POST',
                url: url,
                data: data
            }).success(function (res) {
                if (String(res.errno) !== '0') {
                    return;
                }
                dialog.close();
                showSuccessDialog(ngDialog, $rootScope);
            }).error(function () {
                dialog.sendDataing = false;
            });
        };

        $scope.showDialog = function (url, pageId) {
            var dialog = ngDialog.open(angular.extend({}, inputReasonOpts, {
                controller: ['$scope', function ($innerScope) {
                    $innerScope.dialogClose = function ($event) {
                        $event.stopImmediatePropagation();
                        dialog.close();
                    };
                    $innerScope.pageAgree = function () {
                        validateDialogForm($innerScope.reasonForm, dialog, $innerScope, $timeout).then(function () {
                            sendData(url, {
                                id: dialog.pageId,
                                reason: $innerScope.reason
                            }, dialog);
                        });
                    };
                }]
            }));
            dialog.pageId = pageId;
            return false;
        };

        $scope.remind = function () {
            $http({
                method: 'POST',
                url: '/process/remind',
                params: {
                    id: urlData.id,
                    type: 'data'
                }
            }).success(function (res) {
                if (String(res.errno) !== '0') {
                    alert('发生错误');
                    return;
                }
                localStorage.setItem(remindKey, new Date().toISOString());
                $scope.isEnableRemind = false;
                showSuccessDialog(ngDialog, $rootScope, {
                    msg: '催办成功',
                    successFn: function successFn() {}
                });
            });
        };

        $scope.showTransfer = function (url, pageId, isInsertTask) {
            var dialog = ngDialog.open({
                template: dialogTpl,
                className: 'ngdialog-theme-default p-dialog',
                plain: true,
                width: 680,
                showClose: true,
                overlay: true,
                name: 'showArgee',
                controller: ['$scope', '$element', function ($innerScope, $element) {

                    $innerScope.dialogClose = function ($event) {
                        $event.stopImmediatePropagation();
                        dialog.close();
                    };

                    $innerScope.userList = URLS.userList;
                    $innerScope.followers = [];
                    $innerScope.showErrors = false;
                    $innerScope.isInsertTask = isInsertTask;
                    $innerScope.isAdmin = $scope.pageData.isAdmin;
                    $innerScope.op = '';

                    if ($innerScope.isAdmin && !$scope.taskInfoOptions.length) {
                        getTaskInfo($innerScope);
                    } else if ($innerScope.isAdmin) {
                        $innerScope.taskInfoOptions = $scope.taskInfoOptions;
                    }

                    $innerScope.pageAgree = function () {
                        validateDialogForm($innerScope.reasonForm, dialog, $innerScope, $timeout).then(function () {
                            sendData(url, {
                                id: dialog.pageId,
                                reason: $innerScope.reason,
                                person: $innerScope.followers,
                                op: $innerScope.op,
                                taskId: $innerScope.taskId
                            }, dialog);
                        });
                    };
                }]
            });
            dialog.pageId = pageId;
        };

        function redirectToList() {
            window.location.href = "/project/portals/pages/application-list.html";
        }

        if (!urlData.id) {
            console.error('error ! id is null');
            redirectToList();
            return;
        }
        $http({
            method: 'GET',
            url: URLS.getTaskDetail,
            params: {
                id: urlData.id
            }
        }).success(function (res) {
            if (String(res.errno) !== '0') {
                redirectToList();
                return;
            }
            $scope.pageData = adapterData($filter, res.data);
            $scope.pageId = res.data.id;

            //table预览需要加上额外的样式
            $timeout(function () {
                ['description'].forEach(function (val) {
                    addTableClass('#js-' + val);
                });
            });
        });
    }]);

    return function (options) {
        angular.element(document).ready(function () {
            angular.bootstrap(document, ['myApp']);
        });
        return app;
    };
});
//# sourceMappingURL=detail.js.map
;
'use strict';
/**
 * author           xj
 * @date            2016-09-27 14:29:00
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/application-detail/index',['require','exports','module','./js/detail'],function(require, exports, module) {
    require('./js/detail')({});
});


(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('@-webkit-keyframes ngdialog-fadeout{0%{opacity:1}100%{opacity:0}}@keyframes ngdialog-fadeout{0%{opacity:1}100%{opacity:0}}@-webkit-keyframes ngdialog-fadein{0%{opacity:0}100%{opacity:1}}@keyframes ngdialog-fadein{0%{opacity:0}100%{opacity:1}}.ngdialog{box-sizing:border-box}.ngdialog *,.ngdialog :after,.ngdialog :before{box-sizing:inherit}.ngdialog{position:fixed;overflow:auto;-webkit-overflow-scrolling:touch;z-index:10000;top:0;right:0;bottom:0;left:0}.ngdialog.ngdialog-disabled-animation,.ngdialog.ngdialog-disabled-animation .ngdialog-content,.ngdialog.ngdialog-disabled-animation .ngdialog-overlay{-webkit-animation:none!important;animation:none!important}.ngdialog-overlay{position:fixed;background:rgba(0,0,0,.4);top:0;right:0;bottom:0;left:0;-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadein .5s;animation:ngdialog-fadein .5s}.ngdialog-no-overlay{pointer-events:none}.ngdialog.ngdialog-closing .ngdialog-overlay{-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadeout .5s;animation:ngdialog-fadeout .5s}.ngdialog-content{background:#fff;-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadein .5s;animation:ngdialog-fadein .5s;pointer-events:all}.ngdialog.ngdialog-closing .ngdialog-content{-webkit-backface-visibility:hidden;-webkit-animation:ngdialog-fadeout .5s;animation:ngdialog-fadeout .5s}.ngdialog-close:before{font-family:Helvetica,Arial,sans-serif;content:\'\\00D7\';cursor:pointer}body.ngdialog-open,html.ngdialog-open{overflow:initial}@-webkit-keyframes ngdialog-flyin{0%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes ngdialog-flyin{0%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@-webkit-keyframes ngdialog-flyout{0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}}@keyframes ngdialog-flyout{0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}}.ngdialog.ngdialog-theme-default{padding-bottom:160px;padding-top:160px}.ngdialog.ngdialog-theme-default.ngdialog-closing .ngdialog-content{-webkit-animation:ngdialog-flyout .5s;animation:ngdialog-flyout .5s}.ngdialog.ngdialog-theme-default .ngdialog-content{-webkit-animation:ngdialog-flyin .5s;animation:ngdialog-flyin .5s;background:#f0f0f0;border-radius:5px;color:#444;font-family:Helvetica,sans-serif;font-size:1.1em;line-height:1.5em;margin:0 auto;max-width:100%;padding:1em;position:relative;width:450px}.ngdialog.ngdialog-theme-default .ngdialog-close{padding:0;border:none;border-radius:5px;cursor:pointer;position:absolute;right:0;top:0}.ngdialog.ngdialog-theme-default .ngdialog-close:before{background:0 0;border-radius:3px;color:#bbb;content:\'\\00D7\';font-size:26px;font-weight:400;height:30px;line-height:26px;position:absolute;right:3px;text-align:center;top:3px;width:30px}.ngdialog.ngdialog-theme-default .ngdialog-close:active:before,.ngdialog.ngdialog-theme-default .ngdialog-close:hover:before{color:#777}.ngdialog.ngdialog-theme-default .ngdialog-message{margin-bottom:.5em}.ngdialog.ngdialog-theme-default .ngdialog-input{margin-bottom:1em}.ngdialog.ngdialog-theme-default .ngdialog-input input[type=email],.ngdialog.ngdialog-theme-default .ngdialog-input input[type=password],.ngdialog.ngdialog-theme-default .ngdialog-input input[type=text],.ngdialog.ngdialog-theme-default .ngdialog-input input[type=url],.ngdialog.ngdialog-theme-default .ngdialog-input textarea{background:#fff;border:0;border-radius:3px;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0 0 .25em;min-height:2.5em;padding:.25em .67em;width:100%}.ngdialog.ngdialog-theme-default .ngdialog-input input[type=email]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input input[type=password]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input input[type=text]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input input[type=url]:focus,.ngdialog.ngdialog-theme-default .ngdialog-input textarea:focus{box-shadow:inset 0 0 0 2px #8dbdf1;outline:0}.ngdialog.ngdialog-theme-default .ngdialog-buttons:after{content:\'\';display:table;clear:both}.ngdialog.ngdialog-theme-default .ngdialog-button{border:0;border-radius:3px;cursor:pointer;float:right;font-family:inherit;font-size:.8em;letter-spacing:.1em;line-height:1em;margin:0 0 0 .5em;padding:.75em 2em;text-transform:uppercase}.ngdialog.ngdialog-theme-default .ngdialog-button:focus{-webkit-animation:ngdialog-pulse 1.1s infinite;animation:ngdialog-pulse 1.1s infinite;outline:0}@media (max-width:568px){.ngdialog.ngdialog-theme-default .ngdialog-button:focus{-webkit-animation:none;animation:none}}.ngdialog.ngdialog-theme-default .ngdialog-button.ngdialog-button-primary{background:#3288e6;color:#fff}.ngdialog.ngdialog-theme-default .ngdialog-button.ngdialog-button-secondary{background:#e0e0e0;color:#777}.ngdialog.ngdialog-theme-plain{padding-bottom:160px;padding-top:160px}.ngdialog.ngdialog-theme-plain .ngdialog-content{background:#fff;color:#444;font-family:\'Helvetica Neue\',sans-serif;font-size:1.1em;line-height:1.5em;margin:0 auto;max-width:100%;padding:1em;position:relative;width:450px}.ngdialog.ngdialog-theme-plain .ngdialog-content h1,.ngdialog.ngdialog-theme-plain .ngdialog-content h2,.ngdialog.ngdialog-theme-plain .ngdialog-content h3,.ngdialog.ngdialog-theme-plain .ngdialog-content h4,.ngdialog.ngdialog-theme-plain .ngdialog-content h5,.ngdialog.ngdialog-theme-plain .ngdialog-content h6,.ngdialog.ngdialog-theme-plain .ngdialog-content li,.ngdialog.ngdialog-theme-plain .ngdialog-content p,.ngdialog.ngdialog-theme-plain .ngdialog-content ul{color:inherit}.ngdialog.ngdialog-theme-plain .ngdialog-close{cursor:pointer;position:absolute;right:0;top:0}.ngdialog.ngdialog-theme-plain .ngdialog-close:before{background:0 0;color:#bbb;content:\"\\00D7\";font-size:26px;font-weight:400;height:30px;line-height:26px;position:absolute;right:3px;text-align:center;top:3px;width:30px}.ngdialog.ngdialog-theme-plain .ngdialog-close:active:before,.ngdialog.ngdialog-theme-plain .ngdialog-close:hover:before{color:#777}.ngdialog.ngdialog-theme-plain .ngdialog-message{margin-bottom:.5em}.ngdialog.ngdialog-theme-plain .ngdialog-input{margin-bottom:1em}.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=email],.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=password],.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=text],.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=url],.ngdialog.ngdialog-theme-plain .ngdialog-input textarea{background:#f0f0f0;border:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0 0 .25em;min-height:2.5em;padding:.25em .67em;width:100%}.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=email]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=password]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=text]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input input[type=url]:focus,.ngdialog.ngdialog-theme-plain .ngdialog-input textarea:focus{box-shadow:inset 0 0 0 2px rgba(0,0,0,.2);outline:0}.ngdialog.ngdialog-theme-plain .ngdialog-buttons:after{clear:both;content:\'\';display:table}.ngdialog.ngdialog-theme-plain .ngdialog-button{border:0;cursor:pointer;float:right;font-family:inherit;font-size:.8em;letter-spacing:.1em;line-height:1em;margin:0 0 0 .5em;padding:.75em 2em;text-transform:uppercase}.ngdialog.ngdialog-theme-plain .ngdialog-button:focus{-webkit-animation:ngdialog-pulse 1.1s infinite;animation:ngdialog-pulse 1.1s infinite;outline:0}@media (max-width:568px){.ngdialog.ngdialog-theme-plain .ngdialog-button:focus{-webkit-animation:none;animation:none}}.ngdialog.ngdialog-theme-plain .ngdialog-button.ngdialog-button-primary{background:#3288e6;color:#fff}.ngdialog.ngdialog-theme-plain .ngdialog-button.ngdialog-button-secondary{background:#e0e0e0;color:#777}.i-img-layer{position:fixed;left:0;right:0;top:0;bottom:0;height:0;width:0;z-index:101;background:#000;opacity:0;transition:opacity .3s ease-in-out;}.i-img-layer.i-show{opacity:.6;height:100%;width:100%;}.i-img-tran.i-tran{transition:all .5s ease-in-out;}.i-img-tran.remove{opacity:.8;}@charset \"UTF-8\";.header:before,.header-right:before,.header:after,.header-right:after{content:\"\";display:table;}.header:after,.header-right:after{clear:both;}dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:\'...\\A..\\A.\';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.header{min-width:1100px;width:100%;height:70px;border-bottom:solid 1px #d4d6db;color:#262626;box-shadow:0 1px 2px 1px #f1f1f1;}.logo{margin-left:35px;line-height:70px;display:inline-block;background:url(/project/portals/i/logo.png?v=953c28) 0 center no-repeat;background-size:35px auto;font-size:22px;padding-left:41px;color:#262626;vertical-align:middle;cursor:pointer;text-decoration:none;}.logo:hover{text-decoration:none;color:#262626;}.header-list > li .p-dropdown,.header-right .msg .p-dropdown,.header-right .user .p-dropdown{display:block;position:absolute;width:160px;top:62px;left:50%;transition:transform 0.25s cubic-bezier(0.18,0.89,0.32,1.28);transform-origin:center top;transform:translate(-50%) scaleY(0);}.header-list > li:hover .p-dropdown,.header-right .msg:hover .p-dropdown,.header-right .wrap-user-img:hover .p-dropdown{transform:translate(-50%) scaleY(1);}.header-list{font-size:16px;display:inline-block;vertical-align:middle;margin-left:75px;list-style:none outside none;margin-bottom:0;}.header-list > li{padding:0 10px;margin-right:30px;float:left;line-height:70px;position:relative;cursor:pointer;}.header-list > li:last-child{margin-right:0;}.header-list > li:hover > a,.header-list > li.hover > a{color:#528be6;text-decoration:none;}.header-list > li:hover > i,.header-list > li.hover > i{left:0;right:0;}.header-list > li > a{transition:color .3s ease-out;color:#262626;display:block;text-align:center;line-height:70px;text-decoration:none;}.header-list > li > i{position:absolute;bottom:10px;left:50%;right:50%;height:4px;font-size:0;background-color:#528be6;transition-property:left,right;transition-duration:.3s;transition-timing-function:ease-out;}.header-right{line-height:70px;height:70px;font-size:0;margin-right:16px;float:right;}.header-right .msg{position:relative;color:#262626;line-height:70px;font-size:14px;float:left;cursor:pointer;}.header-right .msg a{text-decoration:none;color:#262626;}.header-right .msg b{font-weight:normal;color:#fa9027;margin-left:6px;}.header-right .wrap-user-img{float:left;}.header-right .wrap-user-img:hover .user:before{transform:rotate(-45deg);top:60%;}.header-right .wrap-img{float:left;height:70px;margin-left:46px;padding-top:15px;cursor:pointer;}.header-right .wrap-img img{vertical-align:top;border-radius:50%;width:40px;height:40px;}.header-right .user{padding-left:11px;margin-right:58px;cursor:pointer;position:relative;height:70px;float:left;}.header-right .user:before{content:\'\';display:block;width:8px;height:8px;border:solid #d8d8d8;border-width:2px 2px 0 0;position:absolute;top:50%;z-index:1;transform:rotate(135deg);}.header-right .user:before{right:-20px;margin-top:-5px;transition:all .3s linear;}.header-right .user .name{display:inline-block;vertical-align:middle;color:#343434;font-size:14px;}.p-dropdown{padding:6px 0;border-radius:8px;background-color:#ffffff;box-shadow:0 0 2px 2px #f1f1f1;position:relative;list-style:none outside none;z-index:1000;}.p-dropdown:before{content:\'\';position:absolute;top:-2px;left:50%;z-index:10;width:10px;height:10px;background-color:#fff;border:solid #f0f0f0;border-width:1px 0 0 1px;box-shadow:-1px -1px 2px #f1f1f1;transform:rotate(45deg) translate(-50%);}.p-dropdown > .list-item,.p-dropdown > li{color:#262626;font-size:14px;line-height:35px;padding:0 16px;}.p-dropdown > .list-item:hover,.p-dropdown > li:hover{background-color:#f5f5f5;}.p-dropdown > .list-item:last-child,.p-dropdown > li:last-child{border-radius:0 0 4px 4px;}.p-dropdown > .list-item:first-child,.p-dropdown > li:first-child{border-radius:4px 4px 0 0;}.p-dropdown > .list-item a,.p-dropdown > li a{color:#262626;}.p-dropdown > .list-item a:hover,.p-dropdown > li a:hover{color:#528be6;text-decoration:none;}.p-dropdown > .list-item > b,.p-dropdown > li > b{font-weight:normal;color:#fa8919;padding-right:8px;}@media (max-width:1000px){.header-list{margin-left:0;}.header-list > li{margin-right:15px;}}@media (max-width:1200px){.header-list{margin-left:0;}.header-list > li{margin-right:18px;}}@charset \"UTF-8\";dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:\'...\\A..\\A.\';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.p-loading-wrap{}@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}.p-loading-wrap .mask{height:100%;width:100%;background-color:#fff;position:absolute;left:0;top:0;z-index:1000;}.p-loading-wrap .loading-content{z-index:1001;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;width:100%;height:32px;line-height:32px;text-align:center;vertical-align:middle;}.p-loading-wrap .loading{position:relative;display:inline-block;width:32px;height:32px;vertical-align:middle;}.p-loading-wrap .loading:after{margin:12px 12px 0;display:block;content:\'\';width:3px;height:3px;border-radius:100%;box-shadow:0 -10px 0 1px #ccc,10px 0px #ccc,0 10px #ccc,-10px 0 #ccc,-7px -7px 0 0.5px #ccc,7px -7px 0 1.5px #ccc,7px 7px #ccc,-7px 7px #ccc;animation:spin 1s steps(8) infinite;}[uib-tooltip-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-bottom > .tooltip-arrow,[uib-popover-popup].popover.top-left > .arrow,[uib-popover-popup].popover.top-right > .arrow,[uib-popover-popup].popover.bottom-left > .arrow,[uib-popover-popup].popover.bottom-right > .arrow,[uib-popover-popup].popover.left-top > .arrow,[uib-popover-popup].popover.left-bottom > .arrow,[uib-popover-popup].popover.right-top > .arrow,[uib-popover-popup].popover.right-bottom > .arrow,[uib-popover-html-popup].popover.top-left > .arrow,[uib-popover-html-popup].popover.top-right > .arrow,[uib-popover-html-popup].popover.bottom-left > .arrow,[uib-popover-html-popup].popover.bottom-right > .arrow,[uib-popover-html-popup].popover.left-top > .arrow,[uib-popover-html-popup].popover.left-bottom > .arrow,[uib-popover-html-popup].popover.right-top > .arrow,[uib-popover-html-popup].popover.right-bottom > .arrow,[uib-popover-template-popup].popover.top-left > .arrow,[uib-popover-template-popup].popover.top-right > .arrow,[uib-popover-template-popup].popover.bottom-left > .arrow,[uib-popover-template-popup].popover.bottom-right > .arrow,[uib-popover-template-popup].popover.left-top > .arrow,[uib-popover-template-popup].popover.left-bottom > .arrow,[uib-popover-template-popup].popover.right-top > .arrow,[uib-popover-template-popup].popover.right-bottom > .arrow{top:auto;bottom:auto;left:auto;right:auto;margin:0;}[uib-popover-popup].popover,[uib-popover-html-popup].popover,[uib-popover-template-popup].popover{display:block !important;}.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}');
