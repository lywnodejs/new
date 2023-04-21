import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Select } from 'antd';
import { queryLdapsByLdap } from '@/utils/api/formal';

const PersonSelect = props => {
  const [data, setData] = useState([]);
  // const [value, setValue] = useState(undefined);
  const [opts, setOpts] = useState([]);

  const handleSearch = _.debounce(value => {
    if (value) {
      queryLdapsByLdap({ ldap: value }).then(res => {
        setData(res.data);
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

  useEffect(() => {
    let ldapName = data.find(i => {
      return i.ldap == props.value;
    });
    props.value &&
      ldapName &&
      ldapName.name &&
      props.setManagerName &&
      props.setManagerName(ldapName.name);

    props.value && handleSearch(props.value);
  }, [props.value]);

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
      showSearch
      // value={value}
      defaultActiveFirstOption={false}
      placeholder="请输入上级账号"
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      style={{ width: '300px' }}
      dropdownMatchSelectWidth={300}
      options={opts}
      {..._.omit(props, ['setManagerName'])}
    ></Select>
  );
};

export default PersonSelect;
