import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Select } from 'antd';
import { queryOrganizatioManager } from '@/utils/api/common';

const ExternalPersonSelect = props => {
  const [data, setData] = useState([]);
  // const [value, setValue] = useState(undefined);
  const [opts, setOpts] = useState([]);

  useEffect(() => {
    setOpts(props.detailVal);
  }, [props.detailVal]);

  const handleSearch = _.debounce(value => {
    if (value) {
      queryOrganizatioManager({
        name: value,
        entity: props.entity,
      }).then(res => {
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

  const options = () => {
    let opt = [];

    for (const key in data) {
      if (typeof data[key] === 'object') {
        opt.push({
          label: `${data[key]['nameInDidi']} (${data[key]['name']})`,
          value: data[key]['nameInDidi'],
        });
      }
    }
    setOpts(opt);
  };

  return (
    <Select
      // showSearch
      // value={value}
      defaultActiveFirstOption={false}
      showArrow
      notFoundContent={'相关管理员为空'}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      dropdownMatchSelectWidth={300}
      options={opts}
      {..._.omit(props, ['setManagerName'])}
    ></Select>
  );
};

export default ExternalPersonSelect;
