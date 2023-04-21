import React from 'react';
import { renderOptionsByMap } from '@/utils/data';
import { RISK_LEVEL_MAP } from './constant';

/**
 * 节点类型选择组件
 * @param props
 * @constructor
 */
const RiskLevelSelect = props => {
  return renderOptionsByMap(
    RISK_LEVEL_MAP,
    'riskLevel',
    'riskLevelName',
    props,
  );
};

export default RiskLevelSelect;
