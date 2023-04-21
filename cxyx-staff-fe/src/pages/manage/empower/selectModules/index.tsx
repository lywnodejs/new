import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { renderOptionsByMap } from '@/utils/data';
import { message, DatePicker, Select } from 'antd';
import {
  MODLESELECTDATA,
  PERMISSION_TYPE,
  STRATEGY_TYPE_DATA,
} from '../constant';

/**
 * 功能模块
 * @param props
 * @constructor
 */
export const ModleSelect = props => {
  const [dataList, setDataList] = useState(MODLESELECTDATA);

  return renderOptionsByMap(dataList, 'id', 'value', props);
};

/**
 * 策略类型组件
 * @param props
 * @constructor
 */
export const StrategyTypeSelect = props => {
  const [dataList, setDataList] = useState(STRATEGY_TYPE_DATA);
  return renderOptionsByMap(dataList, 'id', 'value', props);
};

/**
 * 权限类型下拉框
 * @param props
 * @constructor
 */
export const PermissionTypesSelect = props => {
  const [dataList, setDataList] = useState(PERMISSION_TYPE);
  return renderOptionsByMap(dataList, 'id', 'name', props);
};

/**
 * 权限ID选择框
 * @param props
 * @constructor
 */
export const PermissionIDSelect = props => {
  return (
    <>
      <Select
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Tags Mode"
        {...props}
      ></Select>
    </>
  );
};
