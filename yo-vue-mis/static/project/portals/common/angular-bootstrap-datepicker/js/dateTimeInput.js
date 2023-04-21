define("common/angular-bootstrap-datepicker/js/dateTimeInput",["require","exports","module"],function(e,t,n){"use strict";function r(){return function(e,t,n){function r(e){return function(t){return angular.isUndefined(t)||""===t||null===t?null:e(t)}}function a(e){return o(e).toDate()}function o(e){return moment(e,t,moment.locale(),n)}function i(e){return moment.utc(e,t,moment.locale(),n).valueOf()}var u;switch(e){case"Date":u=r(a);break;case"moment":u=r(o);break;case"milliseconds":u=r(i);break;default:u=r(function(e){return function(t){return o(t).format(e)}}(e))}return u}}function a(e){function t(t,n,r,a){function o(e,t,n){return-1===["Date","moment","milliseconds",void 0].indexOf(e)&&n.indexOf(e)===t}function i(e,t){return!(!angular.isUndefined(t)&&""!==t&&null!==t)||moment(t,d,moment.locale(),s).isValid()}function u(e){return angular.isUndefined(e)||""===e||null===e?null:angular.isDate(e)?moment(e).format(l):angular.isNumber(e)?moment.utc(e).format(l):moment(e,f,moment.locale(),s).format(l)}function m(){function e(){return!0}function t(e,t){return t(e)}a.$viewValue=a.$formatters.filter(e).reverse().reduce(t,a.$modelValue),a.$render()}if(angular.isDefined(t.dateFormats)&&!angular.isString(t.dateFormats)&&!angular.isArray(t.dateFormats))throw new Error("date-formats must be a single string or an array of strings i.e. date-formats=\"['YYYY-MM-DD']\" ");if(angular.isDefined(r.modelType)&&(!angular.isString(r.modelType)||0===r.modelType.length))throw new Error('model-type must be "Date", "moment", "milliseconds", or a moment format string');var l=r.dateTimeInput||moment.defaultFormat,s=void 0===r.dateParseStrict||"true"===r.dateParseStrict,c=r.modelType||"Date",d=[r.dateTimeInput,c].concat(t.dateFormats).concat([moment.ISO_8601]).filter(o),f=[c].concat(d).filter(o);a.$parsers.unshift(e(c,d,s)),a.$formatters.push(u),a.$validators.dateTimeInput=i,n.bind("blur",m)}return{require:"ngModel",restrict:"A",scope:{dateFormats:"="},link:t}}angular.module("ui.dateTimeInput",[]).service("dateTimeParserFactory",r).directive("dateTimeInput",a),r.$inject=[],a.$inject=["dateTimeParserFactory"]});