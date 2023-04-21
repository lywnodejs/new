/**
 * 屏幕 <= 320 和 >=540 等比改变rem字号
 * Created by 1 on 2018/6/22.
 */
$(function(){

    // 小屏、大屏字号
    var doc = window.document,
        docEl = doc.documentElement,
        viewport = doc.querySelector('meta[name="viewport"]'),
        rem, dpr, time,
        zoomScale, zoomScaleNum, docWidth;
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

    //改变基准rem
    function _equalRatio() {
        rem = docWidth / 360 * 16;
        docEl.style.fontSize = rem + "px";
    }

    function _changeRem() {
        docWidth = docEl.getBoundingClientRect().width;
        if(docWidth == 0){
            docWidth = window.screen.availWidth;
        }
        if (docWidth / dpr >= 540) {
            docWidth = 540 * dpr;
            _equalRatio();
        }else if(docWidth / dpr <= 320) {
            docWidth = 320 * dpr;
            _equalRatio();
        }
    }

    _changeRem();
});
