import hljs from 'highlight.js';
import 'highlight.js/styles/googlecode.css'

function highlight(el) {
    let blocks = el.querySelectorAll('pre code');

    // setTimeout(() => {
        blocks.forEach((block) => {
            hljs.highlightBlock(block)
        })

    // }, 200)
}
export {highlight}
