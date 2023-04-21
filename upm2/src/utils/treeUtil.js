import _ from 'lodash';
/**
 * 树的格式为:
[{
  label: 1, value: 1,
  children: [{
    label: 11, value: 11,
  }, {
    label: 12, value: 12,
    children: [{
      label: 121, value: 121,
      children: [...]
    }]
  }],
}, {
  label: 2, value: 2
}]
 * 构建后的结果为：
{
  1: [],
  2: [],
  11: [1],
  12: [1],
  121: [12, 1],
  ...
}
 */
const buildTreePath = (root) => {
  const pathMap = {};
  if (!root) {
    return pathMap;
  }

  const deepBuild = (children, parentPath) => {
    _.each(children, (child) => {
      const id = child.value;
      pathMap[id] = parentPath;
      deepBuild(child.children, [ id, ...parentPath ]);
    });
  };

  deepBuild(root, []);

  return pathMap;
};

/**
 * 在root数据里，所有节点上，加上parent属性，指向其父节点引用
 */
const patchNodeParent = (root) => {
  const idMap = {};
  if (!root) {
    return { root, idMap };
  }

  const patchParent = (node, parent) => {
    node.parent = parent;
    const key = node.value;
    idMap[key] = node;

    _.each(node.children, child => patchParent(child, node));
  };
  _.each(root, node => patchParent(node, null));

  return { root, idMap };
};

/**
 * 统计各个节点的 所有子节点 的节点个数
 * 树的格式为:
[{
  label: 1, value: 1,
  children: [{
    label: 11, value: 11,
  }, {
    label: 12, value: 12,
    children: [{
      label: 121, value: 121,
      children: [...]
    }]
  }],
}, {
  label: 2, value: 2
}]
 * 构建后的结果为：
{
  1: 3,
  2: 0,
  11: 0,
  12: 1,
  121: 0,
  ...
}
 */
const countChildrenNode = (root) => {
  const countMap = {};
  if (!root) {
    return countMap;
  }

  const deepCount = (node) => {
    const id = node.value;
    const children = node.children;

    countMap[id] = 0;
    _.each(children, (child) => {
      countMap[id] += deepCount(child);
    });
    return countMap[id] + 1;
  };
  _.each(root, node => deepCount(node));

  return countMap;
};
// 同 countChildrenNode
const patchChildrenCount = (root) => {
  if (!root) {
    return root;
  }

  const deepCount = (node) => {
    const { children } = node;

    let count = 0;
    _.each(children, (child) => {
      count += deepCount(child);
    });

    node.childrenCount = count;
    return count + 1;
  };
  _.each(root, node => deepCount(node));

  return root;
};

/**
 * 统计各个节点下，已经checked的节点个数
 * @param {*} checkedMap  checked的节点map
 * @param {*} treePath    父节点path路径
 */
const countCheckedChildrenNode = (checkedMap, idMap) => {
  const countMap = {};
  _.each(checkedMap, (checked, id) => {
    let parentNode = idMap[id].parent;
    while (!_.isNull(parentNode)) {
      const parentId = parentNode.value;
      countMap[parentId] = (countMap[parentId] || 0) + 1;
      parentNode = parentNode.parent;
    }
  });

  return countMap;
};
// 同 countCheckedChildrenNode
const patchCheckedChildrenCount = (checkedMap, idMap) => {
  _.each(checkedMap, (checked, id) => {
    let parentNode = idMap[id].parent;
    while (!_.isNull(parentNode)) {
      parentNode.childrenCheckedCount = (parentNode.childrenCheckedCount || 0) + 1;
      parentNode = parentNode.parent;
    }
  });
};

// 工具函数：把root下面的所有子节点，统一改变状态
const toggleCheckChildren = (root, checked, checkedMap) => {
  _.each(root.children, child => {
    const id = child.value;
    checkedMap[id] = checked;
    toggleCheckChildren(child, checked, checkedMap);
  });
};

// 针对每次的checked变化，把变化动态 向上、下 传播
const fixCheckedChange = (checkedMap, checkedCountMap, {node, checked}) => {
  const fixedMap = { ...checkedMap };
  if (checked) {
    // go up
    let curNode = node;
    while (curNode.parent) {
      const id = curNode.value;
      const parentNode = curNode.parent;
      const parentId = parentNode.value;

      let parentCheckedCount = checkedCountMap[parentId] || 0;
      let curCheckedCount = checkedCountMap[id] || 0;

      parentCheckedCount -= curCheckedCount;
      parentCheckedCount += curNode.childrenCount + 1;

      if (parentCheckedCount < parentNode.childrenCount) {
        break;
      }
      curNode = parentNode;
    }
    const id = curNode.value;
    fixedMap[id] = true;

    // go down
    toggleCheckChildren(curNode, false, fixedMap);
  }
  // unchecked
  else {
    const id = node.value;
    fixedMap[id] = false;

    let curNode = node;
    // go down
    toggleCheckChildren(curNode, false, fixedMap);

    // go up
    while (curNode.parent) {
      const parentId = curNode.parent.value;
      // 一直找，直到找到父节点check状态是false
      if (!checkedMap[parentId]) {
        break;
      }
      fixedMap[parentId] = false;
      curNode = curNode.parent;
    }
  }
  return fixedMap;
};

// 压缩 checkedMap，把全选节点的子节点 去掉
const zipCheckedMap = (checkedMap, idMap) => {
  // 类似于 toggleCheckChildren false，不同的是：有一步判断优化，避免重复遍历
  const uncheckChildren = (root) => {
    _.each(root, (node) => {
      const id = node.value;
      if (checkedMap[id]) {
        checkedMap[id] = false;
        uncheckChildren(node.children);
      }
    });
  };

  _.each(checkedMap, (checked, id) => {
    if (checked) {
      uncheckChildren(idMap[id].children);
    }
  });
};

// 解压缩 checkedMap，把全选节点的子节点 补上
const unzipCheckedMap = (checkedMap, idMap) => {
  const fixedMap = { ...checkedMap };

  // go up 向上更新父节点是否需要checked
  // go up-1 更新父节点的 已checked child的数量
  const countMap = {};
  _.each(checkedMap, (checked, id) => {
    let curNode = idMap[id];
    while (curNode.parent) {
      const parentNode = curNode.parent;
      const parentId = parentNode.value;
      // 防止脏数据，即父节点已经true了，checkedMap里还有其子节点的true
      if (checkedMap[parentId]) {
        break;
      }
      countMap[parentId] = countMap[parentId] || 0;
      countMap[parentId] += curNode.childrenCount + 1;

      if (countMap[parentId] < parentNode.childrenCount) {
        break;
      }
      curNode = parentNode;
    }
  });

  // go up-2 校验各个更新的父节点，自身是否需要checked
  _.each(countMap, (count, id) => {
    // 已经checked的子节点数量 === 其所有的子节点数量，则其应该被true
    if (count === idMap[id].childrenCount) {
      fixedMap[id] = true;
    }
  });

  // go down 把已经true的节点的所有子节点 也true
  _.each(fixedMap, (checked, id) => {
    let curNode = idMap[id];
    // TODO 优化：已经更新的子树，不需要重复更新
    toggleCheckChildren(curNode, true, fixedMap);
  });

  return fixedMap;
};

/**
 * 深度优先遍历树，对于每个节点，执行func
 */
const dfs = (nodes, func) => {
  _.each(nodes, node => {
    func && func(node);
    dfs(node.children, func);
  });
};

export {
  buildTreePath,
  patchNodeParent,

  patchChildrenCount, patchCheckedChildrenCount,
  countChildrenNode, countCheckedChildrenNode,

  fixCheckedChange,
  zipCheckedMap, unzipCheckedMap,

  dfs,
};
