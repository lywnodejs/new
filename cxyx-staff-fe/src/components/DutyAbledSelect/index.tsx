import React, { useEffect, useState } from 'react';
import { queryJobDutyList } from '@/utils/api/permission';
import { Response, IsApply } from '@/utils/constant';
import { renderOptionsByMap } from '@/utils/data';
import _ from 'lodash';

const DutyAbledSelect = props => {
  const [dataList, setDataList] = useState([]);

  const fetch = () => {
    queryJobDutyList.fetch().then(res => {
      if (res?.errno === Response.Success) {
        const dutyList = _.get(res, 'data', []);
        const dutyAbledList = dutyList.filter(
          row => row.isApply === IsApply.ApplyAbled,
        );
        setDataList(dutyAbledList);
      }
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  return renderOptionsByMap(dataList, 'jobDutyId', 'jobDutyName', props);
};

export default DutyAbledSelect;
