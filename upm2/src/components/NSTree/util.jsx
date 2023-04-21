import $ from 'jquery';
/**
 * ns转换为treeNode
 * @param  {Obicet}   zTreeObj ztree 组件实例
 * @param  {String}   ns     节点空间，比如 "op.didi.com"
 * @param  {Function} callback 转换成功回调
 * @return {Object}   treeNode
 */
function getNodeByNS(zTreeObj, ns, callback, seperator = '.', depth = 1) {
  if (!ns) return null;
  const nsParts = ns.split(seperator).reverse();
  let part;
  // let depth = 3;
  let target;
  const parents = [];

  /* eslint-disable */
  let filter = function (node) {
    if (node.depth === depth && node.name === part) {
      depth++;
      parents.push(node);
      return true;
    } else {
      return false;
    }
  };


  while ((part = nsParts[depth - 1])) {
    target = zTreeObj.getNodesByFilter(filter, true, target);

    if (target === null) break;
  }

  if (target && typeof callback === 'function') callback(target, parents);
  /* eslint-enable */

  return target;
}

/**
 * 展开并选择指定节点
 * @param {Object} zTreeObj ztree 组件实例
 * @param {String} ns 节点空间，比如 "op.didi.com"
 */
function selectNode(zTreeObj, ns, seperator = '.', depth = 1) {

  return getNodeByNS(zTreeObj, ns, (targetNode, parents) => {
    zTreeObj.selectNode(targetNode);

    const $node = $(`#${targetNode.tId}_a`);

    if ($node.length) {
      $node.trigger('click');
    };
  }, seperator, depth);
}

/**
 * 只显示到服务节点，即 treeNode.category === "service" 的节点
 * @param {Object} zTreeObj ztree 组件示例
 */
function filterToService(zTreeObj) {
  const treeNodes = zTreeObj.getNodes();
  const willBeRemovedNodes = [];

  const hasServiceNode = treeNode => zTreeObj.getNodesByFilter(
    node => node.category === 'service',
    true,
    treeNode,
  );

  const traverse = treeNode => {
    if (treeNode.category === 'service') {
      /* eslint-disable no-param-reassign */
      treeNode.iconSkin = treeNode.iconSkin.replace(/parentNode/, 'leafNode');
      treeNode.isParent = false;
      treeNode.meta = 'leaf';
      /* eslint-enable no-param-reassign */
      zTreeObj.removeChildNodes(treeNode);
    } else if (hasServiceNode(treeNode)) {
      treeNode.children.forEach(node => traverse(node));
    } else {
      willBeRemovedNodes.push(treeNode);
    }
  };

  treeNodes.forEach(treeNode => {
    traverse(treeNode);
  });
  willBeRemovedNodes.forEach(node => zTreeObj.removeNode(node));
  zTreeObj.refresh();
}

export {
  getNodeByNS,
  selectNode,
  filterToService,
};
