define("common/err-src/err-img-src",["require","exports","module"],function(r,e,n){return function(r){r.directive("errSrc",function(){return{link:function(r,e,n){e.bind("error",function(){!0!==this.isError&&(this.isError=!0,angular.element(this).attr("src",n.errSrc))})}}})}});