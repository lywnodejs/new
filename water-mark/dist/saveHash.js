(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["waterMark"] = factory();
	else
		root["waterMark"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./iframe/js/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./iframe/js/index.ts":
/*!****************************!*\
  !*** ./iframe/js/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _readCookie = __webpack_require__(/*! ../../src/utils/readCookie */ \"./src/utils/readCookie.ts\");\n\nvar _readCookie2 = _interopRequireDefault(_readCookie);\n\nvar _createCookie = __webpack_require__(/*! ../../src/utils/createCookie */ \"./src/utils/createCookie.ts\");\n\nvar _createCookie2 = _interopRequireDefault(_createCookie);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n/**\n * @author 熊建\n * @email xiongjian@didichuxing.com\n * @create date 2018-05-03 03:54:25\n * @modify date 2018-05-03 03:54:25\n * @desc [description]\n */\nvar SAVE_KEY = 'water-mark-hash';\nvar SAVE_OLD_HASH = 'water-mark-old-endhash';\n/**\n * 用于隐藏浏览器指纹数据\n */\nwindow.addEventListener('message', function (_ref) {\n    var source = _ref.source,\n        _ref$data = _ref.data,\n        data = _ref$data === undefined ? {} : _ref$data;\n\n    //接受父级页面传过来的指纹\n    if (source !== window.parent) {\n        return;\n    }\n    var userHash = data.userHash,\n        oldEndHash = data.oldEndHash;\n\n    userHash && (0, _createCookie2.default)(SAVE_KEY, userHash, 360);\n    oldEndHash && (0, _createCookie2.default)(SAVE_OLD_HASH, oldEndHash, 360);\n}, false);\n//把指纹发送到父级页面\nwindow.parent && window.parent.postMessage({\n    userHash: (0, _readCookie2.default)(SAVE_KEY) || '',\n    oldEndHash: (0, _readCookie2.default)(SAVE_OLD_HASH) || ''\n}, \"*\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9pZnJhbWUvanMvaW5kZXgudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93YXRlck1hcmsvLi9pZnJhbWUvanMvaW5kZXgudHM/NWUwYyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBhdXRob3Ig54aK5bu6XG4gKiBAZW1haWwgeGlvbmdqaWFuQGRpZGljaHV4aW5nLmNvbVxuICogQGNyZWF0ZSBkYXRlIDIwMTgtMDUtMDMgMDM6NTQ6MjVcbiAqIEBtb2RpZnkgZGF0ZSAyMDE4LTA1LTAzIDAzOjU0OjI1XG4gKiBAZGVzYyBbZGVzY3JpcHRpb25dXG4gKi9cbmltcG9ydCByZWFkQ29va2llIGZyb20gJy4uLy4uL3NyYy91dGlscy9yZWFkQ29va2llJztcbmltcG9ydCBjcmVhdGVDb29raWUgZnJvbSAnLi4vLi4vc3JjL3V0aWxzL2NyZWF0ZUNvb2tpZSc7XG5cbmNvbnN0IFNBVkVfS0VZID0gJ3dhdGVyLW1hcmstaGFzaCdcbmNvbnN0IFNBVkVfT0xEX0hBU0ggPSAnd2F0ZXItbWFyay1vbGQtZW5kaGFzaCdcblxuLyoqXG4gKiDnlKjkuo7pmpDol4/mtY/op4jlmajmjIfnurnmlbDmja5cbiAqL1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoeyBzb3VyY2UsIGRhdGEgPSB7fSB9KSA9PiB7XG5cbiAgICAvL+aOpeWPl+eItue6p+mhtemdouS8oOi/h+adpeeahOaMh+e6uVxuICAgIGlmIChzb3VyY2UgIT09IHdpbmRvdy5wYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB7IHVzZXJIYXNoLCBvbGRFbmRIYXNoIH0gPSBkYXRhO1xuICAgIHVzZXJIYXNoICYmIGNyZWF0ZUNvb2tpZShTQVZFX0tFWSwgdXNlckhhc2gsIDM2MClcbiAgICBvbGRFbmRIYXNoICYmIGNyZWF0ZUNvb2tpZShTQVZFX09MRF9IQVNILCBvbGRFbmRIYXNoLCAzNjApXG59LCBmYWxzZSk7XG5cbi8v5oqK5oyH57q55Y+R6YCB5Yiw54i257qn6aG16Z2iXG53aW5kb3cucGFyZW50ICYmIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2Uoe1xuICAgIHVzZXJIYXNoOiByZWFkQ29va2llKFNBVkVfS0VZKSB8fCAnJyxcbiAgICBvbGRFbmRIYXNoOiByZWFkQ29va2llKFNBVkVfT0xEX0hBU0gpIHx8ICcnLFxufSwgXCIqXCIpO1xuIl0sIm1hcHBpbmdzIjoiOztBQU9BO0FBQ0E7OztBQUFBO0FBQ0E7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFFQTs7O0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFBQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFGQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./iframe/js/index.ts\n");

/***/ }),

/***/ "./src/utils/createCookie.ts":
/*!***********************************!*\
  !*** ./src/utils/createCookie.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.default = createCookie;\n/**\n * 写入cookie\n * @param {String} name\n * @param {String} value\n * @param {Number} days\n */\nfunction createCookie(name, value, days) {\n    var expires = \"\";\n    if (days) {\n        var date = new Date();\n        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);\n        expires = \"; expires=\" + date.toUTCString();\n    }\n    document.cookie = name + \"=\" + value + expires + \"; path=/\";\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdXRpbHMvY3JlYXRlQ29va2llLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2F0ZXJNYXJrLy4vc3JjL3V0aWxzL2NyZWF0ZUNvb2tpZS50cz81NzEyIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICog5YaZ5YWlY29va2llXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAcGFyYW0ge051bWJlcn0gZGF5c1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDb29raWUobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLCBkYXlzOiBudW1iZXIpIHtcbiAgICB2YXIgZXhwaXJlcyA9IFwiXCI7XG4gICAgaWYgKGRheXMpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTtcbiAgICAgICAgZXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiICsgZGF0ZS50b1VUQ1N0cmluZygpO1xuICAgIH1cbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyB2YWx1ZSArIGV4cGlyZXMgKyBcIjsgcGF0aD0vXCI7XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7O0FBTUE7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/utils/createCookie.ts\n");

/***/ }),

/***/ "./src/utils/readCookie.ts":
/*!*********************************!*\
  !*** ./src/utils/readCookie.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.default = readCookie;\n/**\n * cookie读取\n * @param {String} name\n */\nfunction readCookie(name) {\n    var nameEQ = name + \"=\";\n    var ca = document.cookie.split(';');\n    for (var i = 0; i < ca.length; i++) {\n        var c = ca[i];\n        while (c.charAt(0) === ' ') {\n            c = c.substring(1, c.length);\n        }\n        if (c.indexOf(nameEQ) === 0) {\n            return c.substring(nameEQ.length, c.length);\n        }\n    }\n    return null;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdXRpbHMvcmVhZENvb2tpZS50cy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovL3dhdGVyTWFyay8uL3NyYy91dGlscy9yZWFkQ29va2llLnRzP2U2YzEiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBjb29raWXor7vlj5ZcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlYWRDb29raWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICB2YXIgbmFtZUVRID0gbmFtZSArIFwiPVwiO1xuICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGMgPSBjYVtpXTtcbiAgICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIHtcbiAgICAgICAgICAgIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGMuaW5kZXhPZihuYW1lRVEpID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7OztBQUlBOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/utils/readCookie.ts\n");

/***/ })

/******/ });
});