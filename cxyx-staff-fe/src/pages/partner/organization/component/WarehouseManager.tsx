import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Select } from 'antd';
import { employeeQueryByLdap } from '@/utils/api/common';

const WarehouseManage = props => {
  const [data, setData] = useState([]);
  // const [value, setValue] = useState(undefined);
  const [opts, setOpts] = useState([]);

  useEffect(() => {
    // setData([props.data]);
    handleSearch(props.data)
  }, [props.data]);

  const handleSearch = _.debounce(value => {
    if (value) {
      employeeQueryByLdap({
        ldap: value,
        page: 1,
        size: 300
      }).then(res => {
        setData(_.get(res, 'data.ldapResults', []))
      });
    } else {
      setData([]);
    }
  }, 200);

  const handleChange = value => {
    let ldapName = data.find(i => {
      i.ldap == value;
    });
    props.setManagerName && props.setManagerName(ldapName);
    // setValue(value);
  };

  useEffect(() => {
    options();
  }, [data]);

  const options = () => {
    let opt = [];

    for (const key in data) {
      if (typeof data[key] === 'object') {
        opt.push({
          label: `${data[key]['ldap']} (${data[key]['name']})`,
          value: data[key]['ldap'],
        });
      }
    }
    setOpts(opt);
  };

  return (
    <Select
      options={opts}
      showSearch
      onSearch={handleSearch}
      onChange={handleChange}
      style={{ width: '380px' }}
      placeholder='请输入用户账号'
      defaultActiveFirstOption={false}
      {..._.omit(props, ['detailVal'])}
    ></Select>
  );
};

export default WarehouseManage;
