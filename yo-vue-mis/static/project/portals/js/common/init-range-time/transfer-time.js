define("js/common/init-range-time/keys",["require","exports","module"],function(e,n,r){return["postStartTime","postEndTime","expireStartTime","expireEndTime"]}),define("js/common/init-range-time/transfer-time",["require","exports","module","./keys"],function(e,n,r){var t=e("./keys");return function(e,n){return(n||t).forEach(function(n){e[n]&&(e[n]=new Date(e[n].replace(/T.+/,"")))}),e}});