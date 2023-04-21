import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { renderOptionsByMap } from '@/utils/data';
import { message } from 'antd';
import { fetchCompanyIdList } from '@/utils/api/company';

/**
 * 公司选择组件
 * @param props
 * @constructor
 */
const CompanySelect = props => {
  const [dataList, setDataList] = useState([]);
  const fetch = () => {
    fetchCompanyIdList().then(res => {
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
    fetch();
  }, []);

  return renderOptionsByMap(dataList, 'companyId', 'companyName', props);
};

export default CompanySelect;
