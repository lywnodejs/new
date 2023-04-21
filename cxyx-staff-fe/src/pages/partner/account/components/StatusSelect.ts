import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { STATUS_SELECT } from '../constant';
import { renderOptionsByMap } from '@/utils/data'

/**
 * 实体选择组件，根据实体类型切换数据
 * @param props
 * @constructor
 */
const StatusSelect = props => {
  const [dataList, setDataList] = useState(STATUS_SELECT);

  return renderOptionsByMap(dataList, 'id', 'value', props);
};

export default StatusSelect;
