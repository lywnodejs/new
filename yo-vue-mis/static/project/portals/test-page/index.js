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

define('js/common/at',['require','exports','module','./observer','./throttle','./utils','./textarea-utils','./KEY'],function (require, exports, module) {
    var observer = require('./observer');
    var throttle = require('./throttle');
    var utils = require('./utils');
    var textareaUtils = window.textareaUtils = require('./textarea-utils');
    var KEY = require('./KEY');

    var insertAtCaret = textareaUtils.insertAtCaret;
    var getCaretPosition = textareaUtils.getCaretPosition;
    var getELPosition = utils.getElOffset;
    var matchStrReg = "([\@])([a-z/[A-Z0-9/\\]一-龥_-]{0,20})$";

    var renderToHtml = function () {
        var a = {
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "\\": "&#92;",
            "&": "&amp;",
            "'": "&#039;",
            "\r": "",
            "\n": "<br>",
            " ": '<span style="white-space:pre-wrap;"> </span>' //(navigator.userAgent.match(/.+(?:ie) ([\d.]+)/i) || [8])[1] < 8 ? ['<pre style="overflow:hidden;display:inline;', h, 'word-wrap:break-word;"> </pre>'].join("") : ['<span style="white-space:pre-wrap;', h, '"> </span>'].join("")
        };
        return function (b) {
            return b.replace(/(<|>|\"|\\|&|\'|\n|\r| )/g, function (key) {
                return a[key]
            });
        }
    }();

    return function (textareaEl) {
        var textearaPos = getELPosition(textareaEl);
        var textearaTmp = document.createElement('div');
        textearaTmp.classList.add('i-textarea-tip');
        textearaTmp.innerHTML = '<span data-type="before"></span><span data-type="flag"></span><span data-type="after"></span>';
        document.body.appendChild(textearaTmp);

        var txtTempStyle = textearaTmp.style;
        txtTempStyle.width = textareaEl.offsetWidth + 'px';
        txtTempStyle.height = textareaEl.offsetHeight + 'px';
        txtTempStyle.left = textearaPos.left + 'px';
        txtTempStyle.top = textearaPos.top + 18 + 'px';

        observer.on('text-resize-height', function (data) {
            txtTempStyle.height = data.height;
            txtTempStyle.overflowY = data.overflowY;
        });

        var beforeEL = textearaTmp.querySelector('[data-type="before"]');
        var flagEL = textearaTmp.querySelector('[data-type="flag"]');
        var afterEL = textearaTmp.querySelector('[data-type="after"]');
        var startPos;

        var analysisContent = function (e) {
            //keyup 的时候值处理left right
            if (e.type === 'keyup' && !~[KEY.LEFT, KEY.RIGHT].indexOf(e.which)) {
                return;
            }
            var value = textareaEl.value.replace(/\r/g, ""),
                selectPos = getCaretPosition(textareaEl);
            if (selectPos <= 0 || selectPos === startPos) {
                return;
            }
            startPos = selectPos;
            var beforeText = value.slice(0, selectPos),
                match = beforeText.match(new RegExp(matchStrReg));
            if (!match) {
                //隐藏auto
                observer.fire('hide-user-list');
                return
            }
            var afterText = value.slice(selectPos);
            beforeText = beforeText.slice(0, -match[0].length);
            cacheCurPos();
            updateContent(beforeText, match[1], match[2], afterText);
        }

        var updateContent = function (beforeText, at, atText, afterText) {
            beforeEL.innerHTML = renderToHtml(beforeText);
            flagEL.innerHTML = renderToHtml(at) || "&thinsp;";
            afterEL.innerHTML = renderToHtml([atText, afterText].join(""));
            observer.fire('show-user-list', atText, getELPosition(flagEL), textareaEl);
        };

        var insertText = function (user) {
            textareaEl.focus()
            var value = textareaEl.value.replace(/\r/g, ""),
                selectPos = (textareaEl.getAttribute('startPos') | 0) || getCaretPosition(textareaEl);

            var beforeText = value.slice(0, selectPos),
                match = beforeText.match(new RegExp(matchStrReg));
            var len = match && match[2] ? match[2].length : 0;
            textareaUtils.insertText(textareaEl, user.name + ' ', selectPos, len);
        };

        var cacheCurPos = function () {
            textareaEl.setAttribute("startPos", textareaUtils.getCaretPosition(textareaEl))
        }

        observer.on('insert-text', insertText);

        var checkInput = throttle(analysisContent, 200);
        //input mouseup event
        ['input', 'mouseup', 'keyup'].forEach(function (name) {
            textareaEl.addEventListener(name, checkInput);
        });

        textareaEl.addEventListener('blur', function () {
            setTimeout(function () {
                observer.fire('hide-user-list');
            }, 200);
        });
        textareaEl.addEventListener('mouseup', cacheCurPos);
        window.textareaEl = textareaEl;
    }

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
'use strict';
/**
 * author           xj
 * @date            2016-12-07 16:35:08
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/uploader',['require','exports','module'],function (require, exports, module) {
    return function (browseButton) {
        var uploader = new plupload.Uploader({
            browse_button: browseButton || "upload-file", //button id
            url: "http://tms.didichuxing.com/api/public/upload",
            runtimes: "html5",
            filters: {
                mime_types: [{
                    title: "img",
                    extensions: "jpg,jpeg,png,gif"
                }],
                max_file_size: "10mb"
            },
            multipart_params: {
                type: "img",
                compress: true,
                business_type: 'aegis'
            },
            multi_selection: false,
            dragdrop: true
        });
        uploader.init();

        // file added
        uploader.bind("FilesAdded", function (uploader, file) {
            uploader.start();
            console.log('开始上传！', uploader, file);
        });

        // file uploaded
        uploader.bind("FileUploaded", function (uploader, file, response) {
            console.log('FileUploaded', uploader, file, response);
            var data = JSON.parse(response.response);
            if (!data.success) {
                console.error(response);
                return;
            }
            var img = document.createElement('img');
            img.src = data.url;
            document.body.appendChild(img);
        });

        // progress event
        uploader.bind("UploadProgress", function (uploader, file) {
            console.log('UploadProgress', uploader, file);
        });

        uploader.bind("Error", function (uploader, error) {
            console.log('Error', uploader, error);
        });

        uploader.uploadImage = function (image) {
            uploader.addFile(image);
            uploader.start();
        };

        return uploader;
    }
});

'use strict';
/**
 * author           xj
 * @date            2016-12-07 16:35:08
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/drag-image',['require','exports','module'],function (require, exports, module) {
    var slice = Array.prototype.slice;
    var toArray = function (arr) {
        return slice.call(arr);
    };

    var isSupportDrag = function () {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();

    var checkEvent = function (event) {
        if (!event.dataTransfer || !event.dataTransfer.types || !event.dataTransfer.types.length || !~(toArray(event.dataTransfer.types).indexOf('Files'))) {
            return false;
        }
    };

    var checkImageType = function (type) {
        return !!~type.indexOf('image');
    };

    var stopEvent = function (e) {
        e.cancelBubble = true;
        e.returnValue = false;
        e.stopPropagation && e.stopPropagation();
        e.preventDefault && e.preventDefault();
        return e;
    };

    /*var getText = function (clipboardData) {
        return clipboardData && clipboardData.getData("text");
    };*/
    var initContainer = function (containerEl, uploadImage) {
        if (!isSupportDrag) {
            return;
        }

        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (eventName) {
            containerEl.addEventListener(eventName, function (e) {
                stopEvent(e);
            }, false);
        });

        ['dragover', 'dragenter'].forEach(function (eventName) {
            containerEl.addEventListener(eventName, function (e) {
                if (checkEvent(e) === false) {
                    return;
                }
                containerEl.classList.add('is-dragover');
            }, false);
        });

        ['dragleave', 'dragend', 'drop'].forEach(function (eventName) {
            containerEl.addEventListener(eventName, function (e) {
                if (checkEvent(e) === false) {
                    return;
                }
                containerEl.classList.remove('is-dragover');
            }, false);
        });

        containerEl.addEventListener('drop', function (e) {
            if (checkEvent(e) === false) {
                return;
            }
            stopEvent(e);
            var files = e.dataTransfer.files;
            var item = e.dataTransfer.items;
            if (item) {
                if (item.length > 1 || item.length === 0 || !checkImageType(item[0].type)) {
                    return;
                }
                uploadImage(files[0]);
            } else if (files && files.length && checkImageType(files[0].type)) {
                uploadImage(files[0]);
            }
        }, false);
    }



    return function (containerEl, uploadImage) {
        initContainer(containerEl, uploadImage)
    }
});

'use strict';
/**
 * author           xj
 * @date            2016-12-07 16:35:08
 * @email           littlebearbond@qq.com
 * @description
 */
define('js/common/paste-image',['require','exports','module'],function (require, exports, module) {
    var ua = navigator.userAgent;
    var browerIs = function (name) {
        return !!~ua.indexOf(name);
    };
    var isChrome = browerIs('Chrome');
    var isExplorer = browerIs('MSIE');
    var isFirefox = browerIs('Firefox');
    var isSafari = browerIs("Safari");
    var isOpera = !!~ua.toLowerCase().indexOf("op");
    if ((isChrome) && (isSafari)) {
        isSafari = false;
    }
    if ((isChrome) && (isOpera)) {
        isChrome = false;
    }

    var checkImageType = function (type) {
        return !!~type.indexOf('image');
    };

    var stopEvent = function (e) {
        e.cancelBubble = true;
        e.returnValue = false;
        e.stopPropagation && e.stopPropagation();
        e.preventDefault && e.preventDefault();
        return e;
    };

    var initInputPaste = function (inputEl, uploadImage) {
        var pasteCatcher;
        if (!window.Clipboard) {
            pasteCatcher = document.createElement("div");
            pasteCatcher.setAttribute("contenteditable", true);
            pasteCatcher.style.opacity = 0;
            pasteCatcher.style.height = 0;
            pasteCatcher.style.display = 'absolute';
            pasteCatcher.style.left = '-1000px';
            document.body.appendChild(pasteCatcher);
            /*document.addEventListener('paste', function (e) {
                pasteCatcher.focus();
                setTimeout(checkInput, 100);
            })*/
        }

        function checkInput() {
            var child = pasteCatcher.childNodes[0];
            if (!child) {
                return;
            }
            pasteCatcher.innerHTML = "";
            if (child.nodeType === 1 && child.tagName === "IMG" && child.src) {
                var img = document.createElement('img');
                img.src = child.src;
                document.body.appendChild(img);
            }
        }

        //只有chrome和safari做粘贴图片处理
        inputEl.addEventListener('paste', function (e) {
            var _clipboardData = e.clipboardData || e.originalEvent.clipboardData || window.clipboardData;
            if (!_clipboardData) {
                return;
            }
            var items = _clipboardData.items;
            // var text = getText(_clipboardData);
            if (!items) {
                //截图不行
                if (!_clipboardData.files.length || !checkImageType(_clipboardData.files[0].type)) {
                    return;
                }
                uploadImage(_clipboardData.files[0]);
                stopEvent(e);
                return;

            } else if (isChrome) {
                //chrome
                var items = _clipboardData.items;
                var item, hasImg = false;
                //items[0] text ;items[1] image
                if (items.length === 2 && items[0].kind === 'string' && checkImageType(items[1].type)) {
                    //直接拷贝图片文件进行粘贴
                    item = items[1];
                    hasImg = true;
                } else if (items.length > 1 || items.length === 0 || !checkImageType(items[0].type)) {
                    return;
                }
                if (!hasImg) {
                    //用qq截图
                    item = items[0];
                }
                if (!item) {
                    return;
                }
                if (item.kind === 'file' && checkImageType(item.type)) {
                    uploadImage(item.getAsFile());
                    stopEvent(e);
                }
            }
        }, false);
    }

    return function (inputEl, uploadImage) {
        initInputPaste(inputEl, uploadImage);
    }
});

define('js/common/upload-img',['require','exports','module','./uploader','./drag-image','./paste-image'],function (require, exports, module) {
    var uploader = require('./uploader');
    var dragImage = require('./drag-image');
    var pasteImage = require('./paste-image');
    var uploadImage = uploader().uploadImage;

    return function (containerEl, inputEl, opts) {
        dragImage(containerEl, uploadImage)
        pasteImage(inputEl, uploadImage);
    }
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
define('test-page/index',['require','exports','module','../js/common/textarea-height-auto','../js/common/validate-length','../js/common/at','../js/common/at-user-list','../js/common/upload-img','../modules/header/js/header'],function (require, exports, module) {
    var textareaHeightAuto = require('../js/common/textarea-height-auto');
    var validateLength = require('../js/common/validate-length');
    var at = require('../js/common/at');
    var userList = require('../js/common/at-user-list');
    var uploadImg = require('../js/common/upload-img');

    require('../modules/header/js/header');
    var app = angular.module('myApp', ['header']);

    var form = document.getElementById('js-form');
    var textareaEl = form.querySelector('textarea');

    //样式交互
    textareaEl.addEventListener('focus', () => {
        textareaEl.parentElement.classList.add('focus');
    });
    textareaEl.addEventListener('blur', () => {
        textareaEl.parentElement.classList.remove('focus');
    });

    //长度输入提示
    validateLength();
    //自动高度操作
    textareaHeightAuto(textareaEl);
    //at 操作
    at(textareaEl);
    //剪贴图片  拷贝图片  拖拽图片 按钮选择图片上传
    uploadImg(form, textareaEl);
    userList(app, textareaEl);

    app.controller('test-page', ['$scope', '$http', '$timeout',
        function ($scope, $http, $timeout) {

        }
    ]);
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['myApp']);
    });
});

(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('@charset \"UTF-8\";.header:before,.header-right:before,.header:after,.header-right:after{content:\"\";display:table;}.header:after,.header-right:after{clear:both;}dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:\'...\\A..\\A.\';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.header{min-width:1100px;width:100%;height:70px;border-bottom:solid 1px #d4d6db;color:#262626;box-shadow:0 1px 2px 1px #f1f1f1;}.logo{margin-left:35px;line-height:70px;display:inline-block;background:url(/project/portals/i/logo.png?v=953c28) 0 center no-repeat;background-size:35px auto;font-size:22px;padding-left:41px;color:#262626;vertical-align:middle;cursor:pointer;text-decoration:none;}.logo:hover{text-decoration:none;color:#262626;}.header-list > li .p-dropdown,.header-right .msg .p-dropdown,.header-right .user .p-dropdown{display:block;position:absolute;width:160px;top:62px;left:50%;transition:transform 0.25s cubic-bezier(0.18,0.89,0.32,1.28);transform-origin:center top;transform:translate(-50%) scaleY(0);}.header-list > li:hover .p-dropdown,.header-right .msg:hover .p-dropdown,.header-right .wrap-user-img:hover .p-dropdown{transform:translate(-50%) scaleY(1);}.header-list{font-size:16px;display:inline-block;vertical-align:middle;margin-left:75px;list-style:none outside none;margin-bottom:0;}.header-list > li{padding:0 10px;margin-right:30px;float:left;line-height:70px;position:relative;cursor:pointer;}.header-list > li:last-child{margin-right:0;}.header-list > li:hover > a,.header-list > li.hover > a{color:#528be6;text-decoration:none;}.header-list > li:hover > i,.header-list > li.hover > i{left:0;right:0;}.header-list > li > a{transition:color .3s ease-out;color:#262626;display:block;text-align:center;line-height:70px;text-decoration:none;}.header-list > li > i{position:absolute;bottom:10px;left:50%;right:50%;height:4px;font-size:0;background-color:#528be6;transition-property:left,right;transition-duration:.3s;transition-timing-function:ease-out;}.header-right{line-height:70px;height:70px;font-size:0;margin-right:16px;float:right;}.header-right .msg{position:relative;color:#262626;line-height:70px;font-size:14px;float:left;cursor:pointer;}.header-right .msg a{text-decoration:none;color:#262626;}.header-right .msg b{font-weight:normal;color:#fa9027;margin-left:6px;}.header-right .wrap-user-img{float:left;}.header-right .wrap-user-img:hover .user:before{transform:rotate(-45deg);top:60%;}.header-right .wrap-img{float:left;height:70px;margin-left:46px;padding-top:15px;cursor:pointer;}.header-right .wrap-img img{vertical-align:top;border-radius:50%;width:40px;height:40px;}.header-right .user{padding-left:11px;margin-right:58px;cursor:pointer;position:relative;height:70px;float:left;}.header-right .user:before{content:\'\';display:block;width:8px;height:8px;border:solid #d8d8d8;border-width:2px 2px 0 0;position:absolute;top:50%;z-index:1;transform:rotate(135deg);}.header-right .user:before{right:-20px;margin-top:-5px;transition:all .3s linear;}.header-right .user .name{display:inline-block;vertical-align:middle;color:#343434;font-size:14px;}.p-dropdown{padding:6px 0;border-radius:8px;background-color:#ffffff;box-shadow:0 0 2px 2px #f1f1f1;position:relative;list-style:none outside none;z-index:1000;}.p-dropdown:before{content:\'\';position:absolute;top:-2px;left:50%;z-index:10;width:10px;height:10px;background-color:#fff;border:solid #f0f0f0;border-width:1px 0 0 1px;box-shadow:-1px -1px 2px #f1f1f1;transform:rotate(45deg) translate(-50%);}.p-dropdown > .list-item,.p-dropdown > li{color:#262626;font-size:14px;line-height:35px;padding:0 16px;}.p-dropdown > .list-item:hover,.p-dropdown > li:hover{background-color:#f5f5f5;}.p-dropdown > .list-item:last-child,.p-dropdown > li:last-child{border-radius:0 0 4px 4px;}.p-dropdown > .list-item:first-child,.p-dropdown > li:first-child{border-radius:4px 4px 0 0;}.p-dropdown > .list-item a,.p-dropdown > li a{color:#262626;}.p-dropdown > .list-item a:hover,.p-dropdown > li a:hover{color:#528be6;text-decoration:none;}.p-dropdown > .list-item > b,.p-dropdown > li > b{font-weight:normal;color:#fa8919;padding-right:8px;}@media (max-width:1000px){.header-list{margin-left:0;}.header-list > li{margin-right:15px;}}@media (max-width:1200px){.header-list{margin-left:0;}.header-list > li{margin-right:18px;}}');
