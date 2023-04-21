import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { renderOptionsByMap } from '@/utils/data';
import { message, DatePicker } from 'antd';
import { MODLESELECTDATA } from '../constant';

/**
 * 功能模块
 * @param props
 * @constructor
 */
export const ModleSelect = props => {
  const [dataList, setDataList] = useState(MODLESELECTDATA);

  return renderOptionsByMap(dataList, 'name', 'name', props);
};

/**
 * 操作时间
 * @param props
 * @constructor
 */
export const TimeSelect = props => {
  return (
    <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" {...props} />
  );
};
