import { OTHERNAME } from '@/utils/constant';

/**
 * @description 判断职责是否为其他
 * @param dutyName 职责名称
 */
export const dutyIsOther = dutyName => {
  return OTHERNAME.includes(dutyName);
};

/**
 * @description 将树遍历成 antd tree 结构
 * @param tree tree 数据
 * @param keyField 对应 antd tree 的 value 字段
 * @param labelField 对应 antd tree 的 title 字段
 */
export function formatTree(tree, keyField, labelField) {
  const bfs = (treeData, key, label) => {
    for (const node of treeData) {
      node.value = node[key];
      node.title = node[label];
      if (node.children) {
        bfs(node.children, key, label);
      }
    }
    return tree;
  };
  return bfs(tree, keyField, labelField);
}
