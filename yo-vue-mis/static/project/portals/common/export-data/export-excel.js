define("text",{load:function(t){throw new Error("Dynamic load not allowed: "+t)}}),define("text!common/export-data/tpl.html",[],function(){return'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html lang="en">\n\n<head>\n    <meta charset="UTF-8">\n    <title>${title}</title>\n</head>\n\n<body>\n    ${data}\n</body>\n\n</html>'}),define("common/export-data/index",["require","exports","module","text!./tpl.html"],function(t,e,n){var o=t("text!./tpl.html");return function(t,e,n){if(!t)return void console.trace("data is error");var r=o.replace("${data}",t).replace("${title}",e),a=URL.createObjectURL(new Blob([r],{type:"text/html"})),d=document.createElement("a");document.body.appendChild(d),d.download=e+"."+n,d.href=a,d.click(),setTimeout(function(){d.parentElement.removeChild(d)})}}),define("common/export-data/export-excel",["require","exports","module","./index"],function(t,e,n){var o=t("./index");return function(t,e,n){if(!t)return void console.log("data is error");var r=Object.keys(t.thead),a="<table> <thead> <tr>${thead}</tr> </thead> <tbody> ${tbody} </tbody></table>".replace("${thead}",Object.keys(t.thead).map(function(e){return"<th>"+t.thead[e]+"</th>"}).join("")).replace("${tbody}",t.tbody.map(function(t){return"<tr>"+r.map(function(e){return"<td>"+t[e]+"</td>"}).join("")+"</tr>"}).join(""));o(a,e,n)}});