import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Select } from 'antd';
import { selectEmployeeByLdap } from '@/utils/api/internals';

const JurisdictionPersonSelect = props => {
  const [data, setData] = useState([]);
  const [Value, setValue] = useState(undefined);
  const [opts, setOpts] = useState([]);

  useEffect(() => {

    // setOpts(props.setOpts);
    setData(props.data)
  }, [props.data]);

  const handleSearch = _.debounce(value => {
    if (value) {
      selectEmployeeByLdap({
        ldap: value
      }).then(res => {
        setData(_.get(res, 'data.employees'))
      });
    } else {
      setData([]);
    }
  }, 200);

  const handleChange = value => {
    // let ldapName = data.find(i => {
    //   i.ldap == value;
    // });
    props.getData && props.getData(value);
    setValue(value);
  };

  useEffect(() => {
    options();
  }, [data]);

  const options = () => {
    let opt = [];

    for (const key in data) {
      if (typeof data[key] === 'object') {
        opt.push({
          label: `${data[key]['name']} (${data[key]['ldap']})`,
          value: data[key]['ldap'],
        });
      }
    }
    setOpts(opt);
  };

  return (
    <Select
      // showSearch
      value={Value}
      mode={'multiple'}
      defaultActiveFirstOption={false}
      showArrow
      notFoundContent={'请输入'}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      dropdownMatchSelectWidth={300}
      options={opts}
      {..._.omit(props, ['getData'])}
    ></Select>
  );
};

export default JurisdictionPersonSelect;
