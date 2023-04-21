define("normalize",{}),define("css",{load:function(t){throw new Error("Dynamic load not allowed: "+t)}}),define("css!modules/footer/css/footer",[],function(){}),define("css!common/goto-top/css/goto-top",[],function(){}),define("js/common/utils",["require","exports","module"],function(t,e,o){var n={isDate:function(t){return"[object Date]"==={}.toString.call(t)},pageName:function(){return location.href.replace(/\.html(.+)?/,"").split("/").pop()},getUrlData:function(t){var e=(t||location.href.replace(/#.*/g,"")).match(/\?(.*)/),o={};if(!(e=e&&e[1]))return o;e=e.split("&");var n,i;return e.forEach(function(t){t=t.split("="),n=decodeURIComponent(t[0]),i="null"===t[1]||null==t[1]?"":decodeURIComponent(t[1]),n&&(o[n]=i)}),o},getHashData:function(){return n.getUrlData(location.hash)},removeScriptTags:function(t){return t&&t.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"").replace(/<link\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/link>/gi,"")},getElOffset:function(t){if(!t)return console.log("elem is null"),{};var e=t.getBoundingClientRect(),o=document.body,n=document.documentElement;if(e.width||e.height||t.getClientRects().length){var i=window.pageYOffset||n.scrollTop||o.scrollTop,r=window.pageXOffset||n.scrollLeft||o.scrollLeft,c=n.clientTop||o.clientTop||0,s=n.clientLeft||o.clientLeft||0,l=e.top+i-c,a=e.left+r-s;return{top:Math.round(l),left:Math.round(a)}}return console.log("elem is hidde"),{}},getScroll:function(){var t=document.documentElement,e=document.body;return{left:(window.scrollX||window.pageXOffset||t.scrollLeft||e.scrollLeft)-(t.clientLeft||e.clientLeft||0),top:(window.scrollY||window.pageYOffset||t.scrollTop||e.scrollTop)-(t.clientTop||e.clientTop||0)}}};return n}),define("js/common/scroll-animation",["require","exports","module","./utils"],function(t,e,o){var n=t("./utils"),i=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)}}();return function(t,e,o){e=e||300;var r=n.getScroll().top,c=t-r,s=+new Date;(0|e)<100&&(e*=1e3);var l=function(){var t=+new Date-s;if(t=t>=e?e:t,window.scrollTo(0,r+t*c/e),t>=e)return void("function"==typeof o&&o());i(l)};l()}}),define("js/common/debounce",["require","exports","module"],function(t,e,o){return function(t,e){var o,n,i,r,c,s,l=function(){s=+new Date-r,s<e&&s>=0?o=setTimeout(l,e-s):(o=null,c=t.apply(i,n),o||(i=n=null))};return function(){return i=this,n=arguments,r=+new Date,o||(o=setTimeout(l,e)),c}}}),define("common/goto-top/goto-top",["require","exports","module","css!./css/goto-top.css","../../js/common/scroll-animation","../../js/common/utils","../../js/common/debounce"],function(t,e,o){t("css!./css/goto-top.css");var n=t("../../js/common/scroll-animation"),i=t("../../js/common/utils"),r=t("../../js/common/debounce"),c=function(t){var e="js-scroll-top-ing",o=function(){c.classList.contains(e)||(c.classList.add(e),n(0,t.time||.3,function(){c.classList.remove(e)}))},c=document.createElement("a");c.setAttribute("href","javascript:"),c.setAttribute("class","p-btn-scroll-top"),document.body.appendChild(c),c.addEventListener("click",o,!1),window.addEventListener("scroll",r(function(){c.classList[i.getScroll().top>300?"add":"remove"]("fadein")},50))};return function(t){"complete"===document.readyState||"loaded"===document.readyState||"interactive"===document.readyState?c(t):document.addEventListener("DOMContentLoaded",function(){c(t)},!1)}}),define("modules/footer/js/footer",["require","exports","module","css!../css/footer.css","../../../common/goto-top/goto-top"],function(t,e,o){t("css!../css/footer.css"),t("../../../common/goto-top/goto-top")({})}),function(t){var e=document,o="appendChild",n="styleSheet",i=e.createElement("style");i.type="text/css",e.getElementsByTagName("head")[0][o](i),i[n]?i[n].cssText=t:i[o](e.createTextNode(t))}('.footer{bottom:0;width:100%;background:#f0f0f0;}.footer .footer-container{display:flex;justify-content:center;align-items:center;padding-left:8%;}.footer .footer-item{height:150px;padding-top:15px;padding-right:15px;}.footer .footer-item--desc{margin:0;font-size:12px;color:#515151;line-height:24px;margin-bottom:0;}.footer .footer-item--title{margin-bottom:15px;font-size:20px;}.p-btn-scroll-top{display:flex;justify-content:center;align-items:center;height:50px;width:50px;right:30px;border-radius:5px;position:fixed;bottom:100px;z-index:10;box-shadow:0 0 10px rgba(0,0,0,0.05);overflow:hidden;text-indent:100%;white-space:nowrap;background-color:#528be6;visibility:hidden;opacity:0;transition:opacity .3s ease-out,visibility .3s ease-out,transform .3s ease-out;cursor:pointer;}.p-btn-scroll-top.fadein{opacity:.8;visibility:visible;}.p-btn-scroll-top.fadein:hover{opacity:1;background-color:#528be6;transform:translateY(-5px);}.p-btn-scroll-top:before{content:"";width:10px;height:10px;background-color:transparent;border:3px solid #fff;border-width:0 3px 3px 0;transform:translateY(3px) rotate(-135deg);}@media only screen and (max-width:1200px){.p-btn-scroll-top{height:40px;width:40px;}.p-btn-scroll-top:before{width:6px;height:6px;}}');