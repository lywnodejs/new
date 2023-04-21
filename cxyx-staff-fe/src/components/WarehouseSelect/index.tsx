import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { renderOptionsByMap } from '@/utils/data';
import { message } from 'antd';
import { getAllWarehouseList } from '@/utils/api/company';

/**
 * 仓库选择组件
 * @param props
 * @constructor
 */
const WarehouseSelect = props => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetch = () => {
    setLoading(true);
    getAllWarehouseList()
      .then(res => {
        if (res) {
          if (0 == res.errno) {
            setDataList(_.get(res, 'data', []));
          } else {
            message.error(res.errmsg);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);

  return renderOptionsByMap(dataList, 'newWarehouseCode', 'warehouseName', {
    loading,
    ...props,
  });
};

export default WarehouseSelect;
