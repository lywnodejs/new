import React from 'react';
import { Elements } from 'react-flow-renderer';

export const initialElements:Elements = [
  // nodes
  {
    id: 'inputData',
    data: {label: '处理数据'},
    type: 'inputNode',
    // sourcePosition: 'bottom',
    position: {x: 40, y: 40},
  },
  {
    id: 'featureModel',
    data: {label: '特征工程模型'},
    // targetPosition: 'top',
    // sourcePosition: 'bottom',
    position: {x: 40, y: 140},
  },
  {
    id: 'outputData',
    data: {label: '输出特征变量/维度'},
    type: 'outputNode',
    // targetPosition: 'top',
    position: {x: 40, y: 240},
  },
  // edges
  {
    id: 'inputData-featureModel',
    label: '输入',
    labelStyle: { fontWeight: 700 },
    source: 'inputData',
    target: 'featureModel',
    type: 'smoothstep',
    animated: true,
    // arrowHeadType: 'arrow',
  },
  {
    id: 'featureModel-outputData',
    label: '输出',
    labelStyle: { fontWeight: 700 },
    source: 'featureModel',
    target: 'outputData',
    type: 'smoothstep',
    animated: true,
    // arrowHeadType: 'arrow',
  },
];