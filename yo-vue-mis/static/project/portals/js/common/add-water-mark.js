define("js/common/add-water-mark",["require","exports","module"],function(e,t,r){return function(e){e.$on("init.user",function(){waterMark&&waterMark({systemId:"452",containerEl:document.querySelector(".content"),imgWidthDis:100,imgHeightDis:100,textStyle:"rgba(0,0,0,0.08)",userId:e.$user.name})})}});