define("common/upload-excel/index",["require","exports","module"],function(e,i,n){return function(e,i){var n=document.querySelector(e);n&&n.addEventListener("change",function(e){if(this.files&&this.files.length){var n=this.files[0].name;(n.endsWith("xls")||n.endsWith("xlsx"))&&i(this.files[0])}})}});