!function(e,o){"use strict";function n(e,n,t){var i=t.baseHref(),r=e[0];return function(e,t,u){r.cookie=function(e,t,r){var u,c;c=(r=r||{}).expires,u=o.isDefined(r.path)?r.path:i,o.isUndefined(t)&&(c="Thu, 01 Jan 1970 00:00:00 GMT",t=""),o.isString(c)&&(c=new Date(c));var s=encodeURIComponent(e)+"="+encodeURIComponent(t);s+=u?";path="+u:"",s+=r.domain?";domain="+r.domain:"",s+=c?";expires="+c.toUTCString():"";var f=(s+=r.secure?";secure":"").length+1;return f>4096&&n.warn("Cookie '"+e+"' possibly not set or overflowed because it was too large ("+f+" > 4096 bytes)!"),s}(e,t,u)}}o.module("ngCookies",["ng"]).provider("$cookies",[function(){function e(e){return e?o.extend({},n,e):n}var n=this.defaults={};this.$get=["$$cookieReader","$$cookieWriter",function(n,t){return{get:function(e){return n()[e]},getObject:function(e){var n=this.get(e);return n?o.fromJson(n):n},getAll:function(){return n()},put:function(o,n,i){t(o,n,e(i))},putObject:function(e,n,t){this.put(e,o.toJson(n),t)},remove:function(o,n){t(o,void 0,e(n))}}}]}]),o.module("ngCookies").factory("$cookieStore",["$cookies",function(e){return{get:function(o){return e.getObject(o)},put:function(o,n){e.putObject(o,n)},remove:function(o){e.remove(o)}}}]),n.$inject=["$document","$log","$browser"],o.module("ngCookies").provider("$$cookieWriter",function(){this.$get=n})}(window,window.angular);