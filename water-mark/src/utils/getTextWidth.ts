/**
 * 获取文字的宽度
 * @param {String} txt
 * @param {Number} font
 */
export default function getTextWidth(txt: string, font: string): number {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(txt);
    canvas = null;
    return metrics.width;
};
