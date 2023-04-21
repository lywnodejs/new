define("normalize",{}),define("css",{load:function(i){throw new Error("Dynamic load not allowed: "+i)}}),define("css!common/directive/loading/css/loading",[],function(){}),define("common/directive/loading/loading",["require","exports","module","css!./css/loading"],function(i,t,e){return i("css!./css/loading"),function(i){i.directive("loading",["$http","$rootScope",function(i,t){return{restrict:"E",replace:!0,scope:{loadingtext:"@?",isloading:"=",opacity:"@?"},template:['<div class="p-loading-wrap">','   <div class="mask" ng-style="{opacity:opacity}"></div>','   <div class="loading-content">','       <span class="loading"></span>',"       <span ng-cloak>{{loadingtext}}<dot></dot></span>","   </div>","</div>"].join(""),link:function(e,n,o){e.loadingtext=o.loadingtext||"数据加载中",e.opacity=o.opacity||1,e.isShowLoading=function(){return!0===e.isloading||i.pendingRequests.length>0&&!1!==t.showLoading},e.$watch(e.isShowLoading,function(i){n.css({display:i?"block":"none"})})}}}])}}),function(i){var t=document,e="appendChild",n="styleSheet",o=t.createElement("style");o.type="text/css",t.getElementsByTagName("head")[0][e](o),o[n]?o[n].cssText=i:o[e](t.createTextNode(i))}("@charset \"UTF-8\";dot{display:inline-block;height:1em;line-height:1;text-align:left;vertical-align:-.25em;overflow:hidden;}dot::before{display:block;content:'...\\A..\\A.';white-space:pre-wrap;animation:d-dot 2s infinite step-start both;}@keyframes d-dot{33%{transform:translateY(-2em);}66%{transform:translateY(-1em);}}html{min-width:1100px;}.p-loading-wrap{}@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}.p-loading-wrap .mask{height:100%;width:100%;background-color:#fff;position:absolute;left:0;top:0;z-index:1000;}.p-loading-wrap .loading-content{z-index:1001;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;width:100%;height:32px;line-height:32px;text-align:center;vertical-align:middle;}.p-loading-wrap .loading{position:relative;display:inline-block;width:32px;height:32px;vertical-align:middle;}.p-loading-wrap .loading:after{margin:12px 12px 0;display:block;content:'';width:3px;height:3px;border-radius:100%;box-shadow:0 -10px 0 1px #ccc,10px 0px #ccc,0 10px #ccc,-10px 0 #ccc,-7px -7px 0 0.5px #ccc,7px -7px 0 1.5px #ccc,7px 7px #ccc,-7px 7px #ccc;animation:spin 1s steps(8) infinite;}");