import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { renderOptionsByMap } from '@/utils/data';
import { message } from 'antd';
import { fetchJobTypeList } from '@/utils/api/staff';

/**
 * 岗位类型选择组件
 * @param props
 * @constructor
 */

interface IJobType {
  entityType?: string; // 根据实体类型筛选工作职责
  org?: string;
  disabled?: boolean;
  placeholder?: string;
}

const JobTypeSelect = (props: IJobType) => {
  const { entityType } = props;
  const [dataList, setDataList] = useState([]);
  const fetch = orgId => {
    fetchJobTypeList(orgId).then(res => {
      if (res) {
        if (0 == res.errno) {
          setDataList(_.get(res, 'data', []));
        } else {
          message.error(res.errmsg);
        }
      }
    });
  };

  useEffect(() => {
    fetch(props.org);
  }, [props.org]);

  return renderOptionsByMap(
    dataList.filter(item => (entityType ? entityType === item.bizType : true)),
    'jobTypeId',
    'jobTypeName',
    {
      style: { minWidth: 150 },
      ...props,
    },
  );
};

export default JobTypeSelect;
