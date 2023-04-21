define("js/../../../lib/es6-promise/es6-promise",["require","exports","module"],function(e,n,t){"use strict";function o(e){return"function"==typeof e}function r(){var e=setTimeout;return function(){return e(i,1)}}function i(){for(var e=0;e<S;e+=2)(0,T[e])(T[e+1]),T[e]=void 0,T[e+1]=void 0;S=0}function s(e,n){var t=arguments,o=this,r=new this.constructor(c);void 0===r[O]&&w(r);var i=o._state;return i?function(){var e=t[i-1];R(function(){return _(i,r,e,o._result)})}():g(o,r,e,n),r}function a(e){if(e&&"object"==typeof e&&e.constructor===this)return e;var n=new this(c);return d(n,e),n}function c(){}function u(e){try{return e.then}catch(e){return M.error=e,M}}function l(e,n,t){n.constructor===e.constructor&&t===s&&n.constructor.resolve===a?function(e,n){n._state===k?p(e,n._result):n._state===I?h(e,n._result):g(n,void 0,function(n){return d(e,n)},function(n){return h(e,n)})}(e,n):t===M?h(e,M.error):void 0===t?p(e,n):o(t)?function(e,n,t){R(function(e){var o=!1,r=function(e,n,t,o){try{e.call(n,t,o)}catch(e){return e}}(t,n,function(t){o||(o=!0,n!==t?d(e,t):p(e,t))},function(n){o||(o=!0,h(e,n))},e._label);!o&&r&&(o=!0,h(e,r))},e)}(e,n,t):p(e,n)}function d(e,n){e===n?h(e,new TypeError("You cannot resolve a promise with itself")):function(e){return"function"==typeof e||"object"==typeof e&&null!==e}(n)?l(e,n,u(n)):p(e,n)}function f(e){e._onerror&&e._onerror(e._result),m(e)}function p(e,n){e._state===P&&(e._result=n,e._state=k,0!==e._subscribers.length&&R(m,e))}function h(e,n){e._state===P&&(e._state=I,e._result=n,R(f,e))}function g(e,n,t,o){var r=e._subscribers,i=r.length;e._onerror=null,r[i]=n,r[i+k]=t,r[i+I]=o,0===i&&e._state&&R(m,e)}function m(e){var n=e._subscribers,t=e._state;if(0!==n.length){for(var o=void 0,r=void 0,i=e._result,s=0;s<n.length;s+=3)o=n[s],r=n[s+t],o?_(t,o,r,i):r(i);e._subscribers.length=0}}function v(){this.error=null}function _(e,n,t,r){var i=o(t),s=void 0,a=void 0,c=void 0,u=void 0;if(i){if((s=function(e,n){try{return e(n)}catch(e){return N.error=e,N}}(t,r))===N?(u=!0,a=s.error,s=null):c=!0,n===s)return void h(n,new TypeError("A promises callback cannot return that same promise."))}else s=r,c=!0;n._state!==P||(i&&c?d(n,s):u?h(n,a):e===k?p(n,s):e===I&&h(n,s))}function w(e){e[O]=B++,e._state=void 0,e._result=void 0,e._subscribers=[]}function y(e,n){this._instanceConstructor=e,this.promise=new e(c),this.promise[O]||w(this.promise),A(n)?(this._input=n,this.length=n.length,this._remaining=n.length,this._result=new Array(this.length),0===this.length?p(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&p(this.promise,this._result))):h(this.promise,new Error("Array Methods must be provided an Array"))}function b(e){this[O]=B++,this._result=this._state=void 0,this._subscribers=[],c!==e&&("function"!=typeof e&&function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}(),this instanceof b?function(e,n){try{n(function(n){d(e,n)},function(n){h(e,n)})}catch(n){h(e,n)}}(this,e):function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}())}var j=void 0,A=j=Array.isArray?Array.isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)},S=0,x=void 0,D=void 0,R=function(e,n){T[S]=e,T[S+1]=n,2===(S+=2)&&(D?D(i):L())},q="undefined"!=typeof window?window:void 0,$=q||{},E=$.MutationObserver||$.WebKitMutationObserver,C="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),F="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,T=new Array(1e3),L=void 0;L=C?function(){return process.nextTick(i)}:E?function(){var e=0,n=new E(i),t=document.createTextNode("");return n.observe(t,{characterData:!0}),function(){t.data=e=++e%2}}():F?function(){var e=new MessageChannel;return e.port1.onmessage=i,function(){return e.port2.postMessage(0)}}():void 0===q&&"function"==typeof e?function(){try{var n=e("vertx");return void 0!==(x=n.runOnLoop||n.runOnContext)?function(){x(i)}:r()}catch(e){return r()}}():r();var O=Math.random().toString(36).substring(16),P=void 0,k=1,I=2,M=new v,N=new v,B=0;return y.prototype._enumerate=function(){for(var e=this.length,n=this._input,t=0;this._state===P&&t<e;t++)this._eachEntry(n[t],t)},y.prototype._eachEntry=function(e,n){var t=this._instanceConstructor,o=t.resolve;if(o===a){var r=u(e);if(r===s&&e._state!==P)this._settledAt(e._state,n,e._result);else if("function"!=typeof r)this._remaining--,this._result[n]=e;else if(t===b){var i=new t(c);l(i,e,r),this._willSettleAt(i,n)}else this._willSettleAt(new t(function(n){return n(e)}),n)}else this._willSettleAt(o(e),n)},y.prototype._settledAt=function(e,n,t){var o=this.promise;o._state===P&&(this._remaining--,e===I?h(o,t):this._result[n]=t),0===this._remaining&&p(o,this._result)},y.prototype._willSettleAt=function(e,n){var t=this;g(e,void 0,function(e){return t._settledAt(k,n,e)},function(e){return t._settledAt(I,n,e)})},b.all=function(e){return new y(this,e).promise},b.race=function(e){var n=this;return new n(A(e)?function(t,o){for(var r=e.length,i=0;i<r;i++)n.resolve(e[i]).then(t,o)}:function(e,n){return n(new TypeError("You must pass an array to race."))})},b.resolve=a,b.reject=function(e){var n=new this(c);return h(n,e),n},b._setScheduler=function(e){D=e},b._setAsap=function(e){R=e},b._asap=R,b.prototype={constructor:b,then:s,catch:function(e){return this.then(null,e)}},b.polyfill=function(){var e=void 0;if("undefined"!=typeof global)e=global;else if("undefined"!=typeof self)e=self;else try{e=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}var n=e.Promise;if(n){var t=null;try{t=Object.prototype.toString.call(n.resolve())}catch(e){}if("[object Promise]"===t&&!n.cast)return}e.Promise=b},b.Promise=b,b}),define("js/common/dialog/validateDialogForm",["require","exports","module","./../../../../../lib/es6-promise/es6-promise"],function(e,n,t){var o=e("./../../../../../lib/es6-promise/es6-promise");return function(e,n,t,r,i){return new o(function(o,s){!0!==n.sendDataing&&(angular.forEach(e.$error.required,function(e){e.$setTouched()}),t.showErrors=!0,r(function(){return i&&(document.querySelector(".ng-invalid")||Object.keys(e.$error).length)?(console.log(e),void s()):Object.keys(e.$error).length?(console.log(e),void s()):void o()}))})}}),define("js/common/dialog/showSuccessDialog",["require","exports","module"],function(e,n,t){var o={msg:"数据提交成功",content:"",time:0,timeout:0,width:450,data:{},successFn:function(){window.location.reload()}};return function(e,n,t){t=angular.extend({},o,t||{});var r=t.template||'<p class="success-lg-text i-tc">'+(t.msg||"")+"</p>"+(t.content?'<div style="text-align:center">'+t.content+"</div>":"")+'<div class="wrap-center-btn"> <button class="p-btn" ng-click="dialogConfirm()">确认</button> </div>',i=e.open({template:r,className:"ngdialog-theme-default p-dialog js-showSuccessDialog",plain:!0,width:t.width,showClose:!1,trapFocus:!1,overlay:!0,name:"showSuccessDialog",controller:["$scope","$timeout",function(e,o){var r=function(){i.closeEd||(i.closeEd=!0,i.close(),t.successFn(t.data))};e.dialogConfirm=r,n.$on("ngDialog.closed",function(e,n){n.hasClass("js-showSuccessDialog")&&r()}),t.timeout&&o(function(){r()},t.timeout)}]});return i.closeEd=!1,i}}),define("js/bug/send-data",["require","exports","module","./../../../../lib/es6-promise/es6-promise"],function(e,n,t){var o=e("./../../../../lib/es6-promise/es6-promise");return function(e,n,t,r,i){return r.sendDataing=!0,new o(function(o,i){e({method:"POST",url:n,data:t}).success(function(e){"0"===String(e.errno)&&(r.close(),o(e),r.sendDataing=!1)}).error(function(e){r.sendDataing=!1,i(e)})})}}),define("js/bug-detail/redirect-page",["require","exports","module"],function(e,n,t){return function(e){var n=location.href.replace(/[\?|#].+/,"").split("/").pop(),t=location.href.match(/\?.+/)[0],o="hole-edit.html"===n;!~[1,5].indexOf(e)?o?window.location.href="hole-detail.html"+t:location.reload():o?location.reload():window.location.href="hole-edit.html"+t}}),define("js/bug/dialog-ignore",["require","exports","module","../common/dialog/validateDialogForm","./../common/dialog/showSuccessDialog","./send-data","./../bug-detail/redirect-page"],function(e,n,t){var o,r=e("../common/dialog/validateDialogForm"),i=e("./../common/dialog/showSuccessDialog"),s=e("./send-data"),a=e("./../bug-detail/redirect-page");return function(e,n,t,c){var u=e.open({template:'\n                <form name="ignoreForm" class="p-form">\n                    <div class="p-form-item">\n                        <label class="p-12-percent"><span class="i-must">*</span>忽略原因：</label>\n                        <div class="wrap-input  p-col-8">\n                            <div class="wrap-input p-col-4"  ng-class="{\'p-error\':ignoreForm.reason1.$error.required && ignoreForm.reason1.$touched}">\n                                <select class="p-form-control" ng-required="true" name="reason1" \n                                    ng-model="ignoreReason1"\n                                    ng-change="ignoreReason1Change()"\n                                >\n                                    <option value="">请选择</option>\n                                    <option ng-repeat="option in reason1" value="{{option.id}}"> {{option.dName}}</option>\n                                </select>\n                                <span class="p-error-msg">请选择</span>\n                            </div>\n                            <span>--</span>\n                            <div class="wrap-input p-col-4" ng-class="{\'p-error\':ignoreForm.reason2.$error.required && ignoreForm.reason2.$touched}">\n                                <select class="p-form-control" ng-required="true" name="reason2"\n                                    ng-model="ignoreReason2"\n                                    ng-change="changeReason2()"\n                                >\n                                    <option value="">请选择</option>\n                                    <option ng-repeat="option in reason2" value="{{option.id}}"> {{option.dName}}</option>\n                                </select>\n                                <span class="p-error-msg">请选择</span>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="p-form-item form-flex" >\n                        <div class="wrap-input form-flex-item" ng-class="{\'p-error\': isRequireDesc && !desc}">\n                            <textarea class="p-form-control p-reason" name="desc" ng-required="isRequireDesc" ng-model="desc" maxlength="2000" placeholder="说明"></textarea>\n                            <span class="p-error-msg">请填写说明</span>\n                        </div>\n                    </div>\n                     <div class="wrap-center-btn">\n                        <a href="javascript:" class="p-btn" ng-click="pageAgree()">确认</a>\n                        <a href="javascript:" class="p-btn p-btn-gray" ng-click="dialogClose($event)">取消</a>\n                    </div>\n                </form>\n            ',className:"ngdialog-theme-default p-dialog",plain:!0,width:680,height:378,showClose:!0,overlay:!0,name:"showIgnore",controller:["$scope","$element","$timeout","$http","$rootScope",function(t,l,d,f,p){t.isRequireDesc=!1,t.dialogClose=function(e){e.stopImmediatePropagation(),u.close()},t.changeReason2=function(e){if(null!=t.ignoreReason2){var n=0|t.ignoreReason2;t.isRequireDesc=t.reason2.some(function(e){return e.id===n&&"其他"===e.dName})}},t.ignoreReason1Change=function(e){t.ignoreReason2=void 0,t.ignoreReason1&&f({method:"GET",url:"/dictionary/listByParentId/"+t.ignoreReason1}).success(function(e){0==e.errno&&(t.reason2=e.data)})},o?t.reason1=o:f({method:"GET",url:"/dictionary/listByParentId/1070"}).success(function(e){0==e.errno&&(t.reason1=o=e.data)}),t.pageAgree=function(){r(t.ignoreForm,u,t,d,!1).then(function(){s(f,n,{holeId:u.pageId,reason1:t.ignoreReason1,reason2:t.ignoreReason2,desc:t.desc,effectBiz:c.effectBiz,recurrentLevel:c.recurrentLevel,usedLevel:c.usedLevel,volumeLevel:c.volumeLevel,discoverLevel:c.discoverLevel,selfLevel:c.selfLevel,dsrcRemark:c.dsrcRemark},u).then(function(n){i(e,p,{msg:"忽略成功",successFn:function(){a(n.data.state)},timeout:2e3})})})}}]});u.pageId=t}});