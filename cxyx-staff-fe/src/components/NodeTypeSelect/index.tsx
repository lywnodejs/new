import React from 'react';
import { renderOptionsByMap } from '@/utils/data';
import { NODE_TYPE_MAP } from './constant';

/**
 * 节点类型选择组件
 * @param props
 * @constructor
 */
const NodeTypeSelect = props => {
  return renderOptionsByMap(NODE_TYPE_MAP, undefined, undefined, props);
};

export default NodeTypeSelect;
