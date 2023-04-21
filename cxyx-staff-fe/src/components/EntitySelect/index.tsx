import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { renderOptionsByMap } from '@/utils/data';
import { message } from 'antd';
import { queryOrganizationByType } from '@/utils/api/organization';

/**
 * 实体选择组件，根据实体类型切换数据
 * @param props
 * @constructor
 */
const EntitySelect = props => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { orgType, ...elseProps } = props;
  const fetch = orgType => {
    setLoading(true);

    queryOrganizationByType({ orgType })
      .then(res => {
        if (res) {
          if (0 == res.errno) {
            setDataList(_.get(res, 'data', []));
          } else {
            message.error(res.errmsg);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    orgType !== undefined && fetch(orgType);
  }, [orgType]);

  return renderOptionsByMap(dataList, 'relEntity', 'orgName', {
    ...elseProps,
    loading,
  });
};

export default EntitySelect;
