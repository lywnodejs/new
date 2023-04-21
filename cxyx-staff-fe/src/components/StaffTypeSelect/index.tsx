import React from 'react';
import { renderOptionsByMap } from '@/utils/data';
import { STAFF_TYPE_MAP } from '@/components/StaffTypeSelect/constant';

/**
 * 人员类型选择组件
 * @param props
 * @constructor
 */
const StaffTypeSelect = props => {
  return renderOptionsByMap(STAFF_TYPE_MAP, undefined, undefined, props);
};

export default StaffTypeSelect;
