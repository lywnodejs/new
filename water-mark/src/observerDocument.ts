/**
 * @author 熊建
 * @email xiongjian@didichuxing.com
 * @create date 2018-05-03 08:57:06
 * @modify date 2018-05-03 08:57:06
 * @desc [description]
 */

import MutationObserver from './utils/MutationObserver'
const observerDocument = (callback = () => { }) => {
    if (!MutationObserver) {
        return
    }
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
            switch (mutation.type) {
                case "attributes":
                case "characterData":
                    break;
                case "childList":
                    const {
                        addedNodes, removedNodes, target
                    } = mutation;

                    if (!addedNodes.length || !removedNodes.length) {
                        break;
                    }
                    const [removeNode = { nodeName: '' }] = removedNodes
                    const [addNode = { nodeName: '' }] = addedNodes
                    if (removeNode.nodeName === 'BODY' && addNode.nodeName === 'BODY' && target && target.nodeName === 'HTML') {
                        callback()
                    }
                    break;
            }
        });
    });
    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
        characterDataOldValue: false
    });
}

export default observerDocument;
