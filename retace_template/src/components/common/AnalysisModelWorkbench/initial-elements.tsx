import React from 'react';
import { Elements, Position } from 'react-flow-renderer';

export const initialElements: Elements = [
  // node
  {
    id: 'node1',
    sourcePosition: Position.Right,
    type: 'input',
    className: 'dark-node',
    data: { label: '核心素养五育' },
    position: { x: 150, y: 250 },
  },
  {
    id: 'node2',
    targetPosition: Position.Left,
    type: 'output',
    data: { label: '身心健康——体' },
    position: { x: 450, y: 50 },
  },
  {
    id: 'node3',
    targetPosition: Position.Left,
    type: 'output',
    data: { label: '学业水平——智' },
    position: { x: 450, y: 150 },
  },
  {
    id: 'node4',
    targetPosition: Position.Left,
    type: 'output',
    data: { label: '德育——德' },
    position: { x: 450, y: 250 },
  },
  {
    id: 'node5',
    targetPosition: Position.Left,
    type: 'output',
    data: { label: '成长体验——劳' },
    position: { x: 450, y: 350 },
  },
  {
    id: 'node6',
    targetPosition: Position.Left,
    type: 'output',
    data: { label: '艺术素养——美' },
    position: { x: 450, y: 450 },
  },
  // edge
  {
    id: 'edge1',
    source: 'node1',
    target: 'node2',
    type: 'smoothstep',
    animated: true,
  },
  {
    id: 'edge2',
    source: 'node1',
    target: 'node3',
    type: 'smoothstep',
    animated: true,
  },
  {
    id: 'edge3',
    source: 'node1',
    target: 'node4',
    type: 'smoothstep',
    animated: true,
  },
  {
    id: 'edge4',
    source: 'node1',
    target: 'node5',
    type: 'smoothstep',
    animated: true,
  },
  {
    id: 'edge5',
    source: 'node1',
    target: 'node6',
    type: 'smoothstep',
    animated: true,
  },

];