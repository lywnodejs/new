"use strict";define("js/common/drag-image",["require","exports","module"],function(e,n,r){var t=Array.prototype.slice,a=function(e){return t.call(e)},i=function(){var e=document.createElement("div");return("draggable"in e||"ondragstart"in e&&"ondrop"in e)&&"FormData"in window&&"FileReader"in window}(),d=function(e){if(!(e.dataTransfer&&e.dataTransfer.types&&e.dataTransfer.types.length&&~a(e.dataTransfer.types).indexOf("Files")))return!1},o=function(e){return!!~e.indexOf("image")},f=function(e){return e.cancelBubble=!0,e.returnValue=!1,e.stopPropagation&&e.stopPropagation(),e.preventDefault&&e.preventDefault(),e},s=function(e,n){i&&(["drag","dragstart","dragend","dragover","dragenter","dragleave","drop"].forEach(function(n){e.addEventListener(n,function(e){f(e)},!1)}),["dragover","dragenter"].forEach(function(n){e.addEventListener(n,function(n){!1!==d(n)&&e.classList.add("is-dragover")},!1)}),["dragleave","dragend","drop"].forEach(function(n){e.addEventListener(n,function(n){!1!==d(n)&&e.classList.remove("is-dragover")},!1)}),e.addEventListener("drop",function(e){if(!1!==d(e)){f(e);var r=e.dataTransfer.files,t=e.dataTransfer.items;if(t){if(t.length>1||0===t.length||!o(t[0].type))return;n(r[0])}else r&&r.length&&o(r[0].type)&&n(r[0])}},!1))};return function(e,n){s(e,n)}});