import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Select } from 'antd';
import { queryByLdap } from '@/utils/api/company';

const PersonSelect = props => {
  const [data, setData] = useState([]);
  const [value, setValue] = useState();


  const handleSearch = _.debounce(value => {
    if (value) {
      queryByLdap({
        ldap: value,
        page: 1,
        size: 300
      }).then(res => {
        let data = _.get(res, 'data.ldapResults', []);
        if (Array.isArray(data)) {
          setData(data);
        }
        // setData(_.get(res, 'data.ldapResults', []));
        // if (res.data && res.data.ldapResults) {  // 上面为优化后的
        //   setData(res.data.ldapResults);
        // }
      });
    } else {
      setData([]);
    }
  }, 200);

  const handleChange = value => {
    setValue(value);
    props.setVal(value);
  };

  return (
    <Select
      labelInValue
      value={value}
      showSearch
      onSearch={handleSearch}
      onChange={handleChange}
      style={{ width: '380px' }}
      placeholder='请输入用户账号'
      allowClear
      defaultActiveFirstOption={false}
    >
      {
        data.map(d => (
          <Select.Option key={d.ldap} label={d.name} value={d.ldap} >{d.ldap + '-' + d.name}</Select.Option>
        ))
      }
    </Select >
  );
};

export default PersonSelect;
