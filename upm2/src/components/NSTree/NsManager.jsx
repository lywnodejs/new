/**
 * 管理节点空间
 * @param {ztreeNode} treeNode
 */
function NsManager(treeNode, seperator = '.') {
  this.treeNode = treeNode;
  this.name = treeNode.name;
  this.parent = treeNode.getParentNode();
  this.seperator = seperator;
}

NsManager.prototype = {
  constructor: NsManager,
  parents() {
    const list = [];
    let node = this.parent;
    while (node) {
      list.push(node.name);
      node = node.getParentNode();
    }
    return list;
  },
  parentsNodes() {
    return this.parents().join(this.seperator);
  },

  /**
   * 不带resource的节点路径
   * @return {String}
   */
  nodes() {
    const arr = this.parents();
    arr.unshift(this.name);
    return arr.join(this.seperator);
  },

  /**
   * 带resource的节点路径
   * @param  {String} resource
   * @return {String}
   */
  resNodes(resource) {
    const arr = this.parents();
    arr.unshift(this.name);
    if (resource) arr.unshift(resource);
    return arr.join(this.seperator);
  },

  /**
   * 返回产品线(倒数三级的为产品线)
   * @return {[type]}
   */
  prodLine() {
    const arr = this.parents();
    arr.unshift(this.name);
    while (arr.length > 3) {
      arr.shift();
    }
    return arr.join(this.seperator);
  },
};

export default NsManager;
