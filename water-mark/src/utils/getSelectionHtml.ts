/**
 * 获取用户选中的文字
 */
export default function getSelectionHtml(): string {
    let html = "";
    if (typeof window.getSelection !== "undefined") {
        html = window.getSelection().toString()
        // let sel = window.getSelection();
        // console.log(window.getSelection().toString())
        // if (sel.rangeCount) {
        //     let container = document.createElement("div");
        //     let i = 0;
        //     let len = sel.rangeCount
        //     for (; i < len; ++i) {
        //         container.appendChild(sel.getRangeAt(i).cloneContents());
        //     }
        //     html = window.getSelection().toString();
        //     console.log(html)
        // }
    } else if ('selection' in document) {
        const doc = document as any;
        if (doc.selection.type === "Text") {
            html = doc.selection.createRange().text;
        }
    }
    return html;
}
