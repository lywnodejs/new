define("js/common/dialog/showSuccessDialog",["require","exports","module"],function(o,e,s){var t={msg:"数据提交成功",content:"",time:0,timeout:0,width:450,data:{},successFn:function(){window.location.reload()}};return function(o,e,s){s=angular.extend({},t,s||{});var n=s.template||'<p class="success-lg-text i-tc">'+(s.msg||"")+"</p>"+(s.content?'<div style="text-align:center">'+s.content+"</div>":"")+'<div class="wrap-center-btn"> <button class="p-btn" ng-click="dialogConfirm()">确认</button> </div>',c=o.open({template:n,className:"ngdialog-theme-default p-dialog js-showSuccessDialog",plain:!0,width:s.width,showClose:!1,trapFocus:!1,overlay:!0,name:"showSuccessDialog",controller:["$scope","$timeout",function(o,t){var n=function(){c.closeEd||(c.closeEd=!0,c.close(),s.successFn(s.data))};o.dialogConfirm=n,e.$on("ngDialog.closed",function(o,e){e.hasClass("js-showSuccessDialog")&&n()}),s.timeout&&t(function(){n()},s.timeout)}]});return c.closeEd=!1,c}}),define("js/application-detail/js/showSuccessDialog",["require","exports","module","./../../common/dialog/showSuccessDialog"],function(o,e,s){return o("./../../common/dialog/showSuccessDialog")});