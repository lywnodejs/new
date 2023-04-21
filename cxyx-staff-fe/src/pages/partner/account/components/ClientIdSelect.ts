import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { STATUS_SELECT } from '../constant';
import { renderOptionsByMap } from '@/utils/data'

/**
 * 实体名称选择组件，根据实体类型切换数据
 * @param props
 * @constructor
 */
const ClientIdSelect = props => {
  const [dataList, setDataList] = useState(props.List || []);

  useEffect(() => {
    setDataList(props.List);
  }, [props.List])
  return renderOptionsByMap(dataList, 'relEntity', 'orgName', props);
};

export default ClientIdSelect;
