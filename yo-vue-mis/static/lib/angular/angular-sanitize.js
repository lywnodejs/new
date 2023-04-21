!function(e,t){"use strict";var n,r,i,a,o,s,l,c,u=t.$$minErr("$sanitize");t.module("ngSanitize",[]).provider("$sanitize",function(){function d(e,t){var n,r={},i=e.split(",");for(n=0;n<i.length;n++)r[t?o(i[n]):i[n]]=!0;return r}function h(e){return e.replace(/&/g,"&amp;").replace(g,function(e){return"&#"+(1024*(e.charCodeAt(0)-55296)+(e.charCodeAt(1)-56320)+65536)+";"}).replace(b,function(e){return"&#"+e.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}function p(t){for(;t;){if(t.nodeType===e.Node.ELEMENT_NODE)for(var n=t.attributes,r=0,i=n.length;r<i;r++){var a=n[r],o=a.name.toLowerCase();"xmlns:ns1"!==o&&0!==o.lastIndexOf("ns1:",0)||(t.removeAttributeNode(a),r--,i--)}var s=t.firstChild;s&&p(s),t=t.nextSibling}}var f=!1;this.$get=["$$sanitizeUri",function(e){return f&&r(L,E),function(t){var n=[];return l(t,c(n,function(t,n){return!/^unsafe:/.test(e(t,n))})),n.join("")}}],this.enableSvg=function(e){return a(e)?(f=e,this):f},n=t.bind,r=t.extend,i=t.forEach,a=t.isDefined,o=t.lowercase,s=t.noop,l=function(t,n){null===t||void 0===t?t="":"string"!=typeof t&&(t=""+t),m.innerHTML=t;var r=5;do{if(0===r)throw u("uinput","Failed to sanitize html because the input is unstable");r--,e.document.documentMode&&p(m),t=m.innerHTML,m.innerHTML=t}while(t!==m.innerHTML);for(var i=m.firstChild;i;){switch(i.nodeType){case 1:n.start(i.nodeName.toLowerCase(),function(e){for(var t={},n=0,r=e.length;n<r;n++){var i=e[n];t[i.name]=i.value}return t}(i.attributes));break;case 3:n.chars(i.textContent)}var a;if(!((a=i.firstChild)||(1===i.nodeType&&n.end(i.nodeName.toLowerCase()),a=i.nextSibling)))for(;null==a&&(i=i.parentNode)!==m;)a=i.nextSibling,1===i.nodeType&&n.end(i.nodeName.toLowerCase());i=a}for(;i=m.firstChild;)m.removeChild(i)},c=function(e,t){var r=!1,a=n(e,e.push);return{start:function(e,n){e=o(e),!r&&z[e]&&(r=e),r||!0!==L[e]||(a("<"),a(e),i(n,function(n,r){var i=o(r),s="img"===e&&"src"===i||"background"===i;!0!==N[i]||!0===T[i]&&!t(n,s)||(a(" "),a(r),a('="'),a(h(n)),a('"'))}),a(">"))},end:function(e){e=o(e),r||!0!==L[e]||!0===v[e]||(a("</"),a(e),a(">")),e==r&&(r=!1)},chars:function(e){r||a(h(e))}}};var m,g=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,b=/([^#-~ |!])/g,v=d("area,br,col,hr,img,wbr"),y=d("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),k=d("rp,rt"),x=r({},k,y),w=r({},y,d("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,section,table,ul")),C=r({},k,d("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),E=d("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,stop,svg,switch,text,title,tspan"),z=d("script,style"),L=r({},v,w,C,x),T=d("background,cite,href,longdesc,src,xlink:href"),D=d("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,tabindex,target,title,type,valign,value,vspace,width"),$=d("accent-height,accumulate,additive,alphabetic,arabic-form,ascent,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan",!0),N=r({},T,$,D);!function(e){var t;if(!e.document||!e.document.implementation)throw u("noinert","Can't create an inert html document");var n=((t=e.document.implementation.createHTMLDocument("inert")).documentElement||t.getDocumentElement()).getElementsByTagName("body");if(1===n.length)m=n[0];else{var r=t.createElement("html");m=t.createElement("body"),r.appendChild(m),t.appendChild(r)}}(e)}),t.module("ngSanitize").filter("linky",["$sanitize",function(e){var n=/((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i,r=/^mailto:/i,i=t.$$minErr("linky"),a=t.isDefined,o=t.isFunction,l=t.isObject,u=t.isString;return function(t,d,h){function p(e){e&&y.push(function(e){var t=[];return c(t,s).chars(e),t.join("")}(e))}if(null==t||""===t)return t;if(!u(t))throw i("notstring","Expected string but received: {0}",t);for(var f,m,g,b=o(h)?h:l(h)?function(){return h}:function(){return{}},v=t,y=[];f=v.match(n);)m=f[0],f[2]||f[4]||(m=(f[3]?"http://":"mailto:")+m),g=f.index,p(v.substr(0,g)),function(e,t){var n,r=b(e);y.push("<a ");for(n in r)y.push(n+'="'+r[n]+'" ');!a(d)||"target"in r||y.push('target="',d,'" '),y.push('href="',e.replace(/"/g,"&quot;"),'">'),p(t),y.push("</a>")}(m,f[0].replace(r,"")),v=v.substring(g+f[0].length);return p(v),e(y.join(""))}}])}(window,window.angular);