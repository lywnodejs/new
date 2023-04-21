/**
 * 屏幕特殊尺寸
 * Created by 1 on 2019/4/26.
 */

$(function () {
    var doc = window.document,
        docEl = doc.documentElement,
        viewport = doc.querySelector('meta[name="viewport"]'),
        rem, dpr, time,
        zoomScale, zoomScaleNum, docWidth,
        rxhui_parameter = location.search.substring(1);     // 传参
    if (viewport){
        zoomScale = viewport.getAttribute("content").match(/initial\-scale=(["']?)([\d\.]+)\1?/);
        if(zoomScale){
            zoomScaleNum = parseFloat(zoomScale[2]);
            dpr = parseInt(1 / zoomScaleNum);
        }
    }
    if (!dpr && !zoomScaleNum) {
        var os = (window.navigator.appVersion.match(/android/gi), window.navigator.appVersion.match(/iphone/gi)),
            dpr = window.devicePixelRatio;
        dpr = os ? dpr >= 3 ? 3 : dpr >= 2 ? 2 : 1 : 1;
        // zoomScaleNum = 1 / dpr;
    }
    window.addEventListener("resize",
        function() {
            clearTimeout(time);
            time = setTimeout(_changeRem, 300);
        },false);

    function _equalRatio() {
        rem = docWidth / 360 * 16;
        docEl.style.fontSize = rem + "px";
    }

    function _changeRem() {
        if( rxhui_parameter == "other"){    //如果传参是other
            docWidth = 540 * dpr;
            _equalRatio();
        }
    }

    _changeRem();
});
