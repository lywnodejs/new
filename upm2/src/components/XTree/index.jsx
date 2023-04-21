import React, { Component } from 'react';
import connect from '@utils/translateConnect';
import { Tree } from 'antd';
import _ from 'lodash';

const TreeNode = Tree.TreeNode;

class XTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoExpandParent: false, // 是否自动展开树，对“查询”和“手动展开”区分
      expandedKeys: [] // 展开项
    };
  }

  // 对子节点进行搜索
  searchEach(node, value) {
    let depth = this.getTreeDepth(node);
    let self = this;
    for (let i = 0; i < depth - 1; i++) {
      // 记录【删除不匹配搜索内容的叶子节点】操作的次数。
      // 如果这个变量记录的操作次数为0，表示树形结构中，所有的
      // 叶子节点(不包含只有根节点的情况)都匹配搜索内容。那么就没有必要再
      // 在循环体里面遍历树了.
      let spliceCounter = 0;

      // 遍历树形结构
      this.traverseTree(node, n => {
        if (self.isHasChildren(n)) {
          let children = n.children;
          let length = children.length;

          // 找到不匹配搜索内容的叶子节点并删除。为了避免要删除的元素在数组中的索引改变，从后向前循环,
          // 找到匹配的元素就删除。
          for (let j = length - 1; j >= 0; j--) {
            let e3 = children[j];
            if (!self.isHasChildren(e3) && e3.name.indexOf(value) <= -1) {
              children.splice(j, 1);
              spliceCounter++;
            }
          } // end for (let j = length - 1; j >= 0; j--)
        }
      }); // end this.traverseTree(node, n=>{

      // 所有的叶子节点都匹配搜索内容，没必要再执行循环体了。
      if (spliceCounter == 0) {
        break;
      }
    }
  }

  // 判断树形结构中的一个节点是否具有孩子节点
  isHasChildren(node) {
    let flag = false;
    if (node.children && node.children.length > 0) {
      flag = true;
    }
    return flag;
  }

  // 通过传入根节点获得树的深度，是 calDepth 的调用者。
  getTreeDepth(node) {
    if (undefined == node || null == node) {
      return 0;
    }
    // 返回结果
    let r = 0;
    // 树中当前层节点的集合。
    let currentLevelNodes = [node];
    // 判断当前层是否有节点
    while (currentLevelNodes.length > 0) {
      // 当前层有节点，深度可以加一。
      r++;
      // 下一层节点的集合。
      let nextLevelNodes = new Array();
      // 找到树中所有的下一层节点，并把这些节点放到 nextLevelNodes 中。
      for (let i = 0; i < currentLevelNodes.length; i++) {
        let e = currentLevelNodes[i];
        if (this.isHasChildren(e)) {
          nextLevelNodes = nextLevelNodes.concat(e.children);
        }
      }
      // 令当前层节点集合的引用指向下一层节点的集合。
      currentLevelNodes = nextLevelNodes;
    }
    return r;
  }

  // 非递归遍历树
  traverseTree(node, callback) {
    if (!node) {
      return;
    }
    var stack = [];
    stack.push(node);
    var tmpNode;
    while (stack.length > 0) {
      tmpNode = stack.pop();
      callback(tmpNode);
      if (tmpNode.children && tmpNode.children.length > 0) {
        for (let i = tmpNode.children.length - 1; i >= 0; i--) {
          stack.push(tmpNode.children[i]);
        }
      }
    }
  }

  /**
   * 裁剪树
   */
  getFilteredTree(sourceTreeData, filterName) {
    if (filterName == '') {
      return sourceTreeData;
    }
    const treeData = _.cloneDeep(sourceTreeData);
    let self = this;
    if (treeData && treeData.length > 0) {
      treeData.forEach(node => {
        self.searchEach(node, filterName);
      });

      // 没有叶子节点的根节点也要清理掉
      let length = treeData.length;
      for (let i = length - 1; i >= 0; i--) {
        let e2 = treeData[i];
        if (!this.isHasChildren(e2) && e2.name.indexOf(filterName) <= -1) {
          treeData.splice(i, 1);
        }
      }
    }
    return treeData;
  }

  /**
   * 勾选事件
   */
  onCheck = (checkedKeys, e) => {
    if (e.checkedNodesPositions) {
      // 根据pos属性，实现级联数据，下级数据去除
      const { checkedNodesPositions } = e;
      checkedNodesPositions.sort((a, b) => {
        return a.pos.split('-').length - b.pos.split('-').length;
      });
      const rstCheckedNodes = [];
      const isSub = checkedNode => {
        return rstCheckedNodes.some(rstCheckedNode => {
          const index = checkedNode.pos.indexOf(rstCheckedNode.pos);
          if (index === 0) {
            const nextIndex = rstCheckedNode.pos.length;
            if (
              checkedNode.pos[nextIndex] &&
              checkedNode.pos[nextIndex] === '-'
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        });
      };
      for (let i = 0; i < checkedNodesPositions.length; i++) {
        const checkedNode = checkedNodesPositions[i];
        if (i === 0 && rstCheckedNodes.length === 0) {
          rstCheckedNodes.push(checkedNode);
          continue;
        }
        !isSub(checkedNode) && rstCheckedNodes.push(checkedNode);
      }
      this.props.getRstCheckedNodes(rstCheckedNodes);
    } else {
      this.setState({
        expandedKeys: [+e.node.props.dataRef.id],
        autoExpandParent: true
      });

      // 确保Tree组件处于“级联状态”，再次触发onCheck事件
      this.props.resetFilterName().then(() => {
        e.node.props.context.onNodeCheck(e, e.node, e.checked);
        return;
      });
    }
  };

  /**
   * 选择事件
   */
  onSelect = (selectedKeys, info) => {
    this.props.getSelectedNode(info.node.props.dataRef);
  };

  /**
   * 展开操作
   */
  onExpand = expandedKeys => {
    // this.expandedKeyList = expandedKeys;
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };

  render() {
    const { treeData, filterName, checkedAreaList } = this.props;
    const externalCheckedAreaIdList = [];
    if (filterName) {
      const loop = nodes => {
        nodes.forEach(node => {
          externalCheckedAreaIdList.push(node.id);
          if (node.children && node.children.length > 0) {
            loop(node.children);
          }
        });
      };
      checkedAreaList.forEach(item => {
        if (item.children && item.children.length > 0) {
          loop(item.children);
        }
      });
    }
    const renderTreeNodes = treeData => {
      return treeData.map(item => {
        const index = item.name.indexOf(filterName);
        let title = null;
        if (index > -1) {
          const beforeStr = item.name.substr(0, index);
          const afterStr = item.name.substr(index + filterName.length);
          title = (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{filterName}</span>
              {afterStr}
            </span>
          );
        } else {
          title = <span>{item.name}</span>;
        }
        if (item.children) {
          return (
            <TreeNode
              title={title}
              key={item.id}
              dataRef={item}
              disableCheckbox={item.pid ? false : true}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={title}
            key={item.id}
            dataRef={item}
            disableCheckbox={item.pid ? false : true}
          />
        );
      });
    };
    return (
      <div className="x-tree">
        <Tree
          checkable
          checkStrictly={filterName === '' ? false : true}
          onExpand={this.onExpand}
          expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          onCheck={this.onCheck}
          checkedKeys={
            filterName === ''
              ? this.props.checkedKeys
              : [
                  ...new Set([
                    ...this.props.checkedKeys,
                    ...externalCheckedAreaIdList
                  ])
                ]
          }
          onSelect={this.onSelect}
          // selectedKeys={this.props.selectedKeys}
        >
          {renderTreeNodes(this.getFilteredTree(treeData, filterName))}
        </Tree>
      </div>
    );
  }
}

export default connect()(XTree);
