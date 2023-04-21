import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { message } from 'antd';
import { renderOptionsByMap } from '@/utils/data';
import { queryJobDutyList } from '@/utils/api/common';

/**
 * 工作职责
 * @param props
 * @constructor
 */
export const WorkSelect = props => {
  const [dataList, setDataList] = useState([]);

  const fetch = () => {
    queryJobDutyList().then(res => {
      if (res) {
        setDataList(_.get(res, 'data', []));
      } else {
        message.error(res.errmsg);
      }
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  return renderOptionsByMap(dataList, 'jobDutyId', 'jobDutyName', props);
};
